<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { searchState } from '../../store';
import { layout } from '../../composables/useLayout';
import { api } from '../../composables/useApi';
import LayoutControls from '../ui/LayoutControls.vue';
import ThemeToggle from '../ui/ThemeToggle.vue';

interface AdminHeaderUser {
  username: string;
  displayName: string;
  role: string;
  isRoot: boolean;
  avatarUrl: string;
  customTitle?: string;
}

const adminUser = ref<AdminHeaderUser | null>(null);
const isMac = ref(false);

function toggleMobileSidebar() {
  layout.mobileOpen = !layout.mobileOpen;
  const sidebar = document.getElementById('docs-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.setAttribute('data-open', layout.mobileOpen ? 'true' : 'false');
  if (overlay) overlay.setAttribute('data-open', layout.mobileOpen ? 'true' : 'false');
  if (typeof document !== 'undefined') {
    document.body.style.overflow = layout.mobileOpen ? 'hidden' : '';
  }
}

onMounted(async () => {
  if (typeof navigator !== 'undefined') {
    isMac.value = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
  }

  try {
    const data = await api('/api/admin/auth/me');
    if (data?.authenticated && data.user) {
      adminUser.value = data.user;
    }
  } catch {}
});
</script>

<template>
  <header class="header" role="banner">
    <div class="header-inner">
      <!-- Left: Brand Logo + Mobile toggle -->
      <div class="header-left">
        <button
          type="button"
          class="mobile-menu-toggle"
          :aria-label="layout.mobileOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="layout.mobileOpen"
          aria-controls="docs-sidebar"
          @click="toggleMobileSidebar"
        >
          <Icon :icon="layout.mobileOpen ? 'lucide:x' : 'lucide:menu'" width="20" height="20" />
        </button>

        <a href="/docs" class="header-logo" aria-label="Go to docs home">
          <span class="header-logo-icon" aria-hidden="true">
            <img
              src="/logo.png"
              alt="Wildfire Logo"
              class="header-logo-img"
              width="20"
              height="20"
            />
          </span>
          <span class="header-logo-text">
            <span class="header-logo-name">WILDFIRE</span>
            <span class="header-logo-badge">DOCS</span>
          </span>
          <span class="header-version-pill" aria-label="Platform Version">
            v1.8.5
          </span>
        </a>
      </div>

      <!-- Center: Frosted Glass Search Trigger -->
      <div class="header-center">
        <button
          type="button"
          class="header-search-btn"
          id="search-trigger"
          aria-label="Open search dialog"
          @click="searchState.open()"
        >
          <Icon icon="lucide:search" width="14" height="14" class="header-search-icon" aria-hidden="true" />
          <span class="header-search-text">Search documentation &amp; APIs...</span>
          <kbd class="header-search-kbd">
            {{ isMac ? '⌘K' : 'Ctrl K' }}
          </kbd>
        </button>
      </div>

      <!-- Right: Mobile Search + Layout Switcher + Admin PFP + GitHub + Theme toggle -->
      <div class="header-right">
        <button
          type="button"
          class="header-mobile-search-btn"
          aria-label="Open search dialog"
          title="Search documentation"
          @click="searchState.open()"
        >
          <Icon icon="lucide:search" width="16" height="16" />
        </button>

        <LayoutControls />

        <!-- Direct Admin PFP Circle Icon if authenticated -->
        <template v-if="adminUser">
          <div class="header-divider" aria-hidden="true" />
          <a
            href="/admin"
            class="header-admin-avatar-btn"
            :title="`Panou Administrare (Mission Control) · @${adminUser.username}`"
            :aria-label="`Deschide Panoul Admin - @${adminUser.username}`"
          >
            <img
              :src="adminUser.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'"
              :alt="adminUser.displayName || adminUser.username"
              class="header-admin-circle-img"
              width="26"
              height="26"
            />
          </a>
        </template>

        <div class="header-divider" aria-hidden="true" />

        <a
          href="https://github.com/WildFiire/docs"
          target="_blank"
          rel="noopener noreferrer"
          class="header-icon-btn"
          aria-label="View on GitHub"
          title="GitHub Repository"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
