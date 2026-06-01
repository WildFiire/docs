<template>
  <div class="pu-wrap" data-lenis-prevent>
    <div class="pu-head">
      <div>
        <h2 class="pu-h2">Docs Updates</h2>
        <p class="pu-sub">Automated changelog generated from recent commits.</p>
      </div>
      <div class="pu-actions">
        <button class="pu-btn secondary" @click="fetchCommits" :disabled="loading">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9"/><path d="M21 3v6h-6"/></svg>
          Sync Commits
        </button>
        <button class="pu-btn primary">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Publish Draft
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="pu-filters">
      <div class="pu-f-group">
        <button class="pu-f-btn" :class="{active: filter==='all'}" @click="filter='all'">All Updates</button>
        <button class="pu-f-btn" :class="{active: filter==='feat'}" @click="filter='feat'">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Features
        </button>
        <button class="pu-f-btn" :class="{active: filter==='fix'}" @click="filter='fix'">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Bug Fixes
        </button>
        <button class="pu-f-btn" :class="{active: filter==='perf'}" @click="filter='perf'">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Performance
        </button>
      </div>
    </div>

    <div v-if="loading" class="pu-loading">
      <div class="pu-spinner"></div>
      <span>Analyzing recent commits...</span>
    </div>

    <div v-else-if="filteredGroups.length === 0" class="pu-empty">
      No updates found for the selected filter.
    </div>

    <!-- Timeline -->
    <div v-else class="pu-timeline">
      <div v-for="(group, gIdx) in filteredGroups" :key="group.date" class="pu-day-group">
        <div class="pu-day-sticky">
          <div class="pu-day-badge">{{ group.date }}</div>
          <div class="pu-day-meta">{{ group.commits.length }} updates</div>
        </div>
        
        <div class="pu-day-content">
          <div v-for="commit in group.commits" :key="commit.sha" class="pu-card">
            <div class="pu-card-line"></div>
            
            <div class="pu-type-icon" :class="'icon-' + commit.type" v-html="getTypeIcon(commit.type)">
            </div>
            
            <div class="pu-card-body">
              <div class="pu-c-head">
                <span class="pu-c-type" :class="'type-' + commit.type">{{ getTypeName(commit.type) }}</span>
                <span class="pu-c-time">{{ commit.time }}</span>
                <a :href="commit.url" target="_blank" class="pu-c-hash">{{ commit.shortSha }}</a>
              </div>
              
              <div class="pu-c-title">{{ commit.title }}</div>
              <div class="pu-c-desc" v-if="commit.description">{{ commit.description }}</div>
              
              <div class="pu-c-foot">
                <div class="pu-author">
                  <img :src="commit.authorAvatar" :alt="commit.authorLogin">
                  <span>{{ commit.authorLogin }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelUpdates',
  props: {
    githubToken: { type: String, default: '' },
    repoOwner:   { type: String, default: '' },
    repoName:    { type: String, default: '' },
    isLightTheme: { type: Boolean, default: false }
  },
  data() {
    return {
      commitsRaw: [],
      loading: false,
      filter: 'all', // all, feat, fix, perf
    }
  },
  computed: {
    parsedCommits() {
      return this.commitsRaw.map(c => {
        const fullMsg = c.commit.message || '';
        const lines = fullMsg.split('\n');
        const firstLine = lines[0].trim();
        
        // Parse conventional commit (e.g. "feat(cars): added new vehicles")
        const match = firstLine.match(/^([a-zA-Z]+)(?:\(([^)]+)\))?:\s*(.+)$/);
        
        let type = 'other';
        let scope = '';
        let title = firstLine;
        let description = lines.slice(1).join('\n').trim();

        if (match) {
          const rawType = match[1].toLowerCase();
          scope = match[2] || '';
          title = match[3];
          
          if (['feat', 'feature', 'add'].includes(rawType)) type = 'feat';
          else if (['fix', 'bug', 'patch'].includes(rawType)) type = 'fix';
          else if (['perf', 'optimize'].includes(rawType)) type = 'perf';
          else if (['docs', 'style', 'refactor', 'test', 'chore'].includes(rawType)) type = 'chore';
        }

        const dateObj = new Date(c.commit.author.date);
        
        return {
          sha: c.sha,
          shortSha: c.sha.substring(0, 7),
          url: c.html_url,
          type,
          scope,
          title,
          description,
          authorLogin: c.author?.login || c.commit.author.name,
          authorAvatar: c.author?.avatar_url || `https://github.com/${c.commit.author.name}.png`,
          dateRaw: dateObj,
          dateStr: dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
          time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      });
    },
    filteredGroups() {
      let filtered = this.parsedCommits;
      if (this.filter !== 'all') {
        filtered = filtered.filter(c => c.type === this.filter);
      }
      
      // Filter out chores unless 'all' is selected? Actually, let's just group them.
      if (this.filter === 'all') {
        filtered = filtered.filter(c => c.type !== 'chore'); // Hide chores from main feed usually
      }

      // Group by date
      const groups = {};
      filtered.forEach(c => {
        if (!groups[c.dateStr]) groups[c.dateStr] = [];
        groups[c.dateStr].push(c);
      });

      return Object.keys(groups).map(date => ({
        date,
        commits: groups[date]
      })).sort((a,b) => new Date(b.date) - new Date(a.date));
    }
  },
  mounted() {
    this.fetchCommits();
  },
  methods: {
    async fetchCommits() {
      if (!this.githubToken || !this.repoOwner || !this.repoName) return;
      this.loading = true;
      try {
        // Fetch last 100 commits
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?per_page=100`, {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (res.ok) {
          this.commitsRaw = await res.json();
        }
      } catch (e) {
        console.error("Failed to fetch commits for updates", e);
      }
      this.loading = false;
    },
    getTypeIcon(type) {
      if (type === 'feat') return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      if (type === 'fix') return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      if (type === 'perf') return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
      return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    },
    getTypeName(type) {
      if (type === 'feat') return 'New Feature';
      if (type === 'fix') return 'Bug Fix';
      if (type === 'perf') return 'Performance';
      return 'Update';
    }
  }
}
</script>

<style scoped>
.pu-wrap {
  padding: 24px 32px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ctIn .35s ease;
  max-width: 1000px;
  margin: 0 auto;
}
@keyframes ctIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

/* Head */
.pu-head { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; }
.pu-h2 { font-size:28px; font-weight:900; color:var(--text-primary); margin:0 0 6px; letter-spacing:-0.5px; }
.pu-sub { font-size:13px; color:var(--text-muted); margin:0; }
.pu-actions { display: flex; gap: 12px; }
.pu-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 10px;
  font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.2s; border: none; outline: none;
}
.pu-btn.primary {
  background: linear-gradient(135deg, #ff7800, #f59e0b);
  color: var(--text-primary);
  /* glow removed */
}
.pu-btn.primary:hover {
  transform: translateY(-2px);
  /* glow removed */
}
.pu-btn.secondary {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-primary);
}
.pu-btn.secondary:hover {
  background: rgba(255,255,255,0.1);
}
.pu-btn:disabled { opacity: 0.5; pointer-events: none; }

/* Filters */
.pu-filters {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.pu-f-group {
  display: flex; gap: 8px;
}
.pu-f-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  color: var(--text-muted);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.pu-f-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); }
.pu-f-btn.active {
  background: rgba(255,120,0,0.1);
  border-color: rgba(255,120,0,0.3);
  color: #ff7800;
}

/* Loading & Empty */
.pu-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 60px 0; color:var(--text-muted); gap: 16px; font-size:13px; }
.pu-spinner { width:24px; height:24px; border:3px solid rgba(255,120,0,0.2); border-top-color:#ff7800; border-radius:50%; animation:puSpin 1s linear infinite; }
@keyframes puSpin { to{transform:rotate(360deg)} }
.pu-empty { text-align: center; padding: 60px; color: var(--text-muted); font-size: 14px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); }

/* Timeline */
.pu-timeline {
  display: flex; flex-direction: column; gap: 40px;
}
.pu-day-group {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
}
@media (max-width: 768px) {
  .pu-day-group { grid-template-columns: 1fr; gap: 16px; }
}
.pu-day-sticky {
  position: sticky; top: 20px;
  align-self: start;
}
.pu-day-badge {
  font-size: 14px; font-weight: 800; color: var(--text-primary);
  margin-bottom: 4px; line-height: 1.2;
}
.pu-day-meta {
  font-size: 12px; color: var(--text-muted);
}

.pu-day-content {
  display: flex; flex-direction: column; gap: 20px;
}

.pu-card {
  position: relative;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 20px;
  display: flex; gap: 16px;
  transition: all 0.2s;
}
.pu-card:hover {
  background: rgba(255,255,255,0.04);
  border-color: var(--text-muted);
  transform: translateX(4px);
}

/* Connecting Line */
.pu-card-line {
  position: absolute; left: 36px; top: 56px; bottom: -20px;
  width: 2px; background: rgba(255,255,255,0.05);
  z-index: 0;
}
.pu-card:last-child .pu-card-line { display: none; }

.pu-type-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0; position: relative; z-index: 1;
}
.icon-feat { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); }
.icon-fix { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); }
.icon-perf { background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); }
.icon-other { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }

.pu-card-body {
  flex: 1; min-width: 0;
}

.pu-c-head {
  display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;
}
.pu-c-type {
  font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;
}
.type-feat { color: #22c55e; background: rgba(34,197,94,0.1); }
.type-fix { color: #ef4444; background: rgba(239,68,68,0.1); }
.type-perf { color: #a855f7; background: rgba(168,85,247,0.1); }
.type-other { color: var(--text-muted); background: rgba(255,255,255,0.05); }

.pu-c-time {
  font-size: 12px; color: var(--text-muted);
}
.pu-c-hash {
  font-size: 12px; font-family: monospace; color: var(--text-muted);
  text-decoration: none; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px;
}
.pu-c-hash:hover { color: #ff7800; background: rgba(255,120,0,0.1); }

.pu-c-title {
  font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;
  line-height: 1.4;
}
.pu-c-desc {
  font-size: 13px; color: var(--text-muted); line-height: 1.6; white-space: pre-wrap;
  margin-bottom: 16px;
}

.pu-c-foot {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
}
.pu-author {
  display: flex; align-items: center; gap: 8px;
}
.pu-author img { width: 20px; height: 20px; border-radius: 50%; }
.pu-author span { font-size: 12px; font-weight: 600; color: var(--text-muted); }

/* Light Theme overrides */
:global(.wildfire-dashboard.light-theme) .pu-card { background: rgba(255,255,255,0.95); border-color: rgba(0,0,0,0.08); box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
:global(.wildfire-dashboard.light-theme) .pu-card:hover { border-color: rgba(0,0,0,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .pu-card-line { background: rgba(0,0,0,0.08); }
:global(.wildfire-dashboard.light-theme) .pu-f-btn { border-color: rgba(0,0,0,0.1); color: #666; }
:global(.wildfire-dashboard.light-theme) .pu-f-btn.active { background: rgba(255,120,0,0.1); border-color: #ff7800; color: #ff7800; }
:global(.wildfire-dashboard.light-theme) .pu-empty { background: rgba(255,255,255,0.95); border-color: rgba(0,0,0,0.1); }
</style>
