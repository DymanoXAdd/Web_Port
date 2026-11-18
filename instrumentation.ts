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
    // Sentry 11 collects user info (IP), cookies, headers, request bodies and stack variables by default;
    // on the email route that would include the form. Off: error reports carry only the error (privacy policy, T-036).
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    },
  });
}
