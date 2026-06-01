import { h, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import type { Theme } from 'vitepress'
import DefaultTheme, { VPButton } from 'vitepress/theme'
import './styles/style.css'
import './styles/nav-extras.css'
import { Icon } from '@iconify/vue'
import { searchState } from './store'
// Lenis instance - shared across components (lazily imported)
let lenisInstance: any | null = null
let lenisRafId: number | null = null

// ── Horizontal-scroll lock during text-selection drag ──────────────────────
// The browser natively pans the nearest scrollable container when the user
// drags a selection past the edge of the viewport.
//
// Fix strategy: attach a 'scroll' event listener directly on every layout
// container. When scrollLeft != 0 we immediately reset it to 0 — this fires
// synchronously before the browser paints, so the shifted frame is never
// actually displayed (no glitchy teleport). We also use a scroll listener on
// window to catch window.scrollX drifts.
function initSelectionScrollLock() {
  if (typeof window === 'undefined') return

  const LOCK_SELECTORS = [
    '#app',
    '.Layout',
    '.VPContent',
    '.VPDoc',
    '.VPDoc > .container',
  ]

  // Immediately snap scrollLeft back to 0 — called synchronously from scroll event
  function onElementScroll(this: HTMLElement) {
    if (this.scrollLeft !== 0) {
      this.scrollLeft = 0
    }
  }

  // Reset window horizontal scroll
  function onWindowScroll() {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY)
    }
  }

  // Also reset html/body which can be panned by the browser during selection
  function onDocScroll() {
    if (document.documentElement.scrollLeft !== 0) {
      document.documentElement.scrollLeft = 0
    }
    if (document.body.scrollLeft !== 0) {
      document.body.scrollLeft = 0
    }
  }

  // Attach scroll listeners to all known layout wrappers
  function attachLocks() {
    for (const sel of LOCK_SELECTORS) {
      const el = document.querySelector<HTMLElement>(sel)
      if (el) {
        // { passive: false } so we can act synchronously before paint
        el.addEventListener('scroll', onElementScroll, { passive: true, capture: true })
      }
    }
    document.documentElement.addEventListener('scroll', onDocScroll, { passive: true, capture: true })
    document.body.addEventListener('scroll', onDocScroll, { passive: true, capture: true })
    window.addEventListener('scroll', onWindowScroll, { passive: true, capture: true })
  }

  // Run immediately and let standard layout observers handle the rest
  attachLocks()
}

// Initialize Lenis smooth scroll (Lenis is lazy-imported to keep it out of the main bundle)
async function initLenis() {
  // Stop Lenis during text selection so it doesn't fight the browser
  document.addEventListener('selectstart', () => {
    lenisInstance?.stop()
  })
  document.addEventListener('mouseup', () => {
    lenisInstance?.start()
  })

  if (typeof window === 'undefined' || lenisInstance) return

  const { default: Lenis } = await import('lenis')

  lenisInstance = new Lenis({
    duration: 1.0,
    easing: (t: number) => 1 - Math.pow(1 - t, 4),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
    infinite: false,
    prevent: (node: Element) => node.closest('.VPSidebar') !== null,
  })

  function raf(time: number) {
    lenisInstance?.raf(time)
    lenisRafId = requestAnimationFrame(raf)
  }

  lenisRafId = requestAnimationFrame(raf)

  // Expose globally for compatibility
  ;(window as any).lenis = lenisInstance
}

function destroyLenis() {
  if (lenisRafId) {
    cancelAnimationFrame(lenisRafId)
    lenisRafId = null
  }
  lenisInstance?.destroy()
  lenisInstance = null
}


// 📝 Tipuri pentru TypeScript
declare global {
  interface ImportMeta {
    env: {
      VITE_GITHUB_TOKEN: string
      VITE_GITHUB_CLIENT_ID: string
    }
  }

  interface Window {
    __GITHUB_TOKEN: string
    __GITHUB_CLIENT_ID: string
  }
}

