import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n, { applyDocumentDirection, type Locale } from '@/i18n'

/**
 * Locale store — owns the active language and keeps three things in sync:
 *   1. i18next's active language (drives all translated copy)
 *   2. The <html> dir/lang attributes (drives RTL layout)
 *   3. The persisted preference in localStorage
 */

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

/** Single helper that syncs i18next + document direction for a locale. */
function applyLocale(locale: Locale): void {
  void i18n.changeLanguage(locale)
  applyDocumentDirection(locale)
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => {
        applyLocale(locale)
        set({ locale })
      },
      toggleLocale: () => {
        const next: Locale = get().locale === 'en' ? 'ar' : 'en'
        applyLocale(next)
        set({ locale: next })
      },
    }),
    {
      name: 'purplecart:locale',
      onRehydrateStorage: () => (state) => {
        if (state) applyLocale(state.locale)
      },
    },
  ),
)

/** Apply the persisted locale on first paint (called from main.tsx). */
export function initLocale(): void {
  applyLocale(useLocaleStore.getState().locale)
}
