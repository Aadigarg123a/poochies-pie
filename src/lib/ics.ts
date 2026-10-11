/**
 * Birthday reminder as an iCalendar (.ics) file: an all-day event 3 days
 * before the pet's next birthday, repeating yearly, linking back to the
 * cake builder. Generated in the browser; nothing is sent anywhere.
 */
import { addDays, parseISO, type ISODate } from './dates'

export const REMINDER_DAYS_BEFORE = 3

function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

/** The pet's next birthday on or after `today` (29 Feb falls back to 28 Feb). */
export function nextBirthday(birthday: ISODate, today: ISODate): ISODate {
  const [, m, d] = birthday.split('-').map(Number)
  const year = Number(today.slice(0, 4))
  const on = (y: number) => {
    const day = m === 2 && d === 29 && !isLeap(y) ? 28 : d
    return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  const thisYear = on(year)
  return thisYear >= today ? thisYear : on(year + 1)
}

/** The first reminder date that is still today or later. */
export function reminderDate(birthday: ISODate, today: ISODate): ISODate {
  let bday = nextBirthday(birthday, today)
  let reminder = addDays(bday, -REMINDER_DAYS_BEFORE)
  if (reminder < today) {
    bday = nextBirthday(birthday, addDays(bday, 1))
    reminder = addDays(bday, -REMINDER_DAYS_BEFORE)
  }
  return reminder
}

/** Days from today until the next birthday (0 = today). */
export function daysUntilBirthday(birthday: ISODate, today: ISODate): number {
  const ms = parseISO(nextBirthday(birthday, today)).getTime() - parseISO(today).getTime()
  return Math.round(ms / 86_400_000)
}

function escapeText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** Fold lines longer than 75 octets (RFC 5545 §3.1). */
function fold(line: string) {
  const bytes = new TextEncoder()
  if (bytes.encode(line).length <= 75) return line
  const out: string[] = []
  let current = ''
  for (const ch of line) {
    if (bytes.encode(current + ch).length > (out.length ? 74 : 75)) {
      out.push(current)
      current = ch
    } else current += ch
  }
  out.push(current)
  return out.join('\r\n ')
}

const compact = (iso: ISODate) => iso.replace(/-/g, '')

function stamp(now: Date) {
  return now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function buildBirthdayICS({
  petName,
  birthday,
  today,
  now,
  siteUrl,
  siteName,
}: {
  petName: string
  birthday: ISODate
  today: ISODate
  now: Date
  siteUrl: string
  siteName: string
}): string {
  const name = petName.trim() || 'Your pet'
  const start = reminderDate(birthday, today)
  const builder = `${siteUrl}/atelier`
  const uid = `birthday-${compact(birthday)}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@poochiespie`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${escapeText(siteName)}//Birthday reminder//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART;VALUE=DATE:${compact(start)}`,
    `DTEND;VALUE=DATE:${compact(addDays(start, 1))}`,
    'RRULE:FREQ=YEARLY',
    `SUMMARY:${escapeText(`${name}’s birthday is in ${REMINDER_DAYS_BEFORE} days 🎂`)}`,
    `DESCRIPTION:${escapeText(`Time to order ${name}’s cake from ${siteName}. We need 1–2 days’ notice.\nBuild it here: ${builder}`)}`,
    `URL:${builder}`,
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:PT9H',
    `DESCRIPTION:${escapeText(`Order ${name}’s birthday cake`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

