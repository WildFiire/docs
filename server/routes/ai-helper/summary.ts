import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import { recordAiInteraction } from '@server/lib/security/aiTelemetry';

interface SummaryResponse {
  overview: string;
  keyTakeaways: string[];
  commands: string[];
  rulesOrRequirements: string[];
}

// In-memory cache for ultra-fast instant loads
const summaryCache = new Map<string, { data: SummaryResponse; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Regex heuristic fallback extractor
function extractFallbackSummary(docTitle: string, rawContent: string): SummaryResponse {
  const lines = rawContent
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // Extract paragraphs that are not headers or tables
  const textParas = lines.filter(
    (l) =>
      !l.startsWith('#') &&
      !l.startsWith('|') &&
      !l.startsWith('```') &&
      !l.startsWith('>') &&
      l.length > 20,
  );

  const overview = textParas[0]
    ? textParas[0].replace(/[*_`]/g, '').slice(0, 220)
    : `Ghid oficial complet despre ${docTitle} pe platforma de documentație WildFire.ro.`;

  // Extract commands (!ws, !knife, !shop, !mvp, bind, connect, etc.)
  const cmdMatches =
    rawContent.match(/(?:![a-zA-Z0-9_-]+|connect\s+[a-zA-Z0-9_.-]+|bind\s+"?[a-zA-Z0-9_-]+"?)/g) ||
    [];
  const uniqueCmds = Array.from(new Set(cmdMatches)).slice(0, 8);

  // Extract bullet points
  const bulletMatches = lines
    .filter((l) => /^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l))
    .map((l) =>
      l
        .replace(/^[-*]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/[*_`]/g, '')
        .trim(),
    )
    .filter((l) => l.length > 10 && l.length < 160)
    .slice(0, 4);

  const keyTakeaways =
    bulletMatches.length >= 2
      ? bulletMatches
      : [
          `Ghidul oferă informații verificate pentru ${docTitle}.`,
          `Include pașii de configurare și regulile specifice serverului CS2.`,
          `Recomandat tuturor jucătorilor activi pe comunitatea WildFire.`,
        ];

  // Extract rules or requirements
  const ruleLines = lines
    .filter(
      (l) =>
        /regul|cerin|sanc|interzis|obligatoriu|ban|gag|prime|ore/i.test(l) &&
        (l.startsWith('-') || l.startsWith('*') || l.length < 140),
    )
    .map((l) =>
      l
        .replace(/^[-*]\s+/, '')
        .replace(/[*_`]/g, '')
        .trim(),
    )
    .slice(0, 3);

  return {
    overview,
    keyTakeaways,
    commands: uniqueCmds,
    rulesOrRequirements: ruleLines,
  };
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const startTime = performance.now();
  let ip = '127.0.0.1';
  try {
    const forwarded = req.get('x-forwarded-for');
    if (forwarded) ip = forwarded.split(',')[0].trim();
  } catch {}

  let body: any = {};
  try {
    body = req.body;
  } catch {
    return jsonReply(expressResponse, { error: 'Payload invalid' }, { status: 400 });
  }

  const { docTitle, docSlug, rawContent } = body || {};
  if (!docTitle || !rawContent) {
    return jsonReply(expressResponse, { error: 'Date incomplete' }, { status: 400 });
  }

  const cacheKey = `${docSlug || docTitle}_${rawContent.length}`;
  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return jsonReply(expressResponse, {
      success: true,
      summary: cached.data,
      cached: true,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const fallback = extractFallbackSummary(docTitle, rawContent);
    summaryCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return jsonReply(expressResponse, {
      success: true,
      summary: fallback,
      cached: false,
    });
  }

  const systemInstruction = `Ești WF AI Synthesizer — modulul de sinteză inteligentă al platformei WildFire.ro (CS2).
Sarcina ta este să extragi un rezumat ultra-clar, dens și util (în 30 de secunde de lectură) din ghidul Markdown furnizat.

REGULI STRICTE:
1. Răspunde EXCLUSIV în format JSON VALID conform structurii cerute.
2. NU folosi niciun emoji Unicode (fără emoticoane).
3. Păstrează tonul profesional, precis și orientat pe acțiune.
4. Extrage comenzile specifice de CS2 (ex: !ws, !knife, !shop, !mvp, bind-uri, connect) în array-ul "commands". Dacă nu există, returnează un array gol.
5. Extrage cerințele sau regulile cheie (ex: vârstă minimă, număr de ore, comportament, sancțiuni) în array-ul "rulesOrRequirements".
6. În "overview", scrie exact 2 propoziții care explică esențialul ghidului.
7. În "keyTakeaways", furnizează 3-4 puncte concise cu ideile principale.

STRUCTURĂ JSON:
{
  "overview": "string",
  "keyTakeaways": ["string", "string", "string"],
  "commands": ["string"],
  "rulesOrRequirements": ["string"]
}`;

  const promptText = `GHID DE REZUMAT:
Titlu: ${docTitle}
Cale: /docs/${docSlug || 'ghid'}

CONȚINUT GHID:
${rawContent.slice(0, 8000)}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          maxOutputTokens: 800,
        },
      }),
    });

    const latency = performance.now() - startTime;

    if (!geminiRes.ok) {
      console.warn('[AI Summary] Gemini API non-OK, using heuristic fallback.');
      const fallback = extractFallbackSummary(docTitle, rawContent);
      summaryCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return jsonReply(expressResponse, {
        success: true,
        summary: fallback,
        cached: false,
      });
    }

    const data = await geminiRes.json();
    const rawAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const promptTokens = data.usageMetadata?.promptTokenCount || 0;
    const candidatesTokens = data.usageMetadata?.candidatesTokenCount || 0;

    let parsed: SummaryResponse;
    try {
      parsed = JSON.parse(rawAnswer);
    } catch {
      parsed = extractFallbackSummary(docTitle, rawContent);
    }

    // Telemetry log
    recordAiInteraction({
      query: `[AI Quick Summary] ${docTitle}`,
      responseChars: rawAnswer?.length || 0,
      promptTokens,
      candidatesTokens,
      latencyMs: latency,
      status: 'success',
      ip,
      model: 'gemini-3.5-flash-lite (Summary)',
    });

    summaryCache.set(cacheKey, { data: parsed, timestamp: Date.now() });

    return jsonReply(expressResponse, {
      success: true,
      summary: parsed,
      cached: false,
    });
  } catch (error: any) {
    console.error('[AI Summary] Request failed:', error);
    const fallback = extractFallbackSummary(docTitle, rawContent);
    summaryCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return jsonReply(expressResponse, {
      success: true,
      summary: fallback,
      cached: false,
    });
  }
}
