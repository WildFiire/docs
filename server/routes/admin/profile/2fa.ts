import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { findTeamMemberByUsername, updateTeamMember } from '@server/lib/security/teamStore';
import { recordAuditEvent } from '@server/lib/security/audit';
import {
  generateTOTPSecret,
  getTOTPAuthUri,
  generateQRCodeDataUrl,
  verifyTOTPToken,
} from '@server/lib/security/totp';
import { checkRateLimit, registerFailedAttempt } from '@server/lib/security/rateLimit';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });

  const member = await findTeamMemberByUsername(session.username);
  if (!member) return jsonReply(expressResponse, { error: 'NOT_FOUND' }, { status: 404 });

  if (member.totpEnabled) {
    return jsonReply(
      expressResponse,
      { error: 'BAD_REQUEST', message: '2FA este deja activat.' },
      { status: 400 },
    );
  }

  const secret = generateTOTPSecret();
  const uri = getTOTPAuthUri(member.username, secret);
  const qrCode = await generateQRCodeDataUrl(uri);

  await updateTeamMember(member.id, { totpSecret: secret });

  return jsonReply(expressResponse, { success: true, secret, qrCode });
}

export async function PUT(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });

  const member = await findTeamMemberByUsername(session.username);
  if (!member) return jsonReply(expressResponse, { error: 'NOT_FOUND' }, { status: 404 });

  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  const rateLimitStatus = checkRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    recordAuditEvent({
      action: 'AUTH_LOGIN_FAILURE',
      actor: member.username,
      ip,
      details: {
        reason: 'RATE_LIMITED_TOTP_PAIR',
        message: 'Too many failed 2FA pairing attempts.',
      },
    });
    return jsonReply(
      expressResponse,
      {
        error: `Prea multe încercări eșuate. Încearcă din nou în ${Math.ceil(rateLimitStatus.lockoutRemainingSeconds / 60)} minute.`,
      },
      { status: 429 },
    );
  }

  const body = req.body;
  const { code } = body;

  if (!code || typeof code !== 'string' || code.length !== 6) {
    return jsonReply(
      expressResponse,
      { error: 'BAD_REQUEST', message: 'Cod invalid.' },
      { status: 400 },
    );
  }

  if (!member.totpSecret) {
    return jsonReply(
      expressResponse,
      { error: 'BAD_REQUEST', message: 'Setare incorectă.' },
      { status: 400 },
    );
  }

  const isValid = verifyTOTPToken(code, member.totpSecret);
  if (!isValid) {
    registerFailedAttempt(ip);
    return jsonReply(
      expressResponse,
      { error: 'UNAUTHORIZED', message: 'Cod 2FA incorect.' },
      { status: 401 },
    );
  }

  await updateTeamMember(member.id, { totpEnabled: true });

  recordAuditEvent({
    action: 'AUTH_2FA_ENABLED',
    actor: session.username,
    ip: session.ip,
    details: { reason: 'Self-enabled from profile' },
  });

  return jsonReply(expressResponse, { success: true });
}

export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });

  const member = await findTeamMemberByUsername(session.username);
  if (!member) return jsonReply(expressResponse, { error: 'NOT_FOUND' }, { status: 404 });

  // Dezactivăm 2FA
  await updateTeamMember(member.id, { totpEnabled: false, totpSecret: undefined });

  recordAuditEvent({
    action: 'AUTH_2FA_DISABLED',
    actor: session.username,
    ip: session.ip,
    details: { reason: 'Self-disabled from profile' },
  });

  return jsonReply(expressResponse, { success: true });
}
