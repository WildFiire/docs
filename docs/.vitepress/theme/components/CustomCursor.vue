<template>
  <div v-if="!isTouchDevice" class="custom-cursor" :class="{ 'cursor-hidden': !isVisible }">
    <div
      class="crosshair"
      :class="{ 'crosshair--hover': isOnInteractive, 'crosshair--click': isClicking }"
      :style="{ transform: `translate(${dotX}px, ${dotY}px)` }"
    >
      <span class="ch-line ch-top"></span>
      <span class="ch-line ch-right"></span>
      <span class="ch-line ch-bottom"></span>
      <span class="ch-line ch-left"></span>
      <span class="ch-dot"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const dotX = ref(0)
const dotY = ref(0)
const ringX = ref(0)
const ringY = ref(0)
const isOnInteractive = ref(false)
const isClicking = ref(false)
const isVisible = ref(false)
const isTouchDevice = ref(false)

let rafId: number | null = null
let mouseX = 0
let mouseY = 0
let currentRingX = 0
let currentRingY = 0

const lerp = (s: number, e: number, f: number) => s + (e - s) * f

const tick = () => {
  dotX.value = mouseX
  dotY.value = mouseY
  currentRingX = lerp(currentRingX, mouseX, 0.12)
  currentRingY = lerp(currentRingY, mouseY, 0.12)
  ringX.value = currentRingX
  ringY.value = currentRingY
  rafId = requestAnimationFrame(tick)
}

const onMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
  if (!isVisible.value) isVisible.value = true

  const target = e.target as HTMLElement
  const interactive = target.closest('a, button, [role="button"], input, textarea, select, .magnetic-btn, .tilt-card')
  isOnInteractive.value = !!interactive
}

const onDown = () => { isClicking.value = true }
const onUp = () => { isClicking.value = false }
const onLeave = () => { isVisible.value = false }
const onEnter = () => { isVisible.value = true }

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouchDevice.value) return

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mousedown', onDown)
  document.addEventListener('mouseup', onUp)
  document.addEventListener('mouseleave', onLeave)
  document.addEventListener('mouseenter', onEnter)
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMove)
  document.removeEventListener('mousedown', onDown)
  document.removeEventListener('mouseup', onUp)
  document.removeEventListener('mouseleave', onLeave)
  document.removeEventListener('mouseenter', onEnter)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  pointer-events: none;
}

.cursor-hidden .crosshair {
  opacity: 0;
}

.crosshair {
  position: absolute;
  width: 0;
  height: 0;
  will-change: transform;
  transition: opacity 0.15s ease;
}

/* Lines */
.ch-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.85);
  transition: background 0.2s ease, transform 0.15s ease;
}

.ch-top {
  width: 1.5px;
  height: 10px;
  left: -0.75px;
  bottom: 4px;
}

.ch-bottom {
  width: 1.5px;
  height: 10px;
  left: -0.75px;
  top: 4px;
}

.ch-left {
  height: 1.5px;
  width: 10px;
  top: -0.75px;
  right: 4px;
}

.ch-right {
  height: 1.5px;
  width: 10px;
  top: -0.75px;
  left: 4px;
}

/* Center dot */
.ch-dot {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 69, 0, 0.9);
  border-radius: 50%;
  left: -1px;
  top: -1px;
  transition: transform 0.15s ease, background 0.2s ease;
}

/* Hover: spread out + turn orange */
.crosshair--hover .ch-top { bottom: 6px; background: rgba(255, 69, 0, 0.9); }
.crosshair--hover .ch-bottom { top: 6px; background: rgba(255, 69, 0, 0.9); }
.crosshair--hover .ch-left { right: 6px; background: rgba(255, 69, 0, 0.9); }
.crosshair--hover .ch-right { left: 6px; background: rgba(255, 69, 0, 0.9); }
.crosshair--hover .ch-dot {
  background: #ff4500;
  transform: scale(1.5);
}

/* Click: shrink inward */
.crosshair--click .ch-top { bottom: 2px; }
.crosshair--click .ch-bottom { top: 2px; }
.crosshair--click .ch-left { right: 2px; }
.crosshair--click .ch-right { left: 2px; }
.crosshair--click .ch-dot {
  transform: scale(0.5);
}

@media (max-width: 1024px) {
  .custom-cursor { display: none; }
}
</style>
