<template>
  <ClientOnly>
    <Teleport to=".VPSidebar">
      <div class="wsf-root" ref="wrapRef">

        <!-- Popup (opens upward, above the footer) -->
        <transition name="wsf-pop">
          <div v-if="menuOpen" class="wsf-popup">
            <template v-if="user">
              <a href="/panel/" class="wsf-popup-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                Go to Panel
              </a>
              <button class="wsf-popup-item danger" @click="logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </template>
            <template v-else>
              <a href="/panel/" class="wsf-popup-item highlight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                Login with GitHub
              </a>
            </template>
          </div>
        </transition>

        <!-- Language Popup -->
        <transition name="wsf-pop">
          <div v-if="langMenuOpen" class="wsf-popup wsf-popup-lang notranslate">
            <button 
              v-for="lang in languages" 
              :key="lang.code"
              class="wsf-popup-item" 
              :class="{ 'active': currentLang === lang.code }"
              @click="changeLang(lang.code)"
            >
              <Icon :icon="lang.flag" class="wsf-flag" width="20" height="20" />
              {{ lang.name }}
            </button>
          </div>
        </transition>

        <!-- Hidden Google Translate Element -->
        <div id="google_translate_element" style="display:none;"></div>

        <!-- Pill bar -->
        <div class="wsf-pill">

          <!-- User avatar (left anchor) -->
          <button class="wsf-pill-user" @click="toggleMenu" :title="user ? (user.name || user.login) : 'Login to Panel'">
            <img v-if="user" :src="user.avatar_url" class="wsf-avatar" :alt="user.login" />
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <span v-if="user" class="wsf-online-dot"></span>
          </button>

          <!-- Spacer -->
          <div class="wsf-pill-spacer"></div>

          <!-- Collapse all sub-items button -->
          <button 
            class="wsf-pill-btn" 
            @click="collapseAllSubItems" 
            title="Collapse all open sub-items"
            aria-label="Collapse all open sub-items"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              <line x1="15" y1="12" x2="9" y2="12"/>
            </svg>
          </button>

          <!-- Separator -->
          <div class="wsf-pill-sep"></div>

          <!-- Theme toggle: sun + moon both visible, active one highlighted -->
          <button class="wsf-pill-btn" :class="{ active: !isDark }" @click="isDark && toggleTheme()" title="Light mode" aria-label="Light mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <button class="wsf-pill-btn" :class="{ active: isDark }" @click="!isDark && toggleTheme()" title="Dark mode" aria-label="Dark mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>

          <!-- Language toggle -->
          <div class="wsf-pill-sep"></div>
          <button class="wsf-pill-btn wsf-pill-lang" @click="toggleLangMenu" :title="'Current language: ' + currentLang">
            <Icon :icon="currentFlag" width="20" height="20" />
          </button>

        </div>

      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { Icon } from '@iconify/vue'

const { isDark } = useData()
const route = useRoute()
const user = ref(null)
const menuOpen = ref(false)
const langMenuOpen = ref(false)
const wrapRef = ref(null)

const languages = [
  { code: 'ro', name: 'Romana', flag: 'circle-flags:ro' },
  { code: 'en', name: 'English', flag: 'circle-flags:uk' },
]

const currentLang = ref('ro')

const currentFlag = computed(() => {
  const l = languages.find(l => l.code === currentLang.value)
  return l ? l.flag : 'circle-flags:ro'
})

