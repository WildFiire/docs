import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
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
  currency: 'Currency & Sisteme',
  systems: 'Systems & Mecanici',
  market: 'Market & VIP Store',
  team: 'Echipă & Colaboratori',
  changelog: 'Istoric Actualizări',
};

const ROLE_CONFIG: Record<string, { label: string; accentColor: string; clearance: string }> = {
  root_admin: {
    label: 'ROOT SUPER ADMIN',
    accentColor: '#f97316',
    clearance: 'ROOT CLEARANCE',
  },
  doc_lead: {
    label: 'CO-LEAD & SYSTEMS',
    accentColor: '#f59e0b',
    clearance: 'SYSTEMS CLEARANCE',
  },
  content_editor: {
    label: 'SENIOR CONTENT EDITOR',
    accentColor: '#10b981',
    clearance: 'CORE CONTRIBUTOR',
  },
  custom: {
    label: 'CONTENT EDITOR & REVIEWER',
    accentColor: '#10b981',
    clearance: 'CORE CONTRIBUTOR',
  },
  moderator: {
    label: 'MODERATOR & REVIEWER',
    accentColor: '#8b5cf6',
    clearance: 'STAFF REVIEWER',
  },
  viewer: {
    label: 'COMMUNITY CONTRIBUTOR',
    accentColor: '#94a3b8',
    clearance: 'COMMUNITY MEMBER',
  },
};

const avatarCache = new Map<string, string>(); // url/username -> base64

async function getAvatarBase64(url?: string | null, usernameFallback?: string | null): Promise<string | null> {
  const cacheKey = (url || usernameFallback || '').toLowerCase().trim();
  if (!cacheKey) return null;
  if (avatarCache.has(cacheKey)) return avatarCache.get(cacheKey)!;

  const targetUrl =
    url ||
    (usernameFallback && usernameFallback !== 'wildfire'
      ? `https://github.com/${encodeURIComponent(usernameFallback)}.png?size=256`
      : '');
  if (!targetUrl) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WildfireDocs/3.0' },
    });
    clearTimeout(timeout);
    if (res.ok) {
      const arr = await res.arrayBuffer();
      const pngBuf = await sharp(Buffer.from(arr)).resize(256, 256).png().toBuffer();
      const b64 = pngBuf.toString('base64');
      avatarCache.set(cacheKey, b64);
      return b64;
    }
  } catch {}
  return null;
}

function wrapLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxCharsPerLine) {
      if (current) lines.push(current.trim());
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current += (current ? ' ' : '') + word;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current.trim());
  }

  if (words.length > 0 && lines.length === maxLines && current && current !== lines[lines.length - 1]) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\.*$/, '') + '...';
  }

  return lines;
}

