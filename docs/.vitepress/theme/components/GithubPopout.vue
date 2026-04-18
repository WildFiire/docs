<!-- .vitepress/theme/components/GithubPopout.vue -->
<template>
  <div 
    class="github-popout" 
    :class="{ 'visible': isVisible }"
    :style="popoutStyle"
    ref="popout"
    @mouseenter.stop="onPopoutEnter"
    @mouseleave.stop="onPopoutLeave"
    v-show="isVisible"
  >
    <div class="popout-arrow" :class="{ 'below': isBelow }"></div>
    
    <transition
      enter-active-class="popout-enter-active"
      leave-active-class="popout-leave-active"
      enter-class="popout-enter"
      leave-to-class="popout-leave-to"
    >
      <div v-if="isVisible" class="popout-content" @mouseenter.stop @mouseleave.stop>
        <!-- Background Logo Watermark -->
        <div class="popout-background">
          <img src="/icons/wildfire.webp" alt="Wildfire" class="background-logo main" @error="handleImageError">
          <img src="/icons/wildfire.webp" alt="Wildfire" class="background-logo secondary" @error="handleImageError">
          <img src="/icons/wildfire.webp" alt="Wildfire" class="background-logo tertiary" @error="handleImageError">
        </div>

        <!-- Fire Particles -->
        <div class="fire-particles">
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
        </div>

        <!-- Close Button -->
        <button class="popout-close" @click.stop="closePopout" title="Close (ESC)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Loading -->
        <div v-if="loading" class="popout-loading">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="popout-error">
          <Icon icon="solar:danger-triangle-bold-duotone" class="error-icon" />
          <p>{{ error }}</p>
        </div>

        <!-- Profile -->
        <template v-else>
          <!-- Hero: banner + centered avatar -->
          <div class="popout-hero">
            <div class="mini-profile-banner" :style="miniBannerStyle">
              <div class="mini-banner-overlay"></div>
            </div>
            <img :src="user.avatar" :alt="user.username" class="popout-avatar hero-avatar" @error="handleAvatarError">
          </div>

          <!-- Identity -->
          <div class="identity-block">
            <div class="name-row">
              <h3>{{ user.name || user.username }}</h3>
              <a :href="user.profileUrl" target="_blank" rel="noopener noreferrer" @click.stop class="username-link">@{{ user.username }}</a>
            </div>
            <div class="square-tags" :class="tagClasses">
                <!-- 1. WILDFIRE -->
                <span class="square-tag tag-wildfire">
                  <img src="/icons/wildfire.webp" alt="wildfire" class="tag-icon" @error="handleIconError">
                  <span>WILDFIRE</span>
                </span>
                
                <!-- 2. FOUNDER -->
                <span class="square-tag tag-founder">
                  <img src="/icons/wildfire.webp" alt="founder" class="tag-icon" @error="handleIconError">
                  <span>FOUNDER</span>
                </span>
                
                <!-- 3. DEV -->
                <span class="square-tag tag-dev">
                  <img src="/icons/vsc.svg" alt="dev" class="tag-icon" @error="handleIconError">
                  <span>DEV</span>
                </span>
                
                <!-- 4. STAFF -->
                <span class="square-tag tag-staff">
                  <img src="/icons/wildfire.webp" alt="staff" class="tag-icon" @error="handleIconError">
                  <span>STAFF</span>
                </span>
                
                <!-- 5. ADMIN -->
                <span class="square-tag tag-admin">
                  <img src="/icons/admin.svg" alt="admin" class="tag-icon" @error="handleIconError">
                  <span>ADMIN</span>
                </span>
                
                <!-- 6. MOD -->
                <span class="square-tag tag-mod">
                  <img src="/icons/mod.svg" alt="mod" class="tag-icon" @error="handleIconError">
                  <span>MOD</span>
                </span>
                
                <!-- 7. SUPPORTER -->
                <span class="square-tag tag-supporter">
                  <img src="/icons/supporter.svg" alt="supporter" class="tag-icon" @error="handleIconError">
                  <span>SUPPORTER</span>
                </span>
                
                <!-- 8. BOOSTER -->
                <span class="square-tag tag-booster">
                  <img src="/icons/booster.svg" alt="booster" class="tag-icon" @error="handleIconError">
                  <span>BOOSTER</span>
                </span>
                
                <!-- 9. PARTNER -->
                <span class="square-tag tag-partner">
                  <img src="/icons/partner.svg" alt="partner" class="tag-icon" @error="handleIconError">
                  <span>PARTNER</span>
                </span>
                
                <!-- 10. CONTRIBUTOR -->
                <span class="square-tag tag-contributor">
                  <img src="/icons/wildfire.webp" alt="contributor" class="tag-icon" @error="handleIconError">
                  <span>CONTRIBUTOR</span>
                </span>
                
                <!-- 11. WIKI -->
                <span class="square-tag tag-wiki">
                  <img src="/icons/vue.svg" alt="wiki" class="tag-icon" @error="handleIconError">
                  <span>WIKI</span>
                </span>
                
                <!-- 12. TRUSTED -->
                <span class="square-tag tag-trusted">
                  <img src="/icons/wildfire.webp" alt="trusted" class="tag-icon" @error="handleIconError">
                  <span>TRUSTED</span>
                </span>
                
                <!-- 13. PRO -->
                <span class="square-tag tag-pro">
                  <img src="/icons/wildfire.webp" alt="pro" class="tag-icon" @error="handleIconError">
                  <span>PRO</span>
                </span>
                
                <!-- 14. VIP -->
                <span class="square-tag tag-vip">
                  <img src="/icons/wildfire.webp" alt="vip" class="tag-icon" @error="handleIconError">
                  <span>VIP</span>
                </span>
            </div>
          </div>

          <!-- Bio -->
          <p v-if="user.bio" class="popout-bio">{{ user.bio }}</p>

          <!-- Stats principale -->
          <div class="popout-stats">
            <div>
              <strong>{{ formatNumber(user.followers) }}</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>{{ formatNumber(user.following) }}</strong>
              <span>Following</span>
            </div>
            <div>
              <strong>{{ formatNumber(user.publicRepos) }}</strong>
              <span>Repos</span>
            </div>
          </div>

          <!-- SECȚIUNE CONTRIBUȚII - simplificată -->
          <div class="contributions-simple" v-if="user.contributions !== null">
            <div class="simple-row">
              <div class="simple-badge">
                <svg class="simple-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 3v18h18"/>
                  <rect x="7" y="12" width="3" height="6" rx="1"/>
                  <rect x="12" y="9" width="3" height="9" rx="1"/>
                  <rect x="17" y="6" width="3" height="12" rx="1"/>
                </svg>
                <span class="simple-count">{{ formatNumber(user.contributions) }}</span>
                <span class="simple-label">commit{{ user.contributions !== 1 ? 's' : '' }}</span>
              </div>
              
              <div class="simple-repo">
                <svg class="simple-repo-icon" width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                </svg>
                <a href="https://github.com/Wildfiire/docs" target="_blank" rel="noopener noreferrer">
                  docs
                </a>
              </div>
            </div>
          </div>

          <!-- Details - location și joined -->
          <div class="popout-details-minimal">
            <div v-if="user.location" class="detail-item">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z"/>
                <circle cx="12" cy="10" r="2.5"/>
              </svg>
              <span class="detail-text">{{ user.location }}</span>
            </div>
            <div class="detail-item">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2"/>
                <path d="M16 3v4M8 3v4M3 10h18"/>
              </svg>
              <span class="detail-text">Joined {{ formatDate(user.createdAt) }}</span>
            </div>
          </div>

          <!-- Button cu efect subtil -->
          <a :href="user.profileUrl" target="_blank" rel="noopener noreferrer" class="popout-button" @click.stop>
            <span class="button-text">View GitHub Profile</span>
            <svg class="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="M13 6l6 6-6 6"/>
            </svg>
          </a>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'GithubPopout',
  props: {
    username: {
      type: String,
      required: true
    },
    targetElement: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentUsername: this.username,
      currentTargetElement: this.targetElement,
      isVisible: false,
      isBelow: false,
      loading: true,
      error: null,
      user: {
        username: this.username,
        name: '',
        avatar: `https://github.com/${this.username}.png`,
        bio: '',
        followers: 0,
        following: 0,
        publicRepos: 0,
        location: '',
        company: '',
        blog: '',
        createdAt: '',
        profileUrl: `https://github.com/${this.username}`,
        contributions: null
      },
      popoutStyle: {},
      tagClasses: '',
      profileBgUrl: '',
      readmeBgStatus: 'idle',
      // 🔥 TOKEN DIN VARIABILA DE MEDIU
      githubToken: import.meta.env.VITE_GITHUB_TOKEN
    }
  },
  mounted() {
    
    this.fetchUserData()
    this.fetchUserContributions()
    this.fetchProfileReadmeBg()
    
    window.addEventListener('resize', this.positionPopout)
    window.addEventListener('scroll', this.positionPopout, true)
    window.addEventListener('keydown', this.handleKeyDown)
    
    if (this.currentTargetElement) {
      this.tagClasses = this.currentTargetElement.getAttribute('data-tags') || ''
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.positionPopout)
    window.removeEventListener('scroll', this.positionPopout, true)
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  computed: {
    miniBannerStyle() {
      if (this.profileBgUrl) {
        return {
          backgroundImage: `url('${this.profileBgUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }
      return {
        background: 'linear-gradient(135deg, #2d1408 0%, #1d0f08 45%, #31180a 100%)'
      }
    }
  },
  methods: {
    async fetchUserData() {
      this.loading = true
      this.error = null
      
      try {
        
        const response = await fetch(`https://api.github.com/users/${this.currentUsername}`, {
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        
        
        if (response.status === 401) {
          throw new Error('Token invalid sau expirat')
        }
        
        if (!response.ok) {
          throw new Error(`Eroare ${response.status}`)
        }
        
        const data = await response.json()
        
        this.user = {
          ...this.user,
          username: this.currentUsername,
          name: data.name || this.currentUsername,
          avatar: data.avatar_url || this.user.avatar,
          bio: data.bio || 'No bio available',
          followers: data.followers || 0,
          following: data.following || 0,
          publicRepos: data.public_repos || 0,
          location: data.location || '',
          company: data.company || '',
          blog: data.blog || '',
          createdAt: data.created_at,
          profileUrl: data.html_url || this.user.profileUrl
        }
      } catch (error) {
        console.error('❌ Eroare:', error)
        this.error = 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserContributions() {
      try {
        
        const response = await fetch('https://api.github.com/repos/Wildfiire/docs/contributors', {
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        
        if (!response.ok) {
          this.user.contributions = 0
          return
        }
        
        const contributors = await response.json()
        
        if (!Array.isArray(contributors)) {
          this.user.contributions = 0
          return
        }
        
        const contributor = contributors.find(c => 
          c.login?.toLowerCase() === this.currentUsername.toLowerCase()
        )
        
        this.user.contributions = contributor ? contributor.contributions : 0
        
        if (this.user.contributions > 0) {
          const extra = ['show-contributor', 'show-wildfire']
            .filter(c => !this.tagClasses.includes(c))
            .join(' ')
          if (extra) this.tagClasses = (this.tagClasses + ' ' + extra).trim()
        }
        
      } catch (error) {
        console.error('❌ Eroare contribuții:', error)
        this.user.contributions = 0
      }
    },

    async fetchProfileReadmeBg() {
      const username = this.currentUsername
      if (!username) return
      this.readmeBgStatus = 'loading'
      const branches = ['main', 'master']

      for (const branch of branches) {
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${username}/${username}/${branch}/README.md`)
          if (!res.ok) continue
          const text = await res.text()
          const url = this.extractImageFromReadme(text)
          if (url) {
            this.profileBgUrl = url
            this.readmeBgStatus = 'found'
            return
          }
        } catch (_) {}
      }

      if (this.readmeBgStatus === 'loading') this.readmeBgStatus = 'none'
    },

    extractImageFromReadme(text) {
      const mdImg = text.match(/!\[.*?\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s)]*)?)\)/i)
      if (mdImg) return mdImg[1]
      const imgur = text.match(/(https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|webp|gif))/i)
      if (imgur) return imgur[1]
      const htmlImg = text.match(/<img[^>]+src=["'](https?:\/\/[^\s"']+)["']/i)
      if (htmlImg) return htmlImg[1]
      return null
    },
    
    formatNumber(num) {
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
      return num
    },
    
    formatDate(date) {
      if (!date) return 'Unknown'
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    },
    
    positionPopout() {
      this.$nextTick(() => {
        if (!this.currentTargetElement || !this.$refs.popout) return
        
        const targetRect = this.currentTargetElement.getBoundingClientRect()
        const popoutRect = this.$refs.popout.getBoundingClientRect()
        
        let left = targetRect.left + (targetRect.width / 2) - (popoutRect.width / 2)
        
        if (left < 10) left = 10
        if (left + popoutRect.width > window.innerWidth - 10) {
          left = window.innerWidth - popoutRect.width - 10
        }
        
        let top = targetRect.bottom + 15
        this.isBelow = true
        
        if (top + popoutRect.height > window.innerHeight - 20) {
          top = targetRect.top - popoutRect.height - 15
          this.isBelow = false
        }
        
        this.popoutStyle = {
          left: left + 'px',
          top: top + 'px',
          position: 'fixed'
        }
      })
    },
    
    show() {
      this.isVisible = true
      this.$nextTick(() => {
        this.positionPopout()
      })
    },
    
    hide() {
      this.isVisible = false
    },
    
    closePopout() {
      this.hide()
      this.$emit('close')
    },
    
    handleKeyDown(e) {
      if (e.key === 'Escape' && this.isVisible) {
        this.closePopout()
      }
    },
    
    onPopoutEnter() {
      this.$emit('popout-enter')
    },
    
    onPopoutLeave() {
      this.$emit('popout-leave')
    },
    
    handleImageError(e) {
      e.target.style.display = 'none'
    },
    
    handleIconError(e) {
      e.target.style.display = 'none'
    },
    
    handleAvatarError(e) {
      e.target.src = `https://github.com/${this.currentUsername}.png`
    }
  }
}
</script>


<style scoped>
/* ===== STILURI DE BAZĂ ===== */
.github-popout {
  position: absolute;
  z-index: 9999;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
  pointer-events: none;
}

.popout-arrow {
  position: absolute;
  width: 14px;
  height: 14px;
  background: #1a1a1a;
  transform: rotate(45deg);
  bottom: -7px;
  left: 50%;
  margin-left: -7px;
  border-bottom: 2px solid #ff7800;
  border-right: 2px solid #ff7800;
  border-radius: 2px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s ease;
}

html:not(.dark) .popout-arrow {
  background: #ffffff;
  border-bottom-color: #ff8a1f;
  border-right-color: #ff8a1f;
}

.popout-arrow.below {
  top: -7px;
  bottom: auto;
  transform: rotate(45deg);
  border-top: 2px solid #ff7800;
  border-left: 2px solid #ff7800;
  border-bottom: none;
  border-right: none;
}

html:not(.dark) .popout-arrow.below {
  border-top-color: #ff8a1f;
  border-left-color: #ff8a1f;
}

.github-popout.visible .popout-arrow {
  opacity: 1;
}

.popout-enter-active {
  animation: fadeInScale 0.2s ease;
}

.popout-leave-active {
  animation: fadeOutScale 0.15s ease;
}

@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.95) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes fadeOutScale {
  0% { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.95) translateY(5px); }
}

.popout-content {
  background: linear-gradient(135deg, #1a0f0a, #2a150a, #1f0f05);
  border: 2px solid #ff7800;
  border-radius: 18px;
  padding: 14px 12px 12px 12px;
  width: 282px;
  color: white;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
  background: rgba(26, 10, 5, 0.95);
  transform-origin: top center;
  will-change: transform, opacity;
  overflow: hidden;
  pointer-events: auto;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45), 0 0 24px rgba(255, 120, 0, 0.12);
}

html:not(.dark) .popout-content {
  background: rgba(255, 252, 248, 0.97);
  border-color: rgba(255, 138, 31, 0.7);
  color: #2b1608;
  box-shadow: 0 10px 30px rgba(17, 12, 8, 0.16), 0 0 20px rgba(255, 140, 0, 0.12);
}

.popout-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 120, 0, 0.15), transparent 70%),
              radial-gradient(circle at 70% 80%, rgba(255, 140, 0, 0.1), transparent 70%);
  pointer-events: none;
  z-index: -1;
  animation: fireGlow 3s ease-in-out infinite;
}

@keyframes fireGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.7; }
}

