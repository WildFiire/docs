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
  page-id="regulament-staff"
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

<!-- CAP. I | Cerinte pentru aplicatie -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>CAP. I | Cerinte pentru aplicatie</span>
</div>

<div class="rules-grid">

<!-- 1.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.1</span> Sa ai minim <span class="highlight orbitron-font">16 ani</span>, facem exceptie si jucatorilor de <span class="highlight orbitron-font">15 ani</span> daca arata seriozitate iar aplicatia lor este una buna.
  </div>
</div>

<!-- 1.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.2</span> Sa ai cel putin <span class="highlight orbitron-font">500 de ore</span> jucate pe Counter-Strike 2.
  </div>
</div>

<!-- 1.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.3</span> Sa ai cel putin <span class="highlight orbitron-font">20 de ore</span> jucate pe server.
  </div>
</div>

<!-- 1.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.4</span> Sa nu fi avut <span class="highlight orbitron-font">sanctiuni grave</span> de tip limbaj vulgar, racist, toxic, etc.
  </div>
</div>

<!-- 1.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.5</span> Comportament <span class="highlight orbitron-font">exemplar</span> in comunitate.
  </div>
</div>

<!-- 1.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.6</span> Microfon care sa nu aiba <span class="highlight orbitron-font">probleme de fundal</span>.
  </div>
</div>

<!-- 1.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.7</span> Sa fii <span class="highlight orbitron-font">activ pe discord</span> si pe server.
  </div>
</div>

<!-- 1.8 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.8</span> Sa cunosti <span class="highlight orbitron-font">regulamentele serverului</span> si sa le respecti.
  </div>
</div>

<!-- 1.9 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.9</span> Activitate pe <span class="highlight orbitron-font">voice chat</span>, la fel ca si pe text chat, sa ajuti/indrumi jucatorii. Asa arati interes ca vrei sa intri in staff, nu doar sa intri ca sa ai un tag si VIP.
  </div>
</div>

<!-- 1.10 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.10</span> <span class="highlight orbitron-font">Obligatoriu:</span> Prime account.
  </div>
</div>

<!-- 1.11 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.11</span> In cazul in care aplicatia a fost <span class="highlight orbitron-font">respinsa</span>, trebuie sa astepti <span class="highlight orbitron-font">7 zile</span>.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. II | Reguli generale -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>CAP. II | Reguli generale</span>
</div>

<div class="rules-grid">

<!-- 2.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.1</span> Adminii trebuie sa aiba un comportament <span class="highlight orbitron-font">exemplar</span> pe server, sa respecte regulamentul si sa pastreze un limbaj adecvat rolului.
  </div>
</div>

<!-- 2.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.2</span> Este <span class="highlight orbitron-font">STRICT INTERZISA</span> instrainarea sau folosirea de catre mai multe persoane a contului de admin, indiferent ca e frate, sora, etc. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

<!-- 2.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.3</span> Adminii au dreptul de a folosi <span class="highlight orbitron-font">accesele</span> care le revin in scopul de a aplica sanctiuni numai in conformitate cu regulamentul si ghidul impus.
  </div>
</div>

<!-- 2.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.4</span> Este interzisa administrarea pe alte servere din <span class="highlight orbitron-font">afara comunitatii</span>. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

<!-- 2.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.5</span> In caz ca un admin primeste <span class="highlight orbitron-font">BAN pe discord</span>, adminul respectiv nu mai poate detine un grad pe server. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

<!-- 2.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.6</span> In caz ca un admin primeste <span class="highlight orbitron-font">VAC BAN/Game Ban</span> (STRICT PE CS2), adminul respectiv nu mai poate detine un grad pe server. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

<!-- 2.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.7</span> Adminii au obligatia sa citeasca <span class="highlight orbitron-font">zilnic</span> postarile noi pe discord la categoria <span class="highlight orbitron-font">Informatii</span>. Acestia trebuie sa fie mereu la curent cu regulamentul.
  </div>
</div>

<!-- 2.8 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.8</span> <span class="highlight orbitron-font">Dovezile</span> se tin in PC <span class="highlight orbitron-font">10 zile</span>.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. III | Conduita -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>CAP. III | Conduita</span>
</div>

