import { DOCS_ROOT, PUBLIC_ROOT, RUNTIME_ROOT } from '@server/storage/paths';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { jsonReply, sendReply, prepareResponse, setCookie } from '@server/http';
import fs from 'fs';
import path from 'path';
import { recordAuditEvent } from '@server/lib/security/audit';

const NOTIFICATIONS_FILE = path.join(RUNTIME_ROOT, 'content', 'maintenance-subscribers.json');

export async function GET(req: ExpressRequest, expressResponse: ExpressResponse) {
  let subscribers: { email: string; createdAt: string }[] = [];
  if (fs.existsSync(NOTIFICATIONS_FILE)) {
    try {
      const raw = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      subscribers = JSON.parse(raw);
    } catch {}
  }
  return jsonReply(expressResponse, { total: subscribers.length, subscribers });
}

export async function POST(req: ExpressRequest, expressResponse: ExpressResponse) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return jsonReply(expressResponse, { error: 'Invalid email address.' }, { status: 400 });
    }

    let subscribers: { email: string; createdAt: string }[] = [];
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      try {
        const raw = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
        subscribers = JSON.parse(raw);
      } catch {}
    }

    const cleanEmail = email.trim().toLowerCase();

    // Deduplicate
    if (!subscribers.some((s) => s.email.toLowerCase() === cleanEmail)) {
      subscribers.push({
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      });
      const dir = path.dirname(NOTIFICATIONS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');

      // Record in cryptographic audit ledger
      recordAuditEvent({
        action: 'MAINTENANCE_TOGGLED',
        actor: cleanEmail,
        details: { type: 'MAINTENANCE_SUBSCRIBE', totalSubscribers: subscribers.length },
      });
    }

    return jsonReply(expressResponse, {
      success: true,
      message: 'You will receive an instant notification when Wildfire Docs is restored!',
      totalSubscribers: subscribers.length,
    });
  } catch (err) {
    return jsonReply(expressResponse, { error: 'Server error' }, { status: 500 });
  }
}
