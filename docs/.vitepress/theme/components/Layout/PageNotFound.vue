<!-- .vitepress/theme/components/PageNotFound.vue -->
<template>
  <div class="cs2-insane-404" @click="fireShot">
    
    <!-- Background Map/Radar Texture -->
    <div class="c4-bg">
      <div class="radar-grid"></div>
      <div class="vignette"></div>
    </div>

    <!-- Heavy CRT Noise & Scanlines -->
    <div class="noise-overlay"></div>
    <div class="scanlines"></div>

    <!-- Fake CS2 Developer Console -->
    <div class="cs2-console animate-console-in">
      <div v-for="(log, i) in visibleLogs" :key="i" class="log-line" :class="log.type">
        <span class="log-time">{{ log.time }}</span> {{ log.text }}
      </div>
    </div>

    <!-- Center Content -->
    <div class="insane-content" :class="{ 'screen-shake': isShaking }">
      
      <!-- Glitching Title -->
      <div class="glitch-wrapper animate-in">
        <h1 class="glitch-text orbitron-font" data-text="404">404</h1>
        <div class="glitch-text-clone clone-1 orbitron-font">404</div>
        <div class="glitch-text-clone clone-2 orbitron-font">404</div>
      </div>

      <div class="warning-banner orbitron-font animate-in-delayed">
        <span class="banner-icon">⚠</span>
        CONNECTION TO MATCHMAKING SERVERS FAILED
        <span class="banner-icon">⚠</span>
      </div>

      <p class="intel-text animate-in-stagger-1">
        > Map cycle interrupted.<br/>
        > The sector you are trying to reach has been completely wiped.
      </p>

      <!-- Return Action -->
      <a href="/" class="btn-respawn orbitron-font animate-in-stagger-2" @click.stop>
        RESPAWN AT BASE
      </a>

      <!-- CS2 Buy Menu Grid Navigation -->
      <div class="cs2-buy-grid">
        <a href="/informatii/about" class="cs2-grid-slot animate-in-slot-1" @click.stop>
          <div class="slot-left">
            <span class="slot-key">1</span>
          </div>
          <div class="slot-center">
            <Icon icon="mdi:information-variant" class="slot-icon" width="24" height="24" />
            <span class="slot-name">INTEL</span>
          </div>
          <div class="slot-price">$400</div>
        </a>

        <button class="cs2-grid-slot active-slot animate-in-slot-2" @click.stop="openSearch">
          <div class="slot-left">
            <span class="slot-key">2</span>
          </div>
          <div class="slot-center">
            <Icon icon="mdi:radar" class="slot-icon" width="24" height="24" />
            <span class="slot-name">RADAR</span>
          </div>
          <div class="slot-price">$1200</div>
        </button>

        <a href="https://discord.gg/wildfire" target="_blank" class="cs2-grid-slot animate-in-slot-3" @click.stop>
          <div class="slot-left">
            <span class="slot-key">3</span>
          </div>
          <div class="slot-center">
            <Icon icon="ic:baseline-discord" class="slot-icon" width="24" height="24" />
            <span class="slot-name">COMMS</span>
          </div>
          <div class="slot-price">$200</div>
        </a>
      </div>
    </div>

    <!-- Bullet Holes Container -->
    <div 
      v-for="shot in shots" 
      :key="shot.id" 
      class="bullet-hole"
      :style="{ left: shot.x + 'px', top: shot.y + 'px', transform: 'rotate(' + shot.rotation + 'deg)' }"
    ></div>

    <!-- Custom Crosshair -->
    <div class="crosshair" :style="{ left: mouseX + 'px', top: mouseY + 'px' }">
      <div class="ch-top"></div><div class="ch-bottom"></div><div class="ch-left"></div><div class="ch-right"></div><div class="ch-center"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { searchState } from '../../store'
import { Icon } from '@iconify/vue'

const openSearch = () => { searchState.open() }

// --- Fake Console Logic ---
const logs = [
  { text: 'Connecting to public(192.168.1.104:27015) ...', type: 'info' },
  { text: 'Server using \'public\' lobbies, requiring pw no, lobby id ffffffffffffffff', type: 'info' },
  { text: 'Retrying connection to server...', type: 'warning' },
  { text: 'CS2: Missing map maps/de_wildfire_404.vpk, disconnecting', type: 'error' },
  { text: 'Disconnect: Kicked by Console : "Map missing".', type: 'error' },
  { text: 'ChangeGameUIState: CSGO_GAME_UI_STATE_INGAME -> CSGO_GAME_UI_STATE_MAINMENU', type: 'info' },
  { text: 'Resource materials/panorama/images/map_icons/map_icon_de_wildfire.vtex failed to load.', type: 'error' },
  { text: 'Attempting to reconnect (1/3)...', type: 'warning' },
  { text: 'Failed to find dedicated server.', type: 'error' },
  { text: 'FATAL: Sector wiped. Intel compromised.', type: 'error' },
]

const visibleLogs = ref<{time: string, text: string, type: string}[]>([])
let logIndex = 0
let consoleInterval: any = null

