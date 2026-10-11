import type { Diet } from '@/data/menu'
import { PROMISE } from '@/data/site'
import { cn } from '@/lib/cn'
import { AlertIcon } from './icons'

/** India's veg / non-veg mark (square with dot / triangle) plus a text label. Never colour alone. */
export function DietMark({ diet, showLabel = true, className }: { diet: Diet; showLabel?: boolean; className?: string }) {
  const veg = diet === 'veg'
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', veg ? 'text-veg' : 'text-nonveg', className)}>
      <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
        <rect x="0.75" y="0.75" width="12.5" height="12.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {veg ? <circle cx="7" cy="7" r="3.2" fill="currentColor" /> : <path d="M7 3.4 10.6 10H3.4L7 3.4Z" fill="currentColor" />}
      </svg>
      {showLabel ? <span>{veg ? 'Veg' : 'Non-veg'}</span> : <span className="sr-only">{veg ? 'Veg' : 'Non-veg'}</span>}
    </span>
  )
}

/** Small tag with the printed-menu voice. */
export function Tag({ children, tone = 'line', className }: { children: React.ReactNode; tone?: 'line' | 'blush' | 'oxblood'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.14em]',
        tone === 'line' && 'border border-hairline text-rose',
        tone === 'blush' && 'bg-blush-mist text-oxblood',
        tone === 'oxblood' && 'bg-oxblood text-cream',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** The four "Never in it" promises. */
export function NeverInIt({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={className}>
      {!compact ? <p className="label">Never in it</p> : null}
      <ul className={cn('flex flex-wrap gap-2', !compact && 'mt-3')} aria-label="Never in it">
        {PROMISE.never.map((p) => (
          <li key={p.id}>
            <Tag tone="blush">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <circle cx="5" cy="5" r="4.2" fill="none" stroke="currentColor" />
                <path d="M2 8 8 2" stroke="currentColor" />
              </svg>
              {p.label}
            </Tag>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Flags a conflict with the pet's Pawfile. */
export function AllergyFlag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[2px] border border-nonveg/40 bg-[#fbeee6] px-2 py-1 text-xs font-semibold text-nonveg',
        className,
      )}
    >
      <AlertIcon size={14} />
      {children}
    </span>
  )
}
