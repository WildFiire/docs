<template>
  <header class="nav" :class="{ 'scrolled': isScrolled }">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <div class="logo-icon-wrap wf-hyper-branding">
          <svg class="wf-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wf-trace-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff7800" />
                <stop offset="50%" stop-color="#ff0000" />
                <stop offset="100%" stop-color="#ff7800" />
              </linearGradient>
              <filter id="wf-phantom-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g class="wf-phantom-layers">
              <!-- Layer 1: The Phantom Ghost (Very faint static outline) -->
              <path class="wf-path wf-ghost" d="M 10 30 L 25 80 L 40 50 L 55 80 L 70 30 M 85 30 L 85 80 M 85 30 L 110 30 M 85 55 L 105 55" />
              <!-- Layer 2: The Scanning Spark (Dynamic light trace) -->
              <path class="wf-path wf-scanner" d="M 10 30 L 25 80 L 40 50 L 55 80 L 70 30 M 85 30 L 85 80 M 85 30 L 110 30 M 85 55 L 105 55" />
            </g>
          </svg>
        </div>
        <!-- <span class="logo-text">
          <span class="wild orbitron-font">Wild</span>
          <span class="fire orbitron-font">fire.Ro</span>
          <span class="logo-docs orbitron-font">
            <Icon icon="mdi:book-open-page-variant" width="12" height="12" style="margin-right: 4px;" />
            DOCS
          </span>
        </span> -->
      </a>

      <nav class="nav-links desktop-only">
        <div class="links-track">
          <a
            v-for="item in navItems"
            :key="item.link"
            :href="item.link"
            class="orbitron-font nav-item"
            :class="{ active: isActive(item.link) }"
          >
            <Icon v-if="getNavIcon(item.text)" :icon="getNavIcon(item.text)" class="nav-icon" width="14" height="14" />
            <span class="nav-item-text">{{ cleanText(item.text) }}</span>
            <div class="active-glow" v-if="isActive(item.link)"></div>
          </a>
        </div>
      </nav>

      <div class="nav-right">
        <!-- User Profile (Desktop only or in Menu) -->
        <div class="hn-user-wrap desktop-only" ref="userWrapRef">
          <button class="hn-user-trigger" :class="{ 'is-open': userOpen }" @click="userOpen = !userOpen" :title="navUser ? (navUser.name || navUser.login) : 'Panel'">
            <img v-if="navUser" :src="navUser.avatar_url" class="hn-user-avatar" :alt="navUser.login" width="32" height="32" />
            <span v-else class="hn-user-fallback">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </span>
          </button>

          <transition name="dropdown-pop">
            <div v-if="userOpen" class="hn-user-dropdown liquid-panel">
              <template v-if="navUser">
                <div class="hn-dp-profile">
                  <img :src="navUser.avatar_url" class="hn-dp-avatar" :alt="navUser.login" width="40" height="40" />
                  <div class="hn-dp-info">
                    <span class="hn-dp-name">{{ navUser.name || navUser.login }}</span>
                    <span class="hn-dp-login">@{{ navUser.login }}</span>
                  </div>
                </div>
                <div class="hn-divider"></div>
                <a href="/panel" class="hn-btn primary-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                  Dashboard Panel
                </a>
                <button class="hn-btn ghost-btn" @click="navLogout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Disconnect
                </button>
              </template>
              <template v-else>
                <div class="hn-guest">
                  <div class="hn-guest-icon">
                    <Icon icon="solar:shield-user-bold-duotone" width="32" height="32" />
                  </div>
                  <span class="hn-guest-title orbitron-font notranslate">Wildfire Portal</span>
                  <span class="hn-guest-sub">Autentificare pentru acces panel.</span>
                </div>
                <a href="/panel" class="hn-btn primary-btn full-width mt-2">
                  <Icon icon="mdi:github" width="18" height="18" />
                  Login cu GitHub
                </a>
              </template>
            </div>
          </transition>
        </div>

        <!-- Language Switcher -->
        <div class="hn-lang-wrap" ref="langWrapRef">
          <button class="hn-lang-trigger" @click="langMenuOpen = !langMenuOpen" :title="'Current language: ' + currentLang">
            <Icon :icon="currentFlag" width="20" height="20" />
          </button>
          
          <transition name="dropdown-pop">
            <div v-if="langMenuOpen" class="hn-lang-dropdown liquid-panel notranslate">
              <button 
                v-for="lang in languages" 
                :key="lang.code"
                class="hn-lang-item" 
                :class="{ 'active': currentLang === lang.code }"
                @click="changeLang(lang.code)"
              >
                <Icon :icon="lang.flag" class="hn-flag" width="20" height="20" />
                {{ lang.name }}
              </button>
            </div>
          </transition>
        </div>

        <!-- Theme Switcher (Visible on both) -->
        <button class="liquid-theme-toggle" :class="{ 'is-dark': isDark }" @click="toggleTheme" :aria-label="isDark ? 'Switch to Light' : 'Switch to Dark'">
          <div class="toggle-track-glass"></div>
          <div class="toggle-slider"></div>
          <div class="toggle-icons">
            <div class="icon-box sun">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </div>
            <div class="icon-box moon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
          </div>
        </button>

        <!-- Hamburger Icon (Mobile only) -->
        <button class="nav-toggle mobile-only" :class="{ 'is-active': open }" @click="toggle">
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>
  </header>

  <!-- Hidden Google Translate Element -->
  <div id="google_translate_element" style="display:none;"></div>

  <transition name="fade-scale">
    <div class="mobile-menu liquid-panel-full" v-if="open">
      <div class="mm-user-section">
        <template v-if="navUser">
          <div class="mm-user-profile">
            <img :src="navUser.avatar_url" class="mm-avatar" :alt="navUser.login" width="48" height="48" />
            <div class="mm-user-info">
              <span class="mm-name">{{ navUser.name || navUser.login }}</span>
              <span class="mm-login">@{{ navUser.login }}</span>
            </div>
          </div>
          <div class="mm-user-actions">
            <a href="/panel" class="hn-btn primary-btn" @click="open=false">Dashboard</a>
            <button class="hn-btn ghost-btn" @click="navLogout(); open=false">Logout</button>
          </div>
        </template>
        <template v-else>
          <div class="mm-guest">
            <span class="orbitron-font mm-guest-title notranslate">Wildfire Portal</span>
            <span class="mm-guest-sub">Sign in to access dev tools.</span>
          </div>
          <a href="/panel" class="hn-btn primary-btn full-width" @click="open=false">Login cu GitHub</a>
        </template>
      </div>

      <div class="hn-divider mm-divider"></div>

      <div class="mobile-menu-links">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="item.link"
          @click="open=false"
          class="mm-link"
          :class="{ 'mm-active': isActive(item.link) }"
        >
          <Icon :icon="getNavIcon(item.text)" class="mm-nav-icon" width="22" height="22" />
          <span class="orbitron-font">{{ cleanText(item.text) }}</span>
        </a>
      </div>
      
      <div class="mm-footer notranslate">
        <p class="mm-footer-note orbitron-font">Wildfire Ecosystem</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData, useRoute } from 'vitepress'
