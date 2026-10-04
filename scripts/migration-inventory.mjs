import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = process.cwd();
const source = process.argv[2];
if (!source || !fs.existsSync(path.join(source, 'app')))
  throw new Error('Provide the external source directory');
function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isSymbolicLink() || ['node_modules', '.git', '.next', '.vitepress'].includes(e.name))
      return [];
    const file = path.join(dir, e.name);
    return e.isDirectory() ? walk(file, base) : [path.relative(base, file).replaceAll('\\', '/')];
  });
}
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const reuse = {
  TableOfContents: 'Layout/WfTOC',
  MobileTableOfContents: 'Layout/MobileScrollSpy',
  SearchModal: 'Search/WfSearchModal',
  MediaLightbox: 'Widgets/FluidLightbox',
  ScrollToTop: 'Layout/BackToTop',
  RecentlyUpdatedSection: 'Home/LastUpdates',
};
const rows = [];
for (const folder of ['app', 'components', 'lib', 'context', 'types'])
  for (const rel of walk(path.join(source, folder))) {
    const file = folder + '/' + rel;
    if (!/\.(tsx?|json)$/.test(file)) continue;
    const code = fs.readFileSync(path.join(source, file), 'utf8');
    const imports = [...code.matchAll(/(?:from\s+|import\s*)['"]([^'"]+)['"]/g)].map((x) => x[1]);
    const name = path.basename(rel).replace(/\.[^.]+$/, '');
    let type = folder,
      target,
      status = 'PORT',
      api = '',
      note = '';
    if (/\/route\.tsx?$/.test(file)) {
      type = 'API';
      api = '/' + file.replace(/^app\//, '').replace(/\/route.tsx?$/, '');
      target = 'server/routes/' + rel.replace(/^api\//, '').replace(/\/route.tsx?$/, '.ts');
      status = 'BACKEND API';
      note = [...code.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)/g)]
        .map((x) => x[1])
        .join(', ');
    } else if (folder === 'components') {
      type = 'component';
      target =
        'docs/.vitepress/theme/components/' + (reuse[name] || rel.replace(/\.tsx$/, '')) + '.vue';
      if (reuse[name]) status = 'MERGE';
    } else if (folder === 'app' && name === 'page') {
      type = 'page';
      target = 'docs/' + rel.replace(/\/page.tsx$/, '/index.md').replace(/^page.tsx$/, 'index.md');
    } else if (folder === 'app' && name === 'layout') {
      type = 'layout';
      target = 'docs/.vitepress/theme/PortLayout.vue';
      status = 'MERGE';
    } else if (folder === 'lib') {
      target = 'server/lib/' + rel;
      status = /next\/|react/.test(code) ? 'PORT' : 'BACKEND API';
    } else if (folder === 'context') target = 'docs/.vitepress/theme/composables/useLayout.ts';
    else if (folder === 'types') target = 'server/types/' + rel;
    else {
      target = 'docs/.vitepress/config.mts';
      status = 'BUILD-TIME';
    }
    const exports = [
      ...code.matchAll(/export (?:async )?(?:function|const|class|interface|type) (\w+)/g),
    ].map((x) => x[1]);
    rows.push({
      source: file,
      type,
      function: exports.join(', ') || name,
      dependencies: [...new Set(imports)].join(', '),
      target,
      api,
      status,
      test: 'Pending implementation and verification',
      notes: note,
      sourceHash: hash(path.join(source, file)),
    });
  }
