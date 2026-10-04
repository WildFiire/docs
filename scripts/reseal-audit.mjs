import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
const targetPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(process.cwd(), 'content', 'audit.json');

if (!fs.existsSync(targetPath)) {
  console.error(`[ERR] Fișierul nu a fost găsit la: ${targetPath}`);
  process.exit(1);
}

try {
  const raw = fs.readFileSync(targetPath, 'utf-8');
  const ledger = JSON.parse(raw);

  if (!Array.isArray(ledger)) {
    console.error('[ERR] Format invalid: content/audit.json trebuie să fie un array.');
    process.exit(1);
  }

  if (ledger.length === 0) {
    console.log('[INFO] Ledger-ul este gol (0 evenimente). Lanțul este valid by default.');
    process.exit(0);
  }

  // Evenimentele sunt stocate în mod normal 'most recent first' (descrescător)
  // Pentru recalculare mergem cronologic (de la cel mai vechi la cel mai nou)
  const chronological = [...ledger].reverse();

  let prev = GENESIS_HASH;
  let fixedCount = 0;

  for (let i = 0; i < chronological.length; i++) {
    const e = chronological[i];
    const details = e.details || {};
    
    // Corectăm previousHash
    if (e.previousHash !== prev) {
      e.previousHash = prev;
      fixedCount++;
    }

    const payload = `${e.previousHash}|${e.id}|${e.timestamp}|${e.action}|${e.actor}|${e.ip}|${JSON.stringify(details)}`;
    const expectedHash = sha256(payload);

    if (e.hash !== expectedHash) {
      e.hash = expectedHash;
      fixedCount++;
    }

    prev = e.hash;
  }

  // Readucem la ordinea originală (cel mai recent primul)
  const resealedLedger = chronological.reverse();
  fs.writeFileSync(targetPath, JSON.stringify(resealedLedger, null, 2), 'utf-8');

  console.log(`[OK] Lanțul criptografic a fost resigilat cu succes!`);
  console.log(`     Total evenimente: ${resealedLedger.length}`);
  console.log(`     Corecții efectuate: ${fixedCount}`);
  console.log(`     Status: VERIFIED (100% Chain OK)`);
} catch (err) {
  console.error('[ERR] Eroare la resigilarea lanțului de audit:', err);
  process.exit(1);
}
