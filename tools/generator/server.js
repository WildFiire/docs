import express from 'express';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '../..');
const STYLE_CSS = path.join(ROOT, 'docs/.vitepress/theme/style.css');
const DOCS_DIR  = path.join(ROOT, 'docs');
const PORT      = 3001;

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));
app.use('/public', express.static(path.join(ROOT, 'docs/public')));

app.get('/api/style', (_req, res) => {
  try   { res.type('css').send(readFileSync(STYLE_CSS, 'utf-8')); }
  catch { res.status(500).send('/* style.css not found */'); }
});

app.post('/api/save', (req, res) => {
  const { filepath, content } = req.body ?? {};
  if (!filepath || !content) return res.status(400).json({ error: 'Missing filepath or content' });

  const rel  = filepath.replace(/\\/g, '/').replace(/^\/+/, '');
  const full = path.join(DOCS_DIR, rel);

  if (!full.startsWith(DOCS_DIR)) return res.status(400).json({ error: 'Path outside docs/' });

  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf-8');
  res.json({ success: true, saved: full.replace(ROOT + path.sep, '') });
});

app.listen(PORT, () => {
  console.log('\n\x1b[33m🔥 WildFire Page Generator\x1b[0m');
  console.log(`   \x1b[36mhttp://localhost:${PORT}\x1b[0m\n`);
});
