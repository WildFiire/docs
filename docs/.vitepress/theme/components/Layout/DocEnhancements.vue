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

  <!-- Studio HD Media Lightbox (1:1 with wf-docscore MediaLightbox.tsx) -->
  <Transition name="lightbox-fade">
    <div
      v-if="activeMedia"
      class="wf-lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Media Lightbox Preview"
      @click="closeLightbox"
    >
      <!-- Lightbox Top Control Toolbar -->
      <div
        class="wf-lightbox-toolbar"
        @click.stop
      >
        <div class="wf-lightbox-title-wrap">
          <div class="wf-lightbox-badge">
            <svg
              v-if="activeMedia.type === 'video'"
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-amber-400"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <polyline points="7 3 7 8 15 8" />
              <line x1="10" x2="10" y1="8" y2="21" />
              <line x1="7" x2="7" y1="13" y2="21" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-amber-400"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span>
              {{ activeMedia.type === 'video' ? 'Video HD Preview' : 'Image Preview' }}
            </span>
          </div>
          <span v-if="activeMedia.title" class="wf-lightbox-title">{{ activeMedia.title }}</span>
        </div>

        <div class="wf-lightbox-actions">
          <!-- Zoom In / Out for Images -->
          <template v-if="activeMedia.type === 'image'">
            <button
              type="button"
              class="wf-lightbox-btn"
              title="Zoom Out (-)"
              @click="handleZoomOut"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
            </button>
            <span class="wf-lightbox-zoom-label">
              {{ Math.round(zoom * 100) }}%
            </span>
            <button
              type="button"
              class="wf-lightbox-btn"
              title="Zoom In (+)"
              @click="handleZoomIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
            </button>
            <button
              type="button"
              class="wf-lightbox-btn"
              title="Rotește imaginea"
              @click="handleRotate"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </button>
          </template>

          <!-- Copy URL -->
          <button
            type="button"
            class="wf-lightbox-btn"
            title="Copiază link-ul media"
            @click="handleCopyLink"
          >
            <svg v-if="mediaCopied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>

          <!-- Download -->
          <button
            type="button"
            class="wf-lightbox-btn"
            title="Descarcă fișierul"
            @click="handleDownload"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>

          <!-- Close Button -->
          <button
            type="button"
            class="wf-lightbox-btn wf-lightbox-btn--close"
            title="Închide (Esc)"
            @click="closeLightbox"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Lightbox Content Canvas -->
      <div
        class="wf-lightbox-stage"
        @click.stop
        @wheel.prevent="handleWheel"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @dblclick="handleDoubleClick"
      >
        <img
          v-if="activeMedia.type === 'image'"
          :src="activeMedia.src"
          :alt="activeMedia.alt || activeMedia.title || 'Preview'"
          class="wf-lightbox-image"
          draggable="false"
          :style="{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            userSelect: 'none'
          }"
        />
        <div v-else class="wf-lightbox-video-wrap">
          <video
            :src="activeMedia.src"
            controls
            autoplay
            playsinline
            class="wf-lightbox-video"
          />
        </div>
      </div>

      <!-- Bottom Hint -->
      <div class="wf-lightbox-footer">
        <span>Scroll / +/- pentru zoom &bull; Dublu click pentru mărire &bull; Apasă <kbd>Esc</kbd> sau dă click pe fundal pentru a închide</span>
      </div>
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
const navHint = ref(false)

// ── Studio HD Lightbox State ─────────────────────────────────
const activeMedia = ref(null)
const zoom = ref(1)
const rotation = ref(0)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const mediaCopied = ref(false)

function openLightbox(media) {
  if (!media || !media.src) return
  activeMedia.value = media
  zoom.value = 1
  rotation.value = 0
  panX.value = 0
  panY.value = 0
  isDragging.value = false
  mediaCopied.value = false
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }
}

function closeLightbox() {
  activeMedia.value = null
  zoom.value = 1
  rotation.value = 0
  panX.value = 0
  panY.value = 0
  isDragging.value = false
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
}

function handleZoomIn() {
  zoom.value = Math.min(Number((zoom.value + 0.25).toFixed(2)), 4)
}

