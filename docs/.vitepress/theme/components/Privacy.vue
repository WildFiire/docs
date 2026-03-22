<template>
  <div class="org-page" :class="{ 'light-theme': isLightTheme }">
    <!-- HomeNavbar Component -->
    <HomeNavbar />

    <div class="content-wrapper">
      <!-- Background wallpaper -->
      <img 
        src="/wallpaper/poza102.webp"
        alt=""
        class="wildfire-wallpaper-base"
        width="1920"
        height="1080"
        fetchpriority="high"
        loading="eager"
        decoding="async"
        role="presentation"
      />
      
      <!-- Background overlay -->
      <div class="wildfire-overlay"></div>

      <!-- Background cu licurici (light theme) -->
      <div class="bg-effects" v-if="isLightTheme">
        <div class="bg-orb top-orb"></div>
        <div class="bg-orb bottom-orb"></div>
        <div class="firefly" v-for="n in 25" :key="n" :style="fireflyStyle(n)"></div>
        <div class="bg-grid"></div>
      </div>

      <!-- Dark theme background -->
      <div class="wildfire-bg" v-if="!isLightTheme">
        <div class="wildfire-base"></div>
        <div class="wildfire-ember-left"></div>
        <div class="wildfire-ember-right"></div>
        <div class="wildfire-ember-bottom"></div>
        <div class="wildfire-ember-top"></div>
        <div class="wildfire-energy-line-1"></div>
        <div class="wildfire-energy-line-2"></div>
        <div class="wildfire-energy-line-3"></div>
        <div class="wildfire-particles"></div>
        <div class="wildfire-floating-particles">
          <div class="wildfire-particle wildfire-particle-1"></div>
          <div class="wildfire-particle wildfire-particle-2"></div>
          <div class="wildfire-particle wildfire-particle-3"></div>
          <div class="wildfire-particle wildfire-particle-4"></div>
          <div class="wildfire-particle wildfire-particle-5"></div>
          <div class="wildfire-particle wildfire-particle-6"></div>
          <div class="wildfire-particle wildfire-particle-7"></div>
          <div class="wildfire-particle wildfire-particle-8"></div>
        </div>
        <div class="wildfire-spotlight-tl"></div>
        <div class="wildfire-spotlight-tr"></div>
        <div class="wildfire-spotlight-bl"></div>
        <div class="wildfire-spotlight-br"></div>
      </div>

      <!-- Privacy Page Content -->
      <div class="privacy-page">
        <!-- Back to Home -->
        <a href="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Back to Home</span>
        </a>

        <!-- Page Header -->
        <div class="page-header">
          <div class="header-icon">
            <Icon icon="lucide:shield" width="48" height="48" />
          </div>
          <h1 class="page-title">Privacy Policy</h1>
        </div>
        <div class="page-date-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="date-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <p class="page-date">Last updated: March 22, 2026</p>
        </div>

        <!-- Glass Content Card -->
        <div class="glass-card">
          <!-- Colțuri decorative -->
          <div class="corner-dot-tl"></div>
          <div class="corner-dot-tr"></div>
          <div class="corner-dot-bl"></div>
          <div class="corner-dot-br"></div>

          <!-- Section 1 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">1.</span> Information We Collect</h2>
            <p class="privacy-text">We collect the following types of information:</p>
            <ul class="privacy-list">
              <li><strong>Account Information:</strong> Username, email address, and password (encrypted)</li>
              <li><strong>Profile Data:</strong> Steam ID, game statistics, and playtime</li>
              <li><strong>Usage Data:</strong> Server activity, login times, and IP addresses</li>
              <li><strong>Communication Data:</strong> Support tickets, applications, and chat logs</li>
            </ul>
          </div>

          <!-- Section 2 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">2.</span> How We Use Your Information</h2>
            <p class="privacy-text">Your information is used to:</p>
            <ul class="privacy-list">
              <li>Provide and maintain our gaming services</li>
              <li>Authenticate your identity and manage your account</li>
              <li>Process helper/staff applications</li>
              <li>Enforce our rules and prevent cheating</li>
              <li>Improve our services and user experience</li>
              <li>Communicate important updates and announcements</li>
            </ul>
          </div>

          <!-- Section 3 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">3.</span> Data Storage & Security</h2>
            <p class="privacy-text">
              We implement industry-standard security measures to protect your data. Passwords are encrypted using bcrypt hashing. 
              We use HTTPS encryption for all data transmission. Our servers are located in Romania and comply with applicable 
              data protection regulations.
            </p>
          </div>

          <!-- Section 4 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">4.</span> Data Sharing</h2>
            <p class="privacy-text">We do not sell your personal information. We may share data only in these cases:</p>
            <ul class="privacy-list">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent abuse</li>
              <li>With service providers who assist our operations (under strict agreements)</li>
            </ul>
          </div>

          <!-- Section 5 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">5.</span> Cookies & Tracking</h2>
            <p class="privacy-text">
              We use essential cookies to maintain your login session and remember your preferences. We do not use third-party 
              tracking or advertising cookies. You can manage cookie settings in your browser.
            </p>
          </div>

          <!-- Section 6 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">6.</span> Your Rights</h2>
            <p class="privacy-text">You have the right to:</p>
            <ul class="privacy-list">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p class="privacy-text privacy-note">
              To exercise these rights, contact us through our Discord server or email.
            </p>
          </div>

          <!-- Section 7 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">7.</span> Data Retention</h2>
            <p class="privacy-text">
              We retain your account data as long as your account is active. Game statistics and logs may be kept for up to 
              2 years for anti-cheat and moderation purposes. You can request account deletion at any time.
            </p>
          </div>

          <!-- Section 8 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">8.</span> Children's Privacy</h2>
            <p class="privacy-text">
              Our services are not intended for children under 13. We do not knowingly collect information from children under 13. 
              If you believe we have collected such information, please contact us immediately.
            </p>
          </div>

          <!-- Section 9 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">9.</span> Changes to This Policy</h2>
            <p class="privacy-text">
              We may update this Privacy Policy periodically. We will notify users of significant changes through our Discord 
              server or email. Continued use of our services after changes constitutes acceptance.
            </p>
          </div>

          <!-- Section 10 -->
          <div class="privacy-section">
            <h2 class="privacy-heading"><span class="privacy-num">10.</span> Contact Us</h2>
            <p class="privacy-text">
              For privacy-related questions or requests, contact us through our 
              <a href="https://discord.gg/Knu76DhE9h" target="_blank" rel="noopener" class="inline-link">Discord server</a> 
              or email us at <a href="mailto:privacy@wildfire.ro" class="inline-link">privacy@wildfire.ro</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'
