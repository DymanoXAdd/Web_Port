---
title: SOP - Replace Old Vercel Build with New Build
type: sop
status: draft
created: 2026-07-21
author: Claude (C)
tags: [sop, draft, vercel, deploy, portfolio-website]
---

# SOP: Replace the Old Vercel Build with the New Build

**Purpose:** Get the new portfolio build (`02 Build/`, Next.js 14 App Router) live on Vercel *in place of* the old build that's already running there — keeping the same project and the `luisaruiz.xyz` domain attached, so there are no DNS changes and no downtime. Use this when the old build is live and you want the new one to take over the same URL.

> **Core principle:** Reuse the *existing* Vercel project. Don't spin up a new one — a new project means re-attaching the domain and touching DNS. Instead, re-point the existing project at the new code, migrate the env vars, and redeploy.

## Prerequisites
- [ ] Access to the Vercel dashboard (the account the old build lives in).
- [ ] Know **how the old build reaches Vercel** — this decides which path you follow:
  - **Path A — Git-connected** (Vercel auto-deploys from a GitHub/GitLab repo). Most common.
  - **Path B — CLI/manual** (`vercel` CLI or drag-and-drop deploys, no git).
  - ⚠️ This folder (`portfolio-website/`) is **not currently a git repo** (`git remote` returns nothing). So the old build is either pointed at a *different* repo, or was pushed via the CLI. **Confirm this first** — it changes everything below.
- [ ] The env var values ready (see Step 3). Grab them from `02 Build/.env.local` — do **not** commit that file.
- [ ] A local green build as a smoke test: from `02 Build/` run `npm install` then `npm run build`. If it fails locally, it fails on Vercel — fix before deploying.

## Steps

### 1. Confirm the current Vercel project + how it deploys
1. [ ] Vercel dashboard → open the existing portfolio project.
2. [ ] **Settings → Git**: is a repo connected?
   - Connected → **Path A**.
   - Not connected → **Path B**.
3. [ ] **Settings → Domains**: confirm `luisaruiz.xyz` is listed here. This is the project you want to keep — do NOT delete it.

### 2. Point the project at the new code (`02 Build/`)

**Path A — Git-connected (recommended long-term):**
1. [ ] Decide the source of truth. The new code needs to live in the git repo Vercel watches. Options:
   - Push the new build into the connected repo (replace the old code on the deploy branch), **or**
   - Repoint Vercel to a new/different repo: Settings → Git → Disconnect, then Connect the correct repo.
2. [ ] **Settings → Build & Deployment → Root Directory**: set it to the folder that contains the Next.js app. If the repo root *is* the app, leave blank; if the app sits under `02 Build/`, set Root Directory to `02 Build`. ⚠️ This is the #1 thing that breaks — the old build may have a different root.
3. [ ] **Framework Preset:** Next.js. **Build Command:** `next build` (default). **Output:** leave default (Next.js manages it). **Install Command:** `npm install` (default).
4. [ ] Node version: Settings → General → Node.js Version → 18.x or 20.x (Next 14 needs 18+).

**Path B — CLI/manual:**
1. [ ] Install/login: `npm i -g vercel` then `vercel login`.
2. [ ] From inside `02 Build/`, run `vercel link` and select the **existing** project (do not create new).
3. [ ] Confirm Root Directory in the project settings is correct for how you're deploying (from inside `02 Build/`, root is `.`).

### 3. Migrate / set Environment Variables (Production)
Set each of these in **Settings → Environment Variables**, scoped to **Production** (add Preview too if you want test deploys to work). Pull values from `02 Build/.env.local`:

- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] `NEXT_PUBLIC_SANITY_DATASET` (e.g. `production`)
- [ ] `NEXT_PUBLIC_SANITY_API_VERSION` (e.g. `2025-11-20`)
- [ ] `RESEND_API_KEY`  ← contact form email
- [ ] `RECIPIENT_EMAIL` ← where contact submissions land
- [ ] `REVALIDATE_SECRET` ← Sanity webhook revalidation
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://luisaruiz.xyz`
- [ ] *(if used)* `SANITY_API_READ_TOKEN`

⚠️ **Env vars bind at build time.** If you add/change any of these, you must trigger a fresh deploy afterward — an existing running deployment will NOT pick them up.

### 4. Trigger the Production deploy
- **Path A:** push to the production branch (usually `main`) → Vercel auto-builds. Or Dashboard → Deployments → **Redeploy**.
- **Path B:** from `02 Build/` run `vercel --prod`.

### 5. Verify the deploy
1. [ ] Watch the **build logs** in Vercel → Deployments → (latest). Confirm it compiles (6 pages expected) with no errors.
2. [ ] Once it shows **Ready**, open the deployment's `*.vercel.app` preview URL first and click through: hero video, sections, Projects, Skills, contact form renders.
3. [ ] Confirm this new deployment is marked **Production** (the one the domain serves).

### 6. Re-point / confirm the custom domain
1. [ ] Settings → Domains: `luisaruiz.xyz` should already point at this project — since you reused it, **no DNS change needed**.
2. [ ] If you (against recommendation) made a *new* project instead: remove `luisaruiz.xyz` from the old project, add it to the new one, and let Vercel verify. Old project can then be paused/deleted.
3. [ ] Load `https://luisaruiz.xyz` in an incognito window → confirm the **new** build is what shows (hard-refresh to dodge cache).

### 7. Related blocker — contact form email (separate task)
- [ ] The contact form still won't deliver until the **Resend sender domain `luisaruiz.xyz` is Verified** (sender is hardcoded `noreply@luisaruiz.xyz` in `02 Build/lib/email.ts`). This is a *separate* DNS/Resend job — see `(C) DEPLOY CHECKLIST.md`. The site can go live before this is done; only the email delivery depends on it.

## Checks / Definition of done
- [ ] `https://luisaruiz.xyz` serves the **new** build (not the old one).
- [ ] Build logs are clean; deployment status = Ready + Production.
- [ ] All Production env vars present; Sanity content loads on the live site.
- [ ] Domain still attached, no DNS surprises, no downtime.
- [ ] (Follow-up) Resend domain verified → live contact-form test delivers.

## Notes & gotchas
- **Reuse the project, don't recreate it.** New project = re-attach domain = DNS = downtime risk. Keep the existing one.
- **Root Directory is the classic trap.** If the new build sits under `02 Build/` and the old one didn't, the deploy will "succeed" but serve the wrong/empty app until you fix the root.
- **Env vars are build-time.** Changing them requires a redeploy to take effect.
- **This folder has no git remote right now.** Before Path A, you must know which repo Vercel watches — otherwise you'll push to the wrong place or think it's connected when it isn't. Confirm in Step 1.
- **Never commit `.env.local`.** Values go into Vercel's env UI, not the repo.
- **Rollback is easy:** Vercel keeps every deployment. If the new build misbehaves, Deployments → old build → **Promote to Production** to instantly revert.
