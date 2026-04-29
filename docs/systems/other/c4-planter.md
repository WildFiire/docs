---
outline: deep
---

<CaseHeader 
  title="C4 Planter Info"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'utility', component: 'PageTagBlue' },
    { text: 'ui', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems', 'Other', 'C4 Planter Info']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="c4-planter"
  badge-text="C4 Info"
  badge-icon="lucide:bomb"
/>

<div class="wf-system">

<!-- 1.0 INFORMATII GENERALE -->

### <div style="display: none;">1.0 INFORMATII GENERALE</div>

## <span style="display:none">General</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:bomb" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMATII GENERALE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:info" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">UI Utility</span> <span class="wf-system-highlight">Sistemul C4 Planter</span>
    <p>Sistemul C4 Planter adauga un element de interfata (UI) suplimentar care ofera informatii in timp real despre starea bombei. Acesta este util atat pentru echipa Terrorist, cat si pentru Counter-Terrorist, oferind claritate strategica in timpul rundei.</p>
  </div>
</div>

<!-- 2.0 Detalii UI -->

### <div style="display: none;">2.0 DETALII INTERFATA</div>

## <span style="display:none">Interfata</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layout" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 DETALII INTERFATA</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:monitor" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Atunci cand bomba este plantata, un UI mic apare pe ecran si afiseaza urmatoarele informatii:</p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:user" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Planter:</span> Numele jucatorului care a plantat bomba.</span></li>
      <li><Icon icon="lucide:clock" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Status:</span> Confirmarea vizuala ca bomba este activa si pregatita de explozie.</span></li>
    </ul>
  </div>
</div>

<div class="wf-system-tip">
  <Icon icon="lucide:shield-alert" width="22" height="22" color="#ff8c00" />
  <span>Acest UI este vizibil pentru toti jucatorii vii, ajutand la coordonarea rapida pentru retake sau aparare.</span>
</div>

</div>
