---
outline: deep
---

<CaseHeader 
  title="Cases"
  :tags="[
    { text: 'cases', component: 'PageTagRed' },
    { text: 'skins', component: 'PageTagBlue' },
    { text: 'market', component: 'PageTagGreen' },
    { text: 'website', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems','WeaponSkins', 'Cases']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="systems-cases"
  badge-text="Case Opening"
  badge-icon="lucide:box"
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
.cases-wf .cases-gif-box { margin: 20px 0; text-align: center; }
.cases-wf .cases-gif-box img { width: 100%; max-width: 800px; height: auto; display: inline-block; border-radius: 16px; border: 1px solid rgba(255,140,0,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

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
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #00c851;
  margin-top: 2px;
}
.cases-wf .gs-tip-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--cases-text);
  margin: 0;
  flex: 1;
}
html:not(.dark) .cases-wf .gs-tip {
  background: rgba(0,200,81,0.05);
  border-color: rgba(0,200,81,0.2);
}
html:not(.dark) .cases-wf .gs-tip-text {
  color: #2c3e2f;
}

/* GS TIP ORANGE - For warnings */
.cases-wf .gs-tip.orange {
  background: rgba(255,140,0,0.08);
  border-color: rgba(255,140,0,0.25);
}
.cases-wf .gs-tip.orange:hover {
  background: rgba(255,140,0,0.12);
  border-color: rgba(255,140,0,0.4);
}
.cases-wf .gs-tip.orange .gs-tip-icon {
  color: #ff8c00;
}

@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@media (max-width: 768px) { .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; } .cases-wf .cases-icon { width: 32px; height: 32px; } .cases-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; } .cases-wf .cases-key-button.shift-btn { width: 48px; font-size: 9px; } .cases-wf .cases-gif-box img { max-width: 100%; } }
</style>

<!-- INTRO - DESCRIERE SISTEM -->
<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:gift" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
   <span class="cases-number">Sistemul de Cutii</span> <span class="cases-highlight">Cases System</span>
    <p>Sistemul de cutii de pe Wildfire este o funcționalitate integrată a pieței de skin-uri, permițând jucătorilor să utilizeze monedele lor <span class="cases-highlight">(Phoenix Coins)</span> pentru a debloca diverse cutii și a câștiga skin-uri de CS2. Sistemul a fost creat pentru a fi complet <span class="cases-highlight">transparent, corect</span> și pentru a elimina frustrarea obținerii de skin-uri duplicate.</p>
    <p>Când jucătorul se află pe server, armele câștigate apar sau se updatează automat direct în loadout (sau prin meniul <code>!ws</code>), nefiind necesară vreo relogare de pe joc. Skin-urile și prețurile lor sunt bazate pe <span class="cases-highlight">prețurile reale ale armelor de pe Steam Community Market</span>.</p>
  </div>
</div>

<div class="gs-tip">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">Sistemul de cutii este complet <span class="cases-highlight">transparent</span> — poți vedea înainte toate skin-urile disponibile în fiecare cutie și șansele aproximative de drop.</p>
</div>

<!-- 1.0 COMENDA !cases & NAVIGARE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 COMENDA !cases & NAVIGARE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:box" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 COMENDA !cases & NAVIGARE</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="cases-highlight">tastatură</span>.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!cases</code> în chat pentru a deschide interfața principală a <span class="cases-highlight">cutiilor</span>.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/cases_gif.gif" alt="Navigare cutii" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!cases menu navigation</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Comanda <span class="cases-highlight">!cases</span>
      </div>
    </div>
    
  <p>Navigarea prin meniu se face cu ajutorul tastelor, exact ca într-un joc adevărat:</p>
    
  <div class="cases-key-row">
      <div class="cases-key-item"><span class="cases-key-button">E</span><span>Tasta <span class="cases-highlight">E</span> - <strong>Selectează</strong> cutia</span></div>
      <div class="cases-key-item"><span class="cases-key-button">F</span><span>Tasta <span class="cases-highlight">F</span> - <strong>Navighează în sus</strong></span></div>
      <div class="cases-key-item"><span class="cases-key-button shift-btn">SHIFT</span><span>Tasta <span class="cases-highlight">SHIFT</span> - <strong>Navighează în jos</strong></span></div>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul principal îți va afișa toate <span class="cases-highlight">cutiile disponibile</span>, cu preview-uri clare și prețul fiecăreia în Phoenix Coins.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/gif_case2.gif" alt="Interfața cutiilor" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">cases interface</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:grid-3x3" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Interfața completă a cutiilor în !cases. Foloseste tastele <span class="cases-highlight">SHIFT, F, E</span> pentru a naviga.
      </div>
    </div>
  </div>