.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.background-logo {
  position: absolute;
  width: 100px;
  height: 100px;
  opacity: 0.08;
  filter: brightness(0) invert(1) drop-shadow(0 0 3px #ff7800);
  animation: floatWildfire 12s ease-in-out infinite;
}

.background-logo.main {
  bottom: -10px;
  right: -10px;
  width: 130px;
  height: 130px;
  opacity: 0.1;
  transform: rotate(5deg);
  animation: floatMain 15s ease-in-out infinite;
}

.background-logo.secondary {
  top: -20px;
  left: -20px;
  width: 110px;
  height: 110px;
  opacity: 0.06;
  transform: rotate(-8deg);
  animation: floatSecondary 18s ease-in-out infinite;
}

.background-logo.tertiary {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(15deg);
  width: 150px;
  height: 150px;
  opacity: 0.03;
  filter: blur(3px) brightness(0) invert(1);
  animation: floatTertiary 25s ease-in-out infinite;
}

@keyframes floatMain {
  0%, 100% { transform: rotate(5deg) translateY(0); }
  50% { transform: rotate(8deg) translateY(-8px); }
}

@keyframes floatSecondary {
  0%, 100% { transform: rotate(-8deg) translateY(0); }
  50% { transform: rotate(-12deg) translateY(8px); }
}

@keyframes floatTertiary {
  0%, 100% { transform: translate(-50%, -50%) rotate(15deg) scale(1); }
  50% { transform: translate(-50%, -50%) rotate(25deg) scale(1.1); }
}

.fire-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  opacity: 0.4;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ff7800;
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0;
  animation: particleFloat 4s ease-in-out infinite;
}

