export type ErrorContext = Record<string, unknown>

// The app's single error sink. An error tracker such as Sentry can be plugged in here
// later without touching any call sites.
export function reportError(error: unknown, context: ErrorContext = {}) {
  if (import.meta.env.DEV) {
    console.error('[reportError]', error, context)
  }
}
