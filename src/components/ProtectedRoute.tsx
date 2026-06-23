import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * Route guard for the admin area. Redirects unauthenticated users to the login
 * screen, preserving intent (they land back at /admin after signing in).
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
