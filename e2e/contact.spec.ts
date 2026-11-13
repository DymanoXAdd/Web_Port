import { test, expect, type Page } from "@playwright/test";

// The contact flow end to end in a real browser. /api/email is always intercepted, so these
// tests never reach Resend; the route's own behaviour is covered by the jest suites.

async function openContact(page: Page) {
  await page.goto("/#contact");
  await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
}

// exact: the hero's "Copy email …" button would otherwise also match "Email".
const field = (page: Page, label: string) => page.getByLabel(label, { exact: true });

async function fillValidForm(page: Page) {
  await field(page, "Name").fill("Test Visitor");
  await field(page, "Email").fill("visitor@example.com");
  await field(page, "Subject").fill("Hello from the E2E test");
  await field(page, "Message").fill("This is a message long enough to pass validation.");
}

test("empty submit shows validation errors and sends nothing", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/email", (route) => {
    calls++;
    return route.fulfill({ status: 200, json: { success: true } });
  });
  await openContact(page);

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  await expect(page.getByText("Message must be at least 10 characters")).toBeVisible();
  expect(calls).toBe(0);
});

test("valid submit sends the form as JSON and shows the success message", async ({ page }) => {
  let body: Record<string, string> | null = null;
  await page.route("**/api/email", (route) => {
    body = route.request().postDataJSON();
    return route.fulfill({ status: 200, json: { success: true, message: "Email sent successfully!" } });
  });
  await openContact(page);
  await fillValidForm(page);

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toContainText("Message sent!");
  expect(body).toMatchObject({ name: "Test Visitor", email: "visitor@example.com" });
  await expect(field(page, "Name")).toHaveValue(""); // form resets after a send
});

test("an HTML error page (e.g. a firewall challenge) shows a friendly message, not a JSON parse error", async ({ page }) => {
  await page.route("**/api/email", (route) =>
    route.fulfill({ status: 403, contentType: "text/html", body: "<!DOCTYPE html><html><body>Checking your browser</body></html>" })
  );
  await openContact(page);
  await fillValidForm(page);

  await page.getByRole("button", { name: "Send message" }).click();

  // Next.js renders its own empty role="alert" route announcer, so filter to the form's alert.
  const alert = page.getByRole("alert").filter({ hasText: "couldn't be sent" });
  await expect(alert).toBeVisible();
  await expect(page.getByText(/Unexpected token/)).toHaveCount(0);
});

test("a server error shows the server's message", async ({ page }) => {
  await page.route("**/api/email", (route) =>
    route.fulfill({ status: 429, json: { success: false, error: "Too many requests. Please try again later." } })
  );
  await openContact(page);
  await fillValidForm(page);

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("alert").filter({ hasText: "Too many requests" })).toBeVisible();
});
