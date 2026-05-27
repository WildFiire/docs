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
              <path class="wf-path wf-ghost" d="M 10 30 L 25 80 L 40 50 L 55 80 L 70 30 M 85 30 L 85 80 M 85 30 L 110 30 M 85 55 L 105 55" />
              <path class="wf-path wf-scanner" d="M 10 30 L 25 80 L 40 50 L 55 80 L 70 30 M 85 30 L 85 80 M 85 30 L 110 30 M 85 55 L 105 55" />
            </g>
          </svg>
        </div>
        <span class="logo-wordmark">
          <span class="logo-name orbitron-font">Wild<span class="logo-fire">fire</span></span>
          <span class="logo-badge orbitron-font">DOCS</span>
        </span>
      </a>

      <nav class="nav-links desktop-only">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="item.link"
          class="nav-item orbitron-font"
          :class="{ active: isActive(item.link) }"
        >
          <Icon v-if="getNavIcon(item.text)" :icon="getNavIcon(item.text)" class="nav-icon" width="13" height="13" />
          <span class="nav-item-text">{{ cleanText(item.text) }}</span>
          <span class="nav-item-indicator"></span>
        </a>
      </nav>

      <div class="nav-right">
        <div class="hn-user-wrap desktop-only" ref="userWrapRef">
          <button class="hn-user-trigger" :class="{ 'is-open': userOpen }" @click="userOpen = !userOpen" :title="navUser ? (navUser.name || navUser.login) : 'Panel'">
            <img v-if="navUser" :src="navUser.avatar_url" class="hn-user-avatar" :alt="navUser.login" width="32" height="32" />
            <span v-else class="hn-user-fallback">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
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
                    <Icon icon="solar:shield-user-bold-duotone" width="28" height="28" />
                  </div>
                  <span class="hn-guest-title orbitron-font notranslate">Wildfire Portal</span>
                  <span class="hn-guest-sub">Autentificare pentru acces panel.</span>
                </div>
                <a href="/panel" class="hn-btn primary-btn full-width">
                  <Icon icon="mdi:github" width="16" height="16" />
                  Login cu GitHub
                </a>
              </template>
            </div>
          </transition>
        </div>

        <div class="nav-separator desktop-only"></div>

        <div class="hn-lang-wrap" ref="langWrapRef">
          <button class="hn-lang-trigger" @click="langMenuOpen = !langMenuOpen" :title="'Current language: ' + currentLang">
            <Icon :icon="currentFlag" width="18" height="18" />
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
                <Icon :icon="lang.flag" class="hn-flag" width="18" height="18" />
                {{ lang.name }}
              </button>
            </div>
          </transition>
        </div>

        <button class="theme-btn" @click="toggleTheme" :aria-label="isDark ? 'Switch to Light' : 'Switch to Dark'">
          <transition name="theme-icon" mode="out-in">
            <svg v-if="!isDark" key="sun" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else key="moon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </transition>
        </button>

        <button class="nav-toggle mobile-only" :class="{ 'is-active': open }" @click="toggle" aria-label="Menu">
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

    </div>
  </header>

  <div id="google_translate_element" style="display:none;"></div>

  <transition name="fade">
    <div class="mobile-overlay" v-if="open" @click="toggle"></div>
  </transition>

  <transition name="slide-panel">
    <div class="mobile-menu" v-if="open">
      <div class="mm-header">
        <a href="/" class="mm-logo" @click="open=false">
          <span class="orbitron-font mm-logo-text">Wild<span class="mm-logo-fire">fire</span> <span class="mm-logo-docs">DOCS</span></span>
        </a>
        <button class="mm-close" @click="toggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="mm-user-section">
        <template v-if="navUser">
          <div class="mm-user-profile">
            <img :src="navUser.avatar_url" class="mm-avatar" :alt="navUser.login" width="44" height="44" />
            <div class="mm-user-info">
              <span class="mm-name">{{ navUser.name || navUser.login }}</span>
              <span class="mm-login">@{{ navUser.login }}</span>
            </div>
          </div>
          <div class="mm-user-actions">
            <a href="/panel" class="hn-btn primary-btn" @click="open=false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
              Dashboard
            </a>
            <button class="hn-btn ghost-btn" @click="navLogout(); open=false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </template>
        <template v-else>
          <div class="mm-guest">
            <span class="orbitron-font mm-guest-title notranslate">Wildfire Portal</span>
            <span class="mm-guest-sub">Sign in to access dev tools.</span>
          </div>
          <a href="/panel" class="hn-btn primary-btn full-width" @click="open=false">
            <Icon icon="mdi:github" width="16" height="16" />
            Login cu GitHub
          </a>
        </template>
      </div>

      <div class="hn-divider mm-divider"></div>

      <nav class="mobile-menu-links">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="item.link"
          @click="open=false"
          class="mm-link"
          :class="{ 'mm-active': isActive(item.link) }"
        >
          <span class="mm-link-icon">
            <Icon :icon="getNavIcon(item.text)" width="18" height="18" />
          </span>
          <span class="orbitron-font mm-link-text">{{ cleanText(item.text) }}</span>
          <svg class="mm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </nav>

      <div class="mm-footer notranslate">
        <div class="mm-footer-controls">
          <div class="hn-lang-wrap">
            <button class="hn-lang-trigger" @click="langMenuOpen = !langMenuOpen">
              <Icon :icon="currentFlag" width="18" height="18" />
            </button>
            <transition name="dropdown-pop">
              <div v-if="langMenuOpen" class="hn-lang-dropdown liquid-panel notranslate mm-lang-up">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  class="hn-lang-item"
                  :class="{ 'active': currentLang === lang.code }"
                  @click="changeLang(lang.code)"
                >
                  <Icon :icon="lang.flag" class="hn-flag" width="18" height="18" />
                  {{ lang.name }}
                </button>
              </div>
            </transition>
          </div>
          <button class="theme-btn" @click="toggleTheme" :aria-label="isDark ? 'Switch to Light' : 'Switch to Dark'">
            <transition name="theme-icon" mode="out-in">
              <svg v-if="!isDark" key="sun" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg v-else key="moon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </transition>
          </button>
        </div>
        <p class="mm-footer-note orbitron-font">Wildfire Ecosystem</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData, useRoute } from 'vitepress'
