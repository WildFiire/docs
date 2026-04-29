---
outline: deep
---

<CaseHeader 
  title="Client Settings"
  :tags="[
    { text: 'other', component: 'PageTagRed' },
    { text: 'settings', component: 'PageTagPurple' },
    { text: 'customization', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Other', 'Client Settings']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="client-settings"
  badge-text="Settings"
  badge-icon="lucide:settings-2"
/>

<div class="wf-system">

<!-- 1.0 INFORMATII GENERALE -->

### <div style="display: none;">1.0 INFORMATII GENERALE</div>

## <span style="display:none">General</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:settings-2" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMATII GENERALE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:sliders" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Customization</span> <span class="wf-system-highlight">Meniul de Setari</span>
    <p>Comanda <code>!settings</code> deschide un meniu centralizat de unde iti poti personaliza experienta pe server. Poti activa sau dezactiva diverse elemente vizuale si auditive pentru a obtine configuratia perfecta pentru tine.</p>
  </div>
</div>

<!-- 2.0 Optiuni disponibile -->

### <div style="display: none;">2.0 OPTIUNI DISPONIBILE</div>

## <span style="display:none">Optiuni Setari</span>

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:check-square" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 OPTIUNI DISPONIBILE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:list" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Prin meniul <span class="wf-system-highlight">!settings</span> poti gestiona urmatoarele functionalitati:</p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:crosshair" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Hitmarker:</span> Activeaza sau dezactiveaza indicatorul vizual de hit de pe ecran.</span></li>
      <li><Icon icon="lucide:volume-2" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Hit Sounds:</span> Controleaza daca vrei sa auzi un sunet specific atunci cand lovesti un inamic.</span></li>
      <li><Icon icon="lucide:music" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">MVP Music:</span> Poti alege sa nu auzi imnurile MVP la sfarsitul rundei.</span></li>
      <li><Icon icon="lucide:bell" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Notificari (PM/Mentions):</span> Activeaza sau dezactiveaza sunetele pentru mesaje private si mentiuni.</span></li>
      <li><Icon icon="lucide:message-square" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Chat Notifications:</span> Filtreaza anumite mesaje automate transmise de server in chat.</span></li>
      <li><Icon icon="lucide:message-square" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Si mai multe setari:</span> Afla cum poti folosi <code>!settings</code> mai eficient.</span></li>
    </ul>
  </div>
</div>


</div>
