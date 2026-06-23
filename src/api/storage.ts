import { z } from 'zod'

/**
 * ---------------------------------------------------------------------------
 *  Low-level mock persistence helpers.
 *
 *  These wrap `localStorage` and add two things the rest of the app relies on:
 *    1. Simulated network latency (so loading states are real & testable).
 *    2. Zod validation on every read AND write — nothing untyped ever reaches
 *       the UI, and we never persist a malformed payload.
 *
 *  The public api/*.ts modules build on top of these primitives. UI code must
 *  NEVER import this file directly — it goes through the typed api/* services.
 * ---------------------------------------------------------------------------
 */

/** Namespaced storage keys to avoid clobbering other apps on the same origin. */
export const STORAGE_KEYS = {
  categories: 'purplecart:categories',
  subCategories: 'purplecart:subcategories',
  products: 'purplecart:products',
  seeded: 'purplecart:seeded',
} as const

/** Tunable simulated round-trip time for the fake network. */
const NETWORK_LATENCY_MS = 450

/** Resolve `value` after a simulated network delay. */
export function withLatency<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_LATENCY_MS))
}

/**
 * Read a JSON collection from storage and validate it against `schema`.
 * Returns `fallback` when the key is missing; throws if stored data is corrupt
 * (which surfaces as a rejected promise the UI can show as an error state).
 */
export function readCollection<T>(
  key: string,
  schema: z.ZodType<T>,
  fallback: T,
): T {
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback

  const parsed: unknown = JSON.parse(raw)
  // `parse` throws on mismatch — we WANT that loud failure for corrupt storage.
  return schema.parse(parsed)
}

/**
 * Validate `value` against `schema` and persist it. Validation-before-write is a
 * hard architectural rule: storage can only ever contain schema-valid data.
 */
export function writeCollection<T>(key: string, schema: z.ZodType<T>, value: T): T {
  const validated = schema.parse(value)
  localStorage.setItem(key, JSON.stringify(validated))
  return validated
}

/** Small id generator good enough for a client-only demo. */
export function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8)
  const time = Date.now().toString(36)
  return `${prefix}_${time}${rand}`
}
