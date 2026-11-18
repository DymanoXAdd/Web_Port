/**
 * "Request to join" form on /minecraft: checks the username before sending, shows the server's
 * answer, and never shows a raw parse error.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WhitelistForm from "@/components/WhitelistForm";

const reply = (status: number, body: unknown) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: status === 200, status, json: () => Promise.resolve(body) })
  ) as unknown as typeof fetch;
};
const type = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const submit = () => fireEvent.click(screen.getByRole("button", { name: "Request to join" }));

test("sends the username and note, then confirms with the exact Mojang spelling", async () => {
  reply(200, { success: true, username: "Snackattack956" });
  render(<WhitelistForm />);
  type(/Minecraft username/, "snackattack956");
  type(/Note for Luis/, "Red's friend");
  submit();

  expect(await screen.findByRole("status")).toHaveTextContent("Request sent for Snackattack956");
  const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
  expect(url).toBe("/api/whitelist");
  expect(JSON.parse(init.body)).toEqual({ username: "snackattack956", note: "Red's friend" });
});

test("a bad username is caught before anything is sent", async () => {
  reply(200, {});
  render(<WhitelistForm />);
  type(/Minecraft username/, "no spaces allowed");
  submit();

  expect(await screen.findByText(/3-16 letters, numbers or _/)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test("shows the server's error, e.g. an unknown account", async () => {
  reply(400, { success: false, error: "No Minecraft Java account has that username." });
  render(<WhitelistForm />);
  type(/Minecraft username/, "NoSuchPlayer");
  submit();

  expect(await screen.findByRole("alert")).toHaveTextContent("No Minecraft Java account has that username.");
});

test("an HTML error page shows a plain message, not a parse error", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, status: 403, json: () => Promise.reject(new SyntaxError("Unexpected token '<'")) })
  ) as unknown as typeof fetch;
  render(<WhitelistForm />);
  type(/Minecraft username/, "Snackattack956");
  submit();

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Your request couldn't be sent. Please try again later.")
  );
});

test("links to the privacy policy", () => {
  render(<WhitelistForm />);
  expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
});
