import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'

// Fail loudly on requests without a handler instead of letting them reach the real API.
beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' })
})

// Vitest globals are off, so Testing Library can't register its own cleanup hook.
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
