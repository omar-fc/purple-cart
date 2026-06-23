import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'

/**
 * Admin login container. Drives the auth store and redirects to the dashboard on
 * success. Demo credentials: admin / admin.
 */
export function AdminLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (login(username, password)) {
      navigate('/admin', { replace: true })
    } else {
      setError(true)
    }
  }

  const field =
    'focus-ring w-full rounded-lg border border-black/10 bg-surface-light-alt px-3 py-2.5 text-sm dark:border-white/10 dark:bg-surface-dark'

  return (
    <div className="grid min-h-screen place-items-center bg-surface-light-alt p-4 dark:bg-surface-dark">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl bg-surface-light p-8 shadow-lg dark:bg-surface-dark-alt"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand dark:text-brand-dark">
            {t('admin.title')}
          </h1>
          <p className="mt-1 text-sm text-content-light-secondary dark:text-content-dark-secondary">
            {t('admin.loginPrompt')}
          </p>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">{t('admin.username')}</span>
          <input
            className={field}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">{t('admin.password')}</span>
          <input
            type="password"
            className={field}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{t('admin.loginError')}</p>
        )}

        <Button type="submit" className="w-full">
          {t('admin.login')}
        </Button>
      </form>
    </div>
  )
}