import HomeNavbar from './HomeNavbar.vue'

const { isDark: themeFromVitePress } = useData()
const isDark = ref(true)

// Sincronizează cu tema din VitePress
onMounted(() => {
  // Inițializează
  if (themeFromVitePress.value !== undefined) {
    isDark.value = themeFromVitePress.value
  } else {
    // Fallback: verifică clasa de pe html
    isDark.value = document.documentElement.classList.contains('dark')
  }
  
  // Ascultă schimbările clasei de pe html
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  
  // Cleanup
  onUnmounted(() => observer.disconnect())
})

// Watch pentru schimbări din VitePress
watch(themeFromVitePress, (newVal) => {
  if (newVal !== undefined) isDark.value = newVal
})

const isLightTheme = computed(() => !isDark.value)

// Firefly styles (light theme only)
function fireflyStyle(n) {
  const size = 2 + Math.random() * 4
  const duration = 8 + Math.random() * 15
  const delay = Math.random() * 5
  const left = Math.random() * 100
  const top = Math.random() * 100
  
  return {
    width: size + 'px',
    height: size + 'px',
    left: left + '%',
    top: top + '%',
    '--duration': duration + 's',
    '--delay': delay + 's',
    '--x1': (Math.random() * 100 - 50) + 'px',
    '--y1': (Math.random() * 100 - 50) + 'px',
    '--x2': (Math.random() * 100 - 50) + 'px',
    '--y2': (Math.random() * 100 - 50) + 'px',
    '--x3': (Math.random() * 100 - 50) + 'px',
    '--y3': (Math.random() * 100 - 50) + 'px',
    opacity: 0.3 + Math.random() * 0.4
  }
}
</script>

