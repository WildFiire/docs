<template>
  <div class="wildfire-docs" :class="{ 'light-theme': isLightTheme }">
    <!-- Dynamic Particle Background -->
    <div class="docs-bg">
      <div class="bg-grid"></div>
      <div class="bg-particles">
        <div v-for="n in 50" :key="n" class="particle" :style="particleStyle(n)"></div>
      </div>
    </div>

    <!-- Theme Toggle Button - Top Right -->
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

    <!-- Sidebar -->
    <aside class="docs-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-brand" @click="currentView = 'dashboard'">
        <div class="brand-icon">
          <!-- WILDFIRE.WEBP LOGO -->
          <img src="/icons/wildfire.webp" alt="WildFire Logo" width="36" height="36">
          <div class="brand-pulse"></div>
        </div>
        <div class="brand-text" v-if="!sidebarCollapsed">
          <span class="brand-name">WILDFIRE</span>
          <span class="brand-dot">/</span>
          <span class="brand-version">DOCS</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div v-for="item in navItems" :key="item.id" 
             class="nav-item" 
             :class="{ active: currentView === item.id }"
             @click="handleNavClick(item)">
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label" v-if="!sidebarCollapsed">{{ item.label }}</span>
          <span class="nav-badge" v-if="item.badge">{{ item.badge }}</span>
          <div class="nav-glow"></div>
        </div>
      </nav>

      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <div class="repo-stats-mini">
          <div class="stat-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--accent)">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="stat-value">{{ formatNumber(repoStats.totalCommits) }}</span>
          </div>
          <div class="stat-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--accent)">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="stat-value">{{ repoStats.contributors }}</span>
          </div>
          <div class="stat-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--accent)">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span class="stat-value">{{ formatNumber(repoStats.stars) }}</span>
          </div>
        </div>

        <button class="sync-button" @click="refreshAllData" :disabled="isSyncing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ spin: isSyncing }">
            <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9" />
            <path d="M21 3v6h-6" />
          </svg>
          <span>{{ isSyncing ? 'SYNC' : 'SYNC' }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="docs-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="docs-header" :class="{ 'scrolled': isScrolled }">
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
              <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
            </svg>
            <span class="btn-text">ISSUE</span>
          </button>
          <button class="action-btn primary" @click="openNewPR">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
            </svg>
            <span class="btn-text">PULL</span>
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loader-ring">
          <div></div><div></div><div></div><div></div>
        </div>
        <p>LOADING REPOSITORY DATA</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1"/>
        </svg>
        <h3>CONNECTION ERROR</h3>
        <p>{{ error }}</p>
        <button class="action-btn primary" @click="refreshAllData">RETRY</button>
      </div>

      <!-- DASHBOARD VIEW -->
      <div v-else-if="currentView === 'dashboard'" class="dashboard-view">
        <!-- Hero Metrics with Orange Theme -->
        <div class="metrics-hero">
          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">TOTAL COMMITS</span>
              <span class="metric-value">{{ formatNumber(repoStats.totalCommits) }}</span>
              <span class="metric-trend positive">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M18 15L12 9L6 15"/>
                </svg>
                {{ commitTrend }}%
              </span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor">
                <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">OPEN PULLS</span>
              <span class="metric-value">{{ repoStats.openPRs }}</span>
              <span class="metric-trend positive">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M18 15L12 9L6 15"/>
                </svg>
                {{ repoStats.openPRs }}
              </span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">OPEN ISSUES</span>
              <span class="metric-value">{{ repoStats.openIssues }}</span>
              <span class="metric-trend" :class="{ positive: repoStats.openIssues < 10 }">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M6 9L12 15L18 9"/>
                </svg>
                {{ repoStats.openIssues }}
              </span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">CONTRIBUTORS</span>
              <span class="metric-value">{{ repoStats.contributors }}</span>
              <span class="metric-trend positive">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M18 15L12 9L6 15"/>
                </svg>
                +{{ contributorGrowth }}
              </span>
            </div>
          </div>
        </div>

        <!-- Charts Section - ORANGE THEMED -->
        <div class="charts-section">
          <div class="chart-card main-chart">
            <div class="chart-header">
              <div class="chart-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)">
                  <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/>
                  <circle cx="12" cy="16" r="5"/>
                  <path d="M12 11v5"/>
                </svg>
                <h3>COMMIT ACTIVITY (30 DAYS)</h3>
              </div>
              <div class="chart-legend">
                <span class="legend-dot"></span>
                <span>DAILY COMMITS</span>
                <span class="legend-value">PEAK: {{ dailyPeak }}</span>
              </div>
            </div>
            <div class="chart-wrapper">
              <canvas ref="activityChart"></canvas>
            </div>
            <div class="chart-footer">
              <div class="footer-stat">
                <span class="stat-label">TOTAL</span>
                <span class="stat-value">{{ dailyTotal }}</span>
              </div>
              <div class="footer-stat">
                <span class="stat-label">AVERAGE</span>
                <span class="stat-value">{{ dailyAvg }}</span>
              </div>
              <div class="footer-stat">
                <span class="stat-label">TODAY</span>
                <span class="stat-value">{{ dailyCommits[dailyCommits.length - 1] || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="chart-card repo-card">
            <div class="chart-header">
              <div class="chart-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)">
                  <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
                </svg>
                <h3>REPOSITORY STATS</h3>
              </div>
            </div>
            
            <div class="repo-stats-grid">
              <div class="repo-stat-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <div class="stat-info">
                  <span class="stat-label">FILES</span>
                  <span class="stat-value">{{ formatNumber(repoStats.files) }}</span>
                </div>
              </div>
              <div class="repo-stat-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <div class="stat-info">
                  <span class="stat-label">STARS</span>
                  <span class="stat-value">{{ formatNumber(repoStats.stars) }}</span>
                </div>
              </div>
              <div class="repo-stat-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)">
                  <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
                  <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/>
                </svg>
                <div class="stat-info">
                  <span class="stat-label">FORKS</span>
                  <span class="stat-value">{{ formatNumber(repoStats.forks) }}</span>
                </div>
              </div>
              <div class="repo-stat-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)">
                  <circle cx="12" cy="12" r="10"/><path d="M12 22c-2 0-4-4-4-8s2-8 4-8 4 4 4 8-2 8-4 8z"/><path d="M12 22c2 0 4-4 4-8s-2-8-4-8"/>
                </svg>
                <div class="stat-info">
                  <span class="stat-label">WATCHERS</span>
                  <span class="stat-value">{{ formatNumber(repoStats.watchers) }}</span>
                </div>
              </div>
            </div>

            <div class="repo-timeline">
              <div class="timeline-item">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--accent)">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>CREATED {{ formatDate(repoCreated) }}</span>
              </div>
              <div class="timeline-item">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--accent)">
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                </svg>
                <span>LAST COMMIT {{ timeAgo(lastCommitDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Champion Split - TOP CONTRIBUTOR & THIS MONTH -->
        <div class="champion-split">
          <!-- LEFT: TOP CONTRIBUTOR (All Time) -->
          <div class="champion-spotlight left" v-if="topContributor.login">
            <div class="spotlight-bg">
              <div class="bg-orb" v-for="n in 2" :key="n"></div>
            </div>
            <div class="spotlight-content">
              <div class="champion-avatar">
                <img :src="topContributor.avatar_url" :alt="topContributor.login">
                <div class="avatar-ring"></div>
                <div class="avatar-crown">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2">
                    <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"/>
                  </svg>
                </div>
              </div>
              <div class="champion-info">
                <span class="champion-badge">TOP CONTRIBUTOR</span>
                <h3>{{ topContributor.login }}</h3>
                <div class="champion-stats">
                  <div class="stat-chip">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{{ formatNumber(topContributor.contributions) }} COMMITS</span>
                  </div>
                  <div class="stat-chip">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                      <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                    </svg>
                    <span>{{ topContributor.prs }} PULLS</span>
                  </div>
                </div>
              </div>
              <a :href="topContributor.html_url" target="_blank" class="champion-link">
                <span>VIEW</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- RIGHT: THIS MONTH CONTRIBUTOR -->
          <div class="champion-spotlight right" :class="{ 'empty': !thisMonthContributor.login }">
            <div class="spotlight-bg">
              <div class="bg-orb" v-for="n in 2" :key="n"></div>
            </div>
            <div class="spotlight-content">
              <template v-if="thisMonthContributor.login">
                <div class="champion-avatar">
                  <img :src="thisMonthContributor.avatar_url" :alt="thisMonthContributor.login">
                  <div class="avatar-ring"></div>
                  <div class="avatar-crown">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2">
                      <path d="M12 2L14 9H21L16 14L18 21L12 17L6 21L8 14L3 9H10L12 2Z"/>
                    </svg>
                  </div>
                </div>
                <div class="champion-info">
                  <span class="champion-badge">THIS MONTH</span>
                  <h3>{{ thisMonthContributor.login }}</h3>
                  <div class="champion-stats">
                    <div class="stat-chip">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>{{ thisMonthContributor.contributions }} COMMITS</span>
                    </div>
                    <div class="stat-chip">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                      </svg>
                      <span>{{ thisMonthContributor.prs || 0 }} PULLS</span>
                    </div>
                  </div>
                </div>
                <a :href="thisMonthContributor.html_url" target="_blank" class="champion-link">
                  <span>VIEW</span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </template>
              <template v-else>
                <div class="empty-state">
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--accent)" stroke-width="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  </svg>
                  <h3>NO ONE</h3>
                  <p>No contributions this month</p>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Activity Grid -->
        <div class="activity-grid">
          <!-- Recent Commits Card -->
          <div class="activity-card">
            <div class="card-header">
              <div class="header-left">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h3>RECENT COMMITS</h3>
              </div>
              <span class="card-badge">{{ recentCommits.length }}</span>
            </div>
            <div class="card-feed">
              <div v-for="(commit, index) in recentCommits.slice(0,5)" :key="commit.id" 
                   class="feed-item" 
                   @click="openCommit(commit.url)"
                   :style="{ animationDelay: index * 0.1 + 's' }">
                <img :src="`https://github.com/${commit.author}.png`" :alt="commit.author" class="item-avatar">
                <div class="item-content">
                  <span class="item-title">{{ commit.message }}</span>
                  <span class="item-meta">
                    <span>{{ commit.author }}</span>
                    <span class="meta-dot">•</span>
                    <span>{{ timeAgo(commit.date) }}</span>
                  </span>
                </div>
                <span class="item-icon" v-html="commit.icon"></span>
              </div>
            </div>
          </div>

          <!-- Top Contributors Card -->
          <div class="activity-card">
            <div class="card-header">
              <div class="header-left">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent)">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <h3>TOP CONTRIBUTORS</h3>
              </div>
              <span class="card-badge">TOP 10</span>
            </div>
            <div class="card-feed">
              <div v-for="(c, index) in topContributors.slice(0,5)" :key="c.login" 
                   class="feed-item" 
                   @click="openProfile(c.login)"
                   :style="{ animationDelay: index * 0.1 + 's' }">
                <span class="item-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                <img :src="c.avatar_url" :alt="c.login" class="item-avatar">
                <div class="item-content">
                  <span class="item-title">{{ c.login }}</span>
                  <span class="item-meta">
                    <span>{{ formatNumber(c.contributions) }} COMMITS</span>
                  </span>
                </div>
                <div class="item-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (c.contributions / topContributors[0].contributions * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Issues & PRs Grid -->
        <div class="battle-grid">
          <div class="battle-card issues">
            <div class="battle-header">
              <div class="battle-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                </svg>
                <span>ISSUES</span>
              </div>
              <span class="battle-count">{{ repoStats.openIssues }}</span>
            </div>
            <div class="battle-feed">
              <div v-for="issue in recentIssues.slice(0,3)" :key="issue.id" 
                   class="battle-item" @click="openIssue(issue.url)">
                <img :src="`https://github.com/${issue.author}.png`" :alt="issue.author">
                <div class="battle-content">
                  <span class="battle-title">#{{ issue.number }} {{ truncate(issue.title, 30) }}</span>
                  <span class="battle-meta">
                    <span>{{ issue.author }}</span>
                    <span>•</span>
                    <span>{{ timeAgo(issue.date) }}</span>
                  </span>
                </div>
              </div>
              <a :href="`https://github.com/Wildfiire/docs/issues`" target="_blank" class="battle-link">
                <span>VIEW ALL ISSUES</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="battle-card prs">
            <div class="battle-header">
              <div class="battle-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                </svg>
                <span>PULL REQUESTS</span>
              </div>
              <span class="battle-count">{{ repoStats.openPRs }}</span>
            </div>
            <div class="battle-feed">
              <div v-for="pr in recentPRs.slice(0,3)" :key="pr.id" 
                   class="battle-item" @click="openPR(pr.url)">
                <img :src="`https://github.com/${pr.author}.png`" :alt="pr.author">
                <div class="battle-content">
                  <span class="battle-title">#{{ pr.number }} {{ truncate(pr.title, 30) }}</span>
                  <span class="battle-meta">
                    <span>{{ pr.author }}</span>
                    <span>•</span>
                    <span>{{ timeAgo(pr.date) }}</span>
                  </span>
                </div>
              </div>
              <a :href="`https://github.com/Wildfiire/docs/pulls`" target="_blank" class="battle-link">
                <span>VIEW ALL PULLS</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- FILES VIEW -->
      <div v-else-if="currentView === 'files'" class="files-view">
        <div class="files-header">
          <h2>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            FILE EXPLORER
          </h2>
          <div class="file-search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/><path d="M21 21L17 17"/>
            </svg>
            <input type="text" v-model="fileSearch" placeholder="SEARCH FILES...">
            <button v-if="fileSearch" class="search-clear" @click="fileSearch = ''">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="file-layout">
          <div class="file-tree-panel">
            <div class="tree-header">
              <span>ROOT</span>
              <span class="file-count">{{ repoStats.files }} FILES</span>
            </div>
            <div class="file-tree">
              <FileTreeItem 
                v-for="item in filteredFileTree" 
                :key="item.path"
                :item="item"
                :file-search="fileSearch"
                @toggle="toggleFolder"
                @select="selectFile"
                @edit="editFile"
              />
            </div>
          </div>

          <div class="file-preview" v-if="selectedFile">
            <div class="preview-header">
              <div class="preview-path">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--accent)">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <span>{{ selectedFile.path }}</span>
              </div>
              <button class="preview-edit" @click="editFile(selectedFile)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                  <path d="M17 3L21 7L7 21H3V17L17 3Z"/>
                </svg>
                <span>EDIT</span>
              </button>
            </div>
            <div class="preview-content">
              <div class="file-meta">
                <span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  SIZE: {{ formatFileSize(selectedFile.size) }}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
                  </svg>
                  TYPE: {{ getFileType(selectedFile.name) }}
                </span>
              </div>
              <pre><code>{{ fileContent || 'LOADING...' }}</code></pre>
            </div>
          </div>

          <div v-else class="file-preview empty">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <h3>SELECT A FILE</h3>
            <p>Click on any file to preview its contents</p>
          </div>
        </div>
      </div>

      <!-- CONTRIBUTORS VIEW -->
      <div v-else-if="currentView === 'contributors'" class="contributors-view">
        <div class="contributors-header">
          <div class="header-stat-card">
            <span class="stat-number">{{ repoStats.contributors }}</span>
            <span class="stat-label">TOTAL CONTRIBUTORS</span>
          </div>
          <div class="header-stat-card">
            <span class="stat-number">{{ formatNumber(repoStats.totalCommits) }}</span>
            <span class="stat-label">TOTAL COMMITS</span>
          </div>
          <div class="header-stat-card">
            <span class="stat-number">{{ avgCommits }}</span>
            <span class="stat-label">AVERAGE COMMITS</span>
          </div>
        </div>

        <div class="contributors-table-wrapper">
          <table class="contributors-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>CONTRIBUTOR</th>
                <th>COMMITS</th>
                <th>PULLS</th>
                <th>IMPACT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, index) in allContributorsData" :key="c.login" 
                  @click="openProfile(c.login)"
                  class="table-row">
                <td class="rank-cell">#{{ index + 1 }}</td>
                <td class="user-cell">
                  <img :src="c.avatar_url" :alt="c.login">
                  <span>{{ c.login }}</span>
                </td>
                <td class="commits-cell">{{ formatNumber(c.commits) }}</td>
                <td class="prs-cell">{{ c.prs }}</td>
                <td class="impact-cell">
                  <div class="impact-bar">
                    <div class="impact-fill" :style="{ width: c.impact + '%' }"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- AUDIT LOGS VIEW -->
      <div v-else-if="currentView === 'audit'" class="audit-view">
        <div class="audit-header">
          <div class="audit-title">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <h2>AUDIT LOGS</h2>
          </div>
          <div class="audit-filters">
            <button class="filter-btn" :class="{ active: auditFilter === 'all' }" @click="auditFilter = 'all'">ALL</button>
            <button class="filter-btn" :class="{ active: auditFilter === 'commit' }" @click="auditFilter = 'commit'">COMMITS</button>
            <button class="filter-btn" :class="{ active: auditFilter === 'pr' }" @click="auditFilter = 'pr'">PULLS</button>
            <button class="filter-btn" :class="{ active: auditFilter === 'issue' }" @click="auditFilter = 'issue'">ISSUES</button>
          </div>
          <span class="audit-count">{{ filteredAuditLogs.length }} EVENTS</span>
        </div>

        <div class="audit-timeline">
          <div v-for="(event, index) in filteredAuditLogs.slice(0, 50)" :key="event.id" 
               class="timeline-event" 
               :class="event.type"
               @click="openAuditEvent(event)"
               :style="{ animationDelay: index * 0.05 + 's' }">
            
            <div class="event-marker">
              <div class="marker-dot"></div>
              <div class="marker-line" v-if="index < filteredAuditLogs.length - 1"></div>
            </div>

            <div class="event-card">
              <div class="event-header">
                <div class="event-badge" :class="event.type">
                  <svg v-if="event.type === 'commit'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <svg v-else-if="event.type === 'pr'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                    <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                  </svg>
                  <span>{{ event.type.toUpperCase() }}</span>
                </div>
                <span class="event-time">{{ formatDateTime(event.timestamp) }}</span>
              </div>
              
              <div class="event-body">
                <span class="event-message">{{ event.message }}</span>
                <div class="event-meta">
                  <span class="event-author">@{{ event.author }}</span>
                  <span v-if="event.repo" class="event-repo">{{ event.repo }}</span>
                </div>
              </div>

              <div class="event-footer">
                <span class="event-hash" v-if="event.hash">{{ event.hash.substring(0, 7) }}</span>
                <span class="event-branch" v-if="event.branch">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor">
                    <path d="M6 3v12"/><path d="M18 9c0 1.5-1.5 3-4 3s-4-1.5-4-3 1.5-3 4-3 4 1.5 4 3z"/>
                    <circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  </svg>
                  {{ event.branch }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ANALYTICS VIEW -->
      <div v-else-if="currentView === 'analytics'" class="analytics-view">
        <div class="analytics-header">
          <div class="analytics-title">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)">
              <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/>
              <circle cx="12" cy="16" r="5"/>
              <path d="M12 11v5"/>
              <path d="M9 8V6"/>
              <path d="M15 8V6"/>
            </svg>
            <h2>ANALYTICS DASHBOARD</h2>
          </div>
          <div class="analytics-period">
            <button class="period-btn" :class="{ active: analyticsPeriod === 'weeks' }" @click="analyticsPeriod = 'weeks'">WEEKS</button>
            <button class="period-btn" :class="{ active: analyticsPeriod === 'months' }" @click="analyticsPeriod = 'months'">MONTHS</button>
          </div>
        </div>

        <div class="analytics-grid">
          <!-- Weekly/Monthly Chart -->
          <div class="analytics-card main-chart">
            <div class="card-header">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                  <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/>
                  <circle cx="12" cy="16" r="5"/>
                </svg>
                {{ analyticsPeriod === 'weeks' ? 'WEEKLY' : 'MONTHLY' }} COMMIT ACTIVITY
              </h3>
              <div class="chart-stats">
                <span class="stat-total">TOTAL: {{ weeklyTotal }}</span>
                <span class="stat-avg">AVG: {{ weeklyAverage }}</span>
              </div>
            </div>
            <div class="chart-wrapper">
              <canvas ref="weeklyChart"></canvas>
            </div>
          </div>

          <!-- Language Distribution -->
          <div class="analytics-card">
            <div class="card-header">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
                LANGUAGE DISTRIBUTION
              </h3>
            </div>
            <div class="language-list">
              <div v-for="lang in sortedLanguages" :key="lang.name" class="language-item">
                <div class="lang-info">
                  <span class="lang-dot" :style="{ background: getLanguageColor(lang.name) }"></span>
                  <span class="lang-name">{{ lang.name }}</span>
                  <span class="lang-percent">{{ lang.percentage.toFixed(1) }}%</span>
                </div>
                <div class="lang-bar">
                  <div class="lang-fill" :style="{ width: lang.percentage + '%', background: getLanguageColor(lang.name) }"></div>
                </div>
                <span class="lang-bytes">{{ formatNumber(lang.bytes) }} B</span>
              </div>
            </div>
          </div>

          <!-- PR Analytics -->
          <div class="analytics-card">
            <div class="card-header">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                </svg>
                PULL REQUEST METRICS
              </h3>
            </div>
            <div class="pr-metrics">
              <div class="pr-metric">
                <span class="metric-label">OPEN PRs</span>
                <span class="metric-value">{{ repoStats.openPRs }}</span>
              </div>
              <div class="pr-metric">
                <span class="metric-label">MERGED (30D)</span>
                <span class="metric-value">{{ mergedPRs30d }}</span>
              </div>
              <div class="pr-metric">
                <span class="metric-label">AVG TIME TO MERGE</span>
                <span class="metric-value">{{ avgMergeTime }}</span>
              </div>
              <div class="pr-metric">
                <span class="metric-label">PRs THIS MONTH</span>
                <span class="metric-value">{{ monthlyPRs }}</span>
              </div>
            </div>
          </div>

          <!-- Contribution Heatmap -->
          <div class="analytics-card span-2">
            <div class="card-header">
              <h3>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
                </svg>
                CONTRIBUTION ACTIVITY
              </h3>
            </div>
            <div class="heatmap">
              <div v-for="week in 52" :key="week" class="heatmap-week">
                <div v-for="day in 7" :key="day" 
                     class="heatmap-cell"
                     :style="{ opacity: getHeatmapIntensity(week, day) }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

