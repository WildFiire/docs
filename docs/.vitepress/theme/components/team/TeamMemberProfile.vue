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
const loading = ref(true);
const notFound = ref(false);

const profileTab = ref<'overview' | 'timeline' | 'achievements'>('overview');
const timelineSearch = ref<string>('');
const timelineFilter = ref<'all' | 'docs' | 'commits' | 'code'>('all');
const badgeCategoryFilter = ref<'all' | 'git' | 'docs' | 'security' | 'community'>('all');

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

async function fetchProfile() {
  if (!props.username) return;
  loading.value = true;
  notFound.value = false;
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
    if (data.member?.githubUsername) {
      fetch(`/api/team/github?username=${encodeURIComponent(data.member.githubUsername)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((gh) => { if (gh && !gh.error) githubData.value = gh; })
        .catch(() => {});
    }
    if (data.member?.discord && /^\d{17,20}$/.test(data.member.discord.trim())) {
      fetch(`/api/discord/avatar?id=${encodeURIComponent(data.member.discord.trim())}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d) discordData.value = d; })
        .catch(() => {});
    }
    if (data.member?.steamId) {
      fetch(`/api/steam/avatar?id=${encodeURIComponent(data.member.steamId.trim())}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => { if (s && !s.error) steamData.value = s; })
        .catch(() => {});
    }
  } catch {
    notFound.value = true;
    loading.value = false;
  }
}

function copyHandle(handle: string) {
  navigator.clipboard.writeText(`@${handle}`).then(() => {
    copiedHandle.value = true;
    setTimeout(() => { copiedHandle.value = false; }, 2000);
  });
}

const roleMeta = computed(() => {
  if (!member.value) return ROLE_META.content_editor;
  return ROLE_META[member.value.role] || ROLE_META.content_editor;
});

const avatarSrc = computed(() => {
  if (!member.value) return 'https://cdn.discordapp.com/embed/avatars/0.png';
  return (
    member.value.avatarUrl ||
    (member.value.githubUsername ? `https://github.com/${member.value.githubUsername}.png` : null) ||
    'https://cdn.discordapp.com/embed/avatars/0.png'
  );
});

