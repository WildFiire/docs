---
outline: deep
---

<div class="cases-wf">


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
    <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Systems</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-text-2);" class="orbitron-font">Cases</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 6px;">
    <Icon icon="lucide:box" :size="18" />
    <span style="font-size: 12px; color: var(--vp-c-text-2);" class="orbitron-font">Case Opening</span>
  </div>
</div>

<!-- RÂND 1 - logo și titlu -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
  <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
  
  <!-- TITLU CU GRADIENT ANIMAT -->
  <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: gradientShift 6s ease infinite; font-weight: 700;" class="orbitron-font">
    Cases
  </h1>
</div>

<!-- RAND 2 - tags si updated by -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">

  <!-- Tags in stanga -->
  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
    <PageTagRed style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">cases</PageTagRed>
    <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">skins</PageTagBlue>
    <PageTagGreen style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">market</PageTagGreen>
    <PageTagPurple style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">website</PageTagPurple>
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

<style>
/* ===== CASES-WF STYLES - PREMIUM ===== */
.cases-wf {
  --cases-card-bg: linear-gradient(145deg, #0f0f0f, #141414);
  --cases-card-border: rgba(255,140,0,0.25);
  --cases-text: #e0e0e0;
  --cases-badge-bg: #1e1e1e;
  --cases-badge-border: rgba(255,255,255,0.1);
  --cases-highlight: #ffae42;
  --cases-primary: #ff8c00;
  --cases-info-bg: rgba(255,140,0,0.06);
  --cases-info-border: rgba(255,140,0,0.25);
  --cases-number-bg: rgba(255,140,0,0.15);
  --cases-number-border: rgba(255,140,0,0.3);
}

html:not(.dark) .cases-wf {
  --cases-card-bg: linear-gradient(145deg, #f8f8f8, #ffffff);
  --cases-card-border: rgba(255,140,0,0.35);
  --cases-text: #333333;
  --cases-badge-bg: #f0f0f0;
  --cases-badge-border: rgba(0,0,0,0.1);
  --cases-highlight: #ff8c00;
  --cases-info-bg: rgba(255,140,0,0.04);
  --cases-info-border: rgba(255,140,0,0.2);
  --cases-number-bg: rgba(255,140,0,0.1);
}

.cases-wf .cases-orbitron {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

/* CARD */
.cases-wf .cases-card {
  background: var(--cases-card-bg);
  border: 1px solid var(--cases-card-border);
  padding: 20px;
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  line-height: 1.6;
  color: var(--cases-text);
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.cases-wf .cases-card:hover {
  transform: translateY(-4px);
  border-color: #ff8c00;
  box-shadow: 0 12px 28px rgba(255,140,0,0.2);
}

.cases-wf .cases-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,140,0,0.05));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,140,0,0.3);
  transition: all 0.2s ease;
}

.cases-wf .cases-card:hover .cases-icon {
  transform: scale(1.05);
  border-color: #ff8c00;
  background: rgba(255,140,0,0.2);
}

.cases-wf .cases-content {
  flex: 1;
  width: 100%;
}

.cases-wf .cases-content p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.65;
}

/* HIGHLIGHT */
.cases-wf .cases-highlight {
  color: var(--cases-highlight);
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
  position: relative;
  display: inline-block;
}

.cases-wf .cases-highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  opacity: 0.4;
  border-radius: 2px;
}

/* BADGE */
.cases-wf .cases-badge {
  display: inline-block;
  background: var(--cases-badge-bg);
  border: 1px solid var(--cases-badge-border);
  color: var(--cases-text);
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  font-family: 'Orbitron', sans-serif;
}

/* INFO BOX */
.cases-wf .cases-info-box {
  margin-top: 40px;
  background: var(--cases-info-bg);
  border: 1px solid var(--cases-info-border);
  border-radius: 18px;
  padding: 24px;
  line-height: 1.7;
  color: var(--cases-text);
}

.cases-wf .cases-info-box ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.cases-wf .cases-info-box li {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 14px;
}

