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
    <span style="color: var(--vp-c-text-2);" class="orbitron-font">Intrebari Frecvente</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 6px;">
    <img src="/icons/introduction.svg" alt="introduction" class="nav-icon" style="width: 18px; height: 18px; filter: var(--icon-filter, none);">
    <span style="font-size: 12px; color: var(--vp-c-text-2);" class="orbitron-font">FAQ</span>
  </div>
</div>

<!-- RÂND 1 - logo și titlu -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
  <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
  
  <!-- TITLU CU GRADIENT ANIMAT -->
  <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: gradientShift 6s ease infinite; font-weight: 700;" class="orbitron-font">
    Intrebari Frecvente
  </h1>
</div>

<!-- RAND 2 - tags si updated by -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">

  <!-- Tags in stanga -->
  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
    <PageTagRed style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">panel</PageTagRed>
    <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">tickete</PageTagBlue>
    <PageTagGreen style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">dashboard</PageTagGreen>
    <PageTagPurple style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">suport</PageTagPurple>
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
.panel-types .panel-type {
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

/* GRID PANEL */
.panel-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
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
  font-size: 12px;
  margin: 2px 3px;
  font-weight: 500;
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
  font-size: 13px;
  margin-right: 10px;
  margin-bottom: 5px;
  border: 1px solid var(--panel-number-border);
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
  color: var(--panel-text);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-box li svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  stroke: var(--panel-highlight);
  fill: none;
  margin-top: 2px;
}

/* Hover effect pentru titluri personalizate */
.title-hover:hover {
  transform: translateX(5px);
}

/* SVG-uri în dark mode - DOAR ALBE */
.dark .nav-icon,
.dark .panel-icon svg,
.dark .section-title svg,
.dark .info-box li svg {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

/* SVG-uri în light mode */
:not(.dark) .nav-icon,
:not(.dark) .panel-icon svg,
:not(.dark) .section-title svg,
:not(.dark) .info-box li svg {
  filter: brightness(0.4);
  opacity: 0.8;
}

/* ===== STILURI PENTRU COLLAPSE ===== */
.collapse-container {
  margin: 20px 0;
  border-radius: 16px;
  overflow: hidden;
  background: var(--panel-card-bg);
  border: 1px solid var(--panel-card-border);
}

.collapse-item {
  border-bottom: 1px solid var(--panel-card-border);
}

.collapse-item:last-child {
  border-bottom: none;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  cursor: pointer;
  background: var(--panel-card-bg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.collapse-header:hover {
  background: rgba(255,140,0,0.05);
}

.collapse-header:hover .collapse-arrow {
  transform: translateX(5px);
}

.collapse-header.active {
  background: rgba(255,140,0,0.08);
  border-bottom: 1px solid var(--panel-card-border);
}

.collapse-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,140,0,0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,140,0,0.2);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.collapse-item:hover .collapse-icon {
  background: rgba(255,140,0,0.15);
  transform: rotate(5deg);
}

.collapse-header.active .collapse-icon {
  background: rgba(255,140,0,0.2);
  border-color: var(--panel-primary);
}

.collapse-icon svg {
  width: 20px;
  height: 20px;
  stroke: var(--panel-primary);
  fill: none;
  transition: all 0.3s ease;
}

.collapse-header.active .collapse-icon svg {
  transform: rotate(90deg);
}

.collapse-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--panel-text);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.collapse-header:hover .collapse-title {
  color: var(--panel-primary);
}

.collapse-badge {
  background: linear-gradient(135deg, var(--panel-primary), var(--panel-primary-dark));
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 10px;
  font-family: 'Orbitron', sans-serif !important;
}

.collapse-arrow {
  width: 20px;
  height: 20px;
  stroke: var(--panel-primary);
  fill: none;
  opacity: 0.7;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.collapse-header.active .collapse-arrow {
  transform: rotate(180deg);
  opacity: 1;
}

.collapse-content {
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out, padding 0.3s ease;
  background: var(--panel-card-bg);
  border-top: 0 solid transparent;
}

.collapse-content.show {
  padding: 20px 24px 24px 78px;
  max-height: 500px;
  border-top: 1px solid var(--panel-card-border);
  background: rgba(255,140,0,0.02);
}

.collapse-content p {
  margin: 10px 0;
  color: var(--panel-text);
  font-size: 15px;
  line-height: 1.7;
}

.collapse-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.collapse-content li {
  margin: 8px 0;
  color: var(--panel-text);
  list-style-type: none;
  position: relative;
  padding-left: 24px;
}

.collapse-content li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--panel-primary);
  font-weight: 600;
  opacity: 0.7;
}

