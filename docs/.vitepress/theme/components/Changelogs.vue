<template>
  <div class="changelogs">
    <!-- FILTERS PANEL -->
    <div class="filters-panel">
      <div class="search-container">
        <div class="search-field">
          <span class="search-glass">🔍</span>
          <input 
            type="text" 
            v-model="search" 
            placeholder="Search commits..."
          >
          <span v-if="search" class="search-clear" @click="search = ''">✕</span>
        </div>
        
        <div class="search-hints">
          <button class="hint-chip" @click="search = 'feat'">✨ feature</button>
          <button class="hint-chip" @click="search = 'fix'">🔧 fix</button>
          <button class="hint-chip" @click="search = 'docs'">📚 docs</button>
          <button class="hint-chip" @click="search = 'refactor'">♻️ refactor</button>
          <button class="hint-chip" @click="search = 'test'">🧪 test</button>
        </div>
      </div>

      <div class="filters-row">
        <div class="sort-group">
          <button 
            class="sort-pill" 
            :class="{ active: sortOrder === 'desc' }"
            @click="sortOrder = 'desc'"
          >
            <span class="pill-icon">⬇️</span>
            <span class="pill-text">Newest</span>
          </button>
          <button 
            class="sort-pill" 
            :class="{ active: sortOrder === 'asc' }"
            @click="sortOrder = 'asc'"
          >
            <span class="pill-icon">⬆️</span>
            <span class="pill-text">Oldest</span>
          </button>
        </div>

        <div class="tags-group">
          <PageTagGreen 
            :class="{ 'tag-active': tagFilter === 'feat' }" 
            @click="tagFilter = tagFilter === 'feat' ? 'all' : 'feat'"
          >✨ feat</PageTagGreen>
          <PageTagRed 
            :class="{ 'tag-active': tagFilter === 'fix' }" 
            @click="tagFilter = tagFilter === 'fix' ? 'all' : 'fix'"
          >🔧 fix</PageTagRed>
          <PageTagBlue 
            :class="{ 'tag-active': tagFilter === 'docs' }" 
            @click="tagFilter = tagFilter === 'docs' ? 'all' : 'docs'"
          >📚 docs</PageTagBlue>
          <PageTagOrange 
            :class="{ 'tag-active': tagFilter === 'refactor' }" 
            @click="tagFilter = tagFilter === 'refactor' ? 'all' : 'refactor'"
          >♻️ refactor</PageTagOrange>
          <PageTagPurple 
            :class="{ 'tag-active': tagFilter === 'test' }" 
            @click="tagFilter = tagFilter === 'test' ? 'all' : 'test'"
          >🧪 test</PageTagPurple>
        </div>

        <button class="reset-pill" @click="resetFilters">
          <span class="pill-icon">↺</span>
          <span class="pill-text">Reset</span>
        </button>

        <div class="count-badge" v-if="!isLoading">
          <span class="count-number">{{ filteredCommits.length }}</span>
          <span class="count-label">commits</span>
        </div>
        <div class="count-badge loading-badge" v-else>
          <span class="loading-spinner-small"></span>
          <span class="count-label">loading</span>
        </div>
      </div>

      <transition name="fade-slide">
        <div class="active-filters" v-if="search || tagFilter !== 'all'">
          <div v-if="search" class="filter-tag">
            <span>🔍 {{ search }}</span>
            <button @click="search = ''">✕</button>
          </div>
          <div v-if="tagFilter !== 'all'" class="filter-tag">
            <span>🏷️ {{ tagFilter }}</span>
            <button @click="tagFilter = 'all'">✕</button>
          </div>
        </div>
      </transition>
    </div>

    <!-- COMMITS LIST -->
    <div class="commits-flow">
      <div v-if="isLoading" class="loading-liquid">
        <div class="loading-sphere">
          <div class="loading-spinner-large"></div>
        </div>
        <p>Loading commits from GitHub...</p>
      </div>

      <div v-else-if="error" class="error-liquid">
        <div class="error-sphere">⚠️</div>
        <p>{{ error }}</p>
        <button @click="fetchCommits">Try again</button>
      </div>

      <transition-group v-else name="list" tag="div" class="commits-grid">
        <div v-for="(commit, idx) in filteredCommits" :key="commit.id" 
             class="commit-module">
          
          <div class="glass-card">
            <!-- HEADER -->
            <div class="module-header">
              <div class="header-breadcrumbs">
                <a :href="commit.url" target="_blank" class="breadcrumb-hash">{{ commit.hash.substring(0, 7) }}</a>
                <span class="breadcrumb-date">
                  <span class="breadcrumb-icon">📅</span>
                  {{ formatDate(commit.date) }}
                </span>
                <span class="breadcrumb-branch">
                  <span class="breadcrumb-icon">🌿</span>
                  {{ commit.branch }}
                </span>
              </div>
              <div class="header-metrics">
                <span class="metric-add">+{{ commit.add }}</span>
                <span class="metric-del">-{{ commit.del }}</span>
              </div>
            </div>

            <!-- TITLE -->
            <div class="module-title">
              <span class="title-marker">{{ commit.emoji }}</span>
              <h3>{{ commit.message }}</h3>
            </div>

            <!-- INTERACTION BAR -->
            <div class="interaction-bar">
              <div class="actor">
                <div class="actor-avatar">
                  <img :src="`https://github.com/${commit.author}.png`" :alt="commit.author">
                  <span class="avatar-glow"></span>
                </div>
                <a :href="`https://github.com/${commit.author}`" target="_blank" class="actor-name">{{ commit.author }}</a>
              </div>
               

              <div class="actions">
                <button class="action-liquid" @click="toggle(commit.id)">
                  <span class="action-icon">{{ open[commit.id] ? '−' : '+' }}</span>
                  <span class="action-text">{{ open[commit.id] ? 'Hide' : 'View' }}</span>
                  <span class="action-badge">{{ commit.files.length }}</span>
                  <span class="action-arrow">{{ open[commit.id] ? '▲' : '▼' }}</span>
                </button>
                
                <a :href="commit.url" target="_blank" class="action-liquid github-action">
                  <span class="action-icon">🔗</span>
                  <span class="action-text">GitHub</span>
                  <span class="action-arrow">→</span>
                </a>
              </div>
            </div>

            <!-- EXPAND CONTENT - AICI APAR DETALIILE COMPLETE -->
            <transition name="liquid">
              <div v-if="open[commit.id]" class="liquid-expand">
                <!-- DESCRIEREA DETALIATĂ (în collapse) -->
                <div v-if="commit.description" class="expand-section">
                  <div class="section-label">
                    <span class="label-icon">📋</span>
                    <span class="label-text">Details</span>
                  </div>
                  <div class="description-details">
                    <div class="formatted-description">{{ commit.description }}</div>
                  </div>
                </div>

                <!-- FILES CHANGED -->
                <div class="expand-section">
                  <div class="section-label">
                    <span class="label-icon">📄</span>
                    <span class="label-text">Files changed</span>
                    <span class="label-count">{{ commit.files.length }}</span>
                  </div>
                  <div class="files-pool">
                    <div v-for="file in commit.files" :key="file" class="file-bubble">
                      <span class="bubble-icon">📄</span>
                      <span class="bubble-path">{{ file }}</span>
                    </div>
                  </div>
                </div>

                <!-- STATS -->
                <div class="expand-section">
                  <div class="section-label">
                    <span class="label-icon">📊</span>
                    <span class="label-text">Stats</span>
                  </div>
                  <div class="stats-pool">
                    <div class="stat-item">
                      <span class="stat-label">Additions:</span>
                      <span class="stat-value stat-add">+{{ commit.add }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Deletions:</span>
                      <span class="stat-value stat-del">-{{ commit.del }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Total changes:</span>
                      <span class="stat-value">{{ commit.add + commit.del }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- TAGS -->
            <div class="tags-cloud">
              <PageTagRed v-if="commit.tags.includes('fix')">🔧 fix</PageTagRed>
              <PageTagGreen v-if="commit.tags.includes('feat')">✨ feat</PageTagGreen>
              <PageTagBlue v-if="commit.tags.includes('docs')">📚 docs</PageTagBlue>
              <PageTagPurple v-if="commit.tags.includes('test')">🧪 test</PageTagPurple>
              <PageTagOrange v-if="commit.tags.includes('refactor')">♻️ refactor</PageTagOrange>
              <PageTagPink v-if="commit.tags.includes('style')">🎨 style</PageTagPink>
              <PageTagIndigo v-if="commit.tags.includes('perf')">⚡ perf</PageTagIndigo>
              <PageTagYellow v-if="commit.tags.includes('security')">🔒 security</PageTagYellow>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- EMPTY STATE -->
    <transition name="fade">
      <div v-if="!isLoading && !error && filteredCommits.length === 0" class="empty-liquid">
        <div class="empty-sphere">
          <span>🔍</span>
        </div>
        <p>No commits found</p>
        <button @click="resetFilters">Reset filters</button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Changelogs',
  
  data() {
    return {
      search: '',
      sortOrder: 'desc',
      tagFilter: 'all',
      open: {},
      
      commits: [],
      isLoading: true,
      error: null,
      
      // Cache pentru a nu face prea multe request-uri
      cache: {
        commits: null,
        timestamp: null
      },
      cacheDuration: 5 * 60 * 1000 // 5 minute
    }
  },

  computed: {
    filteredCommits() {
      let filtered = [...this.commits]

      if (this.search) {
        const q = this.search.toLowerCase()
        filtered = filtered.filter(c => 
          c.message.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          c.author.toLowerCase().includes(q) ||
          c.tags.some(t => t.includes(q))
        )
      }

      if (this.tagFilter !== 'all') {
        filtered = filtered.filter(c => c.tags.includes(this.tagFilter))
      }

      filtered.sort((a, b) => {
        return this.sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      })

      return filtered
    },

    githubToken() {
      return this.$githubToken || window.__GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN
    }
  },

  async mounted() {
    await this.fetchCommits()
  },

  methods: {
    async fetchCommits() {
      this.isLoading = true
      this.error = null

      // Verifică cache-ul
      if (this.cache.commits && this.cache.timestamp && 
          (Date.now() - this.cache.timestamp < this.cacheDuration)) {
        this.commits = this.cache.commits
        this.initOpenState()
        this.isLoading = false
        return
      }

      if (!this.githubToken) {
        this.error = 'GitHub token missing. Check your .env file.'
        this.isLoading = false
        return
      }

      try {
        const owner = 'WildFiire'
        const repo = 'docs'
        
        console.log('📡 Fetching commits from GitHub...')
        
        // Fetch commits (ultimele 100)
        const commitsRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
          {
            headers: {
              'Authorization': `token ${this.githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )

        if (!commitsRes.ok) {
          throw new Error(`GitHub API error: ${commitsRes.status}`)
        }

        const commits = await commitsRes.json()
        
        // Procesează fiecare commit pentru a lua mai multe detalii
        const processedCommits = await Promise.all(
          commits.map(async (commit) => {
            // Ia detaliile complete ale commit-ului (inclusiv fișiere)
            const detailRes = await fetch(commit.url, {
              headers: {
                'Authorization': `token ${this.githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            })
            
            let files = []
            let add = 0
            let del = 0
            
            if (detailRes.ok) {
              const detail = await detailRes.json()
              files = detail.files?.map(f => f.filename) || []
              add = detail.stats?.additions || 0
              del = detail.stats?.deletions || 0
            }

            // Extrage tag-urile din mesaj (conventional commits)
            const message = commit.commit.message
            const tags = this.extractTags(message)
            
            // Extrage descrierea (dacă există)
            const description = this.extractDescription(message)
            
            // Emoji pe baza tipului de commit
            const emoji = this.getCommitEmoji(tags[0] || '')

            return {
              id: commit.sha,
              hash: commit.sha,
              message: this.extractTitle(message),
              description: description,
              emoji: emoji,
              author: commit.author?.login || commit.commit.author.name,
              date: commit.commit.author.date,
              branch: 'main',
              files: files,
              tags: tags,
              add: add,
              del: del,
              url: commit.html_url
            }
          })
        )

        this.commits = processedCommits
        
        // Salvează în cache
        this.cache = {
          commits: processedCommits,
          timestamp: Date.now()
        }

        // Inițializează open state pentru collapse
        this.initOpenState()

        console.log(`✅ Loaded ${processedCommits.length} commits`)

      } catch (error) {
        console.error('❌ Error fetching commits:', error)
        this.error = 'Failed to load commits. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    initOpenState() {
      const openState = {}
      this.commits.forEach(c => {
        openState[c.id] = false
      })
      this.open = openState
    },

    extractTags(message) {
      const tags = []
      
      // Conventional commits pattern
      if (message.startsWith('feat')) tags.push('feat')
      if (message.startsWith('fix')) tags.push('fix')
      if (message.startsWith('docs')) tags.push('docs')
      if (message.startsWith('test')) tags.push('test')
      if (message.startsWith('refactor')) tags.push('refactor')
      if (message.startsWith('style')) tags.push('style')
      if (message.startsWith('perf')) tags.push('perf')
      if (message.startsWith('security')) tags.push('security')
      
      // Fallback pe cuvinte cheie
      if (tags.length === 0) {
        const lower = message.toLowerCase()
        if (lower.includes('fix') || lower.includes('bug')) tags.push('fix')
        if (lower.includes('feat') || lower.includes('add')) tags.push('feat')
        if (lower.includes('doc') || lower.includes('readme')) tags.push('docs')
        if (lower.includes('test')) tags.push('test')
        if (lower.includes('refactor')) tags.push('refactor')
        if (lower.includes('style')) tags.push('style')
        if (lower.includes('perf') || lower.includes('performance')) tags.push('perf')
        if (lower.includes('security')) tags.push('security')
      }
      
      // Default
      if (tags.length === 0) tags.push('update')
      
      return tags
    },

    extractTitle(message) {
      // Ia prima linie
      return message.split('\n')[0]
    },

    extractDescription(message) {
      const lines = message.split('\n')
      if (lines.length > 1) {
        // Ignoră prima linie (titlul) și liniile goale
        return lines.slice(1).filter(l => l.trim() !== '').join('\n').trim()
      }
      return null
    },

    getCommitEmoji(tag) {
      const emojiMap = {
        'feat': '✨',
        'fix': '🐛',
        'docs': '📝',
        'test': '🧪',
        'refactor': '♻️',
        'style': '🎨',
        'perf': '⚡',
        'security': '🔒',
        'update': '🔄'
      }
      return emojiMap[tag] || '🔨'
    },

    formatDate(date) {
      const d = new Date(date)
      const now = new Date()
      const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
      
      if (diff === 0) return 'today'
      if (diff === 1) return 'yesterday'
      if (diff < 7) return `${diff} days ago`
      return d.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      })
    },

    toggle(id) {
      this.open[id] = !this.open[id]
      this.open = {...this.open}
    },

    resetFilters() {
      this.search = ''
      this.sortOrder = 'desc'
      this.tagFilter = 'all'
    }
  }
}
</script>

