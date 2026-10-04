<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Icon } from '@iconify/vue';

interface Props {
  mode?: 'fullscreen' | 'inline' | 'overlay';
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showLogs?: boolean;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'fullscreen',
  title: 'WILDFIRE MISSION CONTROL',
  subtitle: 'Se inițializează sesiunea și matricea de securitate…',
  compact: false,
  showLogs: true,
  height: undefined,
});

const progress = ref(14);
const activeLogIndex = ref(0);
const isClient = ref(false);

const bootLogs = [
  { tag: 'SYS_BOOT', text: 'Inițializare nucleu administrativ Wildfire…', status: 'OK' },
  { tag: 'TLS_GATE', text: 'Handshake criptografic AES-256-GCM stabilit…', status: 'OK' },
  { tag: 'AUTH_ME', text: 'Validare sesiune & token criptografic HMAC…', status: 'VERIFIED' },
  { tag: 'RBAC_POL', text: 'Decriptare permisiuni Staff & matrice roluri…', status: 'LOADED' },
  { tag: 'GITOPS', text: 'Sincronizare nod telemetrie CS2 & Webhook Engine…', status: 'SYNCED' },
  { tag: 'CANONICAL', text: 'Verificare catalog documentație & cache…', status: 'READY' },
  { tag: 'LAUNCH', text: 'Autorizare confirmată. Se deschide consola…', status: 'ONLINE' },
];

let progressTimer: ReturnType<typeof setInterval> | null = null;
let logTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  isClient.value = true;

  // Smooth progressive ticker that realistically slows as it approaches 96%
  progressTimer = setInterval(() => {
    if (progress.value < 65) {
      progress.value += Math.floor(Math.random() * 8) + 4;
    } else if (progress.value < 88) {
      progress.value += Math.floor(Math.random() * 4) + 2;
    } else if (progress.value < 97) {
      progress.value += 1;
    }
    if (progress.value > 98) progress.value = 98;
  }, 220);

  // Dynamic cycling through telemetry boot sequence
  logTimer = setInterval(() => {
    if (activeLogIndex.value < bootLogs.length - 1) {
      activeLogIndex.value++;
    }
  }, 480);
});

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer);
  if (logTimer) clearInterval(logTimer);
});

const displayedLogs = computed(() => {
  return bootLogs.slice(0, activeLogIndex.value + 1);
});
</script>

