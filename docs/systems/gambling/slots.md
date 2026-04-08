---
outline: deep
---

<CaseHeader 
  title="Slots"
  :tags="[
    { text: 'gambling', component: 'PageTagRed' },
    { text: 'slots', component: 'PageTagOrange' },
    { text: 'jackpot', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems', 'Gambling', 'Slots']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="slots-page"
  badge-text="Slots"
  badge-icon="lucide:cherry"
/>

<div class="wf-system">

<!-- INTRO - DESCRIERE SLOTS -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:cherry" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Gambling</span> <span class="wf-system-highlight">Slots System</span>
    <p>Slot machine-ul este jocul clasic de noroc — tragi de mâner, trei simboluri se rotesc și speri la combinația câștigătoare. Cu mize mici poți câștiga <span class="wf-system-highlight">jackpot-uri uriașe</span>, totul într-o singură tragere.</p>
    <p>Sistemul acceptă atât <span class="wf-system-highlight">credite</span> cât și <span class="wf-system-highlight">Phoenix Coins</span>. Alegi suma, tragi de mâner și vezi instantaneu dacă ai câștigat. Simplu, rapid și plin de adrenalină.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Gambling-ul este opțional și <span class="wf-system-highlight">100% bazat pe noroc</span>. Joacă responsabil — nu paria mai mult decât îți permiți să pierzi.</p>
</div>

### 1.0 CUM ACCESEZI SLOTS

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 CUM ACCESEZI SLOTS</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Totul începe cu o singură comandă scrisă în chat:</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!slot</code> în chat pentru a deschide meniul principal al <span class="wf-system-highlight">slot machine-ului</span>.</span>
    </div>
    
  <p>Meniul îți afișează balanța curentă, opțiunea de a alege suma și butonul de tragere. Interfața este simplă și rapidă.</p>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/slots/gif_slots_1.gif" alt="Slots Menu - !slot" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!slot menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Comanda <span class="wf-system-highlight">!slot</span> — deschide interfața slot machine-ului
      </div>
    </div>
  </div>
</div>

### 2.0 MONEDA DE JOC

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:coins" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 MONEDA DE JOC</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:wallet" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>La slots poți juca cu oricare dintre cele două monede ale serverului:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:circle-dollar-sign" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Credite</span> — moneda câștigată jucând pe server (kill-uri, MVP-uri, bonus zilnic)</span></li>
      <li><Icon icon="lucide:flame" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Phoenix Coins</span> — moneda premium, obținută din market sau evenimente</span></li>
    </ul>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Alegi moneda și suma <span class="wf-system-highlight">înainte de fiecare tragere</span>. Poți schimba oricând între cele două monede.</span>
    </div>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/slots/gif_slots_2.gif" alt="Selectare monedă - Slots" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">currency select</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:coins" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Selectează moneda cu care vrei să joci — <span class="wf-system-highlight">Credite</span> sau <span class="wf-system-highlight">Phoenix Coins</span>
      </div>
    </div>
  </div>
</div>

### 3.0 CUM FUNCȚIONEAZĂ

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:cog" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 CUM FUNCȚIONEAZĂ</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:list" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Mecanica este simplă — <span class="wf-system-highlight">3 role se rotesc</span> și trebuie să se oprească pe aceeași combinație:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:cherry" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">3 simboluri identice</span> — câștig garantat, multiplicatorul depinde de simbol</span></li>
      <li><Icon icon="lucide:star" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Jackpot</span> — combinația rară care oferă cel mai mare câștig posibil</span></li>
      <li><Icon icon="lucide:x" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Fără potrivire</span> — suma pariată este pierdută</span></li>
    </ul>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Fiecare tragere este <span class="wf-system-highlight">independentă</span> — rezultatul nu depinde de tragerile anterioare. Totul este bazat pe noroc pur.</span>
    </div>
  </div>
</div>

### 4.0 PREVIEW LIVE

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:video" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 PREVIEW LIVE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:play-circle" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Vizionează un <span class="wf-system-highlight">preview complet</span> al sistemului de slots înainte de a-l încerca pe server:</p>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video src="/slots/video_slots.mp4" controls style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);"></video>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:video" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Demonstrație live — slot machine-ul în acțiune
      </div>
    </div>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Câștigurile sunt <span class="wf-system-highlight">creditate instant</span> în balanța ta. Animația se derulează direct în HUD-ul jocului.</span>
    </div>
  </div>
</div>

### 5.0 ALTE JOCURI DE GAMBLING

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gamepad-2" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />5.0 ALTE JOCURI DE GAMBLING</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:gamepad-2" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Pe lângă slots, serverul oferă încă <span class="wf-system-highlight">2 jocuri de gambling</span>:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:target" width="18" height="18" color="#ff8c00" /><span><a href="/systems/gambling/roulette" style="color:#ff8c00;font-weight:600;">Roulette</a> — pariezi pe culori, numere, grupuri sau coloane. Comandă: <code>!rl</code></span></li>
      <li><Icon icon="lucide:dice-5" width="18" height="18" color="#ff8c00" /><span><a href="/systems/gambling/dices" style="color:#ff8c00;font-weight:600;">Dices (Barbut)</a> — jocul clasic de barbut 1v1 cu alt jucător. Comandă: <code>!bb</code></span></li>
    </ul>
  </div>
</div>

</div>
