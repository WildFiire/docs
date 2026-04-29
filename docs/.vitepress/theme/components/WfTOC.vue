<template>
  <nav v-if="allItems.length" :class="['wf-toc', { 'is-at-top': isAtTop }]" aria-label="Pe această pagină">

    <div class="wf-toc-header">
      <svg class="wf-toc-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 6h16M4 12h16M4 18h7"/>
      </svg>
      <span class="wf-toc-header-label">Cuprins Secțiune</span>
    </div>

    <div class="wf-toc-scroll-wrapper">
      <div class="wf-toc-container" ref="containerRef">

        <div
          v-if="svg"
          class="wf-toc-track-wrap"
          :style="{
            width: svg.width + 'px',
            height: svg.height + 'px',
            '--track-top': trackTop + 'px',
            '--track-bottom': trackBottom + 'px',
            '--offset-distance': offsetDistance + 'px',
            '--dot-opacity': dotOpacity,
          }"
        >
          <svg
            class="wf-toc-svg-bg"
            :viewBox="`0 0 ${svg.width} ${svg.height}`"
            :style="{ width: svg.width + 'px', height: svg.height + 'px' }"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="svg.d" class="wf-track-path" fill="none" />
          </svg>

          <svg
            class="wf-toc-svg-fill"
            :viewBox="`0 0 ${svg.width} ${svg.height}`"
            :style="{ width: svg.width + 'px', height: svg.height + 'px' }"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="svg.d" class="wf-fill-path" fill="none" />
          </svg>

          <div class="wf-toc-dot" :style="{ offsetPath: `path('${svg.d}')` }" />
        </div>

        <div class="wf-toc-items" ref="itemsRef">
          <a
            v-for="item in allItems"
            :key="item.url"
            :href="item.url"
            class="wf-toc-item"
            :class="[
              `wf-depth-${item.depth}`,
              { 'is-active': activeUrls.has(item.url) }
            ]"
            :style="{ paddingInlineStart: getItemOffset(item.depth) + 'px' }"
            @click.prevent="navigate(item.url)"
          >{{ item.title }}</a>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

interface TocItem {
  title: string
  url: string   
  depth: number 
}

interface ComputedSVG {
  width: number
  height: number
  d: string
  positions: [number, number, number][]
  lineLengths: [number, number][]
}

const route = useRoute()

const allItems    = ref<TocItem[]>([])
const activeUrls  = ref<Set<string>>(new Set())

const containerRef = ref<HTMLElement | null>(null)
const itemsRef     = ref<HTMLElement | null>(null)

const svg            = ref<ComputedSVG | null>(null)
const trackTop       = ref(0)
const trackBottom    = ref(0)
const offsetDistance = ref(0)
const dotOpacity     = ref(0)

const isAtTop = ref(true)

const isScrollingDown = ref(true)
let lastScrollY = 0
let isNavigating = false
let scrollRaf: number | null = null

function getActiveItems() {
  const scrollY = window.scrollY
  const innerHeight = window.innerHeight
  const offsetHeight = document.body.offsetHeight

  if (scrollY + innerHeight >= offsetHeight - 10) {
    return [allItems.value[allItems.value.length - 1]?.url].filter(Boolean)
  }

  const active = []
  const HEADER_OFFSET = 120 

  for (let i = 0; i < allItems.value.length; i++) {
    const item = allItems.value[i]
    const el = document.getElementById(item.url.slice(1))
    if (!el) continue

    const nextItem = allItems.value[i + 1]
    const nextEl = nextItem ? document.getElementById(nextItem.url.slice(1)) : null

    const rectTop = el.getBoundingClientRect().top
    const nextRectTop = nextEl ? nextEl.getBoundingClientRect().top : innerHeight + 1000

    if (rectTop < innerHeight && nextRectTop > HEADER_OFFSET) {
      active.push(item.url)
    }
  }

  if (active.length === 0 && allItems.value.length > 0) {
    let lastPassed = allItems.value[0].url
    for (let i = 0; i < allItems.value.length; i++) {
      const el = document.getElementById(allItems.value[i].url.slice(1))
      if (el && el.getBoundingClientRect().top <= HEADER_OFFSET) {
        lastPassed = allItems.value[i].url
      }
    }
    active.push(lastPassed)
  }

  return active
}

function onScroll() {
  if (isNavigating) return
  if (scrollRaf !== null) return

  scrollRaf = requestAnimationFrame(() => {
    const currentScrollY = window.scrollY
    
    isAtTop.value = currentScrollY < 80
    
    if (currentScrollY !== lastScrollY) {
      isScrollingDown.value = currentScrollY > lastScrollY
      lastScrollY = currentScrollY
      
      const newActive = getActiveItems()
      if (newActive.length > 0) {
        activeUrls.value = new Set(newActive)
      }
      
      updateMarker()
    }
    scrollRaf = null
  })
}

const A = 8

