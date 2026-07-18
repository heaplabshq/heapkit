import { useMemo, useState } from 'react'
import { ToolPage } from '../components/ToolPage'
import { CopyButton } from '../components/CopyButton'
import { TextArea } from '../components/ui/TextArea'
import { decodeJwt, describeExpiry } from '../lib/jwt'

export function JwtDecoder() {
  const [token, setToken] = useState('')

  const decoded = useMemo(() => (token.trim() ? decodeJwt(token) : null), [token])
  const expiry = decoded && decoded.valid ? describeExpiry(decoded.claims) : null

  return (
    <ToolPage
      title="JWT Decoder"
      description="Decode a JSON Web Token's header and payload locally in your browser."
      metaTitle="JWT Decoder — free, in-browser | heapkit"
      metaDescription="Decode a JWT's header and payload instantly, with expiry status. Runs entirely in your browser — your token is never sent anywhere."
      explainTitle="What this does (and doesn't do)"
      explain={
        <>
          <p>
            A JWT is three Base64URL-encoded segments — <code>header.payload.signature</code> —
            where the header and payload are JSON and the signature proves the token wasn't
            tampered with, if you hold the matching secret or public key.
          </p>
          <p>
            This tool only <strong>decodes</strong> the header and payload; it does not verify
            the signature, since that requires the issuer's secret or public key, which you
            should never paste into a third-party website. Treat the decoded contents as
            unverified until your backend checks the signature.
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink-strong">JWT</label>
        <TextArea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
          error={decoded !== null && !decoded.valid}
        />
      </div>

      {decoded && !decoded.valid && <p className="text-sm text-danger">{decoded.error}</p>}

      {decoded && decoded.valid && (
        <>
          {expiry && (
            <p className={`text-sm font-medium ${expiry.expired ? 'text-danger' : 'text-success'}`}>
              {expiry.text}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-ink-strong">Header</label>
                <CopyButton text={decoded.header.text} />
              </div>
              <TextArea
                value={decoded.header.error ?? decoded.header.text}
                readOnly
                rows={8}
                error={Boolean(decoded.header.error)}
                className="bg-surface"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-ink-strong">Payload</label>
                <CopyButton text={decoded.payload.text} />
              </div>
              <TextArea
                value={decoded.payload.error ?? decoded.payload.text}
                readOnly
                rows={8}
                error={Boolean(decoded.payload.error)}
                className="bg-surface"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-ink-strong">Signature (raw, unverified)</label>
              <CopyButton text={decoded.signature} />
            </div>
            <div className="truncate rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-ink">
              {decoded.signature}
            </div>
          </div>
        </>
      )}
    </ToolPage>
  )
}
