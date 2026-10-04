<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{
  user?: any;
}>();

// ── Types ───────────────────────────────────────────────────────────────────
interface RecentTicket {
  ticket_id: string;
  suspect_name: string | null;
  suspect_steamid: string | null;
  status: string;
  created_at: string;
  closed_at?: string | null;
  verdict: string | null;
  user_id: string;
  closed_by?: string | null;
}

interface TopCloser {
  user_id: string;
  count: number;
}

interface BotOverviewData {
  stats: {
    total_tickets: number;
    active_tickets: number;
    archived_tickets: number;
    pending_evidence: number;
    deleted_tickets: number;
    total_admins: number;
    watchlist_entries: number;
    role_trackers: number;
    avg_close_time_hours: number | null;
    verdict_rate_pct: number | null;
  };
  verdicts: { curat: number; codat: number; insuficient: number };
  recent_tickets: RecentTicket[];
  top_closers: TopCloser[];
}

// ── Constants ───────────────────────────────────────────────────────────────
const NAV = [
  { href: "/admin/discord-bot", label: "Overview", icon: "lucide:bot", active: true },
  { href: "/admin/discord-bot/tickets", label: "Tickete", icon: "lucide:ticket" },
  { href: "/admin/discord-bot/staff", label: "Staff", icon: "lucide:users" },
  { href: "/admin/discord-bot/watchlist", label: "Watchlist", icon: "lucide:eye" },
  { href: "/admin/discord-bot/role-trackers", label: "Role Trackers", icon: "lucide:radio" },
  { href: "/admin/discord-bot/modules", label: "Module", icon: "lucide:cpu" },
];

const BOT_MODULES = [
  { name: "Ticket System", files: "buttonHandler, modalHandler, closeHandler", status: "ACTIV", color: "emerald", icon: "lucide:ticket", desc: "Deschidere, gestionare și arhivare tickete demo anti-cheat" },
  { name: "AI Handler", files: "aiHandler.js (30KB)", status: "ACTIV", color: "purple", icon: "lucide:cpu", desc: "Răspunsuri AI Gemini în canalul dedicat adminilor" },
  { name: "Staff Setup", files: "staffSetupHandler", status: "ACTIV", color: "blue", icon: "lucide:users", desc: "Configurare admini cu camere personale (postate + rezolvate)" },
  { name: "Role Tracker", files: "trackerHandler + cron 15min", status: "ACTIV", color: "cyan", icon: "lucide:radio", desc: "Update automat canale vocale cu numărul de membri pe rol" },
  { name: "Watchlist", files: "watchlistHandler", status: "ACTIV", color: "amber", icon: "lucide:eye", desc: "Adăugare suspecți pe lista neagră cu dovezi" },
  { name: "Welcome", files: "welcomeHandler", status: "ACTIV", color: "teal", icon: "lucide:message-square", desc: "Mesaje bun venit pentru membrii noi ai serverului" },
  { name: "Ghost Ping", files: "ghostPingHandler", status: "ACTIV", color: "rose", icon: "lucide:zap", desc: "Detectare și alertare ping-uri șterse (ghost pings)" },
  { name: "Reminder Cron", files: "reminder.js", status: "ACTIV", color: "indigo", icon: "lucide:clock", desc: "Remindere automate programate pentru staff" },
  { name: "Morning Briefing", files: "morningBriefing.js", status: "ACTIV", color: "orange", icon: "lucide:bar-chart-3", desc: "Raport zilnic dimineața cu activitatea serverului" },
  { name: "Burnout Detector", files: "burnoutDetector.js", status: "ACTIV", color: "rose", icon: "lucide:shield", desc: "Alertă automată la activitate excesivă a staff-ului" },
];