.collapse-content code {
  background: rgba(255,140,0,0.1);
  color: var(--panel-primary);
  padding: 3px 12px;
  border-radius: 30px;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  border: 1px solid rgba(255,140,0,0.2);
}

.collapse-content .badge {
  margin: 2px 4px;
}

/* Stats cards pentru panel */
.panel-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 30px 0;
}

.panel-stat {
  background: var(--panel-card-bg);
  border: 1px solid var(--panel-card-border);
  border-radius: 18px;
  padding: 20px 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.panel-stat:hover {
  border-color: var(--panel-primary);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255,140,0,0.1);
}

.panel-stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--panel-primary);
  line-height: 1.2;
  margin-bottom: 5px;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.panel-stat-label {
  font-size: 12px;
  color: var(--panel-text);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Orbitron', sans-serif !important;
}

/* Feature grid */
.panel-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.panel-feature {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,140,0,0.05);
  border: 1px solid rgba(255,140,0,0.2);
  border-radius: 30px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--panel-text);
  transition: all 0.3s ease;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.panel-feature:hover {
  border-color: var(--panel-primary);
  color: var(--panel-primary);
  background: rgba(255,140,0,0.1);
}

.panel-feature svg {
  stroke: var(--panel-primary);
  width: 14px;
  height: 14px;
  fill: none;
}

/* Ticket types */
.panel-types {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.panel-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
  background: transparent;
  transition: all 0.3s ease;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.panel-type:hover {
  transform: translateY(-2px);
}

.panel-type svg {
  width: 16px;
  height: 16px;
  fill: none;
}

.panel-type.unban {
  color: #ffaa00;
  border-color: #ffaa00;
  background: rgba(255,170,0,0.05);
}
.panel-type.unban:hover {
  background: #ffaa00;
  color: white;
}
.panel-type.unban:hover svg {
  stroke: white;
}

.panel-type.report {
  color: #ff4444;
  border-color: #ff4444;
  background: rgba(255,68,68,0.05);
}
.panel-type.report:hover {
  background: #ff4444;
  color: white;
}
.panel-type.report:hover svg {
  stroke: white;
}

.panel-type.request {
  color: #3b82f6;
  border-color: #3b82f6;
  background: rgba(59,130,246,0.05);
}
.panel-type.request:hover {
  background: #3b82f6;
  color: white;
}
.panel-type.request:hover svg {
  stroke: white;
}

.panel-type.helper {
  color: #a855f7;
  border-color: #a855f7;
  background: rgba(168,85,247,0.05);
}
.panel-type.helper:hover {
  background: #a855f7;
  color: white;
}
.panel-type.helper:hover svg {
  stroke: white;
}

/* CTA Buttons */
.panel-cta {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px 0 20px;
}

.panel-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.panel-cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.panel-cta-btn:hover::before {
  left: 100%;
}

.panel-cta-btn.primary {
  background: linear-gradient(135deg, var(--panel-primary), var(--panel-primary-dark));
  color: white;
  box-shadow: 0 5px 20px rgba(255,140,0,0.3);
}

.panel-cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255,140,0,0.4);
}

.panel-cta-btn.secondary {
  background: transparent;
  border: 2px solid var(--panel-card-border);
  color: var(--panel-text);
}

.panel-cta-btn.secondary:hover {
  border-color: var(--panel-primary);
  color: var(--panel-primary);
  transform: translateY(-3px);
}

.panel-cta-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  transition: transform 0.3s ease;
}

.panel-cta-btn:hover svg {
  transform: rotate(5deg);
}

