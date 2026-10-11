/**
 * Brand facts, taken verbatim from the owner's menu. Anything not given by the
 * owner is `null` and marked TODO(owner). Never fill these in with guesses.
 */

export const SITE = {
  name: "Poochie's Pie",
  tagline: 'Haute pâtisserie for pets · Delhi',
  description:
    "Poochie's Pie is a home-based pet bakery in Delhi making fresh, made-to-order pup-cakes and treats for dogs and cats, delivered to your doorstep. No sugar, no salt, no cocoa, no preservatives.",
  /** Production URL. Set NEXT_PUBLIC_SITE_URL on Vercel. TODO(owner): domain name. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://poochies-pie.vercel.app').replace(/\/$/, ''),
  locale: 'en_IN',
  whatsapp: {
    display: '+91 98100 15052',
    e164: '+919810015052',
    /** wa.me number: country code + number, digits only. */
    number: '919810015052',
  },
  instagram: {
    handle: '@poochiespie',
    url: 'https://www.instagram.com/poochiespie/',
    /** Specific post URLs to show as official embeds (click-to-load). TODO(owner): supply posts. */
    embedPosts: [] as string[],
  },
  /** TODO(owner): Google Business Profile link. */
  googleProfileUrl: null as string | null,
  /** TODO(owner): confirm the service area / zones. The brief says Delhi NCR. */
  areaServed: 'Delhi NCR',
  /** TODO(owner): pick-up locality (area name only). */
  pickupLocality: null as string | null,
  /** TODO(owner): delivery charge rules. The menu only says "delivery charges apply". */
  deliveryCharges: null as string | null,
} as const

export const PROMISE = {
  intro: 'Made with natural ingredients.',
  never: [
    { id: 'sugar', label: 'No sugar or fondant' },
    { id: 'salt', label: 'No salt' },
    { id: 'cocoa', label: 'No cocoa powder' },
    { id: 'preservatives', label: 'No preservatives' },
  ],
} as const

export const FACTS = {
  allergies:
    'Please tell us about any food allergies your pet has. Our standard frosting is cream cheese; for pets with allergies we make a curd & sweet potato frosting instead.',
  customisation: 'Customisation is available on request.',
  storage: 'Baked products keep for 2–3 days in the refrigerator. Take them out about 1 hour before serving.',
  leadTime: 'Please order 1–2 days before your delivery date.',
  payment: 'Orders are confirmed only after advance online payment.',
  fulfilment: 'Doorstep delivery (delivery charges apply) or self pick-up.',
  pets: 'We bake for dogs and cats.',
} as const

export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${SITE.whatsapp.number}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
