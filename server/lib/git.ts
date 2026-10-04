import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { loadTeamMembers, loadTeamMembersSync } from '@server/lib/security/teamStore';

export interface GitCommitInfo {
  authorName: string;
  authorEmail: string;
  authorUsername: string;
  authorDisplayName?: string;
  authorGithubUsername?: string;
  authorProfileUrl?: string;
  authorCustomTitle?: string;
  authorRole?: string;
  authorAvatar: string;
  date: string;
  relativeTime: string;
  commitHash: string;
  commitMessage: string;
  commitUrl?: string;
}

export interface RecentDocItem {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: string;
  readingTime: number;
  lastUpdated: string;
  relativeTime: string;
  authorName: string;
  authorAvatar: string;
  commitHash: string;
  badge?: string;
}

const DOCS_DIR = DOCS_ROOT;

const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'WildFiire';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'docs';
const DEFAULT_AUTHOR = 'iannC69';
const DEFAULT_EMAIL = 'iannc@wildfire.ro';

/**
 * Format date into human-readable relative time (e.g. "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Handle future or zero diff
    if (diffMs < 0 || isNaN(diffMs)) return 'Recently';

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${diffYears}y ago`;
  } catch {
    return 'Recently';
  }
}

export interface ResolvedAuthorProfile {
  username: string;
  displayName: string;
  githubUsername?: string;
  avatarUrl: string;
  profileUrl: string;
  customTitle?: string;
  role?: string;
}

/**
 * Derives team profile, avatar URL, and GitHub metadata dynamically from author name or email.
 * Cross-references with team.json / teamStore.
 */
export function getAuthorProfile(name: string, email: string): ResolvedAuthorProfile {
  try {
    const members = loadTeamMembersSync();
    const cleanName = (name || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check for github noreply pattern: e.g. "Yakuza2377@users.noreply.github.com"
    const ghNoreplyMatch = cleanEmail.match(/^(\d+\+)?([a-z0-9_-]+)@users\.noreply\.github\.com$/i);
    const noreplyGhUser = ghNoreplyMatch ? ghNoreplyMatch[2].toLowerCase() : '';

    // Find in teamStore
    const matchedMember = members.find((m) => {
      if (m.username.toLowerCase() === cleanName) return true;
      if (m.displayName.toLowerCase() === cleanName) return true;
      if (m.githubUsername && m.githubUsername.toLowerCase() === cleanName) return true;
      if (noreplyGhUser && m.githubUsername && m.githubUsername.toLowerCase() === noreplyGhUser)
        return true;
      if (m.email && m.email.toLowerCase() === cleanEmail) return true;
      return false;
    });

    if (matchedMember) {
      const displayName = matchedMember.displayName || matchedMember.username;
      const ghUser = matchedMember.githubUsername;
      const avatar =
        (ghUser ? `https://github.com/${ghUser}.png` : null) ||
        matchedMember.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff&size=64&bold=true`;
      const profileUrl = ghUser ? `https://github.com/${ghUser}` : `/team`;

      return {
        username: matchedMember.username,
        displayName,
        githubUsername: ghUser,
        avatarUrl: avatar,
        profileUrl,
        customTitle: matchedMember.customTitle,
        role: matchedMember.role,
      };
    }
  } catch (err) {
    console.warn('[GitProfile] Error matching team member:', err);
  }

  // If author is repository owner or matches iannC69
  if (
    name.toLowerCase().includes('iannc') ||
    email.toLowerCase().includes('solwolfs') ||
    name.toLowerCase().includes('iann')
  ) {
    return {
      username: 'iannC69',
      displayName: 'iannC',
      githubUsername: 'iannC69',
      avatarUrl: 'https://github.com/iannC69.png',
      profileUrl: 'https://github.com/iannC69',
      customTitle: 'Lead Docs & Systems Architect',
      role: 'root_admin',
    };
  }

  // Fallback for external or unknown committers
  const cleanFallback = name || 'Wildfire Team';
  return {
    username: cleanFallback,
    displayName: cleanFallback,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanFallback)}&background=ff6b00&color=fff&size=64&bold=true`,
    profileUrl: `https://github.com/${encodeURIComponent(cleanFallback)}`,
  };
}

