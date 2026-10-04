import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { findTeamMemberByUsername, updateTeamMember } from '@server/lib/security/teamStore';
import { generateTOTPSecret, getTOTPAuthUri, verifyTOTPToken } from '@server/lib/security/totp';
import { recordAuditEvent } from '@server/lib/security/audit';
import { checkRateLimit, registerFailedAttempt } from '@server/lib/security/rateLimit';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const member = await findTeamMemberByUsername(session.username);

  if (!member) {
    return jsonReply(expressResponse, { error: 'Utilizator inexistent' }, { status: 404 });
  }

  // If 2FA is NOT enabled, we generate a fresh provisional secret for the UI
  let provisionalSecret = '';
  let uri = '';
  if (!member.totpEnabled) {
    provisionalSecret = generateTOTPSecret();
    uri = getTOTPAuthUri(member.username, provisionalSecret);
  }

  return jsonReply(expressResponse, {
    enabled: member.totpEnabled || false,
    secret: provisionalSecret || undefined,
    uri: uri || undefined,
    backupCodes: [], // Optionally, you can generate/return real backup codes here
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = req.body;
    const { action, secret, code } = body;
    const member = await findTeamMemberByUsername(session.username);

    if (!member) {
      return jsonReply(expressResponse, { error: 'Utilizator inexistent' }, { status: 404 });
    }

    if (action === 'enable') {
      if (member.totpEnabled) {
        return jsonReply(expressResponse, { error: '2FA este deja activat.' }, { status: 400 });
      }

      if (!code || !secret) {
        return jsonReply(expressResponse, { error: 'Secret și cod obligatorii.' }, { status: 400 });
      }

      const rateLimitStatus = checkRateLimit(ip);
      if (!rateLimitStatus.allowed) {
        recordAuditEvent({
          action: 'AUTH_LOGIN_FAILURE',
          actor: member.username,
          ip,
          details: {
            reason: 'RATE_LIMITED_TOTP_ENABLE',
            message: 'Too many failed 2FA pairing attempts.',
          },
        });
        return jsonReply(
          expressResponse,
          {
            error: `Prea multe încercări eșuate de activare. Încearcă din nou în ${Math.ceil(rateLimitStatus.lockoutRemainingSeconds / 60)} minute.`,
          },
          { status: 429 },
        );
      }

      const isValid = verifyTOTPToken(code, secret);
      if (!isValid) {
        registerFailedAttempt(ip);
        return jsonReply(expressResponse, { error: 'Codul 2FA este incorect.' }, { status: 400 });
      }

      await updateTeamMember(member.id, {
        totpEnabled: true,
        totpSecret: secret,
      });

      recordAuditEvent({
        action: 'AUTH_2FA_ENABLED',
        actor: session.username,
        ip,
        details: { source: 'Security Dashboard' },
      });

      return jsonReply(expressResponse, { success: true, message: '2FA activat cu succes.' });
    }

    if (action === 'disable') {
      if (!member.totpEnabled) {
        return jsonReply(expressResponse, { error: '2FA nu este activat.' }, { status: 400 });
      }

      await updateTeamMember(member.id, {
        totpEnabled: false,
        totpSecret: undefined,
      });

      recordAuditEvent({
        action: 'AUTH_2FA_DISABLED',
        actor: session.username,
        ip,
        details: { source: 'Security Dashboard' },
      });

      return jsonReply(expressResponse, { success: true, message: '2FA dezactivat cu succes.' });
    }

    return jsonReply(expressResponse, { error: 'Acțiune necunoscută.' }, { status: 400 });
  } catch (err) {
    return jsonReply(expressResponse, { error: 'Eroare internă de server' }, { status: 500 });
  }
}
