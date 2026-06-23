import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Presentational button. Variants encode the brand color system; all states are
 * dark-mode aware. Purely props-driven — no store/data access.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand/90 dark:bg-brand-dark dark:hover:bg-brand-dark/90',
  secondary:
    'bg-surface-light-alt text-content-light-primary hover:bg-gray-200 ' +
    'dark:bg-surface-dark-alt dark:text-content-dark-primary dark:hover:bg-slate-700',
  ghost:
    'bg-transparent text-content-light-secondary hover:bg-surface-light-alt ' +
    'dark:text-content-dark-secondary dark:hover:bg-surface-dark-alt',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const SIZES: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center rounded-lg font-medium
        transition-colors disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