const timelineItems = computed(() => {
  if (!gitStats.value) return [];
  const items: any[] = [];
  if (gitStats.value.recentCommits) {
    gitStats.value.recentCommits.forEach((c: any, i: number) => {
      items.push({
        id: `commit_${c.hash || i}`,
        date: c.date || 'Recent',
        type: 'commit',
        title: c.message || 'Commit update',
        hash: c.hash,
        shortHash: c.shortHash || (c.hash ? c.hash.slice(0, 7) : ''),
        url: c.url || `https://github.com/iannC69/wf-docscore/commit/${c.hash}`,
      });
    });
  }
  if (gitStats.value.recentFiles) {
    gitStats.value.recentFiles.forEach((f: any, i: number) => {
      const isDoc = f.file?.startsWith('content/docs/');
      const cleanPath = isDoc ? f.file.replace(/^content\/docs\//, '').replace(/\.md$/, '') : f.file;
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
      const matchTitle = item.title?.toLowerCase().includes(q);
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
    <Icon icon="lucide:user" width="48" style="opacity: 0.3; margin-bottom: 12px;" />
    <h2>Contribuitor Neregăsit</h2>
    <p>Utilizatorul <strong>@{{ username }}</strong> nu face parte din echipa WildFire Docs.</p>
    <a href="/docs/team" class="profile-back-action-btn">
      <Icon icon="lucide:arrow-left" width="14" />
      <span>Înapoi la Echipa Oficială</span>
    </a>
  </div>

  <div v-else class="profile-page-wrapper">
    <!-- Top Navigation Bar -->
    <div class="profile-top-nav">
      <a href="/docs/team" class="profile-back-link">
        <Icon icon="lucide:arrow-left" width="13" />
        <span>Echipa Oficială &amp; Contribuitori</span>
      </a>
      <Icon icon="lucide:chevron-right" width="12" class="text-zinc-600" />
      <span class="profile-current-crumb">@{{ member.username }}</span>
    </div>

    <!-- Liquid Glass Hero Showcase -->
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
              onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'"
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
              <Icon icon="lucide:shield" width="11" class="text-amber-400" />
              <span>Root Super Admin</span>
            </span>

            <span class="profile-verified-pill">
              <Icon icon="lucide:shield-check" width="11" class="text-emerald-400" />
              <span>Verificat Oficial</span>
            </span>
          </div>

          <div class="profile-name-row">
            <h1 class="profile-display-name">{{ member.displayName }}</h1>
            <button
              type="button"
              class="profile-handle-pill"
              :title="`Copiază @${member.username}`"
              @click="copyHandle(member.username)"
            >
              <span>@{{ member.username }}</span>
              <Icon v-if="copiedHandle" icon="lucide:check" width="11" class="text-emerald-400" />
              <Icon v-else icon="lucide:copy" width="11" />
            </button>
          </div>

          <p v-if="member.customTitle" class="profile-custom-title" :style="{ color: roleMeta.accentColor }">
            {{ member.customTitle }}
          </p>

          <p class="profile-bio-text">
            {{ member.bio || 'Membru activ în echipa de redactare și mentenanță a documentației WildFire.' }}
          </p>
        </div>

        <!-- Hero Right Stats -->
        <div class="profile-hero-stats">
          <div class="profile-stat-box">
            <Icon icon="lucide:git-commit" width="16" class="text-cyan-400" />
            <span class="profile-stat-num">{{ gitStats?.totalCommits || 0 }}</span>
            <span class="profile-stat-label">Total Commits</span>
          </div>
          <div class="profile-stat-box">
            <Icon icon="lucide:file-text" width="16" class="text-emerald-400" />
            <span class="profile-stat-num">{{ gitStats?.docsCommits || 0 }}</span>
            <span class="profile-stat-label">Ghiduri Modificate</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="profile-tabs-bar">
      <button
        type="button"
        :class="['profile-tab-btn', { 'profile-tab-btn--active': profileTab === 'overview' }]"
        @click="profileTab = 'overview'"
      >
        <Icon icon="lucide:activity" width="14" />
        <span>Prezentare Generală</span>
      </button>

      <button
        type="button"
        :class="['profile-tab-btn', { 'profile-tab-btn--active': profileTab === 'timeline' }]"
        @click="profileTab = 'timeline'"
      >
        <Icon icon="lucide:history" width="14" />
        <span>Activitate &amp; Timeline</span>
      </button>

      <button
        type="button"
        :class="['profile-tab-btn', { 'profile-tab-btn--active': profileTab === 'achievements' }]"
        @click="profileTab = 'achievements'"
      >
        <Icon icon="lucide:award" width="14" />
        <span>Realizări &amp; Badges</span>
      </button>
    </div>

    <!-- Tab Content: Overview -->
    <div v-if="profileTab === 'overview'" class="profile-tab-content">
      <!-- Connected Accounts -->
      <div class="profile-social-strip">
        <a
          v-if="member.githubUsername"
          :href="`https://github.com/${member.githubUsername}`"
          target="_blank"
          rel="noopener noreferrer"
          class="profile-social-tile"
        >
          <Icon icon="lucide:github" width="18" />
          <span>github.com/{{ member.githubUsername }}</span>
        </a>

        <div v-if="member.discord" class="profile-social-tile">
          <Icon icon="simple-icons:discord" width="18" class="text-indigo-400" />
          <span>Discord: {{ discordData?.username || member.discord }}</span>
        </div>

        <a
          v-if="member.steamId"
          :href="member.steamId.startsWith('http') ? member.steamId : `https://steamcommunity.com/id/${member.steamId}`"
          target="_blank"
          rel="noopener noreferrer"
          class="profile-social-tile"
        >
          <Icon icon="simple-icons:steam" width="18" class="text-blue-400" />
          <span>Profil Steam</span>
        </a>
      </div>

      <!-- Responsibilities Section -->
      <div v-if="member.responsibilities && member.responsibilities.length > 0" class="profile-section-card">
        <h3 class="profile-section-heading">Atribuții &amp; Arii de Responsabilitate</h3>
        <div class="profile-resp-chips-wrap">
          <span v-for="(resp, i) in member.responsibilities" :key="i" class="team-card-resp-tag">
            <Icon icon="lucide:check-circle-2" width="11" class="text-emerald-400" />
            <span>{{ resp }}</span>
          </span>
        </div>
      </div>

      <!-- Active Permissions -->
      <div class="profile-section-card">
        <h3 class="profile-section-heading">Permisiuni Active în Platformă</h3>
        <div class="profile-perms-grid">
          <div
            v-for="p in PERM_METAS"
            :key="p.key"
            :class="['profile-perm-tile', { 'profile-perm-tile--enabled': member.permissions?.[p.key] }]"
          >
            <Icon :icon="p.icon" width="14" :style="{ color: member.permissions?.[p.key] ? p.color : undefined }" />
            <span>{{ p.label }}</span>
            <Icon
              :icon="member.permissions?.[p.key] ? 'lucide:check' : 'lucide:lock'"
              width="12"
              :class="member.permissions?.[p.key] ? 'text-emerald-400' : 'text-zinc-600'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Timeline -->
    <div v-else-if="profileTab === 'timeline'" class="profile-tab-content">
      <div class="profile-timeline-filters">
        <div class="profile-search-input-wrap">
          <Icon icon="lucide:search" width="14" />
          <input
            v-model="timelineSearch"
            type="text"
            placeholder="Caută în activitate (titlu, fișier, hash)..."
            class="profile-search-input"
          />
        </div>
        <div class="profile-filter-pills">
          <button
            v-for="f in (['all', 'docs', 'commits', 'code'] as const)"
            :key="f"
            type="button"
            :class="['recent-collapse-toggle-btn', { 'admin-filter-pill--active': timelineFilter === f }]"
            @click="timelineFilter = f"
          >
            {{ f.toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="profile-timeline-stream">
        <div v-for="item in filteredTimeline" :key="item.id" class="profile-timeline-entry">
          <div class="timeline-node-dot" />
          <div class="profile-timeline-card">
            <div class="profile-timeline-top">
              <span class="profile-timeline-type">{{ item.type.toUpperCase() }}</span>
              <span class="profile-timeline-date">{{ item.date }}</span>
              <a v-if="item.url" :href="item.url" target="_blank" class="profile-timeline-hash">
                <code>#{{ item.shortHash }}</code>
              </a>
            </div>
            <h4 class="profile-timeline-title">{{ item.title }}</h4>
            <p v-if="item.path" class="profile-timeline-path">
              <code>{{ item.path }}</code>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Achievements -->
    <div v-else-if="profileTab === 'achievements'" class="profile-tab-content">
      <div v-if="filteredBadges.length > 0" class="profile-badges-grid">
        <div v-for="b in filteredBadges" :key="b.id" class="profile-badge-tile">
          <div class="profile-badge-icon-box">
            <Icon icon="lucide:award" width="20" class="text-amber-400" />
          </div>
          <div class="profile-badge-info">
            <h4 class="profile-badge-title">{{ b.name || b.title }}</h4>
            <p class="profile-badge-desc">{{ b.description }}</p>
          </div>
        </div>
      </div>
      <div v-else class="profile-empty-state">
        <Icon icon="lucide:award" width="32" style="opacity: 0.3;" />
        <p>Nu există badges în această categorie.</p>
      </div>
    </div>
  </div>
</template>
