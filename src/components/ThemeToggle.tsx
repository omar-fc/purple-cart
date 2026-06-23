import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/store/themeStore'
import { MoonIcon, SunIcon } from './icons'

/**
 * Connected control widget bound to the theme store. Control widgets that map
 * directly onto a single global UI preference are kept self-contained by design
 * (the alternative — threading handlers through every layout — adds noise).
 */
export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('nav.toggleTheme')}
      title={t('nav.toggleTheme')}
      className="focus-ring rounded-lg p-2 text-content-light-secondary transition-colors hover:bg-surface-light-alt dark:text-content-dark-secondary dark:hover:bg-surface-dark-alt"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
