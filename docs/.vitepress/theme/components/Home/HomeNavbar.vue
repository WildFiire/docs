<template>
  <header class="nav" :class="{ 'scrolled': isScrolled, 'hide-on-desktop': navStyle === 'sidebar' }">
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
                <feGaussianBlur stdDeviation="1.5" result="blur" />
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
                <a href="/panel/" class="hn-btn primary-btn">
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
                <a href="/panel/" class="hn-btn primary-btn full-width">
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

        <button class="theme-btn" @click="settingsOpen = true" aria-label="Settings">
          <Icon icon="solar:settings-bold-duotone" width="16" height="16" />
        </button>

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

  <!-- PANEL SIDEBAR (DESKTOP ONLY WHEN navStyle === 'sidebar') -->
  <aside class="ps-root" :class="{ collapsed: isSidebarCollapsed, 'ps-light': !isDark }" v-if="navStyle === 'sidebar'">
    <div class="ps-rail" aria-hidden="true"></div>

    <!-- HEADER -->
    <div class="ps-header" :class="{ slim: isSidebarCollapsed }">
      <a href="/" class="ps-brand">
        <div class="ps-logo-wrap">
          <img src="/icons/wildfire.webp" alt="WildFire" width="72" height="72">
        </div>
        <div class="ps-brand-text" v-show="!isSidebarCollapsed">
          <span class="ps-brand-name">
            <span class="ps-brand-wf">WILD</span><span class="ps-brand-fire">FIRE</span>
          </span>
          <span class="ps-brand-tag">DOCS</span>
        </div>
      </a>
      
      <!-- Top Collapse Toggle -->
      <button class="ps-collapse-top" @click="toggleSidebarCollapse" :title="isSidebarCollapsed ? 'Expand' : 'Collapse'">
        <Icon v-if="isSidebarCollapsed" icon="solar:hamburger-menu-linear" width="18" height="18" />
        <Icon v-else icon="solar:sidebar-minimalistic-line-duotone" width="18" height="18" />
      </button>
    </div>

    <!-- NAV -->
    <nav class="ps-nav" data-lenis-prevent>
      <template v-for="group in psNavGroups" :key="group.label">
        <div class="ps-group-label" v-show="!isSidebarCollapsed">
          <span class="ps-gl-line" aria-hidden="true"></span>
          <span class="ps-gl-text">{{ group.label }}</span>
          <span class="ps-gl-line" aria-hidden="true"></span>
        </div>
        <div class="ps-gl-dot" v-show="isSidebarCollapsed" aria-hidden="true"></div>

        <a
          v-for="item in group.items"
          :key="item.id"
          :href="item.link"
          class="ps-item"
          :class="{ active: isActive(item.link) }"
          :title="item.label"
        >
          <span class="ps-track" aria-hidden="true"></span>
          <span class="ps-fill"  aria-hidden="true"></span>
          <span class="ps-icon">
            <Icon :icon="item.icon" width="18" height="18" />
          </span>
          <span class="ps-label" v-show="!isSidebarCollapsed">{{ item.label }}</span>
          <span
            v-if="item.badge && !isSidebarCollapsed"
            class="ps-badge"
            :class="item.badge === 'NEW' ? 'badge-new' : 'badge-live'"
          >{{ item.badge }}</span>
        </a>
      </template>
    </nav>

    <!-- FOOTER (PRO) -->
    <div class="ps-footer">
      
      <!-- User identity card (Pro styling) -->
      <div class="ps-user-card-wrap" :class="{ slim: isSidebarCollapsed }">
        <a :href="navUser ? '/panel/profile' : '/panel/'" class="ps-user" :class="{ slim: isSidebarCollapsed }">
          <template v-if="navUser">
            <div class="ps-av-wrap" :title="navUser.login">
              <div class="ps-av-ring"></div>
              <img :src="navUser.avatar_url" :alt="navUser.login" class="ps-av">
            </div>
            <div class="ps-user-info" v-show="!isSidebarCollapsed" :title="navUser.login">
              <span class="ps-uname">{{ navUser.name || navUser.login }}</span>
              <div class="ps-role-badge">
                <span class="ps-urole">MEMBER</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="ps-av-wrap" title="Login">
              <div class="ps-av-ring guest-ring"></div>
              <Icon icon="solar:user-bold-duotone" width="22" height="22" style="color: rgba(255,255,255,0.7); position: relative; z-index: 2;" />
            </div>
            <div class="ps-user-info" v-show="!isSidebarCollapsed">
              <span class="ps-uname">Guest Session</span>
              <div class="ps-role-badge guest-badge">
                <span class="ps-urole">UNVERIFIED</span>
              </div>
            </div>
          </template>
        </a>
      </div>

      <!-- Quick Actions Dock (Pro styling) -->
      <div class="ps-actions-wrap" v-show="!isSidebarCollapsed">
        <div class="ps-actions-slot">
          
          <div class="ps-lang-rel">
            <button class="ps-act-btn" @click.stop="langMenuOpen = !langMenuOpen" title="Language">
              <Icon :icon="currentFlag" width="16" height="16" />
            </button>
            <transition name="dropdown-pop">
              <div v-if="langMenuOpen" class="hn-lang-dropdown liquid-panel notranslate ps-lang-popup">
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

          <div class="ps-act-divider"></div>
          <button class="ps-act-btn" @click="settingsOpen = true" title="Settings">
            <Icon icon="solar:settings-linear" width="18" height="18" />
          </button>
          <div class="ps-act-divider"></div>
          <button class="ps-act-btn" @click="toggleTheme" title="Theme">
            <svg v-if="!isDark" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          
          <template v-if="navUser">
            <div class="ps-act-divider"></div>
            <button class="ps-act-btn ps-act-danger" @click.stop="navLogout" title="Logout">
              <Icon icon="solar:logout-2-linear" width="18" height="18" />
            </button>
          </template>
        </div>
      </div>
      
      <!-- Return to Home Page button -->
      <a href="/" class="ps-back" :class="{ slim: isSidebarCollapsed }" title="Return to Home">
        <Icon icon="solar:home-smile-angle-linear" width="16" height="16" />
        <span v-show="!isSidebarCollapsed">Return to Home</span>
      </a>

    </div>
  </aside>

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
            <a href="/panel/" class="hn-btn primary-btn" @click="open=false">
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
          <a href="/panel/" class="hn-btn primary-btn full-width" @click="open=false">
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

  <transition name="fade">
    <div class="mobile-overlay" v-if="settingsOpen" @click="settingsOpen = false"></div>
  </transition>

  <transition name="slide-panel">
    <div class="mobile-menu settings-panel" v-if="settingsOpen">
      <div class="mm-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <Icon icon="solar:settings-bold-duotone" width="22" height="22" style="color: var(--wf-orange);" />
          <span class="mm-logo-text orbitron-font">Settings</span>
        </div>
        <button class="mm-close" @click="settingsOpen = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="settings-content">
        <div class="settings-intro">
          <h3 class="settings-intro-title orbitron-font">Customize Experience</h3>
          <p class="settings-intro-desc">Personalize your interface to match your workflow preferences.</p>
        </div>
        
        <div class="settings-group">
          <div class="settings-group-header">
            <h4 class="settings-title orbitron-font" style="margin-bottom: 0;">Navigation Layout</h4>
            <span class="settings-badge">Primary</span>
          </div>
          <p class="settings-desc">Select how you want to browse the documentation layout.</p>
          <div class="nav-style-options">
            <button class="style-btn" :class="{ active: navStyle === 'sidebar' }" @click="setNavStyle('sidebar')">
              <div class="style-icon-wrap">
                <Icon icon="solar:sidebar-minimalistic-bold-duotone" width="28" height="28" />
              </div>
              <span class="style-btn-text">Sidebar</span>
              <span class="style-btn-sub">Modern approach</span>
            </button>
            <button class="style-btn" :class="{ active: navStyle === 'top' }" @click="setNavStyle('top')">
              <div class="style-icon-wrap">
                <Icon icon="solar:menu-dots-square-bold-duotone" width="28" height="28" />
              </div>
              <span class="style-btn-text">Top Nav</span>
              <span class="style-btn-sub">Classic horizontal</span>
            </button>
          </div>
        </div>
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
const settingsOpen = ref(false)
const navStyle = ref('sidebar')
const isSidebarCollapsed = ref(false)

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

