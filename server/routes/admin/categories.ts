import { DOCS_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply } from '@server/http';
import fs from 'fs';
import path from 'path';
import { validateSessionToken, SESSION_COOKIE_NAME } from '@server/lib/security/auth';
import { recordAuditEvent } from '@server/lib/security/audit';
import { writeJson } from '@server/storage/json';

const CATEGORIES_FILE = path.join(RUNTIME_ROOT, 'content', 'categories.json');

export interface CategoryItem {
  key: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
  order?: number;
}

const DEFAULT_CATEGORIES: Record<string, CategoryItem> = {
  informatii: {
    key: 'informatii',
    label: 'Informații Generale',
    icon: 'lucide:book-open',
    color: '#3b82f6',
    description: 'Ghiduri, regulamente și informații esențiale de pornire',
    order: 1,
  },
  currency: {
    key: 'currency',
    label: 'Economie & Resurse',
    icon: 'lucide:coins',
    color: '#f59e0b',
    description: 'Monede Phoenix Coins, credite, economie și inventar',
    order: 2,
  },
  systems: {
    key: 'systems',
    label: 'Sisteme & Arhitectură',
    icon: 'lucide:cpu',
    color: '#8b5cf6',
    description: 'Sisteme integrate de joc, statistici și comenzi de server',
    order: 3,
  },
  market: {
    key: 'market',
    label: 'Servicii & Pachete',
    icon: 'lucide:shopping-bag',
    color: '#ec4899',
    description: 'Magazin in-game, upgrade-uri, pachete VIP și beneficii',
    order: 4,
  },
  general: {
    key: 'general',
    label: 'Documentație Generală',
    icon: 'lucide:folder',
    color: '#64748b',
    description: 'Documente generale și ghiduri diverse',
    order: 5,
  },
};

export function loadCategories(): Record<string, CategoryItem> {
  let categories: Record<string, CategoryItem> = {};
  if (fs.existsSync(CATEGORIES_FILE)) {
    try {
      const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
      categories = JSON.parse(raw);
    } catch {
      categories = { ...DEFAULT_CATEGORIES };
    }
  } else {
    categories = { ...DEFAULT_CATEGORIES };
    try {
      const dir = path.dirname(CATEGORIES_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      writeJson(CATEGORIES_FILE, categories);
    } catch {}
  }

  // Scan DOCS_ROOT for existing directories to discover any other categories
  if (fs.existsSync(DOCS_ROOT)) {
    try {
      const entries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });
      const ignored = ['.vitepress', 'admin', 'panel', 'public', 'team', 'changelog', 'maintenance', 'docs', 'node_modules'];
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && !ignored.includes(entry.name)) {
          const key = entry.name;
          if (!categories[key]) {
            const formattedLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/[-_]/g, ' ');
            categories[key] = {
              key,
              label: formattedLabel,
              icon: 'lucide:folder',
              color: '#06b6d4',
              description: `Categoria ${formattedLabel}`,
              order: Object.keys(categories).length + 1,
            };
          }
        }
      }
    } catch {}
  }

  return categories;
}

