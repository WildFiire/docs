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
    <span style="color: var(--vp-c-brand-1);">Acasă</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-brand-1);">Actualizări</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-text-2);">Contribuie</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 6px;">
    <img src="/icons/introduction.svg" alt="introduction" class="nav-icon" style="width: 18px; height: 18px; filter: var(--icon-filter, none);">
    <span style="font-size: 12px; color: var(--vp-c-text-2);">Contribuie</span>
  </div>
</div>

<!-- RÂND 1 - logo și titlu -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
  <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
  
  <!-- TITLU CU GRADIENT -->
  <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">
    Cum poți contribui?
  </h1>
</div>

<!-- RÂND 2 - tags și updated by -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid var(--vp-c-divider); padding-top: 15px; margin-top: 5px;">

  <!-- Tags în stânga -->
  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; filter: var(--icon-filter, none);">
    <PageTagBlue style="font-size: 11px; padding: 2px 8px;">actualizări</PageTagBlue>
    <PageTagOrange style="font-size: 11px; padding: 2px 8px;">contribuie</PageTagOrange>
    <PageTagGreen style="font-size: 11px; padding: 2px 8px;">ajutor</PageTagGreen>
  </div>

  <!-- Updated by în dreapta -->
  <div style="display: flex; align-items: center; gap: 6px;">
    <span style="font-size: 13px; color: var(--vp-c-text-2); font-weight: 500;">updated by</span>
    <a 
      href="https://github.com/ianncxd" 
      target="_blank" 
      class="github-profile"
      data-username="ianncxd"
      data-tags="show-wildfire show-dev show-wiki show-staff show-founder"
      style="display: block; padding: 2px; background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6); border-radius: 50%;" 
      title="ianncxd"
    >
      <img src="https://github.com/ianncxd.png" alt="ianncxd" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--vp-c-bg); display: block;">
    </a>
  </div>

</div>

</div> 
</div>

<!-- ===== STYLE PENTRU CONTRIBUTE - FĂRĂ :ROOT ===== -->
<style>
/* ========== VARIABILE DOAR PENTRU CONTRIBUIE ========== */
.contribute-wrapper {
  --contribute-brand-1: #ff8c00;
  --contribute-brand-2: #ff5500;
  --contribute-brand-soft: rgba(255,140,0,0.1);
  --contribute-bg: var(--vp-c-bg);
  --contribute-bg-soft: var(--vp-c-bg-soft);
  --contribute-bg-mute: var(--vp-c-bg-mute);
  --contribute-divider: var(--vp-c-divider);
  --contribute-text-1: var(--vp-c-text-1);
  --contribute-text-2: var(--vp-c-text-2);
  --contribute-text-3: var(--vp-c-text-3);
  --contribute-bg-brightness: 0.7;
  --contribute-bg-opacity: 0.4;
  --contribute-icon-filter: none;
  --contribute-logo-filter: none;
}

/* Light theme override pentru contribute */
html:not(.dark) .contribute-wrapper {
  --contribute-bg: #ffffff;
  --contribute-bg-soft: #f8f8f8;
  --contribute-bg-mute: #f0f0f0;
  --contribute-divider: rgba(255,140,0,0.2);
  --contribute-text-1: #333333;
  --contribute-text-2: #666666;
  --contribute-text-3: #999999;
  --contribute-bg-brightness: 0.9;
  --contribute-bg-opacity: 0.2;
  --contribute-icon-filter: brightness(0.9);
  --contribute-logo-filter: brightness(0.9);
}

/* Dark theme override pentru contribute */
.dark .contribute-wrapper {
  --contribute-bg: #0a0a0a;
  --contribute-bg-soft: #141414;
  --contribute-bg-mute: #1f1f1f;
  --contribute-divider: rgba(255,140,0,0.2);
  --contribute-text-1: #e0e0e0;
  --contribute-text-2: #888;
  --contribute-text-3: #666;
  --contribute-bg-brightness: 0.7;
  --contribute-bg-opacity: 0.4;
  --contribute-icon-filter: none;
  --contribute-logo-filter: none;
}

/* ========== ANIMAȚII ========== */
@keyframes contribute-float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

@keyframes contribute-pulse {
  0% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.9; transform: scale(1); }
}

@keyframes contribute-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========== CONTRIBUTE WRAPPER ========== */
.contribute-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}

