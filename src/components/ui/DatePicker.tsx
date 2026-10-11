'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ORDERING } from '@/config/ordering'
import {
  addDays,
  earliestOrderDate,
  formatOrderDate,
  latestOrderDate,
  parseISO,
  recommendedOrderDate,
  toISO,
  todayInDelhi,
  type ISODate,
} from '@/lib/dates'
import { cn } from '@/lib/cn'
import { useClientNow } from '@/lib/useClientNow'
import { ChevronIcon } from './icons'

const WEEKDAYS = [
  ['Mon', 'Monday'],
  ['Tue', 'Tuesday'],
  ['Wed', 'Wednesday'],
  ['Thu', 'Thursday'],
  ['Fri', 'Friday'],
  ['Sat', 'Saturday'],
  ['Sun', 'Sunday'],
] as const

const monthLabel = (iso: ISODate) =>
  new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parseISO(iso))

const longLabel = (iso: ISODate) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    parseISO(iso),
  )

function startOfMonth(iso: ISODate): ISODate {
  return `${iso.slice(0, 7)}-01`
}

function addMonths(iso: ISODate, n: number): ISODate {
  const d = parseISO(startOfMonth(iso))
  d.setUTCMonth(d.getUTCMonth() + n)
  return toISO(d)
}

/** Same day in another month, clamped to that month's last day (31 Jan → 28 Feb). */
function shiftMonth(iso: ISODate, n: number): ISODate {
  const target = addMonths(iso, n)
  const d = parseISO(target)
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  return `${target.slice(0, 8)}${String(Math.min(Number(iso.slice(8)), lastDay)).padStart(2, '0')}`
}

/** Monday-first 6×7 grid covering the month. */
function monthGrid(month: ISODate): ISODate[] {
  const first = parseISO(startOfMonth(month))
  const offset = (first.getUTCDay() + 6) % 7
  const start = addDays(toISO(first), -offset)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

/**
 * An accessible calendar (ARIA grid, roving tabindex) that only allows dates
 * the bakery can fulfil: no same-day orders, earliest = tomorrow (Delhi time).
 *
 * "Today" is read on the client after mount, never during prerender.
 */
export function DatePicker({
  value,
  onChange,
  label = 'Delivery or pick-up date',
}: {
  value: ISODate | null
  onChange: (date: ISODate) => void
  label?: string
}) {
  const now = useClientNow()

  if (!now) {
    return (
      <div aria-busy="true" className="flex h-[22rem] items-center justify-center rounded-[2px] border border-dashed border-field/60 text-sm text-muted">
        Loading calendar…
      </div>
    )
  }
  return <Calendar now={now} value={value} onChange={onChange} label={label} />
}

function Calendar({ now, value, onChange, label }: { now: Date; value: ISODate | null; onChange: (d: ISODate) => void; label: string }) {
  const today = todayInDelhi(now)
  const min = earliestOrderDate(now)
  const max = latestOrderDate(now)
  const recommended = recommendedOrderDate(now)

  const [focused, setFocused] = useState<ISODate>(value && value >= min && value <= max ? value : min)
  const [month, setMonth] = useState<ISODate>(startOfMonth(focused))
  const gridRef = useRef<HTMLTableElement>(null)
  const shouldFocus = useRef(false)
  const labelId = useId()
  const rulesId = useId()

  const days = useMemo(() => monthGrid(month), [month])
  const allowed = (d: ISODate) => d >= min && d <= max

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus()
  }, [focused, month])

  const moveFocus = (next: ISODate) => {
    const clamped = next < min ? min : next > max ? max : next
    shouldFocus.current = true
    setFocused(clamped)
    if (startOfMonth(clamped) !== month) setMonth(startOfMonth(clamped))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    const weekday = (parseISO(focused).getUTCDay() + 6) % 7
    const map: Record<string, () => ISODate> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -weekday),
      End: () => addDays(focused, 6 - weekday),
      PageUp: () => shiftMonth(focused, -1),
      PageDown: () => shiftMonth(focused, 1),
    }
    const fn = map[e.key]
    if (!fn) return
    e.preventDefault()
    moveFocus(fn())
  }

  const canPrev = startOfMonth(month) > startOfMonth(min)
  const canNext = startOfMonth(month) < startOfMonth(max)

  return (
    <div className="rounded-[2px] border border-field/50 bg-cream p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, -1))}
          disabled={!canPrev}
          className="inline-flex size-10 items-center justify-center rounded-full text-oxblood transition-colors hover:bg-linen disabled:opacity-30"
        >
          <ChevronIcon className="rotate-180" size={18} />
          <span className="sr-only">Previous month</span>
        </button>
        <p id={labelId} aria-live="polite" className="font-display text-xl text-oxblood">
          {monthLabel(month)}
        </p>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          disabled={!canNext}
          className="inline-flex size-10 items-center justify-center rounded-full text-oxblood transition-colors hover:bg-linen disabled:opacity-30"
        >
          <ChevronIcon size={18} />
          <span className="sr-only">Next month</span>
        </button>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-label={`${label}, ${monthLabel(month)}`}
        aria-describedby={rulesId}
        onKeyDown={onKeyDown}
        className="w-full table-fixed border-collapse"
      >
        <thead>
          <tr>
            {WEEKDAYS.map(([short, long]) => (
              <th key={short} scope="col" abbr={long} className="pb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">
                {short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row}>
              {days.slice(row * 7, row * 7 + 7).map((d) => {
                const inMonth = d.slice(0, 7) === month.slice(0, 7)
                const ok = allowed(d)
                const selected = d === value
                const isToday = d === today
                return (
                  <td key={d} role="gridcell" aria-selected={selected} className="p-0.5 text-center">
                    {inMonth ? (
                      <button
                        type="button"
                        data-date={d}
                        tabIndex={d === focused ? 0 : -1}
                        aria-disabled={!ok || undefined}
                        aria-label={`${longLabel(d)}${isToday ? ', today' : ''}${!ok ? ', unavailable' : ''}${d === recommended ? ', recommended' : ''}`}
                        onClick={() => {
                          if (!ok) return
                          setFocused(d)
                          onChange(d)
                        }}
                        onFocus={() => setFocused(d)}
                        className={cn(
                          'price relative mx-auto flex aspect-square w-full max-w-11 items-center justify-center rounded-full text-[0.9375rem] transition-colors',
                          ok && !selected && 'text-ink hover:bg-blush-mist',
                          !ok && 'cursor-not-allowed text-muted/60 line-through decoration-muted/40',
                          selected && 'bg-oxblood text-cream',
                          isToday && !selected && 'ring-1 ring-inset ring-field/60',
                        )}
                      >
                        {Number(d.slice(8))}
                        {d === recommended && !selected ? (
                          <span aria-hidden="true" className="absolute bottom-1 size-1 rounded-full bg-rose" />
                        ) : null}
                      </button>
                    ) : (
                      <span aria-hidden="true" className="block aspect-square" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div id={rulesId} className="mt-4 space-y-1 border-t hairline pt-3 text-sm text-muted">
        <p>
          No same-day orders. The earliest date is <strong className="font-semibold text-ink">{formatOrderDate(min)}</strong>
          {ORDERING.recommendedLeadDays > ORDERING.minLeadDays ? (
            <>
              ; we recommend {ORDERING.recommendedLeadDays} days&rsquo; notice <span aria-hidden="true">(•)</span>.
            </>
          ) : (
            '.'
          )}
        </p>
        {value ? (
          <p className="text-ink">
            Selected: <strong className="font-semibold">{formatOrderDate(value)}</strong>
          </p>
        ) : null}
      </div>
    </div>
  )
}
