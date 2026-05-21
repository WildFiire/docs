---
title: "Rank System"
description: "Sistemul de rank-uri competitiv bazat pe puncte Premier (ELO) de pe WildFire.ro."
outline: deep
---

<CaseHeader 
  title="Rank System"
  :tags="[
    { text: 'other', color: 'red' },
    { text: 'competitive', color: 'blue' },
    { text: 'ranks', color: 'purple' }
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

<!-- 2.0 PROGRESIE RANKS -->

### <div style="display: none;">2.0 PROGRESIE RANKS</div>

## <span style="display:none">Progresie</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(239, 68, 68, 0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:bar-chart-3" width="30" height="30" color="#ef4444" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 PROGRESIE RANKS</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:list-ordered" width="18" height="18" color="#ef4444" /></div>
  <div class="wf-system-content">
    <p>Mai jos este prezentata scala de puncte Premier necesara pentru a avansa:</p>

  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">
      <!-- SILVER -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(156, 163, 175, 0.05); border-radius: 12px; border: 1px solid rgba(156, 163, 175, 0.2);">
        <span style="font-weight: 800; color: #9ca3af; letter-spacing: 0.5px;">SILVER I</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #9ca3af;">0 ELO</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(156, 163, 175, 0.05); border-radius: 12px; border: 1px solid rgba(156, 163, 175, 0.2);">
        <span style="font-weight: 800; color: #9ca3af; letter-spacing: 0.5px;">SILVER IV</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #9ca3af;">1,750 ELO</span>
      </div>
      <!-- GOLD -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(251, 191, 36, 0.05); border-radius: 12px; border: 1px solid rgba(251, 191, 36, 0.2);">
        <span style="font-weight: 800; color: #fbbf24; letter-spacing: 0.5px;">GOLD NOVA I</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #fbbf24;">5,000 ELO</span>
      </div>
      <!-- MG -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(99, 102, 241, 0.05); border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2);">
        <span style="font-weight: 800; color: #6366f1; letter-spacing: 0.5px;">MASTER GUARDIAN I</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #6366f1;">10,000 ELO</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(99, 102, 241, 0.05); border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2);">
        <span style="font-weight: 800; color: #6366f1; letter-spacing: 0.5px;">DISTINGUISHED MASTER GUARDIAN</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #6366f1;">17,500 ELO</span>
      </div>
      <!-- EAGLE -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(168, 85, 247, 0.05); border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.2);">
        <span style="font-weight: 800; color: #a855f7; letter-spacing: 0.5px;">LEGENDARY EAGLE MASTER</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #a855f7;">22,500 ELO</span>
      </div>
      <!-- SMFC -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(236, 72, 153, 0.05); border-radius: 12px; border: 1px solid rgba(236, 72, 153, 0.2);">
        <span style="font-weight: 800; color: #ec4899; letter-spacing: 0.5px;">SUPREME MASTER FIRST CLASS</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #ec4899;">25,000 ELO</span>
      </div>
      <!-- GLOBAL -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 2px solid rgba(239, 68, 68, 0.3); box-shadow: 0 0 15px rgba(239, 68, 68, 0.1);">
        <span style="font-weight: 900; color: #ef4444; letter-spacing: 1px;">THE GLOBAL ELITE</span>
        <span style="font-family: 'Orbitron', sans-serif; font-weight: 800; color: #ef4444;">30,000 ELO</span>
      </div>
    </div>
  </div>
</div>

<div class="wf-system-tip red">
  <Icon icon="lucide:info" width="22" height="22" color="#ef4444" />
  <span>Poti verifica rank-ul tau si top-ul jucatorilor folosind comenzile <code>!rank</code>, <code>!top</code> sau direct pe <a href="https://wildfire.ro/panel" target="_blank" style="color: #ef4444; font-weight: 700; text-decoration: none;">wildfire.ro/panel</a>.</span>
</div>

</div>