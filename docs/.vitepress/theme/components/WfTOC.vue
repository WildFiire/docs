<template>
  <nav v-if="allItems.length" class="wf-toc" aria-label="Pe această pagină">

    <!-- ── Header ── -->
    <div class="wf-toc-header">
      <span class="wf-toc-header-bar"></span>
      <span class="wf-toc-header-label">Pe această pagină</span>
    </div>

    <!-- ── List ── -->
    <div class="wf-toc-container">
      <!-- SVG Track (Dim background line) -->
      <svg class="wf-toc-svg" :style="{ height: svgHeight + 'px' }">
        <path :d="svgPath" class="wf-toc-path-track" />
      </svg>
      <!-- SVG Fill (Orange active line traveling window) -->
      <svg 
        class="wf-toc-svg wf-toc-svg-fill" 
        :style="{ 
          height: svgHeight + 'px', 
          clipPath: `inset(${activeTop}px 0 ${Math.max(0, svgHeight - activeTop - activeHeight)}px 0)`,
          opacity: activeLinks.length ? 1 : 0 
        }"
      >
        <path :d="svgPath" class="wf-toc-path-fill" />
      </svg>
      <!-- Travelling Dot -->
      <div class="wf-toc-travelling-dot" :style="{ transform: `translate(${dotX - 4}px, ${arrowY - 4}px)`, opacity: activeLinks.length ? 1 : 0 }"></div>

      <ul class="wf-toc-list" ref="listEl">
        <template v-for="item in allItems" :key="item.link">
          <li
            class="wf-toc-item"
            :class="[
              item.level === 2 ? 'wf-toc-h2' : 'wf-toc-h3',
              { 'is-active': activeLinks.includes(item.link) }
            ]"
          >
            <a :href="item.link" class="wf-toc-link" @click.prevent="navigate(item.link)">
              <span class="wf-toc-text">{{ item.title }}</span>
            </a>
          </li>
        </template>
      </ul>
    </div>

  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

interface FlatItem {
  level: 2 | 3
  title: string
  link: string  // e.g. "#section-title"
}

const { page } = useData()
const route = useRoute()

// Priority 1: DOM scan for h2/h3 in .vp-doc (works perfectly with all Vue/HTML components)
const allItems = ref<FlatItem[]>([])

function scanDOM(): FlatItem[] {
  const container = document.querySelector('.vp-doc') ?? document.querySelector('.VPDoc .container')
  if (!container) return []
  const els = container.querySelectorAll<HTMLElement>('h2, h3')
  const items: FlatItem[] = []
  els.forEach(el => {
    const id = el.id
    if (!id) return
    const level = el.tagName === 'H2' ? 2 : 3
    const text = (el.cloneNode(true) as HTMLElement)
    text.querySelectorAll('a').forEach(a => a.remove())
    const title = text.textContent?.trim() ?? ''
    if (title) items.push({ level, title, link: '#' + id })
  })
  return items
}

async function buildItems() {
  await nextTick()
  allItems.value = scanDOM()
  buildObserver()
  updateSVG()
}

// ── Active link & SVG Path ──────────────────────────────────────────────────
const activeLinks = ref<string[]>([])
const listEl = ref<HTMLElement | null>(null)
const activeTop = ref(0)
const activeHeight = ref(0)
const svgPath = ref('')
const svgHeight = ref(0)
const dotX = ref(8)
const arrowY = ref(0)
const scrollDirection = ref<'up' | 'down'>('down')

let cachedPositions: any[] = []

