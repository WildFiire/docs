<script setup lang="ts">
// 1:1 Port of LiquidFireWave from wf-docscore/components/ui/LiquidEffects.tsx
import { onMounted } from 'vue';

withDefaults(defineProps<{
  height?: number;
  className?: string;
}>(), {
  height: 95,
  className: '',
});

const STYLE_ID = 'liquid-wave-keyframes';

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes lavaFlow1 {
      0%, 100% { d: path("M0,100 L0,30 C180,18 360,42 540,28 C720,16 900,38 1080,24 C1260,14 1350,32 1440,25 L1440,100 Z"); }
      50%       { d: path("M0,100 L0,38 C180,26 360,16 540,36 C720,28 900,16 1080,34 C1260,26 1350,18 1440,32 L1440,100 Z"); }
    }
    @keyframes lavaFlow2 {
      0%, 100% { d: path("M0,100 L0,45 C200,32 400,58 600,40 C800,28 1000,52 1200,38 C1320,30 1380,48 1440,40 L1440,100 Z"); }
      50%       { d: path("M0,100 L0,35 C200,50 400,30 600,50 C800,42 1000,28 1200,48 C1320,40 1380,32 1440,46 L1440,100 Z"); }
    }
    @keyframes lavaFlow3 {
      0%, 100% { d: path("M0,100 L0,60 C240,48 480,68 720,54 C960,44 1200,64 1320,52 1400,60 1440,56 L1440,100 Z"); }
      50%       { d: path("M0,100 L0,50 C240,65 480,45 720,62 C960,56 1200,46 1320,60 1400,52 1440,58 L1440,100 Z"); }
    }
    @keyframes lavaFlow4 {
      0%, 100% { d: path("M0,100 L0,74 C300,66 600,80 900,70 C1100,64 1300,76 1440,70 L1440,100 Z"); }
      50%       { d: path("M0,100 L0,68 C300,78 600,65 900,78 C1100,72 1300,66 1440,74 L1440,100 Z"); }
    }
  `;
  document.head.appendChild(style);
}

onMounted(() => {
  injectStyles();
});
</script>

<template>
  <div
    class="liquid-lava-tank"
    :class="className"
    :style="{
      width: '100%',
      height: `${height}px`,
      position: 'relative',
      overflow: 'hidden',
      display: 'block',
      lineHeight: 0,
      flexShrink: 0,
    }"
    aria-hidden="true"
  >
    <!-- Top soft fade mask -->
    <div
      style="position: absolute; top: 0; left: 0; right: 0; height: 24px; background: linear-gradient(180deg, var(--sidebar-bg) 0%, transparent 100%); z-index: 3; pointer-events: none;"
    />

    <!-- SVG Multi-Layer Molten Waves -->
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style="display: block;"
    >
      <defs>
        <!-- Deep Magma Base -->
        <linearGradient id="lava-base-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="hsl(8, 90%, 26%)" stop-opacity="0.95" />
          <stop offset="25%" stop-color="hsl(16, 95%, 34%)" stop-opacity="0.95" />
          <stop offset="65%" stop-color="hsl(24, 100%, 42%)" stop-opacity="0.95" />
          <stop offset="100%" stop-color="hsl(8, 90%, 26%)" stop-opacity="0.95" />
        </linearGradient>

        <!-- Liquid Fire Middle -->
        <linearGradient id="lava-mid-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="hsl(20, 100%, 44%)" stop-opacity="0.80" />
          <stop offset="45%" stop-color="hsl(28, 100%, 50%)" stop-opacity="0.85" />
          <stop offset="85%" stop-color="hsl(36, 100%, 54%)" stop-opacity="0.80" />
          <stop offset="100%" stop-color="hsl(20, 100%, 44%)" stop-opacity="0.80" />
        </linearGradient>

        <!-- Molten Amber Crest -->
        <linearGradient id="lava-crest-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="hsl(32, 100%, 52%)" stop-opacity="0.65" />
          <stop offset="50%" stop-color="hsl(44, 100%, 58%)" stop-opacity="0.75" />
          <stop offset="100%" stop-color="hsl(32, 100%, 52%)" stop-opacity="0.65" />
        </linearGradient>

        <!-- Incandescent Golden Froth -->
        <linearGradient id="lava-froth-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="hsl(44, 100%, 65%)" stop-opacity="0.45" />
          <stop offset="50%" stop-color="hsl(52, 100%, 75%)" stop-opacity="0.60" />
          <stop offset="100%" stop-color="hsl(44, 100%, 65%)" stop-opacity="0.45" />
        </linearGradient>
      </defs>

      <!-- Wave Layer 1 — Deep Bed -->
      <path
        fill="url(#lava-base-grad)"
        style="animation: lavaFlow1 11s ease-in-out infinite;"
        d="M0,100 L0,30 C180,18 360,42 540,28 C720,16 900,38 1080,24 C1260,14 1350,32 1440,25 L1440,100 Z"
      />

      <!-- Wave Layer 2 — Molten Magma -->
      <path
        fill="url(#lava-mid-grad)"
        style="animation: lavaFlow2 8s ease-in-out infinite 0.6s;"
        d="M0,100 L0,45 C200,32 400,58 600,40 C800,28 1000,52 1200,38 C1320,30 1380,48 1440,40 L1440,100 Z"
      />

      <!-- Wave Layer 3 — Amber Swell -->
      <path
        fill="url(#lava-crest-grad)"
        style="animation: lavaFlow3 6s ease-in-out infinite 1.2s;"
        d="M0,100 L0,60 C240,48 480,68 720,54 C960,40 1200,68 1440,56 L1440,100 Z"
      />

      <!-- Wave Layer 4 — Golden Froth Tip -->
      <path
        fill="url(#lava-froth-grad)"
        style="animation: lavaFlow4 4.5s ease-in-out infinite 0.3s;"
        d="M0,100 L0,74 C300,66 600,80 900,70 C1100,64 1300,76 1440,70 L1440,100 Z"
      />
    </svg>
  </div>
</template>
