<template>
  <aside class="ps-root" :class="{ collapsed, 'ps-light': isLightTheme }">

    <div class="ps-rail" aria-hidden="true"></div>

    <!-- HEADER -->
    <div class="ps-header" :class="{ slim: collapsed }">
      <div class="ps-brand" @click="$emit('navigate','dashboard')">
        <div class="ps-logo-wrap">
          <slot name="logo">
            <img src="/icons/wildfire.webp" alt="WildFire" width="72" height="72">
          </slot>
        </div>
        <div class="ps-brand-text" v-show="!collapsed">
          <span class="ps-brand-name">
            <span class="ps-brand-wf">{{ brandName1 }}</span><span class="ps-brand-fire">{{ brandName2 }}</span>
          </span>
          <span class="ps-brand-tag">{{ brandSub }}</span>
        </div>
      </div>
      
      <!-- Top Collapse Toggle -->
      <button class="ps-collapse-top" @click="$emit('action', 'toggle-collapse')" :title="collapsed ? 'Expand' : 'Collapse'">
        <Icon v-if="collapsed" icon="solar:hamburger-menu-linear" width="18" height="18" />
        <Icon v-else icon="solar:sidebar-minimalistic-line-duotone" width="18" height="18" />
      </button>
    </div>

    <!-- NAV -->
    <nav class="ps-nav" data-lenis-prevent>
      <template v-for="group in activeNavGroups" :key="group.label">
        <!-- Group label -->
        <div class="ps-group-label" v-show="!collapsed">
          <span class="ps-gl-line" aria-hidden="true"></span>
          <span class="ps-gl-text">{{ group.label }}</span>
          <span class="ps-gl-line" aria-hidden="true"></span>
        </div>
        <div class="ps-gl-dot" v-show="collapsed" aria-hidden="true"></div>

        <!-- Items -->
        <component
          :is="item.link ? 'a' : 'button'"
          v-for="item in group.items"
          :key="item.id"
          class="ps-item"
          :class="{ active: currentView === item.id, 'ps-item-profile': item.id === 'profile' }"
          :title="item.label"
          :href="item.link"
          @click="item.link ? null : $emit('navigate', item.id)"
        >
          <span class="ps-track" aria-hidden="true"></span>
          <span class="ps-fill"  aria-hidden="true"></span>
          <!-- Profile item: show real avatar -->
          <span v-if="item.id === 'profile'" class="ps-icon ps-icon-av">
            <img :src="userAvatar" :alt="userLogin" class="ps-nav-av">
          </span>
          <span v-else class="ps-icon" v-html="item.icon"></span>
          <span class="ps-label" v-show="!collapsed">{{ item.label }}</span>
          <span
            v-if="item.badge && !collapsed"
            class="ps-badge"
            :class="item.badge === 'NEW' ? 'badge-new' : 'badge-live'"
          >{{ item.badge }}</span>
        </component>
      </template>
    </nav>

    <!-- FOOTER (PRO) -->
    <div class="ps-footer">
      
      <!-- User identity card (Pro styling) -->
      <div class="ps-user-card-wrap" :class="{ slim: collapsed }" v-if="userLogin">
        <div class="ps-user" :class="{ slim: collapsed }" @click="$emit('navigate','profile')">
          <div class="ps-av-wrap" :title="userLogin">
            <div class="ps-av-ring"></div>
              <img :src="userAvatar" :alt="userLogin" class="ps-av">
            </div>
            <div class="ps-user-info" v-show="!collapsed" :title="userLogin">
              <span class="ps-uname">{{ userLogin }}</span>
              <div class="ps-role-badge">
                <span class="ps-urole">MEMBER</span>
              </div>
            </div>
        </div>
      </div>

      <!-- Quick Actions Dock (Pro styling) -->
      <div class="ps-actions-wrap" v-show="!collapsed">
        <div class="ps-actions-slot">
          <button class="ps-act-btn" @click="$emit('action', 'issue')" title="New Issue">
            <Icon icon="solar:info-circle-linear" width="16" height="16" />
          </button>
          <div class="ps-act-divider"></div>
          <button class="ps-act-btn" @click="$emit('action', 'refresh')" title="Refresh Data">
            <Icon icon="solar:refresh-circle-linear" width="16" height="16" />
          </button>
          <div class="ps-act-divider"></div>
          <button class="ps-act-btn" @click="$emit('action', 'theme')" title="Toggle Theme">
            <svg v-if="isLightTheme" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          
          <div class="ps-act-divider"></div>
          <button class="ps-act-btn ps-act-danger" @click.stop="$emit('logout')" title="Logout">
            <Icon icon="solar:logout-2-linear" width="18" height="18" />
          </button>
        </div>
      </div>
      
      <!-- Return to Docs button -->
      <a href="/" class="ps-back" :class="{ slim: collapsed }" title="Return to Docs">
        <Icon icon="solar:double-alt-arrow-left-line-duotone" width="16" height="16" />
        <span v-show="!collapsed">Return to Docs</span>
      </a>

    </div>

  </aside>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'PanelSidebar',
  components: { Icon },
  emits: ['navigate', 'logout', 'action'],
  props: {
    collapsed:    { type: Boolean, default: false },
    currentView:  { type: String,  default: 'dashboard' },
    userLogin:    { type: String,  default: '' },
    userAvatar:   { type: String,  default: '' },
    isLightTheme: { type: Boolean, default: false },
    customNavGroups: { type: Array, default: null },
    brandName1:   { type: String, default: 'WILD' },
    brandName2:   { type: String, default: 'FIRE' },
    brandSub:     { type: String, default: 'DASHBOARD' },
  },
  computed: {
    activeNavGroups() {
      return this.customNavGroups || this.navGroups;
    }
  },
  data() {
    return {
      navGroups: [
        {
          label: 'Overview',
          items: [
            {
              id: 'dashboard', label: 'Dashboard', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="7" height="9" rx="1.5"/>
                <rect x="14" y="3" width="7" height="5" rx="1.5"/>
                <rect x="14" y="12" width="7" height="9" rx="1.5"/>
                <rect x="3" y="16" width="7" height="5" rx="1.5"/>
              </svg>`
            },
            {
              id: 'system-status', label: 'System Status', badge: 'LIVE',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>`
            },
          ]
        },
        {
          label: 'Content',
          items: [
            {
              id: 'files', label: 'File Explorer', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>`
            },
            {
              id: 'studio', label: 'Phoenix Studio', badge: 'NEW',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>`
            },
            {
              id: 'seo-manager', label: 'SEO Manager', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>`
            },
            {
              id: 'media-library', label: 'Media Library', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>`
            },
            {
              id: 'storage-health', label: 'Storage Health', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>`
            },
          ]
        },
        {
          label: 'Community',
          items: [
            {
              id: 'contributors', label: 'Contributors', badge: 'LIVE',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>`
            },
            {
              id: 'feedbacks', label: 'Feedbacks', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>`
            },
            {
              id: 'updates', label: 'Docs Updates', badge: 'NEW',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>`
            },
          ]
        },
        {
          label: 'Monitoring',
          items: [
            {
              id: 'monitor', label: 'System Monitor', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>`
            },
            {
              id: 'decay', label: 'Content Decay', badge: 'NEW',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>`
            },
            {
              id: 'audit', label: 'Audit Log', badge: 'LIVE',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>`
            },
          ]
        },
        {
          label: 'Account',
          items: [
            {
              id: 'profile', label: 'My Profile', badge: '',
              icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>`
            },
          ]
        },
      ]
    }
  }
}
</script>

