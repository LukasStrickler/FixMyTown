import type { Config } from 'lighthouse';

export const lighthouseDesktopConfig: Partial<Config> = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'desktop',
        screenEmulation: { disabled: true },
        throttling: {
            cpuSlowdownMultiplier: 1,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0,
            rttMs: 0
        },
        skipAudits: ['uses-http2'],
        maxWaitForLoad: 45000,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
    }
};

export const lighthouseThresholds = {
    performance: 85,
    accessibility: 100,
    'best-practices': 95,
    seo: 95,
};