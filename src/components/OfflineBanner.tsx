import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <p
      role="status"
      className="bg-inverse px-4 py-2 text-center text-sm font-medium text-on-inverse"
    >
      You’re offline. We’ll carry on as soon as your connection is back.
    </p>
  )
}
