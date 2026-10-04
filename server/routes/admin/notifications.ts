import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import {
  localGetNotifications,
  localCreateNotification,
  localMarkNotificationRead,
  localMarkAllNotificationsRead,
  localDeleteNotification,
  localClearOldNotifications,
} from '@server/lib/db';
import type { NotificationCategory, NotificationSeverity } from '@server/types/notifications';

/**
 * GET /api/admin/notifications
 * Retrieves notifications visible to the authenticated admin
 */
export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.originalUrl, 'http://localhost');
    const scope = (searchParams.get('scope') as 'all' | 'personal' | 'global' | 'unread') || 'all';
    const category = (searchParams.get('category') as NotificationCategory | 'all') || 'all';
    const severity = (searchParams.get('severity') as NotificationSeverity | 'all') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const result = localGetNotifications(session.username, {
      scope,
      category,
      severity,
      limit,
    });

    return jsonReply(expressResponse, result);
  } catch (err: any) {
    console.error('[Notifications API] GET error:', err);
    return jsonReply(expressResponse, { error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

/**
 * POST /api/admin/notifications
 * Creates a new notification (broadcast or targeted)
 */
export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    const body = req.body;
    const { title, message, category, severity, targetUser, isGlobal, link, metadata } = body;

    if (!title || !message) {
      return jsonReply(
        expressResponse,
        { error: 'Title and message are required' },
        { status: 400 },
      );
    }

    // Security: only root or canManageTeam can broadcast global notifications
    const wantsGlobal = isGlobal === true || (!targetUser && isGlobal !== false);
    if (wantsGlobal && !session.isRoot && !session.permissions?.canManageTeam) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message: 'Doar Root Admin sau Team Manager poate trimite notificări globale echipei.',
        },
        { status: 403 },
      );
    }

    const created = localCreateNotification({
      title,
      message,
      category: category || 'system',
      severity: severity || 'info',
      targetUser: targetUser || undefined,
      isGlobal: wantsGlobal,
      link: link || undefined,
      metadata: metadata || {},
    });

    return jsonReply(expressResponse, { success: true, notification: created }, { status: 201 });
  } catch (err: any) {
    console.error('[Notifications API] POST error:', err);
    return jsonReply(expressResponse, { error: 'Failed to create notification' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/notifications
 * Marks notification(s) as read
 */
export async function PATCH(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    const body = req.body;
    const { action, id } = body;

    if (action === 'read_all') {
      const count = localMarkAllNotificationsRead(session.username);
      return jsonReply(expressResponse, { success: true, markedCount: count });
    }

    if (action === 'read' && id) {
      const success = localMarkNotificationRead(id, session.username);
      return jsonReply(expressResponse, { success });
    }

    return jsonReply(expressResponse, { error: 'Invalid action or parameters' }, { status: 400 });
  } catch (err: any) {
    console.error('[Notifications API] PATCH error:', err);
    return jsonReply(expressResponse, { error: 'Failed to update notification' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/notifications
 * Deletes notification(s)
 */
export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const session = await getAuthenticatedAdminSession();
    if (!session) {
      return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.originalUrl, 'http://localhost');
    const id = searchParams.get('id');
    const clearDays = searchParams.get('clearDays');

    if (clearDays) {
      const days = parseInt(clearDays, 10) || 30;
      const count = localClearOldNotifications(days);
      return jsonReply(expressResponse, { success: true, clearedCount: count });
    }

    if (id) {
      const success = localDeleteNotification(id);
      return jsonReply(expressResponse, { success });
    }

    return jsonReply(expressResponse, { error: 'Notification ID required' }, { status: 400 });
  } catch (err: any) {
    console.error('[Notifications API] DELETE error:', err);
    return jsonReply(expressResponse, { error: 'Failed to delete notification' }, { status: 500 });
  }
}
