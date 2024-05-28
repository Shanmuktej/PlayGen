import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 2,
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'retain-on-failure',
    baseURL: 'https://playwright.dev'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    },
  ],
});
