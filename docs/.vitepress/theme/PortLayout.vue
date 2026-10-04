<script setup lang="ts">
import { computed, ref, onMounted, defineAsyncComponent, watch, onUnmounted } from 'vue';
import { useData, useRoute } from 'vitepress';
import AnnouncementBanner from './components/ui/AnnouncementBanner.vue';
import Sidebar from './components/Layout/Sidebar.vue';
import Header from './components/Layout/Header.vue';
import DocsHome from './components/Home/DocsHome.vue';
import TeamView from './components/team/TeamView.vue';
import ProductChangelog from './components/Pages/ProductChangelog.vue';
import CookieConsentBanner from './components/ui/CookieConsentBanner.vue';
import SearchModal from './components/Search/SearchModal.vue';
import MaintenanceScreen from './components/ui/MaintenanceScreen.vue';
import DocShell from './components/Layout/DocShell.vue';
import PageProgressBar from './components/ui/PageProgressBar.vue';
import TextSelectionAskAi from './components/Docs/TextSelectionAskAi.vue';
import DocsTransitionWrapper from './components/Docs/DocsTransitionWrapper.vue';
import LiquidEffects from './components/ui/LiquidEffects.vue';
import DocEnhancements from './components/Layout/DocEnhancements.vue';
import { searchState } from './store';
import { layout } from './composables/useLayout';
import { api } from './composables/useApi';

const Admin = defineAsyncComponent(() => import('./components/admin/AdminShell.vue')),
  AI = defineAsyncComponent(() => import('./components/ui/AiHelper.vue'));
const route = useRoute(),
  { frontmatter } = useData();

const isAdmin = computed(() => /^\/(admin|panel)(\/|$)/.test(route.path));
const home = computed(() => ['/', '/docs', '/docs/'].includes(route.path));
const isTeam = computed(() => /^\/(docs\/)?team(\/|$)/.test(route.path));
const isChangelog = computed(() => /^\/(docs\/)?changelog(\/|$)/.test(route.path));

const status = ref<any>({}),
  bypass = ref(false);

const maintenance = computed(
  () =>
    !isAdmin.value &&
    (/^\/maintenance\/?$/.test(route.path) || (status.value.maintenance?.enabled && !bypass.value)),
);

function keys(e: KeyboardEvent) {
  if (
    ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') ||
    (e.key === '/' && !(e.target as HTMLElement).closest('input,textarea,[contenteditable]'))
  ) {
    e.preventDefault();
    searchState.toggle();
  }
}

async function refreshStatus() {
  try {
    status.value = await api('/api/system/status');
    if (status.value.maintenance?.enabled) {
      const me = await api('/api/admin/auth/me');
      bypass.value = me.authenticated && status.value.maintenance.allowAdmins !== false;
    }
  } catch {}
}

let polling: ReturnType<typeof setInterval>;
onMounted(() => {
  refreshStatus();
  window.addEventListener('keydown', keys);
  polling = setInterval(refreshStatus, 30000);
});

onUnmounted(() => {
  clearInterval(polling);
  window.removeEventListener('keydown', keys);
});

watch(
  () => route.path,
  () => {
    layout.mobileOpen = false;
    searchState.close();
  },
);
</script>

<template>
  <!-- Instant Top Progress Bar -->
  <PageProgressBar />

  <ClientOnly v-if="isAdmin">
    <Admin />
  </ClientOnly>
  <MaintenanceScreen v-else-if="maintenance" :state="status.maintenance" />
  <div
    v-else
    class="docs-layout"
    :class="{ 'mobile-sidebar-open': layout.mobileOpen }"
  >
    <!-- Ambient Liquid Fire Background -->
    <LiquidEffects />

    <!-- Text Selection Quick AI Explainer -->
    <TextSelectionAskAi />

    <Header />
    <Sidebar />

    <div class="docs-main" id="docs-main-container">
      <DocsTransitionWrapper>
        <DocsHome v-if="home" />
        <TeamView v-else-if="isTeam" />
        <ProductChangelog v-else-if="isChangelog" />
        <DocShell v-else />
      </DocsTransitionWrapper>
    </div>

    <!-- Search Modal with DeepSearch & AI Spotlight -->
    <SearchModal
      :is-open="searchState.isOpen"
      @close="searchState.close()"
    />
  </div>

  <!-- AI Floating Helper Dock (aside) -->
  <AI />

  <!-- Cookie Consent Banner -->
  <CookieConsentBanner />

  <!-- Dynamic Doc DOM Enhancements (Callouts, Code Blocks, Progress) -->
  <DocEnhancements />
</template>
