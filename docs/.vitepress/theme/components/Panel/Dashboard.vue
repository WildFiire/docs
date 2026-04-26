<template>
  <Teleport to="body" v-if="isMounted">
    <!-- Show Login if not authenticated -->
    <PanelLogin 
      v-if="!isAuthenticated"
      @login-success="handleLoginSuccess"
    />
    
    <!-- Main Dashboard -->
    <div v-else class="wildfire-dashboard" :class="['wf-theme-' + panelTheme, { 'light-theme': isLightTheme }]">
      <CS2Background :isDark="!isLightTheme" />

      <aside class="dashboard-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-brand" @click="currentView = 'dashboard'">
  <div class="brand-icon">
    <LiquidMetalLogo
      :width="100" 
      :height="100"                   
      image="/icons/wildfire.png"
      colorBack="#00000000"
      colorTint="#ff7800a6"
      shape="none"
      :repetition="2"
      :softness="0.1"
      :shiftRed="0.3"
      :shiftBlue="0.3"
      :distortion="0.05"
      :contour="0.4"
      :angle="70"
      :speed="0.8"
      :scale="0.6"
      fit="contain"
    />
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
            <!-- <button class="menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button> -->
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
                  <div class="wsc-stats-pills">
                    <div class="wsc-pill" style="--pc:var(--accent)">
                      <span class="wsc-pill-val">{{ wikiStats.pages }}</span>
                      <span class="wsc-pill-lbl">PAGES</span>
                    </div>
                    <div class="wsc-pill" style="--pc:#3b82f6">
                      <span class="wsc-pill-val">{{ wikiStats.sections }}</span>
                      <span class="wsc-pill-lbl">SECTIONS</span>
                    </div>
                    <div class="wsc-pill" style="--pc:#22c55e">
                      <span class="wsc-pill-val">99.9%</span>
                      <span class="wsc-pill-lbl">UPTIME</span>
                    </div>
                    <div class="wsc-pill" style="--pc:#8b5cf6">
                      <span class="wsc-pill-val">{{ Math.round(wikiStats.pages / Math.max(wikiStats.sections, 1)) }}</span>
                      <span class="wsc-pill-lbl">AVG/SEC</span>
                    </div>
                  </div>
                </div>

                <div class="wsc-ring-wrap">
                  <div class="wsc-ring-svg-wrap">
                    <svg viewBox="0 0 180 180" width="180" height="180">
                      <defs>
                        <filter id="wscGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3.5" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <linearGradient id="wscGradPages" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stop-color="#ff6030"/>
                          <stop offset="100%" stop-color="#ff8c42"/>
                        </linearGradient>
                        <linearGradient id="wscGradSecs" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stop-color="#2563eb"/>
                          <stop offset="100%" stop-color="#60a5fa"/>
                        </linearGradient>
                        <linearGradient id="wscGradUptime" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stop-color="#16a34a"/>
                          <stop offset="100%" stop-color="#4ade80"/>
                        </linearGradient>
                      </defs>
                      <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="11"/>
                      <circle cx="90" cy="90" r="60" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="9"/>
                      <circle cx="90" cy="90" r="44" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="7"/>
                      <circle cx="90" cy="90" r="78" fill="none" stroke="url(#wscGradPages)" stroke-width="11"
                        :stroke-dasharray="490.1" :stroke-dashoffset="490.1 * (1 - wikiStats.pagesPercent / 100)"
                        stroke-linecap="round" transform="rotate(-90 90 90)" filter="url(#wscGlow)"
                        style="transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"/>
                      <circle cx="90" cy="90" r="60" fill="none" stroke="url(#wscGradSecs)" stroke-width="9"
                        :stroke-dasharray="376.99" :stroke-dashoffset="376.99 * (1 - Math.min(wikiStats.sections / 10, 1))"
                        stroke-linecap="round" transform="rotate(-90 90 90)" filter="url(#wscGlow)"
                        style="transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"/>
                      <circle cx="90" cy="90" r="44" fill="none" stroke="url(#wscGradUptime)" stroke-width="7"
                        stroke-dasharray="276.46" stroke-dashoffset="2.76"
                        stroke-linecap="round" transform="rotate(-90 90 90)" filter="url(#wscGlow)"
                        style="transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"/>
                    </svg>
                    <div class="wsc-ring-center">
                      <span class="wsc-ring-val">{{ wikiStats.pages }}</span>
                      <span class="wsc-ring-lbl">PAGES</span>
                      <span class="wsc-ring-sub">{{ wikiStats.sections }} sections</span>
                    </div>
                  </div>
                  <div class="wsc-ring-legend">
                    <div class="wsc-rl-item"><span class="wsc-rl-dot" style="background:linear-gradient(135deg,#ff6030,#ff8c42)"></span>Pages</div>
                    <div class="wsc-rl-item"><span class="wsc-rl-dot" style="background:linear-gradient(135deg,#2563eb,#60a5fa)"></span>Sections</div>
                    <div class="wsc-rl-item"><span class="wsc-rl-dot" style="background:linear-gradient(135deg,#16a34a,#4ade80)"></span>Uptime</div>
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
                  <div class="pgc-kpi-row">
                    <div class="pgc-kpi">
                      <span class="pgc-kpi-lbl">TOTAL COMMITS</span>
                      <span class="pgc-kpi-val" style="color:var(--accent)">{{ dailyCommits.reduce((a,b)=>a+b,0) }}</span>
                    </div>
                    <div class="pgc-kpi">
                      <span class="pgc-kpi-lbl">TODAY</span>
                      <span class="pgc-kpi-val" style="color:#22c55e">+{{ dailyCommits.length ? dailyCommits[dailyCommits.length - 1] : 0 }}</span>
                    </div>
                    <div class="pgc-kpi">
                      <span class="pgc-kpi-lbl">LAST 7 DAYS</span>
                      <span class="pgc-kpi-val" style="color:#3b82f6">+{{ dailyCommits.slice(-7).reduce((a,b)=>a+b,0) }}</span>
                    </div>
                    <div class="pgc-kpi">
                      <span class="pgc-kpi-lbl">AVG / DAY</span>
                      <span class="pgc-kpi-val" style="color:#8b5cf6">{{ repoPulse.avgPerDay }}</span>
                    </div>
                  </div>
                  <!-- Area+Line chart (player-growth style) -->
                  <div class="pgc-chart-wrap" @mousemove="onFlameMouseMove" @mouseleave="hoveredBarIndex = null">
                    <svg viewBox="0 0 640 200" preserveAspectRatio="none" width="100%" height="200">
                      <defs>
                        <linearGradient id="pgAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#ff7800" stop-opacity="0.38"/>
                          <stop offset="55%" stop-color="#ff7800" stop-opacity="0.12"/>
                          <stop offset="100%" stop-color="#ff7800" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="pgLineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stop-color="#ff6030"/>
                          <stop offset="100%" stop-color="#ff8c42"/>
                        </linearGradient>
                        <filter id="pgLineGlow" x="-10%" y="-80%" width="120%" height="260%">
                          <feGaussianBlur stdDeviation="3" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      <line x1="0" y1="40" x2="640" y2="40" :stroke="isLightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)'" stroke-width="1"/>
                      <line x1="0" y1="80" x2="640" y2="80" :stroke="isLightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)'" stroke-width="1"/>
                      <line x1="0" y1="120" x2="640" y2="120" :stroke="isLightTheme ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'" stroke-width="1"/>
                      <line x1="0" y1="160" x2="640" y2="160" :stroke="isLightTheme ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'" stroke-width="1"/>
                      <line v-if="flameAvgY !== null" x1="0" :y1="flameAvgY" x2="640" :y2="flameAvgY"
                        stroke="rgba(255,120,0,0.22)" stroke-width="1" stroke-dasharray="5,4"/>
                      <path :d="flamePath" fill="url(#pgAreaGrad)"/>
                      <path v-if="flameLinePath" :d="flameLinePath" fill="none" stroke="url(#pgLineGrad)" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" filter="url(#pgLineGlow)"/>
                      <rect v-if="hoveredBarIndex !== null && flameBarData[hoveredBarIndex]"
                        :x="flameBarData[hoveredBarIndex].x" y="0"
                        :width="flameBarData[hoveredBarIndex].w" height="165"
                        rx="2" fill="rgba(255,120,0,0.08)"/>
                      <g v-if="flameBarData.length">
                        <circle :cx="flameBarData[flameBarData.length-1].cx" :cy="flameBarData[flameBarData.length-1].y" r="5"
                          fill="var(--accent)" filter="url(#pgLineGlow)"/>
                        <circle :cx="flameBarData[flameBarData.length-1].cx" :cy="flameBarData[flameBarData.length-1].y" r="2.5" fill="#fff"/>
                      </g>
                      <g v-if="flamePeak">
                        <circle :cx="flamePeak.cx" :cy="flamePeak.y" r="5" fill="var(--accent-alt2)" filter="url(#pgLineGlow)" opacity="0.9"/>
                        <circle :cx="flamePeak.cx" :cy="flamePeak.y" r="2.5" fill="#fff"/>
                      </g>
                      <rect x="0" y="0" width="640" height="200" fill="transparent" style="cursor:crosshair"/>
                    </svg>
                    <div class="pgc-html-layer">
                      <div class="pgc-month-range">{{ flameMonthRange }}</div>
                      <div v-if="flameAvgY !== null" class="pgc-avg-lbl" :style="{ top: (flameAvgY / 200 * 100) + '%' }">AVG {{ repoPulse.avgPerDay }}</div>
                      <template v-for="(b, i) in flameBarData" :key="'dl'+i">
                        <span v-if="i % 7 === 0 || i === flameBarData.length - 1"
                          class="pgc-date-lbl" :class="{ 'pgc-date-today': i === flameBarData.length - 1 }"
                          :style="{ left: (b.cx / 640 * 100) + '%' }">{{ b.shortLabel }}</span>
                      </template>
                      <div v-if="hoveredBarIndex !== null && tooltipPos" class="fc-tip"
                        :style="{ left: (tooltipPos.tx / 640 * 100) + '%', top: (tooltipPos.ty / 200 * 100) + '%' }">
                        <div class="fc-tip-count">{{ flameBarData[hoveredBarIndex].commits === 0 ? 'No commits' : flameBarData[hoveredBarIndex].commits + (flameBarData[hoveredBarIndex].commits !== 1 ? ' commits' : ' commit') }}</div>
                        <div class="fc-tip-date">{{ flameBarData[hoveredBarIndex].fullLabel }}</div>
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

    <!-- Toast Notifications -->
    <TransitionGroup name="toast-slide" tag="div" class="toast-container">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast-item"
        :class="'toast-' + t.type"
        @click="dismissToast(t.id)"
      >
        <div class="toast-accent-bar"></div>
        <div class="toast-icon">
          <svg v-if="t.type === 'commit'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M1.05 12H7m10.01 0h5.95"/></svg>
          <svg v-else-if="t.type === 'pr'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
          <svg v-else-if="t.type === 'issue'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
          <svg v-else-if="t.type === 'feedback'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        <div class="toast-body">
          <span class="toast-text">{{ t.text }}</span>
          <span class="toast-time">{{ t.timeAgo }}</span>
        </div>
        <button class="toast-close" @click.stop="dismissToast(t.id)">
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </TransitionGroup>

  </Teleport>
</template>

<script>
    import { useData } from 'vitepress'
    import CS2Background from '../CS2Background.vue'
    import LiquidMetalLogo from '../LiquidMetalLogo.vue'
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
        Icon,
        CS2Background,
        LiquidMetalLogo
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
      
      setup() {
        const { theme } = useData()
        return { vpTheme: theme }
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
          notifOpen: false,
          notifications: [],
          notifSeenIds: [],
          toasts: [],
          toastCounter: 0,
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
        flameLinePath() {
          const bars = this.flameBarData
          if (bars.length < 2) return ''
          let d = `M${bars[0].cx},${bars[0].y}`
          for (let i = 1; i < bars.length; i++) {
            const cp1x = bars[i-1].cx + (bars[i].cx - bars[i-1].cx) / 3
            const cp2x = bars[i].cx - (bars[i].cx - bars[i-1].cx) / 3
            d += ` C${cp1x},${bars[i-1].y} ${cp2x},${bars[i].y} ${bars[i].cx},${bars[i].y}`
          }
          return d
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
        unreadNotifCount() {
          return this.notifications.filter(n => !n.read).length
        }
      },
      
      watch: {},
      
      mounted() {
        this.isMounted = true
        const isDark = document.documentElement.classList.contains('dark')
        const vpTheme = localStorage.getItem('vitepress-theme-appearance')
        this.isLightTheme = (vpTheme === 'light') || (!isDark && vpTheme !== 'dark')
        localStorage.setItem('wildfire-theme', this.isLightTheme ? 'light' : 'dark')
        this._themeObserver = new MutationObserver(() => {
          this.isLightTheme = !document.documentElement.classList.contains('dark')
          localStorage.setItem('wildfire-theme', this.isLightTheme ? 'light' : 'dark')
        })
        this._themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        try { const pt = localStorage.getItem('wf-panel-theme'); if (pt) this.panelTheme = pt } catch (_) {}
        
        const token = localStorage.getItem('github_token')
        const userStr = localStorage.getItem('github_user')
        
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
        if (this._themeObserver) this._themeObserver.disconnect()
        if (this.$refs.mainContent) {
          this.$refs.mainContent.removeEventListener('scroll', this.handleScroll)
        }
        window.removeEventListener('resize', this.handleResize)
      },
  
  methods: {
  handleLoginSuccess(data) {
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
        return
      }
      
      this.isSyncing = true
      await Promise.all([
        this.fetchAllGitHubData(),
        this.loadRecentFeedbacks()
      ])
      this.buildNotifications()
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
    getNotifKey() {
      return `wildfire-notif-seen-${this.userLogin || 'anon'}`
    },

    buildNotifications() {
      const key = this.getNotifKey()
      try {
        this.notifSeenIds = JSON.parse(localStorage.getItem(key) || '[]')
      } catch { this.notifSeenIds = [] }

      const items = []

      if (this.recentCommits && this.recentCommits.length) {
        this.recentCommits.slice(0, 5).forEach(c => {
          const date = new Date(c.date)
          const id = 'commit-' + (c.id || '')
          items.push({
            id, type: 'commit',
            text: `${c.author || 'Someone'} committed: ${this.truncate(c.message || '', 50)}`,
            timeAgo: this.notifTimeAgo(date), url: c.url || '',
            read: this.notifSeenIds.includes(id), timestamp: date.getTime()
          })
        })
      }

      if (this.recentPRs && this.recentPRs.length) {
        this.recentPRs.slice(0, 3).forEach(pr => {
          const date = new Date(pr.date)
          const id = 'pr-' + (pr.number || pr.id || '')
          items.push({
            id, type: 'pr',
            text: `PR #${pr.number}: ${this.truncate(pr.title || '', 50)}`,
            timeAgo: this.notifTimeAgo(date), url: pr.url || '',
            read: this.notifSeenIds.includes(id), timestamp: date.getTime()
          })
        })
      }

      if (this.recentIssues && this.recentIssues.length) {
        this.recentIssues.slice(0, 3).forEach(issue => {
          const date = new Date(issue.date)
          const id = 'issue-' + (issue.number || issue.id || '')
          items.push({
            id, type: 'issue',
            text: `Issue #${issue.number}: ${this.truncate(issue.title || '', 50)}`,
            timeAgo: this.notifTimeAgo(date), url: issue.url || '',
            read: this.notifSeenIds.includes(id), timestamp: date.getTime()
          })
        })
      }

      if (this.recentFeedbacks && this.recentFeedbacks.length) {
        this.recentFeedbacks.slice(0, 4).forEach(fb => {
          const date = new Date(fb.createdAt)
          const id = 'feedback-' + (fb.id || '')
          const emoji = fb.sentiment === 'good' ? '👍' : '👎'
          items.push({
            id, type: 'feedback',
            text: `${emoji} Feedback on ${this.truncate(fb.pageTitle || 'page', 30)}${fb.stars ? ' (' + fb.stars + '★)' : ''}`,
            timeAgo: this.notifTimeAgo(date), url: '',
            read: this.notifSeenIds.includes(id), timestamp: date.getTime()
          })
        })
      }

      items.sort((a, b) => b.timestamp - a.timestamp)
      this.notifications = items.slice(0, 15)

      const brandNew = this.notifications.filter(n => !n.read && !this.notifSeenIds.includes(n.id))
      if (brandNew.length) {
        brandNew.forEach((n, i) => {
          setTimeout(() => this.showToast(n), i * 400)
        })
        brandNew.forEach(n => this.notifSeenIds.push(n.id))
        localStorage.setItem(key, JSON.stringify(this.notifSeenIds))
      }
    },

    markAllRead() {
      const key = this.getNotifKey()
      this.notifications.forEach(n => { n.read = true })
      this.notifSeenIds = this.notifications.map(n => n.id)
      localStorage.setItem(key, JSON.stringify(this.notifSeenIds))
      this.toasts = []
    },

    handleNotifClick(n) {
      const key = this.getNotifKey()
      n.read = true
      if (!this.notifSeenIds.includes(n.id)) {
        this.notifSeenIds.push(n.id)
        localStorage.setItem(key, JSON.stringify(this.notifSeenIds))
      }
      if (n.url) window.open(n.url, '_blank')
      this.notifOpen = false
    },

    showToast(notif) {
      const tid = ++this.toastCounter
      this.toasts.push({ id: tid, type: notif.type, text: notif.text, timeAgo: notif.timeAgo })
      if (this.toasts.length > 5) this.toasts.shift()
      setTimeout(() => this.dismissToast(tid), 6000)
    },

    dismissToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    },

    playNotifSound() {}, // Removed the playNotifSound method

    notifTimeAgo(date) {
      const d = new Date(date)
      const now2 = new Date()
      const diff = Math.floor((now2 - d) / 1000)
      if (diff < 60) return 'just now'
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
      if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
      return d.toLocaleDateString()
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
/* ============================================================
   WILDFIRE DASHBOARD - COMPLETE CSS
   ============================================================ */

/* Reset cursor defaults */
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
.wildfire-dashboard [role="button"],
.wildfire-dashboard .nav-item,
.wildfire-dashboard .commit-card,
.wildfire-dashboard .ipr-row,
.wildfire-dashboard .tc-row,
.wildfire-dashboard .qa-btn,
.wildfire-dashboard .action-btn,
.wildfire-dashboard .act-cal-cell {
  cursor: pointer !important;
}

/* ============================================================
   CSS VARIABLES - DARK THEME (DEFAULT)
   ============================================================ */
.wildfire-dashboard {
  --bg-primary: transparent;
  --bg-secondary: rgba(6, 6, 10, 0.72);
  --bg-tertiary: rgba(255, 120, 0, 0.06);
  --bg-hover: rgba(255, 120, 0, 0.09);
  --border-color: rgba(255, 120, 0, 0.12);
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a9a;
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0, 0.20);
  --accent-dim: rgba(255, 120, 0, 0.08);
  --accent-soft: rgba(255, 120, 0, 0.15);
  --accent-mid: rgba(255, 120, 0, 0.28);
  --accent-strong: rgba(255, 120, 0, 0.45);
  --accent-heavy: rgba(255, 120, 0, 0.68);
  --accent-solid: rgba(255, 120, 0, 0.88);
  --accent-alt: #ff6030;
  --accent-alt2: #ff8c42;
  --success: #2ecc71;
  --shadow-color: rgba(0, 0, 0, 0.6);
  --glass-blur: blur(22px) saturate(1.3);

  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  overflow: hidden;
  background: transparent;
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
  font-size: 13px;
}

/* Light theme */
.wildfire-dashboard.light-theme {
  --bg-primary: transparent;
  --bg-secondary: rgba(255, 255, 255, 0.92);
  --bg-tertiary: rgba(255, 120, 0, 0.06);
  --bg-hover: rgba(255, 120, 0, 0.08);
  --border-color: rgba(0, 0, 0, 0.08);
  --text-primary: #1a1a2e;
  --text-secondary: #2d2d40;
  --text-muted: #5a5a6a;
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0, 0.1);
  --accent-dim: rgba(255, 120, 0, 0.05);
  --accent-soft: rgba(255, 120, 0, 0.1);
  --accent-mid: rgba(255, 120, 0, 0.2);
  --accent-strong: rgba(255, 120, 0, 0.35);
  --accent-heavy: rgba(255, 120, 0, 0.5);
  --accent-solid: rgba(255, 120, 0, 0.8);
  --accent-alt: #e06800;
  --accent-alt2: #ff8c42;
  --success: #1a7f37;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --glass-blur: blur(22px) saturate(1.3);
}

/* Light theme specific overrides */
.wildfire-dashboard.light-theme .dashboard-sidebar {
  background: rgba(255, 255, 255, 0.88);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
}

.wildfire-dashboard.light-theme .sidebar-brand {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .nav-item {
  color: #4a4a5a;
}

.wildfire-dashboard.light-theme .nav-item:hover {
  background: rgba(255, 120, 0, 0.06);
  color: #1a1a2e;
}

.wildfire-dashboard.light-theme .nav-item.active {
  background: rgba(255, 120, 0, 0.12);
  color: var(--accent);
  box-shadow: inset 0 0 0 1px rgba(255, 120, 0, 0.15);
  border-color: rgba(255, 120, 0, 0.2);
  border-left: 3px solid var(--accent);
}

.wildfire-dashboard.light-theme .dashboard-header {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.wildfire-dashboard.light-theme .dash-welcome {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .kpi-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .kpi-card:hover {
  border-color: var(--accent-mid);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.wildfire-dashboard.light-theme .dash-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .wiki-stats-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .repo-pulse-strip {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .nav-badge {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .tc-list {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .fb-mini {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .ipr-panel {
  background: rgba(255, 255, 255, 0.88);
}

.wildfire-dashboard.light-theme .activity-timeline-card {
  background: rgba(255, 255, 255, 0.88);
}

.wildfire-dashboard.light-theme .repo-health-card {
  background: rgba(255, 255, 255, 0.88);
}

.wildfire-dashboard.light-theme .act-cal-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .week-rhythm-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .sf-card {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .sf-home-link {
  color: #5a5a6a;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.wildfire-dashboard.light-theme .sf-home-link:hover {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a2e;
}

.wildfire-dashboard.light-theme .search-wrapper {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.wildfire-dashboard.light-theme .search-wrapper input::placeholder {
  color: #8a8a9a;
}

.wildfire-dashboard.light-theme .server-status-card {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .dc-head {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .tc-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .ipr-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .at-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .fb-mini-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.wildfire-dashboard.light-theme .brand-name-white {
  color: #1a1a2e;
}

.wildfire-dashboard.light-theme .brand-sub {
  color: #6a6a7a;
}

.wildfire-dashboard.light-theme .fc-tip {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.wildfire-dashboard.light-theme .notif-dropdown {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.wildfire-dashboard.light-theme .toast-item {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* Light theme chart colors */
.wildfire-dashboard.light-theme .fc-hm-0 { background: #e0e0e0; }
.wildfire-dashboard.light-theme .fc-hm-1 { background: rgba(255, 120, 0, 0.2); }
.wildfire-dashboard.light-theme .fc-hm-2 { background: rgba(255, 120, 0, 0.4); }
.wildfire-dashboard.light-theme .fc-hm-3 { background: rgba(255, 120, 0, 0.65); }
.wildfire-dashboard.light-theme .fc-hm-4 { background: rgba(255, 120, 0, 0.9); }

.wildfire-dashboard.light-theme .act-cal-cell.intensity-0 { background: #e8e8e8; }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-1 { background: rgba(255, 120, 0, 0.2); }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-2 { background: rgba(255, 120, 0, 0.4); }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-3 { background: rgba(255, 120, 0, 0.65); }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-4 { background: rgba(255, 120, 0, 0.9); }

.wildfire-dashboard.light-theme .acl-cell.intensity-0 { background: #e8e8e8; }
.wildfire-dashboard.light-theme .acl-cell.intensity-1 { background: rgba(255, 120, 0, 0.2); }
.wildfire-dashboard.light-theme .acl-cell.intensity-2 { background: rgba(255, 120, 0, 0.4); }
.wildfire-dashboard.light-theme .acl-cell.intensity-3 { background: rgba(255, 120, 0, 0.65); }
.wildfire-dashboard.light-theme .acl-cell.intensity-4 { background: rgba(255, 120, 0, 0.9); }

/* ============================================================
   LAYOUT - MAIN STRUCTURE
   ============================================================ */
.dashboard-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 16px 20px;
  position: relative;
  z-index: 1;
  background: transparent;
  scroll-behavior: smooth;
}

.dashboard-main.sidebar-collapsed {
  padding-left: 24px;
}

.view-container {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ============================================
   SIDEBAR BRAND - STIL SERVERPANEL
   ============================================ */
.sidebar-brand {
  padding: 32px 20px 24px !important;
  display: flex;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 12px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  position: relative;
  text-align: center !important;
}

.brand-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 10px 25px rgba(255, 120, 0, 0.4));
  margin-bottom: 6px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px;
  width: 100%;
  text-align: center !important;
}

/* "WILDFIRE" - stil SERVERPANEL */
.brand-name {
  font-size: 15px !important;
  font-weight: 800 !important;
  letter-spacing: 3px !important;
  line-height: 1 !important;
  color: #ff6600 !important;
  text-transform: uppercase !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8) !important;
  -webkit-text-fill-color: #ff6600 !important;
  background: none !important;
  text-align: center !important;
  font-family: 'Inter', sans-serif !important;
}

/* "DOCUMENTATION" - stil SERVER ADMINISTRATION */
.brand-sub {
  font-size: 10px !important;
  font-weight: 700 !important;
  color: #6e6e6e !important;
  letter-spacing: 5px !important;
  text-transform: uppercase !important;
  opacity: 0.95 !important;
  text-align: center !important;
  font-family: 'Inter', sans-serif !important;
  word-spacing: 2px;
}

/* ============================================
   SECTION HEADER "MAIN"
   ============================================ */
.sidebar-nav::before {
  content: 'MAIN';
  display: block;
  padding: 20px 24px 12px;
  font-size: 11px;
  font-weight: 800;
  color: #6a6a7a;
  letter-spacing: 4px;
  text-transform: uppercase;
  opacity: 0.6;
}

/* ============================================
   COLLAPSED STATE
   ============================================ */
.dashboard-sidebar.collapsed .sidebar-brand {
  padding: 32px 0 24px !important;
}

.dashboard-sidebar.collapsed .brand-text {
  display: none;
}

/* ============================================
   SECTION HEADER "MAIN"
   ============================================ */
.sidebar-nav {
  position: relative;
}

.sidebar-nav::before {
  content: 'MAIN';
  display: block;
  padding: 16px 20px 8px;
  font-size: 10px;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  opacity: 0.6;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
}

/* Pentru "DATA" și "SYSTEM" - opțional, le poți adăuga manual */
.sidebar-nav .nav-item[data-section="data"] {
  margin-top: 20px;
  position: relative;
}

.sidebar-nav .nav-item[data-section="data"]::before {
  content: 'DATA';
  position: absolute;
  top: -22px;
  left: 20px;
  font-size: 10px;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  opacity: 0.6;
}

/* ============================================
   LIQUID GLASS SIDEBAR COMPLET
   ============================================ */
.dashboard-sidebar {
  --glass-bg: rgba(6, 6, 16, 0.45);
  --glass-border: rgba(255, 255, 255, 0.10);
  width: 260px;
  background: var(--glass-bg);
  backdrop-filter: blur(52px) saturate(180%) brightness(1.06);
  -webkit-backdrop-filter: blur(52px) saturate(180%) brightness(1.06);
  border-right: 1px solid var(--glass-border);
  box-shadow:
    8px 0 64px rgba(0, 0, 0, 0.65),
    inset -1px 0 0 rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 10;
  isolation: isolate;
  contain: paint;
  transition: width 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Ambient light effects */
.dashboard-sidebar::before {
  content: '';
  position: absolute;
  top: -30px;
  left: -30px;
  right: -30px;
  height: 250px;
  background: radial-gradient(circle at 30% 0%, var(--accent-glow) 0%, rgba(255, 120, 0, 0.06) 50%, transparent 80%);
  pointer-events: none;
  opacity: 0.8;
  z-index: -1;
  filter: blur(20px);
}

.dashboard-sidebar::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -30px;
  right: -30px;
  height: 200px;
  background: radial-gradient(circle at 70% 100%, rgba(255, 96, 48, 0.1) 0%, transparent 80%);
  pointer-events: none;
  z-index: -1;
  filter: blur(25px);
}

.dashboard-sidebar.collapsed {
  width: 80px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.dashboard-sidebar::-webkit-scrollbar {
  display: none;
}

/* ============================================
   NAV ITEMS - Glass style
   ============================================ */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 18px;
  margin: 3px 10px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.8px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateX(4px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(255, 120, 0, 0.18), rgba(255, 80, 0, 0.08));
  color: var(--accent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 0 0 1px rgba(255, 120, 0, 0.22), 0 4px 20px rgba(255, 120, 0, 0.12);
  border-color: rgba(255, 120, 0, 0.28);
  border-left: 3px solid var(--accent);
  backdrop-filter: blur(16px);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.nav-item:hover .nav-icon,
.nav-item.active .nav-icon {
  opacity: 1;
}

.nav-icon svg {
  width: 18px;
  height: 18px;
  stroke-width: 1.75;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
}

.nav-badge {
  background: rgba(0, 0, 0, 0.4);
  color: #22c55e;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.5px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  backdrop-filter: blur(8px);
}

.nav-item.active .nav-badge {
  background: rgba(255, 120, 0, 0.12);
  color: var(--accent);
  border-color: rgba(255, 120, 0, 0.2);
}

.nav-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.nav-item:hover .nav-glow {
  left: 100%;
}

/* ============================================
   FOOTER
   ============================================ */
.sidebar-footer {
  padding: 16px 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sf-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(24px) saturate(160%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.22s ease;
}

.sf-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 120, 0, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 28px rgba(0, 0, 0, 0.35);
}

.sf-profile-area {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.sf-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.sf-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  box-shadow: 0 4px 16px var(--accent-glow);
}

.sf-online-dot {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid rgba(8, 8, 14, 0.95);
  box-shadow: 0 0 12px #22c55e;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.sf-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sf-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sf-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  color: #22c55e;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.sf-pulse-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: statusPulse 1.5s ease infinite;
}

.sf-out-btn {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  padding: 8px;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.sf-out-btn:hover {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.15);
  border-color: rgba(231, 76, 60, 0.3);
}

.sf-home-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-transform: uppercase;
}

.sf-home-link:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.10);
  color: var(--text-secondary);
}

/* ============================================
   COLLAPSED STATE
   ============================================ */
.dashboard-sidebar.collapsed .sidebar-brand {
  justify-content: center;
  padding: 28px 0 22px;
}

.dashboard-sidebar.collapsed .brand-text,
.dashboard-sidebar.collapsed .nav-label,
.dashboard-sidebar.collapsed .nav-badge,
.dashboard-sidebar.collapsed .sidebar-nav::before,
.dashboard-sidebar.collapsed .sf-info,
.dashboard-sidebar.collapsed .sf-home-link span {
  display: none;
}

.dashboard-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 11px;
  margin: 3px 12px;
}

.dashboard-sidebar.collapsed .sf-card {
  justify-content: center;
  padding: 8px;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
}

.dashboard-sidebar.collapsed .brand-icon {
  transform: scale(0.72);
  transform-origin: center;
}

.dashboard-sidebar.collapsed .sf-home-link {
  justify-content: center;
  padding: 9px;
}

.dashboard-sidebar.collapsed .sf-out-btn {
  flex-shrink: 0;
}

/* ============================================
   MOBILE
   ============================================ */
@media (max-width: 640px) {
  .dashboard-sidebar {
    display: none !important;
  }
}

/* ============================================================
   HEADER
   ============================================================ */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 9px 16px;
  background: rgba(6, 6, 18, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 18px;
  position: sticky;
  top: 8px;
  z-index: 50;
  backdrop-filter: blur(52px) saturate(180%) brightness(1.07);
  -webkit-backdrop-filter: blur(52px) saturate(180%) brightness(1.07);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
}

.dashboard-header.scrolled {
  box-shadow: 0 10px 52px rgba(0, 0, 0, 0.55), 0 0 28px var(--accent-dim), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 120, 0, 0.22);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h1 {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.7px;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
}

.menu-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 7px;
  cursor: pointer;
  border-radius: 9px;
  display: flex;
  align-items: center;
  transition: all 0.18s;
}

.menu-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--bg-tertiary);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(34, 197, 94, 0.07);
  border: 1px solid rgba(34, 197, 94, 0.18);
  border-radius: 20px;
}

.live-pulse {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: livePulse 1.5s ease infinite;
  flex-shrink: 0;
}

.live-text {
  font-size: 9px;
  font-weight: 800;
  color: #22c55e;
  letter-spacing: 1px;
}

.live-time {
  font-size: 9px;
  color: var(--text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Action Buttons */
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 9px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}

.action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 4px 14px var(--accent-mid);
}

.action-btn.primary:hover {
  background: var(--accent-alt);
  box-shadow: 0 6px 20px var(--accent-strong);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: wait;
  transform: none !important;
}

.btn-text {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.theme-toggle-btn {
  padding: 8px !important;
}

/* ============================================================
   NOTIFICATIONS DROPDOWN
   ============================================================ */
.notif-wrapper {
  position: relative;
}

.notif-bell {
  position: relative;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  background: var(--accent);
  color: #fff;
  border-radius: 8px;
  font-size: 8px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(4, 4, 8, 1);
}

.notif-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: rgba(6, 6, 18, 0.65);
  backdrop-filter: blur(52px) saturate(180%) brightness(1.08);
  -webkit-backdrop-filter: blur(52px) saturate(180%) brightness(1.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.16);
  overflow: hidden;
  z-index: 200;
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.notif-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.4px;
}

.notif-mark-read {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--text-muted);
  font-size: 11px;
}

.notif-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 4px 0;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.notif-item:hover {
  background: var(--bg-tertiary);
}

.notif-item.unread {
  background: var(--bg-tertiary);
}

.notif-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon.commit {
  background: var(--accent-dim);
  color: var(--accent);
}

.notif-icon.pr {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.notif-icon.issue {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.notif-icon.feedback {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-text {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.notif-time {
  font-size: 9px;
  color: var(--text-muted);
}

/* Notification transitions */
.notif-drop-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.notif-drop-leave-active {
  transition: all 0.15s ease-in;
}

.notif-drop-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.notif-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* ============================================================
   WELCOME BANNER
   ============================================================ */
.dash-welcome {
  position: relative;
  background: rgba(6, 6, 18, 0.45);
  backdrop-filter: blur(52px) saturate(180%) brightness(1.07);
  -webkit-backdrop-filter: blur(52px) saturate(180%) brightness(1.07);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 14px;
  margin-bottom: 20px;
}

.dw-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dw-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.dw-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--accent-mid);
}

.dw-online {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: var(--success);
  border-radius: 50%;
  border: 2px solid rgba(4, 4, 8, 0.95);
}

.dw-text h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.3;
  color: var(--text-primary);
}

.dw-name {
  color: var(--accent);
  font-weight: 700;
}

.dw-text p {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  font-weight: 400;
}

.dw-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dws-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.dws-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.dws-val.positive {
  color: #22c55e;
}

.dws-lbl {
  font-size: 9px;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.4px;
}

.dws-sep {
  width: 1px;
  height: 28px;
  background: var(--border-color);
}

/* ============================================================
   KPI CARDS
   ============================================================ */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.kpi-card {
  position: relative;
  background: rgba(6, 6, 18, 0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  padding: 16px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.10);
  min-height: 85px;
}

.kpi-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 120, 0, 0.28);
  box-shadow: 0 16px 52px rgba(0, 0, 0, 0.45), 0 0 32px var(--accent-dim), inset 0 1px 0 rgba(255, 255, 255, 0.16);
  background: rgba(10, 10, 28, 0.55);
}

.kpi-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-body {
  flex: 1;
  min-width: 0;
}

.kpi-val {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.kpi-lbl {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 4px;
}

.kpi-glow {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  opacity: 0.18;
  pointer-events: none;
}

/* ============================================================
   REPO PULSE STRIP
   ============================================================ */
.repo-pulse-strip {
  background: rgba(6, 6, 18, 0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 16px 0;
}

.rps-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  background: var(--accent-dim);
  border-right: 1px solid var(--border-color);
  font-size: 9px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.rps-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 6px;
  gap: 2px;
  min-width: 0;
}

.rps-sep {
  width: 1px;
  background: var(--border-color);
  margin: 8px 0;
  flex-shrink: 0;
}

.rps-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  line-height: 1.2;
}

.rps-lbl {
  font-size: 8px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.rps-pos {
  color: var(--success) !important;
}

.rps-neg {
  color: #ef4444 !important;
}

/* ============================================================
   SECTION LABELS
   ============================================================ */
.dash-slabel {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 12px 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.dash-slabel svg {
  color: var(--accent);
}

.dsl-badge {
  margin-left: auto;
  background: var(--bg-tertiary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 9px;
  color: var(--accent);
}

/* ============================================================
   CARDS
   ============================================================ */
.dash-card {
  background: rgba(6, 6, 18, 0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.10);
}

.dc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  gap: 10px;
  border-bottom: 1px solid var(--border-color);
}

.dc-head-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.dc-badge {
  background: var(--bg-tertiary);
  color: var(--accent);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.dc-badge.blue {
  color: #3b82f6;
}

.dc-badge.green {
  color: #22c55e;
}

.live-dot-sm {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: livePulse 1.5s ease infinite;
  margin-right: 6px;
}

/* ============================================================
   WIKI STATS CARD
   ============================================================ */
.wiki-stats-card {
  background: rgba(6, 6, 18, 0.46);
  backdrop-filter: blur(40px) saturate(175%);
  -webkit-backdrop-filter: blur(40px) saturate(175%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-top: 2px solid var(--accent-strong);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.10);
  margin-bottom: 20px;
}

.wsc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border-bottom: 1px solid var(--border-color);
}

.wsc-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wsc-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
}

.wsc-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.3px;
}

.wsc-sub {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 1px;
}

.wsc-live-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 20px;
  font-size: 9px;
  font-weight: 700;
  color: #22c55e;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.wsc-live-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: livePulse 1.5s ease infinite;
  flex-shrink: 0;
}

.wsc-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border-color);
}

.wsc-kpi {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 10px;
  border-right: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  transition: background 0.15s;
}

.wsc-kpi:last-child {
  border-right: none;
}

.wsc-kpi::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--kpi-c, var(--accent));
}

.wsc-kpi:hover {
  background: var(--bg-tertiary);
}

.wsc-kpi svg,
.wsc-kpi .iconify {
  color: var(--kpi-c, var(--accent));
  opacity: 0.75;
  margin-bottom: 2px;
}

.wsc-kpi-val {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.5px;
}

.wsc-kpi-lbl {
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.8px;
}

.wsc-body {
  display: grid;
  grid-template-columns: 1fr auto;
}

.wsc-breakdown {
  padding: 14px 18px;
  min-width: 0;
}

.wsc-bk-title {
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.wsc-bk-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.wsc-bk-name {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  width: 86px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.wsc-bk-track {
  flex: 1;
  height: 5px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.wsc-bk-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.8;
}

.wsc-bk-count {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  width: 18px;
  text-align: right;
  flex-shrink: 0;
}

.wsc-bk-empty {
  font-size: 11px;
  color: var(--text-muted);
  padding: 12px 0;
}

.wsc-ring-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 22px;
  border-left: 1px solid var(--border-color);
}

.wsc-ring-svg-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wsc-ring-center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.wsc-ring-val {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.5px;
}

.wsc-ring-lbl {
  font-size: 8px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-top: 4px;
}

.wsc-ring-sub {
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 2px;
  opacity: 0.7;
}

.wsc-ring-legend {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
}

.wsc-rl-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: var(--text-muted);
  white-space: nowrap;
}

.wsc-rl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px currentColor;
}

.wsc-stats-pills {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.wsc-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 6px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-top: 2px solid var(--pc, var(--accent));
  border-radius: 8px;
  transition: background 0.15s;
}

.wsc-pill:hover {
  background: rgba(255,255,255,0.06);
}

.wsc-pill-val {
  font-size: 16px;
  font-weight: 800;
  color: var(--pc, var(--accent));
  line-height: 1;
  letter-spacing: -0.5px;
}

.wsc-pill-lbl {
  font-size: 8px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.8px;
}

.dash-charts {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  margin-bottom: 20px;
}

.dash-chart-main {
  border-top: 2.5px solid var(--accent);
}

.flame-chart {
  padding: 16px;
}

/* Player-growth style KPI row */
.pgc-kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.pgc-kpi {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px;
  border-right: 1px solid var(--border-color);
  gap: 6px;
}

.pgc-kpi:last-child {
  border-right: none;
}

.pgc-kpi-lbl {
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.pgc-kpi-val {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.5px;
}

/* Area+line chart wrapper */
.pgc-chart-wrap {
  position: relative;
  cursor: crosshair;
}

.pgc-html-layer {
  position: relative;
  height: 22px;
  margin-top: 6px;
}

.pgc-month-range {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 9px;
  color: var(--text-muted);
  opacity: 0.7;
}

.pgc-avg-lbl {
  position: absolute;
  right: 0;
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 120, 0, 0.6);
  transform: translateY(-50%);
  pointer-events: none;
}

.pgc-date-lbl {
  position: absolute;
  transform: translateX(-50%);
  font-size: 9px;
  color: var(--text-muted);
  white-space: nowrap;
}

.pgc-date-today {
  color: var(--accent);
  font-weight: 700;
}

.fc-svg {
  width: 100%;
  height: auto;
}

.fc-kpi-row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.fc-kpi {
  flex: 1;
  text-align: center;
}

.fc-kpi-v {
  font-size: 18px;
  font-weight: 700;
  display: block;
  color: var(--text-primary);
}

.fc-kpi-l {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.fc-kpi-accent .fc-kpi-v {
  color: var(--accent-alt2);
}

.fc-kpi-green .fc-kpi-v {
  color: #22c55e;
}

.fc-html-layer {
  position: relative;
  height: 20px;
  margin-top: 8px;
}

.fc-month-badge {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 9px;
  color: var(--text-muted);
}

.fc-date-lbl {
  position: absolute;
  transform: translateX(-50%);
  font-size: 9px;
  color: var(--text-muted);
}

.fc-date-weekend {
  color: var(--accent-alt);
}

.fc-date-today {
  color: var(--accent);
  font-weight: 700;
}

.fc-tip {
  position: absolute;
  background: var(--bg-secondary);
  backdrop-filter: blur(16px);
  border: 1px solid var(--accent-soft);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 11px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  white-space: nowrap;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  z-index: 100;
}

.fc-tip-count {
  font-weight: 700;
  color: var(--text-primary);
}

.fc-tip-date {
  color: var(--text-muted);
  font-size: 10px;
}

.fc-tip-pct {
  color: var(--accent);
  font-size: 9px;
  margin-top: 4px;
}

.fc-peak-lbl {
  position: absolute;
  transform: translate(-50%, -100%);
  font-size: 10px;
  font-weight: 700;
  color: var(--accent-alt2);
  margin-top: -8px;
}

.fc-avg-lbl {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  font-size: 9px;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
}

.fc-heatmap-wrap {
  padding: 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.fc-hm-label {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.fc-heatmap-row {
  display: flex;
  gap: 2px;
  flex: 1;
}

.fc-hm-cell {
  flex: 1;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
}

.fc-hm-0 { background: var(--bg-tertiary); }
.fc-hm-1 { background: rgba(255, 120, 0, 0.2); }
.fc-hm-2 { background: rgba(255, 120, 0, 0.4); }
.fc-hm-3 { background: rgba(255, 120, 0, 0.65); }
.fc-hm-4 { background: rgba(255, 120, 0, 0.9); }

.fc-hm-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: var(--text-muted);
}

/* Repository Card */
.rs-rings {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
}

.rs-ring-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rs-ring-svg-wrap {
  position: relative;
  width: 66px;
  height: 66px;
}

.rs-ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.rs-ring-lbl {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.lang-section {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.lang-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.8px;
  margin-bottom: 10px;
  display: block;
}

.lang-bar-track {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  margin-bottom: 12px;
}

.lang-seg {
  height: 100%;
}

.lang-keys {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.lang-key {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-secondary);
}

.lang-key em {
  color: var(--text-muted);
  font-style: normal;
}

.lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* ============================================================
   COMMITS PANEL
   ============================================================ */
.commits-panel {
  margin-bottom: 20px;
}

.commits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--border-color);
}

.commit-card {
  background: var(--bg-secondary);
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.commit-card:hover {
  background: var(--bg-hover);
}

.cc-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.cc-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.cc-hash {
  font-family: monospace;
  font-size: 11px;
  color: var(--accent);
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
}

.cc-arrow {
  margin-left: auto;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s;
}

.commit-card:hover .cc-arrow {
  opacity: 1;
}

.cc-msg {
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.4;
}

.cc-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-muted);
}

.cc-author {
  color: var(--accent);
}

.cc-sep {
  opacity: 0.5;
}

/* ============================================================
   TOP CONTRIBUTORS
   ============================================================ */
.tc-list {
  margin-bottom: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.tc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-color);
}

.tc-row:last-child {
  border-bottom: none;
}

.tc-row:hover {
  background: var(--bg-hover);
}

.tc-rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  flex-shrink: 0;
}

.tcr-1 {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #000;
}

.tcr-2 {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: #000;
}

.tcr-3 {
  background: linear-gradient(135deg, #cd7f32, #a05a20);
  color: #fff;
}

.tc-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tc-info {
  flex: 1;
  min-width: 0;
}

.tc-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tc-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tc-bar-track {
  flex: 1;
  height: 5px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.tc-bar-fill {
  height: 100%;
  border-radius: 3px;
}

.tc-commits-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
}

.tc-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}

/* ============================================================
   FEEDBACK MINI
   ============================================================ */
.fb-mini {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.fb-mini-loading {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}

.fb-mini-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 8px;
}

.fb-mini-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}

