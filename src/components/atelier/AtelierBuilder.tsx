'use client'

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { PawfileFlavourFlag } from '@/components/pawfile/PawfileFlags'
import { AllergyFlag, DietMark } from '@/components/ui/Badges'
import { Button } from '@/components/ui/Button'
import { CheckCard, RadioCards } from '@/components/ui/Choice'
import { TextArea, TextField } from '@/components/ui/Field'
import { Stepper } from '@/components/ui/Stepper'
import { PAYMENT_RULE } from '@/config/ordering'
import {
  CAKE_SIZES,
  FLAVOURS,
  FROSTINGS,
  getFlavour,
  type CakeSize,
  type FlavourId,
  type FrostingId,
  type Protein,
  type Species,
} from '@/data/menu'
import { FACTS } from '@/data/site'
import { formatINR } from '@/lib/format'
import { proteinLabel } from '@/lib/pawfile'
import { addOnsForSize, cakeBasePrice, priceCake, sizeLabel, validateCake, type CakeConfig } from '@/lib/pricing'
import { useCartStore, type PetDetails } from '@/stores/cart'
import { usePawfileStore } from '@/stores/pawfile'
import { useUIStore } from '@/stores/ui'

const STEPS = [
  { id: 'size', label: 'Size' },
  { id: 'flavour', label: 'Flavour' },
  { id: 'frosting', label: 'Frosting' },
  { id: 'touches', label: 'Touches' },
  { id: 'banner', label: 'Banner' },
  { id: 'pet', label: 'The pet' },
] as const

type Topping = 'cheese' | 'coconut' | 'paw-design'
type Face = 'none' | 'mini-face' | 'full-face'

const TOPPINGS: readonly Topping[] = ['cheese', 'coconut', 'paw-design']
const PROTEINS: readonly Protein[] = ['chicken', 'mutton', 'fish']
const BANNER_MAX = 32

interface GiftFields {
  recipientName: string
  note: string
  senderName: string
}

interface BuilderState {
  size: CakeSize | null
  flavour: FlavourId | null
  frosting: FrostingId
  toppings: Topping[]
  face: Face
  bannerOn: boolean
  bannerText: string
  pet: PetDetails
  savePawfile: boolean
  gift: GiftFields
}

const emptyPet: PetDetails = { name: '', species: 'dog', allergies: [], allergyNotes: '' }

function initialState(params: URLSearchParams | null): BuilderState {
  const size = params?.get('size')
  const flavour = params?.get('flavour')
  return {
    size: CAKE_SIZES.some((s) => s.id === size) ? (size as CakeSize) : null,
    flavour: FLAVOURS.some((f) => f.id === flavour) ? (flavour as FlavourId) : null,
    frosting: 'cream-cheese',
    toppings: [],
    face: 'none',
    bannerOn: false,
    bannerText: '',
    pet: emptyPet,
    savePawfile: true,
    gift: { recipientName: '', note: '', senderName: '' },
  }
}

function toConfig(s: BuilderState): CakeConfig | null {
  if (!s.size || !s.flavour) return null
  const addOns: CakeConfig['addOns'] = [...s.toppings]
  if (s.face !== 'none') addOns.push(s.face)
  if (s.bannerOn) addOns.push('name-banner')
  return { kind: 'cake', size: s.size, flavour: s.flavour, frosting: s.frosting, addOns, bannerText: s.bannerOn ? s.bannerText.trim() : undefined }
}

/** Highest step the customer may open, given what is already chosen. */
function reachableStep(s: BuilderState) {
  if (!s.size) return 0
  if (!s.flavour) return 1
  if (s.bannerOn && !s.bannerText.trim()) return 4
  return 5
}

function petComplete(s: BuilderState, gift: boolean) {
  if (!s.pet.name.trim()) return false
  if (gift && !s.gift.recipientName.trim()) return false
  return true
}

export function AtelierBuilder() {
  const params = useSearchParams()
  return <Builder key={params.toString()} params={params} />
}

/** Rendered into the static HTML before search params are known. */
export function AtelierBuilderFallback() {
  return <Builder params={null} />
}

