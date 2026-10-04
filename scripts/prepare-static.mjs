import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { execFileSync } from 'node:child_process';
const root = process.cwd(),
  docsRoot = path.join(root, 'docs');
const generated = new Set(),
  generatedManifest = path.join(docsRoot, '.vitepress/generated-pages.json');
let previous = [];
try {
  previous = JSON.parse(fs.readFileSync(generatedManifest, 'utf8'));
} catch {}
function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  if (file.startsWith(docsRoot + path.sep) && file.endsWith('.md'))
    generated.add(path.relative(docsRoot, file));
}
const admin = [
  '',
  'login',
  'ai-analytics',
  'api-keys',
  'audit',
  'backups',
  'content',
  'database',
  'discord-bot',
  'discord-bot/modules',
  'discord-bot/role-trackers',
  'discord-bot/staff',
  'discord-bot/tickets',
  'discord-bot/watchlist',
  'gitops',
  'health',
  'inbox',
  'media',
  'profile',
  'search-analytics',
  'security',
  'settings',
  'tasks',
  'team',
  'webhooks',
];
for (const route of admin)
  write(
    path.join(docsRoot, 'admin', route, 'index.md'),
    `---\nlayout: false\ntitle: Wildfire Admin\nsearch: false\nhead:\n  - - meta\n    - name: robots\n      content: noindex, nofollow\n---\n`,
  );
for (const [route, component, title] of [
  ['team', 'TeamView', 'Echipa Wildfire'],
  ['changelog', 'ProductChangelog', 'Noutăți'],
  ['maintenance', 'MaintenanceScreen', 'Mentenanță'],
])
  write(
    path.join(docsRoot, route, 'index.md'),
    `---\nlayout: page\ntitle: ${title}\n---\n\n<${component} />\n`,
  );
write(path.join(docsRoot, 'docs/index.md'), '---\nlayout: home\nsearch: false\n---\n');
// Paths are public; account payloads never enter static data or the client bundle.
const runtime = process.env.WF_RUNTIME_DIR || root;
let users = [];
try {
  users = JSON.parse(fs.readFileSync(path.join(runtime, 'content/team.json'), 'utf8'))
    .filter((u) => u.status === 'active')
    .map((u) => u.username)
} catch {}
const defaultUsernames = ['iannC69', 'Yakuza', 'V1ccX', 'umpy'];
for (const u of defaultUsernames) {
  if (!users.includes(u)) users.push(u);
}
for (const username of users)
  for (const prefix of ['team', 'docs/team'])
    write(
      path.join(docsRoot, prefix, username + '.md'),
      `---\nlayout: page\ntitle: ${username}\n---\n\n<TeamView />\n`,
    );
write(
  path.join(docsRoot, 'docs/team/index.md'),
  '---\nlayout: page\ntitle: Echipă\nsearch: false\n---\n\n<TeamView />\n',
);
const documents = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      e.name.startsWith('.') ||
      e.isSymbolicLink() ||
      ['public', 'admin', 'panel', 'about', 'docs', 'team', 'changelog', 'maintenance'].includes(e.name)
    )
      continue;
    const file = path.join(dir, e.name);
    if (e.isDirectory()) walk(file);
    else if (e.name.endsWith('.md')) {
      const raw = fs.readFileSync(file, 'utf8'),
        parsed = matter(raw),
        slug = path.relative(docsRoot, file).replaceAll('\\', '/').replace(/\.md$/, '');
      documents.push({
        slug,
        path: slug + '.md',
        plainText: parsed.content.toLowerCase(),
        title: parsed.data.title || slug,
        description: parsed.data.description || '',
        content: parsed.content,
        sha256: crypto.createHash('sha256').update(raw).digest('hex'),
      });
      if (slug !== 'index')
        write(
          path.join(docsRoot, 'docs', slug + '.md'),
          raw,
        );
    }
  }
}
walk(docsRoot);
// Reuse the target's one-pass Git metadata strategy; only public metadata is emitted.
const git = new Map();
try {
  let current;
  for (const line of execFileSync('git',['log','--format=COMMIT|%H|%ct|%an','--name-only','--','docs'],{encoding:'utf8',maxBuffer:10*1024*1024}).split('\n')) {
    if(line.startsWith('COMMIT|')){const [,commitHash,timestamp,authorName]=line.split('|');current={commitHash,timestamp:Number(timestamp),authorName}}
    else if(line.trim()&&current&&!git.has(line.trim()))git.set(line.trim(),current);
  }
} catch {}
const recent=documents.filter(d=>d.slug!=='index'&&!d.slug.endsWith('/index')).map(d=>({slug:d.slug,href:'/docs/'+d.slug,title:d.title,description:d.description,category:d.slug.split('/')[0],readingTime:Math.max(1,Math.ceil(d.content.split(/\s+/).length/220)),...(git.get('docs/'+d.path)||{commitHash:'',timestamp:0,authorName:''})})).sort((a,b)=>b.timestamp-a.timestamp);
write(path.join(docsRoot,'.vitepress/theme/data/recent-docs.json'),JSON.stringify(recent,null,2));
for (const relative of previous) {
  const file = path.resolve(docsRoot, relative);
  if (!generated.has(relative) && file.startsWith(docsRoot + path.sep) && fs.existsSync(file))
    fs.unlinkSync(file);
}
fs.writeFileSync(generatedManifest, JSON.stringify([...generated], null, 2));
// The runtime AI context is separate from dist and contains public documentation only.
write(
  path.join(runtime, 'content/ai-context.json'),
  JSON.stringify(
    { generatedAt: new Date().toISOString(), docs: documents, totalDocs: documents.length },
    null,
    2,
  ),
);
function vitepressSlugify(str) {
  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ \t\r\n\v\f~`!@#$%^&*()_+={\[\}\]|\\:;"'<,>.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase();
}

function extractDocHeadings(content) {
  const headings = [];
  const lines = content.split(/\r?\n/);
  let inCode = false;
  const slugCounts = new Map();

  for (const line of lines) {
    if (line.startsWith('```') || line.startsWith('~~~')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const match = line.match(/^(#{1,4})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      let rawTitle = match[2].trim();
      rawTitle = rawTitle.replace(/<[^>]+>/g, '').trim();

      const cleanForSlug = rawTitle
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`]/g, '')
        .trim();

      let baseSlug = vitepressSlugify(cleanForSlug || rawTitle);
      if (!baseSlug) baseSlug = `heading-${headings.length}`;

      const count = slugCounts.get(baseSlug) || 0;
      slugCounts.set(baseSlug, count + 1);
      const id = count === 0 ? baseSlug : `${baseSlug}-${count}`;

      const displayTitle = rawTitle
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim();

      headings.push({ id, title: displayTitle, depth });
    }
  }
  return headings;
}
const headingsMap = {};
const integrityMap = {};
for (const d of documents) {
  const h = extractDocHeadings(d.content);
  headingsMap[d.slug] = h;
  headingsMap['docs/' + d.slug] = h;
  integrityMap[d.slug] = d.sha256;
  integrityMap['docs/' + d.slug] = d.sha256;
}
write(
  path.join(docsRoot, '.vitepress/theme/data/doc-headings.json'),
  JSON.stringify(headingsMap, null, 2),
);
write(
  path.join(docsRoot, '.vitepress/theme/data/doc-integrity.json'),
  JSON.stringify(integrityMap, null, 2),
);
console.log(
  `Prepared ${admin.length} admin routes, ${users.length} public profiles, ${documents.length} documentation entries.`,
);
