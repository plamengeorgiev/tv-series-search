import type { Season } from '../../api/schemas'
import { formatDate } from '../../lib/formatDate'

interface SeasonListProps {
  seasons: Season[]
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

export function SeasonList({ seasons }: SeasonListProps) {
  return (
    <section aria-labelledby="seasons-heading" className="flex flex-col gap-3">
      <h2 id="seasons-heading" className="text-xl font-semibold text-ink">
        Seasons
      </h2>
      {seasons.length === 0 ? (
        <p className="text-ink-muted">No season information available.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line">
          <table aria-labelledby="seasons-heading" className="w-full text-left text-sm">
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
    </section>
  )
}
