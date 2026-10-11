import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ChoiceOption<T extends string> {
  value: T
  label: ReactNode
  description?: ReactNode
  /** Right-aligned meta, e.g. a price. */
  meta?: ReactNode
  disabled?: boolean
  /** Extra line shown under the option (e.g. an allergy flag). */
  flag?: ReactNode
}

/**
 * Radio cards: a native radio group (arrow keys, one tab stop) styled as cards.
 */
export function RadioCards<T extends string>({
  legend,
  hideLegend,
  name,
  value,
  onChange,
  options,
  columns = 2,
  hint,
}: {
  legend: ReactNode
  hideLegend?: boolean
  name: string
  value: T | null
  onChange: (value: T) => void
  options: readonly ChoiceOption<T>[]
  columns?: 1 | 2 | 3
  hint?: ReactNode
}) {
  return (
    <fieldset>
      <legend className={hideLegend ? 'sr-only' : 'mb-3 text-sm font-semibold text-ink'}>{legend}</legend>
      {hint ? <p className="-mt-1 mb-3 text-sm text-muted">{hint}</p> : null}
      <div className={cn('grid gap-3', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3')}>
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              'relative flex cursor-pointer gap-3 rounded-[2px] border border-field/60 bg-cream p-4 transition-[border-color,background-color,box-shadow] duration-300',
              'hover:border-oxblood has-[:checked]:border-oxblood has-[:checked]:bg-blush-mist/60 has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-oxblood)]',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-oxblood',
              'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 rounded-full border border-field bg-cream transition-[border-width,border-color] peer-checked:border-[5px] peer-checked:border-oxblood"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg leading-snug text-ink">{o.label}</span>
                {o.meta ? <span className="price shrink-0 text-oxblood">{o.meta}</span> : null}
              </span>
              {o.description ? <span className="mt-1 block text-sm text-muted">{o.description}</span> : null}
              {o.flag ? <span className="mt-2 block">{o.flag}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** A checkbox styled as a selectable card/chip. */
export function CheckCard({
  checked,
  onChange,
  label,
  description,
  meta,
  disabled,
  name,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  description?: ReactNode
  meta?: ReactNode
  disabled?: boolean
  name?: string
}) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer items-start gap-3 rounded-[2px] border border-field/60 bg-cream p-4 transition-[border-color,background-color,box-shadow] duration-300',
        'hover:border-oxblood has-[:checked]:border-oxblood has-[:checked]:bg-blush-mist/60 has-[:checked]:shadow-[inset_0_0_0_1px_var(--color-oxblood)]',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-oxblood',
        'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
      )}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-[2px] border border-field bg-cream text-cream peer-checked:border-oxblood peer-checked:bg-oxblood"
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="m2 5.2 2 2L8 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-display text-lg leading-snug text-ink">{label}</span>
          {meta ? <span className="price shrink-0 text-oxblood">{meta}</span> : null}
        </span>
        {description ? <span className="mt-1 block text-sm text-muted">{description}</span> : null}
      </span>
    </label>
  )
}

/** Compact pill toggle used for filters. */
export function FilterChip({
  pressed,
  onClick,
  children,
  count,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300',
        pressed ? 'border-oxblood bg-oxblood text-cream' : 'border-field/60 text-ink hover:border-oxblood hover:text-oxblood',
      )}
    >
      {children}
      {typeof count === 'number' ? <span className={cn('price text-xs', pressed ? 'text-blush' : 'text-muted')}>{count}</span> : null}
    </button>
  )
}
