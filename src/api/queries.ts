import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getShow, isApiError, searchShows, type ApiErrorType } from './tvmazeClient'

const MAX_RETRIES = 3
// Other errors (404s, bad data) would fail the same way on every attempt.
const retryableErrorTypes: ApiErrorType[] = ['network', 'rate-limited', 'server']

function retryTransientErrors(failureCount: number, error: Error): boolean {
  return failureCount < MAX_RETRIES && isApiError(error, ...retryableErrorTypes)
}

export const showKeys = {
  all: ['shows'] as const,
  search: (query: string) => [...showKeys.all, 'search', query] as const,
  details: (id: number) => [...showKeys.all, 'details', id] as const,
}

export function useShowSearch(query: string) {
  const trimmedQuery = query.trim()

  return useQuery({
    queryKey: showKeys.search(trimmedQuery),
    queryFn: ({ signal }) => searchShows(trimmedQuery, signal),
    enabled: trimmedQuery !== '',
    // Keeps the old results on screen while the next search loads, instead of flashing a spinner.
    placeholderData: keepPreviousData,
    retry: retryTransientErrors,
  })
}

export function useShowDetails(id: number) {
  return useQuery({
    queryKey: showKeys.details(id),
    queryFn: ({ signal }) => getShow(id, signal),
    retry: retryTransientErrors,
  })
}
