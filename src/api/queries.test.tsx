import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createTestQueryClient } from '../test/createTestQueryClient'
import { showDetailsFixture } from '../test/fixtures'
import { server } from '../test/server'
import { useShowDetails, useShowSearch } from './queries'
import { ApiError, TVMAZE_BASE_URL } from './tvmazeClient'

const searchUrl = `${TVMAZE_BASE_URL}/search/shows`
const showUrl = `${TVMAZE_BASE_URL}/shows/:id`

function createWrapper() {
  const queryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

function countRequests(url: string, respond: () => Response) {
  const counter = { count: 0 }
  server.use(
    http.get(url, () => {
      counter.count++
      return respond()
    }),
  )
  return counter
}

describe('useShowSearch', () => {
  it('returns the search results', async () => {
    const { result } = renderHook(() => useShowSearch('dome'), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data?.map(({ show }) => show.name)).toEqual([
      'Under the Dome',
      'Unknown Pilot',
    ])
  })

  it.each(['', '   '])('does not fetch for the query %j', (query) => {
    const requests = countRequests(searchUrl, () => HttpResponse.json([]))

    const { result } = renderHook(() => useShowSearch(query), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(requests.count).toBe(0)
  })

  it('keeps the previous results while the next query loads', async () => {
    const { result, rerender } = renderHook(({ query }) => useShowSearch(query), {
      wrapper: createWrapper(),
      initialProps: { query: 'dome' },
    })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    const previousData = result.current.data

    rerender({ query: 'domes' })

    expect(result.current.isPlaceholderData).toBe(true)
    expect(result.current.data).toBe(previousData)
  })
})

describe('useShowDetails', () => {
  it('returns the show details', async () => {
    const { result } = renderHook(() => useShowDetails(1), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toMatchObject({ id: 1, name: 'Under the Dome' })
  })

  it('reuses a recently fetched show instead of requesting it again', async () => {
    const requests = countRequests(showUrl, () => HttpResponse.json(showDetailsFixture))
    const wrapper = createWrapper()
    const first = renderHook(() => useShowDetails(1), { wrapper })
    await waitFor(() => {
      expect(first.result.current.isSuccess).toBe(true)
    })
    first.unmount()

    const { result } = renderHook(() => useShowDetails(1), { wrapper })

    expect(result.current.data).toMatchObject({ name: 'Under the Dome' })
    expect(result.current.isFetching).toBe(false)
    expect(requests.count).toBe(1)
  })

  it('exposes the ApiError when the request fails', async () => {
    const { result } = renderHook(() => useShowDetails(404), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toBeInstanceOf(ApiError)
    expect(result.current.error).toMatchObject({ type: 'not-found' })
  })
})

describe('retry policy', () => {
  it.each([
    ['network', () => HttpResponse.error()],
    ['rate-limited', () => new HttpResponse(null, { status: 429 })],
    ['server', () => new HttpResponse(null, { status: 500 })],
  ])('retries %s errors three times', async (type, respond) => {
    const requests = countRequests(showUrl, respond)

    const { result } = renderHook(() => useShowDetails(1), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toMatchObject({ type })
    expect(requests.count).toBe(4)
  })

  it.each([
    ['not-found', () => new HttpResponse(null, { status: 404 })],
    ['invalid-response', () => HttpResponse.json({ id: 'not-a-number' })],
  ])('does not retry %s errors', async (type, respond) => {
    const requests = countRequests(showUrl, respond)

    const { result } = renderHook(() => useShowDetails(1), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toMatchObject({ type })
    expect(requests.count).toBe(1)
  })
})
