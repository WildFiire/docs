<template>
  <div v-if="isHomePage" class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-grid">
          <!-- Coloana 1: Brand + Comunitate -->
          <div class="footer-col brand-col">
            <div class="brand">
              <img src="/icons/wildfire.webp" alt="Wildfire.ro" class="brand-logo">
              <div class="brand-info">
                <h3 class="brand-name orbitron-font">Wildfire<span class="brand-dot">.ro</span></h3>
                <p class="brand-desc orbitron-font">LET THE WORLD BURN</p>
              </div>
            </div>
            
            <p class="brand-text orbitron-font">
              {{ siteDescription }}
            </p>

            <!-- Social Links -->
            <div class="social-links">
              <a :href="socialLinks.steam" class="social-link" aria-label="Steam" target="_blank" rel="noopener">
                <img src="/icons/steam.svg" alt="Steam" class="social-icon">
              </a>
              <a :href="socialLinks.discord" class="social-link" aria-label="Discord" target="_blank" rel="noopener">
                <img src="/icons/discord.svg" alt="Discord" class="social-icon">
              </a>
              <a :href="socialLinks.tiktok" class="social-link" aria-label="TikTok" target="_blank" rel="noopener">
                <img src="/icons/tiktok.svg" alt="TikTok" class="social-icon">
              </a>
              <a :href="socialLinks.instagram" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
                <img src="/icons/web.svg" alt="Instagram" class="social-icon">
              </a>
            </div>
          </div>

          <!-- Coloana 2: Info -->
          <div class="footer-col">
            <h4 class="col-title orbitron-font">║ INFO</h4>
            <ul class="col-list">
              <li><a href="/" class="col-link orbitron-font">Acasa</a></li>
              <li><a href="/informatii/about" class="col-link orbitron-font">Despre</a></li>
              <li><a href="/informatii/regulamente/regulament-playeri" class="col-link orbitron-font">Regulament</a></li>
              <li><a href="/informatii/faq" class="col-link orbitron-font">FAQ</a></li>
            </ul>
          </div>

          <!-- Coloana 3: Comunitate -->
          <div class="footer-col">
            <h4 class="col-title orbitron-font">║ COMUNITATE</h4>
            <ul class="col-list">
              <li><a href="https://discord.gg/Knu76DhE9h" class="col-link orbitron-font">Connect</a></li>
              <li><a href="/updateswiki" class="col-link orbitron-font">Updates Wiki</a></li>
              <li><a href="https://servertracker.gg/communities/wildfirero" class="col-link orbitron-font">Vote Us</a></li>
              <li><a href="https://wildfire.ro" class="col-link orbitron-font">Site Official</a></li>
            </ul>
          </div>

          <!-- Coloana 4: Wiki Stats -->
          <div class="footer-col">
            <h4 class="col-title orbitron-font">║ WIKI STATS</h4>
            <div class="tech-stats">
              <div class="grid-bg"></div>
              
              <div class="stat-row">
                <span class="stat-label orbitron-font">Categorii</span>
                <span class="stat-value orbitron-font">{{ wikiStats.categorii }}</span>
                <div class="stat-line">
                  <div class="stat-fill" :style="{ width: wikiStats.categoriiPercent + '%' }"></div>
                </div>
              </div>

              <div class="stat-row">
                <span class="stat-label orbitron-font">Pagini</span>
                <span class="stat-value orbitron-font">{{ wikiStats.pagini }}</span>
                <div class="stat-line">
                  <div class="stat-fill" :style="{ width: wikiStats.paginiPercent + '%' }"></div>
                </div>
              </div>

              <div class="stat-row">
                <span class="stat-label orbitron-font">Performance</span>
                <span class="stat-value orbitron-font">{{ wikiStats.performance }}%</span>
                <div class="stat-line">
                  <div class="stat-fill perf" :style="{ width: wikiStats.performance + '%' }"></div>
                </div>
              </div>

              <div class="tech-indicators">
                <span class="indicator"></span>
                <span class="indicator"></span>
                <span class="indicator"></span>
                <span class="indicator"></span>
                <span class="indicator"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom bar cu semnatura -->
        <div class="footer-bottom">
          <div class="footer-bottom-left">
            <p class="copyright orbitron-font">
              © 2021-{{ currentYear }} wildfire.ro <span class="version-badge orbitron-font">v{{ wikiVersion }}</span>
            </p>
          </div>
          <div class="footer-bottom-right">
            <span class="made-by-text orbitron-font">made by</span>
            <div class="signature-wrapper">
              <img src="/icons/download.svg" alt="iannC signature" class="signature-img">
            </div>
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

