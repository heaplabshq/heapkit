export function NumberField({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <label className={`flex items-center gap-2 text-sm text-ink ${disabled ? 'opacity-50' : ''}`}>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink-strong shadow-xs transition focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent-subtle disabled:cursor-not-allowed"
      />
    </label>
  )
}