</div>

<!-- 2.0 DESCHIDE CUTIA & INSTANT EQUIP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 DESCHIDE CUTIA & INSTANT EQUIP</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gem" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 DESCHIDE CUTIA & INSTANT EQUIP</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:box" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>După ce ai selectat cutia, sistemul simulează deschiderea în stilul clasic. Noutatea principală este că <span class="cases-highlight">skin-ul câștigat îți este echipat instantaneu</span> pe arma respectivă.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Imediat ce ai deschis cutia, <span class="cases-highlight">skin-ul este adăugat în inventar</span> și <span class="cases-highlight">echipat automat</span>. Nu mai trebuie să intri în meniul de inventar.</span>
    </div>
    
   <p>Fiecare skin câștigat este <span class="cases-highlight">anunțat în chat-ul public</span> pentru toți jucătorii.</p>
    
   <ul class="cases-custom-list">
      <li><Icon icon="lucide:message-square" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Anunț în Chat:</span> <code>"Player X opened a case and received [Skin Name]! [Skin Rarity]"</code></span></li>
      <li><Icon icon="lucide:armchair" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Echipare Automată:</span> Skin-ul apare pe arma ta în mână în mai puțin de o secundă.</span></li>
    </ul>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/gif_case3.gif" alt="Deschidere cutie cu instant equip" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">case opening & instant equip</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:sparkles" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Procesul de deschidere și echipare automată
      </div>
    </div>
  </div>
</div>

<!-- 3.0 ANTI-DUPLICATE & REFUND -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 ANTI-DUPLICATE & REFUND</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:refresh-cw" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 ANTI-DUPLICATE & REFUND</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:refresh-cw" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Sistemul elimină complet frustrarea obținerii de <span class="cases-highlight">skin-uri duplicate</span>. Dacă primești un skin pe care îl deții deja, primești un refund corect.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Dacă skin-ul extras există deja în <span class="cases-highlight">inventarul tău</span>, primești înapoi <span class="cases-highlight">80% din valoarea skin-ului</span> în Phoenix Coins.</span>
    </div>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span>Sistemul verifică dacă ai deja <span class="cases-highlight">skin-ul în inventar</span>.</span></li>
      <li><Icon icon="lucide:wallet" width="18" height="18" color="#ff8c00" /><span>Dacă da, primești un <span class="cases-highlight">refund în monedele serverului</span>.</span></li>
      <li><Icon icon="lucide:message-circle" width="18" height="18" color="#ff8c00" /><span>Mesaj în chat: <code>"You already own this skin! You received a refund of X coins."</code></span></li>
    </ul>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/gif4.gif" alt="Anti-Duplicate & Refund" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">anti-duplicate system</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:shield-check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Sistemul anti-duplicate în acțiune
      </div>
    </div>
  </div>
</div>

<!-- 4.0 DESCHIDERE CUTII PE SITE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.0 DESCHIDERE CUTII PE SITE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:monitor" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 DESCHIDERE CUTII PE SITE</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:monitor" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Accesează <span class="cases-highlight">wildfire.ro/skins-market</span> și conectează-te cu contul tău Steam. După autentificare, vei avea acces la dashboard, unde sunt disponibile mai multe secțiuni, printre care și <span class="cases-highlight">Cases</span>.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#ff8c00" />
      <span>Dacă dai <span class="cases-highlight">click dreapta</span> pe o cutie, poți vedea conținutul acesteia fără a o deschide - perfect pentru a verifica ce skin-uri poți câștiga.</span>
    </div>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_1.gif" alt="Deschidere cutii pe site - click dreapta preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site preview</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:eye" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Interfata site-ului nostru la cases
      </div>
    </div>
  </div>
</div>

<!-- 4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:layout-grid" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:layout-grid" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Interfața web prezintă toate cutiile disponibile, grupate pe categorii: <span class="cases-highlight">Exclusive, Premium, Standard</span>. Fiecare cutie afișează:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /><span>Numele cutiei</span></li>
      <li><Icon icon="lucide:coins" width="18" height="18" color="#ff8c00" /><span>Prețul în Phoenix Coins</span></li>
      <li><Icon icon="lucide:bar-chart-2" width="18" height="18" color="#ff8c00" /><span>Numărul de deschideri totale</span></li>
      <li><Icon icon="lucide:star" width="18" height="18" color="#ff8c00" /><span>Skin-ul cel mai rar disponibil</span></li>
    </ul>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_2.gif" alt="Interfața și cutiile disponibile" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">cases shop</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:shopping-cart" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Cutiile disponibile pe site
      </div>
    </div>
  </div>
