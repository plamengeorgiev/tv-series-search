import { useState } from 'react'
import type { CastMember } from '../../api/schemas'

// Long-running shows can list 100+ cast members. 12 fills whole rows at 2, 3, 4 and 6 columns.
const INITIAL_CAST_COUNT = 12

interface CastListProps {
  cast: CastMember[]
}

export function CastList({ cast }: CastListProps) {
  const [showAll, setShowAll] = useState(false)
  const isTruncated = cast.length > INITIAL_CAST_COUNT
  const visibleCast = showAll ? cast : cast.slice(0, INITIAL_CAST_COUNT)

  return (
    <section aria-labelledby="cast-heading" className="flex flex-col gap-3">
      <h2 id="cast-heading" className="text-xl font-semibold text-ink">
        Cast
      </h2>
      {cast.length === 0 ? (
        <p className="text-ink-muted">No cast information available.</p>
      ) : (
        <ul
          id="cast-list"
          className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {visibleCast.map(({ person, character }) => (
            // One person can play several characters, so neither id is unique on its own.
            <li
              key={`${String(person.id)}-${String(character.id)}`}
              className="flex flex-col gap-0.5"
            >
              {person.image ? (
                // The actor's name is right below the photo, so alt text would only repeat it.
                <img
                  src={person.image.medium}
                  alt=""
                  className="mb-1 aspect-[210/295] w-full rounded-lg object-cover shadow-sm"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="mb-1 flex aspect-[210/295] w-full items-center justify-center rounded-lg bg-surface-muted text-xs text-ink-muted"
                >
                  No image
                </div>
              )}
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
          aria-controls="cast-list"
          onClick={() => {
            setShowAll((current) => !current)
          }}
          className="self-start rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-sm transition hover:border-line-strong hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {showAll ? 'Show fewer' : `Show all ${String(cast.length)} cast members`}
        </button>
      )}
    </section>
  )
}
