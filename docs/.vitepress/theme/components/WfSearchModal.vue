<template>
  <Transition name="search-fade">
    <div v-if="searchState.isOpen" class="wf-search-overlay" @mousedown.self="close">
      <Transition name="search-scale" appear>
        <div v-if="searchState.isOpen" class="wf-search-modal" @mousedown.stop>

          <!-- Header -->
          <div class="search-header">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search documentation..."
              autocomplete="off"
              spellcheck="false"
              @keydown.esc="close"
              @keydown.down.prevent="moveSelection(1)"
              @keydown.up.prevent="moveSelection(-1)"
              @keydown.enter.prevent="selectActive"
            />
            <div class="header-actions">
              <button v-if="query" class="clear-btn" @click="clearQuery" aria-label="Clear">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
              <kbd class="esc-badge" @click="close">ESC</kbd>
            </div>
          </div>

          <!-- Body -->
          <Transition name="body-slide">
            <div class="search-body" ref="bodyRef" data-lenis-prevent>
              
              <!-- Start Typing State (Initial All filter) -->
              <div v-if="!query && activeFilter === 'all'" class="start-typing">
                <div class="typing-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </div>
                <div class="typing-text">Start typing to search...</div>
              </div>



              <!-- Filter section shortcuts (no query yet) -->
              <div v-else-if="!query && activeFilter !== 'all'" class="filter-section-links">
                <!-- Section description card -->
                <div class="fsl-header">
                  <div class="fsl-header-top">
                    <span class="fsl-dot" :style="{ background: filterDot }"></span>
                    <span class="fsl-title">{{ activeFilterLabel }}</span>
                  </div>
                  <p class="fsl-desc">{{ activeFilterDesc }}</p>
                </div>

                <!-- Page links -->
                <div class="fsl-label">Quick links</div>
                <div class="fsl-grid">
                  <div
                    v-for="page in sectionPages"
                    :key="page.link"
                    :ref="el => setItemRef(el, page.idx)"
                    class="fsl-item"
                    :class="{ active: activeIndex === page.idx }"
                    @mouseenter="activeIndex = page.idx"
                    @click="navigateTo(page.link)"
                  >
                    <div class="fsl-item-content">
                      <div class="fsl-item-title">{{ page.title }}</div>
                      <div class="fsl-item-path" v-if="page.section">{{ page.section }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="results-meta" v-if="results.length > 0">
                Results for "{{ query }}"
              </div>

              <!-- Results List -->
              <div v-if="results.length > 0" class="search-results">
                <div
                  v-for="(res, idx) in results"
                  :key="res.link"
                  :ref="el => setItemRef(el, idx)"
                  class="result-item"
                  :class="{ active: activeIndex === idx }"
                  @mouseenter="activeIndex = idx"
                  @click="navigateTo(res.link)"
                >
                  <div class="res-content">
                    <div class="res-top-meta">
                      <span class="res-section-badge" v-if="res.section">{{ res.section }}</span>
                      <div class="res-breadcrumb" v-if="res.breadcrumb">
                        {{ res.breadcrumb }}
                      </div>
                    </div>
                    <div class="res-title" v-html="highlightText(res.title)" />
                    <div class="res-excerpt" v-if="res.snippet" v-html="highlightText(res.snippet)" />
                  </div>
                  
                  <div class="res-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Empty State (No results found) -->
              <div v-else-if="query" class="search-empty">



              </div>
            </div>
          </Transition>

          <!-- Footer / Filter Bar -->
          <div class="search-footer">
            <!-- Filter dropdown -->
            <div class="filter-zone">
              <button class="filter-trigger" @click.stop="filterOpen = !filterOpen" :class="{ active: activeFilter !== 'all' }">
                <span class="filter-dot" :style="{ background: filterDot }"></span>
                {{ activeFilterLabel }}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }"><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              <!-- Liquid Glass Popout -->
              <Transition name="filter-pop">
                <div v-if="filterOpen" class="filter-popout" @mousedown.stop>
                  <div class="fp-title">Filter by section</div>
                  <div class="fp-grid">
                    <button
                      v-for="f in filterOptions" :key="f.id"
                      class="fp-option"
                      :class="{ active: activeFilter === f.id }"
                      @click="setFilter(f.id)"
                    >
                      <span class="fp-dot" :style="{ background: f.color }"></span>
                      <span class="fp-name">{{ f.label }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="footer-right">
              <span class="watermark-text">Powered by</span>
              <div class="watermark-brand notranslate">
                <img src="/icons/wildfire.webp" alt="Wildfire Logo" class="watermark-logo" />
                <span class="brand-name">Wildfire</span>
              </div>
            </div>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted, markRaw, shallowRef } from 'vue'
