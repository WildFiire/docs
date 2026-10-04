<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import AdminLogin from './AdminLogin.vue';
import AdminHeader from './AdminHeader.vue';
import AdminSidebar from './AdminSidebar.vue';
import LiquidBackground from './LiquidBackground.vue';
import AdminAccessDenied from './AdminAccessDenied.vue';

// ── Specialized 1:1 Admin View Components ─────────────────────────────────────
const Dashboard = defineAsyncComponent(() => import('./AdminDashboard.vue'));
const Studio = defineAsyncComponent(() => import('./AdminContentStudioClient.vue'));
const Tasks = defineAsyncComponent(() => import('./AdminTasks.vue'));
const Team = defineAsyncComponent(() => import('./AdminTeam.vue'));
const Webhooks = defineAsyncComponent(() => import('./AdminWebhooks.vue'));
const GitOps = defineAsyncComponent(() => import('./AdminGitOps.vue'));
const Database = defineAsyncComponent(() => import('./AdminDatabase.vue'));
const Security = defineAsyncComponent(() => import('./AdminSecurity.vue'));
const ApiKeys = defineAsyncComponent(() => import('./AdminApiKeys.vue'));
const Audit = defineAsyncComponent(() => import('./AdminAudit.vue'));
const Backups = defineAsyncComponent(() => import('./AdminBackups.vue'));
const Settings = defineAsyncComponent(() => import('./AdminSettings.vue'));
const Media = defineAsyncComponent(() => import('./AdminMedia.vue'));
const Inbox = defineAsyncComponent(() => import('./AdminInbox.vue'));
const Profile = defineAsyncComponent(() => import('./AdminProfile.vue'));
const Health = defineAsyncComponent(() => import('./AdminHealth.vue'));
const SearchAnalytics = defineAsyncComponent(() => import('./AdminSearchAnalytics.vue'));
const AiAnalytics = defineAsyncComponent(() => import('./AdminAiAnalytics.vue'));

// Discord Bot Suite
const DiscordBot = defineAsyncComponent(() => import('./AdminDiscordBot.vue'));
const Modules = defineAsyncComponent(() => import('./DiscordModules.vue'));
const DiscordRoleTrackers = defineAsyncComponent(() => import('./AdminDiscordRoleTrackers.vue'));
const DiscordStaff = defineAsyncComponent(() => import('./AdminDiscordStaff.vue'));
const DiscordTickets = defineAsyncComponent(() => import('./AdminDiscordTickets.vue'));
const DiscordWatchlist = defineAsyncComponent(() => import('./AdminDiscordWatchlist.vue'));

// Fallback Generic Resource
const Resource = defineAsyncComponent(() => import('./AdminResource.vue'));

