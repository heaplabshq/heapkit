import { useState } from 'react'
import { formatCompactCurrency, formatCurrency } from '../../lib/emi'
import type { YearlyScheduleRow } from '../../lib/emi'

/**
 * Stacked bar chart of yearly principal vs. interest payments. Pure SVG —
 * no chart library, no external requests. Bars are hoverable with a tooltip.
 */
export function YearlyBarsChart({
  years,
  currency,
  locale,
}: {
  years: YearlyScheduleRow[]
  currency: string
  locale: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  const width = 640
  const height = 200
  const pad = { top: 12, right: 8, bottom: 24, left: 52 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const yMax = Math.max(...years.map((y) => y.totalPayment), 1) * 1.05
  const slot = innerW / years.length
  const barW = Math.min(Math.max(slot * 0.6, 3), 28)

  const y = (value: number) => pad.top + innerH - (value / yMax) * innerH
  const yTicks = 4
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (yMax / yTicks) * i)

  const xLabelEvery = Math.ceil(years.length / 12)

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-52 w-full"
        onMouseLeave={() => setHovered(null)}
        role="img"
        aria-label="Yearly principal and interest payments"
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

        {years.map((row, index) => {
          const barX = pad.left + slot * index + (slot - barW) / 2
          const principalH = (row.principal / yMax) * innerH
          const interestH = (row.interest / yMax) * innerH
          const dimmed = hovered !== null && hovered !== index
          return (
            <g
              key={row.year}
              onMouseEnter={() => setHovered(index)}
              className={dimmed ? 'opacity-40' : 'transition-opacity'}
            >
              {/* invisible full-height hit area so hovering anywhere in the slot works */}
              <rect
                x={pad.left + slot * index}
                y={pad.top}
                width={slot}
                height={innerH}
                fill="transparent"
              />
              <rect
                x={barX}
                y={pad.top + innerH - principalH - interestH}
                width={barW}
                height={interestH}
                fill="var(--color-chart-interest)"
                rx={2}
              />
              <rect
                x={barX}
                y={pad.top + innerH - principalH}
                width={barW}
                height={principalH}
                fill="var(--color-chart-principal)"
                rx={2}
              />
              {index % xLabelEvery === 0 && (
                <text
                  x={pad.left + slot * index + slot / 2}
                  y={height - 6}
                  textAnchor="middle"
                  className="fill-current text-[10px] text-ink"
                >
                  {`Y${row.year}`}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {hovered !== null && years[hovered] && (
        <div
          className="pointer-events-none absolute top-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lift"
          style={{
            left: `${((pad.left + slot * hovered + slot / 2) / width) * 100}%`,
            transform: `translateX(${hovered > years.length / 2 ? '-105%' : '5%'})`,
          }}
        >
          <p className="font-medium text-ink-strong">{`Year ${years[hovered].year}`}</p>
          <p className="mt-1 flex items-center gap-1.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-chart-principal" />
            {`Principal ${formatCurrency(years[hovered].principal, currency, locale, 0)}`}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-chart-interest" />
            {`Interest ${formatCurrency(years[hovered].interest, currency, locale, 0)}`}
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-chart-principal" />
          Principal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-chart-interest" />
          Interest
        </span>
      </div>
    </div>
  )
}