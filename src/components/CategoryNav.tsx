import { Link } from 'react-router-dom'
import { useCategories, useSubCategories } from '@/hooks/useCatalog'
import { useLocalizedText } from '@/hooks/useLocale'
import { ChevronDownIcon } from './icons'

/**
 * Secondary navigation: a horizontal list of categories, each revealing its
 * subcategories in a hover/focus dropdown. Connected (reads catalog hooks) but
 * delegates all formatting to the locale helper. CSS-only dropdown via the
 * `group` pattern so it works without extra JS state and is keyboard-focusable.
 */
export function CategoryNav() {
  const { data: categories } = useCategories()
  const { data: subCategories } = useSubCategories()
  const tx = useLocalizedText()

  if (!categories || categories.length === 0) return null

  return (
    <nav className="border-t border-black/5 bg-surface-light dark:border-white/5 dark:bg-surface-dark">
      {/* No `overflow-x-auto` here: it would clip the absolutely-positioned
          dropdowns vertically. We wrap instead so the bar still fits. */}
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4">
        {categories.map((category) => {
          const subs = (subCategories ?? []).filter((s) => s.categoryId === category.id)
          return (
            <li key={category.id} className="group relative">
              <Link
                to={`/products?category=${category.slug}`}
                className="focus-ring flex items-center gap-1 whitespace-nowrap px-3 py-3 text-sm font-medium text-content-light-secondary transition-colors hover:text-brand dark:text-content-dark-secondary dark:hover:text-brand-dark"
              >
                {tx(category.name)}
                {subs.length > 0 && <ChevronDownIcon width="1em" height="1em" />}
              </Link>

              {subs.length > 0 && (
                // start-0 anchors the dropdown to the inline-start edge (RTL-safe)
                <ul className="invisible absolute start-0 top-full z-50 min-w-44 rounded-xl border border-black/5 bg-surface-light p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-white/10 dark:bg-surface-dark-alt">
                  {subs.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/products?category=${category.slug}&sub=${sub.slug}`}
                        className="focus-ring block rounded-lg px-3 py-2 text-sm text-content-light-primary transition-colors hover:bg-surface-light-alt dark:text-content-dark-primary dark:hover:bg-surface-dark"
                      >
                        {tx(sub.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
