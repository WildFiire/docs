import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { getSnapshotPayload } from '@server/lib/backup';

/**
 * GET /api/admin/backups/download?id=...
 * Streams the full backup payload JSON directly as a downloadable attachment
 */
export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.isRoot) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Acces Refuzat: Doar Root Administrator poate descărca backup-uri complete.',
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.originalUrl, 'http://localhost');
    const id = searchParams.get('id');

    if (!id) {
      return jsonReply(
        expressResponse,
        { error: 'Snapshot ID parameter is required.' },
        { status: 400 },
      );
    }

    const payload = getSnapshotPayload(id);
    if (!payload) {
      return jsonReply(
        expressResponse,
        { error: 'Snapshot payload not found on disk.' },
        { status: 404 },
      );
    }

    const filename = `wildfire_docs_backup_${id}.json`;
    const jsonString = JSON.stringify(payload, null, 2);

    return sendReply(expressResponse, jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('[Backup Download API] Error:', err);
    return jsonReply(
      expressResponse,
      { error: 'Failed to download backup snapshot.' },
      { status: 500 },
    );
  }
}
