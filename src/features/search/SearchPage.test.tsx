import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TVMAZE_BASE_URL } from '../../api/tvmazeClient'
import { reportError } from '../../lib/reportError'
import { searchResultsFixture } from '../../test/fixtures'
import { renderWithProviders } from '../../test/renderWithProviders'
import { server } from '../../test/server'
import { setOnline } from '../../test/setOnline'
import { SearchPage } from './SearchPage'

const searchUrl = `${TVMAZE_BASE_URL}/search/shows`

function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname + location.search}</output>
}

function renderSearchPage(route = '/') {
  return renderWithProviders(
    <>
      <SearchPage />
      <LocationProbe />
    </>,
    { route },
  )
}

function recordSearchQueries() {
  const queries: (string | null)[] = []
  server.use(
    http.get(searchUrl, ({ request }) => {
      queries.push(new URL(request.url).searchParams.get('q'))
      return HttpResponse.json(searchResultsFixture)
    }),
  )
  return queries
}

describe('SearchPage', () => {
  it('fills the input from the ?q= parameter', () => {
    renderSearchPage('/?q=dome')

    expect(screen.getByRole('searchbox', { name: 'Show name' })).toHaveValue('dome')
  })

  it('stores the typed query in the URL', async () => {
    const user = userEvent.setup()
    renderSearchPage()

    await user.type(screen.getByRole('searchbox', { name: 'Show name' }), 'the wire')

    expect(screen.getByTestId('location')).toHaveTextContent('/?q=the+wire')
  })

  it('removes the parameter when the input is cleared', async () => {
    const user = userEvent.setup()
    renderSearchPage('/?q=dome')

    await user.clear(screen.getByRole('searchbox', { name: 'Show name' }))

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  })

  it('searches once typing pauses, not on every keystroke', async () => {
    const queries = recordSearchQueries()
    const user = userEvent.setup()
    renderSearchPage()

    await user.type(screen.getByRole('searchbox', { name: 'Show name' }), 'dome')

    await waitFor(() => {
      expect(queries).toEqual(['dome'])
    })
  })

  it('renders a card for each result, linking to its details page', async () => {
    renderSearchPage('/?q=dome')

    const links = await screen.findAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/shows/1', '/shows/99999'])
    expect(screen.getByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Unknown Pilot' })).toBeInTheDocument()
  })

  it('hides the results when the input is cleared', async () => {
    const user = userEvent.setup()
    renderSearchPage('/?q=dome')
    await screen.findByRole('list')

    await user.clear(screen.getByRole('searchbox', { name: 'Show name' }))

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('prompts for a search when there is no query', () => {
    renderSearchPage()

    expect(screen.getByText('Type a show name to start searching.')).toBeInTheDocument()
    expect(screen.queryByText('Searching…')).not.toBeInTheDocument()
  })

  it('shows a loading state while the search is in flight', async () => {
    server.use(http.get(searchUrl, () => delay('infinite')))
    renderSearchPage('/?q=dome')

    expect(await screen.findByText('Searching…')).toHaveAttribute('role', 'status')
  })

  it('says so when no shows match the query', async () => {
    server.use(http.get(searchUrl, () => HttpResponse.json([])))
    renderSearchPage('/?q=xyzzy')

    expect(await screen.findByText('No shows found for “xyzzy”.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('shows an error with a Retry button that searches again', async () => {
    server.use(http.get(searchUrl, () => new HttpResponse(null, { status: 500 })))
    const user = userEvent.setup()
    renderSearchPage('/?q=dome')

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn’t load this right now/)

    server.use(http.get(searchUrl, () => HttpResponse.json(searchResultsFixture)))
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('reports the failure for developers while showing the user only a generic message', async () => {
    server.use(http.get(searchUrl, () => new HttpResponse(null, { status: 500 })))
    renderSearchPage('/?q=dome')

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn’t load this right now/)
    expect(alert).not.toHaveTextContent(/500|TVmaze/)
    expect(reportError).toHaveBeenCalledOnce()
    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'server', status: 500 }),
      expect.objectContaining({
        source: 'query',
        type: 'server',
        status: 500,
        queryKey: ['shows', 'search', 'dome'],
      }),
    )
  })

  it('searches immediately for a query in the initial URL', async () => {
    const queries = recordSearchQueries()
    renderSearchPage('/?q=dome')

    await waitFor(() => {
      expect(queries).toEqual(['dome'])
    })
  })
})

describe('SearchPage on a slow connection', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a notice once a search has taken over 3 seconds', async () => {
    // shouldAdvanceTime keeps msw and Testing Library's polling running on real time too.
    vi.useFakeTimers({ shouldAdvanceTime: true })
    server.use(http.get(searchUrl, () => delay('infinite')))
    renderSearchPage('/?q=dome')
    await screen.findByText('Searching…')

    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.queryByText('This is taking longer than usual…')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('This is taking longer than usual…')).toHaveAttribute('role', 'status')
  })

  it('hides the notice once the results arrive', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    server.use(
      http.get(searchUrl, async () => {
        await delay(5000)
        return HttpResponse.json(searchResultsFixture)
      }),
    )
    renderSearchPage('/?q=dome')
    await screen.findByText('Searching…')

    act(() => {
      vi.advanceTimersByTime(3500)
    })
    expect(screen.getByText('This is taking longer than usual…')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(await screen.findByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(screen.queryByText('This is taking longer than usual…')).not.toBeInTheDocument()
  })

  it('does not count the time spent typing', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    server.use(http.get(searchUrl, () => delay('infinite')))
    // Each pause is shorter than the debounce, so no request starts during the 5s of typing.
    const user = userEvent.setup({
      delay: 250,
      advanceTimers: (ms) => vi.advanceTimersByTime(ms),
    })
    renderSearchPage()

    await user.type(screen.getByRole('searchbox', { name: 'Show name' }), 'battlestar galactica')

    expect(screen.getByText('Searching…')).toBeInTheDocument()
    expect(screen.queryByText('This is taking longer than usual…')).not.toBeInTheDocument()
  })
})