export async function GET(req: Request, res: Response) {
  const rawSlug = String(req.query.slug || 'index').slice(0, 240);
  const cleanSlug = rawSlug.replace(/^docs\//i, '').replace(/^\/+|\/+$/g, '');
  const isLight = req.query.theme === 'light' || req.query.mode === 'light';
  const fontStack = 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif';

  // ─────────────────────────────────────────────────────────────────────────────
  // CHECK FOR TEAM MEMBER DOSSIER
  // ─────────────────────────────────────────────────────────────────────────────
  let teamMember: any = null;
  if (cleanSlug.startsWith('team/')) {
    const targetUsername = cleanSlug.replace(/^team\//, '').trim().toLowerCase();
    try {
      const p = path.resolve(process.cwd(), 'content/team.json');
      if (fs.existsSync(p)) {
        const list = JSON.parse(fs.readFileSync(p, 'utf8'));
        teamMember = list.find(
          (m: any) =>
            m.username?.toLowerCase() === targetUsername ||
            m.displayName?.toLowerCase() === targetUsername ||
            m.id?.toLowerCase() === targetUsername,
        );
      }
    } catch {}
  }

  if (teamMember) {
    const roleMeta = ROLE_CONFIG[teamMember.role] || {
      label: teamMember.isRoot ? 'ROOT SUPER ADMIN' : 'STAFF MEMBER',
      accentColor: teamMember.isRoot ? '#f97316' : '#10b981',
      clearance: teamMember.isRoot ? 'ROOT CLEARANCE' : 'CORE CONTRIBUTOR',
    };

    const displayName = teamMember.displayName || teamMember.username;
    const handle = `@${teamMember.username || displayName}`;
    const customTitle = teamMember.customTitle || (teamMember.isRoot ? 'Root Super Admin & Architect' : 'Team Member');
    const bioText = teamMember.bio || 'Membru oficial în echipa tehnică și de conținut a platformei Wildfire Docs.';
    const bioLines = wrapLines(bioText, 68, 2);

    const responsibilities: string[] = Array.isArray(teamMember.responsibilities) && teamMember.responsibilities.length > 0
      ? teamMember.responsibilities.slice(0, 3)
      : (teamMember.badges && teamMember.badges.length > 0
          ? teamMember.badges.slice(0, 3)
          : ['Arhitectură Docs', 'Ghiduri Tehnice', 'Sisteme']);

    const avatarB64 = await getAvatarBase64(
      teamMember.avatarUrl || `https://github.com/${teamMember.githubUsername || teamMember.username}.png?size=256`,
      teamMember.username,
    );

    // Light / Dark Theme Tokens
    const bgBase = isLight ? '#f8fafc' : '#070a13';
    const cardFill = isLight ? '#ffffff' : 'url(#cardGrad)';
    const cardBorder = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.11)';
    const dotColor = isLight ? '#0f172a' : '#ffffff';
    const dotOpacity = isLight ? '0.06' : '0.08';
    const ambientOpacity = isLight ? '0.08' : '0.14';
    const ambientBase = isLight ? '#f8fafc' : '#080c14';
    const brandText = isLight ? '#0f172a' : '#ffffff';
    const breadcrumbText = isLight ? '#64748b' : '#94a3b8';
    const slashColor = isLight ? '#cbd5e1' : '#475569';
    const clearanceBg = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)';
    const clearanceBorder = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
    const clearanceText = isLight ? '#1e293b' : '#f1f5f9';
    const avatarInnerBg = isLight ? '#f1f5f9' : '#0d1424';
    const nameText = isLight ? '#0f172a' : '#ffffff';
    const handleText = isLight ? '#64748b' : '#64748b';
    const bioTextFill = isLight ? '#475569' : '#94a3b8';
    const metaChipBg = isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)';
    const metaChipBorder = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.09)';
    const metaChipText = isLight ? '#334155' : '#cbd5e1';
    const metaChipSub = isLight ? '#64748b' : '#94a3b8';
    const dividerColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.09)';
    const chipBg = isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)';
    const chipBorder = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.08)';
    const chipText = isLight ? '#334155' : '#cbd5e1';
    const urlText = isLight ? '#64748b' : '#94a3b8';
    const subText = isLight ? '#94a3b8' : '#475569';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <!-- Fine Dot Matrix Grid Pattern -->
        <pattern id="dotGrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="${dotColor}" fill-opacity="${dotOpacity}" />
        </pattern>

        <!-- Subtle Ambient Backlight -->
        <radialGradient id="cornerAmbient" cx="90%" cy="10%" r="65%">
          <stop offset="0%" stop-color="${roleMeta.accentColor}" stop-opacity="${ambientOpacity}" />
          <stop offset="100%" stop-color="${ambientBase}" stop-opacity="0" />
        </radialGradient>

        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#121826" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#0b101c" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="accentHairline" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${roleMeta.accentColor}" stop-opacity="0" />
          <stop offset="35%" stop-color="${roleMeta.accentColor}" stop-opacity="0.85" />
          <stop offset="70%" stop-color="${roleMeta.accentColor}" stop-opacity="0.85" />
          <stop offset="100%" stop-color="${roleMeta.accentColor}" stop-opacity="0" />
        </linearGradient>

        <clipPath id="avatarSquircle">
          <rect x="88" y="152" width="144" height="144" rx="28" ry="28" />
        </clipPath>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="${bgBase}" />
      <rect width="1200" height="630" fill="url(#dotGrid)" />
      <rect width="1200" height="630" fill="url(#cornerAmbient)" />

      <!-- Inner Glass Dossier Card -->
      <rect x="48" y="44" width="1104" height="542" rx="24" fill="${cardFill}" stroke="${cardBorder}" stroke-width="1.5" />
      
      <!-- Top Subtle Hairline Accent -->
      <rect x="48" y="44" width="1104" height="2" rx="1" fill="url(#accentHairline)" />

      <!-- ── CARD HEADER ROW ── -->
      <g transform="translate(88, 86)">
        <!-- Wildfire Flame Icon Emblem -->
        <g transform="translate(0, -6)">
          <path d="M14 2C14 2 17.5 7 17.5 10.5C17.5 12.8 15.8 14.5 13.5 14.5C11.2 14.5 10 12.8 10 11C10 7.8 13 5.5 13 2C8 4.5 5 9.5 5 14.5C5 20.3 9.7 25 15.5 25C21.3 25 26 20.3 26 14.5C26 8.5 20 4.5 14 2Z" fill="${roleMeta.accentColor}" transform="scale(0.85)" />
        </g>

        <!-- Brand Text & Breadcrumb -->
        <text x="32" y="14" fill="${brandText}" font-family="${fontStack}" font-size="16" font-weight="900" letter-spacing="2">WILDFIRE DOCS</text>
        <text x="195" y="14" fill="${slashColor}" font-family="${fontStack}" font-size="16" font-weight="400">/</text>
        <text x="214" y="14" fill="${breadcrumbText}" font-family="${fontStack}" font-size="13" font-weight="700" letter-spacing="1.5">ECHIPĂ &amp; COLABORATORI</text>

        <!-- Right Pills -->
        <!-- Clearance Pill -->
        <g transform="translate(${928 - 320}, -4)">
          <rect x="0" y="0" width="170" height="34" rx="8" fill="${clearanceBg}" stroke="${clearanceBorder}" stroke-width="1" />
          <text x="85" y="22" fill="${clearanceText}" font-family="${fontStack}" font-size="12" font-weight="800" letter-spacing="1" text-anchor="middle">★ ${xml(roleMeta.clearance)}</text>
        </g>

        <!-- Active Status Pill -->
        <g transform="translate(${928 - 134}, -4)">
          <rect x="0" y="0" width="134" height="34" rx="8" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1" />
          <circle cx="18" cy="17" r="4.5" fill="#10b981" />
          <text x="74" y="22" fill="#059669" font-family="${fontStack}" font-size="12" font-weight="800" letter-spacing="0.5" text-anchor="middle">ACTIV</text>
        </g>
      </g>

      <!-- ── CARD HERO SECTION ── -->
      <!-- Avatar Column -->
      <g>
        <!-- Outer Frame -->
        <rect x="88" y="152" width="144" height="144" rx="28" ry="28" fill="${avatarInnerBg}" stroke="${roleMeta.accentColor}" stroke-width="2.5" />
        
        ${
          avatarB64
            ? `<image href="data:image/png;base64,${avatarB64}" x="88" y="152" width="144" height="144" clip-path="url(#avatarSquircle)" preserveAspectRatio="xMidYMid slice" />`
            : `
          <rect x="88" y="152" width="144" height="144" rx="28" ry="28" fill="${isLight ? '#e2e8f0' : '#1e293b'}" clip-path="url(#avatarSquircle)" />
          <text x="160" y="242" fill="${isLight ? '#0f172a' : '#ffffff'}" font-family="${fontStack}" font-size="56" font-weight="900" text-anchor="middle">${xml(displayName.charAt(0).toUpperCase())}</text>
        `
        }

        <!-- Online beacon on avatar corner -->
        <circle cx="222" cy="286" r="9" fill="${isLight ? '#ffffff' : '#090e1a'}" />
        <circle cx="222" cy="286" r="6" fill="#10b981" />
      </g>

      <!-- Identity Column -->
      <g transform="translate(262, 154)">
        <!-- Role Pill -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="${Math.max(140, roleMeta.label.length * 9.5 + 32)}" height="28" rx="6" fill="${isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)'}" stroke="${roleMeta.accentColor}" stroke-width="1" />
          <circle cx="12" cy="14" r="3.5" fill="${roleMeta.accentColor}" />
          <text x="24" y="18" fill="${roleMeta.accentColor}" font-family="${fontStack}" font-size="11.5" font-weight="800" letter-spacing="1">${xml(roleMeta.label)}</text>
        </g>

        <!-- Member Name + Handle -->
        <g transform="translate(0, 64)">
          <text x="0" y="0" fill="${nameText}" font-family="${fontStack}" font-size="48" font-weight="900" letter-spacing="-1">${xml(displayName)}</text>
          <text x="${displayName.length * 28 + 20}" y="-6" fill="${handleText}" font-family="${fontStack}" font-size="24" font-weight="600">${xml(handle)}</text>
        </g>

        <!-- Custom Title -->
        <text x="0" y="102" fill="${roleMeta.accentColor}" font-family="${fontStack}" font-size="21" font-weight="700" letter-spacing="-0.2">${xml(customTitle)}</text>

        <!-- Bio Quote Snippet -->
        ${bioLines
          .map(
            (line, idx) => `
          <text x="0" y="${138 + idx * 26}" fill="${bioTextFill}" font-family="${fontStack}" font-size="16.5" font-weight="400">${xml(line)}</text>
        `,
          )
          .join('')}

        <!-- Verified & Security Meta Badges -->
        <g transform="translate(0, ${142 + bioLines.length * 26 + 12})">
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="136" height="28" rx="6" fill="${metaChipBg}" stroke="${metaChipBorder}" stroke-width="1" />
            <circle cx="14" cy="14" r="3.5" fill="#10b981" />
            <text x="25" y="18" fill="${metaChipText}" font-family="${fontStack}" font-size="11" font-weight="700">FORTRESS 2FA</text>
          </g>

          <g transform="translate(146, 0)">
            <rect x="0" y="0" width="144" height="28" rx="6" fill="${metaChipBg}" stroke="${metaChipBorder}" stroke-width="1" />
            <text x="14" y="18" fill="${metaChipSub}" font-family="${fontStack}" font-size="11" font-weight="700">ID: ${xml(teamMember.id ? teamMember.id.slice(0, 14) : 'VERIFIED')}</text>
          </g>
          
          ${
            teamMember.badges && teamMember.badges.length > 0
              ? `
            <g transform="translate(300, 0)">
              <rect x="0" y="0" width="${Math.max(126, teamMember.badges[0].length * 8 + 28)}" height="28" rx="6" fill="${isLight ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.1)'}" stroke="${isLight ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.3)'}" stroke-width="1" />
              <text x="14" y="18" fill="${isLight ? '#d97706' : '#fbbf24'}" font-family="${fontStack}" font-size="11" font-weight="800">★ ${xml(teamMember.badges[0])}</text>
            </g>
          `
              : ''
          }
        </g>
      </g>

      <!-- ── BOTTOM SHELF & FOOTER ── -->
      <!-- Divider Line -->
      <line x1="88" y1="448" x2="1112" y2="448" stroke="${dividerColor}" stroke-width="1" />

      <g transform="translate(88, 480)">
        <!-- Responsibilities Chips (Left) -->
        <g transform="translate(0, 6)">
          ${responsibilities
            .map((resp, i) => {
              const xOffset = i * 220;
              return `
              <g transform="translate(${xOffset}, 0)">
                <rect x="0" y="0" width="${Math.min(208, Math.max(140, resp.length * 9.5 + 36))}" height="36" rx="8" fill="${chipBg}" stroke="${chipBorder}" stroke-width="1" />
                <text x="14" y="23" fill="${chipText}" font-family="${fontStack}" font-size="12.5" font-weight="600">✦ ${xml(resp)}</text>
              </g>
            `;
            })
            .join('')}
        </g>

        <!-- Branding / Link Signature (Right) -->
        <g transform="translate(1024, 12)">
          <text x="0" y="10" fill="${urlText}" font-family="Consolas, Monaco, monospace" font-size="15" font-weight="600" text-anchor="end">docs.wildfire.ro/docs/team/${xml(teamMember.username)}</text>
          <text x="0" y="30" fill="${subText}" font-family="${fontStack}" font-size="11.5" font-weight="700" letter-spacing="1" text-anchor="end">ENGINEERING SPECIFICATION • WILDFIRE TEAM</text>
        </g>
      </g>
    </svg>`;

    res
      .set({
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      })
      .send(await sharp(Buffer.from(svg)).png().toBuffer());
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GENERAL DOCUMENTATION ARTICLE CARD
  // ─────────────────────────────────────────────────────────────────────────────
  let title = 'Wildfire Documentation',
    description = 'Documentația oficială a platformei Wildfire — resurse, sisteme și informații.',
    author = 'Wildfire Team';

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
    title = 'Wildfire.ro Docs — CS2 Wikipedia';
    description = 'Resurse tehnice, sisteme și specificații complete pentru Counter-Strike 2 pe Wildfire.ro.';
    author = 'Wildfire Team';
  } else if (cleanSlug === 'team') {
    title = 'Echipa Wildfire — Team & Contributors';
    description = 'Membrii oficiali, redactorii tehnici și echipa de dezvoltare a platformei Wildfire Docs.';
    author = 'Wildfire Team';
  }

  const rootSlug = cleanSlug.split('/')[0]?.toLowerCase() || '';
  const categoryLabel = CATEGORY_NAMES[rootSlug] || (rootSlug ? rootSlug.toUpperCase() : 'DOCS');

  // Title wrapping (large bold headline)
  const displayTitleLines = wrapLines(title, 26, 2);
  const descLines = wrapLines(description, 70, 2);

  const authorAvatarB64 = await getAvatarBase64(null, author);

  // General docs light/dark tokens
  const bgBase = isLight ? '#f8fafc' : '#070a13';
  const cardFill = isLight ? '#ffffff' : 'url(#docCardGrad)';
  const cardBorder = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.11)';
  const dotColor = isLight ? '#0f172a' : '#ffffff';
  const dotOpacity = isLight ? '0.06' : '0.08';
  const brandText = isLight ? '#0f172a' : '#ffffff';
  const slashColor = isLight ? '#cbd5e1' : '#475569';
  const categoryColor = isLight ? '#0284c7' : '#22d3ee';
  const titleGradStart = isLight ? '#0f172a' : '#ffffff';
  const titleGradEnd = isLight ? '#334155' : '#e2e8f0';
  const descColor = isLight ? '#475569' : '#94a3b8';
  const dividerColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.09)';
  const authorNameColor = isLight ? '#0f172a' : '#f1f5f9';
  const authorMetaColor = isLight ? '#64748b' : '#64748b';
  const urlText = isLight ? '#64748b' : '#94a3b8';
  const subText = isLight ? '#94a3b8' : '#475569';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <pattern id="dotGridDoc" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="${dotColor}" fill-opacity="${dotOpacity}" />
      </pattern>

      <radialGradient id="topGlow" cx="85%" cy="10%" r="55%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="${isLight ? '0.08' : '0.12'}" />
        <stop offset="100%" stop-color="${isLight ? '#f8fafc' : '#080c14'}" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="bottomGlow" cx="15%" cy="90%" r="55%">
        <stop offset="0%" stop-color="#f97316" stop-opacity="${isLight ? '0.06' : '0.10'}" />
        <stop offset="100%" stop-color="${isLight ? '#f8fafc' : '#080c14'}" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="docCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#121826" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#0b101c" stop-opacity="0.95" />
      </linearGradient>

      <linearGradient id="docTitleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${titleGradStart}" />
        <stop offset="100%" stop-color="${titleGradEnd}" />
      </linearGradient>

      <clipPath id="authorClip">
        <circle cx="24" cy="24" r="24" />
      </clipPath>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="${bgBase}" />
    <rect width="1200" height="630" fill="url(#dotGridDoc)" />
    <rect width="1200" height="630" fill="url(#topGlow)" />
    <rect width="1200" height="630" fill="url(#bottomGlow)" />

    <!-- Inner Glass Dossier Card -->
    <rect x="48" y="44" width="1104" height="542" rx="24" fill="${cardFill}" stroke="${cardBorder}" stroke-width="1.5" />

    <!-- Top Hairline Accent -->
    <rect x="48" y="44" width="1104" height="2" rx="1" fill="#f97316" opacity="${isLight ? '0.85' : '0.65'}" />

    <!-- ── CARD HEADER ROW ── -->
    <g transform="translate(88, 86)">
      <!-- Flame Icon -->
      <g transform="translate(0, -6)">
        <path d="M14 2C14 2 17.5 7 17.5 10.5C17.5 12.8 15.8 14.5 13.5 14.5C11.2 14.5 10 12.8 10 11C10 7.8 13 5.5 13 2C8 4.5 5 9.5 5 14.5C5 20.3 9.7 25 15.5 25C21.3 25 26 20.3 26 14.5C26 8.5 20 4.5 14 2Z" fill="#f97316" transform="scale(0.85)" />
      </g>

      <text x="32" y="14" fill="${brandText}" font-family="${fontStack}" font-size="16" font-weight="900" letter-spacing="2">WILDFIRE DOCS</text>
      <text x="195" y="14" fill="${slashColor}" font-family="${fontStack}" font-size="16" font-weight="400">/</text>
      <text x="214" y="14" fill="${categoryColor}" font-family="${fontStack}" font-size="13" font-weight="700" letter-spacing="1.5">${xml(categoryLabel.toUpperCase())}</text>

      <!-- Verified Badge (Right) -->
      <g transform="translate(${928 - 160}, -4)">
        <rect x="0" y="0" width="160" height="34" rx="8" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1" />
        <text x="80" y="22" fill="#059669" font-family="${fontStack}" font-size="12" font-weight="800" letter-spacing="1" text-anchor="middle">✓ FORTRESS VERIFIED</text>
      </g>
    </g>

    <!-- ── CARD BODY SECTION ── -->
    <g transform="translate(88, ${displayTitleLines.length > 1 ? 168 : 194})">
      <!-- Title Lines -->
      ${displayTitleLines
        .map(
          (line, idx) => `
        <text x="0" y="${64 + idx * 80}" fill="url(#docTitleGrad)" font-family="${fontStack}" font-size="${displayTitleLines.length > 1 ? 62 : 72}" font-weight="900" letter-spacing="-1.5">${xml(line)}</text>
      `,
        )
        .join('')}

      <!-- Description Lines -->
      ${descLines
        .map(
          (line, idx) => `
        <text x="0" y="${displayTitleLines.length * 80 + 44 + idx * 36}" fill="${descColor}" font-family="${fontStack}" font-size="22" font-weight="400">${xml(line)}</text>
      `,
        )
        .join('')}
    </g>

    <!-- ── FOOTER SHELF ── -->
    <line x1="88" y1="466" x2="1112" y2="466" stroke="${dividerColor}" stroke-width="1" />

    <g transform="translate(88, 496)">
      <!-- Author (Left) -->
      <g transform="translate(0, 0)">
        ${
          authorAvatarB64
            ? `
          <g transform="translate(0, -6)">
            <image href="data:image/png;base64,${authorAvatarB64}" x="0" y="0" width="48" height="48" clip-path="url(#authorClip)" />
            <circle cx="24" cy="24" r="24" fill="none" stroke="${isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)'}" stroke-width="2" />
          </g>
        `
            : `
          <g transform="translate(0, -6)">
            <circle cx="24" cy="24" r="24" fill="#f97316" stroke="${isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)'}" stroke-width="2" />
            <text x="24" y="32" fill="#ffffff" font-family="${fontStack}" font-size="20" font-weight="bold" text-anchor="middle">${xml(author.charAt(0).toUpperCase())}</text>
          </g>
        `
        }
        <text x="64" y="14" fill="${authorMetaColor}" font-family="${fontStack}" font-size="12" font-weight="600" letter-spacing="0.5">MAINTAINER / AUTOR</text>
        <text x="64" y="36" fill="${authorNameColor}" font-family="${fontStack}" font-size="20" font-weight="800">${xml(author)}</text>
      </g>

      <!-- Branding & URL (Right) -->
      <g transform="translate(1024, 6)">
        <text x="0" y="10" fill="${urlText}" font-family="Consolas, Monaco, monospace" font-size="15" font-weight="600" text-anchor="end">docs.wildfire.ro/${xml(cleanSlug === 'index' ? '' : cleanSlug)}</text>
        <text x="0" y="30" fill="${subText}" font-family="${fontStack}" font-size="11.5" font-weight="700" letter-spacing="1" text-anchor="end">WILDFIRE DOCS • ENGINEERING SPECIFICATION</text>
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
