import { defineAsyncComponent, type App } from 'vue';
import Callout from './components/Docs/Callout.vue';
import Card from './components/Docs/Card.vue';
import Cards from './components/Docs/Cards.vue';
import Steps from './components/Docs/Steps.vue';
import Step from './components/Docs/Step.vue';
import Tabs from './components/Docs/Tabs.vue';
import Tab from './components/Docs/Tab.vue';
import DocImage from './components/Docs/DocImage.vue';
import DocVideo from './components/Docs/DocVideo.vue';
import CodeBlock from './components/Docs/CodeBlock.vue';
import CompatibilityRedirect from './components/CompatibilityRedirect.vue';
export function registerPort(app: App) {
  for (const [name, component] of Object.entries({
    Callout,
    Card,
    Cards,
    Steps,
    Step,
    Tabs,
    Tab,
    DocImage,
    DocVideo,
    CodeBlock,
    CopyablePre: CodeBlock,
    CompatibilityRedirect,
  }))
    app.component(name, component);
  app.component(
    'TeamView',
    defineAsyncComponent(() => import('./components/team/TeamView.vue')),
  );
  app.component(
    'ProductChangelog',
    defineAsyncComponent(() => import('./components/Pages/ProductChangelog.vue')),
  );
  app.component(
    'MaintenanceScreen',
    defineAsyncComponent(() => import('./components/ui/MaintenanceScreen.vue')),
  );
}
