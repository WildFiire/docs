---
outline: deep
---

<CaseHeader 
  title="Credits"
  :tags="[
    { text: 'shop', component: 'PageTagRed' },
    { text: 'economie', component: 'PageTagBlue' },
    { text: 'ingame', component: 'PageTagGreen' },
    { text: 'market', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Currency', 'Credits']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="credits"
  badge-text="Credits"
  badge-icon="lucide:wallet"
/>

<!-- INTRO CREDITS CARD -->
<div class="wf-currency-card" style="margin-bottom: 25px;">
  <div class="wf-currency-icon">
    <Icon icon="lucide:wallet" :size="16" />
  </div>
  <div class="wf-currency-content">
    <span class="wf-currency-number">CREDITS</span> <span class="wf-currency-highlight">Moneda Shop-ului In-Game</span>
    <p>Creditele reprezintă moneda principală utilizată în sistemul <code>!shop</code> de pe serverele Wildfire. Acestea permit jucătorilor să-și personalizeze experiența vizuală și să iasă în evidență prin tag-uri, culori și efecte unice.</p>
    <div class="wf-currency-features">
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Tag-uri Chat
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Culori Mesaje
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Efecte Trail
      </span>
      <span class="wf-currency-feature">
        <Icon icon="lucide:check" :size="12" />
        Personalizare Nume
      </span>
    </div>
  </div>
</div>

<!-- 1.0 CUM OBȚII CREDITE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(0,200,81,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #00c851, #007e33, #004d40); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:trending-up" :size="30" color="#00c851" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />1.0 CUM OBȚII CREDITE</span>
</div>

<div class="wf-currency-grid">

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:clock" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Timp pe server</span> Primești credite automat pentru timpul petrecut pe server:
      <div style="display: flex; gap: 15px; flex-wrap: wrap; margin: 10px 0 0 0;">
        <div><span class="wf-currency-coin-badge" style="background: rgba(0,200,81,0.1); border-color: rgba(0,200,81,0.3); color: #00c851;">+10 credite / minut</span></div>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:target" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Activitate în meci</span> Bonusuri pentru performanța ta:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Kill: +5 credite</span>
        <span class="wf-currency-feature">Headshot: +8 credite</span>
        <span class="wf-currency-feature">Bomb Plant/Defuse: +20 credite</span>
        <span class="wf-currency-feature">MVP: +15 credite</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:shopping-bag" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Pachete Credite</span> Poți achiziționa pachete mari de credite direct de pe site:
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
        <span class="wf-currency-coin-badge" style="background: rgba(0,200,81,0.1); border-color: rgba(0,200,81,0.3); color: #00c851;">Starter: 50.000 credite</span>
        <span class="wf-currency-coin-badge" style="background: rgba(0,200,81,0.1); border-color: rgba(0,200,81,0.3); color: #00c851;">Pro: 150.000 credite</span>
        <span class="wf-currency-coin-badge" style="background: rgba(0,200,81,0.1); border-color: rgba(0,200,81,0.3); color: #00c851;">Elite: 500.000 credite</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:crown" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">VIP Bonus</span> Jucătorii VIP primesc un multiplicator de credite:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">VIP Rebirth: 1.5x</span>
        <span class="wf-currency-feature">VIP Immortal: 2.0x</span>
        <span class="wf-currency-feature">VIP Mythic: 3.0x</span>
      </div>
    </div>
  </div>

</div>

<div class="wf-currency-divider"></div>

<!-- 2.0 CE POȚI CUMPĂRA -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(0,200,81,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #00c851, #007e33, #004d40); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:shopping-cart" :size="30" color="#00c851" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />2.0 CE POȚI CUMPĂRA CU CREDITE</span>
</div>

<div class="wf-currency-grid">

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:tag" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Chat Tags</span> Personalizează-ți tag-ul din chat:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Tag-uri Predefinite: 5.000 credite</span>
        <span class="wf-currency-feature">Tag Custom (!settag): 25.000 credite</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:palette" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Culori Chat & Nume</span> Ieși în evidență prin culori:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Culoare Nume: 10.000 credite</span>
        <span class="wf-currency-feature">Culoare Mesaj: 10.000 credite</span>
        <span class="wf-currency-feature">Culoare Tag: 7.500 credite</span>
      </div>
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:sparkles" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">Efecte Vizuale</span> Trail-uri și efecte speciale:
      <div class="wf-currency-features" style="margin-top: 10px;">
        <span class="wf-currency-feature">Trails: 15.000 - 50.000 credite</span>
        <span class="wf-currency-feature">Efecte Hit: 20.000 credite</span>
      </div>
    </div>
  </div>

</div>

<div class="wf-currency-divider"></div>

<!-- 3.0 COMENZI UTILE -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(0,200,81,0.3); transition: transform 0.3s ease;" class="wf-currency-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #00c851, #007e33, #004d40); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-currency-font"><Icon icon="lucide:terminal" :size="30" color="#00c851" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);" />3.0 COMENZI UTILE</span>
</div>

<div class="wf-currency-grid">

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:shopping-bag" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!shop</span> - Deschide meniul principal al magazinului
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:wallet" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!credits</span> - Verifică soldul tău de credite
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:send" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!settag [text]</span> - Setează un tag personalizat (necesită achiziție)
    </div>
  </div>

  <div class="wf-currency-card">
    <div class="wf-currency-icon">
      <Icon icon="lucide:hand-metal" :size="16" />
    </div>
    <div class="wf-currency-content">
      <span class="wf-currency-number">!transfer [nume] [sumă]</span> - Transferă credite unui alt jucător
    </div>
  </div>

</div>

<!-- INFO BOX -->
<div class="wf-currency-box" style="border-left-color: #00c851;">
  <ul>
    <li>
      <Icon icon="lucide:info" :size="20" style="color: #00c851;" />
      <span>Creditele sunt <span class="wf-currency-highlight" style="color: #00c851;">transferabile</span> între jucători. Folosește comanda <code>!transfer</code> cu grijă.</span>
    </li>
    <li>
      <Icon icon="lucide:gem" :size="20" style="color: #00c851;" />
      <span>Spre deosebire de Phoenix Coins, creditele sunt câștigate în principal prin <span class="wf-currency-highlight" style="color: #00c851;">activitatea pe server</span>.</span>
    </li>
    <li>
      <Icon icon="lucide:shopping-cart" :size="20" style="color: #00c851;" />
      <span>Poți cumpăra pachete de credite din <span class="wf-currency-highlight" style="color: #00c851;">Market-ul site-ului</span> pentru a debloca rapid personalizările dorite.</span>
    </li>
    <li>
      <Icon icon="lucide:alert-triangle" :size="20" style="color: #00c851;" />
      <span>Abuzul de sisteme pentru a face "farm" de credite (AFK Bypass, etc.) se sancționează cu <span class="wf-currency-highlight" style="color: #00c851;">resetarea soldului</span>.</span>
    </li>
  </ul>
</div>