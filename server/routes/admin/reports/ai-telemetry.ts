import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { getAuthenticatedAdminSession } from '@server/lib/security/auth';
import fs from 'fs';
import path from 'path';

function getDiscordWebhookUrl(): string | null {
  return (
    process.env.DISCORD_LOGS_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_LOGS ||
    process.env.DISCORD_WEBHOOK_AUDIT ||
    process.env.DISCORD_WEBHOOK_SECURITY ||
    process.env.DISCORD_WEBHOOK_URL ||
    null
  );
}

async function dispatchAiTelemetry() {
  const webhookUrl = getDiscordWebhookUrl();
  if (!webhookUrl) {
    throw new Error(
      'Webhook-ul Discord nu este configurat (DISCORD_LOGS_WEBHOOK_URL sau DISCORD_WEBHOOK_URL).',
    );
  }

  let telemetry = {
    lifetimeQueries: 0,
    totalCostUsd: 0,
    totalPromptTokens: 0,
    totalCandidatesTokens: 0,
    logs: [] as any[],
  };

  try {
    const p = path.join(RUNTIME_ROOT, 'content', 'ai-telemetry.json');
    if (fs.existsSync(p)) telemetry = JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {}

  const logs: any[] = telemetry.logs || [];
  const successLogs = logs.filter((l) => l.status === 'success');
  const rateLimitedLogs = logs.filter((l) => l.status === 'rate_limited');
  const avgLatency =
    successLogs.length > 0
      ? Math.round(successLogs.reduce((s, l) => s + (l.latencyMs || 0), 0) / successLogs.length)
      : 0;
  const successRate =
    logs.filter((l) => l.status !== 'rate_limited').length > 0
      ? Math.round(
          (successLogs.length / logs.filter((l) => l.status !== 'rate_limited').length) * 100,
        )
      : 100;
  const totalTokens = (telemetry.totalPromptTokens || 0) + (telemetry.totalCandidatesTokens || 0);

  const recentQueries =
    logs
      .slice(0, 5)
      .map(
        (l) =>
          `💬 \`[${l.status.toUpperCase()}]\` ${l.querySnippet?.slice(0, 45) || '—'} (${l.latencyMs || 0}ms)`,
      )
      .join('\n') || '_Niciun query recent._';

  const embed = {
    title: '🤖 AI Helper Telemetry — WF-DOCSCORE',
    description: `>>> 🧠 **Raport de performanță AI generat la ${new Date().toLocaleString('ro-RO')}**`,
    color: 0x8b5cf6,
    fields: [
      {
        name: '🔢 Queries Lifetime',
        value: `**${telemetry.lifetimeQueries}** interogări`,
        inline: true,
      },
      {
        name: '💰 Cost Total USD',
        value: `**$${(telemetry.totalCostUsd || 0).toFixed(4)}**`,
        inline: true,
      },
      {
        name: '📊 Tokeni Totali',
        value: `**${totalTokens.toLocaleString()}** tokens`,
        inline: true,
      },
      {
        name: '⚡ Latență Medie',
        value: `**${avgLatency}ms**`,
        inline: true,
      },
      {
        name: '⭐ Rata de Succes',
        value: `**${successRate}%**`,
        inline: true,
      },
      {
        name: '🚫 Rate Limited',
        value: `**${rateLimitedLogs.length}** blocate`,
        inline: true,
      },
      {
        name: '📝 Ultimele 5 Interogări AI',
        value: recentQueries,
        inline: false,
      },
    ],
    footer: { text: 'WF-DOCSCORE Admin · AI Telemetry' },
    timestamp: new Date().toISOString(),
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Discord a raspuns cu statusul ${res.status}: ${txt || 'Eroare retea'}`);
  }
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const session = await getAuthenticatedAdminSession();
  if (
    !session?.isRoot &&
    !session?.permissions?.canManageWebhooks &&
    !session?.permissions?.canViewAiStats
  ) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    await dispatchAiTelemetry();
    return jsonReply(expressResponse, {
      success: true,
      message: 'AI Telemetry Report a fost transmis cu succes pe Discord (#logs).',
    });
  } catch (err: any) {
    return jsonReply(expressResponse, { error: err.message }, { status: 500 });
  }
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  return jsonReply(expressResponse, { success: true, dispatchMethod: 'POST', message: 'Raportul se trimite doar prin acțiunea explicită POST.' });
}
