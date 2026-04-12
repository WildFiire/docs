<template>
  <div class="sidebar-bookmarks">
    <button class="sbm-header" @click="toggle">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="sbm-label">My Bookmarks</span>
      <span v-if="bookmarks.length" class="sbm-count">{{ bookmarks.length }}</span>
      <svg class="sbm-chevron" :class="{ collapsed }" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>
    <Transition name="sbm-collapse">
      <div v-if="!collapsed" class="sbm-body">
        <div v-if="bookmarks.length" class="sbm-list">
          <a
            v-for="bm in bookmarks.slice(0, 6)"
            :key="bm.path"
            :href="bm.path"
            class="sbm-item"
            :class="{ active: bm.path === currentPath }"
            @click.prevent="navigate(bm.path)"
          >
            <svg viewBox="0 0 24 24" width="11" height="11" fill="var(--vp-c-brand-1)" stroke="var(--vp-c-brand-1)" stroke-width="2" class="sbm-icon">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="sbm-name">{{ bm.title }}</span>
          </a>
        </div>
        <div v-else class="sbm-empty">
          <span>No bookmarks yet</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData, useRouter } from 'vitepress'

const STORAGE_KEY = 'wildfire-bookmarks'
const { page } = useData()
const router = useRouter()

const COLLAPSE_KEY = 'wildfire-bookmarks-collapsed'
const bookmarks = ref([])
const collapsed = ref(false)

function toggle() {
  collapsed.value = !collapsed.value
  try { localStorage.setItem(COLLAPSE_KEY, collapsed.value ? '1' : '0') } catch {}
}

const currentPath = computed(() =>
  page.value.relativePath
    ? '/' + page.value.relativePath.replace(/\.md$/, '.html').replace(/index\.html$/, '')
    : ''
)

function load() {
  try {
    bookmarks.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { bookmarks.value = [] }
}

function navigate(path) {
  router.go(path)
}

let interval
onMounted(() => {
  load()
  try { collapsed.value = localStorage.getItem(COLLAPSE_KEY) === '1' } catch {}
  interval = setInterval(load, 2000)
})
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.sidebar-bookmarks {
  padding: 8px 12px 12px;
  margin: 0 0 4px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sbm-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 4px 0;
  margin-bottom: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-brand-1);
  transition: opacity 0.15s ease;
}

.sbm-header:hover {
  opacity: 0.8;
}

.sbm-chevron {
  transition: transform 0.2s ease;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.sbm-chevron.collapsed {
  transform: rotate(-90deg);
}

.sbm-body {
  overflow: hidden;
}

.sbm-empty {
  padding: 6px 8px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.sbm-collapse-enter-active,
.sbm-collapse-leave-active {
  transition: all 0.2s ease;
}

.sbm-collapse-enter-from,
.sbm-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.sbm-collapse-enter-to,
.sbm-collapse-leave-from {
  opacity: 1;
  max-height: 300px;
}

.sbm-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--vp-c-text-2);
  flex: 1;
}

.sbm-count {
  font-size: 9px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  padding: 1px 6px;
  border-radius: 10px;
}

.sbm-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sbm-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 8px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  font-size: 12px;
  transition: all 0.15s ease;
  line-height: 1.3;
}

.sbm-item:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.sbm-item.active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
}

.sbm-icon {
  flex-shrink: 0;
}

.sbm-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
</style>
