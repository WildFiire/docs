<template>
  <div v-if="isHomePage" class="wildfire-home orbitron-font">
    <HomeNavbar v-if="isHomePage" />
    
    <img 
      src="/wallpaper/poza102.webp"
      alt=""
      class="wildfire-wallpaper"
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
    
    <img 
      src="/wallpaper/da.webp"
      alt=""
      class="wildfire-wallpaper-overlay"
      :class="{ 
        'wildfire-wallpaper-overlay-loaded': isOverlayLoaded && isHovered 
      }"
      width="1920"
      height="1080"
      fetchpriority="low"
      loading="lazy"
      decoding="async"
      role="presentation"
    />
    
<div class="wildfire-bg">
  <!-- Gradient de bază - negru elegant -->
  <div class="wildfire-base"></div>
  
  <!-- Elemente de design unice -->
  <div class="wildfire-ember-left"></div>
  <div class="wildfire-ember-right"></div>
  <div class="wildfire-ember-bottom"></div>
  <div class="wildfire-ember-top"></div>
  
  <!-- Linii de energie -->
  <div class="wildfire-energy-line-1"></div>
  <div class="wildfire-energy-line-2"></div>
  <div class="wildfire-energy-line-3"></div>
  
  <!-- Particule fine -->
  <div class="wildfire-particles"></div>
  
  <!-- Particule mobile -->
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

  <!-- Gradient de scroll -->
  <div class="scroll-overlay" :style="{ opacity: scrollOverlayOpacity }"></div>
</div>
    
    <main class="wildfire-hero">
      <div class="wildfire-container">
        <div class="wildfire-logo-container" @mouseenter="triggerBoomEffect">
          <div class="wildfire-logo-glow" :class="{ 'boom-active': isBoomActive }"></div>
          <div class="logo-boom-ring" v-for="n in 3" :key="n" :class="{ 'boom-active': isBoomActive }" :style="{ '--i': n }"></div>
          <img 
            src="/icons/wildfire.webp" 
            alt="Wildfire.ro" 
            class="wildfire-logo"
            :class="{ 'logo-start': logoStart, 'boom-active': isBoomActive }"
            width="150"
            height="150"
            fetchpriority="high"
            decoding="sync"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
            ref="logoImg"
          >
        </div>

        <!-- Titlu cu litere mari, wild alb, fire gradient, ro gradient, docs alb -->
        <h1 class="wildfire-title typing-text orbitron-font" :class="{ 'typing-complete': titleTyped }">
          <span v-if="!titleTyped">
            <span v-for="(char, index) in displayTitleArray" :key="index" :class="getCharClass(index)">
              {{ char }}
            </span>
            <span class="cursor"></span>
          </span>
          <span v-else>
            <span class="wild-white">WILD</span><span class="fire-gradient-text">FIRE</span><span class="dot-orange">.</span><span class="ro-gradient-text">RO</span><span class="docs-white"> DOCS</span>
          </span>
        </h1>

        <!-- Feature badges cu efect de typing -->
        <div class="feature-badges">
          <div class="feature-badge orbitron-font" v-for="(badge, index) in featureBadges" :key="index">
            <span class="feature-icon" v-html="badge.icon"></span>
            <span class="feature-text typing-text orbitron-font" :class="{ 'typing-complete': badgesTyped[index] }">{{ displayBadges[index] }}<span v-if="!badgesTyped[index]" class="cursor"></span></span>
          </div>
        </div>

        <div class="wildfire-button-wrapper">
          <a 
            href="/informatii/about" 
            class="wildfire-button orbitron-font"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
          >
            <span class="typing-text orbitron-font" :class="{ 'typing-complete': buttonTyped }">{{ displayButton }}<span v-if="!buttonTyped" class="cursor"></span></span>
            <span class="wildfire-button-arrow">→</span>
          </a>
        </div>

        <!-- Home Searchbar cu efect de typing ciclic -->
        <div class="home-search">
          <button class="home-search-button orbitron-font" @click="openSearch" type="button">
            <img 
              src="/icons/searchbutton.svg" 
              class="search-icon" 
              alt="search" 
              width="16" 
              height="16"
              loading="eager"
              decoding="async"
            >
            <span class="home-search-text typing-text orbitron-font">{{ displaySearchText }}<span class="cursor"></span></span>
            <span class="home-search-shortcut orbitron-font">CTRL K</span>
          </button>
        </div>

        <div class="community-tag delayed-tag">
          <span class="tag-badge typing-text orbitron-font" :class="{ 'typing-complete': tagTyped }">{{ displayTag }}<span v-if="!tagTyped" class="cursor"></span></span>
          <span class="tag-year orbitron-font">since 2021</span>
        </div>

        <!-- Last Updates -->
        <div class="last-updates-wrapper reveal-element" ref="lastUpdatesRef">
          <LastUpdates />
        </div>

        <!-- About Wiki Component -->
        <AboutWiki :startTyping="startWikiTyping" ref="aboutWikiRef" />

        <!-- Wiki Updates Grid -->
        <div class="updates-grid-section reveal-element" ref="updatesGridRef">
              <WikiUpdatesGrid />
        </div>
        
      </div>
    </main>

    <!-- <div class="scroll-indicator" :class="{ 'scroll-visible': showScrollIndicator }">
      <div class="scroll-line">
        <div class="scroll-progress" :style="{ height: scrollProgress + '%' }"></div>
      </div>
      <div class="scroll-sections">
        <a href="#wiki-section" class="scroll-dot orbitron-font" :class="{ 'active': activeSection === 'wiki' }">
          <span class="dot"></span>
          <span class="dot-label">Wiki</span>
        </a>
        <a href="#last-updates" class="scroll-dot orbitron-font" :class="{ 'active': activeSection === 'updates' }">
          <span class="dot"></span>
          <span class="dot-label">Updates</span>
        </a>
        <a href="#updates-grid" class="scroll-dot orbitron-font" :class="{ 'active': activeSection === 'updates-grid' }">
          <span class="dot"></span>
          <span class="dot-label">Latest</span>
        </a>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'
