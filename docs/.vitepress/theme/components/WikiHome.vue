<template>
  <div v-if="!isMounted && isHomePage" class="wf-home-placeholder" aria-hidden="true"></div>
  <main v-if="isMounted && isHomePage" class="wf-home" :class="{ 'wf-home--light': !isDark }">
    <HomeNavbar v-if="isHomePage" />
    <CS2Background :scrollOpacity="scrollFade" :isDark="isDark" />
    <ScrollSpy :sections="spySections" />

    <!-- ============ HERO SECTION ============ -->
    <section id="hero" class="wf-section wf-hero">
      <div ref="heroContainer" class="wf-container wf-hero-split">
        <!-- LEFT COLUMN: Logo & Title -->
        <div class="wf-hero-split__left">
          <div class="wf-hero-split__left-inner">
          <!-- Logo with Liquid Metal shader -->
          <div class="wf-hero__logo">
            <LiquidMetalLogo
              class="wf-hero__logo-shader"
              :width="350"
              :height="350"
              image="/icons/wildfire.png"
              colorBack="#00000000"
              colorTint="#ff7800a6"
              shape="none"
              :repetition="2"
              :softness="0.1"
              :shiftRed="0.3"
              :shiftBlue="0.3"
              :distortion="0.07"
              :contour="0.4"
              :angle="70"
              :speed="1"
              :scale="0.6"
              fit="contain"
            />
          </div>

          <!-- Title -->
          <h1 class="wf-hero__title orbitron-font anim-item notranslate" data-anim="slide-up" data-delay="100">
            <span class="t-white">Wild</span><span class="t-fire">Fire</span><span class="t-docs"><Icon icon="mdi:book-open-page-variant" width="14" height="14" style="vertical-align: -1px; margin-right: 4px;" />DOCS</span>
          </h1>

          <!-- Subtitle -->
          <div class="wf-hero-float wf-hero-float--sub">
            <p class="wf-hero__sub orbitron-font anim-item" data-anim="slide-up" data-delay="200">
              Documentation for the ones who build in the ashes
            </p>
          </div>

          <!-- Search bar -->
          <div class="wf-hero-float wf-hero-float--search" style="width: 100%; max-width: 440px; z-index: 20;">
            <div class="wf-search-wrapper anim-item" data-anim="slide-up" data-delay="300" style="width: 100%;">
              <button
                class="wf-search magnetic-btn"
                @click="openSearch"
                ref="searchBtn"
                :style="magneticStyle(searchMag)"
              >
                <svg class="wf-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span class="wf-search__text">Search documentation...</span>
                <kbd class="wf-search__kbd">Ctrl K</kbd>
              </button>
            </div>
          </div>

          <!-- CTA row -->
          <div class="wf-hero__actions anim-item" data-anim="slide-up" data-delay="400">
            <div class="wf-hero-float wf-hero-float--btn1">
              <a
                href="/informatii/about"
                class="wf-btn wf-btn--primary magnetic-btn"
                ref="ctaBtn"
                :style="magneticStyle(ctaMag)"
              >
                <Icon icon="mdi:book-open-page-variant" width="18" height="18" />
                Read
              </a>
            </div>
            <div class="wf-hero-float wf-hero-float--btn2">
              <a
                href="https://discord.gg/wildfire"
                target="_blank"
                class="wf-btn wf-btn--ghost magnetic-btn"
                ref="discordBtn"
                :style="magneticStyle(discordMag)"
              >
                About
              </a>
            </div>
          </div>

          <!-- Scroll hint -->
          <div class="wf-hero__scroll-hint anim-item" data-anim="slide-up" data-delay="500" :class="{ 'fade-out': scrollY > 100 }">
            <span class="wf-hero__scroll-text">SCROLL</span>
            <div class="wf-hero__scroll-mouse">
              <div class="wf-hero__scroll-wheel"></div>
            </div>
          </div>
          </div> <!-- End inner container -->
        </div>

        <!-- DIVIDER LINE: REMOVED FOR CLEAN NEGATIVE SPACE -->
        
        <!-- RIGHT COLUMN: Last Updates Panel -->
        <div class="wf-hero-split__right anim-item" data-anim="slide-right" data-delay="500">
          <div class="wf-hero-split__right-panel">
            <LastUpdates />
          </div>
        </div>
      </div>
    </section>

    <!-- Divider -->
    <div class="wf-divider"><span class="wf-divider__line"></span></div>

    <!-- ============ 2. QUICK START — STAGGERED CARDS ============ -->
    <section id="quickstart" class="wf-section wf-quickstart">
      <div class="wf-container">
        <div class="wf-section-label anim-item" data-anim="slide-up">
          <span class="wf-section-label__line"></span>
          <span class="wf-section-label__text orbitron-font">QUICK START</span>
          <span class="wf-section-label__line"></span>
        </div>
        <h2 class="wf-section__title orbitron-font anim-item" data-anim="slide-up">Incepe in cateva <span class="wf-accent">secunde</span></h2>
        <p class="wf-section__desc anim-item" data-anim="slide-up">Tot ce ai nevoie pentru a naviga documentatia Wildfire</p>

        <div class="qs-grid">
          <div
            v-for="(qs, i) in quickstartCards"
            :key="i"
            class="qs-card anim-item"
            :data-anim="i % 2 === 0 ? 'slide-left' : 'slide-right'"
            :data-delay="i * 100"
          >
            <div class="qs-card__top">
              <span class="qs-card__num orbitron-font">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="qs-card__icon" v-html="qs.icon"></span>
            </div>
            <h3 class="qs-card__title orbitron-font">{{ qs.title }}</h3>
            <p class="qs-card__desc">{{ qs.desc }}</p>
            <div class="qs-card__img" data-fluid-lightbox>
              <img :src="qs.img" :alt="qs.title" loading="lazy" decoding="async" width="400" height="225" />
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- Divider -->
    <div class="wf-divider"><span class="wf-divider__line"></span></div>

    <!-- ============ 3. WHY WIKI ============ -->
    <section id="features" class="wf-section wf-features">
      <div class="wf-container">
        <div class="wf-section-label anim-item" data-anim="slide-up">
          <span class="wf-section-label__line"></span>
          <span class="wf-section-label__text orbitron-font">FEATURES</span>
          <span class="wf-section-label__line"></span>
        </div>
        <h2 class="wf-section__title orbitron-font anim-item" data-anim="slide-up">De ce <span class="wf-accent">Wiki?</span></h2>
        <p class="wf-section__desc anim-item" data-anim="slide-up">Tot ce trebuie sa stii despre comunitatea <span class="notranslate">Wildfire.ro</span></p>

        <div class="wf-features__grid">
          <a
            v-for="(card, i) in featureCards"
            :key="i"
            :href="card.href"
            class="wf-card tilt-card anim-item"
            :data-anim="i % 2 === 0 ? 'slide-left' : 'slide-right'"
            :data-delay="i * 80"
            :ref="el => { if (el) tiltRefs[i] = el as HTMLElement }"
            :style="tiltStyle(i)"
          >
            <div class="wf-card__icon" v-html="card.icon"></div>
            <h3 class="wf-card__title orbitron-font">{{ card.title }}</h3>
            <p class="wf-card__desc">{{ card.desc }}</p>
            <span class="wf-card__arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted, watch, nextTick } from 'vue'
