import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply } from '@server/http';
import { findTeamMemberByUsername } from '@server/lib/security/teamStore';
import { isRootUsername } from '@server/lib/security/auth';

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const username = String(req.body?.username || '').trim();

  if (!username) {
    return jsonReply(
      expressResponse,
      { exists: false, error: 'Introduceți Administrator ID-ul pentru verificare.' },
      { status: 400 },
    );
  }

  const clean = username.toLowerCase();
  let member = await findTeamMemberByUsername(username);

  // Alias lookup for root
  if (!member && (clean === 'iannc' || clean === 'iannc69')) {
    member = await findTeamMemberByUsername('iannC69');
  }

  const isRoot = isRootUsername(username) || member?.isRoot;

  if (!member && !isRoot) {
    return jsonReply(
      expressResponse,
      {
        exists: false,
        error: 'Utilizator invalid! Acest cont nu a fost găsit în baza de date.',
      },
      { status: 404 },
    );
  }

  if (member && member.status === 'suspended') {
    return jsonReply(
      expressResponse,
      {
        exists: false,
        error: 'Acest cont administrativ este suspendat.',
      },
      { status: 403 },
    );
  }

  const displayName = member?.displayName || (isRoot ? 'iannC' : username);
  const customTitle =
    member?.customTitle || (isRoot ? 'Community Manager' : 'Administrator Wildfire');
  const avatarUrl =
    member?.avatarUrl || (isRoot ? 'https://github.com/iannC69.png' : '');
  const avatarColor = member?.avatarColor || (isRoot ? '#ff6b00' : '#f97316');
  const role = isRoot
    ? 'Root Super Admin'
    : member?.role === 'custom'
      ? 'Administrator'
      : member?.role || 'Administrator';
  const badges =
    member?.badges && member.badges.length
      ? member.badges
      : isRoot
        ? ['COMMUNITY MANAGER', 'DOCS LEAD']
        : ['ADMINISTRATOR'];

  const responsibilities =
    member?.responsibilities && member.responsibilities.length
      ? member.responsibilities
      : isRoot
        ? [
            'Coordonare & Management Documentație',
            'Supervizare Infrastructură & Echipă Staff',
            'Securitate Platformă & RBAC',
          ]
        : ['Editare & Publicare Documentație', 'Ghiduri Jucători & Suport Comunitate'];

  return jsonReply(expressResponse, {
    exists: true,
    user: {
      username: member?.username || username,
      displayName,
      customTitle,
      avatarUrl,
      avatarColor,
      role,
      badges,
      responsibilities,
      totpEnabled: Boolean(member?.totpEnabled),
      isRoot: Boolean(isRoot),
      docsModifiedCount: member?.docsModifiedCount || 0,
    },
  });
}
