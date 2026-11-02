import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { TVMAZE_BASE_URL } from '../api/tvmazeClient'
import { searchResultsFixture } from '../test/fixtures'
import { renderWithProviders } from '../test/renderWithProviders'
import { server } from '../test/server'
import { setOnline } from '../test/setOnline'

const offlineMessage = 'You’re offline. We’ll carry on as soon as your connection is back.'

describe('OfflineBanner', () => {
  afterEach(() => {
    setOnline(true)
    vi.restoreAllMocks()
  })

  it('is hidden while online', () => {
    renderWithProviders(<App />)

    expect(screen.queryByText(offlineMessage)).not.toBeInTheDocument()
  })

  it('appears when the connection drops and goes away when it returns', () => {
    renderWithProviders(<App />)

    setOnline(false)
    expect(screen.getByText(offlineMessage)).toHaveAttribute('role', 'status')

    setOnline(true)
    expect(screen.queryByText(offlineMessage)).not.toBeInTheDocument()
  })

  it('shows on every page', () => {
    renderWithProviders(<App />, { route: '/no/such/page' })

    setOnline(false)

    expect(screen.getByText(offlineMessage)).toBeInTheDocument()
  })

  it('holds a search made offline and runs it once the connection is back', async () => {
    let requests = 0
    server.use(
      http.get(`${TVMAZE_BASE_URL}/search/shows`, () => {
        requests += 1
        return HttpResponse.json(searchResultsFixture)
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<App />)
    // React Query only hears about the connection once its provider has mounted.
    setOnline(false)

    await user.type(screen.getByRole('searchbox', { name: 'Show name' }), 'dome')

    expect(await screen.findByText('Searching…')).toBeInTheDocument()
    // Longer than the debounce, so the request would have gone out by now if it weren't paused.
    await new Promise((resolve) => setTimeout(resolve, 500))
    expect(requests).toBe(0)

    setOnline(true)

    expect(await screen.findByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(requests).toBe(1)
  })
})
