<template>
  <div class="last-updates">

    <!-- ── Section Label (matching WikiHome pattern) ── -->
    <div class="lu-section-label">
      <span class="lu-label__line"></span>
      <span class="lu-label__text orbitron-font"><Icon icon="mdi:update" width="12" height="12" class="lu-label__icon" />RECENT UPDATES</span>
      <div class="lu-live-pill">
        <span class="lu-live-ring"></span>
        <span class="lu-live-dot"></span>
      </div>
      <span class="lu-label__line"></span>
    </div>
    <h2 class="lu-title orbitron-font"><Icon icon="mdi:file-document-edit-outline" width="28" height="28" class="lu-title__icon" />Ultimele <span class="lu-accent">Modificari</span></h2>
    <p class="lu-desc orbitron-font">Cele mai recente pagini actualizate din documentatie</p>

    <!-- ── Skeleton ── -->
    <div v-if="!mounted" class="lu-grid">
      <div v-for="n in 6" :key="'sk-'+n" class="lu-card lu-card--sk">
        <div class="sk-strip"></div>
        <div class="sk-body">
          <span class="sk sk-pill"></span>
          <span class="sk sk-title-line"></span>
          <span class="sk sk-desc-line"></span>
          <div class="sk-footer">
            <span class="sk sk-avatar"></span>
            <span class="sk sk-name"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Real cards ── -->
    <div v-else class="lu-grid">
      <a
        v-for="(card, index) in cards"
        :key="card.link"
        :href="card.link"
        class="lu-card"
        :style="{ '--accent': getHexColor(card.tagColor) }"
      >
        <!-- Accent strip -->
        <div class="lu-card__strip" :style="{ background: getHexColor(card.tagColor) }"></div>

        <!-- Watermark -->
        <span class="lu-card__watermark orbitron-font" :style="{ color: getHexColor(card.tagColor) }">{{ card.category }}</span>

        <div class="lu-card__body">
          <!-- Category badge -->
          <span class="lu-card__cat orbitron-font" :style="{ color: getHexColor(card.tagColor), background: getHexColor(card.tagColor) + '12', borderColor: getHexColor(card.tagColor) + '30' }">
            <span class="lu-card__cat-dot" :style="{ background: getHexColor(card.tagColor) }"></span>
            {{ card.category }}
          </span>

          <!-- Title -->
          <h3 class="lu-card__title orbitron-font"><Icon :icon="card.icon" width="14" height="14" class="lu-card__title-icon" />{{ card.title }}</h3>

          <!-- Tags -->
          <div v-if="card.tag1 || card.tag2" class="lu-card__tags">
            <WildfireTag v-if="card.tag1" :color="card.tagColor" :text="card.tag1" class="small-tag" :icon="getTagIcon(card.tag1)" />
            <WildfireTag v-if="card.tag2" :color="card.tagColor" :text="card.tag2" class="small-tag" :icon="getTagIcon(card.tag2)" />
          </div>

          <!-- Footer -->
          <div class="lu-card__footer">
            <div class="lu-card__author">
              <div class="lu-card__avatar-ring" :style="{ '--ring': getHexColor(card.tagColor) }">
                <img :src="card.avatarUrl" class="lu-card__avatar" :alt="card.username" />
              </div>
              <div class="lu-card__author-info">
                <span class="lu-card__username orbitron-font"><span class="lu-at">@</span>{{ card.username }}</span>
                <span class="lu-card__date">
                  <Icon icon="mdi:clock-outline" width="10" height="10" style="opacity: 0.5;" />
                  {{ card.date }}
                </span>
              </div>
            </div>
            <span class="lu-card__arrow" :style="{ color: getHexColor(card.tagColor) }"><Icon icon="mdi:arrow-right" width="18" height="18" /></span>
          </div>
        </div>
      </a>
    </div>

    <!-- ── Footer CTA ── -->
    <div class="lu-footer">
      <a href="/updates_wiki/updateswiki" class="lu-view-all orbitron-font">
        <Icon icon="mdi:calendar-text" width="15" height="15" />
        <span>Vezi toate noutatile</span>
        <Icon icon="mdi:arrow-right" width="15" height="15" class="lu-arrow-icon" />
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
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
/* ── Root ── */
.last-updates {
  width: 100%;
}

/* ── Section Label (matches WikiHome wf-section-label) ── */
.lu-section-label {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  justify-content: center;
}
.lu-label__line {
  width: 32px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff7800);
  flex-shrink: 0;
}
.lu-label__line:last-child {
  background: linear-gradient(90deg, #ff7800, transparent);
}
.lu-label__text {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3.5px;
  color: #ff7800;
  text-transform: uppercase;
  white-space: nowrap;
}
.lu-label__icon {
  flex-shrink: 0;
}
.lu-live-pill {
  position: relative;
  width: 10px;
  height: 10px;
  flex-shrink: 0;
}
.lu-live-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(34,197,94,0.5);
  animation: luPulse 1.8s ease-out infinite;
}
.lu-live-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}
@keyframes luPulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}

.lu-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 700;
  margin: 0 0 10px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-1);
}
.lu-title__icon {
  flex-shrink: 0;
  color: #ff7800;
  opacity: 0.6;
}
.lu-title::after { display: none; }
.lu-accent {
  font-family: 'Orbitron', sans-serif !important;
  color: #ff7800;
}
.lu-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: center;
  margin: 0 0 36px;
  opacity: 0.7;
  letter-spacing: 0.3px;
}

