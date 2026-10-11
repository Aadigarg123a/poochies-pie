import { cn } from '@/lib/cn'
import { CheckIcon } from './icons'

export interface Step {
  id: string
  label: string
  /** Short summary of the choice, shown once the step is complete. */
  summary?: string
}

/**
 * Builder progress. Steps are buttons so customers can jump back to any
 * completed step; future steps are disabled until reachable.
 */
export function Stepper({
  steps,
  current,
  reachable,
  onSelect,
}: {
  steps: readonly Step[]
  current: number
  /** Highest step index the customer may jump to. */
  reachable: number
  onSelect: (index: number) => void
}) {
  return (
    <nav aria-label="Cake builder steps">
      <ol className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible">
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={step.id} className="shrink-0 lg:border-b lg:hairline lg:last:border-b-0">
              <button
                type="button"
                onClick={() => onSelect(i)}
                disabled={i > reachable}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'group relative flex w-full items-center gap-3 rounded-[2px] px-2 py-2 text-left transition-colors lg:px-0 lg:py-4',
                  'disabled:cursor-not-allowed',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'price flex size-7 shrink-0 items-center justify-center rounded-full border text-sm transition-colors',
                    active && 'border-oxblood bg-oxblood text-cream',
                    done && 'border-oxblood text-oxblood',
                    !active && !done && 'border-field/60 text-muted',
                  )}
                >
                  {done ? <CheckIcon size={14} /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block whitespace-nowrap text-[0.75rem] font-semibold uppercase tracking-[0.14em]',
                      active ? 'text-oxblood' : done ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {step.label}
                    {done ? <span className="sr-only"> (done)</span> : null}
                  </span>
                  {step.summary && done ? (
                    <span className="hidden truncate font-display text-base italic text-ink lg:block">{step.summary}</span>
                  ) : null}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
