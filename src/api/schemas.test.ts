import { describe, expect, it } from 'vitest'
import { searchResultsFixture, showFixture, sparseShowFixture } from '../test/fixtures'
import { searchResultsSchema, showDetailsSchema, showSchema } from './schemas'

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
    expect(showDetailsSchema.parse(showFixture)).toMatchObject({
      status: 'Ended',
      network: { name: 'CBS' },
      webChannel: null,
    })
  })

  it('accepts a show with all optional fields set to null', () => {
    expect(showDetailsSchema.safeParse(sparseShowFixture).success).toBe(true)
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
