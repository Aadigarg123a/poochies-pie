import Image from 'next/image'
import { PHOTOS } from '@/data/photos'
import { cn } from '@/lib/cn'

/** Art-directed palettes for placeholders, picked deterministically per slug. */
const PALETTES = [
  { bg: 'radial-gradient(120% 90% at 20% 10%, #fbe3da 0%, #f7b7a3 55%, #e9998a 100%)', ink: '#5c2118' },
  { bg: 'radial-gradient(110% 100% at 80% 0%, #fdf8f2 0%, #f4e6da 50%, #ecd3c2 100%)', ink: '#722a1e' },
  { bg: 'radial-gradient(120% 100% at 30% 100%, #8e3a2b 0%, #722a1e 45%, #5c2118 100%)', ink: '#fbe3da' },
  { bg: 'linear-gradient(160deg, #f4e6da 0%, #fbe3da 45%, #f7b7a3 100%)', ink: '#722a1e' },
] as const

function paletteFor(key: string) {
  let h = 0
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTES[h % PALETTES.length]
}

interface ProductImageProps {
  /** Product slug (looked up in src/data/photos.ts). */
  slug: string
  /** Name set in the placeholder. */
  name: string
  /** Optional flavour/variant line under the name. */
  caption?: string
  aspect?: 'square' | 'portrait' | 'landscape'
  sizes?: string
  /** Load eagerly (the LCP image). */
  preload?: boolean
  className?: string
}

/**
 * The one place product imagery is rendered. Real photos come from
 * src/data/photos.ts; until then an art-directed placeholder is shown.
 */
export function ProductImage({ slug, name, caption, aspect = 'portrait', sizes = '(min-width: 1024px) 33vw, 100vw', preload, className }: ProductImageProps) {
  const photo = PHOTOS[slug]
  const ratio = aspect === 'square' ? 'aspect-square' : aspect === 'landscape' ? 'aspect-[4/3]' : 'aspect-[4/5]'

  if (photo) {
    return (
      <div className={cn('relative overflow-hidden rounded-[2px] bg-linen', ratio, className)}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder="blur"
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
        />
      </div>
    )
  }

  const p = paletteFor(slug + (caption ?? ''))
  return (
    <div
      aria-hidden="true"
      data-placeholder
      className={cn('relative flex items-center justify-center overflow-hidden rounded-[2px] p-6 text-center', ratio, className)}
      style={{ background: p.bg, color: p.ink }}
    >
      <span className="pointer-events-none absolute inset-3 rounded-[1px] border" style={{ borderColor: 'currentColor', opacity: 0.22 }} />
      <span className="relative transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]">
        <span className="block font-display text-[clamp(1.5rem,4vw,2.25rem)] italic leading-tight">{name}</span>
        {caption ? <span className="mt-3 block text-[0.6875rem] font-semibold uppercase tracking-[0.2em] opacity-80">{caption}</span> : null}
      </span>
    </div>
  )
}
