import { useTranslation } from 'react-i18next'
import { useLocaleStore } from '@/store/localeStore'

/** Connected EN/AR switch. See ThemeToggle for the "connected widget" rationale. */
export function LanguageToggle() {
  const { t } = useTranslation()
  const locale = useLocaleStore((s) => s.locale)
  const toggleLocale = useLocaleStore((s) => s.toggleLocale)

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t('nav.toggleLanguage')}
      title={t('nav.toggleLanguage')}
      className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-content-light-secondary transition-colors hover:bg-surface-light-alt dark:text-content-dark-secondary dark:hover:bg-surface-dark-alt"
    >
      {/* Show the language the user would switch TO. */}
      {locale === 'en' ? 'العربية' : 'EN'}
    </button>
  )
}
