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

      <!-- ═══════════════ OVERVIEW ═══════════════ -->
      <section v-show="activeTab === 'overview'" class="uh-page">
        <div class="uh-wrap">

          <!-- PREMIUM HERO -->
          <div class="uh-hero-premium">
            <!-- Background effects -->
            <div class="uh-hp-bg-glow"></div>
            <div class="uh-hp-bg-grid"></div>

            <div class="uh-hp-content">
              <div class="uh-hp-badge">
                <span class="uh-hp-badge-dot"></span>
                v3.0.0 is now live
              </div>
              
              <h1 class="uh-hp-title">
                The next generation of <br/>
                <span class="uh-hp-highlight">Wildfire.ro Docs</span>
              </h1>
              
              <p class="uh-hp-subtitle">
                A complete rebuild focusing on performance, beautiful design systems, and real-time GitHub integrations. Everything you need, faster than ever.
              </p>

              <div class="uh-hp-actions">
                <button class="uh-hp-btn-primary" @click="setTab('changelogs')">
                  Explore Changelogs
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <button class="uh-hp-btn-secondary" @click="setTab('versions')">
                  Version History
                </button>
              </div>
            </div>

            <div class="uh-hp-visuals">
              <div class="uh-hp-stat-card">
                <div class="uh-hp-stat-icon" style="color: var(--P); background: var(--Ps);">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>
                </div>
                <div class="uh-hp-stat-info">
                  <div class="uh-hp-stat-val">100+</div>
                  <div class="uh-hp-stat-lbl">Commits Synced</div>
                </div>
              </div>

              <div class="uh-hp-stat-card">
                <div class="uh-hp-stat-icon" style="color: var(--GRN); background: var(--GRS);">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="uh-hp-stat-info">
                  <div class="uh-hp-stat-val" style="color: var(--GRN);">LIVE</div>
                  <div class="uh-hp-stat-lbl">System Status</div>
                </div>
              </div>

              <div class="uh-hp-stat-card uh-hp-span-2">
                <div class="uh-hp-contribs">
                  <div class="uh-hp-c-text">
                    <span class="uh-hp-c-val">{{ isLoadingContributors ? '...' : githubContributors.length + '+' }}</span>
                    <span class="uh-hp-c-lbl">Active Contributors</span>
                  </div>
                  <div class="uh-hp-c-avatars" v-if="githubContributors.length">
                    <a v-for="c in githubContributors" :key="c.login" :href="c.html_url" target="_blank" class="uh-hp-contrib-badge">
                      <img :src="c.avatar_url + (c.avatar_url.includes('?') ? '&' : '?') + 's=60'" :alt="c.login" class="uh-hp-cb-avatar">
                      <span class="uh-hp-cb-name">@{{ c.login }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- QUICK NAV GRID (Refined) -->
          <div class="uh-ov-label">EXPLORE</div>
          <div class="uh-quick-grid">
            <div class="uh-quick-card" @click="setTab('changelogs')">
              <div class="uh-qc-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg></div>
              <div class="uh-qc-content">
                <h4>Commit Changelog</h4>
                <p>Live GitHub feed — tracking every commit in real-time.</p>
              </div>
              <svg class="uh-qc-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>

            <div class="uh-quick-card" @click="setTab('versions')">
              <div class="uh-qc-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div class="uh-qc-content">
                <h4>Version History</h4>
                <p>Curated major releases, highlights, and bugfixes.</p>
              </div>
              <svg class="uh-qc-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>

            <div class="uh-quick-card" @click="setTab('contribute')">
              <div class="uh-qc-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div class="uh-qc-content">
                <h4>Contribute</h4>
                <p>Join the open source effort to improve the documentation.</p>
              </div>
              <svg class="uh-qc-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- HIGHLIGHTS (Clean List) -->
          <div class="uh-ov-label" style="margin-top:40px">v3.0.0 HIGHLIGHTS</div>
          <div class="uh-highlight-list">
            <div class="uh-hl-item" v-for="h in v3Highlights" :key="h.text">
              <div class="uh-hl-icon" :class="'hi-' + h.type">
                <svg v-if="h.type === 'feat'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <svg v-if="h.type === 'fix'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                <svg v-if="h.type === 'docs'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div class="uh-hl-text">{{ h.text }}</div>
              <div class="uh-hl-tag-clean">{{ h.type }}</div>
            </div>
          </div>

        </div>
      </section>

      <!-- ═══════════════ CHANGELOGS ═══════════════ -->
      <section v-show="activeTab === 'changelogs'" class="uh-page">
        <div class="uh-wrap uh-changelogs-wrap">

          <!-- Section header -->
          <div class="uh-section-head">
            <div class="uh-section-head-left">
              <div class="uh-section-icon orange">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>
              </div>
              <div>
                <h2 class="uh-section-title">Commit Changelog</h2>
                <p class="uh-section-sub">WildFiire/docs · main · real-time GitHub feed</p>
              </div>
            </div>
            <a href="https://github.com/WildFiire/docs/commits/main" target="_blank" class="uh-btn uh-btn-glass uh-btn-sm">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              Open GitHub
            </a>
          </div>

          <!-- Embedded Changelogs component with custom wrapper -->
          <div class="uh-changelogs-frame">
            <Changelogs />
          </div>

        </div>
      </section>

      <!-- ═══════════════ VERSIONS ═══════════════ -->
      <section v-show="activeTab === 'versions'" class="uh-page">
        <div class="uh-wrap">

          <div class="uh-section-head">
            <div class="uh-section-head-left">
              <div class="uh-section-icon purple">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h2 class="uh-section-title">Version History</h2>
                <p class="uh-section-sub">Release notes complete — de la prima lansare pana azi</p>
              </div>
            </div>
            <button class="uh-btn uh-btn-glass uh-btn-sm" @click="expandAllVersions = !expandAllVersions">
              {{ expandAllVersions ? 'Collapse All' : 'Expand All' }}
            </button>
          </div>

          <div class="uh-timeline">
            <div
              v-for="(ver, idx) in versions"
              :key="ver.tag"
              class="uh-tl-row"
              :class="{ 'tl-first': idx === 0 }"
            >
              <!-- Left: node + line -->
              <div class="uh-tl-left">
                <div class="uh-tl-node" :class="'tln-' + ver.type">
                  <span v-html="ver.icon"></span>
                </div>
                <div class="uh-tl-stem" v-if="idx < versions.length - 1"></div>
              </div>

              <!-- Right: card -->
              <div class="uh-tl-card" :class="{ 'tlc-open': openVersions[ver.tag] || expandAllVersions }">
                <div class="uh-tl-card-hd" @click="toggleVer(ver.tag)">
                  <div class="uh-tl-card-left">
                    <div class="uh-tl-tag-row">
                      <code class="uh-tl-tag">{{ ver.tag }}</code>
                      <span class="uh-chip" :class="'uh-chip-' + ver.typeColor">{{ ver.typeLabel }}</span>
                      <span v-if="idx === 0" class="uh-chip uh-chip-orange" style="animation: uh-badge-pulse 2s ease infinite">LATEST</span>
                    </div>
                    <p class="uh-tl-title">{{ ver.title }}</p>
                    <div class="uh-tl-meta">
                      <span><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{{ ver.date }}</span>
                      <span>·</span>
                      <span><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>{{ ver.commitCount }} commits</span>
                    </div>
                  </div>
                  <div class="uh-tl-chevron" :class="{ open: openVersions[ver.tag] || expandAllVersions }">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                <transition name="uh-slide">
                  <div v-if="openVersions[ver.tag] || expandAllVersions" class="uh-tl-card-body">
                    <div class="uh-tl-body-grid">
                      <!-- Highlights -->
                      <div class="uh-tl-col" v-if="ver.highlights?.length">
                        <div class="uh-tl-col-label">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          Highlights
                        </div>
                        <ul class="uh-tl-hl-list">
                          <li v-for="h in ver.highlights" :key="h.text">
                            <span class="uh-dot" :class="'d-' + h.type"></span>
                            <span>{{ h.text }}</span>
                            <span class="uh-hl-tag" :class="'t-' + h.type">{{ h.type }}</span>
                          </li>
                        </ul>
                      </div>
                      <!-- Features -->
                      <div class="uh-tl-col" v-if="ver.features?.length">
                        <div class="uh-tl-col-label">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                          Features
                        </div>
                        <div class="uh-feat-chips">
                          <span v-for="f in ver.features" :key="f" class="uh-feat-chip">{{ f }}</span>
                        </div>
                        <!-- Fixes inline -->
                        <div class="uh-tl-col-label" style="margin-top:16px" v-if="ver.fixes?.length">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                          Fixes
                        </div>
                        <ul class="uh-fix-list" v-if="ver.fixes?.length">
                          <li v-for="f in ver.fixes" :key="f">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            {{ f }}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <!-- Contributors -->
                    <div class="uh-tl-contrib" v-if="ver.contributors?.length">
                      <span class="uh-tl-col-label" style="margin-bottom:8px; display:flex">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        Contributors
                      </span>
                      <div class="uh-avatars">
                        <a v-for="c in ver.contributors" :key="c" :href="`https://github.com/${c}`" target="_blank" class="uh-hp-contrib-badge">
                          <img :src="`https://github.com/${c}.png?size=40`" :alt="c" loading="lazy" class="uh-hp-cb-avatar">
                          <span class="uh-hp-cb-name">@{{ c }}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ═══════════════ CONTRIBUTE ═══════════════ -->
      <section v-show="activeTab === 'contribute'" class="uh-page">
        <div class="uh-wrap">

          <div class="uh-section-head">
            <div class="uh-section-head-left">
              <div class="uh-section-icon blue">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h2 class="uh-section-title">Contribuie</h2>
                <p class="uh-section-sub">Ajuta la construirea Wildfire.ro Docs</p>
              </div>
            </div>
            <a href="https://github.com/WildFiire/docs" target="_blank" class="uh-btn uh-btn-fire uh-btn-sm">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              Fork pe GitHub
            </a>
          </div>

          <!-- Premium Intro banner -->
          <div class="uh-hero-premium uh-intro-premium" style="grid-template-columns: 1fr; padding: 40px; margin-bottom: 40px;">
            <div class="uh-hp-bg-glow" style="background: radial-gradient(circle, rgba(0,122,255,0.15), transparent 70%);"></div>
            <div class="uh-hp-bg-grid" style="mask-image: radial-gradient(circle at left, black, transparent 80%); -webkit-mask-image: radial-gradient(circle at left, black, transparent 80%);"></div>
            <div class="uh-hp-content" style="text-align: center; display: flex; flex-direction: column; align-items: center;">
              <div class="uh-section-icon blue" style="margin-bottom: 20px; width: 56px; height: 56px; border-radius: 16px;">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 class="uh-hp-title" style="font-size: 32px;">De ce sa contribui?</h3>
              <p class="uh-hp-subtitle" style="margin-bottom: 0; max-width: 600px;">
                Wildfire.ro e construit de <strong>oameni ca tine</strong>. Fie ca ai idei, gasesti bug-uri sau vrei sa scrii cod — orice contribuitie conteaza si iti va fi recunoscuta in public.
              </p>
            </div>
          </div>

          <!-- NEW LIVE CONTRIBUTORS GRID -->
          <div class="uh-ov-label">OUR CONTRIBUTORS</div>
          <div class="uh-contrib-live-grid" v-if="!isLoadingContributors && githubContributors.length">
            <a v-for="c in githubContributors" :key="c.login" :href="c.html_url" target="_blank" class="uh-clg-card">
              <img :src="c.avatar_url + (c.avatar_url.includes('?') ? '&' : '?') + 's=80'" :alt="c.login" class="uh-clg-avatar" />
              <div class="uh-clg-info">
                <span class="uh-clg-name">@{{ c.login }}</span>
                <span class="uh-clg-commits">{{ c.contributions }} commits</span>
              </div>
            </a>
          </div>
          <div v-else class="uh-contrib-live-loading">
            Loading contributors from GitHub...
          </div>

          <!-- How-to cards (Glassmorphism) -->
          <div class="uh-ov-label" style="margin-top:44px">ROLE-URI</div>
          <div class="uh-contrib-row">
            <div class="uh-hp-stat-card uh-contrib-glass-card" v-for="c in contributeCards" :key="c.title">
              <div class="uh-cc-ico" v-html="c.icon" style="background: var(--BLS); border: 1px solid rgba(0,122,255,0.3); color: var(--BLU);"></div>
              <h4>{{ c.title }}</h4>
              <p>{{ c.desc }}</p>
              <ul>
                <li v-for="it in c.items" :key="it">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" style="stroke: var(--BLU);"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ it }}
                </li>
              </ul>
              <span class="uh-cc-badge" style="background: var(--BLS); border: 1px solid rgba(0,122,255,0.2); color: var(--BLU);">{{ c.badge }}</span>
            </div>
          </div>

          <!-- Premium Steps -->
          <div class="uh-ov-label" style="margin-top:44px">CUM INCEPI</div>
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

          <!-- FAQ (Refined) -->
          <div class="uh-ov-label" style="margin-top:44px">FAQ</div>
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

          <!-- Final CTA -->
          <div class="uh-final-cta">
            <div class="uh-final-cta-glow"></div>
            <div class="uh-final-cta-inner">
              <h3>Gata sa contribui?</h3>
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
      </section>

    </main>
  </div>
</template>

<script>
import { useRoute } from 'vitepress'
import CS2Background from '../Home/CS2Background.vue'

export default {
  name: 'UpdatesHub',
  components: { CS2Background },

  setup() {
    const route = useRoute()
    return { route }
  },

  computed: {
    heroVer() { return this.versions[0] },
    githubToken() {
      return window.__GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN
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
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.fetchGitHubContributors()
  },

  beforeUnmount() {
    if (typeof window !== 'undefined') window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
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
      // Ignored: Vitepress routing takes over
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

  --BG:    #060608;
  --CARD:  rgba(12, 12, 18, 0.88);
  --SURF:  rgba(18, 18, 26, 0.7);
  --INPUT: rgba(22, 22, 30, 0.9);

  --T1: #f0f0f8;
  --T2: #b8b8cc;
  --T3: #666680;

  --BD:  rgba(255,255,255,0.06);
  --BDA: rgba(255,120,0,0.22);

  --GRN: #34c759; --GRS: rgba(52,199,89,0.14);
  --RED: #ff3b30; --RDS: rgba(255,59,48,0.14);
  --BLU: #007aff; --BLS: rgba(0,122,255,0.14);
  --PUR: #af52de; --PUS: rgba(175,82,222,0.14);

  --NAV: 56px;
  --WRAP: 960px;
  --R: 12px;

  /* Flex layout for sidebar + main */
  display: flex;
  min-height: 100vh;
  /* background: var(--BG);  Removed so CS2Background is visible */
  color: var(--T1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Light mode */
.uh-root.uh-light {
  --BG:   #f3f3f7;
  --CARD: rgba(255,255,255,0.92);
  --SURF: rgba(240,240,248,0.8);
  --T1:   #111118;
  --T2:   #3a3a4a;
  --T3:   #888898;
  --BD:   rgba(0,0,0,0.07);
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
}

.uh-page {
  min-height: 100%;
}

.uh-wrap {
  max-width: var(--WRAP);
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* ── Buttons ── */
.uh-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px; border-radius: 40px;
  font-size: 13px; font-weight: 700;
  text-decoration: none; border: none; cursor: pointer;
  transition: all 0.2s; position: relative; overflow: hidden;
}
.uh-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}
.uh-btn:hover::after { transform: translateX(100%); }
.uh-btn-fire { background: linear-gradient(135deg, var(--P), #d95c00); color: white; box-shadow: 0 4px 16px rgba(255,120,0,0.3); }
.uh-btn-fire:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,120,0,0.45); }
.uh-btn-glass { background: var(--CARD); border: 1px solid var(--BD); color: var(--T2); }
.uh-btn-glass:hover { border-color: var(--BDA); color: var(--P); transform: translateY(-2px); }
.uh-btn-discord { background: #5865f2; color: white; box-shadow: 0 4px 16px rgba(88,101,242,0.3); }
.uh-btn-discord:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(88,101,242,0.45); }
.uh-btn-sm { padding: 6px 14px; font-size: 12px; }
.uh-btn svg { stroke: currentColor; flex-shrink: 0; }
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
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 40px;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05);
}

.uh-hp-bg-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,120,0,0.15), transparent 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}

