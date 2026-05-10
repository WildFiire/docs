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
