<template>
  <Teleport to="body">
    <div v-show="visible" class="fluid-lb" @click="onOverlayClick" @wheel.prevent="onWheel" @dblclick="onDblClick">
      <div class="fluid-lb__backdrop" :style="{ opacity: backdropOpacity }" />
      <div ref="ghostRef" class="fluid-lb__ghost" :style="ghostStyle"
        @mousedown.prevent="onDragStart" @touchstart.prevent="onTouchStart">
        <img v-if="currentSrc" :src="currentSrc" :alt="currentAlt" class="fluid-lb__img" draggable="false"
          :style="imgTransform" />
      </div>
      <!-- Zoom controls -->
      <div v-show="showClose" class="fluid-lb__controls">
        <button class="fluid-lb__ctrl-btn" @click.stop="zoomIn" aria-label="Zoom in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
        </button>
        <span class="fluid-lb__zoom-label">{{ zoomPercent }}%</span>
        <button class="fluid-lb__ctrl-btn" @click.stop="zoomOut" aria-label="Zoom out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
        </button>
        <button class="fluid-lb__ctrl-btn" @click.stop="resetZoom" aria-label="Reset zoom">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
      <button v-show="showClose" class="fluid-lb__close" @click.stop="close" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const visible = ref(false)
const showClose = ref(false)
const currentSrc = ref('')
const currentAlt = ref('')
const ghostRef = ref<HTMLElement | null>(null)
const backdropOpacity = ref(0)
const ghostStyle = ref<Record<string, string>>({})

// Zoom & pan state
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const MIN_ZOOM = 0.5
const MAX_ZOOM = 5

const zoomPercent = computed(() => Math.round(zoom.value * 100))
const imgTransform = computed(() => ({
  transform: `scale(${zoom.value}) translate(${panX.value / zoom.value}px, ${panY.value / zoom.value}px)`,
  transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
  transformOrigin: 'center center',
  cursor: zoom.value > 1 ? 'grab' : 'zoom-in',
}))

let sourceEl: HTMLImageElement | null = null
let isAnimating = false
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let panStartX = 0
let panStartY = 0

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function resetZoomState() {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

function clampZoom(val: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, val))
}

function zoomIn() {
  zoom.value = clampZoom(zoom.value * 1.3)
}

function zoomOut() {
  zoom.value = clampZoom(zoom.value / 1.3)
  if (zoom.value <= 1) { panX.value = 0; panY.value = 0 }
}

function resetZoom() {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

function onWheel(e: WheelEvent) {
  if (!visible.value || isAnimating) return
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  zoom.value = clampZoom(zoom.value * delta)
  if (zoom.value <= 1) { panX.value = 0; panY.value = 0 }
}

function onDblClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.fluid-lb__close') || (e.target as HTMLElement).closest('.fluid-lb__controls')) return
  if (zoom.value > 1.05) {
    resetZoom()
  } else {
    zoom.value = clampZoom(2.5)
  }
}

// Drag to pan
function onDragStart(e: MouseEvent) {
  if (zoom.value <= 1) return
  isDragging = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  panStartX = panX.value
  panStartY = panY.value
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  if (!isDragging) return
  panX.value = panStartX + (e.clientX - dragStartX)
  panY.value = panStartY + (e.clientY - dragStartY)
}

function onDragEnd() {
  isDragging = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

// Touch drag
let lastTouchDist = 0

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)
  } else if (e.touches.length === 1 && zoom.value > 1) {
    isDragging = true
    dragStartX = e.touches[0].clientX
    dragStartY = e.touches[0].clientY
    panStartX = panX.value
    panStartY = panY.value
    document.addEventListener('touchmove', onTouchDrag, { passive: false })
    document.addEventListener('touchend', onTouchEnd)
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length < 2) return
  e.preventDefault()
  const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
  const ratio = dist / lastTouchDist
  zoom.value = clampZoom(zoom.value * ratio)
  lastTouchDist = dist
}

function onTouchDrag(e: TouchEvent) {
  if (!isDragging || e.touches.length !== 1) return
  e.preventDefault()
  panX.value = panStartX + (e.touches[0].clientX - dragStartX)
  panY.value = panStartY + (e.touches[0].clientY - dragStartY)
}

function onTouchEnd() {
  isDragging = false
  lastTouchDist = 0
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchmove', onTouchDrag)
  document.removeEventListener('touchend', onTouchEnd)
}

function getOriginRect(img: HTMLImageElement) {
  const rect = img.getBoundingClientRect()
  return { x: rect.left, y: rect.top, w: rect.width, h: rect.height }
}

function getFinalRect() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pad = 48
  const maxW = vw - pad * 2
  const maxH = vh - pad * 2
  const natW = sourceEl?.naturalWidth || 1200
  const natH = sourceEl?.naturalHeight || 700
  const scale = Math.min(maxW / natW, maxH / natH, 1)
  const w = natW * scale
  const h = natH * scale
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h }
}

