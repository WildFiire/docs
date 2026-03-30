<!-- docs\.vitepress\theme\components\Panel\PanelFiles.vue -->
<template>
  <div class="panel-files" :class="{ 'light-theme': isLightTheme }">
    <div class="files-header">
      <h2>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
        FILE EXPLORER
      </h2>
      <div class="file-search">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21L17 17"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="SEARCH FILES..."
          @input="filterFiles"
        >
        <button v-if="searchQuery" class="search-clear" @click="clearSearch">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="file-layout">
      <!-- File Tree -->
      <div class="file-tree-panel">
        <div class="tree-header">
          <span>ROOT</span>
          <span class="file-count">{{ totalFiles }} FILES</span>
        </div>
        <div class="file-tree">
          <div v-if="isLoadingFiles" class="tree-loading">
            <div class="loader"></div>
            <span>Loading files...</span>
          </div>
          <div v-else-if="filteredTree.length === 0" class="tree-empty">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <p>No files found</p>
          </div>
          <FileTreeNode 
            v-for="item in filteredTree" 
            :key="item.path"
            :node="item"
            :level="0"
            :search-query="searchQuery"
            @select="selectFile"
          />
        </div>
      </div>

      <!-- File Preview -->
      <div class="file-preview" v-if="selectedFile">
        <div class="preview-header">
          <div class="preview-path">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--accent)">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <span>{{ selectedFile.path }}</span>
          </div>
          <div class="preview-actions">
            <button class="preview-btn" @click="copyFilePath">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
            <button class="preview-btn" @click="downloadFile">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
            <button class="preview-btn edit" @click="editFile">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <path d="M17 3L21 7L7 21H3V17L17 3Z"/>
              </svg>
              <span>EDIT</span>
            </button>
          </div>
        </div>
        
        <div class="preview-content">
          <div class="file-meta">
            <span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              SIZE: {{ formatFileSize(selectedFile.size) }}
            </span>
            <span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="9"/>
                <rect x="14" y="3" width="7" height="5"/>
                <rect x="14" y="12" width="7" height="9"/>
                <rect x="3" y="16" width="7" height="5"/>
              </svg>
              TYPE: {{ getFileType(selectedFile.name) }}
            </span>
            <span v-if="selectedFile.sha">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8.5L7 3.5 5.5 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              SHA: {{ selectedFile.sha.substring(0, 7) }}
            </span>
          </div>
          
          <div class="file-content" v-if="isLoadingContent">
            <div class="content-loader"></div>
            <span>Loading content...</span>
          </div>
          <pre v-else class="file-code"><code>{{ fileContent || '// No content available' }}</code></pre>
        </div>
      </div>

      <!-- Empty Preview -->
      <div v-else class="file-preview empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
        <h3>SELECT A FILE</h3>
        <p>Click on any file to preview its contents</p>
      </div>
    </div>
  </div>
</template>

<script>
import FileTreeNode from './FileTreeNode.vue'

