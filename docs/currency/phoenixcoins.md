---
title: "Phoenix Coins"
description: "Descopera totul despre Phoenix Coins pe platforma Wildfire.ro. Resurse complete, ghiduri si sisteme detaliate pentru Counter-Strike 2."
outline: "deep"
---

<CaseHeader 
  title="Phoenix Coins"
  :tags="[
    { text: 'skins', component: 'PageTagRed' },
    { text: 'market', component: 'PageTagBlue' },
    { text: 'weapon shop', component: 'PageTagGreen' },
    { text: 'economie', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Currency', 'Phoenix Coins']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="phoenix-coins"
  badge-text="Coins"
  badge-icon="lucide:coins"
/>

<!-- INTRO COIN CARD -->
<div class="wf-currency-card" style="margin-bottom: 25px;">
  <div class="wf-currency-icon">
    <Icon icon="lucide:coins" :size="16" />
  </div>
  <div class="wf-currency-content">
    <span class="wf-currency-number">PHOENIX COINS</span> <span class="wf-currency-highlight">Moneda Weapon Shop-ului</span>
    <p>Phoenix Coins reprezinta moneda virtuala dedicata exclusiv personalizarii arsenalului tau prin sistemul <code>!ws</code>. Cu PHX poti debloca skin-uri de arme, cutite, manusi si accesorii premium (stickere si keychains).</p>
    <div class="wf-currency-features">
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Skins & Agents
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Knives & Gloves
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Stickers Shop
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Keychains Shop
      </span>
    </div>
  </div>
</div>

<!-- 1.0 CUM OBTII PHOENIX COINS -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:trending-up" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />1.0 CUM OBTII PHOENIX COINS</span>
</div>

<div class="wf-currency-grid">

  <!-- DONATII -->
  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:credit-card" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Donatii</span>
      <p>Poti cumpara pachete de Phoenix Coins direct din market-ul site-ului pentru a debloca instant item-urile dorite.</p>
      <div style="margin-top: 10px;">
        <span class="wf-currency-coin-badge">Market: wildfire.ro/skins-market</span>
      </div>
    </div>
  </div>

  <!-- MISIUNI -->
  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:clipboard-check" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Misiuni (!missions)</span>
      <p>Indeplineste obiectivele zilnice si saptamanale pentru a castiga PHX gratuit in timp ce te joci pe server.</p>
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Daily: 50-150 PHX</span>
        <span class="wf-currency-feature">Weekly: 500-1000 PHX</span>
      </div>
    </div>
  </div>

  <!-- ACTIVITATE (COMING SOON) -->
  <div class="wf-currency-card" style="opacity: 0.7; border-style: dashed;">
    <div class="wf-currency-icon">
      <Icon icon="lucide:timer" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Activitate</span>
      <p style="color: #ff8c00; font-weight: 700; font-size: 0.8em;">COMING SOON</p>
      <p>In curand vei putea castiga Phoenix Coins si pe baza timpului petrecut pe server si a performantei tale.</p>
    </div>
  </div>

</div>

<div class="wf-currency-divider"></div>

<!-- 2.0 WEAPON SHOP (!ws) -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:shopping-cart" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />2.0 WEAPON SHOP (!ws)</span>
</div>


<div class="wf-currency-grid">

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:palette" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Skins</span>
      <p>Personalizeaza-ti orice arma cu mii de skin-uri disponibile in joc.</p>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:sword" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Knives & Gloves</span>
      <p>Alege dintr-o gama larga de cutite si manusi premium pentru ambele echipe.</p>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:sticker" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Sticker Shop</span>
      <p>Adauga stickere pe armele tale pentru un aspect unic si personalizat.</p>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:key" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Keychain Shop</span>
      <p>Decoreaza-ti armele cu brelocuri (keychains) speciale.</p>
    </div>
  </div>

</div>

<div class="wf-currency-divider"></div>

<!-- 3.0 COMENZI UTILE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:terminal" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />3.0 COMENZI UTILE</span>
</div>

<div class="wf-currency-grid">

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:wallet" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!eco</span> - Verifica balanta ta de Phoenix Coins
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:send" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!eco pay [nume] [suma]</span> - Transfera coins unui alt jucator
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:gift" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!missions</span> - Vezi misiunile pentru a castiga PHX gratuit
    </div>
  </div>

</div>

<!-- INFO BOX -->
<div class="wf-currency-box">
  <ul>
    <li>
      <Icon icon="lucide:info" :size="20" />
      <span>Phoenix Coins sunt dedicati <span class="wf-currency-highlight">arsenalului de arme</span>. Pentru tag-uri chat si efecte, verificati sistemul de Credite.</span>
    </li>
    <li>
      <Icon icon="lucide:alert-triangle" :size="20" />
      <span>Orice tentativa de exploatare a bug-urilor pentru a obtine PHX se sanctioneaza cu ban permanent.</span>
    </li>
  </ul>
</div>