.cases-wf .cases-info-box li svg {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  stroke: var(--cases-highlight);
  fill: none;
  margin-top: 2px;
}

/* NUMBER */
.cases-wf .cases-number {
  display: inline-block;
  background: var(--cases-number-bg);
  color: var(--cases-highlight);
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 24px;
  font-size: 12px;
  margin-right: 10px;
  margin-bottom: 6px;
  border: 1px solid var(--cases-number-border);
  font-family: 'Orbitron', sans-serif;
}

/* BOXES */
.cases-wf .cases-important {
  background: rgba(255,140,0,0.12);
  border-left: 4px solid #ff8c00;
  padding: 14px 20px;
  border-radius: 12px;
  margin: 18px 0;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.cases-wf .cases-tip {
  background: rgba(0,200,0,0.08);
  border-left: 4px solid #00c851;
  padding: 14px 20px;
  border-radius: 12px;
  margin: 18px 0;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}



.cases-wf .cases-title-hover:hover {
  transform: translateX(6px);
}

/* ===== GIF BOX - DOAR POZELE CENTRATE, RESTUL NORMAL ===== */
.cases-wf .cases-gif-box {
  margin: 20px 0 10px 0;
  text-align: center;
  background: transparent;
  border-radius: 20px;
  padding: 0;
  border: none;
  cursor: pointer;
  overflow: hidden;
  line-height: 0;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cases-wf .cases-gif-box img {
  width: 100%;
  max-width: 1000px;
  height: auto;
  display: block;
  border-radius: 16px;
  border: 3px solid rgba(255,140,0,0.5);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  object-fit: contain;
}

/* KEY ROW - ALINIAT NORMAL */
.cases-wf .cases-key-row {
  display: flex;
  gap: 14px;
  margin: 18px 0;
  flex-wrap: wrap;
}

.cases-wf .cases-key-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.cases-wf .cases-key-item:hover {
  transform: translateX(4px);
}

.cases-wf .cases-key-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 2px solid #ff8c00;
  color: #ff8c00;
  font-family: 'Orbitron', monospace;
  font-weight: 800;
  font-size: 16px;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  box-shadow: 0 3px 0 rgba(0,0,0,0.3);
  transition: all 0.1s ease;
}

.cases-wf .cases-key-button:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.3);
}

html:not(.dark) .cases-wf .cases-key-button {
  background: linear-gradient(145deg, #e8e8e8, #d8d8d8);
}

/* CUSTOM LIST */
.cases-wf .cases-custom-list {
  list-style: none;
  padding-left: 0;
}

.cases-wf .cases-custom-list li {
  margin: 12px 0;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 14px;
}

.cases-wf .cases-custom-list svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  stroke: #ff8c00;
  margin-top: 2px;
}

/* TITLURI - ALINIATE STÂNGA */
.cases-wf .cases-title-hover {
  transition: transform 0.3s ease;
  text-align: left;
}

.cases-wf .cases-title-hover:hover {
  transform: translateX(6px);
}

.cases-wf .cases-title-hover span {
  text-align: left;
}

@keyframes cases-gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; }
  .cases-wf .cases-icon { width: 32px; height: 32px; }
  .cases-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; }
  .cases-wf .cases-gif-box img { max-width: 100%; }
}
</style>

<!-- INTRO - DESCRIERE SISTEM -->
<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:gift" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <span class="cases-number">Sistemul de Cutii</span> <span class="cases-highlight">Cases System</span>
    <p>Sistemul de cutii de pe Wildfire este o funcționalitate integrată a pieței de skin-uri, permițând jucătorilor să utilizeze monedele lor <span class="cases-highlight">(Phoenix Coins)</span> pentru a debloca diverse cutii și a câștiga skin-uri de CS2. Sistemul a fost creat pentru a fi complet <span class="cases-highlight">transparent, corect</span> și pentru a elimina frustrarea obținerii de skin-uri duplicate.</p>
    <p>Când jucătorul se află pe server, armele câștigate apar sau se updatează automat direct în loadout (sau prin meniul <code>!ws</code>), nefiind necesară vreo relogare de pe joc. Skin-urile și prețurile lor sunt bazate pe <span class="cases-highlight">prețurile reale ale armelor de pe Steam Community Market</span>.</p>
  </div>
