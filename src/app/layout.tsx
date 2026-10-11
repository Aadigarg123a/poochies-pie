import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope, Pacifico } from 'next/font/google'
import { ClientRuntime } from '@/components/layout/ClientRuntime'
import { ConciergeButton } from '@/components/layout/ConciergeButton'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SITE } from '@/data/site'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const pacifico = Pacifico({
  subsets: ['latin'],
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
  },
  twitter: { card: 'summary_large_image' },
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
          className="sr-only z-50 rounded-sm bg-oxblood px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
        <Analytics />
      </body>
    </html>
  )
}
