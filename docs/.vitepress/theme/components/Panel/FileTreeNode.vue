<!-- docs\.vitepress\theme\components\Panel\FileTreeNode.vue -->
<template>
  <div class="file-tree-node" :style="{ paddingLeft: (level * 16) + 'px' }">
    <!-- Directory -->
    <div 
      v-if="node.type === 'dir'"
      class="node-item dir"
      :class="{ expanded: node.expanded }"
      @click="toggleFolder"
    >
      <span class="node-icon">
        <svg v-if="node.expanded" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
          <path d="M5 8h14M5 8l4-4h6l4 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <line x1="10" y1="14" x2="14" y2="14"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
          <path d="M5 8h14M5 8l4-4h6l4 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <line x1="10" y1="14" x2="14" y2="14"/>
        </svg>
      </span>
      <span class="node-name" :class="{ highlight: isHighlighted }">{{ node.name }}</span>
      <span class="node-count" v-if="node.children && node.children.length">({{ node.children.length }})</span>
    </div>

    <!-- File -->
    <div 
      v-else
      class="node-item file"
      :class="{ selected: isSelected }"
      @click="selectFile"
    >
      <span class="node-icon">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
      </span>
      <span class="node-name" :class="{ highlight: isHighlighted }">{{ node.name }}</span>
      <span class="node-size" v-if="node.size">{{ formatSize(node.size) }}</span>
    </div>

    <!-- Children (for directories) -->
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
export default {
  name: 'FileTreeNode',
  
  props: {
    node: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    searchQuery: {
      type: String,
      default: ''
    },
    selectedPath: {
      type: String,
      default: ''
    }
  },
  
  computed: {
    isHighlighted() {
      if (!this.searchQuery) return false
      return this.node.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    },
    
    isSelected() {
      return this.selectedPath === this.node.path
    }
  },
  
  methods: {
    toggleFolder() {
      this.node.expanded = !this.node.expanded
      this.$forceUpdate()
    },
    
    selectFile() {
      if (this.node.type === 'file') {
        this.$emit('select', this.node)
      }
    },
    
    handleSelect(file) {
      this.$emit('select', file)
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
}

.node-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin: 2px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--text-muted);
}

.node-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.node-item.dir {
  cursor: pointer;
}

.node-item.file {
  cursor: pointer;
}

.node-item.file.selected {
  background: var(--accent);
  color: white;
}

.node-item.file.selected .node-icon svg {
  stroke: white;
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
}

.node-icon svg {
  stroke: currentColor;
}

.node-name {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-name.highlight {
  color: var(--accent);
  background: rgba(255, 69, 0, 0.1);
  border-radius: 4px;
  padding: 0 4px;
  margin: -2px -4px;
}

.node-count {
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 10px;
  flex-shrink: 0;
}

.node-size {
  font-size: 10px;
  color: var(--text-muted);
  font-family: monospace;
  flex-shrink: 0;
}

.node-item.file.selected .node-size {
  color: rgba(255, 255, 255, 0.7);
}

.node-children {
  margin-top: 2px;
}

/* Animation for expanding */
.node-children {
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>