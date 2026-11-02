import { useDelayedFlag } from '../hooks/useDelayedFlag'

// Most TVmaze responses arrive well under a second, so 3s means something is off.
const SLOW_REQUEST_MS = 3000

interface SlowConnectionNoticeProps {
  isLoading: boolean
}

export function SlowConnectionNotice({ isLoading }: SlowConnectionNoticeProps) {
  const isSlow = useDelayedFlag(isLoading, SLOW_REQUEST_MS)

  if (!isSlow) return null

  return (
    <p
      role="status"
      className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800"
    >
      This is taking longer than usual…
    </p>
  )
}
