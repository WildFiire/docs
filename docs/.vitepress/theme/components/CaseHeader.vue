<template>
  <div class="cases-wf">
    <!-- Background image container with floating cases -->
    <div class="hero-container">
      <!-- Blurred background -->
      <div class="blurred-bg" :style="{ filter: `blur(${blurAmount}px) brightness(var(--bg-brightness, 0.7))` }">
        <img :src="background" alt="background">
      </div>
      
      <!-- Floating Icons Container -->
      <div class="floating-icons-container">
        <div 
          v-for="(icon, index) in computedFloatingIcons" 
          :key="index"
          :class="['floating-icon', `icon-${index + 1}`]"
        >
          <img :src="icon.src" :alt="icon.alt" :style="icon.style">
        </div>
      </div>
      
      <!-- Gradient overlay for better contrast -->
      <div class="gradient-overlay"></div>
      
      <!-- Content -->
      <div class="content">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <div class="breadcrumb-items">
            <Icon icon="lucide:home" :size="11" class="home-icon" />
            <template v-for="(item, idx) in path" :key="idx">
              <span :class="['orbitron-font', { 'active': idx === path.length - 1 }]">
                {{ item }}
              </span>
              <span v-if="idx < path.length - 1" class="separator">
                <Icon icon="lucide:chevron-right" :size="11" />
              </span>
            </template>
          </div>
          <div class="right-badges">
            <div class="viewers-count">
              <Icon icon="lucide:eye" :size="11" />
              <span class="orbitron-font">{{ viewCount }}</span>
            </div>
            <div class="badge">
              <Icon :icon="badgeIcon" :size="11" />
              <span class="orbitron-font">{{ badgeText }}</span>
            </div>
          </div>
        </div>
        
        <!-- Title Section -->
        <div class="title-section">
          <img :src="icon" alt="Wildfire.ro" class="title-icon">
          <h1 class="orbitron-font gradient-text">{{ title }}</h1>
        </div>
        
        <!-- Footer Section -->
        <div class="footer-section">
          <div class="tags">
            <img src="/icons/tag.svg" alt="tag" class="tag-icon">
            <component 
              :is="tag.component" 
              v-for="(tag, idx) in tags" 
              :key="idx"
              class="orbitron-font tag"
            >
              {{ tag.text }}
            </component>
          </div>
          <div class="updated-by">
            <span class="orbitron-font">{{ updatedByText }}</span>
            <a 
              :href="`https://github.com/${updatedByUsername}`" 
              target="_blank" 
              class="github-profile"
              :data-username="updatedByUsername"
              :data-tags="'show-wildfire show-dev show-wiki show-staff'"
            >
              <img :src="`https://github.com/${updatedByUsername}.png`" :alt="updatedByUsername">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

// Props definition
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Cases'
  },
  tags: {
    type: Array,
    default: () => [
      { text: 'cases', component: 'PageTagRed' },
      { text: 'skins', component: 'PageTagBlue' },
      { text: 'market', component: 'PageTagGreen' },
      { text: 'website', component: 'PageTagPurple' }
    ]
  },
  path: {
    type: Array,
    default: () => ['Home', 'Systems', 'Cases']
  },
  background: {
    type: String,
    default: '/wallpaper/backgroundwf.webp'
  },
  blurAmount: {
    type: Number,
    default: 6
  },
  icon: {
    type: String,
    default: '/icons/wildfire.webp'
  },
  floatingIcons: {
    type: Array,
    default: () => []
  },
  updatedByUsername: {
    type: String,
    default: 'iannc69'
  },
  updatedByText: {
    type: String,
    default: 'updated by'
  },
  badgeText: {
    type: String,
    default: 'Case Opening'
  },
  badgeIcon: {
    type: String,
    default: 'lucide:box'
  },
  pageId: {
    type: String,
    default: 'default-page'
  }
})

// View counter logic
const viewCount = ref(0)
const STORAGE_KEY = 'wildfire_page_views'

