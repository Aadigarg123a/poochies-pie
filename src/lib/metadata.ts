import type { Metadata } from 'next'
import { SITE } from '@/data/site'

/** Per-page metadata with matching canonical, Open Graph and Twitter fields. */
export function pageMeta({ title, description, path, noindex }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  const full = `${title} · ${SITE.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: SITE.name, locale: SITE.locale, url: path, title: full, description },
    twitter: { card: 'summary_large_image', title: full, description },
    ...(noindex ? { robots: { index: false } } : {}),
  }
}
