<!-- .vitepress/theme/components/AboutWiki.vue -->
<template>
  <section class="wiki-showcase reveal-element orbitron-font" ref="wikiSectionRef" id="wiki-section">
    <div class="section-divider">
      <span class="divider-line"></span>
      <img src="/icons/wildfire.webp" alt="divider" class="divider-icon" width="24" height="24" />
      <span class="divider-line"></span>
    </div>

    <div class="wiki-layout">
      <div class="wiki-left reveal-element orbitron-font" ref="wikiLeftRef">
        <div class="wiki-header">
          <div class="wiki-left-line">
            <span class="line"></span>
            <span class="text typing-text orbitron-font" :class="{ 'typing-complete': wikiHeaderTyped }">{{ displayWikiHeader }}<span v-if="!wikiHeaderTyped" class="cursor"></span></span>
          </div>
          <h2 class="wiki-title typing-text orbitron-font" :class="{ 'typing-complete': wikiTitleTyped }">{{ displayWikiTitle }}<span v-if="!wikiTitleTyped" class="cursor"></span></h2>
        </div>
        
        <div class="wiki-description">
          <p class="typing-text orbitron-font" :class="{ 'typing-complete': wikiDescTyped }">{{ displayWikiDesc }}<span v-if="!wikiDescTyped" class="cursor"></span></p>
        </div>
        
        <div class="wiki-cta">
          <a href="informatii/about" class="wiki-cta-link orbitron-font">
            <span class="typing-text orbitron-font" :class="{ 'typing-complete': wikiCTATyped }">{{ displayWikiCTA }}<span v-if="!wikiCTATyped" class="cursor"></span></span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="wiki-right">
        <!-- Primul rând - 3 carduri -->
        <div class="wiki-row">
          <div class="wiki-card reveal-element orbitron-font" ref="card1Ref" v-if="categoryCounts.systems > 0">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="5" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="7" cy="11" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title orbitron-font">Regulamente</h3>
              <p class="card-desc orbitron-font">Toate regulile și normele de comportament pentru comunitate</p>
              <div class="card-footer">
                <span class="card-badge orbitron-font">{{ categoryCounts.systems }} pagini</span>
                <a href="/informatii/regulamente/go/regulament-go" class="card-link" aria-label="Regulamente - Vezi pagina">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div class="wiki-card reveal-element orbitron-font" ref="card2Ref" v-if="categoryCounts.regulamente > 0">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 3L14 8H19L16 12L18 17L11 14L4 17L6 12L3 8H8L11 3Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title orbitron-font">Sisteme</h3>
              <p class="card-desc orbitron-font">Sisteme specifice serverului și funcționalități unice</p>
              <div class="card-footer">
                <span class="card-badge orbitron-font">{{ categoryCounts.regulamente }} pagini</span>
                <a href="/systems/skins/knives" class="card-link" aria-label="Sisteme - Vezi pagina">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div class="wiki-card reveal-element orbitron-font" ref="card3Ref" v-if="categoryCounts.market > 0">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M11 7V11L14 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title orbitron-font">Shop</h3>
              <p class="card-desc orbitron-font">Toate informațiile despre marketplace-ul serverului</p>
              <div class="card-footer">
                <span class="card-badge orbitron-font">{{ categoryCounts.market }} pagini</span>
                <a href="/market/payment-methods" class="card-link" aria-label="Shop - Vezi pagina">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Al doilea rând - 3 carduri -->
        <div class="wiki-row" v-if="categoryCounts.info > 0 || categoryCounts.currency > 0 || categoryCounts.vip > 0">
          <div class="wiki-card reveal-element orbitron-font" ref="card4Ref" v-if="categoryCounts.info > 0">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 7H15M7 11H12M7 15H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title orbitron-font">Info & Guides</h3>
              <p class="card-desc orbitron-font">Documentație și ghiduri</p>
              <div class="card-footer">
                <span class="card-badge orbitron-font">{{ categoryCounts.info }} pagini</span>
                <a href="/informatii/faq" class="card-link" aria-label="Info & Guides - Vezi pagina">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div class="wiki-card reveal-element orbitron-font" ref="card5Ref" v-if="categoryCounts.currency > 0">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M11 7V11L14 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title orbitron-font">Currency</h3>
              <p class="card-desc orbitron-font">Fire Coins și Credits</p>
              <div class="card-footer">
                <span class="card-badge orbitron-font">{{ categoryCounts.currency }} pagini</span>
                <a href="/currency/credits" class="card-link" aria-label="Currency - Vezi pagina">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div class="wiki-card reveal-element orbitron-font" ref="card6Ref" v-if="categoryCounts.vip > 0">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 3L14 8H19L16 12L18 17L11 14L4 17L6 12L3 8H8L11 3Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title orbitron-font">Custom features</h3>
              <p class="card-desc orbitron-font">Toate caracteristicile personalizate disponibile</p>
              <div class="card-footer">
                <span class="card-badge orbitron-font">{{ categoryCounts.vip }} pagini</span>
                <a href="market/premium-shop/mvp" class="card-link" aria-label="Custom features - Vezi pagina">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-divider">
      <span class="divider-line"></span>
      <img src="/icons/wildfire.webp" alt="divider" class="divider-icon" width="24" height="24" />
      <span class="divider-line"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()

