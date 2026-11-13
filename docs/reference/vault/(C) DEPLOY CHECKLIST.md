---
type: deploy-checklist
status: done
created: 2026-06-29
updated: 2026-07-21
---

# (C) Deploy Readiness Checklist

The portfolio is "shipped" when it's **live and public on a real domain** (`luisaruiz.xyz`) with a **working contact form**. This tracks the gap between "code is green" and "actually live." Check items off as they land.

> ✅ **SHIPPED — 2026-07-21.** Site is live and public on `luisaruiz.xyz` and the Resend contact form works end-to-end (Luis confirmed). All blocking items cleared.

## 🔴 Blocking — must be true before the contact form works in production

- [x] **Resend — verify `luisaruiz.xyz` sender domain** — ✅ Verified; contact emails send (2026-07-21)
  - Sender is hardcoded `noreply@luisaruiz.xyz` in `02 Build/lib/email.ts` → the domain MUST show **Verified** in Resend or every contact email silently fails.
  - Steps:
    - [x] Resend → Domains → Add Domain → `luisaruiz.xyz` (pick nearest region)
    - [x] Add the DNS records Resend gives you (on the `send` subdomain):
      - [x] **MX** `send` → `feedback-smtp.<region>.amazonses.com` (priority 10)
      - [x] **TXT (SPF)** `send` → `v=spf1 include:amazonses.com ~all`
      - [x] **TXT (DKIM)** `resend._domainkey` → the long `p=...` value (one unbroken string)
    - [x] Click **Verify** in Resend → status flips to **Verified**
  - ⚠️ Gotchas: don't double-append the domain in the Name field (`send`, not `send.luisaruiz.xyz`, if the panel auto-adds it); paste DKIM `p=` with no line breaks; merge into any existing SPF record instead of adding a second.

- [x] **Vercel — `RESEND_API_KEY` env var set for Production** — ✅ set + deployed (2026-07-21)
  - `02 Build/lib/email.ts` reads `process.env.RESEND_API_KEY`.
  - [x] Vercel → Project → Settings → Environment Variables → `RESEND_API_KEY` present for **Production** (add Preview too if you want test deploys to send)
  - [x] If added after the last deploy → **redeploy** (env binds at build time)

- [x] **End-to-end test on the live site** — ✅ contact form delivers (2026-07-21)
  - [x] Submit the contact form on the live URL with your own email
  - [x] Confirm the email actually lands (check Resend → Logs/Emails if not — it shows the exact reason)

## ✅ Done

- [x] **Sanity — `contactInfo` filled** (`pageInfo → contactInfo`: phone / email / address) — done 2026-06-29 (Luis)
- [x] **openGraph `url`** = `https://luisaruiz.xyz/` confirmed in `app/layout.tsx` — 2026-06-27
- [x] **Visual smoke pass** — Projects tilt-stack, Skills cascade, carousel, hero, nav, spacing all eyeballed in-browser — Luis confirmed "looks good" 2026-06-29
- [x] **Code gate green** — type-check / lint / test:all (unit 35 · components 44 · integration 24) / build all passing; baseline B1 (Resend env in test) only, non-blocking — 2026-06-29

## ⚪ Optional / nice-to-have (non-blocking)

- [ ] Pre-existing lint warning in `components/sections/Projects.tsx` (`@next/next/no-img-element` — `<img>` vs `next/image`). Cosmetic; the recent Projects rebuild may have changed which files trip it — re-check.
- [ ] Confirm custom domain `luisaruiz.xyz` is attached to the Vercel project and DNS points at Vercel (separate from the Resend email DNS above).

---
*Update `status:` to `done` once all 🔴 blocking items are checked and the live contact form delivers.*