import FileTreeItem from './FileTreeItem.vue'

export default {
  name: 'WildfireDocs',
  components: {
    FileTreeItem
  },
  
  data() {
    return {
      sidebarCollapsed: window.innerWidth <= 900,
      currentView: 'dashboard',
      isLightTheme: false,
      isSyncing: false,
      isLoading: true,
      error: null,
      lastUpdateTime: '—',
      fileSearch: '',
      isScrolled: false,
      auditFilter: 'all',
      analyticsPeriod: 'weeks',
      
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
      
      repoCreated: null,
      lastCommitDate: null,
      
      topContributor: {
        login: '',
        avatar_url: '',
        html_url: '',
        contributions: 0,
        prs: 0
      },
      
      thisMonthContributor: {
        login: '',
        avatar_url: '',
        html_url: '',
        contributions: 0,
        prs: 0
      },
      
      commitTrend: 0,
      contributorGrowth: 0,
      
      recentCommits: [],
      topContributors: [],
      recentIssues: [],
      recentPRs: [],
      allContributorsData: [],
      fileTree: [],
      auditLog: [],
      
      dailyCommits: [],
      weeklyCommits: [],
      monthlyCommits: [],
      weeklyLabels: [],
      monthlyLabels: [],
      
      languageStats: [],
      
      selectedFile: null,
      fileContent: '',
      
      toasts: [],
      
      charts: {
        activity: null,
        weekly: null
      },
      
      navItems: [
        { 
          id: 'dashboard', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
          label: 'DASHBOARD' 
        },
        { 
          id: 'files', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
          label: 'FILES' 
        },
        { 
          id: 'contributors', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
          label: 'CONTRIBUTORS',
          badge: 'LIVE'
        },
        { 
          id: 'audit', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
          label: 'AUDIT',
          badge: 'LIVE'
        },
        { 
          id: 'analytics', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/></svg>',
          label: 'ANALYTICS' 
        },
        { 
          id: 'home', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10Z"/><path d="M9 15H15V21H9V15Z"/></svg>',
          label: 'HOME' 
        }
      ]
    }
  },

  computed: {
    currentViewTitle() {
      return this.navItems.find(i => i.id === this.currentView)?.label || 'DASHBOARD'
    },
    
    avgCommits() {
      return this.repoStats.contributors 
        ? Math.round(this.repoStats.totalCommits / this.repoStats.contributors) 
        : 0
    },
    
    filteredFileTree() {
      if (!this.fileSearch) return this.fileTree
      const searchLower = this.fileSearch.toLowerCase()
      const filterItems = (items) => {
        return items.filter(item => {
          const matches = item.name.toLowerCase().includes(searchLower)
          if (item.type === 'dir' && item.children) {
            item.children = filterItems(item.children)
            return item.children.length > 0 || matches
          }
          return matches
        })
      }
      return filterItems([...this.fileTree])
    },
    
    dailyTotal() {
      return this.dailyCommits.reduce((a, b) => a + b, 0)
    },
    
    dailyAvg() {
      return (this.dailyTotal / 30).toFixed(1)
    },
    
    dailyPeak() {
      return Math.max(...this.dailyCommits, 0)
    },
    
    weeklyTotal() {
      return this.weeklyCommits.reduce((a, b) => a + b, 0)
    },
    
    weeklyAverage() {
      return this.weeklyCommits.length 
        ? Math.round(this.weeklyTotal / this.weeklyCommits.length) 
        : 0
    },
    
    filteredAuditLogs() {
      if (this.auditFilter === 'all') return this.auditLog
      return this.auditLog.filter(log => log.type === this.auditFilter)
    },
    
    sortedLanguages() {
      return [...this.languageStats].sort((a, b) => b.percentage - a.percentage)
    },
    
    mergedPRs30d() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return this.auditLog.filter(e => 
        e.type === 'pr' && e.merged && new Date(e.timestamp) > thirtyDaysAgo
      ).length
    },
    
    avgMergeTime() {
      return '2.4h'
    },
    
    monthlyPRs() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return this.auditLog.filter(e => 
        e.type === 'pr' && new Date(e.timestamp) > thirtyDaysAgo
      ).length
    }
  },

  watch: {
    currentView: {
      immediate: true,
      handler(newVal) {
        if (newVal === 'dashboard') {
          this.$nextTick(() => this.initActivityChart())
        }
        if (newVal === 'analytics') {
          this.$nextTick(() => this.initWeeklyChart())
        }
      }
    },
    isLightTheme() {
      this.$nextTick(() => {
        if (this.currentView === 'dashboard') this.initActivityChart()
        if (this.currentView === 'analytics') this.initWeeklyChart()
      })
    },
    analyticsPeriod() {
      if (this.currentView === 'analytics') {
        this.$nextTick(() => this.initWeeklyChart())
      }
    }
  },

  async mounted() {
    this.lastUpdateTime = new Date().toLocaleTimeString()
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.handleScroll)
    
    await this.refreshAllData()
    setInterval(() => this.refreshAllData(), 30000)
  },

  beforeUnmount() {
    if (this.charts.activity) this.charts.activity.destroy()
    if (this.charts.weekly) this.charts.weekly.destroy()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    toggleTheme() {
      this.isLightTheme = !this.isLightTheme
      this.showToast(`Switched to ${this.isLightTheme ? 'Light' : 'Dark'} Mode`, 'success')
    },

    handleResize() {
      this.sidebarCollapsed = window.innerWidth <= 900
    },

    handleScroll() {
      this.isScrolled = window.scrollY > 20
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

    getToken() {
      return this.$githubToken || window.__GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN
    },

    openAuditEvent(event) {
      if (event.url) window.open(event.url, '_blank')
    },

    getHeatmapIntensity(week, day) {
      return Math.random() * 0.5 + 0.2
    },

async fetchContributorsFromCommits() {
  const token = this.getToken()
  if (!token) {
    console.error('No GitHub token found')
    return
  }
  
  const owner = 'Wildfiire'
  const repo = 'docs'
  const headers = { 
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }
  
  try {
    console.log(`Fetching contributors for ${owner}/${repo}...`)
    
    let allCommits = []
    let page = 1
    let hasMore = true
    let uniqueAuthors = new Map() // Folosim Map pentru a păstra datele complete
    
    // Colectăm toate commit-urile (maxim 10 pagini = 1000 commit-uri)
    while (hasMore && page <= 10) {
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}&_=${Date.now()}`
      console.log(`Fetching page ${page}...`)
      
      const res = await fetch(url, { headers })
      
      if (res.ok) {
        const commits = await res.json()
        
        if (commits.length === 0) {
          hasMore = false
          console.log(`No more commits after page ${page-1}`)
        } else {
          allCommits = [...allCommits, ...commits]
          console.log(`Page ${page}: +${commits.length} commits (total: ${allCommits.length})`)
          page++
        }
      } else if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
        // Rate limit exceeded
        const resetTime = res.headers.get('X-RateLimit-Reset')
        const resetDate = new Date(resetTime * 1000)
        console.error(`GitHub API rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`)
        hasMore = false
        this.showToast('Rate limit exceeded. Try again later.', 'error')
      } else {
        console.error(`Error fetching commits: ${res.status} ${res.statusText}`)
        hasMore = false
      }
    }
    
    console.log(`Total commits fetched: ${allCommits.length}`)
    
    // Procesăm fiecare commit și extragem autorii UNICI
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    // Map pentru toți contributorii (all-time)
    const allTimeMap = new Map()
    // Map pentru contributorii din ultimele 30 zile
    const thisMonthMap = new Map()
    
    allCommits.forEach((commit, index) => {
      // Extragem informațiile autorului din commit
      let authorInfo = null
      let authorLogin = null
      let authorAvatar = null
      let authorUrl = null
      let authorName = null
      let commitDate = new Date(commit.commit.author.date)
      
      // Prioritate 1: author (cel care a făcut commit-ul)
      if (commit.author && commit.author.login) {
        authorLogin = commit.author.login
        authorAvatar = commit.author.avatar_url
        authorUrl = commit.author.html_url
        authorName = commit.author.login
      }
      // Prioritate 2: committer (cel care a adăugat commit-ul în repo)
      else if (commit.committer && commit.committer.login) {
        authorLogin = commit.committer.login
        authorAvatar = commit.committer.avatar_url
        authorUrl = commit.committer.html_url
        authorName = commit.committer.login
      }
      // Prioritate 3: fallback la datele din commit (fără cont GitHub)
      else if (commit.commit && commit.commit.author) {
        authorName = commit.commit.author.name
        // Creăm un login din nume (lowercase, fără spații)
        authorLogin = authorName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        if (authorLogin.length === 0) {
          authorLogin = `user-${index}`
        }
        authorAvatar = `https://github.com/${authorLogin}.png`
        authorUrl = `https://github.com/${authorLogin}`
      }
      
      if (authorLogin) {
        // ALL-TIME counting
        if (!allTimeMap.has(authorLogin)) {
          allTimeMap.set(authorLogin, {
            login: authorLogin,
            name: authorName || authorLogin,
            avatar_url: authorAvatar,
            html_url: authorUrl,
            contributions: 1
          })
        } else {
          allTimeMap.get(authorLogin).contributions++
        }
        
        // THIS MONTH counting (ultimele 30 zile)
        if (commitDate > thirtyDaysAgo) {
          if (!thisMonthMap.has(authorLogin)) {
            thisMonthMap.set(authorLogin, {
              login: authorLogin,
              name: authorName || authorLogin,
              avatar_url: authorAvatar,
              html_url: authorUrl,
              contributions: 1
            })
          } else {
            thisMonthMap.get(authorLogin).contributions++
          }
        }
      }
    })
    
    // Convertim Map-urile în array-uri
    const allTimeContributors = Array.from(allTimeMap.values())
    const thisMonthContributors = Array.from(thisMonthMap.values())
    
    // Sortăm descrescător după contribuții
    allTimeContributors.sort((a, b) => b.contributions - a.contributions)
    thisMonthContributors.sort((a, b) => b.contributions - a.contributions)
    
    // Actualizăm stats
    this.repoStats.contributors = allTimeContributors.length
    this.repoStats.totalCommits = allCommits.length
    
    console.log(`Found ${allTimeContributors.length} unique contributors (all-time)`)
    console.log(`Found ${thisMonthContributors.length} contributors in last 30 days`)
    
    // Procesăm toți contributorii pentru tabele
    this.processContributorsData(allTimeContributors)
    
    // Setăm TOP CONTRIBUTOR (all-time)
    if (allTimeContributors.length > 0) {
      const top = allTimeContributors[0]
      this.topContributor = {
        login: top.login,
        avatar_url: top.avatar_url,
        html_url: top.html_url,
        contributions: top.contributions,
        prs: Math.floor(top.contributions * 0.15) // Estimare PR-uri (15% din commit-uri)
      }
      console.log(`Top contributor (all-time): ${top.login} with ${top.contributions} commits`)
    }
    
    // Setăm THIS MONTH CONTRIBUTOR
    if (thisMonthContributors.length > 0) {
      const topMonth = thisMonthContributors[0]
      this.thisMonthContributor = {
        login: topMonth.login,
        avatar_url: topMonth.avatar_url,
        html_url: topMonth.html_url,
        contributions: topMonth.contributions,
        prs: Math.floor(topMonth.contributions * 0.15)
      }
      console.log(`Top contributor (this month): ${topMonth.login} with ${topMonth.contributions} commits`)
    } else {
      this.thisMonthContributor = { 
        login: '', 
        avatar_url: '', 
        html_url: '', 
        contributions: 0, 
        prs: 0 
      }
      console.log('No contributors in the last 30 days')
    }
    
    // Pentru topContributors (lista scurtă de pe dashboard)
    this.topContributors = allTimeContributors.slice(0, 10).map(c => ({
      login: c.login,
      avatar_url: c.avatar_url,
      contributions: c.contributions,
      html_url: c.html_url
    }))
    
  } catch (e) {
    console.error('Error in fetchContributorsFromCommits:', e)
    this.showToast('Error fetching contributors data', 'error')
  }
},

    processContributorsData(allContributors) {
      if (!allContributors || allContributors.length === 0) return
      
      const uniqueContributors = Array.from(
        new Map(allContributors.map(c => [c.login, c])).values()
      )
      
      const sorted = [...uniqueContributors].sort((a, b) => b.contributions - a.contributions)
      
      this.topContributors = sorted.slice(0, 10).map(c => ({
        login: c.login,
        avatar_url: c.avatar_url,
        contributions: c.contributions,
        html_url: c.html_url
      }))
      
      if (sorted.length > 0) {
        this.topContributor = {
          login: sorted[0].login,
          avatar_url: sorted[0].avatar_url,
          html_url: sorted[0].html_url,
          contributions: sorted[0].contributions,
          prs: Math.floor(sorted[0].contributions * 0.3)
        }
      }

      const maxCommits = Math.max(...sorted.map(c => c.contributions))
      this.allContributorsData = sorted.map(c => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        commits: c.contributions,
        prs: Math.floor(c.contributions * 0.3),
        impact: maxCommits ? (c.contributions / maxCommits) * 100 : 0
      }))
    },

    async fetchAllGitHubData(token) {
      if (!token) {
        this.error = 'GitHub token required'
        this.isLoading = false
        return
      }
      
      const owner = 'Wildfiire'
      const repo = 'docs'
      const baseUrl = `https://api.github.com/repos/${owner}/${repo}`
      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }

      const timestamp = Date.now()

      try {
        // Fetch repo info
        const repoRes = await fetch(`${baseUrl}?_=${timestamp}`, { headers })
        if (repoRes.ok) {
          const repoData = await repoRes.json()
          this.repoStats.stars = repoData.stargazers_count || 0
          this.repoStats.forks = repoData.forks_count || 0
          this.repoStats.watchers = repoData.watchers_count || 0
          this.repoCreated = repoData.created_at
        }

        // Fetch languages
        const langRes = await fetch(`${baseUrl}/languages?_=${timestamp}`, { headers })
        if (langRes.ok) {
          const langData = await langRes.json()
          const total = Object.values(langData).reduce((a, b) => a + b, 0)
          this.languageStats = Object.entries(langData).map(([name, bytes]) => ({
            name,
            bytes,
            percentage: total ? (bytes / total) * 100 : 0
          }))
        }

        // Fetch all commits
        let allCommits = []
        let page = 1
        let hasMore = true
        
        while (hasMore && page <= 10) {
          const commitsRes = await fetch(`${baseUrl}/commits?per_page=100&page=${page}&_=${timestamp}`, { headers })
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
        this.lastCommitDate = allCommits[0]?.commit.author.date

        // Process daily commits
        const daily = {}
        const weekly = {}
        const monthly = {}
        const now = new Date()
        
        allCommits.forEach(commit => {
          const date = new Date(commit.commit.author.date)
          const dayKey = date.toISOString().split('T')[0]
          if ((now - date) / (1000 * 60 * 60 * 24) <= 30) {
            daily[dayKey] = (daily[dayKey] || 0) + 1
          }
          
          const weekKey = this.getWeekNumber(date)
          const year = date.getFullYear()
          weekly[`${year}-W${weekKey}`] = (weekly[`${year}-W${weekKey}`] || 0) + 1
          
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
          monthly[monthKey] = (monthly[monthKey] || 0) + 1
        })

        // Daily commits
        const last30Days = []
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          const dayKey = date.toISOString().split('T')[0]
          last30Days.push(daily[dayKey] || 0)
        }
        this.dailyCommits = last30Days

        // Weekly commits
        const weeklyEntries = Object.entries(weekly).sort().slice(-12)
        this.weeklyCommits = weeklyEntries.map(([_, count]) => count)
        this.weeklyLabels = weeklyEntries.map(([week]) => week)

        // Monthly commits
        const monthlyEntries = Object.entries(monthly).sort().slice(-6)
        this.monthlyCommits = monthlyEntries.map(([_, count]) => count)
        this.monthlyLabels = monthlyEntries.map(([month]) => {
          const [y, m] = month.split('-')
          return `${new Date(y, m-1).toLocaleString('default', { month: 'short' })} ${y}`
        })

        // Recent commits with icons
        this.recentCommits = allCommits.slice(0, 10).map(commit => ({
          id: commit.sha.substring(0, 7),
          message: commit.commit.message.split('\n')[0],
          icon: this.getCommitIcon(commit.commit.message),
          author: commit.author?.login || commit.commit.author.name,
          date: commit.commit.author.date,
          url: commit.html_url
        }))

        // Build audit log
        this.auditLog = []
        allCommits.slice(0, 100).forEach(commit => {
          this.auditLog.push({
            id: `commit-${commit.sha}`,
            type: 'commit',
            timestamp: commit.commit.author.date,
            message: commit.commit.message.split('\n')[0],
            author: commit.author?.login || commit.commit.author.name,
            url: commit.html_url,
            hash: commit.sha,
            repo: 'docs'
          })
        })

        // Fetch contributors
        await this.fetchContributorsFromCommits()

        // Fetch PRs
        const prsRes = await fetch(`${baseUrl}/pulls?state=open&sort=updated&direction=desc&per_page=10&_=${timestamp}`, { headers })
        if (prsRes.ok) {
          const prs = await prsRes.json()
          this.recentPRs = prs.map(pr => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            author: pr.user?.login,
            date: pr.updated_at,
            url: pr.html_url,
            branch: pr.head?.ref
          }))
          this.repoStats.openPRs = prs.length

          prs.forEach(pr => {
            this.auditLog.push({
              id: `pr-${pr.id}`,
              type: 'pr',
              timestamp: pr.created_at,
              message: `PR #${pr.number}: ${pr.title}`,
              author: pr.user?.login,
              url: pr.html_url,
              branch: pr.head?.ref,
              repo: 'docs'
            })
          })
        }

        // Fetch issues
        const issuesRes = await fetch(`${baseUrl}/issues?state=open&sort=updated&direction=desc&per_page=10&_=${timestamp}`, { headers })
        if (issuesRes.ok) {
          const issues = await issuesRes.json()
          const realIssues = issues.filter(issue => !issue.pull_request)
          this.recentIssues = realIssues.map(issue => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            author: issue.user?.login,
            date: issue.updated_at,
            url: issue.html_url
          }))
          this.repoStats.openIssues = realIssues.length

          realIssues.forEach(issue => {
            this.auditLog.push({
              id: `issue-${issue.id}`,
              type: 'issue',
              timestamp: issue.created_at,
              message: `Issue #${issue.number}: ${issue.title}`,
              author: issue.user?.login,
              url: issue.html_url,
              repo: 'docs'
            })
          })
        }

        // Fetch file tree
        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1&_=${timestamp}`,
          { headers }
        )
        if (treeRes.ok) {
          const treeData = await treeRes.json()
          this.repoStats.files = treeData.tree?.filter(item => item.type === 'blob').length || 0
          this.fileTree = this.buildFileTree(treeData.tree || [])
        }

        // Sort audit log
        this.auditLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        // Calculate trends
        this.calculateTrends(allCommits)
        
        this.lastUpdateTime = new Date().toLocaleTimeString()
        this.showToast('Data synchronized from GitHub', 'success')

        // Initialize charts
        this.$nextTick(() => {
          if (this.currentView === 'dashboard') this.initActivityChart()
          if (this.currentView === 'analytics') this.initWeeklyChart()
        })

      } catch (error) {
        console.error('Error fetching GitHub data:', error)
        this.error = error.message
        this.showToast('Error syncing data', 'error')
      } finally {
        this.isLoading = false
      }
    },

    calculateTrends(allCommits) {
      const now = new Date()
      const monthAgo = new Date(now)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      
      const commitsLastMonth = allCommits.filter(c => new Date(c.commit.author.date) > monthAgo).length
      const commitsPrevMonth = allCommits.filter(c => {
        const date = new Date(c.commit.author.date)
        return date <= monthAgo && date > new Date(monthAgo.setMonth(monthAgo.getMonth() - 1))
      }).length

      this.commitTrend = commitsPrevMonth ? Math.round((commitsLastMonth - commitsPrevMonth) / commitsPrevMonth * 100) : 0
      this.contributorGrowth = Math.floor(Math.random() * 5) + 1
    },

    buildFileTree(items) {
      const root = []
      items.forEach(item => {
        const parts = item.path.split('/')
        let current = root
        parts.forEach((part, i) => {
          const isFile = i === parts.length - 1 && item.type === 'blob'
          let existing = current.find(n => n.name === part)
          if (!existing) {
            existing = {
              name: part,
              type: isFile ? 'file' : 'dir',
              path: item.path,
              expanded: false,
              children: isFile ? null : [],
              sha: item.sha,
              size: item.size
            }
            current.push(existing)
          }
          if (!isFile) current = existing.children
        })
      })
      
      const sortItems = (items) => {
        items.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name)
          return a.type === 'dir' ? -1 : 1
        })
        items.forEach(i => {
          if (i.type === 'dir' && i.children) sortItems(i.children)
        })
      }
      
      sortItems(root)
      return root
    },

    toggleFolder(item) {
      if (item.type === 'dir') {
        item.expanded = !item.expanded
        this.$forceUpdate()
      } else {
        this.selectFile(item)
      }
    },

    async selectFile(file) {
      this.selectedFile = file
      const token = this.getToken()
      if (!token) return
      
      try {
        const res = await fetch(
          `https://api.github.com/repos/Wildfiire/docs/contents/${file.path}?_=${Date.now()}`,
          { headers: { 'Authorization': `token ${token}` } }
        )
        if (res.ok) {
          const data = await res.json()
          this.fileContent = atob(data.content)
        }
      } catch (e) {
        this.fileContent = '// Error loading file'
      }
    },

    editFile(file) {
      window.open(`https://github.com/Wildfiire/docs/edit/main/${file.path}`, '_blank')
    },

    getFileType(filename) {
      const ext = filename.split('.').pop().toLowerCase()
      const types = {
        js: 'JS',
        ts: 'TS',
        vue: 'VUE',
        html: 'HTML',
        css: 'CSS',
        md: 'MD',
        json: 'JSON'
      }
      return types[ext] || 'TXT'
    },

    getCommitIcon(message) {
      const msg = message.toLowerCase()
      if (msg.includes('fix') || msg.includes('bug')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      }
      if (msg.includes('add')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
      }
      if (msg.includes('update')) {
        return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
      }
      return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
    },

    getLanguageColor(lang) {
      const colors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'Vue': '#42b883',
        'CSS': '#264de4',
        'HTML': '#e34c26',
        'Markdown': '#083fa1',
        'JSON': '#292929'
      }
      return colors[lang] || 'var(--accent)'
    },

    getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      const dayNum = d.getUTCDay() || 7
      d.setUTCDate(d.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    },

    initActivityChart() {
      const ctx = this.$refs.activityChart?.getContext('2d')
      if (!ctx || !this.dailyCommits.length) return

      const labels = []
      const now = new Date()
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }

      if (this.charts.activity) this.charts.activity.destroy()

      const textColor = this.isLightTheme ? '#666' : '#8a8a95'
      const gridColor = this.isLightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)'
      
      this.charts.activity = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: this.dailyCommits,
            backgroundColor: (context) => {
              const value = context.dataset.data[context.dataIndex]
              return value > 0 ? '#ff4500' : (this.isLightTheme ? '#ddd' : '#2a2a30')
            },
            borderColor: '#ff4500',
            borderWidth: (context) => {
              const value = context.dataset.data[context.dataIndex]
              return value > 0 ? 1 : 0
            },
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            hoverBackgroundColor: '#ff5722'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: this.isLightTheme ? '#fff' : '#1a1a22',
              titleColor: this.isLightTheme ? '#333' : '#fff',
              bodyColor: this.isLightTheme ? '#666' : '#e0e0e0',
              borderColor: '#ff4500',
              borderWidth: 2,
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                title: (context) => context[0].label,
                label: (context) => `Commits: ${context.raw}`
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              grid: { color: gridColor, drawBorder: false },
              ticks: { 
                stepSize: 2,
                color: textColor,
                font: { size: 9, weight: '500' },
                padding: 8
              }
            },
            x: { 
              grid: { display: false },
              ticks: { 
                maxRotation: 45, 
                minRotation: 45,
                color: textColor,
                maxTicksLimit: 8,
                font: { size: 9, weight: '500' },
                padding: 5
              }
            }
          }
        }
      })
    },

    initWeeklyChart() {
      const ctx = this.$refs.weeklyChart?.getContext('2d')
      if (!ctx) return

      const data = this.analyticsPeriod === 'weeks' ? this.weeklyCommits : this.monthlyCommits
      const labels = this.analyticsPeriod === 'weeks' ? this.weeklyLabels : this.monthlyLabels

      if (this.charts.weekly) this.charts.weekly.destroy()

      const textColor = this.isLightTheme ? '#666' : '#8a8a95'
      const gridColor = this.isLightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)'

      this.charts.weekly = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            borderColor: '#ff4500',
            backgroundColor: 'rgba(255,69,0,0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#ff4500',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: this.isLightTheme ? '#fff' : '#1a1a22',
              titleColor: this.isLightTheme ? '#333' : '#fff',
              bodyColor: this.isLightTheme ? '#666' : '#e0e0e0',
              borderColor: '#ff4500',
              borderWidth: 2,
              padding: 12,
              cornerRadius: 8
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              grid: { color: gridColor },
              ticks: { 
                color: textColor,
                font: { size: 9 }
              }
            },
            x: { 
              grid: { display: false },
              ticks: { 
                color: textColor,
                font: { size: 9 },
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      })
    },

    async refreshAllData() {
      const token = this.getToken()
      if (!token) {
        this.error = 'GitHub token required'
        this.isLoading = false
        return
      }
      
      this.isSyncing = true
      await this.fetchAllGitHubData(token)
      this.isSyncing = false
    },

    formatNumber(num) {
      if (!num && num !== 0) return '0'
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    },

    formatFileSize(bytes) {
      if (!bytes) return '0 B'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    },

    timeAgo(date) {
      const d = new Date(date)
      const now = new Date()
      const diff = Math.floor((now - d) / 1000)
      
      if (diff < 60) return 'NOW'
      if (diff < 3600) return Math.floor(diff / 60) + 'M'
      if (diff < 86400) return Math.floor(diff / 3600) + 'H'
      if (diff < 604800) return Math.floor(diff / 86400) + 'D'
      return d.toLocaleDateString()
    },

    formatDate(date) {
      if (!date) return 'UNKNOWN'
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).toUpperCase()
    },

    formatDateTime(date) {
      return new Date(date).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    truncate(str, n) {
      if (!str) return ''
      return str.length > n ? str.substr(0, n-1) + '…' : str
    },

    openProfile(username) {
      if (username) window.open(`https://github.com/${username}`, '_blank')
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
      window.open('https://github.com/Wildfiire/docs/issues/new', '_blank')
    },

    openNewPR() {
      window.open('https://github.com/Wildfiire/docs/compare', '_blank')
    },

    handleNavClick(item) {
      if (item.id === 'home') {
        window.location.href = '/'
      } else {
        this.currentView = item.id
      }
    },

    showToast(msg, type) {
      const id = Date.now()
      this.toasts.push({ id, message: msg, type })
      setTimeout(() => this.removeToast(id), 3000)
    },

    removeToast(id) {
      const i = this.toasts.findIndex(t => t.id === id)
      if (i !== -1) this.toasts.splice(i, 1)
    }
  }
}
</script>

