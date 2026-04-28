<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const isHome = computed(() => frontmatter.value.layout === 'home')

function toggleSidebar() {
  const isCollapsed = document.documentElement.classList.contains('sidebar-collapsed')
  if (isCollapsed) {
    document.documentElement.classList.remove('sidebar-collapsed')
    localStorage.setItem('wf-sidebar-collapsed', 'false')
  } else {
    document.documentElement.classList.add('sidebar-collapsed')
    localStorage.setItem('wf-sidebar-collapsed', 'true')
  }
}

function openSearch() {
  const ctrlK = new KeyboardEvent('keydown', {
    key: 'k',
    ctrlKey: true,
    bubbles: true,
    cancelable: true
  })
  const metaK = new KeyboardEvent('keydown', {
    key: 'k',
    metaKey: true,
    bubbles: true,
    cancelable: true
  })
  
  window.dispatchEvent(ctrlK)
  window.dispatchEvent(metaK)
}
</script>

<template>
  <div v-if="!isHome" class="wf-floating-controls">
    <a class="wf-fc-logo" href="/">
      <img src="/icons/wildfire.webp" width="20" height="20" alt="Logo" />
      <span class="wf-fc-logo-text">Wildfire.ro Docs</span>
    </a>
    <div class="wf-fc-divider"></div>
    <button class="wf-fc-btn" @click="toggleSidebar" aria-label="Toggle Sidebar" title="Toggle Sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wf-fc-icon">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
      </svg>
    </button>
    <button class="wf-fc-btn" @click="openSearch" aria-label="Search" title="Search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wf-fc-icon">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </button>
  </div>
</template>

<style>
.wf-fc-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  text-decoration: none;
  transition: opacity 0.15s;
}

.wf-fc-logo:hover {
  opacity: 0.8;
}

.wf-fc-logo-text {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.wf-fc-divider {
  width: 1px;
  height: 18px;
  background: var(--vp-c-divider);
  margin: 0 4px;
}

.wf-fc-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.wf-fc-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.wf-fc-icon {
  width: 15px;
  height: 15px;
}

@media (max-width: 959px) {
  html.sidebar-collapsed .wf-floating-controls {
    display: none !important;
  }
}
</style>