<template>
  <div
    class="adx-thematic-loader"
    :class="[
      `adx-thematic-loader--${mode}`,
      { 'adx-thematic-loader--compact': compact }
    ]"
    :style="height ? { minHeight: height } : undefined"
    role="status"
    aria-live="polite"
    aria-label="Se încarcă consola de administrare Wildfire"
  >
    <!-- Background Atmosphere: Cyber Grid + Deep Ambient Fire Glow -->
    <div class="adx-loader-backdrop" aria-hidden="true">
      <div class="adx-loader-glow adx-loader-glow--primary" />
      <div class="adx-loader-glow adx-loader-glow--secondary" />
      <div class="adx-loader-grid" />
      <div class="adx-loader-scanline" />

      <!-- Floating ember sparks -->
      <div class="adx-ember adx-ember--1" />
      <div class="adx-ember adx-ember--2" />
      <div class="adx-ember adx-ember--3" />
      <div class="adx-ember adx-ember--4" />
      <div class="adx-ember adx-ember--5" />
      <div class="adx-ember adx-ember--6" />
    </div>

    <!-- Tactical Corner HUD Telemetry (Fullscreen only) -->
    <template v-if="mode === 'fullscreen' && !compact">
      <div class="adx-hud-corner adx-hud-corner--tl" aria-hidden="true">
        <span class="adx-hud-mono">CLUSTER: WF-CS2-PROD</span>
        <span class="adx-hud-dot" />
        <span class="adx-hud-dim">SEC_LVL // ROOT-4</span>
      </div>
      <div class="adx-hud-corner adx-hud-corner--tr" aria-hidden="true">
        <span class="adx-hud-mono">PROTOCOL: TLSv1.3 / AES-256</span>
        <span class="adx-hud-dim">LATENCY &lt;14ms</span>
      </div>
      <div class="adx-hud-corner adx-hud-corner--bl" aria-hidden="true">
        <span class="adx-hud-dim">WILDFIRE CANONICAL ENGINE v2.4</span>
      </div>
      <div class="adx-hud-corner adx-hud-corner--br" aria-hidden="true">
        <span class="adx-hud-dim">MISSION CONTROL // STATUS: INITIALIZING</span>
      </div>
    </template>

    <!-- Core Interactive HUD Frame -->
    <div class="adx-loader-card">
      <!-- Reticle / Orbital Rings & Logo Center -->
      <div class="adx-loader-reticle">
        <!-- Outer Rotating Dashed Ring -->
        <svg class="adx-reticle-ring adx-reticle-ring--outer" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="url(#amberGrad)"
            stroke-width="2"
            stroke-dasharray="14 12 6 12"
            stroke-linecap="round"
          />
          <defs>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff4500" stop-opacity="0.9" />
              <stop offset="50%" stop-color="#ff8c00" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#ffd700" stop-opacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Inner Counter-Rotating Ring -->
        <svg class="adx-reticle-ring adx-reticle-ring--inner" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="58"
            fill="none"
            stroke="rgba(255, 140, 0, 0.45)"
            stroke-width="1.5"
            stroke-dasharray="4 8"
          />
          <!-- 4 Cardinal Tick Marks -->
          <line x1="80" y1="12" x2="80" y2="20" stroke="#ff8c00" stroke-width="2" />
          <line x1="80" y1="140" x2="80" y2="148" stroke="#ff8c00" stroke-width="2" />
          <line x1="12" y1="80" x2="20" y2="80" stroke="#ff8c00" stroke-width="2" />
          <line x1="140" y1="80" x2="148" y2="80" stroke="#ff8c00" stroke-width="2" />
        </svg>

        <!-- Center Flame Halo & Wildfire Logo -->
        <div class="adx-reticle-center">
          <div class="adx-center-glow" />
          <img
            src="/logo.png"
            alt="Wildfire Logo"
            class="adx-center-logo"
            width="56"
            height="56"
            @error="($event.target as HTMLElement).style.display = 'none'"
          />
          <Icon
            icon="lucide:flame"
            class="adx-center-fallback-icon"
            width="36"
            height="36"
          />
        </div>
      </div>

      <!-- Main Title & Operational Status -->
      <div class="adx-loader-meta">
        <div class="adx-loader-status-badge">
          <span class="adx-status-dot" />
          <span class="adx-status-text">INITIALIZING SECURE MATRIX</span>
          <span class="adx-status-pill">CS2 PROTOCOL</span>
        </div>

        <h2 class="adx-loader-title">{{ title }}</h2>
        <p class="adx-loader-sub">{{ subtitle }}</p>
      </div>

      <!-- High-Tech Progress Meter -->
      <div class="adx-progress-wrapper">
        <div class="adx-progress-header">
          <span class="adx-progress-label">
            <Icon icon="lucide:shield-check" width="13" height="13" class="text-amber-500" />
            SYNCHRONIZING TELEMETRY
          </span>
          <span class="adx-progress-pct">{{ progress }}%</span>
        </div>

        <div class="adx-progress-track">
          <div
            class="adx-progress-bar"
            :style="{ width: `${progress}%` }"
          >
            <div class="adx-progress-glow" />
            <div class="adx-progress-stripes" />
          </div>
        </div>

        <div class="adx-progress-footer">
          <span class="adx-metric-item">PACKETS: <strong>1,480 / 1,480</strong></span>
          <span class="adx-metric-item">THROUGHPUT: <strong>2.8 GB/s</strong></span>
          <span class="adx-metric-item">ENCRYPTION: <strong>ACTIVE</strong></span>
        </div>
      </div>

      <!-- Cyber Terminal Boot Log (Fullscreen / Detailed mode) -->
      <div v-if="showLogs && !compact" class="adx-console-box">
        <div class="adx-console-header">
          <div class="adx-console-dots">
            <span class="dot dot--red" />
            <span class="dot dot--yellow" />
            <span class="dot dot--green" />
          </div>
          <span class="adx-console-title">CANONICAL TELEMETRY STREAM</span>
          <span class="adx-console-live-tag">LIVE</span>
        </div>

        <div class="adx-console-body">
          <div
            v-for="(log, idx) in displayedLogs"
            :key="idx"
            class="adx-console-line"
            :class="{ 'adx-console-line--active': idx === displayedLogs.length - 1 }"
          >
            <span class="adx-console-time">[{{ (idx * 0.08 + 0.04).toFixed(2) }}s]</span>
            <span class="adx-console-tag">[{{ log.tag }}]</span>
            <span class="adx-console-text">{{ log.text }}</span>
            <span
              class="adx-console-status"
              :class="log.status === 'VERIFIED' || log.status === 'OK' || log.status === 'ONLINE' ? 'status--ok' : 'status--busy'"
            >
              {{ log.status }}
            </span>
          </div>

          <!-- Blinking Cyber Cursor -->
          <div class="adx-console-cursor-line">
            <span class="adx-prompt">&gt;</span>
            <span class="adx-cursor">_</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   WILDFIRE THEMATIC MISSION CONTROL LOADER
   Tactical Cyberpunk & Fire Glass Aesthetic
   ============================================================ */

