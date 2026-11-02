import type { SearchResult } from '../../api/schemas'
import { ShowCard } from './ShowCard'

interface ShowListProps {
  results: SearchResult[]
}

export function ShowList({ results }: ShowListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map(({ show }) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  )
}
