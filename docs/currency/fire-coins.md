---
outline: deep
---

<CaseHeader 
  title="Phoenix Coins"
  :tags="[
    { text: 'credite', component: 'PageTagRed' },
    { text: 'market', component: 'PageTagBlue' },
    { text: 'skinuri', component: 'PageTagGreen' },
    { text: 'economie', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Currency', 'Phoenix Coins']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  updated-by-username="iannc69"
  page-id="phoenix-coins"
  badge-text="Coins"
  badge-icon="lucide:coins"
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
.coin-number,
.highlight,
.badge,
.coin-badge,
.info-box li span .highlight,
.coin-content strong,
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
.coin-card .badge,
.coin-card .coin-badge,
.info-box .highlight,
.coin-stat-value,
.coin-stat-label,
.coin-step-number,
.coin-step-content strong,
.coin-type,
.coin-cta-btn,
.coin-question-text,
.coin-feature {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* Variabile CSS pentru ambele teme */
:root {
  --coin-card-bg: linear-gradient(145deg, #0f0f0f, #141414);
  --coin-card-border: rgba(255,140,0,0.2);
  --coin-text: #e0e0e0;
  --coin-badge-bg: #1e1e1e;
  --coin-badge-border: rgba(255,255,255,0.1);
  --coin-highlight: #ffae42;
  --coin-primary: #ff8c00;
  --coin-primary-dark: #cc7000;
  --info-box-bg: rgba(255,140,0,0.06);
  --info-box-border: rgba(255,140,0,0.25);
  --section-title-color: #ff8c00;
  --section-divider: linear-gradient(90deg, transparent, rgba(255,140,0,0.3), transparent);
  --coin-number-bg: rgba(255,140,0,0.15);
  --coin-number-border: rgba(255,140,0,0.3);
  --coin-number-text: #ff8c00;
}

/* Light theme override */
html:not(.dark) {
  --coin-card-bg: linear-gradient(145deg, #f8f8f8, #ffffff);
  --coin-card-border: rgba(255,140,0,0.3);
  --coin-text: #333333;
  --coin-badge-bg: #f0f0f0;
  --coin-badge-border: rgba(0,0,0,0.1);
  --coin-highlight: #ff8c00;
  --coin-primary: #ff8c00;
  --coin-primary-dark: #e67e00;
  --info-box-bg: rgba(255,140,0,0.04);
  --info-box-border: rgba(255,140,0,0.2);
  --section-title-color: #ff8c00;
  --section-divider: linear-gradient(90deg, transparent, rgba(255,140,0,0.4), transparent);
  --coin-number-bg: rgba(255,140,0,0.1);
  --coin-number-border: rgba(255,140,0,0.3);
  --coin-number-text: #ff8c00;
}

/* PREVENIRE SELECTARE IMAGINI SI ICONITE */
img, svg, .coin-icon, .coin-icon svg, .nav-icon, [class*="icon"] {
  user-select: none !important;
  -webkit-user-select: none !important;
  -webkit-user-drag: none !important;
  user-drag: none !important;
  pointer-events: none !important;
}

/* GRID */
.coin-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
}

/* CARD */
.coin-card {
  background: var(--coin-card-bg);
  border: 1px solid var(--coin-card-border);
  padding: 18px;
  border-radius: 14px;
  transition: .25s;
  line-height: 1.6;
  color: var(--coin-text);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.coin-card:hover {
  transform: translateY(-3px);
  border-color: #ff8c00;
  box-shadow: 0 8px 25px rgba(0,0,0,.15);
}

/* Icon container */
.coin-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: rgba(255,140,0,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--coin-card-border);
}

.coin-content {
  flex: 1;
}

/* BADGES */
.coin-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--coin-primary), var(--coin-primary-dark));
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
  background: var(--coin-badge-bg);
  border: 1px solid var(--coin-badge-border);
  color: var(--coin-text);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  margin: 2px 3px;
  font-weight: 500;
}

/* highlight */
.highlight {
  color: var(--coin-highlight);
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
  color: var(--coin-text);
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

/* Stil pentru număr */
.coin-number {
  display: inline-block;
  background: var(--coin-number-bg);
  color: var(--coin-number-text);
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 10px;
  margin-bottom: 5px;
  border: 1px solid var(--coin-number-border);
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
  color: var(--coin-text);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-box li svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  stroke: var(--coin-highlight);
  fill: none;
  margin-top: 2px;
}

/* Hover effect pentru titluri personalizate */
.title-hover:hover {
  transform: translateX(5px);
}

/* SVG-uri în dark mode */
.dark .nav-icon,
.dark .coin-icon svg,
.dark .section-title svg,
.dark .info-box li svg {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

/* SVG-uri în light mode */
:not(.dark) .nav-icon,
:not(.dark) .coin-icon svg,
:not(.dark) .section-title svg,
:not(.dark) .info-box li svg {
  filter: brightness(0.4);
  opacity: 0.8;
}

/* Stats cards */
.coin-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin: 30px 0;
}

.coin-stat {
  background: var(--coin-card-bg);
  border: 1px solid var(--coin-card-border);
  border-radius: 18px;
  padding: 20px 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.coin-stat:hover {
  border-color: var(--coin-primary);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255,140,0,0.1);
}

.coin-stat-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--coin-primary);
  line-height: 1.2;
  margin-bottom: 8px;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.coin-stat-label {
  font-size: 11px;
  color: var(--coin-text);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Orbitron', sans-serif !important;
}

