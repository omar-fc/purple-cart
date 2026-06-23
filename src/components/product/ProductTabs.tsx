import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Product } from '@/schemas'
import { useLocalizedText } from '@/hooks/useLocale'

/**
 * Presentational tabbed panel for Description / Specifications / Reviews.
 * Owns only local UI state (the active tab); all content comes from props.
 */
type TabKey = 'description' | 'specs' | 'reviews'
const TABS: TabKey[] = ['description', 'specs', 'reviews']

export function ProductTabs({ product }: { product: Product }) {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const [active, setActive] = useState<TabKey>('description')

  return (
    <div className="mt-12">
      {/* Tab strip — gap keeps it RTL-safe */}
      <div
        role="tablist"
        className="flex gap-1 border-b border-black/10 dark:border-white/10"
      >
        {TABS.map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className={`focus-ring -mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active === key
                ? 'border-brand text-brand dark:border-brand-dark dark:text-brand-dark'
                : 'border-transparent text-content-light-secondary hover:text-content-light-primary dark:text-content-dark-secondary dark:hover:text-content-dark-primary'
            }`}
          >
            {t(`pdp.tabs.${key}`)}
          </button>
        ))}
      </div>

      <div className="py-6 text-content-light-secondary dark:text-content-dark-secondary" role="tabpanel">
        {active === 'description' && <p className="leading-relaxed">{tx(product.description)}</p>}

        {active === 'specs' && (
          <dl className="divide-y divide-black/5 dark:divide-white/5">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 py-3">
                <dt className="font-medium text-content-light-primary dark:text-content-dark-primary">
                  {key}
                </dt>
                <dd className="text-end">{tx(value)}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === 'reviews' && <p className="italic">{t('pdp.noReviews')}</p>}
      </div>
    </div>
  )
}
