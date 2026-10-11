/**
 * Turns the bag into a ready-to-send WhatsApp message for the bakery
 * (v1 checkout: the owner confirms manually and asks for advance payment).
 */
import type { Protein } from '@/data/menu'
import { SITE, whatsappLink } from '@/data/site'
import type { CartLine, GiftDetails, OrderDetails, PetDetails } from '@/stores/cart'
import { formatOrderDate, isOrderDateAllowed } from './dates'
import { describeLine } from './describe'
import { formatINR } from './format'
import { proteinLabel } from './pawfile'

export interface OrderInput {
  lines: readonly CartLine[]
  details: OrderDetails
}

const species = (s: PetDetails['species']) => (s === 'cat' ? 'cat' : 'dog')

function allergyText(allergies: readonly Protein[], notes: string): string {
  const parts = [...allergies.map(proteinLabel), notes.trim()].filter(Boolean)
  return parts.length ? parts.join('; ') : 'None'
}

function petLine(pet: PetDetails): string {
  return `${pet.name.trim() || 'Not given'} (${species(pet.species)})`
}

export function orderTotal(lines: readonly CartLine[]): number {
  return lines.reduce((n, l) => n + describeLine(l.config).unitTotal * l.quantity, 0)
}

/** Problems that stop the order from being sent. Empty = ready. */
export function validateOrder({ lines, details }: OrderInput, now: Date = new Date()): string[] {
  const errors: string[] = []
  if (!lines.length) errors.push('Your bag is empty.')
  if (!details.date) errors.push('Choose a delivery or pick-up date.')
  else if (!isOrderDateAllowed(details.date, now)) errors.push('That date is no longer available. Please choose another.')
  if (details.fulfilment === 'delivery' && !details.locality.trim()) errors.push('Add your delivery area or locality.')
  if (details.gift) {
    if (!details.gift.recipientName.trim()) errors.push('Add the gift recipient’s name.')
    if (!details.gift.pet.name.trim()) errors.push('Add the name of the pet receiving the gift.')
  }
  return errors
}

export function buildOrderMessage({ lines, details }: OrderInput): string {
  const out: string[] = [`Hello ${SITE.name}! I’d like to place an order.`, '', '*ORDER*']

  lines.forEach((line, i) => {
    const d = describeLine(line.config)
    out.push(`${i + 1}. ${d.title}: ${formatINR(d.base)}`)
    for (const detail of d.details) out.push(`   ${detail}`)
    for (const extra of d.extras) out.push(`   + ${extra.label}: ${formatINR(extra.amount)}`)
    const qty = line.quantity > 1 ? `${line.quantity} × ${formatINR(d.unitTotal)} = ` : ''
    out.push(`   Line total: ${qty}${formatINR(d.unitTotal * line.quantity)}`)
  })

  out.push('', `*Total: ${formatINR(orderTotal(lines))}*${details.fulfilment === 'delivery' ? ' (plus delivery charges)' : ''}`, '')

  out.push(`*Date:* ${details.date ? formatOrderDate(details.date) : 'To be confirmed'}`)
  out.push(
    details.fulfilment === 'delivery'
      ? `*Delivery to:* ${details.locality.trim()} (I’ll share the full address here)`
      : '*Self pick-up*',
  )

  if (details.gift) {
    out.push(...giftBlock(details.gift))
  } else if (details.pet) {
    out.push(`*Pet:* ${petLine(details.pet)}`)
    out.push(`*Allergies:* ${allergyText(details.pet.allergies, details.pet.allergyNotes)}`)
  }

  if (details.notes.trim()) out.push(`*Notes:* ${details.notes.trim()}`)

  out.push('', 'I understand the order is confirmed after advance payment. Please share the payment details. Thank you!')
  return out.join('\n')
}

function giftBlock(gift: GiftDetails): string[] {
  const lines = [
    '',
    '*This is a gift* 🎁',
    `*For:* ${gift.recipientName.trim()}`,
    `*Their pet:* ${petLine(gift.pet)}`,
    `*Pet’s allergies:* ${allergyText(gift.pet.allergies, gift.pet.allergyNotes)}`,
  ]
  if (gift.note.trim()) lines.push(`*Gift note:* “${gift.note.trim()}”`)
  if (gift.senderName.trim()) lines.push(`*From:* ${gift.senderName.trim()}`)
  return lines
}

export function orderWhatsAppLink(input: OrderInput): string {
  return whatsappLink(buildOrderMessage(input))
}
