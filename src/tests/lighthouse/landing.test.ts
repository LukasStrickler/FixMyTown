import { test } from '@playwright/test';
import { runLighthouseAudit } from './helpers/lighthouse.helper';

test.describe('Lighthouse', () => {
    test.setTimeout(120000);
    test.describe.configure({ mode: 'serial' });

    test('homepage should pass Lighthouse audits', async ({ browser }, testInfo) => {
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const page = await context.newPage();

        try {
            await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
            await runLighthouseAudit(page, testInfo, 'homepage');
        } finally {
            await context.close();
        }
    });

    test('homepage should pass Lighthouse audits in dark mode', async ({ browser }, testInfo) => {
        const context = await browser.newContext({
            colorScheme: 'dark',
            viewport: { width: 1280, height: 720 }
        });
        const page = await context.newPage();

        try {
            await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
            await runLighthouseAudit(page, testInfo, 'homepage-dark');
        } finally {
            await context.close();
        }
    });
});