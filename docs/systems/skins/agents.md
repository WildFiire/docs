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
    <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Skins</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-text-2);" class="orbitron-font">Agents</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 6px;">
    <Icon icon="lucide:users" :size="18" />
    <span style="font-size: 12px; color: var(--vp-c-text-2);" class="orbitron-font">Operators</span>
  </div>
</div>

<!-- RÂND 1 - logo și titlu -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
  <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
  
  <!-- TITLU CU GRADIENT ANIMAT -->
  <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: gradientShift 6s ease infinite; font-weight: 700;" class="orbitron-font">
    Agents
  </h1>
</div>

<!-- RAND 2 - tags si updated by -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">

  <!-- Tags in stanga -->
  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
    <PageTagPurple style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">agents</PageTagPurple>
    <PageTagGreen style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">operators</PageTagGreen>
    <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">characters</PageTagBlue>
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
/* ===== AGENTS-WF STYLES ===== */
.cases-wf {
  --cases-card-bg: linear-gradient(145deg, #0f0f0f, #141414);
  --cases-card-border: rgba(255,140,0,0.2);
  --cases-text: #e0e0e0;
  --cases-badge-bg: #1e1e1e;
  --cases-badge-border: rgba(255,255,255,0.08);
  --cases-highlight: #ffae42;
  --cases-primary: #ff8c00;
  --cases-info-bg: rgba(255,140,0,0.04);
  --cases-info-border: rgba(255,140,0,0.15);
  --cases-number-bg: rgba(255,140,0,0.1);
  --cases-number-border: rgba(255,140,0,0.2);
}

html:not(.dark) .cases-wf {
  --cases-card-bg: linear-gradient(145deg, #f8f8f8, #ffffff);
  --cases-card-border: rgba(255,140,0,0.2);
  --cases-text: #333333;
  --cases-badge-bg: #f0f0f0;
  --cases-badge-border: rgba(0,0,0,0.08);
  --cases-highlight: #ff8c00;
  --cases-info-bg: rgba(255,140,0,0.02);
  --cases-info-border: rgba(255,140,0,0.12);
  --cases-number-bg: rgba(255,140,0,0.08);
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
  transition: all 0.2s ease;
  line-height: 1.6;
  color: var(--cases-text);
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.cases-wf .cases-card:hover {
  border-color: rgba(255,140,0,0.4);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.cases-wf .cases-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: rgba(255,140,0,0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,140,0,0.15);
  transition: all 0.2s ease;
}

.cases-wf .cases-card:hover .cases-icon {
  background: rgba(255,140,0,0.12);
  border-color: rgba(255,140,0,0.3);
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
  border-radius: 20px;
  font-size: 12px;
  margin-right: 10px;
  margin-bottom: 6px;
  border: 1px solid var(--cases-number-border);
  font-family: 'Orbitron', sans-serif;
}

/* BOXES */
.cases-wf .cases-important {
  background: rgba(255,140,0,0.06);
  border-left: 3px solid #ff8c00;
  padding: 14px 20px;
  border-radius: 12px;
  margin: 18px 0;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.cases-wf .cases-tip {
  background: rgba(0,200,0,0.05);
  border-left: 3px solid #00c851;
  padding: 14px 20px;
  border-radius: 12px;
  margin: 18px 0;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.cases-wf .cases-title-hover {
  transition: transform 0.2s ease;
  text-align: left;
}

.cases-wf .cases-title-hover:hover {
  transform: translateX(5px);
}

/* KEY ROW - TASTE */
.cases-wf .cases-key-row {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.cases-wf .cases-key-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  transition: all 0.2s ease;
}

.cases-wf .cases-key-item:hover {
  transform: translateX(3px);
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
  font-size: 18px;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  box-shadow: 0 3px 0 rgba(0,0,0,0.3);
  transition: all 0.1s ease;
}

.cases-wf .cases-key-button:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.3);
}

.cases-wf .cases-key-button.shift-btn {
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: 60px;
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
  margin: 10px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
}

.cases-wf .cases-custom-list svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  stroke: #ff8c00;
  margin-top: 2px;
}

/* AGENTS GRID */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.agent-card {
  background: var(--cases-card-bg);
  border: 1px solid var(--cases-card-border);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
  text-align: center;
}

.agent-card:hover {
  border-color: rgba(255,140,0,0.5);
  transform: translateY(-4px);
}

.agent-img-wrap {
  background: linear-gradient(135deg, rgba(255,140,0,0.05), rgba(255,140,0,0.02));
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agent-img-wrap img {
  width: 100%;
  max-width: 180px;
  height: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  transition: transform 0.25s ease;
}

.agent-card:hover .agent-img-wrap img {
  transform: scale(1.05);
}

.agent-info {
  padding: 16px;
  border-top: 1px solid rgba(255,140,0,0.1);
  background: var(--cases-card-bg);
}

.agent-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ff8c00;
  margin: 0 0 6px;
  letter-spacing: 0.3px;
}

.agent-desc {
  font-size: 12px;
  color: var(--cases-text);
  opacity: 0.75;
  margin: 0;
  line-height: 1.4;
}

.agent-corner {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 6px;
  height: 6px;
  border-top: 2px solid rgba(255,140,0,0.5);
  border-left: 2px solid rgba(255,140,0,0.5);
}

/* Light theme support */
html:not(.dark) .agent-card {
  background: var(--cases-card-bg);
  border-color: rgba(255,140,0,0.2);
}

html:not(.dark) .agent-card:hover {
  border-color: rgba(255,140,0,0.6);
}

html:not(.dark) .agent-img-wrap {
  background: linear-gradient(135deg, rgba(255,140,0,0.03), rgba(255,140,0,0.01));
}

html:not(.dark) .agent-name {
  color: #ff8c00;
}

html:not(.dark) .agent-desc {
  color: #555;
  opacity: 0.85;
}

html:not(.dark) .agent-corner {
  border-top-color: rgba(255,140,0,0.6);
  border-left-color: rgba(255,140,0,0.6);
}

@media (max-width: 768px) {
  .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; }
  .cases-wf .cases-icon { width: 32px; height: 32px; }
  .cases-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; }
  .cases-wf .cases-key-button.shift-btn { width: 48px; font-size: 9px; }
  .agents-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .agent-img-wrap img {
    max-width: 140px;
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>

<!-- INTRO - DESCRIERE AGENȚI -->
<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:users" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <span class="cases-number">Operators</span> <span class="cases-highlight">Agent System</span>
    <p>Agenții sunt skin-uri de personaj care înlocuiesc modelele default ale jucătorilor din CS2. Fiecare agent are un design unic, voice lines specifice și animații proprii. Aceștia sunt împărțiți în două categorii: <span class="cases-highlight">Terrorist (T)</span> și <span class="cases-highlight">Counter-Terrorist (CT)</span>.</p>
    <p>Odată câștigați, agenții sunt adăugați în inventar și pot fi echipați direct din meniul <code>!ws</code> sau de pe site. Poți schimba oricând agentul pentru fiecare echipă separat.</p>
  </div>
</div>

<!-- 1.0 CUM ECHIPEZI AGENȚI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 CUM ECHIPEZI AGENȚI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 CUM ECHIPEZI AGENȚI</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:command" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="cases-highlight">tastatură</span>.</p>
    
 <div class="cases-important">
      <Icon icon="lucide:info" width="24" height="24" color="#ff8c00" />
      <span>Scrie <code>!ws</code> în chat pentru a deschide interfața principală a <span class="cases-highlight">skin-urilor și agenților</span>.</span>
    </div>
    
  <p>Navigarea prin meniul de agenți se face cu ajutorul tastelor:</p>
    
   <div class="cases-key-row">
      <div class="cases-key-item">
        <span class="cases-key-button">E</span>
        <span>Tasta <span class="cases-highlight">E</span> - <strong>Selectează</strong> agentul</span>
      </div>
      <div class="cases-key-item">
        <span class="cases-key-button">F</span>
        <span>Tasta <span class="cases-highlight">F</span> - <strong>Navighează în sus</strong> prin categorii</span>
      </div>
   <div class="cases-key-item">
        <span class="cases-key-button shift-btn">SHIFT</span>
        <span>Tasta <span class="cases-highlight">SHIFT</span> - <strong>Navighează în jos</strong> prin categorii</span>
      </div>
    </div>
    
  <div class="cases-tip">
      <Icon icon="lucide:lightbulb" width="24" height="24" color="#00c851" />
      <span>Meniul <code>!ws</code> îți va afișa toți <span class="cases-highlight">agenții disponibili</span>, separați pe echipe (T și CT), cu prețul în Phoenix Coins.</span>
    </div>
    
  <p>După ce selectezi un agent, se deschide panoul detaliat:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Buy Now</span> — cumpără agentul direct cu Phoenix Coins (dacă este disponibil pe piață)</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Equip</span> — dacă îl deții deja, îl echipezi instant pe personaj</span></li>
    </ul>
    
 <div class="cases-important">
      <Icon icon="lucide:refresh-cw" width="24" height="24" color="#ff8c00" />
      <span>Odată cumpărați sau echipați, agenții sunt <span class="cases-highlight">vizibili instant</span> în joc, atât pentru tine cât și pentru ceilalți jucători. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

<!-- 2.0 CUM OBȚII AGENȚI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 CUM OBȚII AGENȚI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM OBȚII AGENȚI</span>
</div>

<div class="cases-card">
  <div class="cases-icon">
    <Icon icon="lucide:package" width="18" height="18" color="#ff8c00" />
  </div>
  <div class="cases-content">
    <p>Singura metodă prin care poți obține agenți pe server este:</p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Market</span> — cumperi din <code>!ws</code> folosind Phoenix Coins</span></li>
    </ul>
  </div>
</div>

<!-- 3.0 TIPURI DE AGENȚI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 TIPURI DE AGENȚI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:grid-3x3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 TIPURI DE AGENȚI</span>
</div>

<div class="agents-grid">
  
  <!-- Sir Bloody Miami Darryl - T -->
  <div class="agent-card">
    <div class="agent-corner"></div>
    <div class="agent-img-wrap">
      <img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX3RtX3Byb2Zlc3Npb25hbF92YXJmLjRhZThkMGM5YmE3YTNkZDViNjU3NzE0ZWViNjk0NGQyNTk4ZWQ4ZWQucG5n/auto/auto/85/notrim/c2b69ab63cbc0d2b14c93825b070021b.webp" alt="Sir Bloody Miami Darryl">
    </div>
    <div class="agent-info">
      <p class="agent-name">Sir Bloody Miami Darryl</p>
      <p class="agent-desc">Agent T — Stil mafiot, voice lines memorabile</p>
    </div>
  </div>
  
  <!-- Lt. Commander Ricksaw - CT -->
  <div class="agent-card">
    <div class="agent-corner"></div>
    <div class="agent-img-wrap">
      <img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX2N0bV9zdDZfdmFyaWFudGkuZjQ5YTMzN2FjZDBjOGE2OTVjMDQyYTc3NmE3ZWJiZjBjZDI3NzQ1OS5wbmc-/auto/auto/85/notrim/57c5671d39147d029d766d96fe272f3c.webp" alt="Lt. Commander Ricksaw">
    </div>
    <div class="agent-info">
      <p class="agent-name">Lt. Commander Ricksaw</p>
      <p class="agent-desc">Agent CT — Militar, comandant naval</p>
    </div>
  </div>
  
  <!-- Special Agent Ava - CT -->
  <div class="agent-card">
    <div class="agent-corner"></div>
    <div class="agent-img-wrap">
      <img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX2N0bV9mYmlfdmFyaWFudGIuYjQyNWUzNTA5MmZjMWM2NjM5ODcxZDk1NTg2NTE1YTBlYzk2MDEzNC5wbmc-/auto/auto/85/notrim/f6a4932a96d298968715ee3c6ba5ba82.webp" alt="Special Agent Ava">
    </div>
    <div class="agent-info">
      <p class="agent-name">Special Agent Ava</p>
      <p class="agent-desc">Agent CT — Feminin, stil elegant</p>
    </div>
  </div>
  
  <!-- 'The Doctor' Romanov - T -->
  <div class="agent-card">
    <div class="agent-corner"></div>
    <div class="agent-img-wrap">
      <img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX3RtX2JhbGthbl92YXJpYW50aC5lZTFhYTYwMDI0ZmE2Yzk4NjMxNmQxNjNkMTQyODQ5MzZhODJhZDE2LnBuZw--/auto/auto/85/notrim/6376d787dc3e2b63e45e346662b0962c.webp" alt="The Doctor Romanov">
    </div>
    <div class="agent-info">
      <p class="agent-name">'The Doctor' Romanov</p>
      <p class="agent-desc">Agent T — Misterios, stil tactic</p>
    </div>
  </div>

</div>

<div class="cases-tip" style="margin-top: 24px;">
  <Icon icon="lucide:plus" width="20" height="20" color="#00c851" />
  <span><strong>și mulți alții...</strong> — Number K, Dragomir, Rezan, etc!</span>
</div>

</div>