const siteDescription = computed(() => site.value.description)
const wikiVersion = ref('3.0.0')

const socialLinks = computed(() => {
  const config = theme.value
  const links = {
    steam: 'https://steamcommunity.com/groups/wildfire-ro',
    instagram: 'https://wildfire.ro/'
  }
  
  if (config.socialLinks) {
    config.socialLinks.forEach(link => {
      if (link.link.includes('discord')) links.discord = link.link
      if (link.link.includes('tiktok')) links.tiktok = link.link
      if (link.link.includes('wildfire.ro')) links.website = link.link
    })
  }
  
  return links
})

const wikiStats = computed(() => {
  const config = theme.value
  let categorii = 0
  let pagini = 0
  
  if (config.sidebar && Array.isArray(config.sidebar)) {
    categorii = config.sidebar.length
    
    const countPages = (items) => {
      if (!items || !Array.isArray(items)) return
      
      items.forEach(item => {
        if (item.link) {
          pagini++
        }
        if (item.items && Array.isArray(item.items)) {
          countPages(item.items)
        }
      })
    }
    
    countPages(config.sidebar)
  }
  
  return {
    categorii: categorii || 7,
    categoriiPercent: 85,
    pagini: pagini || 42,
    paginiPercent: 78,
    performance: 98
  }
})

