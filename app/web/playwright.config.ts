import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:4173',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'pnpm vite build --mode test && pnpm vite preview --mode test',
        env: {
            VITE_FIREBASE_COLUMN_ID:
                process.env.VITE_FIREBASE_COLUMN_ID ||
                'b5624472-edaf-4b76-8289-d89417f97dfd',
        },
        port: 4173,
        reuseExistingServer: !process.env.CI,
    },
});
