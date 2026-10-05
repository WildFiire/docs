import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import {
  validateSessionToken,
  SESSION_COOKIE_NAME,
  isRootUsername,
} from '@server/lib/security/auth';
import { findTeamMemberByUsername } from '@server/lib/security/teamStore';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    const session = token ? await validateSessionToken(token) : null;

    if (!session) {
      return jsonReply(expressResponse, { authenticated: false });
    }

    const member = await findTeamMemberByUsername(session.username);
    const avatarUrl =
      member?.avatarUrl ||
      (member?.githubUsername ? `https://github.com/${member.githubUsername}.png` : null) ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${session.username}`;

    const isStrictlyRoot = Boolean(
      session.isRoot || member?.isRoot || isRootUsername(session.username),
    );

    return jsonReply(expressResponse, {
      authenticated: true,
      user: {
        username: session.username,
        displayName: session.displayName || member?.displayName || session.username,
        role: session.role,
        isRoot: isStrictlyRoot,
        permissions: session.permissions,
        avatarUrl,
        customTitle: member?.customTitle || (isStrictlyRoot ? 'Root Super Admin' : 'Staff Member'),
        totpEnabled: Boolean(member?.totpEnabled),
      },
    });
  } catch (err) {
    console.error('[API Auth Me] Error:', err);
    return jsonReply(expressResponse, { authenticated: false });
  }
}
