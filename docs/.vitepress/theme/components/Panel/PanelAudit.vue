<!-- docs\.vitepress\theme\components\Panel\PanelAudit.vue -->
<template>
  <div class="panel-audit" :class="{ 'light-theme': isLightTheme }">
    <!-- Header -->
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
      
      <div class="audit-stats">
        <div class="stat-badge">
          <span class="stat-count">{{ filteredLogs.length }}</span>
          <span class="stat-label">EVENTS</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="audit-filters">
      <div class="filter-group">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          class="filter-btn"
          :class="{ active: activeFilter === filter.value }"
          @click="setFilter(filter.value)"
        >
          <span class="filter-dot" :class="filter.value"></span>
          {{ filter.label }}
          <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
        </button>
      </div>
      
      <div class="search-group">
        <div class="search-box">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21L17 17"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search events..."
          >
        </div>
        
        <button class="date-btn" @click="showDatePicker = !showDatePicker">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{{ dateRangeLabel }}</span>
        </button>
      </div>
    </div>

    <!-- Date Range Picker -->
    <div v-if="showDatePicker" class="date-picker">
      <div class="date-inputs">
        <div class="input-group">
          <label>From</label>
          <input type="date" v-model="dateFrom">
        </div>
        <div class="input-group">
          <label>To</label>
          <input type="date" v-model="dateTo">
        </div>
        <button class="apply-btn" @click="applyDateRange">Apply</button>
        <button class="clear-btn" @click="clearDateRange">Clear</button>
      </div>
    </div>

    <!-- Timeline -->
    <div class="audit-timeline">
      <div v-if="isLoading" class="timeline-loading">
        <div class="loader"></div>
        <span>Loading audit logs...</span>
      </div>
      
      <div v-else-if="filteredLogs.length === 0" class="timeline-empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <circle cx="12" cy="16" r="1"/>
        </svg>
        <h3>No events found</h3>
        <p>Try adjusting your filters or search query</p>
      </div>
      
      <div v-else class="timeline-events">
        <div 
          v-for="(event, index) in paginatedLogs" 
          :key="event.id" 
          class="timeline-event"
          :class="event.type"
          @click="openEventDetails(event)"
        >
          <div class="event-marker">
            <div class="marker-dot"></div>
            <div class="marker-line" v-if="index < paginatedLogs.length - 1"></div>
          </div>
          
          <div class="event-card">
            <div class="event-header">
              <div class="event-badge" :class="event.type">
                <svg v-if="event.type === 'commit'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <svg v-else-if="event.type === 'pr'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <circle cx="18" cy="18" r="3"/>
                  <circle cx="6" cy="6" r="3"/>
                  <path d="M6 21V9"/>
                  <path d="M18 21V9"/>
                </svg>
                <svg v-else-if="event.type === 'issue'" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v8"/>
                  <path d="M8 12h8"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{{ event.type.toUpperCase() }}</span>
              </div>
              <div class="event-time">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ formatTimeAgo(event.timestamp) }}
              </div>
            </div>
            
            <div class="event-body">
              <div class="event-message">
                <span class="message-text">{{ event.message }}</span>
                <span v-if="event.branch" class="event-branch">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor">
                    <path d="M6 3v12"/>
                    <path d="M18 9c0 1.5-1.5 3-4 3s-4-1.5-4-3 1.5-3 4-3 4 1.5 4 3z"/>
                    <circle cx="18" cy="6" r="3"/>
                    <circle cx="6" cy="18" r="3"/>
                  </svg>
                  {{ event.branch }}
                </span>
              </div>
              
              <div class="event-meta">
                <div class="meta-author">
                  <img :src="`https://github.com/${event.author}.png`" :alt="event.author" v-if="event.author">
                  <span>@{{ event.author }}</span>
                </div>
                <div class="meta-hash" v-if="event.hash">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8.5L7 3.5 5.5 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {{ event.hash.substring(0, 7) }}
                </div>
              </div>
            </div>
            
            <div class="event-footer">
              <div class="footer-stats" v-if="event.stats">
                <span v-if="event.stats.additions">+{{ event.stats.additions }}</span>
                <span v-if="event.stats.deletions">-{{ event.stats.deletions }}</span>
                <span v-if="event.stats.files">{{ event.stats.files }} files</span>
              </div>
              <div class="footer-link">
                <span>View details</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                  <path d="M5 12h14"/>
                  <path d="M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="pagination" v-if="filteredLogs.length > itemsPerPage">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path d="M15 18L9 12L15 6"/>
          </svg>
        </button>
        
        <div class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <path d="M9 18L15 12L9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-badge" :class="selectedEvent.type">
            {{ selectedEvent.type.toUpperCase() }}
          </div>
          <button class="modal-close" @click="closeModal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <h3>{{ selectedEvent.message }}</h3>
          
          <div class="modal-details">
            <div class="detail-row">
              <span class="detail-label">Author:</span>
              <span class="detail-value">@{{ selectedEvent.author }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDateTime(selectedEvent.timestamp) }}</span>
            </div>
            <div class="detail-row" v-if="selectedEvent.hash">
              <span class="detail-label">Hash:</span>
              <span class="detail-value code">{{ selectedEvent.hash }}</span>
            </div>
            <div class="detail-row" v-if="selectedEvent.branch">
              <span class="detail-label">Branch:</span>
              <span class="detail-value">{{ selectedEvent.branch }}</span>
            </div>
            <div class="detail-row" v-if="selectedEvent.repo">
              <span class="detail-label">Repository:</span>
              <span class="detail-value">{{ selectedEvent.repo }}</span>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="action-btn" @click="openInGitHub">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open on GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelAudit',
  
  props: {
    isLightTheme: {
      type: Boolean,
      default: false
    },
    auditLogs: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      searchQuery: '',
      activeFilter: 'all',
      showDatePicker: false,
      dateFrom: '',
      dateTo: '',
      currentPage: 1,
      itemsPerPage: 15,
      selectedEvent: null,
      appliedDateFrom: '',
      appliedDateTo: '',
      filters: [
        { value: 'all',    label: 'All Events' },
        { value: 'commit', label: 'Commits'    },
        { value: 'pr',     label: 'Pull Requests' },
        { value: 'issue',  label: 'Issues'     }
      ]
    }
  },

  computed: {
    filteredLogs() {
      let logs = [...(this.auditLogs || [])]
      if (this.activeFilter !== 'all') {
        logs = logs.filter(l => l.type === this.activeFilter)
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        logs = logs.filter(l =>
          (l.message || '').toLowerCase().includes(q) ||
          (l.author  || '').toLowerCase().includes(q) ||
          (l.hash    || '').toLowerCase().includes(q)
        )
      }
      if (this.appliedDateFrom) {
        const from = new Date(this.appliedDateFrom)
        logs = logs.filter(l => new Date(l.timestamp) >= from)
      }
      if (this.appliedDateTo) {
        const to = new Date(this.appliedDateTo)
        to.setHours(23, 59, 59, 999)
        logs = logs.filter(l => new Date(l.timestamp) <= to)
      }
      return logs
    },

    paginatedLogs() {
      const s = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredLogs.slice(s, s + this.itemsPerPage)
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredLogs.length / this.itemsPerPage))
    },

    dateRangeLabel() {
      if (this.appliedDateFrom && this.appliedDateTo) return `${this.appliedDateFrom} — ${this.appliedDateTo}`
      if (this.appliedDateFrom) return `From ${this.appliedDateFrom}`
      if (this.appliedDateTo)   return `Until ${this.appliedDateTo}`
      return 'Filter by date'
    }
  },

  watch: {
    searchQuery() { this.currentPage = 1 },
    activeFilter() { this.currentPage = 1 }
  },

  methods: {
    setFilter(val) {
      this.activeFilter = val
    },

    getFilterCount(val) {
      if (val === 'all') return this.auditLogs.length
      return this.auditLogs.filter(l => l.type === val).length
    },

    applyDateRange() {
      this.appliedDateFrom = this.dateFrom
      this.appliedDateTo   = this.dateTo
      this.showDatePicker  = false
      this.currentPage     = 1
    },

    clearDateRange() {
      this.dateFrom        = ''
      this.dateTo          = ''
      this.appliedDateFrom = ''
      this.appliedDateTo   = ''
      this.showDatePicker  = false
      this.currentPage     = 1
    },

    openEventDetails(event) {
      this.selectedEvent = event
    },

    closeModal() {
      this.selectedEvent = null
    },

    openInGitHub() {
      if (!this.selectedEvent) return
      const e = this.selectedEvent
      if (e.url) window.open(e.url, '_blank')
    },

    formatTimeAgo(ts) {
      if (!ts) return ''
      const diff = Date.now() - new Date(ts).getTime()
      const m = Math.floor(diff / 60000)
      if (m < 1)  return 'just now'
      if (m < 60) return `${m}m ago`
      const h = Math.floor(m / 60)
      if (h < 24) return `${h}h ago`
      const d = Math.floor(h / 24)
      if (d < 30) return `${d}d ago`
      return new Date(ts).toLocaleDateString()
    },

    formatDateTime(ts) {
      if (!ts) return ''
      return new Date(ts).toLocaleString()
    }
  }
}
</script>

