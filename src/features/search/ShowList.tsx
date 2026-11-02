import type { SearchResult } from '../../api/schemas'
import { ShowCard } from './ShowCard'

interface ShowListProps {
  results: SearchResult[]
}

export function ShowList({ results }: ShowListProps) {
  return (
    // auto-fill rather than fixed breakpoints, so the column count follows the space actually available.
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-4">
      {results.map(({ show }) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  )
}
