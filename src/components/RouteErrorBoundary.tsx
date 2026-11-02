import { useEffect } from 'react'
import { Link, useRouteError } from 'react-router'
import { reportError } from '../lib/reportError'

// A render crash is a bug rather than something the user can fix, so the message stays generic.
export function RouteErrorBoundary() {
  const error = useRouteError()

  useEffect(() => {
    reportError(error, { source: 'route' })
  }, [error])

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center"
    >
      <h1 className="font-semibold text-red-800">Something went wrong</h1>
      <p className="text-sm text-red-700">
        An unexpected error occurred. Try reloading the page, or go back to search.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            window.location.reload()
          }}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          Reload page
        </button>
        <Link to="/" className="text-sm font-medium text-red-800 underline">
          Back to search
        </Link>
      </div>
    </div>
  )
}
