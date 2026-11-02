import type { ShowDetails } from '../../api/schemas'

interface ShowHeroProps {
  show: ShowDetails
}

// e.g. "2013–2015 · Ended · CBS", or "2019– · Running" for a show still on air.
function formatMetaLine(show: ShowDetails): string {
  const parts: string[] = []
  const startYear = show.premiered?.slice(0, 4)
  const endYear = show.ended?.slice(0, 4)
  if (startYear) parts.push(startYear === endYear ? startYear : `${startYear}–${endYear ?? ''}`)
  parts.push(show.status)
  const channel = show.network ?? show.webChannel
  if (channel) parts.push(channel.name)
  return parts.join(' · ')
}

export function ShowHero({ show }: ShowHeroProps) {
  const rating = show.rating.average
  // The blurred backdrop is md: and up only, so light text is only needed there.
  const hasBackdrop = show.image !== null
  const onBackdrop = (base: string, backdrop: string) =>
    hasBackdrop ? `${base} ${backdrop}` : base

  return (
    <header className="relative isolate overflow-hidden rounded-2xl border border-line bg-surface-muted">
      {show.image && (
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block">
          <img
            src={show.image.original}
            alt=""
            className="size-full scale-110 object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        </div>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-4 p-4 md:gap-x-8 md:gap-y-5 md:p-8">
        {show.image ? (
          <img
            src={show.image.original}
            alt={`${show.name} poster`}
            className="aspect-[210/295] w-28 rounded-xl object-cover shadow-xl md:row-span-2 md:w-56"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex aspect-[210/295] w-28 items-center justify-center rounded-xl bg-line text-sm text-ink-muted shadow-xl md:row-span-2 md:w-56"
          >
            No image
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-2 self-center md:self-end">
          <h1
            className={onBackdrop(
              'text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl',
              'md:text-white',
            )}
          >
            {show.name}
          </h1>
          <p className={onBackdrop('text-sm text-ink-muted md:text-base', 'md:text-white/80')}>
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
                  className={onBackdrop(
                    'rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink',
                    'md:border-white/20 md:bg-white/10 md:text-white',
                  )}
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
              className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-sm hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Official site<span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