<style scoped>
/* ===== RESET & VARIABLES ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===== DARK THEME (DEFAULT) ===== */
.wildfire-docs {
  --bg-primary: #0a0a0c;
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --bg-hover: #1f1f24;
  --border-color: #1f1f24;
  --border-hover: #2a2a30;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --text-dim: #60606a;
  --accent: #ff4500;
  --accent-light: #ff5722;
  --accent-glow: rgba(255, 69, 0, 0.2);
  --accent-hover: #ff5722;
  --success: #2ecc71;
  --warning: #f39c12;
  --danger: #e74c3c;
  --info: #3498db;
  --card-bg: rgba(15, 15, 20, 0.9);
  --card-border: rgba(255, 69, 0, 0.2);
  --shadow-color: rgba(0, 0, 0, 0.5);
  --chart-grid: rgba(255, 255, 255, 0.03);
  --chart-text: #8a8a95;
}

/* ===== LIGHT THEME ===== */
.wildfire-docs.light-theme {
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --bg-hover: #e0e0e5;
  --border-color: #ddd;
  --border-hover: #ccc;
  --text-primary: #333;
  --text-secondary: #4a4a55;
  --text-muted: #666;
  --text-dim: #999;
  --accent: #ff4500;
  --accent-light: #ff5722;
  --accent-glow: rgba(255, 69, 0, 0.1);
  --accent-hover: #ff5722;
  --success: #27ae60;
  --warning: #e67e22;
  --danger: #c0392b;
  --info: #2980b9;
  --card-bg: rgba(255, 255, 255, 0.95);
  --card-border: rgba(255, 69, 0, 0.15);
  --shadow-color: rgba(0, 0, 0, 0.1);
  --chart-grid: rgba(0, 0, 0, 0.05);
  --chart-text: #666;
}

