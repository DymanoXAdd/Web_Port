# Graph Report - portfolio-website  (2026-11-12)

## Corpus Check
- 77 files · ~29,303 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .graphify-bak 1, .css 1)

## Summary
- 591 nodes · 813 edges · 55 communities (37 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5612011d`
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
- next
- package.json
- scripts
- Orchestrator Agent
- Runbook — portfolio-website
- manifest.json
- Builder Agent
- Checker Agent
- Architecture — portfolio-website
- Tasks — portfolio-website
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
- Skills.tsx
- frontend.md
- security.md
- testing.md
- react-dom@^18.3.0
- react
- Projects.tsx
- types/index.ts
- eslint-config-next@^14.2.0
- tailwindcss@^3.4.1
- WorkExperience.tsx
- ErrorBoundary
- @testing-library/react
- @testing-library/jest-dom
- react-hook-form
- react-social-icons@^5.15.0
- eslint@^8.55.0

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 19 edges
2. `react` - 18 edges
3. `Brief — portfolio-website` - 16 edges
4. `Portfolio Website Rebuild - Complete Implementation` - 13 edges
5. `urlFor()` - 11 edges
6. `Implementation Status - Portfolio Rebuild` - 11 edges
7. `scripts` - 11 edges
8. `sanity` - 11 edges
9. `Home()` - 10 edges
10. `expect()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `ErrorBoundary`  [EXTRACTED]
  app/page.tsx → components/ui/ErrorBoundary.tsx
- `Home()` --calls--> `Header()`  [EXTRACTED]
  app/page.tsx → components/sections/Header.tsx
- `Home()` --calls--> `Hero()`  [EXTRACTED]
  app/page.tsx → components/sections/Hero.tsx
- `Home()` --calls--> `Projects()`  [EXTRACTED]
  app/page.tsx → components/sections/Projects.tsx
- `Home()` --calls--> `Skills()`  [EXTRACTED]
  app/page.tsx → components/sections/Skills.tsx

## Import Cycles
- None detected.

## Communities (55 total, 18 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.24
Nodes (12): getPortfolioData(), Home(), metadata, revalidate, About(), ContactMe(), experienceQuery, pageInfoQuery (+4 more)

### Community 1 - "Implementation Status - Portfolio Rebuild"
Cohesion: 0.05
Nodes (42): 1. Copy Files to Root, 2. Set Environment Variables, 3. Install Dependencies, 4. Test Locally, 5. Update Sanity Schema, 6. Get Resend API Key, 7. Deploy to Vercel, Architecture (+34 more)

### Community 2 - "animations.ts"
Cohesion: 0.12
Nodes (18): Props, Props, containerVariants, fadeInLeft, fadeInRight, fadeInUp, float, itemVariants (+10 more)

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
Cohesion: 0.20
Nodes (13): checkRateLimit(), getClientIp(), POST(), rateLimitStore, emailTemplate(), escapeHtml(), resend(), sendConfirmationEmail() (+5 more)

### Community 9 - "How to Run & Test the Portfolio Site"
Cohesion: 0.10
Nodes (20): 10. Verify live + point domain, 1. Start the local dev server, 2. Security unit tests (Python — quick, no dev server needed), 3. Integration tests (need the dev server running), 4. TypeScript type check, 5. Linter, 6. Manual contact-form test, 7. Production build (must pass with 0 errors before deploy) (+12 more)

### Community 10 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @hookform/resolvers@^3.3.4, react@^18.3.0, react-simple-typewriter@^4.0.5, resend@^3.0.0, sanity@^3.99.0, @sanity/icons@^2.11.8, @sanity/image-url@^2.1.1 (+12 more)

### Community 11 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer@^10.4.16, identity-obj-proxy@^3.0.0, jest@^29.7.0, jest-environment-jsdom@^29.7.0, postcss@^8.4.32, @types/jest@^29.5.11, @types/node@^20.10.0 (+11 more)

### Community 12 - "Brief — portfolio-website"
Cohesion: 0.12
Nodes (16): 10. Database, 11. CI/CD, environments, rollback, 12. Performance, accessibility, SEO, 13. Privacy and compliance, 14. Cost and context budget, 15. Definition of done and release criteria, 1. Identity and scope, 2. Architecture specifications (+8 more)

### Community 13 - "next"
Cohesion: 0.17
Nodes (8): ALLOWED_PATHS, isAllowedPath(), POST(), metadata, next@^14.2.0, @vercel/analytics@^1.2.2, next, @vercel/analytics

### Community 14 - "package.json"
Cohesion: 0.17
Nodes (11): @heroicons/react@^2.0.18, @testing-library/user-event@^14.6.1, ts-jest@^29.1.2, @types/react-dom@^18.3.0, name, private, version, @heroicons/react (+3 more)

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

### Community 22 - "Tasks — portfolio-website"
Cohesion: 0.25
Nodes (7): Blocked or waiting on a human, Debt (from `/ponytail-debt`), Done, Next, Now, Open decisions from intake, Tasks — portfolio-website

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
Cohesion: 0.50
Nodes (3): D-001 — 2026-11-11 — Initial stack and setup (imported), D-002 — 2026-11-12 — Delivery workflow, monitoring and scanning, Decisions — portfolio-website

### Community 33 - "Skills.tsx"
Cohesion: 0.17
Nodes (12): containerVariants, Props, Skills(), cardVariants, Props, SkillComponent(), useCountUp(), framer-motion@^10.16.0 (+4 more)

### Community 40 - "react"
Cohesion: 0.21
Nodes (8): Header(), NAV_LINKS, Props, Hero(), Props, useTypewriter(), react, mockPageInfo

### Community 41 - "Projects.tsx"
Cohesion: 0.20
Nodes (10): CardProps, ProjectCard(), handleKeyDown(), openLink(), Projects(), Props, restRotation(), makeProject() (+2 more)

### Community 42 - "types/index.ts"
Cohesion: 0.28
Nodes (10): mockImage, ContactInfo, Experience, Image, PageInfo, Project, SanityBody, Skill (+2 more)

### Community 48 - "WorkExperience.tsx"
Cohesion: 0.27
Nodes (9): ExperienceCard(), Props, Props, WorkExperience(), hoverScale, tapScale, builder, client (+1 more)

### Community 49 - "ErrorBoundary"
Cohesion: 0.25
Nodes (3): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState

### Community 50 - "@testing-library/react"
Cohesion: 0.29
Nodes (3): @testing-library/react@^14.3.1, @testing-library/react, threeExperiences

## Knowledge Gaps
- **1 isolated node(s):** `next/core-web-vitals`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 342 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Skills.tsx`, `animations.ts`, `Projects.tsx`, `dependencies`, `types/index.ts`, `package.json`, `WorkExperience.tsx`, `ErrorBoundary`, `@testing-library/react`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Implementation Status - Portfolio Rebuild` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ContactMe.tsx`, `app/page.tsx`, `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `animations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._
- **Why does `sanity` connect `schemaTypes/index.ts` to `dependencies`, `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `Portfolio Website Rebuild - Complete Implementation` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._