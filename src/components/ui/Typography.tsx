import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  as: H = 'h2',
  className,
  id,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-2xl', className)}>
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <H id={id} className={cn(H === 'h1' ? 'text-display' : 'text-title', eyebrow ? 'mt-4' : null)}>
        {title}
      </H>
      {lede ? <p className={cn('mt-5 text-lg text-muted', align === 'center' && 'mx-auto max-w-xl')}>{lede}</p> : null}
    </div>
  )
}

/** A single blush brush stroke, after the swashes on the printed menu. Decorative. */
export function BrushStroke({ className, variant = 1 }: { className?: string; variant?: 1 | 2 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 120" preserveAspectRatio="none" className={cn('pointer-events-none text-blush', className)}>
      {variant === 1 ? (
        <path
          fill="currentColor"
          d="M8 78c38-30 104-52 182-58 66-5 120 6 186 4 74-2 128-18 196-12 14 1 22 10 18 20-5 12-22 14-40 14-62-1-120 14-190 18-78 5-134-8-206-2-58 5-104 24-136 36-14 5-24-2-10-20Z"
          opacity="0.85"
        />
      ) : (
        <path
          fill="currentColor"
          d="M14 64c44-22 98-36 170-40 80-4 150 12 230 10 58-1 110-12 160-8 12 1 18 12 10 20-10 10-34 10-56 12-70 6-120 22-206 22-74 0-140-14-206-6-40 5-74 14-96 12-14-1-18-14-6-22Z"
          opacity="0.75"
        />
      )}
    </svg>
  )
}

export function Accordion({ items }: { items: readonly { q: ReactNode; a: ReactNode; id?: string }[] }) {
  return (
    <div className="border-t hairline">
      {items.map((item, i) => (
        <details key={item.id ?? i} className="group border-b hairline" id={item.id}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl text-oxblood marker:hidden [&::-webkit-details-marker]:hidden sm:text-2xl">
            <span>{item.q}</span>
            <span aria-hidden="true" className="relative size-4 shrink-0">
              <span className="absolute inset-x-0 top-1/2 h-px bg-oxblood" />
              <span className="absolute inset-y-0 left-1/2 w-px bg-oxblood transition-transform duration-500 ease-[var(--ease-soft)] group-open:scale-y-0" />
            </span>
          </summary>
          <div className="max-w-2xl pb-6 text-[1.0625rem] text-ink/90">{item.a}</div>
        </details>
      ))}
    </div>
  )
}
