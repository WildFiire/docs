<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useData } from 'vitepress';
import { Icon } from '@iconify/vue';

const { isDark } = useData();

const props = defineProps<{ username: string }>();

const member = ref<any>(null);
const gitStats = ref<any>(null);
const achievements = ref<any>(null);
const githubData = ref<any>(null);
const discordData = ref<any>(null);
const steamData = ref<any>(null);

const copiedHandle = ref(false);
const copiedLink = ref(false);
const copiedSocial = ref<Record<string, boolean>>({});
const toastMessage = ref<string | null>(null);
const loading = ref(true);
const notFound = ref(false);
const socialsLoaded = ref(false);

// Tab & Filter States
const profileTab = ref<'overview' | 'timeline' | 'achievements'>('overview');
const timelineSearch = ref<string>('');
const timelineFilter = ref<'all' | 'docs' | 'commits' | 'code'>('all');
const badgeCategoryFilter = ref<'all' | 'git' | 'docs' | 'security' | 'community'>('all');

// ── Role Metadata & Vibrant Accent Definitions ──
const ROLE_META: Record<
  string,
  { label: string; accentColor: string; glowColor: string; bgTint: string; gradient: string }
> = {
  root_admin: {
    label: 'Root Super Admin',
    accentColor: '#f97316',
    glowColor: 'transparent',
    bgTint: 'rgba(249, 115, 22, 0.08)',
    gradient: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
  },
  doc_lead: {
    label: 'Co-Lead & Systems',
    accentColor: '#f59e0b',
    glowColor: 'transparent',
    bgTint: 'rgba(245, 158, 11, 0.08)',
    gradient: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
  },
  content_editor: {
    label: 'Senior Content Editor',
    accentColor: '#10b981',
    glowColor: 'transparent',
    bgTint: 'rgba(16, 185, 129, 0.08)',
    gradient: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
  },
  custom: {
    label: 'Content Editor & Reviewer',
    accentColor: '#10b981',
    glowColor: 'transparent',
    bgTint: 'rgba(16, 185, 129, 0.08)',
    gradient: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
  },
  moderator: {
    label: 'Moderator & Reviewer',
    accentColor: '#8b5cf6',
    glowColor: 'transparent',
    bgTint: 'rgba(139, 92, 246, 0.08)',
    gradient: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  viewer: {
    label: 'Community Contributor',
    accentColor: '#94a3b8',
    glowColor: 'transparent',
    bgTint: 'rgba(148, 163, 184, 0.06)',
    gradient: 'linear-gradient(90deg, #94a3b8 0%, #64748b 100%)',
  },
};

const PERM_METAS = [
  { key: 'canEditDocs', label: 'Content Studio', icon: 'lucide:file-edit', color: '#10b981' },
  { key: 'canDeleteDocs', label: 'Ștergere Docs', icon: 'lucide:trash-2', color: '#f43f5e' },
  { key: 'canManageMedia', label: 'Media Vault', icon: 'lucide:image', color: '#06b6d4' },
  { key: 'canViewAnalytics', label: 'Search Telemetry', icon: 'lucide:bar-chart-3', color: '#a855f7' },
  { key: 'canViewAudit', label: 'Audit Ledger', icon: 'lucide:scroll', color: '#f59e0b' },
  { key: 'canManageSettings', label: 'Setări & Backup', icon: 'lucide:sliders', color: '#ff6b00' },
  { key: 'canManageSecurity', label: 'Securitate 2FA', icon: 'lucide:shield-check', color: '#3b82f6' },
  { key: 'canManageApiKeys', label: 'API Tokens', icon: 'lucide:key', color: '#6366f1' },
  { key: 'canTriggerPanic', label: 'Panic Lockdown', icon: 'lucide:shield-alert', color: '#ef4444' },
  { key: 'canManageTeam', label: 'Gestiune Echipă', icon: 'lucide:users', color: '#f59e0b' },
];

const TIER_LABELS: Record<string, { name: string; color: string; bg: string; border: string }> = {
  mythic: { name: 'Mythic', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.16)', border: 'rgba(192, 132, 252, 0.5)' },
  platinum: { name: 'Platinum', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.16)', border: 'rgba(34, 211, 238, 0.5)' },
  gold: { name: 'Gold', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.16)', border: 'rgba(251, 191, 36, 0.5)' },
  silver: { name: 'Silver', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.16)', border: 'rgba(203, 213, 225, 0.4)' },
  bronze: { name: 'Bronze', color: '#f97316', bg: 'rgba(249, 115, 22, 0.16)', border: 'rgba(249, 115, 22, 0.45)' },
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

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = null;
    }
  }, 2400);
}

// Fallback registry for instant offline / dev resilience
const LOCAL_FALLBACK_MEMBERS: Record<string, any> = {
  yakuza: {
    id: 'user_83750fc6a71f918f089d8f783542baf9',
    username: 'Yakuza',
    displayName: 'Yakuza',
    email: 'yakuza@wildfire.ro',
    role: 'content_editor',
    customTitle: 'Senior Content Editor & Reviewer',
    avatarUrl: 'https://github.com/Yakuza2377.png',
    avatarColor: '#10b981',
    bio: 'Responsabil de elaborarea ghidurilor detaliate pentru jucători, proceduri de joc, revizuirea mecanicii și acuratețea datelor pe platforma WildFire.',
    responsibilities: [
      'Ghiduri Jucători',
      'Sisteme & MVP',
      'Media & Asset Vault',
      'Verificare Acuratețe',
    ],
    badges: ['CONTENT LEAD', 'VERIFIED GUIDE'],
    discord: '778170514036228097',
    steamId: 'https://steamcommunity.com/id/YakuzaTheImmortal',
    githubUsername: 'Yakuza2377',
    status: 'active',
    isRoot: false,
    createdAt: '2026-08-21T14:15:00.61+00:00',
    permissions: {
      canEditDocs: true,
      canViewAudit: false,
      canDeleteDocs: false,
      canManageTeam: false,
      canManageMedia: true,
      canTriggerPanic: false,
      canManageApiKeys: false,
      canViewAnalytics: true,
      canManageSecurity: false,
      canManageSettings: false,
    },
  },
  iannc69: {
    id: 'user_root_iannc69',
    username: 'iannC69',
    displayName: 'iannC',
    email: 'iannc@wildfire.ro',
    role: 'root_admin',
    customTitle: 'Lead Docs & Systems Architect',
    avatarUrl: 'https://github.com/iannC69.png',
    avatarColor: '#ff6b00',
    bio: 'Se ocupă de structura, redactarea și actualizarea platformei de documentație, integrarea sistemelor tehnice și experiența generală a ghidurilor WildFire.',
    responsibilities: [
      'Arhitectură Documentație',
      'Redactare & Ghiduri Tehnice',
      'Optimizare Docs Engine',
      'Supervizare Echipă Docs',
      'Securitate & 2FA',
    ],
    badges: ['LEAD ARCHITECT', 'DOCS SPECIALIST', 'SYSTEMS LEAD'],
    discord: '371621920162185216',
    steamId: 'https://steamcommunity.com/id/1iannc/',
    githubUsername: 'iannC69',
    status: 'active',
    isRoot: true,
    createdAt: '2026-08-17T18:20:32.349+00:00',
    permissions: {
      canEditDocs: true,
      canViewAudit: true,
      canDeleteDocs: true,
      canManageTeam: true,
      canManageMedia: true,
      canTriggerPanic: true,
      canManageApiKeys: true,
      canViewAnalytics: true,
      canManageSecurity: true,
      canManageSettings: true,
    },
  },
  v1ccx: {
    id: 'user_5d1bd9841e1a0968998b302637aaced5',
    username: 'V1ccX',
    displayName: 'V1ccX',
    email: 'v1ccx@wildfire.ro',
    role: 'content_editor',
    customTitle: 'Senior Content Editor',
    avatarUrl: 'https://github.com/Vicc09.png',
    avatarColor: '#10b981',
    bio: 'Editor activ de conținut dedicat ghidurilor detaliate de configurare, comenzi in-game și suport pentru jucători.',
    responsibilities: ['Ghiduri CS2', 'Optimizări Joc', 'Revizuire Conținut'],
    badges: ['VERIFIED STAFF', 'CONTENT SPECIALIST'],
    discord: '1138548983938449429',
    steamId: 'https://steamcommunity.com/id/Vicc_wf/',
    githubUsername: 'Vicc09',
    status: 'active',
    isRoot: false,
    createdAt: '2026-08-25T11:00:00.000+00:00',
    permissions: {
      canEditDocs: true,
      canViewAudit: false,
      canDeleteDocs: false,
      canManageTeam: false,
      canManageMedia: true,
      canTriggerPanic: false,
      canManageApiKeys: false,
      canViewAnalytics: true,
      canManageSecurity: false,
      canManageSettings: false,
    },
  },
  umpy: {
    id: 'user_umpy_contributor',
    username: 'umpy',
    displayName: 'umpy',
    email: 'umpy@wildfire.ro',
    role: 'content_editor',
    customTitle: 'Content Editor & Gameplay Specialist',
    avatarUrl: 'https://github.com/umpy04.png',
    avatarColor: '#06b6d4',
    bio: 'Contribuitor în echipa de redactare, axat pe documentarea sistemelor de gameplay, evenimente și regulamente.',
    responsibilities: ['Sisteme Gameplay', 'Ghiduri & Evenimente'],
    badges: ['GAMEPLAY SPEC', 'VERIFIED STAFF'],
    githubUsername: 'umpy04',
    status: 'active',
    isRoot: false,
    createdAt: '2026-09-01T10:00:00.000+00:00',
    permissions: {
      canEditDocs: true,
      canViewAudit: false,
      canDeleteDocs: false,
      canManageTeam: false,
      canManageMedia: false,
      canTriggerPanic: false,
      canManageApiKeys: false,
      canViewAnalytics: false,
      canManageSecurity: false,
      canManageSettings: false,
    },
  },
};

async function fetchProfile() {
  if (!props.username) return;
  loading.value = true;
  notFound.value = false;
  socialsLoaded.value = false;

  const unameKey = props.username.toLowerCase().trim();

  try {
    const res = await fetch(`/api/team/profile?username=${encodeURIComponent(props.username)}`);
    if (res.ok) {
      const data = await res.json();
      member.value = data.member;
      gitStats.value = data.gitStats;
      if (data.achievements) achievements.value = data.achievements;
    } else if (LOCAL_FALLBACK_MEMBERS[unameKey]) {
      member.value = LOCAL_FALLBACK_MEMBERS[unameKey];
    } else {
      notFound.value = true;
      loading.value = false;
      return;
    }

    loading.value = false;

    // Parallel fetch for social accounts
    const promises: Promise<void>[] = [];

    if (member.value?.githubUsername) {
      promises.push(
        fetch(`/api/team/github?username=${encodeURIComponent(member.value.githubUsername)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((gh) => {
            if (gh && !gh.error) githubData.value = gh;
          })
          .catch(() => {}),
      );
    }

    if (member.value?.discord && /^\d{17,20}$/.test(member.value.discord.trim())) {
      promises.push(
        fetch(`/api/discord/avatar?id=${encodeURIComponent(member.value.discord.trim())}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (d) discordData.value = d;
          })
          .catch(() => {}),
      );
    }

    if (member.value?.steamId) {
      promises.push(
        fetch(`/api/steam/avatar?id=${encodeURIComponent(member.value.steamId.trim())}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((s) => {
            if (s && !s.error) steamData.value = s;
          })
          .catch(() => {}),
      );
    }

    await Promise.allSettled(promises);
    socialsLoaded.value = true;
  } catch (err) {
    if (LOCAL_FALLBACK_MEMBERS[unameKey]) {
      member.value = LOCAL_FALLBACK_MEMBERS[unameKey];
      loading.value = false;
    } else {
      notFound.value = true;
      loading.value = false;
    }
  }
}

function copyProfileHandle(handle: string) {
  navigator.clipboard.writeText(`@${handle}`).then(() => {
    copiedHandle.value = true;
    showToast(`Handle-ul @${handle} a fost copiat!`);
    setTimeout(() => {
      copiedHandle.value = false;
    }, 2000);
  });
}

function copySocialText(key: string, text: string, label: string) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copiedSocial.value[key] = true;
    showToast(`${label} a fost copiat în clipboard!`);
    setTimeout(() => {
      copiedSocial.value[key] = false;
    }, 2000);
  });
}

function copyProfileLink() {
  if (typeof window === 'undefined') return;
  navigator.clipboard.writeText(window.location.href).then(() => {
    copiedLink.value = true;
    showToast('Link-ul profilului a fost copiat!');
    setTimeout(() => {
      copiedLink.value = false;
    }, 2000);
  });
}

function copyMarkdownLink() {
  if (typeof window === 'undefined' || !member.value) return;
  const name = member.value.displayName || member.value.username;
  const md = `[${name} - WildFire Docs](${window.location.href})`;
  navigator.clipboard.writeText(md).then(() => {
    showToast('Link-ul Markdown a fost copiat în clipboard!');
  });
}

function copyDiscordMention() {
  if (!member.value?.discord) return;
  const tag = `<@${member.value.discord.trim()}>`;
  navigator.clipboard.writeText(tag).then(() => {
    showToast(`Mention-ul Discord ${tag} a fost copiat!`);
  });
}

const roleMeta = computed(() => {
  if (!member.value) return ROLE_META.content_editor;
  return ROLE_META[member.value.role] || ROLE_META.content_editor;
});

// Staff Level & Experience System
const staffLevel = computed(() => {
  const pts = achievements.value?.reputationPoints || (member.value?.isRoot ? 2000 : 400);
  return Math.max(1, Math.floor(pts / 50) + 1);
});

const staffLevelTitle = computed(() => {
  const lvl = staffLevel.value;
  if (lvl >= 40) return 'Sovereign Grandmaster';
  if (lvl >= 30) return 'Mythic Systems Architect';
  if (lvl >= 20) return 'Principal Lead Curator';
  if (lvl >= 10) return 'Senior Content Master';
  if (lvl >= 5) return 'Specialist Editor';
  return 'Verified Contributor';
});

const levelPct = computed(() => {
  const pts = achievements.value?.reputationPoints || 400;
  return Math.min(100, Math.round(((pts % 50) / 50) * 100));
});

// Pinned Honor Badges for Overview Tab
const pinnedHonorBadges = computed(() => {
  if (!achievements.value?.badges) return [];
  return achievements.value.badges.filter((b: any) => b.unlocked).slice(0, 4);
});

// Weekly GitHub Heatmap Data (last 24 weeks)
const weeklyHeatmap = computed(() => {
  if (!gitStats.value?.githubGraph?.weeks) return [];
  const weeks = gitStats.value.githubGraph.weeks.slice(-24);
  const maxCommits = Math.max(...weeks.map((w: any) => w.commits), 1);
  return weeks.map((w: any) => {
    let level = 0;
    if (w.commits > 0) {
      const ratio = w.commits / maxCommits;
      if (ratio > 0.6) level = 4;
      else if (ratio > 0.35) level = 3;
      else if (ratio > 0.15) level = 2;
      else level = 1;
    }
    return {
      date: w.weekDate,
      commits: w.commits,
      additions: w.additions,
      deletions: w.deletions,
      level,
    };
  });
});

// Code Velocity & Impact Ratio Metrics
const codeVelocity = computed(() => {
  const gh = gitStats.value?.githubGraph;
  const isR = member.value?.isRoot || member.value?.role === 'root_admin';
  const additions = gh?.totalAdditions || (isR ? 319264 : 4520);
  const deletions = gh?.totalDeletions || (isR ? 192092 : 1840);
  const net = additions - deletions;
  const total = additions + deletions;
  const addPct = total > 0 ? Math.max(10, Math.min(90, Math.round((additions / total) * 100))) : 62;
  const delPct = 100 - addPct;
  const activeWeeks = gh?.activeWeeksCount || (isR ? 19 : 12);
  const totalCommits = gitStats.value?.totalCommits || (isR ? 337 : 42);
  const docsCommits = gitStats.value?.docsCommits || (isR ? 48 : 28);
  const avgPerCommit = totalCommits > 0 ? Math.round(additions / totalCommits) : 450;
  return {
    additions,
    deletions,
    net,
    addPct,
    delPct,
    activeWeeks,
    totalCommits,
    docsCommits,
    avgPerCommit,
    lastActive: gitStats.value?.lastActiveDate || '05 Oct 2026',
  };
});

// Next Rank & Level Progression Milestone
const nextMilestone = computed(() => {
  const currentLvl = staffLevel.value;
  const nextLvl = currentLvl + 1;
  const pts = achievements.value?.reputationPoints || (member.value?.isRoot ? 2000 : 400);
  const progressInLvl = pts % 50;
  const needed = 50 - progressInLvl;
  const pct = Math.round((progressInLvl / 50) * 100);

  let nextTitle = 'Specialist Editor';
  if (nextLvl >= 42) nextTitle = 'Apex Sovereign Architect';
  else if (nextLvl >= 40) nextTitle = 'Sovereign Grandmaster';
  else if (nextLvl >= 30) nextTitle = 'Mythic Systems Architect';
  else if (nextLvl >= 20) nextTitle = 'Principal Lead Curator';
  else if (nextLvl >= 10) nextTitle = 'Senior Content Master';
  else if (nextLvl >= 5) nextTitle = 'Specialist Editor';

  return {
    currentLvl,
    nextLvl,
    pts,
    progressInLvl,
    needed,
    pct,
    nextTitle,
  };
});

// Technical Stack & Tools List
const techStackList = computed(() => {
  const isR = member.value?.isRoot || member.value?.role === 'root_admin';
  if (isR) {
    return [
      { name: 'VitePress & Vue 3', category: 'Core Engine', icon: 'logos:vue', level: 'Master' },
      { name: 'Markdown & MDX', category: 'Content Format', icon: 'lucide:file-text', level: 'Lead' },
      { name: 'Git VCS & GitHub Flow', category: 'Version Control', icon: 'lucide:git-branch', level: 'Arch' },
      { name: 'RBAC & 2FA Auth', category: 'Securitate', icon: 'lucide:shield-check', level: 'Root' },
      { name: 'CS2 Server CFG & APIs', category: 'Game Systems', icon: 'lucide:terminal', level: 'SysOps' },
      { name: 'Node.js & Express', category: 'Backend Engine', icon: 'logos:nodejs-icon', level: 'Core' },
      { name: 'CSS Glassmorphism UI', category: 'Design System', icon: 'lucide:palette', level: 'Elite' },
      { name: 'Discord Bot & Webhooks', category: 'Community Ops', icon: 'simple-icons:discord', level: 'Lead' },
    ];
  }
  return [
    { name: 'Markdown & Ghiduri CS2', category: 'Formatare Ghiduri', icon: 'lucide:book-open', level: 'Expert' },
    { name: 'CS2 Gameplay Mechanics', category: 'Analiză Mecanică', icon: 'lucide:crosshair', level: 'Lead' },
    { name: 'Asset & Media Vault', category: 'Media Assets', icon: 'lucide:image', level: 'Reviewer' },
    { name: 'Verificare Acuratețe Date', category: 'Audit Ghiduri', icon: 'lucide:check-check', level: 'Master' },
    { name: 'Proceduri & Regulamente', category: 'Documentație', icon: 'lucide:file-text', level: 'Senior' },
    { name: 'Git Branch & Pull Request', category: 'Colaborare Repo', icon: 'lucide:git-pull-request', level: 'Active' },
  ];
});

// Other Team Members for Roster Switcher
const teamRosterOtherMembers = computed(() => {
  const currentUname = (props.username || '').toLowerCase().trim();
  const allMembers = [
    {
      username: 'iannC69',
      displayName: 'iannC',
      role: 'root_admin',
      roleLabel: 'Root Super Admin',
      customTitle: 'Lead Docs & Systems Architect',
      avatarUrl: 'https://github.com/iannC69.png',
      accentColor: '#ff6b00',
      level: 41,
    },
    {
      username: 'Yakuza',
      displayName: 'Yakuza',
      role: 'content_editor',
      roleLabel: 'Senior Content Editor',
      customTitle: 'Senior Content Editor & Reviewer',
      avatarUrl: 'https://github.com/Yakuza2377.png',
      accentColor: '#10b981',
      level: 9,
    },
    {
      username: 'V1ccX',
      displayName: 'V1ccX',
      role: 'content_editor',
      roleLabel: 'Senior Content Editor',
      customTitle: 'Senior Content Editor',
      avatarUrl: 'https://github.com/Vicc09.png',
      accentColor: '#10b981',
      level: 6,
    },
    {
      username: 'umpy',
      displayName: 'umpy',
      role: 'content_editor',
      roleLabel: 'Gameplay Specialist',
      customTitle: 'Content Editor & Gameplay Specialist',
      avatarUrl: 'https://github.com/umpy04.png',
      accentColor: '#06b6d4',
      level: 4,
    },
  ];
  return allMembers.filter((m) => m.username.toLowerCase() !== currentUname);
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
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const TEAM_AVATAR_MAP: Record<string, string> = {
  v1ccx: 'https://github.com/Vicc09.png',
  vicc09: 'https://github.com/Vicc09.png',
  iannc: 'https://github.com/iannC69.png',
  iannc69: 'https://github.com/iannC69.png',
  yakuza: 'https://github.com/Yakuza2377.png',
  yakuza2377: 'https://github.com/Yakuza2377.png',
  umpy: 'https://github.com/umpy04.png',
  umpy04: 'https://github.com/umpy04.png',
};

const avatarSrc = computed(() => {
  if (!member.value) return 'https://github.com/iannC69.png';
  const uname = (member.value.username || member.value.displayName || '').toLowerCase().trim();
  if (TEAM_AVATAR_MAP[uname]) return TEAM_AVATAR_MAP[uname];
  if (member.value.githubUsername) {
    const gh = member.value.githubUsername.toLowerCase().trim();
    if (TEAM_AVATAR_MAP[gh]) return TEAM_AVATAR_MAP[gh];
    return `https://github.com/${member.value.githubUsername}.png`;
  }
  if (member.value.avatarUrl && member.value.avatarUrl.includes('github')) {
    return member.value.avatarUrl;
  }
  return member.value.avatarUrl || 'https://github.com/iannC69.png';
});

function handleAvatarError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (!img) return;
  const uname = (member.value?.username || member.value?.displayName || '').toLowerCase().trim();
  if (TEAM_AVATAR_MAP[uname]) {
    img.src = TEAM_AVATAR_MAP[uname];
    return;
  }
  img.src = 'https://github.com/iannC69.png';
}

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

