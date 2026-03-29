---
outline: deep
---

<CaseHeader 
  title="Regulament STAFF"
  :tags="[
    { text: 'staff', component: 'PageTagPurple' },
    { text: 'rules', component: 'PageTagRed' },
    { text: 'server', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Informatii', 'Regulament', 'GO', 'STAFF']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  updated-by-username="iannc69"
  page-id="regulament-staff"
  badge-text="Rules"
/>

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
  
  .badge, .punish, .badge-warn, .badge-remove {
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
<!-- REGULAMENT STAFF - TOATE REGULILE -->
<!-- ================================================ -->

<!-- 1.0 REGULI GENERALE STAFF -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>1.0 REGULI GENERALE STAFF</span>
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
    <span class="rule-number orbitron-font">1.1</span> Adminii trebuie să aibă un comportament exemplar pe server, să respecte regulamentul și să păstreze un limbaj adecvat rolului.
  </div>
</div>

<!-- 1.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.2</span> Dacă între staff apare un conflict, acesta trebuie discutat cu <span class="highlight orbitron-font">Server Manager-ul</span>.
  </div>
</div>

<!-- 1.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.3</span> Este <span class="highlight orbitron-font">STRICT INTERZIS</span> să debanați un jucător care a fost banat de un alt admin. <span class="badge-remove orbitron-font">Sancțiune: REMOVE</span>
  </div>
</div>

<!-- 1.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.4</span> Este <span class="highlight orbitron-font">STRICT INTERZISĂ</span> înstrăinarea sau folosirea de către mai multe persoane a contului de admin! (indiferent că e frate, soră, etc.)
  </div>
</div>

<!-- 1.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.5</span> În cazul în care veți lipsi mai mult <span class="highlight orbitron-font">de 3 zile</span>, sunteți obligați să anunțați <span class="highlight orbitron-font">Server Manager-ul</span> sau să postați absența pe server-ul de discord destinat administrarii <span class="highlight orbitron-font">(GO, AWP, Arena)</span> cu motivul și perioada acesteia.
  </div>
</div>

<!-- 1.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.6</span> Adminii au dreptul de a folosi accesele care le revin în scopul de a aplica sancțiuni numai în conformitate cu regulamentul si ghidul impus.
  </div>
</div>

<!-- 1.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.7</span> Indiferent de sancțiunea aplicată, adminul trebuie să informeze jucătorul cu privire la regula încălcată. <span class="badge-warn orbitron-font">Sancțiune: WARN</span>
  </div>
</div>

<!-- 1.8 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.8</span> Dacă un admin constată o încălcare a regulamentului, dar nu deține accesele necesare pentru a lua măsuri, trebuie să informeze imediat stafful pe canalul de discord! <span class="badge-warn orbitron-font">Sancțiune: WARN</span>
  </div>
</div>

<!-- 1.9 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
      <path d="M14 2v6h6"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.9</span> Adminii au obligația să citească zilnic postările noi pe discord la categoria <span class="highlight orbitron-font">Informatii</span>. Aceștia trebuie să fie mereu la curent cu regulamentul.
  </div>
</div>

<!-- 1.10 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.10</span> Orice admin are obligația de a ajuta orice jucător în cazul în care acesta îi semnalează o problemă.
  </div>
</div>

<!-- 1.11 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.11</span> Adminii nu au voie să ofere favoruri indiferent de natura situației! <span class="badge-remove orbitron-font">Sancțiune: REMOVE</span>
  </div>
</div>

<!-- 1.12 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.12</span> Dacă un admin are cunoștință de existența unui bug, este obligat să sesizeze imediat <span class="highlight orbitron-font">Developer-ul!</span> <span class="badge-warn orbitron-font">Sancțiune: WARN</span>
  </div>
</div>

<!-- 1.13 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.13</span> În caz că un admin primește <span class="highlight orbitron-font">BAN pe discord</span>, adminul respectiv nu mai poate deține un grad pe server! <span class="badge-remove orbitron-font">Sancțiune: REMOVE</span>
  </div>
</div>

<!-- 1.14 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M4 4L20 20M20 4L4 20" stroke="#ff8c00"/>
      <path d="M12 4C10 4 8 6 8 8C8 10 12 14 12 14C12 14 16 10 16 8C16 6 14 4 12 4Z" stroke="#ff8c00" fill="none"/>
      <circle cx="12" cy="16" r="2" stroke="#ff8c00"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.14</span> În caz că un admin primește <span class="highlight orbitron-font">VAC BAN/Game Ban(STRICT PE CS2)</span>, adminul respectiv nu mai poate deține un grad pe server!<span class="badge-remove orbitron-font">Sancțiune: REMOVE</span>
  </div>
</div>

<!-- 1.15 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="9" stroke="#ff8c00"/>
      <path d="M12 7v5l3 3" stroke="#ff8c00"/>
      <path d="M12 5v2M12 15v2" stroke="#ff8c00" stroke-width="3"/>
      <path d="M5 12H3M21 12H19" stroke="#ff8c00"/>
      <rect x="2" y="2" width="20" height="20" rx="2" stroke="#ff8c00" stroke-dasharray="2 2"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.15</span> Durata maxima a unei sanctiuni, pe care un <span class="highlight orbitron-font">Helper</span> o poate da, este de <span class="highlight orbitron-font">60 de minute</span>, se permite o durata mai mare doar cu acordul unui <span class="highlight orbitron-font">Administrator+</span>. Iar pentru gradul de <span class="highlight orbitron-font">Moderator</span>, durata maxima este de <span class="highlight orbitron-font">120 de minute</span>, se permite o durata mai mare doar cu acordul unui <span class="highlight orbitron-font">Administrator+</span>.<span class="badge-warn orbitron-font">Sancțiune: WARN</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- 2.0 REGULI DE CONDUITĂ -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/></svg>2.0 REGULI DE CONDUITĂ</span>
</div>

<div class="rules-grid">

<!-- 2.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.1</span> Adminilor le <span class="highlight orbitron-font">este interzisă</span> folosirea comenzilor împotriva altor admini!
  </div>
</div>

<!-- 2.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.2</span> Adminilor le <span class="highlight orbitron-font">este strict interzis</span> să intervină peste comenzile altor admini!
  </div>
</div>

<!-- 2.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.3</span> În aplicarea sancțiunilor, adminii vor lua în considerare următorii factori: gravitatea situației, antecedentele jucătorului și starea de spirit din momentul respectiv. Se interzice acordarea directă a unor sancțiuni majore (ban), cu excepția cazurilor în care este absolut necesar sau dacă regulamentul prevede acest lucru.
  </div>
</div>

<!-- 2.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.4</span> Adminilor nu le este permis să stea AFK pe server.<span class="badge-warn orbitron-font">Sancțiune: WARN</span>
  </div>
</div>

<!-- 2.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
      <path d="M14 2v6h6"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.5</span> Dovezile se țin în PC 10 zile!
  </div>
</div>

<!-- 2.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.6</span> Activitatea pe discord este obligatorie! Adminul care nu activează pe discord este <span class="badge-warn orbitron-font">sancționat cu WARN!</span>
  </div>
</div>

<!-- 2.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.7</span> Fiecare admin trebuie să își îndeplinească targetul de <span class="highlight orbitron-font">30 de ore lunar per admin</span>. Cel care nu respectă targetul va fi pedepsit cu <span class="badge-warn orbitron-font">WARN!</span>
  </div>
</div>

<!-- 2.8 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.8</span> Este interzisă administrarea pe alte servere din afara comunității. <span class="badge-remove orbitron-font">Sancțiune: REMOVE!</span>
  </div>
</div>

<!-- 2.9 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.9</span> Testarea în exces a comenzilor de helper/moderator/admin/etc. atrage după sine primirea unui <span class="badge-warn orbitron-font">WARN!</span>
  </div>
</div>

<!-- 2.10 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.10</span> Este opțională folosirea <span class="highlight orbitron-font">discordului</span> ca mijloc de comunicare în timpul activității pe server.
  </div>
</div>

<!-- 2.11 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.11</span> Adminii care sunt pe server inactivi sunt pasibili de <span class="badge-warn orbitron-font">WARN!</span>
  </div>
</div>

<!-- 2.12 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.12</span> Sancționările cu ban permanent/temporar de către admini având un motiv neclar, neconcludent vor fi penalizate cu <span class="badge-warn orbitron-font">WARN!</span>
  </div>
</div>

<!-- 2.13 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.13</span> Înainte de a bana un jucător pentru utilizarea unui VPN, acesta trebuie avertizat de 3 ori să reintre pe server fără VPN. Dacă jucătorul nu se conformează regulamentului ulterior, poate primi o interdicție (ban) de 7 zile.
  </div>
</div>

<!-- 2.14 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a15 15 0 0 0 0 20 15 15 0 0 0 0-20z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.14</span> Începând cu ora <span class="highlight orbitron-font">12:00 AM → 07:00 AM</span>, vă recomandăm să adoptați o atitudine mai conciliantă față de jucătorii care folosesc un limbaj vulgar, având în vedere faptul că, după această oră, numărul copiilor activi pe server scade considerabil. Astfel, vom permite, într-o măsură rezonabilă, anumite glume și expresii vulgare, cu condiția ca acestea să rămână în limita unui comportament decent și a bunului simț.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- 3.0 RESPONSABILITĂȚI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>3.0 RESPONSABILITĂȚI</span>
</div>

<div class="info-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="highlight orbitron-font">Staff-ul este acolo pentru comunitate</span>, nu invers. Responsabilitatea voastră principală este să asigurați o experiență plăcută pentru toți jucătorii.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 2v6h6"/>
      </svg>
      <span>Orice decizie luată trebuie să fie <span class="highlight orbitron-font">obiectivă și bine documentată</span>. Transparența este cheia.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      <span><span class="highlight orbitron-font">Lucrați în echipă!</span> Comunicarea constantă între membrii staff previne conflictele și erorile.</span>
    </li>
  </ul>
</div>
