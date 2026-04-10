<template>
  <div class="cs2-bg" :class="{ 'cs2-bg--light': !isDark }">
    <!-- Wallpaper image -->
    <img
      src="/wallpaper/poza.jpg"
      alt=""
      class="cs2-bg__wallpaper"
      width="1920" height="1080"
      fetchpriority="high"
      loading="eager"
      decoding="async"
      role="presentation"
    />
    <!-- Dark overlay on top of wallpaper -->
    <div class="cs2-bg__overlay"></div>

    <!-- Fiery effects -->
    <div class="cs2-bg__fire-bottom"></div>
    <div class="cs2-bg__fire-edge cs2-bg__fire-edge--left"></div>
    <div class="cs2-bg__fire-edge cs2-bg__fire-edge--right"></div>
    <div class="cs2-bg__heat-haze"></div>

    <!-- Animated gradient orbs -->
    <div class="cs2-bg__orb cs2-bg__orb--1"></div>
    <div class="cs2-bg__orb cs2-bg__orb--2"></div>
    <div class="cs2-bg__orb cs2-bg__orb--3"></div>
    <div class="cs2-bg__orb cs2-bg__orb--4"></div>

    <!-- Ember streaks -->
    <div class="cs2-bg__streak cs2-bg__streak--1"></div>
    <div class="cs2-bg__streak cs2-bg__streak--2"></div>

    <!-- Floating particles -->
    <div class="cs2-bg__particles">
      <span v-for="n in 12" :key="n" class="cs2-bg__particle" :style="particleStyle(n)"></span>
    </div>

    <!-- NeuroNoise bottom layer -->
    <div class="cs2-bg__neuro">
      <NeuroNoiseBg
        :width="1920"
        :height="400"
        colorFront="#ff9500"
        colorMid="#f54500"
        colorBack="#00000000"
        :brightness="0.15"
        :contrast="0.75"
        :speed="1.18"
        :scale="0.72"
        class="cs2-bg__neuro-canvas"
      />
    </div>

    <!-- Vignette -->
    <div class="cs2-bg__vignette"></div>

    <!-- Scroll darken (disabled) -->
    <!-- <div class="cs2-bg__scroll-fade" :style="{ opacity: scrollOpacity }"></div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NeuroNoiseBg from './NeuroNoiseBg.vue'

const props = defineProps<{
  scrolled?: boolean
  scrollOpacity?: number
  isDark?: boolean
}>()

const scrollOpacity = ref(props.scrollOpacity ?? 0)