<div class="rules-grid">

<!-- 3.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.1</span> Adminilor le este <span class="highlight orbitron-font">interzisa</span> folosirea comenzilor impotriva altor admini.
  </div>
</div>

<!-- 3.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.2</span> Adminilor le este strict <span class="highlight orbitron-font">interzis</span> sa intervina peste comenzile altor admini.
  </div>
</div>

<!-- 3.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.3</span> Este <span class="highlight orbitron-font">STRICT INTERZIS</span> sa debanati un jucator care a fost banat de un alt admin. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

<!-- 3.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.4</span> In aplicarea sanctiunilor, adminii vor lua in considerare urmatorii <span class="highlight orbitron-font">factori:</span>
    <ul style="list-style: none; padding: 0; margin: 12px 0 12px 28px;">
      <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="3" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Gravitatea situatiei</span>
      </li>
      <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="3" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Antecedentele jucatorului</span>
      </li>
      <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="3" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Starea de spirit din momentul respectiv</span>
      </li>
    </ul>
    Se interzice acordarea directa a unor sanctiuni majore (ban), cu exceptia cazurilor in care este absolut necesar sau daca regulamentul prevede acest lucru.
  </div>
</div>

<!-- 3.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.5</span> Indiferent de sanctiunea aplicata, adminul trebuie sa <span class="highlight orbitron-font">informeze</span> jucatorul cu privire la regula incalcata. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 3.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.6</span> Adminii nu au voie sa ofere <span class="highlight orbitron-font">favoruri</span> indiferent de natura situatiei. <span class="badge-remove orbitron-font">Sanctiune: REMOVE</span>
  </div>
</div>

<!-- 3.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.7</span> Inainte de a bana un jucator pentru utilizarea unui <span class="highlight orbitron-font">VPN</span>, acesta trebuie avertizat de <span class="highlight orbitron-font">3 ori</span> sa reintre pe server fara VPN. Daca jucatorul nu se conformeaza, poate primi un ban de <span class="highlight orbitron-font">7 zile</span>.
  </div>
</div>

<!-- 3.8 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v5.41l2.29 2.3a1 1 0 0 0 1.42-1.42L13 11.59V7a1 1 0 0 0-1-1z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.8</span> Incepand cu ora <span class="highlight orbitron-font">12:00 AM → 07:00 AM</span>, se recomanda o atitudine mai concilianta fata de jucatorii care folosesc un limbaj vulgar, avand in vedere ca dupa aceasta ora numarul copiilor activi scade considerabil. Se permite, intr-o masura rezonabila, anumite glume si expresii vulgare, cu conditia ca acestea sa ramana in limita unui comportament decent si a bunului simt.
  </div>
</div>

<!-- 3.9 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.9</span> Dacă între staff apare un <span class="highlight orbitron-font">conflict</span>, acesta trebuie discutat cu <span class="highlight orbitron-font">Server Manager-ul</span>.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. IV | Activitate & Ore -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>CAP. IV | Activitate & Ore</span>
</div>

<div class="rules-grid">

<!-- 4.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.1</span> <span class="highlight orbitron-font">Helper, Moderator, Administrator si Supervizor</span> trebuie sa indeplineasca un minim de <span class="highlight orbitron-font">30 de ore</span> jucate lunar. In cazul in care un membru al echipei a fost invoit pe o perioada mai mare de 1 saptamana (medicale, vacanta, etc.), minimul va fi calculat <span class="highlight orbitron-font">proportional</span>.
    <br><span class="badge orbitron-font">Exemplu: 2 saptamani invoit ➔ 15 ore minim.</span>
  </div>
</div>

<!-- 4.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.2</span> <span class="highlight orbitron-font">Server Manager si Community Manager</span> nu au un minim obligatoriu de ore, deoarece rolul lor principal consta in coordonarea si sprijinirea staff-ului, implicand un nivel ridicat de activitate pe voice chat si alte atributii.
  </div>
</div>

