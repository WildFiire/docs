<!-- docs\.vitepress\theme\components\Panel\PanelFiles.vue -->
<template>
  <div class="panel-files" :class="{ 'light-theme': isLightTheme }">

    <!-- ── Top Bar ── -->
    <div class="fe-topbar">
      <div class="fe-title">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M3 3h6l2 3h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/></svg>
        <span>FILE EXPLORER</span>
        <span class="fe-badge">{{ totalFiles }} files</span>
      </div>
      <div class="fe-search" :class="{ focused: searchFocused }">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4-4"/></svg>
        <input v-model="searchQuery" @input="filterFiles" @focus="searchFocused=true" @blur="searchFocused=false" placeholder="Search files…" />
        <button v-if="searchQuery" class="fe-clear" @click="searchQuery='';filterFiles()">✕</button>
      </div>
      <div class="fe-view-toggle">
        <button :class="{ active: viewMode==='tree' }" @click="viewMode='tree'" title="Tree view">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <button :class="{ active: viewMode==='flat' }" @click="viewMode='flat'" title="Flat list">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
        <div class="fe-sort-wrap">
          <button class="fe-sort-btn" @click="showSortMenu=!showSortMenu">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="9" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            {{ sortLabels[sortBy] }}
          </button>
          <div class="fe-sort-menu" v-if="showSortMenu" @mouseleave="showSortMenu=false">
            <button v-for="(lbl,key) in sortLabels" :key="key" :class="{ active: sortBy===key }" @click="sortBy=key;showSortMenu=false">{{ lbl }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Type Filter Chips ── -->
    <div class="fe-chips">
      <button class="fe-chip" :class="{ active: typeFilter==='' }" @click="typeFilter=''">
        ALL <span class="fe-chip-ct">{{ totalFiles }}</span>
      </button>
      <button v-for="t in typeFilters" :key="t.ext" class="fe-chip" :class="{ active: typeFilter===t.ext }" @click="typeFilter=t.ext" :style="typeFilter===t.ext ? { borderColor: t.color, color: t.color } : {}">
        <span class="fe-chip-dot" :style="{ background: t.color }"></span>
        {{ t.ext || 'other' }} <span class="fe-chip-ct">{{ t.count }}</span>
      </button>
    </div>

    <!-- ── Stats Strip ── -->
    <div class="fe-stats-strip" v-if="!isLoadingFiles && fileTree.length">
      <div class="fss-bar-track">
        <div v-for="t in typeFilters.slice(0,6)" :key="t.ext" class="fss-seg" :style="{ width: (t.count/totalFiles*100)+'%', background: t.color }" :title="t.ext+': '+t.count"></div>
      </div>
      <div class="fss-legend">
        <span v-for="t in typeFilters.slice(0,5)" :key="t.ext" class="fss-lbl"><span class="fss-dot" :style="{ background: t.color }"></span>{{ t.ext }}</span>
      </div>
    </div>

    <!-- ── Main Layout ── -->
    <div class="fe-layout">

      <!-- Left: Tree / Flat -->
      <div class="fe-tree-panel">
        <div class="fe-panel-head">
          <span class="fe-panel-title">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M3 3h6l2 3h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/></svg>
            {{ viewMode==='tree' ? 'TREE' : 'FILES' }}
          </span>
          <div class="fe-panel-actions">
            <button class="fpa-btn" @click="expandAll" title="Expand all">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </button>
            <button class="fpa-btn" @click="collapseAll" title="Collapse all">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></svg>
            </button>
          </div>
        </div>

        <div class="fe-tree-body">
          <div v-if="isLoadingFiles" class="fe-loading">
            <div class="fe-spinner"></div><span>Fetching repository…</span>
          </div>
          <div v-else-if="viewMode==='tree'">
            <div v-if="!filteredTree.length" class="fe-empty">No files match</div>
            <FileTreeNode v-for="item in filteredTree" :key="item.path" :node="item" :level="0" :search-query="searchQuery" :selected-path="selectedFile ? selectedFile.path : ''" @select="selectFile"/>
          </div>
          <div v-else class="fe-flat-list">
            <div v-if="!filteredFlat.length" class="fe-empty">No files match</div>
            <div v-for="f in filteredFlat" :key="f.path" class="fe-flat-row" :class="{ selected: selectedFile && selectedFile.path===f.path }" @click="selectFile(f)">
              <span class="fe-flat-icon" :style="{ color: getFileColor(f.name) }">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
              </span>
              <span class="fe-flat-name">{{ f.name }}</span>
              <span class="fe-flat-dir">{{ f.path.split('/').slice(0,-1).join('/') || '/' }}</span>
              <span class="fe-flat-size">{{ formatFileSize(f.size) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Preview -->
      <div class="fe-preview" v-if="selectedFile">
        <div class="fe-preview-head" :style="{ borderTopColor: getFileColor(selectedFile.name) }">
          <div class="feph-left">
            <span class="feph-icon" :style="{ background: getFileColor(selectedFile.name)+'22', color: getFileColor(selectedFile.name) }">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            </span>
            <div>
              <div class="feph-name">{{ selectedFile.name }}</div>
              <div class="feph-path">{{ selectedFile.path }}</div>
            </div>
          </div>
          <div class="feph-actions">
            <button class="fpa-btn" @click="copyFilePath" :title="copied ? 'Copied!' : 'Copy path'">
              <svg v-if="!copied" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <svg v-else viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button class="fpa-btn" @click="downloadFile" title="Download">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <a :href="`https://github.com/${repoOwner}/${repoName}/blob/${repoBranch}/${selectedFile.path}`" target="_blank" class="fpa-btn" title="View on GitHub">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a :href="`https://github.com/${repoOwner}/${repoName}/edit/${repoBranch}/${selectedFile.path}`" target="_blank" class="fpa-btn accent" title="Edit on GitHub">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3L21 7L7 21H3V17L17 3Z"/></svg>
              EDIT
            </a>
          </div>
        </div>

        <div class="fe-meta-strip">
          <span class="fems-item"><span class="fems-lbl">TYPE</span><span class="fems-val" :style="{ color: getFileColor(selectedFile.name) }">{{ getFileType(selectedFile.name) }}</span></span>
          <span class="fems-sep"></span>
          <span class="fems-item"><span class="fems-lbl">SIZE</span><span class="fems-val">{{ formatFileSize(selectedFile.size) }}</span></span>
          <span class="fems-sep"></span>
          <span class="fems-item" v-if="selectedFile.sha"><span class="fems-lbl">SHA</span><span class="fems-val mono">{{ selectedFile.sha.slice(0,7) }}</span></span>
          <span class="fems-sep" v-if="selectedFile.sha"></span>
          <span class="fems-item"><span class="fems-lbl">LINES</span><span class="fems-val">{{ fileLineCount }}</span></span>
        </div>

        <!-- Last Editor Bar -->
        <div class="fe-editor-bar" v-if="selectedFileEditor">
          <div class="feb-left">
            <img v-if="selectedFileEditor.avatar_url" :src="selectedFileEditor.avatar_url" :alt="selectedFileEditor.login" class="feb-avatar">
            <div v-else class="feb-avatar-placeholder"></div>
            <div class="feb-info">
              <span class="feb-label">LAST EDITED BY</span>
              <span class="feb-login">{{ selectedFileEditor.login }}</span>
            </div>
          </div>
          <div class="feb-right">
            <span class="feb-msg" v-if="selectedFileEditor.message">{{ selectedFileEditor.message }}</span>
            <span class="feb-time">{{ selectedFileEditor.relativeTime }} ago</span>
          </div>
        </div>
        <div class="fe-editor-bar fe-editor-loading" v-else-if="selectedFile && lastEditors[selectedFile.path] && lastEditors[selectedFile.path].loading">
          <div class="feb-dot-spinner"></div>
          <span>Fetching last commit…</span>
        </div>

        <div class="fe-code-area" v-if="isLoadingContent">
          <div class="fe-loading"><div class="fe-spinner"></div><span>Loading content…</span></div>
        </div>
        <div class="fe-code-area" v-else>
          <div class="fe-line-nums" aria-hidden="true">
            <span v-for="n in fileLineCount" :key="n">{{ n }}</span>
          </div>
          <pre class="fe-code"><code>{{ fileContent || '// No content available' }}</code></pre>
        </div>
      </div>

      <div v-else class="fe-preview fe-preview-empty">
        <div class="fe-empty-state">
          <div class="fes-icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
          </div>
          <div class="fes-title">SELECT A FILE</div>
          <div class="fes-sub">Click any file in the tree to preview its contents</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileTreeNode from './FileTreeNode.vue'

const FILE_COLORS = {
  vue: '#42b883', js: '#f7df1e', ts: '#3178c6', tsx: '#3178c6', jsx: '#61dafb',
  md: '#ff4500', css: '#264de4', scss: '#c6538c', html: '#e44d26',
  json: '#ffd700', yaml: '#cb171e', yml: '#cb171e', py: '#3572a5',
  go: '#00add8', rs: '#dea584', java: '#b07219', php: '#4f5d95',
  rb: '#701516', sh: '#89e051', svg: '#ff9900', png: '#88d8b0',
  jpg: '#88d8b0', webp: '#88d8b0', lock: '#aaa', toml: '#9c4121',
  mts: '#3178c6', mjs: '#f7df1e', cjs: '#f7df1e',
}

export default {
  name: 'PanelFiles',
  components: { FileTreeNode },

  props: {
    isLightTheme: { type: Boolean, default: false },
    githubToken:  { type: String, default: '' },
    repoOwner:    { type: String, default: 'WildFiire' },
    repoName:     { type: String, default: 'docs' },
    repoBranch:   { type: String, default: 'main' }
  },

  provide() {
    return {
      feLastEditors: this.lastEditors,
      feRequestEditor: (path) => this.fetchLastEditor(path)
    }
  },

  data() {
    return {
      isLoadingFiles: true,
      isLoadingContent: false,
      searchQuery: '',
      searchFocused: false,
      viewMode: 'tree',
      sortBy: 'name',
      typeFilter: '',
      showSortMenu: false,
      fileTree: [],
      filteredTree: [],
      allFiles: [],
      selectedFile: null,
      fileContent: '',
      totalFiles: 0,
      copied: false,
      sortLabels: { name: 'Name', size: 'Size', type: 'Type' },
      lastEditors: {},
      fetchingEditors: new Set()
    }
  },

  mounted() { this.fetchFileTree() },

  computed: {
    typeFilters() {
      const map = {}
      this.allFiles.forEach(f => {
        const ext = f.name.includes('.') ? f.name.split('.').pop().toLowerCase() : '_'
        map[ext] = (map[ext] || 0) + 1
      })
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([ext, count]) => ({ ext, count, color: FILE_COLORS[ext] || '#8a8a95' }))
    },

    filteredFlat() {
      let list = [...this.allFiles]
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(f => f.path.toLowerCase().includes(q))
      }
      if (this.typeFilter) {
        list = list.filter(f => f.name.split('.').pop().toLowerCase() === this.typeFilter)
      }
      if (this.sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
      else if (this.sortBy === 'size') list.sort((a, b) => (b.size || 0) - (a.size || 0))
      else if (this.sortBy === 'type') list.sort((a, b) => {
        const ea = a.name.split('.').pop(), eb = b.name.split('.').pop()
        return ea.localeCompare(eb) || a.name.localeCompare(b.name)
      })
      return list
    },

    fileLineCount() {
      if (!this.fileContent) return 0
      return this.fileContent.split('\n').length
    },

    selectedFileEditor() {
      if (!this.selectedFile) return null
      const ed = this.lastEditors[this.selectedFile.path]
      if (!ed || ed.loading) return null
      return ed
    }
  },

  methods: {
    async fetchFileTree() {
      const token = this.githubToken || localStorage.getItem('github_token')
      if (!token) { this.isLoadingFiles = false; return }
      this.isLoadingFiles = true
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.repoBranch}?recursive=1`, {
          headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        })
        if (res.ok) {
          const data = await res.json()
          const items = data.tree || []
          this.allFiles = items.filter(i => i.type === 'blob').map(i => ({ name: i.path.split('/').pop(), path: i.path, type: 'file', size: i.size, sha: i.sha }))
          this.totalFiles = this.allFiles.length
          this.fileTree = this.buildFileTree(items)
          this.filteredTree = [...this.fileTree]
        }
      } catch (e) { console.error(e) }
      finally { this.isLoadingFiles = false }
    },

    buildFileTree(items) {
      const root = []
      items.forEach(item => {
        const parts = item.path.split('/')
        let level = root
        parts.forEach((part, idx) => {
          const isFile = idx === parts.length - 1 && item.type === 'blob'
          const existing = level.find(n => n.name === part)
          if (existing) { if (!isFile) level = existing.children }
          else {
            const node = { name: part, path: item.path, type: isFile ? 'file' : 'dir', size: item.size, sha: item.sha, expanded: false, children: isFile ? null : [] }
            level.push(node)
            if (!isFile) level = node.children
          }
        })
      })
      const sort = arr => {
        arr.sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1)
        arr.forEach(n => { if (n.children) sort(n.children) })
      }
      sort(root)
      return root
    },

    filterFiles() {
      if (!this.searchQuery && !this.typeFilter) { this.filteredTree = [...this.fileTree]; return }
      const q = this.searchQuery.toLowerCase()
      const ext = this.typeFilter
      const filter = nodes => nodes.filter(n => {
        const nameMatch = n.name.toLowerCase().includes(q)
        const typeMatch = !ext || (n.type === 'file' && n.name.split('.').pop().toLowerCase() === ext)
        if (n.type === 'dir' && n.children) {
          n = { ...n, children: filter(n.children), expanded: true }
          return n.children.length > 0
        }
        return nameMatch && typeMatch
      })
      this.filteredTree = filter(JSON.parse(JSON.stringify(this.fileTree)))
    },

    expandAll() { this.setExpanded(this.fileTree, true); this.filteredTree = [...this.fileTree] },
    collapseAll() { this.setExpanded(this.fileTree, false); this.filteredTree = [...this.fileTree] },
    setExpanded(nodes, val) { nodes.forEach(n => { if (n.children) { n.expanded = val; this.setExpanded(n.children, val) } }) },

    async selectFile(file) {
      this.selectedFile = file
      this.fetchLastEditor(file.path)
      await this.fetchFileContent(file)
    },

    async fetchFileContent(file) {
      const token = this.githubToken || localStorage.getItem('github_token')
      if (!token) return
      this.isLoadingContent = true; this.fileContent = ''
      try {
        const res = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${file.path}`, {
          headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        })
        if (res.ok) {
          const data = await res.json()
          this.fileContent = atob(data.content.replace(/\n/g, ''))
        } else { this.fileContent = '// Error loading file content' }
      } catch (e) { this.fileContent = '// Error loading file content' }
      finally { this.isLoadingContent = false }
    },

    copyFilePath() {
      if (!this.selectedFile) return
      navigator.clipboard.writeText(this.selectedFile.path)
      this.copied = true
      setTimeout(() => { this.copied = false }, 1800)
    },

    downloadFile() {
      if (this.selectedFile && this.fileContent) {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(new Blob([this.fileContent], { type: 'text/plain' }))
        a.download = this.selectedFile.name; a.click()
      }
    },

    getFileColor(name) {
      const ext = name && name.includes('.') ? name.split('.').pop().toLowerCase() : ''
      return FILE_COLORS[ext] || '#8a8a95'
    },

    getFileType(name) {
      const ext = name && name.includes('.') ? name.split('.').pop().toLowerCase() : ''
      const map = { vue:'Vue', js:'JavaScript', ts:'TypeScript', tsx:'TypeScript', jsx:'React', md:'Markdown', css:'CSS', scss:'SCSS', html:'HTML', json:'JSON', yaml:'YAML', yml:'YAML', py:'Python', go:'Go', rs:'Rust', java:'Java', php:'PHP', rb:'Ruby', sh:'Shell', svg:'SVG', png:'Image', jpg:'Image', webp:'Image', lock:'Lockfile', toml:'TOML', mts:'TypeScript' }
      return map[ext] || (ext ? ext.toUpperCase() : 'FILE')
    },

    formatFileSize(bytes) {
      if (!bytes) return '—'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    },

    async fetchLastEditor(path) {
      if (this.lastEditors[path] !== undefined || this.fetchingEditors.has(path)) return
      const token = this.githubToken || localStorage.getItem('github_token')
      if (!token) return
      this.fetchingEditors.add(path)
      this.lastEditors[path] = { loading: true }
      try {
        const res = await fetch(
          `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?path=${encodeURIComponent(path)}&per_page=1&sha=${this.repoBranch}`,
          { headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } }
        )
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            const commit = data[0]
            this.lastEditors[path] = {
              loading: false,
              login: commit.author?.login || commit.commit.author.name,
              avatar_url: commit.author?.avatar_url || null,
              date: commit.commit.author.date,
              relativeTime: this.getRelativeTime(commit.commit.author.date),
              message: commit.commit.message.split('\n')[0].slice(0, 60)
            }
          } else {
            this.lastEditors[path] = null
          }
        } else {
          this.lastEditors[path] = null
        }
      } catch (e) {
        this.lastEditors[path] = null
      } finally {
        this.fetchingEditors.delete(path)
      }
    },

    getRelativeTime(dateStr) {
      const diff = Date.now() - new Date(dateStr).getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 60) return mins + 'm'
      const hrs = Math.floor(mins / 60)
      if (hrs < 24) return hrs + 'h'
      const days = Math.floor(hrs / 24)
      if (days < 30) return days + 'd'
      const months = Math.floor(days / 30)
      if (months < 12) return months + 'mo'
      return Math.floor(months / 12) + 'y'
    }
  }
}
</script>

