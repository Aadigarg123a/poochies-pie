'use client'

import Link from 'next/link'
import { Drawer } from '@/components/ui/Drawer'
import { formatINR } from '@/lib/format'
import { priceLine } from '@/lib/pricing'
import { cartTotal, useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen)
  const close = useUIStore((s) => s.closeCart)
  const lines = useCartStore((s) => s.lines)

  return (
    <Drawer open={open} onClose={close} title="Your bag">
      {lines.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-display text-2xl text-oxblood">Your bag is empty.</p>
          <p className="mt-2 text-muted">Every cake is baked to order.</p>
          <Link href="/atelier" onClick={close} className="mt-6 inline-block underline underline-offset-4">
            Build a cake in the Atelier
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-hairline">
          {lines.map((line) => {
            const p = priceLine(line.config)
            return (
              <li key={line.id} className="flex justify-between gap-4 py-4">
                <span>{p.base.label}</span>
                <span className="price">{formatINR(p.total * line.quantity)}</span>
              </li>
            )
          })}
          <li className="flex justify-between py-4 font-semibold">
            <span>Total</span>
            <span className="price">{formatINR(cartTotal(lines))}</span>
          </li>
        </ul>
      )}
    </Drawer>
  )
}