/* Feature grid */
.coin-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.coin-feature {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,140,0,0.05);
  border: 1px solid rgba(255,140,0,0.2);
  border-radius: 30px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--coin-text);
  transition: all 0.3s ease;
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.coin-feature:hover {
  border-color: var(--coin-primary);
  color: var(--coin-primary);
  background: rgba(255,140,0,0.1);
}

.coin-feature svg {
  stroke: var(--coin-primary);
  width: 14px;
  height: 14px;
  fill: none;
}

/* CTA Buttons */
.coin-cta {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px 0 20px;
}

.coin-cta-btn {
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

.coin-cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.coin-cta-btn:hover::before {
  left: 100%;
}

.coin-cta-btn.primary {
  background: linear-gradient(135deg, var(--coin-primary), var(--coin-primary-dark));
  color: white;
  box-shadow: 0 5px 20px rgba(255,140,0,0.3);
}

.coin-cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255,140,0,0.4);
}

.coin-cta-btn.secondary {
  background: transparent;
  border: 2px solid var(--coin-card-border);
  color: var(--coin-text);
}

.coin-cta-btn.secondary:hover {
  border-color: var(--coin-primary);
  color: var(--coin-primary);
  transform: translateY(-3px);
}

.coin-cta-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  transition: transform 0.3s ease;
}

.coin-cta-btn:hover svg {
  transform: rotate(5deg);
}

