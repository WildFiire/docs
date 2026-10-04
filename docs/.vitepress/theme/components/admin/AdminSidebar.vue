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

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  permKey?: string;
  rootOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
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
    label: 'My Team & Access',
    href: '/admin/team',
    icon: 'lucide:users',
    permKey: 'canManageTeam',
  },
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
  {
    label: 'Search Telemetry',
    href: '/admin/search-analytics',
    icon: 'lucide:search',
    permKey: 'canViewAnalytics',
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
];

const isRoot = computed(() => {
  const username = props.user?.username?.toLowerCase()?.trim();
  return Boolean(
    props.user?.isRoot ||
    username === 'iannc' ||
    username === 'iannc69'
  );
});

const allowedNavItems = computed(() => {
  return NAV_ITEMS.filter((item) => {
    if (item.rootOnly && !isRoot.value) return false;
    if (isRoot.value) return true;
    if (!item.permKey) return true;
    return Boolean(props.user?.permissions?.[item.permKey]);
  });
});

function isItemActive(href: string) {
  const cur = route.path.replace(/\/$/, '') || '/admin';
  if (href === '/admin') return cur === '/admin';
  return cur === href || cur.startsWith(href + '/');
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
      <a
        v-for="item in allowedNavItems"
        :key="item.href"
        :href="item.href"
        class="admin-nav-item"
        :class="{ 'admin-nav-item--active': isItemActive(item.href) }"
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
.admin-nav-list {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.admin-nav-list::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.admin-sidebar {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.admin-sidebar::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
</style>
