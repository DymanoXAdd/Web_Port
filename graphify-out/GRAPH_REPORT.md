# Graph Report - portfolio-website  (2026-11-17)

## Corpus Check
- 99 files · ~38,584 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .woff2 2, .graphify-bak 1)

## Summary
- 759 nodes · 1081 edges · 43 communities (34 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e8f40cc`
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
- email/route.ts
- How to Run & Test the Portfolio Site
- dependencies
- contact.spec.ts
- Brief — portfolio-website
- env
- package.json
- scripts
- Orchestrator Agent
- Runbook — portfolio-website
- manifest.json
- Builder Agent
- Checker Agent
- Architecture — portfolio-website
- eslint-config-next
- portfolio-website
- jest
- gitleaks.yml
- orbis-stats.py
- pull_request_template.md
- [[...tool]]/page.tsx
- Checker Baseline — Known Pre-Existing Failures
- @testing-library/jest-dom
- ErrorBoundary
- minecraft/page.tsx
- ts-jest@^29.4.15
- frontend.md
- security.md
- testing.md
- layout.tsx
- updates

## God Nodes (most connected - your core abstractions)
1. `react` - 19 edges
2. `compilerOptions` - 19 edges
3. `Brief — portfolio-website` - 16 edges
4. `next` - 15 edges
5. `Portfolio Website Rebuild - Complete Implementation` - 13 edges
6. `scripts` - 12 edges
7. `sanity` - 12 edges
8. `Home()` - 11 edges
9. `imageUrl()` - 11 edges
10. `@testing-library/react` - 11 edges

## Surprising Connections (you probably didn't know these)
- `State when this session ended` --references--> `main()`  [INFERRED]
  .claude/session-handoff.md → scripts/orbis-stats.py
- `D-006 — 2026-11-12 — Sentry error monitoring` --references--> `ErrorBoundary`  [INFERRED]
  docs/DECISIONS.md → components/ui/ErrorBoundary.tsx
- `Done` --references--> `ErrorBoundary`  [INFERRED]
  docs/TASKS.md → components/ui/ErrorBoundary.tsx
- `Done` --references--> `imageUrl()`  [INFERRED]
  docs/TASKS.md → lib/sanity.ts
- `Done` --references--> `checkRateLimit()`  [INFERRED]
  docs/TASKS.md → lib/api-guards.ts

## Import Cycles
- None detected.

## Communities (43 total, 9 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.05
Nodes (72): metadata, MinecraftPage(), revalidate, getPortfolioData(), Home(), revalidate, metadata, PrivacyPage() (+64 more)

### Community 1 - "Implementation Status - Portfolio Rebuild"
Cohesion: 0.05
Nodes (42): 1. Copy Files to Root, 2. Set Environment Variables, 3. Install Dependencies, 4. Test Locally, 5. Update Sanity Schema, 6. Get Resend API Key, 7. Deploy to Vercel, Architecture (+34 more)

### Community 2 - "animations.ts"
Cohesion: 0.11
Nodes (18): containerVariants, fadeInLeft, fadeInRight, fadeInUp, float, hoverScale, itemVariants, itemVariantsLeft (+10 more)

### Community 3 - "Portfolio Website Rebuild - Complete Implementation"
Cohesion: 0.05
Nodes (36): 1. Install Dependencies, 2. Environment Variables, 3. Get Resend API Key, 4. Update Sanity Schema, 5. Run Locally, 6. Test Everything, ✅ Components Enhanced, 📧 Contact Form (+28 more)

### Community 4 - "run-tests.py"
Cohesion: 0.09
Nodes (16): check_rate_limit(), escape_html(), expect(), get_client_ip(), is_allowed_path(), make_store(), _no_first_entry(), _rl_block() (+8 more)

### Community 5 - "Session Handoff — 2026-06-26 (PM)"
Cohesion: 0.05
Nodes (42): Also done this session (no loop run), Current Goal, 📋 Deploy checklist created → `(C) DEPLOY CHECKLIST.md` (project root), Deploy status — code side DONE, 1 blocker left (USER-ONLY), Deploy status — UNCHANGED from 2026-06-29: code side DONE, 1 blocker left (USER-ONLY), Done this session, Next Step, Next Step / state of `(C) TASK.md` (+34 more)

### Community 6 - "schemaTypes/index.ts"
Cohesion: 0.13
Nodes (17): sanity@^6.23.0, @sanity/icons@^3.7.4, @sanity/vision@^6.23.0, sanity, @sanity/icons, @sanity/vision, apiVersion, dataset (+9 more)

### Community 7 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, jsxImportSource (+13 more)

### Community 8 - "email/route.ts"
Cohesion: 0.07
Nodes (31): POST(), rateLimitStore, POST(), Blocked or waiting on a human, Debt (from `/ponytail-debt`), Done, Next, Now (+23 more)

### Community 9 - "How to Run & Test the Portfolio Site"
Cohesion: 0.10
Nodes (20): 10. Verify live + point domain, 1. Start the local dev server, 2. Security unit tests (Python — quick, no dev server needed), 3. Integration tests (need the dev server running), 4. TypeScript type check, 5. Linter, 6. Manual contact-form test, 7. Production build (must pass with 0 errors before deploy) (+12 more)

### Community 10 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @hookform/resolvers@^3.3.4, next@^16.4.6, react@^19.3.1, react-dom@^19.3.1, react-hook-form@^7.91.0, resend@^3.0.0, @sanity/image-url@^2.1.1 (+9 more)

### Community 11 - "contact.spec.ts"
Cohesion: 0.22
Nodes (6): field(), fillValidForm(), @axe-core/playwright@^4.14.0, @playwright/test@^1.65.0, @axe-core/playwright, @playwright/test

### Community 12 - "Brief — portfolio-website"
Cohesion: 0.12
Nodes (16): 10. Database, 11. CI/CD, environments, rollback, 12. Performance, accessibility, SEO, 13. Privacy and compliance, 14. Cost and context budget, 15. Definition of done and release criteria, 1. Identity and scope, 2. Architecture specifications (+8 more)

### Community 13 - "env"
Cohesion: 0.07
Nodes (27): env, runs-on, steps, timeout-minutes, concurrency, cancel-in-progress, group, NEXT_PUBLIC_SANITY_DATASET (+19 more)

### Community 14 - "package.json"
Cohesion: 0.08
Nodes (33): devDependencies, eslint@^9.39.0, identity-obj-proxy@^3.0.0, jest@^29.7.0, jest-environment-jsdom@^29.7.0, postcss@^8.5.32, tailwindcss@^4.3.5, @tailwindcss/postcss@^4.3.5 (+25 more)

### Community 15 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, lint, start, test, test:all, test:components (+4 more)

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

### Community 22 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@^16.4.6, eslint-config-next

### Community 23 - "portfolio-website"
Cohesion: 0.29
Nodes (6): Approval gates for this project, Commands, graphify, portfolio-website, Rules for this project, Where things are

### Community 24 - "jest"
Cohesion: 0.29
Nodes (3): config, config, config

### Community 25 - "gitleaks.yml"
Cohesion: 0.11
Nodes (18): GITHUB_TOKEN, runs-on, steps, timeout-minutes, jobs, gitleaks, name, on (+10 more)

### Community 26 - "orbis-stats.py"
Cohesion: 0.11
Nodes (7): build_document(), main(), push(), read_hidden(), summarize(), BuildDocument, OptOut

### Community 27 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): Checklist, How to check it, Risks and follow-ups, What and why

### Community 28 - "[[...tool]]/page.tsx"
Cohesion: 0.40
Nodes (3): dynamic, next-sanity@^13.4.0, next-sanity

### Community 29 - "Checker Baseline — Known Pre-Existing Failures"
Cohesion: 0.50
Nodes (3): Checker Baseline — Known Pre-Existing Failures, Known failures (do NOT block a task's verdict), Notes

### Community 31 - "ErrorBoundary"
Cohesion: 0.06
Nodes (19): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, D-001 — 2026-11-11 — Initial stack and setup (imported), D-002 — 2026-11-12 — Delivery workflow, monitoring and scanning, D-003 — 2026-11-12 — Vercel Bot Protection: Challenge → Log, D-004 — 2026-11-12 — DNS moves from Cloudflare to Vercel, D-005 — 2026-11-12 — Redesign to concept A "Query" + four optional hero fields in Sanity (+11 more)

### Community 32 - "minecraft/page.tsx"
Cohesion: 0.09
Nodes (18): Crown(), Leaderboard(), LeaderboardPlayer, list, minuteNow(), row, StatKey, subscribeMinute() (+10 more)

### Community 39 - "layout.tsx"
Cohesion: 0.25
Nodes (5): inter, metadata, mono, @vercel/analytics@^1.2.2, @vercel/analytics

### Community 42 - "updates"
Cohesion: 0.12
Nodes (15): patterns, actions, npm-minor-patch, dependency-name, update-types, update-types, interval, updates (+7 more)

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `app/page.tsx` to `email/route.ts`, `dependencies`, `package.json`, `layout.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05036630036630037 - nodes in this community are weakly interconnected._
- **Why does `react` connect `app/page.tsx` to `minecraft/page.tsx`, `dependencies`, `package.json`, `ErrorBoundary`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Implementation Status - Portfolio Rebuild` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Why does `@sentry/nextjs` connect `ErrorBoundary` to `email/route.ts`, `package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `animations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Portfolio Website Rebuild - Complete Implementation` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._