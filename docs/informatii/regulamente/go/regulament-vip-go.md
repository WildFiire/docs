---
outline: deep
---

<!-- Background image container -->
<div style="position: relative; overflow: hidden; border-radius: 24px; margin-bottom: 20px; min-height: 180px; background-color: var(--vp-c-bg);">

<!-- Background image layer cu BLUR și PARALLAX -->
<div style="position: absolute; top: -20px; left: -20px; right: -20px; bottom: -20px; z-index: 0; filter: blur(5px) brightness(var(--bg-brightness, 0.7)); transform: scale(1.1);">
  <img src="/wallpaper/backgroundwf.webp" alt="background" style="width: 100%; height: 100%; object-fit: cover; opacity: var(--bg-opacity, 0.4);">
</div>

<!-- Content layer -->
<div style="position: relative; z-index: 1; padding: 30px 30px 20px 30px; border-radius: 24px;">

<!-- RÂND 0 - path și introduction -->
<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 5px; font-size: 12px; color: var(--vp-c-text-2); flex-wrap: wrap; opacity: 0.9;">
  <div style="display: flex; align-items: center; gap: 5px;">
    <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Home</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Informatii</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Regulament</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-brand-1);" class="orbitron-font">GO</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-text-2);" class="orbitron-font">VIP</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 6px;">
    <img src="/icons/introduction.svg" alt="introduction" class="nav-icon" style="width: 18px; height: 18px; filter: var(--icon-filter, none);">
    <span style="font-size: 12px; color: var(--vp-c-text-2);" class="orbitron-font">Rules</span>
  </div>
</div>

<!-- RÂND 1 - logo și titlu -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
  <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
  
  <!-- TITLU CU GRADIENT ANIMAT -->
  <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: gradientShift 6s ease infinite; font-weight: 700;" class="orbitron-font">
    Regulament VIP
  </h1>
</div>

<!-- RAND 2 - tags si updated by JOS, pe acelasi rand -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">

  <!-- Tags in stanga -->
  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
    <PageTagRed style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">rules</PageTagRed>
    <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">go</PageTagBlue>
    <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">server</PageTagBlue>
  </div>

  <!-- Updated by in dreapta -->
  <div style="display: flex; align-items: center; gap: 6px;">
    <span style="font-size: 13px; color: var(--wf-gray); font-weight: 500;" class="orbitron-font">updated by</span>
    <a 
      href="https://github.com/ianncxd" 
      target="_blank" 
      class="github-profile"
      data-username="ianncxd"
      data-tags="show-wildfire show-dev show-wiki show-staff   "
      style="display: block; padding: 2px; background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6); border-radius: 50%;" 
      title="ianncxd"
    >
      <img src="https://github.com/ianncxd.png" alt="ianncxd" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid #1a1a1a; display: block; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
    </a>
  </div>

</div>

</div> 
</div>

<!-- STILURI CU SUPORT LIGHT/DARK THEME -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* ===== FONT ORBITRON PENTRU TITLURI ȘI ELEMENTE IMPORTANTE ===== */
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

/* Ajustări greutăți - păstrăm dimensiunile originale */
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

/* Forțăm fontul pe titlul principal */
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

<!-- 1.0 REGULI VIP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    
  </div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="#ff8c00"/></svg>1.0 REGULI VIP</span>
</div>

<div class="rules-grid">

<!-- 1.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="#ff8c00"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.1</span> Donatorii nu trebuie sa abuzeze de abilitatiile de care au parte si in nici un caz, acestia nu trebuie sa considere ca au imunitate in fata sanctiunilor. <span class="badge-warn orbitron-font">WARN</span> / <span class="badge-remove orbitron-font">REMOVE</span>
  </div>
</div>

<!-- 1.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.2</span> In calitate de Donator nu trebuie sa consideri ca ai imunitate in fata staff-ului sau chiar si a jucatorilor. <span class="badge-warn orbitron-font">WARN</span>
  </div>
