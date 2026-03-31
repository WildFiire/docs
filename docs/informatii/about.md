---
outline: deep
---

<CaseHeader 
  title="About us"
  :tags="[
    { text: 'INFO', component: 'PageTagRed' },
    { text: 'ABOUT', component: 'PageTagPurple' },
    { text: 'WILDFIRE', component: 'PageTagOrange' }
  ]"
  :path="['Home', 'Informatii', 'About']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="8"
  icon="/icons/wildfire.webp"
  updated-by-username="iannc69"
  page-id="about-page"
  badge-text="Despre Noi"
  badge-icon="lucide:heart"
  :floating-icons="[
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' },
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' },
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' }
  ]"
/>

<!-- STILURI CU CLASĂ SPECIFICĂ ABOUT -->
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* ===== FONT ORBITRON PENTRU TITLURI ȘI ELEMENTE IMPORTANTE ===== */
.about-card-title,
.about-card-title span,
.about-highlight,
.about-badge,
.about-server-box,
.about-stat-number,
.about-social-link,
.about-root h1,
.about-root h2,
.about-root h3,
.about-root h4,
.about-root .PageTagRed,
.about-root .PageTagGreen,
.about-root .PageTagPurple,
.about-stats-grid .about-stat-item .about-stat-number,
.about-server-item strong,
.about-root .breadcrumb-item,
.about-root .tag-text,
.about-root h1.orbitron-font,
.about-root .about-highlight.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* Păstrăm dimensiunile originale */
.about-card-title {
  font-weight: 700;
  font-size: 24px;
}

.about-highlight {
  font-weight: 600;
}

.about-badge {
  font-weight: 600;
  font-size: 13px;
}

.about-server-box {
  font-weight: 800;
  font-size: 22px;
}

.about-stat-number {
  font-weight: 800;
  font-size: 36px;
}

.about-social-link {
  font-weight: 600;
  font-size: 14px;
}

.about-root h1 {
  font-weight: 800;
  font-size: 32px;
}

.about-root h2 {
  font-weight: 700;
  font-size: 28px;
}

.about-root h3 {
  font-weight: 600;
  font-size: 24px;
}

.about-server-item strong {
  font-weight: 600;
}

/* ===== STATISTICI - PĂSTRĂM DESIGNUL ORIGINAL ===== */
.about-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.about-stat-item {
  background: var(--about-stat-bg);
  border: 1px solid var(--about-stat-border);
  border-radius: 20px;
  padding: 25px 15px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.about-stat-item::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,140,0,0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.about-stat-item:hover::before {
  opacity: 1;
}

.about-stat-item:hover {
  background: var(--about-brand-soft);
  transform: scale(1.05) translateY(-5px);
  border-color: var(--about-brand-1);
  box-shadow: 0 10px 25px rgba(255,140,0,0.15);
}

.about-stat-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--about-brand-1);
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

.about-stat-label {
  font-size: 14px;
  color: var(--about-text-2);
  margin-top: 8px;
  position: relative;
  z-index: 1;
}

/* ===== SERVER ITEMS - PĂSTRĂM DESIGNUL ORIGINAL ===== */
.about-server-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: var(--about-stat-bg);
  padding: 15px;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.about-server-item:hover {
  background: var(--about-brand-soft);
  border-color: var(--about-brand-1);
  transform: translateX(5px);
}

.about-server-icon {
  background: var(--about-brand-soft);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.about-server-item:hover .about-server-icon {
  background: var(--about-brand-1);
  transform: rotate(5deg);
}

.about-server-icon svg {
  width: 24px;
  height: 24px;
  stroke: var(--about-brand-1);
  transition: all 0.3s ease;
}

.about-server-item:hover .about-server-icon svg {
  stroke: white;
}

.about-server-item div {
  font-size: 14px;
  line-height: 1.5;
  color: var(--about-text-1);
}

/* ===== BADGE-URI - PĂSTRĂM DESIGNUL ORIGINAL ===== */
.about-badge {
  display: inline-block;
  background: var(--about-brand-soft);
  border: 1px solid var(--about-card-border);
  color: var(--about-brand-1);
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 13px;
  margin: 2px 4px;
  transition: all 0.3s ease;
}

.about-badge:hover {
  background: var(--about-brand-1);
  color: white;
  transform: translateY(-2px);
  border-color: var(--about-brand-1);
}

/* ===== SERVER BOX - PĂSTRĂM DESIGNUL ORIGINAL ===== */
.about-server-box {
  display: inline-block;
  background: var(--about-server-bg);
  border: 2px solid var(--about-brand-1);
  color: var(--about-brand-1);
  font-weight: 800;
  padding: 12px 30px;
  border-radius: 60px;
  font-size: 22px;
  letter-spacing: 1.5px;
  box-shadow: 0 0 20px rgba(255,140,0,0.2);
  margin: 15px 0;
  transition: all 0.3s ease;
  animation: about-float 4s ease infinite;
  backdrop-filter: blur(5px);
}

.about-server-box:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255,140,0,0.4);
}

