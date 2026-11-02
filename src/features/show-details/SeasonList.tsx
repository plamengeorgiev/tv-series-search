import type { Season } from '../../api/schemas'
import { formatDate } from '../../lib/formatDate'
import { DetailsSection } from './DetailsSection'

interface SeasonListProps {
  seasons: Season[]
  className?: string
}

function formatDateRange(premiereDate: string, endDate: string | null): string {
  return endDate
    ? `${formatDate(premiereDate)} – ${formatDate(endDate)}`
    : `From ${formatDate(premiereDate)}`
}

// Upcoming seasons often have no episode count or dates yet.
function NotAnnounced() {
  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">Not announced</span>
    </>
  )
}

export function SeasonList({ seasons, className }: SeasonListProps) {
  return (
    <DetailsSection title="Seasons" className={className}>
      {seasons.length === 0 ? (
        <p className="text-ink-muted">No season information available.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            {/* The visible section heading already says this, so the caption is for screen readers. */}
            <caption className="sr-only">Seasons</caption>
            <thead className="bg-surface-muted text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  Season
                </th>
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  Episodes
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Aired
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {seasons.map(({ id, number, name, episodeOrder, premiereDate, endDate }) => (
                <tr key={id}>
                  <th scope="row" className="px-4 py-2.5 font-medium text-ink">
                    Season {number}
                    {/* Most seasons have an empty name, but some are titled (e.g. "Book One"). */}
                    {name && `: ${name}`}
                  </th>
                  <td className="px-4 py-2.5 text-right text-ink-muted tabular-nums">
                    {episodeOrder ?? <NotAnnounced />}
                  </td>
                  <td className="px-4 py-2.5 text-ink-muted">
                    {premiereDate ? formatDateRange(premiereDate, endDate) : <NotAnnounced />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailsSection>
  )
}
