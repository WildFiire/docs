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
        <span style="color: var(--vp-c-text-2);" class="orbitron-font">Gloves</span>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <Icon icon="lucide:hand" :size="18" />
        <span style="font-size: 12px; color: var(--vp-c-text-2);" class="orbitron-font">Gloves</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
      <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
      <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: gradientShift 6s ease infinite; font-weight: 700;" class="orbitron-font">Gloves</h1>
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
        <PageTagPurple style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">skins</PageTagPurple>
        <PageTagGreen style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">gloves</PageTagGreen>
        <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">items</PageTagBlue>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 13px; color: var(--wf-gray); font-weight: 500;" class="orbitron-font">updated by</span>
        <a href="https://github.com/ianncxd" target="_blank" class="github-profile" data-username="ianncxd" data-tags="show-wildfire show-dev show-wiki show-staff" style="display: block; padding: 2px; background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6); border-radius: 50%;" title="ianncxd">
          <img src="https://github.com/ianncxd.png" alt="ianncxd" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid #1a1a1a; display: block; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
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
.cases-wf .cases-title-hover { transition: transform 0.2s ease, opacity 0.2s ease; text-align: left; }
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
@media (max-width: 768px) { .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; } .cases-wf .cases-icon { width: 32px; height: 32px; } .cases-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; } .cases-wf .cases-key-button.shift-btn { width: 48px; font-size: 9px; } .gv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

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