<style scoped>
.panel-files {
  --bg-secondary: #0f0f12;
  --bg-tertiary: #16161c;
  --bg-primary: #0a0a0e;
  --border-color: #1f1f28;
  --text-primary: #f0f0f5;
  --text-muted: #7a7a8a;
  --accent: #ff4500;
  display: flex; flex-direction: column; gap: 12px; animation: feFadeIn 0.3s ease;
}
@keyframes feFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }

.panel-files.light-theme {
  --bg-primary:#f0f0f5; --bg-secondary:#fff; --bg-tertiary:#e8e8f0;
  --border-color:#ddd; --text-primary:#222; --text-muted:#666;
  --node-dir-color: rgba(0,0,0,0.65);
  --node-dir-hover: #111;
  --node-chevron-color: rgba(0,0,0,0.22);
  --node-chevron-hover: rgba(0,0,0,0.55);
  --node-count-color: rgba(0,0,0,0.35);
  --node-count-bg: rgba(0,0,0,0.07);
  --node-editor-bg: rgba(0,0,0,0.04);
  --node-editor-border: rgba(0,0,0,0.1);
  --node-editor-login: rgba(0,0,0,0.5);
  --node-editor-time: rgba(0,0,0,0.3);
  --node-dot-bg: rgba(0,0,0,0.15);
  --node-indent-bg: rgba(0,0,0,0.08);
  --node-avatar-border: rgba(0,0,0,0.12);
}

