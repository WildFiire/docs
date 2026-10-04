import type { Request, Response } from 'express';
import fs from 'node:fs';
import sharp from 'sharp';
import matter from 'gray-matter';
import { docPath } from '../services/documents';

function xml(value: string) {
  return String(value || '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!,
  );
}

const CATEGORY_NAMES: Record<string, string> = {
  informatii: 'Informații Generale',
  currency: 'Currency',
  systems: 'Systems',
  market: 'Market & VIP',
  team: 'Team & Contributors',
  changelog: 'Changelog',
};

const avatarCache = new Map<string, string>(); // username -> base64

async function getAuthorAvatarBase64(username: string): Promise<string | null> {
  const clean = username.trim().toLowerCase();
  if (!clean || clean === 'wildfire' || clean === 'wildfire team') return null;
  if (avatarCache.has(clean)) return avatarCache.get(clean)!;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://github.com/${encodeURIComponent(clean)}.png?size=128`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WildfireDocs/3.0' },
    });
    clearTimeout(timeout);
    if (res.ok) {
      const arr = await res.arrayBuffer();
      const pngBuf = await sharp(Buffer.from(arr)).resize(128, 128).png().toBuffer();
      const b64 = pngBuf.toString('base64');
      avatarCache.set(clean, b64);
      return b64;
    }
  } catch {}
  return null;
}

