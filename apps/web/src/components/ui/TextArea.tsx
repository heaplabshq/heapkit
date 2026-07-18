import type { TextareaHTMLAttributes } from 'react'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }

export function TextArea({ className = '', error = false, ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full rounded-md border bg-transparent p-3 font-mono text-sm text-ink-strong placeholder:text-ink ${
        error ? 'border-danger text-danger' : 'border-border'
      } ${className}`}
      {...props}
    />
  )
}
