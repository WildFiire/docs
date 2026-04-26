<template>
  <div class="cases-wf wch-root" :id="pageId || undefined">
    <div class="wch-grid-bg" aria-hidden="true" />
    <div class="wch-ambient-glow" aria-hidden="true" />
    <div class="wch-inner">

      <!-- Breadcrumb -->
      <nav v-if="path && path.length" class="wch-breadcrumb" aria-label="Breadcrumb">
        <template v-for="(crumb, i) in path" :key="i">
          <span :class="['wch-crumb', { 'wch-crumb--active': i === path.length - 1 }]">{{ crumb }}</span>
          <svg v-if="i < path.length - 1" class="wch-crumb-arrow" width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
            <path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
      </nav>

      <!-- Title -->
      <h1 class="wch-title">{{ title }}</h1>

      <!-- Tags -->
      <div v-if="effectiveTags.length" class="wch-tags">
        <component v-for="(tag, i) in effectiveTags" :key="i" :is="tag.component" :text="tag.text" />
      </div>

      <!-- Toolbar -->
      <div class="wch-toolbar">
        <a :href="editUrl" target="_blank" rel="noopener noreferrer" class="wch-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit this page
        </a>
        <button class="wch-btn" :class="{ 'wch-btn--success': copied }" @click="handleCopy">
          <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
          {{ copied ? 'Copied!' : 'Copy markdown' }}
        </button>
        <div class="wch-open-wrap" ref="openInRef">
          <button class="wch-btn wch-btn--dropdown" @click="dropdownOpen = !dropdownOpen">
            Open in
            <svg class="wch-chevron" :style="dropdownOpen ? 'transform:rotate(180deg)' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <Transition name="wch-dd">
            <div v-if="dropdownOpen" class="wch-open-menu" role="menu">
              <a v-for="tool in openInTools" :key="tool.id" :href="tool.url" target="_blank" rel="noopener noreferrer" class="wch-open-item" role="menuitem" @click="dropdownOpen = false">
                <span class="wch-tool-icon" v-html="tool.svg" />
                <span class="wch-tool-label">Open in {{ tool.name }}</span>
                <svg class="wch-ext-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Meta -->
      <div v-if="lastUpdatedText || uploadedByValue" class="wch-meta">
        <span v-if="lastUpdatedText" class="wch-meta-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Updated {{ lastUpdatedText }}
        </span>
        <a v-if="uploadedByValue" :href="`https://github.com/${uploadedByValue}`" target="_blank" rel="noopener noreferrer" class="wch-meta-chip wch-author-link github-profile" :data-username="uploadedByValue">
          <img :src="`https://github.com/${uploadedByValue}.png`" :alt="uploadedByValue" width="20" height="20" loading="lazy" class="wch-author-pfp" />
          by {{ uploadedByValue }}
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  title:      { type: String, required: true },
  tags:       { type: Array,  default: () => [] },
  path:       { type: Array,  default: () => [] },
  pageId:     { type: String, default: '' },
  uploadedBy: { type: String, default: '' },
  background: { type: String, default: '' },
  blurAmount: { type: Number, default: 8 },
  icon:       { type: String, default: '' },
  badgeText:  { type: String, default: '' },
  badgeIcon:  { type: String, default: '' },
})

const { page, frontmatter } = useData()

const SECTION_TAG_COMPONENT = {
  informatii:   'PageTagOrange',
  currency:     'PageTagGreen',
  systems:      'PageTagRed',
  market:       'PageTagPurple',
  updates_wiki: 'PageTagAmber',
}

const effectiveTags = computed(() => {
  const section = page.value?.relativePath?.split('/')[0]
  const themeComp = SECTION_TAG_COMPONENT[section] || 'PageTagOrange'
  
  if (props.tags?.length) {
    return props.tags.map(t => ({
      ...t,
      component: themeComp
    }))
  }
  return [{ text: section ? section.replace('_', ' ') : '', component: themeComp }]
})

const GITHUB_REPO   = 'WildFiire/docs'
const GITHUB_BRANCH = 'main'
const relPath = computed(() => page.value?.relativePath || '')
const editUrl       = computed(() => `https://github.com/${GITHUB_REPO}/edit/${GITHUB_BRANCH}/docs/${relPath.value}`)
const rawUrl        = computed(() => `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/docs/${relPath.value}`)
const githubFileUrl = computed(() => `https://github.com/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/docs/${relPath.value}`)

const copied = ref(false)
let copyTimer = null
async function handleCopy() {
  try {
    const res = await fetch(rawUrl.value)
    const text = res.ok ? await res.text() : window.location.href
    await navigator.clipboard.writeText(text)
  } catch { try { await navigator.clipboard.writeText(window.location.href) } catch {} }
  copied.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copied.value = false }, 2500)
}

const dropdownOpen = ref(false)
const openInRef = ref(null)
function handleOutside(e) {
  if (openInRef.value && !openInRef.value.contains(e.target)) dropdownOpen.value = false
}
onMounted(() => document.addEventListener('click', handleOutside, true))
onUnmounted(() => { document.removeEventListener('click', handleOutside, true); clearTimeout(copyTimer) })

