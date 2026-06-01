<template>
  <div class="ct-wrap" data-lenis-prevent>

    <!-- Header -->
    <div class="ct-head">
      <div>
        <h2 class="ct-h2">Team Hall</h2>
        <p class="ct-sub">{{ repoOwner }}/{{ repoName }}</p>
      </div>
      <div class="ct-kpis">
        <div class="ct-kpi"><span class="ct-kv">{{ sorted.length }}</span><span class="ct-kl">MEMBERS</span></div>
        <div class="ct-kpi"><span class="ct-kv accent">{{ fmt(totalCommits) }}</span><span class="ct-kl">COMMITS</span></div>
        <div class="ct-kpi"><span class="ct-kv green">{{ sorted.length ? fmt(Math.round(totalCommits/sorted.length)) : 0 }}</span><span class="ct-kl">AVG</span></div>
      </div>
    </div>

    <!-- Champion hero -->
    <div class="ct-hero" v-if="sorted[0]" @click="open(sorted[0])">
      <div class="ct-hero-glow"></div>
      <img :src="sorted[0].avatar_url" class="ct-hero-img" />
      <div class="ct-hero-info">
        <div class="ct-hero-crown">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: -1px; margin-right: 4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          #1 CHAMPION
        </div>
        <div class="ct-hero-name">{{ sorted[0].login }}</div>
        <div class="ct-hero-stats">
          <span>{{ fmt(sorted[0].commits||0) }} commits</span>
          <span class="ct-dot">·</span>
          <span>{{ (sorted[0].impact||0).toFixed(1) }}% impact</span>
          <span class="ct-dot">·</span>
          <span>{{ sorted[0].prs||0 }} PRs</span>
        </div>
        <div class="ct-hero-bar-wrap">
          <div class="ct-hero-bar" style="width:100%"></div>
        </div>
      </div>
      <div class="ct-hero-rank">#1</div>
    </div>

    <!-- Top 3 row (exclude #1) -->
    <div class="ct-top3" v-if="sorted.length > 1">
      <div v-for="(c,i) in sorted.slice(1,3)" :key="c.login" class="ct-spot" @click="open(c)" :class="i===0?'silver':'bronze'">
        <div class="ct-spot-num">#{{ i+2 }}</div>
        <img :src="c.avatar_url" class="ct-spot-img" />
        <div class="ct-spot-name">{{ c.login }}</div>
        <div class="ct-spot-val">{{ fmt(c.commits||0) }} commits</div>
        <div class="ct-spot-bar-wrap">
          <div class="ct-spot-bar" :style="{width: Math.round((c.commits||0)/(sorted[0].commits||1)*100)+'%'}"></div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="ct-toolbar">
      <div class="ct-search-box">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="q" placeholder="Search..." />
      </div>
      <div class="ct-sort-row">
        <button v-for="s in ['commits','prs','impact']" :key="s" class="ct-sort" :class="{active: sortKey===s}" @click="sortKey=s">{{ s }}</button>
      </div>
    </div>

    <!-- Leaderboard list -->
    <div class="ct-list">
      <div v-for="(c,i) in paged" :key="c.login" class="ct-row" @click="open(c)">
        <span class="ct-row-rank" :class="rankCls(i + (page-1)*perPage + 1)">#{{ i + (page-1)*perPage + 1 }}</span>
        <img :src="c.avatar_url" class="ct-row-img" />
        <div class="ct-row-info">
          <span class="ct-row-name">{{ c.login }}</span>
          <div class="ct-row-bar-bg"><div class="ct-row-bar" :style="{width: Math.round((c.commits||0)/(sorted[0]?.commits||1)*100)+'%'}"></div></div>
        </div>
        <div class="ct-row-stats">
          <span>{{ fmt(c.commits||0) }}</span>
          <span class="ct-row-sub">commits</span>
        </div>
        <div class="ct-row-stats">
          <span>{{ c.prs||0 }}</span>
          <span class="ct-row-sub">PRs</span>
        </div>
        <div class="ct-row-stats">
          <span>{{ (c.impact||0).toFixed(1) }}%</span>
          <span class="ct-row-sub">impact</span>
        </div>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="ct-row-arr"><path d="M9 18l6-6-6-6"/></svg>
      </div>
      <div v-if="!paged.length" class="ct-empty">No contributors found.</div>
    </div>

    <!-- Pagination -->
    <div class="ct-pages" v-if="totalPages > 1">
      <button class="ct-pg" :disabled="page===1" @click="page--">←</button>
      <span class="ct-pg-info">{{ page }} / {{ totalPages }}</span>
      <button class="ct-pg" :disabled="page===totalPages" @click="page++">→</button>
    </div>

    <!-- Drawer -->
    <teleport to="body">
      <transition name="drawer">
        <div v-if="selected" class="ct-drawer-overlay" @click.self="selected=null">
          <div class="ct-drawer">
            <button class="ct-drawer-close" @click="selected=null">✕</button>
            <div class="ct-drawer-hero">
              <img :src="selected.avatar_url" class="ct-drawer-avatar" />
              <div>
                <div class="ct-drawer-name">{{ ghData.name || selected.login }}</div>
                <div class="ct-drawer-login">@{{ selected.login }}</div>
                <div class="ct-drawer-bio" v-if="ghData.bio">{{ ghData.bio }}</div>
              </div>
            </div>
            <div class="ct-drawer-stats">
              <div class="ct-ds"><span class="ct-dsv accent">{{ fmt(selected.commits||0) }}</span><span class="ct-dsl">COMMITS</span></div>
              <div class="ct-ds"><span class="ct-dsv green">{{ selected.prs||0 }}</span><span class="ct-dsl">PULL REQUESTS</span></div>
              <div class="ct-ds"><span class="ct-dsv">{{ (selected.impact||0).toFixed(1) }}%</span><span class="ct-dsl">IMPACT</span></div>
              <div class="ct-ds"><span class="ct-dsv gold">#{{ sortedRank(selected) }}</span><span class="ct-dsl">RANK</span></div>
            </div>
            <div class="ct-drawer-detail" v-if="ghData.location || ghData.company">
              <span v-if="ghData.location">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ ghData.location }}
              </span>
              <span v-if="ghData.company">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="8" y1="6" x2="8" y2="6.01"/><line x1="16" y1="6" x2="16" y2="6.01"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/></svg>
                {{ ghData.company }}
              </span>
            </div>
            <div class="ct-drawer-gh">
              <div class="ct-ds" v-if="ghData.followers !== undefined"><span class="ct-dsv">{{ fmt(ghData.followers||0) }}</span><span class="ct-dsl">FOLLOWERS</span></div>
              <div class="ct-ds" v-if="ghData.public_repos !== undefined"><span class="ct-dsv">{{ ghData.public_repos||0 }}</span><span class="ct-dsl">REPOS</span></div>
            </div>
            
            <div class="ct-drawer-commits" v-if="ghData.recentCommits && ghData.recentCommits.length">
              <h4 class="ct-dc-title">Recent Commits</h4>
              <div class="ct-dc-list">
                <a v-for="c in ghData.recentCommits" :key="c.sha" :href="c.html_url" target="_blank" class="ct-dc-item">
                  <div class="ct-dc-msg">{{ c.commit.message.split('\n')[0] }}</div>
                  <div class="ct-dc-meta">
                    <span class="ct-dc-sha">{{ c.sha.substring(0,7) }}</span>
                    <span class="ct-dc-time">{{ new Date(c.commit.author.date).toLocaleDateString() }}</span>
                  </div>
                </a>
              </div>
            </div>

            <div v-if="loadingGH" class="ct-drawer-loading">Loading GitHub data…</div>
            <a :href="`https://github.com/${selected.login}`" target="_blank" class="ct-drawer-btn">View on GitHub ↗</a>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'PanelContributors',
  props: {
    isLightTheme: { type: Boolean, default: false },
    contributors:  { type: Array,   default: () => [] },
    totalCommits:  { type: Number,  default: 0 },
    githubToken:   { type: String,  default: '' },
    repoOwner:     { type: String,  default: '' },
    repoName:      { type: String,  default: '' }
  },
  data() {
    return { q: '', sortKey: 'commits', page: 1, perPage: 10, selected: null, ghData: {}, loadingGH: false }
  },
  computed: {
    sorted() {
      let list = [...this.contributors]
      if (this.q) list = list.filter(c => c.login.toLowerCase().includes(this.q.toLowerCase()))
      return list.sort((a,b) => (b[this.sortKey]||0) - (a[this.sortKey]||0))
    },
    paged() {
      return this.sorted.slice((this.page-1)*this.perPage, this.page*this.perPage)
    },
    totalPages() { return Math.max(1, Math.ceil(this.sorted.length/this.perPage)) }
  },
  watch: { q() { this.page=1 }, sortKey() { this.page=1 } },
  methods: {
    fmt(n) {
      if (!n) return '0'
      if (n >= 1000) return (n/1000).toFixed(1)+'K'
      return n.toString()
    },
    rankCls(r) { return r===1?'gold':r===2?'silver':r===3?'bronze':'' },
    sortedRank(c) {
      const s = [...this.contributors].sort((a,b)=>(b.commits||0)-(a.commits||0))
      return s.findIndex(x=>x.login===c.login)+1
    },
    async open(c) {
      this.selected = c
      this.ghData = {}
      if (!this.githubToken) return
      this.loadingGH = true
      try {
        const r = await fetch(`https://api.github.com/users/${c.login}`, {
          headers: { Authorization: `token ${this.githubToken}`, Accept: 'application/vnd.github.v3+json' }
        })
        if (r.ok) {
          const data = await r.json()
          this.ghData = data
        }
        
        if (this.repoOwner && this.repoName) {
          const r2 = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?author=${c.login}&per_page=5`, {
            headers: { Authorization: `token ${this.githubToken}`, Accept: 'application/vnd.github.v3+json' }
          })
          if (r2.ok) {
            this.ghData.recentCommits = await r2.json()
          }
        }
      } catch(e) {}
      this.loadingGH = false
    }
  }
}
</script>

<style scoped>
.ct-wrap { padding: 20px 24px 80px; display:flex; flex-direction:column; gap:16px; animation: ctIn .35s ease; }
@keyframes ctIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

/* Head */
.ct-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; }
.ct-h2 { font-size:28px; font-weight:900; color:var(--text-primary); margin:0 0 4px; }
.ct-sub { font-size:12px; color:var(--text-muted); font-family:monospace; margin:0; }
.ct-kpis { display:flex; gap:10px; }
.ct-kpi { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:10px; padding:10px 14px; display:flex; flex-direction:column; gap:3px; }
.ct-kv { font-size:20px; font-weight:900; color:var(--text-primary); font-family:monospace; }
.ct-kv.accent { color:#f59e0b; } .ct-kv.green { color:#22c55e; } .ct-kv.gold { color:#ffd700; }
.ct-kl { font-size:9px; font-weight:700; color:var(--text-muted); letter-spacing:1px; }

/* Hero */
.ct-hero { position:relative; display:flex; align-items:center; gap:20px; background:rgba(255,120,0,.06); border:1px solid rgba(255,120,0,.2); border-radius:16px; padding:24px; cursor:pointer; overflow:hidden; transition:all .2s; }
.ct-hero:hover { transform:translateY(-2px); /* glow removed */ border-color:rgba(255,120,0,.4); }
.ct-hero-glow { position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle,rgba(255,120,0,.15) 0%,transparent 70%); pointer-events:none; }
.ct-hero-img { width:88px; height:88px; border-radius:50%; border:3px solid rgba(255,120,0,.6); /* glow removed */ flex-shrink:0; z-index:1; }
.ct-hero-info { flex:1; z-index:1; }
.ct-hero-crown { font-size:11px; font-weight:800; color:#f59e0b; letter-spacing:1px; margin-bottom:6px; }
.ct-hero-name { font-size:26px; font-weight:900; color:var(--text-primary); margin-bottom:6px; }
.ct-hero-stats { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-muted); flex-wrap:wrap; margin-bottom:12px; }
.ct-dot { color:rgba(255,255,255,.2); }
.ct-hero-bar-wrap { height:4px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
.ct-hero-bar { height:100%; background:linear-gradient(90deg,#ff7800,#f59e0b); border-radius:2px; }
.ct-hero-rank { position:absolute; top:16px; right:20px; font-size:48px; font-weight:900; color:rgba(255,120,0,.08); pointer-events:none; font-family:monospace; }

/* Top 3 strip */
.ct-top3 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.ct-spot { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:18px; cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
.ct-spot:hover { transform:translateY(-2px); background:rgba(255,255,255,.06); }
.ct-spot.silver { border-color:rgba(192,192,192,.25); }
.ct-spot.silver:hover { border-color:rgba(192,192,192,.5); box-shadow:0 8px 24px rgba(192,192,192,.08); }
.ct-spot.bronze { border-color:rgba(205,127,50,.25); }
.ct-spot.bronze:hover { border-color:rgba(205,127,50,.5); box-shadow:0 8px 24px rgba(205,127,50,.08); }
.ct-spot-num { font-size:11px; font-weight:800; color:var(--text-muted); letter-spacing:.5px; margin-bottom:10px; }
.ct-spot img { width:48px; height:48px; border-radius:50%; margin-bottom:10px; }
.silver .ct-spot img { border:2px solid rgba(192,192,192,.6); }
.bronze .ct-spot img { border:2px solid rgba(205,127,50,.6); }
.ct-spot-name { font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:2px; }
.ct-spot-val { font-size:11px; color:var(--text-muted); margin-bottom:10px; }
.ct-spot-bar-wrap { height:3px; background:rgba(255,255,255,.05); border-radius:2px; overflow:hidden; }
.ct-spot-bar { height:100%; border-radius:2px; background:rgba(255,255,255,.2); }
.silver .ct-spot-bar { background:rgba(192,192,192,.5); }
.bronze .ct-spot-bar { background:rgba(205,127,50,.5); }

/* Toolbar */
.ct-toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
.ct-search-box { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 12px; flex:1; max-width:280px; }
.ct-search-box svg { opacity:.4; flex-shrink:0; }
.ct-search-box input { background:none; border:none; outline:none; color:var(--text-primary); font-size:12px; width:100%; }
.ct-search-box input::placeholder { color:var(--text-muted); }
.ct-sort-row { display:flex; gap:6px; }
.ct-sort { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:var(--text-muted); padding:6px 12px; border-radius:6px; font-size:10px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; cursor:pointer; transition:all .2s; }
.ct-sort.active { background:rgba(255,120,0,.12); border-color:rgba(255,120,0,.4); color:#ff7800; }

/* List */
.ct-list { display:flex; flex-direction:column; gap:4px; }
.ct-row { display:flex; align-items:center; gap:14px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.05); border-radius:10px; padding:12px 16px; cursor:pointer; transition:all .18s; }
.ct-row:hover { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.12); transform:translateX(3px); }
.ct-row-rank { font-size:11px; font-weight:800; color:var(--text-muted); font-family:monospace; width:28px; flex-shrink:0; }
.ct-row-rank.gold { color:#ffd700; } .ct-row-rank.silver { color:#c0c0c0; } .ct-row-rank.bronze { color:#cd7f32; }
.ct-row-img { width:36px; height:36px; border-radius:50%; border:2px solid rgba(255,255,255,.1); flex-shrink:0; }
.ct-row-info { flex:1; min-width:0; }
.ct-row-name { display:block; font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
.ct-row-bar-bg { height:2px; background:rgba(255,255,255,.05); border-radius:1px; overflow:hidden; }
.ct-row-bar { height:100%; background:rgba(255,120,0,.5); border-radius:1px; }
.ct-row-stats { text-align:right; flex-shrink:0; display:flex; flex-direction:column; gap:1px; min-width:56px; }
.ct-row-stats span:first-child { font-size:13px; font-weight:700; color:var(--text-primary); font-family:monospace; }
.ct-row-sub { font-size:9px; color:var(--text-muted); letter-spacing:.4px; }
.ct-row-arr { opacity:.25; flex-shrink:0; }
.ct-empty { text-align:center; padding:40px; color:var(--text-muted); font-size:13px; }

/* Pages */
.ct-pages { display:flex; align-items:center; justify-content:center; gap:12px; }
.ct-pg { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:var(--text-primary); width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:14px; transition:all .2s; }
.ct-pg:hover:not(:disabled) { background:rgba(255,255,255,.1); }
.ct-pg:disabled { opacity:.3; cursor:not-allowed; }
.ct-pg-info { font-size:12px; color:var(--text-muted); font-family:monospace; }

/* Drawer */
.drawer-enter-active, .drawer-leave-active { transition:opacity .25s; }
.drawer-enter-from, .drawer-leave-to { opacity:0; }
.drawer-enter-active .ct-drawer, .drawer-leave-active .ct-drawer { transition:transform .3s cubic-bezier(.16,1,.3,1); }
.drawer-enter-from .ct-drawer, .drawer-leave-to .ct-drawer { transform:translateX(100%); }
.ct-drawer-overlay { position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,.6); backdrop-filter:blur(6px); display:flex; align-items:stretch; justify-content:flex-end; }
.ct-drawer { width:360px; max-width:100vw; background:rgba(10,10,18,.98); border-left:1px solid rgba(255,255,255,.1); padding:28px 24px; display:flex; flex-direction:column; gap:20px; overflow-y:auto; position:relative; }
.ct-drawer-close { position:absolute; top:16px; right:16px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:var(--text-muted); width:30px; height:30px; border-radius:50%; cursor:pointer; font-size:13px; transition:all .2s; }
.ct-drawer-close:hover { background:rgba(239,68,68,.2); color:#ef4444; }
.ct-drawer-hero { display:flex; gap:14px; align-items:flex-start; }
.ct-drawer-avatar { width:64px; height:64px; border-radius:50%; border:3px solid rgba(255,120,0,.5); flex-shrink:0; }
.ct-drawer-name { font-size:20px; font-weight:800; color:var(--text-primary); margin-bottom:2px; }
.ct-drawer-login { font-size:12px; color:var(--text-muted); margin-bottom:6px; }
.ct-drawer-bio { font-size:12px; color:var(--text-muted); line-height:1.5; }
.ct-drawer-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.ct-ds { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:4px; }
.ct-dsv { font-size:22px; font-weight:900; color:var(--text-primary); font-family:monospace; }
.ct-dsl { font-size:9px; font-weight:700; color:var(--text-muted); letter-spacing:1px; }
.ct-drawer-detail { display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--text-muted); }
.ct-drawer-gh { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.ct-drawer-loading { font-size:12px; color:var(--text-muted); text-align:center; padding: 20px 0; }
.ct-drawer-btn { display:block; text-align:center; background:rgba(255,120,0,.15); border:1px solid rgba(255,120,0,.4); color:#ff7800; padding:12px; border-radius:10px; font-size:12px; font-weight:800; text-decoration:none; letter-spacing:.5px; transition:all .2s; margin-top:auto; }
.ct-drawer-btn:hover { background:rgba(255,120,0,.25); }

/* Recent Commits in Drawer */
.ct-drawer-commits { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.ct-dc-title { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin: 0; }
.ct-dc-list { display: flex; flex-direction: column; gap: 6px; }
.ct-dc-item { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 10px 12px; text-decoration: none; transition: all .2s; }
.ct-dc-item:hover { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.1); transform: translateX(3px); }
.ct-dc-msg { font-size: 12px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ct-dc-meta { display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: var(--text-muted); font-family: monospace; }
.ct-dc-sha { color: #ff7800; background: rgba(255,120,0,.1); padding: 2px 4px; border-radius: 4px; }

/* Light theme */
:global(.wildfire-dashboard.light-theme) .ct-h2,
:global(.wildfire-dashboard.light-theme) .ct-kv,
:global(.wildfire-dashboard.light-theme) .ct-hero-name,
:global(.wildfire-dashboard.light-theme) .ct-spot-name,
:global(.wildfire-dashboard.light-theme) .ct-row-name,
:global(.wildfire-dashboard.light-theme) .ct-row-stats span:first-child,
:global(.wildfire-dashboard.light-theme) .ct-drawer-name,
:global(.wildfire-dashboard.light-theme) .ct-dsv,
:global(.wildfire-dashboard.light-theme) .ct-dc-msg { color: #111; }

:global(.wildfire-dashboard.light-theme) .ct-sub,
:global(.wildfire-dashboard.light-theme) .ct-kl,
:global(.wildfire-dashboard.light-theme) .ct-hero-stats,
:global(.wildfire-dashboard.light-theme) .ct-spot-num,
:global(.wildfire-dashboard.light-theme) .ct-spot-val,
:global(.wildfire-dashboard.light-theme) .ct-row-sub,
:global(.wildfire-dashboard.light-theme) .ct-empty,
:global(.wildfire-dashboard.light-theme) .ct-drawer-login,
:global(.wildfire-dashboard.light-theme) .ct-drawer-bio,
:global(.wildfire-dashboard.light-theme) .ct-dsl,
:global(.wildfire-dashboard.light-theme) .ct-drawer-detail,
:global(.wildfire-dashboard.light-theme) .ct-dc-title,
:global(.wildfire-dashboard.light-theme) .ct-dc-meta { color: #666; }

:global(.wildfire-dashboard.light-theme) .ct-kpi { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.08); box-shadow:0 2px 6px rgba(0,0,0,.05); }
:global(.wildfire-dashboard.light-theme) .ct-hero { background:rgba(255,120,0,.04); border-color:rgba(255,120,0,.15); }
:global(.wildfire-dashboard.light-theme) .ct-spot { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.08); box-shadow:0 2px 6px rgba(0,0,0,.03); }
:global(.wildfire-dashboard.light-theme) .ct-row { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.07); box-shadow:0 1px 3px rgba(0,0,0,.02); }
:global(.wildfire-dashboard.light-theme) .ct-row:hover { background: rgba(248,249,250,0.95); border-color:rgba(0,0,0,.15); }
:global(.wildfire-dashboard.light-theme) .ct-search-box { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.1); }
:global(.wildfire-dashboard.light-theme) .ct-search-box input { color:#000; }
:global(.wildfire-dashboard.light-theme) .ct-search-box input::placeholder { color:#888; }
:global(.wildfire-dashboard.light-theme) .ct-sort { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.1); color:#444; }
:global(.wildfire-dashboard.light-theme) .ct-sort.active { background:rgba(255,120,0,.1); border-color:rgba(255,120,0,.4); color:#ff7800; }
:global(.wildfire-dashboard.light-theme) .ct-pg { background: rgba(255,255,255,0.95); border-color:rgba(0,0,0,.1); color:#000; }
:global(.wildfire-dashboard.light-theme) .ct-pg:hover:not(:disabled) { background:#f0f0f0; }

:global(.wildfire-dashboard.light-theme) .ct-drawer { background:rgba(255,255,255,.99); border-color:rgba(0,0,0,.1); box-shadow:-10px 0 30px rgba(0,0,0,.05); }
:global(.wildfire-dashboard.light-theme) .ct-dc-item { background: rgba(248,249,250,0.95); border-color: rgba(0,0,0,.08); }
:global(.wildfire-dashboard.light-theme) .ct-dc-item:hover { background: rgba(255,255,255,0.95); border-color: rgba(0,0,0,.15); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .ct-ds { background: rgba(248,249,250,0.95); border-color: rgba(0,0,0,.08); }
:global(.wildfire-dashboard.light-theme) .ct-drawer-close { background: rgba(248,249,250,0.95); border-color: rgba(0,0,0,.1); color: #000; }
:global(.wildfire-dashboard.light-theme) .ct-drawer-close:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }
</style>
