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
import TeamView from './components/team/TeamView.vue';
import ProductChangelog from './components/Pages/ProductChangelog.vue';
import MaintenanceScreen from './components/ui/MaintenanceScreen.vue';

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
    TeamView,
    ProductChangelog,
    MaintenanceScreen,
  }))
    app.component(name, component);
}
