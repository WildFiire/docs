<template>
  <div ref="bar" class="reading-progress-bar"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const bar = ref(null)

let scrollRaf = null
function update() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    const el = document.documentElement
    const scrolled = el.scrollTop || window.scrollY
    const total = el.scrollHeight - el.clientHeight
    const progress = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0
    
    if (bar.value) {
      bar.value.style.width = progress + '%'
    }
    
    scrollRaf = null
  })
}

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})
</script>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff7800 0%, #ff7800 60%, #ffd700 100%);
  z-index: 10000;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(255, 120, 0, 0.6), 0 0 4px rgba(255, 140, 0, 0.4);
  pointer-events: none;
}
</style>
