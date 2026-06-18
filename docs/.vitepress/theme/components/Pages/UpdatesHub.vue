<template>
  <div class="uh-root" :class="{ 'uh-light': !isDark }">

    <!-- FIXED ANIMATED BACKGROUND -->
    <CS2Background :is-dark="isDark" />

    <!-- SIDEBAR FOR NAVBAR -->
    <div class="uh-sidebar-sticky">
      <PanelSidebar
        :collapsed="sidebarCollapsed"
        :current-view="activeTab"
        :is-light-theme="!isDark"
        :custom-nav-groups="sidebarNavGroups"
        brand-name1="WILD"
        brand-name2="FIRE"
        brand-sub="UPDATES HUB"
        @navigate="handleNavigate"
        @action="handleSidebarAction"
      >
        <template #logo>
          <img src="/icons/wildfire.webp" alt="WildFire" width="72" height="72">
        </template>
      </PanelSidebar>
    </div>


    <!-- PAGE CONTENT -->
    <main class="uh-main">
      <div class="uh-ambient" aria-hidden="true">
        <span class="uh-orb uh-orb--fire"></span>
        <span class="uh-orb uh-orb--blue"></span>
      </div>

      <!-- ═══════════════ OVERVIEW DASHBOARD ═══════════════ -->
      <section class="uh-page" :class="{ 'page-active': activeTab === 'overview', 'page-inactive': activeTab !== 'overview' }">
        <div class="uh-wrap uh-wrap--dashboard">
          
          <!-- TOP METRICS ROW -->
          <div class="uh-dash-metrics">
            <div class="uh-hp-stat-card">
              <div class="uh-hp-stat-icon" style="color:var(--PUR); background:var(--PUS)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div class="uh-hp-stat-info">
                <div class="uh-hp-stat-val orbitron-font">v3.0.0</div>
                <div class="uh-hp-stat-lbl">Current Version</div>
              </div>
            </div>
            
            <div class="uh-hp-stat-card uh-hp-stat-card--commits">
              <div class="uh-hp-stat-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg></div>
              <div class="uh-hp-stat-info">
                <div class="uh-hp-stat-val orbitron-font">100+</div>
                <div class="uh-hp-stat-lbl">Commits Synced</div>
              </div>
            </div>

            <div class="uh-hp-stat-card uh-hp-stat-card--live">
              <div class="uh-hp-stat-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
              <div class="uh-hp-stat-info">
                <div class="uh-hp-stat-val orbitron-font uh-hp-stat-val--live">LIVE</div>
                <div class="uh-hp-stat-lbl">System Status</div>
              </div>
            </div>

            <div class="uh-hp-stat-card">
              <div class="uh-hp-stat-icon" style="color:var(--BLU); background:var(--BLS)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
              <div class="uh-hp-stat-info">
                <div class="uh-hp-stat-val orbitron-font">{{ isLoadingContributors ? '...' : githubContributors.length + '+' }}</div>
                <div class="uh-hp-stat-lbl">Active Contributors</div>
              </div>
            </div>
          </div>

          <!-- DASHBOARD GRID -->
          <div class="uh-dashboard-grid">
            
            <!-- HERO WIDGET (Span 8) -->
            <div class="uh-dash-widget uh-widget-span-8 uh-hero-premium" style="display:flex; flex-direction:column; justify-content:center; align-items:flex-start; margin-bottom:0; min-height:100%; padding:48px 44px;">
              <div class="uh-hp-border-glow" aria-hidden="true"></div>
              <div class="uh-hp-bg-glow"></div>
              <div class="uh-hp-bg-grid"></div>
              <span class="uh-hp-watermark orbitron-font" aria-hidden="true" style="right:-30px;">HUB</span>

              <div class="uh-hp-content" style="width:100%;">
                <div class="uh-hp-badge">
                  <span class="uh-hp-badge-dot"></span>
                  v3.0.0 is now live
                </div>

                <h1 class="uh-hp-title orbitron-font">
                  The next generation of<br/>
                  <span class="uh-hp-brand"><span class="uh-hp-wild">Wild</span><span class="uh-hp-fire">Fire</span></span>
                  <span class="uh-hp-docs"> Docs</span>
                </h1>

                <p class="uh-hp-subtitle" style="margin-bottom: 28px; max-width: 85%;">
                  A complete rebuild focused on performance, premium design systems, and real-time GitHub integrations — everything you need, faster than ever.
                </p>

                <div class="uh-hp-actions">
                  <a href="/hub/changelogs" class="uh-hp-btn-primary">
                    Explore Changelogs
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                  <a href="/hub/versions" class="uh-hp-btn-secondary">Version History</a>
                </div>
              </div>
            </div>

            <!-- QUICK LINKS WIDGET (Span 4) -->
            <div class="uh-dash-widget uh-widget-span-4 uh-widget-glass">
              <div class="uh-widget-header">
                <div class="uh-section-label uh-section-label--left">
                  <span class="uh-section-label__line"></span>
                  <span class="uh-section-label__text orbitron-font">EXPLORE</span>
                </div>
                <h3 class="orbitron-font">Quick Links</h3>
              </div>
              <div class="uh-dash-quick-links">
                <a v-for="item in quickNavItems" :key="item.id" :href="item.link" class="uh-dash-ql-item" :class="'uh-dash-ql--' + item.accent">
                  <div class="uh-dash-ql-icon" v-html="item.icon"></div>
                  <div class="uh-dash-ql-text">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.desc }}</p>
                  </div>
                  <svg class="uh-dash-ql-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>

            <!-- HIGHLIGHTS WIDGET (Span 6) -->
            <div class="uh-dash-widget uh-widget-span-6 uh-widget-glass">
              <div class="uh-widget-header">
                <div class="uh-section-label uh-section-label--left">
                  <span class="uh-section-label__line"></span>
                  <span class="uh-section-label__text orbitron-font">v3.0.0 HIGHLIGHTS</span>
                </div>
                <h3 class="orbitron-font">What's New</h3>
              </div>
              <div class="uh-dash-highlights">
                <div v-for="h in v3Highlights" :key="h.text" class="uh-dash-hl-item" :class="'uh-dash-hl--' + h.type">
                  <div class="uh-dash-hl-icon" :class="'hi-' + h.type">
                    <svg v-if="h.type === 'feat'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    <svg v-else-if="h.type === 'fix'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <div class="uh-dash-hl-text">{{ h.text }}</div>
                  <span class="uh-hl-tag-clean">{{ h.type }}</span>
                </div>
              </div>
            </div>

            <!-- COMMUNITY WIDGET (Span 6) -->
            <div class="uh-dash-widget uh-widget-span-6 uh-widget-glass" style="display:flex; flex-direction:column;">
              <div class="uh-widget-header" style="margin-bottom: 20px;">
                <div class="uh-section-label uh-section-label--left">
                  <span class="uh-section-label__line"></span>
                  <span class="uh-section-label__text orbitron-font">COMMUNITY</span>
                </div>
                <h3 class="orbitron-font">Top Contributors</h3>
              </div>
              <div class="uh-dash-contribs" style="flex:1;">
                <a v-for="c in githubContributors.slice(0, 8)" :key="c.login" :href="c.html_url" target="_blank" rel="noopener noreferrer" class="uh-dash-contrib-card">
                  <img :src="c.avatar_url + (c.avatar_url.includes('?') ? '&' : '?') + 's=60'" :alt="c.login" class="uh-dash-cc-avatar">
                  <div class="uh-dash-cc-info">
                    <span class="uh-dash-cc-name">@{{ c.login }}</span>
                    <span class="uh-dash-cc-commits" v-if="c.contributions">{{ c.contributions }} commits</span>
                  </div>
                </a>
                <div v-if="!githubContributors.length" class="uh-contrib-live-loading">Loading...</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ═══════════════ CHANGELOGS ═══════════════ -->
      <section class="uh-page" :class="{ 'page-active': activeTab === 'changelogs', 'page-inactive': activeTab !== 'changelogs' }">
        <div class="uh-wrap uh-wrap--dashboard">
          <div class="uh-dashboard-grid">
            <div class="uh-dash-widget uh-widget-span-12 uh-widget-glass" style="padding: 32px 40px;">
              <div class="uh-section-head" style="margin-bottom: 24px; border-bottom: none; padding-bottom: 0;">
                <div class="uh-section-head-left">
                  <div class="uh-section-icon orange">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>
                  </div>
                  <div>
                    <div class="uh-section-label uh-section-label--left">
                      <span class="uh-section-label__line"></span>
                      <span class="uh-section-label__text orbitron-font">LIVE FEED</span>
                    </div>
                    <h2 class="uh-section-title orbitron-font" style="margin-bottom:4px;">Commit <span class="uh-accent">Changelog</span></h2>
                    <p class="uh-section-sub">WildFiire/docs · main · real-time GitHub feed</p>
                  </div>
                </div>
                <a href="https://github.com/WildFiire/docs/commits/main" target="_blank" rel="noopener noreferrer" class="uh-btn uh-btn-glass uh-btn-sm">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  Open GitHub
                </a>
              </div>
              <div class="uh-changelogs-frame" style="box-shadow:none; border:none; padding:0; background:transparent; backdrop-filter:none;">
                <Changelogs />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════ VERSIONS (MASTER-DETAIL DASHBOARD) ═══════════════ -->
      <section class="uh-page" :class="{ 'page-active': activeTab === 'versions', 'page-inactive': activeTab !== 'versions' }">
        <div class="uh-wrap uh-wrap--dashboard">
          
          <div class="uh-dashboard-grid">
            <div class="uh-dash-widget uh-widget-span-12 uh-widget-glass" style="padding: 32px 40px;">
              
              <!-- HEADER -->
              <div class="uh-section-head" style="margin-bottom: 32px; border-bottom: 1px solid var(--BD); padding-bottom: 24px;">
                <div class="uh-section-head-left">
                  <div class="uh-section-icon purple">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <div class="uh-section-label uh-section-label--left">
                      <span class="uh-section-label__line"></span>
                      <span class="uh-section-label__text orbitron-font">RELEASES</span>
                    </div>
                    <h2 class="uh-section-title orbitron-font" style="margin-bottom:4px;">Version <span class="uh-accent">History</span></h2>
                    <p class="uh-section-sub">Explorati istoricul complet al lansarilor.</p>
                  </div>
                </div>
              </div>

              <!-- SPLIT DASHBOARD -->
              <div class="uh-versions-split" style="display: grid; grid-template-columns: 320px 1fr; gap: 40px;">
                
                <!-- LEFT NAVIGATION -->
                <div class="uh-versions-left" style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
                  <button
                    v-for="(ver, idx) in versions"
                    :key="ver.tag"
                    class="uh-vnav-btn"
                    :class="{ 'active': selectedVersion === ver.tag }"
                    @click="selectedVersion = ver.tag"
                  >
                    <div class="uh-vnav-icon" :class="'vnav-' + ver.typeColor" v-html="ver.icon"></div>
                    <div class="uh-vnav-info">
                      <span class="uh-vnav-tag orbitron-font">{{ ver.tag }}</span>
                      <span class="uh-vnav-date" style="font-family: var(--vp-font-family-base);">{{ ver.date }}</span>
                    </div>
                    <div v-if="idx === 0" class="uh-vnav-badge">LATEST</div>
                  </button>
                </div>

                <!-- RIGHT DETAILS -->
                <div class="uh-versions-right" style="background: rgba(0,0,0,0.15); border: 1px solid var(--BD); border-radius: 20px; padding: 32px; min-height: 500px;">
                  <transition name="uh-fade" mode="out-in">
                    <div :key="selectedVersion" class="uh-version-details" v-if="activeVersionData">
                      
                      <div class="uh-vd-header">
                        <div class="uh-vd-tag-row">
                          <span class="uh-vnav-tag orbitron-font" style="font-size:22px; color:var(--T1);">{{ activeVersionData.tag }}</span>
                          <span class="uh-chip" :class="'uh-chip-' + activeVersionData.typeColor">{{ activeVersionData.typeLabel }}</span>
                        </div>
                        <h3 class="uh-vd-title" style="font-family: var(--vp-font-family-base); font-size: 20px; font-weight: 600; color: var(--T1); margin: 0 0 20px; line-height: 1.4;">
                          {{ activeVersionData.title }}
                        </h3>
                        <div class="uh-vd-meta" style="font-family: var(--vp-font-family-base);">
                          <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" style="margin-right:6px; vertical-align:middle;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{{ activeVersionData.date }}</span>
                          <span class="uh-vd-dot"></span>
                          <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" style="margin-right:6px; vertical-align:middle;"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>{{ activeVersionData.commitCount }} commits</span>
                        </div>
                      </div>

                      <div class="uh-vd-body">
                        <div class="uh-vd-grid">
                          <!-- Left Col -->
                          <div class="uh-vd-col">
                            <div v-if="activeVersionData.highlights?.length">
                              <div class="uh-tl-col-label"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Highlights</div>
                              <ul class="uh-tl-hl-list">
                                <li v-for="h in activeVersionData.highlights" :key="h.text">
                                  <span class="uh-dot" :class="'d-' + h.type"></span>
                                  <span>{{ h.text }}</span>
                                  <span class="uh-hl-tag" :class="'t-' + h.type">{{ h.type }}</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div v-if="activeVersionData.fixes?.length" style="margin-top:28px;">
                              <div class="uh-tl-col-label"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Bug Fixes</div>
                              <ul class="uh-fix-list">
                                <li v-for="f in activeVersionData.fixes" :key="f">
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg> {{ f }}
                                </li>
                              </ul>
                            </div>
                          </div>

                          <!-- Right Col -->
                          <div class="uh-vd-col">
                            <div v-if="activeVersionData.features?.length">
                              <div class="uh-tl-col-label"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Core Features</div>
                              <div class="uh-feat-chips">
                                <span v-for="f in activeVersionData.features" :key="f" class="uh-feat-chip" style="font-family: var(--vp-font-family-base);">{{ f }}</span>
                              </div>
                            </div>

                            <div v-if="activeVersionData.contributors?.length" style="margin-top:28px;">
                              <div class="uh-tl-col-label"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Top Contributors</div>
                              <div class="uh-avatars" style="display:flex; flex-wrap:wrap; gap:10px;">
                                <a v-for="c in activeVersionData.contributors" :key="c" :href="`https://github.com/${c}`" target="_blank" class="uh-hp-contrib-badge" style="background:var(--CARD); border:1px solid var(--BD); padding:4px 10px 4px 4px; border-radius:30px; display:flex; align-items:center; gap:8px;">
                                  <img :src="`https://github.com/${c}.png?size=40`" :alt="c" loading="lazy" class="uh-hp-cb-avatar" style="width:24px; height:24px; border-radius:50%;">
                                  <span class="uh-hp-cb-name" style="font-size:12px; font-weight:600; color:var(--T2);">@{{ c }}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════ CONTRIBUTE ═══════════════ -->
      <section class="uh-page" :class="{ 'page-active': activeTab === 'contribute', 'page-inactive': activeTab !== 'contribute' }">
        <div class="uh-wrap uh-wrap--dashboard">
          <div class="uh-dashboard-grid">

            <!-- Hero Span 12 -->
            <div class="uh-dash-widget uh-widget-span-12 uh-hero-premium uh-intro-premium" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding: 64px 40px;">
              <div class="uh-hp-border-glow uh-hp-border-glow--blue" aria-hidden="true"></div>
              <div class="uh-hp-bg-glow uh-hp-bg-glow--blue"></div>
              <div class="uh-hp-bg-grid"></div>
              <span class="uh-hp-watermark orbitron-font" aria-hidden="true">OSS</span>
              <div class="uh-hp-content uh-hp-content--center" style="width:100%;">
                <div class="uh-section-icon blue uh-intro-icon" style="margin: 0 auto 24px;">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div class="uh-section-label" style="justify-content:center; margin-bottom:12px;">
                  <span class="uh-section-label__line"></span>
                  <span class="uh-section-label__text orbitron-font">OPEN SOURCE</span>
                  <span class="uh-section-label__line"></span>
                </div>
                <h3 class="uh-hp-title orbitron-font uh-intro-title">De ce sa contribui?</h3>
                <p class="uh-hp-subtitle uh-intro-sub" style="margin: 0 auto 24px;">
                  Wildfire.ro e construit de <strong>oameni ca tine</strong>. Fie ca ai idei, gasesti bug-uri sau vrei sa scrii cod — orice contributie conteaza.
                </p>
                <a href="https://github.com/WildFiire/docs" target="_blank" rel="noopener noreferrer" class="uh-btn uh-btn-fire" style="margin: 0 auto;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  Fork pe GitHub
                </a>
              </div>
            </div>

            <!-- Role-uri Span 12 -->
            <div class="uh-dash-widget uh-widget-span-12">
              <div class="uh-section-label uh-section-label--left">
                <span class="uh-section-label__line"></span>
                <span class="uh-section-label__text orbitron-font">ROLE-URI ACTIVE</span>
              </div>
              <div class="uh-contrib-row" style="margin-top:16px;">
                <div class="uh-hp-stat-card uh-contrib-glass-card" v-for="c in contributeCards" :key="c.title" style="min-height:100%;">
                  <div class="uh-cc-ico" v-html="c.icon"></div>
                  <h4 class="orbitron-font">{{ c.title }}</h4>
                  <p>{{ c.desc }}</p>
                  <ul>
                    <li v-for="it in c.items" :key="it">
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                      {{ it }}
                    </li>
                  </ul>
                  <span class="uh-cc-badge">{{ c.badge }}</span>
                </div>
              </div>
            </div>

            <!-- Cum Incepi Span 6 -->
            <div class="uh-dash-widget uh-widget-span-6 uh-widget-glass">
              <div class="uh-widget-header">
                <div class="uh-section-label uh-section-label--left">
                  <span class="uh-section-label__line"></span>
                  <span class="uh-section-label__text orbitron-font">CUM INCEPI</span>
                </div>
                <h3 class="orbitron-font">Pasi Simpli</h3>
              </div>
              <div class="uh-steps-premium">
                <div class="uh-sp-step" v-for="s in steps" :key="s.num">
                  <div class="uh-sp-num-wrap">
                    <div class="uh-sp-num">{{ s.num }}</div>
                    <div class="uh-sp-line" v-if="s.num < 4"></div>
                  </div>
                  <div class="uh-sp-content">
                    <h4>{{ s.title }}</h4>
                    <p>{{ s.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- FAQ Span 6 -->
            <div class="uh-dash-widget uh-widget-span-6 uh-widget-glass">
              <div class="uh-widget-header">
                <div class="uh-section-label uh-section-label--left">
                  <span class="uh-section-label__line"></span>
                  <span class="uh-section-label__text orbitron-font">FAQ</span>
                </div>
                <h3 class="orbitron-font">Intrebari Frecvente</h3>
              </div>
              <div class="uh-faq">
                <div
                  v-for="faq in faqs"
                  :key="faq.q"
                  class="uh-faq-item uh-faq-premium"
                  :class="{ open: openFaq === faq.q }"
                  @click="openFaq = openFaq === faq.q ? null : faq.q"
                >
                  <div class="uh-faq-q">
                    <span>{{ faq.q }}</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" class="uh-faq-chevron"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                  <transition name="uh-slide">
                    <div v-if="openFaq === faq.q" class="uh-faq-a">{{ faq.a }}</div>
                  </transition>
                </div>
              </div>
              
              <!-- Live Contributors Embed -->
              <div class="uh-widget-header" style="margin-top:40px;">
                <div class="uh-section-label uh-section-label--left">
                  <span class="uh-section-label__line"></span>
                  <span class="uh-section-label__text orbitron-font">OUR CONTRIBUTORS</span>
                </div>
              </div>
              <div class="uh-dash-contribs" v-if="!isLoadingContributors && githubContributors.length">
                <a v-for="c in githubContributors.slice(0, 4)" :key="c.login" :href="c.html_url" target="_blank" class="uh-dash-contrib-card">
                  <img :src="c.avatar_url + (c.avatar_url.includes('?') ? '&' : '?') + 's=60'" :alt="c.login" class="uh-dash-cc-avatar" />
                  <div class="uh-dash-cc-info">
                    <span class="uh-dash-cc-name">@{{ c.login }}</span>
                    <span class="uh-dash-cc-commits">{{ c.contributions }} commits</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Final CTA Span 12 -->
            <div class="uh-dash-widget uh-widget-span-12">
              <div class="uh-final-cta" style="margin-top:0;">
                <div class="uh-final-cta-glow"></div>
                <div class="uh-final-cta-inner">
                  <div class="uh-section-label" style="justify-content:center;">
                    <span class="uh-section-label__line"></span>
                    <span class="uh-section-label__text orbitron-font">JOIN US</span>
                    <span class="uh-section-label__line"></span>
                  </div>
                  <h3 class="orbitron-font">Gata sa contribui?</h3>
                  <p>Deschide un Pull Request pe GitHub sau discuta ideile pe Discord.</p>
                  <div class="uh-cta-btns">
                    <a href="https://github.com/WildFiire/docs" target="_blank" class="uh-btn uh-btn-fire">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                      GitHub Repo
                    </a>
                    <a href="https://discord.gg/Knu76DhE9h" target="_blank" class="uh-btn uh-btn-discord">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                      Discord
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vitepress'
import CS2Background from '../Home/CS2Background.vue'

export default {
  name: 'UpdatesHub',
  components: { CS2Background },

  setup() {
    const route = useRoute()
    const router = useRouter()
    return { route, router }
  },

  computed: {
    heroVer() { return this.versions[0] },
    activeVersionData() {
      return this.versions.find(v => v.tag === this.selectedVersion) || this.versions[0]
    },
    githubToken() {
      if (typeof window === 'undefined') return import.meta.env.VITE_GITHUB_TOKEN
      return window.__GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN
    },

    quickNavItems() {
      return [
        {
          id: 'changelogs',
          link: '/hub/changelogs',
          num: '01',
          title: 'Commit Changelog',
          desc: 'Live GitHub feed — tracking every commit in real-time.',
          accent: 'orange',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>',
        },
        {
          id: 'versions',
          link: '/hub/versions',
          num: '02',
          title: 'Version History',
          desc: 'Curated major releases, highlights, and bugfixes.',
          accent: 'purple',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        },
        {
          id: 'contribute',
          link: '/hub/contribute',
          num: '03',
          title: 'Contribute',
          desc: 'Join the open source effort to improve the documentation.',
          accent: 'blue',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        },
      ]
    },

    activeTab() {
      if (!this.route) return 'overview'
      const p = this.route.path
      if (p.includes('/changelogs')) return 'changelogs'
      if (p.includes('/versions')) return 'versions'
      if (p.includes('/contribute')) return 'contribute'
      return 'overview'
    },

    sidebarNavGroups() {
      return [
        {
          label: 'Updates Hub',
          items: this.tabs.map(t => {
            let link = '/hub/'
            if (t.id === 'changelogs') link = '/hub/changelogs'
            if (t.id === 'versions') link = '/hub/versions'
            if (t.id === 'contribute') link = '/hub/contribute'
            
            return {
              id: t.id,
              label: t.label,
              badge: t.badge,
              link: link,
              icon: t.icon.replace('width="13"', 'width="17"').replace('height="13"', 'height="17"').replace('stroke="currentColor"', 'stroke="currentColor" stroke-width="1.8"')
            }
          })
        }
      ]
    }
  },

  data() {
    return {
      isDark: true,
      sidebarCollapsed: false,
      expandAllVersions: false,
      openVersions: { 'v3.0.0': true },
      selectedVersion: 'v3.0.0',
      openFaq: null,

      tabs: [
        { id: 'overview',   label: 'Overview',   badge: '',     icon: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>' },
        { id: 'changelogs', label: 'Changelogs', badge: 'LIVE', icon: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>' },
        { id: 'versions',   label: 'Versions',   badge: '',     icon: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        { id: 'contribute', label: 'Contribuie', badge: '',     icon: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
      ],

      githubContributors: [],
      isLoadingContributors: true,

      heroStats: [
        { val: 'v3.0.0', label: 'Version' },
        { val: '100+',   label: 'Commits' },
        { val: '4+',     label: 'Contributors' },
        { val: 'LIVE',   label: 'Status' },
      ],

      v3Highlights: [
        { type: 'feat', text: 'Glassmorphism design system cu dark & light mode complet' },
        { type: 'feat', text: 'Live GitHub commit feed — changelog in timp real' },
        { type: 'feat', text: 'Panel interactiv cu team management si analytics' },
        { type: 'feat', text: 'Smooth scroll via Lenis cu micro-animatii' },
        { type: 'feat', text: 'Sidebar avansat cu collapse, floating controls, new badges' },
        { type: 'feat', text: 'Updates Hub — pagina standalone completa' },
        { type: 'fix',  text: 'Horizontal scroll lock in time-selection drag' },
        { type: 'docs', text: 'Toate paginile rebuilt cu CaseHeader + content blocks' },
      ],

      versions: [
        {
          tag: 'v3.0.0', type: 'major', typeLabel: 'Major', typeColor: 'orange',
          title: 'Rebuilt from scratch — New design system, live GitHub integration, VitePress 3',
          date: 'May 2026', commitCount: '100+',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/></svg>',
          highlights: [
            { type: 'feat', text: 'Glassmorphism design system' },
            { type: 'feat', text: 'Live GitHub commit feed' },
            { type: 'feat', text: 'Interactive Panel Dashboard' },
            { type: 'fix',  text: 'Horizontal scroll lock fix' },
            { type: 'docs', text: 'CaseHeader pe toate paginile' },
          ],
          features: ['Changelogs Live', 'Team Manager', 'Panel Dashboard', 'GitHub Auth', 'Lenis Scroll', 'FluidLightbox', 'Updates Hub', 'VIP Comparison'],
          fixes: ['Fixed horizontal shift during selection', 'Fixed Lenis bounds recalculation', 'Fixed GitHub API rate-limit handling'],
          contributors: ['iannc69', 'WildFiire'],
        },
        {
          tag: 'v2.0.0', type: 'major', typeLabel: 'Major', typeColor: 'purple',
          title: 'Component overhaul — First structured VitePress setup with custom theme',
          date: 'Late 2025', commitCount: '60+',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
          highlights: [
            { type: 'feat', text: 'Custom VitePress theme cu dark mode' },
            { type: 'feat', text: 'CaseHeader component introdus' },
            { type: 'fix',  text: 'Sidebar rendering glitches resolved' },
          ],
          features: ['Custom Theme', 'CaseHeader', 'Dark Mode', 'PageTag'],
          fixes: ['Sidebar collapse state fix', 'Mobile nav overflow fix'],
          contributors: ['iannc69'],
        },
        {
          tag: 'v1.0.0', type: 'major', typeLabel: 'Major', typeColor: 'green',
          title: 'Initial launch — Prima versiune publica a documentatiei Wildfire.ro',
          date: '2025', commitCount: '20+',
          icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
          highlights: [
            { type: 'feat', text: 'Prima versiune publica' },
            { type: 'docs', text: 'Pagini initiale: About, FAQ, VIP' },
          ],
          features: ['VitePress Core', 'About', 'FAQ', 'VIP Info', 'Rules'],
          fixes: [],
          contributors: ['iannc69'],
        },
      ],

      contributeCards: [
        {
          title: 'Developer',
          icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
          desc: 'Contribuie la codul sursa al documentatiei.',
          items: ['Bugfix-uri si imbunatatiri', 'Componente Vue noi', 'Optimizari performanta'],
          badge: 'cod',
        },
        {
          title: 'Content Writer',
          icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
          desc: 'Scrie sau imbunatateste documentatia existenta.',
          items: ['Ghiduri noi', 'Corectii si clarificari', 'Exemple si tutoriale'],
          badge: 'docs',
        },
        {
          title: 'Reporter',
          icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
          desc: 'Raporteaza bug-uri sau sugereaza imbunatatiri.',
          items: ['Bug reports detaliate', 'Feature requests', 'Feedback UX/UI'],
          badge: 'issues',
        },
      ],

      steps: [
        { num: 1, title: 'Fork Repository', desc: 'Fork WildFiire/docs pe GitHub si cloneaza local.' },
        { num: 2, title: 'Instaleaza', desc: 'npm install + npm run docs:dev pentru server local.' },
        { num: 3, title: 'Fa modificarile', desc: 'Editeaza .md, .vue sau CSS — vezi totul live instant.' },
        { num: 4, title: 'Pull Request', desc: 'Trimite un PR cu descriere clara — va fi reviewuit rapid.' },
      ],

      faqs: [
        { q: 'Trebuie sa fiu programator?', a: 'Nu! Poti contribui cu documentatie, traduceri sau bug reports fara nicio cunostinta de cod.' },
        { q: 'Cum raportez un bug?', a: 'Deschide un Issue pe GitHub cu titlul "Bug: [descriere]" si descrie pasii pentru a reproduce.' },
        { q: 'Cat dureaza review-ul unui PR?', a: 'De obicei 1-3 zile. Daca ai nevoie urgenta, mentioneaza in PR sau contacteaza-ne pe Discord.' },
        { q: 'Primesc credit pentru contributii?', a: 'Da! Toti contribuitorii apar in Contributors si in istoricul commit-urilor GitHub.' },
      ],
    }
  },

  mounted() {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('vitepress-theme') || localStorage.getItem('wf-theme')
      this.isDark = stored !== 'light'
    } catch {}
    this.applyTheme()
    this.fetchGitHubContributors()
  },

  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    async fetchGitHubContributors() {
      try {
        const headers = { 'Accept': 'application/vnd.github.v3+json' }
        if (this.githubToken) {
          headers['Authorization'] = `token ${this.githubToken}`
        }
        const res = await fetch('https://api.github.com/repos/WildFiire/docs/contributors', { headers })
        if (res.ok) {
          const data = await res.json()
          this.githubContributors = data.map(c => ({
            login: c.login,
            avatar_url: c.avatar_url,
            html_url: c.html_url,
            contributions: c.contributions
          }))
        } else {
          // Fallback to mock data if API limit exceeded or fails
          this.githubContributors = [
            { login: 'iannc69', avatar_url: 'https://github.com/iannc69.png?v=4', html_url: 'https://github.com/iannc69', contributions: 120 },
            { login: 'WildFiire', avatar_url: 'https://github.com/WildFiire.png?v=4', html_url: 'https://github.com/WildFiire', contributions: 10 }
          ]
        }
      } catch (err) {
        console.error('Failed to fetch github contributors:', err)
        this.githubContributors = [
          { login: 'iannc69', avatar_url: 'https://github.com/iannc69.png?v=4', html_url: 'https://github.com/iannc69', contributions: 120 },
          { login: 'WildFiire', avatar_url: 'https://github.com/WildFiire.png?v=4', html_url: 'https://github.com/WildFiire', contributions: 10 }
        ]
      } finally {
        this.isLoadingContributors = false
      }
    },

    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      try { localStorage.setItem('vitepress-theme', this.isDark ? 'dark' : 'light') } catch {}
    },

    applyTheme() {
      if (typeof document === 'undefined') return
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    handleNavigate(id) {
      // Handled natively by anchor tags in Sidebar now
    },

    handleSidebarAction(action) {
      if (action === 'toggle-collapse') {
        this.sidebarCollapsed = !this.sidebarCollapsed;
      } else if (action === 'theme') {
        this.toggleTheme();
      }
    },

    setTab(id) {
      const paths = {
        overview: '/hub/',
        changelogs: '/hub/changelogs',
        versions: '/hub/versions',
        contribute: '/hub/contribute',
      }
      const path = paths[id]
      if (path && this.router) this.router.go(path)
    },

    toggleVer(tag) {
      this.openVersions = { ...this.openVersions, [tag]: !this.openVersions[tag] }
    },
  }
}
</script>

<style>
/* ================================================================
   UPDATES HUB — STANDALONE FULL PAGE
   layout: false — no VitePress navbar/sidebar
   ================================================================ */

/* ── Root ── */
.uh-root {
  --P: #ff7800;
  --Pg: rgba(255,120,0,0.25);
  --Ps: rgba(255,120,0,0.12);
  --Px: rgba(255,120,0,0.06);
  --Pa: rgba(255,120,0,0.22);

  --BG:    #050507;
  --CARD:  rgba(10, 10, 16, 0.65);
  --SURF:  rgba(16, 16, 24, 0.55);
  --INPUT: rgba(22, 22, 30, 0.7);
  --GLASS: rgba(255,255,255,0.02);

  --T1: #f4f4fa;
  --T2: #b4b4c8;
  --T3: #6a6a80;

  --BD:  rgba(255,255,255,0.07);
  --BDA: rgba(255,120,0,0.28);

  --GRN: #34c759; --GRS: rgba(52,199,89,0.14);
  --RED: #ff3b30; --RDS: rgba(255,59,48,0.14);
  --BLU: #007aff; --BLS: rgba(0,122,255,0.14);
  --PUR: #af52de; --PUS: rgba(175,82,222,0.14);

  --NAV: 56px;
  --WRAP: 1040px;
  --R: 14px;

  display: flex;
  min-height: 100vh;
  color: var(--T1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.orbitron-font {
  font-family: 'Orbitron', sans-serif !important;
  letter-spacing: 0.3px;
}

.uh-accent { color: var(--P); }

.uh-root.uh-light {
  --BG:   #f0f0f6;
  --CARD: rgba(255,255,255,0.94);
  --SURF: rgba(244,244,250,0.85);
  --GLASS: rgba(0,0,0,0.02);
  --T1:   #101018;
  --T2:   #3a3a4a;
  --T3:   #7a7a8a;
  --BD:   rgba(0,0,0,0.08);
}
/* ── Main ── */
.uh-sidebar-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
}

.uh-main {
  flex: 1;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.uh-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.uh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  animation: uh-float 12s ease-in-out infinite alternate;
}

@keyframes uh-float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.05); }
  100% { transform: translate(-20px, 20px) scale(0.95); }
}

.uh-orb--fire {
  width: 420px;
  height: 420px;
  top: -80px;
  right: -60px;
  background: radial-gradient(circle, rgba(255,120,0,0.35), transparent 70%);
  animation-duration: 14s;
}

.uh-orb--blue {
  width: 360px;
  height: 360px;
  bottom: 10%;
  left: -80px;
  background: radial-gradient(circle, rgba(0,122,255,0.18), transparent 70%);
  animation-duration: 18s;
  animation-direction: alternate-reverse;
}

.uh-page {
  min-height: 100%;
  position: relative;
  z-index: 1;
}

.uh-wrap {
  max-width: var(--WRAP);
  margin: 0 auto;
  padding: 44px 28px 88px;
}

/* Section labels (Wildfire brand) */
.uh-section-label {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.uh-section-label--left { justify-content: flex-start; }
.uh-section-label--spaced { margin-top: 48px; }

.uh-section-label__line {
  width: 32px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--P));
  flex-shrink: 0;
}

.uh-section-label__line:last-child {
  background: linear-gradient(90deg, var(--P), transparent);
}

.uh-section-label__text {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3.5px;
  color: var(--P);
  text-transform: uppercase;
  white-space: nowrap;
}

.uh-section-title {
  font-size: clamp(20px, 2.5vw, 26px);
  font-weight: 700;
  color: var(--T1);
  margin: 0 0 24px;
  letter-spacing: 0.3px;
}

/* ── Buttons ── */
.uh-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px; border-radius: 40px;
  font-size: 13px; font-weight: 700;
  text-decoration: none; border: none; cursor: pointer;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden;
}
.uh-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.uh-btn:hover::after { transform: translateX(100%); }
.uh-btn-fire { background: linear-gradient(135deg, var(--P), #d95c00); color: white; box-shadow: 0 4px 16px rgba(255,120,0,0.3); }
.uh-btn-fire:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 24px rgba(255,120,0,0.45); }
.uh-btn-glass { background: var(--CARD); border: 1px solid var(--BD); color: var(--T2); }
.uh-btn-glass:hover { border-color: var(--BDA); color: var(--P); transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.uh-btn-discord { background: #5865f2; color: white; box-shadow: 0 4px 16px rgba(88,101,242,0.3); }
.uh-btn-discord:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 24px rgba(88,101,242,0.45); }
.uh-btn-sm { padding: 6px 14px; font-size: 12px; }
.uh-btn svg { stroke: currentColor; flex-shrink: 0; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.uh-btn:hover svg { transform: scale(1.1); }
.uh-btn-fire svg, .uh-btn-discord svg { stroke: white; }
.uh-btn-discord svg { fill: white; stroke: none; }

/* ── Chips ── */
.uh-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 20px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em;
}
.uh-chip-orange { background: var(--Ps); border: 1px solid var(--BDA); color: var(--P); }
.uh-chip-green  { background: var(--GRS); border: 1px solid rgba(52,199,89,0.3); color: var(--GRN); }
.uh-chip-muted  { background: var(--SURF); border: 1px solid var(--BD); color: var(--T3); }
.uh-chip-purple { background: var(--PUS); border: 1px solid rgba(175,82,222,0.3); color: var(--PUR); }
.uh-chip-blue   { background: var(--BLS); border: 1px solid rgba(0,122,255,0.3); color: var(--BLU); }

.uh-blink-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--GRN);
  animation: uh-badge-pulse 1.8s ease infinite; display: inline-block;
}
@keyframes uh-badge-pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.5; transform:scale(0.75); }
}