import HomeNavbar from './HomeNavbar.vue'
import LastUpdates from './LastUpdates.vue'
import WikiUpdatesGrid from './WikiUpdatesGrid.vue'
import AboutWiki from './AboutWiki.vue'

const { page, theme } = useData()

const isHomePage = computed(() => {
  return page.value.relativePath === 'index.md' || page.value.relativePath === 'index'
})

const isHovered = ref(false)
const isOverlayLoaded = ref(false)
const logoStart = ref(false)
const isBoomActive = ref(false)
let boomTimeout: ReturnType<typeof setTimeout> | null = null

// Referințe
const aboutWikiRef = ref<InstanceType<typeof AboutWiki> | null>(null)
const startWikiTyping = ref(false)
const lastUpdatesRef = ref<HTMLElement | null>(null)
const updatesGridRef = ref<HTMLElement | null>(null)

// Titlu 
const displayTitle = ref('')
const displayTitleArray = computed(() => displayTitle.value.split(''))
const titleTyped = ref(false)
const titleOriginal = 'WILDFIRE.RO DOCS'

// Scroll indicator
const showScrollIndicator = ref(false)
const scrollProgress = ref(0)
const activeSection = ref('')
const scrollOverlayOpacity = ref(0)

// Funcție pentru a determina clasa culorii pentru fiecare caracter în timpul typing-ului
const getCharClass = (index: number) => {
  const text = displayTitle.value
  if (index < 4) return 'wild-white'
  if (index >= 4 && index < 8) return 'fire-orange'
  if (index === 8) return 'dot-orange'
  if (index >= 9 && index < 11) return 'ro-orange'
  if (index >= 11) return 'docs-white'
  return ''
}

// ===== EFFECT DE TYPING =====
const featureBadges = [
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 21h1v-2.5H21v-1h-2.5V15h-1v2.5H15v1h2.5zm.5 2q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M7 9h10V7H7zm4.675 12H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v6.7q-.725-.35-1.463-.525T18 11q-.275 0-.513.012t-.487.063V11H7v2h6.125q-.45.425-.812.925T11.675 15H7v2h4.075q-.05.25-.062.488T11 18q0 .825.15 1.538T11.675 21"/></svg>', 
    text: 'Documentatie' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>', 
    text: 'Informatie' 
  },
  { 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>', 
    text: 'Features' 
  }
]

const displayBadges = ref(['', '', ''])
const badgesTyped = ref([false, false, false])

const displayButton = ref('')
const buttonTyped = ref(false)
const buttonOriginal = 'Ghid de pornire'

const displayTag = ref('')
const tagTyped = ref(false)
const tagOriginal = '@Wildfire.ro'

const displaySearchText = ref('')
const searchSuggestions = [
  'Caută în documentație...',
  'Regulament Jucatori',
  'Informatii',
  'Knifes',
  'Fire Coins',
  'VIP Tiers',
  'Sisteme',
  'Shop',
  'Stats'
]

let currentSuggestionIndex = 0
let searchTypingTimeout: ReturnType<typeof setTimeout> | null = null
let searchPauseTimeout: ReturnType<typeof setTimeout> | null = null

