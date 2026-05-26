---
title: "Cases"
description: "Descopera totul despre Cases pe platforma Wildfire.ro. Resurse complete, ghiduri si sisteme detaliate pentru Counter-Strike 2."
outline: "deep"
---

<CaseHeader 
  title="Cases"
  :tags="[
    { text: 'cases', color: 'red' },
    { text: 'skins', color: 'blue' },
    { text: 'market', color: 'green' },
    { text: 'website', color: 'purple' }
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
    <p>Sistemul de cutii de pe Wildfire este o functionalitate integrata a pietei de skin-uri, permitand jucatorilor sa utilizeze monedele lor <span class="wf-system-highlight">(Phoenix Coins)</span> pentru a debloca diverse cutii si a castiga skin-uri de CS2. Sistemul a fost creat pentru a fi complet <span class="wf-system-highlight">transparent, corect</span> si pentru a elimina frustrarea obtinerii de skin-uri duplicate.</p>
    <p>Cand jucatorul se afla pe server, armele castigate apar sau se updateaza automat direct in loadout (sau prin meniul <code>!ws</code>), nefiind necesara vreo relogare de pe joc. Skin-urile si preturile lor sunt bazate pe <span class="wf-system-highlight">preturile reale ale armelor de pe Steam Community Market</span>.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Sistemul de cutii este complet <span class="wf-system-highlight">transparent</span> — poti vedea inainte toate skin-urile disponibile in fiecare cutie si sansele aproximative de drop.</p>
</div>

### 1.0 COMENDA !cases & NAVIGARE
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:box" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 COMENDA !cases & NAVIGARE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Totul incepe cu o comanda simpla si o interfata intuitiva, controlata complet din <span class="wf-system-highlight">tastatura</span>.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!cases</code> in chat pentru a deschide interfata principala a <span class="wf-system-highlight">cutiilor</span>.</span>
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
    
  <p>Navigarea prin meniu se face cu ajutorul tastelor, exact ca intr-un joc adevarat:</p>
    
  <div class="wf-system-key-row">
      <div class="wf-system-key-item"><span class="wf-system-key-button">E</span><span>Tasta <span class="wf-system-highlight">E</span> - <strong>Selecteaza</strong> cutia</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button">F</span><span>Tasta <span class="wf-system-highlight">F</span> - <strong>Navigheaza in sus</strong></span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button shift-btn">SHIFT</span><span>Tasta <span class="wf-system-highlight">SHIFT</span> - <strong>Navigheaza in jos</strong></span></div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul principal iti va afisa toate <span class="wf-system-highlight">cutiile disponibile</span>, cu preview-uri clare si pretul fiecareia in Phoenix Coins.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/gif_case2.gif" alt="Interfata cutiilor" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">cases interface</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:grid-3x3" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Interfata completa a cutiilor in !cases. Foloseste tastele <span class="wf-system-highlight">SHIFT, F, E</span> pentru a naviga.
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
    <p>Dupa ce ai selectat cutia, sistemul simuleaza deschiderea in stilul clasic. Noutatea principala este ca <span class="wf-system-highlight">skin-ul castigat iti este echipat instantaneu</span> pe arma respectiva.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Imediat ce ai deschis cutia, <span class="wf-system-highlight">skin-ul este adaugat in inventar</span> si <span class="wf-system-highlight">echipat automat</span>. Nu mai trebuie sa intri in meniul de inventar.</span>
    </div>
    
   <p>Fiecare skin castigat este <span class="wf-system-highlight">anuntat in chat-ul public</span> pentru toti jucatorii.</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:message-square" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Anunt in Chat:</span> <code>"Player X opened a case and received [Skin Name]! [Skin Rarity]"</code></span></li>
      <li><Icon icon="lucide:armchair" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Echipare Automata:</span> Skin-ul apare pe arma ta in mana in mai putin de o secunda.</span></li>
    </ul>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/gif_case3.gif" alt="Deschidere cutie cu instant equip" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">case opening & instant equip</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:sparkles" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Procesul de deschidere si echipare automata
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
    <p>Sistemul elimina complet frustrarea obtinerii de <span class="wf-system-highlight">skin-uri duplicate</span>. Daca primesti un skin pe care il detii deja, primesti un refund corect.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Daca skin-ul extras exista deja in <span class="wf-system-highlight">inventarul tau</span>, primesti inapoi <span class="wf-system-highlight">80% din valoarea skin-ului</span> in Phoenix Coins.</span>
    </div>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span>Sistemul verifica daca ai deja <span class="wf-system-highlight">skin-ul in inventar</span>.</span></li>
      <li><Icon icon="lucide:wallet" width="18" height="18" color="#ff8c00" /><span>Daca da, primesti un <span class="wf-system-highlight">refund in monedele serverului</span>.</span></li>
      <li><Icon icon="lucide:message-circle" width="18" height="18" color="#ff8c00" /><span>Mesaj in chat: <code>"You already own this skin! You received a refund of X coins."</code></span></li>
    </ul>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/gif4.gif" alt="Anti-Duplicate & Refund" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">anti-duplicate system</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:shield-check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Sistemul anti-duplicate in actiune
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
    <p>Acceseaza <span class="wf-system-highlight">wildfire.ro/skins-market</span> si conecteaza-te cu contul tau Steam. Dupa autentificare, vei avea acces la dashboard, unde sunt disponibile mai multe sectiuni, printre care si <span class="wf-system-highlight">Cases</span>.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#ff8c00" />
      <span>Daca dai <span class="wf-system-highlight">click dreapta</span> pe o cutie, poti vedea continutul acesteia fara a o deschide - perfect pentru a verifica ce skin-uri poti castiga.</span>
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

