export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex rounded-md border border-border p-1 text-sm">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded px-3 py-1 transition ${
            value === option.value ? 'bg-accent text-white' : 'text-ink hover:text-ink-strong'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