const setNavStyle = (style: string) => {
  navStyle.value = style
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('wf-home-nav-style', style)
  }
}

const toggleSidebarCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('wf-sidebar-collapsed', isSidebarCollapsed.value ? 'true' : 'false')
  }
}

const psNavGroups = computed(() => {
  const sidebar = theme.value.sidebar || []
  
  const extractIcon = (text: string) => {
    if (!text) return 'solar:document-text-bold-duotone'
    const match = text.match(/icon="([^"]+)"/)
    if (match) return match[1]
    if (text.includes('credits.svg')) return 'solar:wad-of-money-bold-duotone'
    return 'solar:document-text-bold-duotone'
  }

  const dynamicGroups = sidebar.map((group: any) => {
    const label = cleanText(group.text)
    const flatItems: any[] = []
    
    const extractItems = (items: any[]) => {
      if (!items) return
      for (const item of items) {
        if (item.link) {
          flatItems.push({
            id: item.link,
            label: cleanText(item.text).replace(/v\d+\.\d+\.\d+/, '').trim(),
            link: item.link,
            icon: extractIcon(item.text),
            badge: item.text.includes('NEW') ? 'NEW' : (item.text.includes('LIVE') ? 'LIVE' : '')
          })
        }
        if (item.items) {
          extractItems(item.items)
        }
      }
    }
    extractItems(group.items)

    return {
      label: label.replace(/v\d+\.\d+\.\d+/, '').trim(),
      items: flatItems
    }
  }).filter((g: any) => g.items && g.items.length > 0)

  // Construct Final Layout
  const finalGroups = [
    {
      label: 'Main Menu',
      items: [
        { id: 'informatii', label: 'Informatii', link: '/informatii/about', icon: 'solar:info-circle-bold-duotone' },
        { id: 'faq', label: 'FAQ', link: '/informatii/faq', icon: 'solar:question-circle-bold-duotone' },
        { id: 'updates', label: 'Updates Hub', link: '/hub/', icon: 'solar:fire-bold-duotone', badge: 'NEW' },
        { id: 'dashboard', label: 'Dashboard Panel', link: '/panel/', icon: 'solar:chart-square-bold-duotone' },
        { id: 'echipa', label: 'Echipa', link: '/about/team', icon: 'solar:users-group-two-rounded-bold-duotone' }
      ]
    },
    ...dynamicGroups,
    {
      label: 'Platform Links',
      items: [
        { id: 'discord', label: 'Discord Community', link: 'https://discord.gg/wildfire', icon: 'ic:baseline-discord' },
        { id: 'tiktok', label: 'TikTok', link: 'https://www.tiktok.com/@wildfire.ro', icon: 'solar:play-stream-bold-duotone' }
      ]
    }
  ]

  return finalGroups
})

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
    const savedStyle = localStorage.getItem('wf-home-nav-style')
    if (savedStyle === 'sidebar' || savedStyle === 'top') {
      navStyle.value = savedStyle
    }
    const collapsedState = localStorage.getItem('wf-sidebar-collapsed')
    if (collapsedState === 'true') isSidebarCollapsed.value = true
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
@media (min-width: 901px) {
  .nav.hide-on-desktop {
    display: none !important;
  }
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
  overflow: visible;
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
  background: rgba(14, 12, 16, 0.75);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 120, 0, 0.15);
  box-shadow: 0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
}
.dark .nav.scrolled .nav-inner {
  background: rgba(10, 8, 14, 0.96);
  border-color: transparent;
  border-bottom: 1px solid rgba(255, 120, 0, 0.12);
  box-shadow: 0 2px 20px rgba(0,0,0,0.55);
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
.wf-ghost { stroke: rgba(255,120,0,0.05); stroke-width: 1.5px; }
.wf-scanner {
  stroke: url(#wf-trace-grad);
  stroke-width: 2.5px;
  opacity: 0.85;
  animation: wf-phantom-dash 2.4s cubic-bezier(0.4,0,0.2,1) infinite,
             wf-phantom-offset 2.4s linear infinite;
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
.nav-item.active .nav-icon { opacity: 1; }

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
  /* glow removed */
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
.hn-flag { flex-shrink: 0; }
.hn-lang-item:hover .hn-flag { transform: scale(1.1); }

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

/* ===== SETTINGS DRAWER ===== */
.settings-panel {
  z-index: 1005;
}
.settings-content {
  padding: 24px 18px;
}
.settings-group {
  margin-bottom: 24px;
}
.settings-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  letter-spacing: 1px;
}
.nav-style-options {
  display: flex;
  gap: 12px;
}
.style-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 10px;
  border-radius: 12px;
  background: rgba(128,128,128,0.05);
  border: 1px solid rgba(128,128,128,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
}
.style-btn:hover {
  background: rgba(128,128,128,0.1);
}
.style-btn.active {
  background: rgba(255,120,0,0.1);
  border-color: rgba(255,120,0,0.3);
  color: var(--wf-orange);
}

/* ===== SETTINGS DRAWER ENHANCEMENTS ===== */
.settings-intro {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px dashed rgba(128,128,128,0.15);
}
.settings-intro-title {
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: var(--vp-c-text-1);
}
.settings-intro-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.4;
}
.settings-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.settings-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(255,120,0,0.1);
  color: var(--wf-orange);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.settings-desc {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin: 0 0 14px 0;
  opacity: 0.8;
}
.style-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(128,128,128,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}
.style-btn:hover .style-icon-wrap {
  background: rgba(128,128,128,0.1);
  transform: scale(1.05);
}
.style-btn.active .style-icon-wrap {
  background: rgba(255,120,0,0.15);
  color: var(--wf-orange);
}
.style-btn-text {
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 2px;
}
.style-btn-sub {
  font-size: 10px;
  color: var(--vp-c-text-2);
  opacity: 0.7;
}

/* ===== PANEL SIDEBAR STYLES (ps-*) ===== */
.ps-root {
  --ac:      #ff7800;
  --ac-lo:   rgba(255,120,0,0.10);
  --ac-mid:  rgba(255,120,0,0.22);
  --ac-hi:   rgba(255,120,0,0.42);
  --ac-glow: 0 0 20px rgba(255,120,0,0.38);
  --txt:     #eeeef8;
  --txt-m:   #60607c;
  --txt-s:   #8888a4;
  --bg:      rgba(7,7,14,0.84);
  --border:  rgba(255,255,255,0.052);
  --W:       262px;
  --Wc:      68px;
  --ease:    cubic-bezier(0.34,1.56,0.64,1);
  --dur:     0.36s;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--W);
  flex-shrink: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: hidden;
  isolation: isolate;
  background: var(--bg);
  color: var(--txt);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border-right: 1px solid var(--border);
  box-shadow: 4px 0 48px rgba(0,0,0,0.6);
  transition: width var(--dur) var(--ease);
  will-change: width;
}
.ps-root.collapsed { width: var(--Wc); }
.ps-root::-webkit-scrollbar { display: none; }

