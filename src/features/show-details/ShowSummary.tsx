import { sanitizeHtml } from '../../lib/sanitizeHtml'
import { DetailsSection } from './DetailsSection'

interface ShowSummaryProps {
  summary: string | null
  className?: string
}

export function ShowSummary({ summary, className }: ShowSummaryProps) {
  return (
    <DetailsSection title="Summary" className={className}>
      {summary ? (
        <div
          className="flex max-w-prose flex-col gap-3 leading-relaxed text-ink"
          // The summary is HTML from the API, so it's sanitized before rendering.
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(summary) }}
        />
      ) : (
        <p className="text-ink-muted">No summary available.</p>
      )}
    </DetailsSection>
  )
}