async function updateSVG() {
  await nextTick()
  if (!listEl.value) return
  const items = Array.from(listEl.value.querySelectorAll('.wf-toc-item')) as HTMLElement[]
  if (!items.length) {
    svgPath.value = ''
    return
  }

  let d = ''
  items.forEach((item, index) => {
    const isH2 = item.classList.contains('wf-toc-h2')
    const x = isH2 ? 8 : 20
    const y = item.offsetTop + item.offsetHeight / 2

    if (index === 0) {
      d += `M ${x} ${item.offsetTop} `
      d += `L ${x} ${y} `
    } else {
      const prevIsH2 = items[index-1].classList.contains('wf-toc-h2')
      const prevX = prevIsH2 ? 8 : 20
      const prevY = items[index-1].offsetTop + items[index-1].offsetHeight / 2
      
      if (prevX === x) {
        d += `L ${x} ${y} `
      } else {
        const midY = (prevY + y) / 2
        const r = Math.min(6, Math.abs(x - prevX) / 2, Math.abs(y - prevY) / 2)
        const dirX = x > prevX ? 1 : -1
        
        d += `L ${prevX} ${midY - r} `
        d += `Q ${prevX} ${midY}, ${prevX + r * dirX} ${midY} `
        
        const endX = x - r * dirX
        if (Math.abs(endX - (prevX + r * dirX)) > 0.1) {
          d += `L ${endX} ${midY} `
        }
        
        d += `Q ${x} ${midY}, ${x} ${midY + r} `
        d += `L ${x} ${y} `
      }
    }
  })
  
  const lastItem = items[items.length - 1]
  const lastX = lastItem.classList.contains('wf-toc-h2') ? 8 : 20
  const lastY = lastItem.offsetTop + lastItem.offsetHeight
  d += `L ${lastX} ${lastY}`
  
  svgPath.value = d
  svgHeight.value = listEl.value ? listEl.value.scrollHeight + 20 : 0 // Buffer to prevent clipping
  updateMarker()
}

function updateMarker() {
  if (!listEl.value || !activeLinks.value.length) {
    activeHeight.value = 0
    return
  }
  
  const activeElements = Array.from(listEl.value.querySelectorAll('.is-active')) as HTMLElement[]
  if (activeElements.length) {
    const first = activeElements[0]
    const last = activeElements[activeElements.length - 1]
    
    const startY = first.offsetTop + first.offsetHeight / 2
    const endY = last.offsetTop + last.offsetHeight / 2
    
    activeTop.value = startY
    activeHeight.value = endY - startY
    
    if (scrollDirection.value === 'down') {
      arrowY.value = endY
      dotX.value = last.classList.contains('wf-toc-h2') ? 8 : 20
    } else {
      arrowY.value = startY
      dotX.value = first.classList.contains('wf-toc-h2') ? 8 : 20
    }
  } else {
    activeHeight.value = 0
  }
}

watch([activeLinks, scrollDirection], async () => {
  await nextTick()
  updateMarker()
}, { deep: true })

// ── Scrollspy (Intersection Observer) ────────────────────────────────────────
let observer: IntersectionObserver | null = null
let lastActive = ''

function buildObserver() {
  observer?.disconnect()
  if (!allItems.value.length) return

  observer = new IntersectionObserver(
    (entries) => {
      let updated = [...activeLinks.value]
      
      entries.forEach(entry => {
        const link = '#' + entry.target.id
        if (entry.isIntersecting) {
          if (!updated.includes(link)) updated.push(link)
        } else {
          updated = updated.filter(l => l !== link)
        }
      })

      // Ensure they are sorted in document order
      updated.sort((a, b) => {
        return allItems.value.findIndex(i => i.link === a) - allItems.value.findIndex(i => i.link === b)
      })

      // If headings are on screen, update bounding box
      if (updated.length > 0) {
        activeLinks.value = updated
        lastActive = updated[0]
      } else if (lastActive) {
        // If we scroll deep into a huge section and no headings are visible,
        // keep the last seen heading active.
        activeLinks.value = [lastActive]
      }
    },
    { rootMargin: '-60px 0px 0px 0px', threshold: 0 } // Offset for navbar
  )

  allItems.value.forEach(item => {
    const el = document.getElementById(item.link.replace('#', ''))
    if (el) observer!.observe(el)
  })
}

// ── Scroll Direction Tracking ────────────────────────────────────────────────
let scrollAccumulator = 0
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0