/* RAIL LINE */
.ps-rail {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--ac-mid) 18%,
    var(--ac-hi) 50%,
    var(--ac-mid) 82%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* HEADER & BRAND */
.ps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px;
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.ps-root.ps-light .ps-header {
  border-bottom-color: rgba(0,0,0,0.07);
}
.ps-header.slim {
  flex-direction: column;
  padding: 16px 0;
  gap: 16px;
  justify-content: center;
}

.ps-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
  flex: 1;
  min-width: 0;
  border-radius: 12px;
  padding: 4px;
  margin: -4px;
  transition: background 0.18s;
}
.ps-brand:hover { background: rgba(255,255,255,0.025); }
.ps-root.ps-light .ps-brand:hover { background: rgba(0,0,0,0.018); }

.ps-root.collapsed .ps-brand {
  display: flex;
  justify-content: center;
}

.ps-collapse-top {
  background: transparent;
  border: none;
  color: var(--txt-m);
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.ps-collapse-top:hover {
  background: rgba(255,255,255,0.05);
  color: var(--txt);
}
.ps-root.ps-light .ps-collapse-top:hover {
  background: rgba(0,0,0,0.05);
  color: #000;
}

.ps-logo-wrap {
  width: 40px; height: 40px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,120,0,0.22);
  background: rgba(255,120,0,0.06);
  flex-shrink: 0;
  transition: border-color 0.2s, background 0.2s;
}
.ps-brand:hover .ps-logo-wrap {
  border-color: rgba(255,120,0,0.4);
  background: rgba(255,120,0,0.1);
}
.ps-logo-wrap img { width: 30px; height: 30px; object-fit: contain; display: block; }

