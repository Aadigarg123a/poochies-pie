'use client'

import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const control =
  'block w-full rounded-[2px] border border-field bg-cream px-3.5 py-3 text-base text-ink placeholder:text-muted/80 transition-colors focus:border-oxblood focus:outline-2 focus:outline-offset-0 focus:outline-oxblood aria-invalid:border-nonveg'

interface FieldShellProps {
  label: ReactNode
  hint?: ReactNode
  error?: string | null
  optional?: boolean
  className?: string
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

export function FieldShell({ label, hint, error, optional, className, children }: FieldShellProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        <span>{label}</span>
        {optional ? <span className="text-xs font-normal text-muted">Optional</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint ? (
        <p id={hintId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm font-semibold text-nonveg">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type Shared = Omit<FieldShellProps, 'children'>

export function TextField({ label, hint, error, optional, className, ...input }: Shared & Omit<ComponentProps<'input'>, 'className'>) {
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ id, describedBy, invalid }) => (
        <input id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={control} {...input} />
      )}
    </FieldShell>
  )
}

export function TextArea({ label, hint, error, optional, className, ...input }: Shared & Omit<ComponentProps<'textarea'>, 'className'>) {
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ id, describedBy, invalid }) => (
        <textarea id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cn(control, 'min-h-24 resize-y')} {...input} />
      )}
    </FieldShell>
  )
}

export function Select({
  label,
  hint,
  error,
  optional,
  className,
  options,
  ...select
}: Shared & Omit<ComponentProps<'select'>, 'className'> & { options: readonly { value: string; label: string }[] }) {
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className={cn(control, 'appearance-none pr-10')}
            {...select}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-oxblood">
            <path d="m3 5 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
      )}
    </FieldShell>
  )
}
