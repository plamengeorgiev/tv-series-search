interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-muted">
      Show name
      <input
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        placeholder="e.g. Breaking Bad"
        autoComplete="off"
        className="w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-base font-normal text-ink shadow-sm placeholder:text-ink-muted focus:border-accent focus:outline-2 focus:outline-offset-0 focus:outline-accent sm:max-w-xl"
      />
    </label>
  )
}
