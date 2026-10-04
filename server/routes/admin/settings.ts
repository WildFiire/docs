import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { checkRateLimit } from '@server/lib/security/rateLimit';
import { getPlatformSettings, updatePlatformSettings } from '@server/lib/security/settingsStore';
import { recordAuditEvent } from '@server/lib/security/audit';
import { dispatchRestorationAlerts } from '@server/lib/notifications/email';

const NOTIFICATIONS_FILE = path.join(RUNTIME_ROOT, 'content', 'maintenance-subscribers.json');

function getSubscribers() {
  if (fs.existsSync(NOTIFICATIONS_FILE)) {
    try {
      const raw = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {}
  }
  return [];
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const settings = getPlatformSettings();
  const subscribers = getSubscribers();
  return jsonReply(expressResponse, {
    ...settings,
    subscribersCount: subscribers.length,
    subscribers,
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rateCheck = checkRateLimit(`admin_settings_post:${ip}`, 10, 60 * 1000, 60 * 1000);
  if (!rateCheck.allowed) {
    return jsonReply(
      expressResponse,
      { error: 'RATE_LIMITED', message: 'Prea multe request-uri. Așteaptă un minut.' },
      { status: 429 },
    );
  }

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
          'Acces Refuzat: Nu ai permisiunea canManageSettings pentru a modifica setările platformei.',
      },
      { status: 403 },
    );
  }

  try {
    const body = req.body;
    const { maintenance, announcement } = body;
    const previous = getPlatformSettings();

    const updated = updatePlatformSettings(
      {
        maintenance: maintenance || undefined,
        announcement: announcement || undefined,
      },
      session.username,
    );

    // If maintenance was turned OFF from ON, dispatch notification audit & emails
    if (previous.maintenance.enabled && !updated.maintenance.enabled) {
      const subscribers = getSubscribers();
      dispatchRestorationAlerts(subscribers).catch((err) =>
        console.error('Restoration alert dispatch error:', err),
      );

      recordAuditEvent({
        action: 'MAINTENANCE_TOGGLED',
        actor: session.username,
        details: {
          event: 'PLATFORM_RESTORED',
          dispatchedToSubscribers: subscribers.length,
          subscribers: subscribers.map((s: any) => s.email),
        },
      });
    }

    const resBody = {
      success: true,
      message: 'Platform settings saved successfully.',
      settings: updated,
    };
    const res = prepareResponse(expressResponse, {});

    if (updated.maintenance.enabled) {
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
  } catch (err) {
    console.error('Settings save error:', err);
    return jsonReply(expressResponse, { error: 'Server error' }, { status: 500 });
  }
}
