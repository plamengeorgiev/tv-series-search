import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../test/server'
import { ApiError, getShow, searchShows, TVMAZE_BASE_URL } from './tvmazeClient'

const searchUrl = `${TVMAZE_BASE_URL}/search/shows`
const showUrl = `${TVMAZE_BASE_URL}/shows/:id`

async function captureError(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise
  } catch (error) {
    return error
  }
  throw new Error('Expected the promise to reject')
}

describe('searchShows', () => {
  it('returns the parsed search results', async () => {
    const results = await searchShows('dome')

    expect(results.map(({ show }) => show.name)).toEqual(['Under the Dome', 'Unknown Pilot'])
  })

  it('sends the query as the q parameter', async () => {
    let query: string | null = null
    server.use(
      http.get(searchUrl, ({ request }) => {
        query = new URL(request.url).searchParams.get('q')
        return HttpResponse.json([])
      }),
    )

    await searchShows('game of thrones & co')

    expect(query).toBe('game of thrones & co')
  })
})

describe('getShow', () => {
  it('returns the parsed show details', async () => {
    const show = await getShow(1)

    expect(show).toMatchObject({ id: 1, name: 'Under the Dome', network: { name: 'CBS' } })
  })
})

describe('error mapping', () => {
  it.each([
    [404, 'not-found'],
    [429, 'rate-limited'],
    [500, 'server'],
    [503, 'server'],
    [400, 'invalid-response'],
  ] as const)('maps a %i response to a %s error', async (status, type) => {
    server.use(http.get(showUrl, () => new HttpResponse(null, { status })))

    const error = await captureError(getShow(1))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ type, status })
  })

  it('maps a failed request to a network error', async () => {
    server.use(http.get(searchUrl, () => HttpResponse.error()))

    const error = await captureError(searchShows('dome'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ type: 'network', status: undefined })
  })

  it('maps malformed JSON to an invalid-response error', async () => {
    server.use(
      http.get(
        searchUrl,
        () => new HttpResponse('{not json', { headers: { 'Content-Type': 'application/json' } }),
      ),
    )

    const error = await captureError(searchShows('dome'))

    expect(error).toMatchObject({ type: 'invalid-response' })
  })

  it('maps data that fails schema validation to an invalid-response error', async () => {
    server.use(http.get(showUrl, () => HttpResponse.json({ id: 'not-a-number' })))

    const error = await captureError(getShow(1))

    expect(error).toMatchObject({ type: 'invalid-response' })
  })

  it('rethrows aborts without wrapping them', async () => {
    const controller = new AbortController()
    controller.abort()

    const error = await captureError(searchShows('dome', controller.signal))

    expect(error).not.toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ name: 'AbortError' })
  })
})
