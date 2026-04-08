---
outline: deep
---

<CaseHeader 
  title="Dices (Barbut)"
  :tags="[
    { text: 'gambling', component: 'PageTagRed' },
    { text: 'dices', component: 'PageTagOrange' },
    { text: '1v1', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems', 'Gambling', 'Dices']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="dices-page"
  badge-text="Barbut"
  badge-icon="lucide:dice-5"
/>

<div class="wf-system">

<!-- INTRO - DESCRIERE BARBUT -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:dice-5" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Gambling</span> <span class="wf-system-highlight">Dices / Barbut System</span>
    <p>Barbut-ul este jocul de gambling <span class="wf-system-highlight">1v1</span> al serverului — provoci un alt jucător, ambii puneți o sumă egală pe masă și zarurile decid cine pleacă cu tot. Este singurul joc de gambling care implică un <span class="wf-system-highlight">adversar real</span>, nu doar noroc împotriva casei.</p>
    <p>Sistemul acceptă atât <span class="wf-system-highlight">credite</span> cât și <span class="wf-system-highlight">Phoenix Coins</span>. Provocarea se face din chat, iar adversarul trebuie să accepte înainte să înceapă jocul.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Barbut-ul este un joc <span class="wf-system-highlight">1v1 real</span> — ambii jucători pariază aceeași sumă, iar câștigătorul ia totul. Joacă responsabil!</p>
</div>

### 1.0 CUM PROVOCI UN JUCĂTOR

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 CUM PROVOCI UN JUCĂTOR</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Ai două moduri de a iniția un joc de barbut:</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!bb</code> în chat pentru a deschide meniul de barbut, sau <code>!barbut [suma] [player]</code> pentru provocare directă.</span>
    </div>
    
  <p>După ce trimiți provocarea, adversarul primește un mesaj în chat și trebuie să accepte:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:send" width="18" height="18" color="#ff8c00" /><span><code>!bb</code> — deschide meniul principal de barbut</span></li>
      <li><Icon icon="lucide:swords" width="18" height="18" color="#ff8c00" /><span><code>!barbut [suma] [player]</code> — provocare directă cu sumă specificată</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><code>!bbaccept</code> — acceptă o provocare de barbut primită</span></li>
    </ul>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/barbut/gif_barbut_1.gif" alt="Barbut Menu - !bb" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!bb menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Comanda <span class="wf-system-highlight">!bb</span> — deschide meniul de provocare barbut
      </div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Provocarea expiră dacă adversarul nu acceptă într-un timp scurt. Poți provoca orice jucător de pe server.</span>
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
    <p>La barbut poți juca cu oricare dintre cele două monede ale serverului:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:circle-dollar-sign" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Credite</span> — moneda câștigată jucând pe server (kill-uri, MVP-uri, bonus zilnic)</span></li>
      <li><Icon icon="lucide:flame" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Phoenix Coins</span> — moneda premium, obținută din market sau evenimente</span></li>
    </ul>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Ambii jucători pariază <span class="wf-system-highlight">aceeași sumă</span> și aceeași monedă. Câștigătorul ia totul.</span>
    </div>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/barbut/gif_barbut_2.gif" alt="Selectare monedă - Barbut" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">currency select</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:coins" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Selectează moneda cu care vrei să joci — <span class="wf-system-highlight">Credite</span> sau <span class="wf-system-highlight">Phoenix Coins</span>
      </div>
    </div>
  </div>
</div>

### 3.0 CUM SE JOACĂ

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:cog" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 CUM SE JOACĂ</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:list" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Barbut-ul funcționează în <span class="wf-system-highlight">3 pași simpli</span>:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:send" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Pas 1</span> — Provoci un jucător cu <code>!bb</code> sau <code>!barbut [suma] [player]</code></span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Pas 2</span> — Adversarul acceptă cu <code>!bbaccept</code></span></li>
      <li><Icon icon="lucide:dice-5" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Pas 3</span> — Zarurile se aruncă automat, câștigătorul ia totul</span></li>
    </ul>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Rezultatul este <span class="wf-system-highlight">complet aleatoriu</span> — zarurile sunt generate de server, nu pot fi manipulate de niciun jucător.</span>
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
    <p>Vizionează un <span class="wf-system-highlight">preview complet</span> al sistemului de barbut înainte de a-l încerca pe server:</p>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video src="/barbut/video_barbut.mp4" controls style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);"></video>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:video" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Demonstrație live — barbut 1v1 în acțiune
      </div>
    </div>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Câștigurile sunt <span class="wf-system-highlight">transferate instant</span> către câștigător. Totul durează câteva secunde.</span>
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
    <p>Pe lângă barbut, serverul oferă încă <span class="wf-system-highlight">2 jocuri de gambling</span>:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:target" width="18" height="18" color="#ff8c00" /><span><a href="/systems/gambling/roulette" style="color:#ff8c00;font-weight:600;">Roulette</a> — pariezi pe culori, numere, grupuri sau coloane. Comandă: <code>!rl</code></span></li>
      <li><Icon icon="lucide:cherry" width="18" height="18" color="#ff8c00" /><span><a href="/systems/gambling/slots" style="color:#ff8c00;font-weight:600;">Slots</a> — trage de mâner, potrivește simboluri, câștigă jackpot. Comandă: <code>!slot</code></span></li>
    </ul>
  </div>
</div>

</div>

