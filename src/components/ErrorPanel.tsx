import type { ReactNode } from 'react'

interface ErrorPanelProps {
  message: string
  actionLabel: string
  onAction: () => void
  /** Use h1 when the panel replaces the whole page, so the page still has a heading. */
  titleAs?: 'h1' | 'p'
  /** Secondary actions, shown after the main button. */
  children?: ReactNode
}

export function ErrorPanel({
  message,
  actionLabel,
  onAction,
  titleAs: Title = 'p',
  children,
}: ErrorPanelProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-danger-line bg-danger-surface px-4 py-8 text-center"
    >
      <Title className="font-semibold text-danger-ink">Something went wrong</Title>
      <p className="text-sm text-danger-ink">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAction}
          className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-on-danger hover:bg-danger-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
        >
          {actionLabel}
        </button>
        {children}
      </div>
    </div>
  )
}
