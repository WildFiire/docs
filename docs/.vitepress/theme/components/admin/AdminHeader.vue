<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import AdminNotificationsCenter from './AdminNotificationsCenter.vue';
import AdminThemeToggle from './AdminThemeToggle.vue';

const props = defineProps<{
  user?: {
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    role?: string;
    isRoot?: boolean;
  } | null;
}>();

const emit = defineEmits<{
  (e: 'toggle-mobile'): void;
  (e: 'logout'): void;
}>();

const router = useRouter();
const loggingOut = ref(false);
const isMaintenance = ref(false);
const mobileOpen = ref(false);

const liveAvatar = ref<string | undefined>(props.user?.avatarUrl);
const liveDisplayName = ref<string | undefined>(props.user?.displayName || props.user?.username);
const avatarFailed = ref(false);

const isRootUser = computed(() => {
  const u = props.user?.username?.toLowerCase()?.trim();
  return Boolean(props.user?.isRoot || u === 'iannc' || u === 'iannc69');
});

watch(
  () => [props.user?.avatarUrl, props.user?.displayName, props.user?.username],
  () => {
    liveAvatar.value = props.user?.avatarUrl;
    liveDisplayName.value = props.user?.displayName || props.user?.username;
    avatarFailed.value = false;
  }
);

async function syncProfile() {
  try {
    const data = await api('/api/admin/profile');
    if (data?.profile) {
      if (data.profile.avatarUrl) {
        liveAvatar.value = data.profile.avatarUrl;
        avatarFailed.value = false;
      }
      if (data.profile.displayName) {
        liveDisplayName.value = data.profile.displayName;
      }
    }
  } catch {}
}

async function checkMaintenance() {
  try {
    const data = await api('/api/admin/maintenance');
    isMaintenance.value = Boolean(data?.enabled);
  } catch {}
}

function handleToggleMobile() {
  mobileOpen.value = !mobileOpen.value;
  emit('toggle-mobile');
}

function navigate(href: string) {
  router.go(href);
}

onMounted(() => {
  checkMaintenance();
  syncProfile();

  const handleMobileClose = () => {
    mobileOpen.value = false;
  };

  window.addEventListener('admin-profile-updated', syncProfile);
  window.addEventListener('admin-close-mobile-nav', handleMobileClose);

  onUnmounted(() => {
    window.removeEventListener('admin-profile-updated', syncProfile);
    window.removeEventListener('admin-close-mobile-nav', handleMobileClose);
  });
});

async function handleLogout() {
  loggingOut.value = true;
  try {
    emit('logout');
  } finally {
    loggingOut.value = false;
  }
}
</script>

<template>
  <header class="admin-header">
    <div class="admin-header-left">
      <!-- Mobile Navigation Toggle -->
      <button
        type="button"
        class="admin-mobile-nav-toggle"
        :aria-label="mobileOpen ? 'Închide Meniul Admin' : 'Deschide Meniul Admin'"
        :aria-expanded="mobileOpen"
        @click="handleToggleMobile"
      >
        <Icon icon="lucide:menu" width="18" height="18" />
      </button>

      <a href="/admin" class="admin-brand-link" @click.prevent="navigate('/admin')">
        <span class="admin-brand-icon-box">
          <img
            src="/logo.png"
            alt="Wildfire Logo"
            class="admin-brand-logo-img"
            width="20"
            height="20"
          />
        </span>
        <span class="admin-brand-text">WILDFIRE ADMIN</span>
        <span class="admin-brand-pill">ADMIN CENTER</span>
      </a>

      <div class="admin-header-divider" aria-hidden="true" />

      <div v-if="isMaintenance" class="admin-telemetry-badge admin-telemetry-badge--warning">
        <Icon icon="lucide:wrench" width="12" height="12" />
        <span>MAINTENANCE ACTIVE</span>
      </div>
      <div v-else class="admin-telemetry-badge">
        <Icon icon="lucide:radio" width="12" height="12" class="admin-live-pulse-dot" />
        <span>SYSTEM LIVE</span>
      </div>
    </div>

    <div class="admin-header-right">
      <!-- Main Docs Link -->
      <a
        href="/docs"
        target="_blank"
        rel="noopener noreferrer"
        class="admin-header-nav-link"
        title="Deschide Documentația Publică (Live Docs)"
      >
        <Icon icon="lucide:book-open" width="14" height="14" class="admin-header-docs-icon" />
        <span class="admin-header-nav-link-text">Live Docs</span>
        <Icon icon="lucide:arrow-up-right" width="11" height="11" class="admin-header-docs-arrow" />
      </a>

      <!-- Centru de Notificări & Alerte Interactive -->
      <AdminNotificationsCenter :current-username="props.user?.username || 'admin'" />

      <!-- Admin Dark / Light Mode Switch -->
      <AdminThemeToggle />

      <!-- User Session Profile Pill -->
      <a
        href="/admin/profile"
        class="admin-user-pill"
        title="Vezi Profilul Meu"
        @click.prevent="navigate('/admin/profile')"
      >
        <div v-if="liveAvatar && !avatarFailed" class="admin-user-avatar-wrap">
          <img
            :src="liveAvatar"
            :alt="liveDisplayName || props.user?.username || 'Admin'"
            class="admin-user-avatar-img"
            width="24"
            height="24"
            @error="avatarFailed = true"
          />
        </div>
        <span v-else class="admin-user-avatar-indicator">
          <Icon icon="lucide:shield-check" width="13" height="13" class="admin-user-shield" />
        </span>
        <div class="admin-user-details">
          <span class="admin-user-name">{{ liveDisplayName || props.user?.username || 'Admin' }}</span>
          <span
            class="admin-user-role"
            :class="{ 'admin-user-role--root': isRootUser }"
          >
            {{ isRootUser ? 'ROOT ADMIN' : (props.user?.role ? props.user.role.replace(/_/g, ' ') : 'SUPER ADMIN') }}
          </span>
        </div>
      </a>

      <!-- Logout Button -->
      <button
        type="button"
        class="admin-logout-btn"
        :disabled="loggingOut"
        title="Sign Out of Admin Mission Control"
        @click="handleLogout"
      >
        <Icon icon="lucide:log-out" width="14" height="14" />
        <span>{{ loggingOut ? 'Exiting...' : 'Logout' }}</span>
      </button>
    </div>
  </header>
</template>
