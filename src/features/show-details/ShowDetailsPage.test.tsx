import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TVMAZE_BASE_URL } from '../../api/tvmazeClient'
import { showDetailsFixture, showFixture } from '../../test/fixtures'
import { renderApp, renderWithProviders } from '../../test/renderWithProviders'
import { server } from '../../test/server'
import { ShowDetailsPage } from './ShowDetailsPage'

const showUrl = `${TVMAZE_BASE_URL}/shows/:id`

function renderDetailsPage(id: number | string) {
  return renderWithProviders(<ShowDetailsPage />, {
    route: `/shows/${String(id)}`,
    path: '/shows/:id',
  })
}

function getDetail(term: string) {
  return screen.getByText(term, { selector: 'dt' }).nextElementSibling
}

describe('ShowDetailsPage', () => {
  it('fetches the show from the id in the URL', async () => {
    renderDetailsPage(1)

    expect(await screen.findByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
  })

  it('shows the poster, genres, status, dates, network and rating', async () => {
    renderDetailsPage(1)

    expect(await screen.findByRole('img', { name: 'Under the Dome poster' })).toHaveAttribute(
      'src',
      showFixture.image.original,
    )
    const genres = within(screen.getByRole('list', { name: 'Genres' })).getAllByRole('listitem')
    expect(genres.map((genre) => genre.textContent)).toEqual([
      'Drama',
      'Science-Fiction',
      'Thriller',
    ])
    expect(getDetail('Status')).toHaveTextContent('Ended')
    expect(getDetail('Premiered')).toHaveTextContent('Jun 24, 2013')
    expect(getDetail('Ended')).toHaveTextContent('Sep 10, 2015')
    expect(getDetail('Network')).toHaveTextContent('CBS')
    expect(getDetail('Rating')).toHaveTextContent('6.6 / 10')
  })

  it('renders the summary as formatted text', async () => {
    renderDetailsPage(1)

    const title = await screen.findByText('Under the Dome', { selector: 'b' })
    expect(title.parentElement).toHaveTextContent(/is the story of a small town/)
  })

  it('strips scripts from the summary', async () => {
    server.use(
      http.get(showUrl, () =>
        HttpResponse.json({
          ...showDetailsFixture,
          summary: '<p>Safe text</p><script>window.hacked = true</script>',
        }),
      ),
    )
    const { container } = renderDetailsPage(1)

    expect(await screen.findByText('Safe text')).toBeInTheDocument()
    expect(container.querySelector('script')).toBeNull()
  })

  it('links to the official site in a new tab', async () => {
    renderDetailsPage(1)

    const link = await screen.findByRole('link', { name: 'Official site' })
    expect(link).toHaveAttribute('href', showFixture.officialSite)
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows placeholders and hides empty fields for a sparse show', async () => {
    renderDetailsPage(99999)

    expect(await screen.findByRole('heading', { name: 'Unknown Pilot' })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Genres' })).not.toBeInTheDocument()
    expect(screen.queryByText('Premiered')).not.toBeInTheDocument()
    expect(screen.queryByText('Network')).not.toBeInTheDocument()
    expect(getDetail('Rating')).toHaveTextContent('Not rated')
    expect(screen.getByText('No summary available.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Official site' })).not.toBeInTheDocument()
  })

  it('falls back to the web channel when there is no network', async () => {
    server.use(
      http.get(showUrl, () =>
        HttpResponse.json({
          ...showDetailsFixture,
          network: null,
          webChannel: { name: 'Netflix' },
        }),
      ),
    )
    renderDetailsPage(1)

    await screen.findByRole('heading', { name: 'Under the Dome' })
    expect(getDetail('Network')).toHaveTextContent('Netflix')
  })

  it('lists the seasons with their episode counts and dates', async () => {
    renderDetailsPage(1)

    const seasons = within(await screen.findByRole('region', { name: 'Seasons' })).getAllByRole(
      'listitem',
    )
    expect(seasons).toHaveLength(3)
    expect(seasons[0]).toHaveTextContent('Season 1')
    expect(seasons[0]).toHaveTextContent('13 episodes · Jun 24, 2013 – Sep 16, 2013')
  })

  it('shows season names and leaves out unknown details for upcoming seasons', async () => {
    server.use(
      http.get(showUrl, () =>
        HttpResponse.json({
          ...showDetailsFixture,
          _embedded: {
            ...showDetailsFixture._embedded,
            seasons: [
              {
                id: 1,
                number: 1,
                name: 'Book One',
                episodeOrder: 1,
                premiereDate: '2025-01-05',
                endDate: null,
              },
              {
                id: 2,
                number: 2,
                name: '',
                episodeOrder: null,
                premiereDate: null,
                endDate: null,
              },
            ],
          },
        }),
      ),
    )
    renderDetailsPage(1)

    expect(await screen.findByRole('heading', { name: 'Season 1: Book One' })).toBeInTheDocument()
    expect(screen.getByText('1 episode · From Jan 5, 2025')).toBeInTheDocument()
    // Season 2 has nothing known yet, so only its heading is rendered.
    expect(screen.getByRole('heading', { name: 'Season 2' }).parentElement).toHaveTextContent(
      /^Season 2$/,
    )
  })

  it('lists the cast with the characters they play', async () => {
    renderDetailsPage(1)

    const cast = within(await screen.findByRole('region', { name: 'Cast' })).getAllByRole(
      'listitem',
    )
    expect(cast).toHaveLength(3)
    expect(cast[0]).toHaveTextContent('Mike Vogel')
    expect(cast[0]).toHaveTextContent('as Dale "Barbie" Barbara')
    expect(cast[0]?.querySelector('img')).toHaveAttribute(
      'src',
      showDetailsFixture._embedded.cast[0].person.image.medium,
    )
  })

  it('shows a placeholder for cast members without a photo', async () => {
    const [castMember] = showDetailsFixture._embedded.cast
    server.use(
      http.get(showUrl, () =>
        HttpResponse.json({
          ...showDetailsFixture,
          _embedded: {
            ...showDetailsFixture._embedded,
            cast: [{ ...castMember, person: { ...castMember.person, image: null } }],
          },
        }),
      ),
    )
    renderDetailsPage(1)

    const cast = await screen.findByRole('region', { name: 'Cast' })
    expect(within(cast).getByText('Mike Vogel')).toBeInTheDocument()
    expect(within(cast).getByText('No image')).toBeInTheDocument()
    expect(cast.querySelector('img')).toBeNull()
  })

  it('shows the first cast members and reveals the rest on request', async () => {
    const [castMember] = showDetailsFixture._embedded.cast
    const largeCast = Array.from({ length: 15 }, (_, index) => ({
      person: { ...castMember.person, id: index, name: `Actor ${String(index + 1)}` },
      character: { id: index, name: `Character ${String(index + 1)}` },
    }))
    server.use(
      http.get(showUrl, () =>
        HttpResponse.json({
          ...showDetailsFixture,
          _embedded: { ...showDetailsFixture._embedded, cast: largeCast },
        }),
      ),
    )
    const user = userEvent.setup()
    renderDetailsPage(1)

    const cast = await screen.findByRole('region', { name: 'Cast' })
    expect(within(cast).getAllByRole('listitem')).toHaveLength(12)
    expect(within(cast).queryByText('Actor 13')).not.toBeInTheDocument()

    const toggle = within(cast).getByRole('button', { name: 'Show all 15 cast members' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)

    expect(within(cast).getAllByRole('listitem')).toHaveLength(15)
    expect(within(cast).getByText('Actor 15')).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(within(cast).getByRole('button', { name: 'Show fewer' }))

    expect(within(cast).getAllByRole('listitem')).toHaveLength(12)
  })

  it('has no show-all button when the whole cast already fits', async () => {
    renderDetailsPage(1)

    const cast = await screen.findByRole('region', { name: 'Cast' })
    expect(within(cast).queryByRole('button')).not.toBeInTheDocument()
  })

  it('says when there is no cast or season information', async () => {
    renderDetailsPage(99999)

    expect(await screen.findByText('No cast information available.')).toBeInTheDocument()
    expect(screen.getByText('No season information available.')).toBeInTheDocument()
  })

  it('shows a loading state while the show is in flight', async () => {
    server.use(http.get(showUrl, () => delay('infinite')))
    renderDetailsPage(1)

    expect(await screen.findByText('Loading show…')).toHaveAttribute('role', 'status')
  })

  describe('on a slow connection', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('shows a notice once the show has taken over 3 seconds to load', async () => {
      // shouldAdvanceTime keeps msw and Testing Library's polling running on real time too.
      vi.useFakeTimers({ shouldAdvanceTime: true })
      server.use(http.get(showUrl, () => delay('infinite')))
      renderDetailsPage(1)
      await screen.findByText('Loading show…')

      act(() => {
        vi.advanceTimersByTime(2500)
      })
      expect(screen.queryByText('This is taking longer than usual…')).not.toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(screen.getByText('This is taking longer than usual…')).toHaveAttribute(
        'role',
        'status',
      )
    })

    it('hides the notice once the show arrives', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      server.use(
        http.get(showUrl, async () => {
          await delay(5000)
          return HttpResponse.json(showDetailsFixture)
        }),
      )
      renderDetailsPage(1)
      await screen.findByText('Loading show…')

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
  })

  it('shows an error with a Retry button that loads the show again', async () => {
    server.use(http.get(showUrl, () => new HttpResponse(null, { status: 500 })))
    const user = userEvent.setup()
    renderDetailsPage(1)

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn’t load this right now/)

    server.resetHandlers()
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
  })

  it.each(['abc', '0', '-1', '1.5', '1e3', '12abc', '99999999999999999999'])(
    'shows "Show not found" for the invalid id %s without calling the API',
    async (id) => {
      let requested = false
      server.use(
        http.get(showUrl, () => {
          requested = true
          return HttpResponse.json(showDetailsFixture)
        }),
      )
      renderDetailsPage(id)

      expect(await screen.findByRole('heading', { name: 'Show not found' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Back to search' })).toHaveAttribute('href', '/')
      expect(requested).toBe(false)
    },
  )

  it('shows "Show not found" when the API has no show with that id', async () => {
    server.use(http.get(showUrl, () => new HttpResponse(null, { status: 404 })))
    renderDetailsPage(123)

    expect(await screen.findByRole('heading', { name: 'Show not found' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()
  })
})

describe('deep links to show details', () => {
  it('loads the show when the app starts on its URL, without visiting search first', async () => {
    let searched = false
    server.use(
      http.get(`${TVMAZE_BASE_URL}/search/shows`, () => {
        searched = true
        return HttpResponse.json([])
      }),
    )
    renderApp('/shows/1')

    expect(await screen.findByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(searched).toBe(false)
  })

  it('links back to search from a deep link to a missing show', async () => {
    const user = userEvent.setup()
    renderApp('/shows/424242')

    await screen.findByRole('heading', { name: 'Show not found' })
    await user.click(screen.getByRole('link', { name: 'Back to search' }))

    expect(screen.getByRole('heading', { name: 'Search TV shows' })).toBeInTheDocument()
  })
})

describe('back-to-results navigation', () => {
  function LocationProbe() {
    const location = useLocation()
    return (
      <output data-testid="location" data-key={location.key}>
        {location.pathname + location.search}
      </output>
    )
  }

  function renderAppWithProbe(route: string) {
    return renderApp(route, <LocationProbe />)
  }

  it('goes back through history to the same search results', async () => {
    const user = userEvent.setup()
    renderAppWithProbe('/?q=dome')
    const searchKey = screen.getByTestId('location').dataset.key

    await user.click(await screen.findByRole('link', { name: /Under the Dome/ }))
    const backLink = await screen.findByRole('link', { name: 'Back to results' })
    expect(backLink).toHaveAttribute('href', '/?q=dome')
    await user.click(backLink)

    expect(screen.getByRole('searchbox', { name: 'Show name' })).toHaveValue('dome')
    expect(screen.getByTestId('location')).toHaveTextContent('/?q=dome')
    // The same history entry as before, not a new one pushed on top of the details page.
    expect(screen.getByTestId('location').dataset.key).toBe(searchKey)
  })

  it('shows the back link while the show is loading', async () => {
    server.use(http.get(showUrl, () => delay('infinite')))
    const user = userEvent.setup()
    renderAppWithProbe('/?q=dome')

    await user.click(await screen.findByRole('link', { name: /Under the Dome/ }))

    expect(await screen.findByText('Loading show…')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to results' })).toBeInTheDocument()
  })

  it('links to search when the details page was opened directly', async () => {
    const user = userEvent.setup()
    renderAppWithProbe('/shows/1')

    await screen.findByRole('heading', { name: 'Under the Dome' })
    const backLink = screen.getByRole('link', { name: 'Back to search' })
    expect(backLink).toHaveAttribute('href', '/')
    await user.click(backLink)

    expect(screen.getByRole('heading', { name: 'Search TV shows' })).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  })
})