/* ── Top Bar ── */
.fe-topbar { display:flex; align-items:center; gap:12px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; padding:12px 16px; flex-wrap:wrap; }
.fe-title { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; color:var(--text-primary); letter-spacing:0.5px; white-space:nowrap; }
.fe-badge { background:rgba(255,69,0,0.15); color:var(--accent); font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; border:1px solid rgba(255,69,0,0.25); }
.fe-search { display:flex; align-items:center; gap:8px; flex:1; min-width:180px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:24px; padding:7px 14px; transition:all 0.15s; color:var(--text-muted); }
.fe-search.focused { border-color:var(--accent); box-shadow:0 0 0 3px rgba(255,69,0,0.1); }
.fe-search input { flex:1; background:none; border:none; outline:none; color:var(--text-primary); font-size:12px; }
.fe-search input::placeholder { color:var(--text-muted); font-size:11px; }
.fe-clear { background:none; border:none; cursor:pointer; color:var(--text-muted); padding:0 2px; line-height:1; font-size:12px; transition:color 0.15s; }
.fe-clear:hover { color:var(--accent); }
.fe-view-toggle { display:flex; gap:4px; align-items:center; }
.fe-view-toggle > button { background:var(--bg-tertiary); border:1px solid var(--border-color); color:var(--text-muted); width:28px; height:28px; border-radius:7px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
.fe-view-toggle > button.active { background:rgba(255,69,0,0.12); border-color:rgba(255,69,0,0.4); color:var(--accent); }
.fe-view-toggle > button:hover:not(.active) { border-color:var(--accent); color:var(--accent); }
.fe-sort-wrap { position:relative; }
.fe-sort-btn { display:flex; align-items:center; gap:5px; background:var(--bg-tertiary); border:1px solid var(--border-color); color:var(--text-muted); padding:5px 10px; border-radius:7px; cursor:pointer; font-size:11px; font-weight:600; transition:all 0.15s; white-space:nowrap; }
.fe-sort-btn:hover { border-color:var(--accent); color:var(--accent); }
.fe-sort-menu { position:absolute; right:0; top:calc(100% + 4px); background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; overflow:hidden; z-index:20; min-width:110px; box-shadow:0 8px 24px rgba(0,0,0,0.4); }
.fe-sort-menu button { display:block; width:100%; text-align:left; padding:8px 14px; background:none; border:none; color:var(--text-muted); font-size:12px; cursor:pointer; transition:background 0.12s; }
.fe-sort-menu button:hover { background:var(--bg-tertiary); color:var(--text-primary); }
.fe-sort-menu button.active { color:var(--accent); font-weight:600; }

/* ── Chips ── */
.fe-chips { display:flex; gap:6px; flex-wrap:wrap; }
.fe-chip { display:flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-muted); font-size:10px; font-weight:600; cursor:pointer; transition:all 0.15s; }
.fe-chip:hover { border-color:var(--text-muted); color:var(--text-primary); }
.fe-chip.active { background:rgba(255,69,0,0.1); border-color:var(--accent); color:var(--accent); }
.fe-chip-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.fe-chip-ct { background:rgba(255,255,255,0.06); padding:1px 5px; border-radius:8px; font-size:9px; }
.panel-files.light-theme .fe-chip-ct { background:rgba(0,0,0,0.08); }

