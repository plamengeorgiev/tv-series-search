import { useDelayedFlag } from '../hooks/useDelayedFlag'
import { Notice } from './Notice'

// Most TVmaze responses arrive well under a second, so 3s means something is off.
const SLOW_REQUEST_MS = 3000

interface SlowConnectionNoticeProps {
  isLoading: boolean
}

export function SlowConnectionNotice({ isLoading }: SlowConnectionNoticeProps) {
  const isSlow = useDelayedFlag(isLoading, SLOW_REQUEST_MS)

  if (!isSlow) return null

  return <Notice tone="warning">This is taking longer than usual…</Notice>
}
