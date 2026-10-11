import { getProduct, PRODUCTS } from '@/data/menu'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og'
import { fromPrice } from '@/lib/pricing'

export const alt = "A Poochie's Pie product"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  return renderOg({
    // The OG fonts' Latin subset has no ₹ glyph, so prices read "INR" here.
    eyebrow: product ? `From INR ${fromPrice(slug).toLocaleString('en-IN')}` : 'Delhi',
    title: product?.name ?? 'Poochie’s Pie',
    italic: product?.tagline,
  })
}
