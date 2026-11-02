import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { Notice } from '../../components/Notice'
import { PageTitle } from '../../components/PageTitle'
import { SlowConnectionNotice } from '../../components/SlowConnectionNotice'
import { SearchInput } from './SearchInput'
import { ShowList } from './ShowList'
import { useSearchResults, type SearchResultsView } from './useSearchResults'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { searchedQuery, view, isLoading, isWaitingForConnection } = useSearchResults(query)

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
      <PageTitle title={searchedQuery ? `Results for “${searchedQuery}”` : undefined} />
      <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Search TV shows</h1>
      <SearchInput value={query} onChange={handleQueryChange} />
      <SlowConnectionNotice isLoading={isLoading} />
      {isWaitingForConnection && (
        <Notice tone="neutral">
          You’re offline. We’ll search for “{searchedQuery}” when your connection is back.
        </Notice>
      )}
      <SearchResults view={view} searchedQuery={searchedQuery} />
    </>
  )
}

interface SearchResultsProps {
  view: SearchResultsView
  searchedQuery: string
}

function SearchResults({ view, searchedQuery }: SearchResultsProps) {
  switch (view.status) {
    case 'idle':
      return <ResultsMessage>Type a show name to start searching.</ResultsMessage>
    case 'error':
      return <ErrorState error={view.error} onRetry={view.retry} />
    case 'loading':
      return <LoadingState message="Searching…" />
    case 'empty':
      return <ResultsMessage>No shows found for “{searchedQuery}”.</ResultsMessage>
    case 'results':
      return (
        <div
          aria-busy={view.isStale}
          className={view.isStale ? 'opacity-60 transition-opacity' : 'transition-opacity'}
        >
          <ShowList results={view.results} />
        </div>
      )
  }
}

function ResultsMessage({ children }: { children: ReactNode }) {
  return <p className="py-12 text-center text-ink-muted">{children}</p>
}
