<template>
  <div v-if="!isMounted && isHomePage" class="wf-home-placeholder" aria-hidden="true"></div>
  <div v-if="isMounted && isHomePage" class="wf-home" :class="{ 'wf-home--light': !isDark }">
    <HomeNavbar v-if="isHomePage" />
    <CS2Background :scrollOpacity="scrollFade" :isDark="isDark" />
    <CustomCursor />
    <ScrollSpy :sections="spySections" />

    <!-- ============ HERO SECTION ============ -->
    <section id="hero" class="wf-section wf-hero">
      <div class="wf-container" :style="{ transform: `translateY(${-scrollY * 0.18}px)`, opacity: 1 - scrollY * 0.0015 }">
        <!-- Logo with Liquid Metal shader -->
        <div class="wf-hero__logo">
          <LiquidMetalLogo
            :width="500"
            :height="500"
            image="/icons/wildfire.png"
            colorBack="#00000000"
            colorTint="#ff8c00"
            :repetition="3.62"
            :softness="1"
            :shiftRed="-0.06"
            :shiftBlue="0.06"
            :distortion="0"
            :contour="0.54"
            :angle="74"
            :speed="0.2"
            :scale="0.85"
            fit="contain"
            class="wf-hero__logo-shader"
          />
        </div>

        <!-- Title with typewriter -->
        <h1 class="wf-hero__title orbitron-font" :class="{ 'typing-complete': titleTyped }">
          <span v-if="!titleTyped">
            <span v-for="(char, i) in displayTitleArray" :key="i" :class="getCharClass(i)">{{ char }}</span>
            <span class="wf-cursor"></span>
          </span>
          <span v-else>
            <span class="t-white">WILD</span><span class="t-fire">FIRE</span><span class="t-dot">.</span><span class="t-ro">RO</span><span class="t-docs"> DOCS</span>
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="wf-hero__sub orbitron-font">
          Toată documentația și informațiile de care ai nevoie, într-un singur loc.
        </p>

        <!-- Search bar -->
        <button
          class="wf-search magnetic-btn orbitron-font"
          @click="openSearch"
          ref="searchBtn"
          :style="magneticStyle(searchMag)"
        >
          <svg class="wf-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span class="wf-search__text typing-text orbitron-font">{{ displaySearchText }}<span class="wf-cursor"></span></span>
          <kbd class="wf-search__kbd orbitron-font">Ctrl K</kbd>
        </button>

        <!-- CTA row -->
        <div class="wf-hero__actions">
          <a
            href="/informatii/about"
            class="wf-btn wf-btn--primary magnetic-btn orbitron-font"
            ref="ctaBtn"
            :style="magneticStyle(ctaMag)"
          >
            <span class="typing-text orbitron-font" :class="{ 'typing-complete': buttonTyped }">{{ displayButton }}<span v-if="!buttonTyped" class="wf-cursor"></span></span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a
            href="https://discord.gg/wildfire"
            target="_blank"
            class="wf-btn wf-btn--ghost magnetic-btn orbitron-font"
            ref="discordBtn"
            :style="magneticStyle(discordMag)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Discord
          </a>
        </div>
      </div>

      <!-- Scroll hint -->
      <div class="wf-hero__scroll-hint" :class="{ 'fade-out': scrollY > 100 }">
        <div class="wf-hero__scroll-line"></div>
      </div>
    </section>

    <!-- ============ 1. LAST UPDATES (compact) ============ -->
    <section id="updates" class="wf-section wf-updates">
      <div class="wf-container">
        <div class="anim-item" data-anim="slide-up">
          <LastUpdates />
        </div>
      </div>
    </section>

    <!-- ============ 2. GHID RAPID ============ -->
    <section id="quickstart" class="wf-section wf-split">
      <div class="wf-container wf-split__inner">
        <div class="wf-split__text anim-item" data-anim="slide-left">
          <span class="wf-pill orbitron-font">Ghid Rapid</span>
          <h2 class="wf-split__heading orbitron-font">Începe în câteva secunde</h2>
          <p class="wf-split__body">Navighează prin categorii, folosește căutarea rapidă sau accesează direct secțiunile de care ai nevoie. Documentația este actualizată constant.</p>
          <div class="wf-split__badges">
            <div class="wf-badge orbitron-font" v-for="(badge, index) in featureBadges" :key="index">
              <span class="wf-badge__icon" v-html="badge.icon"></span>
              <span class="wf-badge__text">{{ badge.text }}</span>
            </div>
          </div>
        </div>
        <div class="wf-split__visual anim-item" data-anim="slide-right">
          <div class="wf-preview-frame">
            <img src="/wallpaper/present.png" alt="Wildfire.ro Preview" class="wf-preview-img" width="600" height="350" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 3. WHY WIKI ============ -->
    <section id="features" class="wf-section wf-features">
      <div class="wf-container">
        <h2 class="wf-section__title orbitron-font anim-item" data-anim="slide-up">De ce Wiki?</h2>
        <p class="wf-section__desc anim-item" data-anim="slide-up">Tot ce trebuie să știi despre comunitatea Wildfire.ro</p>

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'
import HomeNavbar from './HomeNavbar.vue'
import LastUpdates from './LastUpdates.vue'
import AboutWiki from './AboutWiki.vue'
import CS2Background from './CS2Background.vue'
import CustomCursor from './CustomCursor.vue'
import ScrollSpy from './ScrollSpy.vue'
import LiquidMetalLogo from './LiquidMetalLogo.vue'
import NeuroNoiseBg from './NeuroNoiseBg.vue'
import { useMagnetic } from '../composables/useMagnetic'

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
const tiltData = reactive<Record<number, { rx: number; ry: number }>>({})

