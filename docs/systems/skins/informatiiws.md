---
outline: deep
---

<CaseHeader 
  title="Sistemul de WeaponSkins"
  :tags="[
    { text: 'skins', component: 'PageTagRed' },
    { text: 'weapons', component: 'PageTagBlue' },
    { text: 'inventory', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems', 'Sistem Skin-uri']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="sistem-skin-uri"
  badge-text="WeaponSkins"
/>

<div class="wf-system">

<!-- INTRO PANEL -->
<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <span class="wf-system-number">!ws</span> <span class="wf-system-highlight">Sistemul Avansat de WeaponSkins</span>
    <p>WeaponSkins este hub-ul principal pentru tot ce ține de cosmetice pe server: skin-uri de arme, cuțite, mănuși, agenți și partea de cases. Toate sunt legate între ele și funcționează în același ecosistem.</p>
    <p>Pagina asta e făcută ca orientare rapidă. Dacă vrei varianta completă pe fiecare modul, ai la final link-uri directe către paginile dedicate.</p>
  </div>
</div>

<!-- divider -->
<div class="wf-system-divider"></div>

<!-- 1.0 CUM ÎNCEPEM? -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="wf-system-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>1.0 CUM ÎNCEPEM?</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <p>Intrarea în sistem se face simplu, printr-o singură comandă în chat:</p>
    <div class="wf-system-important-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span><span class="wf-system-highlight">IMPORTANT:</span> Scrie <code>!ws</code> în chat pentru a deschide meniul principal.</span>
    </div>
    <p>După ce intri în meniu, flow-ul e împărțit clar în trei zone:</p>
    
  <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0;">
      <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
        <span><span class="wf-system-highlight">Shop</span> - cumperi iteme noi și vezi prețurile curente</span>
      </div>
      
   <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <line x1="8" y1="2" x2="8" y2="22"/>
        </svg>
        <span><span class="wf-system-highlight">My Inventory</span> - gestionezi ce deții deja și ce ai echipat</span>
      </div>
      
  <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span><span class="wf-system-highlight">Profile</span> - verifici progresul, balanța și statisticile</span>
      </div>
    </div>
    <p style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Pentru acces rapid la inventar poți folosi și comanda <code>!inv</code>.</p>
  </div>
</div>

<!-- divider -->
<div class="wf-system-divider"></div>

<!-- 2.0 MAGAZINUL (SHOP) -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="wf-system-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>2.0 MAGAZINUL (SHOP)</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <p>Shop-ul este zona unde se face toată achiziția de iteme. În funcție de categorie, poți cumpăra de la skin-uri comune până la iteme rare, limitate sau premium.</p>
    
  <div class="wf-system-category-container">
      <span class="wf-system-category-badge">Arme</span>
      <span class="wf-system-category-badge">Cuțite</span>
      <span class="wf-system-category-badge">Mănuși</span>
      <span class="wf-system-category-badge">Stickere</span>
      <span class="wf-system-category-badge">Brelocuri</span>
      <span class="wf-system-category-badge">Agenți</span>
    </div>
    <p style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Rifles, Pistols, SMGs și Heavies sunt toate incluse în același flow de shop.</p>
  </div>
</div>

<!-- Economia și Prețurile Dinamice -->
<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="wf-system-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
      </svg>
      Economia și Prețurile Dinamice
    </h3>
    <p>Economia este dinamică. Baza vine din <span class="wf-system-highlight">Steam Community Market</span>, iar apoi serverul ajustează prețurile în funcție de activitatea reală a jucătorilor.</p>
    <p>Asta înseamnă că piața nu stă pe loc: prețurile se schimbă, apar oportunități, iar timing-ul contează.</p>
    
  <div style="display: flex; flex-direction: column; gap: 12px; margin: 15px 0;">
      <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(255,68,68,0.05); padding: 10px 15px; border-radius: 8px;">
        <span class="wf-system-hot-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
          HOT
        </span>
        <span><span class="wf-system-highlight"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="18 15 12 9 6 15"/></svg> HOT:</span> Când mulți jucători cumpără același item, prețul poate crește automat.</span> 
      </div>
      
  <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(0,200,0,0.05); padding: 10px 15px; border-radius: 8px;">
        <span class="wf-system-steal-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          STEAL
        </span>
        <span><span class="wf-system-highlight"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="18 15 12 9 6 15"/><path d="M2 2v20h20"/></svg> STEAL:</span> Când un item nu se mai cumpără, poate primi reducere și devine ofertă bună.</span>
      </div>
    </div>
    
  <p>În plus, apar și <span class="wf-system-highlight">campanii globale de reducere</span> pe categorii întregi (ex: <code>-10% la toate cuțitele</code>).</p>
  </div>
</div>

<!-- Sistemul de Stocuri -->
<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="wf-system-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
      </svg>
      Sistemul de Stocuri
    </h3>
    <p>Stocurile sunt una dintre diferențele mari față de un shop clasic. Unele iteme sunt limitate și dispar când se epuizează:</p>
    
  <div style="display: flex; flex-direction: column; gap: 15px; margin: 15px 0;">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="wf-system-rare-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Rare
        </span>
        <span>Anumite skin-uri apar cu <code>X Left</code> - număr real de bucăți rămase.</span>
      </div>
      
 <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="wf-system-badge" style="background: rgba(100,100,100,0.2);">Sold Out</span>
        <span>La stoc zero, itemul devine <span class="wf-system-highlight">Out of Stock</span> până la restock / eveniment.</span>
      </div>
      
 <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="wf-system-badge">Nelimitat</span>
        <span>Itemele comune rămân, de regulă, pe stoc nelimitat.</span>
      </div>
    </div>
  </div>
</div>

<!-- Confirmarea Achiziției -->
<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="wf-system-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Confirmarea Achiziției
    </h3>
    <p>Înainte să cumperi, ai un ecran de confirmare clar. Astfel eviți click-uri greșite și știi exact ce plătești:</p>
    
  <ul class="wf-system-custom-list">
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Numele complet al skin-ului / itemului
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Prețul final, cu reducerile active aplicate
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Stocul disponibil în acel moment
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Balanța disponibilă înainte de confirmare
      </li>
    </ul>
    
 <div style="background: rgba(255,140,0,0.1); padding: 12px 15px; border-radius: 8px; margin-top: 10px;">
      <span>Dacă totul e ok, finalizezi direct prin <span class="wf-system-badge" style="background: linear-gradient(135deg, #ff8c00, #cc7000); color: white;">Buy Now</span>.</span>
    </div>
  </div>
</div>

<!-- divider -->
<div class="wf-system-divider"></div>

<!-- 3.0 INVENTARUL MEU -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="wf-system-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/></svg>3.0 INVENTARUL MEU</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
    </svg>
  </div>
  <div class="wf-system-content">
  <p>După achiziție, itemul se echipează instant și rămâne salvat permanent. Nu-l pierzi la schimb de hartă, restart sau reconectare.</p>

  <div style="background: rgba(255,140,0,0.05); padding: 15px; border-radius: 8px; margin: 15px 0;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
    </svg>
    <span>În inventar ai o evidență clară a itemelor deținute (inclusiv marcaje de tip <code>[✓]</code>) și poți re-echipa rapid orice variantă.</span>
  </div>

  <p>Poți gestiona inventarul atât din joc, cât și de pe site. Flow-ul standard este:</p>

  <ul class="wf-system-custom-list">
    <li>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span><span class="wf-system-highlight">În joc:</span> folosești <code>!inv</code> sau <code>!ws</code> pentru inventar rapid</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span><span class="wf-system-highlight">Pe site:</span> vezi colecția completă în <code>wildfire.ro/skins-market</code> -> Inventory</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span><span class="wf-system-highlight">Loadout:</span> alegi itemele active și sincronizarea se face automat în joc</span>
    </li>
  </ul>

  <div style="margin: 14px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
      <img src="/utility/inventory.png" alt="Inventory Menu - !inv" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
      <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!inv</div>
    </div>
    <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
      Meniu inventar în joc
    </div>
  </div>

  <div style="margin: 14px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
      <img src="/utility/gif_inventory.gif" alt="Inventory on website" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
      <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site inventory</div>
    </div>
    <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
      Inventar complet pe site
    </div>
  </div>

  <div style="margin: 14px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
      <img src="/utility/gif_loadout.gif" alt="Loadout on website" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
      <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site loadout</div>
    </div>
    <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
      Selectare loadout și echipare din browser
    </div>
  </div>
  </div>
</div>

<!-- Skin Properties -->
<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <h3 style="margin-top: 0; font-size: 18px; display: flex; align-items: center; gap: 8px;" class="wf-system-font">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Skin Properties (Personalizare Avansată)
    </h3>
    <p>Din inventar ai acces la personalizare avansată. Pe scurt: nu doar deții itemul, ci îl și ajustezi exact cum îți place.</p>
    
  <div class="wf-system-category-container" style="margin: 15px 0;">
      <span class="wf-system-feature-badge">Float / Wear</span>
      <span class="wf-system-feature-badge">Pattern</span>
      <span class="wf-system-feature-badge">Nametag</span>
      <span class="wf-system-feature-badge">StatTrak™</span>
    </div>
    
 <ul class="wf-system-custom-list">
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Float / Wear:</span> controlezi gradul de uzură (Factory New -> Battle-Scarred)
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Pattern:</span> setezi pattern-ul pentru look-uri rare/speciale
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Nametag:</span> adaugi nume custom pe armă sau cuțit
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">StatTrak™:</span> activezi tracker-ul de kill-uri
      </li>
    </ul>
  </div>
</div>

<!-- divider -->
<div class="wf-system-divider"></div>

<!-- 4.0 PROFILUL TĂU -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="wf-system-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>4.0 PROFILUL TĂU</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <p>Profilul îți arată rapid unde te afli în economie și colecție, fără să cauți prin meniuri:</p>
    
 <div class="wf-system-stats-grid">
      <div class="wf-system-stat-item">
        <div class="wf-system-stat-item-value">1,000</div>
        <div class="wf-system-stat-item-label">Balanță curentă</div>
      </div>
      <div class="wf-system-stat-item">
        <div class="wf-system-stat-item-value">5,000</div>
        <div class="wf-system-stat-item-label">Total Spent</div>
      </div>
    </div>
    
  <ul class="wf-system-custom-list">
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Balanța curentă:</span> suma pe care o poți folosi imediat în shop
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Total Spent:</span> totalul investit în iteme până acum
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="wf-system-highlight">Cel mai scump skin:</span> itemul tău de top, detectat automat de sistem
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Piese deținute:</span> totalul itemelor din colecția ta
      </li>
    </ul>
    
  <div class="wf-system-tip-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="wf-system-highlight">TIP:</span> Verifică zilnic piața, urmărește ofertele <span class="wf-system-steal-badge" style="display: inline-flex;">STEAL</span> și profită de stocurile limitate când apar.</span>
    </div>
  </div>
</div>

<!-- divider -->
<div class="wf-system-divider"></div>

<!-- 5.0 MODULE OVERVIEW -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3);" class="wf-system-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>5.0 REZUMAT MODULE SKINS</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <p>Mai jos ai un overview rapid pentru modulele principale din ecosistemul skins, fiecare cu preview vizual și pagină dedicată.</p>
  </div>