/* ========== INTRO CARD ========== */
.contribute-intro {
  background: var(--contribute-bg-soft);
  border: 1px solid var(--contribute-divider);
  border-radius: 24px;
  padding: 30px;
  margin: 30px 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.contribute-intro::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255,140,0,0.03) 0%, transparent 70%);
  animation: contribute-rotate 30s linear infinite;
  z-index: 0;
}

.contribute-intro-content {
  position: relative;
  z-index: 1;
}

.contribute-intro h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--contribute-text-1);
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.contribute-intro h2 svg {
  width: 36px;
  height: 36px;
  stroke: var(--contribute-brand-1);
  fill: none;
  animation: contribute-float 4s ease infinite;
}

.contribute-intro p {
  font-size: 17px;
  line-height: 1.7;
  color: var(--contribute-text-2);
  margin: 15px 0;
}

.contribute-highlight {
  color: var(--contribute-brand-1);
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.contribute-highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--contribute-brand-1), transparent);
  border-radius: 2px;
}

/* ========== STATS GRID ========== */
.contribute-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;
}

.contribute-stat {
  background: var(--contribute-bg-soft);
  border: 1px solid var(--contribute-divider);
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contribute-stat:hover {
  border-color: var(--contribute-brand-1);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255,140,0,0.1);
}

.contribute-stat::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,140,0,0.05), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.contribute-stat:hover::before {
  opacity: 1;
}

.contribute-stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255,140,0,0.1);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 1px solid rgba(255,140,0,0.2);
  transition: all 0.3s ease;
}

.contribute-stat:hover .contribute-stat-icon {
  background: rgba(255,140,0,0.15);
  transform: rotate(5deg);
}

.contribute-stat-icon svg {
  width: 32px;
  height: 32px;
  stroke: var(--contribute-brand-1);
  fill: none;
}

.contribute-stat-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--contribute-brand-1);
  line-height: 1.2;
  margin-bottom: 8px;
}

.contribute-stat-label {
  font-size: 15px;
  color: var(--contribute-text-2);
}

/* ========== CARDS GRID ========== */
.contribute-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin: 40px 0;
}

.contribute-card {
  background: var(--contribute-bg-soft);
  border: 1px solid var(--contribute-divider);
  border-radius: 24px;
  padding: 28px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contribute-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--contribute-brand-1), var(--contribute-brand-2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.contribute-card:hover::before {
  opacity: 1;
}

.contribute-card:hover {
  border-color: var(--contribute-brand-1);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255,140,0,0.1);
}

.contribute-card-icon {
  width: 56px;
  height: 56px;
  background: rgba(255,140,0,0.1);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 1px solid rgba(255,140,0,0.2);
  transition: all 0.3s ease;
}

.contribute-card:hover .contribute-card-icon {
  background: rgba(255,140,0,0.15);
  transform: rotate(5deg);
}

.contribute-card-icon svg {
  width: 30px;
  height: 30px;
  stroke: var(--contribute-brand-1);
  fill: none;
}

.contribute-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--contribute-text-1);
  margin: 0 0 15px 0;
  background: linear-gradient(135deg, var(--contribute-brand-1), var(--contribute-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contribute-card p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--contribute-text-2);
  margin: 0 0 20px 0;
}

.contribute-card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contribute-card-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  color: var(--contribute-text-2);
  font-size: 14px;
}

.contribute-card-list li svg {
  width: 18px;
  height: 18px;
  stroke: var(--contribute-brand-1);
  fill: none;
  flex-shrink: 0;
  margin-top: 2px;
}

.contribute-card-list li strong {
  color: var(--contribute-brand-1);
  font-weight: 600;
}

.contribute-card-badge {
  display: inline-block;
  background: rgba(255,140,0,0.1);
  border: 1px solid rgba(255,140,0,0.2);
  color: var(--contribute-brand-1);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 30px;
  margin-top: 15px;
}

/* ========== STEPS SECTION ========== */
.contribute-steps {
  margin: 50px 0;
}

.contribute-steps-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--contribute-text-1);
  margin: 0 0 30px 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.contribute-steps-title svg {
  width: 32px;
  height: 32px;
  stroke: var(--contribute-brand-1);
  fill: none;
}

.contribute-steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.contribute-step {
  background: var(--contribute-bg-soft);
  border: 1px solid var(--contribute-divider);
  border-radius: 24px;
  padding: 25px;
  position: relative;
  transition: all 0.3s ease;
}