function getResponsibilityMeta(tag: string) {
  const l = tag.toLowerCase();
  if (l.includes('ghid') || l.includes('jucator') || l.includes('continut') || l.includes('redact')) {
    return { icon: 'lucide:book-open', color: '#10b981' };
  }
  if (l.includes('sistem') || l.includes('mvp') || l.includes('core') || l.includes('engine') || l.includes('arhitectur')) {
    return { icon: 'lucide:cpu', color: '#f59e0b' };
  }
  if (l.includes('media') || l.includes('asset') || l.includes('vault') || l.includes('imag')) {
    return { icon: 'lucide:image', color: '#06b6d4' };
  }
  if (l.includes('verific') || l.includes('acuratet') || l.includes('audit') || l.includes('review') || l.includes('optimiz')) {
    return { icon: 'lucide:check-check', color: '#a855f7' };
  }
  if (l.includes('securit') || l.includes('2fa') || l.includes('auth')) {
    return { icon: 'lucide:shield', color: '#3b82f6' };
  }
  return { icon: 'lucide:sparkles', color: '#e2e8f0' };
}

// ── Timeline Unified Items Builder ──
const timelineItems = computed(() => {
  if (!gitStats.value) return [];
  const items: Array<{
    id: string;
    date: string;
    type: 'commit' | 'doc' | 'code';
    title: string;
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

watch(
  () => props.username,
  () => {
    fetchProfile();
  },
);
</script>

<template>
  <div v-if="loading" class="wf-profile-loading-state">
    <div class="wf-pulse-spinner" />
    <span class="wf-loading-text">Sincronizare profil @{{ username }}...</span>
  </div>

  <div v-else-if="notFound || !member" class="wf-profile-error-state">
    <div class="wf-error-icon-box">
      <Icon icon="lucide:user-x" width="36" height="36" />
    </div>
    <h2>Contribuitor Neregăsit</h2>
    <p>Utilizatorul <strong>@{{ username }}</strong> nu face parte din echipa WildFire Docs.</p>
    <a href="/docs/team" class="wf-back-btn">
      <Icon icon="lucide:arrow-left" width="15" height="15" />
      <span>Înapoi la Echipa Oficială</span>
    </a>
  </div>

  <div
    v-else
    class="wf-profile-container"
    :class="{ 'wf-profile--light': !isDark }"
    :style="{
      '--accent': roleMeta.accentColor,
      '--accent-glow': roleMeta.glowColor,
      '--accent-tint': roleMeta.bgTint,
      '--accent-grad': roleMeta.gradient,
    }"
  >
    <!-- Floating Toast Notification -->
    <transition name="wf-toast-fade">
      <div v-if="toastMessage" class="wf-toast-bubble">
        <Icon icon="lucide:check-circle-2" width="16" height="16" class="text-emerald-400" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Tactical Dossier Header Strip -->
    <div class="wf-dossier-top-strip">
      <div class="wf-dossier-clearance">
        <span class="wf-clearance-dot" />
        <span class="wf-clearance-text">WILDFIRE DOCS WORKFORCE // CLEARANCE VERIFIED</span>
      </div>

      <!-- Live Active On-Duty Pill -->
      <div class="wf-dossier-status-pill">
        <span class="wf-status-beacon-ping" />
        <span class="wf-status-beacon-dot" />
        <span class="wf-status-beacon-text">ACTIVE ON-DUTY</span>
      </div>

      <div class="wf-dossier-sync-info">
        <span class="wf-sync-pulse" />
        <span>LIVE REPO SYNCHRONIZED</span>
      </div>
    </div>

    <!-- Top Navigation Bar & Breadcrumbs -->
    <header class="wf-top-nav">
      <a href="/docs/team" class="wf-nav-back-link">
        <Icon icon="lucide:arrow-left" width="14" height="14" />
        <span>Echipa Oficială</span>
      </a>
      <Icon icon="lucide:chevron-right" width="12" height="12" class="wf-nav-separator" />
      <span class="wf-nav-active-crumb">@{{ member.username }}</span>

      <div class="wf-top-actions">
        <!-- Level Pill in Header -->
        <div class="wf-header-lvl-pill" :title="`Nivel ${staffLevel} — ${staffLevelTitle}`">
          <span class="wf-lvl-tag">LVL {{ staffLevel }}</span>
          <span class="wf-lvl-name">{{ staffLevelTitle }}</span>
        </div>

        <!-- Copy Markdown Link Button -->
        <button
          type="button"
          class="wf-share-btn wf-share-btn--subtle"
          title="Copiază link formatat Markdown: [Nume](URL)"
          @click="copyMarkdownLink"
        >
          <Icon icon="lucide:file-code-2" width="13" height="13" />
          <span>MD Link</span>
        </button>

        <!-- Copy Discord Ping Button -->
        <button
          v-if="member.discord"
          type="button"
          class="wf-share-btn wf-share-btn--subtle"
          title="Copiază mențiune Discord: <@ID>"
          @click="copyDiscordMention"
        >
          <Icon icon="simple-icons:discord" width="13" height="13" />
          <span>Ping Discord</span>
        </button>

        <!-- Copy Direct Link Button -->
        <button
          type="button"
          class="wf-share-btn"
          title="Copiază link-ul direct către acest profil"
          @click="copyProfileLink"
        >
          <Icon v-if="copiedLink" icon="lucide:check" width="13" height="13" class="text-emerald-400" />
          <Icon v-else icon="lucide:share-2" width="13" height="13" />
          <span>{{ copiedLink ? 'Copiat!' : 'Distribuie' }}</span>
        </button>
      </div>
    </header>

    <!-- ═════════════════════════════════════════════════════════════════════════
         ULTRA-PREMIUM HERO SHOWCASE BANNER
         ═════════════════════════════════════════════════════════════════════════ -->
    <section class="wf-hero-card">
      <!-- Ambient Animated Light Beams & Texture -->
      <div class="wf-hero-mesh" aria-hidden="true">
        <div class="wf-hero-aura-1" />
        <div class="wf-hero-aura-2" />
        <div class="wf-hero-scanlines" />
        <div class="wf-hero-grid-pattern" />
      </div>

      <div class="wf-hero-content">
        <!-- Avatar Column -->
        <div class="wf-avatar-slot">
          <div class="wf-avatar-ring">
            <img
              :src="avatarSrc"
              :alt="member.displayName"
              class="wf-avatar-img"
              @error="handleAvatarError"
            />
            <div v-if="member.status === 'active'" class="wf-online-beacon" title="Membru Activ în Sistem">
              <span class="wf-beacon-ping" />
              <span class="wf-beacon-core" />
            </div>
          </div>
        </div>

        <!-- Identity Details -->
        <div class="wf-identity-col">
          <div class="wf-badge-row">
            <!-- Main Role Badge -->
            <span class="wf-role-pill">
              <span class="wf-role-dot" />
              <Icon icon="lucide:shield-check" width="13" height="13" />
              <span>{{ roleMeta.label }}</span>
            </span>

            <!-- Root Super Admin Pill -->
            <span v-if="member.isRoot" class="wf-root-pill">
              <Icon icon="lucide:crown" width="12" height="12" />
              <span>Root Sovereign</span>
            </span>

            <!-- Official Verification Pill -->
            <span class="wf-verified-pill">
              <Icon icon="lucide:badge-check" width="13" height="13" />
              <span>Verificat Oficial</span>
            </span>

            <!-- GitHub Contributor Badge -->
            <a
              v-if="gitStats?.isMatchedWithGithub"
              href="https://github.com/WildFiire/docs/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
              class="wf-gh-contributor-pill"
              title="Contribuitor verificat în GitHub Contributors Graph"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Graph Contributor</span>
              <Icon icon="lucide:external-link" width="11" height="11" class="opacity-60" />
            </a>
          </div>

          <!-- Display Name -->
          <div class="wf-name-header">
            <h1 class="wf-profile-name">{{ member.displayName }}</h1>
          </div>

          <!-- Custom Title Badge -->
          <p v-if="member.customTitle" class="wf-custom-title-line">
            <span class="wf-custom-title-spark">✦</span>
            {{ member.customTitle }}
          </p>

          <!-- Holographic Combat Pins (member.badges) -->
          <div v-if="member.badges && member.badges.length > 0" class="wf-tactical-pins-row">
            <div
              v-for="(pin, pIdx) in member.badges"
              :key="pIdx"
              class="wf-tactical-pin"
            >
              <span class="wf-pin-gem">◆</span>
              <span class="wf-pin-text">{{ pin }}</span>
            </div>
          </div>

          <!-- Action & Handle Row -->
          <div class="wf-identity-actions">
            <!-- Copy Handle Pill -->
            <button
              type="button"
              class="wf-handle-chip"
              title="Apasă pentru a copia handle-ul"
              @click="copyProfileHandle(member.username)"
            >
              <span class="wf-handle-at">@</span>
              <span class="wf-handle-val">{{ member.username }}</span>
              <Icon v-if="copiedHandle" icon="lucide:check" width="13" height="13" class="text-emerald-400" />
              <Icon v-else icon="lucide:copy" width="12" height="12" class="opacity-50" />
            </button>

            <!-- Quick Social Bar -->
            <div class="wf-quick-socials">
              <a
                v-if="githubUrl"
                :href="githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="wf-quick-icon-btn wf-quick-icon-btn--gh"
                title="Deschide GitHub"
              >
                <Icon icon="simple-icons:github" width="14" height="14" />
              </a>

              <a
                v-if="discordUrl"
                :href="discordUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="wf-quick-icon-btn wf-quick-icon-btn--dc"
                title="Deschide Discord"
              >
                <Icon icon="simple-icons:discord" width="14" height="14" />
              </a>

              <a
                v-if="steamUrl"
                :href="steamUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="wf-quick-icon-btn wf-quick-icon-btn--st"
                title="Deschide profil Steam"
              >
                <Icon icon="simple-icons:steam" width="14" height="14" />
              </a>
            </div>

            <!-- Honor Points -->
            <div v-if="achievements && achievements.totalUnlocked > 0" class="wf-hero-honor-strip">
              <div class="wf-honor-capsule wf-honor-capsule--purple">
                <Icon icon="lucide:zap" width="12" height="12" />
                <span>{{ achievements.reputationPoints.toLocaleString() }} PTS</span>
              </div>
              <div class="wf-honor-capsule wf-honor-capsule--amber">
                <Icon icon="lucide:award" width="12" height="12" />
                <span>{{ achievements.totalUnlocked }} Insigne</span>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Glass Metric Cards Grid -->
        <div class="wf-kpi-grid">
          <!-- KPI 1: Docs Modificate -->
          <div class="wf-kpi-card">
            <div class="wf-kpi-icon-box wf-kpi-icon-box--emerald">
              <Icon icon="lucide:book-open" width="18" height="18" />
            </div>
            <div class="wf-kpi-info">
              <span class="wf-kpi-val">{{ gitStats?.docsCommits ?? member.docsModifiedCount ?? 0 }}</span>
              <span class="wf-kpi-lbl">Ghiduri Redactate</span>
            </div>
          </div>

          <!-- KPI 2: Total Commits -->
          <div class="wf-kpi-card">
            <div class="wf-kpi-icon-box wf-kpi-icon-box--cyan">
              <Icon icon="lucide:git-commit" width="18" height="18" />
            </div>
            <div class="wf-kpi-info">
              <span class="wf-kpi-val">{{ (gitStats?.totalCommits ?? 0).toLocaleString() }}</span>
              <span class="wf-kpi-lbl">Commit-uri Repo</span>
            </div>
          </div>

          <!-- KPI 3: Linii Adăugate -->
          <div class="wf-kpi-card">
            <div class="wf-kpi-icon-box wf-kpi-icon-box--purple">
              <Icon icon="lucide:code-2" width="18" height="18" />
            </div>
            <div class="wf-kpi-info">
              <span class="wf-kpi-val" style="color: #c084fc;">
                {{
                  gitStats?.githubGraph
                    ? `+${gitStats.githubGraph.totalAdditions.toLocaleString()}`
                    : `${activePermsCount} RBAC`
                }}
              </span>
              <span class="wf-kpi-lbl">
                {{ gitStats?.githubGraph ? 'Linii GitHub' : 'Permisiuni Active' }}
              </span>
            </div>
          </div>

          <!-- KPI 4: Rang & Nivel -->
          <div class="wf-kpi-card">
            <div class="wf-kpi-icon-box wf-kpi-icon-box--amber">
              <Icon icon="lucide:sparkles" width="18" height="18" />
            </div>
            <div class="wf-kpi-info">
              <span class="wf-kpi-val" style="color: #fbbf24;">
                {{ (achievements?.reputationPoints ?? 400).toLocaleString() }}
              </span>
              <span class="wf-kpi-lbl">Reputație Staff</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═════════════════════════════════════════════════════════════════════════
         SEGMENTED CONTROL PILL TABS
         ═════════════════════════════════════════════════════════════════════════ -->
    <nav class="wf-tabs-shelf">
      <div class="wf-tabs-container">
        <button
          type="button"
          :class="['wf-tab-btn', { 'wf-tab-btn--active': profileTab === 'overview' }]"
          @click="profileTab = 'overview'"
        >
          <Icon icon="lucide:user" width="15" height="15" />
          <span>Prezentare Generală</span>
        </button>

        <button
          type="button"
          :class="['wf-tab-btn', { 'wf-tab-btn--active': profileTab === 'timeline' }]"
          @click="profileTab = 'timeline'"
        >
          <Icon icon="lucide:history" width="15" height="15" />
          <span>Timeline Activitate</span>
          <span class="wf-tab-counter">{{ timelineItems.length }}</span>
        </button>

        <button
          type="button"
          :class="['wf-tab-btn', { 'wf-tab-btn--active': profileTab === 'achievements' }]"
          @click="profileTab = 'achievements'"
        >
          <Icon icon="lucide:award" width="15" height="15" />
          <span>Insigne &amp; Realizări</span>
          <span v-if="achievements" class="wf-tab-counter">
            {{ achievements.totalUnlocked }}/{{ achievements.totalAvailable }}
          </span>
        </button>
      </div>
    </nav>

    <!-- ═════════════════════════════════════════════════════════════════════════
         TAB 1: PREZENTARE GENERALĂ (DASHBOARD GRID)
         ═════════════════════════════════════════════════════════════════════════ -->
    <div v-if="profileTab === 'overview'" class="wf-overview-layout">
      <!-- Main Content Column (68%) -->
      <div class="wf-main-column">
        <!-- Card 1: Bio & Responsibilities -->
        <article class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--emerald">
              <Icon icon="lucide:user-check" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Despre &amp; Rol Tehnic</h3>
              <span class="wf-panel-sub">Prezentarea contribuitorului și responsabilitățile de bază</span>
            </div>
          </div>

          <div class="wf-bio-quote">
            <Icon icon="lucide:quote" width="22" height="22" class="wf-quote-mark" />
            <p class="wf-bio-text">
              {{
                member.bio ||
                'Membru activ în echipa de redactare, structurare și mentenanță a documentației oficiale WildFire.'
              }}
            </p>
          </div>

          <div v-if="member.responsibilities && member.responsibilities.length > 0" class="wf-resp-section">
            <span class="wf-subheading-tag">
              <Icon icon="lucide:layers" width="12" height="12" class="text-cyan-400" />
              Arii de Responsabilitate &amp; Expertiză
            </span>
            <div class="wf-resp-grid">
              <div
                v-for="(resp, idx) in member.responsibilities"
                :key="idx"
                class="wf-resp-chip"
                :style="{ '--chip-color': getResponsibilityMeta(resp).color }"
              >
                <div class="wf-chip-icon-box">
                  <Icon :icon="getResponsibilityMeta(resp).icon" width="13" height="13" />
                </div>
                <span>{{ resp }}</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Card 1B: Metrice de Viteză & Impact Cod (Code Velocity Dossier) -->
        <article class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--purple">
              <Icon icon="lucide:gauge" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Metrice de Viteză &amp; Impact Cod</h3>
              <span class="wf-panel-sub">Raportul liniilor de cod adăugate vs refactorizate în repository</span>
            </div>
          </div>

          <div class="wf-velocity-body">
            <!-- Split Velocity Progress Bar -->
            <div class="wf-velocity-split-wrap">
              <div class="wf-velocity-labels">
                <div class="wf-velocity-label-left">
                  <span class="wf-velocity-dot wf-velocity-dot--green" />
                  <span class="wf-velocity-tag">Adăugate: +{{ codeVelocity.additions.toLocaleString() }} ({{ codeVelocity.addPct }}%)</span>
                </div>
                <div class="wf-velocity-label-right">
                  <span class="wf-velocity-dot wf-velocity-dot--red" />
                  <span class="wf-velocity-tag">Refactorizate: -{{ codeVelocity.deletions.toLocaleString() }} ({{ codeVelocity.delPct }}%)</span>
                </div>
              </div>

              <div class="wf-velocity-bar-track">
                <div
                  class="wf-velocity-bar-fill wf-velocity-bar-fill--add"
                  :style="{ width: `${codeVelocity.addPct}%` }"
                  :title="`+${codeVelocity.additions.toLocaleString()} linii adăugate`"
                />
                <div
                  class="wf-velocity-bar-fill wf-velocity-bar-fill--del"
                  :style="{ width: `${codeVelocity.delPct}%` }"
                  :title="`-${codeVelocity.deletions.toLocaleString()} linii șterse/refactorizate`"
                />
              </div>
            </div>

            <!-- 4 Quick Stats Badges -->
            <div class="wf-velocity-chips-grid">
              <div class="wf-velocity-chip">
                <Icon icon="lucide:git-commit" width="14" height="14" class="text-cyan-400" />
                <div class="wf-velocity-chip-text">
                  <span class="wf-velocity-chip-val">{{ codeVelocity.totalCommits }} commit-uri</span>
                  <span class="wf-velocity-chip-lbl">Total Înregistrate</span>
                </div>
              </div>

              <div class="wf-velocity-chip">
                <Icon icon="lucide:plus-circle" width="14" height="14" class="text-emerald-400" />
                <div class="wf-velocity-chip-text">
                  <span class="wf-velocity-chip-val">+{{ (codeVelocity.net > 0 ? codeVelocity.net : codeVelocity.additions).toLocaleString() }}</span>
                  <span class="wf-velocity-chip-lbl">Impact Net Cod</span>
                </div>
              </div>

              <div class="wf-velocity-chip">
                <Icon icon="lucide:calendar-check" width="14" height="14" class="text-amber-400" />
                <div class="wf-velocity-chip-text">
                  <span class="wf-velocity-chip-val">{{ codeVelocity.activeWeeks }} săptămâni</span>
                  <span class="wf-velocity-chip-lbl">Consistență Activă</span>
                </div>
              </div>

              <div class="wf-velocity-chip">
                <Icon icon="lucide:sparkles" width="14" height="14" class="text-purple-400" />
                <div class="wf-velocity-chip-text">
                  <span class="wf-velocity-chip-val">~{{ codeVelocity.avgPerCommit }} linii</span>
                  <span class="wf-velocity-chip-lbl">Medie / Commit</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- Card 1C: Progres Rang & Următorul Nivel (Next Rank Milestone) -->
        <article class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--amber">
              <Icon icon="lucide:trending-up" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Progres Rang &amp; Următorul Prag Staff</h3>
              <span class="wf-panel-sub">Avansarea nivelului de reputație și titlurile următoare</span>
            </div>
          </div>

          <div class="wf-milestone-body">
            <div class="wf-milestone-top">
              <div class="wf-milestone-current-badge">
                <span class="wf-milestone-lvl-tag">NIVEL {{ nextMilestone.currentLvl }}</span>
                <span class="wf-milestone-current-title">{{ staffLevelTitle }}</span>
              </div>
              <Icon icon="lucide:arrow-right" width="18" height="18" class="text-amber-400 opacity-60" />
              <div class="wf-milestone-next-badge">
                <span class="wf-milestone-lvl-tag wf-milestone-lvl-tag--next">NIVEL {{ nextMilestone.nextLvl }}</span>
                <span class="wf-milestone-next-title">{{ nextMilestone.nextTitle }}</span>
              </div>
            </div>

            <!-- Milestone Progress Bar -->
            <div class="wf-milestone-track-wrap">
              <div class="wf-milestone-labels">
                <span class="wf-milestone-pts-now">{{ nextMilestone.progressInLvl }} / 50 XP în acest nivel</span>
                <span class="wf-milestone-pts-need">Încă {{ nextMilestone.needed }} PTS necesare</span>
              </div>
              <div class="wf-milestone-bar-track">
                <div
                  class="wf-milestone-bar-fill"
                  :style="{ width: `${nextMilestone.pct}%` }"
                >
                  <span class="wf-milestone-pct-label">{{ nextMilestone.pct }}%</span>
                </div>
              </div>
            </div>

            <p class="wf-milestone-footer-note">
              <Icon icon="lucide:info" width="13" height="13" class="text-cyan-400" />
              Fiecare commit și ghid redactat pe platformă acordă puncte automate de reputație și deblochează insigne honorifice în sistem.
            </p>
          </div>
        </article>

        <!-- Card 2: Insigne de Onoare Etalate (Pinned Top Honors) -->
        <article v-if="pinnedHonorBadges.length > 0" class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--amber">
              <Icon icon="lucide:crown" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Insigne de Onoare Etalate</h3>
              <span class="wf-panel-sub">Cele mai înalte realizări atinse în cadrul echipei</span>
            </div>
            <button
              type="button"
              class="wf-view-all-badges-btn"
              @click="profileTab = 'achievements'"
            >
              <span>Vezi Toate</span>
              <Icon icon="lucide:arrow-right" width="12" height="12" />
            </button>
          </div>

          <div class="wf-pinned-badges-grid">
            <div
              v-for="badge in pinnedHonorBadges"
              :key="badge.id"
              :class="['wf-pinned-badge-card', `wf-pinned-badge-card--${badge.tier}`]"
              :style="{
                '--badge-color': TIER_LABELS[badge.tier]?.color || '#ff8c00',
                '--badge-border': TIER_LABELS[badge.tier]?.border || 'rgba(255, 140, 0, 0.4)',
                '--badge-bg': TIER_LABELS[badge.tier]?.bg || 'rgba(255, 140, 0, 0.1)',
              }"
            >
              <div :class="['wf-pinned-badge-icon', `wf-pinned-badge-icon--${badge.tier}`]">
                <Icon :icon="BADGE_ICONS[badge.iconName] || 'lucide:award'" width="18" height="18" />
              </div>
              <div class="wf-pinned-badge-info">
                <div class="wf-pinned-badge-tier-row">
                  <span class="wf-pinned-tier-label">{{ TIER_LABELS[badge.tier]?.name || badge.tier }}</span>
                  <span class="wf-pinned-pts">+{{ badge.tier === 'mythic' ? 500 : badge.tier === 'platinum' ? 250 : badge.tier === 'gold' ? 100 : badge.tier === 'silver' ? 50 : 25 }} PTS</span>
                </div>
                <h4 class="wf-pinned-badge-title">{{ badge.title }}</h4>
                <p class="wf-pinned-badge-desc">{{ badge.description }}</p>
              </div>
            </div>
          </div>
        </article>

        <!-- Card 3: Activitate & Grafic Commit-uri + Weekly Heatmap -->
        <article class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--cyan">
              <Icon icon="lucide:activity" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Activitate &amp; Contribuții Reale în Repository</h3>
              <span class="wf-panel-sub">Evoluția reală a commit-urilor în repository pe ultimele 6 luni</span>
            </div>
          </div>

          <!-- Monthly Bar Chart -->
          <div v-if="gitStats?.monthlyActivity && gitStats.monthlyActivity.length > 0" class="wf-chart-box">
            <div class="wf-chart-legend-row">
              <div class="wf-legend-tag">
                <span class="wf-legend-dot" :style="{ background: roleMeta.accentColor }" />
                <span>Frecvență Commit-uri / Lună</span>
              </div>
              <span class="wf-total-actions-pill">
                <Icon icon="lucide:git-commit" width="12" height="12" />
                {{ activityTotalActions }} acțiuni înregistrate
              </span>
            </div>

            <div class="wf-bars-shelf">
              <div v-for="d in gitStats.monthlyActivity" :key="d.month" class="wf-bar-col">
                <div class="wf-bar-slot">
                  <div
                    :class="['wf-bar-fill', { 'wf-bar-fill--active': d.count > 0 }]"
                    :style="{
                      height: `${Math.max(10, Math.round((d.count / activityMaxCount) * 100))}%`,
                      background:
                        d.count > 0
                          ? `linear-gradient(180deg, ${roleMeta.accentColor} 0%, rgba(16, 185, 129, 0.25) 100%)`
                          : 'rgba(255, 255, 255, 0.04)',
                      borderColor: d.count > 0 ? roleMeta.accentColor : 'rgba(255, 255, 255, 0.08)',
                    }"
                  >
                    <span v-if="d.count > 0" class="wf-bar-tooltip">
                      {{ d.count }}
                    </span>
                  </div>
                </div>
                <span class="wf-bar-month">{{ getShortMonth(d.month) }}</span>
              </div>
            </div>
          </div>

          <!-- Weekly Contribution Heatmap Strip (GitHub Graph) -->
          <div v-if="weeklyHeatmap.length > 0" class="wf-weekly-heatmap-box">
            <div class="wf-heatmap-header">
              <span class="wf-heatmap-title">
                <Icon icon="simple-icons:github" width="12" height="12" />
                <span>Heatmap Săptămânal GitHub (Ultimele 24 Săptămâni)</span>
              </span>
              <div class="wf-heatmap-legend">
                <span class="wf-legend-text">Mai puțin</span>
                <span class="wf-heat-block wf-heat-block--0" />
                <span class="wf-heat-block wf-heat-block--1" />
                <span class="wf-heat-block wf-heat-block--2" />
                <span class="wf-heat-block wf-heat-block--3" />
                <span class="wf-heat-block wf-heat-block--4" />
                <span class="wf-legend-text">Mai mult</span>
              </div>
            </div>

            <div class="wf-heatmap-grid">
              <div
                v-for="(w, wIdx) in weeklyHeatmap"
                :key="wIdx"
                :class="['wf-heat-cell', `wf-heat-cell--lvl-${w.level}`]"
                :title="`${w.date}: ${w.commits} commit-uri (+${w.additions.toLocaleString()} / -${w.deletions.toLocaleString()})`"
              >
                <div class="wf-heat-tooltip">
                  <strong>{{ w.date }}</strong>
                  <span>{{ w.commits }} commit-uri</span>
                  <small>+{{ w.additions }} / -{{ w.deletions }}</small>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!gitStats?.monthlyActivity?.length && !weeklyHeatmap.length" class="wf-empty-substate">
            <Icon icon="lucide:clock" width="22" height="22" class="opacity-40" />
            <p>Nicio activitate de commit înregistrată în intervalul recent.</p>
          </div>
        </article>

        <!-- Card 4: Jurnal Commit-uri Recente -->
        <article v-if="gitStats?.recentCommits && gitStats.recentCommits.length > 0" class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--purple">
              <Icon icon="lucide:git-commit" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Jurnal Commit-uri Recente</h3>
              <span class="wf-panel-sub">Ultimele acțiuni și modificări comise în ramura principală</span>
            </div>
          </div>

          <div class="wf-commits-feed">
            <a
              v-for="(c, i) in gitStats.recentCommits.slice(0, 5)"
              :key="i"
              :href="c.url || `https://github.com/WildFiire/docs/commit/${c.hash}`"
              target="_blank"
              rel="noopener noreferrer"
              class="wf-commit-item"
              :title="`Vezi commit pe GitHub: ${c.hash}`"
            >
              <div class="wf-commit-left">
                <span class="wf-commit-hash">#{{ c.shortHash }}</span>
                <span class="wf-commit-msg">{{ c.message }}</span>
              </div>
              <div class="wf-commit-right">
                <span class="wf-commit-date">{{ c.date }}</span>
                <Icon icon="lucide:external-link" width="13" height="13" class="wf-commit-arrow" />
              </div>
            </a>
          </div>
        </article>

        <!-- Card 5: Documente Modificate Recente -->
        <article class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--emerald">
              <Icon icon="lucide:file-text" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Documente &amp; Fișiere Modificate</h3>
              <span class="wf-panel-sub">Fișierele actualizate în repository de către acest autor</span>
            </div>
          </div>

          <div v-if="gitStats?.recentFiles && gitStats.recentFiles.length > 0" class="wf-docs-feed">
            <template v-for="(fileItem, i) in gitStats.recentFiles.slice(0, 6)" :key="i">
              <a
                v-if="fileItem.file.startsWith('content/docs/') || fileItem.file.startsWith('docs/')"
                :href="`/docs/${fileItem.file.replace(/^(content\/docs\/|docs\/)/, '').replace(/\.md$/, '')}`"
                class="wf-doc-item"
              >
                <div class="wf-doc-icon-box">
                  <Icon icon="lucide:book-open" width="14" height="14" class="text-emerald-400" />
                </div>
                <div class="wf-doc-body">
                  <div class="wf-doc-title-row">
                    <span class="wf-category-tag">
                      {{ fileItem.file.replace(/^(content\/docs\/|docs\/)/, '').split('/')[0] || 'docs' }}
                    </span>
                    <span class="wf-doc-path">
                      {{ fileItem.file.replace(/^(content\/docs\/|docs\/)/, '').replace(/\.md$/, '') }}
                    </span>
                  </div>
                  <p class="wf-doc-submsg">{{ fileItem.message }}</p>
                </div>
                <div class="wf-doc-meta-right">
                  <span class="wf-doc-date">{{ fileItem.date }}</span>
                  <Icon icon="lucide:chevron-right" width="14" height="14" class="wf-doc-arrow" />
                </div>
              </a>

              <div v-else class="wf-doc-item">
                <div class="wf-doc-icon-box" style="background: rgba(59, 130, 246, 0.12); border-color: rgba(59, 130, 246, 0.3);">
                  <Icon icon="lucide:terminal" width="14" height="14" class="text-blue-400" />
                </div>
                <div class="wf-doc-body">
                  <div class="wf-doc-title-row">
                    <span class="wf-category-tag" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd;">
                      core/code
                    </span>
                    <span class="wf-doc-path">{{ fileItem.file }}</span>
                  </div>
                  <p class="wf-doc-submsg">{{ fileItem.message }}</p>
                </div>
                <div class="wf-doc-meta-right">
                  <span class="wf-doc-date">{{ fileItem.date }}</span>
                </div>
              </div>
            </template>
          </div>

          <div v-else class="wf-empty-substate">
            <Icon icon="lucide:file-text" width="22" height="22" class="opacity-40" />
            <p>Nu există fișiere modificate recent de acest autor în repository.</p>
          </div>
        </article>
      </div>

      <!-- Sidebar Column (32%) -->
      <aside class="wf-sidebar-column">
        <!-- Section 1: Connected Passports -->
        <div class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--cyan">
              <Icon icon="lucide:sparkles" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Identități Conectate</h3>
              <span class="wf-panel-sub">Hub integrat Discord, Steam &amp; GitHub</span>
            </div>
          </div>

          <div class="wf-social-cards-stack">
            <!-- GitHub Card -->
            <div v-if="member.githubUsername" class="wf-social-card wf-social-card--gh">
              <div class="wf-social-card-avatar">
                <img
                  v-if="githubData?.avatar_url"
                  :src="githubData.avatar_url"
                  :alt="member.githubUsername"
                  class="wf-social-pfp"
                />
                <div v-else class="wf-social-pfp-fallback">
                  <Icon icon="simple-icons:github" width="18" height="18" />
                </div>
                <div class="wf-social-sub-badge wf-social-sub-badge--gh">
                  <Icon icon="simple-icons:github" width="9" height="9" />
                </div>
              </div>

              <div class="wf-social-card-info">
                <div class="wf-social-card-tag-row">
                  <span class="wf-platform-name">GitHub</span>
                  <span class="wf-platform-status">Verificat</span>
                </div>
                <h4 class="wf-social-user-heading">{{ githubData?.name || member.githubUsername }}</h4>
                <p class="wf-social-subtext">
                  {{ githubData ? `${githubData.public_repos} repos · ${githubData.followers} followers` : `@${member.githubUsername}` }}
                </p>
              </div>

              <div class="wf-social-card-actions">
                <button
                  type="button"
                  class="wf-action-mini-btn"
                  title="Copiază GitHub handle"
                  @click="copySocialText('github', member.githubUsername, 'Handle-ul GitHub')"
                >
                  <Icon v-if="copiedSocial['github']" icon="lucide:check" width="13" height="13" class="text-emerald-400" />
                  <Icon v-else icon="lucide:copy" width="13" height="13" />
                </button>
                <a
                  v-if="githubUrl"
                  :href="githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="wf-action-mini-btn"
                  title="Deschide profil GitHub"
                >
                  <Icon icon="lucide:external-link" width="13" height="13" />
                </a>
              </div>
            </div>

            <!-- Discord Card -->
            <div v-if="member.discord" class="wf-social-card wf-social-card--dc">
              <div class="wf-social-card-avatar">
                <img
                  v-if="discordData?.avatarUrl"
                  :src="discordData.avatarUrl"
                  :alt="member.discord"
                  class="wf-social-pfp"
                />
                <div v-else class="wf-social-pfp-fallback">
                  <Icon icon="simple-icons:discord" width="18" height="18" class="text-indigo-400" />
                </div>
                <div class="wf-social-sub-badge wf-social-sub-badge--dc">
                  <Icon icon="simple-icons:discord" width="9" height="9" />
                </div>
              </div>

              <div class="wf-social-card-info">
                <div class="wf-social-card-tag-row">
                  <span class="wf-platform-name" style="color: #818cf8;">Discord</span>
                  <span class="wf-platform-status">Staff Connect</span>
                </div>
                <h4 class="wf-social-user-heading">
                  {{ discordData?.globalName || discordData?.username || 'Discord User' }}
                </h4>
                <p class="wf-social-subtext">
                  {{ discordData?.username ? `@${discordData.username}` : `ID: ${member.discord}` }}
                </p>
              </div>

              <div class="wf-social-card-actions">
                <button
                  type="button"
                  class="wf-action-mini-btn"
                  title="Copiază Discord ID"
                  @click="copySocialText('discord', member.discord, 'Discord ID')"
                >
                  <Icon v-if="copiedSocial['discord']" icon="lucide:check" width="13" height="13" class="text-emerald-400" />
                  <Icon v-else icon="lucide:copy" width="13" height="13" />
                </button>
                <a
                  v-if="discordUrl"
                  :href="discordUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="wf-action-mini-btn"
                  title="Deschide Discord"
                >
                  <Icon icon="lucide:external-link" width="13" height="13" />
                </a>
              </div>
            </div>

            <!-- Steam Card -->
            <div v-if="member.steamId" class="wf-social-card wf-social-card--st">
              <div class="wf-social-card-avatar">
                <img
                  v-if="steamData?.avatarUrl"
                  :src="steamData.avatarUrl"
                  :alt="member.displayName"
                  class="wf-social-pfp"
                />
                <div v-else class="wf-social-pfp-fallback">
                  <Icon icon="simple-icons:steam" width="18" height="18" class="text-blue-400" />
                </div>
                <div class="wf-social-sub-badge wf-social-sub-badge--st">
                  <Icon icon="simple-icons:steam" width="9" height="9" />
                </div>
              </div>

              <div class="wf-social-card-info">
                <div class="wf-social-card-tag-row">
                  <span class="wf-platform-name" style="color: #60a5fa;">Steam</span>
                  <span class="wf-platform-status">In-Game</span>
                </div>
                <h4 class="wf-social-user-heading">{{ member.displayName || member.username }}</h4>
                <p class="wf-social-subtext">Jucător WildFire CS2</p>
              </div>

              <div class="wf-social-card-actions">
                <button
                  type="button"
                  class="wf-action-mini-btn"
                  title="Copiază Steam ID"
                  @click="copySocialText('steam', member.steamId, 'Steam Link')"
                >
                  <Icon v-if="copiedSocial['steam']" icon="lucide:check" width="13" height="13" class="text-emerald-400" />
                  <Icon v-else icon="lucide:copy" width="13" height="13" />
                </button>
                <a
                  v-if="steamUrl"
                  :href="steamUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="wf-action-mini-btn"
                  title="Deschide profil Steam"
                >
                  <Icon icon="lucide:external-link" width="13" height="13" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 1B: Stack Tehnic & Instrumente -->
        <div class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--emerald">
              <Icon icon="lucide:cpu" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Stack Tehnic &amp; Unelte</h3>
              <span class="wf-panel-sub">Tehnologiile și mediile de operare utilizate</span>
            </div>
          </div>

          <div class="wf-techstack-grid">
            <div
              v-for="(tech, tIdx) in techStackList"
              :key="tIdx"
              class="wf-techstack-chip"
            >
              <div class="wf-techstack-icon-box">
                <Icon :icon="tech.icon" width="14" height="14" />
              </div>
              <div class="wf-techstack-details">
                <span class="wf-techstack-name">{{ tech.name }}</span>
                <span class="wf-techstack-cat">{{ tech.category }}</span>
              </div>
              <span class="wf-techstack-lvl-tag">{{ tech.level }}</span>
            </div>
          </div>
        </div>

        <!-- Section 2: RBAC Matrix -->
        <div class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--purple">
              <Icon icon="lucide:shield" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Matrice Permisiuni RBAC</h3>
              <span class="wf-panel-sub">Nivelurile de acces autorizate în sistem</span>
            </div>
          </div>

          <div class="wf-rbac-matrix">
            <div
              v-for="pm in PERM_METAS"
              :key="pm.key"
              :class="['wf-rbac-pill', member.permissions?.[pm.key] ? 'wf-rbac-pill--granted' : 'wf-rbac-pill--denied']"
            >
              <Icon :icon="pm.icon" width="13" height="13" class="wf-rbac-icon" />
              <span class="wf-rbac-title">{{ pm.label }}</span>
              <Icon
                :icon="member.permissions?.[pm.key] ? 'lucide:check' : 'lucide:x'"
                width="12"
                height="12"
                class="wf-rbac-status-ico"
              />
            </div>
          </div>
        </div>

        <!-- Section 3: Audit & Metadata -->
        <div class="wf-glass-panel">
          <div class="wf-panel-header">
            <div class="wf-panel-icon-wrap wf-panel-icon-wrap--amber">
              <Icon icon="lucide:clock" width="16" height="16" />
            </div>
            <div>
              <h3 class="wf-panel-title">Informații &amp; Audit Cont</h3>
              <span class="wf-panel-sub">Istoric conexiuni și stare securitate</span>
            </div>
          </div>

          <div class="wf-audit-list">
            <div class="wf-audit-item">
              <div class="wf-audit-left">
                <Icon icon="lucide:calendar" width="14" height="14" class="text-amber-400" />
                <span>Data Înregistrării</span>
              </div>
              <span class="wf-audit-val">{{ joinedDate }}</span>
            </div>

            <div class="wf-audit-item">
              <div class="wf-audit-left">
                <Icon icon="lucide:clock-3" width="14" height="14" class="text-emerald-400" />
                <span>Ultima Sesiune</span>
              </div>
              <span class="wf-audit-val">{{ lastLogin }}</span>
            </div>

            <div class="wf-audit-item">
              <div class="wf-audit-left">
                <Icon icon="lucide:shield-alert" width="14" height="14" class="text-cyan-400" />
                <span>Statut Securitate</span>
              </div>
              <span class="wf-audit-val wf-audit-val--protected">
                {{ member.isRoot ? 'Root Sovereign' : 'Activ & Protejat 2FA' }}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════════════
         TAB 2: TIMELINE ACTIVITATE
         ═════════════════════════════════════════════════════════════════════════ -->
    <div v-else-if="profileTab === 'timeline'" class="wf-timeline-view">
      <div class="wf-glass-panel">
        <div class="wf-panel-header">
          <div class="wf-panel-icon-wrap wf-panel-icon-wrap--cyan">
            <Icon icon="lucide:history" width="16" height="16" />
          </div>
          <div>
            <h3 class="wf-panel-title">Jurnal Cronologic &amp; Istoric Contribuții</h3>
            <span class="wf-panel-sub">Feed interactiv cu toate commit-urile și documentele atinse</span>
          </div>
        </div>

        <!-- Toolbar: Filters + Live Search -->
        <div class="wf-timeline-toolbar">
          <div class="wf-filter-pills-row">
            <button
              type="button"
              :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': timelineFilter === 'all' }]"
              @click="timelineFilter = 'all'"
            >
              Toate ({{ timelineItems.length }})
            </button>
            <button
              type="button"
              :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': timelineFilter === 'docs' }]"
              @click="timelineFilter = 'docs'"
            >
              Ghiduri Docs
            </button>
            <button
              type="button"
              :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': timelineFilter === 'commits' }]"
              @click="timelineFilter = 'commits'"
            >
              Commit-uri Git
            </button>
            <button
              type="button"
              :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': timelineFilter === 'code' }]"
              @click="timelineFilter = 'code'"
            >
              Fișiere Sursă
            </button>
          </div>

          <div class="wf-search-input-wrap">
            <Icon icon="lucide:search" width="14" height="14" class="wf-search-icon" />
            <input
              v-model="timelineSearch"
              type="text"
              placeholder="Filtrează în istoric..."
              class="wf-search-input"
            />
          </div>
        </div>

        <!-- Timeline Feed Tree -->
        <div v-if="filteredTimeline.length === 0" class="wf-empty-substate">
          <Icon icon="lucide:search-x" width="24" height="24" class="opacity-40" />
          <p>Nicio activitate găsită pentru criteriile de căutare selectate.</p>
        </div>

        <div v-else class="wf-timeline-tree">
          <div v-for="(item, idx) in filteredTimeline" :key="item.id || idx" class="wf-timeline-node">
            <div class="wf-timeline-rail">
              <div
                class="wf-timeline-dot"
                :style="{
                  borderColor:
                    item.type === 'doc'
                      ? '#10b981'
                      : item.type === 'commit'
                      ? '#06b6d4'
                      : '#a855f7',
                }"
              />
              <div v-if="idx < filteredTimeline.length - 1" class="wf-timeline-line" />
            </div>

            <div class="wf-timeline-card">
              <div class="wf-timeline-card-header">
                <div class="wf-timeline-type-row">
                  <span :class="['wf-timeline-tag', `wf-timeline-tag--${item.type}`]">
                    <Icon v-if="item.type === 'doc'" icon="lucide:book-open" width="11" height="11" />
                    <Icon v-else-if="item.type === 'commit'" icon="lucide:git-commit" width="11" height="11" />
                    <Icon v-else icon="lucide:terminal" width="11" height="11" />
                    <span>{{ item.type === 'doc' ? 'GHID DOCS' : item.type === 'commit' ? 'GIT COMMIT' : 'FIȘIER COD' }}</span>
                  </span>

                  <a
                    v-if="item.shortHash"
                    :href="item.url || `https://github.com/WildFiire/docs/commit/${item.hash}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="wf-timeline-hash"
                    title="Vezi pe GitHub"
                  >
                    #{{ item.shortHash }}
                    <Icon icon="lucide:external-link" width="10" height="10" class="opacity-60" />
                  </a>
                </div>

                <span class="wf-timeline-date">{{ item.date }}</span>
              </div>

              <h4 class="wf-timeline-title">{{ item.title }}</h4>

              <div v-if="item.path" class="wf-timeline-link-row">
                <a v-if="item.isDoc" :href="`/docs/${item.path}`" class="wf-timeline-doc-link">
                  <Icon icon="lucide:book-open" width="12" height="12" class="text-emerald-400" />
                  <span>/docs/{{ item.path }}</span>
                  <Icon icon="lucide:chevron-right" width="12" height="12" class="opacity-60" />
                </a>
                <span v-else class="wf-timeline-code-path">
                  <Icon icon="lucide:terminal" width="12" height="12" class="text-purple-400" />
                  {{ item.path }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════════════
         TAB 3: INSIGNE & REALIZĂRI (ACHIEVEMENTS VAULT)
         ═════════════════════════════════════════════════════════════════════════ -->
    <div v-else-if="profileTab === 'achievements' && achievements" class="wf-achievements-view">
      <!-- Achievements KPI Strip -->
      <div class="wf-achieve-kpis-shelf">
        <div class="wf-achieve-kpi-card">
          <div class="wf-achieve-kpi-icon wf-achieve-kpi-icon--purple">
            <Icon icon="lucide:zap" width="20" height="20" />
          </div>
          <div class="wf-achieve-kpi-info">
            <span class="wf-achieve-kpi-num" style="color: #c084fc;">
              {{ achievements.reputationPoints.toLocaleString() }} PTS
            </span>
            <span class="wf-achieve-kpi-label">Scor Reputație</span>
          </div>
        </div>

        <div class="wf-achieve-kpi-card">
          <div class="wf-achieve-kpi-icon wf-achieve-kpi-icon--amber">
            <Icon icon="lucide:award" width="20" height="20" />
          </div>
          <div class="wf-achieve-kpi-info">
            <span class="wf-achieve-kpi-num" style="color: #fbbf24;">
              {{ achievements.totalUnlocked }} / {{ achievements.totalAvailable }}
            </span>
            <span class="wf-achieve-kpi-label">Insigne Deblocate ({{ achievements.completionPercentage }}%)</span>
          </div>
        </div>

        <div class="wf-achieve-kpi-card wf-achieve-kpi-card--tiers">
          <span class="wf-tiers-heading">Repartizare pe Ranguri:</span>
          <div class="wf-tiers-pills-row">
            <span
              v-for="(t, k) in achievements.tierCounts"
              :key="k"
              class="wf-tier-pill"
              :style="{ color: TIER_LABELS[k]?.color, borderColor: TIER_LABELS[k]?.border, background: TIER_LABELS[k]?.bg }"
            >
              {{ TIER_LABELS[k]?.name || k }}: {{ t }}
            </span>
          </div>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="wf-category-shelf">
        <button
          type="button"
          :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': badgeCategoryFilter === 'all' }]"
          @click="badgeCategoryFilter = 'all'"
        >
          Toate ({{ achievements.badges.length }})
        </button>
        <button
          type="button"
          :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': badgeCategoryFilter === 'git' }]"
          @click="badgeCategoryFilter = 'git'"
        >
          Git &amp; Repository
        </button>
        <button
          type="button"
          :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': badgeCategoryFilter === 'docs' }]"
          @click="badgeCategoryFilter = 'docs'"
        >
          Documentație
        </button>
        <button
          type="button"
          :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': badgeCategoryFilter === 'security' }]"
          @click="badgeCategoryFilter = 'security'"
        >
          Securitate &amp; Sistem
        </button>
        <button
          type="button"
          :class="['wf-subfilter-btn', { 'wf-subfilter-btn--active': badgeCategoryFilter === 'community' }]"
          @click="badgeCategoryFilter = 'community'"
        >
          Comunitate
        </button>
      </div>

      <!-- Badges Grid -->
      <div class="wf-badges-grid">
        <div
          v-for="badge in filteredBadges"
          :key="badge.id"
          :class="[
            'wf-badge-card',
            badge.unlocked ? 'wf-badge-card--unlocked' : 'wf-badge-card--locked',
            `wf-badge-card--tier-${badge.tier}`,
          ]"
          :style="
            badge.unlocked
              ? {
                  '--badge-color': TIER_LABELS[badge.tier]?.color || '#ff8c00',
                  '--badge-border': TIER_LABELS[badge.tier]?.border || 'rgba(255, 140, 0, 0.4)',
                }
              : undefined
          "
        >
          <div class="wf-badge-top">
            <div
              :class="[
                'wf-badge-icon',
                `wf-badge-icon--tier-${badge.tier}`,
                badge.unlocked ? 'wf-badge-icon--unlocked' : 'wf-badge-icon--locked',
              ]"
              :style="
                badge.unlocked
                  ? {
                      color: TIER_LABELS[badge.tier]?.color,
                      background: TIER_LABELS[badge.tier]?.bg,
                      borderColor: TIER_LABELS[badge.tier]?.border,
                    }
                  : {
                      color: '#64748b',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                    }
              "
            >
              <Icon :icon="BADGE_ICONS[badge.iconName] || 'lucide:award'" width="20" height="20" />
            </div>

            <div class="wf-badge-status-box">
              <span
                class="wf-tier-tag"
                :style="{
                  color: TIER_LABELS[badge.tier]?.color,
                  borderColor: TIER_LABELS[badge.tier]?.border,
                  background: TIER_LABELS[badge.tier]?.bg,
                }"
              >
                {{ TIER_LABELS[badge.tier]?.name || badge.tier }}
              </span>
              <span v-if="badge.unlocked" class="wf-badge-unlocked-tag">
                <Icon icon="lucide:check" width="11" height="11" class="text-emerald-400" />
                Deblocat
              </span>
              <span v-else class="wf-badge-locked-tag">
                <Icon icon="lucide:lock" width="11" height="11" />
                În Progres
              </span>
            </div>
          </div>

          <h4 class="wf-badge-title">{{ badge.title }}</h4>
          <p class="wf-badge-desc">{{ badge.description }}</p>

          <!-- Progress Bar -->
          <div class="wf-badge-progress-wrap">
            <div class="wf-badge-progress-labels">
              <span class="wf-progress-text">{{ badge.progress.label }}</span>
              <span class="wf-progress-pct">{{ badge.progress.percentage }}%</span>
            </div>
            <div class="wf-progress-track">
              <div
                class="wf-progress-fill"
                :style="{
                  width: `${badge.progress.percentage}%`,
                  background: badge.unlocked
                    ? `linear-gradient(90deg, ${TIER_LABELS[badge.tier]?.color}90, ${TIER_LABELS[badge.tier]?.color})`
                    : 'rgba(59, 130, 246, 0.6)',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════════════
         ECHIPA WILDFIRE // ROSTER SWITCHER RAPID (FOOTER EXPLORER)
         ═════════════════════════════════════════════════════════════════════════ -->
    <section class="wf-roster-shelf">
      <div class="wf-roster-shelf-header">
        <div class="wf-roster-shelf-title-wrap">
          <div class="wf-roster-icon-wrap">
            <Icon icon="lucide:users" width="16" height="16" />
          </div>
          <div>
            <h3 class="wf-roster-shelf-title">Echipa WildFire // Navigare Rapidă</h3>
            <span class="wf-roster-shelf-sub">Comută instant între profilele colegilor din echipa de documentație</span>
          </div>
        </div>
        <a href="/docs/team" class="wf-roster-all-btn">
          <span>Vezi Toată Echipa</span>
          <Icon icon="lucide:arrow-right" width="13" height="13" />
        </a>
      </div>

      <div class="wf-roster-cards-grid">
        <a
          v-for="coleg in teamRosterOtherMembers"
          :key="coleg.username"
          :href="`/docs/team/${coleg.username}`"
          class="wf-roster-mini-card"
          :style="{ '--mini-accent': coleg.accentColor }"
        >
          <div class="wf-roster-mini-avatar-wrap">
            <img :src="coleg.avatarUrl" :alt="coleg.displayName" class="wf-roster-mini-pfp" />
            <span class="wf-roster-mini-lvl">LVL {{ coleg.level }}</span>
          </div>
          <div class="wf-roster-mini-info">
            <div class="wf-roster-mini-name-row">
              <span class="wf-roster-mini-name">{{ coleg.displayName }}</span>
              <span class="wf-roster-mini-role-tag">{{ coleg.roleLabel }}</span>
            </div>
            <span class="wf-roster-mini-title">{{ coleg.customTitle }}</span>
          </div>
          <div class="wf-roster-mini-arrow">
            <Icon icon="lucide:chevron-right" width="15" height="15" />
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   SCOPED STYLES — ULTRA-REFINED GAMING LIQUID GLASSMORPHISM
   ═══════════════════════════════════════════════════════════════════════════ */

