import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getPublicTeamMembers, TeamMember, PublicTeamMember } from '@server/lib/security/teamStore';
import { getGitOpsSettings } from '@server/lib/gitops/store';

export interface RepoCommit {
  hash: string;
  shortHash: string;
  authorName: string;
  authorEmail: string;
  date: string; // YYYY-MM-DD
  dateTime: string; // ISO String
  message: string;
  body: string;
  files: string[];
}

export interface GithubGraphContributor {
  login: string;
  id?: number;
  avatarUrl: string;
  profileUrl: string;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  weeks: {
    weekTimestamp: number;
    weekDate: string;
    additions: number;
    deletions: number;
    commits: number;
  }[];
  activeWeeksCount: number;
}

export interface ContributorRepoStats {
  username: string;
  displayName: string;
  githubUsername?: string;
  totalCommits: number;
  docsCommits: number;
  monthlyActivity: { month: string; count: number }[];
  recentFiles: { file: string; message: string; date: string; commitHash: string }[];
  recentCommits: { hash: string; shortHash: string; message: string; date: string; url?: string }[];
  githubContributions?: number;
  githubGraph?: GithubGraphContributor;
  isMatchedWithGithub: boolean;
  matchType:
    | 'exact_github_handle'
    | 'username_match'
    | 'display_name_match'
    | 'local_git_match'
    | 'unlinked';
  lastActiveDate?: string;
}

const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'iannC69';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'wf-docscore';

// ── In-Memory Cache (TTL: 3 seconds for live sync) ───────────────────────────
let _cachedCommits: RepoCommit[] | null = null;
let _cachedCommitsTimestamp = 0;
const COMMITS_CACHE_TTL_MS = 3 * 1000;

let _cachedGithubGraph: GithubGraphContributor[] | null = null;
let _cachedGithubGraphTimestamp = 0;

/**
 * Invalidate repo stats cache after saving doc changes.
 */
export function invalidateRepoStatsCache(): void {
  _cachedCommits = null;
  _cachedCommitsTimestamp = 0;
}

/**
 * Extracts all commits from the local Git repository with file names and author info.
 */
export function getLocalRepoCommits(): RepoCommit[] {
  const now = Date.now();
  if (_cachedCommits && now - _cachedCommitsTimestamp < COMMITS_CACHE_TTL_MS) {
    return _cachedCommits;
  }

  try {
    const raw = execSync(
      'git log --pretty=format:"COMMIT_START|%H|%h|%an|%ae|%ad|%s%n%b%nCOMMIT_FILES" --name-only --date=iso',
      {
        cwd: process.cwd(),
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true,
      },
    );

    const commitBlocks = raw.split('COMMIT_START|').filter(Boolean);
    const commits: RepoCommit[] = [];

    for (const block of commitBlocks) {
      const [headerAndBody, filesSection] = block.split('COMMIT_FILES');
      if (!headerAndBody) continue;

      const lines = headerAndBody.trim().split('\n');
      const [hash, shortHash, authorName, authorEmail, dateIso, ...msgParts] = lines[0].split('|');
      const message = msgParts.join('|') || 'Commit update';
      const body = lines.slice(1).join('\n').trim();
      const files = filesSection
        ? filesSection
            .trim()
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean)
        : [];

      commits.push({
        hash: hash || '',
        shortHash: shortHash || (hash ? hash.slice(0, 7) : ''),
        authorName: authorName || '',
        authorEmail: authorEmail || '',
        date: dateIso ? dateIso.slice(0, 10) : new Date().toISOString().slice(0, 10),
        dateTime: dateIso || new Date().toISOString(),
        message,
        body,
        files,
      });
    }

    _cachedCommits = commits;
    _cachedCommitsTimestamp = now;
    return commits;
  } catch (err) {
    console.error('[RepoContributions] Failed to extract local git commits:', err);
    return _cachedCommits || [];
  }
}

/**
 * Fetches full GitHub graph contributor statistics from the active public documentation repository.
 */
