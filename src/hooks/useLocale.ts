import { useCallback } from 'react'
import { useLocaleStore } from '@/store/localeStore'
import type { LocalizedString } from '@/schemas'

/**
 * Bilingual + currency helpers, derived from the active locale.
 *
 *  - `t(localized)` picks the right string from a LocalizedString object.
 *  - `formatPrice(n)` renders a number as currency. We map locale → currency
 *    for the demo: English → USD, Arabic → EGP, using Intl.NumberFormat so
 *    digit shaping and symbol placement follow the locale automatically.
 */

const CURRENCY_BY_LOCALE = { en: 'USD', ar: 'EGP' } as const
// Simple fixed FX so EGP figures look believable in the demo.
const USD_TO_EGP = 49

export function useLocalizedText() {
  const locale = useLocaleStore((s) => s.locale)
  // Returns the field for the active locale; safe for any LocalizedString.
  return useCallback((value: LocalizedString) => value[locale], [locale])
}

export function useCurrency() {
  const locale = useLocaleStore((s) => s.locale)

  return useCallback(
    (usdAmount: number) => {
      const currency = CURRENCY_BY_LOCALE[locale]
      const amount = currency === 'EGP' ? usdAmount * USD_TO_EGP : usdAmount
      return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount)
    },
    [locale],
  )
}
