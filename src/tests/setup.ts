import '@testing-library/jest-dom/vitest'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables before anything else
dotenv.config({
    path: path.resolve(process.cwd(), '.env.test'),
    override: true
})

declare module 'vitest' {
    // eslint-disable-next-line 
    interface Assertion extends TestingLibraryMatchers<typeof expect.stringContaining, unknown> { }
}

expect.extend(matchers)

afterEach(() => {
    cleanup()
})
