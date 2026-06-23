import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Product, ProductComponent, ProductInput, SubCategory } from '@/schemas'
import { useLocalizedText } from '@/hooks/useLocale'
import { Button } from '@/components/ui/Button'
import { PlusIcon, TrashIcon } from '@/components/icons'

/**
 * Dynamic product form — handles BOTH create and edit.
 *
 * Owns its own draft state, including an arbitrarily nested list of
 * customizable components → options, plus a key/value specs list. On submit it
 * assembles a ProductInput and hands it to `onSubmit`; the parent container
 * runs the (Zod-validated) create/update API call.
 *
 * Pass `initialProduct` to edit an existing product — the draft is seeded from
 * it. Omit it to create a new product. `key`-ing this component by product id
 * in the parent guarantees the draft resets when you switch which product you
 * are editing.
 */

interface ProductFormProps {
  subCategories: SubCategory[]
  onSubmit: (input: ProductInput) => Promise<void> | void
  /** When present, the form is in EDIT mode and pre-filled from this product. */
  initialProduct?: Product
  onCancel?: () => void
}

/* ---- Local draft shapes (client-side keys only, stripped at submit) ---- */
interface DraftOption {
  key: string
  en: string
  ar: string
  priceModifier: number
  isDefault: boolean
}
interface DraftComponent {
  key: string
  en: string
  ar: string
  options: DraftOption[]
}
interface DraftSpec {
  key: string
  label: string
  en: string
  ar: string
}

let counter = 0
const nextKey = () => `k${counter++}`

/** Seed draft components from an existing product (edit mode). */
function toDraftComponents(product?: Product): DraftComponent[] {
  if (!product) return []
  return product.customizableComponents.map((c) => ({
    key: nextKey(),
    en: c.name.en,
    ar: c.name.ar,
    options: c.options.map((o) => ({
      key: nextKey(),
      en: o.name.en,
      ar: o.name.ar,
      priceModifier: o.priceModifier,
      isDefault: o.isDefault,
    })),
  }))
}

/** Seed draft specs from an existing product (edit mode). */
function toDraftSpecs(product?: Product): DraftSpec[] {
  if (!product) return []
  return Object.entries(product.specs).map(([label, value]) => ({
    key: nextKey(),
    label,
    en: value.en,
    ar: value.ar,
  }))
}

const field =
  'focus-ring w-full rounded-lg border border-black/10 bg-surface-light-alt px-3 py-2 text-sm dark:border-white/10 dark:bg-surface-dark'