.wf-profile-container {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 24px 80px;
  box-sizing: border-box;
  animation: wfFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes wfFadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Top Tactical Dossier Strip ── */
.wf-dossier-top-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-family: var(--font-mono, monospace);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #64748b;
}

.wf-dossier-clearance {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-clearance-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent, #10b981);
}

.wf-clearance-text {
  color: #94a3b8;
}

.wf-dossier-sync-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
}

.wf-sync-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22d3ee;
}

/* ── Top Navigation ── */
.wf-top-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  padding-bottom: 2px;
}

.wf-nav-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary, #94a3b8);
  text-decoration: none;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.wf-nav-back-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateX(-2px);
}

.wf-nav-separator {
  color: #64748b;
  opacity: 0.6;
}

.wf-nav-active-crumb {
  font-weight: 700;
  color: var(--accent, #10b981);
  font-family: var(--font-mono, monospace);
  padding: 4px 10px;
  border-radius: 7px;
  background: var(--accent-tint, rgba(16, 185, 129, 0.12));
  border: 1px solid rgba(16, 185, 129, 0.28);
}

.wf-top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.wf-header-lvl-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wf-lvl-tag {
  font-size: 0.68rem;
  font-weight: 900;
  font-family: var(--font-mono, monospace);
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.15);
  padding: 2px 6px;
  border-radius: 5px;
}

