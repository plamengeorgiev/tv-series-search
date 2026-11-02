import { describe, expect, it } from 'vitest'
import { formatDate, getYear } from './formatDate'

describe('formatDate', () => {
  it('formats a TVmaze date as a readable date', () => {
    expect(formatDate('2013-06-24')).toBe('Jun 24, 2013')
  })

  it('keeps the first and last day of the year on the same day', () => {
    expect(formatDate('2015-01-01')).toBe('Jan 1, 2015')
    expect(formatDate('2015-12-31')).toBe('Dec 31, 2015')
  })
})

describe('getYear', () => {
  it('returns the year of a TVmaze date', () => {
    expect(getYear('2013-06-24')).toBe('2013')
  })

  it('returns null for an unknown date', () => {
    expect(getYear(null)).toBeNull()
  })
})
