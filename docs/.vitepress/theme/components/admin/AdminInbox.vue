<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import type {
  AdminNotification,
  NotificationCategory,
  NotificationSeverity,
  NotificationPreferences,
} from '../../types/notifications';

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
const markingAll = ref<boolean>(false);
const showPreferencesModal = ref<boolean>(false);
const savingPreferences = ref<boolean>(false);
const prefsSuccessMsg = ref<string>('');
const prefsErrorMsg = ref<string>('');

const defaultPreferences: NotificationPreferences = {
  task: true,
  system: true,
  security: true,
  content: true,
  report: true,
  feedback: true,
  ai: true,
  health: true,
  ignoreAudit: false,
  ignoreSnapshots: false,
};

const userPreferences = ref<NotificationPreferences>({ ...defaultPreferences });

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
      if (data.preferences) {
        userPreferences.value = { ...defaultPreferences, ...data.preferences };
      }
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
  if (markingAll.value) return;
  markingAll.value = true;
  try {
    const res = await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read_all' }),
    });

    if (res.ok) {
      const user = props.user?.username || props.currentUsername || 'admin';
      notifications.value = notifications.value.map((n) => ({
        ...n,
        readBy: n.readBy?.includes(user) ? n.readBy : [...(n.readBy ?? []), user],
      }));
    }
  } catch (err) {
    console.error('Failed to mark all as read:', err);
  } finally {
    markingAll.value = false;
  }
}

async function handleSavePreferences() {
  savingPreferences.value = true;
  prefsSuccessMsg.value = '';
  prefsErrorMsg.value = '';
  try {
    const res = await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_preferences',
        preferences: userPreferences.value,
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      prefsSuccessMsg.value = 'Preferințele tale au fost salvate și aplicate!';
      await fetchNotifications(true);
      setTimeout(() => {
        prefsSuccessMsg.value = '';
        showPreferencesModal.value = false;
      }, 1200);
    } else {
      prefsErrorMsg.value = data.error || 'Nu s-au putut salva preferințele.';
    }
  } catch (err) {
    console.error('Failed to save notification preferences:', err);
    prefsErrorMsg.value = 'Eroare de conexiune la salvarea preferințelor.';
  } finally {
    savingPreferences.value = false;
  }
}

