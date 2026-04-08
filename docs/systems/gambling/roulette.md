---
outline: deep
---

<CaseHeader 
  title="Roulette"
  :tags="[
    { text: 'gambling', component: 'PageTagRed' },
    { text: 'roulette', component: 'PageTagOrange' },
    { text: 'coins', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems', 'Gambling', 'Roulette']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="roulette-page"
  badge-text="Roulette"
  badge-icon="lucide:target"
/>

<div class="wf-system">

<!-- INTRO - DESCRIERE ROULETTE -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:target" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Gambling</span> <span class="wf-system-highlight">Roulette System</span>
    <p>Ruleta este cel mai popular joc de gambling de pe server. Funcționează exact ca o ruletă reală — alegi un tip de pariu, plasezi suma dorită și aștepți rezultatul. Câștigurile variază în funcție de riscul asumat: de la <span class="wf-system-highlight">2x</span> pe culori, până la <span class="wf-system-highlight">36x</span> pe un număr exact.</p>
    <p>Sistemul acceptă atât <span class="wf-system-highlight">credite</span> cât și <span class="wf-system-highlight">Phoenix Coins</span>, iar câștigurile se adaugă instant în balanță. Totul se face din chat, fără meniuri complicate.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Gambling-ul este opțional și <span class="wf-system-highlight">100% bazat pe noroc</span>. Joacă responsabil — nu paria mai mult decât îți permiți să pierzi.</p>
</div>

### 1.0 CUM ACCESEZI RULETA

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 CUM ACCESEZI RULETA</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Totul începe cu o singură comandă scrisă în chat:</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!rl</code> în chat pentru a deschide meniul principal al <span class="wf-system-highlight">ruletei</span>.</span>
    </div>
    
  <p>Meniul îți va afișa toate opțiunile de pariu disponibile, balanța ta curentă și un istoric al ultimelor trageri.</p>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/roulette/gif_roulette_1.gif" alt="Roulette Menu - !rl" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!rl menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Comanda <span class="wf-system-highlight">!rl</span> — deschide interfața principală a ruletei
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
    <p>La ruletă poți juca cu oricare dintre cele două monede ale serverului:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:circle-dollar-sign" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Credite</span> — moneda câștigată jucând pe server (kill-uri, MVP-uri, bonus zilnic)</span></li>
      <li><Icon icon="lucide:flame" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Phoenix Coins</span> — moneda premium, obținută din market sau evenimente</span></li>
    </ul>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Alegi moneda <span class="wf-system-highlight">înainte de a plasa pariul</span>. Nu poți mixa cele două monede într-un singur pariu.</span>
    </div>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/roulette/gif_roulette_2.gif" alt="Selectare monedă - Roulette" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">currency select</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:coins" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Selectează moneda cu care vrei să joci — <span class="wf-system-highlight">Credite</span> sau <span class="wf-system-highlight">Phoenix Coins</span>
      </div>
    </div>
  </div>
</div>

### 3.0 OPȚIUNI DE PARIU

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layout-grid" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 OPȚIUNI DE PARIU</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:list" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Ruleta oferă <span class="wf-system-highlight">5 tipuri de pariuri</span>, fiecare cu riscuri și câștiguri diferite:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:palette" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Colors</span> (Roșu / Negru / Verde) — pariezi pe culoarea numărului câștigător. Verde = cel mai rar, cel mai mare câștig.</span></li>
      <li><Icon icon="lucide:hash" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Simple</span> (Par / Impar / Mic) — pariezi pe proprietăți generale: număr par, impar sau mic (1-18).</span></li>
      <li><Icon icon="lucide:rows-3" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Dozens</span> (1-12 / 13-24 / 25-36) — pariezi pe una dintre cele trei grupe de câte 12 numere.</span></li>
      <li><Icon icon="lucide:columns-3" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Columns</span> (Col 1 / Col 2 / Col 3) — pariezi pe una dintre cele trei coloane verticale.</span></li>
      <li><Icon icon="lucide:target" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Pick a Number</span> (0-36) — pariezi pe un număr exact. Cel mai mare risc, dar câștig de <span class="wf-system-highlight">36x</span>!</span></li>
    </ul>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Cu cât riscul e mai mare, cu atât <span class="wf-system-highlight">multiplicatorul de câștig</span> este mai mare. Alege strategic!</span>
    </div>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/roulette/gif_roulette_3.gif" alt="Opțiuni de pariu - Roulette" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">betting options</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:layout-grid" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Toate opțiunile de pariu — de la <span class="wf-system-highlight">Colors</span> la <span class="wf-system-highlight">Pick a Number</span>
      </div>
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
    <p>Vizionează un <span class="wf-system-highlight">preview complet</span> al sistemului de ruletă înainte de a-l încerca pe server:</p>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video src="/roulette/video_roulette.mp4" controls style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);"></video>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:video" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Demonstrație live — sistemul de ruletă în acțiune
      </div>
    </div>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Câștigurile sunt <span class="wf-system-highlight">creditate instant</span> în balanța ta. Poți vedea rezultatul și animația direct în joc.</span>
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
    <p>Pe lângă ruletă, serverul oferă încă <span class="wf-system-highlight">2 jocuri de gambling</span>:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:box" width="18" height="18" color="#ff8c00" /><span><a href="/systems/gambling/slots" style="color:#ff8c00;font-weight:600;">Slots</a> — trage de mâner, potrivește simboluri, câștigă jackpot. Comandă: <code>!slot</code></span></li>
      <li><Icon icon="lucide:dice-5" width="18" height="18" color="#ff8c00" /><span><a href="/systems/gambling/dices" style="color:#ff8c00;font-weight:600;">Dices (Barbut)</a> — jocul clasic de barbut 1v1 cu alt jucător. Comandă: <code>!bb</code></span></li>
    </ul>
  </div>
</div>

</div>