// Props pentru a permite controlul extern al efectelor de typing
const props = defineProps<{
  startTyping?: boolean
}>()

// Referințe pentru elemente
const wikiSectionRef = ref<HTMLElement | null>(null)
const wikiLeftRef = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const card4Ref = ref<HTMLElement | null>(null)
const card5Ref = ref<HTMLElement | null>(null)
const card6Ref = ref<HTMLElement | null>(null)

// Variabile pentru efectul de typing
const displayWikiHeader = ref('')
const wikiHeaderTyped = ref(false)
const wikiHeaderOriginal = 'WIKIPEDIA'

const displayWikiTitle = ref('')
const wikiTitleTyped = ref(false)
const wikiTitleOriginal = 'Enciclopedia WildFire'

const displayWikiDesc = ref('')
const wikiDescTyped = ref(false)
const wikiDescOriginal = 'WildFire Wiki este centrul de cunoștințe al comunității noastre. Aici găsești documentație completă despre toate sistemele, regulamentele și resursele disponibile.'

const displayWikiCTA = ref('')
const wikiCTATyped = ref(false)
const wikiCTAOriginal = 'Explorează tot'

// Funcția pentru numărarea paginilor
const countPagesInSidebar = () => {
  let infoCount = 0
  let currencyCount = 0
  let systemsCount = 0
  let marketCount = 0
  let regulamenteCount = 0
  let vipCount = 0

  if (theme.value?.sidebar && Array.isArray(theme.value.sidebar)) {
    theme.value.sidebar.forEach((section: any) => {
      const sectionText = typeof section.text === 'string' 
        ? section.text.toLowerCase() 
        : section.text?.toString().toLowerCase() || ''
      
      if (section.items && Array.isArray(section.items)) {
        section.items.forEach((item: any) => {
          if (sectionText.includes('informații')) infoCount++
          else if (sectionText.includes('currency')) currencyCount++
          else if (sectionText.includes('systems')) systemsCount++
          else if (sectionText.includes('market')) marketCount++
          
          const itemText = typeof item.text === 'string' 
            ? item.text.toLowerCase() 
            : item.text?.toString().toLowerCase() || ''
            
          if (itemText.includes('regulament')) regulamenteCount++
          if (itemText.includes('vip')) vipCount++
        })
      }
    })
  }

  return { infoCount, currencyCount, systemsCount, marketCount, regulamenteCount, vipCount }
}

const counts = countPagesInSidebar()

const categoryCounts = computed(() => ({
  info: counts.infoCount,
  currency: counts.currencyCount,
  systems: counts.systemsCount,
  market: counts.marketCount,
  regulamente: counts.regulamenteCount,
  vip: counts.vipCount
}))

