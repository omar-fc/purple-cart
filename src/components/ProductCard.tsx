import { Link } from 'react-router-dom'
import type { Product } from '@/schemas'
import { useCurrency, useLocalizedText } from '@/hooks/useLocale'
import { StockBadge } from './StockBadge'

/**
 * Presentational product card. Takes a Product and renders it; the only logic
 * is locale-aware formatting (pure derivations of the active locale), no data
 * fetching or mutation. Links to the PDP.
 */
export function ProductCard({ product }: { product: Product }) {
  const tx = useLocalizedText()
  const formatPrice = useCurrency()

  return (
    <Link
      to={`/product/${product.id}`}
      className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface-light shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-surface-dark-alt"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface-light-alt dark:bg-surface-dark">
        <img
          src={product.imageUrl}
          alt={tx(product.title)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-content-light-primary dark:text-content-dark-primary">
            {tx(product.title)}
          </h3>
          <StockBadge stock={product.stockQuantity} />
        </div>
        <p className="line-clamp-2 text-sm text-content-light-secondary dark:text-content-dark-secondary">
          {tx(product.description)}
        </p>
        {/* mt-auto pins price to the bottom regardless of description length */}
        <p className="mt-auto pt-2 text-lg font-bold text-brand dark:text-brand-dark">
          {formatPrice(product.basePrice)}
        </p>
      </div>
    </Link>
  )
}
