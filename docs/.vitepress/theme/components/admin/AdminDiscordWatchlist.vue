<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{
  user?: any;
}>();

const NAV = [
  { href: "/admin/discord-bot", label: "Overview", icon: "lucide:bot" },
  { href: "/admin/discord-bot/tickets", label: "Tickete", icon: "lucide:ticket" },
  { href: "/admin/discord-bot/staff", label: "Staff", icon: "lucide:users" },
  { href: "/admin/discord-bot/watchlist", label: "Watchlist", icon: "lucide:eye", active: true },
  { href: "/admin/discord-bot/role-trackers", label: "Role Trackers", icon: "lucide:radio" },
  { href: "/admin/discord-bot/modules", label: "Module", icon: "lucide:cpu" },
];

interface WatchlistEntry {
  id?: number;
  steam_id: string;
  added_by: string;
  original_ticket_id?: string | null;
  created_at?: string;
}

const entries = ref<WatchlistEntry[]>([]);
const loading = ref(true);
const deletingId = ref<string | null>(null);
const msg = ref<{ type: "success" | "error"; text: string } | null>(null);

async function fetchWatchlist() {
  loading.value = true;
  try {
    const res = await fetch("/api/admin/discord-bot/watchlist");
    if (res.ok) {
      const d = await res.json();
      entries.value = d.watchlist || [];
    }
  } catch {}
  loading.value = false;
}

onMounted(() => {
  fetchWatchlist();
});

async function handleDelete(steam_id: string) {
  if (!confirm(`Elimini ${steam_id} din Watchlist?`)) return;
  deletingId.value = steam_id;
  try {
    const res = await fetch("/api/admin/discord-bot/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_id }),
    });
    if (res.ok) {
      msg.value = { type: "success", text: `${steam_id} eliminat din Watchlist.` };
      fetchWatchlist();
    } else {
      msg.value = { type: "error", text: "Eroare la ștergere." };
    }
  } catch {
    msg.value = { type: "error", text: "Eroare de conexiune." };
  }
  deletingId.value = null;
  setTimeout(() => { msg.value = null; }, 3000);
}
</script>

<template>
  <div class="admin-page-container">
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">DISCORD BOT · WATCHLIST</div>
        <h1 class="admin-page-title">Suspecți Watchlist</h1>
        <p class="admin-page-description">
          Jucători marcați ca suspecți de staff prin sistemul de tickete.
          <strong v-if="entries.length > 0"> {{ entries.length }} intrări active.</strong>
        </p>
      </div>
      <button @click="fetchWatchlist" class="admin-btn admin-btn--secondary" :disabled="loading">
        <Icon icon="lucide:refresh-cw" width="14" height="14" :class="{ 'admin-icon-spin': loading }" />
      </button>
    </div>

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

    <div
      v-if="msg"
      class="admin-alert-box admin-alert-spaced"
      :class="msg.type === 'success' ? 'admin-alert-box--success' : 'admin-alert-box--danger'"
    >
      <Icon :icon="msg.type === 'success' ? 'lucide:check-circle-2' : 'lucide:x-circle'" width="14" height="14" />
      <span>{{ msg.text }}</span>
    </div>

    <div v-if="loading" class="admin-profile-loading-wrapper">
      <div class="admin-profile-loading-content">
        <Icon icon="lucide:refresh-cw" width="28" height="28" class="admin-icon-spin" />
        <span class="admin-profile-loading-text">Se încarcă watchlist...</span>
      </div>
    </div>

    <div v-else class="admin-card" style="margin-top: 4px;">
      <div class="admin-card-body" style="padding: 0;">
        <table class="discord-bot-table discord-bot-table--full">
          <thead>
            <tr>
              <th>SteamID64</th>
              <th>Adăugat de (Discord ID)</th>
              <th>Ticket Original</th>
              <th>Data</th>
              <th>Link Steam</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="entries.length === 0">
              <td colspan="6" class="discord-bot-table-empty">Watchlist-ul este gol.</td>
            </tr>
            <tr v-for="e in entries" :key="e.steam_id" class="discord-bot-table-row">
              <td><code class="discord-bot-ticket-id">{{ e.steam_id }}</code></td>
              <td><code style="font-size: 0.7rem; opacity: 0.7;">{{ e.added_by }}</code></td>
              <td>
                <code v-if="e.original_ticket_id" class="discord-bot-ticket-id">{{ e.original_ticket_id }}</code>
                <template v-else>—</template>
              </td>
              <td style="font-size: 0.75rem; opacity: 0.7;">
                {{ e.created_at ? new Date(e.created_at).toLocaleDateString("ro-RO") : "—" }}
              </td>
              <td>
                <a
                  v-if="e.steam_id && e.steam_id !== 'Necunoscut'"
                  :href="`https://steamcommunity.com/profiles/${e.steam_id}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="discord-bot-external-link"
                >
                  <Icon icon="lucide:external-link" width="12" height="12" /> Steam
                </a>
                <template v-else>—</template>
              </td>
              <td>
                <button
                  class="discord-bot-action-btn discord-bot-action-btn--delete"
                  :disabled="deletingId === e.steam_id"
                  @click="handleDelete(e.steam_id)"
                  title="Elimină din Watchlist"
                >
                  <Icon icon="lucide:trash-2" width="12" height="12" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