function handleZoomOut() {
  zoom.value = Math.max(Number((zoom.value - 0.25).toFixed(2)), 0.5)
  if (zoom.value <= 1) {
    panX.value = 0
    panY.value = 0
  }
}

function handleRotate() {
  rotation.value = (rotation.value + 90) % 360
  panX.value = 0
  panY.value = 0
}

function handleWheel(e) {
  if (!activeMedia.value) return
  e.preventDefault()
  e.stopPropagation()

  if (activeMedia.value.type === 'image') {
    const zoomStep = 0.15
    if (e.deltaY < 0) {
      // Wheel up -> Zoom in
      zoom.value = Math.min(Number((zoom.value + zoomStep).toFixed(2)), 4)
    } else if (e.deltaY > 0) {
      // Wheel down -> Zoom out
      zoom.value = Math.max(Number((zoom.value - zoomStep).toFixed(2)), 0.5)
      if (zoom.value <= 1) {
        panX.value = 0
        panY.value = 0
      }
    }
  }
}

function handleMouseDown(e) {
  if (activeMedia.value?.type !== 'image' || zoom.value <= 1) return
  if (e.button !== 0) return
  e.preventDefault()
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - panX.value,
    y: e.clientY - panY.value
  }
}

function handleMouseMove(e) {
  if (!isDragging.value) return
  e.preventDefault()
  panX.value = e.clientX - dragStart.value.x
  panY.value = e.clientY - dragStart.value.y
}

function handleMouseUp() {
  isDragging.value = false
}

function handleDoubleClick(e) {
  if (activeMedia.value?.type !== 'image') return
  e.preventDefault()
  e.stopPropagation()
  if (zoom.value > 1) {
    zoom.value = 1
    panX.value = 0
    panY.value = 0
  } else {
    zoom.value = 2
  }
}

async function handleCopyLink() {
  if (!activeMedia.value?.src) return
  const fullUrl = activeMedia.value.src.startsWith('http')
    ? activeMedia.value.src
    : `${window.location.origin}${activeMedia.value.src}`
  const ok = await copyTextToClipboard(fullUrl)
  if (ok) {
    mediaCopied.value = true
    setTimeout(() => { mediaCopied.value = false }, 2000)
  }
}

function handleDownload() {
  if (!activeMedia.value?.src) return
  const a = document.createElement('a')
  a.href = activeMedia.value.src
  a.download = activeMedia.value.src.split('/').pop() || 'media-download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// Expose globally for DocImage.vue, DocVideo.vue, etc.
if (typeof window !== 'undefined') {
  window.__openWfLightbox = openLightbox
}

// ── Copy Code Toast ──────────────────────────────────────────
let copyTimer = null
function handleCopyClick(e) {
  const btn = e.target.closest('button.copy')
  if (!btn) return
  clearTimeout(copyTimer)
  copyToast.value = true
  copyTimer = setTimeout(() => { copyToast.value = false }, 2000)
}

// ── Keyboard Shortcuts (Esc to close lightbox, +/-, 0, J/K Nav) ─
let hintTimer = null
function handleKeyEvents(e) {
  if (activeMedia.value) {
    if (e.key === 'Escape') {
      closeLightbox()
      return
    }
    if (e.key === '+' || e.key === '=') {
      handleZoomIn()
      return
    }
    if (e.key === '-') {
      handleZoomOut()
      return
    }
    if (e.key === '0') {
      zoom.value = 1
      panX.value = 0
      panY.value = 0
      return
    }
  }

  if (e.target && typeof e.target.matches === 'function' && e.target.matches('input, textarea, [contenteditable]')) return
  if (e.key !== 'j' && e.key !== 'k') return

  const target = e.key === 'j' ? page.value.next : page.value.prev
  if (!target?.link) return

  clearTimeout(hintTimer)
  navHint.value = true
  hintTimer = setTimeout(() => { navHint.value = false }, 1500)

  router.go(target.link)
}

// ── Reading Progress Ring ────────────────────────────────────
const CIRC = 2 * Math.PI * 6 // r=6 -> ~37.7

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

let scrollRaf = null
function updateProgressRing() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    const circle = getProgressRingEl()
    if (!circle) {
      scrollRaf = null
      return
    }
    const scrollTop = window.scrollY
    const docH = document.documentElement.scrollHeight - window.innerHeight
    const progress = docH > 0 ? Math.min(scrollTop / docH, 1) : 0
    circle.setAttribute('stroke-dashoffset', (CIRC * (1 - progress)).toFixed(2))
    scrollRaf = null
  })
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