/* ===== SOCIAL LINKS - PĂSTRĂM DESIGNUL ORIGINAL ===== */
.about-social-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--about-social-bg);
  border: 1px solid var(--about-social-border);
  border-radius: 50px;
  padding: 14px 30px;
  color: var(--about-text-1);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.about-social-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,140,0,0.2), transparent);
  transition: left 0.5s ease;
}

.about-social-link:hover::before {
  left: 100%;
}

.about-social-link:hover {
  background: var(--about-brand-soft);
  border-color: var(--about-brand-1);
  transform: translateY(-4px);
  color: var(--about-brand-1);
}

.about-social-link svg {
  width: 22px;
  height: 22px;
  stroke: var(--about-brand-1);
  fill: none;
  transition: transform 0.3s ease;
}

.about-social-link:hover svg {
  transform: scale(1.2) rotate(5deg);
}

/* ===== QUOTE - PĂSTRĂM DESIGNUL ORIGINAL ===== */
.about-quote {
  font-style: italic;
  color: var(--about-text-2);
  padding: 25px;
  border-left: 4px solid var(--about-brand-1);
  background: var(--about-quote-bg);
  border-radius: 0 20px 20px 0;
  margin: 25px 0;
  position: relative;
  transition: all 0.3s ease;
  font-size: 15px;
  line-height: 1.7;
}

.about-quote:hover {
  border-left-width: 6px;
  background: var(--about-brand-soft);
}

/* ===== CARD TITLE - PĂSTRĂM DESIGNUL ORIGINAL ===== */
.about-card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--about-brand-1);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--about-card-border);
  letter-spacing: -0.3px;
}

.about-card-title svg {
  width: 28px;
  height: 28px;
  stroke: var(--about-brand-1);
  fill: none;
  transition: transform 0.3s ease;
}

.about-card:hover .about-card-title svg {
  transform: scale(1.1) rotate(3deg);
}

/* ========== VARIABILE ABOUT ========== */
.about-root {
  --about-brand-1: #ff8c00;
  --about-brand-2: #ff5500;
  --about-brand-soft: rgba(255,140,0,0.1);
  --about-bg: #0a0a0a;
  --about-bg-soft: #141414;
  --about-bg-mute: #1f1f1f;
  --about-divider: rgba(255,140,0,0.2);
  --about-text-1: #e0e0e0;
  --about-text-2: #888;
  --about-text-3: #666;
  --about-bg-brightness: 0.7;
  --about-bg-opacity: 0.4;
  --about-icon-filter: none;
  --about-logo-filter: none;
  --about-card-bg: linear-gradient(145deg, rgba(20,20,20,0.8), rgba(10,10,10,0.9));
  --about-card-border: rgba(255,140,0,0.2);
  --about-card-shadow: 0 15px 30px rgba(0,0,0,0.3);
  --about-stat-bg: rgba(255,140,0,0.05);
  --about-stat-border: rgba(255,140,0,0.2);
  --about-quote-bg: rgba(255,140,0,0.03);
  --about-social-bg: rgba(255,140,0,0.05);
  --about-social-border: rgba(255,140,0,0.2);
  --about-server-bg: rgba(0,0,0,0.5);
}

/* Light theme override pentru about */
html:not(.dark) .about-root {
  --about-bg: #ffffff;
  --about-bg-soft: #f8f8f8;
  --about-bg-mute: #f0f0f0;
  --about-divider: rgba(255,140,0,0.2);
  --about-text-1: #333333;
  --about-text-2: #666666;
  --about-text-3: #999999;
  --about-bg-brightness: 0.9;
  --about-bg-opacity: 0.2;
  --about-icon-filter: brightness(0.9);
  --about-logo-filter: brightness(0.9);
  --about-card-bg: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.95));
  --about-card-border: rgba(255,140,0,0.3);
  --about-card-shadow: 0 15px 30px rgba(0,0,0,0.1);
  --about-stat-bg: rgba(255,140,0,0.03);
  --about-stat-border: rgba(255,140,0,0.2);
  --about-quote-bg: rgba(255,140,0,0.02);
  --about-social-bg: rgba(255,140,0,0.03);
  --about-social-border: rgba(255,140,0,0.2);
  --about-server-bg: rgba(255,255,255,0.8);
}

