import { useMemo, useState } from 'react'
import type { CartItem, CartSelection, Product } from '@/schemas'

/**
 * The customization engine, encapsulated as a hook.
 *
 * Given a product, it tracks the currently-selected option per component
 * (seeded from each component's `isDefault`), exposes a `select` mutator, and
 * derives the live unit price (base + sum of selected modifiers) plus a ready
 * `buildCartItem()` that snapshots the configuration into a CartItem.
 *
 * All business logic lives here; the PDP presentational pieces just render
 * state and call `select`.
 */

export interface CustomizationApi {
  /** Map of componentId -> selected optionId. */
  selected: Record<string, string>
  select: (componentId: string, optionId: string) => void
  /** Live unit price for the current configuration. */
  unitPrice: number
  /** Snapshot the current configuration into a cart line item. */
  buildCartItem: (quantity: number) => CartItem
}

/** Compute the initial selection from each component's default option. */
function initialSelection(product: Product): Record<string, string> {
  const seed: Record<string, string> = {}
  for (const component of product.customizableComponents) {
    const def = component.options.find((o) => o.isDefault) ?? component.options[0]
    if (def) seed[component.id] = def.id
  }
  return seed
}

export function useProductCustomization(product: Product): CustomizationApi {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    initialSelection(product),
  )

  const select = (componentId: string, optionId: string) =>
    setSelected((prev) => ({ ...prev, [componentId]: optionId }))

  // Recompute price + the selection snapshot only when inputs change.
  const { unitPrice, selections } = useMemo(() => {
    const picks: CartSelection[] = []
    let price = product.basePrice

    for (const component of product.customizableComponents) {
      const optionId = selected[component.id]
      const option = component.options.find((o) => o.id === optionId)
      if (!option) continue
      price += option.priceModifier
      picks.push({
        componentId: component.id,
        componentName: component.name,
        optionId: option.id,
        optionName: option.name,
        priceModifier: option.priceModifier,
      })
    }

    return { unitPrice: price, selections: picks }
  }, [product, selected])

  const buildCartItem = (quantity: number): CartItem => {
    // Stable line id so identical configurations stack in the cart.
    const optionKey = selections
      .map((s) => s.optionId)
      .sort()
      .join('-')
    return {
      lineId: `${product.id}__${optionKey}`,
      productId: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      unitPrice,
      quantity,
      selections,
    }
  }

  return { selected, select, unitPrice, buildCartItem }
}
