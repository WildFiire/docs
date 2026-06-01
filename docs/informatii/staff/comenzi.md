---
title: "Comenzi STAFF"
description: "Lista completa de comenzi pentru membrii STAFF pe serverele Wildfire.ro. Ghid detaliat pentru administrarea serverului."
outline: "deep"
---

<CaseHeader
  title="Comenzi STAFF"
  :tags="[
    { text: 'STAFF', color: 'orange' },
    { text: 'ADMIN', color: 'orange' },
    { text: 'SERVER', color: 'green' }
  ]"
  :path="['Home', 'Informatii', 'Staff', 'Comenzi']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="8"
  icon="/icons/wildfire.webp"
  page-id="comenzi-staff"
  badge-text="Staff Only"
  badge-icon="lucide:shield-check"
/>

<div class="wf-info">

<div class="wf-info-card" style="margin-top: 30px; border-left: 4px solid #ff7800; background: rgba(255, 120, 0, 0.05);">
  <div class="wf-info-icon">
    <Icon icon="lucide:shield-alert" width="20" height="20" color="#ff7800"></Icon>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font" style="color: #ff7800;">Administrare Server</span> <span class="wf-info-highlight" style="color: #ff7800;">Comenzi Administrative</span>
    <p style="margin-top: 10px; font-size: 14px; opacity: 0.9;">Aceste comenzi sunt destinate exclusiv membrilor STAFF. Utilizarea lor necorespunzatoare poate duce la sanctiuni administrative.</p>
  </div>
</div>

<div class="wf-info-divider"></div>

### <span style="display:none">1.0 Lista Comenzilor</span>

<div class="wf-info-title" style="color: #ff7800;">
  <Icon icon="lucide:terminal" width="20" height="20" color="#ff7800" style="margin-right: 10px;" />
  <span>Lista Comenzilor (Ghid Complet)</span>
</div>

