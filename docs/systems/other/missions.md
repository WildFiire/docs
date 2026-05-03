---
title: "Missions System"
description: "Sistemul de misiuni zilnice si saptamanale pe Wildfire.ro. Indeplineste obiectivele si castiga premii in PHX!"
outline: "deep"
---

<CaseHeader 
  title="Missions System"
  :tags="[
    { text: 'SYSTEM', component: 'PageTagBlue' },
    { text: 'NEW', component: 'PageTagRed' },
    { text: 'PHX', component: 'PageTagGreen' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Missions']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="missions-system"
  badge-text="Quests"
/>

<div class="wf-system">

<!-- 1.0 INFORMATII GENERALE -->

### <div style="display: none;">1.0 INFORMATII GENERALE</div>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="solar:info-circle-bold-duotone" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMATII GENERALE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:info" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Daily/Weekly</span> <span class="wf-system-highlight">Sistemul de Misiuni</span>
    <p>Sistemul de Missions este conceput pentru a recompensa jucatorii activi ai comunitatii Wildfire. Prin simpla participare pe server si indeplinirea unor obiective specifice, poti acumula <b>Phoenix Coins (PHX)</b>.</p>
  </div>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Foloseste urmatoarele comenzi pentru a interactiona cu sistemul:</p>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 11px; color: var(--vp-c-text-3); font-weight: 600; text-transform: uppercase;">Meniu Principal</span>
        <code style="background: rgba(255,140,0,0.1); color: #ff8c00; padding: 4px 10px; border-radius: 6px; font-weight: 700; width: fit-content;">!missions</code>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 11px; color: var(--vp-c-text-3); font-weight: 600; text-transform: uppercase;">Top Jucatori</span>
        <code style="background: rgba(255,140,0,0.1); color: #ff8c00; padding: 4px 10px; border-radius: 6px; font-weight: 700; width: fit-content;">!missiontop</code>
      </div>
    </div>
  </div>
</div>

<!-- 2.0 INTERFATA SI CONTROL -->

### <div style="display: none;">2.0 INTERFATA SI CONTROL</div>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="solar:monitor-bold-duotone" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 INTERFATA SI CONTROL</span>
</div>

<div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
  <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/missions/missions2.png" alt="Missions Menu Navigation" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!missions menu</div>
  </div>
  <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
    <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
    Foloseste tastele <span class="wf-system-highlight">E</span>, <span class="wf-system-highlight">F</span> si <span class="wf-system-highlight">SHIFT</span> pentru a naviga prin meniul de misiuni
  </div>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:mouse-pointer-2" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Navigarea in meniu se face rapid folosind tastele de control standard:</p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:arrow-right" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">SHIFT / F:</span> Navigare prin lista (Sus/Jos).</span></li>
      <li><Icon icon="lucide:check" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">E (Use):</span> Selectare misiune / Vizualizare detalii.</span></li>
      <li><Icon icon="lucide:x" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">TAB:</span> Inchidere rapida meniu.</span></li>
    </ul>
  </div>
</div>

<!-- 3.0 TIPURI DE MISIUNI -->

### <div style="display: none;">3.0 TIPURI DE MISIUNI</div>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="solar:calendar-bold-duotone" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 TIPURI DE MISIUNI</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:zap" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">3.1</span> <span class="wf-system-highlight">Misiuni Zilnice (Daily)</span>
    <p>Misiuni scurte care se reseteaza zilnic la ora 00:00. Poti finaliza pana la 3 astfel de misiuni pe zi pentru un boost rapid de PHX.</p>
    
  <div style="margin: 20px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/missions/missions.png" alt="Daily Mission Example" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">daily quest info</div>
      </div>
    </div>
  </div>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:trophy" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">3.2</span> <span class="wf-system-highlight">Misiuni Saptamanale (Weekly)</span>
    <p>Obiective mai complexe care necesita efort pe parcursul intregii saptamani. Ofera recompense substantiate de pana la 1000 PHX.</p>
    
   <div style="margin: 20px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/missions/missions3.png" alt="Weekly Mission Example" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">weekly quest info</div>
      </div>
    </div>
  </div>
</div>

<!-- 4.0 LOGICA DE PROGRES -->

### <div style="display: none;">4.0 LOGICA DE PROGRES</div>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="solar:rocket-bold-duotone" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 LOGICA DE PROGRES</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:settings-2" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:play-circle" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Activare:</span> Misiunile sunt urmarite automat in fundal din momentul conectarii.</span></li>
      <li><Icon icon="lucide:coins" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Premii:</span> Phoenix Coins sunt adaugati instant in portofel dupa indeplinirea obiectivului.</span></li>
    </ul>
  </div>
</div>

<div class="wf-system-tip">
  <Icon icon="lucide:lightbulb" width="22" height="22" color="#ff8c00" />
  <span>Sfat: Verifica saptamanal categoria <b>Weekly</b> pentru a nu rata bonusurile mari de monede!</span>
</div>

</div>
