import fs from 'node:fs';
import path from 'node:path';

const SRC_DOCS = 'C:/Users/iannc/Desktop/wf-docscore/content/docs';
const TGT_ROOT = 'C:/Users/iannc/Desktop/wf-docsold/docs/docs';
const TGT_DOCS = 'C:/Users/iannc/Desktop/wf-docsold/docs/docs/docs';

// Canonical list of all 57 files in wf-docscore
function getSourceFiles(dir, base = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = path.join(base, entry.name).replace(/\\/g, '/');
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getSourceFiles(full, rel));
    } else if (entry.name.endsWith('.md')) {
      results.push(rel);
    }
  }
  return results;
}

const canonicalFiles = getSourceFiles(SRC_DOCS);
console.log(`Found ${canonicalFiles.length} canonical files in wf-docscore.`);

// 1. Copy to both TGT_ROOT and TGT_DOCS
for (const rel of canonicalFiles) {
  const srcPath = path.join(SRC_DOCS, rel);
  const content = fs.readFileSync(srcPath, 'utf8');

  // Destination 1: docs/<rel>
  const dest1 = path.join(TGT_ROOT, rel);
  fs.mkdirSync(path.dirname(dest1), { recursive: true });
  fs.writeFileSync(dest1, content, 'utf8');

  // Destination 2: docs/docs/<rel>
  const dest2 = path.join(TGT_DOCS, rel);
  fs.mkdirSync(path.dirname(dest2), { recursive: true });
  fs.writeFileSync(dest2, content, 'utf8');
}
console.log(`Copied ${canonicalFiles.length} files to ${TGT_ROOT} and ${TGT_DOCS}.`);

// 2. Remove obsolete directories / files that are NOT in canonical wf-docscore
const obsoletePaths = [
  'hub',
  'panel',
  'about',
  'updates_wiki',
  'informatii/patch-notes.md',
  'informatii/regulamente/go',
  'systems/skins/informatiiws.md',
  'systems/other/rank-phases.md',
  'market/vip/vip-night.md',
];

for (const p of obsoletePaths) {
  for (const root of [TGT_ROOT, TGT_DOCS]) {
    const full = path.join(root, p);
    if (fs.existsSync(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      console.log(`Removed obsolete: ${full}`);
    }
  }
}

console.log('Sync and cleanup completed successfully.');
