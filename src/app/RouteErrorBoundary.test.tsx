import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reportError } from '../lib/reportError'
import { renderApp } from '../test/renderWithProviders'

// Stands in for a page with a rendering bug, so the real route tree's boundary catches it.
vi.mock('../features/show-details/ShowDetailsPage', () => ({
  ShowDetailsPage: () => {
    throw new Error('Render crash')
  },
}))

describe('RouteErrorBoundary', () => {
  beforeEach(() => {
    // React logs every error a boundary catches, which would clutter the test output.
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a friendly fallback when a page crashes while rendering', () => {
    renderApp('/shows/1')

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument()
    expect(screen.queryByText('Render crash')).not.toBeInTheDocument()
  })

  it('reports the crash for developers', () => {
    renderApp('/shows/1')

    expect(reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Render crash' }), {
      source: 'route',
    })
  })

  it('keeps the header so the user can still navigate', () => {
    renderApp('/shows/1')

    expect(screen.getByRole('link', { name: 'TV series search' })).toBeInTheDocument()
  })

  it('recovers when the user goes back to search', async () => {
    const user = userEvent.setup()
    renderApp('/shows/1')

    await user.click(screen.getByRole('link', { name: 'Back to search' }))

    expect(screen.getByRole('heading', { name: 'Search TV shows' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
