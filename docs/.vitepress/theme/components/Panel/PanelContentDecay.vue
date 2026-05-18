<template>
  <div class="pcd-wrap" data-lenis-prevent>
    <!-- Header -->
    <div class="pcd-head">
      <div>
        <h2 class="pcd-h2">Content Decay Tracker</h2>
        <p class="pcd-sub">Monitor document freshness and identify stale pages.</p>
      </div>
      <div class="pcd-kpis">
        <div class="pcd-kpi">
          <span class="pcd-kv" style="color: var(--accent);">{{ pages.length }}</span>
          <span class="pcd-kl">TOTAL PAGES</span>
        </div>
        <div class="pcd-kpi">
          <span class="pcd-kv" :class="averageAge < 30 ? 'green' : averageAge < 90 ? 'yellow' : 'red'">{{ averageAge }}d</span>
          <span class="pcd-kl">AVG AGE</span>
        </div>
        <div class="pcd-kpi">
          <span class="pcd-kv" :style="{ color: healthScore >= 80 ? '#22c55e' : healthScore >= 50 ? '#f59e0b' : '#ef4444' }">{{ healthScore }}%</span>
          <span class="pcd-kl">HEALTH SCORE</span>
        </div>
      </div>
    </div>

    <!-- Health Bar -->
    <div class="pcd-health-card">
      <div class="hc-title">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <span>WIKI FRESHNESS DISTRIBUTION</span>
      </div>
      <div class="hc-bar-wrap">
        <div class="hc-bar hc-fresh" :style="{ width: (fresh.length / pages.length * 100) + '%' }" :title="fresh.length + ' Fresh'"></div>
        <div class="hc-bar hc-aging" :style="{ width: (aging.length / pages.length * 100) + '%' }" :title="aging.length + ' Aging'"></div>
        <div class="hc-bar hc-stale" :style="{ width: (stale.length / pages.length * 100) + '%' }" :title="stale.length + ' Stale'"></div>
      </div>
      <div class="hc-legend">
        <div class="hc-leg-item" @click="filter = 'fresh'" :class="{ active: filter === 'fresh' }">
          <span class="hc-dot hc-fresh-bg"></span> Fresh (0-30d) <span class="hc-count">{{ fresh.length }}</span>
        </div>
        <div class="hc-leg-item" @click="filter = 'aging'" :class="{ active: filter === 'aging' }">
          <span class="hc-dot hc-aging-bg"></span> Aging (31-90d) <span class="hc-count">{{ aging.length }}</span>
        </div>
        <div class="hc-leg-item" @click="filter = 'stale'" :class="{ active: filter === 'stale' }">
          <span class="hc-dot hc-stale-bg"></span> Stale (>90d) <span class="hc-count">{{ stale.length }}</span>
        </div>
        <div class="hc-leg-item hc-leg-all" @click="filter = 'all'" :class="{ active: filter === 'all' }">
          All Pages
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="pcd-toolbar">
      <div class="pcd-search-box">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" placeholder="Search pages..." />
      </div>
      <div class="pcd-sort-row">
        <button class="pcd-sort" :class="{ active: sortKey === 'oldest' }" @click="sortKey = 'oldest'">Oldest First</button>
        <button class="pcd-sort" :class="{ active: sortKey === 'newest' }" @click="sortKey = 'newest'">Newest First</button>
      </div>
    </div>

    <!-- Pages List -->
    <div class="pcd-list">
      <div v-for="page in pagedList" :key="page.path" class="pcd-row">
        <div class="pcd-row-icon" :class="'icon-' + getCategory(page)">
          <svg v-if="getCategory(page) === 'fresh'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <svg v-else-if="getCategory(page) === 'aging'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="pcd-row-body">
          <a :href="page.url" target="_blank" class="pcd-row-title">{{ page.title || 'Untitled Page' }}</a>
          <div class="pcd-row-path">{{ page.path }}</div>
        </div>
        <div class="pcd-row-meta">
          <div class="pcd-meta-item">
            <span class="pcd-meta-lbl">Last Editor</span>
            <span class="pcd-meta-val">@{{ page.author }}</span>
          </div>
          <div class="pcd-meta-item">
            <span class="pcd-meta-lbl">Age</span>
            <span class="pcd-meta-val" :class="getCategory(page) + '-text'">{{ page.daysAgo }} days</span>
          </div>
        </div>
        <a :href="page.url" target="_blank" class="pcd-row-btn">
          View ↗
        </a>
      </div>
      
      <div v-if="!pagedList.length" class="pcd-empty">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>No pages found for the current filter.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pcd-pages" v-if="totalPages > 1">
      <button class="pcd-pg" :disabled="currentPage === 1" @click="currentPage--">←</button>
      <span class="pcd-pg-info">{{ currentPage }} / {{ totalPages }}</span>
      <button class="pcd-pg" :disabled="currentPage === totalPages" @click="currentPage++">→</button>
    </div>

  </div>
