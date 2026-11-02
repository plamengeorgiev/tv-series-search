interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label>
      Show name
      <input
        type="search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        placeholder="e.g. Breaking Bad"
        autoComplete="off"
      />
    </label>
  )
}
