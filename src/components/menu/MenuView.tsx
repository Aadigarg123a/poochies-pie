import Link from 'next/link'
import { PawfileFlavourFlag, PawfileProductFlags } from '@/components/pawfile/PawfileFlags'
import { DietMark } from '@/components/ui/Badges'
import { ArrowIcon } from '@/components/ui/icons'
import { PriceRow } from '@/components/ui/PriceRow'
import { ProductImage } from '@/components/ui/ProductImage'
import {
  CAKE,
  CAKE_SIZE_RULES,
  CATEGORIES,
  CUPCAKES,
  DOGNUTS,
  FLAVOURS,
  HALF_KG_ADD_ONS,
  MINI_ADD_ONS,
  MINI_CAKE,
  PRODUCTS,
  SHARED_FLAVOUR_IDS,
  getFlavour,
  type AddOn,
  type Category,
  type FlavourId,
  type PackProduct,
  type Product,
  type SimpleProduct,
} from '@/data/menu'
import { cn } from '@/lib/cn'
import { formatINR } from '@/lib/format'

const ALL_FLAVOURS = FLAVOURS.map((f) => f.id)

const INTRO: Record<Category, string> = {
  cakes: 'Our celebration cake in nine flavours. Half a kilo, one kilo, or bone-shaped at one kilo.',
  'mini-cakes': 'Every flavour, made petite at 250–300 g. With their own set of finishing touches.',
  dognuts: 'Doughnuts reimagined for dogs, in packs of two, four or six.',
  cupcakes: 'Rainbow Cupcakes by the box, for the guest list.',
  treats: 'Small indulgences between celebrations.',
  accessories: 'The finishing touches for the birthday portrait.',
}

/**
 * The printed tasting menu, rendered once on the server with every item.
 * Filters (MenuFilters) hide rows via data attributes; see hiddenSelectors().
 */
