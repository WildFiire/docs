import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme, { VPButton } from 'vitepress/theme'
import './style.css'
import { Icon } from '@iconify/vue'


// 📝 Tipuri pentru TypeScript
declare global {
  interface ImportMeta {
    env: {
      VITE_GITHUB_TOKEN: string
    }
  }

  interface Window {
    __GITHUB_TOKEN: string
  }
}

// 🔥 Get token from Vite env (SSR-safe)
const githubToken = import.meta.env.VITE_GITHUB_TOKEN || ''

// Import componente principale
import WikiHome from './components/WikiHome.vue'
import LastUpdates from './components/LastUpdates.vue'
import Changelogs from './components/Changelogs.vue'
import LatestWikiUpdates from './components/WikiUpdatesGrid.vue'
import WikiUpdatesGrid from './components/WikiUpdatesGrid.vue'
import NavSearch from './components/NavSearch.vue'
import WildfireTag from './components/WildfireTag.vue'
import SiteMap from './components/SiteMap.vue'
import PageNotFound from './components/PageNotFound.vue'
import HomeNavbar from './components/HomeNavbar.vue'
import AboutWiki from './components/AboutWiki.vue'
import StatsGithub from './components/StatsGithub.vue'
import Team from './components/Team.vue'
import Terms from './components/Terms.vue'
import Privacy from './components/Privacy.vue'
import FeedbackWidget from './components/FeedbackWidget.vue'
import CaseHeader from './components/CaseHeader.vue'
import ContributorsWF from './components/ContributorsWF.vue'
import VPNavBarAppearance from 'vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue'
import Dashboard from './components/Panel/Dashboard.vue'
import PanelSidebar from './components/Panel/PanelSidebar.vue'
import PanelHeader from './components/Panel/PanelHeader.vue'
import PanelFiles from './components/Panel/PanelFiles.vue'
import FileTreeNode from './components/Panel/FileTreeNode.vue'
import PanelContributors from './components/Panel/PanelContributors.vue'
import PanelAudit from './components/Panel/PanelAudit.vue'
import PanelAnalytics from './components/Panel/PanelAnalytics.vue'
import PanelLogin from './components/Panel/PanelLogin.vue'
// import VPNavBarSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue'

// NOILE COMPONENTE PENTRU DASHBOARD
import FileTreeItem from './components/FileTreeItem.vue'

// Import popout only on client side (SSR-safe)
if (typeof window !== 'undefined') {
  import('./popout.js')
}

// Import toate tag-urile
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
      // 'sidebar-nav-after': () =>
      //   h('div', { class: 'sidebar-bottom' }, [
      //     h(VPNavBarAppearance),
      //     h(VPNavBarSocialLinks),
      //   ]),

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

    // 🔥 Adăugăm token-ul global
    app.config.globalProperties.$githubToken = githubToken
  }
} satisfies Theme