// Mirrors the hero and body layout, so the page doesn't jump when the show arrives.
export function ShowDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <p role="status" className="sr-only">
        Loading show…
      </p>
      <div aria-hidden="true" className="flex flex-col gap-8">
        <div className="grid animate-pulse grid-cols-[auto_1fr] gap-4 rounded-2xl border border-line bg-surface-muted p-4 motion-reduce:animate-none md:gap-x-8 md:p-8">
          <div className="aspect-[210/295] w-28 rounded-xl bg-line md:w-56" />
          <div className="flex flex-col gap-3 self-center">
            <div className="h-8 w-3/4 max-w-sm rounded bg-line md:h-10" />
            <div className="h-4 w-1/2 max-w-48 rounded bg-line" />
            <div className="h-6 w-24 rounded-full bg-line" />
          </div>
        </div>
        <div className="flex max-w-prose animate-pulse flex-col gap-3 motion-reduce:animate-none">
          <div className="h-4 rounded bg-surface-muted" />
          <div className="h-4 rounded bg-surface-muted" />
          <div className="h-4 w-5/6 rounded bg-surface-muted" />
          <div className="h-4 w-2/3 rounded bg-surface-muted" />
        </div>
      </div>
    </div>
  )
}