import { Icon } from '@iconify/vue'

// Environment detection moved inside functions to fix SSR build
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
  { code: 'ro', name: 'Romana', flag: 'circle-flags:ro' },
  { code: 'en', name: 'English', flag: 'circle-flags:uk' },
]

const currentFlag = computed(() => {
  const l = languages.find(l => l.code === currentLang.value)
  return l ? l.flag : 'circle-flags:ro'
})

function updateGoogtransCookie(code: string) {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const isLocal = host === 'localhost' || host === '127.0.0.1'
  const parts = host.split('.')
  const baseDomain = parts.length >= 2 ? parts.slice(-2).join('.') : host
  
  const past = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  // Clear translation cookie for both local and production on all possible domain scopes
  document.cookie = `googtrans=; ${past}`
  if (!isLocal) {
    document.cookie = `googtrans=; ${past} domain=.${host};`
    document.cookie = `googtrans=; ${past} domain=${host};`
    document.cookie = `googtrans=; ${past} domain=.${baseDomain};`
    document.cookie = `googtrans=; ${past} domain=${baseDomain};`
  }
  
  if (code !== 'ro') {
    document.cookie = `googtrans=/ro/${code}; path=/;`
    if (!isLocal) {
      document.cookie = `googtrans=/ro/${code}; path=/; domain=.${baseDomain};`
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
  // Clear translation cookie for Romanian or set for English
  updateGoogtransCookie(code)
  // Force a hard reload to ensure language switch takes effect
  window.location.href = window.location.pathname + window.location.search
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
  if (t === 'home' || t === 'acasa') return 'solar:home-smile-bold-duotone'
  if (t.includes('informatii') || t.includes('info')) return 'solar:book-bold-duotone'
  if (t.includes('doc') || t.includes('wiki')) return 'solar:library-bold-duotone'
  if (t.includes('team') || t.includes('echipa') || t.includes('staff')) return 'solar:users-group-rounded-bold-duotone'
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

  // Inject Google Translate script globally
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
/* ===== FONTS & VARS ===== */
.orbitron-font {
  font-family: 'Orbitron', system-ui, sans-serif !important;
  letter-spacing: 0.05em;
}

:global(:root) {
  --wf-orange: #ff7800;
  --wf-orange-glow: rgba(255, 120, 0, 0.35);
  --wf-orange-soft: rgba(255, 120, 0, 0.1);
}

/* ===== GLASS PANEL (dropdowns) ===== */
.liquid-panel {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 #fff;
  border-radius: 16px;
}
.dark .liquid-panel {
  background: rgba(16, 16, 20, 0.94);
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07);
}

/* ===== NAVBAR ===== */
.nav {
  position: fixed;
  top: 18px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  pointer-events: none;
  transition: top 0.5s cubic-bezier(0.16,1,0.3,1), padding 0.5s cubic-bezier(0.16,1,0.3,1);
}
.nav.scrolled { top: 0; padding: 0; }

.nav-inner {
  width: 100%;
  max-width: 1140px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 14px;
  border-radius: 22px;
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255, 120, 0, 0.14);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9);
  transition: all 0.55s cubic-bezier(0.16,1,0.3,1);
}

