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

// Componente lazy — CSS/JS split în chunk-uri separate, nu blochează FCP/LCP
const LastUpdates = defineAsyncComponent(() => import('./components/LastUpdates.vue'))
const Changelogs = defineAsyncComponent(() => import('./components/Changelogs.vue'))
const WikiUpdatesGrid = defineAsyncComponent(() => import('./components/WikiUpdatesGrid.vue'))
const LatestWikiUpdates = WikiUpdatesGrid
const AboutWiki = defineAsyncComponent(() => import('./components/AboutWiki.vue'))
const StatsGithub = defineAsyncComponent(() => import('./components/StatsGithub.vue'))
const Team = defineAsyncComponent(() => import('./components/Team.vue'))
const Terms = defineAsyncComponent(() => import('./components/Terms.vue'))
const Privacy = defineAsyncComponent(() => import('./components/Privacy.vue'))
const FeedbackWidget = defineAsyncComponent(() => import('./components/FeedbackWidget.vue'))
const CaseHeader = defineAsyncComponent(() => import('./components/CaseHeader.vue'))
const ContributorsWF = defineAsyncComponent(() => import('./components/ContributorsWF.vue'))
const SiteMap = defineAsyncComponent(() => import('./components/SiteMap.vue'))
const PageNotFound = defineAsyncComponent(() => import('./components/PageNotFound.vue'))
const FileTreeItem = defineAsyncComponent(() => import('./components/FileTreeItem.vue'))

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

// Import popout only on client side (SSR-safe)
if (typeof window !== 'undefined') {
  import('./popout.js')
}

// Tag-uri — lazy, folosite numai în pagini de conținut
const PageTagBlue = defineAsyncComponent(() => import('./components/tags/PageTagBlue.vue'))
const PageTagOrange = defineAsyncComponent(() => import('./components/tags/PageTagOrange.vue'))
const PageTagPurple = defineAsyncComponent(() => import('./components/tags/PageTagPurple.vue'))
const PageTagGreen = defineAsyncComponent(() => import('./components/tags/PageTagGreen.vue'))
const PageTagPink = defineAsyncComponent(() => import('./components/tags/PageTagPink.vue'))
const PageTagRed = defineAsyncComponent(() => import('./components/tags/PageTagRed.vue'))
const PageTagIndigo = defineAsyncComponent(() => import('./components/tags/PageTagIndigo.vue'))
const PageTagYellow = defineAsyncComponent(() => import('./components/tags/PageTagYellow.vue'))
const PageTagTeal = defineAsyncComponent(() => import('./components/tags/PageTagTeal.vue'))
const PageTagCyan = defineAsyncComponent(() => import('./components/tags/PageTagCyan.vue'))
const PageTagFuchsia = defineAsyncComponent(() => import('./components/tags/PageTagFuchsia.vue'))
const PageTagEmerald = defineAsyncComponent(() => import('./components/tags/PageTagEmerald.vue'))
const PageTagAmber = defineAsyncComponent(() => import('./components/tags/PageTagAmber.vue'))
const PageTagGray = defineAsyncComponent(() => import('./components/tags/PageTagGray.vue'))

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