</div>


<!-- 1.0 COMENDA !cases & NAVIGARE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 COMENDA !cases & NAVIGARE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:box" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 COMENDA !cases & NAVIGARE</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:command" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="cases-highlight">tastatură</span>.</p>
    <div class="cases-important">
      <Icon icon="lucide:info" width="24" height="24" color="#ff8c00" />
      <span> Scrie <code>!cases</code> în chat pentru a deschide interfața principală a <span class="cases-highlight">cutiilor</span>.</span>
    </div>
    <div class="cases-gif-box">
      <img src="/crates/cases_gif.gif" alt="Navigare cutii">
    </div>
    <p>Navigarea prin meniu se face cu ajutorul tastelor, exact ca într-un joc adevărat:</p>
    <div class="cases-key-row">
      <div class="cases-key-item"><span class="cases-key-button">E</span><span>Tasta <span class="cases-highlight">E</span> - <strong>Selectează</strong> cutia</span></div>
      <div class="cases-key-item"><span class="cases-key-button">F</span><span>Tasta <span class="cases-highlight">F</span> - <strong>Navighează în sus</strong></span></div>
      <div class="cases-key-item"><span class="cases-key-button">S</span><span>Tasta <span class="cases-highlight">SHIFT</span> - <strong>Navighează în jos</strong></span></div>
    </div>
    <div class="cases-tip">
      <span>Meniul principal îți va afișa toate <span class="cases-highlight">cutiile disponibile</span>, cu preview-uri clare și prețul fiecăreia.</span>
    </div>
    <div class="cases-gif-box">
      <img src="/crates/gif_case2.gif" alt="Interfața cutiilor">
    </div>
  </div>
</div>


<!-- 2.0 DESCHIDE CUTIA & INSTANT EQUIP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 DESCHIDE CUTIA & INSTANT EQUIP</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gem" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 DESCHIDE CUTIA & INSTANT EQUIP</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:box" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>După ce ai selectat cutia, sistemul simulează deschiderea în stilul clasic. Noutatea principală este că <span class="cases-highlight">skin-ul câștigat îți este echipat instantaneu</span> pe arma respectivă.</p>
    <div class="cases-important">
      <span>Imediat ce ai deschis cutia, <span class="cases-highlight">skin-ul este adăugat în inventar</span> și <span class="cases-highlight">echipat automat</span>. Nu mai trebuie să intri în meniul de inventar.</span>
    </div>
    <p>Fiecare skin câștigat este <span class="cases-highlight">anunțat în chat-ul public</span> pentru toți jucătorii.</p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:message-square" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Anunț în Chat:</span> <code>"Player X opened a case and receivedSkin Name! [Skin Rarity] "</code></span></li>
      <li><Icon icon="lucide:armchair" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Echipare Automată:</span> Skin-ul apare pe arma ta în mână în mai puțin de o secundă.</span></li>
    </ul>
    <div class="cases-gif-box">
      <img src="/crates/gif_case3.gif" alt="Deschidere cutie cu instant equip">
    </div>
  </div>
</div>


<!-- 3.0 ANTI-DUPLICATE & REFUND -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 ANTI-DUPLICATE & REFUND</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:refresh-cw" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 ANTI-DUPLICATE & REFUND</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:refresh-cw" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Sistemul elimină complet frustrarea obținerii de <span class="cases-highlight">skin-uri duplicate</span>. Dacă primești un skin pe care îl deții deja, primești un refund corect.</p>
    <div class="cases-important">
      <span>Dacă skin-ul extras există deja în <span class="cases-highlight">inventarul tău</span>, primești înapoi <span class="cases-highlight">50% din valoarea skin-ului</span> în Phoenix Coins.</span>
    </div>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span>Sistemul verifică dacă ai deja <span class="cases-highlight">skin-ul în inventar</span>.</span></li>
      <li><Icon icon="lucide:wallet" width="18" height="18" color="#ff8c00" /><span>Dacă da, primești un <span class="cases-highlight">refund în monedele serverului</span>.</span></li>
      <li><Icon icon="lucide:message-circle" width="18" height="18" color="#ff8c00" /><span>Mesaj în chat: <code>"You already own this skin! You received a refund of X credits."</code></span></li>
    </ul>
    <div class="cases-gif-box">
      <img src="/crates/gif4.gif" alt="Anti-Duplicate & Refund">
    </div>
  </div>
