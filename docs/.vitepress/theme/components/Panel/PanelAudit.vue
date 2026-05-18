<template>
  <div class="activity-feed" :class="{ 'light-theme': isLightTheme }" data-lenis-prevent>

    <!-- Header -->
    <div class="af-header">
      <div class="af-title-row">
        <div class="af-live-dot"></div>
        <h2 class="af-title">Recent Activity</h2>
        <span class="af-sub">{{ repoOwner }}/{{ repoName }}</span>
      </div>
      <button class="af-refresh-btn" @click="fetchEvents" :disabled="isLoading">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" :class="{ spin: isLoading }"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        {{ isLoading ? 'LOADING...' : 'REFRESH' }}
      </button>
    </div>

    <!-- KPI strip -->
    <div class="af-kpis" v-if="events.length">
      <div class="af-kpi" v-for="k in kpis" :key="k.label" :style="{ borderColor: k.color + '55' }">
        <span class="ak-val" :style="{ color: k.color }">{{ k.val }}</span>
        <span class="ak-lbl">{{ k.label }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="af-filters" v-if="events.length">
      <button v-for="f in filterOptions" :key="f.id" class="af-filter" :class="{ active: activeFilter === f.id }" @click="activeFilter = f.id">
        <span class="af-dot" :style="{ background: f.color }"></span>
        {{ f.label }}
        <span class="af-count">{{ f.count }}</span>
      </button>
      <div class="af-spacer"></div>
      <div class="af-search">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" placeholder="Search events..." />
      </div>
    </div>

    <!-- Empty / Loading -->
    <div v-if="isLoading" class="af-empty">
      <div class="af-spinner"></div>
      <p>Fetching repository activity...</p>
    </div>
    <div v-else-if="!hasFetched" class="af-empty">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <p>Click Refresh to load your repository's live activity feed.</p>
    </div>
    <div v-else-if="filteredEvents.length === 0" class="af-empty">
      <p>No events match your filter.</p>
    </div>

    <!-- Timeline -->
    <div v-else class="af-timeline">
      <div v-for="(event, i) in filteredEvents" :key="event.id" class="af-event" @click="openDetail(event)">
        <!-- marker -->
        <div class="af-marker">
          <div class="af-marker-dot" :style="{ background: eventColor(event.kind) }"></div>
          <div class="af-marker-line" v-if="i < filteredEvents.length - 1"></div>
        </div>

        <!-- card -->
        <div class="af-card">
          <div class="af-card-top">
            <span class="af-kind-badge" :style="{ background: eventColor(event.kind) + '18', color: eventColor(event.kind), borderColor: eventColor(event.kind) + '44' }">
              <span v-html="eventIcon(event.kind)" style="display:flex"></span>
              {{ event.kind }}
            </span>
            <span class="af-time">{{ timeAgo(event.createdAt) }}</span>
          </div>
          <div class="af-card-body">
            <img :src="event.actorAvatar" class="af-avatar" :alt="event.actor" />
            <div class="af-card-text">
              <span class="af-actor">{{ event.actor }}</span>
              <span class="af-message">{{ event.message }}</span>
            </div>
          </div>
          <div class="af-card-foot" v-if="event.branch || event.ref">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            <span>{{ event.branch || event.ref }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail modal -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="selectedEvent" class="af-modal-overlay" @click.self="selectedEvent = null">
          <div class="af-modal">
            <div class="af-modal-header">
              <span class="af-kind-badge" :style="{ background: eventColor(selectedEvent.kind) + '18', color: eventColor(selectedEvent.kind), borderColor: eventColor(selectedEvent.kind) + '44' }">{{ selectedEvent.kind }}</span>
              <button class="af-modal-close" @click="selectedEvent = null">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="af-modal-body">
              <div class="af-modal-actor">
                <img :src="selectedEvent.actorAvatar" class="af-modal-avatar" />
                <div>
                  <div class="af-modal-name">{{ selectedEvent.actor }}</div>
                  <div class="af-modal-when">{{ new Date(selectedEvent.createdAt).toLocaleString() }}</div>
                </div>
              </div>
              <p class="af-modal-msg">{{ selectedEvent.message }}</p>
              <div class="af-modal-details">
                <div v-if="selectedEvent.branch"><span>Branch</span><code>{{ selectedEvent.branch }}</code></div>
                <div v-if="selectedEvent.ref"><span>Ref</span><code>{{ selectedEvent.ref }}</code></div>
                <div v-if="selectedEvent.sha"><span>SHA</span><code>{{ selectedEvent.sha }}</code></div>
              </div>
              <a v-if="selectedEvent.url" :href="selectedEvent.url" target="_blank" class="af-modal-link">Open on GitHub ↗</a>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script>
const KIND_META = {
  PUSH:    { color: '#3b82f6', icon: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>' },
  PR:      { color: '#a855f7', icon: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>' },
  ISSUE:   { color: '#ef4444', icon: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' },
  STAR:    { color: '#f59e0b', icon: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  RELEASE: { color: '#22c55e', icon: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' },
  FORK:    { color: '#64748b', icon: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>' },
  OTHER:   { color: '#94a3b8', icon: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' }
}

function mapEvent(e) {
  const t = e.type
  let kind = 'OTHER', message = t, branch = '', ref = '', sha = '', url = ''
  if (t === 'PushEvent') {
    kind = 'PUSH'
    const commits = e.payload?.commits || []
    const last = commits[commits.length - 1]
    message = last ? last.message.split('\n')[0] : `Pushed ${commits.length} commit(s)`
    branch = e.payload?.ref?.replace('refs/heads/', '') || ''
    sha = last?.sha?.substring(0, 7) || ''
    url = `https://github.com/${e.repo?.name}/commit/${last?.sha || ''}`
  } else if (t === 'PullRequestEvent') {
    kind = 'PR'
    const pr = e.payload?.pull_request
    message = pr?.title || 'Pull request'
    url = pr?.html_url || ''
    ref = e.payload?.action || ''
  } else if (t === 'IssuesEvent') {
    kind = 'ISSUE'
    message = e.payload?.issue?.title || 'Issue'
    url = e.payload?.issue?.html_url || ''
    ref = e.payload?.action || ''
  } else if (t === 'WatchEvent') {
    kind = 'STAR'
    message = `Starred ${e.repo?.name}`
  } else if (t === 'ReleaseEvent') {
    kind = 'RELEASE'
    message = e.payload?.release?.name || e.payload?.release?.tag_name || 'Release'
    url = e.payload?.release?.html_url || ''
  } else if (t === 'ForkEvent') {
    kind = 'FORK'
    message = `Forked to ${e.payload?.forkee?.full_name}`
    url = e.payload?.forkee?.html_url || ''
  } else {
    message = t.replace('Event', '')
  }
  return {
    id: e.id,
    kind, message, branch, ref, sha, url,
    actor: e.actor?.login || '',
    actorAvatar: `https://avatars.githubusercontent.com/u/${e.actor?.id}?s=40`,
    createdAt: e.created_at
  }
}

export default {
  name: 'PanelAudit',
  props: {
    isLightTheme: { type: Boolean, default: false },
    githubToken:  { type: String,  default: '' },
    repoOwner:    { type: String,  default: '' },
    repoName:     { type: String,  default: '' }
  },
  data() {
    return { events: [], isLoading: false, hasFetched: false, activeFilter: 'ALL', searchQuery: '', selectedEvent: null }
  },
  mounted() { this.fetchEvents() },
  computed: {
    kpis() {
      const counts = {}
      this.events.forEach(e => { counts[e.kind] = (counts[e.kind] || 0) + 1 })
      return Object.entries(counts).slice(0, 5).map(([k, v]) => ({ label: k, val: v, color: KIND_META[k]?.color || '#94a3b8' }))
    },
    filterOptions() {
      const kinds = ['ALL', ...Object.keys(KIND_META)]
      return kinds.map(id => ({
        id, label: id,
        color: id === 'ALL' ? '#6366f1' : (KIND_META[id]?.color || '#94a3b8'),
        count: id === 'ALL' ? this.events.length : this.events.filter(e => e.kind === id).length
      })).filter(f => f.count > 0 || f.id === 'ALL')
    },
    filteredEvents() {
      let list = this.events
      if (this.activeFilter !== 'ALL') list = list.filter(e => e.kind === this.activeFilter)
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(e => e.message.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q))
      }
      return list
    }
  },
  methods: {
    async fetchEvents() {
      if (!this.repoOwner || !this.repoName || this.isLoading) return
      this.isLoading = true
      const headers = { 'Accept': 'application/vnd.github.v3+json' }
      if (this.githubToken) headers['Authorization'] = `token ${this.githubToken}`
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/events?per_page=100`, { headers })
        if (!res.ok) throw new Error(`API ${res.status}`)
        const data = await res.json()
        this.events = data.map(mapEvent)
        this.hasFetched = true
      } catch (e) { console.error('Activity feed error:', e) }
      finally { this.isLoading = false }
    },
    eventColor(kind) { return KIND_META[kind]?.color || KIND_META.OTHER.color },
    eventIcon(kind)  { return KIND_META[kind]?.icon  || KIND_META.OTHER.icon  },
    openDetail(e)    { this.selectedEvent = e },
    timeAgo(ts) {
      if (!ts) return ''
      const m = Math.floor((Date.now() - new Date(ts)) / 60000)
      if (m < 1)  return 'just now'
      if (m < 60) return `${m}m ago`
      const h = Math.floor(m / 60)
      if (h < 24) return `${h}h ago`
      return `${Math.floor(h/24)}d ago`
    }
  }
}
</script>

<style scoped>
.activity-feed { padding: 20px 24px 80px; animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

.af-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; gap:16px; flex-wrap:wrap; }
.af-title-row { display:flex; align-items:center; gap:10px; }
.af-live-dot { width:8px; height:8px; border-radius:50%; background:#22c55e; box-shadow:0 0 8px #22c55e; animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.af-title { font-size:22px; font-weight:800; color:var(--text-primary); margin:0; }
.af-sub { font-size:12px; color:var(--text-muted); font-family:monospace; }
.af-refresh-btn { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:var(--text-muted); padding:8px 16px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:.6px; cursor:pointer; transition:all .2s; }
.af-refresh-btn:hover:not(:disabled) { background:rgba(255,255,255,0.09); color:var(--text-primary); }
.af-refresh-btn:disabled { opacity:.5; cursor:not-allowed; }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }

.af-kpis { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
.af-kpi { background:rgba(255,255,255,0.02); border:1px solid; border-radius:10px; padding:12px 16px; display:flex; flex-direction:column; gap:4px; min-width:80px; }
.ak-val { font-size:22px; font-weight:900; font-family:monospace; }
.ak-lbl { font-size:9px; font-weight:700; color:var(--text-muted); letter-spacing:1px; }

.af-filters { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; align-items:center; }
.af-filter { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); color:var(--text-muted); font-size:10px; font-weight:700; letter-spacing:.6px; padding:5px 10px; border-radius:20px; cursor:pointer; transition:all .2s; }
.af-filter.active { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.2); color:var(--text-primary); }
.af-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.af-count { background:rgba(255,255,255,0.07); border-radius:10px; padding:1px 5px; font-size:9px; }
.af-spacer { flex:1; }
.af-search { display:flex; align-items:center; gap:7px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:7px; padding:6px 12px; }
.af-search svg { opacity:.4; flex-shrink:0; }
.af-search input { background:none; border:none; outline:none; color:var(--text-primary); font-size:12px; width:160px; }
.af-search input::placeholder { color:var(--text-muted); }

.af-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:80px 40px; color:var(--text-muted); font-size:13px; text-align:center; }
.af-spinner { width:28px; height:28px; border:2px solid rgba(255,255,255,0.08); border-top-color:#6366f1; border-radius:50%; animation:spin .8s linear infinite; }

.af-timeline { display:flex; flex-direction:column; gap:0; }
.af-event { display:flex; gap:16px; cursor:pointer; }
.af-marker { display:flex; flex-direction:column; align-items:center; width:20px; flex-shrink:0; padding-top:4px; }
.af-marker-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; z-index:1; transition:transform .2s; }
.af-event:hover .af-marker-dot { transform:scale(1.4); }
.af-marker-line { flex:1; width:2px; background:rgba(255,255,255,0.06); margin:4px 0; min-height:20px; }

.af-card { flex:1; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:12px 14px; margin-bottom:10px; transition:all .2s; }
.af-event:hover .af-card { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.12); transform:translateX(2px); }
.af-card-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; gap:8px; }
.af-kind-badge { display:flex; align-items:center; gap:5px; border:1px solid; border-radius:4px; padding:2px 7px; font-size:10px; font-weight:800; letter-spacing:.6px; }
.af-time { font-size:11px; color:var(--text-muted); font-family:monospace; flex-shrink:0; }
.af-card-body { display:flex; gap:10px; align-items:flex-start; }
.af-avatar { width:24px; height:24px; border-radius:50%; flex-shrink:0; }
.af-card-text { min-width:0; }
.af-actor { display:block; font-size:11px; font-weight:700; color:var(--text-primary); margin-bottom:2px; }
.af-message { display:block; font-size:12px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.af-card-foot { display:flex; align-items:center; gap:5px; margin-top:8px; font-size:10px; font-family:monospace; color:var(--text-muted); opacity:.7; }

/* Modal */
.modal-fade-enter-active,.modal-fade-leave-active { transition:opacity .2s; }
.modal-fade-enter-from,.modal-fade-leave-to { opacity:0; }
.af-modal-overlay { position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; }
.af-modal { background:rgba(15,15,28,0.98); border:1px solid rgba(255,255,255,0.1); border-radius:16px; width:100%; max-width:480px; overflow:hidden; }
.af-modal-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.07); }
.af-modal-close { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text-muted); width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
.af-modal-close:hover { background:rgba(239,68,68,0.15); color:#ef4444; }
.af-modal-body { padding:20px; }
.af-modal-actor { display:flex; gap:12px; align-items:center; margin-bottom:16px; }
.af-modal-avatar { width:40px; height:40px; border-radius:50%; }
.af-modal-name { font-size:14px; font-weight:700; color:var(--text-primary); }
.af-modal-when { font-size:11px; color:var(--text-muted); }
.af-modal-msg { font-size:14px; color:var(--text-primary); margin:0 0 16px; line-height:1.5; }
.af-modal-details { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
.af-modal-details > div { display:flex; gap:12px; align-items:center; font-size:12px; }
.af-modal-details span { color:var(--text-muted); width:50px; flex-shrink:0; }
.af-modal-details code { font-family:monospace; color:var(--text-primary); background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:4px; }
.af-modal-link { display:inline-flex; align-items:center; gap:6px; color:#6366f1; font-size:12px; font-weight:700; text-decoration:none; border:1px solid rgba(99,102,241,0.3); padding:8px 14px; border-radius:7px; transition:all .2s; }
.af-modal-link:hover { background:rgba(99,102,241,0.1); }

/* Light theme */
.activity-feed.light-theme .af-card { background:#fff; border-color:rgba(0,0,0,0.08); box-shadow:0 2px 6px rgba(0,0,0,0.04); }
.activity-feed.light-theme .af-kpi { background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.05); }
.activity-feed.light-theme .af-filter { background:#fff; border-color:rgba(0,0,0,0.1); }
.activity-feed.light-theme .af-modal { background:#fff; }
</style>