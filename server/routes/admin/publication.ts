import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { publicationState } from '@server/services/publication';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });

  return jsonReply(expressResponse, publicationState);
}
