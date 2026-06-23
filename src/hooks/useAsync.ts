import { useCallback, useEffect, useState } from 'react'

/**
 * Generic async-data hook. Containers use this to call the mock API while
 * keeping presentational components free of fetching logic.
 *
 * Exposes the classic { data, loading, error, refetch } quad. `deps` controls
 * when the fetch re-runs (same semantics as a useEffect dependency array).
 */

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  // Lets callers force a re-run without changing their real deps.
  const [nonce, setNonce] = useState(0)

  const refetch = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // `fetcher` is intentionally excluded; `deps` + `nonce` drive re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return { data, loading, error, refetch }
}