/* Premium Hero */
.uh-hero-premium {
  position: relative;
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 24px;
  padding: 44px;
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 36px;
  align-items: center;
  overflow: hidden;
  box-shadow:
    0 24px 64px rgba(0,0,0,0.28),
    inset 0 1px 1px rgba(255,255,255,0.12);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.uh-hp-border-glow {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,120,0,0.5), transparent 40%, rgba(255,120,0,0.15));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.7;
}

.uh-hp-border-glow--blue {
  background: linear-gradient(135deg, rgba(0,122,255,0.45), transparent 40%, rgba(0,122,255,0.12));
}

.uh-hp-watermark {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(80px, 12vw, 140px);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,120,0,0.08);
  pointer-events: none;
  z-index: 0;
  line-height: 1;
  user-select: none;
}

.uh-hp-bg-glow {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, rgba(255,120,0,0.18), transparent 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}

.uh-hp-bg-glow--blue {
  background: radial-gradient(circle, rgba(0,122,255,0.16), transparent 70%);
  top: auto;
  bottom: -100px;
  left: -60px;
  right: auto;
}

.uh-hp-bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--BD) 1px, transparent 1px), linear-gradient(90deg, var(--BD) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
  mask-image: radial-gradient(circle at top right, black, transparent 78%);
  -webkit-mask-image: radial-gradient(circle at top right, black, transparent 78%);
}

