# Tasks — portfolio-website

Stage: production · Updated: 2026-11-12

<!-- IDs never get reused. "Now" holds at most 3 tasks. When a task changes state,
     update the registry row in the workspace CLAUDE.md in the same turn. -->

## Now
- [ ] T-007 Run `/ponytail-audit`; log refactor, security and performance findings here as tasks

## Next
- [ ] T-003 GitHub Actions: lint, type-check, test:all, build on every PR. Integration suite needs a running server: `next start` with a dummy `RESEND_API_KEY` (the rate-limit test would send real mail), then `TEST_BASE_URL=... npm run test:integration`
- [ ] T-009 `npm run deploy`: checks → push branch → `gh pr create` → `gh pr merge --squash` (Luis runs it, never Claude; needs T-003)
- [ ] T-005 Dependabot (weekly, grouped) + gitleaks on every PR
- [ ] T-004 Sentry free tier + one uptime check on the home page (dependency + DSN secret approved in principle; confirm at build time)
- [ ] T-010 One-line privacy note on the contact form ("Your message is emailed to Luis and not stored.")
- [ ] T-006 Fix the `<img>` / `no-img-element` lint warnings in `Projects.tsx:134,160`, `WorkExperience.tsx:70` and `Skill.tsx:82`; also switch `@sanity/image-url` default export to `createImageUrlBuilder` (build deprecation warning)
- [ ] T-011 Redesign: 2–3 HTML mockups → Luis picks → plan → build (size from T-007 findings)
- [ ] T-012 Playwright contact-flow E2E test, after the redesign lands

## Blocked or waiting on a human

## Open decisions from intake
- _none — all settled 2026-11-12 (see BRIEF, D-002)_

## Debt (from `/ponytail-debt`)

## Done
- [x] T-008 Workspace scaffolding + test fixes merged to main (2026-11-12). Old-site copy (`vault/10 Original Files/`) kept out of git: public repo, it held phone/address and a 15 MB image
- [x] T-002 Green baseline (2026-11-12): type-check clean, lint 2 warnings, unit 47, components 47, integration 24, build OK. Fixed: jest now ignores `docs/` (vault copy of the old site caused a haste collision), `lib/email.ts` builds the Resend client per send (missing key no longer crashes tests or Vercel preview builds), `tsconfig` excludes `docs/`
- [x] T-001 BRIEF, ARCHITECTURE and D-001 approved; open intake items settled as D-002 (2026-11-12)
- [x] Shipped live on `luisaruiz.xyz`, Resend contact form working (2026-07-21)
