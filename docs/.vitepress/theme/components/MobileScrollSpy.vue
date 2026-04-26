<template>
  <div v-if="show" class="wf-mspy">
    <!-- Sidebar open button -->
    <button class="wf-mspy-menu" @click="openSidebar" aria-label="Open sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- Scroll progress ring -->
    <svg class="wf-mspy-ring" viewBox="0 0 20 20" aria-hidden="true">
      <circle class="wf-mspy-ring-bg" cx="10" cy="10" r="8"/>
      <circle class="wf-mspy-ring-fill" cx="10" cy="10" r="8"
        :stroke-dasharray="`${progress * 50.27} 50.27`"/>
    </svg>

    <span class="wf-mspy-text">{{ current }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { frontmatter, page } = useData()
const current = ref('')
const show = ref(false)
const progress = ref(0)

function isDocPage() {
  // Skip home layout, panel/dashboard, and pages without doc content
  if (frontmatter.value.layout === 'home') return false
  const path = page.value.relativePath || route.path
  if (path.startsWith('index') || route.path === '/') return false
  if (route.path.startsWith('/panel')) return false
  // Only show if there's actual .vp-doc content with headings
  return document.querySelectorAll('main h2, main h3, .vp-doc h2, .vp-doc h3').length > 0
}

function getProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  return scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
}

const OFFSET = 120 // accounts for fixed navbar (64px) + spy bar (42px) + buffer

function getActive() {
  const sel = 'main h2, main h3, .vp-doc h2, .vp-doc h3, .VPDoc h2, .VPDoc h3'
  const headings = Array.from(document.querySelectorAll(sel))
  if (!headings.length) return ''
  let active = headings[0]
  for (const h of headings) {
    if (h.getBoundingClientRect().top < OFFSET) active = h
    else break
  }
  // Strip the anchor # character VitePress adds inside headings
  return active.textContent.replace(/^#\s*/, '').replace(/#/g, '').trim()
}

function openSidebar() {
  const btn = document.querySelector('.VPLocalNav .menu')
  if (btn) btn.click()
}

function onScroll() {
  current.value = getActive()
  progress.value = getProgress()
}

function setup() {
  if (typeof window === 'undefined' || window.innerWidth >= 960) {
    show.value = false
    return
  }
  if (!isDocPage()) {
    show.value = false
    return
  }
  show.value = true
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('scroll', onScroll)
  setTimeout(() => {
    current.value = getActive()
    // Listen on both — mobile browsers vary
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, { passive: true })
  }, 400)
}

onMounted(() => {
  setup()
  window.addEventListener('resize', setup)
})

watch(() => route.path, () => setTimeout(setup, 100))

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', setup)
})
</script>

<style>
/* Hide VPLocalNav on mobile — wf-mspy replaces it */
@media (max-width: 959px) {
  .VPLocalNav {
    display: none !important;
  }
}
</style>

<style scoped>
.wf-mspy {
  position: fixed;
  top: var(--vp-nav-height);
  left: 0;
  right: 0;
  z-index: 100;
  height: 42px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: var(--vp-c-bg-alt, #0a0a0a);
  border-bottom: 1px solid var(--vp-c-divider);
}

.wf-mspy-menu {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  border-radius: 6px;
  padding: 0;
}
.wf-mspy-menu:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.wf-mspy-menu svg {
  width: 16px;
  height: 16px;
}

.wf-mspy-ring {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  transform: rotate(-90deg);
}
.wf-mspy-ring-bg {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 2.5;
}
.wf-mspy-ring-fill {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.15s ease;
}

.wf-mspy-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 960px) {
  .wf-mspy {
    display: none;
  }
}
</style>