function Builder({ params }: { params: URLSearchParams | null }) {
  const gift = params?.get('gift') === '1'
  const [state, setState] = useState<BuilderState>(() => initialState(params))
  const [step, setStep] = useState(() => {
    const s = initialState(params)
    return s.size ? (s.flavour ? 2 : 1) : 0
  })
  const [added, setAdded] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const pawfile = usePawfileStore((s) => s.pawfile)
  const savePawfile = usePawfileStore((s) => s.save)
  const addToCart = useCartStore((s) => s.add)
  const setDetails = useCartStore((s) => s.setDetails)
  const openCart = useUIStore((s) => s.openCart)

  const config = toConfig(state)
  const errors = config ? validateCake(config) : []
  const breakdown = config && !errors.length ? priceCake(config) : null
  const reachable = reachableStep(state)
  const canAdd = Boolean(breakdown) && petComplete(state, gift)

  const patch = (p: Partial<BuilderState>) => {
    setAdded(false)
    setState((s) => ({ ...s, ...p }))
  }
  const patchPet = (p: Partial<PetDetails>) => patch({ pet: { ...state.pet, ...p } })

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(i, reachable, STEPS.length - 1))
    // Pre-fill the pet step from the Pawfile the first time it opens.
    if (STEPS[next].id === 'pet' && !gift && !state.pet.name && pawfile) {
      setState((s) => ({
        ...s,
        pet: { name: pawfile.name, species: pawfile.species, allergies: [...pawfile.allergies], allergyNotes: pawfile.allergyNotes },
      }))
    }
    setStep(next)
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: false }))
  }

  const add = () => {
    if (!config || !canAdd) return
    addToCart(config)
    const pet = { ...state.pet, name: state.pet.name.trim(), allergyNotes: state.pet.allergyNotes.trim() }
    if (gift) {
      setDetails({ gift: { recipientName: state.gift.recipientName.trim(), note: state.gift.note.trim(), senderName: state.gift.senderName.trim(), pet } })
    } else {
      setDetails({ pet })
      if (state.savePawfile) {
        savePawfile({
          name: pet.name,
          species: pet.species,
          allergies: pet.allergies,
          allergyNotes: pet.allergyNotes,
          breedSize: pawfile?.breedSize ?? null,
          birthday: pawfile?.birthday ?? null,
        })
      }
    }
    setAdded(true)
    openCart()
  }

  const reset = () => {
    setState(initialState(null))
    setAdded(false)
    setStep(0)
  }

  const stepSummaries = [
    state.size ? sizeLabel(state.size) : undefined,
    state.flavour ? getFlavour(state.flavour).name : undefined,
    FROSTINGS.find((f) => f.id === state.frosting)?.name,
    config ? addOnsSummary(state) : undefined,
    state.bannerOn ? `“${state.bannerText}”` : 'No banner',
    state.pet.name || undefined,
  ]

  const isLast = step === STEPS.length - 1
  const nextDisabled = step >= reachable && !isLast

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {gift ? (
          <p className="mb-8 max-w-2xl rounded-[2px] border-l-2 border-blush bg-linen/70 px-5 py-4 text-[0.9375rem]">
            <strong className="font-semibold text-oxblood">You’re gifting a Pup-cake.</strong> Build the cake, then tell us who it’s
            for. Their pet’s details and your note go into the WhatsApp message.
          </p>
        ) : null}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 pb-36 lg:grid-cols-[13rem_minmax(0,1fr)_21rem] lg:gap-12 lg:pb-24" data-builder>
          <aside className="-mx-4 min-w-0 border-y hairline px-4 py-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:border-0 lg:p-0">
            <div className="lg:sticky lg:top-24">
              <Stepper
                steps={STEPS.map((s, i) => ({ ...s, summary: stepSummaries[i] }))}
                current={step}
                reachable={reachable}
                onSelect={goTo}
              />
            </div>
          </aside>

          <section aria-labelledby="builder-step-title" className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="label">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h2 id="builder-step-title" ref={headingRef} tabIndex={-1} className="mt-3 text-title outline-none">
                  {STEP_TITLES[step]}
                </h2>
                <div className="mt-8">
                  {step === 0 ? <SizeStep state={state} onChange={(size) => patch({ size, face: state.face })} /> : null}
                  {step === 1 && state.size ? <FlavourStep state={state} size={state.size} onChange={(flavour) => patch({ flavour })} /> : null}
                  {step === 2 ? <FrostingStep value={state.frosting} onChange={(frosting) => patch({ frosting })} /> : null}
                  {step === 3 && state.size ? <TouchesStep state={state} size={state.size} patch={patch} /> : null}
                  {step === 4 && state.size ? <BannerStep state={state} size={state.size} patch={patch} petName={pawfile?.name} /> : null}
                  {step === 5 ? (
                    <PetStep state={state} gift={gift} patch={patch} patchPet={patchPet} hasPawfile={Boolean(pawfile)} />
                  ) : null}
                </div>
              </m.div>
            </AnimatePresence>

            <div className="mt-10 hidden items-center justify-between gap-4 border-t hairline pt-6 lg:flex">
              <Button variant="ghost" onClick={() => goTo(step - 1)} disabled={step === 0}>
                Back
              </Button>
              {isLast ? null : (
                <Button onClick={() => goTo(step + 1)} disabled={nextDisabled} arrow>
                  Next: {STEPS[step + 1].label}
                </Button>
              )}
            </div>
          </section>

          <aside aria-label="Your cake" className="hidden lg:block">
            <div className="sticky top-24">
              <Summary state={state} breakdown={breakdown} gift={gift} />
              <div className="mt-5">
                <Button onClick={add} disabled={!canAdd} size="lg" className="w-full" magnetic>
                  Add to bag
                </Button>
                {!canAdd ? <p className="mt-3 text-sm text-muted">{missingHint(state, gift)}</p> : null}
                {added ? (
                  <p role="status" className="mt-3 text-sm text-veg">
                    Added to your bag.{' '}
                    <button type="button" onClick={reset} className="font-semibold text-oxblood underline underline-offset-4">
                      Build another cake
                    </button>
                  </p>
                ) : null}
                <p className="mt-4 text-xs leading-relaxed text-muted">{PAYMENT_RULE}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile action bar */}
        <div
          data-builder-bar
          className="fixed inset-x-0 bottom-0 z-30 border-t hairline bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="label !text-[0.625rem]">Your cake</p>
              <p className="price text-xl text-oxblood" aria-live="polite">
                {breakdown ? formatINR(breakdown.total) : '—'}
              </p>
            </div>
            {step > 0 ? (
              <Button variant="secondary" onClick={() => goTo(step - 1)} aria-label="Back">
                Back
              </Button>
            ) : null}
            {isLast ? (
              <Button onClick={add} disabled={!canAdd}>
                Add to bag
              </Button>
            ) : (
              <Button onClick={() => goTo(step + 1)} disabled={nextDisabled}>
                Next
              </Button>
            )}
          </div>
          {isLast && !canAdd ? <p className="mx-auto mt-2 max-w-xl text-xs text-muted">{missingHint(state, gift)}</p> : null}
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}

