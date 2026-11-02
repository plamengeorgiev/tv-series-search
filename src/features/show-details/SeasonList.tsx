import type { Season } from '../../api/schemas'
import { formatDate } from '../../lib/formatDate'

interface SeasonListProps {
  seasons: Season[]
}

function formatEpisodeCount(count: number): string {
  return `${String(count)} ${count === 1 ? 'episode' : 'episodes'}`
}

function formatDateRange(premiereDate: string, endDate: string | null): string {
  return endDate
    ? `${formatDate(premiereDate)} – ${formatDate(endDate)}`
    : `From ${formatDate(premiereDate)}`
}

// Upcoming seasons often have no episode count or dates yet, so each part is optional.
function formatSeasonDetails({ episodeOrder, premiereDate, endDate }: Season): string {
  const parts: string[] = []
  if (episodeOrder !== null) parts.push(formatEpisodeCount(episodeOrder))
  if (premiereDate) parts.push(formatDateRange(premiereDate, endDate))
  return parts.join(' · ')
}

export function SeasonList({ seasons }: SeasonListProps) {
  return (
    <section aria-labelledby="seasons-heading" className="flex flex-col gap-3">
      <h2 id="seasons-heading" className="text-xl font-semibold text-gray-900">
        Seasons
      </h2>
      {seasons.length === 0 ? (
        <p className="text-gray-600">No season information available.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-200 rounded-lg border border-gray-200">
          {seasons.map((season) => {
            const details = formatSeasonDetails(season)
            return (
              <li key={season.id} className="flex flex-col gap-1 px-4 py-3">
                <h3 className="font-medium text-gray-900">
                  Season {season.number}
                  {/* Most seasons have an empty name, but some are titled (e.g. "Book One"). */}
                  {season.name && `: ${season.name}`}
                </h3>
                {details && <p className="text-sm text-gray-600">{details}</p>}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