.ps-brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  min-width: 0;
}
.ps-brand-name {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1;
  white-space: nowrap;
  font-family: 'Orbitron', sans-serif;
  display: block;
}
.ps-brand-wf   { color: var(--txt); }
.ps-brand-fire { color: var(--ac); }

.ps-brand-tag {
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--txt-m);
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  white-space: nowrap;
  opacity: 0.55;
}

/* NAV */
.ps-nav {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 6px 0 6px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
}
.ps-nav::-webkit-scrollbar { display: none; }

.ps-group-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px 5px;
  pointer-events: none;
  user-select: none;
}
.ps-gl-text {
  font-size: 8px; font-weight: 800;
  letter-spacing: 2.8px; color: var(--txt-m);
  text-transform: uppercase; font-family: 'Orbitron', sans-serif;
  opacity: 0.55; white-space: nowrap; flex-shrink: 0;
}
.ps-gl-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border));
}
.ps-gl-line:first-child {
  background: linear-gradient(90deg, var(--border), transparent);
  max-width: 8px; flex: 0 0 8px;
}

.ps-gl-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--ac-mid);
  margin: 10px auto 4px;
  flex-shrink: 0;
}

.ps-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 13px;
  margin: 1.5px 8px;
  min-height: 38px;
  height: auto;
  border-radius: 11px;
  cursor: pointer;
  color: var(--txt-m);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  background: transparent;
  width: calc(100% - 16px);
  text-align: left;
  text-decoration: none;
  font-family: 'Orbitron', sans-serif;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.28s var(--ease);
  will-change: transform;
}

