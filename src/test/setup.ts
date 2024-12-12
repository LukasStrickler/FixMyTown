import '@testing-library/jest-dom/vitest'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
    // eslint-disable-next-line 
    interface Assertion extends TestingLibraryMatchers<typeof expect.stringContaining, unknown> { }
}

expect.extend(matchers)

afterEach(() => {
    cleanup()
})