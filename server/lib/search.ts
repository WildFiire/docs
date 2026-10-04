import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface SearchChunk {
  id: string;
  title: string;
  sectionTitle?: string;
  category: string;
  href: string;
  contentSnippet: string;
  keywords: string[];
  type?: 'doc' | 'section' | 'command';
}

const DOCS_PATH = DOCS_ROOT;

const CATEGORY_NAMES: Record<string, string> = {
  informatii: 'Informații',
  currency: 'Currency',
  systems: 'Systems',
  market: 'Market & Donații',
};

function formatCategoryName(folderName: string, folderPath: string): string {
  const indexPath = path.join(folderPath, 'index.md');
  if (fs.existsSync(indexPath)) {
    try {
      const { data } = matter(fs.readFileSync(indexPath, 'utf-8'));
      if (data.title) return data.title;
    } catch {}
  }
  if (CATEGORY_NAMES[folderName]) return CATEGORY_NAMES[folderName];
  return folderName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Strips markdown formatting to produce crisp plain text
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/#+\s+/g, '') // headers
    .replace(/[>*_~|]/g, ' ') // markdown symbols
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts shell commands or code snippets from markdown to make them searchable
 */
function extractCommands(text: string): string[] {
  const matches = text.match(/```(?:bash|sh|shell|zsh)?\n([\s\S]*?)```/g) || [];
  const commands: string[] = [];
  for (const block of matches) {
    const lines = block
      .replace(/```[a-z]*\n?/gi, '')
      .replace(/```/g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
    commands.push(...lines);
  }
  return commands;
}

/**
 * Builds a rich, deep search index containing whole documents, section chunks, and commands
 */
export function getSearchIndex(): SearchChunk[] {
  if (!fs.existsSync(DOCS_PATH)) return [];

  const chunks: SearchChunk[] = [];
  const seenIds = new Set<string>();

  function processDir(dirPath: string, parentCategory = 'General', baseSlug = '') {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (
        entry.isSymbolicLink() ||
        entry.name.startsWith('.') ||
        ['admin', 'panel', 'public', 'docs', 'team', 'changelog', 'maintenance'].includes(
          entry.name,
        )
      )
        continue;
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const catName = formatCategoryName(entry.name, fullPath);
        const newBaseSlug = baseSlug ? `${baseSlug}/${entry.name}` : entry.name;
        processDir(fullPath, catName, newBaseSlug);
      } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const { data, content } = matter(fileContent);

          const isRootIndex = entry.name === 'index.md' && baseSlug === '';
          const isSectionIndex = entry.name === 'index.md' && baseSlug !== '';
          const fileSlug = entry.name.replace(/\.(md|mdx)$/i, '');

          let href = '/docs';
          if (isRootIndex) {
            href = '/docs';
          } else if (isSectionIndex) {
            href = `/docs/${baseSlug}`;
          } else {
            href = baseSlug ? `/docs/${baseSlug}/${fileSlug}` : `/docs/${fileSlug}`;
          }

          const docTitle =
            data.title || path.basename(fullPath, path.extname(fullPath)).replace(/-/g, ' ');
          const docDescription = data.description || '';
          const docKeywords: string[] = Array.isArray(data.keywords) ? data.keywords : [];
          const commands = extractCommands(content);

          // 1. Primary document entry
          if (!seenIds.has(href)) {
            seenIds.add(href);
            chunks.push({
              id: href,
              title: docTitle,
              category: parentCategory,
              href,
              contentSnippet: docDescription || cleanMarkdown(content.slice(0, 240)),
              keywords: [...docKeywords, ...commands.slice(0, 5)],
              type: 'doc',
            });
          }

          // 2. Parse section chunks by headings (##, ###)
          const sections = content.split(/(?=^#{2,3}\s+)/m);

          for (const section of sections) {
            const match = section.match(/^(#{2,3})\s+(.+)$/m);
            if (match) {
              const rawHeading = match[2]
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/`(.+?)`/g, '$1')
                .trim();

              const headingId = rawHeading
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

              const sectionHref = `${href}#${headingId}`;
              if (!seenIds.has(sectionHref)) {
                seenIds.add(sectionHref);

                const sectionBody = section.replace(/^(#{2,3})\s+.+$/m, '');
                const cleanedBody = cleanMarkdown(sectionBody);

                if (cleanedBody.length > 5 || rawHeading) {
                  chunks.push({
                    id: sectionHref,
                    title: rawHeading,
                    sectionTitle: docTitle,
                    category: parentCategory,
                    href: sectionHref,
                    contentSnippet: cleanedBody.slice(0, 180),
                    keywords: docKeywords,
                    type: 'section',
                  });
                }
              }
            }
          }
        } catch (err) {
          console.error(`Error indexing doc file ${fullPath}:`, err);
        }
      }
    }
  }

  processDir(DOCS_PATH);
  return chunks;
}