</template>

<script>
// We use dynamic import so it works safely in Vue
import { data as pagesData } from '../../data/contentDecay.data.js'

export default {
  name: 'PanelContentDecay',
  data() {
    return {
      pages: [],
      filter: 'all', // all, fresh, aging, stale
      searchQuery: '',
      sortKey: 'oldest', // oldest, newest
      currentPage: 1,
      perPage: 12
    }
  },
  mounted() {
    const now = Date.now()
    this.pages = pagesData.map(p => {
      const daysAgo = Math.floor((now - p.lastModified) / (1000 * 60 * 60 * 24))
      return { ...p, daysAgo }
    })
  },
  computed: {
    fresh() { return this.pages.filter(p => p.daysAgo <= 30) },
    aging() { return this.pages.filter(p => p.daysAgo > 30 && p.daysAgo <= 90) },
    stale() { return this.pages.filter(p => p.daysAgo > 90) },
    
    averageAge() {
      if (!this.pages.length) return 0
      const total = this.pages.reduce((acc, p) => acc + p.daysAgo, 0)
      return Math.round(total / this.pages.length)
    },
    
    healthScore() {
      if (!this.pages.length) return 100
      // 100 points max. Deduct 1 point for every aging page, 3 points for every stale page.
      const penalty = (this.aging.length * 1) + (this.stale.length * 3)
      const score = 100 - (penalty / this.pages.length * 100)
      return Math.max(0, Math.round(score))
    },

    filteredList() {
      let list = this.pages

      if (this.filter === 'fresh') list = this.fresh
      else if (this.filter === 'aging') list = this.aging
      else if (this.filter === 'stale') list = this.stale

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.path.toLowerCase().includes(q))
      }

      list.sort((a, b) => {
        if (this.sortKey === 'oldest') return b.daysAgo - a.daysAgo
        return a.daysAgo - b.daysAgo
      })

      return list
    },

    pagedList() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredList.slice(start, start + this.perPage)
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredList.length / this.perPage))
    }
  },
  watch: {
    filter() { this.currentPage = 1 },
    searchQuery() { this.currentPage = 1 },
    sortKey() { this.currentPage = 1 }
  },
  methods: {
    getCategory(page) {
      if (page.daysAgo <= 30) return 'fresh'
      if (page.daysAgo <= 90) return 'aging'
      return 'stale'
    }
  }
}
</script>

