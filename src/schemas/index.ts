import { z } from 'zod'

/**
 * ---------------------------------------------------------------------------
 *  Zod schemas — the single source of truth for our data models.
 *
 *  Every value crossing the mock-API boundary (read from localStorage OR
 *  written back to it) is parsed through these schemas. That guarantees the UI
 *  only ever deals with well-typed, validated data, and that corrupt/legacy
 *  storage payloads fail loudly instead of leaking `any` into the app.
 *
 *  Types are *inferred* from the schemas (z.infer) so the schema and the
 *  TypeScript type can never drift apart.
 * ---------------------------------------------------------------------------
 */

/** A piece of UI copy that exists in both supported locales. */
export const LocalizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
})
export type LocalizedString = z.infer<typeof LocalizedStringSchema>

/* -------------------------------------------------------------------------- */
/*  Catalog taxonomy                                                          */
/* -------------------------------------------------------------------------- */

export const CategorySchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  slug: z.string().min(1),
})
export type Category = z.infer<typeof CategorySchema>

export const SubCategorySchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: LocalizedStringSchema,
  slug: z.string().min(1),
})
export type SubCategory = z.infer<typeof SubCategorySchema>

/* -------------------------------------------------------------------------- */
/*  Product customization                                                      */
/* -------------------------------------------------------------------------- */

/** A single selectable choice within a customizable component. */
export const ProductComponentOptionSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  /** Added to (or subtracted from) the product base price when selected. */
  priceModifier: z.number(),
  /** Exactly one option per component should be the default. */
  isDefault: z.boolean(),
})
export type ProductComponentOption = z.infer<typeof ProductComponentOptionSchema>

/** A configurable aspect of a product (e.g. "Storage", "Color"). */
export const ProductComponentSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  options: z.array(ProductComponentOptionSchema).min(1),
})
export type ProductComponent = z.infer<typeof ProductComponentSchema>

/* -------------------------------------------------------------------------- */
/*  Product                                                                    */
/* -------------------------------------------------------------------------- */

export const ProductSchema = z.object({
  id: z.string(),
  subCategoryId: z.string(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  basePrice: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
  /** Free-form spec sheet. Keys are spec labels, values are spec values. */
  specs: z.record(z.string(), LocalizedStringSchema),
  customizableComponents: z.array(ProductComponentSchema),
})
export type Product = z.infer<typeof ProductSchema>

/* -------------------------------------------------------------------------- */
/*  Collection schemas (what the mock API returns)                            */
/* -------------------------------------------------------------------------- */

export const CategoryListSchema = z.array(CategorySchema)
export const SubCategoryListSchema = z.array(SubCategorySchema)
export const ProductListSchema = z.array(ProductSchema)

/* -------------------------------------------------------------------------- */
/*  Write payloads (used by the Admin portal CRUD forms)                      */
/*  `id` is server-assigned, so it is omitted from create payloads.           */
/* -------------------------------------------------------------------------- */

export const CategoryInputSchema = CategorySchema.omit({ id: true })
export type CategoryInput = z.infer<typeof CategoryInputSchema>

export const SubCategoryInputSchema = SubCategorySchema.omit({ id: true })
export type SubCategoryInput = z.infer<typeof SubCategoryInputSchema>

export const ProductInputSchema = ProductSchema.omit({ id: true })
export type ProductInput = z.infer<typeof ProductInputSchema>

/* -------------------------------------------------------------------------- */
/*  Cart (persisted client-side, also validated on rehydrate)                 */
/* -------------------------------------------------------------------------- */

/** A frozen snapshot of the customization the customer chose at add-to-cart. */
export const CartSelectionSchema = z.object({
  componentId: z.string(),
  componentName: LocalizedStringSchema,
  optionId: z.string(),
  optionName: LocalizedStringSchema,
  priceModifier: z.number(),
})
export type CartSelection = z.infer<typeof CartSelectionSchema>

export const CartItemSchema = z.object({
  /** Stable key = productId + sorted selected option ids, so identical
   *  configurations stack and different ones stay separate. */
  lineId: z.string(),
  productId: z.string(),
  title: LocalizedStringSchema,
  imageUrl: z.string().url(),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  selections: z.array(CartSelectionSchema),
})
export type CartItem = z.infer<typeof CartItemSchema>
