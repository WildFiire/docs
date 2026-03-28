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
        <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Market</span>
        <span style="color: var(--vp-c-brand-1);">/</span>
        <span style="color: var(--vp-c-brand-1);" class="orbitron-font">Systems</span>
        <span style="color: var(--vp-c-brand-1);">/</span>
        <span style="color: var(--vp-c-text-2);" class="orbitron-font">MVP Anthem</span>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <Icon icon="lucide:star" :size="18" />
        <span style="font-size: 12px; color: var(--vp-c-text-2);" class="orbitron-font">MVP Anthem</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
      <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
      <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; background-size: 200% 200%; animation: gradientShift 6s ease infinite; font-weight: 700;" class="orbitron-font"> MVP Anthem</h1>
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; user-select: none; -webkit-user-select: none; pointer-events: none; -webkit-user-drag: none;">
        <PageTagPurple style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">mvp</PageTagPurple>
        <PageTagGreen style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">anthem</PageTagGreen>
        <PageTagBlue style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">premium</PageTagBlue>
        <PageTagOrange style="font-size: 11px; padding: 2px 8px;" class="orbitron-font">custom</PageTagOrange>
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
@media (max-width: 768px) { .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; } .cases-wf .cases-icon { width: 32px; height: 32px; } .cases-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; } .cases-wf .cases-key-button.shift-btn { width: 48px; font-size: 9px; } }

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
  width: 22px; height: 22px; flex-shrink: 0; color: #00c851; margin-top: 2px;
}
.cases-wf .gs-tip-text {
  font-size: 13px; line-height: 1.5; color: var(--cases-text); margin: 0; flex: 1;
}
html:not(.dark) .cases-wf .gs-tip {
  background: rgba(0,200,81,0.05); border-color: rgba(0,200,81,0.2);
}
html:not(.dark) .cases-wf .gs-tip-text { color: #2c3e2f; }

/* GS TIP ORANGE - For warnings */
.cases-wf .gs-tip.orange {
  background: rgba(255,140,0,0.08); border-color: rgba(255,140,0,0.25);
}
.cases-wf .gs-tip.orange:hover {
  background: rgba(255,140,0,0.12); border-color: rgba(255,140,0,0.4);
}
.cases-wf .gs-tip.orange .gs-tip-icon { color: #ff8c00; }
</style>

<!-- INTRO - DESCRIERE MVP & FEATURES -->
<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:star" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <span class="cases-number">Premium Feature</span> <span class="cases-highlight">MVP Anthem</span>
    <p>MVP-urile (Most Valuable Player) sunt animații speciale care apar la sfârșitul rundei pentru jucătorul care a avut cea mai bună performanță. Sistemul <span class="cases-highlight"> MVP Anthem</span> îți permite să personalizezi această animație cu efecte vizuale și sunete unice.</p>
    <p><span class="cases-highlight">Features:</span></p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Change Volume</span> — ajustează volumul fiecărui MVP independent</span></li>
      <li><Icon icon="lucide:shuffle" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Random MVP</span> — activează modul aleatoriu pentru varietate maximă</span></li>
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Preview</span> — testează orice MVP înainte de a-l selecta</span></li>
      <li><Icon icon="lucide:mouse-pointer-click" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Select MVP</span> — schimbă oricând MVP-ul activ din meniul <code>!mvp</code></span></li>
    </ul>
  </div>
</div>

<div class="gs-tip">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">MVP-urile sunt iteme <span class="cases-highlight">cosmetice premium</span> care nu oferă niciun avantaj în joc, dar îți permit să te remarci în fața celorlalți jucători la finalul rundei.</p>
</div>

<!-- 1.0 CUM ÎȚI PUI UN MVP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 CUM ÎȚI PUI UN MVP</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 CUM ÎȚI PUI UN MVP</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Procesul de echipare a unui MVP este simplu și intuitiv:</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!mvp</code> în chat pentru a deschide meniul de selecție a MVP-urilor.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_1.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">select mvp</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Apasă <span class="cases-highlight">E</span> pentru a selecta MVP-ul dorit
      </div>
    </div>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odată selectat, MVP-ul este <span class="cases-highlight">vizibil instant</span> la sfârșitul rundei. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

<!-- 2.0 PREVIEW MVP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 PREVIEW MVP</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:eye" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 PREVIEW MVP</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Înainte de a cumpăra un MVP, poți testa cum arată și cum sună folosind funcția <span class="cases-highlight">Preview</span> din meniul <code>!mvp</code>.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_2.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">preview mvp</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:play" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Testează orice MVP înainte de al selecta.
      </div>
    </div>
    
 <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Folosește opțiunea <span class="cases-highlight">Preview</span> pentru a vedea animația completă și a auzi sunetul înainte de a decide să cumperi.</span>
    </div>
  </div>
</div>

<!-- 3.0 CHANGE VOLUME -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 CHANGE VOLUME</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:volume-2" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 CHANGE VOLUME</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Fiecare MVP are un sunet asociat. Poți ajusta volumul independent de celelalte sunete din joc.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_3.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">change volume</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:sliders" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Ajustează volumul folosind tastele <span class="cases-highlight">SHIFT, F si E</span>
      </div>
    </div>
  </div>
</div>

<!-- 4.0 RANDOM MVP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.0 RANDOM MVP</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:shuffle" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 RANDOM MVP</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:shuffle" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Dacă ai mai multe MVP-uri în colecție și nu te poți decide pe care să-l folosești, poți activa funcția <span class="cases-highlight">Random MVP</span>.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>În meniul <code>!mvp</code>, selectează opțiunea <span class="cases-highlight">Random MVP</span> pentru a activa modul aleatoriu.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/random.png" alt="Random MVP" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">random mvp</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:shuffle" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Activează Random MVP pentru a primi un MVP diferit la fiecare rundă
      </div>
    </div>
    
   <p>Când modul <span class="cases-highlight">Random MVP</span> este activat, la fiecare sfârșit de rundă în care ești MVP, sistemul va selecta aleatoriu unul dintre MVP-urile pe care le deții.</p>
    
   <ul class="cases-custom-list">
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span>Fiecare rundă poate avea un MVP diferit</span></li>
      <li><Icon icon="lucide:heart" width="18" height="18" color="#ff8c00" /><span>Păstrează surpriza și varietatea în joc</span></li>
      <li><Icon icon="lucide:x-circle" width="18" height="18" color="#ff8c00" /><span>Poți dezactiva oricând funcția și reveni la un MVP preferat</span></li>
    </ul>
    
   <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Modul <span class="cases-highlight">Random MVP</span> este perfect pentru cei care au o colecție mare de MVP-uri și vor să le audă pe toate în acțiune!</span>
    </div>
  </div>
</div>

<!-- 5.0 MVP PE SITE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">5.0 MVP PE SITE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:monitor" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />5.0 MVP PE SITE</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:monitor" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Toate MVP-urile tale pot fi gestionate și din contul tău de pe <span class="cases-highlight">site-ul oficial</span>. Accesează <code>wildfire.ro/skins-market</code> și autentifică-te cu Steam pentru a accesa secțiunea <span class="cases-highlight">MVP</span>.</p>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_4.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site mvp manager</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:monitor" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Gestionează-ți MVP-urile direct din browser
      </div>
    </div>
    
  <div class="gs-tip">
      <Icon icon="lucide:eye" width="22" height="22" color="#00c851" />
      <span>Pe site poți:</span>
    </div>
    
   <ul class="cases-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Preview MVP</span> — vezi animația completă direct în browser</span></li>
      <li><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Change Volume</span> — ajustează volumul din interfața web</span></li>
      <li><Icon icon="lucide:shuffle" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Random MVP</span> — activează modul aleatoriu</span></li>
    </ul>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:sparkles" width="22" height="22" color="#ff8c00" />
      <span><span class="cases-highlight">MVP-uri Custom</span> — poți cumpăra un MVP personalizat contra cost.</span>
    </div>

  </div>
</div>


<!-- INFO BOX FINAL -->
<div class="cases-info-box">
  <ul>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Notă:</span> Poți schimba MVP-ul oricând din meniul <code>!mvp</code>. Toate MVP-urile achiziționate rămân în inventarul tău permanent.</span></li>
  </ul>
</div>

</div>