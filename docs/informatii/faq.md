---
outline: deep
---
<CaseHeader 
  title="Intrebari Frecvente"
  :tags="[
    { text: 'INFO', component: 'PageTagPurple' },
    { text: 'FAQ', component: 'PageTagRed' },
    { text: 'WILDFIRE', component: 'PageTagOrange' }
  ]"
  :path="['Home', 'Informatii', 'Intrebari']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="8"
  icon="/icons/wildfire.webp"
  page-id="about-faq"
  wf-info-badge-text="Intrebari"
  wf-info-badge-icon="lucide:shield-question-mark"
  :floating-icons="[
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' },
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' },
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' }
  ]"
/>

<!-- ================================================ -->
<!-- FAQ — WILDFIRE.RO -->
<!-- ================================================ -->

<!-- INTRO -->
<div class="wf-info-card" style="margin-top: 30px;">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <line x1="8" y1="2" x2="8" y2="22" stroke-dasharray="2 2"/>
      <line x1="16" y1="2" x2="16" y2="22" stroke-dasharray="2 2"/>
      <line x1="2" y1="8" x2="22" y2="8" stroke-dasharray="2 2"/>
      <line x1="2" y1="16" x2="22" y2="16" stroke-dasharray="2 2"/>
    </svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">PANEL</span> <span class="wf-info-highlight">wildfire.ro</span>
    <p style="margin: 8px 0 10px;">Accesează-ți contul cu Steam și gestionează totul dintr-un singur loc: statistici, tickete, donații și multe altele.</p>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <span class="wf-info-badge">Statistici jucător</span>
      <span class="wf-info-badge">Tickete active</span>
      <span class="wf-info-badge">Leaderboard</span>
      <span class="wf-info-badge">Market & VIP</span>
    </div>
  </div>
</div>

<div class="wf-info-divider"></div>

<!-- 1.0 ÎNTREBĂRI FRECVENTE -->
### <span style="display:none">Întrebări Frecvente</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
  <span>1.0 Întrebări Frecvente</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum mă conectez pe server?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Deschide consola apăsând tasta <span class="wf-info-badge">~</span> și scrie:</p>
      <p><code class="wf-info-font">connect cs2.wildfire.ro</code></p>
      <p>Alternativ, adaugă serverul la favorite: <span class="wf-info-badge">cs2.wildfire.ro:27015</span></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M12 8v4l3 3"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum pot aplica în staff?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Poți aplica prin sistemul de tickete:</p>
      <p><span class="wf-info-step">1</span> Accesează <code>wildfire.ro</code></p>
      <p><span class="wf-info-step">2</span> Autentifică-te cu Steam</p>
      <p><span class="wf-info-step">3</span> Mergi la <span class="wf-info-highlight">"Tickete"</span> și alege tipul <span class="wf-info-type helper" style="display:inline-flex;margin-left:5px;padding:2px 10px;font-size:11px;">Helper apply</span></p>
      <p>Completează formularul cu informații despre tine, experiență și motivul aplicației.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce fac dacă găsesc un bug?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Anunță-ne cât mai repede:</p>
      <ul>
        <li><span class="wf-info-badge">Pe site</span> — Deschide un ticket de tip <span class="wf-info-type request" style="display:inline-flex;margin-left:5px;padding:2px 10px;font-size:11px;">Bug Report</span></li>
        <li><span class="wf-info-badge">Pe Discord</span> — Anunță în canalul de ticket-uri</li>
      </ul>
      <p>Oferă cât mai multe detalii: cum ai întâlnit bug-ul, ce ai făcut înainte, screenshot-uri sau video dacă e posibil.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <span class="wf-info-collapse-title">Am primit ban de la anticheat, ce pot face?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Sistemul anti-cheat este automat și precis. Dacă ai primit ban, a detectat activitate suspectă.</p>
      <ul>
        <li><span style="color:#ff4444;font-weight:600;">Important:</span> Ban-ul de la anti-cheat este în majoritatea cazurilor definitiv.</li>
        <li><span class="wf-info-highlight">NU poți face nimic</span> dacă ban-ul a fost corect aplicat.</li>
        <li>DOAR dacă există o eroare a sistemului (extrem de rar) poți deschide un ticket de tip <span class="wf-info-type unban" style="display:inline-flex;margin-left:4px;padding:2px 10px;font-size:11px;">Unban</span> cu dovezi clare.</li>
      </ul>
      <p style="font-size:12px;opacity:0.7;">Fără dovezi convingătoare, ticketul va fi respins automat.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
      </div>
      <span class="wf-info-collapse-title">Pe server există skin-uri?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">DA!</span> Pe server există skin-uri personalizate. Poți folosi comenzile:</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">
        <span class="wf-info-badge">!ws</span>
        <span class="wf-info-badge">!knife</span>
        <span class="wf-info-badge">!glove</span>
        <span class="wf-info-badge">!agent</span>
      </div>
      <p>Autentifică-te cu <span class="wf-info-highlight">Steam</span> pe <code>wildfire.ro</code> pentru a debloca skin-uri, cuțite, mănuși și agenți.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum intru pe Discord?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Serverul nostru de Discord este locul unde comunitatea se adună, anunțăm evenimente și poți primi ajutor rapid.</p>
      <p><span class="wf-info-highlight">Link permanent:</span> <code class="wf-info-font">discord.gg/CyFrDpCu</code></p>
      <ul>
        <li>Anunțuri importante</li>
        <li>Suport rapid de la staff</li>
        <li>Evenimente și giveaway-uri</li>
        <li>Comunitatea activă</li>
      </ul>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- 2.0 SISTEM TICKETE -->
