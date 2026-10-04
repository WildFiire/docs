<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

const props = defineProps<{
  currentUsername?: string;
}>();

const unreadCount = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

async function fetchUnreadCount() {
  try {
    const data = await api('/api/admin/notifications?scope=unread&limit=1');
    unreadCount.value = Number(data?.unreadCount ?? 0);
  } catch {
    // Silently ignore
  }
}

onMounted(() => {
  fetchUnreadCount();
  timer = setInterval(fetchUnreadCount, 60_000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const titleText = computed(() => {
  if (unreadCount.value > 0) {
    const noun = unreadCount.value === 1 ? 'notificare necitită' : 'notificări necitite';
    return `${unreadCount.value} ${noun} — Deschide Inbox`;
  }
  return 'Inbox Notificări';
});

const ariaText = computed(() => {
  return `Inbox Admin${unreadCount.value > 0 ? ` — ${unreadCount.value} necitite` : ''}`;
});
</script>

<template>
  <a
    href="/admin/inbox"
    id="admin-notifications-bell"
    class="admin-notify-bell-btn"
    :title="titleText"
    :aria-label="ariaText"
  >
    <Icon
      icon="lucide:bell"
      width="16"
      height="16"
      class="admin-notify-bell-icon"
      :class="{ 'admin-notify-bell-icon--ringing': unreadCount > 0 }"
    />
    <span
      v-if="unreadCount > 0"
      class="admin-notify-counter-badge"
      :aria-label="`${unreadCount} notificări necitite`"
    >
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </span>
  </a>
</template>
