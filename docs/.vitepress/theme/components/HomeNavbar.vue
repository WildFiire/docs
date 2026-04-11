<template>
  <header class="nav" :class="{ 
    scrolled: isScrolled,
    'nav-hidden': isNavHidden && !isMobile 
  }">
    <div class="nav-inner">
      <!-- LOGO -->
      <a href="/" class="nav-logo">
        <img src="/icons/wildfire.webp" alt="Wildfire" />
        <span class="logo-text">
          <span class="wild orbitron-font">Wild</span>
          <span class="fire orbitron-font">fire.Ro</span>
          <span class="logo-docs orbitron-font"><Icon icon="mdi:book-open-page-variant" width="10" height="10" style="margin-right: 3px;" />DOCS</span>
        </span>
      </a>

      <!-- LINKS -->
      <nav class="nav-links">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="item.link"
          :class="{ active: isActive(item.link) }"
          class="orbitron-font"
        >
          {{ cleanText(item.text) }}
        </a>
      </nav>

      <!-- RIGHT SIDE -->
      <div class="nav-right">
        <!-- DARK MODE TOGGLE - ICON -->
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'" :aria-label="isDark ? 'Light mode' : 'Dark mode'">
          <span class="toggle-track">
            <svg v-if="isDark" class="toggle-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else class="toggle-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </span>
        </button>

        <!-- USER WIDGET -->
        <div class="hn-user-wrap" ref="userWrapRef">
          <button class="hn-user-trigger" @click="userOpen = !userOpen" :title="navUser ? (navUser.name || navUser.login) : 'Panel'">
            <img v-if="navUser" :src="navUser.avatar_url" class="hn-user-avatar" :alt="navUser.login" />
            <span v-else class="hn-user-fallback">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </span>
            <span v-if="navUser" class="hn-online-dot"></span>
          </button>
          <transition name="hn-pop">
            <div v-if="userOpen" class="hn-user-dropdown">
              <template v-if="navUser">
                <div class="hn-dp-profile">
                  <img :src="navUser.avatar_url" class="hn-dp-avatar" :alt="navUser.login" />
                  <div class="hn-dp-info">
                    <span class="hn-dp-name">{{ navUser.name || navUser.login }}</span>
                    <span class="hn-dp-login">@{{ navUser.login }}</span>
                  </div>
                </div>
                <div class="hn-divider"></div>
                <a href="/panel" class="hn-btn primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                  Go to Panel
                </a>
                <button class="hn-btn ghost" @click="navLogout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </template>
              <template v-else>
                <div class="hn-guest">
                  <span class="hn-guest-title">Wildfire Panel</span>
                  <span class="hn-guest-sub">Login with GitHub to access the docs panel.</span>
                </div>
                <a href="/panel" class="hn-btn primary full">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  Login with GitHub
                </a>
              </template>
            </div>
          </transition>
        </div>

        <!-- DISCORD CTA - IMPROVED -->
        <a
          href="https://discord.gg/Knu76DhE9h"
          target="_blank"
          class="nav-cta"
        >
          <svg class="discord-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.03.02.03.08-.01.1c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.31.61.67 1.19 1.07 1.74c.02.01.05.02.07.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
          </svg>
          <span class="discord-text orbitron-font">DISCORD</span>
        </a>
      </div>

      <!-- MOBILE TOGGLE -->
      <button class="nav-toggle" @click="toggle">
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <!-- MOBILE BOTTOM BAR -->
  <nav class="mobile-bottom" v-if="isMobile">

    <!-- NAV LINKS -->
    <a 
      v-for="item in navItems" 
      :key="item.link"
      :href="item.link"
      @click="open=false"
      class="mbn-item"
      :class="{ active: isActive(item.link) }"
    >
      <span class="mbn-icon" v-html="getIconFromText(item.text)"></span>
      <span class="mbn-label orbitron-font">{{ cleanText(item.text) }}</span>
      <span class="mbn-active-dot" v-if="isActive(item.link)"></span>
    </a>

    <!-- DISCORD -->
    <a href="https://discord.gg/Knu76DhE9h" target="_blank" class="mbn-item mbn-discord">
      <span class="mbn-icon">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.03.02.03.08-.01.1c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.31.61.67 1.19 1.07 1.74c.02.01.05.02.07.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
        </svg>
      </span>
      <span class="mbn-label orbitron-font">Discord</span>
    </a>

    <!-- THEME TOGGLE -->
    <button class="mbn-item mbn-theme" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
      <span class="mbn-icon">
        <!-- Sun (light mode) -->
        <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon (dark mode) -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
      <span class="mbn-label orbitron-font">{{ isDark ? 'Light' : 'Dark' }}</span>
    </button>

    <!-- USER WIDGET -->
    <div class="mbn-item mbn-user-wrap" ref="mobileUserWrapRef">
      <button class="mbn-user-btn" @click="mobileUserOpen = !mobileUserOpen">
        <span class="mbn-icon mbn-avatar-wrap">
          <img v-if="navUser" :src="navUser.avatar_url" class="mbn-avatar" :alt="navUser.login" />
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          <span v-if="navUser" class="mbn-online"></span>
        </span>
        <span class="mbn-label orbitron-font">{{ navUser ? (navUser.login) : 'Login' }}</span>
      </button>
      <transition name="hn-pop">
        <div v-if="mobileUserOpen" class="hn-user-dropdown mobile-dropdown">
          <template v-if="navUser">
            <div class="hn-dp-profile">
              <img :src="navUser.avatar_url" class="hn-dp-avatar" :alt="navUser.login" />
              <div class="hn-dp-info">
                <span class="hn-dp-name">{{ navUser.name || navUser.login }}</span>
                <span class="hn-dp-login">@{{ navUser.login }}</span>
              </div>
            </div>
            <div class="hn-divider"></div>
            <a href="/panel" class="hn-btn primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
              Go to Panel
            </a>
            <button class="hn-btn ghost" @click="navLogout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </template>
          <template v-else>
            <div class="hn-guest">
              <span class="hn-guest-title">Wildfire Panel</span>
              <span class="hn-guest-sub">Login with GitHub to access the docs panel.</span>
            </div>
            <a href="/panel" class="hn-btn primary full">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              Login with GitHub
            </a>
          </template>
        </div>
      </transition>
    </div>

  </nav>

  <!-- MOBILE MENU -->
  <div class="mobile-menu" :class="{ open }">
    <a
      v-for="item in navItems"
      :key="item.link"
      :href="item.link"
      @click="open=false"
    >
      <span v-html="getIconFromText(item.text)"></span>
      <span class="orbitron-font">{{ cleanText(item.text) }}</span>
    </a>
    
    <a href="https://discord.gg/Knu76DhE9h" target="_blank" class="mobile-menu-discord">
      <svg class="discord-icon" viewBox="0 0 24 24" width="18" height="18">
        <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.03.02.03.08-.01.1c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.31.61.67 1.19 1.07 1.74c.02.01.05.02.07.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
      </svg>
      <span class="orbitron-font">DISCORD</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { Icon } from '@iconify/vue'

