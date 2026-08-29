import type { SelectHTMLAttributes } from 'react'

/** Token-styled native select. Options are `{ value, label }` pairs. */
export function Select({
  options,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[]
}) {
  return (
    <select
      {...props}
      className={`max-w-full rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink-strong shadow-xs transition focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent-subtle ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}