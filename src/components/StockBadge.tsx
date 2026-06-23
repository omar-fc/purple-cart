import { useTranslation } from 'react-i18next'
import { Badge } from './ui/Badge'

/**
 * Presentational stock indicator. Pure: derives its label/tone purely from the
 * `stock` prop. The low-stock threshold is a small presentation detail.
 */
const LOW_STOCK_THRESHOLD = 5

export function StockBadge({ stock }: { stock: number }) {
  const { t } = useTranslation()

  if (stock <= 0) return <Badge tone="danger">{t('pdp.outOfStock')}</Badge>
  if (stock <= LOW_STOCK_THRESHOLD)
    return <Badge tone="success">{t('pdp.lowStock', { count: stock })}</Badge>
  return <Badge tone="success">{t('pdp.inStock')}</Badge>
}
