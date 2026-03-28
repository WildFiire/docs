---
outline: deep
---

<div class="cases-wf">

<!-- Background image container -->
<div style="position: relative; overflow: hidden; border-radius: 24px; margin-bottom: 20px; min-height: 180px; background-color: var(--vp-c-bg);">
  <div style="position: absolute; top: -20px; left: -20px; right: -20px; bottom: -20px; z-index: 0; filter: blur(5px) brightness(var(--bg-brightness, 0.7)); transform: scale(1.1);">
    <img src="/wallpaper/backgroundwf.webp" alt="background" style="width: 100%; height: 100%; object-fit: cover; opacity: var(--bg-opacity, 0.4);">
  </div>
  <div style="position: relative; z-index: 1; padding: 30px 30px 20px 30px; border-radius: 24px;">
    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 5px; font-size: 12px; color: var(--vp-c-text-2); flex-wrap: wrap; opacity: 0.9;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Home</span>
        <span style="color: var(--vp-c-brand-1);">/</span>
        <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Systems</span>
        <span style="color: var(--vp-c-brand-1);">/</span>
        <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Skins</span>
        <span style="color: var(--vp-c-brand-1);">/</span>
        <span style="color: var(--vp-c-text-2);" class="orbitron-font">Knives</span>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <Icon icon="lucide:sword" :size="18" />
        <span style="font-size: 12px; color: var(--vp-c-text-2);" class="orbitron-font">Melee Weapons</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
      <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
      <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: gradientShift 6s ease infinite; font-weight: 700;" class="orbitron-font">Knives</h1>
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
        <PageTagPurple style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">skins</PageTagPurple>
        <PageTagGreen style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">knives</PageTagGreen>
        <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">melee</PageTagBlue>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 13px; color: var(--wf-gray); font-weight: 500;" class="orbitron-font">updated by</span>
        <a href="https://github.com/iannc69" target="_blank" class="github-profile" data-username="iannc69" data-tags="show-wildfire show-dev show-wiki show-staff" style="display: block; padding: 2px; background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6); border-radius: 50%;" title="iannc69">
          <img src="https://github.com/iannc69.png" alt="iannc69" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid #1a1a1a; display: block; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
        </a>
      </div>
    </div>
  </div>
</div>

