<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{
  user?: any;
}>();

const NAV = [
  { href: "/admin/discord-bot", label: "Overview", icon: "lucide:bot" },
  { href: "/admin/discord-bot/tickets", label: "Tickete", icon: "lucide:ticket", active: true },
  { href: "/admin/discord-bot/staff", label: "Staff", icon: "lucide:users" },
  { href: "/admin/discord-bot/watchlist", label: "Watchlist", icon: "lucide:eye" },
  { href: "/admin/discord-bot/role-trackers", label: "Role Trackers", icon: "lucide:radio" },
  { href: "/admin/discord-bot/modules", label: "Module", icon: "lucide:cpu" },
];

type TicketStatus = "all" | "active" | "archived" | "pending_evidence" | "deleted";

interface TicketRow {
  ticket_id: string;
  user_id: string;
  channel_id: string;
  status: string;
  created_at: string;
  closed_at?: string | null;
  closed_by?: string | null;
  suspect_steamid?: string | null;
  suspect_name?: string | null;
  verdict?: string | null;
  evidence_requested_at?: string | null;
}

interface Stats {
  total: number;
  active: number;
  archived: number;
  pending_evidence: number;
  deleted: number;
  avg_close_time_hours?: number | null;
  verdict_rate_pct?: number | null;
}

const STATUS_FILTERS: { value: TicketStatus; label: string }[] = [
  { value: "all", label: "Toate" },
  { value: "active", label: "Active" },
  { value: "pending_evidence", label: "Dovezi" },
  { value: "archived", label: "Arhivate" },
  { value: "deleted", label: "Șterse" },
];

const VERDICT_COLORS: Record<string, string> = {
  curat: "discord-bot-verdict-pill--emerald",
  codat: "discord-bot-verdict-pill--rose",
  insuficient: "discord-bot-verdict-pill--amber",
};

const VERDICT_LABELS: Record<string, string> = {
  curat: "Curat",
  codat: "Codat",
  insuficient: "Insuficient",
};

const WORKFLOW_STEPS = [
  {
    num: 1, color: "blue", icon: "lucide:play-circle",
    title: "Deschidere",
    desc: "Jucătorul apasă butonul și completează formularul modal (nume, motiv, SteamID, link demo).",
  },
  {
    num: 2, color: "cyan", icon: "lucide:zap",
    title: "Generare Canal",
    desc: "Botul creează un canal privat, trimite ping Staff-ului și verifică profilul Steam (VAC, ore CS2, vârstă cont).",
  },
  {
    num: 3, color: "purple", icon: "lucide:message-square-more",
    title: "Dezbatere",
    desc: "Adminii analizează demo-ul. Fiecare mesaj al unui admin se oglindește automat pe canalul personal (Live Mirror).",
  },
  {
    num: 4, color: "amber", icon: "lucide:badge-check",
    title: "Decizie",
    desc: "Un admin apasă \"Opțiuni Ticket\", alege verdictul (Curat / Codat / Insuficient) și lasă un motiv obligatoriu.",
  },
  {
    num: 5, color: "emerald", icon: "lucide:folder-archive",
    title: "Arhivare",
    desc: "Botul șterge canalul, generează transcript HTML și îl trimite în #transcripts-log și pe DM jucătorului.",
  },
];

