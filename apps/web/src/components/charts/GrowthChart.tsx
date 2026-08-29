import { useState } from 'react'
import { formatCompactCurrency, formatCurrency } from '../../lib/emi'

type Point = { year: number; invested: number; value: number }

/**
 * Area chart of invested capital versus total fund value over time. Pure SVG
 * with a hover crosshair — no chart library, no external requests.
 */
export function GrowthChart({
  points,
  currency,
  locale,
}: {
  points: Point[]
  currency: string
  locale: string
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const width = 640
  const height = 220
  const pad = { top: 12, right: 12, bottom: 24, left: 52 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const yMax = Math.max(...points.map((p) => p.value), 1) * 1.05

  const x = (year: number) =>
    pad.left + (points.length > 1 ? ((year - 1) / (points.length - 1)) * innerW : innerW / 2)
  const y = (value: number) => pad.top + innerH - (yMax > 0 ? (value / yMax) * innerH : 0)

  const valuePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.year).toFixed(2)},${y(p.value).toFixed(2)}`)
    .join(' ')
  const valueArea = `${valuePath} L${x(points[points.length - 1]?.year ?? 1).toFixed(2)},${(pad.top + innerH).toFixed(2)} L${x(1).toFixed(2)},${(pad.top + innerH).toFixed(2)} Z`

  const investedPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.year).toFixed(2)},${y(p.invested).toFixed(2)}`)
    .join(' ')

  const yTicks = 4
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (yMax / yTicks) * i)
  const xTickYears = Array.from({ length: Math.min(points.length, 6) }, (_, i) =>
    Math.round(1 + ((points.length - 1) * i) / Math.max(Math.min(points.length, 6) - 1, 1)),
  )

  const hover = hoverIndex !== null ? points[hoverIndex] : null

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full touch-none"
        onMouseLeave={() => setHoverIndex(null)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          const svgX = ((event.clientX - rect.left) / rect.width) * width
          const year = 1 + (svgX - pad.left) / (innerW / Math.max(points.length - 1, 1))
          const index = Math.round(year - 1)
          setHoverIndex(Math.min(points.length - 1, Math.max(0, index)))
        }}
        role="img"
        aria-label="Investment growth over time"
      >
        {yTickValues.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
            <text
              x={pad.left - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-current text-[10px] text-ink"
            >
              {formatCompactCurrency(tick, currency, locale)}
            </text>
          </g>
        ))}

        {xTickYears.map((year) => (
          <text
            key={year}
            x={x(year)}
            y={height - 6}
            textAnchor="middle"
            className="fill-current text-[10px] text-ink"
          >
            {`Y${year}`}
          </text>
        ))}

        <path d={valueArea} fill="var(--color-chart-principal)" opacity={0.12} />
        <path
          d={valuePath}
          fill="none"
          stroke="var(--color-chart-principal)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d={investedPath}
          fill="none"
          stroke="var(--color-chart-interest)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />

        {hover && (
          <g>
            <line
              x1={x(hover.year)}
              x2={x(hover.year)}
              y1={pad.top}
              y2={pad.top + innerH}
              stroke="var(--color-border-strong)"
              strokeWidth={1}
            />
            <circle cx={x(hover.year)} cy={y(hover.value)} r={4} fill="var(--color-chart-principal)" />
            <circle cx={x(hover.year)} cy={y(hover.invested)} r={4} fill="var(--color-chart-interest)" />
          </g>
        )}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute top-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lift"
          style={{
            left: `${(x(hover.year) / width) * 100}%`,
            transform: `translateX(${hover.year > points.length / 2 ? '-105%' : '5%'})`,
          }}
        >
          <p className="font-medium text-ink-strong">{`Year ${hover.year}`}</p>
          <p className="mt-1 flex items-center gap-1.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-chart-principal" />
            {`Value ${formatCurrency(hover.value, currency, locale, 0)}`}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-chart-interest" />
            {`Invested ${formatCurrency(hover.invested, currency, locale, 0)}`}
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-chart-principal" />
          Total value
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-chart-interest" />
          Invested capital
        </span>
      </div>
    </div>
  )
}
