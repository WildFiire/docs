---
outline: deep
---

<CaseHeader 
  title="Hit Effects"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'visuals', component: 'PageTagPurple' },
    { text: 'effects', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Hit Effects']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="hit-effects"
  badge-text="Hit Effects"
  badge-icon="lucide:zap"
/>

<div class="wf-system">

<!-- 1.0 INFORMAȚII GENERALE -->

### <div style="display: none;">1.0 INFORMAȚII GENERALE</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:zap" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMAȚII GENERALE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:zap" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Visual Enhancement</span> <span class="wf-system-highlight">Sistemul de Hit Effects</span>
    <p>Sistemul de Hit Effects adaugă un feedback vizual și auditiv suplimentar atunci când lovești sau elimini un adversar. Acest lucru îmbunătățește experiența de joc, oferind o confirmare clară și satisfăcătoare a fiecărui damage cauzat.</p>
  </div>
</div>


<!-- 2.0 Despre sistem -->
### <div style="display: none;">2.0 Despre sistem</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover"> <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:sparkles" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 Despre sistem</span> </div><div class="wf-system-card"> <div class="wf-system-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div> <div class="wf-system-content"> <p>Sistemul de <span class="wf-system-highlight">Hit Effects</span> procesează fiecare impact și afișează tipul loviturii în funcție de zona atinsă:</p> <ul class="wf-system-custom-list"> <li><Icon icon="lucide:crosshair" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">HEADSHOT</span> — lovitură în cap, damage maxim.</span></li> <li><Icon icon="lucide:target" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">HEAD</span> — hit în zona capului (dar nu headshot letal).</span></li> <li><Icon icon="lucide:user" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">BODY</span> — lovitură în corp (torace, abdomen).</span></li> <li><Icon icon="lucide:footprints" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">LEGS</span> — lovitură în picioare, damage redus.</span></li> </ul> <p style="margin-top: 12px;">Fiecare hit afișează <span class="wf-system-highlight">damage-ul</span> cauzat (ex: <code>-143</code>) și <span class="wf-system-highlight">HP-ul rămas</span> al inamicului.</p> </div> </div><!-- 3.0 LOGICA HITMARK -->

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
      <img src="/hitmark/hitmark_ui.png" alt="Hitmark UI Preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
      <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">hitmark ui</div>
    </div>
    <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Interfața detaliată de Hitmark (Damage & HP)</div>
  </div>

<!-- 3.0 LOGICA HITMARK -->
### <div style="display: none;">3.0 LOGICA HITMARK</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:crosshair" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 LOGICA HITMARK</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:crosshair" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Sistemul de <span class="wf-system-highlight">Hitmark</span> este conceput să ofere informații doar atunci când există contact vizual direct cu inamicul. Acesta este un sistem inteligent care respectă integritatea competitivă:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Vizibilitate Directă:</span> UI-ul apare pe ecran doar dacă inamicul este în câmpul tău vizual (fără obstacole).</span></li>
      <li><Icon icon="lucide:shield-check" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Anti-Wallhack:</span> Dacă lovești un inamic prin perete sau prin smoke, meniul <span class="wf-system-highlight">NU</span> va apărea.</span></li>
      <li><Icon icon="lucide:info" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Informații Duel:</span> La contact vizual, vezi locația hit-ului (HEAD/BODY), damage-ul dat (ex: <code>-143</code>) și HP-ul rămas.</span></li>
    </ul>
  </div>
</div>





</div>