const STEP_TITLES = [
  'Choose the size',
  'Choose the flavour',
  'Choose the frosting',
  'The finishing touches',
  'A name on the banner',
  'Who is it for?',
]

function addOnsSummary(s: BuilderState) {
  const parts = [...s.toppings.map((t) => addOnsForSize(s.size!).find((a) => a.id === t)!.name)]
  if (s.face !== 'none') parts.push(s.face === 'mini-face' ? 'Mini Face' : 'Full Face')
  return parts.length ? parts.join(', ') : 'None'
}

function missingHint(s: BuilderState, gift: boolean) {
  if (!s.size) return 'Choose a size to begin.'
  if (!s.flavour) return 'Choose a flavour.'
  if (s.bannerOn && !s.bannerText.trim()) return 'Add the name for the banner, or remove the banner.'
  if (gift && !s.gift.recipientName.trim()) return 'Add who the gift is for.'
  if (!s.pet.name.trim()) return 'Add the pet’s name in the last step.'
  return ''
}

/* ── Steps ─────────────────────────────────────────────────────────────── */

function SizeStep({ state, onChange }: { state: BuilderState; onChange: (s: CakeSize) => void }) {
  const flavour = state.flavour ?? 'going-bananas'
  return (
    <RadioCards
      legend="Cake size"
      hideLegend
      name="size"
      value={state.size}
      onChange={onChange}
      options={CAKE_SIZES.map((s) => ({
        value: s.id,
        label: s.id === 'bone-one-kg' ? 'Bone-shaped 1 kg' : s.id === 'mini' ? 'Special Mini' : s.weight,
        description:
          s.id === 'mini'
            ? '250–300 g, all nine flavours'
            : s.id === 'bone-one-kg'
              ? 'Shaped like a bone. Made only at 1 kg.'
              : s.id === 'one-kg'
                ? 'For a bigger guest list'
                : 'Our classic celebration cake',
        meta: state.flavour ? formatINR(cakeBasePrice(s.id, flavour)) : `from ${formatINR(cakeBasePrice(s.id, 'going-bananas'))}`,
      }))}
    />
  )
}

