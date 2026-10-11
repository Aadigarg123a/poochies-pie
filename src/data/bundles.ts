/**
 * Pawrty Planner bundles. Each bundle is just a list of menu items; its total
 * is the plain sum of their menu prices (no invented discounts).
 * TODO(owner): a bundle discount, if any (FLAGS.bundleDiscountPercent stays null).
 */
import type { CakeConfig, ItemConfig, LineConfig, PackConfig } from '@/lib/pricing'

export interface BundlePart {
  id: string
  role: 'cake' | 'cap' | 'bandana' | 'guests'
  /** Default choice; the cheapest flavour/size so "from" prices are honest. */
  config: LineConfig
}

export interface Bundle {
  id: string
  name: string
  strapline: string
  description: string
  parts: readonly BundlePart[]
}

const cap: ItemConfig = { kind: 'item', slug: 'happy-birthday-cap', variantId: 'one-size' }
const bandana: ItemConfig = { kind: 'item', slug: 'happy-birthday-bandana', variantId: 'small' }
const cake = (size: CakeConfig['size']): CakeConfig => ({
  kind: 'cake',
  size,
  flavour: 'going-bananas',
  frosting: 'cream-cheese',
  addOns: [],
})
const cupcakes = (count: number): PackConfig => ({ kind: 'cupcakes', count, flavour: 'going-bananas', faces: 0 })

export const BUNDLES: readonly Bundle[] = [
  {
    id: 'petite-fete',
    name: 'La Petite Fête',
    strapline: 'For an intimate celebration',
    description: 'A Special Mini Cake, the Happy Birthday cap and a birthday bandana.',
    parts: [
      { id: 'cake', role: 'cake', config: cake('mini') },
      { id: 'cap', role: 'cap', config: cap },
      { id: 'bandana', role: 'bandana', config: bandana },
    ],
  },
  {
    id: 'grand-pawrty',
    name: 'Le Grand Pawrty',
    strapline: 'When friends are coming over',
    description: 'A half-kilo cake, cap and bandana, plus a box of four Rainbow Cupcakes for the guest pets.',
    parts: [
      { id: 'cake', role: 'cake', config: cake('half-kg') },
      { id: 'cap', role: 'cap', config: cap },
      { id: 'bandana', role: 'bandana', config: bandana },
      { id: 'guests', role: 'guests', config: cupcakes(4) },
    ],
  },
  {
    id: 'gala',
    name: 'The Gala',
    strapline: 'The full guest list',
    description: 'A one-kilo (or bone-shaped) cake, cap and bandana, plus a box of six Rainbow Cupcakes for the guest pets.',
    parts: [
      { id: 'cake', role: 'cake', config: cake('one-kg') },
      { id: 'cap', role: 'cap', config: cap },
      { id: 'bandana', role: 'bandana', config: bandana },
      { id: 'guests', role: 'guests', config: cupcakes(6) },
    ],
  },
]