</div>

<!-- 4.2 SELECTAREA CUTIEI & LIVE FEED -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.2 SELECTAREA CUTIEI & LIVE FEED</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.2 SELECTAREA CUTIEI & LIVE FEED</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:mouse-pointer-click" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>După ce selectezi o cutie, se deschide panoul detaliat care include:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:square-arrow-out-up-right" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Butoane de deschidere:</span> OPEN (x1), OPEN X3, OPEN X5</span></li>
      <li><Icon icon="lucide:zap" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">QUICK OPEN:</span> Activează modul rapid pentru deschideri fără animații</span></li>
      <li><Icon icon="lucide:activity" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Live Feed:</span> Poți vedea în timp real ce skin-uri au câștigat alți jucători</span></li>
    </ul>
    
   <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Odată activat <span class="cases-highlight">QUICK OPEN</span>, poți deschide cutii instantaneu - perfect pentru sesiuni mari de deschideri.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_3.gif" alt="Selectarea cutiei, butoane x3 x5 quick open, live feed" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">case interface</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:layers" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Butoane de deschidere și Live Feed
      </div>
    </div>
  </div>
</div>

<!-- 4.3 DESCHIDERE CUTIE & ANIMAȚIE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.3 DESCHIDERE CUTIE & ANIMAȚIE</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:sparkles" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.3 DESCHIDERE CUTIE & ANIMAȚIE</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:sparkles" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>După ce apeși butonul de deschidere, sistemul rulează animația specifică cutiei, iar la final primești skin-ul câștigat. Acesta este adăugat automat în inventarul tău.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span><span class="cases-highlight">INSTANT SYNC:</span> Toate skin-urile deschise pe site sunt sincronizate automat cu inventarul tău din joc.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_4.gif" alt="Deschidere cutie și animație" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">case opening</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:film" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Animația de deschidere a cutiei
      </div>
    </div>
  </div>
</div>

<!-- 4.4 INVENTARUL TĂU -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.4 INVENTARUL TĂU</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.4 INVENTARUL TĂU</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Toate skin-urile câștigate sunt salvate în secțiunea <span class="cases-highlight">Inventory</span> a site-ului. Aici poți:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span>Vizualiza toate skin-urile deținute</span></li>
      <li><Icon icon="lucide:tag" width="18" height="18" color="#ff8c00" /><span>Verifica valoarea fiecărui skin</span></li>
      <li><Icon icon="lucide:clock" width="18" height="18" color="#ff8c00" /><span>Vedea istoricul complet al deschiderilor</span></li>
    </ul>
    
  <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Poți accesa inventarul și din joc folosind comanda <code>!inv</code> sau meniul <code>!ws</code> → My Inventory.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_5.gif" alt="Inventarul tău pe site" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">inventory</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:package-open" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Gestionarea inventarului pe site
      </div>
    </div>
  </div>
</div>

<!-- 4.5 FREE SPIN ZILNIC -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.5 FREE SPIN ZILNIC</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.5 FREE SPIN ZILNIC</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:gift" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Fiecare jucător primește o <span class="cases-highlight">rotire gratuită zilnic</span> pe site. Aceasta poate fi folosită pentru obținerea de <span class="cases-highlight">Phoenix Coins</span>.</p>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:gift" width="22" height="22" color="#ff8c00" />
      <span><span class="cases-highlight">FREE SPIN:</span> Bonusul se resetează în fiecare zi la ora <span class="cases-highlight">00:00 (server time)</span>. Nu uita să-l revendici zilnic!</span>
    </div>
    
  <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Conectează-te zilnic pe <code>wildfire.ro/skins-market</code> pentru a nu pierde rotirea gratuită! Este cea mai simplă modalitate de a-ți completa colecția fără costuri.</span>
    </div>
    
  <div class="gs-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Sistemul de free spin are și un <span class="cases-highlight">istoric</span> care poate fi accesat pentru a urmări câștigurile anterioare.</span>
    </div>
    
 <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_spin.gif" alt="Free Spin zilnic pe site" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">daily free spin</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:rotate-cw" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Rotirea gratuită zilnică
      </div>
    </div>
  </div>
</div>

<!-- INFO BOX FINAL -->
<div class="cases-info-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Atenție!</span> Sistemul de cutii este în continuă dezvoltare. Îți recomandăm să verifici mereu <span class="cases-highlight">lista de recompense</span> înainte de a deschide o cutie. <span class="cases-highlight">Noroc și cât mai multe skin-uri rare!</span></span></li>
  </ul>
</div>

</div>