function handleResetPreferences() {
  userPreferences.value = { ...defaultPreferences };
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

        <div class="inbox-toolbar-right">
          <!-- Search box -->
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

          <!-- Read All button -->
          <button
            type="button"
            class="inbox-toolbar-btn inbox-toolbar-btn--markall"
            :disabled="unreadCount === 0 || markingAll"
            title="Marchează toate notificările necitite ca citite"
            @click="handleMarkAllRead"
          >
            <Icon
              :icon="markingAll ? 'lucide:refresh-cw' : 'lucide:check-check'"
              width="14"
              height="14"
              :class="{ 'inbox-spin': markingAll }"
            />
            <span>Marchează tot citit</span>
            <span v-if="unreadCount > 0" class="inbox-unread-bubble">{{ unreadCount }}</span>
          </button>

          <!-- Notification Preferences button -->
          <button
            type="button"
            class="inbox-toolbar-btn inbox-toolbar-btn--prefs"
            title="Configurează ce notificări vrei să primești și filtrează spamul"
            @click="showPreferencesModal = true"
          >
            <Icon icon="lucide:sliders-horizontal" width="14" height="14" />
            <span>Preferințe Alerte</span>
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

    <!-- ── PREFERENCES MODAL ── -->
    <Teleport to="body">
      <div
        v-if="showPreferencesModal"
        class="glossy-modal-backdrop"
        @click.self="showPreferencesModal = false"
      >
        <div class="glossy-modal-card inbox-prefs-modal">
          <div class="sheen-light-bar" />
          <div class="radial-flare" />

          <!-- Close Button -->
          <button
            type="button"
            class="glossy-close-btn"
            title="Închide"
            @click="showPreferencesModal = false"
          >
            <Icon icon="lucide:x" width="18" height="18" />
          </button>

          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-icon-box">
              <Icon icon="lucide:sliders-horizontal" width="24" height="24" />
            </div>
            <div class="header-titles">
              <div class="protocol-pill">
                <Icon icon="lucide:flame" width="12" height="12" class="flame-icon" />
                <span>Setări Notificări & Alerte</span>
              </div>
              <h2 class="modal-title">Preferințe & Filtrare Notificări</h2>
              <p class="modal-subtitle">
                Alege ce alerte dorești să primești în inbox și ascunde spamul de rutină al sistemului.
              </p>
            </div>
          </div>

          <!-- Feedback alerts -->
          <div v-if="prefsSuccessMsg" class="prefs-alert prefs-alert--success">
            <Icon icon="lucide:check-circle" width="16" height="16" />
            <span>{{ prefsSuccessMsg }}</span>
          </div>
          <div v-if="prefsErrorMsg" class="prefs-alert prefs-alert--error">
            <Icon icon="lucide:alert-circle" width="16" height="16" />
            <span>{{ prefsErrorMsg }}</span>
          </div>

          <div class="prefs-modal-content">
            <!-- ── SECTION 1: REDUCERE ZGOMOT (ANTI-SPAM) ── -->
            <div class="prefs-section">
              <div class="prefs-section-header">
                <div class="prefs-section-icon-badge prefs-section-icon-badge--noise">
                  <Icon icon="lucide:shield-ban" width="16" height="16" />
                </div>
                <div>
                  <h3 class="prefs-section-title">Filtrare Zgomot & Alerte de Rutină</h3>
                  <p class="prefs-section-desc">
                    Dezactivează logurile automate de fundal care nu necesită atenția ta directă.
                  </p>
                </div>
              </div>

              <div class="prefs-toggle-list">
                <!-- Ignore Audit Logs -->
                <label class="prefs-toggle-item" :class="{ 'prefs-toggle-item--active': userPreferences.ignoreAudit }">
                  <div class="prefs-toggle-info">
                    <div class="prefs-toggle-top">
                      <span class="prefs-toggle-name">Filtrează Jurnalele de Audit (Audit Logs)</span>
                      <span class="prefs-tag prefs-tag--recommended">Recomandat</span>
                    </div>
                    <p class="prefs-toggle-hint">
                      Ascunde notificările de tip <code>Audit: DOC_UPDATE</code>, comutări mod mentenanță sau modificări de stare minore din inbox.
                    </p>
                  </div>
                  <div class="prefs-switch-wrap">
                    <input
                      v-model="userPreferences.ignoreAudit"
                      type="checkbox"
                      class="prefs-checkbox"
                    />
                    <span class="prefs-switch"></span>
                  </div>
                </label>

                <!-- Ignore Snapshots -->
                <label class="prefs-toggle-item" :class="{ 'prefs-toggle-item--active': userPreferences.ignoreSnapshots }">
                  <div class="prefs-toggle-info">
                    <div class="prefs-toggle-top">
                      <span class="prefs-toggle-name">Filtrează Snapshot-urile Automate (Backups)</span>
                    </div>
                    <p class="prefs-toggle-hint">
                      Ascunde alertele automate despre backup-uri periodice de fișiere, exporturi cache și cron jobs de rutină.
                    </p>
                  </div>
                  <div class="prefs-switch-wrap">
                    <input
                      v-model="userPreferences.ignoreSnapshots"
                      type="checkbox"
                      class="prefs-checkbox"
                    />
                    <span class="prefs-switch"></span>
                  </div>
                </label>
              </div>
            </div>

            <!-- ── SECTION 2: CATEGORII ACTIVE ── -->
            <div class="prefs-section">
              <div class="prefs-section-header">
                <div class="prefs-section-icon-badge prefs-section-icon-badge--cats">
                  <Icon icon="lucide:layout-grid" width="16" height="16" />
                </div>
                <div>
                  <h3 class="prefs-section-title">Categorii de Notificări Active</h3>
                  <p class="prefs-section-desc">
                    Alege modulele din care dorești să vezi notificări și sarcini.
                  </p>
                </div>
              </div>

              <div class="prefs-cats-grid">
                <!-- Task -->
                <label class="prefs-cat-card" :class="{ 'prefs-cat-card--disabled': !userPreferences.task }">
                  <div class="prefs-cat-header">
                    <div class="prefs-cat-icon inbox-cat--task">
                      <Icon icon="lucide:list-todo" width="15" height="15" />
                    </div>
                    <div class="prefs-switch-wrap">
                      <input v-model="userPreferences.task" type="checkbox" class="prefs-checkbox" />
                      <span class="prefs-switch"></span>
                    </div>
                  </div>
                  <div class="prefs-cat-title">Sarcini & Task Hub</div>
                  <div class="prefs-cat-sub">Sarcini asignate, modificări de status și termene limită.</div>
                </label>

                <!-- Report -->
                <label class="prefs-cat-card" :class="{ 'prefs-cat-card--disabled': !userPreferences.report }">
                  <div class="prefs-cat-header">
                    <div class="prefs-cat-icon inbox-cat--report">
                      <Icon icon="lucide:alert-triangle" width="15" height="15" />
                    </div>
                    <div class="prefs-switch-wrap">
                      <input v-model="userPreferences.report" type="checkbox" class="prefs-checkbox" />
                      <span class="prefs-switch"></span>
                    </div>
                  </div>
                  <div class="prefs-cat-title">Rapoarte Jucători</div>
                  <div class="prefs-cat-sub">Sesizări despre pagini rupte, greșeli sau linkuri nefuncționale.</div>
                </label>

                <!-- Feedback -->
                <label class="prefs-cat-card" :class="{ 'prefs-cat-card--disabled': !userPreferences.feedback }">
                  <div class="prefs-cat-header">
                    <div class="prefs-cat-icon inbox-cat--feedback">
                      <Icon icon="lucide:message-square" width="15" height="15" />
                    </div>
                    <div class="prefs-switch-wrap">
                      <input v-model="userPreferences.feedback" type="checkbox" class="prefs-checkbox" />
                      <span class="prefs-switch"></span>
                    </div>
                  </div>
                  <div class="prefs-cat-title">Feedback Vizitatori</div>
                  <div class="prefs-cat-sub">Evaluări ale ghidurilor, opinii și sugestii comunitate.</div>
                </label>

                <!-- Security -->
                <label class="prefs-cat-card" :class="{ 'prefs-cat-card--disabled': !userPreferences.security }">
                  <div class="prefs-cat-header">
                    <div class="prefs-cat-icon inbox-cat--security">
                      <Icon icon="lucide:shield-alert" width="15" height="15" />
                    </div>
                    <div class="prefs-switch-wrap">
                      <input v-model="userPreferences.security" type="checkbox" class="prefs-checkbox" />
                      <span class="prefs-switch"></span>
                    </div>
                  </div>
                  <div class="prefs-cat-title">Securitate & 2FA</div>
                  <div class="prefs-cat-sub">Alerte autentificare, resetare credențiale și 2FA.</div>
                </label>

                <!-- System -->
                <label class="prefs-cat-card" :class="{ 'prefs-cat-card--disabled': !userPreferences.system }">
                  <div class="prefs-cat-header">
                    <div class="prefs-cat-icon inbox-cat--system">
                      <Icon icon="lucide:server" width="15" height="15" />
                    </div>
                    <div class="prefs-switch-wrap">
                      <input v-model="userPreferences.system" type="checkbox" class="prefs-checkbox" />
                      <span class="prefs-switch"></span>
                    </div>
                  </div>
                  <div class="prefs-cat-title">Stare Sistem</div>
                  <div class="prefs-cat-sub">Alerte runtime server, cache purges și deployment.</div>
                </label>

                <!-- AI Engine -->
                <label class="prefs-cat-card" :class="{ 'prefs-cat-card--disabled': !userPreferences.ai }">
                  <div class="prefs-cat-header">
                    <div class="prefs-cat-icon inbox-cat--ai">
                      <Icon icon="lucide:sparkles" width="15" height="15" />
                    </div>
                    <div class="prefs-switch-wrap">
                      <input v-model="userPreferences.ai" type="checkbox" class="prefs-checkbox" />
                      <span class="prefs-switch"></span>
                    </div>
                  </div>
                  <div class="prefs-cat-title">AI Copilot & Embeddings</div>
                  <div class="prefs-cat-sub">Rapoarte de indexare vectori și optimizare conținut.</div>
                </label>

                <!-- Doc Health -->
                <label class="prefs-cat-card" :class="{ 'prefs-cat-card--disabled': !userPreferences.health }">
                  <div class="prefs-cat-header">
                    <div class="prefs-cat-icon inbox-cat--health">
                      <Icon icon="lucide:activity" width="15" height="15" />
                    </div>
                    <div class="prefs-switch-wrap">
                      <input v-model="userPreferences.health" type="checkbox" class="prefs-checkbox" />
                      <span class="prefs-switch"></span>
                    </div>
                  </div>
                  <div class="prefs-cat-title">Doc Health & Linter</div>
                  <div class="prefs-cat-sub">Erori Frontmatter/Markdown, ancore orfane și audit pagini.</div>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="modal-footer-actions">
            <button
              type="button"
              class="prefs-btn prefs-btn--reset"
              @click="handleResetPreferences"
            >
              <Icon icon="lucide:rotate-ccw" width="14" height="14" />
              <span>Resetează la implicit</span>
            </button>

            <div class="prefs-footer-right">
              <button
                type="button"
                class="prefs-btn prefs-btn--cancel"
                @click="showPreferencesModal = false"
              >
                Anulează
              </button>
              <button
                type="button"
                class="prefs-btn prefs-btn--save"
                :disabled="savingPreferences"
                @click="handleSavePreferences"
              >
                <Icon
                  :icon="savingPreferences ? 'lucide:refresh-cw' : 'lucide:check'"
                  width="15"
                  height="15"
                  :class="{ 'inbox-spin': savingPreferences }"
                />
                <span>{{ savingPreferences ? 'Se salvează...' : 'Salvează preferințele' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Toolbar right actions */
.inbox-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.inbox-toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
  background: var(--color-surface-raised);
  color: var(--color-text);
  white-space: nowrap;
}

.inbox-toolbar-btn:hover:not(:disabled) {
  background: var(--color-surface-elevated, #1f2430);
  border-color: rgba(255, 107, 0, 0.4);
  color: #ffffff;
}

.inbox-toolbar-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.inbox-toolbar-btn--markall {
  background: rgba(255, 107, 0, 0.1);
  border-color: rgba(255, 107, 0, 0.35);
  color: #ff8800;
}

.inbox-toolbar-btn--markall:hover:not(:disabled) {
  background: rgba(255, 107, 0, 0.22);
  border-color: rgba(255, 107, 0, 0.6);
  color: #ffaa33;
  box-shadow: 0 0 12px rgba(255, 107, 0, 0.25);
}

.inbox-unread-bubble {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 99px;
  background: #ff6b00;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 800;
}

.inbox-toolbar-btn--prefs {
  background: var(--color-surface-raised);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.inbox-toolbar-btn--prefs:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
}

/* Detail action buttons */
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

/* ═════════════════════════════════════════════════════════════════════ */
/* ULTRA-GLOSSY PREFERENCES MODAL DIALOG                               */
/* ═════════════════════════════════════════════════════════════════════ */
.glossy-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(4, 6, 12, 0.82);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.glossy-modal-card {
  position: relative;
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  background: radial-gradient(circle at 50% 0%, rgba(255, 107, 0, 0.14) 0%, rgba(16, 20, 28, 0.95) 50%, rgba(10, 12, 18, 0.98) 100%);
  border: 1px solid rgba(255, 107, 0, 0.35);
  box-shadow: 0 24px 70px -10px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 107, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(30px);
  padding: 30px;
  box-sizing: border-box;
}

.sheen-light-bar {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 136, 0, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 136, 0, 0.8), transparent);
}

.radial-flare {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 160px;
  background: radial-gradient(ellipse at center, rgba(255, 107, 0, 0.25) 0%, transparent 70%);
  pointer-events: none;
}

.glossy-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
}

