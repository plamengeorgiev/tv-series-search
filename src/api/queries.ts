import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getShow, searchShows } from './tvmazeClient'

// Retries and caching are app-wide defaults, set in createQueryClient.

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
  })
}

export function useShowDetails(id: number) {
  return useQuery({
    queryKey: showKeys.details(id),
    queryFn: ({ signal }) => getShow(id, signal),
  })
}
