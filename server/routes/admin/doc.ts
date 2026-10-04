import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';
import { incrementMemberDocCount, findTeamMemberByUsername } from '@server/lib/security/teamStore';
import { commitDocChange } from '@server/lib/admin/gitCommit';
import { invalidateGitCache } from '@server/lib/git';
import { invalidateRepoStatsCache } from '@server/lib/repoContributions';
import { docPath, validateMarkdown, snapshotDocument } from '@server/services/documents';

const DOCS_DIR = DOCS_ROOT;
const TRASH_DIR = path.join(RUNTIME_ROOT, 'content', '.trash');

export interface DocFileInfo {
  slug: string;
  relativePath: string;
  fullPath: string;
  category: string;
  title: string;
}

function getAllDocFiles(dir = DOCS_DIR, base = ''): DocFileInfo[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results: DocFileInfo[] = [];

  for (const entry of entries) {
    if (
      entry.name.startsWith('.') ||
      entry.isSymbolicLink() ||
      ['public', 'admin', 'panel', 'docs', 'team', 'changelog', 'maintenance'].includes(entry.name)
    )
      continue;
    const fullPath = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getAllDocFiles(fullPath, rel));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      const cleanSlug = rel.replace(/\\/g, '/').replace(/\.(md|mdx)$/, '');

      // Extract title and category
      let title = path.basename(cleanSlug).replace(/-/g, ' ');
      try {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const titleMatch = raw.match(/title:\s*["']?([^"\n\r]+)["']?/);
        if (titleMatch && titleMatch[1].trim()) {
          title = titleMatch[1].trim();
        }
      } catch {}

      const parts = cleanSlug.split('/');
      const category = parts.length > 1 ? parts[0] : 'general';

      results.push({ slug: cleanSlug, relativePath: rel, fullPath, category, title });
    }
  }

  return results;
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const slug = searchParams.get('slug');

  if (slug) {
    const all = getAllDocFiles();
    const match = all.find((d) => d.slug === slug || d.slug === slug.replace(/^\//, ''));

    if (!match || !fs.existsSync(match.fullPath)) {
      return jsonReply(expressResponse, { error: 'Document not found' }, { status: 404 });
    }

    const content = fs.readFileSync(match.fullPath, 'utf-8');
    return jsonReply(expressResponse, {
      slug: match.slug,
      relativePath: match.relativePath,
      category: match.category,
      title: match.title,
      content,
      currentUser: {
        username: session.username,
        displayName: session.displayName,
        role: session.role,
        isRoot: session.isRoot,
      },
    });
  }

  const docs = getAllDocFiles();
  return jsonReply(expressResponse, {
    total: docs.length,
    docs: docs.map((d) => ({
      slug: d.slug,
      relativePath: d.relativePath,
      category: d.category,
      title: d.title,
    })),
    currentUser: {
      username: session.username,
      displayName: session.displayName,
      role: session.role,
      isRoot: session.isRoot,
    },
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canEditDocs) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Acces Refuzat: Nu ai permisiunea canEditDocs pentru a modifica documente.',
      },
      { status: 403 },
    );
  }

  try {
    const { slug, content, action } = req.body;

    if (!slug || !content) {
      return jsonReply(
        expressResponse,
        { error: 'Slug and content are required.' },
        { status: 400 },
      );
    }

    const cleanRelPath = `${slug.replace(/^\/+/, '').replace(/\.(md|mdx)$/, '')}.md`;
    let targetPath: string;
    try {
      targetPath = docPath(slug);
      validateMarkdown(content);
    } catch (error: any) {
      return jsonReply(expressResponse, { error: error.message }, { status: 400 });
    }

    // Prevent path traversal
    if (!targetPath.startsWith(DOCS_DIR + path.sep)) {
      return jsonReply(
        expressResponse,
        { error: 'Invalid path security violation.' },
        { status: 400 },
      );
    }

    const isNew = !fs.existsSync(targetPath);
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const member = await findTeamMemberByUsername(session.username);
    const authorUsername = member?.githubUsername || session.username;
    const authorDisplayName = member?.displayName || session.username;

    // Inject/update frontmatter so VitePress page and Git commit both have exact author metadata
    let processedContent = content;
    try {
      const parsedMatter = matter(content);
      parsedMatter.data = parsedMatter.data || {};
      parsedMatter.data.gitLastCommitter = authorUsername;
      parsedMatter.data.lastUpdatedBy = authorDisplayName;
      parsedMatter.data.author = authorUsername;
      parsedMatter.data.uploadedBy = authorUsername;
      parsedMatter.data.lastUpdated = Date.now();
      processedContent = matter.stringify(parsedMatter.content, parsedMatter.data);
    } catch {
      processedContent = content;
    }

    snapshotDocument(slug, session.username);
    const temporary = `${targetPath}.tmp`;
    fs.writeFileSync(temporary, processedContent, 'utf-8');
    fs.renameSync(temporary, targetPath);

    recordAuditEvent({
      action: isNew ? 'DOC_CREATE' : 'DOC_UPDATE',
      actor: session.username,
      ip,
      details: { slug, path: cleanRelPath, action },
    });

    // Increment contributor's modified docs counter
    incrementMemberDocCount(session.username);

    // ── Auto-Git Commit with GitHub authorship ──────────────────────────────
    // Resolves the logged-in member's githubUsername for proper attribution.
    // Fails silently — doc save always succeeds regardless of Git status.
    let commitHash: string | undefined;
    try {
      const gitResult = await commitDocChange({
        filePath: `docs/${cleanRelPath}`.replace(/\\/g, '/'),
        authorName: authorDisplayName,
        githubUsername: member?.githubUsername,
        username: session.username,
        isRoot: member?.isRoot ?? false,
        slug,
        action: isNew ? 'create' : 'update',
        fileContent: processedContent,
      });
      if (gitResult.success) {
        commitHash = gitResult.commitHash;
        console.info(`[GitCommit] ${session.username} committed ${slug} → ${commitHash}`);
      } else if (!gitResult.skipped) {
        console.warn(`[GitCommit] Commit failed for ${slug}:`, gitResult.error);
      }
    } catch (gitErr: any) {
      console.warn('[GitCommit] Unexpected error (non-fatal):', gitErr?.message);
    }
    // ────────────────────────────────────────────────────────────────────────

    // Invalidate Git cache so updated author / commit metadata renders fresh
    invalidateGitCache(targetPath);
    invalidateRepoStatsCache();

    return jsonReply(expressResponse, {
      success: true,
      message: `Document ${isNew ? 'created' : 'updated'} successfully.`,
      slug,
      ...(commitHash ? { commitHash } : {}),
    });
  } catch (err: any) {
    return jsonReply(
      expressResponse,
      { error: err.message || 'Failed to save document' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canDeleteDocs) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message:
          "Acces Refuzat: Doar administratorii cu permisiunea 'canDeleteDocs' sau Super Administratorul Root pot șterge documente!",
      },
      { status: 403 },
    );
  }

  try {
    const { searchParams } = new URL(req.originalUrl, 'http://localhost');
    const slug = searchParams.get('slug');
    if (!slug) {
      return jsonReply(
        expressResponse,
        { error: "Parametrul 'slug' este obligatoriu." },
        { status: 400 },
      );
    }

    const cleanRelPath = `${slug.replace(/^\/+/, '').replace(/\.(md|mdx)$/, '')}.md`;
    let targetPath: string;
    try {
      targetPath = docPath(slug);
    } catch {
      return jsonReply(expressResponse, { error: 'INVALID_PATH' }, { status: 400 });
    }

    if (!targetPath.startsWith(DOCS_DIR + path.sep)) {
      return jsonReply(
        expressResponse,
        { error: 'Violare de securitate la calea fișierului.' },
        { status: 400 },
      );
    }

    if (!fs.existsSync(targetPath)) {
      return jsonReply(
        expressResponse,
        { error: 'Documentul nu există pe disc.' },
        { status: 404 },
      );
    }

    // Move to Trash instead of hard delete
    if (!fs.existsSync(TRASH_DIR)) {
      fs.mkdirSync(TRASH_DIR, { recursive: true });
    }
    const timestamp = Date.now();
    // Replace all slashes with ___ to keep it flat in .trash/
    const trashFileName = `${timestamp}__${cleanRelPath.replace(/\\/g, '/').replace(/\//g, '___')}`;
    const trashPath = path.join(TRASH_DIR, trashFileName);

    fs.renameSync(targetPath, trashPath);

    // Garbage Collection: Delete files older than 10 hours from TRASH_DIR
    const TEN_HOURS = 10 * 60 * 60 * 1000;
    try {
      const trashFiles = fs.readdirSync(TRASH_DIR);
      const now = Date.now();
      for (const f of trashFiles) {
        const fileParts = f.split('__');
        if (fileParts.length >= 2) {
          const fileTs = parseInt(fileParts[0], 10);
          if (!isNaN(fileTs) && now - fileTs > TEN_HOURS) {
            fs.unlinkSync(path.join(TRASH_DIR, f));
          }
        }
      }
    } catch (e) {
      console.warn('Trash GC failed', e);
    }

    recordAuditEvent({
      action: 'DOC_DELETE',
      actor: session.username,
      ip,
      details: { slug, path: cleanRelPath },
    });

    // ── Auto-Git Commit with GitHub authorship for DELETE ───────────────────
    try {
      const member = await findTeamMemberByUsername(session.username);
      await commitDocChange({
        filePath: `docs/${cleanRelPath}`.replace(/\\/g, '/'),
        authorName: member?.displayName || session.username,
        githubUsername: member?.githubUsername,
        username: session.username,
        isRoot: member?.isRoot ?? false,
        slug,
        action: 'delete',
      });
    } catch (gitErr: any) {
      console.warn('[GitCommit] Delete git sync error (non-fatal):', gitErr?.message);
    }

    invalidateGitCache(targetPath);
    invalidateRepoStatsCache();

    return jsonReply(expressResponse, {
      success: true,
      message: `Articolul '${slug}' a fost șters cu succes.`,
    });
  } catch (err: any) {
    return jsonReply(
      expressResponse,
      { error: err.message || 'Eroare la ștergerea documentului' },
      { status: 500 },
    );
  }
}
