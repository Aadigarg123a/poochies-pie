/**
 * Pure pricing functions. Every rupee shown on the site is computed here,
 * from src/data/menu.ts only. Cart lines store a configuration, never a price.
 */
import {
  CAKE,
  CAKE_SIZES,
  CAKE_SIZE_RULES,
  CUPCAKES,
  DOGNUTS,
  FROSTINGS,
  HALF_KG_ADD_ONS,
  MINI_ADD_ONS,
  MINI_CAKE,
  getFlavour,
  getProduct,
  type AddOn,
  type AddOnId,
  type CakeSize,
  type FlavourId,
  type FrostingId,
  type PackProduct,
  type SharedFlavourId,
} from '@/data/menu'

export interface CakeConfig {
  kind: 'cake'
  size: CakeSize
  flavour: FlavourId
  frosting: FrostingId
  addOns: AddOnId[]
  /** Text for the Name Banner add-on. */
  bannerText?: string
}

export interface PackConfig {
  kind: 'dognuts' | 'cupcakes'
  count: number
  flavour: SharedFlavourId
  /** Rainbow Cupcakes: number of cupcakes with a face add-on. */
  faces?: number
}

export interface ItemConfig {
  kind: 'item'
  slug: string
  variantId: string
  /** e.g. a Pup-icecream flavour. */
  option?: string
}

export type LineConfig = CakeConfig | PackConfig | ItemConfig

export interface PriceLine {
  label: string
  amount: number
}

export interface PriceBreakdown {
  base: PriceLine
  extras: PriceLine[]
  total: number
}

export class PricingError extends Error {}

/* ── Cakes ────────────────────────────────────────────────────────────────── */

export function addOnsForSize(size: CakeSize): readonly AddOn[] {
  return size === 'mini' ? MINI_ADD_ONS : HALF_KG_ADD_ONS
}

export function cakeBasePrice(size: CakeSize, flavour: FlavourId): number {
  const halfKg = CAKE.halfKgPrices[flavour]
  switch (size) {
    case 'mini':
      return MINI_CAKE.prices[flavour]
    case 'half-kg':
      return halfKg
    case 'one-kg':
      return halfKg + CAKE_SIZE_RULES.oneKgSurcharge
    case 'bone-one-kg': {
      const basis =
        CAKE_SIZE_RULES.boneBasis === 'half-kg' ? halfKg : halfKg + CAKE_SIZE_RULES.oneKgSurcharge
      return basis + CAKE_SIZE_RULES.boneSurcharge
    }
  }
}

/** Human-readable problems with a cake configuration. Empty array = valid. */
export function validateCake(config: CakeConfig): string[] {
  const errors: string[] = []
  const available = addOnsForSize(config.size)
  for (const id of config.addOns) {
    if (!available.some((a) => a.id === id)) errors.push(`Unknown add-on: ${id}`)
  }
  if (new Set(config.addOns).size !== config.addOns.length) errors.push('An add-on was chosen twice.')
  if (config.addOns.includes('mini-face') && config.addOns.includes('full-face')) {
    errors.push('Choose either Mini Face or Full Face, not both.')
  }
  if (config.addOns.includes('name-banner') && !config.bannerText?.trim()) {
    errors.push('Add the name for the banner.')
  }
  if (!FROSTINGS.some((f) => f.id === config.frosting)) errors.push('Choose a frosting.')
  return errors
}

export function sizeLabel(size: CakeSize): string {
  const s = CAKE_SIZES.find((x) => x.id === size)!
  if (size === 'mini') return `Special Mini Cake (${s.weight})`
  if (size === 'bone-one-kg') return 'Bone-shaped 1 kg cake'
  return `${s.weight} cake`
}

export function priceCake(config: CakeConfig): PriceBreakdown {
  const errors = validateCake(config)
  if (errors.length) throw new PricingError(errors.join(' '))
  const flavour = getFlavour(config.flavour)
  const base = { label: `${sizeLabel(config.size)} · ${flavour.name}`, amount: cakeBasePrice(config.size, config.flavour) }
  const list = addOnsForSize(config.size)
  // Keep the menu's order so breakdowns read the same everywhere.
  const extras = list
    .filter((a) => config.addOns.includes(a.id))
    .map((a) => ({ label: a.name, amount: a.price }))
  return { base, extras, total: sum(base, extras) }
}

/* ── Dognuts & Cupcakes ───────────────────────────────────────────────────── */

