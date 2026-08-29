import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { Select } from '../components/ui/Select'
import { SliderField } from '../components/ui/SliderField'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { DonutChart } from '../components/charts/DonutChart'
import { GrowthChart } from '../components/charts/GrowthChart'
import { calculateMutualFund } from '../lib/mutualFund'
import { formatCurrency } from '../lib/emi'

const CURRENCIES = [
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'INR', label: '₹ INR' },
  { value: 'JPY', label: '¥ JPY' },
  { value: 'CAD', label: 'C$ CAD' },
  { value: 'AUD', label: 'A$ AUD' },
]

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
}

/** 2500000 -> "2,500,000" (grouped, no decimals, no symbol). */
function formatGrouped(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

function parseGrouped(value: string): number {
  const parsed = Number(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export function MutualFundCalculator() {
  const [principal, setPrincipal] = useState(10000)
  const [sipAmount, setSipAmount] = useState(500)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [tenureYears, setTenureYears] = useState(10)
  const [currency, setCurrency] = useState('USD')
  const [sipFrequency, setSipFrequency] = useState<'monthly' | 'yearly'>('monthly')
  const [principalText, setPrincipalText] = useState(() => formatGrouped(10000))
  const [sipText, setSipText] = useState(() => formatGrouped(500))

  const result = useMemo(
    () => calculateMutualFund({ principal, expectedReturn, tenureYears, sipAmount, sipFrequency }),
    [principal, expectedReturn, tenureYears, sipAmount, sipFrequency],
  )

  const fmt = (value: number) => formatCurrency(value, currency, 'en-US')

  const returnsShare = result.totalValue > 0 ? (result.estimatedReturns / result.totalValue) * 100 : 0

  const growthPoints = useMemo(
    () => result.annualBreakdown.map((row) => ({ year: row.year, invested: row.invested, value: row.value })),
    [result.annualBreakdown],
  )

  const currencySymbol = CURRENCY_SYMBOLS[currency] ?? ''

  return (
    <ToolPage
      title="Mutual Fund Return Calculator"
      description="Estimate how much your mutual fund or SIP investment could grow. Adjust the starting amount, contribution, expected return, and tenure to see total value, estimated returns, and a year-by-year breakdown."
      metaTitle="Mutual Fund Return Calculator — free SIP &amp; lump-sum estimator | heapkit"
      metaDescription="Estimate mutual fund returns for lump-sum and SIP investments. See total value, estimated returns, and growth charts. Runs entirely in your browser."
      explainTitle="How are mutual fund returns estimated?"
      explain={
        <>
          <p>
            This calculator estimates future value using
            <strong> compound annual growth</strong>. For a lump-sum investment, the entire
            amount grows at the expected rate each year. For a
            <strong> SIP (systematic investment plan)</strong>, each contribution is added
            every period and also compounds.
          </p>
          <p>
            The estimate uses the formula{' '}
            <code>A = P × (1 + r)^n</code> for lump sums and period-by-period compounding
            for SIPs, where <code>P</code> is the invested amount, <code>r</code> is the
            per-period return, and <code>n</code> is the number of periods. Remember:
            projected returns are not guaranteed; actual fund performance depends on the
            market and the specific scheme.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Inputs */}
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface-muted p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <span className="text-sm font-semibold text-ink-strong">Investment details</span>
              <Select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={CURRENCIES}
              />
            </div>

            <SliderField
              label="Initial investment"
              value={principal}
              min={0}
              max={1000000}
              step={1000}
              display={fmt(principal)}
              onChange={setPrincipal}
              input={
                <div className="flex items-center rounded-lg border border-border bg-surface shadow-xs transition focus-within:border-accent-border focus-within:ring-2 focus-within:ring-accent-subtle">
                  <span className="pl-2.5 text-sm text-ink">{currencySymbol}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Initial investment"
                    value={principalText}
                    onChange={(e) => {
                      setPrincipalText(e.target.value)
                      const parsed = parseGrouped(e.target.value)
                      if (e.target.value !== '' && Number.isFinite(parsed)) {
                        setPrincipal(Math.min(100000000, Math.max(0, parsed)))
                      }
                    }}
                    onBlur={() => setPrincipalText(formatGrouped(principal))}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-28 rounded-lg bg-transparent px-2 py-1 text-right font-mono text-sm font-semibold text-ink-strong focus:outline-none"
                  />
                </div>
              }
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink">SIP contribution</span>
                <SegmentedControl
                  value={sipFrequency}
                  onChange={setSipFrequency}
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                />
              </div>
              <div className="flex items-center rounded-lg border border-border bg-surface shadow-xs transition focus-within:border-accent-border focus-within:ring-2 focus-within:ring-accent-subtle">
                <span className="pl-2.5 text-sm text-ink">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="SIP contribution"
                  value={sipText}
                  onChange={(e) => {
                    setSipText(e.target.value)
                    const parsed = parseGrouped(e.target.value)
                    if (e.target.value !== '' && Number.isFinite(parsed)) {
                      setSipAmount(Math.min(1000000, Math.max(0, parsed)))
                    }
                  }}
                  onBlur={() => setSipText(formatGrouped(sipAmount))}
                  onFocus={(e) => e.currentTarget.select()}
                  className="w-full rounded-lg bg-transparent px-2 py-1 text-right font-mono text-sm font-semibold text-ink-strong focus:outline-none"
                />
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={50}
                value={sipAmount}
                aria-label="SIP contribution"
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setSipAmount(value)
                  setSipText(formatGrouped(value))
                }}
                style={{
                  background: `linear-gradient(to right, var(--color-accent) ${(sipAmount / 10000) * 100}%, var(--color-surface) ${(sipAmount / 10000) * 100}%)`,
                }}
                className="w-full"
              />
            </div>

            <SliderField
              label="Expected return (annual)"
              value={expectedReturn}
              min={1}
              max={30}
              step={0.5}
              display={`${expectedReturn.toFixed(1)}%`}
              onChange={setExpectedReturn}
              minLabel="1%"
              maxLabel="30%"
            />

            <SliderField
              label="Investment tenure"
              value={tenureYears}
              min={1}
              max={40}
              step={1}
              display={`${tenureYears} ${tenureYears === 1 ? 'year' : 'years'}`}
              onChange={setTenureYears}
              minLabel="1 yr"
              maxLabel="40 yrs"
            />

            <div className="mt-1 rounded-xl border border-accent-border bg-accent-subtle p-4">
              <p className="text-sm font-medium text-ink">Estimated total value</p>
              <p className="mt-0.5 text-3xl font-semibold tracking-tight text-ink-strong">
                {fmt(result.totalValue)}
              </p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="flex-1 bg-chart-principal" />
                <div className="bg-chart-interest" style={{ width: `${returnsShare}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-ink">
                {fmt(result.invested)} invested · {fmt(result.estimatedReturns)} estimated returns
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
                <p className="text-sm text-ink">Invested capital</p>
                <p className="mt-1 text-xl font-semibold text-ink-strong">{fmt(result.invested)}</p>
                <p className="mt-1 text-xs text-ink">
                  {sipAmount > 0
                    ? `${sipFrequency === 'monthly' ? tenureYears * 12 : tenureYears} contributions`
                    : 'Lump-sum investment'}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
                <p className="text-sm text-ink">Estimated returns</p>
                <p className="mt-1 text-xl font-semibold text-ink-strong">{fmt(result.estimatedReturns)}</p>
                <p className="mt-1 text-xs text-ink">{returnsShare.toFixed(1)}% of total value</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
                <p className="text-sm text-ink">Total value</p>
                <p className="mt-1 text-xl font-semibold text-ink-strong">{fmt(result.totalValue)}</p>
                <p className="mt-1 text-xs text-ink">
                  {result.invested > 0
                    ? `${(result.totalValue / result.invested).toFixed(2)}× invested capital`
                    : '—'}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
              <p className="mb-3 text-sm font-semibold text-ink-strong">Invested vs. returns</p>
              <DonutChart
                slices={[
                  { label: 'Invested', value: result.invested, color: 'var(--color-chart-principal)' },
                  { label: 'Returns', value: result.estimatedReturns, color: 'var(--color-chart-interest)' },
                ]}
                currency={currency}
                locale="en-US"
                centerLabel="Total value"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
          <p className="mb-3 text-sm font-semibold text-ink-strong">Growth over time</p>
          <GrowthChart points={growthPoints} currency={currency} locale="en-US" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink-strong">Year-by-year breakdown</span>
          </div>

          <div className="max-h-96 overflow-auto rounded-xl border border-border bg-surface-muted">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface-muted">
                <tr className="border-b border-border text-left text-ink">
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 font-medium">Invested</th>
                  <th className="px-3 py-2 font-medium">Returns</th>
                  <th className="px-3 py-2 font-medium">Total value</th>
                </tr>
              </thead>
              <tbody>
                {result.annualBreakdown.map((row) => (
                  <tr
                    key={row.year}
                    className="border-b border-border text-ink last:border-b-0"
                  >
                    <td className="px-3 py-2">{row.year}</td>
                    <td className="px-3 py-2 font-mono">{fmt(row.invested)}</td>
                    <td className="px-3 py-2 font-mono">{fmt(row.returns)}</td>
                    <td className="px-3 py-2 font-mono">{fmt(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink">
            {result.annualBreakdown.length} years — returns are estimates, not guarantees.
          </p>
        </div>
      </div>
    </ToolPage>
  )
}
