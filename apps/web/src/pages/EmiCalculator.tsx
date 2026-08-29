import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Select } from '../components/ui/Select'
import { SliderField } from '../components/ui/SliderField'
import { DonutChart } from '../components/charts/DonutChart'
import { BalanceChart } from '../components/charts/BalanceChart'
import { YearlyBarsChart } from '../components/charts/YearlyBarsChart'
import {
  aggregateScheduleByYear,
  calculateEmi,
  formatCurrency,
} from '../lib/emi'

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

export function EmiCalculator() {
  const [principal, setPrincipal] = useState(250000)
  const [annualRate, setAnnualRate] = useState(7.5)
  const [tenureYears, setTenureYears] = useState(20)
  const [currency, setCurrency] = useState('USD')
  const [scheduleMode, setScheduleMode] = useState<'monthly' | 'yearly'>('yearly')
  const [amountText, setAmountText] = useState(() => formatGrouped(250000))

  const tenureMonths = tenureYears * 12

  const result = useMemo(
    () => calculateEmi({ principal, annualRate, tenureMonths }),
    [principal, annualRate, tenureMonths],
  )

  const yearly = useMemo(() => aggregateScheduleByYear(result.schedule), [result.schedule])

  const balancePoints = useMemo(() => {
    let runningInterest = 0
    return result.schedule.map((row) => {
      runningInterest += row.interest
      return {
        month: row.month,
        balance: row.closingBalance,
        cumulativeInterest: Math.round(runningInterest * 100) / 100,
      }
    })
  }, [result.schedule])

  const fmt = (value: number) => formatCurrency(value, currency, 'en-US')

  const interestShare =
    result.totalPayment > 0 ? (result.totalInterest / result.totalPayment) * 100 : 0

  const firstPayment = result.schedule[0]
  const firstPaymentInterestShare =
    firstPayment && firstPayment.emi > 0 ? (firstPayment.interest / firstPayment.emi) * 100 : 0

  return (
    <ToolPage
      title="EMI Calculator"
      description="Estimate your equated monthly installment, see how interest dominates early payments, and explore the full amortization schedule."
      metaTitle="EMI Calculator — free loan payment estimator with charts | heapkit"
      metaDescription="Calculate your equated monthly installment (EMI), total interest, and amortization schedule with interactive charts. Runs entirely in your browser."
      explainTitle="How is EMI calculated?"
      explain={
        <>
          <p>
            <strong>EMI</strong> (Equated Monthly Installment) is the fixed amount you repay each
            month on a loan. It is calculated from the principal amount, the annual interest rate,
            and the loan tenure. Part of each payment covers interest on the remaining balance,
            and the rest reduces the principal.
          </p>
          <p>
            The formula used is: <code>EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)</code>, where{' '}
            <code>P</code> is the principal, <code>r</code> is the monthly interest rate, and{' '}
            <code>n</code> is the number of months. Early payments are mostly interest; later
            payments are mostly principal — the charts above make that shift visible.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Inputs */}
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface-muted p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <span className="text-sm font-semibold text-ink-strong">Loan details</span>
              <Select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={CURRENCIES}
              />
            </div>

            <SliderField
              label="Loan amount"
              value={principal}
              min={10000}
              max={10000000}
              step={10000}
              display={fmt(principal)}
              onChange={setPrincipal}
              input={
                <div className="flex items-center rounded-lg border border-border bg-surface shadow-xs transition focus-within:border-accent-border focus-within:ring-2 focus-within:ring-accent-subtle">
                  <span className="pl-2.5 text-sm text-ink">{CURRENCY_SYMBOLS[currency] ?? ''}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Loan amount"
                    value={amountText}
                    onChange={(e) => {
                      setAmountText(e.target.value)
                      const parsed = Number(e.target.value.replace(/[^0-9.]/g, ''))
                      if (e.target.value !== '' && Number.isFinite(parsed)) {
                        setPrincipal(Math.min(100000000, Math.max(1000, parsed)))
                      }
                    }}
                    onBlur={() => setAmountText(formatGrouped(principal))}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-28 rounded-lg bg-transparent px-2 py-1 text-right font-mono text-sm font-semibold text-ink-strong focus:outline-none"
                  />
                </div>
              }
            />

            <SliderField
              label="Interest rate"
              value={annualRate}
              min={0}
              max={25}
              step={0.05}
              display={`${annualRate.toFixed(2)}%`}
              onChange={setAnnualRate}
              minLabel="0%"
              maxLabel="25%"
            />

            <SliderField
              label="Tenure"
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
              <p className="text-sm font-medium text-ink">Monthly EMI</p>
              <p className="mt-0.5 text-3xl font-semibold tracking-tight text-ink-strong">
                {fmt(result.emi)}
              </p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="bg-chart-interest"
                  style={{ width: `${firstPaymentInterestShare}%` }}
                />
                <div className="flex-1 bg-chart-principal" />
              </div>
              <p className="mt-1.5 text-xs text-ink">
                First payment: {fmt(result.schedule[0]?.interest ?? 0)} interest ·{' '}
                {fmt(result.schedule[0]?.principal ?? 0)} principal
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
                <p className="text-sm text-ink">Total interest</p>
                <p className="mt-1 text-xl font-semibold text-ink-strong">
                  {fmt(result.totalInterest)}
                </p>
                <p className="mt-1 text-xs text-ink">
                  {interestShare.toFixed(1)}% of total payment
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
                <p className="text-sm text-ink">Total payment</p>
                <p className="mt-1 text-xl font-semibold text-ink-strong">
                  {fmt(result.totalPayment)}
                </p>
                <p className="mt-1 text-xs text-ink">{`${tenureMonths} payments`}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
                <p className="text-sm text-ink">Interest-to-principal</p>
                <p className="mt-1 text-xl font-semibold text-ink-strong">
                  {principal > 0 ? `${(result.totalInterest / principal).toFixed(2)}×` : '—'}
                </p>
                <p className="mt-1 text-xs text-ink">interest paid per unit borrowed</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
              <p className="mb-3 text-sm font-semibold text-ink-strong">
                Principal vs. interest
              </p>
              <DonutChart
                slices={[
                  { label: 'Principal', value: principal, color: 'var(--color-chart-principal)' },
                  { label: 'Interest', value: result.totalInterest, color: 'var(--color-chart-interest)' },
                ]}
                currency={currency}
                locale="en-US"
                centerLabel="Total payment"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
            <p className="mb-3 text-sm font-semibold text-ink-strong">Balance over time</p>
            <BalanceChart points={balancePoints} currency={currency} locale="en-US" />
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
            <p className="mb-3 text-sm font-semibold text-ink-strong">Payments per year</p>
            <YearlyBarsChart years={yearly} currency={currency} locale="en-US" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink-strong">Amortization schedule</span>
            <SegmentedControl
              value={scheduleMode}
              onChange={setScheduleMode}
              options={[
                { value: 'yearly', label: 'Yearly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
            />
          </div>

          <div className="max-h-96 overflow-auto rounded-xl border border-border bg-surface-muted">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface-muted">
                <tr className="border-b border-border text-left text-ink">
                  {scheduleMode === 'monthly' ? (
                    <>
                      <th className="px-3 py-2 font-medium">Month</th>
                      <th className="px-3 py-2 font-medium">Opening</th>
                      <th className="px-3 py-2 font-medium">EMI</th>
                      <th className="px-3 py-2 font-medium">Interest</th>
                      <th className="px-3 py-2 font-medium">Principal</th>
                      <th className="px-3 py-2 font-medium">Closing</th>
                    </>
                  ) : (
                    <>
                      <th className="px-3 py-2 font-medium">Year</th>
                      <th className="px-3 py-2 font-medium">Opening</th>
                      <th className="px-3 py-2 font-medium">Principal</th>
                      <th className="px-3 py-2 font-medium">Interest</th>
                      <th className="px-3 py-2 font-medium">Total</th>
                      <th className="px-3 py-2 font-medium">Closing</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {scheduleMode === 'monthly'
                  ? result.schedule.map((row) => (
                      <tr key={row.month} className="border-b border-border text-ink last:border-b-0">
                        <td className="px-3 py-2">{row.month}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.openingBalance)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.emi)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.interest)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.principal)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.closingBalance)}</td>
                      </tr>
                    ))
                  : yearly.map((row) => (
                      <tr key={row.year} className="border-b border-border text-ink last:border-b-0">
                        <td className="px-3 py-2">{row.year}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.openingBalance)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.principal)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.interest)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.totalPayment)}</td>
                        <td className="px-3 py-2 font-mono">{fmt(row.closingBalance)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink">
            {scheduleMode === 'monthly'
              ? `${result.schedule.length} monthly payments`
              : `${yearly.length} years — totals per calendar year of the loan`}
          </p>
        </div>
      </div>
    </ToolPage>
  )
}