// Funcții pentru efectul de typing
const typeWikiSection = async () => {
  // Wiki Header
  for (let i = 0; i <= wikiHeaderOriginal.length; i++) {
    displayWikiHeader.value = wikiHeaderOriginal.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 30))
  }
  wikiHeaderTyped.value = true
  
  // Wiki Title
  await new Promise(resolve => setTimeout(resolve, 150))
  for (let i = 0; i <= wikiTitleOriginal.length; i++) {
    displayWikiTitle.value = wikiTitleOriginal.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 40))
  }
  wikiTitleTyped.value = true
  
  // Wiki Description
  await new Promise(resolve => setTimeout(resolve, 200))
  for (let i = 0; i <= wikiDescOriginal.length; i++) {
    displayWikiDesc.value = wikiDescOriginal.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 20))
  }
  wikiDescTyped.value = true
  
  // Wiki CTA
  await new Promise(resolve => setTimeout(resolve, 150))
  for (let i = 0; i <= wikiCTAOriginal.length; i++) {
    displayWikiCTA.value = wikiCTAOriginal.substring(0, i)
    await new Promise(resolve => setTimeout(resolve, 40))
  }
  wikiCTATyped.value = true
}

// Funcții pentru reveal effect
const isElementInViewport = (el: HTMLElement | null) => {
  if (!el) return false
  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight
  return rect.top < windowHeight * 0.85 && rect.bottom > 0
}

const applyRevealEffect = () => {
  const elements = [
    wikiSectionRef.value,
    wikiLeftRef.value,
    card1Ref.value,
    card2Ref.value,
    card3Ref.value,
    card4Ref.value,
    card5Ref.value,
    card6Ref.value
  ].filter(el => el !== null)

  elements.forEach(el => {
    if (isElementInViewport(el)) {
      el.classList.add('revealed')
    } else {
      el.classList.remove('revealed')
    }
  })
}

const handleScroll = () => {
  applyRevealEffect()
}

