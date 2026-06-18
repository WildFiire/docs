<template>
  <div
    class="pt-container"
    ref="containerRef"
    :style="{ display: (isInitialLoad || isTransitioning) ? 'flex' : 'none' }"
  >
    <div class="pt-slices">
      <div
        v-for="i in slicesCount"
        :key="i"
        class="pt-slice"
        ref="slicesRefs"
      ></div>
    </div>
    <div class="pt-logo-wrap" ref="logoRef">
      <Icon icon="game-icons:phoenix" class="pt-phoenix-icon" ref="phoenixRef" />
      <svg class="pt-logo-svg" viewBox="0 0 400 200">
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="central"
          dy=".1em"
          class="pt-logo-text"
          ref="textPathRef"
        >
          WF
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vitepress';
import gsap from 'gsap';
import { Icon } from '@iconify/vue';

const slicesCount = 5;

const isTransitioning = ref(false);
const isInitialLoad = ref(true);

const containerRef = ref(null);
const slicesRefs = ref([]);
const logoRef = ref(null);
const textPathRef = ref(null);
const phoenixRef = ref(null);

const router = useRouter();

onMounted(async () => {
  await nextTick();

  const y = window.scrollY;
  const body = document.body;
  body.style.position = 'fixed';
  body.style.top = `-${y}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  gsap.set(containerRef.value, { display: 'flex', backgroundColor: '#050505' });
  gsap.set(slicesRefs.value, { yPercent: 100 });
  gsap.set(logoRef.value, {
    scale: 1.2,
    opacity: 1,
    rotation: 0,
    filter: "drop-shadow(0px 0px 0px #0a0a0a) drop-shadow(0px 0px 0px #ff7800)"
  });
  gsap.set(textPathRef.value, { strokeDashoffset: 2500, fill: "transparent" });
  gsap.set(phoenixRef.value.$el || phoenixRef.value, { opacity: 0, scale: 0.5, y: 30 });

  const tl = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, y);

      isInitialLoad.value = false;
      gsap.set(containerRef.value, { display: 'none', backgroundColor: 'transparent' });
    }
  });

  tl.to((phoenixRef.value.$el || phoenixRef.value), {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1.0,
    ease: "back.out(1.5)"
  })
  .to(textPathRef.value, {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: "power2.inOut"
  }, "-=0.8")
  .to(textPathRef.value, {
    fill: "#ff7800",
    duration: 0.3
  }, "-=0.3")
  .to(logoRef.value, {
    filter: "drop-shadow(15px 15px 0px #0a0a0a) drop-shadow(25px 25px 0px #ff7800)",
    scale: 1,
    duration: 0.4,
    ease: "back.out(2)"
  }, "-=0.1")
  .to(slicesRefs.value, {
    yPercent: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: "power4.inOut",
    onComplete: () => gsap.set(containerRef.value, { backgroundColor: 'transparent' })
  }, "-=0.2")
  .to(logoRef.value, {
    scale: 0.1,
    opacity: 0,
    rotation: -30,
    filter: "drop-shadow(0px 0px 0px #0a0a0a) drop-shadow(0px 0px 0px #ff7800)",
    duration: 0.35,
    ease: "power3.in"
  }, "+=0.15")
  .to(slicesRefs.value, {
    yPercent: -100,
    duration: 0.6,
    stagger: 0.05,
    ease: "power4.inOut"
  }, "<0.1");

  const handleClick = (e) => {
    if (isTransitioning.value || isInitialLoad.value) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const a = e.target.closest('a');
    if (a && a.href && a.href.startsWith(window.location.origin) && a.target !== '_blank' && !a.hasAttribute('download')) {
      const url = new URL(a.href);
      if (url.pathname !== window.location.pathname) {
        e.preventDefault();
        e.stopPropagation();

        isTransitioning.value = true;
        const targetUrl = url.pathname + url.search + url.hash;

        const tlClick = gsap.timeline();

        gsap.set(containerRef.value, { display: 'flex', backgroundColor: 'transparent' });
        gsap.set(slicesRefs.value, { yPercent: 100 });
        gsap.set(logoRef.value, {
          scale: 1.2,
          opacity: 1,
          rotation: 0,
          filter: "drop-shadow(0px 0px 0px #0a0a0a) drop-shadow(0px 0px 0px #ff7800)"
        });
        gsap.set(textPathRef.value, { strokeDashoffset: 2500, fill: "transparent" });
        gsap.set(phoenixRef.value.$el || phoenixRef.value, { opacity: 0, scale: 0.5, y: -40 });

        tlClick.to(containerRef.value, {
          backgroundColor: '#050505',
          duration: 0.3
        })
        .to((phoenixRef.value.$el || phoenixRef.value), {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          ease: "back.out(1.5)"
        })
        .to(textPathRef.value, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut"
        }, "-=0.8")
        .to(textPathRef.value, {
          fill: "#ff7800",
          duration: 0.3
        }, "-=0.3")
        .to(logoRef.value, {
          filter: "drop-shadow(15px 15px 0px #0a0a0a) drop-shadow(25px 25px 0px #ff7800)",
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)"
        }, "-=0.1")
        .to(slicesRefs.value, {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power4.inOut",
          onComplete: () => {
            gsap.set(containerRef.value, { backgroundColor: 'transparent' });

            router.go(targetUrl);

            gsap.timeline({
              onComplete: () => {
                isTransitioning.value = false;
              }
            })
            .to(logoRef.value, {
              scale: 0.1,
              opacity: 0,
              rotation: -30,
              filter: "drop-shadow(0px 0px 0px #0a0a0a) drop-shadow(0px 0px 0px #ff7800)",
              duration: 0.35,
              ease: "power3.in"
            })
            .to(slicesRefs.value, {
              yPercent: -100,
              duration: 0.6,
              stagger: 0.05,
              ease: "power4.inOut"
            }, "<0.1");
          }
        }, "-=0.2");
      }
    }
  };

  document.addEventListener('click', handleClick, true);

  onUnmounted(() => {
    document.removeEventListener('click', handleClick, true);
  });
});
</script>

<style scoped>
/* ============================================
   PAGE TRANSITION — Angled Esports Wipe
   ============================================ */

.pt-container {
    position: fixed;
    inset: 0;
    z-index: 999999;
    pointer-events: none;
    display: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.pt-slices {
    position: absolute;
    top: -20%;
    left: -10%;
    display: flex;
    width: 120%;
    height: 140%;
    z-index: 1;
    transform: skewX(-15deg);
}

.pt-slice {
    flex: 1;
    height: 100%;
    background: #ff7800;
    will-change: transform;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.pt-logo-wrap {
    position: relative;
    z-index: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    will-change: transform, opacity, filter;
}

.pt-phoenix-icon {
    font-size: 140px;
    color: #ff7800;
    margin-bottom: -50px;
    z-index: 5;
    filter: drop-shadow(0px 0px 15px rgba(255, 120, 0, 0.6));
    will-change: transform, opacity;
}

.pt-logo-svg {
    width: 40rem;
    height: 20rem;
    overflow: visible;
}

.pt-logo-text {
    font-size: 160px;
    font-weight: 900;
    fill: transparent;
    stroke: #ff7800;
    stroke-width: 3px;
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    font-style: italic;
    stroke-dasharray: 2500;
    stroke-dashoffset: 2500;
    stroke-linejoin: round;
    stroke-linecap: round;
}

@media (max-width: 768px) {
    .pt-logo-svg {
        width: 20rem;
        height: 10rem;
    }
    .pt-phoenix-icon {
        font-size: 80px;
        margin-bottom: -30px;
    }
}
</style>
