import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDelayedFlag } from './useDelayedFlag'

describe('useDelayedFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays false while the flag is off', () => {
    const { result } = renderHook(() => useDelayedFlag(false, 3000))

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current).toBe(false)
  })

  it('turns true only after the flag has been on for the delay', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 3000))

    act(() => {
      vi.advanceTimersByTime(2999)
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(true)
  })

  it('turns false as soon as the flag turns off', () => {
    const { result, rerender } = renderHook(({ flag }) => useDelayedFlag(flag, 3000), {
      initialProps: { flag: true },
    })
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    rerender({ flag: false })

    expect(result.current).toBe(false)
  })

  it('starts the delay over when the flag turns on again', () => {
    const { result, rerender } = renderHook(({ flag }) => useDelayedFlag(flag, 3000), {
      initialProps: { flag: true },
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    rerender({ flag: false })
    rerender({ flag: true })

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(true)
  })
})
