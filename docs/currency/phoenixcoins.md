---
outline: deep
---

<CaseHeader 
  title="Phoenix Coins"
  :tags="[
    { text: 'credite', component: 'PageTagRed' },
    { text: 'market', component: 'PageTagBlue' },
    { text: 'skinuri', component: 'PageTagGreen' },
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
    <span class="wf-currency-number">PHOENIX COINS</span> <span class="wf-currency-highlight">Moneda serverului</span>
    <p>Phoenix Coins sunt moneda virtuală a comunității Wildfire. Le poți folosi pentru a cumpăra skin-uri, cutii, efecte speciale și multe altele, atât pe server cât și pe site.</p>
    <div class="wf-currency-features">
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Skin-uri personalizate
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Cutii premium
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Efecte speciale
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Culori chat
      </span>
    </div>
  </div>
</div>

<!-- 1.0 CUM OBȚII PHOENIX COINS -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:trending-up" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />1.0 CUM OBȚII PHOENIX COINS</span>
</div>

<div class="wf-currency-grid">

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:trophy" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Jucând meciuri</span> Câștigi coins pentru fiecare meci jucat:
      <div style="display: flex; gap: 15px; flex-wrap: wrap; margin: 10px 0 0 0;">
        <div><span class="wf-currency-coin-badge">Victoria: +5 coins</span></div>
        <div><span class="wf-currency-coin-badge">Înfrângere: +2 coins</span></div>
        <div><span class="wf-currency-coin-badge">Remiză: +1 coin</span></div>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:star" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Performanță individuală</span> Bonusuri pentru acțiuni în timpul meciului:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">MVP: +3 coins</span>
        <span class="wf-currency-feature">Kill: +1 coin</span>
        <span class="wf-currency-feature">Headshot: +2 coins</span>
        <span class="wf-currency-feature">Assist: +1 coin</span>
        <span class="wf-currency-feature">Clutch: +5 coins</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:calendar" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Bonus zilnic</span> Conectează-te zilnic pentru a primi bonus:
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
        <span class="wf-currency-coin-badge">Ziua 1: 50 coins</span>
        <span class="wf-currency-coin-badge">Ziua 2: 75 coins</span>
        <span class="wf-currency-coin-badge">Ziua 3: 100 coins</span>
        <span class="wf-currency-coin-badge">Ziua 4: 125 coins</span>
        <span class="wf-currency-coin-badge">Ziua 5: 150 coins</span>
        <span class="wf-currency-coin-badge">Ziua 6: 200 coins</span>
        <span class="wf-currency-coin-badge">Ziua 7+: 250 coins</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:gem" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Gold Member</span> Dacă deții gradul Gold Member, primești <span class="wf-currency-highlight">+50% coins</span> la toate câștigurile din meciuri.
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:party-popper" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Evenimente speciale</span> Participă la evenimentele săptămânale pentru premii bonus și coins înmulțiți.
    </div>
  </div>

</div>

<div class="wf-currency-divider"></div>

<!-- 2.0 CE POȚI CUMPĂRA -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:shopping-cart" :size="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />2.0 CE POȚI CUMPĂRA CU PHOENIX COINS</span>
</div>

<div class="wf-currency-grid">

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:package" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Cutii</span> Deschide cutii pentru a primi skin-uri, cuțite și mănuși:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Cutie Standard: 100 coins</span>
        <span class="wf-currency-feature">Cutie Premium: 250 coins</span>
        <span class="wf-currency-feature">Cutie Legendary: 500 coins</span>
        <span class="wf-currency-feature">Cutie Gold: 1000 coins</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:palette" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Skin-uri personalizate</span> Cumpără skin-uri direct din shop-ul serverului:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Skin-uri normale: 50-200 coins</span>
        <span class="wf-currency-feature">Skin-uri rare: 200-500 coins</span>
        <span class="wf-currency-feature">Skin-uri legendare: 500-1500 coins</span>
        <span class="wf-currency-feature">Skin-uri exclusive: 1500+ coins</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:sword" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Cuțite și mănuși</span> 
      <p>Cuțite: <span class="wf-currency-highlight">200-1500 coins</span></p>
      <p>Mănuși: <span class="wf-currency-highlight">300-1200 coins</span></p>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:message-square" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Tag-uri și efecte</span>
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Culoare chat: 50 coins (permanent)</span>
        <span class="wf-currency-feature">Tag personalizat: 100 coins</span>
        <span class="wf-currency-feature">Efect kill: 150 coins</span>
        <span class="wf-currency-feature">MVP animat: 200 coins</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:crown" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">VIP temporar</span> Cumpără acces VIP pentru perioade limitate:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">VIP 7 zile: 500 coins</span>
        <span class="wf-currency-feature">VIP 30 zile: 1500 coins</span>
        <span class="wf-currency-feature">VIP 90 zile: 4000 coins</span>
      </div>
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
      <span class="wf-currency-number">!coins</span> - Verifică câte Phoenix Coins ai în cont
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:package" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!shop</span> - Deschide shop-ul serverului
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:gift" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!case</span> - Deschide meniul de cutii
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:palette" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!ws</span> - Deschide meniul de skin-uri (poți cumpăra direct)
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:sword" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!knife</span> - Deschide meniul de cuțite
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:hand" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!glove</span> - Deschide meniul de mănuși
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:crown" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!vip</span> - Deschide meniul VIP
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:message-square" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!tag</span> - Deschide meniul de tag-uri și culori chat
    </div>
  </div>

</div>

<!-- INFO BOX -->
<div class="wf-currency-box">
  <ul>
    <li>
      <Icon icon="lucide:info" :size="20" />
      <span>Phoenix Coins sunt <span class="wf-currency-highlight">non-transferabile</span> între conturi. Fiecare jucător își gestionează propriile coins.</span>
    </li>
    <li>
      <Icon icon="lucide:gift" :size="20" />
      <span>Poți cumpăra Phoenix Coins și cu bani reali din <span class="wf-currency-highlight">market-ul site-ului</span> la adresa <code>wildfire.ro/market</code>.</span>
    </li>
    <li>
      <Icon icon="lucide:clock" :size="20" />
      <span>Bonusul zilnic se resetează la ora <span class="wf-currency-highlight">00:00</span>. Nu uita să-l revendici în fiecare zi!</span>
    </li>
    <li>
      <Icon icon="lucide:alert-triangle" :size="20" />
      <span>Orice tentativă de <span class="wf-currency-highlight">exploatare a bug-urilor</span> pentru a obține coins va fi sancționată cu ban permanent.</span>
    </li>
  </ul>
</div>
