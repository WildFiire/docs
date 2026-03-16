<template>
  <div class="org-page" :class="{ 'light-theme': isLightTheme }">
    <!-- HomeNavbar Component - SUS FIX -->
    <HomeNavbar />

    <!-- Restul conținutului cu padding-top pentru navbar -->
    <div class="content-wrapper">
      <!-- Back button în colțul stânga sus (dar sub navbar) -->
      <button class="back-button-fixed" @click="goBack" title="Go back">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Background wallpaper (stratul cel mai de jos) -->
      <img 
        src="/wallpaper/poza102.webp"
        alt=""
        class="wildfire-wallpaper-base"
        :class="{ 
          'wildfire-wallpaper-hover': isHovered 
        }"
        width="1920"
        height="1080"
        fetchpriority="high"
        loading="eager"
        decoding="async"
        role="presentation"
      />
      
      <!-- Background overlay pentru a face textul lizibil -->
      <div class="wildfire-overlay"></div>

      <!-- Background cu licurici vizibili (light theme) -->
      <div class="bg-effects" v-if="isLightTheme">
        <div class="bg-orb top-orb"></div>
        <div class="bg-orb bottom-orb"></div>
        <div class="firefly" v-for="n in 25" :key="n" :style="fireflyStyle(n)"></div>
        <div class="bg-grid"></div>
      </div>

      <!-- Dark theme background custom - WILDFIRE STYLE -->
      <!-- Dark theme background custom - WILDFIRE STYLE -->
      <div class="wildfire-bg" v-if="!isLightTheme">
        <div class="wildfire-base"></div>
        <div class="wildfire-ember-left"></div>
        <div class="wildfire-ember-right"></div>
        <div class="wildfire-ember-bottom"></div>
        <div class="wildfire-ember-top"></div>
        <div class="wildfire-energy-line-1"></div>
        <div class="wildfire-energy-line-2"></div>
        <div class="wildfire-energy-line-3"></div>
        <div class="wildfire-particles"></div>
        <div class="wildfire-floating-particles">
          <div class="wildfire-particle wildfire-particle-1"></div>
          <div class="wildfire-particle wildfire-particle-2"></div>
          <div class="wildfire-particle wildfire-particle-3"></div>
          <div class="wildfire-particle wildfire-particle-4"></div>
          <div class="wildfire-particle wildfire-particle-5"></div>
          <div class="wildfire-particle wildfire-particle-6"></div>
          <div class="wildfire-particle wildfire-particle-7"></div>
          <div class="wildfire-particle wildfire-particle-8"></div>
        </div>
        <div class="wildfire-spotlight-br"></div>
      </div>

      <!-- Toast notification -->
      <transition name="toast" @after-leave="clearToast">
        <div v-if="toast.show" class="toast-notification" :class="[toast.type, { 'has-icon': toast.icon }]">
          <div class="toast-glass"></div>
          <div class="toast-content">
            <div class="toast-icon-wrapper" v-if="toast.icon">
              <img :src="toast.icon" class="toast-icon" alt="">
            </div>
            <div class="toast-icon-wrapper" v-else-if="toast.type === 'success'">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" fill="#2ecc71" fill-opacity="0.2"/>
                <path d="M6 10L9 13L14 7" stroke="#2ecc71" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="toast-icon-wrapper" v-else-if="toast.type === 'error'">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" fill="#e74c3c" fill-opacity="0.2"/>
                <path d="M7 7L13 13M13 7L7 13" stroke="#e74c3c" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="toast-message-wrapper">
              <span class="toast-title">{{ toast.title || (toast.type === 'success' ? 'Success!' : 'Error!') }}</span>
              <span class="toast-message">{{ toast.message }}</span>
            </div>
          </div>
          <div class="toast-progress" :style="{ animationDuration: toast.duration + 'ms' }"></div>
          <button class="toast-close" @click="closeToast">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </transition>

      <!-- Org Chart -->
      <div class="chart">
        <div v-if="loading" class="loading-state">Loading staff data...</div>
        
        <template v-for="(level, li) in hierarchy" :key="li">
          <!-- Vertical connector between levels -->
          <div v-if="li > 0" class="connector-v">
            <div class="cv-line"></div>
          </div>

          <!-- Level row -->
          <div class="level-row" :class="['level-' + li, { child: li > 0 }]">
            <div v-for="m in level" :key="m.id" class="node">
              <!-- Vertical drop from horizontal branch -->
              <div v-if="li > 0" class="drop-line"></div>
              
              <!-- Card cu efect 3D la mouse -->
              <div class="card" :class="[m.cls, m.roleClass]" :data-role="m.roleClass">
                <!-- Avatar section -->
                <div class="avatar-wrapper">
                  <div class="avatar-circle" :class="'circle-' + m.roleClass">
                    <img
                      v-if="memberData[m.id]"
                      :src="memberData[m.id]"
                      :alt="m.name"
                      class="avatar-img"
                      @error="handleAvatarError(m)"
                    />
                    <div v-else class="avatar-init" :style="{ backgroundColor: m.color }">
                      {{ m.init }}
                    </div>
                  </div>
                  
                  <!-- Crown SVG -->
                  <div v-if="m.crown" class="crown-svg">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L12.5 8L19 9L14 14L16 20L10 16.5L4 20L6 14L1 9L7.5 8L10 2Z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
                    </svg>
                  </div>
                  
                  <!-- Copy name button -->
                  <button class="copy-name-btn" @click="copyName(m.name)" :title="'Copy ' + m.name">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 1H3C2.4 1 2 1.4 2 2V9H3V2H9V1ZM11 3H5C4.4 3 4 3.4 4 4V12C4 12.6 4.4 13 5 13H11C11.6 13 12 12.6 12 12V4C12 3.4 11.6 3 11 3ZM11 12H5V4H11V12Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>

                <!-- Member info with custom tag -->
                <div class="member-info">
                  <span class="member-name">{{ m.display }}</span>
                  <div class="member-tag-wrapper">
                    <div class="member-tag">
                      <span class="role-dot" :style="{ backgroundColor: m.color }"></span>
                      
                      <!-- Icon sau emoji în stânga -->
                      <span class="role-icon-wrapper" v-if="m.icon">
                        <img :src="m.icon" class="role-custom-icon" alt="icon">
                      </span>
                      <span class="role-emoji" v-else-if="m.emoji">{{ m.emoji }}</span>
                      
                      <span class="role-separator">»</span>
                      <span class="tag-text">{{ m.fullRole }}</span>
                      
                      <!-- Tag icon în dreapta (opțional) -->
                      <img v-if="m.tagIcon" :src="m.tagIcon" class="tag-icon" alt="icon">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, onBeforeUnmount, computed } from 'vue'
