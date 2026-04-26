<template>
  <button
    class="wf-sidebar-toggle-btn"
    :class="{ 'is-collapsed': collapsed }"
    @click.stop.prevent="toggleCollapse"
    :aria-label="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
    :title="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
  >
    <!-- Panel-left icon: flips horizontally when collapsed -->
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" class="wf-st-icon" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const collapsed = ref(false)
let observer = null

onMounted(() => {
  collapsed.value = document.documentElement.classList.contains('sidebar-collapsed')

  observer = new MutationObserver(() => {
    collapsed.value = document.documentElement.classList.contains('sidebar-collapsed')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => observer?.disconnect())

function toggleCollapse() {
  const isCollapsed = document.documentElement.classList.contains('sidebar-collapsed')
  if (isCollapsed) {
    document.documentElement.classList.remove('sidebar-collapsed')
    localStorage.setItem('wf-sidebar-collapsed', 'false')
  } else {
    document.documentElement.classList.add('sidebar-collapsed')
    localStorage.setItem('wf-sidebar-collapsed', 'true')
  }
}
</script>

<style scoped>
.wf-sidebar-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.wf-sidebar-toggle-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.wf-st-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mirror horizontally when collapsed so the "panel" appears on the right */
.is-collapsed .wf-st-icon {
  transform: scaleX(-1);
}

/* Hide on mobile — VitePress has its own hamburger */
@media (max-width: 959px) {
  .wf-sidebar-toggle-btn {
    display: none;
  }
}
</style>