<style scoped>
/* ========== PAGE ROOT ========== */
.org-page {
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #ffffff;
  transition: all 0.3s ease;
}

:deep(.home-navbar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.content-wrapper {
  position: relative;
  min-height: 100vh;
  padding-top: 120px;
  padding-bottom: 80px;
}

/* ========== BACKGROUND ========== */
.wildfire-wallpaper-base {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -5;
  object-fit: cover;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
  opacity: 0.2;
}

.wildfire-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -4;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.light-theme .wildfire-overlay {
  background: rgba(255, 255, 255, 0.3);
}

.bg-effects,
.wildfire-bg {
  z-index: -3;
  position: fixed;
  inset: 0;
  pointer-events: none;
}

/* ========== LIGHT THEME BG ========== */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: orbFloat 20s ease-in-out infinite;
}

.top-orb {
  width: 500px; height: 500px;
  top: -150px; right: -150px;
  background: radial-gradient(circle, #ff4500 0%, #ff8c00 50%, transparent 80%);
}

.bottom-orb {
  width: 600px; height: 600px;
  bottom: -200px; left: -150px;
  background: radial-gradient(circle, #ff8c00 0%, #ff4500 50%, transparent 80%);
  animation-delay: -5s;
}

.bg-grid {
  position: absolute; inset: 0;
  background-image: 
    linear-gradient(rgba(255, 69, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 69, 0, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

.firefly {
  position: absolute;
  border-radius: 50%;
  background: #ffaa33;
  filter: blur(2px);
  box-shadow: 0 0 15px rgba(255, 170, 51, 0.6);
  animation: fireflyFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  pointer-events: none;
  z-index: 1;
}

@keyframes fireflyFloat {
  0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  25% { transform: translate(var(--x1), var(--y1)) scale(1.2); opacity: 0.8; }
  50% { transform: translate(var(--x2), var(--y2)) scale(1); opacity: 0.5; }
  75% { transform: translate(var(--x3), var(--y3)) scale(1.3); opacity: 0.9; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 30px) scale(0.95); }
}

/* ========== DARK THEME BG ========== */
.wildfire-base {
  position: absolute; inset: 0;
  background: linear-gradient(145deg, rgba(3,3,3,0.7) 0%, rgba(10,7,5,0.6) 30%, rgba(3,3,3,0.7) 70%);
  opacity: 0.95;
}

.wildfire-ember-left {
  position: absolute; bottom: 15%; left: 5%;
  width: 300px; height: 300px;
  background: radial-gradient(circle at 30% 70%, rgba(255,68,0,0.08) 0%, transparent 70%);
  border-radius: 50%; filter: blur(50px); opacity: 0.5;
  animation: emberGlow 12s ease-in-out infinite;
}

.wildfire-ember-right {
  position: absolute; top: 20%; right: 5%;
  width: 350px; height: 350px;
  background: radial-gradient(circle at 70% 30%, rgba(255,85,0,0.07) 0%, transparent 70%);
  border-radius: 50%; filter: blur(60px); opacity: 0.45;
  animation: emberGlowReverse 14s ease-in-out infinite;
}

.wildfire-ember-bottom {
  position: absolute; bottom: 5%; right: 15%;
  width: 250px; height: 250px;
  background: radial-gradient(circle at 40% 60%, rgba(200,60,0,0.06) 0%, transparent 70%);
  border-radius: 50%; filter: blur(45px); opacity: 0.4;
  animation: emberFloat 16s ease-in-out infinite;
}

.wildfire-ember-top {
  position: absolute; top: 10%; left: 15%;
  width: 280px; height: 280px;
  background: radial-gradient(circle at 60% 40%, rgba(220,70,0,0.06) 0%, transparent 70%);
  border-radius: 50%; filter: blur(55px); opacity: 0.4;
  animation: emberFloatReverse 15s ease-in-out infinite;
}

.wildfire-energy-line-1 {
  position: absolute; top: 30%; left: 0; width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,68,0,0.1) 20%, rgba(255,68,0,0.2) 50%, rgba(255,68,0,0.1) 80%, transparent 100%);
  transform: rotate(-3deg) scale(1.2); opacity: 0.3;
  animation: energyPulse 8s ease-in-out infinite;
}

.wildfire-energy-line-2 {
  position: absolute; bottom: 40%; left: 0; width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,85,0,0.08) 15%, rgba(255,68,0,0.15) 50%, rgba(255,85,0,0.08) 85%, transparent 100%);
  transform: rotate(2deg) scale(1.1); opacity: 0.25;
  animation: energyPulseReverse 10s ease-in-out infinite;
}