const particleStyle = (n: number) => {
  const seed = n * 7.3
  const left = ((seed * 13.7) % 100)
  const top = ((seed * 9.1) % 100)
  const size = 2 + (n % 4)
  const dur = 10 + (n % 8) * 3
  const delay = -(n % 5) * 2
  const opacity = 0.3 + (n % 3) * 0.15
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${dur}s`,
    animationDelay: `${delay}s`,
    '--p-opacity': opacity,
  }
}
</script>

<style scoped>
.cs2-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

/* ===== WALLPAPER ===== */
.cs2-bg__wallpaper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.cs2-bg__overlay {
  position: absolute;
  inset: 0;
  background: rgba(6, 6, 6, 0.96);
  transition: background 0.5s ease;
}

.cs2-bg--light .cs2-bg__overlay {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(248, 249, 254, 0.7) 40%, rgba(255, 255, 255, 0.88) 100%),
    rgba(250, 251, 254, 0.5);
}

/* ===== FIERY EFFECTS ===== */
.cs2-bg__fire-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to top,
    rgba(255, 60, 0, 0.12) 0%,
    rgba(255, 100, 0, 0.06) 25%,
    rgba(255, 140, 0, 0.02) 50%,
    transparent 100%
  );
  animation: fireBreath 4s ease-in-out infinite;
}

.cs2-bg--light .cs2-bg__fire-bottom {
  background: linear-gradient(
    to top,
    rgba(255, 69, 0, 0.06) 0%,
    rgba(255, 100, 0, 0.03) 30%,
    transparent 100%
  );
}

.cs2-bg__fire-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 200px;
  filter: blur(40px);
  animation: edgePulse 6s ease-in-out infinite;
}

.cs2-bg__fire-edge--left {
  left: -60px;
  background: linear-gradient(
    to right,
    rgba(255, 50, 0, 0.15) 0%,
    rgba(255, 80, 0, 0.05) 40%,
    transparent 100%
  );
}

.cs2-bg__fire-edge--right {
  right: -60px;
  background: linear-gradient(
    to left,
    rgba(255, 50, 0, 0.15) 0%,
    rgba(255, 80, 0, 0.05) 40%,
    transparent 100%
  );
  animation-delay: 3s;
}

.cs2-bg--light .cs2-bg__fire-edge--left {
  background: linear-gradient(to right, rgba(255, 69, 0, 0.06) 0%, transparent 100%);
}
.cs2-bg--light .cs2-bg__fire-edge--right {
  background: linear-gradient(to left, rgba(255, 69, 0, 0.06) 0%, transparent 100%);
}

.cs2-bg__heat-haze {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 40% 30% at 30% 70%, rgba(255, 69, 0, 0.05) 0%, transparent 70%),
    radial-gradient(ellipse 35% 25% at 70% 60%, rgba(255, 120, 0, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 25% 20% at 50% 80%, rgba(255, 80, 0, 0.06) 0%, transparent 60%);
  animation: heatShimmer 8s ease-in-out infinite alternate;
}

.cs2-bg--light .cs2-bg__heat-haze {
  background:
    radial-gradient(ellipse 40% 30% at 30% 70%, rgba(255, 69, 0, 0.02) 0%, transparent 70%),
    radial-gradient(ellipse 35% 25% at 70% 60%, rgba(255, 120, 0, 0.02) 0%, transparent 70%);
}

@keyframes fireBreath {
  0%, 100% { opacity: 0.7; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.08); }
}

@keyframes edgePulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.9; }
}

@keyframes heatShimmer {
  0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  33% { transform: translate(15px, -10px) scale(1.03); opacity: 0.9; }
  66% { transform: translate(-10px, 8px) scale(0.98); opacity: 0.7; }
  100% { transform: translate(5px, -5px) scale(1.01); opacity: 0.8; }
}

/* ===== GRADIENT ORBS ===== */
.cs2-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  will-change: transform, opacity;
}

.cs2-bg__orb--1 {
  width: 600px;
  height: 600px;
  top: -15%;
  left: -10%;
  background: radial-gradient(circle, rgba(255, 69, 0, 0.18) 0%, rgba(255, 120, 0, 0.06) 50%, transparent 70%);
  animation: orbFloat1 20s ease-in-out infinite;
}

.cs2-bg__orb--2 {
  width: 500px;
  height: 500px;
  bottom: -10%;
  right: -5%;
  background: radial-gradient(circle, rgba(255, 100, 20, 0.14) 0%, rgba(200, 50, 0, 0.05) 50%, transparent 70%);
  animation: orbFloat2 25s ease-in-out infinite;
}

.cs2-bg__orb--3 {
  width: 350px;
  height: 350px;
  top: 40%;
  right: 20%;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.1) 0%, transparent 60%);
  animation: orbFloat3 18s ease-in-out infinite;
}

.cs2-bg__orb--4 {
  width: 250px;
  height: 250px;
  bottom: 30%;
  left: 15%;
  background: radial-gradient(circle, rgba(255, 69, 0, 0.08) 0%, transparent 60%);
  animation: orbFloat4 22s ease-in-out infinite;
}

/* Light mode — much subtler orbs */
.cs2-bg--light .cs2-bg__orb--1 {
  background: radial-gradient(circle, rgba(255, 69, 0, 0.06) 0%, rgba(255, 120, 0, 0.02) 50%, transparent 70%);
}
.cs2-bg--light .cs2-bg__orb--2 {
  background: radial-gradient(circle, rgba(255, 100, 20, 0.05) 0%, transparent 60%);
}
.cs2-bg--light .cs2-bg__orb--3 {
  background: radial-gradient(circle, rgba(255, 140, 0, 0.04) 0%, transparent 60%);
}
.cs2-bg--light .cs2-bg__orb--4 {
  background: radial-gradient(circle, rgba(255, 69, 0, 0.03) 0%, transparent 60%);
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
  30% { transform: translate(60px, 40px) scale(1.1); opacity: 1; }
  60% { transform: translate(-30px, 80px) scale(0.95); opacity: 0.7; }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
  40% { transform: translate(-50px, -60px) scale(1.15); opacity: 0.9; }
  70% { transform: translate(40px, -30px) scale(0.9); opacity: 0.6; }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  50% { transform: translate(-40px, 50px) scale(1.1); opacity: 0.8; }
}

@keyframes orbFloat4 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  35% { transform: translate(30px, -40px) scale(1.2); opacity: 0.7; }
  65% { transform: translate(-20px, 30px) scale(0.85); opacity: 0.5; }
}

/* ===== EMBER STREAKS ===== */
.cs2-bg__streak {
  position: absolute;
  height: 1px;
  border-radius: 2px;
  filter: blur(0.5px);
  opacity: 0;
}

.cs2-bg__streak--1 {
  width: 300px;
  top: 25%;
  left: -300px;
  background: linear-gradient(90deg, transparent, rgba(255, 69, 0, 0.35), rgba(255, 140, 0, 0.2), transparent);
  animation: streak1 8s ease-in-out infinite;
  animation-delay: 2s;
}

.cs2-bg__streak--2 {
  width: 200px;
  top: 65%;
  right: -200px;
  background: linear-gradient(270deg, transparent, rgba(255, 100, 0, 0.3), rgba(255, 69, 0, 0.15), transparent);
  animation: streak2 10s ease-in-out infinite;
  animation-delay: 5s;
}

.cs2-bg--light .cs2-bg__streak--1 {
  background: linear-gradient(90deg, transparent, rgba(255, 69, 0, 0.15), rgba(255, 140, 0, 0.08), transparent);
}
.cs2-bg--light .cs2-bg__streak--2 {
  background: linear-gradient(270deg, transparent, rgba(255, 100, 0, 0.12), rgba(255, 69, 0, 0.06), transparent);
}

@keyframes streak1 {
  0% { transform: translateX(0); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateX(calc(100vw + 600px)); opacity: 0; }
}

@keyframes streak2 {
  0% { transform: translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateX(calc(-100vw - 400px)); opacity: 0; }
}

/* ===== FLOATING PARTICLES ===== */
.cs2-bg__particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cs2-bg__particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 69, 0, 0.7);
  animation: particleDrift linear infinite;
  opacity: var(--p-opacity, 0.4);
}

.cs2-bg--light .cs2-bg__particle {
  background: rgba(255, 69, 0, 0.4);
  opacity: calc(var(--p-opacity, 0.4) * 0.5);
}

@keyframes particleDrift {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: var(--p-opacity, 0.4);
  }
  90% {
    opacity: var(--p-opacity, 0.4);
  }
  100% {
    transform: translateY(-120px) translateX(40px);
    opacity: 0;
  }
}

/* ===== NEURO NOISE BOTTOM ===== */
.cs2-bg__neuro {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 280px;
  overflow: hidden;
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
}

.cs2-bg__neuro-canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* ===== VIGNETTE ===== */
.cs2-bg__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%);
}

.cs2-bg--light .cs2-bg__vignette {
  background: radial-gradient(ellipse 70% 60% at center, transparent 50%, rgba(0, 0, 0, 0.04) 100%);
}

/* ===== SCROLL FADE ===== */
.cs2-bg__scroll-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cs2-bg--light .cs2-bg__scroll-fade {
  background: linear-gradient(to bottom, transparent 0%, rgba(250, 251, 254, 0.85) 100%);
}
</style>
