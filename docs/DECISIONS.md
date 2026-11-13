# Decisions — portfolio-website

<!-- One entry per decision, newest first. Never edit an old entry; add a new one
     that supersedes it. Changing anything recorded here needs human approval. -->

## D-006 — 2026-11-12 — Sentry error monitoring
- Status: approved by Luis, 2026-11-12 (asked to add Sentry; provided the DSN)
- Decision: `@sentry/nextjs` 11 on browser, server and edge (`instrumentation-client.ts`, `instrumentation.ts`, `app/global-error.tsx`), plus explicit reports from `ErrorBoundary` and the email route's catch. Errors only: `tracesSampleRate: 0`, no replay, no personal data (SDK default). Browser reports go through the `/monitoring` tunnel on our own origin, so the CSP stays `connect-src 'self'`. DSN in Vercel as `NEXT_PUBLIC_SENTRY_DSN` (production + preview, plain config: a DSN is public by design); unset locally and in CI, so Sentry is off there. No source-map upload (would need a `SENTRY_AUTH_TOKEN` secret).
- Why: Vercel Hobby keeps runtime logs ~1 hour, so the failed contact sends on 2026-11-12 left no trace; Sentry keeps them and alerts.
- Alternatives considered: Vercel log drains (paid plan), no monitoring.
- Approved by: Luis

## D-005 — 2026-11-12 — Redesign to concept A "Query" + four optional hero fields in Sanity
- Status: approved by Luis, 2026-11-12 (picked concept A in green #00880C; approved the build plan, dropping the hero video and typewriter, and the new hero copy)
- Decision: dark theme (ink #0E1116), brand green #00880C for fills with white text, #34C94A for small accent text (contrast: #00880C on ink is 4.2:1 and fails AA for small text). Inter + JetBrains Mono via next/font (self-hosted). Tilt project stack and skill count-up kept; experience carousel replaced by a list; hero video and typewriter removed; phone and address no longer shown in the contact section. `pageInfo` gains optional `heroKicker`, `headline`, `heroIntro`, `status`; the code falls back to the approved mockup wording when they are empty, so no data migration is needed.
- Why: Luis chose it from three mockups (https://claude.ai/artifact/VU24MPJApXdTfTCoxrvFDQ).
- Alternatives considered: B Editorial, C Bento (not picked).
- Approved by: Luis

## D-004 — 2026-11-12 — DNS moves from Cloudflare to Vercel
- Status: approved by Luis, 2026-11-12 (nameserver change made by Luis)
- Decision: `luisaruiz.xyz` uses Vercel nameservers (`ns1/ns2.vercel-dns.com`). Resend records (`send` MX + SPF TXT, `resend._domainkey` DKIM) copied to Vercel DNS first.
- Why: Cloudflare was DNS-only (proxy off) and added a second place to manage records; the domain is registered at Vercel.
- Alternatives considered: keep Cloudflare DNS (rejected by Luis).
- Approved by: Luis

## D-003 — 2026-11-12 — Vercel Bot Protection: Challenge → Log
- Status: approved by Luis, 2026-11-12
- Decision: Vercel firewall managed Bot Protection set to Log (was Challenge). AI Bots stays Deny, Attack Mode off, system DDoS mitigation on.
- Why: Challenge answered the contact form's `fetch` POST to `/api/email` with an HTML challenge page, so the form showed "Unexpected token '<'" and no mail was sent. It also rejected uptime checkers (T-014 blamed Cloudflare; it was this).
- Alternatives considered: Off (rejected: Log keeps bot visibility); a path-scoped bypass for `/api/email` (needs Vercel Pro).
- Approved by: Luis

## D-002 — 2026-11-12 — Delivery workflow, monitoring and scanning
- Status: approved by Luis, 2026-11-12
- Decision: task branches and PRs; `npm run deploy` (run only by Luis) runs the checks, pushes, opens the PR and squash-merges, and Vercel deploys production. GitHub Actions CI on every PR. Dependabot + gitleaks. Sentry free tier plus one uptime check. Redesign goes through HTML mockups first.
- Why: the only gate before production today is local checks; one command keeps deploys simple without skipping them.
- Alternatives considered: direct commits to main (rejected: no review or CI), merging by hand in GitHub (rejected: Luis wants one command).
- Approved by: Luis

## D-001 — 2026-11-11 — Initial stack and setup (imported)
- Status: approved
- Decision: keep the shipped stack (Next.js 14 + Sanity + Resend on Vercel). The `Web_Port` git repo is the project root; vault notes are kept in `docs/reference/vault/`.
- Why: it is live and working; a rewrite adds risk for no gain.
- Alternatives considered: keep the code in a `02 Build/` subfolder as in the vault (rejected: the brain layout puts code at the project root).
- Approved by: Luis, 2026-11-12
