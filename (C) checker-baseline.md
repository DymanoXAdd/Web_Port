---
type: checker-baseline
updated: 2026-06-23
---

# Checker Baseline — Known Pre-Existing Failures

The Checker reads this file to separate **NEW** failures (caused by the task under test — these block) from **KNOWN** failures that already existed before the task (these do NOT block).

**Maintenance rule:** when a known failure gets fixed by a task, the Checker reports it as "newly passing" and the entry is removed from this list. Never add a failure here just to make a task pass — only genuinely pre-existing/environmental failures belong here.

## Known failures (do NOT block a task's verdict)

| # | Suite / test | Symptom | Why it's baselined | Owning task |
|---|---|---|---|---|
| B1 | `__tests__/unit/email-security.test.ts` | Suite fails to load: `Missing API key. Pass it to the constructor new Resend("re_123")` at `lib/email.ts:4` | Environmental — no `RESEND_API_KEY` set in the test env. Not a code defect. | Fix Resend test env / mock |

## Notes
- B3 (integration suite `fetch failed` / no server) was REMOVED on 2026-06-23. The integration suite (`__tests__/integration/api-security.test.ts`) now passes 24/24 against a live dev server (`npm run dev` on `http://localhost:3000`). A test-isolation defect (all validation requests sharing the `"unknown"` rate-limit bucket, causing later tests to get 429 before validation) was fixed by giving each validation request a unique spoofed `x-forwarded-for` IP. The Checker should bring up a live server and run the suite directly — it is genuinely green, not baselined.
