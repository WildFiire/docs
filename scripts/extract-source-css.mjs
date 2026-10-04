import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
const source = process.argv[2];
const used = new Set(['dark', 'light', 'prose']);
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) walk(file);
    else if (/\.vue$/.test(e.name)) {
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(/class=["']([^"']+)["']/g))
        for (const name of m[1].split(/\s+/)) used.add(name);
    }
  }
}
walk('docs/.vitepress/theme/components');
const output = [];
for (const relative of [
  'styles/components.css',
  'styles/prose.css',
  'styles/light-theme-extras.css',
  'app/globals.css',
]) {
  const tree = postcss.parse(fs.readFileSync(path.join(source, relative), 'utf8'));
  tree.walkComments((node) => node.remove());
  tree.walkRules((rule) => {
    if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    const classes = [...rule.selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]);
    if (!classes.length || !classes.some((c) => used.has(c))) rule.remove();
    else
      rule.selector = rule.selector
        .replaceAll('[data-theme="light"]', 'html:not(.dark)')
        .replaceAll('[data-theme="dark"]', 'html.dark')
        .replace(/\.prose\b/g, '.vp-doc');
  });
  tree.walkAtRules((rule) => {
    if (rule.name === 'import' || rule.nodes?.length === 0) rule.remove();
  });
  output.push(`/* Selected rules from ${relative} */\n` + tree.toString());
}
fs.writeFileSync('docs/.vitepress/theme/styles/source-components.css', output.join('\n'));
console.log('Selected source CSS bytes:', output.join('\n').length);
