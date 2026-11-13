# Graph Report - portfolio-website  (2026-11-12)

## Corpus Check
- 78 files · ~29,929 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .graphify-bak 1, .css 1)

## Summary
- 595 nodes · 818 edges · 48 communities (29 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5c20650`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/page.tsx
- Implementation Status - Portfolio Rebuild
- animations.ts
- Portfolio Website Rebuild - Complete Implementation
- run-tests.py
- Session Handoff — 2026-06-26 (PM)
- schemaTypes/index.ts
- compilerOptions
- ContactMe.tsx
- How to Run & Test the Portfolio Site
- dependencies
- devDependencies
- Brief — portfolio-website
- @testing-library/react
- package.json
- scripts
- Orchestrator Agent
- Runbook — portfolio-website
- manifest.json
- Builder Agent
- Checker Agent
- Architecture — portfolio-website
- ErrorBoundary
- portfolio-website
- jest
- rate-limit.test.ts
- [[...tool]]/page.tsx
- pull_request_template.md
- constants.ts
- Checker Baseline — Known Pre-Existing Failures
- next.config.js
- Decisions — portfolio-website
- .eslintrc.json
- @testing-library/jest-dom
- frontend.md
- security.md
- testing.md
- jest@^29.7.0
- @heroicons/react
- @sanity/image-url
- eslint-config-next@^14.2.0
- jest-environment-jsdom@^29.7.0
- ts-jest@^29.1.2

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 19 edges
2. `react` - 18 edges
3. `Brief — portfolio-website` - 16 edges
4. `imageUrl()` - 13 edges
5. `Portfolio Website Rebuild - Complete Implementation` - 13 edges
6. `Implementation Status - Portfolio Rebuild` - 11 edges
7. `scripts` - 11 edges
8. `sanity` - 11 edges
9. `Home()` - 10 edges
10. `expect()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Done` --references--> `imageUrl()`  [INFERRED]
  docs/TASKS.md → lib/sanity.ts
- `Next` --references--> `ErrorBoundary`  [INFERRED]
  docs/TASKS.md → components/ui/ErrorBoundary.tsx
- `Home()` --calls--> `ErrorBoundary`  [EXTRACTED]
  app/page.tsx → components/ui/ErrorBoundary.tsx
- `getPortfolioData()` --calls--> `sanityFetch()`  [EXTRACTED]
  app/page.tsx → lib/sanity.ts
- `Home()` --calls--> `About()`  [EXTRACTED]
  app/page.tsx → components/sections/About.tsx

## Import Cycles
- None detected.

## Communities (48 total, 19 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.05
Nodes (62): getPortfolioData(), Home(), metadata, revalidate, ExperienceCard(), Props, About(), ContactMe() (+54 more)

### Community 1 - "Implementation Status - Portfolio Rebuild"
Cohesion: 0.05
Nodes (42): 1. Copy Files to Root, 2. Set Environment Variables, 3. Install Dependencies, 4. Test Locally, 5. Update Sanity Schema, 6. Get Resend API Key, 7. Deploy to Vercel, Architecture (+34 more)

### Community 2 - "animations.ts"
Cohesion: 0.13
Nodes (17): Props, containerVariants, fadeInLeft, fadeInRight, fadeInUp, float, itemVariants, itemVariantsLeft (+9 more)

### Community 3 - "Portfolio Website Rebuild - Complete Implementation"
Cohesion: 0.05
Nodes (36): 1. Install Dependencies, 2. Environment Variables, 3. Get Resend API Key, 4. Update Sanity Schema, 5. Run Locally, 6. Test Everything, ✅ Components Enhanced, 📧 Contact Form (+28 more)

### Community 4 - "run-tests.py"
Cohesion: 0.08
Nodes (16): check_rate_limit(), escape_html(), expect(), get_client_ip(), is_allowed_path(), make_store(), _no_first_entry(), _rl_block() (+8 more)

### Community 5 - "Session Handoff — 2026-06-26 (PM)"
Cohesion: 0.06
Nodes (32): Also done this session (no loop run), Current Goal, 📋 Deploy checklist created → `(C) DEPLOY CHECKLIST.md` (project root), Deploy status — code side DONE, 1 blocker left (USER-ONLY), Deploy status — UNCHANGED from 2026-06-29: code side DONE, 1 blocker left (USER-ONLY), Done this session, Next Step, Next Step / state of `(C) TASK.md` (+24 more)

### Community 6 - "schemaTypes/index.ts"
Cohesion: 0.17
Nodes (12): sanity, @sanity/icons, apiVersion, dataset, projectId, experienceType, schema, pageInfoType (+4 more)

### Community 7 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, jsxImportSource (+13 more)

### Community 8 - "ContactMe.tsx"
Cohesion: 0.09
Nodes (21): checkRateLimit(), getClientIp(), POST(), rateLimitStore, ALLOWED_PATHS, isAllowedPath(), POST(), metadata (+13 more)

### Community 9 - "How to Run & Test the Portfolio Site"
Cohesion: 0.10
Nodes (20): 10. Verify live + point domain, 1. Start the local dev server, 2. Security unit tests (Python — quick, no dev server needed), 3. Integration tests (need the dev server running), 4. TypeScript type check, 5. Linter, 6. Manual contact-form test, 7. Production build (must pass with 0 errors before deploy) (+12 more)

### Community 10 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @hookform/resolvers@^3.3.4, next@^14.2.0, react@^18.3.0, react-hook-form@^7.50.0, react-simple-typewriter@^4.0.5, resend@^3.0.0, sanity@^3.99.0 (+13 more)

### Community 11 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer@^10.4.16, eslint@^8.55.0, identity-obj-proxy@^3.0.0, postcss@^8.4.32, tailwindcss@^3.4.1, @testing-library/user-event@^14.6.1, @types/jest@^29.5.11 (+11 more)

### Community 12 - "Brief — portfolio-website"
Cohesion: 0.12
Nodes (16): 10. Database, 11. CI/CD, environments, rollback, 12. Performance, accessibility, SEO, 13. Privacy and compliance, 14. Cost and context budget, 15. Definition of done and release criteria, 1. Identity and scope, 2. Architecture specifications (+8 more)

### Community 14 - "package.json"
Cohesion: 0.17
Nodes (11): react-dom@^18.3.0, react-social-icons@^5.15.0, @types/node@^20.10.0, typescript@^5.3.3, name, private, version, react-dom (+3 more)

### Community 15 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, start, test, test:all, test:components (+3 more)

### Community 16 - "Orchestrator Agent"
Cohesion: 0.20
Nodes (9): Baseline awareness, Final report back to the user, Inputs, Logging — always write a file, pass or stall, Non-`(C)` file edits — needs Luis's sign-off, not silent approval, Orchestrator Agent, Rules, The loop — run this for EACH task/feature in `(C) TASK.md` (+1 more)

### Community 17 - "Runbook — portfolio-website"
Cohesion: 0.20
Nodes (9): Database, Deploy, Environments, Incidents, Monitoring, Production readiness checklist, Rollback, Runbook — portfolio-website (+1 more)

### Community 18 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 19 - "Builder Agent"
Cohesion: 0.22
Nodes (8): Builder Agent, How you work, Non-`(C)` file rule — HARD STOP, no exceptions, Tech stack, Tunnel-vision guard, What you receive from the Orchestrator, What you report back to the Orchestrator, Working directory

### Community 20 - "Checker Agent"
Cohesion: 0.22
Nodes (8): Checker Agent, Newly-passing baseline entries, Step 0 — Read the baseline FIRST, Test coverage note, The check sequence (run all, in this order), Verdict rules (baseline-aware), What you report back to the Orchestrator, Working directory

### Community 21 - "Architecture — portfolio-website"
Cohesion: 0.22
Nodes (8): Architecture — portfolio-website, Components and boundaries, Constraints and known risks, Context, Data model, External services and API contracts, Non-functional targets, Stack

### Community 22 - "ErrorBoundary"
Cohesion: 0.12
Nodes (10): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, Blocked or waiting on a human, Debt (from `/ponytail-debt`), Done, Next, Now (+2 more)

### Community 23 - "portfolio-website"
Cohesion: 0.29
Nodes (6): Approval gates for this project, Commands, graphify, portfolio-website, Rules for this project, Where things are

### Community 24 - "jest"
Cohesion: 0.29
Nodes (3): config, config, config

### Community 26 - "[[...tool]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@^9.0.0, next-sanity

### Community 27 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): Checklist, How to check it, Risks and follow-ups, What and why

### Community 28 - "constants.ts"
Cohesion: 0.40
Nodes (4): ANIMATION_DURATION, COLORS, SECTIONS, SOCIAL_LINKS

### Community 29 - "Checker Baseline — Known Pre-Existing Failures"
Cohesion: 0.50
Nodes (3): Checker Baseline — Known Pre-Existing Failures, Known failures (do NOT block a task's verdict), Notes

### Community 31 - "Decisions — portfolio-website"
Cohesion: 0.33
Nodes (5): D-001 — 2026-11-11 — Initial stack and setup (imported), D-002 — 2026-11-12 — Delivery workflow, monitoring and scanning, D-003 — 2026-11-12 — Vercel Bot Protection: Challenge → Log, D-004 — 2026-11-12 — DNS moves from Cloudflare to Vercel, Decisions — portfolio-website

## Knowledge Gaps
- **1 isolated node(s):** `next/core-web-vitals`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 343 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `app/page.tsx` to `animations.ts`, `ContactMe.tsx`, `dependencies`, `package.json`, `ErrorBoundary`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.052659716653301256 - nodes in this community are weakly interconnected._
- **Why does `next` connect `ContactMe.tsx` to `app/page.tsx`, `dependencies`, `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `Implementation Status - Portfolio Rebuild` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Why does `sanity` connect `schemaTypes/index.ts` to `dependencies`, `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `animations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._