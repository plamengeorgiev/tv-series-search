const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' })

// TVmaze dates are plain YYYY-MM-DD, so format them in UTC to avoid shifting by a day.
export function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}
