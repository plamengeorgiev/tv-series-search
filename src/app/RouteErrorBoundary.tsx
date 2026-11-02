import { useEffect } from 'react'
import { Link, useRouteError } from 'react-router'
import { reportError } from '../lib/reportError'
import { ErrorPanel } from '../components/ErrorPanel'
import { PageTitle } from '../components/PageTitle'

// A render crash is a bug rather than something the user can fix, so the message stays generic.
export function RouteErrorBoundary() {
  const error = useRouteError()

  useEffect(() => {
    reportError(error, { source: 'route' })
  }, [error])

  return (
    <>
      <PageTitle title="Something went wrong" />
      <ErrorPanel
        titleAs="h1"
        message="An unexpected error occurred. Try reloading the page or go back to search."
        actionLabel="Reload page"
        onAction={() => {
          window.location.reload()
        }}
      >
        <Link to="/" className="text-sm font-medium text-danger-ink underline">
          Back to search
        </Link>
      </ErrorPanel>
    </>
  )
}
