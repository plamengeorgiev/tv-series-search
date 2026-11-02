import { Fragment } from 'react'
import type { ShowDetails } from '../../api/schemas'
import { formatDate } from '../../lib/formatDate'
import { DetailsSection } from './DetailsSection'

interface ShowFactsProps {
  show: ShowDetails
  className?: string
}

/** The "Details" card: status, dates, network and language, leaving out whatever is unknown. */
export function ShowFacts({ show, className }: ShowFactsProps) {
  const channel = show.network ?? show.webChannel
  const facts: [label: string, value: string | null][] = [
    ['Status', show.status],
    ['Premiered', show.premiered && formatDate(show.premiered)],
    ['Ended', show.ended && formatDate(show.ended)],
    ['Network', channel?.name ?? null],
    ['Language', show.language],
  ]

  return (
    <DetailsSection title="Details" variant="card" className={className}>
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
  )
}