<style scoped>
/* ===== CSS VARIABLES - DARK MODE DEFAULT ===== */
.changelogs {
  --primary: #ff8c00;
  --primary-dark: #ff4500;
  --primary-glow: rgba(255, 140, 0, 0.25);
  --primary-soft: rgba(255, 140, 0, 0.15);
  
  --bg-base: #050505;
  --bg-surface: rgba(10, 10, 10, 0.85);
  --bg-surface-raised: rgba(18, 18, 18, 0.9);
  --bg-elevated: rgba(25, 25, 25, 0.95);
  
  --text-primary: #ffffff;
  --text-secondary: #f0f0f0;
  --text-tertiary: #a0a0a0;
  
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 140, 0, 0.3);
  
  --blur-amount: 20px;
  --blur-amount-strong: 30px;
  
  --green: #34c759;
  --green-soft: rgba(52, 199, 89, 0.15);
  --red: #ff3b30;
  --red-soft: rgba(255, 59, 48, 0.15);
  
  max-width: 750px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.2s ease;
}

/* ===== LIGHT THEME OVERRIDES ===== */
html:not(.dark) .changelogs {
  --bg-base: #f5f5f7;
  --bg-surface: rgba(255, 255, 255, 0.8);
  --bg-surface-raised: rgba(255, 255, 255, 0.9);
  --bg-elevated: rgba(255, 255, 255, 0.95);
  
  --text-primary: #1d1d1f;
  --text-secondary: #333336;
  --text-tertiary: #6e6e73;
  
  --border-subtle: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(255, 140, 0, 0.3);
  
  --primary-soft: rgba(255, 140, 0, 0.08);
}