const typeTitle = async () => {
  for (let i = 0; i <= titleOriginal.length; i++) {
    displayTitle.value = titleOriginal.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  titleTyped.value = true
}

const typeBadges = async () => {
  for (let b = 0; b < featureBadges.length; b++) {
    const text = featureBadges[b].text
    for (let i = 0; i <= text.length; i++) {
      const newBadges = [...displayBadges.value]
      newBadges[b] = text.substring(0, i)
      displayBadges.value = newBadges
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    badgesTyped.value[b] = true
    await new Promise(resolve => setTimeout(resolve, 150))
  }
}

const typeButton = async () => {
  for (let i = 0; i <= buttonOriginal.length; i++) {
    displayButton.value = buttonOriginal.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 40))
  }
  buttonTyped.value = true
}

const typeTag = async () => {
  for (let i = 0; i <= tagOriginal.length; i++) {
    displayTag.value = tagOriginal.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 40))
  }
  tagTyped.value = true
}

const typeSearchNext = async () => {
  const nextText = searchSuggestions[currentSuggestionIndex]
  
  if (displaySearchText.value.length > 0) {
    for (let i = displaySearchText.value.length; i > 0; i--) {
      displaySearchText.value = displaySearchText.value.substring(0, i - 1)
      await new Promise(resolve => setTimeout(resolve, 15))
    }
  }
  
  for (let i = 0; i <= nextText.length; i++) {
    displaySearchText.value = nextText.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 25))
  }
  
  currentSuggestionIndex = (currentSuggestionIndex + 1) % searchSuggestions.length
  searchPauseTimeout = setTimeout(typeSearchNext, 1000)
}

const startTypingEffects = () => {
  setTimeout(() => typeTitle(), 100)
  setTimeout(() => typeBadges(), 600)
  setTimeout(() => typeButton(), 1200)
  setTimeout(() => typeTag(), 1500)
  
  setTimeout(() => {
    startWikiTyping.value = true
  }, 1900)
  
  setTimeout(() => {
    displaySearchText.value = ''
    setTimeout(() => {
      currentSuggestionIndex = 0
      typeSearchNext()
    }, 150)
  }, 1000)
}

// ===== FUNCȚII UTILITARE =====
const openSearch = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  const searchButton = document.querySelector('.VPNavBarSearch button')
  if (searchButton) {
    ;(searchButton as HTMLElement).click()
    return
  }
  
  const event = new KeyboardEvent('keydown', {
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    bubbles: true,
    cancelable: true
  })
  window.dispatchEvent(event)
}

const toggleDefaultNavbar = (hide: boolean) => {
  const vitepressNavbar = document.querySelector('.VPNav')
  if (vitepressNavbar) {
    (vitepressNavbar as HTMLElement).style.display = hide ? 'none' : ''
  }
  
  const vitepressSidebar = document.querySelector('.VPSidebar')
  if (vitepressSidebar) {
    (vitepressSidebar as HTMLElement).style.display = hide ? 'none' : ''
  }
  
  const vitepressContent = document.querySelector('.VPContent')
  if (vitepressContent) {
    (vitepressContent as HTMLElement).style.marginTop = hide ? '0' : ''
  }
  
  const localNav = document.querySelector('.VPLocalNav')
  if (localNav) {
    (localNav as HTMLElement).style.display = hide ? 'none' : ''
  }
}

const triggerBoomEffect = () => {
  if (boomTimeout) {
    clearTimeout(boomTimeout)
  }
  isBoomActive.value = true
  boomTimeout = setTimeout(() => {
    isBoomActive.value = false
  }, 500)
}

// ===== FUNCȚII PENTRU SCROLL =====
const isElementInViewport = (el: HTMLElement | null) => {
  if (!el) return false
  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight
  return rect.top < windowHeight * 0.85 && rect.bottom > 0
}

const applyRevealEffect = () => {
  const elements = [
    lastUpdatesRef.value,
    updatesGridRef.value
  ].filter(el => el !== null)

  elements.forEach(el => {
    if (isElementInViewport(el)) {
      el.classList.add('revealed')
    } else {
      el.classList.remove('revealed')
    }
  })
}

