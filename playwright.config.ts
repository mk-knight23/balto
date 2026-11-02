import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: process.env.BALTO_TEST_URL || "http://localhost:5173",
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
  reporter: "list",
  webServer: process.env.BALTO_TEST_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
      },
});
