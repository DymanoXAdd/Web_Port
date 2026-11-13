---
paths:
  - "app/**"
  - "lib/**"
  - "sanity/**"
---

# Security rules

- Validate and type-check every input that crosses a trust boundary (HTTP, forms, webhooks, files, env).
- Check authorization on the server for every request that reads or changes data. Never rely on the UI.
- Use parameterized queries or the ORM. Never build SQL from strings.
- Secrets come from environment variables or the secret manager named in `docs/RUNBOOK.md`. Never log them, commit them, or send them to the browser.
- Escape output by default. No `dangerouslySetInnerHTML`, `eval`, or shell commands built from user input.
- Rate-limit login, signup, password reset, and any endpoint that costs money.
- A new dependency needs human approval; prefer what is already installed.
- Changes to auth, sessions, permissions, or payments need human approval and a `docs/DECISIONS.md` entry.
