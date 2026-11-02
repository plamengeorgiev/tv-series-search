import { Fragment, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useShowDetails } from '../../api/queries'
import type { ShowDetails } from '../../api/schemas'
import { ApiError } from '../../api/tvmazeClient'
import { ErrorState } from '../../components/ErrorState'
import { NotFound } from '../../components/NotFound'
import { SlowConnectionNotice } from '../../components/SlowConnectionNotice'
import { formatDate } from '../../lib/formatDate'
import { sanitizeHtml } from '../../lib/sanitizeHtml'
import { getSearchReturnState } from '../../lib/searchReturnState'
import { CastList } from './CastList'
import { DetailsSection } from './DetailsSection'
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
  const className = 'btn-secondary inline-flex items-center gap-1.5 self-start py-1.5 pr-3 pl-2'

  // Deep links and refreshes have no search to return to.
  if (!returnState) {
    return (
      <Link to="/" className={className}>
        <BackArrow />
        Back to search
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
      <BackArrow />
      Back to results
    </Link>
  )
}

function BackArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4 text-ink-muted"
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ShowNotFound() {
  return (
    <NotFound title="Show not found" message="This show doesn’t exist or may have been removed." />
  )
}

function ShowDetailsView({ show }: { show: ShowDetails }) {
  const channel = show.network ?? show.webChannel
  const facts: [label: string, value: string | null][] = [
    ['Status', show.status],
    ['Premiered', show.premiered && formatDate(show.premiered)],
    ['Ended', show.ended && formatDate(show.ended)],
    ['Network', channel?.name ?? null],
    ['Language', show.language],
  ]

  return (
    <article className="flex flex-col gap-8">
      <ShowHero show={show} />

      {/* DOM order is summary, details, seasons, so the details card sits under the summary on
          phones. On lg: it moves into a sidebar column beside both. */}
      <div className="grid gap-8 lg:grid-cols-3">
        <DetailsSection title="Summary" className="lg:col-span-2">
          {show.summary ? (
            <div
              className="flex max-w-prose flex-col gap-3 leading-relaxed text-ink"
              // The summary is HTML from the API, so it's sanitized before rendering.
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(show.summary) }}
            />
          ) : (
            <p className="text-ink-muted">No summary available.</p>
          )}
        </DetailsSection>

        <DetailsSection
          title="Details"
          variant="card"
          className="self-start lg:col-start-3 lg:row-span-2 lg:row-start-1"
        >
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {facts.map(
              ([label, value]) =>
                value && (
                  <Fragment key={label}>
                    <dt className="text-ink-muted">{label}</dt>
                    <dd className="font-medium text-ink">{value}</dd>
                  </Fragment>
                ),
            )}
          </dl>
        </DetailsSection>

        <div className="lg:col-span-2">
          <SeasonList seasons={show._embedded.seasons} />
        </div>
      </div>

      <CastList cast={show._embedded.cast} />
    </article>
  )
}
