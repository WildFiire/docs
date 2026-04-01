<template>
  <div class="panel-feedbacks" :class="{ 'light-theme': isLightTheme }">
    <!-- Header -->
    <div class="pf-header">
      <div class="pf-title-row">
        <div class="pf-title-left">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--accent)" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <h2>FEEDBACK INBOX</h2>
        </div>
        <div class="pf-header-right">
          <div class="pf-summary-pills">
            <span class="pf-pill good">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              {{ goodCount }} Good
            </span>
            <span class="pf-pill bad">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
              {{ badCount }} Bad
            </span>
            <span class="pf-pill avg" v-if="avgRating > 0">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="#ffd700" stroke="#ffd700" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {{ avgRating.toFixed(1) }} avg
            </span>
          </div>
          <div class="pf-filter-row">
            <button
              v-for="f in filterOptions"
              :key="f.key"
              class="pf-filter-btn"
              :class="{ active: activeFilter === f.key }"
              @click="activeFilter = f.key"
            >{{ f.label }}</button>
          </div>
          <button class="pf-refresh-btn" @click="loadFeedbacks" :disabled="loading" :title="'Refresh'">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" :class="{ spin: loading }">
              <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9"/><path d="M21 3v6h-6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="pf-stats-bar" v-if="feedbacks.length">
        <div class="pfsb-item">
          <span class="pfsb-val">{{ feedbacks.length }}</span>
          <span class="pfsb-lbl">TOTAL</span>
        </div>
        <div class="pfsb-sep"></div>
        <div class="pfsb-item">
          <span class="pfsb-val" style="color:#22c55e">{{ satisfactionPct }}%</span>
          <span class="pfsb-lbl">SATISFACTION</span>
        </div>
        <div class="pfsb-sep"></div>
        <div class="pfsb-item">
          <span class="pfsb-val">{{ uniquePages }}</span>
          <span class="pfsb-lbl">PAGES</span>
        </div>
        <div class="pfsb-sep"></div>
        <div class="pfsb-item">
          <span class="pfsb-val" style="color:#ffd700">{{ ratedCount }}</span>
          <span class="pfsb-lbl">RATED</span>
        </div>
        <div class="pfsb-sep"></div>
        <div class="pfsb-item pfsb-bar-item">
          <div class="pfsb-sentiment-bar">
            <div class="pfsb-good-fill" :style="{ width: goodPct + '%' }"></div>
            <div class="pfsb-bad-fill" :style="{ width: badPct + '%' }"></div>
          </div>
          <span class="pfsb-lbl">SENTIMENT</span>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !feedbacks.length" class="pf-loading">
      <div class="pf-spinner"></div>
      <span>Loading feedback discussions…</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="pf-error">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
      <span>{{ error }}</span>
      <button class="pf-retry-btn" @click="loadFeedbacks">Retry</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && filteredFeedbacks.length === 0" class="pf-empty">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>No feedback yet{{ activeFilter !== 'all' ? ' for this filter' : '' }}</span>
      <p>Users can leave feedback using the widget on any page</p>
    </div>

    <!-- Feedbacks list -->
    <div v-else class="pf-list">
      <div
        v-for="fb in filteredFeedbacks"
        :key="fb.id"
        class="pf-card"
        :class="['pf-card-' + fb.sentiment, { 'pf-card-expanded': expandedId === fb.id }]"
        @click="toggleExpand(fb.id)"
      >
        <div class="pf-card-main">
          <div class="pf-card-left">
            <div class="pf-sentiment-dot" :class="'dot-' + fb.sentiment">
              <svg v-if="fb.sentiment === 'good'" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              <svg v-else viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
            </div>
            <div class="pf-card-body">
              <div class="pf-card-top">
                <span class="pf-page-label">{{ fb.pageTitle }}</span>
                <div class="pf-stars" v-if="fb.stars > 0">
                  <svg v-for="s in 5" :key="s" viewBox="0 0 24 24" width="10" height="10" :fill="s <= fb.stars ? '#ffd700' : 'none'" :stroke="s <= fb.stars ? '#ffd700' : 'rgba(255,255,255,0.2)'" stroke-width="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span class="pf-stars-text">{{ fb.stars }}/5</span>
                </div>
              </div>
              <p class="pf-comment">{{ fb.comment }}</p>
              <div class="pf-card-meta">
                <span class="pf-meta-page">
                  <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/></svg>
                  {{ fb.pagePath }}
                </span>
                <span class="pf-meta-sep">·</span>
                <span class="pf-meta-date">{{ timeAgo(fb.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="pf-card-right">
            <a :href="fb.url" target="_blank" rel="noopener" class="pf-gh-link" @click.stop title="View on GitHub">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <svg class="pf-expand-arrow" :class="{ expanded: expandedId === fb.id }" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
        <!-- Expanded detail -->
        <div class="pf-card-expanded-body" v-if="expandedId === fb.id">
          <div class="pf-expanded-grid">
            <div class="pfe-row">
              <span class="pfe-key">Page</span>
              <span class="pfe-val"><a :href="fb.pageUrl" target="_blank" class="pfe-link">{{ fb.pagePath }}</a></span>
            </div>
            <div class="pfe-row">
              <span class="pfe-key">Rating</span>
              <span class="pfe-val" :class="fb.sentiment === 'good' ? 'pfe-good' : 'pfe-bad'">{{ fb.sentiment === 'good' ? 'Helpful ✓' : 'Not helpful ✗' }}</span>
            </div>
            <div class="pfe-row" v-if="fb.stars">
              <span class="pfe-key">Stars</span>
              <span class="pfe-val">{{ fb.stars }}/5 — {{ fb.starsLabel }}</span>
            </div>
            <div class="pfe-row">
              <span class="pfe-key">Submitted</span>
              <span class="pfe-val">{{ new Date(fb.createdAt).toLocaleString() }}</span>
            </div>
            <div class="pfe-row pfe-full">
              <span class="pfe-key">Comment</span>
              <span class="pfe-val pfe-comment-full">{{ fb.comment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelFeedbacks',
  props: {
    githubToken:  { type: String, default: '' },
    isLightTheme: { type: Boolean, default: false }
  },
  data() {
    return {
      feedbacks:    [],
      loading:      false,
      error:        null,
      activeFilter: 'all',
      expandedId:   null,
      filterOptions: [
        { key: 'all',  label: 'ALL'  },
        { key: 'good', label: 'GOOD' },
        { key: 'bad',  label: 'BAD'  },
        { key: 'rated', label: 'RATED' }
      ]
    }
  },
  computed: {
    filteredFeedbacks() {
      if (this.activeFilter === 'all')   return this.feedbacks
      if (this.activeFilter === 'good')  return this.feedbacks.filter(f => f.sentiment === 'good')
      if (this.activeFilter === 'bad')   return this.feedbacks.filter(f => f.sentiment === 'bad')
      if (this.activeFilter === 'rated') return this.feedbacks.filter(f => f.stars > 0)
      return this.feedbacks
    },
    goodCount()       { return this.feedbacks.filter(f => f.sentiment === 'good').length },
    badCount()        { return this.feedbacks.filter(f => f.sentiment === 'bad').length },
    ratedCount()      { return this.feedbacks.filter(f => f.stars > 0).length },
    avgRating() {
      const rated = this.feedbacks.filter(f => f.stars > 0)
      if (!rated.length) return 0
      return rated.reduce((s, f) => s + f.stars, 0) / rated.length
    },
    satisfactionPct() {
      if (!this.feedbacks.length) return 0
      return Math.round(this.goodCount / this.feedbacks.length * 100)
    },
    uniquePages() {
      return new Set(this.feedbacks.map(f => f.pagePath)).size
    },
    goodPct() {
      if (!this.feedbacks.length) return 50
      return Math.round(this.goodCount / this.feedbacks.length * 100)
    },
    badPct() {
      return 100 - this.goodPct
    }
  },
  mounted() {
    this.loadFeedbacks()
  },
  watch: {
    githubToken(v) { if (v) this.loadFeedbacks() }
  },
  methods: {
    toggleExpand(id) {
      this.expandedId = this.expandedId === id ? null : id
    },
    async loadFeedbacks() {
      if (!this.githubToken) { this.error = 'No GitHub token available'; return }
      this.loading = true
      this.error   = null
      try {
        const query = `
          query {
            repository(owner: "WildFiire", name: "docs") {
              discussions(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
                nodes {
                  id
                  title
                  body
                  url
                  createdAt
                  category { name }
                }
              }
            }
          }
        `
        const res = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        })
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
        const data = await res.json()
        if (data.errors) throw new Error(data.errors[0].message)
        const nodes = data.data?.repository?.discussions?.nodes || []
        this.feedbacks = nodes
          .filter(n => this.isFeedback(n))
          .map(n => this.parseFeedback(n))
      } catch (e) {
        this.error = e.message || 'Failed to load feedbacks'
      } finally {
        this.loading = false
      }
    },
    isFeedback(node) {
      return /^\[(GOOD|BAD)\]/i.test(node.title)
    },
    parseFeedback(node) {
      const sentimentMatch = node.title.match(/^\[(GOOD|BAD)\]/i)
      const sentiment = sentimentMatch ? sentimentMatch[1].toLowerCase() : 'good'
      const starsMatch  = node.title.match(/\((\d)★/)
      const starsLabelMatch = node.title.match(/★ - ([^)]+)\)/)
      const stars       = starsMatch ? parseInt(starsMatch[1]) : 0
      const starsLabels = ['','Poor','Fair','Good','Very Good','Excellent']
      const starsLabel  = starsLabelMatch ? starsLabelMatch[1] : (starsLabels[stars] || '')
      const pageMatch   = node.body.match(/\*\*Page:\*\*\s*(.+)/m)
      const urlMatch    = node.body.match(/\*\*URL:\*\*\s*(https?:\/\/[^\s\n]+)/m)
      const commentMatch = node.body.match(/### Comment:\n([\s\S]+?)(\n---|\n##|$)/)
      const pagePath    = pageMatch ? pageMatch[1].trim() : '—'
      const pageUrl     = urlMatch  ? urlMatch[1].trim()  : '#'
      const pageName    = pagePath.replace(/\.md$/, '').split('/').pop().replace(/[-_]/g, ' ')
      const pageTitle   = pageName.charAt(0).toUpperCase() + pageName.slice(1) || node.title.replace(/^\[(GOOD|BAD)\]\s*/i, '').replace(/\s*\(\d★[^)]*\)/, '').trim()
      const comment     = commentMatch ? commentMatch[1].trim() : ''
      return {
        id:         node.id,
        title:      node.title,
        url:        node.url,
        createdAt:  node.createdAt,
        sentiment,
        stars,
        starsLabel,
        pagePath,
        pageUrl,
        pageTitle,
        comment
      }
    },
    timeAgo(dateStr) {
      const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
      if (diff < 60)     return 'just now'
      if (diff < 3600)   return Math.floor(diff / 60) + 'm ago'
      if (diff < 86400)  return Math.floor(diff / 3600) + 'h ago'
      if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
      return new Date(dateStr).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.panel-feedbacks {
  --bg-primary:   #0a0a0c;
  --bg-secondary: #0f0f12;
  --bg-tertiary:  #1a1a20;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted:   #8a8a95;
  --accent:       #ff4500;
  --accent-glow: rgba(255,69,0,0.2);
  --accent-dim: rgba(255,69,0,0.08); --accent-soft: rgba(255,69,0,0.15);
  --accent-mid: rgba(255,69,0,0.28); --accent-strong: rgba(255,69,0,0.45);
  --accent-heavy: rgba(255,69,0,0.68); --accent-solid: rgba(255,69,0,0.88);
  --accent-alt: #ff6030; --accent-alt2: #ff8c42;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.panel-feedbacks.light-theme {
  --bg-primary:   #f0f0f5;
  --bg-secondary: #ffffff;
  --bg-tertiary:  #e2e2ea;
  --border-color: #c4c4d0;
  --text-primary: #0f0f14;
  --text-secondary: #2a2a38;
  --text-muted:   #4a4a5a;
}
.panel-feedbacks.light-theme .pf-card:hover { border-color:rgba(0,0,0,0.18); box-shadow:0 4px 18px rgba(0,0,0,0.1); }
.panel-feedbacks.light-theme .pf-card-good:hover { border-left-color:#22c55e; }
.panel-feedbacks.light-theme .pf-card-bad:hover  { border-left-color:#ef4444; }
.panel-feedbacks::-webkit-scrollbar { width: 4px; }
.panel-feedbacks::-webkit-scrollbar-track { background: transparent; }
.panel-feedbacks::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }

/* Header */
.pf-header { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden; }
.pf-title-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; gap: 12px; flex-wrap: wrap; border-bottom: 1px solid var(--border-color); }
.pf-title-left { display: flex; align-items: center; gap: 10px; }
.pf-title-left h2 { font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: 0.5px; }
.pf-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pf-summary-pills { display: flex; align-items: center; gap: 6px; }
.pf-pill { display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
.pf-pill.good { background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }
.pf-pill.bad  { background: rgba(239,68,68,0.12);  color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
.pf-pill.avg  { background: rgba(255,215,0,0.12);  color: #ffd700; border: 1px solid rgba(255,215,0,0.25); }
.pf-filter-row { display: flex; align-items: center; gap: 3px; }
.pf-filter-btn { background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-muted); font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 6px; cursor: pointer; transition: all 0.15s; letter-spacing: 0.4px; }
.pf-filter-btn:hover { border-color: var(--accent); color: var(--accent); }
.pf-filter-btn.active { background: var(--accent-dim); border-color: var(--accent-strong); color: var(--accent); }
.pf-refresh-btn { background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-muted); width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.pf-refresh-btn:hover { border-color: var(--accent); color: var(--accent); }
.pf-refresh-btn:disabled { opacity: 0.5; cursor: default; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }

/* Stats bar */
.pf-stats-bar { display: flex; align-items: stretch; }
.pfsb-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 12px; gap: 2px; }
.pfsb-sep { width: 1px; background: var(--border-color); margin: 8px 0; flex-shrink: 0; }
.pfsb-val { font-size: 15px; font-weight: 800; color: var(--text-primary); line-height: 1.1; }
.pfsb-lbl { font-size: 8px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.6px; }
.pfsb-bar-item { flex: 2; }
.pfsb-sentiment-bar { width: 100%; height: 6px; border-radius: 3px; background: var(--bg-tertiary); overflow: hidden; display: flex; margin-bottom: 4px; }
.pfsb-good-fill { height: 100%; background: #22c55e; border-radius: 3px 0 0 3px; transition: width 0.8s ease; }
.pfsb-bad-fill  { height: 100%; background: #ef4444; border-radius: 0 3px 3px 0; transition: width 0.8s ease; }

/* Loading / Error / Empty */
.pf-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 60px 20px; color: var(--text-muted); font-size: 13px; }
.pf-spinner { width: 32px; height: 32px; border: 2px solid var(--border-color); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
.pf-error { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 50px 20px; color: #ef4444; font-size: 12px; text-align: center; }
.pf-retry-btn { background: var(--accent-dim); border: 1px solid var(--accent-mid); color: var(--accent); padding: 6px 16px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600; transition: all 0.15s; }
.pf-retry-btn:hover { background: var(--accent-soft); }
.pf-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 60px 20px; color: var(--text-muted); }
.pf-empty span { font-size: 14px; font-weight: 600; }
.pf-empty p { font-size: 11px; margin: 0; opacity: 0.6; }

/* Feedback cards */
.pf-list { display: flex; flex-direction: column; gap: 8px; }
.pf-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.18s; }
.pf-card:hover { border-color: rgba(255,255,255,0.12); box-shadow: 0 4px 18px rgba(0,0,0,0.3); }
.pf-card-good { border-left: 3px solid rgba(34,197,94,0.5); }
.pf-card-bad  { border-left: 3px solid rgba(239,68,68,0.5); }
.pf-card-good:hover { border-left-color: #22c55e; }
.pf-card-bad:hover  { border-left-color: #ef4444; }

.pf-card-main { display: flex; align-items: flex-start; justify-content: space-between; padding: 13px 16px; gap: 12px; }
.pf-card-left { display: flex; align-items: flex-start; gap: 12px; flex: 1; min-width: 0; }
.pf-sentiment-dot { width: 24px; height: 24px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.dot-good { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }
.dot-bad  { background: rgba(239,68,68,0.15);  color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }

.pf-card-body { flex: 1; min-width: 0; }
.pf-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
.pf-page-label { font-size: 12px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; text-transform: capitalize; }
.pf-stars { display: flex; align-items: center; gap: 2px; }
.pf-stars-text { font-size: 9px; color: #ffd700; font-weight: 700; margin-left: 3px; }
.pf-comment { font-size: 11.5px; color: var(--text-secondary); margin: 0 0 6px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pf-card-meta { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--text-muted); }
.pf-meta-page { display: flex; align-items: center; gap: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 220px; font-family: monospace; }
.pf-meta-sep { opacity: 0.4; }
.pf-meta-date { white-space: nowrap; }

.pf-card-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.pf-gh-link { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); text-decoration: none; transition: all 0.15s; }
.pf-gh-link:hover { border-color: var(--accent); color: var(--accent); }
.pf-expand-arrow { color: var(--text-muted); transition: transform 0.2s; }
.pf-expand-arrow.expanded { transform: rotate(180deg); }

/* Expanded detail */
.pf-card-expanded-body { border-top: 1px solid var(--border-color); padding: 14px 16px; background: var(--bg-tertiary); }
.pf-expanded-grid { display: flex; flex-direction: column; gap: 8px; }
.pfe-row { display: flex; align-items: flex-start; gap: 12px; }
.pfe-full { flex-direction: column; gap: 4px; }
.pfe-key { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); width: 72px; flex-shrink: 0; padding-top: 1px; }
.pfe-full .pfe-key { width: auto; }
.pfe-val { font-size: 11px; color: var(--text-secondary); line-height: 1.5; }
.pfe-link { color: var(--accent); text-decoration: none; }
.pfe-link:hover { text-decoration: underline; }
.pfe-good { color: #22c55e; font-weight: 600; }
.pfe-bad  { color: #ef4444; font-weight: 600; }
.pfe-comment-full { white-space: pre-wrap; background: var(--bg-secondary); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color); display: block; font-size: 12px; color: var(--text-primary); }
</style>
