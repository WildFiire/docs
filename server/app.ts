import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { requestContext } from './request-context';
import { guard } from './security/guard';
import { routes } from './routes.generated';
import { publicationState, requestPublication } from './services/publication';
import { getAuthenticatedAdminSession } from './lib/security/auth';
import { legacyRouter } from './legacy';
import MarkdownIt from 'markdown-it';
import { getPlatformSettings } from './lib/security/settingsStore';
import { getRealDocsCount, getRealGitCommits } from './lib/admin/realTelemetry';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');
  app.use(cookieParser(), requestContext);
  app.use('/api', (req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    next();
  });
  app.use(guard);
  app.use(
    express.json({
      limit: '2mb',
      verify(req: any, _res, buf) {
        req.rawBody = Buffer.from(buf);
      },
    }),
  );
  const uploads = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 64 * 1024 * 1024, files: 1, fields: 8 },
    fileFilter(_req, file, done) {
      const allowed =
        /^(image\/(png|jpeg|webp|gif|svg\+xml)|video\/(mp4|webm)|audio\/(mpeg|mp3|ogg|wav))$/;
      done(
        allowed.test(file.mimetype) ? null : new Error('Unsupported media type'),
        allowed.test(file.mimetype),
      );
    },
  });
  app.post('/api/admin/media', uploads.single('file'));
  app.use((req,res,next)=>{
    if(!['POST','PUT','PATCH','DELETE'].includes(req.method))return next();
    if(req.body===undefined)req.body={};
    if(!req.body || Array.isArray(req.body) || typeof req.body!=='object')return res.status(400).json({error:'INVALID_PAYLOAD'});
    for(const key of ['username','password','slug','content','code','tempToken','masterPassword']) {
      if(req.body[key]!==undefined && typeof req.body[key]!=='string')return res.status(400).json({error:'INVALID_FIELD',field:key});
    }
    next();
  });
  // Publication is queued only after the mutation's successful response.
  app.use((req, res, next) => {
    if (
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
      /^\/api\/admin\/(doc|media|team|settings|maintenance)(\/|$)/.test(req.path)
    ) {
      res.once('finish', () => {
        if (res.statusCode < 300) requestPublication(req.path);
      });
    }
    next();
  });
  app.get('/api/system/status', (_req, res) => {
    const { maintenance, announcement } = getPlatformSettings();
    res.json({ maintenance, announcement });
  });
  app.post('/api/admin/preview', (req, res) =>
    res.json({
      html: new MarkdownIt({ html: false, linkify: true }).render(String(req.body.content || '')),
    }),
  );
  for (const route of routes)
    for (const [method, handler] of Object.entries(route.handlers)) {
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) continue;
      (app as any)[method.toLowerCase()](route.path, handler);
    }
  app.use(legacyRouter);
  app.use('/api', (req, res) => res.status(404).json({ error: 'NOT_FOUND' }));
  const distDir = path.resolve('docs/.vitepress/dist');
  if (fs.existsSync(distDir)) {
    // Redirect root to /docs (or /maintenance if enabled), 1:1 with wf-docscore
    app.get('/', (req, res) => {
      const { maintenance } = getPlatformSettings();
      if (maintenance?.enabled) {
        return res.redirect('/maintenance');
      }
      return res.redirect('/docs');
    });

    // If a request comes without /docs/ (e.g. /currency/credits) and docs counterpart exists, redirect to canonical /docs/...
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api')) return next();
      if (req.path === '/docs' || req.path === '/docs/' || req.path.startsWith('/docs/')) return next();
      if (req.path === '/team' || req.path === '/changelog' || req.path === '/maintenance' || req.path.startsWith('/admin')) return next();

      let norm = req.path;
      if (norm.includes('regulamento')) norm = norm.replace(/regulamento/g, 'regulamente');
      if (norm.includes('/regulamente/go/')) norm = norm.replace('/regulamente/go/', '/regulamente/');

      const docClean = path.join(distDir, 'docs', norm.replace(/\/$/, '') + '.html');
      const docIndex = path.join(distDir, 'docs', norm, 'index.html');
      if (fs.existsSync(docClean) || fs.existsSync(docIndex)) {
        return res.redirect(301, '/docs' + norm);
      }
      next();
    });

    app.use(express.static(distDir, { extensions: ['html'], dotfiles: 'ignore' }));
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api')) return next();

      const cleanPath = path.join(distDir, req.path.replace(/\/$/, '') + '.html');
      if (fs.existsSync(cleanPath)) return res.sendFile(cleanPath, { dotfiles: 'ignore' });
      const indexPath = path.join(distDir, req.path, 'index.html');
      if (fs.existsSync(indexPath)) return res.sendFile(indexPath, { dotfiles: 'ignore' });

      if (req.path === '/docs') {
        const docsHome = path.join(distDir, 'docs/index.html');
        if (fs.existsSync(docsHome)) return res.sendFile(docsHome, { dotfiles: 'ignore' });
      }

      const notFoundPath = path.join(distDir, '404.html');
      if (fs.existsSync(notFoundPath)) return res.status(404).sendFile(notFoundPath, { dotfiles: 'ignore' });
      next();
    });
  }
  app.use((error: any, _req: any, res: any, _next: any) => {
    const status =
      error.type === 'entity.too.large' || error.code === 'LIMIT_FILE_SIZE'
        ? 413
        : error.type === 'entity.parse.failed'
          ? 400
          : 500;
    console.error('[API]', error.name, error.message);
    res
      .status(status)
      .json({
        error:
          status === 413 ? 'PAYLOAD_TOO_LARGE' : status === 400 ? 'INVALID_JSON' : 'SERVER_ERROR',
      });
  });
  return app;
}
