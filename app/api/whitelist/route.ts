import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { whitelistRequestSchema } from "@/lib/validation";
import { lookupProfile } from "@/lib/minecraft";
import { sanityWriteClient } from "@/lib/sanity-write";
import { sendWhitelistNotice } from "@/lib/email";
import { checkRateLimit, getClientIp, type RateLimitStore } from "@/lib/api-guards";

const rateLimitStore: RateLimitStore = new Map();
const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });

// A visitor asks to join Orbis. The request is saved in Sanity as pending (one per player) and Luis
// gets an email; he approves it in Studio and scripts/orbis-stats.py adds the player over RCON.
export async function POST(request: NextRequest) {
  try {
    if (!checkRateLimit(rateLimitStore, getClientIp(request.headers))) {
      return fail("Too many requests. Please try again later.", 429);
    }
    if (!(request.headers.get("content-type") || "").includes("application/json")) {
      return fail("Content-Type must be application/json", 415);
    }
    const body = await request.json().catch(() => undefined);
    const parsed = whitelistRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid request", 400);
    }

    let profile;
    try {
      profile = await lookupProfile(parsed.data.username);
    } catch (error) {
      console.warn("whitelist: Mojang lookup failed", error);
      return fail("Couldn't check that username right now. Please try again later.", 503);
    }
    if (!profile) return fail("No Minecraft Java account has that username.", 400);

    const note = parsed.data.note ?? "";
    const requestedAt = new Date().toISOString();
    // The "." in the id keeps the request out of the public dataset API: only signed-in Studio
    // users and the server token can read it. One id per player, so repeats don't pile up.
    const saved = await sanityWriteClient().createIfNotExists({
      _id: `whitelist-requests.${profile.uuid}`,
      _type: "whitelistRequest",
      username: profile.name,
      uuid: profile.uuid,
      note,
      status: "pending",
      requestedAt,
    });

    // Email only for a new request; a repeat of a pending one would just spam Luis.
    const recipient = process.env.RECIPIENT_EMAIL;
    if (saved.requestedAt === requestedAt && recipient) {
      await sendWhitelistNotice(profile.name, note, recipient).catch((error) => {
        console.error("whitelist: notice email failed", error);
        Sentry.captureException(error); // the request is saved; Luis still sees it in Studio
      });
    }

    return NextResponse.json({ success: true, username: profile.name });
  } catch (error) {
    console.error("whitelist API error:", error);
    Sentry.captureException(error);
    return fail("Something went wrong. Please try again later.", 500);
  }
}