.particle:nth-child(1) { left: 20%; top: 30%; animation-delay: 0s; }
.particle:nth-child(2) { left: 70%; top: 60%; animation-delay: 0.7s; }
.particle:nth-child(3) { left: 40%; top: 80%; animation-delay: 1.3s; }
.particle:nth-child(4) { left: 85%; top: 20%; animation-delay: 2s; }
.particle:nth-child(5) { left: 15%; top: 70%; animation-delay: 2.7s; }

@keyframes particleFloat {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  25% {
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.5);
    opacity: 0.2;
  }
  75% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(-40px) scale(1);
    opacity: 0;
  }
}

.popout-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 120, 0, 0.15);
  border: 1px solid #ff7800;
  color: #ff7800;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  z-index: 3;
  backdrop-filter: blur(5px);
}

html:not(.dark) .popout-close {
  background: rgba(255, 140, 0, 0.08);
  border-color: rgba(255, 140, 0, 0.65);
  color: #cc5a00;
}

.popout-close:hover {
  background: rgba(255, 120, 0, 0.3);
  color: white;
  transform: rotate(90deg);
  box-shadow: 0 0 10px #ff7800;
}

.popout-loading {
  text-align: center;
  padding: 20px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 140, 0, 0.1);
  border-top-color: #ff7800;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.popout-error {
  text-align: center;
  padding: 20px;
  color: #ff6b6b;
}

