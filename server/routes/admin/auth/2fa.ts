import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import {
  generateTOTPSecret,
  getTOTPAuthUri,
  generateQRCodeDataUrl,
  verifyTOTPToken,
} from '@server/lib/security/totp';
import { verifySessionToken } from '@server/lib/security/crypto';
import { findTeamMemberByUsername, updateTeamMember } from '@server/lib/security/teamStore';
import {
  createAdminSession,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';
import { checkRateLimit, registerFailedAttempt, resetRateLimit } from '@server/lib/security/rateLimit';
import { consumeChallenge, isChallengeConsumed } from '@server/security/challenges';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const body = req.body;
    const { action, tempToken, code } = body;

    if (!tempToken) {
      return jsonReply(
        expressResponse,
        { error: 'UNAUTHORIZED', message: 'Lipsa token temporar.' },
        { status: 401 },
      );
    }

    const payload = verifySessionToken(tempToken);
    if (!payload || payload.type !== '2fa_pending' || isChallengeConsumed(tempToken)) {
      return jsonReply(
        expressResponse,
        { error: 'UNAUTHORIZED', message: 'Token temporar invalid sau expirat.' },
        { status: 401 },
      );
    }

    const { username, ip, userAgent } = payload;
    const member = await findTeamMemberByUsername(username);

    if (!member || member.status !== 'active') {
      return jsonReply(
        expressResponse,
        { error: 'NOT_FOUND', message: 'Utilizator inexistent.' },
        { status: 404 },
      );
    }

    if (action === 'setup') {
      if (member.totpEnabled) {
        return jsonReply(
          expressResponse,
          { error: 'BAD_REQUEST', message: '2FA este deja activat.' },
          { status: 400 },
        );
      }

      const secret = generateTOTPSecret();
      const uri = getTOTPAuthUri(username, secret);
      const qrCode = await generateQRCodeDataUrl(uri);

      // Save the secret temporarily in the member profile but do not enable it yet
      await updateTeamMember(member.id, { totpSecret: secret });

      return jsonReply(expressResponse, { success: true, secret, qrCode });
    }

    if (action === 'verify-setup' || action === 'verify') {
      if (!code || typeof code !== 'string' || code.length !== 6) {
        return jsonReply(
          expressResponse,
          { error: 'BAD_REQUEST', message: 'Cod 2FA invalid.' },
          { status: 400 },
        );
      }

      if (!member.totpSecret) {
        return jsonReply(
          expressResponse,
          { error: 'BAD_REQUEST', message: 'Eroare de configurare 2FA.' },
          { status: 400 },
        );
      }

      const clientIp = ip || req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
      const rateLimitKey = `2fa:account:${member.username.toLowerCase()}`;
      const rateLimitStatus = checkRateLimit(rateLimitKey);
      if (!rateLimitStatus.allowed) {
        recordAuditEvent({
          action: 'AUTH_LOGIN_FAILURE',
          actor: member.username,
          ip: clientIp,
          details: { reason: 'RATE_LIMITED_2FA', message: 'Too many failed 2FA attempts.' },
        });
        return jsonReply(
          expressResponse,
          {
            error: 'RATE_LIMITED',
            message: `Prea multe încercări eșuate 2FA. Încearcă din nou în ${Math.ceil(rateLimitStatus.lockoutRemainingSeconds / 60)} minute.`,
          },
          { status: 429 },
        );
      }

      const isValid = verifyTOTPToken(code, member.totpSecret);

      if (!isValid) {
        registerFailedAttempt(rateLimitKey);
        return jsonReply(
          expressResponse,
          { error: 'INVALID_CODE', message: 'Codul 2FA este incorect.' },
          { status: 401 },
        );
      }

      if (action === 'verify-setup') {
        await updateTeamMember(member.id, { totpEnabled: true });
        recordAuditEvent({
          action: 'AUTH_2FA_ENABLED',
          actor: username,
          ip: ip || '127.0.0.1',
          details: { message: '2FA was configured and enabled successfully.' },
        });
      }

      // 3. Success: Create Session
      if (!consumeChallenge(tempToken, payload.expiresAt))
        return jsonReply(expressResponse, { error: 'CHALLENGE_USED' }, { status: 401 });
      resetRateLimit(rateLimitKey);
      const { token, session } = createAdminSession({
        username: member.username,
        displayName: member.displayName,
        role: member.role,
        isRoot: member.isRoot,
        permissions: member.permissions,
        ip: ip || '127.0.0.1',
        userAgent: userAgent || 'Unknown',
      });

      const responseBody = {
        success: true,
        user: {
          username: member.username,
          displayName: member.displayName,
          role: member.role,
          isRoot: member.isRoot,
          permissions: member.permissions,
        },
        sessionId: session.sessionId,
      };
      const response = prepareResponse(expressResponse, {});

      setCookie(response, {
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: Math.floor(SESSION_DURATION_MS / 1000),
      });

      return response.json(responseBody);
    }

    return jsonReply(
      expressResponse,
      { error: 'BAD_REQUEST', message: 'Ac?iune necunoscuta.' },
      { status: 400 },
    );
  } catch (err) {
    console.error('[2FA API] Error:', err);
    return jsonReply(
      expressResponse,
      { error: 'SERVER_ERROR', message: 'Eroare interna 2FA.' },
      { status: 500 },
    );
  }
}
