# Architecture — portfolio-website

Status: approved by Luis, 2026-11-12 (T-001).

## Context
Public single-page portfolio. Visitors read the sections (Hero, About, Experience, Skills, Projects, Contact) and can send a message. Luis edits content in Sanity Studio.

## Stack
| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 App Router, React 18, Tailwind, framer-motion | Existing rebuild; ISR on Vercel |
| Backend | Next.js route handlers (`app/api/*`) | Only two endpoints are needed |
| Content | Sanity, Studio embedded at `/studio` | Edit content without a redeploy |
| Email | Resend (`lib/email.ts`) | Contact form delivery from a verified domain |
| Auth | None for visitors; Sanity login for Studio | |
| Hosting | Vercel | Already live there |

## Components and boundaries
- `components/sections/*`: one component per page section; render data passed from `app/page.tsx`.
- `lib/sanity*.ts`: the only code that talks to Sanity.
- `app/api/email`: validates (`lib/validation.ts`), rate-limits, sends via `lib/email.ts`; never puts user input into mail headers.
- `app/api/revalidate`: Sanity webhook; must verify its secret.

## Data model
Sanity documents `pageInfo`, `experience`, `project`, `skill`, `social`. No visitor data is stored.

## External services and API contracts
| Service | Used for | Failure plan |
|---|---|---|
| Sanity | content | ISR keeps serving the last good page |
| Resend | contact email | form shows an error; the Hero copy-email button still works |
| Vercel | hosting, analytics | promote the previous deployment |

## Non-functional targets
- Performance: Core Web Vitals targets in BRIEF §12.
- Availability: Vercel default.
- Scale expected in year one: low.

## Constraints and known risks
- Sender `noreply@luisaruiz.xyz` is hard-coded; the Resend domain must stay verified or mail fails silently.
- No CI yet: only local checks stand between a push and production. CI (T-003) comes before `npm run deploy` (T-009).
