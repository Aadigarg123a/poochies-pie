import type { Metadata } from 'next'
import { pageMeta } from '@/lib/metadata'
import { ButtonAnchor } from '@/components/ui/Button'
import { ChatIcon, InstagramIcon, PinIcon } from '@/components/ui/icons'
import { Todo } from '@/components/ui/Todo'
import { SITE, whatsappLink } from '@/data/site'

export const metadata: Metadata = pageMeta({
  title: 'Contact: WhatsApp and Instagram',
  description:
    'Order or ask a question: message Poochie’s Pie on WhatsApp at +91 98100 15052, or follow @poochiespie on Instagram. Delhi NCR.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="container-page page-x pb-24">
      <header className="max-w-3xl pb-14 pt-12 sm:pt-16">
        <p className="label">Contact</p>
        <h1 className="mt-5 text-display">
          Say <em className="font-light">hello</em>
          <span className="text-rose">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          WhatsApp is the quickest way to reach us: for orders, questions and anything custom.
        </p>
      </header>

      <ul className="grid gap-6 md:grid-cols-3">
        <li className="flex flex-col bg-oxblood p-8 text-cream">
          <ChatIcon size={28} />
          <h2 className="mt-6 font-display text-3xl !text-cream">WhatsApp</h2>
          <p className="price mt-2 text-xl">{SITE.whatsapp.display}</p>
          <div className="mt-auto pt-8">
            <ButtonAnchor href={whatsappLink("Hello Poochie's Pie!")} variant="light" arrow>
              Message us
            </ButtonAnchor>
          </div>
        </li>
        <li className="flex flex-col bg-linen/70 p-8 ring-1 ring-hairline">
          <InstagramIcon size={28} className="text-oxblood" />
          <h2 className="mt-6 font-display text-3xl">Instagram</h2>
          <p className="mt-2 text-xl">{SITE.instagram.handle}</p>
          <div className="mt-auto pt-8">
            <ButtonAnchor href={SITE.instagram.url} variant="secondary" arrow>
              Follow the bakes
            </ButtonAnchor>
          </div>
        </li>
        <li className="flex flex-col bg-linen/70 p-8 ring-1 ring-hairline">
          <PinIcon size={28} className="text-oxblood" />
          <h2 className="mt-6 font-display text-3xl">Google</h2>
          <p className="mt-2 text-[0.9375rem] text-muted">{SITE.areaServed}</p>
          <div className="mt-auto pt-8">
            {SITE.googleProfileUrl ? (
              <ButtonAnchor href={SITE.googleProfileUrl} variant="secondary" arrow>
                Find us on Google
              </ButtonAnchor>
            ) : (
              <Todo>Google Business Profile link.</Todo>
            )}
          </div>
        </li>
      </ul>
    </div>
  )
}