/* ===== FILTERS PANEL ===== */
.filters-panel {
  background: var(--bg-surface);
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 28px;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1);
}

html:not(.dark) .filters-panel {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* SEARCH */
.search-container {
  margin-bottom: 16px;
}

.search-field {
  position: relative;
  margin-bottom: 10px;
}

.search-glass {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: 16px;
  opacity: 0.8;
  pointer-events: none;
  transition: color 0.2s;
}

.search-field input {
  width: 100%;
  padding: 14px 40px 14px 44px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 40px;
  color: var(--text-primary);
  font-size: 16px;
  transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1);
}

.search-field input:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--bg-elevated);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.search-field input::placeholder {
  color: var(--text-tertiary);
  opacity: 0.6;
}

.search-clear {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-subtle);
  border-radius: 50%;
  color: var(--text-tertiary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-clear:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.search-hints {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.hint-chip {
  padding: 6px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 30px;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(5px);
}

.hint-chip:hover {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
}

/* FILTERS ROW */
.filters-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sort-group {
  display: flex;
  gap: 4px;
  background: var(--bg-elevated);
  padding: 4px;
  border-radius: 40px;
  border: 1px solid var(--border-subtle);
}

.sort-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: transparent;
  border: none;
  border-radius: 40px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.sort-pill.active {
  background: var(--primary-soft);
  color: var(--primary);
}

.pill-icon {
  font-size: 14px;
}

.tags-group {
  display: flex;
  gap: 4px;
  background: var(--bg-elevated);
  padding: 4px;
  border-radius: 40px;
  border: 1px solid var(--border-subtle);
}

.tags-group :deep(.page-tag) {
  padding: 6px 12px;
  font-size: 12px;
  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s;
}

.tags-group :deep(.page-tag.tag-active) {
  opacity: 1;
  background: var(--primary-soft);
  transform: scale(1.02);
  border-color: var(--primary);
}

.reset-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 40px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.reset-pill:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: rotate(180deg);
}

.count-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  background: var(--primary-soft);
  border-radius: 40px;
  border: 1px solid var(--border-strong);
}

