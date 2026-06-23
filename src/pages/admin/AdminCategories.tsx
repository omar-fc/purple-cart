import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  updateCategory,
  updateSubCategory,
} from '@/api/categories'
import { useCategories, useSubCategories } from '@/hooks/useCatalog'
import { useLocalizedText } from '@/hooks/useLocale'
import { AsyncBoundary } from '@/components/ui/AsyncBoundary'
import { Button } from '@/components/ui/Button'
import { EditIcon, TrashIcon } from '@/components/icons'
import type { CategoryInput, SubCategoryInput } from '@/schemas'

/**
 * Categories management container.
 *
 * Full CRUD for Categories and Subcategories. Each form doubles as a create or
 * edit form: clicking the edit (pencil) button loads a row's values into the
 * form and flips it to "update" mode (tracked by `editingCatId` / `editingSubId`).
 * Every mutation goes through the Zod-validated API service, then refetches.
 */
export function AdminCategories() {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const categories = useCategories()
  const subCategories = useSubCategories()

  // Category form — `editingCatId` null means "create", otherwise "update".
  const [catForm, setCatForm] = useState({ en: '', ar: '', slug: '' })
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

  // Subcategory form — same create/update toggle via `editingSubId`.
  const [subForm, setSubForm] = useState({ en: '', ar: '', slug: '', categoryId: '' })
  const [editingSubId, setEditingSubId] = useState<string | null>(null)

  const refetchAll = () => {
    categories.refetch()
    subCategories.refetch()
  }

  /* ----- Category submit (create OR update) ----- */
  const onSubmitCategory = async (e: FormEvent) => {
    e.preventDefault()
    const payload: CategoryInput = {
      name: { en: catForm.en, ar: catForm.ar },
      slug: catForm.slug,
    }
    if (editingCatId) await updateCategory(editingCatId, payload)
    else await createCategory(payload)
    resetCatForm()
    refetchAll()
  }

  const resetCatForm = () => {
    setCatForm({ en: '', ar: '', slug: '' })
    setEditingCatId(null)
  }

  const startEditCategory = (id: string, en: string, ar: string, slug: string) => {
    setEditingCatId(id)
    setCatForm({ en, ar, slug })
  }

  /* ----- Subcategory submit (create OR update) ----- */
  const onSubmitSubCategory = async (e: FormEvent) => {
    e.preventDefault()
    const payload: SubCategoryInput = {
      categoryId: subForm.categoryId,
      name: { en: subForm.en, ar: subForm.ar },
      slug: subForm.slug,
    }
    if (editingSubId) await updateSubCategory(editingSubId, payload)
    else await createSubCategory(payload)
    resetSubForm()
    refetchAll()
  }

  const resetSubForm = () => {
    setSubForm({ en: '', ar: '', slug: '', categoryId: '' })
    setEditingSubId(null)
  }

  const onDeleteCategory = async (id: string) => {
    if (!window.confirm(t('admin.categories.confirmDelete'))) return
    await deleteCategory(id)
    if (editingCatId === id) resetCatForm()
    refetchAll()
  }

  const onDeleteSubCategory = async (id: string) => {
    await deleteSubCategory(id)
    if (editingSubId === id) resetSubForm()
    refetchAll()
  }

  const field =
    'focus-ring w-full rounded-lg border border-black/10 bg-surface-light-alt px-3 py-2 text-sm dark:border-white/10 dark:bg-surface-dark'

  const iconBtn =
    'focus-ring rounded-lg p-1 text-content-light-secondary dark:text-content-dark-secondary'

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">{t('admin.categories.title')}</h1>

      <AsyncBoundary
        loading={categories.loading || subCategories.loading}
        error={categories.error ?? subCategories.error}
        onRetry={refetchAll}
      >
        {/* Categories ------------------------------------------------- */}
        <section className="space-y-4">
          <h2 className="font-semibold">{t('admin.manageCategories')}</h2>

          <ul className="space-y-2">
            {categories.data?.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl bg-surface-light p-3 shadow-sm dark:bg-surface-dark-alt"
              >
                <span>
                  <span className="font-medium">{tx(c.name)}</span>
                  <span className="ms-2 text-xs text-content-light-secondary dark:text-content-dark-secondary">
                    /{c.slug}
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditCategory(c.id, c.name.en, c.name.ar, c.slug)}
                    aria-label={t('common.edit')}
                    className={`${iconBtn} hover:text-brand dark:hover:text-brand-dark`}
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(c.id)}
                    aria-label={t('common.delete')}
                    className={`${iconBtn} hover:text-red-600`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={onSubmitCategory}
            className="grid items-end gap-3 rounded-xl bg-surface-light p-4 shadow-sm sm:grid-cols-4 dark:bg-surface-dark-alt"
          >
            <label className="space-y-1 text-sm">
              <span>{t('admin.categories.nameEn')}</span>
              <input className={field} required value={catForm.en} onChange={(e) => setCatForm({ ...catForm, en: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('admin.categories.nameAr')}</span>
              <input className={field} required dir="rtl" value={catForm.ar} onChange={(e) => setCatForm({ ...catForm, ar: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('admin.categories.slug')}</span>
              <input className={field} required value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} />
            </label>
            <div className="flex gap-2">
              <Button type="submit">
                {editingCatId ? t('common.save') : t('admin.categories.addCategory')}
              </Button>
              {editingCatId && (
                <Button type="button" variant="secondary" onClick={resetCatForm}>
                  {t('common.cancel')}
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* Subcategories --------------------------------------------- */}
        <section className="space-y-4">
          <h2 className="font-semibold">{t('admin.categories.addSubCategory')}</h2>

          <ul className="space-y-2">
            {subCategories.data?.map((s) => {
              const parent = categories.data?.find((c) => c.id === s.categoryId)
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-surface-light p-3 shadow-sm dark:bg-surface-dark-alt"
                >
                  <span>
                    <span className="font-medium">{tx(s.name)}</span>
                    {parent && (
                      <span className="ms-2 text-xs text-content-light-secondary dark:text-content-dark-secondary">
                        ← {tx(parent.name)}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingSubId(s.id)
                        setSubForm({ en: s.name.en, ar: s.name.ar, slug: s.slug, categoryId: s.categoryId })
                      }}
                      aria-label={t('common.edit')}
                      className={`${iconBtn} hover:text-brand dark:hover:text-brand-dark`}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => onDeleteSubCategory(s.id)}
                      aria-label={t('common.delete')}
                      className={`${iconBtn} hover:text-red-600`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <form
            onSubmit={onSubmitSubCategory}
            className="grid items-end gap-3 rounded-xl bg-surface-light p-4 shadow-sm sm:grid-cols-5 dark:bg-surface-dark-alt"
          >
            <label className="space-y-1 text-sm">
              <span>{t('admin.categories.parentCategory')}</span>
              <select className={field} required value={subForm.categoryId} onChange={(e) => setSubForm({ ...subForm, categoryId: e.target.value })}>
                <option value="" disabled>—</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>{tx(c.name)}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('admin.categories.nameEn')}</span>
              <input className={field} required value={subForm.en} onChange={(e) => setSubForm({ ...subForm, en: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('admin.categories.nameAr')}</span>
              <input className={field} required dir="rtl" value={subForm.ar} onChange={(e) => setSubForm({ ...subForm, ar: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">
              <span>{t('admin.categories.slug')}</span>
              <input className={field} required value={subForm.slug} onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })} />
            </label>
            <div className="flex gap-2">
              <Button type="submit">
                {editingSubId ? t('common.save') : t('common.add')}
              </Button>
              {editingSubId && (
                <Button type="button" variant="secondary" onClick={resetSubForm}>
                  {t('common.cancel')}
                </Button>
              )}
            </div>
          </form>
        </section>
      </AsyncBoundary>
    </div>
  )
}