<style scoped>
/* ── TOKENS ── */
.ps-root {
  --ac:      #ff7800;
  --ac-lo:   rgba(255,120,0,0.10);
  --ac-mid:  rgba(255,120,0,0.22);
  --ac-hi:   rgba(255,120,0,0.42);
  --ac-glow: 0 0 20px rgba(255,120,0,0.38);
  --txt:     #eeeef8;
  --txt-m:   #60607c;
  --txt-s:   #8888a4;
  --bg:      rgba(7,7,14,0.84);
  --border:  rgba(255,255,255,0.052);
  --W:       262px;
  --Wc:      68px;
  --ease:    cubic-bezier(0.34,1.56,0.64,1);
  --dur:     0.36s;
}

/* ── SHELL ── */
.ps-root {
  width: var(--W);
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 20;
  overflow-x: hidden;
  overflow-y: hidden;
  isolation: isolate;
  background: var(--bg);
  color: var(--txt);
  border-right: 1px solid var(--border);
  box-shadow: 4px 0 48px rgba(0,0,0,0.6);
  transition: width var(--dur) var(--ease);
  will-change: width;
}
.ps-root.collapsed { width: var(--Wc); }
.ps-root::-webkit-scrollbar { display: none; }

/* ── RAIL LINE ── */
.ps-rail {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--ac-mid) 18%,
    var(--ac-hi) 50%,
    var(--ac-mid) 82%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* ── HEADER & BRAND ── */
