import { describe, expect, it } from 'vitest'
import { FAQ } from '@/data/faq'
import { PRODUCTS, getProduct } from '@/data/menu'
import { bakeryJsonLd, breadcrumbJsonLd, faqJsonLd, productJsonLd } from '@/lib/jsonld'

describe('structured data', () => {
  it('Bakery has facts only: phone, Instagram, area, no address or ratings', () => {
    const b = bakeryJsonLd() as Record<string, unknown>
    expect(b['@type']).toBe('Bakery')
    expect(b.telephone).toBe('+919810015052')
    expect(b.sameAs).toContain('https://www.instagram.com/poochiespie/')
    expect(b).not.toHaveProperty('address')
    expect(b).not.toHaveProperty('aggregateRating')
    expect(b).not.toHaveProperty('review')
    expect(b).not.toHaveProperty('openingHours')
  })

  it('every product has an INR offer drawn from the menu', () => {
    for (const p of PRODUCTS) {
      const j = productJsonLd(p) as { offers: Record<string, unknown> }
      expect(j.offers.priceCurrency).toBe('INR')
      expect(j.offers.availability).toBe('https://schema.org/MadeToOrder')
      expect(j).not.toHaveProperty('aggregateRating')
    }
    const cake = productJsonLd(getProduct('celebration-cake')!) as { offers: Record<string, unknown> }
    expect(cake.offers).toMatchObject({ '@type': 'AggregateOffer', lowPrice: 1100, highPrice: 2150 })
    const cap = productJsonLd(getProduct('happy-birthday-cap')!) as { offers: Record<string, unknown> }
    expect(cap.offers).toMatchObject({ '@type': 'Offer', price: 50 })
  })

  it('FAQPage mirrors the FAQ and breadcrumbs are absolute and ordered', () => {
    const f = faqJsonLd(FAQ) as { mainEntity: unknown[] }
    expect(f.mainEntity).toHaveLength(FAQ.length)
    const b = breadcrumbJsonLd([
      { name: 'Menu', path: '/menu' },
      { name: 'Cakes', path: '/treats/celebration-cake' },
    ]) as { itemListElement: { position: number; item: string }[] }
    expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2])
    expect(b.itemListElement[0].item).toMatch(/^https:\/\/.+\/menu$/)
  })
})
