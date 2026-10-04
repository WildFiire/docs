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
  { href: "/admin/discord-bot/watchlist", label: "Watchlist", icon: "lucide:eye" },
  { href: "/admin/discord-bot/role-trackers", label: "Role Trackers", icon: "lucide:radio", active: true },
  { href: "/admin/discord-bot/modules", label: "Module", icon: "lucide:cpu" },
];

interface RoleTracker {
  id: number;
  guild_id: string;
  role_id: string;
  channel_id: string;
}

const trackers = ref<RoleTracker[]>([]);
const loading = ref(true);
const deletingId = ref<number | null>(null);
const msg = ref<{ type: "success" | "error"; text: string } | null>(null);

async function fetchTrackers() {
  loading.value = true;
  try {
    const res = await fetch("/api/admin/discord-bot/role-trackers");
    if (res.ok) {
      const d = await res.json();
      trackers.value = d.trackers || [];
    }
  } catch {}
  loading.value = false;
}

onMounted(() => {
  fetchTrackers();
});

async function handleDelete(id: number) {
  if (!confirm("Ștergi acest tracker din DB? Canalul vocal de pe Discord va rămâne neschimbat.")) return;
  deletingId.value = id;
  try {
    const res = await fetch("/api/admin/discord-bot/role-trackers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      msg.value = { type: "success", text: "Tracker eliminat din baza de date." };
      fetchTrackers();
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
        <div class="admin-breadcrumb-tag">DISCORD BOT · ROLE TRACKERS</div>
        <h1 class="admin-page-title">Role Trackers</h1>
        <p class="admin-page-description">
          Canale vocale automatizate care afișează numărul de membri cu un anumit rol. Actualizare automată la fiecare 15 minute.
        </p>
      </div>
      <button @click="fetchTrackers" class="admin-btn admin-btn--secondary" :disabled="loading">
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
        <span class="admin-profile-loading-text">Se încarcă trackere...</span>
      </div>
    </div>

    <div v-else class="admin-card" style="margin-top: 4px;">
      <div class="admin-card-body" style="padding: 0;">
        <table class="discord-bot-table discord-bot-table--full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guild ID</th>
              <th>Role ID</th>
              <th>Canal Vocal ID</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="trackers.length === 0">
              <td colspan="5" class="discord-bot-table-empty">Niciun role tracker configurat.</td>
            </tr>
            <tr v-for="t in trackers" :key="t.id" class="discord-bot-table-row">
              <td><code class="discord-bot-ticket-id">#{{ t.id }}</code></td>
              <td><code style="font-size: 0.7rem; opacity: 0.7;">{{ t.guild_id }}</code></td>
              <td><code style="font-size: 0.7rem; opacity: 0.7;">{{ t.role_id }}</code></td>
              <td><code style="font-size: 0.7rem; opacity: 0.7;">{{ t.channel_id }}</code></td>
              <td>
                <button
                  class="discord-bot-action-btn discord-bot-action-btn--delete"
                  :disabled="deletingId === t.id"
                  @click="handleDelete(t.id)"
                  title="Șterge Tracker"
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
