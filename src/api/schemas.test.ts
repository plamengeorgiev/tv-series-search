import { describe, expect, it } from 'vitest'
import {
  searchResultsFixture,
  showDetailsFixture,
  showFixture,
  sparseShowDetailsFixture,
} from '../test/fixtures'
import { searchResultsSchema, seasonSchema, showDetailsSchema, showSchema } from './schemas'

describe('showSchema', () => {
  it('keeps only the fields the app uses', () => {
    expect(showSchema.parse(showFixture)).toEqual({
      id: 1,
      name: 'Under the Dome',
      genres: ['Drama', 'Science-Fiction', 'Thriller'],
      premiered: '2013-06-24',
      rating: { average: 6.6 },
      image: showFixture.image,
    })
  })

  it('rejects a show with a missing required field', () => {
    expect(showSchema.safeParse({ ...showFixture, name: undefined }).success).toBe(false)
  })

  it('rejects a show with a field of the wrong type', () => {
    expect(showSchema.safeParse({ ...showFixture, id: '1' }).success).toBe(false)
  })
})

describe('showDetailsSchema', () => {
  it('parses a fully populated show', () => {
    expect(showDetailsSchema.parse(showDetailsFixture)).toMatchObject({
      status: 'Ended',
      network: { name: 'CBS' },
      webChannel: null,
    })
  })

  it('keeps only the cast and season fields the app uses', () => {
    const { _embedded } = showDetailsSchema.parse(showDetailsFixture)

    expect(_embedded.cast[0]).toEqual({
      person: {
        id: 1,
        name: 'Mike Vogel',
        image: showDetailsFixture._embedded.cast[0].person.image,
      },
      character: { id: 1, name: 'Dale "Barbie" Barbara' },
    })
    expect(_embedded.seasons[0]).toEqual({
      id: 1,
      number: 1,
      name: '',
      episodeOrder: 13,
      premiereDate: '2013-06-24',
      endDate: '2013-09-16',
    })
  })

  it('accepts a show with all optional fields set to null', () => {
    expect(showDetailsSchema.safeParse(sparseShowDetailsFixture).success).toBe(true)
  })

  it('accepts a season without an episode count or dates', () => {
    const upcomingSeason = {
      id: 9,
      number: 4,
      name: '',
      episodeOrder: null,
      premiereDate: null,
      endDate: null,
    }

    expect(seasonSchema.safeParse(upcomingSeason).success).toBe(true)
  })

  it('rejects a show without the embedded cast and seasons', () => {
    expect(showDetailsSchema.safeParse(showFixture).success).toBe(false)
  })
})

describe('searchResultsSchema', () => {
  it('parses a list of scored shows', () => {
    const results = searchResultsSchema.parse(searchResultsFixture)

    expect(results.map(({ show }) => show.name)).toEqual(['Under the Dome', 'Unknown Pilot'])
  })

  it('accepts an empty result list', () => {
    expect(searchResultsSchema.parse([])).toEqual([])
  })
})