.ps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px;
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.ps-root.ps-light .ps-header {
  border-bottom-color: rgba(0,0,0,0.07);
}
.ps-header.slim {
  flex-direction: column;
  padding: 16px 0;
  gap: 16px;
  justify-content: center;
}

.ps-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
  flex: 1;
  min-width: 0;
  border-radius: 12px;
  padding: 4px;
  margin: -4px;
  transition: background 0.18s;
}
.ps-brand:hover { background: rgba(255,255,255,0.025); }
.ps-root.ps-light .ps-brand:hover { background: rgba(0,0,0,0.018); }

.ps-root.collapsed .ps-brand {
  display: flex;
  justify-content: center;
}

.ps-collapse-top {
  background: transparent;
  border: none;
  color: var(--txt-m);
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.ps-collapse-top:hover {
  background: rgba(255,255,255,0.05);
  color: var(--txt);
}
.ps-root.ps-light .ps-collapse-top:hover {
  background: rgba(0,0,0,0.05);
  color: #000;
}

/* Logo box — sharp, minimal */
.ps-logo-wrap {
  width: 40px; height: 40px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,120,0,0.22);
  background: rgba(255,120,0,0.06);
  flex-shrink: 0;
  transition: border-color 0.2s, background 0.2s;
}
.ps-brand:hover .ps-logo-wrap {
  border-color: rgba(255,120,0,0.4);
  background: rgba(255,120,0,0.1);
}
.ps-logo-wrap img { width: 30px; height: 30px; object-fit: contain; display: block; }

/* Brand text */
.ps-brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  min-width: 0;
}
.ps-brand-name {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
  display: block;
}
.ps-brand-wf   { color: var(--txt); }
.ps-brand-fire { color: var(--ac); }

.ps-brand-tag {
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--txt-m);
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  opacity: 0.55;
}

/* ── NAV ── */
.ps-nav {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 6px 0 6px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
}
.ps-nav::-webkit-scrollbar { display: none; }

/* GROUP LABEL */
.ps-group-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px 5px;
  pointer-events: none;
  user-select: none;
}
.ps-gl-text {
  font-size: 8px; font-weight: 800;
  letter-spacing: 2.8px; color: var(--txt-m);
  text-transform: uppercase; font-family: 'Inter', sans-serif;
  opacity: 0.55; white-space: nowrap; flex-shrink: 0;
}
.ps-gl-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, var(--border));
}
.ps-gl-line:first-child {
  background: linear-gradient(90deg, var(--border), transparent);
  max-width: 8px; flex: 0 0 8px;
}

/* collapsed group separator dot */
.ps-gl-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--ac-mid);
  margin: 10px auto 4px;
  flex-shrink: 0;
}

/* NAV ITEM */
.ps-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 13px;
  margin: 1.5px 8px;
  min-height: 38px;
  height: auto;
  border-radius: 11px;
  cursor: pointer;
  color: var(--txt-m);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  background: transparent;
  width: calc(100% - 16px);
  text-align: left;
  font-family: 'Inter', sans-serif;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.28s var(--ease);
  will-change: transform;
}

