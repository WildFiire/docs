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

<!-- 4.0 COMENZI RAPIDE -->
### <span style="display:none">Comenzi Rapide</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 2v20M17 2v20"/></svg>
  <span>4.0 Comenzi Rapide</span>
</div>

<div class="wf-info-grid">

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">!panel</span> — link către dashboard
  </div>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="2" x2="8" y2="22"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">!help</span> — afișează toate comenzile
  </div>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">!ws</span> — deschide meniul de skin-uri
  </div>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">!discord</span> — link către serverul de Discord
  </div>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">!group</span> — link către Steam group
  </div>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">!shop</span> — deschide shop-ul
  </div>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">!top</span> — afișează top-ul jucătorilor
  </div>
</div>

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
