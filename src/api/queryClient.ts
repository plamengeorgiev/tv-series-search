import { QueryCache, QueryClient, type QueryClientConfig } from '@tanstack/react-query'
import { reportError } from '../lib/reportError'
import { ApiError, isApiError, type ApiErrorType } from './tvmazeClient'

const MAX_RETRIES = 3
// Other errors (404s, bad data) would fail the same way on every attempt.
const retryableErrorTypes: ApiErrorType[] = ['network', 'rate-limited', 'server']

function retryTransientErrors(failureCount: number, error: Error): boolean {
  return failureCount < MAX_RETRIES && isApiError(error, ...retryableErrorTypes)
}

// Show data rarely changes, so going back to the results or reopening a show reuses what was
// fetched recently instead of spending another request against TVmaze's rate limit.
const STALE_TIME_MS = 5 * 60 * 1000

export function createQueryClient(config?: QueryClientConfig) {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config?.defaultOptions,
      queries: {
        retry: retryTransientErrors,
        staleTime: STALE_TIME_MS,
        ...config?.defaultOptions?.queries,
      },
    },
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
