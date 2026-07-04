<template>
  <div class="cs2-bg" :class="{ 'cs2-bg--light': !isDark }">
    <!-- Wallpaper -->
    <img
      ref="wallpaperEl"
      src="/wallpaper/poza.webp"
      alt=""
      class="cs2-bg__wallpaper"
      width="1920" height="1080"
      fetchpriority="high"
      loading="eager"
      decoding="async"
      role="presentation"
      style="transform: scale(1.08)"
    />

    <!-- Base dark tint -->
    <div class="cs2-bg__overlay"></div>

    <!-- Scroll darken (opacity driven by JS) -->
    <div ref="scrollFadeEl" class="cs2-bg__scroll-fade"></div>

    <!-- Scroll brightness filter (opacity driven by JS) -->
    <div ref="filterOverlayEl" class="cs2-bg__filter-overlay"></div>

    <!-- Center hero glow — warm orange focal point -->
    <div class="cs2-bg__center-glow"></div>

    <!-- Bottom fire gradient -->
    <div class="cs2-bg__fire-bottom"></div>

    <!-- Side edge accents -->
    <div class="cs2-bg__fire-edge cs2-bg__fire-edge--left"></div>
    <div class="cs2-bg__fire-edge cs2-bg__fire-edge--right"></div>

    <!-- Ambient orbs -->
    <div class="cs2-bg__orb cs2-bg__orb--1"></div>
    <div class="cs2-bg__orb cs2-bg__orb--2"></div>
    <div class="cs2-bg__orb cs2-bg__orb--3"></div>

    <!-- Scan-line texture overlay -->
    <div class="cs2-bg__scanlines" aria-hidden="true"></div>

    <!-- Vignette -->
    <div class="cs2-bg__vignette"></div>

    <!-- Floating embers (3) -->
    <div class="cs2-bg__particles">
      <span v-for="n in 4" :key="n" class="cs2-bg__particle" :style="particleStyle(n)"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  scrolled?: boolean
  scrollOpacity?: number
  isDark?: boolean
}>()

const wallpaperEl    = ref<HTMLImageElement | null>(null)
const filterOverlayEl = ref<HTMLDivElement | null>(null)
const scrollFadeEl   = ref<HTMLDivElement | null>(null)

let velocity     = 0
let bounceTarget = 1
let bounceCurrent = 1
let rafId: number | null = null

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const SETTLE_THRESHOLD = 0.0002

const onWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    velocity += e.deltaY > 0 ? -0.04 : 0.04
    if (!rafId) rafId = requestAnimationFrame(updateParallax)
  }
}

let scrollRaf: number | null = null
const onScroll = () => {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    const progress = Math.min(window.scrollY / 800, 1)
    if (filterOverlayEl.value) filterOverlayEl.value.style.opacity = String(progress * 0.35)
    if (scrollFadeEl.value)    scrollFadeEl.value.style.opacity    = String(progress * 0.55)
    scrollRaf = null
  })
}

const updateParallax = () => {
  bounceTarget += velocity
  bounceTarget  = Math.max(0.92, Math.min(1.12, bounceTarget))
  velocity     *= 0.85
  bounceTarget += (1 - bounceTarget) * 0.06
  bounceCurrent = lerp(bounceCurrent, bounceTarget, 0.1)

  if (wallpaperEl.value) {
    const s = Math.round(bounceCurrent * 1000) / 1000
    wallpaperEl.value.style.transform = `scale3d(${1.08 * s}, ${1.08 * s}, 1)`
  }

  const settled = Math.abs(velocity) < SETTLE_THRESHOLD &&
                  Math.abs(bounceCurrent - 1) < SETTLE_THRESHOLD &&
                  Math.abs(bounceTarget  - 1) < SETTLE_THRESHOLD
  if (settled) {
    if (wallpaperEl.value) wallpaperEl.value.style.transform = 'scale3d(1.08, 1.08, 1)'
    rafId = null
    return
  }
  rafId = requestAnimationFrame(updateParallax)
}

