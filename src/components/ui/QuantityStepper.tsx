'use client'

import { MinusIcon, PlusIcon } from './icons'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  /** e.g. "Quantity of Tuxedo Bandana" */
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-field/60">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="inline-flex size-10 items-center justify-center rounded-full text-oxblood transition-colors hover:bg-linen disabled:opacity-40"
      >
        <MinusIcon size={16} />
        <span className="sr-only">Decrease</span>
      </button>
      <output aria-live="polite" className="price w-7 text-center text-base">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="inline-flex size-10 items-center justify-center rounded-full text-oxblood transition-colors hover:bg-linen disabled:opacity-40"
      >
        <PlusIcon size={16} />
        <span className="sr-only">Increase</span>
      </button>
    </div>
  )
}
