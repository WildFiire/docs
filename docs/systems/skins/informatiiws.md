---
outline: deep
---

<CaseHeader 
  title="Sistemul de WeaponSkins"
  :tags="[
    { text: 'skins', component: 'PageTagRed' },
    { text: 'weapons', component: 'PageTagBlue' },
    { text: 'inventory', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems', 'Sistem Skin-uri']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="sistem-skin-uri"
  badge-text="WeaponSkins"
/>

<!-- STILURI CU SUPORT LIGHT/DARK THEME -->
<style>
.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* ===== FONT ORBITRON PENTRU TITLURI ȘI ELEMENTE IMPORTANTE ===== */
.section-title,
.section-title span,
.panel-number,
.highlight,
.badge,
.panel-badge,
.info-box li span .highlight,
.panel-content strong,
.title-hover span,
.title-hover svg + span,
h1,
h2,
h3,
.title-hover span,
.PageTagRed,
.PageTagBlue,
.PageTagGreen,
.PageTagPurple,
.panel-card .badge,
.panel-card .panel-badge,
.info-box .highlight,
.panel-stat-value,
.panel-stat-label,
.panel-step-number,
.panel-step-content strong,
.panel-type,
.panel-cta-btn,
.panel-question-text,
.panel-feature,
.collapse-title,
.collapse-badge,
.panel-types .panel-type,
.stat-card .stat-value,
.stat-card .stat-label,
.command-box code,
.custom-list li span.highlight,
.important-box,
.tip-box,
.feature-badge,
.category-badge {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* Variabile CSS pentru ambele teme */
:root {
  --panel-card-bg: linear-gradient(145deg, #0f0f0f, #141414);
  --panel-card-border: rgba(255,140,0,0.2);
  --panel-text: #e0e0e0;
  --panel-badge-bg: #1e1e1e;
  --panel-badge-border: rgba(255,255,255,0.1);
  --panel-highlight: #ffae42;
  --panel-primary: #ff8c00;
  --panel-primary-dark: #cc7000;
  --info-box-bg: rgba(255,140,0,0.06);
  --info-box-border: rgba(255,140,0,0.25);
  --section-title-color: #ff8c00;
  --section-divider: linear-gradient(90deg, transparent, rgba(255,140,0,0.3), transparent);
  --panel-number-bg: rgba(255,140,0,0.15);
  --panel-number-border: rgba(255,140,0,0.3);
  --panel-number-text: #ff8c00;
  --hot-color: #ff4444;
  --steal-color: #00c851;
  --rare-color: #aa00ff;
}

/* Light theme override */
html:not(.dark) {
  --panel-card-bg: linear-gradient(145deg, #f8f8f8, #ffffff);
  --panel-card-border: rgba(255,140,0,0.3);
  --panel-text: #333333;
  --panel-badge-bg: #f0f0f0;
  --panel-badge-border: rgba(0,0,0,0.1);
  --panel-highlight: #ff8c00;
  --panel-primary: #ff8c00;
  --panel-primary-dark: #e67e00;
  --info-box-bg: rgba(255,140,0,0.04);
  --info-box-border: rgba(255,140,0,0.2);
  --section-title-color: #ff8c00;
  --section-divider: linear-gradient(90deg, transparent, rgba(255,140,0,0.4), transparent);
  --panel-number-bg: rgba(255,140,0,0.1);
  --panel-number-border: rgba(255,140,0,0.3);
  --panel-number-text: #ff8c00;
}

/* PREVENIRE SELECTARE IMAGINI SI ICONITE */
img, svg, .panel-icon, .panel-icon svg, .nav-icon, [class*="icon"] {
  user-select: none !important;
  -webkit-user-select: none !important;
  -webkit-user-drag: none !important;
  user-drag: none !important;
  pointer-events: none !important;
}

/* CARD */
.panel-card {
  background: var(--panel-card-bg);
  border: 1px solid var(--panel-card-border);
  padding: 18px;
  border-radius: 14px;
  transition: .25s;
  line-height: 1.6;
  color: var(--panel-text);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 15px;
}

.panel-card:hover {
  transform: translateY(-3px);
  border-color: #ff8c00;
  box-shadow: 0 8px 25px rgba(0,0,0,.15);
}

/* Icon container */
.panel-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: rgba(255,140,0,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--panel-card-border);
}

.panel-content {
  flex: 1;
}

.panel-content p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.6;
}

/* BADGES */
.panel-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--panel-primary), var(--panel-primary-dark));
  color: white;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 12px;
  margin: 2px 3px;
  border: none;
  box-shadow: 0 2px 5px rgba(255,140,0,0.3);
}

