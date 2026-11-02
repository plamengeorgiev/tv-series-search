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
      className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center"
    >
      <p className="font-semibold text-red-800">Something went wrong</p>
      <p className="text-sm text-red-700">{describeError(error)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Retry
      </button>
    </div>
  )
}
