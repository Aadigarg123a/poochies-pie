import type { Metadata } from 'next'
import { pageMeta } from '@/lib/metadata'
import { HowItWorks } from '@/components/home/HomeSections'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Todo } from '@/components/ui/Todo'
import { ORDERING, PAYMENT_RULE } from '@/config/ordering'
import { FACTS, SITE, whatsappLink } from '@/data/site'

export const metadata: Metadata = pageMeta({
  title: 'How to order a dog or cat cake in Delhi',
  description:
    'How ordering works at Poochie’s Pie: order 1–2 days ahead, confirm with advance online payment, then choose doorstep delivery or self pick-up in Delhi NCR. Storage and allergy notes.',
  path: '/how-to-order',
})

const SECTIONS = [
  {
    id: 'lead-time',
    title: 'Order 1–2 days ahead',
    body: (
      <>
        <p>{FACTS.leadTime}</p>
        <p>
          We don&rsquo;t take same-day orders: the earliest date you can choose is tomorrow, and we recommend giving us{' '}
          {ORDERING.recommendedLeadDays} days. Every cake is baked fresh for your date.
        </p>
      </>
    ),
  },
  {
    id: 'payment',
    title: 'Advance payment confirms your order',
    body: (
      <>
        <p>{PAYMENT_RULE}</p>
        <p>Nothing is charged on this website. Your bag becomes a WhatsApp message; we reply to confirm and to arrange payment.</p>
      </>
    ),
  },
  {
    id: 'delivery',
    title: 'Delivery or self pick-up',
    body: (
      <>
        <p>{FACTS.fulfilment}</p>
        <p>
          Delivery area: {SITE.areaServed}. <Todo inline>confirm service area / zones</Todo>
        </p>
        <Todo fallback={<p>We&rsquo;ll confirm the delivery charge for your area on WhatsApp.</p>}>
          delivery charge rules (the menu only says “delivery charges apply”) and the pick-up locality.
        </Todo>
      </>
    ),
  },
  {
    id: 'storage',
    title: 'Storing your cake',
    body: <p>{FACTS.storage}</p>,
  },
  {
    id: 'allergies',
    title: 'Allergies',
    body: (
      <p>
        {FACTS.allergies} Save a Pawfile and we&rsquo;ll flag menu items that mention chicken, mutton or fish, but please always tell
        us about every allergy.
      </p>
    ),
  },
  {
    id: 'customisation',
    title: 'Customisation',
    body: (
      <p>
        {FACTS.customisation} Add a Name Banner, a Mini Face or Full Face, a paw design, cheese or coconut in the Atelier, or tell
        us your idea on WhatsApp.
      </p>
    ),
  },
]

export default function HowToOrderPage() {
  return (
    <>
      <div className="container-page page-x">
        <header className="max-w-3xl pb-6 pt-12 sm:pt-16">
          <p className="label">How to order</p>
          <h1 className="mt-5 text-display">
            Simple, <em className="font-light">by design</em>
            <span className="text-rose">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            We&rsquo;re a home bakery, so every order is made just for you. Here&rsquo;s everything to know before you order.
          </p>
        </header>
      </div>
      <HowItWorks />
      <div className="container-page page-x pb-24">
        <div className="divide-y divide-hairline border-y hairline">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="grid gap-4 py-10 md:grid-cols-[18rem_1fr] md:gap-12">
              <div>
                <p className="price text-sm text-rose">{String(i + 1).padStart(2, '0')}</p>
                <h2 id={`${s.id}-title`} className="mt-2 font-display text-3xl">
                  {s.title}
                </h2>
              </div>
              <div className="max-w-2xl space-y-3 text-[1.0625rem] text-ink/90">{s.body}</div>
            </section>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-4">
          <ButtonLink href="/atelier" size="lg" magnetic arrow>
            Build your cake
          </ButtonLink>
          <ButtonAnchor href={whatsappLink("Hello Poochie's Pie! I'd like to ask about an order.")} variant="secondary" size="lg">
            Ask on WhatsApp
          </ButtonAnchor>
        </div>
      </div>
    </>
  )
}
