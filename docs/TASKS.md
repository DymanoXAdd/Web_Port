# Tasks — portfolio-website

Stage: production · Updated: 2026-11-15

<!-- IDs never get reused. "Now" holds at most 3 tasks. When a task changes state,
     update the registry row in the workspace CLAUDE.md in the same turn. -->

## Now
- [ ] T-034 `/minecraft` player table (Luis asked, 2026-11-16): table under the count lists players online with their skin heads (minotar.net via `next/image`; mc-heads.net refuses Vercel's image fetcher, so the CSP stays `img-src 'self'`). Names and UUIDs come from the ping's player sample (vanilla: up to 12); UUIDs are format-checked before going into the image URL. Test: `__tests__/unit/minecraft.test.ts`. Waiting on Luis to check the preview. Later: player stats and leaderboard (needs data from the server itself, e.g. a plugin)

## Shipped 2026-11-16
- [x] T-033 `/minecraft` page (Luis yes): original pixel grass-block icon after "skills" in the nav (desktop + phone menu) links to `/minecraft`; floating block, "Orbis", Online/Offline and players online / max for the Java server in `MC_SERVER_ADDRESS` (Vercel Production + Preview). Status from mcstatus.io on the server, cached 30 s; any failure shows Offline and logs why. The address is trimmed (the first Vercel value ended in `\r\n` and mcstatus.io answered 400). Nav links now `/#…`. Luis checked the preview; merged as PR #39

## Shipped 2026-11-15
- [x] T-031 Sentry source maps (D-007): Luis added `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` (`luis-ruiz`), `SENTRY_PROJECT` to Vercel Production and redeployed without cache. Production chunks carry `_sentryDebugIds` (previous deploy had none), no public `sourceMappingURL`; Sentry shows two uploads (1290 + 924 files) for release `5d166a8`, confirmed by Luis
- [x] T-031 (part) Uninstalled unused `@heroicons/react` (Luis yes). Vercel protection-bypass secret kept on purpose: Luis wants Claude able to check preview/production with `vercel curl`
- [x] T-032 Skills count-up hydration mismatch (React #418) for reduced-motion visitors fixed: `Skill.tsx` applies reduced motion only after hydration (`useSyncExternalStore` flag), so the first client render matches the server's 0%. Test: `Skills.test.tsx` "hydrates server HTML with reduced motion and no mismatch" (fails on the old code). Browser check: no #418 with reduced motion
- [x] T-028 steps 1–4 (major upgrades) — Luis said yes to the plan below (2026-11-15). Step 1 done: Next 15.5 + React 19.3 (framer-motion 12, @sanity/icons 3, @testing-library/react 16, @types/react 19, eslint-config-next 15; dropped `instrumentationHook`), all checks green, preview OK'd by Luis, merged as PR #30 (2026-11-15). Step 2 (2026-11-15) on `task/T-028-sanity-upgrade`: Sanity 3.99 → 4.22, `@sanity/vision` 4.22, `next-sanity` 9 → 11. Not 5/6: Sanity 5+ imports `useEffectEvent` from React, which Next 15's bundled React lacks (build fails), and Sanity 6 needs next-sanity 13, which needs Next 16. No schema changes. Luis checked `/studio` on the preview; merged as PR #32 (2026-11-15). Step 3 (2026-11-15) on `task/T-028-next16-sanity6`: Next 16.4 (Turbopack), Sanity/vision 6.23, next-sanity 13.4, ESLint 9 + `eslint-config-next` 16 with flat `eslint.config.mjs` (lint script `eslint app components lib`, same folders `next lint` checked); `Skill.tsx` count-up no longer sets state inside an effect (new react-hooks rule); CI Node 20 → 22 (Sanity 6 needs ≥22.12; Vercel already 22.x). No schema changes. Luis checked preview + `/studio`; merged as PR #33 (2026-11-15). Step 4 (2026-11-15) on `task/T-028-tailwind4`: Tailwind 4.3 via `@tailwindcss/upgrade` (colors/fonts in `@theme` in `globals.css`, `tailwind.config.js` deleted, PostCSS uses `@tailwindcss/postcss`, autoprefixer removed, renamed utilities in 5 components); `tailwind-scrollbar` removed (unused); `next/font` mono variable renamed `--font-jetbrains` (Tailwind 4 owns `--font-mono`, the tool's output referenced itself); v3 pointer cursor on buttons kept. Gate green incl. E2E 8; screenshots desktop + phone match. Luis checked the preview; merged as PR #34, production Ready (2026-11-15).

## Next

## Blocked or waiting on a human
- [ ] T-028 step 5, TypeScript 7: blocked upstream. ts-jest 29.4.15 (latest) peers `typescript >=4.3 <7` (checked 2026-11-15). Stay on 5.9; recheck when ts-jest ships TS 7 support. Steps 1–4 shipped (PRs #30, #32, #33, #34).

## T-028 plan (approved 2026-11-15)
Each its own migration (Dependabot PRs #17–#20 all fail CI): Next 14→16 with eslint-config-next 16, Tailwind 3→4, TypeScript 5→7, Sanity 3→6 (@sanity/vision). One PR per step, each previewed before merge:
  1. Next 14 → 15 + React 19 together (Next 15 needs React 19): `@types/react` 19, `@testing-library/react` 16, framer-motion to a React-19 version, eslint-config-next 15. Code risk is low: no `cookies()`/`headers()` use; route handlers only read `request.nextUrl`/headers.
  2. Sanity 3 → current (needs React 19 from step 1): `sanity`, `@sanity/vision`, `next-sanity` together; check `/studio` loads and the 4 new Page Info fields still save.
  3. Next 15 → 16, plus Sanity 4 → 6 and next-sanity 11 → 13 (they need Next 16; see step 2 note): `next lint` is gone (switch the lint script to the ESLint CLI with a flat config); Turbopack becomes the default bundler.
  4. Tailwind 3 → 4: run the official upgrade tool, move `tailwind.config.js` colors into CSS `@theme`, swap `tailwind-scrollbar` for a v4-compatible version or drop it (the redesign barely uses it). Biggest visual risk: check every section on the preview.
  5. TypeScript 7 last, only once ts-jest and Next support it; until then stay on 5.9.

## Open decisions from intake
- _none — all settled 2026-11-12 (see BRIEF, D-002)_

## Debt (from `/ponytail-debt`)

## Done
- [x] T-030 Sentry uptime monitor for https://luisaruiz.xyz created by Luis (2026-11-13)
- [x] T-029 Fonts committed in `app/fonts/` (Inter + JetBrains Mono, latin, variable, OFL), loaded with `next/font/local`; `next/font/google` had failed two Vercel builds (2026-11-12, PR #25)
- [x] T-011 Concept A "Query" redesign in green live after Luis OK'd the preview (2026-11-12, PR #24, D-005). Mockups: https://claude.ai/artifact/VU24MPJApXdTfTCoxrvFDQ
- [x] T-004 Sentry error monitoring live (D-006): browser, server, ErrorBoundary and email-route errors; `/monitoring` tunnel; DSN in Vercel prod + preview. Verified locally: a caught email-API error was reported and a test event through the tunnel was accepted (2026-11-12). Uptime check split out as T-030
- [x] T-012 Playwright E2E for the contact form (`e2e/contact.spec.ts`, desktop + phone): validation, success, HTML error page, server error; `/api/email` intercepted so no mail is sent; runs in CI (2026-11-12, Luis approved adding Playwright)
- [x] Dependabot #16 (minor/patch) and #15 (Actions) merged after re-running CI on current main; #17–#20 (majors) closed, tracked as T-028 (2026-11-12)
- [x] T-010 Contact form shows "Your message is emailed to Luis and not stored." under Submit (small grey text, AA contrast). Luis approved (2026-11-12)
- [x] T-006 The 4 plain `<img>` (Projects ×2, WorkExperience peek, Skill) use `next/image` (missing Sanity image keeps a same-size blank); `lib/sanity.ts` uses `createImageUrlBuilder`. Lint now 0 warnings, build deprecation warning gone. Not covered: `motion.img` in About and ExperienceCard still load straight from the Sanity CDN. Luis approved (2026-11-12)
- [x] T-009 Dropped by Luis (2026-11-12): Claude ships PRs itself and CI (T-003) gates every PR, so a one-command deploy script is no longer needed
- [x] T-005 `.github/dependabot.yml` (npm minor/patch grouped weekly, majors separate; actions grouped weekly) + `.github/workflows/gitleaks.yml` on every PR and push to main (2026-11-12)
- [x] T-003 `.github/workflows/ci.yml`: type-check, lint, unit, components, build, then integration against `next start` with a dummy Resend key, on every PR and push to main (2026-11-12)
- [x] T-025 Site CSP has `'unsafe-eval'` only in dev (Studio CSP keeps it; home-page chunks scanned: no eval/new Function); dropped `X-XSS-Protection` and `X-DNS-Prefetch-Control`; revalidate allowlist is `/` only (2026-11-12)
- [x] T-024 One `metadata` block, in `app/layout.tsx`, holding the values that were live (page's title/description/keywords); `app/page.tsx` copy deleted (2026-11-12). Test: integration "home page has the one site title and description"
- [x] T-023 Project cards: card is no longer a `role="button"`; the "View Project" link is the only control (Tab reaches it and lifts the card); card body click opens nothing; no link in Sanity means no button. Hover/tilt unchanged. Plan approved by Luis (2026-11-12)
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
