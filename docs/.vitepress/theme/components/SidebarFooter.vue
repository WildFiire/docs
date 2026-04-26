<template>
  <div class="wf-sidebar-footer">
    <div class="wf-footer-socials">
      <a href="https://github.com/WildFiire/docs" target="_blank" rel="noopener noreferrer" class="wf-footer-link" aria-label="GitHub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wf-footer-icon">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
      <a href="https://discord.gg/wildfire" target="_blank" rel="noopener noreferrer" class="wf-footer-link" aria-label="Discord">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wf-footer-icon">
          <path d="M21 9c-3-2-6-2-6-2s-.5 1-1 1c-3-1-4-1-4-1s-.5-1-1-1-3 0-6 2c-3 5-3 10-3 10s2 3 6 3c1 0 2-1 2-1s1-1 1-1c-2-1-3-2-3-2s0 0 1-1c3 2 7 2 10 0 1 1 1 1 1 1s-1 1-3 2c0 0 1 1 2 1 4 0 6-3 6-3s0-5-3-10z"/><circle cx="8" cy="13" r="1.5"/><circle cx="16" cy="13" r="1.5"/>
        </svg>
      </a>
      <a href="https://tiktok.com/@wildfire.ro" target="_blank" rel="noopener noreferrer" class="wf-footer-link" aria-label="TikTok">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wf-footer-icon">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
        </svg>
      </a>
    </div>

    <button class="wf-theme-pill" @click="toggleTheme" :class="{ 'is-dark': isDark }" aria-label="Toggle Theme">
      <div class="wf-theme-pill-slider"></div>
      <div class="wf-theme-pill-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wf-theme-icon">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </div>
      <div class="wf-theme-pill-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wf-theme-icon">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
const { isDark } = useData()

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>

<style scoped>
.wf-sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px;
  padding: 8px 12px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-top: auto;
}

.wf-footer-socials {
  display: flex;
  gap: 8px;
  align-items: center;
}

.wf-footer-link {
  color: var(--vp-c-text-2);
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.wf-footer-link:hover {
  color: var(--vp-c-text-1);
}

.wf-footer-icon {
  width: 18px;
  height: 18px;
}

.wf-theme-pill {
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border-radius: 12px;
  padding: 2px;
  width: 52px;
  height: 28px;
  cursor: pointer;
  border: none;
}

.wf-theme-pill-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.wf-theme-pill.is-dark .wf-theme-pill-slider {
  transform: translateX(24px);
}

.wf-theme-pill-icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--vp-c-text-2);
}

.wf-theme-pill.is-dark .wf-theme-pill-icon-wrapper:first-of-type {
  color: var(--vp-c-text-3);
}
.wf-theme-pill:not(.is-dark) .wf-theme-pill-icon-wrapper:last-of-type {
  color: var(--vp-c-text-3);
}

.wf-theme-pill.is-dark .wf-theme-pill-icon-wrapper:last-of-type {
  color: var(--vp-c-text-1);
}
.wf-theme-pill:not(.is-dark) .wf-theme-pill-icon-wrapper:first-of-type {
  color: var(--vp-c-text-1);
}

.wf-theme-icon {
  width: 14px;
  height: 14px;
}
</style>
