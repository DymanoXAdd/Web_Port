/**
 * /api/whitelist: only real Mojang usernames get a request, saved privately in Sanity once per
 * player, and Luis is emailed only for a new request.
 */
import { NextRequest } from "next/server";

const createIfNotExists = jest.fn();
jest.mock("@/lib/sanity-write", () => ({ sanityWriteClient: () => ({ createIfNotExists }) }));
const sendWhitelistNotice = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/email", () => ({ sendWhitelistNotice: (...a: unknown[]) => sendWhitelistNotice(...a) }));
jest.mock("@sentry/nextjs", () => ({ captureException: jest.fn() }));

import { POST } from "@/app/api/whitelist/route";

const UUID = "11475f91-4c66-4a44-bb63-34dbc5e67660";
let ip = 0;
const post = (body: unknown) =>
  POST(
    new NextRequest("http://localhost/api/whitelist", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}` },
      body: JSON.stringify(body),
    })
  );
const mojang = (status: number, body?: unknown) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ status, ok: status === 200, json: () => Promise.resolve(body) })
  ) as unknown as typeof fetch;
};

beforeEach(() => {
  createIfNotExists.mockReset().mockImplementation((doc) => Promise.resolve(doc));
  sendWhitelistNotice.mockClear();
  process.env.RECIPIENT_EMAIL = "owner@example.com";
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("a real username is saved as a private pending request and Luis is emailed", async () => {
  mojang(200, { id: UUID.replace(/-/g, ""), name: "Snackattack956" });
  const res = await post({ username: "snackattack956", note: "Red's friend" });

  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ success: true, username: "Snackattack956" });
  expect(createIfNotExists).toHaveBeenCalledWith(
    expect.objectContaining({
      _id: `whitelist-requests.${UUID}`, // the "." keeps it out of the public API
      _type: "whitelistRequest",
      username: "Snackattack956",
      uuid: UUID,
      note: "Red's friend",
      status: "pending",
    })
  );
  expect(sendWhitelistNotice).toHaveBeenCalledWith("Snackattack956", "Red's friend", "owner@example.com");
});

test("asking again while a request is pending sends no second email", async () => {
  mojang(200, { id: UUID.replace(/-/g, ""), name: "Snackattack956" });
  createIfNotExists.mockImplementation((doc) => Promise.resolve({ ...doc, requestedAt: "2026-11-01T00:00:00.000Z" }));
  const res = await post({ username: "Snackattack956" });
  expect(res.status).toBe(200);
  expect(sendWhitelistNotice).not.toHaveBeenCalled();
});

test("an unknown username is rejected and nothing is saved", async () => {
  mojang(204);
  const res = await post({ username: "NoSuchPlayer" });
  expect(res.status).toBe(400);
  expect((await res.json()).error).toMatch(/No Minecraft Java account/);
  expect(createIfNotExists).not.toHaveBeenCalled();
});

test.each([["x"], ["has space"], ["op Evil;"], ["seventeen_chars_x"]])(
  "invalid username %p never reaches Mojang or Sanity",
  async (username) => {
    mojang(200, {});
    const res = await post({ username });
    expect(res.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(createIfNotExists).not.toHaveBeenCalled();
  }
);

test("Mojang down: 503 with a try-later message, nothing saved", async () => {
  mojang(500);
  const res = await post({ username: "Snackattack956" });
  expect(res.status).toBe(503);
  expect(createIfNotExists).not.toHaveBeenCalled();
});

test("a failed notice email still keeps the request", async () => {
  mojang(200, { id: UUID.replace(/-/g, ""), name: "Snackattack956" });
  sendWhitelistNotice.mockRejectedValueOnce(new Error("resend down"));
  const res = await post({ username: "Snackattack956" });
  expect(res.status).toBe(200);
  expect(createIfNotExists).toHaveBeenCalled();
});

test("non-JSON body is refused", async () => {
  const res = await POST(
    new NextRequest("http://localhost/api/whitelist", { method: "POST", headers: { "content-type": "text/plain" }, body: "x" })
  );
  expect(res.status).toBe(415);
});
