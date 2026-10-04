// One-time source translation. Not part of build or runtime.
// Generated Express modules are reviewed and maintained directly afterwards.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const source = process.argv[2];
if (!source) throw new Error('External source path required');
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const write = (name, code) => {
  fs.mkdirSync(path.dirname(name), { recursive: true });
  fs.writeFileSync(name, code);
};
function shared(code) {
  return code
    .replace(/@\/(lib|types)\//g, '@server/$1/')
    .replace(/path.join\(process.cwd\(\), ["']content["'], ["']docs["']\)/g, 'DOCS_ROOT')
    .replace(/path.join\(process.cwd\(\), ["']public["']\)/g, 'PUBLIC_ROOT')
    .replace(
      /path.join\(process.cwd\(\), (["'](?:content|data)["'])/g,
      'path.join(RUNTIME_ROOT, $1',
    )
    .replace(/next:\s*\{\s*revalidate:\s*\d+\s*\},?/g, '')
    .replace(/\/\*turbopackIgnore: true\*\//g, '');
}
for (const folder of ['lib', 'types'])
  for (const file of walk(path.join(source, folder))) {
    const rel = path.relative(source, file).replaceAll('\\', '/');
    if (['lib/mdx.ts', 'lib/content.ts', 'lib/icons.tsx'].includes(rel)) continue;
    let code = shared(fs.readFileSync(file, 'utf8'));
    if (/DOCS_ROOT|PUBLIC_ROOT|RUNTIME_ROOT/.test(code))
      code =
        'import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from "@server/storage/paths";\n' + code;
    if (rel.endsWith('.ts'))
      code = code.replace(
        /import \{ revalidatePath \} from "next\/cache";/,
        'import { requestPublication as revalidatePath } from "@server/services/publication";',
      );
    write('server/' + rel, code);
  }
const manifests = [];
for (const file of walk(path.join(source, 'app/api')).filter((f) => f.endsWith('route.ts'))) {
  const route = path.relative(path.join(source, 'app'), path.dirname(file)).replaceAll('\\', '/');
  let code = fs
    .readFileSync(file, 'utf8')
    .replace(/import[^;]+from ["']next\/server["'];?\s*/g, '');
  code = code.replace(/export const (?:dynamic|revalidate|runtime|maxDuration)\s*=[^;]+;\s*/g, '');
  code = code.replace(
    /export async function (GET|POST|PUT|PATCH|DELETE)\(([^)]*)\)/g,
    (_, method, param) =>
      `export async function ${method}(${param.trim() ? param.replace(/NextRequest|Request/g, 'ExpressRequest') : 'req: ExpressRequest'}, expressResponse: ExpressResponse)`,
  );
  code = code
    .replace(/\b(req|request|_req)\.headers\.get\(/g, '$1.get(')
    .replace(/\b(req|request|_req)\.cookies\.get\(([^)]+)\)\?\.value/g, '$1.cookies[$2]')
    .replace(/await (req|request)\.json\(\)/g, '$1.body')
    .replace(/await (req|request)\.text\(\)/g, '$1.rawBody.toString("utf8")')
    .replace(/new URL\((req|request)\.url\)/g, 'new URL($1.originalUrl, "http://localhost")')
    .replace(/req.nextUrl/g, 'new URL(req.originalUrl, "http://localhost")');
  // A local response body is deliberately sent AFTER response cookies are set.
  const ast = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);
  const edits = [];
  function visit(node) {
    if (ts.isVariableStatement(node)) {
      const d = node.declarationList.declarations[0];
      if (
        d?.initializer &&
        ts.isCallExpression(d.initializer) &&
        d.initializer.expression.getText(ast) === 'NextResponse.json'
      ) {
        const args = d.initializer.arguments;
        edits.push([
          node.getStart(ast),
          node.end,
          `const ${d.name.getText(ast)}Body = ${args[0].getText(ast)};\nconst ${d.name.getText(ast)} = prepareResponse(expressResponse, ${args[1]?.getText(ast) || '{}'});`,
        ]);
        return;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0]))
    code = code.slice(0, start) + replacement + code.slice(end);
  code = code
    .replace(/return (response|res);/g, 'return $1.json($1Body);')
    .replace(/NextResponse.json\(/g, 'jsonReply(expressResponse, ')
    .replace(/new (?:NextResponse|Response)\(/g, 'sendReply(expressResponse, ')
    .replace(/(response|res)\.cookies\.set\(/g, 'setCookie($1, ')
    .replace(/(response|res)\.cookies\.delete\(/g, '$1.clearCookie(');
  code = shared(code);
  code =
    'import type { Request as ExpressRequest, Response as ExpressResponse } from "express";\nimport { jsonReply, sendReply, prepareResponse, setCookie } from "@server/http";\n' +
    code;
  if (/DOCS_ROOT|PUBLIC_ROOT|RUNTIME_ROOT/.test(code))
    code = 'import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from "@server/storage/paths";\n' + code;
  const target = 'server/routes/' + route.replace(/^api\//, '') + '.ts';
  write(target, code);
  manifests.push({
    route: '/' + route,
    file: target,
    methods: [...code.matchAll(/export async function (\w+)\(/g)].map((x) => x[1]),
  });
}
write('server/route-manifest.json', JSON.stringify(manifests, null, 2) + '\n');
console.log(
  `Translated ${manifests.length} JSON/binary endpoints; OG requires the separate image implementation.`,
);