function getLineOffset(depth: number): number {
  const baseOffset = depth - 2
  return (baseOffset * 8) + A
}

function getItemOffset(depth: number): number {
  const baseOffset = depth - 2
  return (baseOffset * 12) + 12 + A
}

function scanDOM(): TocItem[] {
  const root = document.querySelector('.vp-doc') ?? document.querySelector('.VPDoc .container')
  if (!root) return []
  const items: TocItem[] = []
  
  root.querySelectorAll<HTMLElement>('h2, h3, h4, h5, h6').forEach(el => {
    if (!el.id) return
    const clone = el.cloneNode(true) as HTMLElement
    clone.querySelectorAll('a, .header-anchor').forEach(a => a.remove())
    const title = clone.textContent?.trim() ?? ''
    
    if (title) {
      items.push({
        title,
        url: '#' + el.id,
        depth: parseInt(el.tagName.charAt(1)), 
      })
    }
  })
  return items
}

let rafId = 0
function scheduleRecompute() {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(recompute)
}

function recompute() {
  const container = itemsRef.value
  if (!container || container.clientHeight === 0) { svg.value = null; return }
  if (!allItems.value.length) { svg.value = null; return }

  let w = 0, h = 0, d = ''
  const positions: [number, number, number][] = []

  for (let i = 0; i < allItems.value.length; i++) {
    const item = allItems.value[i]
    const el = container.querySelector<HTMLElement>(`a[href="${item.url}"]`)
    if (!el) continue

    const styles = getComputedStyle(el)
    const x      = getLineOffset(item.depth) + 0.5 
    const top    = el.offsetTop + parseFloat(styles.paddingTop)
    const bottom = el.offsetTop + el.clientHeight - parseFloat(styles.paddingBottom)

    w = Math.max(x + 8, w)
    h = Math.max(h, bottom)

    if (i === 0) {
      d += ` M${x} ${top} L${x} ${bottom}`
    } else {
      const [, upperBottom, upperX] = positions[i - 1]
      d += ` C ${upperX} ${top - 4} ${x} ${upperBottom + 4} ${x} ${top} L${x} ${bottom}`
    }

    positions.push([top, bottom, x])
  }

  const lineLengths: [number, number][] = []
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  pathEl.setAttribute('d', d)
  const totalLen = pathEl.getTotalLength()

  for (let i = 0; i < positions.length; i++) {
    const [top, bottom] = positions[i]
    let l = i > 0 ? lineLengths[i - 1][1] + (top - positions[i - 1][1]) : top
    while (l < totalLen && pathEl.getPointAtLength(l).y < top) l++
    lineLengths.push([l, l + bottom - top])
  }

  svg.value = { width: w, height: h, d, positions, lineLengths }
  updateMarker()
}

// Funcție pentru a centra elementul activ în containerul scrollabil
function scrollToActiveItem(targetUrl: string) {
  if (!containerRef.value) return;
  const container = containerRef.value;
  // Folosim atributul exact cu ghilimele duble în selector
  const activeLink = container.querySelector(`a[href="${targetUrl}"]`) as HTMLElement;
  
  if (activeLink) {
    // Calculăm poziția dorită pentru a centra link-ul activ
    const scrollTarget = activeLink.offsetTop - (container.clientHeight / 2) + (activeLink.clientHeight / 2);
    container.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  }
}

function updateMarker() {
  const s = svg.value
  if (!s || activeUrls.value.size === 0) {
    trackTop.value    = 0
    trackBottom.value = 0
    dotOpacity.value  = 0
    return
  }

  const links = activeUrls.value
  
  const startIdx = allItems.value.findIndex(it => links.has(it.url))
  
  let endIdx = -1
  for (let i = allItems.value.length - 1; i >= 0; i--) {
    if (links.has(allItems.value[i].url)) { endIdx = i; break }
  }
  
  if (startIdx === -1 || endIdx === -1) return

  trackTop.value    = s.positions[startIdx][0]
  trackBottom.value = s.positions[endIdx][1]

  offsetDistance.value = isScrollingDown.value 
    ? s.lineLengths[endIdx][1] 
    : s.lineLengths[startIdx][0] 
    
  dotOpacity.value     = 1

  // Facem scroll automat către elementul vizibil curent
  // Folosim endIdx dacă dăm scroll jos, startIdx dacă dăm scroll sus
  const targetIdx = isScrollingDown.value ? endIdx : startIdx;
  if (allItems.value[targetIdx]) {
      scrollToActiveItem(allItems.value[targetIdx].url);
  }
}

let rObs: ResizeObserver | null = null
function setupResizeObserver() {
  rObs?.disconnect()
  const target = itemsRef.value
  if (!target) return
  rObs = new ResizeObserver(() => scheduleRecompute())
  rObs.observe(target)
}