.badge {
  display: inline-block;
  background: var(--panel-badge-bg);
  border: 1px solid var(--panel-badge-border);
  color: var(--panel-text);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  margin: 2px 3px;
  font-weight: 500;
}

.feature-badge {
  display: inline-block;
  background: rgba(255,140,0,0.15);
  border: 1px solid rgba(255,140,0,0.3);
  color: var(--panel-primary);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  margin: 2px 3px;
}

.category-badge {
  display: inline-block;
  background: rgba(255,140,0,0.1);
  border: 1px solid rgba(255,140,0,0.2);
  color: var(--panel-text);
  padding: 5px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
  margin: 3px;
}

.category-badge:hover {
  background: rgba(255,140,0,0.2);
  border-color: var(--panel-primary);
}

/* highlight */
.highlight {
  color: var(--panel-highlight);
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  opacity: 0.3;
  border-radius: 2px;
}

/* info box */
.info-box {
  margin-top: 30px;
  background: var(--info-box-bg);
  border: 1px solid var(--info-box-border);
  border-radius: 14px;
  padding: 22px;
  line-height: 1.7;
  color: var(--panel-text);
}

.info-box ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.info-box li {
  margin-bottom: 16px;
  color: var(--panel-text);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
}

.info-box li svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  stroke: var(--panel-highlight);
  fill: none;
  margin-top: 2px;
}

/* Stil pentru titlurile de secțiune */
.section-title {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 28px;
  font-weight: 700;
  color: var(--section-title-color);
  margin: 45px 0 25px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, #ff8c00, #ff4400, rgba(255,68,0,0.2), transparent);
  border-image-slice: 1;
  letter-spacing: -0.3px;
  position: relative;
}

.section-title svg {
  width: 32px;
  height: 32px;
  stroke: currentColor;
  fill: none;
  filter: drop-shadow(0 2px 4px rgba(255,140,0,0.3));
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.section-title:hover {
  transform: translateX(5px);
  transition: transform 0.3s ease;
}

.section-title:hover svg {
  transform: scale(1.15) rotate(3deg);
  filter: drop-shadow(0 4px 8px rgba(255,140,0,0.5));
}

.section-title span {
  background: linear-gradient(135deg, #ff8c00, #ff4400);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  color: #ff8c00;
  line-height: 1.2;
}

/* Stil pentru număr */
.panel-number {
  display: inline-block;
  background: var(--panel-number-bg);
  color: var(--panel-number-text);
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  margin-right: 10px;
  margin-bottom: 5px;
  border: 1px solid var(--panel-number-border);
}

/* Hot/Steal badges */
.hot-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,68,68,0.15);
  color: #ff4444;
  padding: 3px 10px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid rgba(255,68,68,0.3);
  font-family: 'Orbitron', sans-serif;
}

.steal-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0,200,0,0.15);
  color: #00c851;
  padding: 3px 10px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid rgba(0,200,0,0.3);
  font-family: 'Orbitron', sans-serif;
}

.rare-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(170,0,255,0.15);
  color: #aa00ff;
  padding: 3px 10px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid rgba(170,0,255,0.3);
  font-family: 'Orbitron', sans-serif;
}

/* Stat card */
.stat-card {
  background: rgba(255,140,0,0.05);
  border: 1px solid rgba(255,140,0,0.15);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--panel-primary);
  font-family: 'Orbitron', sans-serif;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.7;
  font-family: 'Orbitron', sans-serif;
}

