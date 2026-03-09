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
        <!-- SOCIAL LINKS -->
        <div class="nav-social">
          <a
            v-for="social in socialLinks"
            :key="social.link"
            :href="social.link"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-social-link"
            :aria-label="social.ariaLabel"
            v-html="social.icon.svg"
          >
          </a>
        </div>

        <!-- DARK MODE SWITCH - CUSTOM ORANGE -->
        <button class="theme-switch" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
          <span class="switch-thumb" :class="{ 'dark': isDark }"></span>
        </button>

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
  <div class="mobile-bottom" v-if="isMobile">
    <a 
      v-for="item in navItems" 
      :key="item.link"
      :href="item.link"
      @click="open=false"
      class="mobile-bottom-link orbitron-font"
      :class="{ active: isActive(item.link) }"
    >
      <span v-html="getIconFromText(item.text)"></span>
    </a>

    <button class="theme-switch mobile" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
      <span class="switch-thumb" :class="{ 'dark': isDark }"></span>
    </button>

    <a href="https://discord.gg/Knu76DhE9h" target="_blank" class="mobile-bottom-discord">
      <svg class="discord-icon" viewBox="0 0 24 24" width="14" height="14">
        <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.03.02.03.08-.01.1c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.31.61.67 1.19 1.07 1.74c.02.01.05.02.07.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
      </svg>
    </a>
  </div>

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
    
    <div class="mobile-menu-social">
      <a
        v-for="social in socialLinks"
        :key="social.link"
        :href="social.link"
        target="_blank"
        rel="noopener noreferrer"
        class="mobile-menu-social-link"
        v-html="social.icon.svg"
      >
      </a>
    </div>

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

const { theme, isDark } = useData()
const route = useRoute()

const open = ref(false)
const isScrolled = ref(false)
const isMobile = ref(false)
const lastScrollY = ref(0)
const isNavHidden = ref(false)

const navItems = computed(() => theme.value.nav || [])
const socialLinks = computed(() => theme.value.socialLinks || [])

const isActive = (link: string) => route.path === link
const cleanText = (t: string) => t.replace(/<img.*?>/, '').trim()
const getIconFromText = (text: string) => {
  const match = text.match(/<img.*?>/)
  return match ? match[0] : ''
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
  checkMobile()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', checkMobile)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ===== FONT ORBITRON ===== */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

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
.mobile-menu-discord span,
.theme-switch {
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
  background: linear-gradient(135deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* ===== CUSTOM THEME SWITCH - ORANGE ===== */
.theme-switch {
  position: relative;
  border-radius: 30px;
  display: block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  border: 2px solid #ff4500;
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0;
}

.theme-switch.mobile {
  width: 40px;
  height: 22px;
  border-width: 2px;
}

.theme-switch .switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ff4500;
  box-shadow: 0 2px 5px rgba(255, 69, 0, 0.3);
  transition: transform 0.3s ease;
}

.theme-switch.mobile .switch-thumb {
  width: 14px;
  height: 14px;
  top: 2px;
  left: 2px;
}

.theme-switch .switch-thumb.dark {
  transform: translateX(20px);
}

.theme-switch.mobile .switch-thumb.dark {
  transform: translateX(18px);
}

.theme-switch:hover {
  border-color: #ff4500;
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.3);
}

.theme-switch:hover .switch-thumb {
  background: #ff4500;
  box-shadow: 0 0 12px rgba(255, 69, 0, 0.5);
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
  padding: 0 20px;
  border-radius: 60px;
  transition: all 0.3s ease;
  pointer-events: auto;
}

.dark .nav-inner {
  background: #000000;
  box-shadow: 0 5px 20px -5px rgba(0, 0, 0, 0.8);
}

html:not(.dark) .nav-inner {
  background: #ffffff;
  box-shadow: 0 5px 20px -5px rgba(0, 0, 0, 0.1);
}

.nav.scrolled .nav-inner {
  box-shadow: 0 5px 20px -5px rgba(0, 0, 0, 0.2);
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
  gap: 20px;
}

.nav-links a {
  font-size: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  padding: 4px 0;
}

.dark .nav-links a {
  color: rgba(255, 255, 255, 0.7);
}

.dark .nav-links a:hover {
  color: #ffffff;
}

html:not(.dark) .nav-links a {
  color: rgba(0, 0, 0, 0.7);
}

html:not(.dark) .nav-links a:hover {
  color: #000000;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff4500, #ff8c00);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 70%;
}

.nav-links a.active {
  color: #ff4500;
  font-weight: 600;
}

/* ===== RIGHT SECTION ===== */
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
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
  filter: drop-shadow(0 0 4px #ff4500);
}

html:not(.dark) .nav-social-link:hover :deep(svg) {
  filter: drop-shadow(0 0 4px #ff4500);
}

/* ===== DISCORD CTA ===== */
.nav-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 30px;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ff4500, #ff8c00, #ff4500);
  background-size: 200% auto;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
}

.nav-cta:hover {
  background-position: right center;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 69, 0, 0.5);
}

.nav-cta .discord-icon {
  fill: white;
  stroke: none;
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.nav-cta:hover .discord-icon {
  transform: rotate(5deg) scale(1.1);
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
  background: linear-gradient(90deg, #ff4500, #ff8c00);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* ===== MOBILE BOTTOM ===== */
.mobile-bottom {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 360px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
  border-radius: 40px;
  z-index: 997;
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.2);
}

.dark .mobile-bottom {
  background: #000000;
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.8);
}

html:not(.dark) .mobile-bottom {
  background: #ffffff;
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.1);
}

.mobile-bottom-link {
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 8px;
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG-uri în mobile bottom - doar ALBE pe dark */
.mobile-bottom-link :deep(svg) {
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.dark .mobile-bottom-link :deep(svg),
.dark .mobile-bottom-link :deep(svg path),
.dark .mobile-bottom-link :deep(svg circle),
.dark .mobile-bottom-link :deep(svg rect) {
  fill: white;
  stroke: none;
}

html:not(.dark) .mobile-bottom-link :deep(svg),
html:not(.dark) .mobile-bottom-link :deep(svg path),
html:not(.dark) .mobile-bottom-link :deep(svg circle),
html:not(.dark) .mobile-bottom-link :deep(svg rect) {
  fill: #333333;
  stroke: none;
}

.mobile-bottom-link.active :deep(svg) {
  fill: #ff4500;
}

.dark .mobile-bottom-link.active :deep(svg) {
  fill: #ff4500;
}

.mobile-bottom-discord {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5865F2, #4752C4);
  box-shadow: 0 4px 10px rgba(88, 101, 242, 0.3);
  transition: all 0.3s ease;
}

.mobile-bottom-discord .discord-icon {
  fill: white;
  stroke: none;
  width: 18px;
  height: 18px;
}

.mobile-bottom-discord:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(88, 101, 242, 0.5);
}

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
  color: #ff4500;
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