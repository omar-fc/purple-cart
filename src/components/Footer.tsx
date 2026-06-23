import { useTranslation } from 'react-i18next'

/** Presentational footer. */
export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-16 border-t border-black/5 bg-surface-light py-8 dark:border-white/5 dark:bg-surface-dark-alt">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-content-light-secondary dark:text-content-dark-secondary">
        © {t('common.brand')} — demo storefront. Built with React, Zustand, Zod &amp; Tailwind.
      </div>
    </footer>
  )
}
