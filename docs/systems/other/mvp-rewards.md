---
outline: deep
---

<CaseHeader 
  title="MVP Rewards"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'economy', component: 'PageTagPurple' },
    { text: 'rewards', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Other', 'MVP Rewards']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="mvp-rewards"
  badge-text="Rewards"
  badge-icon="lucide:gift"
/>

<div class="wf-system">

<!-- 1.0 RECOMPENSE MVP -->
### <div style="display: none;">1.0 RECOMPENSE MVP</div>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 RECOMPENSE MVP</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:gift" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Atunci când ești desemnat MVP-ul rundei, primești automat o recompensă aleatorie. Poți verifica situația token-urilor tale folosind comanda:</p>
    
   <div class="wf-system-tip orange" style="margin: 15px 0;">
      <Icon icon="lucide:terminal" width="22" height="22" color="#ff8c00" />
      <span>Comandă Chat: <code>!wstokens</code></span>
    </div>

   <p>Sistemul alege în mod random una dintre următoarele recompense:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:coins" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">PHOENIX COINS</span> — Moneda principală a serverului.</span></li>
      <li><Icon icon="lucide:key" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">CASES</span> — Cutii de skin-uri.</span></li>
      <li><Icon icon="lucide:sparkles" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">RANDOM STUFF</span> — Alte surprize și iteme din economia serverului.</span></li>
    </ul>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Recompensele se acordă la finalul fiecărei runde și sunt direct corelate cu performanța ta individuală (Most Valuable Player).</p>
</div>

</div>
