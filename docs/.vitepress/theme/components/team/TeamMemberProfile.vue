<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{ username: string }>();

const member = ref<any>(null);
const gitStats = ref<any>(null);
const achievements = ref<any>(null);
const githubData = ref<any>(null);
const discordData = ref<any>(null);
const steamData = ref<any>(null);
const copiedHandle = ref(false);
const copiedSocial = ref<Record<string, boolean>>({});
const loading = ref(true);
const notFound = ref(false);
const socialsLoaded = ref(false);

// Tab & Filter States
const profileTab = ref<'overview' | 'timeline' | 'achievements'>('overview');
const timelineSearch = ref<string>('');
const timelineFilter = ref<'all' | 'docs' | 'commits' | 'code'>('all');
const badgeCategoryFilter = ref<'all' | 'git' | 'docs' | 'security' | 'community'>('all');

// ── Role Metadata & Vibrant Accent Definitions ──
const ROLE_META: Record<string, { label: string; accentColor: string; glowColor: string; bgTint: string }> = {
  root_admin: { label: 'Root Super Admin', accentColor: 'hsl(26 100% 52%)', glowColor: 'hsl(26 100% 52% / 0.35)', bgTint: 'hsl(26 100% 52% / 0.12)' },
  doc_lead: { label: 'Co-Lead & Systems', accentColor: 'hsl(38 96% 50%)', glowColor: 'hsl(38 96% 50% / 0.35)', bgTint: 'hsl(38 96% 50% / 0.12)' },
  content_editor: { label: 'Content Editor', accentColor: 'hsl(142 71% 45%)', glowColor: 'hsl(142 71% 45% / 0.35)', bgTint: 'hsl(142 71% 45% / 0.12)' },
  custom: { label: 'Content Editor & Reviewer', accentColor: 'hsl(142 71% 45%)', glowColor: 'hsl(142 71% 45% / 0.35)', bgTint: 'hsl(142 71% 45% / 0.12)' },
  moderator: { label: 'Moderator', accentColor: 'hsl(217 91% 60%)', glowColor: 'hsl(217 91% 60% / 0.35)', bgTint: 'hsl(217 91% 60% / 0.12)' },
  viewer: { label: 'Contributor', accentColor: 'hsl(220 14% 65%)', glowColor: 'hsl(220 14% 65% / 0.25)', bgTint: 'hsl(220 14% 65% / 0.08)' },
};

const PERM_METAS = [
  { key: 'canEditDocs', label: 'Content Studio', icon: 'lucide:file-text', color: '#10b981' },
  { key: 'canDeleteDocs', label: 'Ștergere Docs', icon: 'lucide:trash-2', color: '#f43f5e' },
  { key: 'canManageMedia', label: 'Media Vault', icon: 'lucide:folder', color: '#06b6d4' },
  { key: 'canViewAnalytics', label: 'Search Telemetry', icon: 'lucide:search', color: '#a855f7' },
  { key: 'canViewAudit', label: 'Audit Ledger', icon: 'lucide:scroll-text', color: '#f59e0b' },
  { key: 'canManageSettings', label: 'Setări & Backup', icon: 'lucide:sliders', color: '#ff6b00' },
  { key: 'canManageSecurity', label: 'Securitate 2FA', icon: 'lucide:shield-check', color: '#3b82f6' },
  { key: 'canManageApiKeys', label: 'API Tokens', icon: 'lucide:key', color: '#6366f1' },
  { key: 'canTriggerPanic', label: 'Panic Lockdown', icon: 'lucide:shield-alert', color: '#ef4444' },
  { key: 'canManageTeam', label: 'Gestiune Echipă', icon: 'lucide:users', color: '#f59e0b' },
];

const TIER_LABELS: Record<string, { name: string; color: string; bg: string; border: string }> = {
  mythic: { name: 'Mythic', color: 'hsl(280 100% 65%)', bg: 'hsl(280 100% 65% / 0.12)', border: 'hsl(280 100% 65% / 0.4)' },
  platinum: { name: 'Platinum', color: 'hsl(186 100% 50%)', bg: 'hsl(186 100% 50% / 0.12)', border: 'hsl(186 100% 50% / 0.4)' },
  gold: { name: 'Gold', color: 'hsl(43 96% 52%)', bg: 'hsl(43 96% 52% / 0.12)', border: 'hsl(43 96% 52% / 0.4)' },
  silver: { name: 'Silver', color: 'hsl(215 25% 75%)', bg: 'hsl(215 25% 75% / 0.12)', border: 'hsl(215 25% 75% / 0.3)' },
  bronze: { name: 'Bronze', color: 'hsl(25 85% 55%)', bg: 'hsl(25 85% 55% / 0.12)', border: 'hsl(25 85% 55% / 0.35)' },
};

const BADGE_ICONS: Record<string, string> = {
  Crown: 'lucide:crown',
  Zap: 'lucide:zap',
  GitCommit: 'lucide:git-commit',
  Sparkles: 'lucide:sparkles',
  BookOpen: 'lucide:book-open',
  GitBranch: 'lucide:git-branch',
  Flame: 'lucide:flame',
  ShieldCheck: 'lucide:shield-check',
  GitPullRequest: 'lucide:git-pull-request',
  FileText: 'lucide:file-text',
  Users: 'lucide:users',
  Terminal: 'lucide:terminal',
  Award: 'lucide:award',
  FileEdit: 'lucide:file-edit',
  Star: 'lucide:star',
};

const MONTH_NAMES = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'];

function getShortMonth(m: string) {
  const parts = m.split('-');
  const idx = parseInt(parts[1], 10) - 1;
  return MONTH_NAMES[idx] ?? m;
}

