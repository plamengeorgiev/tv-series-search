const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' })

// TVmaze dates are plain YYYY-MM-DD, so format them in UTC to avoid shifting by a day.
export function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}

/** The year of a TVmaze YYYY-MM-DD date, or null when the date is unknown. */
export function getYear(date: string | null): string | null {
  return date?.slice(0, 4) ?? null
}