.wf-lvl-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e2e8f0;
}

.wf-share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--color-text-secondary, #94a3b8);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 14px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.wf-share-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Toast */
.wf-toast-bubble {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  color: #f1f5f9;
  font-size: 0.82rem;
  font-weight: 700;
  backdrop-filter: blur(12px);
}

.wf-toast-fade-enter-active,
.wf-toast-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.wf-toast-fade-enter-from,
.wf-toast-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

/* ═════════════════════════════════════════════════════════════════════════
   HERO CARD (CLEAN DOCS THEME)
   ═════════════════════════════════════════════════════════════════════════ */
.wf-hero-card {
  position: relative;
  background: rgba(18, 24, 38, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: border-color 0.25s ease;
}

.wf-hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  background: var(--accent, #10b981);
  opacity: 0.45;
  z-index: 2;
}

.wf-hero-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.wf-hero-aura-1,
.wf-hero-aura-2,
.wf-hero-scanlines {
  display: none;
}

.wf-hero-grid-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.15;
}

.wf-hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 32px 36px;
  flex-wrap: wrap;
}

/* Avatar Frame */
.wf-avatar-slot {
  flex-shrink: 0;
}

.wf-avatar-ring {
  position: relative;
  width: 104px;
  height: 104px;
  border-radius: 22px;
  padding: 3px;
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.wf-hero-card:hover .wf-avatar-ring {
  border-color: var(--accent, #10b981);
  transform: scale(1.02);
}

.wf-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
  display: block;
  background: #090d16;
}

.wf-online-beacon {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wf-beacon-ping {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #10b981;
  opacity: 0.5;
  animation: beaconPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.wf-beacon-core {
  position: relative;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #0f172a;
}

@keyframes beaconPulse {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Identity Column */
.wf-identity-col {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.wf-role-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 8px;
  background: var(--accent-tint, rgba(16, 185, 129, 0.12));
  border: 1px solid var(--accent, #10b981);
  color: var(--accent, #10b981);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wf-role-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent, #10b981);
}

.wf-root-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.14);
  border: 1px solid rgba(251, 191, 36, 0.45);
  color: #fbbf24;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wf-verified-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-size: 0.7rem;
  font-weight: 700;
}

.wf-gh-contributor-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(71, 85, 105, 0.5);
  color: #e2e8f0;
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.wf-gh-contributor-pill:hover {
  background: rgba(51, 65, 85, 0.9);
  border-color: rgba(148, 163, 184, 0.7);
  color: #fff;
}

.wf-name-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.wf-profile-name {
  font-size: clamp(2.1rem, 3.8vw, 2.75rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0;
}

.wf-custom-title-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--accent, #10b981);
  margin: 0;
  letter-spacing: -0.01em;
}

.wf-custom-title-spark {
  opacity: 0.75;
  font-size: 0.8rem;
}

/* Tactical Holographic Pins */
.wf-tactical-pins-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.wf-tactical-pin {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #cbd5e1;
}

.wf-pin-gem {
  color: var(--accent, #10b981);
  font-size: 0.6rem;
}

.wf-identity-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.wf-handle-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-family: var(--font-mono, monospace);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.wf-handle-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.wf-handle-at {
  color: var(--accent, #10b981);
  font-weight: 800;
}

.wf-quick-socials {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-quick-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s ease;
}

.wf-quick-icon-btn:hover {
  transform: translateY(-2px);
  color: #fff;
}

.wf-quick-icon-btn--gh:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
}

.wf-quick-icon-btn--dc:hover {
  background: rgba(88, 101, 242, 0.25);
  border-color: rgba(88, 101, 242, 0.6);
  color: #818cf8;
}

.wf-quick-icon-btn--st:hover {
  background: rgba(30, 73, 118, 0.35);
  border-color: rgba(102, 192, 244, 0.5);
  color: #60a5fa;
}

.wf-hero-honor-strip {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-honor-capsule {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.wf-honor-capsule--purple {
  background: rgba(192, 132, 252, 0.14);
  border: 1px solid rgba(192, 132, 252, 0.4);
  color: #d8b4fe;
}

.wf-honor-capsule--amber {
  background: rgba(251, 191, 36, 0.14);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fde047;
}

/* Hero KPI Grid */
.wf-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(130px, 1fr));
  gap: 12px;
  flex-shrink: 0;
  margin-left: auto;
}

@media (max-width: 900px) {
  .wf-kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
  }
}

.wf-kpi-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  min-width: 130px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-kpi-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.wf-kpi-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-kpi-icon-box--emerald {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
}

.wf-kpi-icon-box--cyan {
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.35);
  color: #22d3ee;
}

.wf-kpi-icon-box--purple {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.35);
  color: #c084fc;
}

.wf-kpi-icon-box--amber {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}

.wf-kpi-info {
  display: flex;
  flex-direction: column;
}

.wf-kpi-val {
  font-size: 1.45rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  letter-spacing: -0.02em;
}

.wf-kpi-lbl {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 4px;
}

/* ═════════════════════════════════════════════════════════════════════════
   SEGMENTED TABS SHELF
   ═════════════════════════════════════════════════════════════════════════ */
.wf-tabs-shelf {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.wf-tabs-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 16px;
  background: rgba(15, 20, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.wf-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 11px;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.wf-tab-btn--active {
  background: var(--accent-tint, rgba(16, 185, 129, 0.14)) !important;
  border-color: var(--accent, #10b981) !important;
  color: #fff !important;
  box-shadow: none !important;
}

.wf-tab-counter {
  font-size: 0.68rem;
  font-weight: 800;
  font-family: var(--font-mono, monospace);
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.wf-tab-btn--active .wf-tab-counter {
  background: var(--accent, #10b981);
  color: #0b0f19;
}

/* ═════════════════════════════════════════════════════════════════════════
   DASHBOARD 2-COLUMN LAYOUT
   ═════════════════════════════════════════════════════════════════════════ */
.wf-overview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}

@media (max-width: 1080px) {
  .wf-overview-layout {
    grid-template-columns: 1fr;
  }
}

.wf-main-column,
.wf-sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Glass Panels */
.wf-glass-panel {
  position: relative;
  background: rgba(15, 20, 28, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px 26px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.wf-panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.wf-panel-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-panel-icon-wrap--emerald {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.wf-panel-icon-wrap--cyan {
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #22d3ee;
}

.wf-panel-icon-wrap--purple {
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #c084fc;
}

.wf-panel-icon-wrap--amber {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
}

.wf-panel-title {
  font-size: 0.98rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.01em;
}

.wf-panel-sub {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  display: block;
  margin-top: 1px;
}

.wf-view-all-badges-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 4px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.wf-view-all-badges-btn:hover {
  background: rgba(251, 191, 36, 0.2);
  transform: translateX(2px);
}

/* Bio Section */
.wf-bio-quote {
  position: relative;
  background: rgba(255, 255, 255, 0.025);
  border-left: 3px solid var(--accent, #10b981);
  border-radius: 0 12px 12px 0;
  padding: 16px 20px 16px 44px;
  margin-bottom: 20px;
}

.wf-quote-mark {
  position: absolute;
  top: 14px;
  left: 14px;
  color: var(--accent, #10b981);
  opacity: 0.4;
}

.wf-bio-text {
  font-size: 0.88rem;
  line-height: 1.65;
  color: #e2e8f0;
  margin: 0;
  font-weight: 500;
}

.wf-resp-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wf-subheading-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.wf-resp-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wf-resp-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.09);
  font-size: 0.78rem;
  font-weight: 600;
  color: #e2e8f0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-resp-chip:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--chip-color, #10b981);
  transform: translateY(-1px);
  color: #fff;
}

.wf-chip-icon-box {
  color: var(--chip-color, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pinned Honor Badges Grid */
.wf-pinned-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.wf-pinned-badge-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--badge-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--badge-border, rgba(255, 255, 255, 0.1));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.wf-pinned-badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.wf-pinned-badge-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--badge-border);
  color: var(--badge-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-pinned-badge-info {
  flex: 1;
  min-width: 0;
}

.wf-pinned-badge-tier-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.wf-pinned-tier-label {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--badge-color);
}

.wf-pinned-pts {
  font-size: 0.62rem;
  font-weight: 800;
  font-family: var(--font-mono, monospace);
  color: #94a3b8;
}

.wf-pinned-badge-title {
  font-size: 0.88rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 3px;
}

.wf-pinned-badge-desc {
  font-size: 0.72rem;
  color: #cbd5e1;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Chart Box */
.wf-chart-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wf-chart-legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wf-legend-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
}

.wf-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.wf-total-actions-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #cbd5e1;
  font-family: var(--font-mono, monospace);
  padding: 4px 10px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wf-bars-shelf {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 130px;
  padding-top: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.wf-bar-col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.wf-bar-slot {
  width: 100%;
  max-width: 44px;
  height: 96px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.wf-bar-fill {
  width: 100%;
  border-radius: 6px 6px 3px 3px;
  border: 1px solid;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.wf-bar-fill--active:hover {
  filter: brightness(1.2);
  transform: scaleY(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.wf-bar-tooltip {
  position: absolute;
  top: -20px;
  font-size: 0.72rem;
  font-weight: 800;
  font-family: var(--font-mono, monospace);
  color: var(--accent, #10b981);
}

.wf-bar-month {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

/* Weekly Heatmap */
.wf-weekly-heatmap-box {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wf-heatmap-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.wf-heatmap-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
}

.wf-heatmap-legend {
  display: flex;
  align-items: center;
  gap: 4px;
}

.wf-legend-text {
  font-size: 0.64rem;
  color: #64748b;
}

.wf-heat-block {
  width: 9px;
  height: 9px;
  border-radius: 2px;
}
.wf-heat-block--0 { background: rgba(255, 255, 255, 0.05); }
.wf-heat-block--1 { background: rgba(16, 185, 129, 0.3); }
.wf-heat-block--2 { background: rgba(16, 185, 129, 0.55); }
.wf-heat-block--3 { background: rgba(16, 185, 129, 0.8); }
.wf-heat-block--4 { background: #34d399; }

.wf-heatmap-grid {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 5px;
}

.wf-heat-cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.wf-heat-cell:hover {
  transform: scale(1.3);
  z-index: 5;
}

.wf-heat-cell--lvl-0 { background: rgba(255, 255, 255, 0.04); }
.wf-heat-cell--lvl-1 { background: rgba(16, 185, 129, 0.3); border-color: rgba(16, 185, 129, 0.4); }
.wf-heat-cell--lvl-2 { background: rgba(16, 185, 129, 0.55); border-color: rgba(16, 185, 129, 0.7); }
.wf-heat-cell--lvl-3 { background: rgba(16, 185, 129, 0.8); border-color: #10b981; }
.wf-heat-cell--lvl-4 { background: #34d399; border-color: #6ee7b7; }

.wf-heat-tooltip {
  display: none;
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 4px 8px;
  white-space: nowrap;
  font-size: 0.65rem;
  color: #fff;
  z-index: 10;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.wf-heat-cell:hover .wf-heat-tooltip {
  display: flex;
  flex-direction: column;
}

/* Commits Feed */
.wf-commits-feed {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-commit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-commit-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(6, 182, 212, 0.4);
  transform: translateX(4px);
}

.wf-commit-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.wf-commit-hash {
  font-size: 0.72rem;
  font-weight: 800;
  font-family: var(--font-mono, monospace);
  color: #22d3ee;
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 2px 7px;
  border-radius: 6px;
  flex-shrink: 0;
}

.wf-commit-msg {
  font-size: 0.8rem;
  font-weight: 500;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-commit-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.wf-commit-date {
  font-size: 0.7rem;
  color: #94a3b8;
  font-family: var(--font-mono, monospace);
}

.wf-commit-arrow {
  color: #64748b;
  transition: all 0.2s ease;
}

.wf-commit-item:hover .wf-commit-arrow {
  color: #22d3ee;
  transform: translateX(2px);
}

/* Docs Feed */
.wf-docs-feed {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-doc-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-doc-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(16, 185, 129, 0.4);
  transform: translateX(4px);
}

.wf-doc-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-doc-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.wf-doc-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-category-tag {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  flex-shrink: 0;
}

.wf-doc-path {
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-mono, monospace);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-doc-submsg {
  font-size: 0.72rem;
  color: #94a3b8;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-doc-meta-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.wf-doc-date {
  font-size: 0.7rem;
  color: #94a3b8;
  font-family: var(--font-mono, monospace);
}

.wf-doc-arrow {
  color: #64748b;
  transition: all 0.2s ease;
}

.wf-doc-item:hover .wf-doc-arrow {
  color: #34d399;
  transform: translateX(2px);
}

/* Sidebar Connected Passports */
.wf-social-cards-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wf-social-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.wf-social-card:hover {
  transform: translateY(-2px);
}

.wf-social-card--gh:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.06);
}

.wf-social-card--dc:hover {
  border-color: rgba(88, 101, 242, 0.5);
  background: rgba(88, 101, 242, 0.1);
}

.wf-social-card--st:hover {
  border-color: rgba(102, 192, 244, 0.5);
  background: rgba(30, 73, 118, 0.2);
}

.wf-social-card-avatar {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  flex-shrink: 0;
}

.wf-social-pfp {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.wf-social-pfp-fallback {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.wf-social-sub-badge {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.8);
}

.wf-social-sub-badge--gh {
  background: #181717;
  color: #fff;
}
.wf-social-sub-badge--dc {
  background: #5865f2;
  color: #fff;
}
.wf-social-sub-badge--st {
  background: #171a21;
  color: #66c0f4;
}

.wf-social-card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.wf-social-card-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-platform-name {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cbd5e1;
}

.wf-platform-status {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.wf-social-user-heading {
  font-size: 0.88rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-social-subtext {
  font-size: 0.72rem;
  color: #94a3b8;
  font-family: var(--font-mono, monospace);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-social-card-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.wf-action-mini-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}

.wf-action-mini-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  transform: scale(1.06);
}

/* RBAC Matrix */
.wf-rbac-matrix {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.wf-rbac-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 8px;
  border: 1px solid;
  font-size: 0.7rem;
  font-weight: 700;
  transition: all 0.15s ease;
}

.wf-rbac-pill--granted {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #34d399;
}

.wf-rbac-pill--denied {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.28);
}

.wf-rbac-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-rbac-status-ico {
  flex-shrink: 0;
  opacity: 0.8;
}

/* Audit List */
.wf-audit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-audit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.wf-audit-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.76rem;
  color: #94a3b8;
  font-weight: 600;
}

.wf-audit-val {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e2e8f0;
  font-family: var(--font-mono, monospace);
}

.wf-audit-val--protected {
  color: #34d399;
  font-weight: 800;
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 2: TIMELINE VIEW
   ═════════════════════════════════════════════════════════════════════════ */
.wf-timeline-view {
  width: 100%;
}

.wf-timeline-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.wf-filter-pills-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.wf-subfilter-btn {
  padding: 6px 14px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
}

.wf-subfilter-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
}

.wf-subfilter-btn--active {
  background: var(--accent-tint, rgba(16, 185, 129, 0.16)) !important;
  border-color: var(--accent, #10b981) !important;
  color: #fff !important;
}

.wf-search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 240px;
}

.wf-search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  pointer-events: none;
}

.wf-search-input {
  width: 100%;
  padding: 7px 12px 7px 34px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #fff;
  font-size: 0.8rem;
  outline: none;
  transition: all 0.2s ease;
}

.wf-search-input:focus {
  border-color: var(--accent, #10b981);
  box-shadow: 0 0 0 2px var(--accent-tint, rgba(16, 185, 129, 0.25));
}

.wf-timeline-tree {
  display: flex;
  flex-direction: column;
  padding-left: 8px;
}

.wf-timeline-node {
  display: flex;
  gap: 16px;
  position: relative;
}

.wf-timeline-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  flex-shrink: 0;
}

.wf-timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0b0f19;
  border: 2px solid #10b981;
  margin-top: 14px;
  z-index: 1;
}

.wf-timeline-line {
  flex: 1;
  width: 2px;
  background: rgba(255, 255, 255, 0.08);
  margin-top: 4px;
}

.wf-timeline-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 14px;
  transition: all 0.2s ease;
}

.wf-timeline-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateX(3px);
}

.wf-timeline-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.wf-timeline-type-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-timeline-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 5px;
}

.wf-timeline-tag--doc {
  background: rgba(16, 185, 129, 0.14);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.wf-timeline-tag--commit {
  background: rgba(6, 182, 212, 0.14);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.wf-timeline-tag--code {
  background: rgba(168, 85, 247, 0.14);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.wf-timeline-hash {
  font-size: 0.7rem;
  font-weight: 700;
  font-family: var(--font-mono, monospace);
  color: #94a3b8;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.wf-timeline-hash:hover {
  color: #fff;
}

.wf-timeline-date {
  font-size: 0.7rem;
  color: #64748b;
  font-family: var(--font-mono, monospace);
}

.wf-timeline-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}

.wf-timeline-link-row {
  display: flex;
  align-items: center;
}

.wf-timeline-doc-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.74rem;
  font-family: var(--font-mono, monospace);
  color: #34d399;
  text-decoration: none;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  transition: all 0.15s ease;
}

.wf-timeline-doc-link:hover {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.4);
}

.wf-timeline-code-path {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.74rem;
  font-family: var(--font-mono, monospace);
  color: #c084fc;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(168, 85, 247, 0.08);
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 3: ACHIEVEMENTS & BADGES VAULT
   ═════════════════════════════════════════════════════════════════════════ */
.wf-achievements-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wf-achieve-kpis-shelf {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.wf-achieve-kpi-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(15, 20, 28, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.wf-achieve-kpi-card--tiers {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.wf-achieve-kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-achieve-kpi-icon--purple {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.35);
  color: #c084fc;
}

.wf-achieve-kpi-icon--amber {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}

.wf-achieve-kpi-info {
  display: flex;
  flex-direction: column;
}

.wf-achieve-kpi-num {
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
}

.wf-achieve-kpi-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  margin-top: 4px;
}

.wf-tiers-heading {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.wf-tiers-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.wf-tier-pill {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid;
}

.wf-category-shelf {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.wf-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.wf-badge-card {
  position: relative;
  border-radius: 18px;
  padding: 18px 20px;
  border: 1px solid;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wf-badge-card--unlocked {
  background: rgba(15, 20, 28, 0.8);
  border-color: var(--badge-border, rgba(251, 191, 36, 0.4));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.wf-badge-card--unlocked:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.35);
}

.wf-badge-card--locked {
  background: rgba(15, 20, 28, 0.5);
  border-color: rgba(255, 255, 255, 0.06);
  opacity: 0.75;
}

.wf-badge-card--locked:hover {
  opacity: 0.95;
  border-color: rgba(255, 255, 255, 0.14);
}

.wf-badge-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.wf-badge-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wf-badge-status-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.wf-tier-tag {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 6px;
  border: 1px solid;
}

.wf-badge-unlocked-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.68rem;
  font-weight: 800;
  color: #34d399;
}

.wf-badge-locked-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
}

.wf-badge-title {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
}

.wf-badge-desc {
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0 0 16px;
  flex: 1;
}

.wf-badge-progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wf-badge-progress-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  font-family: var(--font-mono, monospace);
}

.wf-progress-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.wf-progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}

/* Empty states and loaders */
.wf-empty-substate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 36px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.82rem;
}

.wf-profile-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 440px;
}

.wf-pulse-spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: #10b981;
  animation: wfSpin 0.7s linear infinite;
}

@keyframes wfSpin {
  to {
    transform: rotate(360deg);
  }
}

.wf-loading-text {
  font-size: 0.88rem;
  font-weight: 700;
  color: #94a3b8;
}

.wf-profile-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 440px;
  text-align: center;
}

.wf-error-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wf-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #fff;
  font-weight: 700;
  font-size: 0.84rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.wf-back-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

/* ── Dossier Status Pill & Quick Share Buttons ── */
.wf-dossier-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.35);
  font-family: var(--font-mono, monospace);
  font-size: 0.65rem;
  font-weight: 700;
  color: #34d399;
  letter-spacing: 0.04em;
  position: relative;
}

.wf-status-beacon-ping {
  position: absolute;
  left: 9px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  opacity: 0.75;
  animation: wfPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.wf-status-beacon-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

@keyframes wfPing {
  75%, 100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

.wf-share-btn--subtle {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #cbd5e1 !important;
}

.wf-share-btn--subtle:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.22) !important;
}

/* ── Card 1B: Code Velocity & Impact Dossier ── */
.wf-velocity-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wf-velocity-split-wrap {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.wf-velocity-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  font-weight: 600;
}

.wf-velocity-label-left {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #34d399;
}

.wf-velocity-label-right {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f87171;
}

.wf-velocity-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.wf-velocity-dot--green {
  background: #10b981;
}

.wf-velocity-dot--red {
  background: #ef4444;
}

.wf-velocity-bar-track {
  display: flex;
  height: 9px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  gap: 2px;
}

.wf-velocity-bar-fill {
  height: 100%;
  transition: width 0.4s ease;
}

.wf-velocity-bar-fill--add {
  background: linear-gradient(90deg, #059669, #10b981);
}

.wf-velocity-bar-fill--del {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.wf-velocity-chips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .wf-velocity-chips-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.wf-velocity-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.wf-velocity-chip:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.wf-velocity-chip-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.wf-velocity-chip-val {
  font-size: 0.82rem;
  font-weight: 800;
  color: #ffffff;
  font-family: var(--font-mono, monospace);
  white-space: nowrap;
}

.wf-velocity-chip-lbl {
  font-size: 0.68rem;
  color: #94a3b8;
}

/* ── Card 1C: Next Rank Milestone ── */
.wf-milestone-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wf-milestone-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.wf-milestone-current-badge,
.wf-milestone-next-badge {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex: 1;
}

.wf-milestone-next-badge {
  background: rgba(245, 158, 11, 0.06);
  border-color: rgba(245, 158, 11, 0.25);
}

.wf-milestone-lvl-tag {
  font-family: var(--font-mono, monospace);
  font-size: 0.68rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

.wf-milestone-lvl-tag--next {
  color: #fbbf24;
}

.wf-milestone-current-title,
.wf-milestone-next-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: #ffffff;
}

.wf-milestone-track-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-milestone-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 600;
}

.wf-milestone-pts-now {
  color: #cbd5e1;
  font-family: var(--font-mono, monospace);
}

.wf-milestone-pts-need {
  color: #fbbf24;
  font-family: var(--font-mono, monospace);
}

.wf-milestone-bar-track {
  position: relative;
  height: 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.wf-milestone-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  transition: width 0.4s ease;
}

.wf-milestone-pct-label {
  font-size: 0.62rem;
  font-weight: 900;
  color: #0f172a;
  font-family: var(--font-mono, monospace);
}

.wf-milestone-footer-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 0.73rem;
  color: #94a3b8;
  line-height: 1.4;
}

/* ── Section 1B: Tech Stack & Tooling (Sidebar) ── */
.wf-techstack-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-techstack-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: all 0.2s ease;
}

.wf-techstack-chip:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateX(2px);
}

.wf-techstack-icon-box {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #38bdf8;
}

.wf-techstack-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.wf-techstack-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: #f1f5f9;
}

.wf-techstack-cat {
  font-size: 0.66rem;
  color: #94a3b8;
}

.wf-techstack-lvl-tag {
  font-family: var(--font-mono, monospace);
  font-size: 0.62rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

/* ── Footer Roster Quick Switcher ── */
.wf-roster-shelf {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
}

.wf-roster-shelf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wf-roster-shelf-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wf-roster-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
}

.wf-roster-shelf-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
}

.wf-roster-shelf-sub {
  font-size: 0.74rem;
  color: #94a3b8;
  display: block;
}

.wf-roster-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 0.76rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.wf-roster-all-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  transform: translateX(2px);
}

.wf-roster-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

@media (max-width: 860px) {
  .wf-roster-cards-grid {
    grid-template-columns: 1fr;
  }
}

.wf-roster-mini-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.wf-roster-mini-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--mini-accent, #10b981);
  opacity: 0.6;
  transition: width 0.2s ease, opacity 0.2s ease;
}

.wf-roster-mini-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--mini-accent, #10b981);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.wf-roster-mini-card:hover::before {
  width: 5px;
  opacity: 1;
}

.wf-roster-mini-avatar-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.wf-roster-mini-pfp {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wf-roster-mini-lvl {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.75);
  font-family: var(--font-mono, monospace);
  font-size: 0.55rem;
  font-weight: 800;
  text-align: center;
  color: #fbbf24;
  line-height: 1.2;
}

.wf-roster-mini-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.wf-roster-mini-name-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.wf-roster-mini-name {
  font-size: 0.88rem;
  font-weight: 800;
  color: #ffffff;
}

.wf-roster-mini-role-tag {
  font-size: 0.64rem;
  font-weight: 600;
  color: var(--mini-accent, #10b981);
}

.wf-roster-mini-title {
  font-size: 0.72rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.wf-roster-mini-arrow {
  color: #64748b;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wf-roster-mini-card:hover .wf-roster-mini-arrow {
  color: #ffffff;
  transform: translateX(3px);
}

/* ═════════════════════════════════════════════════════════════════════════
   LIGHT THEME ADAPTATION (PREMIUM CLEAN DOCS DESIGN)
   ═════════════════════════════════════════════════════════════════════════ */

/* 1. Base Container & Top Tactical Header */
.wf-profile--light.wf-profile-container,
[data-theme="light"] .wf-profile-container,
html:not(.dark) .wf-profile-container {
  color: #0f172a;
}

.wf-profile--light .wf-dossier-top-strip,
[data-theme="light"] .wf-dossier-top-strip,
html:not(.dark) .wf-dossier-top-strip {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.wf-profile--light .wf-clearance-text,
[data-theme="light"] .wf-clearance-text,
html:not(.dark) .wf-clearance-text {
  color: #64748b !important;
}

.wf-profile--light .wf-dossier-status-pill,
[data-theme="light"] .wf-dossier-status-pill,
html:not(.dark) .wf-dossier-status-pill {
  background: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.25) !important;
  color: #059669 !important;
}

.wf-profile--light .wf-dossier-sync-info,
[data-theme="light"] .wf-dossier-sync-info,
html:not(.dark) .wf-dossier-sync-info {
  color: #0284c7 !important;
}

/* 2. Top Navigation Bar */
.wf-profile--light .wf-nav-back-link,
[data-theme="light"] .wf-nav-back-link,
html:not(.dark) .wf-nav-back-link {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #334155 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-nav-back-link:hover,
[data-theme="light"] .wf-nav-back-link:hover,
html:not(.dark) .wf-nav-back-link:hover {
  background: #f8fafc !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.16) !important;
}

.wf-profile--light .wf-nav-separator,
[data-theme="light"] .wf-nav-separator,
html:not(.dark) .wf-nav-separator {
  color: #94a3b8 !important;
}

.wf-profile--light .wf-header-lvl-pill,
[data-theme="light"] .wf-header-lvl-pill,
html:not(.dark) .wf-header-lvl-pill {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-lvl-name,
[data-theme="light"] .wf-lvl-name,
html:not(.dark) .wf-lvl-name {
  color: #1e293b !important;
}

.wf-profile--light .wf-share-btn,
[data-theme="light"] .wf-share-btn,
html:not(.dark) .wf-share-btn {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #475569 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-share-btn:hover,
[data-theme="light"] .wf-share-btn:hover,
html:not(.dark) .wf-share-btn:hover {
  background: #f8fafc !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.16) !important;
}

/* 3. Hero Showcase Card */
.wf-profile--light .wf-hero-card,
[data-theme="light"] .wf-hero-card,
html:not(.dark) .wf-hero-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-hero-grid-pattern,
[data-theme="light"] .wf-hero-grid-pattern,
html:not(.dark) .wf-hero-grid-pattern {
  background-image: radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px) !important;
  opacity: 0.35 !important;
}

.wf-profile--light .wf-avatar-ring,
[data-theme="light"] .wf-avatar-ring,
html:not(.dark) .wf-avatar-ring {
  background: #f8fafc !important;
  border: 1.5px solid rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
}

.wf-profile--light .wf-avatar-img,
[data-theme="light"] .wf-avatar-img,
html:not(.dark) .wf-avatar-img {
  background: #f1f5f9 !important;
}

.wf-profile--light .wf-beacon-core,
[data-theme="light"] .wf-beacon-core,
html:not(.dark) .wf-beacon-core {
  border-color: #ffffff !important;
}

.wf-profile--light .wf-profile-name,
[data-theme="light"] .wf-profile-name,
html:not(.dark) .wf-profile-name {
  color: #0f172a !important;
}

.wf-profile--light .wf-tactical-pin,
[data-theme="light"] .wf-tactical-pin,
html:not(.dark) .wf-tactical-pin {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #334155 !important;
}

.wf-profile--light .wf-tactical-pin:hover,
[data-theme="light"] .wf-tactical-pin:hover,
html:not(.dark) .wf-tactical-pin:hover {
  background: #e2e8f0 !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
}

.wf-profile--light .wf-pin-text,
[data-theme="light"] .wf-pin-text,
html:not(.dark) .wf-pin-text {
  color: #334155 !important;
}

.wf-profile--light .wf-gh-contributor-pill,
[data-theme="light"] .wf-gh-contributor-pill,
html:not(.dark) .wf-gh-contributor-pill {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #334155 !important;
}

.wf-profile--light .wf-gh-contributor-pill:hover,
[data-theme="light"] .wf-gh-contributor-pill:hover,
html:not(.dark) .wf-gh-contributor-pill:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

.wf-profile--light .wf-handle-chip,
[data-theme="light"] .wf-handle-chip,
html:not(.dark) .wf-handle-chip {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #475569 !important;
}

.wf-profile--light .wf-handle-chip:hover,
[data-theme="light"] .wf-handle-chip:hover,
html:not(.dark) .wf-handle-chip:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

.wf-profile--light .wf-quick-icon-btn,
[data-theme="light"] .wf-quick-icon-btn,
html:not(.dark) .wf-quick-icon-btn {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #475569 !important;
}

.wf-profile--light .wf-quick-icon-btn:hover,
[data-theme="light"] .wf-quick-icon-btn:hover,
html:not(.dark) .wf-quick-icon-btn:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

.wf-profile--light .wf-honor-capsule,
[data-theme="light"] .wf-honor-capsule,
html:not(.dark) .wf-honor-capsule {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

/* 4. Hero KPI Metric Boxes */
.wf-profile--light .wf-kpi-card,
[data-theme="light"] .wf-kpi-card,
html:not(.dark) .wf-kpi-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02) !important;
}

.wf-profile--light .wf-kpi-card:hover,
[data-theme="light"] .wf-kpi-card:hover,
html:not(.dark) .wf-kpi-card:hover {
  background: #f8fafc !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
}

.wf-profile--light .wf-kpi-val,
[data-theme="light"] .wf-kpi-val,
html:not(.dark) .wf-kpi-val {
  color: #0f172a;
}

.wf-profile--light .wf-kpi-lbl,
[data-theme="light"] .wf-kpi-lbl,
html:not(.dark) .wf-kpi-lbl {
  color: #64748b !important;
}

.wf-profile--light .wf-kpi-icon-box--emerald,
[data-theme="light"] .wf-kpi-icon-box--emerald,
html:not(.dark) .wf-kpi-icon-box--emerald {
  background: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.25) !important;
  color: #059669 !important;
}

.wf-profile--light .wf-kpi-icon-box--cyan,
[data-theme="light"] .wf-kpi-icon-box--cyan,
html:not(.dark) .wf-kpi-icon-box--cyan {
  background: rgba(6, 182, 212, 0.1) !important;
  border-color: rgba(6, 182, 212, 0.25) !important;
  color: #0891b2 !important;
}

.wf-profile--light .wf-kpi-icon-box--purple,
[data-theme="light"] .wf-kpi-icon-box--purple,
html:not(.dark) .wf-kpi-icon-box--purple {
  background: rgba(168, 85, 247, 0.1) !important;
  border-color: rgba(168, 85, 247, 0.25) !important;
  color: #7e22ce !important;
}

.wf-profile--light .wf-kpi-icon-box--amber,
[data-theme="light"] .wf-kpi-icon-box--amber,
html:not(.dark) .wf-kpi-icon-box--amber {
  background: rgba(245, 158, 11, 0.1) !important;
  border-color: rgba(245, 158, 11, 0.25) !important;
  color: #b45309 !important;
}

/* 5. Segmented Navigation Tabs */
.wf-profile--light .wf-tabs-container,
[data-theme="light"] .wf-tabs-container,
html:not(.dark) .wf-tabs-container {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
}

.wf-profile--light .wf-tab-btn,
[data-theme="light"] .wf-tab-btn,
html:not(.dark) .wf-tab-btn {
  color: #64748b !important;
}

.wf-profile--light .wf-tab-btn:hover,
[data-theme="light"] .wf-tab-btn:hover,
html:not(.dark) .wf-tab-btn:hover {
  color: #0f172a !important;
  background: rgba(0, 0, 0, 0.04) !important;
}

.wf-profile--light .wf-tab-btn--active,
[data-theme="light"] .wf-tab-btn--active,
html:not(.dark) .wf-tab-btn--active {
  background: var(--accent-tint, rgba(16, 185, 129, 0.12)) !important;
  border-color: var(--accent, #059669) !important;
  color: #0f172a !important;
  font-weight: 800 !important;
}

.wf-profile--light .wf-tab-counter,
[data-theme="light"] .wf-tab-counter,
html:not(.dark) .wf-tab-counter {
  background: rgba(0, 0, 0, 0.06) !important;
  color: #475569 !important;
}

.wf-profile--light .wf-tab-btn--active .wf-tab-counter,
[data-theme="light"] .wf-tab-btn--active .wf-tab-counter,
html:not(.dark) .wf-tab-btn--active .wf-tab-counter {
  background: var(--accent, #059669) !important;
  color: #ffffff !important;
}

/* 6. Glass Panels (Dashboard Articles) */
.wf-profile--light .wf-glass-panel,
[data-theme="light"] .wf-glass-panel,
html:not(.dark) .wf-glass-panel {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
}

.wf-profile--light .wf-panel-header,
[data-theme="light"] .wf-panel-header,
html:not(.dark) .wf-panel-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-panel-title,
[data-theme="light"] .wf-panel-title,
html:not(.dark) .wf-panel-title {
  color: #0f172a !important;
  font-weight: 800 !important;
}

.wf-profile--light .wf-panel-sub,
[data-theme="light"] .wf-panel-sub,
html:not(.dark) .wf-panel-sub {
  color: #64748b !important;
}

.wf-profile--light .wf-panel-icon-wrap--emerald,
[data-theme="light"] .wf-panel-icon-wrap--emerald,
html:not(.dark) .wf-panel-icon-wrap--emerald {
  background: rgba(16, 185, 129, 0.1) !important;
  border: 1px solid rgba(16, 185, 129, 0.25) !important;
  color: #059669 !important;
}

.wf-profile--light .wf-panel-icon-wrap--purple,
[data-theme="light"] .wf-panel-icon-wrap--purple,
html:not(.dark) .wf-panel-icon-wrap--purple {
  background: rgba(168, 85, 247, 0.1) !important;
  border: 1px solid rgba(168, 85, 247, 0.25) !important;
  color: #7e22ce !important;
}

.wf-profile--light .wf-panel-icon-wrap--amber,
[data-theme="light"] .wf-panel-icon-wrap--amber,
html:not(.dark) .wf-panel-icon-wrap--amber {
  background: rgba(245, 158, 11, 0.1) !important;
  border: 1px solid rgba(245, 158, 11, 0.25) !important;
  color: #b45309 !important;
}

.wf-profile--light .wf-panel-icon-wrap--cyan,
[data-theme="light"] .wf-panel-icon-wrap--cyan,
html:not(.dark) .wf-panel-icon-wrap--cyan {
  background: rgba(6, 182, 212, 0.1) !important;
  border: 1px solid rgba(6, 182, 212, 0.25) !important;
  color: #0891b2 !important;
}

/* 7. Bio Quote & Responsibilities */
.wf-profile--light .wf-bio-quote,
[data-theme="light"] .wf-bio-quote,
html:not(.dark) .wf-bio-quote {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  border-left: 3px solid var(--accent, #059669) !important;
}

.wf-profile--light .wf-quote-mark,
[data-theme="light"] .wf-quote-mark,
html:not(.dark) .wf-quote-mark {
  color: var(--accent, #059669) !important;
  opacity: 0.7 !important;
}

.wf-profile--light .wf-bio-text,
[data-theme="light"] .wf-bio-text,
html:not(.dark) .wf-bio-text {
  color: #334155 !important;
}

.wf-profile--light .wf-subheading-tag,
[data-theme="light"] .wf-subheading-tag,
html:not(.dark) .wf-subheading-tag {
  color: #475569 !important;
}

.wf-profile--light .wf-resp-chip,
[data-theme="light"] .wf-resp-chip,
html:not(.dark) .wf-resp-chip {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #1e293b !important;
}

.wf-profile--light .wf-resp-chip:hover,
[data-theme="light"] .wf-resp-chip:hover,
html:not(.dark) .wf-resp-chip:hover {
  background: #f1f5f9 !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
}

.wf-profile--light .wf-chip-icon-box,
[data-theme="light"] .wf-chip-icon-box,
html:not(.dark) .wf-chip-icon-box {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

/* 8. Code Velocity & Milestone Bars */
.wf-profile--light .wf-velocity-split-wrap,
[data-theme="light"] .wf-velocity-split-wrap,
html:not(.dark) .wf-velocity-split-wrap {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-velocity-chip,
[data-theme="light"] .wf-velocity-chip,
html:not(.dark) .wf-velocity-chip {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-velocity-chip-val,
[data-theme="light"] .wf-velocity-chip-val,
html:not(.dark) .wf-velocity-chip-val {
  color: #0f172a !important;
}

.wf-profile--light .wf-velocity-chip-lbl,
[data-theme="light"] .wf-velocity-chip-lbl,
html:not(.dark) .wf-velocity-chip-lbl {
  color: #64748b !important;
}

.wf-profile--light .wf-velocity-bar-track,
[data-theme="light"] .wf-velocity-bar-track,
html:not(.dark) .wf-velocity-bar-track {
  background: rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-milestone-bar-track,
[data-theme="light"] .wf-milestone-bar-track,
html:not(.dark) .wf-milestone-bar-track {
  background: rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-milestone-current-title,
[data-theme="light"] .wf-milestone-current-title,
html:not(.dark) .wf-milestone-current-title,
.wf-profile--light .wf-milestone-next-title,
[data-theme="light"] .wf-milestone-next-title,
html:not(.dark) .wf-milestone-next-title {
  color: #0f172a !important;
}

.wf-profile--light .wf-milestone-pts-now,
[data-theme="light"] .wf-milestone-pts-now,
html:not(.dark) .wf-milestone-pts-now,
.wf-profile--light .wf-milestone-pts-need,
[data-theme="light"] .wf-milestone-pts-need,
html:not(.dark) .wf-milestone-pts-need {
  color: #64748b !important;
}

.wf-profile--light .wf-milestone-footer-note,
[data-theme="light"] .wf-milestone-footer-note,
html:not(.dark) .wf-milestone-footer-note {
  color: #64748b !important;
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

/* 9. Pinned Badges & Achievements */
.wf-profile--light .wf-pinned-badge-card,
[data-theme="light"] .wf-pinned-badge-card,
html:not(.dark) .wf-pinned-badge-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  border-radius: 15px !important;
  box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02) !important;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.wf-profile--light .wf-pinned-badge-card--mythic,
[data-theme="light"] .wf-pinned-badge-card--mythic,
html:not(.dark) .wf-pinned-badge-card--mythic {
  background: linear-gradient(135deg, #ffffff 0%, rgba(168, 85, 247, 0.04) 100%) !important;
  border-color: rgba(168, 85, 247, 0.22) !important;
}

.wf-profile--light .wf-pinned-badge-card--platinum,
[data-theme="light"] .wf-pinned-badge-card--platinum,
html:not(.dark) .wf-pinned-badge-card--platinum {
  background: linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.04) 100%) !important;
  border-color: rgba(6, 182, 212, 0.22) !important;
}

.wf-profile--light .wf-pinned-badge-card--gold,
[data-theme="light"] .wf-pinned-badge-card--gold,
html:not(.dark) .wf-pinned-badge-card--gold {
  background: linear-gradient(135deg, #ffffff 0%, rgba(245, 158, 11, 0.04) 100%) !important;
  border-color: rgba(245, 158, 11, 0.22) !important;
}

.wf-profile--light .wf-pinned-badge-card--silver,
[data-theme="light"] .wf-pinned-badge-card--silver,
html:not(.dark) .wf-pinned-badge-card--silver {
  background: linear-gradient(135deg, #ffffff 0%, rgba(100, 116, 139, 0.03) 100%) !important;
  border-color: rgba(100, 116, 139, 0.2) !important;
}

.wf-profile--light .wf-pinned-badge-card--bronze,
[data-theme="light"] .wf-pinned-badge-card--bronze,
html:not(.dark) .wf-pinned-badge-card--bronze {
  background: linear-gradient(135deg, #ffffff 0%, rgba(249, 115, 22, 0.04) 100%) !important;
  border-color: rgba(249, 115, 22, 0.22) !important;
}

.wf-profile--light .wf-pinned-badge-card:hover,
[data-theme="light"] .wf-pinned-badge-card:hover,
html:not(.dark) .wf-pinned-badge-card:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08) !important;
}

.wf-profile--light .wf-pinned-badge-card--mythic:hover,
[data-theme="light"] .wf-pinned-badge-card--mythic:hover,
html:not(.dark) .wf-pinned-badge-card--mythic:hover {
  border-color: rgba(168, 85, 247, 0.5) !important;
  box-shadow: 0 8px 24px -4px rgba(168, 85, 247, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-pinned-badge-card--platinum:hover,
[data-theme="light"] .wf-pinned-badge-card--platinum:hover,
html:not(.dark) .wf-pinned-badge-card--platinum:hover {
  border-color: rgba(6, 182, 212, 0.5) !important;
  box-shadow: 0 8px 24px -4px rgba(6, 182, 212, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-pinned-badge-card--gold:hover,
[data-theme="light"] .wf-pinned-badge-card--gold:hover,
html:not(.dark) .wf-pinned-badge-card--gold:hover {
  border-color: rgba(245, 158, 11, 0.5) !important;
  box-shadow: 0 8px 24px -4px rgba(245, 158, 11, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-pinned-badge-card--silver:hover,
[data-theme="light"] .wf-pinned-badge-card--silver:hover,
html:not(.dark) .wf-pinned-badge-card--silver:hover {
  border-color: rgba(100, 116, 139, 0.45) !important;
  box-shadow: 0 8px 24px -4px rgba(100, 116, 139, 0.14), 0 2px 6px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-pinned-badge-card--bronze:hover,
[data-theme="light"] .wf-pinned-badge-card--bronze:hover,
html:not(.dark) .wf-pinned-badge-card--bronze:hover {
  border-color: rgba(249, 115, 22, 0.5) !important;
  box-shadow: 0 8px 24px -4px rgba(249, 115, 22, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03) !important;
}

/* Pinned badge icon squircle (vibrant pastel squircle with tier accent) */
.wf-profile--light .wf-pinned-badge-icon,
[data-theme="light"] .wf-pinned-badge-icon,
html:not(.dark) .wf-pinned-badge-icon {
  width: 38px !important;
  height: 38px !important;
  border-radius: 11px !important;
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #334155 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  transition: all 0.2s ease !important;
}

.wf-profile--light .wf-pinned-badge-icon--mythic,
[data-theme="light"] .wf-pinned-badge-icon--mythic,
html:not(.dark) .wf-pinned-badge-icon--mythic {
  background: rgba(168, 85, 247, 0.12) !important;
  border: 1px solid rgba(168, 85, 247, 0.28) !important;
  color: #9333ea !important;
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.14) !important;
}

.wf-profile--light .wf-pinned-badge-icon--platinum,
[data-theme="light"] .wf-pinned-badge-icon--platinum,
html:not(.dark) .wf-pinned-badge-icon--platinum {
  background: rgba(6, 182, 212, 0.12) !important;
  border: 1px solid rgba(6, 182, 212, 0.28) !important;
  color: #0891b2 !important;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.14) !important;
}

.wf-profile--light .wf-pinned-badge-icon--gold,
[data-theme="light"] .wf-pinned-badge-icon--gold,
html:not(.dark) .wf-pinned-badge-icon--gold {
  background: rgba(245, 158, 11, 0.12) !important;
  border: 1px solid rgba(245, 158, 11, 0.28) !important;
  color: #d97706 !important;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.14) !important;
}

.wf-profile--light .wf-pinned-badge-icon--silver,
[data-theme="light"] .wf-pinned-badge-icon--silver,
html:not(.dark) .wf-pinned-badge-icon--silver {
  background: rgba(100, 116, 139, 0.1) !important;
  border: 1px solid rgba(100, 116, 139, 0.24) !important;
  color: #475569 !important;
  box-shadow: 0 2px 6px rgba(100, 116, 139, 0.1) !important;
}

.wf-profile--light .wf-pinned-badge-icon--bronze,
[data-theme="light"] .wf-pinned-badge-icon--bronze,
html:not(.dark) .wf-pinned-badge-icon--bronze {
  background: rgba(249, 115, 22, 0.12) !important;
  border: 1px solid rgba(249, 115, 22, 0.28) !important;
  color: #ea580c !important;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.14) !important;
}

/* Tier text */
.wf-profile--light .wf-pinned-badge-card--mythic .wf-pinned-tier-label,
[data-theme="light"] .wf-pinned-badge-card--mythic .wf-pinned-tier-label,
html:not(.dark) .wf-pinned-badge-card--mythic .wf-pinned-tier-label {
  color: #9333ea !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
}

.wf-profile--light .wf-pinned-badge-card--platinum .wf-pinned-tier-label,
[data-theme="light"] .wf-pinned-badge-card--platinum .wf-pinned-tier-label,
html:not(.dark) .wf-pinned-badge-card--platinum .wf-pinned-tier-label {
  color: #0891b2 !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
}

.wf-profile--light .wf-pinned-badge-card--gold .wf-pinned-tier-label,
[data-theme="light"] .wf-pinned-badge-card--gold .wf-pinned-tier-label,
html:not(.dark) .wf-pinned-badge-card--gold .wf-pinned-tier-label {
  color: #d97706 !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
}

.wf-profile--light .wf-pinned-badge-card--silver .wf-pinned-tier-label,
[data-theme="light"] .wf-pinned-badge-card--silver .wf-pinned-tier-label,
html:not(.dark) .wf-pinned-badge-card--silver .wf-pinned-tier-label {
  color: #475569 !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
}

.wf-profile--light .wf-pinned-badge-card--bronze .wf-pinned-tier-label,
[data-theme="light"] .wf-pinned-badge-card--bronze .wf-pinned-tier-label,
html:not(.dark) .wf-pinned-badge-card--bronze .wf-pinned-tier-label {
  color: #ea580c !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
}

/* Pinned PTS pill */
.wf-profile--light .wf-pinned-pts,
[data-theme="light"] .wf-pinned-pts,
html:not(.dark) .wf-pinned-pts {
  color: #475569 !important;
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  padding: 2px 7px !important;
  border-radius: 5px !important;
  font-family: var(--font-mono, monospace) !important;
  font-weight: 800 !important;
  font-size: 0.65rem !important;
  letter-spacing: 0.04em !important;
}

.wf-profile--light .wf-pinned-badge-title,
[data-theme="light"] .wf-pinned-badge-title,
html:not(.dark) .wf-pinned-badge-title {
  color: #0f172a !important;
  font-weight: 800 !important;
  font-size: 0.94rem !important;
  margin: 3px 0 4px !important;
}

.wf-profile--light .wf-pinned-badge-desc,
[data-theme="light"] .wf-pinned-badge-desc,
html:not(.dark) .wf-pinned-badge-desc {
  color: #475569 !important;
  font-size: 0.78rem !important;
  line-height: 1.45 !important;
  margin: 0 !important;
}

.wf-profile--light .wf-view-all-badges-btn,
[data-theme="light"] .wf-view-all-badges-btn,
html:not(.dark) .wf-view-all-badges-btn {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #334155 !important;
}

.wf-profile--light .wf-view-all-badges-btn:hover,
[data-theme="light"] .wf-view-all-badges-btn:hover,
html:not(.dark) .wf-view-all-badges-btn:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.16) !important;
}

/* Tab 3 Badges Vault boxes in light mode */
.wf-profile--light .wf-badge-card--unlocked,
[data-theme="light"] .wf-badge-card--unlocked,
html:not(.dark) .wf-badge-card--unlocked {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04) !important;
}

.wf-profile--light .wf-badge-card--unlocked:hover,
[data-theme="light"] .wf-badge-card--unlocked:hover,
html:not(.dark) .wf-badge-card--unlocked:hover {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.18) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07) !important;
}

.wf-profile--light .wf-badge-card--locked,
[data-theme="light"] .wf-badge-card--locked,
html:not(.dark) .wf-badge-card--locked {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  opacity: 0.85 !important;
}

.wf-profile--light .wf-badge-icon--tier-mythic.wf-badge-icon--unlocked,
[data-theme="light"] .wf-badge-icon--tier-mythic.wf-badge-icon--unlocked,
html:not(.dark) .wf-badge-icon--tier-mythic.wf-badge-icon--unlocked {
  background: rgba(168, 85, 247, 0.12) !important;
  border: 1px solid rgba(168, 85, 247, 0.28) !important;
  color: #9333ea !important;
}

.wf-profile--light .wf-badge-icon--tier-platinum.wf-badge-icon--unlocked,
[data-theme="light"] .wf-badge-icon--tier-platinum.wf-badge-icon--unlocked,
html:not(.dark) .wf-badge-icon--tier-platinum.wf-badge-icon--unlocked {
  background: rgba(6, 182, 212, 0.12) !important;
  border: 1px solid rgba(6, 182, 212, 0.28) !important;
  color: #0891b2 !important;
}

.wf-profile--light .wf-badge-icon--tier-gold.wf-badge-icon--unlocked,
[data-theme="light"] .wf-badge-icon--tier-gold.wf-badge-icon--unlocked,
html:not(.dark) .wf-badge-icon--tier-gold.wf-badge-icon--unlocked {
  background: rgba(245, 158, 11, 0.12) !important;
  border: 1px solid rgba(245, 158, 11, 0.28) !important;
  color: #d97706 !important;
}

.wf-profile--light .wf-badge-icon--tier-silver.wf-badge-icon--unlocked,
[data-theme="light"] .wf-badge-icon--tier-silver.wf-badge-icon--unlocked,
html:not(.dark) .wf-badge-icon--tier-silver.wf-badge-icon--unlocked {
  background: rgba(100, 116, 139, 0.1) !important;
  border: 1px solid rgba(100, 116, 139, 0.24) !important;
  color: #475569 !important;
}

.wf-profile--light .wf-badge-icon--tier-bronze.wf-badge-icon--unlocked,
[data-theme="light"] .wf-badge-icon--tier-bronze.wf-badge-icon--unlocked,
html:not(.dark) .wf-badge-icon--tier-bronze.wf-badge-icon--unlocked {
  background: rgba(249, 115, 22, 0.12) !important;
  border: 1px solid rgba(249, 115, 22, 0.28) !important;
  color: #ea580c !important;
}

.wf-profile--light .wf-badge-icon--locked,
[data-theme="light"] .wf-badge-icon--locked,
html:not(.dark) .wf-badge-icon--locked {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #94a3b8 !important;
}

.wf-profile--light .wf-tier-tag,
[data-theme="light"] .wf-tier-tag,
html:not(.dark) .wf-tier-tag {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.wf-profile--light .wf-badge-title,
[data-theme="light"] .wf-badge-title,
html:not(.dark) .wf-badge-title {
  color: #0f172a !important;
}

.wf-profile--light .wf-badge-desc,
[data-theme="light"] .wf-badge-desc,
html:not(.dark) .wf-badge-desc {
  color: #475569 !important;
}

.wf-profile--light .wf-progress-track,
[data-theme="light"] .wf-progress-track,
html:not(.dark) .wf-progress-track {
  background: rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-achieve-kpi-card,
[data-theme="light"] .wf-achieve-kpi-card,
html:not(.dark) .wf-achieve-kpi-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

/* 10. Chart & Weekly Heatmap */
.wf-profile--light .wf-chart-box,
[data-theme="light"] .wf-chart-box,
html:not(.dark) .wf-chart-box {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-total-actions-pill,
[data-theme="light"] .wf-total-actions-pill,
html:not(.dark) .wf-total-actions-pill {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #334155 !important;
}

.wf-profile--light .wf-bars-shelf,
[data-theme="light"] .wf-bars-shelf,
html:not(.dark) .wf-bars-shelf {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.wf-profile--light .wf-bar-month,
[data-theme="light"] .wf-bar-month,
html:not(.dark) .wf-bar-month {
  color: #64748b !important;
}

.wf-profile--light .wf-weekly-heatmap-box,
[data-theme="light"] .wf-weekly-heatmap-box,
html:not(.dark) .wf-weekly-heatmap-box {
  border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-heatmap-title,
[data-theme="light"] .wf-heatmap-title,
html:not(.dark) .wf-heatmap-title,
.wf-profile--light .wf-legend-text,
[data-theme="light"] .wf-legend-text,
html:not(.dark) .wf-legend-text {
  color: #64748b !important;
}

.wf-profile--light .wf-heat-block--0,
[data-theme="light"] .wf-heat-block--0,
html:not(.dark) .wf-heat-block--0 {
  background: rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-heat-cell,
[data-theme="light"] .wf-heat-cell,
html:not(.dark) .wf-heat-cell {
  border-color: rgba(0, 0, 0, 0.05) !important;
}

/* 11. Commits & Document Feeds */
.wf-profile--light .wf-commit-item,
[data-theme="light"] .wf-commit-item,
html:not(.dark) .wf-commit-item {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-commit-item:hover,
[data-theme="light"] .wf-commit-item:hover,
html:not(.dark) .wf-commit-item:hover {
  background: #f1f5f9 !important;
  border-color: rgba(0, 0, 0, 0.14) !important;
}

.wf-profile--light .wf-commit-msg,
[data-theme="light"] .wf-commit-msg,
html:not(.dark) .wf-commit-msg {
  color: #1e293b !important;
}

.wf-profile--light .wf-commit-date,
[data-theme="light"] .wf-commit-date,
html:not(.dark) .wf-commit-date {
  color: #64748b !important;
}

.wf-profile--light .wf-commit-hash,
[data-theme="light"] .wf-commit-hash,
html:not(.dark) .wf-commit-hash {
  color: #0284c7 !important;
}

.wf-profile--light .wf-doc-item,
[data-theme="light"] .wf-doc-item,
html:not(.dark) .wf-doc-item {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.wf-profile--light .wf-doc-item:hover,
[data-theme="light"] .wf-doc-item:hover,
html:not(.dark) .wf-doc-item:hover {
  background: #f1f5f9 !important;
  border-color: rgba(16, 185, 129, 0.4) !important;
}

.wf-profile--light .wf-doc-path,
[data-theme="light"] .wf-doc-path,
html:not(.dark) .wf-doc-path {
  color: #0f172a !important;
}

.wf-profile--light .wf-doc-submsg,
[data-theme="light"] .wf-doc-submsg,
html:not(.dark) .wf-doc-submsg,
.wf-profile--light .wf-doc-date,
[data-theme="light"] .wf-doc-date,
html:not(.dark) .wf-doc-date {
  color: #64748b !important;
}

/* 12. Connected Passports (Identități Conectate) */
.wf-profile--light .wf-social-card,
[data-theme="light"] .wf-social-card,
html:not(.dark) .wf-social-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-social-card:hover,
[data-theme="light"] .wf-social-card:hover,
html:not(.dark) .wf-social-card:hover {
  background: #f8fafc !important;
  border-color: rgba(0, 0, 0, 0.16) !important;
}

.wf-profile--light .wf-social-card--gh:hover,
[data-theme="light"] .wf-social-card--gh:hover,
html:not(.dark) .wf-social-card--gh:hover {
  border-color: rgba(15, 23, 42, 0.3) !important;
  background: #f8fafc !important;
}

.wf-profile--light .wf-social-card--dc:hover,
[data-theme="light"] .wf-social-card--dc:hover,
html:not(.dark) .wf-social-card--dc:hover {
  border-color: rgba(88, 101, 242, 0.35) !important;
  background: rgba(88, 101, 242, 0.05) !important;
}

.wf-profile--light .wf-social-card--st:hover,
[data-theme="light"] .wf-social-card--st:hover,
html:not(.dark) .wf-social-card--st:hover {
  border-color: rgba(14, 116, 144, 0.35) !important;
  background: rgba(14, 116, 144, 0.05) !important;
}

.wf-profile--light .wf-social-user-heading,
[data-theme="light"] .wf-social-user-heading,
html:not(.dark) .wf-social-user-heading {
  color: #0f172a !important;
}

.wf-profile--light .wf-platform-name,
[data-theme="light"] .wf-platform-name,
html:not(.dark) .wf-platform-name {
  color: #475569 !important;
}

.wf-profile--light .wf-platform-status,
[data-theme="light"] .wf-platform-status,
html:not(.dark) .wf-platform-status {
  background: rgba(0, 0, 0, 0.05) !important;
  color: #64748b !important;
}

.wf-profile--light .wf-social-subtext,
[data-theme="light"] .wf-social-subtext,
html:not(.dark) .wf-social-subtext {
  color: #64748b !important;
}

.wf-profile--light .wf-social-pfp,
[data-theme="light"] .wf-social-pfp,
html:not(.dark) .wf-social-pfp {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

.wf-profile--light .wf-social-pfp-fallback,
[data-theme="light"] .wf-social-pfp-fallback,
html:not(.dark) .wf-social-pfp-fallback {
  background: #f1f5f9 !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: #475569 !important;
}

.wf-profile--light .wf-social-sub-badge,
[data-theme="light"] .wf-social-sub-badge,
html:not(.dark) .wf-social-sub-badge {
  border-color: #ffffff !important;
}

.wf-profile--light .wf-action-mini-btn,
[data-theme="light"] .wf-action-mini-btn,
html:not(.dark) .wf-action-mini-btn {
  background: #f1f5f9 !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #475569 !important;
}

.wf-profile--light .wf-action-mini-btn:hover,
[data-theme="light"] .wf-action-mini-btn:hover,
html:not(.dark) .wf-action-mini-btn:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

/* 13. Tab 2 Timeline View Elements */
.wf-profile--light .wf-subfilter-btn,
[data-theme="light"] .wf-subfilter-btn,
html:not(.dark) .wf-subfilter-btn {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #475569 !important;
}

.wf-profile--light .wf-subfilter-btn:hover,
[data-theme="light"] .wf-subfilter-btn:hover,
html:not(.dark) .wf-subfilter-btn:hover {
  background: #f8fafc !important;
  color: #0f172a !important;
}

.wf-profile--light .wf-subfilter-btn--active,
[data-theme="light"] .wf-subfilter-btn--active,
html:not(.dark) .wf-subfilter-btn--active {
  background: var(--accent-tint, rgba(16, 185, 129, 0.14)) !important;
  color: #0f172a !important;
  border-color: var(--accent, #059669) !important;
}

.wf-profile--light .wf-search-input,
[data-theme="light"] .wf-search-input,
html:not(.dark) .wf-search-input {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  color: #0f172a !important;
}

.wf-profile--light .wf-timeline-line,
[data-theme="light"] .wf-timeline-line,
html:not(.dark) .wf-timeline-line {
  background: rgba(0, 0, 0, 0.08) !important;
}

.wf-profile--light .wf-timeline-dot,
[data-theme="light"] .wf-timeline-dot,
html:not(.dark) .wf-timeline-dot {
  background: #ffffff !important;
}

.wf-profile--light .wf-timeline-card,
[data-theme="light"] .wf-timeline-card,
html:not(.dark) .wf-timeline-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
}

.wf-profile--light .wf-timeline-card:hover,
[data-theme="light"] .wf-timeline-card:hover,
html:not(.dark) .wf-timeline-card:hover {
  background: #f8fafc !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
}

.wf-profile--light .wf-timeline-title,
[data-theme="light"] .wf-timeline-title,
html:not(.dark) .wf-timeline-title {
  color: #0f172a !important;
}

.wf-profile--light .wf-timeline-hash,
[data-theme="light"] .wf-timeline-hash,
html:not(.dark) .wf-timeline-hash {
  color: #0284c7 !important;
}

.wf-profile--light .wf-timeline-date,
[data-theme="light"] .wf-timeline-date,
html:not(.dark) .wf-timeline-date {
  color: #64748b !important;
}

/* 14. Footer Roster Quick Switcher */
.wf-profile--light .wf-roster-shelf,
[data-theme="light"] .wf-roster-shelf,
html:not(.dark) .wf-roster-shelf {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.wf-profile--light .wf-roster-shelf-title,
[data-theme="light"] .wf-roster-shelf-title,
html:not(.dark) .wf-roster-shelf-title {
  color: #0f172a !important;
}

.wf-profile--light .wf-roster-shelf-sub,
[data-theme="light"] .wf-roster-shelf-sub,
html:not(.dark) .wf-roster-shelf-sub {
  color: #64748b !important;
}

.wf-profile--light .wf-roster-all-btn,
[data-theme="light"] .wf-roster-all-btn,
html:not(.dark) .wf-roster-all-btn {
  background: #f8fafc !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: #334155 !important;
}

.wf-profile--light .wf-roster-all-btn:hover,
[data-theme="light"] .wf-roster-all-btn:hover,
html:not(.dark) .wf-roster-all-btn:hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
}

.wf-profile--light .wf-roster-mini-card,
[data-theme="light"] .wf-roster-mini-card,
html:not(.dark) .wf-roster-mini-card {
  background: #f8fafc !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.wf-profile--light .wf-roster-mini-card:hover,
[data-theme="light"] .wf-roster-mini-card:hover,
html:not(.dark) .wf-roster-mini-card:hover {
  background: #f1f5f9 !important;
  border-color: rgba(0, 0, 0, 0.16) !important;
}

.wf-profile--light .wf-roster-mini-name,
[data-theme="light"] .wf-roster-mini-name,
html:not(.dark) .wf-roster-mini-name {
  color: #0f172a !important;
}

.wf-profile--light .wf-roster-mini-title,
[data-theme="light"] .wf-roster-mini-title,
html:not(.dark) .wf-roster-mini-title {
  color: #64748b !important;
}

.wf-profile--light .wf-roster-mini-avatar-wrap,
[data-theme="light"] .wf-roster-mini-avatar-wrap,
html:not(.dark) .wf-roster-mini-avatar-wrap {
  border-color: rgba(0, 0, 0, 0.1) !important;
  background: #ffffff !important;
}
</style>
