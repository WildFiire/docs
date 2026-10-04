<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import TeamMemberProfile from './TeamMemberProfile.vue';

interface PublicTeamMember {
  id: string;
  username: string;
  displayName: string;
  role: string;
  customTitle?: string;
  avatarUrl?: string;
  avatarColor?: string;
  bio?: string;
  responsibilities?: string[];
  badges?: string[];
  discord?: string;
  steamId?: string;
  githubUsername?: string;
  docsModifiedCount?: number;
  status: string;
  isRoot: boolean;
  createdAt: string;
  permissions?: any;
}

interface DiscordProfileInfo {
  avatarUrl: string;
  username?: string;
  globalName?: string;
}

const route = useRoute();

// Detect if route is for a specific member profile
const activeMemberUsername = computed(() => {
  const path = route.path.replace(/\/$/, '');
  const segments = path.split('/');
  const last = segments[segments.length - 1];
  if (!last || last === 'team' || last === 'index' || last === 'docs') {
    return null;
  }
  // Check if previous segment is team
  const prev = segments[segments.length - 2];
  if (prev === 'team') {
    return decodeURIComponent(last);
  }
  return null;
});

const CURRENT_VERSION = '1.8.5';

const members = ref<PublicTeamMember[]>([]);
const loading = ref(true);
const filter = ref<'all' | 'root' | 'editors'>('all');
const copiedDiscordId = ref<string | null>(null);
const steamAvatars = ref<Record<string, string>>({});
const discordProfiles = ref<Record<string, DiscordProfileInfo>>({});
const repoStats = ref<Record<string, { totalCommits: number; docsCommits: number }>>({});
const collapseDescriptions = ref<boolean>(true);
const cardCollapseOverrides = ref<Record<string, boolean>>({});
const githubGraphUrl = ref<string>(
  'https://github.com/WildFiire/docs/graphs/contributors',
);

function getSteamProfileUrl(steamId?: string): string | null {
  if (!steamId) return null;
  const clean = steamId.trim();
  if (!clean) return null;
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (/^7656119\d{10}$/.test(clean)) {
    return `https://steamcommunity.com/profiles/${clean}`;
  }
  return `https://steamcommunity.com/id/${clean}`;
}

function getDiscordDefaultAvatar(userId?: string): string {
  if (!userId) return 'https://cdn.discordapp.com/embed/avatars/0.png';
  try {
    const bigId = BigInt(userId.trim());
    const idx = Number((bigId >> BigInt(22)) % BigInt(6));
    return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
  } catch {
    return 'https://cdn.discordapp.com/embed/avatars/0.png';
  }
}

function getRoleMeta(role: string, isRoot: boolean) {
  if (isRoot || role === 'root_admin') {
    return {
      label: 'Root Super Admin',
      categoryName: 'Root Admin',
      iconBoxClass: 'recent-card-item-icon--orange',
      icon: 'lucide:shield-check',
      iconClass: 'text-amber-400',
      accentColor: '#ff7700',
    };
  }
  switch (role) {
    case 'doc_lead':
      return {
        label: 'Co-Lead & Systems',
        categoryName: 'Co-Lead & Systems',
        iconBoxClass: 'recent-card-item-icon--orange',
        icon: 'lucide:award',
        iconClass: 'text-amber-400',
        accentColor: '#f59e0b',
      };
    case 'content_editor':
      return {
        label: 'Content Editor',
        categoryName: 'Content Editor',
        iconBoxClass: 'recent-card-item-icon--green',
        icon: 'lucide:book-open',
        iconClass: 'text-emerald-400',
        accentColor: '#10b981',
      };
    case 'custom':
      return {
        label: 'Content Lead & Reviewer',
        categoryName: 'Content Lead',
        iconBoxClass: 'recent-card-item-icon--green',
        icon: 'lucide:sparkles',
        iconClass: 'text-emerald-400',
        accentColor: '#10b981',
      };
    case 'moderator':
      return {
        label: 'Reviewer & Mod',
        categoryName: 'Reviewer',
        iconBoxClass: 'recent-card-item-icon--purple',
        icon: 'lucide:check-circle-2',
        iconClass: 'text-purple-400',
        accentColor: '#a855f7',
      };
    case 'viewer':
    default:
      return {
        label: 'Auditor Docs',
        categoryName: 'Auditor',
        iconBoxClass: 'recent-card-item-icon--teal',
        icon: 'lucide:eye',
        iconClass: 'text-blue-400',
        accentColor: '#3b82f6',
      };
  }
}

