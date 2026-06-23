import { useTranslation } from 'react-i18next'
import { useCategories, useProducts, useSubCategories } from '@/hooks/useCatalog'
import { AsyncBoundary } from '@/components/ui/AsyncBoundary'

/** Admin overview with simple catalog stat cards. */
export function AdminDashboard() {
  const { t } = useTranslation()
  const products = useProducts()
  const categories = useCategories()
  const subCategories = useSubCategories()

  const loading = products.loading || categories.loading || subCategories.loading
  const error = products.error ?? categories.error ?? subCategories.error

  const stats = [
    { key: 'products', value: products.data?.length ?? 0 },
    { key: 'categories', value: categories.data?.length ?? 0 },
    { key: 'subCategories', value: subCategories.data?.length ?? 0 },
    {
      key: 'outOfStock',
      value: products.data?.filter((p) => p.stockQuantity <= 0).length ?? 0,
    },
  ] as const

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('admin.dashboard')}</h1>
      <AsyncBoundary loading={loading} error={error}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-2xl bg-surface-light p-6 shadow-sm dark:bg-surface-dark-alt"
            >
              <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
                {t(`admin.stats.${stat.key}`)}
              </p>
              <p className="mt-1 text-3xl font-extrabold text-brand dark:text-brand-dark">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  )
}
