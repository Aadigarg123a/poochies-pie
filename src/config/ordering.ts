/**
 * Ordering rules shown next to every date picker and order button.
 * Owner confirmed (2026-10-11): no same-day orders; earliest is tomorrow,
 * 2 days' notice recommended; payment is arranged manually on WhatsApp.
 */
export const ORDERING = {
  /** Earliest delivery/pick-up date = today (Delhi time) + this many days. */
  minLeadDays: 1,
  /** Shown as the recommended notice period ("order 1–2 days before"). */
  recommendedLeadDays: 2,
  /** How far ahead the calendar lets people book. */
  maxAdvanceDays: 120,
  /** "HH:mm" in Delhi time after which tomorrow is no longer available. TODO(owner): none given. */
  nextDayCutoff: null as string | null,
  timeZone: 'Asia/Kolkata',
} as const

export const PAYMENT_RULE =
  'Orders are confirmed only after advance online payment. We share payment details on WhatsApp once we confirm your order.'
