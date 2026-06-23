import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { copyFileSync } from 'node:fs'

/**
 * GitHub Pages serves project sites under `https://<user>.github.io/<repo>/`,
 * so the app must be built with `base` set to `/<repo>/`. We read it from the
 * VITE_BASE env var (the deploy workflow injects it automatically from the repo
 * name) and fall back to `/` for local dev + previews.
 */
const base = process.env.VITE_BASE || '/'

/**
 * GitHub Pages has no SPA fallback: hitting /products directly (or refreshing a
 * deep link) would 404. Copying index.html to 404.html makes Pages serve the
 * app shell for any unknown path; the client router then renders the route.
 */
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      // `@` points at the src root so imports stay clean and refactor-safe.
      '@': path.resolve(__dirname, './src'),
    },
  },
})