</div>

<div class="wf-info-grid" style="margin-top: 16px; align-items: stretch;">

<div class="wf-system-card" style="margin: 0; display: flex; flex-direction: column;">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <span class="wf-system-highlight"><a href="/systems/skins/cases" style="color: inherit; text-decoration: none;">Cases</a></span>
    <p>Deschizi cutii, primești skin-uri și totul se sincronizează în inventar.</p>
    <div style="margin: 12px 0 0; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 6px;">
      <div style="position: relative; border-radius: 8px; overflow: hidden;">
        <img src="/crates/cases_gif.gif" alt="Cases preview" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; right: 10px; bottom: 10px; background: rgba(0,0,0,0.72); color: #ff8c00; font-size: 11px; padding: 4px 10px; border-radius: 999px; font-family: 'Orbitron', sans-serif;">!cases</div>
      </div>
    </div>
    <p style="margin-top: 10px;"><a href="/systems/skins/cases" style="color: var(--vp-c-brand-1); text-decoration: none; font-weight: 600;">Vezi ghidul complet Cases →</a></p>
  </div>
</div>

<div class="wf-system-card" style="margin: 0; display: flex; flex-direction: column;">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M7 7l10 10"/>
      <path d="M5 9l10 10"/>
      <path d="M14 5l5 5"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <span class="wf-system-highlight"><a href="/systems/skins/knives" style="color: inherit; text-decoration: none;">Knives</a></span>
    <p>Cuțite rare, modele iconice și echipare instant din <code>!ws</code>.</p>
    <div style="margin: 12px 0 0; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 6px;">
      <div style="position: relative; border-radius: 8px; overflow: hidden;">
        <img src="/knives/gif_knives_1.gif" alt="Knives preview" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; right: 10px; bottom: 10px; background: rgba(0,0,0,0.72); color: #ff8c00; font-size: 11px; padding: 4px 10px; border-radius: 999px; font-family: 'Orbitron', sans-serif;">!ws knives</div>
      </div>
    </div>
    <p style="margin-top: 10px;"><a href="/systems/skins/knives" style="color: var(--vp-c-brand-1); text-decoration: none; font-weight: 600;">Vezi ghidul complet Knives →</a></p>
  </div>
