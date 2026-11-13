---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "tests/**"
  - "e2e/**"
  - "__tests__/**"
---

# Testing rules

- Every bug fix starts with a test that fails for the bug.
- Cover risky logic first: money, auth, permissions, data writes, date and time maths.
- Test behavior through public interfaces. Do not test private functions or mock the thing under test.
- End-to-end tests cover only the critical user flows listed in `docs/BRIEF.md`.
- Tests must be deterministic: no real network, no real clock, no shared state between tests.
- Never delete, skip, or weaken a failing test to get a green run. Report it and ask.
- Run the test command from `CLAUDE.md` before saying a task is done, and paste the summary line.
