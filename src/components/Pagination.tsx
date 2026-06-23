import { useTranslation } from 'react-i18next'
import { Button } from './ui/Button'

/**
 * Presentational pager. Stateless — parent owns page state and passes handlers.
 * Uses logical spacing (gap) so it mirrors correctly under RTL automatically.
 */
interface PaginationProps {
  page: number
  totalPages: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function Pagination({
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: PaginationProps) {
  const { t } = useTranslation()
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-4 py-8" aria-label="Pagination">
      <Button variant="secondary" size="sm" onClick={onPrev} disabled={!canPrev}>
        {t('plp.previous')}
      </Button>
      <span className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
        {t('plp.page', { current: page, total: totalPages })}
      </span>
      <Button variant="secondary" size="sm" onClick={onNext} disabled={!canNext}>
        {t('plp.next')}
      </Button>
    </nav>
  )
}