// Function to get and increment view count - cu cooldown 1 oră
const updateViewCount = () => {
  try {
    // Get existing views from localStorage
    let views = localStorage.getItem(STORAGE_KEY)
    
    if (views) {
      views = JSON.parse(views)
    } else {
      views = {}
    }
    
    // MIGRARE: Convert old format (number) to new format (object)
    if (views[props.pageId] !== undefined && typeof views[props.pageId] !== 'object') {
      const oldCount = views[props.pageId]
      views[props.pageId] = {
        count: oldCount,
        lastUpdate: Date.now()
      }
    }
    
    // Initialize page data if doesn't exist
    if (!views[props.pageId]) {
      views[props.pageId] = {
        count: 0,
        lastUpdate: 0
      }
    }
    
    const now = Date.now()
    const COOLDOWN_MS = 60 * 60 * 1000 // 1 oră
    
    // Verifică dacă a trecut cooldown-ul SAU e prima vizită (lastUpdate = 0)
    if (views[props.pageId].lastUpdate === 0 || (now - views[props.pageId].lastUpdate >= COOLDOWN_MS)) {
      // Crește count-ul
      views[props.pageId].count++
      views[props.pageId].lastUpdate = now
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
    }
    
    viewCount.value = views[props.pageId].count
  } catch (error) {
    console.error('Error updating view count:', error)
    viewCount.value = 0
  }
}
// Initialize view counter
onMounted(() => {
  updateViewCount()
})

// Generate floating icons (default or custom)
const computedFloatingIcons = computed(() => {
  if (props.floatingIcons && props.floatingIcons.length > 0) {
    return props.floatingIcons.map((icon, idx) => ({
      src: icon.src,
      alt: icon.alt || 'floating icon',
      style: {
        width: icon.width || '55px',
        opacity: icon.opacity || '0.25',
        filter: `drop-shadow(0 0 ${icon.shadowSize || '12px'} rgba(255,69,0,${icon.shadowOpacity || '0.4'}))`
      }
    }))
  }
  
  return [
    { src: '/icons/wildfire.webp', alt: 'wildfire', style: { width: '55px', opacity: '0.25', filter: 'drop-shadow(0 0 12px rgba(255,69,0,0.4))' } },
    { src: '/icons/wildfire.webp', alt: 'wildfire', style: { width: '75px', opacity: '0.2', filter: 'drop-shadow(0 0 18px rgba(255,69,0,0.3))' } },
    { src: '/icons/wildfire.webp', alt: 'wildfire', style: { width: '45px', opacity: '0.3', filter: 'drop-shadow(0 0 10px rgba(255,69,0,0.5))' } },
    { src: '/icons/wildfire.webp', alt: 'wildfire', style: { width: '65px', opacity: '0.18', filter: 'drop-shadow(0 0 14px rgba(255,69,0,0.35))' } },
    { src: '/icons/wildfire.webp', alt: 'wildfire', style: { width: '50px', opacity: '0.28', filter: 'drop-shadow(0 0 12px rgba(255,69,0,0.45))' } },
    { src: '/icons/wildfire.webp', alt: 'wildfire', style: { width: '85px', opacity: '0.15', filter: 'drop-shadow(0 0 22px rgba(255,69,0,0.25))' } }
  ]
})
</script>

<style scoped>
/* Tot CSS-ul de mai rămâne la fel */
.cases-wf {
  width: 100%;
}

.hero-container {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  margin-bottom: 24px;
  min-height: 200px;
  background-color: var(--vp-c-bg);
  border: 1px solid rgba(255, 69, 0, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

html.dark .hero-container {
  border-color: rgba(255, 69, 0, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.1);
}

.hero-container:hover {
  border-color: rgba(255, 69, 0, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

html.dark .hero-container:hover {
  border-color: rgba(255, 69, 0, 0.5);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.15);
}

.blurred-bg {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  z-index: 0;
  transform: scale(1.1);
}

.blurred-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: var(--bg-opacity, 0.45);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: linear-gradient(135deg, 
    rgba(255, 69, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(255, 69, 0, 0.05) 100%
  );
  pointer-events: none;
}

html.dark .gradient-overlay {
  background: linear-gradient(135deg, 
    rgba(255, 69, 0, 0.08) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(255, 69, 0, 0.08) 100%
  );
}

html:not(.dark) .gradient-overlay {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.4) 100%
  );
}

.floating-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  animation: floatAround 25s infinite ease-in-out;
  will-change: transform;
}

