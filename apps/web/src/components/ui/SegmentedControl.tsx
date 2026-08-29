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
    <div className="inline-flex max-w-full gap-0.5 rounded-lg border border-border bg-surface-muted p-0.5 text-sm shadow-xs">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`whitespace-nowrap rounded-md px-3 py-1 font-medium transition ${
              active
                ? 'bg-surface text-ink-strong shadow-xs'
                : 'text-ink hover:text-ink-strong'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}