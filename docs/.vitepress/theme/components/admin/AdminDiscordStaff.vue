<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{
  user?: any;
}>();

const NAV = [
  { href: "/admin/discord-bot", label: "Overview", icon: "lucide:bot" },
  { href: "/admin/discord-bot/tickets", label: "Tickete", icon: "lucide:ticket" },
  { href: "/admin/discord-bot/staff", label: "Staff", icon: "lucide:users", active: true },
  { href: "/admin/discord-bot/watchlist", label: "Watchlist", icon: "lucide:eye" },
  { href: "/admin/discord-bot/role-trackers", label: "Role Trackers", icon: "lucide:radio" },
  { href: "/admin/discord-bot/modules", label: "Module", icon: "lucide:cpu" },
];

interface StaffMember {
  id?: number;
  user_id: string;
  name: string;
  channel_posted_id?: string | null;
  channel_resolved_id?: string | null;
  tickets_resolved: number;
  last_resolved_at?: string | null;
  avatar_url?: string;
  verdicts?: {
    curat: number;
    codat: number;
    insuficient: number;
    deleted: number;
  };
  avg_close_time_mins?: number | null;
  success_rate?: number | null;
  watchlist_count?: number;
  recent_activity?: Array<{ id: string; name: string; verdict: string | null }>;
}

const staff = ref<StaffMember[]>([]);
const loading = ref(true);

// Actions state
const deletingId = ref<string | null>(null);
const msg = ref<{ type: "success" | "error"; text: string } | null>(null);

// Search
const search = ref("");

// Expand state
const expandedAdmin = ref<string | null>(null);

// Add form state
const showAddForm = ref(false);
const newAdminId = ref("");
const newAdminName = ref("");
const isAdding = ref(false);

async function fetchStaff() {
  loading.value = true;
  try {
    const res = await fetch("/api/admin/discord-bot/staff");
    if (res.ok) {
      const d = await res.json();
      const sorted = (d.staff || []).sort((a: StaffMember, b: StaffMember) => b.tickets_resolved - a.tickets_resolved);
      staff.value = sorted;
    }
  } catch {}
  loading.value = false;
}

onMounted(() => {
  fetchStaff();
});

async function handleDelete(user_id: string, name: string) {
  if (!confirm(`Ești sigur că vrei să elimini pe ${name} din sistem?\nBotul nu îi va mai contoriza ticketele, iar camerele lui vor trebui șterse manual.`)) return;
  deletingId.value = user_id;
  try {
    const res = await fetch("/api/admin/discord-bot/staff", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    if (res.ok) {
      msg.value = { type: "success", text: `${name} eliminat din sistem.` };
      fetchStaff();
    } else {
      msg.value = { type: "error", text: "Eroare la ștergere." };
    }
  } catch {
    msg.value = { type: "error", text: "Eroare de conexiune." };
  }
  deletingId.value = null;
  setTimeout(() => { msg.value = null; }, 3000);
}

async function handleAddAdmin() {
  if (!newAdminId.value || !newAdminName.value) return;
  isAdding.value = true;
  try {
    const res = await fetch("/api/admin/discord-bot/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: newAdminId.value, name: newAdminName.value }),
    });
    if (res.ok) {
      msg.value = { type: "success", text: `${newAdminName.value} a fost adăugat. Sincronizarea cu botul este live.` };
      newAdminId.value = "";
      newAdminName.value = "";
      showAddForm.value = false;
      fetchStaff();
    } else if (res.status === 409) {
      msg.value = { type: "error", text: "Acest Discord ID este deja configurat." };
    } else {
      msg.value = { type: "error", text: "Eroare la adăugare." };
    }
  } catch {
    msg.value = { type: "error", text: "Eroare de conexiune." };
  }
  isAdding.value = false;
  setTimeout(() => { msg.value = null; }, 3000);
}

const maxTickets = computed(() => staff.value[0]?.tickets_resolved || 1);

const filteredStaff = computed(() =>
  staff.value.filter(s =>
    s.name.toLowerCase().includes(search.value.toLowerCase()) ||
    s.user_id.includes(search.value)
  )
);