/* Command box */
.command-box {
  background: rgba(255,140,0,0.1);
  padding: 16px 20px;
  border-radius: 10px;
  margin: 20px 0;
  border-left: 4px solid #ff8c00;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.command-box code {
  font-size: 18px;
  font-weight: 700;
  color: #ff8c00;
  background: rgba(0,0,0,0.3);
  padding: 6px 15px;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
}

/* Important box */
.important-box {
  background: rgba(255,140,0,0.15);
  border-left: 4px solid #ff8c00;
  padding: 16px 20px;
  border-radius: 10px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.tip-box {
  background: rgba(0,200,0,0.1);
  border-left: 4px solid #00c851;
  padding: 16px 20px;
  border-radius: 10px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

/* List styles */
.custom-list {
  list-style: none;
  padding-left: 0;
}

.custom-list li {
  margin: 12px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
}

.custom-list li svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  stroke: #ff8c00;
  margin-top: 2px;
}

/* Feature grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 20px 0;
}

.feature-item {
  background: rgba(255,140,0,0.03);
  border: 1px solid rgba(255,140,0,0.1);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-item svg {
  stroke: var(--panel-primary);
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 20px 0;
}

.stat-item {
  background: rgba(255,140,0,0.05);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255,140,0,0.1);
}

.stat-item-value {
  font-size: 24px;
  font-weight: 700;
  color: #ff8c00;
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 5px;
}

.stat-item-label {
  font-size: 11px;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  opacity: 0.8;
}

/* Category container */
.category-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0 20px 0;
}