</div>

<!-- 1.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.3</span> Donatoriilor nu le este permis sa se urce pe mapa astfel având un avantaj asupra oponentului. <span class="badge-warn orbitron-font">WARN</span>
  </div>
</div>

<!-- 1.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.4</span> Nu este permis spam-ul in chat cu sunete <span class="highlight orbitron-font">(Sank Sounds)</span> <span class="badge-warn orbitron-font">WARN</span>
  </div>
</div>

<!-- 1.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.5</span> In calitate de donator va este recomandat sa indrumati sau sa ajutati alt jucatori. <span class="badge-recommended orbitron-font">RECOMANDAT</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- 2.0 INFO -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    
  </div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>2.0 INFO</span>
</div>

<div class="rules-grid">

<!-- 2.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.1</span> <span class="highlight orbitron-font">Daca jucati cu COD si primiti VAC, o faceti pe propria raspundere</span>, gradele nu se transfera/returneaza.
  </div>
</div>

<!-- 2.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.2</span> <span class="highlight orbitron-font">Daca doriti sa jucati cu COD, faceti asta pe un cont secundar</span> si inafara serverelor WILDFIRE.
  </div>
</div>

<!-- 2.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.3</span> Utilizarea codurilor pe contul primar sau secundar pe serverele WILDFIRE se pedepseste cu <span class="badge-remove orbitron-font">REMOVE</span> la grad.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- 3.0 SANCTIUNI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    
  </div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>3.0 SANCTIUNI</span>
</div>

<div class="rules-grid">

<!-- 3.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.1</span> La <span class="highlight orbitron-font">2/3 warn-uri</span> o sa fiti sanctionati cu <span class="punish orbitron-font">BAN 24 ORE</span> si pierderea gradului pentru <span class="highlight orbitron-font">7 zile</span>.
  </div>
</div>

<!-- 3.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.2</span> La <span class="highlight orbitron-font">3/3 warn-uri</span> o sa fiti sanctionati cu <span class="punish orbitron-font">BAN 48 ORE</span> si pierderea gradului pentru <span class="highlight orbitron-font">30 zile</span>.
  </div>
</div>

<!-- 3.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.3</span> In cazuri speciale unde abuzul de Premium continua si dupa aplicarea warn-ului cu numarul 3 puteti ramane <span class="badge-remove orbitron-font">FARA GRAD PERMANENT</span>.
  </div>
</div>

</div>

<!-- ================================================ -->
<!-- 4.0 WARN-LIST PREMIUM -->
<!-- ================================================ -->

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    
  </div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-linejoin="round"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>4.0 WARN-LIST PREMIUM</span>
</div>

<div class="rules-grid">

<!-- 4.1 Motive pentru Crearea Warn-List -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.1</span> <span class="highlight orbitron-font">Motive pentru Crearea Warn-List:</span> Warn-list pentru PREMIUM-uri este creat pentru a gestiona comportamentele inadecvate ale acestora. <span class="badge-warn orbitron-font">WARN</span>
  </div>
</div>

<!-- 4.2 Abuzarea privilegiilor -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.2</span> Abuzarea privilegiilor PREMIUM (ex: utilizarea abilităților PREMIUM pentru a obține avantaje nedrepte) <span class="punish orbitron-font">30 ZILE</span>
  </div>
</div>

<!-- 4.3 Injurarea -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.3</span> Injurarea altor jucători sau membri ai staff-ului pe server sau Discord <span class="punish orbitron-font">30 ZILE</span>
  </div>
</div>

<!-- 4.4 Folosirea bug-urilor -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.4</span> Folosirea bug-urilor pentru a obține avantaje <span class="punish orbitron-font">30-60 ZILE</span>
  </div>
</div>

<!-- 4.5 Comportament toxic -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 9h8M8 15h8"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.5</span> Comportament toxic sau instigarea la conflicte pe server <span class="badge-remove orbitron-font">3/3 REMOVE</span>
  </div>
