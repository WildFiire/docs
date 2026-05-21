---
title: "Client Settings"
description: "Configurare rapida pentru Visual si Sounds pe WildFire.ro."
outline: deep
---

<CaseHeader 
  title="Client Settings"
  :tags="[
    { text: 'other', color: 'red' },
    { text: 'settings', color: 'purple' },
    { text: 'config', color: 'blue' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Client Settings']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="client-settings"
  badge-text="Settings"
  badge-icon="lucide:settings-2"
/>

<div class="wf-system">

<!-- 1.0 MENIU PRINCIPAL -->

### <div style="display: none;">1.0 MENIU PRINCIPAL</div>

## <span style="display:none">Meniu Principal</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:settings-2" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 MENIU PRINCIPAL</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:sliders" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Comanda <code>!settings</code> deschide interfata principala de unde poti naviga rapid intre categoriile de configurare.</p>

   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/settings/settings1.png" alt="main settings preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">main menu</div>
      </div>
      <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2); display: flex; align-items: center; justify-content: center; gap: 6px;">
        <Icon icon="lucide:layout-template" width="14" height="14" /> Interfata principala Visual & Sounds
      </div>
    </div>
  </div>
</div>

<!-- 2.0 SETARI VIZUALE -->

### <div style="display: none;">2.0 SETARI VIZUALE</div>

## <span style="display:none">Visual</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:eye" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 SETARI VIZUALE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Personalizeaza modul in care primesti feedback vizual in timpul jocului (ex: HitMarker).</p>

 <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/settings/settings2.png" alt="visual settings preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">visual options</div>
      </div>
      <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2); display: flex; align-items: center; justify-content: center; gap: 6px;">
        <Icon icon="lucide:monitor" width="14" height="14" /> Activare / Dezactivare HitMarker
      </div>
    </div>
  </div>
</div>

<!-- 3.0 SETARI SONORE -->

### <div style="display: none;">3.0 SETARI SONORE</div>

## <span style="display:none">Sounds</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:volume-2" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 SETARI SONORE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Filtreaza sunetele pentru MVP, Chat, PM, Mentiuni, Gambling sau C4. Foloseste optiunea master pentru control global.</p>

   <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0;">
      <div style="border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
        <div style="position: relative; border-radius: 12px; overflow: hidden;">
          <img src="/settings/settings3.png" alt="sounds part 1" style="width: 100%; height: auto; display: block; border-radius: 8px;">
        </div>
      </div>
      <div style="border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
        <div style="position: relative; border-radius: 12px; overflow: hidden;">
          <img src="/settings/settings4.png" alt="sounds part 2" style="width: 100%; height: auto; display: block; border-radius: 8px;">
        </div>
      </div>
    </div>

  <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="18" height="18" color="#ff8c00" />
      <span>Setarile se salveaza instantaneu si sunt memorate in baza de date a serverului.</span>
    </div>
  </div>
</div>

</div>