.icon-1 {
  top: 8%;
  left: 2%;
  animation-duration: 28s;
  animation-delay: 0s;
}

.icon-2 {
  top: 15%;
  right: 5%;
  animation-duration: 32s;
  animation-delay: -4s;
}

.icon-3 {
  bottom: 12%;
  left: 8%;
  animation-duration: 26s;
  animation-delay: -8s;
}

.icon-4 {
  top: 45%;
  right: 12%;
  animation-duration: 35s;
  animation-delay: -3s;
}

.icon-5 {
  bottom: 35%;
  right: 3%;
  animation-duration: 30s;
  animation-delay: -12s;
}

.icon-6 {
  top: 65%;
  left: 10%;
  animation-duration: 27s;
  animation-delay: -7s;
}

@keyframes floatAround {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(calc(100% - 120px), calc(-15%)) rotate(6deg);
  }
  40% {
    transform: translate(calc(-80%), calc(40% - 60px)) rotate(-5deg);
  }
  60% {
    transform: translate(calc(110% - 100px), calc(20%)) rotate(7deg);
  }
  80% {
    transform: translate(calc(-60%), calc(70% - 80px)) rotate(-4deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.content {
  position: relative;
  z-index: 2;
  padding: 32px 32px 24px 32px;
  border-radius: 28px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.breadcrumb-items {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 69, 0, 0.25);
}

html.dark .breadcrumb-items {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 69, 0, 0.35);
}

html:not(.dark) .breadcrumb-items {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 69, 0, 0.2);
}

.home-icon {
  color: var(--vp-c-brand-1);
  opacity: 0.9;
}

.breadcrumb-items span {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  font-size: 11px;
}

.breadcrumb-items span.active {
  color: var(--vp-c-text-2);
  opacity: 0.8;
}

.separator {
  display: inline-flex;
  align-items: center;
  color: var(--vp-c-brand-1);
  opacity: 0.5;
}

.right-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.viewers-count {
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 69, 0, 0.4);
  font-weight: 600;
}

html.dark .viewers-count {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 69, 0, 0.5);
}

html:not(.dark) .viewers-count {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 69, 0, 0.35);
}

.viewers-count span {
  font-size: 11px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.viewers-count :deep(svg) {
  color: var(--vp-c-brand-1);
  opacity: 0.9;
}

.badge {
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 69, 0, 0.4);
}

html.dark .badge {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 69, 0, 0.5);
}

html:not(.dark) .badge {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 69, 0, 0.35);
}

.badge span {
  font-size: 11px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.badge :deep(svg) {
  color: var(--vp-c-brand-1);
  opacity: 0.9;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.title-icon {
  width: 56px;
  margin: 0;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.title-icon:hover {
  transform: scale(1.02);
}

.gradient-text {
  font-size: 32px;
  margin: 0;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2), #ff8c00, var(--vp-c-brand-1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 200%;
  animation: gradientShift 8s ease infinite;
  font-weight: 700;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.footer-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  border-top: 1px solid rgba(255, 69, 0, 0.25);
  padding-top: 16px;
  margin-top: 4px;
}

.tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%);
  user-select: none;
  margin-right: 6px;
}

html.dark .tag-icon {
  filter: brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
}

html:not(.dark) .tag-icon {
  filter: brightness(0) saturate(100%) invert(30%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
}

.tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 69, 0, 0.15);
}

.tag:hover {
  transform: translateY(-1px);
  filter: brightness(1.02);
  border-color: rgba(255, 69, 0, 0.3);
}

.updated-by {
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(4px);
  padding: 4px 14px 4px 16px;
  border-radius: 32px;
  border: 1px solid rgba(255, 69, 0, 0.3);
  transition: all 0.2s ease;
}

.updated-by:hover {
  border-color: rgba(255, 69, 0, 0.5);
}

html.dark .updated-by {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 69, 0, 0.4);
}

html:not(.dark) .updated-by {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 69, 0, 0.3);
}

