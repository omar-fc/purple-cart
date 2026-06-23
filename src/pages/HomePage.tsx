import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCategories, useFeaturedProducts } from '@/hooks/useCatalog'
import { useLocalizedText } from '@/hooks/useLocale'
import { AsyncBoundary } from '@/components/ui/AsyncBoundary'
import { ProductCard } from '@/components/ProductCard'

/**
 * Home container. Composes three sections: hero, shop-by-category grid, and
 * featured products. Data comes from catalog hooks; rendering is delegated to
 * presentational pieces (ProductCard) where possible.
 */
export function HomePage() {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const categories = useCategories()
  const featured = useFeaturedProducts()

  return (
    <div>
      {/* Hero ----------------------------------------------------------- */}
      <section className="bg-gradient-to-br from-brand to-purple-900 text-white dark:from-brand-dark dark:to-slate-900">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-5">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="max-w-md text-lg text-white/80">{t('home.heroSubtitle')}</p>
            <Link
              to="/products"
              className="focus-ring inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-brand transition-transform hover:scale-[1.02] focus-visible:ring-offset-brand"
            >
              {t('home.heroCta')}
            </Link>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80"
              alt=""
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Shop by category ---------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">{t('home.shopByCategory')}</h2>
        <AsyncBoundary
          loading={categories.loading}
          error={categories.error}
          onRetry={categories.refetch}
          isEmpty={!categories.data?.length}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.data?.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="focus-ring group relative overflow-hidden rounded-2xl bg-brand/5 p-8 text-center transition-colors hover:bg-brand/10 dark:bg-surface-dark-alt dark:hover:bg-slate-700"
              >
                <span className="text-lg font-semibold text-content-light-primary dark:text-content-dark-primary">
                  {tx(category.name)}
                </span>
              </Link>
            ))}
          </div>
        </AsyncBoundary>
      </section>

      {/* Featured products --------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="mb-6 text-2xl font-bold">{t('home.featured')}</h2>
        <AsyncBoundary
          loading={featured.loading}
          error={featured.error}
          onRetry={featured.refetch}
          isEmpty={!featured.data?.length}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </AsyncBoundary>
      </section>
    </div>
  )
}
