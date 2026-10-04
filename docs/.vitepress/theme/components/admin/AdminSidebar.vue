<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

const props = defineProps<{
  user: any;
  mobileOpen?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const route = useRoute();
const router = useRouter();
const internalMobileOpen = ref(false);
const unreadNotifications = ref(0);
const discordExpanded = ref(true);

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  permKey?: string;
  rootOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Mission Control',
        href: '/admin',
        icon: 'lucide:layout-dashboard',
        badge: 'Live',
      },
      {
        label: 'My Profile',
        href: '/admin/profile',
        icon: 'lucide:user',
      },
      {
        label: 'Inbox Notificări',
        href: '/admin/inbox',
        icon: 'lucide:bell',
      },
      {
        label: 'Task Hub & TODO',
        href: '/admin/tasks',
        icon: 'lucide:list-todo',
        badge: 'TODO',
        permKey: 'canManageTasks',
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Content Studio',
        href: '/admin/content',
        icon: 'lucide:file-edit',
        permKey: 'canEditDocs',
      },
      {
        label: 'Doc Health & Linter',
        href: '/admin/health',
        icon: 'lucide:activity',
        permKey: 'canManageHealth',
      },
      {
        label: 'Media & Asset Vault',
        href: '/admin/media',
        icon: 'lucide:folder',
        permKey: 'canManageMedia',
      },
    ],
  },
  {
    label: 'Securitate & Echipă',
    items: [
      {
        label: 'My Team & Access',
        href: '/admin/team',
        icon: 'lucide:users',
        permKey: 'canManageTeam',
      },
      {
        label: 'Security & 2FA',
        href: '/admin/security',
        icon: 'lucide:shield-check',
        permKey: 'canManageSecurity',
      },
      {
        label: 'API Tokens',
        href: '/admin/api-keys',
        icon: 'lucide:key',
        permKey: 'canManageApiKeys',
      },
      {
        label: 'Audit Ledger',
        href: '/admin/audit',
        icon: 'lucide:scroll-text',
        permKey: 'canViewAudit',
      },
    ],
  },
  {
    label: 'Sistem & Operațiuni',
    items: [
      {
        label: 'AI Engine Telemetry',
        href: '/admin/ai-analytics',
        icon: 'lucide:cpu',
        badge: 'AI',
        permKey: 'canViewAiStats',
      },
      {
        label: 'Database & Metrics',
        href: '/admin/database',
        icon: 'lucide:database',
        badge: 'SQL',
        permKey: 'canManageDb',
      },
      {
        label: 'Snapshot Vault',
        href: '/admin/backups',
        icon: 'lucide:archive',
        badge: 'Vault',
        permKey: 'canManageSnapshots',
      },
      {
        label: 'Search Telemetry',
        href: '/admin/search-analytics',
        icon: 'lucide:search',
        permKey: 'canViewAnalytics',
      },
      {
        label: 'Webhooks',
        href: '/admin/webhooks',
        icon: 'lucide:webhook',
        permKey: 'canManageWebhooks',
      },
      {
        label: 'GitOps & Repos',
        href: '/admin/gitops',
        icon: 'lucide:git-branch',
        badge: 'ROOT',
        rootOnly: true,
      },
      {
        label: 'Discord Bot',
        href: '/admin/discord-bot',
        icon: 'lucide:bot',
        badge: 'BOT',
        permKey: 'canManageDiscordBot',
      },
      {
        label: 'Engine Settings',
        href: '/admin/settings',
        icon: 'lucide:sliders',
        permKey: 'canManageSettings',
      },
    ],
  },
];

const DISCORD_BOT_SUBMODULES = [
  { label: 'Overview', href: '/admin/discord-bot', icon: 'lucide:bot' },
  { label: 'Tickete', href: '/admin/discord-bot/tickets', icon: 'lucide:ticket' },
  { label: 'Staff', href: '/admin/discord-bot/staff', icon: 'lucide:users' },
  { label: 'Watchlist', href: '/admin/discord-bot/watchlist', icon: 'lucide:eye' },
  { label: 'Role Trackers', href: '/admin/discord-bot/role-trackers', icon: 'lucide:radio' },
  { label: 'Module', href: '/admin/discord-bot/modules', icon: 'lucide:cpu' },
];

const isRoot = computed(() => {
  const username = props.user?.username?.toLowerCase()?.trim();
  return Boolean(
    props.user?.isRoot ||
    username === 'iannc' ||
    username === 'iannc69'
  );
});

const allowedNavGroups = computed(() => {
  return NAV_GROUPS.map((group) => ({
    label: group.label,
    items: group.items.filter((item) => {
      if (item.rootOnly && !isRoot.value) return false;
      if (isRoot.value) return true;
      if (!item.permKey) return true;
      return Boolean(props.user?.permissions?.[item.permKey]);
    }),
  })).filter((group) => group.items.length > 0);
});

function isItemActive(href: string) {
  const cur = route.path.replace(/\/$/, '') || '/admin';
  if (href === '/admin') return cur === '/admin';
  return cur === href || cur.startsWith(href + '/');
}

function isDiscordBotActive() {
  const cur = route.path.replace(/\/$/, '') || '';
  return cur.startsWith('/admin/discord-bot');
}

const isOpen = computed(() => props.mobileOpen ?? internalMobileOpen.value);

function handleClose() {
  internalMobileOpen.value = false;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
  emit('close');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin-close-mobile-nav'));
  }
}

function navigate(href: string) {
  handleClose();
  router.go(href);
}

async function fetchUnreadNotifications() {
  try {
    const data = await api('/api/admin/notifications?scope=unread&limit=1');
    unreadNotifications.value = Number(data?.unreadCount ?? 0);
  } catch {}
}

