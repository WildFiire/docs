<template>
  <div class="mon-wrap" :class="{ light: isLightTheme }" data-lenis-prevent>

    <!-- HEADER -->
    <div class="mon-header">
      <div class="mon-title-block">
        <div class="mon-live-dot"></div>
        <div>
          <h2 class="mon-h2">System Monitor</h2>
          <p class="mon-sub">Live diagnostics · CI/CD · Repo health · Activity stream</p>
        </div>
      </div>
      <button class="mon-btn-refresh" @click="fetchAll" :disabled="loading">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" :class="{ spin: loading }">
          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        {{ loading ? 'Syncing...' : 'Refresh' }}
      </button>
    </div>

    <!-- KPI ROW -->
    <div class="mon-kpi-row">
      <div class="mon-kpi" v-for="k in kpis" :key="k.label">
        <div class="mon-kpi-icon" :style="{ background: k.bg }">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" v-html="k.svg"></svg>
        </div>
        <div class="mon-kpi-body">
          <div class="mon-kpi-val">{{ k.val }}</div>
          <div class="mon-kpi-lbl">{{ k.label }}</div>
        </div>
      </div>
    </div>

    <!-- GRID -->
    <div class="mon-grid">

      <!-- TERMINAL -->
      <div class="mon-card mon-card-wide">
        <div class="mon-card-head">
          <div class="term-dots"><span class="tdot red"></span><span class="tdot yel"></span><span class="tdot grn"></span></div>
          <span class="mon-card-title">docs-monitor ~ events</span>
          <div class="mon-live-badge">LIVE</div>
        </div>
        <div class="mon-term" ref="termEl">
          <div class="mon-term-line" v-for="(l, i) in termLines" :key="i">
            <span class="mon-term-ts">[{{ l.ts }}]</span>
            <span :class="'mon-term-' + l.type">{{ l.msg }}</span>
          </div>
          <div class="mon-term-line">
            <span class="mon-term-ts">[{{ nowTime }}]</span>
            <span class="mon-term-sys">▶ listening<span class="mon-blink">█</span></span>
          </div>
        </div>
      </div>

      <!-- CI/CD PIPELINES -->
      <div class="mon-card">
        <div class="mon-card-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="mon-card-title grad-amber">CI / CD Pipelines</span>
        </div>
        <div class="mon-pipeline-list">
          <div v-if="!workflows.length" class="mon-empty">No recent runs</div>
          <div class="mon-pipeline-row" v-for="w in workflows" :key="w.id">
            <div class="mon-pip-status" :class="'pip-' + w.status"></div>
            <div class="mon-pip-body">
              <div class="mon-pip-name">{{ w.name }}</div>
              <div class="mon-pip-meta">{{ w.event }} · {{ w.sha }} · {{ w.ago }}</div>
            </div>
            <a :href="w.url" target="_blank" class="mon-pip-link">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- REPO HEALTH -->
      <div class="mon-card">
        <div class="mon-card-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span class="mon-card-title grad-emerald">Repository Health</span>
        </div>
        <div class="mon-health-grid">
          <div class="mon-health-item" v-for="h in repoHealth" :key="h.label">
            <div class="mon-h-val" :style="{ color: h.color }">{{ h.val }}</div>
            <div class="mon-h-lbl">{{ h.label }}</div>
          </div>
        </div>
      </div>

      <!-- API QUOTA -->
      <div class="mon-card">
        <div class="mon-card-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span class="mon-card-title grad-blue">API & Latency</span>
        </div>
        <div class="mon-api-body">
          <div class="mon-api-row">
            <span class="mon-api-lbl">Quota Remaining</span>
            <span class="mon-api-val">{{ quota.remaining }} / {{ quota.limit }}</span>
          </div>
          <div class="mon-bar-wrap">
            <div class="mon-bar" :class="quotaClass" :style="{ width: quotaPct + '%' }"></div>
          </div>
          <div class="mon-api-row">
            <span class="mon-api-lbl">Resets At</span>
            <span class="mon-api-val">{{ quota.resetStr }}</span>
          </div>
          <div class="mon-api-row">
            <span class="mon-api-lbl">Latency</span>
            <span class="mon-api-val lat" :class="latClass">{{ latency }}ms</span>
          </div>
          <div class="mon-api-row">
            <span class="mon-api-lbl">API Status</span>
            <span class="mon-status-pill" :class="apiOnline ? 'pill-ok' : 'pill-err'">{{ apiOnline ? 'Online' : 'Degraded' }}</span>
          </div>
        </div>
      </div>

      <!-- DOC STATS -->
      <div class="mon-card">
        <div class="mon-card-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#a855f7" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span class="mon-card-title grad-purple">Docs Statistics</span>
        </div>
        <div class="mon-health-grid">
          <div class="mon-health-item" v-for="d in docStats" :key="d.label">
            <div class="mon-h-val" :style="{ color: d.color }">{{ d.val }}</div>
            <div class="mon-h-lbl">{{ d.label }}</div>
          </div>
        </div>
        <div class="mon-recent-commits" v-if="recentCommits.length">
          <div class="mon-rc-head">Recent Commits</div>
          <div class="mon-rc-row" v-for="c in recentCommits.slice(0,5)" :key="c.sha">
            <div class="mon-rc-sha">{{ c.sha }}</div>
            <div class="mon-rc-msg">{{ c.msg }}</div>
            <div class="mon-rc-author">@{{ c.author }}</div>
          </div>
        </div>
      </div>

      <!-- BRANCHES -->
      <div class="mon-card">
        <div class="mon-card-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f97316" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
          <span class="mon-card-title grad-orange">Branch Overview</span>
        </div>
        <div class="mon-branch-list">
          <div v-if="!branches.length" class="mon-empty">Fetching branches...</div>
          <div class="mon-branch-row" v-for="b in branches" :key="b.name">
            <div class="mon-br-icon" :class="{ 'br-default': b.isDefault }">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            </div>
            <div class="mon-br-info">
              <span class="mon-br-name">{{ b.name }}</span>
              <span v-if="b.isDefault" class="mon-br-tag">DEFAULT</span>
              <span v-if="b.protected" class="mon-br-tag prot">PROTECTED</span>
            </div>
            <div class="mon-br-sha">{{ b.sha }}</div>
          </div>
        </div>
      </div>

    </div><!-- /mon-grid -->
  </div>