/* Divider */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,140,0,0.3), transparent);
  margin: 30px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 22px;
    gap: 10px;
  }
  
  .section-title svg {
    width: 26px;
    height: 26px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .command-box {
    flex-direction: column;
    align-items: flex-start;
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>

<!-- INTRO PANEL -->
<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  </div>
  <div class="panel-content">
    <span class="panel-number">!ws</span> <span class="highlight">Sistemul Avansat de WeaponSkins</span>
    <p>Bine ați venit la <span class="highlight">Noul Sistem de WeaponSkins</span>! Am reconstruit complet modul în care jucătorii interacționează cu skin-urile pe server, aducând o experiență de economie reală, stocuri limitate și un sistem de profil avansat, toate direct în CS2.</p>
    <p>Acest ghid este aici pentru a vă ajuta să înțelegeți cum funcționează sistemul și cum vă puteți construi colecția ideală de skin-uri.</p>
  </div>
</div>

<!-- divider -->
<div class="section-divider"></div>

<!-- 1.0 CUM ÎNCEPEM? -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>1.0 CUM ÎNCEPEM?</span>
</div>

<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  </div>
  <div class="panel-content">
    <p>Totul începe cu simpla comandă în chat:</p>
    <div class="important-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span><span class="highlight">IMPORTANT:</span> Scrie <code>!ws</code> în chat pentru a deschide meniul principal.</span>
    </div>
    <p>De îndată ce deschideți meniul, veți observa 3 secțiuni principale care structurează întregul sistem:</p>
    
  <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0;">
      <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
        <span><span class="highlight">Shop</span> - Magazinul de Skin-uri</span>
      </div>
      
   <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <line x1="8" y1="2" x2="8" y2="22"/>
        </svg>
        <span><span class="highlight">My Inventory</span> - Inventarul Meu</span>
      </div>
      
  <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span><span class="highlight">Profile</span> - Profilul și Statisticile</span>
      </div>
    </div>
  </div>
</div>

<!-- divider -->
<div class="section-divider"></div>

<!-- 2.0 MAGAZINUL (SHOP) -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>2.0 MAGAZINUL (SHOP)</span>
</div>

<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
  </div>
  <div class="panel-content">
    <p>Aici începe distracția. Shop-ul este locul din care achiziționați noi articole cosmetice pentru a ieși în evidență pe server. Există categorii pentru absolut tot:</p>
    
  <div class="category-container">
      <span class="category-badge">Arme</span>
      <span class="category-badge">Cuțite</span>
      <span class="category-badge">Mănuși</span>
      <span class="category-badge">Stickere</span>
      <span class="category-badge">Brelocuri</span>
      <span class="category-badge">Agenți</span>
    </div>
    <p style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Rifles, Pistols, SMGs, Heavies - toate sunt disponibile!</p>
  </div>
</div>

<!-- Economia și Prețurile Dinamice -->
<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
  </div>
  <div class="panel-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="orbitron-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
      </svg>
      Economia și Prețurile Dinamice
    </h3>
    <p>O altă inovație este sistemul de economie. Prețurile skin-urilor nu sunt alese la întâmplare; ele se bazează pe prețurile reale de pe <span class="highlight">Steam Community Market</span>.</p>
    <p>Pentru ca totul să fie și mai interesant, serverul ajustează prețurile în funcție de popularitatea skin-ului printre jucători:</p>
    
  <div style="display: flex; flex-direction: column; gap: 12px; margin: 15px 0;">
      <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(255,68,68,0.05); padding: 10px 15px; border-radius: 8px;">
        <span class="hot-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
          HOT
        </span>
        <span><span class="highlight"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="18 15 12 9 6 15"/></svg> HOT:</span> Dacă mulți jucători cumpără un anumit skin, prețul acestuia poate crește procentual (Markup). Fix ca în economia reală!</span> 
      </div>
      
  <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(0,200,0,0.05); padding: 10px 15px; border-radius: 8px;">
        <span class="steal-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          STEAL
        </span>
        <span><span class="highlight"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="18 15 12 9 6 15"/><path d="M2 2v20h20"/></svg> STEAL:</span> Dacă un skin nu a fost cumpărat de mult timp, prețul scade pentru a atrage cumpărători! Prinde oferta!</span>
      </div>
    </div>
    
  <p>De asemenea, veți întâlni frecvent <span class="highlight">reduceri generale</span> aplicate întregului magazin (ex: <code>-10% la toate cuțitele!</code>).</p>
  </div>
</div>

<!-- Sistemul de Stocuri -->
<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
    </svg>
  </div>
  <div class="panel-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="orbitron-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
      </svg>
      Sistemul de Stocuri
    </h3>
    <p>Acesta nu este un simplu meniu unde toată lumea alege aceleași 2 skin-uri la nesfârșit. Acum avem un sistem de stoc limitat:</p>
    
  <div style="display: flex; flex-direction: column; gap: 15px; margin: 15px 0;">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="rare-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Rare
        </span>
        <span>Anumite skin-uri au <code>X Left</code> (Ex: Au mai rămas doar 2 bucăți de AWP Dragon Lore pe server).</span>
      </div>
      
 <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="badge" style="background: rgba(100,100,100,0.2);">Sold Out</span>
        <span>Când stocul ajunge la zero, skin-ul devine automat <span class="highlight">Out of Stock</span> (Epuizat) și niciun alt jucător nu mai poate cumpăra acel skin. Va trebui să așteptați ca administratorii să facă restock-uri (poate prin giveaway-uri sau evenimente speciale).</span>
      </div>
      
 <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="badge">Nelimitat</span>
        <span>Unele skin-uri comune sau mai puțin căutate au stoc infinit.</span>
      </div>
    </div>
  </div>
</div>

<!-- Confirmarea Achiziției -->
<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  </div>
  <div class="panel-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="orbitron-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Confirmarea Achiziției
    </h3>
    <p>Nu veți cumpăra din greșeală un skin apăsând scurt un buton. Atunci când dați click pe un skin pe care doriți să-l achiziționați, se va deschide ecranul cu Detalii și Confirmare:</p>
    
  <ul class="custom-list">
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Se afișează numele <span class="highlight">Complet al Skin-ului</span>
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Prețul (inclusiv discount-urile active, tăiate sau verzi)
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Disponibilitatea Stocului actual
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Câți bani (Balanță) mai aveți în portofelul vostru
      </li>
    </ul>
    
 <div style="background: rgba(255,140,0,0.1); padding: 12px 15px; border-radius: 8px; margin-top: 10px;">
      <span>Abia apoi puteți da click pe <span class="badge" style="background: linear-gradient(135deg, #ff8c00, #cc7000); color: white;">Buy Now</span>.</span>
    </div>
  </div>
</div>

<!-- divider -->
<div class="section-divider"></div>

<!-- 3.0 INVENTARUL MEU -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/></svg>3.0 INVENTARUL MEU</span>
</div>

<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
    </svg>
  </div>
  <div class="panel-content">
    <p>După ce ați cumpărat un skin, sistemul îl echipează imediat! Dar skin-ul nu dispare la resetarea hărții – el este salvat forever. Intri pe server, joci o lună mai târziu, și skin-urile tale te așteaptă în <span class="highlight">My Inventory</span>.</p>
    
 <div style="background: rgba(255,140,0,0.05); padding: 15px; border-radius: 8px; margin: 15px 0;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
      </svg>
      <span>Aici veți găsi armele pe care deja ați dat bani. Nu mai puteți cumpăra același skin de două ori! În dreptul fiecărei alegeri deblocate veți regăsi starea <code>[✓]</code> indicând proprietatea dumneavoastră. Selectând un skin de aici, îl veți re-echipa dacă l-ați scos.</span>
    </div>
  </div>
</div>

<!-- Skin Properties -->
<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="panel-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="orbitron-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Skin Properties (Personalizare Avansată)
    </h3>
    <p>Din meniul de Inventar aveți acces la panoul de optimizare a bunurilor deținute. Vreți ca Asiimov-ul dvs. să fie impecabil sau zgâriat maxim în Battle-Scarred?</p>
    
  <div class="category-container" style="margin: 15px 0;">
      <span class="feature-badge">Float / Wear</span>
      <span class="feature-badge">Pattern</span>
      <span class="feature-badge">Nametag</span>
      <span class="feature-badge">StatTrak™</span>
    </div>
    
 <ul class="custom-list">
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="highlight">Float / Wear:</span> De la 0.00 Factory New la 1.00 Battle-Scarred
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="highlight">Pattern:</span> Modificați numărul generat pentru pattern (Foarte important la Case Hardened, Fade-uri, etc.)
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="highlight">Nametag:</span> Dați arme/cuțitului un nume custom
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="highlight">StatTrak™:</span> Permite activarea afișajului de kill-uri
      </li>
    </ul>
  </div>
</div>

<!-- divider -->
<div class="section-divider"></div>

<!-- 4.0 PROFILUL TĂU -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>4.0 PROFILUL TĂU</span>
</div>

<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="panel-content">
    <p>Acest modul vrea să strângă la un loc informațiile și performanța financiară a jucătorului. Intrând în panoul de profile veți vedea:</p>
    
 <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-item-value">1,000</div>
        <div class="stat-item-label">Balanță curentă</div>
      </div>
      <div class="stat-item">
        <div class="stat-item-value">5,000</div>
        <div class="stat-item-label">Total Spent</div>
      </div>
    </div>
    
  <ul class="custom-list">
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="highlight">Balanța curentă:</span> Numărul exact de monede disponibile (Se câștigă jucând regulat pe server, adunând puncte de xp, etc.)
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="highlight">Total Spent:</span> O evidență vizibilă pentru suma totală cheltuită vreodată în tot ecosistemul WeaponSkins
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="highlight">Cel mai Scump Skin (Best):</span> Sistemul detectează automat pe care item din inventarul tău s-au cheltuit cei mai mulți bani ("Bijuteria Coroanei"). Va fi afișat colorat, pe un soclu virtual, vizibil și în acest sub-meniu
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="highlight">Piese Deținute:</span> Numărul total de cutii virtuale/produse fizice adjudecate în magazin
      </li>
    </ul>
    
  <div class="tip-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="highlight">TIP:</span> Explorați meniurile constant, strângeți credite, vânați ofertele <span class="steal-badge" style="display: inline-flex;">STEAL</span> și nu ratați stocurile limitate pentru cele mai rare lame!</span>
    </div>
  </div>
</div>

<!-- INFO BOX -->
<div class="info-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="highlight">Vă dorim spor la fragmentat</span> și la strâns colecții unice pe server!</span>
    </li>
  </ul>
</div>