function FlavourStep({ state, size, onChange }: { state: BuilderState; size: CakeSize; onChange: (f: FlavourId) => void }) {
  return (
    <RadioCards
      legend={`Flavour for your ${sizeLabel(size)}`}
      hideLegend
      name="flavour"
      columns={1}
      value={state.flavour}
      onChange={onChange}
      options={FLAVOURS.map((f) => ({
        value: f.id,
        label: (
          <span className="inline-flex items-center gap-2">
            <span className="italic">{f.name}</span>
            <DietMark diet={f.diet} showLabel={false} />
          </span>
        ),
        description: f.note,
        meta: formatINR(cakeBasePrice(size, f.id)),
        flag: <PawfileFlavourFlag flavour={f.id} />,
      }))}
    />
  )
}

function FrostingStep({ value, onChange }: { value: FrostingId; onChange: (f: FrostingId) => void }) {
  return (
    <>
      <RadioCards
        legend="Frosting"
        hideLegend
        name="frosting"
        columns={1}
        value={value}
        onChange={onChange}
        options={FROSTINGS.map((f) => ({ value: f.id, label: f.name, description: f.description, meta: 'Included' }))}
      />
      <p className="mt-6 max-w-xl rounded-[2px] border-l-2 border-blush bg-linen/70 px-5 py-4 text-[0.9375rem]">{FACTS.allergies}</p>
    </>
  )
}

function TouchesStep({ state, size, patch }: { state: BuilderState; size: CakeSize; patch: (p: Partial<BuilderState>) => void }) {
  const list = addOnsForSize(size)
  const price = (id: string) => formatINR(list.find((a) => a.id === id)!.price)
  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Toppings & design</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {TOPPINGS.map((t) => (
            <CheckCard
              key={t}
              label={list.find((a) => a.id === t)!.name}
              meta={`+${price(t)}`}
              checked={state.toppings.includes(t)}
              onChange={(on) => patch({ toppings: on ? [...state.toppings, t] : state.toppings.filter((x) => x !== t) })}
            />
          ))}
        </div>
      </fieldset>
      <RadioCards
        legend="A face on the cake"
        hint="Choose one: a mini face or a full face cake."
        name="face"
        value={state.face}
        columns={3}
        onChange={(face) => patch({ face })}
        options={[
          { value: 'none', label: 'No face', meta: '—' },
          { value: 'mini-face', label: 'Mini Face', meta: `+${price('mini-face')}` },
          { value: 'full-face', label: 'Full Face Cake', meta: `+${price('full-face')}` },
        ]}
      />
      <p className="text-sm text-muted">{FACTS.customisation} Tell us your idea in the order notes.</p>
    </div>
  )
}

function BannerStep({
  state,
  size,
  patch,
  petName,
}: {
  state: BuilderState
  size: CakeSize
  patch: (p: Partial<BuilderState>) => void
  petName?: string
}) {
  const price = addOnsForSize(size).find((a) => a.id === 'name-banner')!.price
  const suggestion = `Happy Birthday ${petName || state.pet.name || ''}`.trim()
  return (
    <div className="max-w-xl space-y-6">
      <CheckCard
        label="Add a Name Banner"
        description="Your words, on a banner across the cake."
        meta={`+${formatINR(price)}`}
        checked={state.bannerOn}
        onChange={(bannerOn) => patch({ bannerOn })}
      />
      {state.bannerOn ? (
        <>
          <TextField
            label="Banner text"
            value={state.bannerText}
            maxLength={BANNER_MAX}
            placeholder="e.g. Happy Birthday Bruno"
            hint={`${state.bannerText.length}/${BANNER_MAX} characters`}
            error={state.bannerOn && !state.bannerText.trim() ? 'Add the name for the banner.' : null}
            onChange={(e) => patch({ bannerText: e.target.value })}
            autoComplete="off"
          />
          {suggestion !== 'Happy Birthday' && state.bannerText !== suggestion ? (
            <button type="button" onClick={() => patch({ bannerText: suggestion })} className="text-sm font-semibold text-oxblood underline underline-offset-4">
              Use “{suggestion}”
            </button>
          ) : null}
        </>
      ) : (
        <p className="text-muted">No banner? No problem. You can skip this step.</p>
      )}
    </div>
  )
}

