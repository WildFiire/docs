import { steamProfileXml } from '@server/security/steam';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { checkRateLimit } from '@server/lib/security/rateLimit';
import {
  loadTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  ROLE_PRESETS,
  type TeamMember,
} from '@server/lib/security/teamStore';
import { recordAuditEvent } from '@server/lib/security/audit';

function sanitizeMember(m: TeamMember) {
  const { passwordHash, salt, totpSecret, ...safe } = m;
  return safe;
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const members = await loadTeamMembers();
  return jsonReply(expressResponse, {
    currentUser: {
      username: session.username,
      displayName: session.displayName,
      role: session.role,
      isRoot: session.isRoot,
      permissions: session.permissions,
    },
    members: members.map(sanitizeMember),
    rolePresets: ROLE_PRESETS,
  });
}

async function resolveFallbackAvatar(
  avatarUrl?: string,
  steamId?: string,
  discord?: string,
): Promise<string | undefined> {
  if (avatarUrl && avatarUrl.trim()) {
    return avatarUrl.trim();
  }

  // Fallback 1: Resolve Steam Avatar
  if (steamId && steamId.trim()) {
    const clean = steamId.trim();
    let xmlUrl: string;
    try { xmlUrl = steamProfileXml(steamId); } catch { return undefined; }
  try {
      const res = await fetch(xmlUrl, { signal: AbortSignal.timeout(8000), redirect: 'error',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });
      if (res.ok) {
        const text = await res.text();
        const match =
          text.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) ||
          text.match(/<avatarMedium><!\[CDATA\[(.*?)\]\]><\/avatarMedium>/) ||
          text.match(/<avatarIcon><!\[CDATA\[(.*?)\]\]><\/avatarIcon>/);
        if (match && match[1]) {
          return match[1];
        }
      }
    } catch {}
  }

  // Fallback 2: Resolve Discord Avatar (if numeric User ID)
  if (discord && /^\d{17,20}$/.test(discord.trim())) {
    return `https://dcdn.dstn.to/avatars/${discord.trim()}`;
  }

  return undefined;
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rateCheck = checkRateLimit(`admin_team_post:${ip}`, 20, 60 * 1000, 60 * 1000);
  if (!rateCheck.allowed) {
    return jsonReply(
      expressResponse,
      { error: 'RATE_LIMITED', message: 'Prea multe request-uri. Așteaptă un minut.' },
      { status: 429 },
    );
  }

  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageTeam) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Doar Root Super Admin (iannC69) poate adăuga administratori noi.',
      },
      { status: 403 },
    );
  }

  try {
    const body = req.body;
    const {
      username,
      displayName,
      email,
      role,
      password,
      customPermissions,
      customTitle,
      avatarUrl,
      discord,
      steamId,
      githubUsername,
      bio,
      responsibilities,
    } = body;

    if (!username || !password) {
      return jsonReply(
        expressResponse,
        { error: 'BAD_REQUEST', message: 'Numele de utilizator și parola sunt obligatorii.' },
        { status: 400 },
      );
    }

    // ── Privilege Escalation Protection ──
    if (role === 'root_admin' && !session.isRoot) {
      recordAuditEvent({
        action: 'TEAM_MEMBER_CREATED',
        actor: session.username,
        ip: session.ip || '127.0.0.1',
        details: {
          error: 'UNAUTHORIZED_ESCALATION_ATTEMPT',
          message: 'Attempted to spawn a Root Admin without root privileges.',
        },
      });
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Violare de Securitate: Doar un Root curent poate acorda drepturi de Root Super Admin!',
        },
        { status: 403 },
      );
    }

    const resolvedAvatarUrl = await resolveFallbackAvatar(avatarUrl, steamId, discord);

    const result = await createTeamMember({
      username,
      displayName: displayName || username,
      email,
      role: role || 'content_editor',
      password,
      customPermissions,
      customTitle,
      avatarUrl: resolvedAvatarUrl,
      discord,
      steamId,
      githubUsername,
      bio,
      responsibilities,
    });

    if (!result.success || !result.member) {
      return jsonReply(
        expressResponse,
        { error: 'CREATE_FAILED', message: result.error },
        { status: 400 },
      );
    }

    recordAuditEvent({
      action: 'TEAM_MEMBER_CREATED',
      actor: session.username,
      ip: session.ip,
      details: {
        createdUser: result.member.username,
        displayName: result.member.displayName,
        role: result.member.role,
        customTitle: result.member.customTitle || 'Membru Staff',
        discordId: result.member.discord || 'Nespecificat',
      },
    });

    return jsonReply(expressResponse, { success: true, member: sanitizeMember(result.member) });
  } catch {
    return jsonReply(expressResponse, { error: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function PUT(req: ExpressRequest, expressResponse: ExpressResponse) {
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rateCheck = checkRateLimit(`admin_team_put:${ip}`, 20, 60 * 1000, 60 * 1000);
  if (!rateCheck.allowed) {
    return jsonReply(
      expressResponse,
      { error: 'RATE_LIMITED', message: 'Prea multe request-uri. Așteaptă un minut.' },
      { status: 429 },
    );
  }

  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageTeam) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Doar Root Super Admin (iannC69) poate modifica permisiunile echipei.',
      },
      { status: 403 },
    );
  }

  try {
    const body = req.body;
    const {
      id,
      action,
      username,
      displayName,
      email,
      role,
      status,
      suspendedReason,
      permissions,
      password,
      customTitle,
      avatarUrl,
      avatarColor,
      bio,
      discord,
      steamId,
      githubUsername,
      responsibilities,
      badges,
      docsModifiedCount,
      totpEnabled,
      totpSecret,
    } = body;

    if (!id) {
      return jsonReply(
        expressResponse,
        { error: 'BAD_REQUEST', message: 'ID-ul este obligatoriu.' },
        { status: 400 },
      );
    }

    // ── Privilege Escalation Protection ──
    if (role === 'root_admin' && !session.isRoot) {
      recordAuditEvent({
        action: 'TEAM_MEMBER_UPDATED',
        actor: session.username,
        ip: session.ip || '127.0.0.1',
        details: {
          error: 'UNAUTHORIZED_ESCALATION_ATTEMPT',
          message: 'Attempted to assign Root Admin role without root privileges.',
        },
      });
      return jsonReply(
        expressResponse,
        {
          error: 'FORBIDDEN',
          message:
            'Violare de Securitate: Doar un Root curent poate acorda drepturi de Root Super Admin!',
        },
        { status: 403 },
      );
    }

    const resolvedAvatarUrl = await resolveFallbackAvatar(avatarUrl, steamId, discord);

    const result = await updateTeamMember(id, {
      username,
      displayName,
      email,
      role,
      status,
      action,
      suspendedReason,
      permissions,
      password,
      customTitle,
      avatarUrl: resolvedAvatarUrl,
      avatarColor,
      bio,
      discord,
      steamId,
      githubUsername,
      responsibilities,
      badges,
      docsModifiedCount: typeof docsModifiedCount === 'number' ? docsModifiedCount : undefined,
      totpEnabled,
      totpSecret,
    });

    if (!result.success || !result.member) {
      return jsonReply(
        expressResponse,
        { error: 'UPDATE_FAILED', message: result.error },
        { status: 400 },
      );
    }

    if (action === 'unfreeze' || (status === 'active' && result.member.unfrozenAt)) {
      recordAuditEvent({
        action: 'TEAM_MEMBER_UNFROZEN',
        actor: session.username,
        ip: session.ip,
        details: {
          targetUser: result.member.username,
          displayName: result.member.displayName,
          unfrozenAt: result.member.unfrozenAt,
          message: 'Contul a fost dezghețat din panoul de administrare. Cronometrul de 30 de zile a fost resetat.',
        },
      });
    } else {
      recordAuditEvent({
        action: 'TEAM_MEMBER_UPDATED',
        actor: session.username,
        ip: session.ip,
        details: {
          targetUser: result.member.username,
          displayName: result.member.displayName,
          updatedRole: result.member.role,
          status: result.member.status,
          permissionsUpdated: Boolean(permissions),
        },
      });
    }

    return jsonReply(expressResponse, {
      success: true,
      member: sanitizeMember(result.member),
      message: action === 'unfreeze'
        ? 'Contul a fost dezghețat cu succes! Cronometrul de inactivitate a fost resetat.'
        : 'Modificările au fost salvate.',
    });
  } catch {
    return jsonReply(expressResponse, { error: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const ip = req.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rateCheck = checkRateLimit(`admin_team_del:${ip}`, 20, 60 * 1000, 60 * 1000);
  if (!rateCheck.allowed) {
    return jsonReply(
      expressResponse,
      { error: 'RATE_LIMITED', message: 'Prea multe request-uri. Așteaptă un minut.' },
      { status: 429 },
    );
  }

  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canManageTeam) {
    return jsonReply(
      expressResponse,
      {
        error: 'FORBIDDEN',
        message: 'Doar Root Super Admin (iannC69) poate șterge administratori.',
      },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.originalUrl, 'http://localhost');
  const id = searchParams.get('id');

  if (!id) {
    return jsonReply(
      expressResponse,
      { error: 'BAD_REQUEST', message: 'ID-ul este obligatoriu.' },
      { status: 400 },
    );
  }

  const result = await deleteTeamMember(id);
  if (!result.success) {
    return jsonReply(
      expressResponse,
      { error: 'DELETE_FAILED', message: result.error },
      { status: 400 },
    );
  }

  recordAuditEvent({
    action: 'TEAM_MEMBER_DELETED',
    actor: session.username,
    ip: session.ip,
    details: { targetId: id },
  });

  return jsonReply(expressResponse, { success: true });
}
