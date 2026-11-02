interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-12 text-gray-600">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:animate-none"
      />
      {message}
    </div>
  )
}
