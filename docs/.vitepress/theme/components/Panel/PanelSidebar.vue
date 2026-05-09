<template>
  <aside class="ps-root" :class="{ collapsed, 'ps-light': isLightTheme }">

    <!-- ░░ GLASS BODY LAYERS ░░ -->
    <div class="ps-glass-inner" aria-hidden="true"></div>
    <div class="ps-specular"    aria-hidden="true"></div>
    <div class="ps-caustic"     aria-hidden="true"></div>

    <!-- ░░ BRAND ░░ -->
    <div class="ps-brand" @click="$emit('navigate','dashboard')">
      <div class="ps-logo-wrap">
        <slot name="logo">
          <img src="/icons/wildfire.webp" alt="WildFire" width="72" height="72">
        </slot>
      </div>
      <div class="ps-brand-text" v-if="!collapsed">
        <span class="ps-brand-name">Wildfire</span>
        <span class="ps-brand-sub">DASHBOARD</span>
      </div>
    </div>

    <!-- ░░ NAV LABEL ░░ -->
    <div class="ps-sec-label" v-if="!collapsed">NAVIGATION</div>

    <!-- ░░ NAV ░░ -->
    <nav class="ps-nav">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="ps-item"
        :class="{ active: currentView === item.id }"
        :title="collapsed ? item.label : ''"
        @click="$emit('navigate', item.id)"
      >
        <span class="ps-item-bg"   aria-hidden="true"></span>
        <span class="ps-item-shim" aria-hidden="true"></span>
        <span class="ps-icon" v-html="item.icon"></span>
        <span class="ps-label" v-if="!collapsed">{{ item.label }}</span>
        <span class="ps-pill" v-if="item.badge && !collapsed" :class="item.badge === 'NEW' ? 'pill-new' : 'pill-live'">{{ item.badge }}</span>
      </button>
    </nav>

    <!-- ░░ FOOTER ░░ -->
    <div class="ps-footer">
      <div class="ps-user" :class="{ slim: collapsed }">
        <div class="ps-user-left" @click="$emit('navigate','profile')" :title="userLogin">
          <div class="ps-av-wrap">
            <img :src="userAvatar" :alt="userLogin" class="ps-av">
            <span class="ps-dot"></span>
          </div>
          <div class="ps-user-info" v-if="!collapsed">
            <span class="ps-uname">{{ userLogin }}</span>
            <span class="ps-ustatus"><span class="ps-udot"></span>ONLINE</span>
          </div>
        </div>
        <button class="ps-sign-out" @click="$emit('logout')" title="Sign Out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
      <a href="/" class="ps-home" :class="{ slim: collapsed }" title="Back to Site">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span v-if="!collapsed">BACK TO SITE</span>
      </a>
    </div>

  </aside>
</template>

