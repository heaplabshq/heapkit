import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { Button } from '../components/ui/Button'

// Simple JS formatter - in a real implementation, would use a proper JS parser (like prettier)
function formatJs(jsString: string): { formatted: string; error: string | null } {
  try {
    let result = jsString
    // Basic formatting steps
    
    // 1. Normalize newlines
    result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    
    // 2. Remove trailing whitespace on each line and add basic indentation
    const lines = result.split('\n')
    const indentled: string[] = []
    let indentLevel = 0
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (!trimmed) {
        indentled.push('')
        continue
      }
      
      // Handle closing brace - decrease indent first
      if (trimmed === '}') {
        indentLevel = Math.max(0, indentLevel - 1)
        indentled.push('  '.repeat(indentLevel) + '}')
        continue
      }
      
      // Handle opening brace on same line
      const openBraceMatch = trimmed.match(/(.+)\{$/)
      if (openBraceMatch) {
        indentled.push('  '.repeat(indentLevel) + trimmed)
        indentLevel += 1
        continue
      }
      
      // Regular line
      indentled.push('  '.repeat(indentLevel) + trimmed)
    }
    
    return { formatted: indentled.join('\n'), error: null }
  } catch (e) {
    return { formatted: jsString, error: 'Invalid JavaScript.' }
  }
}

export function JsFormatter() {
  const [input, setInput] = useState('function hello() { console.log("Hello, world!"); }')

  const { formatted, error } = useMemo(() => {
    if (!input) return { formatted: '', error: null }
    return formatJs(input)
  }, [input])

  return (
    <ToolPage
      title="JavaScript Formatter"
      description="Format and pretty-print JavaScript code with proper indentation and structure."
      metaTitle="JavaScript Formatter — format JS free, in-browser"
      metaDescription="Format and pretty-print JavaScript code with proper indentation. All processing client-side — nothing is sent to a server."
      explainTitle="What is JavaScript?"
      explain={
        <>
          <p>
            JavaScript (JS) is a dynamic programming language that's one of the core technologies
            of the World Wide Web, alongside HTML and CSS. It's used to make web pages
            interactive and is an essential part of web development.
          </p>
          <p>
            Well-structured JavaScript uses proper indentation, consistent spacing, and clear
            block structure. This tool provides basic formatting for JavaScript code.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink-strong">Input JavaScript</label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Enter JavaScript to format (e.g. function hello() { console.log('Hello'); }...)..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-strong">Formatted JavaScript</label>
          <TextArea
            value={formatted ?? ''}
            readOnly
            rows={6}
            placeholder="Formatted JavaScript will appear here..."
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <Button
          onClick={() => setInput('function hello() { console.log("Hello, world!"); }')}
        >
          Use example
        </Button>
      </div>
    </ToolPage>
  )
}