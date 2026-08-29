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
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-strong">{title}</h1>
        <p className="max-w-2xl text-[15px] text-ink">{description}</p>
      </header>

      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-6">
        {children}
      </div>

      <article className="article-body flex max-w-3xl flex-col gap-3 border-t border-border pt-8 text-left text-[15px] text-ink">
        <h2 className="text-base font-semibold text-ink-strong">{explainTitle}</h2>
        {explain}
      </article>

      <AdSlot slot="tool-page-bottom" />
    </div>
  )
}