export function ProductForm({
  subCategories,
  onSubmit,
  initialProduct,
  onCancel,
}: ProductFormProps) {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const isEdit = Boolean(initialProduct)

  // Lazy initializers seed every field from `initialProduct` when editing.
  const [titleEn, setTitleEn] = useState(() => initialProduct?.title.en ?? '')
  const [titleAr, setTitleAr] = useState(() => initialProduct?.title.ar ?? '')
  const [descEn, setDescEn] = useState(() => initialProduct?.description.en ?? '')
  const [descAr, setDescAr] = useState(() => initialProduct?.description.ar ?? '')
  const [basePrice, setBasePrice] = useState(() => initialProduct?.basePrice ?? 0)
  const [stock, setStock] = useState(() => initialProduct?.stockQuantity ?? 0)
  const [imageUrl, setImageUrl] = useState(
    () =>
      initialProduct?.imageUrl ??
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  )
  const [subCategoryId, setSubCategoryId] = useState(
    () => initialProduct?.subCategoryId ?? '',
  )
  const [components, setComponents] = useState<DraftComponent[]>(() =>
    toDraftComponents(initialProduct),
  )
  const [specs, setSpecs] = useState<DraftSpec[]>(() => toDraftSpecs(initialProduct))
  const [submitting, setSubmitting] = useState(false)

  /* ----- dynamic component/option mutators ----- */

  const addComponent = () =>
    setComponents((prev) => [...prev, { key: nextKey(), en: '', ar: '', options: [] }])

  const removeComponent = (key: string) =>
    setComponents((prev) => prev.filter((c) => c.key !== key))

  const updateComponent = (key: string, patch: Partial<DraftComponent>) =>
    setComponents((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)))

  const addOption = (compKey: string) =>
    updateComponentOptions(compKey, (opts) => [
      ...opts,
      { key: nextKey(), en: '', ar: '', priceModifier: 0, isDefault: opts.length === 0 },
    ])

  const removeOption = (compKey: string, optKey: string) =>
    updateComponentOptions(compKey, (opts) => opts.filter((o) => o.key !== optKey))

  const updateOption = (compKey: string, optKey: string, patch: Partial<DraftOption>) =>
    updateComponentOptions(compKey, (opts) =>
      opts.map((o) => (o.key === optKey ? { ...o, ...patch } : o)),
    )

  function updateComponentOptions(
    compKey: string,
    fn: (opts: DraftOption[]) => DraftOption[],
  ) {
    setComponents((prev) =>
      prev.map((c) => (c.key === compKey ? { ...c, options: fn(c.options) } : c)),
    )
  }

  /* ----- dynamic spec mutators ----- */

  const addSpec = () =>
    setSpecs((prev) => [...prev, { key: nextKey(), label: '', en: '', ar: '' }])
  const removeSpec = (key: string) =>
    setSpecs((prev) => prev.filter((s) => s.key !== key))
  const updateSpec = (key: string, patch: Partial<DraftSpec>) =>
    setSpecs((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)))

  /* ----- submit ----- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Map the local draft into the schema-shaped ProductInput.
      const mappedComponents: ProductComponent[] = components.map((c) => ({
        id: c.key,
        name: { en: c.en, ar: c.ar },
        options: c.options.map((o) => ({
          id: o.key,
          name: { en: o.en, ar: o.ar },
          priceModifier: o.priceModifier,
          isDefault: o.isDefault,
        })),
      }))

      // Collapse the specs list back into the record the schema expects.
      const mappedSpecs = Object.fromEntries(
        specs
          .filter((s) => s.label.trim())
          .map((s) => [s.label.trim(), { en: s.en, ar: s.ar }]),
      )

      const input: ProductInput = {
        subCategoryId,
        title: { en: titleEn, ar: titleAr },
        description: { en: descEn, ar: descAr },
        basePrice,
        stockQuantity: stock,
        imageUrl,
        specs: mappedSpecs,
        customizableComponents: mappedComponents,
      }

      await onSubmit(input)

      // Only reset in create mode; edit mode is dismissed by the parent.
      if (!isEdit) {
        setTitleEn(''); setTitleAr(''); setDescEn(''); setDescAr('')
        setBasePrice(0); setStock(0); setSubCategoryId('')
        setComponents([]); setSpecs([])
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-surface-light p-6 shadow-sm dark:bg-surface-dark-alt"
    >
      <h2 className="font-semibold">
        {isEdit ? t('admin.products.editProduct') : t('admin.products.newProduct')}
      </h2>

      {/* Core fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.titleEn')}</span>
          <input className={field} required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.titleAr')}</span>
          <input className={field} required dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.descEn')}</span>
          <textarea className={field} required value={descEn} onChange={(e) => setDescEn(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.descAr')}</span>
          <textarea className={field} required dir="rtl" value={descAr} onChange={(e) => setDescAr(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.basePrice')}</span>
          <input type="number" min={0} step="0.01" className={field} required value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.stock')}</span>
          <input type="number" min={0} className={field} required value={stock} onChange={(e) => setStock(Number(e.target.value))} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.subCategory')}</span>
          <select className={field} required value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
            <option value="" disabled>—</option>
            {subCategories.map((s) => (
              <option key={s.id} value={s.id}>{tx(s.name)}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>{t('admin.products.imageUrl')}</span>
          <input type="url" className={field} required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </label>
      </div>

      {/* Specifications (key/value, both locales) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t('pdp.tabs.specs')}</h3>
          <Button type="button" variant="secondary" size="sm" onClick={addSpec}>
            <PlusIcon width="1em" height="1em" /> {t('common.add')}
          </Button>
        </div>
        {specs.map((spec) => (
          <div key={spec.key} className="flex flex-wrap items-end gap-2">
            <label className="space-y-1 text-xs">
              <span>{t('admin.products.specLabel')}</span>
              <input className={field} value={spec.label} onChange={(e) => updateSpec(spec.key, { label: e.target.value })} />
            </label>
            <label className="space-y-1 text-xs">
              <span>{t('admin.products.specValue')} (EN)</span>
              <input className={field} value={spec.en} onChange={(e) => updateSpec(spec.key, { en: e.target.value })} />
            </label>
            <label className="space-y-1 text-xs">
              <span>{t('admin.products.specValue')} (AR)</span>
              <input className={field} dir="rtl" value={spec.ar} onChange={(e) => updateSpec(spec.key, { ar: e.target.value })} />
            </label>
            <button type="button" onClick={() => removeSpec(spec.key)} aria-label={t('common.delete')} className="focus-ring rounded-lg p-2 pb-2 text-content-light-secondary hover:text-red-600 dark:text-content-dark-secondary">
              <TrashIcon width="1em" height="1em" />
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic customizable components */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t('admin.products.components')}</h3>
          <Button type="button" variant="secondary" size="sm" onClick={addComponent}>
            <PlusIcon width="1em" height="1em" /> {t('admin.products.addComponent')}
          </Button>
        </div>

        {components.map((comp) => (
          <div
            key={comp.key}
            className="space-y-3 rounded-xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="flex items-end gap-3">
              <label className="flex-1 space-y-1 text-sm">
                <span>{t('admin.products.componentName')} (EN)</span>
                <input className={field} required value={comp.en} onChange={(e) => updateComponent(comp.key, { en: e.target.value })} />
              </label>
              <label className="flex-1 space-y-1 text-sm">
                <span>{t('admin.products.componentName')} (AR)</span>
                <input className={field} required dir="rtl" value={comp.ar} onChange={(e) => updateComponent(comp.key, { ar: e.target.value })} />
              </label>
              <button type="button" onClick={() => removeComponent(comp.key)} aria-label={t('common.delete')} className="focus-ring rounded-lg p-2 text-content-light-secondary hover:text-red-600 dark:text-content-dark-secondary">
                <TrashIcon />
              </button>
            </div>

            {/* Options for this component */}
            <div className="space-y-2 ps-2">
              {comp.options.map((opt) => (
                <div key={opt.key} className="flex flex-wrap items-end gap-2">
                  <label className="space-y-1 text-xs">
                    <span>{t('admin.products.optionName')} (EN)</span>
                    <input className={field} required value={opt.en} onChange={(e) => updateOption(comp.key, opt.key, { en: e.target.value })} />
                  </label>
                  <label className="space-y-1 text-xs">
                    <span>{t('admin.products.optionName')} (AR)</span>
                    <input className={field} required dir="rtl" value={opt.ar} onChange={(e) => updateOption(comp.key, opt.key, { ar: e.target.value })} />
                  </label>
                  <label className="space-y-1 text-xs">
                    <span>{t('admin.products.priceModifier')}</span>
                    <input type="number" step="0.01" className={`${field} w-24`} value={opt.priceModifier} onChange={(e) => updateOption(comp.key, opt.key, { priceModifier: Number(e.target.value) })} />
                  </label>
                  <label className="flex items-center gap-1.5 pb-2 text-xs">
                    <input
                      type="radio"
                      name={`default-${comp.key}`}
                      checked={opt.isDefault}
                      onChange={() =>
                        // Exactly one default per component.
                        updateComponentOptions(comp.key, (opts) =>
                          opts.map((o) => ({ ...o, isDefault: o.key === opt.key })),
                        )
                      }
                    />
                    {t('admin.products.default')}
                  </label>
                  <button type="button" onClick={() => removeOption(comp.key, opt.key)} aria-label={t('common.delete')} className="focus-ring rounded-lg p-2 pb-2 text-content-light-secondary hover:text-red-600 dark:text-content-dark-secondary">
                    <TrashIcon width="1em" height="1em" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={() => addOption(comp.key)}>
                <PlusIcon width="1em" height="1em" /> {t('admin.products.addOption')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {isEdit ? t('common.save') : t('admin.products.addProduct')}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}
