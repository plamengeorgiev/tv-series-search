import { describe, expect, it } from 'vitest'
import { getSearchReturnState } from './searchReturnState'

describe('getSearchReturnState', () => {
  it('reads the search a result was opened from', () => {
    expect(getSearchReturnState({ fromSearch: '?q=dome' })).toEqual({ fromSearch: '?q=dome' })
  })

  it.each([null, undefined, 'state', {}, { fromSearch: 42 }])('ignores %o', (state) => {
    expect(getSearchReturnState(state)).toBeNull()
  })
})
