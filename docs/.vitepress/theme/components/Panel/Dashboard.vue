<template>
  <Teleport to="body" v-if="isMounted">
  <div class="wildfire-dashboard" :class="{ 'light-theme': isLightTheme }">
    <!-- Show Login if not authenticated -->
    <PanelLogin 
      v-if="!isAuthenticated"
      @login-success="handleLoginSuccess"
    />
    
    <!-- Main Dashboard -->
    <div class="dashboard-bg">
      <div class="bg-grid"></div>
      <div class="bg-particles">
        <div v-for="n in 50" :key="n" class="particle" :style="particleStyle(n)"></div>
      </div>
    </div>

      <button class="theme-toggle-btn" @click="toggleTheme" :title="isLightTheme ? 'Dark Mode' : 'Light Mode'">
        <svg v-if="isLightTheme" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

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
          <div class="sf-user" @click="currentView = 'profile'" :title="sidebarCollapsed ? userLogin : ''">
            <img :src="userAvatar" :alt="userLogin" class="sf-avatar">
            <div class="sf-info" v-if="!sidebarCollapsed">
              <span class="sf-name">{{ userLogin }}</span>
              <span class="sf-status"><span class="status-dot"></span> ONLINE</span>
            </div>
          </div>
          <button class="logout-btn" @click="handleLogout" :title="sidebarCollapsed ? 'Sign Out' : ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span v-if="!sidebarCollapsed">SIGN OUT</span>
          </button>
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
                <svg class="fc-svg" viewBox="0 0 640 110" preserveAspectRatio="none" width="100%" height="110">
                  <defs>
                    <linearGradient id="fcBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#ff4500" stop-opacity="0.95"/>
                      <stop offset="100%" stop-color="#ff6a30" stop-opacity="0.35"/>
                    </linearGradient>
                    <linearGradient id="fcAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#ff4500" stop-opacity="0.1"/>
                      <stop offset="100%" stop-color="#ff4500" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <line x1="5" y1="88" x2="635" y2="88" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                  <path :d="flamePath" fill="url(#fcAreaGrad)"/>
                  <rect v-for="(b, i) in flameBarData" :key="i"
                    :x="b.x" :y="b.y" :width="b.w" :height="b.h" rx="2" ry="2"
                    :fill="b.commits > 0 ? 'url(#fcBarGrad)' : 'rgba(255,255,255,0.04)'"
                  />
                  <g v-if="flamePeak">
                    <circle :cx="flamePeak.cx" :cy="flamePeak.y" r="2.5" fill="#ff4500"/>
                    <text :x="flamePeak.cx" :y="flamePeak.y - 6" text-anchor="middle" font-size="8.5" fill="#ff4500" font-weight="700" font-family="system-ui,sans-serif">{{ flamePeak.commits }}</text>
                  </g>
                  <text v-for="b in flameLabelBars" :key="'l'+b.shortLabel"
                    :x="b.cx" y="104" text-anchor="middle" font-size="8" :fill="isLightTheme ? '#888' : '#4a4a60'" font-family="system-ui,sans-serif">{{ b.shortLabel }}</text>
                </svg>
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
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><span>COMMUNITY</span></div>
            <div class="dash-feeds">
              <div class="dash-card feed-panel">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>
                    RECENT COMMITS
                  </div>
                  <span class="dc-badge">{{ recentCommits.length }}</span>
                </div>
                <div class="feed-rows">
                  <div v-for="commit in recentCommits.slice(0, 6)" :key="commit.id" class="feed-row" @click="openCommit(commit.url)">
                    <img :src="`https://github.com/${commit.author}.png`" :alt="commit.author" class="fr-avatar">
                    <div class="fr-body">
                      <span class="fr-msg">{{ truncate(commit.message, 46) }}</span>
                      <div class="fr-meta">
                        <span class="fr-author">@{{ commit.author }}</span>
                        <span class="fr-sep">·</span>
                        <span class="fr-time">{{ timeAgo(commit.date) }}</span>
                      </div>
                    </div>
                    <code class="fr-hash">{{ commit.id }}</code>
                    <svg class="fr-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>

              <div class="dash-card feed-panel">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    TOP CONTRIBUTORS
                  </div>
                  <span class="dc-badge">TOP 5</span>
                </div>
                <div class="contrib-rows">
                  <div v-for="(c, i) in topContributors.slice(0, 5)" :key="c.login" class="cr-row" @click="openProfile(c.login)">
                    <span class="cr-rank" :class="'rank-' + (i + 1)">{{ i + 1 }}</span>
                    <img :src="c.avatar_url" :alt="c.login" class="cr-avatar">
                    <div class="cr-info">
                      <div class="cr-name-row">
                        <span class="cr-name">{{ c.login }}</span>
                        <span class="cr-pct">{{ Math.round(c.contributions / maxContributions * 100) }}%</span>
                      </div>
                      <div class="cr-bar"><div class="cr-fill" :style="{ width: (c.contributions / maxContributions * 100) + '%' }"></div></div>
                    </div>
                    <span class="cr-count">{{ formatNumber(c.contributions) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Issues + PRs -->
            <div class="dash-slabel"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg><span>OPEN ITEMS</span></div>
            <div class="dash-ipr">
              <div class="dash-card ipr-panel">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>
                    OPEN ISSUES
                  </div>
                  <span class="dc-badge blue">{{ recentIssues.length }}</span>
                </div>
                <div class="ipr-list">
                  <div v-for="issue in recentIssues.slice(0, 5)" :key="issue.id" class="ipr-row" @click="openIssue(issue.url)">
                    <img :src="issue.avatar || `https://github.com/${issue.author}.png`" :alt="issue.author" class="ipr-avatar">
                    <div class="ipr-num-wrap"><span class="ipr-dot issue-dot"></span><span class="ipr-num">#{{ issue.number }}</span></div>
                    <div class="ipr-body">
                      <span class="ipr-title">{{ truncate(issue.title, 34) }}</span>
                      <span class="ipr-meta">@{{ issue.author }} · {{ timeAgo(issue.date) }}</span>
                    </div>
                    <svg class="ipr-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <div v-if="recentIssues.length === 0" class="ipr-empty">No open issues</div>
                </div>
              </div>
              <div class="dash-card ipr-panel">
                <div class="dc-head">
                  <div class="dc-head-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22c55e"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>
                    OPEN PULL REQUESTS
                  </div>
                  <span class="dc-badge green">{{ recentPRs.length }}</span>
                </div>
                <div class="ipr-list">
                  <div v-for="pr in recentPRs.slice(0, 5)" :key="pr.id" class="ipr-row" @click="openPR(pr.url)">
                    <img :src="pr.avatar || `https://github.com/${pr.author}.png`" :alt="pr.author" class="ipr-avatar">
                    <div class="ipr-num-wrap"><span class="ipr-dot pr-dot"></span><span class="ipr-num">#{{ pr.number }}</span></div>
                    <div class="ipr-body">
                      <span class="ipr-title">{{ truncate(pr.title, 34) }}</span>
                      <span class="ipr-meta">@{{ pr.author }} · {{ timeAgo(pr.date) }}</span>
                    </div>
                    <svg class="ipr-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <div v-if="recentPRs.length === 0" class="ipr-empty">No open pull requests</div>
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
          />

          <PanelProfile
            v-else-if="currentView === 'profile'"
            :user-login="userLogin"
            :user-avatar="userAvatar"
            :github-token="githubToken"
            :is-light-theme="isLightTheme"
            :contributors="allContributorsData"
            :daily-commits="dailyCommits"
            :total-commits="repoStats.totalCommits"
            @toggle-theme="toggleTheme"
            @logout="handleLogout"
          />
        </div>
      </main>
    </div>
  </Teleport>
</template>

<script>
    import PanelLogin from './PanelLogin.vue'
    import PanelFiles from './PanelFiles.vue'
    import PanelContributors from './PanelContributors.vue'
    import PanelAudit from './PanelAudit.vue'
    import PanelAnalytics from './PanelAnalytics.vue'
    import PanelProfile from './PanelProfile.vue'

    export default {
      name: 'Dashboard',
      
      components: {
        PanelLogin,
        PanelFiles,
        PanelContributors,
        PanelAudit,
        PanelAnalytics,
        PanelProfile
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
          dailyCommits: [],
          weeklyCommits: [],
          languageStats: [],
          
          navItems: [
            { id: 'dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>', label: 'DASHBOARD' },
            { id: 'files', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>', label: 'FILES' },
            { id: 'contributors', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'CONTRIBUTORS', badge: 'LIVE' },
            { id: 'audit', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>', label: 'AUDIT', badge: 'LIVE' },
            { id: 'analytics', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/></svg>', label: 'ANALYTICS' },
            { id: 'profile', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'MY PROFILE' }
          ]
        }
      },
      
      computed: {
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
            { id: 'commits',      label: 'TOTAL COMMITS', value: this.formatNumber(this.repoStats.totalCommits), icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>', bg: 'rgba(255,69,0,0.2)',    color: '#ff4500' },
            { id: 'contributors', label: 'CONTRIBUTORS',  value: String(this.repoStats.contributors),            icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', bg: 'rgba(52,152,219,0.2)',  color: '#3498db' },
            { id: 'files',        label: 'FILES',          value: this.formatNumber(this.repoStats.files),        icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>', bg: 'rgba(155,89,182,0.2)', color: '#9b59b6' },
            { id: 'prs',          label: 'OPEN PULLS',     value: String(this.repoStats.openPRs),                 icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/></svg>',                                                                                                                                   bg: 'rgba(46,204,113,0.2)',  color: '#2ecc71' },
            { id: 'issues',       label: 'OPEN ISSUES',    value: String(this.repoStats.openIssues),              icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>',                                                                                                                                                 bg: 'rgba(243,156,18,0.2)',  color: '#f39c12' }
          ]
        },
        maxContributions() {
          return Math.max(...this.topContributors.map(c => c.contributions), 1)
        },
        repoRings() {
          const s = this.repoStats
          const items = [
            { label: 'Stars',    val: this.formatNumber(s.stars    || 0), raw: s.stars    || 0, color: '#ffd700' },
            { label: 'Forks',    val: this.formatNumber(s.forks    || 0), raw: s.forks    || 0, color: '#22c55e' },
            { label: 'Watchers', val: this.formatNumber(s.watchers || 0), raw: s.watchers || 0, color: '#3b82f6' },
            { label: 'Files',    val: this.formatNumber(s.files    || 0), raw: s.files    || 0, color: '#ff4500' }
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
          const barW = 17, step = 21, baseline = 88, maxBarH = 80
          const startX = (640 - totalBars * step + (step - barW)) / 2
          const now = new Date()
          return commits.map((c, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (totalBars - 1 - i))
            const pct = max > 0 ? c / max : 0
            const h = c > 0 ? Math.max(pct * maxBarH, 4) : 1.5
            const x = startX + i * step
            return {
              commits: c,
              pct,
              x: parseFloat(x.toFixed(1)),
              y: parseFloat((baseline - h).toFixed(1)),
              w: barW,
              h: parseFloat(h.toFixed(1)),
              cx: parseFloat((x + barW / 2).toFixed(1)),
              shortLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          })
        },
        flamePath() {
          const bars = this.flameBarData
          if (!bars.length) return ''
          const baseline = 88
          const pts = bars.map(b => `${b.cx},${b.y}`)
          return `M${bars[0].cx},${baseline} ${pts.map(p => `L${p}`).join(' ')} L${bars[bars.length - 1].cx},${baseline} Z`
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
        }
      },
      
      watch: {},
      
      mounted() {
        this.isMounted = true
        const savedTheme = localStorage.getItem('wildfire-theme')
        if (savedTheme === 'light') this.isLightTheme = true
        
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

    this.$nextTick(() => {
      if (this.$refs.mainContent) {
        this.$refs.mainContent.addEventListener('scroll', this.handleScroll)
      }
    })
    window.addEventListener('resize', this.handleResize)

    this.refreshAllData()
    setInterval(() => this.refreshAllData(), 30000)
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
      await this.fetchAllGitHubData()
      this.isSyncing = false
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
            url: commit.html_url,
            hash: commit.sha
          })
        })
        
        this.recentCommits = allCommits.slice(0, 10).map(commit => ({
          id: commit.sha.substring(0, 7),
          message: commit.commit.message.split('\n')[0],
          author: commit.author?.login || commit.commit.author.name,
          date: commit.commit.author.date,
          url: commit.html_url
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
    
    getLangColor(name) {
      const map = { JavaScript:'#f7df1e', TypeScript:'#3178c6', Vue:'#42b883', HTML:'#e34f26', CSS:'#1572b6', SCSS:'#cc6699', Python:'#3776ab', Go:'#00add8', Rust:'#dea584', Ruby:'#701516', PHP:'#4f5d95', Shell:'#89e051', Markdown:'#083fa1' }
      return map[name] || '#' + Math.abs(name.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0) % 0xffffff).toString(16).padStart(6, '0')
    },
    openProfile(login) {
      this.currentView = 'contributors'
    },
    openNewPR() {
      window.open(`https://github.com/${this.repoOwner}/${this.repoName}/compare`, '_blank')
    }
  }
}
</script>

<style scoped>
.wildfire-dashboard {
  --bg-primary: #0a0a0c;
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --bg-hover: #1f1f24;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.2);
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
  --accent-glow: rgba(255, 69, 0, 0.1);
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
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.theme-toggle-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
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
  background: rgba(255,69,0,0.15);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
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
  background: rgba(255,69,0,0.12);
  color: var(--accent);
  border: 1px solid rgba(255,69,0,0.18);
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
  background: rgba(255,69,0,0.15);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-left: auto;
}

.sidebar-footer {
  padding: 10px 8px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.sf-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  overflow: hidden;
}

.sf-user:hover { background: var(--bg-tertiary); }

.sf-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  flex-shrink: 0;
}

.sf-info { flex: 1; min-width: 0; }
.sf-name { display: block; font-size: 12px; font-weight: 600; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sf-status { display: flex; align-items: center; gap: 4px; font-size: 9px; color: var(--success); }

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--success);
  border-radius: 50%;
  animation: statusPulse 1.5s ease infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.logout-btn {
  width: 100%;
  padding: 8px 10px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease;
  letter-spacing: 0.3px;
}

.logout-btn:hover {
  background: rgba(231,76,60,0.1);
  color: #e74c3c;
  border-color: rgba(231,76,60,0.3);
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
.dw-avatar { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--bg-secondary); box-shadow: 0 0 0 2px var(--accent); }
.dw-online { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: var(--success); border-radius: 50%; border: 2px solid var(--bg-secondary); }
.dw-text h2 { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0 0 3px; }
.dw-name { color: var(--accent); }
.dw-text p { font-size: 11px; color: var(--text-muted); margin: 0; }
.dw-stats { display: flex; align-items: center; gap: 16px; }
.dws-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.dws-val { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
.dws-val.positive { color: var(--success); }
.dws-lbl { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.dws-sep { width: 1px; height: 28px; background: var(--border-color); }

/* Repo Pulse Unified Strip */
.repo-pulse-strip { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; display: flex; align-items: stretch; overflow: hidden; }
.rps-brand { display: flex; align-items: center; gap: 6px; padding: 0 16px; background: rgba(255,69,0,0.07); border-right: 1px solid var(--border-color); font-size: 9px; font-weight: 700; color: var(--accent); letter-spacing: 0.8px; white-space: nowrap; flex-shrink: 0; }
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

/* Charts */
.dash-charts { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
.flame-chart { padding: 10px 14px 12px; }
.fc-svg { display: block; overflow: visible; }

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

/* Feeds */
.dash-feeds { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.feed-rows { display: flex; flex-direction: column; }
.feed-row { display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--border-color); position: relative; }
.feed-row:last-child { border-bottom: none; }
.feed-row:hover { background: var(--bg-tertiary); }
.feed-row:hover::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); border-radius: 0 2px 2px 0; }
.fr-avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--border-color); flex-shrink: 0; transition: border-color 0.15s; }
.feed-row:hover .fr-avatar { border-color: var(--accent); }
.fr-body { flex: 1; min-width: 0; }
.fr-msg { display: block; font-size: 11px; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.fr-meta { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--text-muted); }
.fr-author { color: var(--accent); font-weight: 600; }
.fr-sep { opacity: 0.4; }
.fr-time { color: var(--text-muted); }
.fr-hash { background: rgba(255,69,0,0.1); border: 1px solid rgba(255,69,0,0.2); padding: 2px 6px; border-radius: 4px; font-size: 9px; color: var(--accent); font-family: monospace; flex-shrink: 0; letter-spacing: 0.5px; }
.fr-arrow { color: var(--text-muted); flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
.feed-row:hover .fr-arrow { opacity: 1; color: var(--accent); }

/* Top Contributors */
.contrib-rows { display: flex; flex-direction: column; }
.cr-row { display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--border-color); }
.cr-row:last-child { border-bottom: none; }
.cr-row:hover { background: var(--bg-tertiary); }
.cr-rank { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; background: var(--bg-tertiary); color: var(--text-muted); flex-shrink: 0; }
.rank-1 { background: linear-gradient(135deg, #ffd700, #ffb700); color: #000; box-shadow: 0 2px 8px rgba(255,215,0,0.4); }
.rank-2 { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); color: #333; }
.rank-3 { background: linear-gradient(135deg, #cd7f32, #a05a20); color: #fff; }
.cr-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border-color); flex-shrink: 0; transition: border-color 0.15s; }
.cr-row:hover .cr-avatar { border-color: var(--accent); }
.cr-info { flex: 1; min-width: 0; }
.cr-name-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.cr-name { font-size: 11px; font-weight: 600; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cr-pct { font-size: 9px; color: var(--text-muted); flex-shrink: 0; margin-left: 4px; }
.cr-bar { height: 4px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
.cr-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #ff8c42); border-radius: 2px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
.cr-count { font-size: 12px; font-weight: 700; color: var(--accent); flex-shrink: 0; min-width: 28px; text-align: right; }

/* Issues + PRs */
.dash-ipr { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.ipr-list { display: flex; flex-direction: column; }
.ipr-row { display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--border-color); }
.ipr-row:last-child { border-bottom: none; }
.ipr-row:hover { background: var(--bg-tertiary); }
.ipr-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; border: 1px solid var(--border-color); }
.ipr-num-wrap { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
.ipr-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.issue-dot { background: #3b82f6; box-shadow: 0 0 6px rgba(59,130,246,0.5); }
.pr-dot { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.5); }
.ipr-num { font-size: 10px; color: var(--text-muted); font-weight: 600; min-width: 28px; }
.ipr-body { flex: 1; min-width: 0; }
.ipr-title { display: block; font-size: 11px; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.ipr-meta { font-size: 10px; color: var(--text-muted); display: block; }
.ipr-arrow { color: var(--text-muted); opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
.ipr-row:hover .ipr-arrow { opacity: 1; color: var(--accent); }
.ipr-empty { padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px; }

@media (max-width: 1200px) {
  .kpi-row { grid-template-columns: repeat(3, 1fr); }
  .dash-charts { grid-template-columns: 1fr; }
  .dash-feeds { grid-template-columns: 1fr; }
  .dash-ipr { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .dashboard-sidebar { width: 64px; }
  .brand-text, .nav-label, .nav-badge, .sf-info, .logout-btn span { display: none !important; }
  .nav-item { justify-content: center; padding: 10px; }
  .logout-btn { justify-content: center; padding: 8px; }
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .rps-brand { display: none; }
}

@media (max-width: 640px) {
  .dashboard-sidebar {
    position: absolute;
    left: 0; top: 0; height: 100%;
    width: 220px !important;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 6px 0 28px rgba(0,0,0,0.7);
  }
  .dashboard-sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  .dashboard-sidebar:not(.collapsed) .brand-text { display: flex !important; }
  .dashboard-sidebar:not(.collapsed) .nav-label { display: block !important; }
  .dashboard-sidebar:not(.collapsed) .nav-badge { display: inline !important; }
  .dashboard-sidebar:not(.collapsed) .sf-info { display: flex !important; }
  .dashboard-sidebar:not(.collapsed) .logout-btn span { display: inline !important; }
  .dashboard-sidebar:not(.collapsed) .nav-item { justify-content: flex-start; }
  .dashboard-sidebar:not(.collapsed) .logout-btn { justify-content: flex-start; padding: 8px 10px; }
  .dashboard-main { padding: 10px 12px; }
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .header-left { gap: 10px; }
  .header-left h1 { font-size: 13px; }
  .live-indicator { display: none; }
  .dw-stats { display: none; }
  .action-btn { padding: 6px 10px; }
  .btn-text { display: none; }
  .rs-rings { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 420px) {
  .kpi-row { grid-template-columns: repeat(1, 1fr); }
  .dashboard-main { padding: 8px; }
  .dashboard-header { flex-wrap: wrap; gap: 6px; }
  .header-right { width: 100%; }
  .action-btn { flex: 1; justify-content: center; }
}
</style>