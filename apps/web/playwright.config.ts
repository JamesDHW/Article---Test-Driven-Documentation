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
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'e2e',
    },
    {
      name: 'docs',
      grep: /@doc/,
      use: {
        trace: 'on',
        video: 'on',
        launchOptions: {
          slowMo: 600
        }
      }
    }
  ]
});
