import { useSearchParams } from 'react-router'
import { useShowSearch } from '../../api/queries'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { SearchInput } from './SearchInput'

// Long enough to skip intermediate keystrokes, which keeps us under TVmaze's rate limit.
const SEARCH_DEBOUNCE_MS = 300

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)

  useShowSearch(debouncedQuery)

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
    </>
  )
}
