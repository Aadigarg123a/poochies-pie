'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { ButtonAnchor, Button } from '@/components/ui/Button'
import { CheckCard, RadioCards } from '@/components/ui/Choice'
import { DatePicker } from '@/components/ui/DatePicker'
import { Drawer } from '@/components/ui/Drawer'
import { TextArea, TextField } from '@/components/ui/Field'
import { ChevronIcon, CloseIcon } from '@/components/ui/icons'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Todo } from '@/components/ui/Todo'
import { PAYMENT_RULE } from '@/config/ordering'
import { SITE } from '@/data/site'
import { getCheckoutProvider } from '@/lib/checkout'
import { describeLine } from '@/lib/describe'
import { formatINR } from '@/lib/format'
import { useClientNow } from '@/lib/useClientNow'
import { buildOrderMessage, orderTotal } from '@/lib/whatsapp'
import { MAX_QUANTITY, useCartStore, type GiftDetails, type OrderDetails } from '@/stores/cart'
import { usePawfileStore } from '@/stores/pawfile'
import { useUIStore } from '@/stores/ui'
import { EMPTY_PET, PetFields } from './PetFields'

const selectDetails = (s: OrderDetails) => ({
  date: s.date,
  fulfilment: s.fulfilment,
  locality: s.locality,
  pet: s.pet,
  gift: s.gift,
  notes: s.notes,
})

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen)
  const close = useUIStore((s) => s.closeCart)
  const lines = useCartStore((s) => s.lines)
  const [view, setView] = useState<'bag' | 'details'>('bag')

  const showDetails = view === 'details' && lines.length > 0
  return (
    <Drawer
      open={open}
      onClose={close}
      title={showDetails ? 'Date & details' : 'Your bag'}
      footer={lines.length ? showDetails ? <CheckoutFooter /> : <BagFooter onContinue={() => setView('details')} /> : null}
    >
      {showDetails ? (
        <>
          <button
            type="button"
            onClick={() => setView('bag')}
            className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-oxblood underline-offset-4 hover:underline"
          >
            <ChevronIcon size={16} className="rotate-180" /> Back to your bag
          </button>
          <OrderDetailsForm />
        </>
      ) : (
        <BagLines onNavigate={close} />
      )}
    </Drawer>
  )
}