const handleScroll = () => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  scrollProgress.value = (scrollY / (documentHeight - windowHeight)) * 100
  showScrollIndicator.value = scrollY > 200
  
  const isDark = document.documentElement.classList.contains('dark')
  if (isDark) {
    scrollOverlayOpacity.value = Math.min(scrollY / 400, 1)
  } else {
    scrollOverlayOpacity.value = Math.min(scrollY / 800, 0.6)
  }
  
  const wikiSection = document.getElementById('wiki-section')
  const updatesSection = document.querySelector('.last-updates-wrapper')
  const updatesGrid = updatesGridRef.value
  
  if (wikiSection) {
    const wikiRect = wikiSection.getBoundingClientRect()
    if (wikiRect.top < windowHeight/2 && wikiRect.bottom > 0) {
      activeSection.value = 'wiki'
    } else if (activeSection.value === 'wiki') {
      activeSection.value = ''
    }
  }
  
  if (updatesSection) {
    const updatesRect = updatesSection.getBoundingClientRect()
    if (updatesRect.top < windowHeight/2 && updatesRect.bottom > 0) {
      activeSection.value = 'updates'
    } else if (activeSection.value === 'updates') {
      activeSection.value = ''
    }
  }
  
  if (updatesGrid) {
    const gridRect = updatesGrid.getBoundingClientRect()
    if (gridRect.top < windowHeight/2 && gridRect.bottom > 0) {
      activeSection.value = 'updates-grid'
    } else if (activeSection.value === 'updates-grid') {
      activeSection.value = ''
    }
  }

  applyRevealEffect()
}

watch(isHomePage, (newValue) => {
  toggleDefaultNavbar(newValue)
}, { immediate: true })

onMounted(() => {
  toggleDefaultNavbar(isHomePage.value)
  
  // Nu mai fetch-uim GitHub aici - totul e în WikiUpdatesGrid
  
  setTimeout(() => {
    const overlayImg = new Image()
    overlayImg.src = '/wallpaper/da.webp'
    overlayImg.fetchPriority = 'low'
    overlayImg.onload = () => {
      isOverlayLoaded.value = true
    }
  }, 2000)
  
  setTimeout(() => {
    logoStart.value = true
  }, 800)
  
  startTypingEffects()
  
  window.addEventListener('scroll', handleScroll)
  handleScroll()
  
  setTimeout(applyRevealEffect, 100)
})

