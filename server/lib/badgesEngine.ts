import { ContributorRepoStats, GithubGraphContributor } from './repoContributions';
import { PublicTeamMember, TeamMember } from './security/teamStore';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic';
export type BadgeCategory = 'git' | 'docs' | 'security' | 'community' | 'special';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  iconName: string; // Lucide icon key name
  accentColor: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: {
    current: number;
    max: number;
    label: string;
    percentage: number;
  };
}

export interface MemberAchievementsSummary {
  username: string;
  totalUnlocked: number;
  totalAvailable: number;
  completionPercentage: number;
  reputationPoints: number;
  tierCounts: Record<BadgeTier, number>;
  badges: AchievementBadge[];
}

const TIER_POINTS: Record<BadgeTier, number> = {
  bronze: 25,
  silver: 50,
  gold: 100,
  platinum: 250,
  mythic: 500,
};

const TIER_COLORS: Record<BadgeTier, string> = {
  bronze: 'hsl(25 85% 55%)',
  silver: 'hsl(215 25% 75%)',
  gold: 'hsl(43 96% 52%)',
  platinum: 'hsl(186 100% 50%)',
  mythic: 'hsl(280 100% 65%)',
};

/**
 * Calculates all dynamic badges for a team member based on real Git & profile metrics.
 */