.ps-track {
  position: absolute;
  left: 0; top: 22%; bottom: 22%;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #ffb347, #ff4400);
  opacity: 0;
  transform: scaleY(0.3);
  transform-origin: center;
  transition: opacity 0.22s, transform 0.3s var(--ease);
  pointer-events: none;
}
.ps-fill {
  position: absolute;
  inset: 0; border-radius: inherit;
  background: rgba(255,255,255,0.05);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.ps-item:hover { color: var(--txt); border-color: rgba(255,255,255,0.09); transform: translateX(4px); }
.ps-item:hover .ps-fill { opacity: 1; }
.ps-item:hover .ps-icon { opacity: 1; transform: scale(1.08); }

.ps-item.active {
  color: var(--ac);
  border-color: rgba(255,120,0,0.18);
  transform: translateX(0) !important;
  background: linear-gradient(115deg, rgba(255,120,0,0.12) 0%, rgba(255,80,0,0.05) 55%, transparent 100%);
}
.ps-item.active .ps-track { opacity: 1; transform: scaleY(1); }
.ps-item.active .ps-fill  { opacity: 0; }

.ps-icon {
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; opacity: 0.48;
  transition: opacity 0.2s, transform 0.22s var(--ease), filter 0.2s;
  position: relative; z-index: 1;
}
.ps-item.active .ps-icon { opacity: 1; }

.ps-label {
  flex: 1; white-space: nowrap; overflow: hidden;
  position: relative; z-index: 1; text-transform: uppercase;
}

.ps-badge {
  font-size: 7px; font-weight: 800; letter-spacing: 0.7px;
  padding: 2px 7px; border-radius: 20px;
  flex-shrink: 0; position: relative; z-index: 1;
}
.badge-live { color: #22c55e; border: 1px solid rgba(34,197,94,0.28); background: rgba(34,197,94,0.08); }
.badge-new  { color: #a78bfa; border: 1px solid rgba(167,139,250,0.28); background: rgba(167,139,250,0.08); }

.ps-root.collapsed .ps-item {
  justify-content: center; padding: 0;
  width: calc(100% - 16px); transform: none !important;
}
.ps-root.collapsed .ps-item:hover { transform: scale(1.1) !important; }
.ps-root.collapsed .ps-item.active { transform: none !important; }
.ps-root.collapsed .ps-item.active .ps-track { display: none; }

/* PRO FOOTER STYLES */
.ps-footer {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  padding: 20px 14px 14px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.18));
}
.ps-footer::before {
  content: '';
  position: absolute;
  top: 0; left: 14px; right: 14px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
}
.ps-root.ps-light .ps-footer {
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.02));
}
.ps-root.ps-light .ps-footer::before {
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
}