.count-number {
  color: var(--primary);
  font-size: 16px;
  font-weight: 600;
}

.count-label {
  color: var(--text-tertiary);
  font-size: 12px;
}

.loading-badge {
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
}

.loading-spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ACTIVE FILTERS */
.active-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--primary-soft);
  border: 1px solid var(--border-strong);
  border-radius: 40px;
  color: var(--primary);
  font-size: 12px;
  backdrop-filter: blur(5px);
}

.filter-tag button {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-subtle);
  border: none;
  border-radius: 50%;
  color: var(--text-tertiary);
  font-size: 9px;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.filter-tag button:hover {
  background: var(--primary);
  color: white;
  transform: scale(1.1);
}

/* ===== COMMITS FLOW ===== */
.commits-flow {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.commits-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.commit-module {
  animation: floatIn 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes floatIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* GLASS CARD */
.glass-card {
  background: var(--bg-surface);
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
  border-radius: 28px;
  padding: 24px;
  border: 1px solid var(--border-subtle);
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1);
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  right: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--primary), 
    var(--primary-dark), 
    transparent
  );
  transition: left 0.6s cubic-bezier(0.2, 0.9, 0.4, 1);
}

.glass-card:hover {
  transform: translateY(-3px) scale(1.01);
  border-color: var(--border-strong);
  background: var(--bg-surface-raised);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.glass-card:hover::before {
  left: -30%;
  right: -30%;
}

html:not(.dark) .glass-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* MODULE HEADER */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.breadcrumb-hash {
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 4px 12px;
  border-radius: 30px;
  letter-spacing: 0.3px;
  border: 1px solid var(--border-strong);
  transition: all 0.2s;
  text-decoration: none;
}

.breadcrumb-hash:hover {
  transform: scale(1.02);
  background: var(--primary);
  color: white;
}

.breadcrumb-date, .breadcrumb-branch {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-tertiary);
  font-size: 12px;
  transition: color 0.2s;
}

