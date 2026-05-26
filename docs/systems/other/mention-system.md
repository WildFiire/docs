---
title: "Mention System"
description: "Descopera totul despre Mention System pe platforma Wildfire.ro. Resurse complete, ghiduri si sisteme detaliate pentru Counter-Strike 2."
outline: "deep"
---

<CaseHeader 
  title="Mention System"
  :tags="[
    { text: 'other', color: 'red' },
    { text: 'chat', color: 'blue' },
    { text: 'notif', color: 'purple' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Mention System']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="mention-system"
  badge-text="Mentions"
  badge-icon="lucide:at-sign"
/>

<div class="wf-system">

<!-- 1.0 INFORMATII GENERALE -->

### <div style="display: none;">1.0 INFORMATII GENERALE</div>

## <span style="display:none">General</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(239, 68, 68, 0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:at-sign" width="30" height="30" color="#ef4444" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMATII GENERALE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:at-sign" width="18" height="18" color="#ef4444" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Interaction</span> <span class="wf-system-highlight">Sistemul de Mentionari</span>
    <p>Sistemul de mentiuni iti permite sa atragi atentia unui anumit jucator in chat prin scrierea numelui acestuia precedat de simbolul <code>@</code>. Aceasta este o metoda rapida si eficienta de comunicare in timpul meciurilor.</p>
  </div>
</div>

<!-- 2.0 Functionare -->

### <div style="display: none;">2.0 FUNCTIONARE SI NOTIFICARI</div>

## <span style="display:none">Functionare</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(239, 68, 68, 0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:bell" width="30" height="30" color="#ef4444" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 FUNCTIONARE SI NOTIFICARI</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:zap" width="18" height="18" color="#ef4444" /></div>
  <div class="wf-system-content">
    <p>Atunci cand un jucator este mentionat, sistemul declanseaza urmatoarele actiuni:</p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:palette" width="18" height="18" color="#ef4444" /><span><span class="wf-system-highlight">Chat Colorat:</span> Numele mentionat va aparea cu o culoare distincta in chat pentru cel mentionat.</span></li>
      <li><Icon icon="lucide:volume-2" width="18" height="18" color="#ef4444" /><span><span class="wf-system-highlight">Alerta Audio:</span> Cel mentionat va auzi un sunet discret de notificare pentru a fi atentionat.</span></li>
      <li><Icon icon="lucide:mouse-pointer" width="18" height="18" color="#ef4444" /><span><span class="wf-system-highlight">Auto-Complete:</span> Poti scrie doar o parte din nume dupa <code>@</code> pentru a gasi jucatorul dorit.</span></li>
    </ul>
  </div>
</div>

<div class="wf-system-tip">
  <Icon icon="lucide:volume-x" width="22" height="22" color="#ef4444" />
  <span>Sunetul de notificare pentru mentiuni poate fi dezactivat in orice moment din <code>!settings</code>.</span>
</div>

</div>