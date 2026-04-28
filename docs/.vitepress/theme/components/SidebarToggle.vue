<template>
  <div v-if="!isHome" class="wf-sidebar-header" :class="{ 'is-collapsed': collapsed }">
    <a class="wf-logo-link" href="/">
      <img src="/icons/wildfire.webp" width="22" height="22" alt="Wildfire Logo" />
      <span v-if="!collapsed" class="wf-logo-text">Wildfire.ro Docs</span>
    </a>
    <button
      class="wf-sidebar-toggle-btn"
      :class="{ 'is-collapsed': collapsed }"
      @click.stop.prevent="toggleCollapse"
      :aria-label="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" class="wf-st-icon" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 3v18"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const isHome = computed(() => frontmatter.value.layout === 'home')

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
.wf-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 14px 2px;
  background: transparent;
  transition: all 0.3s ease;
}

.wf-logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.wf-logo-text {
  font-weight: 700;
  font-size: 14px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.wf-sidebar-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.wf-sidebar-toggle-btn:hover {
  opacity: 1;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.wf-st-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-collapsed .wf-st-icon {
  transform: scaleX(-1);
}

/* Show header on all devices if it's not home */
.wf-sidebar-header {
  display: flex;
}

.is-collapsed.wf-sidebar-header {
  padding: 12px 0 10px;
  flex-direction: column;
  gap: 16px;
}
</style>