export function MenuView() {
  const sections = CATEGORIES.map((c) => ({
    ...c,
    products: (PRODUCTS as readonly Product[]).filter((p) => p.category === c.id),
  }))

  return (
    <div className="divide-y divide-hairline">
      {sections.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          data-section={section.id}
          aria-labelledby={`menu-${section.id}`}
          className="scroll-mt-36 py-14 sm:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-16">
            <header className="lg:sticky lg:top-40 lg:self-start">
              <p className="label">{String(i + 1).padStart(2, '0')}</p>
              <h2 id={`menu-${section.id}`} className="mt-3 text-title">
                {section.name}
              </h2>
              <p className="mt-4 max-w-sm text-muted">{INTRO[section.id]}</p>
              <ProductImage
                slug={section.products[0].slug}
                name={section.products.length === 1 ? section.products[0].name : section.name}
                aspect="landscape"
                sizes="(min-width: 1024px) 19rem, 100vw"
                className="mt-6 hidden lg:flex"
              />
            </header>
            <div className="min-w-0 space-y-12">
              {section.products.map((p) => (
                <div key={p.slug} data-slug={p.slug}>
                  {p.kind === 'cake' ? <CakeBlock /> : null}
                  {p.kind === 'mini-cake' ? <MiniBlock /> : null}
                  {p.kind === 'dognuts' || p.kind === 'cupcakes' ? <PackBlock product={p} /> : null}
                  {p.kind === 'treat' || p.kind === 'accessory' ? <SimpleBlock product={p} /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

function BlockTitle({ name, href, sub }: { name: string; href: string; sub?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-oxblood pb-3">
      <h3 className="font-display text-2xl text-oxblood">
        <Link href={href} className="underline-offset-4 hover:underline">
          {name}
        </Link>
      </h3>
      {sub ? <p className="label">{sub}</p> : null}
    </div>
  )
}

function FlavourRows({ slug, prices }: { slug: string; prices: Record<FlavourId, number> }) {
  return (
    <ul>
      {ALL_FLAVOURS.map((id) => {
        const f = getFlavour(id)
        return (
          <PriceRow
            key={id}
            as="li"
            dataRow={`${slug}:${id}`}
            name={<span className="italic">{f.name}</span>}
            aside={<DietMark diet={f.diet} showLabel={false} />}
            price={prices[id]}
            detail={
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{f.note}</span>
                <PawfileFlavourFlag flavour={id} />
              </span>
            }
          />
        )
      })}
    </ul>
  )
}

function AddOnList({ title, list }: { title: string; list: readonly AddOn[] }) {
  return (
    <div className="mt-8 rounded-[2px] bg-linen/70 p-5 sm:p-6">
      <h4 className="label">{title}</h4>
      <ul className="mt-2 grid gap-x-10 sm:grid-cols-2">
        {list.map((a) => (
          <PriceRow key={a.id} as="li" name={<span className="text-base sm:text-lg">{a.name}</span>} price={a.price} prefix="+" className="py-1.5" />
        ))}
      </ul>
      {list === HALF_KG_ADD_ONS ? <p className="mt-3 text-sm text-muted">Mini Face and Full Face are either/or.</p> : null}
    </div>
  )
}

function CakeBlock() {
  return (
    <div>
      <BlockTitle name={CAKE.name} href={`/treats/${CAKE.slug}`} sub="½ kg prices" />
      <FlavourRows slug={CAKE.slug} prices={CAKE.halfKgPrices} />
      <dl className="mt-6 grid gap-3 text-[0.9375rem] sm:grid-cols-2">
        <div className="border-l-2 border-blush pl-4">
          <dt className="font-semibold">1 kg cake</dt>
          <dd className="text-muted">½ kg price + {formatINR(CAKE_SIZE_RULES.oneKgSurcharge)}</dd>
        </div>
        <div className="border-l-2 border-blush pl-4">
          <dt className="font-semibold">Bone-shaped 1 kg</dt>
          <dd className="text-muted">
            ½ kg price + {formatINR(CAKE_SIZE_RULES.boneSurcharge)} (made only at 1 kg)
          </dd>
        </div>
      </dl>
      <AddOnList title="Finishing touches · ½ kg & 1 kg cakes" list={HALF_KG_ADD_ONS} />
      <CtaLink href="/atelier">Build your cake</CtaLink>
    </div>
  )
}

function MiniBlock() {
  return (
    <div>
      <BlockTitle name={MINI_CAKE.name} href={`/treats/${MINI_CAKE.slug}`} sub={MINI_CAKE.weight} />
      <FlavourRows slug={MINI_CAKE.slug} prices={MINI_CAKE.prices} />
      <AddOnList title="Finishing touches · Mini cakes" list={MINI_ADD_ONS} />
      <CtaLink href="/atelier?size=mini">Build a mini cake</CtaLink>
    </div>
  )
}

function PackBlock({ product }: { product: PackProduct }) {
  return (
    <div>
      <BlockTitle name={product.name} href={`/treats/${product.slug}`} sub="Flavours from the shared list" />
      <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label={`${product.name} flavours`}>
        {SHARED_FLAVOUR_IDS.map((id) => {
          const f = getFlavour(id)
          return (
            <li key={id} data-row={`${product.slug}:${id}`} className="inline-flex items-center gap-2 font-display text-lg italic">
              <DietMark diet={f.diet} showLabel={false} />
              {f.name}
              <PawfileFlavourFlag flavour={id} />
            </li>
          )
        })}
      </ul>
      <table className="mt-6 w-full border-collapse text-left">
        <caption className="sr-only">{product.name} prices</caption>
        <thead>
          <tr className="border-b hairline">
            <th scope="col" className="label py-2 font-semibold">
              {product.packLabel}
            </th>
            <th scope="col" data-col="veg" className="label py-2 text-right">
              Veg
            </th>
            <th scope="col" data-col="non-veg" className="label py-2 text-right">
              Non-veg
            </th>
          </tr>
        </thead>
        <tbody>
          {product.packs.map((pack) => (
            <tr key={pack.count} className="border-b border-dotted border-field/50">
              <th scope="row" className="py-3 font-display text-lg font-normal">
                {product.packLabel} of {pack.count}
              </th>
              <td data-col="veg" className="price py-3 text-right text-lg text-oxblood">
                {formatINR(pack.veg)}
              </td>
              <td data-col="non-veg" className="price py-3 text-right text-lg text-oxblood">
                {formatINR(pack.nonVeg)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {product === CUPCAKES ? (
        <p className="mt-4 text-[0.9375rem] text-muted">
          + {formatINR(CUPCAKES.facePerPiece!)} for each face add-on (per cupcake).
        </p>
      ) : null}
      <CtaLink href={`/treats/${product.slug}`}>{product === DOGNUTS ? 'Choose your Dognuts' : 'Choose your box'}</CtaLink>
    </div>
  )
}

function SimpleBlock({ product }: { product: SimpleProduct }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 className="font-display text-2xl text-oxblood">
          <Link href={`/treats/${product.slug}`} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.diet && product.diet !== 'by-flavour' ? <DietMark diet={product.diet} /> : null}
        <PawfileProductFlags slug={product.slug} />
      </div>
      <p className="text-[0.9375rem] text-muted">
        {product.servedWith ? `Served with a ${product.servedWith}. ` : null}
        {product.options ? `${product.options.label}s: ${product.options.values.join(', ')}. ` : null}
        {product.facts?.length ? `${product.facts.join(' · ')}.` : null}
      </p>
      <ul className={cn('mt-2', product.variants.length > 1 && 'sm:pl-4')}>
        {product.variants.map((v) => (
          <PriceRow key={v.id} as="li" name={product.variants.length > 1 || v.name !== product.name ? v.name : product.name} price={v.price} />
        ))}
      </ul>
    </div>
  )
}

function CtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group mt-6 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-oxblood">
      {children}
      <ArrowIcon size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  )
}
