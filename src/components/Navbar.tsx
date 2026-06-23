import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { CartIcon, SearchIcon, UserIcon } from './icons'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { CategoryNav } from './CategoryNav'

/**
 * Global top navigation. Connected to the cart store (badge count) and auth
 * store (admin link). Contains the search field, brand, account portal, and the
 * theme/language controls. Spacing uses logical utilities so it flips in RTL.
 */
export function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const totalQuantity = useCartStore((s) => s.totalQuantity())
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [query, setQuery] = useState('')

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-surface-light/90 backdrop-blur dark:border-white/10 dark:bg-surface-dark/90">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="focus-ring flex items-center gap-2 rounded-lg text-xl font-extrabold tracking-tight text-brand dark:text-brand-dark"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white dark:bg-brand-dark">
            P
          </span>
          <span className="hidden sm:inline">{t('common.brand')}</span>
        </Link>

        {/* Search — capped width; a flexible spacer after it pushes the
            controls to the inline-end edge instead of sitting beside it. */}
        <form onSubmit={onSearch} className="relative w-full max-w-xs flex-1 sm:max-w-sm md:max-w-md">
          {/* Logical inset (start) so the icon sits correctly in LTR & RTL */}
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-content-light-secondary dark:text-content-dark-secondary">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.search')}
            aria-label={t('common.search')}
            className="focus-ring w-full rounded-lg border border-black/10 bg-surface-light-alt py-2 ps-10 pe-3 text-sm text-content-light-primary placeholder:text-content-light-secondary dark:border-white/10 dark:bg-surface-dark-alt dark:text-content-dark-primary dark:placeholder:text-content-dark-secondary"
          />
        </form>

        {/* Flexible spacer: absorbs the free space so the controls below sit at
            the inline-end edge of the header, away from the search bar. */}
        <div className="flex-1" aria-hidden="true" />

        {/* Controls */}
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />

          <Link
            to="/cart"
            aria-label={t('nav.cart')}
            className="focus-ring relative rounded-lg p-2 text-content-light-secondary transition-colors hover:bg-surface-light-alt dark:text-content-dark-secondary dark:hover:bg-surface-dark-alt"
          >
            <CartIcon />
            {totalQuantity > 0 && (
              <span className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-white dark:bg-brand-dark">
                {totalQuantity}
              </span>
            )}
          </Link>

          <Link
            to={isAuthenticated ? '/admin' : '/admin/login'}
            aria-label={t('nav.account')}
            className="focus-ring rounded-lg p-2 text-content-light-secondary transition-colors hover:bg-surface-light-alt dark:text-content-dark-secondary dark:hover:bg-surface-dark-alt"
          >
            <UserIcon />
          </Link>
        </div>
      </div>

      {/* Secondary category navigation */}
      <CategoryNav />
    </header>
  )
}
