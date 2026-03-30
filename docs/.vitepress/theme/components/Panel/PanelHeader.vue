<!-- docs\.vitepress\theme\components\Panel\PanelHeader.vue -->
<template>
  <header class="panel-header" :class="{ scrolled: isScrolled }">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
      <h1>{{ currentViewTitle }}</h1>
      <div class="live-indicator">
        <span class="live-pulse"></span>
        <span class="live-text">LIVE</span>
        <span class="live-time">{{ lastUpdate }}</span>
      </div>
    </div>
    
    <div class="header-right">
      <button class="action-btn" @click="$emit('open-issue')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8"/>
          <path d="M8 12h8"/>
        </svg>
        <span class="btn-text">ISSUE</span>
      </button>
      
      <button class="action-btn primary" @click="$emit('open-pr')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="18" cy="18" r="3"/>
          <circle cx="6" cy="6" r="3"/>
          <path d="M6 21V9"/>
          <path d="M18 21V9"/>
        </svg>
        <span class="btn-text">PULL</span>
      </button>
      
      <button class="action-btn" @click="$emit('refresh')" :disabled="isRefreshing">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ spin: isRefreshing }">
          <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9"/>
          <path d="M21 3v6h-6"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PanelHeader',
  
  props: {
    currentView: {
      type: String,
      default: 'dashboard'
    },
    lastUpdate: {
      type: String,
      default: '—'
    },
    isRefreshing: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      isScrolled: false,
      viewTitles: {
        dashboard: 'DASHBOARD',
        files: 'FILE EXPLORER',
        contributors: 'CONTRIBUTORS',
        audit: 'AUDIT LOGS',
        analytics: 'ANALYTICS'
      }
    }
  },
  
  computed: {
    currentViewTitle() {
      return this.viewTitles[this.currentView] || 'DASHBOARD'
    }
  },
  
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 20
    }
  }
}
</script>

<style scoped>
.panel-header {
  --bg-secondary: #0f0f12;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.2);
  --success: #2ecc71;
  --shadow-color: rgba(0, 0, 0, 0.5);
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 12px 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  position: sticky;
  top: 16px;
  z-index: 50;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.panel-header.scrolled {
  box-shadow: 0 8px 24px var(--shadow-color);
  border-color: var(--accent);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.menu-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: rotate(90deg);
}

.header-left h1 {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  font-size: 10px;
  white-space: nowrap;
}

.live-pulse {
  width: 8px;
  height: 8px;
  background: var(--success);
  border-radius: 50%;
  animation: livePulse 1.5s ease infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.live-text {
  color: var(--success);
  font-weight: 600;
}

.live-time {
  color: var(--text-muted);
  font-size: 9px;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.action-btn.primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 4px 12px var(--accent-glow);
}

.action-btn.primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--accent-glow);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: wait;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 700px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-right {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .btn-text {
    display: none;
  }
  
  .live-indicator {
    display: none;
  }
}
</style>