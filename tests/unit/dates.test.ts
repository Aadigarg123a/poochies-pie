import { describe, expect, it } from 'vitest'
import { earliestOrderDate, formatOrderDate, isOrderDateAllowed, todayInDelhi } from '@/lib/dates'

// 11 Oct 2026, 10:00 in Delhi (04:30 UTC)
const NOW = new Date('2026-10-11T04:30:00Z')

describe('lead time', () => {
  it('rejects today', () => {
    expect(isOrderDateAllowed('2026-10-11', NOW)).toBe(false)
  })

  it('accepts tomorrow', () => {
    expect(isOrderDateAllowed('2026-10-12', NOW)).toBe(true)
    expect(earliestOrderDate(NOW)).toBe('2026-10-12')
  })

  it('rejects past and malformed dates', () => {
    expect(isOrderDateAllowed('2026-10-01', NOW)).toBe(false)
    expect(isOrderDateAllowed('2026-02-30', NOW)).toBe(false)
    expect(isOrderDateAllowed('tomorrow', NOW)).toBe(false)
  })

  it('uses Delhi time, not the device time zone', () => {
    // 23:30 UTC on 11 Oct is already 12 Oct in Delhi.
    const lateUTC = new Date('2026-10-11T23:30:00Z')
    expect(todayInDelhi(lateUTC)).toBe('2026-10-12')
    expect(isOrderDateAllowed('2026-10-12', lateUTC)).toBe(false)
    expect(isOrderDateAllowed('2026-10-13', lateUTC)).toBe(true)
  })

  it('formats dates for messages', () => {
    expect(formatOrderDate('2026-10-17')).toBe('Sat, 17 Oct 2026')
  })
})
