import { describe, expect, it } from 'vitest'
import {
  CAKE,
  CAKE_SIZE_RULES,
  CUPCAKES,
  DOGNUTS,
  FLAVOURS,
  HALF_KG_ADD_ONS,
  MINI_ADD_ONS,
  MINI_CAKE,
  PRODUCTS,
  SHARED_FLAVOUR_IDS,
  getFlavour,
  getProduct,
} from '@/data/menu'
import { validateMenu } from '@/data/menu.schema'
import * as E from './expected-menu'

const byName = (name: string) => {
  const f = FLAVOURS.find((x) => x.name === name)
  if (!f) throw new Error(`Flavour missing from menu.ts: ${name}`)
  return f
}

describe('menu.ts matches the printed menu exactly', () => {
  it('passes Zod validation', () => {
    const result = validateMenu()
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues, null, 2)).toBe(true)
  })

  it('½ kg cakes: every flavour, diet and price', () => {
    expect(FLAVOURS).toHaveLength(Object.keys(E.EXPECTED_HALF_KG_CAKES).length)
    for (const [name, { diet, price }] of Object.entries(E.EXPECTED_HALF_KG_CAKES)) {
      const f = byName(name)
      expect(f.diet, name).toBe(diet)
      expect(CAKE.halfKgPrices[f.id], name).toBe(price)
    }
  })

  it('½ kg add-ons and size surcharges', () => {
    expect(Object.fromEntries(HALF_KG_ADD_ONS.map((a) => [a.name, a.price]))).toEqual(E.EXPECTED_HALF_KG_ADD_ONS)
    expect(CAKE_SIZE_RULES.oneKgSurcharge).toBe(E.EXPECTED_ONE_KG_SURCHARGE)
    expect(CAKE_SIZE_RULES.boneSurcharge).toBe(E.EXPECTED_BONE_SURCHARGE)
    expect(CAKE_SIZE_RULES.boneBasis).toBe('half-kg')
  })

  it('Special Mini Cakes: every flavour and price', () => {
    for (const [name, price] of Object.entries(E.EXPECTED_MINI_CAKES)) {
      expect(MINI_CAKE.prices[byName(name).id], name).toBe(price)
    }
    expect(Object.keys(MINI_CAKE.prices)).toHaveLength(Object.keys(E.EXPECTED_MINI_CAKES).length)
  })

  it('mini add-ons use their own (different) prices', () => {
    expect(Object.fromEntries(MINI_ADD_ONS.map((a) => [a.name, a.price]))).toEqual(E.EXPECTED_MINI_ADD_ONS)
  })

  it('shared flavour list for Dognuts and Cupcakes', () => {
    const names = SHARED_FLAVOUR_IDS.map((id) => getFlavour(id))
    expect(names.filter((f) => f.diet === 'veg').map((f) => f.name).sort()).toEqual([...E.EXPECTED_SHARED_FLAVOURS.veg].sort())
    expect(names.filter((f) => f.diet === 'non-veg').map((f) => f.name).sort()).toEqual(
      [...E.EXPECTED_SHARED_FLAVOURS.nonVeg].sort(),
    )
  })

  it('Crazy Dognuts packs', () => {
    expect(DOGNUTS.packs).toEqual(E.EXPECTED_DOGNUTS)
  })

  it('Rainbow Cupcakes boxes and face add-on', () => {
    expect(CUPCAKES.packs).toEqual(E.EXPECTED_CUPCAKES)
    expect(CUPCAKES.facePerPiece).toBe(E.EXPECTED_CUPCAKE_FACE_EACH)
  })

  it('treats and accessories: every variant and price', () => {
    for (const [slug, variants] of Object.entries(E.EXPECTED_SIMPLE_ITEMS)) {
      const p = getProduct(slug)
      expect(p, slug).toBeDefined()
      if (!p || (p.kind !== 'treat' && p.kind !== 'accessory')) throw new Error(`${slug} has the wrong kind`)
      expect(p.variants.map((v) => [v.name, v.price]), slug).toEqual(variants)
    }
  })

  it('Pup-icecream flavours', () => {
    const p = getProduct('pup-icecream')
    expect(p?.kind === 'treat' && p.options?.values).toEqual(E.EXPECTED_ICECREAM_FLAVOURS)
  })

  it('has no products beyond the printed menu', () => {
    const known = new Set(['celebration-cake', 'special-mini-cake', 'crazy-dognuts', 'rainbow-cupcakes', ...Object.keys(E.EXPECTED_SIMPLE_ITEMS)])
    expect(PRODUCTS.map((p) => p.slug).filter((s) => !known.has(s))).toEqual([])
    expect(PRODUCTS).toHaveLength(known.size)
  })

  it('species: only the beer and the cat bow-tie are confirmed for cats', () => {
    const forCats = PRODUCTS.filter((p) => (p.species as readonly string[]).includes('cat')).map((p) => p.slug)
    expect(forCats.sort()).toEqual(['cat-bow-tie', 'pet-friendly-beer'])
  })
})
