import type { Metadata } from 'next'
import { ButtonAnchor } from '@/components/ui/Button'
import { Todo } from '@/components/ui/Todo'
import { Accordion } from '@/components/ui/Typography'
import { FAQ } from '@/data/faq'
import { whatsappLink } from '@/data/site'

export const metadata: Metadata = {
  title: 'FAQ: sugar-free dog cakes, cat cakes, delivery and allergies',
  description:
    'Answers about Poochie’s Pie cakes in Delhi: what is never in them, how far ahead to order, payment, allergies, cats, delivery or pick-up, storage and name banners.',
  alternates: { canonical: '/faq' },
}

export default function FaqPage() {
  return (
    <div className="container-page page-x pb-24">
      <header className="max-w-3xl pb-12 pt-12 sm:pt-16">
        <p className="label">Questions & answers</p>
        <h1 className="mt-5 text-display">
          FAQ<span className="font-light italic text-rose">.</span>
        </h1>
      </header>
      <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
        <Accordion
          items={FAQ.map((f) => ({
            id: f.id,
            q: f.q,
            a: (
              <>
                <p>{f.a}</p>
                {f.todo ? (
                  <div className="mt-3">
                    <Todo>{f.todo}</Todo>
                  </div>
                ) : null}
              </>
            ),
          }))}
        />
        <aside className="self-start bg-linen/70 p-6 ring-1 ring-hairline lg:sticky lg:top-24">
          <p className="font-display text-2xl text-oxblood">Still curious?</p>
          <p className="mt-2 text-[0.9375rem] text-muted">Ask us anything on WhatsApp.</p>
          <ButtonAnchor href={whatsappLink("Hello Poochie's Pie! I have a question.")} className="mt-5" arrow>
            Message us
          </ButtonAnchor>
        </aside>
      </div>
    </div>
  )
}
