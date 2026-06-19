# How to Run & Test the Portfolio Site

**One file. Everything you need to run, test, build, and deploy the site.**
Do these steps in order.

---

## ⚠️ Read this first — which folder is the site?

- **`02 Build/`** ← **THIS is the site.** The rebuilt, modern, in-progress portfolio. Run it, test it, deploy it. Everything below happens here.
- **`10 Original Files/`** ← The **original source files** the rebuild was based on. Reference only. **Do NOT run this** — it's the old version, kept for lookback.

All commands below are run from inside `02 Build/`.

---

## Current Machine State (as of 2026-06-19)

These setup steps are **already done** on this machine — verify, don't redo:

| Thing | Status | Verify with |
|-------|--------|-------------|
| Node.js installed | ✅ v24.17.0 | `node --version` |
| npm installed | ✅ | `npm --version` |
| `.env.local` created with real values | ✅ | it exists in `02 Build/` |
| `npm install` (node_modules) | ✅ | `02 Build/node_modules/` exists |

> If you're setting up a **fresh machine**, do the "Fresh Setup" section at the bottom instead.

---

## Run

### 1. Start the local dev server
```bash
cd "02 Build"
npm run dev
```

Open **http://localhost:3000**.

**What you should see:**
- Dark background, green accents
- All 6 sections load (Hero → About → Experience → Skills → Projects → Contact)
- Typewriter effect in Hero
- Animations trigger on scroll
- Theme toggle (sun/moon icon) in header switches light/dark
- Contact form shows phone, email, address pulled from Sanity

---

## Test

### 2. Security unit tests (Python — quick, no dev server needed)
```bash
python "__tests__/run-tests.py"
```
Expected: **65/65 passing**.

### 3. Integration tests (need the dev server running)
In one terminal run `npm run dev`, then in a second terminal:
```bash
cd "02 Build"
npm run test:integration
```
Tests:
- `/api/email` — input validation, bad Content-Type rejection, rate limiting
- `/api/revalidate` — 401 on bad secret, 400 on bad path, 405 on GET
- HTTP headers — CSP, HSTS, X-Frame-Options present on every response

### 4. TypeScript type check
```bash
npm run type-check
```
Expected: no errors.

### 5. Linter
```bash
npm run lint
```
Fix anything that appears before deploying.

### 6. Manual contact-form test
1. Scroll to Contact, fill the form with real data, Submit.
2. Check `luisaruiz2734@gmail.com` for the message.
3. Sender should also receive a confirmation email.

---

## Build

### 7. Production build (must pass with 0 errors before deploy)
```bash
npm run build
```
If it fails, run `npm run type-check` to see the exact file and line. Fix before touching Vercel.

---

## Deploy

### 8. Push to GitHub
```bash
git init
git add .
git commit -m "feat: rebuild portfolio with App Router, dark theme, and security hardening"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

### 9. Deploy on Vercel
1. **https://vercel.com** → New Project → Import the GitHub repo
2. Set **Root Directory** to `02 Build`
3. Add every variable from `.env.local` in Vercel → Settings → Environment Variables
4. Deploy

### 10. Verify live + point domain
- Visit the Vercel URL, confirm all 6 sections load, test the contact form live
- Run Lighthouse (Chrome DevTools) — target > 90
- Vercel → Settings → Domains → add your domain (`luisaruiz.xyz`), update DNS, wait for propagation

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `npm run dev` | Local server at http://localhost:3000 |
| `python "__tests__/run-tests.py"` | 65 security unit tests (no dev server) |
| `npm run test:integration` | HTTP-level API security tests (needs dev server) |
| `npm run type-check` | TypeScript type check |
| `npm run lint` | ESLint check |
| `npm run build` | Production build (must pass before deploy) |
| `npm run start` | Run the production build locally |
| `npm test` | Jest unit tests |

---

## If Something Breaks

**Build fails on a TypeScript error** → `npm run type-check` shows the exact file/line.
**"Cannot find module"** → re-run `npm install`; confirm `tsconfig.json` has `"@/*": ["./*"]` in paths.
**Sanity images not loading** → check `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
**Form sends but no email** → check `RESEND_API_KEY` valid + sender domain verified in Resend; check `RECIPIENT_EMAIL`; check Resend delivery logs.
**Integration tests "connection refused"** → `npm run dev` must be running in a separate terminal first.
**Theme not persisting on refresh** → browser must allow `localStorage` (incognito blocks it).

---

## Fresh Setup (only on a brand-new machine)

If `node_modules/` or `.env.local` don't exist yet:

1. **Install Node.js** — https://nodejs.org → LTS → installer. Verify: `node --version`.
2. **Create `02 Build/.env.local`** (never commit it). Required keys:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=tl1sng9j
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-11-20
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
   RECIPIENT_EMAIL=luisaruiz2734@gmail.com
   REVALIDATE_SECRET=any_random_string_you_choose
   NEXT_PUBLIC_SITE_URL=https://luisaruiz.xyz
   ```
3. **Sanity schema** — add a `contactInfo` object to `pageInfo` in Sanity Studio (`schemaTypes/pageInfo.js`) with `email`, `phoneNumber`, and `address` fields, then fill in real values in the Studio.
4. **Install deps:** `cd "02 Build" && npm install`.
5. Continue from **Run** above.