.contribute-step:hover {
  border-color: var(--contribute-brand-1);
  transform: translateY(-5px);
}

.contribute-step-number {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--contribute-brand-1), var(--contribute-brand-2));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 22px;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(255,140,0,0.3);
}

.contribute-step h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--contribute-text-1);
  margin: 0 0 10px 0;
}

.contribute-step p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--contribute-text-2);
  margin: 0;
}

/* ========== REWARDS SECTION ========== */
.contribute-rewards {
  background: linear-gradient(145deg, var(--contribute-bg-soft), var(--contribute-bg));
  border: 1px solid var(--contribute-divider);
  border-radius: 28px;
  padding: 35px;
  margin: 50px 0;
  position: relative;
  overflow: hidden;
}

.contribute-rewards::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255,140,0,0.05) 0%, transparent 70%);
  animation: contribute-rotate 30s linear infinite;
}

.contribute-rewards-content {
  position: relative;
  z-index: 1;
}

.contribute-rewards h3 {
  font-size: 26px;
  font-weight: 700;
  color: var(--contribute-text-1);
  margin: 0 0 25px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.contribute-rewards h3 svg {
  width: 32px;
  height: 32px;
  stroke: var(--contribute-brand-1);
  fill: none;
}

.contribute-rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.contribute-reward {
  background: var(--contribute-bg);
  border: 1px solid var(--contribute-divider);
  border-radius: 18px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.contribute-reward:hover {
  border-color: var(--contribute-brand-1);
  transform: scale(1.05);
}

.contribute-reward-icon {
  width: 48px;
  height: 48px;
  background: rgba(255,140,0,0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
}

.contribute-reward-icon svg {
  width: 26px;
  height: 26px;
  stroke: var(--contribute-brand-1);
  fill: none;
}

.contribute-reward-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--contribute-brand-1);
  margin-bottom: 5px;
}

.contribute-reward-desc {
  font-size: 13px;
  color: var(--contribute-text-2);
}

/* ========== CTA SECTION ========== */
.contribute-cta {
  text-align: center;
  margin: 50px 0;
}

.contribute-cta-card {
  display: inline-block;
  background: var(--contribute-bg-soft);
  border: 1px solid var(--contribute-divider);
  border-radius: 40px;
  padding: 30px 50px;
  transition: all 0.3s ease;
}

.contribute-cta-card:hover {
  border-color: var(--contribute-brand-1);
  transform: scale(1.02);
  box-shadow: 0 15px 35px rgba(255,140,0,0.1);
}

.contribute-cta-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--contribute-text-1);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.contribute-cta-title svg {
  width: 28px;
  height: 28px;
  stroke: var(--contribute-brand-1);
  fill: none;
}

.contribute-cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.contribute-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contribute-cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.contribute-cta-btn:hover::before {
  left: 100%;
}

.contribute-cta-btn.primary {
  background: linear-gradient(135deg, var(--contribute-brand-1), var(--contribute-brand-2));
  color: white;
  box-shadow: 0 5px 20px rgba(255,140,0,0.3);
}

.contribute-cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255,140,0,0.4);
}

.contribute-cta-btn.secondary {
  background: transparent;
  border: 2px solid var(--contribute-divider);
  color: var(--contribute-text-1);
}

.contribute-cta-btn.secondary:hover {
  border-color: var(--contribute-brand-1);
  color: var(--contribute-brand-1);
  transform: translateY(-3px);
}

.contribute-cta-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  transition: transform 0.3s ease;
}

.contribute-cta-btn:hover svg {
  transform: rotate(5deg);
}

/* ========== FAQ SECTION ========== */
.contribute-faq {
  margin: 50px 0;
}

.contribute-faq-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--contribute-text-1);
  margin: 0 0 25px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.contribute-faq-title svg {
  width: 28px;
  height: 28px;
  stroke: var(--contribute-brand-1);
  fill: none;
}

.contribute-faq-item {
  background: var(--contribute-bg-soft);
  border: 1px solid var(--contribute-divider);
  border-radius: 18px;
  margin-bottom: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.contribute-faq-item:hover {
  border-color: var(--contribute-brand-1);
}

.contribute-faq-question {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 22px;
  cursor: pointer;
  background: var(--contribute-bg);
}

.contribute-faq-question svg {
  width: 20px;
  height: 20px;
  stroke: var(--contribute-brand-1);
  fill: none;
  transition: transform 0.3s ease;
}

.contribute-faq-question.active svg {
  transform: rotate(90deg);
}

.contribute-faq-question span {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--contribute-text-1);
}