describe('SearchPage while offline', () => {
  const [domeResult, pilotResult] = searchResultsFixture

  afterEach(() => {
    setOnline(true)
    vi.restoreAllMocks()
  })

  function recordSearches(resultsByQuery: Record<string, unknown[]>) {
    const queries: (string | null)[] = []
    server.use(
      http.get(searchUrl, ({ request }) => {
        const query = new URL(request.url).searchParams.get('q') ?? ''
        queries.push(query)
        return HttpResponse.json(resultsByQuery[query] ?? [])
      }),
    )
    return queries
  }

  it('marks the previous results as out of date until the new search can run', async () => {
    const queries = recordSearches({ dome: [domeResult], pilot: [pilotResult] })
    const user = userEvent.setup()
    renderSearchPage('/?q=dome')
    await screen.findByRole('heading', { name: 'Under the Dome' })
    setOnline(false)

    const searchbox = screen.getByRole('searchbox', { name: 'Show name' })
    await user.clear(searchbox)
    await user.type(searchbox, 'pilot')

    expect(
      await screen.findByText(
        'You’re offline. We’ll search for “pilot” when your connection is back.',
      ),
    ).toHaveAttribute('role', 'status')
    // The old results stay usable, but are marked busy and dimmed.
    expect(screen.getByRole('list').parentElement).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(queries).toEqual(['dome'])

    setOnline(true)

    expect(await screen.findByRole('heading', { name: 'Unknown Pilot' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Under the Dome' })).not.toBeInTheDocument()
    expect(screen.queryByText(/We’ll search for/)).not.toBeInTheDocument()
    expect(screen.getByRole('list').parentElement).toHaveAttribute('aria-busy', 'false')
    expect(queries).toEqual(['dome', 'pilot'])
  })

  it('does not claim a new query has no results before it has been searched', async () => {
    recordSearches({ pilot: [pilotResult] })
    const user = userEvent.setup()
    renderSearchPage('/?q=xyzzy')
    await screen.findByText('No shows found for “xyzzy”.')
    setOnline(false)

    const searchbox = screen.getByRole('searchbox', { name: 'Show name' })
    await user.clear(searchbox)
    await user.type(searchbox, 'pilot')

    expect(await screen.findByText(/We’ll search for “pilot”/)).toBeInTheDocument()
    expect(screen.getByText('Searching…')).toBeInTheDocument()
    expect(screen.queryByText(/No shows found/)).not.toBeInTheDocument()
  })
})
