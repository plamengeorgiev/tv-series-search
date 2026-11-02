import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('dome', 300))

    expect(result.current).toBe('dome')
  })

  it('updates only after the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'd' },
    })

    rerender({ value: 'do' })
    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('d')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('do')
  })

  it('restarts the delay on every change', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'd' },
    })

    rerender({ value: 'do' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ value: 'dom' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('d')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('dom')
  })
})