### <span style="display:none">Sistem Tickete</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/></svg>
  <span>2.0 Sistem Tickete</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce tipuri de tickete pot deschide? <span class="wf-info-collapse-badge">4 tipuri</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Poți deschide următoarele tipuri de tickete în Dashboard:</p>
      <div class="wf-info-types">
        <div class="wf-info-type unban"><svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Unban</div>
        <div class="wf-info-type report"><svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Reclamații</div>
        <div class="wf-info-type helper"><svg viewBox="0 0 24 24" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Helper apply</div>
        <div class="wf-info-type bug"><svg viewBox="0 0 24 24" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Bug Report</div>
      </div>
      <p><span class="wf-info-highlight">Unban</span> — Pentru cereri de deblocare<br>
      <span class="wf-info-highlight">Bug Report</span> — Pentru a raporta bug-uri<br>
      <span class="wf-info-highlight">Reclamații</span> — Cu dovezi (demo, screenshot)<br>
      <span class="wf-info-highlight">Helper</span> — Aplicații pentru staff</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M12 8v4l3 3"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum deschid un ticket? <span class="wf-info-collapse-badge">3 pași</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-step">1</span> Accesează <code>wildfire.ro</code></p>
      <p><span class="wf-info-step">2</span> Autentifică-te cu Steam</p>
      <p><span class="wf-info-step">3</span> Mergi la <span class="wf-info-highlight">"Tickete"</span> și apasă "Deschide ticket nou"</p>
      <p>Completează formularul cu tipul ticketului, titlu, descriere detaliată și dovezi.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cât durează până primesc răspuns?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Timpul mediu de rezolvare este <span class="wf-info-highlight">&lt;12-24 ore</span>. În funcție de tip:</p>
      <ul>
        <li><span class="wf-info-badge">Unban</span> — 24-72 ore în funcție de gravitate</li>
        <li><span class="wf-info-badge">Reclamații</span> — 4-24 ore (necesită verificare)</li>
        <li><span class="wf-info-badge">Bug Report</span> — 24-48 ore</li>
        <li><span class="wf-info-badge">Helper</span> — 24-48 ore</li>
      </ul>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 2v20M17 2v20"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce dovezi trebuie să atașez?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Pentru <span class="wf-info-highlight">report-uri</span> sunt necesare dovezi clare:</p>
      <ul>
        <li><span class="wf-info-badge">Screenshot</span> — Cu numele jucătorului vizibil</li>
        <li><span class="wf-info-badge">Video</span> — Link YouTube/Streamable</li>
      </ul>
      <p>Fără dovezi clare, ticketul poate fi respins. Toate instrucțiunile se regăsesc pe site la deschiderea ticketului.</p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- 3.0 DASHBOARD -->