.ps-track {
  position: absolute;
  left: 0; top: 22%; bottom: 22%;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #ffb347, #ff4400);
  opacity: 0;
  transform: scaleY(0.3);
  transform-origin: center;
  transition: opacity 0.22s, transform 0.3s var(--ease);
  pointer-events: none;
}
.ps-fill {
  position: absolute;
  inset: 0; border-radius: inherit;
  background: rgba(255,255,255,0.05);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.ps-item:hover { color: var(--txt); border-color: rgba(255,255,255,0.09); transform: translateX(4px); }
.ps-item:hover .ps-fill { opacity: 1; }
.ps-item:hover .ps-icon { opacity: 1; transform: scale(1.08); }

.ps-item.active {
  color: var(--ac);
  border-color: rgba(255,120,0,0.18);
  transform: translateX(0) !important;
  background: linear-gradient(115deg, rgba(255,120,0,0.12) 0%, rgba(255,80,0,0.05) 55%, transparent 100%);
  /* glow removed */
}
.ps-item.active .ps-track { opacity: 1; transform: scaleY(1); }
.ps-item.active .ps-fill  { opacity: 0; }

.ps-icon {
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; opacity: 0.48;
  transition: opacity 0.2s, transform 0.22s var(--ease), filter 0.2s;
  position: relative; z-index: 1;
}
.ps-item.active .ps-icon {
  opacity: 1;
  /* glow removed */
}

.ps-label {
  flex: 1; white-space: nowrap; overflow: hidden;
  position: relative; z-index: 1;
}

.ps-badge {
  font-size: 7px; font-weight: 800; letter-spacing: 0.7px;
  padding: 2px 7px; border-radius: 20px;
  flex-shrink: 0; position: relative; z-index: 1;
}
.badge-live { color: #22c55e; border: 1px solid rgba(34,197,94,0.28); background: rgba(34,197,94,0.08); }
.badge-new  { color: #a78bfa; border: 1px solid rgba(167,139,250,0.28); background: rgba(167,139,250,0.08); }

/* collapsed nav */
.ps-root.collapsed .ps-item {
  justify-content: center; padding: 0;
  width: calc(100% - 16px); transform: none !important;
}
.ps-root.collapsed .ps-item:hover { transform: scale(1.1) !important; }
.ps-root.collapsed .ps-item.active { transform: none !important; }
.ps-root.collapsed .ps-item.active .ps-track { display: none; }

/* Profile item avatar in nav */
.ps-icon-av {
  position: relative;
  width: 20px; height: 20px;
  flex-shrink: 0;
  opacity: 1 !important;
}
.ps-nav-av {
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,120,0,0.4);
  object-fit: cover;
  display: block;
  transition: border-color 0.2s;
}
.ps-item.active .ps-nav-av,
.ps-item:hover  .ps-nav-av {
  border-color: var(--ac);
}

/* ── PRO FOOTER STYLES ── */
.ps-footer {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  padding: 20px 14px 14px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.18));
}
.ps-footer::before {
  content: '';
  position: absolute;
  top: 0; left: 14px; right: 14px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
}
.ps-root.ps-light .ps-footer {
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.02));
}
.ps-root.ps-light .ps-footer::before {
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
}

.ps-user-card-wrap {
  margin-bottom: 12px;
}
.ps-user-card-wrap.slim {
  margin-bottom: 0;
}

.ps-user {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.04);
  position: relative;
  overflow: hidden;
}
.ps-user::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(255,120,0,0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.ps-user:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 120, 0, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,120,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08);
}
.ps-user:hover::after { opacity: 1; }