const getTimestamp = () => {
  const d = new Date()
  return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}:${d.getMilliseconds().toString().padStart(3, '0')}]`
}

const pushLog = () => {
  if (logIndex < logs.length) {
    visibleLogs.value.push({ time: getTimestamp(), ...logs[logIndex] })
    if (visibleLogs.value.length > 8) visibleLogs.value.shift()
    logIndex++
    const delay = Math.random() * 400 + 100
    consoleInterval = setTimeout(pushLog, delay)
  } else {
    // Loop error
    consoleInterval = setTimeout(() => {
      visibleLogs.value.push({ time: getTimestamp(), text: 'Connection failed. Retrying in background...', type: 'error' })
      if (visibleLogs.value.length > 8) visibleLogs.value.shift()
      pushLogLoop()
    }, 2000)
  }
}

const pushLogLoop = () => {
  consoleInterval = setTimeout(() => {
    visibleLogs.value.push({ time: getTimestamp(), text: 'ERROR: Map 404 not found on server.', type: 'error' })
    if (visibleLogs.value.length > 8) visibleLogs.value.shift()
    pushLogLoop()
  }, Math.random() * 3000 + 1000)
}

// --- Shooting Mechanic & Crosshair ---
const mouseX = ref(-100)
const mouseY = ref(-100)
const isShaking = ref(false)

const shots = ref<{id: number, x: number, y: number, rotation: number}[]>([])
let shotId = 0

const updateMouse = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const fireShot = (e: MouseEvent) => {
  // Add bullet hole
  shots.value.push({
    id: shotId++,
    x: e.clientX,
    y: e.clientY,
    rotation: Math.random() * 360
  })
  
  // Keep max 15 holes
  if (shots.value.length > 15) shots.value.shift()

  // Screen shake (Recoil)
  isShaking.value = true
  setTimeout(() => { isShaking.value = false }, 100)
}

onMounted(() => {
  pushLog()
  window.addEventListener('mousemove', updateMouse)
})

onBeforeUnmount(() => {
  if (consoleInterval) clearTimeout(consoleInterval)
  window.removeEventListener('mousemove', updateMouse)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800;900&family=Share+Tech+Mono&display=swap');

.orbitron-font { font-family: 'Orbitron', sans-serif !important; }

/* ── Entrance Animations ── */
.animate-in {
  animation: glitch-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-in-delayed {
  animation: slide-up-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.animate-in-stagger-1 {
  animation: slide-up-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

.animate-in-stagger-2 {
  animation: slide-up-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.animate-in-slot-1 { animation: slot-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both; }
.animate-in-slot-2 { animation: slot-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both; }
.animate-in-slot-3 { animation: slot-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both; }

.animate-console-in {
  animation: console-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes glitch-in {
  from { opacity: 0; transform: scale(1.1); filter: blur(10px); }
  to { opacity: 1; transform: scale(1); filter: blur(0); }
}

@keyframes slide-up-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slot-in {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes console-slide-in {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 0.8; transform: translateX(0); }
}

/* ── Container ── */
.cs2-insane-404 {
  min-height: 100vh;
  background: #020202;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none; /* Hide default cursor */
  user-select: none;
}

/* ── Background Grid ── */
.c4-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(circle at center, #0f0500 0%, #000 80%);
}

.radar-grid {
  position: absolute;
  inset: -50%;
  background-image: 
    linear-gradient(rgba(255, 120, 0, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 120, 0, 0.15) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center;
  transform: perspective(500px) rotateX(60deg) scale(2);
  animation: radarScan 10s linear infinite;
  opacity: 1;
}

@keyframes radarScan {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0) scale(2); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(40px) scale(2); }
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, #000 90%);
}

/* ── CRT & Noise ── */
.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
  opacity: 0.05;
  z-index: 2;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
  background-size: 100% 4px;
  z-index: 3;
  pointer-events: none;
  animation: scan 10s linear infinite;
  opacity: 0.4;
}
@keyframes scan { 0% { background-position: 0 0; } 100% { background-position: 0 100vh; } }

/* ── Fake Console ── */
.cs2-console {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 400px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  z-index: 5;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0.8;
  text-shadow: 0 0 2px rgba(0,0,0,0.8);
}
.log-line { line-height: 1.3; }
.log-time { color: #555; }
.log-line.info { color: #ccc; }
.log-line.warning { color: #facc15; }
.log-line.error { color: #ff3300; font-weight: bold; }

/* ── Center Content ── */
.insane-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
}
.screen-shake {
  animation: shake 0.1s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(3px, -3px) rotate(1deg); }
  50% { transform: translate(-3px, 3px) rotate(-1deg); }
  75% { transform: translate(3px, 3px) rotate(0deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* ── Glitch Text ── */
.glitch-wrapper {
  position: relative;
  margin-bottom: -10px;
}
.glitch-text {
  font-size: clamp(80px, 15vw, 180px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 10px;
  position: relative;
  white-space: nowrap;
}
.glitch-text-clone {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  font-size: clamp(80px, 15vw, 180px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 10px;
  opacity: 0.8;
  white-space: nowrap;
}
.clone-1 {
  color: #0ff;
  z-index: -1;
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}
.clone-2 {
  color: #f0f;
  z-index: -2;
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
  20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
  40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
  80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
  100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
}
@keyframes glitch-anim-2 {
  0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
  20% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 1px); }
  40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -2px); }
  60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
  80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, -1px); }
  100% { clip-path: inset(5% 0 80% 0); transform: translate(-1px, 1px); }
}

/* ── Banner & Intel ── */
.warning-banner {
  background: #ff3300;
  color: #000;
  font-weight: 900;
  padding: 8px 30px;
  font-size: 18px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 10px rgba(255, 51, 0, 0.15);
  transform: skewX(-10deg);
}
.warning-banner .banner-icon { font-size: 20px; animation: flash 1s infinite; }
@keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.intel-text {
  font-family: 'Share Tech Mono', monospace;
  color: #a1a1aa;
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  border-left: 2px solid #ff3300;
  padding-left: 15px;
  margin: 10px 0 20px;
}

/* ── Respawn Button ── */
.btn-respawn {
  position: relative;
  background: rgba(255, 120, 0, 0.1);
  color: #fff;
  border: 2px solid #ff7800;
  padding: 15px 50px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 4px;
  text-decoration: none;
  text-transform: uppercase;
  cursor: none;
  overflow: hidden;
  transition: all 0.3s;
  text-align: center;
  white-space: nowrap;
}
.btn-respawn:hover {
  background: #ff7800;
  color: #000;
  transform: scale(1.05);
}
.btn-respawn:active { transform: scale(0.95); }

/* ── CS2 Buy Menu Grid ── */
.cs2-buy-grid {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  width: 100%;
  max-width: 800px;
  justify-content: center;
}

.cs2-grid-slot {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 220px;
  height: 60px;
  background: rgba(30, 30, 35, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  text-decoration: none;
  color: #a1a1aa;
  transition: all 0.15s ease-out;
  cursor: none;
  outline: none;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
}

.cs2-grid-slot::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 4px;
  background: transparent;
  transition: background 0.2s;
}

.cs2-grid-slot:hover, .cs2-grid-slot.active-slot {
  background: linear-gradient(90deg, rgba(255, 120, 0, 0.15), rgba(30, 30, 35, 0.8));
  border-color: rgba(255, 120, 0, 0.4);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.cs2-grid-slot:hover::before, .cs2-grid-slot.active-slot::before {
  background: #ff7800;
}

.slot-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.slot-key {
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  font-weight: bold;
  color: #71717a;
}
.cs2-grid-slot:hover .slot-key, .cs2-grid-slot.active-slot .slot-key {
  color: #fff;
}

.slot-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 12px;
  flex: 1;
}

.slot-icon {
  margin-bottom: -2px;
  opacity: 0.8;
}

.slot-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.slot-price {
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  font-weight: bold;
  color: #10b981;
}

/* ── Bullet Holes ── */
.bullet-hole {
  position: fixed;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #000 20%, rgba(0,0,0,0.8) 40%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 100;
  transform: translate(-50%, -50%);
  opacity: 0.8;
}

/* ── Crosshair ── */
.crosshair {
  position: fixed;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}
.ch-top, .ch-bottom, .ch-left, .ch-right {
  position: absolute;
  background: #0f0;
}
.ch-top { top: 0; left: 11px; width: 2px; height: 8px; }
.ch-bottom { bottom: 0; left: 11px; width: 2px; height: 8px; }
.ch-left { top: 11px; left: 0; width: 8px; height: 2px; }
.ch-right { top: 11px; right: 0; width: 8px; height: 2px; }
.ch-center {
  position: absolute;
  top: 11px; left: 11px; width: 2px; height: 2px;
  background: #0f0;
}

/* Responsive */
@media (max-width: 768px) {
  .cs2-insane-404 { padding: 15px; cursor: auto; }
  .glitch-text, .glitch-text-clone { font-size: clamp(50px, 15vw, 80px); letter-spacing: 4px; }
  
  .warning-banner { 
    font-size: 11px; 
    padding: 8px 10px; 
    letter-spacing: 1px;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    transform: skewX(0deg);
  }
  
  .intel-text { 
    font-size: 12px; 
    margin: 5px 0 15px; 
    border-left: none; 
    padding-left: 0; 
    text-align: center; 
  }
  
  .btn-respawn { 
    font-size: 15px; 
    padding: 12px 24px; 
    width: 100%;
    max-width: 280px;
  }
  
  .cs2-console { display: none; }
  
  .cs2-buy-grid { 
    flex-direction: column; 
    gap: 8px; 
    align-items: center; 
    margin-top: 15px;
  }
  .cs2-grid-slot { 
    width: 100%; 
    max-width: 280px; 
    height: 50px; 
  }
  .slot-name { font-size: 10px; }
  .slot-price { font-size: 12px; }
  
  .crosshair { display: none; }
}
</style>
