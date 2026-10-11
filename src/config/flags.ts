/**
 * Feature flags. Everything here is safe to expose to the browser.
 */
export const FLAGS = {
  /**
   * v1 checkout is a pre-filled WhatsApp message (how the owner works today).
   * 'razorpay' is reserved for a future gateway; it is not implemented.
   */
  checkoutProvider: (process.env.NEXT_PUBLIC_CHECKOUT_PROVIDER ?? 'whatsapp') as 'whatsapp' | 'razorpay',
  /**
   * Show "TODO(owner)" placeholders on the page. On by default so previews make
   * gaps obvious; set NEXT_PUBLIC_SHOW_TODOS=false in production to show the
   * graceful fallback copy instead.
   */
  showTodos: process.env.NEXT_PUBLIC_SHOW_TODOS !== 'false',
  /** Pawrty bundle discount. TODO(owner): none given, so it stays off. */
  bundleDiscountPercent: null as number | null,
} as const
