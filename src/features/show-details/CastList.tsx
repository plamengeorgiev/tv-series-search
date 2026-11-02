import { useId, useState } from 'react'
import type { CastMember } from '../../api/schemas'
import { Poster } from '../../components/Poster'
import { DetailsSection } from './DetailsSection'

// Long-running shows can list 100+ cast members. 12 fills whole rows at 2, 3, 4 and 6 columns.
const INITIAL_CAST_COUNT = 12

interface CastListProps {
  cast: CastMember[]
}

export function CastList({ cast }: CastListProps) {
  const [showAll, setShowAll] = useState(false)
  const listId = useId()
  const isTruncated = cast.length > INITIAL_CAST_COUNT
  const visibleCast = showAll ? cast : cast.slice(0, INITIAL_CAST_COUNT)

  return (
    <DetailsSection title="Cast">
      {cast.length === 0 ? (
        <p className="text-ink-muted">No cast information available.</p>
      ) : (
        <ul
          id={listId}
          className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {visibleCast.map(({ person, character }) => (
            // One person can play several characters, so neither id is unique on its own.
            <li
              key={`${String(person.id)}-${String(character.id)}`}
              className="flex flex-col gap-0.5"
            >
              {/* The actor's name is right below the photo, so alt text would only repeat it. */}
              <Poster
                src={person.image?.medium}
                alt=""
                className="mb-1 w-full rounded-lg bg-surface-muted text-xs shadow-sm"
              />
              <p className="text-sm leading-snug font-medium text-ink">{person.name}</p>
              <p className="text-sm leading-snug text-ink-muted">as {character.name}</p>
            </li>
          ))}
        </ul>
      )}
      {isTruncated && (
        <button
          type="button"
          aria-expanded={showAll}
          aria-controls={listId}
          onClick={() => {
            setShowAll((current) => !current)
          }}
          className="btn-secondary self-start px-3 py-1.5"
        >
          {showAll ? 'Show fewer' : `Show all ${String(cast.length)} cast members`}
        </button>
      )}
    </DetailsSection>
  )
}