.adx-thematic-loader {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: hsl(0 0% 95%);
  user-select: none;
  overflow: hidden;
  box-sizing: border-box;
}

/* Fullscreen Mode (Main Admin Shell Initialization) */
.adx-thematic-loader--fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: radial-gradient(circle at center, hsl(220 22% 7%) 0%, hsl(220 25% 3.5%) 100%);
  padding: 24px;
}

/* Inline Mode (Page-level data refresh / tabs) */
.adx-thematic-loader--inline {
  width: 100%;
  min-height: 480px;
  padding: 32px 16px;
  background: transparent;
}

/* Compact Mode (Small widgets / cards) */
.adx-thematic-loader--compact {
  min-height: 280px;
  padding: 16px;
}

/* Overlay Mode */
.adx-thematic-loader--overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: hsl(220 25% 4% / 0.88);
  backdrop-filter: blur(8px);
}

/* ── Ambient Background Atmosphere ────────────────────────── */
.adx-loader-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.adx-loader-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(255, 106, 0, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 106, 0, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
}

.adx-loader-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 140, 0, 0.6) 50%, transparent 100%);
  box-shadow: 0 0 15px rgba(255, 106, 0, 0.8);
  opacity: 0.7;
  animation: scanlineSweep 4s ease-in-out infinite;
}

.adx-loader-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  will-change: transform;
}

.adx-loader-glow--primary {
  top: 30%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, hsl(26 100% 52% / 0.35) 0%, transparent 70%);
  animation: glowPulse 5s ease-in-out infinite alternate;
}

.adx-loader-glow--secondary {
  bottom: 10%;
  right: 25%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, hsl(10 90% 45% / 0.25) 0%, transparent 70%);
  animation: glowPulse 7s ease-in-out infinite alternate-reverse;
}

/* Floating Ember Sparks */
.adx-ember {
  position: absolute;
  bottom: -20px;
  width: 4px;
  height: 4px;
  background: #ffaa00;
  border-radius: 50%;
  box-shadow: 0 0 8px #ff6a00, 0 0 16px #ff4500;
  animation: floatEmber 6s infinite ease-in;
  opacity: 0;
}
.adx-ember--1 { left: 20%; animation-delay: 0s; animation-duration: 5.5s; width: 3px; height: 3px; }
.adx-ember--2 { left: 35%; animation-delay: 1.4s; animation-duration: 7s; width: 5px; height: 5px; }
.adx-ember--3 { left: 52%; animation-delay: 2.8s; animation-duration: 6.2s; width: 3px; height: 3px; }
.adx-ember--4 { left: 68%; animation-delay: 0.7s; animation-duration: 5.8s; width: 4px; height: 4px; }
.adx-ember--5 { left: 82%; animation-delay: 3.2s; animation-duration: 6.6s; width: 3px; height: 3px; }
.adx-ember--6 { left: 45%; animation-delay: 4.1s; animation-duration: 8s; width: 6px; height: 6px; }

