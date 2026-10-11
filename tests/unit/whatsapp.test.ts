import { describe, expect, it } from 'vitest'
import { whatsappCheckout } from '@/lib/checkout'
import { buildOrderMessage, orderWhatsAppLink, validateOrder, type OrderInput } from '@/lib/whatsapp'

const NOW = new Date('2026-10-11T04:30:00Z')

const order: OrderInput = {
  lines: [
    {
      id: 'a',
      quantity: 1,
      config: {
        kind: 'cake',
        size: 'half-kg',
        flavour: 'mutton-delight',
        frosting: 'curd-sweet-potato',
        addOns: ['name-banner', 'paw-design'],
        bannerText: 'Happy Birthday Bruno',
      },
    },
    { id: 'b', quantity: 2, config: { kind: 'item', slug: 'happy-birthday-cap', variantId: 'one-size' } },
    { id: 'c', quantity: 1, config: { kind: 'cupcakes', count: 6, flavour: 'chicken-farmhouse', faces: 6 } },
  ],
  details: {
    date: '2026-10-17',
    fulfilment: 'delivery',
    locality: 'Vasant Vihar',
    pet: { name: 'Bruno', species: 'dog', allergies: ['chicken'], allergyNotes: 'No peanuts please' },
    gift: null,
    notes: 'Please call before delivery.',
  },
}

describe('WhatsApp order message', () => {
  it('is itemised, totalled and complete', () => {
    expect(buildOrderMessage(order)).toMatchInlineSnapshot(`
      "Hello Poochie's Pie! I’d like to place an order.

      *ORDER*
      1. ½ kg cake · Mutton Delight: ₹1,250
         Frosting: Curd & sweet potato
         Banner: “Happy Birthday Bruno”
         + Paw Design: ₹60
         + Name Banner: ₹100
         Line total: ₹1,410
      2. Happy Birthday Cap: ₹50
         Line total: 2 × ₹50 = ₹100
      3. Rainbow Cupcakes · Box of 6 · Chicken Farmhouse (Non-veg): ₹1,100
         Flavour: Chicken Farmhouse
         + Face add-on × 6: ₹300
         Line total: ₹1,400

      *Total: ₹2,910* (plus delivery charges)

      *Date:* Sat, 17 Oct 2026
      *Delivery to:* Vasant Vihar (I’ll share the full address here)
      *Pet:* Bruno (dog)
      *Allergies:* chicken; No peanuts please
      *Notes:* Please call before delivery.

      I understand the order is confirmed after advance payment. Please share the payment details. Thank you!"
    `)
  })

  it('builds a correctly URL-encoded wa.me link', () => {
    const href = orderWhatsAppLink(order)
    expect(href.startsWith('https://wa.me/919810015052?text=')).toBe(true)
    const encoded = href.split('?text=')[1]
    expect(encoded).not.toMatch(/[\s"“”₹&+]/)
    expect(encoded).toContain('%E2%82%B9') // ₹
    expect(encoded).toContain('%0A') // newlines
    expect(decodeURIComponent(encoded)).toBe(buildOrderMessage(order))
    expect(new URL(href).searchParams.get('text')).toBe(buildOrderMessage(order))
  })

  it('includes the gift block instead of the buyer’s pet', () => {
    const gift: OrderInput = {
      ...order,
      details: {
        ...order.details,
        fulfilment: 'pickup',
        gift: {
          recipientName: 'Ananya',
          pet: { name: 'Coco', species: 'cat', allergies: [], allergyNotes: '' },
          note: 'Happy birthday, Coco!',
          senderName: 'Rhea',
        },
      },
    }
    const text = buildOrderMessage(gift)
    expect(text).toContain('*This is a gift* 🎁')
    expect(text).toContain('*For:* Ananya')
    expect(text).toContain('*Their pet:* Coco (cat)')
    expect(text).toContain('*Pet’s allergies:* None')
    expect(text).toContain('*Gift note:* “Happy birthday, Coco!”')
    expect(text).toContain('*From:* Rhea')
    expect(text).toContain('*Self pick-up*')
    expect(text).not.toContain('plus delivery charges')
    expect(text).not.toContain('*Pet:* Bruno')
  })

  it('blocks incomplete orders with clear reasons', () => {
    expect(validateOrder({ lines: [], details: { ...order.details, date: null, locality: ' ' } }, NOW)).toEqual([
      'Your bag is empty.',
      'Choose a delivery or pick-up date.',
      'Add your delivery area or locality.',
    ])
    expect(validateOrder({ ...order, details: { ...order.details, date: '2026-10-11' } }, NOW)).toEqual([
      'That date is no longer available. Please choose another.',
    ])
    expect(whatsappCheckout.action(order, NOW)).toMatchObject({ kind: 'link', label: 'Send order on WhatsApp' })
  })
})