// Set and remove cookies securely across localhost and prod domains
function updateGoogtransCookie(code) {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const isLocal = host === 'localhost' || host === '127.0.0.1'
  const parts = host.split('.')
  const baseDomain = parts.length >= 2 ? parts.slice(-2).join('.') : host

  // Clear existing
  const past = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = `googtrans=; ${past}`
  if (!isLocal) {
    document.cookie = `googtrans=; ${past} domain=.${host};`
    document.cookie = `googtrans=; ${past} domain=${host};`
    document.cookie = `googtrans=; ${past} domain=.${baseDomain};`
    document.cookie = `googtrans=; ${past} domain=${baseDomain};`
  }

  // Set new
  if (code !== 'ro') {
    document.cookie = `googtrans=/ro/${code}; path=/;`
    if (!isLocal) {
      document.cookie = `googtrans=/ro/${code}; path=/; domain=.${baseDomain};`
    }
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
  return null
}

watch(() => route.path, () => {
  if (currentLang.value !== 'ro') {
    // Force a small delay to let Vue render the new page, then trigger Google Translate's re-evaluation
    setTimeout(() => {
      const gObj = window.google && window.google.translate
      if (gObj) {
        // Some hacky ways to force Google Translate to re-translate the DOM after SPA navigation
        // It's cleaner to just let the user know, or simulate a combo change if available
        const select = document.querySelector('.goog-te-combo')
        if (select) {
          select.value = currentLang.value
          select.dispatchEvent(new Event('change'))
        }
      }
    }, 600)
  }
})

onMounted(() => {
  try {
    const raw = localStorage.getItem('github_user')
    if (raw && localStorage.getItem('github_token')) user.value = JSON.parse(raw)
  } catch {}
  document.addEventListener('click', onOutside)

  // Inject Google Translate script globally
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    document.body.appendChild(script)
  }

  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({
      pageLanguage: 'ro',
      includedLanguages: 'ro,en',
      autoDisplay: false,
    }, 'google_translate_element')
  }

  // Check existing cookie for current lang
  const googtrans = getCookie('googtrans')
  if (googtrans) {
    const parts = googtrans.split('/')
    if (parts.length > 2 && parts[2]) {
      currentLang.value = parts[2]
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onOutside)
})

function onOutside(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) {
    menuOpen.value = false
    langMenuOpen.value = false
  }
}

function toggleMenu() { 
  menuOpen.value = !menuOpen.value 
  langMenuOpen.value = false
}

function toggleLangMenu() {
  langMenuOpen.value = !langMenuOpen.value
  menuOpen.value = false
}

function changeLang(code) {
  currentLang.value = code
  updateGoogtransCookie(code)
  
  // Reload the page without the hash so Google Translate reverts correctly
  window.location.href = window.location.pathname + window.location.search
}

function logout() {
  localStorage.removeItem('github_token')
  localStorage.removeItem('github_user')
  user.value = null
  menuOpen.value = false
}

function toggleTheme() {
  isDark.value = !isDark.value
}

function collapseAllSubItems() {
  nextTick(() => {
    const sidebar = document.querySelector('.VPSidebar')
    if (!sidebar) return

    // Find all collapsible sections that are currently expanded (not collapsed)
    // These are the sub-items like "Regulament" that have children
    const allCollapsibles = sidebar.querySelectorAll('.VPSidebarItem.collapsible:not(.collapsed)')
    
    allCollapsibles.forEach(item => {
      // Skip level-0 items (top-level categories like "Informatii")
      if (item.classList.contains('level-0')) {
        // For level-0, we look inside for expanded sub-items
        const subItems = item.querySelectorAll('.VPSidebarItem.collapsible:not(.collapsed)')
        subItems.forEach(subItem => {
          // Find the caret button and click it to collapse
          const caret = subItem.querySelector(':scope > .item > .caret, :scope > .item > button.caret, .items > .VPSidebarItem > .item > .caret, .items > .VPSidebarItem > .item > button.caret')
          // Also try finding caret in the item's direct structure
          const directCaret = subItem.querySelector('.caret')
          if (directCaret) {
            directCaret.click()
          }
        })
      } else {
        // For non-level-0, collapse directly
        const caret = item.querySelector('.caret')
        if (caret) {
          caret.click()
        }
      }
    })

    // Alternative approach: directly find all carets that are expanded
    // but only for items that have a parent collapsible (sub-items)
    const expandedCarets = sidebar.querySelectorAll('.VPSidebarItem .VPSidebarItem.collapsible:not(.collapsed) > .item > .caret, .VPSidebarItem .VPSidebarItem.collapsible:not(.collapsed) > .item > button.caret')
    expandedCarets.forEach(caret => caret.click())

    // Most reliable method: find carets with aria-expanded="true" 
    // that are nested inside another collapsible (meaning they're sub-items)
    const nestedCarets = sidebar.querySelectorAll('.VPSidebarItem.collapsible .VPSidebarItem.collapsible .caret[aria-expanded="true"], .VPSidebarItem.collapsible .VPSidebarItem.collapsible button.caret[aria-expanded="true"]')
    nestedCarets.forEach(caret => caret.click())
  })
}

watch(isDark, () => {
  document.documentElement.classList.add('theme-switching')
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('theme-switching')
  }))
})
</script>

<style scoped>
/* ── Root: transparent spacer, holds the fade + pill ── */
.wsf-root {
  position: relative;
  flex-shrink: 0;
  padding: 6px 0 8px;
  z-index: 20;
  background: transparent;
  border-top: none;
}

