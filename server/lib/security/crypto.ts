import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET;
if (!SECRET_KEY || SECRET_KEY.length < 32)
  throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters');

/**
 * Constant-time string equality check to prevent timing attacks.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Execute a dummy comparison to preserve constant timing
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Computes SHA-256 hex digest of string data.
 */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Derives a PBKDF2 hash using SHA-512 and 100,000 iterations.
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto
    .pbkdf2Sync(password, generatedSalt, 100000, 64, 'sha512')
    .toString('hex');
  return { hash: derivedKey, salt: generatedSalt };
}

/**
 * Timing-safe password verification.
 */
export function verifyPassword(attempt: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(attempt, salt);
  return timingSafeCompare(hash, storedHash);
}

/**
 * Generates a cryptographically strong random token.
 */
export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Creates an HMAC-SHA256 signed session token.
 */
export function signSessionToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 signed session token.
 */
export function verifySessionToken<T = any>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [data, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(data)
      .digest('base64url');

    if (!timingSafeCompare(signature, expectedSignature)) {
      return null;
    }

    const jsonString = Buffer.from(data, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonString);
    if (
      payload.type === '2fa_pending' &&
      (!Number.isFinite(payload.expiresAt) || payload.expiresAt <= Date.now())
    )
      return null;
    return payload as T;
  } catch {
    return null;
  }
}
