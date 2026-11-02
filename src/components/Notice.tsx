import type { ReactNode } from 'react'

const toneClasses = {
  neutral: 'border-line bg-surface-muted text-ink-muted',
  warning: 'border-warning-line bg-warning-surface text-warning-ink',
}

interface NoticeProps {
  tone: keyof typeof toneClasses
  children: ReactNode
}

/** A one-line status message about the request in progress, announced politely to screen readers. */
export function Notice({ tone, children }: NoticeProps) {
  return (
    <p
      role="status"
      className={`rounded-md border px-4 py-2 text-center text-sm ${toneClasses[tone]}`}
    >
      {children}
    </p>
  )
}
