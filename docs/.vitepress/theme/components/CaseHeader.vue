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
        <component v-for="(tag, i) in effectiveTags" :key="i" :is="tag.component">{{ tag.text }}</component>
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
                <span class="wch-tool-label">{{ tool.label }}</span>
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
    return props.tags.map(t => ({ ...t, component: themeComp }))
  }
  return [{ text: section ? section.replace('_', ' ') : '', component: themeComp }]
})

const GITHUB_REPO   = 'WildFiire/docs'
const GITHUB_BRANCH = 'main'
const relPath       = computed(() => page.value?.relativePath || '')
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
  const q   = encodeURIComponent('Explică această pagină de documentație: ' + url)
  return [
    {
      id: 'github',
      label: 'Open in GitHub',
      url: githubFileUrl.value,
      svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
    },
    {
      id: 'markdown',
      label: 'View as Markdown',
      url: rawUrl.value,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 15V9l2.5 3 2.5-3v6"/><path d="M17 9v6"/><path d="M15 12h4"/></svg>`
    },
    {
      id: 'scira',
      label: 'Open in Scira AI',
      url: `https://scira.ai?q=${q}`,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><circle cx="10" cy="10" r="6"/><path d="m21 21-4.35-4.35"/><path d="M10 7v6M7 10h6"/></svg>`
    },
    {
      id: 'chatgpt',
      label: 'Open in ChatGPT',
      url: `https://chatgpt.com/?q=${q}`,
      svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.022 12.348a4.49 4.49 0 0 1-2.88-1.035l.142-.081 4.783-2.761a.78.78 0 0 0 .395-.681v-6.745l2.024 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.502 4.5zm-9.68-4.132a4.49 4.49 0 0 1-.535-3.014l.142.085 4.783 2.762a.78.78 0 0 0 .785 0l5.833-3.369v2.332a.08.08 0 0 1-.032.065L9.74 19.95a4.5 4.5 0 0 1-6.16-1.913zm-1.265-10.62a4.49 4.49 0 0 1 2.343-1.975v5.62a.766.766 0 0 0 .388.676l5.815 3.355-2.024 1.168a.076.076 0 0 1-.072 0L4.11 13.051a4.504 4.504 0 0 1-.793-5.634zm16.612 3.87l-5.833-3.37 2.024-1.16a.076.076 0 0 1 .072 0l4.776 2.758a4.49 4.49 0 0 1-.676 8.108V9.84a.78.78 0 0 0-.363-.683zm2.012-3.022l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 8.57V6.237a.08.08 0 0 1 .032-.065l4.757-2.746a4.5 4.5 0 0 1 6.684 4.66zm-12.66 4.135l-2.024-1.168a.08.08 0 0 1-.038-.057V6.537a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.783 2.762a.78.78 0 0 0-.394.681zm1.099-2.37l2.598-1.498 2.598 1.493v2.986l-2.598 1.498-2.598-1.493z"/></svg>`
    },
    {
      id: 'claude',
      label: 'Open in Claude',
      url: `https://claude.ai/new?q=${q}`,
      svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194a3.3304 3.3304 0 0 1-.1032-.7285l.4068-.6496.4128-.1275.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.079-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.8500-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3418-1.3964 1.7789-.9471 1.3236-.1518.2854.0486.0607.2247-.0364 2.8535-.6071 1.5422-.3035 1.5058-.2732.5221.255.0911.4068-.3278.8074-1.9672.4857-2.3072.5464-3.4363.7954-.0425.0304.0486.0607 1.5483 1.4086 2.1314 1.9368 1.4208 1.3479.7407.7832.1822.6253-.3521.5828-.7225.0425-.5343-.255-.6314-.6253-1.2264-1.1414-2.0036-1.8275-1.3357-1.2203-.3278-.0425-.0425.0972.0182.1518.9471 2.358.6982 1.9004.5221 1.7424.1154.9957-.4493.7286-.6557.1822-.6921-.3278-.3035-.5707-.2793-1.2871-.5100-2.4346-.5707-2.3072-.4311-1.5422-.0607-.1275.0972-.0364.1336 1.2264 2.9567.7407 1.8882.4554 1.6028.0425.9714-.5586.6435-.6011.0911-.9471-.4372-.2307-.4797-.4311-1.2325-1.0200-2.7503-.9107-2.358-.6253-1.6635-.2186-.2004.0972-.1154.1518.0304.2186 1.0382 1.7667.8014 1.4025.6618 1.3479.2307.9228-.3764.7468-.6375.2247-.5950-.2004-.3825-.5100-.7954-1.4450-1.4572-2.6349-1.1232-2.0400-.8379-1.5908-.1943-.2065.0607-.0972.1457.0182.2672 1.2689 1.6392 1.0079 1.4329.7954 1.3600.4007.9653-.0182.5343-.5221.5343-.8257.0486-.5828-.2247-1.3600-1.1414-2.1800-1.8518-1.7424-1.4693-.5586-.1336-.2186.0729-.0911.2368.0303.5221.2004.4311.8621 1.3964 2.3679 1.0686 1.7788z"/></svg>`
    },
    {
      id: 'cursor',
      label: 'Open in Cursor',
      url: `cursor://${url}`,
      svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M11.9771 0 23.499 6.2679v11.4642L11.9771 24 .4551 17.7321V6.2679zm.0229 1.9033-9.5679 5.251v10.6447l9.5679 5.2975 9.5449-5.2975V7.1543zM12 4.7786l7.6152 4.1906v8.3616L12 21.2214l-7.6152-4.0906V8.9692z"/></svg>`
    },
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
/* ─── Root — NO overflow:hidden, gridul e clipat prin pseudo ─── */
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

/* Grid + glow sunt clipate printr-un pseudo, nu prin overflow pe root */
.wch-grid-bg,
.wch-ambient-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 12px;
  pointer-events: none;
}

