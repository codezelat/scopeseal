import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3100";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `source ~/.nvm/nvm.sh && pnpm build && pnpm start --port ${port}`,
    url: `http://localhost:${port}`,
    env: {
      ...process.env,
      RATE_LIMIT_MAX_REQUESTS: "1000",
    },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
