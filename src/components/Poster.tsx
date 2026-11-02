interface PosterProps {
  src: string | undefined
  /** Higher-resolution candidates for sharp screens, e.g. `"medium.jpg 1x, original.jpg 2x"`. */
  srcSet?: string
  alt: string
  /** Lazy by default, since most posters sit in long lists. Use eager for one above the fold. */
  loading?: 'lazy' | 'eager'
  /** Size, shape and background, shared by the image and the placeholder that stands in for it. */
  className: string
}

// TVmaze posters and cast photos share a 210×295 portrait ratio, so the placeholder keeps the layout.
export function Poster({ src, srcSet, alt, loading = 'lazy', className }: PosterProps) {
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

  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      loading={loading}
      className={`aspect-[210/295] object-cover ${className}`}
    />
  )
}
