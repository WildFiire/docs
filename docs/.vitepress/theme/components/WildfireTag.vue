<template>
  <span class="wildfire-tag" :class="tagClass" :style="{ borderColor: `${tagData.color}40` }">
    <span v-if="!icon" class="tag-dot" :class="dotClass" :style="{ backgroundColor: tagData.color }"></span>
    <span v-if="icon" class="tag-icon" v-html="icon" :style="{ color: tagData.color }"></span>
    <span class="tag-text"><slot>{{ text }}</slot></span>
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
  },
  icon: {
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
  gap: 8px;
  padding: 3px 12px 3px 10px;
  /* Sci-Fi / Cyberpunk Shape: top-left & bottom-right sharp, others rounded */
  border-radius: 2px 10px 2px 10px;
  font-size: 10px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  line-height: 1.4;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-width: 1px;
  border-style: solid;
  position: relative;
  overflow: hidden;
}

.tag-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* DARK THEME DEFAULT */
.wildfire-tag {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.7) 0%, rgba(15, 15, 15, 0.9) 100%) !important;
  color: #e0e0e0 !important;
}

.dark .wildfire-tag {
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(5, 5, 5, 0.95) 100%) !important;
}

/* LIGHT THEME DEFAULT */
html:not(.dark) .wildfire-tag {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 245, 245, 0.95) 100%) !important;
  color: #1a1a1a !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
}

/* ===== DOT ===== */
.tag-dot {
  width: 5px;
  height: 5px;
  border-radius: 1px; /* Slight rounding for diamond */
  transform: rotate(45deg);
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.9;
}

/* ===== TEXT COLORAT PENTRU CONTRAST ===== */

.tag-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}
.tag-icon :deep(svg) {
  width: 11px;
  height: 11px;
}

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
  filter: brightness(1.15);
}

.dark .wildfire-tag:hover {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%) !important;
}

html:not(.dark) .wildfire-tag:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 1) 100%) !important;
}

.wildfire-tag:hover .tag-dot {
  transform: rotate(135deg) scale(1.2);
  opacity: 1;
}

/* ===== EFECT GLOW SUBTIL ===== */
.wildfire-tag:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.dark .wildfire-tag:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
}
</style>