import { useData } from 'vitepress'
import HomeNavbar from './HomeNavbar.vue'

const { isDark } = useData()
const isLightTheme = computed(() => !isDark.value)

const hierarchy = [
  // Level 0 — Founder
  [
    { 
      id: 'trapi', 
      name: 'trapi', 
      display: 'Trapi', 
      fullRole: 'Fondator',
      icon: '/icons/wildfire.webp',
      discordId: '250205071478882306', 
      color: '#7a3c3c', 
      roleClass: 'founder',
      cls: 'is-founder', 
      init: 'T', 
      crown: true,
    }
  ],
  // Level 1 — Community Managers
  [
    { 
      id: 'iannc', 
      name: 'iannc', 
      display: 'iannC', 
      fullRole: 'Community Manager',
      emoji: '👑',
      discordId: '371621920162185216', 
      color: '#a60303', 
      roleClass: 'cm',
      cls: '', 
      init: 'I', 
      crown: false
    },
    { 
      id: 'spark', 
      name: 'sparkgames.live', 
      display: 'Spark', 
      fullRole: 'Community Manager',
      emoji: '👑',
      discordId: '365389938964955136', 
      color: '#a60303', 
      roleClass: 'cm',
      cls: '', 
      init: 'S', 
      crown: false,
    }
  ],
  // Level 2 — Server Managers
  [
    { 
      id: 'zlk', 
      name: 'w_zlk_w', 
      display: 'ZLK', 
      fullRole: 'Server Manager',
      emoji: '💜',
      discordId: '640259673630572582', 
      color: '#9b59b6', 
      roleClass: 'sm',
      cls: '', 
      init: 'Z', 
      crown: false,
    },
    { 
      id: 'umpy', 
      name: '.umpy', 
      display: 'Umpy', 
      fullRole: 'Server Manager',
      emoji: '💜',
      discordId: '650621084223275010', 
      color: '#9b59b6', 
      roleClass: 'sm',
      cls: '', 
      init: 'U', 
      crown: false
    }
  ],
  // Level 3 — Administrators
  [
    { 
      id: 'dennis', 
      name: 'dennis078734', 
      display: 'DeNNis', 
      fullRole: 'Administrator GO',
      emoji: '🌀',
      discordId: '890111409327849513', 
      color: '#4a9eff', 
      roleClass: 'admin',
      cls: '', 
      init: 'D', 
      crown: false,
    },
    { 
      id: 'booyeto', 
      name: 'booyeto', 
      display: 'Booyeto', 
      fullRole: 'Administrator GO',
      emoji: '🌀',
      discordId: '954100793085132830', 
      color: '#4a9eff', 
      roleClass: 'admin',
      cls: '', 
      init: 'B', 
      crown: false
    }
  ],
  // Level 4 — Moderators
  [
    { 
      id: 'codrin', 
      name: 'codriin', 
      display: 'Codrin', 
      fullRole: 'Moderator GO',
      emoji: '🔱',
      discordId: '998255640256446516', 
      color: '#f1c40f', 
      roleClass: 'mod',
      cls: '', 
      init: 'C', 
      crown: false,
    },
    { 
      id: 'juanito', 
      name: 'dibu37', 
      display: 'Juanito', 
      fullRole: 'Moderator GO',
      emoji: '🔱',
      discordId: '768198072206491690', 
      color: '#f1c40f', 
      roleClass: 'mod',
      cls: '', 
      init: 'J', 
      crown: false,
    },
    { 
      id: 'lequipe', 
      name: 'rc498', 
      display: 'lequipe', 
      fullRole: 'Moderator GO',
      emoji: '🔱',
      discordId: '950483022166241281', 
      color: '#f1c40f', 
      roleClass: 'mod',
      cls: '', 
      init: 'L', 
      crown: false
    }
  ],
  // Level 5 — Helpers
  [
    { 
      id: 'bigolas', 
      name: '_.nicolqs._', 
      display: 'BIGOLAS', 
      fullRole: 'Helper GO',
      emoji: '🔰',
      discordId: '1322287980420923494', 
      color: '#2ecc71', 
      roleClass: 'helper',
      cls: '', 
      init: 'B', 
      crown: false,
    },
    { 
      id: 'denisa', 
      name: '.denisuka', 
      display: 'Denisa', 
      fullRole: 'Helper',
      emoji: '🔰',
      discordId: '789488474805633084', 
      color: '#2ecc71', 
      roleClass: 'helper',
      cls: '', 
      init: 'D', 
      crown: false,
    }
  ]
]

