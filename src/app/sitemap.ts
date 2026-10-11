import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/data/menu'
import { SITE } from '@/data/site'

/** Bump when content changes meaningfully (kept static: no build-time clock). */
const LAST_UPDATED = '2026-10-11'

const PAGES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/menu', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/atelier', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pawrty', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/how-to-order', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: `${SITE.url}${p.path}`, lastModified: LAST_UPDATED, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE.url}/treats/${p.slug}`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: p.isFood ? 0.8 : 0.5,
    })),
  ]
}
