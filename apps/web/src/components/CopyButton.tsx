import { useState } from 'react'
import { copyToClipboard } from '../lib/clipboard'
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
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  )
}
