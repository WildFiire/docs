import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import {
  validateSessionToken,
  revokeSession,
  SESSION_COOKIE_NAME,
} from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (token) {
    const session = await validateSessionToken(token);
    if (session) {
      revokeSession(session.sessionId, session.username);
      recordAuditEvent({
        action: 'AUTH_LOGOUT',
        actor: session.username,
        ip,
        details: { sessionId: session.sessionId },
      });
    }
  }

  const responseBody = { success: true, message: 'Logged out successfully.' };
  const response = prepareResponse(expressResponse, {});

  // Delete HttpOnly cookie
  setCookie(response, {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response.json(responseBody);
}
