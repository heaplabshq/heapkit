import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Select } from '../components/ui/Select'

function formatTimestamp(date: Date, format: 'unix' | 'iso'): string {
  switch (format) {
    case 'unix':
      return Math.floor(date.getTime() / 1000).toString()
    case 'iso':
      return date.toISOString()
    default:
      return date.toLocaleString()
  }
}

function parseTimestamp(input: string, format: 'unix' | 'iso'): Date {
  const num = Number(input)
  if (format === 'unix' && !isNaN(num)) {
    return new Date(num * 1000)
  }
  if (format === 'iso' && /^\d{4}-\d{2}-\d{2}T/.test(input)) {
    return new Date(input)
  }
  return new Date(input)
}

export function TimestampConverter() {
  const [mode, setMode] = useState<'convert' | 'parse'>('convert')
  const [format, setFormat] = useState<'unix' | 'iso'>('unix')
  const [input, setInput] = useState('')

  const { error, result } = useMemo(() => {
    if (!input) return { error: null, result: '' }

    try {
      if (mode === 'convert') {
        const date = new Date(input)
        if (isNaN(date.getTime())) {
          return { error: 'Invalid date input.', result: '' }
        }
        const formatted = formatTimestamp(date, format)
        return { error: null, result: formatted }
      } else {
        // parse mode
        const date = parseTimestamp(input, format)
        if (isNaN(date.getTime())) {
          return { error: 'Invalid timestamp input.', result: '' }
        }
        const formatted = formatTimestamp(date, format)
        return { error: null, result: formatted }
      }
    } catch {
      return { error: 'Invalid input.', result: '' }
    }
  }, [input, mode, format])

  return (
    <ToolPage
      title="Timestamp Converter"
      description="Convert between Unix timestamps, ISO strings, and human-readable dates."
      metaTitle="Timestamp Converter — convert Unix, ISO, and human dates free, in-browser"
      metaDescription="Convert between Unix timestamps, ISO 8601 strings, and human-readable dates. All processing client-side — nothing is sent to a server."
      explainTitle="What is a Unix timestamp?"
      explain={
        <>
          <p>
            A Unix timestamp (also known as Epoch time) is the number of seconds that have
            elapsed since <code>January 1, 1970 (UTC)</code>, minus leap seconds. It's used
            widely in computing, databases, and APIs as a simple way to represent a point in
            time.
          </p>
          <p>
            This tool lets you convert between Unix timestamps and ISO 8601 strings, as well
            as human-readable formats localized to your browser's timezone.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { value: 'convert', label: 'Convert Date' },
            { value: 'parse', label: 'Parse Timestamp' },
          ]}
        />

        {mode === 'convert' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink-strong">Input</label>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                placeholder="Enter a date (e.g. 2024-01-15 or 1705315200)..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-strong">Output</label>
              <TextArea
                value={result ?? ''}
                readOnly
                rows={4}
                placeholder="Converted timestamp will appear here..."
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink-strong">Input</label>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                placeholder="Enter a Unix timestamp (seconds) or ISO string..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-strong">Output</label>
              <TextArea
                value={result ?? ''}
                readOnly
                rows={4}
                placeholder="Parsed date will appear here..."
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-3">
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'unix' | 'iso')}
            options={[
              { value: 'unix', label: 'Unix timestamp' },
              { value: 'iso', label: 'ISO 8601' },
            ]}
          />
        </div>
      </div>
    </ToolPage>
  )
}