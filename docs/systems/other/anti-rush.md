---
title: "Anti Rush System"
description: "Sistem de protectie pentru echipa Counter-Terrorist in primele 30 de secunde ale rundei."
outline: deep
---

<CaseHeader 
  title="Anti Rush System"
  :tags="[
    { text: 'other', color: 'red' },
    { text: 'gameplay', color: 'blue' },
    { text: 'protection', color: 'purple' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Anti Rush']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="anti-rush"
  badge-text="CT Protection"
  badge-icon="lucide:shield-ban"
/>

<div class="wf-system">

<!-- 1.0 FUNCTIONARE GENERALA -->
### <div style="display: none;">1.0 FUNCTIONARE GENERALA</div>
## <span style="display:none">General</span>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(239, 68, 68, 0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:shield-ban" width="30" height="30" color="#ef4444" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 FUNCTIONARE GENERALA</span>
</div>

<div class="wf-system-card">
<div class="wf-system-icon"><Icon icon="lucide:shield-check" width="18" height="18" color="#ef4444" /></div>
<div class="wf-system-content">
<span class="wf-system-number">Gameplay Balance</span> <span class="wf-system-highlight">Restrictie Push CT</span>
<p>Sistemul Anti Rush este proiectat pentru a mentine echilibrul pe hartile unde echipa T ar putea fi dezavantajata de un push agresiv imediat al echipei CT.</p>
<ul class="wf-system-custom-list">
<li><Icon icon="lucide:lock" width="18" height="18" color="#ef4444" /><span><b>Bariere Invizibile:</b> Zonele cheie sunt blocate de pereti invizibili care impiedica trecerea jucatorilor CT.</span></li>
<li><Icon icon="lucide:timer" width="18" height="18" color="#ef4444" /><span><b>Timp de Asteptare:</b> Barierele raman active timp de fix <b>30 de secunde</b> de la inceperea rundei.</span></li>
<li><Icon icon="lucide:map" width="18" height="18" color="#ef4444" /><span><b>Harti Specifice:</b> Sistemul este implementat pe hartile unde rush-ul CT poate strica flow-ul jocului (ex: Dust2, Mirage).</span></li>
</ul>
</div>
</div>

<!-- 2.0 AVERTISMENTE SI CHAT -->
### <div style="display: none;">2.0 AVERTISMENTE SI CHAT</div>
## <span style="display:none">Chat</span>
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(239, 68, 68, 0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:message-square" width="30" height="30" color="#ef4444" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 AVERTISMENTE SI CHAT</span>
</div>

<div class="wf-system-card">
<div class="wf-system-icon"><Icon icon="lucide:alert-triangle" width="18" height="18" color="#ef4444" /></div>
<div class="wf-system-content">
<p>Daca un jucator CT atinge o bariera in timpul perioadei de protectie, serverul va afisa automat urmatoarele mesaje in chat:</p>
<div style="margin: 20px 0; background: rgba(0, 0, 0, 0.4); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); font-family: 'Inter', sans-serif;">
<div style="color: #fff; margin-bottom: 8px; font-size: 13px; line-height: 1.5;"><span style="color: #ef4444; font-weight: 800;">•</span> Anti-rush is active! Do not enter restricted zones for 30 seconds.</div>
<div style="color: #fff; font-size: 13px; line-height: 1.5;"><span style="color: #ef4444; font-weight: 800;">•</span> You are in a restricted zone! Get out immediately!</div>
</div>
<p>Dupa expirarea celor 30 de secunde, barierele dispar fara nicio notificare suplimentara, permitand push-ul liber.</p>
</div>
</div>

<div class="wf-system-tip red">
<Icon icon="lucide:info" width="22" height="22" color="#ef4444" />
<span>Recomandare: Urmareste cronometrul rundei pentru a sti exact cand barierele devin inactive.</span>
</div>

</div>