// ── Callout & Alert Enhancer (1:1 with wf-docscore Callout.tsx) ───────────
const CALLOUT_ICONS = {
  note: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
  tip: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  danger: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  caution: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  important: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
}

const CALLOUT_LABELS = {
  note: 'Notă',
  info: 'Notă',
  tip: 'Sfat',
  warning: 'Atenție',
  danger: 'Pericol',
  caution: 'Precauție',
  important: 'Important',
}

function enhanceCallouts() {
  if (typeof document === 'undefined') return
  const blocks = document.querySelectorAll('.custom-block:not(.callout-enhanced)')
  blocks.forEach((block) => {
    block.classList.add('callout-enhanced')
    
    let type = 'note'
    for (const t of ['tip', 'warning', 'danger', 'caution', 'important', 'info', 'note']) {
      if (block.classList.contains(t)) {
        type = t === 'info' ? 'note' : t
        break
      }
    }
    block.classList.add('callout', `callout--${type}`)

    if (block.querySelector('.callout-icon-wrapper')) return

    const titleEl = block.querySelector('.custom-block-title')
    let titleText = titleEl ? titleEl.textContent?.trim() : ''
    if (!titleText || ['NOTE', 'TIP', 'WARNING', 'DANGER', 'CAUTION', 'IMPORTANT', 'INFO'].includes(titleText.toUpperCase())) {
      titleText = CALLOUT_LABELS[type] || 'Notă'
    }

    const bodyChildren = Array.from(block.childNodes).filter((n) => n !== titleEl)

    const iconWrapper = document.createElement('div')
    iconWrapper.className = 'callout-icon-wrapper'
    iconWrapper.setAttribute('aria-hidden', 'true')
    iconWrapper.innerHTML = CALLOUT_ICONS[type] || CALLOUT_ICONS.note

    const contentWrapper = document.createElement('div')
    contentWrapper.className = 'callout-content'

    const newTitle = document.createElement('div')
    newTitle.className = 'callout-title'
    newTitle.textContent = titleText
    contentWrapper.appendChild(newTitle)

    const bodyWrapper = document.createElement('div')
    bodyWrapper.className = 'callout-body'
    bodyChildren.forEach((child) => bodyWrapper.appendChild(child))
    contentWrapper.appendChild(bodyWrapper)

    block.innerHTML = ''
    block.appendChild(iconWrapper)
    block.appendChild(contentWrapper)
  })
}

// ── Robust Clipboard Copy with Legacy Fallback ──────────────
async function copyTextToClipboard(text) {
  try {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {}
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) return true;
  } catch (e) {}
  return false;
}

// ── Code Block Enhancer (1:1 with wf-docscore CopyablePre.tsx) ────────────
function enhanceCodeBlocks() {
  if (typeof document === 'undefined') return;

  const codeBlocks = document.querySelectorAll('div[class*="language-"]:not(.code-enhanced)');
  codeBlocks.forEach((block) => {
    block.classList.add('code-enhanced', 'code-block-wrapper');

    const oldLang = block.querySelector(':scope > span.lang');
    if (oldLang) oldLang.remove();
    const oldCopy = block.querySelector(':scope > button.copy');
    if (oldCopy) oldCopy.remove();

    if (block.querySelector('.code-block-header')) return;

    const langMatch = block.className.match(/language-([a-zA-Z0-9_-]+)/);
    const lang = (langMatch ? langMatch[1] : 'code').toUpperCase();

    const header = document.createElement('div');
    header.className = 'code-block-header';

    const langSpan = document.createElement('span');
    langSpan.className = 'code-block-lang';
    langSpan.textContent = lang;
    header.appendChild(langSpan);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'code-block-copy';
    copyBtn.setAttribute('aria-label', 'Copy code');
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><span>Copy</span>';

    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pre = block.querySelector('pre');
      const text = pre?.textContent || '';
      const success = await copyTextToClipboard(text);
      if (success) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied</span>';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><span>Copy</span>';
        }, 2000);
      }
    });

    header.appendChild(copyBtn);

    const pre = block.querySelector('pre');
    if (pre) {
      block.insertBefore(header, pre);
    } else {
      block.prepend(header);
    }
  });

  const standalonePres = document.querySelectorAll('.vp-doc pre:not(.code-block-wrapper pre):not(.code-enhanced-pre)');
  standalonePres.forEach((pre) => {
    if (pre.closest('.code-block-wrapper') || pre.closest('div[class*="language-"]')) return;
    pre.classList.add('code-enhanced-pre');
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper code-enhanced';

    const header = document.createElement('div');
    header.className = 'code-block-header';

    const langSpan = document.createElement('span');
    langSpan.className = 'code-block-lang';
    langSpan.textContent = 'CODE';
    header.appendChild(langSpan);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'code-block-copy';
    copyBtn.setAttribute('aria-label', 'Copy code');
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><span>Copy</span>';

    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = pre.textContent || '';
      const success = await copyTextToClipboard(text);
      if (success) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied</span>';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><span>Copy</span>';
        }, 2000);
      }
    });

    header.appendChild(copyBtn);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  });
}

