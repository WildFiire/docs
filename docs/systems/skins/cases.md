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
<div class="wf-system">

<!-- INTRO - DESCRIERE SISTEM -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:gift" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
   <span class="wf-system-number">Sistemul de Cutii</span> <span class="wf-system-highlight">Cases System</span>
    <p>Sistemul de cutii de pe Wildfire este o funcționalitate integrată a pieței de skin-uri, permițând jucătorilor să utilizeze monedele lor <span class="wf-system-highlight">(Phoenix Coins)</span> pentru a debloca diverse cutii și a câștiga skin-uri de CS2. Sistemul a fost creat pentru a fi complet <span class="wf-system-highlight">transparent, corect</span> și pentru a elimina frustrarea obținerii de skin-uri duplicate.</p>
    <p>Când jucătorul se află pe server, armele câștigate apar sau se updatează automat direct în loadout (sau prin meniul <code>!ws</code>), nefiind necesară vreo relogare de pe joc. Skin-urile și prețurile lor sunt bazate pe <span class="wf-system-highlight">prețurile reale ale armelor de pe Steam Community Market</span>.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Sistemul de cutii este complet <span class="wf-system-highlight">transparent</span> — poți vedea înainte toate skin-urile disponibile în fiecare cutie și șansele aproximative de drop.</p>
</div>

### 1.0 COMENDA !cases & NAVIGARE
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:box" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 COMENDA !cases & NAVIGARE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="wf-system-highlight">tastatură</span>.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!cases</code> în chat pentru a deschide interfața principală a <span class="wf-system-highlight">cutiilor</span>.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/cases_gif.gif" alt="Navigare cutii" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!cases menu navigation</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Comanda <span class="wf-system-highlight">!cases</span>
      </div>
    </div>
    
  <p>Navigarea prin meniu se face cu ajutorul tastelor, exact ca într-un joc adevărat:</p>
    
  <div class="wf-system-key-row">
      <div class="wf-system-key-item"><span class="wf-system-key-button">E</span><span>Tasta <span class="wf-system-highlight">E</span> - <strong>Selectează</strong> cutia</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button">F</span><span>Tasta <span class="wf-system-highlight">F</span> - <strong>Navighează în sus</strong></span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button shift-btn">SHIFT</span><span>Tasta <span class="wf-system-highlight">SHIFT</span> - <strong>Navighează în jos</strong></span></div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul principal îți va afișa toate <span class="wf-system-highlight">cutiile disponibile</span>, cu preview-uri clare și prețul fiecăreia în Phoenix Coins.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/gif_case2.gif" alt="Interfața cutiilor" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">cases interface</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:grid-3x3" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Interfața completă a cutiilor în !cases. Foloseste tastele <span class="wf-system-highlight">SHIFT, F, E</span> pentru a naviga.
      </div>
    </div>
  </div>
</div>

### 2.0 DESCHIDE CUTIA & INSTANT EQUIP
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gem" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 DESCHIDE CUTIA & INSTANT EQUIP</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:box" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>După ce ai selectat cutia, sistemul simulează deschiderea în stilul clasic. Noutatea principală este că <span class="wf-system-highlight">skin-ul câștigat îți este echipat instantaneu</span> pe arma respectivă.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Imediat ce ai deschis cutia, <span class="wf-system-highlight">skin-ul este adăugat în inventar</span> și <span class="wf-system-highlight">echipat automat</span>. Nu mai trebuie să intri în meniul de inventar.</span>
    </div>
    
   <p>Fiecare skin câștigat este <span class="wf-system-highlight">anunțat în chat-ul public</span> pentru toți jucătorii.</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:message-square" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Anunț în Chat:</span> <code>"Player X opened a case and received [Skin Name]! [Skin Rarity]"</code></span></li>
      <li><Icon icon="lucide:armchair" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Echipare Automată:</span> Skin-ul apare pe arma ta în mână în mai puțin de o secundă.</span></li>
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

### 3.0 ANTI-DUPLICATE & REFUND
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:refresh-cw" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 ANTI-DUPLICATE & REFUND</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:refresh-cw" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Sistemul elimină complet frustrarea obținerii de <span class="wf-system-highlight">skin-uri duplicate</span>. Dacă primești un skin pe care îl deții deja, primești un refund corect.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Dacă skin-ul extras există deja în <span class="wf-system-highlight">inventarul tău</span>, primești înapoi <span class="wf-system-highlight">80% din valoarea skin-ului</span> în Phoenix Coins.</span>
    </div>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span>Sistemul verifică dacă ai deja <span class="wf-system-highlight">skin-ul în inventar</span>.</span></li>
      <li><Icon icon="lucide:wallet" width="18" height="18" color="#ff8c00" /><span>Dacă da, primești un <span class="wf-system-highlight">refund în monedele serverului</span>.</span></li>
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

