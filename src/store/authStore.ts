import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Admin auth store — gates the /admin route group.
 *
 * This is a DEMO credential check (admin / admin) done client-side. A real app
 * would call an auth endpoint and store a token; the shape here intentionally
 * mirrors that so swapping in a real backend is a one-function change.
 */

interface AuthState {
  isAuthenticated: boolean
  username: string | null
  /** Returns true on success, false on bad credentials. */
  login: (username: string, password: string) => boolean
  logout: () => void
}

const DEMO_USER = 'admin'
const DEMO_PASS = 'admin'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (username, password) => {
        const ok = username === DEMO_USER && password === DEMO_PASS
        if (ok) set({ isAuthenticated: true, username })
        return ok
      },
      logout: () => set({ isAuthenticated: false, username: null }),
    }),
    { name: 'purplecart:auth' },
  ),
)
