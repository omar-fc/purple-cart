import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useCategories,
  useProducts,
  useSubCategories,
} from '@/hooks/useCatalog'
import { useLocalizedText } from '@/hooks/useLocale'
import { usePagination } from '@/hooks/usePagination'
import { AsyncBoundary } from '@/components/ui/AsyncBoundary'
import { ProductCard } from '@/components/ProductCard'
import { Pagination } from '@/components/Pagination'

const PAGE_SIZE = 9

/**
 * Product Listing Page (container).
 *
 * Reads filters from the URL (`category`, `sub`, `q`), resolves them against the
 * catalog, applies frontend pagination, and renders presentational cards.
 * Keeping filters in the URL makes them shareable and back/forward friendly.
 */
export function ProductListingPage() {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const [params] = useSearchParams()

  const categorySlug = params.get('category')
  const subSlug = params.get('sub')
  const query = params.get('q')?.toLowerCase().trim() ?? ''

  const { data: categories } = useCategories()
  const { data: subCategories } = useSubCategories()
  const products = useProducts()

  // Resolve which subcategory ids are in scope for the active filters.
  const { scopedSubIds, heading } = useMemo(() => {
    const cat = categories?.find((c) => c.slug === categorySlug)
    const sub = subCategories?.find(
      (s) => s.slug === subSlug && (!cat || s.categoryId === cat.id),
    )

    if (sub) return { scopedSubIds: new Set([sub.id]), heading: tx(sub.name) }
    if (cat) {
      const ids = (subCategories ?? [])
        .filter((s) => s.categoryId === cat.id)
        .map((s) => s.id)
      return { scopedSubIds: new Set(ids), heading: tx(cat.name) }
    }
    return { scopedSubIds: null, heading: t('common.all') }
  }, [categories, subCategories, categorySlug, subSlug, tx, t])

  // Apply category scope + free-text search to the product list.
  const filtered = useMemo(() => {
    let list = products.data ?? []
    if (scopedSubIds) list = list.filter((p) => scopedSubIds.has(p.subCategoryId))
    if (query) {
      list = list.filter(
        (p) =>
          p.title.en.toLowerCase().includes(query) ||
          p.title.ar.includes(query) ||
          p.description.en.toLowerCase().includes(query),
      )
    }
    return list
  }, [products.data, scopedSubIds, query])

  const { page, totalPages, pageItems, next, prev, canPrev, canNext } =
    usePagination(filtered, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-bold">{query ? `“${params.get('q')}”` : heading}</h1>
        <span className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
          {t('plp.resultsCount', { count: filtered.length })}
        </span>
      </div>

      <AsyncBoundary
        loading={products.loading}
        error={products.error}
        onRetry={products.refetch}
        isEmpty={filtered.length === 0}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={prev}
          onNext={next}
        />
      </AsyncBoundary>
    </div>
  )
}