### 4.0 DESCHIDERE CUTII PE SITE
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:monitor" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 DESCHIDERE CUTII PE SITE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:monitor" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Accesează <span class="wf-system-highlight">wildfire.ro/skins-market</span> și conectează-te cu contul tău Steam. După autentificare, vei avea acces la dashboard, unde sunt disponibile mai multe secțiuni, printre care și <span class="wf-system-highlight">Cases</span>.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#ff8c00" />
      <span>Dacă dai <span class="wf-system-highlight">click dreapta</span> pe o cutie, poți vedea conținutul acesteia fără a o deschide - perfect pentru a verifica ce skin-uri poți câștiga.</span>
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

### 4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layout-grid" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.1 INTERFAȚA ȘI CUTIILE DISPONIBILE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:layout-grid" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Interfața web prezintă toate cutiile disponibile, grupate pe categorii: <span class="wf-system-highlight">Exclusive, Premium, Standard</span>. Fiecare cutie afișează:</p>
    
  <ul class="wf-system-custom-list">
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

### 4.2 SELECTAREA CUTIEI & LIVE FEED
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.2 SELECTAREA CUTIEI & LIVE FEED</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:mouse-pointer-click" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>După ce selectezi o cutie, se deschide panoul detaliat care include:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:square-arrow-out-up-right" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Butoane de deschidere:</span> OPEN (x1), OPEN X3, OPEN X5</span></li>
      <li><Icon icon="lucide:zap" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">QUICK OPEN:</span> Activează modul rapid pentru deschideri fără animații</span></li>
      <li><Icon icon="lucide:activity" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Live Feed:</span> Poți vedea în timp real ce skin-uri au câștigat alți jucători</span></li>
    </ul>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Odată activat <span class="wf-system-highlight">QUICK OPEN</span>, poți deschide cutii instantaneu - perfect pentru sesiuni mari de deschideri.</span>
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

### 4.3 DESCHIDERE CUTIE & ANIMAȚIE
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:sparkles" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.3 DESCHIDERE CUTIE & ANIMAȚIE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:sparkles" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>După ce apeși butonul de deschidere, sistemul rulează animația specifică cutiei, iar la final primești skin-ul câștigat. Acesta este adăugat automat în inventarul tău.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span><span class="wf-system-highlight">INSTANT SYNC:</span> Toate skin-urile deschise pe site sunt sincronizate automat cu inventarul tău din joc.</span>
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

### 4.4 INVENTARUL TĂU
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.4 INVENTARUL TĂU</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Toate skin-urile câștigate sunt salvate în secțiunea <span class="wf-system-highlight">Inventory</span> a site-ului. Aici poți:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span>Vizualiza toate skin-urile deținute</span></li>
      <li><Icon icon="lucide:tag" width="18" height="18" color="#ff8c00" /><span>Verifica valoarea fiecărui skin</span></li>
      <li><Icon icon="lucide:clock" width="18" height="18" color="#ff8c00" /><span>Vedea istoricul complet al deschiderilor</span></li>
    </ul>
    
  <div class="wf-system-tip">
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

### 4.5 FREE SPIN ZILNIC
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.5 FREE SPIN ZILNIC</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:gift" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Fiecare jucător primește o <span class="wf-system-highlight">rotire gratuită zilnic</span> pe site. Aceasta poate fi folosită pentru obținerea de <span class="wf-system-highlight">Phoenix Coins</span>.</p>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:gift" width="22" height="22" color="#ff8c00" />
      <span><span class="wf-system-highlight">FREE SPIN:</span> Bonusul se resetează în fiecare zi la ora <span class="wf-system-highlight">00:00 (server time)</span>. Nu uita să-l revendici zilnic!</span>
    </div>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Conectează-te zilnic pe <code>wildfire.ro/skins-market</code> pentru a nu pierde rotirea gratuită! Este cea mai simplă modalitate de a-ți completa colecția fără costuri.</span>
    </div>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Sistemul de free spin are și un <span class="wf-system-highlight">istoric</span> care poate fi accesat pentru a urmări câștigurile anterioare.</span>
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
<div class="wf-system-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Atenție!</span> Sistemul de cutii este în continuă dezvoltare. Îți recomandăm să verifici mereu <span class="wf-system-highlight">lista de recompense</span> înainte de a deschide o cutie. <span class="wf-system-highlight">Noroc și cât mai multe skin-uri rare!</span></span></li>
  </ul>
</div>

</div>