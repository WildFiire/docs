import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';
import { invalidateRepoStatsCache } from '@server/lib/repoContributions';
import { invalidateGitCache } from '@server/lib/git';
import { docPath, validateMarkdown } from '@server/services/documents';

const TRASH_DIR = path.join(RUNTIME_ROOT, 'content', '.trash');
const DOCS_DIR = DOCS_ROOT;

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canDeleteDocs) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  if (!fs.existsSync(TRASH_DIR)) {
    return jsonReply(expressResponse, { files: [] });
  }

  try {
    const files = fs.readdirSync(TRASH_DIR);
    const trashFiles = files
      .map((f) => {
        const parts = f.split('__');
        if (parts.length < 2) return null;
        const timestamp = parseInt(parts[0], 10);
        const originalPath = parts.slice(1).join('__').replace(/___/g, '/');
        const stat = fs.statSync(path.join(TRASH_DIR, f));

        return {
          id: f,
          originalPath,
          deletedAt: timestamp,
          size: stat.size,
        };
      })
      .filter(Boolean);

    // Sort descending by deletedAt
    trashFiles.sort((a, b) => (b?.deletedAt || 0) - (a?.deletedAt || 0));

    return jsonReply(expressResponse, { files: trashFiles });
  } catch (err: any) {
    return jsonReply(expressResponse, { error: err.message }, { status: 500 });
  }
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canDeleteDocs) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    const { action, id } = req.body;

    if (typeof id !== 'string' || !/^\d+__[a-zA-Z0-9_.-]+\.md$/.test(id) || !action) {
      return jsonReply(expressResponse, { error: 'Invalid request payload.' }, { status: 400 });
    }

    const trashFilePath = path.resolve(TRASH_DIR, id);
    if (!trashFilePath.startsWith(TRASH_DIR + path.sep)) {
      return jsonReply(
        expressResponse,
        { error: 'Invalid file path security violation.' },
        { status: 400 },
      );
    }

    if (!fs.existsSync(trashFilePath)) {
      return jsonReply(
        expressResponse,
        { error: 'Fișierul nu există în Recycle Bin.' },
        { status: 404 },
      );
    }

    const parts = id.split('__');
    const originalRelPath = parts.slice(1).join('__').replace(/___/g, '/');

    if (action === 'restore') {
      const targetPath = docPath(originalRelPath);
      if (fs.existsSync(targetPath))
        return jsonReply(expressResponse, { error: 'DOCUMENT_ALREADY_EXISTS' }, { status: 409 });
      validateMarkdown(fs.readFileSync(trashFilePath, 'utf8'));

      // Ensure parent dirs exist
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      fs.renameSync(trashFilePath, targetPath);

      recordAuditEvent({
        action: 'DOC_RESTORE',
        actor: session.username,
        ip,
        details: { path: originalRelPath },
      });

      invalidateGitCache(targetPath);
      invalidateRepoStatsCache();

      return jsonReply(expressResponse, {
        success: true,
        message: `Document restaurat cu succes: ${originalRelPath}`,
      });
    } else if (action === 'delete_forever') {
      fs.unlinkSync(trashFilePath);

      recordAuditEvent({
        action: 'DOC_DELETE_FOREVER',
        actor: session.username,
        ip,
        details: { path: originalRelPath },
      });

      return jsonReply(expressResponse, { success: true, message: `Document șters definitiv.` });
    }

    return jsonReply(expressResponse, { error: 'Acțiune necunoscută.' }, { status: 400 });
  } catch (err: any) {
    return jsonReply(expressResponse, { error: err.message }, { status: 500 });
  }
}
