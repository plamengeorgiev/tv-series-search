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
      className="rounded-md border border-warning-line bg-warning-surface px-4 py-2 text-center text-sm text-warning-ink"
    >
      This is taking longer than usual…
    </p>
  )
}
