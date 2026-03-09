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
    <span style="color: var(--vp-c-text-2);" class="orbitron-font">Jucatori</span>
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
    Regulament Jucatori
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
      data-tags="show-wildfire show-dev show-wiki show-staff show-founder"
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

/* Responsive */
@media (max-width: 768px) {
  .rule-card {
    padding: 15px;
    flex-direction: column;
    gap: 8px;
  }
  
  .badge, .punish {
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
<!-- REGULAMENT JUCĂTORI - TOATE REGULILE -->
<!-- ================================================ -->

<!-- 1.0 REGULI GENERALE STAFF -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>1.0 REGULI GENERALE</span>
</div>

<div class="rules-grid">

<!-- 1.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.1</span> Orice tentativă de trișare este pedepsită cu <span class="punish orbitron-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 1.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.2</span> Limbajul vulgar este strict interzis! De asemenea, toate conversațiile care nu au legătură cu serverul sau comunitatea pot fi discutate în privat.
  </div>
</div>

<!-- 1.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.3</span> Sancțiunile acordate pot fi  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
    <span class="punish orbitron-font">BAN TEMPORAR</span> / <span class="punish orbitron-font">PERMANENT</span>
  </div>
</div>

<!-- 1.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.4</span> Jignirea staff-ului duce la  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
  </div>
</div>

<!-- 1.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10.5"/>
      <polyline points="16 2 22 8 16 8"/>
      <line x1="10" y1="14" x2="21" y2="14"/>
      <line x1="10" y1="18" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.5</span> Abuzul excesiv (spam) pe <span class="highlight orbitron-font">u@</span> este interzis, drept urmare duce la <span class="badge orbitron-font">GAG</span>
  </div>
</div>

<!-- 1.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.6</span> Sfidarea oricărei decizii acordate de către un membru staff este strict interzisă.  
    Aceasta se pedepsește cu  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
    <span class="punish orbitron-font">BAN TEMPORAR</span> / <span class="punish orbitron-font">PERMANENT</span>
  </div>
</div>

<!-- 1.7 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M3 12h3l3-9 3 18 3-9h3"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.7</span> Jignirea adusă serverului sau comunității duce la o sancțiune de  
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">MUTE</span>
    <span class="punish orbitron-font">BAN TEMPORAR</span>
    <span class="punish orbitron-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 1.8 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.8</span> Este strict interzis să dețineți mai mult de un cont de CS2 pe server!  
    Sancțiunea este <span class="punish orbitron-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 1.9 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">1.9</span> Cererile de unban se fac într-un interval de  
    <span class="highlight orbitron-font">maximum 10 zile</span> de când a fost sancționat jucătorul.
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- 2.0 COMPORTAMENT PE SERVER -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/></svg>2.0 COMPORTAMENT PE SERVER</span>
</div>

<div class="rules-grid">

<!-- 2.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.1</span> Este strict interzisă deranjarea serverului prin voice-chat.  
    Sancțiune:  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
    <span class="punish orbitron-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 2.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.2</span> Este interzis să stați AFK pentru farmarea de puncte/ore.  
    Riscați: <span class="badge orbitron-font">KICK</span>
  </div>
</div>

<!-- 2.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.3</span> Este interzisă metoda <span class="highlight orbitron-font">monitor</span> (când doi jucători din echipe diferite își dau info).  
    Riscați:  
    <span class="badge orbitron-font">KICK</span>
    <span class="punish orbitron-font">BAN 120 MIN</span>
  </div>
</div>

<!-- 2.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.4</span> Pentru întrebări legate de server sau reclamarea altor jucători se folosește  
    <span class="highlight orbitron-font">"Say_team @mesaj" (u@)</span>.  
    Este interzisă folosirea chat-ului general pentru reclamarea altor jucători (ex: "e codat").  
    Nerespectarea acestei reguli se va sancționa cu  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
  </div>
</div>

<!-- 2.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.5</span> Toxicitatea și flame-ul la adresa celorlalți jucători aduse sub formă de  
    <span class="highlight orbitron-font">"ez"</span>, <span class="highlight orbitron-font">"culcat"</span>, <span class="highlight orbitron-font">"sit"</span>, <span class="highlight orbitron-font">"au măseaua"</span>, <span class="highlight orbitron-font">"taci"</span> etc.  
    se vor sancționa cu  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
  </div>
</div>

<!-- 2.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M2 12h2l2-5 3 10 3-10 3 10 3-10 2 5h2"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">2.6</span> Pe server se comunică în limba <span class="highlight orbitron-font">română</span>.  
    Este acceptată și limba <span class="highlight orbitron-font">engleză</span> pentru jucătorii străini.  
    Folosirea oricărei alte limbi atrage sancțiunea  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
    <span class="punish orbitron-font">BAN TEMPORAR</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- 3.0 INTERDICȚII ȘI RESTRICȚII -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="16" r="1" fill="#ff8c00"/></svg>3.0 INTERDICȚII ȘI RESTRICȚII</span>
</div>

<div class="rules-grid">

<!-- 3.1 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.1</span> Orice tentativă de fraudă / înșelăciune / impersonare se pedepsește cu  
    <span class="punish orbitron-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 3.2 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.2</span> Utilizarea VPN-urilor sau proxy-urilor pentru a eluda ban-urile sau pentru a obține avantaje nejustificate este strict interzisă.  
    Sancțiune: <span class="punish orbitron-font">BAN 7 ZILE</span>
  </div>
</div>

<!-- 3.3 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.3</span> Dacă un jucător pretinde în mod fals că este un membru staff, acesta va fi sancționat cu  
    <span class="badge orbitron-font">SILENCE</span> sau <span class="punish orbitron-font">BAN 7 ZILE</span>
  </div>
</div>

<!-- 3.4 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.4</span> Dacă un jucător îi obligă sau îi convinge pe alții să iasă de pe server pentru a juca doar cu o anumită persoană, va primi  
    <span class="punish orbitron-font">BAN 7 ZILE</span>
  </div>
</div>

<!-- 3.5 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.5</span> Este strict interzis să chemați jucătorii la  
    <span class="highlight orbitron-font">competitive / popflash / faceit / etc.</span>  
    Riscați  
    <span class="badge orbitron-font">MUTE</span>
    <span class="badge orbitron-font">GAG</span>
    <span class="badge orbitron-font">SILENCE</span>
    <span class="punish orbitron-font">BAN TEMPORAR</span>
  </div>
</div>

<!-- 3.6 -->
<div class="rule-card">
  <div class="rule-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  </div>
  <div class="rule-content">
    <span class="rule-number orbitron-font">3.6</span> Este interzis <span class="highlight orbitron-font">griefing / troll</span>.  
    Prima sancțiune: <span class="badge orbitron-font">SLAY</span><br>
    Dacă se repetă: <span class="punish orbitron-font">BAN 120 MIN</span>
  </div>
</div>

</div>

<div class="section-divider"></div>

<!-- 4.0 INFORMAȚII -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    
  </div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><img src="/icons/wildfire.webp" alt="icon" style="width: 30px; height: 30px; display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);">4.0 INFORMAȚII</span>
</div>

<div class="info-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="highlight orbitron-font">Nu sunteți bineveniți</span> dacă intrați cu gândul de a face rău, mai bine nu intrați. Nu căutăm <span class="highlight orbitron-font">"șmecherași"</span> cu figuri în cap, ci oameni cu <span class="highlight orbitron-font">bun-simț</span>.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
      <span>Regulamentul poate întâmpina îmbunătățiri, astfel recomandăm verificarea <span class="highlight orbitron-font">periodică</span> a acestuia. La întrebarea "Ai citit regulamentul? Răspunsul este <span class="highlight orbitron-font">"WILDFIRE BACK ON TOP"</span></span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M8 10h8M8 14h4"/>
      </svg>
      <span>Jocul este <span class="highlight orbitron-font">GRATUIT</span> în limita bunului-simț!</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>Evitați să atrageți atenția în mod <span class="highlight orbitron-font">negativ</span>.</span>
    </li>
  </ul>
</div>