function navigate(url: string) {
  const el = document.getElementById(url.slice(1))
  if (!el) return
  
  isNavigating = true
  activeUrls.value = new Set([url])
  
  const rect = el.getBoundingClientRect()
  isScrollingDown.value = rect.top > 0
  
  updateMarker()
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.pushState(null, '', url)
  
  setTimeout(() => { 
    isNavigating = false 
    const newActive = getActiveItems()
    if (newActive.length > 0) activeUrls.value = new Set(newActive)
    updateMarker()
  }, 800)
}

async function buildAll() {
  activeUrls.value = new Set()
  svg.value        = null
  await nextTick()
  
  allItems.value = scanDOM()
  if (!allItems.value.length) return
  
  await nextTick()
  scheduleRecompute()
  setupResizeObserver()
  
  const initialActive = getActiveItems()
  if (initialActive.length > 0) {
    activeUrls.value = new Set(initialActive)
  }
  updateMarker()
}

watch(activeUrls, () => nextTick(updateMarker))

watch(() => route.path, async () => {
  await nextTick()
  setTimeout(buildAll, 120) 
})

onMounted(() => {
  buildAll()
  lastScrollY = window.scrollY
  isAtTop.value = window.scrollY < 80 
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', scheduleRecompute, { passive: true })
})

onUnmounted(() => {
  rObs?.disconnect()
  cancelAnimationFrame(rafId)
  if (scrollRaf !== null) cancelAnimationFrame(scrollRaf)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', scheduleRecompute)
})
</script>

<style scoped>
.wf-toc-icon {
  color: var(--wf-active);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}
.wf-toc-header:hover .wf-toc-icon {
  transform: translateX(2px); 
}

.wf-toc {
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --wf-active: var(--vp-c-brand-3);
  
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateY(0); 
}

.wf-toc.is-at-top {
  transform: translateY(169px); 
}

:global(.dark) .wf-toc {
  --wf-active: var(--vp-c-brand-1);
}

.wf-toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.wf-toc-header-bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--wf-active);
  flex-shrink: 0;
}

.wf-toc-header-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: var(--vp-c-text-3);
}

/* Nou wrapper pentru masca de fade */
.wf-toc-scroll-wrapper {
  position: relative;
  /* Mască de tip gradient: complet opacă sus, se estompează spre final pe ultimii 30px */
  -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
}

.wf-toc-container {
  position: relative;
  margin-top: 8px;
  /* Înălțimea fixă pentru scroll. Ajustează valoarea după preferințe (ex: 40vh, 250px, 300px) */
  max-height: 280px; 
  overflow-y: auto;
  
  /* Ascunde scrollbar-ul nativ pentru un aspect curat */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE/Edge */
  /* Adaugă padding jos ca ultimul item să poată face scroll peste "fade" */
  padding-bottom: 40px;
}

/* Ascunde scrollbar-ul în Webkit (Chrome, Safari) */
.wf-toc-container::-webkit-scrollbar {
  display: none;
}

.wf-toc-track-wrap {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.wf-toc-svg-bg,
.wf-toc-svg-fill {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
}

.wf-track-path {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
  stroke-linecap: round;
}

.wf-toc-svg-fill {
  clip-path: polygon(
    0 var(--track-top, 0px),
    100% var(--track-top, 0px),
    100% var(--track-bottom, 0px),
    0 var(--track-bottom, 0px)
  );
  transition: clip-path 0.2s ease;
}

.wf-fill-path {
  stroke: var(--wf-active);
  stroke-width: 1;
  stroke-linecap: round;
}

.wf-toc-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--wf-active);
  offset-distance: var(--offset-distance, 0px);
  margin: 0;
  transform: none;
  offset-anchor: 50% 50%;
  opacity: var(--dot-opacity, 0);
  transition:
    offset-distance 0.2s ease-out,
    opacity 0.15s ease;
  z-index: 2;
}

.wf-toc-items {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.wf-toc-item {
  position: relative;
  display: block;
  text-decoration: none;
  line-height: 1.4;
  transition: color 0.15s ease;
  color: var(--vp-c-text-2);
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 13px;
  white-space: normal;
  word-break: break-word;
}

.wf-toc-item:first-child { padding-top: 0; }
.wf-toc-item:last-child  { padding-bottom: 0; }

.wf-toc-item:hover { color: var(--vp-c-text-1); }

.wf-toc-item.is-active {
  color: var(--wf-active) !important;
  font-weight: 600;
}

.wf-depth-3 { font-size: 12px; color: var(--vp-c-text-3); }
.wf-depth-3:hover { color: var(--vp-c-text-2); }

.wf-depth-4 {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  padding-top: 4px;
  padding-bottom: 4px;
}
.wf-depth-4:hover { color: var(--vp-c-text-2); }

.wf-depth-5, .wf-depth-6 {
  font-size: 11px;
  color: var(--vp-c-text-3);
  padding-top: 3px;
  padding-bottom: 3px;
  white-space: normal;
  word-break: break-word;
  line-height: 1.3;
}
.wf-depth-5:hover, .wf-depth-6:hover { color: var(--vp-c-text-2); }
</style>