onMounted(() => {
  if (typeof window !== 'undefined' && window.wikiVersion) {
    wikiVersion.value = window.wikiVersion
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.footer {
  width: 100%;
  background: #0a0a0c;
  border-top: 2px solid rgba(255, 69, 0, 0.2);
  margin-top: 60px;
  padding: 0;
  transition: all 0.3s ease;
}

:root:not(.dark) .footer {
  background: #ffffff;
  border-top: 2px solid rgba(255, 69, 0, 0.25);
}

:root:not(.dark) .footer .col-title,
:root:not(.dark) .footer .brand-name {
  color: #111111;
}

:root:not(.dark) .footer .brand-desc {
  color: #666666;
}

:root:not(.dark) .footer .brand-text {
  color: #444444;
}

:root:not(.dark) .footer .col-link {
  color: #444444;
}

:root:not(.dark) .footer .col-link:hover {
  color: #ff4500;
}

:root:not(.dark) .footer .stat-label {
  color: #444444;
}

:root:not(.dark) .footer .stat-value {
  color: #22c55e;
}

:root:not(.dark) .footer .stat-line {
  background: #e0e0e0;
}

:root:not(.dark) .footer .stat-fill {
  background: #22c55e;
}

:root:not(.dark) .footer .indicator {
  background: #22c55e;
}

:root:not(.dark) .footer .grid-bg {
  background-image: 
    linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

:root:not(.dark) .footer .copyright,
:root:not(.dark) .footer .made-by-text {
  color: #666666;
}

:root:not(.dark) .footer .version-badge {
  background: #f0f0f0;
  color: #22c55e;
  border-color: #22c55e;
}

/* SVG-uri în light mode */
:root:not(.dark) .footer .social-icon {
  filter: brightness(0.4);
  transition: all 0.2s ease;
}

:root:not(.dark) .footer .social-link:hover .social-icon {
  filter: brightness(0) invert(1);
}

:root.dark .footer {
  background: #0a0a0c;
}

:root.dark .footer .col-title,
:root.dark .footer .brand-name {
  color: #ffffff;
}

:root.dark .footer .brand-desc {
  color: #888;
}

:root.dark .footer .brand-text {
  color: #aaa;
}

:root.dark .footer .col-link {
  color: #aaa;
}

:root.dark .footer .col-link:hover {
  color: #ff4500;
}

:root.dark .footer .stat-label {
  color: #ccc;
}

:root.dark .footer .stat-value {
  color: #22c55e;
}

:root.dark .footer .stat-line {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .footer .stat-fill {
  background: #22c55e;
}

:root.dark .footer .indicator {
  background: #22c55e;
}

:root.dark .footer .grid-bg {
  background-image: 
    linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

:root.dark .footer .copyright,
:root.dark .footer .made-by-text {
  color: #666;
}

:root.dark .footer .version-badge {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border-color: #22c55e;
}

/* SVG-uri în dark mode - DOAR ALBE */
:root.dark .footer .social-icon {
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

:root.dark .footer .social-link:hover .social-icon {
  filter: brightness(0) invert(1);
  opacity: 1;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
}

.footer-content {
  padding: 50px 0 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.brand-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.brand-dot {
  color: #ff4500;
}

.brand-desc {
  font-size: 11px;
  margin: 2px 0 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 400;
}

.brand-text {
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 20px;
  font-weight: 400;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 69, 0, 0.08);
  border: 1px solid rgba(255, 69, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.social-icon {
  width: 20px;
  height: 20px;
  transition: all 0.2s;
}

.social-link:hover {
  background: #ff4500;
  border-color: #ff4500;
  transform: translateY(-2px);
}

.social-link:hover .social-icon {
  filter: brightness(0) invert(1) !important;
}

.col-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 20px;
  letter-spacing: 1px;
}

.col-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.col-list li {
  margin-bottom: 12px;
}

.col-link {
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
}

.col-link:hover {
  color: #ff4500;
  transform: translateX(3px);
}

.tech-stats {
  position: relative;
  padding: 16px 12px;
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  overflow: hidden;
}

.grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
  pointer-events: none;
}

.stat-row {
  position: relative;
  margin-bottom: 16px;
  z-index: 1;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  opacity: 0.8;
}

.stat-value {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  font-weight: 700;
}

.stat-line {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
  position: relative;
  animation: scan 3s infinite linear;
}

.stat-fill.perf {
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

@keyframes scan {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.tech-indicators {
  display: flex;
  gap: 4px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(34, 197, 94, 0.2);
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 1px;
  opacity: 0.5;
  animation: blink 2s infinite;
}

.indicator:nth-child(1) { animation-delay: 0s; }
.indicator:nth-child(2) { animation-delay: 0.3s; }
.indicator:nth-child(3) { animation-delay: 0.6s; }
.indicator:nth-child(4) { animation-delay: 0.9s; }
.indicator:nth-child(5) { animation-delay: 1.2s; }

@keyframes blink {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 69, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom-left {
  flex: 1;
}

.footer-bottom-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  transform: translateX(30px);
}

.made-by-text {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.3px;
}

.signature-wrapper {
  display: flex;
  align-items: center;
}

.signature-img {
  height: 40px;
  width: auto;
  max-width: 170px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(255, 69, 0, 0.3));
  transition: all 0.3s ease;
  transform: rotate(-1.2deg) scale(1.05);
}

:root.dark .signature-img {
  filter: drop-shadow(0 4px 8px rgba(255, 69, 0, 0.5));
}

.signature-wrapper:hover .signature-img {
  transform: rotate(-0.8deg) scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(255, 69, 0, 0.7));
}

.copyright {
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
}

.version-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 10px;
  border: 1px solid;
}

@media (max-width: 1200px) {
  .footer-bottom-right {
    transform: translateX(20px);
  }
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .footer-bottom-right {
    transform: translateX(10px);
  }
  
  .signature-img {
    height: 36px;
    max-width: 150px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    padding: 40px 0 15px;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .footer-bottom-right {
    transform: translateX(0);
    margin-left: 0;
  }
  
  .copyright {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 20px;
  }
  
  .brand {
    flex-direction: column;
    text-align: center;
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
  
  .col-link {
    text-align: center;
    display: block;
  }
  
  .signature-img {
    height: 32px;
    max-width: 140px;
  }
}
</style>