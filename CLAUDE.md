# portfolio-website

Luis's personal-brand site, live at `luisaruiz.xyz`: who he is, his work, his projects, and a working contact form.

- Type: website · Stage: production · Ponytail level: full
- Stack: Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · framer-motion · Sanity CMS · Resend email · Jest · Vercel

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Test: `npm run test:all` (unit + components + integration)
- Lint / typecheck: `npm run lint` · `npm run type-check`
- Build: `npm run build`

## Where things are

- Tasks and status: `docs/TASKS.md` (read first)
- Intake answers and scope: `docs/BRIEF.md`
- Architecture and data model: `docs/ARCHITECTURE.md`
- Decisions and their reasons: `docs/DECISIONS.md`
- Deploy, monitoring, rollback, incidents: `docs/RUNBOOK.md`
- Code map: `graphify-out/GRAPH_REPORT.md` (query with `graphify query`)
- Last session's state: `.claude/session-handoff.md`
- Old vault notes, run logs, design concepts: `docs/reference/vault/` (read-only history)

## Rules for this project

- Branch per task: `task/T-###-short-name`. One task per pull request, under
  400 changed lines where possible.
- A task is done when: type-check, lint, `test:all` and `build` are green, a test
  covers the change, the result is checked in `npm run dev`, and `docs/TASKS.md`
  plus the registry row are updated.
- `(C)` prefix on every new note or doc Claude creates. Ask before editing any
  file Luis wrote by hand.
- Build-loop agents live in `.claude/agents/` (orchestrator → builder → checker,
  5-cycle cap). Run the orchestrator only when Luis says go.
- Be blunt and give one clear path, not a menu of options.

## Approval gates for this project

Luis decided 2026-11-12: Claude handles git, GitHub and production on its own
(branch, commit, push, PR, merge, deploy) once checks are green. Overrides the
workspace push/merge/release gate for this project only.

Still ask first:
- New features and UI/design changes: show the plan or mockup, wait for yes.
- New dependency, paid service, or new secret (Resend, Sanity tokens).
- Vercel env-var changes, `sanity deploy`, Sanity schema changes.
- Changes to `app/api/**` (email and revalidate endpoints), rate limiting, or validation.
- Never force-push; never skip checks to ship.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
