import { useShowSearch } from '../../api/queries'
import type { SearchResult } from '../../api/schemas'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

// Long enough to skip intermediate keystrokes, which keeps us under TVmaze's rate limit.
const SEARCH_DEBOUNCE_MS = 300

/** What the results area should show. */
export type SearchResultsView =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry: () => void }
  | { status: 'empty' }
  /** `isStale`: these are the previous query's results, kept on screen while the new ones load. */
  | { status: 'results'; results: SearchResult[]; isStale: boolean }

/** Debounces `query`, searches for it, and boils React Query's flags down to what the page shows. */
export function useSearchResults(query: string) {
  const trimmedQuery = query.trim()
  const searchedQuery = useDebouncedValue(trimmedQuery, SEARCH_DEBOUNCE_MS)
  const {
    data: results,
    error,
    fetchStatus,
    isPending,
    isPlaceholderData,
    refetch,
  } = useShowSearch(searchedQuery)

  // The results for the current query are still to come. isPending covers the first search;
  // on later ones keepPreviousData keeps the old results, which turns isPending off and
  // isPlaceholderData on until the new results arrive.
  const isAwaitingResults = trimmedQuery !== '' && (isPending || isPlaceholderData)

  function getView(): SearchResultsView {
    // keepPreviousData would otherwise keep showing the last results after the input is cleared.
    if (trimmedQuery === '') return { status: 'idle' }
    if (error) {
      return {
        status: 'error',
        error,
        retry: () => {
          void refetch()
        },
      }
    }
    // Also covers the debounce window, when the query is typed but not sent yet.
    // An empty placeholder would claim the new query has no results before it has been searched.
    if (isPending || (isPlaceholderData && results.length === 0)) return { status: 'loading' }
    if (results.length === 0) return { status: 'empty' }
    return { status: 'results', results, isStale: isPlaceholderData }
  }

  return {
    /** The trimmed query the results belong to, which lags behind typing by the debounce. */
    searchedQuery,
    view: getView(),
    /** A request is actually running, so the debounce window doesn't count. */
    isLoading: isAwaitingResults && fetchStatus === 'fetching',
    /**
     * React Query pauses requests while offline, so without this the old results would sit under
     * the new query with nothing saying they're out of date.
     */
    isWaitingForConnection: isAwaitingResults && fetchStatus === 'paused',
  }
}
