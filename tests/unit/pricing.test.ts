import { describe, expect, it } from 'vitest'
import { PricingError, cakeBasePrice, fromPrice, priceCake, priceItem, priceLine, pricePack } from '@/lib/pricing'

describe('cake builder pricing', () => {
  it('½ kg Mutton Delight + Name Banner + Paw Design = 1250 + 100 + 60 = 1410', () => {
    const p = priceCake({
      kind: 'cake',
      size: 'half-kg',
      flavour: 'mutton-delight',
      frosting: 'cream-cheese',
      addOns: ['name-banner', 'paw-design'],
      bannerText: 'Bruno',
    })
    expect(p.total).toBe(1410)
    expect(p.base.amount).toBe(1250)
    expect(p.extras).toEqual([
      { label: 'Paw Design', amount: 60 },
      { label: 'Name Banner', amount: 100 },
    ])
  })

  it('Mini Going Bananas + Full Face = 700 + 100 = 800 (mini add-on prices)', () => {
    const p = priceCake({ kind: 'cake', size: 'mini', flavour: 'going-bananas', frosting: 'cream-cheese', addOns: ['full-face'] })
    expect(p.total).toBe(800)
  })

  it('1 kg Carrot Twist = 1100 + 800 = 1900', () => {
    expect(priceCake({ kind: 'cake', size: 'one-kg', flavour: 'carrot-twist', frosting: 'cream-cheese', addOns: [] }).total).toBe(1900)
  })

  it('Bone-shaped 1 kg Carrot Twist = ½ kg 1100 + 900 = 2000', () => {
    expect(cakeBasePrice('bone-one-kg', 'carrot-twist')).toBe(2000)
  })

  it('1 kg and bone cakes use the ½ kg add-on prices', () => {
    const p = priceCake({ kind: 'cake', size: 'one-kg', flavour: 'going-bananas', frosting: 'curd-sweet-potato', addOns: ['mini-face'] })
    expect(p.total).toBe(1100 + 800 + 100)
  })

  it('mini name banner is +50, ½ kg name banner is +100', () => {
    const base = { kind: 'cake', flavour: 'going-bananas', frosting: 'cream-cheese', addOns: ['name-banner'], bannerText: 'Coco' } as const
    expect(priceCake({ ...base, addOns: [...base.addOns], size: 'mini' }).total).toBe(750)
    expect(priceCake({ ...base, addOns: [...base.addOns], size: 'half-kg' }).total).toBe(1200)
  })

  it('Mini Face and Full Face are mutually exclusive', () => {
    expect(() =>
      priceCake({ kind: 'cake', size: 'half-kg', flavour: 'going-bananas', frosting: 'cream-cheese', addOns: ['mini-face', 'full-face'] }),
    ).toThrow(PricingError)
  })

  it('a name banner needs a name', () => {
    expect(() =>
      priceCake({ kind: 'cake', size: 'half-kg', flavour: 'going-bananas', frosting: 'cream-cheese', addOns: ['name-banner'], bannerText: ' ' }),
    ).toThrow(/name/)
  })

  it('frosting never changes the price', () => {
    const a = priceCake({ kind: 'cake', size: 'half-kg', flavour: 'mango-masti', frosting: 'cream-cheese', addOns: [] })
    const b = priceCake({ kind: 'cake', size: 'half-kg', flavour: 'mango-masti', frosting: 'curd-sweet-potato', addOns: [] })
    expect(a.total).toBe(b.total)
  })
})

describe('packs', () => {
  it('Rainbow Cupcakes Box of 6 Non-veg with 6 faces = 1100 + 300 = 1400', () => {
    expect(pricePack({ kind: 'cupcakes', count: 6, flavour: 'chicken-farmhouse', faces: 6 }).total).toBe(1400)
  })

  it('Cupcakes: faces cannot exceed the box', () => {
    expect(() => pricePack({ kind: 'cupcakes', count: 4, flavour: 'carrot-twist', faces: 5 })).toThrow(PricingError)
  })

  it('Dognuts price follows the flavour diet', () => {
    expect(pricePack({ kind: 'dognuts', count: 4, flavour: 'pumpkin-lava' }).total).toBe(700)
    expect(pricePack({ kind: 'dognuts', count: 4, flavour: 'chicken-overloaded' }).total).toBe(750)
  })

  it('Dognuts have no face add-on', () => {
    expect(() => pricePack({ kind: 'dognuts', count: 2, flavour: 'going-bananas', faces: 1 })).toThrow(PricingError)
  })

  it('rejects pack sizes that are not on the menu', () => {
    expect(() => pricePack({ kind: 'dognuts', count: 3, flavour: 'going-bananas' })).toThrow(PricingError)
  })
})

describe('items', () => {
  it('prices a variant', () => {
    expect(priceItem({ kind: 'item', slug: 'tuxedo-bandana', variantId: 'large' }).total).toBe(500)
  })

  it('requires an ice-cream flavour', () => {
    expect(() => priceItem({ kind: 'item', slug: 'pup-icecream', variantId: '500-ml' })).toThrow(PricingError)
    expect(priceLine({ kind: 'item', slug: 'pup-icecream', variantId: '500-ml', option: 'Mango' }).total).toBe(500)
  })

  it('"from" prices', () => {
    expect(fromPrice('celebration-cake')).toBe(1100)
    expect(fromPrice('special-mini-cake')).toBe(700)
    expect(fromPrice('rainbow-cupcakes')).toBe(750)
    expect(fromPrice('happy-birthday-cap')).toBe(50)
  })
})