// ── Image Enhancer (1:1 with wf-docscore DocImage.tsx & Lightbox) ───────────
function enhanceDocImages() {
  if (typeof document === 'undefined') return;
  const images = document.querySelectorAll('.vp-doc img:not([data-enhanced])');
  images.forEach((img) => {
    // Exclude special icons, avatars, footer items, and already wrapped elements
    if (
      img.closest('.doc-image-figure') ||
      img.hasAttribute('data-enhanced') ||
      img.closest('.VPLastUpdated') ||
      img.closest('.VPDocFooter') ||
      img.closest('.vp-doc-footer') ||
      img.closest('.wch-author-link') ||
      img.closest('.wch-meta') ||
      img.closest('.wch-badge') ||
      img.closest('.badge') ||
      img.closest('button') ||
      img.closest('.outline') ||
      img.classList.contains('emoji') ||
      img.classList.contains('avatar') ||
      img.hasAttribute('data-no-enhance')
    ) {
      return;
    }

    const src = img.getAttribute('src');
    if (!src) return;
    const alt = img.getAttribute('alt') || '';
    const isGif = src.toLowerCase().endsWith('.gif') || src.toLowerCase().includes('.gif');

    img.setAttribute('data-enhanced', 'true');
    img.classList.add('doc-image-element');
    img.setAttribute('loading', 'lazy');

    const figure = document.createElement('figure');
    figure.className = 'doc-image-figure not-prose';
    figure.title = 'Apasă pentru a mări imaginea (Lightbox HD)';
    figure.setAttribute('data-enhanced', 'true');

    // Create wrapper
    const wrap = document.createElement('div');
    wrap.className = 'doc-image-wrap';

    // Topbar
    const topbar = document.createElement('div');
    topbar.className = 'doc-image-topbar';
    topbar.innerHTML = `
      <div class="doc-image-dots">
        <span class="doc-image-dot"></span>
        <span class="doc-image-dot"></span>
        <span class="doc-image-dot"></span>
      </div>
      <div class="doc-image-meta">
        <span class="doc-image-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-amber-400" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
          <span>${isGif ? 'DEMO ANIMAT' : 'PREVIZUALIZARE'}</span>
        </span>
      </div>
    `;

    // Media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'doc-image-media-container';

    // Hover zoom overlay
    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'doc-image-zoom-overlay';
    zoomOverlay.innerHTML = `
      <span class="doc-image-zoom-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize2 lucide-maximize-2" aria-hidden="true"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
        <span>Mărește Imaginea HD</span>
      </span>
    `;

    // Click handler to open Studio HD Media Lightbox
    figure.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox({
        type: 'image',
        src: src,
        title: alt && alt !== 'Doc image' ? alt : 'Previzualizare Imagine',
        alt: alt,
      });
    });

    wrap.appendChild(topbar);

    const parent = img.parentNode;
    if (!parent) return;

    const isInTable = img.closest('table') !== null;

    if (alt && alt.trim() !== '' && alt !== 'Doc image' && !isInTable) {
      const caption = document.createElement('figcaption');
      caption.className = 'doc-image-caption';
      const captionPill = document.createElement('span');
      captionPill.className = 'doc-image-caption-pill';
      captionPill.textContent = alt;
      caption.appendChild(captionPill);
      figure.appendChild(caption);
    }

    const isSingleP = parent.tagName === 'P' && parent.children.length === 1 && parent.textContent.trim() === '';
    if (isSingleP && parent.parentNode) {
      parent.parentNode.insertBefore(figure, parent);
      parent.remove();
    } else {
      parent.insertBefore(figure, img);
      img.remove();
    }

    mediaContainer.appendChild(img);
    mediaContainer.appendChild(zoomOverlay);
    wrap.appendChild(mediaContainer);
    figure.insertBefore(wrap, figure.firstChild);
  });
}