<style>
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
.cases-wf .cases-orbitron { font-family: 'Orbitron', sans-serif !important; letter-spacing: 0.3px; }
.cases-wf .cases-card { background: var(--cases-card-bg); border: 1px solid var(--cases-card-border); padding: 20px; border-radius: 18px; transition: all 0.2s ease; line-height: 1.6; color: var(--cases-text); display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
.cases-wf .cases-card:hover { border-color: rgba(255,140,0,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.cases-wf .cases-icon { flex-shrink: 0; width: 36px; height: 36px; background: rgba(255,140,0,0.08); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,140,0,0.15); transition: all 0.2s ease; }
.cases-wf .cases-card:hover .cases-icon { background: rgba(255,140,0,0.12); border-color: rgba(255,140,0,0.3); }
.cases-wf .cases-content { flex: 1; width: 100%; }
.cases-wf .cases-content p { margin: 8px 0; font-size: 14px; line-height: 1.65; }
.cases-wf .cases-highlight { color: var(--cases-highlight); font-weight: 600; font-family: 'Orbitron', sans-serif; }
.cases-wf .cases-info-box { margin-top: 40px; background: var(--cases-info-bg); border: 1px solid var(--cases-info-border); border-radius: 18px; padding: 24px; line-height: 1.7; color: var(--cases-text); }
.cases-wf .cases-info-box ul { list-style-type: none; padding-left: 0; margin: 0; }
.cases-wf .cases-info-box li { margin-bottom: 16px; display: flex; align-items: flex-start; gap: 14px; font-size: 14px; }
.cases-wf .cases-info-box li svg { flex-shrink: 0; width: 20px; height: 20px; stroke: var(--cases-highlight); fill: none; margin-top: 2px; }
.cases-wf .cases-number { display: inline-block; background: var(--cases-number-bg); color: var(--cases-highlight); font-weight: 600; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-right: 10px; margin-bottom: 6px; border: 1px solid var(--cases-number-border); font-family: 'Orbitron', sans-serif; }
.cases-wf .cases-title-hover { transition: transform 0.2s ease; text-align: left; }
.cases-wf .cases-title-hover:hover { transform: translateX(5px); }
.cases-wf .cases-key-row { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
.cases-wf .cases-key-item { display: inline-flex; align-items: center; gap: 12px; padding: 6px 0; transition: all 0.2s ease; }
.cases-wf .cases-key-item:hover { transform: translateX(3px); }
.cases-wf .cases-key-button { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #2a2a2a, #1a1a1a); border: 2px solid #ff8c00; color: #ff8c00; font-family: 'Orbitron', monospace; font-weight: 800; font-size: 18px; width: 52px; height: 52px; border-radius: 14px; box-shadow: 0 3px 0 rgba(0,0,0,0.3); transition: all 0.1s ease; }
.cases-wf .cases-key-button:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(0,0,0,0.3); }
.cases-wf .cases-key-button.shift-btn { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; width: 60px; }
html:not(.dark) .cases-wf .cases-key-button { background: linear-gradient(145deg, #e8e8e8, #d8d8d8); }
.cases-wf .cases-custom-list { list-style: none; padding-left: 0; }
.cases-wf .cases-custom-list li { margin: 10px 0; display: flex; align-items: flex-start; gap: 12px; font-size: 14px; }
.cases-wf .cases-custom-list svg { flex-shrink: 0; width: 18px; height: 18px; stroke: #ff8c00; margin-top: 2px; }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@media (max-width: 768px) { .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; } .cases-wf .cases-icon { width: 32px; height: 32px; } .cases-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; } .cases-wf .cases-key-button.shift-btn { width: 48px; font-size: 9px; } .knv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

/* GS TIP - Green Info Box */
.cases-wf .gs-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(0,200,81,0.08);
  border: 1px solid rgba(0,200,81,0.25);
  border-radius: 14px;
  padding: 16px 20px;
  margin: 20px 0;
  transition: all 0.2s ease;
}
.cases-wf .gs-tip:hover {
  background: rgba(0,200,81,0.12);
  border-color: rgba(0,200,81,0.4);
  transform: translateX(4px);
}
.cases-wf .gs-tip-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #00c851;
  margin-top: 2px;
}
.cases-wf .gs-tip-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--cases-text);
  margin: 0;
  flex: 1;
}
html:not(.dark) .cases-wf .gs-tip {
  background: rgba(0,200,81,0.05);
  border-color: rgba(0,200,81,0.2);
}
html:not(.dark) .cases-wf .gs-tip-text {
  color: #2c3e2f;
}

/* GS TIP ORANGE - For warnings */
.cases-wf .gs-tip.orange {
  background: rgba(255,140,0,0.08);
  border-color: rgba(255,140,0,0.25);
}
.cases-wf .gs-tip.orange:hover {
  background: rgba(255,140,0,0.12);
  border-color: rgba(255,140,0,0.4);
}
.cases-wf .gs-tip.orange .gs-tip-icon {
  color: #ff8c00;
}

/* STYLE PENTRU CARDURILE DE CUȚITE */
.knv-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}
@media (max-width: 560px) {
  .knv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.knv-card {
  background: rgba(20,18,16,0.85);
  border: 1px solid rgba(255,140,0,0.12);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.22s, transform 0.22s;
  position: relative;
}
.knv-card:hover {
  border-color: rgba(255,140,0,0.55);
  transform: translateY(-3px);
}
.knv-card:hover .knv-name {
  color: #ff8c00;
}
.knv-img-wrap {
  position: relative;
  background: rgba(255,140,0,0.04);
  padding: 18px 16px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.knv-img-wrap img {
  width: 100%;
  max-width: 100px;
  height: 80px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6));
  position: relative;
  z-index: 1;
  animation: floatKnife 3s ease-in-out infinite;
  transition: transform 0.25s ease;
}
.knv-card:hover .knv-img-wrap img {
  animation: none;
  transform: scale(1.08);
}
@keyframes floatKnife {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}
.knv-info {
  padding: 10px 12px 14px;
  border-top: 1px solid rgba(255,140,0,0.08);
  transition: all 0.2s ease;
}
.knv-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #e8e5e0;
  margin: 0 0 4px;
  letter-spacing: 0.3px;
  transition: color 0.2s;
}
.knv-desc {
  font-size: 11px;
  color: rgba(200,195,188,0.55);
  margin: 0;
  line-height: 1.45;
}
.knv-corner {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 5px;
  height: 5px;
  border-top: 1.5px solid rgba(255,140,0,0.4);
  border-right: 1.5px solid rgba(255,140,0,0.4);
}
html:not(.dark) .knv-card {
  background: rgba(245,245,250,0.95);
  border-color: rgba(255,140,0,0.2);
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}
html:not(.dark) .knv-card:hover {
  border-color: rgba(255,140,0,0.5);
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
  transform: translateY(-3px);
}
html:not(.dark) .knv-img-wrap {
  background: rgba(255,140,0,0.02);
}
html:not(.dark) .knv-name {
  color: #2c2c2c;
}
html:not(.dark) .knv-card:hover .knv-name {
  color: #ff8c00;
}
html:not(.dark) .knv-desc {
  color: rgba(80,80,90,0.7);
}
html:not(.dark) .knv-corner {
  border-top-color: rgba(255,140,0,0.5);
  border-right-color: rgba(255,140,0,0.5);
}
html:not(.dark) .knv-info {
  border-top-color: rgba(255,140,0,0.12);
}
</style>

