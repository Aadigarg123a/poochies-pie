import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { formatINR } from '@/lib/format'

/**
 * A printed-tasting-menu row: name, dotted leader, price.
 * The leader is decorative; screen readers hear "name, price".
 */
export function PriceRow({
  name,
  price,
  prefix,
  detail,
  aside,
  className,
  as: Tag = 'div',
}: {
  name: ReactNode
  price: number
  prefix?: string
  detail?: ReactNode
  aside?: ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  return (
    <Tag className={cn('py-2.5', className)}>
      <div className="flex items-baseline gap-3">
        <span className="min-w-0 font-display text-lg leading-snug text-ink sm:text-xl">{name}</span>
        {aside ? <span className="shrink-0 self-center">{aside}</span> : null}
        <span aria-hidden="true" className="mx-1 min-w-6 flex-1 translate-y-[-0.3em] border-b border-dotted border-field/70" />
        <span className="price shrink-0 text-lg text-oxblood sm:text-xl">
          {prefix ? <span className="mr-1 font-sans text-xs uppercase tracking-[0.14em] text-muted">{prefix}</span> : null}
          {formatINR(price)}
        </span>
      </div>
      {detail ? <div className="mt-1 text-sm text-muted">{detail}</div> : null}
    </Tag>
  )
}
