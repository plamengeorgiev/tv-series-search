interface PosterProps {
  src: string | undefined
  alt: string
  /** Size, shape and background, shared by the image and the placeholder that stands in for it. */
  className: string
}

// TVmaze posters and cast photos share a 210×295 portrait ratio, so the placeholder keeps the layout.
export function Poster({ src, alt, className }: PosterProps) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`flex aspect-[210/295] items-center justify-center text-center text-ink-muted ${className}`}
      >
        No image
      </div>
    )
  }

  return <img src={src} alt={alt} className={`aspect-[210/295] object-cover ${className}`} />
}