.contribute-faq-arrow {
  width: 18px;
  height: 18px;
  stroke: var(--contribute-brand-1);
  fill: none;
  transition: transform 0.3s ease;
}

.contribute-faq-question.active .contribute-faq-arrow {
  transform: rotate(180deg);
}

.contribute-faq-answer {
  padding: 0 22px 22px 57px;
  color: var(--contribute-text-2);
  font-size: 15px;
  line-height: 1.6;
  border-top: 1px solid var(--contribute-divider);
  background: var(--contribute-bg-soft);
}

.contribute-faq-answer p {
  margin: 12px 0;
}

.contribute-faq-answer ul {
  margin: 10px 0;
  padding-left: 20px;
}

.contribute-faq-answer li {
  margin: 5px 0;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .contribute-grid,
  .contribute-steps-grid,
  .contribute-rewards-grid {
    grid-template-columns: 1fr;
  }
  
  .contribute-cta-card {
    padding: 20px 25px;
  }
  
  .contribute-cta-buttons {
    flex-direction: column;
  }
  
  .contribute-cta-btn {
    width: 100%;
    justify-content: center;
  }
  
  .contribute-faq-answer {
    padding: 0 18px 18px 47px;
  }
}
</style>

<!-- ================================================ -->
<!-- PAGINA CONTRIBUIE - WILDFIRE.RO -->
<!-- ================================================ -->

<div class="contribute-wrapper">

<StatsGithub/>

<!-- INTRO SECTION -->
<div class="contribute-intro">
  <div class="contribute-intro-content">
    <h2>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
        <path d="M12 16h.01"/>
      </svg>
      De ce să contribui?
    </h2>
    <p>Wildfire.ro e construit de <span class="contribute-highlight">oameni ca tine</span>. Fie că ai idei, găsești bug-uri, vrei să scrii cod sau doar să dai o mână de ajutor, orice contribuție contează.</p>
    <p>Nu trebuie să fii programator sau designer. Poți contribui în multe feluri, iar comunitatea noastră te va sprijini.</p>
  </div>
</div>

<!-- MAIN CARDS GRID -->
### <span style="display: none;">Cum poți contribui</span>
<div class="contribute-grid">

  <!-- Card 1: Developer -->
  <div class="contribute-card">
    <div class="contribute-card-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <polygon points="16 3 21 8 21 16 16 21 8 21 3 16 3 8 8 3 16 3"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
      </svg>
    </div>
    <h3>Developer</h3>
    <p>Contribuie la codul sursă al wiki-ului.</p>
    <ul class="contribute-card-list">
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>GitHub:</strong> Pull requests
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Bug fixing:</strong> Rezolvă issue-uri
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Funcționalități:</strong> Adaugă features noi
      </li>
    </ul>
    <span class="contribute-card-badge">#GitHub #OpenSource</span>
  </div>

  <!-- Card 2: Writer -->
  <div class="contribute-card">
    <div class="contribute-card-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    </div>
    <h3>Redactor conținut</h3>
    <p>Ajută la îmbunătățirea documentației și a articolelor din wiki.</p>
    <ul class="contribute-card-list">
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Corecturi:</strong> Gramatică, claritate
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Articole noi:</strong> Ghiduri, tutoriale
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Traduceri:</strong> Română/Engleză
      </li>
    </ul>
    <span class="contribute-card-badge">#Documentație #Scris</span>
  </div>

  <!-- Card 3: Designer -->
  <div class="contribute-card">
    <div class="contribute-card-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="2" y="2" width="20" height="20" rx="2.18"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
        <line x1="16" y1="2" x2="16" y2="22"/>
        <line x1="2" y1="8" x2="22" y2="8"/>
        <line x1="2" y1="16" x2="22" y2="16"/>
      </svg>
    </div>
    <h3>Designer</h3>
    <p>Contribuie la partea vizuală a wiki-ului și a site-ului.</p>
    <ul class="contribute-card-list">
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>UI/UX:</strong> Îmbunătățește interfața
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>SVG-uri:</strong> Iconițe, ilustrații
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>CSS:</strong> Stiluri, teme
      </li>
    </ul>
    <span class="contribute-card-badge">#UI #UX #Design</span>
  </div>

  <!-- Card 4: Tester -->
  <div class="contribute-card">
    <div class="contribute-card-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h3>Tester</h3>
    <p>Găsește bug-uri și oferă feedback pentru îmbunătățiri.</p>
    <ul class="contribute-card-list">
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Bug reports:</strong> Raportează probleme
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Feedback:</strong> Sugestii de features
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <strong>Testare:</strong> Experiență utilizator
      </li>
    </ul>
    <span class="contribute-card-badge">#Testing #QA</span>
  </div>