/* ── Stats Strip ── */
.fe-stats-strip { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:10px 14px; }
.fss-bar-track { height:5px; border-radius:3px; overflow:hidden; display:flex; margin-bottom:8px; }
.fss-seg { height:100%; transition:width 0.4s; }
.fss-legend { display:flex; gap:12px; flex-wrap:wrap; }
.fss-lbl { display:flex; align-items:center; gap:4px; font-size:9px; font-weight:600; color:var(--text-muted); }
.fss-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }

/* ── Layout ── */
.fe-layout { display:grid; grid-template-columns:minmax(420px, 46%) 1fr; gap:12px; height:calc(100vh - 280px); min-height:480px; }

/* ── Tree Panel ── */
.fe-tree-panel { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; display:flex; flex-direction:column; overflow:hidden; }
.fe-panel-head { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-bottom:1px solid var(--border-color); background:var(--bg-tertiary); }
.fe-panel-title { display:flex; align-items:center; gap:6px; font-size:10px; font-weight:700; color:var(--text-muted); letter-spacing:0.5px; }
.fe-panel-actions { display:flex; gap:4px; }
.fpa-btn { display:flex; align-items:center; gap:5px; background:var(--bg-secondary); border:1px solid var(--border-color); color:var(--text-muted); padding:4px 8px; border-radius:6px; cursor:pointer; font-size:10px; font-weight:600; transition:all 0.15s; text-decoration:none; }
.fpa-btn:hover, .fpa-btn:hover svg { border-color:var(--accent); color:var(--accent); }
.fpa-btn.accent { background:var(--accent); color:#fff; border-color:var(--accent); }
.fpa-btn.accent:hover { opacity:0.85; }
.fe-tree-body { flex:1; overflow-y:auto; overflow-x:auto; padding:8px; min-width:0; }
.fe-tree-body::-webkit-scrollbar { width:3px; }
.fe-tree-body::-webkit-scrollbar-track { background:transparent; }
.fe-tree-body::-webkit-scrollbar-thumb { background:var(--border-color); border-radius:2px; }

/* ── Flat List ── */
.fe-flat-list { display:flex; flex-direction:column; gap:1px; }
.fe-flat-row { display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:7px; cursor:pointer; transition:background 0.12s; }
.fe-flat-row:hover { background:var(--bg-tertiary); }
.fe-flat-row.selected { background:rgba(255,69,0,0.1); outline:1px solid rgba(255,69,0,0.25); }
.fe-flat-icon { flex-shrink:0; display:flex; }
.fe-flat-name { font-size:11px; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; flex:1; }
.fe-flat-dir { font-size:9px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100px; font-family:monospace; }
.fe-flat-size { font-size:9px; color:var(--text-muted); font-family:monospace; flex-shrink:0; }

/* ── Preview ── */
.fe-preview { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; display:flex; flex-direction:column; overflow:hidden; }
.fe-preview-head { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-bottom:1px solid var(--border-color); border-top:3px solid transparent; background:var(--bg-tertiary); gap:10px; flex-wrap:wrap; }
.feph-left { display:flex; align-items:center; gap:10px; min-width:0; flex:1; }
.feph-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.feph-name { font-size:12px; font-weight:700; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.feph-path { font-size:10px; color:var(--text-muted); font-family:monospace; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:280px; }
.feph-actions { display:flex; gap:5px; align-items:center; flex-wrap:wrap; }

/* ── Editor Bar (preview panel) ── */
.fe-editor-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 14px; border-bottom:1px solid var(--border-color); background:rgba(255,255,255,0.02); flex-wrap:wrap; min-height:44px; }
.panel-files.light-theme .fe-editor-bar { background:rgba(0,0,0,0.015); }
.fe-editor-loading { gap:8px; font-size:11px; color:var(--text-muted); }
.feb-dot-spinner { width:12px; height:12px; border:1.5px solid var(--border-color); border-top-color:var(--accent); border-radius:50%; animation:feSpin 0.7s linear infinite; flex-shrink:0; }
.feb-left { display:flex; align-items:center; gap:10px; min-width:0; }
.feb-avatar { width:28px; height:28px; border-radius:50%; border:2px solid var(--border-color); display:block; flex-shrink:0; }
.feb-avatar-placeholder { width:28px; height:28px; border-radius:50%; background:var(--bg-tertiary); border:1px solid var(--border-color); flex-shrink:0; }
.feb-info { display:flex; flex-direction:column; gap:1px; }
.feb-label { font-size:8px; font-weight:700; color:var(--text-muted); letter-spacing:0.6px; }
.feb-login { font-size:12px; font-weight:700; color:var(--text-primary); }
.feb-right { display:flex; align-items:center; gap:8px; min-width:0; flex:1; justify-content:flex-end; }
.feb-msg { font-size:10px; color:var(--text-muted); font-family:monospace; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:260px; padding:2px 8px; background:var(--bg-tertiary); border-radius:6px; border:1px solid var(--border-color); }
.feb-time { font-size:10px; font-weight:700; color:var(--accent); white-space:nowrap; flex-shrink:0; }

/* ── Meta Strip ── */
.fe-meta-strip { display:flex; align-items:center; gap:0; padding:6px 14px; border-bottom:1px solid var(--border-color); background:var(--bg-primary); flex-wrap:wrap; }
.fems-item { display:flex; align-items:center; gap:5px; padding:0 10px; }
.fems-item:first-child { padding-left:0; }
.fems-lbl { font-size:8px; font-weight:700; color:var(--text-muted); letter-spacing:0.5px; text-transform:uppercase; }
.fems-val { font-size:11px; font-weight:600; color:var(--text-primary); }
.fems-val.mono { font-family:monospace; font-size:10px; }
.fems-sep { width:1px; height:14px; background:var(--border-color); flex-shrink:0; }

/* ── Code Area ── */
.fe-code-area { flex:1; overflow:auto; display:flex; background:var(--bg-primary); }
.fe-code-area::-webkit-scrollbar { width:4px; height:4px; }
.fe-code-area::-webkit-scrollbar-track { background:transparent; }
.fe-code-area::-webkit-scrollbar-thumb { background:var(--border-color); border-radius:2px; }
.fe-line-nums { padding:16px 12px 16px 16px; text-align:right; user-select:none; display:flex; flex-direction:column; gap:0; border-right:1px solid var(--border-color); flex-shrink:0; }
.fe-line-nums span { font-size:11px; font-family:'Monaco','Menlo',monospace; color:rgba(255,255,255,0.12); line-height:1.65; min-width:28px; display:block; }
.panel-files.light-theme .fe-line-nums span { color:rgba(0,0,0,0.2); }
.fe-code { margin:0; padding:16px 20px; color:var(--text-primary); font-family:'Monaco','Menlo',monospace; font-size:12px; line-height:1.65; white-space:pre; word-break:normal; flex:1; overflow:visible; background:transparent; }

/* ── Empty / Loading ── */
.fe-preview-empty { align-items:center; justify-content:center; }
.fe-empty-state { display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; }
.fes-icon { color:var(--text-muted); opacity:0.3; }
.fes-title { font-size:13px; font-weight:700; color:var(--text-muted); letter-spacing:0.5px; }
.fes-sub { font-size:11px; color:var(--text-muted); opacity:0.7; }
.fe-empty { padding:20px; text-align:center; font-size:12px; color:var(--text-muted); }
.fe-loading { display:flex; align-items:center; justify-content:center; gap:10px; padding:40px; font-size:12px; color:var(--text-muted); }
.fe-spinner { width:20px; height:20px; border:2px solid var(--border-color); border-top-color:var(--accent); border-radius:50%; animation:feSpin 0.7s linear infinite; flex-shrink:0; }
@keyframes feSpin { to { transform:rotate(360deg) } }

/* ── Light theme fine-tuning ── */
.panel-files.light-theme .fe-sort-menu { box-shadow:0 8px 24px rgba(0,0,0,0.12); }
.panel-files.light-theme .fe-flat-row.selected { background:rgba(255,69,0,0.08); outline:1px solid rgba(255,69,0,0.2); }
.panel-files.light-theme .feph-path { color:#888; }
.panel-files.light-theme .fems-lbl { color:#999; }
.panel-files.light-theme .fe-preview-head { background:rgba(0,0,0,0.02); }
.panel-files.light-theme .fe-panel-head { background:rgba(0,0,0,0.025); }
.panel-files.light-theme .fpa-btn { background:#fff; }
.panel-files.light-theme .feb-msg { background:rgba(0,0,0,0.04); border-color:rgba(0,0,0,0.1); }
.panel-files.light-theme .feb-avatar { border-color:rgba(0,0,0,0.1); }

@media (max-width: 1100px) {
  .fe-layout { grid-template-columns:minmax(340px, 42%) 1fr; }
}
@media (max-width: 900px) {
  .fe-layout { grid-template-columns:1fr; height:auto; }
  .fe-tree-panel { max-height:350px; }
  .fe-preview { min-height:400px; }
}
@media (max-width: 640px) {
  .fe-topbar { gap:8px; }
  .fe-search { min-width:120px; }
  .feph-path { display:none; }
}
</style>