.uh-hp-content {
  position: relative;
  z-index: 1;
}

.uh-hp-content--center {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.uh-hp-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(255,120,0,0.1);
  border: 1px solid rgba(255,120,0,0.25);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: var(--P);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 20px;
}

.uh-hp-badge-dot {
  width: 6px;
  height: 6px;
  background: var(--P);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--P);
  animation: hp-pulse 2s infinite;
}

@keyframes hp-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

.uh-hp-title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  line-height: 1.12;
  color: var(--T1);
  margin: 0 0 16px;
  letter-spacing: -0.5px;
}

.uh-hp-brand { display: inline-block; }
.uh-hp-wild { color: var(--T1); }
.uh-hp-fire { color: var(--P); }
.uh-hp-docs { color: var(--T2); font-weight: 600; font-size: 0.85em; }

.uh-hp-subtitle {
  font-size: 15px;
  color: var(--T2);
  line-height: 1.65;
  max-width: 92%;
  margin: 0 0 28px;
}

.uh-hp-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}

.uh-hp-btn-primary,
.uh-hp-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.22s ease;
}

.uh-hp-btn-primary {
  background: linear-gradient(135deg, var(--P), #d95c00);
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(255,120,0,0.32), inset 0 1px 0 rgba(255,255,255,0.2);
}

.uh-hp-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(255,120,0,0.42);
}

