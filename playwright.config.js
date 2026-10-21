import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', timeout: 30000, retries: 0, workers: 1,
  use: { baseURL: 'http://127.0.0.1:4177', browserName: 'chromium', headless: true, trace: 'retain-on-failure', launchOptions: process.env.PANTRY_CHROME ? { executablePath: process.env.PANTRY_CHROME } : {} },
  webServer: { command: 'npm run build && PANTRY_LOCAL_PREVIEW=1 PANTRY_LAUNCH_DATE=2026-10-21 PORT=4177 npm run dev', url: 'http://127.0.0.1:4177', reuseExistingServer: false, timeout: 30000 }
});