</div>

<!-- STEPS SECTION -->
### <span style="display: none;">Cum începi</span>
<div class="contribute-steps">
  <div class="contribute-steps-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
    Cum începi?
  </div>
  
  <div class="contribute-steps-grid">
    <div class="contribute-step">
      <div class="contribute-step-number">1</div>
      <h4>Alege cum vrei să ajuți</h4>
      <p>Din cardurile de mai sus, selectează zona în care te simți cel mai confortabil.</p>
    </div>
    
<div class="contribute-step">
      <div class="contribute-step-number">2</div>
      <h4>Intră pe Discord</h4>
      <p>Vino pe serverul nostru de Discord și anunță-ne că vrei să contribui.</p>
    </div>
    
 <div class="contribute-step">
      <div class="contribute-step-number">3</div>
      <h4>Începe cu un task mic</h4>
      <p>Nu trebuie să faci ceva măreț de la început. Orice ajutor e binevenit.</p>
    </div>
    
 <div class="contribute-step">
      <div class="contribute-step-number">4</div>
      <h4>Primești recunoaștere</h4>
      <p>Toți contributorii sunt menționați și primesc badge-uri speciale.</p>
    </div>
  </div>
</div>

<!-- REWARDS SECTION -->
### <span style="display: none;">Ce primești în schimb</span>
<div class="contribute-rewards">
  <div class="contribute-rewards-content">
    <h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Ce primești în schimb?
    </h3>
    
  <div class="contribute-rewards-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="contribute-reward">
        <div class="contribute-reward-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="contribute-reward-title">Rol de Contribuitor</div>
        <div class="contribute-reward-desc">Pe serverul de Discord</div>
      </div>
      
   <div class="contribute-reward">
        <div class="contribute-reward-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            <path d="M2 17L12 22L22 17"/>
          </svg>
        </div>
        <div class="contribute-reward-title">Nume pe wiki</div>
        <div class="contribute-reward-desc">Lista contributorilor</div>
      </div>
      
   <div class="contribute-reward">
        <div class="contribute-reward-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="contribute-reward-title">Fire Coins / Credite</div>
        <div class="contribute-reward-desc">Pentru contribuții notabile</div>
      </div>
    </div>
  </div>
</div>

<!-- FAQ SECTION -->
### <span style="display: none;">Întrebări frecvente</span>
<div class="contribute-faq">
  <div class="contribute-faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    Întrebări frecvente
  </div>
  
  <div class="contribute-faq-item">
    <div class="contribute-faq-question" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      <span>Nu știu să programez. Pot contribui oricum?</span>
      <svg class="contribute-faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="contribute-faq-answer" style="display: none;">
      <p>Absolut! Poți contribui ca redactor, tester, moderator sau doar cu idei. Nu e nevoie de cunoștințe tehnice pentru a ajuta comunitatea.</p>
    </div>
  </div>
  
  <div class="contribute-faq-item">
    <div class="contribute-faq-question" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      <span>Cum încep ca dezvoltator?</span>
      <svg class="contribute-faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="contribute-faq-answer" style="display: none;">
      <p>Intră pe GitHub-ul nostru, alege un fișier care necesită modificări și deschide un Pull Request. Dacă ai nevoie de ajutor, suntem pe Discord.</p>
    </div>
  </div>
  
  <div class="contribute-faq-item">
    <div class="contribute-faq-question" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      <span>Primesc ceva în schimb?</span>
      <svg class="contribute-faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="contribute-faq-answer" style="display: none;">
      <p>Da! Rol special pe Discord, recunoaștere publică, Fire Coins bonus și numele tău în lista de contribuitori de pe wiki.</p>
    </div>
  </div>
</div>

</div>