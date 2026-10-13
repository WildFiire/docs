<script setup lang="ts">
// 1:1 Port of LiquidBackground from wf-docscore/components/ui/LiquidEffects.tsx
import { onMounted } from 'vue';

const STYLE_ID = 'liquid-bg-keyframes';

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes liquidDrift1 {
      0%   { transform: translate(0px, 0px)   scale(1);    opacity: 0.60; }
      25%  { transform: translate(80px, -40px) scale(1.08); opacity: 0.45; }
      50%  { transform: translate(40px,  60px) scale(0.94); opacity: 0.55; }
      75%  { transform: translate(-50px, 20px) scale(1.04); opacity: 0.48; }
      100% { transform: translate(0px, 0px)   scale(1);    opacity: 0.60; }
    }
    @keyframes liquidDrift2 {
      0%   { transform: translate(0px, 0px)    scale(1);    opacity: 0.35; }
      33%  { transform: translate(-60px, 50px)  scale(1.10); opacity: 0.25; }
      66%  { transform: translate(70px, -30px)  scale(0.92); opacity: 0.40; }
      100% { transform: translate(0px, 0px)    scale(1);    opacity: 0.35; }
    }
    @keyframes liquidDrift3 {
      0%   { transform: translate(0px, 0px)    scale(1);    opacity: 0.20; }
      40%  { transform: translate(50px, 80px)  scale(1.12); opacity: 0.28; }
      80%  { transform: translate(-70px, -40px) scale(0.88); opacity: 0.18; }
      100% { transform: translate(0px, 0px)    scale(1);    opacity: 0.20; }
    }

    [data-theme="light"] .liquid-blob-1 {
      opacity: 0.45 !important;
    }
    [data-theme="light"] .liquid-blob-2 {
      opacity: 0.30 !important;
    }
    [data-theme="light"] .liquid-blob-3 {
      opacity: 0.25 !important;
    }

    @media (max-width: 768px) {
      .liquid-blob-1 {
        width: 140vw !important;
        height: 70vh !important;
        left: -20% !important;
      }
      .liquid-blob-2 {
        width: 120vw !important;
        height: 60vh !important;
        right: -20% !important;
      }
      .liquid-blob-3 {
        width: 100vw !important;
        height: 50vh !important;
        left: 0% !important;
      }
      .liquid-blob-4 {
        width: 110vw !important;
        height: 55vh !important;
        left: -10% !important;
      }
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
    aria-hidden="true"
    class="liquid-bg-container"
    style="inset: 0; overflow: hidden; pointer-events: none; position: fixed; z-index: 0;"
  >
    <!-- Noise texture overlay -->
    <div
      style="position: absolute; inset: 0; background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E&quot;); pointer-events: none;"
    />

    <!-- Orb 1 — bottom-left fire orange -->
    <div
      class="liquid-blob-1"
      style="animation: liquidDrift1 22s ease-in-out infinite; background: radial-gradient(ellipse at center, hsl(26 100% 52% / 0.13) 0%, transparent 70%); bottom: -10%; left: -5%; position: absolute; height: 80vh; width: 70vw; will-change: transform;"
    />

    <!-- Orb 2 — top-right deep red -->
    <div
      class="liquid-blob-2"
      style="animation: liquidDrift2 30s ease-in-out infinite 4s; background: radial-gradient(ellipse at center, hsl(8 90% 45% / 0.09) 0%, transparent 70%); right: -10%; top: 5%; position: absolute; height: 60vh; width: 50vw; will-change: transform;"
    />

    <!-- Orb 3 — center amber accent -->
    <div
      class="liquid-blob-3"
      style="animation: liquidDrift3 40s ease-in-out infinite 8s; background: radial-gradient(ellipse at center, hsl(38 100% 52% / 0.07) 0%, transparent 70%); left: 30%; top: 30%; position: absolute; height: 50vh; width: 40vw; will-change: transform;"
    />

    <!-- Orb 4 — top-left cool accent (deep crimson) -->
    <div
      class="liquid-blob-4"
      style="animation: liquidDrift2 26s ease-in-out infinite 2s; background: radial-gradient(ellipse at center, hsl(0 80% 40% / 0.06) 0%, transparent 70%); left: -8%; top: -8%; position: absolute; height: 55vh; width: 55vw; will-change: transform;"
    />
  </div>
</template>
