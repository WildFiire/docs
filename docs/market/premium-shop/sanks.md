---
outline: deep
---

<CaseHeader 
  title="Sank Sounds"
  :tags="[
    { text: 'premium', component: 'PageTagPurple' },
    { text: 'sounds', component: 'PageTagOrange' },
    { text: 'sank', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Market', 'Premium Shop', 'Sank Sounds']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="sank-sounds"
  badge-text="Sank Sounds"
  badge-icon="lucide:music"
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
.cases-wf .cases-custom-list { list-style: none; padding-left: 0; }
.cases-wf .cases-custom-list li { margin: 10px 0; display: flex; align-items: flex-start; gap: 12px; font-size: 14px; }
.cases-wf .cases-custom-list svg { flex-shrink: 0; width: 18px; height: 18px; stroke: #ff8c00; margin-top: 2px; }
@media (max-width: 768px) { .cases-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; } .cases-wf .cases-icon { width: 32px; height: 32px; } }

/* GS TIP */
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
  width: 22px; height: 22px; flex-shrink: 0; color: #00c851; margin-top: 2px;
}
.cases-wf .gs-tip-text {
  font-size: 13px; line-height: 1.5; color: var(--cases-text); margin: 0; flex: 1;
}
html:not(.dark) .cases-wf .gs-tip {
  background: rgba(0,200,81,0.05); border-color: rgba(0,200,81,0.2);
}