// ── Video Enhancer (1:1 with wf-docscore DocVideo.tsx & Lightbox) ───────────
function enhanceDocVideos() {
  if (typeof document === 'undefined') return;
  const videos = document.querySelectorAll('.vp-doc video:not([data-enhanced]):not(.doc-orange-player-bg-video):not(.wf-lightbox-video)');
  videos.forEach((video) => {
    if (video.closest('.doc-orange-player-figure') || video.closest('.wf-lightbox-video-wrap')) return;

    const src = video.getAttribute('src') || video.currentSrc;
    if (!src) return;
    const title = video.getAttribute('title') || 'Previzualizare Video HD';
    const badge = video.getAttribute('data-badge') || 'In-Game Preview';

    video.setAttribute('data-enhanced', 'true');
    video.classList.add('doc-orange-player-bg-video');
    video.setAttribute('preload', 'metadata');
    video.muted = true;
    video.playsInline = true;

    const figure = document.createElement('figure');
    figure.className = 'doc-orange-player-figure not-prose';
    figure.setAttribute('data-enhanced', 'true');

    const card = document.createElement('div');
    card.className = 'doc-orange-player-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.title = 'Apasă pentru a deschide videoclipul în mod teatru HD';

    const header = document.createElement('div');
    header.className = 'doc-orange-player-header';
    header.innerHTML = `
      <div class="doc-orange-player-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film text-amber-400" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><polyline points="7 3 7 8 15 8"/><line x1="10" x2="10" y1="8" y2="21"/><line x1="7" x2="7" y1="13" y2="21"/></svg>
        <span>${badge}</span>
      </div>
      <span class="doc-orange-player-title">${title}</span>
      <div class="doc-orange-player-status">
        <span class="player-status-dot" aria-hidden="true"></span>
        <span>HD PREVIEW</span>
      </div>
    `;

    const stage = document.createElement('div');
    stage.className = 'doc-orange-player-stage';

    const overlay = document.createElement('div');
    overlay.className = 'doc-orange-player-overlay';

    const playBtnWrap = document.createElement('div');
    playBtnWrap.className = 'doc-orange-play-btn-wrap';
    playBtnWrap.innerHTML = `
      <div class="doc-orange-play-btn-pulse" aria-hidden="true"></div>
      <div class="doc-orange-play-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="play-icon-fill" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>
      </div>
      <span class="doc-orange-play-label">
        <span>Lansează Video</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-300" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      </span>
    `;

    const footer = document.createElement('div');
    footer.className = 'doc-orange-player-footer';
    footer.innerHTML = `
      <div class="player-footer-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400/80" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        <span>Click oriunde pentru a deschide playerul cinematic</span>
      </div>
      <div class="player-footer-right">
        <span class="player-theatre-tag">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
          <span>Mod Teatru</span>
        </span>
      </div>
    `;

    const openVideo = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox({
        type: 'video',
        src: src,
        title: title,
      });
    };

    card.addEventListener('click', openVideo);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openVideo(e);
    });

    const parent = video.parentNode;
    if (!parent) return;

    if (title && title !== 'Previzualizare Video HD') {
      const caption = document.createElement('figcaption');
      caption.className = 'doc-orange-player-caption';
      caption.textContent = title;
      figure.appendChild(caption);
    }

    const isSingleP = parent.tagName === 'P' && parent.children.length === 1 && parent.textContent.trim() === '';
    if (isSingleP && parent.parentNode) {
      parent.parentNode.insertBefore(figure, parent);
      parent.remove();
    } else {
      parent.insertBefore(figure, video);
      video.remove();
    }

    stage.appendChild(video);
    stage.appendChild(overlay);
    stage.appendChild(playBtnWrap);

    card.appendChild(header);
    card.appendChild(stage);
    card.appendChild(footer);

    figure.insertBefore(card, figure.firstChild);
  });
}