<style scoped>
.panel-audit {
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.2);
  --commit-color: #3498db;
  --pr-color: #2ecc71;
  --issue-color: #e74c3c;
  
  animation: fadeIn 0.3s ease;
}

.panel-audit.light-theme {
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --border-color: #ddd;
  --text-primary: #333;
  --text-secondary: #4a4a55;
  --text-muted: #666;
  --accent-glow: rgba(255, 69, 0, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.audit-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audit-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.audit-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  background: var(--bg-tertiary);
  border-radius: 30px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-count {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
}

/* Filters */
.audit-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.filter-dot.commit { background: var(--commit-color); }
.filter-dot.pr { background: var(--pr-color); }
.filter-dot.issue { background: var(--issue-color); }
.filter-dot.all { background: var(--accent); }

.filter-count {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 10px;
}

.filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.search-group {
  display: flex;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
}

.search-box input {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 12px;
  outline: none;
  width: 200px;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.date-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Date Picker */
.date-picker {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.input-group input {
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 12px;
}

.apply-btn, .clear-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-btn {
  background: var(--accent);
  border: none;
  color: white;
}

.apply-btn:hover {
  background: var(--accent-hover);
}

.clear-btn {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
}

.clear-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Timeline */
.audit-timeline {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.timeline-loading, .timeline-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px;
  color: var(--text-muted);
}

.loader {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.timeline-events {
  padding: 20px;
}

.timeline-event {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.event-marker {
  position: relative;
  width: 24px;
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

.timeline-event.commit .marker-dot { background: var(--commit-color); }
.timeline-event.pr .marker-dot { background: var(--pr-color); }
.timeline-event.issue .marker-dot { background: var(--issue-color); }

.marker-line {
  position: absolute;
  top: 16px;
  width: 2px;
  height: calc(100% + 20px);
  background: var(--border-color);
}

.timeline-event:last-child .marker-line {
  display: none;
}

.event-card {
  flex: 1;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-card:hover {
  transform: translateX(4px);
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.event-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
}

.event-badge.commit {
  background: rgba(52, 152, 219, 0.15);
  color: var(--commit-color);
}

.event-badge.pr {
  background: rgba(46, 204, 113, 0.15);
  color: var(--pr-color);
}

.event-badge.issue {
  background: rgba(231, 76, 60, 0.15);
  color: var(--issue-color);
}

.event-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-muted);
}

.event-body {
  margin-bottom: 12px;
}

.event-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.message-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.event-branch {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 10px;
  color: var(--accent);
  font-family: monospace;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.meta-author img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.meta-hash {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.footer-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
}

.footer-stats span:first-child {
  color: var(--success);
}

.footer-stats span:nth-child(2) {
  color: var(--issue-color);
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--accent);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.page-btn {
  width: 36px;
  height: 36px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 12px;
  color: var(--text-muted);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  animation: modalIn 0.2s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.modal-badge.commit {
  background: rgba(52, 152, 219, 0.15);
  color: var(--commit-color);
}

.modal-badge.pr {
  background: rgba(46, 204, 113, 0.15);
  color: var(--pr-color);
}

.modal-badge.issue {
  background: rgba(231, 76, 60, 0.15);
  color: var(--issue-color);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: var(--accent);
  background: var(--bg-tertiary);
}

.modal-body {
  padding: 20px;
}

.modal-body h3 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.modal-details {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 11px;
  color: var(--text-muted);
}

.detail-value {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
}

.detail-value.code {
  font-family: monospace;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.modal-actions .action-btn {
  padding: 10px 20px;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.modal-actions .action-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 900px) {
  .audit-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: center;
  }
  
  .search-group {
    justify-content: center;
  }
}

@media (max-width: 700px) {
  .timeline-event {
    flex-direction: column;
    gap: 8px;
  }
  
  .event-marker {
    display: none;
  }
  
  .event-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>