.wildfire-energy-line-3 {
  position: absolute; top: 60%; left: 0; width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(200,60,0,0.06) 25%, rgba(220,70,0,0.12) 50%, rgba(200,60,0,0.06) 75%, transparent 100%);
  transform: rotate(-1deg) scale(1.15); opacity: 0.2;
  animation: energyPulse 12s ease-in-out infinite;
}

.wildfire-particles {
  position: absolute; inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255,68,0,0.02) 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(255,85,0,0.02) 1px, transparent 1px),
    radial-gradient(circle at 45% 20%, rgba(200,60,0,0.01) 1px, transparent 1px),
    radial-gradient(circle at 65% 85%, rgba(220,70,0,0.01) 1px, transparent 1px);
  background-size: 200px 200px, 180px 180px, 150px 150px, 220px 220px;
  opacity: 0.4;
  animation: particlesMove 60s linear infinite;
}

.wildfire-spotlight-tl {
  position: absolute; top: 0; left: 0;
  width: 450px; height: 450px;
  background: radial-gradient(circle at 20% 20%, rgba(255,69,0,0.18) 0%, transparent 70%);
  border-radius: 50%; filter: blur(80px); opacity: 0.3;
  animation: spotlightPulse 12s ease-in-out infinite; z-index: 1;
}

.wildfire-spotlight-tr {
  position: absolute; top: 0; right: 0;
  width: 500px; height: 500px;
  background: radial-gradient(circle at 80% 20%, rgba(255,85,0,0.15) 0%, transparent 70%);
  border-radius: 50%; filter: blur(90px); opacity: 0.28;
  animation: spotlightPulse 14s ease-in-out infinite; z-index: 1;
}

.wildfire-spotlight-bl {
  position: absolute; bottom: 0; left: 0;
  width: 400px; height: 400px;
  background: radial-gradient(circle at 20% 80%, rgba(255,100,0,0.12) 0%, transparent 70%);
  border-radius: 50%; filter: blur(70px); opacity: 0.25;
  animation: spotlightPulse 10s ease-in-out infinite; z-index: 1;
}

.wildfire-spotlight-br {
  position: absolute; bottom: 0; right: 0;
  width: 420px; height: 420px;
  background: radial-gradient(circle at 80% 80%, rgba(255,68,0,0.14) 0%, transparent 70%);
  border-radius: 50%; filter: blur(75px); opacity: 0.26;
  animation: spotlightPulse 16s ease-in-out infinite; z-index: 1;
}

