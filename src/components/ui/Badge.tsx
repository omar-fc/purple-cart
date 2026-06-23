import type { ReactNode } from 'react'

/** Small status pill. `tone` maps to the semantic color system. */
type Tone = 'success' | 'danger' | 'neutral' | 'brand'

const TONES: Record<Tone, string> = {
  success:
    'bg-status-success/15 text-emerald-700 dark:bg-status-success/20 dark:text-emerald-300',
  danger: 'bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  neutral:
    'bg-surface-light-alt text-content-light-secondary ' +
    'dark:bg-surface-dark-alt dark:text-content-dark-secondary',
  brand: 'bg-brand/15 text-brand dark:bg-brand-dark/20 dark:text-brand-dark',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      // `whitespace-nowrap` keeps multi-word labels (e.g. "In Stock") on one
      // line; `shrink-0` stops the pill from being squeezed by a long sibling
      // title in flex rows (which was forcing it to wrap and grow vertically).
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
