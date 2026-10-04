<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { layout, setLayout, toggleSidebar, toggleToc } from '../../composables/useLayout';

type LayoutMode = 'standard' | 'focus' | 'full';

function handleSetMode(mode: LayoutMode) {
  setLayout(mode);
}
</script>

<template>
  <div class="layout-controls-wrapper" aria-label="Layout position options">
    <!-- 3 Layout Mode Segmented Control: Standard -> Full -> Focus -->
    <div class="layout-mode-group" role="radiogroup" aria-label="Page layout modes">
      <button
        type="button"
        role="radio"
        :aria-checked="layout.mode === 'standard'"
        class="layout-btn"
        :class="{ 'layout-btn--active': layout.mode === 'standard' }"
        title="Standard Layout: Sidebar + Centered Content + Right TOC (Press [ to toggle sidebar)"
        @click="handleSetMode('standard')"
      >
        <Icon icon="lucide:columns-3" width="13" aria-hidden="true" />
        <span class="layout-btn-label">Standard</span>
      </button>

      <button
        type="button"
        role="radio"
        :aria-checked="layout.mode === 'full'"
        class="layout-btn"
        :class="{ 'layout-btn--active': layout.mode === 'full' }"
        title="Full Reading Mode: Max Width Content"
        @click="handleSetMode('full')"
      >
        <Icon icon="lucide:square" width="12" aria-hidden="true" />
        <span class="layout-btn-label">Full</span>
      </button>

      <button
        type="button"
        role="radio"
        :aria-checked="layout.mode === 'focus'"
        class="layout-btn"
        :class="{ 'layout-btn--active': layout.mode === 'focus' }"
        title="Focus Mode: Collapsed Sidebar + Centered Content + Right TOC"
        @click="handleSetMode('focus')"
      >
        <Icon icon="lucide:columns-2" width="13" aria-hidden="true" />
        <span class="layout-btn-label">Focus</span>
      </button>
    </div>

    <!-- Quick individual sidebar & TOC toggle buttons -->
    <div class="layout-quick-toggles">
      <button
        type="button"
        class="layout-toggle-btn"
        :class="{ 'layout-toggle-btn--active': layout.sidebarOpen }"
        :title="layout.sidebarOpen ? 'Collapse Left Sidebar (Shortcut: [)' : 'Expand Left Sidebar (Shortcut: [)'"
        :aria-label="layout.sidebarOpen ? 'Collapse left sidebar' : 'Expand left sidebar'"
        @click="toggleSidebar"
      >
        <Icon icon="lucide:panel-left" width="15" />
      </button>

      <button
        type="button"
        class="layout-toggle-btn"
        :class="{ 'layout-toggle-btn--active': layout.tocOpen }"
        :title="layout.tocOpen ? 'Collapse Right TOC (Shortcut: ])' : 'Expand Right TOC (Shortcut: ])'"
        :aria-label="layout.tocOpen ? 'Collapse right table of contents' : 'Expand right table of contents'"
        @click="toggleToc"
      >
        <Icon icon="lucide:panel-right" width="15" />
      </button>
    </div>
  </div>
</template>
