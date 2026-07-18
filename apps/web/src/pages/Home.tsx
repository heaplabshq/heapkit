import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'

const tools = [
  {
    href: '/json-formatter',
    name: 'JSON Formatter',
    description: 'Beautify, minify, and sort keys in JSON.',
  },
  {
    href: '/json-validator',
    name: 'JSON Validator',
    description: 'Check whether text is valid JSON and see the exact parser error.',
  },
  {
    href: '/json-diff',
    name: 'JSON Diff',
    description: 'Compare two JSON documents line by line.',
  },
  {
    href: '/yaml-validator',
    name: 'YAML Validator',
    description: 'Check whether text is valid YAML and see the exact parser error.',
  },
  {
    href: '/yaml-to-json',
    name: 'YAML to JSON',
    description: 'Convert YAML to formatted JSON.',
  },
  {
    href: '/uuid-generator',
    name: 'UUID Generator',
    description: 'Generate RFC 4122 v4 UUIDs, in bulk, with formatting options.',
  },
  {
    href: '/base64',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode or decode text to Base64, including the URL-safe variant.',
  },
  {
    href: '/hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes.',
  },
  {
    href: '/jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode a JWT header and payload, with expiry status.',
  },
  {
    href: '/cron-builder',
    name: 'Cron Builder',
    description: 'Build a cron expression visually, with next run times.',
  },
]

export function Home() {
  useDocumentMeta(
    'heapkit — free developer tools',
    'Free, fast, browser-only developer tools. No login, no ads getting in the way, and nothing you paste is ever sent to a server.',
  )

  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-ink-strong">heapkit</h1>
        <p className="mt-3 text-ink">
          Free, fast, browser-only developer tools. Nothing you paste is ever sent to a server.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            to={tool.href}
            className="rounded-lg border border-border p-5 text-left transition hover:border-accent-border hover:bg-accent-subtle"
          >
            <h2 className="text-base font-medium text-ink-strong">{tool.name}</h2>
            <p className="mt-1 text-sm text-ink">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
