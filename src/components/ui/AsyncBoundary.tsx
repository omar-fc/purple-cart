import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

/**
 * Presentational loading/error/empty state wrapper. Containers pass the async
 * flags down; this renders the right state and only shows children once data is
 * ready. Keeps every page's boilerplate identical and localized.
 */

interface AsyncBoundaryProps {
  loading: boolean
  error: Error | null
  isEmpty?: boolean
  onRetry?: () => void
  children: ReactNode
}

export function Spinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand dark:border-brand-dark/30 dark:border-t-brand-dark"
    />
  )
}

export function AsyncBoundary({
  loading,
  error,
  isEmpty,
  onRetry,
  children,
}: AsyncBoundaryProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-content-light-secondary dark:text-content-dark-secondary">
        <Spinner />
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-content-light-secondary dark:text-content-dark-secondary">
          {t('common.error')}
        </p>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {t('common.retry')}
          </Button>
        )}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <p className="py-20 text-center text-content-light-secondary dark:text-content-dark-secondary">
        {t('common.empty')}
      </p>
    )
  }

  return <>{children}</>
}