.glossy-close-btn:hover {
  background: rgba(255, 107, 0, 0.2);
  border-color: rgba(255, 107, 0, 0.4);
  color: #ffffff;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;
}

.header-icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.3) 0%, rgba(255, 60, 0, 0.1) 100%);
  border: 1px solid rgba(255, 107, 0, 0.5);
  color: #ff8800;
  box-shadow: 0 0 20px rgba(255, 107, 0, 0.35);
  flex-shrink: 0;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.protocol-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ff8800;
  text-transform: uppercase;
}

.flame-icon {
  color: #ff6b00;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
  margin: 0;
}

.modal-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.prefs-modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 14px;
  margin-bottom: 22px;
}

.prefs-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px 18px;
}

.prefs-section-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.prefs-section-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
}

.prefs-section-icon-badge--noise {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.prefs-section-icon-badge--cats {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.prefs-section-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 3px 0;
}

.prefs-section-desc {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Anti-spam toggle list */
.prefs-toggle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prefs-toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.prefs-toggle-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}

.prefs-toggle-item--active {
  background: rgba(245, 158, 11, 0.06);
  border-color: rgba(245, 158, 11, 0.3);
}

.prefs-toggle-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.prefs-toggle-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
}

.prefs-tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 4px;
}

.prefs-tag--recommended {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.prefs-toggle-hint {
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  line-height: 1.35;
}

.prefs-toggle-hint code {
  font-family: monospace;
  font-size: 0.72rem;
  padding: 1px 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  color: #ff8800;
}

/* Category Grid */
.prefs-cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 10px;
}

