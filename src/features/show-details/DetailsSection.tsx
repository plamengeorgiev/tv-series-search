import { useId, type ReactNode } from 'react'

interface DetailsSectionProps {
  title: string
  /** `card` puts the section on a bordered surface with a smaller heading, for side content. */
  variant?: 'plain' | 'card'
  /** Placement within the page grid. */
  className?: string
  children: ReactNode
}

/** A titled section of the details page, labelled by its heading for screen reader navigation. */
export function DetailsSection({
  title,
  variant = 'plain',
  className = '',
  children,
}: DetailsSectionProps) {
  const headingId = useId()
  const isCard = variant === 'card'

  return (
    <section
      aria-labelledby={headingId}
      className={`flex flex-col gap-3 ${isCard ? 'rounded-xl border border-line bg-surface p-5 shadow-sm' : ''} ${className}`}
    >
      <h2 id={headingId} className={`font-semibold text-ink ${isCard ? 'text-lg' : 'text-xl'}`}>
        {title}
      </h2>
      {children}
    </section>
  )
}
