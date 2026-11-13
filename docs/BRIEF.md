# Brief — portfolio-website

Created 2026-11-11 by `/new-project`, imported from `Luis Second Brain/03 Projects/portfolio-website/`.
Answers come from the existing project files. Open items were settled by Luis on 2026-11-12.

**Status: approved by Luis, 2026-11-12 (T-001).**

## 1. Identity and scope
- Goal: a public "this is me" home base: who Luis is, his work (SQL/data programmer), his projects, contact.
- Users: recruiters, collaborators, anyone Luis sends the link to.
- Success looks like: live and public on a real domain with a working contact form. **Met 2026-07-21** (`luisaruiz.xyz`).
- Out of scope: blog, visitor accounts, e-commerce.
- Deadline or milestones: none; shipped. Further work is optional polish from the task list.
- Starting point: existing code, in production. Repo `github.com/DymanoXAdd/Web_Port`.

## 2. Architecture specifications
- Single Next.js 14 app (App Router) with an embedded Sanity Studio at `/studio`.
- Content from Sanity (pageInfo, experience, project, skill, social). Contact via Resend from `noreply@luisaruiz.xyz`.
- API routes: `app/api/email` (contact form, zod validation, rate limit) and `app/api/revalidate` (Sanity webhook).
- Hosted on Vercel with Vercel Analytics. Scale: personal site, low traffic.

## 3. Current documentation
- Vault notes, run logs, deploy checklist and SOPs: `docs/reference/vault/`. Old project context: `docs/reference/legacy-CLAUDE.md`.
- `(C) HOW-TO-RUN-AND-TEST.md`, `(C) IMPLEMENTATION_STATUS.md`, `(C) REBUILD_NOTES.md` live in the repo root.
- Code wins when notes disagree. Versions: `package.json` (Next 14.2, React 18.3, Sanity 3.99).
- `10 Original Files/` (the pre-rebuild site) stays in the vault as read-only reference.

## 4. Design
- Current look: hero video, typewriter, tilt-peek project stack, cascade/count-up skills (concepts in `docs/reference/vault/`).
- Tailwind + framer-motion, no component library. `prefers-reduced-motion` respected.
- Design process for new screens and the redesign: 2–3 plain HTML mockups first, Luis picks one, then it is built in Tailwind + framer-motion. **decided 2026-11-12**
- Breakpoints / dark mode: **default** (mobile-first 375/768/1280; no dark mode, the theme toggle was removed 2026-06-29).

## 5. Human approval gates
- Workspace list plus Vercel deploys/env vars, Sanity deploy/schema, and `app/api/**` changes.
- Approver: Luis. Plan first for more than 3 files (**default**).

## 6. Automated tests
- Jest: unit (validation, rate limit, email security), components (Testing Library), integration (API security). Last baseline 2026-07-15: 35 + 47 + 24 green.
- End-to-end: one Playwright contact-flow test, added after the redesign so it is written once. **decided 2026-11-12**
- CI: GitHub Actions runs lint, type-check, test:all and build on every PR. **decided 2026-11-12**

## 7. Error monitoring and observability
- Today: Vercel Analytics and function logs. Adding Sentry (free tier) for errors plus one free uptime check on the home page. Sentry dependency and DSN secret approved in principle. **decided 2026-11-12**

## 8. Security and secrets
- No visitor auth. Sanity Studio is behind Sanity login.
- Secrets: `RESEND_API_KEY` and Sanity values, in Vercel env vars and a local `.env.local` (not copied; Claude never reads it).
- Contact endpoint has zod validation, rate limiting and header-injection tests.
- Dependency and secret scanning: Dependabot (weekly, grouped) + gitleaks on every PR. **decided 2026-11-12**

## 9. Pull requests and git workflow
- GitHub. History shows direct commits to the default branch.
- `task/T-###-short-name` branches, about 400 lines max, Conventional Commits. `npm run deploy` (Luis runs it, never Claude) runs the checks, pushes, opens a PR and squash-merges; Vercel then ships production. **decided 2026-11-12**

## 10. Database
- Not applicable. Sanity is the content store; schema in `sanity/schemaTypes/`.

## 11. CI/CD, environments, rollback
- Vercel: production on push to the default branch, preview deployments for other branches. Rollback = promote a previous deployment.
- CI (GitHub Actions: lint, type-check, test:all, build): decided, not set up yet (T-003).

## 12. Performance, accessibility, SEO
- Targets (confirmed 2026-11-12): LCP < 2.5 s, INP < 200 ms, CLS < 0.1, WCAG 2.2 AA, last two versions of major browsers. If the remote hero video breaks LCP, self-host a compressed copy with a poster image.
- robots.txt, manifest and openGraph exist. Known lint warning: `<img>` in `Projects.tsx`.

## 13. Privacy and compliance
- Contact form emails name, address and message; nothing is stored. Privacy line on the form: one short line, e.g. "Your message is emailed to Luis and not stored." **decided 2026-11-12**

## 14. Cost and context budget
- Ponytail `full`. Graphify soft nudges, code and docs.
- Vercel, Sanity and Resend on free tiers; any paid upgrade needs approval.

## 15. Definition of done and release criteria
- Done: see `CLAUDE.md`. Release = merge to the default branch → Vercel production. Owner: Luis.