.ps-user-card-wrap {
  margin-bottom: 12px;
}
.ps-user-card-wrap.slim {
  margin-bottom: 0;
}

.ps-user {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.04);
  position: relative;
  overflow: hidden;
}
.ps-user::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(255,120,0,0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.ps-user:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 120, 0, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,120,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08);
}
.ps-user:hover::after { opacity: 1; }

.ps-user.slim {
  padding: 12px;
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  justify-content: center;
}
.ps-user.slim:hover {
  transform: scale(1.05);
}

.ps-root.ps-light .ps-user {
  background: #ffffff;
  border-color: rgba(0,0,0,0.06);
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.ps-root.ps-light .ps-user:hover {
  background: #ffffff;
  border-color: rgba(255,120,0,0.3);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.ps-av-wrap {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px; height: 38px;
}
.ps-av-ring {
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff7800, #ff2200);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 0;
}
.ps-user:hover .ps-av-ring { opacity: 1; }
.guest-ring { background: linear-gradient(135deg, #888, #444); opacity: 0.5; }

.ps-av {
  width: 100%; height: 100%;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  object-fit: cover;
  position: relative;
  z-index: 2;
  background: var(--bg);
}
.ps-root.ps-light .ps-av { border-color: rgba(0,0,0,0.1); }

.ps-user-info {
  display: flex; flex-direction: column;
  gap: 4px; min-width: 0; flex: 1;
  position: relative; z-index: 2;
}
.ps-uname {
  font-size: 13px; font-weight: 700;
  color: var(--txt);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.2px;
  line-height: 1;
}

.ps-role-badge {
  background: linear-gradient(90deg, rgba(255,120,0,0.15), rgba(255,40,0,0.05));
  border: 1px solid rgba(255,120,0,0.2);
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
}
.guest-badge {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
}
.ps-root.ps-light .guest-badge { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); }

.ps-urole {
  font-size: 8.5px; font-weight: 800;
  color: var(--ac); letter-spacing: 1px;
  text-transform: uppercase;
  line-height: 1;
  font-family: 'Orbitron', sans-serif;
}
.guest-badge .ps-urole { color: var(--txt-m); }

.ps-actions-wrap {
  margin-bottom: 8px;
}
.ps-actions-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
.ps-root.ps-light .ps-actions-slot {
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.06);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.ps-act-divider {
  width: 1px; height: 16px;
  background: rgba(255,255,255,0.1);
}
.ps-root.ps-light .ps-act-divider { background: rgba(0,0,0,0.1); }

.ps-act-btn {
  background: transparent;
  border: none;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--txt-m);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
}
.ps-act-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--txt);
  transform: translateY(-1px);
}
.ps-root.ps-light .ps-act-btn:hover {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.ps-act-danger:hover {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #ef4444 !important;
}

.ps-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--txt-m);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  text-decoration: none;
}
.ps-back:hover {
  background: rgba(255, 120, 0, 0.1);
  border-color: rgba(255, 120, 0, 0.3);
  color: var(--ac);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,120,0,0.15);
}
.ps-back.slim {
  padding: 12px;
}

.ps-lang-rel {
  position: relative;
}
.ps-lang-popup {
  position: absolute !important;
  bottom: calc(100% + 12px) !important;
  left: 0 !important;
  top: auto !important;
  right: auto !important;
  margin: 0 !important;
  width: 140px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
  z-index: 1000;
}
.ps-root.ps-light .ps-lang-popup {
  box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;
}

