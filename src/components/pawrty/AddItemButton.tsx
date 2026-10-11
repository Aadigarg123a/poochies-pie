'use client'

import { useState } from 'react'
import { CheckIcon, PlusIcon } from '@/components/ui/icons'
import type { ItemConfig } from '@/lib/pricing'
import { useCartStore } from '@/stores/cart'

/** Small "Add" button for a single menu variant (accessories, simple treats). */
export function AddItemButton({ config, label }: { config: ItemConfig; label: string }) {
  const add = useCartStore((s) => s.add)
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        add(config)
        setDone(true)
        setTimeout(() => setDone(false), 1800)
      }}
      className="relative inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-oxblood px-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-oxblood transition-colors hover:bg-oxblood hover:text-cream"
    >
      {done ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
      <span aria-live="polite">{done ? 'Added' : 'Add'}</span>
      <span className="sr-only"> {label} to your bag</span>
    </button>
  )
}
