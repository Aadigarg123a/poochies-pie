const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

/** ₹1,410 — the one way prices are written anywhere on the site. */
export function formatINR(amount: number): string {
  return inr.format(amount)
}
