import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 2,
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'LetCode',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://letcode.in',
      },
      grep: /@letcode/
    },
    {
      name: 'Playwright',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://playwright.dev'
      },
      grep: /@playwright/
    },
  ],
});