/* Responsive */
@media (max-width: 768px) {
  .coin-card {
    padding: 15px;
    flex-direction: column;
    gap: 8px;
  }
  
  .badge, .coin-badge {
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
  
  .coin-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .coin-cta {
    flex-direction: column;
  }
  
  .coin-cta-btn {
    width: 100%;
    justify-content: center;
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>

<!-- INTRO COIN CARD -->
<div class="coin-card" style="margin-bottom: 25px;">
  <div class="coin-icon">
    <Icon icon="lucide:coins" :size="16" />
  </div>
  <div class="coin-content">
    <span class="coin-number">PHOENIX COINS</span> <span class="highlight">Moneda serverului</span>
    <p>Phoenix Coins sunt moneda virtuală a comunității Wildfire. Le poți folosi pentru a cumpăra skin-uri, cutii, efecte speciale și multe altele, atât pe server cât și pe site.</p>
    <div class="coin-features">
      <span class="coin-feature">
        <Icon icon="lucide:check" :size="12" />
        Skin-uri personalizate
      </span>
      <span class="coin-feature">
        <Icon icon="lucide:check" :size="12" />
        Cutii premium
      </span>
      <span class="coin-feature">
        <Icon icon="lucide:check" :size="12" />
        Efecte speciale
      </span>
      <span class="coin-feature">
        <Icon icon="lucide:check" :size="12" />
        Culori chat
      </span>
    </div>
  </div>
</div>

<!-- 1.0 CUM OBȚII PHOENIX COINS -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><Icon icon="lucide:trending-up" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />1.0 CUM OBȚII PHOENIX COINS</span>
</div>

<div class="coin-grid">

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:trophy" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Jucând meciuri</span> Câștigi coins pentru fiecare meci jucat:
      <div style="display: flex; gap: 15px; flex-wrap: wrap; margin: 10px 0 0 0;">
        <div><span class="coin-badge">Victoria: +5 coins</span></div>
        <div><span class="coin-badge">Înfrângere: +2 coins</span></div>
        <div><span class="coin-badge">Remiză: +1 coin</span></div>
      </div>
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:star" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Performanță individuală</span> Bonusuri pentru acțiuni în timpul meciului:
      <div class="coin-features" style="margin-top: 10px;">
        <span class="coin-feature">MVP: +3 coins</span>
        <span class="coin-feature">Kill: +1 coin</span>
        <span class="coin-feature">Headshot: +2 coins</span>
        <span class="coin-feature">Assist: +1 coin</span>
        <span class="coin-feature">Clutch: +5 coins</span>
      </div>
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:calendar" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Bonus zilnic</span> Conectează-te zilnic pentru a primi bonus:
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
        <span class="coin-badge">Ziua 1: 50 coins</span>
        <span class="coin-badge">Ziua 2: 75 coins</span>
        <span class="coin-badge">Ziua 3: 100 coins</span>
        <span class="coin-badge">Ziua 4: 125 coins</span>
        <span class="coin-badge">Ziua 5: 150 coins</span>
        <span class="coin-badge">Ziua 6: 200 coins</span>
        <span class="coin-badge">Ziua 7+: 250 coins</span>
      </div>
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:gem" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Gold Member</span> Dacă deții gradul Gold Member, primești <span class="highlight">+50% coins</span> la toate câștigurile din meciuri.
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:party-popper" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Evenimente speciale</span> Participă la evenimentele săptămânale pentru premii bonus și coins înmulțiți.
    </div>
  </div>

</div>

<div class="section-divider"></div>

<!-- 2.0 CE POȚI CUMPĂRA -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><Icon icon="lucide:shopping-cart" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />2.0 CE POȚI CUMPĂRA CU PHOENIX COINS</span>
</div>

<div class="coin-grid">

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:package" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Cutii</span> Deschide cutii pentru a primi skin-uri, cuțite și mănuși:
      <div class="coin-features" style="margin-top: 10px;">
        <span class="coin-feature">Cutie Standard: 100 coins</span>
        <span class="coin-feature">Cutie Premium: 250 coins</span>
        <span class="coin-feature">Cutie Legendary: 500 coins</span>
        <span class="coin-feature">Cutie Gold: 1000 coins</span>
      </div>
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:palette" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Skin-uri personalizate</span> Cumpără skin-uri direct din shop-ul serverului:
      <div class="coin-features" style="margin-top: 10px;">
        <span class="coin-feature">Skin-uri normale: 50-200 coins</span>
        <span class="coin-feature">Skin-uri rare: 200-500 coins</span>
        <span class="coin-feature">Skin-uri legendare: 500-1500 coins</span>
        <span class="coin-feature">Skin-uri exclusive: 1500+ coins</span>
      </div>
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:sword" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Cuțite și mănuși</span> 
      <p>Cuțite: <span class="highlight">200-1500 coins</span></p>
      <p>Mănuși: <span class="highlight">300-1200 coins</span></p>
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:message-square" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">Tag-uri și efecte</span>
      <div class="coin-features" style="margin-top: 10px;">
        <span class="coin-feature">Culoare chat: 50 coins (permanent)</span>
        <span class="coin-feature">Tag personalizat: 100 coins</span>
        <span class="coin-feature">Efect kill: 150 coins</span>
        <span class="coin-feature">MVP animat: 200 coins</span>
      </div>
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:crown" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">VIP temporar</span> Cumpără acces VIP pentru perioade limitate:
      <div class="coin-features" style="margin-top: 10px;">
        <span class="coin-feature">VIP 7 zile: 500 coins</span>
        <span class="coin-feature">VIP 30 zile: 1500 coins</span>
        <span class="coin-feature">VIP 90 zile: 4000 coins</span>
      </div>
    </div>
  </div>

</div>

<div class="section-divider"></div>

<!-- 3.0 COMENZI UTILE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="orbitron-font"><Icon icon="lucide:terminal" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />3.0 COMENZI UTILE</span>
</div>

<div class="coin-grid">

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:wallet" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!coins</span> - Verifică câte Phoenix Coins ai în cont
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:package" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!shop</span> - Deschide shop-ul serverului
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:gift" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!case</span> - Deschide meniul de cutii
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:palette" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!ws</span> - Deschide meniul de skin-uri (poți cumpăra direct)
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:sword" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!knife</span> - Deschide meniul de cuțite
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:hand" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!glove</span> - Deschide meniul de mănuși
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:crown" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!vip</span> - Deschide meniul VIP
    </div>
  </div>

  <div class="coin-card">
    <div class="coin-icon">
      <Icon icon="lucide:message-square" :size="16" />
    </div>
    <div class="coin-content">
      <span class="coin-number">!tag</span> - Deschide meniul de tag-uri și culori chat
    </div>
  </div>

</div>

<!-- INFO BOX -->
<div class="info-box">
  <ul>
    <li>
      <Icon icon="lucide:info" :size="20" />
      <span>Phoenix Coins sunt <span class="highlight">non-transferabile</span> între conturi. Fiecare jucător își gestionează propriile coins.</span>
    </li>
    <li>
      <Icon icon="lucide:gift" :size="20" />
      <span>Poți cumpăra Phoenix Coins și cu bani reali din <span class="highlight">market-ul site-ului</span> la adresa <code>wildfire.ro/market</code>.</span>
    </li>
    <li>
      <Icon icon="lucide:clock" :size="20" />
      <span>Bonusul zilnic se resetează la ora <span class="highlight">00:00</span>. Nu uita să-l revendici în fiecare zi!</span>
    </li>
    <li>
      <Icon icon="lucide:alert-triangle" :size="20" />
      <span>Orice tentativă de <span class="highlight">exploatare a bug-urilor</span> pentru a obține coins va fi sancționată cu ban permanent.</span>
    </li>
  </ul>
</div>