/* ── Tactical Corner HUD Elements ─────────────────────────── */
.adx-hud-corner {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  color: hsl(0 0% 50%);
  letter-spacing: 0.08em;
  pointer-events: none;
  z-index: 10;
}
.adx-hud-corner--tl { top: 20px; left: 24px; }
.adx-hud-corner--tr { top: 20px; right: 24px; }
.adx-hud-corner--bl { bottom: 20px; left: 24px; }
.adx-hud-corner--br { bottom: 20px; right: 24px; }

.adx-hud-mono {
  color: hsl(26 100% 65%);
  font-weight: 600;
}
.adx-hud-dim {
  color: hsl(0 0% 45%);
}
.adx-hud-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
  animation: hudDotBlink 2s infinite ease-in-out;
}

/* ── Main Loader Card ─────────────────────────────────────── */
.adx-loader-card {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 580px;
  width: 100%;
  padding: 36px 32px;
  background: hsl(220 22% 8% / 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(26 100% 52% / 0.22);
  border-radius: 16px;
  box-shadow: 
    0 16px 48px -12px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 120, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 0 24px rgba(255, 106, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
}

.adx-thematic-loader--compact .adx-loader-card {
  padding: 20px 24px;
  max-width: 440px;
}

/* ── Central Reticle & Logo ───────────────────────────────── */
.adx-loader-reticle {
  position: relative;
  width: 130px;
  height: 130px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.adx-reticle-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.adx-reticle-ring--outer {
  animation: reticleSpinClockwise 16s linear infinite;
  filter: drop-shadow(0 0 6px rgba(255, 106, 0, 0.5));
}

.adx-reticle-ring--inner {
  animation: reticleSpinCounter 24s linear infinite;
}

.adx-reticle-center {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 35% 35%, hsl(220 20% 14%), hsl(220 24% 7%));
  border: 1px solid hsl(26 100% 52% / 0.4);
  box-shadow: 
    0 0 24px rgba(255, 106, 0, 0.35),
    inset 0 0 12px rgba(255, 80, 0, 0.4);
}

.adx-center-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 120, 0, 0.35) 0%, transparent 70%);
  animation: haloBreathe 3s ease-in-out infinite alternate;
  pointer-events: none;
}

.adx-center-logo {
  position: relative;
  z-index: 2;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.6));
}

.adx-center-fallback-icon {
  position: absolute;
  z-index: 1;
  color: #ff7700;
  filter: drop-shadow(0 0 10px rgba(255, 106, 0, 0.8));
}

/* ── Typography & Status Badges ───────────────────────────── */
.adx-loader-meta {
  margin-bottom: 24px;
  width: 100%;
}

.adx-loader-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: hsl(26 100% 52% / 0.09);
  border: 1px solid hsl(26 100% 52% / 0.28);
  border-radius: 9999px;
  margin-bottom: 12px;
}

.adx-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
  animation: statusPulse 1.5s infinite;
}

.adx-status-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: hsl(26 100% 64%);
}

.adx-status-pill {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  background: hsl(0 0% 100% / 0.08);
  border-radius: 4px;
  color: hsl(0 0% 80%);
}

.adx-loader-title {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 6px 0;
  background: linear-gradient(135deg, #ffffff 30%, #ffc078 70%, #ff922b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 140, 0, 0.25);
}

.adx-loader-sub {
  font-size: 13px;
  color: hsl(0 0% 65%);
  margin: 0;
  font-weight: 450;
  letter-spacing: 0.01em;
}

/* ── Progress Bar ─────────────────────────────────────────── */
.adx-progress-wrapper {
  width: 100%;
  margin-bottom: 22px;
}

.adx-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  margin-bottom: 8px;
}

.adx-progress-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: hsl(0 0% 75%);
  font-weight: 600;
  letter-spacing: 0.06em;
}