/* Responsive */
@media (max-width: 768px) {
  .panel-card {
    padding: 15px;
    flex-direction: column;
    gap: 8px;
  }
  
  .badge, .panel-badge {
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
  
  .panel-stats {
    grid-template-columns: 1fr;
  }
  
  .panel-cta {
    flex-direction: column;
  }
  
  .panel-cta-btn {
    width: 100%;
    justify-content: center;
  }
  
  .collapse-content.show {
    padding: 16px 18px 18px 66px;
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>

<!-- INTRO PANEL CARD -->
<div class="panel-card" style="margin-bottom: 25px;">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="3" ry="3"/>
      <line x1="8" y1="2" x2="8" y2="22" stroke-dasharray="2 2"/>
      <line x1="16" y1="2" x2="16" y2="22" stroke-dasharray="2 2"/>
      <line x1="2" y1="8" x2="22" y2="8" stroke-dasharray="2 2"/>
      <line x1="2" y1="16" x2="22" y2="16" stroke-dasharray="2 2"/>
    </svg>
  </div>
  <div class="panel-content">
    <span class="panel-number">PANEL</span> <span class="highlight">wildfire.ro</span>
    <p>Accesează-ți contul cu Steam și gestionează totul dintr-un singur loc: statistici, tickete, donații și multe altele.</p>
    <div class="panel-features">
      <span class="panel-feature">
        <svg viewBox="0 0 24 24" width="12" height="12">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Statistici jucător
      </span>
      <span class="panel-feature">
        <svg viewBox="0 0 24 24" width="12" height="12">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Tickete active
      </span>
      <span class="panel-feature">
        <svg viewBox="0 0 24 24" width="12" height="12">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Leaderboard
      </span>
      <span class="panel-feature">
        <svg viewBox="0 0 24 24" width="12" height="12">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Market & VIP
      </span>
    </div>
  </div>
</div>

<!-- 2.0 ÎNTREBĂRI FRECVENTE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>1.0 ÎNTREBĂRI FRECVENTE</span>
</div>

<!-- COLLAPSE CONTAINER - ÎNTREBĂRI -->
<div class="collapse-container">

  <!-- ITEM 1 - Cum mă conectez pe server? -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
      </div>
      <span class="collapse-title">
        Cum mă conectez pe server?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p>Pentru a face acest lucru, deschide consola apăsând tasta <span class="badge">~</span> (tilda) și scrie:</p>
      <p><code class="orbitron-font">connect cs2.wildfire.ro</code></p>
      <p>Alternativ, poți adăuga serverul la favorite: <span class="badge">cs2.wildfire.ro:27015</span></p>
    </div>
  </div>

  <!-- ITEM 2 - Cum pot aplica în staff? -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <path d="M12 8v4l3 3"/>
        </svg>
      </div>
      <span class="collapse-title">
        Cum pot aplica în staff?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p>Poți aplica în staff prin sistemul de tickete:</p>
      <p><span class="panel-badge">1</span> Accesează <code>wildfire.ro</code></p>
      <p><span class="panel-badge">2</span> Autentifică-te cu Steam</p>
      <p><span class="panel-badge">3</span> Mergi la secțiunea <span class="highlight">"Tickete"</span></p>
      <p><span class="panel-badge">4</span> Alege tipul <span class="panel-type helper" style="display: inline-flex; margin-left: 5px;">Helper apply</span></p>
      <p>Completează formularul cu informații despre tine, experiență și motivul pentru care vrei să devii parte din staff.</p>
    </div>
  </div>

  <!-- ITEM 3 - Ce fac dacă găsesc un bug? -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <span class="collapse-title">
        Ce fac dacă găsesc un bug?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p>Dacă ai găsit un bug, te rugăm să ne anunți cât mai repede:</p>
      <ul>
        <li><span class="badge">Pe site</span> - Deschide un ticket de tip <span class="panel-type request" style="display: inline-flex; margin-left: 5px;">Bug Report</span></li>
        <li><span class="badge">Pe Discord</span> - Anunță în canalul de ticket-uri</li>
      </ul>
      <p>Oferă cât mai multe detalii: cum ai întâlnit bug-ul, ce ai făcut înainte, screenshot-uri sau video dacă se poate.</p>
    </div>
  </div>

  <!-- ITEM 4 - Am primit ban de la anticheat, ce pot face? -->
<div class="collapse-item">
  <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
    <div class="collapse-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>
    <span class="collapse-title">
      Am primit ban de la anticheat, ce pot face?
    </span>
    <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
  <div class="collapse-content">
    <p style="font-size: 13px; margin-bottom: 12px; line-height: 1.5; color: var(--panel-text); opacity: 0.9;">Sistemul anti-cheat este automat și extrem de precis. Dacă ai primit ban, înseamnă că sistemul a detectat o activitate suspectă.</p>
    
<div style="display: flex; align-items: flex-start; gap: 10px; margin: 12px 0; padding: 0;">
      <div style="min-width: 20px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff4444" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div style="font-size: 13px;">
        <span style="color: #ff4444; font-weight: 600;">Important:</span> În majoritatea cazurilor, ban-ul de la anti-cheat este definitiv și nu poate fi anulat.
      </div>
    </div>
    
 <div style="display: flex; align-items: flex-start; gap: 10px; margin: 8px 0; padding: 0;">
      <div style="min-width: 20px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff8c00" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div style="font-size: 13px;">
        <span class="highlight">NU poți face nimic</span> dacă ban-ul a fost corect aplicat.
      </div>
    </div>
    
 <div style="display: flex; align-items: flex-start; gap: 10px; margin: 8px 0 12px 0; padding: 0;">
      <div style="min-width: 20px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffaa00" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
<div style="font-size: 13px;">
        <span class="highlight">DOAR dacă există o eroare</span> a sistemului (extrem de rar), poți deschide un ticket de tip
        <div style="margin-top: 6px;">
          <span class="panel-type unban" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; font-size: 11px;">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Unban
          </span>
        </div>
        <p style="margin-top: 6px; margin-bottom: 0;">și să prezinți dovezi clare că a fost o greșeală.</p>
      </div>
    </div>
    
  <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,140,0,0.2);">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style="font-size: 12px; opacity: 0.8;">Fără dovezi convingătoare, ticketul va fi respins automat.</span>
    </div>
  </div>
</div>

<!-- ITEM 5 - Pe server există skin-uri? -->
<div class="collapse-item">
  <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
    <div class="collapse-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
      </svg>
    </div>
    <span class="collapse-title">
      Pe server există skin-uri?
    </span>
    <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
  <div class="collapse-content">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#00aa00" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span class="highlight">DA!</span>
      <span style="font-size: 13px;">Pe server există skin-uri personalizate.</span>
    </div>
    
   <div style="margin: 10px 0;">
      <span style="font-size: 13px; display: block; margin-bottom: 6px;">Poți folosi:</span>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        <span class="badge" style="display: inline-flex; align-items: center; gap: 4px;">!ws</span>
        <span class="badge" style="display: inline-flex; align-items: center; gap: 4px;">!knife</span>
        <span class="badge" style="display: inline-flex; align-items: center; gap: 4px;">!glove</span>
        <span class="badge" style="display: inline-flex; align-items: center; gap: 4px;">!agent</span>
      </div>
    </div>
    
   <div style="display: flex; align-items: flex-start; gap: 8px; margin: 12px 0; padding: 8px 12px; background: rgba(255,140,0,0.05); border-radius: 6px;">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ff8c00" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
        <rect x="2" y="2" width="20" height="20" rx="3" ry="3"/>
        <line x1="8" y1="2" x2="8" y2="22" stroke-dasharray="2 2"/>
      </svg>
      <div style="font-size: 12px;">
        <span>Autentifică-te cu </span>
        <span class="highlight">Steam</span>
        <span> pe </span>
        <code style="font-size: 11px;">wildfire.ro</code>
      </div>
    </div>
    
 <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,140,0,0.1);">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span style="font-size: 11px; opacity: 0.8;">Poți debloca skin-uri, cuțite, mănuși și agenți.</span>
    </div>
  </div>
</div>

<!-- ITEM 6 - Cum intru pe Discord? -->
<div class="collapse-item">
  <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
    <div class="collapse-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="14" x2="12" y2="14"/>
      </svg>
    </div>
    <span class="collapse-title">
      Cum intru pe Discord?
    </span>
    <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
  <div class="collapse-content">
    <p>Serverul nostru de Discord este locul unde comunitatea se adună, unde anunțăm evenimente și unde poți primi ajutor rapid.</p>
    
  <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0 15px 0; flex-wrap: wrap;">
      <span><span class="highlight">Link permanent:</span> <code class="orbitron-font" style="font-size: 13px;">discord.gg/CyFrDpCu</code></span>
      
   <a href="https://discord.gg/CyFrDpCu" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; background: #5865F2; color: white; padding: 4px 12px; border-radius: 30px; font-weight: 600; font-size: 11px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(88, 101, 242, 0.3); font-family: 'Orbitron', sans-serif; letter-spacing: 0.3px;">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.214.385-.46.9-.608 1.312a18.284 18.284 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.312 19.736 19.736 0 0 0-4.885 1.515c-2.888 4.334-3.66 8.56-3.104 12.67a19.79 19.79 0 0 0 5.99 2.99 15.053 15.053 0 0 0 1.29-2.09 12.647 12.647 0 0 1-2.03-.98c.17-.125.337-.256.498-.39a14.334 14.334 0 0 0 12.264 0c.162.134.33.265.5.39-.64.39-1.32.72-2.03.98.36.74.8 1.44 1.29 2.09a19.79 19.79 0 0 0 5.99-2.99c.66-4.71-.33-8.9-3.1-12.67zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.08 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.98 0c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.08 2.16 2.42 0 1.34-.96 2.42-2.16 2.42z"/>
        </svg>
        ALĂTURĂ-TE
      </a>
    </div>
    
 <p>Pe Discord vei găsi:</p>
    <ul>
      <li><svg viewBox="0 0 24 24" width="16" height="16" style="display: inline-block; vertical-align: middle; margin-right: 8px; stroke: #ff8c00;" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Anunțuri importante</li>
      <li><svg viewBox="0 0 24 24" width="16" height="16" style="display: inline-block; vertical-align: middle; margin-right: 8px; stroke: #ff8c00;" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Suport rapid de la staff</li>
      <li><svg viewBox="0 0 24 24" width="16" height="16" style="display: inline-block; vertical-align: middle; margin-right: 8px; stroke: #ff8c00;" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Evenimente și giveaway-uri</li>
      <li><svg viewBox="0 0 24 24" width="16" height="16" style="display: inline-block; vertical-align: middle; margin-right: 8px; stroke: #ff8c00;" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Comunitatea activă</li>
    </ul>
  </div>
</div>
</div>


<!-- 1.0 TICKETE ȘI RECLAMAȚII -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/></svg>2.0 SISTEM TICKETE</span>
</div>

<!-- COLLAPSE CONTAINER - TICKETE -->
<div class="collapse-container">

  <!-- ITEM 1 - Tipuri tickete -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <line x1="8" y1="2" x2="8" y2="22"/>
        </svg>
      </div>
      <span class="collapse-title">
        Ce tipuri de tickete pot deschide?
        <span class="collapse-badge">4 tipuri</span>
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p>Poți deschide următoarele tipuri de tickete în Dashboard:</p>
      <div class="panel-types">
        <div class="panel-type unban">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Unban
        </div>
        <div class="panel-type report">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Reclamații 
        </div>
        <div class="panel-type helper">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Helper apply
        </div>
        <div class="panel-type bug">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Bug Report
        </div>
      </div>
      <p><span class="highlight">Unban</span> - Pentru cereri de deblocare<br>
      <span class="highlight">Bug Report</span> - Pentru a raporta bug-uri<br>
      <span class="highlight">Reclamații</span> - Reclamații cu dovezi (demo, screenshot)<br>
      <span class="highlight">Helper</span> - Aplicații pentru staff</p>
    </div>
  </div>

  <!-- ITEM 2 - Cum deschid ticket -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <path d="M12 8v4l3 3"/>
        </svg>
      </div>
      <span class="collapse-title">
        Cum deschid un ticket?
        <span class="collapse-badge">3 pași</span>
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p><span class="panel-badge">1</span> Accesează <code>wildfire.ro</code></p>
      <p><span class="panel-badge">2</span> Autentifică-te cu Steam (click pe butonul Steam)</p>
      <p><span class="panel-badge">3</span> Mergi la secțiunea <span class="highlight">"Tickete"</span> și apasă "Deschide ticket nou"</p>
      <p>Completează formularul cu:</p>
      <ul>
        <li>Tipul ticketului</li>
        <li>Titlu relevant</li>
        <li>Descriere detaliată</li>
        <li>Dovezi (link-uri demo, screenshot-uri)</li>
      </ul>
    </div>
  </div>

  <!-- ITEM 3 - Cât durează -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <span class="collapse-title">
        Cât durează până primesc răspuns?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p>Timpul mediu de concluzionare este de <span class="highlight">&lt;12-24 ore</span>.</p>
      <p>În funcție de tipul ticketului:</p>
      <ul>
        <li><span class="badge">Unban</span> - 24-72 ore în funcție de gravitația situației</li>
        <li><span class="badge">Reclamații</span> - 4-24 ore (necesită verificare)</li>
        <li><span class="badge">Bug Report</span> - 24-48 ore (necesită verificare)</li>
        <li><span class="badge">Helper</span> - 24-48 ore</li>
      </ul>
    </div>
  </div>

  <!-- ITEM 4 - Dovezi necesare -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <path d="M7 2v20M17 2v20"/>
        </svg>
      </div>
      <span class="collapse-title">
        Ce dovezi trebuie să atașez?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p>Pentru <span class="highlight">report-uri</span>, sunt necesare dovezi clare precum:</p>
      <ul>
        <li><span class="badge">Screenshot</span> - Cu numele jucătorului vizibil</li>
        <li><span class="badge">Video</span> - Link YouTube/Streamable</li>
      </ul>
      <p>Fără dovezi clare, ticketul poate fi respins. Toate informațiile se regăsesc pe site când deschizi un ticket</p>
    </div>
  </div>

</div>

<!-- 2.0 DASHBOARD ȘI STATISTICI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>3.0 DASHBOARD</span>
</div>

<!-- COLLAPSE CONTAINER - DASHBOARD -->
<div class="collapse-container">

  <!-- ITEM 1 - Statistici -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
          <path d="M2 17L12 22L22 17"/>
        </svg>
      </div>
      <span class="collapse-title">
        Ce statistici pot vedea în Dashboard?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p>Dashboard-ul îți arată:</p>
      <ul>
        <li><span class="highlight">Rank-ul</span> și ELO-ul actual</li>
        <li><span class="highlight">Statistici</span> K/D, win rate, headshot %</li>
        <li><span class="highlight">Fire Coins</span> balanța și tranzacții</li>
        <li><span class="highlight">Tickete</span> active și istoric</li>
        <li><span class="highlight">Leaderboard</span> poziția globală</li>
      </ul>
      <p>Poți accesa oricând <code>wildfire.ro</code> pentru statistici în timp real.</p>
    </div>
  </div>

  <!-- ITEM 2 - Fire Coins -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
      </div>
      <span class="collapse-title">
        Ce sunt creditele și cum le folosesc?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p><span class="highlight">Creditele</span> reprezintă moneda virtuală a serverului.</p>
      <p><span class="panel-badge">Cum faci rost de ele:</span></p>
      <ul>
        <li>Jucând meciuri:</li>
        <li>MVP-uri:</li>
        <li>Kill-uri:</li>
        <li>Bonus zilnic:</li>
        <li>Gold Member</li>
        <li>Evenimente</li>
      </ul>
      <p><span class="panel-badge">Unde îi folosești:</span> Pe <span class="highlight">server</span>, poți cumpăra iteme cosmetice, culori chat și multe altele.</p>
    </div>
  </div>

  <!-- ITEM 3 - Market -->
  <div class="collapse-item">
    <div class="collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
      </div>
      <span class="collapse-title">
        Cum funcționează Market-ul?
      </span>
      <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="collapse-content">
      <p><span class="highlight">wildfire.ro/market</span> este magazinul serverului:</p>
      <ul>
        <li><span class="badge">VIP</span> - Pachete VIP </li>
        <li><span class="badge">Cosmetice</span> -  tag-uri, MVP-uri, badge-uri</li>
        <li><span class="badge">Fire Coins</span> - Pachete de coins</li>
        <li><span class="badge">Skins</span> - Skin-uri pe arme, custom agents</li>
      </ul>
      <p>Poți plăti cu <span class="highlight">Fire Coins</span> sau <span class="highlight">bani reali</span>.</p>
    </div>
  </div>

</div>

<!-- 3.0 COMENZI RAPIDE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 2v20M17 2v20"/></svg>4.0 COMENZI RAPIDE</span>
</div>

<div class="panel-grid">

  <div class="panel-card">
    <div class="panel-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    </div>
    <div class="panel-content">
      <span class="panel-number">!panel</span> - link către dashboard
    </div>
  </div>

  <div class="panel-card">
    <div class="panel-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
      </svg>
    </div>
    <div class="panel-content">
      <span class="panel-number">!help</span> - afișează toate comenzile
    </div>
  </div>

  <div class="panel-card">
    <div class="panel-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <div class="panel-content">
      <span class="panel-number">!ws</span> - deschide meniul de skin-uri
    </div>
  </div>

  <div class="panel-card">
    <div class="panel-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>
    <div class="panel-content">
      <span class="panel-number">!discord</span> - link către serverul de discord
    </div>
  </div>

<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="panel-content">
    <span class="panel-number">!group</span> - link către steam group
  </div>
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
    <span class="panel-number">!shop</span> - deschide shop-ul
  </div>
</div>

<div class="panel-card">
  <div class="panel-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
      <path d="M2 17L12 22L22 17"/>
      <path d="M2 12L12 17L22 12"/>
    </svg>
  </div>
  <div class="panel-content">
    <span class="panel-number">!top</span> - afiseaza top-ul
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
      <span><span class="highlight">Toate ticketele sunt tratate confidențial</span> doar staff-ul are acces.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
      <span>Pentru întrebări urgente în joc, folosește <span class="highlight">u@</span> (mesaj către staff).</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>Nu deschide ticket dublu pentru aceeași problemă - încetinește procesul.</span>
    </li>
  </ul>
</div>