<!-- INTRO - DESCRIERE CUȚITE -->
<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:sword" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <span class="cases-number">Melee Weapons</span> <span class="cases-highlight">Knives System</span>
    <p>Cuțitele sunt iteme cosmetice care înlocuiesc cuțitul default al personajului. Nu oferă niciun avantaj în joc în afara aspectului vizual, dar sunt printre cele mai căutate și valoroase iteme din server.</p>
    <p>Odată câștigate, cuțitele sunt adăugate automat în inventarul tău și pot fi echipate direct din meniul <code>!ws</code> sau de pe site. Fiecare model are animații unice și poate fi combinat cu diferite skin-uri de mănuși.</p>
  </div>
</div>

<div class="gs-tip">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">Cuțitele sunt iteme <span class="cases-highlight">cosmetice rare</span> și nu oferă niciun avantaj în joc. Fiecare model are animații unice de inspect și atac.</p>
</div>

<!-- 1.0 CUM ECHIPEZI CUȚITE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 INFORMAȚII</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMAȚII</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="cases-highlight">tastatură</span>.</p>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!ws</code> în chat pentru a deschide interfața principală a <span class="cases-highlight">skin-urilor și cuțitelor</span>.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/knives/gif_knives_1.gif" alt="Knives Menu Navigation - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!ws knives menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește tastele <span class="cases-highlight">E</span>, <span class="cases-highlight">F</span> și <span class="cases-highlight">SHIFT</span> pentru a naviga prin meniul !ws
      </div>
    </div>
    
   <p>Navigarea prin meniul de cuțite se face cu ajutorul tastelor:</p>
    
  <div class="cases-key-row">
      <div class="cases-key-item"><span class="cases-key-button">E</span><span>Tasta <span class="cases-highlight">E</span> - <strong>Selectează</strong> cuțitul</span></div>
      <div class="cases-key-item"><span class="cases-key-button">F</span><span>Tasta <span class="cases-highlight">F</span> - <strong>Navighează în sus</strong> prin categorii</span></div>
      <div class="cases-key-item"><span class="cases-key-button shift-btn">SHIFT</span><span>Tasta <span class="cases-highlight">SHIFT</span> - <strong>Navighează în jos</strong> prin categorii</span></div>
    </div>
    
  <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul <code>!ws</code> îți va afișa toate <span class="cases-highlight">cuțitele disponibile</span>, grupate pe tipuri (Karambit, M9 Bayonet, Butterfly etc.), cu preview-uri și prețul în Phoenix Coins.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/knives/gif_knives_2.gif" alt="Knives Selection - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">select knife</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Apasă <span class="cases-highlight">E</span> pentru a selecta cuțitul dorit
      </div>
    </div>
    
   <p>După ce selectezi un cuțit, se deschide panoul detaliat:</p>
    
   <ul class="cases-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Preview</span> — poți vedea modelul cuțitului înainte de achiziție</span></li>
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Buy Now</span> — cumpără cuțitul direct cu Phoenix Coins</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Equip</span> — dacă îl deții deja, îl echipezi instant</span></li>
    </ul>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odată cumpărate sau echipate, cuțitele sunt <span class="cases-highlight">vizibile instant</span> în mâna personajului tău. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

