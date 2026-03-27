import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
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
import Panel from './components/Panel.vue'
import AboutWiki from './components/AboutWiki.vue'
import StatsGithub from './components/StatsGithub.vue'
import Team from './components/Team.vue'
import Terms from './components/Terms.vue'
import Privacy from './components/Privacy.vue'
import FeedbackWidget from './components/FeedbackWidget.vue'

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
      'nav-bar-content-before': () => null,
      'nav-bar-title-before': () => null,
      'nav-bar-content-after': () => h(NavSearch),

      // Footer
      'layout-bottom': () => h(SiteMap),

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
    app.component('Panel', Panel)
    app.component('StatsGithub', StatsGithub)
    app.component('Team', Team)
    app.component('Icon', Icon)
    app.component('Terms', Terms)
    app.component('Privacy', Privacy)
    app.component('FeedbackWidget', FeedbackWidget)

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