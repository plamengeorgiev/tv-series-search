import { createQueryClient } from '../api/queryClient'

// A fresh client per test keeps the cache from leaking between tests.
export function createTestQueryClient() {
  return createQueryClient({
    defaultOptions: {
      // Queries with their own retry policy still retry, but without the backoff delay.
      queries: { retry: false, retryDelay: 0 },
    },
  })
}