.nav-inner::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,120,0,0.6), transparent);
  opacity: 0.25;
  transition: opacity 0.4s ease;
  border-radius: 0 0 22px 22px;
}
.nav.scrolled .nav-inner::after { opacity: 1; }

.nav.scrolled .nav-inner {
  max-width: 100%;
  border-radius: 0;
  height: 56px;
  padding: 0 36px;
  background: rgba(255,255,255,0.88);
  border-color: transparent;
  border-bottom: 1px solid rgba(255, 120, 0, 0.15);
  box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 0 0 0 transparent;
}

.dark .nav-inner {
  background: linear-gradient(135deg, rgba(255,120,0,0.05) 0%, rgba(10,10,14,0.82) 60%);
  border: 1px solid rgba(255, 120, 0, 0.12);
  box-shadow: 0 4px 20px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,120,0,0.05), inset 0 1px 0 rgba(255,255,255,0.04);
}
.dark .nav.scrolled .nav-inner {
  background: rgba(8,8,12,0.92);
  border-color: transparent;
  border-bottom: 1px solid rgba(255, 120, 0, 0.14);
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
}

/* ===== LOGO ===== */
.nav-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }

.wf-hyper-branding {
  position: relative;
  width: 58px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: skewX(-10deg);
}
.logo-icon-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.wf-svg { width: 100%; height: 100%; overflow: visible; }
.wf-path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.wf-ghost { stroke: rgba(255,120,0,0.08); stroke-width: 2px; }
.wf-scanner {
  stroke: url(#wf-trace-grad);
  stroke-width: 3.5px;
  filter: url(#wf-phantom-glow) drop-shadow(0 0 8px rgba(255,0,0,0.4));
  animation: wf-phantom-dash 2s cubic-bezier(0.4,0,0.2,1) infinite,
             wf-phantom-offset 2s linear infinite,
             wf-phantom-flicker 0.15s infinite alternate;
}

@keyframes wf-phantom-dash {
  0%   { stroke-dasharray: 0 1 300 0; }
  50%  { stroke-dasharray: 0 300 1 0; }
  100% { stroke-dasharray: 300 1 0 0; }
}
@keyframes wf-phantom-offset {
  0%   { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -300; }
}
@keyframes wf-phantom-flicker {
  0%   { opacity: 1; stroke-width: 3.5px; }
  100% { opacity: 0.8; stroke-width: 4px; }
}

.logo-wordmark { display: flex; align-items: baseline; gap: 5px; }

.logo-name {
  font-size: 13px;
  font-weight: 800;
  color: rgba(15,23,42,0.88);
  line-height: 1;
}
.dark .logo-name { color: rgba(255,255,255,0.92); }

.logo-fire {
  background: linear-gradient(135deg, #ff7800, #ff2200);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-badge {
  font-size: 7.5px;
  font-weight: 800;
  color: var(--wf-orange);
  padding: 2px 5px;
  border-radius: 5px;
  background: rgba(255,120,0,0.1);
  border: 1px solid rgba(255,120,0,0.22);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.5;
}

/* ===== NAV LINKS (DESKTOP) ===== */
.nav-links {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: rgba(15,23,42,0.5);
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
}
.dark .nav-item { color: rgba(255,255,255,0.42); }

.nav-icon { opacity: 0.55; flex-shrink: 0; transition: all 0.22s ease; }

.nav-item:hover { color: rgba(15,23,42,0.9); background: rgba(0,0,0,0.04); }
.dark .nav-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.07); }
.nav-item:hover .nav-icon { opacity: 1; }

.nav-item.active {
  color: var(--wf-orange);
  background: rgba(255,120,0,0.08);
  border-color: rgba(255,120,0,0.18);
}
.dark .nav-item.active {
  background: rgba(255,120,0,0.1);
  border-color: rgba(255,120,0,0.22);
}
.nav-item.active .nav-icon { opacity: 1; filter: drop-shadow(0 0 4px var(--wf-orange-glow)); }

.nav-item-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background: var(--wf-orange);
  transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
}
.nav-item.active .nav-item-indicator { transform: translateX(-50%) scaleX(1); }