const handleTiltMove = (i: number, e: MouseEvent) => {
  const el = tiltRefs[i]
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  tiltData[i] = { rx: -py * 6, ry: px * 6 }
}
const handleTiltLeave = (i: number) => { tiltData[i] = { rx: 0, ry: 0 } }

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
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 21h1v-2.5H21v-1h-2.5V15h-1v2.5H15v1h2.5zm.5 2q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M7 9h10V7H7zm4.675 12H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v6.7q-.725-.35-1.463-.525T18 11q-.275 0-.513.012t-.487.063V11H7v2h6.125q-.45.425-.812.925T11.675 15H7v2h4.075q-.05.25-.062.488T11 18q0 .825.15 1.538T11.675 21"/></svg>', text: 'Documentație' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>', text: 'Informații' },
  { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>', text: 'Features' },
]

const featureCards = [
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', title: 'Regulamente', desc: 'Regulile complete ale serverului, actualizate constant.', href: '/informatii/regulament' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>', title: 'Informații', desc: 'Ghiduri și tutoriale pentru toți jucătorii noi și vechi.', href: '/informatii/about' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', title: 'Sisteme', desc: 'Descrieri detaliate ale tuturor sistemelor de pe server.', href: '/systems/' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>', title: 'Market', desc: 'Shop, Fire Coins, VIP Tiers și tot ce ține de marketplace.', href: '/market/' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>', title: 'Changelog', desc: 'Ultimele actualizări și modificări de pe server.', href: '/informatii/changelogs' },
  { icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Echipa', desc: 'Membrii staff-ului și contribuitorii comunității.', href: '/informatii/team' },
]

const displayBadges = ref(['', '', ''])
const badgesTyped = ref([false, false, false])
const displayButton = ref('')
const buttonTyped = ref(false)
const buttonOriginal = 'Ghid de pornire'
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
  e.preventDefault()
  e.stopPropagation()
  const btn = document.querySelector('.VPNavBarSearch button')
  if (btn) { (btn as HTMLElement).click(); return }
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true, bubbles: true, cancelable: true }))
}

const toggleDefaultNavbar = (hide: boolean) => {
  ;['.VPNav', '.VPSidebar', '.VPLocalNav'].forEach(sel => {
    const el = document.querySelector(sel) as HTMLElement | null
    if (el) el.style.display = hide ? 'none' : ''
  })
  const content = document.querySelector('.VPContent') as HTMLElement | null
  if (content) content.style.marginTop = hide ? '0' : ''
}

const triggerBoom = () => {
  const logo = document.querySelector('.wf-hero__logo-shader') as HTMLElement
  if (!logo) return
  logo.classList.add('boom')
  setTimeout(() => logo.classList.remove('boom'), 600)
}

// Scroll-triggered animations (IntersectionObserver)
let observer: IntersectionObserver | null = null

const setupScrollAnimations = () => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement
        const delay = parseInt(el.dataset.delay || '0', 10)
        setTimeout(() => el.classList.add('anim-visible'), delay)
        observer!.unobserve(el)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  document.querySelectorAll('.anim-item').forEach(el => observer!.observe(el))
}

// Attach tilt listeners after mount
const attachTiltListeners = () => {
  nextTick(() => {
    Object.entries(tiltRefs).forEach(([key, el]) => {
      if (!el) return
      const i = Number(key)
      el.addEventListener('mousemove', (e: MouseEvent) => handleTiltMove(i, e))
      el.addEventListener('mouseleave', () => handleTiltLeave(i))
    })
  })
}

const handleScroll = () => {
  scrollY.value = window.scrollY
  const isDark = document.documentElement.classList.contains('dark')
  scrollFade.value = isDark
    ? Math.min(window.scrollY / 500, 0.8)
    : Math.min(window.scrollY / 800, 0.5)
}

watch(isHomePage, (v) => { if (typeof document !== 'undefined') toggleDefaultNavbar(v) }, { immediate: true })

onMounted(() => {
  isMounted.value = true
  toggleDefaultNavbar(isHomePage.value)
  setTimeout(() => { logoStart.value = true }, 600)
  startTypingEffects()
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  nextTick(() => {
    setTimeout(setupScrollAnimations, 200)
    setTimeout(attachTiltListeners, 400)
  })
})

onUnmounted(() => {
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
  cursor: none;
}

.wf-home *,
.wf-home a,
.wf-home button,
.wf-home input,
.wf-home select,
.wf-home textarea,
.wf-home [role="button"] {
  cursor: none !important;
}

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
  padding: 90px 0 60px;
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
  margin-bottom: -30px;
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
  font-size: clamp(28px, 5vw, 46px);
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  min-height: 1.2em;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease 0.3s forwards;
}

