import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,

  // Start Next.js dev server for tests
  webServer: {
    command: 'pnpm dev --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },

  reporter: [
    ['list'],
    // JSON report is our “source of truth” for executed steps + attachments
    ['json', { outputFile: 'playwright-report/report.json' }]
  ],

  use: {
    baseURL: 'http://localhost:3000',
    // default (non-doc) settings:
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      slowMo: 600
    }
  },

  projects: [
    {
      name: 'e2e',
      grepInvert: /@doc/
    },
    {
      name: 'docs',
      grep: /@doc/,
      use: {
        trace: 'on',
        video: 'on'
      }
    }
  ]
});
