---
outline: deep
---

<CaseHeader 
  title="Chat & Tag-uri"
  :tags="[
    { text: 'shop', component: 'PageTagRed' },
    { text: 'chat', component: 'PageTagGreen' },
    { text: 'tags', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Shop', 'Chat & Tag-uri']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="shop-chat-tags"
  badge-text="Chat & Tag-uri"
  badge-icon="lucide:message-circle"
/>

<div class="wf-system">

<!-- INTRO -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Shop</span> <span class="wf-system-highlight">Chat & Tag-uri</span>
    <p>Pe server avem un sistem foarte bine gândit de <span class="wf-system-highlight">!shop</span> unde jucătorii își pot cumpăra diverse lucruri, printre care și <span class="wf-system-highlight">tag-uri</span>. Aceste tag-uri sunt afișate în chat înaintea numelui jucătorului.</p>
    <p>Totul începe cu comanda <code>!shop</code> — aceasta deschide meniul principal din care poți naviga către toate categoriile disponibile.</p>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop1.gif" alt="!shop menu" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!shop</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Meniul principal !shop</div>
  </div>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Toate opțiunile din shop pot fi achiziționate cu <span class="wf-system-highlight">credite</span> câștigate pe server. Scrie <code>!shop</code> în chat pentru a deschide meniul.</p>
</div>

### 1.0 CE VARIANTE AI?

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:list" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 CE VARIANTE AI?</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:list" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content"> <span class="wf-system-highlight">Categorii disponibile în shop:</span>
<ul class="wf-system-custom-list">
  <li><Icon icon="lucide:palette" width="18" height="18" color="#ff8c00" /> <span class="wf-system-highlight">Chat Colors</span> — schimbă culoarea mesajelor tale din chat</li>
  <li><Icon icon="lucide:tag" width="18" height="18" color="#ff8c00" /> <span class="wf-system-highlight">Chat Tags</span> — adaugă un tag vizibil înaintea numelui tău</li>
  <li><Icon icon="lucide:user" width="18" height="18" color="#ff8c00" /> <span class="wf-system-highlight">Name Colors</span> — schimbă culoarea numelui tău din chat</li>
  <li><Icon icon="lucide:bookmark" width="18" height="18" color="#ff8c00" /> <span class="wf-system-highlight">Tag Colors</span> — schimbă culoarea tag-ului tău din chat</li>
</ul>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop2.gif" alt="shop categories" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">categorii</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Categoriile disponibile în shop</div>
  </div>
  </div>
</div>

### 2.0 CHAT COLORS

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:palette" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CHAT COLORS</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:palette" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content"> <span class="wf-system-highlight">Chat Colors — Culori pentru mesaje</span>
    <p>Cu opțiunea <span class="wf-system-highlight">Chat Colors</span> îți poți personaliza culoarea mesajelor tale din chat. Fiecare culoare disponibilă poate fi previzualizată direct în meniul shop, astfel încât să știi exact cum vor arăta mesajele tale înainte de achiziție.</p>
    <p>Odată achiziționată, culoarea se aplică automat pe toate mesajele pe care le trimiți în chat. Poți schimba oricând culoarea accesând din nou meniul <code>!shop</code>.</p>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop3.gif" alt="chat colors preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">chat colors</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Previzualizare Chat Colors</div>
  </div>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop4.gif" alt="chat colors demo" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">demo</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Demonstrație Chat Colors în acțiune</div>
  </div>
  </div>
</div>

### 3.0 CHAT TAGS

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:tag" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 CHAT TAGS</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:tag" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content"> <span class="wf-system-highlight">Chat Tags — Tag-uri pentru chat</span>
    <p>Cu opțiunea <span class="wf-system-highlight">Chat Tags</span> îți poți adăuga un tag personalizat care apare înaintea numelui tău în chat. Tag-urile sunt vizibile pentru toți jucătorii și oferă un mod unic de a te diferenția.</p>
    <p>Tag-urile sunt afișate doar în <span class="wf-system-highlight">chat</span>. Poți alege dintr-o varietate de tag-uri predefinite sau poți crea unul custom cu comanda <code>!settag</code>.</p>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop5.gif" alt="chat tags preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">chat tags</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Previzualizare Chat Tags</div>
  </div>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop6.gif" alt="chat tags demo" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">demo</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Demonstrație Chat Tags în acțiune</div>
  </div>
  </div>
</div>

### 4.0 NAME COLORS

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:user" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 NAME COLORS</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:user" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content"> <span class="wf-system-highlight">Name Colors — Culori pentru nume</span>
    <p>Cu opțiunea <span class="wf-system-highlight">Name Colors</span> îți poți personaliza culoarea numelui tău din chat. Numele tău va apărea în culoarea aleasă de fiecare dată când scrii un mesaj, făcându-te ușor de recunoscut.</p>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop7.gif" alt="name colors preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">name colors</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Previzualizare Name Colors</div>
  </div>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop8.gif" alt="name colors demo" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">demo</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Demonstrație Name Colors în acțiune</div>
  </div>
  </div>
</div>

### 5.0 TAG COLORS

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:bookmark" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />5.0 TAG COLORS</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:bookmark" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content"> <span class="wf-system-highlight">Tag Colors — Culori pentru tag-uri</span>
    <p>Cu opțiunea <span class="wf-system-highlight">Tag Colors</span> îți poți schimba culoarea tag-ului tău din chat. Dacă ai deja un tag activ, această opțiune îți permite să îl personalizezi și mai mult prin alegerea unei culori unice.</p>
    <p>Culorile pentru tag-uri sunt afișate în <span class="wf-system-highlight">chat</span>, oferindu-ți un look complet personalizat.</p>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop9.gif" alt="tag colors preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">tag colors</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Previzualizare Tag Colors</div>
  </div>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="/shop/shop10.gif" alt="tag colors demo" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">demo</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">Demonstrație Tag Colors în acțiune</div>
  </div>
  </div>
</div>

### 6.0 OPTIUNI CUSTOM

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:settings" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />6.0 OPȚIUNI CUSTOM</span>
</div>

<div class="wf-system-tip orange">
  <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
  <span>Așa cum ați văzut și în gif-urile atașate, în marea majoritate a cazurilor, opțiunile sunt aceleași — dar vă puteți adăuga și <span class="wf-system-highlight">custom color / tag / name color / tag color</span>.</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:terminal" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content"> <span class="wf-system-highlight">Comenzi disponibile:</span>
<ul class="wf-system-custom-list">
  <li><Icon icon="lucide:chevron-right" width="18" height="18" color="#ff8c00" /> <code>!settag</code> — setează un tag custom personalizat</li>
</ul>
    <p style="margin-top: 12px; opacity: 0.7; font-style: italic;"><Icon icon="lucide:clock" width="14" height="14" color="#ff8c00" /> Mai multe comenzi custom vor fi adăugate în curând (TBD).</p>
  </div>
</div>

### 7.0 CUM SE FOLOSESC?

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:help-circle" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />7.0 CUM SE FOLOSESC?</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:palette" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">1</span> <span class="wf-system-highlight">Chat Colors</span>
    <p>Se folosesc în chat după numele jucătorului — culoarea mesajelor tale va fi schimbată.</p>
  </div>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:tag" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">2</span> <span class="wf-system-highlight">Chat Tags</span>
    <p>Se folosesc în chat înaintea numelui jucătorului. Tag-urile sunt afișate doar în chat.</p>
  </div>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:user" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">3</span> <span class="wf-system-highlight">Name Colors</span>
    <p>Se folosesc în chat afișând culoarea numelui jucătorului. Numele tău va apărea colorat de fiecare dată când scrii în chat.</p>
  </div>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:bookmark" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">4</span> <span class="wf-system-highlight">Tag Colors</span>
    <p>Se folosesc în chat înaintea numelui jucătorului, schimbând culoarea tag-ului.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Toate personalizările pot fi combinate — poți avea simultan un <span class="wf-system-highlight">tag colorat</span>, un <span class="wf-system-highlight">nume colorat</span> și <span class="wf-system-highlight">mesaje colorate</span> pentru un look complet unic!</p>
</div>

</div>
