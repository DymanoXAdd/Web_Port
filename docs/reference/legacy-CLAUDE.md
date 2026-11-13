# portfolio-website

A personal-brand website — the "this is me" home base. It pulls together who I am, the work I do (Computer Programmer, strong in SQL and data), and the projects I'm building (like Golbris). Not aimed at a single narrow goal — it's a public face for everything, with contact and project showcases. Built solo.

## Claude's Role

Claude is my build partner on this site. The work now runs through an **agent loop** (Orchestrator → Builder → Checker) instead of a manual stage pipeline. Specifically:

- Write code that **actually runs** — not pseudo-code, not "should work." It gets checked.
- Treat security and correctness as real gates, caught by the Checker, not afterthoughts.
- Keep the work moving through the loop instead of looping forever on one task (hard 5-cycle cap).

**Prime directive:** This project is shipped when the site is **live and public on a real domain**. If a session is drifting — polishing endlessly, rabbit-holing on one feature, or theorizing instead of building — nudge me back: "Is this getting us closer to a live, public site? If not, let's refocus."

## The Method — Build Loop

The whole project is driven by one input file and three agents.

1. **`(C) TASK.md`** (project root) — the **main input file**. I write the tasks/features I want built here, one concrete item each, then set `status: ready`.
2. **Orchestrator agent** — reads `(C) TASK.md` and drives each task through the loop. It manages the other two agents, enforces the cycle cap, runs the verification pass, and writes the logs. It does not write feature code itself.
3. **Builder agent** — writes and fixes code in `02 Build/`. Gets the task plus any Checker failure feedback.
4. **Checker agent** — runs `type-check`, `lint`, `test`, `test:integration`, and `build`. Returns `VERDICT: PASS` or `VERDICT: FAIL` with exact errors. It never edits code.

### The cycle, per task
```
Builder writes/fixes  →  Checker runs the gate
   FAIL → back to Builder with the errors   (max 5 cycles)
   5th FAIL → STOP, write Stalled report, move to next task
   PASS → Verification pass:
            - confirm the feature actually satisfies the task
            - if no test covers it → Builder creates one → Checker re-runs
            - confirm stably green → mark COMPLETED, write Completed log
```

- **At most 5 build→check cycles per task.** The 5th failed check is the hard stop — it gets logged with what was tried and the unresolved issue, and the run moves on (one stuck task never blocks the rest).
- **A green check alone is not "done."** The verification pass confirms the feature is real and covered by a passing test before it's marked complete.

### Agent definitions
Live as native subagents in `.claude/agents/`: `orchestrator.md`, `builder.md`, `checker.md`.

## Folder Structure

- `(C) TASK.md` — **main input file.** Write tasks here; set `status: ready` to run.
- `02 Build/` — the live app code (Next.js 14 · React 18 · TypeScript · Tailwind · Sanity · Jest · Resend). All build/test commands run from here.
- `07 Skills/` — reusable skill markdown files (NOT Claude Code skills).
- `10 Original Files/` — the original site, kept as read-only reference for parity.
- `11 Run Logs/` — outcome of every run.
  - `Completed/` — tasks that passed the loop + verification.
  - `Stalled (5-Cycle Stops)/` — tasks that hit the 5-cycle cap; what was tried + the issue.
- `.claude/agents/` — the Orchestrator, Builder, and Checker definitions.

## Build Commands (run from `02 Build/`)

- `npm install` — deps
- `npm run dev` — local dev server
- `npm run build` — production build (does it compile/run)
- `npm run type-check` — `tsc --noEmit`
- `npm run lint` — `next lint`
- `npm test` — unit tests (Jest)
- `npm run test:integration` — integration tests
- `npm run test:all` — both test suites

## Rules & Conventions

- **`(C)` prefix** — Files created by Claude are prefixed with `(C)` so it's clear they're AI-generated. No exceptions (including `(C) TASK.md` and all run logs).
- **Editing rule** — Before editing any file without the `(C)` prefix, ask for permission first.
- **Skills** — Reusable scripts/automations are saved as markdown files in `07 Skills/`, NOT as Claude Code skills.
- **Code must run** — Don't hand me code that "should" work. The Checker verifies it.
- **Security is real** — Flag vulnerabilities; never knowingly ship insecure code. It's part of the check gate, not optional.
- **Hosting** — Site is hosted on **Vercel**.
- **CMS / Schema** — Content and schema run through **Sanity**.
- **Don't run the Orchestrator until asked** — and not until `(C) TASK.md` has real tasks and `status: ready`.

## Current Status

> **Last updated:** 2026-07-21
> **Status:** 🚀 **SHIPPED — live and public on `luisaruiz.xyz`.** Site is deployed on Vercel and the Resend contact form works end-to-end (confirmed 2026-07-21). The prime directive is met. Build loop (Orchestrator/Builder/Checker) is idle; `(C) TASK.md` has no open tasks. Future work = add tasks + set `status: ready`. Deploy details in `(C) DEPLOY CHECKLIST.md` (status: done).
