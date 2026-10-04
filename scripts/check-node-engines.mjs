import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let semver;
try {
  semver = require('semver');
} catch {
  semver = require(process.env.npm_execpath.replace(/bin[\\/]npm-cli\.js$/, 'node_modules/semver'));
}
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const entries = Object.entries(lock.packages)
  .filter(([, p]) => p.engines?.node)
  .map(([name, p]) => ({
    name: name || 'project',
    version: p.version,
    engine: p.engines.node,
    compatible: semver.satisfies('20.20.2', p.engines.node, { includePrerelease: true }),
  }));
fs.mkdirSync('migration/test-results', { recursive: true });
fs.writeFileSync(
  'migration/test-results/node-engines.json',
  JSON.stringify(
    { node: process.version, target: '20.20.2', checked: entries.length, entries },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({ checked: entries.length, incompatible: entries.filter((p) => !p.compatible) }),
);
if (entries.some((p) => !p.compatible)) process.exitCode = 1;