### 4.1 INTERFATA SI CUTIILE DISPONIBILE
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layout-grid" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.1 INTERFATA SI CUTIILE DISPONIBILE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:layout-grid" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Interfata web prezinta toate cutiile disponibile, grupate pe categorii: <span class="wf-system-highlight">Exclusive, Premium, Standard</span>. Fiecare cutie afiseaza:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /><span>Numele cutiei</span></li>
      <li><Icon icon="lucide:coins" width="18" height="18" color="#ff8c00" /><span>Pretul in Phoenix Coins</span></li>
      <li><Icon icon="lucide:bar-chart-2" width="18" height="18" color="#ff8c00" /><span>Numarul de deschideri totale</span></li>
      <li><Icon icon="lucide:star" width="18" height="18" color="#ff8c00" /><span>Skin-ul cel mai rar disponibil</span></li>
    </ul>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_2.gif" alt="Interfata si cutiile disponibile" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
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
    <p>Dupa ce selectezi o cutie, se deschide panoul detaliat care include:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:square-arrow-out-up-right" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Butoane de deschidere:</span> OPEN (x1), OPEN X3, OPEN X5</span></li>
      <li><Icon icon="lucide:zap" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">QUICK OPEN:</span> Activeaza modul rapid pentru deschideri fara animatii</span></li>
      <li><Icon icon="lucide:activity" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Live Feed:</span> Poti vedea in timp real ce skin-uri au castigat alti jucatori</span></li>
    </ul>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Odata activat <span class="wf-system-highlight">QUICK OPEN</span>, poti deschide cutii instantaneu - perfect pentru sesiuni mari de deschideri.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_3.gif" alt="Selectarea cutiei, butoane x3 x5 quick open, live feed" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">case interface</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:layers" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Butoane de deschidere si Live Feed
      </div>
    </div>
  </div>
</div>

### 4.3 DESCHIDERE CUTIE & ANIMATIE
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:sparkles" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.3 DESCHIDERE CUTIE & ANIMATIE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:sparkles" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Dupa ce apesi butonul de deschidere, sistemul ruleaza animatia specifica cutiei, iar la final primesti skin-ul castigat. Acesta este adaugat automat in inventarul tau.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span><span class="wf-system-highlight">INSTANT SYNC:</span> Toate skin-urile deschise pe site sunt sincronizate automat cu inventarul tau din joc.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_4.gif" alt="Deschidere cutie si animatie" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">case opening</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:film" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Animatia de deschidere a cutiei
      </div>
    </div>
  </div>
</div>

### 4.4 INVENTARUL TAU
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.4 INVENTARUL TAU</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Toate skin-urile castigate sunt salvate in sectiunea <span class="wf-system-highlight">Inventory</span> a site-ului. Aici poti:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span>Vizualiza toate skin-urile detinute</span></li>
      <li><Icon icon="lucide:tag" width="18" height="18" color="#ff8c00" /><span>Verifica valoarea fiecarui skin</span></li>
      <li><Icon icon="lucide:clock" width="18" height="18" color="#ff8c00" /><span>Vedea istoricul complet al deschiderilor</span></li>
    </ul>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Poti accesa inventarul si din joc folosind comanda <code>!inv</code> sau meniul <code>!ws</code> → My Inventory.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_case_5.gif" alt="Inventarul tau pe site" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
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
    <p>Fiecare jucator primeste o <span class="wf-system-highlight">rotire gratuita zilnic</span> pe site. Aceasta poate fi folosita pentru obtinerea de <span class="wf-system-highlight">Phoenix Coins</span>.</p>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:gift" width="22" height="22" color="#ff8c00" />
      <span><span class="wf-system-highlight">FREE SPIN:</span> Bonusul se reseteaza in fiecare zi la ora <span class="wf-system-highlight">00:00 (server time)</span>. Nu uita sa-l revendici zilnic!</span>
    </div>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Conecteaza-te zilnic pe <code>wildfire.ro/skins-market</code> pentru a nu pierde rotirea gratuita! Este cea mai simpla modalitate de a-ti completa colectia fara costuri.</span>
    </div>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Sistemul de free spin are si un <span class="wf-system-highlight">istoric</span> care poate fi accesat pentru a urmari castigurile anterioare.</span>
    </div>
    
 <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/crates/site_spin.gif" alt="Free Spin zilnic pe site" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">daily free spin</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:rotate-cw" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Rotirea gratuita zilnica
      </div>
    </div>
  </div>
</div>

<!-- INFO BOX FINAL -->
<div class="wf-system-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Atentie!</span> Sistemul de cutii este in continua dezvoltare. Iti recomandam sa verifici mereu <span class="wf-system-highlight">lista de recompense</span> inainte de a deschide o cutie. <span class="wf-system-highlight">Noroc si cat mai multe skin-uri rare!</span></span></li>
  </ul>
</div>

</div>