const ROUTE_PERMISSIONS: Record<string, { permKey?: string; rootOnly?: boolean; label: string; category: string }> = {
  '/admin/tasks': { permKey: 'canManageTasks', label: 'Gestiune Sarcini (Task Hub)', category: 'Management' },
  '/admin/content': { permKey: 'canEditDocs', label: 'Editare Documentație (Content Studio)', category: 'Publishing' },
  '/admin/team': { permKey: 'canManageTeam', label: 'Gestiune Echipă & Roluri', category: 'Management' },
  '/admin/database': { permKey: 'canManageDb', label: 'Acces Bază de Date & Queries', category: 'Root Operations' },
  '/admin/backups': { permKey: 'canManageSnapshots', label: 'Snapshot Vault & Restore', category: 'Root Operations' },
  '/admin/health': { permKey: 'canManageHealth', label: 'Doc Health & Linter', category: 'Quality Assurance' },
  '/admin/media': { permKey: 'canManageMedia', label: 'Media & Asset Vault', category: 'Publishing' },
  '/admin/search-analytics': { permKey: 'canViewAnalytics', label: 'Search Telemetry', category: 'Analytics' },
  '/admin/ai-analytics': { permKey: 'canViewAiStats', label: 'AI Engine Telemetry', category: 'Analytics' },
  '/admin/security': { permKey: 'canManageSecurity', label: 'Securitate & Sesiuni', category: 'Root Operations' },
  '/admin/api-keys': { permKey: 'canManageApiKeys', label: 'API Tokens & Developer Access', category: 'Root Operations' },
  '/admin/audit': { permKey: 'canViewAudit', label: 'Audit Ledger', category: 'Audit & Compliance' },
  '/admin/webhooks': { permKey: 'canManageWebhooks', label: 'Webhooks & Discord Dispatch', category: 'Integrations' },
  '/admin/gitops': { rootOnly: true, label: 'GitOps & Repository Operations', category: 'Root Operations' },
  '/admin/discord-bot': { permKey: 'canManageDiscordBot', label: 'Discord Bot Management', category: 'Integrations' },
  '/admin/discord-bot/tickets': { permKey: 'canManageDiscordBot', label: 'Discord Tickets Management', category: 'Integrations' },
  '/admin/discord-bot/staff': { permKey: 'canManageDiscordBot', label: 'Discord Staff Activity', category: 'Integrations' },
  '/admin/discord-bot/role-trackers': { permKey: 'canManageDiscordBot', label: 'Discord Role Trackers', category: 'Integrations' },
  '/admin/discord-bot/watchlist': { permKey: 'canManageDiscordBot', label: 'Discord Watchlist', category: 'Integrations' },
  '/admin/discord-bot/modules': { permKey: 'canManageDiscordBot', label: 'Discord Bot Modules', category: 'Integrations' },
  '/admin/settings': { permKey: 'canManageSettings', label: 'Configurări Platformă (Settings)', category: 'System Configuration' },
};

function getInitialUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('wf_admin_user');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const route = useRoute();
const router = useRouter();
const user = ref<any>(getInitialUser());
const loading = ref(false);
const error = ref('');
const mobile = ref(false);

const section = computed(() => {
  const p = route.path.replace(/^\/admin\/?/, '').replace(/\/$/, '');
  return p;
});

const login = computed(() => section.value === 'login');

const isRoot = computed(() => {
  const u = user.value?.username?.toLowerCase()?.trim();
  return Boolean(user.value?.isRoot || u === 'iannc' || u === 'iannc69');
});

const normalizedPath = computed(() => {
  const p = route.path.replace(/\/$/, '');
  return p === '' ? '/admin' : p;
});

const requiredSpec = computed(() => ROUTE_PERMISSIONS[normalizedPath.value]);

const allowed = computed(() => {
  if (!user.value) return false;
  if (isRoot.value) return true;
  const spec = requiredSpec.value;
  if (!spec) return true;
  if (spec.rootOnly && !isRoot.value) return false;
  if (spec.permKey && !user.value.permissions?.[spec.permKey]) return false;
  return true;
});

async function authenticate() {
  if (typeof window === 'undefined') return;
  if (!user.value) {
    loading.value = true;
  }
  error.value = '';
  try {
    const data = await api('/api/admin/auth/me');
    if (data.authenticated && data.user) {
      user.value = data.user;
      try {
        localStorage.setItem('wf_admin_user', JSON.stringify(data.user));
      } catch {}
    } else {
      user.value = null;
      try {
        localStorage.removeItem('wf_admin_user');
      } catch {}
      if (!login.value) {
        await router.go('/admin/login');
      }
    }
  } catch (e: any) {
    if (e.status === 401 || !user.value) {
      user.value = null;
      try {
        localStorage.removeItem('wf_admin_user');
      } catch {}
      if (!login.value) {
        await router.go('/admin/login');
      }
    } else {
      error.value = e.message;
    }
  } finally {
    loading.value = false;
    mobile.value = false;
  }
}

watch(
  () => route.path,
  () => {
    if (typeof window !== 'undefined' && route.path.startsWith('/panel')) {
      void router.go('/admin');
      return;
    }
    void authenticate();
  },
  { immediate: true }
);

async function logout() {
  try {
    localStorage.removeItem('wf_admin_user');
  } catch {}
  await api('/api/admin/auth/logout', {});
  user.value = null;
  await router.go('/admin/login');
}
</script>

