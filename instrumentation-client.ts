// Browser-side Sentry. The DSN comes from Vercel (NEXT_PUBLIC_SENTRY_DSN); without it (local, tests, CI)
// Sentry stays off. Errors only: no tracing or replay, and no personal data, to stay in the free tier.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  tracesSampleRate: 0,
});