.uh-hp-bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--BD) 1px, transparent 1px), linear-gradient(90deg, var(--BD) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
  mask-image: radial-gradient(circle at top right, black, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at top right, black, transparent 80%);
}

.uh-hp-content {
  position: relative;
  z-index: 1;
}

.uh-hp-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255,120,0,0.1);
  border: 1px solid rgba(255,120,0,0.2);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: var(--P);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
}
.uh-hp-badge-dot {
  width: 6px;
  height: 6px;
  background: var(--P);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--P);
  animation: hp-pulse 2s infinite;
}
@keyframes hp-pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

.uh-hp-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  color: var(--T1);
  margin: 0 0 16px;
  letter-spacing: -1px;
}
.uh-hp-highlight {
  background: linear-gradient(135deg, #ff9800, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.uh-hp-subtitle {
  font-size: 15px;
  color: var(--T2);
  line-height: 1.6;
  max-width: 90%;
  margin: 0 0 32px;
}

.uh-hp-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.uh-hp-btn-primary {
  display: flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, var(--P), #d95c00);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(255,120,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
}
.uh-hp-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,120,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}
.uh-hp-btn-primary svg { transition: transform 0.2s; }
.uh-hp-btn-primary:hover svg { transform: translateX(4px); }

.uh-hp-btn-secondary {
  background: transparent;
  color: var(--T1);
  border: 1px solid var(--BD);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.uh-hp-btn-secondary:hover {
  background: var(--SURF);
  border-color: var(--T3);
}

.uh-hp-visuals {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.uh-hp-stat-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--BD);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  backdrop-filter: blur(10px);
  transition: border-color 0.2s, transform 0.2s;
}
.uh-root.uh-light .uh-hp-stat-card { background: rgba(0,0,0,0.02); }
.uh-hp-stat-card:hover {
  border-color: rgba(255,120,0,0.3);
  transform: translateY(-2px);
}
.uh-hp-span-2 { grid-column: span 2; }