watch(
  () => route.path,
  () => {
    handleClose();
    if (isDiscordBotActive()) {
      discordExpanded.value = true;
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchUnreadNotifications();
  const notifInterval = setInterval(fetchUnreadNotifications, 60_000);

  const handleToggle = () => {
    internalMobileOpen.value = !internalMobileOpen.value;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = internalMobileOpen.value ? 'hidden' : '';
    }
  };

  const handleExternalClose = () => {
    internalMobileOpen.value = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  window.addEventListener('admin-toggle-mobile-nav', handleToggle);
  window.addEventListener('admin-close-mobile-nav', handleExternalClose);

  onUnmounted(() => {
    clearInterval(notifInterval);
    window.removeEventListener('admin-toggle-mobile-nav', handleToggle);
    window.removeEventListener('admin-close-mobile-nav', handleExternalClose);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });
});
</script>

<template>
  <!-- Mobile Backdrop Overlay -->
  <div
    id="admin-sidebar-overlay"
    class="admin-sidebar-overlay"
    :class="{ 'admin-sidebar-overlay--open': isOpen }"
    :data-open="isOpen ? 'true' : 'false'"
    aria-hidden="true"
    @click="handleClose"
  />

  <aside
    id="admin-sidebar"
    class="admin-sidebar"
    :class="{ 'admin-sidebar--open': isOpen }"
    :data-open="isOpen ? 'true' : 'false'"
    aria-label="Admin Navigation"
  >
    <div class="admin-sidebar-header-row">
      <div class="admin-sidebar-section-title">
        <Icon icon="lucide:terminal" width="13" height="13" />
        <span>NAVIGATION MATRIX</span>
      </div>

      <button
        type="button"
        class="admin-mobile-sidebar-close"
        aria-label="Închide meniul de navigare"
        @click="handleClose"
      >
        <Icon icon="lucide:x" width="16" height="16" />
      </button>
    </div>

    <nav class="admin-nav-list">
      <template v-for="(group, gIdx) in allowedNavGroups" :key="group.label">
        <!-- Group label divider with lines and clear section spacing -->
        <div class="admin-nav-group-label" :class="{ 'admin-nav-group-label--first': gIdx === 0 }">
          <span class="admin-nav-group-line" aria-hidden="true" />
          <span class="admin-nav-group-text">{{ group.label }}</span>
          <span class="admin-nav-group-line" aria-hidden="true" />
        </div>

        <div class="admin-nav-group-items">
          <template v-for="item in group.items" :key="item.href">
            <a
              :href="item.href"
              class="admin-nav-item"
              :class="{
                'admin-nav-item--active': item.href === '/admin/discord-bot'
                  ? (route.path.replace(/\/$/, '') === '/admin/discord-bot')
                  : isItemActive(item.href)
              }"
              @click.prevent="navigate(item.href)"
            >
              <Icon :icon="item.icon" class="admin-nav-icon" width="16" height="16" />
              <span class="admin-nav-text">{{ item.label }}</span>

              <span
                v-if="item.href === '/admin/inbox' && unreadNotifications > 0"
                class="admin-nav-badge admin-nav-badge--unread"
              >
                {{ unreadNotifications > 99 ? '99+' : unreadNotifications }}
              </span>
              <span v-else-if="item.badge" class="admin-nav-badge">{{ item.badge }}</span>
            </a>

            <!-- Discord Bot Submenu for rich 1:1 old category parity -->
            <div
              v-if="item.href === '/admin/discord-bot' && (isDiscordBotActive() || discordExpanded)"
              class="admin-subnav-list"
              style="display: flex; flex-direction: column; gap: 2px; padding-left: 18px; margin: 2px 0 6px 6px; border-left: 1.5px solid hsl(26 100% 52% / 0.25);"
            >
              <a
                v-for="sub in DISCORD_BOT_SUBMODULES"
                :key="sub.href"
                :href="sub.href"
                class="admin-nav-item admin-subnav-item"
                :class="{ 'admin-nav-item--active': route.path.replace(/\/$/, '') === sub.href }"
                style="padding: 6px 10px; font-size: 0.78rem; gap: 8px;"
                @click.prevent="navigate(sub.href)"
              >
                <Icon :icon="sub.icon" width="13" height="13" style="opacity: 0.75;" />
                <span class="admin-nav-text">{{ sub.label }}</span>
              </a>
            </div>
          </template>
        </div>
      </template>
    </nav>

    <!-- Sidebar Status Footer -->
    <div class="admin-sidebar-footer">
      <div class="admin-engine-status-box">
        <div class="admin-engine-status-header">
          <Icon icon="lucide:activity" width="13" height="13" class="admin-engine-pulse" />
          <span class="admin-engine-title">WF-DOCSCORE</span>
        </div>
        <div class="admin-engine-meta">
          <span>Engine v1.8.5</span>
          <span class="admin-status-indicator">SECURE</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.admin-nav-group-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 10px 5px;
  margin-top: 10px;
  pointer-events: none;
  user-select: none;
}

.admin-nav-group-label--first {
  padding-top: 2px;
  margin-top: 0;
}

.admin-nav-group-text {
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--color-text-tertiary, #64748b);
  text-transform: uppercase;
  font-family: var(--font-mono, monospace);
  opacity: 0.75;
  white-space: nowrap;
  flex-shrink: 0;
}

.admin-nav-group-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, hsl(0 0% 100% / 0.12), transparent);
}

.admin-nav-group-line:first-child {
  background: linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.12));
  max-width: 10px;
  flex: 0 0 10px;
}

.admin-nav-group-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