const WORKFLOW_STEPS = [
  { num: 1, color: "blue", icon: "lucide:play-circle", title: "Deschidere", desc: "Jucătorul apasă butonul și completează formularul modal (nume, motiv, SteamID, link demo)." },
  { num: 2, color: "cyan", icon: "lucide:zap", title: "Generare Canal", desc: "Botul creează un canal privat, trimite ping Staff-ului și verifică profilul Steam (VAC, ore CS2, vârstă cont)." },
  { num: 3, color: "purple", icon: "lucide:message-square-more", title: "Dezbatere", desc: "Adminii analizează demo-ul. Fiecare mesaj al unui admin se oglindește automat pe canalul personal (Live Mirror)." },
  { num: 4, color: "amber", icon: "lucide:badge-check", title: "Decizie", desc: "Un admin apasa \"Optiuni Ticket\", alege verdictul (Curat / Codat / Insuficient) si lasa un motiv obligatoriu." },
  { num: 5, color: "emerald", icon: "lucide:folder-archive", title: "Arhivare", desc: "Botul șterge canalul, generează transcript HTML și îl trimite în #transcripts-log și pe DM jucătorului." },
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
      { name: "/view_tickets", desc: "Embed cu tabel detaliat: camerele fiecărui admin și starea lor." },
      { name: "/staff_status", desc: "Sumar general: câți admini sunt configurați corect." },
    ],
  },
  {
    group: "Tickete & Mentenanță", color: "amber",
    commands: [
      { name: "/setup-tickets", desc: "Generează panoul public cu butonul de Deschide Demo pe canalul #reclamatii-demo." },
      { name: "/reset_tickets", desc: "Șterge tot istoricul ticketelor (resetează numărătoarea)." },
      { name: "/export_logs", desc: "Exportă log-urile sau date specifice din baza de date." },
      { name: "/setup_tracker & /sync_tracker", desc: "Gestionează sistemul de tracking activitate / invoiri staff." },
      { name: "/view [player]", desc: "Vizualizează istoricul complet Steam + tickete al unui jucător." },
      { name: "/init_admin_logs", desc: "Inițializează structura de canale personale pentru un admin nou." },
    ],
  },
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

// ── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: "discord-bot-status-badge discord-bot-status-badge--active",
    pending_evidence: "discord-bot-status-badge discord-bot-status-badge--pending",
    archived: "discord-bot-status-badge discord-bot-status-badge--archived",
    deleted: "discord-bot-status-badge discord-bot-status-badge--deleted",
  };
  const label: Record<string, string> = {
    active: "Activ",
    pending_evidence: "Dovezi",
    archived: "Arhivat",
    deleted: "Șters",
  };
  return { cls: map[status] || "discord-bot-status-badge", label: label[status] || status };
}

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
  if (/^7656119[0-9]{10}$/.test(steamid)) return `https://steamcommunity.com/profiles/${steamid}`;
  return null;
}

