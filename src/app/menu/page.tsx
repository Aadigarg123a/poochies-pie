import type { Metadata } from 'next'
import { pageMeta } from '@/lib/metadata'
import { Suspense } from 'react'
import { MenuFilters, MenuFiltersFallback } from '@/components/menu/MenuFilters'
import { MenuView } from '@/components/menu/MenuView'
import { NeverInIt } from '@/components/ui/Badges'
import { FACTS } from '@/data/site'
import { JsonLd } from '@/components/seo/JsonLd'
import { menuJsonLd } from '@/lib/jsonld'

export const metadata: Metadata = pageMeta({
  title: 'The Menu: dog & cat cakes, Dognuts, cupcakes and treats',
  description:
    'The full Poochie’s Pie menu with prices in rupees: sugar-free dog birthday cakes in nine flavours, mini cakes, Crazy Dognuts, Rainbow Cupcakes, treats and party accessories. Made to order in Delhi.',
  path: '/menu',
})

export default function MenuPage() {
  return (
    <div className="container-page page-x">
      <JsonLd data={menuJsonLd()} />
      <header className="pb-10 pt-14 sm:pt-20">
        <p className="label">Prices in rupees · Baked to order</p>
        <h1 className="mt-5 text-display">
          The Menu<span className="font-light italic text-rose">.</span>
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <p className="max-w-xl text-lg text-muted">
            Everything is made fresh for your date, for dogs and cats. {FACTS.allergies}
          </p>
          <NeverInIt className="lg:justify-self-end" />
        </div>
      </header>
      <Suspense fallback={<MenuFiltersFallback />}>
        <MenuFilters />
      </Suspense>
      <MenuView />
    </div>
  )
}