function packFor(product: PackProduct, count: number) {
  const pack = product.packs.find((p) => p.count === count)
  if (!pack) throw new PricingError(`${product.name} doesn't come in a ${product.packLabel.toLowerCase()} of ${count}.`)
  return pack
}

export function pricePack(config: PackConfig): PriceBreakdown {
  const product: PackProduct = config.kind === 'dognuts' ? DOGNUTS : CUPCAKES
  const pack = packFor(product, config.count)
  const flavour = getFlavour(config.flavour)
  const nonVeg = flavour.diet === 'non-veg'
  const base = {
    label: `${product.name} · ${product.packLabel} of ${pack.count} · ${flavour.name} (${nonVeg ? 'Non-veg' : 'Veg'})`,
    amount: nonVeg ? pack.nonVeg : pack.veg,
  }
  const extras: PriceLine[] = []
  const faces = config.faces ?? 0
  if (faces) {
    if (config.kind !== 'cupcakes' || !product.facePerPiece) throw new PricingError('Face add-ons are for Rainbow Cupcakes only.')
    if (!Number.isInteger(faces) || faces < 0 || faces > pack.count) {
      throw new PricingError(`Faces must be between 0 and ${pack.count}.`)
    }
    extras.push({ label: `Face add-on × ${faces}`, amount: faces * product.facePerPiece })
  }
  return { base, extras, total: sum(base, extras) }
}

/* ── Treats & Accessories ─────────────────────────────────────────────────── */

export function priceItem(config: ItemConfig): PriceBreakdown {
  const product = getProduct(config.slug)
  if (!product || (product.kind !== 'treat' && product.kind !== 'accessory')) {
    throw new PricingError(`Unknown item: ${config.slug}`)
  }
  const variant = product.variants.find((v) => v.id === config.variantId)
  if (!variant) throw new PricingError(`Unknown option for ${product.name}: ${config.variantId}`)
  if (product.options && (!config.option || !product.options.values.includes(config.option))) {
    throw new PricingError(`Choose a ${product.options.label.toLowerCase()} for ${product.name}.`)
  }
  const parts = [product.name]
  if (product.variants.length > 1 || variant.name !== product.name) parts.push(variant.name)
  if (config.option) parts.push(config.option)
  const base = { label: dedupe(parts).join(' · '), amount: variant.price }
  return { base, extras: [], total: base.amount }
}

/* ── Any line ─────────────────────────────────────────────────────────────── */

export function priceLine(config: LineConfig): PriceBreakdown {
  switch (config.kind) {
    case 'cake':
      return priceCake(config)
    case 'dognuts':
    case 'cupcakes':
      return pricePack(config)
    case 'item':
      return priceItem(config)
  }
}

/** Lowest price a product can be ordered at (for "from ₹X" labels). */
export function fromPrice(slug: string): number {
  const product = getProduct(slug)
  if (!product) throw new PricingError(`Unknown product: ${slug}`)
  switch (product.kind) {
    case 'cake':
      return Math.min(...Object.values(product.halfKgPrices))
    case 'mini-cake':
      return Math.min(...Object.values(product.prices))
    case 'dognuts':
    case 'cupcakes':
      return Math.min(...product.packs.map((p) => p.veg))
    default:
      return Math.min(...product.variants.map((v) => v.price))
  }
}

/** Highest single-unit price (for AggregateOffer). Cakes include the Bone-shaped size. */
export function toPrice(slug: string): number {
  const product = getProduct(slug)
  if (!product) throw new PricingError(`Unknown product: ${slug}`)
  switch (product.kind) {
    case 'cake':
      return Math.max(
        ...(Object.keys(product.halfKgPrices) as FlavourId[]).flatMap((f) => [
          cakeBasePrice('one-kg', f),
          cakeBasePrice('bone-one-kg', f),
        ]),
      )
    case 'mini-cake':
      return Math.max(...Object.values(product.prices))
    case 'dognuts':
    case 'cupcakes':
      return Math.max(...product.packs.map((p) => p.nonVeg))
    default:
      return Math.max(...product.variants.map((v) => v.price))
  }
}

function sum(base: PriceLine, extras: PriceLine[]) {
  return base.amount + extras.reduce((n, e) => n + e.amount, 0)
}

function dedupe(parts: string[]) {
  return parts.filter((p, i) => parts.findIndex((q) => q.toLowerCase() === p.toLowerCase()) === i)
}