function downloadTicketData(t: RecentTicket) {
  const steamUrl = getSteamProfileUrl(t.suspect_steamid);
  const payload = {
    meta: { exported_at: new Date().toISOString(), exported_by: "WildFire Admin Panel", source: "discord-bot-supabase" },
    ticket: { ticket_id: t.ticket_id, status: t.status, verdict: t.verdict, verdict_label: t.verdict ? (VERDICT_LABELS[t.verdict] || t.verdict) : null },
    suspect: {
      name: t.suspect_name, steam_id: t.suspect_steamid, steam_profile: steamUrl,
      cs2tracker: t.suspect_steamid && /^7656119[0-9]{10}$/.test(t.suspect_steamid) ? `https://cs2tracker.gg/stats/${t.suspect_steamid}` : null,
      leetify: t.suspect_steamid && /^7656119[0-9]{10}$/.test(t.suspect_steamid) ? `https://leetify.com/app/profile/${t.suspect_steamid}` : null,
    },
    discord: { opened_by_user_id: t.user_id, closed_by_user_id: t.closed_by ?? null },
    timeline: {
      created_at: t.created_at, closed_at: t.closed_at ?? null,
      duration_ms: t.closed_at ? new Date(t.closed_at).getTime() - new Date(t.created_at).getTime() : null,
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

// ── State ───────────────────────────────────────────────────────────────────
const data = ref<BotOverviewData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const expandedId = ref<string | null>(null);
const showWorkflow = ref(false);
const showCommands = ref(false);
const showModules = ref(true);

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch("/api/admin/discord-bot/overview");
    if (!res.ok) {
      const d = await res.json();
      error.value = d.message || d.error || "Eroare la încărcarea datelor.";
      return;
    }
    data.value = await res.json();
  } catch {
    error.value = "Eroare de conexiune la API.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}
</script>

<template>
  <div class="admin-page-container">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">DISCORD BOT CONTROL CENTER</div>
        <h1 class="admin-page-title">WildFire Bot Dashboard</h1>
        <p class="admin-page-description">
          Gestionare completă a botului Discord: tickete anti-cheat, staff, watchlist și module active.
        </p>
      </div>
      <button @click="fetchData" class="admin-btn admin-btn--secondary" :disabled="loading">
        <Icon icon="lucide:refresh-cw" width="14" height="14" :class="{ 'admin-icon-spin': loading }" />
        <span>Reîncarcă</span>
      </button>
    </div>

    <!-- Sub-navigation -->
    <nav class="discord-bot-subnav">
      <a
        v-for="link in NAV"
        :key="link.href"
        :href="link.href"
        class="discord-bot-subnav-item"
        :class="{ 'discord-bot-subnav-item--active': link.active }"
      >
        <Icon :icon="link.icon" width="14" height="14" />
        <span>{{ link.label }}</span>
      </a>
    </nav>

    <!-- Error Alert -->
    <div v-if="error" class="admin-alert-box admin-alert-box--danger admin-alert-spaced">
      <Icon icon="lucide:x-circle" width="16" height="16" />
      <span>{{ error }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !data" class="admin-profile-loading-wrapper">
      <div class="admin-profile-loading-content">
        <Icon icon="lucide:refresh-cw" width="28" height="28" class="admin-icon-spin" />
        <span class="admin-profile-loading-text">Se încarcă statisticile botului...</span>
      </div>
    </div>

    <!-- Loaded Data -->
    <template v-if="data">
      <!-- ── Stats Grid ─────────────────────────────────────── -->
      <div class="discord-bot-stats-grid">
        <div class="discord-bot-stat-card discord-bot-stat-card--blue">
          <div class="discord-bot-stat-icon">
            <Icon icon="lucide:ticket" width="20" height="20" />
          </div>
          <div class="discord-bot-stat-body">
            <span class="discord-bot-stat-value">{{ data.stats.total_tickets }}</span>
            <span class="discord-bot-stat-label">Total Tickete</span>
            <span class="discord-bot-stat-sub">{{ data.stats.active_tickets }} active</span>
          </div>
        </div>

        <div class="discord-bot-stat-card discord-bot-stat-card--emerald">
          <div class="discord-bot-stat-icon">
            <Icon icon="lucide:check-circle-2" width="20" height="20" />
          </div>
          <div class="discord-bot-stat-body">
            <span class="discord-bot-stat-value">{{ data.stats.archived_tickets }}</span>
            <span class="discord-bot-stat-label">Arhivate</span>
            <span class="discord-bot-stat-sub">{{ data.stats.verdict_rate_pct ?? "—" }}% cu verdict</span>
          </div>
        </div>

        <div class="discord-bot-stat-card discord-bot-stat-card--amber">
          <div class="discord-bot-stat-icon">
            <Icon icon="lucide:clock" width="20" height="20" />
          </div>
          <div class="discord-bot-stat-body">
            <span class="discord-bot-stat-value">{{ data.stats.pending_evidence }}</span>
            <span class="discord-bot-stat-label">Dovezi Lipsă</span>
            <span class="discord-bot-stat-sub">în așteptare 24h</span>
          </div>
        </div>

        <div class="discord-bot-stat-card discord-bot-stat-card--purple">
          <div class="discord-bot-stat-icon">
            <Icon icon="lucide:users" width="20" height="20" />
          </div>
          <div class="discord-bot-stat-body">
            <span class="discord-bot-stat-value">{{ data.stats.total_admins }}</span>
            <span class="discord-bot-stat-label">Admini Configurați</span>
            <span class="discord-bot-stat-sub">cu camere personale</span>
          </div>
        </div>

        <div class="discord-bot-stat-card discord-bot-stat-card--rose">
          <div class="discord-bot-stat-icon">
            <Icon icon="lucide:eye" width="20" height="20" />
          </div>
          <div class="discord-bot-stat-body">
            <span class="discord-bot-stat-value">{{ data.stats.watchlist_entries }}</span>
            <span class="discord-bot-stat-label">Suspecți Watchlist</span>
            <span class="discord-bot-stat-sub">sub supraveghere</span>
          </div>
        </div>

        <div class="discord-bot-stat-card discord-bot-stat-card--cyan">
          <div class="discord-bot-stat-icon">
            <Icon icon="lucide:radio" width="20" height="20" />
          </div>
          <div class="discord-bot-stat-body">
            <span class="discord-bot-stat-value">{{ data.stats.role_trackers }}</span>
            <span class="discord-bot-stat-label">Role Trackers</span>
            <span class="discord-bot-stat-sub">update la 15min</span>
          </div>
        </div>
      </div>

      <!-- ── KPI Row ────────────────────────────────────────── -->
      <div class="overview-kpi-row">
        <div class="overview-kpi-card">
          <div class="overview-kpi-icon overview-kpi-icon--timer">
            <Icon icon="lucide:timer" width="16" height="16" />
          </div>
          <div class="overview-kpi-body">
            <span class="overview-kpi-val">{{ data.stats.avg_close_time_hours != null ? `${data.stats.avg_close_time_hours}h` : "—" }}</span>
            <span class="overview-kpi-lbl">Timp mediu rezolvare</span>
          </div>
        </div>

        <div class="overview-kpi-card">
          <div class="overview-kpi-icon overview-kpi-icon--rate">
            <Icon icon="lucide:trending-up" width="16" height="16" />
          </div>
          <div class="overview-kpi-body">
            <span class="overview-kpi-val">{{ data.stats.verdict_rate_pct != null ? `${data.stats.verdict_rate_pct}%` : "—" }}</span>
            <span class="overview-kpi-lbl">Rată verdict</span>
          </div>
        </div>

        <div class="overview-kpi-card">
          <div class="overview-kpi-icon overview-kpi-icon--deleted">
            <Icon icon="lucide:x-circle" width="16" height="16" />
          </div>
          <div class="overview-kpi-body">
            <span class="overview-kpi-val">{{ data.stats.deleted_tickets }}</span>
            <span class="overview-kpi-lbl">Tickete șterse</span>
          </div>
        </div>

        <div class="overview-kpi-card">
          <div class="overview-kpi-icon overview-kpi-icon--modules">
            <Icon icon="lucide:activity" width="16" height="16" />
          </div>
          <div class="overview-kpi-body">
            <span class="overview-kpi-val">{{ BOT_MODULES.length }}</span>
            <span class="overview-kpi-lbl">Module active</span>
          </div>
        </div>
      </div>

      <!-- ── Main 2-col grid ────────────────────────────────── -->
      <div class="discord-bot-main-grid">
        <!-- Verdict Breakdown -->
        <div class="admin-card">
          <div class="admin-card-header">
            <div class="admin-flex-label">
              <div class="admin-card-icon-box admin-card-icon-box--emerald">
                <Icon icon="lucide:bar-chart-3" width="16" height="16" class="admin-text-emerald" />
              </div>
              <div>
                <h2 class="admin-card-title admin-text-emerald">Verdict Breakdown</h2>
                <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 1px;">
                  Distribuția verdictelor pe tickete arhivate
                </p>
              </div>
            </div>
          </div>
          <div class="admin-card-body">
            <div class="discord-bot-verdict-bars">
              <div
                v-for="v in [
                  { key: 'curat', label: 'Jucător Curat', color: 'emerald', count: data.verdicts.curat },
                  { key: 'codat', label: 'Jucător Codat', color: 'rose', count: data.verdicts.codat },
                  { key: 'insuficient', label: 'Insuficient', color: 'amber', count: data.verdicts.insuficient },
                ]"
                :key="v.key"
                class="discord-bot-verdict-row"
              >
                <span class="discord-bot-verdict-label">{{ v.label }}</span>
                <div class="discord-bot-verdict-bar-track">
                  <div
                    class="discord-bot-verdict-bar-fill"
                    :class="`discord-bot-verdict-bar-fill--${v.color}`"
                    :style="{
                      width: `${(data.verdicts.curat + data.verdicts.codat + data.verdicts.insuficient) > 0
                        ? Math.round((v.count / (data.verdicts.curat + data.verdicts.codat + data.verdicts.insuficient)) * 100)
                        : 0}%`
                    }"
                  />
                </div>
                <span class="discord-bot-verdict-count">{{ v.count }}</span>
                <span class="overview-verdict-pct">
                  {{ (data.verdicts.curat + data.verdicts.codat + data.verdicts.insuficient) > 0
                    ? Math.round((v.count / (data.verdicts.curat + data.verdicts.codat + data.verdicts.insuficient)) * 100)
                    : 0 }}%
                </span>
              </div>
            </div>

            <!-- Top closers leaderboard -->
            <div v-if="data.top_closers.length > 0" class="overview-top-closers">
              <p class="overview-top-closers-title">
                <Icon icon="lucide:trophy" width="12" height="12" />Top Closers
              </p>
              <div
                v-for="(c, idx) in data.top_closers"
                :key="c.user_id"
                class="overview-top-closer-row"
              >
                <span class="overview-top-closer-rank" :class="`overview-top-closer-rank--${idx + 1}`">
                  #{{ idx + 1 }}
                </span>
                <code class="overview-top-closer-id">{{ c.user_id }}</code>
                <span class="overview-top-closer-count">{{ c.count }} tickete</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Tickets — expandable -->
        <div class="admin-card">
          <div class="admin-card-header">
            <div class="admin-flex-label">
              <div class="admin-card-icon-box">
                <Icon icon="lucide:ticket" width="16" height="16" />
              </div>
              <div>
                <h2 class="admin-card-title">Tickete Recente</h2>
                <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 1px;">
                  Ultimele 10 — click pe un rând pentru detalii
                </p>
              </div>
            </div>
            <a href="/admin/discord-bot/tickets" class="admin-btn admin-btn--secondary" style="font-size: 0.72rem; padding: 4px 10px;">
              Vezi toate
            </a>
          </div>
          <div class="admin-card-body" style="padding: 0;">
            <div style="overflow-x: auto;">
              <table class="discord-bot-table" style="min-width: 480px;">
                <thead>
                  <tr>
                    <th style="width: 22px;"></th>
                    <th>ID</th>
                    <th>Suspect</th>
                    <th>Status</th>
                    <th>Verdict</th>
                    <th>Durată</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="data.recent_tickets.length === 0">
                    <td colspan="6" class="discord-bot-table-empty">Niciun ticket găsit.</td>
                  </tr>
                  <template v-for="t in data.recent_tickets" :key="t.ticket_id">
                    <tr
                      class="discord-bot-table-row tickets-table-row"
                      :class="{ 'tickets-table-row--expanded': expandedId === t.ticket_id }"
                      @click="toggleExpand(t.ticket_id)"
                      style="cursor: pointer;"
                    >
                      <td style="padding-right: 0;">
                        <span class="tickets-expand-icon">
                          <Icon :icon="expandedId === t.ticket_id ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="12" height="12" />
                        </span>
                      </td>
                      <td><code class="discord-bot-ticket-id">{{ t.ticket_id }}</code></td>
                      <td><span class="tickets-suspect-name">{{ t.suspect_name || "—" }}</span></td>
                      <td>
                        <span :class="statusBadge(t.status).cls">{{ statusBadge(t.status).label }}</span>
                      </td>
                      <td>
                        <span
                          v-if="t.verdict"
                          class="discord-bot-verdict-pill"
                          :class="VERDICT_COLORS[t.verdict] || ''"
                        >
                          {{ VERDICT_LABELS[t.verdict] || t.verdict }}
                        </span>
                        <span v-else style="color: var(--color-text-tertiary); font-size: 0.75rem;">—</span>
                      </td>
                      <td>
                        <span class="tickets-duration-badge">
                          <Icon icon="lucide:clock" width="10" height="10" />
                          {{ formatDuration(t.created_at, t.closed_at) }}
                        </span>
                      </td>
                    </tr>

                    <!-- Expanded detail -->
                    <tr v-if="expandedId === t.ticket_id" class="tickets-expanded-row">
                      <td colspan="6" style="padding: 0;">
                        <div class="tickets-detail-panel">
                          <div class="overview-expanded-grid">
                            <!-- IDs -->
                            <div class="tickets-detail-section">
                              <p class="tickets-detail-section-title">
                                <Icon icon="lucide:hash" width="11" height="11" />Identificatori
                              </p>
                              <div class="tickets-detail-fields">
                                <div class="tickets-detail-field">
                                  <span class="tickets-detail-label">Ticket ID</span>
                                  <code class="discord-bot-ticket-id">{{ t.ticket_id }}</code>
                                </div>
                                <div class="tickets-detail-field">
                                  <span class="tickets-detail-label">Deschis de</span>
                                  <code class="tickets-detail-code">{{ t.user_id }}</code>
                                </div>
                                <div v-if="t.closed_by" class="tickets-detail-field">
                                  <span class="tickets-detail-label">Închis de</span>
                                  <code class="tickets-detail-code">{{ t.closed_by }}</code>
                                </div>
                              </div>
                            </div>

                            <!-- Suspect -->
                            <div class="tickets-detail-section">
                              <p class="tickets-detail-section-title">
                                <Icon icon="lucide:hash" width="11" height="11" />Suspect
                              </p>
                              <div class="tickets-detail-fields">
                                <div class="tickets-detail-field">
                                  <span class="tickets-detail-label">Nume</span>
                                  <span class="tickets-detail-value">{{ t.suspect_name || "—" }}</span>
                                </div>
                                <div class="tickets-detail-field">
                                  <span class="tickets-detail-label">SteamID</span>
                                  <span style="display: flex; align-items: center; gap: 6px;">
                                    <code class="tickets-detail-code" style="font-size: 0.65rem;">{{ t.suspect_steamid || "—" }}</code>
                                    <a
                                      v-if="getSteamProfileUrl(t.suspect_steamid)"
                                      :href="getSteamProfileUrl(t.suspect_steamid)!"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="tickets-ext-link"
                                    >
                                      <Icon icon="lucide:external-link" width="10" height="10" />
                                    </a>
                                  </span>
                                </div>
                                <div
                                  v-if="t.suspect_steamid && /^7656119[0-9]{10}$/.test(t.suspect_steamid)"
                                  class="tickets-detail-field"
                                >
                                  <span class="tickets-detail-label">Investigații</span>
                                  <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                                    <a
                                      :href="`https://cs2tracker.gg/stats/${t.suspect_steamid}`"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="tickets-tracker-link tickets-tracker-link--blue"
                                    >
                                      <Icon icon="lucide:external-link" width="9" height="9" />CS2Tracker
                                    </a>
                                    <a
                                      :href="`https://leetify.com/app/profile/${t.suspect_steamid}`"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="tickets-tracker-link tickets-tracker-link--green"
                                    >
                                      <Icon icon="lucide:external-link" width="9" height="9" />Leetify
                                    </a>
                                    <a
                                      :href="`https://faceitfinder.com/profile/${t.suspect_steamid}`"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="tickets-tracker-link tickets-tracker-link--orange"
                                    >
                                      <Icon icon="lucide:external-link" width="9" height="9" />Faceit
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Dates -->
                            <div class="tickets-detail-section">
                              <p class="tickets-detail-section-title">
                                <Icon icon="lucide:clock" width="11" height="11" />Timeline
                              </p>
                              <div class="tickets-detail-fields">
                                <div class="tickets-detail-field">
                                  <span class="tickets-detail-label">Deschis</span>
                                  <span class="tickets-detail-value" style="font-size: 0.76rem;">{{ new Date(t.created_at).toLocaleString("ro-RO") }}</span>
                                </div>
                                <div v-if="t.closed_at" class="tickets-detail-field">
                                  <span class="tickets-detail-label">{{ t.status === "archived" ? "Arhivat" : "Închis" }}</span>
                                  <span class="tickets-detail-value" style="font-size: 0.76rem;">{{ new Date(t.closed_at).toLocaleString("ro-RO") }}</span>
                                </div>
                                <div class="tickets-detail-field">
                                  <span class="tickets-detail-label">Durată totală</span>
                                  <span class="tickets-detail-value">{{ formatDuration(t.created_at, t.closed_at) }}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Footer -->
                          <div class="tickets-detail-footer">
                            <button class="tickets-transcript-btn" @click="downloadTicketData(t)">
                              <Icon icon="lucide:download" width="12" height="12" />
                              <span>Descarcă date ticket (.json)</span>
                            </button>
                            <a href="/admin/discord-bot/tickets" class="tickets-transcript-btn" style="text-decoration: none;">
                              <Icon icon="lucide:ticket" width="12" height="12" />
                              <span>Gestionează ticketul</span>
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Modules Grid — collapsible ──────────────────────── -->
      <div class="admin-card tickets-collapsible-card" style="margin-top: 16px;">
        <button class="tickets-collapsible-header" @click="showModules = !showModules" id="modules-toggle-btn">
          <div class="admin-flex-label">
            <div class="admin-card-icon-box admin-card-icon-box--indigo">
              <Icon icon="lucide:cpu" width="16" height="16" class="admin-text-indigo" />
            </div>
            <div>
              <h2 class="admin-card-title admin-text-indigo">Module Bot ({{ BOT_MODULES.length }} active)</h2>
              <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 1px;">Toate modulele și handler-ele botului</p>
            </div>
          </div>
          <Icon :icon="showModules ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="16" height="16" style="color: var(--color-text-tertiary);" />
        </button>
        <div v-if="showModules" class="discord-bot-modules-grid">
          <div
            v-for="mod in BOT_MODULES"
            :key="mod.name"
            class="discord-bot-module-card"
            :class="`discord-bot-module-card--${mod.color}`"
          >
            <div class="discord-bot-module-header">
              <Icon :icon="mod.icon" width="16" height="16" />
              <span class="discord-bot-module-name">{{ mod.name }}</span>
              <span class="discord-bot-module-badge">ACTIV</span>
            </div>
            <p class="discord-bot-module-desc">{{ mod.desc }}</p>
            <code class="discord-bot-module-file">{{ mod.files }}</code>
          </div>
        </div>
      </div>

      <!-- ── Workflow — collapsible ──────────────────────────── -->
      <div class="admin-card tickets-collapsible-card" style="margin-top: 12px;">
        <button class="tickets-collapsible-header" @click="showWorkflow = !showWorkflow" id="workflow-toggle-btn">
          <div class="admin-flex-label">
            <div class="admin-card-icon-box" style="background: hsl(220 80% 55% / 0.12); color: hsl(220 80% 70%);">
              <Icon icon="lucide:arrow-right" width="15" height="15" />
            </div>
            <div>
              <h2 class="admin-card-title" style="color: hsl(220 80% 70%);">Workflow Ticket (5 pași)</h2>
              <p style="font-size: 0.72rem; color: var(--color-text-tertiary); margin-top: 1px;">Cum funcționează un ticket de la deschidere până la arhivare</p>
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

      <!-- ── Slash Commands — collapsible ────────────────────── -->
      <div class="admin-card tickets-collapsible-card" style="margin-top: 12px;">
        <button class="tickets-collapsible-header" @click="showCommands = !showCommands" id="commands-toggle-btn">
          <div class="admin-flex-label">
            <div class="admin-card-icon-box" style="background: hsl(160 60% 40% / 0.12); color: hsl(160 60% 60%);">
              <Icon icon="lucide:terminal" width="15" height="15" />
            </div>
            <div>
              <h2 class="admin-card-title" style="color: hsl(160 60% 65%);">Slash Commands Referință</h2>
              <p style="font-size: 0.72rem; color: var(--color-text-tertiary); margin-top: 1px;">Toate comenzile / ale botului (doar Administratori)</p>
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
    </template>
  </div>
</template>
