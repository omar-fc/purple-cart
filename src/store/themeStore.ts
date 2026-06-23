import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Theme store — owns the light/dark preference.
 *
 * Persisted to localStorage via zustand's `persist` middleware. The actual DOM
 * side-effect (toggling the `dark` class on <html>) is applied by
 * `applyTheme`, which is also called once at startup from `initTheme`.
 */

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

/** Reflect the theme onto <html> so Tailwind's `dark:` variants engage. */
function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'purplecart:theme',
      // After the persisted value is rehydrated, push it to the DOM.
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)

/** Apply the persisted/system theme on first paint (called from main.tsx). */
export function initTheme(): void {
  applyTheme(useThemeStore.getState().theme)
}