.uh-hp-btn-primary svg { transition: transform 0.2s; }
.uh-hp-btn-primary:hover svg { transform: translateX(4px); }

.uh-hp-btn-secondary {
  background: var(--GLASS);
  color: var(--T1);
  border: 1px solid var(--BD);
  padding: 12px 22px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.uh-hp-btn-secondary:hover {
  background: var(--SURF);
  border-color: var(--BDA);
  transform: translateY(-1px);
}

.uh-hp-bento {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.uh-hp-stat-card {
  background: var(--GLASS);
  border: 1px solid var(--BD);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
}

.uh-root.uh-light .uh-hp-stat-card { background: rgba(0,0,0,0.02); }

.uh-hp-stat-card:hover {
  border-color: var(--BDA);
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px rgba(255,120,0,0.12), inset 0 1px 1px rgba(255,255,255,0.1);
  background: rgba(255,120,0,0.04);
}

.uh-hp-stat-card--wide { grid-column: span 2; }

.uh-hp-stat-card--commits .uh-hp-stat-icon {
  color: var(--P);
  background: var(--Ps);
}

.uh-hp-stat-card--live .uh-hp-stat-icon {
  color: var(--GRN);
  background: var(--GRS);
}

.uh-hp-stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uh-hp-stat-info { display: flex; flex-direction: column; gap: 4px; }
.uh-hp-stat-val { font-size: 20px; font-weight: 800; color: var(--T1); }
.uh-hp-stat-val--live { color: var(--GRN); }
.uh-hp-stat-lbl { font-size: 11px; font-weight: 600; color: var(--T3); letter-spacing: 0.04em; }

.uh-hp-contribs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.uh-hp-c-text { display: flex; flex-direction: column; gap: 4px; }
.uh-hp-c-val { font-size: 20px; font-weight: 800; color: var(--T1); }
.uh-hp-c-lbl { font-size: 11px; font-weight: 600; color: var(--T3); }

.uh-hp-c-avatars { display: flex; flex-wrap: wrap; gap: 8px; }

.uh-hp-contrib-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--GLASS);
  border: 1px solid var(--BD);
  border-radius: 999px;
  padding: 3px 10px 3px 3px;
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s, background 0.2s;
}