.error-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
  display: inline-flex;
  color: #ff9a4d;
  opacity: 1;
}

/* ===== HEADER ===== */
.popout-hero {
  position: relative;
  margin-bottom: 8px;
}

.mini-profile-banner {
  position: relative;
  height: 102px;
  border-radius: 12px;
  margin: 0;
  border: 1px solid rgba(255, 140, 0, 0.35);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.mini-banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.56) 100%);
}

.hero-avatar {
  position: absolute;
  left: 50%;
  bottom: -20px;
  transform: translateX(-50%);
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 2px solid #ff8f2a;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.45), 0 0 0 3px rgba(12, 7, 4, 0.9);
  background: #120a06;
  transition: none !important;
  animation: none !important;
  will-change: auto;
}

.hero-avatar:hover,
.hero-avatar:focus,
.hero-avatar:active {
  transform: translateX(-50%) !important;
  transition: none !important;
  animation: none !important;
}

.identity-block {
  margin-top: 30px;
  margin-bottom: 10px;
}

.name-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 8px;
}

.popout-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid #ff8f2a;
  box-shadow: 0 0 8px rgba(255, 140, 0, 0.22);
  transition: none;
}

.popout-avatar:hover {
  transform: none;
  box-shadow: 0 0 8px rgba(255, 140, 0, 0.22);
}

