import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';
import { createZipArchive, ZipFileEntry } from '@server/lib/admin/zipBuilder';
import matter from 'gray-matter';

const DOCS_DIR = DOCS_ROOT;

function collectAllDocFiles(
  dir = DOCS_DIR,
  base = '',
): { relativePath: string; fullPath: string }[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results: { relativePath: string; fullPath: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(collectAllDocFiles(fullPath, rel));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      results.push({ relativePath: rel.replace(/\\/g, '/'), fullPath });
    }
  }

  return results;
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (
    !session.isRoot &&
    !session.permissions?.canManageSnapshots &&
    !session.permissions?.canManageSettings
  ) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Acces Refuzat: Nu ai permisiunea de a exporta conținutul platformei.',
      },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const format = searchParams.get('format') || 'zip';
  const allDocs = collectAllDocFiles();

  recordAuditEvent({
    action: 'BACKUP_EXPORT',
    actor: session.username,
    ip,
    details: { format, totalFiles: allDocs.length },
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  if (format === 'json') {
    const dump = allDocs.map((doc) => {
      const raw = fs.readFileSync(doc.fullPath, 'utf-8');
      const { data, content } = matter(raw);
      return {
        path: doc.relativePath,
        slug: doc.relativePath.replace(/\.(md|mdx)$/, ''),
        frontmatter: data,
        content,
      };
    });

    return sendReply(expressResponse, JSON.stringify(dump, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="wf-docs-backup-${timestamp}.json"`,
      },
    });
  }

  if (format === 'bundle') {
    let bundle = `# WF-DOCSCORE FULL REPOSITORY BUNDLE\nExport Date: ${new Date().toISOString()}\nTotal Documents: ${allDocs.length}\n\n---\n\n`;
    for (const doc of allDocs) {
      const raw = fs.readFileSync(doc.fullPath, 'utf-8');
      bundle += `\n\n<!-- FILE: ${doc.relativePath} -->\n${raw}\n\n---\n`;
    }

    return sendReply(expressResponse, bundle, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="wf-docs-bundle-${timestamp}.md"`,
      },
    });
  }

  // Default: ZIP Archive
  const zipEntries: ZipFileEntry[] = allDocs.map((doc) => ({
    filename: `docs/${doc.relativePath}`,
    data: fs.readFileSync(doc.fullPath),
  }));

  // Include settings if present
  const settingsPath = path.join(RUNTIME_ROOT, 'content', 'settings.json');
  if (fs.existsSync(settingsPath)) {
    zipEntries.push({
      filename: 'settings.json',
      data: fs.readFileSync(settingsPath),
    });
  }

  const zipBuffer = createZipArchive(zipEntries);

  return sendReply(expressResponse, new Uint8Array(zipBuffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="wf-docs-repository-${timestamp}.zip"`,
    },
  });
}
