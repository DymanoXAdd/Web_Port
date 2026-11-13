# Tasks — portfolio-website

Stage: production · Updated: 2026-11-12

<!-- IDs never get reused. "Now" holds at most 3 tasks. When a task changes state,
     update the registry row in the workspace CLAUDE.md in the same turn. -->

## Now

## Next
- [ ] T-023 Project card a11y: `role="button"` div wraps a link (nested interactive), and a project without `linkToBuild` opens `about:blank`. UI change, needs plan yes
- [ ] T-024 Keep one `metadata` (layout vs page disagree on title/description)
- [ ] T-025 Headers tidy: `'unsafe-eval'` only in dev; drop `X-XSS-Protection` and `X-DNS-Prefetch-Control: on`; drop `/api/email` from revalidate allowlist
- [ ] T-003 GitHub Actions: lint, type-check, test:all, build on every PR. Integration suite needs a running server: `next start` with a dummy `RESEND_API_KEY` (the rate-limit test would send real mail), then `TEST_BASE_URL=... npm run test:integration`
- [ ] T-009 `npm run deploy`: checks → push branch → `gh pr create` → `gh pr merge --squash` (Luis runs it, never Claude; needs T-003)
- [ ] T-005 Dependabot (weekly, grouped) + gitleaks on every PR
- [ ] T-004 Sentry free tier + one uptime check on the home page (note: Cloudflare edge rejects some bots/checkers and Spectrum blocks the domain for CLI tools on Luis's network; run the uptime check from a hosted monitor and confirm it gets 200) (dependency + DSN secret approved in principle; confirm at build time)
- [ ] T-010 One-line privacy note on the contact form ("Your message is emailed to Luis and not stored.")
- [ ] T-006 Fix the `<img>` / `no-img-element` lint warnings in `Projects.tsx:134,160`, `WorkExperience.tsx:70` and `Skill.tsx:82`; also switch `@sanity/image-url` default export to `createImageUrlBuilder` (build deprecation warning)
- [ ] T-011 Redesign: 2–3 HTML mockups → Luis picks → plan → build (size from T-007 findings)
- [ ] T-012 Playwright contact-flow E2E test, after the redesign lands

## Blocked or waiting on a human

## Open decisions from intake
- _none — all settled 2026-11-12 (see BRIEF, D-002)_

## Debt (from `/ponytail-debt`)

## Done
- [x] T-022 `ExperienceCard` dates: missing end date on a past job shows only the start month (no "Invalid Date"); dates format in UTC so "2020-01-01" no longer shows as Dec 2019 in US time zones (2026-11-12). Test: `__tests__/components/ExperienceCard.test.tsx`
- [x] T-021 `ErrorBoundary` shows only the fixed sentence; `error.message` goes to the console, never the page (2026-11-12). Test: `__tests__/components/ErrorBoundary.test.tsx`
- [x] T-020 Hero email pill reads `pageInfo.contactInfo.email` (hidden if empty); email route requires `RECIPIENT_EMAIL` (set in Vercel Production) and returns a generic 500 without it. No hard-coded address left in app code (2026-11-12)
- [x] T-019 Deleted `lib/constants.ts`, `components/BackgroundCircles.tsx`, `emailResponseSchema`, the empty footer link in `app/page.tsx`; uninstalled `react-simple-typewriter`, `react-social-icons`. Luis approved (2026-11-12)
- [x] T-018 `checkRateLimit`, `getClientIp`, `isAllowedPath` live in `lib/api-guards.ts`; both API routes and `rate-limit.test.ts` import them (test no longer checks a hand copy). Behavior unchanged. Luis approved (2026-11-12)
- [x] T-017 Removed the two CSP-blocked `db.onlinewebfonts.com` stylesheet links from `app/layout.tsx`; fonts still fall back to Helvetica Neue/Arial as before (2026-11-12). Test: integration "loads no stylesheet from another origin"
- [x] T-027 DNS moved to Vercel nameservers (D-004); Resend records resolve, live form send confirmed, Cloudflare zone deleted by Luis (2026-11-12)
- [x] T-016 `lib/sanity.ts` `imageUrl()` replaces `urlFor().url()` at all 7 sites; a missing image renders no `src` instead of crashing the page (2026-11-12). Test: `__tests__/unit/image-url.test.ts`
- [x] T-026 Contact form broken ("Unexpected token '<'"): Vercel Bot Protection challenged the form POST. Set to Log (D-003), 2026-11-12. Luis confirmed a live send from his phone
- [x] T-015 Visitor confirmation email removed; contact route sends one email, to Luis only. Luis approved (2026-11-12). Test: `__tests__/unit/email-route.test.ts`
- [x] T-007 `/ponytail-audit` run (2026-11-12); findings logged as T-015..T-025
- [x] T-013 Domain `luisaruiz.xyz` renewed by Luis in Vercel (2026-11-12)
- [x] T-014 False alarm (2026-11-12): site loads for Luis on PC and cellular. Failures were Spectrum Security Shield (home network, CLI only) and Cloudflare rejecting automated fetchers
- [x] T-008 Workspace scaffolding + test fixes merged to main (2026-11-12). Old-site copy (`vault/10 Original Files/`) kept out of git: public repo, it held phone/address and a 15 MB image
- [x] T-002 Green baseline (2026-11-12): type-check clean, lint 2 warnings, unit 47, components 47, integration 24, build OK. Fixed: jest now ignores `docs/` (vault copy of the old site caused a haste collision), `lib/email.ts` builds the Resend client per send (missing key no longer crashes tests or Vercel preview builds), `tsconfig` excludes `docs/`
- [x] T-001 BRIEF, ARCHITECTURE and D-001 approved; open intake items settled as D-002 (2026-11-12)
- [x] Shipped live on `luisaruiz.xyz`, Resend contact form working (2026-07-21)
