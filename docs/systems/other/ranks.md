---
outline: deep
---

<CaseHeader 
  title="Rank System"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'competitive', component: 'PageTagBlue' },
    { text: 'ranks', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Rank System']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="rank-system"
  badge-text="Ranks & ELO"
  badge-icon="lucide:trending-up"
/>

<div class="wf-system">

<!-- 1.0 INFORMATII GENERALE -->

### <div style="display: none;">1.0 INFORMATII GENERALE</div>

## <span style="display:none">General</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(239, 68, 68, 0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:trending-up" width="30" height="30" color="#ef4444" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMATII GENERALE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:award" width="18" height="18" color="#ef4444" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Competitive</span> <span class="wf-system-highlight">Sistemul de Rank-uri</span>
    <p>Sistemul de rank-uri de pe serverul Wildfire utilizeaza puncte de tip Premier (ELO) pentru a masura performanta si progresul jucatorilor intr-un mod competitiv si echitabil.</p>
  </div>
</div>

<!-- 2.0 Puncte si Clasament -->

### <div style="display: none;">2.0 PUNCTE SI CLASAMENT</div>

## <span style="display:none">Puncte ELO</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(239, 68, 68, 0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:bar-chart-3" width="30" height="30" color="#ef4444" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 PUNCTE SI CLASAMENT</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:list-ordered" width="18" height="18" color="#ef4444" /></div>
  <div class="wf-system-content">
    <p>Poti monitoriza progresul tau si al celorlalti jucatori folosind urmatoarele metode:</p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:terminal" width="18" height="18" color="#ef4444" /><span><span class="wf-system-highlight">!top</span> — Afiseaza clasamentul celor mai buni jucatori direct in chat-ul jocului.</span></li>
      <li><Icon icon="lucide:layout-dashboard" width="18" height="18" color="#ef4444" /><span><span class="wf-system-highlight">Panel Online:</span> Clasamentul complet si statistici detaliate pot fi gasite pe <a href="https://wildfire.ro/panel" target="_blank" style="color: #ef4444; font-weight: 700; text-decoration: none;">wildfire.ro/panel</a>.</span></li>
      <li><Icon icon="lucide:zap" width="18" height="18" color="#ef4444" /><span><span class="wf-system-highlight">Puncte Premier:</span> Castigarea rundelor si eliminarea adversarilor iti vor aduce puncte care iti cresc rank-ul.</span></li>
    </ul>
  </div>
</div>

<div class="wf-system-tip">
  <Icon icon="lucide:info" width="22" height="22" color="#ef4444" />
  <span>Rank-ul tau este afisat atat in chat cat si pe panel, fiind actualizat in timp real dupa fiecare meci.</span>
</div>

</div>
