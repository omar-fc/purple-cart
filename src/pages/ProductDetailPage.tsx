import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProduct } from '@/hooks/useCatalog'
import { useProductCustomization } from '@/hooks/useProductCustomization'
import { useCurrency, useLocalizedText } from '@/hooks/useLocale'
import { useCartStore } from '@/store/cartStore'
import { AsyncBoundary } from '@/components/ui/AsyncBoundary'
import { Button } from '@/components/ui/Button'
import { StockBadge } from '@/components/StockBadge'
import { CartIcon } from '@/components/icons'
import { CustomizationPanel } from '@/components/product/CustomizationPanel'
import { ProductTabs } from '@/components/product/ProductTabs'
import type { Product } from '@/schemas'

/**
 * PDP container. Fetches one product, then hands it to the customization engine
 * hook which owns all selection + pricing logic. This component only wires the
 * hook output to presentational pieces and the cart store.
 */
export function ProductDetailPage() {
  const { id = '' } = useParams()
  const { data, loading, error, refetch } = useProduct(id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AsyncBoundary loading={loading} error={error} onRetry={refetch} isEmpty={!data}>
        {data && <ProductDetail product={data} />}
      </AsyncBoundary>
    </div>
  )
}

/** Inner view rendered once the product is guaranteed non-null. */
function ProductDetail({ product }: { product: Product }) {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const formatPrice = useCurrency()
  const addItem = useCartStore((s) => s.addItem)

  const { selected, select, unitPrice, buildCartItem } =
    useProductCustomization(product)
  const [justAdded, setJustAdded] = useState(false)

  const outOfStock = product.stockQuantity <= 0

  const handleAddToCart = () => {
    addItem(buildCartItem(1))
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery -------------------------------------------------------- */}
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-2xl bg-surface-light-alt dark:bg-surface-dark-alt">
            <img
              src={product.imageUrl}
              alt={tx(product.title)}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Thumbnail strip (single-image catalog, shown for layout fidelity) */}
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square w-20 overflow-hidden rounded-lg border border-black/10 bg-surface-light-alt opacity-80 dark:border-white/10 dark:bg-surface-dark-alt"
              >
                <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Buy box ------------------------------------------------------- */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-content-light-primary dark:text-content-dark-primary">
                {tx(product.title)}
              </h1>
              <StockBadge stock={product.stockQuantity} />
            </div>
            <p className="text-content-light-secondary dark:text-content-dark-secondary">
              {tx(product.description)}
            </p>
          </div>

          <CustomizationPanel product={product} selected={selected} onSelect={select} />

          {/* Live total + add to cart */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-light p-4 shadow-sm dark:bg-surface-dark-alt">
            <div>
              <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
                {t('pdp.total')}
              </p>
              <p className="text-3xl font-extrabold text-brand dark:text-brand-dark">
                {formatPrice(unitPrice)}
              </p>
            </div>
            <Button size="lg" onClick={handleAddToCart} disabled={outOfStock}>
              <CartIcon />
              {outOfStock ? t('pdp.outOfStock') : t('pdp.addToCart')}
            </Button>
          </div>

          {/* Add-to-cart confirmation (polite live region) */}
          {justAdded && (
            <p
              role="status"
              className="rounded-lg bg-status-success/15 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300"
            >
              {t('pdp.addedToCart')}
            </p>
          )}
        </div>
      </div>

      <ProductTabs product={product} />
    </>
  )
}