.username-link {
  color: #ff7800;
  text-decoration: none;
  font-size: 11px;
  text-align: center;
  max-width: 100%;
  overflow-wrap: anywhere;
  background: rgba(0, 0, 0, 0.28);
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 140, 0, 0.28);
  margin-top: 2px;
}

html:not(.dark) .username-link {
  background: rgba(255, 255, 255, 0.75);
  color: #b24d00;
  border-color: rgba(255, 140, 0, 0.35);
}

.username-link:hover {
  color: #ffaa33;
  border-color: #ffaa33;
}

.name-row h3 {
  margin: 0 0 4px 0;
  font-size: 22px;
  font-weight: 600;
  color: white;
  line-height: 1.15;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}

html:not(.dark) .name-row h3 {
  color: #2a1a10;
  text-shadow: none;
}

/* ===== TAGS - MAI MARI, CU LUMINĂ SUBTILĂ ===== */
.square-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.square-tags .square-tag {
  display: none;
}

.square-tags.show-staff .tag-staff,
.square-tags.show-dev .tag-dev,
.square-tags.show-wiki .tag-wiki,
.square-tags.show-trusted .tag-trusted,
.square-tags.show-pro .tag-pro,
.square-tags.show-vip .tag-vip,
.square-tags.show-founder .tag-founder,
.square-tags.show-admin .tag-admin,
.square-tags.show-mod .tag-mod,
.square-tags.show-supporter .tag-supporter,
.square-tags.show-booster .tag-booster,
.square-tags.show-partner .tag-partner,
.square-tags.show-contributor .tag-contributor,
.square-tags.show-wildfire .tag-wildfire {
  display: inline-flex !important;
}

