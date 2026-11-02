import { Link, useLocation } from 'react-router'
import type { Show } from '../../api/schemas'
import type { SearchReturnState } from '../../lib/searchReturnState'

interface ShowCardProps {
  show: Show
}

export function ShowCard({ show }: ShowCardProps) {
  const year = show.premiered?.slice(0, 4)
  const rating = show.rating.average
  const { search } = useLocation()
  const returnState: SearchReturnState = { fromSearch: search }

  return (
    <Link
      to={`/shows/${String(show.id)}`}
      state={returnState}
      className="flex h-full gap-4 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-gray-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      {show.image ? (
        // The show name is right next to the poster, so alt text would only repeat it.
        <img
          src={show.image.medium}
          alt=""
          className="aspect-[210/295] w-20 shrink-0 rounded object-cover sm:w-24"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[210/295] w-20 shrink-0 items-center justify-center rounded bg-gray-100 text-center text-xs text-gray-500 sm:w-24"
        >
          No image
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-900">{show.name}</h2>
        {year && <p className="text-sm text-gray-600">{year}</p>}
        {show.genres.length > 0 && (
          <p className="text-sm text-gray-600">{show.genres.join(', ')}</p>
        )}
        <p className="mt-auto text-sm text-gray-700">
          {rating === null ? (
            'Not rated'
          ) : (
            <>
              <span className="sr-only">Rating</span>{' '}
              <span aria-hidden="true" className="text-amber-500">
                ★
              </span>{' '}
              {rating}
            </>
          )}
        </p>
      </div>
    </Link>
  )
}
