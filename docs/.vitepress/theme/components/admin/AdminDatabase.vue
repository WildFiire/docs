<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import AdminThematicLoader from './AdminThematicLoader.vue';

defineProps<{
  user?: any;
}>();

interface DocViewRecord {
  slug: string;
  total_views: number;
  today_views?: number;
  last_viewed_at: string;
}

interface DocFeedbackRecord {
  id: string;
  slug: string;
  rating: 'helpful' | 'unhelpful';
  comment?: string;
  created_at: string;
}

interface DocReportRecord {
  id: string;
  type: 'issue' | 'new_guide_request';
  slug?: string;
  title: string;
  description: string;
  author: string;
  status: 'open' | 'in_progress' | 'resolved' | 'dismissed';
  severity?: 'normal' | 'medium' | 'high';
  contactDiscord?: string;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  category?: string;
}

interface DatabaseStatus {
  totalViews: number;
  totalFeedbacks: number;
  totalTrackedDocs: number;
  activeProvider: 'local' | 'supabase';
  isConnected: boolean;
}

const status = ref<DatabaseStatus | null>(null);
const views = ref<DocViewRecord[]>([]);
const feedbacks = ref<DocFeedbackRecord[]>([]);
const reports = ref<DocReportRecord[]>([]);
const loading = ref<boolean>(true);
const refreshing = ref<boolean>(false);

// Search & Filter State
const viewSearch = ref<string>('');
const viewFilter = ref<'all' | 'top5' | 'recent'>('all');
const feedbackSearch = ref<string>('');
const feedbackFilter = ref<'all' | 'helpful' | 'unhelpful' | 'with_comments'>('all');
const reportSearch = ref<string>('');
const reportFilter = ref<'all' | 'issues' | 'requests' | 'open' | 'resolved'>('all');

// Tab State: strictly the 4 authentic tabs from wf-docscore
const activeTab = ref<'views' | 'feedbacks' | 'reports' | 'config'>('views');

const dbProvider = ref<'local' | 'supabase'>('local');
const supabaseUrl = ref<string>('');
const supabaseAnonKey = ref<string>('');
const testingDb = ref<boolean>(false);
const testResult = ref<{ success: boolean; message: string; latencyMs?: number } | null>(null);
const savingConfig = ref<boolean>(false);
const copiedSql = ref<boolean>(false);
const actionMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const syncingAll = ref<boolean>(false);

