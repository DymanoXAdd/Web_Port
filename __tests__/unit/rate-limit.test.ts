/**
 * Unit tests — Rate limiting + IP extraction logic
 *
 * We test the pure helper functions extracted from the route handler.
 * Run: npm test
 */

// ──────────────────────────────────────────────────────────────────────────────
// Inline copies of the functions under test.
// (We can't import the route directly because Next.js route modules use
// globalThis APIs not available in plain Jest — so we duplicate the logic here
// and keep it in sync manually.)
// ──────────────────────────────────────────────────────────────────────────────

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function makeStore() {
  return new Map<string, { count: number; resetTime: number }>();
}

function checkRateLimit(
  store: Map<string, { count: number; resetTime: number }>,
  ip: string,
  now: number
): boolean {
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

/** Simulates getClientIp() — reads last x-forwarded-for entry */
function getClientIp(headers: Record<string, string | null>): string {
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    const parts = forwarded.split(",").map((s) => s.trim());
    return parts[parts.length - 1] || "unknown";
  }
  return headers["x-real-ip"] || "unknown";
}

/** isAllowedPath — mirrors the revalidate route allowlist */
const ALLOWED_PATHS = new Set(["/", "/api/email"]);
function isAllowedPath(path: string): boolean {
  return ALLOWED_PATHS.has(path);
}

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

const NOW = Date.now();

describe("checkRateLimit", () => {
  test("allows first request", () => {
    const store = makeStore();
    expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(true);
  });

  test("allows up to RATE_LIMIT requests", () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) {
      expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(true);
    }
  });

  test("blocks the (RATE_LIMIT + 1)th request", () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) {
      checkRateLimit(store, "1.2.3.4", NOW);
    }
    expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(false);
  });

  test("each IP is tracked independently", () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) {
      checkRateLimit(store, "1.1.1.1", NOW);
    }
    // 1.1.1.1 is blocked but 2.2.2.2 is fresh
    expect(checkRateLimit(store, "1.1.1.1", NOW)).toBe(false);
    expect(checkRateLimit(store, "2.2.2.2", NOW)).toBe(true);
  });

  test("resets after the window expires", () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) {
      checkRateLimit(store, "1.2.3.4", NOW);
    }
    // Blocked now
    expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(false);

    // After the window the counter resets
    const afterWindow = NOW + RATE_LIMIT_WINDOW + 1;
    expect(checkRateLimit(store, "1.2.3.4", afterWindow)).toBe(true);
  });
});

describe("getClientIp", () => {
  test("returns last x-forwarded-for entry (edge IP)", () => {
    // Attacker prepends fake IPs; the last entry is set by Vercel's edge
    const ip = getClientIp({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 99.99.99.99" });
    expect(ip).toBe("99.99.99.99");
  });

  test("returns the only x-forwarded-for entry", () => {
    const ip = getClientIp({ "x-forwarded-for": "10.0.0.1" });
    expect(ip).toBe("10.0.0.1");
  });

  test("trims spaces around entries", () => {
    const ip = getClientIp({ "x-forwarded-for": "  1.2.3.4  ,  5.6.7.8  " });
    expect(ip).toBe("5.6.7.8");
  });

  test("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const ip = getClientIp({ "x-forwarded-for": null, "x-real-ip": "10.20.30.40" });
    expect(ip).toBe("10.20.30.40");
  });

  test("returns 'unknown' when no IP headers present", () => {
    const ip = getClientIp({ "x-forwarded-for": null, "x-real-ip": null });
    expect(ip).toBe("unknown");
  });

  test("handles empty x-forwarded-for string", () => {
    const ip = getClientIp({ "x-forwarded-for": "", "x-real-ip": "1.2.3.4" });
    // empty string → falls through to x-real-ip
    expect(ip).toBe("1.2.3.4");
  });
});

describe("isAllowedPath (revalidate allowlist)", () => {
  test("allows root /", () => {
    expect(isAllowedPath("/")).toBe(true);
  });

  test("allows /api/email", () => {
    expect(isAllowedPath("/api/email")).toBe(true);
  });

  test("rejects arbitrary path", () => {
    expect(isAllowedPath("/admin")).toBe(false);
  });

  test("rejects path traversal attempt", () => {
    expect(isAllowedPath("/../../../etc/passwd")).toBe(false);
  });

  test("rejects empty string", () => {
    expect(isAllowedPath("")).toBe(false);
  });

  test("rejects /api/revalidate itself", () => {
    expect(isAllowedPath("/api/revalidate")).toBe(false);
  });

  test("is case-sensitive — /Admin is not /admin and not allowed", () => {
    expect(isAllowedPath("/Admin")).toBe(false);
  });
});
