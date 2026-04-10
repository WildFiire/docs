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
            <h4 class="col-title orbitron-font">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              NAVIGATE
            </h4>
            <ul class="col-list">
              <li><a href="/" class="col-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> Acasa</a></li>
              <li><a href="/informatii/about" class="col-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Despre</a></li>
              <li><a href="/informatii/regulamente/go/regulament-go" class="col-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Regulament</a></li>
              <li><a href="/informatii/faq" class="col-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> FAQ</a></li>
              <li><a href="/updates_wiki/updateswiki" class="col-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> Updates Wiki</a></li>
            </ul>
          </div>

          <!-- Column 3: Connect -->
          <div class="footer-col">
            <h4 class="col-title orbitron-font">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              CONNECT
            </h4>
            <ul class="col-list">
              <li><a href="https://discord.gg/Knu76DhE9h" class="col-link" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Discord</a></li>
              <li><a href="https://steamcommunity.com/groups/wildfire-ro" class="col-link" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg> Steam</a></li>
              <li><a href="https://wildfire.ro" class="col-link" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Site Official</a></li>
              <li><a href="https://servertracker.gg/communities/wildfirero" class="col-link" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Vote Us</a></li>
            </ul>
          </div>

          <!-- Column 4: Resources -->
          <div class="footer-col">
            <h4 class="col-title orbitron-font">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              RESOURCES
            </h4>
            <ul class="col-list">
              <li><a href="/terms" class="col-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Terms of Service</a></li>
              <li><a href="/privacy" class="col-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <!-- Separator -->
        <div class="footer-separator"></div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
          <div class="footer-bottom-left">
            <p class="copyright orbitron-font">
              2021–{{ currentYear }} wildfire.ro — All rights reserved.
              <span class="version-badge orbitron-font">v{{ wikiVersion }}</span>
            </p>
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
  grid-template-columns: 1.6fr 0.8fr 0.8fr 0.8fr;
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
  font-family: 'Orbitron', sans-serif !important;
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 24px;
  letter-spacing: 3px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.col-title svg {
  opacity: 0.7;
  flex-shrink: 0;
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.col-link svg {
  opacity: 0.5;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.col-link:hover svg {
  opacity: 1;
}

.col-link:hover {
  color: #ff4500 !important;
  transform: translateX(3px);
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

.made-with {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.6;
}

.heart {
  display: inline-block;
  font-size: 13px;
  animation: heartPulse 2s ease-in-out infinite;
}

@keyframes heartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
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

:root.dark .made-with {
  color: rgba(255, 255, 255, 0.5);
}

:root.dark .back-to-top {
  color: rgba(255, 255, 255, 0.65);
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

:root:not(.dark) .made-with {
  color: #666;
}

:root:not(.dark) .back-to-top {
  color: #555;
}

/* ================================================================
   RESPONSIVE
   ================================================================ */
@media (max-width: 1100px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 36px;
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

  .brand-col {
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