import { useData, inBrowser } from 'vitepress' // <-- Am adaugat inBrowser aici!
import { Icon } from '@iconify/vue'
import HomeNavbar from './HomeNavbar.vue'
import LastUpdates from './LastUpdates.vue'
import AboutWiki from './AboutWiki.vue'
import CS2Background from './CS2Background.vue'
import ScrollSpy from './ScrollSpy.vue'
import LiquidMetalLogo from './LiquidMetalLogo.vue'
import NeuroNoiseBg from './NeuroNoiseBg.vue'
import { useMagnetic } from '../composables/useMagnetic'
import { searchState } from '../store'

const { page, isDark } = useData()
const isHomePage = computed(() => page.value.relativePath === 'index.md' || page.value.relativePath === 'index')
const isMounted = ref(false)
const logoStart = ref(false)
const scrollY = ref(0)
const scrollFade = ref(0)

const spySections = [
  { id: 'hero', label: 'Hero' },
  { id: 'updates', label: 'Updates' },
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'features', label: 'Why Wiki' },
]

// Magnetic buttons
const searchBtn = ref<HTMLElement | null>(null)
const ctaBtn = ref<HTMLElement | null>(null)
const discordBtn = ref<HTMLElement | null>(null)
const searchMag = useMagnetic(searchBtn, 0.2)
const ctaMag = useMagnetic(ctaBtn, 0.25)
const discordMag = useMagnetic(discordBtn, 0.25)

const magneticStyle = (mag: { x: { value: number }; y: { value: number } }) => ({
  transform: `translate(${mag.x.value}px, ${mag.y.value}px)`
})

// Tilt cards
const tiltRefs = reactive<Record<number, HTMLElement>>({})
const tiltRects = reactive<Record<number, DOMRect>>({})
const tiltData = reactive<Record<number, { rx: number; ry: number }>>({})

const handleTiltMove = (i: number, e: MouseEvent) => {
  const el = tiltRefs[i]
  if (!el) return
  if (!tiltRects[i]) tiltRects[i] = el.getBoundingClientRect()
  const rect = tiltRects[i]
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  tiltData[i] = { rx: -py * 6, ry: px * 6 }
}
const handleTiltLeave = (i: number) => { 
  tiltData[i] = { rx: 0, ry: 0 }
  delete tiltRects[i]
}

const tiltStyle = (i: number) => {
  const d = tiltData[i] || { rx: 0, ry: 0 }
  return { transform: `perspective(800px) rotateX(${d.rx}deg) rotateY(${d.ry}deg)` }
}

// Typing effects
const aboutWikiRef = ref<InstanceType<typeof AboutWiki> | null>(null)
const startWikiTyping = ref(false)

const displayTitle = ref('')
const displayTitleArray = computed(() => displayTitle.value.split(''))
const titleTyped = ref(false)
const titleOriginal = 'WILDFIRE.RO DOCS'

