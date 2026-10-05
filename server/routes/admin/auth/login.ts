import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import {
  verifyAdminCredentials,
  createAdminSession,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  isPanicLockdownActive,
} from '@server/lib/security/auth';
import { signSessionToken } from '@server/lib/security/crypto';
import {
  checkRateLimit,
  registerFailedAttempt,
  resetRateLimit,
} from '@server/lib/security/rateLimit';
import { findTeamMemberByUsername } from '@server/lib/security/teamStore';
import { recordAuditEvent } from '@server/lib/security/audit';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const ip =
    req.get('cf-connecting-ip')?.trim() ||
    req.get('x-real-ip')?.trim() ||
    req.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1';
  const userAgent = req.get('user-agent') || 'Unknown';
  // Bind the cooldown to the account: proxy headers are not proof of identity.
  const rateLimitKey = `login:account:${String(req.body?.username || '').trim().toLowerCase()}`;

  // 1. Check Panic Mode
  if (isPanicLockdownActive()) {
    return jsonReply(
      expressResponse,
      {
        error: 'SYSTEM_LOCKED',
        message: 'Emergency Panic Lockdown este activ. Toate autentificările sunt suspendate.',
      },
      { status: 403 },
    );
  }

  // 2. Check Rate Limits (Anti-Brute Force)
  const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    return jsonReply(
      expressResponse,
      {
        error: 'RATE_LIMITED',
        message: `Prea multe încercări eșuate. Accesul este blocat temporar pentru ${rateCheck.lockoutRemainingSeconds} secunde.`,
        lockoutRemainingSeconds: rateCheck.lockoutRemainingSeconds,
      },
      { status: 429 },
    );
  }

  try {
    const body = req.body;
    const { username, password } = body;
    const cleanUsername = (username || 'nespecificat').trim();

    const authResult = verifyAdminCredentials(password || '', cleanUsername);

    if (!authResult.valid || !authResult.member) {
      const targetedMember = await findTeamMemberByUsername(cleanUsername);
      const failedResult = registerFailedAttempt(rateLimitKey, 5);
      const currentAttempt =
        failedResult.totalAttempts || Math.max(1, 5 - failedResult.remainingAttempts);
      const remainingAttempts = Math.max(0, 5 - currentAttempt);

      recordAuditEvent({
        action: 'AUTH_LOGIN_FAILURE',
        actor: cleanUsername,
        ip,
        userAgent,
        details: {
          targetedAccount: cleanUsername,
          accountStatus: targetedMember
            ? `🟢 Existent în Echipă (${targetedMember.displayName || targetedMember.username})`
            : '🔴 Cont Inexistent / Nerecunoscut',
          accountRole: targetedMember
            ? targetedMember.isRoot
              ? 'Root Super Admin'
              : targetedMember.role
            : 'Nespecificat',
          attemptNumber: currentAttempt,
          maxAttemptsAllowed: 5,
          remainingAttempts: remainingAttempts,
          isLockoutActive: !failedResult.allowed || currentAttempt >= 5,
          lockoutRemainingSeconds:
            failedResult.lockoutRemainingSeconds || (currentAttempt >= 5 ? 900 : 0),
          reason: authResult.error || 'Nume de utilizator sau parolă incorectă.',
          clientBrowser: userAgent.length > 90 ? userAgent.slice(0, 90) + '...' : userAgent,
        },
      });

      return jsonReply(
        expressResponse,
        {
          error: 'INVALID_CREDENTIALS',
          message: authResult.error || 'Nume de utilizator sau parolă incorectă.',
          remainingAttempts: failedResult.remainingAttempts,
        },
        { status: 401 },
      );
    }

    const member = authResult.member;
    resetRateLimit(rateLimitKey);

    // Check 2FA requirement: required only if the account has 2FA enabled
    if (member.totpEnabled) {
      const tempToken = signSessionToken({
        username: member.username,
        type: '2fa_pending',
        expiresAt: Date.now() + 5 * 60 * 1000,
        ip,
        userAgent,
      });

      return jsonReply(expressResponse, {
        success: true,
        require2FA: true,
        tempToken,
        message: 'Introduceți codul 2FA.',
      });
    }

    resetRateLimit(rateLimitKey);

    if (!member.totpEnabled) {
      import('@server/lib/db/localStore')
        .then(({ localCreateNotification, localGetNotifications }) => {
          try {
            const existing = localGetNotifications(member.username, { scope: 'personal' });
            const has2faAlert = (existing.notifications || []).some(
              (n) =>
                n.category === 'security' &&
                n.title.includes('2FA') &&
                !n.readBy?.includes(member.username),
            );
            if (!has2faAlert) {
              localCreateNotification({
                targetUser: member.username,
                title: 'Securitate Critică: Activare Obligatorie 2FA',
                message:
                  'Contul tău administrativ nu are 2FA activat. Conform protocolului Wildfire Security, configurarea 2FA (TOTP) este obligatorie.',
                category: 'security',
                severity: 'critical',
                link: '/admin/profile',
              });
            }
          } catch {}
        })
        .catch(() => {});
    }

    const { token, session } = createAdminSession({
      username: member.username,
      displayName: member.displayName,
      role: member.role,
      isRoot: member.isRoot,
      permissions: member.permissions,
      ip,
      userAgent,
    });

    const responseBody = {
      success: true,
      user: {
        username: member.username,
        displayName: member.displayName,
        role: member.role,
        isRoot: member.isRoot,
        permissions: member.permissions,
        totpEnabled: Boolean(member.totpEnabled),
      },
      sessionId: session.sessionId,
    };
    const response = prepareResponse(expressResponse, {});

    // Set secure HttpOnly cookie
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
  } catch {
    return jsonReply(
      expressResponse,
      { error: 'SERVER_ERROR', message: 'Eroare internă de server la autentificare.' },
      { status: 500 },
    );
  }
}