.fb-mini-list {
  max-height: 300px;
  overflow-y: auto;
}

.fb-mini-row {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-color);
}

.fb-mini-row:last-child {
  border-bottom: none;
}

.fb-mini-dot {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fb-dot-good {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.fb-dot-bad {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.fb-mini-body {
  flex: 1;
  min-width: 0;
}

.fb-mini-page {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.fb-mini-comment {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fb-mini-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fb-mini-stars {
  display: flex;
  gap: 2px;
}

.fb-mini-time {
  font-size: 9px;
  color: var(--text-muted);
}

.fb-mini-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.fb-mini-total {
  font-size: 10px;
  color: var(--text-muted);
}

.fb-mini-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
}

.fb-mini-link:hover {
  background: var(--accent-dim);
}

/* ============================================================
   ISSUES & PRs PANELS
   ============================================================ */
.dash-ipr {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.ipr-panel {
  background: var(--bg-secondary);
  overflow: hidden;
}

.ipr-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.issue-dot {
  background: #3b82f6;
  box-shadow: 0 0 8px #3b82f6;
}

.pr-dot {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
}

.ipr-new-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.ipr-new-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--bg-tertiary);
}

.ipr-list {
  max-height: 350px;
  overflow-y: auto;
}

.ipr-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-color);
}

.ipr-row:last-child {
  border-bottom: none;
}

.ipr-row:hover {
  background: var(--bg-hover);
}

.ipr-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ipr-body {
  flex: 1;
  min-width: 0;
}

.ipr-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.ipr-num-badge {
  font-family: monospace;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.ipr-num-badge.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.ipr-num-badge.green {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.ipr-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ipr-meta-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-muted);
}

.ipr-author {
  color: var(--accent);
}

.ipr-sep {
  opacity: 0.5;
}

.ipr-arrow {
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.ipr-row:hover .ipr-arrow {
  opacity: 1;
}

.ipr-empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ============================================================
   LIVE OVERVIEW (Activity + Health)
   ============================================================ */
.dash-weekly {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  margin-bottom: 20px;
}

.activity-timeline-card {
  background: var(--bg-secondary);
  overflow: hidden;
}

.at-list {
  max-height: 400px;
  overflow-y: auto;
}

.at-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.at-row:last-child {
  border-bottom: none;
}

.at-row:hover {
  background: var(--bg-hover);
}

.at-line {
  position: absolute;
  left: 23px;
  top: 28px;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.at-row:last-child .at-line {
  display: none;
}

.at-icon-wrap {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.ati-commit {
  background: var(--accent-dim);
  color: var(--accent);
}

.ati-pr {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.ati-issue {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.at-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.at-body {
  flex: 1;
  min-width: 0;
}

.at-msg {
  font-size: 11px;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.at-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: var(--text-muted);
}

.at-author {
  color: var(--accent);
}

.at-sep {
  opacity: 0.5;
}

.at-num {
  font-family: monospace;
  margin-left: 4px;
}

.at-type-pill {
  font-size: 8px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.pill-commit {
  background: var(--accent-dim);
  color: var(--accent);
}

.pill-pr {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.pill-issue {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.repo-health-card {
  background: var(--bg-secondary);
  overflow: hidden;
}

.rh-rows {
  padding: 8px 0;
}

.rh-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
}

.rh-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  width: 130px;
  flex-shrink: 0;
}

.rh-bar-wrap {
  flex: 1;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.rh-bar {
  height: 100%;
  border-radius: 3px;
}

.rh-bar.green { background: linear-gradient(90deg, #22c55e, #4ade80); }
.rh-bar.blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.rh-bar.orange { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.rh-bar.purple { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
.rh-bar.red { background: linear-gradient(90deg, #ef4444, #f87171); }

.rh-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  width: 40px;
  text-align: right;
  flex-shrink: 0;
}

/* ============================================================
   QUICK ACTIONS
   ============================================================ */
.qa-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.qa-btn {
  flex: 1;
  min-width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s;
}

.qa-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.qa-blue:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.qa-green:hover {
  border-color: #22c55e;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
}

.qa-orange:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
}

.qa-purple:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.08);
}

.qa-red:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

.qa-teal:hover {
  border-color: #14b8a6;
  color: #14b8a6;
  background: rgba(20, 184, 166, 0.08);
}



/* ============================================================
   WEEKLY RHYTHM
   ============================================================ */
.week-rhythm-card {
  background: rgba(6, 6, 10, 0.7);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03);
  margin-bottom: 20px;
}

.wrc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--accent-dim);
  flex-wrap: wrap;
  gap: 6px;
}

.wrc-title {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.3px;
}

.wrc-peak {
  font-size: 10px;
  color: var(--text-secondary);
}

.wrc-peak strong {
  color: var(--accent);
}

.wrc-bars {
  padding: 6px 4px 10px;
}

.wrc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px;
  border-radius: 6px;
  transition: background 0.15s;
}

.wrc-row:hover {
  background: var(--bg-tertiary);
}

.wrc-row.wrc-peak {
  background: var(--accent-dim);
}

.wrc-row.wrc-weekend .wrc-day {
  opacity: 0.55;
}

.wrc-day {
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  width: 28px;
  flex-shrink: 0;
}

.wrc-track {
  flex: 1;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.wrc-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--accent-alt), var(--accent));
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.wrc-fill-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 3px;
  background: var(--accent);
  opacity: 0.35;
  filter: blur(4px);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.wrc-avg {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary);
  width: 30px;
  text-align: right;
  flex-shrink: 0;
}

.wrc-unit {
  font-size: 8px;
  color: var(--text-muted);
  margin-left: 2px;
}

.wrc-total {
  font-size: 9px;
  color: var(--text-muted);
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}

/* ============================================================
   MOBILE BOTTOM NAVIGATION
   ============================================================ */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 62px;
  background: rgba(4, 4, 8, 0.88);
  border-top: 1px solid var(--border-color);
  z-index: 300;
  padding: 0 2px;
  padding-bottom: env(safe-area-inset-bottom);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.35);
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

.mbn-item.active {
  color: var(--accent);
}

.mbn-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 2px;
  background: var(--accent);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 1px 8px var(--accent-glow);
}

.mbn-icon {
  display: flex;
  align-items: center;
  line-height: 1;
}

.mbn-icon svg {
  width: 18px;
  height: 18px;
}

.mbn-label {
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  line-height: 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mbn-live {
  position: absolute;
  top: 7px;
  right: calc(50% - 13px);
  width: 5px;
  height: 5px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.8);
  animation: livePulse 1.5s ease infinite;
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast-item {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 16px;
  min-width: 280px;
  max-width: 380px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.toast-accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent);
}

.toast-item.toast-commit .toast-accent-bar { background: var(--accent); }
.toast-item.toast-pr .toast-accent-bar { background: #22c55e; }
.toast-item.toast-issue .toast-accent-bar { background: #3b82f6; }
.toast-item.toast-feedback .toast-accent-bar { background: #8b5cf6; }

.toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-item.toast-commit .toast-icon {
  background: var(--accent-dim);
  color: var(--accent);
}

.toast-item.toast-pr .toast-icon {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.toast-item.toast-issue .toast-icon {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.toast-item.toast-feedback .toast-icon {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-text {
  display: block;
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 2px;
}

.toast-time {
  font-size: 9px;
  color: var(--text-muted);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.toast-close:hover {
  opacity: 1;
  background: var(--bg-tertiary);
}

.toast-slide-enter-active {
  transition: all 0.3s ease;
}

.toast-slide-leave-active {
  transition: all 0.2s ease-in;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* ============================================================
   PANEL ACCENT COLOR THEMES
   ============================================================ */

/* Fire (default) - no overrides needed */

/* Crimson */
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
  --accent: #dc2626 !important;
  --accent-glow: rgba(220, 38, 38, 0.20) !important;
  --accent-dim: rgba(220, 38, 38, 0.08) !important;
  --accent-soft: rgba(220, 38, 38, 0.15) !important;
  --accent-mid: rgba(220, 38, 38, 0.28) !important;
  --accent-strong: rgba(220, 38, 38, 0.45) !important;
  --accent-heavy: rgba(220, 38, 38, 0.68) !important;
  --accent-solid: rgba(220, 38, 38, 0.88) !important;
  --accent-alt: #ef4444 !important;
  --accent-alt2: #fca5a5 !important;
  --border-color: rgba(220, 38, 38, 0.12) !important;
  --bg-tertiary: rgba(220, 38, 38, 0.06) !important;
  --bg-hover: rgba(220, 38, 38, 0.09) !important;
}

/* Violet */
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
  --accent: #7c3aed !important;
  --accent-glow: rgba(124, 58, 237, 0.20) !important;
  --accent-dim: rgba(124, 58, 237, 0.08) !important;
  --accent-soft: rgba(124, 58, 237, 0.15) !important;
  --accent-mid: rgba(124, 58, 237, 0.28) !important;
  --accent-strong: rgba(124, 58, 237, 0.45) !important;
  --accent-heavy: rgba(124, 58, 237, 0.68) !important;
  --accent-solid: rgba(124, 58, 237, 0.88) !important;
  --accent-alt: #8b5cf6 !important;
  --accent-alt2: #a78bfa !important;
  --border-color: rgba(124, 58, 237, 0.12) !important;
  --bg-tertiary: rgba(124, 58, 237, 0.06) !important;
  --bg-hover: rgba(124, 58, 237, 0.09) !important;
}

/* Emerald */
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
  --accent: #059669 !important;
  --accent-glow: rgba(5, 150, 105, 0.20) !important;
  --accent-dim: rgba(5, 150, 105, 0.08) !important;
  --accent-soft: rgba(5, 150, 105, 0.15) !important;
  --accent-mid: rgba(5, 150, 105, 0.28) !important;
  --accent-strong: rgba(5, 150, 105, 0.45) !important;
  --accent-heavy: rgba(5, 150, 105, 0.68) !important;
  --accent-solid: rgba(5, 150, 105, 0.88) !important;
  --accent-alt: #10b981 !important;
  --accent-alt2: #34d399 !important;
  --border-color: rgba(5, 150, 105, 0.12) !important;
  --bg-tertiary: rgba(5, 150, 105, 0.06) !important;
  --bg-hover: rgba(5, 150, 105, 0.09) !important;
}

/* Sapphire */
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
  --accent: #2563eb !important;
  --accent-glow: rgba(37, 99, 235, 0.20) !important;
  --accent-dim: rgba(37, 99, 235, 0.08) !important;
  --accent-soft: rgba(37, 99, 235, 0.15) !important;
  --accent-mid: rgba(37, 99, 235, 0.28) !important;
  --accent-strong: rgba(37, 99, 235, 0.45) !important;
  --accent-heavy: rgba(37, 99, 235, 0.68) !important;
  --accent-solid: rgba(37, 99, 235, 0.88) !important;
  --accent-alt: #3b82f6 !important;
  --accent-alt2: #60a5fa !important;
  --border-color: rgba(37, 99, 235, 0.12) !important;
  --bg-tertiary: rgba(37, 99, 235, 0.06) !important;
  --bg-hover: rgba(37, 99, 235, 0.09) !important;
}

/* Gold */
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
  --accent: #d97706 !important;
  --accent-glow: rgba(217, 119, 6, 0.20) !important;
  --accent-dim: rgba(217, 119, 6, 0.08) !important;
  --accent-soft: rgba(217, 119, 6, 0.15) !important;
  --accent-mid: rgba(217, 119, 6, 0.28) !important;
  --accent-strong: rgba(217, 119, 6, 0.45) !important;
  --accent-heavy: rgba(217, 119, 6, 0.68) !important;
  --accent-solid: rgba(217, 119, 6, 0.88) !important;
  --accent-alt: #f59e0b !important;
  --accent-alt2: #fbbf24 !important;
  --border-color: rgba(217, 119, 6, 0.12) !important;
  --bg-tertiary: rgba(217, 119, 6, 0.06) !important;
  --bg-hover: rgba(217, 119, 6, 0.09) !important;
}

/* Rose */
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
  --accent: #db2777 !important;
  --accent-glow: rgba(219, 39, 119, 0.20) !important;
  --accent-dim: rgba(219, 39, 119, 0.08) !important;
  --accent-soft: rgba(219, 39, 119, 0.15) !important;
  --accent-mid: rgba(219, 39, 119, 0.28) !important;
  --accent-strong: rgba(219, 39, 119, 0.45) !important;
  --accent-heavy: rgba(219, 39, 119, 0.68) !important;
  --accent-solid: rgba(219, 39, 119, 0.88) !important;
  --accent-alt: #ec4899 !important;
  --accent-alt2: #f9a8d4 !important;
  --border-color: rgba(219, 39, 119, 0.12) !important;
  --bg-tertiary: rgba(219, 39, 119, 0.06) !important;
  --bg-hover: rgba(219, 39, 119, 0.09) !important;
}

/* Cyan */
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
  --accent: #0891b2 !important;
  --accent-glow: rgba(8, 145, 178, 0.20) !important;
  --accent-dim: rgba(8, 145, 178, 0.08) !important;
  --accent-soft: rgba(8, 145, 178, 0.15) !important;
  --accent-mid: rgba(8, 145, 178, 0.28) !important;
  --accent-strong: rgba(8, 145, 178, 0.45) !important;
  --accent-heavy: rgba(8, 145, 178, 0.68) !important;
  --accent-solid: rgba(8, 145, 178, 0.88) !important;
  --accent-alt: #06b6d4 !important;
  --accent-alt2: #67e8f9 !important;
  --border-color: rgba(8, 145, 178, 0.12) !important;
  --bg-tertiary: rgba(8, 145, 178, 0.06) !important;
  --bg-hover: rgba(8, 145, 178, 0.09) !important;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 900px) {
  .dashboard-sidebar {
    width: 70px;
  }
  
  .dashboard-sidebar .brand-text,
  .dashboard-sidebar .nav-label,
  .dashboard-sidebar .nav-badge,
  .dashboard-sidebar .sf-info,
  .dashboard-sidebar .sf-home-link span {
    display: none;
  }
  
  .dashboard-sidebar .sf-card {
    justify-content: center;
  }
  
  .dash-charts {
    grid-template-columns: 1fr;
  }
  
  .dash-weekly {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-sidebar {
    display: none !important;
  }
  
  .menu-btn {
    display: none !important;
  }
  
  .mobile-bottom-nav {
    display: flex;
  }
  
  .dashboard-main {
    padding: 10px 12px 74px;
  }
  
  .dashboard-main.sidebar-collapsed {
    padding-left: 12px;
  }
  
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header-left {
    gap: 10px;
  }
  
  .header-left h1 {
    font-size: 13px;
  }
  
  .live-indicator {
    display: none;
  }
  
  .dw-stats {
    display: none;
  }
  
  .action-btn {
    padding: 6px 10px;
  }
  
  .btn-text {
    display: none;
  }
  
  .rs-rings {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dash-ipr {
    grid-template-columns: 1fr;
  }
  
  .dash-weekly {
    grid-template-columns: 1fr;
  }
  
  .rh-label {
    width: 100px;
    font-size: 9px;
  }
  
  .ipr-num-badge {
    display: none;
  }
  
  .fc-kpi-row {
    flex-wrap: wrap;
  }
  
  .fc-kpi {
    min-width: 60px;
  }
  
  .fc-heatmap-wrap {
    padding: 8px 10px 6px;
    gap: 6px;
  }
  
  .fc-hm-label {
    display: none;
  }
  
  .fc-heatmap-row {
    gap: 1px;
  }
  
  .fc-hm-cell {
    height: 10px;
    min-width: 4px;
  }
  
  .fc-hm-legend {
    display: none;
  }
  
  .commits-grid {
    grid-template-columns: 1fr;
  }
  
  .qa-row {
    gap: 8px;
  }
  
  .qa-btn {
    min-width: 0;
    padding: 8px 10px;
    font-size: 11px;
  }
  
  .qa-btn span {
    display: none;
  }
  
  .qa-btn svg {
    margin: 0;
  }
  
  .wsc-body {
    grid-template-columns: 1fr;
  }
  
  .wsc-ring-wrap {
    border-left: none;
    border-top: 1px solid var(--border-color);
  }
  
  .act-cal-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .act-cal-meta-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .act-cal-legend {
    flex-wrap: wrap;
  }
  
  .act-cal-months {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }
  
  .acm-btn {
    white-space: nowrap;
  }
}

@media (max-width: 420px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
  
  .dashboard-main {
    padding: 8px 8px 74px;
  }
  
  .dashboard-header {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .header-right {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .dash-welcome {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .repo-pulse-strip {
    flex-wrap: wrap;
  }
  
  .rps-brand {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    justify-content: center;
    padding: 8px;
  }
  
  .wsc-kpis {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .toast-item {
    min-width: auto;
    max-width: calc(100vw - 32px);
  }
}
</style>