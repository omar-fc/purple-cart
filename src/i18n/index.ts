import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'

/**
 * react-i18next configuration.
 *
 * Supported locales: English (LTR) and Arabic (RTL). The actual document
 * direction is applied by `applyDocumentDirection`, which the locale store
 * calls whenever the language changes (and once on startup).
 */

export const SUPPORTED_LOCALES = ['en', 'ar'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

/** Locales that read right-to-left. */
const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(['ar'])

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.has(locale)
}

/**
 * Reflect the active locale onto the <html> element: both the `lang` attribute
 * (a11y / SEO) and `dir` (so Tailwind logical properties flip the layout).
 * This is the ONE place that touches document direction.
 */
export function applyDocumentDirection(locale: Locale): void {
  const root = document.documentElement
  root.lang = locale
  root.dir = isRtl(locale) ? 'rtl' : 'ltr'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes against XSS.
  },
})

export default i18n