.adx-progress-pct {
  color: hsl(26 100% 60%);
  font-weight: 800;
  letter-spacing: 0.04em;
}

.adx-progress-track {
  position: relative;
  width: 100%;
  height: 8px;
  background: hsl(220 20% 12%);
  border: 1px solid hsl(26 100% 52% / 0.25);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
}

.adx-progress-bar {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #ff4500 0%, #ff8c00 60%, #ffd700 100%);
  border-radius: 5px;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(255, 140, 0, 0.6);
}

.adx-progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 16px;
  background: #ffffff;
  box-shadow: 0 0 10px #ffffff, 0 0 20px #ffaa00;
  opacity: 0.85;
}

.adx-progress-stripes {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 0px,
    rgba(255, 255, 255, 0.15) 6px,
    transparent 6px,
    transparent 12px
  );
  animation: stripeMove 1.2s linear infinite;
}

.adx-progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  color: hsl(0 0% 45%);
}

.adx-progress-footer strong {
  color: hsl(0 0% 75%);
  font-weight: 600;
}

/* ── Cyber Terminal Console Window ────────────────────────── */
.adx-console-box {
  width: 100%;
  background: hsl(220 24% 5% / 0.9);
  border: 1px solid hsl(220 20% 14%);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
  text-align: left;
}

.adx-console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: hsl(220 22% 8%);
  border-bottom: 1px solid hsl(220 20% 12%);
}

.adx-console-dots {
  display: flex;
  gap: 6px;
}
.adx-console-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot--red { background: #ef4444; }
.dot--yellow { background: #eab308; }
.dot--green { background: #22c55e; }

.adx-console-title {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: hsl(0 0% 50%);
  font-weight: 600;
}

.adx-console-live-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 8px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.adx-console-body {
  padding: 10px 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  line-height: 1.6;
  max-height: 130px;
  overflow-y: hidden;
}

.adx-console-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: hsl(0 0% 55%);
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.adx-console-line--active {
  color: hsl(0 0% 90%);
}

.adx-console-time {
  color: hsl(0 0% 38%);
  font-size: 10px;
}

.adx-console-tag {
  color: hsl(26 100% 62%);
  font-weight: 700;
}

.adx-console-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.adx-console-status {
  font-size: 9px;
  font-weight: 800;
  padding: 0 4px;
  border-radius: 2px;
}
.status--ok {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}
.status--busy {
  background: rgba(234, 179, 8, 0.12);
  color: #facc15;
}

.adx-console-cursor-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  color: hsl(26 100% 55%);
  font-weight: 700;
}

.adx-cursor {
  animation: cursorBlink 0.9s infinite step-start;
}

/* ── Keyframe Animations ──────────────────────────────────── */
@keyframes reticleSpinClockwise {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes reticleSpinCounter {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes scanlineSweep {
  0% { top: 0; opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { top: 100%; opacity: 0; }
}

@keyframes haloBreathe {
  0% { transform: scale(0.92); opacity: 0.4; }
  100% { transform: scale(1.15); opacity: 0.8; }
}

@keyframes glowPulse {
  0% { transform: scale(0.9) translate(-50%, -50%); opacity: 0.25; }
  100% { transform: scale(1.1) translate(-50%, -50%); opacity: 0.45; }
}

@keyframes floatEmber {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: 0.9; }
  80% { opacity: 0.7; }
  100% { transform: translateY(-70vh) translateX(30px); opacity: 0; }
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

@keyframes hudDotBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

@keyframes stripeMove {
  from { background-position: 0 0; }
  to { background-position: 24px 0; }
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ── Mobile Responsiveness ────────────────────────────────── */
@media (max-width: 640px) {
  .adx-loader-card {
    padding: 24px 18px;
  }
  .adx-loader-title {
    font-size: 16px;
  }
  .adx-loader-reticle {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
  }
  .adx-reticle-center {
    width: 60px;
    height: 60px;
  }
  .adx-center-logo {
    width: 40px;
    height: 40px;
  }
  .adx-hud-corner {
    display: none;
  }
  .adx-console-box {
    display: none;
  }
}
</style>
