<template>
  <div class="last-updates">

    <!-- ── Header ── -->
    <div class="updates-header">
      <div class="header-left">
        <div class="header-overline">
          <span class="overline-line"></span>
          <span class="overline-text">WIKI</span>
          <span class="overline-dot"></span>
        </div>
        <div class="title-row">
          <h2 class="section-title">Recently <span class="title-accent">Updated</span></h2>
          <div class="live-pill">
            <span class="live-ring"></span>
            <span class="live-dot"></span>
            <span class="live-label">LIVE</span>
          </div>
        </div>
        <p class="section-sub">Cele mai recente modificări din documentație</p>
      </div>
      <div class="header-right">
        <div class="count-badge" :class="{ 'sk-badge': !mounted }">
          <svg v-if="mounted" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span v-if="mounted">{{ cards.length }}&nbsp;pages</span>
        </div>
      </div>
    </div>

    <!-- ── Skeleton ── -->
    <div v-if="!mounted" class="updates-grid">
      <div v-for="n in 6" :key="'sk-'+n" class="update-card sk-card">
        <div class="sk-top-bar"></div>
        <div class="sk-body">
          <div class="sk-row">
            <span class="sk sk-avatar"></span>
            <span class="sk sk-pill"></span>
          </div>
          <span class="sk sk-title"></span>
          <span class="sk sk-line w80"></span>
          <span class="sk sk-line w55"></span>
          <div class="sk-footer-row">
            <span class="sk sk-tag"></span>
            <span class="sk sk-btn"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Real cards ── -->
    <div v-else class="updates-grid">
      <a
        v-for="(card, index) in cards"
        :key="card.link"
        :href="card.link"
        class="update-card"
        :style="{ '--card-accent': getHexColor(card.tagColor) }"
      >
        <!-- Left accent strip -->
        <div class="card-accent-strip" :style="{ background: getHexColor(card.tagColor) }"></div>

        <!-- Watermark -->
        <div class="card-watermark" :style="{ color: getHexColor(card.tagColor) }">{{ card.category }}</div>

        <!-- Dot grid -->
        <div class="card-dots" :style="{ '--dot': getHexColor(card.tagColor) }"></div>

        <!-- Hover shine -->
        <div class="card-shine" :style="{ '--clr': getHexColor(card.tagColor) }"></div>

        <div class="card-body">
          <!-- Category row -->
          <div class="card-top-row">
            <span class="card-category" :style="{ color: getHexColor(card.tagColor), background: getHexColor(card.tagColor) + '18', borderColor: getHexColor(card.tagColor) + '35' }">
              <span class="cat-dot" :class="card.dotClass"></span>
              {{ card.category }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="card-title">{{ card.title }}</h3>

          <!-- Tags below title -->
          <div v-if="card.tag1 || card.tag2" class="card-tags">
            <WildfireTag v-if="card.tag1" :color="card.tagColor" :text="card.tag1" class="small-tag" :icon="getTagIcon(card.tag1)" />
            <WildfireTag v-if="card.tag2" :color="card.tagColor" :text="card.tag2" class="small-tag" :icon="getTagIcon(card.tag2)" />
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <div class="card-author">
              <div class="avatar-wrap">
                <img :src="card.avatarUrl" class="author-avatar" :alt="card.username">
              </div>
              <div class="author-info">
                <span class="author-name"><span class="author-at">@</span>{{ card.username }}</span>
                <span class="author-date">
                  <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 15 14"/></svg>
                  {{ card.date }}
                </span>
              </div>
            </div>
            <span class="read-btn" :style="{ color: getHexColor(card.tagColor), borderColor: getHexColor(card.tagColor) + '45' }">
              {{ card.buttonText }}
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </a>
    </div>

    <!-- ── Footer CTA ── -->
    <div class="updates-footer">
      <a href="/updates_wiki/updateswiki" class="view-all-btn">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Vezi toate noutățile</span>
        <svg class="arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WildfireTag from './WildfireTag.vue'
import cards from 'virtual:last-updates'

const isDark = ref(true)
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  isDark.value = document.documentElement.classList.contains('dark')
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  onUnmounted(() => observer.disconnect())
})