// State
const memberData = reactive({})
const loading = ref(true)
const failedIds = reactive({})
const mousePosition = ref({ x: 0, y: 0 })
const isHovered = ref(false)

// Toast notification state
const toast = ref({
  show: false,
  message: '',
  title: '',
  type: 'success',
  duration: 4000,
  icon: null
})

let toastTimeout = null

// Audio object for sound
const audio = new Audio('/sounds/sunet.mp3')

// Copy name function with notification and sound
function copyName(name) {
  navigator.clipboard.writeText(name).then(() => {
    audio.play().catch(e => console.log('Audio play failed:', e))
    
    showToast({
      message: `"${name}" has been copied to clipboard. You can now add/contact them on discord!`,
      title: 'Copied!',
      type: 'success',
      icon: '/icons/wildfire.webp',
      duration: 4000
    })
  }).catch(err => {
    console.error('Failed to copy:', err)
    showToast({
      message: 'Failed to copy to clipboard',
      title: 'Error',
      type: 'error',
      icon: '/icons/wildfire.webp',
      duration: 4000
    })
  })
}

// Show toast notification
function showToast(options) {
  // Clear any existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
  
  // Directly update the toast state for instant feedback without hiding (avoids flickering/instant disappear)
  toast.value = {
    show: true,
    message: options.message,
    title: options.title,
    type: options.type,
    duration: options.duration || 4000,
    icon: options.icon
  }
  
  // Set the timeout to hide it after the duration
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, options.duration || 4000)
}

// Keep triggerNewToast for compatibility if needed elsewhere, though showToast is now direct
function triggerNewToast(options) {
  showToast(options)
}

// Close toast manually
function closeToast() {
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
  toast.value.show = false
}

// Clear toast after animation
function clearToast() {
  toast.value.show = false
}

// Fetch member avatar with cache busting
async function fetchMemberData(member) {
  if (!member.discordId || failedIds[member.id]) return
  
  try {
    const response = await fetch(`https://avatar-cyan.vercel.app/api/${member.discordId}?t=${Date.now()}`)
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.avatarUrl) {
      memberData[member.id] = `${data.avatarUrl}&t=${Date.now()}`
    } else {
      memberData[member.id] = `https://cdn.discordapp.com/avatars/${member.discordId}/${member.discordId}.png?t=${Date.now()}`
    }
    
    delete failedIds[member.id]
    
  } catch (error) {
    console.error(`Eroare la fetch pentru ${member.name}:`, error)
    
    const defaultIndex = Math.abs(parseInt(member.discordId) % 5) || 0
    memberData[member.id] = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png?t=${Date.now()}`
  }
}

// Handle avatar error
function handleAvatarError(member) {
  const defaultIndex = Math.abs(parseInt(member.discordId) % 5) || 0
  memberData[member.id] = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png?t=${Date.now()}`
}

// Firefly styles (light theme only)
function fireflyStyle(n) {
  const size = 2 + Math.random() * 4
  const duration = 8 + Math.random() * 15
  const delay = Math.random() * 5
  const left = Math.random() * 100
  const top = Math.random() * 100
  
  return {
    width: size + 'px',
    height: size + 'px',
    left: left + '%',
    top: top + '%',
    '--duration': duration + 's',
    '--delay': delay + 's',
    '--x1': (Math.random() * 100 - 50) + 'px',
    '--y1': (Math.random() * 100 - 50) + 'px',
    '--x2': (Math.random() * 100 - 50) + 'px',
    '--y2': (Math.random() * 100 - 50) + 'px',
    '--x3': (Math.random() * 100 - 50) + 'px',
    '--y3': (Math.random() * 100 - 50) + 'px',
    opacity: 0.3 + Math.random() * 0.4
  }
}

let ticking = false

function handleMouseMove(e) {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      mousePosition.value = { x: e.clientX, y: e.clientY }
      
      const cards = document.querySelectorAll('.card')
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const cardCenterX = rect.left + rect.width / 2
        const cardCenterY = rect.top + rect.height / 2
        
        const distanceX = (mousePosition.value.x - cardCenterX) / 30
        const distanceY = (mousePosition.value.y - cardCenterY) / 30
        
        const rotateX = distanceY * -0.3
        const rotateY = distanceX * 0.3
        
        card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      })
      
      ticking = false
    })
    
    ticking = true
  }
}

// Reset card positions
function handleMouseLeave() {
  const cards = document.querySelectorAll('.card')
  cards.forEach(card => {
    card.style.transform = ''
  })
}

// Go back function
function goBack() {
  window.history.back()
}

