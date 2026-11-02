import { Link, useLocation } from 'react-router'
import type { Show } from '../../api/schemas'
import { Poster } from '../../components/Poster'
import { getYear } from '../../lib/formatDate'
import type { SearchReturnState } from '../../lib/searchReturnState'

interface ShowCardProps {
  show: Show
}

export function ShowCard({ show }: ShowCardProps) {
  const year = getYear(show.premiered)
  const rating = show.rating.average
  const { search } = useLocation()
  const returnState: SearchReturnState = { fromSearch: search }

  return (
    <Link
      to={`/shows/${String(show.id)}`}
      state={returnState}
      // A compact row on phones, so more results fit on screen. A poster card from sm: up.
      className="group focus-ring flex h-full gap-4 overflow-hidden rounded-lg border border-line bg-surface p-3 text-left shadow-sm transition hover:border-line-strong hover:shadow-md sm:flex-col sm:gap-0 sm:p-0"
    >
      {/* The show name is right next to the poster, so alt text would only repeat it. */}
      <Poster
        src={show.image?.medium}
        alt=""
        className="w-20 shrink-0 rounded bg-surface-muted text-xs transition-transform group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:w-full sm:rounded-none sm:text-sm"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:p-3">
        <h2 className="text-lg font-semibold text-ink sm:text-base">{show.name}</h2>
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
