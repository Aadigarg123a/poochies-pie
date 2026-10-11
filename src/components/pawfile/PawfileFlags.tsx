'use client'

import { AllergyFlag } from '@/components/ui/Badges'
import { getProduct, type FlavourId } from '@/data/menu'
import { flavourConflicts, productConflicts } from '@/lib/pawfile'
import { usePawfileStore } from '@/stores/pawfile'

/** Flags a product that conflicts with the saved Pawfile (renders nothing without one). */
export function PawfileProductFlags({ slug }: { slug: string }) {
  const pawfile = usePawfileStore((s) => s.pawfile)
  const product = getProduct(slug)
  if (!pawfile || !product) return null
  const conflicts = productConflicts(product, pawfile)
  if (!conflicts.length) return null
  return (
    <span className="relative z-10 flex flex-wrap gap-2" data-testid="pawfile-flag">
      {conflicts.map((c) => (
        <AllergyFlag key={c.message}>{c.message}</AllergyFlag>
      ))}
    </span>
  )
}

export function PawfileFlavourFlag({ flavour }: { flavour: FlavourId }) {
  const pawfile = usePawfileStore((s) => s.pawfile)
  const conflicts = flavourConflicts(flavour, pawfile)
  if (!conflicts.length) return null
  return (
    <span data-testid="pawfile-flag">
      <AllergyFlag>{conflicts[0].message}</AllergyFlag>
    </span>
  )
}
