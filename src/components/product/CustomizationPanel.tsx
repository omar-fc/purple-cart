import { useTranslation } from 'react-i18next'
import type { Product } from '@/schemas'
import { useCurrency, useLocalizedText } from '@/hooks/useLocale'
import { CheckIcon } from '@/components/icons'

/**
 * Presentational customization UI. Renders each customizable component as a row
 * of selectable option cards. Stateless: the parent (PDP) owns the selection
 * map and price; this just reflects `selected` and reports clicks via `onSelect`.
 */
interface CustomizationPanelProps {
  product: Product
  selected: Record<string, string>
  onSelect: (componentId: string, optionId: string) => void
}

export function CustomizationPanel({
  product,
  selected,
  onSelect,
}: CustomizationPanelProps) {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const formatPrice = useCurrency()

  if (product.customizableComponents.length === 0) return null

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-content-light-secondary dark:text-content-dark-secondary">
        {t('pdp.customize')}
      </h2>

      {product.customizableComponents.map((component) => (
        <fieldset key={component.id} className="space-y-2">
          <legend className="mb-2 font-medium text-content-light-primary dark:text-content-dark-primary">
            {tx(component.name)}
          </legend>
          <div className="flex flex-wrap gap-2">
            {component.options.map((option) => {
              const isSelected = selected[component.id] === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(component.id, option.id)}
                  className={`focus-ring relative flex min-w-24 flex-col items-start gap-0.5 rounded-xl border px-4 py-2.5 text-start transition-all ${
                    isSelected
                      ? 'border-brand bg-brand/5 ring-1 ring-brand dark:border-brand-dark dark:bg-brand-dark/10 dark:ring-brand-dark'
                      : 'border-black/10 hover:border-brand/40 dark:border-white/10 dark:hover:border-brand-dark/40'
                  }`}
                >
                  {isSelected && (
                    // Logical end inset → top-right (LTR) / top-left (RTL)
                    <span className="absolute end-2 top-2 text-status-success">
                      <CheckIcon width="1em" height="1em" />
                    </span>
                  )}
                  <span className="font-medium text-content-light-primary dark:text-content-dark-primary">
                    {tx(option.name)}
                  </span>
                  {option.priceModifier !== 0 && (
                    <span className="text-xs text-content-light-secondary dark:text-content-dark-secondary">
                      {option.priceModifier > 0 ? '+' : ''}
                      {formatPrice(option.priceModifier)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
