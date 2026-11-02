import { useLocation } from 'react-router'
import type { SearchResult } from '../../api/schemas'
import type { SearchReturnState } from '../../lib/searchReturnState'
import { ShowCard } from './ShowCard'

interface ShowListProps {
  results: SearchResult[]
}

export function ShowList({ results }: ShowListProps) {
  const { search } = useLocation()
  const returnState: SearchReturnState = { fromSearch: search }

  return (
    // auto-fill rather than fixed breakpoints, so the column count follows the space actually available.
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
      {results.map(({ show }) => (
        <li key={show.id}>
          <ShowCard show={show} returnState={returnState} />
        </li>
      ))}
    </ul>
  )
}
