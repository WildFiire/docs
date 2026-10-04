import { Router } from 'express';
import path from 'node:path';
import translate from 'google-translate-api-x';
import { RUNTIME_ROOT } from './storage/paths';
import { readJson, writeJson } from './storage/json';
export const legacyRouter = Router();
legacyRouter.get('/api/config', (_req, res) =>
  res.json({
    githubClientId: process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || '',
  }),
);
for (const [endpoint, url] of [
  ['device-code', 'https://github.com/login/device/code'],
  ['token', 'https://github.com/login/oauth/access_token'],
]) {
  legacyRouter.post(`/api/github/${endpoint}`, async (req, res) => {
    const { client_id, scope, device_code, grant_type } = req.body || {};
    if (typeof client_id !== 'string' || client_id.length > 100)
      return res.status(400).json({ error: 'Invalid client_id' });
    const response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, scope, device_code, grant_type }),
      signal: AbortSignal.timeout(15000),
    });
    res.status(response.status).json(await response.json());
  });
}
const bgFile = path.join(RUNTIME_ROOT, 'profile-backgrounds.json');
legacyRouter.get('/api/profile-bg/:login', (req, res) =>
  res.json(
    readJson<Record<string, unknown>>(bgFile, {})[String(req.params.login)] || {
      presetId: 'default',
      customColor: '#1a1a2e',
      customUrl: '',
    },
  ),
);
legacyRouter.post('/api/profile-bg', (req, res) => {
  const { login, presetId = 'default', customColor = '#1a1a2e', customUrl = '' } = req.body || {};
  if (
    typeof login !== 'string' ||
    !/^[a-zA-Z0-9-]{1,39}$/.test(login) ||
    ['__proto__', 'constructor', 'prototype'].includes(login)
  )
    return res.status(400).json({ error: 'login required' });
  if (
    typeof customUrl !== 'string' ||
    (customUrl && !/^https:\/\//.test(customUrl)) ||
    typeof customColor !== 'string' ||
    !/^#[0-9a-f]{3,8}$/i.test(customColor)
  )
    return res.status(400).json({ error: 'Invalid background' });
  const data = readJson<Record<string, unknown>>(bgFile, {});
  data[login] = { presetId, customColor, customUrl };
  writeJson(bgFile, data);
  res.json({ ok: true });
});
legacyRouter.post('/api/translate', async (req, res) => {
  const { text, to = 'en' } = req.body || {};
  if (
    typeof text !== 'string' ||
    !text ||
    text.length > 20000 ||
    typeof to !== 'string' ||
    !/^[a-z-]{2,10}$/i.test(to)
  )
    return res.status(400).json({ error: 'Text to translate is required' });
  try {
    const result = await translate(text, { to });
    res.json({ translatedText: result.text });
  } catch {
    res.status(502).json({ error: 'Failed to translate' });
  }
});
