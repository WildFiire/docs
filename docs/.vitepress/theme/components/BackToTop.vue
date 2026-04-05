<template>
  <Transition name="back-top">
    <button
      v-if="visible"
      class="back-to-top"
      @click="scrollToTop"
      :aria-label="`Back to top (${Math.round(progress)}%)`"
    >
      <svg class="progress-ring" viewBox="0 0 44 44" width="44" height="44">
        <circle class="ring-bg" cx="22" cy="22" r="17" />
        <circle
          class="ring-fill"
          cx="22" cy="22" r="17"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <svg class="arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const visible = ref(false)

const CIRCUMFERENCE = 2 * Math.PI * 17

const dashOffset = computed(() => {
  return CIRCUMFERENCE - (progress.value / 100) * CIRCUMFERENCE
})

function update() {
  const el = document.documentElement
  const scrolled = el.scrollTop || window.scrollY
  const total = el.scrollHeight - el.clientHeight
  progress.value = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0
  visible.value = scrolled > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 69, 0, 0.25);
  background: rgba(10, 10, 10, 0.75);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  padding: 0;
}

.back-to-top:hover {
  transform: translateY(-3px) scale(1.06);
  box-shadow: 0 8px 24px rgba(255, 69, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 69, 0, 0.55);
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 69, 0, 0.15);
  stroke-width: 2.5;
}

.ring-fill {
  fill: none;
  stroke: #ff4500;
  stroke-width: 2.5;
  stroke-dasharray: 106.81;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.15s linear;
}

.arrow-icon {
  position: relative;
  z-index: 1;
  color: #ff4500;
}

.back-top-enter-active,
.back-top-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.85);
}
</style>
