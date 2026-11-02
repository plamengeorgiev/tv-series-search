import { QueryCache, QueryClient, type QueryClientConfig } from '@tanstack/react-query'
import { reportError } from '../lib/reportError'
import { ApiError } from './tvmazeClient'

export function createQueryClient(config?: QueryClientConfig) {
  return new QueryClient({
    ...config,
    // The cache-level handler runs once per failed query, after its retries, unlike useQuery callbacks.
    queryCache: new QueryCache({
      onError: (error, query) => {
        reportError(error, {
          source: 'query',
          queryKey: query.queryKey,
          ...(error instanceof ApiError
            ? { type: error.type, status: error.status, cause: error.cause }
            : {}),
        })
      },
    }),
  })
}
