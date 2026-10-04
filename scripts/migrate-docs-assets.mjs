import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const source = process.argv[2];
const inventory = JSON.parse(fs.readFileSync('migration/inventory.json', 'utf8'));
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const doc of inventory.docs.filter((d) => d.source)) {
  if (doc.target === 'docs/index.md') {
    doc.resolution = 'Home rebuilt as Vue; preserve target SEO metadata';
    continue;
  }
  let body = fs.readFileSync(path.join(source, doc.source), 'utf8').replaceAll('/docs/', '/');
  body = body.replace(/className=/g, 'class=').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  if (doc.target === 'docs/informatii/staff/comenzi.md')
    body +=
      '\n\n### Owner — acces complet și dezvoltare\n\nOwner are acces complet (`*`), inclusiv funcțiile de dezvoltare și configurarea modulelor serverului.\n';
  // Preserve existing explicit anchors used by older bookmarks.
  if (fs.existsSync(doc.target)) {
    const old = fs.readFileSync(doc.target, 'utf8');
    const anchors = [...old.matchAll(/\bid=["']([a-zA-Z][\w-]*)["']/g)].map((m) => m[1]);
    body +=
      '\n' +
      [...new Set(anchors)]
        .filter((id) => !body.includes(`id="${id}"`))
        .map((id) => `<span id="${id}" class="legacy-anchor" aria-hidden="true"></span>`)
        .join('\n') +
      '\n';
  }
  fs.mkdirSync(path.dirname(doc.target), { recursive: true });
  fs.writeFileSync(doc.target, body);
  doc.resolution =
    doc.status === 'CONFLICT'
      ? 'Source content and new command tables selected; old explicit anchors retained; Owner full-access clarification merged where applicable'
      : 'Imported canonical Markdown';
}
const assets = [];
function media(dir, rel = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isSymbolicLink()) continue;
    const next = path.join(rel, e.name),
      file = path.join(dir, e.name);
    if (e.isDirectory()) {
      media(file, next);
      continue;
    }
    const target = path.join('docs/public', next),
      hash = sha(file);
    const same = fs.existsSync(target) && sha(target) === hash;
    if (!same) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(file, target);
    }
    if (sha(target) !== hash) throw new Error('Asset copy mismatch: ' + next);
    assets.push({
      path: next.replaceAll('\\', '/'),
      sha256: hash,
      action: same ? 'REUSE' : 'COPY',
      bytes: fs.statSync(file).size,
    });
  }
}
media(path.join(source, 'public'));
fs.writeFileSync('migration/inventory.json', JSON.stringify(inventory, null, 2) + '\n');
fs.writeFileSync('migration/assets.json', JSON.stringify(assets, null, 2) + '\n');
console.log(
  JSON.stringify({
    documents: inventory.docs.filter((d) => d.source).length,
    assets: assets.length,
    copied: assets.filter((a) => a.action === 'COPY').length,
    reused: assets.filter((a) => a.action === 'REUSE').length,
  }),
);
