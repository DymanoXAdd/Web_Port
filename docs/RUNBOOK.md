# Runbook — portfolio-website

## Environments
| Name | URL | Branch | Who can deploy |
|---|---|---|---|
| local | http://localhost:3000 | any | Luis |
| preview | Vercel preview URL | any non-default branch | automatic |
| production | https://luisaruiz.xyz | default branch | Luis (merge = deploy) |

## Deploy
Until T-009 lands: run `npm run test:all && npm run build`, then merge to the default branch; Vercel builds production. After T-009: `npm run deploy` from a task branch (checks → push → PR → squash-merge). First-time setup steps: `docs/reference/vault/(C) SOP - Replace Old Vercel Build with New Build.md`.

## Rollback
Vercel dashboard → Deployments → last good deployment → Promote to Production. Takes under a minute.

## Monitoring
- Errors: none yet (T-004)
- Uptime: none yet (T-004)
- Logs: Vercel function logs

## Database
Not applicable. Sanity keeps document history in Studio.

## Secrets
`RESEND_API_KEY`, Sanity project/dataset/token, revalidate secret: Vercel env vars (Production and Preview) and local `.env.local`. Never write values here.

## Incidents
<!-- Newest first: date, what broke, cause, fix, follow-up task ID. -->

## Production readiness checklist
- [ ] Tests pass in CI on the release commit
- [ ] `/ponytail-audit` run, findings fixed or logged as tasks
- [ ] Error monitoring receives a test error from production
- [x] Rollback path known (Vercel promote)
- [ ] Secrets out of the repo, dependency scan clean
- [ ] Accessibility and performance targets from `BRIEF.md` met
- [x] Human signed off on the release (live since 2026-07-21)
