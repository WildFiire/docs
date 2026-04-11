<template>
  <div
    class="scroll-spy"
    :class="{ 'scroll-spy--visible': isVisible, 'scroll-spy--hovering': isHovering, 'scroll-spy--light': !isDark }"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="scroll-spy__track">
      <div
        v-for="section in sections"
        :key="section.id"
        class="scroll-spy__item"
        :class="{ 'scroll-spy__item--active': activeId === section.id }"
        @click="scrollTo(section.id)"
      >
        <span class="scroll-spy__dot"></span>
        <span class="scroll-spy__label">{{ section.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

export interface SpySection {
  id: string
  label: string
}

const props = defineProps<{
  sections: SpySection[]
}>()

const activeId = ref('')
const isVisible = ref(false)
const isHovering = ref(false)

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  const scrollY = window.scrollY
  isVisible.value = scrollY > 300

  const vh = window.innerHeight
  let current = ''

  for (const section of props.sections) {
    const el = document.getElementById(section.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top < vh * 0.5 && rect.bottom > 0) {
      current = section.id
    }
  }

  activeId.value = current
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-spy {
  position: fixed;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  padding: 8px 0;
  background: transparent;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.scroll-spy--visible {
  opacity: 1;
  pointer-events: auto;
}

/* Track */
.scroll-spy__track {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

/* Connecting vertical line */
.scroll-spy__track::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 14px;
  bottom: 14px;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.12) 15%, rgba(255, 255, 255, 0.12) 85%, transparent 100%);
  border-radius: 1px;
  z-index: 0;
}
.scroll-spy--light .scroll-spy__track::before {
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.15) 15%, rgba(0, 0, 0, 0.15) 85%, transparent 100%);
}

/* Items */
.scroll-spy__item {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: 8px 4px 8px 0;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
}

/* Dot */
.scroll-spy__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}
.scroll-spy--light .scroll-spy__dot {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.18);
}

/* Active dot */
.scroll-spy__item--active .scroll-spy__dot {
  background: #ff7800;
  border-color: #ff6a00;
  box-shadow: 0 0 8px rgba(255, 120, 0, 0.7), 0 0 20px rgba(255, 120, 0, 0.3);
  animation: dotPulse 2.5s ease-in-out infinite;
}
@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 8px rgba(255, 120, 0, 0.7), 0 0 20px rgba(255, 120, 0, 0.3); }
  50% { box-shadow: 0 0 14px rgba(255, 120, 0, 0.9), 0 0 30px rgba(255, 120, 0, 0.45); }
}

.scroll-spy__item:hover .scroll-spy__dot {
  background: rgba(255, 120, 0, 0.4);
  border-color: rgba(255, 100, 0, 0.5);
}

/* Label — always visible */
.scroll-spy__label {
  font-size: 8px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
  white-space: nowrap;
  transition: color 0.25s ease;
}
.scroll-spy--light .scroll-spy__label {
  color: rgba(0, 0, 0, 0.3);
}

/* Active label */
.scroll-spy__item--active .scroll-spy__label {
  color: #ff6a00;
  text-shadow: 0 0 10px rgba(255, 100, 0, 0.4);
}

/* Hover */
.scroll-spy__item:hover .scroll-spy__label {
  color: rgba(255, 255, 255, 0.65);
}
.scroll-spy--light .scroll-spy__item:hover .scroll-spy__label {
  color: rgba(0, 0, 0, 0.55);
}
.scroll-spy__item--active:hover .scroll-spy__label {
  color: #ff6a00;
}

@media (max-width: 1200px) {
  .scroll-spy { display: none; }
}
</style>
