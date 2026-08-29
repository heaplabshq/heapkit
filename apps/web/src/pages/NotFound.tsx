import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { Button } from '../components/ui/Button'
import { BracesIcon } from '../components/icons'

export function NotFound() {
  useDocumentMeta('Page not found | heapkit', 'This page does not exist on heapkit.')

  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-subtle text-accent">
        <BracesIcon className="h-7 w-7" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-strong">Page not found</h1>
        <p className="max-w-md text-[15px] text-ink">
          The page you're looking for doesn't exist — it may have moved, or the URL might be
          mistyped.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary">Back to all tools</Button>
        </Link>
        <Link to="/json-formatter">
          <Button variant="secondary">JSON Formatter</Button>
        </Link>
      </div>
    </div>
  )
}