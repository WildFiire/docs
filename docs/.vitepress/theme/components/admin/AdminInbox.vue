<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import type { AdminNotification, NotificationCategory, NotificationSeverity } from '../../types/notifications';

interface AdminInboxProps {
  user?: any;
  currentUsername?: string;
}

const props = defineProps<AdminInboxProps>();

type ScopeFilter = 'all' | 'unread' | 'personal' | 'global';
type CategoryFilter = NotificationCategory | 'all';

function stripEmojis(text?: string): string {
  if (!text) return '';
  try {
    const emojiRegex = new RegExp(
      '[\\u{1F300}-\\u{1F9FF}]|[\\u{2600}-\\u{26FF}]|[\\u{2700}-\\u{27BF}]|[\\u{1F600}-\\u{1F64F}]|[\\u{1F680}-\\u{1F6FF}]|[\\u{1F1E0}-\\u{1F1FF}]|[\\u{2300}-\\u{23FF}]|[\\u{2B50}]|[\\u{200D}]|[\\u{FE0F}]',
      'gu'
    );
    return text.replace(emojiRegex, '').trim();
  } catch {
    return text.trim();
  }
}

function timeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Chiar acum';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Acum ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Acum ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Acum ${days}z`;
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  } catch {
    return 'Recent';
  }
}

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; colorClass: string }
> = {
  all: { label: 'Inbox', icon: 'lucide:inbox', colorClass: 'inbox-cat--all' },
  task: { label: 'Sarcini', icon: 'lucide:list-todo', colorClass: 'inbox-cat--task' },
  report: { label: 'Rapoarte', icon: 'lucide:alert-triangle', colorClass: 'inbox-cat--report' },
  feedback: { label: 'Feedback', icon: 'lucide:message-square', colorClass: 'inbox-cat--feedback' },
  security: { label: 'Securitate', icon: 'lucide:shield-alert', colorClass: 'inbox-cat--security' },
  system: { label: 'Sistem', icon: 'lucide:server', colorClass: 'inbox-cat--system' },
  ai: { label: 'AI Engine', icon: 'lucide:sparkles', colorClass: 'inbox-cat--ai' },
  health: { label: 'Doc Health', icon: 'lucide:activity', colorClass: 'inbox-cat--health' },
};

const notifications = ref<AdminNotification[]>([]);
const loading = ref<boolean>(true);
const refreshing = ref<boolean>(false);
const scope = ref<ScopeFilter>('all');
const category = ref<CategoryFilter>('all');
const searchQuery = ref<string>('');
const selectedId = ref<string | null>(null);

const resolvedUsername = computed(() => {
  return (props.currentUsername || props.user?.username || 'admin').toLowerCase().trim();
});

async function fetchNotifications(silent = false) {
  if (!silent) loading.value = true;
  else refreshing.value = true;

  try {
    const res = await fetch('/api/admin/notifications?scope=all&limit=200');
    if (res.ok) {
      const data = await res.json();
      notifications.value = data.notifications || [];
    }
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

onMounted(() => {
  fetchNotifications();
});

function isRead(n: AdminNotification): boolean {
  const user = resolvedUsername.value;
  return Boolean(
    n.readBy?.some(
      (u) => u.toLowerCase().trim() === user || u.trim() === props.currentUsername
    )
  );
}

function isPersonal(n: AdminNotification): boolean {
  return Boolean(
    n.targetUser && n.targetUser.toLowerCase().trim() === resolvedUsername.value
  );
}

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !isRead(n)).length;
});

const countByCategory = computed(() => {
  const map: Partial<Record<NotificationCategory, number>> = {};
  for (const n of notifications.value) {
    if (!isRead(n)) {
      map[n.category] = (map[n.category] ?? 0) + 1;
    }
  }
  return map;
});

const filtered = computed(() => {
  return notifications.value.filter((n) => {
    const read = isRead(n);
    const personal = isPersonal(n);
    const global = !personal;

    if (scope.value === 'unread' && read) return false;
    if (scope.value === 'personal' && !personal) return false;
    if (scope.value === 'global' && !global) return false;

    if (category.value !== 'all' && n.category !== category.value) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchTitle = n.title?.toLowerCase().includes(q);
      const matchMsg = n.message?.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg) return false;
    }

    return true;
  });
});