const getCharClass = (index: number) => {
  if (index < 4) return 't-white'
  if (index < 8) return 't-fire-typing'
  if (index === 8) return 't-dot'
  if (index < 11) return 't-ro-typing'
  return 't-docs'
}

const featureBadges = [
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 21h1v-2.5H21v-1h-2.5V15h-1v2.5H15v1h2.5zm.5 2q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M7 9h10V7H7zm4.675 12H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v6.7q-.725-.35-1.463-.525T18 11q-.275 0-.513.012t-.487.063V11H7v2h6.125q-.45.425-.812.925T11.675 15H7v2h4.075q-.05.25-.062.488T11 18q0 .825.15 1.538T11.675 21"/></svg>', text: 'Documentatie' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>', text: 'Informatii' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>', text: 'Features' },
]

const quickstartCards = [
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>', title: 'Cauta Rapid', desc: 'Foloseste Ctrl+K pentru a gasi orice pagina din documentatie instant.', img: '/wallpaper/present.png' },
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Contribuitori', desc: 'Documentatia este scrisa si mentinuta de echipa si comunitatea Wildfire.', img: '/wallpaper/contributors.png' },
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>', title: 'Panel Admin', desc: 'Gestioneaza pagini, contribuitori si statistici dintr-un singur dashboard.', img: '/wallpaper/panel.png' },
  { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', title: 'Comunitate', desc: 'Alatura-te pe Discord pentru suport, discutii si events.', img: '/wallpaper/community.png' },
]

const featureCards = [
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', title: 'Regulamente', desc: 'Regulile complete ale serverului, actualizate constant.', href: '/informatii/regulamente/go/regulament-go' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>', title: 'Informatii', desc: 'Ghiduri si tutoriale pentru toti jucatorii noi si vechi.', href: '/informatii/about' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', title: 'Sisteme', desc: 'Descrieri detaliate ale tuturor sistemelor de pe server.', href: '/systems/skins/informatiiws' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>', title: 'Market', desc: 'Shop, Fire Coins, VIP Tiers si tot ce tine de marketplace.', href: '/market/premium-shop/sanks' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>', title: 'Changelog', desc: 'Ultimele actualizari si modificari de pe server.', href: '/updates_wiki/updateswiki' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Echipa', desc: 'Membrii staff-ului si contribuitorii comunitatii.', href: '/updates_wiki/contribute' },
]

const displayBadges = ref(['', '', ''])
const badgesTyped = ref([false, false, false])
const displayButton = ref('')
const buttonTyped = ref(false)
const buttonOriginal = 'Ghid de pornire'
const displaySearchText = ref('')

const searchSuggestions = [
  'Cauta in documentatie...',
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
    await new Promise(r => setTimeout(r, 50))
  }
  titleTyped.value = true
}

const typeButton = async () => {
  for (let i = 0; i <= buttonOriginal.length; i++) {
    displayButton.value = buttonOriginal.substring(0, i)
    await new Promise(r => setTimeout(r, 40))
  }
  buttonTyped.value = true
}

const typeSearchNext = async () => {
  const text = searchSuggestions[currentSuggestionIndex]
  if (displaySearchText.value.length > 0) {
    for (let i = displaySearchText.value.length; i > 0; i--) {
      displaySearchText.value = displaySearchText.value.substring(0, i - 1)
      await new Promise(r => setTimeout(r, 15))
    }
  }
  for (let i = 0; i <= text.length; i++) {
    displaySearchText.value = text.substring(0, i)
    await new Promise(r => setTimeout(r, 25))
  }
  currentSuggestionIndex = (currentSuggestionIndex + 1) % searchSuggestions.length
  searchPauseTimeout = setTimeout(typeSearchNext, 1200)
}

const startTypingEffects = () => {
  setTimeout(() => typeTitle(), 200)
  setTimeout(() => typeButton(), 1400)
  setTimeout(() => { startWikiTyping.value = true }, 2000)
  setTimeout(() => {
    displaySearchText.value = ''
    setTimeout(() => { currentSuggestionIndex = 0; typeSearchNext() }, 150)
  }, 800)
}

const openSearch = (e: MouseEvent) => {
  if (!inBrowser) return // Blocaj SSR
  e.preventDefault()
  e.stopPropagation()
  searchState.open()
}

const toggleDefaultNavbar = (hide: boolean) => {
  if (!inBrowser) return // <--- BLOCAJ SSR CRITIC AICI!
  
  ;['.VPNav', '.VPSidebar', '.VPLocalNav'].forEach(sel => {
    const el = document.querySelector(sel) as HTMLElement | null
    if (el) el.style.display = hide ? 'none' : ''
  })
  const content = document.querySelector('.VPContent') as HTMLElement | null
  if (content) content.style.marginTop = hide ? '0' : ''
}

const triggerBoom = () => {
  if (!inBrowser) return // Blocaj SSR
  const logo = document.querySelector('.wf-hero__logo-shader') as HTMLElement
  if (!logo) return
  logo.classList.add('boom')
  setTimeout(() => logo.classList.remove('boom'), 600)
}

// Scroll-triggered animations (IntersectionObserver)
let observer: IntersectionObserver | null = null

