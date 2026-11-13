import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit, getClientIp, type RateLimitStore } from "@/lib/api-guards";

const rateLimitStore: RateLimitStore = new Map();

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    if (!checkRateLimit(rateLimitStore, ip)) {
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
    const recipientEmail = process.env.RECIPIENT_EMAIL;
    if (!recipientEmail) throw new Error("RECIPIENT_EMAIL is not set"); // caught below: logged, generic 500

    // Only Luis gets mail: a reply to the visitor's address let anyone use our domain to spam any inbox.
    await sendContactEmail(formData, recipientEmail);

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
