import {
  getCategories,
  getSubCategories,
} from '@/api/categories'
import {
  getFeaturedProducts,
  getProductById,
  getProducts,
} from '@/api/products'
import { useAsync } from './useAsync'

/**
 * Thin data hooks over the mock API. Each is a container-level concern: it owns
 * the loading/error lifecycle so pages and presentational components don't.
 */

export const useCategories = () => useAsync(() => getCategories(), [])
export const useSubCategories = () => useAsync(() => getSubCategories(), [])
export const useProducts = () => useAsync(() => getProducts(), [])
export const useFeaturedProducts = () => useAsync(() => getFeaturedProducts(3), [])
export const useProduct = (id: string) =>
  useAsync(() => getProductById(id), [id])
