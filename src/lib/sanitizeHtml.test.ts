import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('keeps basic formatting tags', () => {
    const html = '<p><b>Under the Dome</b> is <i>the</i> story.</p>'

    expect(sanitizeHtml(html)).toBe(html)
  })

  it('strips script tags and their content', () => {
    expect(sanitizeHtml('<p>Hi</p><script>alert(1)</script>')).toBe('<p>Hi</p>')
  })

  it('strips event handler attributes', () => {
    expect(sanitizeHtml('<p onclick="alert(1)">Hi</p>')).toBe('<p>Hi</p>')
  })

  it('unwraps disallowed tags but keeps their text', () => {
    expect(sanitizeHtml('<p><a href="javascript:alert(1)">Click</a></p>')).toBe('<p>Click</p>')
  })

  it('removes images, which could load trackers', () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).toBe('')
  })
})
