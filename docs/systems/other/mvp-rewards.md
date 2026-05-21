---
title: "MVP Rewards"
description: "Sistemul de recompense automate pentru cel mai bun jucator al rundei pe WildFire.ro."
outline: deep
---

<CaseHeader 
  title="MVP Rewards"
  :tags="[
    { text: 'other', color: 'red' },
    { text: 'rewards', color: 'purple' }
  ]"
  :path="['Home', 'Systems', 'Other', 'MVP Rewards']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="mvp-rewards"
  badge-text="MVP Tokens"
  badge-icon="lucide:sparkles"
/>

<div class="wf-system">

<!-- 1.0 NOTIFICARE MVP -->

### <div style="display: none;">1.0 NOTIFICARE MVP</div>

## <span style="display:none">Notificare</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 NOTIFICARE MVP</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:star" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Cand esti desemnat MVP-ul rundei, serverul anunta in chat recompensa primita:</p>

 <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/mvp/rewardmvp.png" alt="mvp chat preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">chat notification</div>
      </div>
    </div>
  </div>
</div>

<!-- 2.0 STATISTICI TOKENI -->

### <div style="display: none;">2.0 STATISTICI TOKENI</div>

## <span style="display:none">Tokeni</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:bar-chart-3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 STATISTICI TOKENI</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:terminal" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Foloseste <code>!wstokens</code> pentru a vedea balanta curenta si istoricul tau total (Lifetime):</p>

<div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/mvp/rewards2.png" alt="wstokens menu preview" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">token statistics</div>
      </div>
    </div>

 <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:coins" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">PHX Coins:</span> Moneda principala a serverului.</span></li>
      <li><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Free Cases:</span> Cutii moca pentru skin-uri.</span></li>
      <li><Icon icon="lucide:refresh-cw" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Wear Re-rolls:</span> Token-uri pentru a schimba uzura (float) skin-urilor.</span></li>
    </ul>
  </div>
</div>

</div>