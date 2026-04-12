<template>
  <div class="duw-wrap" ref="wrapRef">
    <div class="duw-divider-top"></div>

    <!-- Logged in: full row -->
    <button v-if="user" class="duw-row" @click="toggle">
      <div class="duw-avatar-wrap">
        <img :src="user.avatar_url" class="duw-avatar" :alt="user.login" width="32" height="32" />
        <span class="duw-online-dot"></span>
      </div>
      <div class="duw-info">
        <span class="duw-name">{{ user.name || user.login }}</span>
        <span class="duw-login">@{{ user.login }}</span>
      </div>
      <svg class="duw-chevron" :class="{ open }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>

    <!-- Logged out: compact prompt -->
    <button v-else class="duw-row guest" @click="toggle">
      <div class="duw-avatar-wrap placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>
      <span class="duw-guest-label">Login to Panel</span>
      <svg class="duw-chevron" :class="{ open }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>

    <!-- Popup (opens upward) -->
    <transition name="duw-pop">
      <div v-if="open" class="duw-popup">
        <template v-if="user">
          <a href="/panel" class="duw-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
              <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
            </svg>
            Go to Panel
          </a>
          <button class="duw-item danger" @click="logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </template>
        <template v-else>
          <a href="/panel" class="duw-item highlight">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            Login with GitHub
          </a>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const user = ref(null)
const open = ref(false)
const wrapRef = ref(null)

onMounted(() => {
  try {
    const raw = localStorage.getItem('github_user')
    if (raw && localStorage.getItem('github_token')) {
      user.value = JSON.parse(raw)
    }
  } catch {}

  document.addEventListener('click', onOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onOutsideClick)
})

function toggle() {
  open.value = !open.value
}

function onOutsideClick(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) {
    open.value = false
  }
}

function logout() {
  localStorage.removeItem('github_token')
  localStorage.removeItem('github_user')
  user.value = null
  open.value = false
}
</script>

<style scoped>
.duw-wrap {
  position: relative;
  padding: 0 12px 12px;
}

.duw-divider-top {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 0 0 10px;
}

/* Row button */
.duw-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  color: var(--vp-c-text-1);
}
.duw-row:hover {
  background: var(--vp-c-bg-soft);
}
.duw-row.guest {
  color: var(--vp-c-text-3);
}
.duw-row.guest:hover {
  color: var(--vp-c-text-1);
}

/* Avatar */
.duw-avatar-wrap {
  position: relative;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}
.duw-avatar-wrap.placeholder {
  border-radius: 50%;
  border: 1.5px dashed var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
}
.duw-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 120, 0, 0.4);
  display: block;
}
.duw-online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg);
}

/* Info text */
.duw-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.duw-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.duw-login {
  font-size: 11px;
  color: var(--vp-c-text-3);
  line-height: 1.3;
}
.duw-guest-label {
  font-size: 12.5px;
  flex: 1;
  color: var(--vp-c-text-2);
}

/* Chevron */
.duw-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
}
.duw-chevron.open {
  transform: rotate(180deg);
}

/* Popup - opens upward */
.duw-popup {
  position: absolute;
  bottom: calc(100% - 10px);
  left: 12px;
  right: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100;
}

.duw-item {
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
.duw-item:hover {
  background: var(--vp-c-bg-soft);
}
.duw-item.highlight {
  color: #ff6a33;
  background: rgba(255, 120, 0, 0.08);
}
.duw-item.highlight:hover {
  background: rgba(255, 120, 0, 0.15);
}
.duw-item.danger {
  color: var(--vp-c-text-3);
}
.duw-item.danger:hover {
  background: var(--vp-c-bg-soft);
  color: #f87171;
}

/* Animation - slides up */
.duw-pop-enter-active,
.duw-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.duw-pop-enter-from,
.duw-pop-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