onUnmounted(() => {
  toggleDefaultNavbar(false)
  if (boomTimeout) {
    clearTimeout(boomTimeout)
  }
  if (searchTypingTimeout) {
    clearTimeout(searchTypingTimeout)
  }
  if (searchPauseTimeout) {
    clearTimeout(searchPauseTimeout)
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ===== FONT ORBITRON DOAR PENTRU ELEMENTELE CHEIE ===== */
.orbitron-font {
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.3px;
}

/* Titlul principal - WILDFIRE.RO DOCS */
.wildfire-title,
.wild-white,
.fire-gradient-text,
.ro-gradient-text,
.docs-white {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.5px;
}

.wildfire-title {
  font-weight: 800 !important;
  font-size: 48px;
}

.wild-white,
.docs-white {
  font-weight: 700 !important;
}

.fire-gradient-text,
.ro-gradient-text {
  font-weight: 800 !important;
}

/* Butoane și elemente interactive */
.wildfire-button,
.home-search-button,
.home-search-shortcut,
.tag-badge,
.tag-year,
.scroll-dot .dot-label,
.community-tag .tag-badge {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.wildfire-button {
  font-weight: 600 !important;
  text-transform: uppercase;
}

.home-search-button {
  font-weight: 500 !important;
}

.home-search-shortcut {
  font-weight: 600 !important;
  font-size: 10px;
}

.tag-badge {
  font-weight: 700 !important;
  color: #ff4500;
}

.tag-year {
  font-weight: 500 !important;
  color: var(--vp-c-text-2);
}

/* Feature badges - doar textul, iconițele rămân normale */
.feature-badge .feature-text {
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 500 !important;
  font-size: 13px;
}

/* Scroll indicator */
.scroll-dot .dot-label {
  font-weight: 500 !important;
  font-size: 11px;
  text-transform: uppercase;
}

/* Restul stilurilor rămân exact la fel */
.wildfire-home {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 100px 24px 80px;
  min-height: 100vh;
  overflow-x: hidden;
}

.wildfire-wallpaper,
.wildfire-wallpaper-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateZ(0);
  backface-visibility: hidden;
  user-select: none;
  pointer-events: none;
}

.wildfire-wallpaper-overlay {
  z-index: -1;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.wildfire-wallpaper-overlay-loaded {
  opacity: 1 !important;
}

.wildfire-wallpaper-hover {
  transform: scale(1.08) translateZ(0) !important;
  filter: brightness(1.08) contrast(1.08) saturate(1.1);
}

.wildfire-home .wildfire-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  transform: translateZ(0);
}

:not(.dark) .wildfire-home .wildfire-bg {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
}

:not(.dark) .wildfire-home .wildfire-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(220, 38, 38, 0.04), rgba(249, 115, 22, 0.02), rgba(255, 255, 255, 0.85));
}

.wildfire-home .wildfire-grid-primary,
.wildfire-home .wildfire-grid-secondary,
.wildfire-home .wildfire-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

:not(.dark) .wildfire-home .wildfire-grid-primary {
  opacity: 0.05;
  background-image: 
    linear-gradient(to right, rgba(255, 69, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 69, 0, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

:not(.dark) .wildfire-home .wildfire-grid-secondary {
  opacity: 0.03;
  background-image: 
    linear-gradient(to right, rgba(255, 100, 0, 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 100, 0, 0.07) 1px, transparent 1px);
  background-size: 20px 20px;
}

:not(.dark) .wildfire-home .wildfire-scanlines {
  opacity: 0.01;
  background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px);
  background-size: 100% 2px;
}

.wildfire-home .wildfire-spotlight-tl,
.wildfire-home .wildfire-spotlight-br {
  position: absolute;
  width: 384px;
  height: 384px;
  border-radius: 50%;
  filter: blur(48px);
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translateZ(0);
  backface-visibility: hidden;
}

:not(.dark) .wildfire-home .wildfire-spotlight-tl {
  top: 0;
  left: 25%;
  background: rgba(220, 38, 38, 0.04);
}

:not(.dark) .wildfire-home .wildfire-spotlight-br {
  bottom: 0;
  right: 25%;
  background: rgba(249, 115, 22, 0.03);
}

.wildfire-wallpaper-hover ~ .wildfire-bg .wildfire-spotlight-tl,
.wildfire-wallpaper-hover ~ .wildfire-bg .wildfire-spotlight-br {
  opacity: 1;
  animation: spotlight-pulse 2.2s ease-in-out infinite;
}

.wildfire-wallpaper-hover ~ .wildfire-bg .wildfire-spotlight-br {
  animation-delay: 0.3s;
}

.wildfire-wallpaper-hover ~ .wildfire-bg .wildfire-grid-primary {
  animation: grid-pulse 2s ease-in-out infinite;
}

.wildfire-wallpaper-hover ~ .wildfire-bg .wildfire-grid-secondary {
  animation: grid-pulse-slow 2.5s ease-in-out infinite;
}

@keyframes grid-pulse {
  0% { opacity: 0.05; }
  50% { opacity: 0.15; }
  100% { opacity: 0.05; }
}

@keyframes grid-pulse-slow {
  0% { opacity: 0.03; }
  50% { opacity: 0.1; }
  100% { opacity: 0.03; }
}

@keyframes spotlight-pulse {
  0% { 
    opacity: 0.15; 
    transform: scale(1) translateZ(0);
    filter: blur(48px);
  }
  50% { 
    opacity: 0.4; 
    transform: scale(1.2) translateZ(0);
    filter: blur(52px);
  }
  100% { 
    opacity: 0.15; 
    transform: scale(1) translateZ(0);
    filter: blur(48px);
  }
}

/* DARK MODE - Background nou */
.dark .wildfire-home .wildfire-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  transform: translateZ(0);
  background: transparent;
}

.dark .wildfire-base {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #030303 0%, #0a0705 30%, #030303 70%);
  opacity: 0.95;
}

.dark .wildfire-ember-left {
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

.dark .wildfire-ember-right {
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

.dark .wildfire-ember-bottom {
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

.dark .wildfire-ember-top {
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

.dark .wildfire-energy-line-1 {
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

.dark .wildfire-energy-line-2 {
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

.dark .wildfire-energy-line-3 {
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

.dark .wildfire-particles {
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
}

/* ===== SPOTLIGHTS FINE ÎN COLȚURI ===== */
.dark .wildfire-spotlight-tl {
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

.dark .wildfire-spotlight-tr {
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

.dark .wildfire-spotlight-bl {
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

.dark .wildfire-spotlight-br {
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

/* Particule energetice mobile */
.dark .wildfire-floating-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}

.dark .wildfire-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 69, 0, 0.6);
  border-radius: 50%;
  filter: blur(1px);
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.4);
}

/* Particula 1 - se mișcă stânga-dreapta */
.dark .wildfire-particle-1 {
  top: 20%;
  left: 10%;
  width: 6px;
  height: 6px;
  background: rgba(255, 85, 0, 0.7);
  animation: moveHorizontal 15s ease-in-out infinite;
}

/* Particula 2 - se mișcă sus-jos */
.dark .wildfire-particle-2 {
  top: 70%;
  right: 15%;
  width: 5px;
  height: 5px;
  background: rgba(255, 100, 0, 0.7);
  animation: moveVertical 12s ease-in-out infinite;
}

/* Particula 3 - se mișcă în diagonală */
.dark .wildfire-particle-3 {
  top: 40%;
  left: 60%;
  width: 7px;
  height: 7px;
  background: rgba(255, 69, 0, 0.8);
  animation: moveDiagonal 18s ease-in-out infinite;
}

/* Particula 4 - mișcare circulară */
.dark .wildfire-particle-4 {
  bottom: 25%;
  left: 30%;
  width: 4px;
  height: 4px;
  background: rgba(255, 140, 0, 0.6);
  animation: moveCircle 20s linear infinite;
}

/* Particula 5 - zig-zag */
.dark .wildfire-particle-5 {
  top: 15%;
  right: 40%;
  width: 5px;
  height: 5px;
  background: rgba(255, 68, 0, 0.7);
  animation: moveZigZag 14s ease-in-out infinite;
}

/* Particula 6 - valuri */
.dark .wildfire-particle-6 {
  bottom: 40%;
  left: 70%;
  width: 6px;
  height: 6px;
  background: rgba(255, 85, 0, 0.6);
  animation: moveWave 16s ease-in-out infinite;
}

/* Particula 7 - bounce */
.dark .wildfire-particle-7 {
  top: 80%;
  left: 10%;
  width: 4px;
  height: 4px;
  background: rgba(255, 69, 0, 0.7);
  animation: moveBounce 10s ease-in-out infinite;
}

/* Particula 8 - spirală */
.dark .wildfire-particle-8 {
  top: 30%;
  right: 20%;
  width: 5px;
  height: 5px;
  background: rgba(255, 100, 0, 0.7);
  animation: moveSpiral 22s linear infinite;
}

/* Animații diverse */
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

/* Animații */
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

/* Efect la hover pe logo */
.dark .wildfire-logo-container:hover ~ .wildfire-bg .wildfire-ember-left {
  opacity: 0.7;
  transition: all 0.5s ease;
}

.dark .wildfire-logo-container:hover ~ .wildfire-bg .wildfire-ember-right {
  opacity: 0.65;
  transition: all 0.5s ease;
}

.dark .wildfire-logo-container:hover ~ .wildfire-bg .wildfire-energy-line-1 {
  opacity: 0.5;
  transition: all 0.5s ease;
}

.dark .wildfire-logo-container:hover ~ .wildfire-bg .wildfire-spotlight-tl {
  opacity: 0.5;
  transition: all 0.5s ease;
}

.dark .wildfire-logo-container:hover ~ .wildfire-bg .wildfire-spotlight-tr {
  opacity: 0.45;
  transition: all 0.5s ease;
}

.dark .wildfire-logo-container:hover ~ .wildfire-bg .wildfire-spotlight-bl {
  opacity: 0.4;
  transition: all 0.5s ease;
}

.dark .wildfire-logo-container:hover ~ .wildfire-bg .wildfire-spotlight-br {
  opacity: 0.42;
  transition: all 0.5s ease;
}

.scroll-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 15%,
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.1s ease;
  opacity: 0;
}

.dark .scroll-overlay {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 15%,
    rgba(0, 0, 0, 0.95) 40%,
    rgba(0, 0, 0, 0.98) 70%,
    rgba(0, 0, 0, 1) 100%
  );
}

.wildfire-home .wildfire-hero {
  position: relative;
  z-index: 10;
  width: 100%;
  transform: translateZ(0);
}

.wildfire-home .wildfire-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.community-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 5px 12px 5px 10px;
  background: rgba(255, 69, 0, 0.04);
  border: 1px solid rgba(255, 69, 0, 0.18);
  border-radius: 8px;
  font-size: 12px;
  opacity: 0;
  animation: fadeIn 0.4s ease 0.2s forwards;
}

.community-tag::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.7);
  flex-shrink: 0;
  animation: liveDot 2.2s ease-in-out infinite;
}

@keyframes liveDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(0.85); }
}

.dark .community-tag {
  background: rgba(255, 69, 0, 0.08);
  border-color: rgba(255, 69, 0, 0.25);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tag-badge {
  color: #ff4500;
  font-weight: 700;
}

.tag-year {
  color: var(--vp-c-text-2);
}

.wildfire-home .wildfire-logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  width: 150px;
  height: 150px;
  cursor: pointer;
}

.wildfire-home .wildfire-logo-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 69, 0, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(25px);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.wildfire-home .wildfire-logo-glow.boom-active {
  animation: boomGlow 0.5s ease-out forwards;
}

@keyframes boomGlow {
  0% { opacity: 0; transform: scale(1); }
  40% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1); }
}

