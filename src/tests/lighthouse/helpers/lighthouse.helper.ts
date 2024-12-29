import type { Page, TestInfo } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { lighthouseDesktopConfig, lighthouseThresholds } from './desktop.config';
import path from 'path';

export async function runLighthouseAudit(page: Page, testInfo: TestInfo, reportName: string) {
    await Promise.all([
        page.waitForLoadState('load'),
        page.waitForLoadState('domcontentloaded'),
        page.waitForLoadState('networkidle')
    ]);

    await page.evaluate(() => document.readyState === 'complete');

    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${reportName}-screenshot`, {
        body: screenshot,
        contentType: 'image/png'
    });

    await playAudit({
        page,
        config: lighthouseDesktopConfig,
        thresholds: lighthouseThresholds,
        port: 9222,
        reports: {
            formats: {
                html: true,
            },
            name: `lighthouse-report-${reportName}`,
            directory: path.join(process.cwd(), '.lighthouse', 'lighthouse-reports')
        }
    });
}