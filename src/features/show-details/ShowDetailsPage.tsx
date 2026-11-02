import { useParams } from 'react-router'
import { useShowDetails } from '../../api/queries'
import type { ShowDetails } from '../../api/schemas'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { formatDate } from '../../lib/formatDate'
import { sanitizeHtml } from '../../lib/sanitizeHtml'
import { CastList } from './CastList'
import { SeasonList } from './SeasonList'

export function ShowDetailsPage() {
  const { id } = useParams()
  const { data: show, error, isPending, refetch } = useShowDetails(Number(id))

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