.wildfire-floating-particles {
  position: absolute; inset: 0;
  overflow: hidden; pointer-events: none; z-index: 2;
}

.wildfire-particle {
  position: absolute;
  width: 4px; height: 4px;
  background: rgba(255,69,0,0.6);
  border-radius: 50%;
  filter: blur(1px);
  box-shadow: 0 0 10px rgba(255,69,0,0.4);
}

.wildfire-particle-1 { top: 20%; left: 10%; width: 6px; height: 6px; background: rgba(255,85,0,0.7); animation: moveHorizontal 15s ease-in-out infinite; }
.wildfire-particle-2 { top: 70%; right: 15%; width: 5px; height: 5px; background: rgba(255,100,0,0.7); animation: moveVertical 12s ease-in-out infinite; }
.wildfire-particle-3 { top: 40%; left: 60%; width: 7px; height: 7px; background: rgba(255,69,0,0.8); animation: moveDiagonal 18s ease-in-out infinite; }
.wildfire-particle-4 { bottom: 25%; left: 30%; width: 4px; height: 4px; background: rgba(255,140,0,0.6); animation: moveCircle 20s linear infinite; }
.wildfire-particle-5 { top: 15%; right: 40%; width: 5px; height: 5px; background: rgba(255,68,0,0.7); animation: moveZigZag 14s ease-in-out infinite; }
.wildfire-particle-6 { bottom: 40%; left: 70%; width: 6px; height: 6px; background: rgba(255,85,0,0.6); animation: moveWave 16s ease-in-out infinite; }
.wildfire-particle-7 { top: 80%; left: 10%; width: 4px; height: 4px; background: rgba(255,69,0,0.7); animation: moveBounce 10s ease-in-out infinite; }
.wildfire-particle-8 { top: 30%; right: 20%; width: 5px; height: 5px; background: rgba(255,100,0,0.7); animation: moveSpiral 22s linear infinite; }

