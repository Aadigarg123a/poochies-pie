/**
 * Checkout providers. v1 ships WhatsApp only (manual confirmation + advance
 * payment, exactly how the bakery works today). A payment gateway such as
 * Razorpay can be added later behind FLAGS.checkoutProvider without touching
 * the cart or builder.
 */
import { FLAGS } from '@/config/flags'
import { orderWhatsAppLink, validateOrder, type OrderInput } from './whatsapp'

export type CheckoutAction =
  | { kind: 'link'; href: string; label: string }
  | { kind: 'blocked'; reasons: string[] }

export interface CheckoutProvider {
  id: 'whatsapp' | 'razorpay'
  action: (order: OrderInput, now?: Date) => CheckoutAction
}

export const whatsappCheckout: CheckoutProvider = {
  id: 'whatsapp',
  action(order, now) {
    const reasons = validateOrder(order, now)
    if (reasons.length) return { kind: 'blocked', reasons }
    return { kind: 'link', href: orderWhatsAppLink(order), label: 'Send order on WhatsApp' }
  },
}

/** Placeholder: not implemented in v1. Never enabled unless the flag is set. */
const razorpayCheckout: CheckoutProvider = {
  id: 'razorpay',
  action() {
    return { kind: 'blocked', reasons: ['Online payment is not available yet. Please order on WhatsApp.'] }
  },
}

export function getCheckoutProvider(): CheckoutProvider {
  return FLAGS.checkoutProvider === 'razorpay' ? razorpayCheckout : whatsappCheckout
}