/* ── Grid ── */
.lu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

/* ── Cards (matches WikiHome wf-card) ── */
.lu-card {
  position: relative;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  color: var(--vp-c-text-1);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s ease,
              border-color 0.3s ease;
}
.lu-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 120, 0, 0.25);
  box-shadow: 0 0 20px rgba(255, 120, 0, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
html:not(.dark) .lu-card {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(0, 0, 0, 0.08);
}
html:not(.dark) .lu-card:hover {
  border-color: rgba(255, 120, 0, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Accent strip */
.lu-card__strip {
  width: 3px;
  flex-shrink: 0;
  border-radius: 16px 0 0 16px;
  transition: width 0.3s ease;
}
.lu-card:hover .lu-card__strip {
  width: 5px;
}

/* Watermark */
.lu-card__watermark {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 38px;
  font-weight: 900;
  line-height: 1;
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
  letter-spacing: -2px;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 0;
  transition: opacity 0.3s ease;
}
.lu-card:hover .lu-card__watermark {
  opacity: 0.07;
}

/* Card body */
.lu-card__body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 18px 20px 14px;
}

/* Category badge */
.lu-card__cat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 7px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  flex-shrink: 0;
  width: fit-content;
  margin-bottom: 10px;
  transition: filter 0.2s;
}
.lu-card:hover .lu-card__cat {
  filter: brightness(1.15);
}
.lu-card__cat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Title */
.lu-card__title {
  font-family: 'Orbitron', sans-serif !important;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.lu-card__title-icon {
  flex-shrink: 0;
  opacity: 0.4;
  transition: opacity 0.2s, color 0.2s;
}
.lu-card:hover .lu-card__title-icon {
  opacity: 0.8;
  color: var(--accent, #ff7800);
}

/* Tags */
.lu-card__tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: auto;
  padding-bottom: 6px;
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
}
:deep(.wildfire-tag.small-tag svg) {
  width: 10px; height: 10px;
  stroke: currentColor;
}

/* Footer */
.lu-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  gap: 8px;
}
html:not(.dark) .lu-card__footer {
  border-top-color: rgba(0, 0, 0, 0.06);
}
.lu-card__author {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}
.lu-card__avatar-ring {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
  flex-shrink: 0;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.lu-card:hover .lu-card__avatar-ring {
  background: linear-gradient(135deg, var(--ring, #ff7800), rgba(255, 120, 0, 0.3));
  box-shadow: 0 0 10px color-mix(in srgb, var(--ring, #ff7800) 25%, transparent);
}
html:not(.dark) .lu-card__avatar-ring {
  background: linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03));
}
html:not(.dark) .lu-card:hover .lu-card__avatar-ring {
  background: linear-gradient(135deg, var(--ring, #ff7800), rgba(255, 120, 0, 0.3));
}
.lu-card__avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.lu-card__author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.lu-card__username {
  font-size: 10px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  line-height: 1.2;
}
.lu-at {
  color: #ff7800;
  opacity: 0.7;
  margin-right: 1px;
}
.lu-card__date {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  color: var(--vp-c-text-3, #64748b);
  white-space: nowrap;
  line-height: 1.2;
}
.lu-card__date svg { opacity: 0.5; flex-shrink: 0; }
.lu-card__arrow {
  font-size: 18px;
  color: rgba(255, 120, 0, 0.4);
  transition: transform 0.3s ease, color 0.3s ease;
  flex-shrink: 0;
  align-self: center;
}
.lu-card:hover .lu-card__arrow {
  transform: translateX(4px);
  color: #ff7800;
}

/* ── Skeleton ── */
@keyframes luShimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.lu-card--sk { min-height: 140px; pointer-events: none; }
.sk-strip {
  width: 3px;
  flex-shrink: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: luShimmer 1.6s infinite linear;
  border-radius: 16px 0 0 16px;
}
.sk-body { padding: 18px 20px 14px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.sk-footer { display: flex; align-items: center; gap: 8px; margin-top: auto; }
.sk {
  display: block;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 800px 100%;
  animation: luShimmer 1.6s infinite linear;
}
html:not(.dark) .sk {
  background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%);
  background-size: 800px 100%;
}
html:not(.dark) .sk-strip {
  background: linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%);
  background-size: 800px 100%;
}
.sk-pill { height: 18px; width: 70px; border-radius: 12px; }
.sk-title-line { height: 14px; width: 85%; border-radius: 3px; }
.sk-desc-line { height: 11px; width: 60%; border-radius: 3px; }
.sk-avatar { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; }
.sk-name { height: 10px; width: 80px; border-radius: 3px; }

/* ── Footer CTA (matches wf-btn--ghost) ── */
.lu-footer { text-align: center; margin-top: 8px; }
.lu-view-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.lu-view-all:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-2px);
}
html:not(.dark) .lu-view-all {
  color: rgba(0, 0, 0, 0.6);
  border-color: rgba(0, 0, 0, 0.1);
}
html:not(.dark) .lu-view-all:hover {
  border-color: rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.03);
}
.lu-arrow-icon { transition: transform 0.2s; }
.lu-view-all:hover .lu-arrow-icon { transform: translateX(4px); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .lu-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .lu-grid { grid-template-columns: 1fr; gap: 12px; }
  .lu-title { font-size: 22px; }
}
</style>