<template>
  <div class="repo-stats-card">
    <!-- Ambient Background -->
    <div class="card-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>
      <div class="bg-particles"></div>
    </div>

    <!-- Stats Grid - Always visible -->
    <div class="stats-container">
      <!-- Contributors -->
      <div class="stat-item" @click="openGitHub('contributors')">
        <div class="stat-icon contributors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatNumber(stats.contributors) }}</span>
          <span class="stat-label">contrib</span>
        </div>
        <span class="stat-update" v-if="updating.contributors">↻</span>
      </div>

      <!-- Total Commits -->
      <div class="stat-item" @click="openGitHub('commits')">
        <div class="stat-icon commits">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatNumber(stats.totalCommits) }}</span>
          <span class="stat-label">commits</span>
        </div>
        <span class="stat-update" v-if="updating.commits">↻</span>
      </div>

      <!-- Stars -->
      <div class="stat-item" @click="openGitHub('stars')">
        <div class="stat-icon stars">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatNumber(stats.stars) }}</span>
          <span class="stat-label">stars</span>
        </div>
      </div>

      <!-- Forks -->
      <div class="stat-item" @click="openGitHub('forks')">
        <div class="stat-icon forks">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="18" r="3"/>
            <circle cx="6" cy="6" r="3"/>
            <circle cx="18" cy="6" r="3"/>
            <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/>
            <path d="M12 12v3"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatNumber(stats.forks) }}</span>
          <span class="stat-label">forks</span>
        </div>
      </div>
    </div>

    <!-- Footer with repo info and refresh -->
    <div class="card-footer">
      <div class="repo-info" @click="openGitHub('repo')">
        <div class="repo-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
        </div>
        <span class="repo-owner">{{ owner }}</span>
        <span class="repo-separator">/</span>
        <span class="repo-name">{{ repo }}</span>
      </div>

      <div class="footer-actions">
        <div class="live-badge">
          <span class="live-pulse"></span>
          <span class="live-text">LIVE</span>
        </div>
        <button class="refresh-btn" @click="refreshData" :disabled="updating.any">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ spin: updating.any }">
            <path d="M21 12C21 13.2 20.5 14.2 19.7 15.1C18.9 15.9 17.8 16.5 16.5 16.8C15.2 17.1 13.8 17.1 12.1 16.9" />
            <path d="M9 19C7.5 18.5 6.2 17.7 5.1 16.8C3.3 15.4 2 13.3 2 11C2 6.6 6.1 3 11 3" />
            <path d="M16 8L21 3L16 8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RepoStatsCard',
  
  props: {
    githubToken: {
      type: String,
      default: null
    },
    owner: {
      type: String,
      default: 'Wildfiire'
    },
    repo: {
      type: String,
      default: 'docs'
    }
  },

  data() {
    return {
      stats: {
        contributors: 0,
        totalCommits: 0,
        stars: 0,
        forks: 0
      },
      updating: {
        contributors: false,
        commits: false,
        any: false
      },
      refreshTimer: null
    }
  },

  mounted() {
    this.loadInitialData()
    this.refreshTimer = setInterval(() => {
      this.refreshData(true)
    }, 30000)
  },

  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  },

  methods: {
    getToken() {
      return this.githubToken || 
             window.__GITHUB_TOKEN || 
             import.meta.env.VITE_GITHUB_TOKEN
    },

    async loadInitialData() {
      const token = this.getToken()
      if (!token) return

      try {
        const headers = {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
        const baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`
        const timestamp = Date.now()

        // Load stars and forks first (fast)
        const repoRes = await fetch(`${baseUrl}?_=${timestamp}`, { headers })
        if (repoRes.ok) {
          const repoData = await repoRes.json()
          this.stats.stars = repoData.stargazers_count || 0
          this.stats.forks = repoData.forks_count || 0
        }

        // Load commits and contributors in background
        this.loadCommitsData(headers, baseUrl, timestamp)
        
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    },

    async loadCommitsData(headers, baseUrl, timestamp) {
      this.updating.commits = true
      this.updating.contributors = true
      this.updating.any = true

      try {
        // Get total commits count from Link header
        const commitsRes = await fetch(`${baseUrl}/commits?per_page=1&_=${timestamp}`, { headers })
        if (commitsRes.ok) {
          const linkHeader = commitsRes.headers.get('Link')
          if (linkHeader) {
            const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
            this.stats.totalCommits = match ? parseInt(match[1]) : 0
          }
        }
        this.updating.commits = false

        // Fetch all commits to count contributors
        let allCommits = []
        let page = 1
        let hasMore = true
        
        while (hasMore && page <= 10) { // 10 pages = 1000 commits
          const res = await fetch(
            `${baseUrl}/commits?per_page=100&page=${page}&_=${timestamp}`,
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

        // Count unique contributors
        const contributorSet = new Set()
        
        allCommits.forEach(commit => {
          // Try to get author login from different sources
          let login = null
          
          if (commit.author && commit.author.login) {
            login = commit.author.login
          } else if (commit.committer && commit.committer.login) {
            login = commit.committer.login
          } else if (commit.commit && commit.commit.author && commit.commit.author.name) {
            // Fallback to author name if no login
            login = commit.commit.author.name.replace(/\s+/g, '').toLowerCase()
          }
          
          if (login) {
            contributorSet.add(login)
          }
        })
        
        this.stats.contributors = contributorSet.size
        console.log(`✅ Found ${this.stats.contributors} contributors from commit history`)
        
      } catch (error) {
        console.error('Error loading commits data:', error)
      } finally {
        this.updating.contributors = false
        this.updating.any = false
      }
    },

    async refreshData(silent = false) {
      if (!silent) {
        this.updating.any = true
      }

      const token = this.getToken()
      if (!token) {
        this.updating.any = false
        return
      }

      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
      const baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`
      const timestamp = Date.now()

      try {
        // Update stars and forks
        const repoRes = await fetch(`${baseUrl}?_=${timestamp}`, { headers })
        if (repoRes.ok) {
          const repoData = await repoRes.json()
          this.stats.stars = repoData.stargazers_count || 0
          this.stats.forks = repoData.forks_count || 0
        }

        // Update commits and contributors
        await this.loadCommitsData(headers, baseUrl, timestamp)
        
      } catch (error) {
        console.error('Error refreshing data:', error)
      } finally {
        if (!silent) {
          this.updating.any = false
        }
      }
    },

    formatNumber(num) {
      if (!num && num !== 0) return '0'
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
      return num.toString()
    },

    openGitHub(type) {
      const urls = {
        repo: `https://github.com/${this.owner}/${this.repo}`,
        commits: `https://github.com/${this.owner}/${this.repo}/commits/main`,
        contributors: `https://github.com/${this.owner}/${this.repo}/graphs/contributors`,
        stars: `https://github.com/${this.owner}/${this.repo}/stargazers`,
        forks: `https://github.com/${this.owner}/${this.repo}/forks`
      }
      window.open(urls[type] || urls.repo, '_blank')
    }
  }
}
</script>

<style scoped>
/* ===== REPO STATS CARD - MIC ȘI ELEGANT ===== */
.repo-stats-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  padding: 16px 20px;
  color: var(--vp-c-text-1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Orbitron', sans-serif;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  width: 100%;
  margin: 0 0 24px 0;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: all 0.2s ease;
}

.repo-stats-card:hover {
  border-color: #ff4500;
  box-shadow: 0 12px 28px rgba(255,69,0,0.12);
}

/* Background Effects */
.card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,69,0,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,69,0,0.02) 1px, transparent 1px);
  background-size: 24px 24px;
}