.uh-hp-contrib-badge:hover {
  transform: translateY(-2px);
  border-color: var(--BDA);
  background: rgba(255,120,0,0.06);
}

.uh-hp-cb-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
}

.uh-hp-cb-name { font-size: 11px; font-weight: 600; color: var(--T2); }
.uh-hp-contrib-badge:hover .uh-hp-cb-name { color: var(--T1); }

.uh-intro-premium {
  grid-template-columns: 1fr;
  margin-bottom: 36px;
  padding: 48px 40px;
}

.uh-intro-icon {
  width: 58px !important;
  height: 58px !important;
  border-radius: 16px !important;
  margin-bottom: 18px;
}

.uh-intro-title { font-size: clamp(24px, 3vw, 32px) !important; }
.uh-intro-sub { margin-bottom: 0 !important; max-width: 580px; }

@media (max-width: 900px) {
  .uh-hero-premium { grid-template-columns: 1fr; padding: 32px 24px; }
  .uh-hp-bento { grid-template-columns: 1fr 1fr; }
  .uh-hp-watermark { display: none; }
}

/* Quick Grid */
.uh-quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 8px;
}

@media (max-width: 768px) { .uh-quick-grid { grid-template-columns: 1fr; } }

.uh-quick-card {
  position: relative;
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.uh-quick-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--P), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.uh-quick-card--purple::before { background: linear-gradient(90deg, var(--PUR), transparent); }
.uh-quick-card--blue::before { background: linear-gradient(90deg, var(--BLU), transparent); }

