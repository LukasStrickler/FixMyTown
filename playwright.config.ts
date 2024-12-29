import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({
    path: path.resolve(process.cwd(), '.env.test'),
    override: true
});

export default defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { outputFolder: './.lighthouse/playwright-report' }]],
    outputDir: './.lighthouse/test-results',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        launchOptions: {
            args: ['--remote-debugging-port=9222']
        }
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'auth-tests',
            testMatch: /auth\.test\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                headless: false,
                launchOptions: {
                    slowMo: 1000,
                    args: ['--remote-debugging-port=9222']
                }
            },
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});