</div>


<!-- 4.0 DESCHIDERE CUTII PE SITE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.0 DESCHIDERE CUTII PE SITE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:monitor" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 DESCHIDERE CUTII PE SITE</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:monitor" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Accesează <span class="cases-highlight">wildfire.ro/skins-market</span> și conectează-te cu contul tău Steam. După autentificare, vei avea acces la dashboard, unde sunt disponibile mai multe sectiuni, printre care si <span class="cases-highlight">Cases</span>.</p>
<div class="cases-important">
  <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
    <Icon icon="lucide:info" width="24" height="24" color="#ff8c00" style="flex-shrink: 0;" />
    <span style="flex: 1;">Dacă dai <span class="cases-highlight">click dreapta</span> pe o cutie, poți vedea conținutul acesteia fără a o deschide - perfect pentru a verifica ce skin-uri poți câștiga.</span>
  </div>
</div>
    <div class="cases-gif-box">
      <img src="/crates/site_case_1.gif" alt="Deschidere cutii pe site - click dreapta preview">
    </div>
  </div>
</div>


<!-- 4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:layout-grid" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:layout-grid" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Interfața web prezintă toate cutiile disponibile, grupate pe categorii: <span class="cases-highlight">Exclusive, Premium, Standard</span>. Fiecare cutie afișează:</p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /><span>Numele cutiei</span></li>
      <li><Icon icon="lucide:coins" width="18" height="18" color="#ff8c00" /><span>Prețul în Phoenix Coins</span></li>
      <li><Icon icon="lucide:bar-chart-2" width="18" height="18" color="#ff8c00" /><span>Numărul de deschideri totale</span></li>
      <li><Icon icon="lucide:star" width="18" height="18" color="#ff8c00" /><span>Skin-ul cel mai rar disponibil</span></li>
    </ul>
    <div class="cases-gif-box">
      <img src="/crates/site_case_2.gif" alt="Interfața și cutiile disponibile">
    </div>
  </div>
</div>


<!-- 4.2 SELECTAREA CUTIEI & LIVE FEED -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.2 SELECTAREA CUTIEI & LIVE FEED</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.2 SELECTAREA CUTIEI & LIVE FEED</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:mouse-pointer-click" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>După ce selectezi o cutie, se deschide panoul detaliat care include:</p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:square-arrow-out-up-right" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Butoane de deschidere:</span> OPEN (x1), OPEN X3, OPEN X5</span></li>
      <li><Icon icon="lucide:zap" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">QUICK OPEN:</span> Activează modul rapid pentru deschideri fără animații</span></li>
      <li><Icon icon="lucide:activity" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Live Feed:</span> Poți vedea în timp real ce skin-uri au câștigat alți jucători</span></li>
    </ul>
    <div class="cases-tip" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
      <Icon icon="lucide:lightbulb" width="24" height="24" color="#00c851" style="flex-shrink: 0;" />
      <span style="flex: 1;">Odată activat, poți deschide cutii instantaneu - perfect pentru sesiuni mari de deschideri.</span>
    </div>
    <div class="cases-gif-box">
      <img src="/crates/site_case_3.gif" alt="Selectarea cutiei, butoane x3 x5 quick open, live feed">
    </div>
  </div>
</div>


