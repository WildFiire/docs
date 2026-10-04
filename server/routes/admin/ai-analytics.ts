import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import {
  getAiTelemetrySummary,
  clearAiTelemetry,
  recordAiInteraction,
} from '@server/lib/security/aiTelemetry';

interface DocContextItem {
  path: string;
  title: string;
  category: string;
  charCount: number;
  estTokens: number;
  lastModified: string;
}

function getKnowledgeBaseInfo() {
  const contextPath = path.join(RUNTIME_ROOT, 'content', 'ai-context.json');
  const docsDir = DOCS_ROOT;
  const docs: DocContextItem[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isSymbolicLink() ||
        entry.name.startsWith('.') ||
        ['admin', 'panel', 'public', 'docs', 'team', 'changelog', 'maintenance'].includes(
          entry.name,
        )
      )
        continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else if (entry.name.endsWith('.md')) {
        const rel = path.relative(docsDir, full).replace(/\\/g, '/');
        const stats = fs.statSync(full);
        const raw = fs.readFileSync(full, 'utf-8');
        const titleMatch = raw.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : rel.replace(/\.md$/, '');
        const category = rel.split('/')[0] || 'general';
        const charCount = raw.length;
        const estTokens = Math.round(charCount / 4);

        docs.push({
          path: rel,
          title,
          category,
          charCount,
          estTokens,
          lastModified: stats.mtime.toISOString(),
        });
      }
    }
  }

  scan(docsDir);

  const totalChars = docs.reduce((acc, d) => acc + d.charCount, 0);
  const totalTokens = Math.round(totalChars / 4);

  let generatedAt = new Date().toISOString();
  if (fs.existsSync(contextPath)) {
    try {
      const json = JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
      if (json.generatedAt) generatedAt = json.generatedAt;
    } catch {}
  }

  return {
    docCount: docs.length,
    totalChars,
    totalTokens,
    generatedAt,
    docs: docs.sort(
      (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
    ),
  };
}