/* SVG-uri în dark mode - DOAR ALBE */
.dark .about-root .nav-icon,
.dark .about-root .about-social-link svg,
.dark .about-root .about-card-title svg,
.dark .about-root .about-server-icon svg,
.dark .about-root .about-footer svg {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.dark .about-root .about-social-link:hover svg {
  filter: brightness(0) invert(1);
  opacity: 1;
}

/* SVG-uri în light mode */
:not(.dark) .about-root .nav-icon,
:not(.dark) .about-root .about-social-link svg,
:not(.dark) .about-root .about-card-title svg,
:not(.dark) .about-root .about-server-icon svg,
:not(.dark) .about-root .about-footer svg {
  filter: brightness(0.4);
  opacity: 0.8;
}

:not(.dark) .about-root .about-social-link:hover svg {
  filter: brightness(0) invert(1);
}

/* ========== ANIMAȚII ABOUT ========== */
@keyframes about-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes about-float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

/* ========== CARD DESIGN ABOUT ========== */
.about-card {
  background: var(--about-card-bg);
  border: 1px solid var(--about-card-border);
  border-radius: 20px;
  padding: 25px;
  margin: 25px 0;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--about-text-1);
  position: relative;
  overflow: hidden;
}

.about-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--about-brand-1), var(--about-brand-2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.about-card:hover::before {
  opacity: 1;
}

.about-card:hover {
  border-color: var(--about-brand-1);
  transform: translateY(-3px);
  box-shadow: var(--about-card-shadow);
}

/* ========== HIGHLIGHT ABOUT ========== */
.about-highlight {
  color: var(--about-brand-1);
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding: 0 2px;
}

.about-highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--about-brand-1), transparent);
  border-radius: 2px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.about-highlight:hover::after {
  opacity: 1;
  height: 3px;
}

/* ========== FOOTER ABOUT ========== */
.about-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--about-divider);
  text-align: center;
  color: var(--about-text-2);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.about-footer span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.about-footer svg {
  width: 16px;
  height: 16px;
  stroke: var(--about-brand-1);
  fill: none;
}

/* ========== PAGE HEADER ABOUT ========== */
.about-page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.about-page-header-svg {
  width: 40px;
  height: 40px;
  stroke: var(--about-brand-1);
  fill: none;
  animation: about-float 4s ease infinite;
}

/* ========== TOC HIDDEN ========== */
.about-toc-hidden {
  display: none;
}

/* ========== PARAGRAF TEXT ========== */
.about-card p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--about-text-1);
  margin-bottom: 15px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.about-card p:last-child {
  margin-bottom: 0;
}

.about-card p strong {
  color: var(--about-brand-1);
  font-weight: 600;
  font-family: 'Orbitron', sans-serif !important;
}