.wch-grid-bg {
  background-image:
    linear-gradient(rgba(var(--wf-accent-rgb), 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--wf-accent-rgb), 0.08) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 20%, transparent 100%);
  overflow: hidden; /* clipare locala doar pe grid */
}

.wch-ambient-glow {
  background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--wf-accent-rgb), 0.13), transparent 70%);
  overflow: hidden;
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

/* ─── Dropdown — iese din root, fara overflow clip ─── */
.wch-open-wrap {
  position: relative;
  /* z-index ridicat ca sa fie deasupra oricarui element din pagina */
  z-index: 9999;
}

.wch-open-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 9999;
  min-width: 230px;

  /* ── Liquid Glass ── */
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 5px;

  /* highlight de lumina pe margine superioara */
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.06) inset,
    0 1px 0 0 rgba(255, 255, 255, 0.15) inset,
    0 20px 48px rgba(0, 0, 0, 0.55),
    0 4px 12px rgba(0, 0, 0, 0.35);

  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* Light mode — glass mai deschis */
html:not(.dark) .wch-open-menu {
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.9) inset,
    0 1px 0 0 rgba(255, 255, 255, 1) inset,
    0 12px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
}

.wch-open-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 11px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 450;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  transition: background 0.12s ease, color 0.12s ease;
  letter-spacing: 0.01em;
}
.wch-open-item:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

html:not(.dark) .wch-open-item { color: rgba(0, 0, 0, 0.72); }
html:not(.dark) .wch-open-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.9);
}

.wch-tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.12s ease;
}
html:not(.dark) .wch-tool-icon { color: rgba(0, 0, 0, 0.4); }
.wch-open-item:hover .wch-tool-icon { color: rgba(255, 255, 255, 0.95); }
html:not(.dark) .wch-open-item:hover .wch-tool-icon { color: rgba(0, 0, 0, 0.7); }

.wch-tool-label { flex: 1; }

.wch-ext-icon {
  color: rgba(255, 255, 255, 0.22);
  flex-shrink: 0;
  transition: color 0.12s;
}
html:not(.dark) .wch-ext-icon { color: rgba(0, 0, 0, 0.18); }
.wch-open-item:hover .wch-ext-icon { color: rgba(255, 255, 255, 0.5); }
html:not(.dark) .wch-open-item:hover .wch-ext-icon { color: rgba(0, 0, 0, 0.35); }

/* ─── Transition ─── */
.wch-dd-enter-active,
.wch-dd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.wch-dd-enter-from,
.wch-dd-leave-to { opacity: 0; transform: translateY(-5px) scale(0.98); }

/* ─── Meta ─── */
.wch-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid var(--vp-c-divider); }
.wch-meta-chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; color: var(--vp-c-text-2); font-weight: 500;
  text-decoration: none; transition: all 0.2s ease;
}
.wch-meta-chip svg { color: var(--vp-c-text-3); }
.wch-author-link:hover { color: var(--vp-c-brand-1); }
.wch-author-link:hover svg { color: var(--vp-c-brand-1); }
.wch-author-pfp { border-radius: 50%; box-shadow: 0 0 0 1px rgba(var(--wf-accent-rgb), 0.2); }

@media (max-width: 640px) {
  .wch-inner { padding: 18px 16px 16px; }
  .wch-title { font-size: 1.4rem !important; }
  .wch-btn { padding: 5px 10px; font-size: 12px; }
}
</style>