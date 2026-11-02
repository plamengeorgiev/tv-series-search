import { ApiError } from '../api/tvmazeClient'

interface ErrorStateProps {
  error: Error
  onRetry: () => void
}

// Only errors the user can act on get their own message. The technical details belong in logs.
function describeError(error: Error): string {
  if (error instanceof ApiError && error.type === 'network') {
    return 'Check your internet connection and try again.'
  }
  if (error instanceof ApiError && error.type === 'rate-limited') {
    return 'Too many requests. Wait a few seconds and try again.'
  }
  return 'We couldn’t load this right now. Please try again.'
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-danger-line bg-danger-surface px-4 py-8 text-center"
    >
      <p className="font-semibold text-danger-ink">Something went wrong</p>
      <p className="text-sm text-danger-ink">{describeError(error)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-on-danger hover:bg-danger-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
      >
        Retry
      </button>
    </div>
  )
}
