<template>
  <div v-if="!isMounted && isHomePage" class="wf-home-placeholder" aria-hidden="true"></div>
  <main v-if="isMounted && isHomePage" class="wf-home" :class="{ 'wf-home--light': !isDark }">
    <HomeNavbar v-if="isHomePage" />
    <CS2Background :isDark="isDark" />
    <ScrollSpy :sections="spySections" />

    <!-- ============ HERO SECTION ============ -->
    <section id="hero" class="wf-section wf-hero">
      <div ref="heroContainer" class="wf-container wf-hero-split">
        <!-- LEFT COLUMN: Logo & Title -->
        <div class="wf-hero-split__left">
          <div class="wf-hero-split__left-inner">
          <!-- Logo with Liquid Metal shader -->
          <div class="wf-hero__logo">
            <Suspense>
              <template #default>
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
              </template>
              <template #fallback>
                <img src="/icons/wildfire.webp" width="180" height="180" alt="Wildfire" class="wf-hero__logo-img" />
              </template>
            </Suspense>
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
          <div class="wf-hero__scroll-hint anim-item" data-anim="slide-up" data-delay="500" :class="{ 'fade-out': scrollHintFaded }">
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
            <div class="qs-card__accent" aria-hidden="true"></div>
            <span class="qs-card__watermark orbitron-font" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="qs-card__top">
              <span class="qs-card__num orbitron-font">STEP {{ String(i + 1).padStart(2, '0') }}</span>
              <div class="qs-card__icon" aria-hidden="true">
                <Icon :icon="qs.icon" width="24" height="24" />
              </div>
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
            <div class="wf-card__icon" aria-hidden="true">
              <Icon :icon="card.icon" width="28" height="28" />
            </div>
            <h3 class="wf-card__title orbitron-font">{{ card.title }}</h3>
            <p class="wf-card__desc">{{ card.desc }}</p>
            <span class="wf-card__arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ============ 4. STATS BANNER ============ -->
    <div class="wf-divider"><span class="wf-divider__line"></span></div>
    <section id="stats" class="wf-section wf-stats" ref="statsSection">
      <div class="wf-container">
        <div class="wf-stats__grid">
          <div v-for="(stat, i) in statsData" :key="i" class="wf-stat anim-item" data-anim="slide-up" :data-delay="i * 80">
            <span class="wf-stat__number orbitron-font">
              <template v-if="stat.static">{{ stat.display }}</template>
              <template v-else>{{ animatedStats[i] }}{{ stat.suffix }}</template>
            </span>
            <span class="wf-stat__label orbitron-font">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 5. SECTION EXPLORER ============ -->
    <div class="wf-divider"><span class="wf-divider__line"></span></div>
    <section id="explore" class="wf-section wf-explore">
      <div class="wf-container">
        <div class="wf-section-label anim-item" data-anim="slide-up">
          <span class="wf-section-label__line"></span>
          <span class="wf-section-label__text orbitron-font">EXPLORE</span>
          <span class="wf-section-label__line"></span>
        </div>
        <h2 class="wf-section__title orbitron-font anim-item" data-anim="slide-up">Exploreaza <span class="wf-accent">Sectiunile</span></h2>
        <p class="wf-section__desc anim-item" data-anim="slide-up">Naviga prin toate categoriile de documentatie Wildfire</p>
        <div class="wf-explore__grid">
          <a
            v-for="(sec, i) in exploreSections"
            :key="i"
            :href="sec.href"
            class="wf-explore-card anim-item"
            :style="{ '--sec-color': sec.color }"
            data-anim="slide-up"
            :data-delay="i * 80"
          >
            <div class="wf-explore-card__accent" aria-hidden="true"></div>
            <div class="wf-explore-card__icon" aria-hidden="true">
              <Icon :icon="sec.icon" width="28" height="28" />
            </div>
            <h3 class="wf-explore-card__title orbitron-font">{{ sec.title }}</h3>
            <p class="wf-explore-card__desc">{{ sec.desc }}</p>
            <span class="wf-explore-card__badge orbitron-font">{{ sec.badge }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ============ 6. DISCORD CTA ============ -->
    <div class="wf-divider"><span class="wf-divider__line"></span></div>
    <section id="community" class="wf-section wf-community">
      <div class="wf-container">
        <div class="wf-discord-banner anim-item" data-anim="slide-up">
          <div class="wf-discord-banner__glow" aria-hidden="true"></div>
          <div class="wf-discord-banner__left">
            <span class="wf-discord-banner__eyebrow orbitron-font">COMUNITATE</span>
            <h2 class="wf-discord-banner__title orbitron-font">Alatura-te pe <span class="wf-accent">Discord</span></h2>
            <p class="wf-discord-banner__desc">Intreaba, contribuie si fii la curent cu toate noutatile comunitatii Wildfire.</p>
          </div>
          <div class="wf-discord-banner__right">
            <a href="https://discord.gg/wildfire" target="_blank" rel="noopener noreferrer" class="wf-discord-btn orbitron-font">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.05a19.9 19.9 0 0 0 5.993 3.03.079.079 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, inBrowser } from 'vitepress'
