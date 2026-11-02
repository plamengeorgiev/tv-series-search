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
      <h2 id="seasons-heading" className="text-xl font-semibold text-ink">
        Seasons
      </h2>
      {seasons.length === 0 ? (
        <p className="text-ink-muted">No season information available.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
          {seasons.map((season) => {
            const details = formatSeasonDetails(season)
            return (
              <li key={season.id} className="flex flex-col gap-1 px-4 py-3">
                <h3 className="font-medium text-ink">
                  Season {season.number}
                  {/* Most seasons have an empty name, but some are titled (e.g. "Book One"). */}
                  {season.name && `: ${season.name}`}
                </h3>
                {details && <p className="text-sm text-ink-muted">{details}</p>}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
