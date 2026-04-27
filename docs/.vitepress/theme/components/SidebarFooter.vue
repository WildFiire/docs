<template>
  <ClientOnly>
    <Teleport to=".VPSidebar">
      <div class="wsf-root" ref="wrapRef">

        <!-- Popup (opens upward, above the footer) -->
        <transition name="wsf-pop">
          <div v-if="menuOpen" class="wsf-popup">
            <template v-if="user">
              <a href="/panel" class="wsf-popup-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                Go to Panel
              </a>
              <button class="wsf-popup-item danger" @click="logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </template>
            <template v-else>
              <a href="/panel" class="wsf-popup-item highlight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                Login with GitHub
              </a>
            </template>
          </div>
        </transition>

        <!-- Pill bar -->
        <div class="wsf-pill">

          <!-- User avatar (left anchor) -->
          <button class="wsf-pill-user" @click="toggleMenu" :title="user ? (user.name || user.login) : 'Login to Panel'">
            <img v-if="user" :src="user.avatar_url" class="wsf-avatar" :alt="user.login" />
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <span v-if="user" class="wsf-online-dot"></span>
          </button>

          <!-- Spacer -->
          <div class="wsf-pill-spacer"></div>

          <!-- Separator -->
          <div class="wsf-pill-sep"></div>

          <!-- Theme toggle: sun + moon both visible, active one highlighted -->
          <button class="wsf-pill-btn" :class="{ active: !isDark }" @click="isDark && toggleTheme()" title="Light mode" aria-label="Light mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <button class="wsf-pill-btn" :class="{ active: isDark }" @click="!isDark && toggleTheme()" title="Dark mode" aria-label="Dark mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>

        </div>

      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()
const user = ref(null)
const menuOpen = ref(false)
const wrapRef = ref(null)

onMounted(() => {
  try {
    const raw = localStorage.getItem('github_user')
    if (raw && localStorage.getItem('github_token')) user.value = JSON.parse(raw)
  } catch {}
  document.addEventListener('click', onOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onOutside)
})

function onOutside(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) menuOpen.value = false
}

function toggleMenu() { menuOpen.value = !menuOpen.value }

function logout() {
  localStorage.removeItem('github_token')
  localStorage.removeItem('github_user')
  user.value = null
  menuOpen.value = false
}

function toggleTheme() {
  isDark.value = !isDark.value
}

watch(isDark, () => {
  document.documentElement.classList.add('theme-switching')
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('theme-switching')
  }))
})
</script>

<style scoped>
/* ── Root: transparent spacer, holds the fade + pill ── */
.wsf-root {
  position: relative;
  flex-shrink: 0;
  padding: 6px 0 8px;
  z-index: 20;
  background: transparent;
  border-top: none;
}

/* Fade-out gradient above the pill */
.wsf-root::before {
  content: '';
  position: absolute;
  top: -32px;
  left: 0;
  right: 0;
  height: 32px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg));
}

/* ── The pill itself ── */
.wsf-pill {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px 8px;
  border-radius: 10px;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

html:not(.dark) .wsf-pill {
  background: rgba(242, 242, 247, 0.95);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* ── User avatar button (leftmost) ── */
.wsf-pill-user {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
  margin-right: 2px;
}
.wsf-pill-user:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
}
html:not(.dark) .wsf-pill-user {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.4);
}
html:not(.dark) .wsf-pill-user:hover {
  background: rgba(0, 0, 0, 0.09);
  color: rgba(0, 0, 0, 0.8);
}

.wsf-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 120, 0, 0.5);
  display: block;
}
.wsf-online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
  border: 1.5px solid rgba(28, 28, 30, 0.9);
}

/* ── Generic pill icon buttons (socials + theme) ── */
.wsf-pill-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
html:not(.dark) .wsf-pill-btn {
  color: rgba(0, 0, 0, 0.35);
}
.wsf-pill-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
}
html:not(.dark) .wsf-pill-btn:hover {
  background: rgba(0, 0, 0, 0.07);
  color: rgba(0, 0, 0, 0.8);
}
.wsf-pill-btn.active {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.1);
}
html:not(.dark) .wsf-pill-btn.active {
  color: rgba(0, 0, 0, 0.85);
  background: rgba(0, 0, 0, 0.08);
}

/* Spacer pushes theme toggle to the right */
.wsf-pill-spacer { flex: 1; }

/* Thin vertical separator */
.wsf-pill-sep {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 3px;
  flex-shrink: 0;
}
html:not(.dark) .wsf-pill-sep {
  background: rgba(0, 0, 0, 0.1);
}

/* ── Popup (opens upward) ── */
.wsf-popup {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 12px;
  right: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100;
}

.wsf-popup-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  color: var(--vp-c-text-1);
  transition: background 0.12s, color 0.12s;
}
.wsf-popup-item:hover { background: var(--vp-c-bg-soft); }
.wsf-popup-item.highlight { color: #ff6a33; background: rgba(255,120,0,0.08); }
.wsf-popup-item.highlight:hover { background: rgba(255,120,0,0.15); }
.wsf-popup-item.danger { color: var(--vp-c-text-3); }
.wsf-popup-item.danger:hover { background: var(--vp-c-bg-soft); color: #f87171; }

/* ── Popup animation ── */
.wsf-pop-enter-active,
.wsf-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.wsf-pop-enter-from,
.wsf-pop-leave-to { opacity: 0; transform: translateY(6px); }
</style>