@keyframes emberGlow { 0%, 100% { opacity: 0.5; transform: translate(0,0) scale(1); } 50% { opacity: 0.7; transform: translate(10px,-10px) scale(1.05); } }
@keyframes emberGlowReverse { 0%, 100% { opacity: 0.45; transform: translate(0,0) scale(1); } 50% { opacity: 0.65; transform: translate(-10px,10px) scale(1.05); } }
@keyframes emberFloat { 0%, 100% { opacity: 0.4; transform: translate(0,0); } 33% { opacity: 0.5; transform: translate(-15px,-5px); } 66% { opacity: 0.45; transform: translate(5px,-10px); } }
@keyframes emberFloatReverse { 0%, 100% { opacity: 0.4; transform: translate(0,0); } 33% { opacity: 0.5; transform: translate(15px,5px); } 66% { opacity: 0.45; transform: translate(-5px,10px); } }
@keyframes energyPulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
@keyframes energyPulseReverse { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.3; } }
@keyframes particlesMove { 0% { background-position: 0 0, 0 0, 0 0, 0 0; } 100% { background-position: 200px 200px, 180px 180px, 150px 150px, 220px 220px; } }
@keyframes spotlightPulse { 0%, 100% { opacity: 0.25; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.08); } }
@keyframes moveHorizontal { 0%,100% { transform: translateX(0) translateY(0); opacity: 0.4; } 25% { transform: translateX(150px) translateY(-30px); opacity: 0.8; } 50% { transform: translateX(300px) translateY(20px); opacity: 0.5; } 75% { transform: translateX(150px) translateY(50px); opacity: 0.7; } }
@keyframes moveVertical { 0%,100% { transform: translateY(0) translateX(0); opacity: 0.4; } 33% { transform: translateY(-120px) translateX(40px); opacity: 0.8; } 66% { transform: translateY(100px) translateX(-30px); opacity: 0.6; } }
@keyframes moveDiagonal { 0%,100% { transform: translate(0,0); opacity: 0.5; } 25% { transform: translate(200px,-100px); opacity: 0.9; } 50% { transform: translate(350px,50px); opacity: 0.6; } 75% { transform: translate(150px,150px); opacity: 0.8; } }
@keyframes moveCircle { 0% { transform: rotate(0deg) translate(80px) rotate(0deg); opacity: 0.5; } 50% { transform: rotate(180deg) translate(80px) rotate(-180deg); opacity: 0.5; } 100% { transform: rotate(360deg) translate(80px) rotate(-360deg); opacity: 0.5; } }
@keyframes moveZigZag { 0%,100% { transform: translate(0,0); opacity: 0.5; } 20% { transform: translate(100px,-50px); opacity: 0.8; } 40% { transform: translate(200px,30px); opacity: 0.6; } 60% { transform: translate(280px,-40px); opacity: 0.9; } 80% { transform: translate(150px,60px); opacity: 0.7; } }
@keyframes moveWave { 0%,100% { transform: translate(0,0); opacity: 0.4; } 25% { transform: translate(120px,-60px); opacity: 0.7; } 50% { transform: translate(240px,0); opacity: 0.5; } 75% { transform: translate(120px,60px); opacity: 0.8; } }
@keyframes moveBounce { 0%,100% { transform: translateY(0) translateX(0); opacity: 0.5; } 25% { transform: translateY(-150px) translateX(50px); opacity: 0.9; } 50% { transform: translateY(0) translateX(120px); opacity: 0.6; } 75% { transform: translateY(-80px) translateX(200px); opacity: 0.8; } }
@keyframes moveSpiral { 0% { transform: rotate(0deg) translate(50px) rotate(0deg); opacity: 0.5; } 33% { transform: rotate(120deg) translate(90px) rotate(-120deg); opacity: 0.8; } 66% { transform: rotate(240deg) translate(130px) rotate(-240deg); opacity: 0.6; } 100% { transform: rotate(360deg) translate(50px) rotate(-360deg); opacity: 0.5; } }

/* ============================================================
   PRIVACY PAGE CONTENT
   ============================================================ */
.privacy-page {
  position: relative;
  z-index: 2;
  max-width: 820px;
  margin: 0 auto;
  padding: 0 28px 60px;
}

/* ===== BACK LINK ===== */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 40px;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.6);
}

.back-link:hover {
  color: #ff8c00;
  transform: translateX(-3px);
}

.back-link svg {
  width: 14px;
  height: 14px;
}

.light-theme .back-link {
  color: rgba(0, 0, 0, 0.5);
}

.light-theme .back-link:hover {
  color: #ff8c00;
}

/* ===== PAGE HEADER ===== */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.header-icon {
  color: #ff8c00;
  display: flex;
  align-items: center;
}

.page-title {
  font-family: 'Orbitron', sans-serif !important;
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.02em;
}

.light-theme .page-title {
  color: #111111;
}

.page-date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 32px;
  color: rgba(255, 255, 255, 0.45);
}

.date-icon {
  opacity: 0.8;
}

.page-date {
  font-size: 13px;
  color: inherit;
  margin: 0;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.3px;
}

.light-theme .page-date-row {
  color: rgba(0, 0, 0, 0.4);
}

/* ===== GLASS CARD — LIQUID GLASS ===== */
.glass-card {
  background: linear-gradient(165deg, rgba(255,255,255,0.03) 0%, rgba(15,15,20,0.15) 15%, rgba(10,10,14,0.2) 100%);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 40px 44px;
  box-shadow:
    0 4px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;
}

/* Top highlight shine */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  pointer-events: none;
}

.light-theme .glass-card {
  background: linear-gradient(165deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.25) 100%);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 4px 40px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.light-theme .glass-card::before {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
}