<style scoped>
.pcd-wrap {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeUp 0.4s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

/* Header */
.pcd-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
.pcd-h2 { font-size: 24px; font-weight: 900; color: var(--text-primary); margin: 0 0 4px; }
.pcd-sub { font-size: 13px; color: var(--text-muted); margin: 0; }
.pcd-kpis { display: flex; gap: 12px; }
.pcd-kpi { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; min-width: 100px; }
.pcd-kv { font-size: 20px; font-weight: 800; font-family: monospace; }
.pcd-kv.green { color: #22c55e; }
.pcd-kv.yellow { color: #f59e0b; }
.pcd-kv.red { color: #ef4444; }
.pcd-kl { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }

/* Health Card */
.pcd-health-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; padding: 20px; }
.hc-title { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 16px; }
.hc-bar-wrap { height: 8px; border-radius: 4px; overflow: hidden; display: flex; background: rgba(255,255,255,0.05); margin-bottom: 16px; }
.hc-bar { height: 100%; transition: width 0.3s ease; }
.hc-fresh { background: #22c55e; }
.hc-aging { background: #f59e0b; }
.hc-stale { background: #ef4444; }
.hc-legend { display: flex; gap: 16px; flex-wrap: wrap; }
.hc-leg-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); cursor: pointer; padding: 6px 10px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent; }
.hc-leg-item:hover { background: rgba(255,255,255,0.04); }
.hc-leg-item.active { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); color: var(--text-primary); }
.hc-dot { width: 8px; height: 8px; border-radius: 50%; }
.hc-fresh-bg { background: #22c55e; }
.hc-aging-bg { background: #f59e0b; }
.hc-stale-bg { background: #ef4444; }
.hc-count { font-family: monospace; font-weight: bold; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 10px; font-size: 11px; }

/* Toolbar */
.pcd-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
.pcd-search-box { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 10px; flex: 1; max-width: 320px; }
.pcd-search-box input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 13px; width: 100%; }
.pcd-sort-row { display: flex; gap: 8px; }
.pcd-sort { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); font-size: 12px; font-weight: 600; padding: 8px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.pcd-sort:hover { background: rgba(255,255,255,0.08); }
.pcd-sort.active { background: rgba(255,120,0,0.15); border-color: rgba(255,120,0,0.3); color: #ff7800; }

/* List */
.pcd-list { display: flex; flex-direction: column; gap: 8px; }
.pcd-row { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; transition: all 0.2s; }
.pcd-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); transform: translateY(-1px); }
.pcd-row-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-fresh { background: rgba(34,197,94,0.1); color: #22c55e; }
.icon-aging { background: rgba(245,158,11,0.1); color: #f59e0b; }
.icon-stale { background: rgba(239,68,68,0.1); color: #ef4444; }

.pcd-row-body { flex: 1; min-width: 0; }
.pcd-row-title { display: block; font-size: 15px; font-weight: 700; color: var(--text-primary); text-decoration: none; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pcd-row-title:hover { color: var(--accent); }
.pcd-row-path { font-size: 11px; color: var(--text-muted); font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.pcd-row-meta { display: flex; gap: 24px; }
.pcd-meta-item { display: flex; flex-direction: column; gap: 4px; text-align: right; }
.pcd-meta-lbl { font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
.pcd-meta-val { font-size: 13px; font-weight: 700; font-family: monospace; color: var(--text-primary); }

.fresh-text { color: #22c55e; }
.aging-text { color: #f59e0b; }
.stale-text { color: #ef4444; }

.pcd-row-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; transition: all 0.2s; margin-left: 12px; }
.pcd-row-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

.pcd-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px; color: var(--text-muted); font-size: 14px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); }

/* Pages */
.pcd-pages { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 10px; }
.pcd-pg { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: var(--text-primary); width: 36px; height: 36px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.pcd-pg:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
.pcd-pg:disabled { opacity: 0.3; cursor: not-allowed; }
.pcd-pg-info { font-size: 13px; color: var(--text-muted); font-family: monospace; font-weight: 700; }

/* Light Theme Overrides */
:global(.wildfire-dashboard.light-theme) .pcd-h2,
:global(.wildfire-dashboard.light-theme) .pcd-row-title,
:global(.wildfire-dashboard.light-theme) .pcd-meta-val { color: #111; }
:global(.wildfire-dashboard.light-theme) .pcd-sub,
:global(.wildfire-dashboard.light-theme) .hc-title,
:global(.wildfire-dashboard.light-theme) .hc-leg-item,
:global(.wildfire-dashboard.light-theme) .pcd-row-path,
:global(.wildfire-dashboard.light-theme) .pcd-meta-lbl { color: #666; }

:global(.wildfire-dashboard.light-theme) .pcd-kpi,
:global(.wildfire-dashboard.light-theme) .pcd-health-card,
:global(.wildfire-dashboard.light-theme) .pcd-search-box,
:global(.wildfire-dashboard.light-theme) .pcd-sort,
:global(.wildfire-dashboard.light-theme) .pcd-row { background: #fff; border-color: rgba(0,0,0,0.08); box-shadow: 0 2px 6px rgba(0,0,0,0.03); }

:global(.wildfire-dashboard.light-theme) .hc-bar-wrap { background: rgba(0,0,0,0.05); }
:global(.wildfire-dashboard.light-theme) .hc-leg-item.active { background: #f0f0f0; border-color: rgba(0,0,0,0.1); color: #111; }
:global(.wildfire-dashboard.light-theme) .hc-count { background: rgba(0,0,0,0.05); color: #111; }
:global(.wildfire-dashboard.light-theme) .pcd-search-box input { color: #111; }
:global(.wildfire-dashboard.light-theme) .pcd-sort.active { background: rgba(255,120,0,0.1); border-color: rgba(255,120,0,0.3); color: #ff7800; }
:global(.wildfire-dashboard.light-theme) .pcd-row:hover { background: #f8f9fa; border-color: rgba(0,0,0,0.15); }
:global(.wildfire-dashboard.light-theme) .pcd-row-btn { background: #f8f9fa; border-color: rgba(0,0,0,0.1); color: #111; }
:global(.wildfire-dashboard.light-theme) .pcd-row-btn:hover { background: #e2e8f0; }
:global(.wildfire-dashboard.light-theme) .pcd-pg { background: #fff; border-color: rgba(0,0,0,0.1); color: #111; }
:global(.wildfire-dashboard.light-theme) .pcd-pg:hover:not(:disabled) { background: #f0f0f0; }
</style>