.square-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px 4px 8px;
  border-radius: 14px 4px 14px 4px;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1;
  color: #e0e0e0;
  
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(25, 25, 25, 0.6);
  box-shadow: 0 0 5px rgba(255, 140, 0, 0.1);
  transition: all 0.2s ease;
}

html:not(.dark) .square-tag {
  color: #5f4028;
  background: rgba(255, 255, 255, 0.84);
  border-color: rgba(255, 140, 0, 0.26);
  box-shadow: 0 1px 4px rgba(255, 140, 0, 0.08);
}

/* Lumini subtile pentru fiecare tag */
.square-tag.tag-staff { 
  border-color: rgba(46, 204, 113, 0.3); 
  box-shadow: 0 0 5px rgba(46, 204, 113, 0.1);
}
.square-tag.tag-staff:hover { border-color: rgba(46, 204, 113, 0.5); }
html:not(.dark) .square-tag.tag-staff {
  border-color: rgba(46, 204, 113, 0.35);
  color: #1f7a46;
}

.square-tag.tag-dev { 
  border-color: rgba(52, 152, 219, 0.3);
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.1);
}
.square-tag.tag-dev:hover { border-color: rgba(52, 152, 219, 0.5); }
html:not(.dark) .square-tag.tag-dev {
  border-color: rgba(52, 152, 219, 0.36);
  color: #246ea4;
}

.square-tag.tag-wiki { 
  border-color: rgba(26, 188, 156, 0.3);
  box-shadow: 0 0 5px rgba(26, 188, 156, 0.1);
}
.square-tag.tag-wiki:hover { border-color: rgba(26, 188, 156, 0.5); }
html:not(.dark) .square-tag.tag-wiki {
  border-color: rgba(26, 188, 156, 0.36);
  color: #1f7a69;
}

.square-tag.tag-trusted { 
  border-color: rgba(241, 196, 15, 0.3); 
  color: #f1c40f;
  box-shadow: 0 0 5px rgba(241, 196, 15, 0.1);
}
.square-tag.tag-trusted:hover { border-color: rgba(241, 196, 15, 0.5); }
html:not(.dark) .square-tag.tag-trusted {
  border-color: rgba(241, 196, 15, 0.38);
  color: #a57a00;
}

.square-tag.tag-pro { 
  border-color: rgba(255, 120, 0, 0.3);
  box-shadow: 0 0 5px rgba(255, 120, 0, 0.1);
}
.square-tag.tag-pro:hover { border-color: rgba(255, 120, 0, 0.5); }
html:not(.dark) .square-tag.tag-pro {
  border-color: rgba(255, 120, 0, 0.36);
  color: #b24d00;
}