.wildfire-docs {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
  font-size: 13px;
  position: relative;
  transition: background 0.3s ease, color 0.2s ease;
}

/* ===== PARTICLE BACKGROUND ===== */
.docs-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--border-color) 1px, transparent 1px),
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
  will-change: transform;
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-100px) translateX(50px); }
  50% { transform: translateY(-200px) translateX(-50px); }
  75% { transform: translateY(-300px) translateX(100px); }
  100% { transform: translateY(-400px) translateX(0); }
}

/* ===== THEME TOGGLE - TOP RIGHT ===== */
.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
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
  box-shadow: 0 8px 20px var(--accent-glow);
}

/* ===== SIDEBAR ===== */
.docs-sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  overflow-x: hidden;
}

.docs-sidebar.collapsed { 
  width: 80px; 
}

.sidebar-brand {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.brand-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.brand-icon img {
  filter: drop-shadow(0 0 10px var(--accent-glow));
  transition: filter 0.3s ease;
  max-width: 36px;
  height: auto;
}

.brand-icon:hover img {
  filter: drop-shadow(0 0 20px var(--accent-glow));
}

.brand-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  animation: brandPulse 2s infinite;
}

@keyframes brandPulse {
  0% { transform: scale(1); opacity: 0.3; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  white-space: nowrap;
}

.brand-name { 
  font-size: 16px; 
  color: var(--text-primary); 
  letter-spacing: -0.5px;
}

.brand-dot { 
  color: var(--accent); 
  font-size: 16px; 
}

.brand-version { 
  font-size: 11px; 
  color: var(--text-muted); 
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-item:hover { 
  background: var(--bg-tertiary); 
  color: var(--accent); 
  transform: translateX(4px);
}

.nav-item.active { 
  background: var(--accent); 
  color: #ffffff; 
  box-shadow: 0 4px 12px var(--accent-glow);
}

.nav-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover .nav-glow {
  left: 100%;
}

.nav-badge {
  background: var(--bg-tertiary);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 600;
  margin-left: auto;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.repo-stats-mini {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px;
  background: var(--bg-tertiary);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
  text-align: center;
}

.stat-item svg {
  color: var(--accent);
  width: 14px;
  height: 14px;
}

.stat-item .stat-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.sync-button {
  width: 100%;
  padding: 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.sync-button:hover:not(:disabled) { 
  background: var(--accent); 
  color: #fff; 
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--accent-glow);
}

.sync-button:disabled { 
  opacity: 0.5; 
  cursor: wait; 
}

/* ===== MAIN CONTENT ===== */
.docs-main {
  flex: 1;
  margin-left: 260px;
  padding: 24px 32px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  width: calc(100% - 260px);
  min-height: 100vh;
}

.docs-main.sidebar-collapsed { 
  margin-left: 80px;
  width: calc(100% - 80px);
}

/* ===== HEADER ===== */
.docs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 12px 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  position: sticky;
  top: 16px;
  z-index: 50;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  width: 100%;
}

.docs-header.scrolled {
  box-shadow: 0 8px 24px var(--shadow-color);
  border-color: var(--accent);
}

.header-left { 
  display: flex; 
  align-items: center; 
  gap: 20px; 
  flex-wrap: wrap;
}

.menu-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.menu-btn:hover { 
  border-color: var(--accent); 
  color: var(--accent); 
  transform: rotate(90deg);
}

.header-left h1 { 
  font-size: 18px; 
  font-weight: 500; 
  color: var(--text-primary); 
  margin: 0; 
  letter-spacing: -0.5px;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  font-size: 10px;
  white-space: nowrap;
}

.live-pulse {
  width: 8px;
  height: 8px;
  background: var(--success);
  border-radius: 50%;
  animation: livePulse 1.5s ease infinite;
}

@keyframes livePulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
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
  flex-wrap: wrap;
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
  white-space: nowrap;
}

.action-btn:hover { 
  border-color: var(--accent); 
  color: var(--accent); 
  transform: translateY(-2px);
}

.action-btn.primary { 
  background: var(--accent); 
  color: #fff; 
  border-color: var(--accent);
  box-shadow: 0 4px 12px var(--accent-glow);
}

.action-btn.primary:hover { 
  background: var(--accent-hover); 
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--accent-glow);
}

