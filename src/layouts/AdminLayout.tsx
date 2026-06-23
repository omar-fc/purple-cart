import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Button } from '@/components/ui/Button'

/**
 * Admin dashboard shell: a sidebar with section links + a top bar with the
 * locale/theme controls and sign-out. Routed admin pages render in the Outlet.
 */
export function AdminLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const username = useAuthStore((s) => s.username)

  const links = [
    { to: '/admin', label: t('admin.dashboard'), end: true },
    { to: '/admin/categories', label: t('admin.manageCategories'), end: false },
    { to: '/admin/products', label: t('admin.manageProducts'), end: false },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `focus-ring block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand text-white dark:bg-brand-dark'
        : 'text-content-light-secondary hover:bg-surface-light-alt dark:text-content-dark-secondary dark:hover:bg-surface-dark'
    }`

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-surface-light-alt dark:bg-surface-dark">
      {/* Sidebar — border-e sits on the inline-end edge (RTL-safe) */}
      <aside className="flex w-60 flex-col border-e border-black/5 bg-surface-light p-4 dark:border-white/5 dark:bg-surface-dark-alt">
        <NavLink to="/" className="focus-ring mb-6 rounded-lg text-xl font-extrabold text-brand dark:text-brand-dark">
          {t('common.brand')}
        </NavLink>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-black/5 bg-surface-light px-6 py-3 dark:border-white/5 dark:bg-surface-dark-alt">
          <span className="text-sm text-content-light-secondary dark:text-content-dark-secondary">
            {username}
          </span>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              {t('admin.logout')}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
