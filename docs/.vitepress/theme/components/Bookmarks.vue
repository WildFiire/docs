<template>
  <!-- Bookmark toggle on doc pages -->
  <Transition name="bm-fade">
    <button
      v-if="isDocPage"
      class="bookmark-page-btn"
      :class="{ active: isCurrentBookmarked }"
      @click="toggleBookmark"
      :aria-label="isCurrentBookmarked ? 'Remove bookmark' : 'Bookmark this page'"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" :fill="isCurrentBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  </Transition>

  <!-- FAB toggle -->
  <button
    class="bookmarks-fab"
    :class="{ active: panelOpen, 'has-items': bookmarks.length > 0 }"
    @click="panelOpen = !panelOpen"
    aria-label="Bookmarks"
  >
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
    <span v-if="bookmarks.length" class="bm-count">{{ bookmarks.length }}</span>
  </button>

  <!-- Panel -->
  <Transition name="bm-panel">
    <div v-if="panelOpen" class="bookmarks-panel">
      <div class="bm-header">
        <h3>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          Reading List
        </h3>
        <span class="bm-badge">{{ bookmarks.length }}</span>
      </div>

      <div v-if="!bookmarks.length" class="bm-empty">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <p>No bookmarks yet</p>
        <span>Click the bookmark icon on any page to save it here</span>
      </div>

      <div v-else class="bm-list">
        <a
          v-for="bm in bookmarks"
          :key="bm.path"
          :href="bm.path"
          class="bm-item"
          :class="{ current: bm.path === currentPath }"
          @click.prevent="navigate(bm.path)"
        >
          <div class="bm-item-content">
            <span class="bm-item-title">{{ bm.title }}</span>
            <span class="bm-item-path">{{ bm.section }}</span>
          </div>
          <button
            class="bm-remove"
            @click.stop.prevent="removeBookmark(bm.path)"
            aria-label="Remove bookmark"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </a>
      </div>

      <div v-if="bookmarks.length" class="bm-footer">
        <button class="bm-clear" @click="clearAll">Clear all</button>
      </div>
    </div>
  </Transition>

  <!-- Backdrop -->
  <Transition name="bm-fade">
    <div v-if="panelOpen" class="bm-backdrop" @click="panelOpen = false"></div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useData, useRouter } from 'vitepress'

const STORAGE_KEY = 'wildfire-bookmarks'

const { page } = useData()
const router = useRouter()

const panelOpen = ref(false)
const bookmarks = ref([])

const currentPath = computed(() => page.value.relativePath
  ? '/' + page.value.relativePath.replace(/\.md$/, '.html').replace(/index\.html$/, '')
  : ''
)

const isDocPage = computed(() => {
  const path = currentPath.value
  return path && !path.includes('/panel') && path !== '/' && path !== '/index.html'
})

const isCurrentBookmarked = computed(() =>
  bookmarks.value.some(bm => bm.path === currentPath.value)
)

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    bookmarks.value = raw ? JSON.parse(raw) : []
  } catch { bookmarks.value = [] }
}

function saveBookmarks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
}

