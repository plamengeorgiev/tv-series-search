import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useShowDetails } from '../../api/queries'
import type { ShowDetails } from '../../api/schemas'
import { ApiError } from '../../api/tvmazeClient'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { formatDate } from '../../lib/formatDate'
import { sanitizeHtml } from '../../lib/sanitizeHtml'
import { getSearchReturnState } from '../../lib/searchReturnState'
import { CastList } from './CastList'
import { SeasonList } from './SeasonList'

// Number() alone would accept ids like "1e3", " 7" or "0x10" and send them to the API.
function parseShowId(id: string | undefined): number | null {
  if (!id || !/^[1-9]\d*$/.test(id)) return null
  const showId = Number(id)
  return Number.isSafeInteger(showId) ? showId : null
}

export function ShowDetailsPage() {
  const { id } = useParams()
  const showId = parseShowId(id)

  // An id that can't exist isn't worth a request.
  if (showId === null) return <ShowNotFound />

  return <ShowDetailsLoader id={showId} />
}

function ShowDetailsLoader({ id }: { id: number }) {
  const { data: show, error, isPending, refetch } = useShowDetails(id)

  // "Show not found" has its own link back, so it doesn't get the back link above it.
  if (error instanceof ApiError && error.type === 'not-found') return <ShowNotFound />

  function renderContent() {
    if (error) {
      return (
        <ErrorState
          error={error}
          onRetry={() => {
            void refetch()
          }}
        />
      )
    }
    if (isPending) return <LoadingState message="Loading show…" />
    return <ShowDetailsView show={show} />
  }

  return (
    <div className="flex flex-col gap-4">
      <BackToResults />
      {renderContent()}
    </div>
  )
}

function BackToResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const returnState = getSearchReturnState(location.state)
  const className = 'self-start text-blue-700 underline hover:text-blue-900'

  // Deep links and refreshes have no search to return to.
  if (!returnState) {
    return (
      <Link to="/" className={className}>
        <span aria-hidden="true">← </span>Back to search
      </Link>
    )
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks open the results in a new tab through the href.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    // Going back, rather than pushing a new entry, keeps the search page's history and scroll position.
    event.preventDefault()
    void navigate(-1)
  }

  return (
    <Link
      to={{ pathname: '/', search: returnState.fromSearch }}
      onClick={handleClick}
      className={className}
    >
      <span aria-hidden="true">← </span>Back to results
    </Link>
  )
}

function ShowNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Show not found</h1>
      <p className="text-gray-600">This show doesn’t exist or may have been removed.</p>
      <Link to="/" className="text-blue-700 underline hover:text-blue-900">
        Back to search
      </Link>
    </div>
  )
}

function ShowDetailsView({ show }: { show: ShowDetails }) {
  const channel = show.network ?? show.webChannel
  const rating = show.rating.average

  return (
    <article className="flex flex-col gap-6">
      {show.image ? (
        <img
          src={show.image.original}
          alt={`${show.name} poster`}
          className="aspect-[210/295] w-48 rounded-lg object-cover shadow"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[210/295] w-48 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500"
        >
          No image
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{show.name}</h1>

        {show.genres.length > 0 && (
          <ul aria-label="Genres" className="flex flex-wrap gap-2">
            {show.genres.map((genre) => (
              <li key={genre} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {genre}
              </li>
            ))}
          </ul>
        )}

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="font-medium text-gray-600">Status</dt>
          <dd>{show.status}</dd>
          {show.premiered && (
            <>
              <dt className="font-medium text-gray-600">Premiered</dt>
              <dd>{formatDate(show.premiered)}</dd>
            </>
          )}
          {show.ended && (
            <>
              <dt className="font-medium text-gray-600">Ended</dt>
              <dd>{formatDate(show.ended)}</dd>
            </>
          )}
          {channel && (
            <>
              <dt className="font-medium text-gray-600">Network</dt>
              <dd>{channel.name}</dd>
            </>
          )}
          <dt className="font-medium text-gray-600">Rating</dt>
          <dd>{rating === null ? 'Not rated' : `${String(rating)} / 10`}</dd>
        </dl>

        {show.summary ? (
          <div
            className="flex flex-col gap-2 text-gray-800"
            // The summary is HTML from the API, so it's sanitized before rendering.
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(show.summary) }}
          />
        ) : (
          <p className="text-gray-600">No summary available.</p>
        )}

        {show.officialSite && (
          <a
            href={show.officialSite}
            target="_blank"
            rel="noreferrer"
            className="self-start text-blue-700 underline hover:text-blue-900"
          >
            Official site
          </a>
        )}
      </div>

      <SeasonList seasons={show._embedded.seasons} />
      <CastList cast={show._embedded.cast} />
    </article>
  )
}