.uh-quick-card:hover {
  border-color: var(--BDA);
  background: var(--SURF);
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.1);
}

.uh-quick-card:hover::before { opacity: 1; }

.uh-qc-watermark {
  position: absolute;
  right: 12px;
  top: 8px;
  font-size: 42px;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.04);
  pointer-events: none;
  line-height: 1;
}

.uh-qc-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--Ps);
  color: var(--P);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s;
}

.uh-quick-card--purple .uh-qc-icon { background: var(--PUS); color: var(--PUR); }
.uh-quick-card--blue .uh-qc-icon { background: var(--BLS); color: var(--BLU); }

.uh-quick-card:hover .uh-qc-icon { transform: scale(1.06); }

.uh-qc-content h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--T1);
  margin: 0 0 6px;
}

.uh-qc-content p {
  font-size: 12.5px;
  color: var(--T3);
  margin: 0;
  line-height: 1.45;
}

.uh-qc-arrow {
  margin-left: auto;
  align-self: center;
  color: var(--T3);
  transition: transform 0.22s, color 0.22s;
}

.uh-quick-card:hover .uh-qc-arrow {
  transform: translateX(5px);
  color: var(--P);
}

/* Highlight Grid */
.uh-highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 640px) { .uh-highlight-grid { grid-template-columns: 1fr; } }

.uh-hl-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 14px;
  transition: border-color 0.2s, transform 0.2s;
}

.uh-hl-item:hover {
  border-color: var(--BDA);
  transform: translateY(-2px);
}

.uh-hl-item--feat { border-left: 3px solid var(--GRN); }
.uh-hl-item--fix  { border-left: 3px solid var(--RED); }
.uh-hl-item--docs { border-left: 3px solid var(--BLU); }

.uh-hl-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.hi-feat { color: var(--GRN); }
.hi-fix { color: var(--RED); }
.hi-docs { color: var(--BLU); }

.uh-hl-text {
  flex: 1;
  font-size: 13px;
  color: var(--T1);
  line-height: 1.45;
}

.uh-hl-tag-clean {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--T3);
  background: var(--SURF);
  padding: 4px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

/* ══════════════════════ DASHBOARD CSS ══════════════════════ */

/* Dashboard Wrap */
.uh-wrap--dashboard {
  max-width: 1200px;
}

/* Dashboard Metrics */
.uh-dash-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
@media (max-width: 900px) { .uh-dash-metrics { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .uh-dash-metrics { grid-template-columns: 1fr; } }

/* Dashboard Grid */
.uh-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .uh-dashboard-grid { display: flex; flex-direction: column; }
}

.uh-dash-widget {
  border-radius: 24px;
  overflow: hidden;
  position: relative;
}

.uh-widget-span-12 { grid-column: span 12; }
.uh-widget-span-8 { grid-column: span 8; }
.uh-widget-span-6 { grid-column: span 6; }
.uh-widget-span-4 { grid-column: span 4; }

.uh-widget-glass {
  background: var(--CARD);
  border: 1px solid var(--BD);
  padding: 28px;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.08);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.uh-widget-glass:hover {
  border-color: var(--BDA);
  box-shadow: 0 24px 48px rgba(0,0,0,0.22), inset 0 1px 1px rgba(255,255,255,0.12);
}

.uh-widget-header {
  margin-bottom: 24px;
}
.uh-widget-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--T1);
  margin: 0;
  letter-spacing: 0.5px;
}