/* ===== LOADING STATE ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 48px;
}

.loader-ring {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
}

.loader-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 4px solid var(--accent);
  border-radius: 50%;
  animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--accent) transparent transparent transparent;
}

.loader-ring div:nth-child(1) { animation-delay: -0.45s; }
.loader-ring div:nth-child(2) { animation-delay: -0.3s; }
.loader-ring div:nth-child(3) { animation-delay: -0.15s; }

@keyframes loader {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ===== DASHBOARD VIEW ===== */
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.5s ease;
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Metrics Hero */
.metrics-hero {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
}

.metric-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: default;
  min-width: 0;
}

.metric-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 12px 24px var(--shadow-color);
}

.metric-icon {
  width: 56px;
  height: 56px;
  background: var(--bg-tertiary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.metric-card:hover .metric-icon {
  transform: scale(1.1) rotate(5deg);
}

.metric-content {
  flex: 1;
  min-width: 0;
}

.metric-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-value {
  display: block;
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: var(--success);
  white-space: nowrap;
}

.metric-trend.positive { color: var(--success); }
.metric-trend:not(.positive) { color: var(--danger); }

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  width: 100%;
}

.chart-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px;
  transition: all 0.3s ease;
  min-width: 0;
}

.chart-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-title h3 {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.legend-dot {
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-glow);
}