.logo-boom-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 69, 0, 0.4);
  border-radius: 50%;
  opacity: 0;
  transform: scale(1);
  pointer-events: none;
  z-index: 2;
}

.logo-boom-ring.boom-active {
  animation: boomRing 0.5s ease-out forwards;
  animation-delay: calc(0.05s * var(--i));
}

@keyframes boomRing {
  0% { opacity: 0; transform: scale(1); border-width: 2px; }
  40% { opacity: 0.5; transform: scale(1.3); border-width: 1.5px; }
  100% { opacity: 0; transform: scale(1); border-width: 1px; }
}

.wildfire-home .wildfire-logo {
  width: 140px;
  height: 140px;
  object-fit: contain;
  position: relative;
  z-index: 3;
  cursor: pointer;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  opacity: 0;
}

.logo-start {
  animation: startSpin 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes startSpin {
  0% { transform: scale(0.2) rotate(-360deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(25deg); opacity: 1; }
  80% { transform: scale(0.95) rotate(-5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.wildfire-home .wildfire-logo.boom-active {
  animation: logoBoom 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes logoBoom {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.2) rotate(15deg); }
  50% { transform: scale(1.25) rotate(-10deg); }
  75% { transform: scale(1.05) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.wildfire-home .wildfire-logo:hover {
  animation: logoHover 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 1 !important;
}

@keyframes logoHover {
  0% { transform: scale(1) rotate(0deg); }
  40% { transform: scale(1.15) rotate(12deg); }
  70% { transform: scale(1.05) rotate(-4deg); }
  100% { transform: scale(1.1) rotate(3deg); }
}

/* Titlu cu litere mari */
.wildfire-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-align: center;
  display: inline-block;
  text-transform: uppercase;
}

/* Culori pentru typing */
.wild-white {
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.fire-orange {
  color: #ff4500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dot-orange {
  color: #ff4500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.ro-orange {
  color: #ff4500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.docs-white {
  color: #f0f0f0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

/* Gradient pentru FIRE după typing */
.fire-gradient-text {
  background: linear-gradient(
    135deg,
    #ff4500 0%,
    #ff5722 30%,
    #ff4500 70%,
    #ff5722 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fireFlicker 8s ease-in-out infinite;
  text-shadow: 0 0 5px rgba(255, 69, 0, 0.3);
  position: relative;
  display: inline-block;
}

.fire-gradient-text::after {
  content: 'FIRE';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 69, 0, 0.15) 0%,
    rgba(255, 87, 34, 0.15) 50%,
    rgba(255, 69, 0, 0.15) 100%
  );
  filter: blur(6px);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  z-index: -1;
  animation: fireGlow 8s ease-in-out infinite;
}

/* Gradient pentru RO după typing */
.ro-gradient-text {
  background: linear-gradient(
    135deg,
    #ff4500 0%,
    #ff5722 30%,
    #ff4500 70%,
    #ff5722 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: roFlicker 8s ease-in-out infinite;
  text-shadow: 0 0 5px rgba(255, 69, 0, 0.3);
  position: relative;
  display: inline-block;
}

.ro-gradient-text::after {
  content: 'RO';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 69, 0, 0.15) 0%,
    rgba(255, 87, 34, 0.15) 50%,
    rgba(255, 69, 0, 0.15) 100%
  );
  filter: blur(6px);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  z-index: -1;
  animation: roGlow 8s ease-in-out infinite;
}

@keyframes fireFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

@keyframes roFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

@keyframes fireGlow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.3; }
}

@keyframes roGlow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.3; }
}

.dark .wild-white,
.dark .docs-white {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.dark .fire-orange,
.dark .dot-orange,
.dark .ro-orange {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.dark .fire-gradient-text {
  text-shadow: 0 0 20px rgba(255, 69, 0, 0.7);
}

.dark .ro-gradient-text {
  text-shadow: 0 0 10px rgba(255, 69, 0, 0.4);
}

.feature-badges {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  opacity: 0;
  animation: fadeIn 0.4s ease 0.5s forwards;
}

.feature-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(255, 69, 0, 0.04);
  border: 1px solid rgba(255, 69, 0, 0.18);
  border-radius: 8px;
  font-size: 12px;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.feature-badge:hover {
  border-color: rgba(255, 69, 0, 0.5);
  background: rgba(255, 69, 0, 0.08);
  transform: translateY(-2px);
}

.feature-icon {
  color: #ff4500;
  font-size: 14px;
}

.feature-text {
  color: var(--vp-c-text-1);
}

.wildfire-button-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  opacity: 0;
  animation: fadeIn 0.4s ease 0.6s forwards;
}

.wildfire-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: #ff4500;
  padding: 11px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.25s ease;
  border: 1px solid rgba(255, 69, 0, 0.4);
}

.wildfire-button:hover {
  background: rgba(255, 69, 0, 0.08);
  border-color: #ff4500;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 69, 0, 0.18);
  gap: 16px;
}

.wildfire-button-arrow {
  font-size: 16px;
  transition: transform 0.2s ease;
}

.wildfire-button:hover .wildfire-button-arrow {
  transform: translateX(4px);
}

/* ===== SEARCHBAR STYLING ===== */
.home-search {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
  opacity: 0;
  animation: fadeIn 0.4s ease 0.7s forwards;
  position: relative;
}

.home-search-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  padding: 11px 18px;
  background: #ffffff;
  border: 1px solid rgba(255, 69, 0, 0.22);
  border-radius: 10px;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 46px;
}