// ── Table Enhancer (Responsive Wrapper without breaking display: table) ───
function enhanceTables() {
  if (typeof document === 'undefined') return;
  const tables = document.querySelectorAll('.vp-doc table:not(.table-enhanced)');
  tables.forEach((tbl) => {
    tbl.classList.add('table-enhanced');
    const parent = tbl.parentElement;
    if (parent && !parent.classList.contains('table-wrapper')) {
      const wrap = document.createElement('div');
      wrap.className = 'table-wrapper';
      parent.insertBefore(wrap, tbl);
      wrap.appendChild(tbl);
    }
  });
}

function runEnhancements() {
  enhanceCallouts()
  enhanceCodeBlocks()
  enhanceDocImages()
  enhanceDocVideos()
  enhanceTables()
}

// ── Route change: re-inject reading time & reset lightbox ───
watch(() => page.value.relativePath, () => {
  if (typeof window === 'undefined') return
  closeLightbox()
  injectProgressRing()
  updateTheme()
  nextTick(() => {
    updateTheme()
    runEnhancements()
  })
}, { immediate: true })

function handleDelegatedMediaClick(e) {
  const figure = e.target.closest('.doc-image-figure');
  if (figure) {
    e.preventDefault();
    e.stopPropagation();
    const img = figure.querySelector('img');
    const src = img?.getAttribute('src') || img?.src || '';
    const alt = img?.getAttribute('alt') || '';
    if (src) {
      openLightbox({
        type: 'image',
        src,
        title: alt && alt !== 'Doc image' ? alt : 'Previzualizare Imagine',
        alt,
      });
    }
    return;
  }

  const videoCard = e.target.closest('.doc-orange-player-card');
  if (videoCard) {
    e.preventDefault();
    e.stopPropagation();
    const video = videoCard.querySelector('video');
    const src = video?.getAttribute('src') || video?.currentSrc || '';
    const title = videoCard.querySelector('.doc-orange-player-title')?.textContent || 'Previzualizare Video HD';
    if (src) {
      openLightbox({
        type: 'video',
        src,
        title,
      });
    }
  }
}

function handleWindowWheel(e) {
  if (activeMedia.value) {
    handleWheel(e);
  }
}

function handleWindowTouchMove(e) {
  if (activeMedia.value) {
    e.preventDefault();
  }
}

let domObserver = null;
onMounted(() => {
  if (typeof MutationObserver !== 'undefined') {
    domObserver = new MutationObserver(() => { runEnhancements(); });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }
  document.addEventListener('click', handleCopyClick)
  document.addEventListener('click', handleDelegatedMediaClick)
  window.addEventListener('keydown', handleKeyEvents)
  window.addEventListener('scroll', updateProgressRing, { passive: true })
  window.addEventListener('wheel', handleWindowWheel, { passive: false })
  window.addEventListener('touchmove', handleWindowTouchMove, { passive: false })
  window.addEventListener('mouseup', handleMouseUp)
  injectProgressRing()
  updateTheme()
  runEnhancements()
  setTimeout(runEnhancements, 100)
  setTimeout(runEnhancements, 300)
  setTimeout(runEnhancements, 800)
})

onUnmounted(() => {
  if (domObserver) domObserver.disconnect();
  document.removeEventListener('click', handleCopyClick)
  document.removeEventListener('click', handleDelegatedMediaClick)
  window.removeEventListener('keydown', handleKeyEvents)
  window.removeEventListener('scroll', updateProgressRing)
  window.removeEventListener('wheel', handleWindowWheel)
  window.removeEventListener('touchmove', handleWindowTouchMove)
  window.removeEventListener('mouseup', handleMouseUp)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  clearTimeout(copyTimer)
  clearTimeout(hintTimer)
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
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

/* ── Lightbox Transition ────────────────────────────── */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
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