// Load all data on mount
onMounted(async () => {
  const allMembers = hierarchy.flat()
  await Promise.all(allMembers.map(m => fetchMemberData(m)))
  loading.value = false
  
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<style scoped>
/* ========== DARK THEME (DEFAULT) ========== */
.org-page {
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #ffffff;
  transition: all 0.3s ease;
}

/* ========== HOME NAVBAR WRAPPER ========== */
:deep(.home-navbar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* ========== CONTENT WRAPPER ========== */
.content-wrapper {
  position: relative;
  min-height: 100vh;
  padding-top: 140px; /* Spațiu pentru navbar */
}

/* ========== BACK BUTTON FIXED ========== */
.back-button-fixed {
  position: fixed;
  top: 160px; /* Sub navbar (140px + 20px) */
  left: 20px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #ff8c00;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.back-button-fixed:hover {
  background: rgba(34, 34, 34, 0.8);
  border-color: #ff8c00;
  transform: scale(1.1);
}

.back-button-fixed svg {
  width: 18px;
  height: 18px;
}

/* Light theme pentru buton */
.light-theme .back-button-fixed {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #ff8c00;
}

.light-theme .back-button-fixed:hover {
  background: #ffffff;
  border-color: #ff8c00;
}

/* ========== BACKGROUND IMAGE BASE ========== */
.wildfire-wallpaper-base {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -5;
  object-fit: cover;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
  opacity: 0.2;
  transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}

.wildfire-wallpaper-hover {
  transform: scale(1.05) translateZ(0) !important;
  filter: brightness(1.05) contrast(1.05);
}

/* Overlay pentru a face textul lizibil */
.wildfire-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -4;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.light-theme .wildfire-overlay {
  background: rgba(255, 255, 255, 0.3);
}

/* Ajustează z-index pentru background-uri */
.bg-effects,
.wildfire-bg {
  z-index: -3;
  position: fixed;
  inset: 0;
  pointer-events: none;
}

/* ========== BACKGROUND CU LICURICI (LIGHT THEME) ========== */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: orbFloat 20s ease-in-out infinite;
}

.top-orb {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -150px;
  background: radial-gradient(circle, #ff4500 0%, #ff8c00 50%, transparent 80%);
}

.bottom-orb {
  width: 600px;
  height: 600px;
  bottom: -200px;
  left: -150px;
  background: radial-gradient(circle, #ff8c00 0%, #ff4500 50%, transparent 80%);
  animation-delay: -5s;
}

/* Grid subtil */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 69, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 69, 0, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ========== LICURICI ========== */
.firefly {
  position: absolute;
  border-radius: 50%;
  background: #ffaa33;
  filter: blur(2px);
  box-shadow: 0 0 15px rgba(255, 170, 51, 0.6);
  animation: fireflyFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  pointer-events: none;
  z-index: 1;
}

@keyframes fireflyFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(var(--x1), var(--y1)) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(var(--x2), var(--y2)) scale(1);
    opacity: 0.5;
  }
  75% {
    transform: translate(var(--x3), var(--y3)) scale(1.3);
    opacity: 0.9;
  }
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 30px) scale(0.95); }
}

/* ========== WILDFIRE DARK THEME BACKGROUND ========== */
.wildfire-base {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(3, 3, 3, 0.7) 0%, rgba(10, 7, 5, 0.6) 30%, rgba(3, 3, 3, 0.7) 70%);
  opacity: 0.95;
}

.wildfire-ember-left {
  position: absolute;
  bottom: 15%;
  left: 5%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle at 30% 70%, rgba(255, 68, 0, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.5;
  animation: emberGlow 12s ease-in-out infinite;
}

.wildfire-ember-right {
  position: absolute;
  top: 20%;
  right: 5%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle at 70% 30%, rgba(255, 85, 0, 0.07) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.45;
  animation: emberGlowReverse 14s ease-in-out infinite;
}

.wildfire-ember-bottom {
  position: absolute;
  bottom: 5%;
  right: 15%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle at 40% 60%, rgba(200, 60, 0, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(45px);
  opacity: 0.4;
  animation: emberFloat 16s ease-in-out infinite;
}

.wildfire-ember-top {
  position: absolute;
  top: 10%;
  left: 15%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle at 60% 40%, rgba(220, 70, 0, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(55px);
  opacity: 0.4;
  animation: emberFloatReverse 15s ease-in-out infinite;
}

.wildfire-energy-line-1 {
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 68, 0, 0.1) 20%, 
    rgba(255, 68, 0, 0.2) 50%, 
    rgba(255, 68, 0, 0.1) 80%, 
    transparent 100%
  );
  transform: rotate(-3deg) scale(1.2);
  opacity: 0.3;
  animation: energyPulse 8s ease-in-out infinite;
}

.wildfire-energy-line-2 {
  position: absolute;
  bottom: 40%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 85, 0, 0.08) 15%, 
    rgba(255, 68, 0, 0.15) 50%, 
    rgba(255, 85, 0, 0.08) 85%, 
    transparent 100%
  );
  transform: rotate(2deg) scale(1.1);
  opacity: 0.25;
  animation: energyPulseReverse 10s ease-in-out infinite;
}

.wildfire-energy-line-3 {
  position: absolute;
  top: 60%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(200, 60, 0, 0.06) 25%, 
    rgba(220, 70, 0, 0.12) 50%, 
    rgba(200, 60, 0, 0.06) 75%, 
    transparent 100%
  );
  transform: rotate(-1deg) scale(1.15);
  opacity: 0.2;
  animation: energyPulse 12s ease-in-out infinite;
}

