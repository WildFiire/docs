<template>
  <!-- Copy toast -->
  <Transition name="copy-toast">
    <div v-if="copyToast" class="copy-toast">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Copied!
    </div>
  </Transition>

  <!-- Image lightbox -->
  <Transition name="lightbox">
    <div v-if="lightboxSrc" class="lightbox-overlay" @click.self="closeLightbox" @keydown.esc="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <img :src="lightboxSrc" :alt="lightboxAlt" class="lightbox-img" />
      <p v-if="lightboxAlt" class="lightbox-caption">{{ lightboxAlt }}</p>
    </div>
  </Transition>

  <!-- J/K nav hint (shows briefly on first use) -->
  <Transition name="nav-hint">
    <div v-if="navHint" class="jk-nav-hint">
      <kbd>J</kbd> next &nbsp; <kbd>K</kbd> prev
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRouter } from 'vitepress'

const { page } = useData()
const router = useRouter()

const copyToast = ref(false)
const lightboxSrc = ref('')
const lightboxAlt = ref('')
const navHint = ref(false)

// ── Copy Code Toast ──────────────────────────────────────────
let copyTimer = null
function handleCopyClick(e) {
  const btn = e.target.closest('button.copy')
  if (!btn) return
  clearTimeout(copyTimer)
  copyToast.value = true
  copyTimer = setTimeout(() => { copyToast.value = false }, 2000)
}

// ── Image Lightbox ───────────────────────────────────────────
function handleImgClick(e) {
  const img = e.target.closest('.vp-doc img')
  if (!img) return
  lightboxSrc.value = img.src
  lightboxAlt.value = img.alt || ''
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxSrc.value = ''
  lightboxAlt.value = ''
  document.body.style.overflow = ''
}

// ── J/K Keyboard Nav ────────────────────────────────────────
let hintTimer = null
function handleKeyNav(e) {
  if (e.target.matches('input, textarea, [contenteditable]')) return
  if (e.key !== 'j' && e.key !== 'k') return

  const target = e.key === 'j' ? page.value.next : page.value.prev
  if (!target?.link) return

  clearTimeout(hintTimer)
  navHint.value = true
  hintTimer = setTimeout(() => { navHint.value = false }, 1500)

  router.go(target.link)
}

// ── Reading Progress Ring ────────────────────────────────────
const CIRC = 2 * Math.PI * 6 // r=6 → ≈37.7

function getProgressRingEl() {
  return document.getElementById('doc-progress-ring-circle')
}

function injectProgressRing() {
  nextTick(() => {
    requestAnimationFrame(() => {
      const title = document.querySelector('.outline-title')
      if (!title || title.querySelector('#doc-progress-ring')) return
      const svg = document.createElement('div')
      svg.id = 'doc-progress-ring'
      svg.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" style="display:block;flex-shrink:0">
        <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(var(--wf-accent-rgb),0.18)" stroke-width="1.5"/>
        <circle id="doc-progress-ring-circle" cx="8" cy="8" r="6" fill="none"
          stroke="var(--vp-c-brand-1)" stroke-width="1.5"
          stroke-dasharray="${CIRC.toFixed(2)}" stroke-dashoffset="${CIRC.toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 8 8)"
          style="transition:stroke-dashoffset 0.15s ease"/>
      </svg>`
      title.style.display = 'flex'
      title.style.alignItems = 'center'
      title.style.gap = '8px'
      title.appendChild(svg)
      updateProgressRing()
    })
  })
}

function updateProgressRing() {
  const circle = getProgressRingEl()
  if (!circle) return
  const scrollTop = window.scrollY
  const docH = document.documentElement.scrollHeight - window.innerHeight
  const progress = docH > 0 ? Math.min(scrollTop / docH, 1) : 0
  circle.setAttribute('stroke-dashoffset', (CIRC * (1 - progress)).toFixed(2))
}

// ── Theme Manager ──────────────────────────────────────────────
function updateTheme() {
  const rel = page.value?.relativePath || ''
  const section = rel.split('/')[0]
  
  if (['systems', 'market', 'currency', 'updates_wiki'].includes(section)) {
    document.documentElement.setAttribute('data-wf-theme', section)
  } else {
    document.documentElement.removeAttribute('data-wf-theme')
  }
}

// ── Route change: re-inject reading time & reset lightbox ───
watch(() => page.value.relativePath, () => {
  closeLightbox()
  injectProgressRing()
  updateTheme()
  nextTick(updateTheme)
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleCopyClick)
  document.addEventListener('click', handleImgClick)
  window.addEventListener('keydown', handleKeyNav)
  window.addEventListener('scroll', updateProgressRing, { passive: true })
  injectProgressRing()
  updateTheme()
})

onUnmounted(() => {
  document.removeEventListener('click', handleCopyClick)
  document.removeEventListener('click', handleImgClick)
  window.removeEventListener('keydown', handleKeyNav)
  window.removeEventListener('scroll', updateProgressRing)
  clearTimeout(copyTimer)
  clearTimeout(hintTimer)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ── Reading time meta row ──────────────────────────── */
:deep(.reading-time-meta) {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid rgba(var(--wf-accent-rgb), 0.4);
  flex-shrink: 0;
  cursor: default;
  user-select: none;
}

html.dark :deep(.reading-time-meta) {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(var(--wf-accent-rgb), 0.5);
}

html:not(.dark) :deep(.reading-time-meta) {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(var(--wf-accent-rgb), 0.35);
}

:deep(.reading-time-meta svg) {
  color: var(--vp-c-brand-1);
  opacity: 0.9;
  flex-shrink: 0;
}

:deep(.reading-time-meta span) {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.3px;
}

@media (max-width: 480px) {
  :deep(.reading-time-meta span) {
    display: none;
  }
  :deep(.reading-time-meta) {
    padding: 4px 7px;
  }
}

/* ── Copy toast ─────────────────────────────────────── */
.copy-toast {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  background: #1a1a1a;
  color: #4ade80;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 9999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.copy-toast-enter-active,
.copy-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.copy-toast-enter-from,
.copy-toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}

/* ── Lightbox ───────────────────────────────────────── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  cursor: default;
}

.lightbox-caption {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  text-align: center;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* ── J/K nav hint ───────────────────────────────────── */
.jk-nav-hint {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.jk-nav-hint kbd {
  background: rgba(var(--wf-accent-rgb), 0.3);
  border: 1px solid rgba(var(--wf-accent-rgb), 0.5);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 11px;
  font-family: monospace;
  color: var(--vp-c-brand-1);
}

.nav-hint-enter-active,
.nav-hint-leave-active {
  transition: opacity 0.3s ease;
}
.nav-hint-enter-from,
.nav-hint-leave-to {
  opacity: 0;
}
</style>
