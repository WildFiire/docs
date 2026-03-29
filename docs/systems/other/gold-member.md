---
outline: deep
---


<CaseHeader 
  title="Gold Member"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'gold', component: 'PageTagYellow' },
    { text: 'premium', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Gold Member']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  updated-by-username="iannc69"
  page-id="gold-member"
  badge-text="Gold Member"
  badge-icon="lucide:crown"
/>

<div class="goldmember-wf">

<style>
.goldmember-wf {
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
html:not(.dark) .goldmember-wf {
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
.goldmember-wf .cases-orbitron { font-family: 'Orbitron', sans-serif !important; letter-spacing: 0.3px; }
.goldmember-wf .cases-card { background: var(--cases-card-bg); border: 1px solid var(--cases-card-border); padding: 20px; border-radius: 18px; transition: all 0.2s ease; line-height: 1.6; color: var(--cases-text); display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
.goldmember-wf .cases-card:hover { border-color: rgba(255,140,0,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.goldmember-wf .cases-icon { flex-shrink: 0; width: 36px; height: 36px; background: rgba(255,140,0,0.08); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,140,0,0.15); transition: all 0.2s ease; }
.goldmember-wf .cases-card:hover .cases-icon { background: rgba(255,140,0,0.12); border-color: rgba(255,140,0,0.3); }
.goldmember-wf .cases-content { flex: 1; width: 100%; }
.goldmember-wf .cases-content p { margin: 8px 0; font-size: 14px; line-height: 1.65; }
.goldmember-wf .cases-highlight { color: var(--cases-highlight); font-weight: 600; font-family: 'Orbitron', sans-serif; }
.goldmember-wf .cases-info-box { margin-top: 40px; background: var(--cases-info-bg); border: 1px solid var(--cases-info-border); border-radius: 18px; padding: 24px; line-height: 1.7; color: var(--cases-text); }
.goldmember-wf .cases-info-box ul { list-style-type: none; padding-left: 0; margin: 0; }
.goldmember-wf .cases-info-box li { margin-bottom: 16px; display: flex; align-items: flex-start; gap: 14px; font-size: 14px; }
.goldmember-wf .cases-info-box li svg { flex-shrink: 0; width: 20px; height: 20px; stroke: var(--cases-highlight); fill: none; margin-top: 2px; }
.goldmember-wf .cases-number { display: inline-block; background: var(--cases-number-bg); color: var(--cases-highlight); font-weight: 600; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-right: 10px; margin-bottom: 6px; border: 1px solid var(--cases-number-border); font-family: 'Orbitron', sans-serif; }
.goldmember-wf .cases-title-hover { transition: transform 0.2s ease; text-align: left; }
.goldmember-wf .cases-title-hover:hover { transform: translateX(5px); }
.goldmember-wf .cases-key-row { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
.goldmember-wf .cases-key-item { display: inline-flex; align-items: center; gap: 12px; padding: 6px 0; transition: all 0.2s ease; }
.goldmember-wf .cases-key-item:hover { transform: translateX(3px); }
.goldmember-wf .cases-key-button { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #2a2a2a, #1a1a1a); border: 2px solid #ff8c00; color: #ff8c00; font-family: 'Orbitron', monospace; font-weight: 800; font-size: 18px; width: 52px; height: 52px; border-radius: 14px; box-shadow: 0 3px 0 rgba(0,0,0,0.3); transition: all 0.1s ease; }
.goldmember-wf .cases-key-button:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(0,0,0,0.3); }
.goldmember-wf .cases-key-button.shift-btn { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; width: 60px; }
html:not(.dark) .goldmember-wf .cases-key-button { background: linear-gradient(145deg, #e8e8e8, #d8d8d8); }
.goldmember-wf .cases-custom-list { list-style: none; padding-left: 0; }
.goldmember-wf .cases-custom-list li { margin: 10px 0; display: flex; align-items: flex-start; gap: 12px; font-size: 14px; }
.goldmember-wf .cases-custom-list svg { flex-shrink: 0; width: 18px; height: 18px; stroke: #ff8c00; margin-top: 2px; }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@media (max-width: 768px) { .goldmember-wf .cases-card { padding: 16px; flex-direction: column; gap: 12px; } .goldmember-wf .cases-icon { width: 32px; height: 32px; } .goldmember-wf .cases-key-button { width: 40px; height: 40px; font-size: 14px; } .goldmember-wf .cases-key-button.shift-btn { width: 48px; font-size: 9px; } .gv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

/* GS TIP - Green Info Box */
.goldmember-wf .gs-tip {
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
.goldmember-wf .gs-tip:hover {
  background: rgba(0,200,81,0.12);
  border-color: rgba(0,200,81,0.4);
  transform: translateX(4px);
}
.goldmember-wf .gs-tip-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #00c851;
  margin-top: 2px;
}
.goldmember-wf .gs-tip-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--cases-text);
  margin: 0;
  flex: 1;
}
html:not(.dark) .goldmember-wf .gs-tip {
  background: rgba(0,200,81,0.05);
  border-color: rgba(0,200,81,0.2);
}
html:not(.dark) .goldmember-wf .gs-tip-text {
  color: #2c3e2f;
}

/* GS TIP ORANGE - For warnings */
.goldmember-wf .gs-tip.orange {
  background: rgba(255,140,0,0.08);
  border-color: rgba(255,140,0,0.25);
}
.goldmember-wf .gs-tip.orange:hover {
  background: rgba(255,140,0,0.12);
  border-color: rgba(255,140,0,0.4);
}
.goldmember-wf .gs-tip.orange .gs-tip-icon {
  color: #ff8c00;
}

/* STYLE PENTRU CARDURILE GOLD MEMBER */
.gv-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 20px; }
@media (max-width: 560px) { .gv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.gv-card { background: rgba(20,18,16,0.85); border: 1px solid rgba(255,140,0,0.12); border-radius: 10px; overflow: hidden; cursor: pointer; transition: border-color 0.22s, transform 0.22s; position: relative; }
.gv-card:hover { border-color: rgba(255,140,0,0.55); transform: translateY(-3px); }
.gv-card:hover .gv-name { color: #ff8c00; }
.gv-img-wrap { position: relative; background: rgba(255,140,0,0.04); padding: 18px 16px 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.gv-img-wrap img { width: 100%; max-width: 120px; height: 72px; object-fit: contain; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6)); position: relative; z-index: 1; animation: floatGlove 3s ease-in-out infinite; transition: transform 0.25s ease; }
.gv-card:hover .gv-img-wrap img { animation: none; transform: scale(1.08); }
@keyframes floatGlove { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
.gv-info { padding: 10px 12px 14px; border-top: 1px solid rgba(255,140,0,0.08); transition: all 0.2s ease; }
.gv-name { font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700; color: #e8e5e0; margin: 0 0 4px; letter-spacing: 0.3px; transition: color 0.2s; }
.gv-desc { font-size: 11px; color: rgba(200,195,188,0.55); margin: 0; line-height: 1.45; }
.gv-corner { position: absolute; top: 8px; right: 8px; width: 5px; height: 5px; border-top: 1.5px solid rgba(255,140,0,0.4); border-right: 1.5px solid rgba(255,140,0,0.4); }
html:not(.dark) .gv-card { background: rgba(245,245,250,0.95); border-color: rgba(255,140,0,0.2); box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
html:not(.dark) .gv-card:hover { border-color: rgba(255,140,0,0.5); box-shadow: 0 6px 14px rgba(0,0,0,0.08); transform: translateY(-3px); }
html:not(.dark) .gv-img-wrap { background: rgba(255,140,0,0.02); }
html:not(.dark) .gv-name { color: #2c2c2c; }
html:not(.dark) .gv-card:hover .gv-name { color: #ff8c00; }
html:not(.dark) .gv-desc { color: rgba(80,80,90,0.7); }
html:not(.dark) .gv-corner { border-top-color: rgba(255,140,0,0.5); border-right-color: rgba(255,140,0,0.5); }
html:not(.dark) .gv-info { border-top-color: rgba(255,140,0,0.12); }
</style>

<!-- 1.0 INFORMAȚII -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">1.0 INFORMAȚII</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:info" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMAȚII</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:crown" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <span class="cases-number">Premium Status</span> <span class="cases-highlight">Gold Member</span>
    <p>Gold Member este un statut premium pe serverul Wildfire.ro care oferă beneficii exclusive jucătorilor. Pentru a activa acest statut, trebuie să îți setezi numele în joc astfel: <span class="cases-highlight">cs2.wildfire.ro</span> sau <span class="cases-highlight">wildfire.ro</span> în nume.</p>
    <p>Odată ce ai numele corect configurat, primești automat acces la arme speciale, recompense zilnice și avantaje unice în joc.</p>
  </div>
</div>

<div class="gs-tip">
  <Icon icon="lucide:info" width="22" height="22" color="#00c851" />
  <p class="gs-tip-text">Pentru a deveni <span class="cases-highlight">Gold Member</span>, adaugă <span class="cases-highlight">cs2.wildfire.ro</span> sau <span class="cases-highlight">wildfire.ro</span> în numele tău din CS2. Statutul se activează automat după verificare.</p>
</div>

<!-- 2.0 BENEFICII GOLD MEMBER -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">2.0 BENEFICII GOLD MEMBER</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 BENEFICII GOLD MEMBER</span>
</div>

<!-- Grid Beneficii -->
<div class="gv-grid">
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="/utility/wf_clantag.png" alt="Tag GOLDMEMBER"></div><div class="gv-info"><p class="gv-name">[GOLDMEMBER]</p><p class="gv-desc">Tag exclusiv în chat și scoreboard</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="/utility/wf_zeus.webp" alt="Zeus"></div><div class="gv-info"><p class="gv-name">Zeus</p><p class="gv-desc">Armă tazer disponibilă în fiecare rundă</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="/utility/wf_money.png" alt="+1000$ per round"></div><div class="gv-info"><p class="gv-name">+1000$ per rundă</p><p class="gv-desc">Bonus de bani la începutul fiecărei runde</p></div></div>
  <div class="gv-card"><div class="gv-corner"></div><div class="gv-img-wrap"><img src="/utility/wf_healthshot.webp" alt="Healthshot"></div><div class="gv-info"><p class="gv-name">Healthshot</p><p class="gv-desc">Seringă de vindecare disponibilă în fiecare rundă</p></div></div>
</div>

<div class="gs-tip orange">
  <Icon icon="lucide:lightbulb" width="22" height="22" color="#ff8c00" />
  <span>Beneficiile sunt aplicate automat odată ce statutul Gold Member este activ. Nu este necesară nicio comandă suplimentară pentru a le activa.</span>
</div>


<!-- 3.0 CUM OBȚII STATUTUL -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="cases-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="display: none;">3.0 CUM OBȚII STATUTUL</span>
  <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="cases-orbitron"><Icon icon="lucide:settings" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 CUM OBȚII STATUTUL</span>
</div>

<div class="cases-card">
  <div class="cases-icon"><Icon icon="lucide:edit-3" width="18" height="18" color="#ff8c00" /></div>
  <div class="cases-content">
    <p>Pentru a deveni Gold Member, urmează acești pași simpli:</p>
    
  <ul class="cases-custom-list">
      <li><Icon icon="lucide:gamepad-directional" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">1. Deschide aplicația Steam</span> — mergi la profilul tău</span></li>
      <li><Icon icon="lucide:user" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">2. Editează-ți numele</span> — apasă pe „Edit Profile” și adaugă <code>cs2.wildfire.ro</code> sau <code>wildfire.ro</code> la sfârșitul numelui tău</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="cases-highlight">3. Intră pe server</span> — odată conectat, beneficiile Gold Member sunt aplicate automat</span></li>
    </ul>
    
<div style="margin: 20px 0; display: flex; flex-direction: column; gap: 24px; justify-content: center; align-items: center;">
  <div style="position: relative; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
      <img src="/utility/wf_name_steam.png" alt="Editare profil Steam" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
      <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">edit profile</div>
    </div>
    <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
      <Icon icon="lucide:edit-3" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
      Apasă pe <span class="cases-highlight">Edit Profile</span> pentru a-ți modifica numele
    </div>
  </div>
  
  <div style="position: relative; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
      <img src="/utility/wf_name_steam2.png" alt="Adăugare cs2.wildfire.ro în nume" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
      <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">add wildfire.ro</div>
    </div>
    <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
      <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
      Adaugă <span class="cases-highlight">cs2.wildfire.ro</span> sau <span class="cases-highlight">wildfire.ro</span> la sfârșitul numelui si dupa apasa pe <span style="color: #ff8c00;"><Icon icon="lucide:save" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />Save</span>
    </div>
  </div>
</div>
    
  <div class="gs-tip orange">
      <Icon icon="lucide:alert-circle" width="22" height="22" color="#ff8c00" />
      <span>Statutul Gold Member este <span class="cases-highlight">automat</span> cât timp ai numele corect configurat în Steam. Dacă îți schimbi numele și elimini cs2.wildfire.ro, pierzi imediat beneficiile.</span>
    </div>
  </div>
</div>

<div class="cases-info-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="cases-highlight">Important!</span> Beneficiile Gold Member sunt active doar pe serverele Wildfire.ro. Asigură-te că ai numele corect configurat pentru a păstra statutul. Poți verifica oricând cu comanda <code>!goldstatus</code>.</span></li>
  </ul>
</div>
</div>
