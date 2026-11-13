import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

// E2E runs against a production build (`npm run build` first). The email API is intercepted in
// every test, and the server gets a dummy Resend key, so no real mail can ever be sent.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/api/email`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { RESEND_API_KEY: "re_dummy_e2e", RECIPIENT_EMAIL: "owner@example.com" },
  },
});
