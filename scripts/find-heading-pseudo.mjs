import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  try {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      if (f.name === 'node_modules' || f.name === 'dist' || f.name === 'public' || f.name === '.git' || f.name === 'cache') continue;
      const full = path.join(dir, f.name);
      if (f.isDirectory()) {
        res.push(...walk(full));
      } else if (f.isFile() && (f.name.endsWith('.css') || f.name.endsWith('.vue'))) {
        res.push(full);
      }
    }
  } catch (e) {}
  return res;
}

const files = walk('.');
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('header-anchor') || line.includes('header_anchor') || line.includes('permalink') || (line.includes('content:') && (line.includes('#') || line.includes('attr(')))) {
      console.log(`${f}:${i + 1}: ${line.trim()}`);
    }
  });
}