<!-- 4.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.3</span> Minimul de <span class="highlight orbitron-font">30 de ore</span> este impus deoarece serverul se afla intr-o perioada de formare, iar prezenta activa este esentiala. Practic, <span class="highlight orbitron-font">1-2 ore pe zi</span> sunt suficiente, ceea ce reprezinta un efort rezonabil.
  </div>
</div>

<!-- 4.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.4</span> Activitatea pe <span class="highlight orbitron-font">discord</span> este obligatorie. Adminul care nu activeaza pe discord este sanctionat cu <span class="badge-warn orbitron-font">Sanctiune: WARN</span>.
  </div>
</div>

<!-- 4.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.5</span> In cazul in care veti lipsi mai mult de <span class="highlight orbitron-font">3 zile</span>, sunteti obligati sa anuntati Server Manager-ul sau sa postati absenta pe discord cu motivul si perioada acesteia.
  </div>
</div>

<!-- 4.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.6</span> Adminii nu au voie sa stea <span class="highlight orbitron-font">AFK</span> pe server. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 4.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">4.7</span> Adminii care sunt pe server <span class="highlight orbitron-font">inactivi</span> sunt pasibili de <span class="badge-warn orbitron-font">Sanctiune: WARN</span>.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. V | Responsabilitati -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>CAP. V | Responsabilitati</span>
</div>

<div class="rules-grid">

<!-- 5.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.1</span> Staff-ul este acolo pentru <span class="highlight orbitron-font">comunitate</span>, nu invers. Responsabilitatea principala este sa asigurati o experienta placuta pentru toti jucatorii.
  </div>
</div>

<!-- 5.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.2</span> Orice admin are <span class="highlight orbitron-font">obligatia</span> de a ajuta orice jucator in cazul in care acesta ii semnaleaza o problema.
  </div>
</div>

<!-- 5.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.3</span> Daca un admin constata o incalcare a regulamentului, dar nu detine <span class="highlight orbitron-font">accesele necesare</span> pentru a lua masuri, trebuie sa informeze imediat staff-ul pe canalul de discord. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 5.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.4</span> Daca un admin are cunostinta de existenta unui <span class="highlight orbitron-font">bug</span>, este obligat sa sesizeze imediat Developer-ul. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 5.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.5</span> Orice decizie luata trebuie sa fie <span class="highlight orbitron-font">obiectiva si bine documentata</span>. Transparenta este cheia.
  </div>
</div>

<!-- 5.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">5.6</span> <span class="highlight orbitron-font">Lucrati in echipa!</span> Comunicarea constanta intre membrii staff previne conflictele si erorile.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- CAP. VI | Sanctiuni -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>CAP. VI | Sanctiuni</span>
</div>

<div class="rules-grid">

<!-- 6.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.1</span> <span class="highlight orbitron-font">Minimul de ore lunar neindeplinit</span>: <span class="badge-warn orbitron-font">WARN</span>. <span class="highlight orbitron-font">Exceptie facand situatiile mentionate in CAP. IV.</span>
  </div>
</div>

<!-- 6.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.2</span> <span class="highlight orbitron-font">Testarea</span> in exces a comenzilor de helper/moderator/admin atrage dupa sine un <span class="badge-warn orbitron-font">Sanctiune: WARN</span>.
  </div>
</div>

<!-- 6.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.3</span> Sanctionarile cu ban permanent/temporar avand un <span class="highlight orbitron-font">motiv neclar</span> sau neconcludent vor fi penalizate cu <span class="badge-warn orbitron-font">Sanctiune: WARN</span>.
  </div>
</div>

<!-- 6.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.4</span> Durata maxima a unei sanctiuni pentru <span class="highlight orbitron-font">Helper</span> este de <span class="highlight orbitron-font">60 de minute</span>, se permite o durata mai mare doar cu acordul unui Administrator+. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

<!-- 6.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">6.5</span> Pentru gradul de <span class="highlight orbitron-font">Moderator</span>, durata maxima este de <span class="highlight orbitron-font">120 de minute</span>, se permite o durata mai mare doar cu acordul unui Administrator+. <span class="badge-warn orbitron-font">Sanctiune: WARN</span>
  </div>
</div>

</div>