.wildfire-particles {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 68, 0, 0.02) 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(255, 85, 0, 0.02) 1px, transparent 1px),
    radial-gradient(circle at 45% 20%, rgba(200, 60, 0, 0.01) 1px, transparent 1px),
    radial-gradient(circle at 65% 85%, rgba(220, 70, 0, 0.01) 1px, transparent 1px),
    radial-gradient(circle at 10% 60%, rgba(255, 68, 0, 0.01) 1px, transparent 1px),
    radial-gradient(circle at 90% 40%, rgba(255, 85, 0, 0.01) 1px, transparent 1px);
  background-size: 200px 200px, 180px 180px, 150px 150px, 220px 220px, 190px 190px, 210px 210px;
  background-position: 0 0;
  opacity: 0.4;
  animation: particlesMove 60s linear infinite;
}

/* ===== SPOTLIGHTS FINE ÎN COLȚURI ===== */
.wildfire-spotlight-tl {
  position: absolute;
  top: 0;
  left: 0;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle at 20% 20%, rgba(255, 69, 0, 0.18) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: spotlightPulse 12s ease-in-out infinite;
  z-index: 1;
}

.wildfire-spotlight-tr {
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at 80% 20%, rgba(255, 85, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.28;
  animation: spotlightPulse 14s ease-in-out infinite;
  z-index: 1;
}

.wildfire-spotlight-bl {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at 20% 80%, rgba(255, 100, 0, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.25;
  animation: spotlightPulse 10s ease-in-out infinite;
  z-index: 1;
}

.wildfire-spotlight-br {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle at 80% 80%, rgba(255, 68, 0, 0.14) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(75px);
  opacity: 0.26;
  animation: spotlightPulse 16s ease-in-out infinite;
  z-index: 1;
}

/* Particule energetice mobile */
.wildfire-floating-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}

.wildfire-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 69, 0, 0.6);
  border-radius: 50%;
  filter: blur(1px);
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.4);
}

.wildfire-particle-1 {
  top: 20%;
  left: 10%;
  width: 6px;
  height: 6px;
  background: rgba(255, 85, 0, 0.7);
  animation: moveHorizontal 15s ease-in-out infinite;
}

.wildfire-particle-2 {
  top: 70%;
  right: 15%;
  width: 5px;
  height: 5px;
  background: rgba(255, 100, 0, 0.7);
  animation: moveVertical 12s ease-in-out infinite;
}

.wildfire-particle-3 {
  top: 40%;
  left: 60%;
  width: 7px;
  height: 7px;
  background: rgba(255, 69, 0, 0.8);
  animation: moveDiagonal 18s ease-in-out infinite;
}

.wildfire-particle-4 {
  bottom: 25%;
  left: 30%;
  width: 4px;
  height: 4px;
  background: rgba(255, 140, 0, 0.6);
  animation: moveCircle 20s linear infinite;
}

.wildfire-particle-5 {
  top: 15%;
  right: 40%;
  width: 5px;
  height: 5px;
  background: rgba(255, 68, 0, 0.7);
  animation: moveZigZag 14s ease-in-out infinite;
}

.wildfire-particle-6 {
  bottom: 40%;
  left: 70%;
  width: 6px;
  height: 6px;
  background: rgba(255, 85, 0, 0.6);
  animation: moveWave 16s ease-in-out infinite;
}

.wildfire-particle-7 {
  top: 80%;
  left: 10%;
  width: 4px;
  height: 4px;
  background: rgba(255, 69, 0, 0.7);
  animation: moveBounce 10s ease-in-out infinite;
}

.wildfire-particle-8 {
  top: 30%;
  right: 20%;
  width: 5px;
  height: 5px;
  background: rgba(255, 100, 0, 0.7);
  animation: moveSpiral 22s linear infinite;
}

/* ===== ANIMAȚII WILDFIRE ===== */
@keyframes emberGlow {
  0%, 100% { opacity: 0.5; transform: translate(0, 0) scale(1); }
  50% { opacity: 0.7; transform: translate(10px, -10px) scale(1.05); }
}

@keyframes emberGlowReverse {
  0%, 100% { opacity: 0.45; transform: translate(0, 0) scale(1); }
  50% { opacity: 0.65; transform: translate(-10px, 10px) scale(1.05); }
}

@keyframes emberFloat {
  0%, 100% { opacity: 0.4; transform: translate(0, 0); }
  33% { opacity: 0.5; transform: translate(-15px, -5px); }
  66% { opacity: 0.45; transform: translate(5px, -10px); }
}

@keyframes emberFloatReverse {
  0%, 100% { opacity: 0.4; transform: translate(0, 0); }
  33% { opacity: 0.5; transform: translate(15px, 5px); }
  66% { opacity: 0.45; transform: translate(-5px, 10px); }
}

@keyframes energyPulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

@keyframes energyPulseReverse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.3; }
}

@keyframes particlesMove {
  0% { background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0; }
  100% { background-position: 200px 200px, 180px 180px, 150px 150px, 220px 220px, 190px 190px, 210px 210px; }
}

@keyframes spotlightPulse {
  0%, 100% { 
    opacity: 0.25; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.4; 
    transform: scale(1.08);
  }
}

@keyframes moveHorizontal {
  0%, 100% { transform: translateX(0) translateY(0); opacity: 0.4; }
  25% { transform: translateX(150px) translateY(-30px); opacity: 0.8; }
  50% { transform: translateX(300px) translateY(20px); opacity: 0.5; }
  75% { transform: translateX(150px) translateY(50px); opacity: 0.7; }
}

@keyframes moveVertical {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
  33% { transform: translateY(-120px) translateX(40px); opacity: 0.8; }
  66% { transform: translateY(100px) translateX(-30px); opacity: 0.6; }
}