.updated-by span {
  font-size: 11px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.github-profile {
  display: block;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 69, 0, 0.4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.github-profile:hover {
  transform: scale(1.08);
  border-color: rgba(255, 69, 0, 0.7);
}

.github-profile img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: block;
  user-select: none;
}

.cases-wf:hover .floating-icon img {
  opacity: 0.45;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .hero-container {
    border-radius: 20px;
    min-height: 160px;
  }
  
  .content {
    padding: 20px 20px 16px 20px;
  }
  
  .gradient-text {
    font-size: 26px;
  }
  
  .title-icon {
    width: 44px;
  }
  
  .breadcrumb-items {
    padding: 3px 10px;
  }
  
  .breadcrumb-items span {
    font-size: 10px;
  }
  
  .viewers-count, .badge {
    padding: 3px 8px;
  }
  
  .viewers-count span, .badge span {
    font-size: 10px;
  }
  
  .tag {
    font-size: 10px;
    padding: 2px 8px;
  }
  
  .updated-by {
    padding: 3px 12px 3px 14px;
  }
  
  .updated-by span {
    font-size: 10px;
  }
  
  .github-profile img {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 640px) {
  .hero-container {
    border-radius: 18px;
    min-height: 140px;
  }
  
  .content {
    padding: 16px 16px 12px 16px;
  }
  
  .breadcrumb {
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .breadcrumb-items {
    padding: 2px 8px;
  }
  
  .breadcrumb-items span {
    font-size: 9px;
  }
  
  .viewers-count, .badge {
    padding: 2px 7px;
  }
  
  .viewers-count span, .badge span {
    font-size: 9px;
  }
  
  .title-section {
    gap: 8px;
    margin-bottom: 14px;
  }
  
  .gradient-text {
    font-size: 22px;
  }
  
  .title-icon {
    width: 38px;
  }
  
  .footer-section {
    gap: 12px;
    padding-top: 12px;
  }
  
  .tags {
    gap: 6px;
  }
  
  .tag-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  
  .tag {
    font-size: 9px;
    padding: 2px 6px;
  }
  
  .updated-by {
    padding: 2px 10px 2px 12px;
  }
  
  .updated-by span {
    font-size: 9px;
  }
  
  .github-profile img {
    width: 20px;
    height: 20px;
  }
  
  .floating-icon img {
    width: 28px !important;
  }
  
  .icon-2 img, .icon-6 img {
    width: 35px !important;
  }
  
  @keyframes floatAround {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(calc(50% - 50px), calc(-8%)) rotate(4deg);
    }
    50% {
      transform: translate(calc(-40%), calc(25% - 30px)) rotate(-3deg);
    }
    75% {
      transform: translate(calc(60% - 40px), calc(12%)) rotate(5deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }
}

@media (max-width: 480px) {
  .hero-container {
    border-radius: 16px;
    min-height: 120px;
  }
  
  .content {
    padding: 12px 12px 10px 12px;
  }
  
  .breadcrumb {
    gap: 6px;
    margin-bottom: 10px;
  }
  
  .breadcrumb-items {
    padding: 2px 6px;
  }
  
  .breadcrumb-items span {
    font-size: 8px;
  }
  
  .viewers-count, .badge {
    padding: 2px 5px;
  }
  
  .viewers-count span, .badge span {
    font-size: 8px;
  }
  
  .title-section {
    gap: 6px;
    margin-bottom: 10px;
  }
  
  .gradient-text {
    font-size: 18px;
  }
  
  .title-icon {
    width: 32px;
  }
  
  .footer-section {
    gap: 8px;
    padding-top: 10px;
  }
  
  .tags {
    gap: 4px;
  }
  
  .tag-icon {
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  
  .tag {
    font-size: 8px;
    padding: 2px 5px;
  }
  
  .updated-by {
    padding: 2px 8px 2px 10px;
  }
  
  .updated-by span {
    font-size: 8px;
  }
  
  .github-profile img {
    width: 18px;
    height: 18px;
  }
  
  .floating-icon img {
    width: 22px !important;
  }
  
  .icon-2 img, .icon-6 img {
    width: 28px !important;
  }
}
</style>