import { Icon } from '@iconify/vue'
import HomeNavbar from './HomeNavbar.vue'
import LastUpdates from './LastUpdates.vue'
import AboutWiki from './AboutWiki.vue'
import CS2Background from './CS2Background.vue'
import ScrollSpy from '../Layout/ScrollSpy.vue'
import LiquidMetalLogo from './LiquidMetalLogo.vue'
import { useMagnetic } from '../../composables/UI/useMouseInteraction'
import { searchState } from '../../store'
import { useTypingEffect } from '../../composables/Home/useTypingEffect'
import { useHomeAnimations } from '../../composables/Home/useHomeAnimations'

const { page, isDark } = useData()
const isHomePage = computed(() => page.value.relativePath === 'index.md' || page.value.relativePath === 'index')
const isMounted = ref(false)
const logoStart = ref(false)

const spySections = [
  { id: 'hero', label: 'Hero' },
  { id: 'updates', label: 'Updates' },
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'features', label: 'Why Wiki' },
  { id: 'stats', label: 'Stats' },
  { id: 'explore', label: 'Explore' },
  { id: 'community', label: 'Community' },
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

// Initialize Composables
const {
  displayTitleArray,
  titleTyped,
  getCharClass,
  displayButton,
  buttonTyped,
  displaySearchText,
  startWikiTyping,
  startTypingEffects
} = useTypingEffect()

const {
  tiltRefs,
  tiltStyle,
  heroContainer,
  scrollHintFaded,
  triggerBoom,
  startHomeAnimations
} = useHomeAnimations(inBrowser)

const featureBadges = [
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 21h1v-2.5H21v-1h-2.5V15h-1v2.5H15v1h2.5zm.5 2q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M7 9h10V7H7zm4.675 12H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v6.7q-.725-.35-1.463-.525T18 11q-.275 0-.513.012t-.487.063V11H7v2h6.125q-.45.425-.812.925T11.675 15H7v2h4.075q-.05.25-.062.488T11 18q0 .825.15 1.538T11.675 21"/></svg>', text: 'Documentatie' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>', text: 'Informatii' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>', text: 'Features' },
]

const quickstartCards = [
  { icon: 'lucide:search', title: 'Cauta Rapid', desc: 'Foloseste Ctrl+K pentru a gasi orice pagina din documentatie instant.', img: '/wallpaper/present.webp' },
  { icon: 'lucide:users', title: 'Contribuitori', desc: 'Documentatia este scrisa si mentinuta de echipa si comunitatea Wildfire.', img: '/wallpaper/contributors.webp' },
  { icon: 'lucide:layout-dashboard', title: 'Panel Admin', desc: 'Gestioneaza pagini, contribuitori si statistici dintr-un singur dashboard.', img: '/wallpaper/panel.webp' },
  { icon: 'lucide:message-circle', title: 'Comunitate', desc: 'Alatura-te pe Discord pentru suport, discutii si events.', img: '/wallpaper/community.webp' },
]

const statsData = [
  { target: 500,  suffix: '+', label: 'Membri Activi',    static: false },
  { target: 200,  suffix: '+', label: 'Pagini Docs',      static: false },
  { target: 5,    suffix: '',  label: 'Sectiuni Wiki',     static: false },
  { display: '24/7',          label: 'Mereu Actualizat',  static: true  },
]

const animatedStats = ref(statsData.map(() => 0))
const statsSection = ref(null)

function easeOut(t) { return 1 - Math.pow(1 - t, 3) }