/* ========== RESPONSIVE ABOUT ========== */
@media (max-width: 768px) {
  .about-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .about-server-box {
    font-size: 18px;
    padding: 10px 20px;
  }
  
  .about-social-link {
    padding: 12px 20px;
  }
  
  .about-card-title {
    font-size: 20px;
  }
  
  .about-card-title svg {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .about-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- ================================================ -->
<!-- DESPRE WILDFIRE.RO - PAGINĂ COMPLETĂ CU CLASĂ ABOUT -->
<!-- ================================================ -->

<div class="about-root">

<!-- INTRO HEADER -->
## <span class="about-highlight orbitron-font">Bine ai venit</span> <span class="orbitron-font">pe Wildfire.ro</span>

<div class="about-card">
  <div style="font-size: 17px; line-height: 1.7;">
    <p>Dacă ești aici pentru prima dată, o să vezi repede despre ce e vorba. Vorbim despre un server comunitar de <strong>Counter-Strike</strong> unde am încercat să facem totul să meargă <span class="about-highlight orbitron-font">fluent</span>: fără lag și spikes, fără admini care dispar exact când ai nevoie de ei, fără caterinca proastă.</p>
    
   <p>Proiectul Wildfire.ro a luat naștere în <strong>2021</strong> și de atunci tot creștem. Nu pentru că țipăm mai tare, ci pentru că lumea chiar se simte bine aici. <span class="about-highlight orbitron-font">Comunitate activă</span>, eventuri în fiecare săptămână.</p>
    
   <p>Ghidul ăsta e gândit să te pună rapid în temă. Ce servere avem, cum funcționează <span class="about-highlight orbitron-font">economia custom</span>, treaba cu <span class="about-highlight orbitron-font">rankurile</span>, modurile de joc disponibile și cum și unde găsești <span class="about-highlight orbitron-font">comunitatea</span>. După ce-l citești, intri pe server și vezi cum e.</p>
  </div>
</div>

<!-- STATISTICI -->
<div class="about-stats-grid">
  <div class="about-stat-item">
    <div class="about-stat-number orbitron-font">2021</div>
    <div class="about-stat-label">anul fondării</div>
  </div>
  <div class="about-stat-item">
    <div class="about-stat-number orbitron-font">1</div>
    <div class="about-stat-label">servere active</div>
  </div>
  <div class="about-stat-item">
    <div class="about-stat-number orbitron-font">24/7</div>
    <div class="about-stat-label">suport staff</div>
  </div>
  <div class="about-stat-item">
    <div class="about-stat-number orbitron-font">1000+</div>
    <div class="about-stat-label">membri comunitate</div>
  </div>
</div>

<!-- SERVERE HEADER ASCUNS PENTRU TOC -->
### <span class="about-toc-hidden">Ce servere rulăm</span>

<div class="about-card">
  <div class="about-card-title orbitron-font">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="2"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
      <line x1="16" y1="2" x2="16" y2="22"/>
      <line x1="2" y1="8" x2="22" y2="8"/>
      <line x1="2" y1="16" x2="22" y2="16"/>
    </svg>
    <span style="font-size: 24px; font-weight: 700; color: var(--about-brand-1);">Ce servere rulăm</span>
  </div>
  
  <div style="display: flex; flex-direction: column; gap: 15px;">
    <div class="about-server-item">
      <div class="about-server-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
        </svg>
      </div>
      <div>
        <span class="about-badge orbitron-font">Competitive</span> – Locul perfect pentru a te distra împreună cu prietenii tăi. <strong>go.wildfire.ro</strong>
      </div>
    </div>
    
  <div class="about-server-item">
      <div class="about-server-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <span class="about-badge orbitron-font">Coming soon</span> – Și mai multe pe parcurs
      </div>
    </div>
  </div>
</div>

<!-- ECONOMIE HEADER ASCUNS PENTRU TOC -->
### <span class="about-toc-hidden">Sistem economic custom</span>

<div class="about-card">
  <div class="about-card-title orbitron-font">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
    <span style="font-size: 24px; font-weight: 700; color: var(--about-brand-1);">Sistem economic custom</span>
  </div>
  
  <p>Am construit o economie care chiar contează. Câștigi în funcție de cât tragi, cât joci în echipă, cât de mult participi. Strângi, cumperi, progresezi.</p>
</div>

<!-- RANK HEADER ASCUNS PENTRU TOC -->
### <span class="about-toc-hidden">Rank și progres</span>

<div class="about-card">
  <div class="about-card-title orbitron-font">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
      <path d="M2 17L12 22L22 17"/>
      <path d="M2 12L12 17L22 12"/>
    </svg>
    <span style="font-size: 24px; font-weight: 700; color: var(--about-brand-1);">Rank și progres</span>
  </div>
  
  <p>Joci, câștigi experiență, urci în rank, totul gândit să aibă sens. Vrei să ajungi sus? Trebuie să joci, nu doar să te conectezi o dată pe lună.</p>
</div>

<!-- COMUNITATE HEADER ASCUNS PENTRU TOC -->
### <span class="about-toc-hidden">Comunitatea</span>

<div class="about-card">
  <div class="about-card-title orbitron-font">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
    <span style="font-size: 24px; font-weight: 700; color: var(--about-brand-1);">Comunitatea</span>
  </div>
  
  <p>Probabil cel mai important: <span class="about-highlight orbitron-font">oamenii</span>. Fără oameni ok, orice server e mort. Noi am avut noroc, s-a strâns o comunitate faină, activă, care știe să și joace, dar și să râdă. Fără toxicitate, fără rasism, fără admini care sar pe tine la orice cuvânt scos pe gură. Doar oameni care vor același lucru: servere bune și distracție.</p>
  
  <div class="about-quote">
    Vrei să faci parte din treaba asta? Intri pe server, bagi câteva runde, vezi tu cum e. Dacă ți se potrivește vibe-ul, rămâi. Dacă nu, măcar ai încercat.
  </div>
</div>

</div>