</div>

<div class="wf-system-card" style="margin: 0; display: flex; flex-direction: column;">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M6 12h12"/>
      <path d="M8 8h8"/>
      <path d="M8 16h8"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <span class="wf-system-highlight"><a href="/systems/skins/gloves" style="color: inherit; text-decoration: none;">Gloves</a></span>
    <p>Mănuși premium, compatibile cu loadout-ul și cu seturile de cuțite.</p>
    <div style="margin: 12px 0 0; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 6px;">
      <div style="position: relative; border-radius: 8px; overflow: hidden;">
        <img src="/gloves/gif_gloves_1.gif" alt="Gloves preview" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; right: 10px; bottom: 10px; background: rgba(0,0,0,0.72); color: #ff8c00; font-size: 11px; padding: 4px 10px; border-radius: 999px; font-family: 'Orbitron', sans-serif;">!ws gloves</div>
      </div>
    </div>
    <p style="margin-top: 10px;"><a href="/systems/skins/gloves" style="color: var(--vp-c-brand-1); text-decoration: none; font-weight: 600;">Vezi ghidul complet Gloves →</a></p>
  </div>
</div>

<div class="wf-system-card" style="margin: 0; display: flex; flex-direction: column;">
  <div class="wf-system-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="wf-system-content">
    <span class="wf-system-highlight"><a href="/systems/skins/agents" style="color: inherit; text-decoration: none;">Agents</a></span>
    <p>Skin-uri de character pentru T/CT cu stiluri și identitate proprie.</p>
    <div style="margin: 12px 0 0; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 6px;">
      <div style="position: relative; border-radius: 8px; overflow: hidden;">
        <img src="/agents/gif_agents_1.gif" alt="Agents preview" style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; right: 10px; bottom: 10px; background: rgba(0,0,0,0.72); color: #ff8c00; font-size: 11px; padding: 4px 10px; border-radius: 999px; font-family: 'Orbitron', sans-serif;">!ws agents</div>
      </div>
    </div>
    <p style="margin-top: 10px;"><a href="/systems/skins/agents" style="color: var(--vp-c-brand-1); text-decoration: none; font-weight: 600;">Vezi ghidul complet Agents →</a></p>
  </div>
</div>

</div>

<!-- INFO BOX -->
<div class="wf-system-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="wf-system-highlight">Acesta este rezumatul complet al WeaponSkins.</span> Pentru detalii pas cu pas, continuă aici:
        <a href="/systems/skins/cases" style="color: var(--vp-c-brand-1); text-decoration: none; margin-left: 6px;">Cases</a> ·
        <a href="/systems/skins/knives" style="color: var(--vp-c-brand-1); text-decoration: none;">Knives</a> ·
        <a href="/systems/skins/gloves" style="color: var(--vp-c-brand-1); text-decoration: none;">Gloves</a> ·
        <a href="/systems/skins/agents" style="color: var(--vp-c-brand-1); text-decoration: none;">Agents</a>
      </span>
    </li>
  </ul>
</div>

</div>
