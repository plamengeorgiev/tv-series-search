import { ApiError } from '../api/tvmazeClient'
import { ErrorPanel } from './ErrorPanel'

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
  return <ErrorPanel message={describeError(error)} actionLabel="Retry" onAction={onRetry} />
}
