import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '@/store/cartStore'
import { useCurrency, useLocalizedText } from '@/hooks/useLocale'
import { Button } from '@/components/ui/Button'
import { TrashIcon } from '@/components/icons'

/**
 * Cart container. Connected to the cart store; renders line items with their
 * captured customization snapshot, quantity controls, and the running subtotal.
 */
export function CartPage() {
  const { t } = useTranslation()
  const tx = useLocalizedText()
  const formatPrice = useCurrency()

  const items = useCartStore((s) => s.items)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartStore((s) => s.subtotal())

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-6 text-lg text-content-light-secondary dark:text-content-dark-secondary">
          {t('cart.empty')}
        </p>
        <Link to="/products">
          <Button>{t('cart.continueShopping')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t('cart.title')}</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.lineId}
            className="flex gap-4 rounded-2xl bg-surface-light p-4 shadow-sm dark:bg-surface-dark-alt"
          >
            <img
              src={item.imageUrl}
              alt={tx(item.title)}
              className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
            />
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-content-light-primary dark:text-content-dark-primary">
                  {tx(item.title)}
                </h2>
                <button
                  type="button"
                  onClick={() => removeItem(item.lineId)}
                  aria-label={t('cart.remove')}
                  className="focus-ring rounded-lg p-1 text-content-light-secondary transition-colors hover:text-red-600 dark:text-content-dark-secondary"
                >
                  <TrashIcon />
                </button>
              </div>

              {/* Captured customization snapshot */}
              {item.selections.length > 0 && (
                <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
                  {item.selections.map((s) => `${tx(s.componentName)}: ${tx(s.optionName)}`).join(' · ')}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                {/* Quantity stepper */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
                    {t('cart.quantity')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(item.lineId, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="focus-ring w-16 rounded-lg border border-black/10 bg-surface-light-alt px-2 py-1 text-center text-sm dark:border-white/10 dark:bg-surface-dark"
                  />
                </div>
                <span className="font-bold text-brand dark:text-brand-dark">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="mt-8 flex flex-col items-end gap-4 rounded-2xl bg-surface-light p-6 shadow-sm dark:bg-surface-dark-alt">
        <div className="flex w-full max-w-xs items-center justify-between text-lg">
          <span className="font-medium">{t('cart.subtotal')}</span>
          <span className="font-extrabold text-brand dark:text-brand-dark">
            {formatPrice(subtotal)}
          </span>
        </div>
        <Button size="lg" className="w-full max-w-xs">
          {t('cart.checkout')}
        </Button>
      </div>
    </div>
  )
}
