<template>
  <div v-if="tag" class="page-tag-container">
    <div class="page-tag" :class="tagClass">
      <span class="tag-dot" :class="dotClass"></span>
      {{ displayTag }}
      <span v-if="date" class="tag-date">• {{ formatDate(date) }}</span>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter } = useData()

// Sincronizat cu LastUpdates.vue - toate culorile
const categoryMap = {
  'Informații': { class: 'tag-blue', dot: 'dot-blue' },
  'Sisteme': { class: 'tag-orange', dot: 'dot-orange' },
  'Shop': { class: 'tag-purple', dot: 'dot-purple' },
  'Gambling': { class: 'tag-green', dot: 'dot-green' },
  'Evenimente': { class: 'tag-yellow', dot: 'dot-yellow' },
  'General': { class: 'tag-gray', dot: 'dot-gray' }
}

const tag = computed(() => {
  return frontmatter.value.tag || frontmatter.value.category || 'General'
})

const categoryData = computed(() => {
  return categoryMap[tag.value] || categoryMap['General']
})

const displayTag = computed(() => {
  if (frontmatter.value.category) {
    return frontmatter.value.category
  }
  return frontmatter.value.tag || 'General'
})

const tagClass = computed(() => categoryData.value.class)
const dotClass = computed(() => categoryData.value.dot)

const date = computed(() => frontmatter.value.date || frontmatter.value.updated)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split('.').reverse().join('.')
}
</script>

<style scoped>
.page-tag-container {
  margin-top: 6px;
  margin-bottom: 16px;
}

.page-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e0e0e0 !important;
  line-height: 1.4;
  backdrop-filter: blur(2px);
  transition: all 0.2s ease;
}

/* TAG-URI COLORATE - gradienturi mai subtile */
.tag-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
}

.tag-orange {
  background: linear-gradient(135deg, rgba(255, 120, 0, 0.15), rgba(255, 140, 0, 0.15));
}

.tag-purple {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15));
}

.tag-green {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
}

.tag-yellow {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.15));
}

.tag-gray {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.15), rgba(71, 85, 105, 0.15));
}

/* Dots - mai subtile */
.tag-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  display: inline-block;
}

.dot-blue {
  background: #3b82f6;
  box-shadow: 0 0 2px #3b82f6;
}

.dot-orange {
  background: #ff7800;
  box-shadow: 0 0 2px #ff7800;
}

.dot-purple {
  background: #8b5cf6;
  box-shadow: 0 0 2px #8b5cf6;
}

.dot-green {
  background: #10b981;
  box-shadow: 0 0 2px #10b981;
}

.dot-yellow {
  background: #eab308;
  box-shadow: 0 0 2px #eab308;
}

.dot-gray {
  background: #64748b;
  box-shadow: 0 0 2px #64748b;
}

.tag-date {
  font-size: 9px;
  font-weight: 400;
  text-transform: none;
  opacity: 0.7;
  color: #aaa;
  margin-left: 2px;
}

/* Hover efect subtil */
.page-tag:hover {
  border-color: currentColor;
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.02);
}
</style>