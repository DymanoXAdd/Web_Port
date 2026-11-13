# Decisions — portfolio-website

<!-- One entry per decision, newest first. Never edit an old entry; add a new one
     that supersedes it. Changing anything recorded here needs human approval. -->

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