// 🔥 Get token from Vite env (SSR-safe)
const githubToken = import.meta.env.VITE_GITHUB_TOKEN || ''
const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID || ''

// Componente critice — necesare pe prima randare, raman in theme.js
import WikiHome from './components/Home/WikiHome.vue'
import HomeNavbar from './components/Home/HomeNavbar.vue'
import NavSearch from './components/Search/NavSearch.vue'
import WildfireTag from './components/Docs/WildfireTag.vue'
import VPNavBarAppearance from 'vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue'
import BackToTop from './components/Layout/BackToTop.vue'
import CaseHeader from './components/Docs/CaseHeader.vue'
import SidebarToggle from './components/Layout/SidebarToggle.vue'
import MobileScrollSpy from './components/Layout/MobileScrollSpy.vue'
import WfTOC from './components/Layout/WfTOC.vue'
import SidebarFooter from './components/Layout/SidebarFooter.vue'
import SidebarFloatingControls from './components/Layout/SidebarFloatingControls.vue'
import PageTag from './components/Docs/PageTag.vue'

// Componente lazy — split in chunks separate, nu blocheaza theme.js
const DocEnhancements = defineAsyncComponent(() => import('./components/Layout/DocEnhancements.vue'))
const FluidLightbox = defineAsyncComponent(() => import('./components/Widgets/FluidLightbox.vue'))
const WfSearchModal = defineAsyncComponent(() => import('./components/Search/WfSearchModal.vue'))
const LastUpdates = defineAsyncComponent(() => import('./components/Home/LastUpdates.vue'))
const AboutWiki = defineAsyncComponent(() => import('./components/Home/AboutWiki.vue'))
const Changelogs = defineAsyncComponent(() => import('./components/Pages/Changelogs.vue'))
const AllChangelogs = defineAsyncComponent(() => import('./components/Pages/AllChangelogs.vue'))
const UpdatesHub = defineAsyncComponent(() => import('./components/Pages/UpdatesHub.vue'))
const StatsGithub = defineAsyncComponent(() => import('./components/Widgets/StatsGithub.vue'))
const Team = defineAsyncComponent(() => import('./components/Pages/Team.vue'))
const Terms = defineAsyncComponent(() => import('./components/Pages/Terms.vue'))
const Privacy = defineAsyncComponent(() => import('./components/Pages/Privacy.vue'))
const FeedbackWidget = defineAsyncComponent(() => import('./components/Widgets/FeedbackWidget.vue'))
const ContributorsWF = defineAsyncComponent(() => import('./components/Widgets/ContributorsWF.vue'))
const RelatedPages = defineAsyncComponent(() => import('./components/Widgets/RelatedPages.vue'))
const SiteMap = defineAsyncComponent(() => import('./components/Layout/SiteMap.vue'))
const PageNotFound = defineAsyncComponent(() => import('./components/Layout/PageNotFound.vue'))
const FileTreeItem = defineAsyncComponent(() => import('./components/Docs/FileTreeItem.vue'))

// Panel — lazy (numai pe /panel)
const Dashboard = defineAsyncComponent(() => import('./components/Panel/Dashboard.vue'))
const PanelSidebar = defineAsyncComponent(() => import('./components/Panel/PanelSidebar.vue'))
const PanelHeader = defineAsyncComponent(() => import('./components/Panel/PanelHeader.vue'))
const PanelFiles = defineAsyncComponent(() => import('./components/Panel/PanelFiles.vue'))
const FileTreeNode = defineAsyncComponent(() => import('./components/Panel/FileTreeNode.vue'))
const PanelContributors = defineAsyncComponent(() => import('./components/Panel/PanelContributors.vue'))
const PanelAudit = defineAsyncComponent(() => import('./components/Panel/PanelAudit.vue'))
const PanelAnalytics = defineAsyncComponent(() => import('./components/Panel/PanelAnalytics.vue'))
const PanelLogin = defineAsyncComponent(() => import('./components/Panel/PanelLogin.vue'))