.home-search-button:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 69, 0, 0.55);
  box-shadow: 0 6px 18px rgba(255, 69, 0, 0.12);
}

.dark .home-search-button {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 69, 0, 0.2);
  color: #ffffff;
}

.dark .home-search-button:hover {
  border-color: rgba(255, 69, 0, 0.5);
  box-shadow: 0 6px 18px rgba(255, 69, 0, 0.15);
}

.search-icon {
  width: 15px;
  height: 15px;
  margin-right: 6px;
  filter: brightness(0.3);
}

.dark .search-icon {
  filter: brightness(0) invert(1);
}

.home-search-text {
  flex: 1;
  text-align: left;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
  display: flex;
  align-items: center;
}

.home-search-shortcut {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 5px;
  margin-left: 6px;
  background: #f0f0f0;
  color: #333333;
  border: 1px solid #dddddd;
}

.dark .home-search-shortcut {
  background: #2a2a2a;
  color: #ffffff;
  border: none;
}

.home-search-button:hover .home-search-shortcut {
  background: #ff4500;
  color: #ffffff;
  border-color: #ff4500;
}

.last-updates-wrapper {
  width: 100%;
  margin-bottom: 30px;
}

/* Secțiunea pentru WikiUpdatesGrid */
.updates-grid-section {
  width: 100%;
  margin: 40px 0;
}