async function fetchProfile() {
  if (!props.username) return;
  loading.value = true;
  notFound.value = false;
  socialsLoaded.value = false;

  try {
    const res = await fetch(`/api/team/profile?username=${encodeURIComponent(props.username)}`);
    if (!res.ok) {
      notFound.value = true;
      loading.value = false;
      return;
    }
    const data = await res.json();
    member.value = data.member;
    gitStats.value = data.gitStats;
    if (data.achievements) achievements.value = data.achievements;
    loading.value = false;

    // Parallel fetch for social accounts
    const promises: Promise<void>[] = [];

    if (data.member?.githubUsername) {
      promises.push(
        fetch(`/api/team/github?username=${encodeURIComponent(data.member.githubUsername)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((gh) => { if (gh && !gh.error) githubData.value = gh; })
          .catch(() => {})
      );
    }

    if (data.member?.discord && /^\d{17,20}$/.test(data.member.discord.trim())) {
      promises.push(
        fetch(`/api/discord/avatar?id=${encodeURIComponent(data.member.discord.trim())}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => { if (d) discordData.value = d; })
          .catch(() => {})
      );
    }

    if (data.member?.steamId) {
      promises.push(
        fetch(`/api/steam/avatar?id=${encodeURIComponent(data.member.steamId.trim())}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((s) => { if (s && !s.error) steamData.value = s; })
          .catch(() => {})
      );
    }

    await Promise.allSettled(promises);
    socialsLoaded.value = true;
  } catch {
    notFound.value = true;
    loading.value = false;
  }
}

function copyProfileHandle(handle: string) {
  navigator.clipboard.writeText(`@${handle}`).then(() => {
    copiedHandle.value = true;
    setTimeout(() => { copiedHandle.value = false; }, 2000);
  });
}

function copySocialText(key: string, text: string) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copiedSocial.value[key] = true;
    setTimeout(() => {
      copiedSocial.value[key] = false;
    }, 2000);
  });
}

const roleMeta = computed(() => {
  if (!member.value) return ROLE_META.content_editor;
  return ROLE_META[member.value.role] || ROLE_META.content_editor;
});

const activePermsCount = computed(() => {
  return Object.values(member.value?.permissions || {}).filter(Boolean).length;
});

const joinedDate = computed(() => {
  if (!member.value?.createdAt) return 'Data nespecificată';
  return new Date(member.value.createdAt).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

const lastLogin = computed(() => {
  if (!member.value?.lastLoginAt) return 'Recent';
  return new Date(member.value.lastLoginAt).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const avatarSrc = computed(() => {
  if (!member.value) return 'https://cdn.discordapp.com/embed/avatars/0.png';
  return (
    member.value.avatarUrl ||
    (member.value.githubUsername ? `https://github.com/${member.value.githubUsername}.png` : null) ||
    'https://cdn.discordapp.com/embed/avatars/0.png'
  );
});

const steamUrl = computed(() => {
  if (!member.value?.steamId) return null;
  return member.value.steamId.startsWith('http')
    ? member.value.steamId
    : `https://steamcommunity.com/id/${member.value.steamId}`;
});

const discordUrl = computed(() => {
  return member.value?.discord ? `https://discord.com/users/${member.value.discord}` : null;
});

const githubUrl = computed(() => {
  return member.value?.githubUsername ? `https://github.com/${member.value.githubUsername}` : null;
});

const activityMaxCount = computed(() => {
  if (!gitStats.value?.monthlyActivity?.length) return 1;
  return Math.max(...gitStats.value.monthlyActivity.map((d: any) => d.count), 1);
});

const activityTotalActions = computed(() => {
  if (!gitStats.value?.monthlyActivity?.length) return 0;
  return gitStats.value.monthlyActivity.reduce((acc: number, curr: any) => acc + curr.count, 0);
});

// ── Timeline Unified Items Builder ──
const timelineItems = computed(() => {
  if (!gitStats.value) return [];
  const items: Array<{
    id: string;
    date: string;
    type: 'commit' | 'doc' | 'code';
    title: string;
    subtitle?: string;
    hash?: string;
    shortHash?: string;
    path?: string;
    isDoc?: boolean;
    url?: string;
  }> = [];

  // 1. Commits
  if (gitStats.value.recentCommits) {
    gitStats.value.recentCommits.forEach((c: any, i: number) => {
      items.push({
        id: `commit_${c.hash || i}`,
        date: c.date || 'Recent',
        type: 'commit',
        title: c.message || 'Commit update',
        hash: c.hash,
        shortHash: c.shortHash || (c.hash ? c.hash.slice(0, 7) : ''),
        url: c.url || `https://github.com/WildFiire/docs/commit/${c.hash}`,
      });
    });
  }

  // 2. Modified Files
  if (gitStats.value.recentFiles) {
    gitStats.value.recentFiles.forEach((f: any, i: number) => {
      const isDoc = f.file?.startsWith('content/docs/') || f.file?.startsWith('docs/');
      const cleanPath = isDoc
        ? f.file.replace(/^(content\/docs\/|docs\/)/, '').replace(/\.md$/, '')
        : f.file;
      items.push({
        id: `file_${f.commitHash || i}_${f.file}`,
        date: f.date || 'Recent',
        type: isDoc ? 'doc' : 'code',
        title: f.message || `Actualizare ${f.file}`,
        path: cleanPath,
        isDoc,
        hash: f.commitHash,
        shortHash: f.commitHash ? f.commitHash.slice(0, 7) : '',
        url: isDoc ? `/docs/${cleanPath}` : undefined,
      });
    });
  }

  return items;
});

const filteredTimeline = computed(() => {
  return timelineItems.value.filter((item) => {
    if (timelineFilter.value === 'docs' && item.type !== 'doc') return false;
    if (timelineFilter.value === 'commits' && item.type !== 'commit') return false;
    if (timelineFilter.value === 'code' && item.type !== 'code') return false;

    if (timelineSearch.value.trim()) {
      const q = timelineSearch.value.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchPath = item.path?.toLowerCase().includes(q);
      const matchHash = item.shortHash?.toLowerCase().includes(q);
      return matchTitle || matchPath || matchHash;
    }
    return true;
  });
});

const filteredBadges = computed(() => {
  if (!achievements.value?.badges) return [];
  return achievements.value.badges.filter((b: any) => {
    if (badgeCategoryFilter.value !== 'all' && b.category !== badgeCategoryFilter.value) return false;
    return true;
  });
});

onMounted(() => {
  fetchProfile();
});

watch(() => props.username, () => {
  fetchProfile();
});
</script>

<template>
  <div v-if="loading" class="profile-loading-wrap">
    <div class="profile-loading-orb" />
    <span>Se încarcă profilul contribuitorului...</span>
  </div>

  <div v-else-if="notFound || !member" class="profile-error-box">
    <Icon icon="lucide:user" width="48" height="48" style="opacity: 0.3; margin-bottom: 12px;" />
    <h2>Contribuitor Neregăsit</h2>
    <p>Utilizatorul <strong>@{{ username }}</strong> nu face parte din echipa WildFire Docs.</p>
    <a href="/docs/team" class="profile-back-action-btn">
      <Icon icon="lucide:arrow-left" width="14" height="14" />
      <span>Înapoi la Echipa Oficială</span>
    </a>
  </div>

  <div v-else class="profile-page-wrapper">
    <!-- ── Top Navigation Bar ── -->
    <div class="profile-top-nav">
      <a href="/docs/team" class="profile-back-link">
        <Icon icon="lucide:arrow-left" width="13" height="13" />
        <span>Echipa Oficială &amp; Contribuitori</span>
      </a>
      <Icon icon="lucide:chevron-right" width="12" height="12" class="text-zinc-600" />
      <span class="profile-current-crumb">@{{ member.username }}</span>
    </div>

    <!-- ── Liquid Glass Hero Showcase ── -->
    <div
      class="profile-hero-card"
      :style="{
        '--role-accent': roleMeta.accentColor,
        '--role-glow': roleMeta.glowColor,
        '--role-tint': roleMeta.bgTint,
      }"
    >
      <div
        class="profile-hero-aurora"
        :style="{
          background: `radial-gradient(ellipse 65% 55% at 15% 45%, ${roleMeta.glowColor}, transparent 70%)`,
        }"
      />

      <div class="profile-hero-inner">
        <!-- Avatar Container -->
        <div class="profile-avatar-frame">
          <div
            class="profile-avatar-border-ring"
            :style="{
              borderColor: roleMeta.accentColor,
              boxShadow: `0 0 0 4px ${roleMeta.glowColor}, 0 8px 32px ${roleMeta.glowColor}`,
            }"
          >
            <img
              :src="avatarSrc"
              :alt="member.displayName"
              class="profile-avatar-img"
              @error="($event.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png'"
            />
          </div>
          <div v-if="member.status === 'active'" class="profile-avatar-beacon" title="Membru Activ în Sistem" />
        </div>

        <!-- User Identity Details -->
        <div class="profile-identity-block">
          <div class="profile-badges-strip">
            <span
              class="profile-role-badge"
              :style="{
                background: roleMeta.bgTint,
                color: roleMeta.accentColor,
                borderColor: `${roleMeta.accentColor}60`,
              }"
            >
              <span class="profile-role-dot" :style="{ background: roleMeta.accentColor }" />
              {{ roleMeta.label }}
            </span>

            <span v-if="member.isRoot" class="profile-root-pill">
              <Icon icon="lucide:shield" width="11" height="11" class="text-amber-400" />
              <span>Root Super Admin</span>
            </span>

            <span class="profile-verified-pill">
              <Icon icon="lucide:shield-check" width="11" height="11" class="text-emerald-400" />
              <span>Verificat Oficial</span>
            </span>

            <a
              v-if="gitStats?.isMatchedWithGithub"
              href="https://github.com/WildFiire/docs/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
              class="profile-verified-pill"
              style="background: hsl(220 14% 18% / 0.7); border-color: hsl(220 14% 35% / 0.6); color: #e2e8f0; text-decoration: none;"
              title="Contribuitor verificat pe GitHub Graphs/Contributors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" class="text-zinc-300" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Graph Contributor</span>
              <Icon icon="lucide:external-link" width="10" height="10" class="opacity-60 ml-0.5" />
            </a>
          </div>

          <div class="profile-name-row">
            <h1 class="profile-display-name">{{ member.displayName }}</h1>
          </div>

          <p v-if="member.customTitle" class="profile-custom-title" :style="{ color: roleMeta.accentColor }">
            {{ member.customTitle }}
          </p>

          <div class="profile-handle-row">
            <button
              type="button"
              class="profile-handle-chip"
              title="Apasă pentru a copia handle-ul"
              @click="copyProfileHandle(member.username)"
            >
              <span class="profile-handle-at" :style="{ color: roleMeta.accentColor }">@</span>
              <span class="profile-handle-text">{{ member.username }}</span>
              <Icon v-if="copiedHandle" icon="lucide:check" width="12" height="12" class="text-emerald-400 ml-1" />
              <Icon v-else icon="lucide:copy" width="11" height="11" class="ml-1 opacity-50" />
            </button>

            <div v-if="achievements && achievements.totalUnlocked > 0" class="profile-honor-badges">
              <span
                class="profile-honor-pill"
                style="background: hsl(280 100% 65% / 0.15); border-color: hsl(280 100% 65% / 0.35); color: hsl(280 100% 75%);"
              >
                <Icon icon="lucide:zap" width="11" height="11" class="text-purple-400" />
                <span>{{ achievements.reputationPoints }} PTS</span>
              </span>
              <span
                class="profile-honor-pill"
                style="background: hsl(43 96% 52% / 0.15); border-color: hsl(43 96% 52% / 0.35); color: hsl(43 96% 65%);"
              >
                <Icon icon="lucide:award" width="11" height="11" class="text-amber-400" />
                <span>{{ achievements.totalUnlocked }} Realizări</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Stats Metric Grid in Hero -->
        <div class="profile-hero-metrics-grid">
          <div class="profile-hero-metric-tile">
            <div class="profile-hero-metric-icon profile-hero-metric-icon--orange">
              <Icon icon="lucide:book-open" width="16" height="16" />
            </div>
            <div class="profile-hero-metric-data">
              <span class="profile-hero-metric-num" :style="{ color: roleMeta.accentColor }">
                {{ gitStats?.docsCommits ?? 0 }}
              </span>
              <span class="profile-hero-metric-lbl">Ghiduri</span>
            </div>
          </div>

          <div class="profile-hero-metric-tile">
            <div class="profile-hero-metric-icon profile-hero-metric-icon--cyan">
              <Icon icon="lucide:git-commit" width="16" height="16" />
            </div>
            <div class="profile-hero-metric-data">
              <span class="profile-hero-metric-num text-cyan-400">
                {{ gitStats?.totalCommits || 0 }}
              </span>
              <span class="profile-hero-metric-lbl">Commit-uri Repo</span>
            </div>
          </div>

          <div class="profile-hero-metric-tile">
            <div class="profile-hero-metric-icon profile-hero-metric-icon--emerald">
              <Icon icon="lucide:shield-check" width="16" height="16" />
            </div>
            <div class="profile-hero-metric-data">
              <span class="profile-hero-metric-num text-emerald-400">
                {{ activePermsCount }}
              </span>
              <span class="profile-hero-metric-lbl">Permisiuni</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Sub-Navigation Liquid Glass Tabs ── -->
    <div class="profile-tabs-bar">
      <button
        type="button"
        :class="['profile-tab-action', { 'profile-tab-action--active': profileTab === 'overview' }]"
        @click="profileTab = 'overview'"
      >
        <Icon icon="lucide:user" width="14" height="14" />
        <span>Prezentare Generală</span>
      </button>

      <button
        type="button"
        :class="['profile-tab-action', { 'profile-tab-action--active': profileTab === 'timeline' }]"
        @click="profileTab = 'timeline'"
      >
        <Icon icon="lucide:history" width="14" height="14" />
        <span>Timeline Activitate</span>
        <span class="profile-tab-badge-count">{{ timelineItems.length }}</span>
      </button>

      <button
        type="button"
        :class="['profile-tab-action', { 'profile-tab-action--active': profileTab === 'achievements' }]"
        @click="profileTab = 'achievements'"
      >
        <Icon icon="lucide:award" width="14" height="14" />
        <span>Insigne &amp; Realizări</span>
        <span v-if="achievements" class="profile-tab-badge-count">
          {{ achievements.totalUnlocked }}/{{ achievements.totalAvailable }}
        </span>
      </button>
    </div>

    <!-- ── TAB 1: OVERVIEW DASHBOARD ── -->
    <div v-if="profileTab === 'overview'" class="profile-dashboard-layout">
      <!-- LEFT / MAIN CONTENT AREA (68%) -->
      <div class="profile-main-col">
        <!-- Card 1: Despre & Rol Tehnic -->
        <div class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <Icon icon="lucide:user" width="15" height="15" class="text-amber-400" />
            </div>
            <div>
              <h3 class="profile-panel-title">Despre &amp; Rol Tehnic</h3>
              <span class="profile-panel-subtitle">Prezentarea contribuitorului și responsabilitățile de bază</span>
            </div>
          </div>

          <div class="profile-bio-box">
            <p class="profile-bio-text">
              {{ member.bio || 'Membru activ în echipa de redactare, structurare și mentenanță a documentației oficiale WildFire.' }}
            </p>
          </div>

          <div v-if="member.responsibilities && member.responsibilities.length > 0" class="profile-resp-container">
            <span class="profile-subheading-tag">
              <Icon icon="lucide:layers" width="11" height="11" class="text-cyan-400" />
              Arii de Responsabilitate &amp; Expertiză
            </span>
            <div class="profile-resp-tags-grid">
              <div v-for="(resp, idx) in member.responsibilities" :key="idx" class="profile-resp-chip">
                <Icon icon="lucide:chevron-right" width="11" height="11" :style="{ color: roleMeta.accentColor }" />
                <span>{{ resp }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Activitate & Contribuții Reale în Repository -->
        <div class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <Icon icon="lucide:activity" width="15" height="15" class="text-orange-400" />
            </div>
            <div>
              <h3 class="profile-panel-title">Activitate &amp; Contribuții Reale în Repository</h3>
              <span class="profile-panel-subtitle">Evoluția reală a commit-urilor în repository pe ultimele 6 luni</span>
            </div>
          </div>

          <div v-if="gitStats?.monthlyActivity && gitStats.monthlyActivity.length > 0" class="profile-chart-container">
            <div class="profile-chart-header-row">
              <div class="profile-chart-legend">
                <span class="profile-chart-legend-dot" :style="{ background: roleMeta.accentColor }" />
                <span>Frecvență Commit-uri / Lună</span>
              </div>
              <span class="profile-chart-total-tag">
                <Icon icon="lucide:git-commit" width="11" height="11" />
                {{ activityTotalActions }} acțiuni înregistrate
              </span>
            </div>

            <div class="profile-chart-bars-wrap">
              <div v-for="d in gitStats.monthlyActivity" :key="d.month" class="profile-chart-col">
                <div class="profile-chart-bar-slot">
                  <div
                    :class="['profile-chart-bar-fill', { 'profile-chart-bar-fill--active': d.count > 0 }]"
                    :style="{
                      height: `${Math.max(8, Math.round((d.count / activityMaxCount) * 100))}%`,
                      background: d.count > 0
                        ? `linear-gradient(180deg, ${roleMeta.accentColor} 0%, ${roleMeta.accentColor}40 100%)`
                        : 'hsl(0 0% 100% / 0.04)',
                      borderColor: d.count > 0 ? `${roleMeta.accentColor}80` : 'hsl(0 0% 100% / 0.08)',
                    }"
                  >
                    <span v-if="d.count > 0" class="profile-chart-tooltip" :style="{ color: roleMeta.accentColor }">
                      {{ d.count }}
                    </span>
                  </div>
                </div>
                <span class="profile-chart-month-label">{{ getShortMonth(d.month) }}</span>
              </div>
            </div>
          </div>

          <div v-else class="profile-empty-state">
            <Icon icon="lucide:clock" width="20" height="20" class="text-zinc-600 mb-2" />
            <p>Nicio activitate de commit înregistrată în intervalul recent.</p>
          </div>
        </div>

        <!-- Card 3: Jurnal Commit-uri Recente în Repository -->
        <div v-if="gitStats?.recentCommits && gitStats.recentCommits.length > 0" class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <Icon icon="lucide:git-commit" width="15" height="15" class="text-cyan-400" />
            </div>
            <div>
              <h3 class="profile-panel-title">Jurnal Commit-uri Recente în Repository</h3>
              <span class="profile-panel-subtitle">Ultimele acțiuni și modificări comise în ramura principală</span>
            </div>
          </div>

          <div class="profile-commits-list">
            <a
              v-for="(c, i) in gitStats.recentCommits"
              :key="i"
              :href="c.url || `https://github.com/WildFiire/docs/commit/${c.hash}`"
              target="_blank"
              rel="noopener noreferrer"
              class="profile-commit-row"
              :title="`Vezi commit pe GitHub: ${c.hash}`"
            >
              <span class="profile-commit-hash-badge">
                #{{ c.shortHash }}
              </span>
              <span class="profile-commit-msg-text">
                {{ c.message }}
              </span>
              <div class="profile-doc-right">
                <span class="profile-doc-date">{{ c.date }}</span>
                <Icon icon="lucide:external-link" width="12" height="12" class="profile-doc-arrow opacity-60" />
              </div>
            </a>
          </div>
        </div>

        <!-- Card 4: Documente & Fișiere Modificate -->
        <div class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <Icon icon="lucide:file-text" width="15" height="15" class="text-emerald-400" />
            </div>
            <div>
              <h3 class="profile-panel-title">Documente &amp; Fișiere Modificate</h3>
              <span class="profile-panel-subtitle">Fișierele actualizate în repository de către acest autor</span>
            </div>
          </div>

          <div v-if="gitStats?.recentFiles && gitStats.recentFiles.length > 0" class="profile-recent-docs-list">
            <template v-for="(fileItem, i) in gitStats.recentFiles" :key="i">
              <a
                v-if="fileItem.file.startsWith('content/docs/') || fileItem.file.startsWith('docs/')"
                :href="`/docs/${fileItem.file.replace(/^(content\/docs\/|docs\/)/, '').replace(/\.md$/, '')}`"
                class="profile-doc-row"
              >
                <div class="profile-doc-icon-badge">
                  <Icon icon="lucide:file-text" width="13" height="13" class="text-amber-400" />
                </div>
                <div class="profile-doc-meta">
                  <div class="profile-doc-title-row">
                    <span class="profile-doc-category-pill">
                      {{ fileItem.file.replace(/^(content\/docs\/|docs\/)/, '').split('/')[0] || 'general' }}
                    </span>
                    <span class="profile-doc-path">
                      {{ fileItem.file.replace(/^(content\/docs\/|docs\/)/, '').replace(/\.md$/, '') }}
                    </span>
                  </div>
                  <p class="profile-doc-commit-msg">{{ fileItem.message }}</p>
                </div>
                <div class="profile-doc-right">
                  <span class="profile-doc-date">{{ fileItem.date }}</span>
                  <Icon icon="lucide:chevron-right" width="13" height="13" class="profile-doc-arrow" />
                </div>
              </a>

              <div v-else class="profile-doc-row">
                <div class="profile-doc-icon-badge" style="background: hsl(215 90% 60% / 0.12); border-color: hsl(215 90% 60% / 0.25);">
                  <Icon icon="lucide:file-text" width="13" height="13" class="text-blue-400" />
                </div>
                <div class="profile-doc-meta">
                  <div class="profile-doc-title-row">
                    <span class="profile-doc-category-pill" style="background: hsl(215 90% 60% / 0.14); border-color: hsl(215 90% 60% / 0.3); color: hsl(215 90% 70%);">
                      repo/code
                    </span>
                    <span class="profile-doc-path">{{ fileItem.file }}</span>
                  </div>
                  <p class="profile-doc-commit-msg">{{ fileItem.message }}</p>
                </div>
                <div class="profile-doc-right">
                  <span class="profile-doc-date">{{ fileItem.date }}</span>
                </div>
              </div>
            </template>
          </div>

          <div v-else class="profile-empty-state">
            <Icon icon="lucide:file-text" width="20" height="20" class="text-zinc-600 mb-2" />
            <p>Nu există fișiere modificate recent de acest autor în repository.</p>
          </div>
        </div>

        <!-- Card 5: GitHub Live Feed -->
        <div v-if="githubData" class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="text-zinc-300" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <h3 class="profile-panel-title">Activitate GitHub Live</h3>
              <span class="profile-panel-subtitle">Sincronizare în timp real cu profilul @{{ member.githubUsername }}</span>
            </div>
          </div>

          <p v-if="githubData.bio" class="profile-bio-text mb-3" style="font-style: italic;">
            &ldquo;{{ githubData.bio }}&rdquo;
          </p>

          <div class="profile-github-metrics-row">
            <div class="profile-gh-metric-chip">
              <Icon icon="lucide:star" width="12" height="12" class="text-amber-400" />
              <span><strong>{{ githubData.public_repos }}</strong> Repository-uri Publice</span>
            </div>
            <div class="profile-gh-metric-chip">
              <Icon icon="lucide:user" width="12" height="12" class="text-blue-400" />
              <span><strong>{{ githubData.followers }}</strong> Urmăritori</span>
            </div>
            <div
              v-if="gitStats?.githubGraph"
              class="profile-gh-metric-chip"
              style="background: hsl(142 71% 45% / 0.12); border-color: hsl(142 71% 45% / 0.3); color: hsl(142 71% 70%);"
            >
              <Icon icon="lucide:sparkles" width="12" height="12" class="text-emerald-400" />
              <span><strong>+{{ gitStats.githubGraph.totalAdditions.toLocaleString() }}</strong> / <strong>-{{ gitStats.githubGraph.totalDeletions.toLocaleString() }}</strong> linii modificate</span>
            </div>
            <div v-if="githubData.location" class="profile-gh-metric-chip">
              <Icon icon="lucide:message-square" width="12" height="12" class="text-cyan-400" />
              <span>{{ githubData.location }}</span>
            </div>
          </div>

          <div v-if="githubData.recentEvents && githubData.recentEvents.length > 0" class="profile-gh-events-list">
            <span class="profile-subheading-tag">
              <Icon icon="lucide:sparkles" width="11" height="11" class="text-purple-400" />
              Evenimente &amp; Push-uri Recente pe GitHub
            </span>
            <div v-for="(evt, idx) in githubData.recentEvents.slice(0, 4)" :key="idx" class="profile-gh-event-item">
              <Icon icon="lucide:git-commit" width="12" height="12" class="text-purple-400 flex-shrink-0" />
              <div class="profile-gh-event-body">
                <span class="profile-gh-event-repo">{{ evt.repo?.name }}</span>
                <span class="profile-gh-event-type">
                  {{ evt.type === 'PushEvent' ? 'Commit Push' : evt.type }}
                </span>
              </div>
              <span class="profile-gh-event-time">
                {{ new Date(evt.created_at).toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' }) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT / SIDEBAR AREA (32%) -->
      <div class="profile-sidebar-col">
        <!-- Section 1: Conturi & Identități Conectate -->
        <div class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <Icon icon="lucide:sparkles" width="15" height="15" class="text-cyan-400" />
            </div>
            <div>
              <h3 class="profile-panel-title">Identități Conectate</h3>
              <span class="profile-panel-subtitle">Hub integrat Discord, Steam &amp; GitHub</span>
            </div>
          </div>

          <div class="profile-social-stack">
            <!-- GitHub Card -->
            <div
              v-if="member.githubUsername"
              class="profile-social-tile"
              style="background: hsl(220 14% 12% / 0.7); border-color: hsl(220 14% 30% / 0.8); box-shadow: 0 4px 20px hsl(220 14% 20% / 0.4);"
            >
              <div class="profile-social-avatar-box">
                <img
                  v-if="githubData?.avatar_url"
                  :src="githubData.avatar_url"
                  :alt="member.githubUsername"
                  class="profile-social-avatar-img"
                  @error="($event.target as HTMLElement).style.display = 'none'"
                />
                <div v-else class="profile-social-avatar-fallback">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#e2e8f0" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div class="profile-social-brand-badge" style="border-color: hsl(220 14% 30% / 0.8);">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#e2e8f0" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
              </div>

              <div class="profile-social-content">
                <div class="profile-social-top-row">
                  <span class="profile-social-brand-name" style="color: #e2e8f0;">GitHub</span>
                  <span class="profile-social-chip">GitHub</span>
                </div>
                <h4 class="profile-social-user-title">{{ githubData?.name || member.githubUsername }}</h4>
                <p class="profile-social-sub">
                  {{ githubData ? `${githubData.followers} followers · ${githubData.public_repos} repos` : `@${member.githubUsername}` }}
                </p>
              </div>

              <div class="profile-social-actions">
                <button
                  type="button"
                  class="profile-social-btn"
                  :title="copiedSocial['github'] ? 'Copiat!' : 'Copiază handle'"
                  @click="copySocialText('github', member.githubUsername)"
                >
                  <Icon v-if="copiedSocial['github']" icon="lucide:check" width="12" height="12" class="text-emerald-400" />
                  <Icon v-else icon="lucide:copy" width="12" height="12" />
                </button>
                <a
                  v-if="githubUrl"
                  :href="githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-social-btn"
                  title="Deschide GitHub"
                >
                  <Icon icon="lucide:external-link" width="12" height="12" />
                </a>
              </div>
            </div>

            <!-- Discord Card -->
            <div
              v-if="member.discord"
              class="profile-social-tile"
              style="background: hsl(235 50% 14% / 0.7); border-color: hsl(235 85% 65% / 0.6); box-shadow: 0 4px 20px hsl(235 85% 65% / 0.3);"
            >
              <div class="profile-social-avatar-box">
                <img
                  v-if="discordData?.avatarUrl"
                  :src="discordData.avatarUrl"
                  :alt="member.discord"
                  class="profile-social-avatar-img"
                  @error="($event.target as HTMLElement).style.display = 'none'"
                />
                <div v-else class="profile-social-avatar-fallback">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#818cf8" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div class="profile-social-brand-badge" style="border-color: hsl(235 85% 65% / 0.6);">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#818cf8" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
              </div>

              <div class="profile-social-content">
                <div class="profile-social-top-row">
                  <span class="profile-social-brand-name" style="color: #818cf8;">Discord</span>
                  <span class="profile-social-chip">Discord</span>
                </div>
                <h4 class="profile-social-user-title">{{ discordData?.globalName || discordData?.username || 'Discord User' }}</h4>
                <p class="profile-social-sub">
                  {{ discordData?.username ? `@${discordData.username}` : `ID: ${member.discord}` }}
                </p>
              </div>

              <div class="profile-social-actions">
                <button
                  type="button"
                  class="profile-social-btn"
                  :title="copiedSocial['discord'] ? 'Copiat!' : 'Copiază ID'"
                  @click="copySocialText('discord', member.discord)"
                >
                  <Icon v-if="copiedSocial['discord']" icon="lucide:check" width="12" height="12" class="text-emerald-400" />
                  <Icon v-else icon="lucide:copy" width="12" height="12" />
                </button>
                <a
                  v-if="discordUrl"
                  :href="discordUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-social-btn"
                  title="Deschide Discord"
                >
                  <Icon icon="lucide:external-link" width="12" height="12" />
                </a>
              </div>
            </div>

            <!-- Steam Card -->
            <div
              v-if="member.steamId"
              class="profile-social-tile"
              style="background: hsl(215 45% 12% / 0.7); border-color: hsl(215 85% 55% / 0.6); box-shadow: 0 4px 20px hsl(215 85% 55% / 0.3);"
            >
              <div class="profile-social-avatar-box">
                <img
                  v-if="steamData?.avatarUrl"
                  :src="steamData.avatarUrl"
                  :alt="member.displayName"
                  class="profile-social-avatar-img"
                  @error="($event.target as HTMLElement).style.display = 'none'"
                />
                <div v-else class="profile-social-avatar-fallback">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#60a5fa" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-10 9.87l5.65 2.33a3.54 3.54 0 0 1 1.95-.58l2.9-4.2a3.7 3.7 0 0 1 7.23-1.22 3.7 3.7 0 0 1-5.18 5.18l-4.2 2.9a3.54 3.54 0 0 1-.58 1.95L4.44 20.9A10 10 0 1 0 12 2zm3.73 6.27a2.22 2.22 0 1 0 2.22 2.22 2.22 2.22 0 0 0-2.22-2.22zm-7.6 9.47a2.08 2.08 0 1 0 2.08 2.08 2.08 2.08 0 0 0-2.08-2.08z" />
                  </svg>
                </div>
                <div class="profile-social-brand-badge" style="border-color: hsl(215 85% 55% / 0.6);">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#60a5fa" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-10 9.87l5.65 2.33a3.54 3.54 0 0 1 1.95-.58l2.9-4.2a3.7 3.7 0 0 1 7.23-1.22 3.7 3.7 0 0 1-5.18 5.18l-4.2 2.9a3.54 3.54 0 0 1-.58 1.95L4.44 20.9A10 10 0 1 0 12 2zm3.73 6.27a2.22 2.22 0 1 0 2.22 2.22 2.22 2.22 0 0 0-2.22-2.22zm-7.6 9.47a2.08 2.08 0 1 0 2.08 2.08 2.08 2.08 0 0 0-2.08-2.08z" />
                  </svg>
                </div>
              </div>

              <div class="profile-social-content">
                <div class="profile-social-top-row">
                  <span class="profile-social-brand-name" style="color: #60a5fa;">Steam</span>
                  <span class="profile-social-chip">Steam</span>
                </div>
                <h4 class="profile-social-user-title">{{ member.displayName || member.username }}</h4>
                <p class="profile-social-sub">Comunitatea Steam WildFire</p>
              </div>

              <div class="profile-social-actions">
                <button
                  type="button"
                  class="profile-social-btn"
                  :title="copiedSocial['steam'] ? 'Copiat!' : 'Copiază Steam ID'"
                  @click="copySocialText('steam', member.steamId)"
                >
                  <Icon v-if="copiedSocial['steam']" icon="lucide:check" width="12" height="12" class="text-emerald-400" />
                  <Icon v-else icon="lucide:copy" width="12" height="12" />
                </button>
                <a
                  v-if="steamUrl"
                  :href="steamUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-social-btn"
                  title="Deschide Steam"
                >
                  <Icon icon="lucide:external-link" width="12" height="12" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Matrice Permisiuni RBAC -->
        <div class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <Icon icon="lucide:shield" width="15" height="15" class="text-purple-400" />
            </div>
            <div>
              <h3 class="profile-panel-title">Matrice Permisiuni RBAC</h3>
              <span class="profile-panel-subtitle">Nivelurile de acces autorizate în sistem</span>
            </div>
          </div>

          <div class="profile-rbac-grid">
            <div
              v-for="pm in PERM_METAS"
              :key="pm.key"
              :class="['profile-rbac-item', member.permissions?.[pm.key] ? 'profile-rbac-item--granted' : 'profile-rbac-item--denied']"
              :style="member.permissions?.[pm.key] ? { '--perm-color': pm.color } : undefined"
            >
              <div class="profile-rbac-icon-box">
                <Icon :icon="pm.icon" width="12" height="12" />
              </div>
              <span class="profile-rbac-label">{{ pm.label }}</span>
              <span class="profile-rbac-status-dot" />
            </div>
          </div>
        </div>

        <!-- Section 3: Metadate & Securitate Cont -->
        <div class="profile-glass-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-icon-wrap">
              <Icon icon="lucide:clock" width="15" height="15" class="text-blue-400" />
            </div>
            <div>
              <h3 class="profile-panel-title">Informații &amp; Audit Cont</h3>
              <span class="profile-panel-subtitle">Istoric conexiuni și stare securitate</span>
            </div>
          </div>

          <div class="profile-meta-list">
            <div class="profile-meta-row">
              <div class="profile-meta-left">
                <Icon icon="lucide:calendar" width="13" height="13" class="text-amber-400" />
                <span>Data Înregistrării</span>
              </div>
              <span class="profile-meta-val">{{ joinedDate }}</span>
            </div>

            <div class="profile-meta-row">
              <div class="profile-meta-left">
                <Icon icon="lucide:clock" width="13" height="13" class="text-emerald-400" />
                <span>Ultima Sesiune</span>
              </div>
              <span class="profile-meta-val">{{ lastLogin }}</span>
            </div>

            <div class="profile-meta-row">
              <div class="profile-meta-left">
                <Icon icon="lucide:shield-check" width="13" height="13" class="text-cyan-400" />
                <span>Statut Securitate</span>
              </div>
              <span class="profile-meta-val profile-meta-val--active">
                {{ member.isRoot ? 'Root Immune' : 'Activ & Protejat' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 2: INTERACTIVE TIMELINE FEED ── -->
    <div v-else-if="profileTab === 'timeline'" class="profile-timeline-container">
      <div class="profile-glass-panel">
        <div class="profile-panel-header">
          <div class="profile-panel-icon-wrap">
            <Icon icon="lucide:history" width="15" height="15" class="text-cyan-400" />
          </div>
          <div>
            <h3 class="profile-panel-title">Jurnal Cronologic &amp; Istoric Contribuții</h3>
            <span class="profile-panel-subtitle">Feed interactiv cu toate commit-urile și documentele atinse</span>
          </div>
        </div>

        <!-- Timeline Toolbar & Search -->
        <div class="profile-timeline-toolbar">
          <div class="profile-timeline-filters">
            <button
              type="button"
              :class="['profile-timeline-pill', { 'profile-timeline-pill--active': timelineFilter === 'all' }]"
              @click="timelineFilter = 'all'"
            >
              Toate ({{ timelineItems.length }})
            </button>
            <button
              type="button"
              :class="['profile-timeline-pill', { 'profile-timeline-pill--active': timelineFilter === 'docs' }]"
              @click="timelineFilter = 'docs'"
            >
              Ghiduri Docs
            </button>
            <button
              type="button"
              :class="['profile-timeline-pill', { 'profile-timeline-pill--active': timelineFilter === 'commits' }]"
              @click="timelineFilter = 'commits'"
            >
              Commit-uri Git
            </button>
            <button
              type="button"
              :class="['profile-timeline-pill', { 'profile-timeline-pill--active': timelineFilter === 'code' }]"
              @click="timelineFilter = 'code'"
            >
              Fișiere Sursă
            </button>
          </div>

          <div class="profile-timeline-search">
            <Icon icon="lucide:search" width="13" height="13" class="text-zinc-500" />
            <input
              v-model="timelineSearch"
              type="text"
              placeholder="Filtrează în istoric..."
              class="profile-timeline-search-input"
            />
          </div>
        </div>

        <!-- Timeline Tree Feed -->
        <div v-if="filteredTimeline.length === 0" class="profile-empty-state">
          <Icon icon="lucide:history" width="24" height="24" class="text-zinc-600 mb-2" />
          <p>Nicio activitate găsită pentru filtrele curente.</p>
        </div>

        <div v-else class="profile-timeline-tree">
          <div v-for="(item, idx) in filteredTimeline" :key="item.id || idx" class="profile-timeline-node">
            <div class="profile-timeline-rail">
              <div
                class="profile-timeline-dot"
                :style="{
                  borderColor:
                    item.type === 'doc'
                      ? '#10b981'
                      : item.type === 'commit'
                      ? '#06b6d4'
                      : '#a855f7',
                }"
              />
              <div v-if="idx < filteredTimeline.length - 1" class="profile-timeline-line" />
            </div>

            <div class="profile-timeline-card">
              <div class="profile-timeline-card-header">
                <div class="profile-timeline-type-row">
                  <span :class="['profile-timeline-type-pill', `profile-timeline-type-pill--${item.type}`]">
                    <Icon v-if="item.type === 'doc'" icon="lucide:file-text" width="10" height="10" />
                    <Icon v-else-if="item.type === 'commit'" icon="lucide:git-commit" width="10" height="10" />
                    <Icon v-else icon="lucide:terminal" width="10" height="10" />
                    {{ item.type === 'doc' ? 'GHID DOCS' : item.type === 'commit' ? 'GIT COMMIT' : 'FIȘIER COD' }}
                  </span>

                  <a
                    v-if="item.shortHash"
                    :href="item.url || `https://github.com/WildFiire/docs/commit/${item.hash}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="profile-timeline-hash-chip"
                    title="Vezi pe GitHub"
                  >
                    #{{ item.shortHash }}
                    <Icon icon="lucide:external-link" width="9" height="9" class="opacity-60 ml-0.5" />
                  </a>
                </div>

                <span class="profile-timeline-date">{{ item.date }}</span>
              </div>

              <h4 class="profile-timeline-msg">{{ item.title }}</h4>

              <div v-if="item.path" class="profile-timeline-target">
                <a v-if="item.isDoc" :href="`/docs/${item.path}`" class="profile-timeline-doc-link">
                  <Icon icon="lucide:book-open" width="11" height="11" class="text-emerald-400" />
                  <span>/docs/{{ item.path }}</span>
                  <Icon icon="lucide:chevron-right" width="11" height="11" class="opacity-60 ml-0.5" />
                </a>
                <span v-else class="profile-timeline-code-path">
                  <Icon icon="lucide:terminal" width="11" height="11" class="text-purple-400" />
                  {{ item.path }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB 3: ACHIEVEMENTS & BADGES VAULT ── -->
    <div v-else-if="profileTab === 'achievements' && achievements" class="profile-achievements-container">
      <!-- Achievements Summary Banner -->
      <div class="profile-achievements-kpi-grid">
        <div class="profile-achieve-kpi-card">
          <div class="profile-achieve-kpi-icon-wrap profile-achieve-kpi-icon-wrap--purple">
            <Icon icon="lucide:zap" width="18" height="18" />
          </div>
          <div class="profile-achieve-kpi-data">
            <span class="profile-achieve-kpi-num text-purple-400">
              {{ achievements.reputationPoints }} PTS
            </span>
            <span class="profile-achieve-kpi-label">Scor Reputație</span>
          </div>
        </div>

        <div class="profile-achieve-kpi-card">
          <div class="profile-achieve-kpi-icon-wrap profile-achieve-kpi-icon-wrap--gold">
            <Icon icon="lucide:award" width="18" height="18" />
          </div>
          <div class="profile-achieve-kpi-data">
            <span class="profile-achieve-kpi-num text-amber-400">
              {{ achievements.totalUnlocked }} / {{ achievements.totalAvailable }}
            </span>
            <span class="profile-achieve-kpi-label">Insigne Deblocate ({{ achievements.completionPercentage }}%)</span>
          </div>
        </div>

        <div class="profile-achieve-kpi-card">
          <div class="profile-achieve-kpi-data" style="width: 100%;">
            <span class="profile-achieve-kpi-label mb-2">Repartizare pe Ranguri:</span>
            <div class="profile-achieve-tiers-row">
              <span
                class="profile-achieve-tier-tag"
                :style="{ color: TIER_LABELS.mythic.color, borderColor: TIER_LABELS.mythic.border }"
              >
                Mythic: {{ achievements.tierCounts.mythic }}
              </span>
              <span
                class="profile-achieve-tier-tag"
                :style="{ color: TIER_LABELS.platinum.color, borderColor: TIER_LABELS.platinum.border }"
              >
                Platinum: {{ achievements.tierCounts.platinum }}
              </span>
              <span
                class="profile-achieve-tier-tag"
                :style="{ color: TIER_LABELS.gold.color, borderColor: TIER_LABELS.gold.border }"
              >
                Gold: {{ achievements.tierCounts.gold }}
              </span>
              <span
                class="profile-achieve-tier-tag"
                :style="{ color: TIER_LABELS.silver.color, borderColor: TIER_LABELS.silver.border }"
              >
                Silver: {{ achievements.tierCounts.silver }}
              </span>
              <span
                class="profile-achieve-tier-tag"
                :style="{ color: TIER_LABELS.bronze.color, borderColor: TIER_LABELS.bronze.border }"
              >
                Bronze: {{ achievements.tierCounts.bronze }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="profile-achieve-category-bar">
        <button
          type="button"
          :class="['profile-timeline-pill', { 'profile-timeline-pill--active': badgeCategoryFilter === 'all' }]"
          @click="badgeCategoryFilter = 'all'"
        >
          Toate ({{ achievements.badges.length }})
        </button>
        <button
          type="button"
          :class="['profile-timeline-pill', { 'profile-timeline-pill--active': badgeCategoryFilter === 'git' }]"
          @click="badgeCategoryFilter = 'git'"
        >
          Git &amp; Repository
        </button>
        <button
          type="button"
          :class="['profile-timeline-pill', { 'profile-timeline-pill--active': badgeCategoryFilter === 'docs' }]"
          @click="badgeCategoryFilter = 'docs'"
        >
          Documentație
        </button>
        <button
          type="button"
          :class="['profile-timeline-pill', { 'profile-timeline-pill--active': badgeCategoryFilter === 'security' }]"
          @click="badgeCategoryFilter = 'security'"
        >
          Securitate &amp; Sistem
        </button>
        <button
          type="button"
          :class="['profile-timeline-pill', { 'profile-timeline-pill--active': badgeCategoryFilter === 'community' }]"
          @click="badgeCategoryFilter = 'community'"
        >
          Comunitate
        </button>
      </div>

      <!-- Badges Grid -->
      <div class="profile-badges-grid">
        <div
          v-for="badge in filteredBadges"
          :key="badge.id"
          :class="['profile-badge-card', badge.unlocked ? 'profile-badge-card--unlocked' : 'profile-badge-card--locked']"
          :style="badge.unlocked ? {
            '--badge-color': TIER_LABELS[badge.tier]?.color || '#ff8c00',
            '--badge-border': TIER_LABELS[badge.tier]?.border || 'rgba(255,140,0,0.4)',
          } : undefined"
        >
          <div class="profile-badge-top-row">
            <div
              class="profile-badge-icon-box"
              :style="badge.unlocked ? {
                color: TIER_LABELS[badge.tier]?.color,
                background: TIER_LABELS[badge.tier]?.bg,
                borderColor: TIER_LABELS[badge.tier]?.border,
              } : {
                color: '#64748b',
                background: 'hsl(0 0% 100% / 0.03)',
                borderColor: 'hsl(0 0% 100% / 0.08)',
              }"
            >
              <Icon :icon="BADGE_ICONS[badge.iconName] || 'lucide:award'" width="18" height="18" />
            </div>

            <div class="profile-badge-status-wrap">
              <span
                class="profile-badge-tier-pill"
                :style="{
                  color: TIER_LABELS[badge.tier]?.color,
                  borderColor: TIER_LABELS[badge.tier]?.border,
                  background: TIER_LABELS[badge.tier]?.bg,
                }"
              >
                {{ TIER_LABELS[badge.tier]?.name || badge.tier }}
              </span>
              <span v-if="badge.unlocked" class="profile-badge-unlocked-tag">
                <Icon icon="lucide:check" width="10" height="10" class="text-emerald-400" />
                Deblocat
              </span>
              <span v-else class="profile-badge-locked-tag">
                <Icon icon="lucide:lock" width="10" height="10" />
                În Progres
              </span>
            </div>
          </div>

          <h4 class="profile-badge-title">{{ badge.title }}</h4>
          <p class="profile-badge-desc">{{ badge.description }}</p>

          <!-- Progress Meter -->
          <div class="profile-badge-progress-box">
            <div class="profile-badge-progress-header">
              <span class="profile-badge-progress-label">{{ badge.progress.label }}</span>
              <span class="profile-badge-progress-pct">{{ badge.progress.percentage }}%</span>
            </div>
            <div class="profile-badge-progress-track">
              <div
                class="profile-badge-progress-fill"
                :style="{
                  width: `${badge.progress.percentage}%`,
                  background: badge.unlocked
                    ? `linear-gradient(90deg, ${TIER_LABELS[badge.tier]?.color}80, ${TIER_LABELS[badge.tier]?.color})`
                    : 'hsl(215 90% 50% / 0.6)',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