<div class="wf-cmd-table-wrap" style="margin-top: 16px;">
  <table class="wf-cmd-table">
    <thead>
      <tr>
        <th>Comanda</th>
        <th>Sintaxa</th>
        <th>Descriere</th>
        <th>Grad minim</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:shield" width="13" height="13" />!admin</span></td>
        <td><code>!admin</code></td>
        <td>Deschide meniul principal de administrare.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:mic-off" width="13" height="13" />!gag</span></td>
        <td><code>!gag &lt;nume&gt; &lt;timp&gt;</code></td>
        <td>Restrictioneaza chat-ul scris al unui jucator.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:volume-x" width="13" height="13" />!mute</span></td>
        <td><code>!mute &lt;nume&gt; &lt;timp&gt;</code></td>
        <td>Restrictioneaza chat-ul vocal al unui jucator.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:bell-off" width="13" height="13" />!silence</span></td>
        <td><code>!silence &lt;nume&gt; &lt;timp&gt;</code></td>
        <td>Restrictioneaza complet comunicarea (vocal + scris).</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:mic" width="13" height="13" />!ungag</span></td>
        <td><code>!ungag &lt;nume&gt;</code></td>
        <td>Elimina restrictia de chat scris.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:volume-2" width="13" height="13" />!unmute</span></td>
        <td><code>!unmute &lt;nume&gt;</code></td>
        <td>Elimina restrictia de chat vocal.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:shield-off" width="13" height="13" />!unsilence</span></td>
        <td><code>!unsilence &lt;nume&gt;</code></td>
        <td>Elimina silence-ul unui jucator.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:users" width="13" height="13" />!team</span></td>
        <td><code>!team &lt;nume&gt; &lt;echipa&gt;</code></td>
        <td>Muta un jucator in echipa specificata.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:repeat" width="13" height="13" />!swap</span></td>
        <td><code>!swap &lt;nume&gt;</code></td>
        <td>Schimba echipa unui jucator.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:eye" width="13" height="13" />!spec</span></td>
        <td><code>!spec &lt;nume&gt;</code></td>
        <td>Muta un jucator la spectatori.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:type" width="13" height="13" />!rename</span></td>
        <td><code>!rename &lt;vechi&gt; &lt;nou&gt;</code></td>
        <td>Schimba numele unui jucator pe server.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:skull" width="13" height="13" />!slay</span></td>
        <td><code>!slay &lt;nume&gt;</code></td>
        <td>Omoara un jucator instantaneu.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:zap" width="13" height="13" />!slap</span></td>
        <td><code>!slap &lt;nume&gt; &lt;dmg&gt;</code></td>
        <td>Aplica damage unui jucator.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:user-minus" width="13" height="13" />!kick</span></td>
        <td><code>!kick &lt;nume&gt; &lt;motiv&gt;</code></td>
        <td>Elimina un jucator de pe server.</td>
        <td><span class="wf-badge wf-badge-helper">Helper</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:ban" width="13" height="13" />!ban</span></td>
        <td><code>!ban &lt;nume&gt; &lt;timp&gt; &lt;motiv&gt;</code></td>
        <td>Interzice accesul unui jucator pe server.</td>
        <td><span class="wf-badge wf-badge-mod">Moderator</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:shield-check" width="13" height="13" />!unban</span></td>
        <td><code>!unban &lt;nume/steamid&gt;</code></td>
        <td>Elimina ban-ul unui jucator.</td>
        <td><span class="wf-badge wf-badge-admin">Admin</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:heart" width="13" height="13" />!respawn</span></td>
        <td><code>!respawn &lt;nume&gt;</code></td>
        <td>Reinvie un jucator.</td>
        <td><span class="wf-badge wf-badge-admin">Admin</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:megaphone" width="13" height="13" />!csay</span></td>
        <td><code>!csay &lt;mesaj&gt;</code></td>
        <td>Trimite un mesaj centrat pe ecran.</td>
        <td><span class="wf-badge wf-badge-admin">Admin</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:users-2" width="13" height="13" />!admins</span></td>
        <td><code>!admins</code></td>
        <td>Gestioneaza lista de admini.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:contact-2" width="13" height="13" />!groups</span></td>
        <td><code>!groups</code></td>
        <td>Modifica si gestioneaza grupurile.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:globe" width="13" height="13" />!globalban</span></td>
        <td><code>!globalban &lt;nume&gt; &lt;timp&gt;</code></td>
        <td>Ban global pe toate serverele.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:globe" width="13" height="13" />!globalgag</span></td>
        <td><code>!globalgag &lt;nume&gt;</code></td>
        <td>Gag global pe toate serverele.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:globe" width="13" height="13" />!globalmute</span></td>
        <td><code>!globalmute &lt;nume&gt;</code></td>
        <td>Mute global pe toate serverele.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:globe" width="13" height="13" />!globalsilence</span></td>
        <td><code>!globalsilence &lt;nume&gt;</code></td>
        <td>Silence global pe toate serverele.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:coins" width="13" height="13" />!givemoney</span></td>
        <td><code>!givemoney &lt;nume&gt; &lt;suma&gt;</code></td>
        <td>Acorda bani in joc.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:wallet" width="13" height="13" />!setmoney</span></td>
        <td><code>!setmoney &lt;nume&gt; &lt;suma&gt;</code></td>
        <td>Seteaza suma de bani a unui jucator.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:snowflake" width="13" height="13" />!freeze</span></td>
        <td><code>!freeze &lt;nume&gt;</code></td>
        <td>Ingheata un jucator.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:flame" width="13" height="13" />!unfreeze</span></td>
        <td><code>!unfreeze &lt;nume&gt;</code></td>
        <td>Dezgheata un jucator.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:banknote" width="13" height="13" />!eco give</span></td>
        <td><code>!eco give &lt;nume&gt; &lt;suma&gt; &lt;wallet&gt</code></td>
        <td>Acorda Phoenix/Credits pe server.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:star" width="13" height="13" />!vipadd</span></td>
        <td><code>!vipadd &lt;steamid&gt;</code></td>
        <td>Adauga VIP unui jucator.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:map" width="13" height="13" />!map</span></td>
        <td><code>!map &lt;de_harta&gt;</code></td>
        <td>Schimba harta serverului.</td>
        <td><span class="wf-badge wf-badge-sm">Server Manager</span></td>
      </tr>
      <tr>
        <td><span class="wf-cmd-pill"><Icon icon="lucide:map" width="13" height="13" />!ar</span></td>
        <td><code>!ar</code></td>
        <td>Deschide editorul de zone (Zones Editor).</td>
        <td><span class="wf-badge wf-badge-cm">Community Manager</span></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="wf-info-divider"></div>

### <span style="display:none">2.0 Acces pe Grade</span>

<div class="wf-info-title" style="color: #ff7800;">
  <Icon icon="lucide:layers" width="20" height="20" color="#ff7800" style="margin-right: 10px;" />
  <span>Acces pe Grade (Progresie & Imunitate)</span>
</div>

<div class="wf-grade-block wf-grade-helper" style="margin-top: 16px;">
  <div class="wf-grade-header">
    <div class="wf-grade-title"><Icon icon="lucide:shield" width="16" height="16" /> Helper</div>
    <div class="wf-immunity-badge">Immunity: 70</div>
  </div>
  <div class="wf-grade-tags" style="padding-top: 16px;">
    <code>!admin</code> <code>!gag</code> <code>!mute</code> <code>!silence</code> <code>!ungag</code> <code>!unmute</code> <code>!unsilence</code> <code>!team</code> <code>!swap</code> <code>!spec</code> <code>!rename</code> <code>!slay</code> <code>!slap</code> <code>!kick</code>
  </div>
