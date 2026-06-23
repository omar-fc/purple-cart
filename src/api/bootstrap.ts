import {
  CategoryListSchema,
  ProductListSchema,
  SubCategoryListSchema,
} from '@/schemas'
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_SUBCATEGORIES } from './seed'
import { STORAGE_KEYS, writeCollection } from './storage'

/**
 * Seed localStorage with the demo catalog the first time the app runs (or after
 * the user clears storage). Idempotent: guarded by a `seeded` flag so we never
 * overwrite data the admin has since edited.
 */
export function ensureSeeded(): void {
  if (localStorage.getItem(STORAGE_KEYS.seeded) === 'true') return

  // Each write is validated against its schema before being persisted.
  writeCollection(STORAGE_KEYS.categories, CategoryListSchema, SEED_CATEGORIES)
  writeCollection(STORAGE_KEYS.subCategories, SubCategoryListSchema, SEED_SUBCATEGORIES)
  writeCollection(STORAGE_KEYS.products, ProductListSchema, SEED_PRODUCTS)

  localStorage.setItem(STORAGE_KEYS.seeded, 'true')
}