function getPageTitle() {
  const h1 = document.querySelector('.vp-doc h1')
  return h1?.textContent?.replace(/\s*#\s*$/, '').trim() || page.value.title || 'Untitled'
}

function getSection() {
  const parts = currentPath.value.split('/').filter(Boolean)
  return parts.length > 1 ? parts[0] : 'docs'
}

function toggleBookmark() {
  const path = currentPath.value
  if (!path) return

  const idx = bookmarks.value.findIndex(bm => bm.path === path)
  if (idx >= 0) {
    bookmarks.value.splice(idx, 1)
  } else {
    bookmarks.value.unshift({
      path,
      title: getPageTitle(),
      section: getSection(),
      added: Date.now()
    })
  }
  saveBookmarks()
}

function removeBookmark(path) {
  bookmarks.value = bookmarks.value.filter(bm => bm.path !== path)
  saveBookmarks()
}

function clearAll() {
  bookmarks.value = []
  saveBookmarks()
}

function navigate(path) {
  panelOpen.value = false
  router.go(path)
}

function onKeydown(e) {
  if (e.key === 'Escape' && panelOpen.value) {
    panelOpen.value = false
  }
}

onMounted(() => {
  loadBookmarks()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch(() => page.value.relativePath, () => {
  loadBookmarks()
})
</script>

<style scoped>
/* ── Bookmark page button (top-right of doc) ── */
.bookmark-page-btn {
  position: fixed;
  top: 72px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 120, 0, 0.2);
  background: rgba(10, 10, 10, 0.8);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  color: #8a8a95;
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;
}

.bookmark-page-btn:hover {
  border-color: rgba(255, 120, 0, 0.5);
  color: #ff7800;
}

.bookmark-page-btn.active {
  color: #ff7800;
  border-color: rgba(255, 120, 0, 0.4);
  background: rgba(255, 120, 0, 0.1);
}

/* ── FAB ── */
.bookmarks-fab {
  position: fixed;
  bottom: 2rem;
  left: 1.5rem;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 120, 0, 0.25);
  background: rgba(10, 10, 10, 0.75);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  color: #8a8a95;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;
}

.bookmarks-fab:hover,
.bookmarks-fab.active {
  border-color: rgba(255, 120, 0, 0.55);
  color: #ff7800;
}

.bm-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: #ff7800;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  line-height: 1;
}

/* ── Panel ── */
.bookmarks-panel {
  position: fixed;
  bottom: 5rem;
  left: 1.5rem;
  width: 320px;
  max-height: 460px;
  background: rgba(15, 15, 18, 0.95);
  border: 1px solid rgba(255, 120, 0, 0.15);
  border-radius: 16px;
  z-index: 9999;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.bm-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  letter-spacing: 0.5px;
}

.bm-header h3 svg {
  color: #ff7800;
}

.bm-badge {
  font-size: 10px;
  font-weight: 700;
  background: rgba(255, 120, 0, 0.15);
  color: #ff7800;
  padding: 2px 8px;
  border-radius: 10px;
}

/* ── Empty state ── */
.bm-empty {
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bm-empty p {
  color: #8a8a95;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}

.bm-empty span {
  color: #555;
  font-size: 11px;
}

/* ── List ── */
.bm-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.bm-list::-webkit-scrollbar {
  width: 4px;
}

.bm-list::-webkit-scrollbar-thumb {
  background: rgba(255, 120, 0, 0.2);
  border-radius: 2px;
}

.bm-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #ccc;
  transition: all 0.15s ease;
  cursor: pointer;
}

.bm-item:hover {
  background: rgba(255, 120, 0, 0.08);
  color: #fff;
}

.bm-item.current {
  background: rgba(255, 120, 0, 0.1);
  border-left: 2px solid #ff7800;
}

.bm-item-content {
  flex: 1;
  min-width: 0;
}

.bm-item-title {
  display: block;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bm-item-path {
  display: block;
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.bm-remove {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.bm-remove:hover {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

/* ── Footer ── */
.bm-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.bm-clear {
  background: none;
  border: none;
  color: #666;
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.bm-clear:hover {
  color: #e74c3c;
}

/* ── Backdrop ── */
.bm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9997;
  background: rgba(0, 0, 0, 0.3);
}

/* ── Transitions ── */
.bm-panel-enter-active,
.bm-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.bm-panel-enter-from,
.bm-panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}

.bm-fade-enter-active,
.bm-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bm-fade-enter-from,
.bm-fade-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .bookmarks-panel {
    left: 8px;
    right: 8px;
    width: auto;
    bottom: 5rem;
  }

  .bookmark-page-btn {
    top: auto;
    bottom: 5.5rem;
    right: 1.5rem;
  }
}
</style>