.breadcrumb-icon {
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.breadcrumb-date:hover, .breadcrumb-branch:hover {
  color: var(--primary);
}

.breadcrumb-date:hover .breadcrumb-icon,
.breadcrumb-branch:hover .breadcrumb-icon {
  opacity: 1;
}

.header-metrics {
  display: flex;
  gap: 6px;
}

.metric-add, .metric-del {
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s;
}

.metric-add {
  background: var(--green-soft);
  color: var(--green);
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.metric-del {
  background: var(--red-soft);
  color: var(--red);
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.metric-add:hover, .metric-del:hover {
  transform: scale(1.05);
}

/* MODULE TITLE */
.module-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.title-marker {
  font-size: 28px;
  min-width: 40px;
  text-align: center;
  filter: drop-shadow(0 4px 8px var(--primary-glow));
  transition: transform 0.3s;
}

.glass-card:hover .title-marker {
  transform: scale(1.05) rotate(5deg);
}

.module-title h3 {
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.2px;
  transition: color 0.2s;
}

/* INTERACTION BAR */
.interaction-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle);
  transition: border-color 0.3s;
}

.glass-card:hover .interaction-bar {
  border-bottom-color: var(--border-strong);
}

.actor {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actor-avatar {
  position: relative;
  width: 36px;
  height: 36px;
}

.actor-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--primary);
  position: relative;
  z-index: 2;
  transition: border-color 0.3s;
}

