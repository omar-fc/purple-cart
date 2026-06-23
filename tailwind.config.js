/** @type {import('tailwindcss').Config} */
export default {
  // Class-based dark mode: we toggle the `dark` class on <html> via the theme store.
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette. `brand` is the deep purple; `brand-dark` is the
        // lighter purple used in dark mode for better contrast.
        brand: {
          DEFAULT: '#6D28D9', // purple-700
          dark: '#8B5CF6', // purple-500-ish for dark mode
        },
        // Semantic surface/text tokens so components read intent, not hex.
        surface: {
          light: '#FFFFFF',
          'light-alt': '#F3F4F6',
          dark: '#0F172A', // very dark slate (page bg)
          'dark-alt': '#1E293B', // dark gray (cards)
        },
        content: {
          'light-primary': '#1E293B',
          'light-secondary': '#64748B',
          'dark-primary': '#F8FAFC',
          'dark-secondary': '#94A3B8',
        },
        status: {
          success: '#10B981', // in-stock / selected
        },
      },
      fontFamily: {
        // Cairo renders Arabic gracefully; falls back to system sans.
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
