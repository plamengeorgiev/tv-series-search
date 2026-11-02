import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { showSchema } from '../../api/schemas'
import { showFixture, sparseShowFixture } from '../../test/fixtures'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ShowCard } from './ShowCard'

const returnState = { fromSearch: '?q=dome' }

describe('ShowCard', () => {
  it('shows the poster, name, year, genres and rating', () => {
    const { container } = renderWithProviders(
      <ShowCard show={showSchema.parse(showFixture)} returnState={returnState} />,
    )

    const card = screen.getByRole('link')
    expect(screen.getByRole('heading', { name: 'Under the Dome' })).toBeInTheDocument()
    expect(card).toHaveTextContent('2013')
    expect(card).toHaveTextContent('Drama, Science-Fiction, Thriller')
    expect(card).toHaveAccessibleName(/Rating 6\.6$/)
    expect(container.querySelector('img')).toHaveAttribute('src', showFixture.image.medium)
    // Results lists can be long, so posters below the fold wait until they're scrolled to.
    expect(container.querySelector('img')).toHaveAttribute('loading', 'lazy')
  })

  it('links to the show details page', () => {
    renderWithProviders(<ShowCard show={showSchema.parse(showFixture)} returnState={returnState} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/shows/1')
  })

  it('shows placeholders when the poster, year, genres and rating are missing', () => {
    const { container } = renderWithProviders(
      <ShowCard show={showSchema.parse(sparseShowFixture)} returnState={returnState} />,
    )

    expect(container.querySelector('img')).toBeNull()
    // Nothing between the name and the rating: no year or genres.
    expect(screen.getByRole('link')).toHaveTextContent(/^No imageUnknown PilotNot rated$/)
  })
})
