<template>
  <div class="last-updates">
    <div class="updates-header">
      <div class="title-group">
        <span class="section-overline">WIKI</span>
        <h2 class="section-title">Recently Updated</h2>
      </div>
      <span class="updates-badge" :class="{ skeleton: !mounted }">
        <svg v-if="mounted" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span>{{ mounted ? cards.length + '\u00a0activ' : '' }}</span>
      </span>
    </div>

    <!-- Skeleton state (before hydration) -->
    <div v-if="!mounted" class="updates-grid">
      <div v-for="n in 6" :key="'sk-' + n" class="update-card skeleton-card">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span class="skeleton skeleton-avatar"></span>
          <span class="skeleton skeleton-badge"></span>
        </div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line wide"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div style="display:flex;justify-content:space-between;margin-top:12px">
          <span class="skeleton skeleton-badge"></span>
          <span class="skeleton skeleton-badge" style="width:80px"></span>
        </div>
      </div>
    </div>

    <!-- Real cards -->
    <div v-else class="updates-grid">
      <div v-for="(card, index) in cards" :key="card.link" class="update-card" :style="cardGradient(card.tagColor, index + 1)">
        <div class="card-glow"></div>
        <div class="card-number" :style="{ color: getHexColor(card.tagColor) }">{{ String(index + 1).padStart(2, '0') }}</div>
        <div class="card-content">
          <span class="card-category-pill" :style="{ color: getHexColor(card.tagColor), background: getHexColor(card.tagColor) + '18', borderColor: getHexColor(card.tagColor) + '38' }">
            <span class="category-dot" :class="card.dotClass"></span>
            {{ card.category }}
          </span>
          <h3 class="card-title">{{ card.title }}</h3>
          <div v-if="card.tag1 || card.tag2" class="card-tags">
            <WildfireTag v-if="card.tag1" :color="card.tagColor" :text="card.tag1" class="small-tag" :icon="getTagIcon(card.tag1)" />
            <WildfireTag v-if="card.tag2" :color="card.tagColor" :text="card.tag2" class="small-tag" :icon="getTagIcon(card.tag2)" />
          </div>
          <div class="card-footer">
            <div class="card-meta-row">
              <img :src="card.avatarUrl" class="github-avatar" :alt="card.username">
              <a :href="card.profileUrl" target="_blank" class="author-name">{{ card.username }}</a>
              <span class="author-sep">·</span>
              <span class="meta-date">{{ card.date }}</span>
            </div>
            <a :href="card.link" class="card-button" :style="{ color: getHexColor(card.tagColor) }">
              <span>{{ card.buttonText }}</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="updates-footer">
      <a href="/updates_wiki/updateswiki" class="view-all-link">
        <span>Vezi toate noutățile</span>
        <span class="arrow">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
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
  return hexColors[color] || '#ff4500'
}

