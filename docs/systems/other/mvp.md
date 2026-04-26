---
outline: deep
---

<CaseHeader 
  title="MVP Anthem"
  :tags="[
    { text: 'mvp', component: 'PageTagPurple' },
    { text: 'anthem', component: 'PageTagGreen' },
    { text: 'premium', component: 'PageTagBlue' },
    { text: 'custom', component: 'PageTagOrange' }
  ]"
  :path="['Home', 'Market', 'Systems', 'MVP Anthem']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="mvp-anthem"
  badge-text="MVP Anthem"
  badge-icon="lucide:star"
/>


<div class="wf-system">

<!-- INTRO - DESCRIERE MVP & FEATURES -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:star" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Premium Feature</span> <span class="wf-system-highlight">MVP Anthem</span>
    <p>MVP-urile (Most Valuable Player) sunt animații speciale care apar la sfârșitul rundei pentru jucătorul care a avut cea mai bună performanță. Sistemul <span class="wf-system-highlight"> MVP Anthem</span> îți permite să personalizezi această animație cu efecte vizuale și sunete unice.</p>
    <p><span class="wf-system-highlight">Features:</span></p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Change Volume</span> — ajustează volumul fiecărui MVP independent</span></li>
      <li><Icon icon="lucide:shuffle" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Random MVP</span> — activează modul aleatoriu pentru varietate maximă</span></li>
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Preview</span> — testează orice MVP înainte de a-l selecta</span></li>
      <li><Icon icon="lucide:mouse-pointer-click" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Select MVP</span> — schimbă oricând MVP-ul activ din meniul <code>!mvp</code></span></li>
    </ul>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">MVP-urile sunt iteme <span class="wf-system-highlight">cosmetice premium</span> care nu oferă niciun avantaj în joc, dar îți permit să te remarci în fața celorlalți jucători la finalul rundei.</p>
</div>

### 1.0 Cum Îți Pui Un MVP

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 Cum Îți Pui Un MVP</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Procesul de echipare a unui MVP este simplu și intuitiv:</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!mvp</code> în chat pentru a deschide meniul de selecție a MVP-urilor.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_1.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">select mvp</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Apasă <span class="wf-system-highlight">E</span> pentru a selecta MVP-ul dorit
      </div>
    </div>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odată selectat, MVP-ul este <span class="wf-system-highlight">vizibil instant</span> la sfârșitul rundei. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

### 2.0 Preview MVP

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:eye" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 Preview MVP</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Înainte de a cumpăra un MVP, poți testa cum arată și cum sună folosind funcția <span class="wf-system-highlight">Preview</span> din meniul <code>!mvp</code>.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_2.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">preview mvp</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:play" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Testează orice MVP înainte de al selecta.
      </div>
    </div>
    
 <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Folosește opțiunea <span class="wf-system-highlight">Preview</span> pentru a vedea animația completă și a auzi sunetul înainte de a decide să cumperi.</span>
    </div>
  </div>
</div>

### 3.0 Change Volume

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:volume-2" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 Change Volume</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Fiecare MVP are un sunet asociat. Poți ajusta volumul independent de celelalte sunete din joc.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_3.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">change volume</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:sliders" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Ajustează volumul folosind tastele <span class="wf-system-highlight">SHIFT, F si E</span>
      </div>
    </div>
  </div>
</div>

### 4.0 Random MVP

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:shuffle" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 Random MVP</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:shuffle" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Dacă ai mai multe MVP-uri în colecție și nu te poți decide pe care să-l folosești, poți activa funcția <span class="wf-system-highlight">Random MVP</span>.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>În meniul <code>!mvp</code>, selectează opțiunea <span class="wf-system-highlight">Random MVP</span> pentru a activa modul aleatoriu.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/random.png" alt="Random MVP" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">random mvp</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:shuffle" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Activează Random MVP pentru a primi un MVP diferit la fiecare rundă
      </div>
    </div>
    
   <p>Când modul <span class="wf-system-highlight">Random MVP</span> este activat, la fiecare sfârșit de rundă în care ești MVP, sistemul va selecta aleatoriu unul dintre MVP-urile pe care le deții.</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span>Fiecare rundă poate avea un MVP diferit</span></li>
      <li><Icon icon="lucide:heart" width="18" height="18" color="#ff8c00" /><span>Păstrează surpriza și varietatea în joc</span></li>
      <li><Icon icon="lucide:x-circle" width="18" height="18" color="#ff8c00" /><span>Poți dezactiva oricând funcția și reveni la un MVP preferat</span></li>
    </ul>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Modul <span class="wf-system-highlight">Random MVP</span> este perfect pentru cei care au o colecție mare de MVP-uri și vor să le audă pe toate în acțiune!</span>
    </div>
  </div>
</div>

### 5.0 MVP Pe Site

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:monitor" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />5.0 MVP Pe Site</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:monitor" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Toate MVP-urile tale pot fi gestionate și din contul tău de pe <span class="wf-system-highlight">site-ul oficial</span>. Accesează <code>wildfire.ro/skins-market</code> și autentifică-te cu Steam pentru a accesa secțiunea <span class="wf-system-highlight">MVP</span>.</p>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/mvp_4.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site mvp manager</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:monitor" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Gestionează-ți MVP-urile direct din browser
      </div>
    </div>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:eye" width="22" height="22" color="#00c851" />
      <span>Pe site poți:</span>
    </div>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Preview MVP</span> — vezi animația completă direct în browser</span></li>
      <li><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Change Volume</span> — ajustează volumul din interfața web</span></li>
      <li><Icon icon="lucide:shuffle" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Random MVP</span> — activează modul aleatoriu</span></li>
    </ul>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:sparkles" width="22" height="22" color="#ff8c00" />
      <span><span class="wf-system-highlight">MVP-uri Custom</span> — poți cumpăra un MVP personalizat contra cost.</span>
    </div>

  </div>
</div>

<!-- INFO BOX FINAL -->
<div class="wf-system-box">
  <ul>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Notă:</span> Poți schimba MVP-ul oricând din meniul <code>!mvp</code>. Toate MVP-urile achiziționate rămân în inventarul tău permanent.</span></li>
  </ul>
</div>

</div>