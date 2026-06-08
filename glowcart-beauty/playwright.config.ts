import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const PORT = 3000;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    storageState: { cookies: [], origins: [] },
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...process.env,
      MONGODB_URI: process.env.MONGODB_URI ?? "",
      AUTH_SECRET:
        process.env.AUTH_SECRET ??
        process.env.NEXTAUTH_SECRET ??
        "glowcart-dev-auth-secret",
      NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET ??
        process.env.AUTH_SECRET ??
        "glowcart-dev-auth-secret",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? `http://localhost:${PORT}`,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
