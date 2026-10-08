import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './fitness',
  testMatch: '**/*.fitness.ts',
  outputDir: '.test/fitness',
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4174' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Never reused: a server left running would serve a build older than the code
  // under measurement.
  webServer: {
    command: 'npm run build && npm run preview -- --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
