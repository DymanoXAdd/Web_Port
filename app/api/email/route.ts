import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { sendContactEmail, sendConfirmationEmail } from "@/lib/email";

/**
 * In-memory rate limit store.
 *
 * IMPORTANT — LIMITATION IN SERVERLESS:
 * On Vercel (and any serverless platform) each function instance starts with a
 * fresh Map, so a cold-start resets the counter for that instance. For a
 * portfolio site this is an acceptable trade-off: it still blocks rapid bursts
 * within a single warm instance. For production hardening, swap this for
 * Vercel KV (Redis) with `@vercel/kv`.
 *
 * SPOOFING NOTE: x-forwarded-for can be faked by an attacker who controls the
 * raw TCP connection. Vercel injects a *second* x-forwarded-for entry for the
 * real edge IP, so we take the LAST entry to reduce (but not eliminate) this
 * risk.
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5;                         // max requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;    // 1 hour

function getClientIp(request: NextRequest): string {
  // Vercel appends the real edge IP as the last entry in x-forwarded-for.
  // Taking the last value makes header-spoofing harder than taking the first.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((s) => s.trim());
    return parts[parts.length - 1] || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count < RATE_LIMIT) {
    record.count++;
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Guard against non-JSON bodies
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;
    const recipientEmail = process.env.RECIPIENT_EMAIL || "luisaruiz2734@gmail.com";

    await sendContactEmail(formData, recipientEmail);

    // Fire-and-forget — never let this block the 200 response
    sendConfirmationEmail(formData.email, formData.name).catch((err) => {
      console.error("Confirmation email failed (non-fatal):", err);
    });

    return NextResponse.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    // Never expose raw error details to the client
    console.error("Email API error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

// Simple health check — returns no sensitive info
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