@keyframes moveDiagonal {
  0%, 100% { transform: translate(0, 0); opacity: 0.5; }
  25% { transform: translate(200px, -100px); opacity: 0.9; }
  50% { transform: translate(350px, 50px); opacity: 0.6; }
  75% { transform: translate(150px, 150px); opacity: 0.8; }
}

@keyframes moveCircle {
  0% { transform: rotate(0deg) translate(80px) rotate(0deg); opacity: 0.5; }
  25% { transform: rotate(90deg) translate(80px) rotate(-90deg); opacity: 0.8; }
  50% { transform: rotate(180deg) translate(80px) rotate(-180deg); opacity: 0.5; }
  75% { transform: rotate(270deg) translate(80px) rotate(-270deg); opacity: 0.8; }
  100% { transform: rotate(360deg) translate(80px) rotate(-360deg); opacity: 0.5; }
}

@keyframes moveZigZag {
  0%, 100% { transform: translate(0, 0); opacity: 0.5; }
  20% { transform: translate(100px, -50px); opacity: 0.8; }
  40% { transform: translate(200px, 30px); opacity: 0.6; }
  60% { transform: translate(280px, -40px); opacity: 0.9; }
  80% { transform: translate(150px, 60px); opacity: 0.7; }
}

@keyframes moveWave {
  0%, 100% { transform: translate(0, 0); opacity: 0.4; }
  25% { transform: translate(120px, -60px); opacity: 0.7; }
  50% { transform: translate(240px, 0); opacity: 0.5; }
  75% { transform: translate(120px, 60px); opacity: 0.8; }
}

@keyframes moveBounce {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
  25% { transform: translateY(-150px) translateX(50px); opacity: 0.9; }
  50% { transform: translateY(0) translateX(120px); opacity: 0.6; }
  75% { transform: translateY(-80px) translateX(200px); opacity: 0.8; }
}

@keyframes moveSpiral {
  0% { transform: rotate(0deg) translate(50px) rotate(0deg); opacity: 0.5; }
  33% { transform: rotate(120deg) translate(90px) rotate(-120deg); opacity: 0.8; }
  66% { transform: rotate(240deg) translate(130px) rotate(-240deg); opacity: 0.6; }
  100% { transform: rotate(360deg) translate(50px) rotate(-360deg); opacity: 0.5; }
}

/* ========== TOAST NOTIFICATION ========== */
.toast-notification {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1000;
  min-width: 360px;
  max-width: 440px;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 0 20px rgba(255, 69, 0, 0.05);
  overflow: hidden;
  animation: toastSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 69, 0, 0.15);
  transform-origin: bottom right;
}

.toast-notification::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 69, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 69, 0, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  animation: toastGridDrift 30s linear infinite;
  z-index: 0;
  pointer-events: none;
}

.toast-glass {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 69, 0, 0.12) 0%, transparent 75%);
  animation: toastSoftPulse 6s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

.toast-notification.success {
  border-left: 5px solid #2ecc71;
}

.toast-notification.error {
  border-left: 5px solid #e74c3c;
}

.toast-content {
  padding: 20px 52px 20px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 2;
}

.toast-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 69, 0, 0.1);
  border: 1px solid rgba(255, 69, 0, 0.2);
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.toast-notification.success .toast-icon-wrapper {
  background: rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.2);
}

.toast-notification.error .toast-icon-wrapper {
  background: rgba(231, 76, 60, 0.1);
  border-color: rgba(231, 76, 60, 0.2);
}

.toast-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.toast-message-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.toast-title {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  font-family: 'Outfit', sans-serif;
}

.toast-message {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  font-weight: 400;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff4500, #ff8c00);
  animation: progress linear forwards;
  z-index: 3;
}

