import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TVMAZE_BASE_URL } from '../../api/tvmazeClient'
import { searchResultsFixture } from '../../test/fixtures'
import { renderWithProviders } from '../../test/renderWithProviders'
import { server } from '../../test/server'
import { SearchPage } from './SearchPage'

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
    http.get(`${TVMAZE_BASE_URL}/search/shows`, ({ request }) => {
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

  it('searches immediately for a query in the initial URL', async () => {
    const queries = recordSearchQueries()
    renderSearchPage('/?q=dome')

    await waitFor(() => {
      expect(queries).toEqual(['dome'])
    })
  })
})
