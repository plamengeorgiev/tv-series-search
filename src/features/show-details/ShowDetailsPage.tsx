import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useShowDetails } from '../../api/queries'
import type { ShowDetails } from '../../api/schemas'
import { ApiError } from '../../api/tvmazeClient'
import { ErrorState } from '../../components/ErrorState'
import { SlowConnectionNotice } from '../../components/SlowConnectionNotice'
import { formatDate } from '../../lib/formatDate'
import { sanitizeHtml } from '../../lib/sanitizeHtml'
import { getSearchReturnState } from '../../lib/searchReturnState'
import { CastList } from './CastList'
import { SeasonList } from './SeasonList'
import { ShowDetailsSkeleton } from './ShowDetailsSkeleton'
import { ShowHero } from './ShowHero'

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
    if (isPending) return <ShowDetailsSkeleton />
    return <ShowDetailsView show={show} />
  }

  return (
    <div className="flex flex-col gap-4">
      <BackToResults />
      <SlowConnectionNotice isLoading={isPending && !error} />
      {renderContent()}
    </div>
  )
}

function BackToResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const returnState = getSearchReturnState(location.state)
  const className = 'self-start text-accent underline hover:text-accent-strong'

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
      <h1 className="text-2xl font-bold text-ink">Show not found</h1>
      <p className="text-ink-muted">This show doesn’t exist or may have been removed.</p>
      <Link to="/" className="text-accent underline hover:text-accent-strong">
        Back to search
      </Link>
    </div>
  )
}

function ShowDetailsView({ show }: { show: ShowDetails }) {
  const channel = show.network ?? show.webChannel

  return (
    <article className="flex flex-col gap-8">
      <ShowHero show={show} />

      {/* DOM order is summary, details, seasons, so the details card sits under the summary on
          phones. On lg: it moves into a sidebar column beside both. */}
      <div className="grid gap-8 lg:grid-cols-3">
        <section aria-labelledby="summary-heading" className="flex flex-col gap-3 lg:col-span-2">
          <h2 id="summary-heading" className="text-xl font-semibold text-ink">
            Summary
          </h2>
          {show.summary ? (
            <div
              className="flex max-w-prose flex-col gap-3 leading-relaxed text-ink"
              // The summary is HTML from the API, so it's sanitized before rendering.
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(show.summary) }}
            />
          ) : (
            <p className="text-ink-muted">No summary available.</p>
          )}
        </section>

        <section
          aria-labelledby="details-heading"
          className="flex flex-col gap-3 self-start rounded-xl border border-line bg-surface p-5 shadow-sm lg:col-start-3 lg:row-span-2 lg:row-start-1"
        >
          <h2 id="details-heading" className="text-lg font-semibold text-ink">
            Details
          </h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-ink-muted">Status</dt>
            <dd className="font-medium text-ink">{show.status}</dd>
            {show.premiered && (
              <>
                <dt className="text-ink-muted">Premiered</dt>
                <dd className="font-medium text-ink">{formatDate(show.premiered)}</dd>
              </>
            )}
            {show.ended && (
              <>
                <dt className="text-ink-muted">Ended</dt>
                <dd className="font-medium text-ink">{formatDate(show.ended)}</dd>
              </>
            )}
            {channel && (
              <>
                <dt className="text-ink-muted">Network</dt>
                <dd className="font-medium text-ink">{channel.name}</dd>
              </>
            )}
            {show.language && (
              <>
                <dt className="text-ink-muted">Language</dt>
                <dd className="font-medium text-ink">{show.language}</dd>
              </>
            )}
          </dl>
        </section>

        <div className="lg:col-span-2">
          <SeasonList seasons={show._embedded.seasons} />
        </div>
      </div>

      <CastList cast={show._embedded.cast} />
    </article>
  )
}
