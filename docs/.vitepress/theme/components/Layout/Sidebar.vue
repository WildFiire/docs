<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useData, useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import { layout, toggleSidebar } from '../../composables/useLayout';
import SidebarItem from './SidebarItem.vue';
import SidebarShuffleCard from './SidebarShuffleCard.vue';
import LiquidFireWave from '../ui/LiquidFireWave.vue';

import canonicalNavigation from '../../data/navigation.json';

const { theme } = useData();
const route = useRoute();

const sections = computed(() => {
  if (canonicalNavigation && canonicalNavigation.length > 0) return canonicalNavigation;
  if (Array.isArray(theme.value.sidebar)) return theme.value.sidebar;
  return Object.values(theme.value.sidebar || {}).flat();
});

const isAllExpanded = ref(true);
const globalExpandState = ref<boolean | null>(null);

function toggleExpandAll() {
  isAllExpanded.value = !isAllExpanded.value;
  globalExpandState.value = isAllExpanded.value;
}

function closeMobileSidebar() {
  if (typeof window !== 'undefined') {
    layout.mobileOpen = false;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && layout.mobileOpen) {
    layout.mobileOpen = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown);
  }
});
</script>

<template>
  <!-- Mobile Backdrop Overlay -->
  <div
    id="sidebar-overlay"
    class="sidebar-overlay"
    aria-hidden="true"
    :data-open="layout.mobileOpen ? 'true' : 'false'"
    @click="closeMobileSidebar"
  />

  <!-- Floating expand button when sidebar is collapsed on desktop -->
  <button
    type="button"
    class="sidebar-floating-toggle"
    :class="{ 'sidebar-floating-toggle--visible': !layout.sidebarOpen }"
    title="Expand Left Sidebar (Shortcut: [)"
    aria-label="Expand sidebar"
    @click="toggleSidebar"
  >
    <Icon icon="lucide:panel-left-open" width="15" />
    <span class="floating-toggle-label">Sidebar</span>
  </button>

  <aside
    id="docs-sidebar"
    class="sidebar"
    :class="{
      'sidebar--open': layout.sidebarOpen,
      'sidebar--collapsed': !layout.sidebarOpen
    }"
    aria-label="Documentation navigation"
    :data-open="layout.mobileOpen ? 'true' : 'false'"
    :data-collapsed="!layout.sidebarOpen"
  >
    <!-- Pinned Top Bar with logo & collapse controls -->
    <div class="sidebar-top-bar">
      <div class="sidebar-brand-sub">
        <span class="sidebar-brand-icon-box">
          <img
            src="/logo.png"
            alt="Wildfire Logo"
            class="sidebar-brand-logo-img"
            width="14"
            height="14"
          />
        </span>
        <span class="sidebar-top-title">Navigation</span>
        <span class="sidebar-top-badge">Explorer</span>
      </div>

      <div class="sidebar-top-actions">
        <!-- Collapse All / Expand All Sections Button -->
        <button
          type="button"
          class="sidebar-action-btn sidebar-expand-all-btn"
          :title="isAllExpanded ? 'Restrânge toate secțiunile' : 'Extinde toate secțiunile'"
          :aria-label="isAllExpanded ? 'Collapse All Sections' : 'Expand All Sections'"
          @click="toggleExpandAll"
        >
          <Icon
            :icon="isAllExpanded ? 'lucide:chevrons-down-up' : 'lucide:chevrons-up-down'"
            width="13"
            aria-hidden="true"
          />
        </button>

        <!-- Sidebar Collapse Toggle -->
        <button
          type="button"
          class="sidebar-collapse-btn"
          title="Collapse Sidebar (Shortcut: [)"
          aria-label="Collapse sidebar"
          @click="toggleSidebar"
        >
          <Icon icon="lucide:panel-left-close" width="14" />
          <kbd class="sidebar-collapse-kbd" aria-hidden="true">[</kbd>
        </button>
      </div>
    </div>

    <!-- Scrollable Navigation Area with Smooth Fade-down Mask -->
    <div class="sidebar-scroll-wrapper">
      <div class="sidebar-inner">
        <nav aria-label="Docs sections">
          <!-- Overview / Introduction Link Group -->
          <div class="nav-group">
            <p class="nav-group-title">
              <Icon icon="lucide:layout-grid" width="12" class="nav-group-icon" aria-hidden="true" />
              <span>Overview</span>
            </p>
            <ul role="list" class="nav-list">
              <li>
                <a
                  href="/docs"
                  class="nav-item"
                  :class="{ 'nav-item--active': ['/', '/docs', '/docs/'].includes(route.path) }"
                  @click="closeMobileSidebar"
                >
                  <span class="nav-item-indicator" aria-hidden="true" />
                  <span class="nav-item-icon">
                    <Icon icon="lucide:compass" width="14" aria-hidden="true" />
                  </span>
                  <span class="nav-item-text">Documentation Hub</span>
                </a>
              </li>
              <li>
                <a
                  href="/changelog"
                  class="nav-item"
                  :class="{ 'nav-item--active': route.path.startsWith('/changelog') }"
                  @click="closeMobileSidebar"
                >
                  <span class="nav-item-indicator" aria-hidden="true" />
                  <span class="nav-item-icon">
                    <Icon icon="lucide:sparkles" width="14" aria-hidden="true" />
                  </span>
                  <span class="nav-item-text">Changelog &amp; Releases</span>
                  <span class="nav-item-badge badge--new">v1.8.5</span>
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  class="nav-item"
                  :class="{ 'nav-item--active': route.path.startsWith('/team') }"
                  @click="closeMobileSidebar"
                >
                  <span class="nav-item-indicator" aria-hidden="true" />
                  <span class="nav-item-icon">
                    <Icon icon="lucide:users" width="14" aria-hidden="true" />
                  </span>
                  <span class="nav-item-text">Our Team &amp; Contributors</span>
                  <span class="nav-item-badge badge--team">Staff</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Categorized Collapsible Groups -->
          <SidebarItem
            v-for="(item, i) in sections"
            :key="i"
            :item="item"
            :global-expand-state="globalExpandState"
          />
        </nav>
      </div>

      <!-- Smooth Fade Down Gradient Overlay -->
      <div class="sidebar-fade-down" aria-hidden="true" />
    </div>

    <!-- Pinned Bottom Dock: Always visible -->
    <div class="sidebar-bottom-dock">
      <SidebarShuffleCard />

      <div class="sidebar-footer">
        <div class="system-status-indicator">
          <span class="status-dot" aria-hidden="true" />
          <span class="status-label">WF-DOCSCORE v1.8.5</span>
        </div>
      </div>

      <div class="sidebar-wave-container">
        <LiquidFireWave :height="75" />
      </div>
    </div>
  </aside>
</template>
