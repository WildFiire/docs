<template>
  <div class="last-updates">
    <div class="updates-header">
      <h2 class="section-title"><span>Recently Updated</span></h2>
      <span class="updates-badge">6 noi</span>
    </div>
    
    <div class="updates-grid">
      <!-- SLOT 1 -->
      <div v-if="card1.active" class="update-card" :style="cardGradient(card1.tagColor, 1)">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-category">
            <span class="category-dot" :class="card1.dotClass"></span>
            <span class="category-name" :style="{ color: getHexColor(card1.tagColor) }">{{ card1.category }}</span>
          </div>
          <h3 class="card-title">{{ card1.title }}</h3>
          <div class="card-meta">
            <span class="meta-date">
              <svg class="meta-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ card1.date }}
            </span>
            <div class="updated-by">
              <img :src="card1.avatarUrl" class="github-avatar" :alt="card1.username">
              <span>by <a :href="card1.profileUrl" target="_blank">{{ card1.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card1.tagColor" :text="card1.tag1" class="small-tag" :icon="getTagIcon(card1.tag1)" />
              <WildfireTag :color="card1.tagColor" :text="card1.tag2" class="small-tag" :icon="getTagIcon(card1.tag2)" />
            </div>
            <a :href="card1.link" class="card-button" :style="{ color: getHexColor(card1.tagColor) }">
              <span>{{ card1.buttonText }}</span>
              <span class="button-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- SLOT 2 -->
      <div v-if="card2.active" class="update-card" :style="cardGradient(card2.tagColor, 2)">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-category">
            <span class="category-dot" :class="card2.dotClass"></span>
            <span class="category-name" :style="{ color: getHexColor(card2.tagColor) }">{{ card2.category }}</span>
          </div>
          <h3 class="card-title">{{ card2.title }}</h3>
          <div class="card-meta">
            <span class="meta-date">
              <svg class="meta-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ card2.date }}
            </span>
            <div class="updated-by">
              <img :src="card2.avatarUrl" class="github-avatar" :alt="card2.username">
              <span>by <a :href="card2.profileUrl" target="_blank">{{ card2.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card2.tagColor" :text="card2.tag1" class="small-tag" :icon="getTagIcon(card2.tag1)" />
              <WildfireTag :color="card2.tagColor" :text="card2.tag2" class="small-tag" :icon="getTagIcon(card2.tag2)" />
            </div>
            <a :href="card2.link" class="card-button" :style="{ color: getHexColor(card2.tagColor) }">
              <span>{{ card2.buttonText }}</span>
              <span class="button-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- SLOT 3 -->
      <div v-if="card3.active" class="update-card" :style="cardGradient(card3.tagColor, 3)">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-category">
            <span class="category-dot" :class="card3.dotClass"></span>
            <span class="category-name" :style="{ color: getHexColor(card3.tagColor) }">{{ card3.category }}</span>
          </div>
          <h3 class="card-title">{{ card3.title }}</h3>
          <div class="card-meta">
            <span class="meta-date">
              <svg class="meta-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ card3.date }}
            </span>
            <div class="updated-by">
              <img :src="card3.avatarUrl" class="github-avatar" :alt="card3.username">
              <span>by <a :href="card3.profileUrl" target="_blank">{{ card3.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card3.tagColor" :text="card3.tag1" class="small-tag" :icon="getTagIcon(card3.tag1)" />
              <WildfireTag :color="card3.tagColor" :text="card3.tag2" class="small-tag" :icon="getTagIcon(card3.tag2)" />
            </div>
            <a :href="card3.link" class="card-button" :style="{ color: getHexColor(card3.tagColor) }">
              <span>{{ card3.buttonText }}</span>
              <span class="button-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- SLOT 4 -->
      <div v-if="card4.active" class="update-card" :style="cardGradient(card4.tagColor, 4)">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-category">
            <span class="category-dot" :class="card4.dotClass"></span>
            <span class="category-name" :style="{ color: getHexColor(card4.tagColor) }">{{ card4.category }}</span>
          </div>
          <h3 class="card-title">{{ card4.title }}</h3>
          <div class="card-meta">
            <span class="meta-date">
              <svg class="meta-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ card4.date }}
            </span>
            <div class="updated-by">
              <img :src="card4.avatarUrl" class="github-avatar" :alt="card4.username">
              <span>by <a :href="card4.profileUrl" target="_blank">{{ card4.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card4.tagColor" :text="card4.tag1" class="small-tag" :icon="getTagIcon(card4.tag1)" />
              <WildfireTag :color="card4.tagColor" :text="card4.tag2" class="small-tag" :icon="getTagIcon(card4.tag2)" />
            </div>
            <a :href="card4.link" class="card-button" :style="{ color: getHexColor(card4.tagColor) }">
              <span>{{ card4.buttonText }}</span>
              <span class="button-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- SLOT 5 -->
      <div v-if="card5.active" class="update-card" :style="cardGradient(card5.tagColor, 5)">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-category">
            <span class="category-dot" :class="card5.dotClass"></span>
            <span class="category-name" :style="{ color: getHexColor(card5.tagColor) }">{{ card5.category }}</span>
          </div>
          <h3 class="card-title">{{ card5.title }}</h3>
          <div class="card-meta">
            <span class="meta-date">
              <svg class="meta-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ card5.date }}
            </span>
            <div class="updated-by">
              <img :src="card5.avatarUrl" class="github-avatar" :alt="card5.username">
              <span>by <a :href="card5.profileUrl" target="_blank">{{ card5.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card5.tagColor" :text="card5.tag1" class="small-tag" :icon="getTagIcon(card5.tag1)" />
              <WildfireTag :color="card5.tagColor" :text="card5.tag2" class="small-tag" :icon="getTagIcon(card5.tag2)" />
            </div>
            <a :href="card5.link" class="card-button" :style="{ color: getHexColor(card5.tagColor) }">
              <span>{{ card5.buttonText }}</span>
              <span class="button-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- SLOT 6 -->
      <div v-if="card6.active" class="update-card" :style="cardGradient(card6.tagColor, 6)">
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="card-category">
            <span class="category-dot" :class="card6.dotClass"></span>
            <span class="category-name" :style="{ color: getHexColor(card6.tagColor) }">{{ card6.category }}</span>
          </div>
          <h3 class="card-title">{{ card6.title }}</h3>
          <div class="card-meta">
            <span class="meta-date">
              <svg class="meta-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ card6.date }}
            </span>
            <div class="updated-by">
              <img :src="card6.avatarUrl" class="github-avatar" :alt="card6.username">
              <span>by <a :href="card6.profileUrl" target="_blank">{{ card6.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card6.tagColor" :text="card6.tag1" class="small-tag" :icon="getTagIcon(card6.tag1)" />
              <WildfireTag :color="card6.tagColor" :text="card6.tag2" class="small-tag" :icon="getTagIcon(card6.tag2)" />
            </div>
            <a :href="card6.link" class="card-button" :style="{ color: getHexColor(card6.tagColor) }">
              <span>{{ card6.buttonText }}</span>
              <span class="button-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WildfireTag from './WildfireTag.vue'

// Reactive theme state
const isDark = ref(true) // default dark

// Check theme on mount and listen for changes
onMounted(() => {
  // Initial check
  isDark.value = document.documentElement.classList.contains('dark')
  
  // Create observer to watch for class changes on html element
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        isDark.value = document.documentElement.classList.contains('dark')
      }
    })
  })
  
  observer.observe(document.documentElement, { attributes: true })
  
  // Cleanup
  onUnmounted(() => observer.disconnect())
})

const card1 = ref({
  active: true,
  dotClass: 'dot-red',
  category: 'PANEL',
  title: 'DASHBOARD',
  date: '09.03.2026',
  username: 'ianncxd',
  avatarUrl: 'https://github.com/ianncxd.png',
  profileUrl: 'https://github.com/ianncxd',
  tagColor: 'red',
  tag1: 'API',
  tag2: 'STATS',
  link: '/panel/panel',
  buttonText: 'ACUM'
})
const card2 = ref({
  active: true,
  dotClass: 'dot-purple',
  category: 'INFORMATII',
  title: 'REGULAMENT GO',
  date: '09.03.2026',
  username: 'ianncxd',
  avatarUrl: 'https://github.com/ianncxd.png',
  profileUrl: 'https://github.com/ianncxd',
  tagColor: 'purple',
  tag1: 'RULES',
  tag2: 'INFO',
  link: '/informatii/regulamente/go/regulament-go',
  buttonText: 'CITESTE'
})
const card3 = ref({
  active: true,
  dotClass: 'dot-red',
  category: 'INFORMATII',
  title: 'REGULAMENT GO-VIP',
  date: '09.03.2026',
  username: 'ianncxd',
  avatarUrl: 'https://github.com/ianncxd.png',
  profileUrl: 'https://github.com/ianncxd',
  tagColor: 'red',
  tag1: 'RULES',
  tag2: 'VIP',
  link: '/informatii/regulamente/go/regulament-vip-go',
  buttonText: 'CITESTE'
})
const card4 = ref({
  active: true,
  dotClass: 'dot-green',
  category: 'INFORMATII',
  title: 'REGULAMENT GO STAFF',
  date: '09.03.2026',
  username: 'ianncxd',
  avatarUrl: 'https://github.com/ianncxd.png',
  profileUrl: 'https://github.com/ianncxd',
  tagColor: 'green',
  tag1: 'RULES',
  tag2: 'STAFF',
  link: '/informatii/regulamente/go/regulament-staff-go',
  buttonText: 'CITESTE'
})
const card5 = ref({
  active: true,
  dotClass: 'dot-purple',
  category: 'ORGANIZATION',
  title: 'TEAM',
  date: '16.03.2026',
  username: 'ianncxd',
  avatarUrl: 'https://github.com/ianncxd.png',
  profileUrl: 'https://github.com/ianncxd',
  tagColor: 'purple',
  tag1: 'CHART',
  tag2: 'TEAM',
  link: '/team',
  buttonText: 'CITESTE'
})
const card6 = ref({
  active: true,
  dotClass: 'dot-pink',
  category: 'INFORMATII',
  title: 'Frequently Asked Questions',
  date: '09.03.2026',
  username: 'ianncxd',
  avatarUrl: 'https://github.com/ianncxd.png',
  profileUrl: 'https://github.com/ianncxd',
  tagColor: 'pink',
  tag1: 'INFO',
  tag2: 'FAQ',
  link: '/informatii/regulamente/go/regulament-go',
  buttonText: 'CITESTE'
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
  
  // Default - dot
  return '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="6"/></svg>'
}

function cardGradient(color, index) {
  const mainColor = getHexColor(color)
  
  // Folosim valoarea reactivă isDark
  if (isDark.value) {
    // DARK MODE - fundal închis cu gradient
    const darkBase = '#0a0a0a'
    const positions = [
      'circle at 20% 30%',
      'circle at 80% 20%',
      'circle at 40% 70%',
      'circle at 70% 60%',
      'circle at 30% 80%',
      'circle at 60% 40%'
    ]
    const pos = positions[(index - 1) % positions.length]
    
    return {
      background: `radial-gradient(${pos}, ${mainColor}20, transparent 70%),
                   linear-gradient(145deg, ${darkBase}, #121212)`,
      border: `1px solid ${mainColor}30`,
      boxShadow: `0 4px 12px -4px ${mainColor}30`
    }
  } else {
    // LIGHT MODE - FUNDAL ALB PUR
    return {
      background: '#ffffff',
      border: `1px solid ${mainColor}40`,
      boxShadow: `0 4px 12px -4px ${mainColor}40, 0 1px 3px rgba(0,0,0,0.05)`
    }
  }
}

const activeCards = computed(() => {
  let count = 0
  if (card1.value.active) count++
  if (card2.value.active) count++
  if (card3.value.active) count++
  if (card4.value.active) count++
  if (card5.value.active) count++
  if (card6.value.active) count++
  return count
})
</script>

<style scoped>
/* ===== FONT ORBITRON DOAR PENTRU COMPONENTE SPECIFICE ===== */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.section-title span {
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.updates-badge {
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  color: white;
  padding: 4px 16px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 69, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 160px;
  background: var(--bg-card);
}

.update-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(255, 69, 0, 0.3);
}

html:not(.dark) .update-card:hover {
  box-shadow: 0 12px 24px -8px rgba(255, 69, 0, 0.2);
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
}

/* ===== CATEGORIE ===== */
.card-category {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
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

.category-name {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== TITLU ===== */
.card-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.3;
  color: var(--text-primary);
}

/* ===== META ===== */
.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-light);
  font-size: 11px;
}

.meta-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-tertiary);
  background: var(--meta-bg);
  padding: 4px 10px;
  border-radius: 30px;
  font-family: inherit; /* Păstrează fontul default */
}

.meta-icon {
  stroke: currentColor;
  opacity: 0.8;
}

.updated-by {
  display: flex;
  align-items: center;
  gap: 6px;
}

.updated-by span {
  color: var(--text-tertiary);
  font-family: inherit; /* Păstrează fontul default */
}

.updated-by a {
  color: #ff4500;
  font-weight: 600;
  text-decoration: none;
  margin-left: 2px;
  transition: all 0.2s;
  font-family: inherit; /* Păstrează fontul default */
}

.updated-by a:hover {
  text-decoration: underline;
  filter: brightness(1.2);
}

.github-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #ff4500;
  display: block;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.update-card:hover .github-avatar {
  transform: scale(1.1);
}

/* ===== FOOTER ===== */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: 8px;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
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
  gap: 4px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 30px;
  background: var(--button-bg);
  transition: all 0.2s;
  border: 1px solid var(--border-light);
  white-space: nowrap;
  flex-shrink: 0;
}

.card-button:hover {
  gap: 8px;
  border-color: currentColor;
}

html:not(.dark) .card-button:hover {
  background: #ffffff;
}

.button-arrow {
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s;
}

.button-arrow svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}

.card-button:hover .button-arrow {
  transform: translateX(4px);
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
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 28px;
  border-radius: 30px;
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(255, 69, 0, 0.25);
}

.view-all-link:hover {
  gap: 12px;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 69, 0, 0.35);
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
  .card-meta {
    flex-wrap: wrap;
    gap: 8px;
  }
  .github-avatar {
    width: 20px;
    height: 20px;
  }
  .view-all-link {
    padding: 8px 22px;
    font-size: 13px;
  }
}
</style>