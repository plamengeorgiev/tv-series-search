import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderWithProviders'

describe('routes', () => {
  it('renders the search page at /', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: 'Search TV shows' })).toBeInTheDocument()
  })

  it('renders the show details page at /shows/:id', async () => {
    renderApp('/shows/1')

    expect(await screen.findByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
  })

  it('renders the not-found page for unknown URLs', () => {
    renderApp('/no/such/page')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('links back home from the header', async () => {
    const user = userEvent.setup()
    renderApp('/shows/1')

    await user.click(screen.getByRole('link', { name: 'TV series search' }))

    expect(screen.getByRole('heading', { name: 'Search TV shows' })).toBeInTheDocument()
  })
})
