import { steamProfileXml } from '@server/security/steam';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { findTeamMemberByUsername, updateTeamMember } from '@server/lib/security/teamStore';
import { recordAuditEvent } from '@server/lib/security/audit';

// Refolosim funcția de extragere a avatarului (prezentă și în team/route.ts)
async function resolveFallbackAvatar(
  avatarUrl?: string,
  steamId?: string,
  discord?: string,
): Promise<string | undefined> {
  if (avatarUrl && avatarUrl.trim()) {
    return avatarUrl.trim();
  }
  if (steamId && steamId.trim()) {
    const clean = steamId.trim();
    let xmlUrl: string;
    try { xmlUrl = steamProfileXml(steamId); } catch { return undefined; }
  try {
      const res = await fetch(xmlUrl, { signal: AbortSignal.timeout(8000), redirect: 'error',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
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
  if (discord && /^\d{17,20}$/.test(discord.trim())) {
    return `https://dcdn.dstn.to/avatars/${discord.trim()}`;
  }
  return undefined;
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const member = await findTeamMemberByUsername(session.username);
  if (!member) {
    return jsonReply(expressResponse, { error: 'NOT_FOUND' }, { status: 404 });
  }

  const { passwordHash, salt, totpSecret, ...safeMember } = member;
  return jsonReply(expressResponse, { profile: safeMember });
}

export async function PUT(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const member = await findTeamMemberByUsername(session.username);
  if (!member) {
    return jsonReply(expressResponse, { error: 'NOT_FOUND' }, { status: 404 });
  }

  try {
    const body = req.body;
    const { displayName, email, password, avatarUrl, bio, discord, steamId, githubUsername } = body;

    const resolvedAvatarUrl = await resolveFallbackAvatar(avatarUrl, steamId, discord);

    // Permitem update-ul doar pe câmpurile sigure
    const result = await updateTeamMember(member.id, {
      displayName: displayName?.trim(),
      email: email?.trim(),
      password: password?.trim() ? password.trim() : undefined,
      avatarUrl: resolvedAvatarUrl,
      bio: bio?.trim(),
      discord: discord?.trim(),
      steamId: steamId?.trim(),
      githubUsername: githubUsername?.trim(),
    });

    if (!result.success || !result.member) {
      return jsonReply(
        expressResponse,
        { error: 'UPDATE_FAILED', message: result.error },
        { status: 400 },
      );
    }

    recordAuditEvent({
      action: 'PROFILE_SELF_UPDATED',
      actor: session.username,
      ip: session.ip,
      details: {
        updatedFields: Object.keys(body).filter((k) => body[k] !== undefined && body[k] !== ''),
      },
    });

    const { passwordHash, salt, totpSecret, ...safeMember } = result.member;
    return jsonReply(expressResponse, { success: true, profile: safeMember });
  } catch (err) {
    console.error('[Profile Update Error]', err);
    return jsonReply(expressResponse, { error: 'SERVER_ERROR' }, { status: 500 });
  }
}