const hexColors = {
  blue: '#3b82f6', orange: '#f97316', teal: '#14b8a6', amber: '#f59e0b',
  purple: '#8b5cf6', pink: '#ec4899', red: '#ef4444', green: '#10b981'
}

function getHexColor(color) {
  return hexColors[color] || '#ff7800'
}

function getTagIcon(tag) {
  const tagLower = String(tag || '').toLowerCase()
  if (tagLower.includes('new') || tagLower.includes('nou')) {
    return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>'
  }
  if (tagLower.includes('go')) {
    return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
  }
  if (tagLower.includes('rules') || tagLower.includes('regulament')) {
    return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>'
  }
  if (tagLower.includes('panel') || tagLower.includes('dashboard')) {
    return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>'
  }
  if (tagLower.includes('changes') || tagLower.includes('update')) {
    return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
  }
  if (tagLower.includes('info')) {
    return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>'
  }
  return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="6"/></svg>'
}

function cardWatermark(title) {
  if (!title) return ''
  const word = title.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '')
  return word.substring(0, 6).toUpperCase()
}

function cardStyle(color) {
  const c = getHexColor(color)
  if (isDark.value) {
    return {
      background: `linear-gradient(145deg, ${c}0f 0%, #0d1017 60%)`,
      borderColor: `${c}28`,
      boxShadow: `0 2px 20px -4px ${c}28`
    }
  } else {
    return {
      background: `linear-gradient(145deg, ${c}0a 0%, #ffffff 55%)`,
      borderColor: `${c}35`,
      boxShadow: `0 2px 16px -4px ${c}22`
    }
  }
}
</script>

<style scoped>
/* ── Root & Tokens ── */
.last-updates {
  --accent: #ff7800;
  --accent-mid: rgba(255, 120, 0,0.18);
  --accent-dim: rgba(255, 120, 0,0.08);
  --card-bg: #0d1017;
  --card-border: rgba(255,255,255,0.07);
  --text-1: #f0f4ff;
  --text-2: #94a3b8;
  --text-3: #64748b;
  --border: rgba(255,255,255,0.07);
  max-width: 1120px;
  margin: 48px auto 0;
  padding: 0 24px;
  width: 100%;
}
html:not(.dark) .last-updates {
  --card-bg: #ffffff;
  --card-border: rgba(0,0,0,0.08);
  --text-1: #0f172a;
  --text-2: #475569;
  --text-3: #94a3b8;
  --border: rgba(0,0,0,0.07);
}

/* ── Header ── */
.updates-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  position: relative;
}
.updates-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent);
  border-radius: 1px;
}
.header-left { display: flex; flex-direction: column; gap: 6px; }
.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-overline {
  display: flex;
  align-items: center;
  gap: 8px;
}
.overline-line {
  display: block;
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), #ff7800);
  border-radius: 2px;
}
.overline-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3.5px;
  color: var(--accent);
  text-transform: uppercase;
}
.overline-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.5;
}
.section-title {
  font-family: 'Orbitron', sans-serif !important;
  font-size: clamp(20px, 3.5vw, 28px);
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.5px;
  color: var(--text-1);
}
.title-accent {
  background: linear-gradient(120deg, #ff7800 0%, #ff7800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.section-sub {
  font-family: 'Orbitron', sans-serif !important;
  margin: 0;
  font-size: 13px;
  color: var(--text-3);
  line-height: 1.5;
}
.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}
.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px 3px 7px;
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.25);
  border-radius: 20px;
  flex-shrink: 0;
}
.live-ring {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(34,197,94,0.5);
  animation: ringPulse 1.8s ease-out infinite;
  flex-shrink: 0;
}
.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 5px #22c55e;
  flex-shrink: 0;
}
.live-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #22c55e;
}
@keyframes ringPulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}
.count-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  background: var(--accent-dim);
  border: 1px solid rgba(255, 120, 0,0.25);
  border-radius: 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #ff7800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
}
.count-badge:hover {
  background: rgba(255, 120, 0,0.12);
  border-color: rgba(255, 120, 0,0.4);
}
.sk-badge { width: 80px; height: 30px; background: var(--border); border-radius: 20px; }

/* ── Grid ── */
.updates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