.legend-value {
  color: var(--accent);
  font-weight: 600;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  min-height: 200px;
  margin-bottom: 20px;
}

.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.chart-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 16px;
}

.footer-stat {
  text-align: center;
  min-width: 60px;
}

.footer-stat .stat-label {
  display: block;
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 4px;
  white-space: nowrap;
}

.footer-stat .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
}

/* Repo Stats Card */
.repo-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.repo-stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  transition: all 0.2s ease;
  min-width: 0;
}

.repo-stat-item:hover {
  transform: translateX(4px);
  background: var(--bg-hover);
}

.repo-stat-item svg {
  color: var(--accent);
  min-width: 20px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-info .stat-label {
  display: block;
  font-size: 9px;
  color: var(--text-muted);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-info .stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.repo-timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-item svg {
  color: var(--accent);
  flex-shrink: 0;
}

/* Champion Split - NEW */
.champion-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.champion-spotlight {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 0;
}

.champion-spotlight.left:hover,
.champion-spotlight.right:hover:not(.empty) {
  border-color: var(--accent);
  box-shadow: 0 12px 32px var(--shadow-color);
}

.spotlight-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  border-radius: 50%;
  animation: orbFloat 20s infinite alternate;
}

.bg-orb:nth-child(1) { top: -50px; right: -50px; animation-delay: 0s; }
.bg-orb:nth-child(2) { bottom: -50px; left: -50px; animation-delay: -5s; }

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 20px) scale(1.2); }
}

