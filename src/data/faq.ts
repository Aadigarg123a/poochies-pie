/**
 * FAQ built only from the owner's stated facts (src/data/site.ts and menu.ts).
 * Answers are plain strings so they can also feed FAQPage JSON-LD.
 */
import { CAKE_SIZE_RULES, HALF_KG_ADD_ONS, MINI_ADD_ONS } from './menu'
import { FACTS, PROMISE, SITE } from './site'
import { formatINR } from '@/lib/format'

const banner = (list: readonly { id: string; price: number }[]) => formatINR(list.find((a) => a.id === 'name-banner')!.price)

export interface FaqItem {
  id: string
  q: string
  a: string
  /** Shown on the home page teaser. */
  featured?: boolean
  /** Has an open owner TODO (rendered next to the answer). */
  todo?: string
}

export const FAQ: readonly FaqItem[] = [
  {
    id: 'never-in-it',
    q: 'What is never in your cakes and treats?',
    a: `${PROMISE.intro} Everything is made without sugar or fondant, without salt, without cocoa powder and without preservatives.`,
    featured: true,
  },
  {
    id: 'how-far-ahead',
    q: 'How far in advance should I order?',
    a: `${FACTS.leadTime} We don’t take same-day orders, so the earliest date you can choose is tomorrow.`,
    featured: true,
  },
  {
    id: 'payment',
    q: 'When is my order confirmed?',
    a: `${FACTS.payment} Send us your order on WhatsApp; once we confirm it, we share the payment details there.`,
    featured: true,
  },
  {
    id: 'allergies',
    q: 'My pet has food allergies. Can you help?',
    a: `Yes, please tell us about any allergies when you order. Our standard frosting is cream cheese; for pets with allergies we make a curd & sweet potato frosting instead.`,
    featured: true,
  },
  {
    id: 'cats',
    q: 'Do you bake for cats too?',
    a: `${FACTS.pets} Our Pet-Friendly Beer is suitable for dogs and cats, and we make bow-ties for cats. For anything else, ask us on WhatsApp whether it suits your cat.`,
  },
  {
    id: 'delivery',
    q: 'Do you deliver, or can I pick up?',
    a: `Both. We deliver to your doorstep (delivery charges apply) or you can pick up your order yourself.`,
    todo: 'delivery charge rules, service area and pick-up locality',
  },
  {
    id: 'storage',
    q: 'How should I store the cake?',
    a: FACTS.storage,
  },
  {
    id: 'name',
    q: 'Can you put my pet’s name on the cake?',
    a: `Yes. Add a Name Banner: ${banner(HALF_KG_ADD_ONS)} on half-kilo and one-kilo cakes, ${banner(MINI_ADD_ONS)} on Special Mini Cakes.`,
  },
  {
    id: 'sizes',
    q: 'What sizes do the cakes come in?',
    a: `Special Mini (250–300 g), half a kilo and one kilo (half-kilo price + ${formatINR(CAKE_SIZE_RULES.oneKgSurcharge)}). The Bone-shaped cake is made only in 1 kg (half-kilo price + ${formatINR(CAKE_SIZE_RULES.boneSurcharge)}).`,
  },
  {
    id: 'customise',
    q: 'Can I customise my order?',
    a: `${FACTS.customisation} Message us on WhatsApp at ${SITE.whatsapp.display} and tell us what you have in mind.`,
  },
  {
    id: 'beer',
    q: 'Is the Pet-Friendly Beer alcoholic?',
    a: 'No. It is a non-alcoholic, chicken-based beer that is suitable for dogs and cats.',
  },
]