.ps-user.slim {
  padding: 12px;
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
.ps-user.slim:hover {
  transform: scale(1.05);
}

.ps-root.ps-light .ps-user {
  background: #ffffff;
  border-color: rgba(0,0,0,0.06);
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.ps-root.ps-light .ps-user:hover {
  background: #ffffff;
  border-color: rgba(255,120,0,0.3);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.ps-av-wrap {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px; height: 38px;
}
.ps-av-ring {
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff7800, #ff2200);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 0;
}
.ps-user:hover .ps-av-ring { opacity: 1; }

.ps-av {
  width: 100%; height: 100%;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  object-fit: cover;
  position: relative;
  z-index: 2;
  background: var(--bg);
}
.ps-root.ps-light .ps-av { border-color: rgba(0,0,0,0.1); }

.ps-user-info {
  display: flex; flex-direction: column;
  gap: 4px; min-width: 0; flex: 1;
  position: relative; z-index: 2;
}
.ps-uname {
  font-size: 13px; font-weight: 700;
  color: var(--txt);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.2px;
  line-height: 1;
}

.ps-role-badge {
  background: linear-gradient(90deg, rgba(255,120,0,0.15), rgba(255,40,0,0.05));
  border: 1px solid rgba(255,120,0,0.2);
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
}

.ps-urole {
  font-size: 8.5px; font-weight: 800;
  color: var(--ac); letter-spacing: 1px;
  text-transform: uppercase;
  line-height: 1;
  font-family: 'Orbitron', sans-serif;
}

.ps-actions-wrap {
  margin-bottom: 8px;
}
.ps-actions-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
.ps-root.ps-light .ps-actions-slot {
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.06);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.ps-act-divider {
  width: 1px; height: 16px;
  background: rgba(255,255,255,0.1);
}
.ps-root.ps-light .ps-act-divider { background: rgba(0,0,0,0.1); }

.ps-act-btn {
  background: transparent;
  border: none;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--txt-m);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
}
.ps-act-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--txt);
  transform: translateY(-1px);
}
.ps-root.ps-light .ps-act-btn:hover {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.ps-act-danger:hover {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #ef4444 !important;
}

.ps-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--txt-m);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  text-decoration: none;
}
.ps-root.ps-light .ps-back {
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.06);
}
.ps-back:hover {
  background: rgba(255, 120, 0, 0.1);
  border-color: rgba(255, 120, 0, 0.3);
  color: var(--ac);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,120,0,0.15);
}
.ps-root.ps-light .ps-back:hover {
  background: #ffffff;
}
.ps-back.slim {
  padding: 12px;
}

/* ── MOBILE ── */
@media (max-width: 640px) {
  .ps-root { display: none !important; }
}

/* ══════════════════════════
   LIGHT THEME
══════════════════════════ */
.ps-root.ps-light {
  --bg:     rgba(246,246,252,0.94);
  --txt:    #16161e;
  --txt-m:  #787896;
  --txt-s:  #4a4a62;
  --border: rgba(0,0,0,0.075);

  background: var(--bg);
  border-right-color: rgba(0,0,0,0.09);
  box-shadow: 4px 0 32px rgba(0,0,0,0.10);
}
/* fix invalid hex above */
.ps-root.ps-light { --txt-m: #787896; }

/* Brand text in light mode */
.ps-root.ps-light .ps-brand-wf   { color: #16161e; }
.ps-root.ps-light .ps-brand-fire { color: var(--ac); }
.ps-root.ps-light .ps-brand-tag  { color: #9090a8; opacity: 0.65; }

.ps-root.ps-light .ps-rail {
  background: linear-gradient(180deg, transparent 0%, rgba(255,120,0,0.2) 20%, rgba(255,120,0,0.38) 50%, rgba(255,120,0,0.2) 80%, transparent 100%);
}
.ps-root.ps-light .ps-brand { border-bottom-color: rgba(0,0,0,0.07); }
.ps-root.ps-light .ps-brand:hover { background: rgba(0,0,0,0.018); }
.ps-root.ps-light .ps-logo-wrap { border-color: rgba(255,120,0,0.2); background: rgba(255,120,0,0.05); }

.ps-root.ps-light .ps-item { color: #787896; }
.ps-root.ps-light .ps-item:hover { color: #16161e; border-color: rgba(0,0,0,0.09); }
.ps-root.ps-light .ps-fill { background: rgba(0,0,0,0.042); }
.ps-root.ps-light .ps-item.active {
  color: var(--ac);
  border-color: rgba(255,120,0,0.18);
  background: linear-gradient(115deg, rgba(255,120,0,0.09) 0%, rgba(255,80,0,0.04) 55%, transparent 100%);
  /* glow removed */
}
.ps-root.ps-light .ps-gl-text { color: #9090a8; }
.ps-root.ps-light .ps-gl-line { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08)); }
.ps-root.ps-light .ps-gl-line:first-child { background: linear-gradient(90deg, rgba(0,0,0,0.08), transparent); }
.ps-root.ps-light .ps-gl-dot { background: rgba(255,120,0,0.25); }

.ps-root.ps-light .ps-gl-text { color: #9090a8; }
.ps-root.ps-light .ps-gl-line { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08)); }
.ps-root.ps-light .ps-gl-line:first-child { background: linear-gradient(90deg, rgba(0,0,0,0.08), transparent); }
.ps-root.ps-light .ps-gl-dot { background: rgba(255,120,0,0.25); }
</style>