import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { Button } from '../components/ui/Button'

// Simple CSS formatter - in a real implementation, would use a proper CSS parser
function formatCss(cssString: string): { formatted: string; error: string | null } {
  try {
    let result = cssString
    // Normalize newlines
    result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    // Add basic indentation for rulesets
    const lines = result.split('\n')
    const indentled: string[] = []
    let indentLevel = 0

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        indentled.push('')
        continue
      }

      // Properties inside rulesets increase indent
      const propMatch = trimmed.match(/^\s*([a-zA-Z_-][a-zA-Z0-9_-]*)\s*:\s*(.+)$/)
      if (propMatch && indentLevel > 0) {
        indentled.push('  '.repeat(indentLevel) + trimmed)
        continue
      }

      // Opening brace increases indent
      const openBrace = trimmed.match(/^\{/)
      if (openBrace) {
        indentled.push('{')
        indentLevel += 1
        continue
      }

      // Closing brace decreases indent first
      const closeBrace = trimmed.match(/^\}/)
      if (closeBrace) {
        indentLevel = Math.max(0, indentLevel - 1)
        indentled.push('  '.repeat(indentLevel) + '}')
        continue
      }

      // Selectors
      indentled.push('  '.repeat(indentLevel) + trimmed)
    }

    return { formatted: indentled.join('\n'), error: null }
  } catch (e) {
    return { formatted: cssString, error: 'Invalid CSS.' }
  }
}

export function CssFormatter() {
  const [input, setInput] = useState('button { background-color: blue; color: white; padding: 10px; }')

  const { formatted, error } = useMemo(() => {
    if (!input) return { formatted: '', error: null }
    return formatCss(input)
  }, [input])

  return (
    <ToolPage
      title="CSS Formatter"
      description="Format and pretty-print CSS code with proper indentation and structure."
      metaTitle="CSS Formatter — format CSS free, in-browser"
      metaDescription="Format and pretty-print CSS code with proper indentation. All processing client-side — nothing is sent to a server."
      explainTitle="What is CSS?"
      explain={
        <>
          <p>
            CSS (Cascading Style Sheets) is a style sheet language used for describing the
            presentation of a document written in HTML or XML. It controls layout, colors,
            fonts, and responsiveness of web pages.
          </p>
          <p>
            Well-structured CSS uses rulesets consisting of selectors and declaration blocks.
            This tool formats unformatted CSS into a readable indented structure with proper
            nesting and spacing.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink-strong">Input CSS</label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Enter CSS to format (e.g. button { color: red; }...)..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-strong">Formatted CSS</label>
          <TextArea
            value={formatted ?? ''}
            readOnly
            rows={6}
            placeholder="Formatted CSS will appear here..."
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <Button
          onClick={() => setInput('button { background-color: blue; color: white; padding: 10px; }')}
        >
          Use example
        </Button>
      </div>
    </ToolPage>
  )
}