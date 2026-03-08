<template>
  <div class="file-tree-item">
    <!-- Current item -->
    <div 
      class="tree-row" 
      @click="handleClick"
      @dblclick="handleDoubleClick"
      :class="{ 'is-file': item.type === 'file', 'is-dir': item.type === 'dir' }"
    >
      <!-- Icon based on type and expanded state -->
      <span class="tree-icon">
        <svg v-if="item.type === 'dir'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ 'icon-rotated': item.expanded }">
          <path v-if="item.expanded" d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-7l-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke-width="1.5"/>
          <path v-else d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" stroke-width="1.5"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke-width="1.5"/>
          <path d="M14 2v6h6" stroke-width="1.5"/>
        </svg>
      </span>
      
      <!-- File/folder name with search highlight -->
      <span 
        class="tree-name" 
        :class="{ 
          'search-highlight': fileSearch && item.name.toLowerCase().includes(fileSearch.toLowerCase()),
          'has-children': item.type === 'dir' && item.children && item.children.length > 0
        }"
        :title="item.path"
      >
        {{ item.name }}
      </span>
      
      <!-- File size (only for files) -->
      <span class="tree-size" v-if="item.type === 'file'">{{ formatFileSize(item.size) }}</span>
      
      <!-- Arrow indicator for directories -->
      <span class="tree-arrow" v-if="item.type === 'dir'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ 'arrow-rotated': item.expanded }">
          <path d="M9 18l6-6-6-6" stroke-width="2"/>
        </svg>
      </span>
      
      <!-- Edit button for files -->
      <button 
        v-if="item.type === 'file'" 
        class="edit-btn" 
        @click.stop="$emit('edit', item)" 
        title="Edit in GitHub"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 3l4 4-7 7H10v-4l7-7z" stroke-width="2"/>
          <path d="M4 20h16" stroke-width="2"/>
        </svg>
      </button>
    </div>
    
    <!-- Children - RECURSIVE -->
    <div 
      v-if="item.type === 'dir' && item.expanded && item.children && item.children.length" 
      class="tree-children"
    >
      <FileTreeItem 
        v-for="child in filteredChildren" 
        :key="child.path"
        :item="child"
        :file-search="fileSearch"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @edit="$emit('edit', $event)"
      />
      
      <!-- Empty state for empty folders -->
      <div v-if="item.children.length === 0" class="tree-empty">
        <span>Empty folder</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileTreeItem',
  props: {
    item: {
      type: Object,
      required: true,
      validator(value) {
        // Validare de bază pentru obiectul item
        return value && 
               typeof value.name === 'string' && 
               (value.type === 'dir' || value.type === 'file') &&
               typeof value.path === 'string'
      }
    },
    fileSearch: {
      type: String,
      default: ''
    }
  },
  
  computed: {
    /**
     * Filter children based on search query
     * Only used when search is active
     */
    filteredChildren() {
      if (!this.fileSearch || !this.item.children) return this.item.children
      
      const searchLower = this.fileSearch.toLowerCase()
      
      // Filter children recursively
      const filterItems = (items) => {
        return items.filter(child => {
          const matches = child.name.toLowerCase().includes(searchLower)
          
          if (child.type === 'dir' && child.children) {
            child.children = filterItems(child.children)
            return child.children.length > 0 || matches
          }
          
          return matches
        })
      }
      
      // Create a deep copy to avoid mutating original
      const childrenCopy = JSON.parse(JSON.stringify(this.item.children))
      return filterItems(childrenCopy)
    }
  },
  
  methods: {
    /**
     * Handle single click on tree item
     * - For directories: emit toggle event
     * - For files: emit select event
     */
    handleClick() {
      if (this.item.type === 'dir') {
        this.$emit('toggle', this.item)
      } else {
        this.$emit('select', this.item)
      }
    },
    
    /**
     * Handle double click on tree item
     * - For directories: expand/collapse
     * - For files: open in new tab
     */
    handleDoubleClick() {
      if (this.item.type === 'dir') {
        this.$emit('toggle', this.item)
      } else {
        window.open(this.item.url || `https://github.com/Wildfiire/docs/blob/main/${this.item.path}`, '_blank')
      }
    },
    
    /**
     * Format file size from bytes to human readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size (e.g., "1.5 KB", "2.3 MB")
     */
    formatFileSize(bytes) {
      if (!bytes && bytes !== 0) return '0 B'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    }
  }
}
</script>