/* Quick Links Dashboard */
.uh-dash-quick-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.uh-dash-ql-item {
  display: flex; align-items: center; gap: 14px;
  padding: 16px; border-radius: 16px;
  background: var(--GLASS); border: 1px solid var(--BD);
  text-decoration: none; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.uh-dash-ql-item:hover {
  background: var(--SURF); border-color: var(--BDA);
  transform: translateX(6px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
.uh-dash-ql-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: var(--Ps); color: var(--P); flex-shrink: 0;
}
.uh-dash-ql--purple .uh-dash-ql-icon { background: var(--PUS); color: var(--PUR); }
.uh-dash-ql--blue .uh-dash-ql-icon { background: var(--BLS); color: var(--BLU); }
.uh-dash-ql-text h4 { font-size: 14px; font-weight: 700; color: var(--T1); margin: 0 0 2px; }
.uh-dash-ql-text p { font-size: 11.5px; color: var(--T3); margin: 0; line-height: 1.4; }
.uh-dash-ql-arrow { margin-left: auto; color: var(--T3); transition: transform 0.4s; }
.uh-dash-ql-item:hover .uh-dash-ql-arrow { transform: translateX(4px); color: var(--P); }

/* Dashboard Highlights */
.uh-dash-highlights {
  display: flex; flex-direction: column; gap: 10px;
}
.uh-dash-hl-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; background: var(--GLASS);
  border: 1px solid var(--BD); border-radius: 14px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.uh-dash-hl-item:hover { background: var(--SURF); border-color: var(--BDA); transform: translateX(4px) scale(1.02); }
.uh-dash-hl--feat { border-left: 3px solid var(--GRN); }
.uh-dash-hl--fix { border-left: 3px solid var(--RED); }
.uh-dash-hl--docs { border-left: 3px solid var(--BLU); }
.uh-dash-hl-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.uh-dash-hl-text { flex: 1; font-size: 13px; color: var(--T1); }

/* Dashboard Contributors */
.uh-dash-contribs {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.uh-dash-contrib-card {
  display: flex; align-items: center; gap: 10px;
  padding: 12px; border-radius: 12px; background: var(--GLASS);
  border: 1px solid var(--BD); text-decoration: none;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.uh-dash-contrib-card:hover {
  background: var(--SURF); border-color: var(--BDA); transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}
.uh-dash-cc-avatar { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--BD); }
.uh-dash-cc-info { display: flex; flex-direction: column; }
.uh-dash-cc-name { font-size: 13px; font-weight: 700; color: var(--T1); }
.uh-dash-cc-commits { font-size: 11px; color: var(--T3); }

/* ══════════════════════ CHANGELOGS ══════════════════════ */
.uh-changelogs-wrap { padding-top: 32px; }

.uh-section-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; margin-bottom: 28px; flex-wrap: wrap;
}

.uh-section-head--premium {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--BD);
  margin-bottom: 32px;
}

.uh-section-head-left { display: flex; align-items: center; gap: 16px; }
.uh-section-head .uh-section-title { margin: 0 0 4px; }
.uh-section-icon {
  width: 46px; height: 46px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.uh-section-icon.orange { background: var(--Ps); border: 1px solid var(--BDA); }
.uh-section-icon.orange svg { stroke: var(--P); }
.uh-section-icon.purple { background: var(--PUS); border: 1px solid rgba(175,82,222,0.3); }
.uh-section-icon.purple svg { stroke: var(--PUR); }
.uh-section-icon.blue   { background: var(--BLS); border: 1px solid rgba(0,122,255,0.3); }
.uh-section-icon.blue svg { stroke: var(--BLU); }
.uh-section-sub   { font-size: 13px; color: var(--T3); margin: 0; }

/* Changelogs embed frame */
.uh-changelogs-frame {
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.08);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Override Changelogs inner max-width so it fills the frame */
.uh-changelogs-frame .changelogs {
  max-width: 100% !important;
}

/* Style the inner filters panel to match our dark theme */
.uh-changelogs-frame .filters-panel {
  background: rgba(255,255,255,0.03) !important;
  border-color: var(--BD) !important;
}
.uh-root.uh-light .uh-changelogs-frame .filters-panel {
  background: rgba(0,0,0,0.03) !important;
}

/* ══════════════════════ VERSION TIMELINE ══════════════════════ */
.uh-timeline { display: flex; flex-direction: column; }

.uh-tl-row {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 16px;
}

.uh-tl-left {
  display: flex; flex-direction: column; align-items: center; padding-top: 18px;
}
.uh-tl-node {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: transform 0.2s, box-shadow 0.2s; z-index: 1;
}
.uh-tl-row:hover .uh-tl-node { transform: scale(1.12); }
.tln-major { background: linear-gradient(135deg, var(--P), #d95c00); box-shadow: 0 0 20px rgba(255,120,0,0.4); }
.tln-major svg { stroke: white; }
.tln-minor { background: var(--PUS); border: 2px solid var(--PUR); }
.tln-minor svg { stroke: var(--PUR); }
.tln-green { background: var(--GRS); border: 2px solid var(--GRN); }
.tln-green svg { stroke: var(--GRN); }

.uh-tl-stem {
  width: 2px; flex: 1; min-height: 20px;
  background: linear-gradient(to bottom, var(--BDA), var(--BD));
  border-radius: 2px; margin: 4px 0;
}

.uh-tl-card {
  background: var(--CARD); border: 1px solid var(--BD);
  border-radius: var(--R); margin-bottom: 14px; overflow: hidden;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.uh-tl-card:hover { 
  border-color: var(--BDA); 
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}
.tl-first .uh-tl-card {
  border-color: var(--BDA);
  box-shadow:
    0 0 0 1px rgba(255,120,0,0.1),
    0 16px 48px rgba(0,0,0,0.28),
    inset 0 1px 1px rgba(255,255,255,0.08);
}

.uh-tl-card-hd {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 18px 20px; cursor: pointer; user-select: none; gap: 12px;
}
.uh-tl-card-hd:hover { background: rgba(255,120,0,0.02); }
.uh-tl-card-left { flex: 1; min-width: 0; }
.uh-tl-tag-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
.uh-tl-tag {
  font-size: 17px; font-weight: 800; color: var(--P);
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  background: none; border: none; padding: 0;
}
.uh-tl-title { font-size: 13px; color: var(--T2); line-height: 1.5; margin: 0 0 8px; }
.uh-tl-meta { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--T3); flex-wrap: wrap; }
.uh-tl-meta svg { stroke: var(--T3); vertical-align: middle; }

.uh-tl-chevron {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--Px); border: 1px solid var(--BD);
  flex-shrink: 0; margin-top: 2px;
  transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.2s;
}
.uh-tl-chevron svg { stroke: var(--T3); transition: stroke 0.2s; }
.uh-tl-chevron.open { transform: rotate(180deg); background: var(--Ps); }
.uh-tl-chevron.open svg { stroke: var(--P); }

.uh-tl-card-body { padding: 0 20px 20px; border-top: 1px solid var(--BD); }

.uh-tl-body-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 18px;
}
@media (max-width: 640px) { .uh-tl-body-grid { grid-template-columns: 1fr; } }

.uh-tl-col-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em;
  color: var(--T3); text-transform: uppercase; margin-bottom: 10px;
}
.uh-tl-col-label svg { stroke: var(--P); }

.uh-tl-hl-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 6px;
}
.uh-tl-hl-list li {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--T2);
}

.uh-feat-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.uh-feat-chip {
  padding: 3px 10px; border-radius: 20px;
  background: var(--Px); border: 1px solid rgba(255,120,0,0.15);
  font-size: 11.5px; font-weight: 600; color: var(--P);
  transition: background 0.15s;
}
.uh-feat-chip:hover { background: var(--Ps); }

.uh-fix-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.uh-fix-list li { display: flex; align-items: flex-start; gap: 7px; font-size: 12.5px; color: var(--T2); }
.uh-fix-list li svg { stroke: var(--GRN); flex-shrink: 0; margin-top: 2px; }

.uh-tl-contrib { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--BD); }
.uh-avatars { display: flex; gap: 8px; flex-wrap: wrap; }
/* Reusing .uh-hp-contrib-badge from hero section */

/* ══════════════════════ CONTRIBUTE ══════════════════════ */

/* Contribute Live Grid */
.uh-contrib-live-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.uh-clg-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 14px;
  padding: 14px;
  text-decoration: none;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.uh-clg-card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: rgba(0,122,255,0.45);
  box-shadow: 0 16px 40px rgba(0,122,255,0.18), inset 0 1px 1px rgba(255,255,255,0.1);
  background: rgba(0,122,255,0.04);
}
.uh-clg-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 2px solid var(--SURF);
}
.uh-clg-info {
  display: flex; flex-direction: column; gap: 2px;
}
.uh-clg-name {
  font-size: 14px; font-weight: 700; color: var(--T1);
}
.uh-clg-commits {
  font-size: 11.5px; color: var(--T3);
}
.uh-contrib-live-loading {
  font-size: 13px; color: var(--T3); font-style: italic;
  padding: 24px; text-align: center;
  background: var(--SURF); border-radius: 12px; border: 1px dashed var(--BD);
}

