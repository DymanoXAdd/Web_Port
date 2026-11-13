"use client";

// Last-resort error screen for errors outside the page's ErrorBoundary (e.g. in the root layout).
// Reports to Sentry and, like ErrorBoundary, never shows the raw error text.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0E1116", color: "#E6EDF3", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 32, margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ color: "#9BA7B4", margin: "0 0 24px" }}>An unexpected error occurred. Please try refreshing the page.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ background: "#00880C", color: "#FFFFFF", border: 0, borderRadius: 6, padding: "12px 20px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}