.avatar-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.3;
  filter: blur(4px);
  z-index: 1;
  transition: opacity 0.3s, transform 0.3s;
}

.actor:hover .avatar-glow {
  opacity: 0.6;
  transform: scale(1.1);
}

.actor-name {
  color: var(--primary);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  text-decoration: none;
}

.actor-name:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-liquid {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 40px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1);
  font-size: 13px;
  backdrop-filter: blur(5px);
  text-decoration: none;
}

.action-liquid:hover {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
  transform: scale(1.02) translateY(-1px);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.github-action:hover {
  background: var(--bg-elevated);
  border-color: var(--text-tertiary);
  color: var(--text-primary);
  transform: scale(1.02) translateY(-1px);
}

.action-icon {
  font-size: 14px;
  transition: transform 0.3s;
}

.action-liquid:hover .action-icon {
  transform: scale(1.1);
}

.action-badge {
  background: var(--primary-soft);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 600;
  margin-left: 2px;
  transition: all 0.3s;
}

.action-liquid:hover .action-badge {
  background: var(--primary);
  color: white;
}

.action-arrow {
  font-size: 10px;
  transition: transform 0.3s;
}

.action-liquid:hover .action-arrow {
  transform: translateX(4px);
}

/* LIQUID EXPAND */
.liquid-expand {
  margin-bottom: 20px;
  animation: liquidAppear 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
  transform-origin: top;
}

@keyframes liquidAppear {
  0% {
    opacity: 0;
    transform: scaleY(0.7) translateY(-20px);
  }
  50% {
    opacity: 0.8;
    transform: scaleY(1.02) translateY(2px);
  }
  100% {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
}

.expand-section {
  margin-bottom: 20px;
}

.expand-section:last-child {
  margin-bottom: 0;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-subtle);
  transition: border-color 0.3s;
}

.glass-card:hover .section-label {
  border-bottom-color: var(--border-strong);
}

.label-icon {
  color: var(--primary);
  font-size: 14px;
  transition: transform 0.3s;
}

.label-icon:hover {
  transform: rotate(10deg);
}

.label-text {
  color: var(--primary);
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-count {
  margin-left: auto;
  background: var(--primary-soft);
  color: var(--primary);
  padding: 2px 10px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.3s;
}

.label-count:hover {
  background: var(--primary);
  color: white;
  transform: scale(1.05);
}

/* DESCRIPTION DETAILS - VERSIUNE FINALĂ CU SPAȚII */
.description-details {
  background: var(--bg-elevated);
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid var(--border-subtle);
  max-height: 500px;
  overflow-y: auto;
}

.formatted-description {
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

/* Spații între paragrafe */
.formatted-description p {
  margin: 12px 0;
}

.formatted-description p:first-child {
  margin-top: 0;
}

.formatted-description p:last-child {
  margin-bottom: 0;
}

/* Liste */
.formatted-description ul, 
.formatted-description ol {
  margin: 8px 0 16px 0;
  padding-left: 25px;
}

.formatted-description li {
  margin-bottom: 6px;
  line-height: 1.7;
}

/* Bullet points colorate */
.formatted-description ul li {
  list-style-type: disc;
  color: var(--primary);
}

.formatted-description ul li span {
  color: var(--text-secondary);
}

/* Indentări pentru subpuncte */
.formatted-description ul ul {
  margin-top: 4px;
  margin-bottom: 4px;
  padding-left: 20px;
}

.formatted-description ul ul li {
  list-style-type: circle;
  color: var(--primary-soft);
}

/* Spații între secțiuni */
.formatted-description br {
  display: block;
  content: "";
  margin-top: 8px;
}

/* Text îngroșat */
.formatted-description strong {
  color: var(--primary);
  font-weight: 600;
}

/* Scrollbar */
.description-details::-webkit-scrollbar {
  width: 6px;
}

.description-details::-webkit-scrollbar-track {
  background: var(--bg-surface);
  border-radius: 10px;
}

.description-details::-webkit-scrollbar-thumb {
  background: var(--primary-soft);
  border-radius: 10px;
  border: 1px solid var(--border-strong);
}

.description-details::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}

/* FILES POOL */
.files-pool {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-bubble {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-elevated);
  border-radius: 14px;
  border: 1px solid var(--border-subtle);
  transition: all 0.3s;
  backdrop-filter: blur(5px);
  animation: fileSlide 0.3s ease forwards;
  opacity: 0;
  transform: translateX(-10px);
}

@keyframes fileSlide {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.file-bubble:hover {
  background: var(--primary-soft);
  transform: translateX(8px);
  border-color: var(--primary);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.bubble-icon {
  color: var(--primary);
  font-size: 12px;
  opacity: 0.8;
  transition: transform 0.3s;
}

.file-bubble:hover .bubble-icon {
  transform: scale(1.2);
}

.bubble-path {
  color: #88c0d0;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  font-size: 12px;
  word-break: break-all;
  transition: color 0.3s;
}

.file-bubble:hover .bubble-path {
  color: var(--primary);
}

/* STATS POOL */
.stats-pool {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--bg-elevated);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  transition: all 0.2s;
}

.stat-item:hover {
  background: var(--primary-soft);
  transform: translateX(4px);
}

.stat-label {
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 500;
}

.stat-value {
  margin-left: auto;
  font-size: 13px;
  font-weight: 600;
}

.stat-add {
  color: var(--green);
}

.stat-del {
  color: var(--red);
}

/* TAGS CLOUD */
.tags-cloud {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.tags-cloud :deep(.page-tag) {
  padding: 6px 14px;
  font-size: 11px;
  backdrop-filter: blur(5px);
  transition: all 0.3s;
  opacity: 0.9;
}

.tags-cloud :deep(.page-tag:hover) {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.2);
  box-shadow: 0 4px 12px var(--primary-glow);
  opacity: 1;
}

/* ===== LOADING STATES ===== */
.loading-liquid {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-surface);
  backdrop-filter: blur(var(--blur-amount));
  border-radius: 40px;
  border: 1px solid var(--border-subtle);
}

.loading-sphere {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-subtle);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-liquid p {
  color: var(--text-tertiary);
  margin: 0;
}

.error-liquid {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-surface);
  backdrop-filter: blur(var(--blur-amount));
  border-radius: 40px;
  border: 1px solid var(--red-soft);
}

.error-sphere {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: var(--red-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border: 1px solid var(--red);
}

.error-liquid p {
  color: var(--red);
  margin: 0 0 20px;
}

.error-liquid button {
  padding: 10px 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 40px;
  color: var(--primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.error-liquid button:hover {
  border-color: var(--primary);
  background: var(--primary-soft);
  transform: translateY(-2px);
}

/* ===== EMPTY STATE ===== */
.empty-liquid {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-surface);
  backdrop-filter: blur(var(--blur-amount));
  border-radius: 40px;
  border: 1px solid var(--border-subtle);
  transition: all 0.3s;
}

.empty-sphere {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: var(--primary-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 1px solid var(--border-strong);
  animation: floatPulse 3s infinite ease-in-out;
}

@keyframes floatPulse {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 0 0 0 var(--primary-glow);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 0 30px 10px var(--primary-glow);
  }
}

.empty-liquid p {
  color: var(--text-tertiary);
  font-size: 15px;
  margin: 0 0 20px;
  transition: color 0.2s;
}

.empty-liquid button {
  padding: 10px 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 40px;
  color: var(--primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.empty-liquid button:hover {
  border-color: var(--primary);
  background: var(--primary-soft);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px var(--primary-glow);
}

/* ===== TRANSITIONS ===== */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.liquid-enter-active,
.liquid-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.liquid-enter-from {
  opacity: 0;
  transform: scaleY(0.8) translateY(-15px);
}

.liquid-leave-to {
  opacity: 0;
  transform: scaleY(0.8) translateY(-15px);
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-group, .tags-group, .reset-pill, .count-badge {
    width: 100%;
    justify-content: center;
  }
  
  .count-badge {
    margin-left: 0;
  }
  
  .module-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-metrics {
    width: 100%;
    justify-content: flex-end;
  }
  
  .interaction-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .actions {
    width: 100%;
  }
  
  .action-liquid {
    flex: 1;
    justify-content: center;
  }
  
  .search-hints {
    justify-content: center;
  }
}
</style>