<template>
  <button v-if="!isHomePage" class="nav-search-button" @click.prevent.stop="openSearch" type="button">
    <img src="/icons/searchbutton.svg" class="nav-icon" alt="search">
    <span class="nav-search-text">Caută...</span>
    <span class="nav-search-shortcut">Ctrl K</span>
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
  border-radius: 10px;
  padding: 0 14px;
  height: 42px;
  width: calc(100% - 8px);
  margin: 16px 4px 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  outline: none;

  /* LIGHT */
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.nav-search-button:hover {
  border-color: #ff4500;
  background: #efefef;
  box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.1);
}

.nav-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  flex-shrink: 0;
  filter: brightness(0) invert(0.4);
  transition: filter 0.2s ease;
}

.nav-search-button:hover .nav-icon {
  filter: brightness(0) saturate(100%) invert(35%) sepia(90%) saturate(800%) hue-rotate(5deg) brightness(110%);
}

.nav-search-text {
  flex: 1;
  color: #999;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-search-button:hover .nav-search-text {
  color: #ff4500;
}

.nav-search-shortcut {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  margin-left: 8px;
  background: #e8e8e8;
  color: #888;
  border: 1px solid #ddd;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.nav-search-button:hover .nav-search-shortcut {
  background: #ff4500;
  color: #ffffff;
  border-color: #ff4500;
}

/* DARK */
.dark .nav-search-button {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
}

.dark .nav-search-button:hover {
  background: #111111;
  border-color: #ff4500;
  box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.12);
}

.dark .nav-icon {
  filter: brightness(0) invert(0.5);
}

.dark .nav-search-button:hover .nav-icon {
  filter: brightness(0) saturate(100%) invert(55%) sepia(90%) saturate(800%) hue-rotate(5deg) brightness(120%);
}

.dark .nav-search-text {
  color: #666;
}

.dark .nav-search-button:hover .nav-search-text {
  color: #ff4500;
}

.dark .nav-search-shortcut {
  background: #1a1a1a;
  color: #555;
  border: 1px solid #333;
}

.dark .nav-search-button:hover .nav-search-shortcut {
  background: #ff4500;
  color: #ffffff;
  border-color: #ff4500;
}


</style>