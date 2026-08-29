import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { CopyButton } from '../components/CopyButton'
import { Checkbox } from '../components/ui/Checkbox'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { TextArea } from '../components/ui/TextArea'

function encodeBase64(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  let out = btoa(binary)
  if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return out
}

function decodeBase64(input: string): string {
  let normalized = input.trim().replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  if (padding) normalized += '='.repeat(4 - padding)
  const binary = atob(normalized)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [urlSafe, setUrlSafe] = useState(false)
  const [input, setInput] = useState('')

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null as string | null }
    try {
      const result = mode === 'encode' ? encodeBase64(input, urlSafe) : decodeBase64(input)
      return { output: result, error: null }
    } catch {
      return { output: '', error: 'Invalid Base64 input.' }
    }
  }, [input, mode, urlSafe])

  return (
    <ToolPage
      title="Base64 Encoder / Decoder"
      description="Encode or decode Base64 text locally in your browser."
      metaTitle="Base64 Encoder / Decoder — free, in-browser | heapkit"
      metaDescription="Encode or decode Base64 text instantly, including the URL-safe variant. Runs entirely in your browser — nothing is uploaded."
      explainTitle="What is Base64?"
      explain={
        <>
          <p>
            Base64 encodes arbitrary binary data as ASCII text, using 64 printable characters
            (A–Z, a–z, 0–9, + and /). It's used to safely embed binary data — images, files,
            credentials — inside text-based formats like JSON, HTML, or email, which can't
            reliably carry raw bytes.
          </p>
          <p>
            The <strong>URL-safe</strong> variant swaps <code>+</code> and <code>/</code> for{' '}
            <code>-</code> and <code>_</code> and drops padding, so the result can be used
            directly inside a URL or filename without escaping.
          </p>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { value: 'encode', label: 'Encode' },
            { value: 'decode', label: 'Decode' },
          ]}
        />

        <Checkbox
          label="URL-safe"
          checked={urlSafe}
          onChange={setUrlSafe}
          disabled={mode === 'decode'}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink-strong">
            {mode === 'encode' ? 'Text' : 'Base64'}
          </label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={mode === 'encode' ? 'Paste text to encode…' : 'Paste Base64 to decode…'}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink-strong">
              {mode === 'encode' ? 'Base64' : 'Text'}
            </label>
            <CopyButton text={output} />
          </div>
          <TextArea value={error ?? output} readOnly rows={8} error={Boolean(error)} className="bg-surface-muted" />
        </div>
      </div>
    </ToolPage>
  )
}