const SLASH_COMMANDS = [
  {
    group: "Configurarea Staff-ului", color: "blue",
    commands: [
      { name: "/setup_staff_auto [role]", desc: "Adaugă automat toți membrii cu un anumit rol în baza de date." },
      { name: "/scan_channels [role]", desc: "Scanează serverul și leagă automat camerele demo-postate-* și demo-raspunsuri-* de fiecare admin." },
      { name: "/setup_staff", desc: "Panou interactiv manual pentru a seta camerele personale ale unui admin." },
      { name: "/remove_staff [admin]", desc: "Șterge un admin din baza de date (cu autocompletare)." },
    ],
  },
  {
    group: "Monitorizare & Status", color: "emerald",
    commands: [
      { name: "/view_tickets", desc: "Embed cu tabel detaliat: camerele fiecărui admin și starea lor (OK / lipsă)." },
      { name: "/staff_status", desc: "Sumar general: câți admini sunt configurați corect." },
    ],
  },
  {
    group: "Tickete & Mentenanță", color: "amber",
    commands: [
      { name: "/setup-tickets", desc: "Generează panoul public cu butonul de Deschide Demo pe canalul #reclamatii-demo." },
      { name: "/reset_tickets", desc: "Șterge tot istoricul ticketelor (resetează numărătoarea la demos-username-1)." },
      { name: "/export_logs", desc: "Exportă log-urile sau date specifice din baza de date." },
      { name: "/setup_tracker & /sync_tracker", desc: "Gestionează sistemul de tracking activitate / invoiri staff." },
      { name: "/view [player]", desc: "Vizualizează istoricul complet Steam + tickete al unui jucător." },
      { name: "/init_admin_logs", desc: "Inițializează structura de canale personale pentru un admin nou." },
    ],
  },
];

function formatDuration(createdAt: string, closedAt?: string | null): string {
  const end = closedAt ? new Date(closedAt) : new Date();
  const ms = end.getTime() - new Date(createdAt).getTime();
  if (ms < 0) return "—";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (h >= 48) return `${Math.floor(h / 24)}z`;
  if (h >= 1) return `${h}h ${m}m`;
  return `${m}m`;
}

function getSteamProfileUrl(steamid?: string | null): string | null {
  if (!steamid) return null;
  if (/^7656119[0-9]{10}$/.test(steamid)) {
    return `https://steamcommunity.com/profiles/${steamid}`;
  }
  return null;
}

const tickets = ref<TicketRow[]>([]);
const stats = ref<Stats>({ total: 0, active: 0, archived: 0, pending_evidence: 0, deleted: 0 });
const loading = ref(true);
const search = ref("");
const status = ref<TicketStatus>("all");
const page = ref(1);
const total = ref(0);
const actionLoading = ref<string | null>(null);
const msg = ref<{ type: "success" | "error"; text: string } | null>(null);
const expandedId = ref<string | null>(null);
const showWorkflow = ref(false);
const showCommands = ref(false);
const LIMIT = 25;

async function fetchTickets() {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      status: status.value,
      search: search.value,
      page: String(page.value),
      limit: String(LIMIT)
    });
    const res = await fetch(`/api/admin/discord-bot/tickets?${params}`);
    if (res.ok) {
      const d = await res.json();
      tickets.value = d.tickets || [];
      total.value = d.total || 0;
      stats.value = d.stats || {};
    }
  } catch {}
  loading.value = false;
}

watch([status, page], () => {
  fetchTickets();
});

let searchDebounce: ReturnType<typeof setTimeout> | null = null;
watch(search, () => {
  page.value = 1;
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    fetchTickets();
  }, 300);
});

onMounted(() => {
  fetchTickets();
});

async function handleStatusUpdate(ticket_id: string, newStatus: string) {
  actionLoading.value = ticket_id;
  try {
    const res = await fetch("/api/admin/discord-bot/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id, status: newStatus }),
    });
    if (res.ok) {
      msg.value = { type: "success", text: `Ticket ${ticket_id} actualizat la "${newStatus}".` };
      fetchTickets();
    } else {
      msg.value = { type: "error", text: "Eroare la actualizare." };
    }
  } catch {
    msg.value = { type: "error", text: "Eroare de conexiune." };
  }
  actionLoading.value = null;
  setTimeout(() => { msg.value = null; }, 3000);
}

const totalPages = computed(() => Math.ceil(total.value / LIMIT));

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

