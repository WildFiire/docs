import type { Request, Response } from 'express';
import fs from 'node:fs';
import sharp from 'sharp';
import matter from 'gray-matter';
import { docPath } from '../services/documents';
function xml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!,
  );
}
export async function GET(req: Request, res: Response) {
  const slug = String(req.query.slug || 'index').slice(0, 240);
  let title = 'Document Not Found',
    description = '',
    category = 'DOCS';
  try {
    const doc = matter(fs.readFileSync(docPath(slug), 'utf8'));
    title = String(doc.data.title || slug);
    description = String(doc.data.description || 'Documentația oficială Wildfire.ro');
    category = slug.split('/')[0].toUpperCase();
  } catch {}
  const words = title.split(/\s+/),
    lines: string[] = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).length > 31) {
      lines.push(line);
      line = word;
    } else line += (line ? ' ' : '') + word;
  }
  if (line) lines.push(line);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="glow"><stop stop-color="#f97316" stop-opacity=".2"/><stop offset="1" stop-color="#09090b" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="#09090b"/><ellipse cx="150" cy="550" rx="750" ry="600" fill="url(#glow)"/><rect x="60" y="54" width="290" height="48" rx="24" fill="#ffffff10" stroke="#ffffff20"/><text x="84" y="86" fill="#f97316" font-family="sans-serif" font-size="22">${xml(category)}</text>${lines
    .slice(0, 3)
    .map(
      (text, i) =>
        `<text x="60" y="${210 + i * 78}" fill="white" font-family="sans-serif" font-size="64" font-weight="bold">${xml(text)}</text>`,
    )
    .join(
      '',
    )}<text x="60" y="455" fill="#a1a1aa" font-family="sans-serif" font-size="22">${xml(description.slice(0, 88))}</text><line x1="60" x2="1140" y1="520" y2="520" stroke="#ffffff20"/><text x="60" y="576" fill="#a1a1aa" font-family="sans-serif" font-size="24">docs.wildfire.ro</text><text x="860" y="576" fill="#f97316" font-family="sans-serif" font-size="28" font-weight="bold">WILDFIRE DOCS</text></svg>`;
  res
    .set({ 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300' })
    .send(await sharp(Buffer.from(svg)).png().toBuffer());
}
