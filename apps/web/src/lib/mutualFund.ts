export type MutualFundInputs = {
  principal: number
  expectedReturn: number
  tenureYears: number
  sipAmount?: number
  sipFrequency: 'monthly' | 'yearly'
}

export type MutualFundResult = {
  invested: number
  estimatedReturns: number
  totalValue: number
  annualBreakdown: Array<{
    year: number
    invested: number
    value: number
    returns: number
  }>
}

const round2 = (value: number): number => Math.round(value * 100) / 100

/**
 * Estimates the future value of a mutual-fund / SIP investment using
 * compound growth. Returns are not guaranteed; this is a planning estimate.
 *
 * Two modes:
 * - Lump sum only: `principal` is invested once and grows at `expectedReturn`.
 * - SIP: `sipAmount` is added every period and also compounds. The initial
 *   `principal` is treated as a starting balance that grows alongside the SIP.
 */
export function calculateMutualFund(inputs: MutualFundInputs): MutualFundResult {
  const { principal, expectedReturn, tenureYears, sipAmount = 0, sipFrequency } = inputs
  const annualRate = expectedReturn / 100

  const periodsPerYear = sipFrequency === 'monthly' ? 12 : 1
  const periodRate = annualRate / periodsPerYear
  const totalPeriods = tenureYears * periodsPerYear
  const periodSip = sipAmount

  let value = principal
  let invested = principal
  const annualBreakdown: MutualFundResult['annualBreakdown'] = []

  for (let period = 1; period <= totalPeriods; period++) {
    value = value * (1 + periodRate)
    if (periodSip > 0) {
      value += periodSip
      invested += periodSip
    }

    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear
      annualBreakdown.push({
        year,
        invested: round2(invested),
        value: round2(value),
        returns: round2(value - invested),
      })
    }
  }

  // If tenure is 0 years, still return the initial principal with no growth.
  if (totalPeriods === 0) {
    annualBreakdown.push({ year: 0, invested: round2(principal), value: round2(principal), returns: 0 })
  }

  return {
    invested: round2(invested),
    estimatedReturns: round2(value - invested),
    totalValue: round2(value),
    annualBreakdown,
  }
}