// ── Ultra-Fast In-Memory Git Cache ───────────────────────────────────────────
const _fileGitInfoCache = new Map<string, GitCommitInfo>();
const _firstCommitCache = new Map<string, GitCommitInfo>();
let _recentDocsCache: RecentDocItem[] | null = null;
let _recentDocsCacheTimestamp = 0;
const RECENT_DOCS_TTL_MS = 1000; // 1s live memory cache for instant browser reloads
let _batchLogLoaded = false;
let _batchLogTimestamp = 0;
const BATCH_LOG_TTL_MS = 15 * 1000; // 15s batch history TTL

function loadBatchGitHistory(): void {
  const now = Date.now();
  if (_batchLogLoaded && now - _batchLogTimestamp < BATCH_LOG_TTL_MS) {
    return;
  }

  // 1. Primary Baseline: Load exact local git history for all team members (Yakuza, V1ccX, umpy, iannC)
  try {
    const rawLog = execSync(
      'git log -n 250 --name-only --format="COMMIT|%an|%ae|%ad|%h|%s" --date=iso',
      {
        cwd: process.cwd(),
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true,
        timeout: 3000,
      },
    );

    if (rawLog) {
      const sections = rawLog.split('COMMIT|');
      for (const section of sections) {
        if (!section.trim()) continue;
        const lines = section.trim().split('\n');
        const header = lines[0];
        const parts = header.split('|');
        if (parts.length < 5) continue;

        const authorName = parts[0] || DEFAULT_AUTHOR;
        const authorEmail = parts[1] || DEFAULT_EMAIL;
        const date = parts[2] || new Date().toISOString();
        const commitHash = parts[3] || 'HEAD';
        const commitMessage = parts.slice(4).join('|') || 'Update documentation';
        const profile = getAuthorProfile(authorName, authorEmail);

        const files = lines
          .slice(1)
          .map((l) => l.trim().replace(/\\/g, '/'))
          .filter(Boolean);
        for (const file of files) {
          const fullPath = path.resolve(process.cwd(), file);
          const fullPathDocs = path.resolve(
            process.cwd(),
            file.startsWith('content/') && !file.startsWith('content/docs/')
              ? file.replace(/^content\//, 'content/docs/')
              : file,
          );
          if (!_fileGitInfoCache.has(fullPath)) {
            const commitObj: GitCommitInfo = {
              authorName: profile.displayName || profile.username,
              authorEmail,
              authorUsername: profile.username,
              authorDisplayName: profile.displayName,
              authorGithubUsername: profile.githubUsername,
              authorProfileUrl: profile.profileUrl,
              authorCustomTitle: profile.customTitle,
              authorRole: profile.role,
              authorAvatar: profile.avatarUrl,
              date,
              relativeTime: formatRelativeTime(date),
              commitHash,
              commitMessage,
              commitUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commit/${commitHash}`,
            };
            _fileGitInfoCache.set(fullPath, commitObj);
            _fileGitInfoCache.set(fullPathDocs, commitObj);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Git History] Error reading git log:', err);
  }

  // 2. Overlay dedicated public GitHub commits (ignoring bulk initial exports)
  try {
    const metadataPath = path.join(RUNTIME_ROOT, 'content', '.gitops-metadata.json');
    if (fs.existsSync(metadataPath)) {
      const raw = fs.readFileSync(metadataPath, 'utf-8');
      const meta = JSON.parse(raw);
      if (meta && meta.files) {
        for (const [relPath, info] of Object.entries<any>(meta.files)) {
          // Ignore bulk initial exports to preserve original doc authorship
          if (
            info.commitMessage?.includes('initial export') ||
            info.commitHash === 'b1ad533' ||
            info.commitHash === 'cabec26'
          ) {
            continue;
          }

          const fullPath = path.resolve(process.cwd(), relPath);
          const fullPathDocs = path.resolve(
            process.cwd(),
            relPath.replace(/^content\//, 'content/docs/'),
          );

          const profile = getAuthorProfile(info.authorUsername || info.authorName, '');
          const commitObj: GitCommitInfo = {
            authorName: profile.displayName || info.authorName || info.authorUsername,
            authorEmail: '',
            authorUsername: info.authorUsername || profile.username,
            authorDisplayName: profile.displayName || info.authorName,
            authorGithubUsername: info.authorUsername || profile.githubUsername,
            authorProfileUrl: info.authorUsername
              ? `https://github.com/${info.authorUsername}`
              : profile.profileUrl,
            authorCustomTitle: profile.customTitle,
            authorRole: profile.role,
            authorAvatar: info.authorAvatar || profile.avatarUrl,
            date: info.date,
            relativeTime: formatRelativeTime(info.date),
            commitHash: info.commitHash,
            commitMessage: info.commitMessage,
            commitUrl: info.commitUrl,
          };

          _fileGitInfoCache.set(fullPath, commitObj);
          _fileGitInfoCache.set(fullPathDocs, commitObj);
        }
      }
    }
  } catch (err) {
    console.warn('[GitOps History] Error reading metadata:', err);
  }

  _batchLogLoaded = true;
  _batchLogTimestamp = now;
}

/**
 * Invalidate all git info caches (called after doc saves or syncs).
 */
export function invalidateGitCache(_filePath?: string): void {
  _fileGitInfoCache.clear();
  _firstCommitCache.clear();
  _recentDocsCache = null;
  _recentDocsCacheTimestamp = 0;
  _batchLogLoaded = false;
  _batchLogTimestamp = 0;
}

function getGitOpsFileMetadata(filePath: string): GitCommitInfo | null {
  try {
    const metadataPath = path.join(RUNTIME_ROOT, 'content', '.gitops-metadata.json');
    if (!fs.existsSync(metadataPath)) return null;

    const raw = fs.readFileSync(metadataPath, 'utf-8');
    const meta = JSON.parse(raw);
    if (!meta || !meta.files) return null;

    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const cleanNoDocs = relPath.replace(/^docs\//, '');
    // Normalize content path matching
    const candidateKeys = [
      relPath,
      `docs/${cleanNoDocs}`,
      cleanNoDocs,
      relPath.replace(/^content\/docs\//, 'content/'),
      `content/${relPath}`,
      relPath.replace(/^content\//, 'content/docs/'),
    ];

    let found: any = null;
    for (const key of candidateKeys) {
      if (meta.files[key]) {
        found = meta.files[key];
        break;
      }
    }

    if (found) {
      // Ignore initial bulk exports so original author is preserved
      if (
        found.commitMessage?.includes('initial export') ||
        found.commitHash === 'b1ad533' ||
        found.commitHash === 'cabec26'
      ) {
        return null;
      }

      const profile = getAuthorProfile(found.authorUsername || found.authorName, '');
      return {
        authorName: profile.displayName || found.authorName || found.authorUsername,
        authorEmail: '',
        authorUsername: found.authorUsername || profile.username,
        authorDisplayName: profile.displayName || found.authorName,
        authorGithubUsername: found.authorUsername || profile.githubUsername,
        authorProfileUrl: found.authorUsername
          ? `https://github.com/${found.authorUsername}`
          : profile.profileUrl,
        authorCustomTitle: profile.customTitle,
        authorRole: profile.role,
        authorAvatar: found.authorAvatar || profile.avatarUrl,
        date: found.date,
        relativeTime: formatRelativeTime(found.date),
        commitHash: found.commitHash,
        commitMessage: found.commitMessage,
        commitUrl: found.commitUrl,
      };
    }
  } catch {}
  return null;
}

export function getFileGitInfo(filePath: string): GitCommitInfo {
  const normalizedPath = path.resolve(filePath);

  // 1. Primary Source of Truth: Check live metadata from public GitHub repository FIRST
  const gitOpsMeta = getGitOpsFileMetadata(filePath);
  if (gitOpsMeta) {
    _fileGitInfoCache.set(normalizedPath, gitOpsMeta);
    return gitOpsMeta;
  }

  // 2. Check in-memory batch history cache
  if (_fileGitInfoCache.has(normalizedPath)) {
    return _fileGitInfoCache.get(normalizedPath)!;
  }

  // 3. Load batch history if not yet loaded
  if (!_batchLogLoaded) {
    loadBatchGitHistory();
    if (_fileGitInfoCache.has(normalizedPath)) {
      return _fileGitInfoCache.get(normalizedPath)!;
    }
  }

  // Instant filesystem fallback (sub-millisecond)
  try {
    const stats = fs.statSync(filePath);
    const date = stats.mtime.toISOString();
    const profile = getAuthorProfile(DEFAULT_AUTHOR, DEFAULT_EMAIL);

    const fallback: GitCommitInfo = {
      authorName: profile.displayName || DEFAULT_AUTHOR,
      authorEmail: DEFAULT_EMAIL,
      authorUsername: DEFAULT_AUTHOR,
      authorDisplayName: profile.displayName,
      authorGithubUsername: profile.githubUsername,
      authorProfileUrl: profile.profileUrl,
      authorCustomTitle: profile.customTitle,
      authorRole: profile.role,
      authorAvatar: profile.avatarUrl,
      date,
      relativeTime: formatRelativeTime(date),
      commitHash: 'latest',
      commitMessage: 'Documentation update',
      commitUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
    };
    _fileGitInfoCache.set(normalizedPath, fallback);
    return fallback;
  } catch {
    const profile = getAuthorProfile(DEFAULT_AUTHOR, DEFAULT_EMAIL);
    const err: GitCommitInfo = {
      authorName: profile.displayName || DEFAULT_AUTHOR,
      authorEmail: DEFAULT_EMAIL,
      authorUsername: DEFAULT_AUTHOR,
      authorDisplayName: profile.displayName,
      authorGithubUsername: profile.githubUsername,
      authorProfileUrl: profile.profileUrl,
      authorCustomTitle: profile.customTitle,
      authorRole: profile.role,
      authorAvatar: profile.avatarUrl,
      date: new Date().toISOString(),
      relativeTime: 'Recently',
      commitHash: 'main',
      commitMessage: 'Documentation update',
      commitUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
    };
    return err;
  }
}

/**
 * Get the first commit info ("Posted by" / "Created by") for a specific file.
 */
export function getFileFirstCommitInfo(filePath: string): GitCommitInfo {
  const normalizedPath = path.resolve(filePath);
  if (_firstCommitCache.has(normalizedPath)) {
    return _firstCommitCache.get(normalizedPath)!;
  }

  const info = getFileGitInfo(filePath);
  _firstCommitCache.set(normalizedPath, info);
  return info;
}

/**
 * Get all docs pages sorted by last updated time.
 * Instant sub-millisecond execution.
 */
export function getRecentlyUpdatedDocs(limit?: number): RecentDocItem[] {
  const now = Date.now();
  if (_recentDocsCache && now - _recentDocsCacheTimestamp < RECENT_DOCS_TTL_MS) {
    if (typeof limit === 'number' && limit > 0) return _recentDocsCache.slice(0, limit);
    return _recentDocsCache;
  }

  // Pre-load batch git history once
  if (!_batchLogLoaded) {
    loadBatchGitHistory();
  }

  const items: RecentDocItem[] = [];

  function scanDir(dir: string, baseSlug: string = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subSlug = baseSlug ? `${baseSlug}/${entry.name}` : entry.name;
        scanDir(fullPath, subSlug);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        const cleanName = entry.name.toLowerCase();
        if (cleanName === 'readme.md' || cleanName === 'license.md') continue;

        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data, content } = matter(raw);

        const cleanExt = entry.name.replace(/\.(md|mdx)$/, '');
        const fileSlug =
          cleanExt === 'index' ? baseSlug || '' : baseSlug ? `${baseSlug}/${cleanExt}` : cleanExt;

        // Derive category from first slug segment
        const cleanSlug = fileSlug.replace(/^(en|ro)\//, '');
        const firstSegment = cleanSlug.split('/')[0] || '';
        const categoryMap: Record<string, string> = {
          informatii: 'Informații',
          currency: 'Currency',
          systems: 'Systems',
          market: 'Market & Donații',
        };
        const category =
          categoryMap[firstSegment] ||
          (firstSegment ? firstSegment.replace(/-/g, ' ') : 'Informații');

        const gitInfo = getFileGitInfo(fullPath);

        // Approximate reading time
        const words = content.trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(words / 200));

        items.push({
          slug: fileSlug,
          href: fileSlug ? `/docs/${fileSlug}` : '/docs',
          title: data.title || (fileSlug ? fileSlug.replace(/-/g, ' ') : 'Documentation Home'),
          description:
            data.description ||
            data.seoDescription ||
            'Ghid detaliat si documentatie pentru serverul Wildfire.',
          category,
          readingTime,
          lastUpdated: gitInfo.date,
          relativeTime: gitInfo.relativeTime,
          authorName: gitInfo.authorDisplayName || gitInfo.authorName,
          authorAvatar: gitInfo.authorAvatar,
          commitHash: gitInfo.commitHash,
          badge: data.badge,
        });
      }
    }
  }

  scanDir(DOCS_DIR);

  // Exclude root /docs index and README
  const filtered = items.filter(
    (item) =>
      item.slug !== '' &&
      item.slug.toLowerCase() !== 'readme' &&
      item.title.toLowerCase() !== 'readme',
  );

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  // Store in cache
  _recentDocsCache = filtered;
  _recentDocsCacheTimestamp = now;

  if (typeof limit === 'number' && limit > 0) {
    return filtered.slice(0, limit);
  }
  return filtered;
}
