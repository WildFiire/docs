---
title: "Getting Started"
description: "Descoperă totul despre Getting Started pe platforma Wildfire.ro. Resurse complete, ghiduri și sisteme detaliate pentru Counter-Strike 2."
outline: "deep"
---

<CaseHeader 
  title="Getting Started"
  :tags="[
    { text: 'INFO', color: 'orange' },
    { text: 'VERIFY', color: 'blue' },
    { text: 'SERVER', color: 'green' }
  ]"
  :path="['Home', 'Informatii', 'Getting Started']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="8"
  icon="/icons/wildfire.webp"
  page-id="getting-started"
  badge-text="Getting Started"
  badge-icon="lucide:play-circle"
/>

<div class="wf-info">

<div class="wf-info-card" style="margin-top: 30px; border-left: 4px solid #ff7800; background: linear-gradient(135deg, rgba(255, 120, 0, 0.05), transparent);">
  <div class="wf-info-icon">
    <Icon icon="lucide:shield-check" width="20" height="20" color="#ff7800" />
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font" style="color: #ff7800;">Server Account Verification</span> <span class="wf-info-highlight" style="color: #ff7800;">Verificare Cont Server</span>
    <p style="margin-top: 10px; font-size: 14px; opacity: 0.9;">Pentru a folosi comenzile pe serverul CS2 (!ws, !knife, etc.), trebuie sa-ti verifici contul Steam cu Discord.</p>
  </div>
</div>

<div class="wf-info-divider"></div>

### <span style="display:none">1.0 Cum sa te verifici</span>

## <span style="display:none">Verificare</span>

<div class="wf-info-title" style="color: #ff7800;">
  <Icon icon="lucide:list-ordered" width="22" height="22" color="#ff7800" style="margin-right: 10px;" />
  <span>Cum sa te verifici</span>
</div>

<div class="wf-info-box" style="border-left: 2px solid #ff7800; background: rgba(255, 120, 0, 0.02);">
  <div style="display: flex; flex-direction: column; gap: 20px; padding: 10px 0;">
    
  <div style="display: flex; align-items: flex-start; gap: 15px;">
      <div style="background: rgba(255, 120, 0, 0.1); color: #ff7800; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; font-family: 'JetBrains Mono', monospace; border: 1px solid rgba(255, 120, 0, 0.2); flex-shrink: 0;">01</div>
      <div style="padding-top: 4px;">
        <span style="font-weight: 600;">Conectare:</span>
        <p style="font-size: 13px; opacity: 0.8; margin: 4px 0 0;">Intra pe serverul de CS2 <code>go.wildfire.ro</code></p>
      </div>
    </div>

  <div style="display: flex; align-items: flex-start; gap: 15px;">
      <div style="background: rgba(255, 120, 0, 0.1); color: #ff7800; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; font-family: 'JetBrains Mono', monospace; border: 1px solid rgba(255, 120, 0, 0.2); flex-shrink: 0;">02</div>
      <div style="padding-top: 4px;">
        <span style="font-weight: 600;">Generare Cod:</span>
        <p style="font-size: 13px; opacity: 0.8; margin: 4px 0 0;">Scrie <span class="wf-info-highlight">!link</span> in chat-ul jocului pentru a primi codul.</p>
      </div>
    </div>

   <div style="display: flex; align-items: flex-start; gap: 15px;">
      <div style="background: rgba(255, 120, 0, 0.1); color: #ff7800; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; font-family: 'JetBrains Mono', monospace; border: 1px solid rgba(255, 120, 0, 0.2); flex-shrink: 0;">03</div>
      <div style="padding-top: 4px;">
        <span style="font-weight: 600;">Copiere:</span>
        <p style="font-size: 13px; opacity: 0.8; margin: 4px 0 0;">Copiaza codul unic de 6 caractere afisat in consola/chat.</p>
      </div>
    </div>

  <div style="display: flex; align-items: flex-start; gap: 15px;">
      <div style="background: rgba(255, 120, 0, 0.1); color: #ff7800; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; font-family: 'JetBrains Mono', monospace; border: 1px solid rgba(255, 120, 0, 0.2); flex-shrink: 0;">04</div>
      <div style="padding-top: 4px;">
        <span style="font-weight: 600;">Validare:</span>
        <p style="font-size: 13px; opacity: 0.8; margin: 4px 0 0;">Foloseste comanda <span class="wf-info-highlight">/verify &lt;cod&gt;</span> pe canalul de Discord dedicat.</p>
      </div>
    </div>

  </div>