<template>
  <div
    class="admin-root-container"
    :class="{ 'admin-root-container--auth': login || (!user && loading) }"
    :style="login ? { paddingTop: 0, minHeight: '100vh', background: 'hsl(220 22% 4%)' } : undefined"
  >
    <!-- Liquid organic waves & fire background -->
    <LiquidBackground />

    <!-- When visiting /admin/login, display the login form immediately -->
    <AdminLogin v-if="login && !user" />

    <!-- Minimal unobtrusive loader when cold-checking auth session -->
    <div
      v-else-if="loading && !user"
      class="adx-shell-loader"
    >
      <Icon icon="lucide:refresh-cw" width="28" height="28" class="animate-spin text-amber-500" />
    </div>

    <template v-else>
      <!-- Fixed Top Admin Header 1:1 with wf-docscore -->
      <AdminHeader
        v-if="user"
        :user="user"
        @toggle-mobile="mobile = !mobile"
        @logout="logout"
      />

      <!-- Admin Body Container (Sidebar + Content) -->
      <div
        class="admin-body-container"
        :class="{ 'admin-body-container--auth': !user }"
      >
        <AdminSidebar
          v-if="user"
          :user="user"
          :mobile-open="mobile"
          @close="mobile = false"
        />

        <main
          class="admin-main-content"
          :class="{ 'admin-main-content--auth': !user }"
        >
          <div v-if="error" class="adx-error-box" role="alert">
            <Icon icon="lucide:alert-circle" class="text-red-500" width="24" height="24" />
            <p>{{ error }}</p>
            <button type="button" class="adx-btn adx-btn--primary" @click="authenticate">Reîncearcă</button>
          </div>

          <!-- Access Denied (Guest or Insufficient RBAC) -->
          <AdminAccessDenied
            v-else-if="!user"
            username="Vizitator"
            display-name="Neautentificat"
            role="Guest"
            :pathname="route.path"
          />

          <AdminAccessDenied
            v-else-if="!allowed"
            :username="user.username"
            :display-name="user.displayName"
            :role="user.role"
            :pathname="route.path"
            :required-spec="requiredSpec"
            :can-edit-docs="Boolean(user.permissions?.canEditDocs)"
          />

          <!-- Dynamic Admin Views 1:1 Parity -->
          <Dashboard v-else-if="section === ''" :user="user" />
          <Studio v-else-if="section === 'content'" :user="user" />
          <Tasks v-else-if="section === 'tasks'" :user="user" />
          <Team v-else-if="section === 'team'" :user="user" />
          <Webhooks v-else-if="section === 'webhooks'" :user="user" />
          <GitOps v-else-if="section === 'gitops'" :user="user" />
          <Database v-else-if="section === 'database'" :user="user" />
          <Security v-else-if="section === 'security'" :user="user" />
          <ApiKeys v-else-if="section === 'api-keys'" :user="user" />
          <Audit v-else-if="section === 'audit'" :user="user" />
          <Backups v-else-if="section === 'backups'" :user="user" />
          <Settings v-else-if="section === 'settings'" :user="user" />
          <Media v-else-if="section === 'media'" :user="user" />
          <Inbox v-else-if="section === 'inbox'" :user="user" />
          <Profile v-else-if="section === 'profile'" :user="user" />
          <Health v-else-if="section === 'health'" :user="user" />
          <SearchAnalytics v-else-if="section === 'search-analytics'" :user="user" />
          <AiAnalytics v-else-if="section === 'ai-analytics'" :user="user" />

          <!-- Discord Bot Suite Views -->
          <DiscordBot v-else-if="section === 'discord-bot'" :user="user" />
          <Modules v-else-if="section === 'discord-bot/modules'" :user="user" />
          <DiscordRoleTrackers v-else-if="section === 'discord-bot/role-trackers'" :user="user" />
          <DiscordStaff v-else-if="section === 'discord-bot/staff'" :user="user" />
          <DiscordTickets v-else-if="section === 'discord-bot/tickets'" :user="user" />
          <DiscordWatchlist v-else-if="section === 'discord-bot/watchlist'" :user="user" />

          <!-- Fallback Generic View -->
          <Resource v-else-if="user" :key="section" :section="section" :user="user" />
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
.adx-shell-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: hsl(220 22% 4%);
}

.adx-loading-box,
.adx-error-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
  text-align: center;
}
</style>
