<template>
  <div class="cl-root">
    <!-- FILTERS -->
    <div class="cl-filters cl-glass-panel">
      <div class="cl-search-box">
        <svg class="cl-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" v-model="search" placeholder="Search commits (feat, update, author)..." />
        <button v-if="search" class="cl-clear-btn" @click="search = ''">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="cl-filter-row">
        <div class="cl-tags">
          <button class="cl-tag-btn" :class="{ active: tagFilter === 'all' }" @click="tagFilter = 'all'">All</button>
          <button class="cl-tag-btn" :class="{ active: tagFilter === 'feat' }" @click="tagFilter = tagFilter === 'feat' ? 'all' : 'feat'">
            <span class="cl-dot cl-dot-feat"></span> Feat
          </button>
          <button class="cl-tag-btn" :class="{ active: tagFilter === 'fix' }" @click="tagFilter = tagFilter === 'fix' ? 'all' : 'fix'">
            <span class="cl-dot cl-dot-fix"></span> Fix
          </button>
          <button class="cl-tag-btn" :class="{ active: tagFilter === 'docs' }" @click="tagFilter = tagFilter === 'docs' ? 'all' : 'docs'">
            <span class="cl-dot cl-dot-docs"></span> Docs
          </button>
          <button class="cl-tag-btn" :class="{ active: tagFilter === 'refactor' }" @click="tagFilter = tagFilter === 'refactor' ? 'all' : 'refactor'">
            <span class="cl-dot cl-dot-refactor"></span> Refactor
          </button>
        </div>

        <div class="cl-sort-wrap">
          <button class="cl-sort-btn" @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'" title="Sort Order">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
              <path v-if="sortOrder === 'desc'" d="M12 5v14M8 9l4-4 4 4M8 15l4 4 4-4"/>
              <path v-else d="M12 19V5M8 15l4 4 4-4M8 9l4-4 4 4"/>
            </svg>
            {{ sortOrder === 'desc' ? 'Newest' : 'Oldest' }}
          </button>
          <div class="cl-count" v-if="!isLoading">
            <strong class="orbitron-font">{{ filteredCommits.length }}</strong> commits
          </div>
        </div>
      </div>
    </div>

    <!-- COMMITS TIMELINE -->
    <div class="cl-timeline-wrap">
      <div v-if="isLoading" class="cl-loading cl-glass-panel">
        <div class="cl-pulse-loader"></div>
        <p class="orbitron-font" style="letter-spacing:1px; color:var(--T1);">SYNCING GITHUB FEED...</p>
      </div>

      <div v-else-if="error" class="cl-error cl-glass-panel">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" style="color: #ff3b30; margin-bottom:12px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1"/></svg>
        <p>{{ error }}</p>
        <button class="cl-btn" @click="fetchCommits">Try Again</button>
      </div>

      <div v-else-if="filteredCommits.length === 0" class="cl-empty cl-glass-panel">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" style="color:var(--T3); margin-bottom:12px;"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <p>No commits match your filters.</p>
        <button class="cl-btn" @click="resetFilters">Reset Filters</button>
      </div>

      <div v-else class="cl-git-timeline">
        <div class="cl-git-stem"></div>
        <transition-group name="cl-list">
          <div v-for="(commit, idx) in filteredCommits" :key="commit.id" class="cl-git-item">
            
            <div class="cl-git-node" v-html="commit.emoji"></div>
            
            <!-- Card -->
            <div class="cl-card cl-glass-card" :class="{ 'cl-card-open': open[commit.id] }">
              <div class="cl-card-header" @click="toggle(commit.id)">
                <div class="cl-card-meta">
                  <div class="cl-author">
                    <img :src="`https://github.com/${commit.author}.png?size=32`" :alt="commit.author" loading="lazy" />
                    <a :href="`https://github.com/${commit.author}`" target="_blank" @click.stop class="orbitron-font">{{ commit.author }}</a>
                  </div>
                  <span class="cl-meta-dot">·</span>
                  <span class="cl-date" style="font-family: var(--vp-font-family-base);">{{ formatDate(commit.date) }}</span>
                  <span class="cl-meta-dot">·</span>
                  <a :href="commit.url" target="_blank" class="cl-hash orbitron-font" @click.stop>
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    {{ commit.hash.substring(0, 7) }}
                  </a>
                </div>
                
                <h3 class="cl-title" style="font-family: var(--vp-font-family-base);">{{ commit.message }}</h3>
                
                <div class="cl-card-footer">
                  <div class="cl-card-tags">
                    <span v-for="t in commit.tags" :key="t" class="cl-chip" :class="'cl-chip-' + t">{{ t }}</span>
                  </div>
                  <div class="cl-card-stats" v-if="commit.add || commit.del || commit.files.length">
                    <span class="cl-stat-add" v-if="commit.add">+{{ commit.add }}</span>
                    <span class="cl-stat-del" v-if="commit.del">-{{ commit.del }}</span>
                    <span class="cl-stat-files" v-if="commit.files.length">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                      {{ commit.files.length }} files
                    </span>
                  </div>
                  <button class="cl-expand-btn" :class="{ active: open[commit.id] }">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                </div>
              </div>

              <!-- Expanded Details -->
              <transition name="cl-slide">
                <div v-if="open[commit.id]" class="cl-card-body">
                  <div v-if="commit.description" class="cl-desc">
                    <p>{{ commit.description }}</p>
                  </div>
                  <div v-if="commit.files.length" class="cl-files">
                    <div class="cl-files-title orbitron-font">Files Changed</div>
                    <ul>
                      <li v-for="f in commit.files" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                  <div v-if="!commit.description && !commit.files.length" class="cl-empty-details">
                    No further details.
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
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

      // Verifica cache-ul
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
        
        // Proceseaza fiecare commit pentru a lua mai multe detalii
        const processedCommits = await Promise.all(
          commits.map(async (commit) => {
            // Ia detaliile complete ale commit-ului (inclusiv fisiere)
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
            
            // Extrage descrierea (daca exista)
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
        
        // Salveaza in cache
        this.cache = {
          commits: processedCommits,
          timestamp: Date.now()
        }

        // Initializeaza open state pentru collapse
        this.initOpenState()


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
        // Ignora prima linie (titlul) si liniile goale
        return lines.slice(1).filter(l => l.trim() !== '').join('\n').trim()
      }
      return null
    },

    getCommitEmoji(tag) {
      const emojiMap = {
        'feat': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
        'fix': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        'docs': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        'test': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M12 18v-4M8 18v-4M16 18v-4"/></svg>',
        'refactor': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>',
        'style': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/></svg>',
        'perf': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/></svg>',
        'security': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'update': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
      }
      return emojiMap[tag] || '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
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
      this.tagFilter = 'all'
    }
  }
}
</script>

