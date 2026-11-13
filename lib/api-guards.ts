/**
 * Request guards shared by the API routes (and tested directly in __tests__/unit/rate-limit.test.ts).
 */

export const RATE_LIMIT = 5; // max requests per window
export const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

export type RateLimitStore = Map<string, { count: number; resetTime: number }>;

/**
 * shortcut: in-memory store, so each serverless instance (and every cold start) gets a fresh
 * count; it only stops bursts within one warm instance. Swap for a shared store (e.g. Vercel KV)
 * if spam gets through.
 */
export function checkRateLimit(store: RateLimitStore, ip: string, now = Date.now()): boolean {
  const record = store.get(ip);

  if (!record || now > record.resetTime) {
    store.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count < RATE_LIMIT) {
    record.count++;
    return true;
  }

  return false;
}

/**
 * Vercel appends the real edge IP as the last x-forwarded-for entry, so we take the last one:
 * a client can prepend fake entries but can't replace Vercel's.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((s) => s.trim());
    return parts[parts.length - 1] || "unknown";
  }
  return headers.get("x-real-ip") || "unknown";
}

// Only these paths may be revalidated from the Sanity webhook (blocks path-traversal abuse).
const ALLOWED_PATHS = new Set(["/"]); // only the page is cached; API routes are dynamic

export function isAllowedPath(path: string): boolean {
  return ALLOWED_PATHS.has(path);
}
