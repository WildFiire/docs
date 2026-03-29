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
  updated-by-username="iannc69"
  page-id="systems-agents"
  badge-text="Operators"
  badge-icon="lucide:users"
/>

<div class="cases-wf">

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

.agents-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
.agent-card { background: var(--cases-card-bg); border: 1px solid var(--cases-card-border); border-radius: 20px; overflow: hidden; transition: all 0.2s ease; position: relative; text-align: center; }
.agent-card:hover { border-color: rgba(255,140,0,0.5); transform: translateY(-4px); }
.agent-img-wrap { background: linear-gradient(135deg, rgba(255,140,0,0.05), rgba(255,140,0,0.02)); padding: 24px 16px; display: flex; align-items: center; justify-content: center; }
.agent-img-wrap img { width: 100%; max-width: 180px; height: auto; object-fit: contain; display: block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); transition: transform 0.25s ease; }
.agent-card:hover .agent-img-wrap img { transform: scale(1.05); }
.agent-info { padding: 16px; border-top: 1px solid rgba(255,140,0,0.1); background: var(--cases-card-bg); }
.agent-name { font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 700; color: #ff8c00; margin: 0 0 6px; letter-spacing: 0.3px; }
.agent-desc { font-size: 12px; color: var(--cases-text); opacity: 0.75; margin: 0; line-height: 1.4; }
.agent-corner { position: absolute; top: 10px; left: 10px; width: 6px; height: 6px; border-top: 2px solid rgba(255,140,0,0.5); border-left: 2px solid rgba(255,140,0,0.5); }
html:not(.dark) .agent-card { background: var(--cases-card-bg); border-color: rgba(255,140,0,0.2); }
html:not(.dark) .agent-card:hover { border-color: rgba(255,140,0,0.6); }
html:not(.dark) .agent-img-wrap { background: linear-gradient(135deg, rgba(255,140,0,0.03), rgba(255,140,0,0.01)); }
html:not(.dark) .agent-name { color: #ff8c00; }
html:not(.dark) .agent-desc { color: #555; opacity: 0.85; }
html:not(.dark) .agent-corner { border-top-color: rgba(255,140,0,0.6); border-left-color: rgba(255,140,0,0.6); }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@media (max-width: 768px) { .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; } .cases-wf .cases-icon { width: 32px; height: 32px; } .cases-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; } .cases-wf .cases-key-button.shift-btn { width: 48px; font-size: 9px; } .agents-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } .agent-img-wrap img { max-width: 140px; } }
</style>

<!-- INTRO - DESCRIERE AGENȚI -->
<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:users" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <span class="cases-number">Operators</span> <span class="cases-highlight">Agent System</span>
    <p>Agenții sunt skin-uri de personaj care înlocuiesc modelele default ale jucătorilor din CS2. Fiecare agent are un design unic, voice lines specifice și animații proprii. Aceștia sunt împărțiți în două categorii: <span class="cases-highlight">Terrorist (T)</span> și <span class="cases-highlight">Counter-Terrorist (CT)</span>.</p>
    <p>Odată câștigați, agenții sunt adăugați în inventar și pot fi echipați direct din meniul <code>!ws</code> sau de pe site. Poți schimba oricând agentul pentru fiecare echipă separat.</p>
  </div>
</div>

<div class="gs-tip">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">Agenții sunt <span class="cases-highlight">iteme cosmetice</span> care nu oferă niciun avantaj în joc. Fiecare agent are voice lines unice și animații proprii.</p>
</div>

<!-- 1.0 INFORMAȚII -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 INFORMAȚII</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMAȚII</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="cases-highlight">tastatură</span>.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!ws</code> în chat pentru a deschide interfața principală a <span class="cases-highlight">skin-urilor și agenților</span>.</span>
    </div>
    
  <p>Navigarea prin meniul de agenți se face cu ajutorul tastelor:</p>
    
  <div class="cases-key-row">
      <div class="cases-key-item"><span class="cases-key-button">E</span><span>Tasta <span class="cases-highlight">E</span> - <strong>Selectează</strong> agentul</span></div>
      <div class="cases-key-item"><span class="cases-key-button">F</span><span>Tasta <span class="cases-highlight">F</span> - <strong>Navighează în sus</strong> prin categorii</span></div>
      <div class="cases-key-item"><span class="cases-key-button shift-btn">SHIFT</span><span>Tasta <span class="cases-highlight">SHIFT</span> - <strong>Navighează în jos</strong> prin categorii</span></div>
    </div>

   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/agents/gif_agents_1.gif" alt="Agents Menu Navigation - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!ws agents menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește tastele <span class="cases-highlight">E</span>, <span class="cases-highlight">F</span> și <span class="cases-highlight">SHIFT</span> pentru a naviga prin meniul !ws
      </div>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul <code>!ws</code> îți va afișa toți <span class="cases-highlight">agenții disponibili</span>, separați pe echipe (T și CT), cu prețul în Phoenix Coins.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/agents/gif_agents_2.gif" alt="Agents Selection - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">select agent</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Apasă <span class="cases-highlight">E</span> pentru a selecta agentul dorit — acesta se echipează automat
      </div>
    </div>
    
  <p>După ce selectezi un agent, se deschide panoul detaliat:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Preview</span> — poți vedea modelul agentului înainte de achiziție</span></li>
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Buy Now</span> — cumpără agentul direct cu Phoenix Coins</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Equip</span> — dacă îl deții deja, îl echipezi instant</span></li>
    </ul>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odată selectați, agenții sunt <span class="cases-highlight">vizibili instant</span> în joc, atât pentru tine cât și pentru ceilalți jucători. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

