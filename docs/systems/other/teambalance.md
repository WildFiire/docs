---
outline: deep
---

<CaseHeader 
  title="Team Balance"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'gameplay', component: 'PageTagGreen' },
    { text: 'balance', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Team Balance']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="teambalance"
  badge-text="Team Balance"
  badge-icon="lucide:users"
/>

<div class="wf-system">

<!-- 1.0 IMPORTANȚA BALANȚEI -->
### <div style="display: none;">1.0 IMPORTANȚA BALANȚEI</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:scale" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 IMPORTANȚA BALANȚEI</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:scale" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Fair Play</span> <span class="wf-system-highlight">Sistemul de Team Balance</span>
    <p>Un meci echilibrat este esențial pentru distracția tuturor. Sistemul nostru de Team Balance monitorizează în permanență numărul de jucători și scorul, intervenind automat atunci când echipele devin inegale.</p>
    <p>Acest sistem previne situațiile în care o echipă are mult mai mulți jucători decât cealaltă sau situațiile în care scorul este exagerat de disproporționat.</p>
  </div>
</div>

<div class="wf-system-tip orange">
  <Icon icon="lucide:shield-check" width="22" height="22" color="#ff8c00" />
  <span>Sistemul încearcă întotdeauna să păstreze grupurile de prieteni împreună, dar echilibrul jocului are prioritate maximă.</span>
</div>

<!-- 2.0 CUM FUNCȚIONEAZĂ -->
### <div style="display: none;">2.0 CUM FUNCȚIONEAZĂ</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:settings" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM FUNCȚIONEAZĂ</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:users" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Intervențiile sistemului au loc în mai multe momente cheie:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:user-plus" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">La Conectare:</span> Jucătorii noi sunt direcționați automat către echipa cu mai puțini membri.</span></li>
      <li><Icon icon="lucide:refresh-cw" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Auto-Swap:</span> Dacă un jucător părăsește serverul și echipele devin inegale (ex: 5v3), sistemul va muta ultimul jucător conectat la echipa adversă la începutul următoarei runde.</span></li>
      <li><Icon icon="lucide:shuffle" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Scramble:</span> În cazuri extreme (scoruri de tip 10-0), se poate forța un „Scramble Teams” pentru a reface complet echipele.</span></li>
    </ul>
  </div>
</div>



<!-- 3.0 IMUNITATE ȘI EXCEPȚII -->
### <div style="display: none;">3.0 IMUNITATE ȘI EXCEPȚII</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:shield" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 IMUNITATE ȘI EXCEPȚII</span>
</div>



</div>
