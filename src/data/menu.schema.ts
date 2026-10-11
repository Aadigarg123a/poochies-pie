/**
 * Structural validation for menu.ts. Runs before every build
 * (scripts/validate-menu.ts) and in the unit tests.
 */
import { z } from 'zod'
import {
  CAKE_SIZE_RULES,
  CATEGORIES,
  FLAVOURS,
  FROSTINGS,
  HALF_KG_ADD_ONS,
  MINI_ADD_ONS,
  PRODUCTS,
  SHARED_FLAVOUR_IDS,
} from './menu'

const price = z.int().positive().max(100_000)
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
const flavourIds = FLAVOURS.map((f) => f.id) as [string, ...string[]]
const flavourPrices = z.record(z.enum(flavourIds), price)

const flavour = z.object({
  id: slug,
  name: z.string().min(1),
  diet: z.enum(['veg', 'non-veg']),
  proteins: z.array(z.enum(['chicken', 'mutton', 'fish'])),
  note: z.string().min(1),
})

const addOn = z.object({
  id: z.enum(['cheese', 'coconut', 'paw-design', 'mini-face', 'full-face', 'name-banner']),
  name: z.string().min(1),
  price,
  exclusiveGroup: z.literal('face').optional(),
})

const addOnList = z
  .array(addOn)
  .length(6)
  .refine((list) => new Set(list.map((a) => a.id)).size === list.length, 'Duplicate add-on id')
  .refine(
    (list) => list.filter((a) => a.exclusiveGroup === 'face').map((a) => a.id).sort().join() === 'full-face,mini-face',
    'Mini Face and Full Face must be the (only) exclusive face pair',
  )

const base = {
  slug,
  name: z.string().min(1),
  category: z.enum(CATEGORIES.map((c) => c.id) as [string, ...string[]]),
  tagline: z.string().min(1),
  species: z.array(z.enum(['dog', 'cat'])).min(1),
  diet: z.enum(['veg', 'non-veg', 'by-flavour']).nullable(),
  proteins: z.array(z.enum(['chicken', 'mutton', 'fish'])),
  isFood: z.boolean(),
  frosted: z.boolean(),
  baked: z.boolean(),
}

const variant = z.object({ id: slug, name: z.string().min(1), price })

const product = z.discriminatedUnion('kind', [
  z.object({ ...base, kind: z.literal('cake'), halfKgPrices: flavourPrices }),
  z.object({ ...base, kind: z.literal('mini-cake'), weight: z.string(), prices: flavourPrices }),
  z.object({
    ...base,
    kind: z.enum(['dognuts', 'cupcakes']),
    packLabel: z.enum(['Pack', 'Box']),
    packs: z.array(z.object({ count: z.int().positive(), veg: price, nonVeg: price })).min(1),
    facePerPiece: price.optional(),
  }),
  z.object({
    ...base,
    kind: z.enum(['treat', 'accessory']),
    variants: z
      .array(variant)
      .min(1)
      .refine((v) => new Set(v.map((x) => x.id)).size === v.length, 'Duplicate variant id'),
    options: z.object({ label: z.string(), values: z.array(z.string().min(1)).min(1) }).optional(),
    servedWith: z.string().optional(),
    facts: z.array(z.string()).optional(),
  }),
])

export const MenuSchema = z
  .object({
    flavours: z.array(flavour).min(1),
    sharedFlavourIds: z.array(z.enum(flavourIds)).min(1),
    frostings: z.array(z.object({ id: slug, name: z.string(), description: z.string() })).length(2),
    halfKgAddOns: addOnList,
    miniAddOns: addOnList,
    cakeSizeRules: z.object({ oneKgSurcharge: price, boneSurcharge: price, boneBasis: z.enum(['half-kg', 'one-kg']) }),
    products: z.array(product).min(1),
  })
  .superRefine((menu, ctx) => {
    const unique = (values: string[], what: string) => {
      const dupes = values.filter((v, i) => values.indexOf(v) !== i)
      if (dupes.length) ctx.addIssue({ code: 'custom', message: `Duplicate ${what}: ${dupes.join(', ')}` })
    }
    unique(menu.flavours.map((f) => f.id), 'flavour id')
    unique(menu.products.map((p) => p.slug), 'product slug')
    for (const f of menu.flavours) {
      if (f.diet === 'veg' && f.proteins.length) {
        ctx.addIssue({ code: 'custom', message: `${f.name} is veg but lists meat/fish` })
      }
      if (f.diet === 'non-veg' && !f.proteins.length) {
        ctx.addIssue({ code: 'custom', message: `${f.name} is non-veg but lists no protein` })
      }
    }
    for (const p of menu.products) {
      if (p.kind === 'dognuts' || p.kind === 'cupcakes') {
        for (const pack of p.packs) {
          if (pack.nonVeg < pack.veg) ctx.addIssue({ code: 'custom', message: `${p.name}: non-veg cheaper than veg?` })
        }
      }
      if (p.diet === 'veg' && p.proteins.length) {
        ctx.addIssue({ code: 'custom', message: `${p.name} is veg but lists meat/fish` })
      }
    }
  })

export function validateMenu() {
  return MenuSchema.safeParse({
    flavours: FLAVOURS,
    sharedFlavourIds: SHARED_FLAVOUR_IDS,
    frostings: FROSTINGS,
    halfKgAddOns: HALF_KG_ADD_ONS,
    miniAddOns: MINI_ADD_ONS,
    cakeSizeRules: CAKE_SIZE_RULES,
    products: PRODUCTS,
  })
}
