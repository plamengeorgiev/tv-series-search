import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { TVMAZE_BASE_URL } from '../../api/tvmazeClient'
import { showFixture } from '../../test/fixtures'
import { renderWithProviders } from '../../test/renderWithProviders'
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
          ...showFixture,
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
        HttpResponse.json({ ...showFixture, network: null, webChannel: { name: 'Netflix' } }),
      ),
    )
    renderDetailsPage(1)

    await screen.findByRole('heading', { name: 'Under the Dome' })
    expect(getDetail('Network')).toHaveTextContent('Netflix')
  })

  it('shows a loading state while the show is in flight', async () => {
    server.use(http.get(showUrl, () => delay('infinite')))
    renderDetailsPage(1)

    expect(await screen.findByText('Loading show…')).toHaveAttribute('role', 'status')
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
})
