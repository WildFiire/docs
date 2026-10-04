/**
 * Sliding Window & Exponential Lockout Rate Limiter
 * Provides brute-force and credential stuffing defense.
 */

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  lockedUntil: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.lockedUntil && now - record.lastAttemptAt > 600000) {
        rateLimitStore.delete(key);
      }
    }
  }, 600000);
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds: number;
  totalAttempts: number;
}

/**
 * Checks and updates rate limits for a given client identifier (IP or username).
 *
 * @param key Identifier (e.g., `login:ip:192.168.1.1`)
 * @param maxAttempts Allowed failures before lockout (default: 5)
 * @param windowMs Time window in milliseconds (default: 15 minutes)
 * @param lockoutDurationMs Base lockout time in milliseconds (default: 15 minutes)
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000,
  lockoutDurationMs = 15 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = {
      attempts: 0,
      firstAttemptAt: now,
      lastAttemptAt: now,
      lockedUntil: 0,
    };
    rateLimitStore.set(key, record);
  }

  // Check if currently locked out
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutRemainingSeconds: remainingSeconds,
      totalAttempts: record.attempts,
    };
  }

  // Reset window if elapsed
  if (now - record.firstAttemptAt > windowMs) {
    record.attempts = 0;
    record.firstAttemptAt = now;
    record.lockedUntil = 0;
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);

  return {
    allowed: record.attempts < maxAttempts,
    remainingAttempts: remaining,
    lockoutRemainingSeconds: 0,
    totalAttempts: record.attempts,
  };
}

/**
 * Registers a failed attempt and locks out if threshold is breached.
 */
export function registerFailedAttempt(
  key: string,
  maxAttempts = 5,
  baseLockoutMs = 15 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = {
      attempts: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
      lockedUntil: 0,
    };
    rateLimitStore.set(key, record);
  } else {
    record.attempts += 1;
    record.lastAttemptAt = now;
  }

  if (record.attempts >= maxAttempts) {
    // Exponential multiplier for repeat offenders
    const multiplier = Math.min(4, Math.floor(record.attempts / maxAttempts));
    record.lockedUntil = now + baseLockoutMs * multiplier;
  }

  return checkRateLimit(key, maxAttempts);
}

/**
 * Resets rate limit on successful authentication.
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Resets all rate limits / lockouts across all IPs.
 */
export function resetAllRateLimits(): void {
  rateLimitStore.clear();
}
