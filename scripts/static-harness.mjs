import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Local test server only. No SPA fallback: mirror the existing Nginx try_files.
export function createStaticHarness({
  root = path.resolve('docs/.vitepress/dist'),
  apiPort = 3000,
} = {}) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.woff2': 'font/woff2',
  };
  return http.createServer((req, res) => {
    if (req.url.startsWith('/api/')) {
      const upstream = http.request(
        {
          hostname: '127.0.0.1',
          port: apiPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (reply) => {
          res.writeHead(reply.statusCode, reply.headers);
          reply.pipe(res);
        },
      );
      upstream.on('error', () => {
        res.writeHead(502);
        res.end('API unavailable');
      });
      req.pipe(upstream);
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    const target = path.resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    for (const candidate of [target, target + '.html']) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        serve(candidate);
        return;
      }
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' });
        res.end();
        return;
      }
      const index = path.join(target, 'index.html');
      if (fs.existsSync(index)) {
        serve(index);
        return;
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    const fallback = path.join(root, '404.html');
    res.end(fs.existsSync(fallback) ? fs.readFileSync(fallback) : 'Not found');
    function serve(file) {
      const stat = fs.statSync(file),
        mime = types[path.extname(file)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Content-Length': stat.size });
      if (req.method === 'HEAD') res.end();
      else fs.createReadStream(file).pipe(res);
    }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  createStaticHarness().listen(4173, '127.0.0.1', () =>
    console.log('Static + API local test: http://127.0.0.1:4173'),
  );
