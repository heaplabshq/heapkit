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
        className="w-16 rounded-md border border-border bg-transparent px-2 py-1 text-ink-strong disabled:cursor-not-allowed"
      />
    </label>
  )
}
