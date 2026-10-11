import type { Metadata } from 'next'
import { Seal } from '@/components/layout/Wordmark'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { NeverInIt } from '@/components/ui/Badges'
import { InstagramIcon } from '@/components/ui/icons'
import { Todo } from '@/components/ui/Todo'
import { BrushStroke } from '@/components/ui/Typography'
import { FACTS, PROMISE, SITE } from '@/data/site'

export const metadata: Metadata = {
  title: 'About: a home pet bakery in Delhi',
  description:
    'Poochie’s Pie is a home-based pet bakery in Delhi making fresh, made-to-order pup-cakes and treats for dogs and cats, with no sugar, salt, cocoa or preservatives.',
  alternates: { canonical: '/about' },
}

/**
 * The owner's story is a TODO. This layout reads well without it: the facts
 * carry the page, and the story slot appears once it is written.
 * TODO(owner): founder / brand story → replace STORY below.
 */
const STORY: string[] | null = null

export default function AboutPage() {
  return (
    <div className="container-page page-x pb-24">
      <header className="grid items-end gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="label">About</p>
          <h1 className="mt-5 text-display">
            A home bakery, <em className="font-light">for pets</em>
            <span className="text-rose">.</span>
          </h1>
        </div>
        <div className="relative hidden justify-self-end lg:block">
          <BrushStroke className="absolute -left-10 top-1/2 h-16 w-72 -translate-y-1/2" variant={2} />
          <Seal size={180} className="relative text-oxblood" />
        </div>
      </header>

      <div className="grid gap-14 border-t hairline pt-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="space-y-6 text-lg leading-relaxed">
          <p className="font-display text-3xl leading-snug text-oxblood">
            {SITE.name} is a home-based pet bakery in Delhi, making fresh, made-to-order pup-cakes and treats, delivered to your
            doorstep.
          </p>
          <p className="text-ink/90">
            {FACTS.pets} Everything is made fresh, to order. {PROMISE.intro} Each cake is finished to order, from
            the frosting to the name on the banner.
          </p>
          {STORY ? (
            STORY.map((para) => (
              <p key={para.slice(0, 24)} className="text-ink/90">
                {para}
              </p>
            ))
          ) : (
            <Todo>the founder / brand story for this page (a few short paragraphs, and a photo if you like).</Todo>
          )}
        </div>
        <div className="space-y-10">
          <NeverInIt />
          <dl className="grid gap-6 text-[0.9375rem] sm:grid-cols-2">
            <div className="border-t border-oxblood pt-4">
              <dt className="label">Made to order</dt>
              <dd className="mt-2">{FACTS.leadTime}</dd>
            </div>
            <div className="border-t border-oxblood pt-4">
              <dt className="label">Allergies</dt>
              <dd className="mt-2">Curd &amp; sweet potato frosting for pets with allergies.</dd>
            </div>
            <div className="border-t border-oxblood pt-4">
              <dt className="label">Customisation</dt>
              <dd className="mt-2">{FACTS.customisation}</dd>
            </div>
            <div className="border-t border-oxblood pt-4">
              <dt className="label">Delhi</dt>
              <dd className="mt-2">Doorstep delivery or self pick-up across {SITE.areaServed}.</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/menu" arrow>
              See the menu
            </ButtonLink>
            <ButtonAnchor href={SITE.instagram.url} variant="secondary">
              <InstagramIcon size={18} /> {SITE.instagram.handle}
            </ButtonAnchor>
          </div>
        </div>
      </div>
    </div>
  )
}