const selectedNotif = computed(() => {
  return notifications.value.find((n) => n.id === selectedId.value) ?? null;
});

async function handleMarkRead(id: string) {
  try {
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', id }),
    });

    const user = props.user?.username || props.currentUsername || 'admin';
    notifications.value = notifications.value.map((n) =>
      n.id === id ? { ...n, readBy: [...(n.readBy ?? []), user] } : n
    );
  } catch (err) {
    console.error('Failed to mark notification as read:', err);
  }
}

async function handleMarkAllRead() {
  try {
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read_all' }),
    });

    const user = props.user?.username || props.currentUsername || 'admin';
    notifications.value = notifications.value.map((n) => ({
      ...n,
      readBy: n.readBy?.includes(user) ? n.readBy : [...(n.readBy ?? []), user],
    }));
  } catch (err) {
    console.error('Failed to mark all as read:', err);
  }
}

async function handleDelete(id: string) {
  try {
    await fetch(`/api/admin/notifications?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    notifications.value = notifications.value.filter((n) => n.id !== id);
    if (selectedId.value === id) {
      selectedId.value = null;
    }
  } catch (err) {
    console.error('Failed to delete notification:', err);
  }
}

function handleSelectRow(n: AdminNotification) {
  selectedId.value = selectedId.value === n.id ? null : n.id;
  if (!isRead(n)) {
    handleMarkRead(n.id);
  }
}

const sidebarCategories: CategoryFilter[] = [
  'all',
  'task',
  'report',
  'feedback',
  'security',
  'system',
  'ai',
  'health',
];
</script>

<template>
  <div class="inbox-root">
    <!-- ── LEFT SIDEBAR ── -->
    <aside class="inbox-sidebar">
      <div class="inbox-sidebar-header">
        <div class="inbox-sidebar-title">
          <Icon icon="lucide:bell" width="15" height="15" />
          <span>Inbox</span>
        </div>
        <button
          type="button"
          class="inbox-refresh-btn"
          :disabled="refreshing"
          title="Reîmprospătează"
          @click="fetchNotifications(true)"
        >
          <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'inbox-spin': refreshing }" />
        </button>
      </div>

      <!-- Scope pills -->
      <div class="inbox-scope-section">
        <button
          type="button"
          :class="['inbox-scope-btn', { 'inbox-scope-btn--active': scope === 'all' && category === 'all' }]"
          @click="scope = 'all'; category = 'all'; selectedId = null"
        >
          <Icon icon="lucide:inbox" width="14" height="14" />
          <span>Toate</span>
          <span class="inbox-scope-count">{{ notifications.length }}</span>
        </button>

        <button
          type="button"
          :class="['inbox-scope-btn inbox-scope-btn--unread', { 'inbox-scope-btn--active': scope === 'unread' }]"
          @click="scope = 'unread'; category = 'all'; selectedId = null"
        >
          <Icon icon="lucide:mail" width="14" height="14" />
          <span>Necitite</span>
          <span v-if="unreadCount > 0" class="inbox-scope-count inbox-scope-count--unread">
            {{ unreadCount }}
          </span>
        </button>

        <button
          type="button"
          :class="['inbox-scope-btn', { 'inbox-scope-btn--active': scope === 'personal' }]"
          @click="scope = 'personal'; category = 'all'; selectedId = null"
        >
          <Icon icon="lucide:user-check" width="14" height="14" />
          <span>Personale</span>
        </button>

        <button
          type="button"
          :class="['inbox-scope-btn', { 'inbox-scope-btn--active': scope === 'global' }]"
          @click="scope = 'global'; category = 'all'; selectedId = null"
        >
          <Icon icon="lucide:globe" width="14" height="14" />
          <span>Globale</span>
        </button>
      </div>

      <div class="inbox-sidebar-divider" />

      <!-- Categories -->
      <div class="inbox-cat-section-label">Categorii</div>
      <nav class="inbox-cat-nav">
        <template v-for="cat in sidebarCategories" :key="cat">
          <button
            v-if="cat !== 'all'"
            type="button"
            :class="[
              'inbox-cat-btn',
              { 'inbox-cat-btn--active': category === cat },
              CATEGORY_META[cat]?.colorClass
            ]"
            @click="category = cat; scope = 'all'; selectedId = null"
          >
            <Icon :icon="CATEGORY_META[cat]?.icon || 'lucide:bell'" width="14" height="14" />
            <span>{{ CATEGORY_META[cat]?.label }}</span>
            <span
              v-if="(countByCategory[cat as NotificationCategory] ?? 0) > 0"
              class="inbox-cat-badge"
            >
              {{ countByCategory[cat as NotificationCategory] }}
            </span>
          </button>
        </template>
      </nav>

      <div v-if="unreadCount > 0" class="inbox-sidebar-footer">
        <button
          type="button"
          class="inbox-markall-btn"
          @click="handleMarkAllRead"
        >
          <Icon icon="lucide:check-check" width="13" height="13" />
          <span>Marchează toate citite</span>
        </button>
      </div>
    </aside>

    <!-- ── MAIN CONTENT ── -->
    <div class="inbox-main">
      <!-- Toolbar -->
      <div class="inbox-toolbar">
        <div class="inbox-toolbar-left">
          <h1 class="inbox-page-title">
            {{
              category !== 'all'
                ? CATEGORY_META[category]?.label
                : scope === 'unread'
                ? 'Necitite'
                : scope === 'personal'
                ? 'Personale'
                : scope === 'global'
                ? 'Globale'
                : 'Inbox'
            }}
          </h1>
          <span class="inbox-count-pill">{{ filtered.length }}</span>
        </div>
        <div class="inbox-search-wrap">
          <Icon icon="lucide:search" width="13" height="13" class="inbox-search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Caută notificări..."
            class="inbox-search-input"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="inbox-search-clear"
            @click="searchQuery = ''"
          >
            <Icon icon="lucide:x" width="12" height="12" />
          </button>
        </div>
      </div>

      <!-- List + Detail split -->
      <div class="inbox-split">
        <!-- Notifications list -->
        <div :class="['inbox-list', { 'inbox-list--split': selectedId }]">
          <div v-if="loading" class="inbox-loading">
            <Icon icon="lucide:refresh-cw" width="20" height="20" class="inbox-spin" />
            <span>Se încarcă notificările...</span>
          </div>

          <div v-else-if="filtered.length === 0" class="inbox-empty">
            <div class="inbox-empty-icon">
              <Icon icon="lucide:mail-open" width="32" height="32" />
            </div>
            <h4>Inbox gol</h4>
            <p>
              {{
                searchQuery
                  ? 'Nicio notificare nu corespunde căutării tale.'
                  : 'Nu există notificări pentru filtrul selectat.'
              }}
            </p>
          </div>

          <div
            v-for="n in filtered"
            :key="n.id"
            role="button"
            tabindex="0"
            :class="[
              'inbox-row',
              {
                'inbox-row--unread': !isRead(n),
                'inbox-row--selected': selectedId === n.id,
                'inbox-row--personal': isPersonal(n)
              }
            ]"
            @click="handleSelectRow(n)"
            @keydown.enter="handleSelectRow(n)"
          >
            <!-- Unread dot -->
            <div class="inbox-row-dot-wrap">
              <div v-if="!isRead(n)" class="inbox-unread-dot" />
              <div v-else class="inbox-read-dot" />
            </div>

            <!-- Category icon -->
            <div :class="['inbox-notif-cat-icon', CATEGORY_META[n.category]?.colorClass]">
              <Icon :icon="CATEGORY_META[n.category]?.icon || 'lucide:bell'" width="13" height="13" />
            </div>

            <!-- Content -->
            <div class="inbox-row-content">
              <div class="inbox-row-top">
                <span :class="['inbox-row-title', { 'inbox-row-title--bold': !isRead(n) }]">
                  {{ stripEmojis(n.title) }}
                </span>
                <div class="inbox-row-meta">
                  <span v-if="isPersonal(n)" class="inbox-personal-pill">
                    <Icon icon="lucide:user-check" width="10" height="10" />
                    Personal
                  </span>
                  <span
                    :class="['inbox-severity-dot', `inbox-severity-dot--${n.severity}`]"
                    :title="n.severity"
                  />
                  <span class="inbox-row-time">
                    <Icon icon="lucide:clock" width="10" height="10" />
                    {{ timeAgo(n.createdAt) }}
                  </span>
                </div>
              </div>
              <p class="inbox-row-preview">{{ stripEmojis(n.message) }}</p>
            </div>

            <!-- Actions -->
            <div class="inbox-row-actions" @click.stop>
              <button
                v-if="!isRead(n)"
                type="button"
                class="inbox-action-btn"
                title="Marchează citit"
                @click="handleMarkRead(n.id)"
              >
                <Icon icon="lucide:check" width="13" height="13" />
              </button>
              <button
                type="button"
                class="inbox-action-btn inbox-action-btn--delete"
                title="Șterge"
                @click="handleDelete(n.id)"
              >
                <Icon icon="lucide:trash-2" width="13" height="13" />
              </button>
            </div>
          </div>
        </div>

        <!-- Detail pane -->
        <div v-if="selectedNotif" class="inbox-detail">
          <div class="inbox-detail-header">
            <button
              type="button"
              class="inbox-detail-close"
              title="Închide"
              @click="selectedId = null"
            >
              <Icon icon="lucide:x" width="15" height="15" />
            </button>
            <div :class="['inbox-notif-cat-icon', CATEGORY_META[selectedNotif.category]?.colorClass]">
              <Icon :icon="CATEGORY_META[selectedNotif.category]?.icon || 'lucide:bell'" width="15" height="15" />
            </div>
            <span class="inbox-detail-cat-label">
              {{ CATEGORY_META[selectedNotif.category]?.label }}
            </span>
            <span :class="['inbox-detail-severity', `inbox-detail-severity--${selectedNotif.severity}`]">
              {{ selectedNotif.severity.toUpperCase() }}
            </span>
          </div>

          <div class="inbox-detail-body">
            <h2 class="inbox-detail-title">{{ stripEmojis(selectedNotif.title) }}</h2>

            <div class="inbox-detail-meta-row">
              <span class="inbox-detail-meta-item">
                <Icon icon="lucide:clock" width="12" height="12" />
                {{
                  new Date(selectedNotif.createdAt).toLocaleString('ro-RO', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </span>
              <span v-if="selectedNotif.targetUser" class="inbox-detail-meta-item">
                <Icon icon="lucide:user-check" width="12" height="12" />
                Personal @{{ selectedNotif.targetUser }}
              </span>
              <span v-else class="inbox-detail-meta-item">
                <Icon icon="lucide:globe" width="12" height="12" />
                Broadcast echipă
              </span>
            </div>

            <p class="inbox-detail-message">{{ stripEmojis(selectedNotif.message) }}</p>

            <a
              v-if="selectedNotif.link"
              :href="selectedNotif.link"
              class="inbox-detail-cta"
            >
              <span>Deschide modulul relevant</span>
              <Icon icon="lucide:arrow-right" width="14" height="14" />
            </a>
          </div>

          <div class="inbox-detail-footer">
            <button
              type="button"
              class="inbox-detail-delete-btn"
              @click="handleDelete(selectedNotif.id)"
            >
              <Icon icon="lucide:trash-2" width="13" height="13" />
              <span>Șterge notificarea</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional scoped helper rules */
.inbox-detail-delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: var(--radius-sm, 8px);
  background: hsl(0 84% 60% / 0.1);
  border: 1px solid hsl(0 84% 60% / 0.3);
  color: #ef4444;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.inbox-detail-delete-btn:hover {
  background: hsl(0 84% 60% / 0.2);
  color: #f87171;
  border-color: hsl(0 84% 60% / 0.5);
}

.inbox-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
