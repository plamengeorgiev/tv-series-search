import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { showSchema } from '../../api/schemas'
import { showFixture, sparseShowFixture } from '../../test/fixtures'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ShowCard } from './ShowCard'

describe('ShowCard', () => {
  it('shows the poster, name, year, genres and rating', () => {
    const { container } = renderWithProviders(<ShowCard show={showSchema.parse(showFixture)} />)

    const card = screen.getByRole('link')
    expect(screen.getByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(card).toHaveTextContent('2013')
    expect(card).toHaveTextContent('Drama, Science-Fiction, Thriller')
    expect(card).toHaveAccessibleName(/Rating 6\.6$/)
    expect(container.querySelector('img')).toHaveAttribute('src', showFixture.image.medium)
  })

  it('links to the show details page', () => {
    renderWithProviders(<ShowCard show={showSchema.parse(showFixture)} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/shows/1')
  })

  it('shows placeholders when the poster, year, genres and rating are missing', () => {
    const { container } = renderWithProviders(
      <ShowCard show={showSchema.parse(sparseShowFixture)} />,
    )

    expect(container.querySelector('img')).toBeNull()
    // Nothing between the name and the rating: no year or genres.
    expect(screen.getByRole('link')).toHaveTextContent(/^No imageUnknown PilotNot rated$/)
  })
})
