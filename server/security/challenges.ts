import crypto from 'node:crypto';
import path from 'node:path';
import { RUNTIME_ROOT } from '../storage/paths';
import { readJson, writeJson } from '../storage/json';

const file = path.join(RUNTIME_ROOT, 'data', 'used-auth-challenges.json');
const key = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
function active(): Record<string, number> {
  return Object.fromEntries(
    Object.entries(readJson<Record<string, number>>(file, {})).filter(
      ([, expires]) => expires > Date.now(),
    ),
  );
}
export function isChallengeConsumed(token: string) {
  return !!active()[key(token)];
}
// Synchronous consume makes parallel verification requests mutually exclusive.
export function consumeChallenge(token: string, expires: number) {
  const used = active(),
    hash = key(token);
  if (used[hash] || expires <= Date.now()) return false;
  used[hash] = expires;
  writeJson(file, used);
  return true;
}
