import {
  CategoryInputSchema,
  CategoryListSchema,
  SubCategoryInputSchema,
  SubCategoryListSchema,
  type Category,
  type CategoryInput,
  type SubCategory,
  type SubCategoryInput,
} from '@/schemas'
import {
  makeId,
  readCollection,
  STORAGE_KEYS,
  withLatency,
  writeCollection,
} from './storage'

/**
 * Category / SubCategory service.
 *
 * Every function returns a Promise (simulated network) and every read & write
 * is funneled through a Zod schema. Containers/hooks consume this; presentation
 * components never touch it.
 */

function loadCategories(): Category[] {
  return readCollection(STORAGE_KEYS.categories, CategoryListSchema, [])
}
function loadSubCategories(): SubCategory[] {
  return readCollection(STORAGE_KEYS.subCategories, SubCategoryListSchema, [])
}

/* ----------------------------- Categories -------------------------------- */

export function getCategories(): Promise<Category[]> {
  return withLatency(loadCategories())
}

export function createCategory(input: CategoryInput): Promise<Category> {
  const validated = CategoryInputSchema.parse(input)
  const created: Category = { id: makeId('cat'), ...validated }
  const next = [...loadCategories(), created]
  writeCollection(STORAGE_KEYS.categories, CategoryListSchema, next)
  return withLatency(created)
}

export function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const validated = CategoryInputSchema.parse(input)
  const updated: Category = { id, ...validated }
  const next = loadCategories().map((c) => (c.id === id ? updated : c))
  writeCollection(STORAGE_KEYS.categories, CategoryListSchema, next)
  return withLatency(updated)
}

export function deleteCategory(id: string): Promise<{ id: string }> {
  // Cascade: drop the category and any subcategories that belonged to it.
  const nextCats = loadCategories().filter((c) => c.id !== id)
  const nextSubs = loadSubCategories().filter((s) => s.categoryId !== id)
  writeCollection(STORAGE_KEYS.categories, CategoryListSchema, nextCats)
  writeCollection(STORAGE_KEYS.subCategories, SubCategoryListSchema, nextSubs)
  return withLatency({ id })
}

/* --------------------------- SubCategories ------------------------------- */

export function getSubCategories(): Promise<SubCategory[]> {
  return withLatency(loadSubCategories())
}

export function createSubCategory(input: SubCategoryInput): Promise<SubCategory> {
  const validated = SubCategoryInputSchema.parse(input)
  const created: SubCategory = { id: makeId('sub'), ...validated }
  const next = [...loadSubCategories(), created]
  writeCollection(STORAGE_KEYS.subCategories, SubCategoryListSchema, next)
  return withLatency(created)
}

export function updateSubCategory(id: string, input: SubCategoryInput): Promise<SubCategory> {
  const validated = SubCategoryInputSchema.parse(input)
  const updated: SubCategory = { id, ...validated }
  const next = loadSubCategories().map((s) => (s.id === id ? updated : s))
  writeCollection(STORAGE_KEYS.subCategories, SubCategoryListSchema, next)
  return withLatency(updated)
}

export function deleteSubCategory(id: string): Promise<{ id: string }> {
  const next = loadSubCategories().filter((s) => s.id !== id)
  writeCollection(STORAGE_KEYS.subCategories, SubCategoryListSchema, next)
  return withLatency({ id })
}
