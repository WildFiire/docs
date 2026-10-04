import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { getMaintenanceState, setMaintenanceState } from '@server/lib/security/maintenance';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const state = getMaintenanceState();
  return jsonReply(expressResponse, state);
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageSettings) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message:
          'Acces Refuzat: Nu ai permisiunea canManageSettings pentru a modifica statusul platformei.',
      },
      { status: 403 },
    );
  }

  try {
    const body = req.body;
    const { enabled, message, estimatedEndTime } = body;

    const updated = setMaintenanceState(
      {
        enabled: typeof enabled === 'boolean' ? enabled : undefined,
        message: message || undefined,
        estimatedEndTime: estimatedEndTime || undefined,
      },
      session.username,
    );

    const resBody = {
      success: true,
      message: `Maintenance mode ${updated.enabled ? 'ACTIVATED' : 'DEACTIVATED'}.`,
      state: updated,
    };
    const res = prepareResponse(expressResponse, {});

    // Set or clear the public edge maintenance cookie
    if (updated.enabled) {
      setCookie(res, 'wf_maintenance_mode', 'true', {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        maxAge: 30 * 24 * 60 * 60,
      });
    } else {
      setCookie(res, 'wf_maintenance_mode', 'false', {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        maxAge: 0,
      });
    }

    return res.json(resBody);
  } catch {
    return jsonReply(expressResponse, { error: 'Server error' }, { status: 500 });
  }
}
