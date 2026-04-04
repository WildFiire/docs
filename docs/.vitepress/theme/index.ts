import { h, defineAsyncComponent } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme, { VPButton } from 'vitepress/theme'
import './style.css'
import { Icon } from '@iconify/vue'


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

// Import componente principale - doar cele critice pentru above-the-fold
import WikiHome from './components/WikiHome.vue'
import HomeNavbar from './components/HomeNavbar.vue'
import NavSearch from './components/NavSearch.vue'
import WildfireTag from './components/WildfireTag.vue'
import DocUserWidget from './components/DocUserWidget.vue'
import VPNavBarAppearance from 'vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue'

import LastUpdates from './components/LastUpdates.vue'
import WikiUpdatesGrid from './components/WikiUpdatesGrid.vue'
const LatestWikiUpdates = WikiUpdatesGrid
import AboutWiki from './components/AboutWiki.vue'
import Changelogs from './components/Changelogs.vue'
import StatsGithub from './components/StatsGithub.vue'
import Team from './components/Team.vue'
import Terms from './components/Terms.vue'
import Privacy from './components/Privacy.vue'
import FeedbackWidget from './components/FeedbackWidget.vue'
import CaseHeader from './components/CaseHeader.vue'
import ContributorsWF from './components/ContributorsWF.vue'
import SiteMap from './components/SiteMap.vue'
import PageNotFound from './components/PageNotFound.vue'
import FileTreeItem from './components/FileTreeItem.vue'

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

// Defer popout until first user interaction - reduces unused JS on initial load
if (typeof window !== 'undefined') {
  const loadPopout = () => {
    import('./popout.js')
    ;['click', 'keydown', 'scroll', 'touchstart'].forEach(e =>
      window.removeEventListener(e, loadPopout)
    )
  }
  ;['click', 'keydown', 'scroll', 'touchstart'].forEach(e =>
    window.addEventListener(e, loadPopout, { once: true, passive: true })
  )
}

// Tag-uri — statice, CSS trebuie disponibil imediat pe paginile de conținut
import PageTagBlue from './components/tags/PageTagBlue.vue'
import PageTagOrange from './components/tags/PageTagOrange.vue'
import PageTagPurple from './components/tags/PageTagPurple.vue'
import PageTagGreen from './components/tags/PageTagGreen.vue'
import PageTagPink from './components/tags/PageTagPink.vue'
import PageTagRed from './components/tags/PageTagRed.vue'
import PageTagIndigo from './components/tags/PageTagIndigo.vue'
import PageTagYellow from './components/tags/PageTagYellow.vue'
import PageTagTeal from './components/tags/PageTagTeal.vue'
import PageTagCyan from './components/tags/PageTagCyan.vue'
import PageTagFuchsia from './components/tags/PageTagFuchsia.vue'
import PageTagEmerald from './components/tags/PageTagEmerald.vue'
import PageTagAmber from './components/tags/PageTagAmber.vue'
import PageTagGray from './components/tags/PageTagGray.vue'

export default {
  extends: DefaultTheme,

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Home page
      'home-hero-before': () => h(WikiHome),


      // 🔥 ADĂUGĂ FEEDBACK DUPĂ CONȚINUTUL PAGINII
      'doc-footer-before': () => h(FeedbackWidget),

      // Navbar
      'sidebar-nav-before': () => h(NavSearch),
      'sidebar-nav-after': () => h(DocUserWidget),

      'nav-bar-content-before': () => null,
      'nav-bar-title-before': () => null,
      // 'nav-bar-content-after': () => h(NavSearch),

      // Footer
      'layout-bottom': () => h(SiteMap),

      // 🔥 CONTRIBUTORS - jos înainte de footer
      'aside-outline-after': () => h(ContributorsWF),
      // 'aside-bottom': () => h(ContributorsWF),

      // Not Found Page
      'not-found': () => h(PageNotFound)
    })
  },

  enhanceApp({ app }) {
    // Componente principale
    app.component('WikiHome', WikiHome)
    app.component('HomeNavbar', HomeNavbar)
    app.component('LastUpdates', LastUpdates)
    app.component('Changelogs', Changelogs)
    app.component('LatestWikiUpdates', LatestWikiUpdates)
    app.component('WikiUpdatesGrid', WikiUpdatesGrid)
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
    app.component('Dashboard', Dashboard)
    app.component('PanelSidebar', PanelSidebar)
    app.component('PanelHeader', PanelHeader)
    app.component('PanelFiles', PanelFiles)
    app.component('FileTreeNode', FileTreeNode)
    app.component('PanelContributors', PanelContributors)
    app.component('PanelAudit', PanelAudit)
    app.component('PanelAnalytics', PanelAnalytics)

    // NOUA COMPONENTĂ PENTRU FILE TREE
    app.component('FileTreeItem', FileTreeItem)

    // Toate tag-urile
    app.component('PageTagBlue', PageTagBlue)
    app.component('PageTagOrange', PageTagOrange)
    app.component('PageTagPurple', PageTagPurple)
    app.component('PageTagGreen', PageTagGreen)
    app.component('PageTagPink', PageTagPink)
    app.component('PageTagRed', PageTagRed)
    app.component('PageTagIndigo', PageTagIndigo)
    app.component('PageTagYellow', PageTagYellow)
    app.component('PageTagTeal', PageTagTeal)
    app.component('PageTagCyan', PageTagCyan)
    app.component('PageTagFuchsia', PageTagFuchsia)
    app.component('PageTagEmerald', PageTagEmerald)
    app.component('PageTagAmber', PageTagAmber)
    app.component('PageTagGray', PageTagGray)

    // 🔥 Adăugăm token-ul și client ID global
    app.config.globalProperties.$githubToken = githubToken
    app.config.globalProperties.$githubClientId = githubClientId
  }
} satisfies Theme