function PetStep({
  state,
  gift,
  patch,
  patchPet,
  hasPawfile,
}: {
  state: BuilderState
  gift: boolean
  patch: (p: Partial<BuilderState>) => void
  patchPet: (p: Partial<PetDetails>) => void
  hasPawfile: boolean
}) {
  const flavour = state.flavour ? getFlavour(state.flavour) : null
  const clash = flavour?.proteins.filter((p) => state.pet.allergies.includes(p)) ?? []
  return (
    <div className="max-w-xl space-y-7">
      {gift ? (
        <>
          <p className="rounded-[2px] border-l-2 border-blush bg-linen/70 px-5 py-4 text-[0.9375rem]">
            Gifting a Pup-cake: tell us who it&rsquo;s for. We&rsquo;ll add these details and your note to the WhatsApp message.
          </p>
          <TextField
            label="Gift for (their name)"
            value={state.gift.recipientName}
            onChange={(e) => patch({ gift: { ...state.gift, recipientName: e.target.value } })}
            autoComplete="off"
          />
        </>
      ) : null}
      <TextField
        label={gift ? 'Their pet’s name' : 'Your pet’s name'}
        value={state.pet.name}
        onChange={(e) => patchPet({ name: e.target.value })}
        autoComplete="off"
        hint={!gift && hasPawfile ? 'Filled in from your Pawfile.' : undefined}
      />
      <RadioCards<Species>
        legend="Dog or cat?"
        name="species"
        value={state.pet.species}
        onChange={(species) => patchPet({ species })}
        options={[
          { value: 'dog', label: 'Dog' },
          { value: 'cat', label: 'Cat', description: 'Cakes for cats: we’ll confirm on WhatsApp.' },
        ]}
      />
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Food allergies</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {PROTEINS.map((p) => (
            <CheckCard
              key={p}
              label={`${p[0].toUpperCase()}${p.slice(1)}`}
              checked={state.pet.allergies.includes(p)}
              onChange={(on) => patchPet({ allergies: on ? [...state.pet.allergies, p] : state.pet.allergies.filter((x) => x !== p) })}
            />
          ))}
        </div>
      </fieldset>
      {clash.length ? (
        <AllergyFlag>
          {flavour!.name} contains {clash.map(proteinLabel).join(' and ')}. Please choose another flavour.
        </AllergyFlag>
      ) : null}
      <TextArea
        label="Any other allergies or notes"
        optional
        value={state.pet.allergyNotes}
        onChange={(e) => patchPet({ allergyNotes: e.target.value })}
        hint="Shared with the bakery in your WhatsApp message."
        rows={3}
      />
      {gift ? (
        <>
          <TextArea
            label="Gift note"
            optional
            maxLength={200}
            value={state.gift.note}
            onChange={(e) => patch({ gift: { ...state.gift, note: e.target.value } })}
            hint={`${state.gift.note.length}/200`}
            rows={3}
          />
          <TextField
            label="From (your name)"
            optional
            value={state.gift.senderName}
            onChange={(e) => patch({ gift: { ...state.gift, senderName: e.target.value } })}
            autoComplete="name"
          />
        </>
      ) : (
        <CheckCard
          label="Save as my Pawfile"
          description="Kept only on this device. It pre-fills future orders and flags menu items that clash with allergies."
          checked={state.savePawfile}
          onChange={(savePawfile) => patch({ savePawfile })}
        />
      )}
    </div>
  )
}

/* ── Summary ───────────────────────────────────────────────────────────── */

function Summary({ state, breakdown, gift }: { state: BuilderState; breakdown: ReturnType<typeof priceCake> | null; gift: boolean }) {
  return (
    <div className="bg-linen/70 p-6 ring-1 ring-hairline">
      <p className="label text-center">{gift ? 'Your gift' : 'Your cake'}</p>
      <p className="mt-2 text-center font-display text-2xl italic text-oxblood">
        {state.pet.name ? `for ${state.pet.name}` : 'in the making'}
      </p>
      <div className="mt-5 border-t border-dashed border-field/60 pt-4 text-[0.9375rem]">
        {breakdown ? (
          <dl className="space-y-2">
            {[breakdown.base, ...breakdown.extras].map((l) => (
              <div key={l.label} className="flex justify-between gap-3">
                <dt>{l.label}</dt>
                <dd className="price">{formatINR(l.amount)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 text-muted">
              <dt>Frosting: {FROSTINGS.find((f) => f.id === state.frosting)!.name}</dt>
              <dd>incl.</dd>
            </div>
            {state.bannerOn && state.bannerText.trim() ? (
              <div className="text-muted">
                <dt className="sr-only">Banner</dt>
                <dd className="font-display italic">“{state.bannerText.trim()}”</dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="text-muted">{state.size ? 'Now choose a flavour.' : 'Choose a size to begin.'}</p>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-field/60 pt-4">
        <span className="font-display text-xl text-oxblood">Total</span>
        <span className="price text-2xl text-oxblood" aria-live="polite" data-testid="builder-total">
          {breakdown ? formatINR(breakdown.total) : '—'}
        </span>
      </div>
    </div>
  )
}