function animateStats() {
  const duration = 1600
  const start = performance.now()
  function frame(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOut(progress)
    statsData.forEach((stat, i) => {
      if (!stat.static) {
        animatedStats.value[i] = Math.round(stat.target * eased)
      }
    })
    if (progress < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

const exploreSections = [
  {
    title: 'Informatii', desc: 'Reguli, ghiduri si informatii generale despre server.',
    href: '/informatii/about', color: '#ff7800', badge: 'INFO',
    icon: 'solar:info-circle-bold-duotone',
  },
  {
    title: 'Currency', desc: 'Valute, economie, Fire Coins si tranzactii.',
    href: '/currency/phoenixcoins', color: '#10b981', badge: 'ECONOMY',
    icon: 'solar:dollar-minimalistic-bold-duotone',
  },
  {
    title: 'Sisteme', desc: 'Sisteme de joc, mecanici si functionalitati.',
    href: '/systems/skins/informatiiws', color: '#ef4444', badge: 'SYSTEMS',
    icon: 'solar:cpu-bold-duotone',
  },
  {
    title: 'Market', desc: 'Shop, VIP Tiers, marketplace si Fire Coins.',
    href: '/market/premium-shop/sanks', color: '#8b5cf6', badge: 'MARKET',
    icon: 'solar:shop-2-bold-duotone',
  },
  {
    title: 'Updates', desc: 'Cele mai recente actualizari si schimbari.',
    href: '/updates_wiki/updateswiki', color: '#f59e0b', badge: 'UPDATES',
    icon: 'solar:pen-new-square-bold-duotone',
  },
]

const featureCards = [
  { icon: 'solar:document-text-bold-duotone', title: 'Regulamente', desc: 'Regulile complete ale serverului, actualizate constant.', href: '/informatii/regulamente/go/regulament-go' },
  { icon: 'solar:info-circle-bold-duotone', title: 'Informatii', desc: 'Ghiduri si tutoriale pentru toti jucatorii noi si vechi.', href: '/informatii/about' },
  { icon: 'solar:cpu-bold-duotone', title: 'Sisteme', desc: 'Descrieri detaliate ale tuturor sistemelor de pe server.', href: '/systems/skins/informatiiws' },
  { icon: 'solar:tag-bold-duotone', title: 'Market', desc: 'Shop, Fire Coins, VIP Tiers si tot ce tine de marketplace.', href: '/market/premium-shop/sanks' },
  { icon: 'solar:pen-new-square-bold-duotone', title: 'Changelog', desc: 'Ultimele actualizari si modificari de pe server.', href: '/updates_wiki/updateswiki' },
  { icon: 'solar:users-group-two-rounded-bold-duotone', title: 'Echipa', desc: 'Membrii staff-ului si contribuitorii comunitatii.', href: '/updates_wiki/contribute' },
]

const openSearch = (e: MouseEvent) => {
  if (!inBrowser) return
  e.preventDefault()
  e.stopPropagation()
  searchState.open()
}

const toggleDefaultNavbar = (hide: boolean) => {
  if (!inBrowser) return
  
  ;['.VPNav', '.VPSidebar', '.VPLocalNav'].forEach(sel => {
    const el = document.querySelector(sel) as HTMLElement | null
    if (el) el.style.display = hide ? 'none' : ''
  })
  const content = document.querySelector('.VPContent') as HTMLElement | null
  if (content) content.style.marginTop = hide ? '0' : ''
}

watch(isHomePage, (v) => { 
  if (inBrowser) toggleDefaultNavbar(v) 
}, { immediate: true })

onMounted(() => {
  isMounted.value = true
  toggleDefaultNavbar(isHomePage.value)
  setTimeout(() => { logoStart.value = true }, 100)
  startTypingEffects()
  startHomeAnimations()

  // Animate stats on scroll into view
  nextTick(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      let statsAnimated = false
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          statsAnimated = true
          animateStats()
          observer.disconnect()
        }
      }, { threshold: 0.3 })
      if (statsSection.value) observer.observe(statsSection.value)
    } else {
      animateStats()
    }
  })
})