.bg-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255,69,0,0.04) 0%, transparent 70%);
  filter: blur(50px);
}

.bg-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(255,69,0,0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Stats Container - 4 pe orizontală */
.stats-container {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

/* Stat Item - MIC */
.stat-item {
  flex: 1;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,69,0,0.12);
  border-radius: 16px;
  padding: 10px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.dark .stat-item {
  background: rgba(0,0,0,0.2);
}

.stat-item:hover {
  border-color: #ff4500;
  background: rgba(255,69,0,0.05);
  transform: translateY(-1px);
}

/* Stat Icons - MICI */
.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,69,0,0.1);
  color: #ff4500;
  border: 1px solid rgba(255,69,0,0.15);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.stat-item:hover .stat-icon {
  background: #ff4500;
  color: white;
}

.stat-icon svg {
  width: 18px;
  height: 18px;
}

/* Stat Content */
.stat-content {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #ff4500;
  font-family: 'Orbitron', sans-serif;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.stat-item:hover .stat-value {
  color: #ff8c00;
}

.stat-label {
  font-size: 10px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-family: 'Orbitron', sans-serif;
  white-space: nowrap;
}

.stat-update {
  font-size: 10px;
  color: #ff4500;
  animation: spin 1s linear infinite;
  margin-left: 2px;
  flex-shrink: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Footer */
.card-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(255,69,0,0.1);
}

/* Repo Info */
.repo-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255,69,0,0.05);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
}

.repo-info:hover {
  background: rgba(255,69,0,0.15);
}

.repo-icon {
  width: 22px;
  height: 22px;
  background: rgba(255,69,0,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4500;
}

.repo-icon svg {
  width: 12px;
  height: 12px;
}

.repo-owner {
  color: #ff4500;
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
}

.repo-separator {
  color: var(--vp-c-text-3);
}

.repo-name {
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-family: 'Orbitron', sans-serif;
}

/* Footer Actions */
.footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255,69,0,0.1);
  border: 1px solid rgba(255,69,0,0.15);
  border-radius: 30px;
}

.live-pulse {
  width: 6px;
  height: 6px;
  background: #ff4500;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.live-text {
  font-size: 9px;
  font-weight: 600;
  color: #ff4500;
  letter-spacing: 0.3px;
  font-family: 'Orbitron', sans-serif;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.2); }
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: rgba(255,69,0,0.1);
  border: 1px solid rgba(255,69,0,0.15);
  border-radius: 50%;
  color: #ff4500;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #ff4500;
  color: white;
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: wait;
}

.refresh-btn svg.spin {
  animation: spin 1s linear infinite;
}

/* Light mode adjustments */
html:not(.dark) .stat-item {
  background: rgba(255,255,255,0.7);
}

html:not(.dark) .repo-stats-card {
  background: rgba(255,255,255,0.9);
}

/* Stat item clickable */
.stat-item {
  cursor: pointer;
}

/* Responsive */
@media (max-width: 600px) {
  .stats-container {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex: 1 1 calc(50% - 4px);
  }
  
  .card-footer {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>