.toast-notification.success .toast-progress {
  background: linear-gradient(90deg, #2ecc71, #27ae60);
}

.toast-notification.error .toast-progress {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.toast-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 4;
}

.toast-close:hover {
  background: rgba(255, 69, 0, 0.2);
  color: #ffffff;
  border-color: rgba(255, 69, 0, 0.3);
  transform: rotate(90deg);
}

@keyframes toastGridDrift {
  from { background-position: 0 0; }
  to { background-position: 48px 48px; }
}

@keyframes toastSoftPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes toastSlideIn {
  from {
    transform: translateY(40px) scale(0.9) rotate(-2deg);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

.toast-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  transform: translateY(40px) scale(0.9) rotate(2deg);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(40px) scale(0.8);
  opacity: 0;
}

/* ========== CHART ========== */
.chart {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 40px;
}

.loading-state {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  padding: 40px;
}

/* ========== CONNECTORS ========== */
.connector-v {
  display: flex;
  justify-content: center;
  height: 30px;
}

.cv-line {
  width: 1px;
  height: 30px;
  background: linear-gradient(180deg, #ff4500 0%, transparent 100%);
  opacity: 0.3;
}

.drop-line {
  width: 1px;
  height: 30px;
  margin: 0 auto 10px;
  background: linear-gradient(180deg, #ff4500 0%, transparent 100%);
  opacity: 0.3;
}

/* ========== LEVEL ROW ========== */
.level-row {
  display: flex;
  justify-content: center;
  position: relative;
  gap: 0;
}

.child .node {
  position: relative;
  padding-top: 20px;
}

.child .node::before,
.child .node::after {
  content: '';
  position: absolute;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff4500 50%, transparent);
  opacity: 0.2;
}

.child .node::before {
  left: 0;
  right: 50%;
}

.child .node::after {
  left: 50%;
  right: 0;
}

.child .node:first-child::before,
.child .node:last-child::after,
.child .node:only-child::before,
.child .node:only-child::after {
  display: none;
}

/* ========== NODE ========== */
.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
}

/* ========== CARD CU EFECT 3D ========== */
.card {
  width: 240px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px 18px 18px;
  transition: transform 0.1s ease;
  animation: cardAppear 0.4s ease-out;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}

/* DARK THEME - HOVER EFFECTS CU CULORILE ROLURILOR (FĂRĂ BOX-SHADOW) */
.card.founder:hover {
  border-color: #7a3c3c;
  background: rgba(10, 10, 10, 0.9);
  transform: translateY(-4px);
}

.card.cm:hover {
  border-color: #a60303;
  background: rgba(10, 10, 10, 0.9);
  transform: translateY(-4px);
}

.card.sm:hover {
  border-color: #9b59b6;
  background: rgba(10, 10, 10, 0.9);
  transform: translateY(-4px);
}

.card.admin:hover {
  border-color: #4a9eff;
  background: rgba(10, 10, 10, 0.9);
  transform: translateY(-4px);
}

.card.mod:hover {
  border-color: #f1c40f;
  background: rgba(10, 10, 10, 0.9);
  transform: translateY(-4px);
}

.card.helper:hover {
  border-color: #2ecc71;
  background: rgba(10, 10, 10, 0.9);
  transform: translateY(-4px);
}

.is-founder:hover {
  border-color: #ff4444;
  background: rgba(10, 10, 10, 0.9);
  transform: translateY(-4px);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animation delays */
.level-0 .card { animation-delay: 0.1s; }
.level-1 .node:nth-child(1) .card { animation-delay: 0.18s; }
.level-1 .node:nth-child(2) .card { animation-delay: 0.26s; }
.level-2 .node:nth-child(1) .card { animation-delay: 0.34s; }
.level-2 .node:nth-child(2) .card { animation-delay: 0.42s; }
.level-3 .node:nth-child(1) .card { animation-delay: 0.5s; }
.level-3 .node:nth-child(2) .card { animation-delay: 0.58s; }
.level-4 .node:nth-child(1) .card { animation-delay: 0.66s; }
.level-4 .node:nth-child(2) .card { animation-delay: 0.74s; }
.level-4 .node:nth-child(3) .card { animation-delay: 0.82s; }
.level-5 .card { animation-delay: 0.9s; }

/* ========== AVATAR ========== */
.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.card:hover .avatar-circle {
  transform: scale(1.02);
}

/* DARK THEME - Role-based circle colors */
.avatar-circle.circle-founder {
  background: #7a3c3c !important;
}

.avatar-circle.circle-cm {
  background: #a60303 !important;
}

.avatar-circle.circle-sm {
  background: #9b59b6 !important;
}

.avatar-circle.circle-admin {
  background: #4a9eff !important;
}

.avatar-circle.circle-mod {
  background: #f1c40f !important;
}

.avatar-circle.circle-helper {
  background: #2ecc71 !important;
}

.avatar-img {
  width: 97px;
  height: 97px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.avatar-init {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

/* Crown SVG */
.crown-svg {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  animation: crownFloat 3s ease-in-out infinite;
  z-index: 3;
}

@keyframes crownFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
}

/* Copy name button */
.copy-name-btn {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2a2a2a;
  border: 1px solid #444;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 3;
}

.copy-name-btn:hover {
  background: #333;
  color: #ff8c00;
  border-color: #ff8c00;
  transform: scale(1.1);
}

/* ========== MEMBER INFO ========== */
.member-info {
  text-align: center;
  margin-bottom: 16px;
}

.member-name {
  display: block;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
}

.member-tag-wrapper {
  display: flex;
  justify-content: center;
}

/* ========== MEMBER TAG - STYLE DISCORD ========== */
.member-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 500;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.3);
  line-height: 1.2;
  letter-spacing: 0.3px;
}

.role-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
}

.role-icon-wrapper {
  display: inline-flex;
  align-items: center;
}

.role-custom-icon {
  width: 12px;
  height: 12px;
  object-fit: contain;
  display: inline-block;
  vertical-align: middle;
}

.role-emoji {
  font-size: 0.7rem;
  line-height: 1;
}

.role-separator {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  margin: 0 2px;
}

.tag-text {
  color: #ffffff;
  font-weight: 500;
}

.tag-icon {
  width: 12px;
  height: 12px;
  object-fit: contain;
  opacity: 0.9;
  margin-left: 2px;
}

/* ========== PREVENT SELECTION ========== */
.org-page,
.org-page *,
.card,
.card *,
.member-name,
.member-tag,
.tag-text,
.avatar-img,
.avatar-init,
.role-dot,
.role-emoji,
.tag-icon,
.role-custom-icon {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.copy-name-btn {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: pointer;
}

.copy-name-btn * {
  user-select: none;
  -webkit-user-select: none;
}

/* ========== LIGHT THEME ========== */
.org-page.light-theme {
  background: transparent;
  color: #222222;
}

/* Light theme background */
.light-theme .wildfire-overlay {
  background: rgba(255, 255, 255, 0.7);
}

.light-theme .bg-effects {
  background: transparent;
}

.light-theme .top-orb {
  background: radial-gradient(circle, rgba(255, 69, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 50%, transparent 80%);
  opacity: 0.3;
}

.light-theme .bottom-orb {
  background: radial-gradient(circle, rgba(255, 140, 0, 0.1) 0%, rgba(255, 69, 0, 0.05) 50%, transparent 80%);
  opacity: 0.3;
}

.light-theme .bg-grid {
  background-image: 
    linear-gradient(rgba(255, 69, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 69, 0, 0.03) 1px, transparent 1px);
}

.light-theme .firefly {
  background: #ffaa33;
  opacity: 0.4;
  box-shadow: 0 0 20px rgba(255, 170, 51, 0.4);
}

/* Light theme cards */
.light-theme .card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* LIGHT THEME - HOVER EFFECTS CU CULORILE ROLURILOR (FĂRĂ BOX-SHADOW) */
.light-theme .card.founder:hover {
  border-color: #7a3c3c;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
}

.light-theme .card.cm:hover {
  border-color: #a60303;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
}

.light-theme .card.sm:hover {
  border-color: #9b59b6;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
}

.light-theme .card.admin:hover {
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
}

.light-theme .card.mod:hover {
  border-color: #f1c40f;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
}

.light-theme .card.helper:hover {
  border-color: #2ecc71;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
}

.light-theme .is-founder:hover {
  border-color: #ff4444;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-4px);
}

.light-theme .member-name {
  color: #222222;
}

.light-theme .member-tag {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: #222222;
}

.light-theme .tag-text {
  color: #222222;
}

.light-theme .role-separator {
  color: rgba(0, 0, 0, 0.3);
}

.light-theme .role-dot {
  opacity: 0.9;
}

/* LIGHT THEME - CERC COLORAT */
.light-theme .avatar-circle.circle-founder {
  background: #7a3c3c !important;
}

.light-theme .avatar-circle.circle-cm {
  background: #a60303 !important;
}

.light-theme .avatar-circle.circle-sm {
  background: #9b59b6 !important;
}

.light-theme .avatar-circle.circle-admin {
  background: #4a9eff !important;
}

.light-theme .avatar-circle.circle-mod {
  background: #f1c40f !important;
}

.light-theme .avatar-circle.circle-helper {
  background: #2ecc71 !important;
}

.light-theme .avatar-img,
.light-theme .avatar-init {
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.light-theme .copy-name-btn {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.1);
  color: #666666;
}

.light-theme .copy-name-btn:hover {
  background: #ffffff;
  color: #ff8c00;
  border-color: #ff8c00;
}

.light-theme .connector-v .cv-line,
.light-theme .drop-line,
.light-theme .child .node::before,
.light-theme .child .node::after {
  background: #ff8c00;
  opacity: 0.15;
}

/* Light theme toast */
.light-theme .toast-notification {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  border: 1px solid rgba(255, 69, 0, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.light-theme .toast-notification::before {
  background-image: 
    linear-gradient(rgba(255, 69, 0, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 69, 0, 0.08) 1px, transparent 1px);
}

.light-theme .toast-glass {
  background: radial-gradient(circle at center, rgba(255, 69, 0, 0.08) 0%, transparent 75%);
}

.light-theme .toast-title {
  color: #1a1a1a;
}

.light-theme .toast-message {
  color: #4a4a4a;
}

.light-theme .toast-icon-wrapper {
  background: rgba(255, 69, 0, 0.05);
  border-color: rgba(255, 69, 0, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-theme .toast-close {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.4);
}

.light-theme .toast-close:hover {
  background: rgba(255, 69, 0, 0.12);
  color: #ff4500;
  border-color: rgba(255, 69, 0, 0.2);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 860px) {
  .card {
    width: 210px;
    padding: 20px 15px 15px;
  }
  
  .avatar-wrapper {
    width: 90px;
    height: 90px;
  }
  
  .avatar-img,
  .avatar-init {
    width: 80px;
    height: 80px;
    font-size: 2.2rem;
  }
  
  .member-name {
    font-size: 0.9rem;
  }
  
  .member-tag {
    font-size: 0.6rem;
    padding: 2px 8px;
  }
  
  .node {
    padding: 0 10px;
  }

  .toast-notification {
    bottom: 24px;
    left: 24px;
    right: 24px;
    max-width: none;
    min-width: auto;
  }

  .back-button-fixed {
    top: 150px;
    left: 15px;
    width: 36px;
    height: 36px;
  }

  .content-wrapper {
    padding-top: 130px;
  }
}

@media (max-width: 620px) {
  .back-button-fixed {
    top: 140px;
    left: 10px;
    width: 32px;
    height: 32px;
  }

  .content-wrapper {
    padding-top: 120px;
  }

  .level-row {
    flex-direction: column;
    align-items: center;
  }
  
  .child .node {
    padding-top: 0;
  }
  
  .child .node::before,
  .child .node::after {
    display: none;
  }
  
  .drop-line {
    display: none;
  }
  
  .node + .node {
    margin-top: 20px;
  }
  
  .node + .node::before {
    content: '';
    display: block;
    width: 1px;
    height: 20px;
    background: #ff4500;
    opacity: 0.2;
    margin: 0 auto 20px;
  }
  
  .card {
    width: 280px;
  }
  
  .avatar-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .avatar-img,
  .avatar-init {
    width: 90px;
    height: 90px;
    font-size: 2.5rem;
  }
  
  .member-name {
    font-size: 1rem;
  }
  
  .member-tag {
    font-size: 0.65rem;
    padding: 3px 10px;
  }

  .toast-notification {
    bottom: 16px;
    left: 16px;
    right: 16px;
  }
}
</style>