import { describe, expect, it } from 'vitest'
import { FLAVOURS, PRODUCTS, getProduct } from '@/data/menu'
import { avoidFlavourCount, flavourConflicts, productConflicts } from '@/lib/pawfile'
import type { Pawfile } from '@/stores/pawfile'

const bruno: Pawfile = {
  name: 'Bruno',
  species: 'dog',
  breedSize: 'large',
  birthday: null,
  allergies: ['chicken'],
  allergyNotes: '',
}

describe('Pawfile flags', () => {
  it('a pet with a chicken allergy sees every chicken item flagged', () => {
    const flaggedFlavours = FLAVOURS.filter((f) => flavourConflicts(f.id, bruno).length).map((f) => f.name)
    expect(flaggedFlavours).toEqual(['Chicken Overloaded', 'Chicken Farmhouse'])

    const flaggedProducts = PRODUCTS.filter((p) => productConflicts(p, bruno).some((c) => c.kind === 'allergy')).map((p) => p.slug)
    expect(flaggedProducts).toEqual(['pet-friendly-beer'])

    expect(flavourConflicts('chicken-overloaded', bruno)[0].message).toBe('Contains chicken: Bruno is allergic')
  })

  it('does not flag veg flavours or other proteins', () => {
    expect(flavourConflicts('carrot-twist', bruno)).toEqual([])
    expect(flavourConflicts('mutton-delight', bruno)).toEqual([])
    expect(flavourConflicts('somethings-fishy', { ...bruno, allergies: ['fish'] })).toHaveLength(1)
  })

  it('counts flavours to avoid', () => {
    expect(avoidFlavourCount(FLAVOURS.map((f) => f.id), { ...bruno, allergies: ['chicken', 'fish'] })).toBe(3)
  })

  it('flags species: cats see unconfirmed items; dogs see cat-only items', () => {
    const luna: Pawfile = { ...bruno, name: 'Luna', species: 'cat', allergies: [] }
    expect(productConflicts(getProduct('celebration-cake')!, luna)[0].kind).toBe('species')
    expect(productConflicts(getProduct('pet-friendly-beer')!, luna)).toEqual([])
    expect(productConflicts(getProduct('cat-bow-tie')!, bruno)[0].message).toBe('Made for cats')
  })

  it('nothing is flagged without a Pawfile', () => {
    expect(productConflicts(getProduct('pet-friendly-beer')!, null)).toEqual([])
    expect(flavourConflicts('chicken-overloaded', null)).toEqual([])
  })
})