.prefs-cat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  transition: all 0.2s ease;
}

.prefs-cat-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.14);
}

.prefs-cat-card--disabled {
  opacity: 0.45;
  filter: grayscale(0.5);
}

.prefs-cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.prefs-cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
}

.prefs-cat-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.prefs-cat-sub {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.3;
}

/* Modern Switch */
.prefs-switch-wrap {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
}

.prefs-checkbox {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.prefs-switch {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  transition: 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.prefs-switch:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.prefs-checkbox:checked + .prefs-switch {
  background-color: #ff6b00;
  border-color: #ff8800;
  box-shadow: 0 0 8px rgba(255, 107, 0, 0.4);
}

.prefs-checkbox:checked + .prefs-switch:before {
  transform: translateX(16px);
}

/* Modal alerts */
.prefs-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.prefs-alert--success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.prefs-alert--error {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

/* Modal Footer Actions */
.modal-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.prefs-footer-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prefs-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.prefs-btn--reset {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.65);
}

.prefs-btn--reset:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
}

.prefs-btn--cancel {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.prefs-btn--cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.prefs-btn--save {
  background: linear-gradient(135deg, #ff6b00 0%, #e05500 100%);
  border: 1px solid rgba(255, 107, 0, 0.5);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(255, 107, 0, 0.3);
}

.prefs-btn--save:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff7e1a 0%, #f05a00 100%);
  box-shadow: 0 4px 16px rgba(255, 107, 0, 0.45);
}

.prefs-btn--save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .inbox-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .inbox-toolbar-right {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .inbox-search-wrap {
    width: 100%;
    min-width: 0;
  }
  .inbox-prefs-modal {
    padding: 20px 16px !important;
  }
  .prefs-cats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

