<!-- docs\.vitepress\theme\components\Panel\PanelSidebar.vue -->
<template>
  <aside class="panel-sidebar" :class="{ collapsed: collapsed }">
    <div class="sidebar-brand" @click="$emit('navigate', 'dashboard')">
      <div class="brand-icon">
        <img src="/icons/wildfire.webp" alt="WildFire Logo" width="36" height="36">
        <div class="brand-pulse"></div>
      </div>
      <div class="brand-text" v-if="!collapsed">
        <span class="brand-name">WILDFIRE</span>
        <span class="brand-dot">/</span>
        <span class="brand-version">DASH</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div 
        v-for="item in navItems" 
        :key="item.id" 
        class="nav-item" 
        :class="{ active: currentView === item.id }"
        @click="$emit('navigate', item.id)"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-label" v-if="!collapsed">{{ item.label }}</span>
        <span class="nav-badge" v-if="item.badge && !collapsed">{{ item.badge }}</span>
        <div class="nav-glow"></div>
      </div>
    </nav>

    <div class="sidebar-footer" v-if="!collapsed">
      <div class="user-info">
        <img :src="userAvatar" :alt="userLogin" class="user-avatar">
        <div class="user-details">
          <span class="user-name">{{ userLogin }}</span>
          <span class="user-status">
            <span class="status-dot"></span>
            CONNECTED
          </span>
        </div>
      </div>
      
      <button class="logout-btn" @click="$emit('logout')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>LOGOUT</span>
      </button>
    </div>

    <!-- Toggle button for collapsed mode -->
    <button class="sidebar-toggle" @click="$emit('toggle-collapse')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path v-if="!collapsed" d="M11 19L4 12L11 5"/>
        <path v-else d="M13 5L20 12L13 19"/>
        <path d="M4 12H20"/>
      </svg>
    </button>
  </aside>
</template>

<script>
export default {
  name: 'PanelSidebar',
  
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    currentView: {
      type: String,
      default: 'dashboard'
    },
    userLogin: {
      type: String,
      default: ''
    },
    userAvatar: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      navItems: [
        { 
          id: 'dashboard', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
          label: 'DASHBOARD' 
        },
        { 
          id: 'files', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
          label: 'FILES' 
        },
        { 
          id: 'contributors', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
          label: 'CONTRIBUTORS',
          badge: 'LIVE'
        },
        { 
          id: 'audit', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
          label: 'AUDIT',
          badge: 'LIVE'
        },
        { 
          id: 'analytics', 
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/></svg>',
          label: 'ANALYTICS' 
        }
      ]
    }
  }
}
</script>

<style scoped>
.panel-sidebar {
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --border-color: #1f1f24;
  --text-primary: #ffffff;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.2);
  
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  overflow-x: hidden;
}

.panel-sidebar.collapsed {
  width: 80px;
}

/* Scrollbar */
.panel-sidebar::-webkit-scrollbar {
  width: 4px;
}

.panel-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.panel-sidebar::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 4px;
}

/* Brand */
.sidebar-brand {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.brand-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.brand-icon img {
  filter: drop-shadow(0 0 10px var(--accent-glow));
  transition: filter 0.3s ease;
}

.brand-icon:hover img {
  filter: drop-shadow(0 0 20px var(--accent-glow));
}

.brand-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  animation: brandPulse 2s infinite;
}

@keyframes brandPulse {
  0% { transform: scale(1); opacity: 0.3; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  white-space: nowrap;
}

.brand-name {
  font-size: 16px;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.brand-dot {
  color: var(--accent);
  font-size: 16px;
}

.brand-version {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--accent);
  transform: translateX(4px);
}

.nav-item.active {
  background: var(--accent);
  color: #ffffff;
  box-shadow: 0 4px 12px var(--accent-glow);
}

.nav-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover .nav-glow {
  left: 100%;
}

.nav-badge {
  background: var(--bg-tertiary);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 600;
  margin-left: auto;
  white-space: nowrap;
}

/* Footer */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #2ecc71;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #2ecc71;
  border-radius: 50%;
  animation: statusPulse 1.5s ease infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #e74c3c;
  color: #fff;
  border-color: #e74c3c;
}

/* Toggle Button */
.sidebar-toggle {
  position: absolute;
  bottom: 20px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: var(--accent);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 101;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
}

/* Collapsed state */
.panel-sidebar.collapsed .sidebar-brand {
  justify-content: center;
  padding: 24px 0;
}

.panel-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px;
  margin: 4px 8px;
}

.panel-sidebar.collapsed .sidebar-toggle svg {
  transform: rotate(180deg);
}
</style>