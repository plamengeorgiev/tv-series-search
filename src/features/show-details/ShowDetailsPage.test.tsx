import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ShowDetailsPage } from './ShowDetailsPage'

describe('ShowDetailsPage', () => {
  it('reads the show id from the URL', () => {
    renderWithProviders(<ShowDetailsPage />, { route: '/shows/42', path: '/shows/:id' })

    expect(screen.getByRole('heading', { name: 'Show 42' })).toBeInTheDocument()
  })
})
