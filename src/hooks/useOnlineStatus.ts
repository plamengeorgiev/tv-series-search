import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

function getSnapshot() {
  return navigator.onLine
}

/**
 * Whether the browser thinks it has a network connection, updated on `online`/`offline` events.
 *
 * Unlike React Query's onlineManager, this reads navigator.onLine on startup. A wrong "offline"
 * here only shows a needless banner, while in onlineManager it would pause every request.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}