import { useRouter, useData, inBrowser } from 'vitepress'
import { searchState } from '../store'
import MiniSearch from 'minisearch'
// @ts-ignore
import localSearchIndex from '@localSearchIndex'

const router = useRouter()
const { localeIndex } = useData()

/* ── Scroll lock ─────────────────────────────────────────── */
watch(() => searchState.isOpen, (open) => {
  if (!inBrowser) return
  if (open) {
    document.documentElement.classList.add('search-open')
  } else {
    document.documentElement.classList.remove('search-open')
  }
})

/* ── State ───────────────────────────────────────────────── */
const query       = ref('')
const inputRef    = ref<HTMLInputElement | null>(null)
const bodyRef     = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const itemRefs    = ref<(Element | null)[]>([])
const filterOpen  = ref(false)
const activeFilter = ref('all')

/* ── Filter config (matches real wiki structure) ─────────── */
const filterOptions = [
  { id: 'all',        label: 'All',         desc: 'Search everything',              color: '#a1a1aa' },
  { id: 'informatii', label: 'Information', desc: 'Guides, FAQ, Regulations',       color: '#3b82f6' },
  { id: 'systems',    label: 'Systems',     desc: 'Server mechanics & features',    color: '#ff7800' },
  { id: 'currency',   label: 'Currency',    desc: 'Phoenix Coins & Credits',        color: '#eab308' },
  { id: 'market',     label: 'Market',      desc: 'VIP, Shop & Server Slots',       color: '#8b5cf6' },
  { id: 'gambling',   label: 'Gambling',    desc: 'Slots, Roulette & Dice',         color: '#ec4899' },
  { id: 'skins',      label: 'Skins',       desc: 'Weapons, Knives, Agents & Cases',color: '#10b981' },
]

const activeFilterLabel = computed(() => filterOptions.find(f => f.id === activeFilter.value)?.label ?? 'All')
const activeFilterDesc  = computed(() => filterOptions.find(f => f.id === activeFilter.value)?.desc ?? '')
const filterDot = computed(() => filterOptions.find(f => f.id === activeFilter.value)?.color ?? '#a1a1aa')

const setFilter = (id: string) => { 
  activeFilter.value = id
  filterOpen.value = false
  activeIndex.value = 0
  nextTick(() => inputRef.value?.focus())
}

// Close filter popout on outside click
const onDocClick = () => { filterOpen.value = false }
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

const setItemRef = (el: any, idx: number) => {
  itemRefs.value[idx] = el as Element | null
}

const clearQuery = () => {
  query.value = ''
  nextTick(() => inputRef.value?.focus())
}

/* ── Search index ────────────────────────────────────────── */
const searchIndexData = shallowRef(localSearchIndex)
const searchIndex     = ref<MiniSearch | null>(null)

const loadSearchIndex = async () => {
  const locale      = localeIndex.value || 'root'
  const indexLoader = searchIndexData.value[locale] || searchIndexData.value['root']
  if (!indexLoader) return
  try {
    const data = await indexLoader()
    if (data) {
      searchIndex.value = markRaw(
        MiniSearch.loadJSON(data.default, {
          fields: ['title', 'titles', 'text', 'headers'],
          storeFields: ['title', 'titles', 'text', 'headers'],
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 6, titles: 4, headers: 3, text: 1 }
          }
        })
      )
    }
  } catch (err) {
    console.error('[WfSearch] Failed to load index:', err)
  }
}

onMounted(loadSearchIndex)

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept('@localSearchIndex', (m: any) => {
    if (m) { searchIndexData.value = m.default; loadSearchIndex() }
  })
}

/* ── Results ─────────────────────────────────────────────── */
const rawResults = ref<any[]>([])