onUnmounted(() => {
  if (!inBrowser) return
  toggleDefaultNavbar(false)
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

/* Search bar */
.wf-search {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 440px;
  padding: 14px 24px;
  margin-bottom: 32px;

  background: rgba(10, 10, 16, 0.82);

  border: 1px solid rgba(255, 120, 0, 0.14);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;

  /* glow removed */
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-search:hover {
  background: linear-gradient(145deg, rgba(255, 120, 0, 0.08) 0%, rgba(12, 12, 18, 0.88) 60%);
  border-color: rgba(255, 120, 0, 0.32);
  transform: translateY(-2px);
  color: rgba(255, 255, 255, 1);
  /* glow removed */
}

.wf-home--light .wf-search {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(255, 120, 0, 0.14);
  color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.wf-home--light .wf-search:hover {
  border-color: rgba(255, 120, 0, 0.3);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}

.wf-search__icon {
  flex-shrink: 0;
  color: #ff7800;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.wf-search:hover .wf-search__icon {
  opacity: 1;
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
.wf-btn--primary {
  background: rgba(255, 120, 0, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 120, 0, 0.38);
}

.wf-btn--primary :deep(svg) {
  color: #ff7800;
}

.wf-btn--primary:hover {
  background: linear-gradient(145deg, rgba(255, 120, 0, 0.16) 0%, rgba(12, 12, 18, 0.82) 60%);
  border-color: rgba(255, 120, 0, 0.75);
  transform: translateY(-2px);
  /* glow removed */
}

.wf-btn--ghost {
  background: rgba(10, 10, 16, 0.65);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 120, 0, 0.1);
}

.wf-btn--ghost:hover {
  border-color: rgba(255, 120, 0, 0.28);
  background: linear-gradient(145deg, rgba(255, 120, 0, 0.07) 0%, rgba(12, 12, 18, 0.7) 60%);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* ── Light mode button overrides ── */
.wf-home--light .wf-btn--primary {
  background: linear-gradient(145deg, #ff7800 0%, #e56a00 100%);
  color: #fff;
  border-color: rgba(255, 120, 0, 0.6);
  /* glow removed */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.wf-home--light .wf-btn--primary:hover {
  background: linear-gradient(145deg, #ff8c1a 0%, #ff7800 100%);
  border-color: rgba(255, 120, 0, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
}

.wf-home--light .wf-btn--ghost {
  background: rgba(255, 255, 255, 0.82);
  color: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(255, 120, 0, 0.28);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.wf-home--light .wf-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.97);
  border-color: rgba(255, 120, 0, 0.55);
  color: #e06500;
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
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

@media (prefers-reduced-motion: no-preference) {

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

} /* end prefers-reduced-motion */

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
  position: relative;
  padding: 28px;
  border-radius: 20px;
  border: 1px solid rgba(255, 120, 0, 0.08);
  background: rgba(10, 10, 16, 0.88);
  overflow: hidden;
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.qs-card:hover {
  border-color: rgba(255, 120, 0, 0.28);
  transform: translateY(-6px);
  /* glow removed */
}

/* Sliding orange accent line at top */
.qs-card__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff7800 50%, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.qs-card:hover .qs-card__accent {
  transform: scaleX(1);
}

/* Large decorative watermark number */
.qs-card__watermark {
  position: absolute;
  bottom: -12px;
  right: 18px;
  font-size: 100px;
  font-weight: 900;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 120, 0, 0.07);
  pointer-events: none;
  user-select: none;
  transition: -webkit-text-stroke-color 0.4s ease;
}

.qs-card:hover .qs-card__watermark {
  -webkit-text-stroke-color: rgba(255, 120, 0, 0.16);
}

.qs-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.qs-card__num {
  font-size: 10px;
  font-weight: 700;
  color: #ff7800;
  background: rgba(255, 120, 0, 0.1);
  border: 1px solid rgba(255, 120, 0, 0.2);
  padding: 4px 10px;
  border-radius: 8px;
  letter-spacing: 2px;
}

.qs-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 120, 0, 0.08);
  border: 1px solid rgba(255, 120, 0, 0.15);
  border-radius: 11px;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.qs-card:hover .qs-card__icon {
  background: rgba(255, 120, 0, 0.12);
  border-color: rgba(255, 120, 0, 0.28);
}

.qs-card__icon :deep(svg) {
  stroke: #ff7800;
}

.qs-card__title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  letter-spacing: 0.5px;
}

.qs-card__desc {
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0;
}

.qs-card__img {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.07);
  position: relative;
  z-index: 5;
  pointer-events: auto !important;
  cursor: zoom-in !important;
}

.qs-card__img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.45) 100%);
  pointer-events: none;
  transition: opacity 0.35s ease;
}

.qs-card:hover .qs-card__img::after {
  opacity: 0;
}

.qs-card__img img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  opacity: 0.72;
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto !important;
  cursor: zoom-in !important;
}

.qs-card:hover .qs-card__img img {
  opacity: 1;
  transform: scale(1.05);
}

/* Light mode */
.wf-home--light .qs-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(255, 120, 0, 0.1);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}