/* ===== SECTIONS ===== */
.privacy-section {
  padding-bottom: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.privacy-section:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.light-theme .privacy-section {
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.privacy-heading {
  font-family: 'Orbitron', sans-serif !important;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ff8c00;
  margin: 0 0 12px;
  letter-spacing: 0.02em;
}

.privacy-num {
  color: #ff8c00;
  font-weight: 700;
}

.privacy-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 12px;
}

.privacy-text:last-child {
  margin-bottom: 0;
}

.privacy-note {
  margin-top: 8px;
  font-style: italic;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.light-theme .privacy-text {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .privacy-note {
  color: rgba(0, 0, 0, 0.55);
}

/* ===== LIST ===== */
.privacy-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.privacy-list li {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  padding-left: 20px;
  position: relative;
}

.privacy-list li::before {
  content: '•';
  position: absolute;
  left: 4px;
  top: 0;
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.1em;
}

.privacy-list li strong {
  color: #ff8c00;
  font-weight: 600;
}

.light-theme .privacy-list li {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .privacy-list li::before {
  color: rgba(0, 0, 0, 0.3);
}

.light-theme .privacy-list li strong {
  color: #ff8c00;
}

/* ===== INLINE LINK ===== */
.inline-link {
  color: #ff8c00;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 140, 0, 0.3);
  transition: all 0.15s ease;
}

.inline-link:hover {
  color: #ff4500;
  border-bottom-color: #ff4500;
}

.light-theme .inline-link {
  color: #ff8c00;
  border-bottom-color: rgba(255, 140, 0, 0.3);
}

.light-theme .inline-link:hover {
  color: #ff4500;
  border-bottom-color: #ff4500;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .privacy-page {
    padding: 0 20px 40px;
  }

  .glass-card {
    padding: 28px 24px;
    border-radius: 18px;
  }

  .page-title {
    font-size: 1.7rem;
  }

  .privacy-heading {
    font-size: 1.05rem;
  }

  .content-wrapper {
    padding-top: 100px;
  }
}

@media (max-width: 480px) {
  .privacy-page {
    padding: 0 16px 32px;
  }

  .glass-card {
    padding: 24px 20px;
    border-radius: 14px;
  }

  .page-title {
    font-size: 1.4rem;
  }

  .page-header {
    gap: 10px;
  }

  .header-icon svg {
    width: 22px;
    height: 22px;
  }
}

/* ===== PREVENT SELECTION ===== */
.org-page,
.org-page * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

/* ===== COLȚURI SUBTILE - DOAR LINIE ===== */
.corner-dot-tl,
.corner-dot-tr,
.corner-dot-bl,
.corner-dot-br {
  position: absolute;
  width: 40px;
  height: 40px;
  pointer-events: none;
  z-index: 2;
}

.corner-dot-tl {
  top: 0;
  left: 0;
  border-top: 2px solid #ff8c00;
  border-left: 2px solid #ff8c00;
  border-top-left-radius: 24px;
}

.corner-dot-tr {
  top: 0;
  right: 0;
  border-top: 2px solid #ff8c00;
  border-right: 2px solid #ff8c00;
  border-top-right-radius: 24px;
}

.corner-dot-bl {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid #ff8c00;
  border-left: 2px solid #ff8c00;
  border-bottom-left-radius: 24px;
}

.corner-dot-br {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid #ff8c00;
  border-right: 2px solid #ff8c00;
  border-bottom-right-radius: 24px;
}

.light-theme .corner-dot-tl,
.light-theme .corner-dot-tr,
.light-theme .corner-dot-bl,
.light-theme .corner-dot-br {
  border-color: #ff8c00;
}

/* Responsive */
@media (max-width: 768px) {
  .corner-dot-tl,
  .corner-dot-tr,
  .corner-dot-bl,
  .corner-dot-br {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .corner-dot-tl,
  .corner-dot-tr,
  .corner-dot-bl,
  .corner-dot-br {
    width: 28px;
    height: 28px;
  }
}

</style>