const { theme, isDark } = useData()
const route = useRoute()

const open = ref(false)
const isScrolled = ref(false)
const isMobile = ref(false)
const lastScrollY = ref(0)
const isNavHidden = ref(false)

const navUser = ref<{ login: string; avatar_url: string; name: string } | null>(null)
const userOpen = ref(false)
const userWrapRef = ref<HTMLElement | null>(null)
const mobileUserOpen = ref(false)
const mobileUserWrapRef = ref<HTMLElement | null>(null)

const navLogout = () => {
  localStorage.removeItem('github_token')
  localStorage.removeItem('github_user')
  navUser.value = null
  userOpen.value = false
  mobileUserOpen.value = false
}

const onUserOutsideClick = (e: MouseEvent) => {
  if (userWrapRef.value && !userWrapRef.value.contains(e.target as Node)) {
    userOpen.value = false
  }
  if (mobileUserWrapRef.value && !mobileUserWrapRef.value.contains(e.target as Node)) {
    mobileUserOpen.value = false
  }
}

const navItems = computed(() => theme.value.nav || [])
const socialLinks = computed(() => theme.value.socialLinks || [])

const isActive = (link: string) => route.path === link
const cleanText = (t: string) => t.replace(/<[^>]+>/g, '').trim()
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

const onScroll = () => {
  const currentScrollY = window.scrollY
  
  // Update scrolled state for background change
  isScrolled.value = currentScrollY > 20
  
  // Handle hide/show on scroll (only for desktop)
  if (!isMobile.value) {
    if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
      // Scrolling down - hide navbar
      isNavHidden.value = true
    } else {
      // Scrolling up - show navbar
      isNavHidden.value = false
    }
  }
  
  lastScrollY.value = currentScrollY
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 900
  // Reset navbar visibility when switching to mobile/desktop
  if (isMobile.value) {
    isNavHidden.value = false
  }
}