<style scoped>
.file-tree-item {
  margin-bottom: 2px;
  width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tree-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-sizing: border-box;
  position: relative;
  border-left: 2px solid transparent;
}

.tree-row:hover { 
  background: rgba(255, 69, 0, 0.08); 
  border-left-color: #ff4500;
}

.tree-row.is-file:hover {
  background: rgba(52, 152, 219, 0.08);
  border-left-color: #3498db;
}

.tree-row.is-dir:hover {
  background: rgba(255, 69, 0, 0.08);
}

.tree-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #ff4500;
  transition: transform 0.3s ease;
}

.tree-icon .icon-rotated {
  transform: rotate(90deg);
}

.tree-name {
  flex: 1;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 400;
  transition: all 0.2s ease;
  padding: 2px 0;
}

.tree-name.has-children {
  font-weight: 500;
}

.tree-name.search-highlight {
  color: #ff4500;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 69, 0, 0.3);
}

.tree-size {
  color: #808090;
  font-size: 11px;
  margin-right: 4px;
  flex-shrink: 0;
  white-space: nowrap;
  font-family: 'SF Mono', monospace;
  background: rgba(255, 255, 255, 0.03);
  padding: 2px 6px;
  border-radius: 12px;
}

.tree-arrow {
  color: #ff4500;
  font-size: 12px;
  margin-left: 4px;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.tree-arrow svg {
  transition: transform 0.3s ease;
}

.tree-arrow .arrow-rotated {
  transform: rotate(90deg);
}

.tree-children {
  margin-left: 24px;
  position: relative;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tree-children::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, rgba(255,69,0,0.3), rgba(255,69,0,0.1), transparent);
  pointer-events: none;
  border-radius: 1px;
}

.tree-empty {
  padding: 8px 12px;
  color: #606070;
  font-size: 11px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  margin: 4px 0;
  text-align: center;
  border: 1px dashed rgba(255,69,0,0.2);
}

.edit-btn {
  background: none;
  border: none;
  color: #ff4500;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  opacity: 0.5;
  transition: all 0.2s ease;
  border-radius: 4px;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}

.edit-btn svg {
  width: 14px;
  height: 14px;
}

.edit-btn:hover { 
  opacity: 1;
  background: #ff4500;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(255, 69, 0, 0.3);
}

.edit-btn:active {
  transform: scale(0.95);
}

/* Loading state for children */
.tree-children.loading {
  opacity: 0.5;
  pointer-events: none;
}

/* Dark mode optimizations */
@media (prefers-color-scheme: dark) {
  .tree-name {
    color: #e0e0e0;
  }
  
  .tree-name.search-highlight {
    color: #ff4500;
  }
  
  .tree-size {
    background: rgba(255, 255, 255, 0.05);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tree-row {
    padding: 8px 6px;
  }
  
  .tree-icon {
    width: 20px;
    height: 20px;
  }
  
  .tree-icon svg {
    width: 16px;
    height: 16px;
  }
  
  .tree-name {
    font-size: 12px;
  }
  
  .tree-size {
    font-size: 10px;
    padding: 1px 4px;
  }
  
  .tree-children {
    margin-left: 16px;
  }
  
  .tree-children::before {
    left: -8px;
  }
  
  .edit-btn {
    width: 24px;
    height: 24px;
  }
  
  .edit-btn svg {
    width: 12px;
    height: 12px;
  }
}

/* Print styles */
@media print {
  .tree-row {
    background: none !important;
    border: none !important;
  }
  
  .edit-btn {
    display: none;
  }
  
  .tree-arrow {
    display: none;
  }
}
</style>