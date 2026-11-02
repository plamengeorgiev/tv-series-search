import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats a TVmaze date as a readable date', () => {
    expect(formatDate('2013-06-24')).toBe('Jun 24, 2013')
  })

  it('keeps the first and last day of the year on the same day', () => {
    expect(formatDate('2015-01-01')).toBe('Jan 1, 2015')
    expect(formatDate('2015-12-31')).toBe('Dec 31, 2015')
  })
})