function handleScroll() {
  const scrollY = window.scrollY
  const delta = scrollY - lastScrollY
  
  if (delta > 0) { // Scrolling down
    if (scrollDirection.value === 'up') scrollAccumulator += delta
    else scrollAccumulator = 0
    
    if (scrollAccumulator > 60) {
      scrollDirection.value = 'down'
      scrollAccumulator = 0
    }
  } else if (delta < 0) { // Scrolling up
    if (scrollDirection.value === 'down') scrollAccumulator -= delta
    else scrollAccumulator = 0
    
    if (scrollAccumulator > 60) {
      scrollDirection.value = 'up'
      scrollAccumulator = 0
    }
  }
  lastScrollY = scrollY
}

// ── Navigate ─────────────────────────────────────────────────────────────────
function navigate(href: string) {
  const el = document.getElementById(href.replace('#', ''))
  if (el) {
    activeLinks.value = [href]
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.pushState(null, '', href)
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
let layoutInterval: any

onMounted(() => {
  buildItems()
  window.addEventListener('resize', updateSVG, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Continuously check for layout shifts (e.g. async components or images loading)
  let lastHeight = 0
  layoutInterval = setInterval(() => {
    const docHeight = document.documentElement.scrollHeight
    if (docHeight !== lastHeight) {
      lastHeight = docHeight
      buildItems() // Rebuild entirely to catch late-rendered headers
    }
  }, 1000)
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateSVG)
  window.removeEventListener('scroll', handleScroll)
  clearInterval(layoutInterval)
})

watch(() => route.path, async () => {
  await nextTick()
  setTimeout(() => {
    buildItems()
  }, 150)
})
</script>


<style scoped>
/* ── Container ── */
.wf-toc {
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --wf-toc-active-color: var(--vp-c-brand-3); /* Darker shade for better contrast in light mode */
}

:global(.dark) .wf-toc {
  --wf-toc-active-color: var(--vp-c-brand-1); /* Vibrant shade for dark mode */
}

/* ── Header ── */
.wf-toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.wf-toc-header-bar {
  display: inline-block;
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--wf-toc-active-color);
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(var(--wf-accent-rgb), 0.5);
}

.wf-toc-header-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: var(--vp-c-text-3);
  flex: 1;
}

/* ── Container ── */
.wf-toc-container {
  position: relative;
  margin-left: 10px; /* Prevents dot from being clipped by VitePress sidebar boundaries */
  padding-left: 0;
  margin-top: 8px;
}

/* ── SVG Dynamic Path Lines ── */
.wf-toc-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  pointer-events: none;
  overflow: visible;
}

.wf-toc-path-track {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.wf-toc-svg-fill {
  z-index: 2;
  transition: clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
  will-change: clip-path;
}

.wf-toc-path-fill {
  fill: none;
  stroke: var(--wf-toc-active-color);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ── Travelling Dot ── */
.wf-toc-travelling-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wf-toc-active-color);
  box-shadow: 0 0 8px rgba(var(--wf-accent-rgb), 0.8);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
  z-index: 99;
}

/* ── List ── */
.wf-toc-list {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 4;
}

/* ── Item ── */
.wf-toc-item {
  position: relative;
  margin: 0;
  padding: 0;
}

/* ── Link ── */
.wf-toc-link {
  display: block;
  text-decoration: none;
  transition: color 0.15s ease;
  position: relative;
}

/* ── ## level ── */
.wf-toc-h2 .wf-toc-link {
  padding: 4px 0 4px 24px;
  font-size: 12.5px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.wf-toc-h2 .wf-toc-link:hover {
  color: var(--vp-c-text-1);
}

/* ── ### level ── */
.wf-toc-h3 .wf-toc-link {
  padding: 3px 0 3px 36px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.wf-toc-h3 .wf-toc-link:hover {
  color: var(--vp-c-text-2);
}

.wf-toc-h2.is-active .wf-toc-link,
.wf-toc-h3.is-active .wf-toc-link {
  color: var(--wf-toc-active-color) !important;
  font-weight: 600 !important;
}

/* ── Text wrapping ── */
.wf-toc-text {
  white-space: normal;
  overflow: visible;
}
</style>