/* ===== RIGHT SIDE ===== */
.nav-right { display: flex; align-items: center; gap: 8px; }

.nav-separator { width: 1px; height: 18px; background: rgba(128,128,128,0.15); margin: 0 3px; }

/* ===== USER ===== */
.hn-user-wrap { position: relative; }

.hn-user-trigger {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(128,128,128,0.2);
  background: rgba(128,128,128,0.06);
  padding: 0; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
  overflow: hidden;
}
.hn-user-trigger:hover, .hn-user-trigger.is-open {
  border-color: var(--wf-orange);
  box-shadow: 0 0 0 3px rgba(255,120,0,0.12);
  transform: translateY(-1px);
}
.hn-user-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.hn-user-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--wf-orange); }

.hn-user-dropdown {
  position: absolute; top: calc(100% + 12px); right: 0;
  width: 238px; padding: 11px;
  display: flex; flex-direction: column; gap: 6px; z-index: 1001;
}
.hn-dp-profile { display: flex; align-items: center; gap: 10px; padding: 3px 2px; }
.hn-dp-avatar { border-radius: 50%; border: 2px solid var(--wf-orange-glow); flex-shrink: 0; }
.hn-dp-info { display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.hn-dp-name { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hn-dp-login { font-size: 11px; opacity: 0.5; }
.hn-divider { height: 1px; background: rgba(128,128,128,0.12); margin: 2px 0; }

.hn-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 11px; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  cursor: pointer; text-decoration: none;
  border: 1px solid transparent;
  transition: all 0.18s ease; width: 100%;
}
.primary-btn { background: rgba(255,120,0,0.1); color: var(--wf-orange); border-color: rgba(255,120,0,0.2); }
.primary-btn:hover { background: rgba(255,120,0,0.18); border-color: rgba(255,120,0,0.35); transform: translateY(-1px); }
.ghost-btn { background: transparent; color: inherit; opacity: 0.6; }
.ghost-btn:hover { background: rgba(128,128,128,0.08); opacity: 1; }
.full-width { justify-content: center; }

.hn-guest { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 4px 12px; }
.hn-guest-icon {
  width: 46px; height: 46px; border-radius: 50%;
  background: rgba(255,120,0,0.08); border: 1px solid rgba(255,120,0,0.15);
  display: flex; align-items: center; justify-content: center;
  color: var(--wf-orange); margin-bottom: 4px;
}
.hn-guest-title { display: block; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
html:not(.dark) .hn-guest-title { color: #111; }
.dark .hn-guest-title { color: #fff; }
.hn-guest-sub { font-size: 11px; opacity: 0.5; line-height: 1.5; }

/* ===== LANG SWITCHER ===== */
.hn-lang-wrap { position: relative; display: flex; align-items: center; }
.hn-lang-trigger {
  width: 30px; height: 30px; border-radius: 8px;
  border: none; background: transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.18s ease; opacity: 0.78;
}
.hn-lang-trigger:hover { opacity: 1; background: rgba(128,128,128,0.1); transform: scale(1.06); }

.hn-lang-dropdown {
  position: absolute; top: calc(100% + 10px); right: -8px;
  width: 152px; padding: 6px;
  display: flex; flex-direction: column; gap: 2px; z-index: 1001;
}
.mm-lang-up { top: auto; bottom: calc(100% + 10px); }

.hn-lang-item {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  cursor: pointer; border: none; background: transparent;
  width: 100%; text-align: left;
  color: var(--vp-c-text-1); transition: all 0.15s ease;
}
.hn-lang-item:hover { background: rgba(128,128,128,0.08); }
html:not(.dark) .hn-lang-item:hover { background: rgba(0,0,0,0.05); }
.hn-lang-item.active { background: rgba(255,120,0,0.1); color: var(--wf-orange); font-weight: 600; }
html:not(.dark) .hn-lang-item.active { background: rgba(255,120,0,0.08); }
.hn-flag { flex-shrink: 0; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.15)); }
.hn-lang-item:hover .hn-flag { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25)) scale(1.1); }

