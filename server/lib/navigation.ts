import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { NavItem, NavGroup } from '@server/types/docs';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_PATH = DOCS_ROOT;

const GROUP_TITLE_MAP: Record<string, string> = {
  informatii: 'Informații',
  currency: 'Currency',
  systems: 'Systems',
  market: 'Market & Donații',
};

const GROUP_ORDER_MAP: Record<string, number> = {
  informatii: 1,
  currency: 2,
  systems: 3,
  market: 4,
};

const SUBFOLDER_TITLE_MAP: Record<string, string> = {
  staff: 'Staff',
  regulamente: 'Regulamente',
  go: 'Regulament GO',
  skins: 'Weapon Skins',
  gambling: 'Gambling',
  shop: 'In-Game Shop',
  other: 'Other Systems',
  'premium-shop': 'Premium Shop',
  vip: 'VIP Tiers',
};

function formatSubfolderTitle(name: string): string {
  if (SUBFOLDER_TITLE_MAP[name]) return SUBFOLDER_TITLE_MAP[name];
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function sortByOrder(items: NavItem[]): NavItem[] {
  return items.sort((a, b) => a.order - b.order);
}

function readFrontmatterTitle(filePath: string): { title: string; order: number; badge?: string } {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return {
      title: data.title || path.basename(filePath, '.md').replace(/-/g, ' '),
      order: data.order ?? 99,
      badge: data.badge,
    };
  } catch {
    return { title: path.basename(filePath, '.md').replace(/-/g, ' '), order: 99 };
  }
}

function buildNavItemsForDir(dirPath: string, baseSlug: string): NavItem[] {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const items: NavItem[] = [];

  // Check if there is an index.md for the section root
  const indexPath = path.join(dirPath, 'index.md');
  if (fs.existsSync(indexPath)) {
    const { title, order, badge } = readFrontmatterTitle(indexPath);
    items.push({
      title,
      slug: baseSlug,
      href: `/docs/${baseSlug}`,
      order: order ?? 0,
      badge,
    });
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    const isMarkdown =
      entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'));
    const isIndex =
      entry.name === 'index.md' ||
      entry.name === 'index.mdx' ||
      entry.name.toLowerCase() === 'readme.md';

    if (isMarkdown && !isIndex) {
      const fileSlug = entry.name.replace(/\.(md|mdx)$/, '');
      const slug = `${baseSlug}/${fileSlug}`;
      const { title, order, badge } = readFrontmatterTitle(fullPath);

      // Check if there is a companion subfolder with the same name (e.g. installation/)
      const subDirPath = path.join(dirPath, fileSlug);
      let children: NavItem[] | undefined = undefined;
      if (fs.existsSync(subDirPath) && fs.statSync(subDirPath).isDirectory()) {
        const nested = buildNavItemsForDir(subDirPath, slug);
        children = nested.filter((n) => n.href !== `/docs/${slug}`);
      }

      items.push({
        title,
        slug,
        href: `/docs/${slug}`,
        order,
        badge,
        children: children && children.length > 0 ? children : undefined,
      });
    } else if (entry.isDirectory()) {
      // Check if not already handled as companion to a .md/.mdx file
      const companionMd = path.join(dirPath, `${entry.name}.md`);
      const companionMdx = path.join(dirPath, `${entry.name}.mdx`);
      if (!fs.existsSync(companionMd) && !fs.existsSync(companionMdx)) {
        const slug = `${baseSlug}/${entry.name}`;
        const subItems = buildNavItemsForDir(fullPath, slug);
        const subIndexPath = path.join(fullPath, 'index.md');
        const subIndexMdxPath = path.join(fullPath, 'index.mdx');
        const activeIndexPath = fs.existsSync(subIndexPath)
          ? subIndexPath
          : fs.existsSync(subIndexMdxPath)
            ? subIndexMdxPath
            : null;

        const { title, order, badge } = activeIndexPath
          ? readFrontmatterTitle(activeIndexPath)
          : { title: formatSubfolderTitle(entry.name), order: 99, badge: undefined };

        const children = subItems.filter((n) => n.href !== `/docs/${slug}`);

        items.push({
          title,
          slug,
          href: `/docs/${slug}`,
          order,
          badge,
          children: children.length > 0 ? children : undefined,
        });
      }
    }
  }

  return sortByOrder(items);
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the full navigation tree organized into named groups.
 */
export async function getNavigation(): Promise<NavGroup[]> {
  if (!fs.existsSync(DOCS_PATH)) return [];

  const entries = fs.readdirSync(DOCS_PATH, { withFileTypes: true });
  const groups: { group: NavGroup; order: number }[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dirPath = path.join(DOCS_PATH, entry.name);
      const items = buildNavItemsForDir(dirPath, entry.name);
      const groupTitle = GROUP_TITLE_MAP[entry.name] || entry.name.replace(/-/g, ' ');
      const groupOrder = GROUP_ORDER_MAP[entry.name] ?? 99;

      if (items.length > 0) {
        groups.push({
          group: {
            title: groupTitle,
            items,
          },
          order: groupOrder,
        });
      }
    }
  }

  groups.sort((a, b) => a.order - b.order);
  return groups.map((g) => g.group);
}

