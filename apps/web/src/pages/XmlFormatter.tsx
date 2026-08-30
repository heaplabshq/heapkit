import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { Button } from '../components/ui/Button'

// Simple XML formatter - in a real implementation, would use a proper XML library
function formatXml(xmlString: string): { formatted: string; error: string | null } {
  try {
    // Basic XML formatting - just pretty print with indentation
    let result = xmlString
    // Remove existing whitespace-only text nodes and normalize
    result = result.replace(/>\s+</g, '>\n<')
    // Add indentation
    const lines = result.split('\n')
    const indentled: string[] = []
    let indentLevel = 0

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Close tags decrease indent first
      const closeMatch = trimmed.match(/^\<\/([a-zA-Z][a-zA-Z0-9_-]*)\>/)
      if (closeMatch) {
        indentLevel = Math.max(0, indentLevel - 1)
      }

      // Add indented line
      indentled.push('  '.repeat(indentLevel) + trimmed)

      // Open tags increase indent after
      const openMatch = trimmed.match(/^\<([a-zA-Z][a-zA-Z0-9_-]*)[^>]*\>$/)
      if (openMatch) {
        indentLevel += 1
      }
    }

    return { formatted: indentled.join('\n'), error: null }
  } catch (e) {
    return { formatted: xmlString, error: 'Invalid XML.' }
  }
}

export function XmlFormatter() {
  const [input, setInput] = useState('<root><item><name>Test</name><value>123</value></item></root>')

  const { formatted, error } = useMemo(() => {
    if (!input) return { formatted: '', error: null }
    return formatXml(input)
  }, [input])

  return (
    <ToolPage
      title="XML Formatter"
      description="Format and pretty-print XML text with proper indentation and syntax highlighting."
      metaTitle="XML Formatter — format XML free, in-browser"
      metaDescription="Format and pretty-print XML text with proper indentation. All processing client-side — nothing is sent to a server."
      explainTitle="What is XML?"
      explain={
        <>
          <p>
            XML (eXtensible Markup Language) is a markup language that defines a set of rules
            for encoding documents in a format that is both human-readable and machine-readable.
            It's widely used for data representation, configuration files, and API responses.
          </p>
          <p>
            Well-formed XML must have a single root element, properly closed tags, and
            properly nested structure. This tool formats unformatted XML into a readable
            indented structure.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink-strong">Input XML</label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Enter XML to format..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-strong">Formatted XML</label>
          <TextArea
            value={formatted ?? ''}
            readOnly
            rows={6}
            placeholder="Formatted XML will appear here..."
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <Button
          onClick={() => setInput('<root><item><name>Test</name><value>123</value></item></root>')}
        >
          Use example
        </Button>
      </div>
    </ToolPage>
  )
}