.wf-home--light .qs-card:hover {
  border-color: rgba(255, 120, 0, 0.3);
  /* glow removed */
}

.wf-home--light .qs-card__watermark {
  -webkit-text-stroke: 1px rgba(255, 120, 0, 0.05);
}

.wf-home--light .qs-card:hover .qs-card__watermark {
  -webkit-text-stroke-color: rgba(255, 120, 0, 0.12);
}

.wf-home--light .qs-card__num {
  background: rgba(255, 120, 0, 0.08);
}

.wf-home--light .qs-card__icon {
  background: rgba(255, 120, 0, 0.07);
  border-color: rgba(255, 120, 0, 0.18);
}

.wf-home--light .qs-card__img {
  border-color: rgba(0, 0, 0, 0.08);
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
  padding: 28px;
  border-radius: 20px;
  background: rgba(10, 10, 16, 0.88);
  border: 1px solid rgba(255, 120, 0, 0.08);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.wf-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff7800 50%, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-card:hover::before {
  transform: scaleX(1);
}

.wf-card:hover {
  border-color: rgba(255, 120, 0, 0.22);
  transform: translateY(-6px);
  /* glow removed */
}

.wf-home--light .wf-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(255, 120, 0, 0.1);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}

.wf-home--light .wf-card:hover {
  border-color: rgba(255, 120, 0, 0.3);
  /* glow removed */
}

.wf-card__icon {
  color: #ff7800;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 120, 0, 0.08);
  border: 1px solid rgba(255, 120, 0, 0.15);
  border-radius: 12px;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.wf-card:hover .wf-card__icon {
  background: rgba(255, 120, 0, 0.12);
  border-color: rgba(255, 120, 0, 0.28);
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
  background: rgba(10, 10, 16, 0.65);
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

@media (prefers-reduced-motion: no-preference) {
@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
}

/* ===== SCROLL ANIMATIONS ===== */
.anim-item {
  opacity: 0;
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
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
@media (prefers-reduced-motion: no-preference) {
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
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

/* Single parent float replaces 7 individual per-element translateZ animations
   — reduces GPU compositing layers from 7+ down to 1 */
@media (prefers-reduced-motion: no-preference) {
  @keyframes floatZ-logo {
    0%, 100% { transform: translateZ(50px); }
    50% { transform: translateZ(70px) translateY(-5px); }
  }
}

.wf-hero-split__left-inner .wf-hero__logo {
  will-change: transform;
  animation: floatZ-logo 6s ease-in-out infinite;
}

.wf-hero-split__left-inner .wf-hero__title {
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero__title .t-white {
  display: inline-block;
}

.wf-hero-split__left-inner .wf-hero__title .t-fire {
  display: inline-block;
}

.wf-hero-split__left-inner .wf-hero__title .t-docs {
  display: inline-flex;
}

.wf-hero-split__left-inner .wf-hero-float--sub {
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero-float--search {
  z-index: 20;
  transform-style: preserve-3d;
  width: 100%;
}

.wf-hero-split__left-inner .wf-hero__actions {
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero-float--btn1 {
  transform-style: preserve-3d;
}

.wf-hero-split__left-inner .wf-hero-float--btn2 {
  transform-style: preserve-3d;
}

.wf-hero-split__left::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 120, 0, 0.03) 0%, transparent 60%);
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
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 16px 24px;
  background: rgba(10, 10, 16, 0.8);
  border: 1px solid rgba(255, 120, 0, 0.1);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transform: scale(0.88) rotateY(-4deg) rotateX(2deg);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-hero-split__right-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff7800 50%, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 3;
}

.wf-hero-split__right-panel:hover::before {
  transform: scaleX(1);
}

.wf-hero-split__right-panel:hover {
  transform: scale(0.92) rotateY(0deg) rotateX(0deg) translateY(-5px);
  background: linear-gradient(145deg, rgba(255, 120, 0, 0.05) 0%, rgba(12, 12, 18, 0.85) 60%);
  border-color: rgba(255, 120, 0, 0.22);
  /* glow removed */
}

.wf-home--light .wf-hero-split__right-panel {
  background: rgba(255, 255, 255, 0.82);
  border-color: rgba(255, 120, 0, 0.12);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
}
.wf-home--light .wf-hero-split__right-panel:hover {
  border-color: rgba(255, 120, 0, 0.3);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
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

/* ===== STATS BANNER ===== */
.wf-stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.wf-stat {
  position: relative;
  overflow: hidden;
  padding: 32px 24px;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(255, 120, 0, 0.04) 0%, rgba(8, 8, 12, 0.85) 60%);
  border: 1px solid rgba(255, 120, 0, 0.1);
  text-align: center;
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-stat::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff7800 50%, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-stat:hover::before { transform: scaleX(1); }
.wf-stat:hover {
  border-color: rgba(255, 120, 0, 0.28);
  transform: translateY(-4px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
}

.wf-stat__number {
  display: block;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 900;
  color: #ff7800;
  margin-bottom: 10px;
  letter-spacing: -1px;
}

.wf-stat__label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.wf-home--light .wf-stat {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 120, 0, 0.12);
}

@media (max-width: 768px) {
  .wf-stats__grid { grid-template-columns: repeat(2, 1fr); }
}

/* ===== SECTION EXPLORER ===== */
.wf-explore__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.wf-explore-card {
  position: relative;
  overflow: hidden;
  padding: 24px 20px 20px;
  border-radius: 18px;
  background: linear-gradient(145deg, color-mix(in srgb, var(--sec-color) 5%, transparent) 0%, rgba(8, 8, 12, 0.82) 60%);
  border: 1px solid color-mix(in srgb, var(--sec-color) 14%, transparent);
  text-decoration: none;
  color: var(--vp-c-text-1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-explore-card__accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--sec-color) 50%, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-explore-card:hover .wf-explore-card__accent { transform: scaleX(1); }
.wf-explore-card:hover {
  border-color: color-mix(in srgb, var(--sec-color) 28%, transparent);
  transform: translateY(-5px);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.25),
    0 0 0 1px color-mix(in srgb, var(--sec-color) 10%, transparent);
}

.wf-explore-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--sec-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--sec-color) 18%, transparent);
  color: var(--sec-color);
  flex-shrink: 0;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.wf-explore-card:hover .wf-explore-card__icon {
  background: color-mix(in srgb, var(--sec-color) 14%, transparent);
}

.wf-explore-card__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  letter-spacing: 0.3px;
}

.wf-explore-card__desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
  line-height: 1.5;
  flex: 1;
  margin: 0;
}

.wf-explore-card__badge {
  display: inline-flex;
  align-items: center;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 3px 8px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--sec-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--sec-color) 20%, transparent);
  color: var(--sec-color);
  align-self: flex-start;
  margin-top: auto;
}

