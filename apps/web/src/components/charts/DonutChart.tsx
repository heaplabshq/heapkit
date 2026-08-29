import { useId, useState } from 'react'
import { formatCurrency } from '../../lib/emi'

type Slice = { label: string; value: number; color: string }

/**
 * Donut chart for the principal vs. interest split. Pure SVG — no chart
 * library, no external requests. Hovering a slice (or its legend row)
 * highlights it and shows the exact amount in the center.
 */
export function DonutChart({
  slices,
  currency,
  locale,
  centerLabel,
}: {
  slices: Slice[]
  currency: string
  locale: string
  centerLabel: string
}) {
  const gradientId = useId()
  const [hovered, setHovered] = useState<number | null>(null)

  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const gap = 1.5 // degrees of gap between slices

  let offset = 0
  const arcs = slices.map((slice) => {
    const fraction = total > 0 ? slice.value / total : 0
    const sweep = Math.max(fraction * 360 - gap, 0.5)
    const arc = { ...slice, sweep, rotation: offset }
    offset += fraction * 360
    return arc
  })

  const active = hovered !== null ? arcs[hovered] : null

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg
        viewBox="0 0 180 180"
        className="h-44 w-44 shrink-0 -rotate-90"
        role="img"
        aria-label="Principal versus interest breakdown"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-principal)" />
            <stop offset="100%" stopColor="var(--color-accent-strong)" />
          </linearGradient>
        </defs>
        {arcs.map((arc, index) => (
          <circle
            key={arc.label}
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={index === 0 ? `url(#${gradientId})` : 'var(--color-chart-interest)'}
            strokeWidth={hovered === index ? 26 : 22}
            strokeDasharray={`${(arc.sweep / 360) * circumference} ${circumference}`}
            strokeDashoffset={(-arc.rotation / 360) * circumference}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="pb-1 text-center sm:text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-ink">
            {active ? active.label : centerLabel}
          </p>
          <p className="text-xl font-semibold text-ink-strong">
            {formatCurrency(active ? active.value : total, currency, locale, 0)}
          </p>
        </div>
        {arcs.map((arc, index) => (
          <button
            key={arc.label}
            type="button"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className={`flex items-center justify-between gap-4 rounded-lg px-2.5 py-1.5 text-sm transition ${
              hovered === index ? 'bg-surface-muted' : ''
            }`}
          >
            <span className="flex items-center gap-2 text-ink">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: arc.color }} />
              {arc.label}
            </span>
            <span className="font-mono text-ink-strong">
              {total > 0 ? `${Math.round((arc.value / total) * 100)}%` : '0%'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}