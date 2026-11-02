import { afterEach, describe, expect, it, vi } from 'vitest'
import { reportError } from './reportError'

// setup.ts mocks reportError for every other test, so expected failures don't flood the output.
vi.unmock('./reportError')

describe('reportError', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('logs the error and its context in development', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const error = new Error('Boom')

    reportError(error, { source: 'test' })

    expect(consoleError).toHaveBeenCalledWith('[reportError]', error, { source: 'test' })
  })

  it('does nothing in production', () => {
    vi.stubEnv('DEV', false)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    reportError(new Error('Boom'))

    expect(consoleError).not.toHaveBeenCalled()
  })
})