watch(query, (newQuery) => {
  itemRefs.value = []
  if (!newQuery || !searchIndex.value) { rawResults.value = []; return }

  const hits = searchIndex.value.search(newQuery)
  rawResults.value = hits.map(r => {
    const titles  = (r.titles as string[]) || []
    const rawText = (r.text as string) || ''
    const snippet = extractSnippet(rawText, newQuery)
    
    // Extract section from link (e.g. /informatii/about -> Information)
    const link = r.id as string
    const parts = link.split('/').filter(Boolean)
    let sectionLabel = ''
    if (parts.length > 0) {
      const firstPart = parts[0]
      const opt = filterOptions.find(o => o.id === firstPart)
      sectionLabel = opt ? opt.label : firstPart.charAt(0).toUpperCase() + firstPart.slice(1)
    }

    return {
      title:      r.title as string,
      breadcrumb: titles.join(' / '),
      section:    sectionLabel,
      link,
      snippet,
    }
  })
  activeIndex.value = 0
})

const results = computed(() => {
  if (!query.value) return []
  const filter = activeFilter.value
  if (filter === 'all') return rawResults.value.slice(0, 40)
  return rawResults.value.filter(r => {
    const link = (r.link as string).toLowerCase()
    if (filter === 'skins')    return link.includes('/skins/') || link.includes('/shop/')
    if (filter === 'gambling') return link.includes('/gambling/')
    if (filter === 'market')   return link.includes('/market/')
    return link.startsWith(`/${filter}/`) || link.includes(`/${filter}/`)
  }).slice(0, 40)
})

watch(activeFilter, () => { activeIndex.value = 0; itemRefs.value = [] })

/* ── Dynamic Section Mapping (Extracted from config.mts) ───── */
const { theme } = useData()

const SECTION_MAP = computed(() => {
  const map: Record<string, any[]> = {}
  const sidebar = theme.value.sidebar || []
  
  // Helper to strip HTML/Iconify tags
  const strip = (html: string) => (html || '').replace(/<[^>]*>?/gm, '').trim()

  sidebar.forEach((group: any) => {
    if (!group.items) return
    
    const traverse = (items: any[], currentLabel: string) => {
      items.forEach((item: any) => {
        if (item.link) {
          const link = item.link.toLowerCase()
          // Identify which filter this link belongs to
          let targetId = ''
          if (link.includes('/skins/')) targetId = 'skins'
          else if (link.includes('/gambling/')) targetId = 'gambling'
          else if (link.includes('/market/')) targetId = 'market'
          else if (link.includes('/currency/')) targetId = 'currency'
          else if (link.includes('/systems/')) targetId = 'systems'
          else if (link.includes('/informatii/')) targetId = 'informatii'
          else {
            const firstPart = link.split('/').filter(Boolean)[0]
            if (firstPart) targetId = firstPart
          }

          if (targetId) {
            if (!map[targetId]) map[targetId] = []
            map[targetId].push({
              title: strip(item.text),
              section: strip(currentLabel),
              link: item.link
            })
          }
        }
        if (item.items) {
          traverse(item.items, item.text || currentLabel)
        }
      })
    }
    
    traverse(group.items, group.text)
  })
  
  return map
})

const sectionPages = computed(() =>
  (SECTION_MAP.value[activeFilter.value] || []).map((p, i) => ({ ...p, idx: i }))
)


/* ── Snippet extractor (Optimizat pt paragrafe) ──────────── */
const extractSnippet = (text: string, q: string): string => {
  if (!text) return ''
  const lower = text.toLowerCase()
  const qi    = lower.indexOf(q.toLowerCase())
  
  if (qi === -1) return text.slice(0, 200) + (text.length > 200 ? '...' : '')
  
  // Extragem un context mai larg pentru a umple ~3 randuri
  const start = Math.max(0, qi - 60)
  const end   = Math.min(text.length, qi + 180)
  return (start > 0 ? '... ' : '') + text.slice(start, end) + (end < text.length ? ' ...' : '')
}

/* ── Highlight (Stil Fumadocs - Doar text galben) ────────── */
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlightText = (text: string): string => {
  if (!query.value || !text) return text
  return text.replace(new RegExp(`(${escRe(query.value)})`, 'gi'), '<mark>$1</mark>')
}

/* ── Navigation ──────────────────────────────────────────── */
const close      = () => { searchState.close(); query.value = '' }
const navigateTo = (link: string) => { router.go(link); close() }

const currentList = computed(() => {
  if (query.value) return results.value
  if (activeFilter.value !== 'all') return sectionPages.value
  return []
})

const moveSelection = (dir: number) => {
  const count = currentList.value.length
  if (!count) return
  activeIndex.value = (activeIndex.value + dir + count) % count
  nextTick(scrollActiveIntoView)
}