export function saveCategories(categories: Record<string, CategoryItem>) {
  const dir = path.dirname(CATEGORIES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  writeJson(CATEGORIES_FILE, categories);
}

function countDocsPerCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  if (!fs.existsSync(DOCS_ROOT)) return counts;

  function walk(dir: string, currentCategory: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || ['public', 'admin', 'panel', 'team', 'changelog', 'maintenance'].includes(entry.name)) {
        continue;
      }
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const nextCat = currentCategory === 'general' ? entry.name : currentCategory;
        walk(full, nextCat);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        counts[currentCategory] = (counts[currentCategory] || 0) + 1;
      }
    }
  }

  try {
    const topEntries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });
    for (const top of topEntries) {
      if (top.isDirectory() && !top.name.startsWith('.') && !['public', 'admin', 'panel', 'team', 'changelog', 'maintenance', '.vitepress', 'docs'].includes(top.name)) {
        counts[top.name] = 0;
        walk(path.join(DOCS_ROOT, top.name), top.name);
      } else if (top.isFile() && (top.name.endsWith('.md') || top.name.endsWith('.mdx'))) {
        counts['general'] = (counts['general'] || 0) + 1;
      }
    }
  } catch {}

  return counts;
}

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const categories = loadCategories();
  const docCounts = countDocsPerCategory();

  return jsonReply(expressResponse, {
    categories,
    docCounts,
  });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  const session = token ? await validateSessionToken(token) : null;

  if (!session) {
    return jsonReply(expressResponse, { error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const canEdit = session.isRoot || Boolean(session.permissions?.canEditDocs) || Boolean(session.permissions?.canManageSettings);
  if (!canEdit) {
    return jsonReply(expressResponse, { error: 'FORBIDDEN', message: 'Permisiuni insuficiente pentru modificarea categoriilor.' }, { status: 403 });
  }

  const body = req.body || {};
  const action = body.action || 'update';
  const categories = loadCategories();

  if (action === 'update') {
    const oldKey = String(body.oldKey || body.key || '').trim().toLowerCase();
    const newKey = String(body.newKey || oldKey).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '');
    const label = String(body.label || '').trim();
    const icon = String(body.icon || 'lucide:folder').trim();
    const color = String(body.color || '#3b82f6').trim();
    const description = String(body.description || '').trim();
    const order = typeof body.order === 'number' ? body.order : categories[oldKey]?.order || 99;

    if (!oldKey || !label) {
      return jsonReply(expressResponse, { error: 'BAD_REQUEST', message: 'Cheia veche și eticheta sunt obligatorii.' }, { status: 400 });
    }

    if (!categories[oldKey]) {
      // If category didn't exist in file, initialize it
      categories[oldKey] = {
        key: oldKey,
        label,
        icon,
        color,
        description,
        order,
      };
    }

    // Handle rename if key changed
    if (newKey && newKey !== oldKey) {
      if (categories[newKey]) {
        return jsonReply(expressResponse, { error: 'CONFLICT', message: `O categorie cu identificatorul "${newKey}" există deja.` }, { status: 409 });
      }

      // Rename directory on disk if it exists
      const oldDirPath = path.join(DOCS_ROOT, oldKey);
      const newDirPath = path.join(DOCS_ROOT, newKey);

      if (fs.existsSync(oldDirPath) && !fs.existsSync(newDirPath)) {
        try {
          fs.renameSync(oldDirPath, newDirPath);

          // Update frontmatter in all markdown files inside new directory
          function updateFrontmatter(dir: string) {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            for (const file of files) {
              const full = path.join(dir, file.name);
              if (file.isDirectory()) {
                updateFrontmatter(full);
              } else if (file.isFile() && (file.name.endsWith('.md') || file.name.endsWith('.mdx'))) {
                try {
                  let content = fs.readFileSync(full, 'utf-8');
                  content = content.replace(new RegExp(`category:\\s*["']?${oldKey}["']?`, 'g'), `category: "${newKey}"`);
                  fs.writeFileSync(full, content, 'utf-8');
                } catch {}
              }
            }
          }

          updateFrontmatter(newDirPath);
        } catch (renameErr: any) {
          console.error('[Categories] Rename directory error:', renameErr);
        }
      }

      delete categories[oldKey];
      categories[newKey] = {
        key: newKey,
        label,
        icon,
        color,
        description,
        order,
      };
    } else {
      categories[oldKey] = {
        key: oldKey,
        label,
        icon,
        color,
        description,
        order,
      };
    }

    saveCategories(categories);
    recordAuditEvent(
      session.username,
      'DOC_UPDATE',
      `Actualizare categorie ${label} (${newKey !== oldKey ? `${oldKey} -> ${newKey}` : oldKey})`,
      '127.0.0.1',
    );

    return jsonReply(expressResponse, {
      success: true,
      message: `Categoria "${label}" a fost actualizată cu succes.`,
      categories,
      docCounts: countDocsPerCategory(),
    });
  }

  if (action === 'create') {
    const key = String(body.key || body.slug || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '');
    const label = String(body.label || body.title || '').trim();
    const icon = String(body.icon || 'lucide:folder').trim();
    const color = String(body.color || '#3b82f6').trim();
    const description = String(body.description || '').trim();
    const order = typeof body.order === 'number' ? body.order : Object.keys(categories).length + 1;

    if (!key || !label) {
      return jsonReply(expressResponse, { error: 'BAD_REQUEST', message: 'Identificatorul (slug) și denumirea categoriei sunt obligatorii.' }, { status: 400 });
    }

    if (categories[key]) {
      return jsonReply(expressResponse, { error: 'CONFLICT', message: `Categoria cu identificatorul "${key}" există deja.` }, { status: 409 });
    }

    categories[key] = {
      key,
      label,
      icon,
      color,
      description,
      order,
    };

    // Create directory on disk
    const targetDir = path.join(DOCS_ROOT, key);
    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir, { recursive: true });
      } catch {}
    }

    saveCategories(categories);
    recordAuditEvent(session.username, 'DOC_CREATE', `Creare categorie ${label} (${key})`, '127.0.0.1');

    return jsonReply(expressResponse, {
      success: true,
      message: `Categoria "${label}" a fost creată cu succes.`,
      categories,
      docCounts: countDocsPerCategory(),
    });
  }

  if (action === 'delete') {
    const key = String(body.key || '').trim().toLowerCase();
    if (!key) {
      return jsonReply(expressResponse, { error: 'BAD_REQUEST', message: 'Cheia categoriei este obligatorie.' }, { status: 400 });
    }

    const current = categories[key];
    const label = current?.label || key;

    delete categories[key];
    saveCategories(categories);
    recordAuditEvent(session.username, 'DOC_DELETE', `Ștergere categorie ${label} (${key})`, '127.0.0.1');

    return jsonReply(expressResponse, {
      success: true,
      message: `Categoria "${label}" a fost eliminată din definiții.`,
      categories,
      docCounts: countDocsPerCategory(),
    });
  }

  if (action === 'saveAll') {
    const newCategories = body.categories;
    if (!newCategories || typeof newCategories !== 'object') {
      return jsonReply(expressResponse, { error: 'BAD_REQUEST', message: 'Format invalid pentru categorii.' }, { status: 400 });
    }

    saveCategories(newCategories);
    recordAuditEvent(session.username, 'SETTINGS_UPDATE', 'Actualizare globală a tuturor categoriilor', '127.0.0.1');

    return jsonReply(expressResponse, {
      success: true,
      message: 'Toate categoriile au fost salvate cu succes.',
      categories: newCategories,
      docCounts: countDocsPerCategory(),
    });
  }

  return jsonReply(expressResponse, { error: 'BAD_REQUEST', message: `Acțiune necunoscută: ${action}` }, { status: 400 });
}