function getTagIcon(tag) {
  const tagLower = String(tag || '').toLowerCase()
  if (tagLower.includes('new') || tagLower.includes('nou')) {
    return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
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

function cardGradient(color, index) {
  const mainColor = getHexColor(color)
  if (isDark.value) {
    const positions = ['ellipse at 12% 45%', 'ellipse at 15% 70%', 'ellipse at 8% 25%', 'ellipse at 18% 60%', 'ellipse at 10% 35%', 'ellipse at 14% 80%']
    const pos = positions[(index - 1) % positions.length]
    return {
      background: `radial-gradient(${pos}, ${mainColor}32 0%, transparent 58%), #13171f`,
      border: `1px solid ${mainColor}28`,
      borderLeft: `4px solid ${mainColor}`,
      boxShadow: `0 4px 24px -6px ${mainColor}35`
    }
  } else {
    return {
      background: `linear-gradient(150deg, ${mainColor}0d 0%, #ffffff 48%)`,
      border: `1px solid ${mainColor}40`,
      borderLeft: `4px solid ${mainColor}`,
      boxShadow: `0 2px 16px -4px ${mainColor}38, 0 1px 3px rgba(0,0,0,0.05)`
    }
  }
}
</script>

<style scoped>
/* Aplică Orbitron doar pe titlu, butoane, tag-uri și categorii */
.card-title,
.card-button span,
.card-tags :deep(.wildfire-tag),
.category-name,
.view-all-link span,
.updates-badge {
  font-family: 'Orbitron', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  letter-spacing: 0.5px;
}

/* Ajustări individuale */
.card-title {
  font-weight: 800 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-button span {
  font-weight: 600 !important;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.card-tags :deep(.wildfire-tag) {
  font-weight: 500 !important;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.category-name {
  font-weight: 700 !important;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.view-all-link span {
  font-weight: 600 !important;
  letter-spacing: 0.5px;
}

.updates-badge {
  font-weight: 600 !important;
  letter-spacing: 0.5px;
}

/* ===== VARIABLES CSS - TEMA DARK (DEFAULT) ===== */
.last-updates {
  --bg-primary: #0a0a0a;
  --bg-secondary: #121212;
  --bg-card: rgba(10, 10, 10, 0.95);
  --text-primary: #ffffff;
  --text-secondary: #f0f0f0;
  --text-tertiary: #9ca3af;
  --border-light: rgba(255, 255, 255, 0.1);
  --border-medium: rgba(255, 255, 255, 0.2);
  --meta-bg: rgba(0, 0, 0, 0.2);
  --button-bg: rgba(0, 0, 0, 0.2);
  
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 24px;
  width: 100%;
  transition: all 0.3s ease;
}

/* ===== TEMA LIGHT - FUNDAL ALB PUR ===== */
html:not(.dark) .last-updates {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #1e293b;
  --text-tertiary: #64748b;
  --border-light: rgba(0, 0, 0, 0.08);
  --border-medium: rgba(0, 0, 0, 0.12);
  --meta-bg: rgba(0, 0, 0, 0.03);
  --button-bg: rgba(0, 0, 0, 0.03);
}

/* ===== PERFORMANCE ===== */
.last-updates,
.update-card,
.category-dot,
.card-button,
.view-all-link,
.wildfire-tag,
.github-avatar,
svg {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
}

/* ===== HEADER ===== */
.updates-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 69, 0, 0.12);
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-overline {
  font-family: 'Orbitron', sans-serif !important;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #ff4500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-overline::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, #ff4500, #ff8c00);
  border-radius: 1px;
}

.section-title {
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  line-height: 1.15;
  background: linear-gradient(135deg, var(--text-primary) 55%, #ff6030 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.updates-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 69, 0, 0.08);
  color: #ff8c00;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255, 69, 0, 0.2);
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* ===== GRID CARDURI ===== */
.updates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.update-card {
  position: relative;
  border-radius: 12px;
  padding: 20px 18px 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 176px;
  background: var(--bg-card);
}

.update-card:hover {
  transform: translateY(-3px);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

html:not(.dark) .card-glow {
  background: radial-gradient(circle at 50% 0%, rgba(255, 69, 0, 0.05), transparent 70%);
}

.update-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* ===== CARD NUMBER WATERMARK ===== */
.card-number {
  position: absolute;
  bottom: -4px;
  right: 14px;
  font-family: 'Orbitron', sans-serif;
  font-size: 58px;
  font-weight: 900;
  line-height: 1;
  opacity: 0.06;
  pointer-events: none;
  user-select: none;
  z-index: 1;
  letter-spacing: -2px;
  transition: opacity 0.3s;
}

.update-card:hover .card-number {
  opacity: 0.1;
}

/* ===== CATEGORY PILL ===== */
.card-category-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px 4px 8px;
  border-radius: 6px;
  border: 1px solid;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif !important;
  margin-bottom: 12px;
  align-self: flex-start;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
  transition: transform 0.2s;
}

.update-card:hover .category-dot {
  transform: scale(1.2);
}

/* ===== TITLU ===== */
.card-title {
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 14px 0;
  line-height: 1.35;
  color: var(--text-primary);
  flex: 1;
}

/* ===== FOOTER ===== */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
  gap: 6px;
}

.card-meta-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}

.author-name {
  color: var(--text-tertiary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
  font-family: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-name:hover {
  color: #ff4500;
}

.author-sep {
  color: var(--text-tertiary);
  opacity: 0.35;
  flex-shrink: 0;
}

.meta-date {
  color: var(--text-tertiary);
  font-family: inherit;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0.7;
}

.github-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 69, 0, 0.25);
  display: block;
  object-fit: cover;
  flex-shrink: 0;
  opacity: 0.8;
  transition: opacity 0.2s, border-color 0.2s;
}

.update-card:hover .github-avatar {
  opacity: 1;
}

.card-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

/* ===== TAGS ===== */
:deep(.wildfire-tag.small-tag) {
  padding: 3px 10px !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  gap: 4px !important;
  border-radius: 30px !important;
  border: 1px solid currentColor !important;
  background: transparent !important;
  transition: all 0.2s !important;
  display: inline-flex !important;
  align-items: center !important;
}

html:not(.dark) :deep(.wildfire-tag.small-tag) {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(4px);
}

:deep(.wildfire-tag.small-tag:hover) {
  transform: translateY(-2px) scale(1.02);
  filter: brightness(1.2);
  box-shadow: 0 4px 8px currentColor;
}

:deep(.wildfire-tag.small-tag svg) {
  width: 10px;
  height: 10px;
  stroke: currentColor;
  transition: transform 0.2s;
}

:deep(.wildfire-tag.small-tag:hover svg) {
  transform: rotate(5deg);
}

/* Culori tag-uri */
:deep(.wildfire-tag[color="blue"]) { color: #3b82f6; }
:deep(.wildfire-tag[color="orange"]) { color: #f97316; }
:deep(.wildfire-tag[color="teal"]) { color: #14b8a6; }
:deep(.wildfire-tag[color="amber"]) { color: #f59e0b; }
:deep(.wildfire-tag[color="purple"]) { color: #8b5cf6; }
:deep(.wildfire-tag[color="pink"]) { color: #ec4899; }
:deep(.wildfire-tag[color="red"]) { color: #ef4444; }
:deep(.wildfire-tag[color="green"]) { color: #10b981; }

/* ===== BUTON ===== */
.card-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif !important;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid currentColor;
  opacity: 0.65;
  transition: all 0.2s ease;
}

.card-button:hover {
  gap: 8px;
  opacity: 1;
  transform: translateY(-1px);
}

.card-button svg {
  transition: transform 0.2s;
}

.card-button:hover svg {
  transform: translateX(3px);
}

/* ===== FOOTER PRINCIPAL ===== */
.updates-footer {
  text-align: center;
  margin-top: 28px;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ff4500;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  padding: 9px 22px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid rgba(255, 69, 0, 0.3);
  transition: all 0.25s ease;
  box-shadow: none;
}

.view-all-link:hover {
  gap: 12px;
  background: rgba(255, 69, 0, 0.07);
  border-color: #ff4500;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(255, 69, 0, 0.12);
}

.arrow {
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s;
}

.arrow svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.view-all-link:hover .arrow {
  transform: translateX(4px);
}

/* ===== DOTS ===== */
.dot-blue { background: #3b82f6; }
.dot-orange { background: #f97316; }
.dot-amber { background: #f59e0b; }
.dot-teal { background: #14b8a6; }
.dot-purple { background: #8b5cf6; }
.dot-pink { background: #ec4899; }
.dot-red { background: #ef4444; }
.dot-green { background: #10b981; }

/* ===== MEDIA QUERIES ===== */
@media (max-width: 1024px) {
  .updates-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .last-updates {
    padding: 0 20px;
  }
  .section-title {
    font-size: 22px;
  }
  .updates-badge {
    padding: 3px 14px;
    font-size: 12px;
  }
}

@media (max-width: 640px) {
  .updates-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .update-card {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .last-updates {
    padding: 0 16px;
  }
  .section-title {
    font-size: 20px;
  }
  .card-title {
    font-size: 15px;
  }
  .card-meta-row {
    flex-wrap: wrap;
    gap: 4px;
  }
  .github-avatar {
    width: 18px;
    height: 18px;
  }
  .view-all-link {
    padding: 8px 22px;
    font-size: 13px;
  }
}
</style>