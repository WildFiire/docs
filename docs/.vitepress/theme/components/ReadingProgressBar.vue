<template>
  <div class="reading-progress-bar" :style="{ width: progress + '%' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const progress = ref(0)
const route = useRoute()

function update() {
  const el = document.documentElement
  const scrolled = el.scrollTop || window.scrollY
  const total = el.scrollHeight - el.clientHeight
  progress.value = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0
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
