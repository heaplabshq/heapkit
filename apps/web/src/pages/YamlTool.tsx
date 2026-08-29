import { useMemo, useState, type ReactNode } from 'react'
import { ToolPage } from '../components/ToolPage'
import { CopyButton } from '../components/CopyButton'
import { NumberField } from '../components/ui/NumberField'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { TextArea } from '../components/ui/TextArea'
import { yamlToJson } from '../lib/yaml'

type Mode = 'validate' | 'toJson'

function YamlPanel({ mode }: { mode: Mode }) {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)

  const { output, error, valid } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null, valid: null as boolean | null }
    try {
      return { output: yamlToJson(input, indent), error: null, valid: true }
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : 'Invalid YAML', valid: false }
    }
  }, [input, indent])

  const outputLabel =
    mode === 'validate' && valid !== null ? (valid ? 'Valid YAML' : 'Invalid YAML') : 'JSON output'

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <NumberField label="Indent" value={indent} min={1} max={8} onChange={setIndent} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink-strong">YAML input</label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder="Paste YAML…"
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

type PageCopy = {
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  explainTitle: string
  explain: ReactNode
}

const copyByMode: Record<Mode, PageCopy> = {
  validate: {
    title: 'YAML Validator',
    description: 'Check whether text is valid YAML, with the parser error if it isn’t.',
    metaTitle: 'YAML Validator — free, in-browser | heapkit',
    metaDescription:
      'Validate YAML instantly and see the exact parser error for invalid input. Runs entirely in your browser.',
    explainTitle: 'Common YAML mistakes',
    explain: (
      <>
        <p>
          YAML is whitespace-sensitive, so the most common failures are inconsistent
          indentation (mixing tabs and spaces, or misaligned list items), missing the space
          after a <code>:</code> in key-value pairs, and unquoted strings that YAML interprets
          as a different type — <code>yes</code>, <code>no</code>, and bare version numbers
          like <code>1.20</code> are frequent surprises.
        </p>
        <p>
          This tool parses with a standard YAML 1.2 parser, so the error matches what most
          config loaders (Kubernetes, Docker Compose, GitHub Actions) will report.
        </p>
      </>
    ),
  },
  toJson: {
    title: 'YAML to JSON Converter',
    description: 'Convert YAML to formatted JSON, entirely in your browser.',
    metaTitle: 'YAML to JSON Converter — free, in-browser | heapkit',
    metaDescription:
      'Convert YAML to JSON instantly with adjustable indentation. Runs entirely in your browser — nothing is uploaded.',
    explainTitle: 'Why convert YAML to JSON?',
    explain: (
      <>
        <p>
          YAML is a superset of JSON's data model but with a friendlier, comment-supporting
          syntax — which makes it popular for config files (Kubernetes manifests, CI
          pipelines, Docker Compose) but awkward to consume from code that expects JSON.
          Converting gives you the same data in a format nearly every language and API can
          parse natively.
        </p>
        <p>
          Note that YAML features with no JSON equivalent — comments, anchors/aliases, and
          multi-document files — are resolved or dropped during conversion.
        </p>
      </>
    ),
  },
}

export function YamlTool({ initialMode }: { initialMode: Mode }) {
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
          { value: 'validate', label: 'Validate' },
          { value: 'toJson', label: 'Convert to JSON' },
        ]}
      />

      <YamlPanel mode={mode} />
    </ToolPage>
  )
}