</div>

<div class="wf-info-divider"></div>

### <span style="display:none">2.0 Comenzi Disponibile</span>

<div class="wf-info-title" style="color: #ff7800;">
  <Icon icon="lucide:terminal" width="22" height="22" color="#ff7800" style="margin-right: 10px;" />
  <span>Comenzi Disponibile</span>
</div>

<div class="wf-info-grid" style="margin-top: 20px;">
  
  <!-- !ws -->
  <div class="wf-info-card" style="border-top: 2px solid #ff7800; border-radius: 12px; background: rgba(255, 120, 0, 0.02);">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <Icon icon="lucide:swords" width="18" height="18" color="#ff7800" />
        <span style="font-weight: 700; color: #ff7800; font-size: 15px;">!ws</span>
        <h2 style="display:none">!ws</h2>
      </div>
      <p style="font-size: 12.5px; opacity: 0.8;">Foloseste <code>!ws</code> pentru a-ti alege skin-ul preferat pe orice arma.</p>
    </div>
  </div>

  <!-- !sl -->
  <div class="wf-info-card" style="border-top: 2px solid #ff7800; border-radius: 12px; background: rgba(255, 120, 0, 0.02);">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <Icon icon="lucide:sword" width="18" height="18" color="#ff7800" />
        <span style="font-weight: 700; color: #ff7800; font-size: 15px;">!sl</span>
        <h2 style="display:none">!sl</h2>
      </div>
      <p style="font-size: 12.5px; opacity: 0.8;">Foloseste <code>!sl</code> pentru a juca la slots (aparate).</p>
    </div>
  </div>

  <!-- !rl -->
  <div class="wf-info-card" style="border-top: 2px solid #ff7800; border-radius: 12px; background: rgba(255, 120, 0, 0.02);">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <Icon icon="lucide:hand" width="18" height="18" color="#ff7800" />
        <span style="font-weight: 700; color: #ff7800; font-size: 15px;">!rl</span>
        <h2 style="display:none">!rl</h2>
      </div>
      <p style="font-size: 12.5px; opacity: 0.8;">Foloseste <code>!rl</code> pentru a juca la ruleta.</p>
    </div>
  </div>

  <!-- !shop -->
  <div class="wf-info-card" style="border-top: 2px solid #ff7800; border-radius: 12px; background: rgba(255, 120, 0, 0.02);">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <Icon icon="lucide:users" width="18" height="18" color="#ff7800" />
        <span style="font-weight: 700; color: #ff7800; font-size: 15px;">!shop</span>
        <h2 style="display:none">!shop</h2>
      </div>
      <p style="font-size: 12.5px; opacity: 0.8;">Cumpără iteme folosin <code>!shop</code>.</p>
    </div>
  </div>

  <!-- !cases -->
  <div class="wf-info-card" style="border-top: 2px solid #ff7800; border-radius: 12px; background: rgba(255, 120, 0, 0.02);">
    <div class="wf-info-content">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <Icon icon="lucide:box" width="18" height="18" color="#ff7800" />
        <span style="font-weight: 700; color: #ff7800; font-size: 15px;">!cases</span>
        <h2 style="display:none">!cases</h2>
      </div>
      <p style="font-size: 12.5px; opacity: 0.8;">Deschide cutii si castiga iteme rare direct pe server.</p>
    </div>
  </div>

</div>



</div>