export function calculateMemberAchievements(
  member: TeamMember | PublicTeamMember,
  gitStats?: ContributorRepoStats | null,
  githubGraph?: GithubGraphContributor | null,
): MemberAchievementsSummary {
  const totalCommits = gitStats?.totalCommits || 0;
  const docsCommits = gitStats?.docsCommits || 0;
  const totalAdditions = githubGraph?.totalAdditions || 0;
  const totalDeletions = githubGraph?.totalDeletions || 0;
  const totalLinesModified = totalAdditions + totalDeletions;

  const hasGithub = Boolean(member.githubUsername && member.githubUsername.trim().length > 0);
  const hasDiscord = Boolean(member.discord && member.discord.trim().length > 0);
  const hasSteam = Boolean(member.steamId && member.steamId.trim().length > 0);
  const connectedCount = [hasGithub, hasDiscord, hasSteam].filter(Boolean).length;

  const perms = ('permissions' in member ? member.permissions : undefined) || ({} as any);
  const activePermsCount = Object.values(perms).filter(Boolean).length;
  const isRoot = Boolean(member.isRoot || member.role === 'root_admin');

  const badges: AchievementBadge[] = [
    // ── Mythic Tier ──────────────────────────────────────────────
    {
      id: 'root-sovereign',
      title: 'Root Sovereign',
      description: 'Autoritate supremă de sistem cu imunitate completă și permisiuni absolute.',
      category: 'security',
      tier: 'mythic',
      iconName: 'Crown',
      accentColor: TIER_COLORS.mythic,
      unlocked: isRoot,
      progress: {
        current: isRoot ? 1 : 0,
        max: 1,
        label: isRoot ? 'Autoritate Root Activă' : 'Nivel Root Indisponibil',
        percentage: isRoot ? 100 : 0,
      },
    },
    {
      id: 'mythic-founder',
      title: 'Mythic Architect',
      description:
        'A generat și structurat nucleul arhitectural al documentației cu peste 75 de commit-uri.',
      category: 'git',
      tier: 'mythic',
      iconName: 'Zap',
      accentColor: TIER_COLORS.mythic,
      unlocked: totalCommits >= 75,
      progress: {
        current: Math.min(totalCommits, 75),
        max: 75,
        label: `${totalCommits} / 75 Commit-uri`,
        percentage: Math.min(100, Math.round((totalCommits / 75) * 100)),
      },
    },

    // ── Platinum Tier ────────────────────────────────────────────
    {
      id: 'titan-contributor',
      title: 'Titan Contributor',
      description:
        'A depășit pragul de 50 de commit-uri verificate în ramura principală a repository-ului.',
      category: 'git',
      tier: 'platinum',
      iconName: 'GitCommit',
      accentColor: TIER_COLORS.platinum,
      unlocked: totalCommits >= 50,
      progress: {
        current: Math.min(totalCommits, 50),
        max: 50,
        label: `${totalCommits} / 50 Commit-uri`,
        percentage: Math.min(100, Math.round((totalCommits / 50) * 100)),
      },
    },
    {
      id: 'code-surgeon',
      title: 'Code Surgeon',
      description:
        'A operat modificări masive de peste 20.000 de linii de cod în GitHub Contributors Graph.',
      category: 'git',
      tier: 'platinum',
      iconName: 'Sparkles',
      accentColor: TIER_COLORS.platinum,
      unlocked: totalLinesModified >= 20000,
      progress: {
        current: Math.min(totalLinesModified, 20000),
        max: 20000,
        label: `${totalLinesModified.toLocaleString()} / 20.000 Linii Modificate`,
        percentage: Math.min(100, Math.round((totalLinesModified / 20000) * 100)),
      },
    },

    // ── Gold Tier ────────────────────────────────────────────────
    {
      id: 'documentation-maestro',
      title: 'Documentation Maestro',
      description: 'A creat sau actualizat peste 10 ghiduri și documentații din portal.',
      category: 'docs',
      tier: 'gold',
      iconName: 'BookOpen',
      accentColor: TIER_COLORS.gold,
      unlocked: docsCommits >= 10,
      progress: {
        current: Math.min(docsCommits, 10),
        max: 10,
        label: `${docsCommits} / 10 Ghiduri Modificate`,
        percentage: Math.min(100, Math.round((docsCommits / 10) * 100)),
      },
    },
    {
      id: 'commit-master',
      title: 'Commit Master',
      description: 'A înregistrat cel puțin 20 de commit-uri de calitate în repository.',
      category: 'git',
      tier: 'gold',
      iconName: 'GitBranch',
      accentColor: TIER_COLORS.gold,
      unlocked: totalCommits >= 20,
      progress: {
        current: Math.min(totalCommits, 20),
        max: 20,
        label: `${totalCommits} / 20 Commit-uri`,
        percentage: Math.min(100, Math.round((totalCommits / 20) * 100)),
      },
    },
    {
      id: 'trinity-identity',
      title: 'Trinity Identity',
      description: 'Are asociate toate cele 3 platforme principale: GitHub, Discord și Steam.',
      category: 'community',
      tier: 'gold',
      iconName: 'Flame',
      accentColor: TIER_COLORS.gold,
      unlocked: connectedCount === 3,
      progress: {
        current: connectedCount,
        max: 3,
        label: `${connectedCount} / 3 Conturi Conectate`,
        percentage: Math.round((connectedCount / 3) * 100),
      },
    },
    {
      id: 'security-bastion',
      title: 'Security Bastion',
      description: 'Deține cel puțin 8 permisiuni administrative active în sistemul RBAC.',
      category: 'security',
      tier: 'gold',
      iconName: 'ShieldCheck',
      accentColor: TIER_COLORS.gold,
      unlocked: activePermsCount >= 8,
      progress: {
        current: Math.min(activePermsCount, 8),
        max: 8,
        label: `${activePermsCount} / 8 Permisiuni RBAC`,
        percentage: Math.min(100, Math.round((activePermsCount / 8) * 100)),
      },
    },

    // ── Silver Tier ──────────────────────────────────────────────
    {
      id: 'git-contributor',
      title: 'Git Contributor',
      description: 'A atins pragul de 5 commit-uri în repository-ul oficial.',
      category: 'git',
      tier: 'silver',
      iconName: 'GitPullRequest',
      accentColor: TIER_COLORS.silver,
      unlocked: totalCommits >= 5,
      progress: {
        current: Math.min(totalCommits, 5),
        max: 5,
        label: `${totalCommits} / 5 Commit-uri`,
        percentage: Math.min(100, Math.round((totalCommits / 5) * 100)),
      },
    },
    {
      id: 'doc-scribe',
      title: 'Documentation Scribe',
      description: 'A redactat sau modificat cel puțin 3 ghiduri din secțiunea oficială.',
      category: 'docs',
      tier: 'silver',
      iconName: 'FileText',
      accentColor: TIER_COLORS.silver,
      unlocked: docsCommits >= 3,
      progress: {
        current: Math.min(docsCommits, 3),
        max: 3,
        label: `${docsCommits} / 3 Ghiduri Modificate`,
        percentage: Math.min(100, Math.round((docsCommits / 3) * 100)),
      },
    },
    {
      id: 'dual-identity',
      title: 'Dual Link',
      description:
        'Are sincronizate cel puțin 2 identități din comunitate (Discord, Steam sau GitHub).',
      category: 'community',
      tier: 'silver',
      iconName: 'Users',
      accentColor: TIER_COLORS.silver,
      unlocked: connectedCount >= 2,
      progress: {
        current: Math.min(connectedCount, 2),
        max: 2,
        label: `${connectedCount} / 2 Conectări`,
        percentage: Math.min(100, Math.round((connectedCount / 2) * 100)),
      },
    },

    // ── Bronze Tier ──────────────────────────────────────────────
    {
      id: 'git-pioneer',
      title: 'Git Pioneer',
      description: 'A realizat primul commit oficial în istoricul repository-ului.',
      category: 'git',
      tier: 'bronze',
      iconName: 'Terminal',
      accentColor: TIER_COLORS.bronze,
      unlocked: totalCommits >= 1,
      progress: {
        current: Math.min(totalCommits, 1),
        max: 1,
        label: totalCommits >= 1 ? '1 / 1 Primul Commit' : '0 / 1 Niciun Commit',
        percentage: totalCommits >= 1 ? 100 : 0,
      },
    },
    {
      id: 'verified-staff',
      title: 'Verified Staff',
      description: 'Membru oficial activ cu rol și atribuții stabilite în echipa WildFire Docs.',
      category: 'community',
      tier: 'bronze',
      iconName: 'Award',
      accentColor: TIER_COLORS.bronze,
      unlocked: member.status === 'active',
      progress: {
        current: member.status === 'active' ? 1 : 0,
        max: 1,
        label: member.status === 'active' ? 'Membru Activ' : 'Inactiv',
        percentage: member.status === 'active' ? 100 : 0,
      },
    },
    {
      id: 'doc-editor',
      title: 'Content Editor',
      description: 'Deține permisiunea de editare a ghidurilor în Content Studio.',
      category: 'docs',
      tier: 'bronze',
      iconName: 'FileEdit',
      accentColor: TIER_COLORS.bronze,
      unlocked: Boolean(perms.canEditDocs),
      progress: {
        current: perms.canEditDocs ? 1 : 0,
        max: 1,
        label: perms.canEditDocs ? 'Permisiune Acordată' : 'Fără Acces Editare',
        percentage: perms.canEditDocs ? 100 : 0,
      },
    },
  ];

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const totalUnlocked = unlockedBadges.length;
  const totalAvailable = badges.length;
  const completionPercentage = Math.round((totalUnlocked / totalAvailable) * 100);

  const reputationPoints = unlockedBadges.reduce((sum, b) => sum + (TIER_POINTS[b.tier] || 0), 0);

  const tierCounts: Record<BadgeTier, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    mythic: 0,
  };

  for (const b of unlockedBadges) {
    tierCounts[b.tier] = (tierCounts[b.tier] || 0) + 1;
  }

  return {
    username: member.username,
    totalUnlocked,
    totalAvailable,
    completionPercentage,
    reputationPoints,
    tierCounts,
    badges,
  };
}