/* GS TIP ORANGE */
.cases-wf .gs-tip.orange {
  background: rgba(255,140,0,0.08); border-color: rgba(255,140,0,0.25);
}
.cases-wf .gs-tip.orange:hover {
  background: rgba(255,140,0,0.12); border-color: rgba(255,140,0,0.4);
}
.cases-wf .gs-tip.orange .gs-tip-icon { color: #ff8c00; }

/* GS TIP RED */
.cases-wf .gs-tip.red {
  background: rgba(255,60,60,0.08); border-color: rgba(255,60,60,0.25);
}
.cases-wf .gs-tip.red:hover {
  background: rgba(255,60,60,0.12); border-color: rgba(255,60,60,0.4);
}
.cases-wf .gs-tip.red .gs-tip-icon { color: #ff4444; }
</style>

<!-- INTRO - DESCRIERE SANK SOUNDS & FEATURES -->
<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:music" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <span class="cases-number">VIP Feature</span> <span class="cases-highlight">Sank Sounds</span>
    <p><span class="cases-highlight">Sank Sounds</span> reprezintă o colecție de sunete speciale disponibile exclusiv pentru jucătorii <span class="cases-highlight">VIP</span>. Prin simpla tastare a unui text prestabilit în chat, vei declanșa un sunet pe care <span class="cases-highlight">îl vor auzi TOȚI jucătorii</span> din server. Este modalitatea perfectă de a-ți face prezența simțită și de a adăuga un plus de atmosferă meciului.</p>
    <p><span class="cases-highlight">Features:</span></p>
    <ul class="cases-custom-list">
      <li><Icon icon="lucide:crown" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Exclusiv VIP</span> — doar jucătorii cu rang VIP pot folosi Sank Sounds</span></li>
      <li><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Volum independent</span> — fiecare jucător își poate ajusta volumul Sank Sounds separat</span></li>
      <li><Icon icon="lucide:clock" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Cooldown system</span> — după un Sank, toți jucătorii trebuie să aștepte înainte de următorul</span></li>
      <li><Icon icon="lucide:calendar" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Sank of the Day</span> — cel mai popular sank (adica sound) din ziua respectiva</span></li>
      <li><Icon icon="lucide:sparkles" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">Sank Custom</span> — poți cumpăra un sunet personalizat cu orice text dorești</span></li>
    </ul>
  </div>
</div>

<div class="gs-tip">
  <svg class="gs-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="gs-tip-text">Sank Sounds sunt sisteme <span class="cases-highlight">premium exclusive VIP</span> care nu oferă niciun avantaj în joc, dar îți permit să interacționezi cu întregul server într-un mod distractiv.</p>
</div>

<!-- 1.0 COMANDA !sm -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 COMANDA !sm</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:command" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 COMANDA !sm</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:terminal" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Pentru a deschide meniul Sank Sounds, tastează <span class="cases-highlight">!sm</span> în chat.</p>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!sm</code> în chat pentru a deschide meniul de selecție și configurare a sunetelor.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/sank/sank_gif_1.gif" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!sm</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:command" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Tastează !sm în chat și meniul se deschide instant
      </div>
    </div>
    
  <div class="gs-tip">
      <Icon icon="lucide:volume-x" width="22" height="22" color="#00c851" />
      <span><span class="cases-highlight">!sounds</span> — poți folosi această comandă pentru a activa sau dezactiva toate Sank Sounds instant.</span>
    </div>
  </div>
</div>

<!-- 2.0 PREVIEW SANK SOUNDS -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 PREVIEW SANK SOUNDS</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:eye" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 PREVIEW SANK SOUNDS</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:headphones" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Poti selecta orice sank doresti din meniul <code>!sm</code>.</p>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>De asemenea poti scrie sunetul si in chat, nu este nevoie sa il pui mereu din meniu.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <video width="100%" controls style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <source src="/videos/preview_sank.mp4" type="video/mp4">
        </video>
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">preview sank</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:play" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Activeaza sunete direct din meniul nostru.
      </div>
    </div>
    
  </div>
</div>

<!-- 3.0 SOUND OF THE DAY & RECENTLY PLAYED -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 SOUND OF THE DAY & RECENTLY PLAYED</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:calendar" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 SOUND OF THE DAY & RECENTLY PLAYED</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:flame" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>În meniul <span class="cases-highlight">!sm</span> vei găsi două secțiuni speciale care te ajută să descoperi cele mai populare sunete și pe cele folosite recent.</p>
    
 <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/sank/sank_of_the_day.png" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">sound of the day</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:flame" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Cel mai folosit sunet în ultimele 24 de ore
      </div>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/sank/recently_used.png" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">recently played</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:clock" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Ultimele sunete folosite de tine
      </div>
    </div>
    
  <div class="gs-tip">
      <Icon icon="lucide:trending-up" width="22" height="22" color="#00c851" />
      <span><span class="cases-highlight">Sank of the Day</span> se actualizează zilnic și îți arată ce este popular în comunitate.</span>
    </div>
  </div>
</div>

<!-- 4.0 EXCLUSIVITATE VIP -->
<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">4.0 EXCLUSIVITATE VIP</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:crown" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 EXCLUSIVITATE VIP</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:crown" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Sistemul <span class="cases-highlight">Sank Sounds</span> este disponibil exclusiv pentru jucătorii cu statut <span class="cases-highlight">VIP</span>. Doar ei pot scrie comenzi în chat pentru a declanșa sunete.</p>
    
   <div class="gs-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Ai nevoie de rang <span class="cases-highlight">VIP</span> pentru a putea folosi orice comandă Sank în chat.</span>
    </div>
    
   <div class="gs-tip">
      <Icon icon="lucide:gem" width="22" height="22" color="#00c851" />
      <span>Pentru a deveni <span class="cases-highlight">VIP</span> și a avea acces la Sank Sounds, accesează secțiunea VIP de pe docs.</span>
    </div>
  </div>
</div>

<!-- INFO BOX FINAL -->
<div class="cases-info-box">
  <ul>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Notă:</span> Poți activa sau dezactiva auzirea Sank Sounds oricând folosind comanda <code>!sounds</code>. Toate sunetele achiziționate rămân în colecția ta permanent.</span></li>
    <li><Icon icon="lucide:crown" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">VIP Required:</span> Doar jucătorii cu rang VIP pot folosi această funcționalitate.</span></li>
    <li><Icon icon="lucide:clock" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Cooldown:</span> Respectă timpul de așteptare dintre Sank-uri pentru a menține o atmosferă plăcută în server.</span></li>
    <li><Icon icon="lucide:message-circle" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Sfat:</span> Folosește Sank Sounds cu moderație și în momente potrivite pentru a crea momente memorabile alături de comunitate!</span></li>
  </ul>
</div>

</div>
