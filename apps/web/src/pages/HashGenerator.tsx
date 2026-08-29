import { useEffect, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { CopyButton } from '../components/CopyButton'
import { TextArea } from '../components/ui/TextArea'
import { computeHash, HASH_ALGORITHMS } from '../lib/hash'

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    let cancelled = false
    if (!input) {
      setHashes({})
      return
    }
    Promise.all(
      HASH_ALGORITHMS.map((algorithm) =>
        computeHash(algorithm, input).then((hash) => [algorithm, hash] as const),
      ),
    ).then((results) => {
      if (!cancelled) setHashes(Object.fromEntries(results))
    })
    return () => {
      cancelled = true
    }
  }, [input])

  return (
    <ToolPage
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally in your browser."
      metaTitle="Hash Generator — MD5, SHA-1, SHA-256, SHA-512 | heapkit"
      metaDescription="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. Runs entirely in your browser — nothing is uploaded."
      explainTitle="Which hash should I use?"
      explain={
        <>
          <p>
            <strong>SHA-256</strong> (part of the SHA-2 family) is the standard choice today for
            checksums, signatures, and anything security-adjacent. <strong>MD5</strong> and{' '}
            <strong>SHA-1</strong> are both cryptographically broken — don't rely on them where
            collision resistance matters — but they're still common for legacy checksum
            verification (older package registries, existing file manifests) where you just need
            to match a known value, not resist a deliberate attack.
          </p>
          <p>
            SHA hashes are computed with the browser's native Web Crypto API; MD5 (which Web
            Crypto deliberately omits) uses a verified in-browser implementation. Either way,
            your input is never sent anywhere.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink-strong">Text</label>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder="Type or paste text…"
        />
      </div>

      <div className="flex flex-col gap-2">
        {HASH_ALGORITHMS.map((algorithm) => (
          <div
            key={algorithm}
            className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2"
          >
            <span className="w-20 shrink-0 text-sm font-medium text-ink-strong">{algorithm}</span>
            <span className="flex-1 truncate font-mono text-sm text-ink">{hashes[algorithm] ?? '—'}</span>
            <CopyButton text={hashes[algorithm] ?? ''} />
          </div>
        ))}
      </div>
    </ToolPage>
  )
}