.square-tag.tag-vip { 
  border-color: rgba(155, 89, 182, 0.3);
  box-shadow: 0 0 5px rgba(155, 89, 182, 0.1);
}
.square-tag.tag-vip:hover { border-color: rgba(155, 89, 182, 0.5); }
html:not(.dark) .square-tag.tag-vip {
  border-color: rgba(155, 89, 182, 0.36);
  color: #6f4091;
}

.square-tag.tag-founder { 
  border-color: rgba(231, 76, 60, 0.3);
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.1);
}
.square-tag.tag-founder:hover { border-color: rgba(231, 76, 60, 0.5); }
html:not(.dark) .square-tag.tag-founder {
  border-color: rgba(231, 76, 60, 0.35);
  color: #a33c2f;
}

.square-tag.tag-admin { 
  border-color: rgba(192, 57, 43, 0.3);
  box-shadow: 0 0 5px rgba(192, 57, 43, 0.1);
}
.square-tag.tag-admin:hover { border-color: rgba(192, 57, 43, 0.5); }
html:not(.dark) .square-tag.tag-admin {
  border-color: rgba(192, 57, 43, 0.35);
  color: #8c3228;
}

.square-tag.tag-mod { 
  border-color: rgba(22, 160, 133, 0.3);
  box-shadow: 0 0 5px rgba(22, 160, 133, 0.1);
}
.square-tag.tag-mod:hover { border-color: rgba(22, 160, 133, 0.5); }
html:not(.dark) .square-tag.tag-mod {
  border-color: rgba(22, 160, 133, 0.35);
  color: #1f7765;
}

.square-tag.tag-supporter { 
  border-color: rgba(243, 156, 18, 0.3);
  box-shadow: 0 0 5px rgba(243, 156, 18, 0.1);
}
.square-tag.tag-supporter:hover { border-color: rgba(243, 156, 18, 0.5); }
html:not(.dark) .square-tag.tag-supporter {
  border-color: rgba(243, 156, 18, 0.35);
  color: #a35f16;
}

.square-tag.tag-booster { 
  border-color: rgba(142, 68, 173, 0.3);
  box-shadow: 0 0 5px rgba(142, 68, 173, 0.1);
}
.square-tag.tag-booster:hover { border-color: rgba(142, 68, 173, 0.5); }
html:not(.dark) .square-tag.tag-booster {
  border-color: rgba(142, 68, 173, 0.35);
  color: #6a3d89;
}

.square-tag.tag-partner { 
  border-color: rgba(44, 62, 80, 0.3);
  box-shadow: 0 0 5px rgba(44, 62, 80, 0.1);
}
.square-tag.tag-partner:hover { border-color: rgba(44, 62, 80, 0.5); }
html:not(.dark) .square-tag.tag-partner {
  border-color: rgba(44, 62, 80, 0.35);
  color: #3e4f61;
}

.square-tag.tag-contributor { 
  border-color: rgba(127, 140, 141, 0.3);
  box-shadow: 0 0 5px rgba(127, 140, 141, 0.1);
}
.square-tag.tag-contributor:hover { border-color: rgba(127, 140, 141, 0.5); }
html:not(.dark) .square-tag.tag-contributor {
  border-color: rgba(127, 140, 141, 0.35);
  color: #55696b;
}

.square-tag.tag-wildfire { 
  border-color: rgba(255, 140, 0, 0.5); 
  color: #ffaa33;
  box-shadow: 0 0 8px rgba(255, 140, 0, 0.15);
}
.square-tag.tag-wildfire:hover { 
  border-color: rgba(255, 140, 0, 0.7);
  box-shadow: 0 0 10px rgba(255, 140, 0, 0.2);
}
html:not(.dark) .square-tag.tag-wildfire {
  border-color: rgba(255, 140, 0, 0.45);
  color: #bf5a00;
  box-shadow: 0 0 6px rgba(255, 140, 0, 0.12);
}

.tag-icon {
  width: 10px;
  height: 10px;
  opacity: 1;
  filter: none;
  object-fit: contain;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  color: #ffb25a;
  display: inline-flex;
  transition: all 0.2s ease;
}

.square-tag:hover .tag-icon {
  opacity: 1;
}

/* ===== BIO ȘI STATS ===== */
.popout-bio {
  font-size: 11px;
  line-height: 1.4;
  color: #bbb;
  margin-bottom: 12px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border-left: 2px solid #ff7800;
  border: 1px solid rgba(255, 140, 0, 0.1);
}

