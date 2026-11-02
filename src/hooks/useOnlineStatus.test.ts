import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setOnline } from '../test/setOnline'
import { useOnlineStatus } from './useOnlineStatus'

describe('useOnlineStatus', () => {
  afterEach(() => {
    setOnline(true)
    vi.restoreAllMocks()
  })

  it('starts from navigator.onLine', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)

    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(false)
  })

  it('follows the online and offline events', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    setOnline(false)
    expect(result.current).toBe(false)

    setOnline(true)
    expect(result.current).toBe(true)
  })
})
