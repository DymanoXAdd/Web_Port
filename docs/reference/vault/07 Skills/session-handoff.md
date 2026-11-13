# Skill: Session Handoff

Capture the state of the current session into a handoff note before clearing context, so the next session picks up exactly where this one left off — no lost thread, no re-explaining.

Part of [[(C) Skills — Index]].

## When to Use

- Before running `/clear` or ending a session with work still in progress
- Context is getting long and you want a clean reset without losing the thread
- Wrapping up for the day mid-task

## How It Works

1. **Before clearing** — ask Claude to write the handoff note to `.claude/session-handoff.md`
2. **Next session** — start by reading that note and continuing

## Writing the Handoff

Ask Claude: **"Write `.claude/session-handoff.md`"**

Include:

- **Current goal** — what we're trying to accomplish
- **Changed files** — what was created or edited this session
- **Decisions made** — choices locked in, and why
- **Failing tests** — what's broken right now (if anything)
- **Root cause** — what we think is causing it (if known)
- **Next step** — the exact next action to take

## Template

```markdown
# Session Handoff — [date]

## Current Goal
[what we're working toward]

## Changed Files
- [path] — [what changed]

## Decisions Made
- [decision] — [why]

## Failing Tests
- [test] — [error] (or "none")

## Root Cause
[what's causing the issue, or "n/a"]

## Next Step
[the exact next action]
```

## Resuming

Next session, start with:

> **"Read `.claude/session-handoff.md` and continue."**

## Notes

- Keep it tight — this is a baton pass, not a full report. Enough to resume cold.
- One handoff file per project root, overwritten each time. The latest state is the only one that matters.