html:not(.dark) .popout-bio {
  background: rgba(255, 255, 255, 0.72);
  color: #5a412f;
  border-color: rgba(255, 140, 0, 0.2);
}

.popout-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 1px solid rgba(255, 140, 0, 0.1);
}

html:not(.dark) .popout-stats {
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(255, 140, 0, 0.22);
}

.popout-stats div {
  text-align: center;
}

.popout-stats strong {
  display: block;
  color: #ffaa33;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.popout-stats span {
  font-size: 8px;
  color: #888;
  text-transform: uppercase;
}

html:not(.dark) .popout-stats span {
  color: #86674d;
}

/* ===== CONTRIBUȚII SIMPLE ===== */
.contributions-simple {
  margin: 8px 0 12px 0;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  border: 1px solid rgba(255, 140, 0, 0.1);
}

html:not(.dark) .contributions-simple {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 140, 0, 0.2);
}

.simple-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.simple-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  color: #ccc;
}

.simple-icon {
  width: 12px;
  height: 12px;
  opacity: 1;
  color: #ffb25a;
  display: inline-flex;
}

.simple-count {
  font-weight: 600;
  color: #ffaa33;
}

.simple-label {
  font-size: 8px;
  opacity: 0.6;
  text-transform: uppercase;
}

.simple-repo {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
  font-size: 8px;
}

.simple-repo-icon {
  color: #ff7800;
  opacity: 0.9;
}

.simple-repo a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

html:not(.dark) .simple-repo,
html:not(.dark) .simple-repo a {
  color: #7a5d45;
}

.simple-repo a:hover {
  color: #ffaa33;
}

/* ===== DETAILS ===== */
.popout-details-minimal {
  margin-bottom: 10px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 4px 8px;
  border: 1px solid rgba(255, 140, 0, 0.1);
  width: fit-content;
  max-width: 100%;
}

html:not(.dark) .popout-details-minimal {
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(255, 140, 0, 0.22);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
  color: #aaa;
  font-size: 9px;
  border-bottom: 1px dashed rgba(255, 140, 0, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-icon {
  width: 14px;
  height: 14px;
  color: #ffb25a;
  opacity: 1;
  flex: 0 0 auto;
  display: inline-flex;
  filter: drop-shadow(0 0 3px rgba(255, 120, 0, 0.35));
}

.detail-text {
  color: #ccc;
}

html:not(.dark) .detail-text {
  color: #6a4f3a;
}

/* ===== BUTTON CU EFECT SUBTIL ===== */
.popout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  background: #252525;
  color: #ffaa33;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  font-size: 11px;
  transition: all 0.25s ease;
  border: 1px solid rgba(255, 140, 0, 0.2);
  position: relative;
  overflow: hidden;
}

html:not(.dark) .popout-button {
  background: #f6f7fb;
  color: #c55a00;
  border-color: rgba(255, 140, 0, 0.3);
}

.button-text {
  position: relative;
  z-index: 2;
  transition: transform 0.25s ease;
}

.button-arrow {
  position: relative;
  z-index: 2;
  width: 14px;
  height: 14px;
  display: inline-flex;
  color: currentColor;
  transition: transform 0.25s ease;
  filter: drop-shadow(0 0 2px rgba(255, 180, 90, 0.3));
}

.error-icon :deep(svg),
.tag-icon :deep(svg),
.simple-icon :deep(svg),
.detail-icon :deep(svg),
.button-arrow :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 1 !important;
  color: currentColor;
  fill: currentColor;
  stroke: currentColor;
}

/* Efect de lumină subtilă la hover */
.popout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.2), transparent);
  transition: left 0.5s ease;
  z-index: 1;
}

.popout-button:hover {
  background: #2a2a2a;
  border-color: rgba(255, 140, 0, 0.4);
  color: #ffbb55;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
}

html:not(.dark) .popout-button:hover {
  background: #f0f3fa;
  border-color: rgba(255, 140, 0, 0.45);
  color: #df6a00;
}

.popout-button:hover::before {
  left: 100%;
}

.popout-button:hover .button-arrow {
  transform: translateX(3px);
}

.popout-button:active {
  transform: translateY(0);
}
</style>