function toggleAdminExpand(userId: string) {
  expandedAdmin.value = expandedAdmin.value === userId ? null : userId;
}

function showNotice(msg: string) {
  if (typeof window !== 'undefined') {
    window.alert(msg);
  }
}
</script>

<template>
  <div class="admin-page-container">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">DISCORD BOT · STAFF</div>
        <h1 class="admin-page-title">Management Staff</h1>
        <p class="admin-page-description">Sincronizare LIVE cu botul Discord. Adminii de aici pot procesa tickete.</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button
          @click="showAddForm = !showAddForm"
          class="admin-btn admin-btn--primary"
          style="padding: 8px 14px;"
        >
          <Icon icon="lucide:plus" width="14" height="14" />
          <span>Adaugă Admin</span>
        </button>
        <button
          @click="fetchStaff"
          class="admin-btn admin-btn--secondary"
          :disabled="loading"
          style="padding: 8px 14px;"
        >
          <Icon icon="lucide:refresh-cw" width="14" height="14" :class="{ 'admin-icon-spin': loading }" />
          <span>Reîncarcă</span>
        </button>
      </div>
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

    <!-- Alert message -->
    <div
      v-if="msg"
      class="admin-alert-box admin-alert-spaced"
      :class="msg.type === 'success' ? 'admin-alert-box--success' : 'admin-alert-box--danger'"
    >
      <Icon :icon="msg.type === 'success' ? 'lucide:check-circle-2' : 'lucide:x-circle'" width="14" height="14" />
      <span>{{ msg.text }}</span>
    </div>

    <!-- Add Admin Form Panel -->
    <div v-if="showAddForm" class="admin-card staff-add-card" style="margin-bottom: 20px;">
      <div class="admin-card-header" style="padding: 14px 18px;">
        <div class="admin-flex-label">
          <div class="admin-card-icon-box admin-card-icon-box--emerald">
            <Icon icon="lucide:users" width="16" height="16" class="admin-text-emerald" />
          </div>
          <div>
            <h2 class="admin-card-title admin-text-emerald">Adaugă Admin Nou</h2>
            <p style="font-size: 0.7rem; color: var(--color-text-tertiary); margin-top: 1px;">
              Adminul va fi instant sincronizat. Camerele personale vor trebui setate de bot.
            </p>
          </div>
        </div>
        <button @click="showAddForm = false" class="discord-bot-action-btn" title="Închide">
          <Icon icon="lucide:x-circle" width="14" height="14" />
        </button>
      </div>
      <div class="admin-card-body" style="padding: 18px;">
        <form @submit.prevent="handleAddAdmin" class="staff-add-form">
          <div class="staff-add-form-group">
            <label>Nume Admin / Nickname</label>
            <input
              type="text"
              v-model="newAdminName"
              placeholder="ex: iannC"
              required
              class="admin-input-field staff-add-input"
            />
          </div>
          <div class="staff-add-form-group">
            <label>Discord User ID (Ex: 371621920162185216)</label>
            <input
              type="text"
              v-model="newAdminId"
              placeholder="ID-ul numeric Discord"
              required
              class="admin-input-field staff-add-input"
              pattern="[0-9]{17,20}"
              title="Un ID Discord valid este format din 17-20 cifre"
            />
          </div>
          <div class="staff-add-form-actions">
            <button type="submit" class="admin-btn admin-btn--primary" :disabled="isAdding">
              <Icon :icon="isAdding ? 'lucide:refresh-cw' : 'lucide:plus'" width="14" height="14" :class="{ 'admin-icon-spin': isAdding }" />
              <span>Salvează Admin</span>
            </button>
          </div>
        </form>
        <div class="staff-add-info-note">
          <Icon icon="lucide:info" width="13" height="13" />
          <span>Pentru a crea automat camerele <code>demo-postate</code> și <code>demo-raspunsuri</code>, rulează comanda <code>/setup_staff</code> sau <code>/init_admin_logs</code> direct de pe serverul de Discord după adăugare.</span>
        </div>
      </div>
    </div>

    <!-- KPI Row -->
    <div v-if="!loading && staff.length > 0" class="overview-kpi-row" style="margin-bottom: 20px;">
      <div class="overview-kpi-card">
        <div class="overview-kpi-icon overview-kpi-icon--modules">
          <Icon icon="lucide:users" width="16" height="16" />
        </div>
        <div class="overview-kpi-body">
          <span class="overview-kpi-val">{{ staff.length }}</span>
          <span class="overview-kpi-lbl">Total Admini</span>
        </div>
      </div>
      <div class="overview-kpi-card">
        <div class="overview-kpi-icon overview-kpi-icon--timer">
          <Icon icon="lucide:check-circle-2" width="16" height="16" />
        </div>
        <div class="overview-kpi-body">
          <span class="overview-kpi-val">{{ staff.filter(s => s.channel_posted_id && s.channel_resolved_id).length }}</span>
          <span class="overview-kpi-lbl">Complet Configurați</span>
        </div>
      </div>
      <div class="overview-kpi-card">
        <div class="overview-kpi-icon overview-kpi-icon--rate">
          <Icon icon="lucide:trophy" width="16" height="16" />
        </div>
        <div class="overview-kpi-body">
          <span class="overview-kpi-val">{{ staff.reduce((acc, s) => acc + s.tickets_resolved, 0) }}</span>
          <span class="overview-kpi-lbl">Tickete Soluționate</span>
        </div>
      </div>
      <div class="overview-kpi-card">
        <div class="overview-kpi-icon overview-kpi-icon--deleted">
          <Icon icon="lucide:shield-alert" width="16" height="16" />
        </div>
        <div class="overview-kpi-body">
          <span class="overview-kpi-val">{{ staff.filter(s => !s.channel_posted_id || !s.channel_resolved_id).length }}</span>
          <span class="overview-kpi-lbl">Necesită Atenție</span>
        </div>
      </div>
    </div>

    <!-- Tools Row (Search) -->
    <div class="admin-filters-bar" style="margin-bottom: 16px;">
      <div class="admin-search-input-wrap" style="max-width: 300px;">
        <Icon icon="lucide:search" width="14" height="14" class="admin-search-icon" />
        <input
          type="text"
          class="admin-search-input"
          placeholder="Caută admin după nume sau ID..."
          v-model="search"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="admin-profile-loading-wrapper">
      <div class="admin-profile-loading-content">
        <Icon icon="lucide:refresh-cw" width="28" height="28" class="admin-icon-spin" />
        <span class="admin-profile-loading-text">Se încarcă staff...</span>
      </div>
    </div>

    <!-- Staff Grid -->
    <div v-else class="discord-bot-staff-grid">
      <div v-if="filteredStaff.length === 0" class="admin-alert-box admin-alert-box--danger" style="grid-column: 1 / -1;">
        Niciun admin găsit.
      </div>
      <div
        v-for="(member, idx) in filteredStaff"
        :key="member.user_id"
        class="discord-bot-staff-card-wrap"
      >
        <div
          class="discord-bot-staff-card"
          :class="{
            'discord-bot-staff-card--gold': (!search && idx === 0),
            'discord-bot-staff-card--silver': (!search && idx === 1),
            'discord-bot-staff-card--bronze': (!search && idx === 2)
          }"
          @click="toggleAdminExpand(member.user_id)"
          style="cursor: pointer;"
        >
          <div class="discord-bot-staff-rank">
            <span v-if="!search && idx === 0" title="Locul 1">
              <Icon icon="lucide:trophy" width="16" height="16" style="color: #f59e0b;" />
            </span>
            <span v-else-if="!search && idx === 1" title="Locul 2">
              <Icon icon="lucide:trophy" width="16" height="16" style="color: #94a3b8;" />
            </span>
            <span v-else-if="!search && idx === 2" title="Locul 3">
              <Icon icon="lucide:trophy" width="16" height="16" style="color: #b45309;" />
            </span>
            <span v-else-if="!search" class="discord-bot-staff-rank-num">#{{ idx + 1 }}</span>
          </div>

          <div v-if="member.avatar_url" class="discord-bot-staff-avatar">
            <img :src="member.avatar_url" :alt="member.name" />
          </div>

          <div class="discord-bot-staff-info">
            <span class="discord-bot-staff-name">{{ member.name }}</span>
            <code class="discord-bot-staff-id">{{ member.user_id }}</code>

            <div class="discord-bot-staff-channels" style="margin-top: 6px;">
              <span
                class="admin-perm-tag"
                :class="(member.channel_posted_id && member.channel_resolved_id) ? 'admin-perm-tag--emerald' : 'admin-perm-tag--rose'"
              >
                {{ (member.channel_posted_id && member.channel_resolved_id) ? "Camere Sync OK" : "Camere Nesetate" }}
              </span>
            </div>
          </div>

          <div class="discord-bot-staff-bar-col">
            <div class="discord-bot-staff-bar-track">
              <div
                class="discord-bot-staff-bar-fill"
                :style="{ width: `${Math.max(4, (member.tickets_resolved / maxTickets) * 100)}%` }"
              />
            </div>
            <span class="discord-bot-staff-ticket-count">{{ member.tickets_resolved }} tickete închise</span>
            <span v-if="member.last_resolved_at" class="discord-bot-staff-last">
              Ultimul: {{ new Date(member.last_resolved_at).toLocaleDateString("ro-RO") }}
            </span>
            <span v-else class="discord-bot-staff-last" style="opacity: 0.5;">
              Fără activitate
            </span>
          </div>

          <button
            class="discord-bot-action-btn discord-bot-action-btn--delete"
            :disabled="deletingId === member.user_id"
            @click.stop="handleDelete(member.user_id, member.name)"
            title="Elimină din sistem"
          >
            <Icon
              :icon="deletingId === member.user_id ? 'lucide:refresh-cw' : 'lucide:trash-2'"
              width="12"
              height="12"
              :class="{ 'admin-icon-spin': deletingId === member.user_id }"
            />
          </button>
          <button class="discord-bot-action-btn" @click.stop="toggleAdminExpand(member.user_id)">
            <Icon :icon="expandedAdmin === member.user_id ? 'lucide:chevron-up' : 'lucide:chevron-down'" width="14" height="14" />
          </button>
        </div>

        <!-- Expanded Details Panel -->
        <div
          v-if="expandedAdmin === member.user_id"
          class="discord-bot-staff-details discord-bot-staff-details--premium"
        >
          <div class="staff-details-grid staff-details-grid--kpis">
            <!-- KPI 1: Timp de reacție -->
            <div class="staff-kpi-card">
              <div class="staff-kpi-icon staff-kpi-icon--blue">
                <Icon icon="lucide:timer" width="16" height="16" />
              </div>
              <div class="staff-kpi-info">
                <span class="staff-kpi-label">Timp Răspuns</span>
                <span class="staff-kpi-value">
                  <template v-if="member.avg_close_time_mins != null">
                    {{ member.avg_close_time_mins < 60 ? `${member.avg_close_time_mins} min` : `${(member.avg_close_time_mins / 60).toFixed(1)}h` }}
                  </template>
                  <template v-else>N/A</template>
                </span>
              </div>
            </div>

            <!-- KPI 2: Acuratețe -->
            <div class="staff-kpi-card">
              <div class="staff-kpi-icon staff-kpi-icon--purple">
                <Icon icon="lucide:target" width="16" height="16" />
              </div>
              <div class="staff-kpi-info">
                <span class="staff-kpi-label">Acuratețe</span>
                <span class="staff-kpi-value">
                  <span
                    v-if="member.success_rate != null"
                    :style="{
                      color: member.success_rate >= 80 ? 'hsl(160 55% 45%)' : member.success_rate < 50 ? 'hsl(350 65% 55%)' : 'inherit'
                    }"
                  >
                    {{ member.success_rate }}%
                  </span>
                  <template v-else>N/A</template>
                </span>
              </div>
            </div>

            <!-- KPI 3: Watchlist -->
            <div class="staff-kpi-card">
              <div class="staff-kpi-icon staff-kpi-icon--orange">
                <Icon icon="lucide:eye" width="16" height="16" />
              </div>
              <div class="staff-kpi-info">
                <span class="staff-kpi-label">Suspecți Watchlist</span>
                <span class="staff-kpi-value">{{ member.watchlist_count || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="staff-details-separator" />

          <div class="staff-details-layout">
            <div class="staff-details-col">
              <h4 class="staff-details-title">
                <Icon icon="lucide:activity" width="14" height="14" /> Breakdown Verdicte
              </h4>
              <div class="staff-details-grid">
                <div class="staff-detail-item">
                  <div class="staff-detail-icon staff-detail-icon--green">
                    <Icon icon="lucide:check-circle" width="14" height="14" />
                  </div>
                  <div class="staff-detail-info">
                    <span class="staff-detail-label">Dovezi Curat</span>
                    <span class="staff-detail-value">{{ member.verdicts?.curat || 0 }}</span>
                  </div>
                </div>
                <div class="staff-detail-item">
                  <div class="staff-detail-icon staff-detail-icon--red">
                    <Icon icon="lucide:shield-alert" width="14" height="14" />
                  </div>
                  <div class="staff-detail-info">
                    <span class="staff-detail-label">Banuri (Codat)</span>
                    <span class="staff-detail-value">{{ member.verdicts?.codat || 0 }}</span>
                  </div>
                </div>
                <div class="staff-detail-item">
                  <div class="staff-detail-icon staff-detail-icon--yellow">
                    <Icon icon="lucide:alert-triangle" width="14" height="14" />
                  </div>
                  <div class="staff-detail-info">
                    <span class="staff-detail-label">Insuficiente</span>
                    <span class="staff-detail-value">{{ member.verdicts?.insuficient || 0 }}</span>
                  </div>
                </div>
                <div class="staff-detail-item">
                  <div class="staff-detail-icon staff-detail-icon--gray">
                    <Icon icon="lucide:trash-2" width="14" height="14" />
                  </div>
                  <div class="staff-detail-info">
                    <span class="staff-detail-label">Tickete Șterse</span>
                    <span class="staff-detail-value">{{ member.verdicts?.deleted || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="staff-details-col">
              <h4 class="staff-details-title">
                <Icon icon="lucide:file-text" width="14" height="14" /> Istoric Recenți
              </h4>
              <div v-if="member.recent_activity && member.recent_activity.length > 0" class="staff-recent-stream">
                <div
                  v-for="(ticket, i) in member.recent_activity"
                  :key="i"
                  class="staff-stream-item"
                >
                  <div
                    class="staff-stream-dot"
                    :class="{
                      'dot-green': ticket.verdict === 'curat',
                      'dot-red': ticket.verdict === 'codat',
                      'dot-yellow': ticket.verdict === 'insuficient',
                      'dot-gray': !ticket.verdict
                    }"
                  />
                  <div class="staff-stream-content">
                    <a :href="`/admin/discord-bot/tickets?search=${ticket.id}`" class="staff-stream-name">
                      {{ ticket.name }}
                    </a>
                    <span class="staff-stream-verdict">{{ ticket.verdict ? ticket.verdict.toUpperCase() : "ȘTERS" }}</span>
                  </div>
                </div>
              </div>
              <span v-else class="staff-details-empty">Fără activitate recentă.</span>
            </div>
          </div>

          <div class="staff-details-separator" />
          <div class="staff-details-actions">
            <button
              class="admin-btn admin-btn--secondary admin-btn--sm"
              @click="showNotice('Platforma web nu dispune momentan de un websocket HTTP deschis către Discord Bot pentru a trimite comenzi directe. Vă rugăm să folosiți comanda /setup_staff direct pe serverul de Discord.')"
            >
              <Icon icon="lucide:refresh-cw" width="12" height="12" />
              <span>Force Sync Camere</span>
            </button>
            <button
              class="admin-btn admin-btn--danger-outline admin-btn--sm"
              @click="showNotice('Urmează a fi implementat în Discord Bot.')"
            >
              <Icon icon="lucide:lock" width="12" height="12" />
              <span>Suspendă Acces</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
