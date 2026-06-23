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
| B2 | `__tests__/unit/validation.test.ts` › `contactFormSchema › trims whitespace from all fields` | Expects success `true`, gets `false` | Real pre-existing bug: Zod `.min()` runs before `.trim()` in `lib/validation.ts` | **Fix Zod trim/min ordering** (queued) |
| B3 | `__tests__/integration/api-security.test.ts` (all cases) | `TypeError: fetch failed` | Environmental — integration suite needs a dev server on `http://localhost:3000`; none running | Run integration with a live server |

## Notes
- B2 should be removed from this baseline once the Zod ordering task lands and the test goes green.
- B3 is environmental: the Checker should try to bring up a server for integration runs (see checker definition). Only if it genuinely cannot should these be treated as baselined.
