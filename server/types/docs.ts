// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  slug: string;
  href: string;
  order: number;
  children?: NavItem[];
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'orange' | 'red';
  isSection?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// ─── Page ────────────────────────────────────────────────────────────────────

export interface PageFrontmatter {
  title: string;
  description?: string;
  status?: 'draft' | 'review' | 'published';
  order?: number;
  badge?: string;
  showToc?: boolean;
  showFeedback?: boolean;
  showContributors?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
  authors?: string[];
}

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

export interface DocPage {
  slug: string;
  href: string;
  frontmatter: PageFrontmatter;
  content: string; // raw markdown
  mdxSource?: unknown; // compiled MDX
  readingTime: number; // minutes
  wordCount: number;
  toc: TocItem[];
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
  breadcrumbs: Breadcrumb[];
  githubPath?: string;
  githubEditUrl?: string;
  lastModified?: string;
  gitInfo?: GitCommitInfo;
  firstCommit?: GitCommitInfo;
  sha256?: string;
}

// ─── Table of Contents ────────────────────────────────────────────────────────

export interface TocItem {
  id: string;
  title: string;
  depth: number; // 1=h1, 2=h2, 3=h3
  children?: TocItem[];
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export interface Breadcrumb {
  title: string;
  href: string;
  isCurrent?: boolean;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  title: string;
  href: string;
  excerpt: string;
  section?: string;
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface GitHubFile {
  path: string;
  name: string;
  sha: string;
  content: string;
  downloadUrl: string | null;
}

export interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
}

// ─── Content Source ───────────────────────────────────────────────────────────

export type ContentSource = 'local' | 'github';

export interface ContentConfig {
  source: ContentSource;
  // GitHub-specific
  githubOwner?: string;
  githubRepo?: string;
  githubBranch?: string;
  githubDocsPath?: string;
  // Local-specific
  localDocsPath?: string;
}
