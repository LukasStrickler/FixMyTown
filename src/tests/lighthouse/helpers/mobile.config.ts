import type { Config } from 'lighthouse';

export const lighthouseMobileConfig: Partial<Config> = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'mobile',
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
    performance: Number(process.env.LIGHTHOUSE_PERFORMANCE_THRESHOLD ?? 85),
    accessibility: Number(process.env.LIGHTHOUSE_ACCESSIBILITY_THRESHOLD ?? 100),
    'best-practices': Number(process.env.LIGHTHOUSE_BEST_PRACTICES_THRESHOLD ?? 95),
    seo: Number(process.env.LIGHTHOUSE_SEO_THRESHOLD ?? 95),
};