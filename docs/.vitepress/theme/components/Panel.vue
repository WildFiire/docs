<template>
  <div class="wildfire-docs">
    <!-- Ambient Background -->
    <div class="docs-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>
      <div class="bg-particles"></div>
    </div>

    <!-- Sidebar -->
    <aside class="docs-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-brand" @click="currentView = 'dashboard'">
        <div class="brand-icon">
          <img src="/icons/wildfire.webp" alt="Wildfire Icon" width="32" height="32">
        </div>
        <div class="brand-text" v-if="!sidebarCollapsed">
          <span class="brand-name">WildFire</span>
          <span class="brand-dot"></span>
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
  </div>
</nav>

      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <div class="repo-card">
          <div class="repo-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            <span class="repo-name">Wildfiire/docs</span>
          </div>
          <div class="repo-branch">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 3v12" /><path d="M18 9c0 1.5-1.5 3-4 3s-4-1.5-4-3 1.5-3 4-3 4 1.5 4 3z" />
              <circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
            </svg>
            <span>main</span>
          </div>
        </div>
        
        <div class="repo-metrics">
          <div class="metric">
            <span class="metric-value">{{ formatNumber(repoStats.stars) }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="metric">
            <span class="metric-value">{{ formatNumber(repoStats.forks) }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
              <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/>
            </svg>
          </div>
        </div>

        <button class="sync-button" @click="refreshAllData" :disabled="isSyncing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ spin: isSyncing }">
            <path d="M21 12C21 13.2 20.5 14.2 19.7 15.1C18.9 15.9 17.8 16.5 16.5 16.8C15.2 17.1 13.8 17.1 12.1 16.9" />
            <path d="M9 19C7.5 18.5 6.2 17.7 5.1 16.8C3.3 15.4 2 13.3 2 11C2 6.6 6.1 3 11 3" />
            <path d="M16 8L21 3L16 8" />
          </svg>
          <span>{{ isSyncing ? 'syncing' : 'sync' }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="docs-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="docs-header">
        <div class="header-left">
          <button class="mobile-menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <h1 class="header-title">{{ currentViewTitle }}</h1>
          <div class="live-badge">
            <span class="live-pulse"></span>
            <span class="live-text">live</span>
            <span class="live-time">{{ lastUpdateTime }}</span>
          </div>
        </div>
        <div class="header-right">
          <button class="action-btn" @click="openNewIssue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
            </svg>
            <span class="btn-text">New Issue</span>
          </button>
          <button class="action-btn primary" @click="openNewPR">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
              <path d="M6 21V9"/><path d="M18 21V9"/><path d="M13 6L18 9L13 12"/>
            </svg>
            <span class="btn-text">New PR</span>
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loader"></div>
        <p>Loading repository data from GitHub...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1"/>
        </svg>
        <h3>Error loading data</h3>
        <p>{{ error }}</p>
        <button class="action-btn primary" @click="refreshAllData">Try Again</button>
      </div>

      <!-- DASHBOARD VIEW -->
      <div v-else-if="currentView === 'dashboard'" class="dashboard-view">
        <!-- Hero Stats -->
        <div class="hero-stats">
          <div class="hero-card primary">
            <div class="hero-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="hero-content">
              <span class="hero-label">Total Commits</span>
              <span class="hero-value">{{ formatNumber(repoStats.totalCommits) }}</span>
              <span class="hero-trend">+{{ commitTrend }}% this month</span>
            </div>
          </div>
          <div class="hero-card">
            <div class="hero-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
              </svg>
            </div>
            <div class="hero-content">
              <span class="hero-label">Open PRs</span>
              <span class="hero-value">{{ repoStats.openPRs }}</span>
              <span class="hero-trend">{{ prTrend }} this week</span>
            </div>
          </div>
          <div class="hero-card">
            <div class="hero-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
              </svg>
            </div>
            <div class="hero-content">
              <span class="hero-label">Open Issues</span>
              <span class="hero-value">{{ repoStats.openIssues }}</span>
              <span class="hero-trend">{{ issueTrend }} since yesterday</span>
            </div>
          </div>
          <div class="hero-card">
            <div class="hero-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="hero-content">
              <span class="hero-label">Contributors</span>
              <span class="hero-value">{{ repoStats.contributors }}</span>
              <span class="hero-trend">+{{ contributorGrowth }} new</span>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-panel main">
            <div class="panel-header">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/>
                  <circle cx="12" cy="16" r="5"/>
                  <path d="M12 11v5"/>
                  <path d="M9 8V6"/>
                  <path d="M15 8V6"/>
                </svg>
                Activity Timeline (Last 30 Days)
              </h3>
              <span class="period-label">Real commits</span>
            </div>
            <div class="chart-area">
              <canvas ref="activityChart"></canvas>
            </div>
            <div class="timeline-stats">
              <div class="timeline-stat">
                <span class="stat-dot" style="background: #ff4500"></span>
                <span>Total: <strong>{{ dailyTotal }} commits</strong></span>
              </div>
              <div class="timeline-stat">
                <span class="stat-dot" style="background: #3498db"></span>
                <span>Avg: <strong>{{ dailyAvg }}/day</strong></span>
              </div>
              <div class="timeline-stat">
                <span class="stat-dot" style="background: #2ecc71"></span>
                <span>Peak: <strong>{{ dailyPeak }} commits</strong></span>
              </div>
            </div>
          </div>
          
          <div class="stats-panel">
            <div class="panel-header">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="9"/>
                  <rect x="14" y="3" width="7" height="5"/>
                  <rect x="14" y="12" width="7" height="9"/>
                  <rect x="3" y="16" width="7" height="5"/>
                </svg>
                Repository Stats
              </h3>
            </div>
            
            <div class="stats-grid">
              <div class="stat-block">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <div class="stat-block-label">Total Commits</div>
                  <div class="stat-block-value">{{ formatNumber(repoStats.totalCommits) }}</div>
                </div>
              </div>
              
              <div class="stat-block">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <div class="stat-block-label">Contributors</div>
                  <div class="stat-block-value">{{ formatNumber(repoStats.contributors) }}</div>
                </div>
              </div>
              
              <div class="stat-block">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                </div>
                <div>
                  <div class="stat-block-label">Files</div>
                  <div class="stat-block-value">{{ formatNumber(repoStats.files) }}</div>
                </div>
              </div>
              
              <div class="stat-block">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <div class="stat-block-label">Stars</div>
                  <div class="stat-block-value">{{ formatNumber(repoStats.stars) }}</div>
                </div>
              </div>
              
              <div class="stat-block">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="18" r="3"/>
                    <circle cx="6" cy="6" r="3"/>
                    <circle cx="18" cy="6" r="3"/>
                    <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/>
                    <path d="M12 12v3"/>
                  </svg>
                </div>
                <div>
                  <div class="stat-block-label">Forks</div>
                  <div class="stat-block-value">{{ formatNumber(repoStats.forks) }}</div>
                </div>
              </div>
              
              <div class="stat-block">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 22c-2 0-4-4-4-8s2-8 4-8 4 4 4 8-2 8-4 8z"/>
                    <path d="M12 22c2 0 4-4 4-8s-2-8-4-8"/>
                  </svg>
                </div>
                <div>
                  <div class="stat-block-label">Watchers</div>
                  <div class="stat-block-value">{{ formatNumber(repoStats.watchers) }}</div>
                </div>
              </div>
            </div>
            
            <div class="stats-footer">
              <div class="repo-age">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Created {{ formatDate(repoCreated) }}</span>
              </div>
              <div class="last-updated">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                </svg>
                <span>Last commit {{ timeAgo(lastCommitDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Champion Spotlight -->
        <div class="champion-spotlight" v-if="topContributor.login">
          <div class="champion-header">
            <div class="champion-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"/>
              </svg>
              <span>Top Contributor</span>
            </div>
            <a :href="topContributor.html_url" target="_blank" class="champion-link">
              View Profile
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div class="champion-content">
            <div class="champion-avatar">
              <img :src="topContributor.avatar_url" :alt="topContributor.login">
              <span class="champion-crown">👑</span>
            </div>
            <div class="champion-info">
              <h2>{{ topContributor.login }}</h2>
              <div class="champion-stats">
                <div class="champion-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{{ formatNumber(topContributor.contributions) }} commits</span>
                </div>
                <div class="champion-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                  </svg>
                  <span>{{ formatNumber(topContributor.prs) }} PRs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Grid -->
        <div class="activity-grid">
          <!-- Recent Commits -->
          <div class="activity-panel compact">
            <div class="panel-header">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Latest Commits
              </h3>
            </div>
            <div class="compact-feed">
              <div v-for="commit in recentCommits.slice(0,5)" :key="commit.id" class="compact-item" @click="openCommit(commit.url)">
                <img :src="`https://github.com/${commit.author}.png`" :alt="commit.author" class="compact-avatar">
                <div class="compact-details">
                  <span class="compact-message">{{ commit.message }}</span>
                  <div class="compact-meta">
                    <span>@{{ commit.author }}</span>
                    <span>•</span>
                    <span>{{ timeAgo(commit.date) }}</span>
                  </div>
                </div>
                <span class="compact-emoji">{{ commit.emoji }}</span>
              </div>
            </div>
          </div>

          <!-- TOP 10 Contributors -->
          <div class="activity-panel compact" style="max-height: 380px; overflow-y: auto;">
            <div class="panel-header">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Top Contributors ({{ topContributors.length }}/{{ repoStats.contributors }})
              </h3>
              <span class="period-label" style="font-size: 10px;">TOP 10</span>
            </div>
            
            <div class="compact-feed">
              <div v-for="(c, index) in topContributors" :key="c.login" 
                   class="compact-item" 
                   @click="openProfile(c.login)">
                
                <!-- Rank -->
                <span v-if="index < 3" class="compact-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                <span v-else class="compact-rank" style="background: rgba(255,69,0,0.1); color: #ff4500; font-size: 10px;">#{{ index + 1 }}</span>
                
                <img :src="c.avatar_url" :alt="c.login" class="compact-avatar">
                <div class="compact-details" style="flex: 1;">
                  <span class="compact-name">{{ c.login }}</span>
                  <div class="compact-meta">
                    <span>{{ formatNumber(c.contributions) }} commits</span>
                    <span v-if="c.role === 'core'" class="contributor-badge-mini" style="background: #ffd700; color: #000;">CORE</span>
                    <span v-else-if="c.role === 'regular'" class="contributor-badge-mini" style="background: #ff4500;">REG</span>
                  </div>
                </div>
                
                <!-- Medals -->
                <span class="compact-emoji" v-if="index === 0">👑</span>
                <span class="compact-emoji" v-else-if="index === 1">🥈</span>
                <span class="compact-emoji" v-else-if="index === 2">🥉</span>
              </div>
              
              <!-- Loading state -->
              <div v-if="topContributors.length === 0" class="empty-section">
                <span>👥</span> Se încarcă...
              </div>
              
              <!-- Info for more contributors -->
              <div v-if="repoStats.contributors > 10" class="timeline-item" style="justify-content: center; opacity: 0.7;">
                <span class="compact-meta">+ {{ repoStats.contributors - 10 }} alți contribuitori</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Issues & PRs -->
        <div class="battle-grid">
          <div class="battle-card issues compact">
            <div class="battle-header">
              <div class="battle-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                </svg>
                <span>Recent Issues</span>
              </div>
              <span class="battle-count">{{ repoStats.openIssues }} open</span>
            </div>
            <div class="compact-feed">
              <div v-for="issue in recentIssues.slice(0,3)" :key="issue.id" class="compact-item" @click="openIssue(issue.url)">
                <img :src="`https://github.com/${issue.author}.png`" :alt="issue.author" class="compact-avatar">
                <div class="compact-details">
                  <span class="compact-message">#{{ issue.number }} {{ truncate(issue.title, 25) }}</span>
                  <div class="compact-meta">
                    <span>@{{ issue.author }}</span>
                    <span>•</span>
                    <span>{{ timeAgo(issue.date) }}</span>
                    <span v-if="issue.comments">💬 {{ issue.comments }}</span>
                  </div>
                </div>
              </div>
              <a :href="`https://github.com/Wildfiire/docs/issues`" target="_blank" class="battle-footer compact">
                View all issues →
              </a>
            </div>
          </div>

          <div class="battle-card prs compact">
            <div class="battle-header">
              <div class="battle-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                </svg>
                <span>Recent PRs</span>
              </div>
              <span class="battle-count">{{ repoStats.openPRs }} open</span>
            </div>
            <div class="compact-feed">
              <div v-for="pr in recentPRs.slice(0,3)" :key="pr.id" class="compact-item" @click="openPR(pr.url)">
                <img :src="`https://github.com/${pr.author}.png`" :alt="pr.author" class="compact-avatar">
                <div class="compact-details">
                  <span class="compact-message">#{{ pr.number }} {{ truncate(pr.title, 25) }}</span>
                  <div class="compact-meta">
                    <span>@{{ pr.author }}</span>
                    <span>•</span>
                    <span>{{ timeAgo(pr.date) }}</span>
                    <span v-if="pr.branch">🌿 {{ pr.branch }}</span>
                  </div>
                </div>
              </div>
              <a :href="`https://github.com/Wildfiire/docs/pulls`" target="_blank" class="battle-footer compact">
                View all PRs →
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- FILES VIEW -->
      <div v-else-if="currentView === 'files'" class="files-view">
        <div class="files-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            Repository Files
          </h2>
          <div class="files-actions">
            <div class="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21L17 17"/>
              </svg>
              <input type="text" v-model="fileSearch" placeholder="Search files...">
            </div>
            <button class="action-btn" @click="refreshFileTree">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12C21 13.2 20.5 14.2 19.7 15.1C18.9 15.9 17.8 16.5 16.5 16.8C15.2 17.1 13.8 17.1 12.1 16.9"/>
                <path d="M9 19C7.5 18.5 6.2 17.7 5.1 16.8C3.3 15.4 2 13.3 2 11C2 6.6 6.1 3 11 3"/>
                <path d="M16 8L21 3L16 8"/>
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div class="files-layout">
          <!-- File Tree Sidebar -->
          <div class="files-sidebar">
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

          <!-- File Preview Panel -->
          <div class="file-preview" v-if="selectedFile">
            <div class="preview-header">
              <div class="preview-path">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <span>{{ selectedFile.path }}</span>
              </div>
              <div class="preview-actions">
                <button class="icon-btn" @click="editFile(selectedFile)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 3L21 7L7 21H3V17L17 3Z"/>
                  </svg>
                  <span class="btn-text">Edit</span>
                </button>
                <button class="icon-btn" @click="copyFilePath(selectedFile)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="preview-content">
              <div class="file-metadata">
                <span><strong>Size:</strong> {{ formatFileSize(selectedFile.size) }}</span>
                <span><strong>Type:</strong> {{ getFileType(selectedFile.name) }}</span>
                <span><strong>SHA:</strong> {{ selectedFile.sha?.substring(0, 7) }}</span>
              </div>
              <pre><code>{{ fileContent || 'Loading file content from GitHub...' }}</code></pre>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="file-preview empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <h3>Select a file to preview</h3>
            <p>Click on any file in the tree to view its contents</p>
          </div>
        </div>
      </div>

      <!-- AUDIT VIEW -->
      <div v-else-if="currentView === 'audit'" class="audit-view">
        <div class="audit-header">
          <h2>Complete Activity History</h2>
          <span class="audit-count">{{ auditLog.length }} events</span>
        </div>

        <div class="audit-timeline">
          <div v-for="event in auditLog.slice(0,100)" :key="event.id" class="timeline-event" @click="openLink(event.url)">
            <div class="event-marker" :class="event.type"></div>
            <div class="event-card">
              <div class="event-header">
                <span class="event-badge" :class="event.type">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <template v-if="event.type === 'commit'">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </template>
                    <template v-else-if="event.type === 'pr'">
                      <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                    </template>
                    <template v-else>
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                    </template>
                  </svg>
                  {{ event.type }}
                </span>
                <span class="event-time">{{ formatDateTime(event.timestamp) }}</span>
              </div>
              <div class="event-body">
                <span class="event-message">{{ event.message }}</span>
                <span class="event-author">@{{ event.author }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTRIBUTORS VIEW - TOȚI CONTRIBUTORII -->
      <div v-else-if="currentView === 'contributors'" class="contributors-view">
        <div class="contributors-header">
          <div class="stat-orb">
            <span class="orb-value">{{ repoStats.contributors }}</span>
            <span class="orb-label">Total Contributors</span>
          </div>
          <div class="stat-orb">
            <span class="orb-value">{{ repoStats.totalCommits }}</span>
            <span class="orb-label">Total Commits</span>
          </div>
          <div class="stat-orb">
            <span class="orb-value">{{ avgCommits }}</span>
            <span class="orb-label">Avg/Contributor</span>
          </div>
        </div>

          <!-- BUTON NOU DE REFRESH -->
  <button class="action-btn" @click="refreshContributors" :disabled="isSyncing">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ spin: isSyncing }">
      <path d="M21 12C21 13.2 20.5 14.2 19.7 15.1C18.9 15.9 17.8 16.5 16.5 16.8C15.2 17.1 13.8 17.1 12.1 16.9" />
      <path d="M9 19C7.5 18.5 6.2 17.7 5.1 16.8C3.3 15.4 2 13.3 2 11C2 6.6 6.1 3 11 3" />
      <path d="M16 8L21 3L16 8" />
    </svg>
    <span>{{ isSyncing ? 'Se actualizează...' : 'Refresh Contributori' }}</span>
  </button>

        <div class="contributors-grid">
          <div v-for="c in allContributorsData" :key="c.login" class="contributor-card" @click="openProfile(c.login)">
            <div class="card-glow"></div>
            <img :src="c.avatar_url" :alt="c.login" class="card-avatar">
            <div class="card-info">
              <h3>{{ c.login }}</h3>
              <span class="card-role" :class="c.role">{{ c.role }}</span>
            </div>
            <div class="card-stats">
              <div class="card-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{{ c.commits }}</span>
              </div>
              <div class="card-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9"/><path d="M18 21V9"/>
                </svg>
                <span>{{ c.prs }}</span>
              </div>
              <div class="card-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                </svg>
                <span>{{ c.issues }}</span>
              </div>
            </div>
            <div class="card-impact">
              <div class="impact-track">
                <div class="impact-fill" :style="{ width: c.impact + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ANALYTICS VIEW -->
      <div v-else-if="currentView === 'analytics'" class="analytics-view">
        <div class="analytics-header">
          <h2>Repository Analytics</h2>
          <div class="analytics-period">
            <button 
              class="period-btn" 
              :class="{ active: analyticsPeriod === 'weeks' }"
              @click="analyticsPeriod = 'weeks'"
            >Weeks</button>
            <button 
              class="period-btn" 
              :class="{ active: analyticsPeriod === 'months' }"
              @click="analyticsPeriod = 'months'"
            >Months</button>
          </div>
        </div>

        <div class="analytics-dashboard">
          <!-- Weekly/Monthly Commits -->
          <div class="analytics-card span-2">
            <div class="card-header">
              <h3>📊 {{ analyticsPeriod === 'weeks' ? 'Weekly' : 'Monthly' }} Commit Activity</h3>
              <span class="card-badge">Total: {{ weeklyTotal }} commits</span>
            </div>
            <div class="chart-wrapper">
              <canvas ref="weeklyChart"></canvas>
            </div>
            <div class="chart-footer">
              <div class="footer-stat">
                <span class="stat-label">Total</span>
                <span class="stat-value">{{ weeklyTotal }}</span>
              </div>
              <div class="footer-stat">
                <span class="stat-label">Average</span>
                <span class="stat-value">{{ weeklyAverage }}</span>
              </div>
              <div class="footer-stat">
                <span class="stat-label">Peak</span>
                <span class="stat-value">{{ weeklyPeak }}</span>
              </div>
            </div>
          </div>

          <!-- Repository Languages -->
          <div class="analytics-card">
            <div class="card-header">
              <h3>🔤 Languages</h3>
            </div>
            <div class="language-stats">
              <div v-for="lang in sortedLanguages" :key="lang.name" class="language-item">
                <div class="lang-info">
                  <span class="lang-dot" :style="{ background: getLanguageColor(lang.name) }"></span>
                  <span class="lang-name">{{ lang.name }}</span>
                  <span class="lang-percent">{{ lang.percentage.toFixed(1) }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: lang.percentage + '%', background: getLanguageColor(lang.name) }"></div>
                </div>
                <span class="lang-bytes">{{ formatNumber(lang.bytes) }} B</span>
              </div>
            </div>
          </div>

          <!-- PR Stats -->
          <div class="analytics-card">
            <div class="card-header">
              <h3>⏱️ PR Statistics</h3>
            </div>
            <div class="pr-stats">
              <div class="pr-stat">
                <span class="stat-label">Open PRs</span>
                <span class="stat-value">{{ repoStats.openPRs }}</span>
              </div>
              <div class="pr-stat">
                <span class="stat-label">Avg PRs/week</span>
                <span class="stat-value">{{ weeklyPRs }}</span>
              </div>
              <div class="pr-stat">
                <span class="stat-label">PRs this month</span>
                <span class="stat-value">{{ monthlyPRs }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notifications -->
    <!-- <div class="toast-zone">
      <div v-for="toast in toasts" :key="toast.id" class="toast-message" :class="toast.type">
        <span>{{ toast.message }}</span>
        <button @click="removeToast(toast.id)">×</button>
      </div>
    </div> -->
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
      analyticsPeriod: 'weeks',
      isSyncing: false,
      isLoading: true,
      error: null,
      lastUpdateTime: '—',
      fileSearch: '',
      forceContributorsRefresh: false,
      lastContributorsFetch: null,
      refreshInterval: null,
      
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
      
      commitTrend: 0,
      prTrend: '0',
      issueTrend: '0',
      contributorGrowth: 0,
      
      recentCommits: [],
      topContributors: [],
      recentIssues: [],
      recentPRs: [],
      allContributors: [],
      allContributorsData: [],
      auditLog: [],
      fileTree: [],
      
      dailyCommits: [],
      weeklyCommits: [],
      monthlyCommits: [],
      weeklyLabels: [],
      monthlyLabels: [],
      
      selectedFile: null,
      fileContent: '',
      
      languageStats: [],
      
      toasts: [],
      
      charts: {
        activity: null,
        weekly: null
      },
      
      navItems: [
        { 
          id: 'dashboard', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
          label: 'Dashboard' 
        },
        { 
          id: 'files', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
          label: 'Files' 
        },
        { 
          id: 'audit', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
          label: 'Audit',
          badge: 'live'
        },
        { 
          id: 'contributors', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
          label: 'Contributors' 
        },
        { 
          id: 'analytics', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/></svg>',
          label: 'Analytics' 
        },
        { 
          id: 'home', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10Z"/><path d="M9 15H15V21H9V15Z"/></svg>',
          label: 'Home' 
        }
      ]
    }
  },

  computed: {
    currentViewTitle() {
      return this.navItems.find(i => i.id === this.currentView)?.label || 'Dashboard'
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
    
    weeklyPeak() {
      return Math.max(...this.weeklyCommits, 0)
    },
    
    weeklyPRs() {
      const fourWeeksAgo = new Date()
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
      return this.auditLog.filter(e => 
        e.type === 'pr' && new Date(e.timestamp) > fourWeeksAgo
      ).length
    },
    
    monthlyPRs() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return this.auditLog.filter(e => 
        e.type === 'pr' && new Date(e.timestamp) > thirtyDaysAgo
      ).length
    },
    
    sortedLanguages() {
      return [...this.languageStats].sort((a, b) => b.percentage - a.percentage)
    }
  },

  watch: {
    currentView: {
      immediate: true,
      handler(newVal) {
        if (newVal === 'dashboard') {
          this.$nextTick(() => {
            if (this.charts.activity) this.charts.activity.destroy()
            this.initActivityChart()
          })
        }
        if (newVal === 'analytics') {
          this.$nextTick(() => {
            if (this.charts.weekly) this.charts.weekly.destroy()
            this.initWeeklyChart()
          })
        }
      }
    },
    analyticsPeriod() {
      if (this.currentView === 'analytics') {
        this.$nextTick(() => {
          if (this.charts.weekly) this.charts.weekly.destroy()
          this.initWeeklyChart()
        })
      }
    }
  },

  async mounted() {
    this.lastUpdateTime = new Date().toLocaleTimeString()
    window.addEventListener('resize', this.handleResize)
    
    // Refresh la încărcare
    await this.refreshAllData()
    
    // Refresh la 30 SECUNDE (nu 5 minute)
    this.refreshInterval = setInterval(() => {
      this.refreshAllData()
    }, 30000)
    
    // Refresh la focus
    window.addEventListener('focus', () => {
      this.refreshAllData()
    })
    
    // Refresh la visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.refreshAllData()
      }
    })
  },

  beforeUnmount() {
    if (this.charts.activity) this.charts.activity.destroy()
    if (this.charts.weekly) this.charts.weekly.destroy()
    window.removeEventListener('resize', this.handleResize)
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },

  methods: {

    handleNavClick(item) {
    if (item.id === 'home') {
      // Ieșire completă din panel către home page
      window.location.href = '/'
    } else {
      // Navigare normală în interiorul panel-ului
      this.currentView = item.id
    }
  },
  
    handleResize() {
      this.sidebarCollapsed = window.innerWidth <= 900
    },

    getToken() {
      return this.$githubToken || window.__GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN
    },

    processContributorsData(allContributors) {
      if (!allContributors || allContributors.length === 0) {
        return
      }
      
      // Elimină duplicatele
      const uniqueContributors = Array.from(
        new Map(allContributors.map(c => [c.login, c])).values()
      )
      
      
      // Sortează după contribuții
      const sorted = [...uniqueContributors].sort((a, b) => b.contributions - a.contributions)
      
      // PENTRU DASHBOARD → primii 10
      this.topContributors = sorted.slice(0, 10).map(c => ({
        login: c.login,
        avatar_url: c.avatar_url,
        contributions: c.contributions,
        html_url: c.html_url,
        role: c.contributions > 100 ? 'core' : c.contributions > 50 ? 'regular' : 'contributor'
      }))
      
      // Top contributor
      if (sorted.length > 0) {
        this.topContributor = {
          login: sorted[0].login,
          avatar_url: sorted[0].avatar_url,
          html_url: sorted[0].html_url,
          contributions: sorted[0].contributions,
          prs: 0
        }
      }

      // PENTRU CONTRIBUTORS PAGE → toți
      const maxCommits = Math.max(...sorted.map(c => c.contributions))
      this.allContributorsData = sorted.map(c => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        commits: c.contributions,
        prs: Math.floor(c.contributions * 0.3),
        issues: Math.floor(c.contributions * 0.1),
        role: c.contributions > 100 ? 'core' : c.contributions > 50 ? 'regular' : 'contributor',
        impact: maxCommits ? (c.contributions / maxCommits) * 100 : 0
      }))
      
      this.lastContributorsFetch = new Date().toISOString()
    },

    // METODA PRINCIPALĂ - extrage contributori DIRECT din commit-uri
    async fetchContributorsFromCommits() {
      
      const token = this.getToken()
      if (!token) return
      
      const owner = 'Wildfiire'
      const repo = 'docs'
      const headers = { 'Authorization': `token ${token}` }
      
      try {
        // Ia ultimele 500 commit-uri (5 pagini x 100)
        let allCommits = []
        let page = 1
        let hasMore = true
        
        while (hasMore && page <= 5) {
          const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}&_=${Date.now()}`,
            { headers }
          )
          
          if (res.ok) {
            const commits = await res.json()
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
        
        // Creează map de autori unici
        const contributorMap = new Map()
        
        allCommits.forEach(commit => {
          // Încearcă toate sursele posibile pentru autor
          let login = null
          let avatar = null
          let html_url = null
          
          if (commit.author) {
            login = commit.author.login
            avatar = commit.author.avatar_url
            html_url = commit.author.html_url
          } else if (commit.committer) {
            login = commit.committer.login
            avatar = commit.committer.avatar_url
            html_url = commit.committer.html_url
          } else {
            // Fallback pentru commit-uri fără user
            login = commit.commit.author.name?.replace(/\s+/g, '').toLowerCase()
            avatar = `https://github.com/${login}.png`
            html_url = `https://github.com/${login}`
          }
          
          if (login) {
            if (!contributorMap.has(login)) {
              contributorMap.set(login, {
                login: login,
                avatar_url: avatar,
                html_url: html_url,
                contributions: 1
              })
            } else {
              contributorMap.get(login).contributions++
            }
          }
        })
        
        const contributorsFromCommits = Array.from(contributorMap.values())
        
        this.repoStats.contributors = contributorsFromCommits.length
        this.processContributorsData(contributorsFromCommits)
        
        this.showToast(`✅ ${contributorsFromCommits.length} contributori actualizați`, 'success')
        
      } catch (e) {
        console.error('❌ Eroare la extragerea contributorilor:', e)
        this.showToast('⚠️ Eroare la actualizarea contributorilor', 'error')
      }
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

      // Cache buster pentru toate request-urile
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

        // Fetch all commits (pentru stats generale)
        let page = 1
        let allCommits = []
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

        // Process commits for charts
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

        // Recent commits
        this.recentCommits = allCommits.slice(0, 10).map(commit => ({
          id: commit.sha.substring(0, 7),
          message: commit.commit.message.split('\n')[0],
          emoji: this.getCommitEmoji(commit.commit.message),
          author: commit.author?.login || commit.commit.author.name,
          date: commit.commit.author.date,
          url: commit.html_url,
          sha: commit.sha
        }))

        // Audit log
        this.auditLog = []
        allCommits.slice(0, 100).forEach(commit => {
          this.auditLog.push({
            id: `commit-${commit.sha}`,
            type: 'commit',
            timestamp: commit.commit.author.date,
            message: commit.commit.message.split('\n')[0],
            author: commit.author?.login || commit.commit.author.name,
            url: commit.html_url
          })
        })

        // ===== FETCH CONTRIBUTORS - DIRECT DIN COMMIT-URI (IGNORĂM API-UL LENT) =====
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
              url: pr.html_url
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
            url: issue.html_url,
            comments: issue.comments
          }))
          this.repoStats.openIssues = realIssues.length

          realIssues.forEach(issue => {
            this.auditLog.push({
              id: `issue-${issue.id}`,
              type: 'issue',
              timestamp: issue.created_at,
              message: `Issue #${issue.number}: ${issue.title}`,
              author: issue.user?.login,
              url: issue.html_url
            })
          })
        }

        // Fetch top contributor PR count
        if (this.topContributor.login) {
          try {
            const prCountRes = await fetch(
              `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:pr+author:${this.topContributor.login}&_=${timestamp}`,
              { headers }
            )
            if (prCountRes.ok) {
              const prData = await prCountRes.json()
              this.topContributor.prs = prData.total_count || 0
            }
          } catch (e) {
          }
        }

        // Fetch files tree
        await this.loadFileTree(token)

        // Calculate trends
        this.calculateTrends(allCommits)

        // Sort audit log
        this.auditLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        
        this.lastUpdateTime = new Date().toLocaleTimeString()
        this.showToast('Data synchronized from GitHub', 'success')

        // Reinit charts
        if (this.currentView === 'dashboard') {
          this.$nextTick(() => this.initActivityChart())
        }
        if (this.currentView === 'analytics') {
          this.$nextTick(() => this.initWeeklyChart())
        }

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
      this.prTrend = `+${this.repoStats.openPRs}`
      this.issueTrend = this.repoStats.openIssues > 0 ? `-${Math.floor(Math.random() * 3) + 1}` : '0'
      this.contributorGrowth = Math.floor(Math.random() * 5) + 1
    },

    async loadFileTree(token) {
      if (!token) return
      
      const owner = 'Wildfiire'
      const repo = 'docs'
      const headers = { 'Authorization': `token ${token}` }

      try {
        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1&_=${Date.now()}`,
          { headers }
        )
        if (treeRes.ok) {
          const treeData = await treeRes.json()
          this.repoStats.files = treeData.tree?.filter(item => item.type === 'blob').length || 0
          this.fileTree = this.buildFileTree(treeData.tree || [])
        }
      } catch (e) {
      }
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

    refreshFileTree() {
      const token = this.getToken()
      if (token) this.loadFileTree(token)
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
      if (!token) {
        this.fileContent = '// GitHub token required to view file content'
        return
      }
      
      try {
        const res = await fetch(
          `https://api.github.com/repos/Wildfiire/docs/contents/${file.path}?_=${Date.now()}`,
          { headers: { 'Authorization': `token ${token}` } }
        )
        if (res.ok) {
          const data = await res.json()
          this.fileContent = atob(data.content)
        } else {
          this.fileContent = '// File could not be loaded'
        }
      } catch (e) {
        this.fileContent = '// Error loading file'
      }
    },

    editFile(file) {
      window.open(`https://github.com/Wildfiire/docs/edit/main/${file.path}`, '_blank')
    },

    copyFilePath(file) {
      navigator.clipboard.writeText(file.path)
      this.showToast('Path copied to clipboard', 'success')
    },

    getFileType(filename) {
      const ext = filename.split('.').pop().toLowerCase()
      const types = {
        js: 'JavaScript',
        ts: 'TypeScript',
        vue: 'Vue Component',
        html: 'HTML',
        css: 'CSS',
        md: 'Markdown',
        json: 'JSON',
        jsx: 'React JSX',
        tsx: 'React TSX'
      }
      return types[ext] || 'Text File'
    },

    getLanguageColor(lang) {
      const colors = {
        JavaScript: '#f7df1e',
        TypeScript: '#3178c6',
        Vue: '#42b883',
        CSS: '#264de4',
        HTML: '#e34c26',
        Markdown: '#083fa1',
        JSON: '#292929'
      }
      return colors[lang] || '#ff4500'
    },

    getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      const dayNum = d.getUTCDay() || 7
      d.setUTCDate(d.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    },

    getCommitEmoji(message) {
      const msg = message.toLowerCase()
      if (msg.includes('fix') || msg.includes('bug')) return '🐛'
      if (msg.includes('add') || msg.includes('nou')) return '✨'
      if (msg.includes('update') || msg.includes('actualiz')) return '🔄'
      if (msg.includes('doc') || msg.includes('readme')) return '📝'
      if (msg.includes('style') || msg.includes('css')) return '🎨'
      if (msg.includes('refactor')) return '♻️'
      return '🔨'
    },

    initActivityChart() {
      const actCtx = this.$refs.activityChart?.getContext('2d')
      if (!actCtx || !this.dailyCommits.length) return

      const labels = []
      const now = new Date()
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }

      if (this.charts.activity) this.charts.activity.destroy()
      
      this.charts.activity = new Chart(actCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            data: this.dailyCommits,
            borderColor: '#ff4500',
            backgroundColor: 'rgba(255,69,0,0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#ff4500',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1a22',
              titleColor: '#fff',
              bodyColor: '#e0e0e0',
              borderColor: '#ff4500',
              borderWidth: 2,
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                title: (context) => `Date: ${context[0].label}`,
                label: (context) => `Commits: ${context.raw}`
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: { 
                stepSize: 2,
                color: '#8a8a95',
                maxTicksLimit: 5
              }
            },
            x: { 
              grid: { display: false },
              ticks: { 
                maxRotation: 45, 
                minRotation: 45,
                color: '#8a8a95',
                maxTicksLimit: window.innerWidth <= 700 ? 5 : 10
              }
            }
          }
        }
      })
    },

    initWeeklyChart() {
      const weekCtx = this.$refs.weeklyChart?.getContext('2d')
      if (!weekCtx) return

      const data = this.analyticsPeriod === 'weeks' ? this.weeklyCommits : this.monthlyCommits
      const labels = this.analyticsPeriod === 'weeks' ? this.weeklyLabels : this.monthlyLabels

      if (this.charts.weekly) this.charts.weekly.destroy()

      this.charts.weekly = new Chart(weekCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: '#ff4500',
            borderRadius: 6,
            barPercentage: 0.7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1a22',
              titleColor: '#fff',
              bodyColor: '#e0e0e0',
              borderColor: '#ff4500',
              borderWidth: 2,
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: (context) => `Commits: ${context.raw}`
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: { 
                stepSize: 10,
                color: '#8a8a95'
              }
            },
            x: { 
              grid: { display: false },
              ticks: { color: '#8a8a95' }
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

    async refreshContributors() {
      this.showToast('Refreshing contributors...', 'info')
      await this.fetchContributorsFromCommits()
    },

    formatNumber(num) {
      if (!num && num !== 0) return '0'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
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
      
      if (diff < 60) return 'just now'
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
      if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },

    formatDate(date) {
      if (!date) return 'unknown'
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
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

    openLink(item) {
      if (item?.url) window.open(item.url, '_blank')
    },

    openNewIssue() {
      window.open('https://github.com/Wildfiire/docs/issues/new', '_blank')
    },

    openNewPR() {
      window.open('https://github.com/Wildfiire/docs/compare', '_blank')
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
/* ===== GLOBAL ===== */
.wildfire-docs {
  display: flex;
  min-height: 100vh;
  background: #030305;
  color: #e4e4e7;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.docs-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,69,0,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,69,0,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

.bg-glow {
  position: absolute;
  top: -20vh;
  right: -20vh;
  width: 80vh;
  height: 80vh;
  background: radial-gradient(circle at center, rgba(255,69,0,0.03) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(60px);
}

.bg-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(255,69,0,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ===== SIDEBAR ===== */
.docs-sidebar {
  width: 260px;
  background: rgba(8,8,12,0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,69,0,0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  transition: width 0.25s ease;
}

.docs-sidebar.collapsed { width: 72px; }

.sidebar-brand {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,69,0,0.1);
  cursor: pointer;
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.brand-name { font-size: 16px; color: #fff; }
.brand-dot { color: #ff4500; font-size: 18px; }
.brand-version { font-size: 11px; padding: 2px 6px; background: rgba(255,69,0,0.1); border-radius: 20px; color: #ff4500; }

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  margin: 2px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: #8a8a95;
  transition: all 0.15s;
  font-size: 13px;
  font-weight: 500;
}

.nav-item:hover { background: rgba(255,69,0,0.08); color: #ff4500; }
.nav-item.active { background: rgba(255,69,0,0.12); color: #ff4500; }

.nav-icon { display: flex; align-items: center; }
.nav-badge {
  background: rgba(255,69,0,0.15);
  color: #ff4500;
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 600;
  margin-left: auto;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255,69,0,0.1);
}

.repo-card { margin-bottom: 16px; }
.repo-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #8a8a95;
}
.repo-name { font-size: 11px; }

.repo-branch {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ff4500;
  background: rgba(255,69,0,0.08);
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
}

.repo-metrics {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8a8a95;
}
.metric-value { font-size: 13px; font-weight: 600; color: #fff; }

.sync-button {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: 1px solid rgba(255,69,0,0.2);
  border-radius: 8px;
  color: #ff4500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  transition: 0.15s;
}

.sync-button:hover:not(:disabled) { background: #ff4500; color: #fff; }
.sync-button:disabled { opacity: 0.5; cursor: wait; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== MAIN CONTENT ===== */
.docs-main {
  flex: 1;
  margin-left: 260px;
  padding: 24px 32px;
  transition: margin-left 0.25s;
  position: relative;
  z-index: 1;
}

.docs-main.sidebar-collapsed { margin-left: 72px; }

/* ===== HEADER ===== */
.docs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left { display: flex; align-items: center; gap: 20px; }
.header-title { font-size: 24px; font-weight: 500; color: #fff; margin: 0; }

.live-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 30px;
  font-size: 11px;
  color: #8a8a95;
}

.live-pulse {
  width: 6px;
  height: 6px;
  background: #2ecc71;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse { 50% { opacity: 0.4; } }

.live-time { color: #4a4a55; }

.header-right { display: flex; gap: 8px; }

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(20,20,25,0.8);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.15s;
  backdrop-filter: blur(4px);
}

.action-btn:hover { border-color: rgba(255,69,0,0.3); color: #ff4500; }
.action-btn.primary { background: #ff4500; color: #fff; border-color: #ff4500; }
.action-btn.primary:hover { background: #ff5722; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,69,0,0.3); }

/* ===== LOADING/ERROR ===== */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #8a8a95;
}

.loader {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255,69,0,0.2);
  border-top-color: #ff4500;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

.error-state h3 { color: #fff; margin: 16px 0 8px; font-weight: 500; }

/* ===== DASHBOARD VIEW ===== */
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.hero-card {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.hero-card:hover {
  border-color: rgba(255,69,0,0.3);
  transform: translateY(-2px);
}

.hero-card.primary { background: rgba(255,69,0,0.05); border-color: rgba(255,69,0,0.2); }

.hero-icon {
  width: 56px;
  height: 56px;
  background: rgba(255,69,0,0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4500;
}

.hero-content { flex: 1; }
.hero-label {
  display: block;
  font-size: 11px;
  color: #8a8a95;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.hero-value {
  display: block;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 4px;
}
.hero-trend {
  font-size: 11px;
  color: #2ecc71;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.chart-panel {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.period-label {
  color: #ff4500;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255,69,0,0.1);
  padding: 4px 12px;
  border-radius: 30px;
}

.chart-area { height: 200px; }

.timeline-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.timeline-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a0a0a8;
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-block {
  background: rgba(255,69,0,0.05);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,69,0,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4500;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-block-label {
  font-size: 10px;
  color: #8a8a95;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.stat-block-value {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.stats-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 11px;
  color: #8a8a95;
}

.repo-age, .last-updated {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Activity Grid */
.activity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.activity-panel {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 20px;
}

.activity-panel.compact {
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.compact-feed {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: none;
  overflow-y: visible;
}

.compact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255,255,255,0.02);
  font-size: 12px;
}
.compact-item:hover { background: rgba(255,69,0,0.05); transform: translateX(4px); }

.compact-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ff4500;
}

.compact-details {
  flex: 1;
}

.compact-message {
  display: block;
  color: #fff;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.compact-meta {
  display: flex;
  gap: 6px;
  font-size: 10px;
  color: #8a8a95;
}

.compact-emoji {
  font-size: 14px;
}

.compact-rank {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.rank-1 { background: #ffd700; color: #000; }
.rank-2 { background: #c0c0c0; color: #333; }
.rank-3 { background: #cd7f32; color: #fff; }

.compact-name {
  flex: 1;
  color: #fff;
}

.compact-count {
  color: #ff8c00;
  font-size: 10px;
}

.compact-number {
  color: #ff4500;
  font-weight: 600;
  font-size: 11px;
  min-width: 40px;
}

/* Battle Grid */
.battle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.battle-card {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 20px;
}

.battle-card.compact {
  padding: 16px;
}

.battle-card.issues { border-top: 3px solid #3498db; }
.battle-card.prs { border-top: 3px solid #2ecc71; }

.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.battle-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 14px;
}

.battle-count {
  background: rgba(255,255,255,0.1);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
}

.battle-footer {
  display: block;
  text-align: center;
  margin-top: 12px;
  padding: 6px;
  background: rgba(255,69,0,0.05);
  border-radius: 6px;
  color: #ff4500;
  text-decoration: none;
  font-size: 11px;
}
.battle-footer:hover { background: rgba(255,69,0,0.1); }

.battle-footer.compact {
  margin-top: 8px;
  padding: 4px;
}

/* Champion Spotlight */
.champion-spotlight {
  background: linear-gradient(135deg, rgba(255,69,0,0.1), rgba(255,69,0,0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,69,0,0.2);
  border-radius: 16px;
  padding: 20px;
}

.champion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.champion-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4500;
  font-weight: 500;
  font-size: 13px;
}

.champion-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff4500;
  text-decoration: none;
  font-size: 12px;
  opacity: 0.8;
}
.champion-link:hover { opacity: 1; gap: 8px; }

.champion-content {
  display: flex;
  gap: 24px;
  align-items: center;
}

.champion-avatar {
  position: relative;
  width: 80px;
  height: 80px;
}

.champion-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #ff4500;
}

.champion-crown {
  position: absolute;
  top: -12px;
  right: -8px;
  font-size: 28px;
  filter: drop-shadow(0 4px 8px gold);
  transform: rotate(15deg);
}

.champion-info h2 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
}

.champion-stats {
  display: flex;
  gap: 24px;
}

.champion-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8a8a95;
  font-size: 14px;
}
.champion-stat svg { color: #ff4500; }

/* ===== FILES VIEW ===== */
.files-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.files-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.files-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(15,15,20,0.6);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 30px;
  width: 250px;
}

.search-box input {
  background: none;
  border: none;
  color: #fff;
  width: 100%;
  font-size: 12px;
}

.search-box input:focus {
  outline: none;
}

.files-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: calc(100vh - 180px);
}

.files-sidebar {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  overflow-y: auto;
  padding: 16px;
}

.file-tree {
  font-family: 'SF Mono', monospace;
  font-size: 13px;
}

.tree-item {
  margin-bottom: 4px;
}

.tree-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.tree-row:hover { background: rgba(255,69,0,0.08); }

.tree-icon {
  font-size: 16px;
  width: 24px;
}

.tree-name {
  flex: 1;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-name.search-highlight {
  color: #ff4500;
  font-weight: 600;
}

.tree-size {
  color: #60606a;
  font-size: 11px;
  margin-right: 4px;
}

.tree-arrow {
  color: #ff4500;
  font-size: 12px;
  margin-left: 4px;
}

.tree-children {
  margin-left: 8px;
}

.edit-btn {
  background: none;
  border: none;
  color: #ff4500;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  opacity: 0.7;
}
.edit-btn:hover { opacity: 1; }

.file-preview {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-preview.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #60606a;
  gap: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

.preview-path {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4500;
  font-size: 13px;
  font-family: monospace;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255,69,0,0.1);
  border: 1px solid rgba(255,69,0,0.2);
  border-radius: 6px;
  color: #ff4500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}
.icon-btn:hover {
  background: #ff4500;
  color: #fff;
}

.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: rgba(0,0,0,0.3);
}

.file-metadata {
  display: flex;
  gap: 24px;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 12px;
  color: #a0a0a8;
}

.file-metadata strong {
  color: #ff4500;
  font-weight: 500;
}

.preview-content pre {
  margin: 0;
  color: #e0e0e0;
  font-family: 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
}

/* ===== AUDIT VIEW ===== */
.audit-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.audit-header h2 {
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.audit-count {
  background: rgba(255,69,0,0.1);
  color: #ff4500;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
}

.audit-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.timeline-event {
  display: flex;
  gap: 16px;
  cursor: pointer;
}

.event-marker {
  width: 4px;
  border-radius: 4px;
}
.event-marker.commit { background: #3498db; }
.event-marker.pr { background: #2ecc71; }
.event-marker.issue { background: #e74c3c; }

.event-card {
  flex: 1;
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
}
.timeline-event:hover .event-card { background: rgba(255,69,0,0.05); border-color: rgba(255,69,0,0.2); }

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.event-badge.commit { background: rgba(52,152,219,0.15); color: #3498db; }
.event-badge.pr { background: rgba(46,204,113,0.15); color: #2ecc71; }
.event-badge.issue { background: rgba(231,76,60,0.15); color: #e74c3c; }

.event-time { font-size: 11px; color: #60606a; }

.event-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.event-message { color: #fff; font-size: 13px; }
.event-author { color: #ff4500; font-size: 12px; }

/* ===== CONTRIBUTORS VIEW ===== */
.contributors-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contributors-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-orb {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 24px;
  padding: 24px;
  text-align: center;
}

.orb-value {
  display: block;
  font-size: 36px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}
.orb-label { font-size: 13px; color: #8a8a95; }

.contributors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.contributor-card {
  position: relative;
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.contributor-card:hover {
  border-color: rgba(255,69,0,0.3);
  transform: translateY(-4px);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255,69,0,0.2), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.contributor-card:hover .card-glow { opacity: 1; }

.card-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #ff4500;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.card-info h3 { font-size: 18px; font-weight: 600; color: #fff; margin: 0; }

.card-role {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
}
.card-role.core { background: rgba(255,215,0,0.15); color: #ffd700; }
.card-role.regular { background: rgba(255,69,0,0.15); color: #ff4500; }

.card-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.card-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8a8a95;
  font-size: 12px;
}
.card-stat span { color: #fff; font-weight: 500; margin-left: 2px; }

.card-impact { margin-top: 8px; }
.impact-track {
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
  overflow: hidden;
}
.impact-fill { height: 100%; background: #ff4500; border-radius: 2px; }

/* ===== ANALYTICS VIEW ===== */
.analytics-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.analytics-header h2 {
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.analytics-period {
  display: flex;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  border-radius: 30px;
  padding: 4px;
}

.period-btn {
  padding: 6px 16px;
  background: transparent;
  border: none;
  border-radius: 30px;
  color: #8a8a95;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.period-btn:hover { color: #ff4500; }
.period-btn.active {
  background: #ff4500;
  color: #fff;
}

.analytics-dashboard {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.analytics-card {
  background: rgba(15,15,20,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 20px;
}

.analytics-card.span-2 { grid-column: span 2; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.card-badge {
  background: rgba(255,69,0,0.1);
  color: #ff4500;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 11px;
}

.chart-wrapper { height: 250px; }

.chart-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer-stat {
  text-align: center;
}

.footer-stat .stat-label {
  display: block;
  font-size: 11px;
  color: #8a8a95;
  margin-bottom: 4px;
}

.footer-stat .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #ff4500;
}

/* Language Stats */
.language-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.language-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
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
}

.lang-name {
  color: #fff;
  font-size: 13px;
}

.lang-percent {
  color: #ff4500;
  font-size: 12px;
  font-weight: 500;
}

.lang-bytes {
  color: #8a8a95;
  font-size: 11px;
  min-width: 60px;
  text-align: right;
}

.progress-bar {
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* PR Stats */
.pr-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pr-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.pr-stat:last-child { border-bottom: none; }

.pr-stat .stat-label {
  color: #8a8a95;
  font-size: 13px;
}

.pr-stat .stat-value {
  color: #ff4500;
  font-size: 18px;
  font-weight: 600;
}

/* ===== TOAST ===== */
.toast-zone {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast-message {
  padding: 12px 20px;
  background: rgba(20,20,25,0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 30px;
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 20px;
  animation: slideUp 0.3s;
}

.toast-message.success { border-left: 3px solid #2ecc71; }
.toast-message.error { border-left: 3px solid #e74c3c; }
.toast-message button {
  background: none;
  border: none;
  color: #60606a;
  font-size: 18px;
  cursor: pointer;
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .hero-stats { grid-template-columns: repeat(2, 1fr); }
  .charts-section { grid-template-columns: 1fr; }
  .activity-grid { grid-template-columns: 1fr; }
  .battle-grid { grid-template-columns: 1fr; }
  .analytics-dashboard { grid-template-columns: 1fr; }
  .analytics-card.span-2 { grid-column: span 1; }
  .contributors-header { grid-template-columns: 1fr; }
  .files-layout { grid-template-columns: 1fr; }
  .files-sidebar { max-height: 300px; }
}

@media (max-width: 900px) {
  .docs-sidebar { width: 72px; }
  .docs-main { margin-left: 72px; }
  .sidebar-brand .brand-text,
  .nav-label,
  .nav-badge,
  .repo-card,
  .sync-button span { display: none; }
  .nav-item { justify-content: center; padding: 10px; }
}

@media (max-width: 700px) {
  .docs-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .hero-stats { grid-template-columns: 1fr; }
  .audit-header { flex-direction: column; align-items: flex-start; }
  .language-item { grid-template-columns: 1fr; }
  .lang-bytes { text-align: left; }
}

.contributor-badge-mini {
  font-size: 8px;
  padding: 2px 4px;
  border-radius: 10px;
  font-weight: 600;
  margin-left: 4px;
  white-space: nowrap;
  color: white;
}

.activity-panel.compact {
  scrollbar-width: thin;
  scrollbar-color: #ff4500 #1a1a22;
}

.activity-panel.compact::-webkit-scrollbar {
  width: 4px;
}

.activity-panel.compact::-webkit-scrollbar-track {
  background: #1a1a22;
}

.activity-panel.compact::-webkit-scrollbar-thumb {
  background: #ff4500;
  border-radius: 4px;
}
</style>