watch(isMobile, (newVal) => {
  if (!newVal) open.value = false
})

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', onUserOutsideClick)
  checkMobile()
  try {
    const raw = localStorage.getItem('github_user')
    if (raw && localStorage.getItem('github_token')) {
      navUser.value = JSON.parse(raw)
    }
  } catch {}
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', onUserOutsideClick)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ===== USER WIDGET ===== */
.hn-user-wrap {
  position: relative;
}
.hn-user-trigger {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255, 120, 0, 0.35);
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: visible;
  flex-shrink: 0;
}
.hn-user-trigger:hover {
  border-color: #ff7800;
  box-shadow: 0 0 0 3px rgba(255, 120, 0,0.15);
}
.hn-user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.hn-user-fallback {
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hn-user-trigger:hover .hn-user-fallback { color: #ff7800; }
.hn-online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #0a0a0a;
}
.hn-user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 210px;
  background: #111;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1000;
}
.hn-dp-profile {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 3px 2px;
}
.hn-dp-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 120, 0,0.4);
  flex-shrink: 0;
}
.hn-dp-info { display: flex; flex-direction: column; min-width: 0; }
.hn-dp-name { font-size: 12.5px; font-weight: 600; color: #f0f0f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hn-dp-login { font-size: 11px; color: #555; }
.hn-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 2px 0; }
.hn-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border: none;
  width: 100%;
  text-align: left;
}
.hn-btn.primary { background: rgba(255, 120, 0,0.15); color: #ff6a33; border: 1px solid rgba(255, 120, 0,0.25); }
.hn-btn.primary:hover { background: rgba(255, 120, 0,0.25); color: #ff8050; }
.hn-btn.primary.full { justify-content: center; }
.hn-btn.ghost { background: transparent; color: #555; }
.hn-btn.ghost:hover { background: rgba(255,255,255,0.05); color: #aaa; }
.hn-guest { display: flex; flex-direction: column; gap: 4px; padding: 4px 2px 2px; }
.hn-guest-title { font-size: 12.5px; font-weight: 700; color: #e0e0e0; }
.hn-guest-sub { font-size: 11px; color: #555; line-height: 1.5; }
.hn-pop-enter-active, .hn-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.hn-pop-enter-from, .hn-pop-leave-to { opacity: 0; transform: scale(0.93) translateY(-4px); }

.mobile-user-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-dropdown {
  top: auto !important;
  bottom: calc(100% + 10px) !important;
  right: 0 !important;
}

.hn-pop-enter-from.mobile-dropdown,
.hn-pop-leave-to.mobile-dropdown {
  transform: scale(0.93) translateY(4px) !important;
}

/* ===== FONT ORBITRON ===== */

.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* ===== ORBITRON FONT APPLICATION ===== */
.nav-links a,
.logo-text .wild,
.logo-text .fire,
.discord-text,
.nav-cta span,
.mobile-bottom-link,
.mobile-menu a span,
.mobile-menu-discord span {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* Ajustări specifice */
.nav-links a {
  font-weight: 500 !important;
  font-size: 12px;
  text-transform: uppercase;
}

.logo-text .wild {
  font-weight: 700 !important;
  font-size: 13px;
  color: #ffffff;
}

.logo-text .fire {
  font-weight: 800 !important;
  font-size: 13px;
  background: linear-gradient(135deg, #ff7800, #ff7800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-docs {
  display: inline-flex;
  align-items: center;
  font-size: 8px;
  font-weight: 700;
  color: #ff7800;
  -webkit-text-fill-color: #ff7800;
  letter-spacing: 0.12em;
  margin-left: 6px;
  border: 1px solid rgba(255, 120, 0, 0.3);
  background: rgba(255, 120, 0, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1.4;
  vertical-align: middle;
  position: relative;
  top: -1px;
}

.dark .logo-text .wild {
  color: #ffffff;
}

html:not(.dark) .logo-text .wild {
  color: #000000;
}

.discord-text {
  font-weight: 600 !important;
  font-size: 11px;
  text-transform: uppercase;
}

.nav-cta span {
  font-weight: 600 !important;
}

.mobile-bottom-link {
  font-weight: 600 !important;
  font-size: 11px;
  text-transform: uppercase;
}

.mobile-menu a span {
  font-weight: 500 !important;
  font-size: 16px;
  text-transform: uppercase;
}

.mobile-menu-discord span {
  font-weight: 600 !important;
  font-size: 14px;
}

/* ===== THEME TOGGLE - ICON BUTTON ===== */
.theme-toggle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(255, 120, 0, 0.28);
  background: rgba(255, 120, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.25s ease, box-shadow 0.2s ease;
  padding: 0;
}

.toggle-track {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.toggle-icon {
  color: #ff7800;
  transition: transform 0.3s ease, opacity 0.2s ease;
}

.theme-toggle:hover {
  background: rgba(255, 120, 0, 0.12);
  border-color: rgba(255, 140, 0, 0.7);
  transform: rotate(20deg) scale(1.08);
  box-shadow: 0 0 14px rgba(255, 140, 0, 0.25);
}

.theme-toggle:hover .toggle-icon {
  color: #ff7800;
}

/* ===== NAVBAR MAIN ===== */
.nav {
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  pointer-events: none;
  transition: transform 0.3s ease;
}

.nav.nav-hidden {
  transform: translateY(-100px);
}

.nav-inner {
  width: 100%;
  max-width: 1050px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-radius: 50px;
  transition: all 0.3s ease;
  pointer-events: auto;
  position: relative;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-inner::before {
  display: none;
}

.dark .nav-inner {
  background: #000;
  border: none;
  box-shadow: none;
}

html:not(.dark) .nav-inner {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.nav.scrolled .nav-inner {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
}

/* ===== LOGO ===== */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.nav-logo img {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.nav-logo:hover img {
  transform: scale(1.05);
}

.logo-text {
  display: flex;
  align-items: center;
  gap: 0;
}

.logo-text .wild {
  font-size: 13px;
}

.logo-text .fire {
  font-size: 13px;
}

/* ===== NAVIGATION LINKS ===== */
.nav-links {
  display: flex;
  gap: 2px;
}

.nav-links a {
  font-size: 11.5px;
  text-decoration: none;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  padding: 6px 14px;
  border-radius: 20px;
}

.dark .nav-links a {
  color: rgba(255, 255, 255, 0.6);
}

.dark .nav-links a:hover {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.07);
}

html:not(.dark) .nav-links a {
  color: rgba(0, 0, 0, 0.65);
}

html:not(.dark) .nav-links a:hover {
  color: rgba(0, 0, 0, 0.9);
  background: rgba(0, 0, 0, 0.05);
}

.nav-links a::after {
  display: none;
}

.nav-links a.active {
  color: #ff7800;
  font-weight: 600;
  background: rgba(255, 120, 0, 0.08);
}

.nav-links a[href="/panel"] {
  color: #ff5c1a;
  box-shadow: inset 0 0 0 1px rgba(255, 120, 0, 0.25);
}

.dark .nav-links a[href="/panel"] {
  color: #ff6a33;
  box-shadow: inset 0 0 0 1px rgba(255, 120, 0, 0.22);
}

.nav-links a[href="/panel"]:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 120, 0, 0.55);
  background: rgba(255, 120, 0, 0.1);
  color: #ff7800;
}

/* ===== RIGHT SECTION ===== */
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ===== SOCIAL LINKS - SVG DOAR ALB PE DARK MODE ===== */
.nav-social {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.nav-social-link:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.nav-social-link :deep(svg) {
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

/* Dark mode - SVG-uri doar ALBE, naturale */
.dark .nav-social-link :deep(svg),
.dark .nav-social-link :deep(svg path),
.dark .nav-social-link :deep(svg circle),
.dark .nav-social-link :deep(svg rect) {
  fill: white;
  stroke: none;
}

/* Light mode - SVG-uri negre, naturale */
html:not(.dark) .nav-social-link :deep(svg),
html:not(.dark) .nav-social-link :deep(svg path),
html:not(.dark) .nav-social-link :deep(svg circle),
html:not(.dark) .nav-social-link :deep(svg rect) {
  fill: #333333;
  stroke: none;
}

/* Hover effects */
.nav-social-link:hover :deep(svg) {
  transform: scale(1.1);
}

.dark .nav-social-link:hover :deep(svg) {
  filter: drop-shadow(0 0 4px #ff7800);
}

html:not(.dark) .nav-social-link:hover :deep(svg) {
  filter: drop-shadow(0 0 4px #ff7800);
}

/* ===== DISCORD CTA ===== */
.nav-cta {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #ff7800;
  color: #000;
  border: none;
  box-shadow: none;
}

.nav-cta:hover {
  background: #ff9020;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 120, 0, 0.25);
}

.nav-cta .discord-icon {
  fill: #000;
  stroke: none;
  width: 15px;
  height: 15px;
  transition: transform 0.2s ease;
}

.nav-cta:hover .discord-icon {
  transform: scale(1.1);
}

/* ===== MOBILE TOGGLE ===== */
.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.nav-toggle span {
  width: 18px;
  height: 2px;
  background: linear-gradient(90deg, #ff7800, #ff7800);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* ===== MOBILE BOTTOM — FLOATING DOCK ===== */
.mobile-bottom {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-width: calc(100% - 32px);
  height: 56px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  z-index: 997;
  border-radius: 20px;
  overflow: visible;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
}

.mobile-bottom::after { display: none; }

.dark .mobile-bottom {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6),
              0 0 0 0.5px rgba(255, 255, 255, 0.04) inset;
}

html:not(.dark) .mobile-bottom {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
}

/* ── TAB ITEM ── */
.mbn-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 48px;
  height: 48px;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 14px;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.mbn-item:active { transform: scale(0.85); }

/* ── ICON ── */
.mbn-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 0;
  background: transparent;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── LABEL ── */
.mbn-label {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  transition: color 0.2s ease, opacity 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 48px;
  line-height: 1;
}

/* ── ACTIVE — lifted icon + glow ── */
.mbn-item.active {
  transform: translateY(-2px);
}

.mbn-item.active .mbn-icon {
  transform: scale(1.15);
}

.mbn-item.active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ff7800;
  box-shadow: 0 0 8px rgba(255, 120, 0, 0.6);
}

.mbn-item.active::before { display: none; }
.mbn-active-dot { display: none; }

/* ── COLORS: DARK ── */
.dark .mbn-item .mbn-icon svg,
.dark .mbn-item .mbn-icon :deep(svg) {
  stroke: rgba(255,255,255,0.4);
  fill: none;
  transition: all 0.25s ease;
}
.dark .mbn-item .mbn-icon :deep(img),
.dark .mbn-item .mbn-icon img {
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  display: block;
  opacity: 0.45;
  filter: brightness(2) grayscale(0.3);
  transition: all 0.25s ease;
}
.dark .mbn-item .mbn-label { color: rgba(255,255,255,0.35); }

/* ── COLORS: LIGHT ── */
html:not(.dark) .mbn-item .mbn-icon svg,
html:not(.dark) .mbn-item .mbn-icon :deep(svg) {
  stroke: rgba(0,0,0,0.4);
  fill: none;
  transition: all 0.25s ease;
}
html:not(.dark) .mbn-item .mbn-icon :deep(img),
html:not(.dark) .mbn-item .mbn-icon img {
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  display: block;
  opacity: 0.45;
  filter: grayscale(0.3) brightness(0.6);
  transition: all 0.25s ease;
}
html:not(.dark) .mbn-item .mbn-label { color: rgba(0,0,0,0.4); }

/* ── ACTIVE COLORS: DARK ── */
.dark .mbn-item.active .mbn-icon svg,
.dark .mbn-item.active .mbn-icon :deep(svg) {
  stroke: #ff7800;
  filter: drop-shadow(0 0 6px rgba(255, 120, 0, 0.5));
}
.dark .mbn-item.active .mbn-icon :deep(img),
.dark .mbn-item.active .mbn-icon img {
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  display: block;
  opacity: 1;
  filter: sepia(1) saturate(3) hue-rotate(-15deg) brightness(1.1) drop-shadow(0 0 6px rgba(255, 120, 0, 0.5));
}
.dark .mbn-item.active .mbn-label { color: #ff7800; }

/* ── ACTIVE COLORS: LIGHT ── */
html:not(.dark) .mbn-item.active .mbn-icon svg,
html:not(.dark) .mbn-item.active .mbn-icon :deep(svg) {
  stroke: #e55300;
  filter: drop-shadow(0 0 4px rgba(255, 120, 0, 0.35));
}
html:not(.dark) .mbn-item.active .mbn-icon :deep(img),
html:not(.dark) .mbn-item.active .mbn-icon img {
  width: 20px !important;
  height: 20px !important;
  margin: 0 !important;
  display: block;
  opacity: 1;
  filter: sepia(1) saturate(3) hue-rotate(-15deg) brightness(0.9) drop-shadow(0 0 4px rgba(255, 120, 0, 0.35));
}
html:not(.dark) .mbn-item.active .mbn-label { color: #e55300; }

/* ── DISCORD ── */
.mbn-discord .mbn-icon svg { fill: #7289da !important; stroke: none !important; }
.dark .mbn-discord .mbn-label,
html:not(.dark) .mbn-discord .mbn-label { color: #7289da; opacity: 0.7; }
.mbn-item.mbn-discord.active::after { background: #7289da; box-shadow: 0 0 8px rgba(88, 101, 242, 0.5); }

/* ── THEME TOGGLE ── */
.mbn-theme .mbn-icon svg { fill: none; }

/* ── USER AVATAR ── */
.mbn-avatar-wrap {
  position: relative;
  width: 24px !important;
  height: 24px !important;
}

.mbn-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 120, 0, 0.5);
  display: block;
}

.mbn-online {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
  border: 1.5px solid #000;
  box-shadow: 0 0 4px rgba(34, 197, 94, 0.5);
}

/* ── USER WRAP ── */
.mbn-user-wrap {
  position: relative;
}

.mbn-user-btn {
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 14px;
  -webkit-tap-highlight-color: transparent;
}

.mbn-user-wrap .mbn-label {
  max-width: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .mbn-user-wrap .mbn-label { color: rgba(255,255,255,0.4); }
html:not(.dark) .mbn-user-wrap .mbn-label { color: rgba(0,0,0,0.4); }

/* ===== MOBILE MENU ===== */
.mobile-menu {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  transform: translateY(-100%);
  transition: transform 0.4s ease;
  z-index: 998;
  padding: 20px;
}

.dark .mobile-menu {
  background: #000000;
}

html:not(.dark) .mobile-menu {
  background: #ffffff;
}

.mobile-menu.open {
  transform: translateY(0);
}

.mobile-menu a {
  font-size: 16px;
  text-decoration: none;
  opacity: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dark .mobile-menu a {
  color: #ffffff;
}

html:not(.dark) .mobile-menu a {
  color: #000000;
}

.mobile-menu a:hover {
  opacity: 1;
  color: #ff7800;
}

/* SVG-uri în mobile menu - doar ALBE pe dark */
.mobile-menu a :deep(svg) {
  width: 20px;
  height: 20px;
  transition: all 0.2s ease;
}

.dark .mobile-menu a :deep(svg),
.dark .mobile-menu a :deep(svg path),
.dark .mobile-menu a :deep(svg circle),
.dark .mobile-menu a :deep(svg rect) {
  fill: white;
  stroke: none;
}

html:not(.dark) .mobile-menu a :deep(svg),
html:not(.dark) .mobile-menu a :deep(svg path),
html:not(.dark) .mobile-menu a :deep(svg circle),
html:not(.dark) .mobile-menu a :deep(svg rect) {
  fill: #333333;
  stroke: none;
}

.mobile-menu-social {
  display: flex;
  gap: 16px;
  margin: 16px 0;
}

.mobile-menu-social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.mobile-menu-social-link:hover {
  opacity: 1;
  transform: translateY(-2px);
}

/* SVG-uri în mobile menu social - doar ALBE pe dark */
.mobile-menu-social-link :deep(svg) {
  width: 20px;
  height: 20px;
  transition: all 0.2s ease;
}

.dark .mobile-menu-social-link :deep(svg),
.dark .mobile-menu-social-link :deep(svg path),
.dark .mobile-menu-social-link :deep(svg circle),
.dark .mobile-menu-social-link :deep(svg rect) {
  fill: white;
  stroke: none;
}

html:not(.dark) .mobile-menu-social-link :deep(svg),
html:not(.dark) .mobile-menu-social-link :deep(svg path),
html:not(.dark) .mobile-menu-social-link :deep(svg circle),
html:not(.dark) .mobile-menu-social-link :deep(svg rect) {
  fill: #333333;
  stroke: none;
}

.mobile-menu-discord {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: 40px;
  background: linear-gradient(135deg, #5865F2, #4752C4);
  color: #ffffff !important;
  opacity: 1 !important;
  box-shadow: 0 8px 20px rgba(88, 101, 242, 0.3);
  font-size: 14px;
}

.mobile-menu-discord .discord-icon {
  fill: white;
  stroke: none;
  width: 18px;
  height: 18px;
}

.mobile-menu-discord:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(88, 101, 242, 0.5);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .nav {
    display: none;
  }

  .mobile-bottom {
    display: flex;
  }
}

@media (min-width: 901px) {
  .nav {
    display: flex;
  }

  .mobile-bottom {
    display: none;
  }
}
</style>
