import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { Button } from '../components/ui/Button'

function parseUrl(urlString: string) {
  try {
    const url = new URL(urlString)
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port === '' ? undefined : url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      href: url.href,
    }
  } catch {
    return null
  }
}

function formatUrlParts(parts: Record<string, string | undefined>): string {
  return Object.entries(parts)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

export function UrlParser() {
  const [input, setInput] = useState('https://www.example.com:8080/path/to/page?name=value#section')

  const { error, result } = useMemo(() => {
    if (!input) return { error: null, result: '' }

    try {
      const parsed = parseUrl(input)
      if (!parsed) {
        return { error: 'Invalid URL.', result: '' }
      }
      return { error: null, result: formatUrlParts(parsed) }
    } catch {
      return { error: 'Invalid URL.', result: '' }
    }
  }, [input])

  return (
    <ToolPage
      title="URL Parser"
      description="Parse a URL into its component parts (protocol, hostname, path, query, hash)."
      metaTitle="URL Parser — parse URL components free, in-browser"
      metaDescription="Parse any URL into its component parts including protocol, hostname, port, path, query string, and hash. All processing client-side."
      explainTitle="What is a URL?"
      explain={
        <>
          <p>
            A URL (Uniform Resource Locator) is the address of a resource on the internet.
            It consists of several parts that identify where the resource is located and how
            to access it. This tool breaks down a URL into its individual components so you
            can understand its structure.
          </p>
          <p>
            Standard URL components include: <strong>protocol</strong> (http/https), <strong>hostname</strong> (domain name),
            <strong>port</strong> (default 80 or 443), <strong>pathname</strong> (the resource path),
            <strong>search</strong> (query parameters), and <strong>hash</strong> (fragment identifier).
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink-strong">URL</label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Enter a URL to parse (e.g. https://www.example.com:8080/path?name=value#section)"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-strong">Parsed Components</label>
          <TextArea
            value={result ?? ''}
            readOnly
            rows={6}
            placeholder="Parsed URL components will appear here..."
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <Button
          onClick={() => setInput('https://www.example.com:8080/path/to/page?name=value#section')}
        >
          Use example
        </Button>
      </div>
    </ToolPage>
  )
}