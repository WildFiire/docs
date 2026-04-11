<template>
  <button v-if="!isHomePage" class="nav-search-button" @click.prevent.stop="openSearch" type="button">
    <img src="/icons/searchbutton.svg" class="nav-icon" alt="search">
    <span class="nav-search-text">Caută...</span>
    <span class="nav-search-shortcut"><kbd>Ctrl</kbd><kbd>K</kbd></span>
  </button>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

const isHomePage = computed(() => {
  return page.value.relativePath === 'index.md'
})

const openSearch = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  const searchButton = document.querySelector('.VPNavBarSearch button')
  if (searchButton) {
    ;(searchButton as HTMLElement).click()
    return
  }
  
  const event = new KeyboardEvent('keydown', {
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    bubbles: true,
    cancelable: true
  })
  window.dispatchEvent(event)
}
</script>

<style scoped>
.nav-search-button {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 11px 0 13px;
  height: 38px;
  width: calc(100% - 8px);
  margin: 14px 4px 6px;
  cursor: pointer;
  font-family: inherit;
  outline: none;
  position: relative;
  overflow: hidden;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.nav-search-button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 2px;
  border-radius: 0 2px 2px 0;
  background: #ff7800;
  opacity: 0.55;
  transition: opacity 0.18s ease, top 0.18s ease, bottom 0.18s ease;
}

.nav-search-button:hover {
  border-color: rgba(255, 120, 0, 0.4);
  background: rgba(255, 120, 0, 0.03);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(255, 120, 0, 0.07);
}

.nav-search-button:hover::before {
  opacity: 1;
  top: 10%;
  bottom: 10%;
}

.nav-icon {
  width: 14px;
  height: 14px;
  margin-right: 9px;
  flex-shrink: 0;
  opacity: 0.3;
  transition: opacity 0.18s ease, filter 0.18s ease;
}

.nav-search-button:hover .nav-icon {
  opacity: 0.65;
  filter: invert(40%) sepia(80%) saturate(900%) hue-rotate(5deg) brightness(110%);
}

.nav-search-text {
  flex: 1;
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.18s ease;
}

.nav-search-button:hover .nav-search-text {
  color: var(--vp-c-text-2);
}

.nav-search-shortcut {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 8px;
  flex-shrink: 0;
}

.nav-search-shortcut kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  font-family: ui-monospace, monospace;
  padding: 2px 6px 3px;
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);
  letter-spacing: 0.03em;
  line-height: 1;
  white-space: nowrap;
  transition: color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.nav-search-button:hover .nav-search-shortcut kbd {
  color: #ff7800;
  border-color: rgba(255, 120, 0, 0.3);
  box-shadow: 0 2px 0 rgba(255, 120, 0, 0.2);
  background: rgba(255, 120, 0, 0.04);
}

/* DARK */
.dark .nav-search-button {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-divider);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.dark .nav-search-button:hover {
  border-color: rgba(255, 120, 0, 0.38);
  background: rgba(255, 120, 0, 0.04);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(255, 120, 0, 0.07);
}

.dark .nav-search-shortcut kbd {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
}
</style>