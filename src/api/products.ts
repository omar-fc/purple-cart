import {
  ProductInputSchema,
  ProductListSchema,
  type Product,
  type ProductInput,
} from '@/schemas'
import {
  makeId,
  readCollection,
  STORAGE_KEYS,
  withLatency,
  writeCollection,
} from './storage'

/**
 * Product service. Same contract as the category service: Promise-returning,
 * Zod-validated on every boundary crossing.
 */

function loadProducts(): Product[] {
  return readCollection(STORAGE_KEYS.products, ProductListSchema, [])
}

export function getProducts(): Promise<Product[]> {
  return withLatency(loadProducts())
}

export function getProductById(id: string): Promise<Product | null> {
  const found = loadProducts().find((p) => p.id === id) ?? null
  return withLatency(found)
}

/** The 3 highest-stock products, used by the Home page "Featured" section. */
export function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const featured = [...loadProducts()]
    .sort((a, b) => b.stockQuantity - a.stockQuantity)
    .slice(0, limit)
  return withLatency(featured)
}

export function createProduct(input: ProductInput): Promise<Product> {
  const validated = ProductInputSchema.parse(input)
  const created: Product = { id: makeId('prod'), ...validated }
  const next = [...loadProducts(), created]
  writeCollection(STORAGE_KEYS.products, ProductListSchema, next)
  return withLatency(created)
}

export function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const validated = ProductInputSchema.parse(input)
  const updated: Product = { id, ...validated }
  const next = loadProducts().map((p) => (p.id === id ? updated : p))
  writeCollection(STORAGE_KEYS.products, ProductListSchema, next)
  return withLatency(updated)
}

export function deleteProduct(id: string): Promise<{ id: string }> {
  const next = loadProducts().filter((p) => p.id !== id)
  writeCollection(STORAGE_KEYS.products, ProductListSchema, next)
  return withLatency({ id })
}
