import { useState } from 'react'
import { copyToClipboard } from '../lib/clipboard'
import { CheckIcon, CopyIcon } from './icons'
import { Button } from './ui/Button'

export function CopyButton({ text, disabled }: { text: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={disabled || !text}>
      {copied ? <CheckIcon className="h-3.5 w-3.5 text-success" /> : <CopyIcon className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}