</div>

<div class="wf-grade-block wf-grade-mod">
  <div class="wf-grade-header">
    <div class="wf-grade-title"><Icon icon="lucide:shield-check" width="16" height="16" /> Moderator</div>
    <div class="wf-immunity-badge">Immunity: 80</div>
  </div>
  <div style="padding: 12px 16px; font-size: 12.5px; color: var(--vp-c-text-2); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(128,128,128,0.1);">
    <Icon icon="lucide:corner-down-right" width="14" height="14" /> <span>Mosteneste toate comenzile de la <b>Helper</b>, plus:</span>
  </div>
  <div class="wf-grade-tags">
    <code class="wf-tag-new">!ban</code>
  </div>
</div>

<div class="wf-grade-block wf-grade-admin">
  <div class="wf-grade-header">
    <div class="wf-grade-title"><Icon icon="lucide:shield-alert" width="16" height="16" /> Administrator</div>
    <div class="wf-immunity-badge">Immunity: 90</div>
  </div>
  <div style="padding: 12px 16px; font-size: 12.5px; color: var(--vp-c-text-2); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(128,128,128,0.1);">
    <Icon icon="lucide:corner-down-right" width="14" height="14" /> <span>Mosteneste toate comenzile de la <b>Moderator</b>, plus:</span>
  </div>
  <div class="wf-grade-tags">
    <code class="wf-tag-new">!unban</code> <code class="wf-tag-new">!respawn</code> <code class="wf-tag-new">!csay</code>
  </div>
</div>

<div class="wf-grade-block wf-grade-sv">
  <div class="wf-grade-header">
    <div class="wf-grade-title"><Icon icon="lucide:shield-ellipsis" width="16" height="16" /> Supervizor</div>
    <div class="wf-immunity-badge">Immunity: 92</div>
  </div>
  <div style="padding: 12px 16px; font-size: 12.5px; color: var(--vp-c-text-2); display: flex; align-items: center; gap: 8px;">
    <Icon icon="lucide:corner-down-right" width="14" height="14" /> <span>Mosteneste toate comenzile de la <b>Administrator</b>. Nu are comenzi noi adaugate, dar beneficiaza de un grad mai mare de imunitate.</span>
  </div>
</div>

<div class="wf-grade-block wf-grade-sm">
  <div class="wf-grade-header">
    <div class="wf-grade-title"><Icon icon="lucide:server" width="16" height="16" /> Server Manager</div>
    <div class="wf-immunity-badge">Immunity: 94</div>
  </div>
  <div style="padding: 12px 16px; font-size: 12.5px; color: var(--vp-c-text-2); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(128,128,128,0.1);">
    <Icon icon="lucide:corner-down-right" width="14" height="14" /> <span>Mosteneste toate comenzile de la <b>Supervizor</b>, plus:</span>
  </div>
  <div class="wf-grade-tags">
    <code class="wf-tag-new">!admins</code> <code class="wf-tag-new">!groups</code> <code class="wf-tag-new">!globalban</code> <code class="wf-tag-new">!globalgag</code> <code class="wf-tag-new">!globalmute</code> <code class="wf-tag-new">!globalsilence</code> <code class="wf-tag-new">!givemoney</code> <code class="wf-tag-new">!setmoney</code> <code class="wf-tag-new">!freeze</code> <code class="wf-tag-new">!unfreeze</code> <code class="wf-tag-new">!eco give</code> <code class="wf-tag-new">!vipadd</code>
  </div>
</div>

<div class="wf-grade-block wf-grade-cm">
  <div class="wf-grade-header">
    <div class="wf-grade-title"><Icon icon="lucide:users" width="16" height="16" /> Community Manager</div>
    <div class="wf-immunity-badge">Immunity: 97</div>
  </div>
  <div style="padding: 12px 16px; font-size: 12.5px; color: var(--vp-c-text-2); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(128,128,128,0.1);">
    <Icon icon="lucide:corner-down-right" width="14" height="14" /> <span>Mosteneste toate comenzile de la <b>Server Manager</b>, plus:</span>
  </div>
  <div class="wf-grade-tags">
    <code class="wf-tag-new">!ar (Zones Editor)</code>
  </div>
</div>

<div class="wf-grade-block wf-grade-owner">
  <div class="wf-grade-header">
    <div class="wf-grade-title"><Icon icon="lucide:crown" width="16" height="16" /> FOUNDER</div>
    <div class="wf-immunity-badge">Immunity: 100</div>
  </div>
  <div class="wf-grade-tags">
    <code class="wf-tag-owner">* (FULL SERVER & CONSOLE ACCESS)</code>
  </div>
</div>

</div>