<!-- 2.0 CUM OBȚII CUȚITE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 CUM OBȚII CUȚITE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM OBȚII CUȚITE</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Există mai multe metode prin care poți obține cuțite pe server:</p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Market</span> — cumperi din <code>!ws</code> folosind Phoenix Coins</span></li>
      <li><Icon icon="lucide:box" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Cases</span> — deschizi un case care conține cuțite (raritate extrem de mare)</span></li>
      <li><Icon icon="lucide:calendar" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Events</span> — recompense speciale la evenimente</span></li>
    </ul>
    <div class="gs-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Cuțitele sunt printre cele mai rare iteme — șansa de drop este extrem de mică!</span>
    </div>
  </div>
</div>

<!-- 3.0 INVENTAR & LOADOUT -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 INVENTAR & LOADOUT</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 INVENTAR & LOADOUT</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Toate item-urile tale sunt stocate în inventar și pot fi gestionate atât din joc, cât și de pe site-ul oficial.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/inventory.png" alt="Inventory Menu - !inv" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!inv - inventory menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:command" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește comanda <span class="cases-highlight">!inv</span> în joc pentru a-ți deschide inventarul
      </div>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:monitor" width="22" height="22" color="#00c851" />
      <span><span class="cases-highlight">Pe site-ul oficial:</span> Accesează <code>wildfire.ro/skins-market</code> și autentifică-te cu Steam pentru a accesa secțiunea <span class="cases-highlight">Inventory</span>. Acolo vei găsi toate skin-urile, cuțitele, mănușile și agenții pe care îi deții.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_inventory.gif" alt="Site Inventory - wildfire.ro/skins-market" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site inventory</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:package-open" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="cases-highlight">Inventory</span> de pe site poți vedea toate item-urile câștigate
      </div>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#00c851" />
      <span>După ce ai vizualizat inventarul, accesează secțiunea <span class="cases-highlight">Loadout</span> pentru a-ți echipa item-urile direct din browser.</span>
    </div>
    
 <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_loadout.gif" alt="Site Loadout - Echipa iteme" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site loadout - equip items</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check-circle-2" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="cases-highlight">Loadout</span> selectează item-ul dorit și apasă Equip
      </div>
    </div>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Toate item-urile echipate pe site sunt <span class="cases-highlight">sincronizate automat</span> cu jocul. Nu este nevoie de relogare - schimbările sunt vizibile instant în CS2!</span>
    </div>
  </div>
</div>

<!-- 4.0 TIPURI DE CUȚITE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.0 TIPURI DE CUȚITE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:grid-3x3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 TIPURI DE CUȚITE</span>
</div>

