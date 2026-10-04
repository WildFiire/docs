import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import {
  validateSessionToken,
  getActiveSessions,
  revokeSession,
  SESSION_COOKIE_NAME,
  isRootUsername,
} from '@server/lib/security/auth';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const isActorRoot = session.isRoot || isRootUsername(session.username);

  const allSessions = getActiveSessions();
  const visibleSessions =
    isActorRoot || session.permissions?.canManageSecurity
      ? allSessions
      : allSessions.filter((s) => s.sessionId === session.sessionId);

  return jsonReply(expressResponse, {
    currentSessionId: session.sessionId,
    currentUser: {
      username: session.username,
      displayName: session.displayName,
      role: session.role,
      isRoot: session.isRoot,
      permissions: session.permissions,
    },
    total: visibleSessions.length,
    sessions: visibleSessions,
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { sessionId } = req.body;
  if (!sessionId) {
    return jsonReply(expressResponse, { error: 'sessionId is required.' }, { status: 400 });
  }

  const sessions = getActiveSessions();
  const targetSession = sessions.find((s) => s.sessionId === sessionId);

  if (targetSession) {
    const isTargetRoot = targetSession.isRoot || isRootUsername(targetSession.username);
    const isActorRoot = session.isRoot || isRootUsername(session.username);

    // STRICT RULE: Non-root admins CANNOT revoke a Root admin's session
    if (isTargetRoot && !isActorRoot) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Securitate Refuzată: Nu ai permisiunea de a revoca sesiunea Super Administratorului Root (iannC69)!',
        },
        { status: 403 },
      );
    }

    // Non-root members can only revoke their own session unless they have canManageSecurity
    if (
      !isActorRoot &&
      !session.permissions?.canManageSecurity &&
      targetSession.sessionId !== session.sessionId
    ) {
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            "Nu ai permisiunea 'canManageSecurity' pentru a revoca sesiunile altor administratori!",
        },
        { status: 403 },
      );
    }
  }

  const success = revokeSession(sessionId, session.username);
  return jsonReply(expressResponse, { success, message: 'Sesiune revocată cu succes.' });
}
