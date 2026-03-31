<!-- docs\.vitepress\theme\components\Panel\FileTreeNode.vue -->
<template>
  <div class="file-tree-node" :style="{ paddingLeft: (level * 16) + 'px' }">

    <!-- ── Directory ── -->
    <div
      v-if="node.type === 'dir'"
      class="node-item dir"
      :class="{ expanded: node.expanded }"
      @click="toggleFolder"
    >
      <span class="node-chevron">
        <svg v-if="node.expanded" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
        <svg v-else viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </span>
      <span class="node-folder-icon">
        <svg v-if="node.expanded" viewBox="0 0 24 24" width="15" height="15" fill="rgba(255,200,60,0.55)" stroke="rgba(255,185,40,0.85)" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="rgba(255,180,40,0.25)" stroke="rgba(255,165,30,0.65)" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      </span>
      <span class="node-name" :class="{ highlight: isHighlighted }" :title="node.name">{{ node.name }}</span>
      <span class="node-count" v-if="node.children && node.children.length">{{ node.children.length }}</span>
    </div>

    <!-- ── File ── -->
    <div
      v-else
      class="node-item file"
      :class="{ selected: isSelected }"
      @click="selectFile"
      @mouseenter="onFileHover"
    >
      <span class="node-file-icon" :style="{ color: isSelected ? '#fff' : fileColor }">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
      </span>
      <span class="node-name" :class="{ highlight: isHighlighted }" :title="node.path">{{ node.name }}</span>

      <!-- Last editor section -->
      <div class="node-editor" v-if="nodeEditor && !nodeEditor.loading">
        <div class="node-editor-inner" :title="nodeEditor.login + ' · ' + nodeEditor.relativeTime + (nodeEditor.message ? '\n' + nodeEditor.message : '')">
          <img v-if="nodeEditor.avatar_url" :src="nodeEditor.avatar_url" :alt="nodeEditor.login" class="node-editor-avatar">
          <span class="node-editor-login" v-if="!isSelected">{{ nodeEditor.login }}</span>
          <span class="node-editor-time" v-if="!isSelected">{{ nodeEditor.relativeTime }}</span>
        </div>
      </div>
      <div class="node-editor-loading" v-else-if="nodeEditor && nodeEditor.loading">
        <div class="ned-dot"></div>
      </div>
      <span class="node-size" v-else-if="node.size && !isSelected">{{ formatSize(node.size) }}</span>
    </div>

    <!-- ── Children ── -->
    <div v-if="node.type === 'dir' && node.expanded && node.children && node.children.length" class="node-children">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :level="level + 1"
        :search-query="searchQuery"
        :selected-path="selectedPath"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script>
const FILE_COLORS = {
  vue:'#42b883', js:'#f7df1e', ts:'#3178c6', tsx:'#3178c6', jsx:'#61dafb',
  md:'#ff4500', css:'#264de4', scss:'#c6538c', html:'#e44d26',
  json:'#ffd700', yaml:'#cb171e', yml:'#cb171e', py:'#3572a5',
  go:'#00add8', rs:'#dea584', java:'#b07219', php:'#4f5d95',
  rb:'#701516', sh:'#89e051', svg:'#ff9900', png:'#88d8b0',
  jpg:'#88d8b0', jpeg:'#88d8b0', webp:'#88d8b0', gif:'#88d8b0',
  lock:'#aaa', toml:'#9c4121', mts:'#3178c6', mjs:'#f7df1e', cjs:'#f7df1e',
  env:'#22c55e', gitignore:'#f05032', dockerf:'#0db7ed',
}

export default {
  name: 'FileTreeNode',

  inject: {
    feLastEditors:   { default: () => ({}) },
    feRequestEditor: { default: () => () => {} }
  },

  props: {
    node:         { type: Object, required: true },
    level:        { type: Number, default: 0 },
    searchQuery:  { type: String, default: '' },
    selectedPath: { type: String, default: '' }
  },

  computed: {
    isHighlighted() {
      if (!this.searchQuery) return false
      return this.node.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    },
    isSelected() {
      return this.selectedPath === this.node.path
    },
    fileColor() {
      const ext = this.node.name.includes('.') ? this.node.name.split('.').pop().toLowerCase() : ''
      return FILE_COLORS[ext] || '#8a8a95'
    },
    nodeEditor() {
      if (this.node.type !== 'file') return null
      return this.feLastEditors[this.node.path] ?? null
    }
  },

  mounted() {
    if (this.node.type === 'file') this.feRequestEditor(this.node.path)
  },

  methods: {
    toggleFolder() {
      this.node.expanded = !this.node.expanded
      this.$forceUpdate()
    },
    selectFile() {
      if (this.node.type === 'file') this.$emit('select', this.node)
    },
    handleSelect(file) {
      this.$emit('select', file)
    },
    onFileHover() {
      if (this.node.type === 'file') this.feRequestEditor(this.node.path)
    },
    formatSize(bytes) {
      if (!bytes) return ''
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    }
  }
}
</script>

