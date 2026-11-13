// Server-side Sentry (Node and Edge runtimes). Same rules as instrumentation-client.ts: off without a DSN,
// errors only, no personal data.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  Sentry.init({
    dsn,
    enabled: !!dsn,
    environment: process.env.VERCEL_ENV ?? "development",
    tracesSampleRate: 0,
  });
}