const sourceDocs = walk(path.join(source, 'content/docs')).filter((x) => /\.mdx?$/.test(x));
const targetDocs = walk(path.join(root, 'docs')).filter((x) => /\.md$/.test(x));
const docs = sourceDocs.map((file) => {
  const dest = file.replace(/\.mdx$/, '.md');
  const exists = targetDocs.includes(dest);
  const equal =
    exists && hash(path.join(source, 'content/docs', file)) === hash(path.join(root, 'docs', dest));
  return {
    source: 'content/docs/' + file,
    target: 'docs/' + dest,
    status: equal ? 'IDENTICAL' : exists ? 'CONFLICT' : 'SOURCE NEW',
    resolution: equal ? 'Keep' : 'Pending semantic review',
  };
});
for (const file of targetDocs)
  if (!sourceDocs.some((x) => x.replace(/\.mdx$/, '.md') === file))
    docs.push({
      source: '',
      target: 'docs/' + file,
      status: 'TARGET ONLY',
      resolution: 'Preserve',
    });
const features = [
  'Authentication and session revocation',
  'TOTP and backup codes',
  'Root immunity',
  'Panic lockdown',
  'Maintenance static limitation',
  'Content Studio canonical Markdown',
  'Atomic publication and queue',
  'GitOps conflict handling',
  'Persistent media',
  'Backups and restore',
  'Cryptographic audit',
  'Cookie consent and analytics',
  'Search single index',
  'AI secret isolation',
  'Static team profiles',
  'Node 20.20.2',
  'Exact Nginx try_files simulation',
  'Desktop and mobile visual parity',
];
for (const feature of features)
  rows.push({
    source: feature,
    type: 'feature',
    function: feature,
    dependencies: 'See source rows',
    target: 'Cross-cutting',
    api: '',
    status: 'PORT',
    test: 'Pending',
    notes: '',
  });
const escape = (x) =>
  String(x ?? '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ');
let md = '# VitePress product port — migration matrix\n\n';
md +=
  'Baseline: `7a15201810b6307bf141040e778dccb2db778c5a`. Local working tree was clean. No commit, push, workflow execution or VPS access is authorized. External source remains unchanged.\n\n';
md +=
  'Backup: `C:/Users/iannc/Desktop/wf-docsold-migration-snapshots/20261003-190907`; 346 tracked files verified by SHA-256, full Git bundle verified. Existing preflight has already been removed; current workflows are preserved.\n\n';
md +=
  'Statuses describe outstanding work; PORT/BACKEND API/MERGE are not completion claims. DONE requires recorded tests.\n\n';
md +=
  '## Static hosting differences\n\nMaintenance is a client display gate and API policy, not access control for static HTML. Admin HTML contains only a shell; every private read/write requires backend authorization. Content/team/media changes become public only after successful queued build publication. Failed builds must preserve the prior dist.\n\n';
md +=
  '## Source inventory\n\n| SOURCE | TYPE | FUNCTION | DEPENDENCIES | TARGET VUE/VITEPRESS FILE | BACKEND API IF NEEDED | STATUS | TEST | NOTES |\n|---|---|---|---|---|---|---|---|---|\n';
for (const r of rows)
  md +=
    '| ' +
    ['source', 'type', 'function', 'dependencies', 'target', 'api', 'status', 'test', 'notes']
      .map((k) => escape(r[k]))
      .join(' | ') +
    ' |\n';
md +=
  '\n## Document reconciliation\n\n| SOURCE | TARGET | CLASSIFICATION | RESOLUTION |\n|---|---|---|---|\n';
for (const r of docs)
  md +=
    '| ' +
    ['source', 'target', 'status', 'resolution'].map((k) => escape(r[k])).join(' | ') +
    ' |\n';
fs.writeFileSync('MIGRATION-VITEPRESS-MATRIX.md', md);
fs.mkdirSync('migration', { recursive: true });
fs.writeFileSync('migration/inventory.json', JSON.stringify({ rows, docs }, null, 2) + '\n');
console.log(
  JSON.stringify({
    sourceComponents: rows.filter((r) => r.type === 'component').length,
    pages: rows.filter((r) => r.type === 'page').length,
    apiRoutes: rows.filter((r) => r.type === 'API').length,
    sourceDocs: sourceDocs.length,
    targetDocs: targetDocs.length,
    conflicts: docs.filter((x) => x.status === 'CONFLICT').length,
  }),
);