/* STYLE PENTRU CARDURILE DE MĂNUȘI */
.gv-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 20px; }
@media (max-width: 560px) { .gv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.gv-card { background: rgba(20,18,16,0.85); border: 1px solid rgba(255,140,0,0.12); border-radius: 10px; overflow: hidden; cursor: pointer; transition: border-color 0.22s, transform 0.22s; position: relative; }
.gv-card:hover { border-color: rgba(255,140,0,0.55); transform: translateY(-3px); }
.gv-card:hover .gv-name { color: #ff8c00; }
.gv-img-wrap { position: relative; background: rgba(255,140,0,0.04); padding: 18px 16px 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.gv-img-wrap img { width: 100%; max-width: 120px; height: 72px; object-fit: contain; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6)); position: relative; z-index: 1; animation: floatGlove 3s ease-in-out infinite; transition: transform 0.25s ease; }
.gv-card:hover .gv-img-wrap img { animation: none; transform: scale(1.08); }
@keyframes floatGlove { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
.gv-info { padding: 10px 12px 14px; border-top: 1px solid rgba(255,140,0,0.08); transition: all 0.2s ease; }
.gv-name { font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700; color: #e8e5e0; margin: 0 0 4px; letter-spacing: 0.3px; transition: color 0.2s; }
.gv-desc { font-size: 11px; color: rgba(200,195,188,0.55); margin: 0; line-height: 1.45; }
.gv-corner { position: absolute; top: 8px; right: 8px; width: 5px; height: 5px; border-top: 1.5px solid rgba(255,140,0,0.4); border-right: 1.5px solid rgba(255,140,0,0.4); }
html:not(.dark) .gv-card { background: rgba(245,245,250,0.95); border-color: rgba(255,140,0,0.2); box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
html:not(.dark) .gv-card:hover { border-color: rgba(255,140,0,0.5); box-shadow: 0 6px 14px rgba(0,0,0,0.08); transform: translateY(-3px); }
html:not(.dark) .gv-img-wrap { background: rgba(255,140,0,0.02); }
html:not(.dark) .gv-name { color: #2c2c2c; }
html:not(.dark) .gv-card:hover .gv-name { color: #ff8c00; }
html:not(.dark) .gv-desc { color: rgba(80,80,90,0.7); }
html:not(.dark) .gv-corner { border-top-color: rgba(255,140,0,0.5); border-right-color: rgba(255,140,0,0.5); }
html:not(.dark) .gv-info { border-top-color: rgba(255,140,0,0.12); }
</style>

<!-- INTRO - DESCRIERE MĂNUȘI -->
<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:hand" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <span class="cases-number">Cosmetic Items</span> <span class="cases-highlight">Gloves System</span>
    <p>Mănușile sunt iteme cosmetice care înlocuiesc mănușile default ale personajului. Nu oferă niciun avantaj în joc, sunt doar <span class="cases-highlight">vizuale</span>. Acestea pot fi obținute din anumite cutii, de pe piața serverului sau în cadrul unor evenimente speciale.</p>
    <p>Odată câștigate, mănușile sunt adăugate automat în inventarul tău și pot fi echipate direct din meniul <code>!ws</code> sau de pe site. Fiecare pereche are un design unic și poate fi combinată cu diferite skin-uri de cuțite.</p>
  </div>
</div>

<div class="gs-tip">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">Mănușile sunt iteme <span class="cases-highlight">cosmetice rare</span> și nu oferă niciun avantaj în joc. Fiecare pereche are un design unic, iar unele sunt disponibile doar în anumite cutii sau evenimente speciale.</p>
</div>

<!-- 1.0 CUM ECHIPEZI MĂNUȘI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 CUM ECHIPEZI MĂNUȘI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 CUM ECHIPEZI MĂNUȘI</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="cases-highlight">tastatură</span>.</p>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!ws</code> în chat pentru a deschide interfața principală a <span class="cases-highlight">skin-urilor și mănușilor</span>.</span>
    </div>
    
  <p>Navigarea prin meniul de mănuși se face cu ajutorul tastelor:</p>
    
 <div class="cases-key-row">
      <div class="cases-key-item"><span class="cases-key-button">E</span><span>Tasta <span class="cases-highlight">E</span> - <strong>Selectează</strong> mănușile</span></div>
      <div class="cases-key-item"><span class="cases-key-button">F</span><span>Tasta <span class="cases-highlight">F</span> - <strong>Navighează în sus</strong> prin categorii</span></div>
      <div class="cases-key-item"><span class="cases-key-button shift-btn">SHIFT</span><span>Tasta <span class="cases-highlight">SHIFT</span> - <strong>Navighează în jos</strong> prin categorii</span></div>
    </div>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/gloves/gif_gloves_1.gif" alt="Gloves Menu Navigation - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!ws menu navigation</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește tastele <span class="cases-highlight">E</span>, <span class="cases-highlight">F</span> și <span class="cases-highlight">SHIFT</span> pentru a naviga prin meniul !ws
      </div>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul <code>!ws</code> îți va afișa toate <span class="cases-highlight">mănușile disponibile</span>, grupate pe tipuri (Sport, Specialist, Moto, Hand Wraps etc.), cu preview-uri 3D și prețul în Phoenix Coins.</span>
    </div>
    
   <p>După ce selectezi o pereche de mănuși, se deschide panoul detaliat:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Preview</span> — poți vedea modelul 3D al mănușilor înainte de achiziție</span></li>
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Buy Now</span> — cumpără mănușile direct cu Phoenix Coins</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Equip</span> — dacă le deții deja, le echipezi instant</span></li>
    </ul>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odată cumpărate sau echipate, mănușile sunt <span class="cases-highlight">vizibile instant</span> pe mâinile personajului tău. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

<!-- 2.0 CUM OBȚII MĂNUȘI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 CUM OBȚII MĂNUȘI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM OBȚII MĂNUȘI</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Există mai multe metode prin care poți obține mănuși pe server:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Market</span> — cumperi din <code>!ws</code> folosind Phoenix Coins</span></li>
      <li><Icon icon="lucide:box" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Cases</span> — deschizi un case care conține mănuși (raritate foarte mare)</span></li>
      <li><Icon icon="lucide:calendar" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Events</span> — recompense speciale la evenimente</span></li>
    </ul>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Mănușile sunt printre cele mai rare iteme — șansa de drop este extrem de mică!</span>
    </div>

   <div style="margin: 28px 0 20px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/gloves/gif_gloves_2.gif" alt="Gloves Purchase Preview - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">preview & purchase</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:eye" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Preview 3D înainte de achiziție și cumpărare instant cu Phoenix Coins
      </div>
    </div>
  </div>
</div>

<!-- 3.0 TIPURI DE MĂNUȘI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 TIPURI DE MĂNUȘI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:grid-3x3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 TIPURI DE MĂNUȘI</span>
</div>

<div class="gv-grid">
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3Nwb3J0eV9nbG92ZXNfc3BvcnR5X2JsYWNrX3dlYmJpbmdfeWVsbG93X2xpZ2h0LjIyZDZkMmMzYTBiMjcyMTJlYjI4OGY3ZmU2NTE5YzQ1MGZmMzFmZjgucG5n/auto/auto/85/notrim/23da20bfbb7f60fa77271b238157c4db.webp" alt="Sport Gloves"></div><div class="gv-info"><p class="gv-name">Sport Gloves</p><p class="gv-desc">Design modern, culori vibrante</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3NwZWNpYWxpc3RfZ2xvdmVzX3NwZWNpYWxpc3RfZGRwYXRfZ3JlZW5fY2Ftb19saWdodC42NmIyN2E2MGY2MzM1ZjZiZDhiZDY3MjNiOGYxM2ZmOTE5NWQ2ODhjLnBuZw--/auto/auto/85/notrim/86fb11e6c6ffcf6cfece6481fc2ec996.webp" alt="Specialist Gloves"></div><div class="gv-info"><p class="gv-name">Specialist Gloves</p><p class="gv-desc">Tactice, detalii fine, finisaje premium</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL21vdG9yY3ljbGVfZ2xvdmVzX21vdG9yY3ljbGVfYmFzaWNfYmxhY2tfbGlnaHQuYTFlMDE2OGQ2OTk0Y2ZkYTI1YmY2ZWRlYmZiNmE4MTRjMGU5MDEwZi5wbmc-/auto/auto/85/notrim/3c09fe9883a3e7e4124e185fa0dc549b.webp" alt="Moto Gloves"></div><div class="gv-info"><p class="gv-name">Moto Gloves</p><p class="gv-desc">Protecție și stil agresiv</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL2xlYXRoZXJfaGFuZHdyYXBzX2hhbmR3cmFwX2NhbW9fZ3JleV9saWdodC43MjZjODhhNjc0Mjc4MGM5MzA2M2QyYjc0MGQ3ZTY5MGZjZWZmYWZlLnBuZw--/auto/auto/85/notrim/c49acf5ebd27d3a71f323ba205e864f2.webp" alt="Hand Wraps"></div><div class="gv-info"><p class="gv-name">Hand Wraps</p><p class="gv-desc">Aspect rugged, textură unică</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3N0dWRkZWRfYmxvb2Rob3VuZF9nbG92ZXNfYmxvb2Rob3VuZF9ibGFja19zaWx2ZXJfbGlnaHQuOGMzNTgwZjQ1MDhkMjQxYTQ3YWJjNjE2ZDk0ZGZiM2QyZmNlYzM0Yy5wbmc-/auto/auto/85/notrim/becbbaa216ffa6c8b764af5698768847.webp" alt="Bloodhound Gloves"></div><div class="gv-info"><p class="gv-name">Bloodhound Gloves</p><p class="gv-desc">Camuflaj, texturi terestre</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3NsaWNrX2dsb3Zlc19zbGlja19ibGFja19saWdodC5iOTBkMjUxYTNjYTEyNmJkMDA5NGFiMDQzNzczZjExYTNiNjE4Nzg2LnBuZw--/auto/auto/85/notrim/bdf3129541e747332f13294224f880dc.webp" alt="Driver Gloves"></div><div class="gv-info"><p class="gv-name">Driver Gloves</p><p class="gv-desc">Eleganță inspirată din motorsport</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3N0dWRkZWRfYnJva2VuZmFuZ19nbG92ZXNfb3BlcmF0aW9uMTBfZmxvcmFsX2xpZ2h0LjE3NjU4MjE2M2JlNjI4NjhmZjhiN2MxMWRlMDU4YWFjZjRmY2I3NDUucG5n/auto/auto/85/notrim/2cfadb344815b9708a062498d430278b.webp" alt="Broken Fang Gloves"></div><div class="gv-info"><p class="gv-name">Broken Fang Gloves</p><p class="gv-desc">Design unic, texturi detaliate</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3N0dWRkZWRfaHlkcmFfZ2xvdmVzX2Jsb29kaG91bmRfaHlkcmFfYmxhY2tfZ3JlZW5fbGlnaHQuMWQ5MDg5YzFlY2UyMjk3NDA5MzVlZWUxMWNiMGZiZTM5ZWNiZTU4MC5wbmc-/auto/auto/85/notrim/039503cd70c2f0b50605dd7d139b9419.webp" alt="Hydra Gloves"></div><div class="gv-info"><p class="gv-name">Hydra Gloves</p><p class="gv-desc">Stil casual, culori îndrăznețe</p></div></div>
</div>

<div class="gs-tip">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">Fiecare tip de mănuși are <span class="cases-highlight">multiple variante de culori și modele</span> (Doppler, Crimson Web, Fade etc.). Poți inspecta fiecare model înainte de achiziție direct din meniul <code>!ws</code>.</p>
</div>

<!-- INFO BOX FINAL -->
<div class="cases-info-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Atenție!</span> Mănușile sunt iteme cosmetic rare. Verifică șansele de drop înainte să deschizi un case care le conține. Prețurile variază în funcție de raritate și design.</span></li>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Notă:</span> Nu poți echipa două perechi de mănuși simultan — sistemul permite o singură pereche activă odată.</span></li>
  </ul>
</div>

</div>