/* ===== THEME BUTTON ===== */
.theme-btn {
  width: 32px; height: 32px;
  border-radius: 9px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(0,0,0,0.04);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  padding: 0; outline: none; flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
  color: #d97706;
  overflow: hidden;
}
.dark .theme-btn {
  border-color: rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.07);
  color: #93c5fd;
}
.theme-btn:hover {
  background: rgba(0,0,0,0.08);
  border-color: rgba(0,0,0,0.14);
  transform: scale(1.08);
}
.dark .theme-btn:hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,255,255,0.18);
}

.theme-icon-enter-active, .theme-icon-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.theme-icon-enter-from { opacity: 0; transform: rotate(-45deg) scale(0.6); }
.theme-icon-leave-to   { opacity: 0; transform: rotate(45deg) scale(0.6); }

/* ===== HAMBURGER ===== */
.mobile-only { display: none !important; }

.nav-toggle {
  width: 36px; height: 36px;
  border: none; background: transparent;
  border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.18s;
}
.nav-toggle:hover { background: rgba(128,128,128,0.1); }

.hamburger {
  width: 18px; height: 12px; position: relative;
  display: flex; flex-direction: column; justify-content: space-between;
}
.hamburger span {
  display: block; height: 1.5px;
  background: currentColor; border-radius: 2px;
  transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
  transform-origin: center;
}
.nav-toggle.is-active .hamburger span:nth-child(1) { transform: translateY(5.25px) rotate(45deg); }
.nav-toggle.is-active .hamburger span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.nav-toggle.is-active .hamburger span:nth-child(3) { transform: translateY(-5.25px) rotate(-45deg); }