export async function getGithubGraphContributors(): Promise<GithubGraphContributor[]> {
  const now = Date.now();
  if (_cachedGithubGraph && now - _cachedGithubGraphTimestamp < COMMITS_CACHE_TTL_MS) {
    return _cachedGithubGraph;
  }

  const gitops = getGitOpsSettings();
  const targetOwner = gitops.publicRepo?.owner || GITHUB_REPO_OWNER;
  const targetRepo = gitops.publicRepo?.repo || GITHUB_REPO_NAME;
  const activeToken = gitops.sync?.githubToken || process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    'User-Agent': 'WF-DocsCore-ContributorSync',
    Accept: 'application/vnd.github.v3+json',
  };
  if (activeToken && activeToken.trim()) {
    headers.Authorization = `Bearer ${activeToken.trim()}`;
  }

  try {
    let res = await fetch(
      `https://api.github.com/repos/${targetOwner}/${targetRepo}/stats/contributors`,
      { headers },
    );

    // If GitHub is calculating the graph (status 202), wait 1s and retry once
    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, 1200));
      res = await fetch(
        `https://api.github.com/repos/${targetOwner}/${targetRepo}/stats/contributors`,
        { headers },
      );
    }

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const parsed: GithubGraphContributor[] = data.map((item: any) => {
          const totalAdd = item.weeks
            ? item.weeks.reduce((acc: number, w: any) => acc + (w.a || 0), 0)
            : 0;
          const totalDel = item.weeks
            ? item.weeks.reduce((acc: number, w: any) => acc + (w.d || 0), 0)
            : 0;
          const activeWeeks = item.weeks
            ? item.weeks.filter((w: any) => w.c > 0 || w.a > 0 || w.d > 0)
            : [];

          return {
            login: item.author?.login || '',
            id: item.author?.id,
            avatarUrl: item.author?.avatar_url || '',
            profileUrl: item.author?.html_url || `https://github.com/${item.author?.login}`,
            totalCommits: item.total || 0,
            totalAdditions: totalAdd,
            totalDeletions: totalDel,
            weeks: (item.weeks || []).map((w: any) => ({
              weekTimestamp: w.w,
              weekDate: new Date(w.w * 1000).toISOString().slice(0, 10),
              additions: w.a,
              deletions: w.d,
              commits: w.c,
            })),
            activeWeeksCount: activeWeeks.length,
          };
        });

        _cachedGithubGraph = parsed;
        _cachedGithubGraphTimestamp = now;
        return parsed;
      }
    }
  } catch (err) {
    console.error('[RepoContributions] Failed to fetch GitHub stats/contributors:', err);
  }

  // Fallback to /contributors endpoint
  try {
    const res = await fetch(
      `https://api.github.com/repos/${targetOwner}/${targetRepo}/contributors`,
      { headers },
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const parsed: GithubGraphContributor[] = data.map((item: any) => ({
          login: item.login || '',
          id: item.id,
          avatarUrl: item.avatar_url || '',
          profileUrl: item.html_url || `https://github.com/${item.login}`,
          totalCommits: item.contributions || 0,
          totalAdditions: 0,
          totalDeletions: 0,
          weeks: [],
          activeWeeksCount: 0,
        }));

        _cachedGithubGraph = parsed;
        _cachedGithubGraphTimestamp = now;
        return parsed;
      }
    }
  } catch (err) {
    console.error('[RepoContributions] Fallback contributors fetch failed:', err);
  }

  return _cachedGithubGraph || [];
}

/**
 * Checks whether a given commit belongs to a team member.
 */
function matchCommitToMember(
  commit: RepoCommit,
  member: { username: string; displayName: string; githubUsername?: string; email?: string },
): boolean {
  const authorName = (commit.authorName || '').toLowerCase().trim();
  const authorEmail = (commit.authorEmail || '').toLowerCase().trim();
  const commitBody = (commit.body || '').toLowerCase();
  const commitMsg = (commit.message || '').toLowerCase();

  const uname = (member.username || '').toLowerCase().trim();
  const dname = (member.displayName || '').toLowerCase().trim();
  const ghUser = (member.githubUsername || '').toLowerCase().trim();
  const email = (member.email || '').toLowerCase().trim();

  // Root Super Admin direct identity match
  if (
    (uname === 'iannc69' || uname === 'iannc') &&
    (authorEmail.includes('solwolfs') || authorName.includes('iann'))
  ) {
    return true;
  }

  // Exact or Substring match on Author Name & Email
  if (uname && (authorName === uname || authorEmail.includes(uname))) return true;
  if (dname && (authorName === dname || authorEmail.includes(dname))) return true;
  if (ghUser && (authorName === ghUser || authorEmail.includes(ghUser))) return true;
  if (email && authorEmail === email) return true;

  // Conventional commit scope match: docs(yakuza): ... or docs(v1ccx): ...
  if (uname && (commitMsg.startsWith(`docs(${uname})`) || commitMsg.includes(`(${uname}):`)))
    return true;
  if (ghUser && (commitMsg.startsWith(`docs(${ghUser})`) || commitMsg.includes(`(${ghUser}):`)))
    return true;
  if (dname && (commitMsg.startsWith(`docs(${dname})`) || commitMsg.includes(`(${dname}):`)))
    return true;

  // Co-authors or Signed-off signatures
  const candidates = [uname, dname, ghUser, email].filter(Boolean);
  for (const cand of candidates) {
    if (commitBody.includes(`co-authored-by: ${cand}`) || commitBody.includes(`author: ${cand}`))
      return true;
    if (
      commitMsg.includes(`co-authored-by: ${cand}`) ||
      commitMsg.includes(`signed-off-by: ${cand}`)
    )
      return true;
  }

  return false;
}

