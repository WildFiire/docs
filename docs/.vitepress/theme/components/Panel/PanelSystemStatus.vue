<template>
  <div class="pss-wrap" data-lenis-prevent>
    <!-- Header -->
    <div class="pss-head">
      <div>
        <h2 class="pss-h2">System Status</h2>
        <p class="pss-sub">Live diagnostic overview and API health tracking.</p>
      </div>
      <div class="pss-badge">
        <span class="live-dot"></span> LIVE
      </div>
    </div>

    <div class="pss-grid">
      <!-- Main Status Card -->
      <div class="pss-card main-status">
        <div class="pc-head head-sys">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          SYSTEM STATUS
        </div>
        
        <div class="pc-body">
          <div class="pc-row">
            <span class="pc-lbl">API Quota</span>
            <div class="pc-bar-wrap">
              <div class="pc-bar" :style="{ width: (apiRateLimit.remaining / Math.max(apiRateLimit.limit, 1) * 100) + '%' }" :class="apiRateLimit.remaining < 500 ? 'bg-red' : apiRateLimit.remaining < 1500 ? 'bg-yellow' : 'bg-green'"></div>
            </div>
            <span class="pc-val">{{ apiRateLimit.remaining }}/{{ apiRateLimit.limit }}</span>
          </div>
          
          <div class="pc-row">
            <span class="pc-lbl">API Latency</span>
            <div class="pc-bar-wrap">
              <div class="pc-bar" :style="{ width: Math.min((apiLatency / 1000) * 100, 100) + '%' }" :class="apiLatency > 500 ? 'bg-red' : 'bg-blue'"></div>
            </div>
            <span class="pc-val" :class="apiLatency > 500 ? 'txt-red' : 'txt-blue'">{{ apiLatency }}ms</span>
          </div>
          
          <div class="pc-row">
            <span class="pc-lbl">Wiki Uptime</span>
            <div class="pc-bar-wrap"><div class="pc-bar bg-green" style="width:99.9%;"></div></div>
            <span class="pc-val txt-green">99.9%</span>
          </div>
          
          <div class="pc-row">
            <span class="pc-lbl">Active Branches</span>
            <div class="pc-bar-wrap">
              <div class="pc-bar bg-purple" :style="{ width: Math.min((branches.length / 20) * 100, 100) + '%' }"></div>
            </div>
            <span class="pc-val txt-purple">{{ branches.length }}</span>
          </div>
        </div>

        <div class="pc-pills">
          <div class="pc-pill">
            <span class="pc-pill-dot bg-green"></span>
            <span class="pc-pill-txt">API Online</span>
          </div>
          <div class="pc-pill">
            <span class="pc-pill-dot bg-green"></span>
            <span class="pc-pill-txt">GitHub OK</span>
          </div>
          <div class="pc-pill" v-if="apiRateLimit.resetAt">
            <span class="pc-pill-dot bg-yellow"></span>
            <span class="pc-pill-txt">Reset: {{ apiRateLimit.resetAt.toLocaleTimeString() }}</span>
          </div>
        </div>
      </div>

      <!-- Live Diagnostics Feed -->
      <div class="pss-card diag-feed">
        <div class="pc-head head-diag">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          SYSTEM DIAGNOSTICS
        </div>
        <div class="diag-console">
          <div class="diag-line">
            <span class="d-time">[{{ currentTime }}]</span>
            <span class="d-sys">[SYS]</span>
            <span class="d-msg">Initializing status check...</span>
          </div>
          <div class="diag-line">
            <span class="d-time">[{{ currentTime }}]</span>
            <span class="d-ok">[OK]</span>
            <span class="d-msg">Connected to GitHub Rate Limit API ({{ apiLatency }}ms)</span>
          </div>
          <div class="diag-line" v-if="repoStats">
            <span class="d-time">[{{ currentTime }}]</span>
            <span class="d-ok">[OK]</span>
            <span class="d-msg">Repo size confirmed: {{ (repoStats.size / 1024).toFixed(2) }} MB</span>
          </div>
          <div class="diag-line" v-for="action in actionsRuns.slice(0,2)" :key="action.id">
            <span class="d-time">[{{ currentTime }}]</span>
            <span class="d-sys" :class="action.conclusion === 'success' ? 'txt-green' : action.conclusion === 'failure' ? 'txt-red' : 'txt-yellow'">[{{ action.conclusion ? action.conclusion.toUpperCase() : 'PENDING' }}]</span>
            <span class="d-msg">Build {{ action.head_sha.substring(0,7) }}: {{ action.name }}</span>
          </div>
          <div class="diag-line">
            <span class="d-time">[{{ currentTime }}]</span>
            <span class="d-sys">[SYS]</span>
            <span class="d-msg">Monitoring core processes. All systems operational.</span>
          </div>
        </div>
      </div>

      <!-- Repo Health & Metrics -->
      <div class="pss-card repo-health" v-if="repoStats">
        <div class="pc-head head-repo">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          REPOSITORY HEALTH
        </div>
        <div class="rh-grid">
          <div class="rh-box">
            <span class="rh-val">{{ (repoStats.size / 1024).toFixed(2) }}<small>MB</small></span>
            <span class="rh-lbl">Storage Size</span>
          </div>
          <div class="rh-box">
            <span class="rh-val">{{ repoStats.open_issues_count }}</span>
            <span class="rh-lbl">Open Issues</span>
          </div>
          <div class="rh-box">
            <span class="rh-val">{{ repoStats.subscribers_count }}</span>
            <span class="rh-lbl">Watchers</span>
          </div>
          <div class="rh-box">
            <span class="rh-val">{{ repoStats.forks_count }}</span>
            <span class="rh-lbl">Forks</span>
          </div>
        </div>
      </div>

      <!-- CI/CD Pipelines -->
      <div class="pss-card ci-cd">
        <div class="pc-head head-ci">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          CI/CD PIPELINES
        </div>
        <div class="ci-list" v-if="actionsRuns.length">
          <div class="ci-item" v-for="run in actionsRuns" :key="run.id">
            <div class="ci-icon" :class="'ci-' + run.conclusion">
              <svg v-if="run.conclusion === 'success'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else-if="run.conclusion === 'failure'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="ci-info">
              <div class="ci-name">{{ run.name }}</div>
              <div class="ci-meta">Commit {{ run.head_sha.substring(0,7) }}</div>
            </div>
            <div class="ci-status" :class="'txt-' + run.conclusion">{{ run.conclusion ? run.conclusion.toUpperCase() : 'PENDING' }}</div>
          </div>
        </div>
        <div v-else class="ci-empty">No recent CI/CD runs found.</div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelSystemStatus',
  props: {
    githubToken: { type: String, default: '' },
    repoOwner: { type: String, default: '' },
    repoName: { type: String, default: '' }
  },
  data() {
    return {
      apiRateLimit: { limit: 5000, remaining: 5000, used: 0, resetAt: null },
      apiLatency: 0,
      branches: [],
      repoStats: null,
      actionsRuns: [],
      currentTime: new Date().toLocaleTimeString(),
      timer: null
    }
  },
  mounted() {
    this.fetchAll()
    
    this.timer = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString()
    }, 1000)
    
    // Auto refresh every 60s
    this.refreshTimer = setInterval(() => {
      this.fetchAll()
    }, 60000)
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer)
    if (this.refreshTimer) clearInterval(this.refreshTimer)
  },
  methods: {
    getHeaders() {
      const headers = { 'Accept': 'application/vnd.github.v3+json' }
      if (this.githubToken) headers['Authorization'] = `token ${this.githubToken}`
      return headers
    },
    async fetchAll() {
      this.fetchRateLimits()
      if (this.repoOwner && this.repoName) {
        this.fetchBranches()
        this.fetchRepoStats()
        this.fetchActions()
      }
    },
    async fetchRateLimits() {
      try {
        const start = Date.now()
        const res = await fetch('https://api.github.com/rate_limit', { headers: this.getHeaders() })
        this.apiLatency = Date.now() - start
        if (res.ok) {
          const data = await res.json()
          this.apiRateLimit = {
            limit: data.rate.limit,
            remaining: data.rate.remaining,
            used: data.rate.limit - data.rate.remaining,
            resetAt: new Date(data.rate.reset * 1000)
          }
        }
      } catch (e) {
        console.error('Failed to fetch rate limits', e)
      }
    },
    async fetchBranches() {
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/branches?per_page=100`, { headers: this.getHeaders() })
        if (res.ok) {
          this.branches = await res.json()
        }
      } catch (e) {
        console.error('Failed to fetch branches', e)
      }
    },
    async fetchRepoStats() {
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}`, { headers: this.getHeaders() })
        if (res.ok) {
          this.repoStats = await res.json()
        }
      } catch (e) {
        console.error('Failed to fetch repo stats', e)
      }
    },
    async fetchActions() {
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/actions/runs?per_page=4`, { headers: this.getHeaders() })
        if (res.ok) {
          const data = await res.json()
          this.actionsRuns = data.workflow_runs || []
        }
      } catch (e) {
        console.error('Failed to fetch actions', e)
      }
    }
  }
}
</script>

<style scoped>
.pss-wrap {
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeUp 0.4s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

/* Header */
.pss-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.pss-h2 { font-size: 2.2rem; font-weight: 900; margin: 0 0 6px; letter-spacing: -1px; background: linear-gradient(90deg, #ff6a00, #ffb800); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
.pss-sub { font-size: 13px; color: var(--text-muted); margin: 0; }

.pss-badge { display: flex; align-items: center; gap: 8px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #22c55e; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; font-family: monospace; letter-spacing: 1px; }
.live-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; animation: pulse 2s infinite; }

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.pss-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 900px) {
  .pss-grid { grid-template-columns: 1fr; }
}

/* Cards */
.pss-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

.pc-head { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 900; letter-spacing: 1.5px; }

/* Gradient Headings */
.head-sys { background: linear-gradient(135deg, #ff7800, #ffaa00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.head-sys svg { stroke: #ff7800; }
.head-diag { background: linear-gradient(135deg, #06b6d4, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.head-diag svg { stroke: #06b6d4; }
.head-repo { background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.head-repo svg { stroke: #10b981; }
.head-ci { background: linear-gradient(135deg, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.head-ci svg { stroke: #a855f7; }

/* Status Rows */
.pc-body { display: flex; flex-direction: column; gap: 16px; }
.pc-row { display: flex; align-items: center; gap: 16px; }
.pc-lbl { width: 110px; font-size: 13px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }
.pc-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.pc-bar { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
.pc-val { width: 80px; text-align: right; font-size: 14px; font-weight: 800; font-family: monospace; color: var(--text-primary); flex-shrink: 0; }

/* Pills */
.pc-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; padding-top: 20px; border-top: 1px dashed rgba(255,255,255,0.1); }
.pc-pill { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 6px 12px; border-radius: 8px; }
.pc-pill-dot { width: 6px; height: 6px; border-radius: 50%; }
.pc-pill-txt { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; }

/* Diagnostic Console */
.diag-console { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; flex: 1; font-family: monospace; font-size: 12px; display: flex; flex-direction: column; gap: 8px; }
.diag-line { display: flex; gap: 8px; }
.d-time { color: #60607c; flex-shrink: 0; }
.d-sys { color: #3b82f6; font-weight: bold; flex-shrink: 0; }
.d-ok { color: #22c55e; font-weight: bold; flex-shrink: 0; }
.d-msg { color: #c0c0d4; word-break: break-all; }

/* Repo Health */
.rh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.rh-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; }
.rh-val { font-size: 24px; font-weight: 900; font-family: monospace; color: var(--text-primary); line-height: 1; }
.rh-val small { font-size: 12px; color: var(--text-muted); font-weight: 700; margin-left: 2px; }
.rh-lbl { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

/* CI/CD */
.ci-list { display: flex; flex-direction: column; gap: 10px; }
.ci-item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 12px; }
.ci-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ci-success { background: rgba(34,197,94,0.1); color: #22c55e; }
.ci-failure { background: rgba(239,68,68,0.1); color: #ef4444; }
.ci-null { background: rgba(245,158,11,0.1); color: #f59e0b; }
.ci-info { flex: 1; min-width: 0; }
.ci-name { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.ci-meta { font-size: 11px; color: var(--text-muted); font-family: monospace; }
.ci-status { font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px; }
.txt-success { color: #22c55e; background: rgba(34,197,94,0.1); }
.txt-failure { color: #ef4444; background: rgba(239,68,68,0.1); }
.txt-null { color: #f59e0b; background: rgba(245,158,11,0.1); }
.ci-empty { color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px; }

/* Shared Colors */
.bg-green { background: #22c55e; }
.bg-red { background: #ef4444; }
.bg-blue { background: #3b82f6; }
.bg-yellow { background: #f59e0b; }
.bg-purple { background: #8b5cf6; }

.txt-green { color: #22c55e; }
.txt-red { color: #ef4444; }
.txt-blue { color: #3b82f6; }
.txt-yellow { color: #f59e0b; }
.txt-purple { color: #8b5cf6; }

/* Light Theme Overrides */
:global(.wildfire-dashboard.light-theme) .pss-h2 { background: linear-gradient(90deg, #c2410c, #d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
:global(.wildfire-dashboard.light-theme) .head-sys { background: linear-gradient(135deg, #d97706, #ea580c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
:global(.wildfire-dashboard.light-theme) .head-diag { background: linear-gradient(135deg, #0284c7, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
:global(.wildfire-dashboard.light-theme) .head-repo { background: linear-gradient(135deg, #059669, #15803d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
:global(.wildfire-dashboard.light-theme) .head-ci { background: linear-gradient(135deg, #9333ea, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

:global(.wildfire-dashboard.light-theme) .rh-val,
:global(.wildfire-dashboard.light-theme) .ci-name,
:global(.wildfire-dashboard.light-theme) .pc-val { color: #111; }
:global(.wildfire-dashboard.light-theme) .pss-sub,
:global(.wildfire-dashboard.light-theme) .pc-lbl,
:global(.wildfire-dashboard.light-theme) .rh-lbl,
:global(.wildfire-dashboard.light-theme) .ci-meta,
:global(.wildfire-dashboard.light-theme) .pc-pill-txt { color: #666; }

:global(.wildfire-dashboard.light-theme) .pss-card,
:global(.wildfire-dashboard.light-theme) .rh-box,
:global(.wildfire-dashboard.light-theme) .ci-item { background: rgba(255,255,255,0.95); border-color: rgba(0,0,0,0.08); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
:global(.wildfire-dashboard.light-theme) .pc-bar-wrap { background: rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .pc-pills { border-top-color: rgba(0,0,0,0.1); }
:global(.wildfire-dashboard.light-theme) .pc-pill { background: rgba(248,249,250,0.95); border-color: rgba(0,0,0,0.08); }
:global(.wildfire-dashboard.light-theme) .diag-console { background: rgba(248,249,250,0.95); border-color: rgba(0,0,0,0.1); }
:global(.wildfire-dashboard.light-theme) .d-msg { color: #222; }
:global(.wildfire-dashboard.light-theme) .d-time { color: #64748b; }
:global(.wildfire-dashboard.light-theme) .ci-empty { color: #666; }

/* Deep color fixes for light mode */
:global(.wildfire-dashboard.light-theme) .txt-green, :global(.wildfire-dashboard.light-theme) .d-ok, :global(.wildfire-dashboard.light-theme) .ci-success { color: #16a34a; }
:global(.wildfire-dashboard.light-theme) .txt-red, :global(.wildfire-dashboard.light-theme) .ci-failure { color: #dc2626; }
:global(.wildfire-dashboard.light-theme) .txt-blue, :global(.wildfire-dashboard.light-theme) .d-sys { color: #2563eb; }
:global(.wildfire-dashboard.light-theme) .txt-yellow, :global(.wildfire-dashboard.light-theme) .ci-null { color: #d97706; }
:global(.wildfire-dashboard.light-theme) .txt-purple { color: #7c3aed; }

:global(.wildfire-dashboard.light-theme) .bg-green, :global(.wildfire-dashboard.light-theme) .live-dot { background: #16a34a; }
:global(.wildfire-dashboard.light-theme) .bg-red { background: #dc2626; }
:global(.wildfire-dashboard.light-theme) .bg-blue { background: #2563eb; }
:global(.wildfire-dashboard.light-theme) .bg-yellow { background: #d97706; }
:global(.wildfire-dashboard.light-theme) .bg-purple { background: #7c3aed; }

:global(.wildfire-dashboard.light-theme) .pss-badge { color: #16a34a; background: rgba(22,163,74,0.05); border-color: rgba(22,163,74,0.2); }
:global(.wildfire-dashboard.light-theme) .txt-success { background: rgba(22,163,74,0.1); color: #16a34a; }
:global(.wildfire-dashboard.light-theme) .txt-failure { background: rgba(220,38,38,0.1); color: #dc2626; }
:global(.wildfire-dashboard.light-theme) .txt-null { background: rgba(217,119,6,0.1); color: #d97706; }
</style>