function rebuildContextFile() {
  const docsDir = DOCS_ROOT;
  const outputPath = path.join(RUNTIME_ROOT, 'content', 'ai-context.json');
  const docsList: { path: string; title: string; content: string; plainText: string }[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (
        e.isSymbolicLink() ||
        e.name.startsWith('.') ||
        ['admin', 'panel', 'public', 'docs', 'team', 'changelog', 'maintenance'].includes(e.name)
      )
        continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) scan(full);
      else if (e.name.endsWith('.md')) {
        const rel = path.relative(docsDir, full).replace(/\\/g, '/');
        const raw = fs.readFileSync(full, 'utf-8').trim();
        const titleMatch = raw.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : rel.replace(/\.md$/, '');
        docsList.push({
          path: rel,
          title,
          content: raw,
          plainText: raw.toLowerCase(),
        });
      }
    }
  }

  scan(docsDir);

  let teamMembers: any[] = [];
  try {
    const teamPath = path.join(RUNTIME_ROOT, 'content', 'team.json');
    if (fs.existsSync(teamPath)) {
      const raw = JSON.parse(fs.readFileSync(teamPath, 'utf-8'));
      if (Array.isArray(raw)) {
        teamMembers = raw
          .filter((m) => m.status === 'active')
          .map(
            ({
              passwordHash,
              salt,
              email,
              totpSecret,
              totpEnabled,
              permissions,
              notificationPrefs,
              ...safe
            }) => safe,
          );
      }
    }
  } catch {}

  const totalChars = docsList.reduce((acc, d) => acc + d.content.length, 0);
  const payload = {
    generatedAt: new Date().toISOString(),
    docCount: docsList.length,
    teamCount: teamMembers.length,
    totalChars,
    docs: docsList,
    team: teamMembers,
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
  return {
    docCount: docsList.length,
    teamCount: teamMembers.length,
    totalChars,
    generatedAt: payload.generatedAt,
  };
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!session.isRoot && !session.permissions?.canViewAiStats) {
    return jsonReply(
      expressResponse,
      { error: 'FORBIDDEN', message: 'Acces Refuzat: Nu ai permisiunea canViewAiStats.' },
      { status: 403 },
    );
  }

  const summary = getAiTelemetrySummary();
  const knowledgeBase = getKnowledgeBaseInfo();

  return jsonReply(expressResponse, {
    ...summary,
    knowledgeBase,
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = req.body;
  } catch {}

  const action = body.action;

  // 1. Rebuild AI Context
  if (action === 'rebuild_context') {
    if (
      !session.isRoot &&
      !session.permissions?.canManageSettings &&
      !session.permissions?.canEditDocs
    ) {
      return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
    }

    const result = rebuildContextFile();
    return jsonReply(expressResponse, {
      success: true,
      message: `Indexul AI a fost recompilat cu succes! (${result.docCount} ghiduri, ${result.totalChars.toLocaleString()} caractere)`,
      ...result,
    });
  }

  // 2. AI Diagnostic Sandbox Prompt Test
  if (action === 'test_prompt') {
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) {
      return jsonReply(expressResponse, { error: 'Promptul nu poate fi gol.' }, { status: 400 });
    }

    const startTime = performance.now();
    const apiKey =
      process.env.GEMINI_API_KEY ||
      Buffer.from('QVEuQWI4Uk42SUxOVmc4QVFoY183bGZxclVIalM4YnJGTlhhQWl5UGItQUNpOFNfZ25JNHc=', 'base64').toString('utf-8');

    if (!apiKey) {
      return jsonReply(
        expressResponse,
        { error: 'GEMINI_API_KEY lipsește din configurație.' },
        { status: 500 },
      );
    }

    const knowledge = getKnowledgeBaseInfo();
    const contextFile = path.join(RUNTIME_ROOT, 'content', 'ai-context.json');
    let docsText = '';
    if (fs.existsSync(contextFile)) {
      try {
        const json = JSON.parse(fs.readFileSync(contextFile, 'utf-8'));
        docsText = (json.docs || [])
          .map(
            (d: any) => `=== DOC: ${d.title} (/${d.path.replace(/\.md$/, '')}) ===\n${d.content}`,
          )
          .join('\n\n');
      } catch {}
    }

    const systemPrompt = `Ești WF AI Helper (v1.7.0). Răspunde strict bazat pe documentația WildFire.ro:\n\n${docsText}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: 1024,
          },
        }),
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return jsonReply(expressResponse, {
          success: false,
          error: 'Eroare la apelul Gemini',
          details: errJson,
          latencyMs,
        });
      }

      const data = await res.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || '(Răspuns gol)';
      const usage = data.usageMetadata || {};

      recordAiInteraction({
        query: `[Sandbox Admin] ${prompt}`,
        promptTokens: usage.promptTokenCount || knowledge.totalTokens,
        candidatesTokens: usage.candidatesTokenCount || 100,
        latencyMs,
        status: 'success',
        model: 'gemini-3.5-flash-lite (Sandbox)',
        ip: 'admin-local',
      });

      return jsonReply(expressResponse, {
        success: true,
        answer,
        latencyMs,
        model: 'gemini-3.5-flash-lite',
        usage: {
          promptTokens: usage.promptTokenCount || knowledge.totalTokens,
          candidatesTokens: usage.candidatesTokenCount || Math.round(answer.length / 4),
          totalTokens:
            usage.totalTokenCount || knowledge.totalTokens + Math.round(answer.length / 4),
        },
      });
    } catch (e: any) {
      return jsonReply(expressResponse, {
        success: false,
        error: e?.message || 'Eroare rețea sandbox',
        latencyMs: Math.round(performance.now() - startTime),
      });
    }
  }

  return jsonReply(expressResponse, { error: 'Acțiune necunoscută' }, { status: 400 });
}

export async function DELETE(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  // Super admin root or users with canManageSettings permission can purge AI telemetry
  if (!session.isRoot && !session.permissions?.canManageSettings) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN' }, { status: 403 });
  }

  clearAiTelemetry();
  return jsonReply(expressResponse, {
    success: true,
    message: 'AI Telemetry purged successfully.',
  });
}
