---
title: "VIP Tiers — Comparatie"
description: "Compara toate gradele VIP de pe Wildfire.ro — Rebirth, Immortal, Mythic si Night. Afla care VIP se potriveste cel mai bine pentru tine."
outline: false
tag: "Market"
audience: ["Jucator", "VIP"]
---

<CaseHeader 
  title="VIP Tiers — Comparatie"
  :tags="[
    { text: 'market', color: 'purple' },
    { text: 'vip', color: 'yellow' },
    { text: 'comparatie', color: 'blue' }
  ]"
  :path="['Home', 'Market', 'VIP Tiers', 'Comparatie']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="vip-overview"
  badge-text="VIP Overview"
  badge-icon="lucide:crown"
/>

<div class="wf-info-card" style="margin-top: 30px; border-left: 4px solid #8b5cf6; background: rgba(139, 92, 246, 0.03);">
  <div class="wf-info-icon">
    <Icon icon="lucide:crown" width="20" height="20" color="#8b5cf6" />
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">Despre Gradele VIP</span>
    <p style="margin-top: 10px; font-size: 14px; opacity: 0.85; line-height: 1.7;">
      Wildfire.ro ofera mai multe grade VIP cu avantaje progresive — de la bonusuri de baza pentru toti jucatorii de noapte, pana la abilitati exclusive pentru cei mai devotati membri ai comunitatii.
    </p>
    <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
      <span class="wf-info-badge" style="background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.2);">VIP Night — Gratuit</span>
      <span class="wf-info-badge" style="background: rgba(139,92,246,0.1); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.2);">Rebirth — 3€</span>
      <span class="wf-info-badge" style="background: rgba(236,72,153,0.1); color: #ec4899; border: 1px solid rgba(236,72,153,0.2);">Immortal — 6.5€</span>
      <span class="wf-info-badge" style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2);">Mythic — Performanta</span>
    </div>
  </div>
</div>

<div class="wf-info-divider"></div>

## <span style="display:none">Tabel Comparativ VIP</span>

<div class="wf-info-title" style="color: #8b5cf6;">
  <Icon icon="lucide:table" width="22" height="22" color="#8b5cf6" style="margin-right: 10px;" />
  <span>Tabel Comparativ — Toate Gradele</span>
</div>

<VIPComparison />

<div class="wf-info-divider"></div>

## <span style="display:none">Cum alegi VIP-ul potrivit</span>

<div class="wf-info-title" style="color: #8b5cf6;">
  <Icon icon="lucide:help-circle" width="22" height="22" color="#8b5cf6" style="margin-right: 10px;" />
  <span>Cum alegi VIP-ul potrivit?</span>
</div>

<div class="wf-info-grid">
  <div class="wf-info-card" style="border-bottom: 2px solid #6366f1;">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="background: rgba(99,102,241,0.1); padding: 8px; border-radius: 8px;">
          <Icon icon="lucide:moon" width="20" height="20" color="#6366f1" />
        </div>
        <div>
          <div style="font-weight: 800; font-size: 15px; color: #6366f1;">VIP Night</div>
          <div style="font-size: 13px; opacity: 0.7; margin-top: 4px;">Esti jucator nou sau joci mai ales noaptea? Night VIP iti ofera avantaje de baza complet gratuit.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="wf-info-card" style="border-bottom: 2px solid #8b5cf6;">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="background: rgba(139,92,246,0.1); padding: 8px; border-radius: 8px;">
          <Icon icon="lucide:crown" width="20" height="20" color="#8b5cf6" />
        </div>
        <div>
          <div style="font-weight: 800; font-size: 15px; color: #8b5cf6;">VIP Rebirth</div>
          <div style="font-size: 13px; opacity: 0.7; margin-top: 4px;">Vrei un avantaj clar si customizare in chat? Rebirth este punctul de intrare perfect.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="wf-info-card" style="border-bottom: 2px solid #ec4899;">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="background: rgba(236,72,153,0.1); padding: 8px; border-radius: 8px;">
          <Icon icon="lucide:star" width="20" height="20" color="#ec4899" />
        </div>
        <div>
          <div style="font-weight: 800; font-size: 15px; color: #ec4899;">VIP Immortal</div>
          <div style="font-size: 13px; opacity: 0.7; margin-top: 4px;">Cel mai popular! Double Jump, Healthshot si Fast Plant fac diferenta in joc competitiv.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="wf-info-card" style="border-bottom: 2px solid #f59e0b;">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="background: rgba(245,158,11,0.1); padding: 8px; border-radius: 8px;">
          <Icon icon="lucide:trophy" width="20" height="20" color="#f59e0b" />
        </div>
        <div>
          <div style="font-weight: 800; font-size: 15px; color: #f59e0b;">VIP Mythic</div>
          <div style="font-size: 13px; opacity: 0.7; margin-top: 4px;">Rezervat elitei — Auto-Bhop si avantajele maxime. Se obtine prin performanta remarcabila.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wf-system-tip">
  <Icon icon="lucide:shopping-cart" width="22" height="22" color="#8b5cf6" />
  <span>Poti achizitiona gradele VIP direct din magazinul platformei. <br><br><strong>⚠️ WORK IN PROGRESS:</strong> In viitor vom implementa optiunea de a cumpara VIP folosind <strong>Phoenix Coins</strong>. Momentan sistemul este in lucru. <br><br>Duratele disponibile: 7, 15 sau 30 de zile.</span>
</div>
