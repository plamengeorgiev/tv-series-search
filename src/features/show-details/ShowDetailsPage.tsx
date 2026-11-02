import { useParams } from 'react-router'
import { useShowDetails } from '../../api/queries'
import { ApiError } from '../../api/tvmazeClient'
import { ErrorState } from '../../components/ErrorState'
import { NotFound } from '../../components/NotFound'
import { SlowConnectionNotice } from '../../components/SlowConnectionNotice'
import { BackToResults } from './BackToResults'
import { ShowDetailsSkeleton } from './ShowDetailsSkeleton'
import { ShowDetailsView } from './ShowDetailsView'

// Number() alone would accept ids like "1e3", " 7" or "0x10" and send them to the API.
function parseShowId(id: string | undefined): number | null {
  if (!id || !/^[1-9]\d*$/.test(id)) return null
  const showId = Number(id)
  return Number.isSafeInteger(showId) ? showId : null
}

export function ShowDetailsPage() {
  const { id } = useParams()
  const showId = parseShowId(id)

  // An id that can't exist isn't worth a request.
  if (showId === null) return <ShowNotFound />

  return <ShowDetailsLoader id={showId} />
}

function ShowDetailsLoader({ id }: { id: number }) {
  const { data: show, error, isPending, refetch } = useShowDetails(id)

  // "Show not found" has its own link back, so it doesn't get the back link above it.
  if (error instanceof ApiError && error.type === 'not-found') return <ShowNotFound />

  function renderContent() {
    if (error) {
      return (
        <ErrorState
          error={error}
          onRetry={() => {
            void refetch()
          }}
        />
      )
    }
    if (isPending) return <ShowDetailsSkeleton />
    return <ShowDetailsView show={show} />
  }

  return (
    <div className="flex flex-col gap-4">
      <BackToResults />
      <SlowConnectionNotice isLoading={isPending && !error} />
      {renderContent()}
    </div>
  )
}

function ShowNotFound() {
  return (
    <NotFound title="Show not found" message="This show doesn’t exist or may have been removed." />
  )
}
