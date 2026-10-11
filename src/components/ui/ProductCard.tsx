import Link from 'next/link'
import type { Product } from '@/data/menu'
import { formatINR } from '@/lib/format'
import { fromPrice } from '@/lib/pricing'
import { PawfileProductFlags } from '@/components/pawfile/PawfileFlags'
import { DietMark } from './Badges'
import { ProductImage } from './ProductImage'

export function DietSummary({ product }: { product: Product }) {
  if (product.diet === 'by-flavour') {
    return (
      <span className="inline-flex flex-wrap items-center gap-3">
        <DietMark diet="veg" />
        <DietMark diet="non-veg" />
      </span>
    )
  }
  if (product.diet) return <DietMark diet={product.diet} />
  return null
}

export function ProductCard({ product, headingLevel = 'h3' }: { product: Product; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  return (
    <article className="group relative flex flex-col">
      <ProductImage slug={product.slug} name={product.name} aspect="portrait" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <H className="font-display text-2xl leading-tight text-oxblood">
            <Link href={`/treats/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {product.name}
            </Link>
          </H>
          <p className="price shrink-0 pt-1 text-lg text-oxblood">
            <span className="mr-1 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-muted">from</span>
            {formatINR(fromPrice(product.slug))}
          </p>
        </div>
        <p className="mt-1.5 text-[0.9375rem] text-muted">{product.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <DietSummary product={product} />
          <PawfileProductFlags slug={product.slug} />
        </div>
      </div>
    </article>
  )
}
