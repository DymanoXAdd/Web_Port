---
type: run-logs-readme
created: 2026-06-23
---

# 11 Run Logs

Every Orchestrator run writes an outcome here. Two outcomes, two folders:

- **`Completed/`** — tasks that passed the loop AND the verification pass. One file per run, e.g. `(C) Completed - 2026-06-23.md`. Records: task, files changed, cycles taken, the test(s) now covering it, final check results.

- **`Stalled (5-Cycle Stops)/`** — tasks that hit the 5-cycle cap still failing. One file per stalled task, e.g. `(C) STALLED - contact-form - 2026-06-23.md`. Records: what each of the 5 cycles tried, the persistent error, the Builder's root-cause theory, and what a human needs to decide/fix.

A stalled task never blocks the rest of the run — the Orchestrator logs it and moves on.