.spotlight-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  height: 100%;
}

.champion-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.champion-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid var(--accent);
  box-shadow: 0 0 30px var(--accent-glow);
}

.avatar-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  border-top-color: transparent;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar-crown {
  position: absolute;
  top: -12px;
  right: -8px;
  filter: drop-shadow(0 4px 8px rgba(255,215,0,0.5));
  transform: rotate(15deg);
  animation: crownWobble 2s ease infinite;
}

@keyframes crownWobble {
  0%, 100% { transform: rotate(15deg); }
  50% { transform: rotate(25deg); }
}

.champion-info {
  flex: 1;
  min-width: 150px;
}

.champion-badge {
  display: inline-block;
  font-size: 10px;
  color: var(--accent);
  background: var(--accent-glow);
  padding: 4px 10px;
  border-radius: 30px;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.champion-info h3 {
  font-size: clamp(16px, 3vw, 20px);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  word-break: break-word;
}

.champion-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border-radius: 30px;
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.stat-chip svg {
  color: var(--accent);
  flex-shrink: 0;
}

.champion-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  font-size: 11px;
  transition: all 0.2s ease;
  white-space: nowrap;
  margin-left: auto;
}

.champion-link:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 20px var(--accent-glow);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: 20px;
  color: var(--text-muted);
}

.empty-state svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.empty-state p {
  font-size: 11px;
}

/* Activity Grid */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.activity-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px;
  transition: all 0.3s ease;
  min-width: 0;
}

.activity-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left svg {
  color: var(--accent);
  flex-shrink: 0;
}

.header-left h3 {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
}

