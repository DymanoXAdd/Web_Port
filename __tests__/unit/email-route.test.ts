/**
 * The contact route must send exactly one email: to Luis.
 * A second email to the visitor's address let anyone use our domain to mail any inbox.
 */
import { NextRequest } from "next/server";

const send = jest.fn().mockResolvedValue({ data: { id: "x" }, error: null });
jest.mock("resend", () => ({ Resend: jest.fn(() => ({ emails: { send } })) }));

import { POST } from "@/app/api/email/route";

test("one submission sends one email, only to the site owner", async () => {
  process.env.RECIPIENT_EMAIL = "owner@example.com";
  const res = await POST(
    new NextRequest("http://localhost/api/email", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" },
      body: JSON.stringify({
        name: "Spam Bot",
        email: "victim@example.com",
        subject: "Hello there",
        message: "Buy cheap things now please",
      }),
    })
  );
  await new Promise((r) => setImmediate(r)); // let any fire-and-forget send run

  expect(res.status).toBe(200);
  expect(send).toHaveBeenCalledTimes(1);
  expect(send.mock.calls[0][0].to).toBe("owner@example.com");
});

test("missing RECIPIENT_EMAIL sends nothing and returns a generic 500", async () => {
  delete process.env.RECIPIENT_EMAIL;
  send.mockClear();
  jest.spyOn(console, "error").mockImplementation(() => {});
  const res = await POST(
    new NextRequest("http://localhost/api/email", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "8.8.8.8" },
      body: JSON.stringify({
        name: "Real Person",
        email: "person@example.com",
        subject: "Hello there",
        message: "A normal message for you",
      }),
    })
  );

  expect(res.status).toBe(500);
  expect(send).not.toHaveBeenCalled();
  expect((await res.json()).error).not.toMatch(/RECIPIENT_EMAIL/);
});