</div>

<!-- 4.6 Alte comportamente -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.6</span> Alte comportamente care încalcă regulile comunității și afectează experiența celorlalți jucători <span class="badge-warn orbitron-font">WARN</span>
  </div>
</div>

<!-- 4.7 Statut PREMIUM -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.7</span> PREMIUM-urile sunt considerate membri importanți ai comunității, însă acest statut nu le conferă libertatea de a încălca regulile serverului. <span class="badge-warn orbitron-font">INFO</span>
  </div>
</div>

<!-- 4.8 Evaluare obiectivă -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.8</span> Fiecare avertisment va fi evaluat cu atenție și obiectivitate, pe baza dovezilor disponibile.
  </div>
</div>

<!-- 4.9 Flagrant -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.9</span> Dacă un PREMIUM este prins în flagrant încercând să influențeze negativ alți jucători sau să instige la încălcarea regulilor - <span class="badge-remove orbitron-font">REMOVE</span>
  </div>
</div>

<!-- 4.10 Abuz comenzi -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.10</span> Abuzul comenzilor PREMIUM (ex: folosirea abilităților pentru a crea avantaje nedrepte) <span class="punish orbitron-font">30 ZILE</span>
  </div>
</div>

<!-- 4.11 Limbaj ofensiv -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.11</span> Limbaj ofensiv pe server sau Discord (ex: insulte, jigniri) <span class="punish orbitron-font">30 ZILE</span>
  </div>
</div>

<!-- 4.12 Comportament toxic / instigare -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 9h8M8 15h8"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.12</span> Comportament toxic / instigare la conflicte <span class="badge-remove orbitron-font">3/3 REMOVE</span>
  </div>
</div>

<!-- 4.13 Folosire bug-uri -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.13</span> Folosirea bug-urilor pentru avantaje <span class="punish orbitron-font">30-60 ZILE</span>
  </div>
</div>

<!-- 4.14 Instigare -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.14</span> Instigarea altor jucători la încălcarea regulilor <span class="badge-remove orbitron-font">REMOVE GRAD</span> + <span class="punish orbitron-font">SUSPENDARE</span>
  </div>
</div>

<!-- 4.15 Retrogradare -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.15</span> Retrogradarea PREMIUM-ului: După 3 avertismente acumulate, statutul PREMIUM va fi revocat automat. <span class="badge-remove orbitron-font">REMOVE</span>
  </div>
</div>

<!-- 4.16 Suspensii temporare -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.16</span> Suspensii temporare: În funcție de gravitatea comportamentului, PREMIUM-ul poate fi suspendat temporar. <span class="punish orbitron-font">SUSPENDARE</span>
  </div>
</div>

<!-- 4.17 Scopul sistemului -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.17</span> Scopul acestui sistem de avertismente este de a menține un mediu de joc plăcut și echitabil pentru toți membrii comunității.
  </div>
</div>

<!-- 4.18 Apel -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
      <path d="M14 2v6h6"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.18</span> În cazul în care un PREMIUM consideră că avertismentul este aplicat greșit, acesta poate apela la un membru al staff-ului. <span class="badge-recommended orbitron-font">APEL</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- ================================================ -->
<!-- 5.0 RECOMANDĂRI (FOSTA 4.0) -->
<!-- ================================================ -->

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    
  </div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>5.0 RECOMANDĂRI</span>
</div>

<div class="info-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="highlight orbitron-font">Donatorii sunt exemple pentru comunitate</span> - comportamentul vostru influențează întregul server.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 2v6h6"/>
      </svg>
      <span>Beneficiile VIP sunt un <span class="highlight orbitron-font">privilegiu</span>, nu un drept - folosiți-le cu responsabilitate.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      <span>Raportați orice abuz al altor donatori - <span class="highlight orbitron-font">contribuiți la o comunitate mai bună</span>.</span>
    </li>
  </ul>
</div>

<div class="section-divider"></div>
