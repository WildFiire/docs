<template>
  <div v-if="tag || statusData" class="page-tag-container">
    <div class="page-tag-row">
      <div v-if="tag" class="page-tag" :class="tagClass">
        <span class="tag-dot" :class="dotClass"></span>
        {{ displayTag }}
        <span v-if="date" class="tag-date">• {{ formatDate(date) }}</span>
      </div>
      <div v-if="statusData" class="page-tag status-tag" :class="statusData.tagClass">
        <span class="status-icon" v-html="statusData.icon"></span>
        {{ statusData.label }}
      </div>
    </div>

    <div v-if="statusData?.notice" class="status-notice" :class="statusData.noticeClass">
      <span class="notice-icon" v-html="statusData.noticeIcon"></span>
      <span v-html="statusData.notice"></span>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter } = useData()

// Sincronizat cu LastUpdates.vue - toate culorile
const categoryMap = {
  'Informatii': { class: 'tag-blue', dot: 'dot-blue' },
  'Sisteme':    { class: 'tag-orange', dot: 'dot-orange' },
  'Shop':       { class: 'tag-purple', dot: 'dot-purple' },
  'Gambling':   { class: 'tag-green', dot: 'dot-green' },
  'Evenimente': { class: 'tag-yellow', dot: 'dot-yellow' },
  'General':    { class: 'tag-gray', dot: 'dot-gray' }
}

const statusMap = {
  draft: {
    tagClass: 'status-draft',
    label: 'CIORNĂ',
    icon: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    noticeClass: 'notice-draft',
    noticeIcon: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    notice: 'Aceasta pagina este in faza de <strong>ciorna</strong> — continutul poate fi incomplet sau inexact.'
  },
  outdated: {
    tagClass: 'status-outdated',
    label: 'INVECHIT',
    icon: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    noticeClass: 'notice-outdated',
    noticeIcon: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    notice: 'Aceasta pagina ar putea fi <strong>depasita</strong> — informatia s-ar putea sa nu mai reflecte versiunea curenta a platformei.'
  },
  verified: {
    tagClass: 'status-verified',
    label: 'VERIFICAT',
    icon: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    noticeClass: null,
    noticeIcon: null,
    notice: null
  },
  wip: {
    tagClass: 'status-wip',
    label: 'IN LUCRU',
    icon: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    noticeClass: 'notice-wip',
    noticeIcon: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    notice: 'Aceasta pagina este <strong>in lucru</strong> — sectiunile pot fi incomplete sau supuse modificarilor.'
  }
}

const tag = computed(() => {
  return frontmatter.value.tag || frontmatter.value.category || null
})

const categoryData = computed(() => {
  return categoryMap[tag.value] || categoryMap['General']
})

const displayTag = computed(() => {
  if (frontmatter.value.category) return frontmatter.value.category
  return frontmatter.value.tag || ''
})

const tagClass = computed(() => categoryData.value.class)
const dotClass = computed(() => categoryData.value.dot)

const statusData = computed(() => {
  const s = frontmatter.value.status
  if (!s) return null
  return statusMap[s.toLowerCase()] ?? null
})

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

.page-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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
.tag-blue   { background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15)); }
.tag-orange { background: linear-gradient(135deg, rgba(255, 120, 0, 0.15), rgba(255, 140, 0, 0.15)); }
.tag-purple { background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15)); }
.tag-green  { background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15)); }
.tag-yellow { background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.15)); }
.tag-gray   { background: linear-gradient(135deg, rgba(100, 116, 139, 0.15), rgba(71, 85, 105, 0.15)); }

/* STATUS TAGS */
.status-tag { gap: 5px; }

.status-draft {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.12));
  border-color: rgba(245, 158, 11, 0.3) !important;
  color: #fbbf24 !important;
}
html:not(.dark) .status-draft { color: #d97706 !important; }

.status-outdated {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.12));
  border-color: rgba(239, 68, 68, 0.3) !important;
  color: #f87171 !important;
}
html:not(.dark) .status-outdated { color: #dc2626 !important; }

.status-verified {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.12));
  border-color: rgba(16, 185, 129, 0.3) !important;
  color: #34d399 !important;
}
html:not(.dark) .status-verified { color: #059669 !important; }

.status-wip {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(234, 88, 12, 0.12));
  border-color: rgba(249, 115, 22, 0.3) !important;
  color: #fb923c !important;
}
html:not(.dark) .status-wip { color: #ea580c !important; }

.status-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.status-icon :deep(svg) { display: block; }

/* Dots - mai subtile */
.tag-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  display: inline-block;
}

.dot-blue   { background: #3b82f6; box-shadow: 0 0 2px #3b82f6; }
.dot-orange { background: #ff7800; box-shadow: 0 0 2px #ff7800; }
.dot-purple { background: #8b5cf6; box-shadow: 0 0 2px #8b5cf6; }
.dot-green  { background: #10b981; box-shadow: 0 0 2px #10b981; }
.dot-yellow { background: #eab308; box-shadow: 0 0 2px #eab308; }
.dot-gray   { background: #64748b; box-shadow: 0 0 2px #64748b; }

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

/* ===== STATUS NOTICE BANNERS ===== */
.status-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid;
  margin-top: 10px;
}

.notice-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.notice-icon :deep(svg) { display: block; }

.notice-draft {
  background: rgba(245, 158, 11, 0.06);
  border-color: rgba(245, 158, 11, 0.25);
  color: #92400e;
}
.dark .notice-draft {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.3);
  color: #fde68a;
}
.notice-draft .notice-icon { color: #f59e0b; }
html:not(.dark) .notice-draft .notice-icon { color: #d97706; }

.notice-outdated {
  background: rgba(239, 68, 68, 0.06);
  border-color: rgba(239, 68, 68, 0.25);
  color: #7f1d1d;
}
.dark .notice-outdated {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fecaca;
}
.notice-outdated .notice-icon { color: #ef4444; }
html:not(.dark) .notice-outdated .notice-icon { color: #dc2626; }

.notice-wip {
  background: rgba(249, 115, 22, 0.06);
  border-color: rgba(249, 115, 22, 0.25);
  color: #7c2d12;
}
.dark .notice-wip {
  background: rgba(249, 115, 22, 0.08);
  border-color: rgba(249, 115, 22, 0.3);
  color: #fed7aa;
}
.notice-wip .notice-icon { color: #f97316; }
html:not(.dark) .notice-wip .notice-icon { color: #ea580c; }

.status-notice :deep(strong) { font-weight: 700; }
</style>