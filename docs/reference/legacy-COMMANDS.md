# Commands & Skills

Quick reference for this project.

## The Build Loop
- **Input:** write tasks in `(C) TASK.md`, set `status: ready`.
- **Run:** start the **Orchestrator** agent (`.claude/agents/orchestrator.md`) — it drives Builder → Checker, max 5 cycles per task, then a verification pass.
- **Output:** results logged to `11 Run Logs/Completed/` or `11 Run Logs/Stalled (5-Cycle Stops)/`.

## Build commands (run from `02 Build/`)
- `npm install` — install deps
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run type-check` — TypeScript (`tsc --noEmit`)
- `npm run lint` — `next lint`
- `npm test` — unit tests
- `npm run test:integration` — integration tests
- `npm run test:all` — both suites

## Skills (in 07 Skills/)
_No project-specific skills yet._