// Pages — lazy
const VIPComparison = defineAsyncComponent(() => import('./components/Pages/VIPComparison.vue'))
const RankSimulator = defineAsyncComponent(() => import('./components/Pages/RankSimulator.vue'))


// Tag-uri — statice, CSS trebuie disponibil imediat pe paginile de continut
export default {
  extends: DefaultTheme,

  Layout: () => {
    const { frontmatter } = useData()
    
    return h(DefaultTheme.Layout, null, {
      // Home page
      'home-hero-before': () => h(WikiHome),

      'doc-footer-before': () => h(FeedbackWidget),

      'doc-before': () => {
        const fm = frontmatter.value
        return (fm.tag || fm.category || fm.status) ? h(PageTag) : null
      },

      // Navbar
      'sidebar-nav-before': () => frontmatter.value.layout === false ? null : h('div', { class: 'wf-sidebar-sticky-nav' }, [
        h(SidebarToggle),
        h(NavSearch)
      ]),
      'sidebar-nav-after': () => frontmatter.value.layout === false ? null : h(SidebarFooter),

      'nav-bar-content-before': () => null,
      'nav-bar-title-before': () => null,
      'nav-bar-title-after': () => null,

      // Footer
      'layout-bottom': () => frontmatter.value.layout === false ? null : h(SiteMap),

      // 🔥 Custom TOC replacing VitePress default
      'aside-outline-before': () => frontmatter.value.layout === false ? null : h(WfTOC),

      // 🔥 CONTRIBUTORS - jos inainte de footer
      'aside-bottom': () => frontmatter.value.layout === false ? null : [h(ContributorsWF), h(RelatedPages)],

      // Not Found Page
      'not-found': () => h(PageNotFound),

      // 🔥 Global UX enhancements
      'layout-top': () => frontmatter.value.layout === false ? null : [h(BackToTop), h(DocEnhancements), h(FluidLightbox), h(SidebarFloatingControls), h(MobileScrollSpy), h(WfSearchModal)]
    })
  },

  enhanceApp({ app, router }) {
    // Initialize Lenis smooth scroll on client
    if (typeof window !== 'undefined') {
      // Delay Lenis init to let page settle
      requestAnimationFrame(() => {
        setTimeout(initLenis, 100)
        // Immediate fallback dispatches for first-load async components
        setTimeout(() => lenisInstance?.resize(), 400)
        setTimeout(() => lenisInstance?.resize(), 1000)
        // Reactive: watch document.body height changes caused by async components
        // (SiteMap, FeedbackWidget, ContributorsWF) loading and adding content.
        // ResizeObserver on document.documentElement does NOT fire for this because
        // html's box size = viewport (constant). Body height grows, so it does fire.
        setTimeout(() => {
          if (typeof ResizeObserver === 'undefined') return
          let bodyResizeTimer: ReturnType<typeof setTimeout> | null = null
          new ResizeObserver(() => {
            if (bodyResizeTimer) clearTimeout(bodyResizeTimer)
            bodyResizeTimer = setTimeout(() => {
              bodyResizeTimer = null
              lenisInstance?.resize()
            }, 150)
          }).observe(document.body)
        }, 300)
      })

      // Lock horizontal scroll during text-selection drag (prevents content shift)
      initSelectionScrollLock()
      
      // Clean up on page unload
      window.addEventListener('beforeunload', destroyLenis)
      
      // Fix wheel scroll for ALL overflow elements (docs sidebar, panel, etc)
      const LENIS_IGNORED = new Set<HTMLElement>()
      
      const fixLenisOverflow = () => {
        // Try multiple possible sidebar selectors (VitePress versions vary)
        const selectors = [
          '.VPSidebar .nav',
          '.VPSidebar .items', 
          '.VPSidebar nav',
          '.VPSidebar .VPSidebarNav',
          '.vp-sidebar .nav',
          '.sidebar .nav',
          // Search modal scrollable area
          '.wf-search-modal .search-body',
          '.search-body[data-lenis-prevent]'
        ]
        
        for (const selector of selectors) {
          const el = document.querySelector<HTMLElement>(selector)
          if (el && !LENIS_IGNORED.has(el)) {
            LENIS_IGNORED.add(el)
            // Use capture phase to catch event early
            el.addEventListener('wheel', (e: Event) => {
              const target = e.target as HTMLElement
              // Only stop propagation if element is scrollable
              const isScrollable = el.scrollHeight > el.clientHeight
              if (isScrollable) {
                e.stopPropagation()
              }
            }, { passive: true, capture: false })
          }
        }
        
        // Fix data-lenis-prevent elements
        document.querySelectorAll<HTMLElement>('[data-lenis-prevent]').forEach(el => {
          if (!LENIS_IGNORED.has(el)) {
            LENIS_IGNORED.add(el)
            el.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true })
          }
        })
        
        // Fix FluidLightbox - prevent background scroll when lightbox is open
        const lightbox = document.querySelector<HTMLElement>('.fluid-lb')
        if (lightbox && !LENIS_IGNORED.has(lightbox)) {
          LENIS_IGNORED.add(lightbox)
          lightbox.addEventListener('wheel', (e) => {
            e.stopPropagation()
          }, { passive: true })
        }
      }
      
      // Run immediately and once after a short delay for async components
      fixLenisOverflow()
      setTimeout(fixLenisOverflow, 100)
      
      // Watch for DOM changes (sidebar might be added dynamically) — debounced to
      // avoid calling fixLenisOverflow on every single mutation during scroll/animations
      if (typeof MutationObserver !== 'undefined') {
        let moTimer: ReturnType<typeof setTimeout> | null = null
        const observer = new MutationObserver(() => {
          if (moTimer) return
          // Defer to next frame — avoids forced synchronous layout (reflow)
          // that would occur if we read scrollHeight/clientHeight immediately
          // after a DOM mutation.
          moTimer = setTimeout(() => {
            moTimer = null
            requestAnimationFrame(fixLenisOverflow)
          }, 200)
        })
        observer.observe(document.body, { childList: true, subtree: true })
      }
      
    }
    
    // Componente principale
    app.component('WikiHome', WikiHome)
    app.component('HomeNavbar', HomeNavbar)
    app.component('LastUpdates', LastUpdates)
    app.component('Changelogs', Changelogs)
    app.component('AllChangelogs', AllChangelogs)
    app.component('UpdatesHub', UpdatesHub)
    app.component('NavSearch', NavSearch)
    app.component('WildfireTag', WildfireTag)
    app.component('SiteMap', SiteMap)
    app.component('PageNotFound', PageNotFound)
    app.component('AboutWiki', AboutWiki)
    app.component('StatsGithub', StatsGithub)
    app.component('Team', Team)
    app.component('Icon', Icon)
    app.component('Terms', Terms)
    app.component('Privacy', Privacy)
    app.component('FeedbackWidget', FeedbackWidget)
    app.component('CaseHeader', CaseHeader)
    app.component('ContributorsWF', ContributorsWF)
    app.component('VPNavBarAppearance', VPNavBarAppearance)
    app.component('SidebarFooter', SidebarFooter)
    app.component('Dashboard', Dashboard)
    app.component('PanelSidebar', PanelSidebar)
    app.component('PanelHeader', PanelHeader)
    app.component('PanelFiles', PanelFiles)
    app.component('FileTreeNode', FileTreeNode)
    app.component('PanelContributors', PanelContributors)
    app.component('PanelAudit', PanelAudit)
    app.component('PanelAnalytics', PanelAnalytics)
    app.component('WfSearchModal', WfSearchModal)

    // NOUA COMPONENTA PENTRU FILE TREE
    app.component('FileTreeItem', FileTreeItem)
    app.component('PageTag', PageTag)
    app.component('VIPComparison', VIPComparison)
    app.component('RankSimulator', RankSimulator)
    app.component('RelatedPages', RelatedPages)

    // Toate tag-urile

    // 🔥 Adaugam token-ul si client ID global
    app.config.globalProperties.$githubToken = githubToken
    app.config.globalProperties.$githubClientId = githubClientId

    // 🔥 Sidebar "New" badge injection (git-based, last 7 days)
    if (typeof window !== 'undefined') {
      import('virtual:new-pages').then(({ default: newPages }: { default: string[] }) => {
        if (!newPages.length) return

        const inject = () => {
          // 1. Inject on individual new page links
          document.querySelectorAll<HTMLAnchorElement>('.VPSidebarItem a.link').forEach(el => {
            const href = el.getAttribute('href')
            if (href && newPages.includes(href) && !el.querySelector('.sidebar-new-badge')) {
              const badge = document.createElement('span')
              badge.className = 'sidebar-new-badge'
              badge.textContent = 'NEW'
              el.appendChild(badge)
            }
          })

          // 2. Bubble up: mark sub-section headers that contain a new page
          document.querySelectorAll('.VPSidebarItem:not(.level-0)').forEach(section => {
            const itemsContainer = section.querySelector(':scope > .items')
            if (!itemsContainer) return
            if (!itemsContainer.querySelector('.sidebar-new-badge')) return
            const textEl = section.querySelector<HTMLElement>(
              ':scope > .item .text, :scope > .item > button .text'
            )
            if (textEl && !textEl.querySelector('.sidebar-new-badge')) {
              const badge = document.createElement('span')
              badge.className = 'sidebar-new-badge'
              badge.textContent = 'NEW'
              textEl.appendChild(badge)
            }
          })
        }

        let moDebounce: ReturnType<typeof setTimeout>
        let sidebarObserver: MutationObserver | null = null

        const attachObserver = (sidebar: Element) => {
          sidebarObserver?.disconnect()
          sidebarObserver = new MutationObserver(() => {
            // Vue wiped our badges — re-inject after its batch update settles
            clearTimeout(moDebounce)
            moDebounce = setTimeout(inject, 50)
          })
          sidebarObserver.observe(sidebar, { childList: true, subtree: true })
        }

        const setupBadges = () => {
          const sidebar = document.querySelector('.VPSidebar')
          if (sidebar) {
            inject()
            attachObserver(sidebar)
          } else {
            // sidebar not in DOM yet (e.g. mobile) — watch for it
            const bodyWatch = new MutationObserver(() => {
              const s = document.querySelector('.VPSidebar')
              if (s) { bodyWatch.disconnect(); inject(); attachObserver(s) }
            })
            bodyWatch.observe(document.body, { childList: true, subtree: false })
          }
        }

        // Re-inject after every SPA navigation (nextTick waits for Vue's sidebar re-render)
        router.onAfterRouteChange = () => {
          nextTick(() => {
            requestAnimationFrame(setupBadges)
            // Force Lenis to recalculate scroll bounds — catches lazy-loaded content
            // that increases page height after Lenis has already set its limit
            setTimeout(() => lenisInstance?.resize(), 300)
            setTimeout(() => lenisInstance?.resize(), 800)
            setTimeout(() => lenisInstance?.resize(), 1500)
          })
        }


        // Initial load: the dynamic import resolves after onAfterRouteChange already
        // fired, so hook it manually. nextTick ensures Vue has finished hydration.
        nextTick(() => requestAnimationFrame(setupBadges))
      }).catch(() => { })
    }

    // 🔥 Close search modal instantly on any SPA navigation
    if (typeof window !== 'undefined') {
      router.onBeforeRouteChange = () => {
        // Close new modal
        searchState.close()

        const modal = document.querySelector('.VPLocalSearchBox') as HTMLElement | null
        if (modal) {
          // Dispatch Escape so VitePress cleans up internal state
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
          // Also forcibly hide instantly in case the event isn't caught fast enough
          modal.style.display = 'none'
        }
      }
    }

    // 🔥 Page fade transition on SPA route change
    if (typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = `.page-entering .vp-doc,.page-entering .VPDoc{opacity:0;transform:translateY(6px);transition:opacity 0.25s ease,transform 0.25s ease}`
      document.head.appendChild(style)
    }
  }
} satisfies Theme