// Pornire efecte la montare
onMounted(() => {
  if (props.startTyping) {
    typeWikiSection()
  }
  
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Watch pentru a reacționa la changes în props.startTyping
watch(() => props.startTyping, (newValue) => {
  if (newValue) {
    typeWikiSection()
  }
})

// Expunem referințe pentru componenta părinte (opțional)
defineExpose({
  wikiSectionRef,
  wikiLeftRef,
  card1Ref,
  card2Ref,
  card3Ref,
  card4Ref,
  card5Ref,
  card6Ref
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

/* ===== FONT ORBITRON DOAR PENTRU ELEMENTELE SPECIFICE ===== */
.wiki-left-line .text,
.wiki-title,
.wiki-description p,
.wiki-cta-link span,
.card-title,
.card-desc,
.card-badge {
  font-family: 'Orbitron', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  letter-spacing: 0.3px;
}

/* Ajustări individuale pentru diferite greutăți */
.wiki-left-line .text {
  font-weight: 600 !important;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.wiki-title {
  font-weight: 700 !important;
  line-height: 1.2;
}

.wiki-description p {
  font-weight: 400 !important;
  line-height: 1.7;
}

.wiki-cta-link span {
  font-weight: 600 !important;
  font-size: 14px;
}

.card-title {
  font-weight: 600 !important;
  font-size: 16px;
}

.card-desc {
  font-weight: 400 !important;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.5);
}

.card-badge {
  font-size: 10px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.wiki-showcase {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto 40px;
  padding: 0 24px;
  box-sizing: border-box;
}

.section-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 30px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 69, 0, 0.3), rgba(255, 69, 0, 0.5), rgba(255, 69, 0, 0.3), transparent);
}

.divider-icon {
  font-size: 20px;
  color: #ff4500;
  filter: drop-shadow(0 0 8px rgba(255, 69, 0, 0.5));
}

.wiki-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  margin: 30px 0;
  align-items: start;
}

.wiki-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wiki-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wiki-left-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.wiki-left-line .line {
  width: 30px;
  height: 1px;
  background: linear-gradient(90deg, #ff4500, #ff4500, transparent);
}

.wiki-left-line .text {
  font-size: 11px;
  letter-spacing: 2px;
  color: #ff4500;
  text-transform: uppercase;
}

.wiki-title {
  font-size: 32px;
  margin: 0;
  color: white;
}

.wiki-description {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wiki-description p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.text-highlight {
  color: #ff4500;
  font-weight: 600;
}

.wiki-cta {
  margin-top: 16px;
}

.wiki-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
}

.wiki-cta-link:hover {
  background: #ff4500;
  color: white;
  gap: 14px;
  border-color: #ff4500;
}

.wiki-cta-link svg {
  transition: transform 0.2s ease;
}

.wiki-cta-link:hover svg {
  transform: translateX(4px);
}

.wiki-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wiki-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.wiki-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.wiki-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 69, 0, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 69, 0, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.wiki-card:hover .card-glow {
  width: 200px;
  height: 200px;
  opacity: 1;
  transform: translate(-50%, -50%);
}

.card-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #ff4500;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;
}

.wiki-card:hover .card-icon {
  background: #ff4500;
  color: white;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-title {
  font-size: 16px;
  margin: 0;
  color: white;
}

.card-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 40px;
}

.card-badge {
  font-size: 10px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.card-link {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: white;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.card-link svg {
  width: 14px;
  height: 14px;
  display: block;
}

.card-link:hover {
  background: #ff4500;
  transform: translateX(3px);
  border-color: transparent;
}

/* ===== EFFECT DE TYPING ===== */
.typing-text {
  position: relative;
  display: inline-block;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #ff4500;
  margin-left: 2px;
  animation: blink 0.8s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.typing-complete .cursor {
  display: none;
}

.reveal-element {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-element.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Delay-uri pentru carduri */
.wiki-left.revealed {
  transition-delay: 0.05s;
}

.wiki-card:nth-child(1).revealed {
  transition-delay: 0.1s;
}

.wiki-card:nth-child(2).revealed {
  transition-delay: 0.15s;
}

.wiki-card:nth-child(3).revealed {
  transition-delay: 0.2s;
}

.wiki-card:nth-child(4).revealed {
  transition-delay: 0.25s;
}

.wiki-card:nth-child(5).revealed {
  transition-delay: 0.3s;
}

.wiki-card:nth-child(6).revealed {
  transition-delay: 0.35s;
}

/* Light theme adjustments */
html:not(.dark) .wiki-title {
  color: #0f172a;
}

html:not(.dark) .wiki-description p {
  color: #334155;
}

html:not(.dark) .wiki-card {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

html:not(.dark) .wiki-card:hover {
  background: #ffffff;
  border-color: rgba(255, 69, 0, 0.2);
  box-shadow: 0 8px 16px rgba(255, 69, 0, 0.05);
}

html:not(.dark) .card-title {
  color: #0f172a;
}

html:not(.dark) .card-desc {
  color: #64748b;
}

html:not(.dark) .card-badge {
  background: #f8fafc;
  color: #334155;
  border-color: rgba(0, 0, 0, 0.05);
}

html:not(.dark) .wiki-cta-link {
  background: #f8fafc;
  border-color: rgba(0, 0, 0, 0.05);
  color: #0f172a;
}

html:not(.dark) .wiki-cta-link:hover {
  background: #ff4500;
  color: white;
}

html:not(.dark) .card-link {
  background: #f8fafc;
  border-color: rgba(0, 0, 0, 0.05);
  color: #0f172a;
}

html:not(.dark) .card-link:hover {
  background: #ff4500;
  color: white;
}

@media (max-width: 1024px) {
  .wiki-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .wiki-left {
    text-align: center;
    align-items: center;
  }
  
  .wiki-header {
    align-items: center;
  }
}

@media (max-width: 768px) {
  .wiki-title {
    font-size: 28px;
  }
  
  .wiki-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .wiki-title {
    font-size: 24px;
  }
  
  .wiki-row {
    grid-template-columns: 1fr;
  }
}
</style>