import { useState } from 'react'
import { formatCompactCurrency, formatCurrency } from '../../lib/emi'

type Point = { month: number; balance: number; cumulativeInterest: number }

/**
 * Area chart of outstanding balance over the loan term, with a second series
 * for cumulative interest paid. Pure SVG with a hover crosshair — no chart
 * library, no external requests.
 */
export function BalanceChart({
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

  const maxBalance = Math.max(...points.map((p) => p.balance), 0)
  const maxInterest = Math.max(...points.map((p) => p.cumulativeInterest), 0)
  const yMax = Math.max(maxBalance, maxInterest) * 1.05 || 1

  const x = (month: number) =>
    pad.left + (points.length > 1 ? ((month - 1) / (points.length - 1)) * innerW : 0)
  const y = (value: number) => pad.top + innerH - (yMax > 0 ? (value / yMax) * innerH : 0)

  const balancePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.month).toFixed(2)},${y(p.balance).toFixed(2)}`)
    .join(' ')
  const balanceArea = `${balancePath} L${x(points[points.length - 1]?.month ?? 1).toFixed(2)},${(pad.top + innerH).toFixed(2)} L${x(1).toFixed(2)},${(pad.top + innerH).toFixed(2)} Z`

  const interestPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.month).toFixed(2)},${y(p.cumulativeInterest).toFixed(2)}`)
    .join(' ')

  const yTicks = 4
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (yMax / yTicks) * i)
  const xTickMonths = Array.from({ length: 6 }, (_, i) =>
    Math.round(1 + ((points.length - 1) * i) / (xTicksCount - 1)),
  )

  const hover = hoverIndex !== null ? points[hoverIndex] : null

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full touch-none"
        onMouseLeave={() => setHoverIndex(null)}
        onMouseMove={(event) => {
          const svgX = ((event.clientX - event.currentTarget.getBoundingClientRect().left) /
            event.currentTarget.getBoundingClientRect().width) * width
          const month = 1 + (svgX - pad.left) / (innerW / Math.max(points.length - 1, 1))
          const index = Math.round(month - 1)
          setHoverIndex(Math.min(points.length - 1, Math.max(0, index)))
        }}
        role="img"
        aria-label="Outstanding balance over the loan term"
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

        {xTickMonths.map((month) => (
          <text
            key={month}
            x={x(month)}
            y={height - 6}
            textAnchor="middle"
            className="fill-current text-[10px] text-ink"
          >
            {`Y${Math.ceil(month / 12)}`}
          </text>
        ))}

        <path d={balanceArea} fill="var(--color-chart-principal)" opacity={0.12} />
        <path
          d={balancePath}
          fill="none"
          stroke="var(--color-chart-principal)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d={interestPath}
          fill="none"
          stroke="var(--color-chart-interest)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />

        {hover && (
          <g>
            <line
              x1={x(hover.month)}
              x2={x(hover.month)}
              y1={pad.top}
              y2={pad.top + innerH}
              stroke="var(--color-border-strong)"
              strokeWidth={1}
            />
            <circle cx={x(hover.month)} cy={y(hover.balance)} r={4} fill="var(--color-chart-principal)" />
            <circle
              cx={x(hover.month)}
              cy={y(hover.cumulativeInterest)}
              r={4}
              fill="var(--color-chart-interest)"
            />
          </g>
        )}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute top-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lift"
          style={{
            left: `${(x(hover.month) / width) * 100}%`,
            transform: `translateX(${hover.month > points.length / 2 ? '-105%' : '5%'})`,
          }}
        >
          <p className="font-medium text-ink-strong">{`Month ${hover.month}`}</p>
          <p className="mt-1 flex items-center gap-1.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-chart-principal" />
            {`Balance ${formatCurrency(hover.balance, currency, locale, 0)}`}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-chart-interest" />
            {`Interest paid ${formatCurrency(hover.cumulativeInterest, currency, locale, 0)}`}
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-chart-principal" />
          Outstanding balance
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-chart-interest" />
          Cumulative interest
        </span>
      </div>
    </div>
  )
}

const xTicksCount = 6