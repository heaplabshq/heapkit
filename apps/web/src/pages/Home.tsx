import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { tools } from '../tools/registry'
import {
  ArrowRightIcon,
  BinaryIcon,
  BracesIcon,
  CalculatorIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  ConvertIcon,
  DiceIcon,
  DiffIcon,
  FileTextIcon,
  HashIcon,
  KeyIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from '../components/icons'

const slugToIcon: Record<string, ComponentType<{ className?: string }>> = {
  'json-formatter': BracesIcon,
  'json-validator': CheckCircleIcon,
  'json-diff': DiffIcon,
  'yaml-validator': FileTextIcon,
  'yaml-to-json': ConvertIcon,
  'uuid-generator': DiceIcon,
  'base64': BinaryIcon,
  'hash-generator': HashIcon,
  'jwt-decoder': KeyIcon,
  'cron-builder': ClockIcon,
  'emi-calculator': CalculatorIcon,
  'mutual-fund-calculator': TrendingUpIcon,
  'timestamp-converter': ConvertIcon,
  'regex-tester': DiceIcon,
  'url-encoder-decoder': BinaryIcon,
  'url-parser': KeyIcon,
  'xml-formatter': FileTextIcon,
  'css-formatter': BracesIcon,
  'javascript-formatter': BracesIcon,
  'sql-formatter': KeyIcon,
}

export function Home() {
  useDocumentMeta(
    'heapkit — free developer tools',
    'Free, fast, browser-only developer tools. No login, no ads getting in the way, and nothing you paste is ever sent to a server.',
  )

  return (
    <div className="flex flex-col items-center gap-12">
      <section className="flex flex-col items-center gap-5 pt-10 text-center sm:pt-16">
        <div className="flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
          <ShieldCheckIcon className="h-3.5 w-3.5" />
          Nothing you paste is ever sent to a server
        </div>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink-strong sm:text-5xl">
          Tools that{' '}
          <span className="bg-gradient-to-r from-accent to-accent-strong bg-clip-text text-transparent">
            just work
          </span>
        </h1>

        <p className="max-w-xl text-lg text-ink">
          Fast, free utilities for JSON, YAML, UUIDs, Base64, hashes, JWTs, and cron —
          running entirely in your browser.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink">
          {['100% in your browser', 'No sign-up, no limits', 'Free forever'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 text-success" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => {
          const Icon = slugToIcon[tool.slug] || DiceIcon
          return (
            <Link
              key={tool.slug}
              to={tool.slug}
              className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-accent-border hover:shadow-lift"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="flex items-center gap-1 text-[15px] font-semibold text-ink-strong">
                  {tool.name}
                  <ArrowRightIcon className="h-3.5 w-3.5 text-ink/50 transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </h2>
                <p className="mt-1 text-sm text-ink">{tool.description}</p>
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
}

