import type { Metadata } from 'next'
import { pageMeta } from '@/lib/metadata'
import { AddItemButton } from '@/components/pawrty/AddItemButton'
import { BundleCard } from '@/components/pawrty/BundleCard'
import { ButtonLink } from '@/components/ui/Button'
import { PriceRow } from '@/components/ui/PriceRow'
import { BUNDLES } from '@/data/bundles'
import { PRODUCTS, type SimpleProduct } from '@/data/menu'

export const metadata: Metadata = pageMeta({
  title: 'Pawrty Planner: dog birthday party sets in Delhi',
  description:
    'Plan a dog birthday party in Delhi: a made-to-order cake, Happy Birthday cap, birthday bandana and Rainbow Cupcakes for the guest pets, plus bows, bandanas and bow-ties.',
  path: '/pawrty',
})

const accessories = PRODUCTS.filter((p): p is (typeof PRODUCTS)[number] & SimpleProduct => p.kind === 'accessory')

export default function PawrtyPage() {
  return (
    <div className="container-page page-x">
      <header className="max-w-3xl pb-14 pt-12 sm:pt-16">
        <p className="label">Pawrty Planner</p>
        <h1 className="mt-5 text-display">
          Throw a <em className="font-light">proper</em> pawrty<span className="text-rose">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Three sets to start from. Choose the flavours and sizes; the total is simply the sum of our menu prices. Want a name
          banner or a face on the cake? Build it in the Atelier, then add the cap and bandana below.
        </p>
      </header>

      <div className="space-y-20 pb-24">
        {BUNDLES.map((b, i) => (
          <BundleCard key={b.id} bundle={b} index={i} />
        ))}
      </div>

      <section aria-labelledby="accessories-title" className="border-t hairline py-20">
        <div className="grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-16">
          <div>
            <p className="label">The finishing touches</p>
            <h2 id="accessories-title" className="mt-3 text-title">
              Accessories
            </h2>
            <p className="mt-4 text-muted">Caps, bandanas, bows and bow-ties for the birthday portrait.</p>
            <div className="mt-8">
              <ButtonLink href="/atelier" variant="secondary" arrow>
                Build the cake
              </ButtonLink>
            </div>
          </div>
          <div className="space-y-10">
            {accessories.map((p) => (
              <div key={p.slug}>
                <h3 className="border-b border-oxblood pb-2 font-display text-2xl text-oxblood">{p.name}</h3>
                <ul>
                  {p.variants.map((v) => (
                    <li key={v.id} className="flex items-center gap-4">
                      <PriceRow name={p.variants.length > 1 ? v.name : p.name} price={v.price} className="min-w-0 flex-1" />
                      <AddItemButton config={{ kind: 'item', slug: p.slug, variantId: v.id }} label={`${p.name}, ${v.name}`} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="gift-title" className="mb-24 bg-oxblood px-6 py-14 text-cream sm:px-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="label !text-blush">For someone else&rsquo;s pet</p>
            <h2 id="gift-title" className="mt-3 text-title !text-cream">
              Gift a <em className="font-light">Pup-cake.</em>
            </h2>
            <p className="mt-4 text-cream/85">
              Build a cake, add the lucky pet&rsquo;s details and a note from you. We&rsquo;ll take it from there on WhatsApp.
            </p>
          </div>
          <ButtonLink href="/atelier?gift=1" variant="light" size="lg" arrow>
            Send a gift
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