/**
 * Reconciles a team member with GitHub Contributors Graph data.
 */
export function getMemberRepoStats(
  member: {
    username: string;
    displayName: string;
    githubUsername?: string;
    email?: string;
    docsModifiedCount?: number;
  },
  allCommits?: RepoCommit[],
  githubGraphContributors?: GithubGraphContributor[],
): ContributorRepoStats {
  const commits = allCommits || getLocalRepoCommits();
  const memberCommits = commits.filter((c) => matchCommitToMember(c, member));

  // Match with GitHub Graph Contributor
  let matchedGraph: GithubGraphContributor | undefined;
  let matchType: ContributorRepoStats['matchType'] = 'unlinked';

  if (githubGraphContributors && githubGraphContributors.length > 0) {
    const handle = (member.githubUsername || '').toLowerCase();
    const uname = (member.username || '').toLowerCase();
    const dname = (member.displayName || '').toLowerCase();

    matchedGraph = githubGraphContributors.find((gc) => {
      const gLogin = gc.login.toLowerCase();
      if (handle && gLogin === handle) {
        matchType = 'exact_github_handle';
        return true;
      }
      if (gLogin === uname) {
        matchType = 'username_match';
        return true;
      }
      if (gLogin === dname) {
        matchType = 'display_name_match';
        return true;
      }
      return false;
    });
  }

  if (!matchedGraph && memberCommits.length > 0) {
    matchType = 'local_git_match';
  }

  // 6 months activity timeline
  const now = new Date();
  const monthlyActivity: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const count = memberCommits.filter((c) => c.date.startsWith(monthStr)).length;
    monthlyActivity.push({ month: monthStr, count });
  }

  // Recent modified files
  const recentFiles: { file: string; message: string; date: string; commitHash: string }[] = [];
  const seenFiles = new Set<string>();

  for (const c of memberCommits) {
    for (const file of c.files) {
      if (!seenFiles.has(file) && recentFiles.length < 15) {
        seenFiles.add(file);
        recentFiles.push({
          file,
          message: c.message,
          date: c.date,
          commitHash: c.shortHash,
        });
      }
    }
  }

  // Count unique doc files modified across all commits + docsModifiedCount
  const docsInGit = new Set<string>();
  for (const c of memberCommits) {
    for (const file of c.files) {
      if (
        (file.startsWith('content/docs/') || file.includes('/docs/')) &&
        (file.endsWith('.md') || file.endsWith('.mdx'))
      ) {
        docsInGit.add(file.replace(/\\/g, '/'));
      }
    }
  }

  const docsCommitsCount = Math.max(
    docsInGit.size,
    memberCommits.filter((c) =>
      c.files.some((f) => f.startsWith('content/docs/') || f.includes('/docs/')),
    ).length,
    member.docsModifiedCount || 0,
  );

  const totalCommits = Math.max(memberCommits.length, matchedGraph?.totalCommits || 0);

  return {
    username: member.username,
    displayName: member.displayName,
    githubUsername: member.githubUsername || matchedGraph?.login,
    totalCommits,
    docsCommits: docsCommitsCount,
    monthlyActivity,
    recentFiles,
    recentCommits: memberCommits.slice(0, 10).map((c) => ({
      hash: c.hash,
      shortHash: c.shortHash,
      message: c.message,
      date: c.date,
      url: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commit/${c.hash}`,
    })),
    githubContributions: matchedGraph?.totalCommits,
    githubGraph: matchedGraph,
    isMatchedWithGithub: Boolean(matchedGraph),
    matchType,
    lastActiveDate: memberCommits[0]?.date,
  };
}

/**
 * Computes repository stats for all active team members simultaneously with GitHub Graph reconciliation.
 */
export async function getAllTeamRepoStats(): Promise<{
  statsMap: Record<string, ContributorRepoStats>;
  githubGraphContributors: GithubGraphContributor[];
  unlinkedGithubContributors: GithubGraphContributor[];
}> {
  const members = await getPublicTeamMembers();
  const allCommits = getLocalRepoCommits();
  const graphContributors = await getGithubGraphContributors();

  const statsMap: Record<string, ContributorRepoStats> = {};
  const matchedLogins = new Set<string>();

  for (const m of members) {
    const stats = getMemberRepoStats(m, allCommits, graphContributors);
    statsMap[m.username.toLowerCase()] = stats;
    if (stats.githubGraph?.login) {
      matchedLogins.add(stats.githubGraph.login.toLowerCase());
    }
  }

  const unlinkedGithubContributors = graphContributors.filter(
    (gc) => !matchedLogins.has(gc.login.toLowerCase()),
  );

  return { statsMap, githubGraphContributors: graphContributors, unlinkedGithubContributors };
}
