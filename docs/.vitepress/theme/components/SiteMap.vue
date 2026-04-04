<template>
  <div v-if="isHomePage" class="footer">
    <!-- WILDFIRE Watermark - centered behind content -->
    <div class="watermark-layer">
      <div class="watermark-inner">
        <span class="watermark-text orbitron-font">WILDFIRE</span>
      </div>
    </div>

    <!-- Top accent line -->
    <div class="footer-accent-line"></div>

    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-grid">
          <!-- Column 1: Brand -->
          <div class="footer-col brand-col">
            <div class="brand">
              <img src="/icons/wildfire.webp" alt="Wildfire.ro" class="brand-logo">
              <div class="brand-info">
                <h3 class="brand-name orbitron-font">WildFire</h3>
                <p class="brand-tagline orbitron-font">LET THE WORLD BURN</p>
              </div>
            </div>

            <p class="brand-text">
              Romania's premier CS2 gaming community.
              Competitive play, active events, and a welcoming
              atmosphere since 2021.
            </p>

            <!-- Social Links -->
            <div class="social-links">
              <a :href="socialLinks.discord" class="social-link" aria-label="Discord" target="_blank" rel="noopener">
                <img src="/icons/discord.svg" alt="Discord" class="social-icon">
              </a>
              <a :href="socialLinks.steam" class="social-link" aria-label="Steam" target="_blank" rel="noopener">
                <img src="/icons/steam.svg" alt="Steam" class="social-icon">
              </a>
            </div>
          </div>

          <!-- Column 2: Navigate -->
          <div class="footer-col">
            <h4 class="col-title orbitron-font">NAVIGATE</h4>
            <ul class="col-list">
              <li><a href="/" class="col-link">Acasa</a></li>
              <li><a href="/informatii/about" class="col-link">Despre</a></li>
              <li><a href="/informatii/regulamente/go/regulament-go" class="col-link">Regulament</a></li>
              <li><a href="/informatii/faq" class="col-link">FAQ</a></li>
              <li><a href="/updates_wiki/updateswiki" class="col-link">Updates Wiki</a></li>
            </ul>
          </div>

          <!-- Column 3: Connect -->
          <div class="footer-col">
            <h4 class="col-title orbitron-font">CONNECT</h4>
            <ul class="col-list">
              <li><a href="https://discord.gg/Knu76DhE9h" class="col-link" target="_blank" rel="noopener">Discord</a></li>
              <li><a href="https://steamcommunity.com/groups/wildfire-ro" class="col-link" target="_blank" rel="noopener">Steam</a></li>
              <li><a href="https://wildfire.ro" class="col-link" target="_blank" rel="noopener">Site Official</a></li>
              <li><a href="https://servertracker.gg/communities/wildfirero" class="col-link" target="_blank" rel="noopener">Vote Us</a></li>
            </ul>
          </div>

          <!-- Column 4: Wiki Stats (Tech Panel) -->
          <div class="footer-col stats-col">
            <h4 class="col-title orbitron-font">WIKI STATS</h4>
            <div class="stats-panel">
              <!-- Scanline overlay -->
              <div class="scanline-overlay"></div>

              <div class="stat-item">
                <div class="stat-header">
                  <span class="stat-label orbitron-font">SECTIONS</span>
                  <span class="stat-value orbitron-font">{{ wikiStats.sections }}</span>
                </div>
                <div class="stat-bar">
                  <div class="stat-bar-fill" :style="{ width: wikiStats.sectionsPercent + '%' }"></div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-header">
                  <span class="stat-label orbitron-font">PAGES</span>
                  <span class="stat-value orbitron-font">{{ wikiStats.pages }}</span>
                </div>
                <div class="stat-bar">
                  <div class="stat-bar-fill" :style="{ width: wikiStats.pagesPercent + '%' }"></div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-header">
                  <span class="stat-label orbitron-font">UPTIME</span>
                  <span class="stat-value orbitron-font">99.9%</span>
                </div>
                <div class="stat-bar">
                  <div class="stat-bar-fill accent" style="width: 99.9%"></div>
                </div>
              </div>

              <div class="stat-indicators">
                <span class="indicator-dot" v-for="n in 6" :key="n" :style="{ animationDelay: (n * 0.2) + 's' }"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Separator -->
        <div class="footer-separator"></div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
          <div class="footer-bottom-left">
            <p class="copyright orbitron-font">
              © 2021–{{ currentYear }} wildfire.ro — All rights reserved.
              <span class="version-badge orbitron-font">v{{ wikiVersion }}</span>
            </p>
          </div>
          <div class="footer-bottom-center">
            <a href="/terms" class="bottom-link">Terms</a>
            <span class="bottom-dot">·</span>
            <a href="/privacy" class="bottom-link">Privacy</a>
          </div>
          <div class="footer-bottom-right">
            <button class="back-to-top orbitron-font" @click="scrollToTop">
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { page, site, theme } = useData()