import { Icon } from '@iconify/vue'

const { theme, isDark } = useData()
const route = useRoute()

const open = ref(false)
const isScrolled = ref(false)

const navUser = ref<{ login: string; avatar_url: string; name: string } | null>(null)
const userOpen = ref(false)
const userWrapRef = ref<HTMLElement | null>(null)

const langMenuOpen = ref(false)
const langWrapRef = ref<HTMLElement | null>(null)
const currentLang = ref('ro')

const languages = [
  { code: 'ro', name: 'Română', flag: 'circle-flags:ro' },
  { code: 'en', name: 'English', flag: 'circle-flags:uk' },
]

const currentFlag = computed(() => {
  const l = languages.find(l => l.code === currentLang.value)
  return l ? l.flag : 'circle-flags:ro'
})

function updateGoogtransCookie(code: string) {
  const host = window.location.hostname
  const isLocal = host === 'localhost' || host === '127.0.0.1'
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  if (!isLocal) {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`
  }
  if (code !== 'ro') {
    document.cookie = `googtrans=/ro/${code}; path=/;`
    if (!isLocal) {
      document.cookie = `googtrans=/ro/${code}; path=/; domain=.${host};`
    }
  }
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
  return null
}

function changeLang(code: string) {
  currentLang.value = code
  updateGoogtransCookie(code)
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

const navLogout = () => {
  localStorage.removeItem('github_token')
  localStorage.removeItem('github_user')
  navUser.value = null
  userOpen.value = false
}

const onOutsideClick = (e: MouseEvent) => {
  if (userWrapRef.value && !userWrapRef.value.contains(e.target as Node)) {
    userOpen.value = false
  }
  if (langWrapRef.value && !langWrapRef.value.contains(e.target as Node)) {
    langMenuOpen.value = false
  }
}

const navItems = computed(() => theme.value.nav || [])

const isActive = (link: string) => route.path === link
const cleanText = (t: string) => t.replace(/<[^>]+>/g, '').trim()

const getNavIcon = (text: string) => {
  const t = text.toLowerCase().trim()
  if (t === 'home' || t === 'acasă') return 'solar:home-smile-bold-duotone'
  if (t.includes('informatii') || t.includes('info')) return 'solar:book-bold-duotone'
  if (t.includes('doc') || t.includes('wiki')) return 'solar:library-bold-duotone'
  if (t.includes('team') || t.includes('echipă') || t.includes('staff')) return 'solar:users-group-rounded-bold-duotone'
  if (t.includes('panel') || t.includes('dashboard') || t.includes('portal')) return 'solar:shield-bold-duotone'
  if (t.includes('faq') || t.includes('intrebari')) return 'solar:help-bold-duotone'
  if (t.includes('changelog') || t.includes('news')) return 'solar:fire-bold-duotone'
  if (t.includes('github')) return 'mdi:github'
  if (t.includes('discord')) return 'ic:baseline-discord'
  return 'solar:double-alt-arrow-right-bold-duotone'
}

const getIconFromText = (text: string) => {
  const iconify = text.match(/<iconify-icon[^>]*><\/iconify-icon>/)
  if (iconify) return iconify[0]
  const img = text.match(/<img[^>]*>/)
  return img ? img[0] : ''
}

const toggle = () => {
  open.value = !open.value
  document.body.style.overflow = open.value ? 'hidden' : ''
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

let scrollRaf = null
const onScroll = () => {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 40
    scrollRaf = null
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onOutsideClick)
  try {
    const raw = localStorage.getItem('github_user')
    if (raw && localStorage.getItem('github_token')) {
      navUser.value = JSON.parse(raw)
    }
  } catch {}

  // Inject Google Translate script globally (Home page needs this)
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    document.body.appendChild(script)
  }

  ;(window as any).googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement({
      pageLanguage: 'ro',
      includedLanguages: 'ro,en',
      autoDisplay: false,
    }, 'google_translate_element')
  }

  const googtrans = getCookie('googtrans')
  if (googtrans) {
    const parts = googtrans.split('/')
    if (parts.length > 2 && parts[2]) {
      currentLang.value = parts[2]
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onOutsideClick)
  document.body.style.overflow = ''
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})
</script>

<style scoped>
/* ===== GLOBAL VARS & FONTS ===== */
.orbitron-font {
  font-family: 'Orbitron', system-ui, sans-serif !important;
  letter-spacing: 0.05em;
}

:global(:root) {
  --wf-orange: #ff7800;
  --wf-orange-glow: rgba(255, 120, 0, 0.4);
}

/* ===== PREMIUM THICK GLASS PANEL ===== */
.liquid-panel {
  background: rgba(255, 255, 255, 0.95) !important; 
  backdrop-filter: blur(32px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(32px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 1) !important;
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 1),
    inset 0 0 20px rgba(255, 255, 255, 0.5) !important;
  border-radius: 16px;
}

.dark .liquid-panel {
  background: rgba(24, 24, 28, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.5), 
    inset 0 1px 1px rgba(255, 255, 255, 0.15),
    inset 0 0 20px rgba(255, 255, 255, 0.05) !important;
}

.liquid-panel-full {
  background: rgba(250, 250, 250, 0.6) !important;
  backdrop-filter: blur(32px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(32px) saturate(160%) !important;
}

.dark .liquid-panel-full {
  background: rgba(15, 15, 18, 0.5) !important;
}

/* ===== NAVBAR MAIN (LIQUID BUBBLE HYBRID) ===== */
.nav {
  position: fixed; 
  top: 24px; 
  left: 0; 
  right: 0; 
  z-index: 1000;
  display: flex; 
  justify-content: center; 
  padding: 0 24px; 
  pointer-events: none;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav.scrolled { 
  top: 0; 
  padding: 0; 
}

.nav-inner {
  width: 100%; 
  max-width: 1000px; 
  height: 52px; 
  display: flex; 
  align-items: center;
  justify-content: space-between; 
  padding: 0 16px 0 20px; 
  border-radius: 99px; 
  pointer-events: auto;
  
  background: rgba(255, 255, 255, 0.55) !important; 
  backdrop-filter: blur(28px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(160%) !important;
  
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.04),
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    inset 0 0 20px rgba(255, 255, 255, 0.5) !important; 
    
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav.scrolled .nav-inner {
  max-width: 100%; 
  border-radius: 0; 
  height: 56px; 
  padding: 0 32px;
  
  background: rgba(255, 255, 255, 0.65) !important;
  backdrop-filter: blur(32px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(32px) saturate(180%) !important;
  
  border: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08) !important;
}

.dark .nav-inner {
  background: rgba(20, 20, 22, 0.45) !important; 
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.4), 
    inset 0 1px 1px rgba(255, 255, 255, 0.15),
    inset 0 0 20px rgba(255, 255, 255, 0.03) !important;
}

.dark .nav.scrolled .nav-inner {
  background: rgba(15, 15, 18, 0.55) !important; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important; 
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6) !important;
}

/* ===== LOGO & TEXT ===== */
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.wf-hyper-branding {
  position: relative;
  width: 68px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: skewX(-12deg);
}

.wf-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.wf-path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.wf-ghost {
  stroke: rgba(255, 120, 0, 0.08);
  stroke-width: 2px;
}

.wf-scanner {
  stroke: url(#wf-trace-grad);
  stroke-width: 3.5px;
  filter: url(#wf-phantom-glow) drop-shadow(0 0 10px rgba(255, 0, 0, 0.5));
  animation: 
    wf-phantom-dash 2s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    wf-phantom-offset 2s linear infinite,
    wf-phantom-flicker 0.15s infinite alternate;
}

@keyframes wf-phantom-dash {
  0% { stroke-dasharray: 0 1 300 0; }
  50% { stroke-dasharray: 0 300 1 0; }
  100% { stroke-dasharray: 300 1 0 0; }
}

@keyframes wf-phantom-offset {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -300; }
}

@keyframes wf-phantom-flicker {
  0% { opacity: 1; stroke-width: 3.5px; }
  100% { opacity: 0.8; stroke-width: 4px; }
}

.logo-icon-wrap { 
  position: relative;
  display: flex; 
  align-items: center; 
  justify-content: center; 
}


.logo-text { display: flex; align-items: center; }
.logo-text .wild { font-size: 14px; font-weight: 800; color: inherit; }
.logo-text .fire { font-size: 14px; font-weight: 800; background: linear-gradient(135deg, #ff9a44, #ff5c1a); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.logo-docs { display: inline-flex; align-items: center; font-size: 8px; font-weight: 800; color: var(--wf-orange); margin-left: 6px; padding: 2px 6px; border-radius: 99px; background: rgba(255, 120, 0, 0.1); border: 1px solid rgba(255, 120, 0, 0.2); text-transform: uppercase; }

/* ===== 🪄 THE SEGMENTED GLASS TRACK (LINKS) 🪄 ===== */
.nav-links { display: flex; position: absolute; left: 50%; transform: translateX(-50%); }

.links-track {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 99px;
  box-shadow: 
    inset 0 2px 5px rgba(0, 0, 0, 0.05),
    inset 0 -1px 2px rgba(255, 255, 255, 0.5);
}

.dark .links-track {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.02);
}

.nav-item {
  position: relative; 
  padding: 6px 16px; 
  font-size: 11px; 
  font-weight: 700; 
  text-transform: uppercase; 
  text-decoration: none; 
  border-radius: 99px; 
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: rgba(15, 23, 42, 0.7); /* Deep Slate pentru contrast maxim pe light */
  display: flex;
  align-items: center;
  gap: 8px;
}

.dark .nav-item { color: rgba(255, 255, 255, 0.5); }

.nav-icon {
  opacity: 0.5;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: grayscale(0.5);
}

/* Efectul de Glass Sheen la Hover */
.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.06);
  color: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.dark .nav-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-item:hover .nav-icon, .nav-item.active .nav-icon {
  opacity: 1;
  filter: grayscale(0) drop-shadow(0 0 5px var(--wf-orange-glow));
  transform: scale(1.1);
}

/* Pastila Activă - Liquid Quartz Style */
.nav-item.active {
  background: linear-gradient(135deg, rgba(255, 120, 0, 0.15), rgba(255, 92, 26, 0.08));
  border-color: rgba(255, 120, 0, 0.3);
  color: var(--wf-orange);
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.2),
    0 4px 10px rgba(255, 120, 0, 0.1);
}

.dark .nav-item.active {
  background: linear-gradient(135deg, rgba(255, 120, 0, 0.12), rgba(255, 92, 26, 0.05));
  border-color: rgba(255, 120, 0, 0.2);
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.05),
    0 4px 15px rgba(0, 0, 0, 0.2);
}

.active-glow {
  position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%);
  width: 16px; height: 2px; border-radius: 2px; background: var(--wf-orange);
}

/* ===== RIGHT SIDE & BUTTONS ===== */
.nav-right { 
  display: flex; 
  align-items: center; 
  gap: 16px; /* Spațiu mai generos între elemente */
}
/* ==========================================================================
   HEAVY LIQUID GLASS THEME SWITCHER (SLOW & FIXED)
   ========================================================================== */

.liquid-theme-toggle {
  width: 70px; 
  height: 32px;
  border-radius: 40px;
  position: relative;
  display: block; /* Am scos flex-ul de pe containerul mare ca să nu mai strice iconițele */
  padding: 0;
  cursor: pointer;
  outline: none;
  border: none;
  background: transparent;
  -webkit-tap-highlight-color: transparent; 
}

/* TRACK-UL (Gaura) */
.toggle-track-glass {
  position: absolute;
  inset: 0;
  border-radius: 40px;
  background: rgba(20, 20, 30, 0.2); 
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.6s ease;
}

html:not(.dark) .toggle-track-glass {
  background: rgba(0, 0, 0, 0.04);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.06),
    inset 0 -1px 2px rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* SLIDER-UL (Pastila care alunecă l e n t) */
.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border-radius: 26px;
  z-index: 2;
  
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
              width 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.8s ease;
}

html:not(.dark) .toggle-slider {
  background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 
    0 4px 10px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Deplasarea lentă pe track */
.liquid-theme-toggle.is-dark .toggle-slider {
  transform: translateX(38px);
}

/* Gelul se lățește */
.liquid-theme-toggle:active .toggle-slider {
  width: 40px; 
}

.liquid-theme-toggle.is-dark:active .toggle-slider {
  transform: translateX(27px); 
}

/* =======================================================
   ICONIȚELE (Acum sunt așezate perfect și nu se mai strică)
   ======================================================= */
.toggle-icons {
  position: absolute;
  inset: 0;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 5; /* Peste slider */
  pointer-events: none; /* Lasă click-ul să treacă prin ele direct la buton */
}

.icon-box {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.3); 
  /* Timp de reacție albe/luminoase crescut și el pt armonie */
  transition: color 1s ease, transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
}

html:not(.dark) .icon-box {
  color: rgba(0, 0, 0, 0.3);
}

/* Stare activă SOARE */
.liquid-theme-toggle:not(.is-dark) .icon-box.sun {
  color: #111;
  transform: scale(1.15); 
}

/* Stare activă LUNĂ */
.liquid-theme-toggle.is-dark .icon-box.moon {
  color: #60a5fa; 
  transform: scale(1.1);
}

/* USER DROPDOWN DESKTOP */
.hn-user-wrap { position: relative; }
.hn-user-trigger { 
  width: 34px; 
  height: 34px; 
  border-radius: 50%; 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  background: rgba(255, 255, 255, 0.02); 
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0; 
  cursor: pointer; 
  position: relative; 
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.hn-user-trigger.is-open, .hn-user-trigger:hover { 
  border-color: var(--wf-orange); 
  transform: translateY(-1px);
}

.hn-user-avatar { 
  width: 100%; 
  height: 100%; 
  border-radius: 50%; 
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hn-user-fallback { 
  width: 100%; 
  height: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: rgba(128, 128, 128, 0.1); 
  border-radius: 50%; 
  color: var(--wf-orange);
}

.hn-online-dot { 
  position: absolute; 
  bottom: -2px; 
  right: -2px; 
  width: 12px; 
  height: 12px; 
  background: #10b981; 
  border-radius: 50%; 
  border: 2px solid #0a0a0f; 
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}
html:not(.dark) .hn-online-dot { border-color: #fff; }

.hn-user-dropdown { position: absolute; top: calc(100% + 14px); right: 0; width: 240px; padding: 12px; border-radius: 16px; display: flex; flex-direction: column; gap: 8px; z-index: 1000; }
.hn-dp-profile { display: flex; align-items: center; gap: 12px; padding: 4px; }
.hn-dp-avatar { border-radius: 50%; border: 2px solid var(--wf-orange-glow); }
.hn-dp-info { display: flex; flex-direction: column; overflow: hidden; }
.hn-dp-name { font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hn-dp-login { font-size: 12px; opacity: 0.6; }
.hn-divider { height: 1px; margin: 4px 0; background: rgba(128,128,128,0.2); }

.hn-btn { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; border: none; transition: all 0.2s; }
.primary-btn { background: linear-gradient(135deg, rgba(255,120,0,0.15), rgba(255,92,26,0.15)); color: var(--wf-orange); border: 1px solid rgba(255,120,0,0.2); }
.primary-btn:hover { background: linear-gradient(135deg, rgba(255,120,0,0.25), rgba(255,92,26,0.25)); border-color: rgba(255,120,0,0.4); transform: translateY(-1px); }
.ghost-btn { background: transparent; color: inherit; opacity: 0.7; }
.ghost-btn:hover { background: rgba(128,128,128,0.1); opacity: 1; }
.full-width { justify-content: center; width: 100%; }

/* LANG SWITCHER DESKTOP */
.hn-lang-wrap { position: relative; display: flex; align-items: center; }
.hn-lang-trigger {
  width: 32px; 
  height: 32px; 
  border-radius: 50%; 
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}
.hn-lang-trigger:hover {
  transform: scale(1.1);
}

.hn-lang-dropdown { 
  position: absolute; 
  top: calc(100% + 14px); 
  right: -10px; 
  width: 160px; 
  padding: 8px; 
  border-radius: 16px; 
  display: flex; 
  flex-direction: column; 
  gap: 4px; 
  z-index: 1000; 
  max-height: 50vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.hn-lang-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
}
.hn-lang-item:hover { 
  background: rgba(255, 255, 255, 0.05); 
  transform: translateX(2px);
}
html:not(.dark) .hn-lang-item:hover {
  background: rgba(0, 0, 0, 0.04);
}
.hn-lang-item.active { 
  background: rgba(255, 106, 51, 0.15); 
  color: #ff6a33; 
  font-weight: 600;
  border-left: 3px solid #ff6a33;
  padding-left: 9px;
}
html:not(.dark) .hn-lang-item.active {
  background: rgba(255, 106, 51, 0.1);
}
.hn-flag {
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  transition: transform 0.2s;
}
.hn-lang-item:hover .hn-flag {
  transform: scale(1.15);
}

/* ===== HAMBURGER & MOBILE TOGGLE ===== */
.mobile-only { display: none; }
.nav-toggle { width: 40px; height: 40px; border: none; background: transparent; border-radius: 50%; cursor: pointer; align-items: center; justify-content: center; }
.hamburger { width: 20px; height: 14px; position: relative; }
.hamburger span { display: block; position: absolute; height: 2px; width: 100%; background: var(--wf-orange); border-radius: 2px; transition: all 0.3s ease; }
.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 6px; }
.hamburger span:nth-child(3) { top: 12px; }
.nav-toggle.is-active .hamburger span:nth-child(1) { top: 6px; transform: rotate(45deg); }
.nav-toggle.is-active .hamburger span:nth-child(2) { opacity: 0; }
.nav-toggle.is-active .hamburger span:nth-child(3) { top: 6px; transform: rotate(-45deg); }

/* ===== FULLSCREEN MOBILE MENU ===== */
.mobile-menu { position: fixed; inset: 0; z-index: 998; display: flex; flex-direction: column; padding: 100px 24px 40px; overflow-y: auto; }

/* Secțiune User Mobile */
.mm-user-section { background: rgba(128,128,128,0.05); padding: 16px; border-radius: 20px; border: 1px solid rgba(128,128,128,0.1); margin-bottom: 8px; }
.mm-user-profile { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.mm-avatar { border-radius: 50%; border: 2px solid var(--wf-orange-glow); }
.mm-user-info { display: flex; flex-direction: column; }
.mm-name { font-size: 16px; font-weight: 700; }
.mm-login { font-size: 13px; opacity: 0.6; }
.mm-user-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.hn-guest {
  padding: 12px 0 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.hn-guest-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 120, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff7800;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 120, 0, 0.2);
  box-shadow: inset 0 0 15px rgba(255, 120, 0, 0.1);
}

.hn-guest-title {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.hn-guest-sub {
  font-size: 11px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.5);
  max-width: 180px;
}

.dark .hn-guest-title { color: #fff; }
html:not(.dark) .hn-guest-title { color: #111; }
html:not(.dark) .hn-guest-sub { color: rgba(0, 0, 0, 0.5); }
html:not(.dark) .hn-guest-icon { background: rgba(255, 120, 0, 0.05); } 
.mm-divider { margin: 16px 0; }

.mobile-menu-links { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.mm-link { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 20px; font-size: 18px; font-weight: 700; text-decoration: none; background: rgba(128,128,128,0.05); color: inherit; border: 1px solid transparent; transition: all 0.2s; }
.mm-link:active { transform: scale(0.97); }
.mm-icon { display: flex; align-items: center; opacity: 0.7; }
.mm-icon :deep(svg) { width: 24px; height: 24px; }
.mm-link.mm-active { background: rgba(255, 120, 0, 0.1); border-color: rgba(255, 120, 0, 0.2); color: var(--wf-orange); }
.mm-link.mm-active .mm-icon { opacity: 1; }
.mm-link.mm-active .mm-icon :deep(svg) { stroke: var(--wf-orange); filter: drop-shadow(0 0 8px var(--wf-orange-glow)); }

.mm-footer { margin-top: auto; padding-top: 24px; display: flex; flex-direction: column; gap: 12px; }
.mm-theme-btn { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; border-radius: 20px; background: rgba(128,128,128,0.1); border: none; color: inherit; font-size: 16px; font-weight: 700; text-transform: uppercase; cursor: pointer; }


/* ===== ANIMATIONS ===== */
.dropdown-pop-enter-active, .dropdown-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-pop-enter-from, .dropdown-pop-leave-to { opacity: 0; transform: scale(0.95) translateY(-10px); }
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: translateY(20px) scale(0.98); }

/* ===== RESPONSIVE MEDIA QUERIES (MISTO FULL) ===== */
@media (max-width: 900px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }
  
  .nav {
    top: 10px; /* Floating look */
    padding: 0 12px;
  }
  
  .nav-inner {
    max-width: 100%;
    border-radius: 20px; /* Island look */
    height: 60px;
    padding: 0 16px; 
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  }

  .dark .nav-inner {
    background: rgba(15, 15, 20, 0.7);
    border-color: rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  /* Redimensionare switcher pe mobile ca să încapă lângă hamburger */
  .liquid-theme-toggle {
    width: 64px;
    height: 32px;
    transform: scale(0.9);
  }
  
  .liquid-theme-toggle.is-dark .toggle-slider {
    transform: translateX(32px);
  }
  
  .liquid-theme-toggle:active .toggle-slider {
    width: 40px;
  }
  
  .liquid-theme-toggle.is-dark:active .toggle-slider {
    transform: translateX(20px);
  }

  .toggle-slider {
    width: 24px;
    height: 24px;
  }

  .icon-box :deep(svg) {
    width: 12px;
    height: 12px;
  }

  .nav-right {
    gap: 8px;
  }

  /* Mobile Menu Tuning */
  .mobile-menu {
    padding-top: 85px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
  }
  
  .dark .mobile-menu {
    background: rgba(10, 10, 15, 0.9);
  }

  .mm-user-section {
    background: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
  
  .dark .mm-user-section {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .mm-link {
    background: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-size: 16px;
    padding: 14px 18px;
  }

  .dark .mm-link {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .dark .mm-footer {
    padding: 20px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .mm-footer-note {
    font-size: 11px;
    color: var(--vp-c-text-3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
  }
}
</style>