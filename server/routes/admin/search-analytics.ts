import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { getSearchAnalytics } from '@server/lib/security/searchAnalytics';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canViewAnalytics) {
    return jsonReply(
      expressResponse,
      { error: 'FORBIDDEN', message: 'Acces Refuzat: Nu ai permisiunea canViewAnalytics.' },
      { status: 403 },
    );
  }

  const analytics = getSearchAnalytics();
  return jsonReply(expressResponse, analytics);
}