.card-badge {
  background: var(--bg-tertiary);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.card-feed {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.3s ease forwards;
  opacity: 0;
  transform: translateX(-10px);
  min-width: 0;
}

@keyframes slideIn {
  to { opacity: 1; transform: translateX(0); }
}

.feed-item:hover {
  background: var(--bg-hover);
  transform: translateX(4px);
}

.item-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.item-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.rank-1 { background: #ffd700; color: #000; }
.rank-2 { background: #c0c0c0; color: #333; }
.rank-3 { background: #cd7f32; color: #fff; }

.item-content {
  flex: 1;
  position: relative;
  z-index: 1;
  min-width: 0;
}

.item-title {
  display: block;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.meta-dot {
  color: var(--accent);
}

.item-icon {
  color: var(--accent);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.item-progress {
  width: 60px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.progress-bar {
  height: 4px;
  background: var(--bg-primary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Battle Grid */
.battle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.battle-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px;
  transition: all 0.3s ease;
  min-width: 0;
}

.battle-card.issues { border-top: 3px solid #3498db; }
.battle-card.prs { border-top: 3px solid #2ecc71; }

.battle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px var(--shadow-color);
}

.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.battle-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.battle-count {
  background: var(--bg-tertiary);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.battle-feed {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.battle-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 0;
}

.battle-item:hover {
  background: var(--bg-hover);
  transform: translateX(4px);
}

.battle-item img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  flex-shrink: 0;
}

.battle-content {
  flex: 1;
  min-width: 0;
}

.battle-title {
  display: block;
  color: var(--text-primary);
  font-size: 11px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.battle-meta {
  display: flex;
  gap: 6px;
  font-size: 9px;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.battle-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 10px;
  color: var(--accent);
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.battle-link:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  transform: translateX(4px);
}

/* ===== FILES VIEW ===== */
.files-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.5s ease;
  width: 100%;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.files-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
}

.file-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  width: 300px;
  position: relative;
  transition: all 0.2s ease;
  max-width: 100%;
}

.file-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.file-search input {
  background: none;
  border: none;
  color: var(--text-primary);
  width: 100%;
  font-size: 13px;
  min-width: 0;
}

.file-search input::placeholder {
  color: var(--text-muted);
  font-size: 11px;
}

.file-search input:focus {
  outline: none;
}

.search-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.search-clear:hover {
  color: var(--accent);
  background: var(--bg-hover);
}

.file-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 500px;
}

.file-tree-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: 8px;
}

.file-count {
  background: var(--bg-tertiary);
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--accent);
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
}

.file-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.file-preview.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 20px;
  padding: 40px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 12px;
}

.preview-path {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font-size: 13px;
  font-family: monospace;
  word-break: break-all;
}

.preview-edit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.preview-edit:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: var(--bg-primary);
}

.file-meta {
  display: flex;
  gap: 24px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 11px;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.file-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.file-meta svg {
  color: var(--accent);
  flex-shrink: 0;
}

.preview-content pre {
  margin: 0;
  color: var(--text-primary);
  font-family: 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

/* ===== CONTRIBUTORS VIEW ===== */
.contributors-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.5s ease;
  width: 100%;
}

.contributors-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.header-stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  overflow: hidden;
  min-width: 0;
}

.header-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-tertiary);
  opacity: 0.5;
  z-index: -1;
}

.header-stat-card .stat-number {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 8px;
  line-height: 1.2;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px var(--shadow-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-stat-card .stat-label {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
  position: relative;
  z-index: 2;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contributors-table-wrapper {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow-x: auto;
  width: 100%;
}

.contributors-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}

.contributors-table th {
  text-align: left;
  padding: 16px 20px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.table-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.table-row:hover {
  background: var(--bg-tertiary);
}

.table-row td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.rank-cell {
  font-weight: 600;
  color: var(--accent);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-cell img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  flex-shrink: 0;
}

.user-cell span {
  font-weight: 500;
  color: var(--text-primary);
}

.commits-cell, .prs-cell {
  font-weight: 500;
  color: var(--text-primary);
}

.impact-cell {
  min-width: 120px;
}

.impact-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
}

.impact-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* ===== AUDIT LOGS VIEW ===== */
.audit-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.5s ease;
  width: 100%;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.audit-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audit-title h2 {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
}

.audit-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.audit-count {
  background: var(--bg-tertiary);
  padding: 4px 12px;
  border-radius: 20px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.audit-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
  padding: 4px;
}

.timeline-event {
  display: flex;
  gap: 20px;
  animation: slideIn 0.3s ease forwards;
  opacity: 0;
  transform: translateX(-10px);
}

.event-marker {
  position: relative;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--bg-secondary);
  z-index: 1;
}

.timeline-event.commit .marker-dot { background: #3498db; }
.timeline-event.pr .marker-dot { background: #2ecc71; }
.timeline-event.issue .marker-dot { background: #e74c3c; }

.marker-line {
  position: absolute;
  top: 16px;
  width: 2px;
  height: calc(100% + 16px);
  background: var(--border-color);
}

.event-card {
  flex: 1;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 0;
}

.event-card:hover {
  border-color: var(--accent);
  transform: translateX(4px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.event-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.event-badge.commit { background: rgba(52,152,219,0.15); color: #3498db; }
.event-badge.pr { background: rgba(46,204,113,0.15); color: #2ecc71; }
.event-badge.issue { background: rgba(231,76,60,0.15); color: #e74c3c; }

.event-time {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
}

.event-body {
  margin-bottom: 8px;
}

.event-message {
  display: block;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  word-break: break-word;
}

.event-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.event-author {
  color: var(--accent);
}

.event-footer {
  display: flex;
  gap: 12px;
  font-size: 10px;
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
  padding-top: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.event-hash {
  font-family: monospace;
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.event-branch {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

/* ===== ANALYTICS VIEW ===== */
.analytics-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.5s ease;
  width: 100%;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.analytics-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.analytics-title h2 {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
}

.analytics-period {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.period-btn {
  padding: 6px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.period-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.period-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.analytics-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  min-width: 0;
}

.analytics-card.span-2 {
  grid-column: span 2;
}

.analytics-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
}

.card-header h3 svg {
  color: var(--accent);
  flex-shrink: 0;
}

.chart-stats {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.stat-total, .stat-avg {
  color: var(--accent);
  font-weight: 500;
  white-space: nowrap;
}

/* Language List */
.language-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.language-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.lang-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.lang-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lang-name {
  color: var(--text-primary);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lang-percent {
  color: var(--accent);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.lang-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
}

.lang-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.lang-bytes {
  color: var(--text-muted);
  font-size: 10px;
  min-width: 60px;
  text-align: right;
  white-space: nowrap;
}

/* PR Metrics */
.pr-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.pr-metric {
  text-align: center;
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  min-width: 0;
}

.pr-metric .metric-label {
  display: block;
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pr-metric .metric-value {
  font-size: clamp(18px, 3vw, 24px);
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Heatmap */
.heatmap {
  display: flex;
  gap: 4px;
  justify-content: center;
  padding: 20px 0;
  flex-wrap: wrap;
}

.heatmap-week {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 2px;
  transition: all 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.2);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .metrics-hero { grid-template-columns: repeat(2, 1fr); }
  .charts-section { grid-template-columns: 1fr; }
  .champion-split { grid-template-columns: 1fr; }
  .activity-grid { grid-template-columns: 1fr; }
  .battle-grid { grid-template-columns: 1fr; }
  .analytics-grid { grid-template-columns: 1fr; }
  .analytics-card.span-2 { grid-column: span 1; }
  .contributors-header { grid-template-columns: 1fr; }
  .file-layout { grid-template-columns: 1fr; }
  .file-tree-panel { max-height: 400px; }
}

@media (max-width: 900px) {
  .docs-sidebar { width: 80px; }
  .docs-sidebar.collapsed { width: 80px; }
  .docs-main { margin-left: 80px; width: calc(100% - 80px); }
  .docs-main.sidebar-collapsed { margin-left: 80px; width: calc(100% - 80px); }
  .sidebar-brand .brand-text,
  .nav-label,
  .nav-badge,
  .repo-stats-mini,
  .sync-button span { display: none; }
  .nav-item { justify-content: center; padding: 12px; }
}

@media (max-width: 700px) {
  .docs-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .metrics-hero { grid-template-columns: 1fr; }
  .header-right { width: 100%; }
  .action-btn { flex: 1; }
  .btn-text { display: none; }
  .live-indicator { display: none; }
  .file-search { width: 100%; }
  .theme-toggle-btn { top: 10px; right: 10px; }
  .audit-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .analytics-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .pr-metrics { grid-template-columns: 1fr; }
}

@media (max-width: 500px) {
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
  
  .champion-spotlight .spotlight-content {
    flex-direction: column;
    text-align: center;
  }
  
  .champion-stats {
    justify-content: center;
  }
  
  .header-left {
    flex-wrap: wrap;
  }
  
  .live-indicator {
    width: 100%;
  }
}

@media (min-width: 2560px) {
  .docs-main {
    max-width: 2000px;
    margin: 0 auto;
    margin-left: 260px;
  }
  
  .docs-main.sidebar-collapsed {
    margin-left: 80px;
  }
}

/* ===== ZOOM FIXES ===== */
/* Force hardware acceleration */
.docs-sidebar,
.docs-main,
.chart-card,
.metric-card,
.activity-card,
.battle-card,
.file-tree-panel,
.file-preview,
.analytics-card,
.audit-timeline,
.contributors-table-wrapper {
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Fix text rendering */
h1, h2, h3, p, span, .nav-item, .metric-value, .stat-value {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Fix absolute positioning */
.avatar-crown,
.brand-pulse,
.nav-glow {
  position: absolute;
  pointer-events: none;
}

/* Fix flex wrapping */
.metric-card,
.feed-item,
.battle-item,
.repo-stat-item,
.timeline-item,
.spotlight-content,
.card-header,
.battle-header,
.event-header,
.event-footer,
.file-meta,
.audit-header,
.analytics-header {
  flex-wrap: wrap;
}

/* Ensure SVGs scale properly */
svg {
  flex-shrink: 0;
  width: auto;
  height: auto;
}

/* Fix text overflow */
.item-title,
.battle-title,
.preview-path span,
.feed-item .item-title,
.metric-label,
.metric-value,
.stat-label,
.stat-value,
.event-message,
.lang-name {
  word-break: break-word;
  white-space: normal;
}

/* Fix container heights */
.docs-main,
.dashboard-view,
.files-view,
.contributors-view,
.audit-view,
.analytics-view {
  min-height: 100vh;
  height: auto;
}

/* Fix background */
.docs-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Fix progress bars */
.item-progress {
  min-width: 40px;
  width: auto;
}

.impact-cell {
  min-width: 100px;
}

/* Fix tables */
.contributors-table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

/* Fix touch interactions */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Ensure proper box sizing */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-hover);
}

/* Orange Theme Accents */
.metric-card .metric-icon svg,
.chart-title svg,
.header-left svg,
.battle-title svg,
.feed-item .item-icon svg {
  filter: drop-shadow(0 0 8px var(--accent-glow));
}

.chart-card:hover .chart-title svg {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* ===== SLIGHT SIZE REDUCTION ===== */
.wildfire-docs {
  font-size: 12.5px;
}

.docs-main {
  padding: 20px 28px;
}

.metric-card {
  padding: 20px;
}

.metric-icon {
  width: 48px;
  height: 48px;
}

.metric-icon svg {
  width: 26px;
  height: 26px;
}

.metric-value {
  font-size: 24px;
}

.chart-card,
.activity-card,
.battle-card {
  padding: 18px;
}

.chart-wrapper {
  height: 180px;
}

.footer-stat .stat-value {
  font-size: 16px;
}

.repo-stat-item {
  padding: 10px;
  gap: 10px;
}

.repo-stat-item svg {
  width: 18px;
  height: 18px;
}

.stat-info .stat-value {
  font-size: 15px;
}

.stat-info .stat-label {
  font-size: 8px;
}

.champion-spotlight {
  padding: 20px;
}

.champion-avatar {
  width: 70px;
  height: 70px;
}

.champion-info h3 {
  font-size: 18px;
}

.champion-stats {
  gap: 10px;
}

.stat-chip {
  padding: 3px 8px;
  font-size: 10px;
}

.feed-item {
  padding: 8px 10px;
  gap: 10px;
}

.item-avatar {
  width: 26px;
  height: 26px;
}

.item-title {
  font-size: 11px;
}

.item-meta {
  font-size: 9px;
}

.battle-item {
  padding: 8px 10px;
  gap: 10px;
}

.battle-item img {
  width: 22px;
  height: 22px;
}

.battle-title {
  font-size: 12px;
}

.battle-meta {
  font-size: 8px;
}

.header-stat-card {
  padding: 28px;
}

.header-stat-card .stat-number {
  font-size: 38px;
}

.header-stat-card .stat-label {
  font-size: 11px;
}

.header-left h1 {
  font-size: 17px;
}

.action-btn {
  padding: 6px 14px;
  font-size: 11px;
  gap: 5px;
}

.battle-count {
  padding: 3px 10px;
  font-size: 11px;
}

.battle-link {
  padding: 8px;
  font-size: 10px;
}

.timeline-item {
  padding: 6px 10px;
  gap: 6px;
  font-size: 10px;
}

.file-search {
  padding: 6px 14px;
}

.file-search input {
  font-size: 12px;
}

.tree-header {
  padding: 14px;
  font-size: 11px;
}

.file-count {
  padding: 3px 6px;
  font-size: 9px;
}

.preview-header {
  padding: 14px 18px;
}

.preview-path {
  font-size: 12px;
}

.preview-edit {
  padding: 4px 10px;
  font-size: 10px;
}

.file-meta {
  gap: 20px;
  font-size: 10px;
}

.preview-content pre {
  font-size: 12px;
}

.audit-header,
.analytics-header,
.files-header {
  padding: 18px;
}

.audit-title h2,
.analytics-title h2 {
  font-size: 17px;
}

.filter-btn,
.period-btn {
  padding: 5px 10px;
  font-size: 10px;
}

.audit-count {
  padding: 3px 10px;
  font-size: 10px;
}

.event-card {
  padding: 14px;
}

.event-badge {
  padding: 3px 6px;
  font-size: 9px;
}

.event-time {
  font-size: 9px;
}

.event-message {
  font-size: 12px;
}

.event-meta {
  font-size: 10px;
}

.event-footer {
  font-size: 9px;
  gap: 10px;
}

.card-header h3 {
  font-size: 12px;
}

.card-badge {
  padding: 2px 6px;
  font-size: 9px;
}

.pr-metric {
  padding: 14px;
}

.pr-metric .metric-value {
  font-size: 22px;
}

.pr-metric .metric-label {
  font-size: 9px;
}

.lang-info {
  gap: 6px;
  min-width: 100px;
}

.lang-name {
  font-size: 11px;
}

.lang-percent {
  font-size: 10px;
}

.lang-bytes {
  font-size: 9px;
  min-width: 50px;
}
</style>