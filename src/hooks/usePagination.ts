import { useMemo, useState } from 'react'

/**
 * Frontend pagination helper. Slices an in-memory array into pages and tracks
 * the current page. Used by the PLP (9 items/page) and the admin product list.
 */
export function usePagination<T>(items: ReadonlyArray<T>, pageSize: number) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  // Guard against the page index going stale after the list shrinks.
  const safePage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  return {
    page: safePage,
    totalPages,
    pageItems,
    setPage,
    next: () => setPage((p) => Math.min(p + 1, totalPages)),
    prev: () => setPage((p) => Math.max(p - 1, 1)),
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
  }
}