</template>

<script>
export default {
  name: 'PanelSystemMonitor',
  props: {
    githubToken: { type: String, default: '' },
    repoOwner:   { type: String, default: '' },
    repoName:    { type: String, default: '' },
    isLightTheme: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      termLines: [],
      workflows: [],
      quota: { remaining: 0, limit: 5000, reset: 0, resetStr: '...' },
      latency: 0,
      apiOnline: true,
      repoHealth: [],
      docStats: [],
      recentCommits: [],
      branches: [],
      lastEventId: null,
      timer: null,
      clockTimer: null,
      nowTime: ''
    }
  },
  computed: {
    quotaPct() { return Math.round((this.quota.remaining / Math.max(1, this.quota.limit)) * 100) },
    quotaClass() { return this.quotaPct < 20 ? 'bar-red' : this.quotaPct < 50 ? 'bar-amber' : 'bar-green' },
    latClass()  { return this.latency < 200 ? 'lat-ok' : this.latency < 600 ? 'lat-warn' : 'lat-bad' },
    kpis() {
      return [
        { label: 'API Remaining', val: this.quota.remaining, bg: 'rgba(59,130,246,0.15)', svg: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
        { label: 'Branches',      val: this.branches.length, bg: 'rgba(249,115,22,0.15)', svg: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>' },
        { label: 'Open Issues',   val: this.repoHealth.find(h=>h.label==='Open Issues')?.raw ?? '—', bg: 'rgba(239,68,68,0.15)', svg: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1"/>' },
        { label: 'Latency',       val: this.latency + 'ms', bg: 'rgba(16,185,129,0.15)', svg: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' }
      ]
    }
  },
  methods: {
    ts() { return new Date().toLocaleTimeString('en-US', { hour12: false }) },
    log(msg, type = 'info') {
      this.termLines.push({ ts: this.ts(), msg, type })
      if (this.termLines.length > 80) this.termLines.shift()
      this.$nextTick(() => { if (this.$refs.termEl) this.$refs.termEl.scrollTop = 9999 })
    },
    hdr() {
      return {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    },
    async fetchAll() {
      if (!this.githubToken) { this.log('No GitHub token — data unavailable', 'err'); return }
      this.loading = true
      await Promise.all([this.fetchQuota(), this.fetchRepo(), this.fetchWorkflows(), this.fetchEvents(), this.fetchBranches(), this.fetchCommits()])
      this.loading = false
    },
    async fetchQuota() {
      try {
        const t = Date.now()
        const r = await fetch('https://api.github.com/rate_limit', { headers: this.hdr() })
        this.latency = Date.now() - t
        this.apiOnline = r.ok
        if (!r.ok) return
        const d = await r.json()
        const c = d.resources.core
        this.quota = { remaining: c.remaining, limit: c.limit, reset: c.reset, resetStr: new Date(c.reset * 1000).toLocaleTimeString() }
        this.log(`API quota: ${c.remaining}/${c.limit} · latency ${this.latency}ms`, 'sys')
      } catch (e) { this.log('Rate limit fetch failed: ' + e.message, 'err') }
    },
    async fetchRepo() {
      try {
        const r = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}`, { headers: this.hdr() })
        if (!r.ok) return
        const d = await r.json()
        const sizeMb = (d.size / 1024).toFixed(1)
        this.repoHealth = [
          { label: 'Repo Size',    val: sizeMb + ' MB', raw: sizeMb, color: '#3b82f6' },
          { label: 'Open Issues',  val: d.open_issues_count, raw: d.open_issues_count, color: '#ef4444' },
          { label: 'Stars',        val: d.stargazers_count, raw: d.stargazers_count, color: '#f59e0b' },
          { label: 'Forks',        val: d.forks_count, raw: d.forks_count, color: '#10b981' },
          { label: 'Watchers',     val: d.subscribers_count ?? d.watchers_count, raw: d.subscribers_count ?? d.watchers_count, color: '#8b5cf6' },
          { label: 'Default Branch', val: d.default_branch, raw: d.default_branch, color: '#f97316' }
        ]
        this.docStats = [
          { label: 'Language',    val: d.language || 'Markdown', color: '#a855f7' },
          { label: 'Visibility',  val: d.private ? 'Private' : 'Public', color: d.private ? '#ef4444' : '#10b981' },
          { label: 'License',     val: d.license?.spdx_id ?? 'None', color: '#6366f1' },
          { label: 'Topics',      val: (d.topics || []).length, color: '#0ea5e9' }
        ]
        this.log(`Repo "${d.name}" · ${sizeMb}MB · ${d.open_issues_count} issues · ${d.stargazers_count} stars`, 'info')
      } catch (e) { this.log('Repo fetch failed', 'err') }
    },
    async fetchWorkflows() {
      try {
        const r = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/actions/runs?per_page=8`, { headers: this.hdr() })
        if (!r.ok) return
        const d = await r.json()
        const toAgo = (s) => {
          const diff = Math.floor((Date.now() - new Date(s)) / 60000)
          return diff < 60 ? diff + 'm ago' : Math.floor(diff/60) + 'h ago'
        }
        this.workflows = (d.workflow_runs || []).map(w => ({
          id: w.id,
          name: w.name,
          status: w.conclusion === 'success' ? 'ok' : w.conclusion === 'failure' ? 'err' : w.status === 'in_progress' ? 'run' : 'skip',
          event: w.event,
          sha: w.head_sha?.slice(0, 7),
          ago: toAgo(w.created_at),
          url: w.html_url
        }))
        this.log(`Fetched ${this.workflows.length} workflow runs`, 'sys')
      } catch (e) { this.log('Workflow fetch failed', 'err') }
    },
    async fetchEvents() {
      try {
        const r = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/events?per_page=10`, { headers: this.hdr() })
        if (!r.ok) return
        const evts = await r.json()
        let fresh = 0
        for (let i = evts.length - 1; i >= 0; i--) {
          const e = evts[i]
          if (this.lastEventId && parseInt(e.id) <= parseInt(this.lastEventId)) continue
          fresh++
          const typeMap = { PushEvent: 'push', PullRequestEvent: 'pr', IssuesEvent: 'issue', CreateEvent: 'create', DeleteEvent: 'del' }
          const type = typeMap[e.type] || 'info'
          let msg = `[${e.type.replace('Event','')}] @${e.actor.login}`
          if (e.type === 'PushEvent') msg += ` pushed ${e.payload.commits?.length ?? 0} commit(s) to ${(e.payload.ref || '').replace('refs/heads/', '')}`
          else if (e.type === 'IssuesEvent') msg += ` ${e.payload.action} issue #${e.payload.issue?.number}`
          else if (e.type === 'PullRequestEvent') msg += ` ${e.payload.action} PR #${e.payload.pull_request?.number}`
          else if (e.type === 'CreateEvent') msg += ` created ${e.payload.ref_type} ${e.payload.ref || ''}`
          this.log(msg, 'success')
          this.lastEventId = e.id
        }
        if (fresh === 0 && !this.lastEventId && evts.length) {
          this.log('Connected · awaiting new events...', 'sys')
          this.lastEventId = evts[0]?.id
        }
      } catch (e) { this.log('Event fetch failed', 'err') }
    },
    async fetchBranches() {
      try {
        const repoR = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}`, { headers: this.hdr() })
        const repo = repoR.ok ? await repoR.json() : {}
        const r = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/branches?per_page=10`, { headers: this.hdr() })
        if (!r.ok) return
        const d = await r.json()
        this.branches = d.map(b => ({ name: b.name, sha: b.commit.sha.slice(0,7), isDefault: b.name === repo.default_branch, protected: b.protected }))
        this.log(`Branches: ${this.branches.map(b=>b.name).join(', ')}`, 'sys')
      } catch (e) { this.log('Branch fetch failed', 'err') }
    },
    async fetchCommits() {
      try {
        const r = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?per_page=5`, { headers: this.hdr() })
        if (!r.ok) return
        const d = await r.json()
        this.recentCommits = d.map(c => ({
          sha: c.sha.slice(0,7),
          msg: (c.commit.message || '').split('\n')[0].slice(0,55),
          author: c.commit.author?.name?.split(' ')[0] || '?'
        }))
      } catch {}
    }
  },
  mounted() {
    this.nowTime = this.ts()
    this.clockTimer = setInterval(() => { this.nowTime = this.ts() }, 1000)
    this.log('System Monitor initializing...', 'sys')
    this.fetchAll()
    this.timer = setInterval(this.fetchAll, 30000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
    clearInterval(this.clockTimer)
  }
}
</script>

<style scoped>
.mon-wrap{display:flex;flex-direction:column;gap:24px;}
.mon-header{display:flex;justify-content:space-between;align-items:flex-end;}
.mon-title-block{display:flex;align-items:center;gap:14px;}
.mon-live-dot{width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:pulse-dot 2s infinite;flex-shrink:0;}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
.mon-h2{font-size:2.2rem;font-weight:900;margin:0 0 3px;letter-spacing:-1px;line-height:1.1;background:linear-gradient(90deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
/* light theme title override */
.mon-wrap.light .mon-h2{background:linear-gradient(90deg,#1d4ed8,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.mon-sub{font-size:.8rem;color:var(--text-muted,#8b949e);margin:0;}
.mon-btn-refresh{display:flex;align-items:center;gap:6px;padding:7px 14px;background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:8px;color:var(--text-primary);font-size:.78rem;font-weight:600;cursor:pointer;transition:.2s;}
.mon-btn-refresh:hover{background:rgba(59,130,246,.15);border-color:#3b82f6;}
.spin{animation:spin 1s linear infinite;}
@keyframes spin{100%{transform:rotate(360deg)}}
.mon-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.mon-kpi{display:flex;align-items:center;gap:12px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:12px;padding:14px 16px;}
.mon-kpi-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color: var(--text-primary);}
.mon-kpi-val{font-size:1.2rem;font-weight:800;color:var(--text-primary);font-family:monospace;}
.mon-kpi-lbl{font-size:.7rem;color:var(--text-muted,#8b949e);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:1px;}
.mon-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.mon-card-wide{grid-column:1/-1;}
.mon-card{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:14px;overflow:hidden;}
.mon-card-head{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border-color);}
.mon-card-title{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;}
.mon-live-badge{margin-left:auto;font-size:.65rem;font-weight:800;letter-spacing:1px;background:rgba(34,197,94,.15);color:#22c55e;border:1px solid rgba(34,197,94,.3);border-radius:4px;padding:1px 6px;}
.mon-empty{padding:16px;font-size:.82rem;color:var(--text-muted,#8b949e);text-align:center;}
.grad-amber{background:linear-gradient(90deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.grad-emerald{background:linear-gradient(90deg,#10b981,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.grad-blue{background:linear-gradient(90deg,#3b82f6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.grad-purple{background:linear-gradient(90deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.grad-orange{background:linear-gradient(90deg,#f97316,#eab308);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.term-dots{display:flex;gap:5px;}
.tdot{width:9px;height:9px;border-radius:50%;}
.tdot.red{background:#ff5f56;}.tdot.yel{background:#ffbd2e;}.tdot.grn{background:#27c93f;}
.mon-term{background:#0d1117;height:240px;overflow-y:auto;padding:14px;font-family:'Consolas','Monaco',monospace;font-size:12.5px;line-height:1.7;}
.mon-term-line{white-space:pre-wrap;word-break:break-all;}
.mon-term-ts{color:#484f58;margin-right:6px;}
.mon-term-sys{color:#58a6ff;}.mon-term-info{color:#8b949e;}.mon-term-success{color:#3fb950;}
.mon-term-err{color:#f85149;}.mon-term-push{color:#3fb950;}.mon-term-pr{color:#a371f7;}
.mon-term-issue{color:#f85149;}.mon-term-create{color:#58a6ff;}.mon-term-del{color:#ffa657;}
.mon-blink{animation:blink 1s step-end infinite;margin-left:3px;}
@keyframes blink{50%{opacity:0}}
.mon-pipeline-list{padding:8px;}
.mon-pipeline-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;transition:.15s;}
.mon-pipeline-row:hover{background:rgba(255,255,255,.04);}
.mon-pip-status{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.pip-ok{background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,.5);}
.pip-err{background:#ef4444;box-shadow:0 0 6px rgba(239,68,68,.5);}
.pip-run{background:#f59e0b;box-shadow:0 0 6px rgba(245,158,11,.5);animation:pulse-dot 1s infinite;}
.pip-skip{background:#6b7280;}
.mon-pip-body{flex:1;min-width:0;}
.mon-pip-name{font-size:.82rem;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mon-pip-meta{font-size:.7rem;color:var(--text-muted,#8b949e);font-family:monospace;}
.mon-pip-link{color:var(--text-muted,#8b949e);transition:.15s;flex-shrink:0;}
.mon-pip-link:hover{color:#3b82f6;}
.mon-health-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px;}
.mon-health-item{background:var(--bg-tertiary);border-radius:10px;padding:12px;text-align:center;}
.mon-h-val{font-size:1.1rem;font-weight:800;font-family:monospace;}
.mon-h-lbl{font-size:.65rem;color:var(--text-muted,#8b949e);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;}
.mon-api-body{padding:14px;display:flex;flex-direction:column;gap:10px;}
.mon-api-row{display:flex;justify-content:space-between;align-items:center;font-size:.82rem;}
.mon-api-lbl{color:var(--text-muted,#8b949e);}
.mon-api-val{font-family:monospace;font-weight:600;color:var(--text-primary);}
.mon-bar-wrap{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;}
.mon-bar{height:100%;border-radius:3px;transition:width 1s;}
.bar-green{background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,.4);}
.bar-amber{background:#f59e0b;box-shadow:0 0 6px rgba(245,158,11,.4);}
.bar-red{background:#ef4444;box-shadow:0 0 6px rgba(239,68,68,.4);}
.lat.lat-ok{color:#22c55e;}.lat.lat-warn{color:#f59e0b;}.lat.lat-bad{color:#ef4444;}
.mon-status-pill{font-size:.7rem;font-weight:800;padding:2px 8px;border-radius:20px;letter-spacing:.5px;}
.pill-ok{background:rgba(34,197,94,.15);color:#22c55e;border:1px solid rgba(34,197,94,.3);}
.pill-err{background:rgba(239,68,68,.15);color:#ef4444;border:1px solid rgba(239,68,68,.3);}
.mon-recent-commits{border-top:1px solid var(--border-color);padding:10px 14px;}
.mon-rc-head{font-size:.7rem;font-weight:700;color:var(--text-muted,#8b949e);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;}
.mon-rc-row{display:grid;grid-template-columns:50px 1fr 70px;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.75rem;}
.mon-rc-sha{font-family:monospace;color:#3b82f6;}
.mon-rc-msg{color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mon-rc-author{color:var(--text-muted,#8b949e);text-align:right;}
.mon-branch-list{padding:8px;}
.mon-branch-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;transition:.15s;}
.mon-branch-row:hover{background:rgba(255,255,255,.04);}
.mon-br-icon{width:26px;height:26px;border-radius:7px;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text-muted,#8b949e);}
.mon-br-icon.br-default{background:rgba(249,115,22,.15);color:#f97316;}
.mon-br-info{flex:1;display:flex;align-items:center;gap:6px;min-width:0;}
.mon-br-name{font-family:monospace;font-size:.82rem;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.mon-br-tag{font-size:.6rem;font-weight:800;padding:1px 5px;border-radius:4px;letter-spacing:.4px;background:rgba(249,115,22,.15);color:#f97316;border:1px solid rgba(249,115,22,.3);}
.mon-br-tag.prot{background:rgba(234,179,8,.12);color:#eab308;border-color:rgba(234,179,8,.3);}
.mon-br-sha{font-family:monospace;font-size:.7rem;color:var(--text-muted,#8b949e);background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;flex-shrink:0;}
/* light theme */
.mon-wrap.light .mon-term{background:#f6f8fa;}
.mon-wrap.light .mon-term-ts{color:#adb5bd;}
.mon-wrap.light .mon-term-sys{color:#0969da;}
.mon-wrap.light .mon-term-success{color:#1a7f37;}
.mon-wrap.light .mon-term-err{color:#d1242f;}
.mon-wrap.light .mon-term-info{color:#57606a;}
.mon-wrap.light .mon-term-push{color:#1a7f37;}
.mon-wrap.light .mon-term-pr{color:#8250df;}
.mon-wrap.light .mon-bar-wrap{background:rgba(0,0,0,.07);}
.mon-wrap.light .mon-pipeline-row:hover,.mon-wrap.light .mon-branch-row:hover{background:rgba(0,0,0,.03);}
.mon-wrap.light .mon-rc-row{border-color:rgba(0,0,0,.05);}
@media(max-width:900px){
  .mon-kpi-row{grid-template-columns:repeat(2,1fr);}
  .mon-grid{grid-template-columns:1fr;}
  .mon-card-wide{grid-column:1;}
}
</style>
