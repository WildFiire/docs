import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import {
  getAllSnapshots,
  createSnapshot,
  restoreSnapshot,
  deleteSnapshot,
  checkAndRunAutoBackup,
  updateSchedulerSettings,
  getBackupVaultStats,
  readManifest,
} from '@server/lib/backup';

/**
 * GET /api/admin/backups
 * Retrieves all snapshots, vault statistics and runs auto-backup check if needed
 */
export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.isRoot && !session.permissions?.canManageSnapshots) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Acces Refuzat: Nu ai permisiunea canManageSnapshots pentru a accesa Snapshot Vault.',
        },
        { status: 403 },
      );
    }

    // Auto-check if 3 days have elapsed and trigger auto-backup in background
    await checkAndRunAutoBackup(false).catch(() => {});

    const snapshots = getAllSnapshots();
    const stats = getBackupVaultStats();
    const manifest = readManifest();

    return jsonReply(expressResponse, {
      snapshots,
      stats,
      manifest: {
        autoBackupEnabled: manifest.autoBackupEnabled,
        intervalDays: manifest.intervalDays,
        retentionLimit: manifest.retentionLimit,
        lastAutoBackupAt: manifest.lastAutoBackupAt,
      },
    });
  } catch (err: any) {
    console.error('[Backups API] GET error:', err);
    return jsonReply(expressResponse, { error: 'Failed to fetch backups' }, { status: 500 });
  }
}

/**
 * POST /api/admin/backups
 * Creates a new snapshot or updates scheduler settings
 */
export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.isRoot && !session.permissions?.canManageSnapshots) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Acces Refuzat: Nu ai permisiunea canManageSnapshots pentru a modifica Snapshot Vault.',
        },
        { status: 403 },
      );
    }

    const body = req.body;
    const { action, label, autoBackupEnabled, intervalDays, retentionLimit } = body;

    if (action === 'update_scheduler') {
      const updated = updateSchedulerSettings({
        autoBackupEnabled,
        intervalDays,
        retentionLimit,
      });
      const stats = getBackupVaultStats();
      return jsonReply(expressResponse, { success: true, manifest: updated, stats });
    }

    if (action === 'run_auto_check') {
      const created = await checkAndRunAutoBackup(true);
      const stats = getBackupVaultStats();
      const snapshots = getAllSnapshots();
      return jsonReply(expressResponse, { success: true, created, stats, snapshots });
    }

    // Default: Create Manual Snapshot
    const created = await createSnapshot({
      type: 'manual',
      createdBy: session.username || 'iannC69',
      label: label || undefined,
    });

    const stats = getBackupVaultStats();
    const snapshots = getAllSnapshots();

    return jsonReply(
      expressResponse,
      { success: true, snapshot: created, stats, snapshots },
      { status: 201 },
    );
  } catch (err: any) {
    console.error('[Backups API] POST error:', err);
    return jsonReply(
      expressResponse,
      { error: 'Failed to process backup request' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/backups
 * Restores the platform to a snapshot
 */
export async function PATCH(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    // High privilege check: Root or canManageSettings
    if (!session.isRoot && !session.permissions?.canManageSettings) {
      return jsonReply(
        expressResponse,
        { error: 'Access Denied: Insufficient privilege to restore backups.' },
        { status: 403 },
      );
    }

    const body = req.body;
    const { action, id } = body;

    if (action === 'restore' && id) {
      const result = await restoreSnapshot(id, session.username || 'iannC69');
      if (!result.success) {
        return jsonReply(
          expressResponse,
          { error: result.error || 'Restore failed' },
          { status: 500 },
        );
      }

      const stats = getBackupVaultStats();
      const snapshots = getAllSnapshots();
      return jsonReply(expressResponse, {
        success: true,
        restored: result.restoredMetadata,
        stats,
        snapshots,
      });
    }

    return jsonReply(expressResponse, { error: 'Invalid action or parameters' }, { status: 400 });
  } catch (err: any) {
    console.error('[Backups API] PATCH error:', err);
    return jsonReply(expressResponse, { error: 'Failed to restore backup' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/backups
 * Deletes a snapshot
 */
export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.isRoot && !session.permissions?.canManageSnapshots) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Acces Refuzat: Nu ai permisiunea canManageSnapshots pentru a șterge backup-uri.',
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.originalUrl, 'http://localhost');
    const id = searchParams.get('id');

    if (!id) {
      return jsonReply(expressResponse, { error: 'Snapshot ID required' }, { status: 400 });
    }

    const deleted = deleteSnapshot(id);
    const stats = getBackupVaultStats();
    const snapshots = getAllSnapshots();

    return jsonReply(expressResponse, { success: deleted, stats, snapshots });
  } catch (err: any) {
    console.error('[Backups API] DELETE error:', err);
    return jsonReply(expressResponse, { error: 'Failed to delete backup' }, { status: 500 });
  }
}