export async function GET(req: Request, res: Response) {
  const rawSlug = String(req.query.slug || 'index').slice(0, 240);
  const cleanSlug = rawSlug.replace(/^docs\//i, '').replace(/^\/+|\/+$/g, '');

  let title = 'Wildfire Documentation',
    description = 'Documentația oficială a platformei Wildfire — resurse, sisteme și informații.',
    author = 'iannC69';

  // Attempt to load frontmatter from the document
  let filePath = '';
  for (const s of [cleanSlug, rawSlug, 'docs/' + cleanSlug]) {
    try {
      const p = docPath(s);
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    } catch {}
  }

  if (filePath) {
    try {
      const doc = matter(fs.readFileSync(filePath, 'utf8'));
      if (doc.data.title) title = String(doc.data.title);
      if (doc.data.description) description = String(doc.data.description);
      author = String(
        doc.data.gitLastCommitter ||
        doc.data.lastUpdatedBy ||
        doc.data.author ||
        (Array.isArray(doc.data.authors) ? doc.data.authors[0] : '') ||
        'iannC69',
      );
    } catch {}
  } else if (cleanSlug === 'index' || cleanSlug === 'docs' || cleanSlug === '') {
    title = 'Wildfire.ro Docs - CS2 Wikipedia';
    description = 'Resurse, sisteme și informații complete pentru Counter-Strike 2 pe Wildfire.ro.';
    author = 'Wildfire Team';
  }

  const rootSlug = cleanSlug.split('/')[0]?.toLowerCase() || '';
  const categoryLabel = CATEGORY_NAMES[rootSlug] || (rootSlug ? rootSlug.toUpperCase() : 'DOCS');

  // Multi-line title wrapping
  const words = title.split(/\s+/);
  const titleLines: string[] = [];
  let currentLine = '';
  const maxLineLen = title.length > 35 ? 30 : 25;

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxLineLen) {
      if (currentLine) titleLines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }
  if (currentLine) titleLines.push(currentLine.trim());
  const displayTitleLines = titleLines.slice(0, 2);

  // Description clean 2-line wrapping
  const descWords = description.trim().split(/\s+/);
  const descLines: string[] = [];
  let curDesc = '';
  for (const w of descWords) {
    if ((curDesc + ' ' + w).trim().length > 70) {
      if (curDesc) descLines.push(curDesc.trim());
      curDesc = w;
      if (descLines.length === 2) break;
    } else {
      curDesc += (curDesc ? ' ' : '') + w;
    }
  }
  if (curDesc && descLines.length < 2) descLines.push(curDesc.trim());
  if (descWords.length > 0 && descLines.length === 2 && curDesc !== descLines[1]) {
    descLines[1] = descLines[1].replace(/\.*$/, '') + '...';
  }

  // Dynamic category pill width
  const categoryPillWidth = Math.max(150, Math.min(360, categoryLabel.length * 13 + 52));

  // Author avatar (with fallback)
  const avatarB64 = await getAuthorAvatarBase64(author);
  const fontStack = 'Segoe UI, Inter, -apple-system, system-ui, Roboto, Helvetica, Arial, sans-serif';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <!-- Dual radial gradients 1:1 matching wf-docscore -->
      <radialGradient id="cyanGlow" cx="100%" cy="0%" r="55%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#09090b" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="orangeGlow" cx="0%" cy="100%" r="60%">
        <stop offset="0%" stop-color="#f97316" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#09090b" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#e4e4e7" />
      </linearGradient>
      ${
        avatarB64
          ? `
      <clipPath id="avatarClip">
        <circle cx="28" cy="30" r="28" />
      </clipPath>`
          : ''
      }
    </defs>

    <!-- Base background -->
    <rect width="1200" height="630" fill="#09090b" />
    <rect width="1200" height="630" fill="url(#cyanGlow)" />
    <rect width="1200" height="630" fill="url(#orangeGlow)" />

    <!-- Top Row: Category Badge (left) & Verified Badge (right) -->
    <g transform="translate(60, 54)">
      <!-- Category Pill -->
      <rect x="0" y="0" width="${categoryPillWidth}" height="48" rx="24" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
      <text x="${categoryPillWidth / 2}" y="32" fill="#22d3ee" font-family="${fontStack}" font-size="20" font-weight="700" letter-spacing="2" text-anchor="middle">${xml(categoryLabel)}</text>

      <!-- Verified Badge -->
      <g transform="translate(${1080 - 150}, 2)">
        <rect x="0" y="0" width="150" height="44" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1" />
        <text x="75" y="28" fill="#10b981" font-family="${fontStack}" font-size="18" font-weight="700" letter-spacing="1" text-anchor="middle">✓ VERIFIED</text>
      </g>
    </g>

    <!-- Middle: Title & Description -->
    <g transform="translate(60, ${displayTitleLines.length > 1 ? 160 : 180})">
      ${displayTitleLines
        .map(
          (line, idx) => `
        <text x="0" y="${60 + idx * 82}" fill="url(#titleGradient)" font-family="${fontStack}" font-size="${displayTitleLines.length > 1 ? 64 : 76}" font-weight="900" letter-spacing="-1.5">${xml(line)}</text>
      `,
        )
        .join('')}

      <!-- Description lines -->
      ${descLines
        .map(
          (line, idx) => `
        <text x="0" y="${displayTitleLines.length * 82 + 38 + idx * 40}" fill="#a1a1aa" font-family="${fontStack}" font-size="26" font-weight="400">${xml(line)}</text>
      `,
        )
        .join('')}
    </g>

    <!-- Bottom: Divider & Footer -->
    <line x1="60" y1="500" x2="1140" y2="500" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />

    <g transform="translate(60, 530)">
      <!-- Author (Left) -->
      ${
        avatarB64
          ? `
        <image href="data:image/png;base64,${avatarB64}" x="0" y="2" width="56" height="56" clip-path="url(#avatarClip)" />
        <circle cx="28" cy="30" r="28" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" />
      `
          : `
        <circle cx="28" cy="30" r="28" fill="#ff5500" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" />
        <text x="28" y="38" fill="#ffffff" font-family="${fontStack}" font-size="24" font-weight="bold" text-anchor="middle">${xml(author.charAt(0).toUpperCase())}</text>
      `
      }

      <text x="76" y="20" fill="#a1a1aa" font-family="${fontStack}" font-size="16" font-weight="500">Author</text>
      <text x="76" y="44" fill="#ffffff" font-family="${fontStack}" font-size="22" font-weight="700">${xml(author)}</text>

      <!-- Branding (Right) -->
      <g transform="translate(1080, 0)">
        <text x="0" y="22" fill="#f97316" font-family="${fontStack}" font-size="26" font-weight="800" letter-spacing="1.5" text-anchor="end">WILDFIRE DOCS</text>
        <text x="0" y="44" fill="#71717a" font-family="${fontStack}" font-size="14" font-weight="600" letter-spacing="1" text-anchor="end">ENGINEERING SPECIFICATION</text>
      </g>
    </g>
  </svg>`;

  res
    .set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    })
    .send(await sharp(Buffer.from(svg)).png().toBuffer());
}
