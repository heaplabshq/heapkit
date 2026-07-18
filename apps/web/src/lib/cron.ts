export type FieldMode = 'every' | 'step' | 'specific' | 'range'

export type FieldState = {
  mode: FieldMode
  step?: number
  specific?: string
  rangeFrom?: number
  rangeTo?: number
}

export type CronFields = {
  minute: FieldState
  hour: FieldState
  dayOfMonth: FieldState
  month: FieldState
  dayOfWeek: FieldState
}

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function parseSpecific(input: string): number[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isInteger(n))
}

export function fieldToExpr(state: FieldState, min: number, max: number): string {
  switch (state.mode) {
    case 'every':
      return '*'
    case 'step':
      return `*/${state.step && state.step > 0 ? state.step : 1}`
    case 'specific':
      return state.specific?.trim() || '*'
    case 'range':
      return `${state.rangeFrom ?? min}-${state.rangeTo ?? max}`
  }
}

function matchesField(state: FieldState, value: number, min: number, max: number): boolean {
  switch (state.mode) {
    case 'every':
      return true
    case 'step': {
      const step = state.step && state.step > 0 ? state.step : 1
      return (value - min) % step === 0
    }
    case 'specific': {
      const values = parseSpecific(state.specific ?? '')
      return values.length === 0 ? true : values.includes(value)
    }
    case 'range': {
      const from = state.rangeFrom ?? min
      const to = state.rangeTo ?? max
      return value >= from && value <= to
    }
  }
}

const MAX_MINUTES_TO_SEARCH = 4 * 366 * 24 * 60

/**
 * Standard POSIX cron semantics: when BOTH day-of-month and day-of-week are
 * restricted (not "*"), a match on EITHER is sufficient (they're OR'd, not AND'd).
 */
export function nextRunTimes(fields: CronFields, count: number, from: Date = new Date()): Date[] {
  const results: Date[] = []
  const cursor = new Date(from)
  cursor.setSeconds(0, 0)
  cursor.setMinutes(cursor.getMinutes() + 1)

  const domRestricted = fields.dayOfMonth.mode !== 'every'
  const dowRestricted = fields.dayOfWeek.mode !== 'every'

  let iterations = 0
  while (results.length < count && iterations < MAX_MINUTES_TO_SEARCH) {
    const minuteOk = matchesField(fields.minute, cursor.getMinutes(), 0, 59)
    const hourOk = matchesField(fields.hour, cursor.getHours(), 0, 23)
    const monthOk = matchesField(fields.month, cursor.getMonth() + 1, 1, 12)
    const domOk = matchesField(fields.dayOfMonth, cursor.getDate(), 1, 31)
    const dowOk = matchesField(fields.dayOfWeek, cursor.getDay(), 0, 6)
    const dayOk = domRestricted && dowRestricted ? domOk || dowOk : domOk && dowOk

    if (minuteOk && hourOk && monthOk && dayOk) {
      results.push(new Date(cursor))
    }

    cursor.setMinutes(cursor.getMinutes() + 1)
    iterations++
  }

  return results
}

function genericFieldPhrase(state: FieldState, min: number, max: number, names?: string[]): string {
  const label = (n: number) => names?.[n] ?? String(n)
  switch (state.mode) {
    case 'every':
      return 'every value'
    case 'step':
      return `every ${state.step ?? 1}`
    case 'specific': {
      const values = parseSpecific(state.specific ?? '')
      return values.length ? values.map(label).join(', ') : 'every value'
    }
    case 'range':
      return `${label(state.rangeFrom ?? min)}–${label(state.rangeTo ?? max)}`
  }
}

export function describeCron(fields: CronFields): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = fields
  const isEvery = (f: FieldState) => f.mode === 'every'

  if (isEvery(minute) && isEvery(hour) && isEvery(dayOfMonth) && isEvery(month) && isEvery(dayOfWeek)) {
    return 'Runs every minute, every day.'
  }

  if (
    minute.mode === 'specific' &&
    hour.mode === 'specific' &&
    isEvery(dayOfMonth) &&
    isEvery(month) &&
    (isEvery(dayOfWeek) || dayOfWeek.mode === 'specific')
  ) {
    const mins = parseSpecific(minute.specific ?? '')
    const hrs = parseSpecific(hour.specific ?? '')
    if (mins.length === 1 && hrs.length === 1) {
      const time = `${pad(hrs[0])}:${pad(mins[0])}`
      if (isEvery(dayOfWeek)) return `Runs daily at ${time}.`
      const days = parseSpecific(dayOfWeek.specific ?? '')
      if (days.length > 0) {
        return `Runs at ${time} on ${days.map((d) => DAY_NAMES[d] ?? d).join(', ')}.`
      }
    }
  }

  const parts: string[] = []
  parts.push(
    minute.mode === 'every'
      ? 'every minute'
      : minute.mode === 'step'
        ? `every ${minute.step ?? 1} minute(s)`
        : `at minute ${genericFieldPhrase(minute, 0, 59)}`,
  )
  parts.push(
    hour.mode === 'every'
      ? 'every hour'
      : hour.mode === 'step'
        ? `every ${hour.step ?? 1} hour(s)`
        : `during hour ${genericFieldPhrase(hour, 0, 23)}`,
  )
  if (!isEvery(dayOfMonth)) parts.push(`on day-of-month ${genericFieldPhrase(dayOfMonth, 1, 31)}`)
  if (!isEvery(month)) parts.push(`in ${genericFieldPhrase(month, 1, 12, MONTH_NAMES)}`)
  if (!isEvery(dayOfWeek)) parts.push(`on ${genericFieldPhrase(dayOfWeek, 0, 6, DAY_NAMES)}`)

  return `Runs ${parts.join(', ')}.`
}
