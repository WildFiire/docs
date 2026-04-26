<template>
  <div class="wf-floating-controls">
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

<script setup>
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
  const searchBtn = document.querySelector('.DocSearch-Button') || document.querySelector('.local-search')
  if (searchBtn) {
    searchBtn.click()
  } else {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }
}
</script>

<style>
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