<style scoped>
.cl-root {
  display: flex; flex-direction: column; gap: 32px; padding-top: 10px;
}

/* Glass Panels */
.cl-glass-panel {
  background: rgba(0,0,0,0.1); border: 1px solid var(--BD);
  padding: 24px; border-radius: 20px;
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.cl-filters {
  display: flex; flex-direction: column; gap: 20px;
}

/* Search Box Premium */
.cl-search-box { position: relative; display: flex; align-items: center; }
.cl-search-icon { position: absolute; left: 20px; color: var(--T3); pointer-events: none; }
.cl-search-box input {
  width: 100%; background: var(--SURF); border: 1px solid var(--BD);
  border-radius: 16px; padding: 16px 50px; font-size: 15px; color: var(--T1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.cl-search-box input:focus {
  outline: none; border-color: rgba(255,140,0,0.6);
  background: var(--CARD);
  box-shadow: 0 0 0 4px rgba(255,140,0,0.1), 0 10px 24px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
.cl-clear-btn {
  position: absolute; right: 20px; background: var(--CARD); border: 1px solid var(--BD); color: var(--T3);
  cursor: pointer; padding: 6px; border-radius: 50%; transition: all 0.3s;
}
.cl-clear-btn:hover { color: #ff3b30; border-color: #ff3b30; transform: scale(1.1); }

/* Filter Tags */
.cl-filter-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.cl-tags { display: flex; gap: 10px; flex-wrap: wrap; }
.cl-tag-btn {
  background: rgba(0,0,0,0.15); border: 1px solid var(--BD); color: var(--T2);
  padding: 8px 16px; border-radius: 24px; font-size: 13px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 8px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.cl-tag-btn:hover { background: rgba(0,0,0,0.25); color: var(--T1); transform: translateY(-2px); }
.cl-tag-btn.active { background: var(--Ps); border-color: var(--P); color: var(--P); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,140,0,0.2); }

.cl-dot { width: 8px; height: 8px; border-radius: 50%; }
.cl-dot-feat { background: #34c759; box-shadow: 0 0 8px #34c759; }
.cl-dot-fix { background: #ff3b30; box-shadow: 0 0 8px #ff3b30; }
.cl-dot-docs { background: #007aff; box-shadow: 0 0 8px #007aff; }
.cl-dot-refactor { background: #af52de; box-shadow: 0 0 8px #af52de; }

.cl-sort-wrap { display: flex; align-items: center; gap: 20px; }
.cl-sort-btn {
  background: none; border: none; color: var(--T2); display: flex; align-items: center; gap: 8px;
  cursor: pointer; font-size: 14px; font-weight: 700; transition: color 0.2s;
}
.cl-sort-btn:hover { color: var(--T1); }
.cl-count { font-size: 14px; color: var(--T3); }
.cl-count strong { color: var(--T1); font-size: 16px; }

/* GIT TIMELINE LAYOUT */
.cl-git-timeline { position: relative; margin-top: 16px; padding-left: 40px; }
.cl-git-stem {
  position: absolute; top: 0; bottom: 0; left: 15px; width: 2px;
  background: linear-gradient(to bottom, var(--P), transparent);
  box-shadow: 0 0 8px var(--P); border-radius: 2px;
}

.cl-git-item { position: relative; margin-bottom: 24px; z-index: 1; }

.cl-git-node {
  position: absolute; left: -40px; top: 20px; width: 32px; height: 32px;
  background: var(--CARD); border: 2px solid var(--P); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 12px rgba(255,140,0,0.4); z-index: 2; color: var(--P);
}
.cl-git-node svg { width: 16px; height: 16px; }

/* Premium Glass Card */
.cl-glass-card {
  background: rgba(0,0,0,0.15); border: 1px solid var(--BD); border-radius: 20px;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow: hidden;
}
.cl-glass-card:hover {
  border-color: rgba(255,140,0,0.4); transform: translateX(8px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.05);
}
.cl-card-open { border-color: rgba(255,140,0,0.6); box-shadow: 0 12px 32px rgba(255,140,0,0.1); }

.cl-card-header { padding: 20px 24px; cursor: pointer; }
.cl-card-meta { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--T3); margin-bottom: 12px; }
.cl-author { display: flex; align-items: center; gap: 8px; }
.cl-author img { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--BD); }
.cl-author a { color: var(--T1); text-decoration: none; font-size:14px; }
.cl-author a:hover { color: var(--P); }
.cl-hash { color: var(--P); text-decoration: none; display: flex; align-items: center; gap: 6px; font-size:13px; background:var(--Ps); padding:4px 8px; border-radius:8px;}
.cl-hash:hover { background: rgba(255,140,0,0.2); }

.cl-title { font-size: 18px; font-weight: 700; color: var(--T1); margin: 0 0 16px 0; line-height: 1.4; }

.cl-card-footer { display: flex; align-items: center; justify-content: space-between; }
.cl-card-tags { display: flex; gap: 8px; }
.cl-chip { padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing:0.5px; }
.cl-chip-feat { background: rgba(52,199,89,0.15); color: #34c759; border: 1px solid rgba(52,199,89,0.3); }
.cl-chip-fix { background: rgba(255,59,48,0.15); color: #ff3b30; border: 1px solid rgba(255,59,48,0.3); }
.cl-chip-docs { background: rgba(0,122,255,0.15); color: #007aff; border: 1px solid rgba(0,122,255,0.3); }
.cl-chip-refactor { background: rgba(175,82,222,0.15); color: #af52de; border: 1px solid rgba(175,82,222,0.3); }
.cl-chip-update { background: rgba(136,136,152,0.15); color: var(--T2); border: 1px solid var(--BD); }

.cl-card-stats { display: flex; align-items: center; gap: 14px; font-size: 14px; font-weight: 700; }
.cl-stat-add { color: #34c759; }
.cl-stat-del { color: #ff3b30; }
.cl-stat-files { color: var(--T3); display: flex; align-items: center; gap: 6px; }

.cl-expand-btn {
  background: var(--CARD); border: 1px solid var(--BD); border-radius: 50%; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center; color: var(--T2); cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.cl-glass-card:hover .cl-expand-btn { background: var(--Ps); color: var(--P); border-color: var(--P); }
.cl-expand-btn.active { transform: rotate(180deg); background: var(--P); color: #fff; box-shadow: 0 4px 12px rgba(255,140,0,0.3); }

.cl-card-body { padding: 0 24px 24px 24px; border-top: 1px solid var(--BD); background: rgba(0,0,0,0.2); }
.cl-desc { font-size: 15px; color: var(--T2); line-height: 1.6; white-space: pre-wrap; margin-top:20px; }
.cl-files { margin-top: 24px; }
.cl-files-title { font-size: 12px; font-weight: 800; color: var(--T3); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px; }
.cl-files ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.cl-files li { font-size: 13px; color: var(--T2); font-family: monospace; background: var(--CARD); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--BD); }

.cl-empty-details { font-size: 14px; color: var(--T3); font-style: italic; margin-top: 20px; }

/* Loading State */
.cl-loading, .cl-error, .cl-empty { text-align: center; padding: 60px 20px; color: var(--T2); display:flex; flex-direction:column; align-items:center; justify-content:center; }
.cl-pulse-loader { width: 48px; height: 48px; background: var(--P); border-radius: 50%; margin-bottom: 24px; animation: cl-pulse 1.5s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes cl-pulse { 0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255,140,0,0.5); } 70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(255,140,0,0); } 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255,140,0,0); } }
.cl-btn { background: var(--CARD); border: 1px solid var(--BD); color: var(--T1); padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-top: 20px; }
.cl-btn:hover { background: var(--Ps); border-color: var(--P); color: var(--P); box-shadow: 0 4px 12px rgba(255,140,0,0.2); }

.cl-list-enter-active, .cl-list-leave-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.cl-list-enter-from { opacity: 0; transform: translateY(30px) scale(0.98); }
.cl-list-leave-to { opacity: 0; transform: translateY(-30px) scale(0.98); }
.cl-slide-enter-active, .cl-slide-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-height: 1500px; overflow: hidden; }
.cl-slide-enter-from, .cl-slide-leave-to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; margin-top: 0; }

@media (max-width: 768px) {
  .cl-git-timeline { padding-left: 20px; }
  .cl-git-stem { left: 5px; }
  .cl-git-node { left: -25px; width: 20px; height: 20px; }
  .cl-git-node svg { display: none; }
  .cl-card-footer { flex-direction: column; align-items: flex-start; gap: 16px; }
  .cl-expand-btn { align-self: flex-end; margin-top: -30px; }
}
</style>