async function loadData(isRefresh = false) {
  if (isRefresh) refreshing.value = true;
  else loading.value = true;

  try {
    const data = await api('/api/admin/database');
    if (data) {
      status.value = data.status || null;
      views.value = data.views || [];
      feedbacks.value = data.feedbacks || [];
      reports.value = data.reports || [];
      if (data.config) {
        dbProvider.value = data.config.provider || 'local';
        supabaseUrl.value = data.config.supabaseUrl || '';
        supabaseAnonKey.value = data.config.supabaseAnonKey || '';
      }
    }
  } catch (err) {
    console.error('[Admin Database] Failed to load data:', err);
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

onMounted(() => {
  loadData();
});

// Filtered views list
const filteredViews = computed(() => {
  let result = [...views.value];

  if (viewFilter.value === 'top5') {
    result = result.sort((a, b) => b.total_views - a.total_views).slice(0, 5);
  } else if (viewFilter.value === 'recent') {
    result = result.sort((a, b) => new Date(b.last_viewed_at).getTime() - new Date(a.last_viewed_at).getTime());
  } else {
    result = result.sort((a, b) => b.total_views - a.total_views);
  }

  if (viewSearch.value.trim()) {
    const query = viewSearch.value.toLowerCase();
    result = result.filter((v) => v.slug.toLowerCase().includes(query));
  }

  return result;
});

// Filtered feedbacks list
const filteredFeedbacks = computed(() => {
  return feedbacks.value.filter((fb) => {
    if (feedbackFilter.value === 'helpful' && fb.rating !== 'helpful') return false;
    if (feedbackFilter.value === 'unhelpful' && fb.rating !== 'unhelpful') return false;
    if (feedbackFilter.value === 'with_comments' && (!fb.comment || !fb.comment.trim())) return false;

    if (feedbackSearch.value.trim()) {
      const q = feedbackSearch.value.toLowerCase();
      const matchSlug = fb.slug.toLowerCase().includes(q);
      const matchComment = fb.comment?.toLowerCase().includes(q);
      return matchSlug || matchComment;
    }
    return true;
  });
});

// Filtered reports list
const filteredReports = computed(() => {
  return reports.value.filter((rep) => {
    if (reportFilter.value === 'issues' && rep.type !== 'issue') return false;
    if (reportFilter.value === 'requests' && rep.type !== 'new_guide_request') return false;
    if (reportFilter.value === 'open' && rep.status === 'resolved') return false;
    if (reportFilter.value === 'resolved' && rep.status !== 'resolved') return false;

    if (reportSearch.value.trim()) {
      const q = reportSearch.value.toLowerCase();
      const matchSlug = rep.slug?.toLowerCase().includes(q);
      const matchDesc = rep.description?.toLowerCase().includes(q);
      const matchTitle = rep.title?.toLowerCase().includes(q);
      const matchDiscord = rep.contactDiscord?.toLowerCase().includes(q);
      return matchSlug || matchDesc || matchTitle || matchDiscord;
    }
    return true;
  });
});

// Positive feedback calculations
const helpfulCount = computed(() => feedbacks.value.filter((f) => f.rating === 'helpful').length);
const unhelpfulCount = computed(() => feedbacks.value.length - helpfulCount.value);
const commentsCount = computed(() => feedbacks.value.filter((f) => f.comment && f.comment.trim()).length);
const helpfulPct = computed(() => (feedbacks.value.length > 0 ? Math.round((helpfulCount.value / feedbacks.value.length) * 100) : 100));

const openReportsCount = computed(() => reports.value.filter((r) => r.status === 'open' || r.status === 'in_progress').length);
const newGuidesRequestsCount = computed(() => reports.value.filter((r) => r.type === 'new_guide_request').length);

async function handleUpdateReportStatus(id: string, newStatus: 'open' | 'in_progress' | 'resolved') {
  try {
    await api('/api/admin/database', {
      method: 'POST',
      body: { action: 'update_report_status', id, status: newStatus },
    });
    reports.value = reports.value.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
  } catch (err) {
    console.error('Failed to update report status', err);
  }
}

async function handleDeleteReport(id: string) {
  try {
    await api('/api/admin/database', {
      method: 'POST',
      body: { action: 'delete_report', id },
    });
    reports.value = reports.value.filter((r) => r.id !== id);
  } catch (err) {
    console.error('Failed to delete report', err);
  }
}

async function handleDeleteFeedback(id: string) {
  try {
    await api('/api/admin/database', {
      method: 'POST',
      body: { action: 'delete_feedback', id },
    });
    feedbacks.value = feedbacks.value.filter((f) => f.id !== id);
  } catch (err) {
    console.error('Failed to delete feedback', err);
  }
}

async function handleTestConnection() {
  if (!supabaseUrl.value || !supabaseAnonKey.value) {
    testResult.value = { success: false, message: 'Te rugăm să introduci Supabase URL și Cheia Anon.' };
    return;
  }

  testingDb.value = true;
  testResult.value = null;

  try {
    const data = await api('/api/admin/database', {
      method: 'POST',
      body: {
        action: 'test_connection',
        url: supabaseUrl.value,
        anonKey: supabaseAnonKey.value,
      },
    });
    testResult.value = data;
  } catch (err: any) {
    testResult.value = { success: false, message: `Eroare rețea: ${err.message}` };
  } finally {
    testingDb.value = false;
  }
}

async function handleSaveConfig() {
  savingConfig.value = true;
  actionMessage.value = null;

  try {
    const data = await api('/api/admin/database', {
      method: 'POST',
      body: {
        action: 'save_config',
        provider: dbProvider.value,
        supabaseUrl: supabaseUrl.value,
        supabaseAnonKey: supabaseAnonKey.value,
      },
    });

    if (data?.status) {
      status.value = data.status;
      actionMessage.value = {
        type: 'success',
        text: `Configurația bazei a fost salvată cu succes! (${dbProvider.value === 'supabase' ? 'Supabase Cloud' : 'Local Engine'})`,
      };
    }
  } catch {
    actionMessage.value = { type: 'error', text: 'Eșec la salvarea configurației.' };
  } finally {
    savingConfig.value = false;
  }
}

async function handleSyncAllToSupabase() {
  syncingAll.value = true;
  actionMessage.value = null;
  try {
    const data = await api('/api/admin/database', {
      method: 'POST',
      body: { action: 'sync_all_to_supabase' },
    });
    if (data?.success) {
      const c = data.counts || {};
      actionMessage.value = {
        type: 'success',
        text: `Sincronizare completă reușită! ${c.viewsCount || 0} vizualizări, ${c.feedbacksCount || 0} feedback-uri, ${c.reportsCount || 0} rapoarte, ${c.tasksCount || 0} sarcini, ${c.notificationsCount || 0} notificări și ${c.teamCount || 0} membri au fost scriși direct în Supabase.`,
      };
      loadData(true);
    } else {
      actionMessage.value = {
        type: 'error',
        text: data?.error || 'Eroare la sincronizarea în Supabase. Asigură-te că ai rulat Schema SQL în Supabase!',
      };
    }
  } catch (err: any) {
    actionMessage.value = {
      type: 'error',
      text: `Eroare de rețea: ${err.message}`,
    };
  } finally {
    syncingAll.value = false;
  }
}

function copySqlScript() {
  const sql = `-- ══════════════════════════════════════════════════════════════════
-- WILDFIRE DOCS ENGINE — COMPLETE SUPABASE POSTGRESQL SCHEMA (10 TABLES)
-- ══════════════════════════════════════════════════════════════════

-- 1. Tabel Vizualizări Ghiduri (Page Views & Traffic)
create table if not exists doc_views (
  slug text primary key,
  total_views integer default 0,
  today_views integer default 0,
  last_viewed_at timestamp with time zone default now()
);

-- 2. Tabel Feedback Jucători (Ratings & Comments)
create table if not exists doc_feedbacks (
  id text primary key,
  slug text not null,
  rating text not null,
  comment text,
  created_at timestamp with time zone default now()
);

-- 3. Tabel Rapoarte Erori & Cereri Ghiduri (Player Reports)
create table if not exists doc_reports (
  id text primary key,
  type text not null default 'issue', -- 'issue' | 'new_guide_request'
  slug text,
  title text not null,
  description text not null,
  author text not null default 'Vizitator Anonim',
  status text not null default 'open', -- 'open' | 'in_progress' | 'resolved' | 'dismissed'
  created_at timestamp with time zone default now(),
  resolved_at timestamp with time zone,
  resolved_by text
);

-- 4. Tabel Sarcini & TODO Kanban (Admin Tasks)
create table if not exists admin_tasks (
  id text primary key,
  title text not null,
  description text,
  category text not null default 'DOCS_UPDATE',
  priority text not null default 'medium', -- 'low' | 'medium' | 'high' | 'urgent'
  status text not null default 'todo', -- 'todo' | 'in_progress' | 'review' | 'done' | 'completed'
  assigned_to text not null,
  created_by text not null,
  deadline timestamp with time zone,
  subtasks jsonb default '[]'::jsonb,
  comments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. Tabel Notificări & Alerte Administrative (Notification Hub)
create table if not exists admin_notifications (
  id text primary key,
  target_user text,
  is_global boolean default false,
  title text not null,
  message text not null,
  category text not null default 'system', -- 'task' | 'report' | 'feedback' | 'security' | 'system' | 'ai' | 'health'
  severity text not null default 'info', -- 'info' | 'success' | 'warning' | 'urgent'
  link text,
  read_by jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  metadata jsonb default '{}'::jsonb
);

-- 6. Tabel Membri Echipă & Permisiuni (Staff & Team Matrix)
create table if not exists team_members (
  id text primary key,
  username text not null unique,
  display_name text not null,
  email text,
  role text not null default 'content_editor',
  custom_title text,
  avatar_url text,
  avatar_color text,
  bio text,
  responsibilities jsonb default '[]'::jsonb,
  badges jsonb default '[]'::jsonb,
  discord text,
  steam_id text,
  github_username text,
  docs_modified_count integer default 0,
  password_hash text not null,
  salt text not null,
  permissions jsonb not null,
  status text not null default 'active',
  is_root boolean not null default false,
  created_at timestamp with time zone default now(),
  last_login_at timestamp with time zone
);

-- 7. Tabel Setări Platformă (Global Settings)
create table if not exists platform_settings (
  id text primary key default 'global',
  settings jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 8. Tabel Registru de Audit (Audit Ledger SHA-256)
create table if not exists audit_ledger (
  id text primary key,
  event_id text,
  action text not null,
  actor text not null default 'System',
  ip text,
  user_agent text,
  details jsonb default '{}'::jsonb,
  sha256_hash text,
  previous_hash text,
  created_at timestamp with time zone default now()
);

-- 9. Tabel Telemetrie Căutare (Search Telemetry)
create table if not exists search_telemetry (
  id text primary key,
  query text not null,
  hits integer default 1,
  results_count integer default 0,
  category text,
  created_at timestamp with time zone default now()
);

-- 10. Tabel Revizii Articole (Doc Versions & Rollbacks)
create table if not exists doc_versions (
  id text primary key,
  slug text not null,
  version_number integer default 1,
  content text not null,
  summary text,
  author text default 'System',
  created_at timestamp with time zone default now()
);

-- ── Indexuri Performanță ──────────────────────────────────────────
create index if not exists idx_doc_views_total on doc_views(total_views desc);
create index if not exists idx_admin_tasks_status on admin_tasks(status);
create index if not exists idx_team_members_username on team_members(username);
create index if not exists idx_audit_ledger_created on audit_ledger(created_at desc);
create index if not exists idx_search_telemetry_query on search_telemetry(query);
create index if not exists idx_doc_versions_slug on doc_versions(slug);

-- ── Securitate & Politici Row Level Security (RLS) ───────────────
alter table doc_views enable row level security;
alter table doc_feedbacks enable row level security;
alter table doc_reports enable row level security;
alter table admin_tasks enable row level security;
alter table admin_notifications enable row level security;
alter table team_members enable row level security;
alter table platform_settings enable row level security;
alter table audit_ledger enable row level security;
alter table search_telemetry enable row level security;
alter table doc_versions enable row level security;

-- Curățare politici existente
drop policy if exists "Allow public read on doc_views" on doc_views;
drop policy if exists "Allow public insert/update on doc_views" on doc_views;
drop policy if exists "Allow public read on doc_feedbacks" on doc_feedbacks;
drop policy if exists "Allow public insert on doc_feedbacks" on doc_feedbacks;
drop policy if exists "Allow public read on doc_reports" on doc_reports;
drop policy if exists "Allow public insert on doc_reports" on doc_reports;
drop policy if exists "Allow all on admin_tasks" on admin_tasks;
drop policy if exists "Allow all on admin_notifications" on admin_notifications;
drop policy if exists "Allow read on team_members" on team_members;
drop policy if exists "Allow all on team_members" on team_members;
drop policy if exists "Allow all on platform_settings" on platform_settings;
drop policy if exists "Allow all on audit_ledger" on audit_ledger;
drop policy if exists "Allow all on search_telemetry" on search_telemetry;
drop policy if exists "Allow all on doc_versions" on doc_versions;

-- Politici de acces public & admin
create policy "Allow public read on doc_views" on doc_views for select using (true);
create policy "Allow public insert/update on doc_views" on doc_views for all using (true);

create policy "Allow public read on doc_feedbacks" on doc_feedbacks for select using (true);
create policy "Allow public insert on doc_feedbacks" on doc_feedbacks for insert with check (true);

create policy "Allow public read on doc_reports" on doc_reports for select using (true);
create policy "Allow public insert on doc_reports" on doc_reports for insert with check (true);

create policy "Allow all on admin_tasks" on admin_tasks for all using (true);
create policy "Allow all on admin_notifications" on admin_notifications for all using (true);

create policy "Allow read on team_members" on team_members for select using (true);
create policy "Allow all on team_members" on team_members for all using (true);

create policy "Allow all on platform_settings" on platform_settings for all using (true);
create policy "Allow all on audit_ledger" on audit_ledger for all using (true);
create policy "Allow all on search_telemetry" on search_telemetry for all using (true);
create policy "Allow all on doc_versions" on doc_versions for all using (true);`;

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(sql);
    copiedSql.value = true;
    setTimeout(() => {
      copiedSql.value = false;
    }, 2000);
  }
}
</script>

<template>
  <AdminThematicLoader
    v-if="loading"
    mode="inline"
    title="DATABASE & TELEMETRY HUB"
    subtitle="Se verifică conexiunea la clusterul PostgreSQL și telemetrie…"
  />

  <div v-else class="admin-page-container">
    <!-- ── Page Header ────────────────────────────────────────────── -->
    <div class="admin-page-header">
      <div>
        <div class="admin-page-pretitle-tag">
          <Icon icon="lucide:database" width="11" height="11" class="text-cyan-400" />
          <span>DATABASE &amp; TELEMETRY HUB</span>
        </div>
        <h1 class="admin-page-title">Bază de Date &amp; Telemetrie Docs</h1>
        <p class="admin-page-desc">
          Monitorizare în timp real a traficului pe ghiduri, feedback-ul comunității și sincronizarea Supabase PostgreSQL.
        </p>
      </div>

      <div class="admin-header-actions">
        <button
          type="button"
          class="admin-btn admin-btn--primary"
          :disabled="syncingAll"
          title="Sincronizează toate datele locale (vizualizări, feedback, rapoarte, sarcini, notificări, echipă) direct în tabelele Supabase"
          @click="handleSyncAllToSupabase"
        >
          <Icon icon="lucide:zap" width="13" height="13" :class="{ 'admin-spin': syncingAll }" />
          <span>{{ syncingAll ? 'Se sincronizează în Supabase...' : 'Auto-Sync în Supabase' }}</span>
        </button>

        <button
          type="button"
          class="admin-btn admin-btn--secondary"
          :disabled="refreshing"
          title="Reîncarcă datele din baza de date"
          @click="loadData(true)"
        >
          <Icon icon="lucide:refresh-cw" width="13" height="13" :class="{ 'admin-spin': refreshing }" />
          <span>{{ refreshing ? 'Se actualizează...' : 'Sincronizează Live' }}</span>
        </button>

        <button
          type="button"
          class="admin-btn admin-btn--secondary"
          title="Copiază scriptul SQL pentru Supabase"
          @click="copySqlScript"
        >
          <Icon v-if="copiedSql" icon="lucide:check" width="13" height="13" class="text-emerald-400" />
          <Icon v-else icon="lucide:copy" width="13" height="13" />
          <span>{{ copiedSql ? 'SQL Copiat!' : 'Copiază Schema SQL' }}</span>
        </button>
      </div>
    </div>

    <!-- Alert Box -->
    <div
      v-if="actionMessage"
      class="admin-alert-box"
      :class="actionMessage.type === 'success' ? 'admin-alert-box--success' : 'admin-alert-box--danger'"
    >
      <Icon v-if="actionMessage.type === 'success'" icon="lucide:check-circle-2" width="15" height="15" />
      <Icon v-else icon="lucide:alert-circle" width="15" height="15" />
      <span>{{ actionMessage.text }}</span>
    </div>

    <!-- ── 4-Metric KPI Grid ───────────────────────────────────────── -->
    <div class="admin-db-kpi-grid">
      <!-- Metric 1: Views -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Total Vizualizări Pagini</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--cyan">
            <Icon icon="lucide:eye" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--cyan">
            {{ (status?.totalViews || 0).toLocaleString() }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--cyan">
            <Icon icon="lucide:trending-up" width="10" height="10" /> Live
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Accesări unice înregistrate în documentație</p>
      </div>

      <!-- Metric 2: Feedbacks -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Feedback Comunitate</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--amber">
            <Icon icon="lucide:message-square" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--amber">
            {{ (status?.totalFeedbacks || 0).toLocaleString() }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--amber">
            {{ helpfulPct }}% util
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">{{ helpfulCount }} voturi pozitive din {{ feedbacks.length }}</p>
      </div>

      <!-- Metric 3: Tracked Docs -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Documente Urmărite</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--purple">
            <Icon icon="lucide:file-text" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--purple">
            {{ (status?.totalTrackedDocs || 0).toLocaleString() }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--purple">
            Tracking
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">Ghiduri active cu tracking live de date</p>
      </div>

      <!-- Metric 4: Supabase Engine Status -->
      <div class="admin-db-kpi-card">
        <div class="admin-db-kpi-header">
          <span class="admin-db-kpi-title">Status Motor Bază de Date</span>
          <div class="admin-db-kpi-icon-box admin-db-kpi-icon-box--emerald">
            <Icon icon="lucide:database" width="16" height="16" />
          </div>
        </div>
        <div class="admin-db-kpi-body">
          <span class="admin-db-kpi-value admin-db-kpi-value--emerald text-lg">
            {{ status?.activeProvider === 'supabase'
              ? status?.isConnected ? 'Supabase Cloud' : 'Deconectat'
              : 'Local Engine' }}
          </span>
          <span class="admin-db-kpi-badge admin-db-kpi-badge--emerald">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {{ status?.isConnected ? '200 OK' : 'Offline' }}
          </span>
        </div>
        <p class="admin-db-kpi-subtitle">
          {{ status?.activeProvider === 'supabase'
            ? 'PostgreSQL Cloud • Sincronizare Activă'
            : 'Persistent Zero-Config Engine' }}
        </p>
      </div>
    </div>

    <!-- ── Main Navigation Tabs (Strictly 4 authentic tabs) ───────────── -->
    <div class="admin-db-tabs-bar">
      <button
        type="button"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-cyan': activeTab === 'views' }"
        @click="activeTab = 'views'"
      >
        <Icon icon="lucide:eye" width="14" height="14" />
        <span>Top Vizualizări Pagini</span>
        <span class="admin-db-tab-badge">{{ views.length }}</span>
      </button>

      <button
        type="button"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-amber': activeTab === 'feedbacks' }"
        @click="activeTab = 'feedbacks'"
      >
        <Icon icon="lucide:message-square" width="14" height="14" />
        <span>Recenzii &amp; Sugestii Jucători</span>
        <span class="admin-db-tab-badge">{{ feedbacks.length }}</span>
      </button>

      <button
        type="button"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-rose': activeTab === 'reports' }"
        @click="activeTab = 'reports'"
      >
        <Icon icon="lucide:alert-triangle" width="14" height="14" />
        <span>Rapoarte &amp; Cereri Ghiduri</span>
        <span
          class="admin-db-tab-badge"
          :style="openReportsCount > 0 ? { background: 'hsl(350 89% 60% / 0.3)', color: '#fda4af' } : undefined"
        >
          {{ reports.length }}
        </span>
      </button>

      <button
        type="button"
        class="admin-db-tab-btn"
        :class="{ 'admin-db-tab-btn--active-emerald': activeTab === 'config' }"
        @click="activeTab = 'config'"
      >
        <Icon icon="lucide:server" width="14" height="14" />
        <span>Configurare Supabase &amp; Migrare SQL</span>
      </button>
    </div>

    <!-- ── TAB 1: Top Views Explorer ────────────────────────────────── -->
    <div v-if="activeTab === 'views'" class="admin-panel-card">
      <div class="admin-panel-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="admin-quota-icon-box admin-quota-icon-box--cyan">
            <Icon icon="lucide:eye" width="16" height="16" class="text-cyan-400" />
          </div>
          <div>
            <h3 class="admin-section-title">Clasament Accesări Documente</h3>
            <p class="admin-panel-sub">
              Distribuția completă a traficului și popularitatea ghidurilor din comunitate
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="admin-perm-tag admin-perm-tag--cyan">
            <Icon icon="lucide:layers" width="11" height="11" /> {{ filteredViews.length }} Ghiduri Urmărite
          </span>
          <span class="admin-perm-tag admin-perm-tag--emerald">
            <Icon icon="lucide:eye" width="11" height="11" /> {{ (status?.totalViews || 0).toLocaleString() }} Total Accesări
          </span>
        </div>
      </div>

      <!-- Table Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-table-filters">
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': viewFilter === 'all' }"
            @click="viewFilter = 'all'"
          >
            Toate ({{ views.length }})
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': viewFilter === 'top5' }"
            @click="viewFilter = 'top5'"
          >
            Top 5 Populare
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': viewFilter === 'recent' }"
            @click="viewFilter = 'recent'"
          >
            Recente
          </button>
        </div>

        <div class="admin-table-search">
          <div class="admin-search-input-wrap">
            <Icon icon="lucide:search" width="13" height="13" class="admin-search-icon" />
            <input
              v-model="viewSearch"
              type="text"
              placeholder="Caută după slug (ex: informatii/staff)..."
              class="admin-search-input"
            />
          </div>
        </div>
      </div>

      <!-- Views Table -->
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 90px;">Rang</th>
              <th>Ghid / Document</th>
              <th>Total Vizualizări</th>
              <th>Ultima Accesare</th>
              <th style="text-align: right; width: 90px;">Deschide</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredViews.length === 0">
              <td colspan="5" class="admin-table-empty">
                <Icon icon="lucide:eye" width="24" height="24" style="margin: 0 auto 8px; opacity: 0.35;" />
                <p>{{ viewSearch ? 'Niciun document nu corespunde căutării.' : 'Nicio vizualizare înregistrată încă.' }}</p>
              </td>
            </tr>
            <tr v-for="(view, i) in filteredViews" :key="view.slug">
              <td>
                <span
                  class="admin-rank-badge"
                  :class="i === 0 ? 'admin-rank-badge--gold' : i === 1 ? 'admin-rank-badge--silver' : i === 2 ? 'admin-rank-badge--bronze' : 'admin-rank-badge--default'"
                >
                  <Icon v-if="i < 3" icon="lucide:award" width="11" height="11" />
                  #{{ i + 1 }}
                </span>
              </td>
              <td>
                <a
                  :href="`/docs/${view.slug}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="admin-perm-tag admin-perm-tag--blue"
                  style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;"
                >
                  <Icon icon="lucide:book-open" width="11" height="11" />
                  /docs/{{ view.slug }}
                  <Icon icon="lucide:external-link" width="10" height="10" style="opacity: 0.6;" />
                </a>
              </td>
              <td>
                <span class="admin-views-metric-pill">
                  <Icon icon="lucide:eye" width="12" height="12" />
                  {{ view.total_views.toLocaleString() }} accesări
                </span>
              </td>
              <td>
                <span class="admin-table-mono admin-table-muted" style="display: inline-flex; align-items: center; gap: 5px;">
                  <Icon icon="lucide:clock" width="11" height="11" />
                  {{ new Date(view.last_viewed_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </td>
              <td style="text-align: right;">
                <a
                  :href="`/docs/${view.slug}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="admin-db-link-btn"
                  title="Deschide documentul în tab nou"
                  style="display: inline-flex;"
                >
                  <Icon icon="lucide:external-link" width="13" height="13" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── TAB 2: Feedbacks & Reviews Center ────────────────────────── -->
    <div v-if="activeTab === 'feedbacks'" class="admin-panel-card">
      <div class="admin-panel-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="admin-quota-icon-box admin-quota-icon-box--amber">
            <Icon icon="lucide:message-square" width="16" height="16" class="text-amber-400" />
          </div>
          <div>
            <h3 class="admin-section-title">Recenzii &amp; Sugestii Comunitate</h3>
            <p class="admin-panel-sub">
              Părerile, aprecierile și comentariile trimise de jucători direct de pe paginile din documentație
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="admin-perm-tag admin-perm-tag--emerald">
            <Icon icon="lucide:thumbs-up" width="11" height="11" /> {{ helpfulCount }} Utile ({{ helpfulPct }}%)
          </span>
          <span class="admin-perm-tag admin-perm-tag--rose">
            <Icon icon="lucide:thumbs-down" width="11" height="11" /> {{ unhelpfulCount }} Inutile
          </span>
          <span class="admin-perm-tag admin-perm-tag--cyan">
            <Icon icon="lucide:quote" width="11" height="11" /> {{ commentsCount }} Comentarii
          </span>
        </div>
      </div>

      <!-- Table Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-table-filters">
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': feedbackFilter === 'all' }"
            @click="feedbackFilter = 'all'"
          >
            Toate ({{ feedbacks.length }})
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': feedbackFilter === 'helpful' }"
            @click="feedbackFilter = 'helpful'"
          >
            Doar Utile ({{ helpfulCount }})
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': feedbackFilter === 'unhelpful' }"
            @click="feedbackFilter = 'unhelpful'"
          >
            Doar Inutile ({{ unhelpfulCount }})
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': feedbackFilter === 'with_comments' }"
            @click="feedbackFilter = 'with_comments'"
          >
            Cu Comentarii ({{ commentsCount }})
          </button>
        </div>

        <div class="admin-table-search">
          <div class="admin-search-input-wrap">
            <Icon icon="lucide:search" width="13" height="13" class="admin-search-icon" />
            <input
              v-model="feedbackSearch"
              type="text"
              placeholder="Caută în comentarii sau slug..."
              class="admin-search-input"
            />
          </div>
        </div>
      </div>

      <!-- Feedback Table -->
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 120px;">Evaluare</th>
              <th>Ghid Document</th>
              <th>Comentariu / Opinie Jucător</th>
              <th style="width: 170px;">Data Înregistrării</th>
              <th style="text-align: right; width: 80px;">Șterge</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredFeedbacks.length === 0">
              <td colspan="5" class="admin-table-empty">
                <Icon icon="lucide:message-square" width="24" height="24" style="margin: 0 auto 8px; opacity: 0.35;" />
                <p>
                  {{ feedbackSearch || feedbackFilter !== 'all'
                    ? 'Niciun feedback nu corespunde filtrelor selectate.'
                    : 'Niciun feedback primit încă de la jucători.' }}
                </p>
              </td>
            </tr>
            <tr v-for="fb in filteredFeedbacks" :key="fb.id">
              <td>
                <span
                  class="admin-status-pill"
                  :class="fb.rating === 'helpful' ? 'admin-status-pill--success' : 'admin-status-pill--danger'"
                >
                  <Icon :icon="fb.rating === 'helpful' ? 'lucide:thumbs-up' : 'lucide:thumbs-down'" width="11" height="11" />
                  {{ fb.rating === 'helpful' ? 'UTIL' : 'INUTIL' }}
                </span>
              </td>
              <td>
                <a
                  :href="`/docs/${fb.slug}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="admin-perm-tag admin-perm-tag--blue"
                  style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;"
                >
                  <Icon icon="lucide:book-open" width="11" height="11" />
                  /docs/{{ fb.slug }}
                  <Icon icon="lucide:external-link" width="10" height="10" style="opacity: 0.6;" />
                </a>
              </td>
              <td>
                <div v-if="fb.comment && fb.comment.trim()" class="admin-feedback-quote">
                  <Icon icon="lucide:quote" width="12" height="12" style="opacity: 0.6; flex-shrink: 0; margin-top: 2px; color: #fbbf24;" />
                  <span class="admin-feedback-quote-text">&ldquo;{{ fb.comment }}&rdquo;</span>
                </div>
                <span v-else class="admin-table-muted" style="font-style: italic; font-size: 0.74rem;">
                  — Fără comentariu atașat
                </span>
              </td>
              <td>
                <span class="admin-table-mono admin-table-muted" style="display: inline-flex; align-items: center; gap: 5px;">
                  <Icon icon="lucide:clock" width="11" height="11" />
                  {{ new Date(fb.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </td>
              <td style="text-align: right;">
                <button
                  type="button"
                  class="admin-feedback-delete-action"
                  title="Șterge acest feedback din sistem"
                  @click="handleDeleteFeedback(fb.id)"
                >
                  <Icon icon="lucide:trash-2" width="13" height="13" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── TAB 3: Reports & Guide Requests Hub ──────────────────────── -->
    <div v-if="activeTab === 'reports'" class="admin-panel-card">
      <div class="admin-panel-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="admin-quota-icon-box admin-quota-icon-box--rose">
            <Icon icon="lucide:alert-triangle" width="16" height="16" class="text-rose-400" />
          </div>
          <div>
            <h3 class="admin-section-title">Centru Raportare Erori &amp; Cereri Ghiduri Noi</h3>
            <p class="admin-panel-sub">
              Semnalări primite direct de la jucători din documentație, sincronizate cu Discord
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="admin-perm-tag admin-perm-tag--orange">
            <Icon icon="lucide:alert-triangle" width="11" height="11" /> {{ openReportsCount }} Deschise / În Lucru
          </span>
          <span class="admin-perm-tag admin-perm-tag--cyan">
            <Icon icon="lucide:file-plus" width="11" height="11" /> {{ newGuidesRequestsCount }} Cereri Ghid Nou
          </span>
        </div>
      </div>

      <!-- Table Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-table-filters">
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': reportFilter === 'all' }"
            @click="reportFilter = 'all'"
          >
            Toate ({{ reports.length }})
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': reportFilter === 'issues' }"
            @click="reportFilter = 'issues'"
          >
            Erori Ghiduri
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': reportFilter === 'requests' }"
            @click="reportFilter = 'requests'"
          >
            Cereri Ghiduri
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': reportFilter === 'open' }"
            @click="reportFilter = 'open'"
          >
            Doar Active ({{ openReportsCount }})
          </button>
          <button
            type="button"
            class="admin-filter-pill"
            :class="{ 'admin-filter-pill--active': reportFilter === 'resolved' }"
            @click="reportFilter = 'resolved'"
          >
            Rezolvate
          </button>
        </div>

        <div class="admin-table-search">
          <div class="admin-search-input-wrap">
            <Icon icon="lucide:search" width="13" height="13" class="admin-search-icon" />
            <input
              v-model="reportSearch"
              type="text"
              placeholder="Caută în rapoarte, slug sau descriere..."
              class="admin-search-input"
            />
          </div>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 130px;">Tip &amp; Severitate</th>
              <th style="width: 200px;">Ghid Sursă / Subiect</th>
              <th>Descriere &amp; Detalii Raport</th>
              <th style="width: 130px;">Status</th>
              <th style="text-align: right; width: 130px;">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredReports.length === 0">
              <td colspan="5" class="admin-table-empty">
                <Icon icon="lucide:alert-triangle" width="24" height="24" style="margin: 0 auto 8px; opacity: 0.35;" />
                <p>
                  {{ reportSearch || reportFilter !== 'all'
                    ? 'Niciun raport nu corespunde filtrelor selectate.'
                    : 'Niciun raport sau cerere de ghid înregistrată încă.' }}
                </p>
              </td>
            </tr>
            <tr v-for="rep in filteredReports" :key="rep.id">
              <td>
                <div style="display: flex; flexDirection: column; gap: 4px;">
                  <span
                    class="admin-status-pill"
                    :class="rep.type === 'new_guide_request' ? 'admin-status-pill--cyan' : 'admin-status-pill--danger'"
                    style="font-size: 0.68rem;"
                  >
                    <Icon :icon="rep.type === 'new_guide_request' ? 'lucide:file-plus' : 'lucide:alert-triangle'" width="10" height="10" />
                    {{ rep.type === 'new_guide_request' ? 'CERERE GHID' : 'EROARE GHID' }}
                  </span>
                  <span
                    v-if="rep.severity && rep.type !== 'new_guide_request'"
                    class="admin-table-mono"
                    :style="{
                      fontSize: '0.65rem',
                      color: rep.severity === 'high' ? '#f43f5e' : rep.severity === 'medium' ? '#fbbf24' : '#10b981',
                      fontWeight: 700,
                    }"
                  >
                    {{ rep.severity.toUpperCase() }}
                  </span>
                </div>
              </td>
              <td>
                <div>
                  <a
                    v-if="rep.slug && rep.slug !== 'general'"
                    :href="`/docs/${rep.slug}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="admin-perm-tag admin-perm-tag--blue"
                    style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;"
                  >
                    <Icon icon="lucide:book-open" width="11" height="11" />
                    /docs/{{ rep.slug }}
                    <Icon icon="lucide:external-link" width="10" height="10" style="opacity: 0.6;" />
                  </a>
                  <span v-else class="admin-perm-tag admin-perm-tag--purple">
                    {{ rep.category || 'General' }}
                  </span>
                  <p v-if="rep.title" class="admin-report-title">
                    {{ rep.title }}
                  </p>
                </div>
              </td>
              <td>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <p class="admin-report-desc">
                    {{ rep.description }}
                  </p>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span
                      v-if="rep.contactDiscord"
                      class="admin-table-mono"
                      style="font-size: 0.68rem; color: #818cf8; background: hsl(235 85% 65% / 0.12); padding: 2px 6px; border-radius: 4px; border: 1px solid hsl(235 85% 65% / 0.25);"
                    >
                      Discord: {{ rep.contactDiscord }}
                    </span>
                    <span class="admin-table-mono admin-table-muted" style="font-size: 0.68rem;">
                      <Icon icon="lucide:clock" width="10" height="10" style="display: inline; vertical-align: middle; margin-right: 3px;" />
                      {{ new Date(rep.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span
                  class="admin-status-pill"
                  :class="rep.status === 'resolved' ? 'admin-status-pill--success' : rep.status === 'in_progress' ? 'admin-status-pill--amber' : 'admin-status-pill--danger'"
                  style="font-size: 0.7rem;"
                >
                  {{ rep.status === 'resolved' ? 'REZOLVAT' : rep.status === 'in_progress' ? 'ÎN LUCRU' : 'DESCHIS' }}
                </span>
              </td>
              <td style="text-align: right;">
                <div style="display: inline-flex; align-items: center; gap: 6px;">
                  <button
                    v-if="rep.status !== 'resolved'"
                    type="button"
                    class="admin-btn admin-btn--secondary"
                    style="padding: 4px 8px; font-size: 0.7rem; color: #34d399; border-color: hsl(142 71% 45% / 0.3);"
                    title="Marchează ca rezolvat"
                    @click="handleUpdateReportStatus(rep.id, 'resolved')"
                  >
                    <Icon icon="lucide:check" width="11" height="11" />
                    <span>Rezolvă</span>
                  </button>
                  <button
                    v-else
                    type="button"
                    class="admin-btn admin-btn--secondary"
                    style="padding: 4px 8px; font-size: 0.7rem; color: #94a3b8;"
                    title="Redeschide raportul"
                    @click="handleUpdateReportStatus(rep.id, 'open')"
                  >
                    <span>Redeschide</span>
                  </button>

                  <button
                    type="button"
                    class="admin-feedback-delete-action"
                    title="Șterge raportul"
                    @click="handleDeleteReport(rep.id)"
                  >
                    <Icon icon="lucide:trash-2" width="13" height="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── TAB 4: Supabase Config & SQL Studio ──────────────────────── -->
    <div
      v-if="activeTab === 'config'"
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px;"
    >
      <!-- Configuration Card -->
      <div class="admin-panel-card" style="margin-bottom: 0;">
        <div class="admin-panel-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="admin-quota-icon-box admin-quota-icon-box--emerald">
              <Icon icon="lucide:database" width="16" height="16" class="text-emerald-400" />
            </div>
            <div>
              <h3 class="admin-section-title">Setări Conexiune Supabase</h3>
              <p class="admin-panel-sub">
                Configurează cheile API pentru persistența cloud PostgreSQL
              </p>
            </div>
          </div>
        </div>

        <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span class="admin-db-section-label" style="display: block;">FURNIZOR ACTIV</span>
              <span class="admin-db-provider-active-name">
                {{ dbProvider === 'supabase' ? 'Supabase Cloud (PostgreSQL)' : 'Local Zero-Config Engine' }}
              </span>
            </div>
            <div class="admin-db-provider-group">
              <button
                type="button"
                class="admin-db-provider-btn"
                :class="{ 'admin-db-provider-btn--active-local': dbProvider === 'local' }"
                @click="dbProvider = 'local'"
              >
                Local Engine
              </button>
              <button
                type="button"
                class="admin-db-provider-btn"
                :class="{ 'admin-db-provider-btn--active-supabase': dbProvider === 'supabase' }"
                @click="dbProvider = 'supabase'"
              >
                Supabase Cloud
              </button>
            </div>
          </div>

          <template v-if="dbProvider === 'supabase'">
            <div class="admin-form-group">
              <label class="admin-form-label">Supabase Project URL</label>
              <input
                v-model="supabaseUrl"
                type="text"
                placeholder="https://xxxxxxxxxxxx.supabase.co"
                class="admin-form-input text-xs font-mono"
              />
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Supabase Publishable / Anon Key</label>
              <input
                v-model="supabaseAnonKey"
                type="password"
                placeholder="sb_publishable_... sau eyJhbGci..."
                class="admin-form-input text-xs font-mono"
              />
            </div>

            <div
              v-if="testResult"
              class="admin-db-test-result"
              :class="testResult.success ? 'admin-db-test-result--success' : 'admin-db-test-result--error'"
            >
              <Icon :icon="testResult.success ? 'lucide:check-circle-2' : 'lucide:alert-circle'" width="15" height="15" />
              <span>{{ testResult.message }}</span>
            </div>

            <div style="display: flex; gap: 10px;">
              <button
                type="button"
                class="admin-btn admin-btn--secondary"
                style="flex: 1;"
                :disabled="testingDb"
                @click="handleTestConnection"
              >
                <Icon icon="lucide:activity" width="14" height="14" :class="{ 'admin-spin': testingDb }" />
                <span>{{ testingDb ? 'Se verifică...' : 'Test Ping Conexiune' }}</span>
              </button>

              <button
                type="button"
                class="admin-btn admin-btn--secondary"
                title="Copiază codul SQL pentru crearea tabelelor"
                @click="copySqlScript"
              >
                <Icon v-if="copiedSql" icon="lucide:check" width="14" height="14" class="text-emerald-400" />
                <Icon v-else icon="lucide:copy" width="14" height="14" />
                <span>{{ copiedSql ? 'Copiat!' : 'Copiază SQL' }}</span>
              </button>
            </div>
          </template>

          <div style="padding-top: 14px; border-top: 1px solid var(--glass-border);">
            <button
              type="button"
              class="admin-btn admin-btn--primary"
              style="width: 100%; justify-content: center;"
              :disabled="savingConfig"
              @click="handleSaveConfig"
            >
              <Icon icon="lucide:save" width="14" height="14" />
              <span>{{ savingConfig ? 'Se salvează...' : 'Salvează Configurația Bazei' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- SQL Migration Assistant -->
      <div class="admin-panel-card" style="margin-bottom: 0;">
        <div class="admin-panel-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="admin-quota-icon-box admin-quota-icon-box--cyan">
              <Icon icon="lucide:layers" width="16" height="16" class="text-cyan-400" />
            </div>
            <div>
              <h3 class="admin-section-title">Schema SQL PostgreSQL</h3>
              <p class="admin-panel-sub">
                Rulează această schemă în Supabase SQL Editor pentru crearea tabelelor
              </p>
            </div>
          </div>
        </div>

        <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
          <pre class="admin-db-sql-block">
-- WildFire Docs Supabase Migration Schema
create table if not exists doc_views (
  slug text primary key,
  total_views integer default 0,
  today_views integer default 0,
  last_viewed_at timestamp with time zone default now()
);

create table if not exists doc_feedbacks (
  id text primary key,
  slug text not null,
  rating text not null,
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table doc_views enable row level security;
alter table doc_feedbacks enable row level security;

create policy "Allow public read on doc_views" 
  on doc_views for select using (true);
create policy "Allow public insert/update on doc_views" 
  on doc_views for all using (true);

create policy "Allow public read on doc_feedbacks" 
  on doc_feedbacks for select using (true);
create policy "Allow public insert on doc_feedbacks" 
  on doc_feedbacks for insert with check (true);
          </pre>

          <button
            type="button"
            class="admin-btn admin-btn--secondary"
            style="width: 100%; justify-content: center;"
            @click="copySqlScript"
          >
            <Icon v-if="copiedSql" icon="lucide:check" width="14" height="14" class="text-emerald-400" />
            <Icon v-else icon="lucide:copy" width="14" height="14" />
            <span>{{ copiedSql ? 'Script SQL Copiat în Clipboard!' : 'Copiază Scriptul SQL Complet' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