/* ===== EFFECT DE TYPING ===== */
.typing-text {
  position: relative;
  display: inline-block;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #ff4500;
  margin-left: 2px;
  animation: blink 0.8s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.typing-complete .cursor {
  display: none;
}

.reveal-element {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-element.revealed {
  opacity: 1;
  transform: translateY(0);
}

.last-updates-wrapper.revealed {
  transition-delay: 0.4s;
}

.updates-grid-section.revealed {
  transition-delay: 0.3s;
}

.delayed-tag {
  opacity: 0;
  animation: fadeInTag 0.5s ease 0.8s forwards;
}

@keyframes fadeInTag {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.scroll-indicator {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  gap: 12px;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.scroll-indicator.scroll-visible {
  opacity: 1;
  pointer-events: auto;
}

.scroll-line {
  width: 2px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.scroll-progress {
  width: 100%;
  background: #ff4500;
  transition: height 0.1s ease;
  border-radius: 2px;
}

.scroll-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scroll-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.scroll-dot:hover,
.scroll-dot.active {
  opacity: 1;
}

.scroll-dot .dot {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.scroll-dot.active .dot {
  background: #ff4500;
  box-shadow: 0 0 10px #ff4500;
  transform: scale(1.2);
}

.scroll-dot .dot-label {
  font-size: 11px;
  color: white;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.scroll-dot:hover .dot-label,
.scroll-dot.active .dot-label {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 1024px) {
  .scroll-indicator {
    display: none;
  }
}

@media (max-width: 768px) {
  .wildfire-home {
    padding: 80px 20px 60px;
  }
  
  .wildfire-title {
    font-size: 42px;
  }
}

@media (max-width: 480px) {
  .wildfire-home {
    padding: 70px 16px 50px;
  }
  
  .wildfire-title {
    font-size: 32px;
  }
  
  .home-search-button {
    width: 44px !important;
    min-width: 44px !important;
    max-width: 44px !important;
    padding: 0;
    justify-content: center;
    height: 44px;
  }
  
  .home-search-text,
  .home-search-shortcut {
    display: none;
  }
  
  .search-icon {
    margin-right: 0;
  }
}
</style>