const isHomePage = computed(() => {
  return page.value.relativePath === 'index.md'
})

const currentYear = new Date().getFullYear()
const wikiVersion = ref('3.0.0')

const socialLinks = computed(() => {
  const config = theme.value
  const links = {
    steam: 'https://steamcommunity.com/groups/wildfire-ro',
    discord: 'https://discord.gg/Knu76DhE9h'
  }

  if (config.socialLinks) {
    config.socialLinks.forEach(link => {
      if (link.link && link.link.includes('discord')) links.discord = link.link
      if (link.link && link.link.includes('tiktok')) links.tiktok = link.link
    })
  }

  return links
})

const wikiStats = computed(() => {
  const config = theme.value
  let pages = 0

  // Count all pages (items with a link) recursively
  const countPages = (items) => {
    if (!items || !Array.isArray(items)) return
    items.forEach(item => {
      if (item.link) pages++
      if (item.items && Array.isArray(item.items)) {
        countPages(item.items)
      }
    })
  }

  // Sections = top-level sidebar categories (Informații, Currency, Systems, Market, etc.)
  let sections = 0
  if (config.sidebar && Array.isArray(config.sidebar)) {
    sections = config.sidebar.length
    config.sidebar.forEach(section => {
      if (section.link) pages++
      if (section.items) countPages(section.items)
    })
  }

  return {
    sections,
    sectionsPercent: Math.min((sections / 10) * 100, 100),
    pages,
    pagesPercent: Math.min((pages / 60) * 100, 100)
  }
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.wikiVersion) {
    wikiVersion.value = window.wikiVersion
  }
})
</script>

<style scoped>
.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
}

/* ===== FOOTER ROOT ===== */
.footer {
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-top: 80px;
}

/* ===== WATERMARK ===== */
.watermark-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.watermark-inner {
  position: relative;
}

.watermark-text {
  font-size: clamp(90px, 14vw, 220px);
  font-weight: 900;
  letter-spacing: 18px;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 69, 0, 0.08);
  position: relative;
  display: block;
}

/* Watermark subtle pulse animation */
.watermark-text::before {
  content: 'WILDFIRE';
  position: absolute;
  inset: 0;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 69, 0, 0.04);
  filter: blur(8px);
  animation: watermarkPulse 6s ease-in-out infinite;
}

@keyframes watermarkPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.01); }
}

/* ===== TOP ACCENT ===== */
.footer-accent-line {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 69, 0, 0.4) 25%,
    rgba(255, 69, 0, 0.6) 50%,
    rgba(255, 69, 0, 0.4) 75%,
    transparent 100%
  );
}

/* ===== CONTAINER ===== */
.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

.footer-content {
  padding: 64px 0 28px;
}

/* ===== GRID ===== */
.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 0.8fr 0.8fr 1.2fr;
  gap: 48px;
}

/* ===== BRAND ===== */
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  line-height: 1;
  letter-spacing: 2px;
}

.brand-tagline {
  font-size: 8px;
  margin: 4px 0 0;
  letter-spacing: 3px;
  font-weight: 500;
  opacity: 1;
}

.brand-text {
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  line-height: 1.7;
  margin: 0 0 24px;
  max-width: 340px;
}

/* ===== SOCIAL ===== */
.social-links {
  display: flex;
  gap: 8px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, transform 0.2s ease;
  position: relative;
}

