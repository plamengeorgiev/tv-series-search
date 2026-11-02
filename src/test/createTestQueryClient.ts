import { createQueryClient } from '../api/queryClient'

// A fresh client per test keeps the cache from leaking between tests.
export function createTestQueryClient() {
  return createQueryClient({
    defaultOptions: {
      // Keeps the app's retry policy, but without the backoff delay.
      queries: { retryDelay: 0 },
    },
  })
}
