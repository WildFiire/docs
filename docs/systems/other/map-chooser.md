---
outline: deep
---

<CaseHeader 
  title="Map Chooser / RTV"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'maps', component: 'PageTagGreen' },
    { text: 'voting', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Map Chooser / RTV']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="map-chooser"
  badge-text="Map Chooser"
  badge-icon="lucide:map"
/>

<div class="wf-system">

<!-- 1.0 SISTEMUL DE VOT -->
### <div style="display: none;">1.0 SISTEMUL DE VOT</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:map" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 SISTEMUL DE VOT</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:map" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Map Selection</span> <span class="wf-system-highlight">Sistemul de Map Chooser</span>
    <p>Map Chooser este sistemul care permite comunității să decidă următoarea hartă pe care se va juca. Acesta este format din trei module principale care lucrează împreună pentru a asigura o rotație diversificată și corectă a hărților.</p>
    <p>Spre deosebire de sistemul default CS2, acesta oferă posibilitatea de a nominaliza hărți specifice și de a forța un vot dacă jucătorii s-au plictisit de harta curentă.</p>
  </div>
</div>

<div class="wf-system-tip">
  <Icon icon="lucide:check-circle" width="22" height="22" color="#00c851" />
  <p class="wf-system-tip-text">Votul final apare automat în ultimele minute/runde ale hărții curente.</p>
</div>

<!-- 2.0 MODULE PRINCIPALE -->
### <div style="display: none;">2.0 MODULE PRINCIPALE</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:settings" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 MODULE PRINCIPALE</span>
</div>

<!-- RTV -->

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:rotate-cw" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <h3 style="margin-top: 0; font-size: 18px;" class="wf-system-font">RTV (Rock The Vote)</h3>
    <p>Permite jucătorilor să ceară schimbarea hărții înainte ca timpul oficial să expire. Odată ce un anumit procent de jucători scriu <code>!rtv</code>, un vot pentru schimbarea hărții va fi pornit instantaneu.</p>
  </div>
</div>

<!-- NOMINATE -->

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:plus-circle" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <h3 style="margin-top: 0; font-size: 18px;" class="wf-system-font">Nominate</h3>
    <p>Vrei o hartă anume? Folosește <code>!nominate</code> pentru a alege o hartă din listă. Hărțile nominalizate de jucători vor apărea cu prioritate în lista de vot de la finalul meciului.</p>
  </div>
</div>

<div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
  <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/votemap/mapvote.png" alt="Map Chooser Vote" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">voting menu</div>
  </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Exemplu meniu de vot la finalul hărții</div>
</div>

<!-- 3.0 COMENZI DISPONIBILE -->
### <div style="display: none;">3.0 COMENZI DISPONIBILE</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:terminal" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 COMENZI DISPONIBILE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:terminal" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Folosește următoarele comenzi în chat:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:chevron-right" width="18" height="18" color="#ff8c00" /><code>!rtv</code> — adaugă-ți votul pentru a schimba harta actuală.</li>
      <li><Icon icon="lucide:chevron-right" width="18" height="18" color="#ff8c00" /><code>!nominate</code> — deschide lista hărților pentru a nominaliza una.</li>
      <li><Icon icon="lucide:chevron-right" width="18" height="18" color="#ff8c00" /><code>!nextmap</code> — vezi în chat care este următoarea hartă stabilită.</li>
      <li><Icon icon="lucide:chevron-right" width="18" height="18" color="#ff8c00" /><code>!timeleft</code> — vezi cât timp mai este până la votul automat.</li>
    </ul>
  </div>
</div>


</div>