.social-icon {
  width: 18px;
  height: 18px;
  transition: opacity 0.2s ease;
  position: relative;
  z-index: 1;
}

.social-link:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 69, 0, 0.6) !important;
}

.social-link:hover .social-icon {
  opacity: 1;
}

/* ===== COLUMN TITLES ===== */
.col-title {
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 24px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

/* ===== COLUMN LISTS ===== */
.col-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.col-list li {
  margin-bottom: 13px;
}

.col-list li:last-child {
  margin-bottom: 0;
}

.col-link {
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 400;
  transition: all 0.15s ease;
  display: inline-block;
}

.col-link:hover {
  color: #ff4500 !important;
  transform: translateX(3px);
}

/* ===== STATS PANEL ===== */
.stats-panel {
  position: relative;
  padding: 18px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.scanline-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 69, 0, 0.015) 2px,
    rgba(255, 69, 0, 0.015) 4px
  );
  pointer-events: none;
  z-index: 0;
}

.stat-item {
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
}

.stat-item:last-of-type {
  margin-bottom: 0;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.5px;
  opacity: 0.7;
}

.stat-value {
  font-size: 11px;
  font-weight: 700;
  color: #ff4500;
}

.stat-bar {
  width: 100%;
  height: 3px;
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  /* background: linear-gradient(90deg, #ff4500, #ff6b35); */
  transition: width 1s ease;
  position: relative;
}

.stat-bar-fill.accent {
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.stat-indicators {
  display: flex;
  gap: 5px;
  margin-top: 14px;
  padding-top: 12px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: #ff4500;
  opacity: 0.3;
  animation: dotBlink 2.5s ease-in-out infinite;
}

@keyframes dotBlink {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.6; }
}

/* ===== SEPARATOR ===== */
.footer-separator {
  height: 1px;
  margin: 48px 0 20px;
}

/* ===== BOTTOM BAR ===== */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
}

.footer-bottom-left {
  flex: 1;
}

.copyright {
  font-size: 11px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  letter-spacing: 0.3px;
}

.version-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.5px;
}

.footer-bottom-center {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bottom-link {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  text-decoration: none;
  font-weight: 400;
  transition: color 0.15s;
}

.bottom-link:hover {
  color: #ff4500 !important;
}

.bottom-dot {
  font-size: 14px;
  opacity: 0.3;
}

.footer-bottom-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.back-to-top {
  background: none;
  border: none;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  padding: 6px 0;
  transition: all 0.2s ease;
}

.back-to-top:hover {
  color: #ff4500 !important;
  transform: translateY(-1px);
}


/* ================================================================
   DARK MODE
   ================================================================ */
:root.dark .footer {
  background: transparent;
}

:root.dark .watermark-text {
  -webkit-text-stroke: 1.5px rgba(255, 69, 0, 0.07);
}

:root.dark .watermark-text::before {
  -webkit-text-stroke: 1.5px rgba(255, 69, 0, 0.035);
}

:root.dark .brand-name {
  color: #f5f5f5;
}

:root.dark .brand-tagline {
  color: #999;
}

:root.dark .brand-text {
  color: rgba(255, 255, 255, 0.55);
}

:root.dark .social-link {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

:root.dark .social-icon {
  filter: brightness(0) invert(1);
  opacity: 0.6;
}

:root.dark .social-link:hover .social-icon {
  opacity: 1;
}

:root.dark .col-title {
  color: #ff4500;
}

:root.dark .col-link {
  color: rgba(255, 255, 255, 0.5);
}

:root.dark .stats-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 69, 0, 0.1);
}

:root.dark .stat-label {
  color: rgba(255, 255, 255, 0.5);
}

:root.dark .stat-bar {
  background: rgba(255, 255, 255, 0.06);
}

:root.dark .stat-indicators {
  border-top: 1px solid rgba(255, 69, 0, 0.08);
}

:root.dark .footer-separator {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 30%,
    rgba(255, 255, 255, 0.05) 70%,
    transparent 100%
  );
}

:root.dark .copyright {
  color: rgba(255, 255, 255, 0.55);
}

