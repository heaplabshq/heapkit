export type EmiInputs = {
  principal: number
  annualRate: number
  tenureMonths: number
}

export type EmiResult = {
  emi: number
  totalInterest: number
  totalPayment: number
  schedule: Array<{
    month: number
    openingBalance: number
    emi: number
    interest: number
    principal: number
    closingBalance: number
  }>
}

export function calculateEmi(inputs: EmiInputs): EmiResult {
  const { principal, annualRate, tenureMonths } = inputs
  const monthlyRate = annualRate / 12 / 100

  let emi: number
  if (monthlyRate === 0 || tenureMonths === 0) {
    emi = tenureMonths > 0 ? principal / tenureMonths : 0
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  }

  emi = Math.round(emi * 100) / 100

  const schedule: EmiResult['schedule'] = []
  let balance = principal
  let totalInterest = 0

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = Math.round(balance * monthlyRate * 100) / 100
    let principalPaid = emi - interest
    // The final payment is adjusted so the balance clears exactly — a fixed
    // rounded EMI would otherwise leave a small residual on the books.
    if (month === tenureMonths || principalPaid > balance) {
      principalPaid = balance
    }
    const rowEmi = Math.round((interest + principalPaid) * 100) / 100
    const closingBalance = Math.round((balance - principalPaid) * 100) / 100

    schedule.push({
      month,
      openingBalance: Math.round(balance * 100) / 100,
      emi: rowEmi,
      interest,
      principal: Math.round(principalPaid * 100) / 100,
      closingBalance,
    })

    totalInterest += interest
    balance = closingBalance
  }

  const totalPayment = principal + totalInterest

  return {
    emi,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    schedule,
  }
}

export type YearlyScheduleRow = {
  year: number
  openingBalance: number
  principal: number
  interest: number
  totalPayment: number
  closingBalance: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/** Groups a monthly amortization schedule into calendar-year buckets. */
export function aggregateScheduleByYear(schedule: EmiResult['schedule']): YearlyScheduleRow[] {
  const years: YearlyScheduleRow[] = []

  for (const row of schedule) {
    const year = Math.ceil(row.month / 12)
    let entry = years[year - 1]
    if (!entry) {
      entry = {
        year,
        openingBalance: row.openingBalance,
        principal: 0,
        interest: 0,
        totalPayment: 0,
        closingBalance: row.closingBalance,
      }
      years[year - 1] = entry
    }
    entry.principal = round2(entry.principal + row.principal)
    entry.interest = round2(entry.interest + row.interest)
    entry.totalPayment = round2(entry.totalPayment + row.emi)
    entry.closingBalance = row.closingBalance
  }

  return years
}

export function formatCurrency(
  value: number,
  currency: string,
  locale: string,
  fractionDigits = 2,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/** Compact currency for chart axis labels, e.g. "$25.0K" / "₹1.2L". */
export function formatCompactCurrency(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
