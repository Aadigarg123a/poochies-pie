'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { RadioCards } from '@/components/ui/Choice'
import { DietMark } from '@/components/ui/Badges'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { PawfileFlavourFlag } from '@/components/pawfile/PawfileFlags'
import { PAYMENT_RULE } from '@/config/ordering'
import { SHARED_FLAVOUR_IDS, getFlavour, getProduct, type SharedFlavourId } from '@/data/menu'
import { formatINR } from '@/lib/format'
import { priceLine, type ItemConfig, type LineConfig, type PackConfig } from '@/lib/pricing'
import { MAX_QUANTITY, useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'

/** Add-to-bag for Dognuts, Cupcakes, treats and accessories (cakes use the Atelier). */
export function ProductConfigurator({ slug }: { slug: string }) {
  const product = getProduct(slug)!
  const add = useCartStore((s) => s.add)
  const openCart = useUIStore((s) => s.openCart)
  const [qty, setQty] = useState(1)

  const [pack, setPack] = useState<PackConfig | null>(() =>
    product.kind === 'dognuts' || product.kind === 'cupcakes'
      ? { kind: product.kind, count: product.packs[0].count, flavour: SHARED_FLAVOUR_IDS[0], faces: 0 }
      : null,
  )
  const [item, setItem] = useState<ItemConfig | null>(() =>
    product.kind === 'treat' || product.kind === 'accessory'
      ? { kind: 'item', slug, variantId: product.variants[0].id, option: product.options?.values[0] }
      : null,
  )

  const config: LineConfig | null = pack ?? item
  if (!config) return null
  const price = priceLine(config)

  return (
    <div className="space-y-8">
      {pack && (product.kind === 'dognuts' || product.kind === 'cupcakes') ? (
        <>
          <RadioCards
            legend={product.packLabel}
            name={`${slug}-pack`}
            value={String(pack.count)}
            columns={product.packs.length === 3 ? 3 : 2}
            onChange={(v) => setPack({ ...pack, count: Number(v), faces: Math.min(pack.faces ?? 0, Number(v)) })}
            options={product.packs.map((p) => ({
              value: String(p.count),
              label: `${product.packLabel} of ${p.count}`,
              description: `Veg ${formatINR(p.veg)} · Non-veg ${formatINR(p.nonVeg)}`,
            }))}
          />
          <RadioCards<SharedFlavourId>
            legend="Flavour"
            name={`${slug}-flavour`}
            value={pack.flavour}
            onChange={(flavour) => setPack({ ...pack, flavour })}
            options={SHARED_FLAVOUR_IDS.map((id) => {
              const f = getFlavour(id)
              return {
                value: id,
                label: (
                  <span className="inline-flex items-center gap-2">
                    <span className="italic">{f.name}</span>
                    <DietMark diet={f.diet} showLabel={false} />
                  </span>
                ),
                flag: <PawfileFlavourFlag flavour={id} />,
              }
            })}
          />
          {product.kind === 'cupcakes' && product.facePerPiece ? (
            <div>
              <p className="mb-2 text-sm font-semibold">Faces</p>
              <div className="flex flex-wrap items-center gap-4">
                <QuantityStepper
                  value={pack.faces ?? 0}
                  min={0}
                  max={pack.count}
                  onChange={(faces) => setPack({ ...pack, faces })}
                  label="Number of cupcakes with a face"
                />
                <p className="text-sm text-muted">+{formatINR(product.facePerPiece)} for each face add-on (per cupcake)</p>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {item && (product.kind === 'treat' || product.kind === 'accessory') ? (
        <>
          {product.variants.length > 1 ? (
            <RadioCards
              legend={product.kind === 'accessory' ? 'Size' : 'Choose'}
              name={`${slug}-variant`}
              value={item.variantId}
              onChange={(variantId) => setItem({ ...item, variantId })}
              options={product.variants.map((v) => ({ value: v.id, label: v.name, meta: formatINR(v.price) }))}
            />
          ) : null}
          {product.options ? (
            <RadioCards
              legend={product.options.label}
              name={`${slug}-option`}
              value={item.option ?? null}
              onChange={(option) => setItem({ ...item, option })}
              options={product.options.values.map((v) => ({ value: v, label: v }))}
            />
          ) : null}
        </>
      ) : null}

      <div className="border-t hairline pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <QuantityStepper value={qty} max={MAX_QUANTITY} onChange={setQty} label={`Quantity of ${product.name}`} />
          <p className="price text-3xl text-oxblood" aria-live="polite">
            {formatINR(price.total * qty)}
          </p>
        </div>
        {price.extras.length ? (
          <p className="mt-2 text-right text-sm text-muted">
            {formatINR(price.base.amount)} + {price.extras.map((e) => `${e.label} ${formatINR(e.amount)}`).join(' + ')}
            {qty > 1 ? ` (× ${qty})` : ''}
          </p>
        ) : null}
        <Button
          size="lg"
          className="mt-5 w-full"
          magnetic
          onClick={() => {
            add(config, qty)
            openCart()
          }}
        >
          Add to bag
        </Button>
        <p className="mt-3 text-xs text-muted">{PAYMENT_RULE}</p>
      </div>
    </div>
  )
}