### <span style="display:none">Dashboard</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
  <span>3.0 Dashboard</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce statistici pot vedea în Dashboard?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Dashboard-ul îți arată:</p>
      <ul>
        <li><span class="wf-info-highlight">Rank-ul</span> și ELO-ul actual</li>
        <li><span class="wf-info-highlight">Statistici</span> K/D, win rate, headshot %</li>
        <li><span class="wf-info-highlight">Fire Coins</span> balanță și tranzacții</li>
        <li><span class="wf-info-highlight">Tickete</span> active și istoric</li>
        <li><span class="wf-info-highlight">Leaderboard</span> poziția globală</li>
      </ul>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce sunt creditele și cum le folosesc?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Creditele</span> sunt moneda virtuală a serverului.</p>
      <p>Cum faci rost de ele:</p>
      <ul>
        <li>Jucând meciuri, MVP-uri, kill-uri</li>
        <li>Bonus zilnic de conectare</li>
        <li>Gold Member & Evenimente</li>
      </ul>
      <p><span class="wf-info-highlight">Unde îi folosești:</span> Pe server poți cumpăra iteme cosmetice, culori chat și multe altele.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum funcționează Market-ul?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">wildfire.ro/market</span> este magazinul serverului:</p>
      <ul>
        <li><span class="wf-info-badge">VIP</span> — Pachete VIP</li>
        <li><span class="wf-info-badge">Cosmetice</span> — Tag-uri, MVP-uri, wf-info-badge-uri</li>
        <li><span class="wf-info-badge">Fire Coins</span> — Pachete de coins</li>
        <li><span class="wf-info-badge">Skins</span> — Skin-uri, custom agents</li>
      </ul>
      <p>Poți plăti cu <span class="wf-info-highlight">Fire Coins</span> sau <span class="wf-info-highlight">bani reali</span>.</p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 4.0 SKIN-URI & WEAPONSKINS -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Skin-uri & WeaponSkins</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
  <span>4.0 Skin-uri & WeaponSkins</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum funcționează skin-urile? <span class="wf-info-collapse-badge">!ws</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Serverul are un <span class="wf-info-highlight">sistem complet de skin-uri</span> cu economie reală, stocuri limitate și inventar personal.</p>
      <p>Comenzi principale:</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">
        <span class="wf-info-badge">!ws</span>
        <span class="wf-info-badge">!knife</span>
        <span class="wf-info-badge">!glove</span>
        <span class="wf-info-badge">!agent</span>
        <span class="wf-info-badge">!inventory</span>
        <span class="wf-info-badge">!loadout</span>
      </div>
      <ul>
        <li><span class="wf-info-highlight">!ws</span> — deschide meniul principal de skin-uri (arme, cuțite, mănuși, agenți)</li>
        <li><span class="wf-info-highlight">!knife</span> — alege direct un cuțit din inventar</li>
        <li><span class="wf-info-highlight">!glove</span> — alege direct mănușile din inventar</li>
        <li><span class="wf-info-highlight">!agent</span> — alege agentul (T sau CT)</li>
        <li><span class="wf-info-highlight">!inventory</span> — vezi toate itemele din inventar</li>
        <li><span class="wf-info-highlight">!loadout</span> — gestionează loadout-ul activ</li>
      </ul>
      <p>Poți echipa skin-uri și de pe site: <code>wildfire.ro</code> → autentifică-te cu Steam.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum deschid case-uri? <span class="wf-info-collapse-badge">!ws → Cases</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Case-urile se deschid din meniul <span class="wf-info-highlight">!ws</span> sau direct de pe site.</p>
      <ul>
        <li>Fiecare caz are un <span class="wf-info-highlight">pool unic</span> de iteme cu rarități diferite (Consumer → Covert)</li>
        <li>Deschiderea costă <span class="wf-info-highlight">credite</span> sau <span class="wf-info-highlight">Phoenix Coins</span></li>
        <li>Itemele câștigate merg direct în inventar</li>
        <li>Pe site ai animație de spin cu preview</li>
      </ul>
      <p>Detalii complete: <a href="/systems/skins/cases" style="color:#ff8c00;">Pagina Cases →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum tranzacționez skin-uri cu alți jucători?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Skin-urile pot fi tranzacționate prin <span class="wf-info-highlight">sistemul de trade</span> de pe site:</p>
      <p><span class="wf-info-step">1</span> Accesează <code>wildfire.ro</code> și autentifică-te cu Steam</p>
      <p><span class="wf-info-step">2</span> Mergi la inventarul tău și selectează itemele</p>
      <p><span class="wf-info-step">3</span> Poți pune iteme pe <span class="wf-info-highlight">Market</span> sau le poți trimite direct altui jucător</p>
      <p>Toate tranzacțiile sunt securizate și loggate de sistem.</p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 5.0 GAMBLING -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Gambling</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
  <span>5.0 Gambling</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum joc la Roulette? <span class="wf-info-collapse-badge">!rl</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Scrie <span class="wf-info-badge">!rl</span> în chat pentru a deschide meniul de roulette.</p>
      <ul>
        <li>Pariezi pe <span class="wf-info-highlight">culori</span> (roșu/negru/verde)</li>
        <li>Pariezi pe <span class="wf-info-highlight">numere</span> individuale</li>
        <li>Pariezi pe <span class="wf-info-highlight">grupuri</span> sau <span class="wf-info-highlight">coloane</span></li>
        <li>Alegi valuta: <span class="wf-info-badge">credite</span> sau <span class="wf-info-badge">Phoenix Coins</span></li>
      </ul>
      <p>Detalii complete: <a href="/systems/gambling/roulette" style="color:#ff8c00;">Roulette →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum joc la Slots? <span class="wf-info-collapse-badge">!slot</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Scrie <span class="wf-info-badge">!slot</span> în chat pentru a trage de mâner.</p>
      <ul>
        <li>Potrivește <span class="wf-info-highlight">3 simboluri identice</span> pentru câștig</li>
        <li>Jackpot-uri mari cu mize mici</li>
        <li>Alegi suma și valuta la fiecare tragere</li>
      </ul>
      <p>Detalii complete: <a href="/systems/gambling/slots" style="color:#ff8c00;">Slots →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M8 8h.01M16 8h.01M8 16h.01M16 16h.01M12 12h.01"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum joc la Dices (Barbut)? <span class="wf-info-collapse-badge">!dice</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Scrie <span class="wf-info-badge">!dice</span> în chat pentru a arunca zarurile.</p>
      <ul>
        <li>Jocul clasic de <span class="wf-info-highlight">barbut</span> — simplu, rapid, adrenalină pură</li>
        <li>Arunci zarurile și speri la combinația câștigătoare</li>
        <li>Alegi suma și valuta la fiecare rundă</li>
      </ul>
      <p>Detalii complete: <a href="/systems/gambling/dices" style="color:#ff8c00;">Dices →</a></p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 6.0 SHOP & COSMETICE -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Shop & Cosmetice</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
  <span>6.0 Shop & Cosmetice</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce pot cumpăra din shop? <span class="wf-info-collapse-badge">!shop</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Din <span class="wf-info-highlight">!shop</span> poți cumpăra personalizări pentru chat și profil:</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">
        <span class="wf-info-badge">Chat Colors</span>
        <span class="wf-info-badge">Chat Tags</span>
        <span class="wf-info-badge">Name Colors</span>
        <span class="wf-info-badge">Tag Colors</span>
      </div>
      <p>Toate se cumpără cu <span class="wf-info-highlight">credite</span> câștigate pe server.</p>
      <p>Comenzi: <span class="wf-info-badge">!shop</span> <span class="wf-info-badge">!settag</span></p>
      <p>Detalii: <a href="/systems/shop/chat-tags" style="color:#ff8c00;">Chat & Tag-uri →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce sunt efectele vizuale? <span class="wf-info-collapse-badge">Effects</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Efectele vizuale</span> sunt animații cosmetice care se activează pe server.</p>
      <ul>
        <li>Efecte la <span class="wf-info-highlight">kill</span>, <span class="wf-info-highlight">headshot</span> sau <span class="wf-info-highlight">death</span></li>
        <li>Se cumpără din shop cu credite</li>
        <li>Se pot echipa și dezechipa oricând</li>
      </ul>
      <p>Detalii: <a href="/systems/shop/effects" style="color:#ff8c00;">Efecte vizuale →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum funcționează spray-urile?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Spray-urile</span> sunt graffiti-uri pe care le poți aplica pe pereți în joc.</p>
      <ul>
        <li>Se cumpără din <span class="wf-info-highlight">!shop</span></li>
        <li>Multiple design-uri disponibile</li>
        <li>Se aplică cu tasta dedicată (configurabilă)</li>
      </ul>
      <p>Detalii: <a href="/systems/shop/sprays" style="color:#ff8c00;">Spray-uri →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce sunt trail-urile?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Trail-urile</span> sunt efecte vizuale care lasă o urmă în spatele tău când te miști.</p>
      <ul>
        <li>Particule colorate, foc, fum, etc.</li>
        <li>Se cumpără din <span class="wf-info-highlight">!shop</span></li>
        <li>Vizibile pentru toți jucătorii</li>
      </ul>
      <p>Detalii: <a href="/systems/shop/trails" style="color:#ff8c00;">Trail-uri →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce sunt Pins & Badges?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Wildfire Pins & Badges</span> sunt insigne decorative afișate pe profilul tău.</p>
      <ul>
        <li>Se afișează pe <span class="wf-info-highlight">scoreboard</span> și pe profilul de pe site</li>
        <li>Unele sunt exclusive pentru <span class="wf-info-highlight">evenimente</span> sau <span class="wf-info-highlight">Gold Member</span></li>
        <li>Se pot achiziționa din shop sau din premium shop</li>
      </ul>
      <p>Detalii: <a href="/systems/shop/pins" style="color:#ff8c00;">Pins & Badges →</a> · <a href="/market/premium-shop/custom-badge" style="color:#ff8c00;">Custom Badge →</a></p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 7.0 ECONOMIE & MONEDE -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Economie & Monede</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
  <span>7.0 Economie & Monede</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce sunt creditele și cum le câștig?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Creditele</span> sunt moneda principală a serverului.</p>
      <p>Cum faci rost:</p>
      <ul>
        <li>Jucând meciuri — kill-uri, MVP-uri, runde câștigate</li>
        <li><span class="wf-info-highlight">Bonus zilnic</span> de conectare</li>
        <li>Evenimente speciale și Gold Member bonus</li>
        <li>Poți cumpăra pachete de pe <code>wildfire.ro/market</code></li>
      </ul>
      <p>Unde le folosești: <span class="wf-info-badge">!shop</span> <span class="wf-info-badge">!ws</span> <span class="wf-info-badge">gambling</span> <span class="wf-info-badge">cases</span></p>
      <p>Detalii: <a href="/market/credits/pachete_credite" style="color:#ff8c00;">Pachete Credite →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce sunt Phoenix Coins?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Phoenix Coins</span> sunt moneda premium, diferită de credite:</p>
      <ul>
        <li><span class="wf-info-highlight">Credite</span> — se câștigă jucând (kill-uri, MVP-uri, bonus zilnic)</li>
        <li><span class="wf-info-highlight">Phoenix Coins</span> — se obțin din market, evenimente, Gold Member</li>
      </ul>
      <p>Ambele pot fi folosite pentru:</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">
        <span class="wf-info-badge">Cases</span>
        <span class="wf-info-badge">Gambling</span>
        <span class="wf-info-badge">Shop</span>
        <span class="wf-info-badge">Skin-uri</span>
      </div>
      <p>Detalii: <a href="/currency/fire-coins" style="color:#ff8c00;">Phoenix Coins →</a> · <a href="/market/firecoins/pachete" style="color:#ff8c00;">Pachete Fire Coins →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce metode de plată acceptați?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Plățile se procesează securizat prin <code>wildfire.ro/market</code>:</p>
      <ul>
        <li><span class="wf-info-highlight">Card bancar</span> (Visa, Mastercard)</li>
        <li><span class="wf-info-highlight">PayPal</span></li>
        <li><span class="wf-info-highlight">Crypto</span> (Bitcoin, Ethereum)</li>
        <li>Alte metode locale</li>
      </ul>
      <p>Detalii: <a href="/market/payment-methods" style="color:#ff8c00;">Metode de plată →</a></p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 8.0 MARKET & PREMIUM -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Market & Premium</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  <span>8.0 Market & Premium</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M3 21h18M7 21l2-7h6l2 7"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce este Gold Member? <span class="wf-info-collapse-badge">Premium</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Gold Member</span> este statutul premium al serverului:</p>
      <ul>
        <li><span class="wf-info-highlight">Skin-uri exclusive</span> — acces la iteme doar pentru Gold</li>
        <li><span class="wf-info-highlight">Bonus credite</span> — câștiguri mai mari per meci</li>
        <li><span class="wf-info-highlight">Comenzi VIP</span> — funcții extra pe server</li>
        <li><span class="wf-info-highlight">MVP Anthem</span> — personalizarea MVP-ului</li>
        <li><span class="wf-info-highlight">Prioritate</span> — acces la funcții noi</li>
      </ul>
      <p>Se achiziționează de pe <code>wildfire.ro/market</code>.</p>
      <p>Detalii: <a href="/systems/other/gold-member" style="color:#ff8c00;">Gold Member →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce pachete VIP există? <span class="wf-info-collapse-badge">5 tiers</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Avem <span class="wf-info-highlight">5 nivele de VIP</span>, fiecare cu beneficii tot mai mari:</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">
        <span class="wf-info-badge">VIP 1</span>
        <span class="wf-info-badge">VIP 2</span>
        <span class="wf-info-badge">VIP 3</span>
        <span class="wf-info-badge">VIP 4</span>
        <span class="wf-info-badge">VIP 5</span>
      </div>
      <p>Cu cât tier-ul e mai mare, cu atât mai multe beneficii: skin-uri exclusive, credite bonus, comenzi speciale, etc.</p>
      <p>Detalii: <a href="/market/vip/1" style="color:#ff8c00;">VIP 1</a> · <a href="/market/vip/2" style="color:#ff8c00;">VIP 2</a> · <a href="/market/vip/3" style="color:#ff8c00;">VIP 3</a> · <a href="/market/vip/4" style="color:#ff8c00;">VIP 4</a> · <a href="/market/vip/5" style="color:#ff8c00;">VIP 5</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce este MVP Anthem?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">MVP Anthem</span> personalizează animația și melodia de MVP la sfârșitul rundei.</p>
      <ul>
        <li>Toți jucătorii aud melodia ta când ești MVP</li>
        <li>Zeci de melodii disponibile + efect vizual unic</li>
        <li>Disponibil cu Gold Member sau achiziție separată din <a href="/market/premium-shop/mvp" style="color:#ff8c00;">Premium Shop</a></li>
      </ul>
      <p>Detalii sistem: <a href="/systems/other/music-kits" style="color:#ff8c00;">MVP Anthem →</a> · Premium: <a href="/market/premium-shop/mvp" style="color:#ff8c00;">Custom MVP →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce sunt Sank Sounds și Entry Sounds?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Două sisteme de sunete personalizate:</p>
      <ul>
        <li><span class="wf-info-highlight">Sank Sounds</span> — sunete declanșate prin cuvinte-cheie în chat (sute disponibile, Sound of the Day zilnic)</li>
        <li><span class="wf-info-highlight">Entry Sounds</span> — sunet personalizat care se redă când intri pe server</li>
      </ul>
      <p>Detalii: <a href="/market/premium-shop/sanks" style="color:#ff8c00;">Sank Sounds →</a> · <a href="/market/premium-shop/entrysounds" style="color:#ff8c00;">Entry Sounds →</a></p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 9.0 SISTEME SERVER -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Sisteme Server</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  <span>9.0 Sisteme Server</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum funcționează Rank Phases (Grind)?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Sistemul de <span class="wf-info-highlight">Rank Phases</span> funcționează pe baza ELO:</p>
      <ul>
        <li>Câștigi ELO din kill-uri, MVP, runde câștigate</li>
        <li>Pierzi ELO la runde pierdute</li>
        <li>Mai mult ELO = rank mai mare</li>
        <li>Comanda <span class="wf-info-badge">!top</span> arată top-ul jucătorilor</li>
        <li>Leaderboard pe <code>wildfire.ro/leaderboard</code></li>
      </ul>
      <p>Detalii: <a href="/systems/other/rank-phases" style="color:#ff8c00;">Rank Phases →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum funcționează Map Chooser / RTV? <span class="wf-info-collapse-badge">!rtv</span></span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Sistemul de <span class="wf-info-highlight">Map Chooser</span> permite jucătorilor să voteze harta următoare:</p>
      <ul>
        <li><span class="wf-info-badge">!rtv</span> — Rock The Vote — cere schimbarea hărții</li>
        <li>Când suficienți jucători votează, se deschide un vot cu hărți</li>
        <li>Harta cu cele mai multe voturi devine următoarea</li>
      </ul>
      <p>Detalii: <a href="/systems/other/map-chooser" style="color:#ff8c00;">Map Chooser →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum funcționează Teambalance?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Teambalance</span> echilibrează automat echipele pentru meciuri corecte:</p>
      <ul>
        <li>Echipele sunt balanțate pe baza <span class="wf-info-highlight">ELO</span> și <span class="wf-info-highlight">skill-ului</span></li>
        <li>Se activează automat la fiecare meci</li>
        <li>Previne situațiile de 5 buni vs 5 slabi</li>
      </ul>
      <p>Detalii: <a href="/systems/other/teambalance" style="color:#ff8c00;">Teambalance →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h8"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce este Hit Effect?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Hit Effect</span> adaugă efecte vizuale la hit-uri:</p>
      <ul>
        <li>Efect vizual la fiecare <span class="wf-info-highlight">damage</span> dat pe inamic</li>
        <li>Diferite stiluri disponibile</li>
        <li>Se activează/dezactivează din setări</li>
      </ul>
      <p>Detalii: <a href="/systems/other/hit-effect" style="color:#ff8c00;">Hit Effect →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce este AFK Manager?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">AFK Manager</span> gestionează automat jucătorii inactivi:</p>
      <ul>
        <li>După un timp de inactivitate, ești mutat în <span class="wf-info-highlight">spectator</span></li>
        <li>Dacă rămâi inactiv, ești <span class="wf-info-highlight">kick-uit automat</span></li>
        <li>Previne blocarea sloturilor de pe server</li>
      </ul>
      <p>Detalii: <a href="/systems/other/afk-manager" style="color:#ff8c00;">AFK Manager →</a></p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
      </div>
      <span class="wf-info-collapse-title">Ce este Chat Filter?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p><span class="wf-info-highlight">Chat Filter</span> protejează comunitatea automat:</p>
      <ul>
        <li>Filtrează <span class="wf-info-highlight">spam</span>, <span class="wf-info-highlight">reclame</span> și limbaj nepotrivit</li>
        <li>Funcționează automat, fără intervenție admin</li>
        <li>Avertismente și sancțiuni automate pentru recidiviști</li>
      </ul>
      <p>Detalii: <a href="/systems/other/chat-filter" style="color:#ff8c00;">Chat Filter →</a></p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 10.0 REGULAMENTE -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Regulamente</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
  <span>10.0 Regulamente</span>