const openInTools = computed(() => {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const q   = encodeURIComponent('Explain this documentation page: ' + url)
  return [
    { id: 'chatgpt',    name: 'ChatGPT',    url: `https://chatgpt.com/?q=${q}`,                            svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073z"/></svg>` },
    { id: 'claude',     name: 'Claude',     url: `https://claude.ai/new?q=${q}`,                           svg: `<svg viewBox="0 0 100 100" fill="currentColor" width="14" height="14"><path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm-8 62.5L20.5 55l7.5-4.3 14 8.1V35.2l8.5-4.9v45.4l-8.5-8.2zm24.5 0l-8.5-4.9V25.3l8.5 4.9v37.3z"/></svg>` },
    { id: 'cursor',     name: 'Cursor',     url: rawUrl.value,                                             svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M8 12h8M12 8v8"/></svg>` },
    { id: 'perplexity', name: 'Perplexity', url: `https://www.perplexity.ai/search?q=${q}`,               svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
    { id: 'github',     name: 'GitHub',     url: githubFileUrl.value,                                      svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>` },
  ]
})

const lastUpdatedText = computed(() => {
  const ts = page.value?.lastUpdated
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
})
const uploadedByValue = computed(() => props.uploadedBy || frontmatter.value?.gitLastCommitter || frontmatter.value?.uploadedBy || '')
</script>

<style scoped>
.wch-root {
  position: relative;
  z-index: 50;
  border-radius: 12px;
  border: 1px solid rgba(var(--wf-accent-rgb), 0.15);
  background: var(--vp-c-bg-soft);
  margin-bottom: 2rem;
  transition: border-color 0.3s ease;
}
.wch-root:hover { border-color: rgba(var(--wf-accent-rgb), 0.28); }

.wch-grid-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(var(--wf-accent-rgb), 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--wf-accent-rgb), 0.08) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%);
}

.wch-ambient-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  overflow: hidden;
  background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--wf-accent-rgb), 0.13), transparent 70%);
  pointer-events: none;
}

.wch-inner {
  position: relative;
  z-index: 1;
  padding: 28px 32px 24px;
}

.wch-breadcrumb { display: flex; align-items: center; gap: 5px; margin-bottom: 14px; }
.wch-crumb { font-size: 11.5px; font-weight: 500; color: var(--vp-c-text-3); letter-spacing: 0.01em; }
.wch-crumb--active { color: var(--vp-c-text-2); }
.wch-crumb-arrow { color: var(--vp-c-text-3); flex-shrink: 0; opacity: 0.4; }

.wch-title {
  font-family: 'Orbitron', sans-serif !important;
  font-size: clamp(1.5rem, 4vw, 2.1rem) !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  color: var(--vp-c-brand-1) !important;
  margin: 0 0 14px !important;
  padding: 0 !important;
  border: none !important;
  letter-spacing: -0.02em !important;
}
.wch-title::before { display: none !important; }

.wch-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }

.wch-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }

.wch-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.18s ease;
  white-space: nowrap;
  line-height: 1.4;
}
.wch-btn:hover {
  border-color: rgba(var(--wf-accent-rgb), 0.4);
  color: var(--vp-c-brand-1);
  background: rgba(var(--wf-accent-rgb), 0.05);
}
.wch-btn--success {
  border-color: rgba(16, 185, 129, 0.4) !important;
  color: #10b981 !important;
  background: rgba(16, 185, 129, 0.06) !important;
}
.wch-chevron { transition: transform 0.2s ease; flex-shrink: 0; opacity: 0.6; }

.wch-open-wrap { position: relative; }
.wch-open-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 200;
  min-width: 210px;
  background: var(--vp-c-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
/* Ensure the dropdown is completely solid if the theme variables are transparent */
html.dark .wch-open-menu {
  background: rgba(22, 22, 24, 0.98);
}
html:not(.dark) .wch-open-menu {
  background: rgba(255, 255, 255, 0.98);
}
.wch-open-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}
.wch-open-item:hover { 
  background: rgba(var(--wf-accent-rgb), 0.12); 
  color: var(--vp-c-brand-1); 
}
.wch-tool-icon { display: flex; align-items: center; color: inherit; flex-shrink: 0; opacity: 0.8; }
.wch-tool-label { flex: 1; }
.wch-ext-icon { color: inherit; opacity: 0.4; flex-shrink: 0; transition: opacity 0.15s; }
.wch-open-item:hover .wch-ext-icon { opacity: 0.8; }

.wch-dd-enter-active, .wch-dd-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.wch-dd-enter-from, .wch-dd-leave-to { opacity: 0; transform: translateY(-4px); }

.wch-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid var(--vp-c-divider); }
.wch-meta-chip { 
  display: inline-flex; align-items: center; gap: 6px; 
  font-size: 12.5px; color: var(--vp-c-text-2); font-weight: 500; 
  text-decoration: none; transition: all 0.2s ease;
}
.wch-meta-chip svg { color: var(--vp-c-text-3); }
.wch-author-link:hover { 
  color: var(--vp-c-brand-1); 
}
.wch-author-link:hover svg { color: var(--vp-c-brand-1); }
.wch-author-pfp { border-radius: 50%; box-shadow: 0 0 0 1px rgba(var(--wf-accent-rgb), 0.2); }

@media (max-width: 640px) {
  .wch-inner { padding: 18px 16px 16px; }
  .wch-title { font-size: 1.4rem !important; }
  .wch-btn { padding: 5px 10px; font-size: 12px; }
}
</style>