/* ── The pill itself ── */
.wsf-pill {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px 8px;
  border-radius: 10px;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

html:not(.dark) .wsf-pill {
  background: rgba(242, 242, 247, 0.95);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* ── User avatar button (leftmost) ── */
.wsf-pill-user {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
  margin-right: 2px;
}
.wsf-pill-user:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
}
html:not(.dark) .wsf-pill-user {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.4);
}
html:not(.dark) .wsf-pill-user:hover {
  background: rgba(0, 0, 0, 0.09);
  color: rgba(0, 0, 0, 0.8);
}

.wsf-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 120, 0, 0.5);
  display: block;
}
.wsf-online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
  border: 1.5px solid rgba(28, 28, 30, 0.9);
}

/* ── Generic pill icon buttons (socials + theme + collapse) ── */
.wsf-pill-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
html:not(.dark) .wsf-pill-btn {
  color: rgba(0, 0, 0, 0.35);
}
.wsf-pill-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
}
html:not(.dark) .wsf-pill-btn:hover {
  background: rgba(0, 0, 0, 0.07);
  color: rgba(0, 0, 0, 0.8);
}
.wsf-pill-btn.active {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.1);
}
html:not(.dark) .wsf-pill-btn.active {
  color: rgba(0, 0, 0, 0.85);
  background: rgba(0, 0, 0, 0.08);
}

/* Spacer pushes theme toggle to the right */
.wsf-pill-spacer { flex: 1; }

/* Thin vertical separator */
.wsf-pill-sep {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 3px;
  flex-shrink: 0;
}
html:not(.dark) .wsf-pill-sep {
  background: rgba(0, 0, 0, 0.1);
}

/* ── Popup (opens upward) ── */
.wsf-popup {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 12px;
  right: 12px;
  
  /* Thick Glass Core */
  background: rgba(24, 24, 28, 0.95);
  backdrop-filter: blur(32px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(32px) saturate(180%) !important;
  
  /* Glossy Borders & Shadows */
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.5), 
    inset 0 1px 1px rgba(255, 255, 255, 0.15),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
  
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 100;
  max-height: 50vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

html:not(.dark) .wsf-popup {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 1),
    inset 0 0 20px rgba(255, 255, 255, 0.5);
}

.wsf-popup-lang {
  left: auto;
  right: 8px;
  width: 160px;
}

.wsf-popup-item {
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
.wsf-popup-item:hover { 
  background: rgba(255, 255, 255, 0.05); 
  transform: translateX(2px);
}
html:not(.dark) .wsf-popup-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.wsf-popup-item.active { 
  background: rgba(255, 106, 51, 0.15); 
  color: #ff6a33; 
  font-weight: 600;
  border-left: 3px solid #ff6a33;
  padding-left: 9px;
}
html:not(.dark) .wsf-popup-item.active {
  background: rgba(255, 106, 51, 0.1);
}

.wsf-popup-item.highlight { color: #ff6a33; background: rgba(255,120,0,0.08); }
.wsf-popup-item.highlight:hover { background: rgba(255,120,0,0.15); }
.wsf-popup-item.danger { color: var(--vp-c-text-3); }
.wsf-popup-item.danger:hover { background: var(--vp-c-bg-soft); color: #f87171; }

.wsf-flag {
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  transition: transform 0.2s;
}
.wsf-popup-item:hover .wsf-flag {
  transform: scale(1.15);
}

.wsf-pill-lang {
  font-size: 14px;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Popup animation ── */
.wsf-pop-enter-active,
.wsf-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.wsf-pop-enter-from,
.wsf-pop-leave-to { opacity: 0; transform: translateY(6px); }
</style>

<style>
/* Global CSS to completely hide Google Translate default UI */
html {
  top: 0 !important;
}
body {
  top: 0 !important;
}

/* Hide the banner frame */
iframe.goog-te-banner-frame,
.goog-te-banner-frame {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  width: 0 !important;
}

/* Hide the tooltip that appears on hover */
#goog-gt-tt, 
.goog-te-balloon-frame {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Remove hover background colors applied by GT */
.goog-text-highlight {
  background-color: transparent !important;
  box-shadow: none !important;
}

/* Hide any dynamic containers GT injects */
.VIpgJd-ZVi9od-ORHb-OEVmcd,
.VIpgJd-ZVi9od-l4eHX-hSRGPd,
.VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
  display: none !important;
}

/* Hide the widget container itself */
#google_translate_element {
  display: none !important;
}
</style>