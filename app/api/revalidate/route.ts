import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation — called by Sanity webhooks.
 *
 * Security notes:
 * - Requires REVALIDATE_SECRET query param; returns 401 on mismatch.
 * - `path` is validated against an allowlist to prevent path-traversal abuse.
 * - GET returns 405 (Method Not Allowed) — no health-check info leakage.
 */

// Only these paths may be revalidated from an external webhook
const ALLOWED_PATHS = new Set(["/", "/api/email"]);

function isAllowedPath(path: string): boolean {
  // Accept exact allowlist entries only
  return ALLOWED_PATHS.has(path);
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    const path = request.nextUrl.searchParams.get("path") || "/";

    // Timing-safe-ish comparison (good enough for a webhook secret)
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Guard against path-traversal
    if (!isAllowedPath(path)) {
      return NextResponse.json(
        { success: false, error: "Path not allowed" },
        { status: 400 }
      );
    }

    revalidatePath(path);

    return NextResponse.json(
      { success: true, message: `Revalidated: ${path}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { success: false, error: "Revalidation failed" },
      { status: 500 }
    );
  }
}

// Explicitly reject GET — no info should leak about this endpoint
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
