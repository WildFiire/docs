import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT, inside } from '@server/storage/paths';
import { validateMedia } from '@server/security/media';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import path from 'path';
import fs from 'fs';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { scanMediaLibrary } from '@server/lib/admin/mediaScanner';
import { recordAuditEvent } from '@server/lib/security/audit';

const PUBLIC_DIR = PUBLIC_ROOT;

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (
    !session.isRoot &&
    !session.permissions?.canManageMedia &&
    !session.permissions?.canEditDocs
  ) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  const result = scanMediaLibrary();
  return jsonReply(expressResponse, result);
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (
    !session.isRoot &&
    !session.permissions?.canManageMedia &&
    !session.permissions?.canEditDocs
  ) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    const file = (req as any).file;
    const targetFolder = req.body.folder || 'media';

    if (!file) {
      return jsonReply(expressResponse, { error: 'No file provided' }, { status: 400 });
    }

    const buffer: Buffer = file.buffer;

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (
      !/\.(png|jpe?g|webp|gif|svg|mp4|webm|mp3|ogg|wav)$/i.test(safeName) ||
      !/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/.test(targetFolder)
    )
      return jsonReply(expressResponse, { error: 'Invalid file path' }, { status: 400 });
    if (
      /\.svg$/i.test(safeName) &&
      /<script|on\w+\s*=|javascript:|<foreignObject|<!ENTITY/i.test(buffer.toString('utf8'))
    )
      return jsonReply(expressResponse, { error: 'Unsafe SVG' }, { status: 400 });
    let uploadDir: string;
    try {
      validateMedia(safeName, buffer);
      uploadDir = inside(PUBLIC_DIR, targetFolder);
      inside(PUBLIC_DIR, `${targetFolder}/${safeName}`);
    } catch (error: any) {
      return jsonReply(expressResponse, { error: error.message }, { status: 400 });
    }

    // Block path traversal and restrict uploads strictly to the public directory
    if (!uploadDir.startsWith(PUBLIC_DIR + path.sep) && uploadDir !== PUBLIC_DIR) {
      return jsonReply(
        expressResponse,
        { error: 'Invalid upload directory security violation.' },
        { status: 400 },
      );
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const finalPath = path.join(uploadDir, safeName);
    const temporary = finalPath + '.upload-' + process.pid;
    try {
      fs.writeFileSync(temporary, buffer, { flag: 'wx' });
      fs.renameSync(temporary, finalPath);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }

    const relativeUrl = `/${targetFolder}/${safeName}`;

    // Auto-Push to GitHub Public Repo
    try {
      const { getGitOpsSettings } = await import('@server/lib/gitops/store');
      const gitopsSettings = getGitOpsSettings();
      const { owner, repo, branch } = gitopsSettings.publicRepo;
      const ghToken = gitopsSettings.sync.githubToken;

      if (process.env.WF_ENABLE_GIT_WRITES === '1' && owner && repo && ghToken && ghToken.trim()) {
        const authHeaders = {
          'User-Agent': 'Wildfire-Docs-Media/1.0',
          Authorization: `Bearer ${ghToken.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        };

        const githubMediaPath = `public/${targetFolder}/${safeName}`;
        const base64Content = buffer.toString('base64');

        let existingSha: string | undefined;
        try {
          const getRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${githubMediaPath}?ref=${branch}`,
            { headers: authHeaders },
          );
          if (getRes.ok) {
            const getData = await getRes.json();
            existingSha = getData.sha;
          }
        } catch {}

        const putBody: any = {
          message: `feat(media): upload ${safeName} to ${targetFolder} via Media Vault`,
          content: base64Content,
          branch,
          author: {
            name: session.displayName || session.username,
            email: `${session.username}@wildfire.ro`,
          },
        };
        if (existingSha) putBody.sha = existingSha;

        await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${githubMediaPath}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(putBody),
        });
      }
    } catch (ghErr: any) {
      console.warn('[Media Vault] GitHub upload skipped (non-fatal):', ghErr?.message);
    }

    recordAuditEvent({
      action: 'MEDIA_UPLOAD',
      actor: session.username,
      ip,
      details: {
        filename: safeName,
        url: relativeUrl,
        sizeBytes: buffer.length,
        sizeFormatted: `${(buffer.length / 1024).toFixed(1)} KB`,
        extension: path.extname(safeName),
      },
    });

    return jsonReply(expressResponse, {
      success: true,
      url: relativeUrl,
      filename: safeName,
    });
  } catch (err: any) {
    return jsonReply(expressResponse, { error: err.message || 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (
    !session.isRoot &&
    !session.permissions?.canManageMedia &&
    !session.permissions?.canEditDocs
  ) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.originalUrl, 'http://localhost');
    const relPath = searchParams.get('path');

    if (!relPath) {
      return jsonReply(expressResponse, { error: 'Path is required' }, { status: 400 });
    }

    const cleanRel = relPath.replace(/^\/+/, '');
    let fullPath: string;
    try { fullPath = inside(PUBLIC_DIR, cleanRel); }
    catch { return jsonReply(expressResponse, { error: 'Invalid media path' }, { status: 400 }); }

    if (!fullPath.startsWith(PUBLIC_DIR + path.sep) || !fs.existsSync(fullPath)) {
      return jsonReply(
        expressResponse,
        { error: 'File not found or access denied' },
        { status: 404 },
      );
    }

    const stats = fs.statSync(fullPath);
    fs.unlinkSync(fullPath);

    recordAuditEvent({
      action: 'MEDIA_DELETE',
      actor: session.username,
      ip,
      details: {
        filename: path.basename(cleanRel),
        path: cleanRel,
        sizeBytes: stats.size,
        sizeFormatted: `${(stats.size / 1024).toFixed(1)} KB`,
      },
    });

    // GitOps: Delete from GitHub
    try {
      const { getGitOpsSettings } = await import('@server/lib/gitops/store');
      const gitopsSettings = getGitOpsSettings();
      const { owner, repo, branch } = gitopsSettings.publicRepo;
      const ghToken = gitopsSettings.sync.githubToken;

      if (process.env.WF_ENABLE_GIT_WRITES === '1' && owner && repo && ghToken && ghToken.trim()) {
        const githubMediaPath = `public/${cleanRel}`;

        const authHeaders = {
          'User-Agent': 'Wildfire-CMS',
          Authorization: `Bearer ${ghToken.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        };

        // Get file SHA first
        const fileRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${githubMediaPath}?ref=${branch}`,
          {
            headers: authHeaders,
          },
        );

        if (fileRes.ok) {
          const fileData = await fileRes.json();
          await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${githubMediaPath}`, {
            method: 'DELETE',
            headers: authHeaders,
            body: JSON.stringify({
              message: `media(${session.username}): delete ${cleanRel} [${session.isRoot ? 'root' : 'admin'}]`,
              sha: fileData.sha,
              branch: branch,
              author: {
                name: session.displayName || session.username,
                email: `${session.username}@wildfire.ro`,
              },
            }),
          });
        }
      }
    } catch (ghErr: any) {
      console.warn('[Media Vault] GitHub delete skipped (non-fatal):', ghErr?.message);
    }

    return jsonReply(expressResponse, { success: true, message: 'Asset deleted successfully.' });
  } catch (err: any) {
    return jsonReply(expressResponse, { error: err.message || 'Delete failed' }, { status: 500 });
  }
}
