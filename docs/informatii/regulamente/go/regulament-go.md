---
outline: deep
---

<CaseHeader 
  title="Regulament GO"
  :tags="[
    { text: 'rules', component: 'PageTagRed' },
    { text: 'go', component: 'PageTagBlue' },
    { text: 'server', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Informatii', 'Regulament', 'GO']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="regulament-go"
  wf-info-badge-text="Rules"
/>


<!-- ================================================ -->
<!-- REGULAMENT JUCĂTORI - TOATE REGULILE -->
<!-- ================================================ -->

<!-- 1.0 REGULI GENERALE STAFF -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-info-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-info-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>1.0 REGULI GENERALE</span>
</div>

<div class="wf-info-grid">

<!-- 1.1 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.1</span> Orice tentativă de trișare este pedepsită cu <span class="wf-info-punish wf-info-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 1.2 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.2</span> Limbajul vulgar este strict interzis! De asemenea, toate conversațiile care nu au legătură cu serverul sau comunitatea pot fi discutate în privat.
  </div>
</div>

<!-- 1.3 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.3</span> Sancțiunile acordate pot fi  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
    <span class="wf-info-punish wf-info-font">BAN TEMPORAR</span> / <span class="wf-info-punish wf-info-font">PERMANENT</span>
  </div>
</div>

<!-- 1.4 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.4</span> Jignirea staff-ului duce la  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
  </div>
</div>

<!-- 1.5 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10.5"/>
      <polyline points="16 2 22 8 16 8"/>
      <line x1="10" y1="14" x2="21" y2="14"/>
      <line x1="10" y1="18" x2="18" y2="18"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.5</span> Abuzul excesiv (spam) pe <span class="wf-info-highlight wf-info-font">u@</span> este interzis, drept urmare duce la <span class="wf-info-badge wf-info-font">GAG</span>
  </div>
</div>

<!-- 1.6 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.6</span> Sfidarea oricărei decizii acordate de către un membru staff este strict interzisă.  
    Aceasta se pedepsește cu  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
    <span class="wf-info-punish wf-info-font">BAN TEMPORAR</span> / <span class="wf-info-punish wf-info-font">PERMANENT</span>
  </div>
</div>

<!-- 1.7 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M3 12h3l3-9 3 18 3-9h3"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.7</span> Jignirea adusă serverului sau comunității duce la o sancțiune de  
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-punish wf-info-font">BAN TEMPORAR</span>
    <span class="wf-info-punish wf-info-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 1.8 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.8</span> Este strict interzis să dețineți mai mult de un cont de CS2 pe server!  
    Sancțiunea este <span class="wf-info-punish wf-info-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 1.9 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">1.9</span> Cererile de unban se fac într-un interval de  
    <span class="wf-info-highlight wf-info-font">maximum 10 zile</span> de când a fost sancționat jucătorul.
  </div>
</div>

</div>

<div class="wf-info-divider"></div>

<!-- 2.0 COMPORTAMENT PE SERVER -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-info-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-info-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/></svg>2.0 COMPORTAMENT PE SERVER</span>
</div>

<div class="wf-info-grid">

<!-- 2.1 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">2.1</span> Este strict interzisă deranjarea serverului prin voice-chat.  
    Sancțiune:  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
    <span class="wf-info-punish wf-info-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 2.2 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">2.2</span> Este interzis să stați AFK pentru farmarea de puncte/ore.  
    Riscați: <span class="wf-info-badge wf-info-font">KICK</span>
  </div>
</div>

<!-- 2.3 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">2.3</span> Este interzisă metoda <span class="wf-info-highlight wf-info-font">monitor</span> (când doi jucători din echipe diferite își dau info).  
    Riscați:  
    <span class="wf-info-badge wf-info-font">KICK</span>
    <span class="wf-info-punish wf-info-font">BAN 120 MIN</span>
  </div>
</div>

<!-- 2.4 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">2.4</span> Pentru întrebări legate de server sau reclamarea altor jucători se folosește  
    <span class="wf-info-highlight wf-info-font">"Say_team @mesaj" (u@)</span>.  
    Este interzisă folosirea chat-ului general pentru reclamarea altor jucători (ex: "e codat").  
    Nerespectarea acestei reguli se va sancționa cu  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
  </div>
</div>

<!-- 2.5 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">2.5</span> Toxicitatea și flame-ul la adresa celorlalți jucători aduse sub formă de  
    <span class="wf-info-highlight wf-info-font">"ez"</span>, <span class="wf-info-highlight wf-info-font">"culcat"</span>, <span class="wf-info-highlight wf-info-font">"sit"</span>, <span class="wf-info-highlight wf-info-font">"au măseaua"</span>, <span class="wf-info-highlight wf-info-font">"taci"</span> etc.  
    se vor sancționa cu  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
  </div>
</div>

<!-- 2.6 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M2 12h2l2-5 3 10 3-10 3 10 3-10 2 5h2"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">2.6</span> Pe server se comunică în limba <span class="wf-info-highlight wf-info-font">română</span>.  
    Este acceptată și limba <span class="wf-info-highlight wf-info-font">engleză</span> pentru jucătorii străini.  
    Folosirea oricărei alte limbi atrage sancțiunea  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
    <span class="wf-info-punish wf-info-font">BAN TEMPORAR</span>
  </div>
</div>

</div>

<div class="wf-info-divider"></div>

<!-- 3.0 INTERDICȚII ȘI RESTRICȚII -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-info-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;"></div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-info-font"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8" style="display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="16" r="1" fill="#ff8c00"/></svg>3.0 INTERDICȚII ȘI RESTRICȚII</span>
</div>

<div class="wf-info-grid">

<!-- 3.1 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">3.1</span> Orice tentativă de fraudă / înșelăciune / impersonare se pedepsește cu  
    <span class="wf-info-punish wf-info-font">BAN PERMANENT</span>
  </div>
</div>

<!-- 3.2 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">3.2</span> Utilizarea VPN-urilor sau proxy-urilor pentru a eluda ban-urile sau pentru a obține avantaje nejustificate este strict interzisă.  
    Sancțiune: <span class="wf-info-punish wf-info-font">BAN 7 ZILE</span>
  </div>
</div>

<!-- 3.3 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">3.3</span> Dacă un jucător pretinde în mod fals că este un membru staff, acesta va fi sancționat cu  
    <span class="wf-info-badge wf-info-font">SILENCE</span> sau <span class="wf-info-punish wf-info-font">BAN 7 ZILE</span>
  </div>
</div>

<!-- 3.4 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">3.4</span> Dacă un jucător îi obligă sau îi convinge pe alții să iasă de pe server pentru a juca doar cu o anumită persoană, va primi  
    <span class="wf-info-punish wf-info-font">BAN 7 ZILE</span>
  </div>
</div>

<!-- 3.5 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">3.5</span> Este strict interzis să chemați jucătorii la  
    <span class="wf-info-highlight wf-info-font">competitive / popflash / faceit / etc.</span>  
    Riscați  
    <span class="wf-info-badge wf-info-font">MUTE</span>
    <span class="wf-info-badge wf-info-font">GAG</span>
    <span class="wf-info-badge wf-info-font">SILENCE</span>
    <span class="wf-info-punish wf-info-font">BAN TEMPORAR</span>
  </div>
</div>

<!-- 3.6 -->
<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">3.6</span> Este interzis <span class="wf-info-highlight wf-info-font">griefing / troll</span>.  
    Prima sancțiune: <span class="wf-info-badge wf-info-font">SLAY</span><br>
    Dacă se repetă: <span class="wf-info-punish wf-info-font">BAN 120 MIN</span>
  </div>
</div>

</div>

<div class="wf-info-divider"></div>

<!-- 4.0 INFORMAȚII -->
<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.3); transition: transform 0.3s ease;" class="wf-info-title-hover">
  <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    
  </div>
  
  ### <span style="font-size: 28px; font-weight: 800; line-height: 1; margin-left: -5px; transform: translateY(-2px); display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-info-font"><img src="/icons/wildfire.webp" alt="icon" style="width: 30px; height: 30px; display: inline-block; vertical-align: middle; margin-right: 8px; transform: translateY(-2px);">4.0 INFORMAȚII</span>
</div>

<div class="wf-info-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span><span class="wf-info-highlight wf-info-font">Nu sunteți bineveniți</span> dacă intrați cu gândul de a face rău, mai bine nu intrați. Nu căutăm <span class="wf-info-highlight wf-info-font">"șmecherași"</span> cu figuri în cap, ci oameni cu <span class="wf-info-highlight wf-info-font">bun-simț</span>.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
      <span>Regulamentul poate întâmpina îmbunătățiri, astfel recomandăm verificarea <span class="wf-info-highlight wf-info-font">periodică</span> a acestuia. La întrebarea "Ai citit regulamentul? Răspunsul este <span class="wf-info-highlight wf-info-font">"WILDFIRE BACK ON TOP"</span></span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M8 10h8M8 14h4"/>
      </svg>
      <span>Jocul este <span class="wf-info-highlight wf-info-font">GRATUIT</span> în limita bunului-simț!</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>Evitați să atrageți atenția în mod <span class="wf-info-highlight wf-info-font">negativ</span>.</span>
    </li>
  </ul>
</div>
