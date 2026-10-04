import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DOCS_ROOT, RUNTIME_ROOT, inside } from '../storage/paths';
import { writeJson } from '../storage/json';
import matter from 'gray-matter';
export function docPath(slug: string) {
  if (
    typeof slug !== 'string' ||
    !slug ||
    slug.length > 240 ||
    !/^[/a-zA-Z0-9_-]+(?:\.md)?$/.test(slug) ||
    slug.split('/').some((p) => !p || p.startsWith('.')) ||
    /^(admin|public|panel)(\/|$)/.test(slug)
  )
    throw new Error('Invalid document path');
  return inside(DOCS_ROOT, slug.replace(/\.md$/, '') + '.md');
}
export function validateMarkdown(content: string) {
  if (typeof content !== 'string' || content.length > 1_000_000)
    throw new Error('Invalid document content');
  const metadata = matter(content).data;
  if (metadata.head || metadata.html) throw new Error('Executable page metadata is not allowed');
  const prose = content.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`]*`/g, '');
  if (
    /<\s*(script|iframe|object|embed|style|link|meta|svg|math)\b|\bon\w+\s*=|\bv-\w+|\s[@:]\w+[\w:.-]*\s*=|\{\{|javascript:|^\s*(import|export)\s/im.test(
      prose,
    )
  )
    throw new Error('Active HTML, Vue expressions and scripts are not allowed in documents');
  const tags = new Set('a abbr b blockquote br caption code col colgroup dd del details div dl dt em figcaption figure h1 h2 h3 h4 h5 h6 hr i img kbd li ol p picture pre s section small source span strong sub summary sup table tbody td th thead tr u ul video audio callout card cards codeblock copyablepre docimage docvideo steps step tabs tab'.split(' '));
  for (const match of prose.matchAll(/<\/?([a-z][\w.-]*)\b/gi))
    if (!tags.has(match[1].toLowerCase())) throw new Error(`Unsupported document element: ${match[1]}`);
  if (/\b(?:href|src|poster)\s*=\s*["']\s*(?:data|vbscript|file|javascript)\s*:/i.test(prose) ||
      /\b(?:style|srcdoc|is)\s*=/i.test(prose))
    throw new Error('Unsafe document attribute');
}
export function snapshotDocument(slug: string, actor: string) {
  const file = docPath(slug);
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const id = crypto.randomUUID();
  writeJson(
    inside(
      path.join(RUNTIME_ROOT, 'content', '.versions'),
      slug.replace(/\.md$/, '') + `/${id}.json`,
    ),
    {
      id,
      slug,
      timestamp: new Date().toISOString(),
      savedBy: actor,
      content,
      charCount: content.length,
    },
  );
}
