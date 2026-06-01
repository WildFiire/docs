import { ref, reactive, onUnmounted, nextTick } from 'vue'

export function useHomeAnimations(inBrowser: boolean) {
  // Tilt cards
  const tiltRefs = reactive<Record<number, HTMLElement>>({})
  const tiltRects = reactive<Record<number, DOMRect>>({})
  const tiltData = reactive<Record<number, { rx: number; ry: number }>>({})
  const tiltRafs: Record<number, number | null> = {}

  const handleTiltMove = (i: number, e: MouseEvent) => {
    if (tiltRafs[i]) return
    const el = tiltRefs[i]
    if (!el) return
    if (!tiltRects[i]) tiltRects[i] = el.getBoundingClientRect()
    const rect = tiltRects[i]
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    tiltRafs[i] = requestAnimationFrame(() => {
      tiltData[i] = { rx: -py * 6, ry: px * 6 }
      tiltRafs[i] = null
    })
  }

  const handleTiltLeave = (i: number) => { 
    tiltData[i] = { rx: 0, ry: 0 }
  }

  const tiltStyle = (i: number) => {
    const d = tiltData[i] || { rx: 0, ry: 0 }
    return { transform: `perspective(800px) rotateX(${d.rx}deg) rotateY(${d.ry}deg)` }
  }

  const attachTiltListeners = () => {
    if (!inBrowser) return
    nextTick(() => {
      Object.entries(tiltRefs).forEach(([key, el]) => {
        if (!el) return
        const i = Number(key)
        el.addEventListener('mousemove', (e: MouseEvent) => handleTiltMove(i, e))
        el.addEventListener('mouseleave', () => handleTiltLeave(i))
      })
    })
    window.addEventListener('resize', handleResize, { passive: true })
  }

  const handleResize = () => {
    Object.keys(tiltRects).forEach(k => delete tiltRects[Number(k)])
  }

  // Parallax Hero
  const heroContainer = ref<HTMLElement | null>(null)
  const scrollHintFaded = ref(false)
  let parallaxRaf: number | null = null

  const updateParallax = () => {
    parallaxRaf = null
    if (!inBrowser) return
    const sy = window.scrollY
    scrollHintFaded.value = sy > 100
    if (heroContainer.value) {
      if (window.innerWidth > 1024) {
        heroContainer.value.style.transform = `translate3d(0, ${-sy * 0.18}px, 0)`
        heroContainer.value.style.opacity = `${Math.max(0, 1 - sy * 0.0015)}`
      } else {
        heroContainer.value.style.transform = 'none'
        heroContainer.value.style.opacity = '1'
      }
    }
  }

  const handleScroll = () => {
    if (!inBrowser || parallaxRaf) return
    parallaxRaf = requestAnimationFrame(updateParallax)
  }

  // IntersectionObserver for scroll animations
  let observer: IntersectionObserver | null = null

  const setupScrollAnimations = () => {
    if (!inBrowser) return
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement
        const delay = parseInt(el.dataset.delay || '0', 10)
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('anim-visible')
            if (observer) observer.unobserve(el)
          }, delay)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' })

    document.querySelectorAll('.anim-item').forEach(el => observer!.observe(el))
  }

  const triggerBoom = () => {
    if (!inBrowser) return
    const logo = document.querySelector('.wf-hero__logo-shader') as HTMLElement
    if (!logo) return
    logo.classList.add('boom')
    setTimeout(() => logo.classList.remove('boom'), 600)
  }

  const startHomeAnimations = () => {
    if (!inBrowser) return
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    nextTick(() => {
      setTimeout(setupScrollAnimations, 200)
      setTimeout(attachTiltListeners, 400)
    })
  }

  onUnmounted(() => {
    if (!inBrowser) return
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
    observer?.disconnect()
  })

  return {
    tiltRefs,
    tiltStyle,
    heroContainer,
    scrollHintFaded,
    triggerBoom,
    startHomeAnimations,
  }
}
