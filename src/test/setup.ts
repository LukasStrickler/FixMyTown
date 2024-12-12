import '@testing-library/jest-dom/vitest'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
    interface Assertion<T = any> extends TestingLibraryMatchers<typeof expect.stringContaining, T> { }
}

expect.extend(matchers)

afterEach(() => {
    cleanup()
})