/**
 * Returns a flat list of all page slugs for generateStaticParams.
 */
export async function getAllSlugs(): Promise<string[][]> {
  const slugs: string[][] = [];

  function collectSlugs(dirPath: string, prefix: string[] = []) {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        slugs.push([...prefix, entry.name]);
        collectSlugs(fullPath, [...prefix, entry.name]);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        const isIndex =
          entry.name === 'index.md' ||
          entry.name === 'index.mdx' ||
          entry.name.toLowerCase() === 'readme.md';
        if (!isIndex) {
          slugs.push([...prefix, entry.name.replace(/\.(md|mdx)$/, '')]);
        }
      }
    }
  }

  collectSlugs(DOCS_PATH);

  // Deduplicate slugs (excluding empty root which is handled by /docs/page.tsx)
  const seen = new Set<string>();
  const uniqueSlugs: string[][] = [];
  for (const s of slugs) {
    if (s.length === 0) continue;
    const key = s.join('/');
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSlugs.push(s);
    }
  }

  return uniqueSlugs;
}

/**
 * Returns the raw Markdown + frontmatter for a given slug.
 */
export async function getRawPage(slug: string[]): Promise<{
  content: string;
  path: string;
} | null> {
  const slugPath = slug.join('/');

  if (slug.length === 0) {
    const rootIndex = path.join(DOCS_PATH, 'index.md');
    const rootIndexMdx = path.join(DOCS_PATH, 'index.mdx');
    if (fs.existsSync(rootIndex)) {
      const content = fs.readFileSync(rootIndex, 'utf-8');
      return { content, path: rootIndex };
    }
    if (fs.existsSync(rootIndexMdx)) {
      const content = fs.readFileSync(rootIndexMdx, 'utf-8');
      return { content, path: rootIndexMdx };
    }
    return null;
  }

  const candidates = [
    path.join(DOCS_PATH, `${slugPath}.md`),
    path.join(DOCS_PATH, `${slugPath}.mdx`),
    path.join(DOCS_PATH, slugPath, 'index.md'),
    path.join(DOCS_PATH, slugPath, 'index.mdx'),
  ];

  const resolvedDocsPath = path.resolve(DOCS_PATH);
  for (const candidate of candidates) {
    const resolvedCandidate = path.resolve(candidate);
    // Security Boundary: Prevent Path Traversal attacks
    if (!resolvedCandidate.startsWith(resolvedDocsPath)) {
      continue;
    }
    if (fs.existsSync(candidate)) {
      const content = fs.readFileSync(candidate, 'utf-8');
      return { content, path: candidate };
    }
  }

  return null;
}

/**
 * Returns adjacent pages (prev/next) for navigation.
 */
export async function getAdjacentPages(
  currentSlug: string,
): Promise<{ prev: NavItem | null; next: NavItem | null }> {
  function flattenNav(items: NavItem[]): NavItem[] {
    const flat: NavItem[] = [];
    for (const item of items) {
      flat.push(item);
      if (item.children?.length) flat.push(...flattenNav(item.children));
    }
    return flat;
  }

  const nav = await getNavigation();
  const flat = nav.flatMap((g) => flattenNav(g.items));
  const idx = flat.findIndex(
    (item) => item.slug === currentSlug || item.href === `/docs/${currentSlug}`,
  );

  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
