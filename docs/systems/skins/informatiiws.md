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
    <p>Bine ați venit la <span class="wf-system-highlight">Noul Sistem de WeaponSkins</span>! Am reconstruit complet modul în care jucătorii interacționează cu skin-urile pe server, aducând o experiență de economie reală, stocuri limitate și un sistem de profil avansat, toate direct în CS2.</p>
    <p>Acest ghid este aici pentru a vă ajuta să înțelegeți cum funcționează sistemul și cum vă puteți construi colecția ideală de skin-uri.</p>
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
    <p>Totul începe cu simpla comandă în chat:</p>
    <div class="wf-system-important-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span><span class="wf-system-highlight">IMPORTANT:</span> Scrie <code>!ws</code> în chat pentru a deschide meniul principal.</span>
    </div>
    <p>De îndată ce deschideți meniul, veți observa 3 secțiuni principale care structurează întregul sistem:</p>
    
  <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0;">
      <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
        <span><span class="wf-system-highlight">Shop</span> - Magazinul de Skin-uri</span>
      </div>
      
   <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3"/>
          <line x1="8" y1="2" x2="8" y2="22"/>
        </svg>
        <span><span class="wf-system-highlight">My Inventory</span> - Inventarul Meu</span>
      </div>
      
  <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,140,0,0.03); padding: 10px 15px; border-radius: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span><span class="wf-system-highlight">Profile</span> - Profilul și Statisticile</span>
      </div>
    </div>
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
    <p>Aici începe distracția. Shop-ul este locul din care achiziționați noi articole cosmetice pentru a ieși în evidență pe server. Există categorii pentru absolut tot:</p>
    
  <div class="wf-system-category-container">
      <span class="wf-system-category-badge">Arme</span>
      <span class="wf-system-category-badge">Cuțite</span>
      <span class="wf-system-category-badge">Mănuși</span>
      <span class="wf-system-category-badge">Stickere</span>
      <span class="wf-system-category-badge">Brelocuri</span>
      <span class="wf-system-category-badge">Agenți</span>
    </div>
    <p style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Rifles, Pistols, SMGs, Heavies - toate sunt disponibile!</p>
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
    <p>O altă inovație este sistemul de economie. Prețurile skin-urilor nu sunt alese la întâmplare; ele se bazează pe prețurile reale de pe <span class="wf-system-highlight">Steam Community Market</span>.</p>
    <p>Pentru ca totul să fie și mai interesant, serverul ajustează prețurile în funcție de popularitatea skin-ului printre jucători:</p>
    
  <div style="display: flex; flex-direction: column; gap: 12px; margin: 15px 0;">
      <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(255,68,68,0.05); padding: 10px 15px; border-radius: 8px;">
        <span class="wf-system-hot-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
          HOT
        </span>
        <span><span class="wf-system-highlight"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="18 15 12 9 6 15"/></svg> HOT:</span> Dacă mulți jucători cumpără un anumit skin, prețul acestuia poate crește procentual (Markup). Fix ca în economia reală!</span> 
      </div>
      
  <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(0,200,0,0.05); padding: 10px 15px; border-radius: 8px;">
        <span class="wf-system-steal-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          STEAL
        </span>
        <span><span class="wf-system-highlight"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="18 15 12 9 6 15"/><path d="M2 2v20h20"/></svg> STEAL:</span> Dacă un skin nu a fost cumpărat de mult timp, prețul scade pentru a atrage cumpărători! Prinde oferta!</span>
      </div>
    </div>
    
  <p>De asemenea, veți întâlni frecvent <span class="wf-system-highlight">reduceri generale</span> aplicate întregului magazin (ex: <code>-10% la toate cuțitele!</code>).</p>
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
    <p>Acesta nu este un simplu meniu unde toată lumea alege aceleași 2 skin-uri la nesfârșit. Acum avem un sistem de stoc limitat:</p>
    
  <div style="display: flex; flex-direction: column; gap: 15px; margin: 15px 0;">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="wf-system-rare-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Rare
        </span>
        <span>Anumite skin-uri au <code>X Left</code> (Ex: Au mai rămas doar 2 bucăți de AWP Dragon Lore pe server).</span>
      </div>
      
 <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="wf-system-badge" style="background: rgba(100,100,100,0.2);">Sold Out</span>
        <span>Când stocul ajunge la zero, skin-ul devine automat <span class="wf-system-highlight">Out of Stock</span> (Epuizat) și niciun alt jucător nu mai poate cumpăra acel skin. Va trebui să așteptați ca administratorii să facă restock-uri (poate prin giveaway-uri sau evenimente speciale).</span>
      </div>
      
 <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span class="wf-system-badge">Nelimitat</span>
        <span>Unele skin-uri comune sau mai puțin căutate au stoc infinit.</span>
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
    <p>Nu veți cumpăra din greșeală un skin apăsând scurt un buton. Atunci când dați click pe un skin pe care doriți să-l achiziționați, se va deschide ecranul cu Detalii și Confirmare:</p>
    
  <ul class="wf-system-custom-list">
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Se afișează numele <span class="wf-system-highlight">Complet al Skin-ului</span>
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Prețul (inclusiv discount-urile active, tăiate sau verzi)
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Disponibilitatea Stocului actual
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Câți bani (Balanță) mai aveți în portofelul vostru
      </li>
    </ul>
    
 <div style="background: rgba(255,140,0,0.1); padding: 12px 15px; border-radius: 8px; margin-top: 10px;">
      <span>Abia apoi puteți da click pe <span class="wf-system-badge" style="background: linear-gradient(135deg, #ff8c00, #cc7000); color: white;">Buy Now</span>.</span>
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
    <p>După ce ați cumpărat un skin, sistemul îl echipează imediat! Dar skin-ul nu dispare la resetarea hărții – el este salvat forever. Intri pe server, joci o lună mai târziu, și skin-urile tale te așteaptă în <span class="wf-system-highlight">My Inventory</span>.</p>
    
 <div style="background: rgba(255,140,0,0.05); padding: 15px; border-radius: 8px; margin: 15px 0;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
      </svg>
      <span>Aici veți găsi armele pe care deja ați dat bani. Nu mai puteți cumpăra același skin de două ori! În dreptul fiecărei alegeri deblocate veți regăsi starea <code>[✓]</code> indicând proprietatea dumneavoastră. Selectând un skin de aici, îl veți re-echipa dacă l-ați scos.</span>
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
    <p>Din meniul de Inventar aveți acces la panoul de optimizare a bunurilor deținute. Vreți ca Asiimov-ul dvs. să fie impecabil sau zgâriat maxim în Battle-Scarred?</p>
    
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
        <span class="wf-system-highlight">Float / Wear:</span> De la 0.00 Factory New la 1.00 Battle-Scarred
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Pattern:</span> Modificați numărul generat pentru pattern (Foarte important la Case Hardened, Fade-uri, etc.)
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Nametag:</span> Dați arme/cuțitului un nume custom
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">StatTrak™:</span> Permite activarea afișajului de kill-uri
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
    <p>Acest modul vrea să strângă la un loc informațiile și performanța financiară a jucătorului. Intrând în panoul de profile veți vedea:</p>
    
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
        <span class="wf-system-highlight">Balanța curentă:</span> Numărul exact de monede disponibile (Se câștigă jucând regulat pe server, adunând puncte de xp, etc.)
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Total Spent:</span> O evidență vizibilă pentru suma totală cheltuită vreodată în tot ecosistemul WeaponSkins
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="wf-system-highlight">Cel mai Scump Skin (Best):</span> Sistemul detectează automat pe care item din inventarul tău s-au cheltuit cei mai mulți bani ("Bijuteria Coroanei"). Va fi afișat colorat, pe un soclu virtual, vizibil și în acest sub-meniu
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="wf-system-highlight">Piese Deținute:</span> Numărul total de cutii virtuale/produse fizice adjudecate în magazin
      </li>
    </ul>
    
  <div class="wf-system-tip-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="wf-system-highlight">TIP:</span> Explorați meniurile constant, strângeți credite, vânați ofertele <span class="wf-system-steal-badge" style="display: inline-flex;">STEAL</span> și nu ratați stocurile limitate pentru cele mai rare lame!</span>
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
      <span><span class="wf-system-highlight">Vă dorim spor la fragmentat</span> și la strâns colecții unice pe server!</span>
    </li>
  </ul>
</div>

</div>
