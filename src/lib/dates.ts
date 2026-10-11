/**
 * Calendar dates are plain ISO strings ("2026-10-12") in Delhi time, so a
 * customer's own device time zone can never shift an order date.
 */
import { ORDERING } from '@/config/ordering'

export type ISODate = string

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/

/** Today's date in Delhi as YYYY-MM-DD. */
export function todayInDelhi(now: Date = new Date()): ISODate {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ORDERING.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function delhiTime(now: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ORDERING.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now)
}

export function parseISO(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function toISO(date: Date): ISODate {
  return date.toISOString().slice(0, 10)
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = parseISO(iso)
  d.setUTCDate(d.getUTCDate() + days)
  return toISO(d)
}

export function isValidISODate(value: string): boolean {
  return ISO_RE.test(value) && toISO(parseISO(value)) === value
}

/** The first date a customer can choose. */
export function earliestOrderDate(now: Date = new Date()): ISODate {
  let lead: number = ORDERING.minLeadDays
  if (ORDERING.nextDayCutoff && lead === 1 && delhiTime(now) >= ORDERING.nextDayCutoff) lead += 1
  return addDays(todayInDelhi(now), lead)
}

export function recommendedOrderDate(now: Date = new Date()): ISODate {
  return addDays(todayInDelhi(now), ORDERING.recommendedLeadDays)
}

export function latestOrderDate(now: Date = new Date()): ISODate {
  return addDays(todayInDelhi(now), ORDERING.maxAdvanceDays)
}

export function isOrderDateAllowed(iso: ISODate, now: Date = new Date()): boolean {
  return isValidISODate(iso) && iso >= earliestOrderDate(now) && iso <= latestOrderDate(now)
}

/** "Sat, 17 Oct 2026" */
export function formatOrderDate(iso: ISODate): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(parseISO(iso))
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('weekday')}, ${get('day')} ${get('month')} ${get('year')}`
}
