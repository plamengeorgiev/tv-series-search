interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
      Show name
      <div className="relative sm:max-w-xl">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-muted"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          placeholder="e.g. Breaking Bad"
          autoComplete="off"
          className="w-full rounded-lg border border-line bg-surface py-3 pr-4 pl-11 text-base font-normal text-ink shadow-sm transition placeholder:text-ink-muted hover:border-line-strong focus:border-accent focus:ring-3 focus:ring-accent/20 focus:outline-hidden"
        />
      </div>
    </label>
  )
}