function getResponsibilityIcon(tag: string) {
  const lower = tag.toLowerCase();
  if (
    lower.includes('arhitectur') ||
    lower.includes('core') ||
    lower.includes('engine') ||
    lower.includes('sistem')
  ) {
    return { icon: 'lucide:cpu', class: 'text-amber-400' };
  }
  if (lower.includes('securitat') || lower.includes('2fa') || lower.includes('auth')) {
    return { icon: 'lucide:lock', class: 'text-blue-400' };
  }
  if (
    lower.includes('ghid') ||
    lower.includes('jucator') ||
    lower.includes('continut') ||
    lower.includes('redactare')
  ) {
    return { icon: 'lucide:book-open', class: 'text-emerald-400' };
  }
  if (lower.includes('media') || lower.includes('asset') || lower.includes('vault')) {
    return { icon: 'lucide:layers', class: 'text-cyan-400' };
  }
  if (
    lower.includes('verific') ||
    lower.includes('acuratete') ||
    lower.includes('audit') ||
    lower.includes('optimizare')
  ) {
    return { icon: 'lucide:check-check', class: 'text-purple-400' };
  }
  return { icon: 'lucide:file-text', class: 'text-zinc-400' };
}

function handleGlobalCollapseToggle() {
  collapseDescriptions.value = !collapseDescriptions.value;
  cardCollapseOverrides.value = {};
}

function toggleCardCollapse(memberId: string) {
  const current =
    cardCollapseOverrides.value[memberId] !== undefined
      ? cardCollapseOverrides.value[memberId]
      : collapseDescriptions.value;
  cardCollapseOverrides.value[memberId] = !current;
}

function handleCopyDiscord(e: MouseEvent, copyText: string, id: string) {
  e.preventDefault();
  e.stopPropagation();
  if (!copyText) return;
  navigator.clipboard.writeText(copyText);
  copiedDiscordId.value = id;
  setTimeout(() => {
    copiedDiscordId.value = null;
  }, 2000);
}

const rootCount = computed(
  () =>
    members.value.filter((m) => m.isRoot || m.role === 'root_admin' || m.role === 'doc_lead')
      .length,
);
const editorCount = computed(
  () =>
    members.value.filter(
      (m) =>
        m.role === 'content_editor' ||
        m.role === 'custom' ||
        m.role === 'moderator' ||
        m.role === 'viewer',
    ).length,
);

const filteredMembers = computed(() => {
  return members.value.filter((m) => {
    if (
      filter.value === 'root' &&
      !m.isRoot &&
      m.role !== 'root_admin' &&
      m.role !== 'doc_lead'
    )
      return false;
    if (
      filter.value === 'editors' &&
      m.role !== 'content_editor' &&
      m.role !== 'custom' &&
      m.role !== 'moderator' &&
      m.role !== 'viewer'
    )
      return false;
    return true;
  });
});

