import { useState } from 'react'
import type { CastMember } from '../../api/schemas'

// Long-running shows can list 100+ cast members. 12 fills whole rows at 2, 3 and 6 columns.
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
      <h2 id="cast-heading" className="text-xl font-semibold text-gray-900">
        Cast
      </h2>
      {cast.length === 0 ? (
        <p className="text-gray-600">No cast information available.</p>
      ) : (
        <ul id="cast-list" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visibleCast.map(({ person, character }) => (
            // One person can play several characters, so neither id is unique on its own.
            <li
              key={`${String(person.id)}-${String(character.id)}`}
              className="flex flex-col gap-1"
            >
              {person.image ? (
                // The actor's name is right below the photo, so alt text would only repeat it.
                <img
                  src={person.image.medium}
                  alt=""
                  className="aspect-[210/295] w-full rounded object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex aspect-[210/295] w-full items-center justify-center rounded bg-gray-100 text-xs text-gray-500"
                >
                  No image
                </div>
              )}
              <p className="text-sm font-medium text-gray-900">{person.name}</p>
              <p className="text-sm text-gray-600">as {character.name}</p>
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
          className="self-start rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {showAll ? 'Show fewer' : `Show all ${String(cast.length)} cast members`}
        </button>
      )}
    </section>
  )
}