/* ── Cards ── */
.update-card {
  position: relative;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  transition: transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.28s ease, border-color 0.28s ease, background 0.28s ease;
  box-shadow: 0 2px 12px -4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
html:not(.dark) .update-card {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(0, 0, 0, 0.07);
  box-shadow: 0 2px 12px -4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.update-card:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: color-mix(in srgb, var(--card-accent, #ff7800) 45%, transparent);
  box-shadow:
    0 12px 32px -8px color-mix(in srgb, var(--card-accent, #ff7800) 25%, transparent),
    0 4px 16px -4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 0 1px color-mix(in srgb, var(--card-accent, #ff7800) 10%, transparent);
  background: rgba(255, 255, 255, 0.05);
}
html:not(.dark) .update-card:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.card-accent-strip {
  width: 3px;
  flex-shrink: 0;
  border-radius: 3px 0 0 3px;
  transition: width 0.28s ease, box-shadow 0.28s ease;
  box-shadow: 0 0 8px color-mix(in srgb, var(--card-accent, #ff7800) 20%, transparent);
}
.update-card:hover .card-accent-strip {
  width: 5px;
  box-shadow: 0 0 16px color-mix(in srgb, var(--card-accent, #ff7800) 45%, transparent);
}

/* Watermark */
.card-watermark {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
  opacity: 0.04;
  pointer-events: none;
  user-select: none;
  letter-spacing: -2px;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 0;
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.update-card:hover .card-watermark {
  opacity: 0.1;
  transform: translateY(-50%) scale(1.05);
}

/* Dot grid */
.card-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--dot) 0.8px, transparent 0.8px);
  background-size: 16px 16px;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.35s ease;
  mask-image: radial-gradient(ellipse 70% 70% at 80% 50%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 80% 50%, black 20%, transparent 80%);
}
.update-card:hover .card-dots {
  opacity: 0.12;
}

/* Hover shine */
.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, color-mix(in srgb, var(--clr) 12%, transparent) 0%, color-mix(in srgb, var(--clr) 4%, transparent) 40%, transparent 70%);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.35s ease;
}
.update-card:hover .card-shine {
  opacity: 1;
}

/* Glass reflection line at top */
.update-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.06) 70%, transparent);
  z-index: 3;
  pointer-events: none;
}
html:not(.dark) .update-card::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.3) 70%, transparent);
}

/* Bottom glow on hover */
.update-card::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 15%;
  right: 15%;
  height: 2px;
  background: var(--card-accent, #ff7800);
  border-radius: 2px;
  opacity: 0;
  filter: blur(3px);
  z-index: 3;
  transition: opacity 0.3s ease;
}
.update-card:hover::after {
  opacity: 0.5;
}

.card-body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 14px 16px 12px;
}