const setupScrollAnimations = () => {
  if (!inBrowser) return // Blocaj SSR
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement
      const delay = parseInt(el.dataset.delay || '0', 10)
      if (entry.isIntersecting) {
        setTimeout(() => {
          el.classList.add('anim-visible')
          if (observer) observer.unobserve(el)
        }, delay)
      }
    })
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' })

  document.querySelectorAll('.anim-item').forEach(el => observer!.observe(el))
}

const attachTiltListeners = () => {
  if (!inBrowser) return // Blocaj SSR
  nextTick(() => {
    Object.entries(tiltRefs).forEach(([key, el]) => {
      if (!el) return
      const i = Number(key)
      el.addEventListener('mousemove', (e: MouseEvent) => handleTiltMove(i, e))
      el.addEventListener('mouseleave', () => handleTiltLeave(i))
    })
  })
}

let scrollRaf = null
const heroContainer = ref<HTMLElement | null>(null)

let lerpedScrollY = 0
let parallaxRaf: number | null = null

const updateParallax = () => {
  if (!inBrowser) return
  
  const targetY = window.scrollY
  const diff = targetY - lerpedScrollY
  
  // Smoothing factor: 0.08 is buttery, 0.15 is snappy
  lerpedScrollY += diff * 0.08
  
  // Stop the loop if we're close enough to the target
  if (Math.abs(diff) < 0.05) {
    lerpedScrollY = targetY
    if (heroContainer.value) heroContainer.value.style.willChange = 'auto'
    parallaxRaf = null
  } else {
    if (heroContainer.value) {
      if (window.innerWidth > 1024) {
        heroContainer.value.style.willChange = 'transform, opacity'
        heroContainer.value.style.transform = `translateY(${-lerpedScrollY * 0.18}px)`
        heroContainer.value.style.opacity = `${Math.max(0, 1 - lerpedScrollY * 0.0015)}`
      } else {
        heroContainer.value.style.transform = 'none'
        heroContainer.value.style.opacity = '1'
      }
    }
    
    const isDarkCurrent = document.documentElement.classList.contains('dark')
    scrollFade.value = isDarkCurrent
      ? Math.min(lerpedScrollY / 500, 0.8)
      : Math.min(lerpedScrollY / 800, 0.5)
      
    parallaxRaf = requestAnimationFrame(updateParallax)
  }
}

const handleScroll = () => {
  if (!inBrowser) return
  scrollY.value = window.scrollY
  if (!parallaxRaf) {
    parallaxRaf = requestAnimationFrame(updateParallax)
  }
}

// WATCHER REPARAT AICI:
watch(isHomePage, (v) => { 
  if (inBrowser) toggleDefaultNavbar(v) 
}, { immediate: true })

onMounted(() => {
  isMounted.value = true
  toggleDefaultNavbar(isHomePage.value)
  setTimeout(() => { logoStart.value = true }, 100)
  startTypingEffects()
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  nextTick(() => {
    setTimeout(setupScrollAnimations, 200)
    setTimeout(attachTiltListeners, 400)
  })
})

onUnmounted(() => {
  if (!inBrowser) return
  toggleDefaultNavbar(false)
  if (searchPauseTimeout) clearTimeout(searchPauseTimeout)
  if (searchTypingTimeout) clearTimeout(searchTypingTimeout)
  window.removeEventListener('scroll', handleScroll)
  observer?.disconnect()
})
</script>

<style scoped>
/* ===== RESETS & BASE ===== */
.wf-home-placeholder {
  min-height: 100vh;
  visibility: hidden;
  pointer-events: none;
}

.wf-home {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  /* cursor: none; — TEMPORARILY DISABLED */
}

/* TEMPORARILY DISABLED
.wf-home *,
.wf-home a,
.wf-home button,
.wf-home input,
.wf-home select,
.wf-home textarea,
.wf-home [role="button"] {
  cursor: none !important;
}
*/

@media (max-width: 1024px) {
  .wf-home,
  .wf-home *,
  .wf-home a,
  .wf-home button,
  .wf-home input,
  .wf-home select,
  .wf-home textarea,
  .wf-home [role="button"] {
    cursor: auto !important;
  }
}

.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.wf-hero__title,
.wf-hero__sub,
.wf-section__title,
.wf-section__desc,
.wf-split__heading,
.wf-split__body,
.wf-card__title,
.wf-card__desc,
.wf-pill,
.wf-badge,
.wf-search,
.wf-btn {
  font-family: 'Orbitron', sans-serif !important;
}

/* ===== LAYOUT ===== */
.wf-section {
  position: relative;
  z-index: 10;
  width: 100%;
}

.wf-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== HERO ===== */
.wf-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 120px 0 100px;
  text-align: center;
  position: relative;
}

.wf-hero .wf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo */
.wf-hero__logo {
  margin-bottom: -50px;
}

.wf-hero__logo-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.wf-hero__logo-shader {
  width: 380px !important;
  height: 380px !important;
  overflow: visible;
}

/* Title */
.wf-hero__title {
  font-family: 'Orbitron', sans-serif !important;
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 0 60px rgba(255, 120, 0, 0.15);
  opacity: 1;
}

