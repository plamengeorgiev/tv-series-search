import DOMPurify from 'dompurify'

// TVmaze summaries are plain formatting markup, so anything beyond these tags is dropped.
const ALLOWED_TAGS = ['p', 'b', 'strong', 'i', 'em', 'u', 'br', 'ul', 'ol', 'li']

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: [] })
}
