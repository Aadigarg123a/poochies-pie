import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { ClientRuntime } from '@/components/layout/ClientRuntime'
import { ConciergeButton } from '@/components/layout/ConciergeButton'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE } from '@/data/site'
import { bakeryJsonLd } from '@/lib/jsonld'
import './globals.css'

// All fonts are subset to the site's characters (scripts/fetch-fonts.mjs)
// so the critical font payload stays small on mobile. One file per style covers 300–400.
const fraunces = localFont({
  src: [
    { path: '../fonts/fraunces-400.woff2', weight: '300 400', style: 'normal' },
    { path: '../fonts/fraunces-300-italic.woff2', weight: '300 400', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
})

const manrope = localFont({
  src: '../fonts/manrope-400-600.woff2',
  weight: '400 600',
  variable: '--font-manrope',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

const pacifico = localFont({
  src: '../fonts/pacifico-wordmark.woff2',
  weight: '400',
  variable: '--font-pacifico',
  display: 'swap',
})

/** Every route must prerender completely (asserted in dev and at build). */
export const ensureStatic = 'navigation'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Poochie's Pie · Haute pâtisserie for pets in Delhi",
    template: "%s · Poochie's Pie",
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    url: '/',
    title: "Poochie's Pie · Haute pâtisserie for pets in Delhi",
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image', title: "Poochie's Pie · Haute pâtisserie for pets in Delhi", description: SITE.description },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#fdf8f2',
  colorScheme: 'light',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${manrope.variable} ${pacifico.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="fixed left-4 top-[-6rem] z-50 rounded-sm bg-oxblood px-5 py-3 text-sm font-semibold text-cream transition-[top] focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ConciergeButton />
        <ClientRuntime />
        <JsonLd data={bakeryJsonLd()} />
      </body>
    </html>
  )
}
