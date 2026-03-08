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
            <span class="meta-date">📅 {{ card1.date }}</span>
            <div class="updated-by">
              <img :src="card1.avatarUrl" class="github-avatar" :alt="card1.username">
              <span>by <a :href="card1.profileUrl" target="_blank">{{ card1.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card1.tagColor" :text="card1.tag1" class="small-tag" />
              <WildfireTag :color="card1.tagColor" :text="card1.tag2" class="small-tag" />
            </div>
            <a :href="card1.link" class="card-button" :style="{ color: getHexColor(card1.tagColor) }">
              <span>{{ card1.buttonText }}</span>
              <span class="button-arrow">→</span>
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
            <span class="meta-date">📅 {{ card2.date }}</span>
            <div class="updated-by">
              <img :src="card2.avatarUrl" class="github-avatar" :alt="card2.username">
              <span>by <a :href="card2.profileUrl" target="_blank">{{ card2.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card2.tagColor" :text="card2.tag1" class="small-tag" />
              <WildfireTag :color="card2.tagColor" :text="card2.tag2" class="small-tag" />
            </div>
            <a :href="card2.link" class="card-button" :style="{ color: getHexColor(card2.tagColor) }">
              <span>{{ card2.buttonText }}</span>
              <span class="button-arrow">→</span>
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
            <span class="meta-date">📅 {{ card3.date }}</span>
            <div class="updated-by">
              <img :src="card3.avatarUrl" class="github-avatar" :alt="card3.username">
              <span>by <a :href="card3.profileUrl" target="_blank">{{ card3.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card3.tagColor" :text="card3.tag1" class="small-tag" />
              <WildfireTag :color="card3.tagColor" :text="card3.tag2" class="small-tag" />
            </div>
            <a :href="card3.link" class="card-button" :style="{ color: getHexColor(card3.tagColor) }">
              <span>{{ card3.buttonText }}</span>
              <span class="button-arrow">→</span>
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
            <span class="meta-date">📅 {{ card4.date }}</span>
            <div class="updated-by">
              <img :src="card4.avatarUrl" class="github-avatar" :alt="card4.username">
              <span>by <a :href="card4.profileUrl" target="_blank">{{ card4.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card4.tagColor" :text="card4.tag1" class="small-tag" />
              <WildfireTag :color="card4.tagColor" :text="card4.tag2" class="small-tag" />
            </div>
            <a :href="card4.link" class="card-button" :style="{ color: getHexColor(card4.tagColor) }">
              <span>{{ card4.buttonText }}</span>
              <span class="button-arrow">→</span>
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
            <span class="meta-date">📅 {{ card5.date }}</span>
            <div class="updated-by">
              <img :src="card5.avatarUrl" class="github-avatar" :alt="card5.username">
              <span>by <a :href="card5.profileUrl" target="_blank">{{ card5.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card5.tagColor" :text="card5.tag1" class="small-tag" />
              <WildfireTag :color="card5.tagColor" :text="card5.tag2" class="small-tag" />
            </div>
            <a :href="card5.link" class="card-button" :style="{ color: getHexColor(card5.tagColor) }">
              <span>{{ card5.buttonText }}</span>
              <span class="button-arrow">→</span>
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
            <span class="meta-date">📅 {{ card6.date }}</span>
            <div class="updated-by">
              <img :src="card6.avatarUrl" class="github-avatar" :alt="card6.username">
              <span>by <a :href="card6.profileUrl" target="_blank">{{ card6.username }}</a></span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-tags">
              <WildfireTag :color="card6.tagColor" :text="card6.tag1" class="small-tag" />
              <WildfireTag :color="card6.tagColor" :text="card6.tag2" class="small-tag" />
            </div>
            <a :href="card6.link" class="card-button" :style="{ color: getHexColor(card6.tagColor) }">
              <span>{{ card6.buttonText }}</span>
              <span class="button-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="updates-footer">
      <a href="/informatii/about" class="view-all-link">
        <span>Vezi toate noutățile</span>
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WildfireTag from './WildfireTag.vue'

const card1 = ref({
  active: true,
  dotClass: 'dot-orange',
  category: 'panel',
  title: 'DASHBOARD',
  date: '06.03.2026',
  username: 'WildFiire',
  avatarUrl: 'https://github.com/WildFiire.png',
  profileUrl: 'https://github.com/WildFiire',
  tagColor: 'orange',
  tag1: 'NEW',
  tag2: 'PANEL',
  link: '/panel/panel',
  buttonText: 'ACUM'
})
const card2 = ref({
  active: true,
  dotClass: 'dot-purple',
  category: 'CHANGELOGS',
  title: 'UPDATES',
  date: '06.03.2026',
  username: 'WildFiire',
  avatarUrl: 'https://github.com/WildFiire.png',
  profileUrl: 'https://github.com/WildFiire',
  tagColor: 'purple',
  tag1: 'NEW',
  tag2: 'CHANGES',
  link: '/updates_wiki/updateswiki',
  buttonText: 'CITESTE'
})
const card3 = ref({
  active: true,
  dotClass: 'dot-blue',
  category: 'INFORMATIONS',
  title: 'REGULAMENT JUCATORI ',
  date: '08.03.2026',
  username: 'WildFiire',
  avatarUrl: 'https://github.com/WildFiire.png',
  profileUrl: 'https://github.com/WildFiire',
  tagColor: 'blue',
  tag1: 'GO',
  tag2: 'RULES',
  link: '/informatii/regulamente/go/regulament-go',
  buttonText: 'CITESTE'
})
const card4 = ref({
  active: true,
  dotClass: 'dot-teal',
  category: 'INFORMATIONS',
  title: 'REGULAMENT STAFF',
  date: '08.03.2026',
  username: 'WildFiire',
  avatarUrl: 'https://github.com/WildFiire.png',
  profileUrl: 'https://github.com/WildFiire',
  tagColor: 'teal',
  tag1: 'GO',
  tag2: 'RULES',
  link: '/informatii/regulamente/go/regulament-staff-go',
  buttonText: 'CITESTE'
})
const card5 = ref({
  active: true,
  dotClass: 'dot-red',
  category: 'INFORMATIONS',
  title: 'REGULAMENT VIP',
  date: '08.03.2026',
  username: 'WildFiire',
  avatarUrl: 'https://github.com/WildFiire.png',
  profileUrl: 'https://github.com/WildFiire',
  tagColor: 'red',
  tag1: 'GO',
  tag2: 'RULES',
  link: '/informatii/regulamente/go/regulament-vip-go',
  buttonText: 'CITESTE'
})
const card6 = ref({
  active: true,
  dotClass: 'dot-pink',
  category: 'INFORMATIONS',
  title: 'ABOUT US',
  date: '08.03.2026',
  username: 'WildFiire',
  avatarUrl: 'https://github.com/WildFiire.png',
  profileUrl: 'https://github.com/WildFiire',
  tagColor: 'pink',
  tag1: 'GO',
  tag2: 'RULES',
  link: '/informatii/about',
  buttonText: 'CITESTE'
})

const hexColors = {
  blue: '#3b82f6', orange: '#f97316', teal: '#14b8a6', amber: '#f59e0b',
  purple: '#8b5cf6', pink: '#ec4899', red: '#ef4444', green: '#10b981'
}

function getHexColor(color) {
  return hexColors[color] || '#ff4500'
}

function cardGradient(color, index) {
  const mainColor = getHexColor(color)
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
    border: 'none',
    boxShadow: `0 4px 12px -4px ${mainColor}30`
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
.last-updates,
.update-card,
.category-dot,
.card-button,
.view-all-link,
.wildfire-tag,
.github-avatar {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.last-updates {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 24px;
  width: 100%;
}

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
  color: #111827;
}

.dark .section-title {
  color: #ffffff;
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
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 160px;
}

.update-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -8px currentColor;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.05), transparent 70%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.update-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
}

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
}

.category-name {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.3;
  color: #ffffff;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  font-size: 11px;
}

.meta-date {
  color: #9ca3af;
  background: rgba(0,0,0,0.2);
  padding: 4px 10px;
  border-radius: 30px;
}

.updated-by {
  display: flex;
  align-items: center;
  gap: 6px;
}

.updated-by span {
  color: #9ca3af;
}

.updated-by a {
  color: #ff4500;
  font-weight: 600;
  text-decoration: none;
  margin-left: 2px;
}

.updated-by a:hover {
  text-decoration: underline;
}

.github-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #ff4500;
  display: block;
  object-fit: cover;
  flex-shrink: 0;
}

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

:deep(.wildfire-tag.small-tag) {
  padding: 3px 10px !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  gap: 4px !important;
  border-radius: 30px !important;
  border: 1px solid currentColor !important;
  background: transparent !important;
}

:deep(.wildfire-tag.small-tag .tag-dot) {
  width: 6px !important;
  height: 6px !important;
}

:deep(.wildfire-tag[color="blue"]) { color: #3b82f6; }
:deep(.wildfire-tag[color="orange"]) { color: #f97316; }
:deep(.wildfire-tag[color="teal"]) { color: #14b8a6; }
:deep(.wildfire-tag[color="amber"]) { color: #f59e0b; }
:deep(.wildfire-tag[color="purple"]) { color: #8b5cf6; }
:deep(.wildfire-tag[color="pink"]) { color: #ec4899; }
:deep(.wildfire-tag[color="red"]) { color: #ef4444; }
:deep(.wildfire-tag[color="green"]) { color: #10b981; }

.card-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 30px;
  background: rgba(0,0,0,0.2);
  transition: all 0.2s;
  border: 1px solid rgba(255,255,255,0.1);
  white-space: nowrap;
  flex-shrink: 0;
}

.card-button:hover {
  gap: 6px;
  background: rgba(0,0,0,0.3);
}

.button-arrow {
  font-size: 12px;
  transition: transform 0.2s;
}

.card-button:hover .button-arrow {
  transform: translateX(3px);
}

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
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(255, 69, 0, 0.25);
}

.view-all-link:hover {
  gap: 12px;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 69, 0, 0.35);
}

.arrow {
  font-size: 16px;
  transition: transform 0.2s;
}

.view-all-link:hover .arrow {
  transform: translateX(4px);
}

.dot-blue { background: #3b82f6; }
.dot-orange { background: #f97316; }
.dot-amber { background: #f59e0b; }
.dot-teal { background: #14b8a6; }
.dot-purple { background: #8b5cf6; }
.dot-pink { background: #ec4899; }
.dot-red { background: #ef4444; }
.dot-green { background: #10b981; }

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