function BagLines({ onNavigate }: { onNavigate: () => void }) {
  const lines = useCartStore((s) => s.lines)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const remove = useCartStore((s) => s.remove)

  if (!lines.length) {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-3xl text-oxblood">Your bag is empty.</p>
        <p className="mt-3 text-muted">Everything is baked to order, just for your pet.</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href="/atelier" onClick={onNavigate} className="font-semibold text-oxblood underline underline-offset-4">
            Build a cake in the Atelier
          </Link>
          <Link href="/menu" onClick={onNavigate} className="text-muted underline underline-offset-4">
            Browse the menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-hairline" data-testid="bag-lines">
      {lines.map((line) => {
        const d = describeLine(line.config)
        return (
          <li key={line.id} className="py-5 first:pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-xl leading-snug text-ink">{d.title}</p>
                <ul className="mt-1 space-y-0.5 text-sm text-muted">
                  {d.details.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                  {d.extras.map((x) => (
                    <li key={x.label}>
                      + {x.label} <span className="price">{formatINR(x.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => remove(line.id)}
                className="-mr-2 -mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-linen hover:text-oxblood"
              >
                <CloseIcon size={16} />
                <span className="sr-only">Remove {d.title}</span>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <QuantityStepper value={line.quantity} max={MAX_QUANTITY} onChange={(q) => setQuantity(line.id, q)} label={`Quantity of ${d.title}`} />
              <p className="price text-lg text-oxblood">{formatINR(d.unitTotal * line.quantity)}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function BagFooter({ onContinue }: { onContinue: () => void }) {
  const lines = useCartStore((s) => s.lines)
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xl text-oxblood">Subtotal</span>
        <span className="price text-2xl text-oxblood">{formatINR(orderTotal(lines))}</span>
      </div>
      <p className="mt-1 text-xs text-muted">Delivery charges are extra if delivering.</p>
      <Button onClick={onContinue} size="lg" className="mt-4 w-full" arrow>
        Continue: date & details
      </Button>
    </div>
  )
}

function OrderDetailsForm() {
  const details = useCartStore(useShallow(selectDetails))
  const setDetails = useCartStore((s) => s.setDetails)
  const pawfile = usePawfileStore((s) => s.pawfile)

  const pet = details.pet ?? (pawfile ? { name: pawfile.name, species: pawfile.species, allergies: pawfile.allergies, allergyNotes: pawfile.allergyNotes } : EMPTY_PET)
  const setGift = (g: Partial<GiftDetails>) =>
    setDetails({ gift: { recipientName: '', note: '', senderName: '', pet: EMPTY_PET, ...details.gift, ...g } })

  return (
    <div className="space-y-9">
      <section aria-labelledby="date-title">
        <h3 id="date-title" className="mb-3 font-display text-xl text-oxblood">
          When?
        </h3>
        <DatePicker value={details.date} onChange={(date) => setDetails({ date })} />
      </section>

      <section aria-labelledby="fulfil-title" className="space-y-4">
        <h3 id="fulfil-title" className="font-display text-xl text-oxblood">
          Delivery or pick-up?
        </h3>
        <RadioCards<OrderDetails['fulfilment']>
          legend="Delivery or pick-up"
          hideLegend
          name="fulfilment"
          value={details.fulfilment}
          columns={2}
          onChange={(fulfilment) => setDetails({ fulfilment })}
          options={[
            { value: 'delivery', label: 'Delivery', description: 'To your doorstep. Delivery charges apply.' },
            { value: 'pickup', label: 'Self pick-up', description: SITE.pickupLocality ? `From ${SITE.pickupLocality}` : 'We’ll share the address on WhatsApp.' },
          ]}
        />
        {details.fulfilment === 'delivery' ? (
          <>
            <TextField
              label="Delivery area or locality"
              placeholder="e.g. Vasant Vihar, Delhi"
              value={details.locality}
              onChange={(e) => setDetails({ locality: e.target.value })}
              hint="We’ll ask for the full address on WhatsApp."
              autoComplete="address-level3"
            />
            <Todo>delivery charge rules and service area (shown here once confirmed).</Todo>
          </>
        ) : !SITE.pickupLocality ? (
          <Todo>pick-up locality (area name only).</Todo>
        ) : null}
      </section>

      <section aria-labelledby="pet-title" className="space-y-4">
        <h3 id="pet-title" className="font-display text-xl text-oxblood">
          {details.gift ? 'The gift' : 'Your pet'}
        </h3>
        <CheckCard
          label="This is a gift"
          description="Send a Pup-cake to someone else’s pet, with a note."
          checked={Boolean(details.gift)}
          onChange={(on) => (on ? setGift({}) : setDetails({ gift: null }))}
        />
        {details.gift ? (
          <div className="space-y-5">
            <TextField label="Gift for (their name)" value={details.gift.recipientName} onChange={(e) => setGift({ recipientName: e.target.value })} autoComplete="off" />
            <PetFields idPrefix="gift" nameLabel="Their pet’s name" value={details.gift.pet} onChange={(p) => setGift({ pet: p })} />
            <TextArea label="Gift note" optional maxLength={200} rows={3} value={details.gift.note} hint={`${details.gift.note.length}/200`} onChange={(e) => setGift({ note: e.target.value })} />
            <TextField label="From (your name)" optional value={details.gift.senderName} onChange={(e) => setGift({ senderName: e.target.value })} autoComplete="name" />
          </div>
        ) : (
          <PetFields idPrefix="pet" value={pet} onChange={(p) => setDetails({ pet: p })} />
        )}
      </section>

      <section aria-labelledby="notes-title">
        <h3 id="notes-title" className="sr-only">
          Notes
        </h3>
        <TextArea
          label="Notes for the bakery"
          optional
          rows={3}
          value={details.notes}
          onChange={(e) => setDetails({ notes: e.target.value })}
          hint="Customisation ideas, timing, anything else."
        />
      </section>
    </div>
  )
}

function CheckoutFooter() {
  const lines = useCartStore((s) => s.lines)
  const details = useCartStore(useShallow(selectDetails))
  const pawfile = usePawfileStore((s) => s.pawfile)
  const clear = useCartStore((s) => s.clear)
  const now = useClientNow()
  const pet =
    details.pet ??
    (pawfile ? { name: pawfile.name, species: pawfile.species, allergies: pawfile.allergies, allergyNotes: pawfile.allergyNotes } : null)
  const order = { lines, details: { ...details, pet } }
  const action = getCheckoutProvider().action(order, now ?? undefined)
  const [sent, setSent] = useState(false)

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xl text-oxblood">Total</span>
        <span className="price text-2xl text-oxblood">{formatINR(orderTotal(lines))}</span>
      </div>
      {details.fulfilment === 'delivery' ? <p className="text-xs text-muted">Plus delivery charges.</p> : null}
      <div className="mt-4 grid gap-3">
        {action.kind === 'link' ? (
          <ButtonAnchor
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="w-full"
            data-testid="whatsapp-checkout"
            onClick={() => setSent(true)}
          >
            {action.label}
          </ButtonAnchor>
        ) : (
          <>
            <Button size="lg" className="w-full" disabled>
              Send order on WhatsApp
            </Button>
            <ul className="space-y-1 text-sm text-nonveg" aria-live="polite">
              {action.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </>
        )}
        <p className="text-xs leading-relaxed text-muted">{PAYMENT_RULE}</p>
        {sent ? (
          <p role="status" className="text-sm">
            Sent? Once we confirm on WhatsApp you can{' '}
            <button type="button" onClick={clear} className="font-semibold text-oxblood underline underline-offset-4">
              clear your bag
            </button>
            .
          </p>
        ) : null}
        <details className="text-sm">
          <summary className="cursor-pointer text-muted underline underline-offset-4">Preview the message</summary>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-[2px] bg-linen p-3 font-sans text-xs leading-relaxed text-ink">
            {buildOrderMessage(order)}
          </pre>
        </details>
      </div>
    </div>
  )
}
