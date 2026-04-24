---
outline: deep
---

<CaseHeader 
  title="Regulament VIP"
  :tags="[
    { text: 'vip', component: 'PageTagYellow' },
    { text: 'rules', component: 'PageTagRed' },
    { text: 'server', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Informatii', 'Regulament', 'GO', 'VIP']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="regulament-vip"
  badge-text="Rules"
/>

<!-- STILURI CU SUPORT LIGHT/DARK THEME -->
<style>
.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* ===== FONT ORBITRON PENTRU TITLURI SI ELEMENTE IMPORTANTE ===== */
.section-title,
.section-title span,
.rule-number,
.highlight,
.badge,
.badge-warn,
.badge-remove,
.badge-recommended,
.punish,
.info-box li span .highlight,
.rule-content strong,
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
.rule-card .badge,
.rule-card .badge-warn,
.rule-card .badge-remove,
.rule-card .badge-recommended,
.rule-card .punish,
.info-box .highlight {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* Ajustari greutati - pastram dimensiunile originale */
.section-title {
  font-weight: 700;
  font-size: 28px;
}

.section-title span {
  font-weight: 800;
}

.rule-number {
  font-weight: 600;
  font-size: 13px;
}

.highlight {
  font-weight: 600;
}

.badge {
  font-weight: 500;
  font-size: 12px;
}

.badge-warn {
  font-weight: 700;
  font-size: 12px;
}

.badge-remove {
  font-weight: 700;
  font-size: 12px;
}

.badge-recommended {
  font-weight: 700;
  font-size: 12px;
}

.punish {
  font-weight: 700;
  font-size: 12px;
}

.title-hover span {
  font-weight: 800;
  font-size: 28px;
}

h1 {
  font-weight: 700;
  font-size: 32px;
}

/* Fortam fontul pe titlul principal */
h1.orbitron-font,
.title-hover .orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
}

/* Variabile CSS pentru ambele teme */
:root {
  --rule-card-bg: linear-gradient(145deg, #0f0f0f, #141414);
  --rule-card-border: rgba(255,140,0,0.2);
  --rule-text: #e0e0e0;
  --rule-badge-bg: #1e1e1e;
  --rule-badge-border: rgba(255,255,255,0.1);
  --rule-highlight: #ffae42;
  --rule-punish-bg: #ff3c3c;
  --rule-punish-text: white;
  --info-box-bg: rgba(255,140,0,0.06);
  --info-box-border: rgba(255,140,0,0.25);
  --section-title-color: #ff8c00;
  --section-divider: linear-gradient(90deg, transparent, rgba(255,140,0,0.3), transparent);
  --rule-number-bg: rgba(255,140,0,0.15);
  --rule-number-border: rgba(255,140,0,0.3);
  --rule-number-text: #ff8c00;
}

/* Light theme override */
html:not(.dark) {
  --rule-card-bg: linear-gradient(145deg, #f8f8f8, #ffffff);
  --rule-card-border: rgba(255,140,0,0.3);
  --rule-text: #333333;
  --rule-badge-bg: #f0f0f0;
  --rule-badge-border: rgba(0,0,0,0.1);
  --rule-highlight: #ff8c00;
  --rule-punish-bg: #ff5555;
  --rule-punish-text: white;
  --info-box-bg: rgba(255,140,0,0.04);
  --info-box-border: rgba(255,140,0,0.2);
  --section-title-color: #ff8c00;
  --section-divider: linear-gradient(90deg, transparent, rgba(255,140,0,0.4), transparent);
  --rule-number-bg: rgba(255,140,0,0.1);
  --rule-number-border: rgba(255,140,0,0.3);
  --rule-number-text: #ff8c00;
}

/* SVG-uri în dark mode - DOAR ALBE */
.dark .nav-icon,
.dark .rule-icon svg,
.dark .section-title svg,
.dark .info-box li svg {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

/* SVG-uri în light mode */
:not(.dark) .nav-icon,
:not(.dark) .rule-icon svg,
:not(.dark) .section-title svg,
:not(.dark) .info-box li svg {
  filter: brightness(0.4);
  opacity: 0.8;
}

/* PREVENIRE SELECTARE IMAGINI SI ICONITE */
img, svg, .rule-icon, .rule-icon svg, .nav-icon, [class*="icon"] {
  user-select: none !important;
  -webkit-user-select: none !important;
  -webkit-user-drag: none !important;
  user-drag: none !important;
  pointer-events: none !important;
}

/* GRID RULES */
.rules-grid {
  display:flex;
  flex-direction:column;
  gap:14px;
  margin-top:20px;
}

/* CARD */
.rule-card {
  background: var(--rule-card-bg);
  border:1px solid var(--rule-card-border);
  padding:18px;
  border-radius:14px;
  transition:.25s;
  line-height:1.6;
  color: var(--rule-text);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.rule-card:hover {
  transform:translateY(-3px);
  border-color:#ff8c00;
  box-shadow:0 8px 25px rgba(0,0,0,.15);
}

/* Icon container for rule cards */
.rule-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: rgba(255,140,0,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--rule-card-border);
}

.rule-content {
  flex: 1;
}

/* BADGES */
.punish {
  display:inline-block;
  background: var(--rule-punish-bg);
  color: var(--rule-punish-text);
  font-weight:700;
  padding:4px 9px;
  border-radius:6px;
  font-size:12px;
  margin: 2px 3px;
  border: none;
  box-shadow: 0 2px 5px rgba(255,0,0,0.2);
}

.badge {
  display:inline-block;
  background: var(--rule-badge-bg);
  border:1px solid var(--rule-badge-border);
  color: var(--rule-text);
  padding:3px 8px;
  border-radius:6px;
  font-size:12px;
  margin: 2px 3px;
  font-weight: 500;
}

.badge-warn {
  display:inline-block;
  background: #ff8c00;
  color: white;
  font-weight:700;
  padding:4px 9px;
  border-radius:6px;
  font-size:12px;
  margin: 2px 3px;
  border: none;
}

.badge-remove {
  display:inline-block;
  background: #ff3c3c;
  color: white;
  font-weight:700;
  padding:4px 9px;
  border-radius:6px;
  font-size:12px;
  margin: 2px 3px;
  border: none;
}

.badge-recommended {
  display:inline-block;
  background: #2ecc71;
  color: white;
  font-weight:700;
  padding:4px 9px;
  border-radius:6px;
  font-size:12px;
  margin: 2px 3px;
  border: none;
}

/* highlight */
.highlight {
  color: var(--rule-highlight);
  font-weight:600;
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
  margin-top:30px;
  background: var(--info-box-bg);
  border:1px solid var(--info-box-border);
  border-radius:14px;
  padding:22px;
  line-height:1.7;
  color: var(--rule-text);
}

/* Stil pentru titlurile de sectiune */
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
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.section-title:hover {
  transform: translateX(5px);
  transition: transform 0.3s ease;
}

.section-title:hover svg {
  transform: scale(1.15) rotate(3deg);
}

.section-title span {
  background: linear-gradient(135deg, #ff8c00, #ff4400);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  color: #ff8c00;
  line-height: 1.2;
}

/* Stil pentru numărul regulii */
.rule-number {
  display: inline-block;
  background: var(--rule-number-bg);
  color: var(--rule-number-text);
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 10px;
  margin-bottom: 5px;
  border: 1px solid var(--rule-number-border);
}

/* Separator linie */
.section-divider {
  height: 1px;
  background: var(--section-divider);
  margin: 30px 0;
}

/* Lista pentru info-box */
.info-box ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.info-box li {
  margin-bottom: 16px;
  color: var(--rule-text);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-box li svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  stroke: var(--rule-highlight);
  fill: none;
  margin-top: 2px;
}

/* Hover effect pentru titluri personalizate */
.title-hover:hover {
  transform: translateX(5px);
}

/* Responsive */
@media (max-width: 768px) {
  .rule-card {
    padding: 15px;
    flex-direction: column;
    gap: 8px;
  }
  
  .badge, .punish, .badge-warn, .badge-remove, .badge-recommended {
    margin-top: 3px;
    margin-bottom: 3px;
  }
  
  .section-title {
    font-size: 22px;
    gap: 10px;
  }
  
  .section-title svg {
    width: 26px;
    height: 26px;
  }
}

/* Tooltip pentru hover */
.rule-card:hover .rule-icon svg {
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>

<!-- ================================================ -->
<!-- REGULAMENT VIP - TOATE REGULILE -->
<!-- ================================================ -->

<!-- CAP. I | Reguli generale VIP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><circle cx="12" cy="12" r="2" fill="#ff8c00"/></svg>CAP. I | Reguli generale VIP</span>
</div>

<div class="rules-grid">

<!-- 1.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.1</span> Detinatorii de VIP nu trebuie sa abuzeze de privilegiile de care dispun si nu se considera ca au imunitate in fata sanctiunilor sau a staff-ului.
  </div>
</div>

<!-- 1.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.2</span> VIP-ul este un <span class="highlight orbitron-font">privilegiu</span>, nu un drept. Folositi-l cu responsabilitate.
  </div>
</div>

<!-- 1.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.3</span> VIP-urile sunt considerate <span class="highlight orbitron-font">exemple pentru comunitate</span>, comportamentul vostru influenteaza intregul server.
  </div>
</div>

<!-- 1.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.4</span> Nu este permis <span class="highlight orbitron-font">transferul sau impartirea</span> accesului de VIP cu alte persoane.
  </div>
</div>

<!-- 1.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.5</span> In calitate de VIP, este <span class="highlight orbitron-font">recomandat</span> sa indrumati si sa ajutati alti jucatori.
  </div>
</div>

<!-- 1.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.6</span> <span class="highlight orbitron-font">Raportati</span> orice abuz al altor VIP-uri, contribuiti la o comunitate mai buna.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. II | Abuz Double Jump -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>CAP. II | Abuz Double Jump</span>
</div>

<div class="rules-grid">

<!-- 2.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.1</span> Este strict interzisa folosirea double jump-ului pentru a ajunge in <span class="highlight orbitron-font">locuri inaccesibile</span> in mod normal pe mapa. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 2.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.2</span> Este strict interzisa folosirea double jump-ului pentru a sari peste <span class="highlight orbitron-font">anti-rush-uri sau bariere</span>. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 2.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.3</span> Este strict interzisa folosirea double jump-ului pentru a exploata zone ale mapei care ofera un <span class="highlight orbitron-font">avantaj nedrept</span> asupra oponentilor. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 2.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.4</span> In cazul in care abuzul de double jump continua dupa aplicarea warn-ului, sanctiunea va fi <span class="highlight orbitron-font">agravata</span>. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. III | Abuz Sank Sounds -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>CAP. III | Abuz Sank Sounds</span>
</div>

<div class="rules-grid">

<!-- 3.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.1</span> Nu este permis <span class="highlight orbitron-font">spam-ul in chat</span> cu sunete (Sank Sounds). <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 3.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.2</span> Sank Sounds trebuie folosite intr-o maniera care <span class="highlight orbitron-font">sa nu deranjeze</span> alti jucatori.
  </div>
</div>

<!-- 3.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.3</span> In cazul in care spam-ul continua dupa avertisment, sanctiunea va fi <span class="highlight orbitron-font">agravata</span>. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. IV | Info COD / VAC BAN -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>CAP. IV | Info COD / VAC BAN</span>
</div>

<div class="rules-grid">

<!-- 4.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.1</span> Daca jucati cu COD si primiti VAC, o faceti pe <span class="highlight orbitron-font">propria raspundere</span>. Gradele nu se transfera sau returneaza.
  </div>
</div>

<!-- 4.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.2</span> Daca doriti sa jucati cu COD, faceti asta pe un <span class="highlight orbitron-font">cont secundar</span> si in afara serverelor WILDFIRE.
  </div>
</div>

<!-- 4.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.3</span> Utilizarea codurilor pe contul primar sau secundar pe serverele WILDFIRE se pedepseste cu <span class="badge-remove orbitron-font">REMOVE</span> la grad.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. V | Sanctiuni -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="9" r="4"/><path d="M12 12v3M12 18v.01"/></svg>CAP. V | Sanctiuni</span>
</div>

<div class="rules-grid">

<!-- 5.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.1</span> La <span class="highlight orbitron-font">2/3 warn-uri</span> veti fi sanctionati cu <span class="punish orbitron-font">BAN 24 ORE</span> si pierderea gradului pentru <span class="highlight orbitron-font">7 zile</span>.
  </div>
</div>

<!-- 5.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.2</span> La <span class="highlight orbitron-font">3/3 warn-uri</span> veti fi sanctionati cu <span class="punish orbitron-font">BAN 48 ORE</span> si pierderea gradului pentru <span class="highlight orbitron-font">30 zile</span>.
  </div>
</div>

<!-- 5.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.3</span> In cazuri speciale unde abuz continua si dupa warn-ul 3, puteti ramane <span class="badge-remove orbitron-font">FARA GRAD PERMANENT</span>.
  </div>
</div>

<!-- 5.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.4</span> Instigarea altor jucatori la incalcarea regulilor: <span class="badge-remove orbitron-font">REMOVE GRAD</span> + <span class="punish orbitron-font">SUSPENDARE</span>.
  </div>
</div>

<!-- 5.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.5</span> Daca un VIP este prins in flagrant incercand sa influenteze negativ alti jucatori sau sa instige la incalcarea regulilor: <span class="badge-remove orbitron-font">REMOVE</span>.
  </div>
</div>

<!-- 5.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.6</span> Comportament toxic sau instigare la conflicte: <span class="badge-remove orbitron-font">3/3 REMOVE</span>.
  </div>
</div>

<!-- 5.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.7</span> Injurarea altor jucatori sau membri ai staff-ului pe server sau Discord: <span class="punish orbitron-font">30 ZILE</span>.
  </div>
</div>

<!-- 5.8 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.8</span> Folosirea bug-urilor pentru a obtine avantaje: <span class="punish orbitron-font">30-60 ZILE</span>.
  </div>
</div>

<!-- 5.9 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.9</span> Limbaj ofensiv pe server sau Discord (insulte, jigniri): <span class="punish orbitron-font">30 ZILE</span>.
  </div>
</div>

<!-- 5.10 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.10</span> <span class="highlight orbitron-font">Suspensii temporare:</span> In functie de gravitatea comportamentului, VIP-ul poate fi suspendat temporar.
  </div>
</div>

<!-- 5.11 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.11</span> Dupa <span class="highlight orbitron-font">3 avertismente</span> acumulate, statutul VIP va fi revocat automat. <span class="badge-remove orbitron-font">REMOVE</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. VI | Apel -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>CAP. VI | Apel</span>
</div>

<div class="rules-grid">

<!-- 6.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.1</span> In cazul in care un VIP considera ca avertismentul este aplicat gresit, acesta poate face <span class="highlight orbitron-font">apel</span> la un membru al staff-ului.
  </div>
</div>

<!-- 6.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.2</span> Fiecare avertisment va fi evaluat cu <span class="highlight orbitron-font">atentie si obiectivitate</span>, pe baza dovezilor disponibile.
  </div>
</div>

<!-- 6.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.3</span> Scopul acestui sistem de avertismente este de a mentine un mediu de joc <span class="highlight orbitron-font">placut si echitabil</span> pentru toti membrii comunitatii.
  </div>
</div>

</div>

<div class="section-divider"></div>

