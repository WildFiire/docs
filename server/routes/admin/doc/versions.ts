import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import { docPath } from '@server/services/documents';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';

const VERSIONS_DIR = path.join(RUNTIME_ROOT, 'content', '.versions');

export interface DocVersion {
  id: string;
  slug: string;
  timestamp: string;
  savedBy: string;
  content: string;
  charCount: number;
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  // Root Super Admin Isolation: Only Root (iannC69) has access to view versions & rollback
  if (!session.isRoot) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Doar Root Super Admin (iannC69) are acces la istoricul de revizii.',
      },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const slug = searchParams.get('slug');

  if (!slug) {
    return jsonReply(expressResponse, { error: 'Slug is required' }, { status: 400 });
  }

  const cleanSlug = slug.replace(/^\/+/, '').replace(/\.(md|mdx)$/, '');
  try {
    docPath(cleanSlug);
  } catch {
    return jsonReply(expressResponse, { error: 'Invalid document path' }, { status: 400 });
  }
  const targetDir = path.join(VERSIONS_DIR, cleanSlug);

  if (!fs.existsSync(targetDir)) {
    return jsonReply(expressResponse, { versions: [] });
  }

  const files = fs.readdirSync(targetDir);
  const versions: DocVersion[] = [];

  for (const f of files) {
    if (f.endsWith('.json')) {
      try {
        const raw = fs.readFileSync(path.join(targetDir, f), 'utf-8');
        const parsed = JSON.parse(raw);
        versions.push(parsed);
      } catch {}
    }
  }

  // Sort newest first
  versions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return jsonReply(expressResponse, { versions });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { slug, content, action } = req.body;

    if (!slug || !content) {
      return jsonReply(
        expressResponse,
        { error: 'Slug and content are required' },
        { status: 400 },
      );
    }

    const cleanSlug = slug.replace(/^\/+/, '').replace(/\.(md|mdx)$/, '');
    try {
      docPath(cleanSlug);
    } catch {
      return jsonReply(expressResponse, { error: 'Invalid document path' }, { status: 400 });
    }
    const targetDir = path.join(VERSIONS_DIR, cleanSlug);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const versionId = `rev-${Date.now()}`;
    const versionData: DocVersion = {
      id: versionId,
      slug: cleanSlug,
      timestamp,
      savedBy: session.username,
      content,
      charCount: content.length,
    };

    fs.writeFileSync(
      path.join(targetDir, `${versionId}.json`),
      JSON.stringify(versionData, null, 2),
      'utf-8',
    );

    recordAuditEvent({
      action: action === 'rollback' ? 'DOC_ROLLBACK' : 'DOC_VERSION_SAVE',
      actor: session.username,
      ip,
      details: { slug: cleanSlug, versionId },
    });

    return jsonReply(expressResponse, {
      success: true,
      versionId,
      timestamp,
    });
  } catch (err: any) {
    return jsonReply(
      expressResponse,
      { error: err.message || 'Failed to save version' },
      { status: 500 },
    );
  }
}
