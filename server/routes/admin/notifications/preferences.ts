import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import { findTeamMemberByUsername, updateTeamMember } from '@server/lib/security/teamStore';

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
  }

  const member = await findTeamMemberByUsername(session.username);
  if (!member) {
    return jsonReply(expressResponse, { error: 'User not found' }, { status: 404 });
  }

  const prefs = member.notificationPreferences || {
    task: true,
    system: true,
    security: true,
    content: true,
    report: true,
  };

  return jsonReply(expressResponse, { preferences: prefs });
}

export async function PATCH(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (!session) {
    return jsonReply(expressResponse, { error: 'Unauthorized' }, { status: 401 });
  }

  const member = await findTeamMemberByUsername(session.username);
  if (!member) {
    return jsonReply(expressResponse, { error: 'User not found' }, { status: 404 });
  }

  try {
    const body = req.body;
    const { preferences } = body;

    if (!preferences || typeof preferences !== 'object') {
      return jsonReply(expressResponse, { error: 'Invalid preferences object' }, { status: 400 });
    }

    const {
      success,
      error,
      member: updatedMember,
    } = await updateTeamMember(member.id, {
      notificationPreferences: preferences,
    });

    if (!success) {
      return jsonReply(expressResponse, { error: error }, { status: 400 });
    }

    return jsonReply(expressResponse, {
      success: true,
      preferences: updatedMember?.notificationPreferences,
    });
  } catch (err: any) {
    console.error('[API Admin Notif Preferences] PATCH error:', err);
    return jsonReply(expressResponse, { error: 'Server error' }, { status: 500 });
  }
}
