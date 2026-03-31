<template>
  <div class="panel-login" :class="{ 'light-theme': isLightTheme }">
    <!-- Animated Background -->
    <div class="login-bg">
      <div class="bg-gradient"></div>
      <div class="grid-overlay"></div>
      <div class="floating-particles">
        <div v-for="n in 30" :key="n" class="particle" :style="particleStyle(n)"></div>
      </div>
    </div>

    <div class="login-container">
      <!-- Logo Section -->
      <div class="brand-section">
        <div class="logo-wrapper">
          <img src="/icons/wildfire.webp" alt="WildFire" class="logo">
          <div class="logo-ring"></div>
          <div class="logo-pulse"></div>
        </div>
        <h1 class="brand-title">WILDFIRE</h1>
        <p class="brand-subtitle">Developer Dashboard</p>
      </div>

      <!-- Device Flow Card - Step 1 -->
      <div class="auth-card" v-if="!waitingForAuth">
        <div class="card-glow"></div>
        
        <div class="card-header">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 6v6l4 2"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <h2>Authentication Required</h2>
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
              <span>Starting...</span>
            </div>
            <template v-else>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.21.68-.48 0-.24-.01-.88-.01-1.73-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z"/>
              </svg>
              <span>Continue with GitHub</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </template>
          </button>
        </div>

        <div class="card-footer">
          <p class="security-note">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
              <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z"/>
              <path d="M12 11v4M12 8v1"/>
            </svg>
            Authenticated via GitHub Device Flow
          </p>
        </div>
      </div>

      <!-- Device Flow Card - Step 2 (Code Display) -->
      <div class="auth-card device-card" v-else>
        <div class="card-glow"></div>
        
        <div class="card-header">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 6v6l4 2"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <h2>Authentication in Progress</h2>
          <p>Enter the code on GitHub to continue</p>
        </div>

        <div class="card-body">
          <div class="device-code-container">
            <div class="device-code">{{ deviceCode }}</div>
            <p class="device-instruction">
              1. Copy the code above<br>
              2. Go to <strong>github.com/login/device</strong><br>
              3. Enter the code and authorize the application
            </p>
            <a :href="verificationUri" target="_blank" class="verification-link">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open github.com/login/device
            </a>
          </div>

          <div class="waiting-status">
            <div class="spinner"></div>
            <span>Waiting for confirmation...</span>
          </div>

          <button class="cancel-btn" @click="cancelDeviceFlow">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancel
          </button>
        </div>

        <div class="card-footer">
          <p class="security-note">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
              <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z"/>
              <path d="M12 11v4M12 8v1"/>
            </svg>
            The app receives access only after you authorize from your browser
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelLogin',
  
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
      githubClientId: ''
    }
  },
  
  async mounted() {
    const savedTheme = localStorage.getItem('wildfire-theme')
    if (savedTheme === 'light') this.isLightTheme = true

    try {
      const res = await fetch('/api/config')
      if (res.ok) {
        const cfg = await res.json()
        if (cfg.githubClientId) {
          this.githubClientId = cfg.githubClientId
          return
        }
      }
    } catch (_) {}
    this.githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID || ''
  },
  
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  
  methods: {
    particleStyle(n) {
      const size = Math.random() * 4 + 2
      return {
        width: size + 'px',
        height: size + 'px',
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 10 + 's',
        animationDuration: Math.random() * 15 + 15 + 's',
        opacity: Math.random() * 0.4 + 0.1
      }
    },
    
    async startDeviceFlow() {
      this.isLoading = true
      this.error = null
      
      const githubClientId = this.githubClientId
      
      if (!githubClientId) {
        this.error = 'GitHub Client ID not configured. Contact administrator.'
        this.isLoading = false
        return
      }
      
      try {
        console.log('[PanelLogin] Starting device flow, clientId:', githubClientId ? 'set' : 'missing')
        const deviceResponse = await fetch('/api/github/device-code', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: githubClientId,
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
      const githubClientId = this.githubClientId
      
      try {
        console.log('[PanelLogin] Polling for token...')
        const response = await fetch('/api/github/token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: githubClientId,
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
    
    cancelDeviceFlow() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      this.waitingForAuth = false
      this.deviceCode = ''
      this.deviceToken = ''
      this.error = null
    }
  }
}
</script>

<style scoped>
.panel-login {
  --bg-primary: #0a0a0c;
  --bg-secondary: #0f0f12;
  --bg-tertiary: #1a1a20;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-muted: #8a8a95;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.2);
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
  overflow: hidden;
}

.panel-login.light-theme {
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e8e8ed;
  --text-primary: #333;
  --text-secondary: #4a4a55;
  --text-muted: #666;
  --accent: #ff4500;
  --accent-glow: rgba(255, 69, 0, 0.1);
  --border-color: #ddd;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 30%, var(--accent-glow) 0%, transparent 50%);
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--border-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.1;
}

.floating-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  background: var(--accent);
  border-radius: 50%;
  animation: float linear infinite;
  pointer-events: none;
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-200px) translateX(100px); opacity: 0; }
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

.logo-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 20px var(--accent-glow));
  position: relative;
  z-index: 1;
}

.logo-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 3s linear infinite;
}

.logo-pulse {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  animation: pulse 2s ease infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.3; }
  70% { transform: scale(1.3); opacity: 0; }
  100% { transform: scale(1.3); opacity: 0; }
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.brand-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  letter-spacing: 2px;
}

.auth-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  position: relative;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.6s ease 0.1s both;
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--accent), transparent, var(--accent));
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.auth-card:hover .card-glow {
  opacity: 0.1;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: var(--bg-tertiary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--accent);
}

.card-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-header p {
  font-size: 14px;
  color: var(--text-muted);
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
  background: #24292e;
  color: white;
}

.oauth-btn.github:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  filter: brightness(1.05);
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
  padding: 20px;
  background: var(--bg-tertiary);
  border-radius: 16px;
}

.device-code {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 8px;
  color: var(--accent);
  background: var(--bg-primary);
  padding: 20px;
  border-radius: 12px;
  font-family: monospace;
  margin-bottom: 20px;
}

.device-instruction {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 16px;
}

.verification-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--accent);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.verification-link:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.waiting-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 13px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent);
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
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
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
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
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
    font-size: 24px;
    letter-spacing: 4px;
  }
}
</style>