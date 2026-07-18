function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep)
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(source).sort()) {
      sorted[key] = sortKeysDeep(source[key])
    }
    return sorted
  }
  return value
}

export function formatJson(input: string, indent: number, sortKeys: boolean): string {
  const parsed = JSON.parse(input)
  const value = sortKeys ? sortKeysDeep(parsed) : parsed
  return JSON.stringify(value, null, indent)
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input))
}

export type DiffLine = { type: 'equal' | 'add' | 'remove'; text: string }

/** Longest-common-subsequence line diff. O(m*n) — callers should cap input size. */
export function diffLines(a: string[], b: string[]): DiffLine[] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const result: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      result.push({ type: 'equal', text: a[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'remove', text: a[i] })
      i++
    } else {
      result.push({ type: 'add', text: b[j] })
      j++
    }
  }
  while (i < m) {
    result.push({ type: 'remove', text: a[i] })
    i++
  }
  while (j < n) {
    result.push({ type: 'add', text: b[j] })
    j++
  }
  return result
}
