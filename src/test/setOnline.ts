import { act } from '@testing-library/react'
import { vi } from 'vitest'

/**
 * Simulates the browser going on- or offline. React Query's onlineManager listens to the same
 * events, so this pauses and resumes its requests too. Call `setOnline(true)` in `afterEach`:
 * onlineManager is global, so a test that ends offline would pause every later test's requests.
 */
export function setOnline(isOnline: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(isOnline)
  act(() => {
    window.dispatchEvent(new Event(isOnline ? 'online' : 'offline'))
  })
}
