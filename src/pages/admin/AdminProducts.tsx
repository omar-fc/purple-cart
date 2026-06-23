import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createProduct, deleteProduct, updateProduct } from '@/api/products'
import { useProducts, useSubCategories } from '@/hooks/useCatalog'
import { useCurrency, useLocalizedText } from '@/hooks/useLocale'
import { usePagination } from '@/hooks/usePagination'
import { AsyncBoundary } from '@/components/ui/AsyncBoundary'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/Pagination'
import { StockBadge } from '@/components/StockBadge'
import { EditIcon, TrashIcon } from '@/components/icons'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Product, ProductInput } from '@/schemas'

const PAGE_SIZE = 6

/**
 * Products management container: a paginated product list plus a dynamic
 * create/edit form. The form's mode is driven by `formState`:
 *   { mode: 'create' }            → blank form, calls createProduct
 *   { mode: 'edit', product }     → pre-filled form, calls updateProduct
 *   null                          → form hidden
 * Mutations call the Zod-validated API and refetch the list.
 */
type FormState = { mode: 'create' } | { mode: 'edit'; product: Product } | null

export function AdminProducts() {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const formatPrice = useCurrency()

  const products = useProducts()
  const subCategories = useSubCategories()
  const [formState, setFormState] = useState<FormState>(null)

  const list = products.data ?? []
  const { page, totalPages, pageItems, next, prev, canPrev, canNext } =
    usePagination(list, PAGE_SIZE)

  const handleSubmit = async (input: ProductInput) => {
    if (formState?.mode === 'edit') {
      await updateProduct(formState.product.id, input)
    } else {
      await createProduct(input)
    }
    setFormState(null)
    products.refetch()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.products.confirmDelete'))) return
    await deleteProduct(id)
    products.refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('admin.products.title')}</h1>
        <Button
          onClick={() =>
            setFormState((s) => (s?.mode === 'create' ? null : { mode: 'create' }))
          }
        >
          {formState?.mode === 'create'
            ? t('common.cancel')
            : t('admin.products.addProduct')}
        </Button>
      </div>

      {formState && (
        <ProductForm
          // Re-key per edited product so the draft resets cleanly when the
          // selected product (or create/edit mode) changes.
          key={formState.mode === 'edit' ? formState.product.id : 'create'}
          subCategories={subCategories.data ?? []}
          initialProduct={formState.mode === 'edit' ? formState.product : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormState(null)}
        />
      )}

      <AsyncBoundary
        loading={products.loading}
        error={products.error}
        onRetry={products.refetch}
        isEmpty={list.length === 0}
      >
        <div className="overflow-hidden rounded-2xl bg-surface-light shadow-sm dark:bg-surface-dark-alt">
          <table className="w-full text-sm">
            <thead className="border-b border-black/5 text-start text-content-light-secondary dark:border-white/5 dark:text-content-dark-secondary">
              <tr>
                <th className="p-4 text-start font-medium">{t('admin.products.titleEn')}</th>
                <th className="p-4 text-start font-medium">{t('admin.products.basePrice')}</th>
                <th className="p-4 text-start font-medium">{t('admin.products.stock')}</th>
                <th className="p-4 text-end font-medium">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {pageItems.map((p) => (
                <tr key={p.id}>
                  <td className="p-4 font-medium">{tx(p.title)}</td>
                  <td className="p-4">{formatPrice(p.basePrice)}</td>
                  <td className="p-4">
                    <StockBadge stock={p.stockQuantity} />
                  </td>
                  <td className="p-4">
                    {/* gap keeps the action buttons RTL-safe */}
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setFormState({ mode: 'edit', product: p })}
                        aria-label={t('common.edit')}
                        className="focus-ring rounded-lg p-1 text-content-light-secondary hover:text-brand dark:text-content-dark-secondary dark:hover:text-brand-dark"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        aria-label={t('common.delete')}
                        className="focus-ring rounded-lg p-1 text-content-light-secondary hover:text-red-600 dark:text-content-dark-secondary"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
