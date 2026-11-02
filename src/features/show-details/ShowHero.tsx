import type { ShowDetails } from '../../api/schemas'
import { Poster } from '../../components/Poster'
import { getYear } from '../../lib/formatDate'
import { getChannelName } from './getChannelName'

interface ShowHeroProps {
  show: ShowDetails
}

// e.g. "2013–2015 · Ended · CBS", or "2019– · Running" for a show still on air.
function formatMetaLine(show: ShowDetails): string {
  const parts: string[] = []
  const startYear = getYear(show.premiered)
  const endYear = getYear(show.ended)
  if (startYear) parts.push(startYear === endYear ? startYear : `${startYear}–${endYear ?? ''}`)
  parts.push(show.status)
  const channelName = getChannelName(show)
  if (channelName) parts.push(channelName)
  return parts.join(' · ')
}

export function ShowHero({ show }: ShowHeroProps) {
  const rating = show.rating.average
  return (
    // data-backdrop switches the text to light colours. The blurred backdrop is md: and up only,
    // so the md:group-data-backdrop/hero: classes below only apply there.
    <header
      data-backdrop={show.image ? '' : undefined}
      className="group/hero relative isolate overflow-hidden rounded-2xl border border-line bg-surface-muted"
    >
      {show.image && (
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block">
          {/* Blurred beyond recognition, so the small image is plenty. */}
          <img
            src={show.image.medium}
            alt=""
            className="size-full scale-110 object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        </div>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-4 p-4 md:gap-x-8 md:gap-y-5 md:p-8">
        <Poster
          src={show.image?.medium}
          srcSet={show.image ? `${show.image.medium} 1x, ${show.image.original} 2x` : undefined}
          alt={`${show.name} poster`}
          loading="eager"
          className="w-28 rounded-xl bg-line text-sm shadow-xl md:row-span-2 md:w-56"
        />

        <div className="flex min-w-0 flex-col gap-2 self-center md:self-end">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl md:group-data-backdrop/hero:text-white">
            {show.name}
          </h1>
          <p className="text-sm text-ink-muted md:text-base md:group-data-backdrop/hero:text-white/80">
            {formatMetaLine(show)}
          </p>
        </div>

        <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-1 md:col-start-2 md:self-start">
          {rating === null ? (
            <p className="rounded-full bg-surface px-3 py-1 text-sm font-medium text-ink-muted">
              Not rated
            </p>
          ) : (
            <p className="rounded-full bg-rating px-3 py-1 text-sm font-semibold text-on-rating">
              <span className="sr-only">Rating: </span>
              <span aria-hidden="true">★</span> {rating} / 10
            </p>
          )}

          {show.genres.length > 0 && (
            <ul aria-label="Genres" className="flex flex-wrap gap-2">
              {show.genres.map((genre) => (
                <li
                  key={genre}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink md:group-data-backdrop/hero:border-white/20 md:group-data-backdrop/hero:bg-white/10 md:group-data-backdrop/hero:text-white"
                >
                  {genre}
                </li>
              ))}
            </ul>
          )}

          {show.officialSite && (
            <a
              href={show.officialSite}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-sm hover:bg-accent-strong"
            >
              Official site<span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
