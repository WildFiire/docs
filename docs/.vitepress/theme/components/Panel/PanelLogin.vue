<template>
  <div class="panel-login" :class="{ 'light-theme': isLightTheme }">
    <!-- CS2 Background -->
    <CS2Background :isDark="!isLightTheme" />

    <div class="login-container">
      <!-- Logo Section -->
      <div class="brand-section">
        <div class="brand-logo">
          <LiquidMetalLogo
            :width="280"
            :height="280"
            image="/icons/wildfire.png"
            colorBack="#00000000"
            colorTint="#ff7800a6"
            shape="none"
            :repetition="2"
            :softness="0.1"
            :shiftRed="0.3"
            :shiftBlue="0.3"
            :distortion="0.07"
            :contour="0.4"
            :angle="70"
            :speed="1"
            :scale="0.6"
            fit="contain"
          />
        </div>
        <h1 class="brand-title">
          <span class="t-white">Wild</span><span class="t-fire">Fire</span>
        </h1>
        <p class="brand-subtitle">Developer Dashboard</p>
      </div>

      <!-- Device Flow Card - Step 1 -->
      <div class="auth-card" v-if="!waitingForAuth">
        <div class="card-glow"></div>
        
        <div class="card-header">
          <div class="header-icon">
            <Icon icon="solar:lock-keyhole-bold-duotone" width="28" height="28" />
          </div>
          <h2 class="orbitron-font">Authentication Required</h2>
          <p>Sign in with your GitHub account</p>
        </div>

        <div class="card-body">
          <div v-if="error" class="error-message">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <circle cx="12" cy="16" r="1"/>
            </svg>
            <span>{{ error }}</span>
          </div>

          <button 
            class="oauth-btn github"
            :disabled="isLoading"
            @click="startDeviceFlow"
          >
            <div class="btn-loader" v-if="isLoading">
              <div class="loader"></div>
              <span class="orbitron-font">Starting...</span>
            </div>
            <template v-else>
              <Icon icon="mdi:github" width="22" height="22" />
              <span class="orbitron-font">Continue with GitHub</span>
              <Icon icon="mdi:arrow-right" width="16" height="16" class="arrow-icon" />
            </template>
          </button>
        </div>

        <div class="card-footer">
          <p class="security-note">
            <Icon icon="solar:shield-check-bold-duotone" width="14" height="14" />
            <span class="orbitron-font">Authenticated via GitHub Device Flow</span>
          </p>
        </div>
      </div>

      <!-- Device Flow Card - Step 2 (Code Display) -->
      <div class="auth-card device-card" v-else>
        <div class="card-glow"></div>
        
        <div class="card-header">
          <div class="header-icon">
            <Icon icon="solar:code-circle-bold-duotone" width="28" height="28" />
          </div>
          <h2 class="orbitron-font">Authentication in Progress</h2>
          <p>Enter the code on GitHub to continue</p>
        </div>

        <div class="card-body">
          <div class="device-code-container">
            <div class="device-code-wrapper">
              <div class="device-code orbitron-font">{{ deviceCode }}</div>
              <button class="copy-code-btn" @click="copyCode" :class="{ copied: codeCopied }">
                <Icon :icon="codeCopied ? 'mdi:check' : 'mdi:content-copy'" width="16" height="16" />
                <span class="orbitron-font">{{ codeCopied ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
            <p class="device-instruction">
              <span class="step"><Icon icon="mdi:numeric-1-circle" width="16" height="16" /> Code copied to clipboard automatically</span>
              <span class="step"><Icon icon="mdi:numeric-2-circle" width="16" height="16" /> Go to <strong>github.com/login/device</strong></span>
              <span class="step"><Icon icon="mdi:numeric-3-circle" width="16" height="16" /> Paste the code and authorize</span>
            </p>
            <a :href="verificationUri" target="_blank" class="verification-link orbitron-font">
              <Icon icon="mdi:open-in-new" width="14" height="14" />
              Open github.com/login/device
            </a>
          </div>

          <div class="waiting-status">
            <div class="spinner"></div>
            <span>Waiting for confirmation...</span>
            <span class="elapsed-timer orbitron-font">{{ elapsedFormatted }}</span>
          </div>

          <button class="cancel-btn" @click="cancelDeviceFlow">
            <Icon icon="mdi:close" width="14" height="14" />
            <span>Cancel</span>
          </button>
        </div>

        <div class="card-footer">
          <p class="security-note">
            <Icon icon="solar:shield-check-bold-duotone" width="14" height="14" />
            <span>The app receives access only after you authorize from your browser</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import panelConfig from '../../panel.config.js'
import { Icon } from '@iconify/vue'
import CS2Background from '../CS2Background.vue'
import LiquidMetalLogo from '../LiquidMetalLogo.vue'

export default {
  name: 'PanelLogin',
  components: { Icon, CS2Background, LiquidMetalLogo },
  
  data() {
    return {
      isLightTheme: false,
      isLoading: false,
      error: null,
      waitingForAuth: false,
      deviceCode: '',
      verificationUri: '',
      intervalId: null,
      deviceToken: '',
      codeCopied: false,
      elapsedSeconds: 0,
      timerId: null
    }
  },
  
  computed: {
    githubClientId() {
      return this.$githubClientId || window.__GITHUB_CLIENT_ID || import.meta.env.VITE_GITHUB_CLIENT_ID || panelConfig.githubClientId
    },
    elapsedFormatted() {
      const m = Math.floor(this.elapsedSeconds / 60)
      const s = this.elapsedSeconds % 60
      return `${m}:${String(s).padStart(2, '0')}`
    }
  },
  
  mounted() {
    const savedTheme = localStorage.getItem('wildfire-theme')
    if (savedTheme === 'light') this.isLightTheme = true
  },
  
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  },
  
  methods: {
    async startDeviceFlow() {
      this.isLoading = true
      this.error = null
      
      if (!this.githubClientId) {
        this.error = 'GitHub Client ID not configured. Contact administrator.'
        this.isLoading = false
        return
      }
      
      try {
        console.log('[PanelLogin] Starting device flow, clientId:', this.githubClientId ? 'set' : 'missing')
        const deviceResponse = await fetch('/api/github/device-code', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: this.githubClientId,
            scope: 'repo read:user read:org'
          })
        })
        
        if (!deviceResponse.ok) {
          throw new Error(`HTTP ${deviceResponse.status}`)
        }
        
        const deviceData = await deviceResponse.json()
        console.log('[PanelLogin] Device code response:', JSON.stringify(deviceData))
        
        if (deviceData.error) {
          throw new Error(deviceData.error_description || deviceData.error)
        }
        
        this.deviceCode = deviceData.user_code
        this.verificationUri = deviceData.verification_uri
        this.deviceToken = deviceData.device_code
        
        this.waitingForAuth = true
        this.isLoading = false
        
        // Start elapsed timer
        this.elapsedSeconds = 0
        this.timerId = setInterval(() => { this.elapsedSeconds++ }, 1000)
        
        // Auto-copy code to clipboard
        this.copyCode()
        
        const interval = deviceData.interval * 1000 || 5000
        
        this.intervalId = setInterval(async () => {
          await this.pollForToken()
        }, interval)
        
      } catch (err) {
        console.error('Device flow error:', err)
        this.error = err.message || 'Error starting authentication'
        this.isLoading = false
      }
    },
    
    async pollForToken() {
      try {
        console.log('[PanelLogin] Polling for token...')
        const response = await fetch('/api/github/token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: this.githubClientId,
            device_code: this.deviceToken,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
          })
        })
        const data = await response.json()
        console.log('[PanelLogin] Poll response:', JSON.stringify(data))
        
        if (data.error === 'authorization_pending') {
          return
        }
        
        if (data.error === 'slow_down') {
          const newInterval = (data.interval || 10) * 1000
          clearInterval(this.intervalId)
          this.intervalId = setInterval(async () => {
            await this.pollForToken()
          }, newInterval)
          return
        }
        
        if (data.error === 'access_denied') {
          this.error = 'Access denied. Please try again.'
          this.cancelDeviceFlow()
          return
        }
        
        if (data.error) {
          this.error = data.error_description || data.error
          this.cancelDeviceFlow()
          return
        }
        
        if (data.access_token) {
          clearInterval(this.intervalId)
          this.intervalId = null
          
          localStorage.setItem('github_token', data.access_token)
          
          let user = { login: '', avatar_url: '', name: '' }
          try {
            const userResponse = await fetch('https://api.github.com/user', {
              headers: {
                'Authorization': `token ${data.access_token}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            })
            if (userResponse.ok) {
              const userData = await userResponse.json()
              if (userData.login) user = userData
            }
          } catch (userErr) {
            console.warn('[PanelLogin] User info fetch failed, proceeding with token only:', userErr)
          }
          
          console.log('[PanelLogin] User fetched:', user.login)
          localStorage.setItem('github_user', JSON.stringify({
            login: user.login,
            avatar_url: user.avatar_url,
            name: user.name
          }))
          
          console.log('[PanelLogin] Emitting login-success')
          this.$emit('login-success', {
            token: data.access_token,
            user: user
          })
          return
        }
        
      } catch (err) {
        console.error('[PanelLogin] Polling error:', err)
        this.error = err.message || 'Authentication error. Please try again.'
        this.cancelDeviceFlow()
      }
    },
    
    async copyCode() {
      if (!this.deviceCode) return
      try {
        await navigator.clipboard.writeText(this.deviceCode)
        this.codeCopied = true
        setTimeout(() => { this.codeCopied = false }, 2500)
      } catch (err) {
        // Fallback for older browsers
        const ta = document.createElement('textarea')
        ta.value = this.deviceCode
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        this.codeCopied = true
        setTimeout(() => { this.codeCopied = false }, 2500)
      }
    },
    
    cancelDeviceFlow() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
      this.waitingForAuth = false
      this.deviceCode = ''
      this.deviceToken = ''
      this.elapsedSeconds = 0
      this.error = null
    }
  }
}
</script>

<style scoped>
.panel-login,
.panel-login *,
.panel-login a,
.panel-login button,
.panel-login input,
.panel-login select,
.panel-login textarea {
  cursor: auto !important;
}
.panel-login button,
.panel-login a,
.panel-login [role="button"] {
  cursor: pointer !important;
}

.panel-login {
  --bg-primary: #0a0a0c;
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0, 0.2);
  --accent-dim: rgba(255, 120, 0,0.08);
  --accent-soft: rgba(255, 120, 0,0.15);
  --accent-mid: rgba(255, 120, 0,0.28);
  --accent-strong: rgba(255, 120, 0,0.45);
  --accent-heavy: rgba(255, 120, 0,0.68);
  --accent-solid: rgba(255, 120, 0,0.88);
  --accent-alt: #ff6030;
  --accent-alt2: #ff8c42;
  --border-color: #1f1f24;
  --shadow-color: rgba(0, 0, 0, 0.5);
  --error: #e74c3c;
  
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
  overflow-x: hidden;
  overflow-y: auto;
}

.panel-login.light-theme {
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --text-primary: #333;
  --text-secondary: #4a4a55;
  --text-muted: #666;
  --accent: #ff7800;
  --accent-glow: rgba(255, 120, 0, 0.1);
  --accent-dim: rgba(255, 120, 0,0.06);
  --accent-soft: rgba(255, 120, 0,0.12);
  --accent-mid: rgba(255, 120, 0,0.22);
  --accent-strong: rgba(255, 120, 0,0.38);
  --accent-heavy: rgba(255, 120, 0,0.58);
  --accent-solid: rgba(255, 120, 0,0.78);
  --accent-alt: #ff6030;
  --accent-alt2: #ff8c42;
  --border-color: #ddd;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

.panel-login :deep(.cs2-bg) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
}

.brand-section {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease;
}

.brand-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto -40px;
  width: 200px;
  height: 200px;
  overflow: visible;
}

.brand-logo :deep(div),
.brand-logo :deep(canvas) {
  width: 200px !important;
  height: 200px !important;
}

.brand-title {
  font-family: 'Orbitron', sans-serif !important;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 900;
  letter-spacing: 4px;
  margin-bottom: 8px;
  text-align: center;
  line-height: 1;
}

.t-white {
  color: #fff;
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 900;
}

.light-theme .t-white {
  color: #111;
}

.t-fire {
  color: #ff7800;
  font-family: 'Orbitron', sans-serif !important;
  font-weight: 900;
  background: linear-gradient(135deg, #ff7800, #ff4400);
  -webkit-background-clip: text;
  background-clip: text;
}

.brand-subtitle {
  font-family: 'Orbitron', sans-serif !important;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 3px;
  text-transform: uppercase;
  text-align: center;
}

.auth-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  padding: 44px;
  width: 100%;
  max-width: 460px;
  position: relative;
  backdrop-filter: blur(56px) saturate(180%) brightness(1.1);
  -webkit-backdrop-filter: blur(56px) saturate(180%) brightness(1.1);
  animation: fadeInUp 0.6s ease 0.1s both;
  box-shadow:
    0 40px 90px rgba(0, 0, 0, 0.7),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  border-radius: 50%;
  pointer-events: none;
}

.light-theme .auth-card {
  background: rgba(255, 255, 255, 0.62);
  border-color: rgba(255, 255, 255, 0.55);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.card-glow {
  display: none;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 120, 0, 0.10);
  border: 1px solid rgba(255, 120, 0, 0.22);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--accent);
  backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 4px 28px rgba(255, 120, 0, 0.18);
}

.card-header h2 {
  font-family: 'Orbitron', sans-serif !important;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-header p {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.3px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid var(--error);
  border-radius: 12px;
  color: var(--error);
  font-size: 13px;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.oauth-btn.github {
  background: linear-gradient(135deg, #ff8c20, #ff5200);
  color: white;
  border-radius: 14px;
  font-size: 12px;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 28px rgba(255, 120, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 160, 80, 0.3);
  transition: all 0.22s ease;
}

.oauth-btn.github:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 120, 0, 0.58), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  background: linear-gradient(135deg, #ff9a30, #ff6010);
}

.oauth-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.oauth-btn:hover .arrow-icon {
  transform: translateX(4px);
}

.btn-loader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.device-code-container {
  text-align: center;
  padding: 24px 20px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 120, 0, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(8px);
}

.light-theme .device-code-container {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 120, 0, 0.2);
}

.device-code-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.device-code {
  font-family: 'Orbitron', sans-serif !important;
  font-size: clamp(18px, 4vw, 26px);
  font-weight: 700;
  letter-spacing: 6px;
  color: #ff7800;
  background: rgba(0, 0, 0, 0.5);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 120, 0, 0.3);
  text-shadow: none;
  user-select: all;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}

.light-theme .device-code {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 120, 0, 0.25);
}

.copy-code-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  background: rgba(255, 120, 0, 0.12);
  border: 1px solid rgba(255, 120, 0, 0.3);
  border-radius: 8px;
  color: #ff7800;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 1px;
}

.copy-code-btn:hover {
  background: rgba(255, 120, 0, 0.22);
  border-color: rgba(255, 120, 0, 0.5);
}

.copy-code-btn.copied {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
  color: #22c55e;
}

.device-instruction {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 20px;
  text-align: left;
}

.device-instruction .step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-instruction .step :deep(svg) {
  color: #ff7800;
  flex-shrink: 0;
}

.device-instruction strong {
  color: #ff7800;
}

.verification-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  background: linear-gradient(135deg, #ff7800, #ff5500);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.verification-link:hover {
  transform: translateY(-2px);
}

.waiting-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 13px;
  backdrop-filter: blur(4px);
}

.light-theme .waiting-status {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(0, 0, 0, 0.06);
}

.elapsed-timer {
  margin-left: auto;
  font-size: 12px;
  color: #ff7800;
  letter-spacing: 1px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: #ff7800;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.light-theme .cancel-btn {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(0, 0, 0, 0.08);
}

.cancel-btn:hover {
  border-color: var(--error);
  color: var(--error);
}

.card-footer {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 0.5px;
}

.security-note :deep(svg) {
  color: var(--accent);
  opacity: 0.6;
  flex-shrink: 0;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 560px) {
  .auth-card {
    padding: 28px 20px;
  }
  .brand-title {
    font-size: 28px;
  }
  .device-code {
    font-size: 16px;
    letter-spacing: 3px;
  }
}
</style>