import type { ReactNode } from 'react'

/**
 * Labeled range slider with a filled accent track. Pass `input` (e.g. a
 * NumberField) to let users type an exact value; it replaces the read-only
 * display chip on the right. `minLabel`/`maxLabel` render as small hints
 * under the slider's ends.
 */
export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange,
  input,
  minLabel,
  maxLabel,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  display: string
  onChange: (value: number) => void
  input?: ReactNode
  minLabel?: string
  maxLabel?: string
}) {
  const fill = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        {input ?? (
          <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-sm font-semibold text-ink-strong shadow-xs">
            {display}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--color-accent) ${fill}%, var(--color-surface) ${fill}%)`,
        }}
        className="w-full"
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-ink">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  )
}