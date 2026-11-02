import { useSearchParams } from 'react-router'
import { useShowSearch } from '../../api/queries'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { SearchInput } from './SearchInput'
import { ShowList } from './ShowList'

// Long enough to skip intermediate keystrokes, which keeps us under TVmaze's rate limit.
const SEARCH_DEBOUNCE_MS = 300

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)

  const { data: results } = useShowSearch(debouncedQuery)
  // keepPreviousData would otherwise keep showing the last results after the input is cleared.
  const hasQuery = query.trim() !== ''

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
      <h1>Search TV shows</h1>
      <SearchInput value={query} onChange={handleQueryChange} />
      {hasQuery && results && <ShowList results={results} />}
    </>
  )
}
