import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { defineAsyncComponent } from 'vue';
import { Icon } from '@iconify/vue';
import PortLayout from './PortLayout.vue';
import { registerPort } from './registerPort';
import { searchState } from './store';

// ── 1:1 Source CSS Styles from wf-docscore ──
import './styles/tokens.css';
import './styles/prose.css';
import './styles/components.css';
import './styles/globals.css';
import './styles/light-theme-extras.css';
import './styles/vitepress-bridge.css';
import './styles/style.css';

// ── Markdown-embedded components ──
import WildfireTag from './components/Docs/WildfireTag.vue';
import CaseHeader from './components/Docs/CaseHeader.vue';
import PageTag from './components/Docs/PageTag.vue';
import FileTreeItem from './components/Docs/FileTreeItem.vue';

const Terms = defineAsyncComponent(() => import('./components/Pages/Terms.vue'));
const Privacy = defineAsyncComponent(() => import('./components/Pages/Privacy.vue'));
const StatsGithub = defineAsyncComponent(() => import('./components/Widgets/StatsGithub.vue'));
const ContributorsWF = defineAsyncComponent(() => import('./components/Widgets/ContributorsWF.vue'));
const RelatedPages = defineAsyncComponent(() => import('./components/Widgets/RelatedPages.vue'));
const SiteMap = defineAsyncComponent(() => import('./components/Layout/SiteMap.vue'));
const PageNotFound = defineAsyncComponent(() => import('./components/Layout/PageNotFound.vue'));
const FeedbackWidget = defineAsyncComponent(() => import('./components/Widgets/FeedbackWidget.vue'));

export default {
  extends: DefaultTheme,
  Layout: PortLayout,
  enhanceApp({ app, router }) {
    registerPort(app);

    // Register embedded components
    app.component('Icon', Icon);
    app.component('WildfireTag', WildfireTag);
    app.component('CaseHeader', CaseHeader);
    app.component('PageTag', PageTag);
    app.component('FileTreeItem', FileTreeItem);
    app.component('Terms', Terms);
    app.component('Privacy', Privacy);
    app.component('StatsGithub', StatsGithub);
    app.component('ContributorsWF', ContributorsWF);
    app.component('RelatedPages', RelatedPages);
    app.component('SiteMap', SiteMap);
    app.component('PageNotFound', PageNotFound);
    app.component('FeedbackWidget', FeedbackWidget);

    if (typeof window !== 'undefined') {
      router.onBeforeRouteChange = () => {
        searchState.close();
      };
    }
  },
} satisfies Theme;
