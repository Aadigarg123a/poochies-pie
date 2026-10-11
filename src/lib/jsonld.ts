/**
 * Structured data (schema.org JSON-LD). Facts only: no address (not
 * provided), no ratings or reviews (none supplied), prices from menu.ts.
 */
import type { FaqItem } from '@/data/faq'
import { PRODUCTS, type Product } from '@/data/menu'
import { FACTS, SITE } from '@/data/site'
import { fromPrice, toPrice } from './pricing'

const abs = (path: string) => `${SITE.url}${path === '/' ? '' : path}`
const BAKERY_ID = `${SITE.url}/#bakery`

export function bakeryJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': BAKERY_ID,
    name: SITE.name,
    description: SITE.description,
    url: abs('/'),
    logo: abs('/icon.svg'),
    image: abs('/opengraph-image'),
    telephone: SITE.whatsapp.e164,
    sameAs: [SITE.instagram.url, ...(SITE.googleProfileUrl ? [SITE.googleProfileUrl] : [])],
    areaServed: { '@type': 'AdministrativeArea', name: SITE.areaServed },
    servesCuisine: 'Pet bakery',
    hasMenu: abs('/menu'),
    currenciesAccepted: 'INR',
    paymentAccepted: 'Advance online payment',
    knowsAbout: ['Dog birthday cakes', 'Cat cakes', 'Sugar-free pet treats'],
    potentialAction: {
      '@type': 'OrderAction',
      target: abs('/atelier'),
      deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet', 'http://purl.org/goodrelations/v1#DeliveryModePickUp'],
    },
  }
}

export function productJsonLd(product: Product) {
  const low = fromPrice(product.slug)
  const high = toPrice(product.slug)
  const url = abs(`/treats/${product.slug}`)
  const offerBase = {
    priceCurrency: 'INR',
    availability: 'https://schema.org/MadeToOrder',
    url,
    seller: { '@id': BAKERY_ID },
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: `${product.tagline}${product.isFood ? ` ${FACTS.leadTime}` : ''}`,
    url,
    image: abs(`/treats/${product.slug}/opengraph-image`),
    brand: { '@type': 'Brand', name: SITE.name },
    category: product.category,
    offers:
      low === high
        ? { '@type': 'Offer', price: low, ...offerBase }
        : { '@type': 'AggregateOffer', lowPrice: low, highPrice: high, offerCount: offerCount(product), ...offerBase },
  }
}

function offerCount(p: Product): number {
  switch (p.kind) {
    case 'cake':
      return Object.keys(p.halfKgPrices).length * 3
    case 'mini-cake':
      return Object.keys(p.prices).length
    case 'dognuts':
    case 'cupcakes':
      return p.packs.length * 2
    default:
      return p.variants.length
  }
}

export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  }
}

export function menuJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE.name} menu`,
    itemListElement: PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(`/treats/${p.slug}`),
      name: p.name,
    })),
  }
}
