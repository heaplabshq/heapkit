import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-contrast shadow-xs hover:bg-accent-strong active:translate-y-px',
  secondary:
    'border border-border bg-surface text-ink-strong shadow-xs hover:border-border-strong hover:bg-surface-muted active:translate-y-px',
  ghost: 'text-ink hover:bg-surface-muted hover:text-ink-strong',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ variant = 'secondary', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}