<style scoped>
.file-tree-node {
  user-select: none;
  --node-dir-color: rgba(255,255,255,0.75);
  --node-dir-hover: #fff;
  --node-chevron-color: rgba(255,255,255,0.25);
  --node-chevron-hover: rgba(255,255,255,0.6);
  --node-count-color: rgba(255,255,255,0.25);
  --node-count-bg: rgba(255,255,255,0.06);
  --node-editor-bg: rgba(255,255,255,0.05);
  --node-editor-border: rgba(255,255,255,0.08);
  --node-editor-login: rgba(255,255,255,0.55);
  --node-editor-time: rgba(255,255,255,0.28);
  --node-dot-bg: rgba(255,255,255,0.15);
  --node-indent-bg: rgba(255,255,255,0.06);
  --node-avatar-border: rgba(255,255,255,0.15);
}

/* ── Item base ── */
.node-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  margin: 1px 0;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  color: var(--text-muted);
  white-space: nowrap;
  min-width: 0;
  position: relative;
}
.node-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.node-item:hover .node-size { opacity: 1; }

/* ── Directory ── */
.node-item.dir { color: var(--node-dir-color); }
.node-item.dir:hover { color: var(--node-dir-hover); }
.node-chevron { display:flex; align-items:center; justify-content:center; width:14px; flex-shrink:0; color:var(--node-chevron-color); transition:color 0.12s; }
.node-item.dir:hover .node-chevron { color:var(--node-chevron-hover); }
.node-folder-icon { display:flex; align-items:center; flex-shrink:0; }

/* ── File ── */
.node-item.file.selected {
  background: var(--accent, #ff4500);
  color: #fff;
}
.node-item.file.selected .node-file-icon { color: #fff !important; }
.node-file-icon { display:flex; align-items:center; flex-shrink:0; transition:color 0.12s; }

/* ── Name ── */
.node-name {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node-name.highlight {
  color: var(--accent, #ff4500);
  background: rgba(255, 69, 0, 0.12);
  border-radius: 4px;
  padding: 0 4px;
  margin: -2px 0;
}

/* ── Count badge ── */
.node-count {
  font-size: 9px;
  font-weight: 700;
  color: var(--node-count-color);
  background: var(--node-count-bg);
  padding: 1px 6px;
  border-radius: 8px;
  flex-shrink: 0;
}

/* ── Size ── */
.node-size {
  font-size: 9px;
  color: var(--text-muted);
  font-family: monospace;
  flex-shrink: 0;
  opacity: 0.6;
}

/* ── Last editor ── */
.node-editor {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 1;
}
.node-editor-inner {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--node-editor-bg);
  border: 1px solid var(--node-editor-border);
  border-radius: 20px;
  padding: 2px 7px 2px 3px;
  cursor: default;
  transition: background 0.12s, border-color 0.12s;
}
.node-editor-inner:hover {
  background: var(--node-editor-bg);
  border-color: var(--node-editor-border);
  filter: brightness(1.2);
}
.node-editor-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid var(--node-avatar-border);
}
.node-editor-login {
  font-size: 9px;
  font-weight: 600;
  color: var(--node-editor-login);
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.node-editor-time {
  font-size: 9px;
  color: var(--node-editor-time);
  white-space: nowrap;
}

/* ── Loading indicator ── */
.node-editor-loading {
  display: flex;
  align-items: center;
  padding: 0 6px;
  flex-shrink: 0;
}
.ned-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--node-dot-bg);
  animation: nedPulse 1.2s ease-in-out infinite;
}
@keyframes nedPulse { 0%,100% { opacity:0.2 } 50% { opacity:0.8 } }

/* ── Children + indent guide ── */
.node-children {
  position: relative;
  animation: nodeSlide 0.15s ease;
}
.node-children::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 4px;
  width: 1px;
  background: var(--node-indent-bg);
  pointer-events: none;
}
@keyframes nodeSlide {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>