.wf-home--light .wf-explore-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: color-mix(in srgb, var(--sec-color) 16%, transparent);
}

@media (max-width: 1024px) {
  .wf-explore__grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 640px) {
  .wf-explore__grid { grid-template-columns: repeat(2, 1fr); }
}

/* ===== DISCORD CTA ===== */
.wf-discord-banner {
  position: relative;
  overflow: hidden;
  padding: 52px 56px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.07) 0%, rgba(255, 120, 0, 0.04) 50%, rgba(8, 8, 12, 0.88) 100%);
  border: 1px solid rgba(88, 101, 242, 0.16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.wf-discord-banner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(88, 101, 242, 0.7) 50%, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-discord-banner:hover::before { transform: scaleX(1); }
.wf-discord-banner:hover {
  border-color: rgba(88, 101, 242, 0.22);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.wf-discord-banner__eyebrow {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(88, 101, 242, 0.8);
  margin-bottom: 10px;
}

.wf-discord-banner__title {
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.wf-discord-banner__desc {
  font-size: 14.5px;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  max-width: 480px;
  margin: 0;
}

.wf-discord-banner__right { flex-shrink: 0; }

.wf-discord-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 14px;
  background: #5865f2;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-discord-btn:hover {
  background: #4752c4;
  transform: translateY(-3px);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.25);
}

.wf-home--light .wf-discord-banner {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(88, 101, 242, 0.18);
}

@media (max-width: 768px) {
  .wf-discord-banner {
    flex-direction: column;
    padding: 36px 28px;
    gap: 28px;
    text-align: center;
  }
  .wf-discord-banner__desc { max-width: 100%; }
}
</style>