async function loadData() {
  loading.value = true;
  try {
    const res = await fetch('/api/team/contributors');
    if (res.ok) {
      const data = await res.json();
      if (data.githubGraphUrl) {
        githubGraphUrl.value = data.githubGraphUrl;
      }
      if (data.contributors && Array.isArray(data.contributors)) {
        members.value = data.contributors;
        const map: Record<string, { totalCommits: number; docsCommits: number }> = {};
        for (const c of data.contributors) {
          map[c.username.toLowerCase()] = {
            totalCommits: c.stats?.totalCommits || 0,
            docsCommits: c.stats?.docsCommits || 0,
          };
        }
        repoStats.value = map;
      }
    }

    // Secondary fetch for avatars
    members.value.forEach((member) => {
      if (member.steamId && !steamAvatars.value[member.id]) {
        fetch(`/api/steam/avatar?id=${encodeURIComponent(member.steamId)}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.avatarUrl) {
              steamAvatars.value[member.id] = d.avatarUrl;
            }
          })
          .catch(() => {});
      }

      if (member.discord && !discordProfiles.value[member.id]) {
        fetch(`/api/discord/avatar?id=${encodeURIComponent(member.discord)}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.avatarUrl) {
              discordProfiles.value[member.id] = {
                avatarUrl: d.avatarUrl,
                username: d.username,
                globalName: d.globalName || d.global_name,
              };
            }
          })
          .catch(() => {});
      }
    });
  } catch (err) {
    console.error('Failed to load team data:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <!-- Individual Profile Mode -->
  <TeamMemberProfile v-if="activeMemberUsername" :username="activeMemberUsername" />

  <!-- Team Grid Mode -->
  <div v-else class="docs-home-wrapper">
    <main class="docs-home" id="main-content">
      <!-- Hero Section -->
      <section
        class="docs-home-hero"
        style="margin-bottom: var(--space-6); padding-bottom: var(--space-6);"
      >
        <div class="docs-home-badge">
          <span class="docs-badge-dot" aria-hidden="true" />
          <span>Wildfire Documentation Workforce v{{ CURRENT_VERSION }}</span>
        </div>

        <h1 class="docs-home-title">
          Wildfire Core Team &amp; Contributors
        </h1>

        <p class="docs-home-desc" style="margin-bottom: 0;">
          Echipa oficială, arhitecții de sisteme și contribuitorii care redactează, revizuiesc și
          mențin documentația pe serverele CS2 Wildfire.ro.
        </p>
      </section>

      <!-- Main Section: Team Members Grid -->
      <section class="docs-home-section">
        <div class="section-header section-header--flex">
          <div class="section-header-left-col">
            <div class="section-title-badge-row">
              <h2 class="docs-home-section-title">Echipa Noastră</h2>

              <!-- Live Pulse Badge -->
              <span class="live-pulse-badge">
                <span class="pulse-dot" aria-hidden="true" />
                <span>Live Team Sync</span>
              </span>

              <!-- Count Pill -->
              <span
                class="recent-count-pill"
                title="Membri activi înregistrați în echipă"
              >
                <Icon
                  icon="lucide:sparkles"
                  width="12"
                  class="text-amber-400"
                  aria-hidden="true"
                />
                <span
                  ><strong>{{ members.length }}</strong> membri activi</span
                >
                <span class="count-pill-divider">/</span>
                <span
                  ><strong>{{ rootCount }}</strong> lead &amp; root</span
                >
              </span>
            </div>

            <span class="section-sub">
              Toți membrii verificați cu acces de editare în documentație • Contactează-i pe
              Discord sau Steam
            </span>
          </div>

          <!-- Filter Toggle Buttons -->
          <div class="section-header-actions">
            <div class="recent-page-pills">
              <button
                type="button"
                :class="[
                  'recent-collapse-toggle-btn',
                  { 'admin-filter-pill--active': filter === 'all' },
                ]"
                style="font-size: 0.72rem; padding: 4px 10px;"
                @click="filter = 'all'"
              >
                Toți ({{ members.length }})
              </button>
              <button
                type="button"
                :class="[
                  'recent-collapse-toggle-btn',
                  { 'admin-filter-pill--active': filter === 'root' },
                ]"
                style="font-size: 0.72rem; padding: 4px 10px;"
                @click="filter = 'root'"
              >
                Root &amp; Lead ({{ rootCount }})
              </button>
              <button
                type="button"
                :class="[
                  'recent-collapse-toggle-btn',
                  { 'admin-filter-pill--active': filter === 'editors' },
                ]"
                style="font-size: 0.72rem; padding: 4px 10px;"
                @click="filter = 'editors'"
              >
                Editori ({{ editorCount }})
              </button>
              <button
                type="button"
                :class="[
                  'recent-collapse-toggle-btn',
                  { 'admin-filter-pill--active': collapseDescriptions },
                ]"
                :style="{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderColor: collapseDescriptions ? 'hsl(38 96% 50% / 0.4)' : undefined,
                  color: collapseDescriptions ? '#fbbf24' : undefined,
                }"
                :title="
                  collapseDescriptions
                    ? 'Afișează tag-urile de atribuții pentru toți membrii'
                    : 'Ascunde tag-urile de atribuții pentru toți membrii'
                "
                @click="handleGlobalCollapseToggle"
              >
                <Icon
                  :icon="collapseDescriptions ? 'lucide:eye' : 'lucide:eye-off'"
                  width="11"
                  :class="{ 'text-amber-400': collapseDescriptions }"
                  aria-hidden="true"
                />
                <span>{{ collapseDescriptions ? 'Extinde Atribuții' : 'Ascunde Atribuții' }}</span>
              </button>
              <a
                :href="githubGraphUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="recent-collapse-toggle-btn"
                style="font-size: 0.72rem; padding: 4px 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; background: hsl(220 14% 18% / 0.7); border-color: hsl(220 14% 35% / 0.6);"
                title="Deschide GitHub Contributors Graph"
              >
                <Icon icon="lucide:github" width="11" />
                <span>GitHub Graph</span>
                <Icon icon="lucide:external-link" width="10" class="opacity-60" />
              </a>
            </div>
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="recent-updates-grid">
          <div
            v-for="member in filteredMembers"
            :key="member.id"
            class="recent-update-card"
            style="cursor: default; display: flex; flexDirection: column; justify-content: space-between; align-self: stretch; padding: 18px 20px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);"
          >
            <div>
              <!-- Top Bar: Role Category Pill + Stats -->
              <div class="recent-card-top">
                <span class="recent-card-category">
                  <span class="recent-card-cat-icon">
                    <Icon
                      :icon="getRoleMeta(member.role, member.isRoot).icon"
                      width="13"
                      :class="getRoleMeta(member.role, member.isRoot).iconClass"
                    />
                  </span>
                  <span>{{ getRoleMeta(member.role, member.isRoot).categoryName }}</span>
                </span>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <span
                    v-if="repoStats[member.username.toLowerCase()]?.totalCommits"
                    class="recent-card-time"
                    title="Commit-uri reale în repository"
                  >
                    <Icon
                      icon="lucide:git-commit"
                      width="11"
                      class="text-cyan-400"
                      aria-hidden="true"
                    />
                    <span
                      ><strong
                        >{{ repoStats[member.username.toLowerCase()].totalCommits }}</strong
                      >
                      commit-uri</span
                    >
                  </span>
                  <span
                    v-else
                    class="recent-card-time"
                    title="Ghiduri modificate în repository"
                  >
                    <Icon
                      icon="lucide:file-text"
                      width="11"
                      class="text-zinc-500"
                      aria-hidden="true"
                    />
                    <span
                      ><strong
                        >{{ repoStats[member.username.toLowerCase()]?.docsCommits ?? 0 }}</strong
                      >
                      ghiduri</span
                    >
                  </span>

                  <span class="recent-card-time">
                    <Icon icon="lucide:clock" width="11" aria-hidden="true" />
                    <span>
                      {{
                        new Date(member.createdAt).toLocaleDateString('ro-RO', {
                          month: 'short',
                          year: 'numeric',
                        })
                      }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- Title Row with Avatar + Name & Custom Role + Verified Badge + Collapse Toggle -->
              <div
                class="recent-card-title-row"
                style="align-items: center; margin-bottom: 12px;"
              >
                <div
                  class="recent-card-title-wrap"
                  style="gap: 10px; align-items: center;"
                >
                  <!-- Avatar Frame (Proportional 46x46) -->
                  <div
                    :style="{
                      position: 'relative',
                      width: '46px',
                      height: '46px',
                      borderRadius: '11px',
                      border: `1.5px solid ${getRoleMeta(member.role, member.isRoot).accentColor}55`,
                      background: 'hsl(0 0% 12% / 0.8)',
                      boxShadow: `0 4px 14px ${getRoleMeta(member.role, member.isRoot).accentColor}25`,
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }"
                  >
                    <img
                      v-if="
                        member.avatarUrl ||
                        steamAvatars[member.id] ||
                        discordProfiles[member.id]?.avatarUrl
                      "
                      :src="
                        member.avatarUrl ||
                        steamAvatars[member.id] ||
                        discordProfiles[member.id]?.avatarUrl
                      "
                      :alt="member.displayName"
                      style="width: 100%; height: 100%; object-fit: cover;"
                      onerror="this.style.display='none'"
                    />
                    <div
                      v-else
                      :style="{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${getRoleMeta(member.role, member.isRoot).accentColor}50, ${getRoleMeta(member.role, member.isRoot).accentColor}15)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: '#ffffff',
                        textTransform: 'uppercase',
                      }"
                    >
                      {{ member.displayName.slice(0, 2) }}
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; min-width: 0;">
                    <h3
                      class="recent-card-title"
                      style="font-size: 1rem; line-height: 1.25; font-weight: 800;"
                    >
                      {{ member.displayName }}
                    </h3>
                    <span
                      v-if="member.customTitle"
                      :style="{
                        fontSize: '0.74rem',
                        color: getRoleMeta(member.role, member.isRoot).accentColor,
                        fontWeight: 600,
                        marginTop: '2px',
                      }"
                    >
                      {{ member.customTitle }}
                    </span>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 6px;">
                  <!-- Verified Icon Pill -->
                  <span
                    style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; background: hsl(142 70% 45% / 0.12); border: 1px solid hsl(142 70% 45% / 0.3); color: #34d399; font-size: 0.68rem; font-weight: 700; flex-shrink: 0;"
                    title="Membru Verificat Oficial"
                  >
                    <Icon
                      icon="lucide:user-check"
                      width="12"
                      class="text-emerald-400"
                      aria-hidden="true"
                    />
                    <span>Verificat</span>
                  </span>

                  <!-- Individual Card Collapse / Expand Tags Button -->
                  <button
                    v-if="member.responsibilities && member.responsibilities.length > 0"
                    type="button"
                    :style="{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background:
                        (cardCollapseOverrides[member.id] !== undefined
                          ? cardCollapseOverrides[member.id]
                          : collapseDescriptions)
                          ? 'hsl(38 96% 50% / 0.14)'
                          : 'hsl(0 0% 100% / 0.05)',
                      border:
                        (cardCollapseOverrides[member.id] !== undefined
                          ? cardCollapseOverrides[member.id]
                          : collapseDescriptions)
                          ? '1px solid hsl(38 96% 50% / 0.4)'
                          : '1px solid var(--glass-border)',
                      color:
                        (cardCollapseOverrides[member.id] !== undefined
                          ? cardCollapseOverrides[member.id]
                          : collapseDescriptions)
                          ? '#fbbf24'
                          : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      padding: 0,
                      flexShrink: 0,
                    }"
                    :title="
                      (cardCollapseOverrides[member.id] !== undefined
                        ? cardCollapseOverrides[member.id]
                        : collapseDescriptions)
                        ? 'Afișează tag-urile de atribuții'
                        : 'Ascunde tag-urile de atribuții'
                    "
                    :aria-label="
                      (cardCollapseOverrides[member.id] !== undefined
                        ? cardCollapseOverrides[member.id]
                        : collapseDescriptions)
                        ? 'Afișează atribuții'
                        : 'Ascunde atribuții'
                    "
                    @click="toggleCardCollapse(member.id)"
                  >
                    <Icon
                      icon="lucide:chevron-down"
                      width="13"
                      :style="{
                        transform:
                          (cardCollapseOverrides[member.id] !== undefined
                            ? cardCollapseOverrides[member.id]
                            : collapseDescriptions)
                            ? 'rotate(-90deg)'
                            : 'rotate(0deg)',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <!-- Bio Description -->
              <p
                class="recent-card-desc"
                :style="{
                  WebkitLineClamp: 3,
                  marginBottom:
                    (cardCollapseOverrides[member.id] !== undefined
                      ? cardCollapseOverrides[member.id]
                      : collapseDescriptions)
                      ? '0px'
                      : '12px',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  minHeight:
                    (cardCollapseOverrides[member.id] !== undefined
                      ? cardCollapseOverrides[member.id]
                      : collapseDescriptions)
                      ? '38px'
                      : '48px',
                  transition: 'margin-bottom 0.2s ease',
                }"
              >
                {{
                  member.bio ||
                  'Membru activ în echipa de redactare și mentenanță a documentației WildFire.'
                }}
              </p>

              <!-- Collapsible Responsibilities Tags Section -->
              <div
                v-if="member.responsibilities && member.responsibilities.length > 0"
                :style="{
                  maxHeight:
                    (cardCollapseOverrides[member.id] !== undefined
                      ? cardCollapseOverrides[member.id]
                      : collapseDescriptions)
                      ? '0px'
                      : '180px',
                  opacity:
                    (cardCollapseOverrides[member.id] !== undefined
                      ? cardCollapseOverrides[member.id]
                      : collapseDescriptions)
                      ? 0
                      : 1,
                  overflow: 'hidden',
                  transition:
                    'max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, margin 0.2s ease',
                  marginTop:
                    (cardCollapseOverrides[member.id] !== undefined
                      ? cardCollapseOverrides[member.id]
                      : collapseDescriptions)
                      ? '0px'
                      : '2px',
                  marginBottom:
                    (cardCollapseOverrides[member.id] !== undefined
                      ? cardCollapseOverrides[member.id]
                      : collapseDescriptions)
                      ? '0px'
                      : '2px',
                }"
              >
                <div
                  style="display: flex; flex-wrap: wrap; gap: 5px; padding-top: 2px;"
                >
                  <span
                    v-for="(resp, idx) in member.responsibilities.slice(0, 5)"
                    :key="idx"
                    class="team-card-resp-tag"
                  >
                    <Icon
                      :icon="getResponsibilityIcon(resp).icon"
                      width="11"
                      :class="getResponsibilityIcon(resp).class"
                    />
                    <span>{{ resp }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer: Clean @handle + Steam & Discord Action Buttons -->
            <div class="team-card-bottom-bar">
              <div class="team-handle-pill">
                <span class="team-handle-pill-text">
                  <span
                    class="team-handle-at"
                    :style="{ color: getRoleMeta(member.role, member.isRoot).accentColor }"
                    >@</span
                  >
                  <span class="team-handle-username">{{ member.username }}</span>
                </span>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <!-- View Profile Button -->
                <a
                  :href="`/docs/team/${encodeURIComponent(member.username)}`"
                  class="team-card-profile-action-btn"
                  :style="{
                    background: `${getRoleMeta(member.role, member.isRoot).accentColor}14`,
                    borderColor: `${getRoleMeta(member.role, member.isRoot).accentColor}40`,
                    color: getRoleMeta(member.role, member.isRoot).accentColor,
                  }"
                  :title="`Profil complet — ${member.displayName}`"
                >
                  <Icon icon="lucide:user" width="11" />
                  <span>Profil</span>
                </a>

                <!-- Steam Button -->
                <a
                  v-if="getSteamProfileUrl(member.steamId)"
                  :href="getSteamProfileUrl(member.steamId)!"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="position: relative; width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid hsl(215 85% 58% / 0.5); background: hsl(215 45% 16% / 0.8); box-shadow: 0 3px 10px hsl(215 85% 45% / 0.25); display: inline-flex; align-items: center; justify-content: center; overflow: hidden; transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; flex-shrink: 0;"
                  :title="`Profil Steam — ${member.displayName}`"
                >
                  <img
                    v-if="steamAvatars[member.id]"
                    :src="steamAvatars[member.id]"
                    alt="Steam"
                    style="width: 100%; height: 100%; object-fit: cover;"
                  />
                  <Icon v-else icon="simple-icons:steam" width="16" class="text-blue-400" />
                </a>

                <!-- Discord Button -->
                <button
                  v-if="member.discord"
                  type="button"
                  :style="{
                    position: 'relative',
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    border:
                      copiedDiscordId === member.id
                        ? '1.5px solid hsl(142 75% 50% / 0.9)'
                        : '1.5px solid hsl(235 85% 68% / 0.5)',
                    background:
                      copiedDiscordId === member.id
                        ? 'hsl(142 70% 22% / 0.6)'
                        : 'hsl(235 45% 18% / 0.8)',
                    boxShadow:
                      copiedDiscordId === member.id
                        ? '0 3px 12px hsl(142 70% 40% / 0.4)'
                        : '0 3px 10px hsl(235 80% 60% / 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }"
                  :title="
                    copiedDiscordId === member.id
                      ? `Copiat @${discordProfiles[member.id]?.username || member.discord}!`
                      : `Copiază Discord: @${discordProfiles[member.id]?.username || member.discord}`
                  "
                  @click="
                    (e) =>
                      handleCopyDiscord(
                        e,
                        discordProfiles[member.id]?.username || member.discord || '',
                        member.id,
                      )
                  "
                >
                  <Icon
                    v-if="copiedDiscordId === member.id"
                    icon="lucide:check"
                    width="16"
                    class="text-emerald-400"
                  />
                  <img
                    v-else-if="discordProfiles[member.id]?.avatarUrl"
                    :src="discordProfiles[member.id].avatarUrl"
                    alt="Discord"
                    style="width: 100%; height: 100%; object-fit: cover;"
                  />
                  <Icon
                    v-else
                    icon="simple-icons:discord"
                    width="16"
                    class="text-indigo-300"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Secondary Section: Role Hierarchy & Guidelines -->
      <section class="docs-home-section">
        <div class="section-header">
          <h2 class="docs-home-section-title">Roluri &amp; Niveluri de Acces în Echipă</h2>
          <span class="section-sub"
            >Ierarhia oficială și permisiunile fiecărui grad din echipa de documentație</span
          >
        </div>

        <div class="home-cards-grid">
          <div class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--orange">
                <Icon icon="lucide:shield" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">Root Authority</span>
            </div>
            <h3 class="home-card-title">Root Super Admin</h3>
            <p class="home-card-desc">
              Gestionarea platformei de documentație, arhitectura sistemelor, securitatea și
              drepturile de acces.
            </p>
          </div>

          <div class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--blue">
                <Icon icon="lucide:award" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">Management</span>
            </div>
            <h3 class="home-card-title">Documentation Lead</h3>
            <p class="home-card-desc">
              Supervizează structura ghidurilor, aprobă conținutul nou, gestionează fișierele media
              și setările platformei.
            </p>
          </div>

          <div class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--teal">
                <Icon icon="lucide:book-open" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">Redactare</span>
            </div>
            <h3 class="home-card-title">Content Editor</h3>
            <p class="home-card-desc">
              Redactează ghiduri Markdown, actualizează mecanici in-game, corectează erori și adaugă
              capturi media.
            </p>
          </div>

          <a href="/informatii/staff/cum-aplici" class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--yellow">
                <Icon icon="lucide:flame" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">Recrutare</span>
              <Icon
                icon="lucide:arrow-right"
                width="15"
                class="home-card-arrow"
                aria-hidden="true"
              />
            </div>
            <h3 class="home-card-title">Vrei să Contribui?</h3>
            <p class="home-card-desc">
              Află cum poți deveni redactor de conținut sau cum poți propune ghiduri noi pentru
              comunitatea Wildfire.
            </p>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>