onMounted(() => {
  window.addEventListener('wheel',  onWheel,  { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('wheel',  onWheel)
  window.removeEventListener('scroll', onScroll)
  if (rafId)     cancelAnimationFrame(rafId)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})

const particleStyle = (n: number) => {
  const seed    = n * 7.3
  const left    = (seed * 13.7) % 100
  const top     = (seed * 9.1)  % 100
  const size    = 2 + (n % 3)
  const dur     = 12 + (n % 7) * 3
  const delay   = -(n % 5) * 2.5
  const opacity = 0.25 + (n % 3) * 0.12
  return {
    left:              `${left}%`,
    top:               `${top}%`,
    width:             `${size}px`,
    height:            `${size}px`,
    animationDuration: `${dur}s`,
    animationDelay:    `${delay}s`,
    '--p-opacity':     opacity,
  }
}
</script>

<style scoped>
/* ── Root ── */
.cs2-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

/* ── Wallpaper ── */
.cs2-bg__wallpaper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  /* Darken + desaturate for text contrast */
  filter: brightness(0.22) saturate(0.65);
  transition: filter 0.5s ease;
}
.cs2-bg--light .cs2-bg__wallpaper {
  filter: brightness(0.70) saturate(0.40);
}

/* ── Base dark overlay ── */
.cs2-bg__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(2, 2, 5, 0.90) 0%,
    rgba(3, 3, 8, 0.80) 45%,
    rgba(3, 2, 6, 0.92) 100%
  );
}
.cs2-bg--light .cs2-bg__overlay {
  background: linear-gradient(
    180deg,
    rgba(248, 248, 255, 0.78) 0%,
    rgba(252, 251, 255, 0.62) 50%,
    rgba(250, 249, 255, 0.80) 100%
  );
}

/* ── Center hero glow ── */
.cs2-bg__center-glow {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 600px;
  background: radial-gradient(
    ellipse 60% 55% at 50% 40%,
    rgba(255, 110, 0, 0.10) 0%,
    rgba(255, 80, 0, 0.05) 40%,
    transparent 70%
  );
  pointer-events: none;
  animation: centerGlowPulse 8s ease-in-out infinite alternate;
}
.cs2-bg--light .cs2-bg__center-glow {
  background: radial-gradient(
    ellipse 60% 55% at 50% 40%,
    rgba(255, 110, 0, 0.04) 0%,
    transparent 70%
  );
}
@keyframes centerGlowPulse {
  0%   { opacity: 0.7; transform: translateX(-50%) scale(1);    }
  100% { opacity: 1;   transform: translateX(-50%) scale(1.06); }
}

/* ── Fire bottom gradient ── */
.cs2-bg__fire-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(
    to top,
    rgba(255, 50, 0, 0.10) 0%,
    rgba(255, 80, 0, 0.05) 30%,
    transparent 100%
  );
}
.cs2-bg--light .cs2-bg__fire-bottom {
  background: linear-gradient(
    to top,
    rgba(255, 120, 0, 0.04) 0%,
    transparent 100%
  );
}

/* ── Side fire edges ── */
.cs2-bg__fire-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 180px;
}
.cs2-bg__fire-edge--left {
  left: -30px;
  background: linear-gradient(to right, rgba(255, 60, 0, 0.10) 0%, transparent 100%);
}
.cs2-bg__fire-edge--right {
  right: -30px;
  background: linear-gradient(to left, rgba(255, 60, 0, 0.10) 0%, transparent 100%);
}
.cs2-bg--light .cs2-bg__fire-edge--left  { background: linear-gradient(to right, rgba(255, 120, 0, 0.04) 0%, transparent 100%); }
.cs2-bg--light .cs2-bg__fire-edge--right { background: linear-gradient(to left,  rgba(255, 120, 0, 0.04) 0%, transparent 100%); }

