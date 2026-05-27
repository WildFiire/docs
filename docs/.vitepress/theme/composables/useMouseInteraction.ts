import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useMagnetic(elRef: Ref<HTMLElement | null>, strength = 0.3) {
  const x = ref(0)
  const y = ref(0)
  const isHovering = ref(false)

  let rafId: number | null = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let cachedRect: DOMRect | null = null

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

  const animate = () => {
    currentX = lerp(currentX, targetX, 0.15)
    currentY = lerp(currentY, targetY, 0.15)
    x.value = currentX
    y.value = currentY
    if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
      rafId = requestAnimationFrame(animate)
    } else {
      rafId = null
    }
  }

  const startAnimation = () => {
    if (!rafId) rafId = requestAnimationFrame(animate)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!elRef.value) return
    if (!cachedRect) cachedRect = elRef.value.getBoundingClientRect()
    const cx = cachedRect.left + cachedRect.width / 2
    const cy = cachedRect.top + cachedRect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    targetX = dx * strength
    targetY = dy * strength
    isHovering.value = true
    startAnimation()
  }

  const handleMouseLeave = () => {
    targetX = 0
    targetY = 0
    isHovering.value = false
    cachedRect = null
    startAnimation()
  }

  onMounted(() => {
    if (!elRef.value) return
    elRef.value.addEventListener('mousemove', handleMouseMove)
    elRef.value.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    if (!elRef.value) return
    elRef.value.removeEventListener('mousemove', handleMouseMove)
    elRef.value.removeEventListener('mouseleave', handleMouseLeave)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { x, y, isHovering }
}

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
