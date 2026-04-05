---
outline: deep
---
<CaseHeader 
  title="About us"
  :tags="[
    { text: 'INFO', component: 'PageTagRed' },
    { text: 'ABOUT', component: 'PageTagPurple' },
    { text: 'WILDFIRE', component: 'PageTagOrange' }
  ]"
  :path="['Home', 'Informatii', 'About']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="8"
  icon="/icons/wildfire.webp"
  page-id="about-page"
  wf-info-badge-text="Despre Noi"
  wf-info-badge-icon="lucide:heart"
  :floating-icons="[
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' },
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' },
    { src: '/icons/wildfire.webp', alt: 'wildfire', width: '60px', opacity: '0.3' }
  ]"
/>

<!-- ================================================ -->
<!-- DESPRE WILDFIRE.RO -->
<!-- ================================================ -->

<div class="wf-info-box" style="margin-top: 30px;">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Dacă ești aici pentru prima dată, o să vezi repede despre ce e vorba. <span class="wf-info-highlight wf-info-font">Wildfire.ro</span> este un server comunitar de <span class="wf-info-highlight wf-info-font">Counter-Strike</span> unde am construit totul să meargă fluent: fără lag, fără admini care dispar, fără caterincă proastă.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span>Proiectul a luat naștere în <span class="wf-info-highlight wf-info-font">2021</span> și de atunci tot creștem — nu pentru că țipăm mai tare, ci pentru că lumea chiar se simte bine aici. <span class="wf-info-highlight wf-info-font">Comunitate activă</span>, eventuri în fiecare săptămână.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
      <span>Ghidul ăsta te pune rapid în temă: servere, <span class="wf-info-highlight wf-info-font">economia custom</span>, <span class="wf-info-highlight wf-info-font">rankuri</span>, moduri de joc și unde găsești comunitatea. Citește, intri, vezi cum e.</span>
    </li>
  </ul>
</div>


<div class="wf-info-divider"></div>

### <span style="display:none">Ce servere rulăm</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/></svg>
  <span>Ce servere rulăm</span>
</div>

<div class="wf-info-grid">

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">Competitive</span> Locul perfect pentru a te distra împreună cu prietenii tăi. <span class="wf-info-highlight">go.wildfire.ro</span>
  </div>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  </div>
  <div class="wf-info-content">
    <span class="wf-info-number wf-info-font">Coming soon</span> Și mai multe pe parcurs
  </div>
</div>

</div>

<div class="wf-info-divider"></div>

### <span style="display:none">Sistem economic custom</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
  <span>Sistem economic custom</span>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
  </div>
  <div class="wf-info-content">
    Am construit o economie care chiar contează. Câștigi în funcție de cât tragi, cât joci în echipă, cât de mult participi. Strângi, cumperi, progresezi.
  </div>
</div>

<div class="wf-info-divider"></div>

### <span style="display:none">Rank și progres</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
  <span>Rank și progres</span>
</div>

<div class="wf-info-card">
  <div class="wf-info-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
  </div>
  <div class="wf-info-content">
    Joci, câștigi experiență, urci în rank — totul gândit să aibă sens. Vrei să ajungi sus? Trebuie să joci, nu doar să te conectezi o dată pe lună.
  </div>
</div>

<div class="wf-info-divider"></div>

### <span style="display:none">Comunitatea</span>

<div class="wf-info-title">
  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  <span>Comunitatea</span>
</div>

<div class="wf-info-box">
  <ul>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      <span>Probabil cel mai important: <span class="wf-info-highlight">oamenii</span>. Fără oameni ok, orice server e mort. S-a strâns o comunitate faină, activă, care știe să și joace, dar și să râdă.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <span>Fără toxicitate, fără rasism, fără admini care sar pe tine la orice cuvânt. Doar oameni care vor același lucru: servere bune și distracție.</span>
    </li>
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
      <span>Vrei să faci parte din treaba asta? Intri pe server, bagi câteva runde, vezi tu cum e. Dacă ți se potrivește vibe-ul, rămâi.</span>
    </li>
  </ul>
</div>
