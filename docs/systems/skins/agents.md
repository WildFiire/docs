---
outline: deep
---

<CaseHeader 
  title="Agents"
  :tags="[
    { text: 'agents', component: 'PageTagPurple' },
    { text: 'operators', component: 'PageTagGreen' },
    { text: 'characters', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Skins', 'Agents']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="systems-agents"
  badge-text="Operators"
  badge-icon="lucide:users"
/>

<div class="wf-system">

<!-- INTRO - DESCRIERE AGENȚI -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:users" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Operators</span> <span class="wf-system-highlight">Agent System</span>
    <p>Agenții sunt skin-uri de personaj care înlocuiesc modelele default ale jucătorilor din CS2. Fiecare agent are un design unic, voice lines specifice și animații proprii. Aceștia sunt împărțiți în două categorii: <span class="wf-system-highlight">Terrorist (T)</span> și <span class="wf-system-highlight">Counter-Terrorist (CT)</span>.</p>
    <p>Odată câștigați, agenții sunt adăugați în inventar și pot fi echipați direct din meniul <code>!ws</code> sau de pe site. Poți schimba oricând agentul pentru fiecare echipă separat.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Agenții sunt <span class="wf-system-highlight">iteme cosmetice</span> care nu oferă niciun avantaj în joc. Fiecare agent are voice lines unice și animații proprii.</p>
</div>

### 1.0 INFORMAȚII

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMAȚII</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="wf-system-highlight">tastatură</span>.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!ws</code> în chat pentru a deschide interfața principală a <span class="wf-system-highlight">skin-urilor și agenților</span>.</span>
    </div>
    
  <p>Navigarea prin meniul de agenți se face cu ajutorul tastelor:</p>
    
  <div class="wf-system-key-row">
      <div class="wf-system-key-item"><span class="wf-system-key-button">E</span><span>Tasta <span class="wf-system-highlight">E</span> - <strong>Selectează</strong> agentul</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button">F</span><span>Tasta <span class="wf-system-highlight">F</span> - <strong>Navighează în sus</strong> prin categorii</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button shift-btn">SHIFT</span><span>Tasta <span class="wf-system-highlight">SHIFT</span> - <strong>Navighează în jos</strong> prin categorii</span></div>
    </div>

   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/agents/gif_agents_1.gif" alt="Agents Menu Navigation - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!ws agents menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește tastele <span class="wf-system-highlight">E</span>, <span class="wf-system-highlight">F</span> și <span class="wf-system-highlight">SHIFT</span> pentru a naviga prin meniul !ws
      </div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul <code>!ws</code> îți va afișa toți <span class="wf-system-highlight">agenții disponibili</span>, separați pe echipe (T și CT), cu prețul în Phoenix Coins.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/agents/gif_agents_2.gif" alt="Agents Selection - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">select agent</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Apasă <span class="wf-system-highlight">E</span> pentru a selecta agentul dorit — acesta se echipează automat
      </div>
    </div>
    
  <p>După ce selectezi un agent, se deschide panoul detaliat:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Preview</span> — poți vedea modelul agentului înainte de achiziție</span></li>
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Buy Now</span> — cumpără agentul direct cu Phoenix Coins</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Equip</span> — dacă îl deții deja, îl echipezi instant</span></li>
    </ul>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odată selectați, agenții sunt <span class="wf-system-highlight">vizibili instant</span> în joc, atât pentru tine cât și pentru ceilalți jucători. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

### 2.0 CUM OBȚII AGENȚI

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM OBȚII AGENȚI</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Singura metodă prin care poți obține agenți pe server este:</p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Market</span> — cumperi din <code>!ws</code> folosind Phoenix Coins</span></li>
    </ul>
  </div>
</div>

### 3.0 INVENTAR & LOADOUT

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 INVENTAR & LOADOUT</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Toate item-urile tale sunt stocate în inventar și pot fi gestionate atât din joc, cât și de pe site-ul oficial.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/inventory.png" alt="Inventory Menu - !inv" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!inv - inventory menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:command" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește comanda <span class="wf-system-highlight">!inv</span> în joc pentru a-ți deschide inventarul
      </div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:monitor" width="22" height="22" color="#00c851" />
      <span><span class="wf-system-highlight">Pe site-ul oficial:</span> Accesează <code>wildfire.ro/skins-market</code> și autentifică-te cu Steam pentru a accesa secțiunea <span class="wf-system-highlight">Inventory</span>. Acolo vei găsi toate skin-urile, cuțitele, mănușile și agenții pe care îi deții.</span>
    </div>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_inventory.gif" alt="Site Inventory - wildfire.ro/skins-market" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site inventory</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:package-open" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="wf-system-highlight">Inventory</span> de pe site poți vedea toate item-urile câștigate
      </div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#00c851" />
      <span>După ce ai vizualizat inventarul, accesează secțiunea <span class="wf-system-highlight">Loadout</span> pentru a-ți echipa item-urile direct din browser.</span>
    </div>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_loadout.gif" alt="Site Loadout - Echipa iteme" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site loadout - equip items</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check-circle-2" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="wf-system-highlight">Loadout</span> selectează item-ul dorit și apasă Equip
      </div>
    </div>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Toate item-urile echipate pe site sunt <span class="wf-system-highlight">sincronizate automat</span> cu jocul. Nu este nevoie de relogare - schimbările sunt vizibile instant în CS2!</span>
    </div>
  </div>
</div>

### 4.0 TIPURI DE AGENȚI

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:grid-3x3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 TIPURI DE AGENȚI</span>
</div>

<div class="wf-system-type-grid">
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WWj-gn47Q-GH7qxkhwsWjWyN6pJynGZld0CJR3QOdbtRa4lIGxY7_g7wfAy9USZdxTISw/330x192?allow_animated=1" alt="Sir Bloody Miami Darryl"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Sir Bloody Miami Darryl</p><p class="wf-system-type-desc">Agent T — Stil mafiot, voice lines memorabile</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nz6XRk-fO8YaVjNPndVz-Ul74hsbNoHi21kUly6mrQzNagcijBPQEnCsciTOdY4Rm6m4XvN_SiuVLIl2LQXw/360fx360f" alt="Lt. Commander Ricksaw"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Lt. Commander Ricksaw</p><p class="wf-system-type-desc">Agent CT — Militar, comandant naval</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nm_ytk-fO8YaVjNPLdXz6TkLdw5LY4Hnmwl0wktj7dn4r9I3OWPFApC5F1QeAO5xi4lIDiM_SiuVKk3V4ZcQ/360fx360f" alt="Special Agent Ava"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Special Agent Ava</p><p class="wf-system-type-desc">Agent CT — Feminin, stil elegant</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oZTh8Sla4c24abZkIf6HBinGlu0k4bU7Givnk01352yByd_6IHLGZgElDpchEbNZtxewx9zhNr_m-UWA3HK9C48i/360fx360f" alt="The Doctor Romanov"></div><div class="wf-system-type-info"><p class="wf-system-type-name">'The Doctor' Romanov</p><p class="wf-system-type-desc">Agent T — Misterios, stil tactic</p></div></div>

</div>

<div class="wf-system-tip" style="margin-top: 24px;">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text"><strong>și mulți alții...</strong> — Number K, Dragomir, Rezan, etc!</p>
</div>

<!-- INFO BOX FINAL -->
<div class="wf-system-box">
  <ul>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Notă:</span> Poți schimba oricând agentul pentru fiecare echipă separat direct din meniul <code>!ws</code>.</span></li>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Atenție!</span> Agenții sunt iteme cosmetic rare. Prețurile variază în funcție de raritate și design.</span></li>
  </ul>
</div>

</div>