</div>

<div class="wf-info-collapse">

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
      </div>
      <span class="wf-info-collapse-title">Unde găsesc regulamentul serverului?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Avem <span class="wf-info-highlight">3 regulamente</span> separate:</p>
      <ul>
        <li><a href="/informatii/regulamente/go/regulament-go" style="color:#ff8c00;"><span class="wf-info-highlight">Regulament GO</span></a> — regulile generale ale serverului de joc</li>
        <li><a href="/informatii/regulamente/go/regulament-staff-go" style="color:#ff8c00;"><span class="wf-info-highlight">Regulament STAFF</span></a> — reguli specifice pentru echipa de staff</li>
        <li><a href="/informatii/regulamente/go/regulament-vip-go" style="color:#ff8c00;"><span class="wf-info-highlight">Regulament VIP</span></a> — reguli pentru deținătorii de VIP</li>
      </ul>
      <p>Citirea regulamentului este <span style="color:#ff4444;font-weight:600;">obligatorie</span> înainte de a juca pe server.</p>
    </div>
  </div>

  <div class="wf-info-collapse-item">
    <div class="wf-info-collapse-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('show');">
      <div class="wf-info-collapse-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
      </div>
      <span class="wf-info-collapse-title">Cum pot contribui la documentație?</span>
      <svg class="wf-info-collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="wf-info-collapse-content">
      <p>Documentația Wildfire este open-source și oricine poate contribui:</p>
      <ul>
        <li>Poți sugera modificări, corecta greșeli sau adăuga conținut nou</li>
        <li>Totul se face prin <span class="wf-info-highlight">GitHub</span></li>
      </ul>
      <p>Detalii: <a href="/updates_wiki/contribute" style="color:#ff8c00;">Cum poți contribui →</a> · <a href="/updates_wiki/updateswiki" style="color:#ff8c00;">Changelogs →</a></p>
    </div>
  </div>