export default {
  name: 'PanelFiles',
  
  components: {
    FileTreeNode
  },
  
  props: {
    isLightTheme: {
      type: Boolean,
      default: false
    },
    githubToken: {
      type: String,
      default: ''
    },
    repoOwner: {
      type: String,
      default: 'Wildfiire'
    },
    repoName: {
      type: String,
      default: 'docs'
    },
    repoBranch: {
      type: String,
      default: 'main'
    }
  },
  
  data() {
    return {
      isLoadingFiles: true,
      isLoadingContent: false,
      searchQuery: '',
      fileTree: [],
      filteredTree: [],
      selectedFile: null,
      fileContent: '',
      totalFiles: 0
    }
  },
  
  mounted() {
    this.fetchFileTree()
  },
  
  methods: {
    async fetchFileTree() {
      const token = this.githubToken || localStorage.getItem('github_token')
      if (!token) return
      
      this.isLoadingFiles = true
      
      try {
        const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.repoBranch}?recursive=1`
        const response = await fetch(url, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          const items = data.tree || []
          this.totalFiles = items.filter(item => item.type === 'blob').length
          this.fileTree = this.buildFileTree(items)
          this.filteredTree = [...this.fileTree]
        }
      } catch (error) {
        console.error('Error fetching file tree:', error)
      } finally {
        this.isLoadingFiles = false
      }
    },
    
    buildFileTree(items) {
      const root = []
      const pathMap = new Map()
      
      items.forEach(item => {
        const parts = item.path.split('/')
        let currentLevel = root
        
        parts.forEach((part, index) => {
          const isFile = index === parts.length - 1 && item.type === 'blob'
          const existing = currentLevel.find(node => node.name === part)
          
          if (existing) {
            if (!isFile) {
              currentLevel = existing.children
            }
          } else {
            const newNode = {
              name: part,
              path: item.path,
              type: isFile ? 'file' : 'dir',
              size: item.size,
              sha: item.sha,
              expanded: false,
              children: isFile ? null : []
            }
            currentLevel.push(newNode)
            if (!isFile) {
              currentLevel = newNode.children
            }
          }
        })
      })
      
      // Sort directories first, then files
      const sortItems = (items) => {
        items.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name)
          return a.type === 'dir' ? -1 : 1
        })
        items.forEach(item => {
          if (item.type === 'dir' && item.children) {
            sortItems(item.children)
          }
        })
      }
      
      sortItems(root)
      return root
    },
    
    filterFiles() {
      if (!this.searchQuery.trim()) {
        this.filteredTree = [...this.fileTree]
        return
      }
      
      const query = this.searchQuery.toLowerCase()
      const filterNodes = (nodes) => {
        return nodes.filter(node => {
          const matches = node.name.toLowerCase().includes(query)
          if (node.type === 'dir' && node.children) {
            node.children = filterNodes(node.children)
            return node.children.length > 0 || matches
          }
          return matches
        })
      }
      
      this.filteredTree = filterNodes([...this.fileTree])
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.filteredTree = [...this.fileTree]
    },
    
    async selectFile(file) {
      this.selectedFile = file
      await this.fetchFileContent(file)
    },
    
    async fetchFileContent(file) {
      const token = this.githubToken || localStorage.getItem('github_token')
      if (!token) return
      
      this.isLoadingContent = true
      this.fileContent = ''
      
      try {
        const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${file.path}`
        const response = await fetch(url, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          // Decode base64 content
          this.fileContent = atob(data.content)
        } else {
          this.fileContent = '// Error loading file content'
        }
      } catch (error) {
        console.error('Error fetching file content:', error)
        this.fileContent = '// Error loading file content'
      } finally {
        this.isLoadingContent = false
      }
    },
    
    editFile() {
      if (this.selectedFile) {
        window.open(`https://github.com/${this.repoOwner}/${this.repoName}/edit/${this.repoBranch}/${this.selectedFile.path}`, '_blank')
      }
    },
    
    copyFilePath() {
      if (this.selectedFile) {
        navigator.clipboard.writeText(this.selectedFile.path)
        // You could add a toast notification here
      }
    },
    
    downloadFile() {
      if (this.selectedFile && this.fileContent) {
        const blob = new Blob([this.fileContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = this.selectedFile.name
        a.click()
        URL.revokeObjectURL(url)
      }
    },
    
    getFileType(filename) {
      const ext = filename.split('.').pop().toLowerCase()
      const types = {
        js: 'JavaScript',
        ts: 'TypeScript',
        vue: 'Vue',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        md: 'Markdown',
        json: 'JSON',
        yaml: 'YAML',
        yml: 'YAML',
        txt: 'Text',
        py: 'Python',
        rb: 'Ruby',
        go: 'Go',
        rs: 'Rust',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        php: 'PHP'
      }
      return types[ext] || ext.toUpperCase() || 'FILE'
    },
    
    formatFileSize(bytes) {
      if (!bytes) return '0 B'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    }
  }
}
</script>

<style scoped>
.panel-files {
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --bg-primary: #0a0a0c;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-files.light-theme {
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --border-color: #ddd;
  --text-primary: #333;
  --text-muted: #666;
  --accent-glow: rgba(255, 69, 0, 0.1);
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.files-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.file-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  width: 300px;
  transition: all 0.2s ease;
}

.file-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.1);
}

.file-search input {
  background: none;
  border: none;
  color: var(--text-primary);
  width: 100%;
  font-size: 13px;
  outline: none;
}

.file-search input::placeholder {
  color: var(--text-muted);
  font-size: 11px;
}

.search-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.search-clear:hover {
  color: var(--accent);
  background: var(--bg-hover);
}

.file-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  height: calc(100vh - 180px);
  min-height: 500px;
}

/* File Tree Panel */
.file-tree-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-muted);
}

.file-count {
  background: var(--bg-tertiary);
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--accent);
  font-size: 10px;
  font-weight: 600;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.tree-loading, .tree-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: var(--text-muted);
}

.loader {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* File Preview */
.file-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-preview.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-muted);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 12px;
}

.preview-path {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font-size: 13px;
  font-family: monospace;
  word-break: break-all;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.preview-btn {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 6px 12px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  transition: all 0.2s ease;
}

.preview-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.preview-btn.edit:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: var(--bg-primary);
}

.file-meta {
  display: flex;
  gap: 24px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 11px;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.file-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-meta svg {
  color: var(--accent);
}

.file-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: var(--text-muted);
}

.content-loader {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.file-code {
  margin: 0;
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--bg-primary);
  border-radius: 8px;
  overflow-x: auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 900px) {
  .file-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .file-tree-panel {
    max-height: 400px;
  }
  
  .file-preview {
    min-height: 400px;
  }
}

@media (max-width: 700px) {
  .files-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .file-search {
    width: 100%;
  }
  
  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .preview-actions {
    width: 100%;
  }
  
  .preview-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>