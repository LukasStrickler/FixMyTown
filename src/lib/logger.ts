/* eslint-disable no-console */
const isDev = process.env.NODE_ENV === "development";

export const logger = {
    log: (...args: unknown[]) => {
        if (isDev) {
            console.log(...args);
        }
    },
    error: (...args: unknown[]) => {
        // We always want to log errors, even in production
        console.error(...args);
    },
    warn: (...args: unknown[]) => {
        if (isDev) {
            console.warn(...args);
        }
    },
    info: (...args: unknown[]) => {
        if (isDev) {
            console.info(...args);
        }
    },
    debug: (...args: unknown[]) => {
        if (isDev) {
            console.debug(...args);
        }
    },
}; 