</div>

<div class="wf-info-divider"></div>

<!-- ════════════════════════════════════════════════ -->
<!-- 11.0 TOATE COMENZILE -->
<!-- ════════════════════════════════════════════════ -->
### <span style="display:none">Toate Comenzile</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 2v20M17 2v20"/></svg>
  <span>11.0 Toate Comenzile</span>
</div>

<div class="wf-info-grid">

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!help</span> — toate comenzile disponibile</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!panel</span> — link către dashboard</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!ws</span> — meniu skin-uri principal</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!knife</span> — alege cuțitul</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!glove</span> — alege mănușile</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!agent</span> — alege agentul T / CT</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!inventory</span> — inventarul de skin-uri</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!loadout</span> — gestionează loadout-ul</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!rl</span> — joacă roulette</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!slot</span> — joacă la slots</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M8 8h.01M16 16h.01"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!dice</span> — joacă barbut</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!shop</span> — deschide shop-ul</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!settag</span> — setează tag custom</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!top</span> — top jucători</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!rtv</span> — votează schimbarea hărții</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!discord</span> — link Discord</div></div>

<div class="wf-info-card"><div class="wf-info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="wf-info-content"><span class="wf-info-number wf-info-font">!group</span> — link Steam Group</div></div>

</div>

<div class="wf-info-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <span><span class="wf-info-highlight">Toate ticketele sunt tratate confidențial</span> — doar staff-ul are acces.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
      <span>Pentru întrebări urgente în joc, folosește <span class="wf-info-highlight">u@</span> (mesaj către staff).</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Nu deschide ticket dublu pentru aceeași problemă — încetinește procesul.</span>
    </li>
  </ul>
</div>
