import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getGitOpsSettings, updateGitOpsSettings } from '@server/lib/gitops/store';
import { pullContentFromGitHub } from '@server/lib/gitops/syncEngine';
import { validateSessionToken } from '@server/lib/security/auth';

// Track last checked timestamp in memory
let lastCheckedSha = '';
let lastCheckedTime = 0;

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  // Security: require internal poll secret header OR valid admin session
  const pollSecret = req.get('x-poll-secret');
  const sessionCookie = req.cookies['wf_admin_session'];
  const hasSecret =
    pollSecret &&
    process.env.INTERNAL_POLL_SECRET &&
    pollSecret === process.env.INTERNAL_POLL_SECRET;
  const session = sessionCookie ? await validateSessionToken(sessionCookie) : null;
  const hasSession = Boolean(session?.isRoot);

  if (!hasSecret && !hasSession) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const settings = getGitOpsSettings();
  if (!settings.sync.autoRevalidate)
    return jsonReply(expressResponse, { active: false, reason: 'Auto sync disabled' });

  const { owner, repo, branch } = settings.publicRepo;
  const token = settings.sync.githubToken;

  if (!owner || !repo) {
    return jsonReply(expressResponse, { active: false, reason: 'No public repo configured' });
  }

  const now = Date.now();
  // Throttle checks to at most once every 10 seconds per worker
  if (now - lastCheckedTime < 10000 && lastCheckedSha) {
    return jsonReply(expressResponse, {
      active: true,
      lastCommit: lastCheckedSha,
      cached: true,
    });
  }

  const authHeaders: Record<string, string> = {
    'User-Agent': 'Wildfire-Docs-AutoPoll/1.0',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    authHeaders['Authorization'] = `Bearer ${token.trim()}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, {
      headers: authHeaders,
    });

    if (!res.ok) {
      return jsonReply(expressResponse, {
        active: false,
        error: `GitHub branch query failed: HTTP ${res.status}`,
      });
    }

    const data = await res.json();
    const remoteSha = data.commit?.sha || '';
    const force = new URL(req.originalUrl, 'http://localhost').searchParams.get('force') === 'true';
    const currentKnownSha = settings.sync.lastSyncCommit || '';

    // If new commit detected on GitHub or force requested, pull automatically
    if (force || (remoteSha && remoteSha !== currentKnownSha)) {
      console.log(
        `[AutoSync Daemon] Nou commit detectat pe GitHub [${remoteSha}]. Se execută descărcarea automată...`,
      );
      const syncResult = await pullContentFromGitHub();
      lastCheckedSha = syncResult.success ? remoteSha : '';
      lastCheckedTime = now;

      return jsonReply(expressResponse, {
        active: true,
        updated: syncResult.success && syncResult.filesUpdated > 0,
        error: syncResult.error,
        conflicts: syncResult.conflicts,
        previousSha: currentKnownSha,
        newSha: remoteSha,
        filesUpdated: syncResult.filesUpdated,
      });
    }

    lastCheckedSha = remoteSha;
    lastCheckedTime = now;
    return jsonReply(expressResponse, {
      active: true,
      updated: false,
      currentSha: remoteSha,
    });
  } catch (err: any) {
    return jsonReply(expressResponse, { active: false, error: err?.message });
  }
}