/* ===== MOBILE OVERLAY ===== */
.mobile-overlay {
  position: fixed; inset: 0; z-index: 1001;
  background: rgba(0,0,0,0.38);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* ===== MOBILE MENU DRAWER ===== */
.mobile-menu {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: min(340px, 90vw); z-index: 1002;
  display: flex; flex-direction: column; overflow-y: auto;
  background: rgba(252,252,252,0.97);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border-left: 1px solid rgba(255,255,255,0.8);
  box-shadow: -4px 0 40px rgba(0,0,0,0.1);
}
.dark .mobile-menu {
  background: rgba(11,11,15,0.97);
  border-left: 1px solid rgba(255,255,255,0.07);
  box-shadow: -4px 0 40px rgba(0,0,0,0.5);
}

.mm-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 18px 15px;
  border-bottom: 1px solid rgba(128,128,128,0.09);
  flex-shrink: 0;
}
.mm-logo { text-decoration: none; }
.mm-logo-text { font-size: 14px; font-weight: 800; color: rgba(15,23,42,0.88); }
.dark .mm-logo-text { color: rgba(255,255,255,0.92); }
.mm-logo-fire {
  background: linear-gradient(135deg, #ff7800, #ff2200);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.mm-logo-docs { font-size: 9px; color: var(--wf-orange); }

.mm-close {
  width: 30px; height: 30px; border-radius: 8px;
  border: none; background: rgba(128,128,128,0.08);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: inherit; transition: background 0.15s; flex-shrink: 0;
}
.mm-close:hover { background: rgba(128,128,128,0.15); }

.mm-user-section { padding: 14px 18px; border-bottom: 1px solid rgba(128,128,128,0.08); }
.mm-user-profile { display: flex; align-items: center; gap: 11px; margin-bottom: 12px; }
.mm-avatar { border-radius: 50%; border: 2px solid rgba(255,120,0,0.28); flex-shrink: 0; }
.mm-user-info { display: flex; flex-direction: column; }
.mm-name { font-size: 14px; font-weight: 700; }
.mm-login { font-size: 12px; opacity: 0.5; }
.mm-user-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }

.mm-guest { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 6px 0 12px; }
.mm-guest-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
html:not(.dark) .mm-guest-title { color: #111; }
.dark .mm-guest-title { color: #fff; }
.mm-guest-sub { font-size: 11px; opacity: 0.5; }

.mm-divider { height: 1px; background: rgba(128,128,128,0.09); margin: 0; }

.mobile-menu-links {
  flex: 1; display: flex; flex-direction: column;
  gap: 2px; padding: 10px 10px;
}

.mm-link {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 12px; border-radius: 12px;
  text-decoration: none; color: inherit;
  border: 1px solid transparent;
  transition: all 0.18s ease; position: relative;
}
.mm-link:hover { background: rgba(128,128,128,0.05); }
html:not(.dark) .mm-link:hover { background: rgba(0,0,0,0.03); }
.mm-link.mm-active { background: rgba(255,120,0,0.08); border-color: rgba(255,120,0,0.15); color: var(--wf-orange); }

.mm-link-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: rgba(128,128,128,0.08);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.18s;
}
.mm-link.mm-active .mm-link-icon { background: rgba(255,120,0,0.12); color: var(--wf-orange); }
.mm-link-text { flex: 1; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.08em; font-weight: 700; }

.mm-arrow { opacity: 0.28; flex-shrink: 0; transition: transform 0.18s, opacity 0.18s; }
.mm-link:hover .mm-arrow { opacity: 0.6; transform: translateX(2px); }
.mm-link.mm-active .mm-arrow { opacity: 1; }

.mm-footer {
  padding: 14px 18px 28px; margin-top: auto;
  border-top: 1px solid rgba(128,128,128,0.08);
  display: flex; flex-direction: column; gap: 12px; flex-shrink: 0;
}
.mm-footer-controls { display: flex; align-items: center; gap: 12px; }
.mm-footer-note { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.28; margin: 0; }

/* ===== ANIMATIONS ===== */
.dropdown-pop-enter-active, .dropdown-pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.34,1.56,0.64,1);
}
.dropdown-pop-enter-from, .dropdown-pop-leave-to { opacity: 0; transform: scale(0.93) translateY(-8px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.28s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-panel-enter-active, .slide-panel-leave-active {
  transition: transform 0.34s cubic-bezier(0.16,1,0.3,1);
}
.slide-panel-enter-from, .slide-panel-leave-to { transform: translateX(100%); }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }

  .nav { top: 10px; padding: 0 12px; }
  .nav.scrolled { top: 0; padding: 0; }

  .nav-inner {
    border-radius: 18px;
    height: 54px;
    padding: 0 14px;
  }
  .nav.scrolled .nav-inner { border-radius: 0; padding: 0 18px; }

  .nav-right { gap: 6px; }
}
</style>