<script>
export default {
  name: 'PanelSidebar',
  emits: ['navigate','logout'],
  props: {
    collapsed:     { type: Boolean, default: false },
    currentView:   { type: String,  default: 'dashboard' },
    userLogin:     { type: String,  default: '' },
    userAvatar:    { type: String,  default: '' },
    isLightTheme:  { type: Boolean, default: false },
  },
  data() {
    return {
      navItems: [
        { id:'dashboard',   label:'Dashboard',      badge:'',    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>' },
        { id:'files',       label:'Files',          badge:'',    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>' },
        { id:'contributors',label:'Contributors',   badge:'LIVE',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
        { id:'audit',       label:'Audit',          badge:'LIVE',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
        { id:'analytics',   label:'Analytics',      badge:'',    icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
        { id:'studio',      label:'Phoenix Studio', badge:'NEW', icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
      ]
    }
  }
}
</script>

<style scoped>
/* ── TOKENS ── */
.ps-root {
  --accent:      #ff7800;
  --ac-glow:     rgba(255,120,0,0.32);
  --ac-mid:      rgba(255,120,0,0.15);
  --ac-dim:      rgba(255,120,0,0.07);
  --txt:         #ffffff;
  --txt-muted:   #7a7a8e;
  --txt-sub:     #b0b0c0;
  --W: 264px;
  --W-col: 76px;
  --rad: 0px;
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
  overflow: hidden;
  isolation: isolate;

  /* Solid dark frosted glass — no gradients */
  background: rgba(8, 8, 14, 0.75);
  backdrop-filter: blur(40px) saturate(140%);
  -webkit-backdrop-filter: blur(40px) saturate(140%);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow:
    10px 0 60px rgba(0, 0, 0, 0.5),
    inset -1px 0 0 rgba(255, 255, 255, 0.04),
    inset 1px 0 0 rgba(255, 255, 255, 0.04);
  transition: width 0.4s cubic-bezier(0.34,1.56,0.64,1);
}

.ps-root.collapsed { width: var(--W-col); }
.ps-root::-webkit-scrollbar { display: none; }

/* ── GLASS INNER GRADIENT (gives volume to the glass) ── */
.ps-glass-inner {
  display: none;
}

/* ── SPECULAR HIGHLIGHT (top edge reflection - subtle) ── */
.ps-specular {
  display: none;
}

/* ── BRAND ── */
.ps-brand {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; padding: 28px 16px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  cursor: pointer; position: relative; z-index: 2;
  transition: background 0.2s;
}
.ps-brand:hover { background: rgba(255,255,255,0.025); }

.ps-logo-wrap {
  position: relative; display: flex;
  align-items: center; justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ps-brand:hover .ps-logo-wrap {
  transform: scale(1.05);
}

.ps-brand-text { display:flex; flex-direction:column; align-items:center; gap:4px; }
.ps-brand-name {
  font-size:14px; font-weight:800; letter-spacing:3.5px;
  color:#ff6600; text-transform:uppercase; font-family:'Inter',sans-serif;
}
.ps-brand-sub {
  font-size:8.5px; font-weight:700; letter-spacing:5px;
  color:#5e5e72; text-transform:uppercase; font-family:'Inter',sans-serif;
}

/* collapsed brand */
.ps-root.collapsed .ps-brand { padding:22px 0 18px; }
.ps-root.collapsed .ps-logo-wrap { transform:scale(0.7); }

/* ── SECTION LABEL ── */
.ps-sec-label {
  padding:14px 20px 4px; font-size:9px; font-weight:800;
  color:var(--txt-muted); letter-spacing:3px; text-transform:uppercase;
  opacity:0.45; pointer-events:none; user-select:none; z-index:2; position:relative;
}

/* ── NAV ── */
.ps-nav {
  flex:1; display:flex; flex-direction:column;
  padding:6px 0 8px; overflow-y:auto; overflow-x:hidden;
  position:relative; z-index:2;
}
.ps-nav::-webkit-scrollbar { display:none; }

/* NAV ITEM — glass bubble pill */
.ps-item {
  display:flex; align-items:center; gap:11px;
  padding:11px 16px; margin:3px 10px;
  border-radius:16px; cursor:pointer;
  color:var(--txt-muted); font-size:10.5px; font-weight:700;
  letter-spacing:0.6px; text-transform:uppercase;
  position:relative; overflow:hidden;
  border:1px solid transparent;
  background:transparent;
  width:calc(100% - 20px); text-align:left;
  transition:
    color .22s ease,
    border-color .22s ease,
    transform .3s cubic-bezier(.34,1.56,.64,1),
    box-shadow .22s ease;
}

/* glass pill fill (pseudo-element replacement) */
.ps-item-bg {
  position:absolute; inset:0; border-radius:inherit;
  background:transparent;
  transition:background .22s ease;
  pointer-events:none;
}

/* shimmer stripe */
.ps-item-shim {
  position:absolute; top:0; left:-130%; width:75%; height:100%;
  background:linear-gradient(100deg, transparent, rgba(255,255,255,0.08), transparent);
  transform:skewX(-18deg);
  transition:left .6s ease;
  pointer-events:none;
}

.ps-item:hover { color:var(--txt); border-color:rgba(255,255,255,0.13); transform:translateX(5px); }
.ps-item:hover .ps-item-bg  { background:rgba(255,255,255,0.07); }
.ps-item:hover .ps-item-shim { left:170%; }
.ps-item:hover { box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 24px rgba(0,0,0,0.3); }

/* ACTIVE — true liquid glass bubble */
.ps-item.active {
  color:var(--accent);
  border-color:rgba(255,120,0,0.3);
  transform:translateX(0);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.1),
    0 0 0 1px rgba(255,120,0,0.1) inset,
    0 4px 16px rgba(0,0,0,0.4);
}
.ps-item.active .ps-item-bg {
  background:linear-gradient(135deg,
    rgba(255,120,0,0.18) 0%,
    rgba(255,80,0,0.09) 55%,
    rgba(255,60,0,0.04) 100%);
}
.ps-item.active::before {
  content:'';
  position:absolute; left:0; top:18%; bottom:18%;
  width:3px; border-radius:0 3px 3px 0;
  background:linear-gradient(180deg,#ffaa44,#ff4400);
}

/* icon */
.ps-icon {
  width:20px; height:20px; display:flex;
  align-items:center; justify-content:center;
  flex-shrink:0; opacity:0.65;
  transition:opacity .2s, filter .2s;
  position:relative; z-index:1;
}
.ps-item:hover .ps-icon,
.ps-item.active .ps-icon { opacity:1; }
.ps-item.active .ps-icon { opacity: 1; filter: none; }

.ps-label { flex:1; white-space:nowrap; position:relative; z-index:1; }

/* badges */
.ps-pill {
  font-size:7px; font-weight:800; letter-spacing:0.6px;
  padding:2px 7px; border-radius:20px; flex-shrink:0;
  position:relative; z-index:1;
}
.pill-live { color:#22c55e; border:1px solid rgba(34,197,94,0.3); background:rgba(34,197,94,0.08); }
.pill-new  { color:#a78bfa; border:1px solid rgba(167,139,250,0.3); background:rgba(167,139,250,0.08); }

/* collapsed nav */
.ps-root.collapsed .ps-item {
  justify-content:center; padding:12px; margin:3px 8px;
  width:calc(100% - 16px); transform:none !important;
}
.ps-root.collapsed .ps-item:hover { transform:scale(1.1) !important; }
.ps-root.collapsed .ps-label,
.ps-root.collapsed .ps-pill,
.ps-root.collapsed .ps-sec-label { display:none; }
.ps-root.collapsed .ps-item.active::before { display:none; }

/* ── FOOTER ── */
.ps-footer {
  padding:12px 10px 16px;
  border-top:1px solid rgba(255,255,255,0.06);
  display:flex; flex-direction:column; gap:7px;
  position:relative; z-index:2; margin-top:auto;
}

/* user card */
.ps-user {
  display:flex; align-items:center; gap:9px;
  padding:9px 12px; border-radius:16px;
  background:rgba(255,255,255,0.042);
  border:1px solid rgba(255,255,255,0.09);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 20px rgba(0,0,0,0.28);
  transition:all .22s ease;
}
.ps-user:hover { background:rgba(255,255,255,0.07); border-color:rgba(255,120,0,0.22); }
.ps-user.slim  { justify-content:center; padding:8px; }

.ps-user-left {
  display:flex; align-items:center; gap:9px;
  flex:1; min-width:0; cursor:pointer;
}

/* avatar */
.ps-av-wrap { position:relative; flex-shrink:0; }
.ps-av {
  width:34px; height:34px; border-radius:50%;
  border:2px solid var(--accent);
  box-shadow:0 4px 14px var(--ac-glow);
  object-fit:cover; display:block;
}
.ps-dot {
  position:absolute; bottom:0; right:0;
  width:9px; height:9px; background:#22c55e;
  border-radius:50%; border:2px solid rgba(10,10,22,0.95);
  animation:dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:.5; transform:scale(1.25); }
}

.ps-user-info { display:flex; flex-direction:column; gap:1px; min-width:0; }
.ps-uname {
  font-size:11.5px; font-weight:700; color:var(--txt);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.ps-ustatus {
  display:flex; align-items:center; gap:4px;
  font-size:8.5px; font-weight:700; color:#22c55e;
  letter-spacing:.5px; text-transform:uppercase;
}
.ps-udot {
  width:4px; height:4px; background:#22c55e;
  border-radius:50%; animation:dotPulse 1.5s ease infinite;
}

/* sign out button */
.ps-sign-out {
  background:rgba(0,0,0,0.18); border:1px solid rgba(255,255,255,0.06);
  color:var(--txt-muted); padding:7px; cursor:pointer;
  border-radius:10px; display:flex; align-items:center;
  flex-shrink:0; transition:all .2s;
}
.ps-sign-out:hover { color:#e74c3c; background:rgba(231,76,60,0.14); border-color:rgba(231,76,60,0.28); }

/* back to site */
.ps-home {
  display:flex; align-items:center; gap:8px;
  padding:8px 12px; border-radius:12px;
  font-size:9px; font-weight:700; letter-spacing:.8px;
  color:var(--txt-muted); text-decoration:none; text-transform:uppercase;
  border:1px solid rgba(255,255,255,0.07);
  transition:all .2s;
}
.ps-home:hover { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.12); color:var(--txt-sub); }
.ps-home.slim  { justify-content:center; padding:8px; }

/* ── MOBILE ── */
@media (max-width:640px) {
  .ps-root { display:none !important; }
}

/* ════════════════════════════════════════
   LIGHT THEME
════════════════════════════════════════ */
.ps-root.ps-light {
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(60px) saturate(200%) brightness(1.04);
  -webkit-backdrop-filter: blur(60px) saturate(200%) brightness(1.04);
  border-right: 1px solid rgba(0,0,0,0.09);
  box-shadow:
    12px 0 60px rgba(0,0,0,0.12),
    inset 0 1px 0 rgba(255,255,255,0.9),
    inset -1px 0 0 rgba(0,0,0,0.04);
  --txt:       #18181e;
  --txt-muted: #7a7a90;
  --txt-sub:   #4a4a60;
}

.ps-root.ps-light .ps-glass-inner {
  background: linear-gradient(160deg,
    rgba(255,255,255,0.6) 0%,
    rgba(200,200,255,0.1) 50%,
    transparent 100%);
}

.ps-root.ps-light .ps-specular {
  background: radial-gradient(ellipse 80% 50% at 50% 0%,
    rgba(255,255,255,0.8) 0%,
    rgba(255,255,255,0.2) 50%,
    transparent 100%);
}

.ps-root.ps-light .ps-caustic {
  background: radial-gradient(ellipse 70% 60% at 30% 100%,
    rgba(255,150,50,0.06) 0%,
    transparent 100%);
}

.ps-root.ps-light .ps-bubble {
  border-color: rgba(0,0,0,0.08);
  background: radial-gradient(circle at 30% 25%,
    rgba(255,255,255,0.8) 0%,
    rgba(255,255,255,0.1) 60%,
    transparent 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
}

.ps-root.ps-light .ps-brand {
  border-bottom-color: rgba(0,0,0,0.07);
}
.ps-root.ps-light .ps-brand:hover {
  background: rgba(0,0,0,0.025);
}
.ps-root.ps-light .ps-brand-sub { color:#9090a8; }

.ps-root.ps-light .ps-sec-label { color:#8a8aa0; }

/* nav items */
.ps-root.ps-light .ps-item {
  color: #6a6a80;
}
.ps-root.ps-light .ps-item:hover {
  color: #1a1a28;
  border-color: rgba(0,0,0,0.1);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 16px rgba(0,0,0,0.08);
}
.ps-root.ps-light .ps-item:hover .ps-item-bg {
  background: rgba(0,0,0,0.04);
}
.ps-root.ps-light .ps-item-shim {
  background: linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent);
}
.ps-root.ps-light .ps-item.active {
  color: var(--accent);
  border-color: rgba(255,120,0,0.25);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.9),
    0 4px 20px rgba(255,120,0,0.14),
    0 1px 6px rgba(0,0,0,0.08);
}
.ps-root.ps-light .ps-item.active .ps-item-bg {
  background: linear-gradient(135deg,
    rgba(255,120,0,0.1) 0%,
    rgba(255,80,0,0.05) 100%);
}

/* footer */
.ps-root.ps-light .ps-footer {
  border-top-color: rgba(0,0,0,0.07);
}
.ps-root.ps-light .ps-user {
  background: rgba(255,255,255,0.6);
  border-color: rgba(0,0,0,0.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 12px rgba(0,0,0,0.06);
}
.ps-root.ps-light .ps-user:hover {
  background: rgba(255,255,255,0.8);
  border-color: rgba(255,120,0,0.2);
}
.ps-root.ps-light .ps-uname  { color: #1a1a28; }
.ps-root.ps-light .ps-sign-out {
  background: rgba(0,0,0,0.05);
  border-color: rgba(0,0,0,0.08);
  color: #7a7a90;
}
.ps-root.ps-light .ps-sign-out:hover {
  background: rgba(231,76,60,0.1);
  border-color: rgba(231,76,60,0.25);
  color: #e74c3c;
}
.ps-root.ps-light .ps-home {
  border-color: rgba(0,0,0,0.08);
  color: #8a8a9e;
}
.ps-root.ps-light .ps-home:hover {
  background: rgba(0,0,0,0.04);
  border-color: rgba(0,0,0,0.12);
  color: #3a3a50;
}
.ps-root.ps-light .ps-dot {
  border-color: rgba(255,255,255,0.9);
}
.ps-root.ps-light .ps-av {
  box-shadow: 0 3px 12px rgba(255,120,0,0.2);
}
</style>