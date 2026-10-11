import { describe, expect, it } from 'vitest'
import { buildBirthdayICS, daysUntilBirthday, nextBirthday, reminderDate } from '@/lib/ics'

const base = {
  petName: 'Bruno',
  birthday: '2019-11-02',
  today: '2026-10-11',
  now: new Date('2026-10-11T04:30:00Z'),
  siteUrl: 'https://poochies-pie.vercel.app',
  siteName: "Poochie's Pie",
}

describe('birthday reminder (.ics)', () => {
  it('is set 3 days before the next birthday', () => {
    expect(nextBirthday('2019-11-02', '2026-10-11')).toBe('2026-11-02')
    expect(reminderDate('2019-11-02', '2026-10-11')).toBe('2026-10-30')
    expect(daysUntilBirthday('2019-11-02', '2026-10-11')).toBe(22)
  })

  it('rolls to next year once the date has passed', () => {
    expect(nextBirthday('2019-03-14', '2026-10-11')).toBe('2027-03-14')
    // Birthday in 2 days: this year's reminder is gone, so use next year's.
    expect(reminderDate('2020-10-13', '2026-10-11')).toBe('2027-10-10')
  })

  it('handles 29 February', () => {
    expect(nextBirthday('2020-02-29', '2026-10-11')).toBe('2027-02-28')
    expect(nextBirthday('2020-02-29', '2027-10-11')).toBe('2028-02-29')
  })

  it('is a valid all-day, yearly VEVENT that links back to the builder', () => {
    const ics = buildBirthdayICS(base)
    expect(ics).toMatch(/^BEGIN:VCALENDAR\r\n/)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics).toContain('DTSTART;VALUE=DATE:20261030\r\n')
    expect(ics).toContain('DTEND;VALUE=DATE:20261031\r\n')
    expect(ics).toContain('RRULE:FREQ=YEARLY\r\n')
    expect(ics).toContain('DTSTAMP:20261011T043000Z\r\n')
    expect(ics).toContain('URL:https://poochies-pie.vercel.app/atelier\r\n')
    expect(ics).toContain('SUMMARY:Bruno’s birthday is in 3 days 🎂')
    expect(ics).not.toMatch(/[^\r]\n/) // CRLF only
  })

  it('escapes text and folds long lines', () => {
    const ics = buildBirthdayICS({ ...base, petName: 'Sir Woofington, III; the Magnificent' })
    expect(ics).toContain('Sir Woofington\\, III\\; the Magnificent')
    for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
  })
})