:root.dark .version-badge {
  background: rgba(255, 69, 0, 0.08);
  color: #ff4500;
  border: 1px solid rgba(255, 69, 0, 0.15);
}

:root.dark .bottom-link {
  color: rgba(255, 255, 255, 0.3);
}

:root.dark .bottom-dot {
  color: rgba(255, 255, 255, 0.15);
}

:root.dark .back-to-top {
  color: rgba(255, 255, 255, 0.3);
}


/* ================================================================
   LIGHT MODE
   ================================================================ */
:root:not(.dark) .footer {
  background: transparent;
}

:root:not(.dark) .watermark-text {
  -webkit-text-stroke: 2px rgba(255, 69, 0, 0.1);
  color: rgba(255, 69, 0, 0.03);
}

:root:not(.dark) .watermark-text::before {
  -webkit-text-stroke: 2px rgba(255, 69, 0, 0.06);
  color: rgba(255, 69, 0, 0.015);
}

:root:not(.dark) .brand-name {
  color: #111;
}

:root:not(.dark) .brand-tagline {
  color: #777;
}

:root:not(.dark) .brand-text {
  color: #444;
}

:root:not(.dark) .social-link {
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

:root:not(.dark) .social-icon {
  filter: brightness(0) invert(1);
  opacity: 0.6;
}

:root:not(.dark) .social-link:hover {
  border-color: rgba(255, 69, 0, 0.6) !important;
}

:root:not(.dark) .social-link:hover .social-icon {
  filter: brightness(0) invert(1) !important;
  opacity: 1;
}

:root:not(.dark) .col-title {
  color: #ff4500;
}

:root:not(.dark) .col-link {
  color: #333;
}

:root:not(.dark) .stats-panel {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 69, 0, 0.1);
}

:root:not(.dark) .stat-label {
  color: #555;
}

:root:not(.dark) .stat-bar {
  background: rgba(0, 0, 0, 0.06);
}

:root:not(.dark) .stat-indicators {
  border-top: 1px solid rgba(255, 69, 0, 0.08);
}

:root:not(.dark) .footer-separator {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.06) 30%,
    rgba(0, 0, 0, 0.06) 70%,
    transparent 100%
  );
}

:root:not(.dark) .copyright {
  color: #555;
}

:root:not(.dark) .version-badge {
  background: rgba(255, 69, 0, 0.06);
  color: #ff4500;
  border: 1px solid rgba(255, 69, 0, 0.12);
}

:root:not(.dark) .bottom-link {
  color: #555;
}

:root:not(.dark) .bottom-dot {
  color: #ccc;
}

:root:not(.dark) .back-to-top {
  color: #555;
}

:root:not(.dark) .indicator-dot {
  background: #ff4500;
}


/* ================================================================
   RESPONSIVE
   ================================================================ */
@media (max-width: 1100px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 36px;
  }

  .stats-col {
    grid-column: 1 / -1;
  }

  .stats-panel {
    max-width: 360px;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 0 24px;
  }

  .footer-content {
    padding: 48px 0 24px;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }

  .brand-col {
    grid-column: 1 / -1;
  }

  .stats-col {
    grid-column: 1 / -1;
  }

  .stats-panel {
    max-width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 14px;
    text-align: center;
  }

  .footer-bottom-left { order: 2; }
  .footer-bottom-center { order: 1; }
  .footer-bottom-right { order: 3; justify-content: center; }

  .copyright {
    justify-content: center;
    flex-wrap: wrap;
  }

  .watermark-text {
    font-size: clamp(50px, 15vw, 110px);
    letter-spacing: 10px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 20px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .brand-col,
  .stats-col {
    grid-column: auto;
  }

  .brand {
    justify-content: center;
  }

  .brand-text {
    text-align: center;
    max-width: 100%;
  }

  .social-links {
    justify-content: center;
  }

  .col-title {
    text-align: center;
  }

  .col-list {
    text-align: center;
  }

  .col-link {
    display: inline-block;
  }

  .watermark-text {
    font-size: clamp(36px, 18vw, 70px);
    letter-spacing: 6px;
  }
}
</style>