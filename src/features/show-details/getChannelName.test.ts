import { describe, expect, it } from 'vitest'
import { getChannelName } from './getChannelName'

describe('getChannelName', () => {
  it('prefers the broadcast network', () => {
    expect(getChannelName({ network: { name: 'CBS' }, webChannel: { name: 'Paramount+' } })).toBe(
      'CBS',
    )
  })

  it('falls back to the web channel for streaming shows', () => {
    expect(getChannelName({ network: null, webChannel: { name: 'Netflix' } })).toBe('Netflix')
  })

  it('returns null when neither is known', () => {
    expect(getChannelName({ network: null, webChannel: null })).toBeNull()
  })
})
