import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n' // initialize i18next before any component renders
import { ensureSeeded } from './api/bootstrap'
import { initTheme } from './store/themeStore'
import { initLocale } from './store/localeStore'

/**
 * App bootstrap order matters:
 *   1. Seed the mock catalog into localStorage (idempotent).
 *   2. Apply persisted theme + locale to <html> BEFORE first paint, so there's
 *      no flash of the wrong theme/direction.
 */
ensureSeeded()
initTheme()
initLocale()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
