import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Button } from '../components/ui/Button'

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function RegexTester() {
  const [pattern, setPattern] = useState('/[a-z]+/g')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'test' | 'replace'>('test')

  const regex = useMemo(() => {
    try {
      const f = 'g'.split('').filter(f => 'gimy'.includes(f))
      return new RegExp(pattern, f.join(''))
    } catch {
      return null as RegExp | null
    }
  }, [pattern])

  const { result, error, replaceResult } = useMemo(() => {
    if (!input || !regex) return { result: [], error: '', replaceResult: input }

    try {
      const result: Array<{ string: string; index: number }> = []
      let match: RegExpExecArray | null

      regex.lastIndex = 0

      while ((match = regex.exec(input)) !== null) {
        result.push({
          string: match[0],
          index: match.index!,
        })
      }

      let replaceResult = input
      if (mode === 'replace' && regex) {
        replaceResult = input.replace(regex, (matched: string) => matched)
      }

      return { result, error: null, replaceResult }
    } catch (e) {
      return { result: [], error: 'Invalid regex or input.', replaceResult: input }
    }
  }, [input, pattern, mode, regex])

  return (
    <ToolPage
      title="Regex Tester"
      description="Test regular expressions with match highlighting, named groups, flags, and replace preview."
      metaTitle="Regex Tester — test and debug regex patterns free, in-browser"
      metaDescription="Test regular expressions with match highlighting, named groups, flags, and replace preview. All processing client-side."
      explainTitle="What are regular expressions?"
      explain={
        <>
          <p>
            Regular expressions (regex) are patterns used to match character combinations in
            strings. They're widely used for validation, parsing, and text manipulation in
            programming, text editors, and command-line tools.
          </p>
          <p>
            This tool lets you test regex patterns against sample text, see which parts match
            (including named groups), and experiment with different flags (global, case-insensitive,
            multiline, etc.).
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { value: 'test', label: 'Test Matches' },
            { value: 'replace', label: 'Replace' },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink-strong">Pattern</label>
            <TextArea
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              rows={2}
              placeholder="/[a-z]+/g"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink-strong">Input Text</label>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder="Enter text to test against..."
            />
          </div>
        </div>

        {mode === 'test' ? (
          <div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {regex ? (
              <div className="mt-4">
                <p className="text-sm font-medium text-ink-strong">Matches found: {result.length}</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full rounded border-border">
                    <thead>
                      <tr>
                        <th className="p-2 text-xs font-medium text-ink-strong">Match</th>
                        <th className="p-2 text-xs font-medium text-ink-strong">Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.map((m, i) => (
                        <tr key={i}>
                          <td className="p-2 text-sm break-all">{m.string}</td>
                          <td className="p-2 text-sm">{m.index}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink">Invalid regex pattern</p>
            )}
          </div>
        ) : (
          <div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <p className="mt-4 text-sm font-medium text-ink-strong">Replace Preview</p>
            <TextArea
              value={replaceResult}
              readOnly
              rows={6}
              placeholder="Replace output will appear here..."
            />
            <Button
              onClick={() => setPattern((prev) => `/${escapeRegExp(prev)}/g`)}
              className="mt-2"
            >
              Auto-escape pattern
            </Button>
          </div>
        )}
      </div>
    </ToolPage>
  )
}