import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useTilt(elRef: Ref<HTMLElement | null>, maxTilt = 8) {
  const rotateX = ref(0)
  const rotateY = ref(0)
  const isHovering = ref(false)

  let rafId: number | null = null
  let targetRX = 0
  let targetRY = 0
  let currentRX = 0
  let currentRY = 0

  const lerp = (s: number, e: number, f: number) => s + (e - s) * f

  const tick = () => {
    currentRX = lerp(currentRX, targetRX, 0.1)
    currentRY = lerp(currentRY, targetRY, 0.1)
    rotateX.value = currentRX
    rotateY.value = currentRY
    if (Math.abs(currentRX - targetRX) > 0.01 || Math.abs(currentRY - targetRY) > 0.01) {
      rafId = requestAnimationFrame(tick)
    } else {
      rafId = null
    }
  }

  const start = () => { if (!rafId) rafId = requestAnimationFrame(tick) }

  const onMove = (e: MouseEvent) => {
    if (!elRef.value) return
    const rect = elRef.value.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    targetRX = -py * maxTilt
    targetRY = px * maxTilt
    isHovering.value = true
    start()
  }

  const onLeave = () => {
    targetRX = 0
    targetRY = 0
    isHovering.value = false
    start()
  }

  onMounted(() => {
    elRef.value?.addEventListener('mousemove', onMove)
    elRef.value?.addEventListener('mouseleave', onLeave)
  })

  onUnmounted(() => {
    elRef.value?.removeEventListener('mousemove', onMove)
    elRef.value?.removeEventListener('mouseleave', onLeave)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { rotateX, rotateY, isHovering }
}