const selectActive = () => {
  const item = currentList.value[activeIndex.value]
  if (item) navigateTo(item.link)
}

/* ── Scroll sync — native scrollIntoView (works on mouse, keyboard & mobile) */
const scrollActiveIntoView = () => {
  const el = itemRefs.value[activeIndex.value] as HTMLElement | null
  if (!el) return
  el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

watch(query, () => { activeIndex.value = 0 })

watch(activeFilter, () => {
  activeIndex.value = 0
  itemRefs.value = []
  nextTick(() => inputRef.value?.focus())
})

watch(() => searchState.isOpen, (open) => {
  if (open) {
    activeIndex.value = 0
    itemRefs.value = []
    nextTick(() => inputRef.value?.focus())
  }
})

/* ── Global Ctrl+K ───────────────────────────────────────── */
const onKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    e.stopPropagation()
    searchState.toggle()
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown, true))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown, true)
  document.documentElement.classList.remove('search-open')
})
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────────────────── */
.wf-search-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  /* Dark: deep smoked glass */
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 20px 20px;
}
html:not(.dark) .wf-search-overlay,
html.light .wf-search-overlay {
  /* Light: frosted white veil */
  background: rgba(240, 240, 245, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* ── Modal — Liquid Glass Shell ──────────────────────────── */
.wf-search-modal {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  height: auto;
  min-height: unset;

  /* DARK: True liquid glass */
  background: rgba(10, 10, 12, 0.72);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 32px 64px -16px rgba(0, 0, 0, 0.7),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(255, 120, 0, 0.04);
}

/* Iridescent top-edge glow (dark only) */
.wf-search-modal::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 120, 0, 0.12) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}

/* LIGHT: Frosted white glass */
html:not(.dark) .wf-search-modal,
html.light .wf-search-modal {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.9) inset,
    0 24px 60px -12px rgba(0, 0, 0, 0.18),
    0 8px 20px rgba(0, 0, 0, 0.08);
}
html:not(.dark) .wf-search-modal::before,
html.light .wf-search-modal::before { display: none; }

