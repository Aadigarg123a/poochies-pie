import Link from 'next/link'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { InstagramIcon } from '@/components/ui/icons'
import { Todo } from '@/components/ui/Todo'
import { Accordion } from '@/components/ui/Typography'
import { BUNDLES } from '@/data/bundles'
import { FAQ } from '@/data/faq'
import { SITE } from '@/data/site'
import { formatINR } from '@/lib/format'
import { priceCake, priceLine } from '@/lib/pricing'
import { InstagramEmbeds } from './InstagramEmbeds'

const STEPS = ['Size', 'Flavour', 'Frosting', 'Finishing touches', 'Name banner', 'Your pet']

export function AtelierTeaser() {
  const example = priceCake({
    kind: 'cake',
    size: 'half-kg',
    flavour: 'mutton-delight',
    frosting: 'cream-cheese',
    addOns: ['paw-design', 'name-banner'],
    bannerText: 'Bruno',
  })
  return (
    <section aria-labelledby="atelier-title" className="section-y border-t hairline">
      <div className="container-page page-x grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div data-reveal>
          <p className="label">The Atelier</p>
          <h2 id="atelier-title" className="mt-4 text-title">
            You design the cake. <em className="font-light">We bake it.</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Choose a size, a flavour, the frosting and the finishing touches, then put your pet&rsquo;s name on the banner. The
            price updates with every choice, straight from our menu.
          </p>
          <ol className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 text-[0.9375rem] sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-baseline gap-2">
                <span className="price text-sm text-rose">{String(i + 1).padStart(2, '0')}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <ButtonLink href="/atelier" size="lg" magnetic arrow>
              Enter the Atelier
            </ButtonLink>
          </div>
        </div>

        <figure data-reveal className="relative mx-auto w-full max-w-sm rotate-[1.5deg] bg-cream p-7 shadow-[0_30px_60px_-35px_rgb(92_33_24/0.55)] ring-1 ring-hairline sm:p-9">
          <figcaption className="label text-center">An example order</figcaption>
          <p className="mt-2 text-center font-display text-2xl italic text-oxblood">for Bruno</p>
          <dl className="mt-6 space-y-3 border-t border-dashed border-field/60 pt-5 text-[0.9375rem]">
            {[example.base, ...example.extras].map((line) => (
              <div key={line.label} className="flex justify-between gap-4">
                <dt>{line.label}</dt>
                <dd className="price">{formatINR(line.amount)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-dashed border-field/60 pt-4 font-display text-xl text-oxblood">
              <dt>Total</dt>
              <dd className="price">{formatINR(example.total)}</dd>
            </div>
          </dl>
        </figure>
      </div>
    </section>
  )
}

export function PawrtyTeaser() {
  return (
    <section aria-labelledby="pawrty-title" className="bg-oxblood text-cream">
      <div className="container-page page-x section-y grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <div data-reveal>
          <p className="label !text-blush">Pawrty Planner</p>
          <h2 id="pawrty-title" className="mt-4 text-title !text-cream">
            Throw a <em className="font-light">proper</em> pawrty.
          </h2>
          <p className="mt-6 max-w-md text-lg text-cream/85">
            The cake, the Happy Birthday cap, the bandana and cupcakes for the guest pets. Each set is priced as the plain sum of
            our menu, with no mystery maths.
          </p>
          <div className="mt-10">
            <ButtonLink href="/pawrty" variant="light" size="lg" magnetic arrow>
              Plan a pawrty
            </ButtonLink>
          </div>
        </div>
        <ul className="divide-y divide-cream/20 border-y border-cream/20">
          {BUNDLES.map((b, i) => {
            const total = b.parts.reduce((n, p) => n + priceLine(p.config).total, 0)
            return (
              <li key={b.id} data-reveal style={{ '--reveal-delay': `${i * 100}ms` } as React.CSSProperties}>
                <Link href={`/pawrty#${b.id}`} className="group flex items-baseline justify-between gap-6 py-6">
                  <span>
                    <span className="block font-display text-2xl italic sm:text-3xl">{b.name}</span>
                    <span className="mt-1 block text-sm text-cream/80">{b.description}</span>
                  </span>
                  <span className="price shrink-0 text-lg">
                    <span className="mr-1 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-blush">from</span>
                    {formatINR(total)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const HOW = [
  {
    n: 'I',
    title: 'Choose',
    body: 'Build a cake in the Atelier or pick from the menu, and choose your date. Please order 1–2 days ahead; there are no same-day orders.',
  },
  {
    n: 'II',
    title: 'Send',
    body: 'Your bag becomes a ready-to-send WhatsApp message with every detail: items, total, date, your pet and any allergies.',
  },
  {
    n: 'III',
    title: 'Confirm',
    body: 'We confirm on WhatsApp and share payment details. Your order is confirmed once the advance payment is made. Then we bake.',
  },
]

export function HowItWorks({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  return (
    <section aria-labelledby="how-title" className="section-y">
      <div className="container-page page-x">
        <div data-reveal className="max-w-xl">
          <p className="label">How ordering works</p>
          <H id="how-title" className="mt-4 text-title">
            Three steps, <em className="font-light">then cake.</em>
          </H>
        </div>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {HOW.map((s, i) => (
            <li key={s.n} data-reveal style={{ '--reveal-delay': `${i * 110}ms` } as React.CSSProperties} className="border-t border-oxblood pt-6">
              <span className="font-display text-5xl font-light italic text-rose" aria-hidden="true">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-2xl">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-3 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-sm text-muted">
          Delivery to your doorstep (delivery charges apply) or self pick-up.{' '}
          <Link href="/how-to-order" className="font-semibold text-oxblood underline underline-offset-4">
            The full details
          </Link>
        </p>
      </div>
    </section>
  )
}

export function InstagramStrip() {
  return (
    <section aria-labelledby="ig-title" className="border-y hairline bg-linen">
      <div className="container-page page-x py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end" data-reveal>
          <div>
            <p className="label">Fresh from the oven</p>
            <h2 id="ig-title" className="mt-4 text-title">
              Follow the bakes <span className="block font-light italic">{SITE.instagram.handle}</span>
            </h2>
          </div>
          <ButtonAnchor href={SITE.instagram.url} variant="secondary" size="lg" arrow>
            <InstagramIcon size={18} /> Open Instagram
          </ButtonAnchor>
        </div>
        {SITE.instagram.embedPosts.length ? (
          <InstagramEmbeds urls={SITE.instagram.embedPosts} />
        ) : (
          <div className="mt-10">
            <Todo>share 3–6 Instagram post URLs to show here as official embeds (they load only when tapped).</Todo>
          </div>
        )}
      </div>
    </section>
  )
}

export function FaqTeaser() {
  const featured = FAQ.filter((f) => f.featured)
  return (
    <section aria-labelledby="faq-teaser-title" className="section-y">
      <div className="container-page page-x grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
        <div data-reveal>
          <p className="label">Questions</p>
          <h2 id="faq-teaser-title" className="mt-4 text-title">
            Before you <em className="font-light">order.</em>
          </h2>
          <Link href="/faq" className="mt-6 inline-block font-semibold text-oxblood underline underline-offset-4">
            All questions
          </Link>
        </div>
        <Accordion items={featured.map((f) => ({ id: `faq-${f.id}`, q: f.q, a: f.a }))} />
      </div>
    </section>
  )
}
