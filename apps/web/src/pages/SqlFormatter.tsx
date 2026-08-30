import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { Button } from '../components/ui/Button'

// Simple SQL formatter - in a real implementation, would use sql-formatter library
function formatSql(sqlString: string): { formatted: string; error: string | null } {
  try {
    let result = sqlString
    // Basic SQL formatting steps
    
    // 1. Normalize newlines
    result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    
    // 2. Split into lines and normalize
    const lines = result.split('\n')
    const indentled: string[] = []
    let indentLevel = 0
    
    const sqlKeywords = new Set([
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT',
      'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
      'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE',
      'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
      'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET',
      'INNER', 'LEFT', 'RIGHT', 'CROSS',
      'AS', 'ON', 'IN', 'BETWEEN', 'LIKE',
      'UNION', 'ALL', 'EXISTS', 'INTERSECT', 'MINUS'
    ])
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (!trimmed) {
        indentled.push('')
        continue
      }
      
      // Convert to uppercase for keyword matching
      const upper = trimmed.toUpperCase()
      
      // Check if line starts with a SQL keyword
      const firstWord = upper.split(' ')[0]
      const isKeyword = sqlKeywords.has(firstWord)
      
      // Handle opening of new blocks (keywords that don't need brace)
      if (isKeyword && /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)/i.test(trimmed)) {
        indentled.push('  '.repeat(indentLevel) + trimmed)
        // Don't increase indent for simple keywords at top level
        continue
      }
      
      // Handle keywords that increase indentation
      if (/(FROM|JOIN|SET|WHERE|GROUP|ORDER|HAVING)/i.test(trimmed)) {
        indentled.push('  '.repeat(indentLevel) + trimmed)
        indentLevel += 1
        continue
      }
      
      // Handle closing
      if (trimmed === '}' || trimmed.toUpperCase() === 'END') {
        indentLevel = Math.max(0, indentLevel - 1)
        indentled.push('  '.repeat(indentLevel) + trimmed)
        continue
      }
      
      // Regular line
      indentled.push('  '.repeat(indentLevel) + trimmed)
    }
    
    // Add semicolon if the last line doesn't have one
    const formatted = indentled.join('\n')
    const finalResult = formatted.trim().endsWith(';') ? formatted : formatted + ';'
    
    return { formatted: finalResult, error: null }
  } catch (e) {
    return { formatted: sqlString, error: 'Invalid SQL.' }
  }
}

export function SqlFormatter() {
  const [input, setInput] = useState('SELECT name, email, phone FROM users WHERE active = 1 ORDER BY name')

  const { formatted, error } = useMemo(() => {
    if (!input) return { formatted: '', error: null }
    return formatSql(input)
  }, [input])

  return (
    <ToolPage
      title="SQL Formatter"
      description="Format and pretty-print SQL queries with proper indentation and keyword highlighting."
      metaTitle="SQL Formatter — format SQL queries free, in-browser"
      metaDescription="Format and pretty-print SQL queries with proper indentation. All processing client-side — nothing is sent to a server."
      explainTitle="What is SQL?"
      explain={
        <>
          <p>
            SQL (Structured Query Language) is the standard language for relational database
            management. It's used to query, update, and manage data in relational database
            management systems (RDBMS) like MySQL, PostgreSQL, SQLite, and SQL Server.
          </p>
          <p>
            Well-structured SQL uses proper indentation, consistent keyword casing, and clear
            clause structure. This tool provides basic formatting for SQL queries to make
            them more readable.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink-strong">Input SQL</label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Enter SQL to format (e.g. SELECT name, email FROM users WHERE active = 1)..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-strong">Formatted SQL</label>
          <TextArea
            value={formatted ?? ''}
            readOnly
            rows={6}
            placeholder="Formatted SQL will appear here..."
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <Button
          onClick={() => setInput('SELECT name, email, phone FROM users WHERE active = 1 ORDER BY name')}
        >
          Use example
        </Button>
      </div>
    </ToolPage>
  )
}