/* Category + inline tags */
.card-top-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.card-category {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 7px;
  border-radius: 20px;
  border: 1px solid;
  font-family: 'Orbitron', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  flex-shrink: 0;
  transition: filter 0.2s, box-shadow 0.2s;
}
.update-card:hover .card-category {
  filter: brightness(1.15);
  box-shadow: 0 0 8px color-mix(in srgb, var(--card-accent, #ff7800) 20%, transparent);
}
.cat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.card-tags-inline { display: flex; gap: 4px; flex-wrap: wrap; }
.mini-tag {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  white-space: nowrap;
  font-family: 'Orbitron', sans-serif;
  opacity: 0.8;
}

/* Title */
.card-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
  color: var(--text-1);
  margin: 0 0 8px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  transition: color 0.2s;
}
.update-card:hover .card-title {
  color: color-mix(in srgb, var(--card-accent, #ff7800) 15%, var(--text-1));
}

/* Tags */
.card-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: auto;
  padding-bottom: 4px;
}
:deep(.wildfire-tag.small-tag) {
  padding: 3px 9px !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  gap: 4px !important;
  border-radius: 20px !important;
  border: 1px solid currentColor !important;
  background: transparent !important;
  transition: all 0.2s !important;
  display: inline-flex !important;
  align-items: center !important;
  opacity: 0.85;
}
:deep(.wildfire-tag.small-tag:hover) {
  opacity: 1;
  transform: translateY(-1px);
  filter: brightness(1.15);
}
:deep(.wildfire-tag.small-tag svg) {
  width: 10px; height: 10px;
  stroke: currentColor;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  gap: 6px;
}
.card-author {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.author-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  object-fit: cover;
  display: block;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.update-card:hover .author-avatar {
  border-color: rgba(255, 120, 0,0.45);
  box-shadow: 0 0 8px rgba(255, 120, 0,0.2);
}
.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.author-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  letter-spacing: 0.3px;
}
.author-at {
  color: var(--accent);
  opacity: 0.7;
  margin-right: 1px;
}
.author-date {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: var(--text-3);
  white-space: nowrap;
  line-height: 1.2;
}
.author-date svg { opacity: 0.6; flex-shrink: 0; }
.read-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid;
  white-space: nowrap;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s, gap 0.2s, box-shadow 0.2s, background 0.2s;
  background: transparent;
}
.update-card:hover .read-btn {
  opacity: 1;
  gap: 6px;
  background: color-mix(in srgb, var(--card-accent, #ff7800) 8%, transparent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--card-accent, #ff7800) 15%, transparent);
}
.read-btn svg { transition: transform 0.2s; }
.update-card:hover .read-btn svg { transform: translateX(3px); }

/* ── Dot colors ── */
.dot-blue { background: #3b82f6; }
.dot-orange { background: #f97316; }
.dot-amber { background: #f59e0b; }
.dot-teal { background: #14b8a6; }
.dot-purple { background: #8b5cf6; }
.dot-pink { background: #ec4899; }
.dot-red { background: #ef4444; }
.dot-green { background: #10b981; }

/* ── Skeleton ── */
@keyframes skShimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.sk-card { min-height: 150px; cursor: default; }
.sk-card:hover { transform: none !important; }
.sk-top-bar {
  height: 3px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: skShimmer 1.6s infinite linear;
}
.sk-body { padding: 16px 16px 14px; display: flex; flex-direction: column; gap: 10px; }
.sk-row { display: flex; align-items: center; gap: 8px; }
.sk-footer-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.sk {
  display: block;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: skShimmer 1.6s infinite linear;
}
html:not(.dark) .sk {
  background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%);
  background-size: 800px 100%;
}
.sk-avatar { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; }
.sk-pill { height: 18px; width: 70px; border-radius: 5px; }
.sk-title { height: 14px; width: 90%; border-radius: 3px; }
.sk-line { height: 11px; border-radius: 3px; }
.sk-line.w80 { width: 80%; }
.sk-line.w55 { width: 55%; }
.sk-tag { height: 16px; width: 60px; border-radius: 4px; }
.sk-btn { height: 24px; width: 72px; border-radius: 5px; }
html:not(.dark) .sk-top-bar {
  background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.09) 50%, rgba(0,0,0,0.04) 75%);
  background-size: 800px 100%;
  animation: skShimmer 1.6s infinite linear;
}

/* ── Footer CTA ── */
.updates-footer { text-align: center; margin-top: 8px; }
.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  text-decoration: none;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  padding: 11px 28px;
  border-radius: 12px;
  border: 1px solid rgba(255, 120, 0,0.3);
  background: linear-gradient(135deg, rgba(255, 120, 0,0.08) 0%, rgba(255,140,0,0.05) 100%);
  transition: all 0.22s ease;
  position: relative;
  overflow: hidden;
}
.view-all-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 120, 0,0.0) 0%, rgba(255,140,0,0.0) 100%);
  transition: background 0.22s ease;
}
.view-all-btn:hover {
  border-color: rgba(255, 120, 0,0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 120, 0,0.18);
}
.view-all-btn:hover::before {
  background: linear-gradient(135deg, rgba(255, 120, 0,0.1) 0%, rgba(255,140,0,0.07) 100%);
}
.arrow-icon { transition: transform 0.2s; }
.view-all-btn:hover .arrow-icon { transform: translateX(4px); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .updates-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .updates-grid { grid-template-columns: 1fr; gap: 12px; }
  .updates-header { flex-direction: column; align-items: flex-start; gap: 14px; }
  .header-right { flex-direction: row; align-items: center; }
  .section-title { font-size: 22px; }
}
@media (max-width: 480px) {
  .last-updates { padding: 0 16px; }
  .section-title { font-size: 20px; }
}
</style>