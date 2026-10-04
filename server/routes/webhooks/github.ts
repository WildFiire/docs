import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import crypto from 'crypto';
import { getGitOpsSettings } from '@server/lib/gitops/store';
import { pullContentFromGitHub } from '@server/lib/gitops/syncEngine';
import { recordAuditEvent } from '@server/lib/security/audit';

/**
 * Verifies the GitHub HMAC SHA-256 signature from the X-Hub-Signature-256 header.
 */
function verifySignature(payload: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) return false;
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = `sha256=${hmac.update(payload).digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const signature = req.get('x-hub-signature-256');
  const event = req.get('x-github-event') || 'push';
  const rawBody = req.rawBody?.toString('utf8') || '';

  const settings = getGitOpsSettings();

  // 1. Verify HMAC Signature
  if (!settings.sync.webhookSecret)
    return jsonReply(expressResponse, { error: 'Webhook is not configured' }, { status: 503 });
  {
    const isValid = verifySignature(rawBody, signature, settings.sync.webhookSecret);
    if (!isValid) {
      console.warn('[GitHub Webhook] Unauthorized attempt with invalid HMAC signature.');
      return jsonReply(expressResponse, { error: 'Invalid signature' }, { status: 401 });
    }
  }

  // 2. Handle GitHub Ping Event
  if (event === 'ping') {
    return jsonReply(expressResponse, {
      success: true,
      message: 'PONG! Webhook signature verified and operational.',
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Handle GitHub Push Event
  if (event === 'push') {
    try {
      const payload = JSON.parse(rawBody);
      const ref = payload.ref || '';
      const targetBranchRef = `refs/heads/${settings.publicRepo.branch}`;

      // Check if pushed branch matches configured branch
      if (ref !== targetBranchRef) {
        return jsonReply(expressResponse, {
          ignored: true,
          message: `Ignored push to branch ${ref} (Target branch is ${targetBranchRef}).`,
        });
      }

      const expectedRepository = `${settings.publicRepo.owner}/${settings.publicRepo.repo}`;
      if (payload.repository?.full_name?.toLowerCase() !== expectedRepository.toLowerCase())
        return jsonReply(expressResponse, { error: 'Repository mismatch' }, { status: 400 });

      const pusherName = payload.pusher?.name || payload.sender?.login || 'github_contributor';
      const commitMsg = payload.head_commit?.message?.split('\n')[0] || 'Update content';

      // Execute pull from GitHub
      const syncRes = await pullContentFromGitHub();

      recordAuditEvent({
        action: 'GITOPS_WEBHOOK_PUSH',
        actor: `@${pusherName}`,
        details: {
          commit: syncRes.commitSha,
          message: commitMsg,
          repo: payload.repository?.full_name,
          filesUpdated: syncRes.filesUpdated,
        },
      });

      return jsonReply(expressResponse, {
        success: syncRes.success,
        revalidated: false,
        publicationQueued: syncRes.success && syncRes.filesUpdated > 0,
        commit: syncRes.commitSha,
        pusher: pusherName,
        filesUpdated: syncRes.filesUpdated,
        message: syncRes.success ? 'Content synchronized; changed pages are queued for static publication.' : syncRes.error,
      });
    } catch (err: any) {
      console.error('[GitHub Webhook] Failed to process payload:', err);
      return jsonReply(
        expressResponse,
        { error: 'Failed to process push payload', details: err?.message },
        { status: 500 },
      );
    }
  }

  return jsonReply(expressResponse, { received: true, event });
}