/* ══════════════════════════
   LIGHT THEME
══════════════════════════ */
.ps-root.ps-light {
  --bg:     rgba(246,246,252,0.94);
  --txt:    #16161e;
  --txt-m:  #787896;
  --txt-s:  #4a4a62;
  --border: rgba(0,0,0,0.075);
  background: var(--bg);
  border-right-color: rgba(0,0,0,0.09);
  box-shadow: 4px 0 32px rgba(0,0,0,0.10);
}

.ps-root.ps-light .ps-brand:hover { background: rgba(0,0,0,0.018); }
.ps-root.ps-light .ps-brand-wf   { color: #16161e; }
.ps-root.ps-light .ps-brand-fire { color: var(--ac); }
.ps-root.ps-light .ps-brand-tag  { color: #9090a8; opacity: 0.65; }

.ps-root.ps-light .ps-rail {
  background: linear-gradient(180deg, transparent 0%, rgba(255,120,0,0.2) 20%, rgba(255,120,0,0.38) 50%, rgba(255,120,0,0.2) 80%, transparent 100%);
}
.ps-root.ps-light .ps-logo-wrap { border-color: rgba(255,120,0,0.2); background: rgba(255,120,0,0.05); }

.ps-root.ps-light .ps-item { color: #787896; }
.ps-root.ps-light .ps-item:hover { color: #16161e; border-color: rgba(0,0,0,0.09); }
.ps-root.ps-light .ps-fill { background: rgba(0,0,0,0.042); }
.ps-root.ps-light .ps-item.active {
  color: var(--ac);
  border-color: rgba(255,120,0,0.18);
  background: linear-gradient(115deg, rgba(255,120,0,0.09) 0%, rgba(255,80,0,0.04) 55%, transparent 100%);
}
.ps-root.ps-light .ps-gl-text { color: #9090a8; }
.ps-root.ps-light .ps-gl-line { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08)); }
.ps-root.ps-light .ps-gl-line:first-child { background: linear-gradient(90deg, rgba(0,0,0,0.08), transparent); }
.ps-root.ps-light .ps-gl-dot { background: rgba(255,120,0,0.25); }

.ps-root.ps-light .ps-header { border-bottom-color: rgba(0,0,0,0.07); }
.ps-root.ps-light .ps-collapse-top:hover { background: rgba(0,0,0,0.05); color: #000; }

.ps-root.ps-light .ps-footer {
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.02));
}
.ps-root.ps-light .ps-footer::before {
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
}
.ps-root.ps-light .ps-user {
  background: #ffffff;
  border-color: rgba(0,0,0,0.06);
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.ps-root.ps-light .ps-user:hover {
  background: #ffffff;
  border-color: rgba(255,120,0,0.3);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.ps-root.ps-light .ps-av { border-color: rgba(0,0,0,0.1); }
.ps-root.ps-light .ps-uname { color: #16161e; }
.ps-root.ps-light .guest-badge { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); }

.ps-root.ps-light .ps-actions-slot {
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.06);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}
.ps-root.ps-light .ps-act-divider { background: rgba(0,0,0,0.1); }
.ps-root.ps-light .ps-act-btn { color: var(--txt-m); }
.ps-root.ps-light .ps-act-btn:hover {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.ps-root.ps-light .ps-back {
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.06);
}
.ps-root.ps-light .ps-back:hover {
  background: #ffffff;
  border-color: rgba(255,120,0,0.3);
}
.ps-root.ps-light .ps-lang-popup {
  box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;
  background: #ffffff !important;
  border: 1px solid rgba(0,0,0,0.06);
}
.ps-root.ps-light .hn-lang-item { color: #4a4a62; }
.ps-root.ps-light .hn-lang-item:hover { background: rgba(0,0,0,0.03); color: #16161e; }
.ps-root.ps-light .hn-lang-item.active { background: rgba(255,120,0,0.08); color: var(--ac); }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }

  /* Hide custom panel sidebar on mobile */
  .ps-root {
    display: none !important;
  }
  
  /* Ensure top nav always shows on mobile, overriding hide-on-desktop */
  .nav.hide-on-desktop {
    display: flex !important;
  }

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