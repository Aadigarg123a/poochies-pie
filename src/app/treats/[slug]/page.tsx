import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IngredientCard } from '@/components/product/IngredientCard'
import { ProductConfigurator } from '@/components/product/ProductConfigurator'
import { PawfileProductFlags } from '@/components/pawfile/PawfileFlags'
import { DietMark } from '@/components/ui/Badges'
import { ButtonLink } from '@/components/ui/Button'
import { ProductCard, DietSummary } from '@/components/ui/ProductCard'
import { ProductImage } from '@/components/ui/ProductImage'
import {
  CAKE_SIZE_RULES,
  CATEGORIES,
  FLAVOURS,
  HALF_KG_ADD_ONS,
  MINI_ADD_ONS,
  PRODUCTS,
  getProduct,
  type Product,
} from '@/data/menu'
import { whatsappLink } from '@/data/site'
import { formatINR } from '@/lib/format'
import { cakeBasePrice, fromPrice } from '@/lib/pricing'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/treats/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  const from = formatINR(fromPrice(slug))
  const forWhom = product.species.includes('cat') ? (product.species.includes('dog') ? 'dogs & cats' : 'cats') : 'dogs'
  return {
    title: `${product.name} for ${forWhom}, from ${from}`,
    description: `${product.name} by Poochie’s Pie, Delhi: ${product.tagline} From ${from}. Made to order${product.isFood ? ' with no sugar, salt, cocoa or preservatives' : ''}.`,
    alternates: { canonical: `/treats/${slug}` },
  }
}

function speciesLine(p: Product) {
  if (p.species.includes('dog') && p.species.includes('cat')) return 'For dogs & cats'
  if (p.species.includes('cat')) return 'For cats'
  return 'For dogs · Cats: ask us on WhatsApp'
}

export default async function ProductPage({ params }: PageProps<'/treats/[slug]'>) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const category = CATEGORIES.find((c) => c.id === product.category)!
  const related = (PRODUCTS as readonly Product[])
    .filter((p) => p.slug !== slug && (p.category === product.category || (product.isFood ? !p.isFood : p.isFood)))
    .slice(0, 3)
  const isCake = product.kind === 'cake' || product.kind === 'mini-cake'

  return (
    <div className="container-page page-x">
      <nav aria-label="Breadcrumb" className="pt-8 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/menu" className="underline-offset-4 hover:underline">
              Menu
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/menu?c=${category.id}`} className="underline-offset-4 hover:underline">
              {category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 pb-20 pt-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductImage slug={product.slug} name={product.name} caption={category.name} aspect="portrait" sizes="(min-width: 1024px) 45vw, 100vw" preload />
        </div>

        <div>
          <p className="label">{category.name}</p>
          <h1 className="mt-4 text-title">{product.name}</h1>
          <p className="mt-4 text-lg text-muted">{product.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="price text-2xl text-oxblood">
              <span className="mr-1 font-sans text-xs uppercase tracking-[0.14em] text-muted">from</span>
              {formatINR(fromPrice(slug))}
            </p>
            <DietSummary product={product} />
            <span className="text-sm text-muted">{speciesLine(product)}</span>
            <PawfileProductFlags slug={slug} />
          </div>
          {product.kind === 'treat' && (product.servedWith || product.facts?.length) ? (
            <p className="mt-4 text-[0.9375rem]">
              {product.servedWith ? `Served with a ${product.servedWith}. ` : null}
              {product.facts?.join(' · ')}
            </p>
          ) : null}

          <div className="mt-10">
            {product.kind === 'cake' ? <CakeGrid /> : null}
            {product.kind === 'mini-cake' ? <MiniGrid prices={product.prices} /> : null}
            {isCake ? (
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href={product.kind === 'mini-cake' ? '/atelier?size=mini' : '/atelier'} size="lg" magnetic arrow>
                  Build it in the Atelier
                </ButtonLink>
                <ButtonLink href="/atelier?gift=1" variant="ghost">
                  Send as a gift
                </ButtonLink>
              </div>
            ) : (
              <ProductConfigurator slug={slug} />
            )}
          </div>

          <div className="mt-12">
            <IngredientCard product={product} />
          </div>
          <p className="mt-6 text-sm text-muted">
            Something special in mind?{' '}
            <a href={whatsappLink(`Hello Poochie's Pie! A question about the ${product.name}.`)} className="font-semibold text-oxblood underline underline-offset-4">
              Ask us on WhatsApp
            </a>
            . Customisation is available on request.
          </p>
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t hairline py-20">
          <h2 id="related-title" className="text-title">
            You may also <em className="font-light">like</em>
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function CakeGrid() {
  return (
    <div>
      <table className="w-full border-collapse text-left">
        <caption className="mb-3 text-left font-display text-2xl text-oxblood">Prices by size</caption>
        <thead>
          <tr className="border-b border-oxblood">
            <th scope="col" className="label py-2">
              Flavour
            </th>
            <th scope="col" className="label py-2 text-right">
              ½ kg
            </th>
            <th scope="col" className="label py-2 text-right">
              1 kg
            </th>
            <th scope="col" className="label py-2 text-right">
              Bone 1 kg
            </th>
          </tr>
        </thead>
        <tbody>
          {FLAVOURS.map((f) => (
            <tr key={f.id} className="border-b border-dotted border-field/50">
              <th scope="row" className="py-3 pr-2 font-display text-base font-normal italic sm:text-lg">
                <span className="inline-flex items-center gap-2">
                  {f.name} <DietMark diet={f.diet} showLabel={false} />
                </span>
              </th>
              <td className="price py-3 text-right text-oxblood">{formatINR(cakeBasePrice('half-kg', f.id))}</td>
              <td className="price py-3 text-right text-oxblood">{formatINR(cakeBasePrice('one-kg', f.id))}</td>
              <td className="price py-3 text-right text-oxblood">{formatINR(cakeBasePrice('bone-one-kg', f.id))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-muted">
        1 kg = ½ kg price + {formatINR(CAKE_SIZE_RULES.oneKgSurcharge)}. Bone-shaped is made only at 1 kg: ½ kg price +{' '}
        {formatINR(CAKE_SIZE_RULES.boneSurcharge)}.
      </p>
      <AddOns list={HALF_KG_ADD_ONS} title="Finishing touches · ½ kg & 1 kg" />
    </div>
  )
}

function MiniGrid({ prices }: { prices: Record<string, number> }) {
  return (
    <div>
      <ul>
        {FLAVOURS.map((f) => (
          <li key={f.id} className="flex items-baseline justify-between gap-3 border-b border-dotted border-field/50 py-3">
            <span className="inline-flex items-center gap-2 font-display text-lg italic">
              {f.name} <DietMark diet={f.diet} showLabel={false} />
            </span>
            <span className="price text-lg text-oxblood">{formatINR(prices[f.id])}</span>
          </li>
        ))}
      </ul>
      <AddOns list={MINI_ADD_ONS} title="Finishing touches · Mini cakes" />
    </div>
  )
}

function AddOns({ list, title }: { list: readonly { id: string; name: string; price: number }[]; title: string }) {
  return (
    <div className="mt-8 rounded-[2px] bg-linen/70 p-5">
      <h2 className="label">{title}</h2>
      <ul className="mt-3 grid gap-x-8 gap-y-2 text-[0.9375rem] sm:grid-cols-2">
        {list.map((a) => (
          <li key={a.id} className="flex justify-between gap-3">
            <span>{a.name}</span>
            <span className="price">+{formatINR(a.price)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">Mini Face and Full Face are either/or.</p>
    </div>
  )
}
