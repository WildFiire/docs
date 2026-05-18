<template>
  <div class="wf-dashboard-wrapper" v-if="isMounted">
    <!-- Show Login if not authenticated -->
    <PanelLogin 
      v-if="!isAuthenticated"
      @login-success="handleLoginSuccess"
    />
    
    <!-- Main Dashboard -->
    <div v-else class="wildfire-dashboard" :class="['wf-theme-' + panelTheme, { 'light-theme': isLightTheme }]">
      <CS2Background :isDark="!isLightTheme" />

      <PanelSidebar
        :collapsed="sidebarCollapsed"
        :current-view="currentView"
        :user-login="userLogin"
        :user-avatar="userAvatar"
        :is-light-theme="isLightTheme"
        @navigate="handleNavClick"
        @logout="handleLogout"
        @action="handleSidebarAction"
      >
        <template #logo>
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
        </template>
      </PanelSidebar>

      <main ref="mainContent" class="dashboard-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }" data-lenis-prevent>
        <div class="view-container">
          <!-- DASHBOARD VIEW -->
          <div v-if="currentView === 'dashboard'" class="dashboard-view">
            <template v-if="isLoading">
              <div class="dashboard-skeleton">
                <div class="sk-welcome sk-pulse-pattern"></div>
                <div class="sk-grid-4">
                  <div class="sk-card sk-pulse-pattern"></div>
                  <div class="sk-card sk-pulse-pattern"></div>
                  <div class="sk-card sk-pulse-pattern"></div>
                  <div class="sk-card sk-pulse-pattern"></div>
                </div>
                <div class="sk-breakdown sk-pulse-pattern"></div>
                <div class="sk-grid-2">
                  <div class="sk-health sk-pulse-pattern"></div>
                  <div class="sk-health sk-pulse-pattern"></div>
                </div>
                <div class="sk-chart sk-pulse-pattern"></div>
              </div>
            </template>
            <template v-else>
            <!-- Welcome Banner - Clean -->
            <div class="dash-welcome-clean">
              <div class="dw-profile-section">
                <img :src="userAvatar" :alt="userLogin" class="dw-avatar-clean">
                <div class="dw-greeting">
                  <h2>{{ timeOfDay === 'morning' ? 'Good morning' : timeOfDay === 'afternoon' ? 'Good afternoon' : 'Good evening' }}, <span>{{ userLogin }}</span></h2>
                  <p>Here's what's happening in <strong>{{ repoName }}</strong> today.</p>
                </div>
              </div>
              <div class="dw-metrics-section">
                <div class="dw-metric-block">
                  <div class="metric-hd"><span>WEEKLY GOAL</span><span>{{ weeklyGoal.current }} / {{ weeklyGoal.target }}</span></div>
                  <div class="metric-progress-track">
                    <div class="metric-progress-fill" :style="{ width: Math.min((weeklyGoal.current / weeklyGoal.target) * 100, 100) + '%' }"></div>
                  </div>
                </div>
                <div class="dw-divider"></div>
                <div class="dw-metric-block code-churn">
                  <div class="metric-hd"><span>CODE CHURN (30D)</span></div>
                  <div class="churn-values">
                     <span class="churn-add">+{{ formatNumber(codeChurn.additions) }}</span>
                     <span class="churn-del">-{{ formatNumber(codeChurn.deletions) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats Strip (NEW) -->
            <div class="quick-stats-strip">
              <div class="qs-card">
                <div class="qs-icon-wrap pulse-green">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div class="qs-info">
                  <span class="qs-label">RESPONSE TIME</span>
                  <span class="qs-value" style="color: #22c55e">{{ Math.floor(Math.random() * 30 + 12) }}ms</span>
                </div>
                <div class="qs-sparkline">
                  <svg viewBox="0 0 60 20" width="60" height="20"><polyline fill="none" stroke="rgba(34,197,94,0.5)" stroke-width="1.5" points="0,12 8,8 16,14 24,6 32,10 40,4 48,9 60,7"/></svg>
                </div>
              </div>
              <div class="qs-card">
                <div class="qs-icon-wrap pulse-blue">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div class="qs-info">
                  <span class="qs-label">LAST DEPLOY</span>
                  <span class="qs-value" style="color: #3b82f6">{{ repoPulse.lastCommitDaysAgo === 0 ? 'Today' : repoPulse.lastCommitDaysAgo + 'd ago' }}</span>
                </div>
                <span class="qs-status-pill success">LIVE</span>
              </div>
              <div class="qs-card">
                <div class="qs-icon-wrap pulse-orange">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="qs-info">
                  <span class="qs-label">UPTIME (30D)</span>
                  <span class="qs-value" style="color: var(--accent)">99.97%</span>
                </div>
                <div class="qs-uptime-bar">
                  <span v-for="d in 14" :key="d" class="qs-uptime-dot" :class="d === 7 ? 'warn' : 'ok'"></span>
                </div>
              </div>
              <div class="qs-card">
                <div class="qs-icon-wrap pulse-purple">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div class="qs-info">
                  <span class="qs-label">ACTIVE NOW</span>
                  <span class="qs-value" style="color: #a855f7">{{ Math.min(repoStats.contributors, 3) }}</span>
                </div>
                <div class="qs-avatar-stack">
                  <img v-for="c in topContributors.slice(0, 3)" :key="c.login" :src="c.avatar_url" class="qs-mini-avatar" :title="c.login">
                </div>
              </div>
            </div>

            <!-- KPI Row -->
            <div class="kpi-row">
              <div class="kpi-card" v-for="kpi in kpiCards" :key="kpi.id" :style="{ borderLeft: '2.5px solid ' + kpi.color }">
                <div class="kpi-icon" :style="{ background: kpi.color + '22', color: kpi.color }">
                  <svg v-if="kpi.id === 'commits'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
                  <svg v-else-if="kpi.id === 'contributors'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <svg v-else-if="kpi.id === 'files'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                  <svg v-else-if="kpi.id === 'prs'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>
                  <svg v-else-if="kpi.id === 'issues'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <svg v-else-if="kpi.id === 'stars'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <svg v-else-if="kpi.id === 'forks'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                  <svg v-else-if="kpi.id === 'watchers'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
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
            <div class="wiki-overview-grid">
               <div class="wog-card">
                  <span class="wog-lbl">TOTAL PAGES</span>
                  <span class="wog-val" style="color: var(--accent);">{{ wikiStats.pages }}</span>
               </div>
               <div class="wog-card">
                  <span class="wog-lbl">SECTIONS</span>
                  <span class="wog-val" style="color: #3b82f6;">{{ wikiStats.sections }}</span>
               </div>
               <div class="wog-card">
                  <span class="wog-lbl">AVG PER SEC</span>
                  <span class="wog-val" style="color: #8b5cf6;">{{ Math.round(wikiStats.pages / Math.max(wikiStats.sections, 1)) }}</span>
               </div>
               <div class="wog-card">
                  <span class="wog-lbl">SYSTEM UPTIME</span>
                  <span class="wog-val" style="color: #22c55e;">99.9%</span>
               </div>
            </div>
            
            <div class="wog-breakdown-card">
               <div class="wog-bc-head">
                 <span>SECTION DISTRIBUTION</span>
                 <span class="wsc-live-badge"><span class="wsc-live-dot"></span><span>SYNCED</span></span>
               </div>
               <div class="wog-bc-bar">
                 <div v-for="(sec, i) in wikiStats.sectionBreakdown" :key="sec.text" class="wog-bc-seg"
                      :style="{ width: sec.pct + '%', background: ['var(--accent)','#3b82f6','#22c55e','#8b5cf6','#f59e0b','#ec4899'][i % 6] }"
                      :title="sec.text + ' (' + sec.pages + ' pages)'"></div>
               </div>
               <div class="wog-bc-legend">
                 <div v-for="(sec, i) in wikiStats.sectionBreakdown" :key="sec.text" class="wog-bc-leg-item">
                    <span class="wog-dot" :style="{ background: ['var(--accent)','#3b82f6','#22c55e','#8b5cf6','#f59e0b','#ec4899'][i % 6] }"></span>
                    <span>{{ sec.text }}</span> <em>{{ sec.pages }}</em>
                 </div>
               </div>
            </div>

            <!-- Charts Row -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><span>ACTIVITY &amp; METRICS</span></div>
            <div class="dash-charts">
            <div class="dash-card modern-chart-card">
              <div class="mc-header">
                <div class="mc-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  <span>COMMIT ACTIVITY</span>
                </div>
                <div class="mc-toggles">
                   <button class="mc-toggle" :class="{ active: commitChartMode === 'total' }" @click="commitChartMode = 'total'">
                     <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Total
                   </button>
                   <button class="mc-toggle" :class="{ active: commitChartMode === 'daily' }" @click="commitChartMode = 'daily'">
                     <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Daily
                   </button>
                </div>
              </div>

              <div class="mc-kpi-grid">
                 <div class="mc-kpi-box">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="mc-kpi-icon"><circle cx="12" cy="12" r="4"/><path d="M1.05 12H7m10.01 0h5.95"/></svg>
                    <span class="mc-kpi-lbl">TOTAL COMMITS</span>
                    <span class="mc-kpi-val" style="color: var(--accent);">{{ repoStats.totalCommits }}</span>
                 </div>
                 <div class="mc-kpi-box">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="mc-kpi-icon"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                    <span class="mc-kpi-lbl">TODAY</span>
                    <span class="mc-kpi-val" style="color: #22c55e;">+{{ dailyCommits.length ? dailyCommits[dailyCommits.length-1] : 0 }}</span>
                 </div>
                 <div class="mc-kpi-box">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="mc-kpi-icon"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    <span class="mc-kpi-lbl">LAST 7 DAYS</span>
                    <span class="mc-kpi-val" style="color: #3b82f6;">+{{ dailyCommits.slice(-7).reduce((a,b)=>a+b,0) }}</span>
                 </div>
                 <div class="mc-kpi-box">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="mc-kpi-icon"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    <span class="mc-kpi-lbl">AVG / DAY</span>
                    <span class="mc-kpi-val" style="color: #a855f7;">{{ repoPulse.avgPerDay }}</span>
                 </div>
              </div>

              <div class="mc-chart-body">
                 <div class="mc-y-axis">
                    <span v-for="(lbl, i) in chartYLabels" :key="'yl'+i">{{ lbl }}</span>
                 </div>

                 <div class="mc-svg-container" @mousemove="onFlameMouseMove" @mouseleave="hoveredBarIndex = null">
                    <svg viewBox="0 0 640 220" preserveAspectRatio="none" width="100%" height="220" style="overflow: visible;">
                       <defs>
                          <linearGradient id="mcAreaGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%"   stop-color="var(--accent)" stop-opacity="0.35"/>
                             <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0"/>
                          </linearGradient>
                       </defs>

                       <template v-for="(lbl, i) in chartXLabels" :key="'vg'+i">
                          <line :x1="lbl.x" y1="0" :x2="lbl.x" y2="210" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4,4" stroke-width="1" />
                       </template>

                       <path :d="chartPaths.area" fill="url(#mcAreaGrad)"/>
                       
                       <path :d="chartPaths.line" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

                       <g v-if="hoveredBarIndex !== null && chartScale.points[hoveredBarIndex]">
                          <line :x1="chartScale.points[hoveredBarIndex].x" y1="0" :x2="chartScale.points[hoveredBarIndex].x" y2="210" stroke="var(--accent)" stroke-dasharray="3,3" stroke-width="1" opacity="0.8" />
                          <circle :cx="chartScale.points[hoveredBarIndex].x" :cy="chartScale.points[hoveredBarIndex].y" r="5" fill="var(--accent)" stroke="#0b0b0e" stroke-width="2.5" />
                       </g>
                    </svg>

                    <div v-if="hoveredBarIndex !== null && chartScale.points[hoveredBarIndex]" class="mc-tooltip" 
                         :style="{ left: (chartScale.points[hoveredBarIndex].x / 640 * 100) + '%', top: (chartScale.points[hoveredBarIndex].y / 220 * 100) + '%' }">
                       <div class="mc-tt-date">{{ chartScale.points[hoveredBarIndex].fullLabel }}</div>
                       <div class="mc-tt-row">
                          <span class="mc-tt-lbl">{{ commitChartMode === 'total' ? 'Total Commits:' : 'New Commits:' }}</span>
                          <span class="mc-tt-val" style="color: var(--accent);">{{ chartScale.points[hoveredBarIndex].val }}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div class="mc-x-axis">
                 <template v-for="(lbl, i) in chartXLabels" :key="'xl'+i">
                    <span class="mc-x-lbl" :style="{ left: 'calc(' + (lbl.x / 640 * 100) + '% + 36px)' }">
                       {{ lbl.shortLabel }}
                    </span>
                 </template>
               </div>
            </div>

            <!-- Repository Health Row -->
            <div class="dash-slabel" style="margin-top: 16px;"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg><span>REPOSITORY HEALTH</span></div>
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
            <!-- System Status + Code Frequency Row -->
            <div class="dash-slabel">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>SYSTEM STATUS &amp; CODE HEALTH</span>
            </div>
            <div class="dash-two-col">
              <!-- System Status Monitor -->
              <div class="dash-card sys-status-card">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    SYSTEM STATUS
                  </div>
                  <span class="dc-badge">LIVE</span>
                </div>
                <div class="ss-body">
                  <div class="ss-row">
                    <span class="ss-lbl">API Quota</span>
                    <div class="ss-bar-wrap">
                      <div class="ss-bar" :style="{ width: (apiRateLimit.remaining / apiRateLimit.limit * 100) + '%', background: apiRateLimit.remaining < 500 ? '#ef4444' : apiRateLimit.remaining < 1500 ? '#f59e0b' : '#22c55e' }"></div>
                    </div>
                    <span class="ss-val">{{ apiRateLimit.remaining }}/{{ apiRateLimit.limit }}</span>
                  </div>
                  <div class="ss-row">
                    <span class="ss-lbl">Used Today</span>
                    <div class="ss-bar-wrap">
                      <div class="ss-bar" :style="{ width: Math.min(apiRateLimit.used / apiRateLimit.limit * 100, 100) + '%', background: 'var(--accent)' }"></div>
                    </div>
                    <span class="ss-val">{{ apiRateLimit.used }}</span>
                  </div>
                  <div class="ss-row">
                    <span class="ss-lbl">Wiki Uptime</span>
                    <div class="ss-bar-wrap"><div class="ss-bar" style="width:99.9%;background:#22c55e"></div></div>
                    <span class="ss-val" style="color:#22c55e">99.9%</span>
                  </div>
                  <div class="ss-row">
                    <span class="ss-lbl">Active Branches</span>
                    <div class="ss-bar-wrap"><div class="ss-bar" :style="{ width: Math.min(branches.length / 20 * 100, 100) + '%', background: '#8b5cf6' }"></div></div>
                    <span class="ss-val" style="color:#8b5cf6">{{ branches.length }}</span>
                  </div>
                  <div class="ss-pills">
                    <div class="ss-pill">
                      <span class="ss-pill-dot" style="background:#22c55e"></span>
                      <span class="ss-pill-txt">API Online</span>
                    </div>
                    <div class="ss-pill">
                      <span class="ss-pill-dot" style="background:#22c55e"></span>
                      <span class="ss-pill-txt">GitHub OK</span>
                    </div>
                    <div class="ss-pill">
                      <span class="ss-pill-dot" style="background:#22c55e"></span>
                      <span class="ss-pill-txt">Wiki Live</span>
                    </div>
                    <div class="ss-pill" v-if="apiRateLimit.resetAt">
                      <span class="ss-pill-dot" style="background:#f59e0b"></span>
                      <span class="ss-pill-txt">Reset: {{ apiRateLimit.resetAt ? apiRateLimit.resetAt.toLocaleTimeString() : 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Code Frequency / Churn -->
              <div class="dash-card code-freq-card">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    CODE FREQUENCY
                  </div>
                  <span class="dc-badge">LAST 8 WEEKS</span>
                </div>
                <div class="cf-body" v-if="codeFrequency.length">
                  <div class="cf-legend">
                    <span class="cf-leg" style="color:#22c55e">+ Additions</span>
                    <span class="cf-leg" style="color:#ef4444">- Deletions</span>
                  </div>
                  <div class="cf-chart">
                    <div v-for="w in codeFrequency" :key="w.week" class="cf-col">
                      <div class="cf-bars">
                        <div class="cf-bar cf-add" :style="{ height: (w.additions / Math.max(...codeFrequency.map(x => Math.max(x.additions, x.deletions)), 1) * 80) + 'px' }" :title="'+' + w.additions"></div>
                        <div class="cf-bar cf-del" :style="{ height: (w.deletions / Math.max(...codeFrequency.map(x => Math.max(x.additions, x.deletions)), 1) * 80) + 'px' }" :title="'-' + w.deletions"></div>
                      </div>
                      <span class="cf-lbl">{{ w.week }}</span>
                    </div>
                  </div>
                  <div class="cf-totals">
                    <span style="color:#22c55e">+{{ formatNumber(codeFrequency.reduce((a,w) => a + w.additions, 0)) }} additions</span>
                    <span style="color:#ef4444">-{{ formatNumber(codeFrequency.reduce((a,w) => a + w.deletions, 0)) }} deletions</span>
                  </div>
                </div>
                <div v-else class="cf-empty">Loading code frequency data…</div>
              </div>
            </div>

            <!-- Heatmap + Branches Row -->
            <div class="dash-slabel">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>COMMIT HEATMAP &amp; BRANCHES</span>
            </div>
            <div class="dash-two-col">
              <!-- Commit Heatmap Calendar -->
              <div class="dash-card heatmap-card">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    CONTRIBUTION HEATMAP
                  </div>
                  <span class="dc-badge">LAST 12 MONTHS</span>
                </div>
                <div class="hm-body">
                  <div class="hm-months">
                    <span v-for="m in heatmapMonthLabels" :key="m.key" class="hm-month-lbl">{{ m.label }}</span>
                  </div>
                  <div class="hm-grid">
                    <div v-for="(cell, idx) in heatmapYearCells" :key="idx"
                      class="hm-cell"
                      :class="'hm-i' + cell.intensity"
                      :title="cell.dateStr ? cell.fullLabel + ': ' + cell.commits + ' commits' : ''"
                    ></div>
                  </div>
                  <div class="hm-legend">
                    <span class="hm-leg-txt">Less</span>
                    <span class="hm-cell hm-i0"></span>
                    <span class="hm-cell hm-i1"></span>
                    <span class="hm-cell hm-i2"></span>
                    <span class="hm-cell hm-i3"></span>
                    <span class="hm-cell hm-i4"></span>
                    <span class="hm-leg-txt">More</span>
                  </div>
                </div>
              </div>

              <!-- Branches Overview -->
              <div class="dash-card branches-card">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                    BRANCHES
                  </div>
                  <span class="dc-badge">{{ branches.length }} total</span>
                </div>
                <div class="br-list">
                  <div v-for="b in branches.slice(0, 8)" :key="b.name" class="br-row">
                    <div class="br-icon" :class="{ 'br-default': b.isDefault }">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                    </div>
                    <div class="br-info">
                      <span class="br-name">{{ b.name }}</span>
                      <div class="br-tags">
                        <span v-if="b.isDefault" class="br-tag br-tag-default">DEFAULT</span>
                        <span v-if="b.protected" class="br-tag br-tag-protected">PROTECTED</span>
                      </div>
                    </div>
                    <code class="br-sha">{{ b.sha }}</code>
                  </div>
                  <div v-if="!branches.length" class="ipr-empty">Loading branches…</div>
                </div>
              </div>
            </div>

            <!-- Deployment Timeline -->
            <div class="dash-slabel" v-if="releases.length">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              <span>DEPLOYMENT TIMELINE</span>
              <span class="dsl-badge">{{ releases.length }} releases</span>
            </div>
            <div class="dash-card deploy-card" v-if="releases.length">
              <div class="deploy-timeline">
                <div v-for="(rel, i) in releases.slice(0, 6)" :key="rel.id" class="dt-item" @click="window.open(rel.url, '_blank')">
                  <div class="dt-line"></div>
                  <div class="dt-dot" :class="{ 'dt-dot-pre': rel.prerelease, 'dt-dot-draft': rel.draft }"></div>
                  <div class="dt-body">
                    <div class="dt-top">
                      <span class="dt-tag">{{ rel.tag }}</span>
                      <span v-if="rel.prerelease" class="dt-badge dt-pre">PRE</span>
                      <span v-if="rel.draft" class="dt-badge dt-draft">DRAFT</span>
                      <span class="dt-time">{{ timeAgo(rel.publishedAt) }}</span>
                    </div>
                    <div class="dt-name">{{ truncate(rel.name, 50) }}</div>
                    <div class="dt-author" v-if="rel.author !== '—'">
                      <img v-if="rel.avatar" :src="rel.avatar" :alt="rel.author" class="dt-avatar">
                      <span>@{{ rel.author }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="!releases.length" class="ipr-empty">No releases yet</div>
              </div>
            </div>
            
            </template>
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
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
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

          <PanelSystemMonitor
            v-else-if="currentView === 'monitor'"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
          />

          <PanelContentDecay
            v-else-if="currentView === 'decay'"
          />

          <PanelSystemStatus
            v-else-if="currentView === 'system-status'"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
          />

          <PanelSEOManager
            v-else-if="currentView === 'seo-manager'"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
            :repo-branch="repoBranch"
          />

          <PanelMediaManager
            v-else-if="currentView === 'media-library'"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
            :repo-branch="repoBranch"
          />

          <PanelStorageManager
            v-else-if="currentView === 'storage-health'"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
            :repo-branch="repoBranch"
          />



          <PanelUpdates
            v-else-if="currentView === 'updates'"
            :github-token="githubToken"
            :repo-owner="repoOwner"
            :repo-name="repoName"
            :is-light-theme="isLightTheme"
          />

          <PanelFeedbacks
            v-else-if="currentView === 'feedbacks'"
            :github-token="githubToken"
            :is-light-theme="isLightTheme"
          />

          <PanelPageGenerator
            v-else-if="currentView === 'studio'"
            :github-token="githubToken"
            :is-light-theme="isLightTheme"
            :repo-owner="repoOwner"
            :repo-name="repoName"
            :repo-branch="repoBranch"
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
          <span class="mbn-icon">
            <svg v-if="item.id === 'dashboard'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            <svg v-else-if="item.id === 'files'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <svg v-else-if="item.id === 'studio'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <svg v-else-if="item.id === 'contributors'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <svg v-else-if="item.id === 'audit'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <svg v-else-if="item.id === 'analytics'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/></svg>
            <svg v-else-if="item.id === 'search-analytics'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/><path d="M10 13V9m0 0l-2 2m2-2l2 2"/></svg>
            <svg v-else-if="item.id === 'updates'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <svg v-else-if="item.id === 'profile'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <svg v-else-if="item.id === 'feedbacks'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <span class="mbn-label">{{ item.label }}</span>

        </div>
      </nav>

    </div>

    <!-- Toast Notifications (outside v-else to avoid compiler restriction) -->
    <teleport to="body" v-if="isAuthenticated && isMounted">
      <div class="wf-toast-container">
        <transition-group name="toast">
          <div v-for="toast in toasts" :key="toast.id" class="wf-toast" :class="'toast-' + toast.type">
            <svg v-if="toast.type === 'error'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>
            <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{{ toast.message }}</span>
            <button class="toast-close" @click="dismissToast(toast.id)">&times;</button>
          </div>
        </transition-group>
      </div>
    </teleport>

  </div>
</template>

<script>
    import { useData } from 'vitepress'
    import CS2Background from '../CS2Background.vue'
    import LiquidMetalLogo from '../LiquidMetalLogo.vue'
    import PanelLogin from './PanelLogin.vue'
    import PanelSidebar from './PanelSidebar.vue'
    import PanelFiles from './PanelFiles.vue'
    import PanelContributors from './PanelContributors.vue'
    import PanelAudit from './PanelAudit.vue'
    import PanelAnalytics from './PanelAnalytics.vue'
    import PanelProfile from './PanelProfile.vue'
    import PanelFeedbacks from './PanelFeedbacks.vue'
    import PanelPageGenerator from './PanelPageGenerator.vue'
    import PanelSEOManager from './PanelSEOManager.vue'
    import PanelMediaManager from './PanelMediaManager.vue'
    import PanelStorageManager from './PanelStorageManager.vue'
    import PanelUpdates from './PanelUpdates.vue'
    import PanelSystemMonitor from './PanelSystemMonitor.vue'
    import PanelContentDecay from './PanelContentDecay.vue'
    import PanelSystemStatus from './PanelSystemStatus.vue'
    // Icon import removed - was unused

    export default {
      name: 'Dashboard',
      
      components: {
        PanelLogin,
        PanelSidebar,
        PanelFiles,
        PanelContributors,
        PanelAudit,
        PanelAnalytics,
        PanelProfile,
        PanelFeedbacks,
        PanelPageGenerator,
        CS2Background,
        LiquidMetalLogo,
        PanelSEOManager,
        PanelMediaManager,
        PanelStorageManager,
        PanelUpdates,
        PanelSystemMonitor,
        PanelContentDecay,
        PanelSystemStatus
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
          commitChartMode: 'total',
          systemStatus: 'operational',
          codeChurn: { additions: 0, deletions: 0 },
          weeklyGoal: { current: 0, target: 50 },
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
          recentFeedbacks: [],
          feedbackLoading: false,
          feedbackTotal: 0,

          // New feature data
          isLoading: false,
          branches: [],
          releases: [],
          codeFrequency: [],
          apiRateLimit: { limit: 5000, remaining: 5000, used: 0, resetAt: null },
          repoSize: 0,
          toasts: [],

          navItems: [
            { id: 'dashboard', label: 'DASHBOARD' },
            { id: 'system-status', label: 'SYSTEM STATUS', badge: 'LIVE' },
            { id: 'files', label: 'FILES' },
            { id: 'studio', label: 'PHOENIX STUDIO', badge: 'NEW' },
            { id: 'contributors', label: 'CONTRIBUTORS', badge: 'LIVE' },
            { id: 'updates', label: 'UPDATES', badge: 'NEW' },
            { id: 'decay', label: 'DECAY TRACKER' },
            { id: 'search-analytics', label: 'SEARCH' },
            { id: 'audit', label: 'AUDIT', badge: 'LIVE' },
            { id: 'analytics', label: 'ANALYTICS' },
            { id: 'profile', label: 'MY PROFILE' },
            { id: 'feedbacks', label: 'FEEDBACKS' }
          ]
        }
      },
      
      computed: {
        kpiCards() {
          return [
            { id: 'prs', label: 'OPEN PULLS', value: this.repoStats.openPRs, color: '#a78bfa' },
            { id: 'issues', label: 'OPEN ISSUES', value: this.repoStats.openIssues, color: '#f87171' },
            { id: 'stars', label: 'STARS', value: this.formatNumber(this.repoStats.stars), color: '#fbbf24' },
            { id: 'forks', label: 'FORKS', value: this.formatNumber(this.repoStats.forks), color: '#38bdf8' },
            { id: 'watchers', label: 'WATCHERS', value: this.formatNumber(this.repoStats.watchers), color: '#fb7185' }
          ]
        },
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
        chartData() {
          const daily = this.dailyCommits || [];
          if (!daily.length) return [];

          const totalCurrently = this.repoStats?.totalCommits || daily.reduce((a,b)=>a+b, 0);
          const sum30 = daily.reduce((a,b)=>a+b, 0);
          let runningTotal = totalCurrently - sum30;

          const now = new Date();
          const totalDays = daily.length;
          const stepX = 640 / Math.max(totalDays - 1, 1);

          return daily.map((count, i) => {
            runningTotal += count;
            const d = new Date(now);
            d.setDate(d.getDate() - (totalDays - 1 - i));
            return {
              index: i,
              daily: count,
              total: runningTotal,

              shortLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fullLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              x: i * stepX
            };
          });
        },
        chartScale() {
          const data = this.chartData;
          if (!data.length) return { min: 0, max: 100, points: [] };

          const isTotal = this.commitChartMode === 'total';
          const values = data.map(d => isTotal ? d.total : d.daily);


          const minVal = isTotal ? Math.max(0, Math.min(...values) - (Math.max(...values) - Math.min(...values)) * 0.05) : 0;
          const maxVal = Math.max(...values, 1) * 1.05;
          const range = maxVal - minVal;

          const points = data.map(d => {
            const val = isTotal ? d.total : d.daily;
            const pct = Math.max(0, Math.min(1, (val - minVal) / range));
            const y = 200 - (pct * 180);
            return { ...d, val, y };
          });

          return { min: minVal, max: maxVal, points };
        },
        chartPaths() {
          const pts = this.chartScale.points;
          if (pts.length < 2) return { area: '', line: '' };


          let d = `M ${pts[0].x},${pts[0].y}`;
          for (let i = 1; i < pts.length; i++) {
            const prev = pts[i-1];
            const curr = pts[i];
            const cpX1 = prev.x + (curr.x - prev.x) * 0.4;
            const cpX2 = curr.x - (curr.x - prev.x) * 0.4;
            d += ` C ${cpX1},${prev.y} ${cpX2},${curr.y} ${curr.x},${curr.y}`;
          }

          const area = `${d} L ${pts[pts.length-1].x},220 L ${pts[0].x},220 Z`;
          return { line: d, area };
        },
        chartYLabels() {
          const { min, max } = this.chartScale;
          const range = max - min;
          return [
            Math.round(max),
            Math.round(min + range * 0.75),
            Math.round(min + range * 0.5),
            Math.round(min + range * 0.25),
            Math.max(0, Math.round(min))
          ];
        },
        chartXLabels() {
          const pts = this.chartScale.points;
          if (!pts.length) return [];

          const labels = [];
          const numLabels = 6;
          const step = Math.floor((pts.length - 1) / (numLabels - 1));
          for(let i = 0; i < numLabels; i++) {
            const idx = Math.min(i * step, pts.length - 1);
            labels.push(pts[idx]);
          }
          return labels;
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

        heatmapYearCells() {
          const now = new Date()
          const cells = []
          const cutoff = new Date(now)
          cutoff.setFullYear(cutoff.getFullYear() - 1)
          // Align start to Sunday
          const startDate = new Date(cutoff)
          startDate.setDate(startDate.getDate() - startDate.getDay())
          const allCounts = Object.values(this.calendarDailyMap)
          const maxCount = allCounts.length ? Math.max(...allCounts, 1) : 1
          let d = new Date(startDate)
          while (d <= now) {
            const dk = d.toISOString().slice(0, 10)
            const commits = this.calendarDailyMap[dk] || 0
            const pct = commits / maxCount
            const intensity = commits === 0 ? 0 : pct < 0.25 ? 1 : pct < 0.5 ? 2 : pct < 0.75 ? 3 : 4
            const isValid = d >= cutoff
            cells.push({
              dateStr: isValid ? dk : null,
              commits,
              intensity: isValid ? intensity : 0,
              fullLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
            })
            d = new Date(d)
            d.setDate(d.getDate() + 1)
          }
          return cells
        },

        heatmapMonthLabels() {
          const now = new Date()
          const labels = []
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            labels.push({
              key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
              label: d.toLocaleDateString('en-US', { month: 'short' })
            })
          }
          return labels
        },

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
              this.$refs.mainContent.addEventListener('scroll', this.handleScroll, { passive: true })
            }
          })
          window.addEventListener('resize', this.handleResize)

          this.isLoading = true
          setTimeout(() => {
            this.refreshAllData()
            this.isLoading = false
          }, 1200)
          
          this._clearRefreshInterval()
          this._refreshInterval = setInterval(() => this.refreshAllData(), 30000)
        }
      },
      
      beforeUnmount() {
        if (this._themeObserver) this._themeObserver.disconnect()
        if (this._scrollRaf) cancelAnimationFrame(this._scrollRaf)
        this._clearRefreshInterval()
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
        this.$refs.mainContent.addEventListener('scroll', this.handleScroll, { passive: true })
      }
    })
    window.addEventListener('resize', this.handleResize)

    this.refreshAllData()
    this._clearRefreshInterval()
    this._refreshInterval = setInterval(() => this.refreshAllData(), 30000)
  },

    _clearRefreshInterval() {
      if (this._refreshInterval) {
        clearInterval(this._refreshInterval)
        this._refreshInterval = null
      }
    },
    
    onFlameMouseMove(e) {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 640;
      const pts = this.chartScale.points;
      
      if (!pts.length) { this.hoveredBarIndex = null; return; }
      
      
      let closestIdx = 0;
      let minDiff = Infinity;
      pts.forEach((p, i) => {
         const diff = Math.abs(p.x - x);
         if (diff < minDiff) { minDiff = diff; closestIdx = i; }
      });
      
      this.hoveredBarIndex = closestIdx;
    },
    
    setPanelTheme(theme) {
      this.panelTheme = theme
      try { localStorage.setItem('wf-panel-theme', theme) } catch (_) {}
    },
    
    handleLogout() {
      // Basic logout -> clear localstorage -> refresh
      localStorage.removeItem('wf_gh_token')
      window.location.reload()
    },
    
    handleSidebarAction(action) {
      if (action === 'issue') this.openNewIssue()
      if (action === 'pr') this.openNewPR()
      if (action === 'refresh') this.refreshAllData()
      if (action === 'theme') this.toggleTheme()
    },

    toggleTheme() {
      this.isLightTheme = !this.isLightTheme
      localStorage.setItem('wildfire-theme', this.isLightTheme ? 'light' : 'dark')
    },
    
    handleScroll() {
      if (this._scrollRaf) return
      this._scrollRaf = requestAnimationFrame(() => {
        const el = this.$refs.mainContent
        this.isScrolled = el ? el.scrollTop > 20 : false
        this._scrollRaf = null
      })
    },
    
    handleResize() {
      this.sidebarCollapsed = window.innerWidth <= 900
    },
    
    handleNavClick(item) {
      // PanelSidebar emits a string id; mobile nav passes the full item object
      this.currentView = typeof item === 'string' ? item : item.id
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

      this.isSyncing = false
    },
    
    async loadRecentFeedbacks() {
      if (!this.githubToken) return
      this.feedbackLoading = true
      try {
        const query = `query { repository(owner: "${this.repoOwner}", name: "${this.repoName}") { discussions(first: 20, orderBy: { field: CREATED_AT, direction: DESC }) { nodes { id title body url createdAt } } } }`
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
        
        // Code Churn (mock from commit count)
        let churnAdd = 0, churnDel = 0
        allCommits.slice(0, 30).forEach(() => {
          churnAdd += Math.floor(Math.random() * 50) + 10
          churnDel += Math.floor(Math.random() * 20) + 2
        })
        this.codeChurn.additions = churnAdd
        this.codeChurn.deletions = churnDel
        
        // System Status
        this.systemStatus = this.recentIssues.length > 5 ? 'degraded' : 'operational'
        
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
        this.weeklyGoal.current = last30Days.slice(-7).reduce((a, b) => a + b, 0)
        
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

        // Fetch extra data in parallel (non-blocking)
        Promise.all([
          this.fetchBranches(baseUrl, headers),
          this.fetchReleases(baseUrl, headers),
          this.fetchCodeFrequency(baseUrl, headers),
          this.fetchApiRateLimit(headers)
        ]).catch(() => {})
        
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
        this.showToast('Failed to fetch repository data. Check your token.', 'error')
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
      const twoMonthsAgo = new Date(monthAgo)
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1)
      const commitsLastMonth = allCommits.filter(c => new Date(c.commit.author.date) > monthAgo).length
      const commitsPrevMonth = allCommits.filter(c => {
        const date = new Date(c.commit.author.date)
        return date <= monthAgo && date > twoMonthsAgo
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
      if (diff < 60) return 'now'
      if (diff < 3600) return Math.floor(diff / 60) + 'm'
      if (diff < 86400) return Math.floor(diff / 3600) + 'h'
      if (diff < 604800) return Math.floor(diff / 86400) + 'd'
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

    async fetchBranches(baseUrl, headers) {
      try {
        const res = await fetch(`${baseUrl}/branches?per_page=20&_=${Date.now()}`, { headers })
        if (!res.ok) return
        const data = await res.json()
        this.branches = data.map(b => ({
          name: b.name,
          sha: b.commit.sha.substring(0, 7),
          isDefault: b.name === this.repoBranch,
          protected: b.protected
        }))
      } catch (e) {}
    },

    async fetchReleases(baseUrl, headers) {
      try {
        const res = await fetch(`${baseUrl}/releases?per_page=8&_=${Date.now()}`, { headers })
        if (!res.ok) return
        const data = await res.json()
        this.releases = data.map(r => ({
          id: r.id,
          tag: r.tag_name,
          name: r.name || r.tag_name,
          body: r.body || '',
          draft: r.draft,
          prerelease: r.prerelease,
          publishedAt: r.published_at,
          url: r.html_url,
          author: r.author?.login || '—',
          avatar: r.author?.avatar_url
        }))
      } catch (e) {}
    },

    async fetchCodeFrequency(baseUrl, headers) {
      try {
        const res = await fetch(`${baseUrl}/stats/code_frequency?_=${Date.now()}`, { headers })
        if (!res.ok) return
        const data = await res.json()
        if (!Array.isArray(data)) return
        // Last 8 weeks
        const recent = data.slice(-8)
        this.codeFrequency = recent.map(([ts, additions, deletions]) => ({
          week: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          additions: Math.abs(additions),
          deletions: Math.abs(deletions)
        }))
      } catch (e) {}
    },

    async fetchApiRateLimit(headers) {
      try {
        const res = await fetch('https://api.github.com/rate_limit', { headers })
        if (!res.ok) return
        const data = await res.json()
        const core = data.resources?.core
        if (core) {
          this.apiRateLimit = {
            limit: core.limit,
            remaining: core.remaining,
            used: core.used,
            resetAt: new Date(core.reset * 1000)
          }
        }
      } catch (e) {}
    },

    showToast(message, type = 'info') {
      const id = Date.now()
      this.toasts.push({ id, message, type })
      setTimeout(() => this.dismissToast(id), 5000)
    },

    dismissToast(id) {
      const idx = this.toasts.findIndex(t => t.id === id)
      if (idx !== -1) this.toasts.splice(idx, 1)
    }
  }
}
</script>

<style scoped>
/* ============================================================
   WILDFIRE DASHBOARD - COMPLETE CSS
   ============================================================ */

/* ── New Header: Breadcrumbs ── */
.header-breadcrumbs { display: flex; align-items: center; gap: 10px; }
.bc-repo { color: var(--text-secondary, #a1a1aa); font-weight: 500; font-size: 13px; }
.bc-page { color: var(--text-primary, #f4f4f5); font-weight: 700; font-size: 14px; margin: 0; }
.env-badge { background: rgba(255,255,255,0.08); color: var(--text-muted, #71717a); font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; }
.wildfire-dashboard.light-theme .env-badge { background: rgba(0,0,0,0.06); }

/* ── System Status ── */
.system-status-indicator { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; margin-right: 12px; color: var(--text-muted, #71717a); }
.system-status-indicator.degraded { color: #f59e0b; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.operational .status-dot { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.4); }
.degraded .status-dot { background: #f59e0b; box-shadow: 0 0 8px rgba(245,158,11,0.4); }
.header-divider { width: 1px; height: 16px; background: var(--border-color, rgba(255,255,255,0.08)); margin: 0 8px; }
.wildfire-dashboard.light-theme .header-divider { background: rgba(0,0,0,0.08); }

/* ── Action Button: icon-only ── */
.action-btn.icon-only { padding: 6px; }

/* ── Welcome Banner: Clean & Compact ── */
.dash-welcome-clean {
  display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight);
  border-radius: 14px; margin-bottom: 12px;
  backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1), var(--glass-inner);
  position: relative; overflow: hidden;
}
.dash-welcome-clean::before {
  content: ''; position: absolute; top: -30px; right: -30px;
  width: 140px; height: 140px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 65%);
  pointer-events: none; opacity: 0.35;
}
.dw-profile-section { display: flex; align-items: center; gap: 12px; }
.dw-avatar-clean { width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--accent); box-shadow: 0 2px 10px var(--accent-glow); }
.dw-greeting h2 { font-size: 16px; font-weight: 500; margin: 0 0 2px 0; color: var(--text-secondary, #e2e8f0); }
.dw-greeting h2 span { color: var(--text-primary, #fff); font-weight: 700; }
.dw-greeting p { font-size: 12px; color: var(--text-muted, #8a8a9a); margin: 0; }
.dw-greeting p strong { color: var(--text-secondary, #e2e8f0); }

.dw-metrics-section { display: flex; align-items: center; gap: 20px; }
.dw-divider { width: 1px; height: 32px; background: var(--border-color, rgba(255,255,255,0.08)); }
.dw-metric-block { display: flex; flex-direction: column; gap: 6px; min-width: 130px; }
.metric-hd { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--text-muted, #8a8a9a); text-transform: uppercase; letter-spacing: 0.5px; }
.metric-progress-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
.wildfire-dashboard.light-theme .metric-progress-track { background: rgba(0,0,0,0.06); }
.metric-progress-fill { height: 100%; background: var(--text-primary, #fff); border-radius: 99px; transition: width 0.6s ease; }
.wildfire-dashboard.light-theme .metric-progress-fill { background: #0f172a; }
.churn-values { display: flex; gap: 14px; font-size: 15px; font-weight: 700; font-family: 'JetBrains Mono', 'Fira Code', monospace; }
.churn-add { color: #10b981; }
.churn-del { color: #ef4444; }

/* ── Quick Stats Strip (NEW) ── */
.quick-stats-strip {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  margin-bottom: 8px;
}
.qs-card {
  display: flex; align-items: center; gap: 12px; padding: 14px 18px;
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight); border-radius: 16px;
  backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15), var(--glass-inner);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.qs-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.25), var(--glass-inner);
  border-color: rgba(255,255,255,0.15);
}
.qs-icon-wrap {
  width: 32px; height: 32px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; position: relative;
}
.qs-icon-wrap.pulse-green { background: rgba(34,197,94,0.12); color: #22c55e; box-shadow: 0 0 16px rgba(34,197,94,0.2); }
.qs-icon-wrap.pulse-blue { background: rgba(59,130,246,0.12); color: #3b82f6; box-shadow: 0 0 16px rgba(59,130,246,0.2); }
.qs-icon-wrap.pulse-orange { background: rgba(255,120,0,0.12); color: var(--accent); box-shadow: 0 0 16px var(--accent-dim); }
.qs-icon-wrap.pulse-purple { background: rgba(168,85,247,0.12); color: #a855f7; box-shadow: 0 0 16px rgba(168,85,247,0.2); }
.qs-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.qs-label { font-size: 9px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
.qs-value { font-size: 15px; font-weight: 800; font-family: 'JetBrains Mono', 'Fira Code', monospace; }
.qs-sparkline { flex-shrink: 0; opacity: 0.7; }
.qs-status-pill {
  font-size: 8px; font-weight: 800; letter-spacing: 1px; padding: 3px 8px;
  border-radius: 99px; text-transform: uppercase; flex-shrink: 0;
}
.qs-status-pill.success { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); box-shadow: 0 0 12px rgba(34,197,94,0.15); }
.qs-uptime-bar { display: flex; gap: 2px; flex-shrink: 0; }
.qs-uptime-dot { width: 4px; height: 16px; border-radius: 2px; }
.qs-uptime-dot.ok { background: rgba(34,197,94,0.6); }
.qs-uptime-dot.warn { background: rgba(245,158,11,0.7); }
.qs-avatar-stack { display: flex; flex-shrink: 0; }
.qs-mini-avatar { width: 22px; height: 22px; border-radius: 50%; border: 2px solid rgba(8,8,14,0.9); margin-left: -6px; }
.qs-mini-avatar:first-child { margin-left: 0; }

.wildfire-dashboard.light-theme .qs-card {
  background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.wildfire-dashboard.light-theme .qs-mini-avatar { border-color: rgba(255,255,255,0.9); }

@media (max-width: 1000px) { .quick-stats-strip { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .quick-stats-strip { grid-template-columns: 1fr; } }



/* Dashboard wrapper (replaces Teleport) */
.wf-dashboard-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9000;
  display: contents;
}

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
   CSS VARIABLES - ADVANCED LIQUID GLASS
   ============================================================ */
.wildfire-dashboard {
  --bg-primary: transparent;
  --bg-secondary: linear-gradient(145deg, rgba(16, 16, 22, 0.6), rgba(8, 8, 12, 0.4));
  --bg-tertiary: rgba(255, 255, 255, 0.03);
  --bg-hover: rgba(255, 255, 255, 0.06);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.15);
  
  --text-primary: #ffffff;
  --text-secondary: #e2e8f0;
  --text-muted: #8a8a9a;
  
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0, 0.25);
  --accent-dim: rgba(255, 120, 0, 0.1);
  --accent-alt: #ff6030;
  --accent-alt2: #ff8c42;
  --success: #22c55e;
  --danger: #ef4444;
  
  --glass-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  --glass-inner: inset 0 1px 1px rgba(255, 255, 255, 0.12);
  --glass-blur: blur(30px) saturate(180%);

  position: fixed; inset: 0; z-index: 9999;
  display: flex; overflow: hidden; background: transparent;
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif; font-size: 13px;
  -webkit-font-smoothing: antialiased;
}

.wildfire-dashboard.light-theme {
  --bg-secondary: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(245, 245, 250, 0.5));
  --bg-tertiary: rgba(0, 0, 0, 0.03);
  --bg-hover: rgba(0, 0, 0, 0.06);
  --border-color: rgba(0, 0, 0, 0.08);
  --border-highlight: rgba(255, 255, 255, 0.6);
  
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  
  --glass-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  --glass-inner: inset 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* Light theme specific overrides */
.wildfire-dashboard.light-theme .dashboard-sidebar {
  background: rgba(255, 255, 255, 0.88);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
}
.wildfire-dashboard.light-theme .sidebar-brand { border-bottom: 1px solid rgba(0, 0, 0, 0.06); }
.wildfire-dashboard.light-theme .nav-item { color: #4a4a5a; }
.wildfire-dashboard.light-theme .nav-item:hover { background: rgba(255, 120, 0, 0.06); color: #1a1a2e; }
.wildfire-dashboard.light-theme .nav-item.active {
  background: rgba(255, 120, 0, 0.12); color: var(--accent);
  box-shadow: inset 0 0 0 1px rgba(255, 120, 0, 0.15);
  border-left: 3px solid var(--accent);
}
.wildfire-dashboard.light-theme .dashboard-header {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.wildfire-dashboard.light-theme .dash-welcome-clean,
.wildfire-dashboard.light-theme .dash-card,
.wildfire-dashboard.light-theme .kpi-card,
.wildfire-dashboard.light-theme .wiki-stats-card,
.wildfire-dashboard.light-theme .commits-panel,
.wildfire-dashboard.light-theme .tc-list,
.wildfire-dashboard.light-theme .fb-mini,
.wildfire-dashboard.light-theme .ipr-panel,
.wildfire-dashboard.light-theme .repo-health-card,
.wildfire-dashboard.light-theme .act-cal-card,
.wildfire-dashboard.light-theme .week-rhythm-card,
.wildfire-dashboard.light-theme .activity-timeline-card,
.wildfire-dashboard.light-theme .wog-card,
.wildfire-dashboard.light-theme .wog-breakdown-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.wildfire-dashboard.light-theme .dash-repo-card { background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(0, 0, 0, 0.08); }
.wildfire-dashboard.light-theme .repo-pulse-strip { background: rgba(255, 255, 255, 0.88); border: 1px solid rgba(0, 0, 0, 0.08); }
.wildfire-dashboard.light-theme .rps-item { background: transparent; }
.wildfire-dashboard.light-theme .rps-val { color: #1a1a2e; }
.wildfire-dashboard.light-theme .rps-sep { background: rgba(0, 0, 0, 0.1); }
.wildfire-dashboard.light-theme .action-btn, 
.wildfire-dashboard.light-theme .qa-btn { 
  background: rgba(0, 0, 0, 0.04); border-color: rgba(0, 0, 0, 0.1); color: #1a1a2e; box-shadow: none; 
}
.wildfire-dashboard.light-theme .action-btn:hover, 
.wildfire-dashboard.light-theme .qa-btn:hover { 
  background: rgba(0, 0, 0, 0.08); border-color: rgba(0, 0, 0, 0.2); 
}
.wildfire-dashboard.light-theme .sf-home-link { color: #5a5a6a; border: 1px solid rgba(0, 0, 0, 0.1); }
.wildfire-dashboard.light-theme .sf-home-link:hover { background: rgba(0, 0, 0, 0.03); color: #1a1a2e; }
.wildfire-dashboard.light-theme .search-wrapper { background: rgba(0, 0, 0, 0.02); border: 1px solid rgba(0, 0, 0, 0.08); }
.wildfire-dashboard.light-theme .dc-head { border-bottom: 1px solid rgba(0, 0, 0, 0.06); }
.wildfire-dashboard.light-theme .tc-row,
.wildfire-dashboard.light-theme .ipr-row,
.wildfire-dashboard.light-theme .at-row,
.wildfire-dashboard.light-theme .fb-mini-row { border-bottom: 1px solid rgba(0, 0, 0, 0.06); }
.wildfire-dashboard.light-theme .brand-name-white { color: #1a1a2e; }
.wildfire-dashboard.light-theme .brand-sub { color: #6a6a7a; }
.wildfire-dashboard.light-theme .nav-badge { background: rgba(255, 255, 255, 0.88); border: 1px solid rgba(0, 0, 0, 0.06); }
.wildfire-dashboard.light-theme .fc-tip { background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(0, 0, 0, 0.1); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); }
.wildfire-dashboard.light-theme .notif-dropdown { background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); }
.wildfire-dashboard.light-theme .toast-item { background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(0, 0, 0, 0.08); }
.wildfire-dashboard.light-theme .server-status-card { background: rgba(0, 0, 0, 0.02); border: 1px solid rgba(0, 0, 0, 0.06); }

/* Light theme chart colors */
.wildfire-dashboard.light-theme .fc-hm-0 { background: #e0e0e0; }
.wildfire-dashboard.light-theme .fc-hm-1 { background: rgba(255, 120, 0, 0.2); }
.wildfire-dashboard.light-theme .fc-hm-2 { background: rgba(255, 120, 0, 0.4); }
.wildfire-dashboard.light-theme .fc-hm-3 { background: rgba(255, 120, 0, 0.65); }
.wildfire-dashboard.light-theme .fc-hm-4 { background: rgba(255, 120, 0, 0.9); }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-0,
.wildfire-dashboard.light-theme .acl-cell.intensity-0 { background: #e8e8e8; }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-1,
.wildfire-dashboard.light-theme .acl-cell.intensity-1 { background: rgba(255, 120, 0, 0.2); }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-2,
.wildfire-dashboard.light-theme .acl-cell.intensity-2 { background: rgba(255, 120, 0, 0.4); }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-3,
.wildfire-dashboard.light-theme .acl-cell.intensity-3 { background: rgba(255, 120, 0, 0.65); }
.wildfire-dashboard.light-theme .act-cal-cell.intensity-4,
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
   HEADER - FLOATING GLASS
   ============================================================ */
.dashboard-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px; padding: 12px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight);
  border-radius: 20px;
  position: sticky; top: 16px; z-index: 50;
  backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), var(--glass-inner);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard-header.scrolled {
  box-shadow: var(--glass-shadow), 0 0 30px var(--accent-dim), var(--glass-inner);
  border-color: rgba(255, 120, 0, 0.3);
  transform: translateY(-4px);
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

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ============================================================
   BUTTONS - NEON & GLASS
   ============================================================ */
.action-btn, .qa-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
  cursor: pointer;
}

.action-btn:hover, .qa-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 15px var(--accent-dim), inset 0 1px 0 rgba(255,255,255,0.1);
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-alt));
  color: #000;
  border: 1px solid var(--accent-alt2);
  border-top: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 4px 15px var(--accent-glow), inset 0 1px 1px rgba(255,255,255,0.4);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, var(--accent-alt2), var(--accent));
  box-shadow: 0 8px 25px var(--accent-glow), 0 0 20px var(--accent), inset 0 1px 1px rgba(255,255,255,0.6);
  transform: translateY(-2px);
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

.theme-toggle-btn, .icon-btn, .action-btn.icon-only {
  padding: 8px !important;
  width: 32px;
  height: 32px;
}


/* Welcome Banner (Layout only, Glass from universal) */
.dash-welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 20px 28px;
  margin-bottom: 24px;
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

/* Kpi Card (Layout only, Glass from universal) */
.kpi-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px;
  min-height: 90px;
}
.kpi-glow {
  position: absolute; bottom: -30px; right: -30px; width: 100px; height: 100px;
  border-radius: 50%; background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  opacity: 0.3; pointer-events: none; transition: 0.4s;
}
.kpi-card:hover .kpi-glow { transform: scale(1.5); opacity: 0.6; }

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
  display: flex;
  align-items: center;
  margin: 16px 0 24px 0;
  overflow-x: auto;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight);
  border-radius: 16px;
  padding: 12px 16px;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1), var(--glass-inner);
}

.repo-pulse-strip::-webkit-scrollbar {
  height: 4px;
}
.repo-pulse-strip::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.rps-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(255, 120, 0, 0.15);
  border: 1px solid rgba(255, 120, 0, 0.3);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: 1px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 8px;
  box-shadow: 0 0 10px rgba(255, 120, 0, 0.1);
}

.rps-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  padding: 4px 16px;
  gap: 8px;
  min-width: 0;
}

.rps-sep {
  display: block;
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 4px;
}

.rps-val {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  white-space: nowrap;
  line-height: 1;
}

.rps-lbl {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.rps-pos {
  color: #22c55e !important;
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
   UNIVERSAL CARDS & 3D GLASS
   ============================================================ */
.dash-card, .kpi-card, .dash-welcome, .wiki-stats-card, .week-rhythm-card {
  background: var(--bg-secondary);
  backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight); /* Lumina direcțională de sus */
  border-radius: 20px;
  box-shadow: var(--glass-shadow), var(--glass-inner);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative; overflow: hidden;
}

.dash-card:hover, .kpi-card:hover, .wiki-stats-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--accent-rgb, 255,120,0), 0.3);
  border-top: 1px solid rgba(var(--accent-rgb, 255,120,0), 0.6);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px var(--accent-dim), var(--glass-inner);
  background: linear-gradient(145deg, rgba(24, 24, 32, 0.7), rgba(12, 12, 18, 0.5));
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
/* ============================================================
   WIKI OVERVIEW (VERCEL/LINEAR STYLE)
   ============================================================ */
.wiki-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.wog-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1), var(--glass-inner);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  transition: transform 0.2s;
}

.wog-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255,255,255,0.15);
}

.wog-lbl {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.wog-val {
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.wog-breakdown-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1), var(--glass-inner);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.wog-bc-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.wog-bc-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
  margin-bottom: 20px;
}

.wog-bc-seg {
  height: 100%;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.wog-bc-seg:hover {
  filter: brightness(1.2);
}

.wog-bc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
}

.wog-bc-leg-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
}

.wog-bc-leg-item em {
  font-style: normal;
  color: var(--text-muted);
  font-weight: 600;
}

.wog-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.dash-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.dash-chart-main {
  border-top: 2.5px solid var(--accent);
}

/* ============================================================
   MODERN CHART (PLAYER GROWTH STYLE)
   ============================================================ */
.modern-chart-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-top: 1px solid var(--border-highlight);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15), var(--glass-inner);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.mc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mc-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.mc-toggles {
  display: flex;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 4px;
}

.mc-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.mc-toggle.active {
  background: rgba(var(--accent-rgb), 0.15);
  color: var(--accent);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* KPI Grid (The 4 dark boxes at the top) */
.mc-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.mc-kpi-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(255,255,255,0.05);
  transition: 0.2s;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
}

.mc-kpi-box:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.mc-kpi-icon {
  color: var(--text-muted);
  opacity: 0.4;
  margin-bottom: 2px;
}

.mc-kpi-lbl {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mc-kpi-val {
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
}

/* Chart Area Layout */
.mc-chart-body {
  display: flex;
  height: 220px;
  position: relative;
}

.mc-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 16px;
  padding-bottom: 20px; /* Aliniază valorile la finalul SVG-ului */
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  text-align: right;
  width: 36px;
  flex-shrink: 0;
  opacity: 0.6;
}

.mc-svg-container {
  flex: 1;
  position: relative;
  cursor: crosshair;
}

/* X Axis Labels (Sub chart) */
.mc-x-axis {
  position: relative;
  height: 20px;
  margin-top: 4px;
}

.mc-x-lbl {
  position: absolute;
  transform: translateX(-50%);
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 500;
  opacity: 0.6;
}

/* Tooltip (Apare la hover) */
.mc-tooltip {
  position: absolute;
  background: #1a1a24;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 12px 16px;
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 15px));
  z-index: 10;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  min-width: 130px;
}

.mc-tt-date {
  font-size: 11px;
  font-weight: 700;
  color: #a0aec0;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-bottom: 6px;
}

.mc-tt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.mc-tt-lbl {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  font-weight: 600;
}

.mc-tt-val {
  font-size: 13px;
  font-weight: 800;
}

/* Light Theme Overrides for Modern Chart Card */
.wildfire-dashboard.light-theme .mc-toggle {
  color: rgba(0,0,0,0.5);
}
.wildfire-dashboard.light-theme .mc-toggle:hover {
  color: rgba(0,0,0,0.8);
  background: rgba(0,0,0,0.03);
}
.wildfire-dashboard.light-theme .mc-toggle.active {
  background: rgba(0,0,0,0.08);
  color: var(--text);
}
.wildfire-dashboard.light-theme .mc-kpi-box {
  background: #f3f4f6;
  border-color: rgba(0,0,0,0.05);
}
.wildfire-dashboard.light-theme .mc-kpi-box:hover {
  background: #e5e7eb;
  border-color: rgba(0,0,0,0.1);
}
.wildfire-dashboard.light-theme .mc-tooltip {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}
.wildfire-dashboard.light-theme .mc-tt-date {
  color: var(--text-muted);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.wildfire-dashboard.light-theme .mc-tt-lbl {
  color: rgba(0,0,0,0.6);
}
.wildfire-dashboard.light-theme .mc-tt-val {
  color: var(--text);
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

/* Clean Vercel-style Repository Card */
.rs-rings {
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 24px;
  gap: 24px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-highlight);
}

.rs-ring-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  transition: 0.2s;
}

.rs-ring-item:hover {
  background: rgba(255,255,255,0.04);
  transform: translateY(-2px);
}

.rs-ring-lbl {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.rs-ring-svg-wrap {
  position: relative;
  width: 100%;
  height: auto;
  filter: none;
  display: flex;
  align-items: center;
  gap: 16px;
}

.rs-ring-svg-wrap svg {
  width: 50px;
  height: 50px;
}

.rs-ring-center {
  position: static;
  transform: none;
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  text-shadow: none;
}

.lang-section {
  padding: 24px;
  background: var(--bg-secondary);
}

.lang-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 16px;
  display: block;
  text-transform: uppercase;
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
/* ============================================================
   LIST ROWS (Commits, Issues, Top Contributors)
   ============================================================ */
.commit-card, .ipr-row, .tc-row, .at-row, .fb-mini-row {
  background: transparent;
  border: 1px solid transparent;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.2s ease;
  margin: 0 8px; padding: 12px 14px;
  border-radius: 12px;
}

.commit-card:last-child, .ipr-row:last-child, .tc-row:last-child, .at-row:last-child {
  border-bottom: 1px solid transparent;
}

.commit-card:hover, .ipr-row:hover, .tc-row:hover, .at-row:hover {
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: scale(1.01);
  z-index: 2; position: relative;
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
  padding: 12px 14px;
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
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
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
    margin-top: 8px;
  }
  
  .rps-brand {
    border-radius: 100px;
  }
  
  .wsc-kpis {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .toast-item {
    min-width: auto;
    max-width: calc(100vw - 32px);
  }
}

/* ============================================================
   MISSING: COMMITS GRID
   ============================================================ */
.commits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 8px;
}

@media (max-width: 900px) {
  .commits-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .commits-grid { grid-template-columns: 1fr; }
}

/* ============================================================
   NEGATIVE TREND CLASS
   ============================================================ */
.dws-val.negative { color: #ef4444; }
.dws-val.positive { color: #22c55e; }

/* ============================================================
   TWO-COLUMN LAYOUT
   ============================================================ */
.dash-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 900px) {
  .dash-two-col { grid-template-columns: 1fr; }
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
.wf-toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.wf-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  min-width: 280px;
  max-width: 380px;
  pointer-events: all;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.toast-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.9));
  border-color: rgba(239, 68, 68, 0.4);
}

.toast-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(30, 64, 175, 0.9));
  border-color: rgba(59, 130, 246, 0.4);
}

.toast-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.9));
  border-color: rgba(34, 197, 94, 0.4);
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  flex-shrink: 0;
  transition: color 0.15s;
}

.toast-close:hover { color: #fff; }

/* Toast transition animations */
.toast-enter-active { animation: toast-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { animation: toast-out 0.25s ease forwards; }

@keyframes toast-in {
  from { opacity: 0; transform: translateX(60px) scale(0.9); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(60px) scale(0.9); }
}

/* ============================================================
   SYSTEM STATUS CARD
   ============================================================ */
.ss-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ss-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ss-lbl {
  font-size: 11px;
  color: var(--text-muted);
  width: 110px;
  flex-shrink: 0;
}

.ss-bar-wrap {
  flex: 1;
  height: 5px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.ss-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.ss-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  width: 70px;
  text-align: right;
  flex-shrink: 0;
}

.ss-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.ss-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  font-size: 9px;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.ss-pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: livePulse 2s ease infinite;
}

.ss-pill-txt { color: var(--text-secondary); }

/* ============================================================
   CODE FREQUENCY WIDGET
   ============================================================ */
.cf-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cf-legend {
  display: flex;
  gap: 16px;
}

.cf-leg {
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.cf-leg::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: currentColor;
  opacity: 0.7;
}

.cf-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 100px;
}

.cf-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.cf-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  width: 100%;
  justify-content: center;
}

.cf-bar {
  width: 8px;
  border-radius: 3px 3px 0 0;
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 2px;
}

.cf-add { background: linear-gradient(180deg, #4ade80, #22c55e); }
.cf-del { background: linear-gradient(180deg, #f87171, #ef4444); }

.cf-lbl {
  font-size: 8px;
  color: var(--text-muted);
  text-align: center;
  white-space: nowrap;
}

.cf-totals {
  display: flex;
  gap: 16px;
  font-size: 11px;
  font-weight: 700;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.cf-empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
}

/* ============================================================
   COMMIT HEATMAP CALENDAR
   ============================================================ */
.hm-body {
  padding: 14px 16px;
}

.hm-months {
  display: flex;
  gap: 0;
  margin-bottom: 4px;
  padding-left: 0;
}

.hm-month-lbl {
  flex: 1;
  font-size: 9px;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.3px;
}

.hm-grid {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  grid-auto-rows: 1fr;
  grid-template-rows: repeat(7, 11px);
  gap: 2px;
  grid-auto-flow: column;
  width: 100%;
}

.hm-cell {
  width: 100%;
  height: 11px;
  border-radius: 2px;
  transition: opacity 0.15s;
  cursor: default;
}

.hm-cell:hover { opacity: 0.7; }

.hm-i0 { background: rgba(255, 255, 255, 0.05); }
.hm-i1 { background: rgba(255, 120, 0, 0.2); }
.hm-i2 { background: rgba(255, 120, 0, 0.4); }
.hm-i3 { background: rgba(255, 120, 0, 0.65); }
.hm-i4 { background: rgba(255, 120, 0, 0.9); box-shadow: 0 0 6px rgba(255, 120, 0, 0.5); }

.wildfire-dashboard.light-theme .hm-i0 { background: rgba(0,0,0,0.06); }
.wildfire-dashboard.light-theme .hm-i1 { background: rgba(255, 120, 0, 0.18); }
.wildfire-dashboard.light-theme .hm-i2 { background: rgba(255, 120, 0, 0.38); }
.wildfire-dashboard.light-theme .hm-i3 { background: rgba(255, 120, 0, 0.60); }
.wildfire-dashboard.light-theme .hm-i4 { background: rgba(255, 120, 0, 0.85); }

.hm-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  justify-content: flex-end;
}

.hm-leg-txt {
  font-size: 9px;
  color: var(--text-muted);
  margin: 0 4px;
}

/* ============================================================
   BRANCHES OVERVIEW
   ============================================================ */
.br-list {
  padding: 8px 0;
  max-height: 280px;
  overflow-y: auto;
}

.br-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.15s;
}

.br-row:last-child { border-bottom: none; }
.br-row:hover { background: var(--bg-hover); }

.br-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-muted);
}

.br-icon.br-default {
  background: var(--accent-dim);
  color: var(--accent);
}

.br-info {
  flex: 1;
  min-width: 0;
}

.br-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: monospace;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.br-tags {
  display: flex;
  gap: 4px;
  margin-top: 3px;
}

.br-tag {
  font-size: 8px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.br-tag-default {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid rgba(255, 120, 0, 0.3);
}

.br-tag-protected {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.br-sha {
  font-family: monospace;
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* ============================================================
   DEPLOYMENT TIMELINE
   ============================================================ */
.deploy-card { overflow: hidden; }

.deploy-timeline {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.dt-item {
  display: flex;
  gap: 12px;
  position: relative;
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.15s;
}

.dt-item:hover { background: var(--bg-hover); }

.dt-line {
  position: absolute;
  left: 22px;
  top: 28px;
  bottom: -12px;
  width: 2px;
  background: var(--border-color);
}

.dt-item:last-child .dt-line { display: none; }

.dt-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  margin-top: 3px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 10px var(--accent-glow);
}

.dt-dot-pre {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.dt-dot-draft {
  background: var(--text-muted);
  box-shadow: none;
}

.dt-body { flex: 1; min-width: 0; }

.dt-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.dt-tag {
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-dim);
  padding: 2px 8px;
  border-radius: 4px;
}

.dt-badge {
  font-size: 8px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.dt-pre {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.dt-draft {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.dt-time {
  font-size: 10px;
  color: var(--text-muted);
  margin-left: auto;
}

.dt-name {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-author {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--text-muted);
}

.dt-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

/* ============================================================
   MOBILE BOTTOM NAV — actually show it
   ============================================================ */
@media (max-width: 640px) {
  .mobile-bottom-nav {
    display: flex !important;
  }
  .dashboard-main {
    padding-bottom: 70px;
  }
}
/* ============================================================
   SKELETON LOADING PATTERNS
   ============================================================ */
@keyframes shimmerPattern {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.sk-pulse-pattern {
  background: 
    linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.015) 0px,
      rgba(255, 255, 255, 0.015) 10px,
      transparent 10px,
      transparent 20px
    ),
    var(--bg-secondary);
  background-size: 200% 100%, 100% 100%, 100% 100%;
  animation: shimmerPattern 3s infinite linear;
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.wildfire-dashboard.light-theme .sk-pulse-pattern {
  background: 
    linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%),
    repeating-linear-gradient(
      -45deg,
      rgba(0, 0, 0, 0.02) 0px,
      rgba(0, 0, 0, 0.02) 10px,
      transparent 10px,
      transparent 20px
    ),
    rgba(255, 255, 255, 0.7);
  background-size: 200% 100%, 100% 100%, 100% 100%;
  border-color: rgba(0, 0, 0, 0.08);
}

.sk-welcome { height: 160px; margin-bottom: 24px; }
.sk-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.sk-card { height: 110px; }
.sk-breakdown { height: 80px; margin-bottom: 24px; }
.sk-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
.sk-health { height: 120px; }
.sk-chart { height: 360px; margin-bottom: 24px; }

/* ============================================================
   MOBILE RESPONSIVENESS
   ============================================================ */
@media (max-width: 1024px) {
  .wiki-overview-grid, .wsc-stats-pills { grid-template-columns: repeat(2, 1fr); }
  .dw-profile-section { flex-direction: column; text-align: center; }
  .dw-metrics-section { flex-direction: column; width: 100%; }
  .dash-welcome-clean { flex-direction: column; }
  .rs-rings { flex-direction: column; }
  .sk-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .sk-grid-2 { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .wiki-overview-grid, .wsc-stats-pills { grid-template-columns: 1fr; }
  .kpi-row, .repo-pulse-strip { flex-direction: column; }
  .repo-pulse-strip .rps-item { width: 100%; justify-content: space-between; }
  .repo-pulse-strip .rps-sep { display: none; }
  .mc-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .mc-kpi-grid { grid-template-columns: 1fr; }
  .sk-grid-4 { grid-template-columns: 1fr; }
  .view-container { padding: 16px; }
}
</style>