import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { reportError } from '../lib/reportError'
import { server } from './server'

// Many tests fail requests on purpose, so keep their reports out of the output. Tests can still
// assert on the mock.
vi.mock('../lib/reportError')

// Fail loudly on requests without a handler instead of letting them reach the real API.
beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' })
})

// Vitest globals are off, so Testing Library can't register its own cleanup hook.
afterEach(() => {
  cleanup()
  server.resetHandlers()
  vi.mocked(reportError).mockClear()
})

afterAll(() => {
  server.close()
})
