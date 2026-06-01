<template>
  <div v-if="relatedPages.length" :class="['rp-widget', { 'is-visible': isVisible }]">
    <div class="rp-header">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
      </svg>
      <span>Pagini Asemanatoare</span>
    </div>
    <div class="rp-list">
      <a
        v-for="p in relatedPages"
        :key="p.link"
        :href="p.link"
        class="rp-item"
      >
        <span class="rp-item__icon" v-html="p.iconSvg"></span>
        <span class="rp-item__body">
          <span class="rp-item__title">{{ p.title }}</span>
          <span v-if="p.desc" class="rp-item__desc">{{ p.desc }}</span>
        </span>
        <svg class="rp-item__arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, theme, page } = useData()

// Scroll-based visibility
const isVisible = ref(false)
const SCROLL_THRESHOLD = 200

function onScroll() {
  isVisible.value = window.scrollY > SCROLL_THRESHOLD
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Flatten sidebar items recursively
function flattenSidebar(items, depth = 0) {
  const result = []
  for (const item of (items || [])) {
    if (item.link && item.text) {
      result.push({ link: item.link, text: item.text })
    }
    if (item.items) {
      result.push(...flattenSidebar(item.items, depth + 1))
    }
  }
  return result
}

// Strip HTML tags from sidebar text
function cleanText(t) {
  return t ? t.replace(/<[^>]+>/g, '').trim() : ''
}

// Generic link icons
const LINK_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`

const relatedPages = computed(() => {
  // 1. Manual override via frontmatter: related: [{ link, title, desc }] or ['/path']
  const manualRaw = frontmatter.value.related
  if (manualRaw && Array.isArray(manualRaw) && manualRaw.length) {
    return manualRaw.slice(0, 4).map(r => {
      if (typeof r === 'string') return { link: r, title: r.split('/').pop() || r, desc: '', iconSvg: LINK_ICON }
      return { link: r.link || '#', title: r.title || cleanText(r.link), desc: r.desc || '', iconSvg: LINK_ICON }
    })
  }

  // 2. Auto-suggest: find pages in the same sidebar section
  const currentPath = '/' + page.value.relativePath.replace(/\.md$/, '').replace(/\/index$/, '/')
  const sidebar = theme.value.sidebar || []
  const allItems = flattenSidebar(Array.isArray(sidebar) ? sidebar : Object.values(sidebar).flat())

  // Find the section root the current page belongs to (e.g. /market/ or /systems/)
  const currentSection = currentPath.split('/').filter(Boolean)[0] || ''

  const siblings = allItems.filter(item => {
    if (!item.link) return false
    const link = item.link.startsWith('/') ? item.link : '/' + item.link
    if (link === currentPath) return false  // skip self
    const section = link.split('/').filter(Boolean)[0] || ''
    return section === currentSection
  })

  // Shuffle a bit and take up to 4
  const picked = siblings.slice(0, 8)
  // Simple deterministic "shuffle" based on current path char codes
  const seed = currentPath.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  picked.sort((a, b) => (a.link.charCodeAt(seed % a.link.length) - b.link.charCodeAt(seed % b.link.length)))

  return picked.slice(0, 4).map(item => ({
    link: item.link,
    title: cleanText(item.text),
    desc: '',
    iconSvg: LINK_ICON,
  }))
})
</script>

<style scoped>
.rp-widget {
  margin-top: 0;
  padding: 0;
  border: none;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transform: translateY(20px);
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.rp-widget.is-visible {
  margin-top: 20px;
  padding: 16px;
  opacity: 1;
  max-height: 600px;
  transform: translateY(0);
  pointer-events: auto;
  background: linear-gradient(145deg, rgba(var(--wf-accent-rgb), 0.03) 0%, rgba(var(--wf-accent-rgb), 0.01) 100%);
  border: 1px solid rgba(var(--wf-accent-rgb), 0.08);
  border-radius: 12px;
}

.rp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(var(--wf-accent-rgb), 0.1);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--vp-c-text-2);
}

.rp-header svg {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px rgba(var(--wf-accent-rgb), 0.3));
}

.rp-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rp-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  border: 1px solid transparent;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  background: rgba(var(--wf-accent-rgb), 0.02);
  position: relative;
  overflow: hidden;
}

.rp-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(var(--wf-accent-rgb), 0.1) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rp-item:hover {
  background: rgba(var(--wf-accent-rgb), 0.08);
  border-color: rgba(var(--wf-accent-rgb), 0.2);
  color: var(--vp-c-text-1);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(var(--wf-accent-rgb), 0.1);
}

.rp-item:hover::before {
  opacity: 1;
}

.rp-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(var(--wf-accent-rgb), 0.12) 0%, rgba(var(--wf-accent-rgb), 0.06) 100%);
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
  transition: all 0.25s ease;
  position: relative;
  z-index: 1;
}

.rp-item:hover .rp-item__icon {
  background: linear-gradient(135deg, rgba(var(--wf-accent-rgb), 0.2) 0%, rgba(var(--wf-accent-rgb), 0.1) 100%);
  transform: scale(1.05);
}

.rp-item__icon :deep(svg) { 
  display: block;
  transition: transform 0.25s ease;
}

.rp-item:hover .rp-item__icon :deep(svg) {
  transform: rotate(5deg);
}

.rp-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rp-item__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.18s ease;
}

.rp-item:hover .rp-item__title {
  color: var(--vp-c-brand-1);
}

.rp-item__desc {
  font-size: 11px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rp-item__arrow {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  z-index: 1;
}

.rp-item:hover .rp-item__arrow {
  opacity: 1;
  transform: translateX(2px);
  color: var(--vp-c-brand-1);
}

/* Staggered animation for items */
.rp-item:nth-child(1) { transition-delay: 0ms; }
.rp-item:nth-child(2) { transition-delay: 30ms; }
.rp-item:nth-child(3) { transition-delay: 60ms; }
.rp-item:nth-child(4) { transition-delay: 90ms; }
</style>
