<template>
  <Teleport to="body" v-if="isMounted">
    <!-- Show Login if not authenticated -->
    <PanelLogin 
      v-if="!isAuthenticated"
      @login-success="handleLoginSuccess"
    />
    
    <!-- Main Dashboard -->
    <div v-else class="wildfire-dashboard" :class="['wf-theme-' + panelTheme, { 'light-theme': isLightTheme }]">
      <div class="dashboard-bg">
        <div class="bg-grid"></div>
        <div class="bg-particles">
          <div v-for="n in 50" :key="n" class="particle" :style="particleStyle(n)"></div>
        </div>
      </div>

      <aside class="dashboard-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-brand" @click="currentView = 'dashboard'">
          <div class="brand-icon">
            <img src="/icons/wildfire.webp" alt="WildFire Logo" width="28" height="28">
          </div>
          <div class="brand-text" v-if="!sidebarCollapsed">
            <span class="brand-name">Wildfire</span>
            <span class="brand-sub">Dashboard</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div v-for="item in navItems" :key="item.id"
               class="nav-item"
               :class="{ active: currentView === item.id }"
               :title="sidebarCollapsed ? item.label : ''"
               @click="handleNavClick(item)">
            <span class="nav-icon" v-html="item.icon"></span>
            <span class="nav-label" v-if="!sidebarCollapsed">{{ item.label }}</span>
            <span class="nav-badge" v-if="item.badge && !sidebarCollapsed">{{ item.badge }}</span>
            <div class="nav-glow"></div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="sf-card" :class="{ 'sf-collapsed': sidebarCollapsed }">
            <div class="sf-profile-area" @click="currentView = 'profile'" :title="userLogin">
              <div class="sf-avatar-wrap">
                <img :src="userAvatar" :alt="userLogin" class="sf-avatar">
                <span class="sf-online-dot"></span>
              </div>
              <div class="sf-info" v-if="!sidebarCollapsed">
                <span class="sf-name">{{ userLogin }}</span>
                <span class="sf-status"><span class="sf-pulse-dot"></span>ONLINE</span>
              </div>
            </div>
            <button class="sf-out-btn" @click="handleLogout" title="Sign Out">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
          <a href="/" class="sf-home-link" :class="{ 'sf-home-collapsed': sidebarCollapsed }" title="Back to Site">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span v-if="!sidebarCollapsed">BACK TO SITE</span>
          </a>
        </div>
      </aside>

      <main ref="mainContent" class="dashboard-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <header class="dashboard-header" :class="{ 'scrolled': isScrolled }">
          <div class="header-left">
            <button class="menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <h1>{{ currentViewTitle }}</h1>
            <div class="live-indicator">
              <span class="live-pulse"></span>
              <span class="live-text">LIVE</span>
              <span class="live-time">{{ lastUpdateTime }}</span>
            </div>
          </div>
          <div class="header-right">
            <button class="action-btn" @click="openNewIssue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/>
              </svg>
              <span class="btn-text">ISSUE</span>
            </button>
            <button class="action-btn primary" @click="openNewPR">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
              </svg>
              <span class="btn-text">PULL</span>
            </button>
            <button class="action-btn" @click="refreshAllData" :disabled="isSyncing">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ spin: isSyncing }">
                <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9" />
                <path d="M21 3v6h-6" />
              </svg>
            </button>
            <button class="action-btn theme-toggle-btn" @click="toggleTheme" :title="isLightTheme ? 'Dark Mode' : 'Light Mode'">
              <svg v-if="isLightTheme" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
          </div>
        </header>

        <div class="view-container">
          <!-- DASHBOARD VIEW -->
          <div v-if="currentView === 'dashboard'" class="dashboard-view">
            <!-- Welcome Banner -->
            <div class="dash-welcome">
              <div class="dw-glow"></div>
              <div class="dw-left">
                <div class="dw-avatar-wrap">
                  <img :src="userAvatar" :alt="userLogin" class="dw-avatar">
                  <span class="dw-online"></span>
                </div>
                <div class="dw-text">
                  <h2>Good {{ timeOfDay }}, <span class="dw-name">{{ userLogin }}</span></h2>
                  <p>Wildfire Repository Dashboard — live GitHub data</p>
                </div>
              </div>
              <div class="dw-stats">
                <div class="dws-item">
                  <span class="dws-val">{{ formatNumber(repoStats.totalCommits) }}</span>
                  <span class="dws-lbl">COMMITS</span>
                </div>
                <div class="dws-sep"></div>
                <div class="dws-item">
                  <span class="dws-val">{{ repoStats.contributors }}</span>
                  <span class="dws-lbl">CONTRIBUTORS</span>
                </div>
                <div class="dws-sep"></div>
                <div class="dws-item">
                  <span class="dws-val positive">+{{ Math.abs(commitTrend) }}%</span>
                  <span class="dws-lbl">TREND</span>
                </div>
              </div>
            </div>

            <!-- KPI Row -->
            <div class="kpi-row">
              <div class="kpi-card" v-for="kpi in kpiCards" :key="kpi.id" :style="{ borderLeft: '2.5px solid ' + kpi.color }">
                <div class="kpi-icon" :style="{ background: kpi.color + '22', color: kpi.color }"><span v-html="kpi.icon"></span></div>
                <div class="kpi-body">
                  <span class="kpi-val">{{ kpi.value }}</span>
                  <span class="kpi-lbl">{{ kpi.label }}</span>
                </div>
                <div class="kpi-glow"></div>
              </div>
            </div>

            <!-- Repo Pulse Strip -->
            <div class="repo-pulse-strip">
              <div class="rps-brand">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <span>PULSE</span>
              </div>
              <div class="rps-item"><span class="rps-val">{{ repoPulse.avgPerDay }}</span><span class="rps-lbl">AVG/DAY</span></div>
              <div class="rps-sep"></div>
              <div class="rps-item"><span class="rps-val" style="color:#ffd700">{{ repoPulse.bestDay }}</span><span class="rps-lbl">BEST DAY</span></div>
              <div class="rps-sep"></div>
              <div class="rps-item"><span class="rps-val" style="color:#22c55e">{{ repoPulse.streak }}d</span><span class="rps-lbl">STREAK</span></div>
              <div class="rps-sep"></div>
              <div class="rps-item"><span class="rps-val">{{ repoPulse.lastCommitDaysAgo }}d ago</span><span class="rps-lbl">LAST COMMIT</span></div>
              <div class="rps-sep"></div>
              <div class="rps-item"><span class="rps-val" style="color:#8b5cf6">{{ repoStats.contributors }}</span><span class="rps-lbl">CONTRIBUTORS</span></div>
              <div class="rps-sep"></div>
              <div class="rps-item"><span class="rps-val" :class="commitTrend >= 0 ? 'rps-pos' : 'rps-neg'">{{ commitTrend >= 0 ? '+' : '' }}{{ commitTrend }}%</span><span class="rps-lbl">30D TREND</span></div>
            </div>

            <!-- Wiki Stats -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span>WIKI OVERVIEW</span></div>
            <div class="wiki-stats-card">
              <div class="wsc-header">
                <div class="wsc-header-left">
                  <div class="wsc-icon-wrap">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <div>
                    <div class="wsc-title">WIKI OVERVIEW</div>
                    <div class="wsc-sub">Wildfire Documentation Hub</div>
                  </div>
                </div>
                <div class="wsc-live-badge"><span class="wsc-live-dot"></span><span>LIVE</span></div>
              </div>

              <div class="wsc-kpis">
                <div class="wsc-kpi" style="--kpi-c: var(--accent)">
                  <Icon icon="solar:widget-bold-duotone" width="18" height="18" />
                  <span class="wsc-kpi-val">{{ wikiStats.sections }}</span>
                  <span class="wsc-kpi-lbl">SECTIUNI</span>
                </div>
                <div class="wsc-kpi" style="--kpi-c: #3b82f6">
                  <Icon icon="solar:document-text-bold-duotone" width="18" height="18" />
                  <span class="wsc-kpi-val">{{ wikiStats.pages }}</span>
                  <span class="wsc-kpi-lbl">PAGINI</span>
                </div>
                <div class="wsc-kpi" style="--kpi-c: #22c55e">
                  <Icon icon="solar:pulse-bold-duotone" width="18" height="18" />
                  <span class="wsc-kpi-val">99.9%</span>
                  <span class="wsc-kpi-lbl">UPTIME</span>
                </div>
                <div class="wsc-kpi" style="--kpi-c: #8b5cf6">
                  <Icon icon="solar:chart-square-bold-duotone" width="18" height="18" />
                  <span class="wsc-kpi-val">{{ Math.round(wikiStats.pages / Math.max(wikiStats.sections, 1)) }}</span>
                  <span class="wsc-kpi-lbl">AVG / SEC</span>
                </div>
              </div>

              <div class="wsc-body">
                <div class="wsc-breakdown">
                  <div class="wsc-bk-title">SECTION BREAKDOWN</div>
                  <div v-for="(sec, i) in wikiStats.sectionBreakdown" :key="sec.text" class="wsc-bk-row">
                    <span class="wsc-bk-name">{{ sec.text }}</span>
                    <div class="wsc-bk-track">
                      <div class="wsc-bk-fill" :style="{ width: sec.pct + '%', background: ['var(--accent)','#3b82f6','#22c55e','#8b5cf6','#f59e0b','#ec4899'][i % 6] }"></div>
                    </div>
                    <span class="wsc-bk-count">{{ sec.pages }}</span>
                  </div>
                  <div v-if="!wikiStats.sectionBreakdown.length" class="wsc-bk-empty">No sections found</div>
                </div>

                <div class="wsc-ring-wrap">
                  <div class="wsc-ring-svg-wrap">
                    <svg viewBox="0 0 100 100" width="110" height="110">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="var(--bg-tertiary)" stroke-width="8"/>
                      <circle cx="50" cy="50" r="38" fill="none" stroke="var(--accent)" stroke-width="8"
                        :stroke-dasharray="238.76" :stroke-dashoffset="238.76 * (1 - wikiStats.pagesPercent / 100)"
                        stroke-linecap="round" transform="rotate(-90 50 50)" style="transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"/>
                      <circle cx="50" cy="50" r="27" fill="none" stroke="var(--bg-tertiary)" stroke-width="6"/>
                      <circle cx="50" cy="50" r="27" fill="none" stroke="#3b82f6" stroke-width="6"
                        :stroke-dasharray="169.6" :stroke-dashoffset="169.6 * (1 - Math.min(wikiStats.sections / 10, 1))"
                        stroke-linecap="round" transform="rotate(-90 50 50)" style="transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"/>
                    </svg>
                    <div class="wsc-ring-center">
                      <span class="wsc-ring-val">{{ Math.round(wikiStats.pagesPercent) }}%</span>
                      <span class="wsc-ring-lbl">COVERAGE</span>
                    </div>
                  </div>
                  <div class="wsc-ring-legend">
                    <div class="wsc-rl-item"><span class="wsc-rl-dot" style="background:var(--accent)"></span>Pages</div>
                    <div class="wsc-rl-item"><span class="wsc-rl-dot" style="background:#3b82f6"></span>Sections</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Row -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><span>ACTIVITY &amp; METRICS</span></div>
            <div class="dash-charts">
              <div class="dash-card dash-chart-main" style="border-top: 2.5px solid var(--accent);">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span>COMMIT ACTIVITY · 30 DAYS</span>
                  </div>
                  <span class="dc-badge">{{ dailyCommits.reduce((a, b) => a + b, 0) }} commits</span>
                </div>
                <div class="flame-chart">
                  <!-- KPI Strip -->
                  <div class="fc-kpi-row">
                    <div class="fc-kpi">
                      <span class="fc-kpi-v">{{ dailyCommits.reduce((a,b)=>a+b,0) }}</span>
                      <span class="fc-kpi-l">TOTAL</span>
                    </div>
                    <div class="fc-kpi fc-kpi-accent">
                      <span class="fc-kpi-v">{{ flamePeak ? flamePeak.commits : 0 }}</span>
                      <span class="fc-kpi-l">PEAK DAY</span>
                    </div>
                    <div class="fc-kpi fc-kpi-green">
                      <span class="fc-kpi-v">{{ commitStreak }}</span>
                      <span class="fc-kpi-l">STREAK</span>
                    </div>
                    <div class="fc-kpi">
                      <span class="fc-kpi-v">{{ activeDaysPct }}%</span>
                      <span class="fc-kpi-l">ACTIVE</span>
                    </div>
                    <div class="fc-kpi">
                      <span class="fc-kpi-v">{{ repoPulse.avgPerDay }}</span>
                      <span class="fc-kpi-l">AVG / DAY</span>
                    </div>
                  </div>
                  <!-- Main chart -->
                  <div style="position:relative;cursor:crosshair" @mousemove="onFlameMouseMove" @mouseleave="hoveredBarIndex = null">
                    <svg class="fc-svg" viewBox="0 0 640 200" preserveAspectRatio="none" width="100%" height="200"
                      @mousemove="onFlameMouseMove" @mouseleave="hoveredBarIndex = null">
                      <defs>
                        <linearGradient id="fcBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" style="stop-color:var(--accent)" stop-opacity="1"/>
                          <stop offset="55%" style="stop-color:var(--accent-alt)" stop-opacity="0.85"/>
                          <stop offset="100%" style="stop-color:var(--accent-alt2)" stop-opacity="0.4"/>
                        </linearGradient>
                        <linearGradient id="fcBarGradHov" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" style="stop-color:var(--accent-alt2)" stop-opacity="1"/>
                          <stop offset="50%" style="stop-color:var(--accent)" stop-opacity="1"/>
                          <stop offset="100%" style="stop-color:var(--accent-alt)" stop-opacity="0.85"/>
                        </linearGradient>
                        <linearGradient id="fcAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" style="stop-color:var(--accent)" stop-opacity="0.2"/>
                          <stop offset="100%" style="stop-color:var(--accent)" stop-opacity="0"/>
                        </linearGradient>
                        <filter id="fcGlow" x="-60%" y="-60%" width="220%" height="220%">
                          <feGaussianBlur stdDeviation="4" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      <!-- Grid lines -->
                      <line x1="0" y1="35" x2="640" y2="35" :stroke="isLightTheme ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.025)'" stroke-width="1" pointer-events="none"/>
                      <line x1="0" y1="80" x2="640" y2="80" :stroke="isLightTheme ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.025)'" stroke-width="1" pointer-events="none"/>
                      <line x1="0" y1="125" x2="640" y2="125" :stroke="isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.03)'" stroke-width="1" pointer-events="none"/>
                      <line x1="0" y1="162" x2="640" y2="162" :stroke="isLightTheme ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.07)'" stroke-width="1" pointer-events="none"/>
                      <!-- Avg dashed line -->
                      <line v-if="flameAvgY !== null" x1="0" :y1="flameAvgY" x2="640" :y2="flameAvgY"
                        style="stroke:var(--accent-mid)" stroke-width="1.5" stroke-dasharray="5,4" pointer-events="none"/>
                      <!-- Area fill (smooth) -->
                      <path :d="flamePath" fill="url(#fcAreaGrad)" pointer-events="none"/>
                      <!-- 7-day rolling average line -->
                      <path v-if="movingAvgPath" :d="movingAvgPath"
                        fill="none" style="stroke:var(--accent-alt2)" stroke-opacity="0.7" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
                      <!-- Weekend + column bg shading -->
                      <rect v-for="(b, i) in flameBarData" :key="'col'+i"
                        :x="b.x" y="0" :width="b.w" height="165"
                        :fill="b.isWeekend ? 'rgba(120,80,255,0.065)' : 'transparent'"
                        pointer-events="none" rx="1"/>
                      <!-- Hover column highlight -->
                      <rect v-if="hoveredBarIndex !== null && flameBarData[hoveredBarIndex]"
                        :x="flameBarData[hoveredBarIndex].x" y="0"
                        :width="flameBarData[hoveredBarIndex].w" height="165"
                        rx="3" style="fill:var(--accent-dim)" pointer-events="none"/>
                      <!-- Bars — pointer-events none, mouse captured by overlay below -->
                      <rect v-for="(b, i) in flameBarData" :key="i"
                        :x="b.x" :y="b.y" :width="b.w" :height="b.h" rx="3" ry="3"
                        :style="{ fill: b.commits > 0 ? (hoveredBarIndex === i ? 'url(#fcBarGradHov)' : 'url(#fcBarGrad)') : 'var(--accent-dim)' }"
                        :filter="hoveredBarIndex === i && b.commits > 0 ? 'url(#fcGlow)' : ''"
                        :opacity="hoveredBarIndex !== null && hoveredBarIndex !== i && b.commits > 0 ? 0.28 : 1"
                        pointer-events="none"/>
                      <!-- Peak marker -->
                      <g v-if="flamePeak" pointer-events="none">
                        <circle :cx="flamePeak.cx" :cy="flamePeak.y - 3" r="4.5" style="fill:var(--accent-alt2)" filter="url(#fcGlow)" opacity="0.9"/>
                        <circle :cx="flamePeak.cx" :cy="flamePeak.y - 3" r="2.5" fill="#fff" opacity="1"/>
                      </g>
                      <!-- Today dot -->
                      <circle v-if="flameBarData.length"
                        :cx="flameBarData[flameBarData.length-1].cx" cy="163" r="3"
                        style="fill:var(--accent)" filter="url(#fcGlow)" pointer-events="none"/>
                      <!-- Transparent full-area mouse trap — the ONLY element handling events -->
                      <rect x="0" y="0" width="640" height="200" fill="transparent" style="cursor:crosshair"/>
                    </svg>
                    <!-- HTML label + tooltip layer -->
                    <div class="fc-html-layer">
                      <div class="fc-month-badge">{{ flameMonthRange }}</div>
                      <div v-if="flamePeak" class="fc-peak-lbl"
                        :style="{ left: (flamePeak.cx / 640 * 100) + '%', top: ((flamePeak.y - 3) / 200 * 100) + '%' }">{{ flamePeak.commits }}</div>
                      <div v-if="flameAvgY !== null" class="fc-avg-lbl"
                        :style="{ top: (flameAvgY / 200 * 100) + '%' }">AVG {{ repoPulse.avgPerDay }}</div>
                      <span v-for="(b, i) in flameBarData" :key="'hl'+i"
                        class="fc-date-lbl"
                        :class="{ 'fc-date-today': i === flameBarData.length - 1, 'fc-date-weekend': b.isWeekend }"
                        :style="{ left: (b.cx / 640 * 100) + '%' }">{{ b.dayLabel }}</span>
                      <div v-if="hoveredBarIndex !== null && tooltipPos" class="fc-tip"
                        :style="{ left: (tooltipPos.tx / 640 * 100) + '%', top: (tooltipPos.ty / 200 * 100) + '%' }">
                        <div class="fc-tip-count">{{ flameBarData[hoveredBarIndex].commits === 0 ? 'No commits' : flameBarData[hoveredBarIndex].commits + (flameBarData[hoveredBarIndex].commits !== 1 ? ' commits' : ' commit') }}</div>
                        <div class="fc-tip-date">{{ flameBarData[hoveredBarIndex].fullLabel }}</div>
                        <div v-if="flameBarData[hoveredBarIndex].commits > 0" class="fc-tip-pct">{{ Math.round(flameBarData[hoveredBarIndex].pct * 100) }}% of peak</div>
                      </div>
                    </div>
                  </div>
                  <!-- Intensity heatmap strip -->
                  <div class="fc-heatmap-wrap">
                    <span class="fc-hm-label">INTENSITY</span>
                    <div class="fc-heatmap-row">
                      <div v-for="(b, i) in flameBarData" :key="'hc'+i"
                        class="fc-hm-cell"
                        :class="'fc-hm-' + (b.commits === 0 ? 0 : b.pct < 0.25 ? 1 : b.pct < 0.5 ? 2 : b.pct < 0.75 ? 3 : 4)"
                        :title="b.fullLabel + ': ' + b.commits + ' commit' + (b.commits !== 1 ? 's' : '')"
                        @mouseenter="hoveredBarIndex = i"
                        @mouseleave="hoveredBarIndex = null"/>
                    </div>
                    <div class="fc-hm-legend">
                      <span>Less</span>
                      <div class="fc-hm-cell fc-hm-0"/>
                      <div class="fc-hm-cell fc-hm-1"/>
                      <div class="fc-hm-cell fc-hm-2"/>
                      <div class="fc-hm-cell fc-hm-3"/>
                      <div class="fc-hm-cell fc-hm-4"/>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dash-card dash-repo-card">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                    <span>REPOSITORY</span>
                  </div>
                </div>
                <div class="rs-rings">
                  <div class="rs-ring-item" v-for="ring in repoRings" :key="ring.label">
                    <div class="rs-ring-svg-wrap">
                      <svg width="66" height="66" viewBox="0 0 66 66">
                        <circle cx="33" cy="33" r="26" fill="none" stroke="var(--bg-tertiary)" stroke-width="5"/>
                        <circle cx="33" cy="33" r="26" fill="none" :stroke="ring.color" stroke-width="5"
                          :stroke-dasharray="163.4" :stroke-dashoffset="163.4 * (1 - ring.pct / 100)"
                          stroke-linecap="round" transform="rotate(-90 33 33)"/>
                      </svg>
                      <div class="rs-ring-center">
                        <span class="rs-ring-val">{{ ring.val }}</span>
                      </div>
                    </div>
                    <span class="rs-ring-lbl">{{ ring.label }}</span>
                  </div>
                </div>
                <div class="lang-section" v-if="languageStats.length">
                  <span class="lang-title">LANGUAGES</span>
                  <div class="lang-bar-track">
                    <div v-for="l in languageStats.slice(0,6)" :key="l.name" class="lang-seg"
                      :style="{ width: l.percentage + '%', background: getLangColor(l.name) }"
                      :title="`${l.name}: ${l.percentage.toFixed(1)}%`"></div>
                  </div>
                  <div class="lang-keys">
                    <span v-for="l in languageStats.slice(0,5)" :key="l.name" class="lang-key">
                      <span class="lang-dot" :style="{ background: getLangColor(l.name) }"></span>
                      {{ l.name }} <em>{{ l.percentage.toFixed(0) }}%</em>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Feeds Row -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg><span>RECENT COMMITS</span><span class="dsl-badge">{{ recentCommits.length }}</span></div>
            <div class="dash-card commits-panel">
              <div class="dc-head">
                <div class="dc-head-left">
                  <span class="live-dot-sm"></span>
                  LATEST PUSHES
                </div>
                <span class="dc-badge">last {{ recentCommits.slice(0,6).length }} of {{ recentCommits.length }}</span>
              </div>
              <div class="commits-grid">
                <div v-for="commit in recentCommits.slice(0, 6)" :key="commit.id" class="commit-card" @click="openCommit(commit.url)">
                  <div class="cc-top">
                    <img :src="commit.avatar || `https://github.com/${commit.author}.png`" :alt="commit.author" class="cc-avatar">
                    <code class="cc-hash">{{ commit.id }}</code>
                    <svg class="cc-arrow" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <div class="cc-msg">{{ truncate(commit.message, 68) }}</div>
                  <div class="cc-meta">
                    <span class="cc-author">@{{ commit.author }}</span>
                    <span class="cc-sep">·</span>
                    <span class="cc-time">{{ timeAgo(commit.date) }}</span>
                  </div>
                </div>
                <div v-if="recentCommits.length === 0" class="ipr-empty" style="grid-column:1/-1">No commits yet</div>
              </div>
            </div>

            <!-- Top Contributors -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><span>TOP CONTRIBUTORS</span><span class="dsl-badge">{{ topContributors.length }}</span></div>
            <div class="tc-list">
              <div
                v-for="(c, i) in topContributors.slice(0, 10)"
                :key="c.login"
                class="tc-row"
                @click="openProfile(c.login)"
              >
                <div class="tc-rank-badge" :class="i===0?'tcr-1':i===1?'tcr-2':i===2?'tcr-3':'tcr-n'">{{ i + 1 }}</div>
                <img :src="c.avatar_url" :alt="c.login" class="tc-avatar">
                <div class="tc-info">
                  <div class="tc-name">{{ c.login }}</div>
                  <div class="tc-bar-row">
                    <div class="tc-bar-track">
                      <div class="tc-bar-fill"
                        :style="{ width: (c.contributions / maxContributions * 100) + '%', background: i===0 ? 'linear-gradient(90deg,#ffd700,var(--accent-alt2))' : i===1 ? 'linear-gradient(90deg,#a0a0a0,#c0c0c0)' : i===2 ? 'linear-gradient(90deg,#a05a20,#cd7f32)' : 'linear-gradient(90deg,var(--accent),var(--accent-alt2))' }"
                      ></div>
                    </div>
                    <span class="tc-commits-badge">{{ formatNumber(c.contributions) }}</span>
                  </div>
                </div>
              </div>
              <div v-if="!topContributors.length" class="tc-empty">No contributors yet</div>
            </div>

            <!-- Recent Feedbacks -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>RECENT FEEDBACK</span><span class="dsl-badge">{{ recentFeedbacks.length }}</span></div>
            <div class="fb-mini">
              <div v-if="feedbackLoading" class="fb-mini-loading">
                <div class="fb-mini-spinner"></div> Loading feedbacks…
              </div>
              <div v-else-if="!recentFeedbacks.length" class="fb-mini-empty">No feedback submitted yet</div>
              <div v-else class="fb-mini-list">
                <div v-for="fb in recentFeedbacks" :key="fb.id" class="fb-mini-row">
                  <div class="fb-mini-dot" :class="fb.sentiment==='good'?'fb-dot-good':'fb-dot-bad'">
                    <svg v-if="fb.sentiment==='good'" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg>
                    <svg v-else viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/></svg>
                  </div>
                  <div class="fb-mini-body">
                    <div class="fb-mini-page">{{ fb.pageTitle }}</div>
                    <div class="fb-mini-comment" v-if="fb.comment">{{ fb.comment }}</div>
                    <div class="fb-mini-meta">
                      <div class="fb-mini-stars" v-if="fb.stars > 0">
                        <svg v-for="s in fb.stars" :key="s" viewBox="0 0 24 24" width="8" height="8" fill="#ffd700" stroke="#ffd700" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                      <span class="fb-mini-time">{{ timeAgo(fb.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="fb-mini-footer">
                <span class="fb-mini-total">{{ feedbackTotal }} total feedbacks</span>
                <button class="fb-mini-link" @click="currentView = 'feedbacks'">
                  VIEW ALL
                  <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <!-- Issues + PRs -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg><span>OPEN ITEMS</span></div>
            <div class="dash-ipr">
              <div class="dash-card ipr-panel">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <span class="ipr-status-dot issue-dot"></span>
                    OPEN ISSUES
                  </div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="dc-badge blue">{{ recentIssues.length }}</span>
                    <button class="ipr-new-btn" @click.stop="openNewIssue()" title="New issue">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
                <div class="ipr-list">
                  <div v-for="issue in recentIssues.slice(0, 7)" :key="issue.id" class="ipr-row" @click="openIssue(issue.url)">
                    <img :src="issue.avatar || `https://github.com/${issue.author}.png`" :alt="issue.author" class="ipr-avatar">
                    <div class="ipr-body">
                      <div class="ipr-title-row">
                        <span class="ipr-num-badge blue">#{{ issue.number }}</span>
                        <span class="ipr-title">{{ truncate(issue.title, 38) }}</span>
                      </div>
                      <div class="ipr-meta-row">
                        <span class="ipr-author">@{{ issue.author }}</span>
                        <span class="ipr-sep">·</span>
                        <span class="ipr-time">{{ timeAgo(issue.date) }}</span>
                      </div>
                    </div>
                    <svg class="ipr-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <div v-if="recentIssues.length === 0" class="ipr-empty">
                    <span>No open issues</span>
                  </div>
                </div>
              </div>
              <div class="dash-card ipr-panel">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <span class="ipr-status-dot pr-dot"></span>
                    OPEN PULL REQUESTS
                  </div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="dc-badge green">{{ recentPRs.length }}</span>
                    <button class="ipr-new-btn" @click.stop="openNewPR()" title="New PR">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
                <div class="ipr-list">
                  <div v-for="pr in recentPRs.slice(0, 7)" :key="pr.id" class="ipr-row" @click="openPR(pr.url)">
                    <img :src="pr.avatar || `https://github.com/${pr.author}.png`" :alt="pr.author" class="ipr-avatar">
                    <div class="ipr-body">
                      <div class="ipr-title-row">
                        <span class="ipr-num-badge green">#{{ pr.number }}</span>
                        <span class="ipr-title">{{ truncate(pr.title, 38) }}</span>
                      </div>
                      <div class="ipr-meta-row">
                        <span class="ipr-author">@{{ pr.author }}</span>
                        <span class="ipr-sep">·</span>
                        <span class="ipr-time">{{ timeAgo(pr.date) }}</span>
                      </div>
                    </div>
                    <svg class="ipr-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <div v-if="recentPRs.length === 0" class="ipr-empty">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" opacity=".3"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
                    <span>No open pull requests</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Live Overview -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>LIVE OVERVIEW</span></div>
            <div class="dash-weekly">
              <div class="dash-card activity-timeline-card">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <span class="live-dot-sm"></span>
                    LIVE ACTIVITY
                  </div>
                  <span class="dc-badge">{{ auditLog.length }} events</span>
                </div>
                <div class="at-list">
                  <div v-for="event in auditLog.slice(0, 10)" :key="event.id" class="at-row" :class="'at-' + event.type" @click="event.url && openCommit(event.url)">
                    <div class="at-line"></div>
                    <div class="at-icon-wrap" :class="'ati-' + event.type">
                      <svg v-if="event.type === 'commit'" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
                      <svg v-else-if="event.type === 'pr'" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
                      <svg v-else viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>
                    </div>
                    <img :src="event.avatar || `https://github.com/${event.author}.png`" :alt="event.author" class="at-avatar">
                    <div class="at-body">
                      <span class="at-msg">{{ truncate(event.message, 48) }}</span>
                      <div class="at-meta">
                        <span class="at-author">@{{ event.author }}</span>
                        <span class="at-sep">·</span>
                        <span class="at-time">{{ timeAgo(event.timestamp) }}</span>
                        <span v-if="event.number" class="at-num">#{{ event.number }}</span>
                      </div>
                    </div>
                    <span class="at-type-pill" :class="'pill-' + event.type">{{ event.type }}</span>
                  </div>
                  <div v-if="!auditLog.length" class="ipr-empty">No activity yet</div>
                </div>
              </div>

              <div class="dash-card repo-health-card">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    REPO HEALTH
                  </div>
                  <span class="dc-badge">LIVE</span>
                </div>
                <div class="rh-rows">
                  <div class="rh-row">
                    <div class="rh-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#22c55e"><polyline points="20 6 9 17 4 12"/></svg>
                      Commit Velocity
                    </div>
                    <div class="rh-bar-wrap">
                      <div class="rh-bar green" :style="{ width: Math.min(repoPulse.avgPerDay / 10 * 100, 100) + '%' }"></div>
                    </div>
                    <span class="rh-val">{{ repoPulse.avgPerDay }}/d</span>
                  </div>
                  <div class="rh-row">
                    <div class="rh-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#3b82f6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Active Days
                    </div>
                    <div class="rh-bar-wrap">
                      <div class="rh-bar blue" :style="{ width: activeDaysPct + '%' }"></div>
                    </div>
                    <span class="rh-val">{{ activeDaysPct }}%</span>
                  </div>
                  <div class="rh-row">
                    <div class="rh-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#f59e0b"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                      Current Streak
                    </div>
                    <div class="rh-bar-wrap">
                      <div class="rh-bar orange" :style="{ width: Math.min(commitStreak / 30 * 100, 100) + '%' }"></div>
                    </div>
                    <span class="rh-val">{{ commitStreak }}d</span>
                  </div>
                  <div class="rh-row">
                    <div class="rh-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#8b5cf6"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
                      Open PRs
                    </div>
                    <div class="rh-bar-wrap">
                      <div class="rh-bar purple" :style="{ width: Math.min(recentPRs.length / 20 * 100, 100) + '%' }"></div>
                    </div>
                    <span class="rh-val">{{ recentPRs.length }}</span>
                  </div>
                  <div class="rh-row">
                    <div class="rh-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#e74c3c"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>
                      Open Issues
                    </div>
                    <div class="rh-bar-wrap">
                      <div class="rh-bar red" :style="{ width: Math.min(recentIssues.length / 20 * 100, 100) + '%' }"></div>
                    </div>
                    <span class="rh-val">{{ recentIssues.length }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>QUICK ACTIONS</span></div>
            <div class="qa-row">
              <button class="qa-btn qa-blue" @click="openNewIssue()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>
                <span>New Issue</span>
              </button>
              <button class="qa-btn qa-green" @click="openNewPR()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
                <span>New Pull Request</span>
              </button>
              <button class="qa-btn qa-orange" @click="currentView = 'contributors'">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>All Contributors</span>
              </button>
              <button class="qa-btn qa-purple" @click="currentView = 'audit'">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span>Audit Log</span>
              </button>
              <button class="qa-btn qa-red" @click="currentView = 'analytics'">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <span>Analytics</span>
              </button>
              <button class="qa-btn qa-teal" @click="refreshAllData()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                <span>Sync Now</span>
              </button>
            </div>

            <!-- Activity Calendar -->
            <div class="dash-slabel">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>ACTIVITY CALENDAR</span>
            </div>
            <div class="act-cal-card" :class="{ 'act-cal-expanded': calendarExpanded }">
              <div class="act-cal-meta">
                <div class="act-cal-meta-left">
                  <span class="act-cal-title">{{ currentCalMonthLabel }}</span>
                  <span class="act-cal-badge">{{ heatmapCells.filter(c => !c.isEmpty && c.commits > 0).length }} active days</span>
                </div>
                <div class="act-cal-meta-right">
                  <div class="act-cal-legend">
                    <span>Less</span>
                    <span class="acl-cell intensity-0"></span>
                    <span class="acl-cell intensity-1"></span>
                    <span class="acl-cell intensity-2"></span>
                    <span class="acl-cell intensity-3"></span>
                    <span class="acl-cell intensity-4"></span>
                    <span>More</span>
                  </div>
                  <button class="act-cal-toggle" @click="calendarExpanded = !calendarExpanded" :title="calendarExpanded ? 'Collapse' : 'Expand'">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline v-if="calendarExpanded" points="18 15 12 9 6 15"/>
                      <polyline v-else points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="act-cal-months">
                <button
                  v-for="month in availableCalMonths"
                  :key="month.key"
                  class="acm-btn"
                  :class="{ 'acm-active': selectedCalMonth === month.key }"
                  @click="selectedCalMonth = month.key; selectedCalCell = null"
                >{{ month.label }}<span class="acm-count" v-if="month.total > 0">{{ month.total }}</span></button>
              </div>
              <div class="act-cal-dow">
                <span v-for="(d, i) in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="i">{{ d }}</span>
              </div>
              <div class="act-cal-grid">
                <div
                  v-for="(cell, i) in heatmapCells"
                  :key="i"
                  class="act-cal-cell"
                  :class="[cell.isEmpty ? 'act-cal-cell-empty' : 'intensity-' + cell.intensity, { 'act-cal-cell-selected': !cell.isEmpty && selectedCalCell && selectedCalCell.dateStr === cell.dateStr }]"
                  :title="cell.isEmpty ? '' : cell.label + ' · ' + cell.commits + (cell.commits === 1 ? ' commit' : ' commits')"
                  @click="cell.isEmpty || selectCalCell(cell)"
                >
                  <span v-if="!cell.isEmpty" class="acc-day">{{ cell.dayNum }}</span>
                </div>
              </div>
              <div class="act-cal-detail" v-if="calendarExpanded && selectedCalCell">
                <div class="acd-header">
                  <div class="acd-date-info">
                    <span class="acd-date-full">{{ selectedCalCell.fullLabel }}</span>
                    <div class="acd-stats-row">
                      <span class="acd-stat-pill">{{ selectedCalCell.commits }} commit{{ selectedCalCell.commits !== 1 ? 's' : '' }}</span>
                      <a class="acd-gh-link" :href="`https://github.com/${repoOwner}/${repoName}/commits?since=${selectedCalCell.dateStr}T00:00:00Z&until=${selectedCalCell.dateStr}T23:59:59Z`" target="_blank">View on GitHub →</a>
                    </div>
                  </div>
                  <button class="acd-close" @click="selectedCalCell = null">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div class="acd-empty" v-if="selectedCalCell.commits === 0">No activity on this day.</div>
                <div class="acd-no-data" v-else-if="selectedDayCommits.length === 0">
                  {{ selectedCalCell.commits }} commit{{ selectedCalCell.commits !== 1 ? 's' : '' }} — not in loaded history.
                  <a :href="`https://github.com/${repoOwner}/${repoName}/commits?since=${selectedCalCell.dateStr}T00:00:00Z&until=${selectedCalCell.dateStr}T23:59:59Z`" target="_blank">View on GitHub</a>
                </div>
                <div class="acd-commits" v-else>
                  <div class="acd-commit-row" v-for="commit in selectedDayCommits" :key="commit.sha">
                    <img :src="commit.avatar" :alt="commit.author" class="acd-avatar">
                    <div class="acd-commit-body">
                      <div class="acd-commit-msg" @click="openCommit(commit.url)">{{ commit.message }}</div>
                      <div class="acd-commit-meta">
                        <span class="acd-author">@{{ commit.author }}</span>
                        <code class="acd-sha" @click="openCommit(commit.url)">{{ commit.id }}</code>
                        <template v-if="commitFilesCache[commit.sha]">
                          <span class="acd-files-count">{{ commitFilesCache[commit.sha].files }} files</span>
                          <span class="acd-additions">+{{ commitFilesCache[commit.sha].additions }}</span>
                          <span class="acd-deletions">−{{ commitFilesCache[commit.sha].deletions }}</span>
                        </template>
                        <span v-else class="acd-loading">loading…</span>
                      </div>
                      <div class="acd-file-chips" v-if="commitFilesCache[commit.sha] && commitFilesCache[commit.sha].fileNames.length">
                        <span class="acd-file-chip" v-for="f in commitFilesCache[commit.sha].fileNames" :key="f">{{ f.split('/').pop() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Weekly Rhythm -->
            <div class="dash-slabel">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>WEEKLY RHYTHM</span>
            </div>
            <div class="week-rhythm-card">
              <div class="wrc-header">
                <span class="wrc-title">Commit patterns by day of week · last 90 days</span>
                <span class="wrc-peak" v-if="weekdayPeak && weekdayPeak.avg > 0">
                  Peak: <strong>{{ weekdayPeak.name }}</strong> ({{ weekdayPeak.avg }}/day avg)
                </span>
              </div>
              <div class="wrc-bars">
                <div
                  v-for="(day, i) in weekdayPattern"
                  :key="day.name"
                  class="wrc-row"
                  :class="{ 'wrc-weekend': day.isWeekend, 'wrc-peak': weekdayPeak && day.name === weekdayPeak.name }"
                >
                  <span class="wrc-day">{{ day.name }}</span>
                  <div class="wrc-track">
                    <div class="wrc-fill" :style="{ width: (day.pct * 100) + '%' }"></div>
                    <div class="wrc-fill-glow" v-if="weekdayPeak && day.name === weekdayPeak.name" :style="{ width: (day.pct * 100) + '%' }"></div>
                  </div>
                  <span class="wrc-avg">{{ day.avg }}<span class="wrc-unit">/d</span></span>
                  <span class="wrc-total">{{ day.total }}</span>
                </div>
              </div>
            </div>

          </div>

          <PanelFiles 
            v-else-if="currentView === 'files'"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
            :repo-branch="repoBranch"
            :is-light-theme="isLightTheme"
          />

          <PanelContributors 
            v-else-if="currentView === 'contributors'"
            :contributors="allContributorsData"
            :total-commits="repoStats.totalCommits"
            :is-light-theme="isLightTheme"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
          />

          <PanelAudit 
            v-else-if="currentView === 'audit'"
            :audit-logs="auditLog"
            :is-light-theme="isLightTheme"
          />

          <PanelAnalytics 
            v-else-if="currentView === 'analytics'"
            :daily-commits="dailyCommits"
            :weekly-commits="weeklyCommits"
            :language-stats="languageStats"
            :contributors="allContributorsData"
            :total-commits="repoStats.totalCommits"
            :is-light-theme="isLightTheme"
            :panel-theme="panelTheme"
          />

          <PanelFeedbacks
            v-else-if="currentView === 'feedbacks'"
            :github-token="githubToken"
            :is-light-theme="isLightTheme"
          />

          <PanelProfile
            v-else-if="currentView === 'profile'"
            :user-login="userLogin"
            :user-avatar="userAvatar"
            :github-token="githubToken"
            :is-light-theme="isLightTheme"
            :panel-theme="panelTheme"
            :contributors="allContributorsData"
            :daily-commits="dailyCommits"
            :total-commits="repoStats.totalCommits"
            :repo-owner="repoOwner"
            :repo-name="repoName"
            @toggle-theme="toggleTheme"
            @logout="handleLogout"
            @set-theme="setPanelTheme"
          />
        </div>
      </main>

      <!-- ── Mobile Bottom Navigation ── -->
      <nav class="mobile-bottom-nav">
        <div
          v-for="item in navItems" :key="item.id"
          class="mbn-item"
          :class="{ active: currentView === item.id }"
          @click="handleNavClick(item)">
          <span class="mbn-icon" v-html="item.icon"></span>
          <span class="mbn-label">{{ item.label }}</span>
          <span class="mbn-live" v-if="item.badge"></span>
        </div>
      </nav>

    </div>
  </Teleport>
</template>

<script>
    import { useData } from 'vitepress'
    import PanelLogin from './PanelLogin.vue'
    import PanelFiles from './PanelFiles.vue'
    import PanelContributors from './PanelContributors.vue'
    import PanelAudit from './PanelAudit.vue'
    import PanelAnalytics from './PanelAnalytics.vue'
    import PanelProfile from './PanelProfile.vue'
    import PanelFeedbacks from './PanelFeedbacks.vue'
    import { Icon } from '@iconify/vue'

    export default {
      name: 'Dashboard',
      
      components: {
        PanelLogin,
        PanelFiles,
        PanelContributors,
        PanelAudit,
        PanelAnalytics,
        PanelProfile,
        PanelFeedbacks,
        Icon
      },
      
      setup() {
        const { theme } = useData()
        return { vpTheme: theme }
      },
      
      props: {
        repoOwner: {
          type: String,
          default: 'Wildfiire'
        },
        repoName: {
          type: String,
          default: 'docs'
        },
        repoBranch: {
          type: String,
          default: 'main'
        }
      },
      
      data() {
        return {
          isAuthenticated: false,
          githubToken: '',
          
          sidebarCollapsed: false,
          currentView: 'dashboard',
          isLightTheme: false,
          panelTheme: 'fire',
          isMounted: false,
          isSyncing: false,
          isScrolled: false,
          lastUpdateTime: '—',
          
          userLogin: '',
          userAvatar: '',
          
          repoStats: {
            totalCommits: 0,
            contributors: 0,
            files: 0,
            stars: 0,
            forks: 0,
            watchers: 0,
            openIssues: 0,
            openPRs: 0
          },
          
          commitTrend: 0,
          recentCommits: [],
          topContributors: [],
          recentIssues: [],
          recentPRs: [],
          allContributorsData: [],
          auditLog: [],
          hoveredBarIndex: null,
          selectedCalCell: null,
          selectedCalMonth: '',
          calendarCommits: [],
          calendarDailyMap: {},
          commitFilesCache: {},
          dailyCommits: [],
          weeklyCommits: [],
          languageStats: [],
          calendarExpanded: false,
          recentFeedbacks: [],
          feedbackLoading: false,
          feedbackTotal: 0,
          
          navItems: [
            { id: 'dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>', label: 'DASHBOARD' },
            { id: 'files', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>', label: 'FILES' },
            { id: 'contributors', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'CONTRIBUTORS', badge: 'LIVE' },
            { id: 'audit', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>', label: 'AUDIT', badge: 'LIVE' },
            { id: 'analytics', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/></svg>', label: 'ANALYTICS' },
            { id: 'profile', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'MY PROFILE' },
            { id: 'feedbacks', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', label: 'FEEDBACKS' }
          ]
        }
      },
      
      computed: {
        wikiStats() {
          const config = this.vpTheme || {}
          let pages = 0
          const countPages = (items) => {
            if (!items || !Array.isArray(items)) return
            items.forEach(item => {
              if (item.link) pages++
              if (item.items) countPages(item.items)
            })
          }
          let sections = 0
          const sectionBreakdown = []
          if (config.sidebar && Array.isArray(config.sidebar)) {
            sections = config.sidebar.length
            config.sidebar.forEach(section => {
              const before = pages
              if (section.link) pages++
              if (section.items) countPages(section.items)
              sectionBreakdown.push({ text: (section.text || '-').replace(/<[^>]*>/g, '').trim(), pages: pages - before })
            })
          }
          const maxSec = Math.max(...sectionBreakdown.map(s => s.pages), 1)
          return {
            sections,
            pages,
            pagesPercent: Math.min((pages / 60) * 100, 100),
            sectionBreakdown: sectionBreakdown.map(s => ({ ...s, pct: Math.round(s.pages / maxSec * 100) }))
          }
        },
        currentViewTitle() {
          const item = this.navItems.find(i => i.id === this.currentView)
          return item?.label || 'DASHBOARD'
        },
        timeOfDay() {
          const h = new Date().getHours()
          if (h < 12) return 'morning'
          if (h < 17) return 'afternoon'
          return 'evening'
        },
        kpiCards() {
          return [
            { id: 'commits',      label: 'TOTAL COMMITS', value: this.formatNumber(this.repoStats.totalCommits), icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>', bg: 'var(--accent-glow)',    color: 'var(--accent)' },
            { id: 'contributors', label: 'CONTRIBUTORS',  value: String(this.repoStats.contributors),            icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', bg: 'rgba(52,152,219,0.2)',  color: '#3498db' },
            { id: 'files',        label: 'FILES',          value: this.formatNumber(this.repoStats.files),        icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>', bg: 'rgba(155,89,182,0.2)', color: '#9b59b6' },
            { id: 'prs',          label: 'OPEN PULLS',     value: String(this.repoStats.openPRs),                 icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>',                                                                                                                                   bg: 'rgba(46,204,113,0.2)',  color: '#2ecc71' },
            { id: 'issues',       label: 'OPEN ISSUES',    value: String(this.repoStats.openIssues),              icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>',                                                                                                                                                 bg: 'rgba(243,156,18,0.2)',  color: '#f39c12' }
          ]
        },
        repoRings() {
          const s = this.repoStats
          const items = [
            { label: 'Stars',    val: this.formatNumber(s.stars    || 0), raw: s.stars    || 0, color: '#ffd700' },
            { label: 'Forks',    val: this.formatNumber(s.forks    || 0), raw: s.forks    || 0, color: '#22c55e' },
            { label: 'Watchers', val: this.formatNumber(s.watchers || 0), raw: s.watchers || 0, color: '#3b82f6' },
            { label: 'Files',    val: this.formatNumber(s.files    || 0), raw: s.files    || 0, color: 'var(--accent)' }
          ]
          const maxRaw = Math.max(...items.map(i => i.raw), 1)
          return items.map(i => ({ ...i, pct: Math.max(Math.round(i.raw / maxRaw * 100), 8) }))
        },
        repoPulse() {
          const c = this.dailyCommits
          if (!c.length) return { avgPerDay: 0, bestDay: 0, streak: 0, lastCommitDaysAgo: 0 }
          const total = c.reduce((a, b) => a + b, 0)
          const avgPerDay = Math.round(total / 30 * 10) / 10
          const bestDay = Math.max(...c)
          let maxStreak = 0, cur = 0
          for (let i = c.length - 1; i >= 0; i--) {
            if (c[i] > 0) { cur++; if (cur > maxStreak) maxStreak = cur } else cur = 0
          }
          let lastCommitDaysAgo = 0
          for (let i = c.length - 1; i >= 0; i--) {
            if (c[i] > 0) { lastCommitDaysAgo = c.length - 1 - i; break }
          }
          return { avgPerDay, bestDay, streak: maxStreak, lastCommitDaysAgo }
        },
        flameBarData() {
          const commits = this.dailyCommits
          if (!commits.length) return []
          const max = Math.max(...commits, 1)
          const totalBars = commits.length
          const barW = 20, step = 21, baseline = 165, maxBarH = 148
          const startX = (640 - totalBars * step + (step - barW)) / 2
          const now = new Date()
          return commits.map((c, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (totalBars - 1 - i))
            const pct = max > 0 ? c / max : 0
            const h = c > 0 ? Math.max(pct * maxBarH, 5) : 4
            const x = startX + i * step
            return {
              commits: c,
              pct,
              x: parseFloat(x.toFixed(1)),
              y: parseFloat((baseline - h).toFixed(1)),
              w: barW,
              h: parseFloat(h.toFixed(1)),
              cx: parseFloat((x + barW / 2).toFixed(1)),
              shortLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fullLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              dayLabel: String(d.getDate()),
              isWeekend: d.getDay() === 0 || d.getDay() === 6
            }
          })
        },
        flamePath() {
          const bars = this.flameBarData
          if (bars.length < 2) return ''
          const baseline = 165
          let d = `M${bars[0].cx},${baseline} L${bars[0].cx},${bars[0].y}`
          for (let i = 1; i < bars.length; i++) {
            const cp1x = bars[i-1].cx + (bars[i].cx - bars[i-1].cx) / 3
            const cp2x = bars[i].cx - (bars[i].cx - bars[i-1].cx) / 3
            d += ` C${cp1x},${bars[i-1].y} ${cp2x},${bars[i].y} ${bars[i].cx},${bars[i].y}`
          }
          return d + ` L${bars[bars.length-1].cx},${baseline} Z`
        },
        flamePeak() {
          const bars = this.flameBarData
          if (!bars.length) return null
          let peak = bars[0]
          bars.forEach(b => { if (b.commits > peak.commits) peak = b })
          return peak.commits > 0 ? peak : null
        },
        flameLabelBars() {
          return this.flameBarData.filter((_, i) => i % 7 === 0)
        },
        tooltipPos() {
          if (this.hoveredBarIndex === null) return null
          const b = this.flameBarData[this.hoveredBarIndex]
          if (!b) return null
          const tx = Math.min(Math.max(b.cx - 44, 2), 548)
          const ty = Math.max(b.y - 56, 2)
          return { tx, ty }
        },
        flameAvgY() {
          const commits = this.dailyCommits
          if (!commits.length) return null
          const avg = commits.reduce((a, b) => a + b, 0) / commits.length
          const max = Math.max(...commits, 1)
          return parseFloat((165 - (avg / max) * 148).toFixed(1))
        },
        commitStreak() {
          const c = this.dailyCommits
          let s = 0
          for (let i = c.length - 1; i >= 0; i--) { if (c[i] > 0) s++; else break }
          return s
        },
        activeDaysPct() {
          const c = this.dailyCommits
          if (!c.length) return 0
          return Math.round(c.filter(v => v > 0).length / c.length * 100)
        },
        availableCalMonths() {
          const now = new Date()
          return Array.from({ length: 12 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            let total = 0
            Object.entries(this.calendarDailyMap).forEach(([ds, cnt]) => {
              if (ds.slice(0, 7) === key) total += cnt
            })
            return {
              key,
              label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              shortLabel: d.toLocaleDateString('en-US', { month: 'short' }),
              total
            }
          })
        },
        currentCalMonthLabel() {
          const month = this.selectedCalMonth || (() => {
            const n = new Date()
            return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
          })()
          const found = this.availableCalMonths.find(m => m.key === month)
          return found ? found.label : month
        },
        heatmapCells() {
          const month = this.selectedCalMonth || (() => {
            const n = new Date()
            return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
          })()
          const [y, m] = month.split('-').map(Number)
          const daysInMonth = new Date(y, m, 0).getDate()
          const firstDow = new Date(y, m - 1, 1).getDay()
          const allCounts = Object.values(this.calendarDailyMap)
          const max = allCounts.length ? Math.max(...allCounts, 1) : 1
          const cells = []
          for (let p = 0; p < firstDow; p++) {
            cells.push({ isEmpty: true, commits: 0, intensity: 0, dateStr: null, dayNum: null, label: '', fullLabel: '' })
          }
          for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const c = this.calendarDailyMap[dateStr] || 0
            const pct = c / max
            const intensity = c === 0 ? 0 : pct < 0.25 ? 1 : pct < 0.5 ? 2 : pct < 0.75 ? 3 : 4
            const date = new Date(y, m - 1, d)
            cells.push({
              isEmpty: false, commits: c, intensity, dateStr, dayNum: d,
              label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              fullLabel: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
            })
          }
          return cells
        },
        selectedDayCommits() {
          if (!this.selectedCalCell) return []
          return this.calendarCommits.filter(c => c.date.slice(0, 10) === this.selectedCalCell.dateStr)
        },
        movingAvgPath() {
          const commits = this.dailyCommits
          const bars = this.flameBarData
          if (!bars.length || commits.length < 4) return ''
          const max = Math.max(...commits, 1)
          const baseline = 165, maxBarH = 148
          const points = []
          for (let i = 3; i < commits.length; i++) {
            const win = commits.slice(Math.max(0, i - 6), i + 1)
            const avg = win.reduce((a, b) => a + b, 0) / win.length
            const y = (baseline - (avg / max) * maxBarH).toFixed(1)
            points.push(`${bars[i].cx},${y}`)
          }
          if (points.length < 2) return ''
          return 'M' + points.join(' L')
        },
        flameMonthRange() {
          const bars = this.flameBarData
          if (!bars.length) return ''
          return bars[0].shortLabel + ' – ' + bars[bars.length - 1].shortLabel
        },
        weeklyDayData() {
          const last7 = this.dailyCommits.slice(-7)
          const max = Math.max(...last7, 1)
          const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
          const now = new Date()
          return last7.map((count, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (6 - i))
            return { count, pct: count / max, label: days[d.getDay()] }
          })
        },
        maxContributions() {
          if (!this.topContributors.length) return 1
          return Math.max(...this.topContributors.map(c => c.contributions || 0), 1)
        },
        weekdayPattern() {
          const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
          const totals = [0,0,0,0,0,0,0]
          const counts = [0,0,0,0,0,0,0]
          const raw = this.dailyCommits
          const len = Math.min(raw.length, 90)
          const data = raw.slice(-len)
          const now = new Date()
          data.forEach((count, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (len - 1 - i))
            const wd = d.getDay()
            totals[wd] += count
            counts[wd]++
          })
          const avgs = totals.map((t, i) => counts[i] > 0 ? t / counts[i] : 0)
          const max = Math.max(...avgs, 1)
          return names.map((name, i) => ({
            name,
            avg: parseFloat(avgs[i].toFixed(1)),
            total: totals[i],
            pct: avgs[i] / max,
            isWeekend: i === 0 || i === 6
          }))
        },
        weekdayPeak() {
          if (!this.weekdayPattern.length) return null
          return this.weekdayPattern.reduce((a, b) => b.avg > a.avg ? b : a)
        },
      },
      
      watch: {},
      
      mounted() {
        this.isMounted = true
        const savedTheme = localStorage.getItem('wildfire-theme')
        if (savedTheme === 'light') this.isLightTheme = true
        try { const pt = localStorage.getItem('wf-panel-theme'); if (pt) this.panelTheme = pt } catch (_) {}
        
        const token = localStorage.getItem('github_token')
        const userStr = localStorage.getItem('github_user')
        
        console.log('Dashboard mounted - token:', token ? 'exista' : 'nu exista')
        console.log('Dashboard mounted - user:', userStr)
        
        if (token && userStr) {
          this.githubToken = token
          this.isAuthenticated = true
          const user = JSON.parse(userStr)
          this.userLogin = user.login
          this.userAvatar = user.avatar_url
          
          this.$nextTick(() => {
            if (this.$refs.mainContent) {
              this.$refs.mainContent.addEventListener('scroll', this.handleScroll)
            }
          })
          window.addEventListener('resize', this.handleResize)

          this.refreshAllData()
          setInterval(() => this.refreshAllData(), 30000)
        }
      },
      
      beforeUnmount() {
        if (this.$refs.mainContent) {
          this.$refs.mainContent.removeEventListener('scroll', this.handleScroll)
        }
        window.removeEventListener('resize', this.handleResize)
      },
  
  methods: {
  handleLoginSuccess(data) {
    console.log('Login success!', data)
    this.githubToken = data.token
    this.isAuthenticated = true
    this.userLogin = data.user.login
    this.userAvatar = data.user.avatar_url
    try { const t = localStorage.getItem('wf-panel-theme'); if (t) this.panelTheme = t } catch (_) {}

    this.$nextTick(() => {
      if (this.$refs.mainContent) {
        this.$refs.mainContent.addEventListener('scroll', this.handleScroll)
      }
    })
    window.addEventListener('resize', this.handleResize)

    this.refreshAllData()
    setInterval(() => this.refreshAllData(), 30000)
  },
    
    onFlameMouseMove(e) {
      const svg = e.currentTarget
      const rect = svg.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 640
      const bars = this.flameBarData
      if (!bars.length) { this.hoveredBarIndex = null; return }
      const step = 640 / bars.length
      const idx = Math.min(Math.max(Math.floor(x / step), 0), bars.length - 1)
      this.hoveredBarIndex = idx
    },
    
    setPanelTheme(theme) {
      this.panelTheme = theme
      try { localStorage.setItem('wf-panel-theme', theme) } catch (_) {}
    },

    handleLogout() {
      localStorage.removeItem('github_token')
      localStorage.removeItem('github_user')
      this.isAuthenticated = false
      this.githubToken = ''
      this.userLogin = ''
      this.userAvatar = ''
    },
    
    particleStyle(n) {
      const size = Math.random() * 3 + 1
      return {
        width: size + 'px',
        height: size + 'px',
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: Math.random() * 10 + 10 + 's',
        background: 'var(--accent)',
        opacity: Math.random() * 0.3
      }
    },
    
    toggleTheme() {
      this.isLightTheme = !this.isLightTheme
      localStorage.setItem('wildfire-theme', this.isLightTheme ? 'light' : 'dark')
    },
    
    handleScroll() {
      const el = this.$refs.mainContent
      this.isScrolled = el ? el.scrollTop > 20 : false
    },
    
    handleResize() {
      this.sidebarCollapsed = window.innerWidth <= 900
    },
    
    handleNavClick(item) {
      this.currentView = item.id
    },
    
    async refreshAllData() {
      if (!this.githubToken) {
        console.log('No token, skipping refresh')
        return
      }
      
      this.isSyncing = true
      await Promise.all([
        this.fetchAllGitHubData(),
        this.loadRecentFeedbacks()
      ])
      this.isSyncing = false
    },
    
    async loadRecentFeedbacks() {
      if (!this.githubToken) return
      this.feedbackLoading = true
      try {
        const query = `query { repository(owner: "WildFiire", name: "docs") { discussions(first: 20, orderBy: { field: CREATED_AT, direction: DESC }) { nodes { id title body url createdAt } } } }`
        const res = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.githubToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        })
        if (!res.ok) return
        const data = await res.json()
        const nodes = data.data?.repository?.discussions?.nodes || []
        const feedbacks = nodes
          .filter(n => /^\[(GOOD|BAD)\]/i.test(n.title))
          .map(n => {
            const sentiment = /^\[GOOD\]/i.test(n.title) ? 'good' : 'bad'
            const starsMatch = n.title.match(/\((\d)★/)
            const stars = starsMatch ? parseInt(starsMatch[1]) : 0
            const pageMatch = n.body.match(/\*\*Page:\*\*\s*(.+)/m)
            const commentMatch = n.body.match(/### Comment:\n([\s\S]+?)(\n---|\n##|$)/)
            const pagePath = pageMatch ? pageMatch[1].trim() : '—'
            const pageName = pagePath.replace(/\.md$/, '').split('/').pop().replace(/[-_]/g, ' ')
            const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1) || 'Feedback'
            return { id: n.id, sentiment, stars, pagePath, pageTitle, comment: commentMatch ? commentMatch[1].trim() : '', createdAt: n.createdAt }
          })
        this.feedbackTotal = feedbacks.length
        this.recentFeedbacks = feedbacks.slice(0, 4)
      } catch (e) {}
      finally { this.feedbackLoading = false }
    },
    
    async fetchAllGitHubData() {
      const owner = this.repoOwner
      const repo = this.repoName
      const baseUrl = `https://api.github.com/repos/${owner}/${repo}`
      const headers = {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
      
      try {
        console.log('Fetching GitHub data...')
        
        const repoRes = await fetch(`${baseUrl}?_=${Date.now()}`, { headers })
        if (repoRes.ok) {
          const repoData = await repoRes.json()
          this.repoStats.stars = repoData.stargazers_count || 0
          this.repoStats.forks = repoData.forks_count || 0
          this.repoStats.watchers = repoData.watchers_count || 0
        }
        
        const langRes = await fetch(`${baseUrl}/languages?_=${Date.now()}`, { headers })
        if (langRes.ok) {
          const langData = await langRes.json()
          const total = Object.values(langData).reduce((a, b) => a + b, 0)
          this.languageStats = Object.entries(langData).map(([name, bytes]) => ({
            name,
            bytes,
            percentage: total ? (bytes / total) * 100 : 0
          }))
        }
        
        let allCommits = []
        let page = 1
        let hasMore = true
        
        while (hasMore && page <= 5) {
          const commitsRes = await fetch(`${baseUrl}/commits?per_page=100&page=${page}&_=${Date.now()}`, { headers })
          if (commitsRes.ok) {
            const commits = await commitsRes.json()
            if (commits.length === 0) {
              hasMore = false
            } else {
              allCommits = [...allCommits, ...commits]
              page++
            }
          } else {
            hasMore = false
          }
        }
        
        this.repoStats.totalCommits = allCommits.length
        
        const daily = {}
        const now = new Date()
        allCommits.forEach(commit => {
          const date = new Date(commit.commit.author.date)
          const dayKey = date.toISOString().split('T')[0]
          if ((now - date) / (1000 * 60 * 60 * 24) <= 30) {
            daily[dayKey] = (daily[dayKey] || 0) + 1
          }
        })
        
        const last30Days = []
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          const dayKey = date.toISOString().split('T')[0]
          last30Days.push(daily[dayKey] || 0)
        }
        this.dailyCommits = last30Days
        
        const weekly = {}
        allCommits.forEach(commit => {
          const date = new Date(commit.commit.author.date)
          const weekKey = this.getWeekNumber(date)
          const year = date.getFullYear()
          weekly[`${year}-W${weekKey}`] = (weekly[`${year}-W${weekKey}`] || 0) + 1
        })
        const weeklyEntries = Object.entries(weekly).sort().slice(-12)
        this.weeklyCommits = weeklyEntries.map(([_, count]) => count)
        
        await this.fetchContributorsFromCommits(allCommits)
        
        const prsRes = await fetch(`${baseUrl}/pulls?state=open&sort=updated&direction=desc&per_page=10&_=${Date.now()}`, { headers })
        if (prsRes.ok) {
          const prs = await prsRes.json()
          this.recentPRs = prs.map(pr => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            author: pr.user?.login,
            avatar: pr.user?.avatar_url,
            date: pr.updated_at,
            url: pr.html_url
          }))
          this.repoStats.openPRs = prs.length
        }
        
        const issuesRes = await fetch(`${baseUrl}/issues?state=open&sort=updated&direction=desc&per_page=10&_=${Date.now()}`, { headers })
        if (issuesRes.ok) {
          const issues = await issuesRes.json()
          const realIssues = issues.filter(issue => !issue.pull_request)
          this.recentIssues = realIssues.map(issue => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            author: issue.user?.login,
            avatar: issue.user?.avatar_url,
            date: issue.updated_at,
            url: issue.html_url
          }))
          this.repoStats.openIssues = realIssues.length
        }
        
        const treeRes = await fetch(`${baseUrl}/git/trees/${this.repoBranch}?recursive=1&_=${Date.now()}`, { headers })
        if (treeRes.ok) {
          const treeData = await treeRes.json()
          this.repoStats.files = treeData.tree?.filter(item => item.type === 'blob').length || 0
        }
        
        this.auditLog = []
        allCommits.slice(0, 50).forEach(commit => {
          this.auditLog.push({
            id: `commit-${commit.sha}`,
            type: 'commit',
            timestamp: commit.commit.author.date,
            message: commit.commit.message.split('\n')[0],
            author: commit.author?.login || commit.commit.author.name,
            avatar: commit.author?.avatar_url || `https://github.com/${commit.author?.login || commit.commit.author.name}.png`,
            url: commit.html_url,
            hash: commit.sha
          })
        })
        try {
          const auditMixRes = await fetch(`${baseUrl}/issues?state=all&sort=updated&direction=desc&per_page=30&_=${Date.now()}`, { headers })
          if (auditMixRes.ok) {
            const auditItems = await auditMixRes.json()
            auditItems.forEach(item => {
              const isPR = !!item.pull_request
              this.auditLog.push({
                id: `${isPR ? 'pr' : 'issue'}-${item.id}`,
                type: isPR ? 'pr' : 'issue',
                timestamp: item.updated_at,
                message: item.title,
                author: item.user?.login || '—',
                avatar: item.user?.avatar_url || `https://github.com/${item.user?.login}.png`,
                url: item.html_url,
                number: item.number,
                state: item.state,
                labels: item.labels?.map(l => ({ name: l.name, color: l.color })) || []
              })
            })
          }
        } catch (e) {}
        this.auditLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        this.recentCommits = allCommits.slice(0, 10).map(commit => ({
          id: commit.sha.substring(0, 7),
          message: commit.commit.message.split('\n')[0],
          author: commit.author?.login || commit.commit.author.name,
          avatar: commit.author?.avatar_url || `https://github.com/${commit.author?.login || commit.commit.author.name}.png`,
          date: commit.commit.author.date,
          url: commit.html_url
        }))

        const calMap = {}
        const cutoff365 = new Date(); cutoff365.setDate(cutoff365.getDate() - 365)
        allCommits.forEach(c => {
          const date = new Date(c.commit.author.date)
          if (date >= cutoff365) {
            const dk = date.toISOString().slice(0, 10)
            calMap[dk] = (calMap[dk] || 0) + 1
          }
        })
        this.calendarDailyMap = calMap
        const nowD = new Date()
        this.selectedCalMonth = `${nowD.getFullYear()}-${String(nowD.getMonth() + 1).padStart(2, '0')}`
        this.calendarCommits = allCommits
          .filter(c => new Date(c.commit.author.date) >= cutoff365)
          .map(c => ({
            id: c.sha.substring(0, 7),
            sha: c.sha,
            message: c.commit.message.split('\n')[0],
            author: c.author?.login || c.commit.author.name,
            avatar: c.author?.avatar_url || `https://github.com/${c.author?.login || c.commit.author.name}.png`,
            date: c.commit.author.date,
            url: c.html_url
          }))

        this.lastUpdateTime = new Date().toLocaleTimeString()
        
        console.log('GitHub data fetched successfully')
        
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
      }
    },
    
    async fetchContributorsFromCommits(allCommits) {
      const contributorMap = new Map()
      
      allCommits.forEach(commit => {
        const login = commit.author?.login || commit.commit.author.name
        if (login) {
          if (!contributorMap.has(login)) {
            contributorMap.set(login, {
              login: login,
              avatar_url: commit.author?.avatar_url || `https://github.com/${login}.png`,
              contributions: 1
            })
          } else {
            contributorMap.get(login).contributions++
          }
        }
      })
      
      const contributors = Array.from(contributorMap.values())
      contributors.sort((a, b) => b.contributions - a.contributions)
      
      this.repoStats.contributors = contributors.length
      this.topContributors = contributors.slice(0, 10)
      this.allContributorsData = contributors.map(c => ({
        ...c,
        commits: c.contributions,
        prs: Math.floor(c.contributions * 0.15),
        impact: contributors[0] ? (c.contributions / contributors[0].contributions) * 100 : 0
      }))
      
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      const commitsLastMonth = allCommits.filter(c => new Date(c.commit.author.date) > monthAgo).length
      const commitsPrevMonth = allCommits.filter(c => {
        const date = new Date(c.commit.author.date)
        return date <= monthAgo && date > new Date(monthAgo.setMonth(monthAgo.getMonth() - 1))
      }).length
      this.commitTrend = commitsPrevMonth ? Math.round((commitsLastMonth - commitsPrevMonth) / commitsPrevMonth * 100) : 0
    },
    
    getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      const dayNum = d.getUTCDay() || 7
      d.setUTCDate(d.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    },
    
    formatNumber(num) {
      if (!num) return '0'
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    },
    
    timeAgo(date) {
      const d = new Date(date)
      const now = new Date()
      const diff = Math.floor((now - d) / 1000)
      if (diff < 60) return 'ACUM'
      if (diff < 3600) return Math.floor(diff / 60) + 'm'
      if (diff < 86400) return Math.floor(diff / 3600) + 'h'
      if (diff < 604800) return Math.floor(diff / 86400) + 'z'
      return d.toLocaleDateString()
    },
    
    truncate(str, n) {
      if (!str) return ''
      return str.length > n ? str.substr(0, n - 1) + '…' : str
    },
    
    openCommit(url) {
      window.open(url, '_blank')
    },
    
    openIssue(url) {
      window.open(url, '_blank')
    },
    
    openPR(url) {
      window.open(url, '_blank')
    },
    
    openNewIssue() {
      window.open(`https://github.com/${this.repoOwner}/${this.repoName}/issues/new`, '_blank')
    },
    
    openNewPR() {
      window.open(`https://github.com/${this.repoOwner}/${this.repoName}/compare`, '_blank')
    },
    
    getLangColor(name) {
      const map = { JavaScript:'#f7df1e', TypeScript:'#3178c6', Vue:'#42b883', HTML:'#e34f26', CSS:'#1572b6', SCSS:'#cc6699', Python:'#3776ab', Go:'#00add8', Rust:'#dea584', Ruby:'#701516', PHP:'#4f5d95', Shell:'#89e051', Markdown:'#083fa1' }
      return map[name] || '#' + Math.abs(name.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0) % 0xffffff).toString(16).padStart(6, '0')
    },
    openProfile(login) {
      this.currentView = 'contributors'
    },
    async selectCalCell(cell) {
      if (this.selectedCalCell && this.selectedCalCell.dateStr === cell.dateStr) {
        this.selectedCalCell = null
        return
      }
      this.selectedCalCell = cell
      const commits = this.selectedDayCommits
      for (const commit of commits) {
        if (this.commitFilesCache[commit.sha]) continue
        try {
          const res = await fetch(
            `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits/${commit.sha}`,
            { headers: { Authorization: `token ${this.githubToken}`, Accept: 'application/vnd.github.v3+json' } }
          )
          if (res.ok) {
            const data = await res.json()
            this.commitFilesCache = {
              ...this.commitFilesCache,
              [commit.sha]: {
                files: data.files?.length || 0,
                additions: data.stats?.additions || 0,
                deletions: data.stats?.deletions || 0,
                fileNames: (data.files || []).slice(0, 6).map(f => f.filename)
              }
            }
          }
        } catch (e) {}
      }
    }
  }
}
</script>

<style scoped>
.wildfire-dashboard,
.wildfire-dashboard *,
.wildfire-dashboard a,
.wildfire-dashboard button,
.wildfire-dashboard input,
.wildfire-dashboard select,
.wildfire-dashboard textarea {
  cursor: auto !important;
}
.wildfire-dashboard button,
.wildfire-dashboard a,
.wildfire-dashboard [role="button"] {
  cursor: pointer !important;
}

.wildfire-dashboard {
  --bg-primary: #0a0a0c;
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --bg-hover: #1f1f24;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0,0.20);
  --accent-dim: rgba(255, 120, 0,0.08);
  --accent-soft: rgba(255, 120, 0,0.15);
  --accent-mid: rgba(255, 120, 0,0.28);
  --accent-strong: rgba(255, 120, 0,0.45);
  --accent-heavy: rgba(255, 120, 0,0.68);
  --accent-solid: rgba(255, 120, 0,0.88);
  --accent-alt: #ff6030;
  --accent-alt2: #ff8c42;
  --success: #2ecc71;
  --shadow-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
  font-size: 13px;
}

.wildfire-dashboard.light-theme {
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --bg-hover: #e0e0e5;
  --border-color: #ddd;
  --text-primary: #333;
  --text-secondary: #4a4a55;
  --text-muted: #666;
  --accent-glow: rgba(255, 120, 0, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.1);
}

.dashboard-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--border-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.1;
}

.bg-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float linear infinite;
  pointer-events: none;
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  100% { transform: translateY(-400px) translateX(100px); }
}

.theme-toggle-btn {
  padding: 8px !important;
}

.dashboard-sidebar {
  width: 220px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  position: relative;
  z-index: 10;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  overflow-x: hidden;
}

.dashboard-sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, var(--accent-glow) 30%, var(--accent-glow) 70%, transparent 100%);
  pointer-events: none;
}

.dashboard-sidebar.collapsed {
  width: 64px;
}

.sidebar-brand {
  padding: 18px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.brand-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon img {
  filter: drop-shadow(0 0 8px var(--accent-glow));
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.3px;
}

.brand-badge {
  font-size: 9px;
  font-weight: 700;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.brand-sub {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.nav-item.active {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--accent-soft);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  background: var(--accent);
  border-radius: 0 2px 2px 0;
}

.nav-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transition: left 0.4s ease;
  pointer-events: none;
}

.nav-item:hover .nav-glow { left: 100%; }

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  flex: 1;
}

.nav-badge {
  background: var(--bg-tertiary);
  color: var(--accent);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 8px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.sf-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border-radius: 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.sf-card:hover { border-color: var(--accent-mid); box-shadow: 0 0 8px var(--accent-glow); }
.sf-card.sf-collapsed {
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  gap: 6px;
}

.sf-profile-area {
  display: flex;
  align-items: center;
  gap: 9px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.sf-collapsed .sf-profile-area { flex: none; }

.sf-avatar-wrap {
  position: relative;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
}

.sf-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
  display: block;
  transition: box-shadow 0.2s;
}

.sf-profile-area:hover .sf-avatar { box-shadow: 0 0 0 3px var(--accent-mid), 0 0 10px var(--accent-glow); }

.sf-online-dot {
  position: absolute;
  bottom: 0; right: 0;
  width: 9px; height: 9px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--bg-secondary);
  box-shadow: 0 0 5px rgba(34,197,94,0.7);
  animation: statusPulse 2s ease infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

.sf-info { flex: 1; min-width: 0; }

.sf-name { display: block; font-size: 12px; font-weight: 700; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.3; }

.sf-status { display: flex; align-items: center; gap: 4px; margin-top: 2px; font-size: 8px; font-weight: 700; color: #22c55e; letter-spacing: 0.6px; }

.sf-pulse-dot { width: 5px; height: 5px; background: #22c55e; border-radius: 50%; flex-shrink: 0; animation: statusPulse 1.5s ease infinite; box-shadow: 0 0 4px rgba(34,197,94,0.6); }

.sf-out-btn {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}

.sf-out-btn:hover {
  background: rgba(231,76,60,0.12);
  border-color: rgba(231,76,60,0.4);
  color: #e74c3c;
  box-shadow: 0 0 8px rgba(231,76,60,0.15);
}

.sf-home-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 6px;
  padding: 7px 10px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.15s;
  background: transparent;
}

.sf-home-link:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-mid);
  color: var(--accent);
}

.sf-home-collapsed {
  padding: 7px 4px;
}

.dashboard-main {
  flex: 1;
  padding: 14px 18px;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  height: 100%;
  min-width: 0;
}

.dashboard-main.sidebar-collapsed {
  padding-left: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 9px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  position: sticky;
  top: 8px;
  z-index: 50;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.dashboard-header.scrolled {
  box-shadow: 0 8px 24px var(--shadow-color);
  border-color: var(--accent);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.header-left h1 {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: var(--bg-tertiary);
  border-radius: 30px;
  font-size: 10px;
}

.live-pulse {
  width: 8px;
  height: 8px;
  background: var(--success);
  border-radius: 50%;
  animation: livePulse 1.5s ease infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.live-text {
  color: var(--success);
  font-weight: 600;
}

.live-time {
  color: var(--text-muted);
  font-size: 9px;
}

.header-right {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.action-btn.primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.action-btn.primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.view-container {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dash-welcome {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 14px;
  flex-wrap: wrap;
}

.dw-glow { position: absolute; top: -60px; left: -60px; width: 240px; height: 240px; background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%); pointer-events: none; }
.dw-left { display: flex; align-items: center; gap: 14px; }
.dw-avatar-wrap { position: relative; flex-shrink: 0; }
.dw-avatar { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border-color); box-shadow: 0 0 0 2px var(--accent); }
.dw-online { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: var(--success); border-radius: 50%; border: 2px solid var(--bg-secondary); }
.dw-text h2 { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0 0 3px; }
.dw-name { color: var(--accent); }
.dw-text p { font-size: 11px; color: var(--text-muted); margin: 0; }
.dw-stats { display: flex; align-items: center; gap: 16px; }
.dws-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.dws-val { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
.dws-lbl { font-size: 9px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.4px; }
.dws-sep { width: 1px; height: 28px; background: var(--border-color); }

/* Repo Pulse Unified Strip */
.repo-pulse-strip { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; display: flex; align-items: stretch; overflow: hidden; }
.rps-brand { display: flex; align-items: center; gap: 6px; padding: 0 16px; background: var(--accent-dim); border-right: 1px solid var(--border-color); font-size: 9px; font-weight: 700; color: var(--accent); letter-spacing: 0.8px; white-space: nowrap; flex-shrink: 0; }
.rps-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 8px; gap: 2px; min-width: 0; }
.rps-sep { width: 1px; background: var(--border-color); margin: 8px 0; flex-shrink: 0; }
.rps-val { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; line-height: 1.2; }
.rps-pos { color: var(--success) !important; }
.rps-neg { color: #e74c3c !important; }
.rps-lbl { font-size: 8px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

/* Section Labels */
.dash-slabel { display: flex; align-items: center; gap: 8px; margin: 2px 0; }
.dash-slabel svg { color: var(--text-muted); flex-shrink: 0; }
.dash-slabel span { font-size: 9px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.8px; text-transform: uppercase; white-space: nowrap; }
.dash-slabel::after { content: ''; flex: 1; height: 1px; background: var(--border-color); }

.kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.kpi-card { position: relative; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 12px; display: flex; align-items: center; gap: 10px; overflow: hidden; transition: all 0.25s ease; }
.kpi-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
.kpi-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-body { flex: 1; min-width: 0; }
.kpi-val { display: block; font-size: 18px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
.kpi-lbl { display: block; font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; margin-top: 2px; }
.kpi-glow { position: absolute; bottom: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%); opacity: 0.18; pointer-events: none; }

/* Shared card */
.dash-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; }
.dc-head { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; gap: 10px; border-bottom: 1px solid var(--border-color); }
.dc-head-left { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.3px; }
.dc-badge { background: var(--bg-tertiary); color: var(--accent); padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; white-space: nowrap; }
.dc-badge.blue { color: #3b82f6; }
.dc-badge.green { color: #22c55e; }

.dash-charts { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
.flame-chart { padding: 10px 14px 12px; position: relative; }
.fc-svg { display: block; overflow: visible; }
.fc-html-layer { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: visible; }
.fc-date-lbl { position: absolute; bottom: 0; transform: translateX(-50%); font-size: 8px; color: rgba(255,255,255,0.3); font-family: system-ui,sans-serif; white-space: nowrap; line-height: 1; letter-spacing: -0.2px; }
.fc-date-today { color: var(--accent) !important; font-weight: 700; }
.fc-date-weekend { color: rgba(160,120,255,0.55); }
.fc-peak-lbl { position: absolute; transform: translate(-50%, calc(-100% - 6px)); font-size: 9px; color: var(--accent-alt2); font-weight: 700; font-family: system-ui,sans-serif; text-shadow: 0 0 6px var(--accent-mid); }
.fc-avg-lbl { position: absolute; right: 0; transform: translateY(-50%); font-size: 8px; color: var(--accent-strong); font-family: system-ui,sans-serif; white-space: nowrap; padding: 1px 4px; background: rgba(0,0,0,0.4); border-radius: 3px; }
.fc-month-badge { position: absolute; top: 0; right: 0; font-size: 9px; color: rgba(255,255,255,0.25); font-family: system-ui,sans-serif; letter-spacing: 0.3px; }
.fc-tip { position: absolute; width: 90px; padding: 7px 4px 6px; background: rgba(10,10,18,0.97); border: 1px solid var(--accent-strong); border-radius: 7px; text-align: center; z-index: 10; box-shadow: 0 4px 18px var(--accent-soft); pointer-events: none; }
.fc-tip-count { font-size: 12px; color: var(--accent-alt); font-weight: 700; font-family: system-ui,sans-serif; line-height: 1.2; }
.fc-tip-date { font-size: 9px; color: rgba(200,200,220,0.6); font-family: system-ui,sans-serif; margin-top: 2px; }
.fc-tip-pct { font-size: 8px; color: var(--accent-strong); font-family: system-ui,sans-serif; margin-top: 2px; }

.fc-kpi-row { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 4px; }
.fc-kpi { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 8px 4px; border-right: 1px solid rgba(255,255,255,0.05); }
.fc-kpi:last-child { border-right: none; }
.fc-kpi-v { font-size: 18px; font-weight: 800; color: var(--text-primary); line-height: 1; font-family: system-ui,sans-serif; letter-spacing: -0.5px; }
.fc-kpi-l { font-size: 8px; color: rgba(255,255,255,0.35); margin-top: 3px; letter-spacing: 0.5px; font-family: system-ui,sans-serif; }
.fc-kpi-accent .fc-kpi-v { color: var(--accent); }
.fc-kpi-green .fc-kpi-v { color: #22c55e; }

.fc-heatmap-wrap { display: flex; align-items: center; gap: 8px; padding: 10px 14px 6px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 4px; flex-wrap: wrap; overflow: hidden; }
.fc-hm-label { font-size: 8px; color: rgba(255,255,255,0.3); letter-spacing: 0.6px; white-space: nowrap; font-family: system-ui,sans-serif; flex-shrink: 0; }
.fc-heatmap-row { display: flex; gap: 2px; flex: 1; align-items: center; min-width: 0; overflow: hidden; }
.fc-hm-cell { flex: 1 1 auto; min-width: 6px; max-width: 18px; height: 14px; border-radius: 3px; cursor: default; transition: transform 0.1s; }
.fc-hm-cell:hover { transform: scaleY(1.3); }
.fc-hm-0 { background: var(--accent-dim); }
.fc-hm-1 { background: var(--accent-mid); }
.fc-hm-2 { background: var(--accent-strong); }
.fc-hm-3 { background: var(--accent-heavy); }
.fc-hm-4 { background: var(--accent-solid); box-shadow: 0 0 6px var(--accent-strong); }
.fc-hm-legend { display: flex; align-items: center; gap: 3px; flex-shrink: 0; }
.fc-hm-legend span { font-size: 7px; color: rgba(255,255,255,0.25); font-family: system-ui,sans-serif; }
.fc-hm-legend .fc-hm-cell { width: 10px; min-width: 10px; max-width: 10px; height: 10px; flex: 0 0 10px; }

.light-theme .fc-date-lbl { color: rgba(0,0,0,0.4); }
.light-theme .fc-date-weekend { color: rgba(100,60,200,0.5); }
.light-theme .fc-month-badge { color: rgba(0,0,0,0.3); }
.light-theme .fc-kpi-l { color: rgba(0,0,0,0.4); }
.light-theme .fc-hm-label { color: rgba(0,0,0,0.35); }
.light-theme .fc-hm-0 { background: var(--accent-dim); }
.light-theme .fc-tip { background: rgba(255,255,255,0.97); border-color: var(--accent-strong); }
.light-theme .fc-tip-date { color: rgba(0,0,0,0.5); }
.light-theme .fc-hm-legend span { color: rgba(0,0,0,0.35); }
.light-theme .fc-kpi-row { border-bottom-color: rgba(0,0,0,0.08); }
.light-theme .fc-kpi { border-right-color: rgba(0,0,0,0.08); }
.light-theme .fc-heatmap-wrap { border-top-color: rgba(0,0,0,0.08); }
.light-theme .acl-cell.intensity-0 { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); }
.light-theme .act-cal-cell.intensity-0 { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); }
.light-theme .act-cal-expanded .act-cal-cell-empty { border-color: rgba(0,0,0,0.08) !important; }
.light-theme .act-cal-expanded .acc-day { color: rgba(0,0,0,0.4); }
.light-theme .wrc-weekend .wrc-day { color: rgba(0,0,0,0.35); }
.light-theme .acd-files-count { background: rgba(0,0,0,0.04); }
.light-theme .acd-file-chip { background: rgba(0,0,0,0.04); }
.light-theme .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
.light-theme .fc-avg-lbl { background: rgba(0,0,0,0.08); color: rgba(160,70,0,0.8); }

/* Repo ring stats */
.rs-rings { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; padding: 10px 12px 8px; }
.rs-ring-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.rs-ring-svg-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.rs-ring-center { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.rs-ring-val { font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1; }
.rs-ring-lbl { font-size: 9px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.4px; }

/* Language bar */
.lang-section { border-top: 1px solid var(--border-color); padding: 10px 14px; }
.lang-title { display: block; font-size: 10px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 10px; text-transform: uppercase; }
.lang-bar-track { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 12px; gap: 2px; }
.lang-seg { border-radius: 2px; }
.lang-keys { display: flex; flex-wrap: wrap; gap: 8px; }
.lang-key { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--text-muted); }
.lang-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lang-key em { font-style: normal; color: var(--text-secondary); font-weight: 600; }

/* Recent Commits Grid */
.commits-panel { padding: 0; overflow: hidden; }
.commits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
.commit-card { padding: 12px 14px; cursor: pointer; border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); transition: background 0.15s; position: relative; overflow: hidden; }
.commit-card:nth-child(3n) { border-right: none; }
.commit-card:nth-last-child(-n+3) { border-bottom: none; }
.commit-card:nth-last-child(1):nth-child(2n+1) { border-bottom: none; }
.commit-card:hover { background: var(--bg-tertiary); }
.commit-card:hover::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; opacity: 0; transition: opacity 0.15s; }
.commit-card:hover::before { opacity: 1; background: var(--accent); }
.cc-top { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.cc-avatar { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--border-color); flex-shrink: 0; }
.commit-card:hover .cc-avatar { border-color: var(--accent); }
.cc-hash { background: var(--accent-dim); border: 1px solid var(--accent-glow); padding: 1px 6px; border-radius: 4px; font-size: 9px; color: var(--accent); font-family: monospace; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; letter-spacing: 0.3px; }
.cc-arrow { color: var(--text-muted); flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
.commit-card:hover .cc-arrow { opacity: 1; color: var(--accent); }
.cc-msg { font-size: 11.5px; color: var(--text-primary); font-weight: 500; line-height: 1.4; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 32px; }
.cc-meta { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--text-muted); }
.cc-author { color: var(--accent); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cc-sep { opacity: 0.4; flex-shrink: 0; }
.cc-time { white-space: nowrap; flex-shrink: 0; }

/* Top Contributors — compact ranked list */
.tc-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; }
.tc-row { display: flex; align-items: center; gap: 10px; padding: 9px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--border-color); border-right: 1px solid var(--border-color); position: relative; }
.tc-row:nth-child(2n) { border-right: none; }
.tc-row:nth-last-child(-n+2) { border-bottom: none; }
.tc-row:nth-last-child(1):nth-child(2n+1) { border-bottom: none; }
.tc-row:hover { background: var(--bg-tertiary); }
.tc-rank-badge { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; flex-shrink: 0; }
.tcr-1 { background: linear-gradient(135deg, #ffd700, #ffb300); color: #000; box-shadow: 0 0 8px rgba(255,215,0,0.35); }
.tcr-2 { background: linear-gradient(135deg, #c0c0c0, #909090); color: #222; }
.tcr-3 { background: linear-gradient(135deg, #cd7f32, #9a5a1e); color: #fff; }
.tcr-n { background: var(--bg-tertiary); color: var(--text-muted); border: 1px solid var(--border-color); }
.tc-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; border: 1.5px solid var(--border-color); transition: border-color 0.15s; }
.tc-row:hover .tc-avatar { border-color: var(--accent); }
.tc-info { flex: 1; min-width: 0; }
.tc-name { font-size: 11px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tc-bar-row { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.tc-bar-track { flex: 1; height: 3px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
.tc-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.tc-commits-badge { font-size: 9px; font-weight: 700; color: var(--text-muted); white-space: nowrap; flex-shrink: 0; }
.tc-row:hover .tc-commits-badge { color: var(--accent); }
.tc-empty { padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px; grid-column: 1/-1; }

/* Feedback mini widget */
.fb-mini { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; }
.fb-mini-list { display: flex; flex-direction: column; }
.fb-mini-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border-color); cursor: default; transition: background 0.12s; }
.fb-mini-row:last-child { border-bottom: none; }
.fb-mini-row:hover { background: var(--bg-tertiary); }
.fb-mini-dot { width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.fb-dot-good { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
.fb-dot-bad  { background: rgba(239,68,68,0.15);  color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
.fb-mini-body { flex: 1; min-width: 0; }
.fb-mini-page { font-size: 11px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; }
.fb-mini-comment { font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.fb-mini-meta { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.fb-mini-stars { display: flex; align-items: center; gap: 1px; }
.fb-mini-time { font-size: 9px; color: var(--text-muted); }
.fb-mini-loading { padding: 20px; text-align: center; color: var(--text-muted); font-size: 11px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.fb-mini-spinner { width: 14px; height: 14px; border: 1.5px solid var(--border-color); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
.fb-mini-empty { padding: 18px; text-align: center; color: var(--text-muted); font-size: 11px; }
.fb-mini-footer { padding: 8px 14px; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; }
.fb-mini-total { font-size: 9px; color: var(--text-muted); }
.fb-mini-link { font-size: 9px; font-weight: 700; color: var(--accent); background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 3px; transition: opacity 0.15s; letter-spacing: 0.3px; }
.fb-mini-link:hover { opacity: 0.8; }

/* Quick Actions Row */
.qa-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.qa-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-secondary); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 120px; justify-content: center; }
.qa-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
.qa-blue:hover  { border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.08); }
.qa-green:hover { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); }
.qa-orange:hover { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.08); }
.qa-purple:hover { border-color: #8b5cf6; color: #8b5cf6; background: rgba(139,92,246,0.08); }
.qa-red:hover   { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
.qa-teal:hover  { border-color: #14b8a6; color: #14b8a6; background: rgba(20,184,166,0.08); }

/* Activity Calendar — collapsed = compact circle strip, expanded = glow grid */
@keyframes calPulse { 0%,100%{ box-shadow:0 0 4px var(--accent-strong),0 0 8px var(--accent-mid); } 50%{ box-shadow:0 0 8px var(--accent-solid),0 0 18px var(--accent-strong); } }
.act-cal-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
.act-cal-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.act-cal-meta-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
.act-cal-meta-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.act-cal-title { font-size: 11px; font-weight: 600; color: var(--text-secondary); white-space: nowrap; }
.act-cal-badge { font-size: 9px; font-weight: 700; background: var(--accent-dim); color: var(--accent); padding: 2px 8px; border-radius: 20px; border: 1px solid var(--accent-mid); white-space: nowrap; }
.act-cal-legend { display: flex; align-items: center; gap: 3px; font-size: 9px; color: var(--text-muted); }
.acl-cell { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.acl-cell.intensity-0 { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); }
.acl-cell.intensity-1 { background: var(--accent-mid); }
.acl-cell.intensity-2 { background: var(--accent-heavy); }
.acl-cell.intensity-3 { background: var(--accent-solid); }
.acl-cell.intensity-4 { background: var(--accent); box-shadow: 0 0 4px var(--accent-heavy); }
.act-cal-toggle { background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-muted); width: 22px; height: 22px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 0; transition: all 0.15s; }
.act-cal-toggle:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
.act-cal-months { display: none; }
.act-cal-dow { display: none; }
.act-cal-grid { display: flex; flex-wrap: nowrap; gap: 3px; flex: 1; min-width: 0; overflow: hidden; align-items: center; }
.act-cal-cell { width: 9px; height: 9px; flex-shrink: 0; border-radius: 50%; cursor: pointer; transition: all 0.15s; position: relative; }
.act-cal-cell-empty { display: none; }
.act-cal-cell.intensity-0 { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); }
.act-cal-cell.intensity-1 { background: var(--accent-mid); }
.act-cal-cell.intensity-2 { background: var(--accent-heavy); }
.act-cal-cell.intensity-3 { background: var(--accent-solid); box-shadow: 0 0 3px var(--accent-strong); }
.act-cal-cell.intensity-4 { background: var(--accent); animation: calPulse 2s ease-in-out infinite; }
.act-cal-cell:hover { transform: scale(1.5); z-index: 3; }
.act-cal-cell-selected { outline: 2px solid var(--accent) !important; outline-offset: 2px; z-index: 2; }
.acc-day { display: none; }
/* Expanded state */
.act-cal-expanded { flex-direction: column !important; align-items: stretch !important; padding: 14px 16px 16px !important; gap: 10px !important; }
.act-cal-expanded .act-cal-meta { width: 100%; justify-content: space-between; }
.act-cal-expanded .act-cal-months { display: flex; gap: 6px; flex-wrap: wrap; }
.acm-btn { background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-muted); font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 16px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
.acm-btn:hover { border-color: var(--accent); color: var(--accent); }
.acm-active { background: var(--accent-dim) !important; border-color: var(--accent-strong) !important; color: var(--accent) !important; }
.acm-count { font-size: 8px; background: var(--accent-glow); color: var(--accent); padding: 1px 4px; border-radius: 8px; font-weight: 700; }
.act-cal-expanded .act-cal-dow { display: grid; grid-template-columns: repeat(7, 20px); gap: 3px; }
.act-cal-dow span { font-size: 8px; font-weight: 700; color: var(--text-muted); text-align: center; opacity: 0.5; }
.act-cal-expanded .act-cal-grid { display: grid !important; grid-template-columns: repeat(7, 20px); gap: 3px; flex: none; overflow: visible; }
.act-cal-expanded .act-cal-cell { width: 20px !important; height: 20px !important; border-radius: 4px !important; aspect-ratio: unset !important; min-height: unset !important; transform: none !important; }
.act-cal-expanded .act-cal-cell.intensity-4 { animation: calPulse 2.5s ease-in-out infinite; }
.act-cal-expanded .act-cal-cell:hover { transform: scale(1.2) !important; z-index: 3; }
.act-cal-expanded .act-cal-cell-empty { display: block; background: transparent !important; border: 1px dashed rgba(255,255,255,0.05) !important; cursor: default; pointer-events: none; }
.act-cal-expanded .acc-day { display: flex; align-items: center; justify-content: center; position: absolute; inset: 0; font-size: 7px; font-weight: 700; color: rgba(255,255,255,0.5); pointer-events: none; line-height: 1; }

.act-cal-detail { width: 100%; margin-top: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden; }
.acd-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 12px 14px 10px; border-bottom: 1px solid var(--border-color); gap: 8px; }
.acd-date-info { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.acd-date-full { font-size: 12px; font-weight: 700; color: var(--text-primary); }
.acd-stats-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.acd-stat-pill { font-size: 10px; font-weight: 700; background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-mid); padding: 2px 8px; border-radius: 20px; }
.acd-gh-link { font-size: 10px; color: var(--text-muted); text-decoration: none; opacity: 0.7; transition: opacity 0.15s; }
.acd-gh-link:hover { opacity: 1; color: var(--accent); }
.acd-close { background: none; border: 1px solid var(--border-color); color: var(--text-muted); width: 22px; height: 22px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 0; transition: all 0.15s; }
.acd-close:hover { border-color: var(--accent); color: var(--accent); }
.acd-empty { padding: 14px; font-size: 11px; color: var(--text-muted); text-align: center; }
.acd-no-data { padding: 12px 14px; font-size: 11px; color: var(--text-muted); }
.acd-no-data a { color: var(--accent); text-decoration: none; }
.acd-commits { display: flex; flex-direction: column; gap: 0; max-height: 260px; overflow-y: auto; }
.acd-commit-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border-color); transition: background 0.12s; }
.acd-commit-row:last-child { border-bottom: none; }
.acd-commit-row:hover { background: var(--bg-hover); }
.acd-avatar { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; border: 1px solid var(--border-color); }
.acd-commit-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
.acd-commit-msg { font-size: 11px; font-weight: 600; color: var(--text-primary); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.acd-commit-msg:hover { color: var(--accent); }
.acd-commit-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.acd-author { font-size: 10px; color: var(--text-muted); }
.acd-sha { font-size: 9px; background: var(--bg-primary); color: var(--accent); padding: 1px 5px; border-radius: 4px; cursor: pointer; font-family: monospace; border: 1px solid var(--border-color); }
.acd-sha:hover { border-color: var(--accent); }
.acd-files-count { font-size: 10px; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 1px 5px; border-radius: 4px; }
.acd-additions { font-size: 10px; color: #22c55e; font-weight: 600; }
.acd-deletions { font-size: 10px; color: #ef4444; font-weight: 600; }
.acd-loading { font-size: 10px; color: var(--text-muted); opacity: 0.6; font-style: italic; }
.acd-file-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
.acd-file-chip { font-size: 9px; background: rgba(255,255,255,0.05); color: var(--text-muted); padding: 1px 6px; border-radius: 4px; border: 1px solid var(--border-color); font-family: monospace; white-space: nowrap; max-width: 160px; overflow: hidden; text-overflow: ellipsis; }

/* Weekly Rhythm */
.week-rhythm-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; padding: 18px 20px; margin-bottom: 8px; }
.wrc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.wrc-title { font-size: 11px; color: var(--text-muted); }
.wrc-peak { font-size: 11px; color: var(--text-muted); }
.wrc-peak strong { color: var(--accent); }
.wrc-bars { display: flex; flex-direction: column; gap: 9px; }
.wrc-row { display: flex; align-items: center; gap: 12px; }
.wrc-day { font-size: 11px; font-weight: 600; color: var(--text-muted); width: 30px; flex-shrink: 0; }
.wrc-weekend .wrc-day { color: rgba(255,255,255,0.35); }
.wrc-track { flex: 1; height: 10px; background: var(--bg-tertiary); border-radius: 5px; overflow: hidden; position: relative; }
.wrc-fill { height: 100%; border-radius: 5px; background: linear-gradient(90deg, var(--accent-strong), var(--accent-solid)); transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.wrc-peak .wrc-fill { background: linear-gradient(90deg, var(--accent), var(--accent-alt2)); box-shadow: 0 0 10px var(--accent-strong); }
.wrc-fill-glow { position: absolute; top: 0; left: 0; height: 100%; border-radius: 5px; background: rgba(255,150,60,0.3); filter: blur(4px); pointer-events: none; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
.wrc-weekend .wrc-fill { background: linear-gradient(90deg, rgba(100,100,120,0.3), rgba(100,100,120,0.5)); }
.wrc-avg { font-size: 11px; font-weight: 700; color: var(--text-primary); width: 36px; text-align: right; flex-shrink: 0; white-space: nowrap; }
.wrc-unit { font-size: 9px; font-weight: 400; color: var(--text-muted); }
.wrc-total { font-size: 10px; color: var(--text-muted); width: 32px; text-align: right; flex-shrink: 0; }

/* Issues + PRs */
.dash-ipr { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.ipr-panel { padding: 0; overflow: hidden; }
.ipr-list { display: flex; flex-direction: column; }
.ipr-row { display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--border-color); position: relative; }
.ipr-row:last-child { border-bottom: none; }
.ipr-row:hover { background: var(--bg-tertiary); }
.ipr-row:hover::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 0 2px 2px 0; }
.ipr-panel:first-child .ipr-row:hover::before { background: #3b82f6; }
.ipr-panel:last-child .ipr-row:hover::before { background: #22c55e; }
.ipr-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; border: 2px solid var(--border-color); transition: border-color 0.15s; }
.ipr-row:hover .ipr-avatar { border-color: var(--accent); }
.ipr-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; margin-right: 4px; }
.issue-dot { background: #3b82f6; box-shadow: 0 0 6px rgba(59,130,246,0.5); }
.pr-dot { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.5); }
.ipr-body { flex: 1; min-width: 0; }
.ipr-title-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.ipr-num-badge { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; flex-shrink: 0; font-family: monospace; }
.ipr-num-badge.blue { background: rgba(59,130,246,0.15); color: #3b82f6; border: 1px solid rgba(59,130,246,0.25); }
.ipr-num-badge.green { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }
.ipr-title { font-size: 11px; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ipr-meta-row { display: flex; align-items: center; gap: 4px; font-size: 10px; }
.ipr-author { color: var(--accent); font-weight: 600; }
.ipr-sep { color: var(--text-muted); opacity: 0.4; }
.ipr-time { color: var(--text-muted); }
.ipr-arrow { color: var(--text-muted); opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
.ipr-row:hover .ipr-arrow { opacity: 1; color: var(--accent); }
.ipr-empty { padding: 28px 16px; text-align: center; color: var(--text-muted); font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ipr-new-btn { background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-muted); width: 22px; height: 22px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; padding: 0; }
.ipr-new-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }

/* Live Overview */
.dash-weekly { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.activity-timeline-card { padding: 0; overflow: hidden; }
.repo-health-card { padding: 0; overflow: hidden; }

/* Live dot small */
.live-dot-sm { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.6); display: inline-block; animation: livePulse 1.5s ease infinite; flex-shrink: 0; }

/* Activity Timeline */
.at-list { display: flex; flex-direction: column; max-height: 380px; overflow-y: auto; }
.at-list::-webkit-scrollbar { width: 3px; }
.at-list::-webkit-scrollbar-track { background: transparent; }
.at-list::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }
.at-row { display: flex; align-items: center; gap: 9px; padding: 9px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--border-color); position: relative; }
.at-row:last-child { border-bottom: none; }
.at-row:hover { background: var(--bg-tertiary); }
.at-icon-wrap { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ati-commit { background: var(--accent-glow); color: var(--accent-alt); border: 1px solid var(--accent-mid); }
.ati-pr { background: rgba(34,197,94,0.2); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.ati-issue { background: rgba(59,130,246,0.2); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); }
.at-avatar { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--border-color); flex-shrink: 0; }
.at-body { flex: 1; min-width: 0; }
.at-msg { display: block; font-size: 11px; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.at-meta { display: flex; align-items: center; gap: 4px; font-size: 9px; }
.at-author { color: var(--accent); font-weight: 600; }
.at-sep { color: var(--text-muted); opacity: 0.4; }
.at-time { color: var(--text-muted); }
.at-num { background: var(--bg-tertiary); color: var(--text-muted); padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 9px; }
.at-type-pill { font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 10px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.5px; }
.pill-commit { background: var(--accent-dim); color: var(--accent-alt); border: 1px solid var(--accent-glow); }
.pill-pr { background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
.pill-issue { background: rgba(59,130,246,0.12); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2); }

/* Repo Health */
.rh-rows { display: flex; flex-direction: column; padding: 4px 0 8px; }
.rh-row { display: flex; align-items: center; gap: 10px; padding: 8px 16px; }
.rh-label { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--text-muted); white-space: nowrap; width: 130px; flex-shrink: 0; }
.rh-bar-wrap { flex: 1; height: 5px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
.rh-bar { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); min-width: 4px; }
.rh-bar.green { background: linear-gradient(90deg, #16a34a, #22c55e); }
.rh-bar.blue { background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
.rh-bar.orange { background: linear-gradient(90deg, #c2410c, #f97316); }
.rh-bar.purple { background: linear-gradient(90deg, #6d28d9, #8b5cf6); }
.rh-bar.red { background: linear-gradient(90deg, #b91c1c, #e74c3c); }
.rh-val { font-size: 10px; font-weight: 700; color: var(--text-primary); flex-shrink: 0; min-width: 36px; text-align: right; font-family: system-ui,sans-serif; }

/* dc-badge colors */
.dc-badge.blue { background: rgba(59,130,246,0.15); color: #3b82f6; border: 1px solid rgba(59,130,246,0.25); }
.dc-badge.green { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }

@media (max-width: 1200px) {
  .kpi-row { grid-template-columns: repeat(3, 1fr); }
  .dash-charts { grid-template-columns: 1fr; }
  .dash-ipr { grid-template-columns: 1fr; }
  .dash-weekly { grid-template-columns: 1fr; }
  .tc-list { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .dashboard-sidebar { width: 64px; }
  .brand-text, .nav-label, .nav-badge, .sf-info, .logout-btn span { display: none !important; }
  .nav-item { justify-content: center; padding: 10px; }
  .logout-btn { justify-content: center; padding: 8px; }
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .rps-brand { display: none; }
  .rh-label { width: 110px; }
  .tc-list { grid-template-columns: 1fr; }
  .commits-grid { grid-template-columns: repeat(2, 1fr); }
  .commit-card:nth-child(3n) { border-right: 1px solid var(--border-color); }
  .commit-card:nth-child(2n) { border-right: none; }
  .commit-card:nth-last-child(-n+2) { border-bottom: none; }
  .commit-card:nth-last-child(-n+3) { border-bottom: 1px solid var(--border-color); }
  .qa-row { gap: 8px; }
  .qa-btn { min-width: 0; padding: 8px 10px; font-size: 11px; }
  .qa-btn span { display: none; }
}

/* ── Mobile Bottom Navigation ── */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 62px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  z-index: 300;
  padding: 0 2px;
  padding-bottom: env(safe-area-inset-bottom);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -4px 24px rgba(0,0,0,0.35);
}
.mbn-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.15s;
  position: relative;
  padding: 6px 2px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.mbn-item.active { color: var(--accent); }
.mbn-item.active::before {
  content: '';
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 2px;
  background: var(--accent);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 1px 8px var(--accent-glow);
}
.mbn-icon { display: flex; align-items: center; line-height: 1; }
.mbn-icon svg { width: 18px; height: 18px; }
.mbn-label { font-size: 7.5px; font-weight: 700; letter-spacing: 0.2px; text-transform: uppercase; line-height: 1; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mbn-live {
  position: absolute;
  top: 7px; right: calc(50% - 13px);
  width: 5px; height: 5px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(34,197,94,0.8);
  animation: livePulse 1.5s ease infinite;
}

@media (max-width: 640px) {
  .dashboard-sidebar { display: none !important; }
  .menu-btn { display: none !important; }
  .mobile-bottom-nav { display: flex; }
  .dashboard-main { padding: 10px 12px 74px; }
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .header-left { gap: 10px; }
  .header-left h1 { font-size: 13px; }
  .live-indicator { display: none; }
  .dw-stats { display: none; }
  .action-btn { padding: 6px 10px; }
  .btn-text { display: none; }
  .rs-rings { grid-template-columns: repeat(2, 1fr); }
  .dash-ipr { grid-template-columns: 1fr; }
  .dash-weekly { grid-template-columns: 1fr; }
  .rh-label { width: 100px; font-size: 9px; }
  .ipr-num-badge { display: none; }
  .fc-kpi-row { flex-wrap: wrap; }
  .fc-kpi { min-width: 60px; }
  .fc-heatmap-wrap { padding: 8px 10px 6px; gap: 6px; }
  .fc-hm-label { display: none; }
  .fc-heatmap-row { gap: 1px; }
  .fc-hm-cell { height: 10px; min-width: 4px; }
  .fc-hm-legend { display: none; }
  .commits-grid { grid-template-columns: 1fr; }
  .commit-card { border-right: none !important; }
  .commit-card:nth-last-child(-n+1) { border-bottom: none; }
  .qa-row { gap: 8px; }
  .qa-btn { min-width: 0; padding: 8px 10px; font-size: 11px; }
  .qa-btn span { display: none; }
}

@media (max-width: 420px) {
  .kpi-row { grid-template-columns: repeat(1, 1fr); }
  .dashboard-main { padding: 8px 8px 74px; }
  .dashboard-header { flex-wrap: wrap; gap: 6px; }
  .header-right { width: 100%; }
  .action-btn { flex: 1; justify-content: center; }
  .commits-grid { grid-template-columns: 1fr; }
  .commit-card { border-right: none !important; }
  .commit-card:nth-last-child(-n+1) { border-bottom: none; }
}

/* ── PANEL ACCENT COLOR THEMES ─────────────────────────────────────────
   Targets every component root + the dashboard itself.
   .wildfire-dashboard.wf-theme-X  = compound (same element, no space)
   .wf-theme-X .panel-*            = descendant (child components)
   !important beats scoped data-attribute specificity.
   fire = default (#ff7800), no override needed.
─────────────────────────────────────────────────────────────────────── */

/* ── CRIMSON ── */
.wildfire-dashboard.wf-theme-crimson,
.wf-theme-crimson .panel-sidebar,
.wf-theme-crimson .panel-header,
.wf-theme-crimson .panel-profile,
.wf-theme-crimson .panel-contributors,
.wf-theme-crimson .panel-files,
.wf-theme-crimson .panel-audit,
.wf-theme-crimson .panel-analytics,
.wf-theme-crimson .panel-login,
.wf-theme-crimson .panel-feedbacks,
.wf-theme-crimson .cm-shell {
  --accent:        #dc2626 !important;
  --accent-glow:   rgba(220,38,38,0.20) !important;
  --accent-dim:    rgba(220,38,38,0.08) !important;
  --accent-soft:   rgba(220,38,38,0.15) !important;
  --accent-mid:    rgba(220,38,38,0.28) !important;
  --accent-strong: rgba(220,38,38,0.45) !important;
  --accent-heavy:  rgba(220,38,38,0.68) !important;
  --accent-solid:  rgba(220,38,38,0.88) !important;
  --accent-alt:    #ef4444 !important;
  --accent-alt2:   #fca5a5 !important;
}

/* ── VIOLET ── */
.wildfire-dashboard.wf-theme-violet,
.wf-theme-violet .panel-sidebar,
.wf-theme-violet .panel-header,
.wf-theme-violet .panel-profile,
.wf-theme-violet .panel-contributors,
.wf-theme-violet .panel-files,
.wf-theme-violet .panel-audit,
.wf-theme-violet .panel-analytics,
.wf-theme-violet .panel-login,
.wf-theme-violet .panel-feedbacks,
.wf-theme-violet .cm-shell {
  --accent:        #7c3aed !important;
  --accent-glow:   rgba(124,58,237,0.20) !important;
  --accent-dim:    rgba(124,58,237,0.08) !important;
  --accent-soft:   rgba(124,58,237,0.15) !important;
  --accent-mid:    rgba(124,58,237,0.28) !important;
  --accent-strong: rgba(124,58,237,0.45) !important;
  --accent-heavy:  rgba(124,58,237,0.68) !important;
  --accent-solid:  rgba(124,58,237,0.88) !important;
  --accent-alt:    #8b5cf6 !important;
  --accent-alt2:   #a78bfa !important;
}

/* ── EMERALD ── */
.wildfire-dashboard.wf-theme-emerald,
.wf-theme-emerald .panel-sidebar,
.wf-theme-emerald .panel-header,
.wf-theme-emerald .panel-profile,
.wf-theme-emerald .panel-contributors,
.wf-theme-emerald .panel-files,
.wf-theme-emerald .panel-audit,
.wf-theme-emerald .panel-analytics,
.wf-theme-emerald .panel-login,
.wf-theme-emerald .panel-feedbacks,
.wf-theme-emerald .cm-shell {
  --accent:        #059669 !important;
  --accent-glow:   rgba(5,150,105,0.20) !important;
  --accent-dim:    rgba(5,150,105,0.08) !important;
  --accent-soft:   rgba(5,150,105,0.15) !important;
  --accent-mid:    rgba(5,150,105,0.28) !important;
  --accent-strong: rgba(5,150,105,0.45) !important;
  --accent-heavy:  rgba(5,150,105,0.68) !important;
  --accent-solid:  rgba(5,150,105,0.88) !important;
  --accent-alt:    #10b981 !important;
  --accent-alt2:   #34d399 !important;
}

/* ── SAPPHIRE ── */
.wildfire-dashboard.wf-theme-sapphire,
.wf-theme-sapphire .panel-sidebar,
.wf-theme-sapphire .panel-header,
.wf-theme-sapphire .panel-profile,
.wf-theme-sapphire .panel-contributors,
.wf-theme-sapphire .panel-files,
.wf-theme-sapphire .panel-audit,
.wf-theme-sapphire .panel-analytics,
.wf-theme-sapphire .panel-login,
.wf-theme-sapphire .panel-feedbacks,
.wf-theme-sapphire .cm-shell {
  --accent:        #2563eb !important;
  --accent-glow:   rgba(37,99,235,0.20) !important;
  --accent-dim:    rgba(37,99,235,0.08) !important;
  --accent-soft:   rgba(37,99,235,0.15) !important;
  --accent-mid:    rgba(37,99,235,0.28) !important;
  --accent-strong: rgba(37,99,235,0.45) !important;
  --accent-heavy:  rgba(37,99,235,0.68) !important;
  --accent-solid:  rgba(37,99,235,0.88) !important;
  --accent-alt:    #3b82f6 !important;
  --accent-alt2:   #60a5fa !important;
}

/* ── GOLD ── */
.wildfire-dashboard.wf-theme-gold,
.wf-theme-gold .panel-sidebar,
.wf-theme-gold .panel-header,
.wf-theme-gold .panel-profile,
.wf-theme-gold .panel-contributors,
.wf-theme-gold .panel-files,
.wf-theme-gold .panel-audit,
.wf-theme-gold .panel-analytics,
.wf-theme-gold .panel-login,
.wf-theme-gold .panel-feedbacks,
.wf-theme-gold .cm-shell {
  --accent:        #d97706 !important;
  --accent-glow:   rgba(217,119,6,0.20) !important;
  --accent-dim:    rgba(217,119,6,0.08) !important;
  --accent-soft:   rgba(217,119,6,0.15) !important;
  --accent-mid:    rgba(217,119,6,0.28) !important;
  --accent-strong: rgba(217,119,6,0.45) !important;
  --accent-heavy:  rgba(217,119,6,0.68) !important;
  --accent-solid:  rgba(217,119,6,0.88) !important;
  --accent-alt:    #f59e0b !important;
  --accent-alt2:   #fbbf24 !important;
}

/* ── ROSE ── */
.wildfire-dashboard.wf-theme-rose,
.wf-theme-rose .panel-sidebar,
.wf-theme-rose .panel-header,
.wf-theme-rose .panel-profile,
.wf-theme-rose .panel-contributors,
.wf-theme-rose .panel-files,
.wf-theme-rose .panel-audit,
.wf-theme-rose .panel-analytics,
.wf-theme-rose .panel-login,
.wf-theme-rose .panel-feedbacks,
.wf-theme-rose .cm-shell {
  --accent:        #db2777 !important;
  --accent-glow:   rgba(219,39,119,0.20) !important;
  --accent-dim:    rgba(219,39,119,0.08) !important;
  --accent-soft:   rgba(219,39,119,0.15) !important;
  --accent-mid:    rgba(219,39,119,0.28) !important;
  --accent-strong: rgba(219,39,119,0.45) !important;
  --accent-heavy:  rgba(219,39,119,0.68) !important;
  --accent-solid:  rgba(219,39,119,0.88) !important;
  --accent-alt:    #ec4899 !important;
  --accent-alt2:   #f9a8d4 !important;
}

/* ── CYAN ── */
.wildfire-dashboard.wf-theme-cyan,
.wf-theme-cyan .panel-sidebar,
.wf-theme-cyan .panel-header,
.wf-theme-cyan .panel-profile,
.wf-theme-cyan .panel-contributors,
.wf-theme-cyan .panel-files,
.wf-theme-cyan .panel-audit,
.wf-theme-cyan .panel-analytics,
.wf-theme-cyan .panel-login,
.wf-theme-cyan .panel-feedbacks,
.wf-theme-cyan .cm-shell {
  --accent:        #0891b2 !important;
  --accent-glow:   rgba(8,145,178,0.20) !important;
  --accent-dim:    rgba(8,145,178,0.08) !important;
  --accent-soft:   rgba(8,145,178,0.15) !important;
  --accent-mid:    rgba(8,145,178,0.28) !important;
  --accent-strong: rgba(8,145,178,0.45) !important;
  --accent-heavy:  rgba(8,145,178,0.68) !important;
  --accent-solid:  rgba(8,145,178,0.88) !important;
  --accent-alt:    #06b6d4 !important;
  --accent-alt2:   #67e8f9 !important;
}

/* ── Wiki Stats Card ── */
.wiki-stats-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-top: 2.5px solid var(--accent-mid); border-radius: 12px; overflow: hidden; }
.wsc-header { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; border-bottom: 1px solid var(--border-color); }
.wsc-header-left { display: flex; align-items: center; gap: 10px; }
.wsc-icon-wrap { width: 30px; height: 30px; border-radius: 8px; background: var(--accent-dim); border: 1px solid var(--accent-soft); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
.wsc-title { font-size: 12px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.3px; }
.wsc-sub { font-size: 10px; color: var(--text-muted); margin-top: 1px; }
.wsc-live-badge { display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); border-radius: 20px; font-size: 9px; font-weight: 700; color: #22c55e; letter-spacing: 0.5px; flex-shrink: 0; }
.wsc-live-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: livePulse 1.5s ease infinite; flex-shrink: 0; }
.wsc-kpis { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--border-color); }
.wsc-kpi { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 14px 10px; border-right: 1px solid var(--border-color); position: relative; overflow: hidden; transition: background 0.15s; }
.wsc-kpi:last-child { border-right: none; }
.wsc-kpi::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--kpi-c, var(--accent)); }
.wsc-kpi:hover { background: var(--bg-tertiary); }
.wsc-kpi svg, .wsc-kpi .iconify { color: var(--kpi-c, var(--accent)); opacity: 0.75; margin-bottom: 2px; }
.wsc-kpi-val { font-size: 22px; font-weight: 800; color: var(--text-primary); line-height: 1; letter-spacing: -0.5px; }
.wsc-kpi-lbl { font-size: 8px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.8px; }
.wsc-body { display: grid; grid-template-columns: 1fr auto; }
.wsc-breakdown { padding: 14px 18px; min-width: 0; }
.wsc-bk-title { font-size: 9px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 10px; }
.wsc-bk-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.wsc-bk-row:last-child { margin-bottom: 0; }
.wsc-bk-name { font-size: 10px; font-weight: 600; color: var(--text-secondary); width: 86px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
.wsc-bk-track { flex: 1; height: 5px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
.wsc-bk-fill { height: 100%; border-radius: 3px; transition: width 0.9s cubic-bezier(0.4,0,0.2,1); opacity: 0.8; }
.wsc-bk-count { font-size: 10px; font-weight: 700; color: var(--text-muted); width: 18px; text-align: right; flex-shrink: 0; }
.wsc-bk-empty { font-size: 11px; color: var(--text-muted); padding: 12px 0; }
.wsc-ring-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 14px 22px; border-left: 1px solid var(--border-color); }
.wsc-ring-svg-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.wsc-ring-center { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
.wsc-ring-val { font-size: 17px; font-weight: 800; color: var(--text-primary); line-height: 1; }
.wsc-ring-lbl { font-size: 7px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; margin-top: 3px; }
.wsc-ring-legend { display: flex; gap: 10px; }
.wsc-rl-item { display: flex; align-items: center; gap: 4px; font-size: 9px; color: var(--text-muted); white-space: nowrap; }
.wsc-rl-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
</style>