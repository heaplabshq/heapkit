import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { TextArea } from '../components/ui/TextArea'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'

function encodeUriComponent(text: string, urlSafe: boolean): string {
  const encoded = encodeURIComponent(text)
  if (urlSafe) {
    return encoded.replace(/%20/g, '+').replace(/\+/g, '%20').replace(/%23/g, '#').replace(/%26/g, '&')
  }
  return encoded
}

function decodeUriComponent(text: string): string {
  return decodeURIComponent(text)
}

export function UrlEncoderDecoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [urlSafe, setUrlSafe] = useState<'standard' | 'url-safe'>('standard')
  const [input, setInput] = useState('')

  const { error, result } = useMemo(() => {
    if (!input) return { error: null, result: '' }

    try {
      if (mode === 'encode') {
        const r = encodeUriComponent(input, urlSafe === 'url-safe')
        return { error: null, result: r }
      } else {
        const r = decodeUriComponent(input)
        return { error: null, result: r }
      }
    } catch {
      return { error: 'Invalid input.', result: '' }
    }
  }, [input, mode, urlSafe])

  return (
    <ToolPage
      title="URL Encoder/Decoder"
      description="Encode and decode URL components, with URL-safe variant."
      metaTitle="URL Encoder/Decoder — encode and decode URL components free, in-browser"
      metaDescription="Encode and decode URL components, including the URL-safe variant. All processing client-side — nothing is sent to a server."
      explainTitle="What is URL encoding?"
      explain={
        <>
          <p>
            URL encoding (percent-encoding) encodes special characters in a URL so they can be
            safely transmitted over the internet. Characters like spaces, ampersands, and
            hash symbols are replaced with a percent sign followed by their hexadecimal code.
          </p>
          <p>
            The URL-safe variant replaces + and / with - and _ respectively, making the result
            safe to use directly in URL paths and filenames without additional escaping.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { value: 'encode', label: 'Encode' },
            { value: 'decode', label: 'Decode' },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink-strong">Input</label>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              placeholder={mode === 'encode' ? 'Text to encode…' : 'URL-encoded text to decode…'}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink-strong">Output</label>
            <TextArea
              value={result ?? ''}
              readOnly
              rows={4}
              placeholder="Encoded/decoded output will appear here..."
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Select
            value={urlSafe}
            onChange={(e) => setUrlSafe(e.target.value as 'standard' | 'url-safe')}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'url-safe', label: 'URL-safe' },
            ]}
          />
        </div>

        <Button
          onClick={() => setInput('https://example.com/path with spaces')}
          className="mt-2"
        >
          Use example
        </Button>
      </div>
    </ToolPage>
  )
}