<!-- 2.0 CUM OBȚII AGENȚI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 CUM OBȚII AGENȚI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM OBȚII AGENȚI</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Singura metodă prin care poți obține agenți pe server este:</p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Market</span> — cumperi din <code>!ws</code> folosind Phoenix Coins</span></li>
    </ul>
  </div>
</div>

<!-- 3.0 INVENTAR & LOADOUT -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 INVENTAR & LOADOUT</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 INVENTAR & LOADOUT</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Toate item-urile tale sunt stocate în inventar și pot fi gestionate atât din joc, cât și de pe site-ul oficial.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/inventory.png" alt="Inventory Menu - !inv" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!inv - inventory menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:command" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește comanda <span class="cases-highlight">!inv</span> în joc pentru a-ți deschide inventarul
      </div>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:monitor" width="22" height="22" color="#00c851" />
      <span><span class="cases-highlight">Pe site-ul oficial:</span> Accesează <code>wildfire.ro/skins-market</code> și autentifică-te cu Steam pentru a accesa secțiunea <span class="cases-highlight">Inventory</span>. Acolo vei găsi toate skin-urile, cuțitele, mănușile și agenții pe care îi deții.</span>
    </div>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_inventory.gif" alt="Site Inventory - wildfire.ro/skins-market" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site inventory</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:package-open" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="cases-highlight">Inventory</span> de pe site poți vedea toate item-urile câștigate
      </div>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#00c851" />
      <span>După ce ai vizualizat inventarul, accesează secțiunea <span class="cases-highlight">Loadout</span> pentru a-ți echipa item-urile direct din browser.</span>
    </div>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_loadout.gif" alt="Site Loadout - Echipa iteme" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site loadout - equip items</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check-circle-2" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="cases-highlight">Loadout</span> selectează item-ul dorit și apasă Equip
      </div>
    </div>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Toate item-urile echipate pe site sunt <span class="cases-highlight">sincronizate automat</span> cu jocul. Nu este nevoie de relogare - schimbările sunt vizibile instant în CS2!</span>
    </div>
  </div>
</div>

<!-- 4.0 TIPURI DE AGENȚI -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.0 TIPURI DE AGENȚI</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:grid-3x3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 TIPURI DE AGENȚI</span>
</div>

<div class="agents-grid">
  <div class="agent-card"><div class="agent-corner"></div><div class="agent-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX3RtX3Byb2Zlc3Npb25hbF92YXJmLjRhZThkMGM5YmE3YTNkZDViNjU3NzE0ZWViNjk0NGQyNTk4ZWQ4ZWQucG5n/auto/auto/85/notrim/c2b69ab63cbc0d2b14c93825b070021b.webp" alt="Sir Bloody Miami Darryl"></div><div class="agent-info"><p class="agent-name">Sir Bloody Miami Darryl</p><p class="agent-desc">Agent T — Stil mafiot, voice lines memorabile</p></div></div>
  <div class="agent-card"><div class="agent-corner"></div><div class="agent-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX2N0bV9zdDZfdmFyaWFudGkuZjQ5YTMzN2FjZDBjOGE2OTVjMDQyYTc3NmE3ZWJiZjBjZDI3NzQ1OS5wbmc-/auto/auto/85/notrim/57c5671d39147d029d766d96fe272f3c.webp" alt="Lt. Commander Ricksaw"></div><div class="agent-info"><p class="agent-name">Lt. Commander Ricksaw</p><p class="agent-desc">Agent CT — Militar, comandant naval</p></div></div>
  <div class="agent-card"><div class="agent-corner"></div><div class="agent-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX2N0bV9mYmlfdmFyaWFudGIuYjQyNWUzNTA5MmZjMWM2NjM5ODcxZDk1NTg2NTE1YTBlYzk2MDEzNC5wbmc-/auto/auto/85/notrim/f6a4932a96d298968715ee3c6ba5ba82.webp" alt="Special Agent Ava"></div><div class="agent-info"><p class="agent-name">Special Agent Ava</p><p class="agent-desc">Agent CT — Feminin, stil elegant</p></div></div>
  <div class="agent-card"><div class="agent-corner"></div><div class="agent-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/products/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2NoYXJhY3RlcnMvY3VzdG9tcGxheWVyX3RtX2JhbGthbl92YXJpYW50aC5lZTFhYTYwMDI0ZmE2Yzk4NjMxNmQxNjNkMTQyODQ5MzZhODJhZDE2LnBuZw--/auto/auto/85/notrim/6376d787dc3e2b63e45e346662b0962c.webp" alt="The Doctor Romanov"></div><div class="agent-info"><p class="agent-name">'The Doctor' Romanov</p><p class="agent-desc">Agent T — Misterios, stil tactic</p></div></div>
</div>

<div class="gs-tip" style="margin-top: 24px;">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text"><strong>și mulți alții...</strong> — Number K, Dragomir, Rezan, etc!</p>
</div>

<!-- INFO BOX FINAL -->
<div class="cases-info-box">
  <ul>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Notă:</span> Poți schimba oricând agentul pentru fiecare echipă separat direct din meniul <code>!ws</code>.</span></li>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Atenție!</span> Agenții sunt iteme cosmetic rare. Prețurile variază în funcție de raritate și design.</span></li>
  </ul>
</div>

</div>