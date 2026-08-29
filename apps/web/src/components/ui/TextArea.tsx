import type { TextareaHTMLAttributes } from 'react'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }

export function TextArea({ className = '', error = false, ...props }: TextAreaProps) {
  return (
    <textarea
      className={`min-h-24 w-full rounded-lg border bg-surface p-3 font-mono text-sm leading-relaxed text-ink-strong shadow-xs transition placeholder:text-ink/60 focus:border-accent-border focus:outline-none focus:ring-2 focus:ring-accent-subtle ${
        error ? 'border-danger focus:border-danger focus:ring-danger-subtle' : 'border-border'
      } ${className}`}
      {...props}
    />
  )
}