.uh-hp-stat-icon {
  width: 32px; height: 32px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}

.uh-hp-stat-info { display: flex; flex-direction: column; gap: 4px; }
.uh-hp-stat-val { font-size: 18px; font-weight: 800; color: var(--T1); font-family: 'Share Tech Mono', monospace; }
.uh-hp-stat-lbl { font-size: 11px; font-weight: 600; color: var(--T3); }

.uh-hp-contribs {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.uh-hp-c-text { display: flex; flex-direction: column; gap: 4px; }
.uh-hp-c-val { font-size: 18px; font-weight: 800; color: var(--T1); }
.uh-hp-c-lbl { font-size: 11px; font-weight: 600; color: var(--T3); }

.uh-hp-c-avatars { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.uh-hp-contrib-badge {
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.02); border: 1px solid var(--BD);
  border-radius: 20px; padding: 3px 10px 3px 3px;
  text-decoration: none; transition: transform 0.2s, border-color 0.2s, background 0.2s;
}
.uh-root.uh-light .uh-hp-contrib-badge { background: rgba(0,0,0,0.02); }
.uh-hp-contrib-badge:hover {
  transform: translateY(-2px); border-color: rgba(255,120,0,0.4);
  background: rgba(255,120,0,0.05);
}
.uh-hp-cb-avatar {
  width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
}
.uh-hp-cb-name {
  font-size: 11.5px; font-weight: 600; color: var(--T2);
}
.uh-hp-contrib-badge:hover .uh-hp-cb-name { color: var(--T1); }
.uh-hp-cb-more { font-size: 11.5px; font-weight: 700; color: var(--T3); padding: 0 4px; }

@media (max-width: 900px) {
  .uh-hero-premium { grid-template-columns: 1fr; }
  .uh-hp-visuals { grid-template-columns: 1fr 1fr; }
}

/* Quick Grid */
.uh-ov-label {
  font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: var(--T3);
  text-transform: uppercase; margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.uh-ov-label::after { content: ''; flex: 1; height: 1px; background: var(--BD); }

.uh-quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 768px) { .uh-quick-grid { grid-template-columns: 1fr; } }

.uh-quick-card {
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.uh-quick-card:hover {
  border-color: var(--BDA);
  background: var(--SURF);
  transform: translateY(-2px);
}
.uh-qc-icon {
  width: 40px; height: 40px;
  border-radius: 8px;
  background: var(--Ps);
  color: var(--P);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.uh-qc-content h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--T1);
  margin: 0 0 4px;
}
.uh-qc-content p {
  font-size: 12.5px;
  color: var(--T3);
  margin: 0;
  line-height: 1.4;
}
.uh-qc-arrow {
  margin-left: auto;
  align-self: center;
  color: var(--T3);
  transition: transform 0.2s, color 0.2s;
}
.uh-quick-card:hover .uh-qc-arrow {
  transform: translateX(4px);
  color: var(--P);
}

/* Highlight List */
.uh-highlight-list {
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}
.uh-hl-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--BD);
}
.uh-hl-item:last-child { border-bottom: none; }
.uh-hl-icon {
  display: flex; align-items: center; justify-content: center;
}
.hi-feat { color: var(--GRN); }
.hi-fix { color: var(--RED); }
.hi-docs { color: var(--BLU); }
.uh-hl-text {
  flex: 1;
  font-size: 13.5px;
  color: var(--T1);
}
.uh-hl-tag-clean {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--T3);
  background: var(--SURF);
  padding: 2px 6px;
  border-radius: 4px;
}