function downloadTicketData(t: TicketRow) {
  const verdictLabel = t.verdict ? (VERDICT_LABELS[t.verdict] || t.verdict) : null;
  const steamUrl = getSteamProfileUrl(t.suspect_steamid);
  const payload = {
    meta: {
      exported_at: new Date().toISOString(),
      exported_by: "WildFire Admin Panel",
      source: "discord-bot-supabase",
    },
    ticket: {
      ticket_id: t.ticket_id,
      status: t.status,
      verdict: t.verdict,
      verdict_label: verdictLabel,
    },
    suspect: {
      name: t.suspect_name,
      steam_id: t.suspect_steamid,
      steam_profile: steamUrl,
      cs2tracker: t.suspect_steamid && /^7656119[0-9]{10}$/.test(t.suspect_steamid)
        ? `https://cs2tracker.gg/stats/${t.suspect_steamid}` : null,
      leetify: t.suspect_steamid && /^7656119[0-9]{10}$/.test(t.suspect_steamid)
        ? `https://leetify.com/app/profile/${t.suspect_steamid}` : null,
    },
    discord: {
      opened_by_user_id: t.user_id,
      channel_id: t.channel_id,
      closed_by_user_id: t.closed_by,
    },
    timeline: {
      created_at: t.created_at,
      evidence_requested_at: t.evidence_requested_at ?? null,
      closed_at: t.closed_at ?? null,
      duration_ms: t.closed_at
        ? new Date(t.closed_at).getTime() - new Date(t.created_at).getTime()
        : null,
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ticket-${t.ticket_id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function selectPill(label: string) {
  const map: Record<string, TicketStatus> = {
    Total: "all",
    Active: "active",
    Dovezi: "pending_evidence",
    Arhivate: "archived",
    Șterse: "deleted"
  };
  status.value = map[label] || "all";
  page.value = 1;
}
</script>

<template>
  <div class="admin-page-container">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">DISCORD BOT · TICKETE</div>
        <h1 class="admin-page-title">Gestionare Tickete Demo</h1>
        <p class="admin-page-description">Vizualizează, inspectează și gestionează toate ticketele anti-cheat din baza de date a botului.</p>
      </div>
      <button @click="fetchTickets" class="admin-btn admin-btn--secondary" :disabled="loading">
        <Icon icon="lucide:refresh-cw" width="14" height="14" :class="{ 'admin-icon-spin': loading }" />
        <span>Reîncarcă</span>
      </button>
    </div>

    <!-- Sub-navigation -->
    <nav class="discord-bot-subnav">
      <a
        v-for="l in NAV"
        :key="l.href"
        :href="l.href"
        class="discord-bot-subnav-item"
        :class="{ 'discord-bot-subnav-item--active': l.active }"
      >
        <Icon :icon="l.icon" width="14" height="14" />
        <span>{{ l.label }}</span>
      </a>
    </nav>

    <!-- Enhanced Stats Panel -->
    <div class="tickets-stats-row">
      <!-- Mini stat pills -->
      <div class="tickets-stat-pills">
        <button
          v-for="s in [
            { label: 'Total', value: stats.total, color: 'blue' },
            { label: 'Active', value: stats.active, color: 'emerald' },
            { label: 'Dovezi', value: stats.pending_evidence, color: 'amber' },
            { label: 'Arhivate', value: stats.archived, color: 'purple' },
            { label: 'Șterse', value: stats.deleted, color: 'zinc' },
          ]"
          :key="s.label"
          class="tickets-stat-pill"
          :class="[
            `tickets-stat-pill--${s.color}`,
            { 'tickets-stat-pill--selected': status === s.label.toLowerCase() || (s.label === 'Dovezi' && status === 'pending_evidence') }
          ]"
          @click="selectPill(s.label)"
        >
          <span class="tickets-stat-pill-val">{{ s.value ?? "—" }}</span>
          <span class="tickets-stat-pill-lbl">{{ s.label }}</span>
        </button>
      </div>

      <!-- Metric cards -->
      <div class="tickets-metric-cards">
        <div class="tickets-metric-card">
          <div class="tickets-metric-icon tickets-metric-icon--timer">
            <Icon icon="lucide:timer" width="16" height="16" />
          </div>
          <div class="tickets-metric-body">
            <span class="tickets-metric-val">
              {{ stats.avg_close_time_hours != null ? `${stats.avg_close_time_hours}h` : "—" }}
            </span>
            <span class="tickets-metric-lbl">Timp mediu rezolvare</span>
          </div>
        </div>
        <div class="tickets-metric-card">
          <div class="tickets-metric-icon tickets-metric-icon--verdict">
            <Icon icon="lucide:bar-chart-3" width="16" height="16" />
          </div>
          <div class="tickets-metric-body">
            <span class="tickets-metric-val">
              {{ stats.verdict_rate_pct != null ? `${stats.verdict_rate_pct}%` : "—" }}
            </span>
            <span class="tickets-metric-lbl">Rată verdict</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert message -->
    <div
      v-if="msg"
      class="admin-alert-box admin-alert-spaced"
      :class="msg.type === 'success' ? 'admin-alert-box--success' : 'admin-alert-box--danger'"
    >
      <Icon :icon="msg.type === 'success' ? 'lucide:check-circle-2' : 'lucide:x-circle'" width="14" height="14" />
      <span>{{ msg.text }}</span>
    </div>

    <!-- Filters -->
    <div class="discord-bot-filters">
      <div class="admin-search-wrapper" style="flex: 1; min-width: 220px;">
        <Icon icon="lucide:search" width="14" height="14" class="admin-search-icon" />
        <input
          class="admin-search-input"
          placeholder="Caută suspect, SteamID, Ticket ID..."
          v-model="search"
        />
      </div>
      <div class="discord-bot-status-filters">
        <button
          v-for="f in STATUS_FILTERS"
          :key="f.value"
          class="discord-bot-filter-btn"
          :class="{ 'discord-bot-filter-btn--active': status === f.value }"
          @click="status = f.value; page = 1;"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="admin-card" style="margin-top: 14px;">
      <div class="admin-card-body" style="padding: 0;">
        <div style="overflow-x: auto;">
          <table class="discord-bot-table discord-bot-table--full">
            <thead>
              <tr>
                <th style="width: 28px;"></th>
                <th>Ticket ID</th>
                <th>Suspect</th>
                <th>SteamID</th>
                <th>Status</th>
                <th>Verdict</th>
                <th>Durată</th>
                <th>Data</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="9" class="discord-bot-table-empty">
                  <Icon icon="lucide:refresh-cw" width="14" height="14" class="admin-icon-spin" style="margin-right: 8px;" />Se încarcă...
                </td>
              </tr>
              <tr v-else-if="tickets.length === 0">
                <td colspan="9" class="discord-bot-table-empty">Niciun ticket găsit.</td>
              </tr>
              <template v-else v-for="t in tickets" :key="t.ticket_id">
                <tr
                  class="discord-bot-table-row tickets-table-row"
                  :class="{ 'tickets-table-row--expanded': expandedId === t.ticket_id }"
                  @click="toggleExpand(t.ticket_id)"
                  style="cursor: pointer;"
                >
                  <td style="padding-right: 0;">
                    <span class="tickets-expand-icon">
                      <Icon :icon="expandedId === t.ticket_id ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="13" height="13" />
                    </span>
                  </td>
                  <td><code class="discord-bot-ticket-id">{{ t.ticket_id }}</code></td>
                  <td><span class="tickets-suspect-name">{{ t.suspect_name || "—" }}</span></td>
                  <td>
                    <code v-if="t.suspect_steamid" class="tickets-steamid-code">{{ t.suspect_steamid }}</code>
                    <template v-else>—</template>
                  </td>
                  <td>
                    <span
                      class="discord-bot-status-badge"
                      :class="`discord-bot-status-badge--${t.status === 'pending_evidence' ? 'pending' : t.status}`"
                    >
                      {{ t.status === 'active' ? 'Activ' : t.status === 'pending_evidence' ? 'Dovezi' : t.status === 'archived' ? 'Arhivat' : 'Șters' }}
                    </span>
                  </td>
                  <td>
                    <span
                      v-if="t.verdict"
                      class="discord-bot-verdict-pill"
                      :class="VERDICT_COLORS[t.verdict] || ''"
                    >
                      {{ VERDICT_LABELS[t.verdict] || t.verdict }}
                    </span>
                    <span v-else style="color: var(--color-text-tertiary); font-size: 0.78rem;">—</span>
                  </td>
                  <td>
                    <span class="tickets-duration-badge">
                      <Icon icon="lucide:clock" width="10" height="10" />
                      {{ formatDuration(t.created_at, t.closed_at) }}
                    </span>
                  </td>
                  <td style="font-size: 0.75rem; color: var(--color-text-secondary);">
                    {{ new Date(t.created_at).toLocaleDateString("ro-RO") }}
                  </td>
                  <td @click.stop>
                    <div style="display: flex; gap: 4px;">
                      <button
                        v-if="t.status === 'deleted'"
                        class="discord-bot-action-btn discord-bot-action-btn--restore"
                        :disabled="actionLoading === t.ticket_id"
                        @click="handleStatusUpdate(t.ticket_id, 'active')"
                        title="Restaurează"
                      >
                        <Icon icon="lucide:rotate-ccw" width="12" height="12" />
                      </button>
                      <button
                        v-if="t.status !== 'archived' && t.status !== 'deleted'"
                        class="discord-bot-action-btn discord-bot-action-btn--archive"
                        :disabled="actionLoading === t.ticket_id"
                        @click="handleStatusUpdate(t.ticket_id, 'archived')"
                        title="Arhivează"
                      >
                        <Icon icon="lucide:archive" width="12" height="12" />
                      </button>
                      <button
                        v-if="t.status !== 'deleted'"
                        class="discord-bot-action-btn discord-bot-action-btn--delete"
                        :disabled="actionLoading === t.ticket_id"
                        @click="handleStatusUpdate(t.ticket_id, 'deleted')"
                        title="Șterge"
                      >
                        <Icon icon="lucide:trash-2" width="12" height="12" />
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Expanded detail row -->
                <tr v-if="expandedId === t.ticket_id" class="tickets-expanded-row">
                  <td colspan="9" style="padding: 0;">
                    <div class="tickets-detail-panel">
                      <div class="tickets-detail-grid">
                        <!-- Left: IDs & Meta -->
                        <div class="tickets-detail-section">
                          <p class="tickets-detail-section-title">
                            <Icon icon="lucide:hash" width="12" height="12" />Identificatori
                          </p>
                          <div class="tickets-detail-fields">
                            <div class="tickets-detail-field">
                              <span class="tickets-detail-label">Ticket ID</span>
                              <code class="discord-bot-ticket-id" style="font-size: 0.72rem;">{{ t.ticket_id }}</code>
                            </div>
                            <div class="tickets-detail-field">
                              <span class="tickets-detail-label">Discord User ID</span>
                              <code class="tickets-detail-code">{{ t.user_id }}</code>
                            </div>
                            <div class="tickets-detail-field">
                              <span class="tickets-detail-label">Canal Discord</span>
                              <code class="tickets-detail-code">{{ t.channel_id }}</code>
                            </div>
                            <div v-if="t.closed_by" class="tickets-detail-field">
                              <span class="tickets-detail-label">Închis de</span>
                              <code class="tickets-detail-code">{{ t.closed_by }}</code>
                            </div>
                          </div>
                        </div>

                        <!-- Center: Steam & links -->
                        <div class="tickets-detail-section">
                          <p class="tickets-detail-section-title">
                            <Icon icon="lucide:user-2" width="12" height="12" />Suspect
                          </p>
                          <div class="tickets-detail-fields">
                            <div class="tickets-detail-field">
                              <span class="tickets-detail-label">Nume</span>
                              <span class="tickets-detail-value">{{ t.suspect_name || "—" }}</span>
                            </div>
                            <div class="tickets-detail-field">
                              <span class="tickets-detail-label">SteamID</span>
                              <span style="display: flex; align-items: center; gap: 6px;">
                                <code class="tickets-detail-code">{{ t.suspect_steamid || "—" }}</code>
                                <a
                                  v-if="getSteamProfileUrl(t.suspect_steamid)"
                                  :href="getSteamProfileUrl(t.suspect_steamid)!"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="tickets-ext-link"
                                  title="Steam Profile"
                                >
                                  <Icon icon="lucide:external-link" width="11" height="11" />
                                </a>
                              </span>
                            </div>
                            <div
                              v-if="t.suspect_steamid && /^7656119[0-9]{10}$/.test(t.suspect_steamid)"
                              class="tickets-detail-field"
                            >
                              <span class="tickets-detail-label">Investigații</span>
                              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                <a
                                  :href="`https://cs2tracker.gg/stats/${t.suspect_steamid}`"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="tickets-tracker-link tickets-tracker-link--blue"
                                >
                                  <Icon icon="lucide:external-link" width="10" height="10" />CS2Tracker
                                </a>
                                <a
                                  :href="`https://leetify.com/app/profile/${t.suspect_steamid}`"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="tickets-tracker-link tickets-tracker-link--green"
                                >
                                  <Icon icon="lucide:external-link" width="10" height="10" />Leetify
                                </a>
                                <a
                                  :href="`https://faceitfinder.com/profile/${t.suspect_steamid}`"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="tickets-tracker-link tickets-tracker-link--orange"
                                >
                                  <Icon icon="lucide:external-link" width="10" height="10" />Faceit
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Right: Dates & Timeline -->
                        <div class="tickets-detail-section">
                          <p class="tickets-detail-section-title">
                            <Icon icon="lucide:calendar-days" width="12" height="12" />Timeline
                          </p>
                          <div class="tickets-timeline">
                            <div class="tickets-timeline-step tickets-timeline-step--done">
                              <div class="tickets-timeline-dot" />
                              <div class="tickets-timeline-content">
                                <span class="tickets-timeline-label">Deschis</span>
                                <span class="tickets-timeline-time">
                                  {{ new Date(t.created_at).toLocaleString("ro-RO") }}
                                </span>
                              </div>
                            </div>
                            <div v-if="t.evidence_requested_at" class="tickets-timeline-step tickets-timeline-step--amber">
                              <div class="tickets-timeline-dot" />
                              <div class="tickets-timeline-content">
                                <span class="tickets-timeline-label">Dovezi cerute</span>
                                <span class="tickets-timeline-time">
                                  {{ new Date(t.evidence_requested_at).toLocaleString("ro-RO") }}
                                </span>
                              </div>
                            </div>
                            <div
                              v-if="t.closed_at"
                              class="tickets-timeline-step"
                              :class="t.status === 'archived' ? 'tickets-timeline-step--emerald' : 'tickets-timeline-step--rose'"
                            >
                              <div class="tickets-timeline-dot" />
                              <div class="tickets-timeline-content">
                                <span class="tickets-timeline-label">
                                  {{ t.status === "archived" ? "Arhivat" : "Șters" }}
                                  {{ t.verdict ? ` · ${VERDICT_LABELS[t.verdict] || t.verdict}` : '' }}
                                </span>
                                <span class="tickets-timeline-time">
                                  {{ new Date(t.closed_at).toLocaleString("ro-RO") }}
                                </span>
                              </div>
                            </div>
                            <div v-else class="tickets-timeline-step tickets-timeline-step--future">
                              <div class="tickets-timeline-dot" />
                              <div class="tickets-timeline-content">
                                <span class="tickets-timeline-label">În curs...</span>
                                <span class="tickets-timeline-time">Durată: {{ formatDuration(t.created_at, t.closed_at) }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Download footer -->
                      <div class="tickets-detail-footer">
                        <button
                          class="tickets-transcript-btn"
                          @click="downloadTicketData(t)"
                          title="Descarcă datele ticketului ca JSON"
                        >
                          <Icon icon="lucide:download" width="13" height="13" />
                          <span>Descarcă date ticket (.json)</span>
                        </button>
                        <span class="tickets-detail-note">
                          <Icon icon="lucide:file-text" width="11" height="11" />
                          Transcriptul HTML complet este trimis automat de bot în #transcripts-log și pe DM jucătorului la arhivare.
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="discord-bot-pagination">
          <button @click="page = Math.max(1, page - 1)" :disabled="page === 1" class="discord-bot-page-btn">
            <Icon icon="lucide:chevron-left" width="14" height="14" />
          </button>
          <span class="discord-bot-page-info">Pagina {{ page }} din {{ totalPages }} ({{ total }} total)</span>
          <button @click="page = Math.min(totalPages, page + 1)" :disabled="page === totalPages" class="discord-bot-page-btn">
            <Icon icon="lucide:chevron-right" width="14" height="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- Workflow Section -->
    <div class="admin-card tickets-collapsible-card" style="margin-top: 16px;">
      <button
        class="tickets-collapsible-header"
        @click="showWorkflow = !showWorkflow"
        id="workflow-toggle-btn"
      >
        <div class="admin-flex-label">
          <div class="admin-card-icon-box" style="background: hsl(220 80% 55% / 0.12); color: hsl(220 80% 70%);">
            <Icon icon="lucide:arrow-right" width="15" height="15" />
          </div>
          <div>
            <h2 class="admin-card-title" style="color: hsl(220 80% 70%);">Workflow Ticket (5 pași)</h2>
            <p style="font-size: 0.72rem; color: var(--color-text-tertiary); margin-top: 1px;">
              Cum funcționează un ticket de la deschidere până la arhivare
            </p>
          </div>
        </div>
        <Icon :icon="showWorkflow ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="16" height="16" style="color: var(--color-text-tertiary);" />
      </button>

      <div v-if="showWorkflow" class="admin-card-body" style="padding-top: 0;">
        <div class="tickets-workflow-steps">
          <template v-for="(step, idx) in WORKFLOW_STEPS" :key="step.num">
            <div class="tickets-workflow-step" :class="`tickets-workflow-step--${step.color}`">
              <div class="tickets-workflow-step-num">
                <Icon :icon="step.icon" width="16" height="16" />
              </div>
              <div class="tickets-workflow-step-body">
                <span class="tickets-workflow-step-title">{{ step.title }}</span>
                <span class="tickets-workflow-step-desc">{{ step.desc }}</span>
              </div>
            </div>
            <div v-if="idx < WORKFLOW_STEPS.length - 1" class="tickets-workflow-connector">
              <Icon icon="lucide:arrow-right" width="14" height="14" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Slash Commands Reference -->
    <div class="admin-card tickets-collapsible-card" style="margin-top: 12px;">
      <button
        class="tickets-collapsible-header"
        @click="showCommands = !showCommands"
        id="commands-toggle-btn"
      >
        <div class="admin-flex-label">
          <div class="admin-card-icon-box" style="background: hsl(160 60% 40% / 0.12); color: hsl(160 60% 60%);">
            <Icon icon="lucide:terminal" width="15" height="15" />
          </div>
          <div>
            <h2 class="admin-card-title" style="color: hsl(160 60% 65%);">Slash Commands Referință</h2>
            <p style="font-size: 0.72rem; color: var(--color-text-tertiary); margin-top: 1px;">
              Toate comenzile / ale botului (doar Administratori)
            </p>
          </div>
        </div>
        <Icon :icon="showCommands ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="16" height="16" style="color: var(--color-text-tertiary);" />
      </button>

      <div v-if="showCommands" class="admin-card-body" style="padding-top: 0;">
        <div class="tickets-commands-grid">
          <div
            v-for="group in SLASH_COMMANDS"
            :key="group.group"
            class="tickets-commands-group"
            :class="`tickets-commands-group--${group.color}`"
          >
            <p class="tickets-commands-group-title">{{ group.group }}</p>
            <div v-for="cmd in group.commands" :key="cmd.name" class="tickets-command-item">
              <code class="tickets-command-name">{{ cmd.name }}</code>
              <span class="tickets-command-desc">{{ cmd.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
