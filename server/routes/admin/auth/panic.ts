import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import {
  validateSessionToken,
  triggerPanicLockdown,
  releasePanicLockdown,
  isPanicLockdown,
  verifyAdminCredentials,
  SESSION_COOKIE_NAME,
  isRootUsername,
} from '@server/lib/security/auth';
import { checkRateLimit, registerFailedAttempt, resetRateLimit } from '@server/lib/security/rateLimit';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { isLocked: isPanicLockdown() });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const { action, masterPassword } = req.body;
  const rateLimitKey = 'panic:master-password';
  if (masterPassword && !checkRateLimit(rateLimitKey).allowed)
    return jsonReply(expressResponse, { error: 'RATE_LIMITED' }, { status: 429 });

  if (action === 'trigger') {
    // Requires Root Admin session OR master password verification
    const token = req.cookies[SESSION_COOKIE_NAME];
    const session = token ? await validateSessionToken(token) : null;
    const authResult = masterPassword ? verifyAdminCredentials(masterPassword) : { valid: false };
    const isPwValid = authResult.valid;
    if (masterPassword && !isPwValid) registerFailedAttempt(rateLimitKey);
    if (isPwValid) resetRateLimit(rateLimitKey);

    if (!session && !isPwValid) {
      return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const isRoot =
      session?.isRoot || (session?.username ? isRootUsername(session.username) : false);
    const canPanic = isRoot || isPwValid;

    if (!canPanic) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Securitate Refuzată: Doar Super Administratorul Root (iannC69) poate declanșa Panic Lockdown!',
        },
        { status: 403 },
      );
    }

    triggerPanicLockdown(session?.username || 'emergency_override', ip);

    const responseBody = {
      success: true,
      message: 'EMERGENCY PANIC LOCKDOWN TRIGGERED. All sessions invalidated.',
      isLocked: true,
    };
    const response = prepareResponse(expressResponse, {});

    // Clear session cookie
    setCookie(response, {
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });

    return response.json(responseBody);
  }

  if (action === 'release') {
    // Releasing lockdown REQUIRES the master password
    if (!masterPassword) {
      return jsonReply(expressResponse, { error: 'Master password missing.' }, { status: 401 });
    }
    const releaseAuthResult = verifyAdminCredentials(masterPassword, 'iannC69', true);
    if (!releaseAuthResult.valid) {
      registerFailedAttempt(rateLimitKey);
      return jsonReply(
        expressResponse,
        { error: 'Master password verification failed.' },
        { status: 401 },
      );
    }

    resetRateLimit(rateLimitKey);
    releasePanicLockdown('master_override', ip);

    return jsonReply(expressResponse, {
      success: true,
      message: 'Panic lockdown released. Administrative login is now available.',
      isLocked: false,
    });
  }

  return jsonReply(expressResponse, { error: 'Invalid action' }, { status: 400 });
}