.t-white { color: #fff; font-family: 'Orbitron', sans-serif !important; font-weight: 900; }
.t-fire-typing { color: #ff7800; }
.t-dot { color: rgba(255, 255, 255, 0.3); }
.t-ro-typing { color: #ff7800; }
.t-docs {
  display: inline-flex;
  align-items: center;
  font-size: 0.32em;
  font-weight: 700;
  color: #ff7800;
  letter-spacing: 0.15em;
  vertical-align: middle;
  margin-left: 0.4em;
  border: 1px solid rgba(255, 120, 0, 0.35);
  background: rgba(255, 120, 0, 0.08);
  padding: 0.2em 0.5em 0.2em 0.4em;
  border-radius: 6px;
  line-height: 1.4;
  position: relative;
  top: -0.15em;
}

.t-fire {
  color: #ff7800;
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 900;
}

.t-ro {
  background: linear-gradient(135deg, #ff7800 0%, #ff7800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.wf-home--light .t-white { color: #111; }
.wf-home--light .t-docs { color: rgba(0, 0, 0, 0.4); border-color: rgba(0, 0, 0, 0.15); }

/* Subtitle */
.wf-hero__sub {
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(160, 160, 160, 0.8);
  margin: 0 0 40px;
  max-width: 520px;
  letter-spacing: 0.15em;
  font-weight: 400;
  opacity: 1;
}

.wf-home--light .wf-hero__sub {
  color: rgba(0, 0, 0, 0.5);
}

/* Search bar (Premium Liquid Glass Redesign) */
.wf-search {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 440px;
  padding: 14px 24px;
  margin-bottom: 32px;
  
  background: rgba(20, 20, 25, 0.4);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top-color: rgba(255, 120, 0, 0.3);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  
  box-shadow: 
    inset 0 2px 2px rgba(255, 255, 255, 0.1),
    0 8px 24px rgba(0, 0, 0, 0.4);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-search:hover {
  background: rgba(30, 30, 35, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 120, 0, 0.6);
  transform: translateY(-2px);
  color: rgba(255, 255, 255, 1);
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 12px 32px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(255, 120, 0, 0.1);
}

.wf-home--light .wf-search {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.wf-home--light .wf-search:hover {
  border-top-color: #ff7800;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.wf-search__icon {
  flex-shrink: 0;
  color: #ff7800;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.wf-search:hover .wf-search__icon {
  opacity: 1;
  filter: drop-shadow(0 0 8px rgba(255, 120, 0, 0.6));
}

.wf-search__text {
  flex: 1;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-search__kbd {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 120, 0, 0.1);
  border: 1px solid rgba(255, 120, 0, 0.2);
  color: #ff7800;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.wf-home--light .wf-search__kbd {
  background: rgba(255, 120, 0, 0.1);
  border-color: rgba(255, 120, 0, 0.2);
}

.wf-search:hover .wf-search__kbd {
  background: #ff7800;
  color: #fff;
  border-color: #ff7800;
  box-shadow: 0 0 12px rgba(255, 120, 0, 0.4);
}

/* CTA Buttons */
.wf-hero__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 1;
}

.wf-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  border-radius: 40px; 
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  cursor: pointer;
}
/* PROFESSIONAL LIQUID QUARTZ (Subtle Orange Accents) */
.wf-btn--primary {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #fff;
  border: 1px solid rgba(255, 120, 0, 0.4); /* Accent orange border */
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.wf-btn--primary :deep(svg) {
  color: #ff7800; /* Doar iconita ramane orange aprins */
}

.wf-btn--primary:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 120, 0, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}


/* PROFESSIONAL LIQUID GLASS */
.wf-btn--ghost {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.wf-btn--ghost:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  transform: translateY(-1px);
}

/* Scroll hint */
.wf-hero__scroll-hint {
  margin-top: 48px;
  z-index: 10;
  opacity: 1;
  transition: opacity 0.4s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.wf-hero__scroll-hint.fade-out {
  opacity: 0 !important;
}

.wf-hero__scroll-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
}

.wf-hero__scroll-mouse {
  width: 32px;
  height: 50px;
  border: 2.5px solid rgba(255, 120, 0, 0.5);
  border-radius: 16px;
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  background: rgba(0, 0, 0, 0.3);
}

.wf-hero__scroll-wheel {
  width: 4px;
  height: 8px;
  background: rgba(255, 120, 0, 1);
  border-radius: 2px;
  animation: scrollWheel 2.5s ease-in-out infinite;
}

@keyframes scrollWheel {
  0%, 100% { 
    transform: translateY(0); 
    opacity: 1; 
  }
  50% { 
    transform: translateY(10px); 
    opacity: 0.2; 
  }
}

.wf-home--light .wf-hero__scroll-mouse {
  border-color: rgba(255, 120, 0, 0.3);
  background: rgba(255, 255, 255, 0.3);
}

.wf-home--light .wf-hero__scroll-text {
  color: rgba(0, 0, 0, 0.4);
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(0.6); transform-origin: top; }
  50% { opacity: 1; transform: scaleY(1); }
}

/* ===== QUICK START — STAGGERED CARDS ===== */
.wf-quickstart {
  padding: 40px 0;
}

.qs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

.qs-grid > :nth-child(even) {
  margin-top: 48px;
}

.qs-card {
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.qs-card:hover {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.wf-home--light .qs-card {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(0, 0, 0, 0.08);
}

.wf-home--light .qs-card:hover {
  border-color: rgba(255, 120, 0, 0.18);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.qs-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.qs-card__num {
  font-size: 13px;
  font-weight: 700;
  color: #ff7800;
  background: rgba(255, 120, 0, 0.1);
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: 1px;
}

.qs-card__icon {
  color: #ff7800;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.qs-card__icon :deep(svg) {
  stroke: #ff7800;
}

.qs-card__title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  letter-spacing: 0.2px;
}

.qs-card__desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
  opacity: 0.8;
}

.qs-card__img {
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  z-index: 5;
  pointer-events: auto !important;
  cursor: zoom-in !important;
}

.qs-card__img img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.4s ease;
  pointer-events: auto !important;
  cursor: zoom-in !important;
}

.qs-card:hover .qs-card__img img {
  opacity: 1;
  transform: scale(1.03);
}

.wf-home--light .qs-card__img {
  border-color: rgba(0, 0, 0, 0.06);
}

.qs-row {
  margin-top: 56px;
}

@media (max-width: 640px) {
  .qs-grid {
    grid-template-columns: 1fr;
  }
  .qs-grid > :nth-child(even) {
    margin-top: 0;
  }
  .qs-row {
    margin-top: 40px;
  }
}

/* ===== FEATURE CARDS SECTION ===== */
.wf-features {
  padding: 40px 0 40px;
}

.wf-updates {
  padding: 20px 0 20px;
}

/* ===== SECTION DIVIDER ===== */
.wf-divider {
  display: flex;
  justify-content: center;
  padding: 32px 0;
  position: relative;
  z-index: 10;
}

.wf-divider__line {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 10%, rgba(255, 120, 0, 0.06) 35%, rgba(255, 120, 0, 0.1) 50%, rgba(255, 120, 0, 0.06) 65%, transparent 90%);
}

.wf-section__title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 700;
  margin: 0 0 10px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-1);
}

.wf-section__title::after {
  display: none;
}

.wf-section__desc {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: center;
  margin: 0 0 36px;
  opacity: 0.7;
  letter-spacing: 0.3px;
}

.wf-features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.wf-card {
  position: relative;
  padding: 32px 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  /* Reduced GPU memory usage */
  overflow: hidden;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

.wf-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-4px);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.wf-home--light .wf-card {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(0, 0, 0, 0.08);
}

.wf-home--light .wf-card:hover {
  border-color: rgba(255, 120, 0, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.wf-card__icon {
  color: #ff7800;
  margin-bottom: 16px;
  display: flex;
}

.wf-card__title {
  font-family: 'Orbitron', sans-serif;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  letter-spacing: 0.3px;
}

.wf-card__desc {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
  letter-spacing: 0.2px;
}

.wf-card__arrow {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 18px;
  color: rgba(255, 120, 0, 0.4);
  transition: transform 0.3s ease, color 0.3s ease;
}

.wf-card:hover .wf-card__arrow {
  transform: translateX(4px);
  color: #ff7800;
}

/* ===== SPLIT SECTION ===== */
.wf-split {
  padding: 40px 0;
}

.wf-split__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.wf-split__inner--reverse {
  direction: rtl;
}

.wf-split__inner--reverse > * {
  direction: ltr;
}

.wf-pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  background: rgba(255, 120, 0, 0.06);
  color: #ff7800;
  border: 1px solid rgba(255, 120, 0, 0.15);
  margin-bottom: 14px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* ===== SECTION LABEL (wildfire.ro style) ===== */
.wf-section-label {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  justify-content: center;
}

.wf-split .wf-section-label {
  justify-content: flex-start;
}

.wf-section-label__line {
  width: 32px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff7800);
  flex-shrink: 0;
}

.wf-section-label__line:last-child {
  background: linear-gradient(90deg, #ff7800, transparent);
}

.wf-section-label__text {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3.5px;
  color: #ff7800;
  text-transform: uppercase;
  white-space: nowrap;
}

.wf-accent {
  color: #ff7800;
}

.wf-split__heading {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 700;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
  letter-spacing: 0.3px;
}

.wf-split__body {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
  opacity: 0.8;
  letter-spacing: 0.2px;
}

.wf-split__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.wf-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--vp-c-text-2);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.wf-badge:hover {
  border-color: rgba(255, 120, 0, 0.3);
  transform: translateY(-1px);
}

.wf-home--light .wf-badge {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.wf-badge__icon {
  color: #ff7800;
  display: flex;
}

/* Preview frame */
.wf-preview-frame {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.wf-preview-frame:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

.wf-home--light .wf-preview-frame {
  border-color: rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
}

.wf-preview-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* ===== UPDATES SECTION (compact) ===== */
.wf-updates {
  padding: 24px 0 32px;
}

.wf-updates__panel {
  position: relative;
  border-radius: 16px;
  padding: 28px 24px 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: none;
  overflow: hidden;
}

.wf-updates__panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff7800, #ff7800, transparent);
  opacity: 0.6;
}

.wf-home--light .wf-updates__panel {
  background: rgba(255, 255, 255, 0.5);
}

.wf-home--light .wf-updates__panel::before {
  opacity: 0.4;
}

/* ===== CURSOR ===== */
.wf-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: #ff7800;
  margin-left: 2px;
  animation: cursorBlink 0.8s infinite;
  vertical-align: middle;
}

.typing-complete .wf-cursor {
  display: none;
}

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* ===== SCROLL ANIMATIONS ===== */
.anim-item {
  opacity: 0;
  transition: opacity 3s cubic-bezier(0.16, 1, 0.3, 1),
              transform 3s cubic-bezier(0.16, 1, 0.3, 1);
  /* Removed will-change to save GPU memory */
}

.anim-item[data-anim="slide-up"] {
  transform: translateY(50px) scale(0.97);
}

.anim-item[data-anim="slide-down"] {
  transform: translateY(-50px) scale(0.97);
}

.anim-item[data-anim="slide-left"] {
  transform: translateX(-50px) scale(0.97);
}

.anim-item[data-anim="slide-right"] {
  transform: translateX(50px) scale(0.97);
}

.anim-item.anim-visible {
  opacity: 1;
  transform: translate(0, 0) scale(1) !important;
}

/* ===== GENERIC ANIMATIONS ===== */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .wf-features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .wf-split__inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .wf-split__inner--reverse {
    direction: ltr;
  }
  .wf-hero__title {
    font-size: 40px;
  }
}

@media (max-width: 640px) {
  .wf-features__grid {
    grid-template-columns: 1fr;
  }
  .wf-hero__title {
    font-size: 32px;
  }
  .wf-hero__sub {
    font-size: 15px;
  }
  .wf-hero__actions {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
  .wf-btn {
    width: 100%;
    justify-content: center;
  }
  .wf-search {
    max-width: 100%;
  }
  .wf-section__title {
    font-size: 26px;
  }
  .wf-split__heading {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .wf-hero {
    padding: 60px 0 30px;
  }
  .wf-hero__title {
    font-size: 28px;
  }
  .wf-search__text,
  .wf-search__kbd {
    display: none;
  }
  .wf-search {
    max-width: 48px;
    padding: 12px;
    justify-content: center;
  }
}

/* ===== HERO SPLIT LAYOUT ===== */
.wf-hero-split.wf-container {
  display: flex;
  flex-direction: row !important; /* Force side-by-side */
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1150px !important; /* Aligns properly with Navbar */
  margin: 0 auto;
  gap: 80px;
  padding: 0 20px;
}

/* LEFT SIDE */
.wf-hero-split__left {
  position: relative;
  flex: 1;
  max-width: 450px;
  perspective: 1200px;
}

.wf-hero-split__left-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  transform: rotateY(12deg) rotateX(4deg); /* Much stronger 3D effect */
  transform-style: preserve-3d;
  backface-visibility: hidden; /* Prevents text blur */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
}

.wf-hero-split__left:hover .wf-hero-split__left-inner {
  transform: rotateY(4deg) rotateX(1deg); /* Flattens interactively on hover */
}

/* 3D Pop-out effects for internal elements */
@keyframes floatZ-logo {
  0%, 100% { transform: translateZ(50px); }
  50% { transform: translateZ(70px) translateY(-5px); }
}
@keyframes floatZ-title-1 {
  0%, 100% { transform: translateZ(40px); }
  50% { transform: translateZ(55px); }
}
@keyframes floatZ-title-2 {
  0%, 100% { transform: translateZ(35px); }
  50% { transform: translateZ(45px); }
}
@keyframes floatZ-title-3 {
  0%, 100% { transform: translateZ(45px); }
  50% { transform: translateZ(60px); }
}
@keyframes floatZ-sub {
  0%, 100% { transform: translateZ(25px); }
  50% { transform: translateZ(35px); }
}
@keyframes floatZ-search {
  0%, 100% { transform: translateZ(30px); }
  50% { transform: translateZ(45px); }
}
@keyframes floatZ-btn-1 {
  0%, 100% { transform: translateZ(20px); }
  50% { transform: translateZ(30px); }
}
@keyframes floatZ-btn-2 {
  0%, 100% { transform: translateZ(10px); }
  50% { transform: translateZ(20px); }
}
@keyframes floatZ-hint {
  0%, 100% { transform: translateZ(5px); }
  50% { transform: translateZ(15px); }
}

.wf-hero-split__left-inner .wf-hero__logo {
  animation: floatZ-logo 6s ease-in-out infinite;
}

.wf-hero-split__left-inner .wf-hero__title {
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero__title .t-white {
  display: inline-block;
  animation: floatZ-title-1 4.5s ease-in-out infinite 0.2s;
}

.wf-hero-split__left-inner .wf-hero__title .t-fire {
  display: inline-block;
  animation: floatZ-title-2 5s ease-in-out infinite 0.5s;
}

.wf-hero-split__left-inner .wf-hero__title .t-docs {
  display: inline-flex;
  animation: floatZ-title-3 5.5s ease-in-out infinite 0.8s;
}

.wf-hero-split__left-inner .wf-hero-float--sub {
  animation: floatZ-sub 5.5s ease-in-out infinite 1s;
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero-float--search {
  animation: floatZ-search 4.5s ease-in-out infinite 1.5s;
  z-index: 20;
  transform-style: preserve-3d;
  width: 100%;
}

.wf-hero-split__left-inner .wf-hero__actions {
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero-float--btn1 {
  animation: floatZ-btn-1 4.8s ease-in-out infinite 0.3s;
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero-float--btn2 {
  animation: floatZ-btn-2 5.2s ease-in-out infinite 0.9s;
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero__scroll-hint {
  animation: floatZ-hint 6s ease-in-out infinite 1.2s;
}

.wf-hero-split__left::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 120, 0, 0.08) 0%, transparent 60%);
  z-index: -1;
  pointer-events: none;
}

.wf-hero-split__left .wf-hero__logo {
  margin-left: 0;
  margin-bottom: -10px;
  margin-top: -40px;
  align-self: center; /* Centers the logo over the title */
}

.wf-hero-split__left .wf-hero__logo-shader {
  width: 350px !important;
  height: 350px !important;
}

.wf-hero-split__left .wf-hero__title {
  text-align: left;
}

.wf-hero-split__left .wf-hero__sub {
  text-align: left;
  margin-bottom: 40px;
}

.wf-hero-split__left .wf-hero__actions {
  justify-content: center;
  align-self: center;
  width: 100%;
}

.wf-hero-split__left .wf-hero__scroll-hint {
  align-items: center;
  align-self: center;
  margin-top: 50px;
}

/* RIGHT SIDE PANEL */
.wf-hero-split__right {
  flex: 1.6;
  max-width: 750px;
  perspective: 1200px;
  margin-right: -100px; /* Push to the right so tags are fully visible */
}

.wf-hero-split__right-panel {
  width: 100%;
  padding: 16px 24px; /* Reduced padding for a tighter fit */
  background: rgba(20, 20, 25, 0.25); /* Extra translucent */
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.15), 
    0 20px 40px rgba(0, 0, 0, 0.4);
  transform: scale(0.88) rotateY(-4deg) rotateX(2deg); /* Restored scale so internal layout is not squished */
  transform-style: preserve-3d;
  backface-visibility: hidden; /* Fix for Webkit text blur during 3D scale */
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-hero-split__right-panel:hover {
  transform: scale(0.92) rotateY(0deg) rotateX(0deg) translateY(-5px);
  background: rgba(30, 30, 35, 0.35);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 
    inset 0 1px 3px rgba(255, 255, 255, 0.25), 
    0 30px 60px rgba(0, 0, 0, 0.6), 
    0 0 40px rgba(255, 120, 0, 0.08);
}

.wf-home--light .wf-hero-split__right-panel {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 120, 0, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.wf-home--light .wf-hero-split__right-panel:hover {
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Adjust Last Updates inside Split */
.wf-hero-split__right :deep(.lu-grid) {
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 24px;
}
.wf-hero-split__right :deep(.lu-title) {
  text-align: left;
  justify-content: flex-start;
  font-size: 24px;
}
.wf-hero-split__right :deep(.lu-desc) {
  text-align: left;
}
.wf-hero-split__right :deep(.lu-section-label) {
  justify-content: flex-start;
}

@media (max-width: 1024px) {
  .wf-hero-split.wf-container {
    display: flex;
    flex-direction: column !important;
    text-align: center;
    gap: 40px;
  }
  .wf-hero-split__left,
  .wf-hero-split__left-inner {
    align-items: center;
    text-align: center;
  }
  .wf-hero-split__left-inner .wf-search-wrapper {
    display: flex;
    justify-content: center;
  }
  .wf-hero-split__left .wf-hero__logo {
    margin-left: 0;
    align-self: center;
  }
  
  /* Reset 3D transforms for mobile */
  .wf-hero-split__left-inner,
  .wf-hero-split__left:hover .wf-hero-split__left-inner,
  .wf-hero-split__right-panel,
  .wf-hero-split__right-panel:hover {
    transform: none !important;
  }
  .wf-hero-split__left-inner > * {
    transform: none !important;
  }
  .wf-hero-split__right {
    margin-right: 0;
    max-width: 100%;
  }
  .wf-hero-split__left .wf-hero__logo-shader {
    width: 200px !important;
    height: 200px !important;
  }
  .wf-hero-split__left .wf-hero__title,
  .wf-hero-split__left .wf-hero__sub {
    text-align: center;
  }
  .wf-hero-split__left .wf-hero__actions {
    justify-content: center;
  }
  .wf-hero__scroll-hint {
    display: none; /* Hide on mobile */
  }
  .wf-hero-split__right {
    margin-right: 0;
    max-width: 100%;
  }
  .wf-hero-split__right-panel {
    transform: none !important;
    padding: 20px;
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .wf-home--light .wf-hero-split__right-panel {
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .wf-hero-split__right :deep(.lu-title),
  .wf-hero-split__right :deep(.lu-desc),
  .wf-hero-split__right :deep(.lu-section-label) {
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .wf-hero-split__right :deep(.lu-grid) {
    grid-template-columns: 1fr !important;
  }
}
</style>