/* ── Header ──────────────────────────────────────────────── */
.search-header {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 48px;
  gap: 8px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  /* Glass header tint */
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
html:not(.dark) .search-header {
  background: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.search-icon { color: #a1a1aa; flex-shrink: 0; }
html:not(.dark) .search-icon { color: #a1a1aa; }
.search-header:focus-within .search-icon { color: #ff7800; }

.search-header input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
}
html:not(.dark) .search-header input { color: #09090b; }
.search-header input::placeholder { color: #71717a; }

.header-actions { display: flex; align-items: center; gap: 8px; }

.clear-btn {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border-radius: 6px;
  color: #a1a1aa;
  background: #18181b;
  border: 1px solid #27272a;
  cursor: pointer;
}
.clear-btn:hover { color: #fff; background: #27272a; }
html:not(.dark) .clear-btn { background: #f4f4f5; border-color: #e4e4e7; }
html:not(.dark) .clear-btn:hover { background: #e4e4e7; color: #09090b; }

.esc-badge {
  font-size: 12px;
  font-family: monospace;
  color: #71717a;
  background: #18181b;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #27272a;
  cursor: pointer;
}
html:not(.dark) .esc-badge { background: #f4f4f5; border-color: #e4e4e7; color: #71717a; }

/* ── Body ────────────────────────────────────────────────── */
.search-body {
  overflow-y: auto;
  max-height: 50vh;
  padding: 8px 12px;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  /* transparent — modal glass shows through */
  background: transparent;
}

.results-meta {
  font-size: 12px;
  font-weight: 500;
  color: #71717a;
  padding: 4px 12px 8px;
}
html:not(.dark) .results-meta { color: #a1a1aa; }

/* ── Filter Section Links ────────────────────────────────── */
.filter-section-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fsl-header {
  padding: 12px 16px 8px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
html:not(.dark) .fsl-header {
  border-bottom-color: rgba(0, 0, 0, 0.05);
}

.fsl-header-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.fsl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fsl-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
html:not(.dark) .fsl-title { color: #09090b; }

.fsl-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.4;
}
html:not(.dark) .fsl-desc { color: #71717a; }

.fsl-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.25);
  padding: 8px 12px 6px;
}
html:not(.dark) .fsl-label { color: #a1a1aa; }

.fsl-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 0 8px 12px;
}

@media (max-width: 480px) {
  .fsl-grid { grid-template-columns: 1fr; }
}

.fsl-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.15s;
}

.fsl-item:hover, .fsl-item.active {
  background: rgba(255, 120, 0, 0.1);
  border-color: rgba(255, 120, 0, 0.3);
}

.fsl-item-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.fsl-item.active .fsl-item-title,
.fsl-item:hover .fsl-item-title {
  color: #ff7800;
}

.fsl-item-path {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  margin-top: 1px;
}

html:not(.dark) .fsl-item { background: rgba(0, 0, 0, 0.02); border-color: rgba(0, 0, 0, 0.04); }
html:not(.dark) .fsl-item-title { color: #18181b; }
html:not(.dark) .fsl-item-path { color: #71717a; }

/* ── Explore Grid ────────────────────────────────────────── */
.explore-docs {
  padding: 8px 4px;
}

.explore-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 8px 12px;
}

@media (max-width: 480px) {
  .explore-grid { grid-template-columns: 1fr; }
}

.explore-card {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s;
}

.explore-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 120, 0, 0.3);
  transform: translateY(-2px);
}

.ec-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.8;
}

.ec-dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255,255,255,0.8);
}

.ec-content {
  flex: 1;
  min-width: 0;
}

.ec-title {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}

.ec-desc {
  font-size: 11px;
  color: #71717a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ec-arrow {
  font-size: 14px;
  color: #3f3f46;
  transition: transform 0.2s;
}

.explore-card:hover .ec-arrow {
  color: #ff7800;
  transform: translateX(3px);
}

html:not(.dark) .explore-card {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.05);
}
html:not(.dark) .ec-title { color: #09090b; }
html:not(.dark) .ec-desc { color: #71717a; }

/* ── Results List ────────────────────────────────────────── */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
}
.result-item:hover,
.result-item.active {
  background: rgba(255, 120, 0, 0.06);
  border-color: rgba(255, 120, 0, 0.2);
  border-left-color: #ff7800;
}
html:not(.dark) .result-item:hover,
html:not(.dark) .result-item.active {
  background: rgba(255, 120, 0, 0.05);
  border-color: rgba(255, 120, 0, 0.15);
  border-left-color: #ff7800;
}

.res-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.res-top-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.res-section-badge {
  font-size: 10px;
  font-weight: 700;
  color: #ff7800;
  background: rgba(255, 120, 0, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 120, 0, 0.2);
  flex-shrink: 0;
}
html:not(.dark) .res-section-badge {
  background: rgba(255, 120, 0, 0.05);
  color: #c25700;
}

/* breadcrumb */
.res-breadcrumb {
  font-size: 10px;
  font-weight: 500;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
html:not(.dark) .res-breadcrumb { color: #a1a1aa; }

/* title */
.res-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.92);
  line-height: 1.4;
}
html:not(.dark) .res-title { color: #0f0f0f; }
.result-item.active .res-title,
.result-item:hover .res-title { color: #ff7800; }
html:not(.dark) .result-item.active .res-title,
html:not(.dark) .result-item:hover .res-title { color: #c25700; }

/* excerpt */
.res-excerpt {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 3px;
}
html:not(.dark) .res-excerpt { color: #52525b; }

/* arrow */
.res-action {
  color: rgba(255,255,255,0.2);
  flex-shrink: 0;
  margin-left: 16px;
  transition: color 0.15s, transform 0.15s;
}
.result-item.active .res-action,
.result-item:hover .res-action { color: #ff7800; transform: translateX(2px); }
html:not(.dark) .res-action { color: #d4d4d8; }
html:not(.dark) .result-item.active .res-action,
html:not(.dark) .result-item:hover .res-action { color: #c25700; transform: translateX(2px); }

/* ── Mark (HIGHLIGHT FUMADOCS - DOAR CULOARE, FARA BG) ───── */
:deep(mark) {
  background: transparent;
  color: #ff7800; /* Wildfire Orange */
  font-weight: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(255, 120, 0, 0.4);
}
html:not(.dark) :deep(mark) {
  color: #c25700;
  text-decoration-color: rgba(194, 87, 0, 0.4);
}

/* ── Empty State ─────────────────────────────────────────── */
.search-empty {
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-title { 
  color: rgba(255,255,255,0.4); 
  font-size: 15px; 
  font-weight: 500;
  margin: 0 0 12px 0; 
}
.empty-title span { color: #fff; }

.clear-search-btn {
  font-size: 13px;
  font-weight: 600;
  color: #ff7800;
  background: rgba(255, 120, 0, 0.1);
  border: 1px solid rgba(255, 120, 0, 0.2);
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.clear-search-btn:hover {
  background: rgba(255, 120, 0, 0.15);
  transform: translateY(-1px);
}

.empty-explore {
  width: 100%;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* ── Start Typing ────────────────────────────────────────── */
.start-typing {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0.6;
  animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.typing-icon {
  color: #ff7800;
  animation: bounce-subtle 2.5s infinite ease-in-out;
}

.typing-text {
  font-size: 14px;
  font-weight: 600;
  color: #a1a1aa;
  letter-spacing: 0.01em;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 0.5; transform: translateY(0); }
}

/* ── Empty State Enhanced ────────────────────────────────── */
.search-empty {
  padding: 24px 20px;
  text-align: center;
}

.empty-title { 
  color: #71717a; 
  font-size: 13px; 
  margin-bottom: 12px; 
}
.empty-title span { color: #fff; font-weight: 600; }

.clear-search-btn-enhanced {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: #ff7800;
  border: none;
  padding: 8px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(255, 120, 0, 0.2);
}

.clear-search-btn-enhanced:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 120, 0, 0.3);
}

.clear-search-btn-enhanced:active {
  transform: scale(0.95);
}

/* ── Mini Explore ────────────────────────────────────────── */
.empty-explore-mini {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.explore-grid-mini {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  margin-top: 4px;
}

.card-mini {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.card-mini:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.mini-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.mini-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

.card-mini:hover .mini-label { color: #fff; }

html:not(.dark) .clear-search-btn-enhanced { background: #c25700; box-shadow: 0 4px 12px rgba(194, 87, 0, 0.2); }
html:not(.dark) .mini-label { color: #52525b; }
html:not(.dark) .card-mini { background: rgba(0, 0, 0, 0.03); border-color: rgba(0, 0, 0, 0.06); }
html:not(.dark) .empty-explore-mini { border-top-color: rgba(0, 0, 0, 0.05); }

.search-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  position: relative;
  flex-wrap: nowrap;
  min-height: 40px;
  overflow: visible;
  z-index: 10;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  /* Glass footer tint */
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
html:not(.dark) .search-footer {
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* Filter zone (dropdown) */
.filter-zone { position: relative; flex-shrink: 0; }

.filter-trigger {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 500;
  color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  backdrop-filter: blur(8px);
}
.filter-trigger:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.85); }
.filter-trigger.active { background: rgba(255,120,0,0.12); border-color: rgba(255,120,0,0.3); color: #ff9a40; }
html:not(.dark) .filter-trigger {
  color: #71717a;
  background: rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.1);
  backdrop-filter: blur(4px);
}
html:not(.dark) .filter-trigger:hover { background: rgba(0,0,0,0.08); color: #09090b; }
html:not(.dark) .filter-trigger.active { background: rgba(255,120,0,0.08); border-color: rgba(255,120,0,0.25); color: #c05e00; }

.filter-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

/* ── Liquid Glass Popout ─────────────────────────────────── */
.filter-popout {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 260px;
  z-index: 99999;
  /* Liquid glass effect */
  background: rgba(12, 12, 14, 0.85);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 8px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 8px 24px rgba(0, 0, 0, 0.5);
  /* Scrolling */
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  overscroll-behavior: contain;
}
.filter-popout::-webkit-scrollbar { display: none; } /* Chrome/Safari */
html:not(.dark) .filter-popout {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
}

.fp-title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #52525b;
  padding: 4px 10px 8px;
}
html:not(.dark) .fp-title { color: #a1a1aa; }

.fp-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.fp-option {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.fp-option:hover { background: rgba(255,255,255,0.06); }
.fp-option.active {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.1);
}
html:not(.dark) .fp-option:hover { background: rgba(0,0,0,0.04); }
html:not(.dark) .fp-option.active { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.08); }

.fp-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.fp-name {
  font-size: 11px;
  font-weight: 600;
  color: #e4e4e7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fp-option.active .fp-name { color: #fff; }
html:not(.dark) .fp-name { color: #18181b; }
.fp-desc {
  font-size: 11px;
  color: #52525b;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
html:not(.dark) .fp-desc { color: #a1a1aa; }
.fp-check { color: #a1a1aa; flex-shrink: 0; }

/* ── Quick pills ─────────────────────────────────────────── */
.filter-pills {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;
}
.filter-pills::-webkit-scrollbar { display: none; }

.fp-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 30px;
  border: 1px solid #27272a;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #71717a;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;
}
.fp-pill:hover { border-color: #3f3f46; color: #d4d4d8; }
html:not(.dark) .fp-pill { border-color: #e4e4e7; color: #a1a1aa; }
html:not(.dark) .fp-pill:hover { border-color: #d4d4d8; color: #52525b; }

.fp-pill-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.7;
}
.fp-pill.active .fp-pill-dot { opacity: 1; }

.footer-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  flex-shrink: 0;
}

.watermark-text {
  font-size: 9px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.watermark-brand {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.watermark-brand::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  transform: skewX(-20deg);
  animation: watermark-shimmer 6s infinite;
}

@keyframes watermark-shimmer {
  0% { left: -100%; }
  20%, 100% { left: 200%; }
}

.watermark-brand:hover {
  background: rgba(255, 120, 0, 0.08);
  border-color: rgba(255, 120, 0, 0.3);
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 120, 0, 0.15);
}

.watermark-logo {
  width: 13px;
  height: 13px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(255, 120, 0, 0.6));
  transition: transform 0.3s;
}

.watermark-brand:hover .watermark-logo {
  transform: rotate(12deg) scale(1.1);
}

.brand-name {
  font-size: 11px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  text-shadow: 
    0 0 8px rgba(255, 120, 0, 0.4),
    0 0 16px rgba(255, 120, 0, 0.1);
}

html:not(.dark) .watermark-text { color: #a1a1aa; }
html:not(.dark) .watermark-brand { background: rgba(0, 0, 0, 0.03); border-color: rgba(0, 0, 0, 0.06); }
html:not(.dark) .brand-name { color: #09090b; text-shadow: none; }

/* ── Filter popout animation ─────────────────────────────── */
.filter-pop-enter-active { transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1); }
.filter-pop-leave-active { transition: all 0.12s ease-in; }
.filter-pop-enter-from, .filter-pop-leave-to { opacity: 0; transform: translateY(6px) scale(0.98); }

/* ── Body scroll — fully native, no custom scrollbar ───── */
.search-body {
  /* hide scrollbar track visually but keep it functional */
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE/Edge */
  overscroll-behavior: contain; /* prevents page scroll on mobile */
}

/* Lenis scroll containment */
.search-body[data-lenis-prevent] {
  overscroll-behavior: contain;
}
.search-body::-webkit-scrollbar { display: none; } /* Chrome/Safari */

/* Mobile-friendly sizing */
@media (max-width: 640px) {
  .wf-search-overlay {
    padding: 4vh 12px 12px;
    align-items: flex-start;
  }
  .wf-search-modal {
    max-width: 100%;
    border-radius: 14px;
  }
  .search-body {
    max-height: 60vh;
  }
  .search-header { height: 56px; padding: 0 12px; }
  .search-footer { padding: 8px 12px; }
  .result-item { padding: 10px 12px; }
  .filter-popout { width: 240px; }
}

/* ── Animations ──────────────────────────────────────────── */
.search-fade-enter-active, .search-fade-leave-active { transition: opacity 0.15s ease; }
.search-fade-enter-from, .search-fade-leave-to { opacity: 0; }

.search-scale-enter-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.search-scale-leave-active { transition: all 0.15s ease-in; }
.search-scale-enter-from { opacity: 0; transform: scale(0.98); }
.search-scale-leave-to   { opacity: 0; transform: scale(0.98); }

.body-slide-enter-active { transition: all 0.2s ease-out; overflow: hidden; }
.body-slide-leave-active { transition: all 0.15s ease-in; overflow: hidden; }
.body-slide-enter-from, .body-slide-leave-to { opacity: 0; max-height: 0; }
.body-slide-enter-to, .body-slide-leave-from { opacity: 1; max-height: 50vh; }

.filter-pop-enter-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: top left; }
.filter-pop-leave-active { transition: all 0.12s ease-in; transform-origin: top left; }
.filter-pop-enter-from, .filter-pop-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>

<style>
html { scrollbar-gutter: stable; }
html.search-open { overflow: hidden !important; }
</style>