/* ── Ambient orbs ── */
.cs2-bg__orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}
.cs2-bg__orb--1 {
  width: 700px;
  height: 700px;
  top: -20%;
  left: -15%;
  background: radial-gradient(circle, rgba(255, 100, 0, 0.13) 0%, rgba(255, 80, 0, 0.05) 50%, transparent 70%);
  animation: orbFloat1 22s ease-in-out infinite;
}
.cs2-bg__orb--2 {
  width: 550px;
  height: 550px;
  bottom: -12%;
  right: -8%;
  background: radial-gradient(circle, rgba(255, 90, 10, 0.10) 0%, rgba(180, 40, 0, 0.04) 50%, transparent 70%);
  animation: orbFloat2 28s ease-in-out infinite;
}
.cs2-bg__orb--3 {
  width: 380px;
  height: 380px;
  top: 38%;
  right: 18%;
  background: radial-gradient(circle, rgba(255, 130, 0, 0.07) 0%, transparent 60%);
  animation: orbFloat3 18s ease-in-out infinite;
}

/* Light mode — softer orbs */
.cs2-bg--light .cs2-bg__orb--1 { background: radial-gradient(circle, rgba(255, 120, 0, 0.05) 0%, transparent 70%); }
.cs2-bg--light .cs2-bg__orb--2 { background: radial-gradient(circle, rgba(255, 100, 0, 0.04) 0%, transparent 70%); }
.cs2-bg--light .cs2-bg__orb--3 { background: radial-gradient(circle, rgba(255, 140, 0, 0.03) 0%, transparent 60%); }

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1);       opacity: 0.75; }
  30%       { transform: translate(50px, 35px) scale(1.08); opacity: 1;    }
  65%       { transform: translate(-25px, 70px) scale(0.94); opacity: 0.65; }
}
@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1);          opacity: 0.65; }
  40%       { transform: translate(-45px, -55px) scale(1.12); opacity: 0.85; }
  70%       { transform: translate(35px, -25px) scale(0.92); opacity: 0.55; }
}
@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1);       opacity: 0.5; }
  50%       { transform: translate(-35px, 45px) scale(1.1); opacity: 0.7; }
}

/* ── Scan-line texture ── */
.cs2-bg__scanlines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
  pointer-events: none;
}
.cs2-bg--light .cs2-bg__scanlines {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.025) 2px,
    rgba(0, 0, 0, 0.025) 4px
  );
}

/* ── Vignette ── */
.cs2-bg__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 75% 65% at 50% 35%, transparent 25%, rgba(0, 0, 0, 0.65) 100%);
}
.cs2-bg--light .cs2-bg__vignette {
  background: radial-gradient(ellipse 75% 65% at 50% 35%, transparent 45%, rgba(0, 0, 0, 0.04) 100%);
}

/* ── Scroll overlays (JS-driven opacity) ── */
.cs2-bg__filter-overlay {
  position: absolute;
  inset: 0;
  background: black;
  mix-blend-mode: multiply;
  opacity: 0;
}
.cs2-bg__scroll-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.65) 100%);
  opacity: 0;
}
.cs2-bg--light .cs2-bg__scroll-fade {
  background: linear-gradient(to bottom, transparent 0%, rgba(250, 251, 254, 0.85) 100%);
}

/* ── Floating embers ── */
.cs2-bg__particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.cs2-bg__particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 130, 0, 0.75);
  box-shadow: 0 0 4px rgba(255, 120, 0, 0.5);
  animation: particleDrift linear infinite;
  opacity: var(--p-opacity, 0.35);
}
.cs2-bg--light .cs2-bg__particle {
  background: rgba(255, 120, 0, 0.4);
  opacity: calc(var(--p-opacity, 0.35) * 0.4);
}
@keyframes particleDrift {
  0%   { transform: translateY(0) translateX(0);      opacity: 0; }
  8%   { opacity: var(--p-opacity, 0.35); }
  92%  { opacity: var(--p-opacity, 0.35); }
  100% { transform: translateY(-140px) translateX(30px); opacity: 0; }
}
</style>