async function open(img: HTMLImageElement) {
  if (isAnimating || visible.value) return
  isAnimating = true
  sourceEl = img
  currentSrc.value = img.src
  currentAlt.value = img.alt || ''
  resetZoomState()

  const origin = getOriginRect(img)

  ghostStyle.value = {
    position: 'fixed',
    left: origin.x + 'px',
    top: origin.y + 'px',
    width: origin.w + 'px',
    height: origin.h + 'px',
    borderRadius: '12px',
    transition: 'none',
    zIndex: '10001',
    opacity: '1',
  }
  backdropOpacity.value = 0
  showClose.value = false
  visible.value = true

  await nextTick()
  void ghostRef.value?.offsetHeight

  const final = getFinalRect()
  ghostStyle.value = {
    position: 'fixed',
    left: final.x + 'px',
    top: final.y + 'px',
    width: final.w + 'px',
    height: final.h + 'px',
    borderRadius: '6px',
    transition: `all 0.5s ${EASE}`,
    zIndex: '10001',
    opacity: '1',
  }
  backdropOpacity.value = 1
  document.body.style.overflow = 'hidden'

  setTimeout(() => {
    showClose.value = true
    isAnimating = false
  }, 500)
}

async function close() {
  if (isAnimating) return
  isAnimating = true
  showClose.value = false
  resetZoomState()

  const origin = sourceEl ? getOriginRect(sourceEl) : { x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 30, w: 100, h: 60 }

  ghostStyle.value = {
    position: 'fixed',
    left: origin.x + 'px',
    top: origin.y + 'px',
    width: origin.w + 'px',
    height: origin.h + 'px',
    borderRadius: '12px',
    transition: `all 0.45s ${EASE}`,
    zIndex: '10001',
    opacity: '1',
  }
  backdropOpacity.value = 0

  setTimeout(() => {
    visible.value = false
    currentSrc.value = ''
    sourceEl = null
    isAnimating = false
    document.body.style.overflow = ''
  }, 460)
}

function onOverlayClick(e: MouseEvent) {
  if (isDragging) return
  const target = e.target as HTMLElement
  if (!target.closest('.fluid-lb__ghost') && !target.closest('.fluid-lb__close') && !target.closest('.fluid-lb__controls')) {
    close()
  }
}

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  let img: HTMLImageElement | null = null

  if (target.tagName === 'IMG' && target.closest('[data-fluid-lightbox]')) {
    img = target as HTMLImageElement
  } else if (target.closest('[data-fluid-lightbox]')) {
    img = target.closest('[data-fluid-lightbox]')?.querySelector('img') || null
  }

  if (!img && target.tagName === 'IMG') {
    const el = target as HTMLImageElement
    // Skip UI avatars, nav icons, buttons, etc.
    if (el.closest('.hn-user-wrap') || el.closest('.hn-dp-profile') || el.closest('.nav-logo') || el.closest('button') || el.closest('.VPNav') || el.closest('.VPSidebar') || el.closest('.VPLastUpdated') || el.closest('.VPDocFooter') || el.closest('.vp-doc-footer') || el.closest('.wch-author-link') || el.closest('.wch-meta')) {
      return
    }
    if (el.closest('.vp-doc') || el.closest('.wf-home')) {
      if (el.naturalWidth > 60 || el.width > 60) {
        img = el
      }
    }
  }

  if (img) {
    e.preventDefault()
    e.stopPropagation()
    open(img)
  }
}

function handleKey(e: KeyboardEvent) {
  if (!visible.value) return
  if (e.key === 'Escape') close()
  if (e.key === '+' || e.key === '=') zoomIn()
  if (e.key === '-') zoomOut()
  if (e.key === '0') resetZoom()
}

onMounted(() => {
  document.addEventListener('click', handleClick, true)
  document.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClick, true)
  document.removeEventListener('keydown', handleKey)
  document.body.style.overflow = ''
})
</script>

<style>
.fluid-lb {
  position: fixed;
  inset: 0;
  z-index: 99999 !important;
  cursor: zoom-in;
}

.fluid-lb__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.fluid-lb__ghost {
  overflow: visible;
  will-change: left, top, width, height, border-radius;
  z-index: 99999 !important;
}

.fluid-lb__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
  pointer-events: none;
  will-change: transform;
}

/* Zoom controls bar */
.fluid-lb__controls {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000 !important;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  animation: fadeInClose 0.3s ease forwards;
  pointer-events: auto !important;
}

.fluid-lb__ctrl-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer !important;
  pointer-events: auto !important;
  transition: background 0.15s ease, color 0.15s ease;
}

.fluid-lb__ctrl-btn:hover {
  background: rgba(255, 120, 0, 0.2);
  color: #ff7800;
}

.fluid-lb__zoom-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  min-width: 42px;
  text-align: center;
  font-family: 'Orbitron', monospace, sans-serif;
  letter-spacing: 0.5px;
  pointer-events: none;
}

.fluid-lb__close {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100000 !important;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, opacity 0.3s ease;
  animation: fadeInClose 0.3s ease forwards;
}

@keyframes fadeInClose {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.fluid-lb__close:hover {
  background: rgba(255, 120, 0, 0.3);
  transform: scale(1.1);
}

/* Global: make doc images look clickable */
.vp-doc img,
[data-fluid-lightbox] img {
  cursor: zoom-in;
}
</style>
