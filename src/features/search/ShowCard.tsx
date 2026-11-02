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
      className="flex h-full gap-4 rounded-lg border border-line bg-surface p-3 text-left shadow-sm transition hover:border-line-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
          className="flex aspect-[210/295] w-20 shrink-0 items-center justify-center rounded bg-surface-muted text-center text-xs text-ink-muted sm:w-24"
        >
          No image
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-lg font-semibold text-ink">{show.name}</h2>
        {year && <p className="text-sm text-ink-muted">{year}</p>}
        {show.genres.length > 0 && (
          <p className="text-sm text-ink-muted">{show.genres.join(', ')}</p>
        )}
        <p className="mt-auto text-sm text-ink-muted">
          {rating === null ? (
            'Not rated'
          ) : (
            <>
              <span className="sr-only">Rating</span>{' '}
              <span aria-hidden="true" className="text-rating">
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
