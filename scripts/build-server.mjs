import { build } from 'esbuild';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('server/route-manifest.json', 'utf8'));
if (!manifest.some((r) => r.route === '/api/og'))
  manifest.push({ route: '/api/og', file: 'server/routes/og.ts', methods: ['GET'] });
const imports = manifest
  .map((r, i) => `import * as route${i} from './${r.file.replace(/^server\//, '')}';`)
  .join('\n');
const table = manifest
  .map((r, i) => `{path:${JSON.stringify(r.route)},handlers:route${i}}`)
  .join(',\n');
fs.writeFileSync('server/routes.generated.ts', `${imports}\nexport const routes = [${table}];\n`);
await build({
  entryPoints: ['server/app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20.20',
  format: 'esm',
  packages: 'external',
  outfile: 'server/.build/app.mjs',
  alias: { '@server': './server' },
  sourcemap: process.env.NODE_ENV === 'development',
  sourcesContent: false,
});
