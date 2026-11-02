import type { ShowDetails } from '../../api/schemas'
import { CastList } from './CastList'
import { SeasonList } from './SeasonList'
import { ShowFacts } from './ShowFacts'
import { ShowHero } from './ShowHero'
import { ShowSummary } from './ShowSummary'

interface ShowDetailsViewProps {
  show: ShowDetails
}

/** Lays out a loaded show. Each section's grid placement is set here, so the layout reads in one place. */
export function ShowDetailsView({ show }: ShowDetailsViewProps) {
  return (
    <article className="flex flex-col gap-8">
      <ShowHero show={show} />

      {/* DOM order is summary, details, seasons, so the details card sits under the summary on
          phones. On lg: it moves into a sidebar column beside both. */}
      <div className="grid gap-8 lg:grid-cols-3">
        <ShowSummary summary={show.summary} className="lg:col-span-2" />
        <ShowFacts show={show} className="self-start lg:col-start-3 lg:row-span-2 lg:row-start-1" />
        <SeasonList seasons={show._embedded.seasons} className="lg:col-span-2" />
      </div>

      <CastList cast={show._embedded.cast} />
    </article>
  )
}
