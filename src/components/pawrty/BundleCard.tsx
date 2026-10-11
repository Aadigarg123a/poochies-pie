'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Field'
import { Todo } from '@/components/ui/Todo'
import { FLAGS } from '@/config/flags'
import type { Bundle } from '@/data/bundles'
import { FLAVOURS, SHARED_FLAVOUR_IDS, getFlavour, type FlavourId, type SharedFlavourId } from '@/data/menu'
import { describeLine } from '@/lib/describe'
import { formatINR } from '@/lib/format'
import type { CakeConfig, ItemConfig, LineConfig, PackConfig } from '@/lib/pricing'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'

const flavourLabel = (id: FlavourId) => {
  const f = getFlavour(id)
  return `${f.name} (${f.diet === 'veg' ? 'Veg' : 'Non-veg'})`
}

/** A Pawrty set: the total is the plain sum of the menu prices of its parts. */
export function BundleCard({ bundle, index }: { bundle: Bundle; index: number }) {
  const [parts, setParts] = useState<LineConfig[]>(() => bundle.parts.map((p) => p.config))
  const [added, setAdded] = useState(false)
  const add = useCartStore((s) => s.add)
  const openCart = useUIStore((s) => s.openCart)

  const update = (i: number, config: LineConfig) => {
    setAdded(false)
    setParts((ps) => ps.map((p, j) => (j === i ? config : p)))
  }
  const lines = parts.map(describeLine)
  const total = lines.reduce((n, l) => n + l.unitTotal, 0)

  return (
    <article id={bundle.id} aria-labelledby={`${bundle.id}-title`} className="scroll-mt-24 border-t border-oxblood pt-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <p className="label">Set {['I', 'II', 'III'][index] ?? index + 1} · {bundle.strapline}</p>
          <h2 id={`${bundle.id}-title`} className="mt-3 font-display text-4xl italic text-oxblood sm:text-5xl">
            {bundle.name}
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">{bundle.description}</p>
          <div className="mt-8 grid max-w-md gap-5">
            {bundle.parts.map((part, i) => {
              const config = parts[i]
              if (part.role === 'cake' && config.kind === 'cake') {
                return (
                  <div key={part.id} className="grid gap-4 sm:grid-cols-2">
                    {bundle.id === 'gala' ? (
                      <Select
                        label="Cake"
                        value={config.size}
                        onChange={(e) => update(i, { ...config, size: e.target.value as CakeConfig['size'] })}
                        options={[
                          { value: 'one-kg', label: '1 kg round' },
                          { value: 'bone-one-kg', label: 'Bone-shaped 1 kg' },
                        ]}
                      />
                    ) : null}
                    <Select
                      label="Cake flavour"
                      value={config.flavour}
                      onChange={(e) => update(i, { ...config, flavour: e.target.value as FlavourId })}
                      options={FLAVOURS.map((f) => ({ value: f.id, label: flavourLabel(f.id) }))}
                    />
                  </div>
                )
              }
              if (part.role === 'bandana' && config.kind === 'item') {
                return (
                  <Select
                    key={part.id}
                    label="Birthday bandana size"
                    value={config.variantId}
                    onChange={(e) => update(i, { ...(config as ItemConfig), variantId: e.target.value })}
                    options={[
                      { value: 'small', label: 'Small' },
                      { value: 'medium-large', label: 'Medium-Large' },
                    ]}
                  />
                )
              }
              if (part.role === 'guests' && config.kind === 'cupcakes') {
                return (
                  <Select
                    key={part.id}
                    label="Guest cupcakes flavour"
                    value={config.flavour}
                    onChange={(e) => update(i, { ...(config as PackConfig), flavour: e.target.value as SharedFlavourId })}
                    options={SHARED_FLAVOUR_IDS.map((id) => ({ value: id, label: flavourLabel(id) }))}
                  />
                )
              }
              return null
            })}
          </div>
        </div>

        <div className="bg-linen/70 p-6 ring-1 ring-hairline sm:p-8">
          <p className="label text-center">The set</p>
          <dl className="mt-5 space-y-3 text-[0.9375rem]">
            {lines.map((l, i) => (
              <div key={bundle.parts[i].id} className="flex justify-between gap-4">
                <dt>{l.title}</dt>
                <dd className="price shrink-0">{formatINR(l.unitTotal)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-field/60 pt-4">
            <span className="font-display text-xl text-oxblood">Total</span>
            <span className="price text-2xl text-oxblood" aria-live="polite">
              {formatINR(total)}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">The plain sum of our menu prices.</p>
          {FLAGS.bundleDiscountPercent === null ? (
            <div className="mt-3">
              <Todo>is there a Pawrty set discount? (Off until you confirm.)</Todo>
            </div>
          ) : null}
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => {
              parts.forEach((p) => add(p))
              setAdded(true)
              openCart()
            }}
          >
            Add the set to your bag
          </Button>
          {added ? (
            <p role="status" className="mt-3 text-sm text-veg">
              Added: {parts.length} items.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
