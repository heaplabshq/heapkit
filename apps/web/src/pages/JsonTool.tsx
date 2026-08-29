import { useMemo, useState, type ReactNode } from 'react'
import { ToolPage } from '../components/ToolPage'
import { CopyButton } from '../components/CopyButton'
import { Checkbox } from '../components/ui/Checkbox'
import { NumberField } from '../components/ui/NumberField'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { TextArea } from '../components/ui/TextArea'
import { formatJson, minifyJson, diffLines } from '../lib/json'

type Mode = 'format' | 'validate' | 'diff'

const MAX_DIFF_LINES = 1500

function FormatValidatePanel({ mode }: { mode: 'format' | 'validate' }) {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)
  const [minify, setMinify] = useState(false)

  const { output, error, valid } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null, valid: null as boolean | null }
    try {
      const formatted = minify ? minifyJson(input) : formatJson(input, indent, sortKeys)
      return { output: formatted, error: null, valid: true }
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON', valid: false }
    }
  }, [input, indent, sortKeys, minify])

  const outputLabel =
    mode === 'validate' && valid === true
      ? 'Valid JSON'
      : mode === 'validate' && valid === false
        ? 'Invalid JSON'
        : 'Output'

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <NumberField label="Indent" value={indent} min={1} max={8} onChange={setIndent} disabled={minify} />
        <Checkbox label="Sort keys" checked={sortKeys} onChange={setSortKeys} disabled={minify} />
        <Checkbox label="Minify" checked={minify} onChange={setMinify} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink-strong">JSON input</label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder="Paste JSON…"
            error={valid === false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              className={`text-sm font-medium ${
                mode === 'validate' && valid !== null ? (valid ? 'text-success' : 'text-danger') : 'text-ink-strong'
              }`}
            >
              {outputLabel}
            </label>
            <CopyButton text={output} />
          </div>
          <TextArea value={error ?? output} readOnly rows={12} error={Boolean(error)} className="bg-surface-muted" />
        </div>
      </div>
    </>
  )
}

function DiffPanel() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const { lines, error, tooLarge } = useMemo(() => {
    if (!left.trim() || !right.trim()) return { lines: [], error: null as string | null, tooLarge: false }
    try {
      const a = formatJson(left, 2, false).split('\n')
      const b = formatJson(right, 2, false).split('\n')
      if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES) {
        return { lines: [], error: null, tooLarge: true }
      }
      return { lines: diffLines(a, b), error: null, tooLarge: false }
    } catch (e) {
      return { lines: [], error: e instanceof Error ? e.message : 'Invalid JSON', tooLarge: false }
    }
  }, [left, right])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink-strong">Original JSON</label>
          <TextArea value={left} onChange={(e) => setLeft(e.target.value)} rows={10} placeholder="Paste original JSON…" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink-strong">Changed JSON</label>
          <TextArea value={right} onChange={(e) => setRight(e.target.value)} rows={10} placeholder="Paste changed JSON…" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink-strong">Diff</label>
        {error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : tooLarge ? (
          <p className="text-sm text-ink">
            Input is too large to diff in the browser (over {MAX_DIFF_LINES} lines per side). Try
            comparing smaller sections.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-surface-muted">
            {lines.length === 0 ? (
              <p className="p-3 text-sm text-ink">Paste JSON on both sides to see the diff.</p>
            ) : (
              lines.map((line, i) => (
                <div
                  key={i}
                  className={`whitespace-pre px-3 py-0.5 font-mono text-sm ${
                    line.type === 'add'
                      ? 'bg-success-subtle text-success'
                      : line.type === 'remove'
                        ? 'bg-danger-subtle text-danger'
                        : 'text-ink'
                  }`}
                >
                  <span className="select-none pr-2 opacity-60">
                    {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                  </span>
                  {line.text}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}

type PageCopy = {
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  explainTitle: string
  explain: ReactNode
}

const copyByMode: Record<Mode, PageCopy> = {
  format: {
    title: 'JSON Formatter',
    description: 'Beautify and indent JSON locally in your browser — nothing is uploaded.',
    metaTitle: 'JSON Formatter — free, in-browser | heapkit',
    metaDescription:
      'Format and beautify JSON instantly with adjustable indentation and key sorting. Runs entirely in your browser.',
    explainTitle: 'Why format JSON?',
    explain: (
      <>
        <p>
          JSON produced by APIs, logs, or minified build output is often a single unreadable
          line. Formatting re-indents it into a readable tree structure, which makes it far
          easier to spot the field you're looking for or debug a malformed payload.
        </p>
        <p>
          Sorting keys alphabetically is useful when diffing two JSON documents that were
          serialized in different orders, since it normalizes both sides first.
        </p>
      </>
    ),
  },
  validate: {
    title: 'JSON Validator',
    description: 'Check whether text is valid JSON, with the parser error if it isn’t.',
    metaTitle: 'JSON Validator — free, in-browser | heapkit',
    metaDescription:
      'Validate JSON instantly and see the exact parser error for invalid input. Runs entirely in your browser.',
    explainTitle: 'Common JSON mistakes',
    explain: (
      <>
        <p>
          The most frequent reasons JSON fails to parse: trailing commas after the last item in
          an object or array, single quotes instead of double quotes around strings and keys,
          unquoted keys, and comments (JSON has no comment syntax, unlike JavaScript object
          literals it superficially resembles).
        </p>
        <p>
          This tool uses your browser's native JSON parser, so the error message and position
          match exactly what your application will see at runtime.
        </p>
      </>
    ),
  },
  diff: {
    title: 'JSON Diff',
    description: 'Compare two JSON documents and see exactly what changed, line by line.',
    metaTitle: 'JSON Diff — compare two JSON documents | heapkit',
    metaDescription:
      'Compare two JSON documents and see line-by-line additions and removals. Runs entirely in your browser.',
    explainTitle: 'How this diff works',
    explain: (
      <>
        <p>
          Both documents are parsed and re-formatted with the same indentation first, so
          differences in whitespace or key order alone don't show up as noise — only
          structural and value changes do. The result is then compared line by line.
        </p>
        <p>
          For very large documents, consider diffing individual sections rather than entire
          files — line-by-line diffing is O(n²) and can get slow beyond a few thousand
          lines.
        </p>
      </>
    ),
  },
}

export function JsonTool({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const copy = copyByMode[initialMode]

  return (
    <ToolPage
      title={copy.title}
      description={copy.description}
      metaTitle={copy.metaTitle}
      metaDescription={copy.metaDescription}
      explainTitle={copy.explainTitle}
      explain={copy.explain}
    >
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: 'format', label: 'Format' },
          { value: 'validate', label: 'Validate' },
          { value: 'diff', label: 'Diff' },
        ]}
      />

      {mode === 'diff' ? <DiffPanel /> : <FormatValidatePanel mode={mode} />}
    </ToolPage>
  )
}
