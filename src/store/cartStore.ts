import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/schemas'

/**
 * Cart store — holds line items and exposes mutation/derived helpers.
 *
 * Lines are keyed by `lineId` (productId + chosen options) so the same product
 * with different customizations are distinct lines, while identical configs
 * merge and bump quantity. Persisted to localStorage.
 */

interface CartState {
  items: CartItem[]
  /** Add a fully-built line; merges quantity if an identical line exists. */
  addItem: (item: CartItem) => void
  removeItem: (lineId: string) => void
  setQuantity: (lineId: string, quantity: number) => void
  clear: () => void
  // Derived selectors (kept as functions so components can subscribe narrowly).
  totalQuantity: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.lineId === item.lineId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineId === item.lineId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),

      setQuantity: (lineId, quantity) =>
        set((state) => ({
          items: state.items
            // Removing via qty 0 keeps the UI honest.
            .map((i) => (i.lineId === lineId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),

      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    { name: 'purplecart:cart' },
  ),
)
