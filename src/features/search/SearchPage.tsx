import { useSearchParams } from 'react-router'
import { useShowSearch } from '../../api/queries'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { SlowConnectionNotice } from '../../components/SlowConnectionNotice'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { SearchInput } from './SearchInput'
import { ShowList } from './ShowList'

// Long enough to skip intermediate keystrokes, which keeps us under TVmaze's rate limit.
const SEARCH_DEBOUNCE_MS = 300

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)

  const {
    data: results,
    error,
    fetchStatus,
    isFetching,
    isPending,
    isPlaceholderData,
    refetch,
  } = useShowSearch(debouncedQuery)
  // keepPreviousData would otherwise keep showing the last results after the input is cleared.
  const hasQuery = query.trim() !== ''
  // True while the results for the current query are still on their way:
  // - isPending: the first search, when there are no results to show yet.
  // - isPlaceholderData: a later search. keepPreviousData keeps the old results on screen,
  //   which makes isPending false even though the new results haven't arrived.
  // - isFetching: a request is actually running. This leaves out the debounce window, when
  //   isPending is already true but nothing has been sent.
  const isLoadingResults = hasQuery && isFetching && (isPending || isPlaceholderData)
  // React Query pauses requests while offline, so without this the old results would sit under
  // the new query with nothing saying they're out of date.
  const isWaitingForConnection =
    hasQuery && fetchStatus === 'paused' && (isPending || isPlaceholderData)

  function renderResults() {
    if (!hasQuery) {
      return (
        <p className="py-12 text-center text-ink-muted">Type a show name to start searching.</p>
      )
    }
    if (error) {
      return (
        <ErrorState
          error={error}
          onRetry={() => {
            void refetch()
          }}
        />
      )
    }
    // Also covers the debounce window, when the query is typed but not sent yet.
    // An empty placeholder would claim the new query has no results before it has been searched.
    if (isPending || (isPlaceholderData && results.length === 0)) {
      return <LoadingState message="Searching…" />
    }
    if (results.length === 0) {
      return (
        <p className="py-12 text-center text-ink-muted">
          No shows found for “{debouncedQuery.trim()}”.
        </p>
      )
    }
    return (
      <div
        aria-busy={isPlaceholderData}
        className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}
      >
        <ShowList results={results} />
      </div>
    )
  }

  function handleQueryChange(value: string) {
    setSearchParams(
      (params) => {
        if (value) params.set('q', value)
        else params.delete('q')
        return params
      },
      // One history entry per keystroke would make the back button useless.
      { replace: true },
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Search TV shows</h1>
      <SearchInput value={query} onChange={handleQueryChange} />
      <SlowConnectionNotice isLoading={isLoadingResults} />
      {isWaitingForConnection && (
        <p
          role="status"
          className="rounded-md border border-line bg-surface-muted px-4 py-2 text-center text-sm text-ink-muted"
        >
          You’re offline. We’ll search for “{debouncedQuery.trim()}” when your connection is back.
        </p>
      )}
      {renderResults()}
    </>
  )
}