/* ══════════════════════ CHANGELOGS ══════════════════════ */
.uh-changelogs-wrap { padding-top: 32px; }

.uh-section-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; margin-bottom: 28px; flex-wrap: wrap;
}
.uh-section-head-left { display: flex; align-items: center; gap: 14px; }
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
.uh-section-title { font-size: 22px; font-weight: 800; color: var(--T1); margin: 0 0 4px; }
.uh-section-sub   { font-size: 13px; color: var(--T3); margin: 0; }

/* Changelogs embed frame */
.uh-changelogs-frame {
  background: var(--CARD);
  border: 1px solid var(--BD);
  border-radius: 24px;
  padding: 24px;
  /* Give the inner Changelogs component space */
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
  transition: border-color 0.2s, box-shadow 0.2s;
}
.uh-tl-card:hover { border-color: var(--BDA); }
.tl-first .uh-tl-card {
  border-color: var(--BDA);
  box-shadow: 0 0 0 1px rgba(255,120,0,0.08), 0 12px 40px rgba(0,0,0,0.25);
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
  border-radius: 12px;
  padding: 12px;
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.uh-clg-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0,122,255,0.4);
  box-shadow: 0 8px 24px rgba(0,122,255,0.1);
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
  padding: 24px;
}
.uh-contrib-glass-card h4 {
  font-size: 18px; font-weight: 800; color: var(--T1); margin: 0 0 8px;
}
.uh-contrib-glass-card p {
  font-size: 13.5px; color: var(--T2); line-height: 1.5; margin: 0 0 20px;
}
.uh-contrib-glass-card ul {
  list-style: none; padding: 0; margin: 0 0 20px;
  display: flex; flex-direction: column; gap: 8px;
}
.uh-contrib-glass-card li {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 13px; color: var(--T2);
}
.uh-cc-ico { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.uh-cc-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.07em; padding: 2px 9px; border-radius: 20px; text-transform: uppercase; }

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
  margin-top: 44px; position: relative;
  background: var(--CARD); border: 1px solid var(--BD);
  border-radius: 16px; padding: 50px 40px; text-align: center; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.uh-final-cta-glow { display: none; }
.uh-final-cta-inner { position: relative; z-index: 1; }
.uh-final-cta h3 {
  font-size: 26px; font-weight: 800; margin: 0 0 12px;
  color: var(--T1);
}
.uh-final-cta p { font-size: 15px; color: var(--T2); max-width: 380px; margin: 0 auto 28px; }
.uh-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* ══════════════════════ TRANSITIONS ══════════════════════ */
.uh-slide-enter-active, .uh-slide-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease;
  overflow: hidden;
  max-height: 800px;
}
.uh-slide-enter-from, .uh-slide-leave-to { max-height: 0; opacity: 0; }

/* ══════════════════════ RESPONSIVE ══════════════════════ */
@media (max-width: 640px) {
  .uh-nav-inner { padding: 0 14px; gap: 8px; }
  .uh-logo-name, .uh-logo-sep, .uh-logo-sub { display: none; }
  .uh-ver-pill { display: none; }
  .uh-wrap { padding: 24px 14px 60px; }
  .uh-final-cta { padding: 32px 20px; }
  .uh-intro-banner { flex-direction: column; padding: 20px; }
  .uh-changelogs-frame { padding: 14px; }
}
</style>
