import type { ReactNode } from 'react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { AdSlot } from './ui/AdSlot'

export function ToolPage({
  title,
  description,
  metaTitle,
  metaDescription,
  children,
  explainTitle,
  explain,
}: {
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  children: ReactNode
  explainTitle: string
  explain: ReactNode
}) {
  useDocumentMeta(metaTitle, metaDescription)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-ink-strong">{title}</h1>
        <p className="mt-1 text-sm text-ink">{description}</p>
      </div>

      {children}

      <article className="flex flex-col gap-2 border-t border-border pt-8 text-left text-sm text-ink">
        <h2 className="text-base font-medium text-ink-strong">{explainTitle}</h2>
        {explain}
      </article>

      <AdSlot slot="tool-page-bottom" />
    </div>
  )
}
