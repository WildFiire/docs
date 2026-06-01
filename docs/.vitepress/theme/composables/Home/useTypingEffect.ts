import { ref, computed, onUnmounted } from 'vue'

export function useTypingEffect() {
  const displayTitle = ref('')
  const displayTitleArray = computed(() => displayTitle.value.split(''))
  const titleTyped = ref(false)
  const titleOriginal = 'WILDFIRE.RO DOCS'

  const getCharClass = (index: number) => {
    if (index < 4) return 't-white'
    if (index < 8) return 't-fire-typing'
    if (index === 8) return 't-dot'
    if (index < 11) return 't-ro-typing'
    return 't-docs'
  }

  const displayButton = ref('')
  const buttonTyped = ref(false)
  const buttonOriginal = 'Ghid de pornire'
  const displaySearchText = ref('')
  const startWikiTyping = ref(false)

  const searchSuggestions = [
    'Cauta in documentatie...',
    'Regulament Jucatori',
    'Informatii',
    'Knifes',
    'Fire Coins',
    'VIP Tiers',
    'Sisteme',
    'Shop',
    'Stats'
  ]

  let currentSuggestionIndex = 0
  let searchTypingTimeout: ReturnType<typeof setTimeout> | null = null
  let searchPauseTimeout: ReturnType<typeof setTimeout> | null = null

  const typeTitle = async () => {
    for (let i = 0; i <= titleOriginal.length; i++) {
      displayTitle.value = titleOriginal.substring(0, i)
      await new Promise(r => setTimeout(r, 50))
    }
    titleTyped.value = true
  }

  const typeButton = async () => {
    for (let i = 0; i <= buttonOriginal.length; i++) {
      displayButton.value = buttonOriginal.substring(0, i)
      await new Promise(r => setTimeout(r, 40))
    }
    buttonTyped.value = true
  }

  const typeSearchNext = async () => {
    const text = searchSuggestions[currentSuggestionIndex]
    if (displaySearchText.value.length > 0) {
      for (let i = displaySearchText.value.length; i > 0; i--) {
        displaySearchText.value = displaySearchText.value.substring(0, i - 1)
        await new Promise(r => setTimeout(r, 15))
      }
    }
    for (let i = 0; i <= text.length; i++) {
      displaySearchText.value = text.substring(0, i)
      await new Promise(r => setTimeout(r, 25))
    }
    currentSuggestionIndex = (currentSuggestionIndex + 1) % searchSuggestions.length
    searchPauseTimeout = setTimeout(typeSearchNext, 1200)
  }

  const startTypingEffects = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      displayTitle.value = titleOriginal
      displayButton.value = buttonOriginal
      titleTyped.value = true
      buttonTyped.value = true
      displaySearchText.value = searchSuggestions[0]
      startWikiTyping.value = true
      return
    }
    setTimeout(() => typeTitle(), 200)
    setTimeout(() => typeButton(), 1400)
    setTimeout(() => { startWikiTyping.value = true }, 2000)
    setTimeout(() => {
      displaySearchText.value = ''
      setTimeout(() => { currentSuggestionIndex = 0; typeSearchNext() }, 150)
    }, 800)
  }

  const cleanupTypingEffects = () => {
    if (searchPauseTimeout) clearTimeout(searchPauseTimeout)
    if (searchTypingTimeout) clearTimeout(searchTypingTimeout)
  }

  onUnmounted(cleanupTypingEffects)

  return {
    displayTitleArray,
    titleTyped,
    getCharClass,
    displayButton,
    buttonTyped,
    displaySearchText,
    startWikiTyping,
    startTypingEffects,
  }
}