<!-- 4.3 DESCHIDERE CUTIE & ANIMAȚIE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.3 DESCHIDERE CUTIE & ANIMAȚIE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:sparkles" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.3 DESCHIDERE CUTIE & ANIMAȚIE</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:sparkles" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>După ce apeși butonul de deschidere, sistemul rulează animația specifică cutiei, iar la final primești skin-ul câștigat. Acesta este adăugat automat în inventarul tău.</p>
<div class="cases-important">
  <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
    <Icon icon="lucide:refresh-cw" width="24" height="24" color="#ff8c00" style="flex-shrink: 0;" />
    <span style="flex: 1;"><span class="cases-highlight">INSTANT SYNC:</span> Toate skin-urile deschise pe site sunt sincronizate automat cu inventarul tău din joc.</span>
  </div>
</div>
    <div class="cases-gif-box">
      <img src="/crates/site_case_4.gif" alt="Deschidere cutie și animație">
    </div>
  </div>
</div>


<!-- 4.4 INVENTARUL TĂU -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.4 INVENTARUL TĂU</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.4 INVENTARUL TĂU</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Toate skin-urile câștigate sunt salvate în secțiunea <span class="cases-highlight">Inventory</span> a site-ului. Aici poți:</p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span>Vizualiza toate skin-urile deținute</span></li>
      <li><Icon icon="lucide:tag" width="18" height="18" color="#ff8c00" /><span>Verifica valoarea fiecărui skin</span></li>
      <li><Icon icon="lucide:clock" width="18" height="18" color="#ff8c00" /><span>Vedea istoricul complet al deschiderilor</span></li>
    </ul>
<div class="cases-tip" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
  <Icon icon="lucide:lightbulb" width="24" height="24" color="#00c851" style="flex-shrink: 0;" />
  <span style="flex: 1;">Poți accesa inventarul și din joc folosind comanda <code>!inv</code> sau meniul <code>!ws</code> → My Inventory.</span>
</div>
    <div class="cases-gif-box">
      <img src="/crates/site_case_5.gif" alt="Inventarul tău pe site">
    </div>
  </div>
</div>


<!-- 4.5 FREE SPIN ZILNIC -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.5 FREE SPIN ZILNIC</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.5 FREE SPIN ZILNIC</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:gift" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Fiecare jucător primește o <span class="cases-highlight">rotire gratuită zilnic</span> pe site. Aceasta poate fi folosită pentru obtinerea de <span class="cases-highlight">Phoenix Coins</span>.</p>
<div class="cases-important">
  <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
    <Icon icon="lucide:gift" width="24" height="24" color="#ff8c00" style="flex-shrink: 0;" />
    <span style="flex: 1;"><span class="cases-highlight">FREE SPIN:</span> Bonusul se resetează în fiecare zi la ora <span class="cases-highlight">00:00 (server time)</span>. Nu uita să-l revendici zilnic!</span>
  </div>
</div>
<div class="cases-tip" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
  <Icon icon="lucide:lightbulb" width="24" height="24" color="#00c851" style="flex-shrink: 0;" />
  <span style="flex: 1;">Conectează-te zilnic pe <code>wildfire.ro/skins-market</code> pentru a nu pierde rotirea gratuită! Este cea mai simplă modalitate de a-ți completa colecția fără costuri.</span>
</div>
<div class="cases-tip" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
  <Icon icon="lucide:lightbulb" width="24" height="24" color="#00c851" style="flex-shrink: 0;" />
  <span style="flex: 1;">Sistemul de free spin are si un "istoric"" care poate fi accesat.</span>
</div>
    <div class="cases-gif-box">
      <img src="/crates/site_spin.gif" alt="Free Spin zilnic pe site">
    </div>
  </div>
</div>

<!-- INFO BOX FINAL -->
<div class="cases-info-box">
  <ul>
    <li>
      <Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" />
      <span><span class="cases-highlight">Atenție!</span> Sistemul de cutii este în continuă dezvoltare. Îți recomandăm să verifici mereu <span class="cases-highlight">lista de recompense</span> înainte de a deschide o cutie. <span class="cases-highlight">Noroc și cât mai multe skin-uri rare!</span></span>
    </li>
  </ul>
</div>

</div>