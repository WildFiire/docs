<template>
  <span class="wildfire-tag" :class="tagClass" :style="{ borderColor: tagData.color, boxShadow: `0 0 0 1px ${tagData.color}20` }">
    <span class="tag-dot" :class="dotClass" :style="{ backgroundColor: tagData.color }"></span>
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'gray'
  },
  text: {
    type: String,
    default: ''
  }
})

const colorMap = {
  blue: { class: 'tag-blue', dot: 'dot-blue', color: '#3b82f6' },
  orange: { class: 'tag-orange', dot: 'dot-orange', color: '#ff7800' },
  purple: { class: 'tag-purple', dot: 'dot-purple', color: '#8b5cf6' },
  green: { class: 'tag-green', dot: 'dot-green', color: '#10b981' },
  pink: { class: 'tag-pink', dot: 'dot-pink', color: '#ec4899' },
  red: { class: 'tag-red', dot: 'dot-red', color: '#ef4444' },
  indigo: { class: 'tag-indigo', dot: 'dot-indigo', color: '#6366f1' },
  yellow: { class: 'tag-yellow', dot: 'dot-yellow', color: '#eab308' },
  teal: { class: 'tag-teal', dot: 'dot-teal', color: '#14b8a6' },
  cyan: { class: 'tag-cyan', dot: 'dot-cyan', color: '#06b6d4' },
  fuchsia: { class: 'tag-fuchsia', dot: 'dot-fuchsia', color: '#d946ef' },
  emerald: { class: 'tag-emerald', dot: 'dot-emerald', color: '#10b981' },
  amber: { class: 'tag-amber', dot: 'dot-amber', color: '#f59e0b' },
  gray: { class: 'tag-gray', dot: 'dot-gray', color: '#64748b' }
}

const tagData = computed(() => {
  return colorMap[props.color.toLowerCase()] || colorMap.gray
})

const tagClass = computed(() => tagData.value.class)
const dotClass = computed(() => tagData.value.dot)
</script>

<style scoped>
/* ACCELERARE HARDWARE */
.wildfire-tag,
.tag-dot {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.wildfire-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  line-height: 1.4;
  white-space: nowrap;
  transition: all 0.2s ease;
  border-width: 1px;
  border-style: solid;
}

/* DARK THEME DEFAULT */
.wildfire-tag {
  background: #1a1a1a !important;
  color: #e0e0e0 !important;
}

.dark .wildfire-tag {
  background: #151515 !important;
}

/* LIGHT THEME DEFAULT */
html:not(.dark) .wildfire-tag {
  background: #f5f5f5 !important;
  color: #1a1a1a !important;
}

/* ===== DOT ===== */
.tag-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  transition: all 0.2s ease;
}

/* ===== TEXT COLORAT PENTRU CONTRAST ===== */

/* DARK THEME TEXT */
.tag-blue { color: #60a5fa !important; }
.tag-orange { color: #ff7800 !important; }
.tag-purple { color: #a78bfa !important; }
.tag-green { color: #34d399 !important; }
.tag-pink { color: #f472b6 !important; }
.tag-red { color: #f87171 !important; }
.tag-indigo { color: #818cf8 !important; }
.tag-yellow { color: #fbbf24 !important; }
.tag-teal { color: #2dd4bf !important; }
.tag-cyan { color: #22d3ee !important; }
.tag-fuchsia { color: #e879f9 !important; }
.tag-emerald { color: #34d399 !important; }
.tag-amber { color: #fbbf24 !important; }
.tag-gray { color: #9ca3af !important; }

/* LIGHT THEME TEXT */
html:not(.dark) .tag-blue { color: #2563eb !important; }
html:not(.dark) .tag-orange { color: #ea580c !important; }
html:not(.dark) .tag-purple { color: #7c3aed !important; }
html:not(.dark) .tag-green { color: #059669 !important; }
html:not(.dark) .tag-pink { color: #db2777 !important; }
html:not(.dark) .tag-red { color: #dc2626 !important; }
html:not(.dark) .tag-indigo { color: #4f46e5 !important; }
html:not(.dark) .tag-yellow { color: #ca8a04 !important; }
html:not(.dark) .tag-teal { color: #0d9488 !important; }
html:not(.dark) .tag-cyan { color: #0891b2 !important; }
html:not(.dark) .tag-fuchsia { color: #c026d3 !important; }
html:not(.dark) .tag-emerald { color: #059669 !important; }
html:not(.dark) .tag-amber { color: #d97706 !important; }
html:not(.dark) .tag-gray { color: #4b5563 !important; }

/* ===== HOVER EFFECT ===== */
.wildfire-tag:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.dark .wildfire-tag:hover {
  background: #222 !important;
}

html:not(.dark) .wildfire-tag:hover {
  background: #e5e5e5 !important;
}

/* ===== EFECT GLOW SUBTIL ===== */
.wildfire-tag {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.wildfire-tag:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

.dark .wildfire-tag:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}
</style>