<div class="knv-grid">
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9rYXJhbWJpdC4zMTQzNTI0MzE3ODMwYjY2OGVkMTdkMTgzYzlhZmVhMDc2ZmNiMTNiLnBuZw--/auto/auto/85/notrim/f626fe6b3555e993f3f5ee8c023048f3.webp" alt="Karambit"></div><div class="knv-info"><p class="knv-name">Karambit</p><p class="knv-desc">Design curbat, animații iconice</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9tOV9iYXlvbmV0Ljg4M2NhNTlhN2NjZmE2MTYzOTYzYjYwYzY5Y2RkMzk0YzJiODdhNWUucG5n/auto/auto/85/notrim/1ac339a2f6491076625be3d396daf996.webp" alt="M9 Bayonet"></div><div class="knv-info"><p class="knv-name">M9 Bayonet</p><p class="knv-desc">Design militar, lama robustă</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9idXR0ZXJmbHkuMTVkYzdjYzUzYjE4ZjYyMWUxNWUyZDljYTJjODViMjQ4MzdmNmYxNi5wbmc-/auto/auto/85/notrim/2f10bc24054d400de7758453e78de394.webp" alt="Butterfly Knife"></div><div class="knv-info"><p class="knv-name">Butterfly Knife</p><p class="knv-desc">Animații spectaculoase, flip</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9iYXlvbmV0LjRhMzg1Njg1M2MwZTc2MjYyZTg2MTVmOThhODg4NGFlZTY2ZGEzOGIucG5n/auto/auto/85/notrim/99f374cb24987a880e31b5da97815131.webp" alt="Bayonet"></div><div class="knv-info"><p class="knv-name">Bayonet</p><p class="knv-desc">Design clasic, lama dreaptă</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9mbGlwLmExZWVlZDVhNGExOGM2ODFmNDNkMWI0YWEyZjY1Yjg0YzM3OTBjNWUucG5n/auto/auto/85/notrim/ff0308f8e546acb6c52c0abbfd5d7213.webp" alt="Flip Knife"></div><div class="knv-info"><p class="knv-name">Flip Knife</p><p class="knv-desc">Design compact, animație flip</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV90YWN0aWNhbC45N2M1NmYyMTBlMWJlMTQ2YWE4ZWJkMDgyYjI0M2Q3NTQ4OGEwNDNiLnBuZw--/auto/auto/85/notrim/fa2f75126da9a9a7646e612793e05a7f.webp" alt="Huntsman Knife"></div><div class="knv-info"><p class="knv-name">Huntsman Knife</p><p class="knv-desc">Design vânătoare, lama zimțată</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9mYWxjaGlvbi5jNDY3ZWUzYzY3NTIxNzNkOTg5OTRlZDhmMTg3YWU1N2VmNzg2NGUwLnBuZw--/auto/auto/85/notrim/b8d71a470b4b34144ab8088a8af19ba2.webp" alt="Falchion Knife"></div><div class="knv-info"><p class="knv-name">Falchion Knife</p><p class="knv-desc">Design medieval, lama curbă</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9ndXQuNTIxOTJkY2JhZTEyMDJhOGFhNDhkMjMyMmQ4Y2IyOWUwMTJjMmY3OC5wbmc-/auto/auto/85/notrim/49725a5aaa6956b31c0d61efc23f8ab1.webp" alt="Gut Knife"></div><div class="knv-info"><p class="knv-name">Gut Knife</p><p class="knv-desc">Design curbat, animație simplă</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9neXBzeV9qYWNra25pZmUuYTY4YzFiZjMxM2Q5MTdhM2ZhMDVjNGM4NzYxYmViODdiYTI4MzBiOC5wbmc-/auto/auto/85/notrim/5c26e3b014d97d5fc86bb9d7996702d1.webp" alt="Navaja Knife"></div><div class="knv-info"><p class="knv-name">Navaja Knife</p><p class="knv-desc">Design pliant, stil compact</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9wdXNoLjgyNjg5M2U4MTc3ODIwYzkyMTBlNGQxZGNjM2E4NmRiNDQ1ZWFhNzUucG5n/auto/auto/85/notrim/8bdb8e271d6222828e92d2c949d7318c.webp" alt="Shadow Daggers"></div><div class="knv-info"><p class="knv-name">Shadow Daggers</p><p class="knv-desc">Două lame, stil asasin</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9zdXJ2aXZhbF9ib3dpZS40MTVjMjhlYjdkODViYTIyOTc2MmNiMzVmNzUwNjFlMzAzODM0MzlmLnBuZw--/auto/auto/85/notrim/2254c36c877064475e49a334f652fd67.webp" alt="Bowie Knife"></div><div class="knv-info"><p class="knv-name">Bowie Knife</p><p class="knv-desc">Lamă lată, design robust</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9jb3JkLjM1MDVkZWNkYjY5MjMxZmRhODJkODIzZTA5OWQ3OTFjNGYxZTEwMDUucG5n/auto/auto/85/notrim/4539f176c554de63cceedcfc4a5f4a05.webp" alt="Paracord Knife"></div><div class="knv-info"><p class="knv-name">Paracord Knife</p><p class="knv-desc">Design tactic, mâner împletit</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9jYW5pcy4zM2E1MTUzMmM0NDVlZTMwNjFkNjhlYWE5Mjg3MjVlNThmOGRhZjkwLnBuZw--/auto/auto/85/notrim/5959b0aa64921e3c201fb3d8c2e25479.webp" alt="Survival Knife"></div><div class="knv-info"><p class="knv-name">Survival Knife</p><p class="knv-desc">Design utilitar, robust</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV91cnN1cy4yZjIxOGNkYmVlMTIxZjYxZWFkY2NlZjg5ZWUxN2ZjNDZmZDQyZWY2LnBuZw--/auto/auto/85/notrim/202cfb970c4667a52980632b14349aab.webp" alt="Ursus Knife"></div><div class="knv-info"><p class="knv-name">Ursus Knife</p><p class="knv-desc">Design compact, lama lată</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9rdWtyaS4zNDQ0NzZjMmNhNGRkOTgyOTQyMjViOTM5M2ZjMDlmODViODcwYzZmLnBuZw--/auto/auto/85/notrim/3f2f9a2c1afe13acb3f92a74f39ec2fe.webp" alt="Kukri Knife"></div><div class="knv-info"><p class="knv-name">Kukri Knife</p><p class="knv-desc">Design curbat, forță brută</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9jc3MuY2M1MjU4ZWY1YTUzZGNjYWNiYjA3ZmE5NDk0ZDNhMDUyYzYyZDMxYi5wbmc-/auto/auto/85/notrim/495da4a30a61a33fe5e41722894442f0.webp" alt="Classic Knife"></div><div class="knv-info"><p class="knv-name">Classic Knife</p><p class="knv-desc">Design original CS, nostalgic</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9zdGlsZXR0by5jNGZiNzAwNGFkMjk5ZDZiZWZjN2M5NmFmNWE0MTE3NjcwNWUzMTJkLnBuZw--/auto/auto/85/notrim/79abdddb23864b0b70d112621bdff947.webp" alt="Stiletto Knife"></div><div class="knv-info"><p class="knv-name">Stiletto Knife</p><p class="knv-desc">Lamă subțire, elegant</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV93aWRvd21ha2VyLjYxNzcwNDliZDg4OWQ4ZjZiNWU2NzE5ZTUxZmZjOWY5OTRlZGEwMWEucG5n/auto/auto/85/notrim/11e9ddb0856ea6417b212cd925fe085b.webp" alt="Talon Knife"></div><div class="knv-info"><p class="knv-name">Talon Knife</p><p class="knv-desc">Design agresiv, lama curbă</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9vdXRkb29yLjBjOWIwM2MxNmQ5ZTliMDg0NjI5MjI3NGJiNmZhN2M3YWU1ODY5NmQucG5n/auto/auto/85/notrim/ab63176a80d901dbd434a145e4343807.webp" alt="Nomad Knife"></div><div class="knv-info"><p class="knv-name">Nomad Knife</p><p class="knv-desc">Design rustic, practic</p></div></div>
  <div class="knv-card"><div class="knv-corner"></div><div class="knv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9za2VsZXRvbi5jYzhhNTFlNmEyNWViNzcwZjkxMTkxYjYwZTE3ODUxZjQzZDU4NGRkLnBuZw--/auto/auto/85/notrim/fd430bd232a67315a7cee81e4fb41b04.webp" alt="Skeleton Knife"></div><div class="knv-info"><p class="knv-name">Skeleton Knife</p><p class="knv-desc">Design schelet, unic</p></div></div>
</div>

<div class="gs-tip" style="margin-top: 24px;">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">Fiecare tip de cuțit are <span class="cases-highlight">multiple variante de culori și modele</span> (Doppler, Crimson Web, Fade etc.). Poți inspecta fiecare model înainte de achiziție direct din meniul <code>!ws</code>.</p>
</div>

<!-- INFO BOX FINAL -->
<div class="cases-info-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Atenție!</span> Cuțitele sunt iteme cosmetic rare. Verifică șansele de drop înainte să deschizi un case care le conține. Prețurile variază în funcție de raritate, design și wear rating.</span></li>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Notă:</span> Poți purta un singur cuțit odată, dar îl poți schimba oricând din meniul <code>!ws</code>. Cuțitele se combină perfect cu mănușile pentru un look complet.</span></li>
  </ul>
</div>

</div>