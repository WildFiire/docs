---
title: "C4 Planter Info"
description: "Detalii despre interfata vizuala afisata atunci cand bomba este plantata pe serverele Wildfire.ro."
---

<CaseHeader 
  title="C4 Planter Info"
  :tags="[
    { text: 'SYSTEM', component: 'PageTagBlue' },
    { text: 'UI', component: 'PageTagRed' },
    { text: 'INFO', component: 'PageTagGreen' }
  ]"
  :path="['Home', 'Systems', 'Other', 'C4 Planter']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="c4-planter-info"
  badge-text="C4 System"
/>

<div class="wf-system">

<!-- 1.0 PREZENTARE -->

### <div style="display: none;">1.0 PREZENTARE</div>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:info" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 PREZENTARE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:bomb" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">C4 System</span> <span class="wf-system-highlight">Interfata Bomba</span>
    <p>Atunci cand bomba este plantata, un UI personalizat apare pe ecran pentru a oferi informatii critice in timp real.</p>
  </div>
</div>

<!-- 2.0 DETALII INTERFATA -->

### <div style="display: none;">2.0 DETALII INTERFATA</div>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layout" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 DETALII INTERFATA</span>
</div>

<div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
  <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/c4system/plantbomb.png" alt="C4 Planted UI Display" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">c4 planted interface</div>
  </div>
  <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
    <Icon icon="lucide:eye" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
    Interfata vizuala afisata automat la plantarea bombei
  </div>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:monitor" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:user" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Planter:</span> Numele celui care a plantat.</span></li>
      <li><Icon icon="lucide:timer" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Timer:</span> Timpul ramas pana la explozie.</span></li>
    </ul>
  </div>
</div>

<div class="wf-system-tip">
  <Icon icon="lucide:shield-alert" width="22" height="22" color="#ff8c00" />
  <span>Acest UI este vizibil pentru toti jucatorii vii, ajutand la coordonarea rapida a echipei.</span>
</div>

</div>