/* Glassmorphism Contribute Cards */
.uh-contrib-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
@media (max-width: 800px) { .uh-contrib-row { grid-template-columns: 1fr; } }

.uh-contrib-glass-card {
  align-items: flex-start;
  padding: 26px;
  border-color: rgba(0,122,255,0.15);
}

.uh-contrib-glass-card:hover {
  border-color: rgba(0,122,255,0.35);
  box-shadow: 0 14px 40px rgba(0,122,255,0.08);
}

.uh-contrib-glass-card h4 {
  font-size: 17px;
  font-weight: 800;
  color: var(--T1);
  margin: 0 0 8px;
}

.uh-contrib-glass-card p {
  font-size: 13.5px;
  color: var(--T2);
  line-height: 1.5;
  margin: 0 0 20px;
}

.uh-contrib-glass-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uh-contrib-glass-card li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--T2);
}

.uh-contrib-glass-card li svg { stroke: var(--BLU); flex-shrink: 0; margin-top: 2px; }

.uh-cc-ico {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: var(--BLS);
  border: 1px solid rgba(0,122,255,0.28);
  color: var(--BLU);
}

.uh-cc-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  background: var(--BLS);
  border: 1px solid rgba(0,122,255,0.22);
  color: var(--BLU);
}

/* Premium Steps */
.uh-steps-premium {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.uh-sp-step {
  display: flex;
  gap: 24px;
}
.uh-sp-num-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.uh-sp-num {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--BLU), #005bb5);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 18px; color: white;
  box-shadow: 0 4px 14px rgba(0,122,255,0.3);
  flex-shrink: 0;
}
.uh-sp-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, var(--BLU), transparent);
  border-radius: 2px;
  min-height: 20px;
}
.uh-sp-content {
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 16px;
  padding: 24px;
  flex: 1;
  transition: border-color 0.2s, transform 0.2s;
}
.uh-sp-content:hover {
  border-color: rgba(0,122,255,0.4);
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(0,122,255,0.08);
}
.uh-sp-content h4 { font-size: 18px; font-weight: 700; color: var(--T1); margin: 0 0 8px; }
.uh-sp-content p  { font-size: 14px; color: var(--T2); line-height: 1.6; margin: 0; }

/* Refined FAQ */
.uh-faq { display: flex; flex-direction: column; gap: 8px; }
.uh-faq-premium {
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(10px);
  border: 1px solid var(--BD);
  border-radius: 16px;
  overflow: hidden; cursor: pointer; transition: border-color 0.18s;
}
.uh-root.uh-light .uh-faq-premium { background: rgba(0,0,0,0.01); }
.uh-faq-premium:hover, .uh-faq-premium.open { border-color: rgba(0,122,255,0.3); }
.uh-faq-q {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 15px 18px;
  font-size: 14px; font-weight: 600; color: var(--T1);
}
.uh-faq-chevron { stroke: var(--T3); flex-shrink: 0; transition: transform 0.25s; }
.uh-faq-premium.open .uh-faq-chevron { transform: rotate(180deg); stroke: var(--BLU); }
.uh-faq-a {
  padding: 0 18px 15px; font-size: 13.5px; color: var(--T2); line-height: 1.6;
  border-top: 1px solid var(--BD); padding-top: 14px;
}

/* Final CTA */
.uh-final-cta {
  margin-top: 48px;
  position: relative;
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 20px;
  padding: 52px 40px;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 20px 56px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.05);
}

.uh-final-cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,120,0,0.1), transparent 65%);
  pointer-events: none;
}

.uh-final-cta-inner { position: relative; z-index: 1; }

.uh-final-cta .uh-section-label {
  justify-content: center;
  margin-bottom: 16px;
}

.uh-final-cta h3 {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 800;
  margin: 0 0 12px;
  color: var(--T1);
}
.uh-final-cta p { font-size: 15px; color: var(--T2); max-width: 380px; margin: 0 auto 28px; }
.uh-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }


/* ══════════════════════ MASTER-DETAIL VERSIONS ══════════════════════ */
.uh-version-nav {
  display: flex; flex-direction: column; gap: 12px;
}
.uh-vnav-btn {
  display: flex; align-items: center; gap: 16px;
  width: 100%; text-align: left;
  background: var(--CARD); border: 1px solid var(--BD);
  padding: 16px 20px; border-radius: 16px;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
}
.uh-vnav-btn:hover {
  border-color: rgba(0,122,255,0.4); transform: translateX(6px);
  box-shadow: 0 8px 24px rgba(0,122,255,0.08);
}
.uh-vnav-btn.active {
  border-color: var(--BLU);
  background: linear-gradient(135deg, rgba(0,122,255,0.1), rgba(0,122,255,0.02));
  box-shadow: 0 12px 32px rgba(0,122,255,0.15), inset 0 0 0 1px rgba(0,122,255,0.5);
  transform: translateX(8px);
}
.uh-vnav-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; background: var(--BLS); color: var(--BLU);
}
.uh-vnav-icon.vnav-orange { background: rgba(255,140,0,0.15); color: #ff8c00; }
.uh-vnav-icon.vnav-purple { background: rgba(168,85,247,0.15); color: #a855f7; }
.uh-vnav-icon.vnav-green { background: rgba(34,197,94,0.15); color: #22c55e; }
.uh-vnav-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.uh-vnav-tag { font-size: 15px; font-weight: 700; color: var(--T1); }
.uh-vnav-date { font-size: 12px; color: var(--T3); }
.uh-vnav-badge {
  font-size: 10px; font-weight: 800; background: rgba(255,140,0,0.15); color: #ff8c00;
  padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px;
}

.uh-version-details {
  display: flex; flex-direction: column; height: 100%;
}
.uh-vd-header { border-bottom: 1px solid var(--BD); padding-bottom: 24px; margin-bottom: 24px; }
.uh-vd-tag-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.uh-vd-title { font-size: 24px; font-weight: 800; color: var(--T1); margin: 0 0 16px; line-height: 1.3; }
.uh-vd-meta { display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: var(--T3); }
.uh-vd-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--BD); }
.uh-vd-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; }
@media (max-width: 800px) { .uh-vd-grid { grid-template-columns: 1fr; } }

.uh-fade-enter-active, .uh-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.uh-fade-enter-from, .uh-fade-leave-to { opacity: 0; transform: translateY(10px); }


@media (max-width: 900px) {
  .uh-versions-split { grid-template-columns: 1fr !important; }
}

/* ══════════════════════ LIQUID DEPTH PAGE TRANSITIONS ══════════════════════ */
.uh-pages-wrapper {
  display: grid;
  width: 100%;
}
.uh-page {
  grid-area: 1 / 1;
  width: 100%;
  transition: opacity 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              filter 0.5s ease,
              visibility 0.5s ease;
}
.uh-page.page-inactive {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: scale(0.96) translateY(20px);
  filter: blur(8px);
  z-index: 0;
}
.uh-page.page-active {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: scale(1) translateY(0);
  filter: blur(0);
  z-index: 1;
}

/* ══════════════════════ TRANSITIONS ══════════════════════ */
.uh-slide-enter-active, .uh-slide-leave-active {
  transition: max-height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
  overflow: hidden;
  max-height: 800px;
}
.uh-slide-enter-from, .uh-slide-leave-to { max-height: 0; opacity: 0; }

/* ══════════════════════ RESPONSIVE ══════════════════════ */
@media (max-width: 640px) {
  .uh-wrap { padding: 28px 16px 64px; }
  .uh-final-cta { padding: 36px 22px; }
  .uh-changelogs-frame { padding: 14px; border-radius: 18px; }
  .uh-hp-bento { grid-template-columns: 1fr; }
  .uh-hp-stat-card--wide { grid-column: span 1; }
}
</style>
