import { describe, expect, it } from 'vitest'
import { PRODUCTS, SHARED_FLAVOUR_IDS, getProduct } from '@/data/menu'
import { DEFAULT_FILTERS, filtersToQuery, flavourVisible, parseFilters, productVisible } from '@/lib/menuFilters'
import type { Pawfile } from '@/stores/pawfile'

const q = (s: string) => parseFilters(new URLSearchParams(s))

describe('menu filters', () => {
  it('round-trips through the URL and ignores junk', () => {
    const f = q('c=dognuts&pet=cat&diet=veg&safe=1')
    expect(f).toEqual({ category: 'dognuts', pet: 'cat', diet: 'veg', safe: true })
    expect(filtersToQuery(f)).toBe('?c=dognuts&pet=cat&diet=veg&safe=1')
    expect(q('c=pizza&pet=parrot&diet=keto')).toEqual(DEFAULT_FILTERS)
  })

  it('cat filter shows only items confirmed for cats', () => {
    const visible = PRODUCTS.filter((p) => productVisible(p, q('pet=cat'), null)).map((p) => p.slug)
    expect(visible.sort()).toEqual(['cat-bow-tie', 'pet-friendly-beer'])
  })

  it('veg filter keeps by-flavour products with veg flavours and drops non-veg items', () => {
    const f = q('diet=veg')
    expect(productVisible(getProduct('crazy-dognuts')!, f, null, SHARED_FLAVOUR_IDS)).toBe(true)
    expect(productVisible(getProduct('pet-friendly-beer')!, f, null)).toBe(false)
    expect(productVisible(getProduct('protein-idlis')!, f, null)).toBe(true)
    expect(flavourVisible('chicken-farmhouse', f, null)).toBe(false)
  })

  it('"safe for my pet" hides conflicting flavours and items', () => {
    const pet: Pawfile = { name: 'Bruno', species: 'dog', breedSize: null, birthday: null, allergies: ['chicken'], allergyNotes: '' }
    const f = q('safe=1')
    expect(flavourVisible('chicken-overloaded', f, pet)).toBe(false)
    expect(flavourVisible('mutton-delight', f, pet)).toBe(true)
    expect(productVisible(getProduct('pet-friendly-beer')!, f, pet)).toBe(false)
    expect(productVisible(getProduct('rainbow-cupcakes')!, f, pet, SHARED_FLAVOUR_IDS)).toBe(true)
  })
})