.t-white { color: #fff; }
.t-fire-typing { color: #ff4500; }
.t-dot { color: rgba(255, 255, 255, 0.3); }
.t-ro-typing { color: #ff4500; }
.t-docs {
  display: inline-block;
  font-size: 0.5em;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.2em;
  vertical-align: middle;
  margin-left: 0.2em;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.1em 0.35em;
  border-radius: 4px;
  line-height: 1.6;
}

.t-fire {
  background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 12px rgba(255, 69, 0, 0.4));
}

.t-ro {
  background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.wf-home--light .t-white { color: #111; }
.wf-home--light .t-docs { color: rgba(0, 0, 0, 0.4); border-color: rgba(0, 0, 0, 0.15); }

/* Subtitle */
.wf-hero__sub {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 32px;
  max-width: 520px;
  letter-spacing: 0.05em;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease 0.5s forwards;
}

.wf-home--light .wf-hero__sub {
  color: rgba(0, 0, 0, 0.5);
}

/* Search bar */
.wf-search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 440px;
  padding: 12px 18px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease 0.6s forwards;
}

.wf-search:hover {
  border-color: rgba(255, 69, 0, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.wf-home--light .wf-search {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.5);
}

.wf-home--light .wf-search:hover {
  border-color: rgba(255, 69, 0, 0.3);
}

.wf-search__icon {
  flex-shrink: 0;
  opacity: 0.5;
}

.wf-search__text {
  flex: 1;
  text-align: left;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-search__kbd {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

.wf-home--light .wf-search__kbd {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.4);
}

.wf-search:hover .wf-search__kbd {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
}

/* CTA Buttons */
.wf-hero__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease 0.7s forwards;
}

.wf-btn {
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
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  cursor: pointer;
}

.wf-btn--primary {
  background: #ff4500;
  color: #fff;
  border: 1px solid #ff4500;
}

.wf-btn--primary:hover {
  background: #e63e00;
  box-shadow: 0 6px 24px rgba(255, 69, 0, 0.3);
  transform: translate(var(--mx, 0), var(--my, 0)) translateY(-2px);
}

.wf-btn--ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.wf-btn--ghost:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.04);
}

.wf-home--light .wf-btn--ghost {
  color: rgba(0, 0, 0, 0.6);
  border-color: rgba(0, 0, 0, 0.1);
}

.wf-home--light .wf-btn--ghost:hover {
  border-color: rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.03);
}

/* Scroll hint */
.wf-hero__scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  animation: fadeSlideUp 0.6s ease 1.2s forwards;
  transition: opacity 0.4s ease;
}

.wf-hero__scroll-hint.fade-out {
  opacity: 0 !important;
}

.wf-hero__scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(255, 69, 0, 0.6), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

.wf-home--light .wf-hero__scroll-line {
  background: linear-gradient(to bottom, rgba(255, 69, 0, 0.4), transparent);
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(0.6); transform-origin: top; }
  50% { opacity: 1; transform: scaleY(1); }
}

/* ===== FEATURE CARDS SECTION ===== */
.wf-features {
  padding: 60px 0 40px;
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
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  margin: 10px auto 0;
  background: linear-gradient(90deg, #ff4500, #ff8c00);
  border-radius: 2px;
  opacity: 0.6;
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
  padding: 28px 24px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s ease,
              border-color 0.3s ease;
  will-change: transform;
  overflow: hidden;
}

.wf-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 69, 0, 0.15);
}

.wf-home--light .wf-card {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(0, 0, 0, 0.06);
}

.wf-home--light .wf-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border-color: rgba(255, 69, 0, 0.12);
}

.wf-card__icon {
  color: #ff4500;
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
  color: rgba(255, 69, 0, 0.4);
  transition: transform 0.3s ease, color 0.3s ease;
}

.wf-card:hover .wf-card__arrow {
  transform: translateX(4px);
  color: #ff4500;
}

/* ===== SPLIT SECTION ===== */
.wf-split {
  padding: 60px 0;
}

.wf-split__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.wf-pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  background: rgba(255, 69, 0, 0.06);
  color: #ff4500;
  border: 1px solid rgba(255, 69, 0, 0.15);
  margin-bottom: 14px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
  border-color: rgba(255, 69, 0, 0.3);
  transform: translateY(-1px);
}

.wf-home--light .wf-badge {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.06);
}

.wf-badge__icon {
  color: #ff4500;
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
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
  background: linear-gradient(90deg, transparent, #ff4500, #ff8c00, transparent);
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
  background: #ff4500;
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
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.anim-item[data-anim="slide-up"] {
  transform: translateY(40px);
}

.anim-item[data-anim="slide-left"] {
  transform: translateX(-40px);
}

.anim-item[data-anim="slide-right"] {
  transform: translateX(40px);
}

.anim-item.anim-visible {
  opacity: 1;
  transform: translate(0, 0) !important;
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
</style>
